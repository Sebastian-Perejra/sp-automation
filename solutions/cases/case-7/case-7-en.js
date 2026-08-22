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
      name: "Store_Kyiv_01_07_2026.xlsx",
      status: "processed",
      state: ""
    },
    {
      name: "Store_Lviv_01_07_2026.xlsx",
      status: "processed",
      state: ""
    },
    {
      name: "Store_Odesa_01_07_2026.xlsx",
      status: "processed",
      state: ""
    },
    {
      name: "Store_Dnipro_01_07_2026.xlsx",
      status: "processed",
      state: ""
    },
    {
      name: "Store_Kharkiv_01_07_2026.xlsx",
      status: "processed",
      state: ""
    },
    {
      name: "Store_Kyiv_02_07_2026.xlsx",
      status: "new file",
      state: "new"
    },
    {
      name: "Store_Lviv_02_07_2026.xlsx",
      status: "new file",
      state: "new"
    },
    {
      name: "Store_Odesa_02_07_2026.xlsx",
      status: "new file",
      state: "new"
    },
    {
      name: "Store_Dnipro_02_07_2026.xlsx",
      status: "structure error",
      state: "error"
    },
    {
      name: "Store_Kharkiv_02_07_2026.xlsx",
      status: "new file",
      state: "new"
    }
  ];

  const consolidatedRows = [
    {
      date: "01.07.2026",
      store: "Kyiv-01",
      code: "J-001",
      product: "Apple Juice 1 L",
      category: "Juices",
      startStock: 121,
      incoming: 40,
      sales: 42,
      returns: 0,
      writeOff: 1,
      endStock: 118,
      amount: 3780,
      source: "Kyiv_01_07.xlsx"
    },
    {
      date: "01.07.2026",
      store: "Kyiv-01",
      code: "W-015",
      product: "Water 1.5 L",
      category: "Water",
      startStock: 171,
      incoming: 120,
      sales: 87,
      returns: 0,
      writeOff: 0,
      endStock: 204,
      amount: 2610,
      source: "Kyiv_01_07.xlsx"
    },
    {
      date: "01.07.2026",
      store: "Lviv-03",
      code: "C-024",
      product: "Ground Coffee 250 g",
      category: "Coffee",
      startStock: 74,
      incoming: 35,
      sales: 29,
      returns: 1,
      writeOff: 0,
      endStock: 81,
      amount: 6090,
      source: "Lviv_01_07.xlsx"
    },
    {
      date: "01.07.2026",
      store: "Odesa-02",
      code: "T-008",
      product: "Black Tea 100 g",
      category: "Tea",
      startStock: 96,
      incoming: 20,
      sales: 31,
      returns: 0,
      writeOff: 1,
      endStock: 84,
      amount: 2790,
      source: "Odesa_01_07.xlsx"
    },
    {
      date: "01.07.2026",
      store: "Dnipro-04",
      code: "S-012",
      product: "Oat Cookies",
      category: "Confectionery",
      startStock: 63,
      incoming: 50,
      sales: 46,
      returns: 0,
      writeOff: 2,
      endStock: 65,
      amount: 3220,
      source: "Dnipro_01_07.xlsx"
    },
    {
      date: "01.07.2026",
      store: "Kharkiv-05",
      code: "J-004",
      product: "Orange Juice 1 L",
      category: "Juices",
      startStock: 88,
      incoming: 30,
      sales: 39,
      returns: 0,
      writeOff: 1,
      endStock: 78,
      amount: 3705,
      source: "Kharkiv_01_07.xlsx"
    },
    {
      date: "02.07.2026",
      store: "Kyiv-01",
      code: "W-015",
      product: "Water 1.5 L",
      category: "Water",
      startStock: 204,
      incoming: 100,
      sales: 92,
      returns: 1,
      writeOff: 0,
      endStock: 213,
      amount: 2760,
      source: "Kyiv_02_07.xlsx"
    },
    {
      date: "02.07.2026",
      store: "Lviv-03",
      code: "C-024",
      product: "Ground Coffee 250 g",
      category: "Coffee",
      startStock: 81,
      incoming: 0,
      sales: 28,
      returns: 0,
      writeOff: 1,
      endStock: 52,
      amount: 5880,
      source: "Lviv_02_07.xlsx"
    },
    {
      date: "02.07.2026",
      store: "Odesa-02",
      code: "T-008",
      product: "Black Tea 100 g",
      category: "Tea",
      startStock: 84,
      incoming: 0,
      sales: 27,
      returns: 0,
      writeOff: 1,
      endStock: 56,
      amount: 2430,
      source: "Odesa_02_07.xlsx"
    },
    {
      date: "02.07.2026",
      store: "Kharkiv-05",
      code: "S-012",
      product: "Oat Cookies",
      category: "Confectionery",
      startStock: 65,
      incoming: 0,
      sales: 33,
      returns: 0,
      writeOff: 2,
      endStock: 30,
      amount: 2310,
      source: "Kharkiv_02_07.xlsx"
    }
  ];

  const storesData = [
    { name: "Kyiv-01", value: 18450 },
    { name: "Lviv-03", value: 16320 },
    { name: "Odesa-02", value: 14870 },
    { name: "Kharkiv-05", value: 13240 },
    { name: "Dnipro-04", value: 11980 }
  ];

  const categoriesData = [
    { name: "Juices", value: 34, color: "#35594b" },
    { name: "Water", value: 23, color: "#2f80ed" },
    { name: "Coffee", value: 18, color: "#d7a900" },
    { name: "Tea", value: 14, color: "#8a5bd7" },
    { name: "Confectionery", value: 11, color: "#ed7d31" }
  ];

  const riskData = [
    {
      product: "Oat Cookies",
      description: "Kharkiv-05 · stock below minimum level",
      value: "30 units",
      state: "critical"
    },
    {
      product: "Ground Coffee 250 g",
      description: "Lviv-03 · approximately 2 days of stock remaining",
      value: "52 units",
      state: "warning"
    },
    {
      product: "Black Tea 100 g",
      description: "Odesa-02 · replenishment required",
      value: "56 units",
      state: "warning"
    },
    {
      product: "Orange Juice 1 L",
      description: "Kharkiv-05 · sales are increasing",
      value: "78 units",
      state: "warning"
    }
  ];

  const qualityData = [
    {
      title: "Files processed successfully",
      description: "structure matches the expected template",
      value: "998",
      state: "good"
    },
    {
      title: "Duplicates detected",
      description: "duplicate rows excluded from the consolidated dataset",
      value: "7",
      state: "warning"
    },
    {
      title: "Structure errors",
      description: "required column is missing",
      value: "2",
      state: "error"
    },
    {
      title: "Blank values",
      description: "automatically flagged for review",
      value: "14",
      state: "warning"
    }
  ];

  const loaderMessages = [
    "Scanning the shared folder…",
    "Detecting new Excel files…",
    "Validating table structures…",
    "Removing service rows and subtotals…",
    "Combining data into one consolidated dataset…",
    "Checking for duplicates and data issues…",
    "Refreshing analytics and KPIs…"
  ];

  const formatNumber = value =>
    new Intl.NumberFormat("en-US").format(value);

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
          status.textContent = "processing…";
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
            status.textContent = "structure error";
          }

          return;
        }

        if (status) {
          status.textContent = "processed";
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
            <td>${formatNumber(row.amount)} UAH</td>
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
    arrayStatus.textContent = "data refreshed";
    arrayStatus.classList.add("ready");

    statFiles.textContent = "1,000";

    animateStat(statNew, 18);
    animateStat(statRows, 286450);
    animateStat(statDuplicates, 7);
    animateStat(statErrors, 2);
    animateStat(statTime, 24, " s");

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
    arrayStatus.textContent = "processing data";
    arrayStatus.classList.remove("ready");

    resetPipeline();
    markFilesAsProcessing();

    for (
      let index = 0;
      index < pipelineSteps.length;
      index++
    ) {
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

  refreshButton.addEventListener(
    "click",
    runRefresh
  );
})();
