/* script.js - interactions: nav, theme, reveal, modal, filters, back-top, avatar ring touch */
document.addEventListener('DOMContentLoaded', () => {
  // year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // nav toggle
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

  // theme toggle
const themeToggle = document.getElementById('themeToggle');

function applyTheme(theme) {
  if (theme === "light") {
    document.body.classList.remove("theme-dark");
    document.body.classList.add("theme-light");
    themeToggle.textContent = "🌙";
    themeToggle.setAttribute("aria-pressed", "false");
  } else {
    document.body.classList.remove("theme-light");
    document.body.classList.add("theme-dark");
    themeToggle.textContent = "☀️";
    themeToggle.setAttribute("aria-pressed", "true");
  }
}

// Load theme from storage or default
const savedTheme = localStorage.getItem("theme") || "dark";
applyTheme(savedTheme);

// Click to toggle
themeToggle.addEventListener("click", () => {
  const current = document.body.classList.contains("theme-dark") ? "dark" : "light";
  const next = current === "dark" ? "light" : "dark";
  applyTheme(next);
  localStorage.setItem("theme", next);
});


  // smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const t = document.querySelector(href);
      if (t) {
        e.preventDefault();
        t.scrollIntoView({behavior:'smooth', block:'start'});
      }
    });
  });

  // reveal animations
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(ent => {
        if (ent.isIntersecting) {
          ent.target.classList.add('revealed');
          obs.unobserve(ent.target);
        }
      });
    }, {threshold: 0.12});
    reveals.forEach(r => io.observe(r));
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

  // modal
  const modal = document.getElementById('projectModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalDemo = document.getElementById('modalDemo');
  const modalGithub = document.getElementById('modalGithub');

  function openModal(title, desc, demo, github) {
    if (!modal) return;
    modalTitle.textContent = title || '';
    modalDesc.textContent = desc || '';
    if (modalDemo) modalDemo.href = demo || '#';
    if (modalGithub) modalGithub.href = github || '#';
    modal.hidden = false;
    modal.style.display = 'grid';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    // focus
    const focusable = modal.querySelector('button, [href], input, textarea');
    focusable && focusable.focus();
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
      const title = btn.dataset.title || 'Project';
      const desc = btn.dataset.desc || '';
      const demo = btn.dataset.demo || '#';
      const gh = btn.dataset.github || '#';
      openModal(title, desc, demo, gh);
      e.preventDefault();
    });
  });

  if (modal) {
    modal.addEventListener('click', (ev) => {
      const content = modal.querySelector('.modal-content');
      if (!content.contains(ev.target)) closeModal();
    });
    modal.querySelectorAll('[data-modal-close], .modal-close').forEach(b => b.addEventListener('click', closeModal));
  }
  window.addEventListener('keydown', (ev) => {
    if ((ev.key === 'Escape' || ev.key === 'Esc') && modal && !modal.hidden) closeModal();
  });

  // back-to-top button (safe check)
  const backTop = document.getElementById('backTop');
  if (backTop) {
    // show/hide on scroll
    const onScroll = () => {
      backTop.style.display = (window.scrollY > 500) ? 'block' : 'none';
    };
    window.addEventListener('scroll', onScroll);
    onScroll(); // initialize

    backTop.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
  }

  // accessibility: allow Enter on project-card to open modal
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const btn = card.querySelector('.view-project');
        if (btn) btn.click();
      }
    });
  });

  // -------------------------------
  // Avatar ring touch & keyboard support
  // toggles 'ring-hover' class to show morph/neon effects on mobile/keyboard
  // -------------------------------
  (function avatarRingTouch() {
    const wrap = document.querySelector('.avatar-wrap');
    if (!wrap) return;

    // make keyboard-focusable
    if (!wrap.hasAttribute('tabindex')) wrap.setAttribute('tabindex', '0');

    let touchTimeout = null;
    const clearTouch = () => {
      if (touchTimeout) {
        clearTimeout(touchTimeout);
        touchTimeout = null;
      }
    };

    wrap.addEventListener('touchstart', (e) => {
      // add class to trigger CSS hover styles on touch devices
      wrap.classList.add('ring-hover');
      clearTouch();
      touchTimeout = setTimeout(() => wrap.classList.remove('ring-hover'), 2200);
    }, {passive: true});

    // keyboard accessibility: Enter or Space toggles the effect briefly
    wrap.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        wrap.classList.add('ring-hover');
        clearTouch();
        touchTimeout = setTimeout(() => wrap.classList.remove('ring-hover'), 2200);
      }
    });

    // optional: remove class if user clicks elsewhere
    document.addEventListener('click', (ev) => {
      if (!wrap.contains(ev.target)) wrap.classList.remove('ring-hover');
    });
  })();

});


