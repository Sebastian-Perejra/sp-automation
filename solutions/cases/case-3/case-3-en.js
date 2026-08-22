(() => {
  const rawBody =
    document.getElementById("dashboard-raw-body");

  const buildButton =
    document.getElementById("dashboard-build");

  const rawBlock =
    document.getElementById("dashboard-raw");

  const loader =
    document.getElementById("dashboard-loader");

  const output =
    document.getElementById("dashboard-output");

  if (
    !rawBody ||
    !buildButton ||
    !rawBlock ||
    !loader ||
    !output
  ) {
    return;
  }

  const products = [
    ["HP 15 Laptop", "Laptops", 23000],
    ["Dell Inspiron 3520", "Laptops", 28500],
    ["Lenovo IdeaPad 3", "Laptops", 26400],
    ["LG 24 Monitor", "Monitors", 9000],
    ["Samsung 27 Monitor", "Monitors", 11800],
    ["Logitech M185 Mouse", "Accessories", 450],
    ["A4Tech Keyboard", "Accessories", 750],
    ["Kingston 1TB SSD", "Components", 3200],
    ["TP-Link Router", "Networking", 2100],
    ["Canon Printer", "Office Equipment", 7600]
  ];

  const clients = [
    "Alpha LLC",
    "Beta LLC",
    "Gamma LLC",
    "Delta LLC",
    "Ivanenko",
    "Petrenko",
    "Omega LLC",
    "Vector LLC",
    "Prime LLC",
    "Kovalenko"
  ];

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];

  const categoryColors = [
    "#3478e5",
    "#0f9d58",
    "#f5aa20",
    "#8854d0",
    "#db5f57",
    "#4aa5a5"
  ];

  const data = [];

  const startDate =
    new Date(2023, 0, 3);

  for (let i = 0; i < 200; i++) {
    const date =
      new Date(startDate);

    date.setDate(
      startDate.getDate() + i * 3
    );

    const product =
      products[i % products.length];

    const client =
      clients[(i * 3) % clients.length];

    const quantity =
      1 + ((i * 7) % 12);

    const amount =
      product[2] * quantity;

    data.push({
      id: i + 1,
      date,
      year: date.getFullYear(),
      month: date.getMonth(),
      day: date.getDate(),
      product: product[0],
      category: product[1],
      client,
      quantity,
      amount
    });
  }

  const filters = {
    year: new Set(),
    month: new Set(),
    category: new Set(),
    client: new Set()
  };

  let isBuilt = false;

  function formatNumber(value) {
    return Math.round(value)
      .toLocaleString("en-US");
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function uniqueValues(key) {
    return Array.from(
      new Set(data.map(row => row[key]))
    ).sort((a, b) => {
      if (
        typeof a === "number" &&
        typeof b === "number"
      ) {
        return a - b;
      }

      return String(a)
        .localeCompare(String(b), "en");
    });
  }

  function renderRawRows() {
    rawBody.innerHTML =
      data.map(row => `
        <tr>
          <td>${row.date.toLocaleDateString("en-US")}</td>
          <td>${row.year}</td>
          <td>${row.date.toLocaleDateString("en-US", { month: "long" })}</td>
          <td>${row.day}</td>
          <td>${escapeHtml(row.product)}</td>
          <td>${escapeHtml(row.category)}</td>
          <td>${escapeHtml(row.client)}</td>
          <td>${row.quantity}</td>
          <td>${formatNumber(row.amount)}</td>
        </tr>
      `).join("");
  }

  function createSlicer(
    containerId,
    values,
    filterName,
    formatter = value => value
  ) {
    const container =
      document.getElementById(containerId);

    if (!container) {
      return;
    }

    container.innerHTML =
      values.map(value => `
        <button
          type="button"
          class="dashboard-slicer-option"
          data-filter="${filterName}"
          data-value="${escapeHtml(value)}"
        >
          ${escapeHtml(formatter(value))}
        </button>
      `).join("");
  }

  function renderSlicers() {
    createSlicer(
      "dashboard-slicer-year",
      uniqueValues("year"),
      "year"
    );

    createSlicer(
      "dashboard-slicer-month",
      Array.from({ length: 12 }, (_, index) => index),
      "month",
      value => monthNames[value]
    );

    createSlicer(
      "dashboard-slicer-category",
      uniqueValues("category"),
      "category"
    );

    createSlicer(
      "dashboard-slicer-client",
      uniqueValues("client"),
      "client"
    );
  }

  function filteredData() {
    return data.filter(row => {
      if (
        filters.year.size &&
        !filters.year.has(String(row.year))
      ) {
        return false;
      }

      if (
        filters.month.size &&
        !filters.month.has(String(row.month))
      ) {
        return false;
      }

      if (
        filters.category.size &&
        !filters.category.has(row.category)
      ) {
        return false;
      }

      if (
        filters.client.size &&
        !filters.client.has(row.client)
      ) {
        return false;
      }

      return true;
    });
  }

  function groupSum(rows, key) {
    const result = new Map();

    rows.forEach(row => {
      const groupKey =
        typeof key === "function"
          ? key(row)
          : row[key];

      result.set(
        groupKey,
        (result.get(groupKey) || 0) +
        row.amount
      );
    });

    return result;
  }

  function groupQuantity(rows, key) {
    const result = new Map();

    rows.forEach(row => {
      const groupKey =
        typeof key === "function"
          ? key(row)
          : row[key];

      const current =
        result.get(groupKey) || {
          amount: 0,
          quantity: 0,
          category: row.category
        };

      current.amount += row.amount;
      current.quantity += row.quantity;

      result.set(
        groupKey,
        current
      );
    });

    return result;
  }

  function renderKpis(rows) {
    const revenue =
      rows.reduce(
        (sum, row) => sum + row.amount,
        0
      );

    const quantity =
      rows.reduce(
        (sum, row) => sum + row.quantity,
        0
      );

    const uniqueClients =
      new Set(
        rows.map(row => row.client)
      ).size;

    const average =
      rows.length
        ? revenue / rows.length
        : 0;

    const productsRevenue =
      groupSum(rows, "product");

    const leader =
      Array.from(productsRevenue.entries())
        .sort(
          (a, b) => b[1] - a[1]
        )[0];

    document.getElementById(
      "dashboard-kpi-revenue"
    ).textContent =
      formatNumber(revenue);

    document.getElementById(
      "dashboard-kpi-quantity"
    ).textContent =
      formatNumber(quantity);

    document.getElementById(
      "dashboard-kpi-average"
    ).textContent =
      formatNumber(average);

    document.getElementById(
      "dashboard-kpi-clients"
    ).textContent =
      formatNumber(uniqueClients);

    document.getElementById(
      "dashboard-kpi-orders"
    ).textContent =
      formatNumber(rows.length);

    document.getElementById(
      "dashboard-kpi-leader"
    ).textContent =
      leader
        ? leader[0]
        : "—";

    document.getElementById(
      "dashboard-kpi-leader-value"
    ).textContent =
      leader
        ? `${formatNumber(leader[1])} UAH`
        : "0 UAH";
  }

  function renderMonthlyChart(rows) {
    const values =
      Array.from(
        { length: 12 },
        () => 0
      );

    rows.forEach(row => {
      values[row.month] += row.amount;
    });

    const max =
      Math.max(...values, 1);

    const width = 600;
    const height = 180;
    const top = 18;
    const bottom = 150;

    const points =
      values.map((value, index) => {
        const x =
          index *
          (width / 11);

        const y =
          bottom -
          (value / max) *
          (bottom - top);

        return {
          x,
          y,
          value
        };
      });

    const pointString =
      points
        .map(
          point =>
            `${point.x.toFixed(1)},${point.y.toFixed(1)}`
        )
        .join(" ");

    document.getElementById(
      "dashboard-monthly-line"
    ).setAttribute(
      "points",
      pointString
    );

    const areaPath =
      `M 0 ${bottom} ` +
      points
        .map(
          point =>
            `L ${point.x.toFixed(1)} ${point.y.toFixed(1)}`
        )
        .join(" ") +
      ` L ${width} ${bottom} Z`;

    document.getElementById(
      "dashboard-monthly-area"
    ).setAttribute(
      "d",
      areaPath
    );

    document.getElementById(
      "dashboard-month-labels"
    ).innerHTML =
      monthNames
        .map(name => `<span>${name}</span>`)
        .join("");

    const peakIndex =
      values.indexOf(
        Math.max(...values)
      );

    const peakNode =
      document.getElementById(
        "dashboard-peak-month"
      );

    if (
      rows.length &&
      values[peakIndex] > 0
    ) {
      peakNode.textContent =
        `${monthNames[peakIndex]} · ${formatNumber(values[peakIndex])} UAH`;
    } else {
      peakNode.textContent = "—";
    }
  }

  function renderYearsChart(rows) {
    const container =
      document.getElementById(
        "dashboard-years-chart"
      );

    const years =
      Array.from(
        groupSum(rows, "year").entries()
      ).sort(
        (a, b) => a[0] - b[0]
      );

    if (!years.length) {
      container.innerHTML = "";
      return;
    }

    const max =
      Math.max(
        ...years.map(item => item[1]),
        1
      );

    container.innerHTML =
      years.map(([year, value]) => {
        const height =
          50 +
          (value / max) * 100;

        return `
          <div class="year-column">
            <b>${formatNumber(value)}</b>

            <i
              style="height:${height}px;"
            ></i>

            <span>${year}</span>
          </div>
        `;
      }).join("");
  }

  function renderCategoryChart(rows) {
    const donut =
      document.getElementById(
        "dashboard-category-donut"
      );

    const legend =
      document.getElementById(
        "dashboard-category-legend"
      );

    const grouped =
      Array.from(
        groupSum(rows, "category").entries()
      ).sort(
        (a, b) => b[1] - a[1]
      );

    const total =
      grouped.reduce(
        (sum, item) => sum + item[1],
        0
      );

    if (!total) {
      donut.style.background =
        "#ece8e3";

      legend.innerHTML = "";
      return;
    }

    let cursor = 0;

    const gradients = [];

    grouped.forEach(
      ([category, value], index) => {
        const percentage =
          value / total * 100;

        const start = cursor;
        const end =
          cursor + percentage;

        const color =
          categoryColors[
            index % categoryColors.length
          ];

        gradients.push(
          `${color} ${start}% ${end}%`
        );

        cursor = end;
      }
    );

    donut.style.background =
      `conic-gradient(${gradients.join(",")})`;

    legend.innerHTML =
      grouped.map(
        ([category, value], index) => {
          const percentage =
            value / total * 100;

          const color =
            categoryColors[
              index % categoryColors.length
            ];

          return `
            <div>
              <span class="category-name">
                <span
                  class="category-dot"
                  style="background:${color};"
                ></span>

                ${escapeHtml(category)}
              </span>

              <strong>
                ${percentage.toFixed(1)}%
              </strong>
            </div>
          `;
        }
      ).join("");
  }

  function renderProducts(rows) {
    const container =
      document.getElementById(
        "dashboard-products-bars"
      );

    const grouped =
      Array.from(
        groupSum(rows, "product").entries()
      )
        .sort(
          (a, b) => b[1] - a[1]
        )
        .slice(0, 6);

    if (!grouped.length) {
      container.innerHTML = "";
      return;
    }

    const max =
      Math.max(
        ...grouped.map(item => item[1]),
        1
      );

    container.innerHTML =
      grouped.map(
        ([product, value]) => {
          const width =
            value / max * 100;

          return `
            <div class="product-bar-row">
              <span>
                ${escapeHtml(product)}
              </span>

              <div class="product-track">
                <div
                  class="product-fill"
                  style="width:${width}%;"
                ></div>
              </div>

              <span class="product-value">
                ${formatNumber(value)}
              </span>
            </div>
          `;
        }
      ).join("");
  }

  function renderDetailTable(rows) {
    const body =
      document.getElementById(
        "dashboard-detail-body"
      );

    const grouped =
      Array.from(
        groupQuantity(rows, "product").entries()
      )
        .sort(
          (a, b) =>
            b[1].amount -
            a[1].amount
        )
        .slice(0, 7);

    const total =
      rows.reduce(
        (sum, row) =>
          sum + row.amount,
        0
      );

    body.innerHTML =
      grouped.map(
        ([product, item]) => {
          const share =
            total
              ? item.amount / total * 100
              : 0;

          return `
            <tr>
              <td>${escapeHtml(product)}</td>
              <td>${escapeHtml(item.category)}</td>
              <td>${formatNumber(item.quantity)}</td>
              <td>${formatNumber(item.amount)} UAH</td>
              <td>${share.toFixed(1)}%</td>
            </tr>
          `;
        }
      ).join("");

    document.getElementById(
      "dashboard-detail-count"
    ).textContent =
      `${grouped.length} positions`;
  }

  function updateFilterLabels() {
    const map = [
      [
        "year",
        "dashboard-year-count"
      ],
      [
        "month",
        "dashboard-month-count"
      ],
      [
        "category",
        "dashboard-category-count"
      ],
      [
        "client",
        "dashboard-client-count"
      ]
    ];

    map.forEach(
      ([filterName, nodeId]) => {
        const node =
          document.getElementById(nodeId);

        const size =
          filters[filterName].size;

        node.textContent =
          size
            ? `${size} selected`
            : "All";
      }
    );
  }

  function syncSlicerButtons() {
    document
      .querySelectorAll(
        ".dashboard-slicer-option"
      )
      .forEach(button => {
        const filterName =
          button.dataset.filter;

        const value =
          button.dataset.value;

        button.classList.toggle(
          "active",
          filters[filterName].has(value)
        );
      });
  }

  function renderDashboard() {
    const rows =
      filteredData();

    const status =
      document.getElementById(
        "dashboard-filter-status"
      );

    const empty =
      document.getElementById(
        "dashboard-empty-state"
      );

    status.textContent =
      `${rows.length} of ${data.length} rows in the current selection`;

    empty.hidden =
      rows.length > 0;

    renderKpis(rows);
    renderMonthlyChart(rows);
    renderYearsChart(rows);
    renderCategoryChart(rows);
    renderProducts(rows);
    renderDetailTable(rows);
    updateFilterLabels();
    syncSlicerButtons();

    const progress =
      rows.length / data.length * 100;

    document.getElementById(
      "dashboard-progress-value"
    ).textContent =
      `${rows.length} / ${data.length}`;

    document.getElementById(
      "dashboard-progress-bar"
    ).style.width =
      `${progress}%`;
  }

  function toggleFilter(
    filterName,
    value
  ) {
    const set =
      filters[filterName];

    if (set.has(value)) {
      set.delete(value);
    } else {
      set.add(value);
    }

    renderDashboard();
  }

  document.addEventListener(
    "click",
    event => {
      const option =
        event.target.closest(
          ".dashboard-slicer-option"
        );

      if (
        option &&
        output.contains(option)
      ) {
        toggleFilter(
          option.dataset.filter,
          option.dataset.value
        );

        return;
      }

      const reset =
        event.target.closest(
          "#dashboard-reset-filters"
        );

      if (reset) {
        Object.values(filters)
          .forEach(set => set.clear());

        renderDashboard();
      }
    }
  );

  buildButton.addEventListener(
    "click",
    () => {
      if (isBuilt) {
        output.classList.remove(
          "visible"
        );

        rawBlock.classList.remove(
          "hidden"
        );

        buildButton.textContent =
          "⚙ Build dashboard";

        isBuilt = false;

        return;
      }

      buildButton.disabled = true;

      buildButton.textContent =
        "Processing data…";

      loader.classList.add(
        "active"
      );

      setTimeout(() => {
        rawBlock.classList.add(
          "hidden"
        );

        loader.classList.remove(
          "active"
        );

        output.classList.add(
          "visible"
        );

        buildButton.disabled = false;

        buildButton.textContent =
          "↩ Show raw data";

        isBuilt = true;

        renderDashboard();
      }, 1100);
    }
  );

  renderRawRows();
  renderSlicers();
})();
