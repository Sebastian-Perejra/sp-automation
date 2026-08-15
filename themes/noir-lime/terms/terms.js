const mobileMenuButton =
  document.querySelector(
    ".mobile-menu-button"
  );

const mobileMenu =
  document.querySelector(
    ".mobile-menu"
  );

function closeMobileMenu() {
  mobileMenu?.classList.remove(
    "is-open"
  );

  mobileMenuButton?.setAttribute(
    "aria-expanded",
    "false"
  );
}

mobileMenuButton?.addEventListener(
  "click",
  () => {
    const isOpen =
      mobileMenu?.classList.toggle(
        "is-open"
      );

    mobileMenuButton.setAttribute(
      "aria-expanded",
      isOpen ? "true" : "false"
    );
  }
);

mobileMenu
  ?.querySelectorAll("a")
  .forEach(link => {
    link.addEventListener(
      "click",
      closeMobileMenu
    );
  });

document.addEventListener(
  "keydown",
  event => {
    if (event.key === "Escape") {
      closeMobileMenu();
    }
  }
);

const backgroundImages = [
  "/themes/noir-lime/terms/road.webp",
  "/themes/noir-lime/terms/road2.webp",
  "/themes/noir-lime/terms/road3.webp"
];

const backgroundLayers =
  Array.from(
    document.querySelectorAll(
      ".terms-background__layer"
    )
  );

let currentBackgroundIndex = 0;
let activeBackgroundLayer = 0;

function preloadBackgrounds() {
  backgroundImages.forEach(src => {
    const image = new Image();
    image.src = src;
  });
}

if (backgroundLayers.length >= 2) {
  backgroundLayers[0].style.backgroundImage =
    `url("${backgroundImages[0]}")`;

  backgroundLayers[0].classList.add(
    "is-active"
  );

  preloadBackgrounds();

  function showNextBackground() {
    const nextImageIndex =
      (
        currentBackgroundIndex + 1
      ) % backgroundImages.length;

    const nextLayerIndex =
      activeBackgroundLayer === 0
        ? 1
        : 0;

    const currentLayer =
      backgroundLayers[
        activeBackgroundLayer
      ];

    const nextLayer =
      backgroundLayers[
        nextLayerIndex
      ];

    const nextImage =
      new Image();

    nextImage.onload = () => {
      nextLayer.style.backgroundImage =
        `url("${backgroundImages[nextImageIndex]}")`;

      requestAnimationFrame(() => {
        nextLayer.classList.add(
          "is-active"
        );

        currentLayer.classList.remove(
          "is-active"
        );

        currentBackgroundIndex =
          nextImageIndex;

        activeBackgroundLayer =
          nextLayerIndex;
      });
    };

    nextImage.src =
      backgroundImages[
        nextImageIndex
      ];
  }

  setInterval(
    showNextBackground,
    14000
  );
}

let latestScrollY = 0;
let parallaxFrame = null;

function updateBackgroundParallax() {
  const maxShift = 260;

  const shift =
    Math.min(
      latestScrollY * 0.13,
      maxShift
    );

  document.documentElement.style.setProperty(
    "--terms-bg-y",
    `${shift}px`
  );

  parallaxFrame = null;
}

window.addEventListener(
  "scroll",
  () => {
    latestScrollY =
      window.scrollY;

    if (parallaxFrame) {
      return;
    }

    parallaxFrame =
      requestAnimationFrame(
        updateBackgroundParallax
      );
  },
  {
    passive: true
  }
);

latestScrollY =
  window.scrollY;

updateBackgroundParallax();
