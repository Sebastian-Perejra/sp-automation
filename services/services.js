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
  const dataFlowMap =
  document.querySelector(
    ".services-project-map"
  );

if (dataFlowMap) {
  const dataStages =
    Array.from(
      dataFlowMap.querySelectorAll(
        ".project-stage"
      )
    );

  const dataLines =
    Array.from(
      dataFlowMap.querySelectorAll(
        ".project-line"
      )
    );

  const dataCore =
    dataFlowMap.querySelector(
      ".project-core"
    );

  const dataPacket =
    document.createElement(
      "span"
    );

  dataPacket.className =
    "project-data-packet";

  dataFlowMap.appendChild(
    dataPacket
  );

  let dataFlowTimer = null;
  let dataFlowFrame = null;
  let dataFlowBusy = false;

  const getPointInMap = element => {
    const mapRect =
      dataFlowMap.getBoundingClientRect();

    const rect =
      element.getBoundingClientRect();

    return {
      x:
        rect.left -
        mapRect.left +
        rect.width / 2,

      y:
        rect.top -
        mapRect.top +
        rect.height / 2
    };
  };

  const setPacketPosition = point => {
    dataPacket.style.setProperty(
      "--packet-x",
      `${point.x}px`
    );

    dataPacket.style.setProperty(
      "--packet-y",
      `${point.y}px`
    );
  };
  const clearDataState = () => {
    dataPacket.classList.remove(
      "is-moving",
      "is-arriving"
    );

    dataStages.forEach(
      stage => {
        stage.classList.remove(
          "is-data-sending"
        );
      }
    );

    dataLines.forEach(
      line => {
        line.classList.remove(
          "is-data-active"
        );
      }
    );

    if (dataCore) {
      dataCore.classList.remove(
        "is-data-receiving"
      );
    }
  };

  const animatePacket = (
    from,
    to,
    duration = 850
  ) => {
    return new Promise(
      resolve => {
        const start =
          performance.now();

        dataPacket.classList.add(
          "is-moving"
        );

        const animate = now => {
          const progress =
            Math.min(
              1,
              (
                now - start
              ) /
              duration
            );

          const eased =
            1 -
            Math.pow(
              1 - progress,
              3
            );

          const x =
            from.x +
            (
              to.x -
              from.x
            ) *
            eased;

          const y =
            from.y +
            (
              to.y -
              from.y
            ) *
            eased;

          setPacketPosition({
            x,
            y
          });

          if (
            progress <
            1
          ) {
            dataFlowFrame =
              requestAnimationFrame(
                animate
              );

            return;
          }

          dataFlowFrame =
            null;

          dataPacket.classList.add(
            "is-arriving"
          );

          window.setTimeout(
            () => {
              dataPacket.classList.remove(
                "is-arriving"
              );

              resolve();
            },
            140
          );
        };

        setPacketPosition(
          from
        );

        dataFlowFrame =
          requestAnimationFrame(
            animate
          );
      }
    );
  };

  const sendDataToCore =
    async (
      index,
      returnPacket = false
    ) => {
      if (
        dataFlowBusy ||
        !dataStages[index] ||
        !dataLines[index] ||
        !dataCore
      ) {
        return;
      }

      dataFlowBusy = true;

      clearDataState();

      const stage =
        dataStages[index];

      const line =
        dataLines[index];

      stage.classList.add(
        "is-data-sending"
      );

      line.classList.add(
        "is-data-active"
      );

      const stagePoint =
        getPointInMap(
          stage
        );

      const corePoint =
        getPointInMap(
          dataCore
        );

      await animatePacket(
        stagePoint,
        corePoint
      );

      dataCore.classList.add(
        "is-data-receiving"
      );

      await new Promise(
        resolve => {
          window.setTimeout(
            resolve,
            220
          );
        }
      );

      if (returnPacket) {
        await animatePacket(
          corePoint,
          stagePoint,
          700
        );
      }

      await new Promise(
        resolve => {
          window.setTimeout(
            resolve,
            180
          );
        }
      );

      clearDataState();

      dataFlowBusy = false;
    };

  const scheduleRandomDataFlow =
    () => {
      window.clearTimeout(
        dataFlowTimer
      );

      const delay =
        4200 +
        Math.random() *
        2800;

      dataFlowTimer =
        window.setTimeout(
          () => {
            if (
              !dataFlowBusy &&
              !document.hidden
            ) {
              const randomIndex =
                Math.floor(
                  Math.random() *
                  dataStages.length
                );

              sendDataToCore(
                randomIndex,
                false
              );
            }

            scheduleRandomDataFlow();
          },
          delay
        );
    };

  dataStages.forEach(
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

          sendDataToCore(
            index,
            false
          );
        }
      );

      stage.addEventListener(
        "click",
        () => {
          sendDataToCore(
            index,
            true
          );
        }
      );
    }
  );

  document.addEventListener(
    "visibilitychange",
    () => {
      if (
        document.hidden
      ) {
        window.clearTimeout(
          dataFlowTimer
        );

        if (
          dataFlowFrame !==
          null
        ) {
          cancelAnimationFrame(
            dataFlowFrame
          );

          dataFlowFrame = null;
        }

        clearDataState();

        dataFlowBusy = false;

        return;
      }

      scheduleRandomDataFlow();
    }
  );

  scheduleRandomDataFlow();
}
  const bootProjectMap =
  document.querySelector(
    ".services-project-map"
  );

if (bootProjectMap) {
  const bootStages =
    Array.from(
      bootProjectMap.querySelectorAll(
        ".project-stage"
      )
    );

  const bootReducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

  if (!bootReducedMotion) {
    bootProjectMap.classList.add(
      "is-booting"
    );

    window.setTimeout(
      () => {
        bootProjectMap.classList.add(
          "boot-core-on"
        );
      },
      180
    );

    window.setTimeout(
      () => {
        bootProjectMap.classList.add(
          "boot-lines-on"
        );
      },
      520
    );

    bootStages.forEach(
      (stage, index) => {
        window.setTimeout(
          () => {
            stage.classList.add(
              "is-boot-active"
            );

            window.setTimeout(
              () => {
                stage.classList.remove(
                  "is-boot-active"
                );
              },
              300
            );
          },
          850 + index * 170
        );
      }
    );

    const bootFinishDelay =
      850 +
      bootStages.length * 170 +
      420;

    window.setTimeout(
      () => {
        bootProjectMap.classList.remove(
          "is-booting",
          "boot-core-on",
          "boot-lines-on"
        );

        bootProjectMap.classList.add(
          "is-boot-complete"
        );      
      },
      bootFinishDelay
    );
  } else {
    bootProjectMap.classList.add(
      "is-boot-complete"
    );
  }
}
  const ecosystemCore =
  document.querySelector(
    ".ecosystem-core"
  );

const ecosystemFold =
  document.querySelector(
    ".ecosystem-core-fold"
  );

const ecosystemClose =
  document.querySelector(
    ".ecosystem-core-close"
  );

if (
  ecosystemCore &&
  ecosystemFold
) {
  ecosystemFold.addEventListener(
    "click",
    event => {
      event.stopPropagation();

      const isOpen =
        ecosystemCore.classList.toggle(
          "is-open"
        );

      ecosystemFold.setAttribute(
        "aria-expanded",
        String(isOpen)
      );
    }
  );
}

if (
  ecosystemCore &&
  ecosystemClose
) {
  ecosystemClose.addEventListener(
    "click",
    event => {
      event.stopPropagation();

      ecosystemCore.classList.remove(
        "is-open"
      );

      if (ecosystemFold) {
        ecosystemFold.setAttribute(
          "aria-expanded",
          "false"
        );
      }
    }
  );
}
  const ecosystemRealityButton =
  document.querySelector(
    ".ecosystem-life-deeper"
  );

const ecosystemRealityView =
  document.getElementById(
    "ecosystem-reality-view"
  );

const ecosystemRealityClose =
  ecosystemRealityView
    ? ecosystemRealityView.querySelector(
        ".ecosystem-reality-close"
      )
    : null;

const ecosystemRealityBackdrop =
  ecosystemRealityView
    ? ecosystemRealityView.querySelector(
        ".ecosystem-reality-backdrop"
      )
    : null;

const ecosystemRealityImage =
  ecosystemRealityView
    ? ecosystemRealityView.querySelector(
        ".ecosystem-reality-image"
      )
    : null;

if (
  ecosystemRealityButton &&
  ecosystemRealityView &&
  ecosystemRealityClose
) {
  let realityTargetX = 0;
  let realityTargetY = 0;

  let realityCurrentX = 0;
  let realityCurrentY = 0;

  let realityFrame = null;

  const animateRealityImage = () => {
    realityCurrentX +=
      (
        realityTargetX -
        realityCurrentX
      ) *
      0.08;

    realityCurrentY +=
      (
        realityTargetY -
        realityCurrentY
      ) *
      0.08;

    if (ecosystemRealityImage) {
      ecosystemRealityImage.style.setProperty(
        "--reality-x",
        `${realityCurrentX}px`
      );

      ecosystemRealityImage.style.setProperty(
        "--reality-y",
        `${realityCurrentY}px`
      );
    }

    const deltaX =
      Math.abs(
        realityTargetX -
        realityCurrentX
      );

    const deltaY =
      Math.abs(
        realityTargetY -
        realityCurrentY
      );

    if (
      deltaX > 0.03 ||
      deltaY > 0.03
    ) {
      realityFrame =
        requestAnimationFrame(
          animateRealityImage
        );

      return;
    }

    realityFrame = null;
  };

  const startRealityAnimation = () => {
    if (
      realityFrame !== null
    ) {
      return;
    }

    realityFrame =
      requestAnimationFrame(
        animateRealityImage
      );
  };

  const openRealityView = () => {
    ecosystemRealityView.classList.add(
      "is-open"
    );

    ecosystemRealityView.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.style.overflow =
      "hidden";
  };

  const closeRealityView = () => {
    ecosystemRealityView.classList.remove(
      "is-open"
    );

    ecosystemRealityView.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.style.overflow =
      "";

    realityTargetX = 0;
    realityTargetY = 0;

    startRealityAnimation();
  };

  ecosystemRealityButton.addEventListener(
    "click",
    event => {
      event.stopPropagation();

      openRealityView();
    }
  );

  ecosystemRealityClose.addEventListener(
    "click",
    event => {
      event.stopPropagation();

      closeRealityView();
    }
  );

  if (ecosystemRealityBackdrop) {
    ecosystemRealityBackdrop.addEventListener(
      "click",
      closeRealityView
    );
  }

  ecosystemRealityView.addEventListener(
    "pointermove",
    event => {
      if (
        window.innerWidth <= 900
      ) {
        return;
      }

      const rect =
        ecosystemRealityView
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

      realityTargetX =
        normalizedX * 18;

      realityTargetY =
        normalizedY * 12;

      startRealityAnimation();
    },
    {
      passive: true
    }
  );

  ecosystemRealityView.addEventListener(
    "pointerleave",
    () => {
      realityTargetX = 0;
      realityTargetY = 0;

      startRealityAnimation();
    },
    {
      passive: true
    }
  );

  document.addEventListener(
    "keydown",
    event => {
      if (
        event.key === "Escape" &&
        ecosystemRealityView.classList.contains(
          "is-open"
        )
      ) {
        closeRealityView();
      }
    }
  );
}
  const realityDetailHotspots =
  Array.from(
    document.querySelectorAll(
      ".reality-hotspot[data-detail]"
    )
  );

