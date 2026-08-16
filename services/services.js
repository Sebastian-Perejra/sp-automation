(() => {
  const images = [
    "/services/assets/scheme.webp",
    "/services/assets/scheme2.webp",
    "/services/assets/scheme3.webp",
    "/services/assets/scheme4.webp"
  ];

  const preloadImage = src => {
    return new Promise(resolve => {
      const img = new Image();

      img.onload = async () => {
        if (img.decode) {
          try {
            await img.decode();
          } catch (error) {
          }
        }

        resolve();
      };

      img.onerror = resolve;
      img.src = src;

      if (img.complete) {
        resolve();
      }
    });
  };

  images.forEach(src => {
    preloadImage(src);
  });

  const bgA = document.createElement("div");
  const bgB = document.createElement("div");

  bgA.className = "services-bg is-active";
  bgB.className = "services-bg";

  bgA.style.backgroundImage =
    `url("${images[0]}")`;

  bgB.style.backgroundImage =
    `url("${images[1]}")`;

  document.body.prepend(bgB);
  document.body.prepend(bgA);

  let currentIndex = 0;
  let activeBg = bgA;
  let hiddenBg = bgB;

  const HOLD_TIME = 15000;
  const FADE_TIME = 4800;

  const changeBackground = async () => {
    const nextIndex =
      (currentIndex + 1) %
      images.length;

    await preloadImage(
      images[nextIndex]
    );

    hiddenBg.style.backgroundImage =
      `url("${images[nextIndex]}")`;

    hiddenBg.classList.remove(
      "is-active"
    );

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        hiddenBg.classList.add(
          "is-active"
        );

        activeBg.classList.remove(
          "is-active"
        );

        const previousBg =
          activeBg;

        activeBg =
          hiddenBg;

        hiddenBg =
          previousBg;

        currentIndex =
          nextIndex;

        window.setTimeout(
          changeBackground,
          HOLD_TIME + FADE_TIME
        );
      });
    });
  };

  window.setTimeout(
    changeBackground,
    HOLD_TIME
  );

  let targetX = 0;
  let targetY = 0;

  let currentX = 0;
  let currentY = 0;

  let backgroundFrame = null;

  const maxMove = 14;

  const animateBackground = () => {
    currentX +=
      (targetX - currentX) *
      0.08;

    currentY +=
      (targetY - currentY) *
      0.08;

    document.documentElement
      .style
      .setProperty(
        "--services-bg-x",
        `${currentX}px`
      );

    document.documentElement
      .style
      .setProperty(
        "--services-bg-y",
        `${currentY}px`
      );

    const deltaX =
      Math.abs(
        targetX - currentX
      );

    const deltaY =
      Math.abs(
        targetY - currentY
      );

    if (
      deltaX > 0.04 ||
      deltaY > 0.04
    ) {
      backgroundFrame =
        requestAnimationFrame(
          animateBackground
        );

      return;
    }

    currentX = targetX;
    currentY = targetY;

    document.documentElement
      .style
      .setProperty(
        "--services-bg-x",
        `${currentX}px`
      );

    document.documentElement
      .style
      .setProperty(
        "--services-bg-y",
        `${currentY}px`
      );

    backgroundFrame = null;
  };

  const startBackgroundAnimation = () => {
    if (
      backgroundFrame !== null
    ) {
      return;
    }

    backgroundFrame =
      requestAnimationFrame(
        animateBackground
      );
  };

  window.addEventListener(
    "pointermove",
    event => {
      if (
        window.innerWidth <= 760
      ) {
        return;
      }

      const x =
        event.clientX /
          window.innerWidth -
        0.5;

      const y =
        event.clientY /
          window.innerHeight -
        0.5;

      targetX =
        x * maxMove;

      targetY =
        y * maxMove;

      startBackgroundAnimation();
    },
    {
      passive: true
    }
  );

  document.documentElement
    .addEventListener(
      "mouseleave",
      () => {
        targetX = 0;
        targetY = 0;

        startBackgroundAnimation();
      },
      {
        passive: true
      }
    );

  const hero =
    document.querySelector(
      ".services-hero"
    );

  if (hero) {
    hero.addEventListener(
      "pointermove",
      event => {
        if (
          window.innerWidth <= 760
        ) {
          return;
        }

        const rect =
          hero.getBoundingClientRect();

        const x =
          event.clientX -
          rect.left;

        const y =
          event.clientY -
          rect.top;

        hero.style.setProperty(
          "--services-spot-x",
          `${x}px`
        );

        hero.style.setProperty(
          "--services-spot-y",
          `${y}px`
        );
      },
      {
        passive: true
      }
    );

    hero.addEventListener(
      "pointerleave",
      () => {
        hero.style.setProperty(
          "--services-spot-x",
          "50%"
        );

        hero.style.setProperty(
          "--services-spot-y",
          "50%"
        );
      },
      {
        passive: true
      }
    );
  }

  const revealSections =
    document.querySelectorAll(
      ".reveal-section"
    );

  const reducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

  if (reducedMotion) {
    revealSections.forEach(
      section => {
        section.classList.add(
          "is-visible"
        );
      }
    );
  } else {
    const revealObserver =
      new IntersectionObserver(
        entries => {
          entries.forEach(
            entry => {
              if (
                !entry.isIntersecting
              ) {
                return;
              }

              entry.target.classList.add(
                "is-visible"
              );

              revealObserver.unobserve(
                entry.target
              );
            }
          );
        },
        {
          threshold: 0.12,
          rootMargin:
            "0px 0px -8% 0px"
        }
      );

    revealSections.forEach(
      section => {
        revealObserver.observe(
          section
        );
      }
    );
  }

  const ecosystemBoard =
    document.querySelector(
      ".ecosystem-board"
    );

  const ecosystemServices =
    document.querySelectorAll(
      ".ecosystem-service"
    );

  if (
    ecosystemBoard &&
    ecosystemServices.length
  ) {
    ecosystemServices.forEach(
      service => {
        service.addEventListener(
          "pointerenter",
          () => {
            if (
              window.innerWidth <= 760
            ) {
              return;
            }

            ecosystemServices.forEach(
              item => {
                item.classList.remove(
                  "is-active"
                );
              }
            );

            service.classList.add(
              "is-active"
            );

            ecosystemBoard.classList.add(
              "has-active-service"
            );
          }
        );

        service.addEventListener(
          "pointerleave",
          () => {
            service.classList.remove(
              "is-active"
            );

            ecosystemBoard.classList.remove(
              "has-active-service"
            );
          }
        );
      }
    );
  }

  const heroSystem =
    document.querySelector(
      ".services-hero-system"
    );

  if (heroSystem) {
    let heroTargetX = 0;
    let heroTargetY = 0;

    let heroCurrentX = 0;
    let heroCurrentY = 0;

    let heroFrame = null;

    const animateHeroSystem = () => {
      heroCurrentX +=
        (heroTargetX -
          heroCurrentX) *
        0.09;

      heroCurrentY +=
        (heroTargetY -
          heroCurrentY) *
        0.09;

      heroSystem.style.transform =
        `translate3d(${heroCurrentX}px, ${heroCurrentY}px, 0)`;

      const dx =
        Math.abs(
          heroTargetX -
          heroCurrentX
        );

      const dy =
        Math.abs(
          heroTargetY -
          heroCurrentY
        );

      if (
        dx > 0.03 ||
        dy > 0.03
      ) {
        heroFrame =
          requestAnimationFrame(
            animateHeroSystem
          );

        return;
      }

      heroFrame = null;
    };

    const startHeroAnimation = () => {
      if (
        heroFrame !== null
      ) {
        return;
      }

      heroFrame =
        requestAnimationFrame(
          animateHeroSystem
        );
    };

    heroSystem.addEventListener(
      "pointermove",
      event => {
        if (
          window.innerWidth <= 760
        ) {
          return;
        }

        const rect =
          heroSystem
            .getBoundingClientRect();

        const x =
          event.clientX -
          rect.left;

        const y =
          event.clientY -
          rect.top;

        const normalizedX =
          x / rect.width -
          0.5;

        const normalizedY =
          y / rect.height -
          0.5;

        heroTargetX =
          normalizedX * 8;

        heroTargetY =
          normalizedY * 8;

        startHeroAnimation();
      },
      {
        passive: true
      }
    );

    heroSystem.addEventListener(
      "pointerleave",
      () => {
        heroTargetX = 0;
        heroTargetY = 0;

        startHeroAnimation();
      },
      {
        passive: true
      }
    );
  }

  const transformation =
    document.querySelector(
      ".services-transformation"
    );

  if (transformation) {
    const transformationObserver =
      new IntersectionObserver(
        entries => {
          entries.forEach(
            entry => {
              if (
                !entry.isIntersecting
              ) {
                return;
              }

              transformation.classList.add(
                "transformation-ready"
              );

              transformationObserver.disconnect();
            }
          );
        },
        {
          threshold: 0.3
        }
      );

    transformationObserver.observe(
      transformation
    );
  }

  document.addEventListener(
    "visibilitychange",
    () => {
      if (
        document.hidden &&
        backgroundFrame !== null
      ) {
        cancelAnimationFrame(
          backgroundFrame
        );

        backgroundFrame = null;
      }
    }
  );
  const projectMap =
  document.querySelector(
    ".services-project-map"
  );

