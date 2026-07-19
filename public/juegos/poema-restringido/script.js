(() => {
  "use strict";

  const LS_KEY = "jl_poema_restringido_v1";
  const ARTICULOS = ["el", "la", "los", "las", "un", "una", "unos", "unas"];
  const MIN_VERSOS = 2;

  const $ = (sel) => document.querySelector(sel);
  const selectRegla = $("#selectRegla");
  const selectConfig = $("#selectConfig");
  const descripcionRegla = $("#descripcionRegla");
  const areaPoema = $("#areaPoema");
  const estadoValidacion = $("#estadoValidacion");
  const listaProblemas = $("#listaProblemas");
  const btnGuardar = $("#btnGuardar");

  function normaliza(str) {
    return str.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  }
  function lineas(texto) {
    return texto.split("\n").filter((l) => l.trim().length > 0);
  }

  const REGLAS = {
    lipograma: {
      nombre: "Lipograma (sin una letra)",
      descripcion: (cfg) => `No puedes usar la letra «${cfg}» en ningún verso.`,
      configOpciones: ["e", "a", "o", "s", "r"],
      validar(texto, cfg) {
        const problemas = [];
        lineas(texto).forEach((linea, i) => {
          if (normaliza(linea).includes(cfg)) problemas.push(`Verso ${i + 1}: contiene la letra «${cfg}».`);
        });
        return problemas;
      },
    },
    monovocal: {
      nombre: "Monovocálico (una sola vocal)",
      descripcion: (cfg) => `Todo el poema debe usar únicamente la vocal «${cfg}».`,
      configOpciones: ["a", "e", "i", "o", "u"],
      validar(texto, cfg) {
        const problemas = [];
        const otras = ["a", "e", "i", "o", "u"].filter((v) => v !== cfg);
        lineas(texto).forEach((linea, i) => {
          const norm = normaliza(linea);
          otras.forEach((v) => {
            if (norm.includes(v)) problemas.push(`Verso ${i + 1}: contiene la vocal «${v}»; solo se permite «${cfg}».`);
          });
        });
        return problemas;
      },
    },
    abecedario: {
      nombre: "Abecedario (un verso por letra)",
      descripcion: () => "Cada verso debe empezar con la letra siguiente del abecedario: A, B, C… (incluye la Ñ).",
      validar(texto) {
        const problemas = [];
        const letras = "abcdefghijklmnñopqrstuvwxyz";
        lineas(texto).forEach((linea, i) => {
          const esperada = letras[i] || "?";
          const inicial = normaliza(linea.trim())[0];
          if (inicial !== esperada) problemas.push(`Verso ${i + 1}: debería empezar con «${esperada.toUpperCase()}».`);
        });
        return problemas;
      },
    },
    versosExactos: {
      nombre: "Versos de N palabras exactas",
      descripcion: (cfg) => `Cada verso debe tener exactamente ${cfg} palabras.`,
      configOpciones: ["4", "5", "6", "7"],
      validar(texto, cfg) {
        const problemas = [];
        const n = parseInt(cfg, 10);
        lineas(texto).forEach((linea, i) => {
          const cuenta = linea.trim().split(/\s+/).filter(Boolean).length;
          if (cuenta !== n) problemas.push(`Verso ${i + 1}: tiene ${cuenta} palabras; debería tener ${n}.`);
        });
        return problemas;
      },
    },
    sinArticulos: {
      nombre: "Sin artículos",
      descripcion: () => "No puedes usar «el», «la», «los», «las», «un», «una», «unos» ni «unas».",
      validar(texto) {
        const problemas = [];
        lineas(texto).forEach((linea, i) => {
          const palabras = normaliza(linea).match(/[a-zñ]+/g) || [];
          const encontrados = palabras.filter((p) => ARTICULOS.includes(p));
          if (encontrados.length) problemas.push(`Verso ${i + 1}: usa el artículo «${encontrados[0]}».`);
        });
        return problemas;
      },
    },
  };

  let reglaActual = null;
  let configActual = null;
  let poemaGuardado = false;

  function poblarSelectRegla() {
    Object.entries(REGLAS).forEach(([id, r]) => {
      const opt = document.createElement("option");
      opt.value = id;
      opt.textContent = r.nombre;
      selectRegla.appendChild(opt);
    });
  }

  function actualizarRegla() {
    reglaActual = REGLAS[selectRegla.value];
    if (reglaActual.configOpciones) {
      selectConfig.hidden = false;
      selectConfig.innerHTML = "";
      reglaActual.configOpciones.forEach((op) => {
        const opt = document.createElement("option");
        opt.value = op;
        opt.textContent = op;
        selectConfig.appendChild(opt);
      });
      configActual = reglaActual.configOpciones[0];
    } else {
      selectConfig.hidden = true;
      configActual = null;
    }
    descripcionRegla.textContent = reglaActual.descripcion(configActual);
    validar();
  }

  function validar() {
    const texto = areaPoema.value;
    if (!texto.trim()) {
      estadoValidacion.textContent = "Empieza a escribir para validar.";
      estadoValidacion.className = "estado-validacion";
      listaProblemas.innerHTML = "";
      areaPoema.classList.remove("valido", "invalido");
      return;
    }
    const problemas = reglaActual.validar(texto, configActual);
    listaProblemas.innerHTML = "";
    problemas.forEach((p) => {
      const li = document.createElement("li");
      li.textContent = p;
      listaProblemas.appendChild(li);
    });

    const suficientesVersos = lineas(texto).length >= MIN_VERSOS;
    const valido = problemas.length === 0 && suficientesVersos;
    areaPoema.classList.toggle("valido", valido);
    areaPoema.classList.toggle("invalido", !valido);

    if (problemas.length > 0) {
      estadoValidacion.textContent = `${problemas.length} verso(s) por corregir.`;
      estadoValidacion.className = "estado-validacion mal";
    } else if (!suficientesVersos) {
      estadoValidacion.textContent = `La regla se cumple, pero escribe al menos ${MIN_VERSOS} versos.`;
      estadoValidacion.className = "estado-validacion";
    } else {
      estadoValidacion.textContent = "✓ El poema cumple la regla.";
      estadoValidacion.className = "estado-validacion ok";
    }
  }

  function cargarEstado() {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; }
    catch { return {}; }
  }
  function guardarEstado(e) { try { localStorage.setItem(LS_KEY, JSON.stringify(e)); } catch {} }

  function init() {
    JL.injectTopbar();
    poblarSelectRegla();
    actualizarRegla();

    selectRegla.addEventListener("change", () => { poemaGuardado = false; actualizarRegla(); });
    selectConfig.addEventListener("change", () => {
      configActual = selectConfig.value;
      descripcionRegla.textContent = reglaActual.descripcion(configActual);
      validar();
    });
    areaPoema.addEventListener("input", () => { poemaGuardado = false; validar(); });

    btnGuardar.addEventListener("click", () => {
      if (!areaPoema.classList.contains("valido") || poemaGuardado) return;
      poemaGuardado = true;
      const estado = cargarEstado();
      estado.validos = (estado.validos || 0) + 1;
      guardarEstado(estado);
      $("#marcadorValidos").textContent = estado.validos;
      const original = btnGuardar.textContent;
      btnGuardar.textContent = "¡Poema guardado! 🎉";
      setTimeout(() => (btnGuardar.textContent = original), 1800);
    });

    $("#btnCopiar").addEventListener("click", () => {
      if (!areaPoema.value.trim()) return;
      navigator.clipboard?.writeText(areaPoema.value);
      const btn = $("#btnCopiar");
      const original = btn.textContent;
      btn.textContent = "¡Copiado!";
      setTimeout(() => (btn.textContent = original), 1500);
    });

    const estado = cargarEstado();
    $("#marcadorValidos").textContent = estado.validos || 0;
  }

  // Gancho para pruebas automatizadas
  window.__PR = {
    regla: (id, cfg) => {
      selectRegla.value = id;
      actualizarRegla();
      if (cfg) {
        selectConfig.value = cfg;
        configActual = cfg;
        descripcionRegla.textContent = reglaActual.descripcion(cfg);
      }
    },
    escribir: (t) => { areaPoema.value = t; validar(); },
    valido: () => areaPoema.classList.contains("valido"),
  };

  init();
})();
