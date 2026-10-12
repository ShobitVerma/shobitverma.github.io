(() => {
  const copyStatus = document.querySelector('.equation-copy-status');
  document.querySelectorAll('[data-copy-target]').forEach(button => {
    const label = button.textContent;
    let resetLabel;
    button.addEventListener('click', async () => {
      const source = document.getElementById(button.dataset.copyTarget);
      button.disabled = true;
      let copied = false;
      try {
        await navigator.clipboard.writeText(source.value);
        copied = true;
      } catch {
        source.hidden = false;
        source.focus({ preventScroll: true });
        source.select();
        try { copied = document.execCommand('copy'); } catch {}
        if (copied) {
          source.hidden = true;
          button.focus({ preventScroll: true });
        }
      }
      button.disabled = false;
      clearTimeout(resetLabel);
      button.textContent = copied ? 'Copied' : 'Select text below';
      copyStatus.textContent = copied ? 'Copied to clipboard.' : 'Select and copy the text below the button.';
      resetLabel = setTimeout(() => { button.textContent = label; }, 2500);
    });
  });
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
  document.querySelector('.derivation-click-hint').addEventListener('click', () => {
    document.querySelector('.full-derivation [data-lightbox]').click();
  });
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

  const phaseData = {
    initial: {file:'phase-initial-cropped.png', index:'01', title:'Ready to capture the pedicel.', description:'The scissor arms and hook begin open. The target pedicel enters the region swept by the hook as the arms start to close.', caption:'Initial open position.'},
    hooked: {file:'phase-hooked-cropped.png', index:'02', title:'The hook captures the pedicel.', description:'The initiation and supporting bars drive the hook around the target. The hooking phase finishes as the handling bar reaches its horizontal position.', caption:'End of the hooking phase.'},
    pulled: {file:'phase-pulling.png', index:'03', title:'Pull towards the cutting region.', description:'The handling bar moves the hook inward, drawing the captured pedicel between the blades. The hook slows as the mechanism approaches its holding position.', caption:'End of the pulling phase.'},
    held: {file:'phase-holding.png', index:'04', title:'Hold steady as the blades close.', description:'Hook movement becomes small in the final region of the trajectory. The pedicel is stabilized in the cutting zone as the blades finish closing.', caption:'End of the holding phase.'}
  };
  document.querySelectorAll('[data-phase]').forEach(button => button.addEventListener('click', () => {
    const state = phaseData[button.dataset.phase];
    const image = document.getElementById('phase-image');
    image.src = '../assets/projects/harvesting/' + state.file;
    image.alt = state.caption + ' Six-bar kinematic cutter.';



    document.getElementById('phase-caption').textContent = state.caption;
    document.querySelectorAll('[data-phase]').forEach(other => other.setAttribute('aria-pressed', String(other.dataset.phase === button.dataset.phase)));
    document.querySelectorAll('[data-story-phase]').forEach(card => card.classList.toggle('is-active', card.dataset.storyPhase === button.dataset.phase));
    image.getAnimations().forEach(animation => animation.cancel());
    if (!reducedMotion.matches) {
      image.animate([
        { transform: 'scale(1)', opacity: 1 },
        { transform: 'scale(1.08)', opacity: .45, offset: .22 },
        { transform: 'scale(1.1)', opacity: 1, offset: .4 },
        { transform: 'scale(1.06)', opacity: .65, offset: .58 },
        { transform: 'scale(1.04)', opacity: 1, offset: .75 },
        { transform: 'scale(1)', opacity: 1 }
      ], { duration: 600, easing: 'ease-out' });
    }
  }));
  document.querySelectorAll('[data-story-phase]').forEach(card => {
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', 'View ' + card.dataset.storyPhase.replace('hooked', 'hooking').replace('pulled', 'pulling').replace('held', 'holding') + ' CAD position');
    const selectPhase = () => document.querySelector('.phase-controls [data-phase="' + card.dataset.storyPhase + '"]').click();
    card.addEventListener('click', event => {
      if (!event.target.closest('[data-lightbox]') || event.target.closest('.image-expand')) return;
      event.stopPropagation();
      selectPhase();
    }, true);
    card.addEventListener('click', event => {
      if (event.target.closest('button, a')) return;
      selectPhase();
    });
    card.addEventListener('keydown', event => {
      if (event.target !== card || !['Enter', ' '].includes(event.key)) return;
      event.preventDefault();
      selectPhase();
    });
  });
  const drawingLabels = ['Rear','Front','Isometric 1','Isometric 2','Isometric 3','Isometric 4','Top','Bottom','Side'];
  document.querySelectorAll('[data-drawing]').forEach(button => button.addEventListener('click', () => {
    const label = button.dataset.drawing === 'exploded' ? 'Exploded' : drawingLabels[Number(button.dataset.drawing) - 1];
    const image = document.getElementById('drawing-image');
    image.src = '../assets/projects/harvesting/drawing-' + button.dataset.drawing + '.png';
    image.alt = label + ' view of the six-bar kinematic harvesting tool';
    document.getElementById('drawing-caption').textContent = label + ' view.';
    document.querySelectorAll('[data-drawing]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
  }));

  const lightbox = document.querySelector('.project-lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  let scrollBeforeDialog = '';
  document.querySelectorAll('[data-lightbox]').forEach(button => button.addEventListener('click', () => {
    const image = button.querySelector('img') || button.closest('figure').querySelector('img');
    lightboxImage.src = button.dataset.fullsize || image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    const isDerivation = Boolean(button.closest('.full-derivation, .full-validation'));
    lightbox.classList.toggle('is-derivation-zoom', isDerivation || Boolean(button.closest('.full-validation')));
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