const ecosystemDetailView =
  document.getElementById(
    "ecosystem-detail-view"
  );

const ecosystemDetailImage =
  ecosystemDetailView
    ? ecosystemDetailView.querySelector(
        "[data-detail-image]"
      )
    : null;

const ecosystemDetailClose =
  ecosystemDetailView
    ? ecosystemDetailView.querySelector(
        ".ecosystem-detail-close"
      )
    : null;

const ecosystemDetailBackdrop =
  ecosystemDetailView
    ? ecosystemDetailView.querySelector(
        ".ecosystem-detail-backdrop"
      )
    : null;

const ecosystemDetailTail =
  ecosystemDetailView
    ? ecosystemDetailView.querySelector(
        ".ecosystem-detail-tail"
      )
    : null;

const detailImages = {
  laptop:
    "/services/assets/ecosystem-laptop-dashboard.webp",

  line:
    "/services/assets/ecosystem-glass-line.webp",

  donut:
    "/services/assets/ecosystem-glass-donut.webp",

  bars:
    "/services/assets/ecosystem-glass-bars.webp"
};

if (
  realityDetailHotspots.length &&
  ecosystemDetailView &&
  ecosystemDetailImage &&
  ecosystemDetailClose
) {
  const positionDetailFromHotspot =
    hotspot => {
      const panel =
        ecosystemDetailView.querySelector(
          ".ecosystem-detail-panel"
        );

      if (!panel) return;

      const hotspotRect =
        hotspot.getBoundingClientRect();

      const viewportWidth =
        window.innerWidth;

      const viewportHeight =
        window.innerHeight;

      const panelWidth =
        Math.min(
          610,
          viewportWidth * 0.4
        );

      const panelHeight =
        panelWidth *
        10 /
        16;

      const panelLeft =
        viewportWidth -
        viewportWidth * 0.05 -
        panelWidth;

      const panelTop =
        viewportHeight * 0.16;

      const sourceX =
        hotspotRect.left +
        hotspotRect.width * 0.5;

      const sourceY =
        hotspotRect.top +
        hotspotRect.height * 0.5;

      const startX =
        sourceX -
        panelLeft;

      const startY =
        sourceY -
        (
          panelTop +
          panelHeight
        );

      ecosystemDetailView.style.setProperty(
        "--detail-start-x",
        `${startX}px`
      );

      ecosystemDetailView.style.setProperty(
        "--detail-start-y",
        `${startY}px`
      );

      if (!ecosystemDetailTail) {
        return;
      }

      const sourceX1 =
        hotspotRect.left +
        hotspotRect.width * 0.42;

      const sourceY1 =
        hotspotRect.top +
        hotspotRect.height * 0.44;

      const sourceX2 =
        hotspotRect.left +
        hotspotRect.width * 0.58;

      const sourceY2 =
        hotspotRect.top +
        hotspotRect.height * 0.60;

      const targetX =
        panelLeft;

      const targetY1 =
        panelTop +
        panelHeight * 0.42;

      const targetY2 =
        panelTop +
        panelHeight * 0.58;

      ecosystemDetailView.style.setProperty(
        "--tail-x1",
        `${
          sourceX1 /
          viewportWidth *
          100
        }%`
      );

      ecosystemDetailView.style.setProperty(
        "--tail-y1",
        `${
          sourceY1 /
          viewportHeight *
          100
        }%`
      );

      ecosystemDetailView.style.setProperty(
        "--tail-x2",
        `${
          sourceX2 /
          viewportWidth *
          100
        }%`
      );

      ecosystemDetailView.style.setProperty(
        "--tail-y2",
        `${
          sourceY2 /
          viewportHeight *
          100
        }%`
      );

      ecosystemDetailView.style.setProperty(
        "--tail-panel-x1",
        `${
          targetX /
          viewportWidth *
          100
        }%`
      );

      ecosystemDetailView.style.setProperty(
        "--tail-panel-y1",
        `${
          targetY1 /
          viewportHeight *
          100
        }%`
      );

      ecosystemDetailView.style.setProperty(
        "--tail-panel-x2",
        `${
          targetX /
          viewportWidth *
          100
        }%`
      );

      ecosystemDetailView.style.setProperty(
        "--tail-panel-y2",
        `${
          targetY2 /
          viewportHeight *
          100
        }%`
      );
    };

  const openDetail =
    hotspot => {
      const detailKey =
        hotspot.dataset.detail;

      const imagePath =
        detailImages[
          detailKey
        ];

      if (!imagePath) {
        return;
      }

      positionDetailFromHotspot(
        hotspot
      );

      ecosystemDetailImage.style.backgroundImage =
        `url("${imagePath}")`;

      ecosystemDetailView.classList.add(
        "is-open"
      );

      ecosystemDetailView.setAttribute(
        "aria-hidden",
        "false"
      );
    };

  const closeDetail =
    () => {
      ecosystemDetailView.classList.remove(
        "is-open"
      );

      ecosystemDetailView.setAttribute(
        "aria-hidden",
        "true"
      );
    };

  realityDetailHotspots.forEach(
    hotspot => {
      hotspot.addEventListener(
        "click",
        event => {
          event.stopPropagation();

          openDetail(
            hotspot
          );
        }
      );
    }
  );

  ecosystemDetailClose.addEventListener(
    "click",
    event => {
      event.stopPropagation();

      closeDetail();
    }
  );

  if (ecosystemDetailBackdrop) {
    ecosystemDetailBackdrop.addEventListener(
      "click",
      closeDetail
    );
  }

  document.addEventListener(
    "keydown",
    event => {
      if (
        event.key === "Escape" &&
        ecosystemDetailView.classList.contains(
          "is-open"
        )
      ) {
        closeDetail();
      }
    }
  );
  }
  const diagnosticButtons =
  Array.from(
    document.querySelectorAll(
      "[data-diagnostic-open]"
    )
  );

const diagnosticView =
  document.getElementById(
    "ecosystem-diagnostic"
  );

const diagnosticClose = diagnosticView
  ? diagnosticView.querySelector(
      ".ecosystem-diagnostic-close"
    )
  : null;

const diagnosticBackdrop = diagnosticView
  ? diagnosticView.querySelector(
      ".ecosystem-diagnostic-backdrop"
    )
  : null;

const diagnosticMain = diagnosticView
  ? diagnosticView.querySelector(
      ".ecosystem-diagnostic-main"
    )
  : null;

const diagnosticQuiz = diagnosticView
  ? diagnosticView.querySelector(
      ".ecosystem-quiz"
    )
  : null;

const diagnosticResult = diagnosticView
  ? diagnosticView.querySelector(
      ".ecosystem-quiz-result"
    )
  : null;

const diagnosticStart = diagnosticView
  ? diagnosticView.querySelector(
      ".ecosystem-diagnostic-start"
    )
  : null;

const diagnosticQuizBack = diagnosticView
  ? diagnosticView.querySelector(
      ".ecosystem-quiz-back"
    )
  : null;

const diagnosticSend = diagnosticView
  ? diagnosticView.querySelector(
      ".ecosystem-result-send"
    )
  : null;

const diagnosticRestart = diagnosticView
  ? diagnosticView.querySelector(
      ".ecosystem-result-restart"
    )
  : null;

const servicesLangValue =
  (
    document.documentElement.lang ||
    "uk"
  ).toLowerCase();

const servicesLang =
  servicesLangValue.startsWith("ru")
    ? "ru"
    : servicesLangValue.startsWith("en")
      ? "en"
      : "uk";

