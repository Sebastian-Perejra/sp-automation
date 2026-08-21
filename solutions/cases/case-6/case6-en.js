(() => {
  const $ = (id) => document.getElementById(id);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));

  const rawBody = $("case6-raw-body");
  const rawPanel = $("case6-raw-panel");
  const buildButton = $("case6-build-button");
  const loader = $("case6-loader");
  const loaderText = $("case6-loader-text");
  const pipelineSteps = $$("[data-case6-step]");
  const dashboard = $("case6-dashboard");

  const filterYear = $("case6-filter-year");
  const filterQuarter = $("case6-filter-quarter");
  const filterRegion = $("case6-filter-region");
  const filterChannel = $("case6-filter-channel");
  const filterManager = $("case6-filter-manager");
  const filterCategory = $("case6-filter-category");
  const activeFilters = $("case6-active-filters");
  const resetFiltersButton = $("case6-reset-filters");

  const metricButtons = $$("[data-case6-metric]");
  const menuButtons = $$("[data-case6-page]");
  const visualResetButtons = $$("[data-case6-clear]");

  const yearChart = $("case6-year-chart");
  const categoryDonut = $("case6-category-donut");
  const categoryLegend = $("case6-category-legend");
  const regionBars = $("case6-region-bars");
  const managerTable = $("case6-manager-table");
  const productBars = $("case6-product-bars");
  const alertsList = $("case6-alerts-list");
  const decompositionTree = $("case6-decomposition-tree");
  const detailBody = $("case6-detail-body");
  const detailCount = $("case6-detail-count");

  const priceSlider = $("case6-price-slider");
  const volumeSlider = $("case6-volume-slider");
  const costSlider = $("case6-cost-slider");
  const priceSliderValue = $("case6-price-slider-value");
  const volumeSliderValue = $("case6-volume-slider-value");
  const costSliderValue = $("case6-cost-slider-value");
  const whatIfReset = $("case6-what-if-reset");

  const reportsPerYear = $("case6-reports-per-year");
  const hoursPerReport = $("case6-hours-per-report");
  const employees = $("case6-employees");
  const hoursAfter = $("case6-hours-after");

  const formatNumber = (value) =>
    Math.round(value).toLocaleString("en-US");

  const formatMoney = (value) =>
    `${Math.round(value).toLocaleString("en-US")} UAH`;

  const formatMoneyShort = (value) => {
    const abs = Math.abs(value);

    if (abs >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)}M`;
    }

    if (abs >= 1_000) {
      return `${(value / 1_000).toFixed(0)}K`;
    }

    return formatNumber(value);
  };

  const formatPercent = (value, digits = 1) =>
    `${Number(value || 0).toFixed(digits)}%`;

  const sleep = (ms) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const regions = [
    {
      name: "West",
      cities: [
        "Lviv",
        "Ivano-Frankivsk",
        "Ternopil",
        "Uzhhorod"
      ]
    },
    {
      name: "Central",
      cities: [
        "Kyiv",
        "Cherkasy",
        "Vinnytsia",
        "Kropyvnytskyi"
      ]
    },
    {
      name: "North",
      cities: [
        "Zhytomyr",
        "Chernihiv",
        "Sumy",
        "Rivne"
      ]
    },
    {
      name: "South",
      cities: [
        "Odesa",
        "Mykolaiv",
        "Kherson",
        "Zaporizhzhia"
      ]
    },
    {
      name: "East",
      cities: [
        "Kharkiv",
        "Dnipro",
        "Poltava",
        "Kremenchuk"
      ]
    }
  ];

  const managers = [
    {
      name: "Natalia Koval",
      region: "West",
      factor: 1.17,
      marginBias: -0.018
    },
    {
      name: "Serhii Bondar",
      region: "South",
      factor: 0.92,
      marginBias: -0.032
    },
    {
      name: "Olena Marchenko",
      region: "Central",
      factor: 1.08,
      marginBias: 0.009
    },
    {
      name: "Mykhailo Tkachenko",
      region: "East",
      factor: 1.01,
      marginBias: -0.006
    },
    {
      name: "Viktor Levchenko",
      region: "North",
      factor: 0.96,
      marginBias: 0.014
    },
    {
      name: "Maria Savchuk",
      region: "West",
      factor: 1.04,
      marginBias: 0.021
    },
    {
      name: "Orest Melnyk",
      region: "Central",
      factor: 0.98,
      marginBias: 0.004
    },
    {
      name: "Anna Romaniuk",
      region: "South",
      factor: 0.89,
      marginBias: -0.021
    }
  ];

  const channels = [
    "National chains",
    "Regional chains",
    "Distributors",
    "HoReCa",
    "Online stores"
  ];

  const customerSegments = [
    "Key",
    "Growing",
    "Stable",
    "New",
    "At risk"
  ];

  const customers = [
    "Market Plus LLC",
    "Fresh Trade LLC",
    "Retail Group LLC",
    "Southern Network LLC",
    "West Distribution LLC",
    "City Market LLC",
    "Grand Food LLC",
    "Omega Retail LLC",
    "Alpha Trade LLC",
    "Vector Plus LLC",
    "Taste Service LLC",
    "Premium Food LLC",
    "Hotel Partner LLC",
    "Restaurant Service LLC",
    "Aqua Logistics LLC",
    "Food Hub LLC",
    "Mega Store LLC",
    "Best Market LLC",
    "Sunny Region LLC",
    "Carpathian Trade LLC",
    "Dnipro Food LLC",
    "Prime Distribution LLC",
    "Eco Marketing LLC",
    "Lime Retail LLC",
    "Pulse Trade LLC",
    "Family Market LLC",
    "Continent Food LLC",
    "New Trade LLC",
    "Fora Partner LLC",
    "Fresh Choice LLC"
  ];

  const products = [
    [
      "Juices",
      "Green Valley",
      "Apple juice 1 L",
      "Tetra Pak",
      43,
      0.68
    ],
    [
      "Juices",
      "Green Valley",
      "Orange juice 1 L",
      "Tetra Pak",
      48,
      0.69
    ],
    [
      "Juices",
      "Green Valley",
      "Tomato juice 0.95 L",
      "Tetra Pak",
      46,
      0.66
    ],
    [
      "Juices",
      "Fresh Day",
      "Multifruit 0.5 L",
      "PET",
      31,
      0.64
    ],
    [
      "Juices",
      "Fresh Day",
      "Apple and peach 0.5 L",
      "PET",
      32,
      0.65
    ],
    [
      "Water",
      "Aqua North",
      "Still water 1.5 L",
      "PET",
      24,
      0.58
    ],
    [
      "Water",
      "Aqua North",
      "Sparkling water 1.5 L",
      "PET",
      25,
      0.59
    ],
    [
      "Water",
      "Aqua North",
      "Still water 0.5 L",
      "PET",
      17,
      0.57
    ],
    [
      "Water",
      "Aqua North",
      "Sparkling water 0.5 L",
      "PET",
      18,
      0.58
    ],
    [
      "Lemonades",
      "Lemon Boom",
      "Lemon lemonade 1 L",
      "PET",
      38,
      0.63
    ],
    [
      "Lemonades",
      "Lemon Boom",
      "Orange lemonade 1 L",
      "PET",
      39,
      0.64
    ],
    [
      "Lemonades",
      "Lemon Boom",
      "Tarragon lemonade 1 L",
      "PET",
      40,
      0.65
    ],
    [
      "Lemonades",
      "Lemon Boom",
      "Cola lemonade 0.5 L",
      "PET",
      27,
      0.62
    ],
    [
      "Iced tea",
      "Ice Tea Garden",
      "Peach tea 0.5 L",
      "PET",
      29,
      0.61
    ],
    [
      "Iced tea",
      "Ice Tea Garden",
      "Lemon tea 0.5 L",
      "PET",
      29,
      0.61
    ],
    [
      "Iced tea",
      "Ice Tea Garden",
      "Mango tea 0.5 L",
      "PET",
      31,
      0.63
    ],
    [
      "Energy drinks",
      "Energy Pulse",
      "Energy Original 0.5 L",
      "Can",
      54,
      0.67
    ],
    [
      "Energy drinks",
      "Energy Pulse",
      "Energy Zero 0.5 L",
      "Can",
      56,
      0.70
    ],
    [
      "Energy drinks",
      "Energy Pulse",
      "Energy Mango 0.5 L",
      "Can",
      58,
      0.69
    ],
    [
      "Kids drinks",
      "Happy Kids",
      "Apple drink 0.2 L",
      "Tetra Pak",
      18,
      0.66
    ],
    [
      "Kids drinks",
      "Happy Kids",
      "Multifruit drink 0.2 L",
      "Tetra Pak",
      19,
      0.67
    ],
    [
      "Kids drinks",
      "Happy Kids",
      "Banana and strawberry drink 0.2 L",
      "Tetra Pak",
      20,
      0.68
    ],
    [
      "Water",
      "Aqua North",
      "Mineral water 1 L",
      "Glass",
      36,
      0.61
    ],
    [
      "Juices",
      "Green Valley",
      "Pomegranate juice 1 L",
      "Tetra Pak",
      62,
      0.72
    ],
    [
      "Juices",
      "Green Valley",
      "Cherry juice 1 L",
      "Tetra Pak",
      53,
      0.69
    ],
    [
      "Lemonades",
      "Lemon Boom",
      "Ginger lemonade 0.33 L",
      "Glass",
      34,
      0.66
    ],
    [
      "Iced tea",
      "Ice Tea Garden",
      "Green tea 1 L",
      "PET",
      43,
      0.64
    ],
    [
      "Energy drinks",
      "Energy Pulse",
      "Energy Coffee 0.33 L",
      "Can",
      52,
      0.71
    ],
    [
      "Kids drinks",
      "Happy Kids",
      "Pear drink 0.2 L",
      "Tetra Pak",
      19,
      0.67
    ],
    [
      "Water",
      "Aqua North",
      "Sports water 0.75 L",
      "PET",
      26,
      0.60
    ],
    [
      "Juices",
      "Fresh Day",
      "Berry smoothie 0.3 L",
      "PET",
      49,
      0.72
    ],
    [
      "Juices",
      "Fresh Day",
      "Mango smoothie 0.3 L",
      "PET",
      51,
      0.73
    ],
    [
      "Lemonades",
      "Lemon Boom",
      "Classic tonic 0.33 L",
      "Can",
      32,
      0.65
    ],
    [
      "Iced tea",
      "Ice Tea Garden",
      "Raspberry tea 0.5 L",
      "PET",
      32,
      0.64
    ],
    [
      "Energy drinks",
      "Energy Pulse",
      "Energy Citrus 0.5 L",
      "Can",
      57,
      0.69
    ]
  ];

  const categoryColors = {
    "Juices": "#f2c811",
    "Water": "#2f80ed",
    "Lemonades": "#00a36c",
    "Iced tea": "#8a5bd7",
    "Energy drinks": "#ed7d31",
    "Kids drinks": "#6f7683"
  };

  const state = {
    built: false,
    metric: "revenue",
    filters: {
      year: "all",
      quarter: "all",
      region: "all",
      channel: "all",
      manager: "all",
      category: "all"
    }
  };

  function createData() {
    const rows = [];

    const yearCounts = {
      2024: 145,
      2025: 170,
      2026: 185
    };

    Object.entries(yearCounts).forEach(
      ([yearString, count]) => {
        const year = Number(yearString);

        for (let i = 0; i < count; i++) {
          const month =
            (i * 7 + year) % 12;

          const day =
            1 + ((i * 11 + year) % 27);

          const date =
            new Date(year, month, day);

          const quarter =
            `Q${Math.floor(month / 3) + 1}`;

          const region =
            regions[
              (i * 3 + year) % regions.length
            ];

          const managerCandidates =
            managers.filter(
              (item) =>
                item.region === region.name
            );

          const manager =
            managerCandidates[
              (i + year) %
              managerCandidates.length
            ];

          const product =
            products[
              (i * 5 + year + month) %
              products.length
            ];

          const category = product[0];
          const brand = product[1];
          const productName = product[2];
          const packaging = product[3];
          const basePrice = product[4];
          const baseCostRate = product[5];

          const channel =
            channels[
              (i * 2 + month) %
              channels.length
            ];

          const customer =
            customers[
              (i * 7 + month + year) %
              customers.length
            ];

          const segment =
            customerSegments[
              (i * 5 + year) %
              customerSegments.length
            ];

          const seasonalFactor =
            category === "Water" ||
            category === "Lemonades"
              ? [
                  0.85,
                  0.88,
                  0.95,
                  1.06,
                  1.18,
                  1.31,
                  1.36,
                  1.28,
                  1.12,
                  0.98,
                  0.90,
                  0.86
                ][month]
              : category === "Juices"
                ? [
                    1.18,
                    1.14,
                    1.06,
                    0.98,
                    0.93,
                    0.88,
                    0.84,
                    0.86,
                    0.96,
                    1.08,
                    1.17,
                    1.24
                  ][month]
                : category === "Energy drinks"
                  ? [
                      1.00,
                      1.01,
                      1.03,
                      1.05,
                      1.08,
                      1.10,
                      1.11,
                      1.12,
                      1.13,
                      1.15,
                      1.17,
                      1.20
                    ][month]
                  : 1;

          const yearGrowth =
            year === 2024
              ? 1
              : year === 2025
                ? 1.13
                : 1.28;

          const regionFactor =
            region.name === "West"
              ? 1.16
              : region.name === "Central"
                ? 1.12
                : region.name === "North"
                  ? 0.97
                  : region.name === "East"
                    ? 1.02
                    : 0.88;

          const channelFactor =
            channel === "National chains"
              ? 1.24
              : channel === "Distributors"
                ? 1.10
                : channel === "HoReCa"
                  ? 0.82
                  : channel === "Online stores"
                    ? 0.72
                    : 1;

          const baseQuantity =
            70 +
            (
              i * 43 +
              month * 29 +
              year
            ) % 780;

          const quantity =
            Math.max(
              24,
              Math.round(
                baseQuantity *
                seasonalFactor *
                yearGrowth *
                regionFactor *
                manager.factor *
                channelFactor
              )
            );

          const discount =
            channel === "National chains"
              ? 0.09 +
                (i % 5) * 0.005
              : channel === "Distributors"
                ? 0.05 +
                  (i % 4) * 0.004
                : channel === "Regional chains"
                  ? 0.035 +
                    (i % 3) * 0.004
                  : 0.015 +
                    (i % 3) * 0.003;

          const inflation =
            year === 2024
              ? 1
              : year === 2025
                ? 1.08
                : 1.17;

          const unitPrice =
            basePrice *
            inflation *
            (1 - discount);

          let costRate =
            baseCostRate +
            manager.marginBias;

          if (
            year === 2026 &&
            category === "Energy drinks"
          ) {
            costRate += 0.045;
          }

          if (
            year === 2026 &&
            region.name === "South"
          ) {
            costRate += 0.025;
          }

          if (
            channel === "National chains"
          ) {
            costRate += 0.018;
          }

          costRate =
            Math.min(
              0.83,
              Math.max(0.50, costRate)
            );

          const revenue =
            quantity * unitPrice;

          const cost =
            revenue * costRate;

          const grossProfit =
            revenue - cost;

          const margin =
            revenue
              ? grossProfit / revenue
              : 0;

          const planFactor =
            year === 2024
              ? 0.98
              : year === 2025
                ? 1.03
                : region.name === "South"
                  ? 1.18
                  : 1.07;

          const plan =
            revenue *
            planFactor *
            (
              0.94 +
              (i % 7) * 0.018
            );

          const planCompletion =
            plan
              ? revenue / plan
              : 0;

          const status =
            planCompletion >= 1.03
              ? "Plan achieved"
              : planCompletion >= 0.90
                ? "Needs attention"
                : "Critical variance";

          rows.push({
            id:
              `SO-${year}-${String(i + 1)
                .padStart(4, "0")}`,
            date,
            year,
            quarter,
            month: month + 1,
            monthName:
              date.toLocaleDateString(
                "en-US",
                {
                  month: "long"
                }
              ),
            region: region.name,
            city:
              region.cities[
                (i + month) %
                region.cities.length
              ],
            channel,
            manager: manager.name,
            customer,
            segment,
            category,
            brand,
            product: productName,
            packaging,
            quantity,
            unitPrice,
            revenue,
            cost,
            grossProfit,
            margin,
            discount,
            plan,
            planCompletion,
            status
          });
        }
      }
    );

    return rows.sort(
      (a, b) => a.date - b.date
    );
  }

  const data = createData();

  function renderRawTable() {
    rawBody.innerHTML =
      data.map((row) => `
        <tr>
          <td>
            ${row.date.toLocaleDateString("en-US")}
          </td>
          <td>${row.year}</td>
          <td>${row.quarter}</td>
          <td>${row.monthName}</td>
          <td>${row.id}</td>
          <td>${row.region}</td>
          <td>${row.city}</td>
          <td>${row.channel}</td>
          <td>${row.manager}</td>
          <td>${row.customer}</td>
          <td>${row.segment}</td>
          <td>${row.category}</td>
          <td>${row.brand}</td>
          <td>${row.product}</td>
          <td>${row.packaging}</td>
          <td>${formatNumber(row.quantity)}</td>
          <td>${row.unitPrice.toFixed(2)}</td>
          <td>${formatNumber(row.revenue)}</td>
          <td>${formatNumber(row.cost)}</td>
          <td>${formatNumber(row.grossProfit)}</td>
          <td>${formatPercent(row.margin * 100)}</td>
          <td>${formatPercent(row.discount * 100)}</td>
          <td>${formatNumber(row.plan)}</td>
          <td>
            ${formatPercent(
              row.planCompletion * 100
            )}
          </td>
          <td>${row.status}</td>
        </tr>
      `).join("");
  }

  function fillSelect(
    select,
    values,
    allLabel
  ) {
    select.innerHTML =
      `<option value="all">${allLabel}</option>` +
      values
        .map(
          (value) =>
            `<option value="${value}">
              ${value}
            </option>`
        )
        .join("");
  }

  function initializeFilters() {
    fillSelect(
      filterRegion,
      [
        ...new Set(
          data.map((row) => row.region)
        )
      ],
      "All regions"
    );

    fillSelect(
      filterChannel,
      [
        ...new Set(
          data.map((row) => row.channel)
        )
      ],
      "All channels"
    );

    fillSelect(
      filterManager,
      [
        ...new Set(
          data.map((row) => row.manager)
        )
      ],
      "All managers"
    );

    fillSelect(
      filterCategory,
      [
        ...new Set(
          data.map((row) => row.category)
        )
      ],
      "All categories"
    );
  }

  function getFilteredData(
    ignoreKey = null
  ) {
    return data.filter((row) => {
      const f = state.filters;

      return (
        (
          ignoreKey === "year" ||
          f.year === "all" ||
          String(row.year) === f.year
        ) &&
        (
          ignoreKey === "quarter" ||
          f.quarter === "all" ||
          row.quarter === f.quarter
        ) &&
        (
          ignoreKey === "region" ||
          f.region === "all" ||
          row.region === f.region
        ) &&
        (
          ignoreKey === "channel" ||
          f.channel === "all" ||
          row.channel === f.channel
        ) &&
        (
          ignoreKey === "manager" ||
          f.manager === "all" ||
          row.manager === f.manager
        ) &&
        (
          ignoreKey === "category" ||
          f.category === "all" ||
          row.category === f.category
        )
      );
    });
  }

  function summarize(rows) {
    const revenue =
      rows.reduce(
        (sum, row) =>
          sum + row.revenue,
        0
      );

    const profit =
      rows.reduce(
        (sum, row) =>
          sum + row.grossProfit,
        0
      );

    const quantity =
      rows.reduce(
        (sum, row) =>
          sum + row.quantity,
        0
      );

    const plan =
      rows.reduce(
        (sum, row) =>
          sum + row.plan,
        0
      );

    const customersCount =
      new Set(
        rows.map((row) => row.customer)
      ).size;

    return {
      revenue,
      profit,
      quantity,
      plan,
      customersCount,
      margin:
        revenue
          ? profit / revenue
          : 0,
      planCompletion:
        plan
          ? revenue / plan
          : 0
    };
  }

  function groupBy(rows, key) {
    const map = new Map();

    rows.forEach((row) => {
      const value =
        typeof key === "function"
          ? key(row)
          : row[key];

      if (!map.has(value)) {
        map.set(value, []);
      }

      map.get(value).push(row);
    });

    return map;
  }

  function metricValue(rows) {
    const summary = summarize(rows);

    if (state.metric === "profit") {
      return summary.profit;
    }

    if (state.metric === "quantity") {
      return summary.quantity;
    }

    if (state.metric === "margin") {
      return summary.margin * 100;
    }

    return summary.revenue;
  }

  function metricLabel(value) {
    if (state.metric === "margin") {
      return formatPercent(value);
    }

    if (state.metric === "quantity") {
      return formatNumber(value);
    }

    return formatMoneyShort(value);
  }
    function compareToPreviousYear(
    rows,
    field
  ) {
    const years = [
      ...new Set(
        rows.map((row) => row.year)
      )
    ].sort();

    if (!years.length) {
      return null;
    }

    const currentYear =
      state.filters.year !== "all"
        ? Number(state.filters.year)
        : years[years.length - 1];

    const previousYear =
      currentYear - 1;

    const currentRows =
      rows.filter(
        (row) =>
          row.year === currentYear
      );

    const previousRows =
      data.filter((row) => {
        return (
          row.year === previousYear &&
          (
            state.filters.quarter === "all" ||
            row.quarter ===
              state.filters.quarter
          ) &&
          (
            state.filters.region === "all" ||
            row.region ===
              state.filters.region
          ) &&
          (
            state.filters.channel === "all" ||
            row.channel ===
              state.filters.channel
          ) &&
          (
            state.filters.manager === "all" ||
            row.manager ===
              state.filters.manager
          ) &&
          (
            state.filters.category === "all" ||
            row.category ===
              state.filters.category
          )
        );
      });

    if (
      !currentRows.length ||
      !previousRows.length
    ) {
      return null;
    }

    const current =
      summarize(currentRows)[field];

    const previous =
      summarize(previousRows)[field];

    if (!previous) {
      return null;
    }

    return (
      (current - previous) /
      previous
    ) * 100;
  }

  function renderKpis(rows) {
    const summary = summarize(rows);

    const revenueChange =
      compareToPreviousYear(
        rows,
        "revenue"
      );

    const profitChange =
      compareToPreviousYear(
        rows,
        "profit"
      );

    const marginChange =
      compareToPreviousYear(
        rows,
        "margin"
      );

    $("case6-kpi-revenue").textContent =
      formatMoneyShort(summary.revenue);

    $("case6-kpi-profit").textContent =
      formatMoneyShort(summary.profit);

    $("case6-kpi-margin").textContent =
      formatPercent(
        summary.margin * 100
      );

    $("case6-kpi-plan").textContent =
      formatPercent(
        summary.planCompletion * 100
      );

    $("case6-kpi-quantity").textContent =
      formatNumber(summary.quantity);

    $("case6-kpi-customers").textContent =
      formatNumber(
        summary.customersCount
      );

    $("case6-kpi-revenue-change")
      .textContent =
        revenueChange === null
          ? "no comparison data"
          : `${revenueChange >= 0 ? "▲" : "▼"} ${formatPercent(
              Math.abs(revenueChange)
            )} versus previous year`;

    $("case6-kpi-profit-change")
      .textContent =
        profitChange === null
          ? "no comparison data"
          : `${profitChange >= 0 ? "▲" : "▼"} ${formatPercent(
              Math.abs(profitChange)
            )} versus previous year`;

    $("case6-kpi-margin-change")
      .textContent =
        marginChange === null
          ? "no comparison data"
          : `${marginChange >= 0 ? "▲" : "▼"} ${formatPercent(
              Math.abs(marginChange),
              2
            )} versus previous year`;

    $("case6-kpi-plan-status")
      .textContent =
        summary.planCompletion >= 1
          ? "Plan achieved"
          : summary.planCompletion >= 0.9
            ? "Needs attention"
            : "Critical variance";
  }

  function renderExecutiveSummary(rows) {
    const summary = summarize(rows);

    const byCategory = [
      ...groupBy(
        rows,
        "category"
      ).entries()
    ]
      .map(([name, list]) => ({
        name,
        value:
          summarize(list).revenue
      }))
      .sort(
        (a, b) =>
          b.value - a.value
      );

    const byRegion = [
      ...groupBy(
        rows,
        "region"
      ).entries()
    ]
      .map(([name, list]) => ({
        name,
        value:
          summarize(list).revenue
      }))
      .sort(
        (a, b) =>
          b.value - a.value
      );

    const revenueChange =
      compareToPreviousYear(
        rows,
        "revenue"
      );

    const profitChange =
      compareToPreviousYear(
        rows,
        "profit"
      );

    const topCategory =
      byCategory[0]?.name || "—";

    const topRegion =
      byRegion[0]?.name || "—";

    const changeText =
      revenueChange === null
        ? "There is not enough data in the selected view to compare it with the previous year."
        : `Revenue ${
            revenueChange >= 0
              ? "increased"
              : "decreased"
          } by ${formatPercent(
            Math.abs(revenueChange)
          )}, while gross profit ${
            profitChange >= 0
              ? "increased"
              : "decreased"
          } by ${formatPercent(
            Math.abs(
              profitChange || 0
            )
          )}.`;

    $("case6-executive-text")
      .textContent =
        `${changeText} The largest sales contribution comes from “${topCategory}”, while “${topRegion}” is the leading region. Current margin is ${formatPercent(
          summary.margin * 100
        )}, and plan achievement is ${formatPercent(
          summary.planCompletion * 100
        )}.`;
  }

  function renderYearChart(rows) {
    const sourceRows =
      getFilteredData("year");

    const groups =
      groupBy(sourceRows, "year");

    const values = [2024, 2025, 2026].map((year) => {
      const list = groups.get(year) || [];

      return {
        year,
        value: metricValue(list)
      };
    });

    const max = Math.max(
      ...values.map((item) => item.value),
      1
    );

    yearChart.innerHTML = values
      .map((item) => {
        const height = Math.max(
          8,
          (item.value / max) * 145
        );

        const active =
          state.filters.year === String(item.year)
            ? "active"
            : "";

        return `
          <div
            class="case6-year-column ${active}"
            data-case6-year="${item.year}"
          >
            <b>${metricLabel(item.value)}</b>
            <i style="height: ${height}px"></i>
            <span>${item.year}</span>
          </div>
        `;
      })
      .join("");

    $$("[data-case6-year]").forEach((node) => {
      node.addEventListener("click", () => {
        const year =
          node.dataset.case6Year;

        state.filters.year =
          state.filters.year === year
            ? "all"
            : year;

        filterYear.value =
          state.filters.year;

        renderDashboard();
      });
    });
  }

  function renderPlan(rows) {
    const summary = summarize(rows);

    const forecastFactor =
      state.filters.year === "2026" ||
      state.filters.year === "all"
        ? 1.035
        : 1.015;

    const forecast =
      summary.revenue * forecastFactor;

    const planPercent =
      summary.plan
        ? Math.min(
            120,
            (
              summary.revenue /
              summary.plan
            ) * 100
          )
        : 0;

    const forecastPercent =
      summary.plan
        ? Math.min(
            120,
            (
              forecast /
              summary.plan
            ) * 100
          )
        : 0;

    $("case6-plan-value").textContent =
      formatMoneyShort(summary.plan);

    $("case6-fact-value").textContent =
      formatMoneyShort(summary.revenue);

    $("case6-forecast-value").textContent =
      formatMoneyShort(forecast);

    $("case6-plan-fill").style.width =
      `${Math.min(100, planPercent)}%`;

    $("case6-forecast-marker").style.left =
      `${Math.min(100, forecastPercent)}%`;

    $("case6-plan-warning").textContent =
      forecastPercent >= 100
        ? `✓ At the current pace, the forecast exceeds the plan by ${formatMoney(
            Math.max(
              0,
              forecast - summary.plan
            )
          )}.`
        : `⚠ At the current pace, the plan may fall short by ${formatMoney(
            Math.max(
              0,
              summary.plan - forecast
            )
          )}.`;
  }

  function renderCategory(rows) {
    const sourceRows =
      getFilteredData("category");

    const items = [
      ...groupBy(
        sourceRows,
        "category"
      ).entries()
    ]
      .map(([name, list]) => ({
        name,
        value: metricValue(list)
      }))
      .sort(
        (a, b) =>
          b.value - a.value
      );

    const total =
      items.reduce(
        (sum, item) =>
          sum + Math.max(0, item.value),
        0
      ) || 1;

    let offset = 0;

    const segments =
      items.map((item) => {
        const share =
          (
            Math.max(0, item.value) /
            total
          ) * 100;

        const start = offset;
        const end = offset + share;

        offset = end;

        return `${
          categoryColors[item.name] ||
          "#999"
        } ${start}% ${end}%`;
      });

    categoryDonut.style.background =
      `conic-gradient(${segments.join(",")})`;

    categoryLegend.innerHTML =
      items
        .map((item) => {
          const active =
            state.filters.category ===
            item.name
              ? "active"
              : "";

          return `
            <div
              class="case6-category-item ${active}"
              data-case6-category="${item.name}"
            >
              <span class="case6-category-name">
                <i
                  class="case6-category-dot"
                  style="background: ${
                    categoryColors[item.name] ||
                    "#999"
                  }"
                ></i>

                ${item.name}
              </span>

              <strong class="case6-category-value">
                ${metricLabel(item.value)}
              </strong>
            </div>
          `;
        })
        .join("");

    $$("[data-case6-category]")
      .forEach((node) => {
        node.addEventListener("click", () => {
          const category =
            node.dataset.case6Category;

          state.filters.category =
            state.filters.category === category
              ? "all"
              : category;

          filterCategory.value =
            state.filters.category;

          renderDashboard();
        });
      });
  }

  function renderRegion(rows) {
    const sourceRows =
      getFilteredData("region");

    const items = [
      ...groupBy(
        sourceRows,
        "region"
      ).entries()
    ]
      .map(([name, list]) => ({
        name,
        value: metricValue(list)
      }))
      .sort(
        (a, b) =>
          b.value - a.value
      );

    const max =
      Math.max(
        ...items.map((item) => item.value),
        1
      );

    regionBars.innerHTML =
      items
        .map((item) => {
          const active =
            state.filters.region ===
            item.name
              ? "active"
              : "";

          const width =
            Math.max(
              4,
              (
                item.value /
                max
              ) * 100
            );

          return `
            <div
              class="case6-region-row ${active}"
              data-case6-region="${item.name}"
            >
              <span>${item.name}</span>

              <div class="case6-bar-track">
                <div
                  class="case6-bar-fill"
                  style="width: ${width}%"
                ></div>
              </div>

              <strong class="case6-bar-value">
                ${metricLabel(item.value)}
              </strong>
            </div>
          `;
        })
        .join("");

    $$("[data-case6-region]")
      .forEach((node) => {
        node.addEventListener("click", () => {
          const region =
            node.dataset.case6Region;

          state.filters.region =
            state.filters.region === region
              ? "all"
              : region;

          filterRegion.value =
            state.filters.region;

          renderDashboard();
        });
      });
  }

  function renderManagers(rows) {
    const sourceRows =
      getFilteredData("manager");

    const items = [
      ...groupBy(
        sourceRows,
        "manager"
      ).entries()
    ]
      .map(([name, list]) => {
        const summary =
          summarize(list);

        return {
          name,
          value: metricValue(list),
          revenue: summary.revenue,
          margin: summary.margin
        };
      })
      .sort(
        (a, b) =>
          b.value - a.value
      )
      .slice(0, 8);

    managerTable.innerHTML =
      items
        .map((item, index) => {
          const active =
            state.filters.manager ===
            item.name
              ? "active"
              : "";

          return `
            <div
              class="case6-manager-row ${active}"
              data-case6-manager="${item.name}"
            >
              <span class="case6-manager-rank">
                ${index + 1}
              </span>

              <div class="case6-manager-name">
                <strong>${item.name}</strong>

                <small>
                  ${formatMoneyShort(
                    item.revenue
                  )} revenue
                </small>
              </div>

              <strong class="case6-manager-value">
                ${metricLabel(item.value)}
              </strong>

              <span class="case6-manager-margin">
                ${formatPercent(
                  item.margin * 100
                )}
              </span>
            </div>
          `;
        })
        .join("");

    $$("[data-case6-manager]")
      .forEach((node) => {
        node.addEventListener("click", () => {
          const manager =
            node.dataset.case6Manager;

          state.filters.manager =
            state.filters.manager === manager
              ? "all"
              : manager;

          filterManager.value =
            state.filters.manager;

          renderDashboard();
        });
      });
  }

  function renderProducts(rows) {
    const items = [
      ...groupBy(
        rows,
        "product"
      ).entries()
    ]
      .map(([name, list]) => ({
        name,
        value: metricValue(list)
      }))
      .sort(
        (a, b) =>
          b.value - a.value
      )
      .slice(0, 8);

    const max =
      Math.max(
        ...items.map((item) => item.value),
        1
      );

    productBars.innerHTML =
      items
        .map((item) => {
          const width =
            Math.max(
              4,
              (
                item.value /
                max
              ) * 100
            );

          return `
            <div class="case6-product-row">
              <span>${item.name}</span>

              <div class="case6-bar-track">
                <div
                  class="case6-bar-fill"
                  style="width: ${width}%"
                ></div>
              </div>

              <strong class="case6-bar-value">
                ${metricLabel(item.value)}
              </strong>
            </div>
          `;
        })
        .join("");
  }
    function renderAlerts(rows) {
    const summary = summarize(rows);

    const byRegion = [
      ...groupBy(
        rows,
        "region"
      ).entries()
    ]
      .map(([name, list]) => ({
        name,
        summary: summarize(list)
      }))
      .sort(
        (a, b) =>
          a.summary.planCompletion -
          b.summary.planCompletion
      );

    const byManager = [
      ...groupBy(
        rows,
        "manager"
      ).entries()
    ]
      .map(([name, list]) => ({
        name,
        summary: summarize(list)
      }))
      .sort(
        (a, b) =>
          a.summary.margin -
          b.summary.margin
      );

    const byCategory = [
      ...groupBy(
        rows,
        "category"
      ).entries()
    ]
      .map(([name, list]) => ({
        name,
        summary: summarize(list)
      }))
      .sort(
        (a, b) =>
          b.summary.revenue -
          a.summary.revenue
      );

    const alerts = [
      {
        type:
          summary.planCompletion < 0.9
            ? "critical"
            : "warning",

        title:
          `Plan achievement: ${formatPercent(
            summary.planCompletion * 100
          )}`,

        text:
          summary.planCompletion < 1
            ? "The current view is below the planned level."
            : "The plan has been achieved, but margin should still be monitored."
      },
      {
        type:
          byRegion[0]?.summary
            .planCompletion < 0.9
            ? "critical"
            : "warning",

        title:
          `${
            byRegion[0]?.name || "Region"
          }: lowest plan achievement`,

        text:
          `Result — ${formatPercent(
            (
              byRegion[0]?.summary
                .planCompletion || 0
            ) * 100
          )}.`
      },
      {
        type:
          (
            byManager[0]?.summary.margin ||
            0
          ) < 0.2
            ? "critical"
            : "warning",

        title:
          `${
            byManager[0]?.name ||
            "Manager"
          }: lowest margin`,

        text:
          `Margin — ${formatPercent(
            (
              byManager[0]?.summary.margin ||
              0
            ) * 100
          )}.`
      },
      {
        type: "positive",

        title:
          `${
            byCategory[0]?.name ||
            "Category"
          }: sales leader`,

        text:
          `Revenue — ${formatMoneyShort(
            byCategory[0]?.summary.revenue ||
            0
          )}.`
      }
    ];

    alertsList.innerHTML =
      alerts
        .map((alert) => `
          <div class="case6-alert ${alert.type}">
            <span class="case6-alert-dot"></span>

            <div>
              <strong>${alert.title}</strong>
              <span>${alert.text}</span>
            </div>
          </div>
        `)
        .join("");
  }

  function renderDecomposition(rows) {
    const summary = summarize(rows);

    const branches = [
      ...groupBy(
        rows,
        "channel"
      ).entries()
    ]
      .map(([name, list]) => {
        const itemSummary =
          summarize(list);

        return {
          name,
          margin: itemSummary.margin,
          revenue: itemSummary.revenue
        };
      })
      .sort(
        (a, b) =>
          a.margin - b.margin
      )
      .slice(0, 4);

    decompositionTree.innerHTML = `
      <div class="case6-tree-root">
        <strong>
          Overall margin:
          ${formatPercent(
            summary.margin * 100
          )}
        </strong>

        <span>
          Main factors driving the result
        </span>
      </div>

      ${branches
        .map((branch) => `
          <div class="case6-tree-branch">
            <strong>
              ${branch.name}:
              ${formatPercent(
                branch.margin * 100
              )}
            </strong>

            <span>
              Channel revenue —
              ${formatMoneyShort(
                branch.revenue
              )}
            </span>
          </div>
        `)
        .join("")}
    `;
  }

  function renderDetails(rows) {
    detailCount.textContent =
      `${formatNumber(
        rows.length
      )} transactions`;

    detailBody.innerHTML =
      rows
        .slice()
        .sort(
          (a, b) =>
            b.date - a.date
        )
        .slice(0, 120)
        .map((row) => `
          <tr>
            <td>
              ${row.date.toLocaleDateString(
                "en-US"
              )}
            </td>

            <td>${row.manager}</td>
            <td>${row.customer}</td>
            <td>${row.product}</td>
            <td>${row.category}</td>
            <td>${row.region}</td>

            <td>
              ${formatNumber(row.quantity)}
            </td>

            <td>
              ${formatNumber(row.revenue)}
            </td>

            <td>
              ${formatNumber(
                row.grossProfit
              )}
            </td>

            <td>
              ${formatPercent(
                row.margin * 100
              )}
            </td>
          </tr>
        `)
        .join("");
  }

  function renderActiveFilters() {
    const labels = {
      year: "Year",
      quarter: "Quarter",
      region: "Region",
      channel: "Channel",
      manager: "Manager",
      category: "Category"
    };

    activeFilters.innerHTML =
      Object.entries(state.filters)
        .filter(
          ([, value]) =>
            value !== "all"
        )
        .map(([key, value]) => `
          <span class="case6-filter-chip">
            ${labels[key]}: ${value}

            <button
              type="button"
              data-case6-chip="${key}"
            >
              ×
            </button>
          </span>
        `)
        .join("");

    $$("[data-case6-chip]")
      .forEach((button) => {
        button.addEventListener("click", () => {
          const key =
            button.dataset.case6Chip;

          state.filters[key] = "all";

          syncFilterControls();
          renderDashboard();
        });
      });
  }

  function renderWhatIf(rows) {
    const summary = summarize(rows);

    const priceChange =
      Number(priceSlider.value) / 100;

    const volumeChange =
      Number(volumeSlider.value) / 100;

    const costChange =
      Number(costSlider.value) / 100;

    const scenarioRevenue =
      summary.revenue *
      (1 + priceChange) *
      (1 + volumeChange);

    const baseCostRatio =
      summary.revenue
        ? (
            summary.revenue -
            summary.profit
          ) / summary.revenue
        : 0;

    const scenarioCost =
      summary.revenue *
      baseCostRatio *
      (1 + costChange) *
      (1 + volumeChange);

    const scenarioProfit =
      scenarioRevenue -
      scenarioCost;

    const scenarioMargin =
      scenarioRevenue
        ? scenarioProfit /
          scenarioRevenue
        : 0;

    const scenarioPlan =
      summary.plan
        ? scenarioRevenue /
          summary.plan
        : 0;

    priceSliderValue.textContent =
      `${
        priceSlider.value > 0
          ? "+"
          : ""
      }${priceSlider.value}%`;

    volumeSliderValue.textContent =
      `${
        volumeSlider.value > 0
          ? "+"
          : ""
      }${volumeSlider.value}%`;

    costSliderValue.textContent =
      `+${costSlider.value}%`;

    $("case6-scenario-revenue")
      .textContent =
        formatMoneyShort(
          scenarioRevenue
        );

    $("case6-scenario-profit")
      .textContent =
        formatMoneyShort(
          scenarioProfit
        );

    $("case6-scenario-margin")
      .textContent =
        formatPercent(
          scenarioMargin * 100
        );

    $("case6-scenario-plan")
      .textContent =
        formatPercent(
          scenarioPlan * 100
        );
  }

  function renderTimeSavings() {
    const before =
      Math.max(
        0,
        Number(reportsPerYear.value)
      ) *
      Math.max(
        0,
        Number(hoursPerReport.value)
      ) *
      Math.max(
        0,
        Number(employees.value)
      );

    const after =
      Math.max(
        0,
        Number(reportsPerYear.value)
      ) *
      Math.max(
        0,
        Number(hoursAfter.value)
      ) *
      Math.max(
        0,
        Number(employees.value)
      );

    const saving =
      Math.max(
        0,
        before - after
      );

    $("case6-time-before")
      .textContent =
        `${formatNumber(
          before
        )} hrs/year`;

    $("case6-time-after")
      .textContent =
        `${formatNumber(
          after
        )} hrs/year`;

    $("case6-time-saving")
      .textContent =
        `${formatNumber(
          saving
        )} hrs/year`;
  }

  function syncFilterControls() {
    filterYear.value =
      state.filters.year;

    filterQuarter.value =
      state.filters.quarter;

    filterRegion.value =
      state.filters.region;

    filterChannel.value =
      state.filters.channel;

    filterManager.value =
      state.filters.manager;

    filterCategory.value =
      state.filters.category;
  }

  function renderDashboard() {
    const rows =
      getFilteredData();

    renderActiveFilters();
    renderKpis(rows);
    renderExecutiveSummary(rows);
    renderYearChart(rows);
    renderPlan(rows);
    renderCategory(rows);
    renderRegion(rows);
    renderManagers(rows);
    renderProducts(rows);
    renderAlerts(rows);
    renderDecomposition(rows);
    renderDetails(rows);
    renderWhatIf(rows);
  }

  async function runBuild() {
    buildButton.disabled = true;

    buildButton.textContent =
      "Refreshing model…";

    loader.classList.add("active");

    const messages = [
      "Connecting to ERP and checking the data gateway…",
      "Loading sales, customer and product tables…",
      "Cleaning and transforming data in Power Query…",
      "Refreshing data model relationships…",
      "Recalculating DAX measures and KPIs…",
      "Refreshing visualizations and cross-filtering…"
    ];

    for (
      let index = 0;
      index < pipelineSteps.length;
      index++
    ) {
      pipelineSteps.forEach(
        (step, stepIndex) => {
          step.classList.toggle(
            "active",
            stepIndex === index
          );

          if (stepIndex < index) {
            step.classList.add("done");
            step.classList.remove("active");
          }
        }
      );

      loaderText.textContent =
        messages[index];

      await sleep(520);
    }

    pipelineSteps.forEach((step) => {
      step.classList.remove("active");
      step.classList.add("done");
    });

    rawPanel.classList.add("hidden");
    dashboard.classList.add("visible");
    loader.classList.remove("active");

    state.built = true;

    renderDashboard();

    buildButton.disabled = false;

    buildButton.textContent =
      "↻ Refresh model again";
  }
    [
    [filterYear, "year"],
    [filterQuarter, "quarter"],
    [filterRegion, "region"],
    [filterChannel, "channel"],
    [filterManager, "manager"],
    [filterCategory, "category"]
  ].forEach(([select, key]) => {
    select.addEventListener(
      "change",
      () => {
        state.filters[key] =
          select.value;

        renderDashboard();
      }
    );
  });

  metricButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.metric =
        button.dataset.case6Metric;

      metricButtons.forEach((item) => {
        item.classList.toggle(
          "active",
          item === button
        );
      });

      renderDashboard();
    });
  });

  menuButtons.forEach((button) => {
    button.addEventListener("click", () => {
      menuButtons.forEach((item) => {
        item.classList.toggle(
          "active",
          item === button
        );
      });

      const titles = {
        overview:
          "Management overview",

        sales:
          "Sales analysis",

        products:
          "Product analysis",

        managers:
          "Manager performance",

        customers:
          "Customer analytics",

        risks:
          "Risks and variances"
      };

      $("case6-report-title")
        .textContent =
          titles[
            button.dataset.case6Page
          ] ||
          "Management overview";
    });
  });

  visualResetButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const key =
        button.dataset.case6Clear;

      state.filters[key] = "all";

      syncFilterControls();
      renderDashboard();
    });
  });

  resetFiltersButton.addEventListener(
    "click",
    () => {
      Object.keys(
        state.filters
      ).forEach((key) => {
        state.filters[key] = "all";
      });

      syncFilterControls();
      renderDashboard();
    }
  );

  [
    priceSlider,
    volumeSlider,
    costSlider
  ].forEach((slider) => {
    slider.addEventListener(
      "input",
      () => {
        renderWhatIf(
          getFilteredData()
        );
      }
    );
  });

  whatIfReset.addEventListener(
    "click",
    () => {
      priceSlider.value = 0;
      volumeSlider.value = 0;
      costSlider.value = 0;

      renderWhatIf(
        getFilteredData()
      );
    }
  );

  [
    reportsPerYear,
    hoursPerReport,
    employees,
    hoursAfter
  ].forEach((input) => {
    input.addEventListener(
      "input",
      renderTimeSavings
    );
  });

  buildButton.addEventListener(
    "click",
    runBuild
  );

  renderRawTable();
  initializeFilters();
  renderTimeSavings();
})();
