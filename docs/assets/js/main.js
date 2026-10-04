/* =========================================================
   La Ruche · interactions du site
   ========================================================= */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var isMobile = window.matchMedia('(max-width: 899px)');
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var fmt = new Intl.NumberFormat('fr-FR');
  var hasIO = 'IntersectionObserver' in window;

  function onceVisible(el, cb, opts) {
    if (!el) return;
    if (!hasIO) { cb(); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { cb(); io.disconnect(); }
      });
    }, opts || { threshold: 0.25 });
    io.observe(el);
  }

  /* ---------- Année ---------- */
  $$('[data-year]').forEach(function (el) { el.textContent = String(new Date().getFullYear()); });

  /* ---------- En-tête & navigation ---------- */
  var header = $('[data-header]');
  var navToggle = $('[data-nav-toggle]');
  var navList = $('[data-nav-list]');

  function onScrollHeader() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 24);
  }
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  function setMenu(open) {
    if (!navToggle || !navList) return;
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.querySelector('.visually-hidden').textContent = open ? 'Fermer le menu' : 'Ouvrir le menu';
    navList.classList.toggle('is-open', open);
    header.classList.toggle('menu-open', open);
    document.documentElement.classList.toggle('menu-is-open', open);
    updateStickyCta();
  }
  if (navToggle) {
    navToggle.addEventListener('click', function () {
      setMenu(navToggle.getAttribute('aria-expanded') !== 'true');
    });
    navList.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        navToggle.focus();
      }
    });
    isMobile.addEventListener && isMobile.addEventListener('change', function () { setMenu(false); });
  }

  // lien de navigation actif
  var navLinks = $$('.site-nav__list a[href^="#"]:not(.btn)');
  if (hasIO && navLinks.length) {
    var sections = navLinks.map(function (a) { return $(a.getAttribute('href')); }).filter(Boolean);
    var navIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        navLinks.forEach(function (a) {
          if (a.getAttribute('href') === '#' + e.target.id) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { navIO.observe(s); });
  }

  /* ---------- Formulaire de démo : pré-remplissage ---------- */
  var demoForm = $('[data-demo-form]');

  function setInterest(value, tier) {
    if (!demoForm || !value) return;
    var radio = demoForm.querySelector('[data-interest-value="' + value + '"]');
    if (radio) radio.checked = true;
    var msg = demoForm.querySelector('#f-message');
    if (tier && msg && !msg.value.trim()) {
      msg.value = "Je souhaite recevoir le tarif de l’offre " + tier + '.';
    }
  }

  $$('[data-interest]').forEach(function (link) {
    link.addEventListener('click', function () {
      setInterest(link.getAttribute('data-interest'), link.getAttribute('data-tier'));
    });
  });

  var quick = $('[data-quick-demo]');
  if (quick && demoForm) {
    quick.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = quick.querySelector('input[type="email"]').value.trim();
      var target = demoForm.querySelector('#f-email');
      if (email && target) target.value = email;
      setInterest('demo');
      var demo = $('#demo');
      // saut direct au formulaire : le visiteur a déjà dit ce qu'il voulait
      demoForm.scrollIntoView({ behavior: 'instant', block: 'start' });
      var first = demoForm.querySelector('#f-prenom');
      if (first) first.focus({ preventScroll: true });
    });
  }

  /* ---------- Le constat ---------- */
  var problem = $('.problem');
  var dayValue = $('[data-day-value]');
  onceVisible(problem, function () {
    problem.classList.add('is-in');
    if (!dayValue) return;
    var days = [1, 2, 3, 5, 7, 9, 12, 14];
    if (reduceMotion.matches) { dayValue.textContent = 'J+14'; return; }
    var i = 0;
    var timer = setInterval(function () {
      dayValue.textContent = 'J+' + days[i];
      i++;
      if (i >= days.length) clearInterval(timer);
    }, 260);
  }, { threshold: 0.35 });

  /* ---------- Comment ça marche : démonstration ---------- */
  var ROOMS = {
    petite: {
      ref: 'LR-0141 · Petite salle',
      people: '4 participants', area: 'Salle de 12 m²', usage: 'Visioconférence',
      table: { u: [0.36, 0.64], v: [0.4, 0.6] }, seats: 4,
      screen: [0.36, 0.64, 18, 44],
      kit: [
        { icon: 'video', name: 'Barre vidéo tout-en-un', cat: 'Caméra + audio', tags: [['ok', 'Compatible'], ['ok', 'En stock']] },
        { icon: 'monitor', name: 'Écran 55" 4K', cat: 'Écran', tags: [['ok', 'En stock']] },
        { icon: 'cpu', name: 'Boîtier de salle', cat: 'Contrôle', tags: [['ok', 'Compatible']] },
        { icon: 'wrench', name: 'Pose et réglages', cat: 'Installation', tags: [['wait', 'Sous 5 j']] }
      ],
      lines: [
        ['Barre vidéo tout-en-un 4K', 1290, 1590],
        ['Écran 55" 4K', 640, 790],
        ['Boîtier de salle visio', 980, 1190],
        ['Installation et paramétrage', 450, 620]
      ],
      time: [0, 2, 51],
      expert: '· salle existante à intégrer'
    },
    reunion: {
      ref: 'LR-0142 · Salle de réunion',
      people: '12 participants', area: 'Salle de 30 m²', usage: 'Visioconférence',
      table: { u: [0.26, 0.74], v: [0.38, 0.62] }, seats: 12,
      screen: [0.3, 0.7, 14, 52],
      kit: [
        { icon: 'video', name: 'Caméra grand-angle 4K', cat: 'Caméra', tags: [['ok', 'Compatible'], ['ok', 'En stock']] },
        { icon: 'mic', name: 'Micros de table ×2', cat: 'Audio', tags: [['ok', 'Compatible']] },
        { icon: 'monitor', name: 'Écran tactile 75"', cat: 'Écran', tags: [['ok', 'En stock']] },
        { icon: 'cpu', name: 'Boîtier de salle visio', cat: 'Contrôle', tags: [['wait', 'Délai 2 j']] }
      ],
      lines: [
        ['Caméra grand-angle 4K', 1480, 1820],
        ['Micros de table ×2 + barre de son', 1160, 1430],
        ['Écran tactile 75"', 2140, 2690],
        ['Boîtier de salle visio', 1150, 1390],
        ['Installation et mise en service', 690, 920]
      ],
      time: [0, 3, 48],
      expert: '· acoustique particulière'
    },
    grande: {
      ref: 'LR-0143 · Grande salle',
      people: '20 participants', area: 'Salle de 50 m²', usage: 'Visio + présentation',
      table: { u: [0.2, 0.8], v: [0.36, 0.64] }, seats: 18,
      screen: [0.22, 0.78, 12, 58],
      kit: [
        { icon: 'video', name: 'Caméra PTZ à cadrage auto', cat: 'Caméra', tags: [['ok', 'Compatible']] },
        { icon: 'mic', name: 'Micros plafond ×2', cat: 'Audio + traitement', tags: [['wait', 'Délai 3 j']] },
        { icon: 'monitor', name: 'Double écran 86"', cat: 'Écrans', tags: [['ok', 'En stock']] },
        { icon: 'cpu', name: 'Boîtier + écran de contrôle', cat: 'Contrôle', tags: [['ok', 'Compatible']] }
      ],
      lines: [
        ['Caméra PTZ à cadrage automatique', 2450, 3020],
        ['Micros plafond ×2 + processeur audio', 2980, 3650],
        ['Double écran 86"', 5200, 6380],
        ['Boîtier de salle + écran de contrôle', 1690, 2060],
        ['Installation, câblage et réglages', 1450, 1900]
      ],
      time: [0, 4, 36],
      expert: '· grande salle, acoustique à valider'
    }
  };

  var how = $('[data-how]');
  var currentRoom = 'reunion';
  var activeStep = 1;

  function euros(n) { return fmt.format(n) + ' €'; }
  function pad(n) { return String(n).padStart(2, '0'); }

  function floorPoint(u, v) {
    // sol isométrique : L(40,150) T(210,60) F(210,240)
    return [40 + u * 170 + v * 170, 150 - u * 90 + v * 90];
  }
  function wallPoint(s, h) {
    // mur du fond à droite : de T(210,60) à R(380,150)
    return [210 + s * 170, 60 + s * 90 - h];
  }

  function renderRoom(room) {
    var svg = $('[data-room-svg]');
    if (!svg) return;
    var NS = 'http://www.w3.org/2000/svg';
    var g = $('[data-room-table]', svg);
    while (g.firstChild) g.removeChild(g.firstChild);
    var t = room.table;
    var pts = [floorPoint(t.u[0], t.v[0]), floorPoint(t.u[1], t.v[0]), floorPoint(t.u[1], t.v[1]), floorPoint(t.u[0], t.v[1])];
    var poly = document.createElementNS(NS, 'polygon');
    poly.setAttribute('class', 'table');
    poly.setAttribute('points', pts.map(function (p) { return p.join(','); }).join(' '));
    g.appendChild(poly);
    // sièges répartis sur les deux longs côtés et les bouts
    var n = room.seats;
    var perSide = Math.ceil((n - 2) / 2);
    var seats = [];
    for (var i = 0; i < perSide; i++) {
      var u = t.u[0] + (t.u[1] - t.u[0]) * (i + 0.5) / perSide;
      seats.push(floorPoint(u, t.v[0] - 0.06));
      if (seats.length < n - 2) seats.push(floorPoint(u, t.v[1] + 0.06));
    }
    seats.push(floorPoint(t.u[0] - 0.06, (t.v[0] + t.v[1]) / 2));
    seats.push(floorPoint(t.u[1] + 0.06, (t.v[0] + t.v[1]) / 2));
    seats.slice(0, n).forEach(function (p) {
      var c = document.createElementNS(NS, 'circle');
      c.setAttribute('class', 'seat');
      c.setAttribute('cx', p[0].toFixed(1));
      c.setAttribute('cy', p[1].toFixed(1));
      c.setAttribute('r', '4.2');
      g.appendChild(c);
    });
    var sc = room.screen;
    var screen = $('[data-room-screen]', svg);
    var a = wallPoint(sc[0], sc[2]), b = wallPoint(sc[1], sc[2]), c2 = wallPoint(sc[1], sc[3]), d = wallPoint(sc[0], sc[3]);
    screen.setAttribute('points', [a, b, c2, d].map(function (p) { return p.join(','); }).join(' '));
  }

  function renderKit(room) {
    $$('[data-kit-slot]').forEach(function (slot, i) {
      var item = room.kit[i];
      if (!item) { slot.innerHTML = ''; return; }
      // l'alvéole porte l'état : allumée = compatible et disponible, en attente = délai
      var waiting = item.tags.some(function (tg) { return tg[0] === 'wait'; });
      slot.classList.toggle('is-waiting', waiting);
      slot.innerHTML =
        '<span class="kit__hex"><svg class="icon" aria-hidden="true"><use href="assets/img/icons.svg#i-' + item.icon + '"/></svg></span>' +
        '<span class="kit__text"><span class="kit__name"></span><span class="kit__cat"></span><span class="kit__tags">' +
        item.tags.map(function (tg) { return '<span class="kit__tag' + (tg[0] === 'wait' ? ' kit__tag--wait' : '') + '">' + tg[1] + '</span>'; }).join('') +
        '</span></span>';
      slot.querySelector('.kit__name').textContent = item.name;
      slot.querySelector('.kit__cat').textContent = item.cat;
    });
  }

  function renderQuote(room) {
    var body = $('[data-quote-lines]');
    if (!body) return;
    body.innerHTML = '';
    var buy = 0, sell = 0;
    room.lines.forEach(function (l) {
      buy += l[1]; sell += l[2];
      var tr = document.createElement('tr');
      var th = document.createElement('th');
      th.scope = 'row';
      th.textContent = l[0];
      tr.appendChild(th);
      [euros(l[1]), euros(l[2]), Math.round((l[2] - l[1]) / l[2] * 100) + ' %'].forEach(function (v) {
        var td = document.createElement('td');
        td.textContent = v;
        tr.appendChild(td);
      });
      body.appendChild(tr);
    });
    $('[data-quote-buy]').textContent = euros(buy);
    $('[data-quote-sell]').textContent = euros(sell);
    $('[data-quote-margin]').textContent = (Math.round((sell - buy) / sell * 1000) / 10).toString().replace('.', ',') + ' %';
    $('[data-quote-ref]').textContent = room.ref;
    var sw = $('[data-stopwatch]');
    if (sw) sw.textContent = pad(room.time[0]) + ':' + pad(room.time[1]) + ':' + pad(room.time[2]);
  }

  function renderRoomChips(room) {
    var p = $('[data-room-people]'), a = $('[data-room-area]'), u = $('[data-room-usage]'), r = $('[data-ticket-reason]');
    if (p) p.textContent = room.people;
    if (a) a.textContent = room.area;
    if (u) u.textContent = room.usage;
    if (r) r.textContent = room.expert;
  }

  function applyRoom(key) {
    var room = ROOMS[key];
    if (!room) return;
    currentRoom = key;
    renderRoom(room);
    renderKit(room);
    renderQuote(room);
    renderRoomChips(room);
  }

  var stopwatchTimer = 0;
  function runStopwatch() {
    var sw = $('[data-stopwatch]');
    var room = ROOMS[currentRoom];
    if (!sw || !room) return;
    var target = room.time[1] * 60 + room.time[2];
    if (reduceMotion.matches) return;
    cancelAnimationFrame(stopwatchTimer);
    var start = performance.now();
    var dur = 1100;
    var tick = function (now) {
      var k = Math.min(1, (now - start) / dur);
      var eased = 1 - Math.pow(1 - k, 4);
      var s = Math.round(target * eased);
      sw.textContent = '00:' + pad(Math.floor(s / 60)) + ':' + pad(s % 60);
      if (k < 1) stopwatchTimer = requestAnimationFrame(tick);
    };
    stopwatchTimer = requestAnimationFrame(tick);
  }

  function setStep(n) {
    if (n === activeStep && $('.scene.is-active')) return;
    activeStep = n;
    $$('[data-step]').forEach(function (s) { s.classList.toggle('is-active', Number(s.getAttribute('data-step')) === n); });
    $$('[data-scene]').forEach(function (s) { s.classList.toggle('is-active', Number(s.getAttribute('data-scene')) === n); });
    if (n === 3) runStopwatch();
  }

  if (how) {
    applyRoom(currentRoom);
    setStep(1);
    $$('input[name="room"]', how).forEach(function (input) {
      input.addEventListener('change', function () {
        applyRoom(input.value);
        // reprendre la démonstration sur la scène affichée
        var scene = $('.scene.is-active');
        if (scene) {
          scene.classList.remove('is-active');
          void scene.offsetWidth;
          scene.classList.add('is-active');
        }
        if (activeStep === 3) runStopwatch();
      });
    });

    if (hasIO) {
      var stepIO;
      var makeStepIO = function () {
        if (stepIO) stepIO.disconnect();
        var margin = isMobile.matches ? '-58% 0px -8% 0px' : '-45% 0px -45% 0px';
        stepIO = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) setStep(Number(e.target.getAttribute('data-step')));
          });
        }, { rootMargin: margin });
        $$('[data-step]').forEach(function (s) { stepIO.observe(s); });
      };
      makeStepIO();
      isMobile.addEventListener && isMobile.addEventListener('change', makeStepIO);
    }
  }

  /* ---------- Rentabilité : compteurs (Number Ticker de Magic UI) ---------- */
  function ticker(el) {
    var target = Number(el.getAttribute('data-ticker'));
    if (!isFinite(target)) return;
    if (reduceMotion.matches) { el.textContent = fmt.format(target); return; }
    var start = performance.now();
    var dur = 1600;
    var step = function (now) {
      var k = Math.min(1, (now - start) / dur);
      // ressort amorti, sans dépassement
      var eased = 1 - Math.pow(1 - k, 3) * Math.cos(k * Math.PI * 0.5);
      el.textContent = fmt.format(Math.round(target * Math.min(1, eased)));
      if (k < 1) requestAnimationFrame(step);
      else el.textContent = fmt.format(target);
    };
    el.textContent = '0';
    requestAnimationFrame(step);
  }

  var roi = $('[data-roi]');
  var reportCells = $('[data-report-cells]');
  if (reportCells) {
    for (var c = 0; c < 14; c++) {
      var cell = document.createElement('span');
      cell.className = 'cell-hex' + ([1, 3, 4, 7, 10, 12].indexOf(c) > -1 ? ' is-signed' : '');
      reportCells.appendChild(cell);
    }
  }
  onceVisible(roi, function () {
    roi.classList.add('is-in');
    $$('[data-ticker]', roi).forEach(ticker);
  }, { threshold: 0.3 });

  /* ---------- Écosystème : faisceaux (Animated Beam de Magic UI) ---------- */
  var chain = $('[data-chain]');
  var beamSvg = $('[data-chain-beams]');
  var hub = $('[data-hub]');
  var beamAnims = [];
  var NS = 'http://www.w3.org/2000/svg';

  function center(el, origin) {
    var r = el.getBoundingClientRect();
    return { x: r.left - origin.left + r.width / 2, y: r.top - origin.top + r.height / 2 };
  }

  function drawBeams() {
    if (!chain || !beamSvg || !hub) return;
    beamAnims.forEach(function (a) { a.cancel(); });
    beamAnims = [];
    while (beamSvg.firstChild) beamSvg.removeChild(beamSvg.firstChild);
    var origin = chain.getBoundingClientRect();
    beamSvg.setAttribute('viewBox', '0 0 ' + origin.width + ' ' + origin.height);
    var hubHex = $('.chain__hub-hex', hub);
    var hubRect = hubHex.getBoundingClientRect();
    var hubPt = center(hubHex, origin);
    var vertical = window.matchMedia('(max-width: 699px)').matches;
    var nodes = $$('[data-node]', chain);
    nodes.forEach(function (node, i) {
      var hex = $('.node__hex', node);
      var p = center(hex, origin);
      var start, end, ctrl;
      if (vertical) {
        // mobile : la ruche à droite, les acteurs en colonne
        var hr = hex.getBoundingClientRect();
        start = { x: hubRect.left - origin.left + 6, y: hubPt.y };
        end = { x: hr.right - origin.left + 6, y: p.y };
        ctrl = { x: (start.x + end.x) / 2, y: end.y };
      } else {
        // bureau : les faisceaux s'arrêtent sous les étiquettes, sans les traverser
        var nr = node.getBoundingClientRect();
        start = { x: hubPt.x, y: hubRect.top - origin.top + 8 };
        end = { x: p.x, y: nr.bottom - origin.top + 10 };
        ctrl = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 + 24 };
      }
      var d = 'M' + start.x + ',' + start.y + ' Q' + ctrl.x + ',' + ctrl.y + ' ' + end.x + ',' + end.y;
      var basePath = document.createElementNS(NS, 'path');
      basePath.setAttribute('d', d);
      basePath.setAttribute('class', 'beam-base');
      basePath.setAttribute('pathLength', '100');
      beamSvg.appendChild(basePath);
      // paquets : une grappe de points lumineux qui voyage le long de l'arc, comme dans le film
      var light = document.createElementNS(NS, 'path');
      light.setAttribute('d', d);
      light.setAttribute('class', 'beam-light');
      light.setAttribute('pathLength', '100');
      beamSvg.appendChild(light);
      // l'information monte des marques et grossistes vers la ruche, et redescend vers vous, l'installateur et le client
      var inbound = node.getAttribute('data-node') === 'marques' || node.getAttribute('data-node') === 'grossistes';
      var from = inbound ? 0 : 100;
      var to = inbound ? 100 : 0;
      if (!reduceMotion.matches && light.animate) {
        var anim = light.animate(
          [{ strokeDashoffset: from }, { strokeDashoffset: to }],
          { duration: 2400, delay: i * 380, iterations: Infinity, easing: 'linear' }
        );
        beamAnims.push(anim);
      } else {
        light.style.strokeDashoffset = '60';
      }
    });
  }

  if (chain) {
    var beamsStarted = false;
    onceVisible(chain, function () { beamsStarted = true; drawBeams(); }, { threshold: 0.1 });
    if ('ResizeObserver' in window) {
      var beamTimer = 0;
      new ResizeObserver(function () {
        if (!beamsStarted) return;
        clearTimeout(beamTimer);
        beamTimer = setTimeout(drawBeams, 150);
      }).observe(chain);
    }
  }

  /* ---------- Écosystème : onglets accessibles ---------- */
  var tabsRoot = $('[data-tabs]');
  if (tabsRoot) {
    var tabs = $$('[role="tab"]', tabsRoot);
    var nodeFor = { revendeurs: 'revendeurs', marques: 'marques', grossistes: 'grossistes', installateurs: 'installateurs' };
    var selectTab = function (tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });
      if (focus) tab.focus();
      var key = tab.id.replace('tab-', '');
      $$('[data-node]').forEach(function (n) { n.classList.toggle('is-active', n.getAttribute('data-node') === nodeFor[key]); });
    };
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { selectTab(tab, false); });
      tab.addEventListener('keydown', function (e) {
        var next = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = tabs[(i + 1) % tabs.length];
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = tabs[(i - 1 + tabs.length) % tabs.length];
        else if (e.key === 'Home') next = tabs[0];
        else if (e.key === 'End') next = tabs[tabs.length - 1];
        if (next) { e.preventDefault(); selectTab(next, true); }
      });
    });
    selectTab(tabs[0], false);
  }

  /* ---------- Fonctionnalités : projecteur qui suit le pointeur (Magic Card) ---------- */
  $$('.feature').forEach(function (card) {
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
    card.addEventListener('pointerleave', function () {
      card.style.setProperty('--mx', '-500px');
      card.style.setProperty('--my', '-500px');
    });
  });

  /* ---------- Croissance ---------- */
  var growth = $('[data-growth]');
  var rooms = $('[data-rooms]');
  var roomCells = [];
  if (rooms) {
    // une ruche de salles de réunion : les alvéoles s'allument une à une, comme des projets signés
    for (var row = 0; row < 6; row++) {
      var line = document.createElement('div');
      line.className = 'rooms__row';
      for (var col = 0; col < 11; col++) {
        var cellEl = document.createElement('span');
        cellEl.className = 'rooms__cell';
        line.appendChild(cellEl);
        roomCells.push(cellEl);
      }
      rooms.appendChild(line);
    }
  }
  onceVisible(growth, function () {
    growth.classList.add('is-in');
    if (!roomCells.length) return;
    var order = roomCells.map(function (_, i) { return i; });
    var seedR = 11;
    order.sort(function () { seedR = (seedR * 16807) % 2147483647; return (seedR / 2147483647) - 0.5; });
    var lit = order.slice(0, Math.round(roomCells.length * 0.34));
    lit.forEach(function (idx, k) {
      var cellEl = roomCells[idx];
      cellEl.style.setProperty('--phase', ((k % 7) * 0.37).toFixed(2) + 's');
      if (reduceMotion.matches) cellEl.classList.add('is-lit');
      else setTimeout(function () { cellEl.classList.add('is-lit'); }, 140 + k * 70);
    });
  }, { threshold: 0.35 });

  /* ---------- Quota du mois ---------- */
  var quotaCells = $('[data-quota-cells]');
  if (quotaCells) {
    for (var q = 0; q < 40; q++) {
      var qc = document.createElement('span');
      qc.className = 'cell-hex' + (q < 32 ? ' is-used' : q < 34 ? ' is-alert' : '');
      quotaCells.appendChild(qc);
    }
  }

  /* ---------- Paliers : quota en alvéoles ---------- */
  $$('.tier__cells').forEach(function (box) {
    var n = parseInt(getComputedStyle(box).getPropertyValue('--n'), 10) || 0;
    for (var i = 0; i < n; i++) {
      var s = document.createElement('span');
      s.className = 'cell-hex';
      box.appendChild(s);
    }
  });

  /* ---------- Film : dialogue vidéo (Hero Video Dialog de Magic UI) ---------- */
  var FILMS = {
    lancement: { title: 'Le film La Ruche · 2 min', base: 'assets/media/lancement', poster: 'assets/img/poster-lancement.webp', vtt: 'assets/media/lancement.fr.vtt', transcript: 'assets/media/lancement.description.vtt' },
    explication: { title: 'Le parcours La Ruche, du besoin au devis · 2 min', base: 'assets/media/presentation', poster: 'assets/img/poster-presentation.webp', vtt: 'assets/media/presentation.fr.vtt' }
  };
  var dialog = $('[data-film-dialog]');
  var video = dialog && $('[data-film-video]', dialog);
  var transcriptBox = dialog && $('[data-film-transcript]', dialog);

  function loadTranscript(url) {
    if (!transcriptBox) return;
    transcriptBox.textContent = '';
    if (!window.fetch) return;
    fetch(url).then(function (r) { return r.ok ? r.text() : ''; }).then(function (txt) {
      var lines = txt.split(/\r?\n/).filter(function (l) {
        return l && l.indexOf('WEBVTT') !== 0 && l.indexOf('-->') === -1;
      });
      lines.forEach(function (l) {
        var p = document.createElement('p');
        p.textContent = l;
        transcriptBox.appendChild(p);
      });
    }).catch(function () {});
  }

  function openFilm(key, trigger) {
    var film = FILMS[key];
    if (!film || !dialog || !video) return;
    var small = window.matchMedia('(max-width: 900px)').matches || (navigator.connection && navigator.connection.saveData);
    while (video.firstChild) video.removeChild(video.firstChild);
    video.removeAttribute('src');
    video.poster = film.poster;
    var errBox = $('[data-film-error]', dialog);
    if (errBox) errBox.hidden = true;
    // la meilleure qualité d'abord, l'autre en secours si elle ne se charge pas
    (small ? ['-720.mp4', '-1080.mp4'] : ['-1080.mp4', '-720.mp4']).forEach(function (suffix, i, all) {
      var source = document.createElement('source');
      source.src = film.base + suffix;
      source.type = 'video/mp4';
      if (i === all.length - 1) {
        source.addEventListener('error', function () { if (errBox) errBox.hidden = false; });
      }
      video.appendChild(source);
    });
    var track = document.createElement('track');
    track.kind = 'captions';
    track.srclang = 'fr';
    track.label = 'Français';
    track.src = film.vtt;
    // les films ont déjà leur texte incrusté à l'image : sous-titres disponibles (bouton CC), pas imposés
    track.default = false;
    video.appendChild(track);
    video.load();
    $('[data-film-title]', dialog).textContent = film.title;
    loadTranscript(film.transcript || film.vtt);
    dialog._trigger = trigger;
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    var playPromise = video.play();
    if (playPromise && playPromise.catch) playPromise.catch(function () {});
  }

  function closeFilm() {
    if (!dialog) return;
    if (video) video.pause();
    if (typeof dialog.close === 'function' && dialog.open) dialog.close();
    else dialog.removeAttribute('open');
  }

  $$('[data-film]').forEach(function (btn) {
    btn.addEventListener('click', function () { openFilm(btn.getAttribute('data-film'), btn); });
  });
  if (dialog) {
    $('[data-film-close]', dialog).addEventListener('click', closeFilm);
    dialog.addEventListener('click', function (e) { if (e.target === dialog) closeFilm(); });
    dialog.addEventListener('close', function () {
      if (video) video.pause();
      if (dialog._trigger) dialog._trigger.focus();
    });
  }

  /* ---------- Bouton démo persistant (mobile) ---------- */
  var stickyCta = $('[data-sticky-cta]');
  var heroVisible = true;
  var demoVisible = false;
  var stageVisible = false;
  function updateStickyCta() {
    if (!stickyCta) return;
    var menuOpen = document.documentElement.classList.contains('menu-is-open');
    var show = !heroVisible && !demoVisible && !stageVisible && !menuOpen;
    stickyCta.classList.toggle('is-visible', show);
    document.documentElement.classList.toggle('has-sticky-cta', show);
  }
  if (stickyCta && hasIO) {
    var heroEl = $('[data-hero]');
    var demoEl = $('#demo');
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.target === heroEl) heroVisible = e.isIntersecting;
        if (e.target === demoEl) demoVisible = e.isIntersecting;
      });
      updateStickyCta();
    }, { threshold: 0 }).observe(heroEl);
    new IntersectionObserver(function (entries) {
      demoVisible = entries[0].isIntersecting;
      updateStickyCta();
    }, { rootMargin: '0px 0px -30% 0px' }).observe(demoEl);
    // pendant la démonstration en quatre temps, l'écran appartient à la scène
    var stepsEl = $('[data-steps]');
    if (stepsEl) {
      new IntersectionObserver(function (entries) {
        stageVisible = entries[0].isIntersecting;
        updateStickyCta();
      }, { threshold: 0 }).observe(stepsEl);
    }
  }

  /* ---------- Formulaire de démo : validation et envoi ---------- */
  if (demoForm) {
    var config = window.LA_RUCHE_CONFIG || {};
    var summary = $('[data-form-summary]', demoForm);
    var summaryList = $('[data-form-summary-list]', demoForm);
    var status = $('[data-form-status]', demoForm);
    var submitBtn = $('[data-submit]', demoForm);
    var submitLabel = $('[data-submit-label]', demoForm);
    var LABELS = { prenom: 'Prénom', nom: 'Nom', email: 'E-mail professionnel', telephone: 'Téléphone', societe: 'Société', activite: 'Votre activité', consentement: 'Consentement' };
    var FREE_MAIL = /@(gmail|yahoo|hotmail|outlook|live|icloud|orange|free|sfr|laposte|wanadoo|gmx|aol|protonmail|yopmail)\./i;

    var check = function (name) {
      var field = demoForm.elements[name];
      if (!field) return '';
      var v = field.type === 'checkbox' ? field.checked : String(field.value || '').trim();
      switch (name) {
        case 'prenom': return v ? '' : 'Indiquez votre prénom.';
        case 'nom': return v ? '' : 'Indiquez votre nom.';
        case 'societe': return v ? '' : 'Indiquez le nom de votre société.';
        case 'activite': return v ? '' : 'Choisissez votre activité dans la liste.';
        case 'email':
          if (!v) return 'Indiquez votre e-mail professionnel.';
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "Cette adresse e-mail semble incomplète : vérifiez le format, par exemple nom@entreprise.fr.";
          return '';
        case 'telephone':
          if (!v) return '';
          return /^[+()\d\s.\-]{8,20}$/.test(v) ? '' : 'Ce numéro de téléphone ne semble pas valide : chiffres, espaces et + uniquement.';
        case 'consentement': return v ? '' : "Cochez la case pour que nous puissions vous recontacter.";
      }
      return '';
    };

    var showError = function (name, msg) {
      var field = demoForm.elements[name];
      var err = demoForm.querySelector('[data-error-for="' + name + '"]');
      if (!field) return;
      if (msg) field.setAttribute('aria-invalid', 'true');
      else field.removeAttribute('aria-invalid');
      if (err) err.textContent = msg;
    };

    ['prenom', 'nom', 'email', 'telephone', 'societe', 'activite'].forEach(function (name) {
      var field = demoForm.elements[name];
      if (!field) return;
      field.addEventListener('blur', function () {
        if (String(field.value || '').trim() || field.getAttribute('aria-invalid')) showError(name, check(name));
      });
      field.addEventListener('input', function () {
        if (field.getAttribute('aria-invalid')) showError(name, check(name));
      });
    });
    demoForm.elements.consentement.addEventListener('change', function () {
      if (demoForm.elements.consentement.getAttribute('aria-invalid')) showError('consentement', check('consentement'));
    });

    var setBusy = function (busy) {
      submitBtn.disabled = busy;
      submitBtn.setAttribute('aria-busy', String(busy));
      submitLabel.textContent = busy ? 'Envoi en cours…' : 'Envoyer ma demande';
    };

    var setStatus = function (kind, title, html) {
      status.className = 'form-status' + (kind ? ' is-' + kind : '');
      status.innerHTML = '';
      if (!title) return;
      var strong = document.createElement('strong');
      strong.textContent = title;
      status.appendChild(strong);
      if (html) {
        var p = document.createElement('span');
        p.innerHTML = html;
        status.appendChild(p);
      }
    };

    var collect = function () {
      var data = {};
      ['prenom', 'nom', 'email', 'telephone', 'societe', 'activite', 'interet', 'message'].forEach(function (k) {
        var f = demoForm.elements[k];
        data[k] = f ? String(f.value || '').trim() : '';
      });
      return data;
    };

    var mailtoFor = function (d) {
      var body = [
        'Bonjour,', '',
        'Je souhaite : ' + d.interet,
        '', 'Prénom : ' + d.prenom, 'Nom : ' + d.nom, 'E-mail : ' + d.email,
        'Téléphone : ' + (d.telephone || '-'), 'Société : ' + d.societe, 'Activité : ' + d.activite,
        '', 'Projet : ' + (d.message || '-')
      ].join('\n');
      return 'mailto:' + encodeURIComponent(config.contactEmail) +
        '?subject=' + encodeURIComponent('La Ruche · ' + d.interet + ' · ' + d.societe) +
        '&body=' + encodeURIComponent(body);
    };

    var success = function (d) {
      setStatus('success', 'Merci ' + d.prenom + ', votre demande est bien partie.',
        "Nous revenons vers vous à l’adresse " + d.email.replace(/[<>&"]/g, '') + ' pour fixer un créneau.');
      demoForm.reset();
      status.setAttribute('tabindex', '-1');
      status.focus();
    };

    demoForm.addEventListener('submit', function (e) {
      e.preventDefault();
      setStatus('', '');
      var names = ['prenom', 'nom', 'email', 'telephone', 'societe', 'activite', 'consentement'];
      var errors = [];
      names.forEach(function (n) {
        var msg = check(n);
        showError(n, msg);
        if (msg) errors.push([n, msg]);
      });

      if (errors.length) {
        summaryList.innerHTML = '';
        errors.forEach(function (err) {
          var li = document.createElement('li');
          var a = document.createElement('a');
          var field = demoForm.elements[err[0]];
          a.href = '#' + (field.id || '');
          a.textContent = LABELS[err[0]] + ' : ' + err[1];
          a.addEventListener('click', function (ev) { ev.preventDefault(); field.focus(); });
          li.appendChild(a);
          summaryList.appendChild(li);
        });
        summary.hidden = false;
        summary.focus();
        return;
      }
      summary.hidden = true;

      // anti-spam : champ piège rempli = robot, on ne transmet rien
      if (demoForm.elements.site_web && demoForm.elements.site_web.value) {
        success(collect());
        return;
      }

      var data = collect();
      if (FREE_MAIL.test(data.email)) data.note = 'Adresse e-mail non professionnelle';

      if (config.formEndpoint) {
        setBusy(true);
        var payload = Object.assign({}, data, {
          subject: 'La Ruche · ' + data.interet + ' · ' + data.societe,
          from_name: 'Site La Ruche'
        });
        if (config.web3formsKey) payload.access_key = config.web3formsKey;
        fetch(config.formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(payload)
        }).then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          setBusy(false);
          success(data);
        }).catch(function () {
          setBusy(false);
          var fallback = config.contactEmail
            ? ' Vous pouvez aussi <a href="' + mailtoFor(data) + '">nous écrire directement</a>.'
            : '';
          setStatus('error', "L’envoi n’a pas abouti.", 'Vérifiez votre connexion puis réessayez : vos informations sont conservées.' + fallback);
          status.setAttribute('tabindex', '-1');
          status.focus();
        });
        return;
      }

      if (config.contactEmail) {
        window.location.href = mailtoFor(data);
        setStatus('success', 'Votre messagerie va s’ouvrir avec la demande pré-remplie.',
          'Il ne reste qu’à l’envoyer. Si rien ne s’ouvre, écrivez-nous à <a href="mailto:' + encodeURIComponent(config.contactEmail) + '">' + config.contactEmail.replace(/[<>&"]/g, '') + '</a>.');
        return;
      }

      setStatus('error', 'Les demandes en ligne ouvrent très bientôt.',
        'Le formulaire n’est pas encore relié à notre messagerie : vos informations sont conservées sur cette page, réessayez dans quelques jours.');
      status.setAttribute('tabindex', '-1');
      status.focus();
    });
  }
})();
