const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
document.documentElement.classList.add('js');
const menuButton = document.querySelector('.menu-toggle');
const sidebar = document.querySelector('.sidebar');
const navigationLinks = [...document.querySelectorAll('#navigation a')];
const sections = [...document.querySelectorAll('main section[id]')];

function closeMenu() {
  sidebar.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}

menuButton.addEventListener('click', () => {
  const isOpen = sidebar.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});
navigationLinks.forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('click', event => {
  if (!sidebar.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && sidebar.classList.contains('open')) {
    closeMenu();
    menuButton.focus();
  }
});
window.addEventListener('resize', () => {
  if (window.innerWidth > 760) closeMenu();
  requestNavigationUpdate();
});

// Track the section near the top, including short academic sections.
let navigationUpdatePending = false;
function requestNavigationUpdate() {
  if (navigationUpdatePending) return;
  navigationUpdatePending = true;
  requestAnimationFrame(() => {
    navigationUpdatePending = false;
    const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollRange > 0 ? Math.min(1, window.scrollY / scrollRange) : 0;
    document.querySelector('#reading-progress').style.transform = `scaleX(${progress})`;
    const header = document.querySelector('.mobile-header');
    const anchorOffset = (parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0)
      + (parseFloat(getComputedStyle(sections[0]).scrollMarginTop) || 0);
    const referenceLine = Math.max(header.getBoundingClientRect().height + 100, anchorOffset + 2);
    let activeSection = sections[0];
    sections.forEach(section => {
      if (section.getBoundingClientRect().top <= referenceLine) activeSection = section;
    });
    navigationLinks.forEach(link => {
      const isActive = link.hash === `#${activeSection.id}`;
      link.classList.toggle('active', isActive);
      if (isActive) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  });
}
window.addEventListener('scroll', requestNavigationUpdate, { passive: true });
window.addEventListener('load', requestNavigationUpdate);
window.addEventListener('hashchange', requestNavigationUpdate);
requestNavigationUpdate();


const searchInput = document.querySelector('#project-search');
const projectButtons = [...document.querySelectorAll('[data-filter]')];
const projects = [...document.querySelectorAll('.project')];
const projectCount = document.querySelector('#project-status');
const emptyState = document.querySelector('#project-empty');
let selectedCategory = 'all';
const searchText = new Map(projects.map(project => [project, project.textContent.toLowerCase()]));

function updateProjects() {
  const query = searchInput.value.trim().toLowerCase();
  let count = 0;
  projects.forEach(project => {
    const categoryMatches = selectedCategory === 'all' || project.dataset.category === selectedCategory || (selectedCategory === 'design' && project.dataset.design === 'true') || project.dataset.patentGroup === selectedCategory || (selectedCategory === 'medtech' && project.dataset.medtech === 'true') || (selectedCategory === 'thesis' && project.dataset.thesis === 'true');
    const filterAllowed = !project.dataset.filterOnly || selectedCategory === project.dataset.filterOnly;
    project.hidden = !filterAllowed || !categoryMatches || !searchText.get(project).includes(query);
    if (!project.hidden) count += 1;
  });
  const firstProjectId = {
    international: 'project-harvesting',
    robotics: 'project-respiratory'
  }[selectedCategory];
  const orderedProjects = firstProjectId
    ? [...projects.filter(project => project.id === firstProjectId), ...projects.filter(project => project.id !== firstProjectId)]
    : projects;
  document.querySelector('.project-list').append(...orderedProjects);
  projectButtons.forEach(button => {
    const selected = button.dataset.filter === selectedCategory;
    button.classList.toggle('selected', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  projectCount.textContent = `${count} of ${projects.length} projects${query ? ' matching “' + searchInput.value.trim() + '”' : ''}`;
  emptyState.hidden = count > 0;
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const list = document.querySelector('.project-list');
    list.getAnimations().forEach(animation => animation.cancel());
    list.animate([{ opacity: .35 }, { opacity: 1 }], { duration: 300, easing: 'ease-out' });
    projectCount.getAnimations().forEach(animation => animation.cancel());
    projectCount.animate([{ opacity: .3 }, { opacity: 1 }], { duration: 300 });
  }
  requestNavigationUpdate();
}
projectButtons.forEach(button => button.addEventListener('click', () => {
  selectedCategory = button.dataset.filter;
  updateProjects();
}));
searchInput.addEventListener('input', updateProjects);
document.querySelector('#reset-projects').addEventListener('click', () => {
  selectedCategory = 'all';
  searchInput.value = '';
  updateProjects();
  searchInput.focus({ preventScroll: true });
});
function focusProjectSearch() {
  scrollSectionHeading(document.querySelector('#projects'));
  searchInput.focus({ preventScroll: true });
}
document.querySelector('[data-search-shortcut]')?.addEventListener('click', event => {
  event.preventDefault();
  focusProjectSearch();
});
document.addEventListener('keydown', event => {
  const editing = event.target instanceof Element && event.target.closest('input, textarea, [contenteditable="true"]');
  if (event.key === '/' && !editing && !event.ctrlKey && !event.metaKey && !event.altKey && !viewer.open) {
    event.preventDefault();
    focusProjectSearch();
  }
});
function updateAnchorOffset() {
  const toolbar = document.querySelector('.page-toolbar');
  const offset = (parseFloat(getComputedStyle(toolbar).top) || 0) + toolbar.offsetHeight + 8;
  document.documentElement.style.setProperty('--navigation-offset', `${offset}px`);
  return offset;
}
function scrollSectionHeading(section) {
  if (section.id === 'about') {
    window.scrollTo({ top: 0, left: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    requestNavigationUpdate();
    return;
  }
  const heading = section.querySelector('h2');
  if (!heading) return;
  const offset = updateAnchorOffset();
  const main = document.querySelector('main');
  // Allow even the final section to reach the top when it is selected.
  const currentPadding = parseFloat(getComputedStyle(main).paddingBottom) || 0;
  const headingPosition = heading.getBoundingClientRect().top + window.scrollY;
  const remainingContent = document.documentElement.scrollHeight - currentPadding - headingPosition;
  main.style.paddingBottom = `${Math.max(0, innerHeight - offset - remainingContent)}px`;
  heading.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  requestNavigationUpdate();
}
updateAnchorOffset();
window.addEventListener('resize', updateAnchorOffset);
document.addEventListener('click', event => {
  const link = event.target instanceof Element ? event.target.closest('a[href^="#"]') : null;
  if (!link) return;
  const target = document.getElementById(link.hash.slice(1));
  if (!target || !sections.includes(target)) return;
  if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
  event.preventDefault();
  if (link.dataset.projectFilter) {
    selectedCategory = link.dataset.projectFilter;
    searchInput.value = '';
    updateProjects();
  }
  if (location.hash !== link.hash) history.pushState(null, '', link.hash);
  scrollSectionHeading(target);
});

function revealLinkedRecord() {
  const target = document.getElementById(location.hash.slice(1));
  if (!target) return;
  if (sections.includes(target)) {
    requestAnimationFrame(() => scrollSectionHeading(target));
    return;
  }
  if (target.classList.contains('project')) {
    if (target.hidden) {
      selectedCategory = target.dataset.filterOnly || 'all';
      searchInput.value = '';
      updateProjects();
    }
    requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
  }
  if (target.classList.contains('patent-row')) {
    target.querySelector('details').open = true;
    requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
  }
}
window.addEventListener('hashchange', revealLinkedRecord);

document.querySelectorAll('[data-expand-patents]').forEach(button => {
  const records = [...button.closest('section').querySelectorAll('.patent-row details')];
  const update = () => {
    const expanded = records.every(record => record.open);
    button.textContent = expanded ? 'Collapse descriptions' : 'Expand descriptions';
    button.setAttribute('aria-expanded', String(expanded));
  };
  button.addEventListener('click', () => {
    const expanded = !records.every(record => record.open);
    records.forEach(record => { record.open = expanded; });
    update();
  });
  records.forEach(record => record.addEventListener('toggle', update));
});

const viewer = document.querySelector('#image-viewer');
const imageLinks = [...document.querySelectorAll('[data-lightbox]')];
const viewerImage = document.querySelector('#viewer-image');
let currentImage = 0;
let imageTrigger = null;
function renderGalleryImage(index) {
  currentImage = (index + imageLinks.length) % imageLinks.length;
  const link = imageLinks[currentImage];
  viewerImage.src = link.getAttribute('href');
  viewerImage.alt = link.dataset.caption;
  document.querySelector('#image-caption').textContent = `${link.dataset.caption} · ${currentImage + 1} / ${imageLinks.length}`;
}
imageLinks.forEach((link, index) => link.addEventListener('click', event => {
  if (typeof viewer.showModal !== 'function') return;
  event.preventDefault();
  imageTrigger = link;
  renderGalleryImage(index);
  viewer.showModal();
  document.body.classList.add('viewer-open');
}));
document.querySelector('#close-viewer').addEventListener('click', () => viewer.close());
document.querySelector('#previous-image').addEventListener('click', () => renderGalleryImage(currentImage - 1));
document.querySelector('#next-image').addEventListener('click', () => renderGalleryImage(currentImage + 1));
viewer.addEventListener('click', event => {
  if (event.target === viewer) viewer.close();
});
viewer.addEventListener('close', () => {
  document.body.classList.remove('viewer-open');
  if (imageTrigger) imageTrigger.focus({ preventScroll: true });
});
document.addEventListener('keydown', event => {
  if (!viewer.open) return;
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
    event.preventDefault();
    renderGalleryImage(currentImage + (event.key === 'ArrowRight' ? 1 : -1));
  }
});

async function copyEmail() {
  const email = 'shobitm2d2@gmail.com';
  let copied = false;
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(email);
      copied = true;
    }
  } catch {}
  if (!copied) {
    const field = document.createElement('textarea');
    field.value = email;
    field.setAttribute('readonly', '');
    field.style.cssText = 'position:fixed;left:-9999px;top:0';
    document.body.append(field);
    field.select();
    try { copied = document.execCommand('copy'); } catch {}
    field.remove();
    document.querySelector('#copy-email').focus({ preventScroll: true });
  }
  document.querySelector('#contact-status').textContent = copied
    ? 'Email address copied.'
    : 'Select the email address above and copy it manually.';
}
document.querySelector('#copy-email').addEventListener('click', copyEmail);

document.querySelector('#year').textContent = new Date().getFullYear();
document.querySelectorAll('details').forEach(details => details.addEventListener('toggle', requestNavigationUpdate));
updateProjects();
if (!restoreProjectReturn()) revealLinkedRecord();

const themeButton = document.querySelector('.theme-toggle');
const themePreference = matchMedia('(prefers-color-scheme: dark)');
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeButton.setAttribute('aria-pressed', String(theme === 'dark'));
  themeButton.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
}
applyTheme(document.documentElement.dataset.theme || (themePreference.matches ? 'dark' : 'light'));
themeButton.addEventListener('click', () => {
  const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(theme);
  try { localStorage.setItem('portfolio-theme', theme); } catch {}
});
themePreference.addEventListener('change', event => {
  try { if (localStorage.getItem('portfolio-theme')) return; } catch {}
  applyTheme(event.matches ? 'dark' : 'light');
});

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
if (!reducedMotion.matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.03 });
  document.querySelectorAll('#about > p, #profile-heading, main > section > .section-title, .project-card, .institution-row, .patent-row, .publication, .awards-list li, .contact-intro').forEach((element, index) => {
    element.classList.add('reveal');
    element.style.setProperty('--reveal-delay', `${(index % 4) * 45}ms`);
    observer.observe(element);
  });
  document.documentElement.classList.add('motion-ready');
}

