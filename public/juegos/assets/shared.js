/* JuegosLiterarios — utilidades compartidas */
(function () {
  'use strict';

  /* ============================================================
     ✎ TEXTOS REGULABLES
     Cambia estos textos aquí y se actualizan solos en TODOS
     los juegos (y en el catálogo). No necesitas tocar ningún
     otro archivo.
     ============================================================ */
  var TEXTOS = {
    volverAlCatalogo: 'Todos los juegos',        // Enlace de regreso de la barra superior
    pieComunidad: 'Comunidad de Juegos CIVILITE', // Pie de página: nombre de la comunidad
    pieCorreo: 'contacto@civilite.games',         // Pie de página: correo de contacto
    pieTelefono: '+56 9 7886 4871'                // Pie de página: teléfono (con espacios)
  };

  // Barra superior uniforme para todos los juegos
  function injectTopbar(current) {
    var bar = document.createElement('header');
    bar.className = 'topbar';
    bar.innerHTML =
      '<a class="brand" href="../"><span class="logo">📖</span><span class="txt">JuegosLiterarios</span></a>' +
      '<nav><a class="volver" href="../">← ' + TEXTOS.volverAlCatalogo + '</a></nav>';
    document.body.prepend(bar);
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function stripAccents(s) {
    return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function saveBest(key, value) {
    try {
      var prev = Number(localStorage.getItem(key) || 0);
      if (value > prev) localStorage.setItem(key, String(value));
      return Math.max(prev, value);
    } catch (e) { return value; }
  }

  function readBest(key) {
    try { return Number(localStorage.getItem(key) || 0); } catch (e) { return 0; }
  }

  function fmtTime(sec) {
    var m = Math.floor(sec / 60), s = sec % 60;
    return (m > 0 ? m + ':' + String(s).padStart(2, '0') : s + ' s');
  }

  // Pie de página uniforme (se agrega solo en todos los juegos y el catálogo)
  function injectFooter() {
    if (document.querySelector('.jl-foot')) return;
    var f = document.createElement('footer');
    f.className = 'jl-foot';
    f.innerHTML =
      '<span class="jl-comunidad">' + TEXTOS.pieComunidad + '</span>' +
      '<span class="jl-sep">·</span>' +
      '<a href="mailto:' + TEXTOS.pieCorreo + '">✉️ ' + TEXTOS.pieCorreo + '</a>' +
      '<span class="jl-sep">·</span>' +
      '<a href="tel:' + TEXTOS.pieTelefono.replace(/\s/g, '') + '">📞 ' + TEXTOS.pieTelefono + '</a>';
    document.body.appendChild(f);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectFooter);
  } else {
    injectFooter();
  }

  window.JL = {
    injectTopbar: injectTopbar,
    injectFooter: injectFooter,
    shuffle: shuffle,
    stripAccents: stripAccents,
    pick: pick,
    saveBest: saveBest,
    readBest: readBest,
    fmtTime: fmtTime
  };
})();
