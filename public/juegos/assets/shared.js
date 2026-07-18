/* JuegosLiterarios — utilidades compartidas */
(function () {
  'use strict';

  // Barra superior uniforme para todos los juegos
  function injectTopbar(current) {
    var bar = document.createElement('header');
    bar.className = 'topbar';
    bar.innerHTML =
      '<a class="brand" href="../"><span class="logo">📖</span><span class="txt">JuegosLiterarios</span></a>' +
      '<nav><a href="../">← Todos los juegos</a></nav>';
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

  window.JL = {
    injectTopbar: injectTopbar,
    shuffle: shuffle,
    stripAccents: stripAccents,
    pick: pick,
    saveBest: saveBest,
    readBest: readBest,
    fmtTime: fmtTime
  };
})();