// Include all projects except the self-balancing bike, with rare picks for two projects.
const rareRandomProjects = new Set(['project-9', 'project-ultrasound']);
const randomProjectChoices = [...document.querySelectorAll('.project-card')]
  .filter(project => project.id !== 'project-10')
  .map(project => ({ id: project.id, weight: rareRandomProjects.has(project.id) ? 0.08 : 1 }));
function pickRandomProject() {
  const total = randomProjectChoices.reduce((sum, project) => sum + project.weight, 0);
  let draw = Math.random() * total;
  for (const project of randomProjectChoices) {
    draw -= project.weight;
    if (draw < 0) return document.getElementById(project.id);
  }
  return document.getElementById(randomProjectChoices[0].id);
}
document.querySelector('#random-project').addEventListener('click', () => {
  const project = pickRandomProject();
  saveProjectReturn(project);
  window.location.assign(project.querySelector('.project-card-link').href);
});

document.querySelectorAll('.project-card').forEach(card => {
  let frame = 0;
  card.addEventListener('pointermove', event => {
    if (!finePointer.matches || reducedMotion.matches || event.pointerType === 'touch') return;
    if (frame) cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
      card.style.setProperty('--spot-x', `${x * 100}%`);
      card.style.setProperty('--spot-y', `${y * 100}%`);
      card.style.setProperty('--card-turn', `${(x - .5) * .8}deg`);
      card.classList.add('pointer-active');
    });
  }, { passive: true });
  const reset = () => {
    if (frame) cancelAnimationFrame(frame);
    card.classList.remove('pointer-active');
    card.style.removeProperty('--card-turn');
  };
  card.addEventListener('pointerleave', reset);
  window.addEventListener('blur', reset);
  reducedMotion.addEventListener('change', reset);
  finePointer.addEventListener('change', reset);
});

