(() => {
  "use strict";

  const TURNOS_TOTALES = 4; // 2 líneas por personaje
  const LS_KEY = "jl_dialogo_imposible_v1";

  const $ = (sel) => document.querySelector(sel);
  const parejaSorteada = $("#parejaSorteada");
  const selectorModo = $("#selectorModo");
  const modoSolo = $("#modoSolo");
  const modoTurnos = $("#modoTurnos");
  const resultadoFinal = $("#resultadoFinal");
  const turnoActual = $("#turnoActual");
  const areaLineaTurno = $("#areaLineaTurno");
  const avisoPase = $("#avisoPase");

  let banco = [];
  let personajeA = null;
  let personajeB = null;
  let lineasTurnos = [];
  let turnoIndice = 0;

  function cargarEstado() {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; }
    catch { return {}; }
  }
  function guardarEstado(e) { try { localStorage.setItem(LS_KEY, JSON.stringify(e)); } catch {} }

  async function init() {
    JL.injectTopbar();
    const res = await fetch("personajes.json");
    banco = await res.json();

    $("#btnModoSolo").addEventListener("click", () => iniciarModo("solo"));
    $("#btnModoTurnos").addEventListener("click", () => iniciarModo("turnos"));
    $("#btnGuardarSolo").addEventListener("click", guardarSolo);
    $("#btnEnviarTurno").addEventListener("click", enviarTurno);
    $("#btnNuevaPareja").addEventListener("click", sortearPareja);
    $("#btnCopiar").addEventListener("click", copiarDialogo);

    actualizarMarcador();
    sortearPareja();
  }

  function sortearPareja() {
    let a, b;
    do {
      [a, b] = JL.shuffle(banco).slice(0, 2);
    } while (a.obra === b.obra);
    personajeA = a;
    personajeB = b;

    parejaSorteada.innerHTML = `
      <div class="personaje-card">
        <div class="personaje-card__nombre">${a.nombre}</div>
        <div class="personaje-card__obra">${a.obra}</div>
      </div>
      <span class="pareja-sorteada__vs">×</span>
      <div class="personaje-card">
        <div class="personaje-card__nombre">${b.nombre}</div>
        <div class="personaje-card__obra">${b.obra}</div>
      </div>`;

    selectorModo.hidden = false;
    modoSolo.hidden = true;
    modoTurnos.hidden = true;
    resultadoFinal.hidden = true;
    $("#areaDialogoSolo").value = "";
  }

  function iniciarModo(modo) {
    selectorModo.hidden = true;
    if (modo === "solo") {
      modoSolo.hidden = false;
    } else {
      modoTurnos.hidden = false;
      lineasTurnos = [];
      turnoIndice = 0;
      avisoPase.hidden = true;
      areaLineaTurno.value = "";
      mostrarTurno();
    }
  }

  function personajeDeTurno(indice) {
    return indice % 2 === 0 ? personajeA : personajeB;
  }

  function mostrarTurno() {
    const p = personajeDeTurno(turnoIndice);
    turnoActual.innerHTML = `Turno ${turnoIndice + 1} de ${TURNOS_TOTALES} — le toca a <b>${p.nombre}</b>`;
    areaLineaTurno.value = "";
    areaLineaTurno.hidden = false;
    $("#btnEnviarTurno").hidden = false;
    avisoPase.hidden = true;
    areaLineaTurno.focus();
  }

  function enviarTurno() {
    const texto = areaLineaTurno.value.trim();
    if (!texto) return;
    lineasTurnos.push({ personaje: personajeDeTurno(turnoIndice).nombre, texto });
    turnoIndice++;

    if (turnoIndice >= TURNOS_TOTALES) {
      mostrarResultado(lineasTurnos);
      return;
    }

    areaLineaTurno.hidden = true;
    $("#btnEnviarTurno").hidden = true;
    avisoPase.hidden = false;
    turnoActual.innerHTML = `Turno ${turnoIndice + 1} de ${TURNOS_TOTALES} — le toca a <b>${personajeDeTurno(turnoIndice).nombre}</b>`;

    const btnContinuar = document.createElement("button");
    btnContinuar.className = "btn btn-primary btn-block";
    btnContinuar.style.marginTop = "10px";
    btnContinuar.textContent = "Ya estoy listo, mostrar mi turno";
    btnContinuar.addEventListener("click", () => {
      btnContinuar.remove();
      mostrarTurno();
    });
    avisoPase.insertAdjacentElement("afterend", btnContinuar);
  }

  function guardarSolo() {
    const texto = $("#areaDialogoSolo").value.trim();
    if (!texto) return;
    mostrarResultado([{ personaje: `${personajeA.nombre} / ${personajeB.nombre}`, texto }]);
  }

  function mostrarResultado(lineas) {
    modoSolo.hidden = true;
    modoTurnos.hidden = true;
    resultadoFinal.hidden = false;

    const contenido = $("#dialogoFinalContenido");
    contenido.innerHTML = "";
    lineas.forEach((l, i) => {
      const div = document.createElement("div");
      div.className = `linea-dialogo ${i % 2 === 0 ? "linea-dialogo--a" : "linea-dialogo--b"}`;
      div.innerHTML = `<b>${l.personaje}</b>${l.texto}`;
      contenido.appendChild(div);
    });

    const estado = cargarEstado();
    estado.dialogos = (estado.dialogos || 0) + 1;
    guardarEstado(estado);
    actualizarMarcador();
  }

  function copiarDialogo() {
    const lineas = [...document.querySelectorAll("#dialogoFinalContenido .linea-dialogo")]
      .map((d) => `${d.querySelector("b").textContent}: ${d.textContent.replace(d.querySelector("b").textContent, "").trim()}`)
      .join("\n");
    const texto = `Diálogo imposible · JuegosLiterarios\n${personajeA.nombre} × ${personajeB.nombre}\n\n${lineas}`;
    navigator.clipboard?.writeText(texto);
    const btn = $("#btnCopiar");
    const original = btn.textContent;
    btn.textContent = "¡Copiado!";
    setTimeout(() => (btn.textContent = original), 1500);
  }

  function actualizarMarcador() {
    const estado = cargarEstado();
    $("#marcadorDialogos").textContent = estado.dialogos || 0;
  }

  // Gancho para pruebas automatizadas
  window.__DI = {
    pareja: () => [personajeA, personajeB],
    lineas: () => lineasTurnos,
  };

  init();
})();
