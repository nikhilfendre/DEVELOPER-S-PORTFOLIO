/* script.js */
document.addEventListener('DOMContentLoaded', () => {
  // footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // MOBILE NAV
  const navToggle = document.getElementById('navToggle');
  const primaryNav = document.getElementById('primaryNav');
  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
      const open = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!open));
      primaryNav.classList.toggle('open');
    });
    primaryNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      primaryNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }));
  }

  // THEME (persist)
  const themeToggle = document.getElementById('themeToggle');
  function applyTheme(theme) {
    if (theme === 'dark') {
      document.body.classList.add('theme-dark');
      themeToggle && (themeToggle.textContent = '☀️', themeToggle.setAttribute('aria-pressed','true'));
    } else {
      document.body.classList.remove('theme-dark');
      themeToggle && (themeToggle.textContent = '🌙', themeToggle.setAttribute('aria-pressed','false'));
    }
  }
  const saved = localStorage.getItem('site-theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved || (prefersDark ? 'dark' : 'light'));
  themeToggle && themeToggle.addEventListener('click', () => {
    const current = document.body.classList.contains('theme-dark') ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('site-theme', next);
  });

  // smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href === '#' || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth', block:'start'});
      }
    });
  });

  // reveal animation using IntersectionObserver
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {threshold: 0.12});
    reveals.forEach(r => obs.observe(r));
  } else {
    reveals.forEach(r => r.classList.add('revealed'));
  }

  // project filters
  const filters = document.querySelectorAll('.filter');
  const projectsGrid = document.getElementById('projectsGrid');
  function filterProjects(filter) {
    if (!projectsGrid) return;
    const cards = projectsGrid.querySelectorAll('.project-card');
    cards.forEach(card => {
      const t = card.getAttribute('data-type') || 'frontend';
      card.style.display = (filter === 'all' || filter === t) ? '' : 'none';
    });
  }
  filters.forEach(btn => btn.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filterProjects(btn.getAttribute('data-filter'));
  }));

  // modal logic
  const modal = document.getElementById('projectModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalDemo = document.getElementById('modalDemo');
  const modalGithub = document.getElementById('modalGithub');

  function openModal() {
    if (!modal) return;
    modal.hidden = false;
    modal.style.display = 'grid';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    const firstFocusable = modal.querySelector('button, [href], input, textarea, select');
    firstFocusable && firstFocusable.focus();
  }
  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    modal.style.display = 'none';
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.view-project').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const t = btn.dataset.title || 'Project';
      const d = btn.dataset.desc || '';
      const demo = btn.dataset.demo || '#';
      const gh = btn.dataset.github || '#';
      modalTitle && (modalTitle.textContent = t);
      modalDesc && (modalDesc.textContent = d);
      modalDemo && (modalDemo.href = demo);
      modalGithub && (modalGithub.href = gh);
      openModal();
      e.preventDefault();
    });
  });

  // close modal handlers
  modal && modal.addEventListener('click', (ev) => {
    const content = modal.querySelector('.modal-content');
    if (!content.contains(ev.target)) closeModal();
  });
  modal && modal.querySelectorAll('[data-modal-close], .modal-close').forEach(btn => btn.addEventListener('click', closeModal));
  window.addEventListener('keydown', (ev) => {
    if ((ev.key === 'Escape' || ev.key === 'Esc') && modal && !modal.hidden) closeModal();
  });

});
