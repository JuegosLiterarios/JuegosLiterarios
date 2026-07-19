(() => {
  "use strict";

  const RONDAS_POR_PARTIDA = 10;
  const LS_KEY = "jl_quien_es_quien_v1";
  const PUNTOS_POR_PISTAS = { 1: 40, 2: 30, 3: 20, 4: 10 };

  const $ = (sel) => document.querySelector(sel);
  const listaPistas = $("#listaPistas");
  const btnMasPistas = $("#btnMasPistas");
  const btnRendirse = $("#btnRendirse");
  const formaAdivinar = $("#formaAdivinar");
  const inputRespuesta = $("#inputRespuesta");
  const feedbackEl = $("#feedbackAdivinanza");
  const btnSiguiente = $("#btnSiguiente");
  const selloCorrecto = $("#selloCorrecto");
  const gameEl = $("#game");
  const resultEl = $("#result");

  let banco = [];
  let partida = [];
  let ronda = 0;
  let puntos = 0;
  let aciertos = 0;
  let actual = null;
  let pistasReveladas = 1;
  let resuelta = false;

  function cargarEstado() {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; }
    catch { return {}; }
  }
  function guardarEstado(e) { try { localStorage.setItem(LS_KEY, JSON.stringify(e)); } catch {} }

  function normaliza(str) {
    return str.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
  }

  // Acepta el nombre completo o un apellido/palabra significativa (4+ letras)
  function esRespuestaCorrecta(respuesta, nombre) {
    const r = normaliza(respuesta);
    const n = normaliza(nombre);
    if (!r) return false;
    if (r === n) return true;
    return n.split(/\s+/).some(palabra => palabra.length >= 4 && palabra === r);
  }

  async function init() {
    JL.injectTopbar();
    const res = await fetch("personajes.json");
    banco = await res.json();

    const datalist = $("#listaNombres");
    banco.forEach((p) => {
      const opt = document.createElement("option");
      opt.value = p.personaje;
      datalist.appendChild(opt);
    });

    btnMasPistas.addEventListener("click", revelarPista);
    btnRendirse.addEventListener("click", rendirse);
    formaAdivinar.addEventListener("submit", (e) => { e.preventDefault(); adivinar(); });
    btnSiguiente.addEventListener("click", siguienteRonda);
    $("#againBtn").addEventListener("click", () => {
      resultEl.style.display = "none";
      gameEl.style.display = "block";
      iniciarPartida();
    });

    actualizarMejorMarcador();
    iniciarPartida();
  }

  function iniciarPartida() {
    partida = JL.shuffle(banco).slice(0, Math.min(RONDAS_POR_PARTIDA, banco.length));
    ronda = 0;
    puntos = 0;
    aciertos = 0;
    $("#marcadorPuntos").textContent = 0;
    siguienteRonda();
  }

  function siguienteRonda() {
    ronda++;
    if (ronda > partida.length) return finPartida();

    $("#marcadorRonda").textContent = `${ronda}/${partida.length}`;
    actual = partida[ronda - 1];
    pistasReveladas = 1;
    resuelta = false;
    feedbackEl.hidden = true;
    feedbackEl.classList.remove("correcta");
    inputRespuesta.value = "";
    btnSiguiente.hidden = true;
    btnMasPistas.hidden = false;
    btnRendirse.hidden = false;
    formaAdivinar.style.display = "flex";
    selloCorrecto.classList.remove("activo");
    renderPistas();
    inputRespuesta.focus();
  }

  function renderPistas() {
    listaPistas.innerHTML = "";
    for (let i = 0; i < pistasReveladas; i++) {
      const li = document.createElement("li");
      li.className = "pista-item";
      li.innerHTML = `<span class="pista-item__num">${i + 1}.</span><span>${actual.pistas[i]}</span>`;
      listaPistas.appendChild(li);
    }
    btnMasPistas.disabled = pistasReveladas >= actual.pistas.length;
    btnMasPistas.textContent = btnMasPistas.disabled ? "No hay más pistas" : "🔍 Otra pista";
  }

  function revelarPista() {
    if (resuelta || pistasReveladas >= actual.pistas.length) return;
    pistasReveladas++;
    renderPistas();
  }

  function cerrarRonda(mensaje, correcta) {
    resuelta = true;
    feedbackEl.hidden = false;
    feedbackEl.classList.toggle("correcta", correcta);
    feedbackEl.textContent = mensaje;
    btnMasPistas.hidden = true;
    btnRendirse.hidden = true;
    btnSiguiente.hidden = false;
    btnSiguiente.textContent = ronda >= partida.length ? "Ver resultado →" : "Siguiente →";
  }

  function adivinar() {
    if (resuelta) return;
    const respuesta = inputRespuesta.value.trim();
    if (!respuesta) return;

    if (esRespuestaCorrecta(respuesta, actual.personaje)) {
      const ganados = PUNTOS_POR_PISTAS[pistasReveladas] || 10;
      puntos += ganados;
      aciertos++;
      $("#marcadorPuntos").textContent = puntos;
      selloCorrecto.classList.add("activo");
      cerrarRonda(`¡Era ${actual.personaje}! +${ganados} puntos.`, true);
    } else {
      feedbackEl.hidden = false;
      feedbackEl.classList.remove("correcta");
      feedbackEl.textContent = "No es ese personaje. Pide otra pista o inténtalo de nuevo.";
      inputRespuesta.select();
    }
  }

  function rendirse() {
    if (resuelta) return;
    cerrarRonda(`Era ${actual.personaje}. Sin puntos esta vez.`, false);
  }

  function finPartida() {
    gameEl.style.display = "none";
    resultEl.style.display = "block";

    const estado = cargarEstado();
    estado.partidas = (estado.partidas || 0) + 1;
    if (!estado.mejorPuntaje || puntos > estado.mejorPuntaje) estado.mejorPuntaje = puntos;
    guardarEstado(estado);
    actualizarMejorMarcador();

    const msg = puntos >= 350 ? "¡Un detective de la literatura! 🏆" :
                puntos >= 250 ? "Conoces bien a tus personajes 📚" :
                puntos >= 150 ? "Buen olfato literario 🌱" : "Los personajes te tendrán revancha";
    $("#resTitle").textContent = msg;
    $("#resText").innerHTML =
      `Adivinaste <b>${aciertos} de ${partida.length}</b> personajes · Puntaje: <b>${puntos}</b> · Mejor marca: <b>${estado.mejorPuntaje}</b>`;
  }

  function actualizarMejorMarcador() {
    const estado = cargarEstado();
    $("#marcadorMejor").textContent = estado.mejorPuntaje || 0;
  }

  // Gancho para pruebas automatizadas
  window.__QQ = { actual: () => actual, ronda: () => ronda, resuelta: () => resuelta };

  init();
})();
