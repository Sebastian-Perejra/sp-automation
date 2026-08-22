(() => {
  const capacityProducts = [
    {
      code: "ST-025",
      name: "Стальная труба Ø25",
      line: "line1",
      lineLabel: "Линия 1"
    },
    {
      code: "ST-040",
      name: "Стальная труба Ø40",
      line: "line1",
      lineLabel: "Линия 1"
    },
    {
      code: "AN-050",
      name: "Стальной уголок 50×50",
      line: "line2",
      lineLabel: "Линия 2"
    },
    {
      code: "AN-075",
      name: "Стальной уголок 75×75",
      line: "line2",
      lineLabel: "Линия 2"
    },
    {
      code: "PR-040",
      name: "Стальной профиль 40×40",
      line: "line3",
      lineLabel: "Линия 3"
    },
    {
      code: "PR-060",
      name: "Стальной профиль 60×60",
      line: "line3",
      lineLabel: "Линия 3"
    }
  ];

  const capacityPriorities = [
    {
      key: "normal",
      label: "Обычный"
    },
    {
      key: "high",
      label: "Высокий"
    },
    {
      key: "urgent",
      label: "Срочный"
    }
  ];

  const capacityOrdersBody =
    document.getElementById("capacity-orders-body");

  const capacityOrdersStatus =
    document.getElementById("capacity-orders-status");

  const capacityStartDate =
    new Date(2026, 0, 1);

  const capacityEndDate =
    new Date(2026, 7, 2);

  let capacityOrders = [];

  function capacityCloneDate(date) {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
  }

  function capacityAddDays(date, days) {
    const result = capacityCloneDate(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  function capacityFormatDate(date) {
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  }

  function capacityDaysBetween(start, end) {
    const milliseconds =
      capacityCloneDate(end) - capacityCloneDate(start);

    return Math.floor(
      milliseconds / (1000 * 60 * 60 * 24)
    );
  }

  function capacityCreateOrders() {
    const totalPeriodDays =
      capacityDaysBetween(
        capacityStartDate,
        capacityEndDate
      );

    const orders = [];

    for (let index = 0; index < 100; index++) {
      const product =
        capacityProducts[
          (index * 5 + Math.floor(index / 4)) %
          capacityProducts.length
        ];

      const receivedOffset =
        Math.floor(
          (index / 99) * totalPeriodDays
        );

      const receivedDate =
        capacityAddDays(
          capacityStartDate,
          receivedOffset
        );

      const quantityBase =
        product.line === "line1"
          ? 180
          : product.line === "line2"
            ? 260
            : 380;

      const quantityStep =
        product.line === "line1"
          ? 37
          : product.line === "line2"
            ? 53
            : 71;

      const quantity =
        quantityBase +
        ((index * quantityStep) % 1450);

      const priority =
        index % 13 === 0
          ? capacityPriorities[2]
          : index % 5 === 0
            ? capacityPriorities[1]
            : capacityPriorities[0];

      const requestedLeadTime =
        priority.key === "urgent"
          ? 2 + (index % 3)
          : priority.key === "high"
            ? 4 + (index % 5)
            : 7 + (index % 10);

      let requestedDate =
        capacityAddDays(
          receivedDate,
          requestedLeadTime
        );

      if (requestedDate > capacityEndDate) {
        requestedDate =
          capacityCloneDate(capacityEndDate);
      }

      orders.push({
        id: `ORD-${String(index + 1).padStart(4, "0")}`,
        receivedDate,
        productCode: product.code,
        productName: product.name,
        quantity,
        line: product.line,
        lineLabel: product.lineLabel,
        requestedDate,
        calculatedDate: null,
        priority: priority.key,
        priorityLabel: priority.label,
        status: "waiting"
      });
    }

    return orders;
  }

  function capacityPriorityClass(priority) {
    if (priority === "urgent") {
      return "capacity-priority-urgent";
    }

    if (priority === "high") {
      return "capacity-priority-high";
    }

    return "capacity-priority-normal";
  }

  function capacityStatusMarkup(order) {
    if (order.status === "on-time") {
      return `
        <span class="capacity-status capacity-status-ok">
          В срок
        </span>
      `;
    }

    if (order.status === "delayed") {
      return `
        <span class="capacity-status capacity-status-warning">
          Перенесено
        </span>
      `;
    }

    if (order.status === "critical") {
      return `
        <span class="capacity-status capacity-status-error">
          Перегрузка
        </span>
      `;
    }

    return `
      <span class="capacity-status capacity-status-waiting">
        Ожидает
      </span>
    `;
  }

  function capacityRenderOrders() {
    capacityOrdersBody.innerHTML =
      capacityOrders
        .map(order => {
          const calculatedDate =
            order.calculatedDate
              ? capacityFormatDate(
                  order.calculatedDate
                )
              : "—";

          return `
            <tr
              data-capacity-order="${order.id}"
              data-capacity-line="${order.line}"
              data-capacity-priority="${order.priority}"
            >
              <td>
                <strong>${order.id}</strong>
              </td>

              <td>
                ${capacityFormatDate(
                  order.receivedDate
                )}
              </td>

              <td>
                ${order.productCode}
              </td>

              <td>
                ${order.productName}
              </td>

              <td>
                ${order.quantity.toLocaleString("ru-RU")}
              </td>

              <td>
                ${order.lineLabel}
              </td>

              <td>
                ${capacityFormatDate(
                  order.requestedDate
                )}
              </td>

              <td class="capacity-calculated-date">
                ${calculatedDate}
              </td>

              <td>
                ${capacityStatusMarkup(order)}

                <span
                  class="capacity-priority ${capacityPriorityClass(
                    order.priority
                  )}"
                >
                  ${order.priorityLabel}
                </span>
              </td>
            </tr>
          `;
        })
        .join("");

    capacityOrdersStatus.textContent =
      `${capacityOrders.length} заказов ожидают расчёта`;
  }

  function capacityResetInitialValues() {
    const output =
      document.getElementById("capacity-output");

    const calendar =
      document.getElementById("capacity-calendar");

    const summaryOrders =
      document.getElementById(
        "capacity-summary-orders"
      );

    const summaryUnits =
      document.getElementById(
        "capacity-summary-units"
      );

    const summaryDelayed =
      document.getElementById(
        "capacity-summary-delayed"
      );

    const summaryLastDate =
      document.getElementById(
        "capacity-summary-last-date"
      );

    summaryOrders.textContent = "0";
    summaryUnits.textContent = "0";
    summaryDelayed.textContent = "0";
    summaryLastDate.textContent = "—";

    calendar.innerHTML = "";

    ["line1", "line2", "line3"].forEach(line => {
      const fill =
        document.getElementById(
          `capacity-util-${line}`
        );

      const text =
        document.getElementById(
          `capacity-util-${line}-text`
        );

      fill.style.width = "0%";
      text.textContent = "0%";
    });

    output.dataset.calculated = "false";
  }

  capacityOrders =
    capacityCreateOrders();

  capacityRenderOrders();
  capacityResetInitialValues();

  const capacityPlannerValues = {
    line1: 250,
    line2: 400,
    line3: 600
  };

  const capacityPlannerStep = 50;
  const capacityPlannerMinimum = 50;
  const capacityPlannerMaximum = 2000;

  const capacityCalculateButton =
    document.getElementById("capacity-calculate");

  const capacityLoader =
    document.getElementById("capacity-loader");

  const capacityOutput =
    document.getElementById("capacity-output");

  const capacityCalendar =
    document.getElementById("capacity-calendar");

  const capacitySummaryOrders =
    document.getElementById("capacity-summary-orders");

  const capacitySummaryUnits =
    document.getElementById("capacity-summary-units");

  const capacitySummaryDelayed =
    document.getElementById("capacity-summary-delayed");

  const capacitySummaryLastDate =
    document.getElementById("capacity-summary-last-date");

  const capacityModeButtons =
    Array.from(
      document.querySelectorAll("[data-capacity-mode]")
    );

  const capacityControlButtons =
    Array.from(
      document.querySelectorAll("[data-capacity-action]")
    );

  let capacityPlanningMode = "queue";
  let capacityLastPlan = null;
  let capacityCalendarMonth = null;
  let capacityCalendarMinMonth = null;
  let capacityCalendarMaxMonth = null;

  function capacityPlannerDateKey(date) {
    const year = date.getFullYear();
    const month =
      String(date.getMonth() + 1).padStart(2, "0");
    const day =
      String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function capacityPlannerParseDateKey(key) {
    const [year, month, day] =
      key.split("-").map(Number);

    return new Date(year, month - 1, day);
  }

  function capacityPlannerCompareDates(a, b) {
    return (
      capacityCloneDate(a).getTime() -
      capacityCloneDate(b).getTime()
    );
  }

  function capacityPlannerPriorityRank(priority) {
    if (priority === "urgent") return 3;
    if (priority === "high") return 2;
    return 1;
  }

  function capacityPlannerDelayDays(order) {
    if (!order.calculatedDate) return 0;

    return Math.max(
      0,
      capacityDaysBetween(
        order.requestedDate,
        order.calculatedDate
      )
    );
  }

  function capacityPlannerSetStatus(order) {
    const delayDays =
      capacityPlannerDelayDays(order);

    if (delayDays === 0) {
      order.status = "on-time";
      return;
    }

    if (delayDays <= 5) {
      order.status = "delayed";
      return;
    }

    order.status = "critical";
  }

  function capacityPlannerSortOrders(orders) {
    return [...orders].sort((a, b) => {
      if (a.line !== b.line) {
        return a.line.localeCompare(b.line);
      }

      if (capacityPlanningMode === "priority") {
        const priorityDifference =
          capacityPlannerPriorityRank(b.priority) -
          capacityPlannerPriorityRank(a.priority);

        if (priorityDifference !== 0) {
          return priorityDifference;
        }

        const requestedDifference =
          capacityPlannerCompareDates(
            a.requestedDate,
            b.requestedDate
          );

        if (requestedDifference !== 0) {
          return requestedDifference;
        }
      }

      const receivedDifference =
        capacityPlannerCompareDates(
          a.receivedDate,
          b.receivedDate
        );

      if (receivedDifference !== 0) {
        return receivedDifference;
      }

      const requestedDifference =
        capacityPlannerCompareDates(
          a.requestedDate,
          b.requestedDate
        );

      if (requestedDifference !== 0) {
        return requestedDifference;
      }

      return a.id.localeCompare(b.id);
    });
  }

  function capacityPlannerCreateUsage() {
    return {
      line1: {},
      line2: {},
      line3: {}
    };
  }

  function capacityPlannerGetUsed(
    usage,
    line,
    date
  ) {
    const key =
      capacityPlannerDateKey(date);

    return usage[line][key] || 0;
  }

  function capacityPlannerAddUsed(
    usage,
    line,
    date,
    amount
  ) {
    const key =
      capacityPlannerDateKey(date);

    usage[line][key] =
      (usage[line][key] || 0) + amount;
  }

  function capacityPlannerScheduleOrder(
    order,
    usage
  ) {
    let remaining =
      order.quantity;

    let currentDate =
      capacityCloneDate(order.receivedDate);

    let lastProductionDate =
      capacityCloneDate(order.receivedDate);

    let safetyCounter = 0;

    while (remaining > 0 && safetyCounter < 3000) {
      safetyCounter++;

      const dailyCapacity =
        capacityPlannerValues[order.line];

      const used =
        capacityPlannerGetUsed(
          usage,
          order.line,
          currentDate
        );

      const available =
        Math.max(0, dailyCapacity - used);

      if (available > 0) {
        const produced =
          Math.min(available, remaining);

        capacityPlannerAddUsed(
          usage,
          order.line,
          currentDate,
          produced
        );

        remaining -= produced;
        lastProductionDate =
          capacityCloneDate(currentDate);
      }

      if (remaining > 0) {
        currentDate =
          capacityAddDays(currentDate, 1);
      }
    }

    order.calculatedDate =
      lastProductionDate;

    capacityPlannerSetStatus(order);
  }

  function capacityPlannerCalculatePlan() {
    const usage =
      capacityPlannerCreateUsage();

    capacityOrders.forEach(order => {
      order.calculatedDate = null;
      order.status = "waiting";
    });

    const sortedOrders =
      capacityPlannerSortOrders(capacityOrders);

    sortedOrders.forEach(order => {
      capacityPlannerScheduleOrder(
        order,
        usage
      );
    });

    return {
      usage,
      orders: sortedOrders
    };
  }

  function capacityPlannerUpdateTable() {
    capacityRenderOrders();

    capacityOrders.forEach((order, index) => {
      const row =
        document.querySelector(
          `[data-capacity-order="${order.id}"]`
        );

      if (!row) return;

      setTimeout(() => {
        row.classList.add(
          "capacity-row-updated"
        );

        setTimeout(() => {
          row.classList.remove(
            "capacity-row-updated"
          );
        }, 600);
      }, Math.min(index * 8, 700));
    });
  }

  function capacityPlannerGetUsageDates(usage) {
    const keys = new Set();

    Object.values(usage).forEach(lineUsage => {
      Object.keys(lineUsage).forEach(key => {
        keys.add(key);
      });
    });

    return Array.from(keys)
      .sort((a, b) => {
        return (
          capacityPlannerParseDateKey(a) -
          capacityPlannerParseDateKey(b)
        );
      });
  }

  function capacityPlannerCalculateUtilization(
    usage,
    line,
    allDates
  ) {
    if (!allDates.length) return 0;

    const totalUsed =
      Object.values(usage[line])
        .reduce(
          (sum, value) => sum + value,
          0
        );

    const firstDate =
      capacityPlannerParseDateKey(
        allDates[0]
      );

    const lastDate =
      capacityPlannerParseDateKey(
        allDates[allDates.length - 1]
      );

    const periodDays =
      capacityDaysBetween(
        firstDate,
        lastDate
      ) + 1;

    const availableCapacity =
      periodDays *
      capacityPlannerValues[line];

    if (availableCapacity === 0) {
      return 0;
    }

    return Math.min(
      100,
      Math.round(
        (totalUsed / availableCapacity) *
        100
      )
    );
  }

  function capacityPlannerUpdateUtilization(
    usage,
    allDates
  ) {
    ["line1", "line2", "line3"]
      .forEach(line => {
        const percent =
          capacityPlannerCalculateUtilization(
            usage,
            line,
            allDates
          );

        const fill =
          document.getElementById(
            `capacity-util-${line}`
          );

        const text =
          document.getElementById(
            `capacity-util-${line}-text`
          );

        fill.style.width =
          `${percent}%`;

        text.textContent =
          `${percent}%`;
      });
  }

  function capacityPlannerDayLoad(
    usage,
    dateKey
  ) {
    const lineLoads =
      ["line1", "line2", "line3"]
        .map(line => {
          const used =
            usage[line][dateKey] || 0;

          const capacity =
            capacityPlannerValues[line];

          return capacity > 0
            ? used / capacity
            : 0;
        });

    return Math.max(
      ...lineLoads
    );
  }

  function capacityPlannerDayClass(load) {
    if (load >= 0.9) {
      return "capacity-full";
    }

    if (load >= 0.6) {
      return "capacity-medium";
    }

    return "capacity-free";
  }

  function capacityMonthStart(date) {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      1
    );
  }

  function capacityMonthKey(date) {
    return (
      date.getFullYear() * 12 +
      date.getMonth()
    );
  }

  function capacityCalendarMonthName(date) {
    const name =
      date.toLocaleDateString(
        "ru-RU",
        {
          month: "long",
          year: "numeric"
        }
      );

    return (
      name.charAt(0).toUpperCase() +
      name.slice(1)
    );
  }

  function capacityPlannerRenderCalendar(
    usage,
    allDates,
    resetMonth = false
  ) {
    capacityCalendar.innerHTML = "";

    if (!allDates.length) {
      return;
    }

    const firstUsageDate =
      capacityPlannerParseDateKey(
        allDates[0]
      );

    const lastUsageDate =
      capacityPlannerParseDateKey(
        allDates[
          allDates.length - 1
        ]
      );

    capacityCalendarMinMonth =
      capacityMonthStart(
        firstUsageDate
      );

    capacityCalendarMaxMonth =
      capacityMonthStart(
        lastUsageDate
      );

    if (
      resetMonth ||
      !capacityCalendarMonth
    ) {
      capacityCalendarMonth =
        capacityMonthStart(
          firstUsageDate
        );
    }

    if (
      capacityMonthKey(
        capacityCalendarMonth
      ) <
      capacityMonthKey(
        capacityCalendarMinMonth
      )
    ) {
      capacityCalendarMonth =
        new Date(
          capacityCalendarMinMonth
        );
    }

    if (
      capacityMonthKey(
        capacityCalendarMonth
      ) >
      capacityMonthKey(
        capacityCalendarMaxMonth
      )
    ) {
      capacityCalendarMonth =
        new Date(
          capacityCalendarMaxMonth
        );
    }

    const title =
      document.getElementById(
        "capacity-calendar-title"
      );

    const prev =
      document.getElementById(
        "capacity-calendar-prev"
      );

    const next =
      document.getElementById(
        "capacity-calendar-next"
      );

    if (title) {
      title.textContent =
        capacityCalendarMonthName(
          capacityCalendarMonth
        );
    }

    if (prev) {
      prev.disabled =
        capacityMonthKey(
          capacityCalendarMonth
        ) <=
        capacityMonthKey(
          capacityCalendarMinMonth
        );
    }

    if (next) {
      next.disabled =
        capacityMonthKey(
          capacityCalendarMonth
        ) >=
        capacityMonthKey(
          capacityCalendarMaxMonth
        );
    }

    const year =
      capacityCalendarMonth
        .getFullYear();

    const month =
      capacityCalendarMonth
        .getMonth();

    const firstDay =
      new Date(
        year,
        month,
        1
      );

    const lastDay =
      new Date(
        year,
        month + 1,
        0
      );

    const firstWeekday =
      (firstDay.getDay() + 6) % 7;

    for (
      let index = 0;
      index < firstWeekday;
      index++
    ) {
      const empty =
        document.createElement(
          "div"
        );

      empty.className =
        "capacity-day capacity-day--empty";

      capacityCalendar.appendChild(
        empty
      );
    }

    for (
      let dayNumber = 1;
      dayNumber <= lastDay.getDate();
      dayNumber++
    ) {
      const date =
        new Date(
          year,
          month,
          dayNumber
        );

      const dateKey =
        capacityPlannerDateKey(
          date
        );

      const load =
        capacityPlannerDayLoad(
          usage,
          dateKey
        );

      const percent =
        Math.round(
          load * 100
        );

      const line1Used =
        usage.line1[dateKey] || 0;

      const line2Used =
        usage.line2[dateKey] || 0;

      const line3Used =
        usage.line3[dateKey] || 0;

      const day =
        document.createElement(
          "div"
        );

      day.className =
        `capacity-day ${capacityPlannerDayClass(load)}`;

      day.style.setProperty(
        "--capacity-day-fill",
        `${percent}%`
      );

      day.innerHTML = `
        <span class="capacity-day-number">
          ${dayNumber}
        </span>

        <span class="capacity-day-percent">
          ${percent}%
        </span>
      `;

      day.dataset.load =
        `${capacityFormatDate(date)} • ` +
        `загрузка ${percent}% • ` +
        `Л1: ${line1Used}/${capacityPlannerValues.line1} • ` +
        `Л2: ${line2Used}/${capacityPlannerValues.line2} • ` +
        `Л3: ${line3Used}/${capacityPlannerValues.line3}`;

      capacityCalendar.appendChild(
        day
      );
    }
  }

  document
    .getElementById(
      "capacity-calendar-prev"
    )
    ?.addEventListener(
      "click",
      () => {
        if (
          !capacityLastPlan ||
          !capacityCalendarMonth
        ) {
          return;
        }

        capacityCalendarMonth =
          new Date(
            capacityCalendarMonth
              .getFullYear(),
            capacityCalendarMonth
              .getMonth() - 1,
            1
          );

        const allDates =
          capacityPlannerGetUsageDates(
            capacityLastPlan.usage
          );

        capacityPlannerRenderCalendar(
          capacityLastPlan.usage,
          allDates
        );
      }
    );

  document
    .getElementById(
      "capacity-calendar-next"
    )
    ?.addEventListener(
      "click",
      () => {
        if (
          !capacityLastPlan ||
          !capacityCalendarMonth
        ) {
          return;
        }

        capacityCalendarMonth =
          new Date(
            capacityCalendarMonth
              .getFullYear(),
            capacityCalendarMonth
              .getMonth() + 1,
            1
          );

        const allDates =
          capacityPlannerGetUsageDates(
            capacityLastPlan.usage
          );

        capacityPlannerRenderCalendar(
          capacityLastPlan.usage,
          allDates
        );
      }
    );

  function capacityPlannerUpdateSummary(
    allDates
  ) {
    const totalUnits =
      capacityOrders.reduce(
        (sum, order) =>
          sum + order.quantity,
        0
      );

    const delayedOrders =
      capacityOrders.filter(order => {
        return (
          order.status === "delayed" ||
          order.status === "critical"
        );
      }).length;

    const lastDate =
      capacityOrders.reduce(
        (latest, order) => {
          if (!order.calculatedDate) {
            return latest;
          }

          if (
            !latest ||
            order.calculatedDate > latest
          ) {
            return order.calculatedDate;
          }

          return latest;
        },
        null
      );

    capacitySummaryOrders.textContent =
      capacityOrders.length
        .toLocaleString("ru-RU");

    capacitySummaryUnits.textContent =
      totalUnits.toLocaleString("ru-RU");

    capacitySummaryDelayed.textContent =
      delayedOrders.toLocaleString("ru-RU");

    capacitySummaryLastDate.textContent =
      lastDate
        ? capacityFormatDate(lastDate)
        : "—";

    capacityOrdersStatus.textContent =
      capacityPlanningMode === "priority"
        ? `Рассчитано по приоритету • ${delayedOrders} с переносом`
        : `Рассчитано по очереди • ${delayedOrders} с переносом`;
  }

  function capacityPlannerResetResult() {
    capacityOrders.forEach(order => {
      order.calculatedDate = null;
      order.status = "waiting";
    });

    capacityRenderOrders();
    capacityResetInitialValues();

    capacityOrdersStatus.textContent =
      `${capacityOrders.length} заказов ожидают расчёта`;

    capacityLastPlan = null;
  }

  function capacityPlannerUpdateValue(line) {
    const valueElement =
      document.getElementById(
        `capacity-${line}`
      );

    valueElement.textContent =
      capacityPlannerValues[line]
        .toLocaleString("ru-RU");
  }

  capacityControlButtons.forEach(button => {
    button.addEventListener("click", () => {
      const line =
        button.dataset.capacityLine;

      const action =
        button.dataset.capacityAction;

      if (!line || !action) return;

      if (action === "plus") {
        capacityPlannerValues[line] =
          Math.min(
            capacityPlannerMaximum,
            capacityPlannerValues[line] +
            capacityPlannerStep
          );
      }

      if (action === "minus") {
        capacityPlannerValues[line] =
          Math.max(
            capacityPlannerMinimum,
            capacityPlannerValues[line] -
            capacityPlannerStep
          );
      }

      capacityPlannerUpdateValue(line);
      capacityPlannerResetResult();
    });
  });

  capacityModeButtons.forEach(button => {
    button.addEventListener("click", () => {
      capacityPlanningMode =
        button.dataset.capacityMode;

      capacityModeButtons.forEach(item => {
        item.classList.toggle(
          "active",
          item === button
        );
      });

      capacityPlannerResetResult();
    });
  });

  capacityCalculateButton.addEventListener(
    "click",
    async () => {
      capacityCalculateButton.disabled = true;
      capacityCalculateButton.textContent =
        "Расчёт...";

      const calculationTitle =
        document.getElementById(
          "capacity-calculation-title"
        );

      const calculationText =
        document.getElementById(
          "capacity-calculation-text"
        );

      const calculationPercent =
        document.getElementById(
          "capacity-calculation-percent"
        );

      const calculationProgress =
        document.getElementById(
          "capacity-calculation-progress"
        );

      const calculationSteps =
        Array.from(
          document.querySelectorAll(
            "[data-capacity-step]"
          )
        );

      const wait = milliseconds =>
        new Promise(resolve =>
          setTimeout(resolve, milliseconds)
        );

      const setStep = (
        step,
        percent,
        title,
        text
      ) => {
        calculationSteps.forEach(item => {
          const itemStep =
            Number(
              item.dataset.capacityStep
            );

          item.classList.toggle(
            "is-active",
            itemStep === step
          );

          item.classList.toggle(
            "is-done",
            itemStep < step
          );
        });

        calculationPercent.textContent =
          `${percent}%`;

        calculationProgress.style.width =
          `${percent}%`;

        calculationTitle.textContent =
          title;

        calculationText.textContent =
          text;
      };

      capacityLoader.classList.remove(
        "is-complete"
      );

      calculationSteps.forEach(item => {
        item.classList.remove(
          "is-active",
          "is-done"
        );
      });

      calculationProgress.style.width =
        "0%";

      calculationPercent.textContent =
        "0%";

      capacityLoader.classList.add(
        "active"
      );

      capacityOutput.classList.add(
        "is-calculating"
      );

      setStep(
        1,
        15,
        "Анализирую заказы",
        "Проверяю 100 производственных заказов"
      );

      await wait(420);

      setStep(
        2,
        38,
        "Проверяю мощность",
        "Сопоставляю объём с возможностями производственных линий"
      );

      await wait(460);

      capacityLastPlan =
        capacityPlannerCalculatePlan();

      const allDates =
        capacityPlannerGetUsageDates(
          capacityLastPlan.usage
        );

      setStep(
        3,
        68,
        "Формирую календарь",
        "Распределяю объём по доступным производственным дням"
      );

      await wait(500);

      capacityPlannerUpdateUtilization(
        capacityLastPlan.usage,
        allDates
      );

      capacityPlannerRenderCalendar(
        capacityLastPlan.usage,
        allDates,
        true
      );

      setStep(
        4,
        88,
        "Проверяю сроки",
        "Сравниваю желаемые и расчётные даты готовности"
      );

      await wait(500);

      capacityPlannerUpdateTable();

      capacityPlannerUpdateSummary(
        allDates
      );

      calculationSteps.forEach(item => {
        item.classList.remove(
          "is-active"
        );

        item.classList.add(
          "is-done"
        );
      });

      calculationProgress.style.width =
        "100%";

      calculationPercent.textContent =
        "100%";

      calculationTitle.textContent =
        "План рассчитан";

      calculationText.textContent =
        `${capacityOrders.length} заказов распределено по производственному календарю`;

      capacityLoader.classList.add(
        "is-complete"
      );

      await wait(650);

      capacityLoader.classList.remove(
        "active"
      );

      capacityOutput.classList.remove(
        "is-calculating"
      );

      capacityOutput.classList.add(
        "is-revealed"
      );

      setTimeout(() => {
        capacityOutput.classList.remove(
          "is-revealed"
        );
      }, 900);

      capacityCalculateButton.disabled = false;

      capacityCalculateButton.textContent =
        "↻ Пересчитать производственный план";

      capacityOutput.dataset.calculated =
        "true";
    }
  );

  ["line1", "line2", "line3"]
    .forEach(capacityPlannerUpdateValue);
})();
