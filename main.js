/* Numair Alsaleh — portfolio
   GSAP ScrollTrigger drives every scroll animation, Lenis smooths the scroll,
   and a 2D canvas draws the dot sphere behind the page.
   Everything is visible by default in CSS, so the page still reads fine
   with reduced motion on, or if a script fails to load. */

(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Shared values the scroll animations write and the canvas reads.
  const state = { scroll: 0, scatter: 0, gather: 0 };

  const orb = createOrb(document.getElementById('orb'), state);

  if (!window.gsap || !window.ScrollTrigger || reduceMotion) {
    orb.drawStatic();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Smooth scrolling ---------- */
  let lenis = null;
  if (window.Lenis) {
    lenis = new Lenis({ lerp: 0.1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { duration: 1.4 });
      else target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ---------- Page progress ---------- */
  gsap.to('.progress span', {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: { start: 0, end: 'max', scrub: 0.3 }
  });
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => { state.scroll = self.progress; }
  });

  /* ---------- Hero: name shrinks away, sphere bursts into a starfield ---------- */
  gsap.timeline({
    scrollTrigger: { trigger: '.hero', start: 'top top', end: '+=90%', scrub: true, pin: true }
  })
    .to('.hero__inner', { scale: 0.7, autoAlpha: 0, ease: 'none' }, 0)
    .to(state, { scatter: 1, ease: 'power1.in' }, 0);

  /* ---------- Pitch: one word at a time ---------- */
  gsap.timeline({
    scrollTrigger: { trigger: '.pitch', start: 'top top', end: '+=130%', scrub: true, pin: true }
  }).fromTo(
    '.pitch__text span',
    { opacity: 0.12, y: 36 },
    { opacity: 1, y: 0, stagger: 0.6, ease: 'power2.out' }
  );

  /* ---------- Stats: ring fills, numbers count up ---------- */
  const statsTl = gsap.timeline({
    scrollTrigger: { trigger: '.stats', start: 'top 75%', end: 'center 45%', scrub: true }
  });
  statsTl.fromTo('.stats__arc', { strokeDashoffset: 879.65 }, { strokeDashoffset: 0, ease: 'none' }, 0);
  document.querySelectorAll('[data-count]').forEach((el) => {
    const end = Number(el.dataset.count);
    const counter = { v: 0 };
    statsTl.fromTo(
      counter,
      { v: 0 },
      { v: end, ease: 'none', onUpdate: () => { el.textContent = Math.round(counter.v); } },
      0
    );
  });
  statsTl.from('.stats__copy li', { y: 30, opacity: 0, stagger: 0.15, ease: 'power2.out' }, 0);

  /* ---------- Work: sideways on desktop, stacked reveals on phones ---------- */
  const mm = gsap.matchMedia();

  mm.add('(min-width: 900px)', () => {
    const track = document.querySelector('.work__track');
    const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
    gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: '.work',
        start: 'top top',
        end: () => '+=' + distance(),
        scrub: true,
        pin: true,
        invalidateOnRefresh: true
      }
    });
    gsap.from('.card', {
      y: 60,
      opacity: 0,
      stagger: 0.12,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.work', start: 'top 65%' }
    });
  });

  mm.add('(max-width: 899px)', () => {
    gsap.utils.toArray('.card').forEach((card) => {
      gsap.from(card, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 85%' }
      });
    });
  });

  /* ---------- Contact: sphere pulls back together ---------- */
  gsap.to(state, {
    gather: 1,
    ease: 'power1.out',
    scrollTrigger: { trigger: '.contact', start: 'top bottom', end: 'top 15%', scrub: true }
  });
  gsap.from('.contact__inner > *', {
    y: 50,
    opacity: 0,
    stagger: 0.12,
    duration: 0.9,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.contact', start: 'top 60%' }
  });

  /* ---------- Canvas loop ---------- */
  gsap.ticker.add((time) => orb.draw(time));

  // Web fonts change text sizes; re-measure once they are in.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }

  /* ================================================================== */

  function createOrb(canvas, s) {
    const ctx = canvas.getContext('2d');
    const COUNT = 1100;
    const GOLDEN = 2.399963229728653;
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#C6F432';
    const points = [];

    for (let i = 0; i < COUNT; i++) {
      const y = 1 - (2 * (i + 0.5)) / COUNT;
      const ring = Math.sqrt(1 - y * y);
      const theta = i * GOLDEN;
      points.push({
        x: Math.cos(theta) * ring,
        y: y,
        z: Math.sin(theta) * ring,
        sx: (Math.random() - 0.5) * 2,
        sy: (Math.random() - 0.5) * 2,
        sz: (Math.random() - 0.5) * 0.7,
        size: 0.7 + Math.random() * 1.3
      });
    }

    let w = 0;
    let h = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw(time) {
      const burst = s.scatter * (1 - s.gather);
      const radius = Math.min(w, h) * 0.34;
      const spread = Math.max(w, h) * 0.85;
      const focal = 900;
      const rotY = time * 0.12 + s.scroll * 3;
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(0.35);
      const sinX = Math.sin(0.35);
      const fade = 1 - 0.62 * burst;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = accent;

      for (let i = 0; i < COUNT; i++) {
        const p = points[i];
        const x0 = p.x * radius + p.sx * spread * burst;
        const y0 = p.y * radius + p.sy * spread * burst;
        const z0 = p.z * radius + p.sz * spread * burst;

        const x1 = x0 * cosY - z0 * sinY;
        const z1 = x0 * sinY + z0 * cosY;
        const y2 = y0 * cosX - z1 * sinX;
        const z2 = y0 * sinX + z1 * cosX;

        const depth = focal + z2;
        if (depth < 220) continue;
        const k = focal / depth;
        const px = w / 2 + x1 * k;
        const py = h / 2 + y2 * k;
        if (px < -4 || px > w + 4 || py < -4 || py > h + 4) continue;

        const near = Math.max(0, Math.min(1, (radius - z2) / (2 * radius)));
        ctx.globalAlpha = (0.18 + 0.72 * near) * fade;
        const size = p.size * k * 1.5;
        ctx.fillRect(px, py, size, size);
      }
      ctx.globalAlpha = 1;
    }

    resize();
    window.addEventListener('resize', () => {
      resize();
      if (reduceMotion || !window.gsap) draw(0);
    });

    return { draw: draw, drawStatic: () => draw(0) };
  }
})();
