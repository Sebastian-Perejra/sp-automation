(() => {
  const trigger =
    document.querySelector(
      "[data-site-map-trigger]"
    );

  const overlay =
    document.querySelector(
      "[data-site-map-overlay]"
    );

  if (
    !trigger ||
    !overlay
  ) {
    return;
  }

  function openMap() {
    overlay.classList.add(
      "is-open"
    );

    overlay.setAttribute(
      "aria-hidden",
      "false"
    );

    document.documentElement.style.overflow =
      "hidden";
  }

  function closeMap() {
    overlay.classList.remove(
      "is-open"
    );

    overlay.setAttribute(
      "aria-hidden",
      "true"
    );

    document.documentElement.style.overflow =
      "";
  }

  trigger.addEventListener(
    "click",
    openMap
  );

  overlay
    .querySelectorAll(
      "[data-site-map-close]"
    )
    .forEach(element => {
      element.addEventListener(
        "click",
        closeMap
      );
    });

  document.addEventListener(
    "keydown",
    event => {
      if (
        event.key === "Escape" &&
        overlay.classList.contains(
          "is-open"
        )
      ) {
        closeMap();
      }
    }
  );
})();
