(() => {
  "use strict";

  const RONDAS = 8;
  const LS_KEY = "jl_linea_de_tiempo_v1";

  const $ = (sel) => document.querySelector(sel);
  const listaEl = $("#listaTiempo");
  const btnComprobar = $("#btnComprobar");
  const btnSiguiente = $("#btnSiguiente");
  const selloCorrecto = $("#selloCorrecto");
  const temaActual = $("#temaActual");
  const ordenCorrectoEl = $("#ordenCorrecto");
  const gameEl = $("#game");
  const resultEl = $("#result");

  let banco = [];
  let partida = [];
  let ronda = 0;
  let puntos = 0;
  let lineasPerfectas = 0;
  let ordenActual = [];
  let correctoActual = [];
  let resuelta = false;

  function cargarEstado() {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; }
    catch { return {}; }
  }
  function guardarEstado(e) { try { localStorage.setItem(LS_KEY, JSON.stringify(e)); } catch {} }

  async function init() {
    JL.injectTopbar();
    const res = await fetch("lineas.json");
    banco = await res.json();
    btnComprobar.addEventListener("click", comprobar);
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
    partida = JL.shuffle(banco).slice(0, Math.min(RONDAS, banco.length));
    ronda = 0;
    puntos = 0;
    lineasPerfectas = 0;
    $("#marcadorPuntos").textContent = 0;
    siguienteRonda();
  }

  function siguienteRonda() {
    ronda++;
    if (ronda > partida.length) return finPartida();

    $("#marcadorRonda").textContent = `${ronda}/${partida.length}`;
    const grupo = partida[ronda - 1];
    temaActual.textContent = grupo.tema;
    correctoActual = [...grupo.items].sort((a, b) => a.anio - b.anio);
    ordenActual = JL.shuffle(grupo.items);
    resuelta = false;
    btnComprobar.hidden = false;
    btnSiguiente.hidden = true;
    ordenCorrectoEl.hidden = true;
    selloCorrecto.classList.remove("activo");
    renderLista();
  }

  function renderLista() {
    listaEl.innerHTML = "";
    ordenActual.forEach((item, i) => {
      const li = document.createElement("li");
      li.className = "item-tiempo";
      li.innerHTML = `
        <div class="item-tiempo__flechas">
          <button data-dir="-1" ${i === 0 ? "disabled" : ""} aria-label="Mover arriba">▲</button>
          <button data-dir="1" ${i === ordenActual.length - 1 ? "disabled" : ""} aria-label="Mover abajo">▼</button>
        </div>
        <span class="item-tiempo__nombre">${item.nombre}</span>
        <span class="item-tiempo__anio" data-anio hidden>${item.anio}</span>`;
      li.querySelectorAll("button").forEach((btn) =>
        btn.addEventListener("click", () => mover(i, parseInt(btn.dataset.dir, 10)))
      );
      listaEl.appendChild(li);
    });
  }

  function mover(idx, dir) {
    if (resuelta) return;
    const destino = idx + dir;
    if (destino < 0 || destino >= ordenActual.length) return;
    [ordenActual[idx], ordenActual[destino]] = [ordenActual[destino], ordenActual[idx]];
    renderLista();
  }

  function comprobar() {
    if (resuelta) return;
    resuelta = true;

    let exactas = 0;
    const items = listaEl.querySelectorAll(".item-tiempo");
    ordenActual.forEach((item, i) => {
      const acierto = item.nombre === correctoActual[i].nombre;
      if (acierto) exactas++;
      items[i].classList.add(acierto ? "correcta" : "incorrecta");
      items[i].querySelector("[data-anio]").hidden = false;
      items[i].querySelectorAll("button").forEach((b) => (b.disabled = true));
    });

    const perfecta = exactas === ordenActual.length;
    const ganados = exactas * 10 + (perfecta ? 20 : 0);
    puntos += ganados;
    if (perfecta) lineasPerfectas++;
    $("#marcadorPuntos").textContent = puntos;
    if (perfecta) selloCorrecto.classList.add("activo");

    // Si no fue perfecta, mostramos el orden correcto (momento de aprendizaje)
    if (!perfecta) {
      ordenCorrectoEl.hidden = false;
      ordenCorrectoEl.innerHTML =
        "📜 Orden correcto: <b>" +
        correctoActual.map((x) => `${x.nombre} (${x.anio})`).join(" → ") +
        "</b>";
    }

    btnComprobar.hidden = true;
    btnSiguiente.hidden = false;
    btnSiguiente.textContent = ronda >= partida.length ? "Ver resultado →" : "Siguiente →";
  }

  function finPartida() {
    gameEl.style.display = "none";
    resultEl.style.display = "block";

    const estado = cargarEstado();
    estado.partidas = (estado.partidas || 0) + 1;
    if (!estado.mejorPuntaje || puntos > estado.mejorPuntaje) estado.mejorPuntaje = puntos;
    guardarEstado(estado);
    actualizarMejorMarcador();

    const msg = puntos >= 500 ? "¡Cronista mayor de la literatura! 🏆" :
                puntos >= 380 ? "Tu brújula histórica es finísima 🧭" :
                puntos >= 250 ? "Buen sentido del tiempo literario 🌱" : "Los siglos te tendrán revancha";
    $("#resTitle").textContent = msg;
    $("#resText").innerHTML =
      `Líneas perfectas: <b>${lineasPerfectas} de ${partida.length}</b> · Puntaje: <b>${puntos}</b> · Mejor marca: <b>${estado.mejorPuntaje}</b>`;
  }

  function actualizarMejorMarcador() {
    const estado = cargarEstado();
    $("#marcadorMejor").textContent = estado.mejorPuntaje || 0;
  }

  // Gancho para pruebas automatizadas
  window.__LT = {
    correcto: () => correctoActual,
    fijar: (nuevo) => { ordenActual = [...nuevo]; renderLista(); },
    resuelta: () => resuelta,
  };

  init();
})();
