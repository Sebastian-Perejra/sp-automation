(() => {
  const trigger =
    document.querySelector(
      "[data-site-map-trigger]"
    );

  const overlay =
    document.querySelector(
      "[data-site-map-overlay]"
    );

  const campus =
    document.querySelector(
      "[data-site-map-campus]"
    );

  if (
    !trigger ||
    !overlay ||
    !campus
  ) {
    return;
  }

  const lang =
    document.documentElement.dataset.siteLanguage ||
    "uk";

  const currentPage =
    document.documentElement.dataset.sitePage ||
    "index";

  const copy = {
    uk: {
      here: "ВИ ТУТ",
      pages: {
        index: ["HOME", "Головна"],
        about: ["ABOUT", "Про мене"],
        services: ["SERVICES", "Послуги"],
        solutions: ["SOLUTIONS", "Рішення та кейси"],
        pricing: ["PRICING", "Цінова політика"],
        faq: ["FAQ", "Питання та відповіді"],
        contacts: ["CONTACTS", "Контакти"],
        terms: ["TERMS", "Системна зона"]
      }
    },

    ru: {
      here: "ВЫ ЗДЕСЬ",
      pages: {
        index: ["HOME", "Главная"],
        about: ["ABOUT", "Обо мне"],
        services: ["SERVICES", "Услуги"],
        solutions: ["SOLUTIONS", "Решения и кейсы"],
        pricing: ["PRICING", "Ценовая политика"],
        faq: ["FAQ", "Вопросы и ответы"],
        contacts: ["CONTACTS", "Контакты"],
        terms: ["TERMS", "Системная зона"]
      }
    },

    en: {
      here: "YOU ARE HERE",
      pages: {
        index: ["HOME", "Home"],
        about: ["ABOUT", "About me"],
        services: ["SERVICES", "Services"],
        solutions: ["SOLUTIONS", "Solutions & cases"],
        pricing: ["PRICING", "Pricing"],
        faq: ["FAQ", "Questions & answers"],
        contacts: ["CONTACTS", "Contacts"],
        terms: ["TERMS", "System zone"]
      }
    }
  };

  function pageUrl(page) {
    if (page === "index") {
      if (lang === "en") {
        return "/index-en.html";
      }

      if (lang === "ru") {
        return "/index-ru.html";
      }

      return "/index.html";
    }

    if (lang === "en") {
      return `/${page}-en.html`;
    }

    if (lang === "ru") {
      return `/${page}-ru.html`;
    }

    return `/${page}.html`;
  }

  function building(page, className) {
    const item =
      copy[lang]?.pages[page] ||
      copy.uk.pages[page];

    const active =
      currentPage === page;

    return `
      <a
        class="site-campus-building ${className}${active ? " is-current" : ""}"
        href="${pageUrl(page)}"
        data-campus-page="${page}"
      >
        ${
          active
            ? `<span class="site-campus-you-are-here">${copy[lang]?.here || copy.uk.here}</span>`
            : ""
        }

        <span class="site-campus-building__roof"></span>

        <span class="site-campus-building__body">
          <span class="site-campus-building__windows">
            <i></i>
            <i></i>
            <i></i>
          </span>

          <strong>${item[0]}</strong>
          <small>${item[1]}</small>
        </span>
      </a>
    `;
  }

  campus.innerHTML = `
    <div class="site-campus-world">
      <div class="site-campus-ground"></div>

      <svg
        class="site-campus-roads"
        viewBox="0 0 1000 620"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M500 90 L500 310"></path>
        <path d="M500 310 L270 210"></path>
        <path d="M500 310 L730 210"></path>
        <path d="M500 310 L280 430"></path>
        <path d="M500 310 L720 430"></path>
        <path d="M500 310 L500 535"></path>
        <path d="M720 430 L865 500"></path>
      </svg>

      <div class="site-campus-center-glow"></div>

      ${building("index", "site-campus-home")}
      ${building("about", "site-campus-about")}
      ${building("services", "site-campus-services")}
      ${building("solutions", "site-campus-solutions")}
      ${building("pricing", "site-campus-pricing")}
      ${building("faq", "site-campus-faq")}
      ${building("contacts", "site-campus-contacts")}
      ${building("terms", "site-campus-terms")}
    </div>
  `;

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
