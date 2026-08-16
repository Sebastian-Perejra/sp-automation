(() => {
  const images = [
    "/services/assets/scheme.webp",
    "/services/assets/scheme2.webp",
    "/services/assets/scheme3.webp",
    "/services/assets/scheme4.webp"
  ];

  const signalSets = [
    `
      <svg class="services-signal-svg" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <path class="signal-pulse signal-green flow-a" d="M1260 26C1218 82 1158 120 1118 180C1078 242 1052 320 1018 396C980 480 930 540 874 604C820 664 760 720 702 806C646 890 592 950 514 1036" />
        <path class="signal-pulse signal-gold flow-b" d="M1088 86C1038 132 990 194 952 264C914 334 882 424 846 520C810 618 760 698 698 782C640 858 580 922 522 1018" />
        <path class="signal-pulse signal-green flow-c" d="M344 1026C454 948 554 876 642 786C722 702 790 600 862 498C934 398 1002 312 1088 226C1168 144 1262 78 1386 12" />
        <path class="signal-pulse signal-gold flow-d" d="M1464 148C1382 192 1318 250 1260 336C1206 418 1160 520 1110 622C1060 720 988 796 898 862" />
      </svg>
    `,
    `
      <svg class="services-signal-svg" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <path class="signal-pulse signal-green flow-a" d="M114 906C274 842 422 804 598 770C754 742 878 688 986 590C1098 486 1182 346 1280 248C1384 146 1526 114 1760 120" />
        <path class="signal-pulse signal-gold flow-b" d="M206 924C384 866 530 832 688 802C826 776 948 730 1058 646C1172 560 1260 448 1350 340C1440 234 1538 164 1702 154" />
        <path class="signal-pulse signal-green flow-c" d="M1422 134C1512 188 1600 240 1664 322C1734 412 1786 522 1844 676" />
        <path class="signal-pulse signal-gold flow-d" d="M764 742C864 716 950 674 1030 608C1114 538 1184 450 1262 364C1338 280 1416 212 1514 172" />
      </svg>
    `,
    `
      <svg class="services-signal-svg" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <path class="signal-pulse signal-green flow-a" d="M-40 286C178 314 340 360 520 432C690 500 842 550 1018 548C1186 544 1332 494 1468 432C1608 368 1740 298 1948 258" />
        <path class="signal-pulse signal-gold flow-b" d="M166 1032C336 914 494 836 642 736C794 632 920 520 1040 384C1148 262 1296 148 1486 70" />
        <path class="signal-pulse signal-green flow-c" d="M764 548C904 542 1030 520 1148 476C1280 428 1418 362 1562 282C1704 202 1810 140 1944 108" />
        <path class="signal-pulse signal-gold flow-d" d="M1268 274C1358 332 1458 394 1546 466C1636 538 1712 622 1816 744" />
      </svg>
    `,
    `
      <svg class="services-signal-svg" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <path class="signal-pulse signal-green flow-a" d="M314 858C496 812 684 786 876 756C1048 730 1180 680 1282 574C1386 466 1460 318 1542 222C1632 118 1740 86 1898 88" />
        <path class="signal-pulse signal-gold flow-b" d="M362 842C530 796 708 772 892 742C1048 716 1162 666 1262 572C1368 472 1448 336 1528 248C1604 164 1684 116 1794 104" />
        <path class="signal-pulse signal-green flow-c" d="M862 736C1002 702 1112 650 1198 568C1292 478 1362 366 1442 270C1514 184 1590 130 1692 96" />
        <path class="signal-pulse signal-gold flow-d" d="M1288 230C1370 262 1452 304 1520 370C1588 436 1642 526 1712 646" />
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
