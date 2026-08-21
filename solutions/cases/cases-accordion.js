(() => {
  const page = document.querySelector("main.page");

  if (!page) return;

  const language = document.documentElement.lang || "uk";

  const texts = {
    uk: {
      toolbarTitle: "Демонстраційні кейси",
      toolbarNote: "Оберіть потрібний кейс або відкрийте всі",
      expandAll: "Розгорнути всі",
      collapseAll: "Згорнути всі",
      caseLabel: "Кейс"
    },
    ru: {
      toolbarTitle: "Демонстрационные кейсы",
      toolbarNote: "Выберите нужный кейс или откройте все",
      expandAll: "Развернуть все",
      collapseAll: "Свернуть все",
      caseLabel: "Кейс"
    },
    en: {
      toolbarTitle: "Case studies",
      toolbarNote: "Select a case or open all of them",
      expandAll: "Expand all",
      collapseAll: "Collapse all",
      caseLabel: "Case"
    }
  };

  const locale = texts[language] || texts.uk;

  const casesByLanguage = {
    uk: [
      {
        selector: "#case1-container",
        number: 1,
        title: "Автоматична обробка банківських виписок",
        description: "Розпізнавання, категоризація та очищення операцій"
      },
      {
        selector: "#case2-container",
        number: 2,
        title: "Парсинг PDF-інвойсів і пакувальних листів",
        description: "OCR, перенесення даних і зіставлення ваги"
      },
      {
        selector: "#case3-container",
        number: 3,
        title: "Автоматичне створення аналітичного дашборда",
        description: "Розрахунок KPI, агрегація даних і графіки"
      },
      {
        selector: "#case4-container",
        number: 4,
        title: "Планування виробничих потужностей",
        description: "Розподіл замовлень і розрахунок строків"
      },
      {
        selector: "#case5-container",
        number: 5,
        title: "Розрахунок потреби в комплектуючих",
        description: "BOM, залишки та автоматичне формування закупівлі"
      },
      {
        selector: "#case6-container",
        number: 6,
        title: "Інтерактивна аналітика Power BI",
        description: "Фільтри, KPI, прогнози та керівницький дашборд"
      },
      {
        selector: "#case7-container",
        number: 7,
        title: "Об’єднання сотень Excel-файлів",
        description: "Завантаження з папки та консолідація в один масив"
      }
    ],

    ru: [
      {
        selector: "#case1-container",
        number: 1,
        title: "Автоматическая обработка банковских выписок",
        description: "Распознавание, категоризация и очистка операций"
      },
      {
        selector: "#case2-container",
        number: 2,
        title: "Парсинг PDF-инвойсов и упаковочных листов",
        description: "OCR, перенос данных и сопоставление веса"
      },
      {
        selector: "#case3-container",
        number: 3,
        title: "Автоматическое создание аналитического дашборда",
        description: "Расчёт KPI, агрегация данных и графики"
      },
      {
        selector: "#case4-container",
        number: 4,
        title: "Планирование производственных мощностей",
        description: "Распределение заказов и расчёт сроков"
      },
      {
        selector: "#case5-container",
        number: 5,
        title: "Расчёт потребности в комплектующих",
        description: "BOM, остатки и автоматическое формирование закупки"
      },
      {
        selector: "#case6-container",
        number: 6,
        title: "Интерактивная аналитика Power BI",
        description: "Фильтры, KPI, прогнозы и управленческий дашборд"
      },
      {
        selector: "#case7-container",
        number: 7,
        title: "Объединение сотен Excel-файлов",
        description: "Загрузка из папки и консолидация в единый массив"
      }
    ],

    en: [
      {
        selector: "#case1-container",
        number: 1,
        title: "Automatic bank statement processing",
        description: "Recognition, categorisation and transaction cleanup"
      },
      {
        selector: "#case2-container",
        number: 2,
        title: "PDF invoice and packing list parsing",
        description: "OCR, data extraction and weight matching"
      },
      {
        selector: "#case3-container",
        number: 3,
        title: "Automatic analytical dashboard creation",
        description: "KPI calculation, data aggregation and charts"
      },
      {
        selector: "#case4-container",
        number: 4,
        title: "Production capacity planning",
        description: "Order allocation and completion date calculation"
      },
      {
        selector: "#case5-container",
        number: 5,
        title: "Component requirement calculation",
        description: "BOM, available stock and purchase requirements"
      },
      {
        selector: "#case6-container",
        number: 6,
        title: "Interactive Power BI analytics",
        description: "Filters, KPIs, forecasts and management dashboard"
      },
      {
        selector: "#case7-container",
        number: 7,
        title: "Consolidation of hundreds of Excel files",
        description: "Folder import and consolidation into one dataset"
      }
    ]
  };

  const cases = casesByLanguage[language] || casesByLanguage.uk;
    function createToolbar(firstCaseElement) {
    const toolbar = document.createElement("div");
    toolbar.className = "cases-accordion-toolbar";

    toolbar.innerHTML = `
      <div class="cases-accordion-toolbar-text">
        <strong>${locale.toolbarTitle}</strong>
        <span>${locale.toolbarNote}</span>
      </div>

      <div class="cases-accordion-toolbar-buttons">
        <button type="button" data-cases-action="expand">
          ${locale.expandAll}
        </button>

        <button type="button" data-cases-action="collapse">
          ${locale.collapseAll}
        </button>
      </div>
    `;

    firstCaseElement.parentNode.insertBefore(
      toolbar,
      firstCaseElement
    );

    return toolbar;
  }

  function createAccordionItem(caseData, originalElement) {
    const item = document.createElement("section");
    item.className = "case-accordion-item";
    item.id = `case-${caseData.number}`;

    const trigger = document.createElement("button");
    trigger.className = "case-accordion-trigger";
    trigger.type = "button";
    trigger.setAttribute("aria-expanded", "false");
    trigger.setAttribute(
      "aria-controls",
      `case-${caseData.number}-content`
    );

    trigger.innerHTML = `
      <span class="case-accordion-number">
        ${caseData.number}
      </span>

      <span class="case-accordion-heading">
        <strong>
          ${locale.caseLabel} №${caseData.number} — ${caseData.title}
        </strong>

        <span>
          ${caseData.description}
        </span>
      </span>

      <span class="case-accordion-icon" aria-hidden="true"></span>
    `;

    const content = document.createElement("div");
    content.className = "case-accordion-content";
    content.id = `case-${caseData.number}-content`;

    const inner = document.createElement("div");
    inner.className = "case-accordion-content-inner";

    originalElement.parentNode.insertBefore(
      item,
      originalElement
    );

    inner.appendChild(originalElement);
    content.appendChild(inner);
    item.appendChild(trigger);
    item.appendChild(content);

    return {
      item,
      trigger,
      content
    };
  }

  function openItem(itemData) {
    itemData.item.classList.add("open");
    itemData.trigger.setAttribute("aria-expanded", "true");

    itemData.content.style.maxHeight =
      `${itemData.content.scrollHeight}px`;
  }

  function closeItem(itemData) {
    itemData.item.classList.remove("open");
    itemData.trigger.setAttribute("aria-expanded", "false");
    itemData.content.style.maxHeight = "0px";
  }

  function toggleItem(itemData) {
    if (itemData.item.classList.contains("open")) {
      closeItem(itemData);
      return;
    }

    openItem(itemData);
  }

  function refreshOpenHeights(items) {
    items.forEach(itemData => {
      if (!itemData.item.classList.contains("open")) return;

      itemData.content.style.maxHeight =
        `${itemData.content.scrollHeight}px`;
    });
  }

  function waitForDynamicCases(callback) {
    const startedAt = Date.now();
    const timeout = 10000;

    const timer = setInterval(() => {
      const allFound = cases.every(caseData => {
        return document.querySelector(caseData.selector);
      });

      if (allFound || Date.now() - startedAt >= timeout) {
        clearInterval(timer);
        callback();
      }
    }, 150);
  }
    function initializeAccordion() {
    const availableCases = cases
      .map(caseData => {
        const originalElement =
          document.querySelector(caseData.selector);

        if (!originalElement) return null;

        return {
          caseData,
          originalElement
        };
      })
      .filter(Boolean);

    if (!availableCases.length) return;

    const firstCaseElement =
      availableCases[0].originalElement;

    const toolbar =
      createToolbar(firstCaseElement);

    const accordionItems =
      availableCases.map(({ caseData, originalElement }) => {
        return createAccordionItem(
          caseData,
          originalElement
        );
      });

    accordionItems.forEach(itemData => {
      itemData.trigger.addEventListener("click", () => {
        toggleItem(itemData);

        setTimeout(() => {
          refreshOpenHeights(accordionItems);
        }, 350);
      });
    });

    const expandButton =
      toolbar.querySelector(
        '[data-cases-action="expand"]'
      );

    const collapseButton =
      toolbar.querySelector(
        '[data-cases-action="collapse"]'
      );

    expandButton.addEventListener("click", () => {
      accordionItems.forEach(openItem);

      setTimeout(() => {
        refreshOpenHeights(accordionItems);
      }, 350);
    });

    collapseButton.addEventListener("click", () => {
      accordionItems.forEach(closeItem);

      toolbar.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });

    window.addEventListener("resize", () => {
      refreshOpenHeights(accordionItems);
    });

    const resizeObserver =
      new ResizeObserver(() => {
        refreshOpenHeights(accordionItems);
      });

    accordionItems.forEach(itemData => {
      resizeObserver.observe(
        itemData.content.querySelector(
          ".case-accordion-content-inner"
        )
      );
    });

    const hashMatch =
      window.location.hash.match(/^#case-(\d+)$/);

    if (hashMatch) {
      const requestedNumber =
        Number(hashMatch[1]);

      const requestedItem =
        accordionItems.find(itemData => {
          return (
            Number(
              itemData.item.id.replace("case-", "")
            ) === requestedNumber
          );
        });

      if (requestedItem) {
        openItem(requestedItem);

        setTimeout(() => {
          requestedItem.item.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }, 250);
      }
    }
  }

  waitForDynamicCases(initializeAccordion);
})();
