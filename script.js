const root = document.documentElement;
const themeToggle = document.getElementById("theme-toggle");
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-featured");
const liveCountElements = document.querySelectorAll("[data-live-count]");

const prefersLight = window.matchMedia("(prefers-color-scheme: light)");
const savedTheme = localStorage.getItem("theme");

const setTheme = (mode) => {
  if (mode === "light") {
    root.setAttribute("data-theme", "light");
    themeToggle.textContent = "Light";
  } else {
    root.removeAttribute("data-theme");
    themeToggle.textContent = "Dark";
  }
  localStorage.setItem("theme", mode);
};

setTheme(savedTheme || (prefersLight.matches ? "light" : "dark"));

themeToggle.addEventListener("click", () => {
  const isLight = root.getAttribute("data-theme") === "light";
  setTheme(isLight ? "dark" : "light");
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    projectCards.forEach((card) => {
      if (filter === "all") {
        card.style.display = "flex";
        return;
      }
      const categories = card.dataset.category.split(" ");
      card.style.display = categories.includes(filter) ? "flex" : "none";
    });
  });
});

const animateLiveCount = (el) => {
  const target = Number(el.dataset.liveCount || 0);
  const suffix = el.dataset.suffix || "";
  if (!Number.isFinite(target) || target <= 0) {
    el.textContent = `${target}${suffix}`;
    return;
  }

  const durationMs = 1400;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / durationMs, 1);
    const current = Math.floor(progress * target);
    el.textContent = `${current}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
};

liveCountElements.forEach((el) => {
  animateLiveCount(el);
});

const animatedElements = document.querySelectorAll(
  ".glass, .project-card, [data-animate]"
);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("show", entry.isIntersecting);
    });
  },
  {
    threshold: 0.2,
  }
);

animatedElements.forEach((el) => observer.observe(el));

const testimonialItems = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalOverlay = document.querySelector("[data-overlay]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

const toggleModal = (open) => {
  if (!modalContainer) return;
  modalContainer.classList.toggle("open", open);
  modalContainer.setAttribute("aria-hidden", open ? "false" : "true");
};

testimonialItems.forEach((item) => {
  item.addEventListener("click", () => {
    const title = item.querySelector("[data-testimonials-title]")?.textContent;
    const text = item.querySelector("[data-testimonials-text]")?.innerHTML;
    const avatar = item.querySelector("[data-testimonials-avatar]");

    if (modalTitle && title) modalTitle.textContent = title;
    if (modalText && text) modalText.innerHTML = text;
    if (modalImg && avatar) {
      modalImg.src = avatar.src;
      modalImg.alt = avatar.alt;
    }

    toggleModal(true);
  });
});

[modalOverlay, modalCloseBtn].forEach((el) =>
  el?.addEventListener("click", () => toggleModal(false))
);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modalContainer?.classList.contains("open")) {
    toggleModal(false);
  }
});

const form = document.querySelector(".contact-form");

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    console.table(data);
    form.reset();
    form.insertAdjacentHTML(
      "beforeend",
      `<p class="form-success">Thanks! I'll reach out soon.</p>`
    );
    setTimeout(() => {
      const success = form.querySelector(".form-success");
      if (success) success.remove();
    }, 3000);
  });
}

