(function () {
  "use strict";

  const C12 = window.C12 = window.C12 || {};

  if (!C12.data || !C12.rules || !C12.state) {
    console.error(
      "[CASE 12] case12-simulation.js requires case12-data.js and case12-rules.js"
    );
    return;
  }


  /* ============================================================
     HELPERS
  ============================================================ */

  const clamp = (value, min, max) => {
    return Math.min(max, Math.max(min, value));
  };


  const toDate = (value) => {
    if (!value) return null;

    const date = new Date(value);

    return Number.isNaN(date.getTime())
      ? null
      : date;
  };


  const pad = (value) => {
    return String(value).padStart(2, "0");
  };


  const isoLocal = (date) => {
    return [
      date.getFullYear(),
      "-",
      pad(date.getMonth() + 1),
      "-",
      pad(date.getDate()),
      "T",
      pad(date.getHours()),
      ":",
      pad(date.getMinutes()),
      ":00"
    ].join("");
  };


  const formatSimulationDate = (value) => {
    const date = toDate(value);

    if (!date) {
      return "—";
    }

    const months = [
      "січня",
      "лютого",
      "березня",
      "квітня",
      "травня",
      "червня",
      "липня",
      "серпня",
      "вересня",
      "жовтня",
      "листопада",
      "грудня"
    ];

    return (
      `${date.getDate()} ${months[date.getMonth()]} · ` +
      `${pad(date.getHours())}:${pad(date.getMinutes())}`
    );
  };


  const formatClock = (value) => {
    const date = toDate(value);

    if (!date) {
      return "—";
    }

    return (
      `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} · ` +
      `${pad(date.getHours())}:${pad(date.getMinutes())}`
    );
  };


  /* ============================================================
     TIME MACHINE INTERPOLATION
  ============================================================ */

  function getNearestTimePoint(position) {
    const numericPosition = clamp(
      Number(position) || 0,
      0,
      100
    );

    let current = C12.timeMachine[0];

    for (const point of C12.timeMachine) {
      if (numericPosition >= point.position) {
        current = point;
      } else {
        break;
      }
    }

    return current;
  }


  function getNextTimePoint(position) {
    const numericPosition = clamp(
      Number(position) || 0,
      0,
      100
    );

    return (
      C12.timeMachine.find(
        point => point.position > numericPosition
      ) ||
      C12.timeMachine[C12.timeMachine.length - 1]
    );
  }


  function interpolateNumber(
    position,
    currentPoint,
    nextPoint,
    field
  ) {
    if (!currentPoint || !nextPoint) {
      return Number(currentPoint?.[field] || 0);
    }

    if (currentPoint.position === nextPoint.position) {
      return Number(currentPoint[field] || 0);
    }

    const ratio =
      (position - currentPoint.position) /
      (nextPoint.position - currentPoint.position);

    const from = Number(currentPoint[field] || 0);
    const to = Number(nextPoint[field] || from);

    return Math.round(
      from + (to - from) * ratio
    );
  }


  /* ============================================================
     SIMULATION DATE FROM SLIDER
  ============================================================ */

  function getInterpolatedTime(position) {
    const currentPoint = getNearestTimePoint(position);
    const nextPoint = getNextTimePoint(position);

    const currentDate = toDate(currentPoint.time);
    const nextDate = toDate(nextPoint.time);

    if (!currentDate || !nextDate) {
      return currentPoint.time;
    }

    if (currentPoint.position === nextPoint.position) {
      return currentPoint.time;
    }

    const ratio =
      (position - currentPoint.position) /
      (nextPoint.position - currentPoint.position);

    const timestamp =
      currentDate.getTime() +
      (nextDate.getTime() - currentDate.getTime()) *
        clamp(ratio, 0, 1);

    return isoLocal(new Date(timestamp));
  }


  /* ============================================================
     MAIN ORDER STATUS BY TIME POSITION
  ============================================================ */

  function getMainStatusByPosition(position) {
    const numericPosition = Number(position);

    if (numericPosition < 9) {
      return "new";
    }

    if (numericPosition < 24) {
      return "new";
    }

    if (numericPosition < 39) {
      return "assigned";
    }

    if (numericPosition < 48) {
      return "loading";
    }

    if (numericPosition < 65) {
      return "transit";
    }

    if (numericPosition < 78) {
      return "delayed";
    }

    if (numericPosition < 92) {
      return "transit";
    }

    return "delivered";
  }


  /* ============================================================
     MAIN ORDER ETA
  ============================================================ */

  function getMainEtaByPosition(position) {
    if (Number(position) >= 65) {
      return "2026-08-28T16:00:00";
    }

    return "2026-08-28T14:00:00";
  }


  /* ============================================================
     MAIN ORDER DRIVER / VEHICLE STATE
  ============================================================ */

  function syncMainResources(position) {
    const vehicle = C12.data.getVehicle("BC4587KA");
    const driver = C12.data.getDriver(
      "Олександр Петренко"
    );

    if (!vehicle || !driver) {
      return;
    }

    if (position < 24) {
      vehicle.status = "free";
      vehicle.location = "Львів";

      driver.status = "free";
    }

    else if (position < 39) {
      vehicle.status = "reserved";
      vehicle.location = "Львів";

      driver.status = "reserved";
    }

    else if (position < 92) {
      vehicle.status = "transit";

      driver.status = "transit";

      if (position < 65) {
        vehicle.location = "Львів";
      }

      else if (position < 78) {
        vehicle.location = "Польща";
      }

      else {
        vehicle.location = "Краків";
      }
    }

    else {
      vehicle.status = "free";
      vehicle.location = "Краків";

      driver.status = "free";
    }
  }


  /* ============================================================
     UPDATE MAIN ORDER FROM TIME POSITION
  ============================================================ */

  function syncMainOrder(position) {
    const order = C12.mainOrder;

    const status = getMainStatusByPosition(position);

    order.status = status;
    order.statusLabel =
      C12.statuses[status]?.label || status;

    order.attention =
      status === "delayed";

    order.eta =
      getMainEtaByPosition(position);

    if (position >= 24) {
      order.execution = "own";
      order.executionLabel =
        "Власний транспорт";

      order.vehicle = "BC 4587 KA";
      order.driver = "Олександр Петренко";

      order.carrier = null;
    }

    else {
      order.execution = null;
      order.executionLabel =
        "Не призначено";

      order.vehicle = null;
      order.driver = null;
    }

    if (position >= 92) {
      order.deliveredAt =
        "2026-08-28T15:43:00";

      order.receivedBy =
        "Jan Kowalski";

      order.pod = true;
      order.cmr = true;
    }

    else {
      order.deliveredAt = null;
      order.receivedBy = null;

      if (position < 92) {
        order.pod = false;
        order.cmr = false;
      }
    }

    C12.state.mainOrderCreated =
      position >= 9;

    C12.state.mainOrderAssigned =
      position >= 24;

    C12.state.tripStarted =
      position >= 39;

    C12.state.arrivedLoading =
      position >= 39;

    C12.state.cargoLoaded =
      position >= 48;

    C12.state.inTransit =
      position >= 48;

    C12.state.delayReported =
      position >= 65 &&
      position < 92;

    C12.state.delivered =
      position >= 92;

    C12.state.podUploaded =
      position >= 92;

    syncMainResources(position);
  }


  /* ============================================================
     BACKGROUND ORDERS

     Масив із 200 перевезень теж реагує на час.
     Ми не переписуємо кожне замовлення вручну.
     Рахуємо віртуальний статус залежно від часу.
  ============================================================ */

  function getVirtualOrderStatus(order, simulationTime) {
    if (order.id === C12.mainOrder.id) {
      return C12.mainOrder.status;
    }

    const now = toDate(simulationTime);

    const createdAt = toDate(order.createdAt);
    const pickupAt = toDate(order.pickupAt);
    const deliveryAt = toDate(order.deliveryAt);
    const eta = toDate(order.eta);

    if (
      !now ||
      !createdAt ||
      !pickupAt ||
      !deliveryAt
    ) {
      return order.status;
    }

    if (now < createdAt) {
      return "future";
    }

    const planningStart = new Date(
      pickupAt.getTime() - 12 * 60 * 60 * 1000
    );

    const assignmentStart = new Date(
      pickupAt.getTime() - 4 * 60 * 60 * 1000
    );

    const loadingEnd = new Date(
      pickupAt.getTime() + 2 * 60 * 60 * 1000
    );

    if (now < planningStart) {
      return "new";
    }

    if (now < assignmentStart) {
      return "planning";
    }

    if (now < pickupAt) {
      return "assigned";
    }

    if (now < loadingEnd) {
      return "loading";
    }

    if (
      order.attention &&
      eta &&
      now >= deliveryAt &&
      now < eta
    ) {
      return "delayed";
    }

    if (now < deliveryAt) {
      return "transit";
    }

    return "delivered";
  }


  /* ============================================================
     GET VIRTUAL ORDERS
  ============================================================ */

  function getVirtualOrders(simulationTime) {
    return C12.orders.map(order => {
      if (order.id === C12.mainOrder.id) {
        return {
          ...C12.mainOrder,
          virtualStatus:
            C12.mainOrder.status
        };
      }

      const virtualStatus =
        getVirtualOrderStatus(
          order,
          simulationTime
        );

      return {
        ...order,

        virtualStatus,

        virtualStatusLabel:
          C12.statuses[virtualStatus]?.label ||
          (
            virtualStatus === "future"
              ? "ОЧІКУЄ"
              : virtualStatus
          ),

        virtualAttention:
          virtualStatus === "delayed" ||
          virtualStatus === "issue"
      };
    });
  }


  /* ============================================================
     SYSTEM KPI FROM VIRTUAL ORDERS
  ============================================================ */

  function calculateSystemStats(
    simulationTime,
    position
  ) {
    const orders =
      getVirtualOrders(simulationTime);

    const visibleOrders =
      orders.filter(
        order =>
          order.virtualStatus !== "future"
      );

    const active = visibleOrders.filter(
      order =>
        [
          "new",
          "planning",
          "assigned",
          "loading",
          "transit",
          "delayed",
          "issue"
        ].includes(order.virtualStatus)
    ).length;

    const transit = visibleOrders.filter(
      order =>
        [
          "transit",
          "delayed"
        ].includes(order.virtualStatus)
    ).length;

    const attention = visibleOrders.filter(
      order =>
        order.virtualAttention
    ).length;

    const delivered = visibleOrders.filter(
      order =>
        order.virtualStatus === "delivered"
    ).length;

    const point =
      getNearestTimePoint(position);

    const next =
      getNextTimePoint(position);

    const designedStats = {
      active: interpolateNumber(
        position,
        point,
        next,
        "active"
      ),

      transit: interpolateNumber(
        position,
        point,
        next,
        "transit"
      ),

      attention: interpolateNumber(
        position,
        point,
        next,
        "attention"
      ),

      delivered: interpolateNumber(
        position,
        point,
        next,
        "delivered"
      )
    };

    /*
      Для самого WOW-ефекту використовуємо сценарні KPI,
      але реальний масив теж рахуємо і залишаємо доступним.
    */

    return {
      ...designedStats,

      calculated: {
        active,
        transit,
        attention,
        delivered
      },

      totalVisible:
        visibleOrders.length,

      virtualOrders:
        orders
    };
  }


  /* ============================================================
     OWNER FINANCE BY TIME
  ============================================================ */

  function calculateFinance(position) {
    const ratio =
      0.58 + (position / 100) * 0.42;

    const base =
      C12.ownerDashboard.finance;

    const revenue =
      Math.round(
        base.revenue * ratio
      );

    const cost =
      Math.round(
        base.cost * ratio
      );

    const margin =
      revenue - cost;

    const marginPercent =
      revenue > 0
        ? Math.round(
            (margin / revenue) * 1000
          ) / 10
        : 0;

    return {
      revenue,
      cost,
      margin,
      marginPercent
    };
  }


  /* ============================================================
     FLEET STATE BY TIME
  ============================================================ */

  function calculateFleet(position) {
    if (position < 24) {
      return {
        transit: 8,
        free: 2,
        reserved: 1,
        service: 1
      };
    }

    if (position < 48) {
      return {
        transit: 8,
        free: 1,
        reserved: 2,
        service: 1
      };
    }

    if (position < 92) {
      return {
        transit: 9,
        free: 1,
        reserved: 1,
        service: 1
      };
    }

    return {
      transit: 8,
      free: 2,
      reserved: 1,
      service: 1
    };
  }


  /* ============================================================
     CUSTOMER STATUS
  ============================================================ */

  function getCustomerState(position) {
    if (position < 9) {
      return {
        status: "ОЧІКУЄ",
        eta: "28 серпня · 14:00",
        timelineStep: 0,
        delivered: false
      };
    }

    if (position < 24) {
      return {
        status: "ОТРИМАНО",
        eta: "28 серпня · 14:00",
        timelineStep: 1,
        delivered: false
      };
    }

    if (position < 48) {
      return {
        status: "ПІДТВЕРДЖЕНО",
        eta: "28 серпня · 14:00",
        timelineStep: 2,
        delivered: false
      };
    }

    if (position < 65) {
      return {
        status: "У ДОРОЗІ",
        eta: "28 серпня · 14:00",
        timelineStep: 4,
        delivered: false
      };
    }

    if (position < 92) {
      return {
        status: "У ДОРОЗІ",
        eta: "28 серпня · 16:00",
        timelineStep: 4,
        delivered: false,
        delay: true
      };
    }

    return {
      status: "ДОСТАВЛЕНО",
      eta: "28 серпня · 15:43",
      timelineStep: 5,
      delivered: true
    };
  }


  /* ============================================================
     DRIVER STATE
  ============================================================ */

  function getDriverState(position) {
    if (position < 24) {
      return {
        stage: "waiting-assignment",
        enabledAction: null
      };
    }

    if (position < 39) {
      return {
        stage: "assigned",
        enabledAction: "start"
      };
    }

    if (position < 48) {
      return {
        stage: "loading",
        enabledAction: "loaded"
      };
    }

    if (position < 65) {
      return {
        stage: "transit",
        enabledAction: "delay"
      };
    }

    if (position < 92) {
      return {
        stage: "delayed",
        enabledAction: "delivered"
      };
    }

    return {
      stage: "delivered",
      enabledAction: null
    };
  }


  /* ============================================================
     STORY CUSTOMER MESSAGES BY TIME
  ============================================================ */

  function getVisibleCustomerMessages(position) {
    const result = [];

    if (position >= 9) {
      result.push(
        C12.customerMessages.find(
          message =>
            message.id === "received"
        )
      );
    }

    if (position >= 24) {
      result.push(
        C12.customerMessages.find(
          message =>
            message.id === "confirmed"
        )
      );
    }

    if (position >= 48) {
      result.push(
        C12.customerMessages.find(
          message =>
            message.id === "loaded"
        )
      );
    }

    if (
      position >= 65 &&
      position < 92
    ) {
      result.push(
        C12.customerMessages.find(
          message =>
            message.id === "delay"
        )
      );
    }

    if (position >= 92) {
      result.push(
        C12.customerMessages.find(
          message =>
            message.id === "delivered"
        )
      );
    }

    return result.filter(Boolean);
  }


  /* ============================================================
     EVENT THRESHOLDS

     Використовуємо, щоб при русі ползунка вперед
     запускати окремі події лише один раз.
  ============================================================ */

  const thresholds = [
    {
      position: 9,
      id: "order-created",
      event: "created"
    },

    {
      position: 24,
      id: "vehicle-assigned",
      event: "assigned"
    },

    {
      position: 39,
      id: "arrived-loading",
      event: "arrived"
    },

    {
      position: 48,
      id: "cargo-transit",
      event: "transit"
    },

    {
      position: 65,
      id: "delay-reported",
      event: "delayed"
    },

    {
      position: 92,
      id: "delivered",
      event: "delivered"
    }
  ];


  const triggeredThresholds =
    new Set();


  function processThresholds(
    previousPosition,
    newPosition
  ) {
    if (newPosition < previousPosition) {
      for (const threshold of thresholds) {
        if (newPosition < threshold.position) {
          triggeredThresholds.delete(
            threshold.id
          );
        }
      }

      return [];
    }

    const events = [];

    for (const threshold of thresholds) {
      if (
        previousPosition <
          threshold.position &&
        newPosition >=
          threshold.position &&
        !triggeredThresholds.has(
          threshold.id
        )
      ) {
        triggeredThresholds.add(
          threshold.id
        );

        events.push(
          threshold.event
        );
      }
    }

    return events;
  }


  /* ============================================================
     MAIN SIMULATION STATE
  ============================================================ */

  function buildSimulationSnapshot(position) {
    const safePosition =
      clamp(
        Number(position) || 0,
        0,
        100
      );

    const time =
      getInterpolatedTime(
        safePosition
      );

    syncMainOrder(
      safePosition
    );

    const stats =
      calculateSystemStats(
        time,
        safePosition
      );

    const customer =
      getCustomerState(
        safePosition
      );

    const driver =
      getDriverState(
        safePosition
      );

    const fleet =
      calculateFleet(
        safePosition
      );

    const finance =
      calculateFinance(
        safePosition
      );

    const messages =
      getVisibleCustomerMessages(
        safePosition
      );

    return {
      position: safePosition,

      time,

      timeLabel:
        formatSimulationDate(
          time
        ),

      clockLabel:
        formatClock(
          time
        ),

      mainOrder: {
        ...C12.mainOrder
      },

      status:
        C12.mainOrder.status,

      statusLabel:
        C12.mainOrder.statusLabel,

      stats,

      customer,

      driver,

      fleet,

      finance,

      customerMessages:
        messages,

      attention:
        C12.mainOrder.attention
    };
  }


  /* ============================================================
     APPLY SIMULATION POSITION
  ============================================================ */

  function setPosition(
    position,
    options = {}
  ) {
    const previous =
      Number(
        C12.state.simulationPosition || 0
      );

    const next =
      clamp(
        Number(position) || 0,
        0,
        100
      );

    const crossedEvents =
      processThresholds(
        previous,
        next
      );

    const snapshot =
      buildSimulationSnapshot(
        next
      );

    C12.state.simulationPosition =
      next;

    C12.state.simulationTime =
      snapshot.time;

    C12.state.customerMessagesVisible =
      snapshot.customerMessages.map(
        message => message.id
      );

    const detail = {
      snapshot,
      crossedEvents,
      previousPosition: previous,
      position: next,
      source:
        options.source ||
        "simulation"
    };

    document.dispatchEvent(
      new CustomEvent(
        "c12:simulationchange",
        {
          detail
        }
      )
    );

    for (const eventName of crossedEvents) {
      document.dispatchEvent(
        new CustomEvent(
          "c12:storyevent",
          {
            detail: {
              event:
                eventName,

              snapshot,

              source:
                options.source ||
                "simulation"
            }
          }
        )
      );
    }

    return snapshot;
  }


  /* ============================================================
     MOVE TO STORY EVENT
  ============================================================ */

  function moveToEvent(eventName) {
    const mapping = {
      request: 9,
      assigned: 24,
      loading: 39,
      transit: 48,
      delay: 65,
      recovery: 78,
      delivered: 92,
      end: 100
    };

    if (
      !Object.prototype.hasOwnProperty.call(
        mapping,
        eventName
      )
    ) {
      console.warn(
        "[CASE 12] Unknown simulation event:",
        eventName
      );

      return null;
    }

    return setPosition(
      mapping[eventName],
      {
        source: "story"
      }
    );
  }


  /* ============================================================
     STEP FORWARD
  ============================================================ */

  function nextMilestone() {
    const position =
      Number(
        C12.state.simulationPosition || 0
      );

    const next =
      C12.timeMachine.find(
        point =>
          point.position > position
      );

    if (!next) {
      return setPosition(
        100,
        {
          source: "next-milestone"
        }
      );
    }

    return setPosition(
      next.position,
      {
        source: "next-milestone"
      }
    );
  }


  /* ============================================================
     STEP BACK
  ============================================================ */

  function previousMilestone() {
    const position =
      Number(
        C12.state.simulationPosition || 0
      );

    const previous = [
      ...C12.timeMachine
    ]
      .reverse()
      .find(
        point =>
          point.position < position
      );

    if (!previous) {
      return setPosition(
        0,
        {
          source:
            "previous-milestone"
        }
      );
    }

    return setPosition(
      previous.position,
      {
        source:
          "previous-milestone"
      }
    );
  }


  /* ============================================================
     RESET SIMULATION
  ============================================================ */

  function reset() {
    triggeredThresholds.clear();

    C12.state.simulationPosition = 4;
    C12.state.simulationTime =
      "2026-08-26T09:45:00";

    C12.state.mainOrderCreated = false;
    C12.state.mainOrderAssigned = false;

    C12.state.tripStarted = false;
    C12.state.arrivedLoading = false;
    C12.state.cargoLoaded = false;
    C12.state.inTransit = false;

    C12.state.delayReported = false;

    C12.state.delivered = false;
    C12.state.podUploaded = false;

    C12.state.customerMessagesVisible = [];

    const snapshot =
      buildSimulationSnapshot(4);

    document.dispatchEvent(
      new CustomEvent(
        "c12:simulationreset",
        {
          detail: {
            snapshot
          }
        }
      )
    );

    document.dispatchEvent(
      new CustomEvent(
        "c12:simulationchange",
        {
          detail: {
            snapshot,
            crossedEvents: [],
            previousPosition: 4,
            position: 4,
            source: "reset"
          }
        }
      )
    );

    return snapshot;
  }


  /* ============================================================
     MANUAL DRIVER ACTIONS

     Це потрібно, тому що водій може працювати
     не тільки через ползунок часу.
  ============================================================ */

  function driverAction(action) {
    const current =
      Number(
        C12.state.simulationPosition || 0
      );

    const mapping = {
      start: 34,
      arrived: 39,
      loaded: 45,
      transit: 48,
      delay: 65,
      delivered: 92
    };

    if (
      !Object.prototype.hasOwnProperty.call(
        mapping,
        action
      )
    ) {
      return {
        success: false,
        code: "UNKNOWN_DRIVER_ACTION"
      };
    }

    const target =
      mapping[action];

    /*
      Не даємо кнопкою водія відмотувати час назад.
    */

    if (target < current) {
      return {
        success: false,
        code: "ACTION_ALREADY_PASSED"
      };
    }

    const snapshot =
      setPosition(
        target,
        {
          source:
            `driver:${action}`
        }
      );

    return {
      success: true,
      action,
      snapshot
    };
  }


  /* ============================================================
     DELAY MANUAL TRIGGER
  ============================================================ */

  function reportDelay(
    hours = 2
  ) {
    const safeHours =
      Math.max(
        1,
        Number(hours) || 2
      );

    C12.state.delayReported = true;

    C12.mainOrder.status =
      "delayed";

    C12.mainOrder.statusLabel =
      C12.statuses.delayed.label;

    C12.mainOrder.attention =
      true;

    const eta =
      toDate(
        C12.mainOrder.eta
      ) ||
      new Date(
        "2026-08-28T14:00:00"
      );

    eta.setHours(
      eta.getHours() +
      safeHours
    );

    C12.mainOrder.eta =
      isoLocal(eta);

    const snapshot =
      setPosition(
        Math.max(
          C12.state.simulationPosition,
          65
        ),
        {
          source: "manual-delay"
        }
      );

    document.dispatchEvent(
      new CustomEvent(
        "c12:delayreported",
        {
          detail: {
            hours:
              safeHours,

            snapshot
          }
        }
      )
    );

    return snapshot;
  }


  /* ============================================================
     COMPLETE DELIVERY
  ============================================================ */

  function completeDelivery(
    options = {}
  ) {
    C12.mainOrder.receivedBy =
      options.receivedBy ||
      "Jan Kowalski";

    C12.mainOrder.deliveredAt =
      options.deliveredAt ||
      "2026-08-28T15:43:00";

    C12.mainOrder.pod =
      options.pod !== false;

    C12.mainOrder.cmr =
      options.cmr !== false;

    const snapshot =
      setPosition(
        92,
        {
          source:
            "manual-delivery"
        }
      );

    C12.rules.releaseVehicleForOrder(
      C12.mainOrder
    );

    document.dispatchEvent(
      new CustomEvent(
        "c12:deliverycompleted",
        {
          detail: {
            snapshot,
            order:
              C12.mainOrder
          }
        }
      )
    );

    return snapshot;
  }


  /* ============================================================
     UPLOAD POD
  ============================================================ */

  function uploadPod() {
    const validation =
      C12.rules.canUploadPod(
        C12.mainOrder
      );

    if (!validation.valid) {
      return {
        success: false,
        validation
      };
    }

    C12.mainOrder.pod = true;
    C12.mainOrder.cmr = true;

    C12.state.podUploaded = true;

    document.dispatchEvent(
      new CustomEvent(
        "c12:poduploaded",
        {
          detail: {
            order:
              C12.mainOrder,

            validation
          }
        }
      )
    );

    return {
      success: true,
      validation,
      order:
        C12.mainOrder
    };
  }


  /* ============================================================
     SIMULATION PREVIEW
  ============================================================ */

  function preview(position) {
    return buildSimulationSnapshot(
      clamp(
        Number(position) || 0,
        0,
        100
      )
    );
  }


  /* ============================================================
     PUBLIC API
  ============================================================ */

  C12.simulation = {
    setPosition,

    preview,

    reset,

    nextMilestone,
    previousMilestone,

    moveToEvent,

    driverAction,

    reportDelay,

    completeDelivery,

    uploadPod,

    getNearestTimePoint,
    getNextTimePoint,

    getInterpolatedTime,

    getMainStatusByPosition,

    getVirtualOrderStatus,
    getVirtualOrders,

    calculateSystemStats,
    calculateFinance,
    calculateFleet,

    getCustomerState,
    getDriverState,

    getVisibleCustomerMessages,

    formatSimulationDate,
    formatClock
  };


  /* ============================================================
     INITIAL SNAPSHOT
  ============================================================ */

  const initialSnapshot =
    buildSimulationSnapshot(
      C12.state.simulationPosition
    );

  C12.state.simulationTime =
    initialSnapshot.time;


  console.info(
    "[CASE 12] Simulation loaded:",
    initialSnapshot.position,
    initialSnapshot.time,
    initialSnapshot.status
  );

})();
