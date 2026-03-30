document.addEventListener('DOMContentLoaded', function() {

  // Debounce utility
  function debounce(fn, delay) {
    var timer;
    return function() {
      clearTimeout(timer);
      timer = setTimeout(fn, delay);
    };
  }

  // ---- Scroll Animations ----
  var fadeEls = document.querySelectorAll('.fade-up');
  var fadeObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  fadeEls.forEach(function(el) { fadeObserver.observe(el); });

  // ---- Navbar Scroll ----
  var nav = document.querySelector('.nav');
  function handleScroll() {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ---- Active Nav Highlighting ----
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-links a');
  var highlightNav = debounce(function() {
    var scrollY = window.scrollY + 100;
    sections.forEach(function(section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(function(link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, 50);
  window.addEventListener('scroll', highlightNav, { passive: true });

  // ---- Mobile Menu ----
  var toggle = document.getElementById('mobileToggle');
  var mobileMenu = document.getElementById('mobileMenu');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', function() {
      toggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        toggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        toggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // ---- Smooth Scrolling ----
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      var target = document.querySelector(href);
      if (target) {
        var navH = nav ? nav.offsetHeight : 80;
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - navH,
          behavior: 'smooth'
        });
      }
    });
  });

  // ---- FAQ Accordion ----
  document.querySelectorAll('.faq-item').forEach(function(item) {
    var btn = item.querySelector('.faq-q');
    if (!btn) return;
    btn.addEventListener('click', function() {
      var isActive = item.classList.contains('active');
      // Close all
      document.querySelectorAll('.faq-item').forEach(function(other) {
        other.classList.remove('active');
        var ans = other.querySelector('.faq-a');
        if (ans) ans.style.maxHeight = '0';
      });
      // Toggle current
      if (!isActive) {
        item.classList.add('active');
        var answer = item.querySelector('.faq-a');
        if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // ---- Gallery Lightbox ----
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImage');
  var galleryItems = document.querySelectorAll('.gallery-item img');
  var currentIndex = 0;

  function openLightbox(i) {
    currentIndex = i;
    lightboxImg.src = galleryItems[i].src;
    lightboxImg.alt = galleryItems[i].alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
  function navLightbox(dir) {
    currentIndex = (currentIndex + dir + galleryItems.length) % galleryItems.length;
    lightboxImg.src = galleryItems[currentIndex].src;
    lightboxImg.alt = galleryItems[currentIndex].alt;
  }

  galleryItems.forEach(function(img, i) {
    img.style.cursor = 'pointer';
    img.addEventListener('click', function() { openLightbox(i); });
  });

  if (lightbox) {
    document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    document.querySelector('.lightbox-prev').addEventListener('click', function() { navLightbox(-1); });
    document.querySelector('.lightbox-next').addEventListener('click', function() { navLightbox(1); });
    lightbox.addEventListener('click', function(e) { if (e.target === lightbox) closeLightbox(); });
  }

  document.addEventListener('keydown', function(e) {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navLightbox(-1);
    if (e.key === 'ArrowRight') navLightbox(1);
  });

  // ---- Toast System ----
  var toastContainer = document.getElementById('toastContainer');
  function showToast(msg, type) {
    type = type || 'success';
    var toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    toast.innerHTML = '<span class="toast-message">' + msg + '</span><button class="toast-close" onclick="this.parentElement.remove()">×</button>';
    toastContainer.appendChild(toast);
    requestAnimationFrame(function() { toast.classList.add('show'); });
    setTimeout(function() {
      toast.classList.remove('show');
      setTimeout(function() { toast.remove(); }, 400);
    }, 4000);
  }
  window.showToast = showToast;

  // ---- Contact Form ----
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var hp = form.querySelector('input[name="website"]');
      if (hp && hp.value) return;

      var data = Object.fromEntries(new FormData(form));
      if (!data.name || data.name.trim().length < 2) { showToast('Please enter your name', 'error'); return; }
      if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) { showToast('Please enter a valid email', 'error'); return; }
      if (!data.phone || data.phone.replace(/\D/g, '').length < 7) { showToast('Please enter a valid phone number', 'error'); return; }

      var btn = form.querySelector('button[type="submit"]');
      var orig = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;

      fetch('/.netlify/functions/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      .then(function(res) { return res.json(); })
      .then(function(result) {
        if (result.success) {
          showToast('Thank you! We\'ll get back to you within 24 hours.', 'success');
          form.reset();
          var success = document.getElementById('formSuccess');
          if (success) {
            form.style.display = 'none';
            success.classList.add('active');
          }
        } else {
          showToast(result.error || 'Something went wrong', 'error');
        }
      })
      .catch(function() {
        showToast('Network error. Please call us at (512) 413-8455', 'error');
      })
      .finally(function() {
        btn.textContent = orig;
        btn.disabled = false;
      });
    });
  }

  // ---- Floating CTA ----
  var floatingCta = document.getElementById('floatingCta');
  var hero = document.querySelector('.hero');
  function handleFloating() {
    if (!floatingCta || !hero) return;
    var heroBottom = hero.offsetTop + hero.offsetHeight;
    floatingCta.classList.toggle('visible', window.scrollY > heroBottom - 200);
  }
  window.addEventListener('scroll', handleFloating, { passive: true });

  // ---- Back to Top ----
  var btt = document.getElementById('backToTop');
  if (btt) {
    window.addEventListener('scroll', function() {
      btt.classList.toggle('visible', window.scrollY > 600);
    }, { passive: true });
    btt.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---- Stats Counter ----
  var statNums = document.querySelectorAll('.hero-stat-num');
  var statsAnimated = false;
  var statsObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting && !statsAnimated) {
        statsAnimated = true;
        animateStats();
        statsObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  var statsRow = document.querySelector('.hero-stats');
  if (statsRow) statsObs.observe(statsRow);

  function animateStats() {
    statNums.forEach(function(el) {
      var target = parseFloat(el.getAttribute('data-target'));
      var suffix = el.getAttribute('data-suffix') || '';
      var start = performance.now();
      var duration = 2000;
      function update(now) {
        var progress = Math.min((now - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var val = target * eased;
        el.textContent = (Number.isInteger(target) ? Math.round(val) : val.toFixed(1)) + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    });
  }

  // ---- Copyright Year ----
  var yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