const diagnosticDataByLang = {
  uk: {
    powerbi: {
      code: "01",
      title:
        "Power BI та аналітика",

      painTitle:
        "Цифри приходять занадто пізно",

      pain:
        "Звіти збираються вручну з кількох файлів або систем. Дані доводиться копіювати, звіряти та перевіряти, тому керівник отримує потрібні цифри вже після того, як вони були потрібні.",

      solutionTitle:
        "Актуальні показники без ручної збірки",

      solution:
        "Дані підтягуються та оновлюються автоматично. KPI, відхилення, продажі, витрати та інші показники видно в одному місці — без багатогодинної підготовки звіту.",

      time:
        "Менше часу на звіти",

      cost:
        "Менше ручної роботи",

      speed:
        "Швидші управлінські рішення",

      quizTitle:
        "Наскільки вам потрібна автоматична аналітика?",

      questions: [
        {
          text:
            "Скільки часу зазвичай займає підготовка одного регулярного звіту?",

          options: [
            {
              label:
                "До 30 хвилин",
              score: 0
            },
            {
              label:
                "30 хв – 2 години",
              score: 1
            },
            {
              label:
                "2–5 годин",
              score: 2
            },
            {
              label:
                "Понад 5 годин",
              score: 3
            }
          ]
        },
        {
          text:
            "Зі скількох джерел потрібно збирати дані для такого звіту?",

          options: [
            {
              label:
                "Одне джерело",
              score: 0
            },
            {
              label:
                "Два джерела",
              score: 1
            },
            {
              label:
                "3–4 джерела",
              score: 2
            },
            {
              label:
                "5 або більше",
              score: 3
            }
          ]
        },
        {
          text:
            "Наскільки швидко керівник може побачити актуальні цифри?",

          options: [
            {
              label:
                "Вони оновлюються автоматично",
              score: 0
            },
            {
              label:
                "Потрібно зробити кілька дій",
              score: 1
            },
            {
              label:
                "Потрібно вручну оновити звіт",
              score: 2
            },
            {
              label:
                "Потрібно чекати, поки хтось його підготує",
              score: 3
            }
          ]
        }
      ]
    },

    excel: {
      code: "02",
      title:
        "Excel / VBA",

      painTitle:
        "Людина працює як макрос",

      pain:
        "Копіювання рядків, формули, перенесення даних, перевірки та однакові операції повторюються щодня. Чим більше даних — тим більше часу й ризику помилки.",

      solutionTitle:
        "Повторювані операції виконує система",

      solution:
        "Розрахунки, перевірки, формування таблиць і звітів запускаються автоматично. Працівник займається результатом, а не механічним натисканням кнопок.",

      time:
        "Менше повторюваних дій",

      cost:
        "Менше помилок і переробок",

      speed:
        "Швидша обробка даних",

      quizTitle:
        "Скільки ручної Excel-роботи можна прибрати?",

      questions: [
        {
          text:
            "Скільки часу на день йде на повторювані операції в Excel?",

          options: [
            {
              label:
                "До 15 хвилин",
              score: 0
            },
            {
              label:
                "15–30 хвилин",
              score: 1
            },
            {
              label:
                "30–90 хвилин",
              score: 2
            },
            {
              label:
                "Понад 90 хвилин",
              score: 3
            }
          ]
        },
        {
          text:
            "Як часто доводиться копіювати, переносити або перераховувати ті самі дані?",

          options: [
            {
              label:
                "Майже ніколи",
              score: 0
            },
            {
              label:
                "Кілька разів на тиждень",
              score: 1
            },
            {
              label:
                "Щодня",
              score: 2
            },
            {
              label:
                "Багато разів на день",
              score: 3
            }
          ]
        },
        {
          text:
            "Як часто після ручної роботи потрібно додатково перевіряти результат?",

          options: [
            {
              label:
                "Практично ніколи",
              score: 0
            },
            {
              label:
                "Іноді",
              score: 1
            },
            {
              label:
                "Регулярно",
              score: 2
            },
            {
              label:
                "Перевіряємо майже все",
              score: 3
            }
          ]
        }
      ]
    },

    apps: {
      code: "03",
      title:
        "Google Apps Script",

      painTitle:
        "Сервіси є, але між ними працює людина",

      pain:
        "Дані з Forms переносяться в Sheets, файли створюються в Drive, листи відправляються через Gmail, статуси оновлюються вручну. Кожен маленький крок забирає час.",

      solutionTitle:
        "Одна подія запускає весь сценарій",

      solution:
        "Форма, таблиця, Gmail і Drive можуть працювати як один процес. Дані прийшли — система сама перевірила їх, створила файл, надіслала повідомлення та оновила статус.",

      time:
        "Менше переходів між сервісами",

      cost:
        "Менше ручних операцій",

      speed:
        "Процес запускається одразу",

      quizTitle:
        "Чи можна зв’язати ваші Google-процеси?",

      questions: [
        {
          text:
            "Скільки Google-сервісів бере участь у типовому робочому процесі?",

          options: [
            {
              label:
                "Один",
              score: 0
            },
            {
              label:
                "Два",
              score: 1
            },
            {
              label:
                "Три",
              score: 2
            },
            {
              label:
                "Чотири або більше",
              score: 3
            }
          ]
        },
        {
          text:
            "Як часто людина вручну запускає наступний крок після отримання даних?",

          options: [
            {
              label:
                "Майже ніколи",
              score: 0
            },
            {
              label:
                "Кілька разів на тиждень",
              score: 1
            },
            {
              label:
                "Щодня",
              score: 2
            },
            {
              label:
                "Багато разів на день",
              score: 3
            }
          ]
        },
        {
          text:
            "Що станеться, якщо відповідальний працівник не виконає цей крок вчасно?",

          options: [
            {
              label:
                "Нічого критичного",
              score: 0
            },
            {
              label:
                "Буде невелика затримка",
              score: 1
            },
            {
              label:
                "Зупиниться частина процесу",
              score: 2
            },
            {
              label:
                "Інші люди чекатимуть результат",
              score: 3
            }
          ]
        }
      ]
    },

    integration: {
      code: "04",
      title:
        "Інтеграції та API",

      painTitle:
        "Системи не розмовляють між собою",

      pain:
        "CRM, ERP, сайт, таблиці, Telegram та інші сервіси містять потрібні дані, але інформацію між ними переносить людина. Це створює затримки, дублікати й різні версії одних цифр.",

      solutionTitle:
        "Дані переходять між системами автоматично",

      solution:
        "API та інтеграції передають інформацію без ручного копіювання. Зміна в одній системі може автоматично запускати потрібну дію в іншій.",

      time:
        "Менше ручного перенесення",

      cost:
        "Менше дублювання роботи",

      speed:
        "Швидший обмін інформацією",

      quizTitle:
        "Наскільки ваші системи ізольовані?",

      questions: [
        {
          text:
            "Скільки різних систем використовується в одному бізнес-процесі?",

          options: [
            {
              label:
                "Одна",
              score: 0
            },
            {
              label:
                "Дві",
              score: 1
            },
            {
              label:
                "3–4",
              score: 2
            },
            {
              label:
                "5 або більше",
              score: 3
            }
          ]
        },
        {
          text:
            "Як часто дані вручну переносять з однієї системи в іншу?",

          options: [
            {
              label:
                "Практично ніколи",
              score: 0
            },
            {
              label:
                "Кілька разів на тиждень",
              score: 1
            },
            {
              label:
                "Щодня",
              score: 2
            },
            {
              label:
                "Постійно протягом дня",
              score: 3
            }
          ]
        },
        {
          text:
            "Чи виникає ситуація, коли в різних системах знаходяться різні версії одних даних?",

          options: [
            {
              label:
                "Ні",
              score: 0
            },
            {
              label:
                "Дуже рідко",
              score: 1
            },
            {
              label:
                "Регулярно",
              score: 2
            },
            {
              label:
                "Це постійна проблема",
              score: 3
            }
          ]
        }
      ]
    },

    process: {
      code: "05",
      title:
        "Оптимізація процесів",

      painTitle:
        "Процес довший, ніж сама робота",

      pain:
        "Зайві погодження, повторне введення інформації, очікування між етапами та дії «тому що так заведено» збільшують тривалість процесу й собівартість операції.",

      solutionTitle:
        "Менше кроків — швидший результат",

      solution:
        "Процес розкладається на етапи. Непотрібні дії прибираються, повторювані автоматизуються, а передача інформації між людьми та системами прискорюється.",

      time:
        "Коротший робочий цикл",

      cost:
        "Менше непотрібних операцій",

      speed:
        "Менше очікування між етапами",

      quizTitle:
        "Де ваш процес втрачає час?",

      questions: [
        {
          text:
            "Скільки основних кроків проходить типова задача від початку до результату?",

          options: [
            {
              label:
                "1–3",
              score: 0
            },
            {
              label:
                "4–5",
              score: 1
            },
            {
              label:
                "6–8",
              score: 2
            },
            {
              label:
                "9 або більше",
              score: 3
            }
          ]
        },
        {
          text:
            "Скільки разів інформацію потрібно погодити або передати іншій людині?",

          options: [
            {
              label:
                "Жодного або один раз",
              score: 0
            },
            {
              label:
                "Два рази",
              score: 1
            },
            {
              label:
                "3–4 рази",
              score: 2
            },
            {
              label:
                "5 або більше",
              score: 3
            }
          ]
        },
        {
          text:
            "Що забирає найбільше часу?",

          options: [
            {
              label:
                "Безпосередньо сама робота",
              score: 0
            },
            {
              label:
                "Періодичне очікування",
              score: 1
            },
            {
              label:
                "Передача та перевірка інформації",
              score: 2
            },
            {
              label:
                "Очікування, погодження й ручні дії",
              score: 3
            }
          ]
        }
      ]
    },

    data: {
      code: "06",
      title:
        "Підготовка даних",

      painTitle:
        "Перед аналізом дані спочатку треба привести до ладу",

      pain:
        "Різні формати, дублікати, порожні поля, неправильні назви та дані з кількох джерел змушують витрачати час на очистку ще до того, як починається сам аналіз.",

      solutionTitle:
        "Чисті дані готуються автоматично",

      solution:
        "Дані очищуються, нормалізуються, перевіряються та об’єднуються за визначеними правилами. Аналітик або керівник отримує готову основу для звіту та прийняття рішення.",

      time:
        "Менше часу на очистку",

      cost:
        "Менше повторних перевірок",

      speed:
        "Швидше від даних до рішення",

      quizTitle:
        "Скільки часу забирає підготовка даних?",

      questions: [
        {
          text:
            "Скільки часу зазвичай потрібно, щоб підготувати дані перед аналізом?",

          options: [
            {
              label:
                "До 15 хвилин",
              score: 0
            },
            {
              label:
                "15–60 хвилин",
              score: 1
            },
            {
              label:
                "1–3 години",
              score: 2
            },
            {
              label:
                "Понад 3 години",
              score: 3
            }
          ]
        },
        {
          text:
            "Зі скількох джерел або форматів надходять дані?",

          options: [
            {
              label:
                "Одне джерело",
              score: 0
            },
            {
              label:
                "Два",
              score: 1
            },
            {
              label:
                "3–4",
              score: 2
            },
            {
              label:
                "5 або більше",
              score: 3
            }
          ]
        },
        {
          text:
            "Як часто якість даних затримує звіт або прийняття рішення?",

          options: [
            {
              label:
                "Практично ніколи",
              score: 0
            },
            {
              label:
                "Іноді",
              score: 1
            },
            {
              label:
                "Регулярно",
              score: 2
            },
            {
              label:
                "Це одна з головних проблем",
              score: 3
            }
          ]
        }
      ]
    }
  },

  ru: {
    powerbi: {
      code: "01",
      title:
        "Power BI и аналитика",

      painTitle:
        "Цифры приходят слишком поздно",

      pain:
        "Отчёты собираются вручную из нескольких файлов или систем. Данные приходится копировать, сверять и проверять, поэтому руководитель получает нужные цифры уже после того, как они были нужны.",

      solutionTitle:
        "Актуальные показатели без ручной сборки",

      solution:
        "Данные загружаются и обновляются автоматически. KPI, отклонения, продажи, расходы и другие показатели видны в одном месте — без многочасовой подготовки отчёта.",

      time:
        "Меньше времени на отчёты",

      cost:
        "Меньше ручной работы",

      speed:
        "Быстрее управленческие решения",

      quizTitle:
        "Насколько вам нужна автоматическая аналитика?",

      questions: [
        {
          text:
            "Сколько времени обычно занимает подготовка одного регулярного отчёта?",

          options: [
            {
              label:
                "До 30 минут",
              score: 0
            },
            {
              label:
                "30 минут – 2 часа",
              score: 1
            },
            {
              label:
                "2–5 часов",
              score: 2
            },
            {
              label:
                "Более 5 часов",
              score: 3
            }
          ]
        },
        {
          text:
            "Из скольких источников нужно собирать данные для такого отчёта?",

          options: [
            {
              label:
                "Один источник",
              score: 0
            },
            {
              label:
                "Два источника",
              score: 1
            },
            {
              label:
                "3–4 источника",
              score: 2
            },
            {
              label:
                "5 или больше",
              score: 3
            }
          ]
        },
        {
          text:
            "Насколько быстро руководитель может увидеть актуальные цифры?",

          options: [
            {
              label:
                "Они обновляются автоматически",
              score: 0
            },
            {
              label:
                "Нужно выполнить несколько действий",
              score: 1
            },
            {
              label:
                "Нужно вручную обновить отчёт",
              score: 2
            },
            {
              label:
                "Нужно ждать, пока кто-то его подготовит",
              score: 3
            }
          ]
        }
      ]
    },

    excel: {
      code: "02",
      title:
        "Excel / VBA",

      painTitle:
        "Человек работает как макрос",

      pain:
        "Копирование строк, формулы, перенос данных, проверки и одинаковые операции повторяются каждый день. Чем больше данных — тем больше времени и выше риск ошибки.",

      solutionTitle:
        "Повторяющиеся операции выполняет система",

      solution:
        "Расчёты, проверки, формирование таблиц и отчётов запускаются автоматически. Сотрудник занимается результатом, а не механическим нажатием кнопок.",

      time:
        "Меньше повторяющихся действий",

      cost:
        "Меньше ошибок и переделок",

      speed:
        "Быстрее обработка данных",

      quizTitle:
        "Сколько ручной Excel-работы можно убрать?",

      questions: [
        {
          text:
            "Сколько времени в день уходит на повторяющиеся операции в Excel?",

          options: [
            {
              label:
                "До 15 минут",
              score: 0
            },
            {
              label:
                "15–30 минут",
              score: 1
            },
            {
              label:
                "30–90 минут",
              score: 2
            },
            {
              label:
                "Более 90 минут",
              score: 3
            }
          ]
        },
        {
          text:
            "Как часто приходится копировать, переносить или пересчитывать одни и те же данные?",

          options: [
            {
              label:
                "Почти никогда",
              score: 0
            },
            {
              label:
                "Несколько раз в неделю",
              score: 1
            },
            {
              label:
                "Каждый день",
              score: 2
            },
            {
              label:
                "Много раз в день",
              score: 3
            }
          ]
        },
        {
          text:
            "Как часто после ручной работы нужно дополнительно проверять результат?",

          options: [
            {
              label:
                "Практически никогда",
              score: 0
            },
            {
              label:
                "Иногда",
              score: 1
            },
            {
              label:
                "Регулярно",
              score: 2
            },
            {
              label:
                "Проверяем почти всё",
              score: 3
            }
          ]
        }
      ]
    },

    apps: {
      code: "03",
      title:
        "Google Apps Script",

      painTitle:
        "Сервисы есть, но связующим звеном остаётся человек",

      pain:
        "Данные из Forms переносятся в Sheets, файлы создаются в Drive, письма отправляются через Gmail, статусы обновляются вручную. Каждый небольшой шаг отнимает время.",

      solutionTitle:
        "Одно событие запускает весь сценарий",

      solution:
        "Форма, таблица, Gmail и Drive могут работать как единый процесс. Данные поступили — система сама проверила их, создала файл, отправила уведомление и обновила статус.",

      time:
        "Меньше переходов между сервисами",

      cost:
        "Меньше ручных операций",

      speed:
        "Процесс запускается сразу",

      quizTitle:
        "Можно ли связать ваши Google-процессы?",

      questions: [
        {
          text:
            "Сколько Google-сервисов участвует в типичном рабочем процессе?",

          options: [
            {
              label:
                "Один",
              score: 0
            },
            {
              label:
                "Два",
              score: 1
            },
            {
              label:
                "Три",
              score: 2
            },
            {
              label:
                "Четыре или больше",
              score: 3
            }
          ]
        },
        {
          text:
            "Как часто человек вручную запускает следующий шаг после получения данных?",

          options: [
            {
              label:
                "Почти никогда",
              score: 0
            },
            {
              label:
                "Несколько раз в неделю",
              score: 1
            },
            {
              label:
                "Каждый день",
              score: 2
            },
            {
              label:
                "Много раз в день",
              score: 3
            }
          ]
        },
        {
          text:
            "Что произойдёт, если ответственный сотрудник не выполнит этот шаг вовремя?",

          options: [
            {
              label:
                "Ничего критичного",
              score: 0
            },
            {
              label:
                "Будет небольшая задержка",
              score: 1
            },
            {
              label:
                "Остановится часть процесса",
              score: 2
            },
            {
              label:
                "Другие люди будут ждать результат",
              score: 3
            }
          ]
        }
      ]
    },

    integration: {
      code: "04",
      title:
        "Интеграции и API",

      painTitle:
        "Системы не разговаривают друг с другом",

      pain:
        "CRM, ERP, сайт, таблицы, Telegram и другие сервисы содержат нужные данные, но информацию между ними переносит человек. Это создаёт задержки, дубли и разные версии одних и тех же цифр.",

      solutionTitle:
        "Данные переходят между системами автоматически",

      solution:
        "API и интеграции передают информацию без ручного копирования. Изменение в одной системе может автоматически запускать нужное действие в другой.",

      time:
        "Меньше ручного переноса",

      cost:
        "Меньше дублирования работы",

      speed:
        "Быстрее обмен информацией",

      quizTitle:
        "Насколько изолированы ваши системы?",

      questions: [
        {
          text:
            "Сколько разных систем используется в одном бизнес-процессе?",

          options: [
            {
              label:
                "Одна",
              score: 0
            },
            {
              label:
                "Две",
              score: 1
            },
            {
              label:
                "3–4",
              score: 2
            },
            {
              label:
                "5 или больше",
              score: 3
            }
          ]
        },
        {
          text:
            "Как часто данные вручную переносят из одной системы в другую?",

          options: [
            {
              label:
                "Практически никогда",
              score: 0
            },
            {
              label:
                "Несколько раз в неделю",
              score: 1
            },
            {
              label:
                "Каждый день",
              score: 2
            },
            {
              label:
                "Постоянно в течение дня",
              score: 3
            }
          ]
        },
        {
          text:
            "Бывает ли, что в разных системах хранятся разные версии одних и тех же данных?",

          options: [
            {
              label:
                "Нет",
              score: 0
            },
            {
              label:
                "Очень редко",
              score: 1
            },
            {
              label:
                "Регулярно",
              score: 2
            },
            {
              label:
                "Это постоянная проблема",
              score: 3
            }
          ]
        }
      ]
    },

    process: {
      code: "05",
      title:
        "Оптимизация процессов",

      painTitle:
        "Процесс занимает больше времени, чем сама работа",

      pain:
        "Лишние согласования, повторный ввод информации, ожидание между этапами и действия «потому что так всегда делали» увеличивают длительность процесса и стоимость операции.",

      solutionTitle:
        "Меньше шагов — быстрее результат",

      solution:
        "Процесс разбирается по этапам. Ненужные действия убираются, повторяющиеся автоматизируются, а передача информации между людьми и системами ускоряется.",

      time:
        "Короче рабочий цикл",

      cost:
        "Меньше лишних операций",

      speed:
        "Меньше ожидания между этапами",

      quizTitle:
        "Где ваш процесс теряет время?",

      questions: [
        {
          text:
            "Сколько основных шагов проходит типичная задача от начала до результата?",

          options: [
            {
              label:
                "1–3",
              score: 0
            },
            {
              label:
                "4–5",
              score: 1
            },
            {
              label:
                "6–8",
              score: 2
            },
            {
              label:
                "9 или больше",
              score: 3
            }
          ]
        },
        {
          text:
            "Сколько раз информацию нужно согласовать или передать другому человеку?",

          options: [
            {
              label:
                "Ни разу или один раз",
              score: 0
            },
            {
              label:
                "Два раза",
              score: 1
            },
            {
              label:
                "3–4 раза",
              score: 2
            },
            {
              label:
                "5 или больше",
              score: 3
            }
          ]
        },
        {
          text:
            "Что отнимает больше всего времени?",

          options: [
            {
              label:
                "Непосредственно сама работа",
              score: 0
            },
            {
              label:
                "Периодическое ожидание",
              score: 1
            },
            {
              label:
                "Передача и проверка информации",
              score: 2
            },
            {
              label:
                "Ожидание, согласования и ручные действия",
              score: 3
            }
          ]
        }
      ]
    },

    data: {
      code: "06",
      title:
        "Подготовка данных",

      painTitle:
        "Перед анализом данные сначала приходится приводить в порядок",

      pain:
        "Разные форматы, дубли, пустые поля, неправильные названия и данные из нескольких источников заставляют тратить время на очистку ещё до начала самого анализа.",

      solutionTitle:
        "Чистые данные готовятся автоматически",

      solution:
        "Данные очищаются, нормализуются, проверяются и объединяются по заданным правилам. Аналитик или руководитель получает готовую основу для отчёта и принятия решения.",

      time:
        "Меньше времени на очистку",

      cost:
        "Меньше повторных проверок",

      speed:
        "Быстрее от данных к решению",

      quizTitle:
        "Сколько времени отнимает подготовка данных?",

      questions: [
        {
          text:
            "Сколько времени обычно нужно, чтобы подготовить данные перед анализом?",

          options: [
            {
              label:
                "До 15 минут",
              score: 0
            },
            {
              label:
                "15–60 минут",
              score: 1
            },
            {
              label:
                "1–3 часа",
              score: 2
            },
            {
              label:
                "Более 3 часов",
              score: 3
            }
          ]
        },
        {
          text:
            "Из скольких источников или форматов поступают данные?",

          options: [
            {
              label:
                "Один источник",
              score: 0
            },
            {
              label:
                "Два",
              score: 1
            },
            {
              label:
                "3–4",
              score: 2
            },
            {
              label:
                "5 или больше",
              score: 3
            }
          ]
        },
        {
          text:
            "Как часто качество данных задерживает отчёт или принятие решения?",

          options: [
            {
              label:
                "Практически никогда",
              score: 0
            },
            {
              label:
                "Иногда",
              score: 1
            },
            {
              label:
                "Регулярно",
              score: 2
            },
            {
              label:
                "Это одна из главных проблем",
              score: 3
            }
          ]
        }
      ]
    }
  },

  en: {
    powerbi: {
      code: "01",
      title:
        "Power BI & Analytics",

      painTitle:
        "The numbers arrive after the decision is already due",

      pain:
        "Reports are stitched together by hand from multiple files or systems. Someone has to copy, reconcile, and double-check the numbers, so leadership gets the answer later than it should.",

      solutionTitle:
        "Decision-ready reporting without the manual prep",

      solution:
        "Data refreshes automatically. KPIs, variances, sales, costs, and other key metrics stay in one place, so managers can see what is happening without waiting hours for a report to be rebuilt.",

      time:
        "Less time building reports",

      cost:
        "Less manual work",

      speed:
        "Faster management decisions",

      quizTitle:
        "How much would automated reporting help your team?",

      questions: [
        {
          text:
            "How long does it usually take to prepare one recurring report?",

          options: [
            {
              label:
                "Under 30 minutes",
              score: 0
            },
            {
              label:
                "30 minutes to 2 hours",
              score: 1
            },
            {
              label:
                "2–5 hours",
              score: 2
            },
            {
              label:
                "More than 5 hours",
              score: 3
            }
          ]
        },
        {
          text:
            "How many data sources feed that report?",

          options: [
            {
              label:
                "One source",
              score: 0
            },
            {
              label:
                "Two sources",
              score: 1
            },
            {
              label:
                "3–4 sources",
              score: 2
            },
            {
              label:
                "5 or more",
              score: 3
            }
          ]
        },
        {
          text:
            "How quickly can a manager see current numbers?",

          options: [
            {
              label:
                "They update automatically",
              score: 0
            },
            {
              label:
                "A few manual steps are required",
              score: 1
            },
            {
              label:
                "Someone has to refresh the report",
              score: 2
            },
            {
              label:
                "They have to wait for someone to build it",
              score: 3
            }
          ]
        }
      ]
    },

    excel: {
      code: "02",
      title:
        "Excel / VBA",

      painTitle:
        "Your team is doing work the spreadsheet should be doing",

      pain:
        "Copying rows, rebuilding formulas, moving data, checking totals, and repeating the same steps every day burns time and makes mistakes more likely as volume grows.",

      solutionTitle:
        "Let the workbook handle the repetitive work",

      solution:
        "Calculations, checks, table updates, and report generation can run automatically. Your team spends time on the result instead of repeating the same clicks and copy-paste routine.",

      time:
        "Fewer repetitive steps",

      cost:
        "Fewer errors and rework",

      speed:
        "Faster data processing",

      quizTitle:
        "How much manual Excel work could you eliminate?",

      questions: [
        {
          text:
            "How much time does your team spend on repetitive Excel work each day?",

          options: [
            {
              label:
                "Under 15 minutes",
              score: 0
            },
            {
              label:
                "15–30 minutes",
              score: 1
            },
            {
              label:
                "30–90 minutes",
              score: 2
            },
            {
              label:
                "More than 90 minutes",
              score: 3
            }
          ]
        },
        {
          text:
            "How often are the same numbers copied, moved, or recalculated?",

          options: [
            {
              label:
                "Almost never",
              score: 0
            },
            {
              label:
                "A few times a week",
              score: 1
            },
            {
              label:
                "Every day",
              score: 2
            },
            {
              label:
                "Many times a day",
              score: 3
            }
          ]
        },
        {
          text:
            "How often does someone have to double-check the result after the manual work is done?",

          options: [
            {
              label:
                "Almost never",
              score: 0
            },
            {
              label:
                "Sometimes",
              score: 1
            },
            {
              label:
                "Regularly",
              score: 2
            },
            {
              label:
                "We double-check almost everything",
              score: 3
            }
          ]
        }
      ]
    },

    apps: {
      code: "03",
      title:
        "Google Apps Script",

      painTitle:
        "Your Google tools work — but a person is still the connector",

      pain:
        "Forms data gets moved into Sheets, files are created in Drive, emails are sent through Gmail, and statuses are updated by hand. None of those steps is huge, but together they eat up hours.",

      solutionTitle:
        "One event can trigger the entire workflow",

      solution:
        "Forms, Sheets, Gmail, and Drive can operate as one process. New data comes in and the system can validate it, create a file, send a message, and update the status automatically.",

      time:
        "Fewer app-to-app handoffs",

      cost:
        "Less manual administration",

      speed:
        "Work starts immediately",

      quizTitle:
        "How connected are your Google workflows?",

      questions: [
        {
          text:
            "How many Google tools are involved in a typical workflow?",

          options: [
            {
              label:
                "One",
              score: 0
            },
            {
              label:
                "Two",
              score: 1
            },
            {
              label:
                "Three",
              score: 2
            },
            {
              label:
                "Four or more",
              score: 3
            }
          ]
        },
        {
          text:
            "How often does someone manually start the next step after new data comes in?",

          options: [
            {
              label:
                "Almost never",
              score: 0
            },
            {
              label:
                "A few times a week",
              score: 1
            },
            {
              label:
                "Every day",
              score: 2
            },
            {
              label:
                "Many times a day",
              score: 3
            }
          ]
        },
        {
          text:
            "What happens if that manual step is not completed on time?",

          options: [
            {
              label:
                "Nothing important",
              score: 0
            },
            {
              label:
                "There is a small delay",
              score: 1
            },
            {
              label:
                "Part of the process stops",
              score: 2
            },
            {
              label:
                "Other people are stuck waiting",
              score: 3
            }
          ]
        }
      ]
    },

    integration: {
      code: "04",
      title:
        "Integrations & APIs",

      painTitle:
        "Your systems do not talk to each other",

      pain:
        "Your CRM, ERP, website, spreadsheets, Telegram, and other tools all hold useful information, but people are still moving that information between systems by hand. That creates delays, duplicates, and conflicting versions of the truth.",

      solutionTitle:
        "Move data between systems automatically",

      solution:
        "APIs and integrations transfer information without copy-paste work. A change in one system can automatically trigger the right action in another, keeping the workflow moving and the data aligned.",

      time:
        "Less manual data transfer",

      cost:
        "Less duplicated work",

      speed:
        "Faster information flow",

      quizTitle:
        "How disconnected are your systems?",

      questions: [
        {
          text:
            "How many different systems are involved in one business process?",

          options: [
            {
              label:
                "One",
              score: 0
            },
            {
              label:
                "Two",
              score: 1
            },
            {
              label:
                "3–4",
              score: 2
            },
            {
              label:
                "5 or more",
              score: 3
            }
          ]
        },
        {
          text:
            "How often does someone manually move data from one system to another?",

          options: [
            {
              label:
                "Almost never",
              score: 0
            },
            {
              label:
                "A few times a week",
              score: 1
            },
            {
              label:
                "Every day",
              score: 2
            },
            {
              label:
                "Throughout the day",
              score: 3
            }
          ]
        },
        {
          text:
            "Do different systems ever show different versions of the same information?",

          options: [
            {
              label:
                "No",
              score: 0
            },
            {
              label:
                "Very rarely",
              score: 1
            },
            {
              label:
                "Regularly",
              score: 2
            },
            {
              label:
                "It is a constant problem",
              score: 3
            }
          ]
        }
      ]
    },

    process: {
      code: "05",
      title:
        "Process Optimization",

      painTitle:
        "The process takes longer than the actual work",

      pain:
        "Extra approvals, duplicate data entry, waiting between steps, and tasks that exist only because “that’s how we’ve always done it” increase cycle time and operating cost.",

      solutionTitle:
        "Fewer steps. Faster outcomes.",

      solution:
        "The workflow is broken down step by step. Unnecessary work is removed, repetitive work is automated, and handoffs between people and systems are tightened up so the process moves faster.",

      time:
        "Shorter cycle time",

      cost:
        "Fewer unnecessary steps",

      speed:
        "Less waiting between stages",

      quizTitle:
        "Where is your process losing time?",

      questions: [
        {
          text:
            "How many major steps does a typical task go through from start to finish?",

          options: [
            {
              label:
                "1–3",
              score: 0
            },
            {
              label:
                "4–5",
              score: 1
            },
            {
              label:
                "6–8",
              score: 2
            },
            {
              label:
                "9 or more",
              score: 3
            }
          ]
        },
        {
          text:
            "How many times does information need approval or a handoff to another person?",

          options: [
            {
              label:
                "Zero or once",
              score: 0
            },
            {
              label:
                "Twice",
              score: 1
            },
            {
              label:
                "3–4 times",
              score: 2
            },
            {
              label:
                "5 or more times",
              score: 3
            }
          ]
        },
        {
          text:
            "What takes the most time in the process?",

          options: [
            {
              label:
                "The actual work itself",
              score: 0
            },
            {
              label:
                "Occasional waiting",
              score: 1
            },
            {
              label:
                "Handoffs and data checks",
              score: 2
            },
            {
              label:
                "Waiting, approvals, and manual steps",
              score: 3
            }
          ]
        }
      ]
    },

    data: {
      code: "06",
      title:
        "Data Preparation",

      painTitle:
        "Your team has to fix the data before it can use it",

      pain:
        "Different formats, duplicates, missing values, inconsistent names, and data from multiple sources force people to clean things up before the analysis can even begin.",

      solutionTitle:
        "Clean, analysis-ready data automatically",

      solution:
        "Data can be cleaned, standardized, validated, and combined using consistent rules. Analysts and managers get a reliable dataset that is ready for reporting and decision-making.",

      time:
        "Less time cleaning data",

      cost:
        "Fewer repeat checks",

      speed:
        "Faster path from data to decision",

      quizTitle:
        "How much time does data preparation cost you?",

      questions: [
        {
          text:
            "How long does it usually take to prepare data before analysis?",

          options: [
            {
              label:
                "Under 15 minutes",
              score: 0
            },
            {
              label:
                "15–60 minutes",
              score: 1
            },
            {
              label:
                "1–3 hours",
              score: 2
            },
            {
              label:
                "More than 3 hours",
              score: 3
            }
          ]
        },
        {
          text:
            "How many sources or formats does the data come from?",

          options: [
            {
              label:
                "One source",
              score: 0
            },
            {
              label:
                "Two",
              score: 1
            },
            {
              label:
                "3–4",
              score: 2
            },
            {
              label:
                "5 or more",
              score: 3
            }
          ]
        },
        {
          text:
            "How often does poor data quality delay a report or business decision?",

          options: [
            {
              label:
                "Almost never",
              score: 0
            },
            {
              label:
                "Sometimes",
              score: 1
            },
            {
              label:
                "Regularly",
              score: 2
            },
            {
              label:
                "It is one of our biggest problems",
              score: 3
            }
          ]
        }
      ]
    }
  }
};