if (projectMap) {
  const stages =
    Array.from(
      projectMap.querySelectorAll(
        ".project-stage"
      )
    );

  const lines =
    Array.from(
      projectMap.querySelectorAll(
        ".project-line"
      )
    );

  const number =
    document.getElementById(
      "project-core-number"
    );

  const title =
    document.getElementById(
      "project-core-title"
    );

  const description =
    document.getElementById(
      "project-core-description"
    );

  let activeIndex = 0;
  let cycleTimer = null;
  let paused = false;

  const activateStage = index => {
    activeIndex = index;

    stages.forEach(
      (stage, stageIndex) => {
        stage.classList.toggle(
          "is-active",
          stageIndex === index
        );
      }
    );

    lines.forEach(
      (line, lineIndex) => {
        line.classList.toggle(
          "is-active",
          lineIndex === index
        );
      }
    );

    const stage =
      stages[index];

    if (!stage) return;

    const stageNumber =
      stage.dataset.stage
        .padStart(2, "0");

    number.textContent =
      stageNumber;

    title.textContent =
      stage.dataset.title;

    description.textContent =
      stage.dataset.description;

    projectMap.classList.add(
      "has-focus"
    );

    window.setTimeout(
      () => {
        if (!paused) {
          projectMap.classList.remove(
            "has-focus"
          );
        }
      },
      650
    );
  };

  const startCycle = () => {
    window.clearInterval(
      cycleTimer
    );

    cycleTimer =
      window.setInterval(
        () => {
          if (paused) return;

          const nextIndex =
            (
              activeIndex + 1
            ) %
            stages.length;

          activateStage(
            nextIndex
          );
        },
        3200
      );
  };

  stages.forEach(
    (stage, index) => {
      stage.addEventListener(
        "pointerenter",
        () => {
          if (
            window.innerWidth <=
            760
          ) {
            return;
          }

          paused = true;

          activateStage(
            index
          );

          projectMap.classList.add(
            "has-focus"
          );
        }
      );

      stage.addEventListener(
        "pointerleave",
        () => {
          paused = false;

          projectMap.classList.remove(
            "has-focus"
          );
        }
      );

      stage.addEventListener(
        "click",
        () => {
          activateStage(
            index
          );
        }
      );
    }
  );

  projectMap.addEventListener(
    "pointerenter",
    () => {
      if (
        window.innerWidth >
        760
      ) {
        paused = true;
      }
    }
  );

  projectMap.addEventListener(
    "pointerleave",
    () => {
      paused = false;
    }
  );

  activateStage(0);

  if (
    !window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
  ) {
    startCycle();
  }
}
})();
