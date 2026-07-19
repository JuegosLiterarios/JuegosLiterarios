(() => {
  "use strict";

  const RONDAS_POR_PARTIDA = 8;
  const TOTAL_MOSAICOS = 36; // grid 6x6
  const REVELADOS_INICIAL = 4; // anti adivinanza a ciegas
  const MS_ENTRE_REVELADOS = 2600;
  const LS_KEY = "jl_portada_a_ciegas_v1";

  const $ = (sel) => document.querySelector(sel);
  const lienzo = $("#portadaLienzo");
  const velo = $("#portadaVelo");
  const opcionesEl = $("#opcionesPortada");
  const btnSiguiente = $("#btnSiguiente");
  const selloCorrecto = $("#selloCorrecto");
  const selloIncorrecto = $("#selloIncorrecto");
  const gameEl = $("#game");
  const resultEl = $("#result");

  let banco = [];
  let partida = [];
  let ronda = 0;
  let puntos = 0;
  let aciertos = 0;
  let mosaicosRevelados = [];
  let intervaloReveal = null;
  let actual = null;
  let resuelta = false;

  function cargarEstado() {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; }
    catch { return {}; }
  }
  function guardarEstado(e) { try { localStorage.setItem(LS_KEY, JSON.stringify(e)); } catch {} }

  // ---- Portadas abstractas generativas (sin arte con derechos) ----
  function generarSVG(palette, motivo) {
    const [bg, fg, accent] = palette;
    let contenido = "";
    switch (motivo) {
      case "aspas": {
        let aspas = "";
        for (let i = 0; i < 4; i++) {
          aspas += `<path d="M100,150 L100,58 L124,80 Z" fill="${i % 2 ? fg : accent}" transform="rotate(${i * 90 + 20} 100 150)"/>`;
        }
        contenido = `${aspas}<circle cx="100" cy="150" r="12" fill="${fg}"/>`;
        break;
      }
      case "ventanas": {
        let v = "";
        for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
          const lit = r === 1 && c === 1;
          v += `<rect x="${38 + c * 46}" y="${60 + r * 62}" width="34" height="46" fill="${lit ? accent : "none"}" stroke="${fg}" stroke-width="2.5"/>`;
        }
        contenido = `<rect x="24" y="46" width="152" height="208" fill="none" stroke="${fg}" stroke-width="3"/>` + v;
        break;
      }
      case "hacha": {
        contenido = `<g transform="rotate(28 100 150)">
          <rect x="94" y="42" width="12" height="188" rx="5" fill="${fg}"/>
          <path d="M100,38 L152,58 L100,92 Z" fill="${accent}"/></g>`;
        break;
      }
      case "cruces": {
        let c = `<line x1="0" y1="222" x2="200" y2="222" stroke="${accent}" stroke-width="2" opacity="0.6"/>`;
        [[45, 182, 42], [100, 148, 76], [155, 186, 38]].forEach(([x, y, h]) => {
          c += `<rect x="${x - 3}" y="${y}" width="6" height="${h}" fill="${fg}"/>
                <rect x="${x - 14}" y="${y + 10}" width="28" height="6" fill="${fg}"/>`;
        });
        contenido = c;
        break;
      }
      case "espiral": {
        let path = "M100,150 ";
        for (let t = 0; t < 720; t += 12) {
          const r = t / 8;
          const a = (t * Math.PI) / 180;
          path += `L${100 + r * Math.cos(a)},${150 + r * Math.sin(a)} `;
        }
        contenido = `<path d="${path}" fill="none" stroke="${fg}" stroke-width="5"/>
          <path d="${path}" fill="none" stroke="${accent}" stroke-width="1.5" stroke-dasharray="3 6"/>`;
        break;
      }
      case "constelacion": {
        let puntos_ = "";
        for (let i = 0; i < 14; i++) {
          const x = 20 + Math.random() * 160;
          const y = 20 + Math.random() * 260;
          puntos_ += `<circle cx="${x}" cy="${y}" r="${2 + Math.random() * 2.5}" fill="${fg}"/>`;
          if (i > 0) puntos_ += `<line x1="${x}" y1="${y}" x2="100" y2="150" stroke="${accent}" stroke-width="0.6" opacity="0.4"/>`;
        }
        contenido = `<circle cx="100" cy="150" r="18" fill="none" stroke="${accent}" stroke-width="2"/>${puntos_}`;
        break;
      }
      case "costuras": {
        let lineas = "";
        for (let y = 30; y < 300; y += 45) {
          lineas += `<path d="M10,${y} Q100,${y - 25} 190,${y}" fill="none" stroke="${fg}" stroke-width="2" stroke-dasharray="6 5"/>`;
        }
        contenido = lineas;
        break;
      }
      case "gotas": {
        let gotas = "";
        for (let i = 0; i < 9; i++) {
          const x = 20 + Math.random() * 160;
          const y = 20 + Math.random() * 260;
          const r = 6 + Math.random() * 16;
          gotas += `<ellipse cx="${x}" cy="${y}" rx="${r * 0.7}" ry="${r}" fill="${i % 3 === 0 ? accent : fg}"/>`;
        }
        contenido = gotas;
        break;
      }
      case "marco": {
        let marcos = "";
        for (let i = 0; i < 5; i++) {
          const m = 14 + i * 14;
          marcos += `<rect x="${m}" y="${m * 1.4}" width="${200 - m * 2}" height="${300 - m * 2.8}" fill="none" stroke="${i % 2 ? accent : fg}" stroke-width="2"/>`;
        }
        contenido = marcos;
        break;
      }
      case "grietas": {
        let x = 100, y = 0;
        let path = `M${x},${y} `;
        while (y < 300) {
          x += (Math.random() - 0.5) * 60;
          y += 20 + Math.random() * 30;
          path += `L${x},${y} `;
        }
        contenido = `<path d="${path}" fill="none" stroke="${fg}" stroke-width="3"/>
          <path d="${path}" fill="none" stroke="${accent}" stroke-width="1" transform="translate(4 0)"/>`;
        break;
      }
      case "olas": {
        let olas = "";
        for (let i = 0; i < 6; i++) {
          const y = 30 + i * 42;
          olas += `<path d="M0,${y} Q50,${y - 20} 100,${y} T200,${y}" fill="none" stroke="${i % 2 ? accent : fg}" stroke-width="4"/>`;
        }
        contenido = olas;
        break;
      }
      case "capas": {
        let capas = "";
        for (let i = 0; i < 6; i++) {
          capas += `<rect x="0" y="${i * 50}" width="200" height="46" fill="${i % 2 ? fg : accent}" opacity="${0.4 + i * 0.09}"/>`;
        }
        contenido = capas;
        break;
      }
      case "rayas": {
        let rayas = "";
        for (let i = -4; i < 12; i++) {
          rayas += `<rect x="${i * 26}" y="-20" width="12" height="340" fill="${i % 2 ? fg : accent}" transform="rotate(18 100 150)"/>`;
        }
        contenido = rayas;
        break;
      }
      case "chispas": {
        let chispas = "";
        for (let i = 0; i < 16; i++) {
          const x = 15 + Math.random() * 170;
          const y = 15 + Math.random() * 270;
          const s = 4 + Math.random() * 6;
          chispas += `<path d="M${x},${y - s} L${x + s / 3},${y - s / 3} L${x + s},${y} L${x + s / 3},${y + s / 3}
            L${x},${y + s} L${x - s / 3},${y + s / 3} L${x - s},${y} L${x - s / 3},${y - s / 3} Z" fill="${i % 2 ? accent : fg}"/>`;
        }
        contenido = chispas;
        break;
      }
      case "rayuela": {
        const layout = [[1], [2, 3], [4], [5, 6], [7]];
        let y = 258, cells = "";
        layout.forEach((row) => {
          const h = 42, w = 68;
          row.forEach((num, ci) => {
            const x = 100 - (row.length * w) / 2 + ci * w;
            cells += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${fg}" stroke-width="2.5"/>
              <text x="${x + w / 2}" y="${y + h / 2 + 7}" fill="${fg}" font-size="17" text-anchor="middle" font-family="Georgia, serif">${num}</text>`;
          });
          y -= 44;
        });
        contenido = cells;
        break;
      }
      case "estrella": {
        let star = "";
        for (let i = 0; i < 5; i++) {
          const a = ((i * 72 - 90) * Math.PI) / 180;
          const a2 = ((i * 72 + 36 - 90) * Math.PI) / 180;
          const x1 = 100 + 55 * Math.cos(a), y1 = 118 + 55 * Math.sin(a);
          const x2 = 100 + 24 * Math.cos(a2), y2 = 118 + 24 * Math.sin(a2);
          star += `${i ? "L" : "M"}${x1},${y1} L${x2},${y2} `;
        }
        contenido = `<path d="${star} Z" fill="${fg}"/>
          <circle cx="100" cy="232" r="26" fill="none" stroke="${accent}" stroke-width="2.5"/>
          <circle cx="100" cy="232" r="8" fill="${accent}"/>`;
        break;
      }
      default:
        contenido = `<circle cx="100" cy="150" r="60" fill="${fg}"/>`;
    }
    return `<svg viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="300" fill="${bg}"/>${contenido}</svg>`;
  }

  async function init() {
    JL.injectTopbar();
    const res = await fetch("obras.json");
    banco = await res.json();
    btnSiguiente.addEventListener("click", nuevaRonda);
    $("#againBtn").addEventListener("click", () => {
      resultEl.style.display = "none";
      gameEl.style.display = "block";
      iniciarPartida();
    });
    $("#marcadorTotal").textContent = Math.min(RONDAS_POR_PARTIDA, banco.length);
    actualizarMejorMarcador();
    iniciarPartida();
  }

  function iniciarPartida() {
    partida = JL.shuffle(banco).slice(0, Math.min(RONDAS_POR_PARTIDA, banco.length));
    ronda = 0;
    puntos = 0;
    aciertos = 0;
    $("#marcadorPuntos").textContent = 0;
    nuevaRonda();
  }

  function nuevaRonda() {
    detenerRevelado();
    ronda++;
    if (ronda > partida.length) return finPartida();

    $("#marcadorRonda").textContent = ronda;
    resuelta = false;
    selloCorrecto.classList.remove("activo");
    selloIncorrecto.classList.remove("activo");
    btnSiguiente.hidden = true;

    actual = partida[ronda - 1];
    lienzo.innerHTML = generarSVG(actual.palette, actual.motivo);

    construirVelo();
    construirOpciones();
    revelarMosaicoAleatorio(REVELADOS_INICIAL); // nunca se responde 100% a ciegas
    intervaloReveal = setInterval(() => revelarMosaicoAleatorio(1), MS_ENTRE_REVELADOS);
  }

  function construirVelo() {
    velo.innerHTML = "";
    mosaicosRevelados = new Array(TOTAL_MOSAICOS).fill(false);
    for (let i = 0; i < TOTAL_MOSAICOS; i++) {
      const div = document.createElement("div");
      div.className = "velo-mosaico";
      div.dataset.idx = i;
      velo.appendChild(div);
    }
  }

  function revelarMosaicoAleatorio(cantidad = 1) {
    const ocultos = mosaicosRevelados.map((v, i) => (!v ? i : null)).filter((v) => v !== null);
    if (!ocultos.length) return;
    for (let n = 0; n < cantidad && ocultos.length; n++) {
      const pick = ocultos.splice(Math.floor(Math.random() * ocultos.length), 1)[0];
      mosaicosRevelados[pick] = true;
      velo.querySelector(`[data-idx="${pick}"]`)?.classList.add("revelado");
    }
    if (mosaicosRevelados.every(Boolean) && !resuelta) terminarRonda(false);
  }

  function porcentajeRevelado() {
    return Math.round((100 * mosaicosRevelados.filter(Boolean).length) / TOTAL_MOSAICOS);
  }

  function construirOpciones() {
    opcionesEl.innerHTML = "";
    const distractores = JL.shuffle(banco.filter((b) => b.titulo !== actual.titulo)).slice(0, 3);
    JL.shuffle([actual, ...distractores]).forEach((obra) => {
      const btn = document.createElement("button");
      btn.className = "opcion-portada";
      btn.textContent = obra.titulo;
      btn.addEventListener("click", () => responder(obra.titulo, btn));
      opcionesEl.appendChild(btn);
    });
  }

  function responder(tituloElegido, btnClickeado) {
    if (resuelta) return;
    if (tituloElegido === actual.titulo) {
      terminarRonda(true);
    } else {
      btnClickeado.classList.add("incorrecta");
      btnClickeado.disabled = true;
      revelarMosaicoAleatorio(3); // penalización: se revela más de la portada
    }
  }

  function terminarRonda(acierto) {
    resuelta = true;
    clearInterval(intervaloReveal);
    velo.querySelectorAll(".velo-mosaico").forEach((el) => el.classList.add("revelado"));

    opcionesEl.querySelectorAll(".opcion-portada").forEach((b) => {
      b.disabled = true;
      if (b.textContent === actual.titulo) b.classList.add("correcta");
    });

    if (acierto) {
      aciertos++;
      const pct = porcentajeRevelado();
      puntos += Math.max(10, 100 - pct);
      selloCorrecto.classList.add("activo");
    } else {
      selloIncorrecto.classList.add("activo");
    }

    $("#marcadorPuntos").textContent = puntos;
    btnSiguiente.hidden = false;
    btnSiguiente.textContent = ronda >= partida.length ? "Ver resultado →" : "Siguiente portada →";
  }

  function detenerRevelado() { clearInterval(intervaloReveal); }

  function finPartida() {
    detenerRevelado();
    gameEl.style.display = "none";
    resultEl.style.display = "block";

    const estado = cargarEstado();
    estado.partidas = (estado.partidas || 0) + 1;
    if (!estado.mejorPuntaje || puntos > estado.mejorPuntaje) estado.mejorPuntaje = puntos;
    guardarEstado(estado);
    actualizarMejorMarcador();

    const msg = puntos >= 550 ? "¡Curador de museo literario! 🏆" :
                puntos >= 400 ? "Ojo entrenado para las portadas 🖼️" :
                puntos >= 250 ? "Buen instinto visual lector 🌱" : "Las portadas te tendrán revancha";
    $("#resTitle").textContent = msg;
    $("#resText").innerHTML =
      `Acertaste <b>${aciertos} de ${partida.length}</b> portadas · Puntaje: <b>${puntos}</b> · Mejor marca: <b>${estado.mejorPuntaje}</b>`;
  }

  function actualizarMejorMarcador() {
    const estado = cargarEstado();
    $("#marcadorMejor").textContent = estado.mejorPuntaje || 0;
  }

  // Gancho para pruebas automatizadas
  window.__PC = {
    actual: () => actual,
    partida: () => partida,
    resuelta: () => resuelta,
    revelado: () => porcentajeRevelado(),
  };

  init();
})();