document.querySelectorAll('button, .resume-button').forEach(control => {
  control.addEventListener('pointerdown', event => {
    if (reducedMotion.matches || event.button !== 0) return;
    const rect = control.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'click-ripple';
    ripple.setAttribute('aria-hidden', 'true');
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;
    control.append(ripple);
    ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
    setTimeout(() => ripple.remove(), 700);
  });
});

// Small pointer ring with a spring-like pulse on click or selection.
// Brief green tint on selected controls and cards.
let highlightedElement = null;
let highlightTimer = null;
function highlightSelection(target) {
  highlightedElement?.classList.remove('pointer-highlight');
  clearTimeout(highlightTimer);
  highlightedElement = target.closest('.project-card, .patent-row, .institution-row:not(#experience .institution-row), .publication, .contact-intro') || target.closest('a, button, summary, input');
  highlightedElement?.classList.add('pointer-highlight');
  highlightTimer = setTimeout(() => highlightedElement?.classList.remove('pointer-highlight'), 900);
}
document.addEventListener('click', event => {
  if (event.target instanceof Element) highlightSelection(event.target);
});


// Tint the entire card, including its image, without blocking its controls.
document.querySelectorAll('.project-card, .patent-row, .institution-row:not(#experience .institution-row), .publication, .contact-intro').forEach(card => {
  const overlay = document.createElement('span');
  overlay.className = 'card-tint-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  card.append(overlay);
});