const diagnosticUiByLang = {
  uk: {
    pain:
      "БІЛЬ",

    solution:
      "РІШЕННЯ",

    start:
      "Перевірити свій процес",

    question:
      "ПИТАННЯ",

    back:
      "← Назад",

    choose:
      "Оберіть один варіант",

    potential:
      "ПОТЕНЦІАЛ",

    time:
      "ЧАС",

    effect:
      "ЕФЕКТ",

    summary:
      "ЩО МИ ПОБАЧИЛИ",

    send:
      "Надіслати результат Себастьяну",

    restart:
      "Пройти ще раз",

    note:
      "Результат тесту є орієнтовною оцінкою потенціалу автоматизації.",

    lowPotential:
      "Невисокий",

    lowTime:
      "Точкова економія часу",

    lowEffect:
      "Локальне покращення",

    lowTitle:
      "Процес уже досить ефективний",

    lowDescription:
      "Критичної кількості ручної роботи не видно, але окремі операції все одно можна спростити або автоматизувати.",

    mediumPotential:
      "Середній",

    mediumTime:
      "Кілька годин на місяць",

    mediumEffect:
      "Швидший робочий цикл",

    mediumTitle:
      "Є помітний потенціал автоматизації",

    mediumDescription:
      "У процесі є регулярні ручні операції та затримки. Автоматизація окремих етапів може скоротити час обробки й кількість повторної роботи.",

    highPotential:
      "Високий",

    highTime:
      "Економія може вимірюватися годинами",

    highEffect:
      "Швидший процес і рішення",

    highTitle:
      "Тут точно є що автоматизувати",

    highDescription:
      "Ваші відповіді показують значну частку ручної роботи, передачі даних або очікування. Це хороший кандидат для автоматизації та скорочення операційних витрат.",

    summaryDirection:
      "Напрям",

    summaryAnswers:
      "Ваші відповіді",

    summaryPotential:
      "Оцінка потенціалу",

    messageHeader:
      "Міні-діагностика з сайту",

    messageDirection:
      "Напрям",

    messagePotential:
      "Потенціал автоматизації",

    messageResult:
      "Результат",

    messageAnswer:
      "Відповідь",

    contact:
      "contacts.html?from=services-diagnostic"
  },

  ru: {
    pain:
      "БОЛЬ",

    solution:
      "РЕШЕНИЕ",

    start:
      "Проверить свой процесс",

    question:
      "ВОПРОС",

    back:
      "← Назад",

    choose:
      "Выберите один вариант",

    potential:
      "ПОТЕНЦИАЛ",

    time:
      "ВРЕМЯ",

    effect:
      "ЭФФЕКТ",

    summary:
      "ЧТО МЫ УВИДЕЛИ",

    send:
      "Отправить результат Себастьяну",

    restart:
      "Пройти ещё раз",

    note:
      "Результат теста — ориентировочная оценка потенциала автоматизации.",

    lowPotential:
      "Невысокий",

    lowTime:
      "Точечная экономия времени",

    lowEffect:
      "Локальное улучшение",

    lowTitle:
      "Процесс уже достаточно эффективный",

    lowDescription:
      "Критичного объёма ручной работы не видно, но отдельные операции всё равно можно упростить или автоматизировать.",

    mediumPotential:
      "Средний",

    mediumTime:
      "Несколько часов в месяц",

    mediumEffect:
      "Быстрее рабочий цикл",

    mediumTitle:
      "Есть заметный потенциал автоматизации",

    mediumDescription:
      "В процессе есть регулярные ручные операции и задержки. Автоматизация отдельных этапов может сократить время обработки и объём повторной работы.",

    highPotential:
      "Высокий",

    highTime:
      "Экономия может измеряться часами",

    highEffect:
      "Быстрее процесс и решения",

    highTitle:
      "Здесь точно есть что автоматизировать",

    highDescription:
      "Ваши ответы показывают заметную долю ручной работы, передачи данных или ожидания. Это хороший кандидат для автоматизации и снижения операционных затрат.",

    summaryDirection:
      "Направление",

    summaryAnswers:
      "Ваши ответы",

    summaryPotential:
      "Оценка потенциала",

    messageHeader:
      "Мини-диагностика с сайта",

    messageDirection:
      "Направление",

    messagePotential:
      "Потенциал автоматизации",

    messageResult:
      "Результат",

    messageAnswer:
      "Ответ",

    contact:
      "contacts-ru.html?from=services-diagnostic"
  },

  en: {
    pain:
      "PAIN POINT",

    solution:
      "SOLUTION",

    start:
      "Check Your Process",

    question:
      "QUESTION",

    back:
      "← Back",

    choose:
      "Choose one answer",

    potential:
      "POTENTIAL",

    time:
      "TIME",

    effect:
      "IMPACT",

    summary:
      "WHAT WE FOUND",

    send:
      "Send My Results to Sebastian",

    restart:
      "Run It Again",

    note:
      "This quick assessment is an estimate of your automation potential.",

    lowPotential:
      "Low",

    lowTime:
      "Targeted time savings",

    lowEffect:
      "Incremental improvement",

    lowTitle:
      "Your process is already fairly efficient",

    lowDescription:
      "There is no major concentration of manual work, but a few steps may still be worth simplifying or automating.",

    mediumPotential:
      "Medium",

    mediumTime:
      "Several hours per month",

    mediumEffect:
      "Faster cycle time",

    mediumTitle:
      "There is a clear automation opportunity",

    mediumDescription:
      "Your process includes recurring manual steps or delays. Automating selected parts could reduce processing time and cut down on rework.",

    highPotential:
      "High",

    highTime:
      "Potentially hours saved",

    highEffect:
      "Faster work and faster decisions",

    highTitle:
      "This is a strong automation candidate",

    highDescription:
      "Your answers point to a meaningful amount of manual work, data handoffs, or waiting. This is exactly the kind of process where automation can reduce operating effort and speed up decisions.",

    summaryDirection:
      "Area",

    summaryAnswers:
      "Your answers",

    summaryPotential:
      "Automation potential",

    messageHeader:
      "Website automation assessment",

    messageDirection:
      "Area",

    messagePotential:
      "Automation potential",

    messageResult:
      "Score",

    messageAnswer:
      "Answer",

    contact:
      "contacts-en.html?from=services-diagnostic"
  }
};

