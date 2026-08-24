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

let parallaxFrame = null;

function updateBackgroundParallax() {
  const scrollableHeight =
    document.documentElement.scrollHeight -
    window.innerHeight;

  const progress =
    scrollableHeight > 0
      ? window.scrollY / scrollableHeight
      : 0;

  const startShift = -60;
  const endShift = 60;

  const shift =
    startShift +
    (endShift - startShift) * progress;

  document.documentElement.style.setProperty(
    "--terms-bg-y",
    `${shift}px`
  );

  parallaxFrame = null;
}

function requestParallaxUpdate() {
  if (parallaxFrame) return;

  parallaxFrame =
    requestAnimationFrame(
      updateBackgroundParallax
    );
}

window.addEventListener(
  "scroll",
  requestParallaxUpdate,
  {
    passive: true
  }
);

window.addEventListener(
  "resize",
  requestParallaxUpdate,
  {
    passive: true
  }
);

updateBackgroundParallax();
const TERMS_ONLINE_COUNTER_URL =
  "https://script.google.com/macros/s/AKfycbxEum9eoquL-62JQCWQzyJ-VX5MUjrwlt7RtU82hUB2yDxP7R7M10IyTxkVr3s2kptx0w/exec";

function setupTermsOnlineCounter() {
  const countElement =
    document.querySelector(
      "[data-terms-online-count]"
    );

  if (!countElement) {
    return;
  }

  const storageKey =
    "sp_online_visitor_id";

  let visitorId =
    localStorage.getItem(
      storageKey
    );

  if (!visitorId) {
    visitorId =
      window.crypto?.randomUUID
        ? window.crypto.randomUUID()
        : `${Date.now().toString(36)}-${Math.random()
            .toString(36)
            .slice(2)}`;

    localStorage.setItem(
      storageKey,
      visitorId
    );
  }

  let requestNumber = 0;

  function pingOnlineCounter() {
    const callbackName =
      `spTermsOnline_${Date.now()}_${requestNumber++}`;

    const script =
      document.createElement(
        "script"
      );

    const cleanup = () => {
      try {
        delete window[
          callbackName
        ];
      } catch {}

      script.remove();
    };

    window[callbackName] =
      value => {
        const count =
          Number(value);

        if (
          Number.isFinite(count)
        ) {
          countElement.textContent =
            String(
              Math.max(
                0,
                Math.round(count)
              )
            );
        }

        cleanup();
      };

    script.onerror =
      cleanup;

    script.src =
      `${TERMS_ONLINE_COUNTER_URL}` +
      `?callback=${encodeURIComponent(callbackName)}` +
      `&id=${encodeURIComponent(visitorId)}` +
      `&t=${Date.now()}`;

    script.async =
      true;

    document.head.appendChild(
      script
    );
  }

  pingOnlineCounter();

  window.setInterval(
    pingOnlineCounter,
    30000
  );

  document.addEventListener(
    "visibilitychange",
    () => {
      if (!document.hidden) {
        pingOnlineCounter();
      }
    }
  );
}

setupTermsOnlineCounter();
