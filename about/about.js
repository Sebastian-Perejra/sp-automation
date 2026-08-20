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

      updateTarget();
    }

    let targetProgress = 0;
let currentProgress = 0;
let animationFrame = null;

function updateTarget() {
  if (!desktop.matches) return;

  const rect =
    section.getBoundingClientRect();

  const stickyTop =
    parseFloat(
      getComputedStyle(sticky).top
    ) || 76;

  const travelled =
    stickyTop - rect.top;

  targetProgress =
    scrollDistance > 0
      ? clamp(
          travelled / scrollDistance,
          0,
          1
        )
      : 0;

  startSmoothMotion();
}

function startSmoothMotion() {
  if (animationFrame) return;

  function animate() {
    const difference =
      targetProgress -
      currentProgress;

    currentProgress +=
      difference * 0.095;

    if (
      Math.abs(difference) <
      0.00015
    ) {
      currentProgress =
        targetProgress;
    }

    const translate =
      maxShift *
      currentProgress;

    track.style.transform =
      `translate3d(${
        -translate
      }px, 0, 0)`;

    progressFill.style.transform =
      `scaleX(${
        currentProgress
      })`;

    activateCard();

    if (
      Math.abs(
        targetProgress -
        currentProgress
      ) > 0.00015
    ) {
      animationFrame =
        requestAnimationFrame(
          animate
        );
    } else {
      animationFrame = null;
    }
  }

  animationFrame =
    requestAnimationFrame(
      animate
    );
}

    function requestUpdate() {
      if (ticking) return;
    
      ticking = true;
    
      requestAnimationFrame(() => {
        updateTarget();
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

  function initPhotoBreaks() {
  const photos =
    document.querySelectorAll(
      ".about-photo-break"
    );

  if (!photos.length) return;

  const observer =
    new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add(
            "is-photo-visible"
          );

          observer.unobserve(
            entry.target
          );
        });
      },
      {
        threshold: 0.2,
        rootMargin:
          "0px 0px -8% 0px"
      }
    );

  photos.forEach(photo => {
    observer.observe(photo);
  });
}

