// Song player (top left): plays Spotify's 30-second preview of the track
// linked in the .music widget. Nothing loads until the button is clicked.
(function () {
  var widget = document.querySelector('.music');
  if (!widget) return;
  var button = widget.querySelector('.music-sound');
  var src = widget.getAttribute('data-preview');
  var audio = null;

  function setPlaying(on) {
    widget.classList.toggle('is-playing', on);
    button.setAttribute('aria-pressed', on ? 'true' : 'false');
    var label = on ? 'Pause song' : 'Play song';
    button.setAttribute('aria-label', label);
    button.title = label;
  }

  button.addEventListener('click', function () {
    if (!audio) {
      audio = new Audio(src);
      audio.volume = 0.5;
      audio.addEventListener('ended', function () {
        audio.currentTime = 0;
        setPlaying(false);
      });
    }
    if (audio.paused) {
      audio.play().then(function () {
        setPlaying(true);
      }).catch(function () {
        setPlaying(false);
      });
    } else {
      audio.pause();
      setPlaying(false);
    }
  });

  setPlaying(false);
})();
