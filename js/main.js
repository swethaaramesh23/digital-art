/* ═══════════════════════════════════════════════════════
   STACKLY — Premium Digital Art Marketplace
   Main Application JavaScript
   ═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────
     1. PREMIUM LOADING SCREEN
     ───────────────────────────────────────── */
  const pLoader = document.getElementById('premium-loader');
  if (pLoader) {
    document.body.classList.add('preloading');
    const textEl = document.getElementById('loader-text');
    const progressBar = document.getElementById('loader-progress');
    const lCanvas = document.getElementById('loader-canvas');

    // Canvas particles
    if (lCanvas) {
      const ctx = lCanvas.getContext('2d');
      let particles = [];
      const resize = () => { lCanvas.width = window.innerWidth; lCanvas.height = window.innerHeight; };
      window.addEventListener('resize', resize);
      resize();
      for (let i = 0; i < 50; i++) {
        const hue = [270, 185, 40][Math.floor(Math.random() * 3)]; // violet, cyan, amber hues
        particles.push({
          x: Math.random() * lCanvas.width, y: Math.random() * lCanvas.height,
          s: Math.random() * 2 + 0.5,
          vx: (Math.random() - 0.5) * 0.8, vy: (Math.random() - 0.5) * 0.8,
          op: Math.random() * 0.4 + 0.1, hue
        });
      }
      const draw = () => {
        ctx.clearRect(0, 0, lCanvas.width, lCanvas.height);
        particles.forEach(p => {
          ctx.fillStyle = `hsla(${p.hue}, 80%, 65%, ${p.op})`;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2); ctx.fill();
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > lCanvas.width) p.vx *= -1;
          if (p.y < 0 || p.y > lCanvas.height) p.vy *= -1;
        });
        if (!pLoader.classList.contains('hide')) requestAnimationFrame(draw);
      };
      draw();
    }

    // Typing effect
    const phrases = ['Curating Digital Masterpieces...', 'Connecting Creators & Collectors...', 'Loading Your Experience...', 'Almost Ready...'];
    let phraseIdx = 0, charIdx = 0;
    const typeText = () => {
      if (!textEl) return;
      const current = phrases[phraseIdx];
      if (!current) return;
      textEl.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx < current.length) {
        setTimeout(typeText, 35);
      } else {
        phraseIdx++;
        if (phraseIdx < phrases.length) { charIdx = 0; setTimeout(typeText, 400); }
      }
    };
    setTimeout(typeText, 200);

    // Progress
    let prog = 0;
    const progInterval = setInterval(() => {
      prog += Math.random() * 5 + 2;
      if (prog >= 100) { prog = 100; clearInterval(progInterval); }
      if (progressBar) progressBar.style.width = prog + '%';
    }, 60);

    // Transition out
    setTimeout(() => {
      clearInterval(progInterval);
      if (progressBar) progressBar.style.width = '100%';
      pLoader.classList.add('zoom-out');
      setTimeout(() => {
        pLoader.classList.add('hide');
        document.body.classList.remove('preloading');
        document.body.classList.add('site-revealed');
        setTimeout(() => pLoader.remove(), 500);
      }, 600);
    }, 2800);
  }


  /* ─────────────────────────────────────────
     2. CUSTOM CURSOR
     ───────────────────────────────────────── */
  if (window.innerWidth > 1024 && window.matchMedia('(hover: hover)').matches) {
    const dot = document.createElement('div'); dot.classList.add('cursor-dot');
    const outline = document.createElement('div'); outline.classList.add('cursor-outline');
    document.body.appendChild(dot); document.body.appendChild(outline);

    let mx = 0, my = 0, ox = 0, oy = 0;
    window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

    const animateCursor = () => {
      ox += (mx - ox) * 0.15;
      oy += (my - oy) * 0.15;
      dot.style.left = mx + 'px'; dot.style.top = my + 'px';
      outline.style.left = ox + 'px'; outline.style.top = oy + 'px';
      requestAnimationFrame(animateCursor);
    };
    animateCursor();

    // Hover states
    const addHover = () => {
      document.querySelectorAll('a, button, .btn, input, select, textarea, .card, .tilt-card, .category-pill, .filter-option, label, .clickable, .faq-question, .toggle-switch').forEach(el => {
        el.addEventListener('mouseenter', () => outline.classList.add('hovering'));
        el.addEventListener('mouseleave', () => outline.classList.remove('hovering'));
      });
    };
    addHover();
    // Re-register after dynamic content loads
    const cursorObserver = new MutationObserver(() => addHover());
    cursorObserver.observe(document.body, { childList: true, subtree: true });
  }


  /* ─────────────────────────────────────────
     3. STICKY HEADER
     ───────────────────────────────────────── */
  const header = document.querySelector('header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }


  /* ─────────────────────────────────────────
     4. MOBILE NAVIGATION
     ───────────────────────────────────────── */
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }


  /* ─────────────────────────────────────────
     5. INTERSECTION OBSERVER — SCROLL REVEAL
     ───────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger');
  if (revealEls.length) {
    const revealObs = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => revealObs.observe(el));
  }


  /* ─────────────────────────────────────────
     6. ANIMATED COUNTERS
     ───────────────────────────────────────── */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const counterObs = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-count'), 10);
          const suffix = el.getAttribute('data-suffix') || '';
          const prefix = el.getAttribute('data-prefix') || '';
          const duration = 2000;
          const start = performance.now();

          const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
            const current = Math.floor(eased * target);
            el.textContent = prefix + current.toLocaleString() + suffix;
            if (progress < 1) requestAnimationFrame(tick);
            else el.textContent = prefix + target.toLocaleString() + suffix;
          };
          requestAnimationFrame(tick);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.3 });
    counters.forEach(c => counterObs.observe(c));
  }


  /* ─────────────────────────────────────────
     7. 3D TILT CARDS
     ───────────────────────────────────────── */
  if (window.innerWidth > 768) {
    document.querySelectorAll('.tilt-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const tiltX = ((y - cy) / cy) * -8;
        const tiltY = ((x - cx) / cx) * 8;
        card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02,1.02,1.02)`;
        card.style.transition = 'none';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale3d(1,1,1)';
        card.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
      });
    });
  }


  /* ─────────────────────────────────────────
     8. MAGNETIC BUTTONS
     ───────────────────────────────────────── */
  if (window.innerWidth > 768) {
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.25;
        btn.style.transform = `translate(${x}px, ${y}px)`;
        btn.style.transition = 'none';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0,0)';
        btn.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
      });
    });
  }


  /* ─────────────────────────────────────────
     9. RIPPLE EFFECT
     ───────────────────────────────────────── */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      this.appendChild(ripple);
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      setTimeout(() => ripple.remove(), 600);
    });
  });


  /* ─────────────────────────────────────────
     10. SMOOTH PAGE TRANSITIONS
     ───────────────────────────────────────── */
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('javascript') || href.startsWith('http') || href.startsWith('mailto')) return;
    if (link.getAttribute('target') === '_blank') return;
    link.addEventListener('click', function (e) {
      e.preventDefault();
      document.body.classList.add('page-transitioning');
      setTimeout(() => { window.location.href = href; }, 400);
    });
  });


  /* ─────────────────────────────────────────
     11. PARALLAX EFFECTS
     ───────────────────────────────────────── */
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (parallaxEls.length && window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      parallaxEls.forEach(el => {
        const speed = parseFloat(el.getAttribute('data-parallax')) || 0.3;
        el.style.transform = `translateY(${scrollY * speed}px)`;
      });
    }, { passive: true });
  }


  /* ─────────────────────────────────────────
     12. CATEGORY PILLS
     ───────────────────────────────────────── */
  document.querySelectorAll('.category-scroll').forEach(scroll => {
    scroll.querySelectorAll('.category-pill').forEach(pill => {
      pill.addEventListener('click', function () {
        scroll.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
        this.classList.add('active');
      });
    });
  });


  /* ─────────────────────────────────────────
     13. FAQ ACCORDION
     ───────────────────────────────────────── */
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      // Close all siblings
      item.parentElement.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });


  /* ─────────────────────────────────────────
     14. TOGGLE SWITCHES
     ───────────────────────────────────────── */
  document.querySelectorAll('.toggle-switch').forEach(toggle => {
    toggle.addEventListener('click', () => toggle.classList.toggle('active'));
  });


  /* ─────────────────────────────────────────
     15. DASHBOARD TABS
     ───────────────────────────────────────── */
  document.querySelectorAll('.dash-tabs').forEach(tabContainer => {
    tabContainer.querySelectorAll('.dash-tab').forEach(tab => {
      tab.addEventListener('click', function () {
        const targetId = this.getAttribute('data-tab');
        // Deactivate all tabs
        tabContainer.querySelectorAll('.dash-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        // Switch content
        const parent = tabContainer.closest('.dashboard-main') || tabContainer.parentElement;
        parent.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        const target = parent.querySelector('#' + targetId);
        if (target) target.classList.add('active');
      });
    });
  });


  /* ─────────────────────────────────────────
     16. ROLE-BASED LOGIN
     ───────────────────────────────────────── */
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    // Role tabs
    const roleTabs = loginForm.querySelectorAll('.role-tab');
    let selectedRole = 'collector';
    roleTabs.forEach(tab => {
      tab.addEventListener('click', function () {
        roleTabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        selectedRole = this.getAttribute('data-role');
      });
    });

    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const email = this.querySelector('input[type="email"]').value.trim();
      const pass = this.querySelector('input[type="password"]').value.trim();

      if (!email || !pass) {
        showToast('Please fill in all fields', 'error');
        return;
      }

      // Store role & redirect
      localStorage.setItem('stackly_user', JSON.stringify({ email, role: selectedRole }));

      const destinations = {
        collector: 'dashboard-user.html',
        artist: 'dashboard-artist.html',
        admin: 'dashboard-admin.html'
      };

      showToast('Login successful! Redirecting...', 'success');
      document.body.classList.add('page-transitioning');
      setTimeout(() => { window.location.href = destinations[selectedRole] || 'dashboard-user.html'; }, 600);
    });
  }


  /* ─────────────────────────────────────────
     17. SIGNUP FORM
     ───────────────────────────────────────── */
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    const roleTabs = signupForm.querySelectorAll('.role-tab');
    let signupRole = 'collector';
    roleTabs.forEach(tab => {
      tab.addEventListener('click', function () {
        roleTabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        signupRole = this.getAttribute('data-role');
      });
    });

    signupForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = this.querySelector('input[name="name"]');
      const email = this.querySelector('input[type="email"]');
      const pass = this.querySelector('input[type="password"]');

      if (!name?.value.trim() || !email?.value.trim() || !pass?.value.trim()) {
        showToast('Please fill in all fields', 'error');
        return;
      }
      if (pass.value.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
      }

      localStorage.setItem('stackly_user', JSON.stringify({ name: name.value, email: email.value, role: signupRole }));
      showToast('Account created! Redirecting...', 'success');
      document.body.classList.add('page-transitioning');
      setTimeout(() => { window.location.href = 'login.html'; }, 600);
    });
  }


  /* ─────────────────────────────────────────
     18. CONTACT FORM
     ───────────────────────────────────────── */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const inputs = this.querySelectorAll('input, textarea, select');
      let valid = true;
      inputs.forEach(inp => {
        if (inp.hasAttribute('required') && !inp.value.trim()) {
          valid = false;
          inp.style.borderColor = 'var(--error)';
          setTimeout(() => inp.style.borderColor = '', 2000);
        }
      });
      if (!valid) { showToast('Please fill in all required fields', 'error'); return; }

      showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
      this.reset();
    });
  }


  /* ─────────────────────────────────────────
     19. NEWSLETTER FORMS
     ───────────────────────────────────────── */
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const input = this.querySelector('input[type="email"]');
      if (!input || !input.value.trim() || !input.value.includes('@')) {
        showToast('Please enter a valid email', 'error');
        return;
      }
      showToast('Subscribed successfully!', 'success');
      input.value = '';
    });
  });


  /* ─────────────────────────────────────────
     20. DASHBOARD SIDEBAR (MOBILE)
     ───────────────────────────────────────── */
  const sidebarToggle = document.querySelector('.mobile-sidebar-toggle');
  const sidebar = document.querySelector('.dashboard-sidebar');
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });
  }


  /* ─────────────────────────────────────────
     21. MARKETPLACE SEARCH & FILTER
     ───────────────────────────────────────── */
  const marketSearch = document.getElementById('marketplace-search');
  const artCards = document.querySelectorAll('.art-card-item');
  if (marketSearch && artCards.length) {
    marketSearch.addEventListener('input', function () {
      const q = this.value.toLowerCase();
      artCards.forEach(card => {
        const title = card.getAttribute('data-title') || card.textContent.toLowerCase();
        card.style.display = title.includes(q) ? '' : 'none';
      });
    });
  }

  // Filter checkboxes
  document.querySelectorAll('.filter-option input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', () => {
      const activeFilters = [];
      document.querySelectorAll('.filter-option input[type="checkbox"]:checked').forEach(checked => {
        activeFilters.push(checked.value.toLowerCase());
      });

      if (artCards.length) {
        artCards.forEach(card => {
          if (activeFilters.length === 0) {
            card.style.display = '';
          } else {
            const category = (card.getAttribute('data-category') || '').toLowerCase();
            card.style.display = activeFilters.includes(category) ? '' : 'none';
          }
        });
      }
    });
  });


  /* ─────────────────────────────────────────
     22. HERO PARTICLE CANVAS
     ───────────────────────────────────────── */
  const heroCanvas = document.getElementById('particles-canvas');
  if (heroCanvas) {
    const hCtx = heroCanvas.getContext('2d');
    let hParticles = [];
    const resizeHero = () => {
      heroCanvas.width = heroCanvas.offsetWidth;
      heroCanvas.height = heroCanvas.offsetHeight;
    };
    window.addEventListener('resize', resizeHero);
    resizeHero();

    for (let i = 0; i < 60; i++) {
      hParticles.push({
        x: Math.random() * heroCanvas.width,
        y: Math.random() * heroCanvas.height,
        s: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        op: Math.random() * 0.5 + 0.1,
        hue: [270, 185, 40][Math.floor(Math.random() * 3)]
      });
    }

    const drawHero = () => {
      hCtx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);

      // Draw connections
      for (let i = 0; i < hParticles.length; i++) {
        for (let j = i + 1; j < hParticles.length; j++) {
          const dx = hParticles[i].x - hParticles[j].x;
          const dy = hParticles[i].y - hParticles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            hCtx.strokeStyle = `rgba(124, 58, 237, ${0.08 * (1 - dist / 120)})`;
            hCtx.lineWidth = 0.5;
            hCtx.beginPath();
            hCtx.moveTo(hParticles[i].x, hParticles[i].y);
            hCtx.lineTo(hParticles[j].x, hParticles[j].y);
            hCtx.stroke();
          }
        }
      }

      hParticles.forEach(p => {
        hCtx.fillStyle = `hsla(${p.hue}, 70%, 60%, ${p.op})`;
        hCtx.beginPath(); hCtx.arc(p.x, p.y, p.s, 0, Math.PI * 2); hCtx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > heroCanvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > heroCanvas.height) p.vy *= -1;
      });
      requestAnimationFrame(drawHero);
    };
    drawHero();
  }


  /* ─────────────────────────────────────────
     23. CAROUSEL AUTO-SCROLL (INFINITE)
     ───────────────────────────────────────── */
  document.querySelectorAll('.carousel-track').forEach(track => {
    // Clone children for seamless loop
    const children = [...track.children];
    children.forEach(child => {
      const clone = child.cloneNode(true);
      track.appendChild(clone);
    });
  });


  /* ─────────────────────────────────────────
     24. TOAST NOTIFICATION SYSTEM
     ───────────────────────────────────────── */
  // Already used above, define global
  window.showToast = function (message, type = 'info') {
    const container = document.getElementById('toast-container') || createToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icons = { success: '✓', error: '✕', info: 'ℹ', warning: '⚠' };
    toast.innerHTML = `<span class="toast-icon">${icons[type] || icons.info}</span><span>${message}</span>`;

    // Inline styles for toast
    Object.assign(toast.style, {
      display: 'flex', alignItems: 'center', gap: '0.75rem',
      padding: '1rem 1.5rem', borderRadius: '12px',
      background: type === 'success' ? 'rgba(16,185,129,0.15)' :
        type === 'error' ? 'rgba(239,68,68,0.15)' :
          type === 'warning' ? 'rgba(245,158,11,0.15)' : 'rgba(59,130,246,0.15)',
      border: `1px solid ${type === 'success' ? 'rgba(16,185,129,0.3)' :
        type === 'error' ? 'rgba(239,68,68,0.3)' :
          type === 'warning' ? 'rgba(245,158,11,0.3)' : 'rgba(59,130,246,0.3)'}`,
      color: '#F8FAFC', fontFamily: "'Poppins', sans-serif", fontSize: '0.9rem',
      backdropFilter: 'blur(12px)', boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
      transform: 'translateX(120%)', transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
      marginBottom: '0.75rem'
    });

    container.appendChild(toast);
    requestAnimationFrame(() => { toast.style.transform = 'translateX(0)'; });

    setTimeout(() => {
      toast.style.transform = 'translateX(120%)';
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  };

  function createToastContainer() {
    const c = document.createElement('div');
    c.id = 'toast-container';
    Object.assign(c.style, {
      position: 'fixed', top: '1.5rem', right: '1.5rem',
      zIndex: '100000', display: 'flex', flexDirection: 'column',
      maxWidth: '400px', width: '100%', pointerEvents: 'none'
    });
    document.body.appendChild(c);
    return c;
  }


  /* ─────────────────────────────────────────
     25. IMAGE ZOOM ON HOVER
     ───────────────────────────────────────── */
  document.querySelectorAll('.img-zoom-container').forEach(container => {
    const img = container.querySelector('img');
    if (!img) return;
    container.addEventListener('mousemove', e => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      img.style.transformOrigin = `${x}% ${y}%`;
      img.style.transform = 'scale(1.3)';
    });
    container.addEventListener('mouseleave', () => {
      img.style.transform = 'scale(1)';
      img.style.transformOrigin = 'center center';
    });
  });


  /* ─────────────────────────────────────────
     26. ARTIST SEARCH
     ───────────────────────────────────────── */
  const artistSearch = document.getElementById('artist-search');
  const artistCards = document.querySelectorAll('.artist-card-item');
  if (artistSearch && artistCards.length) {
    artistSearch.addEventListener('input', function () {
      const q = this.value.toLowerCase();
      artistCards.forEach(card => {
        const name = (card.getAttribute('data-name') || card.textContent).toLowerCase();
        card.style.display = name.includes(q) ? '' : 'none';
      });
    });
  }


  /* ─────────────────────────────────────────
     27. FOLLOW BUTTONS
     ───────────────────────────────────────── */
  document.querySelectorAll('.follow-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const isFollowing = this.classList.toggle('following');
      this.textContent = isFollowing ? 'Following' : 'Follow';
      if (isFollowing) {
        this.style.background = 'rgba(124,58,237,0.15)';
        this.style.borderColor = 'var(--accent-violet)';
        this.style.color = 'var(--accent-violet-light)';
      } else {
        this.style.background = '';
        this.style.borderColor = '';
        this.style.color = '';
      }
    });
  });


  /* ─────────────────────────────────────────
     28. HEART / LIKE BUTTONS
     ───────────────────────────────────────── */
  document.querySelectorAll('.card-likes, .like-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const icon = this.querySelector('i');
      if (icon) {
        icon.classList.toggle('uil-heart');
        icon.classList.toggle('uil-heart-alt');
      }
      this.classList.toggle('liked');
      const count = this.querySelector('.like-count');
      if (count) {
        let val = parseInt(count.textContent, 10);
        count.textContent = this.classList.contains('liked') ? val + 1 : val - 1;
      }
    });
  });


  /* ─────────────────────────────────────────
     29. DASHBOARD — LOGOUT
     ───────────────────────────────────────── */
  document.querySelectorAll('.logout-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      localStorage.removeItem('stackly_user');
      showToast('Logged out successfully', 'info');
      document.body.classList.add('page-transitioning');
      setTimeout(() => { window.location.href = 'login.html'; }, 500);
    });
  });


  /* ─────────────────────────────────────────
     30. ACTIVE NAV LINK HIGHLIGHT
     ───────────────────────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });


  /* ─────────────────────────────────────────
     31. GLOW BORDER ON MOUSE MOVE
     ───────────────────────────────────────── */
  document.querySelectorAll('.glow-card').forEach(card => {
    card.addEventListener('mousemove', function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.style.setProperty('--glow-x', x + 'px');
      this.style.setProperty('--glow-y', y + 'px');
    });
  });

});
