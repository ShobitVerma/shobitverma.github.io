(() => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const derivationImages = [...document.querySelectorAll('.full-derivation .image-button, .full-validation .image-button')];
  const hoverPointer = matchMedia('(hover: hover) and (pointer: fine)');
  if (derivationImages.length) {
    const cursor = document.createElement('div');
    cursor.className = 'enlarge-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    cursor.innerHTML = '<span class="enlarge-cursor-ring"><svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 3v10M3 8h10"/></svg></span><span class="enlarge-cursor-label">Click to enlarge</span>';
    document.body.append(cursor);
    const hideCursor = () => cursor.classList.remove('is-visible');
    function moveCursor(event) {
      if (!hoverPointer.matches || event.pointerType === 'touch') return;
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;
      cursor.classList.toggle('is-left', event.clientX > window.innerWidth - 180);
      cursor.classList.toggle('is-above', event.clientY > window.innerHeight - 65);
      cursor.classList.add('is-visible');
    }
    function updateCursorAvailability() {
      derivationImages.forEach(image => image.classList.toggle('has-enlarge-cursor', hoverPointer.matches));
      hideCursor();
    }
    derivationImages.forEach(image => {
      image.addEventListener('pointerenter', moveCursor);
      image.addEventListener('pointermove', moveCursor);
      image.addEventListener('pointerleave', hideCursor);
      image.addEventListener('pointerdown', hideCursor);
      image.addEventListener('click', hideCursor);
    });
    window.addEventListener('scroll', hideCursor, { passive: true });
    window.addEventListener('blur', hideCursor);
    hoverPointer.addEventListener('change', updateCursorAvailability);
    updateCursorAvailability();
  }
  const header = document.querySelector('.detail-header');
  const sidebar = document.querySelector('.case-sidebar');
  const toc = document.querySelector('.case-toc');
  const toggle = document.querySelector('.contents-toggle');
  const sections = [...document.querySelectorAll('.case-section')];
  const tocLinks = [...toc.querySelectorAll('a')];
  const progress = document.querySelector('.case-progress span');

  function measureHeader() {
    const height = header.getBoundingClientRect().height;
    const mobileHeight = matchMedia('(max-width: 800px)').matches ? toggle.getBoundingClientRect().height : 0;
    document.body.style.setProperty('--header-height', `${height}px`);
    document.body.style.setProperty('--anchor-offset', `${height + mobileHeight + 18}px`);
  }
  new ResizeObserver(measureHeader).observe(header);
  window.addEventListener('resize', measureHeader);
  measureHeader();

  function closeContents() {
    toc.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }
  toggle.addEventListener('click', () => {
    const open = !toc.classList.contains('is-open');
    toc.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', event => {
    if (!sidebar.contains(event.target)) closeContents();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toc.classList.contains('is-open')) {
      closeContents();
      toggle.focus();
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      const target = document.getElementById(link.hash.slice(1));
      if (!target) return;
      event.preventDefault();
      closeContents();
      measureHeader();
      history.replaceState(null, '', link.hash);
      const offset = parseFloat(document.body.style.getPropertyValue('--anchor-offset'));
      const top = target.id === 'overview' ? 0 : target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: Math.max(0, top), behavior: reducedMotion.matches ? 'instant' : 'smooth' });
      if (target.id === 'project-main') {
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    });
  });

  let scheduled = false;
  function updateReadingPosition() {
    const offset = parseFloat(document.body.style.getPropertyValue('--anchor-offset')) + 30;
    let current = sections[0];
    for (const section of sections) if (section.getBoundingClientRect().top <= offset) current = section;
    tocLinks.forEach(link => {
      if (link.hash === '#' + current.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    const distance = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 0})`;
    scheduled = false;
  }
  window.addEventListener('scroll', () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(updateReadingPosition); }
  }, { passive: true });
  window.addEventListener('resize', updateReadingPosition);
  window.addEventListener('load', updateReadingPosition);
  document.querySelectorAll('details').forEach(detail => detail.addEventListener('toggle', updateReadingPosition));
  updateReadingPosition();

  document.querySelectorAll('.page-click-hint').forEach(button => button.addEventListener('click', () => button.closest('figure').querySelector('[data-lightbox]').click()));
  const loadButtons = [...document.querySelectorAll('[data-grip-load]')];
  const loadImage = document.getElementById('grip-load-image');
  const loadCaption = document.getElementById('grip-load-caption');
  const loadReferences = { '10': { force: 40, multiple: '0.1' }, '50': { force: 200, multiple: '0.5' }, '200': { force: 800, multiple: '2' } };
  let loadSlideTimer;
  let loadSlideVisible = false;
  function selectLoadSlide(button) {
    const value = button.dataset.gripLoad;
    const reference = loadReferences[value];
    loadImage.src = '../assets/projects/compliant-grip/deflection-' + value + '.png';
    loadImage.alt = reference.force + ' N grip reference comparison; original deformation study at ' + value + ' N';
    loadCaption.textContent = reference.force + ' N reference (' + reference.multiple + '\u00d7 average).';
    loadButtons.forEach(other => other.setAttribute('aria-pressed', String(other === button)));
  }
  function restartLoadSlideshow() {
    clearTimeout(loadSlideTimer);
    if (!loadSlideVisible || document.hidden) return;
    loadSlideTimer = setTimeout(() => {
      if (!document.querySelector('.project-lightbox').open) {
        const current = loadButtons.findIndex(button => button.getAttribute('aria-pressed') === 'true');
        selectLoadSlide(loadButtons[(current + 1) % loadButtons.length]);
      }
      restartLoadSlideshow();
    }, 4000);
  }
  loadButtons.forEach(button => button.addEventListener('click', () => {
    selectLoadSlide(button);
    restartLoadSlideshow();
  }));
  new IntersectionObserver(entries => {
    loadSlideVisible = entries[0].isIntersecting;
    restartLoadSlideshow();
  }, { threshold: 0.2 }).observe(document.querySelector('.grip-load-view'));
  document.addEventListener('visibilitychange', restartLoadSlideshow);
  document.querySelectorAll('[data-grip-view]').forEach(button => button.addEventListener('click', () => {
    const image = document.getElementById('grip-drawing-image');
    image.src = '../assets/projects/compliant-grip/' + button.dataset.gripView;
    image.alt = button.dataset.viewLabel + ' view of the compliant grip analyser';
    document.getElementById('grip-drawing-caption').textContent = button.dataset.viewLabel + ' view.';
    document.querySelectorAll('[data-grip-view]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
  }));
  const lightbox = document.querySelector('.project-lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  let scrollBeforeDialog = '';
  document.querySelectorAll('[data-lightbox]').forEach(button => button.addEventListener('click', () => {
    const image = button.querySelector('img') || button.closest('figure').querySelector('img');
    lightboxImage.src = button.dataset.fullsize || image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    const isDerivation = Boolean(button.closest('.full-derivation, .full-validation'));
    lightbox.classList.toggle('is-page-zoom', isDerivation || Boolean(button.closest('.full-validation')));
    document.querySelector('.lightbox-return').hidden = !isDerivation;
    document.querySelector('.lightbox-image-stage').classList.toggle('is-rotated', button.classList.contains('rotated-photo'));
    document.getElementById('lightbox-caption').textContent = image.alt;
    document.getElementById('lightbox-original').href = button.dataset.fullsize || image.src;
    scrollBeforeDialog = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    lightbox.showModal();
    document.querySelector('.lightbox-image-stage').scrollTo(0, 0);
  }));
  function closeLightbox() {
    document.body.style.overflow = scrollBeforeDialog;
    lightbox.close();
  }
  document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  document.querySelector('.lightbox-return').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', event => {
    if (event.target !== lightbox) return;
    const rect = lightbox.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeLightbox();
  });
  lightbox.addEventListener('close', () => { document.body.style.overflow = scrollBeforeDialog; });

  document.querySelector('.return-to-projects').href = document.querySelector('.project-back-link').href;
  if (!reducedMotion.matches) {
    document.body.classList.add('js-case-motion');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.remove('waiting'); observer.unobserve(entry.target); }
    }), { rootMargin: '0px 0px 70px 0px', threshold: 0 });
    sections.slice(1).forEach(section => { section.classList.add('waiting'); observer.observe(section); });
    reducedMotion.addEventListener('change', event => {
      if (event.matches) { sections.forEach(section => section.classList.remove('waiting')); observer.disconnect(); }
    });
  }
})();
