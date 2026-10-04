/* =========================================================
   La Ruche · la ruche en 3D (WebGL 2)
   Un plan d'alvéoles en relief, comme dans le film de
   lancement : la caméra dérive lentement, les acteurs du
   marché s'allument tour à tour et l'information glisse
   vers vous, la cellule rouge, en traits de lumière.
   Deux scènes : le hero (avec étiquettes) et le final.
   Sans WebGL 2, l'image fixe du film reste affichée.
   ========================================================= */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- Acteurs ---------- */
  var KEYS = ['vous', 'marques', 'grossistes', 'installateurs', 'experts', 'client'];
  var ACTORS = {
    vous:          { x: 0,    z: 10, dir: 0 },
    marques:       { x: -7.5, z: 6,  dir: 1 },
    grossistes:    { x: -5.5, z: 18, dir: 1 },
    installateurs: { x: 6,    z: 19, dir: 1 },
    experts:       { x: 8.5,  z: 8,  dir: 1 },
    client:        { x: 1.5,  z: 0,  dir: -1 }
  };
  // grappes lointaines : le reste du marché, discret, pour habiter le haut et la gauche
  var DECOR = [
    { x: -21, z: 23 }, { x: -30, z: 33 }, { x: -15, z: 37 }, { x: -33, z: 14 },
    { x: 5, z: 38 }, { x: 21, z: 35 }, { x: -24, z: 4 }, { x: 30, z: 22 }
  ];
  var DECOR_LINKS = [[0, 1], [0, 2], [3, 0], [6, 0], [2, 4], [4, 5], [5, 7], [0, -1], [4, -1]];
  var ORDER = ['marques', 'grossistes', 'installateurs', 'experts', 'client', 'vous'];
  var INFO = {
    vous: ['Vous', 'Vous décrivez la salle. Tout ce qu’il faut pour la vendre arrive à vous.'],
    marques: ['Marques', 'Catalogues, fiches techniques, compatibilités, et les meilleurs prix négociés.'],
    grossistes: ['Grossistes', 'Prix, niveaux de stock et délais de livraison, consultés en temps réel.'],
    installateurs: ['Installateurs', 'Disponibilités et missions d’installation ou de maintenance, près du projet.'],
    experts: ['Experts InovElite', 'Les règles du configurateur, et un relais humain pour les projets complexes.'],
    client: ['Client final', 'Une préconisation chiffrée en PDF, prête à valider. Le client reste le vôtre.']
  };

  /* ---------- Grille d'alvéoles (sommet plat), partagée par les deux scènes ---------- */
  var SQ3 = Math.sqrt(3);
  var seed = 7;
  function rand() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
  function snap(o) {
    var q = Math.round(o.x / 1.5);
    var r = Math.round(o.z / SQ3 - q / 2);
    o.x = q * 1.5; o.z = SQ3 * (r + q / 2);
  }
  KEYS.forEach(function (k) { snap(ACTORS[k]); });
  DECOR.forEach(snap);

  var cells = [];
  (function buildCells() {
    var you = ACTORS.vous;
    for (var q = -30; q <= 30; q++) {
      for (var r = -30; r <= 42; r++) {
        var x = q * 1.5;
        var z = SQ3 * (r + q / 2);
        if (z < -12 || z > 52 || Math.abs(x) > 46) continue;
        var lit = 0, height = 0.08 + rand() * 0.14, kind = 0, owner = -1;
        for (var i = 0; i < KEYS.length; i++) {
          var a = ACTORS[KEYS[i]];
          var d = Math.hypot(x - a.x, z - a.z);
          if (d < 0.2) { lit = 1; height = 1.0; kind = KEYS[i] === 'vous' ? 2 : 1; owner = i; }
          else if (d < 2.1 && lit < 0.9) { lit = 0.55 + rand() * 0.3; height = 0.4 + rand() * 0.28; owner = i; }
          else if (d < 3.5 && lit < 0.5 && rand() < 0.3) { lit = 0.28 + rand() * 0.2; height = Math.max(height, 0.2 + rand() * 0.16); owner = i; }
        }
        if (!lit) {
          for (var j = 0; j < DECOR.length; j++) {
            var dd = Math.hypot(x - DECOR[j].x, z - DECOR[j].z);
            if (dd < 0.2) { lit = 0.62; height = 0.62; break; }
            if (dd < 2.1 && rand() < 0.72) { lit = 0.3 + rand() * 0.18; height = 0.26 + rand() * 0.22; break; }
            if (dd < 3.4 && rand() < 0.16) { lit = 0.22 + rand() * 0.1; height = 0.18 + rand() * 0.12; break; }
          }
        }
        var ring = Math.hypot(x - you.x, z - you.z);
        if (!lit && ring > 12.6 && ring < 14.6 && rand() < 0.38) { lit = 0.22 + rand() * 0.22; height = 0.16 + rand() * 0.2; }
        if (!lit && rand() < 0.016) { lit = 0.26 + rand() * 0.28; height = 0.18 + rand() * 0.26; }
        cells.push({ x: x, z: z, h: height, lit: lit, kind: kind, owner: owner, phase: rand() * Math.PI * 2 });
      }
    }
  })();

  /* ---------- Arcs (chemins 3D) ---------- */
  function arcPath(from, to, lift, y0) {
    var pts = [];
    var N = 56;
    for (var i = 0; i <= N; i++) {
      var t = i / N;
      pts.push([from.x + (to.x - from.x) * t, y0 + 4 * t * (1 - t) * lift, from.z + (to.z - from.z) * t]);
    }
    return pts;
  }
  var ARCS = [];
  KEYS.forEach(function (k, idx) {
    if (k === 'vous') return;
    var a = ACTORS[k], you = ACTORS.vous;
    var from = a.dir >= 0 ? a : you, to = a.dir >= 0 ? you : a;
    var dist = Math.hypot(from.x - to.x, from.z - to.z);
    ARCS.push({ key: k, idx: idx, pts: arcPath(from, to, 2.4 + dist * 0.3, 1.1), offset: rand(), speed: 0.24 + rand() * 0.05, ambient: false });
  });
  DECOR_LINKS.forEach(function (l) {
    var a = DECOR[l[0]], b = l[1] === -1 ? ACTORS.vous : DECOR[l[1]];
    var dist = Math.hypot(a.x - b.x, a.z - b.z);
    ARCS.push({ key: null, idx: -1, pts: arcPath(a, b, 1.6 + dist * 0.18, 0.8), offset: rand(), speed: 0.07 + rand() * 0.04, ambient: true });
  });

  /* ---------- Géométrie : un prisme hexagonal ---------- */
  var GEO = (function () {
    var v = [];
    for (var j = 0; j < 6; j++) {
      var a0 = j * Math.PI / 3, a1 = ((j + 1) % 6) * Math.PI / 3;
      v.push(0, 1, 0, 0, 1, 0);
      v.push(Math.cos(a0), 1, Math.sin(a0), 0, 1, 0);
      v.push(Math.cos(a1), 1, Math.sin(a1), 0, 1, 0);
      var m = (j * Math.PI / 3 + (j + 1) * Math.PI / 3) / 2;
      var nx = Math.cos(m), nz = Math.sin(m);
      v.push(Math.cos(a0), 1, Math.sin(a0), nx, 0, nz);
      v.push(Math.cos(a1), 1, Math.sin(a1), nx, 0, nz);
      v.push(Math.cos(a1), 0, Math.sin(a1), nx, 0, nz);
      v.push(Math.cos(a0), 1, Math.sin(a0), nx, 0, nz);
      v.push(Math.cos(a1), 0, Math.sin(a1), nx, 0, nz);
      v.push(Math.cos(a0), 0, Math.sin(a0), nx, 0, nz);
    }
    return new Float32Array(v);
  })();
  var INST = (function () {
    var arr = new Float32Array(cells.length * 7);
    cells.forEach(function (c, i) { arr.set([c.x, c.z, c.h, c.lit, c.kind, c.phase, c.owner], i * 7); });
    return arr;
  })();

  /* ---------- Shaders ---------- */
  var CELL_VS = '#version 300 es\n' +
    'layout(location=0) in vec3 aPos;\n' +
    'layout(location=1) in vec3 aNormal;\n' +
    'layout(location=2) in vec2 aOffset;\n' +
    'layout(location=3) in float aHeight;\n' +
    'layout(location=4) in float aLit;\n' +
    'layout(location=5) in float aKind;\n' +
    'layout(location=6) in float aPhase;\n' +
    'layout(location=7) in float aOwner;\n' +
    'uniform mat4 uViewProj; uniform float uTime; uniform float uRise; uniform float uFocus[6];\n' +
    'out vec3 vNormal; out float vLit; out float vKind; out float vDepth; out float vFocus; out float vRise;\n' +
    'void main(){\n' +
    '  float focus = 0.0;\n' +
    '  if (aOwner > -0.5) { focus = uFocus[int(aOwner + 0.5)]; }\n' +
    '  float stagger = clamp(uRise * 1.6 - fract(aPhase * 0.159) * 0.6, 0.0, 1.0);\n' +
    '  float rise = 1.0 - pow(1.0 - stagger, 3.0);\n' +
    '  float breathe = aLit > 0.0 ? 0.05 * sin(uTime * 0.9 + aPhase) * aLit : 0.0;\n' +
    '  float h = max(0.02, aHeight * rise + breathe + focus * 0.22 * aLit);\n' +
    '  vec3 p = vec3(aPos.x * 0.9 + aOffset.x, aPos.y * h, aPos.z * 0.9 + aOffset.y);\n' +
    '  vNormal = aNormal; vLit = aLit; vKind = aKind; vFocus = focus; vRise = rise;\n' +
    '  gl_Position = uViewProj * vec4(p, 1.0);\n' +
    '  vDepth = gl_Position.w;\n' +
    '}\n';
  var CELL_FS = '#version 300 es\n' +
    'precision highp float;\n' +
    'in vec3 vNormal; in float vLit; in float vKind; in float vDepth; in float vFocus; in float vRise;\n' +
    'uniform vec3 uBg; uniform float uFogNear; uniform float uFogFar;\n' +
    'out vec4 outColor;\n' +
    'void main(){\n' +
    '  vec3 dark = vec3(0.078, 0.106, 0.262);\n' +
    '  vec3 dim = vec3(0.110, 0.150, 0.390);\n' +
    '  vec3 blue = vec3(0.169, 0.349, 1.0);\n' +
    '  vec3 soft = vec3(0.498, 0.627, 1.0);\n' +
    '  vec3 base = dark;\n' +
    '  if (vLit > 0.0) base = vLit < 0.5 ? mix(dim, blue, vLit * 1.7) : mix(blue, soft, (vLit - 0.5) * 1.6);\n' +
    '  if (vKind > 1.5) base = vec3(1.0, 0.176, 0.333);\n' +
    '  else if (vKind > 0.5) base = vec3(0.86, 0.9, 1.0);\n' +
    '  float isTop = step(0.5, vNormal.y);\n' +
    '  vec3 L = normalize(vec3(-0.4, 0.85, -0.5));\n' +
    '  float diff = max(dot(normalize(vNormal), L), 0.0);\n' +
    '  vec3 col = isTop > 0.5 ? base * (0.92 + 0.08 * vRise) : base * (0.22 + 0.32 * diff);\n' +
    '  float emis = isTop * (vLit * 0.32 + (vKind > 0.5 ? 0.55 : 0.0)) * (1.0 + vFocus * 0.7);\n' +
    '  col += base * emis;\n' +
    '  float fog = smoothstep(uFogNear, uFogFar, vDepth);\n' +
    '  col = mix(col, uBg, fog);\n' +
    '  outColor = vec4(col, 1.0);\n' +
    '}\n';
  var PT_VS = '#version 300 es\n' +
    'layout(location=0) in vec3 aPos; layout(location=1) in float aSize; layout(location=2) in vec4 aColor;\n' +
    'uniform mat4 uViewProj; uniform float uScale; uniform float uMaxSize;\n' +
    'out vec4 vColor;\n' +
    'void main(){ vec4 c = uViewProj * vec4(aPos, 1.0); gl_Position = c; gl_PointSize = clamp(aSize * uScale / c.w, 1.0, uMaxSize); vColor = aColor; }\n';
  var PT_FS = '#version 300 es\n' +
    'precision mediump float; in vec4 vColor; out vec4 o;\n' +
    'void main(){ vec2 d = gl_PointCoord * 2.0 - 1.0; float r = dot(d, d); if (r > 1.0) discard; float a = vColor.a * pow(1.0 - r, 2.3); o = vec4(vColor.rgb * a, a); }\n';

  /* ---------- Matrices ---------- */
  function perspective(fovy, aspect, near, far) {
    var f = 1 / Math.tan(fovy / 2), nf = 1 / (near - far);
    return new Float32Array([f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0]);
  }
  function lookAt(e, c) {
    var zx = e[0] - c[0], zy = e[1] - c[1], zz = e[2] - c[2];
    var zl = Math.hypot(zx, zy, zz); zx /= zl; zy /= zl; zz /= zl;
    var xx = zz, xy = 0, xz = -zx;
    var xl = Math.hypot(xx, xy, xz); xx /= xl; xz /= xl;
    var yx = zy * xz - zz * xy, yy = zz * xx - zx * xz, yz = zx * xy - zy * xx;
    xx = -xx; xz = -xz; // x négatifs à gauche, comme dans le film
    return new Float32Array([
      xx, yx, zx, 0, xy, yy, zy, 0, xz, yz, zz, 0,
      -(xx * e[0] + xy * e[1] + xz * e[2]), -(yx * e[0] + yy * e[1] + yz * e[2]), -(zx * e[0] + zy * e[1] + zz * e[2]), 1
    ]);
  }
  function mul(a, b) {
    var o = new Float32Array(16);
    for (var c = 0; c < 4; c++) for (var r = 0; r < 4; r++) {
      o[c * 4 + r] = a[r] * b[c * 4] + a[4 + r] * b[c * 4 + 1] + a[8 + r] * b[c * 4 + 2] + a[12 + r] * b[c * 4 + 3];
    }
    return o;
  }
  function ndc(m, x, y, z) {
    var cw = m[3] * x + m[7] * y + m[11] * z + m[15];
    return { x: (m[0] * x + m[4] * y + m[8] * z + m[12]) / cw, y: (m[1] * x + m[5] * y + m[9] * z + m[13]) / cw, w: cw };
  }
  var TARGET = (function () {
    var sx = 0, sz = 0;
    KEYS.forEach(function (k) { sx += ACTORS[k].x; sz += ACTORS[k].z; });
    return [sx / KEYS.length, 0.6, sz / KEYS.length];
  })();

  /* =========================================================
     Montage d'une scène
     ========================================================= */
  function mount(o) {
    var canvas = o.canvas, beams = o.beams, root = o.root;
    var gl = canvas.getContext('webgl2', { antialias: true, alpha: false, depth: true, powerPreference: 'high-performance' });
    if (!gl) return null;
    var bctx = beams ? beams.getContext('2d') : null;

    function compile(type, src) {
      var sh = gl.createShader(type);
      gl.shaderSource(sh, src); gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh));
      return sh;
    }
    function program(vs, fs) {
      var p = gl.createProgram();
      gl.attachShader(p, compile(gl.VERTEX_SHADER, vs));
      gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fs));
      gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
      return p;
    }
    var cellProg, ptProg;
    try { cellProg = program(CELL_VS, CELL_FS); ptProg = program(PT_VS, PT_FS); } catch (e) { return null; }

    var VERTS = GEO.length / 6;
    var cellVao = gl.createVertexArray();
    gl.bindVertexArray(cellVao);
    var gb = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, gb);
    gl.bufferData(gl.ARRAY_BUFFER, GEO, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 24, 0);
    gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 24, 12);
    var ib = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, ib);
    gl.bufferData(gl.ARRAY_BUFFER, INST, gl.STATIC_DRAW);
    [[2, 2, 0], [3, 1, 8], [4, 1, 12], [5, 1, 16], [6, 1, 20], [7, 1, 24]].forEach(function (a) {
      gl.enableVertexAttribArray(a[0]);
      gl.vertexAttribPointer(a[0], a[1], gl.FLOAT, false, 28, a[2]);
      gl.vertexAttribDivisor(a[0], 1);
    });
    gl.bindVertexArray(null);

    var ptVao = gl.createVertexArray();
    gl.bindVertexArray(ptVao);
    var pb = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pb);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 32, 0);
    gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1, 1, gl.FLOAT, false, 32, 12);
    gl.enableVertexAttribArray(2); gl.vertexAttribPointer(2, 4, gl.FLOAT, false, 32, 16);
    gl.bindVertexArray(null);

    var U = {
      vp: gl.getUniformLocation(cellProg, 'uViewProj'), time: gl.getUniformLocation(cellProg, 'uTime'),
      rise: gl.getUniformLocation(cellProg, 'uRise'), focus: gl.getUniformLocation(cellProg, 'uFocus'),
      bg: gl.getUniformLocation(cellProg, 'uBg'), fn: gl.getUniformLocation(cellProg, 'uFogNear'), ff: gl.getUniformLocation(cellProg, 'uFogFar'),
      pvp: gl.getUniformLocation(ptProg, 'uViewProj'), ps: gl.getUniformLocation(ptProg, 'uScale'), pm: gl.getUniformLocation(ptProg, 'uMaxSize')
    };
    var maxPoint = gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE)[1] || 64;

    var view = { W: 0, H: 0, dpr: 1, mobile: false, dist: 30, ox: 0, oy: 0, pitch: 0.66, yaw0: 0, fov: 0.6 };

    function camera(yaw, pitch, dist, ox, oy) {
      var eye = [
        TARGET[0] + dist * Math.sin(yaw) * Math.cos(pitch),
        TARGET[1] + dist * Math.sin(pitch),
        TARGET[2] - dist * Math.cos(yaw) * Math.cos(pitch)
      ];
      var P = perspective(view.fov, view.W / view.H, 0.5, 500);
      P[8] -= ox; P[9] -= oy; // décalage du point principal : la ruche se cale dans sa zone
      return { m: mul(P, lookAt(eye, TARGET)), f: P[5] };
    }

    function fit(box) {
      var bw = box.w / view.W * 2, bh = box.h / view.H * 2;
      var bcx = (box.x + box.w / 2) / view.W * 2 - 1;
      var bcy = 1 - (box.y + box.h / 2) / view.H * 2;
      var dist = 30;
      for (var it = 0; it < 6; it++) {
        var m = camera(view.yaw0, view.pitch, dist, 0, 0).m;
        var mnX = Infinity, mxX = -Infinity, mnY = Infinity, mxY = -Infinity;
        KEYS.forEach(function (k) {
          var p = ndc(m, ACTORS[k].x, 1.2, ACTORS[k].z);
          mnX = Math.min(mnX, p.x); mxX = Math.max(mxX, p.x); mnY = Math.min(mnY, p.y); mxY = Math.max(mxY, p.y);
        });
        dist *= Math.pow(Math.max((mxX - mnX) / (bw * 0.86), (mxY - mnY) / (bh * 0.8)), 0.9);
      }
      var fm = camera(view.yaw0, view.pitch, dist, 0, 0).m;
      var a = Infinity, b = -Infinity, c = Infinity, d = -Infinity;
      KEYS.forEach(function (k) {
        var p = ndc(fm, ACTORS[k].x, 1.2, ACTORS[k].z);
        a = Math.min(a, p.x); b = Math.max(b, p.x); c = Math.min(c, p.y); d = Math.max(d, p.y);
      });
      view.dist = dist; view.ox = bcx - (a + b) / 2; view.oy = bcy - (c + d) / 2;
    }

    function layout() {
      var rect = root.getBoundingClientRect();
      view.W = Math.max(320, rect.width);
      view.H = Math.max(300, rect.height);
      view.mobile = view.W < 900;
      view.dpr = Math.min(window.devicePixelRatio || 1, view.mobile ? 1.6 : (o.dprCap || 1.75));
      canvas.width = Math.round(view.W * view.dpr);
      canvas.height = Math.round(view.H * view.dpr);
      if (beams) { beams.width = canvas.width; beams.height = canvas.height; }
      gl.viewport(0, 0, canvas.width, canvas.height);
      var cfg = o.camera(view);
      view.pitch = cfg.pitch; view.yaw0 = cfg.yaw; view.fov = cfg.fov;
      fit(o.box(view));
    }

    /* ---------- état ---------- */
    var active = 'vous', focus = [0, 0, 0, 0, 0, 0];
    var pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    var scrollF = 0;
    var BG = [7 / 255, 10 / 255, 31 / 255];
    var pts = new Float32Array(8 * 1600);
    var start = performance.now(), lastNow = start;
    var screen = [];
    var glowSprite = document.createElement('canvas');
    glowSprite.width = glowSprite.height = 64;
    (function () {
      var g = glowSprite.getContext('2d');
      var gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      gr.addColorStop(0, 'rgba(225,235,255,0.95)');
      gr.addColorStop(0.3, 'rgba(110,145,255,0.45)');
      gr.addColorStop(1, 'rgba(43,89,255,0)');
      g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    })();

    function pushPt(n, x, y, z, size, r, g, b, a) {
      var k = n * 8;
      pts[k] = x; pts[k + 1] = y; pts[k + 2] = z; pts[k + 3] = size;
      pts[k + 4] = r; pts[k + 5] = g; pts[k + 6] = b; pts[k + 7] = a;
      return n + 1;
    }

    /* traits de lumière : un chemin continu et une traînée qui glisse */
    function drawBeams(m, t, calm, rise) {
      if (!bctx) return;
      var W = view.W, H = view.H;
      bctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
      bctx.clearRect(0, 0, W, H);
      bctx.globalCompositeOperation = 'lighter';
      bctx.lineCap = 'round';
      bctx.lineJoin = 'round';
      var arcIn = calm ? 1 : Math.max(0, Math.min(1, (t - 1.2) / 1.4));
      ARCS.forEach(function (arc) {
        var w = arc.ambient ? 0.3 : Math.max(focus[arc.idx], active === 'vous' ? 0.3 : 0);
        var n = arc.pts.length;
        for (var i = 0; i < n; i++) {
          var p = ndc(m, arc.pts[i][0], arc.pts[i][1] * rise, arc.pts[i][2]);
          screen[i] = [(p.x + 1) / 2 * W, (1 - p.y) / 2 * H];
        }
        // chemin de fond, très discret
        bctx.beginPath();
        bctx.moveTo(screen[0][0], screen[0][1]);
        for (var j = 1; j < n; j++) bctx.lineTo(screen[j][0], screen[j][1]);
        bctx.strokeStyle = 'rgba(127,160,255,' + ((arc.ambient ? 0.07 : 0.06 + 0.16 * w) * arcIn).toFixed(3) + ')';
        bctx.lineWidth = arc.ambient ? 1 : 1.2;
        bctx.stroke();
        if (w < 0.03 || arcIn <= 0) return;
        // traînée de lumière, à vitesse constante
        var tail = arc.ambient ? 0.22 : 0.3;
        var head = calm ? 0.62 : ((t * arc.speed + arc.offset) % 1) * (1 + tail);
        var SEG = 18;
        for (var s = 0; s < SEG; s++) {
          var u0 = head - tail * (1 - s / SEG), u1 = head - tail * (1 - (s + 1) / SEG);
          if (u1 <= 0 || u0 >= 1) continue;
          u0 = Math.max(0, u0); u1 = Math.min(1, u1);
          var a0 = pointAt(u0, n), a1 = pointAt(u1, n);
          var k = (s + 1) / SEG;
          var alpha = Math.pow(k, 1.7) * w * arcIn * (arc.ambient ? 0.55 : 1);
          bctx.strokeStyle = 'rgba(127,160,255,' + (alpha * 0.22).toFixed(3) + ')';
          bctx.lineWidth = (arc.ambient ? 3 : 5) * (0.5 + k);
          bctx.beginPath(); bctx.moveTo(a0[0], a0[1]); bctx.lineTo(a1[0], a1[1]); bctx.stroke();
          bctx.strokeStyle = 'rgba(225,235,255,' + (alpha * 0.9).toFixed(3) + ')';
          bctx.lineWidth = (arc.ambient ? 0.9 : 1.4) * (0.6 + k);
          bctx.beginPath(); bctx.moveTo(a0[0], a0[1]); bctx.lineTo(a1[0], a1[1]); bctx.stroke();
        }
        if (head > 0 && head < 1) {
          var hp = pointAt(head, n);
          var gs = arc.ambient ? 14 : 22;
          bctx.globalAlpha = w * arcIn * (arc.ambient ? 0.5 : 0.9);
          bctx.drawImage(glowSprite, hp[0] - gs / 2, hp[1] - gs / 2, gs, gs);
          bctx.globalAlpha = 1;
        }
      });
      bctx.globalCompositeOperation = 'source-over';
    }
    function pointAt(u, n) {
      var f = u * (n - 1), i = Math.floor(f), r = f - i;
      var a = screen[Math.min(n - 1, i)], b = screen[Math.min(n - 1, i + 1)];
      return [a[0] + (b[0] - a[0]) * r, a[1] + (b[1] - a[1]) * r];
    }

    function draw(now, still) {
      var dt = Math.min(0.05, (now - lastNow) / 1000);
      lastNow = now;
      var t = (now - start) / 1000;
      var calm = reduceMotion.matches;
      var rise = calm ? 1 : Math.min(1, t / 2.6);
      var ai = KEYS.indexOf(active);
      for (var i = 0; i < 6; i++) {
        var goal = active === 'vous' ? (i === 0 ? 1 : 0.3) : (i === ai ? 1 : 0);
        focus[i] += (goal - focus[i]) * (calm || still ? 1 : Math.min(1, dt * 2.6));
      }
      pointer.x += (pointer.tx - pointer.x) * Math.min(1, dt * 1.6);
      pointer.y += (pointer.ty - pointer.y) * Math.min(1, dt * 1.6);
      var yaw = view.yaw0 + (calm ? 0 : 0.06 * Math.sin(t * 0.07) + pointer.x * 0.05);
      var pitch = view.pitch + (calm ? 0 : 0.015 * Math.sin(t * 0.05) - pointer.y * 0.02) + scrollF * 0.14;
      var dist = view.dist * (1 + (calm ? 0 : 0.012 * Math.sin(t * 0.09)) - scrollF * 0.04);
      var cam = camera(yaw, pitch, dist, view.ox, view.oy);

      gl.clearColor(BG[0], BG[1], BG[2], 1);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.DEPTH_TEST);
      gl.disable(gl.BLEND);
      gl.useProgram(cellProg);
      gl.uniformMatrix4fv(U.vp, false, cam.m);
      gl.uniform1f(U.time, calm ? 0 : t);
      gl.uniform1f(U.rise, rise);
      gl.uniform1fv(U.focus, focus);
      gl.uniform3fv(U.bg, BG);
      gl.uniform1f(U.fn, dist * 1.05);
      gl.uniform1f(U.ff, dist * 3.1);
      gl.bindVertexArray(cellVao);
      gl.drawArraysInstanced(gl.TRIANGLES, 0, VERTS, cells.length);

      // halos doux des cellules allumées (pas de points nets)
      var n = 0;
      for (var c = 0; c < cells.length && n < 1590; c++) {
        var cell = cells[c];
        if (cell.lit < 0.55 && !cell.kind) continue;
        var f = cell.owner > -1 ? focus[cell.owner] : 0;
        var breath = calm ? 0.6 : 0.5 + 0.5 * Math.sin(t * 0.9 + cell.phase);
        var top = cell.h * rise + 0.05;
        if (cell.kind === 2) n = pushPt(n, cell.x, top, cell.z, 7.5 + f * 2, 1, 0.24, 0.4, (0.55 + 0.25 * breath) * rise);
        else if (cell.kind === 1) n = pushPt(n, cell.x, top, cell.z, 5.5 + f * 3, 0.62, 0.74, 1, (0.22 + 0.45 * f) * rise);
        else n = pushPt(n, cell.x, top, cell.z, 3.2, 0.3, 0.46, 1, (0.05 + 0.05 * breath + 0.12 * f) * rise);
      }
      gl.disable(gl.DEPTH_TEST);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE);
      gl.useProgram(ptProg);
      gl.uniformMatrix4fv(U.pvp, false, cam.m);
      gl.uniform1f(U.ps, cam.f * canvas.height / 2);
      gl.uniform1f(U.pm, maxPoint);
      gl.bindVertexArray(ptVao);
      gl.bindBuffer(gl.ARRAY_BUFFER, pb);
      gl.bufferData(gl.ARRAY_BUFFER, pts.subarray(0, n * 8), gl.DYNAMIC_DRAW);
      gl.drawArrays(gl.POINTS, 0, n);
      gl.bindVertexArray(null);

      drawBeams(cam.m, t, calm, rise);
      if (o.onFrame) o.onFrame(cam.m, view);
    }

    var api = {
      view: view,
      setActive: function (k) { active = k; },
      getActive: function () { return active; },
      setPointer: function (x, y) { pointer.tx = x; pointer.ty = y; },
      setScroll: function (f) { scrollF = f; },
      layout: layout,
      draw: draw,
      gl: gl
    };
    layout();
    return api;
  }

  /* ---------- Boucle commune ---------- */
  function runner(el, api, tick) {
    var running = false, visible = false, raf = 0;
    function loop(now) {
      if (!running) return;
      if (tick) tick(now);
      api.draw(now, false);
      raf = requestAnimationFrame(loop);
    }
    function start() {
      if (running || reduceMotion.matches || !visible || document.hidden) return;
      running = true; raf = requestAnimationFrame(loop);
    }
    function stop() { running = false; cancelAnimationFrame(raf); }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; if (visible) start(); else stop(); }, { threshold: 0.01 }).observe(el);
    } else { visible = true; }
    document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else start(); });
    if (reduceMotion.addEventListener) reduceMotion.addEventListener('change', function () { stop(); start(); api.draw(performance.now(), true); });
    var rt = 0, lw = 0, lh = 0;
    function onResize() {
      var r = el.getBoundingClientRect();
      if (Math.abs(r.width - lw) < 2 && Math.abs(r.height - lh) < 120) return;
      lw = r.width; lh = r.height;
      clearTimeout(rt);
      rt = setTimeout(function () { api.layout(); api.draw(performance.now(), true); }, 120);
    }
    var r0 = el.getBoundingClientRect(); lw = r0.width; lh = r0.height;
    if ('ResizeObserver' in window) new ResizeObserver(onResize).observe(el);
    else window.addEventListener('resize', onResize);
    return { start: start, stop: stop };
  }

  /* =========================================================
     Scène 1 : le hero
     ========================================================= */
  function initHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) return;
    var canvas = hero.querySelector('[data-hive-canvas]');
    var beams = hero.querySelector('[data-hive-beams]');
    var stage = hero.querySelector('[data-hive-stage]');
    if (!canvas) return;
    var caption = hero.querySelector('[data-hive-caption]');
    var captionWho = caption && caption.querySelector('.hive-caption__who');
    var captionWhat = caption && caption.querySelector('.hive-caption__what');
    var actorEls = {};
    hero.querySelectorAll('[data-actor]').forEach(function (el) { actorEls[el.getAttribute('data-actor')] = el; });
    var lastPos = {};

    var api = mount({
      root: hero, canvas: canvas, beams: beams,
      camera: function (v) { return v.mobile ? { pitch: 0.76, yaw: 0, fov: 0.7 } : { pitch: 0.66, yaw: -0.05, fov: 0.6 }; },
      box: function (v) {
        var hr = hero.getBoundingClientRect();
        if (v.mobile) {
          var tt = hero.querySelector('.hero__title'), ll = hero.querySelector('.hero__lead');
          var tb = tt ? tt.getBoundingClientRect().bottom - hr.top : 260;
          var lt = ll ? ll.getBoundingClientRect().top - hr.top : tb + 260;
          if (stage) {
            stage.style.setProperty('--mask-a', Math.round(tb - 6) + 'px');
            stage.style.setProperty('--mask-b', Math.round(tb + 30) + 'px');
            stage.style.setProperty('--mask-c', Math.round(lt - 34) + 'px');
            stage.style.setProperty('--mask-d', Math.round(lt + 2) + 'px');
          }
          return { x: v.W * 0.2, y: tb + 56, w: v.W * 0.6, h: Math.max(110, lt - tb - 92) };
        }
        var lead = hero.querySelector('.hero__lead'), title = hero.querySelector('.hero__title');
        var textRight = lead ? lead.getBoundingClientRect().right - hr.left : v.W * 0.5;
        var titleBottom = title ? title.getBoundingClientRect().bottom - hr.top : v.H * 0.24;
        var bx = Math.max(v.W * 0.52, textRight + 64);
        var by = Math.max(v.H * 0.24, titleBottom + 40);
        return { x: bx, y: by, w: Math.max(260, v.W - bx - v.W * 0.05), h: Math.max(240, v.H * 0.82 - by) };
      },
      onFrame: function (m, v) {
        KEYS.forEach(function (k) {
          var el = actorEls[k];
          if (!el) return;
          var p = ndc(m, ACTORS[k].x, 1.15, ACTORS[k].z);
          var x = (p.x + 1) / 2 * v.W, y = (1 - p.y) / 2 * v.H;
          var lp = lastPos[k];
          if (lp && Math.abs(lp[0] - x) < 0.25 && Math.abs(lp[1] - y) < 0.25) return;
          lastPos[k] = [x, y];
          el.style.setProperty('--ax', x.toFixed(1) + 'px');
          el.style.setProperty('--ay', y.toFixed(1) + 'px');
        });
      }
    });
    if (!api) return;

    var userUntil = 0, cycleIndex = -1, lastCycle = 0;
    function setActive(key, fromUser) {
      if (!INFO[key]) return;
      api.setActive(key);
      Object.keys(actorEls).forEach(function (k) { actorEls[k].classList.toggle('is-active', k === key); });
      if (caption) {
        caption.setAttribute('data-who', key);
        caption.classList.remove('is-swapping'); void caption.offsetWidth; caption.classList.add('is-swapping');
        if (captionWho) captionWho.textContent = INFO[key][0];
        if (captionWhat) captionWhat.textContent = INFO[key][1];
      }
      if (fromUser) userUntil = performance.now() + 9000;
      if (reduceMotion.matches) api.draw(performance.now(), true);
    }
    Object.keys(actorEls).forEach(function (k) {
      var el = actorEls[k];
      el.addEventListener('mouseenter', function () { setActive(k, true); });
      el.addEventListener('focus', function () { setActive(k, true); });
      el.addEventListener('click', function () { setActive(k, true); });
    });

    canvas.addEventListener('webglcontextlost', function (e) { e.preventDefault(); loop.stop(); hero.classList.remove('is-live'); });
    hero.classList.add('is-live');
    setActive('vous', false);
    api.draw(performance.now(), true);

    var loop = runner(hero, api, function (now) {
      if (now > userUntil && now - lastCycle > 4600) {
        lastCycle = now;
        cycleIndex = (cycleIndex + 1) % ORDER.length;
        setActive(ORDER[cycleIndex], false);
      }
    });
    if (!reduceMotion.matches) {
      hero.addEventListener('pointermove', function (e) {
        if (e.pointerType !== 'mouse') return;
        var r = hero.getBoundingClientRect();
        api.setPointer((e.clientX - r.left) / r.width * 2 - 1, (e.clientY - r.top) / r.height * 2 - 1);
      });
      hero.addEventListener('pointerleave', function () { api.setPointer(0, 0); });
      window.addEventListener('scroll', function () {
        api.setScroll(Math.max(0, Math.min(1, window.scrollY / Math.max(1, api.view.H))));
      }, { passive: true });
    }
    loop.start();
  }

  /* =========================================================
     Scène 2 : le final (demande de démo)
     ========================================================= */
  function initFinale() {
    var finale = document.querySelector('[data-finale]');
    if (!finale) return;
    var canvas = finale.querySelector('[data-finale-canvas]');
    var beams = finale.querySelector('[data-finale-beams]');
    if (!canvas) return;
    var api = mount({
      root: finale, canvas: canvas, beams: beams, dprCap: 1.5,
      camera: function (v) { return v.mobile ? { pitch: 0.72, yaw: 0, fov: 0.72 } : { pitch: 0.62, yaw: 0, fov: 0.6 }; },
      box: function (v) {
        return v.mobile
          ? { x: v.W * 0.1, y: v.H * 0.52, w: v.W * 0.8, h: v.H * 0.3 }
          : { x: v.W * 0.2, y: v.H * 0.5, w: v.W * 0.6, h: v.H * 0.36 };
      }
    });
    if (!api) return;
    finale.classList.add('is-live');
    api.draw(performance.now(), true);
    var cycleIndex = -1, lastCycle = 0;
    var loop = runner(finale, api, function (now) {
      if (now - lastCycle > 4200) {
        lastCycle = now;
        cycleIndex = (cycleIndex + 1) % ORDER.length;
        api.setActive(ORDER[cycleIndex]);
      }
    });
    canvas.addEventListener('webglcontextlost', function (e) { e.preventDefault(); loop.stop(); finale.classList.remove('is-live'); });
    loop.start();
  }

  function init() { initHero(); initFinale(); }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(init, init);
  else init();
})();
