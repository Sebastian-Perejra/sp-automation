document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const layerA = document.querySelector(".pricing-background-layer-a");
  const layerB = document.querySelector(".pricing-background-layer-b");
  const particlesContainer =
  document.querySelector(".pricing-background-particles");

  const images = [
    "/themes/noir-lime/pricing-grid/assets/Price-grid1.webp",
    "/themes/noir-lime/pricing-grid/assets/Price-grid2.webp",
    "/themes/noir-lime/pricing-grid/assets/Price-grid3.webp",
    "/themes/noir-lime/pricing-grid/assets/Price-grid4.webp",
    "/themes/noir-lime/pricing-grid/assets/Price-grid5.webp"
  ];

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  let currentIndex = 0;
  let showingA = true;

  window.addEventListener("pointermove", (event) => {
    targetX = (event.clientX / window.innerWidth - 0.5) * 16;
    targetY = (event.clientY / window.innerHeight - 0.5) * 10;
  });

  function animate() {
    currentX += (targetX - currentX) * 0.04;
    currentY += (targetY - currentY) * 0.04;

    root.style.setProperty(
      "--pricing-shift-x",
      `${currentX}px`
    );

    root.style.setProperty(
      "--pricing-shift-y",
      `${currentY}px`
    );

    requestAnimationFrame(animate);
  }

  function setBackground(layer, image) {
    layer.style.backgroundImage = `
      linear-gradient(
        rgba(3, 10, 6, 0.43),
        rgba(2, 8, 5, 0.58)
      ),
      url("${image}")
    `;
  }

  function changeBackground() {
    const nextIndex = (currentIndex + 1) % images.length;
    const currentLayer = showingA ? layerA : layerB;
    const nextLayer = showingA ? layerB : layerA;

    setBackground(nextLayer, images[nextIndex]);

    nextLayer.style.opacity = "1";
    currentLayer.style.opacity = "0";

    currentIndex = nextIndex;
    showingA = !showingA;
  }

  function createParticles() {
  if (!particlesContainer) return;

  const particleCount = 24;

  for (let i = 0; i < particleCount; i += 1) {
    const particle = document.createElement("span");

    particle.className = "pricing-particle";

    const size = 1 + Math.random() * 3;
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    const duration = 18 + Math.random() * 28;
    const fade = 6 + Math.random() * 9;
    const delay = Math.random() * -30;
    const drift = -22 + Math.random() * 44;
    const opacity = 0.18 + Math.random() * 0.4;

    particle.style.left = `${left}%`;
    particle.style.top = `${top}%`;
    particle.style.setProperty(
      "--particle-size",
      `${size.toFixed(2)}px`
    );
    particle.style.setProperty(
      "--particle-duration",
      `${duration.toFixed(2)}s`
    );
    particle.style.setProperty(
      "--particle-fade",
      `${fade.toFixed(2)}s`
    );
    particle.style.setProperty(
      "--particle-delay",
      `${delay.toFixed(2)}s`
    );
    particle.style.setProperty(
      "--particle-drift",
      `${drift.toFixed(2)}px`
    );
    particle.style.setProperty(
      "--particle-opacity",
      opacity.toFixed(2)
    );

    particlesContainer.appendChild(particle);
  }
}

function initInteractiveCards() {
  const cards = document.querySelectorAll(".card, .item");

  cards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const percentX = x / rect.width;
      const percentY = y / rect.height;

      const rotateY = (percentX - 0.5) * 2.4;
      const rotateX = (0.5 - percentY) * 2;

      card.style.setProperty(
        "--spotlight-x",
        `${x}px`
      );

      card.style.setProperty(
        "--spotlight-y",
        `${y}px`
      );

      card.style.transform =
        `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform =
        "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)";
    });
  });
}

function initScrollReveal() {
  const elements = document.querySelectorAll(
    ".hero, .card, .cta"
  );

  elements.forEach((element) => {
    element.classList.add("reveal-on-scroll");
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("reveal-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  elements.forEach((element) => {
    observer.observe(element);
  });
}

function initMagneticCTA() {
  const button = document.querySelector(".cta .button");

  if (!button) return;

  button.addEventListener("pointermove", (event) => {
    const rect = button.getBoundingClientRect();

    const x =
      event.clientX - rect.left - rect.width / 2;

    const y =
      event.clientY - rect.top - rect.height / 2;

    button.style.transform =
      `translate3d(${x * 0.16}px, ${y * 0.22}px, 0)`;

    button.classList.add("magnetic-active");
  });

  button.addEventListener("pointerleave", () => {
    button.style.transform =
      "translate3d(0, 0, 0)";

    button.classList.remove("magnetic-active");
  });
}

function initPriceCounters() {
  const priceElements = document.querySelectorAll(".price");

  const targets = [1 000, 800];

  priceElements.forEach((element, index) => {
    if (index > 1) return;

    const target = targets[index];

    element.dataset.targetPrice = String(target);
    element.textContent = `0 грн/год`;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const element = entry.target;

        if (element.dataset.animated === "true") {
          observer.unobserve(element);
          return;
        }

        const target =
          Number(element.dataset.targetPrice);

        const duration = 900;
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const progress = Math.min(
            (currentTime - startTime) / duration,
            1
          );

          const eased =
            1 - Math.pow(1 - progress, 3);

          const value =
            Math.round(target * eased);

          element.textContent =
            `${value} грн/год`;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            element.textContent =
              `${target} грн/год`;

            element.dataset.animated = "true";
          }
        }

        requestAnimationFrame(updateCounter);

        observer.unobserve(element);
      });
    },
    {
      threshold: 0.55
    }
  );

  priceElements.forEach((element, index) => {
    if (index > 1) return;

    observer.observe(element);
  });
}

initPriceCounters();  
  
initMagneticCTA();
  
initScrollReveal();
  
initInteractiveCards();
  
createParticles();
  
  setInterval(changeBackground, 20000);

  animate();
});
