(() => {
  const backgrounds = [
    "/themes/noir-lime/faq/assets/faq.webp",
    "/themes/noir-lime/faq/assets/faq2.webp",
    "/themes/noir-lime/faq/assets/faq3.webp"
  ];

  const layerA = document.createElement("div");
  const layerB = document.createElement("div");

  layerA.className = "faq-bg is-active";
  layerB.className = "faq-bg";

  document.body.prepend(layerB);
  document.body.prepend(layerA);

  let currentLayer = layerA;
  let nextLayer = layerB;
  let currentIndex = 0;

  currentLayer.style.backgroundImage =
    `url("${backgrounds[0]}")`;

  backgrounds.slice(1).forEach(src => {
    const image = new Image();
    image.src = src;
  });

  function changeBackground() {
    currentIndex =
      (currentIndex + 1) % backgrounds.length;

    nextLayer.style.backgroundImage =
      `url("${backgrounds[currentIndex]}")`;

    nextLayer.classList.add("is-active");
    currentLayer.classList.remove("is-active");

    const oldLayer = currentLayer;
    currentLayer = nextLayer;
    nextLayer = oldLayer;
  }

  setInterval(changeBackground, 14000);

  const searchInput =
    document.getElementById("faq-search");

  const faqItems = Array.from(
    document.querySelectorAll("#faq-list details")
  );

  const faqCount =
    document.getElementById("faq-count");

  const noResults =
    document.getElementById("no-results");

  const categoryButtons = Array.from(
    document.querySelectorAll(".faq-category")
  );

  const openAllButton =
    document.getElementById("open-all");

  const closeAllButton =
    document.getElementById("close-all");

  let activeCategory = "all";

  function updateCount(
    visibleCount = faqItems.length
  ) {
    faqCount.textContent =
      `Показано: ${visibleCount} із ${faqItems.length}`;
  }

  function filterFaq() {
    const query =
      searchInput.value.trim().toLowerCase();

    let visibleCount = 0;

    faqItems.forEach((item, index) => {
      const text =
        item.textContent.toLowerCase();

      const category =
        item.dataset.category;

      const matchesSearch =
        !query || text.includes(query);

      const matchesCategory =
        activeCategory === "all" ||
        category === activeCategory;

      const shouldShow =
        matchesSearch &&
        matchesCategory;

      if (shouldShow) {
        visibleCount++;

        if (item.style.display === "none") {
          item.style.display = "";

          item.classList.remove(
            "is-filtering-out"
          );

          item.classList.remove(
            "is-filtering-in"
          );

          requestAnimationFrame(() => {
            item.style.animationDelay =
              `${Math.min(index * 18, 150)}ms`;

            item.classList.add(
              "is-filtering-in"
            );
          });
        }
      } else {
        if (
          item.style.display !== "none"
        ) {
          item.open = false;

          item.classList.remove(
            "is-filtering-in"
          );

          item.classList.add(
            "is-filtering-out"
          );

          window.setTimeout(() => {
            if (
              item.classList.contains(
                "is-filtering-out"
              )
            ) {
              item.style.display =
                "none";

              item.classList.remove(
                "is-filtering-out"
              );
            }
          }, 240);
        }
      }
    });

    noResults.style.display =
      visibleCount === 0
        ? "block"
        : "none";

    updateCount(visibleCount);
  }

  categoryButtons.forEach(button => {
    button.addEventListener(
      "click",
      () => {
        activeCategory =
          button.dataset.filter;

        categoryButtons.forEach(
          item => {
            item.classList.toggle(
              "active",
              item === button
            );
          }
        );

        filterFaq();
      }
    );
  });

  searchInput.addEventListener(
    "input",
    filterFaq
  );

  faqItems.forEach(item => {
    item.addEventListener(
      "pointermove",
      event => {
        const rect =
          item.getBoundingClientRect();

        const x =
          event.clientX - rect.left;

        const y =
          event.clientY - rect.top;

        item.style.setProperty(
          "--spot-x",
          `${x}px`
        );

        item.style.setProperty(
          "--spot-y",
          `${y}px`
        );
      }
    );

    item.addEventListener(
      "pointerenter",
      () => {
        item.classList.add(
          "is-hovered"
        );
      }
    );

    item.addEventListener(
      "pointerleave",
      () => {
        item.classList.remove(
          "is-hovered"
        );
      }
    );

    item.addEventListener(
      "toggle",
      () => {
        item.classList.toggle(
          "is-open",
          item.open
        );
    
        const answer =
          item.querySelector(":scope > p");
    
        if (!answer) return;
    
        if (item.open) {
          answer.style.maxHeight =
            `${answer.scrollHeight}px`;
        } else {
          answer.style.maxHeight = "0px";
        }
      }
    );
  });

  openAllButton.addEventListener(
  "click",
  () => {
    faqItems.forEach(item => {
      if (item.style.display !== "none") {
        item.open = true;

        const answer =
          item.querySelector(":scope > p");

        if (answer) {
          answer.style.maxHeight =
            `${answer.scrollHeight}px`;
        }
      }
    });
  }
);

  closeAllButton.addEventListener(
  "click",
  () => {
    faqItems.forEach(item => {
      item.open = false;

      const answer =
        item.querySelector(":scope > p");

      if (answer) {
        answer.style.maxHeight = "0px";
      }
    });
  }
);

  const hero =
    document.querySelector(".hero");

  if (hero) {
    hero.addEventListener(
      "pointermove",
      event => {
        const rect =
          hero.getBoundingClientRect();

        const x =
          event.clientX - rect.left;

        const y =
          event.clientY - rect.top;

        hero.style.setProperty(
          "--hero-x",
          `${x}px`
        );

        hero.style.setProperty(
          "--hero-y",
          `${y}px`
        );

        const orbitX =
          (x / rect.width - 0.5) *
          28;

        const orbitY =
          (y / rect.height - 0.5) *
          28;

        hero.style.setProperty(
          "--orbit-x",
          `${orbitX}px`
        );

        hero.style.setProperty(
          "--orbit-y",
          `${orbitY}px`
        );
      }
    );
  }
  const faqContactOpen =
  document.getElementById("faq-contact-open");

const faqContactClose =
  document.getElementById("faq-contact-close");

const faqContactOverlay =
  document.getElementById("faq-contact-overlay");

const faqContactModal =
  document.getElementById("faq-contact-modal");

function openFaqContactModal() {
  faqContactOverlay.classList.add("is-open");
  faqContactModal.classList.add("is-open");

  faqContactOverlay.setAttribute(
    "aria-hidden",
    "false"
  );

  faqContactModal.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.classList.add(
    "faq-modal-open"
  );

  window.setTimeout(() => {
    document
      .getElementById("faq-contact-name")
      ?.focus();
  }, 180);
}

function closeFaqContactModal() {
  faqContactOverlay.classList.remove("is-open");
  faqContactModal.classList.remove("is-open");

  faqContactOverlay.setAttribute(
    "aria-hidden",
    "true"
  );

  faqContactModal.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.classList.remove(
    "faq-modal-open"
  );
}

faqContactOpen?.addEventListener(
  "click",
  openFaqContactModal
);

faqContactClose?.addEventListener(
  "click",
  closeFaqContactModal
);

faqContactOverlay?.addEventListener(
  "click",
  closeFaqContactModal
);

document.addEventListener(
  "keydown",
  event => {
    if (
      event.key === "Escape" &&
      faqContactModal?.classList.contains(
        "is-open"
      )
    ) {
      closeFaqContactModal();
    }
  }
);

  const faqContactForm =
  document.getElementById("faq-contact-form");

const faqContactError =
  document.getElementById("faq-contact-error");

const faqContactSubmit =
  faqContactForm?.querySelector(
    ".faq-contact-submit"
  );

const TELEGRAM_WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbwQ4rbjx6uIXv9PJ-EpbriFkhMTWVT2urzz0Tgv6sPRuwKRboFjlT3-D2bGAcjL2vs/exec";

if (
  faqContactForm &&
  faqContactError &&
  faqContactSubmit
) {
  emailjs.init("sUAoOmiqx4fKn8TVo");

  faqContactForm.addEventListener(
    "submit",
    async event => {
      event.preventDefault();

      const now = Date.now();

      const lastSend =
        Number(
          localStorage.getItem(
            "contactLastSend"
          ) || 0
        );

      if (now - lastSend < 60000) {
        const seconds =
          Math.ceil(
            (
              60000 -
              (now - lastSend)
            ) / 1000
          );

        faqContactError.textContent =
          `Повторне повідомлення можна надіслати через ${seconds} сек.`;

        return;
      }

      const turnstileToken =
        document.querySelector(
          '#faq-contact-form [name="cf-turnstile-response"]'
        )?.value || "";

      if (!turnstileToken) {
        faqContactError.textContent =
          "Підтвердіть, що ви не робот.";

        return;
      }

      const telegramData = {
        user_name:
          faqContactForm
            .elements["user_name"]
            .value
            .trim(),

        user_email:
          faqContactForm
            .elements["user_email"]
            .value
            .trim(),

        message:
          faqContactForm
            .elements["message"]
            .value
            .trim(),

        turnstileToken:
          turnstileToken
      };

      faqContactError.textContent = "";

      faqContactSubmit.disabled = true;
      faqContactSubmit.textContent =
        "Надсилання...";

      try {
        await emailjs.sendForm(
          "service_hckw1kr",
          "template_qz6v45s",
          faqContactForm
        );

        fetch(
          TELEGRAM_WEB_APP_URL,
          {
            method: "POST",
            mode: "no-cors",

            headers: {
              "Content-Type":
                "text/plain;charset=utf-8"
            },

            body:
              JSON.stringify(
                telegramData
              )
          }
        ).catch(error => {
          console.error(
            "Telegram notification error:",
            error
          );
        });

        localStorage.setItem(
          "contactLastSend",
          String(Date.now())
        );

        alert(
          "Повідомлення успішно надіслано!"
        );

        faqContactForm.reset();

        if (window.turnstile) {
          window.turnstile.reset();
        }

        closeFaqContactModal();

      } catch (error) {
        console.error(
          "EmailJS error:",
          error
        );

        faqContactError.textContent =
          "Помилка надсилання. Спробуйте ще раз.";

      } finally {
        faqContactSubmit.disabled =
          false;

        faqContactSubmit.textContent =
          "Надіслати";
      }
    }
  );
}

  const faqBackgrounds =
  document.querySelectorAll(".faq-bg");

const faqParallaxEnabled =
  window.matchMedia(
    "(pointer: fine)"
  ).matches &&
  !window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

if (faqParallaxEnabled) {
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  window.addEventListener(
    "pointermove",
    event => {
      const x =
        event.clientX /
        window.innerWidth -
        0.5;

      const y =
        event.clientY /
        window.innerHeight -
        0.5;

      targetX = x * -22;
      targetY = y * -16;
    }
  );

  function animateFaqBackground() {
    currentX +=
      (targetX - currentX) * 0.055;

    currentY +=
      (targetY - currentY) * 0.055;

    faqBackgrounds.forEach(
      background => {
        background.style.setProperty(
          "--faq-bg-x",
          `${currentX}px`
        );

        background.style.setProperty(
          "--faq-bg-y",
          `${currentY}px`
        );
      }
    );

    requestAnimationFrame(
      animateFaqBackground
    );
  }

  animateFaqBackground();
}

  const faqViewList =
  document.getElementById("faq-view-list");

const faqViewGrid =
  document.getElementById("faq-view-grid");

const FAQ_VIEW_KEY =
  "faq-view-mode";

const faqListElement =
  document.getElementById("faq-list");

const originalFaqItems =
  Array.from(
    faqListElement.querySelectorAll(
      ":scope > details"
    )
  );

const faqGroupNames = {
  start: "Початок роботи",
  price: "Вартість",
  tech: "Технології",
  integration: "Інтеграції",
  web: "Web / Mobile",
  security: "Безпека",
  handoff: "Передача рішення",
  support: "Підтримка",
  other: "Інше"
};

function buildFaqGrid() {
  faqListElement.innerHTML = "";

  Object.entries(
    faqGroupNames
  ).forEach(
    ([category, title]) => {
      const items =
        originalFaqItems.filter(
          item =>
            item.dataset.category ===
            category
        );

      if (!items.length) return;

      const section =
        document.createElement(
          "section"
        );

      section.className =
        "faq-grid-section";

      section.dataset.category =
        category;

      const heading =
        document.createElement("div");

      heading.className =
        "faq-grid-section-heading";

      const headingTitle =
        document.createElement("h2");

      headingTitle.textContent =
        title;

      const headingCount =
        document.createElement("span");

      headingCount.textContent =
        items.length;

      heading.append(
        headingTitle,
        headingCount
      );

      const content =
        document.createElement("div");

      content.className =
        "faq-grid-section-content";

      items.forEach(item => {
        content.appendChild(item);
      });

      section.append(
        heading,
        content
      );

      faqListElement.appendChild(
        section
      );
    }
  );

  updateFaqGridSections();
}

function restoreFaqList() {
  faqListElement.innerHTML = "";

  originalFaqItems.forEach(
    item => {
      faqListElement.appendChild(
        item
      );
    }
  );
}

function updateFaqGridSections() {
  if (
    !document.body.classList.contains(
      "faq-grid-mode"
    )
  ) {
    return;
  }

  document
    .querySelectorAll(
      ".faq-grid-section"
    )
    .forEach(section => {
      const items =
        section.querySelectorAll(
          "details"
        );

      const visibleItems =
        Array.from(items).filter(
          item =>
            item.style.display !==
            "none"
        );

      section.style.display =
        visibleItems.length
          ? ""
          : "none";

      const count =
        section.querySelector(
          ".faq-grid-section-heading span"
        );

      if (count) {
        count.textContent =
          visibleItems.length;
      }
    });
}

function setFaqView(mode) {
  const isGrid =
    mode === "grid";

  if (isGrid) {
    document.body.classList.add(
      "faq-grid-mode"
    );

    buildFaqGrid();
  } else {
    document.body.classList.remove(
      "faq-grid-mode"
    );

    restoreFaqList();
  }

  faqViewList?.classList.toggle(
    "active",
    !isGrid
  );

  faqViewGrid?.classList.toggle(
    "active",
    isGrid
  );

  localStorage.setItem(
    FAQ_VIEW_KEY,
    isGrid ? "grid" : "list"
  );
}

faqViewList?.addEventListener(
  "click",
  () => {
    setFaqView("list");
    filterFaq();
  }
);

faqViewGrid?.addEventListener(
  "click",
  () => {
    setFaqView("grid");
    filterFaq();

    window.setTimeout(
      updateFaqGridSections,
      50
    );
  }
);

faqSearch?.addEventListener(
  "input",
  () => {
    window.setTimeout(
      updateFaqGridSections,
      50
    );
  }
);

categoryButtons.forEach(
  button => {
    button.addEventListener(
      "click",
      () => {
        window.setTimeout(
          updateFaqGridSections,
          50
        );
      }
    );
  }
);

const savedFaqView =
  localStorage.getItem(
    FAQ_VIEW_KEY
  );

if (savedFaqView === "grid") {
  setFaqView("grid");
} else {
  setFaqView("list");
}
  filterFaq();
})();
