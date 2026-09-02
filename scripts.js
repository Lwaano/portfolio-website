document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Live GitHub repo feed (fetched directly, no third-party badge service) ---------- */
  const LANGUAGE_COLORS = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    Python: '#3572A5',
    PHP: '#4F5D95',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Java: '#b07219',
    'C++': '#f34b7d',
    C: '#555555',
    'C#': '#178600',
    Ruby: '#701516',
    Go: '#00ADD8',
    Shell: '#89e051',
  };

  async function loadRepoFeed() {
    const feedEl = document.getElementById('repoFeed');
    const statusEl = document.getElementById('repoFeedStatus');
    const CACHE_KEY = 'gh_repo_feed_v1';

    function render(repos) {
      feedEl.innerHTML = '';
      repos.forEach(repo => {
        const card = document.createElement('a');
        card.className = 'glass-card repo-card';
        card.href = repo.html_url;
        card.target = '_blank';
        card.rel = 'noopener';

        const langColor = LANGUAGE_COLORS[repo.language] || 'var(--primary)';
        const langHtml = repo.language
          ? `<span class="repo-lang"><span class="repo-lang-dot" style="background:${langColor}"></span>${repo.language}</span>`
          : '';

        card.innerHTML = `
          <span class="repo-card-name"><i class="fa-solid fa-code-branch"></i>${repo.name}</span>
          <p class="repo-card-desc">${repo.description || 'No description provided.'}</p>
          <div class="repo-card-meta">
            ${langHtml}
            <span><i class="fa-solid fa-star"></i> ${repo.stargazers_count}</span>
            <span>Updated ${new Date(repo.pushed_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
          </div>
        `;
        feedEl.appendChild(card);
      });
    }

    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        render(JSON.parse(cached));
        return;
      }

      const response = await fetch('https://api.github.com/users/Lwaano/repos?sort=pushed&per_page=10');
      if (!response.ok) throw new Error(`GitHub API responded ${response.status}`);
      const repos = (await response.json())
        .filter(r => !r.fork)
        .slice(0, 4);

      if (repos.length === 0) throw new Error('No repositories found');

      sessionStorage.setItem(CACHE_KEY, JSON.stringify(repos));
      render(repos);
    } catch {
      statusEl.textContent = "Couldn't load live repositories right now.";
      const link = document.createElement('a');
      link.href = 'https://github.com/Lwaano';
      link.target = '_blank';
      link.rel = 'noopener';
      link.className = 'btn-neon btn-ghost';
      link.style.marginTop = '1rem';
      link.innerHTML = '<i class="fa-brands fa-github"></i> View GitHub Profile';
      statusEl.appendChild(document.createElement('br'));
      statusEl.appendChild(link);
    }
  }

  loadRepoFeed();

  /* ---------- Theme toggle ---------- */
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle.querySelector('i');

  function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    themeIcon.className = theme === 'light' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
  }

  const savedTheme = localStorage.getItem('theme') ||
    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  applyTheme(savedTheme);

  themeToggle.addEventListener('click', () => {
    const next = document.body.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    applyTheme(next);
    localStorage.setItem('theme', next);
  });

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  });

  document.querySelectorAll('#navMenu .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    });
  });

  /* ---------- Smooth scroll for in-page links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ---------- Scroll progress bar ---------- */
  const scrollProgress = document.getElementById('scrollProgress');
  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = `${pct}%`;
  }
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  /* ---------- Back to top ---------- */
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- Active nav link on scroll (scroll-spy) ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px' });
  sections.forEach(section => spyObserver.observe(section));

  /* ---------- Typewriter hero roles ---------- */
  const roles = ['Web Developer', 'Software Engineer', 'Creative Designer'];
  const typewriterEl = document.getElementById('typewriter');
  let roleIndex = 0, charIndex = 0, deleting = false;

  function typeLoop() {
    const current = roles[roleIndex];
    if (!deleting) {
      charIndex++;
      typewriterEl.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(typeLoop, 1400);
        return;
      }
    } else {
      charIndex--;
      typewriterEl.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(typeLoop, deleting ? 45 : 90);
  }
  typeLoop();

  /* ---------- Skill ring animation on scroll ---------- */
  const RING_CIRCUMFERENCE = 2 * Math.PI * 52;

  function animateSkills() {
    document.querySelectorAll('.skill-card').forEach(card => {
      const level = Number(card.dataset.level);
      const ring = card.querySelector('.skill-ring-fill');
      const percentLabel = card.querySelector('.skill-percent');

      ring.style.strokeDashoffset = String(RING_CIRCUMFERENCE * (1 - level / 100));

      const duration = 1400;
      const start = performance.now();
      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        percentLabel.textContent = `${Math.round(level * progress)}%`;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }

  const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateSkills();
        skillsObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });
  const skillsGrid = document.querySelector('.skills-grid');
  if (skillsGrid) skillsObserver.observe(skillsGrid);

  /* ---------- Reveal-on-scroll for cards & sections ---------- */
  const revealTargets = document.querySelectorAll('.project-card, .about-text, .about-image, .now-panel, .contact-container');
  revealTargets.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealTargets.forEach(el => revealObserver.observe(el));

  /* ---------- Project tag filter (built from real DOM data, no fake data source) ---------- */
  const projectCards = Array.from(document.querySelectorAll('.project-card'));
  const filterButtonsWrap = document.getElementById('filterButtons');
  const noResults = document.getElementById('noResults');

  const allTags = new Set();
  projectCards.forEach(card => {
    (card.dataset.tags || '').split(',').forEach(tag => {
      if (tag.trim()) allTags.add(tag.trim());
    });
  });

  allTags.forEach(tag => {
    const btn = document.createElement('button');
    btn.className = 'filter-chip';
    btn.dataset.filter = tag;
    btn.textContent = tag;
    filterButtonsWrap.appendChild(btn);
  });

  filterButtonsWrap.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-chip');
    if (!btn) return;

    filterButtonsWrap.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    let visibleCount = 0;
    projectCards.forEach(card => {
      const tags = (card.dataset.tags || '').split(',').map(t => t.trim());
      const show = filter === 'all' || tags.includes(filter);
      card.style.display = show ? '' : 'none';
      if (show) visibleCount++;
    });
    noResults.hidden = visibleCount !== 0;
  });

  /* ---------- 3D tilt hover on project cards ---------- */
  projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = ((y / rect.height) - 0.5) * -8;
      const rotateY = ((x / rect.width) - 0.5) * 8;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ---------- Live per-project GitHub stats (only shown when the repo actually resolves) ---------- */
  function getRepoPath(card) {
    const link = card.querySelector('a[href*="github.com/"]');
    if (!link) return null;
    const match = new URL(link.href).pathname.match(/^\/([^/]+)\/([^/]+)\/?$/);
    return match ? `${match[1]}/${match[2]}` : null;
  }

  async function loadCardStats(card) {
    const repoPath = getRepoPath(card);
    if (!repoPath) return;

    const cacheKey = `gh_repo_stat_${repoPath}`;
    try {
      let data = sessionStorage.getItem(cacheKey);
      if (data) {
        data = JSON.parse(data);
      } else {
        const res = await fetch(`https://api.github.com/repos/${repoPath}`);
        if (!res.ok) return;
        const repo = await res.json();
        data = { stars: repo.stargazers_count, updated: repo.pushed_at };
        sessionStorage.setItem(cacheKey, JSON.stringify(data));
      }

      const statsEl = document.createElement('div');
      statsEl.className = 'project-stats';
      statsEl.innerHTML = `
        <span><i class="fa-solid fa-star"></i>${data.stars} stars</span>
        <span><i class="fa-solid fa-clock"></i>Updated ${new Date(data.updated).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
      `;
      card.querySelector('.project-description').insertAdjacentElement('afterend', statsEl);
    } catch {
      // Silently skip — a card with no verifiable live data just shows its static content.
    }
  }

  projectCards.forEach(loadCardStats);

  /* ---------- Project detail modal ---------- */
  const projectModal = document.getElementById('projectModal');
  const projectModalBackdrop = document.getElementById('projectModalBackdrop');
  const projectModalClose = document.getElementById('projectModalClose');

  function openProjectModal(card) {
    document.getElementById('projectModalIcon').innerHTML = card.querySelector('.project-icon').innerHTML;
    document.getElementById('projectModalTitle').textContent = card.querySelector('h3').textContent;
    document.getElementById('projectModalTags').innerHTML = card.querySelector('.project-tags').innerHTML;
    document.getElementById('projectModalDesc').textContent = card.querySelector('.project-description').textContent.trim();

    const statsSource = card.querySelector('.project-stats');
    const statsTarget = document.getElementById('projectModalStats');
    statsTarget.hidden = !statsSource;
    statsTarget.innerHTML = statsSource ? statsSource.innerHTML : '';

    const linksSource = card.querySelector('.project-links');
    document.getElementById('projectModalLinks').innerHTML = linksSource ? linksSource.innerHTML : '';

    projectModal.hidden = false;
    projectModalClose.focus();
  }

  function closeProjectModal() {
    projectModal.hidden = true;
  }

  projectCards.forEach(card => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `View details for ${card.querySelector('h3').textContent}`);

    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      openProjectModal(card);
    });
    card.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && !e.target.closest('a')) {
        e.preventDefault();
        openProjectModal(card);
      }
    });
  });

  projectModalBackdrop.addEventListener('click', closeProjectModal);
  projectModalClose.addEventListener('click', closeProjectModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !projectModal.hidden) closeProjectModal();
  });

  /* ---------- Toast helper ---------- */
  const toastEl = document.getElementById('toast');
  let toastTimer;
  function showToast(message, type = 'default') {
    toastEl.textContent = message;
    toastEl.classList.add('show');
    toastEl.classList.toggle('success', type === 'success');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3000);
  }

  /* ---------- Copy email ---------- */
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const EMAIL = 'siakalimalwaano@gmail.com';
  copyEmailBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      showToast('Email copied to clipboard ✔', 'success');
    } catch {
      showToast(`Email: ${EMAIL}`);
    }
  });

  /* ---------- Contact form (delivered via Web3Forms, plain POST — no CORS/AJAX dependency) ---------- */
  const contactForm = document.getElementById('contactForm');
  const contactSubmit = document.getElementById('contactSubmit');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const redirectField = document.getElementById('redirectField');

  redirectField.value = `${location.origin}${location.pathname}?sent=true#contact`;

  function setFieldError(input, errorId, message) {
    document.getElementById(errorId).textContent = message;
  }

  contactForm.addEventListener('submit', (e) => {
    let valid = true;

    if (!nameInput.value.trim()) {
      setFieldError(nameInput, 'nameError', 'Please enter your name.');
      valid = false;
    } else {
      setFieldError(nameInput, 'nameError', '');
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput.value.trim())) {
      setFieldError(emailInput, 'emailError', 'Please enter a valid email.');
      valid = false;
    } else {
      setFieldError(emailInput, 'emailError', '');
    }

    if (!messageInput.value.trim()) {
      setFieldError(messageInput, 'messageError', 'Please enter a message.');
      valid = false;
    } else {
      setFieldError(messageInput, 'messageError', '');
    }

    if (!valid) {
      e.preventDefault();
      return;
    }

    contactSubmit.disabled = true;
    contactSubmit.querySelector('span').textContent = 'Sending…';
  });

  if (new URLSearchParams(location.search).get('sent') === 'true') {
    showToast("Message sent — I'll get back to you soon!", 'success');
    document.getElementById('contact')?.scrollIntoView();
    history.replaceState(null, '', location.pathname + location.hash);
  }

  /* ---------- Lightweight canvas particle background (no external lib) ---------- */
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationFrame;

  function resizeCanvas() {
    const hero = document.querySelector('.hero');
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  }

  function createParticles() {
    const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 18000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 2 + 1
    }));
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(96, 165, 250, 0.7)';
      ctx.fill();
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(37, 99, 235, ${1 - dist / 120})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    animationFrame = requestAnimationFrame(drawParticles);
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (canvas && !reducedMotion) {
    resizeCanvas();
    createParticles();
    drawParticles();
    window.addEventListener('resize', () => {
      cancelAnimationFrame(animationFrame);
      resizeCanvas();
      createParticles();
      drawParticles();
    });
  }

  /* ---------- Command palette (Ctrl+K quick actions) ---------- */
  const palette = document.getElementById('commandPalette');
  const paletteInput = document.getElementById('paletteInput');
  const paletteResults = document.getElementById('paletteResults');
  const paletteToggle = document.getElementById('paletteToggle');
  const paletteBackdrop = document.getElementById('paletteBackdrop');

  const commands = [
    { label: 'Go to Home', icon: 'fa-house', action: () => scrollToId('home') },
    { label: 'Go to About', icon: 'fa-user', action: () => scrollToId('about') },
    { label: 'Go to GitHub Activity', icon: 'fa-chart-line', action: () => scrollToId('github') },
    { label: 'Go to Skills', icon: 'fa-layer-group', action: () => scrollToId('skills') },
    { label: 'Go to Projects', icon: 'fa-diagram-project', action: () => scrollToId('projects') },
    { label: 'Go to Contact', icon: 'fa-envelope', action: () => scrollToId('contact') },
    { label: 'Toggle theme', icon: 'fa-circle-half-stroke', action: () => themeToggle.click() },
    { label: 'Copy email address', icon: 'fa-copy', action: () => copyEmailBtn.click() },
    { label: 'Open GitHub profile', icon: 'fa-brands fa-github', action: () => window.open('https://github.com/Lwaano', '_blank', 'noopener') },
    { label: 'Open LinkedIn profile', icon: 'fa-brands fa-linkedin', action: () => window.open('https://www.linkedin.com/in/lwaano-siakalima-917318225', '_blank', 'noopener') },
  ];

  function scrollToId(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
  }

  let activeIndex = 0;

  function renderPaletteResults(filter = '') {
    const matches = commands.filter(c => c.label.toLowerCase().includes(filter.toLowerCase()));
    paletteResults.innerHTML = '';
    activeIndex = 0;

    if (matches.length === 0) {
      const li = document.createElement('li');
      li.innerHTML = '<span class="empty">No matching commands</span>';
      paletteResults.appendChild(li);
      return;
    }

    matches.forEach((cmd, i) => {
      const li = document.createElement('li');
      li.className = i === 0 ? 'active' : '';
      const iconClass = cmd.icon.startsWith('fa-brands') ? cmd.icon : `fa-solid ${cmd.icon}`;
      li.innerHTML = `<i class="${iconClass}"></i><span>${cmd.label}</span>`;
      li.addEventListener('click', () => {
        cmd.action();
        closePalette();
      });
      paletteResults.appendChild(li);
    });
  }

  function openPalette() {
    palette.hidden = false;
    paletteInput.value = '';
    renderPaletteResults();
    setTimeout(() => paletteInput.focus(), 0);
  }

  function closePalette() {
    palette.hidden = true;
  }

  paletteToggle.addEventListener('click', openPalette);
  paletteBackdrop.addEventListener('click', closePalette);

  paletteInput.addEventListener('input', () => renderPaletteResults(paletteInput.value));

  paletteInput.addEventListener('keydown', (e) => {
    const items = Array.from(paletteResults.querySelectorAll('li'));
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIndex = Math.min(activeIndex + 1, items.length - 1);
      items.forEach((li, i) => li.classList.toggle('active', i === activeIndex));
      items[activeIndex]?.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIndex = Math.max(activeIndex - 1, 0);
      items.forEach((li, i) => li.classList.toggle('active', i === activeIndex));
      items[activeIndex]?.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
      items[activeIndex]?.click();
    } else if (e.key === 'Escape') {
      closePalette();
    }
  });

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      palette.hidden ? openPalette() : closePalette();
    }
    if (e.key === 'Escape' && !palette.hidden) {
      closePalette();
    }
  });

  /* ---------- Easter egg: Konami code confetti burst ---------- */
  const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let konamiProgress = 0;

  function launchConfetti() {
    const colors = ['#2563EB', '#60A5FA', '#93C5FD', '#1D4ED8', '#4ADE80'];
    for (let i = 0; i < 120; i++) {
      const piece = document.createElement('div');
      const size = Math.random() * 8 + 4;
      piece.style.cssText = `
        position: fixed;
        top: -20px;
        left: ${Math.random() * 100}vw;
        width: ${size}px;
        height: ${size}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        opacity: ${Math.random() * 0.5 + 0.5};
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        z-index: 4000;
        pointer-events: none;
        transform: rotate(${Math.random() * 360}deg);
      `;
      document.body.appendChild(piece);
      const duration = Math.random() * 2000 + 2500;
      const drift = (Math.random() - 0.5) * 200;
      piece.animate([
        { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
        { transform: `translate(${drift}px, ${window.innerHeight + 40}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
      ], { duration, easing: 'ease-in' }).onfinish = () => piece.remove();
    }
    showToast('🎉 You found the secret! Thanks for exploring.');
  }

  document.addEventListener('keydown', (e) => {
    konamiProgress = (e.key === konamiSequence[konamiProgress]) ? konamiProgress + 1 : 0;
    if (konamiProgress === konamiSequence.length) {
      konamiProgress = 0;
      launchConfetti();
    }
  });

});
