/* ============================================
   Cathey's Lawn Care - Main JavaScript
   Premium Dark Luxury Website
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  // ---- Utility: Debounce ----
  function debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  // ---- Scroll Animations (Intersection Observer) ----
  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll(".fade-up").forEach((el, i) => {
    // Stagger siblings within the same parent
    const siblings = Array.from(el.parentElement.querySelectorAll(".fade-up"));
    const index = siblings.indexOf(el);
    if (index > 0) {
      el.style.transitionDelay = `${index * 0.1}s`;
    }
    fadeObserver.observe(el);
  });

  // ---- Navbar Scroll Effect ----
  const navbar = document.querySelector(".navbar");
  let lastScroll = 0;

  const handleNavScroll = () => {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
    lastScroll = scrollY;
  };

  window.addEventListener("scroll", handleNavScroll, { passive: true });
  handleNavScroll();

  // ---- Active Nav Link Highlighting ----
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");

  const highlightNav = () => {
    const scrollY = window.scrollY + 100;
    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          }
        });
      }
    });
  };

  window.addEventListener("scroll", debounce(highlightNav, 50), { passive: true });

  // ---- Mobile Menu ----
  const hamburger = document.querySelector(".nav-hamburger");
  const mobileMenu = document.querySelector(".nav-mobile-overlay");
  const mobileLinks = document.querySelectorAll(".nav-mobile-overlay a");

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      const isActive = hamburger.classList.toggle("active");
      mobileMenu.classList.toggle("active");
      document.body.style.overflow = isActive ? "hidden" : "";
    });

    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        mobileMenu.classList.remove("active");
        document.body.style.overflow = "";
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mobileMenu.classList.contains("active")) {
        hamburger.classList.remove("active");
        mobileMenu.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  }

  // ---- Smooth Scrolling ----
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const href = anchor.getAttribute("href");
      if (href === "#") return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const navHeight = navbar ? navbar.offsetHeight : 80;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  });

  // ---- FAQ Accordion ----
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const btn = item.querySelector(".faq-question");
    if (!btn) return;

    btn.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      // Close all others
      faqItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove("active");
          const otherAnswer = other.querySelector(".faq-answer");
          if (otherAnswer) otherAnswer.style.maxHeight = "0";
        }
      });

      // Toggle current
      item.classList.toggle("active");
      const answer = item.querySelector(".faq-answer");
      if (answer) {
        answer.style.maxHeight = isActive ? "0" : answer.scrollHeight + "px";
      }
    });
  });

  // ---- Gallery Lightbox ----
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImage");
  const lightboxClose = document.querySelector(".lightbox-close");
  const lightboxPrev = document.querySelector(".lightbox-prev, .lightbox-nav.lightbox-prev");
  const lightboxNext = document.querySelector(".lightbox-next, .lightbox-nav.lightbox-next");
  const galleryItems = document.querySelectorAll(".gallery-item img");
  let currentGalleryIndex = 0;

  function openLightbox(index) {
    if (!lightbox || !lightboxImg) return;
    currentGalleryIndex = index;
    lightboxImg.src = galleryItems[index].src;
    lightboxImg.alt = galleryItems[index].alt;
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
  }

  function navigateLightbox(direction) {
    currentGalleryIndex = (currentGalleryIndex + direction + galleryItems.length) % galleryItems.length;
    lightboxImg.src = galleryItems[currentGalleryIndex].src;
    lightboxImg.alt = galleryItems[currentGalleryIndex].alt;
  }

  galleryItems.forEach((img, i) => {
    img.addEventListener("click", () => openLightbox(i));
  });

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener("click", () => navigateLightbox(-1));
  if (lightboxNext) lightboxNext.addEventListener("click", () => navigateLightbox(1));

  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (!lightbox || !lightbox.classList.contains("active")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") navigateLightbox(-1);
    if (e.key === "ArrowRight") navigateLightbox(1);
  });

  // ---- Toast Notification System ----
  const toastContainer = document.getElementById("toastContainer");

  function showToast(message, type = "success") {
    if (!toastContainer) return;
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="toast-message">${message}</span>
      <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
    `;
    toastContainer.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => toast.classList.add("show"));

    // Auto dismiss
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }

  // Make globally accessible
  window.showToast = showToast;

  // ---- Contact Form Handling ----
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Honeypot check
      const honeypot = contactForm.querySelector('input[name="website"]');
      if (honeypot && honeypot.value) return;

      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData.entries());

      // Client-side validation
      if (!data.name || data.name.trim().length < 2) {
        showToast("Please enter your full name", "error");
        return;
      }

      if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        showToast("Please enter a valid email address", "error");
        return;
      }

      if (!data.phone || data.phone.replace(/\D/g, "").length < 7) {
        showToast("Please enter a valid phone number", "error");
        return;
      }

      // Show loading state
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = "Sending...";
      submitBtn.disabled = true;

      try {
        const response = await fetch("/.netlify/functions/submit-lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          showToast("Thank you! We'll get back to you within 24 hours.", "success");
          contactForm.reset();

          // Show success state
          const successMsg = document.getElementById("formSuccess");
          if (successMsg) {
            successMsg.classList.add("active");
            setTimeout(() => successMsg.classList.remove("active"), 5000);
          }
        } else {
          showToast(result.error || "Something went wrong. Please try again.", "error");
        }
      } catch (err) {
        showToast("Network error. Please call us at (512) 413-8455.", "error");
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // ---- Floating CTA Button ----
  const floatingCta = document.querySelector(".floating-cta");
  const heroSection = document.getElementById("home");

  if (floatingCta && heroSection) {
    const handleFloatingCta = () => {
      const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
      if (window.scrollY > heroBottom - 200) {
        floatingCta.classList.add("visible");
      } else {
        floatingCta.classList.remove("visible");
      }
    };

    window.addEventListener("scroll", handleFloatingCta, { passive: true });
    handleFloatingCta();
  }

  // ---- Stats Counter Animation ----
  const statNumbers = document.querySelectorAll(".stat-number");
  let statsAnimated = false;

  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !statsAnimated) {
          statsAnimated = true;
          animateStats();
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  const statsRow = document.querySelector(".hero-stats");
  if (statsRow) statsObserver.observe(statsRow);

  function animateStats() {
    statNumbers.forEach((stat) => {
      const target = parseFloat(stat.getAttribute("data-target"));
      const suffix = stat.getAttribute("data-suffix") || "";
      const duration = 2000;
      const startTime = performance.now();

      function updateCount(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = target * eased;

        if (Number.isInteger(target)) {
          stat.textContent = Math.round(current).toLocaleString() + suffix;
        } else {
          stat.textContent = current.toFixed(1) + suffix;
        }

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        }
      }

      requestAnimationFrame(updateCount);
    });
  }

  // ---- Copyright Year ----
  const yearEl = document.getElementById("currentYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- Video Lazy Load ----
  const videoSection = document.querySelector(".video-section video");
  if (videoSection) {
    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const source = videoSection.querySelector("source");
            if (source && source.dataset.src) {
              source.src = source.dataset.src;
              videoSection.load();
            }
            videoObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    videoObserver.observe(videoSection);
  }

  // ---- Subtle Parallax on Hero Orbs (Desktop Only) ----
  if (window.innerWidth > 1024) {
    const orbs = document.querySelectorAll(".gradient-orb");
    let mouseX = 0;
    let mouseY = 0;
    let orbX = 0;
    let orbY = 0;

    document.addEventListener("mousemove", (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 30;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 30;
    }, { passive: true });

    function animateOrbs() {
      orbX += (mouseX - orbX) * 0.05;
      orbY += (mouseY - orbY) * 0.05;

      orbs.forEach((orb, i) => {
        const factor = (i + 1) * 0.5;
        orb.style.transform = `translate(${orbX * factor}px, ${orbY * factor}px)`;
      });

      requestAnimationFrame(animateOrbs);
    }

    animateOrbs();
  }

  // ---- Back to Top Button ----
  const backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 600) {
        backToTop.classList.add("visible");
      } else {
        backToTop.classList.remove("visible");
      }
    }, { passive: true });

    backToTop.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ---- Form Input Float Labels ----
  document.querySelectorAll(".form-group input, .form-group textarea, .form-group select").forEach((input) => {
    // Check initial state
    if (input.value) input.classList.add("has-value");

    input.addEventListener("focus", () => input.classList.add("focused"));
    input.addEventListener("blur", () => {
      input.classList.remove("focused");
      if (input.value) {
        input.classList.add("has-value");
      } else {
        input.classList.remove("has-value");
      }
    });
  });
});
