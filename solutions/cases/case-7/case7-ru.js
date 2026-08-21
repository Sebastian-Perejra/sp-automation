(() => {
  const caseRoot = document.querySelector("#folder-consolidation-case");

  if (!caseRoot) return;

  const folderList = caseRoot.querySelector("#case7-folder-list");
  const refreshButton = caseRoot.querySelector("#case7-refresh-button");
  const loader = caseRoot.querySelector("#case7-loader");
  const loaderText = caseRoot.querySelector("#case7-loader-text");
  const result = caseRoot.querySelector("#case7-result");
  const arrayBody = caseRoot.querySelector("#case7-array-body");
  const arrayStatus = caseRoot.querySelector("#case7-array-status");
  const pipelineSteps = [
    ...caseRoot.querySelectorAll(".case7-pipeline-step")
  ];

  const statFiles = caseRoot.querySelector("#case7-stat-files");
  const statNew = caseRoot.querySelector("#case7-stat-new");
  const statRows = caseRoot.querySelector("#case7-stat-rows");
  const statDuplicates = caseRoot.querySelector(
    "#case7-stat-duplicates"
  );
  const statErrors = caseRoot.querySelector("#case7-stat-errors");
  const statTime = caseRoot.querySelector("#case7-stat-time");

  const storeBars = caseRoot.querySelector("#case7-store-bars");
  const categoryDonut = caseRoot.querySelector(
    "#case7-category-donut"
  );
  const categoryLegend = caseRoot.querySelector(
    "#case7-category-legend"
  );
  const riskList = caseRoot.querySelector("#case7-risk-list");
  const qualityList = caseRoot.querySelector(
    "#case7-quality-list"
  );

  const fileNames = [
    {
      name: "Магазин_Киев_01_07_2026.xlsx",
      status: "обработано",
      state: ""
    },
    {
      name: "Магазин_Львов_01_07_2026.xlsx",
      status: "обработано",
      state: ""
    },
    {
      name: "Магазин_Одесса_01_07_2026.xlsx",
      status: "обработано",
      state: ""
    },
    {
      name: "Магазин_Днепр_01_07_2026.xlsx",
      status: "обработано",
      state: ""
    },
    {
      name: "Магазин_Харьков_01_07_2026.xlsx",
      status: "обработано",
      state: ""
    },
    {
      name: "Магазин_Киев_02_07_2026.xlsx",
      status: "новый файл",
      state: "new"
    },
    {
      name: "Магазин_Львов_02_07_2026.xlsx",
      status: "новый файл",
      state: "new"
    },
    {
      name: "Магазин_Одесса_02_07_2026.xlsx",
      status: "новый файл",
      state: "new"
    },
    {
      name: "Магазин_Днепр_02_07_2026.xlsx",
      status: "ошибка структуры",
      state: "error"
    },
    {
      name: "Магазин_Харьков_02_07_2026.xlsx",
      status: "новый файл",
      state: "new"
    }
  ];

  const consolidatedRows = [
    {
      date: "01.07.2026",
      store: "Киев-01",
      code: "J-001",
      product: "Сок яблочный 1 л",
      category: "Соки",
      startStock: 121,
      incoming: 40,
      sales: 42,
      returns: 0,
      writeOff: 1,
      endStock: 118,
      amount: 3780,
      source: "Киев_01_07.xlsx"
    },
    {
      date: "01.07.2026",
      store: "Киев-01",
      code: "W-015",
      product: "Вода 1,5 л",
      category: "Вода",
      startStock: 171,
      incoming: 120,
      sales: 87,
      returns: 0,
      writeOff: 0,
      endStock: 204,
      amount: 2610,
      source: "Киев_01_07.xlsx"
    },
    {
      date: "01.07.2026",
      store: "Львов-03",
      code: "C-024",
      product: "Кофе молотый 250 г",
      category: "Кофе",
      startStock: 74,
      incoming: 35,
      sales: 29,
      returns: 1,
      writeOff: 0,
      endStock: 81,
      amount: 6090,
      source: "Львов_01_07.xlsx"
    },
    {
      date: "01.07.2026",
      store: "Одесса-02",
      code: "T-008",
      product: "Чай чёрный 100 г",
      category: "Чай",
      startStock: 96,
      incoming: 20,
      sales: 31,
      returns: 0,
      writeOff: 1,
      endStock: 84,
      amount: 2790,
      source: "Одесса_01_07.xlsx"
    },
    {
      date: "01.07.2026",
      store: "Днепр-04",
      code: "S-012",
      product: "Печенье овсяное",
      category: "Сладости",
      startStock: 63,
      incoming: 50,
      sales: 46,
      returns: 0,
      writeOff: 2,
      endStock: 65,
      amount: 3220,
      source: "Днепр_01_07.xlsx"
    },
    {
      date: "01.07.2026",
      store: "Харьков-05",
      code: "J-004",
      product: "Сок апельсиновый 1 л",
      category: "Соки",
      startStock: 88,
      incoming: 30,
      sales: 39,
      returns: 0,
      writeOff: 1,
      endStock: 78,
      amount: 3705,
      source: "Харьков_01_07.xlsx"
    },
    {
      date: "02.07.2026",
      store: "Киев-01",
      code: "W-015",
      product: "Вода 1,5 л",
      category: "Вода",
      startStock: 204,
      incoming: 100,
      sales: 92,
      returns: 1,
      writeOff: 0,
      endStock: 213,
      amount: 2760,
      source: "Киев_02_07.xlsx"
    },
    {
      date: "02.07.2026",
      store: "Львов-03",
      code: "C-024",
      product: "Кофе молотый 250 г",
      category: "Кофе",
      startStock: 81,
      incoming: 0,
      sales: 28,
      returns: 0,
      writeOff: 1,
      endStock: 52,
      amount: 5880,
      source: "Львов_02_07.xlsx"
    },
    {
      date: "02.07.2026",
      store: "Одесса-02",
      code: "T-008",
      product: "Чай чёрный 100 г",
      category: "Чай",
      startStock: 84,
      incoming: 0,
      sales: 27,
      returns: 0,
      writeOff: 1,
      endStock: 56,
      amount: 2430,
      source: "Одесса_02_07.xlsx"
    },
    {
      date: "02.07.2026",
      store: "Харьков-05",
      code: "S-012",
      product: "Печенье овсяное",
      category: "Сладости",
      startStock: 65,
      incoming: 0,
      sales: 33,
      returns: 0,
      writeOff: 2,
      endStock: 30,
      amount: 2310,
      source: "Харьков_02_07.xlsx"
    }
  ];
    const storesData = [
    { name: "Киев-01", value: 18450 },
    { name: "Львов-03", value: 16320 },
    { name: "Одесса-02", value: 14870 },
    { name: "Харьков-05", value: 13240 },
    { name: "Днепр-04", value: 11980 }
  ];

  const categoriesData = [
    { name: "Соки", value: 34, color: "#35594b" },
    { name: "Вода", value: 23, color: "#2f80ed" },
    { name: "Кофе", value: 18, color: "#d7a900" },
    { name: "Чай", value: 14, color: "#8a5bd7" },
    { name: "Сладости", value: 11, color: "#ed7d31" }
  ];

  const riskData = [
    {
      product: "Печенье овсяное",
      description: "Харьков-05 · остаток ниже минимального",
      value: "30 шт.",
      state: "critical"
    },
    {
      product: "Кофе молотый 250 г",
      description: "Львов-03 · запас примерно на 2 дня",
      value: "52 шт.",
      state: "warning"
    },
    {
      product: "Чай чёрный 100 г",
      description: "Одесса-02 · требуется пополнение",
      value: "56 шт.",
      state: "warning"
    },
    {
      product: "Сок апельсиновый 1 л",
      description: "Харьков-05 · продажи растут",
      value: "78 шт.",
      state: "warning"
    }
  ];

  const qualityData = [
    {
      title: "Файлы успешно обработаны",
      description: "структура соответствует шаблону",
      value: "998",
      state: "good"
    },
    {
      title: "Выявлены дубликаты",
      description: "строки исключены из общего массива",
      value: "7",
      state: "warning"
    },
    {
      title: "Ошибки структуры",
      description: "отсутствует обязательная колонка",
      value: "2",
      state: "error"
    },
    {
      title: "Пустые значения",
      description: "автоматически отмечены для проверки",
      value: "14",
      state: "warning"
    }
  ];

  const loaderMessages = [
    "Сканирование общей папки…",
    "Поиск новых Excel-файлов…",
    "Проверка структуры таблиц…",
    "Удаление служебных строк и итогов…",
    "Объединение данных в единый массив…",
    "Проверка дубликатов и ошибок…",
    "Обновление аналитики и KPI…"
  ];

  const formatNumber = value =>
    new Intl.NumberFormat("ru-RU").format(value);

  const sleep = delay =>
    new Promise(resolve => setTimeout(resolve, delay));

  function renderFolderFiles() {
    folderList.innerHTML = fileNames
      .map(
        file => `
          <div class="case7-folder-file ${file.state}">
            <span class="case7-file-icon">XLSX</span>

            <span>${file.name}</span>

            <small class="case7-file-status">
              ${file.status}
            </small>
          </div>
        `
      )
      .join("");
  }

  function resetPipeline() {
    pipelineSteps.forEach(step => {
      step.classList.remove("active", "done");
    });
  }

  function activatePipelineStep(index) {
    pipelineSteps.forEach((step, stepIndex) => {
      step.classList.toggle("active", stepIndex === index);
      step.classList.toggle("done", stepIndex < index);
    });
  }

  function completePipeline() {
    pipelineSteps.forEach(step => {
      step.classList.remove("active");
      step.classList.add("done");
    });
  }

  function markFilesAsProcessing() {
    const files = [
      ...folderList.querySelectorAll(".case7-folder-file")
    ];

    files.forEach((file, index) => {
      setTimeout(() => {
        file.classList.remove("new", "error");
        file.classList.add("processing");

        const status = file.querySelector(".case7-file-status");

        if (status) {
          status.textContent = "обработка…";
        }
      }, index * 90);
    });
  }

  function markFilesAsComplete() {
    const files = [
      ...folderList.querySelectorAll(".case7-folder-file")
    ];

    files.forEach((file, index) => {
      setTimeout(() => {
        file.classList.remove("processing");

        const status = file.querySelector(".case7-file-status");

        if (index === 8) {
          file.classList.add("error");

          if (status) {
            status.textContent = "ошибка структуры";
          }

          return;
        }

        if (status) {
          status.textContent = "обработано";
        }
      }, index * 70);
    });
  }

  function renderArrayRows() {
    arrayBody.innerHTML = consolidatedRows
      .map(
        (row, index) => `
          <tr
            class="${
              index === 3
                ? "duplicate"
                : index === 8
                  ? "error"
                  : ""
            }"
          >
            <td>${row.date}</td>
            <td>${row.store}</td>
            <td>${row.code}</td>
            <td>${row.product}</td>
            <td>${row.category}</td>
            <td>${formatNumber(row.startStock)}</td>
            <td>${formatNumber(row.incoming)}</td>
            <td>${formatNumber(row.sales)}</td>
            <td>${formatNumber(row.returns)}</td>
            <td>${formatNumber(row.writeOff)}</td>
            <td>${formatNumber(row.endStock)}</td>
            <td>${formatNumber(row.amount)} грн</td>
            <td>${row.source}</td>
          </tr>
        `
      )
      .join("");

    const rows = [...arrayBody.querySelectorAll("tr")];

    rows.forEach((row, index) => {
      setTimeout(() => {
        row.classList.add("show");
      }, index * 90);
    });
  }

  function renderStoreBars() {
    const maxValue = Math.max(
      ...storesData.map(store => store.value)
    );

    storeBars.innerHTML = storesData
      .map(
        store => `
          <div class="case7-store-row">
            <span>${store.name}</span>

            <div class="case7-store-track">
              <div
                class="case7-store-fill"
                data-width="${Math.round(
                  (store.value / maxValue) * 100
                )}"
              ></div>
            </div>

            <strong>${formatNumber(store.value)}</strong>
          </div>
        `
      )
      .join("");

    requestAnimationFrame(() => {
      storeBars
        .querySelectorAll(".case7-store-fill")
        .forEach((bar, index) => {
          setTimeout(() => {
            bar.style.width = `${bar.dataset.width}%`;
          }, index * 120);
        });
    });
  }
    function renderCategories() {
    const gradientParts = [];
    let currentValue = 0;

    categoriesData.forEach(category => {
      const start = currentValue;
      const end = currentValue + category.value;

      gradientParts.push(
        `${category.color} ${start}% ${end}%`
      );

      currentValue = end;
    });

    categoryDonut.style.background =
      `conic-gradient(${gradientParts.join(", ")})`;

    categoryLegend.innerHTML = categoriesData
      .map(
        category => `
          <div class="case7-category-item">
            <span class="case7-category-name">
              <span
                class="case7-category-dot"
                style="background: ${category.color}"
              ></span>

              ${category.name}
            </span>

            <strong>${category.value}%</strong>
          </div>
        `
      )
      .join("");
  }

  function renderRisks() {
    riskList.innerHTML = riskData
      .map(
        item => `
          <div class="case7-risk-item ${item.state}">
            <span class="case7-risk-dot"></span>

            <div>
              <strong>${item.product}</strong>
              <span>${item.description}</span>
            </div>

            <span class="case7-risk-value">
              ${item.value}
            </span>
          </div>
        `
      )
      .join("");
  }

  function renderQuality() {
    qualityList.innerHTML = qualityData
      .map(
        item => `
          <div class="case7-quality-item ${item.state}">
            <span class="case7-quality-dot"></span>

            <div>
              <strong>${item.title}</strong>
              <span>${item.description}</span>
            </div>

            <span class="case7-quality-value">
              ${item.value}
            </span>
          </div>
        `
      )
      .join("");
  }

  function animateStat(element, target, suffix = "") {
    const duration = 800;
    const startTime = performance.now();

    function update(currentTime) {
      const progress = Math.min(
        (currentTime - startTime) / duration,
        1
      );

      const value = Math.round(target * progress);

      element.textContent = `${formatNumber(value)}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  function showResult() {
    result.classList.add("visible");
    arrayStatus.textContent = "данные обновлены";
    arrayStatus.classList.add("ready");

    statFiles.textContent = "1 000";

    animateStat(statNew, 18);
    animateStat(statRows, 286450);
    animateStat(statDuplicates, 7);
    animateStat(statErrors, 2);
    animateStat(statTime, 24, " с");

    renderArrayRows();
    renderStoreBars();
    renderCategories();
    renderRisks();
    renderQuality();

    setTimeout(() => {
      result.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 350);
  }

  async function runRefresh() {
    refreshButton.disabled = true;
    loader.classList.add("active");
    result.classList.remove("visible");
    arrayStatus.textContent = "обработка данных";
    arrayStatus.classList.remove("ready");

    resetPipeline();
    markFilesAsProcessing();

    for (let index = 0; index < pipelineSteps.length; index++) {
      activatePipelineStep(index);
      loaderText.textContent = loaderMessages[index];
      await sleep(700);
    }

    loaderText.textContent = loaderMessages[6];
    await sleep(600);

    completePipeline();
    markFilesAsComplete();
    showResult();

    loader.classList.remove("active");
    refreshButton.disabled = false;
  }

  renderFolderFiles();
  renderCategories();
  renderRisks();
  renderQuality();

  refreshButton.addEventListener("click", runRefresh);
})();
