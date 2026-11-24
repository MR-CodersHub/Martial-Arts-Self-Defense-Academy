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
        if (modalProgramSelect.options[i].value.toLowerCase() === programName.toLowerCase() ||
            modalProgramSelect.options[i].text.toLowerCase().includes(programName.toLowerCase())) {
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

  // Reset modal state whenever it closes so it is always fresh and clean
  if (trialModalEl) {
    trialModalEl.addEventListener('hidden.bs.modal', () => {
      const modalAlert = document.getElementById('trialModalAlert');
      const modalForm = document.getElementById('trialModalForm');
      const modalSubtitle = trialModalEl.querySelector('.modal-body > p.text-muted');

      if (modalAlert) {
        modalAlert.classList.add('d-none');
        modalAlert.innerHTML = '';
      }
      if (modalForm) {
        modalForm.reset();
        modalForm.classList.remove('was-validated');
        modalForm.style.display = '';
      }
      if (modalSubtitle) {
        modalSubtitle.style.display = '';
      }
    });
  }

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

      const nameVal = document.getElementById('trialModalName')?.value?.trim() || 'Warrior';
      const emailVal = document.getElementById('trialModalEmail')?.value?.trim() || 'your email';
      const phoneVal = document.getElementById('trialModalPhone')?.value?.trim() || 'your phone';
      const selectedOption = modalProgramSelect?.options[modalProgramSelect.selectedIndex];
      const progVal = selectedOption ? selectedOption.text : (modalProgramSelect?.value || 'Selected Discipline');

      const modalSubtitle = trialModalEl ? trialModalEl.querySelector('.modal-body > p.text-muted') : null;

      // Hide form fields so no blank second form lingers
      trialModalForm.style.display = 'none';
      if (modalSubtitle) {
        modalSubtitle.style.display = 'none';
      }

      if (trialModalAlert) {
        trialModalAlert.innerHTML = `
          <div class="text-center py-4 px-2">
            <div class="d-inline-flex align-items-center justify-content-center mb-3" style="width: 72px; height: 72px; border-radius: 50%; background: rgba(198, 40, 53, 0.12); border: 2px solid var(--accent-combat-red); color: var(--accent-combat-red);">
              <i class="bi bi-shield-check" style="font-size: 2.4rem;"></i>
            </div>
            <h3 class="font-heading fs-3 text-uppercase mb-2" style="letter-spacing: 0.05em; color: var(--text-ivory);">Reservation Confirmed!</h3>
            <p class="text-muted small mb-4">
              Welcome to KENSEI Academy, <strong class="text-combat-red">${escapeHtml(nameVal)}</strong>! Your spot has been secured.
            </p>

            <div class="p-3 mb-4 text-start rounded" style="background: rgba(255, 255, 255, 0.04); border: 1px solid var(--border-slate);">
              <div class="d-flex justify-content-between align-items-center py-1 border-bottom" style="border-color: var(--border-slate) !important;">
                <span class="text-muted small">Discipline / Session:</span>
                <span class="fw-bold small text-combat-red">${escapeHtml(progVal)}</span>
              </div>
              <div class="d-flex justify-content-between align-items-center py-1 border-bottom" style="border-color: var(--border-slate) !important;">
                <span class="text-muted small">Guest Pass Status:</span>
                <span class="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 small">100% Free &bull; Zero Obligation</span>
              </div>
              <div class="d-flex justify-content-between align-items-center py-1">
                <span class="text-muted small">Orientation Dossier:</span>
                <span class="text-light small text-truncate ms-2" style="max-width: 190px;">${escapeHtml(emailVal)}</span>
              </div>
            </div>

            <p class="small text-muted mb-4">
              <i class="bi bi-info-circle me-1 text-combat-red"></i> A senior coordinator will reach out to <strong>${escapeHtml(phoneVal)}</strong> within 24 hours to confirm gear sizing and locker prep.
            </p>

            <button type="button" class="btn-kensei btn-kensei-primary w-100" data-bs-dismiss="modal">
              <span>Return to Dojo</span>
              <i class="bi bi-arrow-right"></i>
            </button>
          </div>
        `;
        trialModalAlert.classList.remove('d-none');
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

      const nameVal = document.getElementById('inlineTrialName')?.value?.trim() || 'Warrior';
      const emailVal = document.getElementById('inlineTrialEmail')?.value?.trim() || 'your email';
      const progVal = document.getElementById('inlineTrialProgram')?.value || 'General Inquiry';

      inlineTrialForm.style.display = 'none';

      if (inlineTrialAlert) {
        inlineTrialAlert.innerHTML = `
          <div class="text-center py-4 px-2">
            <div class="d-inline-flex align-items-center justify-content-center mb-3" style="width: 64px; height: 64px; border-radius: 50%; background: rgba(198, 40, 53, 0.12); border: 2px solid var(--accent-combat-red); color: var(--accent-combat-red);">
              <i class="bi bi-shield-check" style="font-size: 2.2rem;"></i>
            </div>
            <h4 class="font-heading fs-3 text-uppercase mb-2" style="color: var(--text-ivory);">Welcome to the Tatami, ${escapeHtml(nameVal)}!</h4>
            <p class="text-muted small mb-3">Your complimentary pass for <strong>${escapeHtml(progVal)}</strong> has been activated. A full briefing has been sent to <strong>${escapeHtml(emailVal)}</strong>.</p>
            <p class="small text-muted mb-0"><i class="bi bi-check-circle-fill text-combat-red me-1"></i> Our master coordinator will contact you within 24 hours.</p>
          </div>
        `;
        inlineTrialAlert.classList.remove('d-none');
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
  // 7. Navigation Anchor Smooth Scrolling (Active page preserved)
  // ----------------------------------------------------
  // Preserve Home / Home 2 active indicator; do not shift active state on scroll
  document.querySelectorAll('a.nav-link[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });


  // ----------------------------------------------------
  // 8. Interactive World Map & Region Switcher
  // ----------------------------------------------------
    const regionData = {
    japan: {
      origin: "JAPAN • OKINAWA & HONSHU",
      title: "KARATE • 空手道",
      desc: "Punching, kicking, blocking and disciplined linear striking techniques. Developed across centuries in Japan, focusing on structural biomechanics, bone alignment, and mental poise.",
      philosophy: "Karate ni Sente Nashi (No First Attack)",
      signature: "Gyaku-Zuki • Oi-Zuki • Mae-Geri",
      program: "Karate"
    },
    korea: {
      origin: "KOREA • SEOUL & KUKKIWON",
      title: "TAEKWONDO • 태권도",
      desc: "Famous for powerful kicks, speed and flexibility. Developed in Korea, Taekwondo emphasizes dynamic Olympic agility, pelvic rotational velocity, and high aerial striking.",
      philosophy: "The Way of the Foot and the Fist",
      signature: "540° Spinning Hook • Tornado Kick",
      program: "Taekwondo"
    },
    china: {
      origin: "CHINA • SHAOLIN & WUDANG",
      title: "KUNG FU • 中国武术",
      desc: "Traditional fighting systems with varied forms, fluid movements, animal imitations, and weapon techniques. Cultivates internal energy (Qi), joint conditioning, and flow.",
      philosophy: "Harmonizing Internal Qi & External Form",
      signature: "Five Animal Forms • Chain Punching",
      program: "Kung Fu"
    },
    thailand: {
      origin: "THAILAND • SIAM BATTLEFIELD HERITAGE",
      title: "MUAY THAI • มวยไทย",
      desc: "Uses fists, elbows, knees and shins. Known as 'The Art of Eight Limbs', Muay Thai is Thailand's revered combat discipline combining devastating low kicks with powerful clinch control.",
      philosophy: "Unbroken Spirit in the Face of Adversity",
      signature: "Low Calf Kick • Thai Plum Clinch",
      program: "Kickboxing"
    },
    brazil: {
      origin: "BRAZIL • RIO DE JANEIRO",
      title: "BRAZILIAN JIU-JITSU • ARTE SUAVE",
      desc: "Ground fighting, grappling and submission techniques. Pioneered in Brazil to allow a smaller defender to control and submit larger opponents using leverage and joint locks.",
      philosophy: "Leverage & Technique Over Brute Force",
      signature: "Rear Naked Choke • Triangle • Armbar",
      program: "Brazilian Jiu-Jitsu"
    },
    india: {
      origin: "INDIA • KERALA HERITAGE",
      title: "KALARIPAYATTU • കളരിപ്പയറ്റ്",
      desc: "Traditional Indian martial art involving strikes, fluid animal movements, extreme flexibility and weapon techniques. Regarded as one of the oldest fighting systems in human history.",
      philosophy: "Complete Integration of Body, Mind & Healing",
      signature: "Meypayattu • Urumi & Staff Defense",
      program: "Kalaripayattu"
    },
    boxing: {
      origin: "INTERNATIONAL • MODERN SPORT",
      title: "BOXING • THE SWEET SCIENCE",
      desc: "Punching techniques, footwork, defence and movement. Refined as a global athletic combat sport requiring supreme timing, head slips, geometric angles, and ring conditioning.",
      philosophy: "Precision, Distance & Ring Composure",
      signature: "Slip Counter • Lead Hook • Pivot Footwork",
      program: "Boxing"
    }
  };

  const mapPins = document.querySelectorAll('.map-pin-btn');
  const mapOriginBadge = document.getElementById('mapOriginBadge');
  const mapDisciplineTitle = document.getElementById('mapDisciplineTitle');
  const mapDisciplineDesc = document.getElementById('mapDisciplineDesc');
  const mapPhilosophy = document.getElementById('mapPhilosophy');
  const mapSignature = document.getElementById('mapSignature');
  const cycleRegionBtn = document.getElementById('cycleRegionBtn');

  const regionKeys = Object.keys(regionData);
  let currentRegionIndex = 0;

  function setMapRegion(key) {
    const data = regionData[key];
    if (!data) return;

    mapPins.forEach(p => {
      if (p.getAttribute('data-region') === key) {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });

    if (mapOriginBadge) mapOriginBadge.innerHTML = `<i class="bi bi-geo-alt-fill"></i> ${data.origin}`;
    if (mapDisciplineTitle) mapDisciplineTitle.textContent = data.title;
    if (mapDisciplineDesc) mapDisciplineDesc.textContent = data.desc;
    if (mapPhilosophy) mapPhilosophy.textContent = data.philosophy;
    if (mapSignature) mapSignature.textContent = data.signature;

    currentRegionIndex = regionKeys.indexOf(key);
  }

  mapPins.forEach(pin => {
    pin.addEventListener('click', () => {
      const regionKey = pin.getAttribute('data-region');
      setMapRegion(regionKey);
    });
    pin.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const regionKey = pin.getAttribute('data-region');
        setMapRegion(regionKey);
      }
    });
  });

  if (cycleRegionBtn) {
    cycleRegionBtn.addEventListener('click', () => {
      currentRegionIndex = (currentRegionIndex + 1) % regionKeys.length;
      setMapRegion(regionKeys[currentRegionIndex]);
    });
  }

  // ----------------------------------------------------
  // 9. Interactive Goal Selector Handler
  // ----------------------------------------------------
  const goalData = {
    fitness: {
      badge: "PEAK ATHLETIC BLUEPRINT",
      title: "THE HIGH-METABOLIC CONDITIONING TRACK",
      desc: "Combines high-cadence Dutch Kickboxing pad circuits with Boxing footwork and core bodyweight conditioning. Designed to burn up to 800 calories per session while forging lean kinetic power and joint durability.",
      frequency: "3 Sessions / Week",
      programs: "Kickboxing • Boxing Conditioning",
      milestone: "+35% Stamina & Fluid 4-Punch Combos in 60 Days"
    },
    defense: {
      badge: "CIVILIAN SAFETY BLUEPRINT",
      title: "THE REALITY-BASED DEFENSE TRACK",
      desc: "Focuses on situational awareness, pre-assault indicators, boundary defense, and reflexive escapes from chokes, bear hugs, and ground pins without needing brute physical strength.",
      frequency: "2 – 3 Sessions / Week",
      programs: "Practical Self-Defense • Brazilian Jiu-Jitsu",
      milestone: "Instinctive Escape Reactions & Spatial Calm"
    },
    confidence: {
      badge: "MENTAL COMPOSURE BLUEPRINT",
      title: "THE INTERNAL DISCIPLINE & FOCUS TRACK",
      desc: "Traditional budō Karate kata combined with seated breathwork (mokuso). Develops upright posture, unshakeable eye contact, and emotional poise that commands respect in boardrooms and everyday life.",
      frequency: "2 Sessions / Week",
      programs: "Traditional Karate • BJJ Fundamentals",
      milestone: "Postural Command & Unflappable Presence"
    },
    competition: {
      badge: "CHAMPIONSHIP SQUAD BLUEPRINT",
      title: "THE TOURNAMENT COMBAT TRACK",
      desc: "For athletes seeking the podium. High-intensity tactical sparring, video review, weight-class strategy, and master-level coaching for state, national, and international championships.",
      frequency: "4 – 5 Sessions / Week",
      programs: "Elite Kumite Sparring • Advanced BJJ No-Gi",
      milestone: "Tournament Division Ready & Elite Conditioning"
    }
  };

  const goalCardBtns = document.querySelectorAll('.goal-card-btn');
  const goalOutputBadge = document.getElementById('goalOutputBadge');
  const goalOutputTitle = document.getElementById('goalOutputTitle');
  const goalOutputDesc = document.getElementById('goalOutputDesc');
  const goalOutputFrequency = document.getElementById('goalOutputFrequency');
  const goalOutputPrograms = document.getElementById('goalOutputPrograms');
  const goalOutputMilestone = document.getElementById('goalOutputMilestone');

  goalCardBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const goalKey = btn.getAttribute('data-goal');
      const data = goalData[goalKey];
      if (!data) return;

      goalCardBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (goalOutputBadge) goalOutputBadge.textContent = data.badge;
      if (goalOutputTitle) goalOutputTitle.textContent = data.title;
      if (goalOutputDesc) goalOutputDesc.textContent = data.desc;
      if (goalOutputFrequency) goalOutputFrequency.textContent = data.frequency;
      if (goalOutputPrograms) goalOutputPrograms.textContent = data.programs;
      if (goalOutputMilestone) goalOutputMilestone.textContent = data.milestone;
    });

    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });
});