const diagnosticData =
  diagnosticDataByLang[
    servicesLang
  ];

const diagnosticUi =
  diagnosticUiByLang[
    servicesLang
  ];

const diagnosticState = {
  service: "",
  question: 0,
  answers: [],
  score: 0
};

let diagnosticPreviousOverflow =
  "";

const setDiagnosticText = (
  selector,
  value
) => {
  if (!diagnosticView) {
    return;
  }

  const element =
    diagnosticView.querySelector(
      selector
    );

  if (element) {
    element.textContent =
      value;
  }
};

const applyDiagnosticUiLanguage =
  () => {
    if (!diagnosticView) {
      return;
    }

    const labels =
      diagnosticView.querySelectorAll(
        ".ecosystem-diagnostic-label"
      );

    if (labels[0]) {
      labels[0].textContent =
        diagnosticUi.pain;
    }

    if (labels[1]) {
      labels[1].textContent =
        diagnosticUi.solution;
    }

    if (diagnosticStart) {
      diagnosticStart.innerHTML =
        `${diagnosticUi.start}<span>→</span>`;
    }

    if (diagnosticQuizBack) {
      diagnosticQuizBack.textContent =
        diagnosticUi.back;
    }

    const chooseText =
      diagnosticView.querySelector(
        ".ecosystem-quiz-footer > span"
      );

    if (chooseText) {
      chooseText.textContent =
        diagnosticUi.choose;
    }

    const metricLabels =
      diagnosticView.querySelectorAll(
        ".ecosystem-result-metrics span"
      );

    if (metricLabels[0]) {
      metricLabels[0].textContent =
        diagnosticUi.potential;
    }

    if (metricLabels[1]) {
      metricLabels[1].textContent =
        diagnosticUi.time;
    }

    if (metricLabels[2]) {
      metricLabels[2].textContent =
        diagnosticUi.effect;
    }

    const summaryLabel =
      diagnosticView.querySelector(
        ".ecosystem-result-summary > span"
      );

    if (summaryLabel) {
      summaryLabel.textContent =
        diagnosticUi.summary;
    }

    if (diagnosticSend) {
      diagnosticSend.innerHTML =
        `${diagnosticUi.send}<span>↗</span>`;
    }

    if (diagnosticRestart) {
      diagnosticRestart.textContent =
        diagnosticUi.restart;
    }

    const note =
      diagnosticView.querySelector(
        ".ecosystem-result-note"
      );

    if (note) {
      note.textContent =
        diagnosticUi.note;
    }
  };

