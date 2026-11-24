/**
 * KENSEI – Martial Arts & Self-Defense Academy
 * Core JavaScript Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ----------------------------------------------------
  // 1. Theme Toggle (Dark / Light) with Persistence
  // ----------------------------------------------------
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeToggleIcon');
  const htmlRoot = document.documentElement;

  // Retrieve saved theme or default to dark
  const savedTheme = localStorage.getItem('kensei_theme') || 'dark';
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-bs-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('kensei_theme', newTheme);
    });
  }

  function applyTheme(theme) {
    htmlRoot.setAttribute('data-bs-theme', theme);
    htmlRoot.setAttribute('data-theme', theme);
    if (themeIcon) {
      if (theme === 'light') {
        themeIcon.className = 'bi bi-moon-stars-fill';
        themeToggleBtn?.setAttribute('title', 'Switch to Dark Mode');
      } else {
        themeIcon.className = 'bi bi-sun-fill';
        themeToggleBtn?.setAttribute('title', 'Switch to Light Mode');
      }
    }
  }

  // ----------------------------------------------------
  // 2. RTL / LTR Toggle with Persistence
  // ----------------------------------------------------
  const rtlToggleBtn = document.getElementById('rtlToggleBtn');
  const rtlToggleLabel = document.getElementById('rtlToggleLabel');

  const savedDir = localStorage.getItem('kensei_dir') || 'ltr';
  applyDirection(savedDir);

  if (rtlToggleBtn) {
    rtlToggleBtn.addEventListener('click', () => {
      const currentDir = htmlRoot.getAttribute('dir') || 'ltr';
      const newDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
      applyDirection(newDir);
      localStorage.setItem('kensei_dir', newDir);
    });
  }

  function applyDirection(dir) {
    htmlRoot.setAttribute('dir', dir);
    if (rtlToggleLabel) {
      rtlToggleLabel.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
    }
    if (rtlToggleBtn) {
      rtlToggleBtn.setAttribute('title', dir === 'rtl' ? 'Switch to Left-to-Right' : 'Switch to Right-to-Left');
    }
  }

  // ----------------------------------------------------
  // 3. Sticky Navbar & Scroll Progress
  // ----------------------------------------------------
  const navbar = document.querySelector('.kensei-navbar');

  function handleNavScroll() {
    if (!navbar) return;
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // Close mobile collapse on link click
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  const navbarCollapse = document.querySelector('.navbar-collapse');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse) {
          bsCollapse.hide();
        }
      }
    });
  });

  // ----------------------------------------------------
  // 4. Scroll Reveal Animations (Intersection Observer)
  // ----------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    // Immediately reveal elements already inside viewport on load, observe the rest
    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add('revealed');
      } else {
        revealObserver.observe(el);
      }
    });
  } else {
    // Fallback if IntersectionObserver isn't supported
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // ----------------------------------------------------
  // 5. Training Schedule Interactive Filtering
  // ----------------------------------------------------
  const filterButtons = document.querySelectorAll('.filter-btn');
  const scheduleRows = document.querySelectorAll('.schedule-row');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      scheduleRows.forEach(row => {
        const rowDay = row.getAttribute('data-day');
        const rowDiscipline = row.getAttribute('data-discipline');

        if (filterValue === 'all' || rowDay === filterValue || rowDiscipline === filterValue) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });

  // ----------------------------------------------------
  // 6. Free Trial Modal Handler & Form Submissions
  // ----------------------------------------------------
  const trialModalEl = document.getElementById('trialModal');
  const modalProgramSelect = document.getElementById('modalProgramSelect');

  // Open modal preselecting program if clicked from program card or schedule
  window.openTrialModalWithProgram = function(programName) {
    if (modalProgramSelect && programName) {
      for (let i = 0; i < modalProgramSelect.options.length; i++) {
        if (modalProgramSelect.options[i].value.toLowerCase() === programName.toLowerCase()) {
          modalProgramSelect.selectedIndex = i;
          break;
        }
      }
    }
    if (trialModalEl) {
      const modal = bootstrap.Modal.getOrCreateInstance(trialModalEl);
      modal.show();
    }
  };

  // Attach to program CTA buttons
  document.querySelectorAll('[data-trial-program]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const prog = btn.getAttribute('data-trial-program');
      window.openTrialModalWithProgram(prog);
    });
  });

  // Handle Modal Form Submission
  const trialModalForm = document.getElementById('trialModalForm');
  const trialModalAlert = document.getElementById('trialModalAlert');

  if (trialModalForm) {
    trialModalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!trialModalForm.checkValidity()) {
        trialModalForm.classList.add('was-validated');
        return;
      }

      const nameVal = document.getElementById('trialModalName')?.value || 'Warrior';
      const progVal = modalProgramSelect?.value || 'selected discipline';

      if (trialModalAlert) {
        trialModalAlert.innerHTML = `
          <div class="alert alert-success d-flex align-items-center mb-0" role="alert">
            <i class="bi bi-check-circle-fill me-2 fs-5"></i>
            <div>
              <strong>Trial Confirmed!</strong> Welcome, ${escapeHtml(nameVal)}. An orientation briefing for <strong>${escapeHtml(progVal)}</strong> has been sent to your email.
            </div>
          </div>
        `;
        trialModalAlert.classList.remove('d-none');
        trialModalForm.reset();
        trialModalForm.classList.remove('was-validated');

        setTimeout(() => {
          const modalInstance = bootstrap.Modal.getInstance(trialModalEl);
          if (modalInstance) modalInstance.hide();
          trialModalAlert.classList.add('d-none');
          trialModalAlert.innerHTML = '';
        }, 3500);
      }
    });
  }

  // Handle Inline CTA Form Submission
  const inlineTrialForm = document.getElementById('inlineTrialForm');
  const inlineTrialAlert = document.getElementById('inlineTrialAlert');

  if (inlineTrialForm) {
    inlineTrialForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!inlineTrialForm.checkValidity()) {
        inlineTrialForm.classList.add('was-validated');
        return;
      }

      const nameVal = document.getElementById('inlineTrialName')?.value || 'Warrior';

      if (inlineTrialAlert) {
        inlineTrialAlert.innerHTML = `
          <div class="alert alert-success d-flex align-items-center mb-0" role="alert">
            <i class="bi bi-shield-check me-2 fs-5"></i>
            <div>
              <strong>Welcome to the Dojo, ${escapeHtml(nameVal)}!</strong> Your free trial pass is activated. Our head instructor will contact you within 24 hours.
            </div>
          </div>
        `;
        inlineTrialAlert.classList.remove('d-none');
        inlineTrialForm.reset();
        inlineTrialForm.classList.remove('was-validated');

        setTimeout(() => {
          inlineTrialAlert.classList.add('d-none');
          inlineTrialAlert.innerHTML = '';
        }, 4500);
      }
    });
  }

  // Helper escape function
  function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  // ----------------------------------------------------
  // 7. Active Navigation Link Highlighting on Scroll
  // ----------------------------------------------------
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNavLink() {
    const scrollPos = window.scrollY + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else if (link.getAttribute('href')?.startsWith('#')) {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
});
