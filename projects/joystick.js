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

  const asset = name => `../assets/projects/joystick/${name}`;
  const parts = {
    handle: { index: '01', title: 'Handle & top plate', text: 'The waterjet-cut aluminium handle extends beyond the top platform’s nominal circle to fit naturally in the hand. A connector joins the handle to the top plate; soft TPE grip pieces were specified for cushioning.', specs: [['Material', '5 mm aluminium'], ['Handle size', '280 × 230 mm']], image: 'cad-handle.jpg', alt: 'CAD close-up of the handle and top assembly' },
    legs: { index: '02', title: 'Six sensing legs', text: 'Six linear potentiometer arms connect the upper and lower assemblies. Their changing extension provides the physical input for the intended joystick interface. The home position places the arms near mid-extension to leave room for motion in either direction.', specs: [['Quantity', '6 potentiometers'], ['Purpose', 'Motion input sensing']], image: 'cad-assembly.jpg', alt: 'CAD view showing all six potentiometer arms' },
    wedges: { index: '03', title: 'Wedges, joints & bushings', text: 'Custom wedges are inclined in three axes to orient the leg joints. Bushings provide spacing between the joint and wedge, allowing more rotation before contact. Printed PLA parts support fabrication and iterative changes.', specs: [['Wedges', 'Tri-axis inclination'], ['Bushings', 'Joint spacers']], image: 'cad-joint.jpg', alt: 'Close-up CAD rendering of a leg joint and lower wedge' },
    base: { index: '04', title: 'Steel base & nylon supports', text: 'The base uses cut and welded mild-steel pipes with a 1 × 2 inch cross-section. Waterjet-cut nylon supports provide recesses for bolt heads and friction beneath the base. The frame was ground, primed, and enamel-painted before assembly.', specs: [['Frame', 'Mild-steel pipes'], ['Supports', '8 mm nylon']], image: 'base-assembly.jpg', alt: 'Painted base frame with the nylon supports installed' }
  };
  document.querySelectorAll('[data-part]').forEach(button => button.addEventListener('click', () => {
    const part = parts[button.dataset.part];
    document.querySelectorAll('[data-part]').forEach(other => {
      const selected = other === button;
      other.setAttribute('aria-pressed', String(selected));
      other.classList.toggle('selected', selected);
    });
    document.getElementById('part-index').textContent = `COMPONENT ${part.index} / 04`;
    document.getElementById('part-title').textContent = part.title;
    document.getElementById('part-description').textContent = part.text;
    const spec = document.getElementById('part-spec');
    spec.replaceChildren();
    part.specs.forEach(([label, value]) => {
      const row = document.createElement('div'), dt = document.createElement('dt'), dd = document.createElement('dd');
      dt.textContent = label; dd.textContent = value; row.append(dt, dd); spec.append(row);
    });
    const image = document.getElementById('part-image');
    image.src = asset(part.image); image.alt = part.alt;
  }));

  document.querySelectorAll('[data-drawing]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-drawing]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
    const image = document.getElementById('design-drawing');
    image.src = asset(`design-view-${button.dataset.drawing}.png`);
    image.alt = `${button.textContent} drawing of the Stewart–Gough joystick`;
    document.getElementById('drawing-caption').textContent = `${button.textContent} view`;
  }));

  const network = {
    input: ['Input: six actuator joint angles', 'The model receives θ₁ through θ₆ from the all-revolute 6-RSS manipulator. These are angular inputs from that robot, rather than direct linear-potentiometer measurements from this joystick.'],
    hidden: ['Hidden layer: learning the nonlinear relationship', 'The network uses a dense hidden layer with 230 neurons and a tanh activation function. Model parameters are learned with the Adam optimizer by minimizing mean squared error against known pose data.'],
    output: ['Output: position and orientation', 'Six output neurons return X, Y, Z, roll, pitch, and yaw. The linear output activation supports regression of the platform pose. This estimates pose from the input angles; it does not itself command the motors.']
  };
  document.querySelectorAll('[data-network]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-network]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
    const [title, text] = network[button.dataset.network];
    document.getElementById('network-title').textContent = title;
    document.getElementById('network-description').textContent = text;
  }));

  const flows = {
    command: { steps: [['Desired platform pose', 'Position and orientation requested through the graphical interface.'], ['Inverse kinematics', 'Convert the desired pose into the robot’s six actuator joint angles.'], ['Physical 6-RSS robot', 'An embedded controller commands six Dynamixel MX-64T motors.']], caption: 'Command path: requested pose → inverse kinematics → robot actuation.' },
    feedback: { steps: [['Joint-angle feedback', 'The embedded controller reads the six actuator angles from the physical manipulator.'], ['Neural-network forward kinematics', 'Use the trained angle-to-pose mapping to estimate the end-effector position and orientation.'], ['WebGL digital twin', 'Update the virtual platform so its displayed pose follows the physical robot.']], caption: 'Feedback path: measured joint angles → forward kinematics → virtual pose.' }
  };
  document.querySelectorAll('[data-control]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-control]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
    const flow = flows[button.dataset.control];
    flow.steps.forEach(([title, text], i) => {
      document.getElementById(`flow-title-${i + 1}`).textContent = title;
      document.getElementById(`flow-copy-${i + 1}`).textContent = text;
    });
    document.getElementById('flow-caption').textContent = flow.caption;
  }));

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