const resetDiagnosticScreens =
  () => {
    if (
      !diagnosticMain ||
      !diagnosticQuiz ||
      !diagnosticResult
    ) {
      return;
    }

    diagnosticMain.classList.remove(
      "is-hidden"
    );

    diagnosticQuiz.classList.remove(
      "is-active"
    );

    diagnosticResult.classList.remove(
      "is-active"
    );

    diagnosticQuiz.setAttribute(
      "aria-hidden",
      "true"
    );

    diagnosticResult.setAttribute(
      "aria-hidden",
      "true"
    );
  };

const openDiagnostic =
  service => {
    if (
      !diagnosticView ||
      !diagnosticData[service]
    ) {
      return;
    }

    const data =
      diagnosticData[
        service
      ];

    diagnosticState.service =
      service;

    diagnosticState.question =
      0;

    diagnosticState.answers =
      [];

    diagnosticState.score =
      0;

    applyDiagnosticUiLanguage();

    setDiagnosticText(
      "[data-diagnostic-code]",
      data.code
    );

    setDiagnosticText(
      "[data-diagnostic-title]",
      data.title
    );

    setDiagnosticText(
      "[data-diagnostic-pain-title]",
      data.painTitle
    );

    setDiagnosticText(
      "[data-diagnostic-pain]",
      data.pain
    );

    setDiagnosticText(
      "[data-diagnostic-solution-title]",
      data.solutionTitle
    );

    setDiagnosticText(
      "[data-diagnostic-solution]",
      data.solution
    );

    setDiagnosticText(
      "[data-impact-time]",
      data.time
    );

    setDiagnosticText(
      "[data-impact-cost]",
      data.cost
    );

    setDiagnosticText(
      "[data-impact-speed]",
      data.speed
    );

    setDiagnosticText(
      "[data-quiz-title]",
      data.quizTitle
    );

    resetDiagnosticScreens();

    diagnosticView.classList.add(
      "is-open"
    );

    diagnosticView.setAttribute(
      "aria-hidden",
      "false"
    );

    diagnosticPreviousOverflow =
      document.body.style
        .overflow;

    document.body.style.overflow =
      "hidden";
  };

const closeDiagnostic =
  () => {
    if (!diagnosticView) {
      return;
    }

    diagnosticView.classList.remove(
      "is-open"
    );

    diagnosticView.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.style.overflow =
      diagnosticPreviousOverflow;

    resetDiagnosticScreens();
  };

const renderDiagnosticQuestion =
  () => {
    if (!diagnosticView) {
      return;
    }

    const data =
      diagnosticData[
        diagnosticState.service
      ];

    if (!data) {
      return;
    }

    const question =
      data.questions[
        diagnosticState.question
      ];

    if (!question) {
      return;
    }

    const total =
      data.questions.length;

    const current =
      diagnosticState.question +
      1;

    setDiagnosticText(
      "[data-quiz-question-number]",
      `${diagnosticUi.question} ${String(
        current
      ).padStart(2, "0")}`
    );

    setDiagnosticText(
      "[data-quiz-question]",
      question.text
    );

    setDiagnosticText(
      "[data-quiz-progress]",
      `${current} / ${total}`
    );

    const progressBar =
      diagnosticView.querySelector(
        "[data-quiz-progress-bar]"
      );

    if (progressBar) {
      progressBar.style.width =
        `${
          current /
          total *
          100
        }%`;
    }

    const options =
      diagnosticView.querySelector(
        "[data-quiz-options]"
      );

    if (!options) {
      return;
    }

    options.innerHTML =
      "";

    question.options.forEach(
      (
        option,
        optionIndex
      ) => {
        const button =
          document.createElement(
            "button"
          );

        button.type =
          "button";

        button.className =
          "ecosystem-quiz-option";

        button.textContent =
          option.label;

        const savedAnswer =
          diagnosticState.answers[
            diagnosticState
              .question
          ];

        if (
          savedAnswer &&
          savedAnswer
            .optionIndex ===
            optionIndex
        ) {
          button.classList.add(
            "is-selected"
          );
        }

        button.addEventListener(
          "click",
          () => {
            diagnosticState
              .answers[
                diagnosticState
                  .question
              ] = {
                question:
                  question.text,

                answer:
                  option.label,

                score:
                  option.score,

                optionIndex:
                  optionIndex
              };

            if (
              diagnosticState
                .question <
              total - 1
            ) {
              diagnosticState
                .question +=
                1;

              renderDiagnosticQuestion();
            } else {
              showDiagnosticResult();
            }
          }
        );

        options.appendChild(
          button
        );
      }
    );
  };

const getDiagnosticLevel =
  score => {
    if (score >= 7) {
      return "high";
    }

    if (score >= 4) {
      return "medium";
    }

    return "low";
  };

