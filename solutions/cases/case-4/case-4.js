(() => {
  const capacityProducts = [
    {
      code: "ST-025",
      name: "Сталева труба Ø25",
      line: "line1",
      lineLabel: "Лінія 1"
    },
    {
      code: "ST-040",
      name: "Сталева труба Ø40",
      line: "line1",
      lineLabel: "Лінія 1"
    },
    {
      code: "AN-050",
      name: "Сталевий кутник 50×50",
      line: "line2",
      lineLabel: "Лінія 2"
    },
    {
      code: "AN-075",
      name: "Сталевий кутник 75×75",
      line: "line2",
      lineLabel: "Лінія 2"
    },
    {
      code: "PR-040",
      name: "Сталевий профіль 40×40",
      line: "line3",
      lineLabel: "Лінія 3"
    },
    {
      code: "PR-060",
      name: "Сталевий профіль 60×60",
      line: "line3",
      lineLabel: "Лінія 3"
    }
  ];

  const capacityPriorities = [
    {
      key: "normal",
      label: "Звичайний"
    },
    {
      key: "high",
      label: "Високий"
    },
    {
      key: "urgent",
      label: "Терміновий"
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
    return date.toLocaleDateString("uk-UA", {
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
          Вчасно
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
          Перевантаження
        </span>
      `;
    }

    return `
      <span class="capacity-status capacity-status-waiting">
        Очікує
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
                ${order.quantity.toLocaleString("uk-UA")}
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
      `${capacityOrders.length} замовлень очікують розрахунку`;
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

    return (
      lineLoads.reduce(
        (sum, value) => sum + value,
        0
      ) / lineLoads.length
    );
  }

  function capacityPlannerDayClass(load) {
    if (load >= 0.9) {
      return "capacity-full";
    }

    if (load >= 0.35) {
      return "capacity-medium";
    }

    return "capacity-free";
  }

  function capacityPlannerRenderCalendar(
    usage,
    allDates
  ) {
    capacityCalendar.innerHTML = "";

    if (!allDates.length) return;

    const visibleDates =
      allDates.slice(-35);

    visibleDates.forEach(dateKey => {
      const date =
        capacityPlannerParseDateKey(
          dateKey
        );

      const load =
        capacityPlannerDayLoad(
          usage,
          dateKey
        );

      const percent =
        Math.round(load * 100);

      const line1Used =
        usage.line1[dateKey] || 0;

      const line2Used =
        usage.line2[dateKey] || 0;

      const line3Used =
        usage.line3[dateKey] || 0;

      const day =
        document.createElement("div");

      day.className =
        `capacity-day ${capacityPlannerDayClass(load)}`;

      day.textContent =
        String(date.getDate());

      day.dataset.load =
        `${capacityFormatDate(date)} • ` +
        `середнє завантаження ${percent}% • ` +
        `Л1: ${line1Used}/${capacityPlannerValues.line1} • ` +
        `Л2: ${line2Used}/${capacityPlannerValues.line2} • ` +
        `Л3: ${line3Used}/${capacityPlannerValues.line3}`;

      capacityCalendar.appendChild(day);
    });
  }

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
        .toLocaleString("uk-UA");

    capacitySummaryUnits.textContent =
      totalUnits.toLocaleString("uk-UA");

    capacitySummaryDelayed.textContent =
      delayedOrders.toLocaleString("uk-UA");

    capacitySummaryLastDate.textContent =
      lastDate
        ? capacityFormatDate(lastDate)
        : "—";

    capacityOrdersStatus.textContent =
      capacityPlanningMode === "priority"
        ? `Розраховано за пріоритетом • ${delayedOrders} із перенесенням`
        : `Розраховано за чергою • ${delayedOrders} із перенесенням`;
  }

  function capacityPlannerResetResult() {
    capacityOrders.forEach(order => {
      order.calculatedDate = null;
      order.status = "waiting";
    });

    capacityRenderOrders();
    capacityResetInitialValues();

    capacityOrdersStatus.textContent =
      `${capacityOrders.length} замовлень очікують розрахунку`;

    capacityLastPlan = null;
  }

  function capacityPlannerUpdateValue(line) {
    const valueElement =
      document.getElementById(
        `capacity-${line}`
      );

    valueElement.textContent =
      capacityPlannerValues[line]
        .toLocaleString("uk-UA");
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
    () => {
      capacityCalculateButton.disabled = true;
      capacityCalculateButton.textContent =
        "Розрахунок...";

      capacityLoader.classList.add("active");

      capacityOrdersStatus.textContent =
        capacityPlanningMode === "priority"
          ? "Перерахунок із пріоритетним витісненням замовлень..."
          : "Послідовний розподіл замовлень за виробничими днями...";

      setTimeout(() => {
        capacityLastPlan =
          capacityPlannerCalculatePlan();

        const allDates =
          capacityPlannerGetUsageDates(
            capacityLastPlan.usage
          );

        capacityPlannerUpdateTable();

        capacityPlannerUpdateSummary(
          allDates
        );

        capacityPlannerUpdateUtilization(
          capacityLastPlan.usage,
          allDates
        );

        capacityPlannerRenderCalendar(
          capacityLastPlan.usage,
          allDates
        );

        capacityLoader.classList.remove("active");

        capacityCalculateButton.disabled = false;

        capacityCalculateButton.textContent =
          "↻ Перерахувати виробничий план";

        capacityOutput.dataset.calculated =
          "true";
      }, 1100);
    }
  );

  ["line1", "line2", "line3"]
    .forEach(capacityPlannerUpdateValue);
})();
