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

  filterFaq();
})();