function initFinalSimplifier() {
  const canvas =
    document.querySelector(
      ".about-final-cta__simplify"
    );

  const section =
    document.querySelector(
      ".about-final-cta"
    );

  if (!canvas || !section) return;

  const ctx =
    canvas.getContext("2d");

  const reducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let currentProgress = 0;
  let animationFrame = null;

  const random =
    (min, max) =>
      min +
      Math.random() *
      (max - min);

  const threads =
    Array.from(
      { length: 46 },
      () => ({
        x: random(0.02, 0.48),
        y: random(0.08, 0.92),
        c1x: random(0.2, 0.52),
        c1y: random(-0.08, 1.08),
        c2x: random(0.45, 0.68),
        c2y: random(0.18, 0.82),
        alpha: random(0.12, 0.48),
        width: random(0.35, 1.25),
        hue:
          Math.random() > 0.82
            ? "pink"
            : Math.random() > 0.88
              ? "blue"
              : "green"
      })
    );

  const particles =
    Array.from(
      { length: 95 },
      () => ({
        x: random(0.02, 0.6),
        y: random(0.06, 0.94),
        size: random(0.7, 2.5),
        alpha: random(0.16, 0.76),
        hue:
          Math.random() > 0.82
            ? "pink"
            : "green"
      })
    );

  function ease(value) {
    return (
      1 -
      Math.pow(
        1 - value,
        3
      )
    );
  }

  function mix(a, b, amount) {
    return (
      a +
      (b - a) *
      amount
    );
  }

  function resize() {
    const rect =
      canvas.getBoundingClientRect();

    dpr =
      Math.min(
        window.devicePixelRatio || 1,
        2
      );

    width =
      rect.width;

    height =
      rect.height;

    canvas.width =
      Math.round(
        width * dpr
      );

    canvas.height =
      Math.round(
        height * dpr
      );

    ctx.setTransform(
      dpr,
      0,
      0,
      dpr,
      0,
      0
    );

    draw(
      currentProgress
    );
  }

  function draw(progress) {
    currentProgress =
      progress;

    ctx.clearRect(
      0,
      0,
      width,
      height
    );

    const t =
      ease(progress);

    const dotX =
      width * 0.83;

    const dotY =
      height * 0.5;

    const finalRadius =
      Math.min(
        64,
        height * 0.18
      );

    threads.forEach(
      thread => {
        const startX =
          mix(
            thread.x * width,
            dotX - finalRadius * 0.35,
            t
          );

        const startY =
          mix(
            thread.y * height,
            dotY,
            t
          );

        const control1X =
          mix(
            thread.c1x * width,
            dotX - 150,
            t
          );

        const control1Y =
          mix(
            thread.c1y * height,
            dotY,
            t
          );

        const control2X =
          mix(
            thread.c2x * width,
            dotX - 70,
            t
          );

        const control2Y =
          mix(
            thread.c2y * height,
            dotY,
            t
          );

        let color;

        if (
          thread.hue ===
          "pink"
        ) {
          color =
            `rgba(255,82,174,${
              thread.alpha *
              (1 - progress)
            })`;
        } else if (
          thread.hue ===
          "blue"
        ) {
          color =
            `rgba(93,157,255,${
              thread.alpha *
              (1 - progress)
            })`;
        } else {
          color =
            `rgba(166,255,72,${
              thread.alpha *
              (1 - progress)
            })`;
        }

        ctx.beginPath();

        ctx.moveTo(
          startX,
          startY
        );

        ctx.bezierCurveTo(
          control1X,
          control1Y,
          control2X,
          control2Y,
          dotX,
          dotY
        );

        ctx.strokeStyle =
          color;

        ctx.lineWidth =
          thread.width;

        ctx.stroke();
      }
    );

    particles.forEach(
      particle => {
        const x =
          mix(
            particle.x *
              width,
            dotX,
            t
          );

        const y =
          mix(
            particle.y *
              height,
            dotY,
            t
          );

        const alpha =
          particle.alpha *
          Math.max(
            0,
            1 - progress
          );

        ctx.beginPath();

        ctx.arc(
          x,
          y,
          particle.size,
          0,
          Math.PI * 2
        );

        ctx.fillStyle =
          particle.hue ===
          "pink"
            ? `rgba(255,82,174,${alpha})`
            : `rgba(166,255,72,${alpha})`;

        ctx.fill();
      }
    );

    const dotProgress =
      ease(
        Math.max(
          0,
          Math.min(
            1,
            (
              progress -
              0.18
            ) /
              0.82
          )
        )
      );

    const radius =
      mix(
        10,
        finalRadius,
        dotProgress
      );

    const halo =
      ctx.createRadialGradient(
        dotX,
        dotY,
        radius * 0.3,
        dotX,
        dotY,
        radius * 2.2
      );

    halo.addColorStop(
      0,
      "rgba(210,255,103,0.45)"
    );

    halo.addColorStop(
      0.35,
      "rgba(166,255,72,0.18)"
    );

    halo.addColorStop(
      1,
      "rgba(166,255,72,0)"
    );

    ctx.beginPath();

    ctx.arc(
      dotX,
      dotY,
      radius * 2.2,
      0,
      Math.PI * 2
    );

    ctx.fillStyle =
      halo;

    ctx.fill();

    const sphere =
      ctx.createRadialGradient(
        dotX - radius * 0.3,
        dotY - radius * 0.32,
        radius * 0.08,
        dotX,
        dotY,
        radius
      );

    sphere.addColorStop(
      0,
      "#f4ffad"
    );

    sphere.addColorStop(
      0.38,
      "#d5ff62"
    );

    sphere.addColorStop(
      1,
      "#a6ff48"
    );

    ctx.beginPath();

    ctx.arc(
      dotX,
      dotY,
      radius,
      0,
      Math.PI * 2
    );

    ctx.fillStyle =
      sphere;

    ctx.fill();

    ctx.strokeStyle =
      "rgba(235,255,191,0.55)";

    ctx.lineWidth = 1;

    ctx.stroke();
  }

  function play() {
    if (
      animationFrame
    ) {
      cancelAnimationFrame(
        animationFrame
      );
    }

    const start =
      performance.now();

    const duration =
      5200;

    function frame(now) {
      const progress =
        Math.min(
          1,
          (
            now -
            start
          ) /
            duration
        );

      draw(progress);

      if (
        progress < 1
      ) {
        animationFrame =
          requestAnimationFrame(
            frame
          );
      } else {
        animationFrame =
          null;
      }
    }

    animationFrame =
      requestAnimationFrame(
        frame
      );
  }

  resize();

  window.addEventListener(
    "resize",
    resize
  );

  if (
    reducedMotion
  ) {
    draw(1);
    return;
  }

  const observer =
    new IntersectionObserver(
      entries => {
        entries.forEach(
          entry => {
            if (
              !entry.isIntersecting
            ) {
              return;
            }

            play();

            observer.unobserve(
              section
            );
          }
        );
      },
      {
        threshold: 0.35
      }
    );

  observer.observe(
    section
  );
}
  
  initHistory();
  initHero();
  initExperience();
  initReveals();
  initMethod();
  initOrigin();
  initPhotoBreaks();
  initFinalSimplifier();
})();
