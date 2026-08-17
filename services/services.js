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
  const architectureStage =
  document.querySelector(
    ".project-stage-3"
  );

const architectureCard =
  document.getElementById(
    "project-architecture-card"
  );

const architectureClose =
  architectureCard
    ? architectureCard.querySelector(
        ".architecture-close"
      )
    : null;

if (
  architectureStage &&
  architectureCard &&
  architectureClose
) {
  let architectureStartX = 0;
  let architectureStartY = 0;
  let architectureWasDragged = false;

  const positionArchitectureCard = () => {
    const map =
      architectureStage.closest(
        ".services-project-map"
      );

    if (!map) return;

    const mapRect =
      map.getBoundingClientRect();

    const stageRect =
      architectureStage
        .getBoundingClientRect();

    const cardWidth =
      architectureCard.offsetWidth ||
      470;

    const cardHeight =
      architectureCard.offsetHeight ||
      330;

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
          60,
          (
            mapRect.height -
            cardHeight
          ) / 2
        );

      architectureCard.style.left =
        `${left}px`;

      architectureCard.style.top =
        `${top}px`;

      architectureCard.style.setProperty(
        "--architecture-origin-x",
        "50%"
      );

      architectureCard.style.setProperty(
        "--architecture-origin-y",
        "0%"
      );

      return;
    }

    const gap = 18;

    let left;
    let top;

    if (
      stageCenterX >
      mapRect.width * 0.5
    ) {
      left =
        stageRect.left -
        mapRect.left -
        cardWidth -
        gap;
    } else {
      left =
        stageRect.right -
        mapRect.left +
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

    architectureCard.style.left =
      `${left}px`;

    architectureCard.style.top =
      `${top}px`;

    architectureCard.style.setProperty(
      "--architecture-origin-x",
      `${stageCenterX - left}px`
    );

    architectureCard.style.setProperty(
      "--architecture-origin-y",
      `${stageCenterY - top}px`
    );
  };

  const closeOtherStageCards = () => {
    const discussionCard =
      document.getElementById(
        "project-brief-card"
      );

    const analysisCard =
      document.getElementById(
        "project-analysis-card"
      );

    const discussionStage =
      document.querySelector(
        ".project-stage-1"
      );

    const analysisStage =
      document.querySelector(
        ".project-stage-2"
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

    if (analysisCard) {
      analysisCard.classList.remove(
        "is-open"
      );

      analysisCard.setAttribute(
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

    if (analysisStage) {
      analysisStage.setAttribute(
        "aria-expanded",
        "false"
      );
    }
  };

  const openArchitectureCard = () => {
    closeOtherStageCards();

    positionArchitectureCard();

    architectureCard.classList.add(
      "is-open"
    );

    architectureCard.setAttribute(
      "aria-hidden",
      "false"
    );

    architectureStage.setAttribute(
      "aria-expanded",
      "true"
    );
  };

  const closeArchitectureCard = () => {
    architectureCard.classList.remove(
      "is-open"
    );

    architectureCard.setAttribute(
      "aria-hidden",
      "true"
    );

    architectureStage.setAttribute(
      "aria-expanded",
      "false"
    );
  };

  architectureStage.addEventListener(
    "pointerdown",
    event => {
      architectureStartX =
        event.clientX;

      architectureStartY =
        event.clientY;

      architectureWasDragged = false;
    }
  );

  architectureStage.addEventListener(
    "pointermove",
    event => {
      const distanceX =
        Math.abs(
          event.clientX -
          architectureStartX
        );

      const distanceY =
        Math.abs(
          event.clientY -
          architectureStartY
        );

      if (
        distanceX > 6 ||
        distanceY > 6
      ) {
        architectureWasDragged = true;
      }
    }
  );

  architectureStage.addEventListener(
    "click",
    event => {
      if (
        architectureWasDragged
      ) {
        architectureWasDragged = false;
        return;
      }

      event.stopPropagation();

      if (
        architectureCard.classList.contains(
          "is-open"
        )
      ) {
        closeArchitectureCard();
      } else {
        openArchitectureCard();
      }
    }
  );

  architectureClose.addEventListener(
    "click",
    event => {
      event.stopPropagation();

      closeArchitectureCard();
    }
  );

  document.addEventListener(
    "keydown",
    event => {
      if (
        event.key === "Escape"
      ) {
        closeArchitectureCard();
      }
    }
  );

  window.addEventListener(
    "resize",
    () => {
      if (
        architectureCard.classList.contains(
          "is-open"
        )
      ) {
        positionArchitectureCard();
      }
    },
    {
      passive: true
    }
  );
}
  const developmentStage =
  document.querySelector(
    ".project-stage-4"
  );

const developmentCard =
  document.getElementById(
    "project-development-card"
  );

const developmentClose =
  developmentCard
    ? developmentCard.querySelector(
        ".development-close"
      )
    : null;

if (
  developmentStage &&
  developmentCard &&
  developmentClose
) {
  let developmentStartX = 0;
  let developmentStartY = 0;
  let developmentWasDragged = false;

  const developmentProgressLabel =
    developmentCard.querySelector(
      ".development-progress-label"
    );

  let developmentProgressTimer = null;

  const resetDevelopmentProgress = () => {
  if (developmentProgressTimer) {
    clearInterval(
      developmentProgressTimer
    );

    developmentProgressTimer = null;
  }

  if (developmentProgressLabel) {
    developmentProgressLabel.textContent =
      "0%";
  }

  const modules =
    developmentCard.querySelectorAll(
      ".development-module"
    );

  modules.forEach(
    module => {
      module.classList.remove(
        "is-built"
      );
    }
  );

  const output =
    developmentCard.querySelector(
      ".development-output"
    );

  if (output) {
    output.classList.remove(
      "is-ready"
    );
  }
};

const runDevelopmentProgress = () => {
  resetDevelopmentProgress();

  const modules =
    Array.from(
      developmentCard.querySelectorAll(
        ".development-module"
      )
    );

  const output =
    developmentCard.querySelector(
      ".development-output"
    );

  const progressBar =
    developmentCard.querySelector(
      ".development-progress span"
    );

  if (progressBar) {
    progressBar.style.animation =
      "none";

    progressBar.offsetHeight;

    progressBar.style.animation = "";
  }

  if (!developmentProgressLabel) {
    return;
  }

  const duration = 2800;

  const startTime =
    performance.now();

  let activatedModules = 0;

  developmentProgressTimer =
    setInterval(
      () => {
        const elapsed =
          performance.now() -
          startTime;

        const progress =
          Math.min(
            100,
            Math.round(
              elapsed /
              duration *
              100
            )
          );

        developmentProgressLabel
          .textContent =
          `${progress}%`;

        const nextModuleCount =
          Math.min(
            modules.length,
            Math.floor(
              progress /
              (100 / modules.length)
            )
          );

        if (
          nextModuleCount >
          activatedModules
        ) {
          for (
            let i = activatedModules;
            i < nextModuleCount;
            i++
          ) {
            if (modules[i]) {
              modules[i].classList.add(
                "is-built"
              );
            }
          }

          activatedModules =
            nextModuleCount;
        }

        if (progress >= 100) {
          clearInterval(
            developmentProgressTimer
          );

          developmentProgressTimer =
            null;

          modules.forEach(
            module => {
              module.classList.add(
                "is-built"
              );
            }
          );

          if (output) {
            output.classList.add(
              "is-ready"
            );
          }
        }
      },
      40
    );
};

  const positionDevelopmentCard =
    () => {
      const map =
        developmentStage.closest(
          ".services-project-map"
        );

      if (!map) return;

      const mapRect =
        map.getBoundingClientRect();

      const stageRect =
        developmentStage
          .getBoundingClientRect();

      const cardWidth =
        developmentCard.offsetWidth ||
        455;

      const cardHeight =
        developmentCard.offsetHeight ||
        320;

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
            55,
            (
              mapRect.height -
              cardHeight
            ) / 2
          );

        developmentCard.style.left =
          `${left}px`;

        developmentCard.style.top =
          `${top}px`;

        developmentCard.style.setProperty(
          "--development-origin-x",
          "50%"
        );

        developmentCard.style.setProperty(
          "--development-origin-y",
          "100%"
        );

        return;
      }

      const gap = 18;

      let left;
      let top;

      if (
        stageCenterY >
        mapRect.height * 0.52
      ) {
        top =
          stageRect.top -
          mapRect.top -
          cardHeight -
          gap;
      } else {
        top =
          stageRect.bottom -
          mapRect.top +
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

      developmentCard.style.left =
        `${left}px`;

      developmentCard.style.top =
        `${top}px`;

      developmentCard.style.setProperty(
        "--development-origin-x",
        `${stageCenterX - left}px`
      );

      developmentCard.style.setProperty(
        "--development-origin-y",
        `${stageCenterY - top}px`
      );
    };

  const closePreviousStageCards =
    () => {
      const cards = [
        document.getElementById(
          "project-brief-card"
        ),
        document.getElementById(
          "project-analysis-card"
        ),
        document.getElementById(
          "project-architecture-card"
        )
      ];

      const stages = [
        document.querySelector(
          ".project-stage-1"
        ),
        document.querySelector(
          ".project-stage-2"
        ),
        document.querySelector(
          ".project-stage-3"
        )
      ];

      cards.forEach(
        card => {
          if (!card) return;

          card.classList.remove(
            "is-open"
          );

          card.setAttribute(
            "aria-hidden",
            "true"
          );
        }
      );

      stages.forEach(
        stage => {
          if (!stage) return;

          stage.setAttribute(
            "aria-expanded",
            "false"
          );
        }
      );
    };

  const openDevelopmentCard =
    () => {
      closePreviousStageCards();

      positionDevelopmentCard();

      developmentCard.classList.add(
        "is-open"
      );

      developmentCard.setAttribute(
        "aria-hidden",
        "false"
      );

      developmentStage.setAttribute(
        "aria-expanded",
        "true"
      );

      requestAnimationFrame(
        () => {
          runDevelopmentProgress();
        }
      );
    };

  const closeDevelopmentCard =
    () => {
      developmentCard.classList.remove(
        "is-open"
      );

      developmentCard.setAttribute(
        "aria-hidden",
        "true"
      );

      developmentStage.setAttribute(
        "aria-expanded",
        "false"
      );

      resetDevelopmentProgress();
    };

  developmentStage.addEventListener(
    "pointerdown",
    event => {
      developmentStartX =
        event.clientX;

      developmentStartY =
        event.clientY;

      developmentWasDragged = false;
    }
  );

  developmentStage.addEventListener(
    "pointermove",
    event => {
      const distanceX =
        Math.abs(
          event.clientX -
          developmentStartX
        );

      const distanceY =
        Math.abs(
          event.clientY -
          developmentStartY
        );

      if (
        distanceX > 6 ||
        distanceY > 6
      ) {
        developmentWasDragged = true;
      }
    }
  );

  developmentStage.addEventListener(
    "click",
    event => {
      if (
        developmentWasDragged
      ) {
        developmentWasDragged = false;
        return;
      }

      event.stopPropagation();

      if (
        developmentCard.classList.contains(
          "is-open"
        )
      ) {
        closeDevelopmentCard();
      } else {
        openDevelopmentCard();
      }
    }
  );

  developmentClose.addEventListener(
    "click",
    event => {
      event.stopPropagation();

      closeDevelopmentCard();
    }
  );

  document.addEventListener(
    "keydown",
    event => {
      if (
        event.key === "Escape"
      ) {
        closeDevelopmentCard();
      }
    }
  );

  window.addEventListener(
    "resize",
    () => {
      if (
        developmentCard.classList.contains(
          "is-open"
        )
      ) {
        positionDevelopmentCard();
      }
    },
    {
      passive: true
    }
  );
}
  const integrationStage =
  document.querySelector(
    ".project-stage-5"
  );

const integrationCard =
  document.getElementById(
    "project-integration-card"
  );

const integrationClose =
  integrationCard
    ? integrationCard.querySelector(
        ".integration-close"
      )
    : null;

if (
  integrationStage &&
  integrationCard &&
  integrationClose
) {
  let integrationStartX = 0;
  let integrationStartY = 0;
  let integrationWasDragged = false;

  const positionIntegrationCard = () => {
    const map =
      integrationStage.closest(
        ".services-project-map"
      );

    if (!map) return;

    const mapRect =
      map.getBoundingClientRect();

    const stageRect =
      integrationStage
        .getBoundingClientRect();

    const cardWidth =
      integrationCard.offsetWidth ||
      455;

    const cardHeight =
      integrationCard.offsetHeight ||
      330;

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
          55,
          (
            mapRect.height -
            cardHeight
          ) / 2
        );

      integrationCard.style.left =
        `${left}px`;

      integrationCard.style.top =
        `${top}px`;

      integrationCard.style.setProperty(
        "--integration-origin-x",
        "50%"
      );

      integrationCard.style.setProperty(
        "--integration-origin-y",
        "100%"
      );

      return;
    }

    const gap = 18;

    let left;
    let top;

    if (
      stageCenterX <
      mapRect.width * 0.5
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

    integrationCard.style.left =
      `${left}px`;

    integrationCard.style.top =
      `${top}px`;

    integrationCard.style.setProperty(
      "--integration-origin-x",
      `${stageCenterX - left}px`
    );

    integrationCard.style.setProperty(
      "--integration-origin-y",
      `${stageCenterY - top}px`
    );
  };

  const closePreviousStageCards = () => {
    const cards = [
      "project-brief-card",
      "project-analysis-card",
      "project-architecture-card",
      "project-development-card"
    ];

    cards.forEach(
      id => {
        const card =
          document.getElementById(
            id
          );

        if (!card) return;

        card.classList.remove(
          "is-open"
        );

        card.setAttribute(
          "aria-hidden",
          "true"
        );
      }
    );

    for (
      let stageNumber = 1;
      stageNumber <= 4;
      stageNumber++
    ) {
      const stage =
        document.querySelector(
          `.project-stage-${stageNumber}`
        );

      if (!stage) continue;

      stage.setAttribute(
        "aria-expanded",
        "false"
      );
    }
  };

  const openIntegrationCard = () => {
    closePreviousStageCards();

    positionIntegrationCard();

    integrationCard.classList.add(
      "is-open"
    );

    integrationCard.setAttribute(
      "aria-hidden",
      "false"
    );

    integrationStage.setAttribute(
      "aria-expanded",
      "true"
    );
  };

  const closeIntegrationCard = () => {
    integrationCard.classList.remove(
      "is-open"
    );

    integrationCard.setAttribute(
      "aria-hidden",
      "true"
    );

    integrationStage.setAttribute(
      "aria-expanded",
      "false"
    );
  };

  integrationStage.addEventListener(
    "pointerdown",
    event => {
      integrationStartX =
        event.clientX;

      integrationStartY =
        event.clientY;

      integrationWasDragged = false;
    }
  );

  integrationStage.addEventListener(
    "pointermove",
    event => {
      const distanceX =
        Math.abs(
          event.clientX -
          integrationStartX
        );

      const distanceY =
        Math.abs(
          event.clientY -
          integrationStartY
        );

      if (
        distanceX > 6 ||
        distanceY > 6
      ) {
        integrationWasDragged = true;
      }
    }
  );

  integrationStage.addEventListener(
    "click",
    event => {
      if (
        integrationWasDragged
      ) {
        integrationWasDragged = false;
        return;
      }

      event.stopPropagation();

      if (
        integrationCard.classList.contains(
          "is-open"
        )
      ) {
        closeIntegrationCard();
      } else {
        openIntegrationCard();
      }
    }
  );

  integrationClose.addEventListener(
    "click",
    event => {
      event.stopPropagation();

      closeIntegrationCard();
    }
  );

  document.addEventListener(
    "keydown",
    event => {
      if (
        event.key === "Escape"
      ) {
        closeIntegrationCard();
      }
    }
  );

  window.addEventListener(
    "resize",
    () => {
      if (
        integrationCard.classList.contains(
          "is-open"
        )
      ) {
        positionIntegrationCard();
      }
    },
    {
      passive: true
    }
  );
}
  const testingStage =
  document.querySelector(
    ".project-stage-6"
  );