const showDiagnosticResult =
  () => {
    if (
      !diagnosticMain ||
      !diagnosticQuiz ||
      !diagnosticResult
    ) {
      return;
    }

    const data =
      diagnosticData[
        diagnosticState.service
      ];

    if (!data) {
      return;
    }

    diagnosticState.score =
      diagnosticState.answers.reduce(
        (
          total,
          answer
        ) =>
          total +
          Number(
            answer?.score ||
            0
          ),
        0
      );

    const level =
      getDiagnosticLevel(
        diagnosticState.score
      );

    const prefix =
      level === "high"
        ? "high"
        : level ===
            "medium"
          ? "medium"
          : "low";

    const scoreLabel =
      level.toUpperCase();

    const potential =
      diagnosticUi[
        `${prefix}Potential`
      ];

    const time =
      diagnosticUi[
        `${prefix}Time`
      ];

    const effect =
      diagnosticUi[
        `${prefix}Effect`
      ];

    const title =
      diagnosticUi[
        `${prefix}Title`
      ];

    const description =
      diagnosticUi[
        `${prefix}Description`
      ];

    const answersText =
      diagnosticState.answers
        .map(
          answer =>
            answer.answer
        )
        .join(" · ");

    setDiagnosticText(
      "[data-result-score]",
      scoreLabel
    );

    setDiagnosticText(
      "[data-result-title]",
      title
    );

    setDiagnosticText(
      "[data-result-description]",
      description
    );

    setDiagnosticText(
      "[data-result-potential]",
      potential
    );

    setDiagnosticText(
      "[data-result-time]",
      time
    );

    setDiagnosticText(
      "[data-result-effect]",
      effect
    );

    setDiagnosticText(
      "[data-result-summary]",
      `${diagnosticUi.summaryDirection}: ${data.title}. ${diagnosticUi.summaryAnswers}: ${answersText}. ${diagnosticUi.summaryPotential}: ${potential.toLowerCase()}.`
    );

    diagnosticMain.classList.add(
      "is-hidden"
    );

    diagnosticQuiz.classList.remove(
      "is-active"
    );

    diagnosticQuiz.setAttribute(
      "aria-hidden",
      "true"
    );

    diagnosticResult.classList.add(
      "is-active"
    );

    diagnosticResult.setAttribute(
      "aria-hidden",
      "false"
    );
  };

const startDiagnosticQuiz =
  () => {
    if (
      !diagnosticMain ||
      !diagnosticQuiz ||
      !diagnosticResult
    ) {
      return;
    }

    diagnosticState.question =
      0;

    diagnosticState.answers =
      [];

    diagnosticState.score =
      0;

    diagnosticMain.classList.add(
      "is-hidden"
    );

    diagnosticResult.classList.remove(
      "is-active"
    );

    diagnosticResult.setAttribute(
      "aria-hidden",
      "true"
    );

    diagnosticQuiz.classList.add(
      "is-active"
    );

    diagnosticQuiz.setAttribute(
      "aria-hidden",
      "false"
    );

    renderDiagnosticQuestion();
  };

const restartDiagnosticQuiz =
  () => {
    startDiagnosticQuiz();
  };

const buildDiagnosticMessage =
  () => {
    const data =
      diagnosticData[
        diagnosticState.service
      ];

    if (!data) {
      return "";
    }

    const level =
      getDiagnosticLevel(
        diagnosticState.score
      );

    const prefix =
      level === "high"
        ? "high"
        : level ===
            "medium"
          ? "medium"
          : "low";

    const levelText =
      diagnosticUi[
        `${prefix}Potential`
      ];

    const lines = [
      diagnosticUi
        .messageHeader,

      "",

      `${diagnosticUi.messageDirection}: ${data.title}`,

      `${diagnosticUi.messagePotential}: ${levelText}`,

      `${diagnosticUi.messageResult}: ${diagnosticState.score} / 9`,

      ""
    ];

    diagnosticState.answers.forEach(
      (
        answer,
        index
      ) => {
        lines.push(
          `${index + 1}. ${answer.question}`
        );

        lines.push(
          `${diagnosticUi.messageAnswer}: ${answer.answer}`
        );

        lines.push(
          ""
        );
      }
    );

    return lines.join(
      "\n"
    );
  };

diagnosticButtons.forEach(
  button => {
    button.addEventListener(
      "click",
      event => {
        event.preventDefault();
        event.stopPropagation();

        openDiagnostic(
          button.dataset
            .diagnosticOpen
        );
      }
    );
  }
);

if (diagnosticClose) {
  diagnosticClose.addEventListener(
    "click",
    closeDiagnostic
  );
}

if (diagnosticBackdrop) {
  diagnosticBackdrop.addEventListener(
    "click",
    closeDiagnostic
  );
}

if (diagnosticStart) {
  diagnosticStart.addEventListener(
    "click",
    startDiagnosticQuiz
  );
}

if (diagnosticQuizBack) {
  diagnosticQuizBack.addEventListener(
    "click",
    () => {
      if (
        diagnosticState
          .question >
        0
      ) {
        diagnosticState
          .question -=
          1;

        renderDiagnosticQuestion();

        return;
      }

      diagnosticQuiz.classList.remove(
        "is-active"
      );

      diagnosticQuiz.setAttribute(
        "aria-hidden",
        "true"
      );

      diagnosticMain.classList.remove(
        "is-hidden"
      );
    }
  );
}

if (diagnosticRestart) {
  diagnosticRestart.addEventListener(
    "click",
    restartDiagnosticQuiz
  );
}

if (diagnosticSend) {
  diagnosticSend.addEventListener(
    "click",
    () => {
      const message =
        buildDiagnosticMessage();

      sessionStorage.setItem(
        "servicesDiagnosticMessage",
        message
      );

      sessionStorage.setItem(
        "servicesDiagnosticSource",
        diagnosticState.service
      );

      window.location.href =
        diagnosticUi.contact;
    }
  );
}

document.addEventListener(
  "keydown",
  event => {
    if (
      event.key ===
        "Escape" &&
      diagnosticView &&
      diagnosticView.classList.contains(
        "is-open"
      )
    ) {
      closeDiagnostic();
    }
  }
);
const capabilityButtons =
  Array.from(
    document.querySelectorAll(
      ".services-capabilities [data-capability]"
    )
  );

const capabilityDetail =
  document.getElementById(
    "capability-detail"
  );

const capabilityClose =
  capabilityDetail
    ? capabilityDetail.querySelector(
        ".capability-detail-close"
      )
    : null;

const capabilityTitle =
  capabilityDetail
    ? capabilityDetail.querySelector(
        "[data-capability-title]"
      )
    : null;

const capabilityText =
  capabilityDetail
    ? capabilityDetail.querySelector(
        "[data-capability-text]"
      )
    : null;

const capabilityResult =
  capabilityDetail
    ? capabilityDetail.querySelector(
        "[data-capability-result]"
      )
    : null;

const capabilityKicker =
  capabilityDetail
    ? capabilityDetail.querySelector(
        ".capability-detail-kicker"
      )
    : null;

const capabilityResultLabel =
  capabilityDetail
    ? capabilityDetail.querySelector(
        ".capability-detail-result span"
      )
    : null;

const capabilityLanguageValue =
  (
    document.documentElement.lang ||
    "uk"
  ).toLowerCase();

const capabilityLanguage =
  capabilityLanguageValue.startsWith("ru")
    ? "ru"
    : capabilityLanguageValue.startsWith("en")
      ? "en"
      : "uk";

