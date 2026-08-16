(() => {
  const images = [
    "/services/assets/scheme.webp",
    "/services/assets/scheme2.webp",
    "/services/assets/scheme3.webp",
    "/services/assets/scheme4.webp"
  ];

  let index = 0;

  const layerA = document.createElement("div");
  const layerB = document.createElement("div");

  layerA.className = "services-bg services-bg-a is-active";
  layerB.className = "services-bg services-bg-b";

  document.body.prepend(layerB);
  document.body.prepend(layerA);

  layerA.style.backgroundImage = `url("${images[0]}")`;
  layerB.style.backgroundImage = `url("${images[1]}")`;

  images.forEach(src => {
    const img = new Image();
    img.src = src;
  });

  let activeLayer = layerA;
  let hiddenLayer = layerB;

  setInterval(() => {
    index = (index + 1) % images.length;

    hiddenLayer.style.backgroundImage = `url("${images[index]}")`;

    hiddenLayer.classList.add("is-active");
    activeLayer.classList.remove("is-active");

    const temp = activeLayer;
    activeLayer = hiddenLayer;
    hiddenLayer = temp;
  }, 9000);

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  const maxMove = 18;

  window.addEventListener(
    "pointermove",
    event => {
      if (window.innerWidth <= 760) return;

      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;

      targetX = x * maxMove;
      targetY = y * maxMove;
    },
    { passive: true }
  );

  window.addEventListener(
    "pointerleave",
    () => {
      targetX = 0;
      targetY = 0;
    },
    { passive: true }
  );

  const animateBackground = () => {
    currentX += (targetX - currentX) * 0.055;
    currentY += (targetY - currentY) * 0.055;

    document.documentElement.style.setProperty(
      "--services-move-x",
      `${currentX}px`
    );

    document.documentElement.style.setProperty(
      "--services-move-y",
      `${currentY}px`
    );

    requestAnimationFrame(animateBackground);
  };

  animateBackground();

  const signals = document.createElement("div");
  signals.className = "services-signals";

  signals.innerHTML = `
    <svg
      class="services-signals-svg"
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <path
        class="signal-path signal-path-a"
        d="M -80 610 C 130 570, 245 510, 350 430 S 570 290, 710 330 S 955 500, 1280 235"
      />

      <path
        class="signal-path signal-path-b"
        d="M -100 290 C 120 320, 225 255, 365 275 S 620 420, 755 350 S 945 195, 1270 270"
      />

      <path
        class="signal-path signal-path-c"
        d="M 190 860 C 250 650, 390 585, 470 505 S 555 320, 690 245 S 925 180, 1050 -80"
      />

      <path
        class="signal-path signal-path-d"
        d="M 40 745 C 205 650, 250 555, 410 540 S 600 635, 745 570 S 935 385, 1190 420"
      />

      <path
        class="signal-path signal-path-e"
        d="M 1020 850 C 900 700, 825 640, 805 505 S 890 300, 790 205 S 565 125, 510 -100"
      />
    </svg>
  `;

  document.body.appendChild(signals);
})();
