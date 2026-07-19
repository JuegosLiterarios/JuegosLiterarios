(async () => {
  "use strict";

  const TOTAL_PREGUNTAS = 10;
  const LS_KEY = "jl_el_estilo_manda_v1";

  const $ = (sel) => document.querySelector(sel);
  const setupEl = $("#setup");
  const gameEl = $("#game");
  const resultEl = $("#result");
  const promptEl = $("#preguntaPrompt");
  const opcionesEl = $("#opciones");
  const explicacionEl = $("#explicacion");
  const btnSiguiente = $("#btnSiguiente");
  const selloCorrecto = $("#selloCorrecto");
  const selloIncorrecto = $("#selloIncorrecto");

  let banco = [];
  let partida = [];
  let indice = 0;
  let puntos = 0;
  let racha = 0;
  let aciertosPartida = 0;
  let respondida = false;

  JL.injectTopbar();

  function cargarEstado() {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; }
    catch { return {}; }
  }
  function guardarEstado(e) { try { localStorage.setItem(LS_KEY, JSON.stringify(e)); } catch {} }

  function renderGlobalStats() {
    const est = cargarEstado();
    $("#statRespondidas").textContent = est.jugadas || 0;
    $("#statAciertos").textContent = est.aciertos || 0;
    $("#statMejor").textContent = est.mejorPuntaje || 0;
  }

  const res = await fetch("fragmentos.json");
  banco = await res.json();
  renderGlobalStats();

  $("#btnEmpezar").addEventListener("click", iniciarPartida);
  $("#btnOtra").addEventListener("click", iniciarPartida);
  btnSiguiente.addEventListener("click", siguientePregunta);

  function iniciarPartida() {
    partida = JL.shuffle(banco).slice(0, Math.min(TOTAL_PREGUNTAS, banco.length));
    indice = 0;
    puntos = 0;
    racha = 0;
    aciertosPartida = 0;
    setupEl.style.display = "none";
    resultEl.style.display = "none";
    gameEl.style.display = "block";
    mostrarPregunta();
  }

  function mostrarPregunta() {
    respondida = false;
    explicacionEl.hidden = true;
    btnSiguiente.hidden = true;
    selloCorrecto.classList.remove("activo");
    selloIncorrecto.classList.remove("activo");

    $("#numPregunta").textContent = `${indice + 1}/${partida.length}`;
    $("#marcadorPuntos").textContent = puntos;
    $("#marcadorRacha").textContent = racha;

    const item = partida[indice];
    promptEl.innerHTML =
      `<blockquote class="fragmento">«${item.texto}»</blockquote>
       <p class="pregunta-consigna">¿Quién escribió este fragmento?</p>`;

    opcionesEl.innerHTML = "";
    const letras = ["A", "B", "C", "D"];
    JL.shuffle(item.opciones).forEach((texto, i) => {
      const btn = document.createElement("button");
      btn.className = "opcion";
      btn.innerHTML = `<span class="opcion__letra">${letras[i]}</span><span>${texto}</span>`;
      btn.addEventListener("click", () => responder(item, texto, btn));
      opcionesEl.appendChild(btn);
    });
  }

  function responder(item, texto, btnClickeado) {
    if (respondida) return;
    respondida = true;

    opcionesEl.querySelectorAll(".opcion").forEach((b) => {
      b.disabled = true;
      if (b.querySelector("span:last-child").textContent === item.respuesta) b.classList.add("correcta");
    });

    const gano = texto === item.respuesta;
    if (gano) {
      racha++;
      aciertosPartida++;
      puntos += 10 + Math.max(0, racha - 1) * 2;
      selloCorrecto.classList.add("activo");
    } else {
      racha = 0;
      btnClickeado.classList.add("incorrecta");
      selloIncorrecto.classList.add("activo");
    }

    explicacionEl.hidden = false;
    explicacionEl.innerHTML = `📖 <b>${item.respuesta}</b> · ${item.fuente}. <br>🔍 Delata su estilo: ${item.nota}.`;
    btnSiguiente.hidden = false;
    btnSiguiente.textContent = indice + 1 < partida.length ? "Siguiente →" : "Ver resultado →";

    $("#marcadorPuntos").textContent = puntos;
    $("#marcadorRacha").textContent = racha;

    const est = cargarEstado();
    est.jugadas = (est.jugadas || 0) + 1;
    est.aciertos = (est.aciertos || 0) + (gano ? 1 : 0);
    guardarEstado(est);
  }

  function siguientePregunta() {
    indice++;
    if (indice >= partida.length) return finPartida();
    mostrarPregunta();
  }

  function finPartida() {
    gameEl.style.display = "none";
    resultEl.style.display = "block";

    const est = cargarEstado();
    est.partidas = (est.partidas || 0) + 1;
    if (!est.mejorPuntaje || puntos > est.mejorPuntaje) est.mejorPuntaje = puntos;
    guardarEstado(est);

    const msg = puntos >= 150 ? "¡Oído absoluto para la prosa! 🏆" :
                puntos >= 110 ? "Reconoces cada voz narrativa 🖋️" :
                puntos >= 70 ? "Buen oído literario 🌱" : "Los estilos te darán revancha";
    $("#resTitle").textContent = msg;
    $("#resText").innerHTML =
      `Acertaste <b>${aciertosPartida} de ${partida.length}</b> · Puntaje: <b>${puntos}</b> · Mejor marca: <b>${est.mejorPuntaje}</b>`;
  }

  // Gancho para pruebas automatizadas
  window.__EM = {
    item: () => partida[indice],
    listo: () => banco.length > 0,
    respondida: () => respondida,
  };
})();
