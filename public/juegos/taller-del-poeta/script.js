(() => {
  "use strict";

  const POEMAS_POR_PARTIDA = 4;
  const LS_KEY = "jl_taller_del_poeta_v1";

  const $ = (sel) => document.querySelector(sel);
  const poemaEl = $("#poema");
  const opcionesHuecosEl = $("#opcionesHuecos");
  const btnComprobar = $("#btnComprobar");
  const btnSiguiente = $("#btnSiguiente");
  const selloPerfecto = $("#selloPerfecto");
  const obraActual = $("#obraActual");
  const explicacionEl = $("#explicacion");
  const gameEl = $("#game");
  const resultEl = $("#result");

  let banco = [];
  let partida = [];
  let ronda = 0;
  let puntos = 0;
  let palabrasAcertadas = 0;
  let palabrasTotales = 0;
  let actual = null;
  let elecciones = {}; // { n: palabra }
  let resuelta = false;

  function cargarEstado() {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; }
    catch { return {}; }
  }
  function guardarEstado(e) { try { localStorage.setItem(LS_KEY, JSON.stringify(e)); } catch {} }

  async function init() {
    JL.injectTopbar();
    const res = await fetch("poemas.json");
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
    partida = JL.shuffle(banco).slice(0, Math.min(POEMAS_POR_PARTIDA, banco.length));
    ronda = 0;
    puntos = 0;
    palabrasAcertadas = 0;
    palabrasTotales = 0;
    $("#marcadorPuntos").textContent = 0;
    siguienteRonda();
  }

  function siguienteRonda() {
    ronda++;
    if (ronda > partida.length) return finPartida();

    $("#marcadorRonda").textContent = `${ronda}/${partida.length}`;
    actual = partida[ronda - 1];
    elecciones = {};
    resuelta = false;
    btnComprobar.hidden = false;
    btnComprobar.disabled = true;
    btnSiguiente.hidden = true;
    explicacionEl.hidden = true;
    selloPerfecto.classList.remove("activo");
    obraActual.textContent = `${actual.obra} · ${actual.autor}`;
    renderPoema();
    renderOpciones();
  }

  function renderPoema() {
    const html = actual.lineas
      .join("<br>")
      .replace(/\{(\d+)\}/g, (_, n) => {
        const palabra = elecciones[n];
        return `<span class="hueco" data-n="${n}">${palabra || "…"}</span>`;
      });
    poemaEl.innerHTML = html;
  }

  function renderOpciones() {
    opcionesHuecosEl.innerHTML = "";
    Object.keys(actual.huecos).forEach((n) => {
      const h = actual.huecos[n];
      const fila = document.createElement("div");
      fila.className = "fila-opciones";
      fila.innerHTML = `<span class="num-hueco">${n}.</span>`;
      const grupo = document.createElement("span");
      grupo.className = "opciones-hueco";
      JL.shuffle(h.opciones).forEach((palabra) => {
        const btn = document.createElement("button");
        btn.className = "opcion-hueco";
        btn.textContent = palabra;
        btn.dataset.n = n;
        btn.addEventListener("click", () => elegir(n, palabra, btn));
        grupo.appendChild(btn);
      });
      fila.appendChild(grupo);
      opcionesHuecosEl.appendChild(fila);
    });
  }

  function elegir(n, palabra, btn) {
    if (resuelta) return;
    elecciones[n] = palabra;
    opcionesHuecosEl.querySelectorAll(`.opcion-hueco[data-n="${n}"]`).forEach((b) =>
      b.classList.toggle("elegida", b === btn)
    );
    renderPoema();
    btnComprobar.disabled = Object.keys(elecciones).length < Object.keys(actual.huecos).length;
  }

  function comprobar() {
    if (resuelta) return;
    resuelta = true;

    let aciertos = 0;
    const total = Object.keys(actual.huecos).length;
    palabrasTotales += total;

    Object.entries(actual.huecos).forEach(([n, h]) => {
      const bien = elecciones[n] === h.respuesta;
      if (bien) { aciertos++; palabrasAcertadas++; }
      const slot = poemaEl.querySelector(`.hueco[data-n="${n}"]`);
      slot.textContent = h.respuesta; // se muestra siempre la palabra real
      slot.classList.add(bien ? "ok" : "mal");
      opcionesHuecosEl.querySelectorAll(`.opcion-hueco[data-n="${n}"]`).forEach((b) => {
        b.disabled = true;
        b.classList.remove("elegida");
        if (b.textContent === h.respuesta) b.classList.add("ok");
        else if (b.textContent === elecciones[n]) b.classList.add("mal");
      });
    });

    const ganados = aciertos * 10 + (aciertos === total ? 10 : 0);
    puntos += ganados;
    $("#marcadorPuntos").textContent = puntos;
    if (aciertos === total) selloPerfecto.classList.add("activo");

    explicacionEl.hidden = false;
    explicacionEl.innerHTML = `📖 <b>${actual.obra}</b>, de ${actual.autor} · ${aciertos} de ${total} palabras restauradas (+${ganados} pts)`;

    btnComprobar.hidden = true;
    btnSiguiente.hidden = false;
    btnSiguiente.textContent = ronda >= partida.length ? "Ver resultado →" : "Siguiente poema →";
  }

  function finPartida() {
    gameEl.style.display = "none";
    resultEl.style.display = "block";

    const estado = cargarEstado();
    estado.partidas = (estado.partidas || 0) + 1;
    if (!estado.mejorPuntaje || puntos > estado.mejorPuntaje) estado.mejorPuntaje = puntos;
    guardarEstado(estado);
    actualizarMejorMarcador();

    const msg = puntos >= 150 ? "¡Manos de orfebre poético! 🏆" :
                puntos >= 110 ? "El taller queda en buenas manos 🖋️" :
                puntos >= 70 ? "Buen oído para el verso 🌱" : "Los poetas te darán revancha";
    $("#resTitle").textContent = msg;
    $("#resText").innerHTML =
      `Restauraste <b>${palabrasAcertadas} de ${palabrasTotales}</b> palabras · Puntaje: <b>${puntos}</b> · Mejor marca: <b>${estado.mejorPuntaje}</b>`;
  }

  function actualizarMejorMarcador() {
    const estado = cargarEstado();
    $("#marcadorMejor").textContent = estado.mejorPuntaje || 0;
  }

  // Gancho para pruebas automatizadas
  window.__TP = {
    actual: () => actual,
    resuelta: () => resuelta,
  };

  init();
})();
