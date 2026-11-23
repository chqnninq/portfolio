// Interactive particle cloud behind the homepage.
// A slowly turning 3-D cloud of ink dots, drawn on a 2-D canvas (no library).
// The cloud tilts toward the cursor (parallax), and dots near the cursor are
// pushed aside and spring back. Colour follows the light/dark theme.
// Respects prefers-reduced-motion (one still frame) and pauses in background tabs.
(function () {
  var root = document.documentElement;
  var canvas = document.createElement('canvas');
  canvas.className = 'particles';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(canvas);
  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var W = 0, H = 0, dpr = 1;
  var color = '28, 28, 26';

  // --- Cloud: a soft sphere, denser toward the middle, a little flattened ---
  var COUNT = window.innerWidth < 640 ? 450 : 1100;
  var pts = [];
  for (var i = 0; i < COUNT; i++) {
    var r = Math.pow(Math.random(), 0.6);
    var theta = Math.random() * Math.PI * 2;
    var phi = Math.acos(2 * Math.random() - 1);
    pts.push({
      x: r * Math.sin(phi) * Math.cos(theta),
      y: r * Math.cos(phi) * 0.72,
      z: r * Math.sin(phi) * Math.sin(theta),
      ox: 0, oy: 0,     // displacement from the cursor push, in px
      vx: 0, vy: 0,
      size: 0.5 + Math.random() * 0.9,
    });
  }

  // --- Pointer ---
  var mouse = { x: -9999, y: -9999, nx: 0, ny: 0, active: false };
  window.addEventListener('pointermove', function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.nx = (e.clientX / W) * 2 - 1;
    mouse.ny = (e.clientY / H) * 2 - 1;
    mouse.active = true;
    if (reduceMotion) draw(0);
  }, { passive: true });
  document.addEventListener('pointerleave', function () {
    mouse.active = false;
    mouse.x = mouse.y = -9999;
  });

  // --- Theme colour ---
  function readColor() {
    var hex = getComputedStyle(root).getPropertyValue('--text').trim();
    var m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
    if (m) color = parseInt(m[1], 16) + ', ' + parseInt(m[2], 16) + ', ' + parseInt(m[3], 16);
  }
  new MutationObserver(function () {
    readColor();
    if (reduceMotion) draw(0);
  }).observe(root, { attributes: true, attributeFilter: ['data-theme'] });

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener('resize', function () {
    resize();
    if (reduceMotion) draw(0);
  });

  // --- Render ---
  var spin = 0, tiltX = 0, tiltY = 0;
  var FOCAL = 2.6, PUSH_RADIUS = 110;

  function draw(dt) {
    spin += dt * 0.05;
    // Ease the tilt toward the cursor
    var k = reduceMotion ? 1 : Math.min(1, dt * 3);
    tiltY += ((mouse.active ? mouse.nx * 0.45 : 0) - tiltY) * k;
    tiltX += ((mouse.active ? mouse.ny * 0.3 : 0) - tiltX) * k;

    var wide = W > 900;
    var cx = wide ? W * 0.76 : W * 0.5;
    var cy = H * 0.5;
    var scale = Math.min(W, H) * (wide ? 0.38 : 0.46);
    var fade = wide ? 1 : 0.55; // fainter on narrow screens, where it sits behind the text

    var ay = spin + tiltY, ax = tiltX;
    var cosY = Math.cos(ay), sinY = Math.sin(ay);
    var cosX = Math.cos(ax), sinX = Math.sin(ax);

    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < pts.length; i++) {
      var p = pts[i];
      // rotate around Y, then X
      var x1 = p.x * cosY + p.z * sinY;
      var z1 = -p.x * sinY + p.z * cosY;
      var y1 = p.y * cosX - z1 * sinX;
      var z2 = p.y * sinX + z1 * cosX;
      var s = FOCAL / (FOCAL + z2);
      var sx = cx + x1 * scale * s;
      var sy = cy + y1 * scale * s;

      // cursor push + spring back
      if (!reduceMotion) {
        var dx = sx + p.ox - mouse.x, dy = sy + p.oy - mouse.y;
        var d2 = dx * dx + dy * dy;
        if (d2 < PUSH_RADIUS * PUSH_RADIUS && d2 > 0.01) {
          var d = Math.sqrt(d2);
          var f = (1 - d / PUSH_RADIUS) * 2.2;
          p.vx += (dx / d) * f;
          p.vy += (dy / d) * f;
        }
        p.vx += -p.ox * 0.035;
        p.vy += -p.oy * 0.035;
        p.vx *= 0.86;
        p.vy *= 0.86;
        p.ox += p.vx;
        p.oy += p.vy;
      }

      var depth = (1 - z2) / 2; // 0 (far) .. 1 (near)
      var alpha = (0.1 + depth * 0.42) * fade;
      var size = p.size * s * 1.15;
      ctx.fillStyle = 'rgba(' + color + ',' + alpha.toFixed(3) + ')';
      ctx.beginPath();
      ctx.arc(sx + p.ox, sy + p.oy, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  var last = 0, running = false;
  function frame(t) {
    if (!running) return;
    var dt = last ? Math.min((t - last) / 1000, 0.05) : 0;
    last = t;
    draw(dt);
    requestAnimationFrame(frame);
  }
  function start() {
    if (running || reduceMotion) return;
    running = true;
    last = 0;
    requestAnimationFrame(frame);
  }
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) running = false;
    else start();
  });

  readColor();
  resize();
  if (reduceMotion) draw(0);
  else start();
})();
