(() => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
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

  const asset = name => `../assets/projects/respiratory/${name}`;
  const components = {
    plate: ['Human anthropomorphic phantom', 'The upper circular plate holds the human anthropomorphic phantom. Designed for a 20 kg payload, it supports the phantom and transfers platform motion to the abdominal fixture.', 'phantom-cad-white.png', 'Human anthropomorphic phantom held on the moving support plate', 'Payload design target: 20 kg human anthropomorphic phantom'],
    actuators: ['Six independently driven legs', 'Six HIWIN linear actuators connect the two plates. The STM32 controller coordinates their motion through driver circuitry and encoder feedback; actuator stroke and speed bound each trajectory.', 'cad-5.png', 'CAD view of the six linear actuator assemblies', 'Actuation: 6 HIWIN linear actuators'],
    joints: ['Bearing-supported universal joints', 'Custom joint bodies allow the actuator ends to reorient with the moving platform. The hardware incorporates 54 radial and 54 thrust bearings across the assembly.', 'joint-exploded.png', 'Transparent view of the universal-joint bearing construction', 'Bearing total: 108 radial + thrust bearings'],
    wedges: ['Tri-axis-inclined mounts', 'Angled mounting wedges orient the joints in three dimensions. Their geometry is intended to improve articulation clearance and reduce interference between neighboring parts; usable workspace must be checked against the as-built geometry.', 'cad-2.png', 'Close-up CAD view of an inclined actuator mounting wedge', 'Design focus: joint orientation and clearance']
  };
  document.querySelectorAll('[data-component]').forEach((button, index) => button.addEventListener('click', () => {
    document.querySelectorAll('[data-component]').forEach(other => {
      other.setAttribute('aria-pressed', String(other === button));
      other.classList.toggle('selected', other === button);
    });
    const [title, description, image, alt, fact] = components[button.dataset.component];
    document.getElementById('component-index').textContent = `COMPONENT 0${index + 1} / 04`;
    document.getElementById('component-title').textContent = title;
    document.getElementById('component-description').textContent = description;
    document.getElementById('component-image').src = asset(image);
    document.getElementById('component-image').alt = alt;
    document.querySelector('.component-image-frame').dataset.componentView = button.dataset.component;
    document.getElementById('component-fact').textContent = fact;
  }));
  document.querySelectorAll('[data-respiratory-drawing]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-respiratory-drawing]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
    const image = document.getElementById('respiratory-drawing');
    image.src = asset(`drawing-${button.dataset.respiratoryDrawing}.png`);
    image.alt = `${button.textContent} drawing of the respiratory platform`;
    document.getElementById('respiratory-drawing-caption').textContent = `${button.textContent} view.`;
  }));

  // Illustrative geometry from the report's numerical example, not calibrated hardware.
  const rad = degrees => degrees * Math.PI / 180;
  const anchors = (radius, angles) => angles.map(angle => [radius * Math.cos(rad(angle)), radius * Math.sin(rad(angle)), 0]);
  const baseAnchors = anchors(170, [15, 105, 135, 225, 255, 345]);
  const plateAnchors = anchors(114, [45, 75, 165, 195, 285, 315]);
  const neutralHeight = 235;
  const displayMotionScale = 1.2;
  const norm = vector => Math.hypot(...vector);
  const neutralLengths = plateAnchors.map((a, i) => norm([a[0] - baseAnchors[i][0], a[1] - baseAnchors[i][1], neutralHeight]));
  function rotate([x, y, z], roll, pitch, yaw) {
    // Rz(yaw) Ry(pitch) Rx(roll).
    const y1 = Math.cos(roll) * y - Math.sin(roll) * z;
    const z1 = Math.sin(roll) * y + Math.cos(roll) * z;
    const x2 = Math.cos(pitch) * x + Math.sin(pitch) * z1;
    const z2 = -Math.sin(pitch) * x + Math.cos(pitch) * z1;
    return [Math.cos(yaw) * x2 - Math.sin(yaw) * y1, Math.sin(yaw) * x2 + Math.cos(yaw) * y1, z2];
  }
  const rateInput = document.getElementById('breath-rate');
  const amplitudeInput = document.getElementById('breath-amplitude');
  const phaseInput = document.getElementById('breath-phase');
  const timingControls = document.getElementById('breath-timing');
  const inhaleInput = document.getElementById('breath-inhale');
  const exhaleInput = document.getElementById('breath-exhale');
  const playButton = document.getElementById('motion-toggle');
  let waveform = 'symmetric';
  let phase = 0;
  let running = false;
  let frameId = 0;
  let lastTimestamp = 0;
  const smoothStep = fraction => fraction ** 3 * (10 - 15 * fraction + 6 * fraction ** 2);
  function wave(fraction) {
    if (waveform === 'symmetric') return .5 * (1 - Math.cos(2 * Math.PI * fraction));
    const inhaleShare = Number(inhaleInput.value) / 100;
    return fraction <= inhaleShare
      ? smoothStep(fraction / inhaleShare)
      : 1 - smoothStep((fraction - inhaleShare) / (1 - inhaleShare));
  }
  const svgNS = 'http://www.w3.org/2000/svg';
  const makeSvg = (tag, parent, className) => {
    const node = document.createElementNS(svgNS, tag);
    node.setAttribute('class', className);
    parent.append(node);
    return node;
  };
  const legs = baseAnchors.map(() => makeSvg('line', document.getElementById('model-legs'), 'model-leg'));
  const joints = baseAnchors.map(() => [makeSvg('circle', document.getElementById('model-joints'), 'model-joint'), makeSvg('circle', document.getElementById('model-joints'), 'model-joint')]);
  const legOutputs = [...document.querySelectorAll('#leg-values output')];
  const plotDuration = 8;
  const plotMaximum = 12;
  const plotPoint = (time, displacement) => [45 + 490 * time / plotDuration, 195 - 175 * displacement / plotMaximum];
  const projectPoint = ([x, y, z]) => [215 + .62 * x - .44 * y, 230 + .17 * x + .11 * y - .52 * z];
  const polygon = points => points.map(point => projectPoint(point).map(value => value.toFixed(2)).join(',')).join(' ');
  document.getElementById('model-base').setAttribute('points', polygon(baseAnchors));
  function drawWave() {
    const period = 60 / Number(rateInput.value);
    document.getElementById('rate-output').textContent = `${rateInput.value} breaths/min`;
    document.getElementById('amplitude-output').textContent = `${amplitudeInput.value} mm`;
    document.getElementById('period-output').textContent = `${period.toFixed(1)} s / cycle`;
    timingControls.hidden = waveform !== 'asymmetric';
    const inhaleShare = waveform === 'asymmetric' ? Number(inhaleInput.value) / 100 : .5;
    const inhaleTime = period * inhaleShare, exhaleTime = period * (1 - inhaleShare);
    [inhaleInput, exhaleInput].forEach((input, i) => {
      const duration = period * Number(input.value) / 100;
      const label = `${duration.toFixed(2)} s (${input.value}% of cycle)`;
      document.getElementById(i === 0 ? 'inhale-output' : 'exhale-output').textContent = label;
      input.setAttribute('aria-valuetext', label);
    });
    document.getElementById('wave-description').textContent = `${waveform} analytical reference with a ${amplitudeInput.value} millimetre excursion, ${inhaleTime.toFixed(2)} seconds inhalation and ${exhaleTime.toFixed(2)} seconds exhalation in a ${period.toFixed(1)} second cycle. Fixed axes show 0 to ${plotDuration} seconds and 0 to ${plotMaximum} millimetres. Illustrative, not patient data.`;
    // Keep the axes fixed; sample repeated cycles and include their exact peaks and boundaries.
    const samples = Array.from({ length: 401 }, (_, i) => plotDuration * i / 400);
    for (let start = 0; start <= plotDuration; start += period) {
      samples.push(start);
      const peak = start + inhaleTime;
      if (peak <= plotDuration) samples.push(peak);
    }
    const times = [...new Set(samples)].sort((a, b) => a - b);
    const points = times.map(time => plotPoint(time, Number(amplitudeInput.value) * wave((time / period) % 1)).map(value => value.toFixed(2)).join(','));
    document.getElementById('wave-path').setAttribute('d', 'M' + points.join('L'));
    document.getElementById('wave-area').setAttribute('d', 'M45,195L' + points.join('L') + 'L535,195Z');
  }
  function drawPose() {
    const angle = 2 * Math.PI * phase;
    const z = Number(amplitudeInput.value) * wave(phase);
    const translation = [1.2 * Math.sin(angle), .8 * Math.sin(angle + .3), neutralHeight + z];
    const orientation = [rad(.8 * Math.sin(angle)), rad(.6 * Math.sin(angle + .4)), rad(.4 * Math.sin(angle + .8))];
    const upper = plateAnchors.map(anchor => rotate(anchor, ...orientation).map((value, axis) => value + translation[axis]));
    // A subtle visual emphasis; numerical readouts retain the unscaled model pose.
    const displayTranslation = [translation[0] * displayMotionScale, translation[1] * displayMotionScale, neutralHeight + z * displayMotionScale];
    const displayOrientation = orientation.map(value => value * displayMotionScale);
    const displayUpper = plateAnchors.map(anchor => rotate(anchor, ...displayOrientation).map((value, axis) => value + displayTranslation[axis]));
    upper.forEach((a, i) => {
      const b = baseAnchors[i], start = projectPoint(b), end = projectPoint(displayUpper[i]);
      const length = norm(a.map((value, axis) => value - b[axis]));
      const extension = length - neutralLengths[i];
      legOutputs[i].value = `${extension >= 0 ? '+' : ''}${extension.toFixed(2)} mm`;
      const line = legs[i];
      line.setAttribute('x1', start[0]); line.setAttribute('y1', start[1]);
      line.setAttribute('x2', end[0]); line.setAttribute('y2', end[1]);
      [start, end].forEach((point, j) => {
        joints[i][j].setAttribute('cx', point[0]); joints[i][j].setAttribute('cy', point[1]); joints[i][j].setAttribute('r', 4);
      });
    });
    document.getElementById('model-top').setAttribute('points', polygon(displayUpper));
    const [x, y] = plotPoint(phase * 60 / Number(rateInput.value), z);
    const cursor = document.getElementById('wave-cursor');
    cursor.setAttribute('x1', x); cursor.setAttribute('x2', x);
    const dot = document.getElementById('wave-dot');
    dot.setAttribute('cx', x); dot.setAttribute('cy', y);
    phaseInput.value = Math.round(phase * 100);
    document.getElementById('phase-output').textContent = `${Math.round(phase * 100)}%`;
    document.getElementById('pose-readout').textContent = `Z excursion: ${z.toFixed(2)} mm`;
  }
  function stopMotion() {
    running = false;
    cancelAnimationFrame(frameId);
    frameId = 0;
    playButton.textContent = 'Play motion ▷';
    playButton.setAttribute('aria-pressed', 'false');
  }
  function animate(timestamp) {
    if (!running) return;
    const elapsed = Math.min(.1, Math.max(0, (timestamp - lastTimestamp) / 1000));
    lastTimestamp = timestamp;
    phase = (phase + elapsed * Number(rateInput.value) / 60) % 1;
    drawPose();
    frameId = requestAnimationFrame(animate);
  }
  playButton.addEventListener('click', () => {
    if (running) { stopMotion(); return; }
    running = true;
    playButton.textContent = 'Pause motion Ⅱ';
    playButton.setAttribute('aria-pressed', 'true');
    lastTimestamp = performance.now();
    frameId = requestAnimationFrame(animate);
  });
  document.querySelectorAll('[data-wave]').forEach(button => button.addEventListener('click', () => {
    waveform = button.dataset.wave;
    document.querySelectorAll('[data-wave]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
    drawWave(); drawPose();
  }));
  [rateInput, amplitudeInput].forEach(input => input.addEventListener('input', () => { drawWave(); drawPose(); }));
  [inhaleInput, exhaleInput].forEach((input, index) => input.addEventListener('input', () => {
    const other = index === 0 ? exhaleInput : inhaleInput;
    other.value = 100 - Number(input.value);
    drawWave(); drawPose();
  }));
  phaseInput.addEventListener('input', () => { stopMotion(); phase = Number(phaseInput.value) / 100; drawPose(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopMotion(); });
  window.addEventListener('pagehide', stopMotion);
  reducedMotion.addEventListener('change', event => { if (event.matches) stopMotion(); });
  let autoplayPending = true;
  new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) { stopMotion(); return; }
    if (autoplayPending && !document.hidden) {
      autoplayPending = false;
      if (!running) playButton.click();
    }
  }).observe(document.querySelector('.breathing-lab'));
  drawWave(); drawPose();

  const lightbox = document.querySelector('.project-lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  let scrollBeforeDialog = '';
  document.querySelectorAll('[data-lightbox]').forEach(button => button.addEventListener('click', () => {
    const image = button.querySelector('img');
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    document.querySelector('.lightbox-image-stage').classList.toggle('is-rotated', button.classList.contains('rotated-photo'));
    document.getElementById('lightbox-caption').textContent = image.alt;
    document.getElementById('lightbox-original').href = image.src;
    scrollBeforeDialog = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    lightbox.showModal();
  }));
  function closeLightbox() {
    document.body.style.overflow = scrollBeforeDialog;
    lightbox.close();
  }
  document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
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
