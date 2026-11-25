// Stardust cursor, site-wide: a twinkling star with a trail of sparkles
// replaces the mouse pointer. Adapted from experiments/stardust-cursor.html.
// JS only writes --x/--y/--angle/--speed and toggles .is-active / .is-near;
// the lag, trail and twinkle are CSS (see "Stardust cursor" in styles.css).
// Only on devices with a precise pointer (mouse/trackpad); touch screens keep
// their normal behaviour.
(function () {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  var box = document.createElement('div');
  box.className = 'cur cur-sparkle cur-site';
  box.setAttribute('aria-hidden', 'true');
  for (var i = 0; i < 5; i++) {
    var star = document.createElement('i');
    star.className = 'cursor';
    star.style.setProperty('--i', i);
    box.appendChild(star);
  }
  document.body.appendChild(box);
  document.documentElement.classList.add('has-stardust');

  var lx = 0, ly = 0, has = false, idle;
  function set(p, v) { box.style.setProperty(p, v); }

  window.addEventListener('pointermove', function (e) {
    if (e.pointerType === 'touch') return;
    var x = e.clientX, y = e.clientY;
    if (has) {
      var dx = x - lx, dy = y - ly, d = Math.hypot(dx, dy);
      if (d > 0.5) set('--angle', Math.atan2(dy, dx).toFixed(3) + 'rad');
      set('--speed', Math.min(1, d / 32).toFixed(3));
    } else {
      // Arriving: place the stars at the pointer instead of easing in from afar
      box.classList.add('cur-jump');
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { box.classList.remove('cur-jump'); });
      });
    }
    set('--x', x.toFixed(1) + 'px');
    set('--y', y.toFixed(1) + 'px');
    box.classList.toggle('is-near', Math.hypot(x - innerWidth / 2, y - innerHeight / 2) < 60);
    box.classList.add('is-active');
    lx = x; ly = y; has = true;
    clearTimeout(idle);
    idle = setTimeout(function () { set('--speed', '0'); }, 120);
  }, { passive: true });

  function leave() {
    box.classList.remove('is-active', 'is-near');
    set('--speed', '0');
    has = false;
  }
  document.documentElement.addEventListener('mouseleave', leave);
  window.addEventListener('blur', leave);
})();
