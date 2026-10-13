(() => {
  const source = new URL('assets/favicon-cat-source.png', document.currentScript.src);
  const image = new Image();
  image.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 32;
    const context = canvas.getContext('2d');
    if (!context) return;
    const frames = [];
    try {
      for (let step = 0; step < 36; step++) {
        context.clearRect(0, 0, 32, 32);
        context.save();
        context.beginPath();
        context.arc(16, 16, 16, 0, Math.PI * 2);
        context.clip();
        context.translate(16, 16);
        context.rotate(step * Math.PI * 2 / 36);
        const scale = 32 / Math.min(image.width, image.height);
        context.drawImage(image, -image.width * scale / 2, -image.height * scale / 2,
          image.width * scale, image.height * scale);
        context.restore();
        frames.push(canvas.toDataURL('image/png'));
      }
    } catch { return; }
    document.querySelectorAll('link[rel="icon"]').forEach(icon => icon.remove());
    const icon = document.createElement('link');
    icon.rel = 'icon';
    icon.type = 'image/png';
    icon.sizes = '32x32';
    icon.id = 'rotating-favicon';
    document.head.append(icon);
    let frame = 0;
    const draw = () => { icon.href = frames[frame++ % frames.length]; };
    draw();
    let timer = setInterval(draw, 120);
    window.addEventListener('pagehide', () => { clearInterval(timer); timer = null; });
    window.addEventListener('pageshow', () => { if (!timer) timer = setInterval(draw, 120); });
  };
  image.src = source.href;
})();