// Fit each profile line to the same width as the sidebar navigation.
const profileMeasure = document.createElement('canvas').getContext('2d');
function fitSidebarProfile() {
  document.querySelectorAll('.sidebar > h1, .sidebar-profile-line').forEach(line => {
    if (!line.clientWidth) return;
    const style = getComputedStyle(line);
    profileMeasure.font = `${style.fontStyle} ${style.fontWeight} 100px ${style.fontFamily}`;
    const measured = profileMeasure.measureText(line.textContent.trim()).width;
    if (measured) line.style.fontSize = `${100 * line.clientWidth / measured}px`;
  });
}
fitSidebarProfile();
document.fonts.ready.then(fitSidebarProfile);
window.addEventListener('resize', fitSidebarProfile);

// A playful floating motion, kept within easy clicking distance.
const driftingButton = document.querySelector('#random-project');
let buttonDrift = null;
function updateButtonDrift() {
  buttonDrift?.cancel();
  if (reducedMotion.matches) return;
  const frames = [{ translate: '0px 0px', rotate: '0deg' }];
  for (let i = 0; i < 8; i++) {
    frames.push({
      translate: `${(Math.random() * 18 - 9).toFixed(2)}px ${(Math.random() * 12 - 6).toFixed(2)}px`,
      rotate: `${(Math.random() * 3 - 1.5).toFixed(2)}deg`
    });
  }
  frames.push({ translate: '0px 0px', rotate: '0deg' });
  buttonDrift = driftingButton.animate(frames, {
    duration: 6500,
    iterations: Infinity,
    easing: 'ease-in-out'
  });
}
updateButtonDrift();
reducedMotion.addEventListener('change', updateButtonDrift);

