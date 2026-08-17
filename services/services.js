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
  const cabinetCore =
  document.querySelector(
    ".project-core"
  );

const cabinetFold =
  document.querySelector(
    ".project-core-fold"
  );

if (
  cabinetCore &&
  cabinetFold
) {
  cabinetFold.addEventListener(
    "click",
    event => {
      event.stopPropagation();

      const isOpen =
        cabinetCore.classList.toggle(
          "is-open"
        );

      cabinetFold.setAttribute(
        "aria-expanded",
        String(isOpen)
      );
    }
  );
}
  const cabinetCloseButton =
  document.querySelector(
    ".project-core-close"
  );

if (cabinetCloseButton) {
  cabinetCloseButton.addEventListener(
    "click",
    event => {
      event.stopPropagation();

      const core =
        cabinetCloseButton.closest(
          ".project-core"
        );

      if (!core) return;

      core.classList.remove(
        "is-open"
      );

      const fold =
        core.querySelector(
          ".project-core-fold"
        );

      if (fold) {
        fold.setAttribute(
          "aria-expanded",
          "false"
        );
      }
    }
  );
}
  const draggableProjectMap =
  document.querySelector(
    ".services-project-map"
  );

if (draggableProjectMap) {
  const draggableStages =
    Array.from(
      draggableProjectMap.querySelectorAll(
        ".project-stage"
      )
    );

  const draggableLines =
    Array.from(
      draggableProjectMap.querySelectorAll(
        ".project-line"
      )
    );

  const projectCoreElement =
    draggableProjectMap.querySelector(
      ".project-core"
    );

  const SVG_NS =
    "http://www.w3.org/2000/svg";

  const getStageCenter = stage => {
    const mapRect =
      draggableProjectMap.getBoundingClientRect();

    const stageRect =
      stage.getBoundingClientRect();

    return {
      x:
        stageRect.left -
        mapRect.left +
        stageRect.width / 2,

      y:
        stageRect.top -
        mapRect.top +
        stageRect.height / 2
    };
  };

  const getCoreCenter = () => {
    const mapRect =
      draggableProjectMap.getBoundingClientRect();

    const coreRect =
      projectCoreElement.getBoundingClientRect();

    return {
      x:
        coreRect.left -
        mapRect.left +
        coreRect.width / 2,

      y:
        coreRect.top -
        mapRect.top +
        coreRect.height / 2
    };
  };

  const updateProjectLines = () => {
    if (
      !projectCoreElement ||
      !draggableLines.length
    ) {
      return;
    }

    const mapRect =
      draggableProjectMap.getBoundingClientRect();

    const viewBoxWidth = 620;
    const viewBoxHeight = 520;

    const scaleX =
      viewBoxWidth / mapRect.width;

    const scaleY =
      viewBoxHeight / mapRect.height;

    const coreCenter =
      getCoreCenter();

    draggableStages.forEach(
      (stage, index) => {
        const line =
          draggableLines[index];

        if (!line) return;

        const stageCenter =
          getStageCenter(stage);

        line.setAttribute(
          "x1",
          String(
            coreCenter.x *
            scaleX
          )
        );

        line.setAttribute(
          "y1",
          String(
            coreCenter.y *
            scaleY
          )
        );

        line.setAttribute(
          "x2",
          String(
            stageCenter.x *
            scaleX
          )
        );

        line.setAttribute(
          "y2",
          String(
            stageCenter.y *
            scaleY
          )
        );
      }
    );
  };

  const enableStageDragging = stage => {
    let pointerId = null;

    let startPointerX = 0;
    let startPointerY = 0;

    let startLeft = 0;
    let startTop = 0;

    let stageWidth = 0;
    let stageHeight = 0;

    let dragging = false;

    const handlePointerDown =
      event => {
        if (
          window.innerWidth <= 760
        ) {
          return;
        }

        if (
          event.button !== 0
        ) {
          return;
        }

        const mapRect =
          draggableProjectMap
            .getBoundingClientRect();

        const stageRect =
          stage
            .getBoundingClientRect();

        pointerId =
          event.pointerId;

        startPointerX =
          event.clientX;

        startPointerY =
          event.clientY;

        startLeft =
          stageRect.left -
          mapRect.left;

        startTop =
          stageRect.top -
          mapRect.top;

        stageWidth =
          stageRect.width;

        stageHeight =
          stageRect.height;

        dragging = true;

        stage.classList.add(
          "is-dragging"
        );

        draggableProjectMap
          .classList.add(
            "is-dragging-stage"
          );

        stage.style.left =
          `${startLeft}px`;

        stage.style.top =
          `${startTop}px`;

        stage.style.right =
          "auto";

        stage.style.bottom =
          "auto";

        stage.style.transform =
          "none";

        stage.setPointerCapture(
          pointerId
        );

        event.preventDefault();
      };

    const handlePointerMove =
      event => {
        if (
          !dragging ||
          event.pointerId !==
          pointerId
        ) {
          return;
        }

        const mapRect =
          draggableProjectMap
            .getBoundingClientRect();

        const deltaX =
          event.clientX -
          startPointerX;

        const deltaY =
          event.clientY -
          startPointerY;

        let nextLeft =
          startLeft +
          deltaX;

        let nextTop =
          startTop +
          deltaY;

        nextLeft =
          Math.max(
            0,
            Math.min(
              nextLeft,
              mapRect.width -
              stageWidth
            )
          );

        nextTop =
          Math.max(
            0,
            Math.min(
              nextTop,
              mapRect.height -
              stageHeight
            )
          );

        stage.style.left =
          `${nextLeft}px`;

        stage.style.top =
          `${nextTop}px`;

        updateProjectLines();
      };

    const finishDragging =
      event => {
        if (
          !dragging ||
          event.pointerId !==
          pointerId
        ) {
          return;
        }

        dragging = false;

        stage.classList.remove(
          "is-dragging"
        );

        draggableProjectMap
          .classList.remove(
            "is-dragging-stage"
          );

        try {
          stage.releasePointerCapture(
            pointerId
          );
        } catch (error) {
        }

        pointerId = null;

        updateProjectLines();
      };

    stage.addEventListener(
      "pointerdown",
      handlePointerDown
    );

    stage.addEventListener(
      "pointermove",
      handlePointerMove
    );

    stage.addEventListener(
      "pointerup",
      finishDragging
    );

    stage.addEventListener(
      "pointercancel",
      finishDragging
    );
  };

  draggableStages.forEach(
    enableStageDragging
  );

  window.addEventListener(
    "resize",
    () => {
      updateProjectLines();
    },
    {
      passive: true
    }
  );

  requestAnimationFrame(
    () => {
      updateProjectLines();
    }
  );
}
  const discussionStage =
  document.querySelector(
    ".project-stage-1"
  );

