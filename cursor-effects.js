// Shared cursor feedback for the portfolio and all project pages.
(() => {
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let ring = document.querySelector('.cursor-ring');
if (!ring) {
  ring = document.createElement('div');
  ring.className = 'cursor-ring';
  ring.setAttribute('aria-hidden', 'true');
  document.body.append(ring);
}
const cursorRing = document.querySelector('.cursor-ring');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
let cursorFrame = 0;
document.addEventListener('pointermove', event => {
  if (!finePointer.matches || reducedMotion.matches || event.pointerType === 'touch') return;
  if (cursorFrame) cancelAnimationFrame(cursorFrame);
  cursorFrame = requestAnimationFrame(() => {
    cursorRing.style.left = `${event.clientX}px`;
    cursorRing.style.top = `${event.clientY}px`;
    cursorRing.classList.add('visible');
    cursorRing.classList.toggle('over-control', Boolean(event.target.closest('a, button, summary, input')));
  });
}, { passive: true });
function hideCursorRing() { cursorRing.classList.remove('visible'); }
document.addEventListener('pointerleave', hideCursorRing);
window.addEventListener('blur', hideCursorRing);
reducedMotion.addEventListener('change', hideCursorRing);
finePointer.addEventListener('change', hideCursorRing);

let cursorPulse = null;
let collapsingRing = null;
document.addEventListener('pointerdown', event => {
  if (!finePointer.matches || reducedMotion.matches || event.pointerType === 'touch' || event.button !== 0) return;
  cursorRing.style.left = `${event.clientX}px`;
  cursorRing.style.top = `${event.clientY}px`;
  cursorRing.classList.add('visible');
  cursorPulse?.cancel();
  cursorPulse = cursorRing.animate([
    { transform: 'translate(-50%, -50%) scale(1)', opacity: .6 },
    { transform: 'translate(-50%, -50%) scale(.6)', opacity: 1, offset: .2 },
    { transform: 'translate(-50%, -50%) scale(2.6)', opacity: .35, offset: .6 },
    { transform: 'translate(-50%, -50%) scale(1)', opacity: .6 }
  ], { duration: 550, easing: 'cubic-bezier(.2,.7,.3,1)' });
  collapsingRing?.remove();
  const ring = document.createElement('div');
  ring.className = 'cursor-collapse-ring';
  ring.setAttribute('aria-hidden', 'true');
  ring.style.left = `${event.clientX}px`;
  ring.style.top = `${event.clientY}px`;
  document.body.append(ring);
  collapsingRing = ring;
  const collapse = ring.animate([
    { transform: 'translate(-50%, -50%) scale(1.25)', opacity: 0 },
    { transform: 'translate(-50%, -50%) scale(1)', opacity: .65, offset: .15 },
    { transform: 'translate(-50%, -50%) scale(.25)', opacity: 0 }
  ], { duration: 650, easing: 'cubic-bezier(.2,.7,.3,1)' });
  collapse.onfinish = () => ring.remove();
});
function stopCursorPulse() {
  cursorPulse?.cancel();
  collapsingRing?.remove();
}
window.addEventListener('blur', stopCursorPulse);
reducedMotion.addEventListener('change', stopCursorPulse);
finePointer.addEventListener('change', stopCursorPulse);

// A continuous curved trail fades behind the pointer.
const trailCanvas = document.createElement('canvas');
trailCanvas.className = 'mouse-trail-line';
trailCanvas.setAttribute('aria-hidden', 'true');
document.body.append(trailCanvas);
const trailContext = trailCanvas.getContext('2d');
let trailPoints = [];
let trailFrame = 0;
let trailColor = getComputedStyle(document.documentElement).getPropertyValue('--green').trim();
function resizeMouseTrail() {
  const ratio = Math.min(devicePixelRatio || 1, 2);
  trailCanvas.width = Math.round(innerWidth * ratio);
  trailCanvas.height = Math.round(innerHeight * ratio);
  trailContext.setTransform(ratio, 0, 0, ratio, 0, 0);
}
resizeMouseTrail();
window.addEventListener('resize', resizeMouseTrail);
new MutationObserver(() => {
  trailColor = getComputedStyle(document.documentElement).getPropertyValue('--green').trim();
}).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
function drawMouseTrail(now) {
  trailContext.clearRect(0, 0, innerWidth, innerHeight);
  trailPoints = trailPoints.filter(point => now - point.time < 320);
  if (trailPoints.length > 1) {
    const first = trailPoints[0];
    const last = trailPoints[trailPoints.length - 1];
    const gradient = trailContext.createLinearGradient(first.x, first.y, last.x + .01, last.y + .01);
    gradient.addColorStop(0, 'transparent');
    gradient.addColorStop(1, trailColor);
    trailContext.strokeStyle = gradient;
    trailContext.lineWidth = 2;
    trailContext.lineCap = 'round';
    trailContext.lineJoin = 'round';
    trailContext.globalAlpha = .55 * Math.max(0, 1 - (now - last.time) / 320);
    trailContext.beginPath();
    trailContext.moveTo(first.x, first.y);
    for (let i = 1; i < trailPoints.length - 1; i++) {
      const point = trailPoints[i];
      const next = trailPoints[i + 1];
      trailContext.quadraticCurveTo(point.x, point.y, (point.x + next.x) / 2, (point.y + next.y) / 2);
    }
    trailContext.lineTo(last.x, last.y);
    trailContext.stroke();
  }
  trailFrame = trailPoints.length ? requestAnimationFrame(drawMouseTrail) : 0;
}
document.addEventListener('pointermove', event => {
  if (!finePointer.matches || reducedMotion.matches || event.pointerType === 'touch') return;
  trailPoints.push({ x: event.clientX, y: event.clientY, time: performance.now() });
  if (trailPoints.length > 100) trailPoints.shift();
  if (!trailFrame) trailFrame = requestAnimationFrame(drawMouseTrail);
}, { passive: true });
function hideMouseTrail() {
  cancelAnimationFrame(trailFrame);
  trailFrame = 0;
  trailPoints = [];
  trailContext.clearRect(0, 0, innerWidth, innerHeight);
}
document.addEventListener('pointerleave', hideMouseTrail);
window.addEventListener('blur', hideMouseTrail);
reducedMotion.addEventListener('change', hideMouseTrail);
finePointer.addEventListener('change', hideMouseTrail);


})();
