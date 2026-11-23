// Light/dark switch. The page's inline <head> script has already set
// <html data-theme> from the saved choice (or the system setting), so this
// file only handles clicks and keeps the button label in sync.
(function () {
  var root = document.documentElement;
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
