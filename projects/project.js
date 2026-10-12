const button = document.querySelector('.theme-toggle');
const preference = matchMedia('(prefers-color-scheme: dark)');
function updateThemeButton() {
  const dark = document.documentElement.dataset.theme === 'dark';
  button.setAttribute('aria-pressed', String(dark));
  button.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
}
button.addEventListener('click', () => {
  const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem('portfolio-theme', theme); } catch {}
  updateThemeButton();
});
preference.addEventListener('change', event => {
  let saved = null;
  try { saved = localStorage.getItem('portfolio-theme'); } catch {}
  if (!saved) document.documentElement.dataset.theme = event.matches ? 'dark' : 'light';
  updateThemeButton();
});
updateThemeButton();

// Return to the original card, including when a project was opened directly.
const backLinks = [...document.querySelectorAll('.project-back-link, .return-to-projects')];
let returnProjectId = document.querySelector('.project-back-link')?.hash.slice(1);
try {
  const saved = JSON.parse(sessionStorage.getItem('portfolio-project-return'));
  if (saved?.projectId) returnProjectId = saved.projectId;
} catch {}
if (returnProjectId) {
  const returnUrl = `../index.html?projectReturn=1#${encodeURIComponent(returnProjectId)}`;
  backLinks.forEach(link => { link.href = returnUrl; });
}

let returningToProjects = false;
let returnTransition = null;
window.addEventListener('pageshow', () => {
  returnTransition?.cancel();
  returningToProjects = false;
});
backLinks.forEach(link => link.addEventListener('click', event => {
  if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const main = document.querySelector('main');
  if (!main?.animate) return;
  event.preventDefault();
  if (returningToProjects) return;
  returningToProjects = true;
  returnTransition = main.animate([
    { opacity: 1, translate: '0px 0px' },
    { opacity: 0, translate: '0px 6px' }
  ], { duration: 160, easing: 'ease-in', fill: 'forwards' });
  returnTransition.finished.catch(() => {}).then(() => {
    if (returningToProjects) window.location.assign(link.href);
  });
}));

// Give enlarged photos their own history entry so browser Back closes the photo.
document.querySelectorAll('dialog.project-lightbox').forEach(dialog => {
  let activeEntry = null;
  const observer = new MutationObserver(() => {
    if (!dialog.open || activeEntry) return;
    activeEntry = 'photo-' + Date.now() + '-' + Math.random().toString(36).slice(2);
    history.pushState({ ...history.state, projectPhoto: activeEntry }, '', location.href);
  });
  observer.observe(dialog, { attributes: true, attributeFilter: ['open'] });
  dialog.addEventListener('close', () => {
    const entry = activeEntry;
    activeEntry = null;
    if (entry && history.state?.projectPhoto === entry) history.back();
  });
  window.addEventListener('popstate', () => {
    if (!activeEntry || history.state?.projectPhoto === activeEntry) return;
    activeEntry = null;
    if (dialog.open) {
      const closeButton = dialog.querySelector('.lightbox-close');
      if (closeButton) closeButton.click();
      else dialog.close();
    }
  });
});