const discussionCard =
  document.getElementById(
    "project-brief-card"
  );

const discussionCardClose =
  discussionCard
    ? discussionCard.querySelector(
        ".project-stage-detail-close"
      )
    : null;

if (
  discussionStage &&
  discussionCard &&
  discussionCardClose
) {
  let discussionPointerStartX = 0;
  let discussionPointerStartY = 0;
  let discussionWasDragged = false;

  const positionDiscussionCard = () => {
    const map =
      discussionStage.closest(
        ".services-project-map"
      );

    if (!map) return;

    const mapRect =
      map.getBoundingClientRect();

    const stageRect =
      discussionStage
        .getBoundingClientRect();

    const cardWidth =
      discussionCard.offsetWidth ||
      330;

    const cardHeight =
      discussionCard.offsetHeight ||
      310;

    if (
      window.innerWidth <= 760
    ) {
      const left =
        (
          mapRect.width -
          cardWidth
        ) / 2;

      const top =
        Math.max(
          90,
          (
            mapRect.height -
            cardHeight
          ) / 2
        );

      discussionCard.style.left =
        `${left}px`;

      discussionCard.style.top =
        `${top}px`;

      discussionCard.style.setProperty(
        "--detail-origin-x",
        "50%"
      );

      discussionCard.style.setProperty(
        "--detail-origin-y",
        "0%"
      );

      return;
    }

    const stageCenterX =
      stageRect.left -
      mapRect.left +
      stageRect.width / 2;

    const stageCenterY =
      stageRect.top -
      mapRect.top +
      stageRect.height / 2;

    const gap = 18;

    let left;
    let top;

    if (
      stageCenterX <
      mapRect.width * 0.48
    ) {
      left =
        stageRect.right -
        mapRect.left +
        gap;
    } else {
      left =
        stageRect.left -
        mapRect.left -
        cardWidth -
        gap;
    }

    top =
      stageCenterY -
      cardHeight / 2;

    left =
      Math.max(
        8,
        Math.min(
          left,
          mapRect.width -
          cardWidth -
          8
        )
      );

    top =
      Math.max(
        8,
        Math.min(
          top,
          mapRect.height -
          cardHeight -
          8
        )
      );

    discussionCard.style.left =
      `${left}px`;

    discussionCard.style.top =
      `${top}px`;

    const originX =
      stageCenterX -
      left;

    const originY =
      stageCenterY -
      top;

    discussionCard.style.setProperty(
      "--detail-origin-x",
      `${originX}px`
    );

    discussionCard.style.setProperty(
      "--detail-origin-y",
      `${originY}px`
    );
  };

  const openDiscussionCard = () => {
    positionDiscussionCard();

    discussionCard.classList.add(
      "is-open"
    );

    discussionCard.setAttribute(
      "aria-hidden",
      "false"
    );

    discussionStage.setAttribute(
      "aria-expanded",
      "true"
    );
  };

  const closeDiscussionCard = () => {
    discussionCard.classList.remove(
      "is-open"
    );

    discussionCard.setAttribute(
      "aria-hidden",
      "true"
    );

    discussionStage.setAttribute(
      "aria-expanded",
      "false"
    );
  };

  discussionStage.addEventListener(
    "pointerdown",
    event => {
      discussionPointerStartX =
        event.clientX;

      discussionPointerStartY =
        event.clientY;

      discussionWasDragged = false;
    }
  );

  discussionStage.addEventListener(
    "pointermove",
    event => {
      const distanceX =
        Math.abs(
          event.clientX -
          discussionPointerStartX
        );

      const distanceY =
        Math.abs(
          event.clientY -
          discussionPointerStartY
        );

      if (
        distanceX > 6 ||
        distanceY > 6
      ) {
        discussionWasDragged = true;
      }
    }
  );

  discussionStage.addEventListener(
    "click",
    event => {
      if (
        discussionWasDragged
      ) {
        discussionWasDragged = false;
        return;
      }

      event.stopPropagation();

      if (
        discussionCard.classList.contains(
          "is-open"
        )
      ) {
        closeDiscussionCard();
      } else {
        openDiscussionCard();
      }
    }
  );

  discussionCardClose.addEventListener(
    "click",
    event => {
      event.stopPropagation();

      closeDiscussionCard();
    }
  );

  document.addEventListener(
    "keydown",
    event => {
      if (
        event.key === "Escape"
      ) {
        closeDiscussionCard();
      }
    }
  );

  window.addEventListener(
    "resize",
    () => {
      if (
        discussionCard.classList.contains(
          "is-open"
        )
      ) {
        positionDiscussionCard();
      }
    },
    {
      passive: true
    }
  );
}
  const analysisStage =
  document.querySelector(
    ".project-stage-2"
  );

