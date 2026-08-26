(function () {
  "use strict";

  const C12 = window.C12 = window.C12 || {};

  if (
    !C12.data ||
    !C12.rules ||
    !C12.simulation ||
    !C12.ui ||
    !C12.state
  ) {
    console.error(
      "[CASE 12] case12.js requires data, rules, simulation and ui modules"
    );
    return;
  }


  /* ============================================================
     HELPERS
  ============================================================ */

  const $ = (selector, root = document) => {
    return root.querySelector(selector);
  };


  const $$ = (selector, root = document) => {
    return Array.from(
      root.querySelectorAll(selector)
    );
  };


  const sleep = (ms) => {
    return new Promise(resolve => {
      window.setTimeout(resolve, ms);
    });
  };


  /* ============================================================
     STORY STATE
  ============================================================ */

  C12.story = {
    step: 0,

    steps: [
      "dispatcher",
      "manager",
      "driver",
      "customer",
      "owner"
    ],

    locked: false
  };


  /* ============================================================
     MODE
  ============================================================ */

  function setMode(mode) {
    if (
      ![
        "guided",
        "explore"
      ].includes(mode)
    ) {
      return;
    }

    C12.state.mode =
      mode;

    $$(
      "[data-mode]"
    ).forEach(
      button => {
        button.classList.toggle(
          "is-active",
          button.dataset.mode ===
            mode
        );
      }
    );

    if (mode === "guided") {
      C12.ui.showToast(
        "Guided mode",
        "Кейс веде вас через ролі по черзі.",
        "info"
      );
    }

    else {
      C12.ui.showToast(
        "Explore mode",
        "Можна вільно переходити між ролями та етапами.",
        "info"
      );
    }
  }


  /* ============================================================
     SOUND
  ============================================================ */

  function toggleSound() {
    C12.state.soundEnabled =
      !C12.state.soundEnabled;

    const button =
      $(
        "[data-sound-toggle]"
      );

    if (button) {
      button.classList.toggle(
        "is-active",
        C12.state.soundEnabled
      );
    }

    C12.ui.showToast(
      C12.state.soundEnabled
        ? "Звук увімкнено"
        : "Звук вимкнено",
      "",
      "info",
      1800
    );
  }


/* ============================================================
   CREATE ORDER FROM INBOX
============================================================ */

function parseInboxDate(
  value,
  fallback
) {
  const text =
    String(value || "");

  const match =
    text.match(
      /(\d{1,2})\.(\d{1,2}).*?(\d{1,2}):(\d{2})/
    );

  if (!match) {
    return fallback;
  }

  const day =
    String(match[1])
      .padStart(2, "0");

  const month =
    String(match[2])
      .padStart(2, "0");

  const hour =
    String(match[3])
      .padStart(2, "0");

  const minute =
    String(match[4])
      .padStart(2, "0");

  return (
    `2026-${month}-${day}` +
    `T${hour}:${minute}:00`
  );
}


function getNextOrderId() {
  const maxNumber =
    C12.orders.reduce(
      (
        currentMax,
        order
      ) => {
        const match =
          String(
            order.id || ""
          ).match(
            /(\d+)$/
          );

        if (!match) {
          return currentMax;
        }

        return Math.max(
          currentMax,
          Number(match[1])
        );
      },
      0
    );

  return (
    "TR-2026-" +
    String(
      maxNumber + 1
    ).padStart(
      5,
      "0"
    )
  );
}


function getVehicleTypeCode(
  label
) {
  const map = {
    "Тент":
      "curtain",

    "Рефрижератор":
      "refrigerator",

    "Мега":
      "mega",

    "Фургон":
      "van"
  };

  return (
    map[label] ||
    "curtain"
  );
}


function buildOrderFromInbox(
  request,
  orderId
) {
  const createdAt =
    C12.state
      .simulationTime ||
    C12.company
      .simulationStart;

  const pickupAt =
    parseInboxDate(
      request.pickup,
      createdAt
    );

  const deliveryAt =
    parseInboxDate(
      request.delivery,
      pickupAt
    );

  const origin =
    C12.data.getLocation(
      request.origin
    );

  const destination =
    C12.data.getLocation(
      request.destination
    );

  return {
    id:
      orderId,

    createdAt,

    source:
      request.source,

    sourceLabel:
      request.sourceLabel,

    client:
      request.client,

    contact:
      request.contact,

    email:
      request.source ===
      "email"
        ? request.contactLine
        : "",

    contactLine:
      request.contactLine ||
      "",

    origin:
      request.origin,

    originCountry:
      origin?.country ||
      "",

    destination:
      request.destination,

    destinationCountry:
      destination?.country ||
      "",

    pickupAt,

    deliveryAt,

    cargo:
      request.cargo,

    pallets:
      Number(
        request.pallets ||
        0
      ),

    weightKg:
      Number(
        request.weightKg ||
        0
      ),

    vehicleType:
      getVehicleTypeCode(
        request.vehicleType
      ),

    vehicleTypeLabel:
      request.vehicleType,

    execution:
      null,

    executionLabel:
      "Не призначено",

    carrier:
      null,

    vehicle:
      null,

    driver:
      null,

    status:
      "new",

    statusLabel:
      C12.statuses
        .new
        .label,

    attention:
      false,

    revenue:
      0,

    cost:
      0,

    margin:
      0,

    marginPercent:
      0,

    eta:
      deliveryAt,

    deliveredAt:
      null,

    receivedBy:
      null,

    cmr:
      false,

    pod:
      false,

    history: [
      {
        time:
          createdAt,

        status:
          "new",

        title:
          "Замовлення створено",

        actor:
          "Диспетчер"
      }
    ]
  };
}


function markInboxRequestProcessed(
  request,
  orderId
) {
  request.unread =
    false;

  request.createdOrderId =
    orderId;

  request.processedAt =
    C12.state
      .simulationTime;


  if (
    C12.inboxUI
  ) {
    C12.inboxUI.openSource(
      request.source
    );
  }
}


function updateCreatedOrderUI() {
  C12.ui
    .renderOrdersTable();

  C12.ui
    .renderAllOrdersTable();


  const liveCount =
    $(
      "[data-live-order-count]"
    );

  if (liveCount) {
    liveCount.textContent =
      String(
        C12.orders.length
      );
  }
}


async function createMainOrder() {
  const button =
    $(
      "[data-create-selected-request]"
    );

  const requestId =
    button?.dataset
      .selectedRequestId ||
    C12.uiState
      ?.selectedInboxRequestId ||
    "REQ-EMAIL-001";

  const request =
    C12.getInboxRequest(
      requestId
    );


  if (!request) {
    C12.ui.showToast(
      "Заявку не знайдено",
      "Оберіть звернення у вхідному каналі.",
      "warning"
    );

    return;
  }


 if (
  request.createdOrderId
) {
  request.createdOrderId =
    null;

  request.processedAt =
    null;

  request.unread =
    true;
}


  /* ============================================================
     MAIN STORY REQUEST
  ============================================================ */

  if (
    request.isMain
  ) {
    if (
      C12.state
        .mainOrderCreated
    ) {
      C12.ui.showToast(
        "Замовлення вже створено",
        "TR-2026-00184 уже знаходиться в реєстрі.",
        "info"
      );

      return;
    }


    C12.state
      .mainOrderCreated =
      true;


    C12.mainOrder.status =
      "new";

    C12.mainOrder.statusLabel =
      C12.statuses
        .new
        .label;


    C12.mainOrder
      .history
      .push({
        time:
          C12.state
            .simulationTime,

        status:
          "new",

        title:
          "Замовлення створено",

        actor:
          "Диспетчер"
      });


    markInboxRequestProcessed(
      request,
      C12.mainOrder.id
    );


    C12.ui.showToast(
      "TR-2026-00184 створено",
      "Замовлення додано до реєстру перевезень.",
      "success"
    );


    C12.simulation
      .setPosition(
        9,
        {
          source:
            "dispatcher-create"
        }
      );


    updateCreatedOrderUI();


    await sleep(
      700
    );


    if (
      C12.state.mode ===
      "guided"
    ) {
      C12.ui.showToast(
        "Далі — планування",
        "Тепер подивимося на це саме замовлення очима логіста.",
        "info",
        3200
      );


      await sleep(
        900
      );


      C12.ui.showRole(
        "manager"
      );
    }


    return;
  }

  /* ============================================================
     REGULAR INBOX REQUEST
  ============================================================ */

  const order =
    buildOrderFromInbox(
      request,
      C12.mainOrder.id
    );


  Object.assign(
    C12.mainOrder,
    order,
    {
      id:
        "TR-2026-00184",

      status:
        "new",

      statusLabel:
        C12.statuses
          .new
          .label,

      execution:
        null,

      executionLabel:
        "Не призначено",

      carrier:
        null,

      vehicle:
        null,

      driver:
        null,

      attention:
        false,

      deliveredAt:
        null,

      receivedBy:
        null,

      cmr:
        false,

      pod:
        false
    }
  );


  C12.state.mainOrderCreated =
    true;

  C12.state.mainOrderAssigned =
    false;

  C12.state.tripStarted =
    false;

  C12.state.arrivedLoading =
    false;

  C12.state.cargoLoaded =
    false;

  C12.state.inTransit =
    false;

  C12.state.delayReported =
    false;

  C12.state.delivered =
    false;

  C12.state.driverStep =
    0;


  C12.planningQueue =
    [
      C12.mainOrder,
      ...C12.planningQueue
        .filter(
          item =>
            item.id !==
            C12.mainOrder.id
        )
    ];


  markInboxRequestProcessed(
    request,
    C12.mainOrder.id
  );


  C12.ui
    .addAutomationBatch(
      [
        `Присвоєно номер ${C12.mainOrder.id}`,
        "Зафіксовано час створення",
        "Заявку перенесено до реєстру перевезень",
        "Статус встановлено: НОВЕ",
        "Замовлення додано до черги планування"
      ]
    );


  C12.ui.showToast(
    `${C12.mainOrder.id} створено`,
    `${request.client} · ${request.origin} → ${request.destination}`,
    "success"
  );


  C12.simulation
    .setPosition(
      9,
      {
        source:
          "dispatcher-create"
      }
    );


  updateCreatedOrderUI();


  await sleep(
    700
  );


  if (
    C12.state.mode ===
    "guided"
  ) {
    C12.ui.showToast(
      "Далі — планування",
      `${request.origin} → ${request.destination}. Тепер підбираємо ресурс.`,
      "info",
      3200
    );


    await sleep(
      900
    );


    C12.ui.showRole(
      "manager"
    );
  }
}
  /* ============================================================
     DRAG & DROP
  ============================================================ */

  let draggedOrderId =
    null;


  function bindDragAndDrop() {
    const draggable =
      $(
        '[data-draggable-order="TR-2026-00184"]'
      );

    if (draggable) {
      draggable.addEventListener(
        "dragstart",
        event => {
          if (
            C12.state.mainOrderAssigned
          ) {
            event.preventDefault();
            return;
          }

          draggedOrderId =
            draggable.dataset
              .draggableOrder;

          draggable.classList.add(
            "is-dragging"
          );

          if (
            event.dataTransfer
          ) {
            event.dataTransfer
              .setData(
                "text/plain",
                draggedOrderId
              );

            event.dataTransfer
              .effectAllowed =
                "move";
          }
        }
      );


      draggable.addEventListener(
        "dragend",
        () => {
          draggable.classList.remove(
            "is-dragging"
          );

          $$(
            "[data-drop-target]"
          ).forEach(
            card => {
              card.classList.remove(
                "is-drag-over"
              );
            }
          );

          draggedOrderId =
            null;
        }
      );
    }


    $$(
      "[data-drop-target]"
    ).forEach(
      card => {

        card.addEventListener(
          "dragover",
          event => {
            event.preventDefault();

            card.classList.add(
              "is-drag-over"
            );

            if (
              event.dataTransfer
            ) {
              event.dataTransfer
                .dropEffect =
                  "move";
            }
          }
        );


        card.addEventListener(
          "dragleave",
          () => {
            card.classList.remove(
              "is-drag-over"
            );
          }
        );


        card.addEventListener(
          "drop",
          event => {
            event.preventDefault();

            card.classList.remove(
              "is-drag-over"
            );

            const orderId =
              event.dataTransfer
                ?.getData(
                  "text/plain"
                ) ||
              draggedOrderId ||
              C12.mainOrder.id;

            const vehiclePlate =
              card.dataset.vehicle;

            handleVehicleDrop(
              orderId,
              vehiclePlate
            );
          }
        );
      }
    );
  }


  /* ============================================================
     VEHICLE DROP RESULT
  ============================================================ */

  async function handleVehicleDrop(
    orderId,
    vehiclePlate
  ) {
    const validation =
      C12.rules
        .validateVehicleForOrder(
          vehiclePlate,
          orderId
        );

    if (
      !validation.valid
    ) {
      C12.ui.showRuleModal(
        validation
      );

      C12.ui.showToast(
        "Призначення неможливе",
        validation.blocking
          ?.description ||
        "Автомобіль не відповідає умовам.",
        "warning",
        3600
      );

      return;
    }


    const result =
      C12.rules
        .assignVehicleToOrder(
          vehiclePlate,
          orderId
        );

    if (
      !result.success
    ) {
      C12.ui.showRuleModal(
        result.validation
      );

      return;
    }


    C12.state.mainOrderAssigned =
      true;


    C12.ui.addAutomationBatch(
      C12.automationTemplates
        .vehicleAssigned
    );


    C12.ui.showToast(
      "Автомобіль призначено",
      "DAF XF · BC 4587 KA · Олександр Петренко",
      "success"
    );


    C12.simulation.setPosition(
      24,
      {
        source:
          "manager-assignment"
      }
    );


    await sleep(800);


    if (
      C12.state.mode ===
      "guided"
    ) {
      C12.ui.showToast(
        "Ресурс призначено",
        "Тепер подивимося, що бачить водій.",
        "info"
      );

      await sleep(1000);

      C12.ui.showRole(
        "driver"
      );
    }
  }


  /* ============================================================
     VEHICLE CARD CLICK FALLBACK

     На мобільному drag&drop не завжди зручний.
     Тому клік по картці теж запускає перевірку.
  ============================================================ */

  function bindVehicleClicks() {
    $$(
      "[data-vehicle]"
    ).forEach(
      card => {
        card.addEventListener(
          "click",
          () => {
            if (
              C12.state.mainOrderAssigned
            ) {
              return;
            }

            handleVehicleDrop(
              C12.mainOrder.id,
              card.dataset.vehicle
            );
          }
        );
      }
    );
  }


  /* ============================================================
     CARRIER ASSIGNMENT
  ============================================================ */

  function bindCarriers() {
  document.addEventListener(
    "click",
    async event => {
      const button =
        event.target.closest(
          "[data-carrier]"
        );

      if (!button) {
        return;
      }

      if (
        C12.state
          .mainOrderAssigned
      ) {
        C12.ui.showToast(
          "Ресурс уже призначено",
          "Поточний ресурс уже закріплено за рейсом.",
          "info"
        );

        return;
      }

      const carrierName =
        button.dataset
          .carrier;

      const validation =
        C12.rules
          .validateCarrierForOrder(
            carrierName,
            C12.mainOrder
          );

      if (
        !validation.valid
      ) {
        C12.ui.showRuleModal(
          validation
        );

        return;
      }

      const result =
        C12.rules
          .assignCarrierToOrder(
            carrierName,
            C12.mainOrder
          );

      if (
        !result.success
      ) {
        C12.ui.showRuleModal(
          result.validation
        );

        return;
      }

      const offer =
        result.offer;

      C12.ui.showToast(
        "Залучений транспорт призначено",
        `${carrierName} · ${offer.brand} ${offer.model} · ${offer.displayPlate}`,
        "success",
        4200
      );

      C12.ui.addAutomationBatch(
        [
          `Перевірено доступність ${carrierName}`,
          `Підтверджено ${offer.brand} ${offer.model} · ${offer.displayPlate}`,
          `Водія ${offer.driver} призначено на рейс`,
          `Ставку €${offer.rate.toLocaleString("uk-UA")} зафіксовано`,
          "Клієнту сформовано підтвердження"
        ]
      );

      C12.simulation
        .setPosition(
          24,
          {
            source:
              "carrier-assignment"
          }
        );

      C12.ui.renderCarriers();

      await sleep(
        800
      );

      if (
        C12.state.mode ===
        "guided"
      ) {
        C12.ui.showToast(
          "Ресурс призначено",
          "Тепер рейс переходить до водія залученого перевізника.",
          "info"
        );

        await sleep(
          1000
        );

        C12.ui.showRole(
          "driver"
        );
      }
    }
  );
}


  /* ============================================================
     DRIVER ACTIONS
  ============================================================ */

 async function handleDriverAction(
  action
) {
  const refresh =
    () => {
      const snapshot =
        C12.simulation.preview(
          C12.state
            .simulationPosition
        );

      C12.ui.applySnapshot(
        snapshot
      );
    };


  switch (action) {

    case "start": {
      const result =
        C12.simulation
          .driverAction(
            "start"
          );

      if (
        !result ||
        !result.success
      ) {
        return;
      }

      C12.state.tripStarted =
        true;

      C12.state.driverStep =
        1;

      refresh();

      C12.ui.addAutomationBatch(
        C12.automationTemplates
          .tripStarted
      );

      C12.ui.showToast(
        "Рейс розпочато",
        "Наступний крок — прибуття на завантаження.",
        "success"
      );

      break;
    }


    case "arrived": {
      const result =
        C12.simulation
          .driverAction(
            "arrived"
          );

      if (
        !result ||
        !result.success
      ) {
        return;
      }

      C12.state.tripStarted =
        true;

      C12.state.arrivedLoading =
        true;

      C12.state.driverStep =
        2;

      refresh();

      C12.ui.addAutomationEvent(
        "Зафіксовано прибуття на завантаження"
      );

      C12.ui.showToast(
        "Автомобіль прибув",
        "Наступний крок — підтвердити завантаження.",
        "success"
      );

      break;
    }


    case "loaded": {
      const result =
        C12.simulation
          .driverAction(
            "loaded"
          );

      if (
        !result ||
        !result.success
      ) {
        return;
      }

      C12.state.tripStarted =
        true;

      C12.state.arrivedLoading =
        true;

      C12.state.cargoLoaded =
        true;

      C12.state.driverStep =
        3;

      refresh();

      C12.ui.addAutomationBatch(
        C12.automationTemplates
          .cargoLoaded
      );

      C12.ui.showToast(
        "Вантаж завантажено",
        "Тепер можна вирушати до клієнта.",
        "success"
      );

      break;
    }


    case "transit": {
      const result =
        C12.simulation
          .driverAction(
            "transit"
          );

      if (
        !result ||
        !result.success
      ) {
        return;
      }

      C12.state.tripStarted =
        true;

      C12.state.arrivedLoading =
        true;

      C12.state.cargoLoaded =
        true;

      C12.state.inTransit =
        true;

      C12.state.driverStep =
        4;

      refresh();

      C12.ui.showToast(
        "Вантаж у дорозі",
        "Можна завершити доставку або повідомити про затримку.",
        "success"
      );

      break;
    }


    case "delay": {
      C12.simulation
        .reportDelay(
          2
        );

      C12.state.delayReported =
        true;

      C12.state.driverStep =
        4;

      refresh();

      C12.ui.addAutomationBatch(
        C12.automationTemplates
          .delayReported
      );

      C12.ui.showToast(
        "Затримка +2 години",
        "ETA клієнта автоматично оновлено.",
        "warning"
      );

      break;
    }


    case "delivered": {
      C12.simulation
        .completeDelivery({
          receivedBy:
            "Jan Kowalski",

          pod:
            true,

          cmr:
            true
        });

      C12.state.delivered =
        true;

      C12.state.driverStep =
        5;

      refresh();

      C12.ui.addAutomationBatch(
        C12.automationTemplates
          .delivered
      );

      C12.ui.showToast(
        "Доставку завершено",
        "Отримав: Jan Kowalski.",
        "success"
      );

      await sleep(
        900
      );

      if (
        C12.state.mode ===
        "guided"
      ) {
        C12.ui.showRole(
          "customer"
        );
      }

      break;
    }
  }
}

  function bindDriverActions() {
    $$(
      "[data-driver-action]"
    ).forEach(
      button => {
        button.addEventListener(
          "click",
          () => {
            handleDriverAction(
              button.dataset
                .driverAction
            );
          }
        );
      }
    );
  }


  /* ============================================================
     CREATE BUTTON
  ============================================================ */

  function bindCreateOrder() {
    $(
      "[data-create-main-order]"
    )?.addEventListener(
      "click",
      createMainOrder
    );
  }


  /* ============================================================
     MODES
  ============================================================ */

  function bindModes() {
    $$(
      "[data-mode]"
    ).forEach(
      button => {
        button.addEventListener(
          "click",
          () => {
            setMode(
              button.dataset.mode
            );
          }
        );
      }
    );
  }


  /* ============================================================
     SOUND
  ============================================================ */

  function bindSound() {
    $(
      "[data-sound-toggle]"
    )?.addEventListener(
      "click",
      toggleSound
    );
  }


  /* ============================================================
     KEYBOARD
  ============================================================ */

  function bindKeyboard() {
    document.addEventListener(
      "keydown",
      event => {
        if (
          event.key ===
          "Escape"
        ) {
          C12.ui.closeOrdersModal();
          C12.ui.closeRuleModal();
          C12.ui.closeAutomationFeed();
        }

        if (
          event.key ===
          "ArrowRight" &&
          event.altKey
        ) {
          C12.simulation
            .nextMilestone();
        }

        if (
          event.key ===
          "ArrowLeft" &&
          event.altKey
        ) {
          C12.simulation
            .previousMilestone();
        }
      }
    );
  }


  /* ============================================================
     GUIDED STORY REACTIONS
  ============================================================ */

  function bindGuidedStory() {
    document.addEventListener(
      "c12:rolechange",
      event => {
        if (
          C12.state.mode !==
          "guided"
        ) {
          return;
        }

        const role =
          event.detail.role;

        const index =
          C12.story.steps
            .indexOf(role);

        if (
          index >= 0
        ) {
          C12.story.step =
            index;
        }
      }
    );


    document.addEventListener(
      "c12:storyevent",
      async event => {
        if (
          C12.state.mode !==
          "guided"
        ) {
          return;
        }

        const name =
          event.detail.event;

        if (
          name ===
          "delayed"
        ) {
          return;
        }

        if (
          name ===
          "delivered"
        ) {
          await sleep(1500);

          C12.ui.showRole(
            "customer"
          );

          await sleep(1100);

          C12.ui.showToast(
            "Клієнт бачить результат",
            "Тепер залишився погляд власника.",
            "info"
          );

          await sleep(1200);

          C12.ui.showRole(
            "owner"
          );

          await sleep(800);

          C12.ui.showEndSections();
        }
      }
    );
  }


  /* ============================================================
     ATTENTION ORDERS
  ============================================================ */

  function bindAttentionItems() {
    document.addEventListener(
      "click",
      event => {
        const button =
          event.target.closest(
            "[data-attention-order]"
          );

        if (!button) {
          return;
        }

        const id =
          button.dataset
            .attentionOrder;

        C12.ui.showToast(
          id,
          "Відкрито проблемне перевезення.",
          "warning"
        );

        C12.ui.openOrdersModal();
      }
    );
  }


  /* ============================================================
     MAIN ORDER ROW CLICK
  ============================================================ */

  function bindOrderRows() {
    document.addEventListener(
      "click",
      event => {
        const row =
          event.target.closest(
            "[data-order-row]"
          );

        if (!row) {
          return;
        }

        const id =
          row.dataset.orderRow;

        if (
          id !==
          C12.mainOrder.id
        ) {
          C12.ui.showToast(
            id,
            "Демонстраційне перевезення з реєстру.",
            "info"
          );

          return;
        }

        C12.ui.showToast(
          "TR-2026-00184",
          "Це головне перевезення інтерактивного кейсу.",
          "success"
        );
      }
    );
  }


  /* ============================================================
     LIVE INCOMING FLOW

     Щоб диспетчерський екран не виглядав мертвим.
  ============================================================ */

  function startIncomingFlow() {
    const container =
      $(
        "[data-incoming-stream]"
      );

    if (!container) {
      return;
    }

    let index =
      6;

    window.setInterval(
      () => {
        if (
          document.hidden ||
          !C12.state.storyStarted
        ) {
          return;
        }

        const request =
          C12.incomingRequests[
            index %
            C12.incomingRequests.length
          ];

        index += 1;

        const item =
          document.createElement(
            "div"
          );

        item.className =
          "c12-stream-item is-new";

        item.innerHTML = `
          <div class="c12-stream-item__top">
            <span>
              ${request.sourceLabel}
            </span>

            <small>
              щойно
            </small>
          </div>

          <strong>
            ${request.client}
          </strong>

          <span>
            ${request.route}
          </span>

          <small>
            ${request.text}
          </small>
        `;

        container.prepend(
          item
        );

        while (
          container.children
            .length > 6
        ) {
          container.lastElementChild
            ?.remove();
        }

        const live =
          $(
            "[data-live-order-count]"
          );

        if (live) {
          const current =
            Number(
              live.textContent ||
              200
            );

          live.textContent =
            String(
              current + 1
            );
        }

      },
      8500
    );
  }


  /* ============================================================
     RESET HOOK
  ============================================================ */

 function bindReset() {
  document.addEventListener(
    "c12:simulationreset",
    () => {
      C12.story.step =
        0;

      C12.state.mainOrderAssigned =
        false;

      C12.state.mainOrderCreated =
        false;

      C12.state.tripStarted =
        false;

      C12.state.arrivedLoading =
        false;

      C12.state.cargoLoaded =
        false;

      C12.state.inTransit =
        false;

      C12.state.delayReported =
        false;

      C12.state.delivered =
        false;

      C12.state.driverStep =
        0;


      if (
        Array.isArray(
          C12.inboxRequests
        )
      ) {
        C12.inboxRequests.forEach(
          request => {
            request.unread =
              true;

            request.createdOrderId =
              null;

            request.processedAt =
              null;
          }
        );
      }


      if (
        C12.uiState
      ) {
        C12.uiState.inboxSource =
          "email";

        C12.uiState.selectedInboxRequestId =
          "REQ-EMAIL-001";
      }


      if (
        C12.inboxUI
      ) {
        C12.inboxUI.openSource(
          "email"
        );
      }
    }
  );
}

  /* ============================================================
     SAFETY CHECK
  ============================================================ */

  function runStartupChecks() {
    const storyChecks =
      C12.rules
        .getMainStoryVehicleChecks();

    if (
      !storyChecks
        .validVehicle
        .valid
    ) {
      console.error(
        "[CASE 12] Main DAF must be valid",
        storyChecks.validVehicle
      );
    }

    if (
      storyChecks
        .busyVehicle
        .valid
    ) {
      console.error(
        "[CASE 12] MAN must be blocked"
      );
    }

    if (
      storyChecks
        .smallVehicle
        .valid
    ) {
      console.error(
        "[CASE 12] Mercedes must be blocked"
      );
    }
  }


  /* ============================================================
     INIT
  ============================================================ */

  function init() {

   if (
      !Number.isInteger(
        C12.state.driverStep
      )
    ) {
      C12.state.driverStep =
        0;
    }
    
    bindModes();

    bindSound();

    bindCreateOrder();

    bindDragAndDrop();

    bindVehicleClicks();

    bindCarriers();

    bindDriverActions();

    bindKeyboard();

    bindGuidedStory();

    bindAttentionItems();

    bindOrderRows();

    bindReset();

    startIncomingFlow();

    runStartupChecks();

    console.info(
      "[CASE 12] Main controller loaded"
    );
  }


  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      {
        once: true
      }
    );
  }

  else {
    init();
  }

document.addEventListener(
  "click",
  event => {
    const startButton =
      event.target.closest(
        "[data-start-story]"
      );

    if (!startButton) {
      return;
    }

    window.setTimeout(
      () => {
        const feed =
          document.querySelector(
            "[data-automation-feed]"
          );

        if (feed) {
          feed.classList.add(
            "is-open"
          );
        }
      },
      300
    );
  }
);

document.addEventListener(
  "c12:storyevent",
  () => {
    const feed =
      document.querySelector(
        "[data-automation-feed]"
      );

    if (feed) {
      feed.classList.add(
        "is-open"
      );
    }
  }
);
  
})();
