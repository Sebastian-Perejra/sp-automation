(() => {
  const backgrounds = [
    "/themes/noir-lime/faq/assets/faq.webp",
    "/themes/noir-lime/faq/assets/faq2.webp",
    "/themes/noir-lime/faq/assets/faq3.webp"
  ];

  const layerA = document.createElement("div");
  const layerB = document.createElement("div");

  layerA.className = "faq-bg is-active";
  layerB.className = "faq-bg";

  document.body.prepend(layerB);
  document.body.prepend(layerA);

  let currentLayer = layerA;
  let nextLayer = layerB;
  let currentIndex = 0;

  currentLayer.style.backgroundImage = `url("${backgrounds[0]}")`;

  backgrounds.slice(1).forEach(src => {
    const image = new Image();
    image.src = src;
  });

  function changeBackground() {
    currentIndex = (currentIndex + 1) % backgrounds.length;

    nextLayer.style.backgroundImage =
      `url("${backgrounds[currentIndex]}")`;

    nextLayer.classList.add("is-active");
    currentLayer.classList.remove("is-active");

    const oldLayer = currentLayer;
    currentLayer = nextLayer;
    nextLayer = oldLayer;
  }

  setInterval(changeBackground, 14000);

  const faqItems = Array.from(
    document.querySelectorAll("#faq-list details")
  );

  faqItems.forEach(item => {
    item.addEventListener("pointermove", event => {
      const rect = item.getBoundingClientRect();

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      item.style.setProperty("--spot-x", `${x}px`);
      item.style.setProperty("--spot-y", `${y}px`);
    });

    item.addEventListener("pointerenter", () => {
      item.classList.add("is-hovered");
    });

    item.addEventListener("pointerleave", () => {
      item.classList.remove("is-hovered");
    });

    item.addEventListener("toggle", () => {
      item.classList.toggle("is-open", item.open);
    });
  });

  const hero = document.querySelector(".hero");

  if (hero) {
    hero.addEventListener("pointermove", event => {
      const rect = hero.getBoundingClientRect();

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      hero.style.setProperty("--hero-x", `${x}px`);
      hero.style.setProperty("--hero-y", `${y}px`);
      const orbitX = (x / rect.width - 0.5) * 28;
const orbitY = (y / rect.height - 0.5) * 28;

hero.style.setProperty("--orbit-x", `${orbitX}px`);
hero.style.setProperty("--orbit-y", `${orbitY}px`);
    });
  }
})();
