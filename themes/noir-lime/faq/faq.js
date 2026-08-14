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
})();