const analysisCard =
  document.getElementById(
    "project-analysis-card"
  );

const analysisClose =
  analysisCard
    ? analysisCard.querySelector(
        ".analysis-close"
      )
    : null;

if (
  analysisStage &&
  analysisCard &&
  analysisClose
) {
  let analysisStartX = 0;
  let analysisStartY = 0;
  let analysisWasDragged = false;

  const positionAnalysisCard = () => {
    const map =
      analysisStage.closest(
        ".services-project-map"
      );

    if (!map) return;

    const mapRect =
      map.getBoundingClientRect();

    const stageRect =
      analysisStage
        .getBoundingClientRect();

    const cardWidth =
      analysisCard.offsetWidth ||
      440;

    const cardHeight =
      analysisCard.offsetHeight ||
      250;

    const stageCenterX =
      stageRect.left -
      mapRect.left +
      stageRect.width / 2;

    const stageCenterY =
      stageRect.top -
      mapRect.top +
      stageRect.height / 2;

    if (
      window.innerWidth <= 760
    ) {
      const left =
        (
          mapRect.width -
          cardWidth
        ) / 2;

      const top =
        Math.max(
          70,
          (
            mapRect.height -
            cardHeight
          ) / 2
        );

      analysisCard.style.left =
        `${left}px`;

      analysisCard.style.top =
        `${top}px`;

      analysisCard.style.setProperty(
        "--analysis-origin-x",
        "50%"
      );

      analysisCard.style.setProperty(
        "--analysis-origin-y",
        "0%"
      );

      return;
    }

    const gap = 18;

    let left;
    let top;

    if (
      stageCenterY <
      mapRect.height * 0.5
    ) {
      top =
        stageRect.bottom -
        mapRect.top +
        gap;
    } else {
      top =
        stageRect.top -
        mapRect.top -
        cardHeight -
        gap;
    }

    left =
      stageCenterX -
      cardWidth / 2;

    left =
      Math.max(
        8,
        Math.min(
          left,
          mapRect.width -
          cardWidth -
          8
        )
      );

    top =
      Math.max(
        8,
        Math.min(
          top,
          mapRect.height -
          cardHeight -
          8
        )
      );

    analysisCard.style.left =
      `${left}px`;

    analysisCard.style.top =
      `${top}px`;

    analysisCard.style.setProperty(
      "--analysis-origin-x",
      `${stageCenterX - left}px`
    );

    analysisCard.style.setProperty(
      "--analysis-origin-y",
      `${stageCenterY - top}px`
    );
  };

  const openAnalysisCard = () => {
    const discussionCard =
      document.getElementById(
        "project-brief-card"
      );

    const discussionStage =
      document.querySelector(
        ".project-stage-1"
      );

    if (discussionCard) {
      discussionCard.classList.remove(
        "is-open"
      );

      discussionCard.setAttribute(
        "aria-hidden",
        "true"
      );
    }

    if (discussionStage) {
      discussionStage.setAttribute(
        "aria-expanded",
        "false"
      );
    }

    positionAnalysisCard();

    analysisCard.classList.add(
      "is-open"
    );

    analysisCard.setAttribute(
      "aria-hidden",
      "false"
    );

    analysisStage.setAttribute(
      "aria-expanded",
      "true"
    );
  };

  const closeAnalysisCard = () => {
    analysisCard.classList.remove(
      "is-open"
    );

    analysisCard.setAttribute(
      "aria-hidden",
      "true"
    );

    analysisStage.setAttribute(
      "aria-expanded",
      "false"
    );
  };

  analysisStage.addEventListener(
    "pointerdown",
    event => {
      analysisStartX =
        event.clientX;

      analysisStartY =
        event.clientY;

      analysisWasDragged = false;
    }
  );

  analysisStage.addEventListener(
    "pointermove",
    event => {
      const distanceX =
        Math.abs(
          event.clientX -
          analysisStartX
        );

      const distanceY =
        Math.abs(
          event.clientY -
          analysisStartY
        );

      if (
        distanceX > 6 ||
        distanceY > 6
      ) {
        analysisWasDragged = true;
      }
    }
  );

  analysisStage.addEventListener(
    "click",
    event => {
      if (
        analysisWasDragged
      ) {
        analysisWasDragged = false;
        return;
      }

      event.stopPropagation();

      if (
        analysisCard.classList.contains(
          "is-open"
        )
      ) {
        closeAnalysisCard();
      } else {
        openAnalysisCard();
      }
    }
  );

  analysisClose.addEventListener(
    "click",
    event => {
      event.stopPropagation();

      closeAnalysisCard();
    }
  );

  document.addEventListener(
    "keydown",
    event => {
      if (
        event.key === "Escape"
      ) {
        closeAnalysisCard();
      }
    }
  );

  window.addEventListener(
    "resize",
    () => {
      if (
        analysisCard.classList.contains(
          "is-open"
        )
      ) {
        positionAnalysisCard();
      }
    },
    {
      passive: true
    }
  );
}
})();
