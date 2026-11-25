// Videos marked data-hover-play stay on their poster frame and play only while
// the pointer is over them (or over the tile that contains them).
(function () {
  document.querySelectorAll('video[data-hover-play]').forEach(function (video) {
    var target = video.closest('a, figure') || video;
    function play() { var p = video.play(); if (p && p.catch) p.catch(function () {}); }
    function stop() { video.pause(); video.currentTime = 0; }
    target.addEventListener('mouseenter', play);
    target.addEventListener('mouseleave', stop);
    target.addEventListener('focus', play);
    target.addEventListener('blur', stop);
  });
})();
