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

  const pageNames = {
  uk: {
    index: "ГОЛОВНА",
    about: "ПРО МЕНЕ",
    services: "ПОСЛУГИ",
    solutions: "РІШЕННЯ",
    pricing: "ЦІНОВА ПОЛІТИКА",
    faq: "FAQ",
    contacts: "КОНТАКТИ",
    terms: "УМОВИ"
  },
  en: {
    index: "HOME",
    about: "ABOUT",
    services: "SERVICES",
    solutions: "SOLUTIONS",
    pricing: "PRICING",
    faq: "FAQ",
    contacts: "CONTACTS",
    terms: "TERMS"
  },
  ru: {
    index: "ГЛАВНАЯ",
    about: "ОБО МНЕ",
    services: "УСЛУГИ",
    solutions: "РЕШЕНИЯ",
    pricing: "ЦЕНОВАЯ ПОЛИТИКА",
    faq: "FAQ",
    contacts: "КОНТАКТЫ",
    terms: "УСЛОВИЯ"
  }
};

const pageIcons = {
  index: "⌂",
  about: "○",
  services: "⚙",
  solutions: "▦",
  pricing: "$",
  faq: "?",
  contacts: "✉",
  terms: "◇"
};

const currentNames =
  pageNames[lang] ||
  pageNames.uk;

const pages = Object.fromEntries(
  Object.keys(currentNames).map(page => [
    page,
    {
      name: currentNames[page],
      icon: pageIcons[page]
    }
  ])
);
  const info = {
    index: {
      text:
        "Почніть звідси, щоб швидко зрозуміти, чим я займаюся і як побудований сайт.",
      next: [
        "services",
        "solutions"
      ]
    },

    about: {
      text:
        "Мій досвід, підхід до задач і те, як я поєдную бізнес-процеси, системи, дані та автоматизацію.",
      next: [
        "services",
        "solutions"
      ]
    },

    services: {
      text:
        "Тут зібрані напрями автоматизації, з якими я працюю, і формат вирішення бізнес-задач.",
      next: [
        "solutions",
        "contacts"
      ]
    },

    solutions: {
      text:
        "Практичні сценарії, кейси та приклади того, як автоматизація працює в реальних процесах.",
      next: [
        "pricing",
        "contacts"
      ]
    },

    pricing: {
      text:
        "Модель співпраці, підхід до оцінки задач і принципи формування вартості.",
      next: [
        "faq",
        "contacts"
      ]
    },

    faq: {
      text:
        "Відповіді на часті питання про роботу, автоматизацію, строки, підхід і співпрацю.",
      next: [
        "services",
        "contacts"
      ]
    },

    contacts: {
      text:
        "Точка старту для нової задачі. Опишіть процес або проблему — далі розберемося разом.",
      next: [
        "services",
        "solutions"
      ]
    },

    terms: {
      text:
        "Системна інформація про умови використання сайту та його матеріалів.",
      next: [
        "index",
        "contacts"
      ]
    }
  };

  const positions = {
  index: {
    x: 50,
    y: 11.8
  },
  about: {
    x: 25.5,
    y: 25.8
  },
  services: {
    x: 50,
    y: 43.5
  },
  solutions: {
    x: 74.5,
    y: 25.8
  },
  pricing: {
    x: 25,
    y: 58.7
  },
  faq: {
    x: 74.5,
    y: 58.7
  },
  contacts: {
    x: 50,
    y: 74.4
  },
  terms: {
    x: 87.5,
    y: 74
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

  function hotspot(page) {
  const data =
    pages[page];

  const position =
    positions[page];

  const active =
    currentPage === page;

  return `
    <a
      class="site-map-hotspot${active ? " is-current" : ""}"
      href="${pageUrl(page)}"
      data-map-page="${page}"
      aria-label="${data.name}"
      style="
        --map-x:${position.x}%;
        --map-y:${position.y}%;
      "
    >
      ${
        active
          ? `
            <span class="site-map-hotspot__here">
              ВИ ТУТ
            </span>
          `
          : ""
      }

      <strong>
        ${data.name}
      </strong>
    </a>
  `;
}

  const current =
    pages[currentPage] ||
    pages.index;

  const currentInfo =
    info[currentPage] ||
    info.index;

  const nextOne =
    pages[currentInfo.next[0]];

  const nextTwo =
    pages[currentInfo.next[1]];

  campus.innerHTML = `
    <div class="site-map-scene">

      <aside class="site-map-info">
        <div class="site-map-info__here">
          <i></i>
          ВИ ТУТ
        </div>

        <strong class="site-map-info__title">
          ${current.name}
        </strong>

        <p>
          ${currentInfo.text}
        </p>

        <div class="site-map-info__divider"></div>

        <span class="site-map-info__next-label">
          РЕКОМЕНДОВАНІ ДАЛІ:
        </span>

        <a
          class="site-map-info__next"
          href="${pageUrl(currentInfo.next[0])}"
        >
          <span>
            <strong>${nextOne.name}</strong>
          </span>

          <i>→</i>
        </a>

        <a
          class="site-map-info__next"
          href="${pageUrl(currentInfo.next[1])}"
        >
          <span>
            <strong>${nextTwo.name}</strong>
          </span>

          <i>→</i>
        </a>
      </aside>

      <div class="site-map-legend">
        <span>
          <i class="is-current"></i>
          Ви тут
        </span>

        <span>
          <i></i>
          Основні розділи
        </span>

        <span>
          <i class="is-system"></i>
          Системна зона
        </span>
      </div>

      <div class="site-map-scene__stage">
        <img
          class="site-map-scene__image"
          src="/components/site-map/campus_at_night.webp"
          alt=""
          draggable="false"
        >

        ${hotspot("index")}
        ${hotspot("about")}
        ${hotspot("services")}
        ${hotspot("solutions")}
        ${hotspot("pricing")}
        ${hotspot("faq")}
        ${hotspot("contacts")}
        ${hotspot("terms")}
      </div>

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