const testingCard =
  document.getElementById(
    "project-testing-card"
  );

const testingClose =
  testingCard
    ? testingCard.querySelector(
        ".testing-close"
      )
    : null;

if (
  testingStage &&
  testingCard &&
  testingClose
) {
  let testingStartX = 0;
  let testingStartY = 0;
  let testingWasDragged = false;
  let testingRetestTimer = null;

const resetTestingState = () => {
  if (testingRetestTimer) {
    clearTimeout(
      testingRetestTimer
    );

    testingRetestTimer = null;
  }

  const retestRow =
    testingCard.querySelector(
      ".testing-row-retest"
    );

  const retestStatus =
    retestRow
      ? retestRow.querySelector(
          ".testing-status"
        )
      : null;

  const summaryValues =
    testingCard.querySelectorAll(
      ".testing-summary strong"
    );

  if (retestRow) {
    retestRow.classList.remove(
      "is-fixed"
    );
  }

  if (retestStatus) {
    retestStatus.classList.remove(
      "is-pass"
    );

    retestStatus.classList.add(
      "is-retest"
    );

    retestStatus.textContent =
      "RETEST";
  }

  if (summaryValues[1]) {
    summaryValues[1].textContent =
      "11";
  }

  if (summaryValues[2]) {
    summaryValues[2].textContent =
      "1";
  }
};

const runTestingRetest = () => {
  resetTestingState();

  testingRetestTimer =
    setTimeout(
      () => {
        const retestRow =
          testingCard.querySelector(
            ".testing-row-retest"
          );

        const retestStatus =
          retestRow
            ? retestRow.querySelector(
                ".testing-status"
              )
            : null;

        const summaryValues =
          testingCard.querySelectorAll(
            ".testing-summary strong"
          );

        if (retestRow) {
          retestRow.classList.add(
            "is-fixed"
          );
        }

        if (retestStatus) {
          retestStatus.classList.remove(
            "is-retest"
          );

          retestStatus.classList.add(
            "is-pass"
          );

          retestStatus.textContent =
            "PASS";
        }

        if (summaryValues[1]) {
          summaryValues[1].textContent =
            "12";
        }

        if (summaryValues[2]) {
          summaryValues[2].textContent =
            "0";
        }

        testingRetestTimer = null;
      },
      5000
    );
};

  const positionTestingCard = () => {
    const map =
      testingStage.closest(
        ".services-project-map"
      );

    if (!map) return;

    const mapRect =
      map.getBoundingClientRect();

    const stageRect =
      testingStage
        .getBoundingClientRect();

    const cardWidth =
      testingCard.offsetWidth ||
      450;

    const cardHeight =
      testingCard.offsetHeight ||
      360;

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
          50,
          (
            mapRect.height -
            cardHeight
          ) / 2
        );

      testingCard.style.left =
        `${left}px`;

      testingCard.style.top =
        `${top}px`;

      testingCard.style.setProperty(
        "--testing-origin-x",
        "50%"
      );

      testingCard.style.setProperty(
        "--testing-origin-y",
        "50%"
      );

      return;
    }

    const gap = 18;

    let left;
    let top;

    if (
      stageCenterX <
      mapRect.width * 0.5
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

    testingCard.style.left =
      `${left}px`;

    testingCard.style.top =
      `${top}px`;

    testingCard.style.setProperty(
      "--testing-origin-x",
      `${stageCenterX - left}px`
    );

    testingCard.style.setProperty(
      "--testing-origin-y",
      `${stageCenterY - top}px`
    );
  };

  const closePreviousStageCards =
    () => {
      const cards = [
        "project-brief-card",
        "project-analysis-card",
        "project-architecture-card",
        "project-development-card",
        "project-integration-card"
      ];

      cards.forEach(
        id => {
          const card =
            document.getElementById(
              id
            );

          if (!card) return;

          card.classList.remove(
            "is-open"
          );

          card.setAttribute(
            "aria-hidden",
            "true"
          );
        }
      );

      for (
        let stageNumber = 1;
        stageNumber <= 5;
        stageNumber++
      ) {
        const stage =
          document.querySelector(
            `.project-stage-${stageNumber}`
          );

        if (!stage) continue;

        stage.setAttribute(
          "aria-expanded",
          "false"
        );
      }
    };

    const openTestingCard = () => {
      closePreviousStageCards();
    
      positionTestingCard();
    
      testingCard.classList.add(
        "is-open"
      );
    
      testingCard.setAttribute(
        "aria-hidden",
        "false"
      );
    
      testingStage.setAttribute(
        "aria-expanded",
        "true"
      );
    
      runTestingRetest();
    };

    const closeTestingCard = () => {
    testingCard.classList.remove(
      "is-open"
    );
  
    testingCard.setAttribute(
      "aria-hidden",
      "true"
    );
  
    testingStage.setAttribute(
      "aria-expanded",
      "false"
    );
  
    resetTestingState();
  };

  testingStage.addEventListener(
    "pointerdown",
    event => {
      testingStartX =
        event.clientX;

      testingStartY =
        event.clientY;

      testingWasDragged = false;
    }
  );

  testingStage.addEventListener(
    "pointermove",
    event => {
      const distanceX =
        Math.abs(
          event.clientX -
          testingStartX
        );

      const distanceY =
        Math.abs(
          event.clientY -
          testingStartY
        );

      if (
        distanceX > 6 ||
        distanceY > 6
      ) {
        testingWasDragged = true;
      }
    }
  );

  testingStage.addEventListener(
    "click",
    event => {
      if (
        testingWasDragged
      ) {
        testingWasDragged = false;
        return;
      }

      event.stopPropagation();

      if (
        testingCard.classList.contains(
          "is-open"
        )
      ) {
        closeTestingCard();
      } else {
        openTestingCard();
      }
    }
  );

  testingClose.addEventListener(
    "click",
    event => {
      event.stopPropagation();

      closeTestingCard();
    }
  );

  document.addEventListener(
    "keydown",
    event => {
      if (
        event.key === "Escape"
      ) {
        closeTestingCard();
      }
    }
  );

  window.addEventListener(
    "resize",
    () => {
      if (
        testingCard.classList.contains(
          "is-open"
        )
      ) {
        positionTestingCard();
      }
    },
    {
      passive: true
    }
  );
}
  const launchStage =
  document.querySelector(
    ".project-stage-7"
  );

