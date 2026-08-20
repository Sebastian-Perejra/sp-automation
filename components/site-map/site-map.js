(() => {
  const trigger =
    document.querySelector(
      "[data-site-map-trigger]"
    );

  if (!trigger) {
    return;
  }

  trigger.addEventListener(
    "click",
    () => {
      console.log(
        "Site map:",
        document.documentElement.dataset.sitePage,
        document.documentElement.dataset.siteLanguage
      );
    }
  );
})();
