document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;

  const themeBtn = document.getElementById("themeBtn");
  const themeIcon = themeBtn?.querySelector("i");

  const settingsBtn = document.getElementById("settingsBtn");
  const colorPanel = document.getElementById("colorPanel");

  const cursor = document.querySelector(".custom-cursor");
  const cursorDot = document.querySelector(".cursor-dot");

  const typingText = document.querySelector(".typing-text");

  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("main section[id]");

  const backToTop = document.getElementById("backToTop");

  // =========================
  // THEME
  // =========================

  const savedTheme = localStorage.getItem("theme") || "light";

  const savedAccent = localStorage.getItem("themeColorValue") || "#ff6f91";

  setTheme(savedTheme);
  setAccent(savedAccent);

  // =========================
  // INIT
  // =========================

  startTyping();
  initCursor();
  initReveal();
  initNavigation();

  // =========================
  // THEME TOGGLE
  // =========================

  themeBtn?.addEventListener("click", () => {
    const nextTheme =
      root.getAttribute("data-theme") === "dark" ? "light" : "dark";

    setTheme(nextTheme);

    localStorage.setItem("theme", nextTheme);
  });

  // =========================
  // SETTINGS PANEL
  // =========================

  settingsBtn?.addEventListener("click", (event) => {
    event.stopPropagation();

    colorPanel?.classList.toggle("show");
  });

  document.addEventListener("click", (event) => {
    if (
      !event.target.closest(".color-panel") &&
      !event.target.closest("#settingsBtn")
    ) {
      colorPanel?.classList.remove("show");
    }
  });

  // =========================
  // ACCENT COLORS
  // =========================

  document.querySelectorAll(".color-option").forEach((button) => {
    button.addEventListener("click", () => {
      const color = button.dataset.color;

      setAccent(color);

      localStorage.setItem("themeColorValue", color);
    });
  });

  // =========================
  // BACK TO TOP
  // =========================

  window.addEventListener(
    "scroll",
    () => {
      backToTop?.classList.toggle("show", window.scrollY > 420);
    },
    { passive: true },
  );

  // =========================
  // THEME FUNCTION
  // =========================

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);

    if (themeIcon) {
      themeIcon.className =
        theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
    }
  }

  // =========================
  // ACCENT FUNCTION
  // =========================

  function setAccent(color) {
    root.style.setProperty("--accent", color);
  }

  // =========================
  // TYPING ANIMATION
  // =========================

  function startTyping() {
    if (!typingText) return;

    const words = [
      "Python Backend Developer",
      "Django Learner",
      "API Builder",
      "Problem Solver",
    ];

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const type = () => {
      const current = words[wordIndex];

      typingText.textContent = current.slice(0, charIndex);

      if (!isDeleting && charIndex < current.length) {
        charIndex++;

        setTimeout(type, 95);

        return;
      }

      if (!isDeleting && charIndex === current.length) {
        isDeleting = true;

        setTimeout(type, 1600);

        return;
      }

      if (isDeleting && charIndex > 0) {
        charIndex--;

        setTimeout(type, 45);

        return;
      }

      isDeleting = false;

      wordIndex = (wordIndex + 1) % words.length;

      setTimeout(type, 420);
    };

    type();
  }

  // =========================
  // CUSTOM CURSOR
  // =========================

  function initCursor() {
    if (
      !cursor ||
      !cursorDot ||
      window.matchMedia("(pointer: coarse)").matches
    ) {
      return;
    }

    let mouseX = 0;
    let mouseY = 0;

    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener(
      "mousemove",
      (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;

        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
      },
      { passive: true },
    );

    const animate = () => {
      cursorX += (mouseX - cursorX) * 0.16;

      cursorY += (mouseY - cursorY) * 0.16;

      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;

      requestAnimationFrame(animate);
    };

    animate();

    document.querySelectorAll("a, button, input, textarea").forEach((item) => {
      item.addEventListener("mouseenter", () => {
        cursor.classList.add("hover");
      });

      item.addEventListener("mouseleave", () => {
        cursor.classList.remove("hover");
      });
    });
  }

  // =========================
  // REVEAL ANIMATION
  // =========================

  function initReveal() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");

            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.16,
      },
    );

    document
      .querySelectorAll(".reveal, .project-card, .timeline-item")
      .forEach((item) => observer.observe(item));
  }

  // =========================
  // NAVIGATION
  // =========================

  function initNavigation() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", () => {
        const collapse = document.getElementById("navbarMenu");

        const instance = bootstrap.Collapse.getInstance(collapse);

        if (instance) {
          instance.hide();
        }
      });
    });

    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          navLinks.forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${entry.target.id}`,
            );
          });
        });
      },
      {
        rootMargin: "-45% 0px -48% 0px",

        threshold: 0,
      },
    );

    sections.forEach((section) => {
      navObserver.observe(section);
    });
  }
});
