  // Sticky header shadow
  const header = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 12);
  });

  // Mobile menu
  const hamburger = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
  }));

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const b64 = item.getAttribute('data-full');
      lightboxImg.src = 'data:image/webp;base64,' + b64;
      lightboxImg.alt = item.getAttribute('data-caption') || 'Gallery preview';
      lightbox.classList.add('open');
    });
  });
  document.getElementById('lightboxClose').addEventListener('click', () => lightbox.classList.remove('open'));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.remove('open'); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') lightbox.classList.remove('open'); });

  // Contact form validation (frontend-only demo)
  const form = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  form.addEventListener('submit', function(e){
    e.preventDefault();
    let valid = true;

    const nameField = document.getElementById('fieldName');
    const nameInput = document.getElementById('nameInput');
    if (!nameInput.value.trim()) { nameField.classList.add('invalid'); valid = false; }
    else { nameField.classList.remove('invalid'); }

    const emailField = document.getElementById('fieldEmail');
    const emailInput = document.getElementById('emailInput');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput.value.trim())) { emailField.classList.add('invalid'); valid = false; }
    else { emailField.classList.remove('invalid'); }

    const msgField = document.getElementById('fieldMessage');
    const msgInput = document.getElementById('messageInput');
    if (!msgInput.value.trim()) { msgField.classList.add('invalid'); valid = false; }
    else { msgField.classList.remove('invalid'); }

    if (valid) {
      formSuccess.classList.add('show');
      form.reset();
      formSuccess.scrollIntoView({behavior:'smooth', block:'nearest'});
    } else {
      formSuccess.classList.remove('show');
    }
  });

  document.getElementById('year').textContent = new Date().getFullYear();

  // ---------- Theme toggle (dark / light mode) ----------
  (function () {
    const root = document.documentElement;
    const toggleBtn = document.getElementById('themeToggle');
    const toggleBtnMobile = document.getElementById('themeToggleMobile');
    const stored = localStorage.getItem('hunargah-theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = stored || (prefersDark ? 'dark' : 'light');

    function applyTheme(theme) {
      if (theme === 'dark') {
        root.setAttribute('data-theme', 'dark');
      } else {
        root.removeAttribute('data-theme');
      }
      const isDark = theme === 'dark';
      [toggleBtn, toggleBtnMobile].forEach(btn => {
        if (!btn) return;
        btn.setAttribute('aria-pressed', String(isDark));
        btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      });
    }

    applyTheme(initial);

    function toggleTheme() {
      const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('hunargah-theme', next);
    }

    if (toggleBtn) toggleBtn.addEventListener('click', toggleTheme);
    if (toggleBtnMobile) toggleBtnMobile.addEventListener('click', toggleTheme);
  })();

  // ---------- Toast notifications ----------
  function showToast(message, type) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast toast-' + (type || 'success');
    const iconSuccess = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M8 12l2.5 2.5L16 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    const iconError = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M12 8v5M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
    toast.innerHTML = (type === 'error' ? iconError : iconSuccess) + '<span>' + message + '</span>';
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 4200);
  }

  // ---------- Scroll reveal animations ----------
  (function () {
    const revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length) return;
    if (!('IntersectionObserver' in window)) {
      revealEls.forEach(el => el.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => observer.observe(el));
  })();

  // ---------- Back to top button ----------
  (function () {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('show', window.scrollY > 480);
    });
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  })();

  // ---------- Gallery keyboard accessibility ----------
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });
  });

  // ---------- Wire toast into the existing contact form success ----------
  (function () {
    const existingForm = document.getElementById('contactForm');
    if (!existingForm) return;
    existingForm.addEventListener('submit', function () {
      const nameField = document.getElementById('fieldName');
      const emailField = document.getElementById('fieldEmail');
      const msgField = document.getElementById('fieldMessage');
      const stillInvalid = [nameField, emailField, msgField].some(f => f && f.classList.contains('invalid'));
      if (!stillInvalid) {
        showToast("Message ready — we'll get back to you soon.", 'success');
      }
    });
  })();
