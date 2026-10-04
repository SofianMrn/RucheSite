/* =========================================================
   La Ruche · « Tout le marché, au même endroit »
   Une seule animation continue, pilotée par le défilement :
   des centaines de références gravitent autour de la ruche,
   un anneau les trie en temps réel, puis les retenues
   rejoignent leur place. Aucun palier, aucune coupure.
   ========================================================= */
(function () {
  'use strict';

  var section = document.querySelector('[data-gather]');
  if (!section) return;
  var field = section.querySelector('[data-gather-field]');
  var canvas = section.querySelector('[data-gather-canvas]');
  if (!field || !canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');
  var beats = Array.prototype.slice.call(section.querySelectorAll('[data-beat]'));
  var docks = Array.prototype.slice.call(section.querySelectorAll('[data-dock]'));
  var core = section.querySelector('[data-gather-core]');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var isMobile = window.matchMedia('(max-width: 899px)');

  /* ---------- Outils ---------- */
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function smooth(a, b, v) { var t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); }
  function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  var seed = 3;
  function rand() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }

  /* ---------- Particules : les références ---------- */
  var DOCK_POS = docks.map(function (d) {
    return [parseFloat(d.style.getPropertyValue('--dx')) / 100, parseFloat(d.style.getPropertyValue('--dy')) / 100];
  });
  var parts = [];
  function build(count) {
    parts = [];
    seed = 3;
    for (var i = 0; i < count; i++) {
      var r = 0.3 + Math.pow(rand(), 0.8) * 0.66;
      parts.push({
        a0: rand() * Math.PI * 2,
        r: r,
        w: (0.035 + 0.07 * (1 - r)) * (rand() < 0.5 ? 1 : 0.85),
        s: 1.3 + rand() * 2.2,
        tilt: rand() * Math.PI,
        appear: rand() * 0.22,
        kept: 0,
        dock: -1,
        lag: rand() * 0.12
      });
    }
    // une poignée de références retenues : quatre rejoignent leur place, les autres sont absorbées
    var keptIdx = [];
    while (keptIdx.length < 16) {
      var k = Math.floor(rand() * parts.length);
      if (keptIdx.indexOf(k) === -1 && parts[k].r > 0.5) keptIdx.push(k);
    }
    keptIdx.forEach(function (k, n) { parts[k].kept = 1; if (n < 4) parts[k].dock = n; parts[k].s = 2.6; });
  }

  /* ---------- Dimensions ---------- */
  var size = 0, dpr = 1;
  function resize() {
    var r = field.getBoundingClientRect();
    size = Math.max(200, r.width);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(size * dpr);
    canvas.height = Math.round(size * dpr);
    build(isMobile.matches ? 200 : 340);
  }

  /* ---------- Progression : défilement lissé ---------- */
  var target = 0, shown = 0;
  function readProgress() {
    if (reduceMotion.matches) { target = 1; return; }
    // sans épinglage : l'animation avance pendant que la scène traverse l'écran
    var vh = window.innerHeight;
    var f = field.getBoundingClientRect();
    var c = f.top + f.height / 2;
    var from = vh * (isMobile.matches ? 0.98 : 1.02), to = vh * (isMobile.matches ? 0.3 : 0.4);
    target = clamp((from - c) / (from - to), 0, 1);
  }

  /* ---------- Rendu ---------- */
  var hexPts = [0, 1, 2, 3, 4, 5].map(function (i) { var a = Math.PI / 6 + i * Math.PI / 3; return [Math.cos(a), Math.sin(a)]; });
  function hex(x, y, s) {
    ctx.beginPath();
    ctx.moveTo(x + hexPts[0][0] * s, y + hexPts[0][1] * s);
    for (var i = 1; i < 6; i++) ctx.lineTo(x + hexPts[i][0] * s, y + hexPts[i][1] * s);
    ctx.closePath();
  }
  var glow = document.createElement('canvas');
  glow.width = glow.height = 64;
  (function () {
    var g = glow.getContext('2d');
    var gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(160,190,255,0.9)');
    gr.addColorStop(0.35, 'rgba(70,110,255,0.35)');
    gr.addColorStop(1, 'rgba(43,89,255,0)');
    g.fillStyle = gr;
    g.fillRect(0, 0, 64, 64);
  })();

  var time = 0;
  function render(p) {
    var R = size / 2;
    var cx = R, cy = R;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);

    var calm = reduceMotion.matches;
    var phaseScan = smooth(0.3, 0.62, p);     // l'anneau s'étend
    var gatherT = smooth(0.62, 0.92, p);      // les retenues convergent

    // orbites discrètes
    ctx.save();
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 7]);
    [0.48, 0.78].forEach(function (rr, i) {
      ctx.lineDashOffset = (calm ? 0 : time * (i ? -6 : 9));
      ctx.strokeStyle = 'rgba(127,160,255,' + (0.14 - 0.04 * i) + ')';
      ctx.beginPath(); ctx.arc(cx, cy, R * rr, 0, Math.PI * 2); ctx.stroke();
    });
    ctx.restore();

    // anneau de tri
    var scanR = (0.14 + phaseScan * 0.9) * R;
    var scanA = smooth(0.26, 0.34, p) * (1 - smooth(0.6, 0.68, p));
    if (scanA > 0.01) {
      var grd = ctx.createRadialGradient(cx, cy, Math.max(0, scanR - R * 0.12), cx, cy, scanR);
      grd.addColorStop(0, 'rgba(43,89,255,0)');
      grd.addColorStop(1, 'rgba(43,89,255,' + (0.16 * scanA) + ')');
      ctx.fillStyle = grd;
      ctx.beginPath(); ctx.arc(cx, cy, scanR, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(160,190,255,' + (0.75 * scanA) + ')';
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(cx, cy, scanR, 0, Math.PI * 2); ctx.stroke();
    }

    // références
    for (var i = 0; i < parts.length; i++) {
      var q = parts[i];
      var ang = q.a0 + (calm ? 0 : time * q.w);
      var appear = smooth(q.appear, q.appear + 0.12, p + 0.1);
      var scanned = scanR / R > q.r ? smooth(0, 0.08, scanR / R - q.r) : 0;
      if (phaseScan >= 1) scanned = 1;
      var rr = q.r;
      var x = cx + Math.cos(ang) * rr * R;
      var y = cy + Math.sin(ang) * rr * R * 0.92;
      var alpha, col, sz = q.s;

      if (!q.kept) {
        // écartée : s'éteint et s'éloigne doucement
        rr = q.r + scanned * 0.06 + gatherT * 0.05;
        x = cx + Math.cos(ang) * rr * R;
        y = cy + Math.sin(ang) * rr * R * 0.92;
        alpha = appear * (0.55 - 0.42 * scanned - 0.1 * gatherT);
        col = scanned > 0.5 ? '120,132,170' : '190,205,255';
      } else {
        alpha = appear * (0.6 + 0.4 * scanned);
        col = scanned > 0.3 ? '127,160,255' : '190,205,255';
        sz = q.s * (1 + 0.35 * scanned);
        var g = clamp((gatherT - q.lag) / (1 - q.lag), 0, 1);
        var e = easeInOut(g);
        if (q.dock > -1) {
          var tx = DOCK_POS[q.dock][0] * size, ty = DOCK_POS[q.dock][1] * size;
          // trajectoire courbe vers la place de la référence
          var mx = (x + tx) / 2 + (cy - (y + ty) / 2) * 0.25;
          var my = (y + ty) / 2 + ((x + tx) / 2 - cx) * 0.25;
          var u = 1 - e;
          x = u * u * x + 2 * u * e * mx + e * e * tx;
          y = u * u * y + 2 * u * e * my + e * e * ty;
          sz = sz * (1 + e * 1.4);
          alpha *= 1 - smooth(0.82, 0.96, e); // la cellule DOM prend le relais
        } else {
          // absorbée par la ruche, en spirale
          var sr = rr * (1 - e);
          var sa = ang + e * 2.2;
          x = cx + Math.cos(sa) * sr * R;
          y = cy + Math.sin(sa) * sr * R * 0.92;
          alpha *= 1 - smooth(0.7, 1, e);
        }
        if (scanned > 0.3 && alpha > 0.05) {
          var gs = sz * 9;
          ctx.globalCompositeOperation = 'lighter';
          ctx.globalAlpha = alpha * 0.55;
          ctx.drawImage(glow, x - gs / 2, y - gs / 2, gs, gs);
          ctx.globalCompositeOperation = 'source-over';
        }
      }
      if (alpha <= 0.01) continue;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = 'rgb(' + col + ')';
      hex(x, y, sz);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // DOM : la ruche, les cellules posées, les flux, le texte
    var dockIn = smooth(0.84, 0.95, p);
    docks.forEach(function (d, n) {
      var v = smooth(0.84 + n * 0.012, 0.95 + n * 0.012, p);
      d.style.setProperty('--in', v.toFixed(3));
    });
    field.style.setProperty('--feed', smooth(0.92, 0.99, p).toFixed(3));
    if (core) core.style.setProperty('--pulse', (0.4 + 0.6 * smooth(0.66, 0.9, p)).toFixed(3));
    var current = p < 0.33 ? 0 : p < 0.66 ? 1 : 2;
    beats.forEach(function (b, n) {
      b.classList.toggle('is-on', n <= current);
      b.classList.toggle('is-current', n === current);
    });
    field.classList.toggle('is-docked', dockIn > 0.98);
  }

  /* ---------- Boucle ---------- */
  var running = false, raf = 0, last = 0, visible = false;
  function frame(now) {
    if (!running) return;
    var dt = Math.min(0.05, (now - last) / 1000 || 0);
    last = now;
    time += dt;
    readProgress();
    // le lissage donne l'inertie : la scène suit le défilement sans à-coup
    shown += (target - shown) * Math.min(1, dt * 4.5);
    render(shown);
    raf = requestAnimationFrame(frame);
  }
  function start() {
    if (running || !visible || document.hidden) return;
    if (reduceMotion.matches) { shown = 1; render(1); return; }
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }
  function stop() { running = false; cancelAnimationFrame(raf); }

  resize();
  readProgress();
  shown = target;
  render(shown);
  section.classList.add('is-live');

  if ('ResizeObserver' in window) {
    var rt = 0;
    new ResizeObserver(function () { clearTimeout(rt); rt = setTimeout(function () { resize(); render(shown); }, 120); }).observe(field);
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible) start(); else stop();
    }, { threshold: 0 }).observe(section);
  } else { visible = true; start(); }
  document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else start(); });
})();
