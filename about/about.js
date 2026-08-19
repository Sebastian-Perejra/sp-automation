(() => {
  const desktop = window.matchMedia("(min-width: 851px)");

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function initHistory() {
    const section = document.querySelector(".about-history");
    if (!section) return;

    const sticky = section.querySelector(".about-history__sticky");
    const viewport = section.querySelector(".about-history__viewport");
    const track = section.querySelector(".about-history__track");
    const progressFill = section.querySelector(".about-history__progress-fill");
    const cards = [...section.querySelectorAll(".about-history__card")];

    if (!sticky || !viewport || !track || !progressFill || !cards.length) {
      return;
    }

    let maxShift = 0;
    let scrollDistance = 0;
    let holdDistance = 0;
    let ticking = false;

    function reset() {
      section.style.height = "";
      track.style.transform = "";
      progressFill.style.transform = "scaleX(0)";

      cards.forEach(card => {
        card.classList.remove("is-active");
      });
    }

    function activateCard() {
      const viewportRect = viewport.getBoundingClientRect();
      const center = viewportRect.left + viewportRect.width * 0.5;

      let nearest = null;
      let nearestDistance = Infinity;

      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width * 0.5;
        const distance = Math.abs(center - cardCenter);

        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearest = card;
        }
      });

      cards.forEach(card => {
        card.classList.toggle("is-active", card === nearest);
      });
    }

    function measure() {
      if (!desktop.matches) {
        reset();
        return;
      }

      maxShift = Math.max(
        0,
        track.scrollWidth - viewport.clientWidth
      );

      scrollDistance = Math.max(
        maxShift * 1.75,
        window.innerHeight * 1.8
      );

      holdDistance = Math.max(
        300,
        window.innerHeight * 0.38
      );

      section.style.height =
        `${sticky.offsetHeight + scrollDistance + holdDistance}px`;

      update();
    }

    function update() {
      if (!desktop.matches) return;

      const rect = section.getBoundingClientRect();

      const stickyTop =
        parseFloat(getComputedStyle(sticky).top) || 76;

      const travelled = stickyTop - rect.top;

      const progress =
        scrollDistance > 0
          ? clamp(travelled / scrollDistance, 0, 1)
          : 0;

      const translate = maxShift * progress;

      track.style.transform =
        `translate3d(${-translate}px, 0, 0)`;

      progressFill.style.transform =
        `scaleX(${progress})`;

      activateCard();
    }

    function requestUpdate() {
      if (ticking) return;

      ticking = true;

      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    }

    cards.forEach(card => {
      card.addEventListener("pointermove", event => {
        const rect = card.getBoundingClientRect();

        card.style.setProperty(
          "--history-x",
          `${event.clientX - rect.left}px`
        );

        card.style.setProperty(
          "--history-y",
          `${event.clientY - rect.top}px`
        );
      });
    });

    window.addEventListener(
      "scroll",
      requestUpdate,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      measure
    );

    desktop.addEventListener(
      "change",
      measure
    );

    if ("ResizeObserver" in window) {
      const observer = new ResizeObserver(measure);

      observer.observe(viewport);
      observer.observe(track);
    }

    measure();
  }

  function initHero() {
    const visual = document.querySelector(".about-hero__visual");
    if (!visual) return;

    visual.addEventListener("pointermove", event => {
      if (!desktop.matches) return;

      const rect = visual.getBoundingClientRect();

      const x =
        (event.clientX - rect.left) / rect.width - 0.5;

      const y =
        (event.clientY - rect.top) / rect.height - 0.5;

      visual.style.setProperty(
        "--hero-x",
        `${x * 16}px`
      );

      visual.style.setProperty(
        "--hero-y",
        `${y * 12}px`
      );
    });

    visual.addEventListener("pointerleave", () => {
      visual.style.setProperty("--hero-x", "0px");
      visual.style.setProperty("--hero-y", "0px");
    });
  }

  function initExperience() {
    const map = document.querySelector(".about-experience__map");
    if (!map) return;

    const core = map.querySelector(".about-experience__core");
    const nodes = [...map.querySelectorAll(".about-experience__node")];
    const paths = [...map.querySelectorAll(".about-experience__lines path")];

    if (!core || !nodes.length || !paths.length) return;

    nodes.forEach((node, index) => {
      node.addEventListener("pointerenter", () => {
        core.classList.add("is-active");

        nodes.forEach(current => {
          current.classList.toggle(
            "is-active",
            current === node
          );

          current.classList.toggle(
            "is-dimmed",
            current !== node
          );
        });

        paths.forEach((path, pathIndex) => {
          path.classList.toggle(
            "is-active",
            pathIndex === index
          );

          path.classList.toggle(
            "is-dimmed",
            pathIndex !== index
          );
        });
      });
    });

    map.addEventListener("pointerleave", () => {
      core.classList.remove("is-active");

      nodes.forEach(node => {
        node.classList.remove("is-active", "is-dimmed");
      });

      paths.forEach(path => {
        path.classList.remove("is-active", "is-dimmed");
      });
    });
  }

  function initReveals() {
    const groups = [
      {
        selector: ".about-origin__content, .about-origin__map",
        className: "about-reveal"
      },
      {
        selector: ".about-method__head, .about-method__step, .about-method__result",
        className: "about-reveal"
      },
      {
        selector: ".about-experience__head, .about-experience__footer",
        className: "about-reveal"
      },
      {
        selector: ".about-thinking__head, .about-thinking__principle, .about-thinking__closing",
        className: "about-reveal"
      },
      {
        selector: ".about-proof__head, .about-proof__item, .about-proof__bottom",
        className: "about-reveal"
      }
    ];

    const elements = [];

    groups.forEach(group => {
      document
        .querySelectorAll(group.selector)
        .forEach(element => {
          element.classList.add(group.className);
          elements.push(element);
        });
    });

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          const element = entry.target;
          const parent =
            element.parentElement;

          const siblings =
            parent
              ? [...parent.children].filter(
                  sibling =>
                    sibling.classList.contains("about-reveal")
                )
              : [];

          const index =
            Math.max(
              0,
              siblings.indexOf(element)
            );

          element.style.setProperty(
            "--reveal-delay",
            `${Math.min(index * 90, 450)}ms`
          );

          element.classList.add("is-visible");
          observer.unobserve(element);
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -7% 0px"
      }
    );

    elements.forEach(element => {
      observer.observe(element);
    });
  }

  function initMethod() {
    const section = document.querySelector(".about-method");
    if (!section) return;

    const steps =
      [...section.querySelectorAll(".about-method__step")];

    const links =
      [...section.querySelectorAll(".about-method__link")];

    if (!steps.length) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          steps.forEach((step, index) => {
            setTimeout(() => {
              step.classList.add("is-flow-active");

              if (links[index]) {
                links[index].classList.add("is-flow-active");
              }
            }, index * 300);
          });

          observer.disconnect();
        });
      },
      {
        threshold: 0.32
      }
    );

    observer.observe(section);
  }

  function initOrigin() {
    const map = document.querySelector(".about-origin__map");
    if (!map) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          map.classList.add("is-running");
          observer.disconnect();
        });
      },
      {
        threshold: 0.3
      }
    );

    observer.observe(map);
  }

  initHistory();
  initHero();
  initExperience();
  initReveals();
  initMethod();
  initOrigin();
})();
