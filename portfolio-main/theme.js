// Light/dark switch. The page's inline <head> script has already set
// <html data-theme> from the saved choice (or the system setting), so this
// file only handles clicks and keeps the button label in sync.
(function () {
  var root = document.documentElement;

  // Transitions stay off while the page loads (see :root[data-loading] in
  // styles.css), so a hover style picked up on arrival — e.g. the cursor still
  // resting on the link just clicked — snaps on instead of visibly fading in.
  function doneLoading() {
    requestAnimationFrame(function () {
      setTimeout(function () {
        delete root.dataset.loading;
      }, 150);
    });
  }
  if (document.readyState === 'complete') doneLoading();
  else window.addEventListener('load', doneLoading);

  var button = document.querySelector('.theme-toggle');
  if (!button) return;

  function label() {
    var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    button.setAttribute('aria-label', 'Switch to ' + next + ' mode');
    button.title = 'Switch to ' + next + ' mode';
  }

  button.addEventListener('click', function () {
    var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch (e) {}
    label();
  });

  label();
})();
