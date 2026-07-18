(() => {
  "use strict";

  /* ----------------------------------------------------------
     Datos de respaldo (idénticos a data.json)
  ---------------------------------------------------------- */
  const FALLBACK_DATA = {
    letters: {
      facil: ["k", "w", "x", "j", "z", "q", "ñ"],
      media: ["b", "f", "g", "h", "v", "y", "c", "p", "m", "d"],
      dificil: ["a", "e", "o", "s", "r", "n", "i", "l", "t", "u"],
      perec: ["e"],
    },
    prompts: [
      "Describe el primer recuerdo que tengas de un lugar que ya no existe.",
      "Cuenta cómo empezó tu día, sin exagerar ni un poco.",
      "Inventa una carta breve para alguien que no volverás a ver.",
      "Explica por qué el silencio de una casa vacía dice tanto.",
      "Narra el trayecto más corto que hiciste hoy.",
      "Describe un objeto pequeño que guardas sin saber bien por qué.",
      "Cuenta qué harías con una tarde libre, sin planes previos.",
      "Escribe sobre el olor de una cocina en domingo.",
      "Relata un encuentro breve con un desconocido amable.",
      "Describe tu ventana favorita y qué se ve desde ahí.",
      "Cuenta una anécdota sobre perderte en un lugar nuevo.",
      "Escribe una despedida corta para un viaje que aún no empieza.",
      "Describe el sonido que más te calma al final del día.",
      "Cuenta qué comprarías si solo pudieras llevar una bolsa pequeña.",
      "Narra un momento en que el clima cambió tu plan.",
      "Escribe sobre una costumbre familiar que casi nadie conoce.",
      "Describe una calle que caminas casi todos los días.",
      "Cuenta el final de una historia que nunca empezaste a contar.",
    ],
  };

  /* ----------------------------------------------------------
     Estado
  ---------------------------------------------------------- */
  let GAME_DATA = null;
  let forbiddenLetter = "e";
  let currentPrompt = "";
  let startTime = null;
  let timerId = null;
  let violationCount = 0;
  let lastViolationCount = 0;
  let wordCount = 0;
  let elapsedSeconds = 0;
  let heroRotateId = null;
  let currentLevel = "media";
  let lastScore = 0;

  const BEST_SCORE_KEY = "lipograma-best-scores";

  /* ----------------------------------------------------------
     Referencias DOM
  ---------------------------------------------------------- */
  const stage = document.getElementById("stage");
  const screenSetup = document.getElementById("screen-setup");
  const screenPlay = document.getElementById("screen-play");
  const screenResult = document.getElementById("screen-result");

  const heroLetterEl = document.getElementById("hero-letter");
  const promptTextEl = document.getElementById("prompt-text");
  const hudLetterBadge = document.getElementById("hud-letter");
  const hudLetterChar = document.getElementById("hud-letter-char");

  const statTime = document.getElementById("stat-time");
  const statWords = document.getElementById("stat-words");
  const statViolations = document.getElementById("stat-violations");

  const editor = document.getElementById("editor");
  const mirror = document.getElementById("mirror");

  const btnFinish = document.getElementById("btn-finish");
  const btnAgain = document.getElementById("btn-again");

  const resultTitle = document.getElementById("result-title");
  const resultWords = document.getElementById("result-words");
  const resultTime = document.getElementById("result-time");
  const resultViolations = document.getElementById("result-violations");
  const resultScore = document.getElementById("result-score");
  const resultNote = document.getElementById("result-note");
  const resultBest = document.getElementById("result-best");
  const btnShare = document.getElementById("btn-share");

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ----------------------------------------------------------
     Carga de datos
  ---------------------------------------------------------- */
  fetch("data.json")
    .then((r) => r.json())
    .then((data) => {
      GAME_DATA = data;
      startHeroRotation();
    })
    .catch(() => {
      // Respaldo si data.json no pudo cargarse (por ejemplo, al abrir el
      // archivo directamente con file:// sin servidor local). Se mantiene
      // idéntico a data.json para que la experiencia no se degrade.
      GAME_DATA = FALLBACK_DATA;
      startHeroRotation();
    });

  /* ----------------------------------------------------------
     Decoración: rotar la letra del key-hero antes de jugar
  ---------------------------------------------------------- */
  function startHeroRotation() {
    if (prefersReducedMotion) return;
    const sample = ["E", "A", "Ñ", "Q", "S", "K"];
    let i = 0;
    heroRotateId = setInterval(() => {
      i = (i + 1) % sample.length;
      heroLetterEl.textContent = sample[i];
    }, 2200);
  }

  /* ----------------------------------------------------------
     Normalización de letras (acentos sí, ñ no)
  ---------------------------------------------------------- */
  function normalizeChar(ch) {
    const lower = ch.toLowerCase();
    if (lower === "ñ") return "ñ";
    return lower.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  /* ----------------------------------------------------------
     Selección de dificultad -> empezar partida
  ---------------------------------------------------------- */
  document.querySelectorAll(".pill").forEach((btn) => {
    btn.addEventListener("click", () => {
      const level = btn.dataset.level;
      startGame(level);
    });
  });

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function startGame(level) {
    if (!GAME_DATA) return;
    if (heroRotateId) clearInterval(heroRotateId);

    currentLevel = level;
    const pool = GAME_DATA.letters[level] || GAME_DATA.letters.media;
    forbiddenLetter = pickRandom(pool);
    currentPrompt = pickRandom(GAME_DATA.prompts);

    violationCount = 0;
    lastViolationCount = 0;
    wordCount = 0;
    elapsedSeconds = 0;

    hudLetterChar.textContent = forbiddenLetter.toUpperCase();
    promptTextEl.textContent = currentPrompt;
    statTime.textContent = "00:00";
    statWords.textContent = "0";
    statViolations.textContent = "0";

    editor.value = "";
    mirror.innerHTML = "";
    autoGrow();

    screenSetup.hidden = true;
    screenResult.hidden = true;
    screenPlay.hidden = false;

    startTime = Date.now();
    if (timerId) clearInterval(timerId);
    timerId = setInterval(tickTimer, 1000);

    setTimeout(() => editor.focus(), 50);
  }

  function tickTimer() {
    elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    statTime.textContent = formatTime(elapsedSeconds);
  }

  function formatTime(totalSeconds) {
    const m = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (totalSeconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  /* ----------------------------------------------------------
     Entrada de texto: resaltar la letra prohibida en vivo
  ---------------------------------------------------------- */
  editor.addEventListener("input", () => {
    const text = editor.value;
    let html = "";
    let violations = 0;

    // Se agrupan tramos consecutivos del mismo tipo (violación o no) en
    // lugar de envolver cada carácter individualmente: mismo resultado
    // visual, muchos menos nodos/spans para textos largos.
    let buffer = "";
    let bufferIsViolation = false;

    const flush = () => {
      if (!buffer) return;
      const safe = escapeHtml(buffer);
      html += bufferIsViolation
        ? `<span class="violation">${safe}</span>`
        : safe;
      buffer = "";
    };

    for (const ch of text) {
      const isViolation =
        normalizeChar(ch) === forbiddenLetter && /\S/.test(ch);
      if (isViolation) violations++;

      if (buffer && isViolation !== bufferIsViolation) flush();
      bufferIsViolation = isViolation;
      buffer += ch;
    }
    flush();

    mirror.innerHTML = html || "";
    violationCount = violations;

    const trimmed = text.trim();
    wordCount = trimmed === "" ? 0 : trimmed.split(/\s+/).length;

    statWords.textContent = String(wordCount);
    statViolations.textContent = String(violationCount);

    if (violationCount > lastViolationCount) {
      triggerImpact();
    }
    lastViolationCount = violationCount;

    autoGrow();
    mirror.scrollTop = editor.scrollTop;
  });

  editor.addEventListener("scroll", () => {
    mirror.scrollTop = editor.scrollTop;
  });

  function autoGrow() {
    editor.style.height = "auto";
    editor.style.height = editor.scrollHeight + "px";
  }

  function triggerImpact() {
    if (prefersReducedMotion) return;
    stage.classList.remove("shake");
    hudLetterBadge.classList.remove("spark");
    // forzar reflow para poder reiniciar la animación
    void stage.offsetWidth;
    stage.classList.add("shake");
    hudLetterBadge.classList.add("spark");
    setTimeout(() => {
      stage.classList.remove("shake");
      hudLetterBadge.classList.remove("spark");
    }, 350);
  }

  /* ----------------------------------------------------------
     Mejor puntaje (persistente por dificultad)
  ---------------------------------------------------------- */
  function readBestScores() {
    try {
      const raw = localStorage.getItem(BEST_SCORE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function getBestScore(level) {
    const scores = readBestScores();
    return typeof scores[level] === "number" ? scores[level] : null;
  }

  function saveBestScoreIfHigher(level, score) {
    try {
      const scores = readBestScores();
      const prev = typeof scores[level] === "number" ? scores[level] : -1;
      if (score > prev) {
        scores[level] = score;
        localStorage.setItem(BEST_SCORE_KEY, JSON.stringify(scores));
        return true;
      }
      return false;
    } catch (e) {
      // localStorage no disponible (modo privado, permisos, etc.):
      // el juego sigue funcionando, simplemente sin persistencia.
      return false;
    }
  }

  const LEVEL_LABELS = {
    facil: "Fácil",
    media: "Media",
    dificil: "Difícil",
    perec: "Modo Perec",
  };

  /* ----------------------------------------------------------
     Terminar partida -> resultado
  ---------------------------------------------------------- */
  btnFinish.addEventListener("click", finishGame);

  function finishGame() {
    if (timerId) clearInterval(timerId);

    const penalty = violationCount * 3;
    const bonus = violationCount === 0 && wordCount > 0 ? 10 : 0;
    const score = Math.max(0, wordCount - penalty + bonus);

    resultWords.textContent = String(wordCount);
    resultTime.textContent = formatTime(elapsedSeconds);
    resultViolations.textContent = String(violationCount);
    resultScore.textContent = String(score);
    lastScore = score;

    const isNewBest = saveBestScoreIfHigher(currentLevel, score);
    const best = getBestScore(currentLevel);
    if (best !== null) {
      resultBest.hidden = false;
      resultBest.textContent = isNewBest
        ? `🏆 ¡Nuevo mejor puntaje en ${LEVEL_LABELS[currentLevel]}!`
        : `Mejor puntaje en ${LEVEL_LABELS[currentLevel]}: ${best}`;
    } else {
      resultBest.hidden = true;
    }

    if (wordCount === 0) {
      resultTitle.textContent = "Página en blanco";
      resultNote.textContent =
        "No alcanzaste a escribir nada. Vuelve a intentarlo.";
    } else if (violationCount === 0 && wordCount >= 20) {
      resultTitle.textContent = "Texto impecable";
      resultNote.textContent =
        "Ni una letra fuera de lugar. Así escribía Perec.";
    } else if (violationCount === 0) {
      resultTitle.textContent = "Limpio, pero breve";
      resultNote.textContent =
        "Cero infracciones — ¿y si la próxima vez te arriesgas a escribir más?";
    } else if (violationCount <= 3) {
      resultTitle.textContent = "Casi perfecto";
      resultNote.textContent = `Se te escapó la letra «${forbiddenLetter}» un par de veces.`;
    } else {
      resultTitle.textContent = "La letra prohibida ganó";
      resultNote.textContent = `«${forbiddenLetter}» apareció ${violationCount} veces. Inténtalo de nuevo.`;
    }

    screenPlay.hidden = true;
    screenResult.hidden = false;
  }

  /* ----------------------------------------------------------
     Copiar resultado
  ---------------------------------------------------------- */
  btnShare.addEventListener("click", async () => {
    const summary =
      `Lipograma (${LEVEL_LABELS[currentLevel]}, sin «${forbiddenLetter}»): ` +
      `${wordCount} palabras, ${violationCount} infracciones, ` +
      `puntaje ${lastScore}.`;

    const originalLabel = btnShare.textContent;
    try {
      await navigator.clipboard.writeText(summary);
      btnShare.textContent = "¡Copiado!";
    } catch (e) {
      btnShare.textContent = "No se pudo copiar";
    }
    setTimeout(() => {
      btnShare.textContent = originalLabel;
    }, 1800);
  });

  /* ----------------------------------------------------------
     Jugar de nuevo
  ---------------------------------------------------------- */
  btnAgain.addEventListener("click", () => {
    screenResult.hidden = true;
    screenSetup.hidden = false;
    heroLetterEl.textContent = "E";
    startHeroRotation();
  });
})();