const launchCard =
  document.getElementById(
    "project-launch-card"
  );

const launchClose =
  launchCard
    ? launchCard.querySelector(
        ".launch-close"
      )
    : null;

if (
  launchStage &&
  launchCard &&
  launchClose
) {
  let launchStartX = 0;
  let launchStartY = 0;
  let launchWasDragged = false;

  const launchUptime =
  launchCard.querySelector(
    ".launch-time strong"
  );

let launchUptimeTimer = null;
let launchUptimeSeconds = 0;

const formatLaunchUptime = seconds => {
  const hours =
    Math.floor(
      seconds / 3600
    );

  const minutes =
    Math.floor(
      (seconds % 3600) / 60
    );

  const secs =
    seconds % 60;

  return [
    hours,
    minutes,
    secs
  ]
    .map(
      value =>
        String(value).padStart(
          2,
          "0"
        )
    )
    .join(":");
};

const resetLaunchUptime = () => {
  if (launchUptimeTimer) {
    clearInterval(
      launchUptimeTimer
    );

    launchUptimeTimer = null;
  }

  launchUptimeSeconds = 0;

  if (launchUptime) {
    launchUptime.textContent =
      "00:00:00";
  }
};

const startLaunchUptime = () => {
  resetLaunchUptime();

  launchUptimeSeconds = 1;

  if (launchUptime) {
    launchUptime.textContent =
      formatLaunchUptime(
        launchUptimeSeconds
      );
  }

  launchUptimeTimer =
    setInterval(
      () => {
        launchUptimeSeconds += 1;

        if (launchUptime) {
          launchUptime.textContent =
            formatLaunchUptime(
              launchUptimeSeconds
            );
        }
      },
      1000
    );
};

  const positionLaunchCard = () => {
    const map =
      launchStage.closest(
        ".services-project-map"
      );

    if (!map) return;

    const mapRect =
      map.getBoundingClientRect();

    const stageRect =
      launchStage
        .getBoundingClientRect();

    const cardWidth =
      launchCard.offsetWidth ||
      455;

    const cardHeight =
      launchCard.offsetHeight ||
      350;

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
          50,
          (
            mapRect.height -
            cardHeight
          ) / 2
        );

      launchCard.style.left =
        `${left}px`;

      launchCard.style.top =
        `${top}px`;

      launchCard.style.setProperty(
        "--launch-origin-x",
        "50%"
      );

      launchCard.style.setProperty(
        "--launch-origin-y",
        "0%"
      );

      return;
    }

    const gap = 18;

    let left;
    let top;

    if (
      stageCenterX <
      mapRect.width * 0.5
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

    launchCard.style.left =
      `${left}px`;

    launchCard.style.top =
      `${top}px`;

    launchCard.style.setProperty(
      "--launch-origin-x",
      `${stageCenterX - left}px`
    );

    launchCard.style.setProperty(
      "--launch-origin-y",
      `${stageCenterY - top}px`
    );
  };

  const closePreviousStageCards =
    () => {
      const cards = [
        "project-brief-card",
        "project-analysis-card",
        "project-architecture-card",
        "project-development-card",
        "project-integration-card",
        "project-testing-card"
      ];

      cards.forEach(
        id => {
          const card =
            document.getElementById(
              id
            );

          if (!card) return;

          card.classList.remove(
            "is-open"
          );

          card.setAttribute(
            "aria-hidden",
            "true"
          );
        }
      );

      for (
        let stageNumber = 1;
        stageNumber <= 6;
        stageNumber++
      ) {
        const stage =
          document.querySelector(
            `.project-stage-${stageNumber}`
          );

        if (!stage) continue;

        stage.setAttribute(
          "aria-expanded",
          "false"
        );
      }
    };

  const openLaunchCard = () => {
    closePreviousStageCards();

    positionLaunchCard();

    launchCard.classList.add(
      "is-open"
    );

    launchCard.setAttribute(
      "aria-hidden",
      "false"
    );

    launchStage.setAttribute(
      "aria-expanded",
      "true"
    );
    startLaunchUptime();
  };

  const closeLaunchCard = () => {
    launchCard.classList.remove(
      "is-open"
    );

    launchCard.setAttribute(
      "aria-hidden",
      "true"
    );

    launchStage.setAttribute(
      "aria-expanded",
      "false"
    );
    resetLaunchUptime();
  };

  launchStage.addEventListener(
    "pointerdown",
    event => {
      launchStartX =
        event.clientX;

      launchStartY =
        event.clientY;

      launchWasDragged = false;
    }
  );

  launchStage.addEventListener(
    "pointermove",
    event => {
      const distanceX =
        Math.abs(
          event.clientX -
          launchStartX
        );

      const distanceY =
        Math.abs(
          event.clientY -
          launchStartY
        );

      if (
        distanceX > 6 ||
        distanceY > 6
      ) {
        launchWasDragged = true;
      }
    }
  );

  launchStage.addEventListener(
    "click",
    event => {
      if (
        launchWasDragged
      ) {
        launchWasDragged = false;
        return;
      }

      event.stopPropagation();

      if (
        launchCard.classList.contains(
          "is-open"
        )
      ) {
        closeLaunchCard();
      } else {
        openLaunchCard();
      }
    }
  );

  launchClose.addEventListener(
    "click",
    event => {
      event.stopPropagation();

      closeLaunchCard();
    }
  );

  document.addEventListener(
    "keydown",
    event => {
      if (
        event.key === "Escape"
      ) {
        closeLaunchCard();
      }
    }
  );

  window.addEventListener(
    "resize",
    () => {
      if (
        launchCard.classList.contains(
          "is-open"
        )
      ) {
        positionLaunchCard();
      }
    },
    {
      passive: true
    }
  );
}
})();
