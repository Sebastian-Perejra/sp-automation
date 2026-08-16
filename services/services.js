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
})();