const capabilityContent = {
  uk: {
    ui: {
      kicker:
        "БІЗНЕС-КОРИСТЬ",

      result:
        "РЕЗУЛЬТАТ",

      close:
        "Закрити"
    },

    telegram: {
      title:
        "Telegram-боти",

      text:
        "Переношу в Telegram ті робочі дії, для яких не потрібна окрема складна система: заявки, повідомлення, нагадування, погодження, статуси та отримання потрібної інформації. Працівник отримує або передає дані прямо там, де вже звик працювати.",

      result:
        "Менше листування та ручних нагадувань. Швидша реакція на події, заявки й зміни."
    },

    webapps: {
      title:
        "Вебзастосунки",

      text:
        "Створюю невеликі робочі системи під конкретний процес: введення даних, пошук, контроль статусів, розрахунки, заявки або внутрішні кабінети. Замість ланцюжка таблиць, файлів і повідомлень користувач отримує один зрозумілий інструмент.",

      result:
        "Менше ручних переходів між файлами та сервісами. Процес стає коротшим, зрозумілішим і контрольованим."
    },

    pwa: {
      title:
        "PWA",

      text:
        "Робочий вебзастосунок можна зробити схожим на звичайний мобільний застосунок: його можна відкрити з іконки на телефоні та використовувати для польової роботи, заявок, перевірок або швидкого доступу до потрібних даних.",

      result:
        "Робочий інструмент завжди під рукою без окремої розробки повноцінного мобільного застосунку."
    },

    documents: {
      title:
        "PDF та документи",

      text:
        "Автоматизую створення документів із уже наявних даних: звітів, актів, заявок, комерційних пропозицій, довідок, PDF-файлів та інших типових документів. Система сама підставляє потрібні значення у визначений шаблон.",

      result:
        "Документи формуються за секунди замість ручного копіювання. Менше помилок, перевірок і повторної роботи."
    },

    drive: {
      title:
        "Google Drive",

      text:
        "Автоматизую роботу з файлами та папками: створення структури, перейменування, переміщення, пошук, сортування, надання доступу та зв'язування файлів із таблицями або іншими процесами.",

      result:
        "Менше часу на пошук і ручне впорядкування файлів. Документи опиняються там, де вони мають бути, автоматично."
    },

    research: {
      title:
        "Дослідження ринку",

      text:
        "Допомагаю перетворити великий обсяг зовнішньої інформації на структуровані дані: зібрати доступну інформацію, привести її до єдиного формату, порівняти варіанти та підготувати основу для аналізу.",

      result:
        "Менше часу на ручний збір і структурування інформації. Швидше отримання даних для порівняння та прийняття рішення."
    },

    custom: {
      title:
        "Індивідуальна логіка",

      text:
        "Якщо процес не вкладається в готовий шаблон, автоматизацію можна побудувати навколо саме ваших правил: винятків, перевірок, послідовностей, ролей, умов та нестандартних сценаріїв.",

      result:
        "Автоматизація підлаштовується під реальний процес, а не змушує бізнес перебудовуватися під обмеження готового рішення."
    }
  },

  ru: {
    ui: {
      kicker:
        "ПОЛЬЗА ДЛЯ БИЗНЕСА",

      result:
        "РЕЗУЛЬТАТ",

      close:
        "Закрыть"
    },

    telegram: {
      title:
        "Telegram-боты",

      text:
        "Переношу в Telegram те, для чего не нужна отдельная сложная система: заявки, уведомления, напоминания, согласования, статусы и получение нужной информации. Сотрудник получает или передаёт данные прямо в привычном рабочем канале.",

      result:
        "Меньше переписки и ручных напоминаний. Быстрее реакция на события, заявки и изменения."
    },

    webapps: {
      title:
        "Веб-приложения",

      text:
        "Создаю небольшие рабочие системы под конкретный процесс: ввод данных, поиск, контроль статусов, расчёты, заявки или внутренние кабинеты. Вместо цепочки таблиц, файлов и сообщений пользователь получает один понятный инструмент.",

      result:
        "Меньше ручных переходов между файлами и сервисами. Процесс становится короче, понятнее и лучше контролируется."
    },

    pwa: {
      title:
        "PWA",

      text:
        "Рабочее веб-приложение можно сделать похожим на обычное мобильное приложение: открывать его с иконки на телефоне и использовать для работы вне офиса, заявок, проверок или быстрого доступа к данным.",

      result:
        "Рабочий инструмент всегда под рукой без отдельной разработки полноценного мобильного приложения."
    },

    documents: {
      title:
        "PDF и документы",

      text:
        "Автоматизирую создание документов из уже имеющихся данных: отчётов, актов, заявок, коммерческих предложений, справок, PDF-файлов и других типовых документов. Система сама подставляет нужные значения в заданный шаблон.",

      result:
        "Документы формируются за секунды вместо ручного копирования. Меньше ошибок, проверок и повторной работы."
    },

    drive: {
      title:
        "Google Drive",

      text:
        "Автоматизирую работу с файлами и папками: создание структуры, переименование, перемещение, поиск, сортировку, предоставление доступа и связь файлов с таблицами или другими процессами.",

      result:
        "Меньше времени на поиск и ручную организацию файлов. Документы автоматически оказываются там, где должны быть."
    },

    research: {
      title:
        "Исследование рынка",

      text:
        "Помогаю превратить большой объём внешней информации в структурированные данные: собрать доступную информацию, привести её к единому формату, сравнить варианты и подготовить основу для анализа.",

      result:
        "Меньше времени на ручной сбор и структурирование информации. Быстрее получение данных для сравнения и принятия решений."
    },

    custom: {
      title:
        "Индивидуальная логика",

      text:
        "Если процесс не укладывается в готовый шаблон, автоматизацию можно построить вокруг именно ваших правил: исключений, проверок, последовательностей, ролей, условий и нестандартных сценариев.",

      result:
        "Автоматизация подстраивается под реальный процесс, а не заставляет бизнес перестраиваться под ограничения готового решения."
    }
  },

  en: {
    ui: {
      kicker:
        "BUSINESS VALUE",

      result:
        "OUTCOME",

      close:
        "Close"
    },

    telegram: {
      title:
        "Telegram Bots",

      text:
        "I can move everyday workflow actions into Telegram when a full standalone system would be overkill — requests, alerts, reminders, approvals, status updates, and quick access to business information. Your team can act without bouncing between tools.",

      result:
        "Less back-and-forth, fewer manual reminders, and faster response to requests and operational changes."
    },

    webapps: {
      title:
        "Web Apps",

      text:
        "I build focused internal tools around a specific workflow — data entry, search, status tracking, calculations, requests, or internal dashboards. Instead of juggling spreadsheets, files, and messages, users get one purpose-built workspace.",

      result:
        "Fewer handoffs between tools, less manual work, and a shorter, easier-to-manage process."
    },

    pwa: {
      title:
        "PWA",

      text:
        "A business web app can behave much like a mobile app: your team can launch it from an icon on a phone and use it for field work, requests, inspections, or quick access to operational data.",

      result:
        "A mobile-friendly business tool that stays within reach without the cost and overhead of building a separate native app."
    },

    documents: {
      title:
        "PDF & Document Automation",

      text:
        "I automate document generation from data you already have — reports, forms, proposals, certificates, PDFs, and other repeatable business documents. The system can populate the right template automatically instead of making someone copy the information by hand.",

      result:
        "Documents produced in seconds, with less copy-paste work, fewer mistakes, and less time spent double-checking."
    },

    drive: {
      title:
        "Google Drive Automation",

      text:
        "I automate repetitive file and folder work — creating folder structures, renaming and moving files, organizing documents, managing access, finding the right files, and connecting Drive content to spreadsheets or other workflows.",

      result:
        "Less time spent hunting for files and organizing folders. Documents land where they belong automatically."
    },

    research: {
      title:
        "Market Research",

      text:
        "I help turn large amounts of available external information into structured, usable data — collecting it, standardizing it, comparing options, and preparing a clean foundation for analysis.",

      result:
        "Less time spent gathering and organizing information, with faster access to the facts needed for comparison and decision-making."
    },

    custom: {
      title:
        "Custom Business Logic",

      text:
        "When your workflow does not fit an off-the-shelf template, I can build the automation around your actual rules — exceptions, validations, roles, conditions, sequences, and edge cases.",

      result:
        "The solution adapts to the way your business actually works instead of forcing your process into somebody else's template."
    }
  }
};

const activeCapabilityContent =
  capabilityContent[
    capabilityLanguage
  ];
  const capabilityButtonLabels = {
  uk: {
    telegram:
      "Telegram-боти",

    webapps:
      "Вебзастосунки",

    pwa:
      "PWA",

    documents:
      "PDF та документи",

    drive:
      "Google Drive",

    research:
      "Дослідження ринку",

    custom:
      "Індивідуальна логіка"
  },

  ru: {
    telegram:
      "Telegram-боты",

    webapps:
      "Веб-приложения",

    pwa:
      "PWA",

    documents:
      "PDF и документы",

    drive:
      "Google Drive",

    research:
      "Исследование рынка",

    custom:
      "Индивидуальная логика"
  },

  en: {
    telegram:
      "Telegram Bots",

    webapps:
      "Web Apps",

    pwa:
      "PWA",

    documents:
      "PDF & Documents",

    drive:
      "Google Drive",

    research:
      "Market Research",

    custom:
      "Custom Business Logic"
  }
};

const currentCapabilityLabels =
  capabilityButtonLabels[
    capabilityLanguage
  ];

capabilityButtons.forEach(
  button => {
    const key =
      button.dataset.capability;

    if (
      currentCapabilityLabels &&
      currentCapabilityLabels[key]
    ) {
      button.textContent =
        currentCapabilityLabels[key];
    }
  }
);

let activeCapability =
  "";

const closeCapabilityDetail =
  () => {
    if (!capabilityDetail) {
      return;
    }

    capabilityDetail.classList.remove(
      "is-open"
    );

    capabilityDetail.setAttribute(
      "aria-hidden",
      "true"
    );

    capabilityButtons.forEach(
      button => {
        button.classList.remove(
          "is-active"
        );

        button.setAttribute(
          "aria-expanded",
          "false"
        );
      }
    );

    activeCapability =
      "";
  };

const openCapabilityDetail =
  key => {
    if (
      !capabilityDetail ||
      !activeCapabilityContent ||
      !activeCapabilityContent[key]
    ) {
      return;
    }

    if (
      activeCapability === key &&
      capabilityDetail.classList.contains(
        "is-open"
      )
    ) {
      closeCapabilityDetail();
      return;
    }

    const data =
      activeCapabilityContent[key];

    activeCapability =
      key;

    capabilityButtons.forEach(
      button => {
        const isActive =
          button.dataset.capability ===
          key;

        button.classList.toggle(
          "is-active",
          isActive
        );

        button.setAttribute(
          "aria-expanded",
          isActive
            ? "true"
            : "false"
        );
      }
    );

    if (capabilityKicker) {
      capabilityKicker.textContent =
        activeCapabilityContent.ui.kicker;
    }

    if (capabilityTitle) {
      capabilityTitle.textContent =
        data.title;
    }

    if (capabilityText) {
      capabilityText.textContent =
        data.text;
    }

    if (capabilityResultLabel) {
      capabilityResultLabel.textContent =
        activeCapabilityContent.ui.result;
    }

    if (capabilityResult) {
      capabilityResult.textContent =
        data.result;
    }

    if (capabilityClose) {
      capabilityClose.setAttribute(
        "aria-label",
        activeCapabilityContent.ui.close
      );
    }

    capabilityDetail.classList.add(
      "is-open"
    );

    capabilityDetail.setAttribute(
      "aria-hidden",
      "false"
    );
  };

capabilityButtons.forEach(
  button => {
    button.setAttribute(
      "aria-expanded",
      "false"
    );

    button.addEventListener(
      "click",
      () => {
        openCapabilityDetail(
          button.dataset.capability
        );
      }
    );
  }
);

if (capabilityClose) {
  capabilityClose.addEventListener(
    "click",
    closeCapabilityDetail
  );
}

  if (capabilityClose) {
  capabilityClose.addEventListener(
    "click",
    closeCapabilityDetail
  );
}

const deliverySection =
  document.querySelector(
    ".services-delivery"
  );

if (deliverySection) {
  const deliveryCards =
    Array.from(
      deliverySection.querySelectorAll(
        ".delivery-card"
      )
    );

  const deliveryCircuits =
    Array.from(
      deliverySection.querySelectorAll(
        ".delivery-core-circuit .circuit"
      )
    );

  const deliveryCore =
    deliverySection.querySelector(
      ".delivery-core-panel"
    );

  const deliveryStamp =
    deliverySection.querySelector(
      ".delivery-stamp"
    );

  let deliveryPlayed =
    false;

  deliveryCircuits.forEach(
    circuit => {
      circuit.classList.remove(
        "is-powered"
      );
    }
  );

  const activateCircuit =
    index => {
      const circuitMap = [
        [0],
        [1],
        [2, 3],
        [4],
        [5],
        [6, 7]
      ];

      const targets =
        circuitMap[index] || [];

      targets.forEach(
        circuitIndex => {
          const circuit =
            deliveryCircuits[
              circuitIndex
            ];

          if (circuit) {
            circuit.classList.add(
              "is-powered"
            );
          }
        }
      );
    };

  const runDeliverySequence =
    () => {
      if (deliveryPlayed) {
        return;
      }

      deliveryPlayed =
        true;

      deliverySection.classList.add(
        "is-running"
      );

      deliveryCards.forEach(
        (card, index) => {
          window.setTimeout(
            () => {
              card.classList.add(
                "is-ready"
              );

              activateCircuit(
                index
              );

              deliverySection.setAttribute(
                "data-delivery-active",
                String(
                  index + 1
                )
              );
            },
            350 + index * 480
          );
        }
      );

      const completionDelay =
        350 +
        deliveryCards.length *
          480 +
        300;

      window.setTimeout(
        () => {
          deliverySection.classList.add(
            "is-core-starting"
          );
        },
        completionDelay
      );

      window.setTimeout(
        () => {
          deliverySection.classList.add(
            "is-complete"
          );

          deliverySection.classList.remove(
            "is-core-starting"
          );

          if (deliveryCore) {
            deliveryCore.classList.add(
              "is-powered"
            );
          }
        },
        completionDelay + 700
      );

      window.setTimeout(
        () => {
          if (deliveryStamp) {
            deliveryStamp.classList.add(
              "is-delivered"
            );
          }

          deliverySection.classList.add(
            "is-delivered"
          );
        },
        completionDelay + 1250
      );
    };

  const deliveryObserver =
    new IntersectionObserver(
      entries => {
        entries.forEach(
          entry => {
            if (
              entry.isIntersecting &&
              entry.intersectionRatio >= 0.25
            ) {
              runDeliverySequence();

              deliveryObserver.disconnect();
            }
          }
        );
      },
      {
        threshold: [
          0.25
        ]
      }
    );

  deliveryObserver.observe(
    deliverySection
  );
}

})();
 
