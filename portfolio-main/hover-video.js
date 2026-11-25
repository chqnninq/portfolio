// Videos marked data-hover-play rest on their final frame (the poster). Hovering
// plays them from the start; they stop on the last frame, and leaving jumps back
// to it.
(function () {
  document.querySelectorAll('video[data-hover-play]').forEach(function (video) {
    var target = video.closest('a, figure') || video;
    function play() {
      video.currentTime = 0;
      var p = video.play();
      if (p && p.catch) p.catch(function () {});
    }
    function rest() {
      video.pause();
      if (video.duration) video.currentTime = Math.max(0, video.duration - 0.05);
    }
    target.addEventListener('mouseenter', play);
    target.addEventListener('mouseleave', rest);
    target.addEventListener('focus', play);
    target.addEventListener('blur', rest);
  });
})();
