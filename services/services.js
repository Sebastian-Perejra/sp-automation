(() => {
  const images = [
    "/services/assets/scheme.webp",
    "/services/assets/scheme2.webp",
    "/services/assets/scheme3.webp",
    "/services/assets/scheme4.webp"
  ];

  const signalSets = [
  `
    <svg class="services-signal-svg" viewBox="0 0 1672 941" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <path class="signal-pulse signal-green flow-a" d="M1450 58C1360 88 1288 126 1220 178C1154 228 1092 294 1048 364C1006 432 978 502 934 566C892 628 834 678 774 732C716 784 652 830 584 874" />
      <path class="signal-pulse signal-gold flow-b" d="M1278 86C1190 126 1112 178 1058 238C1002 300 970 370 938 442C904 520 856 584 804 642C754 700 700 750 640 798" />
      <path class="signal-pulse signal-green flow-c" d="M1516 206C1444 236 1386 278 1332 332C1278 386 1242 450 1208 512C1176 572 1142 632 1084 686" />
      <path class="signal-pulse signal-gold flow-d" d="M1016 156C962 208 930 270 898 336C864 408 826 478 782 538C738 598 688 650 626 706" />
    </svg>
  `,
  `
    <svg class="services-signal-svg" viewBox="0 0 1672 941" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <path class="signal-pulse signal-green flow-a" d="M132 786C286 742 424 708 560 680C696 652 804 616 900 560C994 504 1064 434 1126 360C1190 286 1250 224 1328 178" />
      <path class="signal-pulse signal-gold flow-b" d="M218 812C356 772 486 742 614 716C742 690 844 654 938 600C1032 546 1108 482 1174 414C1242 344 1304 286 1370 248" />
      <path class="signal-pulse signal-green flow-c" d="M772 684C870 652 952 610 1028 554C1106 496 1170 428 1226 358C1284 286 1336 232 1408 194" />
      <path class="signal-pulse signal-gold flow-d" d="M1180 210C1248 248 1310 292 1362 348C1416 406 1454 476 1490 548" />
    </svg>
  `,
  `
    <svg class="services-signal-svg" viewBox="0 0 1672 941" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <path class="signal-pulse signal-green flow-a" d="M32 324C186 344 324 370 456 404C590 438 706 474 824 486C944 498 1056 484 1162 450C1270 414 1374 360 1492 300" />
      <path class="signal-pulse signal-gold flow-b" d="M176 878C316 798 440 730 554 660C668 590 766 520 850 446C934 372 1020 292 1122 226C1222 160 1320 116 1432 82" />
      <path class="signal-pulse signal-green flow-c" d="M676 494C788 490 892 478 994 446C1098 414 1204 368 1302 314C1402 260 1490 212 1608 174" />
      <path class="signal-pulse signal-gold flow-d" d="M1082 260C1154 304 1216 354 1270 410C1324 466 1368 528 1416 594" />
    </svg>
  `,
  `
    <svg class="services-signal-svg" viewBox="0 0 1672 941" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <path class="signal-pulse signal-green flow-a" d="M246 748C384 720 518 700 650 678C784 656 900 628 1002 582C1102 536 1180 476 1248 404C1316 332 1370 256 1430 196" />
      <path class="signal-pulse signal-gold flow-b" d="M332 768C462 742 590 720 712 700C834 680 940 652 1032 610C1124 568 1200 514 1266 448C1332 382 1388 314 1450 252" />
      <path class="signal-pulse signal-green flow-c" d="M748 668C850 638 936 600 1010 550C1086 500 1150 442 1204 380C1258 318 1312 260 1376 218" />
      <path class="signal-pulse signal-gold flow-d" d="M1182 220C1240 248 1294 284 1340 330C1386 376 1424 432 1458 492" />
    </svg>
  `
];
  const preload = src => {
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
    preload(src);
  });

  const bgA = document.createElement("div");
  const bgB = document.createElement("div");

  bgA.className = "services-bg is-active";
  bgB.className = "services-bg";

  const sigA = document.createElement("div");
  const sigB = document.createElement("div");

  sigA.className = "services-signal-set is-active";
  sigB.className = "services-signal-set";

  document.body.prepend(bgB);
  document.body.prepend(bgA);

  document.body.appendChild(sigB);
  document.body.appendChild(sigA);

  let currentIndex = 0;

  let activeBg = bgA;
  let hiddenBg = bgB;

  let activeSig = sigA;
  let hiddenSig = sigB;

  const FADE_TIME = 6000;
  const HOLD_TIME = 14000;

  const applyScene = (bgLayer, signalLayer, index) => {
    bgLayer.style.backgroundImage = `url("${images[index]}")`;
    signalLayer.innerHTML = signalSets[index];
  };

  applyScene(bgA, sigA, 0);
  applyScene(bgB, sigB, 1);

  const changeScene = async () => {
    const nextIndex = (currentIndex + 1) % images.length;

    await preload(images[nextIndex]);

    applyScene(hiddenBg, hiddenSig, nextIndex);

    hiddenBg.classList.remove("is-active");
    hiddenSig.classList.remove("is-active");

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        hiddenBg.classList.add("is-active");
        hiddenSig.classList.add("is-active");

        activeBg.classList.remove("is-active");
        activeSig.classList.remove("is-active");

        const previousBg = activeBg;
        activeBg = hiddenBg;
        hiddenBg = previousBg;

        const previousSig = activeSig;
        activeSig = hiddenSig;
        hiddenSig = previousSig;

        currentIndex = nextIndex;

        window.setTimeout(changeScene, HOLD_TIME + FADE_TIME);
      });
    });
  };

  window.setTimeout(changeScene, HOLD_TIME);

  let targetX = 0;
  let targetY = 0;

  let currentX = 0;
  let currentY = 0;

  let animationFrame = null;

  const maxMove = 16;

  const animateBackground = () => {
    currentX += (targetX - currentX) * 0.075;
    currentY += (targetY - currentY) * 0.075;

    document.documentElement.style.setProperty(
      "--services-move-x",
      `${currentX}px`
    );

    document.documentElement.style.setProperty(
      "--services-move-y",
      `${currentY}px`
    );

    const deltaX = Math.abs(targetX - currentX);
    const deltaY = Math.abs(targetY - currentY);

    if (deltaX > 0.05 || deltaY > 0.05) {
      animationFrame = requestAnimationFrame(animateBackground);
      return;
    }

    currentX = targetX;
    currentY = targetY;

    document.documentElement.style.setProperty(
      "--services-move-x",
      `${currentX}px`
    );

    document.documentElement.style.setProperty(
      "--services-move-y",
      `${currentY}px`
    );

    animationFrame = null;
  };

  const startBackgroundAnimation = () => {
    if (animationFrame !== null) return;

    animationFrame = requestAnimationFrame(animateBackground);
  };

  window.addEventListener(
    "pointermove",
    event => {
      if (window.innerWidth <= 760) return;

      const x =
        event.clientX / window.innerWidth -
        0.5;

      const y =
        event.clientY / window.innerHeight -
        0.5;

      targetX = x * maxMove;
      targetY = y * maxMove;

      startBackgroundAnimation();
    },
    {
      passive: true
    }
  );

  document.documentElement.addEventListener(
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
      if (document.hidden && animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
    }
  );
})();
