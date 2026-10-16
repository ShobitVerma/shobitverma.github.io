(() => {
  const frameScript = new URL('assets/favicon-frames.js', document.currentScript.src);
  let frames = null;
  let frame = 0;
  let timer = null;

  function draw() {
    if (!frames?.length) return;
    const previous = document.getElementById('rotating-favicon');
    const icon = document.createElement('link');
    icon.id = 'rotating-favicon';
    icon.rel = 'icon';
    icon.type = 'image/png';
    icon.sizes = '32x32';
    icon.href = frames[frame++ % frames.length];
    if (previous) previous.replaceWith(icon);
    else {
      document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]').forEach(link => link.remove());
      document.head.append(icon);
    }
  }

  function start() {
    if (!frames?.length || timer !== null) return;
    draw();
    timer = setInterval(draw, 150);
  }
  function stop() {
    clearInterval(timer);
    timer = null;
  }

  const script = document.createElement('script');
  script.src = frameScript.href;
  script.onload = () => {
    frames = window.portfolioFaviconFrames;
    start();
  };
  document.head.append(script);
  window.addEventListener('pagehide', stop);
  window.addEventListener('pageshow', start);
})();