// Save the browsing context before opening a project page.
function saveProjectReturn(project) {
  try {
    sessionStorage.setItem('portfolio-project-return', JSON.stringify({
      projectId: project.id,
      category: selectedCategory,
      search: searchInput.value,
      scrollY: window.scrollY,
      width: innerWidth
    }));
  } catch {}
}
document.addEventListener('click', event => {
  const link = event.target instanceof Element ? event.target.closest('.project-card-link') : null;
  if (link) saveProjectReturn(link.closest('.project-card'));
}, { capture: true });
function restoreProjectReturn() {
  const url = new URL(location.href);
  if (url.searchParams.get('projectReturn') !== '1') return false;
  url.searchParams.delete('projectReturn');
  history.replaceState(history.state, '', url.pathname + url.search + url.hash);
  let saved;
  try { saved = JSON.parse(sessionStorage.getItem('portfolio-project-return')); } catch {}
  const project = document.getElementById(url.hash.slice(1) || saved?.projectId);
  if (!project?.classList.contains('project-card')) return false;
  const sameContext = saved?.projectId === project.id;
  selectedCategory = sameContext && projectButtons.some(button => button.dataset.filter === saved.category) ? saved.category : 'all';
  searchInput.value = sameContext && typeof saved.search === 'string' ? saved.search : '';
  updateProjects();
  // A random project may have been opened outside the current search/filter.
  if (project.hidden) {
    selectedCategory = project.dataset.filterOnly || 'all';
    searchInput.value = '';
    updateProjects();
  }
  const restore = () => requestAnimationFrame(() => requestAnimationFrame(() => {
    project.classList.add('revealed');
    if (sameContext && saved.width === innerWidth && Number.isFinite(saved.scrollY)) {
      window.scrollTo({ top: saved.scrollY, behavior: 'instant' });
    } else {
      project.scrollIntoView({ block: 'start', behavior: 'instant' });
    }
    const offset = updateAnchorOffset() + 16;
    const rect = project.getBoundingClientRect();
    if (rect.top < offset || rect.top > innerHeight * .45) {
      window.scrollTo({ top: rect.top + window.scrollY - offset, behavior: 'instant' });
    }
    project.classList.add('project-return-highlight');
    setTimeout(() => project.classList.remove('project-return-highlight'), 1800);
    requestNavigationUpdate();
  }));
  if (document.readyState === 'complete') restore();
  else window.addEventListener('load', restore, { once: true });
  return true;
}

const thesisLink = document.querySelector('.bachelor-thesis-link');
thesisLink.addEventListener('click', () => {
  if (reducedMotion.matches) return;
  thesisLink.animate([
    { transform: 'scale(1)' },
    { transform: 'scale(.985)', offset: .4 },
    { transform: 'scale(1)' }
  ], { duration: 220, easing: 'ease-out' });
});
