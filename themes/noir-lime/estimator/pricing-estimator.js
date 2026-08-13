document.addEventListener("DOMContentLoaded", () => {
  const trigger =
    document.querySelector(".pricing-estimator-trigger");

  const panel =
    document.querySelector(".pricing-estimator-panel");

  const overlay =
    document.querySelector(".pricing-estimator-overlay");

  const closeButton =
    document.querySelector(".pricing-estimator-close");

  if (!trigger || !panel || !overlay || !closeButton) {
    return;
  }

  function openEstimator() {
    panel.classList.add("is-open");
    overlay.classList.add("is-open");
    document.body.classList.add("pricing-estimator-open");

    panel.setAttribute("aria-hidden", "false");
    overlay.setAttribute("aria-hidden", "false");
  }

  function closeEstimator() {
    panel.classList.remove("is-open");
    overlay.classList.remove("is-open");
    document.body.classList.remove("pricing-estimator-open");

    panel.setAttribute("aria-hidden", "true");
    overlay.setAttribute("aria-hidden", "true");
  }

  trigger.addEventListener("click", openEstimator);
  closeButton.addEventListener("click", closeEstimator);
  overlay.addEventListener("click", closeEstimator);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeEstimator();
    }
  });
});
