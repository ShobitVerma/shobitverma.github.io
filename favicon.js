(() => {
  const frameScript = new URL('assets/favicon-frames.js', document.currentScript.src);
  let frames = null;
  let worker = null;
  let workerUrl = null;
  let timer = null;

  function draw() {
    if (!frames?.length) return;
    const previous = document.getElementById('rotating-favicon');
    const icon = document.createElement('link');
    icon.id = 'rotating-favicon';
    icon.rel = 'icon';
    icon.type = 'image/png';
    icon.sizes = '32x32';
    icon.href = frames[Math.floor(Date.now() / 150) % frames.length];
    if (previous) previous.replaceWith(icon);
    else {
      document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]').forEach(link => link.remove());
      document.head.append(icon);
    }
  }

  function fallback() {
    if (worker) worker.terminate();
    worker = null;
    if (workerUrl) URL.revokeObjectURL(workerUrl);
    workerUrl = null;
    if (timer === null) timer = setInterval(draw, 150);
  }
  function start() {
    if (!frames?.length || worker || timer !== null) return;
    draw();
    try {
      // A worker keeps its clock independent of main-page rendering work.
      workerUrl = URL.createObjectURL(new Blob([
        'setInterval(() => postMessage(Date.now()), 150);'
      ], { type: 'text/javascript' }));
      worker = new Worker(workerUrl);
      worker.onmessage = draw;
      worker.onerror = fallback;
    } catch {
      fallback();
    }
  }
  function stop() {
    if (worker) worker.terminate();
    worker = null;
    if (workerUrl) URL.revokeObjectURL(workerUrl);
    workerUrl = null;
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
  window.addEventListener('focus', draw);
  document.addEventListener('visibilitychange', draw);
  document.addEventListener('resume', () => { draw(); start(); });
})();
