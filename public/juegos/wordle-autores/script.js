(() => {
  "use strict";

  const INTENTOS = 6;
  const FILAS_TECLADO = [
    "QWERTYUIOP".split(""),
    "ASDFGHJKLÑ".split(""),
    ["ENTER", ..."ZXCVBNM".split(""), "BORRAR"],
  ];

  const $ = (sel) => document.querySelector(sel);
  const tablero = $("#tablero");
  const teclado = $("#teclado");
  const datoAutor = $("#datoAutor");
  const setup = $("#setup");
  const game = $("#game");
  const accionesFin = $("#accionesFin");
  const selloCorrecto = $("#selloCorrecto");
  const selloIncorrecto = $("#selloIncorrecto");

  let autores = [];
  let objetivo = "";
  let objetivoInfo = null;
  let filaActual = 0;
  let letraActual = 0;
  let intentosGuardados = [];
  let estadosTeclado = {};
  let juegoTerminado = false;
  let modo = null; // 'diario' | 'practica'
  let esReplay = false; // reto diario ya jugado hoy: no cuenta para estadísticas

  const LS_KEY = "jl_wordle_autores_v1";

  function cargarEstado() {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; }
    catch { return {}; }
  }
  function guardarEstado(estado) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(estado)); } catch {}
  }

  function normaliza(str) {
    return str.toUpperCase()
      .replace(/[ÁÀÄ]/g, "A").replace(/[ÉÈË]/g, "E")
      .replace(/[ÍÌÏ]/g, "I").replace(/[ÓÒÖ]/g, "O")
      .replace(/[ÚÙÜ]/g, "U");
    // Ñ se conserva a propósito: es letra propia del teclado en español.
  }

  function fechaSemilla() {
    const hoy = new Date();
    return `${hoy.getFullYear()}${hoy.getMonth()}${hoy.getDate()}`;
  }

  function hashSemilla(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
    return h;
  }

  async function init() {
    JL.injectTopbar();
    const res = await fetch("autores.json");
    autores = await res.json();

    $("#btnDiario").addEventListener("click", () => iniciarPartida("diario"));
    $("#btnPractica").addEventListener("click", () => iniciarPartida("practica"));
    $("#btnCompartir").addEventListener("click", compartirResultado);
    $("#btnOtra").addEventListener("click", () => iniciarPartida("practica"));
    document.addEventListener("keydown", manejarTecladoFisico); // una sola vez

    actualizarMarcador();
  }

  function elegirAutorDiario() {
    const idx = hashSemilla(fechaSemilla()) % autores.length;
    return autores[idx];
  }

  function elegirAutorAleatorio() {
    return autores[Math.floor(Math.random() * autores.length)];
  }

  function iniciarPartida(nuevoModo) {
    modo = nuevoModo;
    const est = cargarEstado();
    esReplay = modo === "diario" && est.ultimoDiaJugado === fechaSemilla();

    objetivoInfo = modo === "diario" ? elegirAutorDiario() : elegirAutorAleatorio();
    objetivo = normaliza(objetivoInfo.apellido);
    filaActual = 0;
    letraActual = 0;
    intentosGuardados = [];
    estadosTeclado = {};
    juegoTerminado = false;

    setup.style.display = "none";
    game.style.display = "block";
    accionesFin.hidden = true;
    datoAutor.hidden = true;
    $("#btnOtra").style.display = modo === "practica" ? "" : "none";
    ocultarSellos();

    construirTablero();
    construirTeclado();
  }

  function construirTablero() {
    tablero.innerHTML = "";
    tablero.style.gridTemplateRows = `repeat(${INTENTOS}, 1fr)`;
    for (let f = 0; f < INTENTOS; f++) {
      const fila = document.createElement("div");
      fila.className = "tablero__fila";
      for (let c = 0; c < objetivo.length; c++) {
        const casilla = document.createElement("div");
        casilla.className = "casilla";
        casilla.dataset.fila = f;
        casilla.dataset.col = c;
        fila.appendChild(casilla);
      }
      tablero.appendChild(fila);
    }
  }

  function construirTeclado() {
    teclado.innerHTML = "";
    FILAS_TECLADO.forEach((filaTeclas) => {
      const filaEl = document.createElement("div");
      filaEl.className = "teclado__fila";
      filaTeclas.forEach((t) => {
        const btn = document.createElement("button");
        btn.className = "tecla" + (t.length > 1 ? " tecla--ancha" : "");
        btn.textContent = t === "BORRAR" ? "⌫" : t === "ENTER" ? "Enter" : t;
        btn.dataset.tecla = t;
        btn.addEventListener("click", () => manejarTecla(t));
        filaEl.appendChild(btn);
      });
      teclado.appendChild(filaEl);
    });
  }

  function manejarTecladoFisico(e) {
    if (juegoTerminado || game.style.display === "none") return;
    if (e.key === "Enter") return manejarTecla("ENTER");
    if (e.key === "Backspace") return manejarTecla("BORRAR");
    const letra = normaliza(e.key);
    if (/^[A-ZÑ]$/.test(letra) && letra.length === 1) manejarTecla(letra);
  }

  function manejarTecla(t) {
    if (juegoTerminado) return;
    if (t === "BORRAR") return borrarLetra();
    if (t === "ENTER") return enviarIntento();
    if (letraActual >= objetivo.length) return;

    const casilla = tablero.querySelector(`[data-fila="${filaActual}"][data-col="${letraActual}"]`);
    casilla.textContent = t;
    casilla.classList.add("rellena");
    letraActual++;
  }

  function borrarLetra() {
    if (letraActual === 0) return;
    letraActual--;
    const casilla = tablero.querySelector(`[data-fila="${filaActual}"][data-col="${letraActual}"]`);
    casilla.textContent = "";
    casilla.classList.remove("rellena");
  }

  function enviarIntento() {
    if (letraActual < objetivo.length) return; // intento incompleto

    const letras = [];
    for (let c = 0; c < objetivo.length; c++) {
      letras.push(tablero.querySelector(`[data-fila="${filaActual}"][data-col="${c}"]`).textContent);
    }
    const intento = letras.join("");
    const resultado = evaluarIntento(intento);
    intentosGuardados.push({ intento, resultado });
    pintarFila(filaActual, resultado, intento);

    filaActual++;
    letraActual = 0;

    const gano = intento === objetivo;
    const seAcabaron = filaActual >= INTENTOS;

    setTimeout(() => {
      if (gano) terminarPartida(true);
      else if (seAcabaron) terminarPartida(false);
    }, objetivo.length * 90 + 150);
  }

  function evaluarIntento(intento) {
    const resultado = new Array(objetivo.length).fill("ausente");
    const restante = objetivo.split("");

    for (let i = 0; i < objetivo.length; i++) {
      if (intento[i] === objetivo[i]) {
        resultado[i] = "correcta";
        restante[i] = null;
      }
    }
    for (let i = 0; i < objetivo.length; i++) {
      if (resultado[i] === "correcta") continue;
      const pos = restante.indexOf(intento[i]);
      if (pos !== -1) {
        resultado[i] = "presente";
        restante[pos] = null;
      }
    }
    return resultado;
  }

  function pintarFila(fila, resultado, intento) {
    for (let c = 0; c < objetivo.length; c++) {
      const casilla = tablero.querySelector(`[data-fila="${fila}"][data-col="${c}"]`);
      setTimeout(() => {
        casilla.classList.add("voltea");
        casilla.classList.add(resultado[c]);
        actualizarTecla(intento[c], resultado[c]);
      }, c * 90);
    }
  }

  function actualizarTecla(letra, estado) {
    const prioridad = { ausente: 0, presente: 1, correcta: 2 };
    if (!estadosTeclado[letra] || prioridad[estado] > prioridad[estadosTeclado[letra]]) {
      estadosTeclado[letra] = estado;
      const btn = teclado.querySelector(`[data-tecla="${letra}"]`);
      if (btn) {
        btn.classList.remove("correcta", "presente", "ausente");
        btn.classList.add(estado);
      }
    }
  }

  function terminarPartida(gano) {
    juegoTerminado = true;
    mostrarSello(gano);
    datoAutor.hidden = false;
    datoAutor.textContent = `${objetivoInfo.apellido} — ${objetivoInfo.dato}`;
    accionesFin.hidden = false;
    $("#btnCompartir").hidden = modo !== "diario";

    if (!esReplay) {
      const estado = cargarEstado();
      estado.jugadas = (estado.jugadas || 0) + 1;
      estado.aciertos = (estado.aciertos || 0) + (gano ? 1 : 0);
      if (modo === "diario") {
        estado.racha = gano ? (estado.racha || 0) + 1 : 0;
        estado.ultimoDiaJugado = fechaSemilla();
        estado.diarioResultado = { gano, intentos: intentosGuardados.length };
      }
      guardarEstado(estado);
    }
    actualizarMarcador();
  }

  function mostrarSello(gano) {
    (gano ? selloCorrecto : selloIncorrecto).classList.add("activo");
  }
  function ocultarSellos() {
    selloCorrecto.classList.remove("activo");
    selloIncorrecto.classList.remove("activo");
  }

  function actualizarMarcador() {
    const estado = cargarEstado();
    $("#marcadorRacha").textContent = estado.racha || 0;
    $("#marcadorJugadas").textContent = estado.jugadas || 0;
    const pct = estado.jugadas ? Math.round((100 * (estado.aciertos || 0)) / estado.jugadas) : null;
    $("#marcadorPorcentaje").textContent = pct === null ? "—" : `${pct}%`;
  }

  function compartirResultado() {
    const emojiPorEstado = { correcta: "🟩", presente: "🟨", ausente: "⬛" };
    const lineas = intentosGuardados
      .map((r) => r.resultado.map((s) => emojiPorEstado[s]).join(""))
      .join("\n");
    const texto = `Wordle de Autores · JuegosLiterarios\n${intentosGuardados.length}/${INTENTOS}\n\n${lineas}\nhttps://juegosliterarios.com/juegos/wordle-autores/`;

    if (navigator.share) {
      navigator.share({ text: texto }).catch(() => copiarAlPortapapeles(texto));
    } else {
      copiarAlPortapapeles(texto);
    }
  }

  function copiarAlPortapapeles(texto) {
    navigator.clipboard?.writeText(texto);
    const btn = $("#btnCompartir");
    const original = btn.textContent;
    btn.textContent = "¡Copiado!";
    setTimeout(() => (btn.textContent = original), 1500);
  }

  // Gancho para pruebas automatizadas (no afecta el juego)
  window.__WA = { objetivo: () => objetivo, terminado: () => juegoTerminado };

  init();
})();
