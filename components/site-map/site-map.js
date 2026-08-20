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

  let isRouting = false;

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

  const currentNames =
    pageNames[lang] ||
    pageNames.uk;

  const pages =
    Object.fromEntries(
      Object.keys(currentNames).map(
        page => [
          page,
          {
            name: currentNames[page]
          }
        ]
      )
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
    y: 6.8
  },
  about: {
    x: 25.8,
    y: 20.8
  },
  services: {
    x: 50,
    y: 37.7
  },
  solutions: {
    x: 74.8,
    y: 20.8
  },
  pricing: {
    x: 24.2,
    y: 55.2
  },
  faq: {
    x: 74.3,
    y: 52.8
  },
  contacts: {
    x: 50,
    y: 74.4
  },
  terms: {
    x: 87.2,
    y: 75.5
  }
};

  const routeEdges = [
    {
      a: "index",
      b: "about",
      points: [
        [50, 24],
        [46, 27],
        [40, 31],
        [34, 36]
      ]
    },
    {
      a: "index",
      b: "services",
      points: [
        [50, 24],
        [50, 31],
        [50, 39],
        [50, 49]
      ]
    },
    {
      a: "index",
      b: "solutions",
      points: [
        [50, 24],
        [54, 27],
        [60, 31],
        [66, 36]
      ]
    },
    {
      a: "about",
      b: "services",
      points: [
        [34, 36],
        [39, 39],
        [44, 44],
        [50, 49]
      ]
    },
    {
      a: "about",
      b: "pricing",
      points: [
        [34, 36],
        [31, 44],
        [31, 54],
        [33, 63]
      ]
    },
    {
      a: "services",
      b: "solutions",
      points: [
        [50, 49],
        [56, 44],
        [61, 39],
        [66, 36]
      ]
    },
    {
      a: "services",
      b: "pricing",
      points: [
        [50, 49],
        [44, 54],
        [39, 59],
        [33, 63]
      ]
    },
    {
      a: "services",
      b: "faq",
      points: [
        [50, 49],
        [56, 54],
        [61, 59],
        [67, 63]
      ]
    },
    {
      a: "services",
      b: "contacts",
      points: [
        [50, 49],
        [50, 59],
        [50, 69],
        [50, 79]
      ]
    },
    {
      a: "solutions",
      b: "faq",
      points: [
        [66, 36],
        [69, 44],
        [69, 54],
        [67, 63]
      ]
    },
    {
      a: "pricing",
      b: "contacts",
      points: [
        [33, 63],
        [39, 68],
        [44, 74],
        [50, 79]
      ]
    },
    {
      a: "faq",
      b: "contacts",
      points: [
        [67, 63],
        [61, 68],
        [56, 74],
        [50, 79]
      ]
    },
    {
      a: "faq",
      b: "terms",
      points: [
        [67, 63],
        [72, 67],
        [77, 73],
        [82, 79]
      ]
    },
    {
      a: "contacts",
      b: "terms",
      points: [
        [50, 79],
        [61, 79],
        [72, 79],
        [82, 79]
      ]
    }
  ];

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

  function getNeighbours(page) {
    const result = [];

    routeEdges.forEach(edge => {
      if (edge.a === page) {
        result.push(edge.b);
      }

      if (edge.b === page) {
        result.push(edge.a);
      }
    });

    return result;
  }

  function findRoute(start, target) {
    if (start === target) {
      return [start];
    }

    const queue = [
      [start]
    ];

    const visited =
      new Set([start]);

    while (queue.length) {
      const path =
        queue.shift();

      const last =
        path[path.length - 1];

      const neighbours =
        getNeighbours(last);

      for (
        const neighbour
        of neighbours
      ) {
        if (
          visited.has(neighbour)
        ) {
          continue;
        }

        const nextPath = [
          ...path,
          neighbour
        ];

        if (
          neighbour === target
        ) {
          return nextPath;
        }

        visited.add(neighbour);

        queue.push(nextPath);
      }
    }

    return [
      start,
      target
    ];
  }

  function getEdgePoints(from, to) {
    const edge =
      routeEdges.find(item =>
        (
          item.a === from &&
          item.b === to
        ) ||
        (
          item.a === to &&
          item.b === from
        )
      );

    if (!edge) {
      return [];
    }

    if (
      edge.a === from
    ) {
      return edge.points;
    }

    return [
      ...edge.points
    ].reverse();
  }

  function buildRoutePoints(route) {
    const points = [];

    for (
      let i = 0;
      i < route.length - 1;
      i++
    ) {
      const segment =
        getEdgePoints(
          route[i],
          route[i + 1]
        );

      if (!segment.length) {
        continue;
      }

      if (!points.length) {
        points.push(
          ...segment
        );
      } else {
        points.push(
          ...segment.slice(1)
        );
      }
    }

    return points;
  }

  function makeSmoothPath(points) {
    if (
      !points ||
      points.length < 2
    ) {
      return "";
    }

    let d =
      `M ${points[0][0]} ${points[0][1]}`;

    for (
      let i = 1;
      i < points.length - 1;
      i++
    ) {
      const current =
        points[i];

      const next =
        points[i + 1];

      const midX =
        (
          current[0] +
          next[0]
        ) / 2;

      const midY =
        (
          current[1] +
          next[1]
        ) / 2;

      d +=
        ` Q ${current[0]} ${current[1]} ${midX} ${midY}`;
    }

    const last =
      points[
        points.length - 1
      ];

    d +=
      ` L ${last[0]} ${last[1]}`;

    return d;
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
          data-map-page="${currentInfo.next[0]}"
        >
          <span>
            <strong>${nextOne.name}</strong>
          </span>

          <i>→</i>
        </a>

        <a
          class="site-map-info__next"
          href="${pageUrl(currentInfo.next[1])}"
          data-map-page="${currentInfo.next[1]}"
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

        <svg
          class="site-map-route-layer"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <filter
              id="site-map-route-glow"
              x="-100%"
              y="-100%"
              width="300%"
              height="300%"
            >
              <feGaussianBlur
                stdDeviation="0.8"
                result="blur"
              ></feGaussianBlur>

              <feMerge>
                <feMergeNode
                  in="blur"
                ></feMergeNode>

                <feMergeNode
                  in="SourceGraphic"
                ></feMergeNode>
              </feMerge>
            </filter>
          </defs>

          <path
            class="site-map-route-glow"
            data-map-route-glow
          ></path>

          <path
            class="site-map-route-line"
            data-map-route-line
          ></path>

          <circle
            class="site-map-route-head"
            data-map-route-head
            r="0.75"
          ></circle>
        </svg>

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

  const stage =
    campus.querySelector(
      ".site-map-scene__stage"
    );

  const routeLine =
    campus.querySelector(
      "[data-map-route-line]"
    );

  const routeGlow =
    campus.querySelector(
      "[data-map-route-glow]"
    );

  const routeHead =
    campus.querySelector(
      "[data-map-route-head]"
    );

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
    if (isRouting) {
      return;
    }

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

  function animateRoute(
    targetPage,
    targetUrl
  ) {
    if (
      isRouting ||
      targetPage === currentPage
    ) {
      return;
    }

    const route =
      findRoute(
        currentPage,
        targetPage
      );

    const points =
      buildRoutePoints(route);

    const pathData =
      makeSmoothPath(points);

    if (
      !pathData ||
      !routeLine ||
      !routeGlow
    ) {
      window.location.href =
        targetUrl;

      return;
    }

    isRouting = true;

    overlay.classList.add(
      "is-routing"
    );

    const destination =
      campus.querySelector(
        `[data-map-page="${targetPage}"].site-map-hotspot`
      );

    if (destination) {
      destination.classList.add(
        "is-destination"
      );
    }

    routeLine.setAttribute(
      "d",
      pathData
    );

    routeGlow.setAttribute(
      "d",
      pathData
    );

    const length =
      routeLine.getTotalLength();

    routeLine.style.strokeDasharray =
      `${length}`;

    routeLine.style.strokeDashoffset =
      `${length}`;

    routeGlow.style.strokeDasharray =
      `${length}`;

    routeGlow.style.strokeDashoffset =
      `${length}`;

    routeLine.getBoundingClientRect();

    const duration =
      Math.min(
        1500,
        820 +
        Math.max(
          0,
          route.length - 2
        ) * 180
      );

    routeLine.animate(
      [
        {
          strokeDashoffset:
            length
        },
        {
          strokeDashoffset:
            0
        }
      ],
      {
        duration,
        easing:
          "cubic-bezier(0.22, 1, 0.36, 1)",
        fill:
          "forwards"
      }
    );

    routeGlow.animate(
      [
        {
          strokeDashoffset:
            length,
          opacity:
            0
        },
        {
          opacity:
            0.9,
          offset:
            0.12
        },
        {
          strokeDashoffset:
            0,
          opacity:
            0.65
        }
      ],
      {
        duration,
        easing:
          "cubic-bezier(0.22, 1, 0.36, 1)",
        fill:
          "forwards"
      }
    );

    if (routeHead) {
      routeHead.style.opacity =
        "1";

      const motion =
        routeHead.animate(
          [
            {
              offsetDistance:
                "0%"
            },
            {
              offsetDistance:
                "100%"
            }
          ],
          {
            duration,
            easing:
              "cubic-bezier(0.22, 1, 0.36, 1)",
            fill:
              "forwards"
          }
        );

      routeHead.style.offsetPath =
        `path("${pathData}")`;
    }

    window.setTimeout(
      () => {
        if (destination) {
          destination.classList.add(
            "is-arrived"
          );
        }
      },
      duration - 180
    );

    window.setTimeout(
      () => {
        stage.classList.add(
          "is-departing"
        );
      },
      duration + 120
    );

    window.setTimeout(
      () => {
        window.location.href =
          targetUrl;
      },
      duration + 520
    );
  }

  campus
    .querySelectorAll(
      "[data-map-page]"
    )
    .forEach(link => {
      link.addEventListener(
        "click",
        event => {
          const targetPage =
            link.dataset.mapPage;

          if (
            !targetPage
          ) {
            return;
          }

          if (
            targetPage === currentPage
          ) {
            event.preventDefault();

            link.classList.add(
              "is-arrived"
            );

            window.setTimeout(
              () => {
                link.classList.remove(
                  "is-arrived"
                );
              },
              650
            );

            return;
          }

          event.preventDefault();

          animateRoute(
            targetPage,
            link.href
          );
        }
      );
    });

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
