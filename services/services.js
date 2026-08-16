(() => {
  const scenes = [
    {
      image: "/services/assets/scheme.webp",
      signals: "/services/assets/scheme-signals.svg"
    },
    {
      image: "/services/assets/scheme2.webp",
      signals: "/services/assets/scheme2-signals.svg"
    },
    {
      image: "/services/assets/scheme3.webp",
      signals: "/services/assets/scheme3-signals.svg"
    },
    {
      image: "/services/assets/scheme4.webp",
      signals: "/services/assets/scheme4-signals.svg"
    }
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

  const preloadScene = scene => {
    preloadImage(scene.image);

    const svg = new Image();
    svg.src = scene.signals;
  };

  scenes.forEach(preloadScene);

  const bgA = document.createElement("div");
  const bgB = document.createElement("div");

  bgA.className = "services-bg is-active";
  bgB.className = "services-bg";

  const sigA = document.createElement("div");
  const sigB = document.createElement("div");

  sigA.className = "services-signal-set is-active";
  sigB.className = "services-signal-set";

  const sigImgA = document.createElement("img");
  const sigImgB = document.createElement("img");

  sigImgA.className = "services-signal-image";
  sigImgB.className = "services-signal-image";

  sigImgA.alt = "";
  sigImgB.alt = "";

  sigImgA.setAttribute("aria-hidden", "true");
  sigImgB.setAttribute("aria-hidden", "true");

  sigA.appendChild(sigImgA);
  sigB.appendChild(sigImgB);

  document.body.prepend(bgB);
  document.body.prepend(bgA);

  document.body.appendChild(sigB);
  document.body.appendChild(sigA);

  let currentIndex = 0;

  let activeBg = bgA;
  let hiddenBg = bgB;

  let activeSig = sigA;
  let hiddenSig = sigB;

  let activeSigImg = sigImgA;
  let hiddenSigImg = sigImgB;

  const FADE_TIME = 6000;
  const HOLD_TIME = 14000;

  const applyScene = (bgLayer, signalImage, index) => {
    const scene = scenes[index];

    bgLayer.style.backgroundImage = `url("${scene.image}")`;
    signalImage.src = scene.signals;
  };

  applyScene(bgA, sigImgA, 0);
  applyScene(bgB, sigImgB, 1);

  const changeScene = async () => {
    const nextIndex =
      (currentIndex + 1) %
      scenes.length;

    const nextScene =
      scenes[nextIndex];

    await preloadImage(
      nextScene.image
    );

    applyScene(
      hiddenBg,
      hiddenSigImg,
      nextIndex
    );

    hiddenBg.classList.remove(
      "is-active"
    );

    hiddenSig.classList.remove(
      "is-active"
    );

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        hiddenBg.classList.add(
          "is-active"
        );

        hiddenSig.classList.add(
          "is-active"
        );

        activeBg.classList.remove(
          "is-active"
        );

        activeSig.classList.remove(
          "is-active"
        );

        const previousBg =
          activeBg;

        activeBg =
          hiddenBg;

        hiddenBg =
          previousBg;

        const previousSig =
          activeSig;

        activeSig =
          hiddenSig;

        hiddenSig =
          previousSig;

        const previousSigImg =
          activeSigImg;

        activeSigImg =
          hiddenSigImg;

        hiddenSigImg =
          previousSigImg;

        currentIndex =
          nextIndex;

        window.setTimeout(
          changeScene,
          HOLD_TIME + FADE_TIME
        );
      });
    });
  };

  window.setTimeout(
    changeScene,
    HOLD_TIME
  );

  let targetX = 0;
  let targetY = 0;

  let currentX = 0;
  let currentY = 0;

  let animationFrame = null;

  const maxMove = 16;

  const animateBackground = () => {
    currentX +=
      (targetX - currentX) *
      0.075;

    currentY +=
      (targetY - currentY) *
      0.075;

    document.documentElement
      .style
      .setProperty(
        "--services-move-x",
        `${currentX}px`
      );

    document.documentElement
      .style
      .setProperty(
        "--services-move-y",
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
      deltaX > 0.05 ||
      deltaY > 0.05
    ) {
      animationFrame =
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
        "--services-move-x",
        `${currentX}px`
      );

    document.documentElement
      .style
      .setProperty(
        "--services-move-y",
        `${currentY}px`
      );

    animationFrame = null;
  };

  const startBackgroundAnimation = () => {
    if (
      animationFrame !== null
    ) {
      return;
    }

    animationFrame =
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

  document.addEventListener(
    "visibilitychange",
    () => {
      if (
        document.hidden &&
        animationFrame !== null
      ) {
        cancelAnimationFrame(
          animationFrame
        );

        animationFrame = null;
      }
    }
  );
})();
