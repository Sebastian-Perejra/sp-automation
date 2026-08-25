(function () {
  "use strict";

  const C12 = window.C12 = window.C12 || {};

  if (
    !C12.data ||
    !C12.rules ||
    !C12.simulation ||
    !C12.state
  ) {
    console.error(
      "[CASE 12] case12-ui.js requires data, rules and simulation modules"
    );
    return;
  }


  /* ============================================================
     DOM HELPERS
  ============================================================ */

  const $ = (selector, root = document) => {
    return root.querySelector(selector);
  };


  const $$ = (selector, root = document) => {
    return Array.from(
      root.querySelectorAll(selector)
    );
  };


  const setText = (
    selector,
    value,
    root = document
  ) => {
    const element = $(
      selector,
      root
    );

    if (element) {
      element.textContent =
        value ?? "";
    }

    return element;
  };


  const setHidden = (
    selector,
    hidden,
    root = document
  ) => {
    const element = $(
      selector,
      root
    );

    if (!element) {
      return null;
    }

    element.hidden =
      Boolean(hidden);

    return element;
  };


  const escapeHtml = (value) => {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };


  const formatMoney = (
    value,
    currency = "€"
  ) => {
    const number =
      Number(value || 0);

    return (
      currency +
      number.toLocaleString(
        "uk-UA"
      )
    );
  };


  const formatNumber = (value) => {
    return Number(
      value || 0
    ).toLocaleString(
      "uk-UA"
    );
  };


  const formatDateShort = (value) => {
    if (!value) {
      return "—";
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "—";
    }

    const pad = n =>
      String(n)
        .padStart(2, "0");

    return (
      `${pad(date.getDate())}.` +
      `${pad(date.getMonth() + 1)} · ` +
      `${pad(date.getHours())}:` +
      `${pad(date.getMinutes())}`
    );
  };


  const formatDateFull = (value) => {
    if (!value) {
      return "—";
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "—";
    }

    return new Intl.DateTimeFormat(
      "uk-UA",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }
    ).format(date);
  };


  const statusClass = (
    status
  ) => {
    const map = {
      new:
        "is-new",

      planning:
        "is-planning",

      assigned:
        "is-assigned",

      loading:
        "is-loading",

      transit:
        "is-transit",

      delayed:
        "is-warning",

      customs:
        "is-transit",

      issue:
        "is-warning",

      delivered:
        "is-delivered",

      future:
        "is-muted"
    };

    return (
      map[status] ||
      ""
    );
  };


  /* ============================================================
     UI STATE
  ============================================================ */

  C12.uiState = {
    registerFilter:
      "all",

    modalStatusFilter:
      "all",

    modalExecutionFilter:
      "all",

    modalQuery:
      "",

    automationOpen:
      false
  };


  /* ============================================================
     TOAST
  ============================================================ */

  function showToast(
    title,
    text = "",
    type = "success",
    timeout = 3200
  ) {
    const stack =
      $(
        "[data-toast-stack]"
      );

    if (!stack) {
      return;
    }

    const toast =
      document.createElement(
        "div"
      );

    toast.className =
      `c12-toast c12-toast--${type}`;

    let icon = "✓";

    if (type === "warning") {
      icon = "⚠";
    }

    if (type === "error") {
      icon = "×";
    }

    if (type === "info") {
      icon = "i";
    }

    toast.innerHTML = `
      <span class="c12-toast__icon">
        ${icon}
      </span>

      <div class="c12-toast__body">
        <strong>
          ${escapeHtml(title)}
        </strong>

        ${
          text
            ? `
              <span>
                ${escapeHtml(text)}
              </span>
            `
            : ""
        }
      </div>
    `;

    stack.prepend(
      toast
    );

    requestAnimationFrame(
      () => {
        toast.classList.add(
          "is-visible"
        );
      }
    );

    window.setTimeout(
      () => {
        toast.classList.remove(
          "is-visible"
        );

        window.setTimeout(
          () => {
            toast.remove();
          },
          350
        );
      },
      timeout
    );
  }


  /* ============================================================
     AUTOMATION FEED
  ============================================================ */

  function addAutomationEvent(
    text,
    options = {}
  ) {
    if (!text) {
      return;
    }

    const event = {
      id:
        `AUT-${Date.now()}-${Math.random()
          .toString(16)
          .slice(2)}`,

      time:
        options.time ||
        C12.state.simulationTime,

      text,

      type:
        options.type ||
        "success"
    };

    C12.state.automationEvents.push(
      event
    );

    renderAutomationFeed();

    if (
      options.open !== false
    ) {
      openAutomationFeed();
    }

    return event;
  }


  function addAutomationBatch(
    events,
    options = {}
  ) {
    if (!Array.isArray(events)) {
      return;
    }

    events.forEach(
      (text, index) => {
        window.setTimeout(
          () => {
            addAutomationEvent(
              text,
              {
                ...options,
                open:
                  index === 0
                    ? options.open
                    : false
              }
            );
          },
          index * 140
        );
      }
    );
  }


  function renderAutomationFeed() {
    const container =
      $(
        "[data-automation-events]"
      );

    const counter =
      $(
        "[data-automation-count]"
      );

    if (!container) {
      return;
    }

    const events =
      C12.state
        .automationEvents
        .slice()
        .reverse();

    if (counter) {
      counter.textContent =
        String(
          C12.state
            .automationEvents
            .length
        );
    }

    if (!events.length) {
      container.innerHTML = `
        <div class="c12-empty-automation">
          Виконайте першу дію —
          тут з'являться автоматичні операції системи.
        </div>
      `;

      return;
    }

    container.innerHTML =
      events
        .map(
          event => `
            <div
              class="
                c12-automation-event
                c12-automation-event--${escapeHtml(
                  event.type
                )}
              "
            >
              <span class="c12-automation-event__check">
                ${
                  event.type ===
                  "warning"
                    ? "⚠"
                    : "✓"
                }
              </span>

              <div>
                <strong>
                  ${escapeHtml(
                    event.text
                  )}
                </strong>

                <small>
                  ${escapeHtml(
                    formatDateShort(
                      event.time
                    )
                  )}
                </small>
              </div>
            </div>
          `
        )
        .join("");
  }


  function openAutomationFeed() {
    const feed =
      $(
        "[data-automation-feed]"
      );

    if (!feed) {
      return;
    }

    C12.uiState
      .automationOpen =
      true;

    feed.classList.add(
      "is-open"
    );
  }


  function closeAutomationFeed() {
    const feed =
      $(
        "[data-automation-feed]"
      );

    if (!feed) {
      return;
    }

    C12.uiState
      .automationOpen =
      false;

    feed.classList.remove(
      "is-open"
    );
  }


  function toggleAutomationFeed() {
    if (
      C12.uiState
        .automationOpen
    ) {
      closeAutomationFeed();
    } else {
      openAutomationFeed();
    }
  }


  /* ============================================================
     STATUS BADGE
  ============================================================ */

  function statusBadge(
    status,
    label
  ) {
    const definition =
      C12.data.getStatus(
        status
      );

    const text =
      label ||
      definition?.label ||
      status;

    return `
      <span
        class="
          c12-table-status
          ${statusClass(
            status
          )}
        "
      >
        ${escapeHtml(text)}
      </span>
    `;
  }


  /* ============================================================
     DISPATCHER REGISTER
  ============================================================ */

  function getRegisterOrders() {
    let orders =
      C12.data
        .getFeaturedOrders();

    if (
      C12.uiState
        .registerFilter ===
      "attention"
    ) {
      orders =
        C12.orders
          .filter(
            order =>
              order.attention
          )
          .slice(
            0,
            12
          );
    }

    return orders;
  }


  function renderOrdersTable() {
    const tbody =
      $(
        "[data-orders-table]"
      );

    if (!tbody) {
      return;
    }

    const orders =
      getRegisterOrders();

    tbody.innerHTML =
      orders
        .map(
          order => {
            const isMain =
              order.id ===
              C12.mainOrder.id;

            return `
              <tr
                class="
                  ${
                    isMain
                      ? "is-main-order"
                      : ""
                  }

                  ${
                    order.attention
                      ? "is-warning"
                      : ""
                  }
                "
                data-order-row="${escapeHtml(
                  order.id
                )}"
              >
                <td>
                  <strong>
                    ${escapeHtml(
                      order.id
                    )}
                  </strong>
                </td>

                <td>
                  ${escapeHtml(
                    order.origin
                  )}
                  →
                  ${escapeHtml(
                    order.destination
                  )}
                </td>

                <td>
                  ${escapeHtml(
                    order.client
                  )}
                </td>

                <td>
                  ${escapeHtml(
                    formatDateShort(
                      order.pickupAt
                    )
                  )}
                </td>

                <td>
                  ${escapeHtml(
                    order.vehicle ||
                    "—"
                  )}
                </td>

                <td>
                  ${statusBadge(
                    order.status,
                    order.statusLabel
                  )}
                </td>
              </tr>
            `;
          }
        )
        .join("");

    setText(
      "[data-visible-orders]",
      orders.length
    );
  }


  /* ============================================================
     FULL 200 ORDER MODAL
  ============================================================ */

  function getFilteredModalOrders() {
    return C12.data
      .filterOrders({
        query:
          C12.uiState
            .modalQuery,

        status:
          C12.uiState
            .modalStatusFilter,

        execution:
          C12.uiState
            .modalExecutionFilter
      });
  }


  function renderAllOrdersTable() {
    const tbody =
      $(
        "[data-all-orders-table]"
      );

    if (!tbody) {
      return;
    }

    const orders =
      getFilteredModalOrders();

    tbody.innerHTML =
      orders
        .map(
          order => `
            <tr
              class="
                ${
                  order.id ===
                  C12.mainOrder.id
                    ? "is-main-order"
                    : ""
                }

                ${
                  order.attention
                    ? "is-warning"
                    : ""
                }
              "
            >
              <td>
                <strong>
                  ${escapeHtml(
                    order.id
                  )}
                </strong>
              </td>

              <td>
                ${escapeHtml(
                  formatDateShort(
                    order.createdAt
                  )
                )}
              </td>

              <td>
                ${escapeHtml(
                  order.client
                )}
              </td>

              <td>
                ${escapeHtml(
                  order.origin
                )}
                →
                ${escapeHtml(
                  order.destination
                )}
              </td>

              <td>
                ${escapeHtml(
                  order.cargo
                )}
                ·
                ${formatNumber(
                  order.weightKg
                )}
                кг
              </td>

              <td>
                ${escapeHtml(
                  formatDateShort(
                    order.pickupAt
                  )
                )}
              </td>

              <td>
                ${escapeHtml(
                  formatDateShort(
                    order.deliveryAt
                  )
                )}
              </td>

              <td>
                ${escapeHtml(
                  order.executionLabel ||
                  "Не призначено"
                )}
              </td>

              <td>
                ${escapeHtml(
                  order.vehicle ||
                  "—"
                )}
              </td>

              <td>
                ${escapeHtml(
                  order.driver ||
                  "—"
                )}
              </td>

              <td>
                ${statusBadge(
                  order.status,
                  order.statusLabel
                )}
              </td>

              <td>
                ${
                  order.revenue
                    ? `
                      <strong>
                        ${formatMoney(
                          order.margin
                        )}
                      </strong>
                    `
                    : "—"
                }
              </td>
            </tr>
          `
        )
        .join("");

    setText(
      "[data-modal-orders-summary]",
      `${orders.length} замовлень`
    );
  }


  function openOrdersModal() {
    const modal =
      $(
        "[data-orders-modal]"
      );

    if (!modal) {
      return;
    }

    renderAllOrdersTable();

    modal.hidden =
      false;

    document.body
      .classList.add(
        "c12-modal-open"
      );

    C12.state
      .ordersModalOpen =
      true;
  }


  function closeOrdersModal() {
    const modal =
      $(
        "[data-orders-modal]"
      );

    if (!modal) {
      return;
    }

    modal.hidden =
      true;

    document.body
      .classList.remove(
        "c12-modal-open"
      );

    C12.state
      .ordersModalOpen =
      false;
  }


  /* ============================================================
     INCOMING STREAM
  ============================================================ */

  function renderIncomingStream() {
    const container =
      $(
        "[data-incoming-stream]"
      );

    if (!container) {
      return;
    }

    const items =
      C12.incomingRequests
        .slice(0, 6);

    container.innerHTML =
      items
        .map(
          item => `
            <div class="c12-stream-item">
              <div class="c12-stream-item__top">
                <span>
                  ${escapeHtml(
                    item.sourceLabel
                  )}
                </span>

                <small>
                  ${escapeHtml(
                    item.time
                  )}
                </small>
              </div>

              <strong>
                ${escapeHtml(
                  item.client
                )}
              </strong>

              <span>
                ${escapeHtml(
                  item.route
                )}
              </span>

              <small>
                ${escapeHtml(
                  item.text
                )}
              </small>
            </div>
          `
        )
        .join("");
  }

/* ============================================================
   LIVE INBOX
============================================================ */

C12.uiState.inboxSource =
  "email";

C12.uiState.selectedInboxRequestId =
  "REQ-EMAIL-001";

C12.uiState.inboxOpen =
  true;


function getInboxSourceCaption(
  source,
  count
) {
  if (source === "email") {
    return count === 1
      ? "1 нова заявка"
      : `${count} нові заявки`;
  }

  if (source === "phone") {
    return count === 1
      ? "1 звернення"
      : `${count} звернення`;
  }

  if (source === "messenger") {
    return count === 1
      ? "1 звернення"
      : `${count} звернення`;
  }

  if (source === "exchange") {
    return count === 1
      ? "1 потенційне"
      : `${count} потенційних`;
  }

  return String(count);
}


function getInboxChannelTitle(
  source,
  count
) {
  if (source === "email") {
    return `${count} нові заявки`;
  }

  if (source === "phone") {
    return `${count} телефонні звернення`;
  }

  if (source === "messenger") {
    return `${count} нові діалоги`;
  }

  if (source === "exchange") {
    return `${count} пропозицій`;
  }

  return `${count} звернень`;
}


function getSelectedRequestHeading(
  request
) {
  if (!request) {
    return "Запит на перевезення";
  }

  if (request.source === "phone") {
    return "Телефонне звернення";
  }

  if (request.source === "messenger") {
    return "Діалог з клієнтом";
  }

  if (request.source === "exchange") {
    return "Заявка з транспортної біржі";
  }

  return "Запит на перевезення";
}


function renderInboxCounts() {
  const counts =
    C12.getInboxCounts();

  setText(
    "[data-incoming-total]",
    counts.total
  );

  [
    "email",
    "phone",
    "messenger",
    "exchange"
  ].forEach(
    source => {
      setText(
        `[data-source-count="${source}"]`,
        counts[source]
      );

      setText(
        `[data-source-caption="${source}"]`,
        getInboxSourceCaption(
          source,
          counts[source]
        )
      );
    }
  );
}


function renderInboxList(
  source =
    C12.uiState.inboxSource
) {
  const container =
    $(
      "[data-inbox-list]"
    );

  if (!container) {
    return;
  }

  const config =
    C12.inboxSourceConfig[
      source
    ];

  const requests =
    C12.getInboxRequests(
      source
    );

  setText(
    "[data-inbox-channel-label]",
    config?.label
      ?.toUpperCase() ||
      source.toUpperCase()
  );

  setText(
    "[data-inbox-channel-title]",
    getInboxChannelTitle(
      source,
      requests.length
    )
  );

  if (!requests.length) {
    container.innerHTML = `
      <div class="c12-inbox-empty">
        ${escapeHtml(
          config?.empty ||
          "Нових звернень немає"
        )}
      </div>
    `;

    return;
  }

  container.innerHTML =
    requests
      .map(
        request => {
          const selected =
            request.id ===
            C12.uiState
              .selectedInboxRequestId;

          return `
            <button
              class="
                c12-inbox-item
                ${
                  selected
                    ? "is-selected"
                    : ""
                }
              "
              type="button"
              data-inbox-request="${escapeHtml(
                request.id
              )}"
            >

              <div class="c12-inbox-item__top">

                <span class="c12-inbox-item__source">
                  ${escapeHtml(
                    request.sourceLabel
                  )}
                </span>

                <span class="c12-inbox-item__time">
                  ${escapeHtml(
                    request.time
                  )}
                </span>

              </div>


              <strong>
                ${escapeHtml(
                  request.client
                )}
              </strong>


              <span class="c12-inbox-item__route">
                ${escapeHtml(
                  request.origin
                )}
                →
                ${escapeHtml(
                  request.destination
                )}
              </span>


              <span class="c12-inbox-item__preview">
                ${escapeHtml(
                  request.preview
                )}
              </span>


              ${
                request.rate
                  ? `
                    <span class="c12-inbox-item__rate">
                      ${escapeHtml(
                        request.rate
                      )}
                    </span>
                  `
                  : ""
              }

            </button>
          `;
        }
      )
      .join("");
}


function renderSelectedInboxRequest(
  requestId =
    C12.uiState
      .selectedInboxRequestId
) {
  const request =
    C12.getInboxRequest(
      requestId
    );

  if (!request) {
    return;
  }

  C12.uiState
    .selectedInboxRequestId =
    request.id;

  C12.uiState
    .inboxSource =
    request.source;


  const panel =
    $(
      "[data-selected-request-panel]"
    );

  if (panel) {
    panel.dataset.requestSource =
      request.source;
  }


  setText(
    "[data-selected-request-channel]",
    `${request.sourceLabel.toUpperCase()} · ${request.time}`
  );


  setText(
    "[data-selected-request-heading]",
    getSelectedRequestHeading(
      request
    )
  );


  setText(
    "[data-selected-request-client-label]",
    request.source === "email"
      ? "ВІД"
      : "КЛІЄНТ"
  );


  setText(
    "[data-selected-request-client]",
    request.client
  );


  setText(
    "[data-selected-request-contact-label]",
    request.source === "exchange"
      ? "КОНТАКТ / БІРЖА"
      : "КОНТАКТ"
  );


  setText(
    "[data-selected-request-contact]",
    request.contact
  );


  setText(
    "[data-selected-request-subject]",
    request.title
  );


  setText(
    "[data-selected-request-pickup]",
    request.pickup
  );


  setText(
    "[data-selected-request-delivery]",
    request.delivery
  );


  setText(
    "[data-selected-request-cargo]",
    [
      request.cargo,
      request.pallets
        ? `${request.pallets} палет`
        : ""
    ]
      .filter(Boolean)
      .join(" · ")
  );


  setText(
    "[data-selected-request-weight]",
    `${formatNumber(
      request.weightKg
    )} кг`
  );


  setText(
    "[data-selected-request-vehicle]",
    request.vehicleType
  );


  const rateRow =
    $(
      "[data-selected-request-rate-row]"
    );

  if (rateRow) {
    rateRow.hidden =
      !request.rate;
  }


  setText(
    "[data-selected-request-rate]",
    request.rate || "—"
  );


  const sourceConfig =
    C12.inboxSourceConfig[
      request.source
    ];


  setText(
    "[data-selected-request-source-icon]",
    sourceConfig?.icon || "•"
  );


  setText(
    "[data-selected-request-source-name]",
    request.sourceLabel
  );


  setText(
    "[data-selected-request-contact-line]",
    request.contactLine || ""
  );


  const message =
    $(
      "[data-selected-request-message]"
    );

  const chat =
    $(
      "[data-selected-request-chat]"
    );


  if (
    Array.isArray(
      request.chat
    ) &&
    request.chat.length
  ) {
    if (message) {
      message.hidden =
        true;

      message.innerHTML =
        "";
    }

    if (chat) {
      chat.hidden =
        false;

      chat.innerHTML =
        request.chat
          .map(
            item => `
              <div
                class="
                  c12-chat-message
                  ${
                    item.side ===
                    "dispatcher"
                      ? "is-dispatcher"
                      : "is-client"
                  }
                "
              >
                ${escapeHtml(
                  item.text
                )}
              </div>
            `
          )
          .join("");
    }
  }

  else {
    if (chat) {
      chat.hidden =
        true;

      chat.innerHTML =
        "";
    }

    if (message) {
      message.hidden =
        false;

      message.innerHTML =
        request.message
          ? `
            <p>
              ${escapeHtml(
                request.message
              )}
            </p>
          `
          : "";
    }
  }


  const createButton =
    $(
      "[data-create-selected-request]"
    );

  if (createButton) {
    createButton.dataset
      .selectedRequestId =
      request.id;

    createButton.dataset
      .requestSource =
      request.source;
  }


  setText(
    "[data-create-request-label]",
    request.isMain
      ? "Створити замовлення"
      : "Створити замовлення"
  );


  $$(
    "[data-inbox-request]"
  ).forEach(
    button => {
      button.classList.toggle(
        "is-selected",
        button.dataset
          .inboxRequest ===
          request.id
      );
    }
  );
}


function openInboxSource(
  source,
  options = {}
) {
  if (
    !C12.inboxSourceConfig[
      source
    ]
  ) {
    return;
  }

  const drawer =
    $(
      "[data-inbox-drawer]"
    );

  const wasSameSource =
    C12.uiState
      .inboxSource ===
      source;

  const shouldToggle =
    options.toggle ===
    true;


  if (
    shouldToggle &&
    wasSameSource &&
    C12.uiState.inboxOpen
  ) {
    closeInbox();
    return;
  }


  C12.uiState.inboxSource =
    source;

  C12.uiState.inboxOpen =
    true;


  if (drawer) {
    drawer.hidden =
      false;
  }


  $$(
    "[data-source]"
  ).forEach(
    button => {
      const active =
        button.dataset.source ===
        source;

      button.classList.toggle(
        "is-active",
        active
      );

      button.classList.toggle(
        "is-hot",
        active
      );

      button.setAttribute(
        "aria-expanded",
        active
          ? "true"
          : "false"
      );
    }
  );


  const requests =
    C12.getInboxRequests(
      source
    );


  const selected =
    C12.getInboxRequest(
      C12.uiState
        .selectedInboxRequestId
    );


  if (
    !selected ||
    selected.source !==
      source ||
    selected.unread === false
  ) {
    C12.uiState
      .selectedInboxRequestId =
      requests[0]?.id ||
      null;
  }


  renderInboxList(
    source
  );


  if (
    C12.uiState
      .selectedInboxRequestId
  ) {
    renderSelectedInboxRequest(
      C12.uiState
        .selectedInboxRequestId
    );
  }
}


function closeInbox() {
  const drawer =
    $(
      "[data-inbox-drawer]"
    );

  C12.uiState.inboxOpen =
    false;

  if (drawer) {
    drawer.hidden =
      true;
  }


  $$(
    "[data-source]"
  ).forEach(
    button => {
      button.classList.remove(
        "is-active"
      );

      button.setAttribute(
        "aria-expanded",
        "false"
      );
    }
  );
}


function selectInboxRequest(
  requestId
) {
  const request =
    C12.getInboxRequest(
      requestId
    );

  if (!request) {
    return;
  }


  C12.uiState
    .selectedInboxRequestId =
    request.id;

  C12.uiState
    .inboxSource =
    request.source;


  renderInboxList(
    request.source
  );

  renderSelectedInboxRequest(
    request.id
  );
}


function refreshLiveInbox() {
  renderInboxCounts();

  renderInboxList(
    C12.uiState
      .inboxSource
  );

  if (
    C12.uiState
      .selectedInboxRequestId
  ) {
    renderSelectedInboxRequest(
      C12.uiState
        .selectedInboxRequestId
    );
  }
}


function bindLiveInbox() {

  document.addEventListener(
    "click",
    event => {

      const sourceButton =
        event.target.closest(
          "[data-source]"
        );

      if (sourceButton) {
        openInboxSource(
          sourceButton.dataset
            .source,
          {
            toggle: true
          }
        );

        return;
      }


      const requestButton =
        event.target.closest(
          "[data-inbox-request]"
        );

      if (requestButton) {
        selectInboxRequest(
          requestButton.dataset
            .inboxRequest
        );

        return;
      }


      const closeButton =
        event.target.closest(
          "[data-close-inbox]"
        );

      if (closeButton) {
        closeInbox();
      }
    }
  );
}


function initLiveInbox() {
  renderInboxCounts();

  openInboxSource(
    "email"
  );

  bindLiveInbox();
}


C12.inboxUI = {
  renderCounts:
    renderInboxCounts,

  renderList:
    renderInboxList,

  renderSelected:
    renderSelectedInboxRequest,

  openSource:
    openInboxSource,

  close:
    closeInbox,

  select:
    selectInboxRequest,

  refresh:
    refreshLiveInbox,

  getSelected() {
    return C12.getInboxRequest(
      C12.uiState
        .selectedInboxRequestId
    );
  }
};


if (
  document.readyState ===
  "loading"
) {
  document.addEventListener(
    "DOMContentLoaded",
    initLiveInbox,
    {
      once: true
    }
  );
}

else {
  initLiveInbox();
}
  
  /* ============================================================
     PLANNING QUEUE
  ============================================================ */

  function renderPlanningQueue() {
    const container =
      $(
        "[data-planning-orders]"
      );

    if (!container) {
      return;
    }

    const queue =
      C12.data
        .getPlanningOrders()
        .filter(
          order =>
            order.id !==
            C12.mainOrder.id
        )
        .slice(
          0,
          6
        );

    container.innerHTML =
      queue
        .map(
          order => `
            <div class="c12-mini-order">
              <div>
                <strong>
                  ${escapeHtml(
                    order.id
                  )}
                </strong>

                <span>
                  ${escapeHtml(
                    order.origin
                  )}
                  →
                  ${escapeHtml(
                    order.destination
                  )}
                </span>
              </div>

              <div>
                <span>
                  ${formatNumber(
                    order.weightKg
                  )}
                  кг
                </span>

                <small>
                  ${escapeHtml(
                    order.vehicleTypeLabel
                  )}
                </small>
              </div>
            </div>
          `
        )
        .join("");

    setText(
      "[data-waiting-assignment-count]",
      C12.data
        .getPlanningOrders()
        .length
    );
  }


  /* ============================================================
     CARRIERS
  ============================================================ */

  function renderCarriers() {
    const container =
      $(
        "[data-carriers-list]"
      );

    if (!container) {
      return;
    }

    container.innerHTML =
      C12.carriers
        .map(
          carrier => `
            <button
              class="c12-carrier-card"
              type="button"
              data-carrier="${escapeHtml(
                carrier.name
              )}"
            >
              <div class="c12-carrier-card__top">
                <strong>
                  ${escapeHtml(
                    carrier.name
                  )}
                </strong>

                <span>
                  ★
                  ${carrier.rating}
                </span>
              </div>

              <small>
                ${escapeHtml(
                  carrier.country
                )}
              </small>

              <div class="c12-carrier-card__meta">
                <span>
                  ${carrier.available}
                  авто вільно
                </span>

                <span>
                  ${escapeHtml(
                    carrier.types.join(
                      " · "
                    )
                  )}
                </span>
              </div>
            </button>
          `
        )
        .join("");
  }


  /* ============================================================
     ATTENTION LIST
  ============================================================ */

  function renderAttentionList() {
    const container =
      $(
        "[data-attention-list]"
      );

    if (!container) {
      return;
    }

    const orders =
      C12.attentionOrders;

    container.innerHTML =
      orders
        .map(
          item => `
            <button
              class="
                c12-attention-item
                c12-attention-item--${escapeHtml(
                  item.severity
                )}
              "
              type="button"
              data-attention-order="${escapeHtml(
                item.id
              )}"
            >
              <span class="c12-attention-item__icon">
                ⚠
              </span>

              <span class="c12-attention-item__content">
                <strong>
                  ${escapeHtml(
                    item.id
                  )}
                </strong>

                <span>
                  ${escapeHtml(
                    item.route
                  )}
                </span>

                <small>
                  ${escapeHtml(
                    item.issue
                  )}
                </small>
              </span>

              <span class="c12-attention-item__arrow">
                →
              </span>
            </button>
          `
        )
        .join("");
  }


  /* ============================================================
     MAP
  ============================================================ */

  function renderMapRoutes() {
  const container =
    $(
      "[data-map-routes]"
    );

  if (!container) {
    return;
  }

  const svgNS =
    "http://www.w3.org/2000/svg";

  const width =
    760;

  const height =
    520;

  const bounds = {
    minLon: 13.5,
    maxLon: 32.5,
    minLat: 43.4,
    maxLat: 55.3
  };

  const project = (
    lon,
    lat
  ) => {
    const x =
      (
        (
          lon -
          bounds.minLon
        ) /
        (
          bounds.maxLon -
          bounds.minLon
        )
      ) *
      width;

    const y =
      (
        (
          bounds.maxLat -
          lat
        ) /
        (
          bounds.maxLat -
          bounds.minLat
        )
      ) *
      height;

    return {
      x,
      y
    };
  };

  const cities = {
    "Львів": {
      lon: 24.0316,
      lat: 49.8429,
      dx: 12,
      dy: -12
    },

    "Київ": {
      lon: 30.5234,
      lat: 50.4501,
      dx: -8,
      dy: -13
    },

    "Краків": {
      lon: 19.945,
      lat: 50.0647,
      dx: -10,
      dy: -13
    },

    "Варшава": {
      lon: 21.0122,
      lat: 52.2297,
      dx: 10,
      dy: -12
    },

    "Катовіце": {
      lon: 19.0238,
      lat: 50.2649,
      dx: -12,
      dy: 17
    },

    "Будапешт": {
      lon: 19.0402,
      lat: 47.4979,
      dx: -12,
      dy: 19
    },

    "Бухарест": {
      lon: 26.1025,
      lat: 44.4268,
      dx: 12,
      dy: -10
    },

    "Чернівці": {
      lon: 25.9358,
      lat: 48.2915,
      dx: 11,
      dy: 17
    },

    "Ужгород": {
      lon: 22.2879,
      lat: 48.6208,
      dx: -12,
      dy: 18
    },

    "Кошице": {
      lon: 21.2611,
      lat: 48.7164,
      dx: -10,
      dy: -13
    },

    "Івано-Франківськ": {
      lon: 24.7111,
      lat: 48.9226,
      dx: 10,
      dy: 18
    }
  };

  const countries = [
    {
      name:
        "ПОЛЬЩА",

      points: [
        [14.15, 54.15],
        [16.7, 54.55],
        [18.8, 54.85],
        [21.4, 54.35],
        [23.8, 53.75],
        [24.1, 51.0],
        [22.7, 49.05],
        [19.1, 49.0],
        [16.1, 50.25],
        [14.15, 51.0]
      ],

      label:
        [18.2, 52.1]
    },

    {
      name:
        "УКРАЇНА",

      points: [
        [22.2, 51.15],
        [24.1, 52.15],
        [27.2, 52.25],
        [30.5, 51.65],
        [32.1, 50.4],
        [32.35, 48.8],
        [30.2, 47.7],
        [27.3, 47.7],
        [25.4, 47.65],
        [23.3, 48.25],
        [22.15, 49.4]
      ],

      label:
        [27.7, 50.2]
    },

    {
      name:
        "СЛОВАЧЧИНА",

      points: [
        [16.85, 49.5],
        [19.2, 49.55],
        [22.5, 49.15],
        [22.35, 48.35],
        [20.4, 47.7],
        [17.05, 48.05]
      ],

      label:
        [19.2, 48.65]
    },

    {
      name:
        "УГОРЩИНА",

      points: [
        [16.15, 48.55],
        [18.4, 48.25],
        [21.2, 48.5],
        [22.85, 48.2],
        [22.45, 46.95],
        [20.3, 46.0],
        [17.0, 46.1]
      ],

      label:
        [19.4, 47.15]
    },

    {
      name:
        "РУМУНІЯ",

      points: [
        [20.35, 47.75],
        [22.7, 48.15],
        [25.6, 47.9],
        [27.5, 47.15],
        [29.65, 45.05],
        [28.3, 43.75],
        [25.1, 43.65],
        [22.35, 44.15],
        [20.35, 46.05]
      ],

      label:
        [25.0, 45.8]
    },

    {
      name:
        "ЧЕХІЯ",

      points: [
        [13.6, 50.45],
        [15.0, 51.0],
        [16.8, 50.65],
        [18.8, 49.55],
        [16.85, 48.55],
        [14.1, 48.7],
        [13.55, 49.35]
      ],

      label:
        [15.5, 49.7]
    }
  ];

  const svg =
    document.createElementNS(
      svgNS,
      "svg"
    );

  svg.setAttribute(
    "viewBox",
    `0 0 ${width} ${height}`
  );

  svg.setAttribute(
    "preserveAspectRatio",
    "xMidYMid meet"
  );

  svg.setAttribute(
    "role",
    "img"
  );

  svg.setAttribute(
    "aria-label",
    "Карта поточних перевезень Центральної та Східної Європи"
  );

  svg.classList.add(
    "c12-real-map-svg"
  );


  const background =
    document.createElementNS(
      svgNS,
      "rect"
    );

  background.setAttribute(
    "x",
    "0"
  );

  background.setAttribute(
    "y",
    "0"
  );

  background.setAttribute(
    "width",
    String(width)
  );

  background.setAttribute(
    "height",
    String(height)
  );

  background.setAttribute(
    "class",
    "c12-real-map-background"
  );

  svg.appendChild(
    background
  );


  const countryGroup =
    document.createElementNS(
      svgNS,
      "g"
    );

  countryGroup.setAttribute(
    "class",
    "c12-real-map-countries"
  );

  countries.forEach(
    country => {
      const polygon =
        document.createElementNS(
          svgNS,
          "polygon"
        );

      polygon.setAttribute(
        "points",
        country.points
          .map(
            point => {
              const projected =
                project(
                  point[0],
                  point[1]
                );

              return (
                `${projected.x},${projected.y}`
              );
            }
          )
          .join(" ")
      );

      polygon.setAttribute(
        "class",
        "c12-real-map-country"
      );

      countryGroup.appendChild(
        polygon
      );


      const labelPoint =
        project(
          country.label[0],
          country.label[1]
        );

      const label =
        document.createElementNS(
          svgNS,
          "text"
        );

      label.setAttribute(
        "x",
        String(
          labelPoint.x
        )
      );

      label.setAttribute(
        "y",
        String(
          labelPoint.y
        )
      );

      label.setAttribute(
        "class",
        "c12-real-map-country-label"
      );

      label.textContent =
        country.name;

      countryGroup.appendChild(
        label
      );
    }
  );

  svg.appendChild(
    countryGroup
  );


  const routeGroup =
    document.createElementNS(
      svgNS,
      "g"
    );

  routeGroup.setAttribute(
    "class",
    "c12-real-map-routes"
  );


  C12.mapRoutes.forEach(
    (
      route,
      index
    ) => {
      const from =
        cities[
          route.from
        ];

      const to =
        cities[
          route.to
        ];

      if (
        !from ||
        !to
      ) {
        return;
      }

      const start =
        project(
          from.lon,
          from.lat
        );

      const end =
        project(
          to.lon,
          to.lat
        );

      const dx =
        end.x -
        start.x;

      const dy =
        end.y -
        start.y;

      const length =
        Math.max(
          1,
          Math.sqrt(
            dx * dx +
            dy * dy
          )
        );

      const nx =
        -dy /
        length;

      const ny =
        dx /
        length;

      const direction =
        route.from <
        route.to
          ? 1
          : -1;

      const curve =
        (
          11 +
          (
            index %
            3
          ) *
          4
        ) *
        direction;

      const controlX =
        (
          start.x +
          end.x
        ) /
        2 +
        nx *
        curve;

      const controlY =
        (
          start.y +
          end.y
        ) /
        2 +
        ny *
        curve;

      const path =
        document.createElementNS(
          svgNS,
          "path"
        );

      path.setAttribute(
        "d",
        [
          `M ${start.x} ${start.y}`,
          `Q ${controlX} ${controlY}`,
          `${end.x} ${end.y}`
        ].join(" ")
      );

      path.setAttribute(
        "class",
        [
          "c12-real-map-route",

          route.status ===
          "attention"
            ? "is-warning"
            : "",

          route.orderId ===
          C12.mainOrder.id
            ? "is-main"
            : ""
        ]
          .filter(Boolean)
          .join(" ")
      );

      path.setAttribute(
        "data-map-order",
        route.orderId
      );

      const title =
        document.createElementNS(
          svgNS,
          "title"
        );

      title.textContent =
        `${route.orderId}: ${route.from} → ${route.to}`;

      path.appendChild(
        title
      );

      routeGroup.appendChild(
        path
      );


      const t =
        0.54;

      const mt =
        1 -
        t;

      const truckX =
        mt *
        mt *
        start.x +
        2 *
        mt *
        t *
        controlX +
        t *
        t *
        end.x;

      const truckY =
        mt *
        mt *
        start.y +
        2 *
        mt *
        t *
        controlY +
        t *
        t *
        end.y;

      const truck =
        document.createElementNS(
          svgNS,
          "g"
        );

      truck.setAttribute(
        "class",
        [
          "c12-real-map-truck",

          route.status ===
          "attention"
            ? "is-warning"
            : "",

          route.orderId ===
          C12.mainOrder.id
            ? "is-main"
            : ""
        ]
          .filter(Boolean)
          .join(" ")
      );

      truck.setAttribute(
        "transform",
        `translate(${truckX} ${truckY})`
      );


      const halo =
        document.createElementNS(
          svgNS,
          "circle"
        );

      halo.setAttribute(
        "r",
        route.orderId ===
        C12.mainOrder.id
          ? "8"
          : "6"
      );

      halo.setAttribute(
        "class",
        "c12-real-map-truck-halo"
      );

      truck.appendChild(
        halo
      );


      const dot =
        document.createElementNS(
          svgNS,
          "circle"
        );

      dot.setAttribute(
        "r",
        route.orderId ===
        C12.mainOrder.id
          ? "4"
          : "3"
      );

      dot.setAttribute(
        "class",
        "c12-real-map-truck-dot"
      );

      truck.appendChild(
        dot
      );

      routeGroup.appendChild(
        truck
      );
    }
  );


  svg.appendChild(
    routeGroup
  );


  const usedCities =
    new Set();

  C12.mapRoutes.forEach(
    route => {
      usedCities.add(
        route.from
      );

      usedCities.add(
        route.to
      );
    }
  );


  const cityGroup =
    document.createElementNS(
      svgNS,
      "g"
    );

  cityGroup.setAttribute(
    "class",
    "c12-real-map-cities"
  );


  usedCities.forEach(
    cityName => {
      const city =
        cities[
          cityName
        ];

      if (!city) {
        return;
      }

      const point =
        project(
          city.lon,
          city.lat
        );

      const marker =
        document.createElementNS(
          svgNS,
          "circle"
        );

      marker.setAttribute(
        "cx",
        String(
          point.x
        )
      );

      marker.setAttribute(
        "cy",
        String(
          point.y
        )
      );

      marker.setAttribute(
        "r",
        cityName ===
        "Львів"
          ? "5"
          : "3.7"
      );

      marker.setAttribute(
        "class",
        cityName ===
        "Львів"
          ? "c12-real-map-city-dot is-hub"
          : "c12-real-map-city-dot"
      );

      cityGroup.appendChild(
        marker
      );


      const label =
        document.createElementNS(
          svgNS,
          "text"
        );

      label.setAttribute(
        "x",
        String(
          point.x +
          city.dx
        )
      );

      label.setAttribute(
        "y",
        String(
          point.y +
          city.dy
        )
      );

      label.setAttribute(
        "class",
        cityName ===
        "Львів"
          ? "c12-real-map-city-label is-hub"
          : "c12-real-map-city-label"
      );

      label.textContent =
        cityName;

      cityGroup.appendChild(
        label
      );
    }
  );


  svg.appendChild(
    cityGroup
  );


  const legend =
    document.createElementNS(
      svgNS,
      "g"
    );

  legend.setAttribute(
    "class",
    "c12-real-map-legend"
  );

  const legendItems = [
    {
      x: 28,
      label:
        "У рейсі",
      className:
        "is-transit"
    },

    {
      x: 118,
      label:
        "Потребує уваги",
      className:
        "is-warning"
    },

    {
      x: 257,
      label:
        "Головний рейс",
      className:
        "is-main"
    }
  ];

  legendItems.forEach(
    item => {
      const circle =
        document.createElementNS(
          svgNS,
          "circle"
        );

      circle.setAttribute(
        "cx",
        String(
          item.x
        )
      );

      circle.setAttribute(
        "cy",
        "495"
      );

      circle.setAttribute(
        "r",
        "4"
      );

      circle.setAttribute(
        "class",
        `c12-real-map-legend-dot ${item.className}`
      );

      legend.appendChild(
        circle
      );


      const text =
        document.createElementNS(
          svgNS,
          "text"
        );

      text.setAttribute(
        "x",
        String(
          item.x +
          10
        )
      );

      text.setAttribute(
        "y",
        "499"
      );

      text.setAttribute(
        "class",
        "c12-real-map-legend-text"
      );

      text.textContent =
        item.label;

      legend.appendChild(
        text
      );
    }
  );


  svg.appendChild(
    legend
  );


  container.innerHTML =
    "";

  container.appendChild(
    svg
  );
}

  /* ============================================================
     CUSTOMER MESSAGES
  ============================================================ */

  function renderCustomerMessages(
    messages = []
  ) {
    const container =
      $(
        "[data-customer-messages]"
      );

    if (!container) {
      return;
    }

    if (!messages.length) {
      container.innerHTML = `
        <div class="c12-message-empty">
          Поки що повідомлень немає.
        </div>
      `;

      return;
    }

    container.innerHTML =
      messages
        .slice()
        .reverse()
        .map(
          message => `
            <article class="c12-message-card">
              <div class="c12-message-card__top">
                <span>
                  ${escapeHtml(
                    message.channel
                  )}
                </span>

                <small>
                  ${escapeHtml(
                    message.time
                  )}
                </small>
              </div>

              <strong>
                ${escapeHtml(
                  message.title
                )}
              </strong>

              <p>
                ${escapeHtml(
                  message.text
                )}
              </p>
            </article>
          `
        )
        .join("");
  }


  /* ============================================================
     CUSTOMER TIMELINE
  ============================================================ */

  function updateCustomerTimeline(
    step
  ) {
    const timeline =
      $(
        "[data-customer-timeline]"
      );

    if (!timeline) {
      return;
    }

    const items =
      Array.from(
        timeline.children
      );

    items.forEach(
      (
        item,
        index
      ) => {
        item.classList.remove(
          "is-done",
          "is-current"
        );

        if (
          index <
          step
        ) {
          item.classList.add(
            "is-done"
          );
        }

        if (
          index ===
            step &&
          step <
            items.length
        ) {
          item.classList.add(
            "is-current"
          );
        }
      }
    );

    if (
      step >=
      items.length
    ) {
      items.forEach(
        item => {
          item.classList.add(
            "is-done"
          );
        }
      );
    }
  }


  /* ============================================================
     DRIVER TIMELINE
  ============================================================ */

  function updateDriverTimeline(
    snapshot
  ) {
    const timeline =
      $(
        "[data-trip-timeline]"
      );

    if (!timeline) {
      return;
    }

    const items =
      Array.from(
        timeline.children
      );

    let stageIndex = 0;

    switch (
      snapshot.status
    ) {
      case "assigned":
        stageIndex = 0;
        break;

      case "loading":
        stageIndex = 1;
        break;

      case "transit":
      case "delayed":
        stageIndex = 2;
        break;

      case "delivered":
        stageIndex = 3;
        break;

      default:
        stageIndex = 0;
    }

    items.forEach(
      (
        item,
        index
      ) => {
        item.classList.remove(
          "is-done",
          "is-current"
        );

        if (
          index <
          stageIndex
        ) {
          item.classList.add(
            "is-done"
          );
        }

        if (
          index ===
          stageIndex
        ) {
          item.classList.add(
            "is-current"
          );
        }
      }
    );

    if (
      snapshot.status ===
      "delivered"
    ) {
      items.forEach(
        item => {
          item.classList.add(
            "is-done"
          );

          item.classList.remove(
            "is-current"
          );
        }
      );
    }
  }


  /* ============================================================
     DRIVER BUTTONS
  ============================================================ */

function updateDriverActions() {
  const buttons =
    $$(
      "[data-driver-action]"
    );

  buttons.forEach(
    button => {
      button.disabled =
        true;
    }
  );

  const enable = action => {
    const button =
      $(
        `[data-driver-action="${action}"]`
      );

    if (button) {
      button.disabled =
        false;
    }
  };

  const step =
    Number(
      C12.state.driverStep ||
      0
    );

  if (step === 0) {
    enable(
      "start"
    );

    return;
  }

  if (step === 1) {
    enable(
      "arrived"
    );

    return;
  }

  if (step === 2) {
    enable(
      "loaded"
    );

    return;
  }

  if (step === 3) {
    enable(
      "transit"
    );

    return;
  }

  if (step === 4) {
    if (
      !C12.state.delayReported
    ) {
      enable(
        "delay"
      );
    }

    enable(
      "delivered"
    );

    return;
  }
}


  /* ============================================================
     OWNER KPI
  ============================================================ */

  function updateOwnerDashboard(
    snapshot
  ) {
    const stats =
      snapshot.stats;

    const fleet =
      snapshot.fleet;

    const finance =
      snapshot.finance;

    setText(
      "[data-kpi-active]",
      stats.active
    );

    setText(
      "[data-kpi-today]",
      C12.ownerDashboard.today
    );

    setText(
      "[data-kpi-attention]",
      stats.attention
    );

    setText(
      "[data-kpi-ontime]",
      `${
        snapshot.position >= 65
          ? "95,8"
          : "96,4"
      }%`
    );

    setText(
      "[data-fleet-transit]",
      fleet.transit
    );

    setText(
      "[data-fleet-free]",
      fleet.free
    );

    setText(
      "[data-fleet-reserved]",
      fleet.reserved
    );

    setText(
      "[data-fleet-service]",
      fleet.service
    );

    setText(
      "[data-finance-revenue]",
      formatMoney(
        finance.revenue
      )
    );

    setText(
      "[data-finance-cost]",
      formatMoney(
        finance.cost
      )
    );

    setText(
      "[data-finance-margin]",
      formatMoney(
        finance.margin
      )
    );

    setText(
      "[data-finance-margin-percent]",
      `${String(
        finance.marginPercent
      ).replace(
        ".",
        ","
      )}%`
    );

    updateFleetBars(
      fleet
    );
  }


  /* ============================================================
     FLEET BARS
  ============================================================ */

  function updateFleetBars(
    fleet
  ) {
    const bars =
      $$(
        ".c12-fleet-bars > div"
      );

    if (
      bars.length <
      4
    ) {
      return;
    }

    const total =
      12;

    const values = [
      fleet.transit,
      fleet.free,
      fleet.reserved,
      fleet.service
    ];

    bars.forEach(
      (
        row,
        index
      ) => {
        const bar =
          $("i", row);

        if (!bar) {
          return;
        }

        const percent =
          Math.max(
            0,
            Math.min(
              100,
              (
                values[index] /
                total
              ) *
                100
            )
          );

        bar.style
          .setProperty(
            "--value",
            `${percent}%`
          );
      }
    );
  }


  /* ============================================================
     TIME MACHINE
  ============================================================ */

  function updateTimeMachine(
    snapshot
  ) {
    const slider =
      $(
        "[data-time-slider]"
      );

    if (slider) {
      slider.value =
        snapshot.position;
    }

    setText(
      "[data-time-machine-label]",
      snapshot.timeLabel
    );

    setText(
      "[data-simulation-clock]",
      snapshot.clockLabel
    );

    setText(
      "[data-time-active]",
      snapshot.stats.active
    );

    setText(
      "[data-time-transit]",
      snapshot.stats.transit
    );

    setText(
      "[data-time-attention]",
      snapshot.stats.attention
    );

    setText(
      "[data-time-delivered]",
      snapshot.stats.delivered
    );

    const progress =
      $(
        "[data-time-progress]"
      );

    if (progress) {
      progress.style.width =
        `${snapshot.position}%`;
    }
  }


  /* ============================================================
     MAIN ORDER STRIP
  ============================================================ */

  function updateMainOrderStrip(
    snapshot
  ) {
    setText(
      "[data-main-order-id]",
      snapshot
        .mainOrder
        .id
    );

    setText(
      "[data-main-order-status]",
      snapshot
        .statusLabel
    );

    const status =
      $(
        "[data-main-order-status]"
      );

    if (status) {
      status.className =
        `c12-status-pill ${statusClass(
          snapshot.status
        )}`;
    }
  }


  /* ============================================================
     CUSTOMER VIEW
  ============================================================ */

  function updateCustomerView(
    snapshot
  ) {
    const customer =
      snapshot.customer;

    setText(
      "[data-customer-status]",
      customer.status
    );

    setText(
      "[data-customer-eta]",
      customer.eta
    );

    const status =
      $(
        "[data-customer-status]"
      );

    if (status) {
      status.className =
        `c12-status-pill ${statusClass(
          snapshot.status
        )}`;
    }

    updateCustomerTimeline(
      customer.timelineStep
    );

    renderCustomerMessages(
      snapshot
        .customerMessages
    );

    const result =
      $(
        "[data-delivery-result]"
      );

    if (result) {
      result.hidden =
        !customer.delivered;
    }
  }


  /* ============================================================
     MAIN ORDER CARD
  ============================================================ */

  function updateMainPlanningCard(
    snapshot
  ) {
    const card =
      $(
        '[data-draggable-order="TR-2026-00184"]'
      );

    if (!card) {
      return;
    }

    const assigned =
      snapshot.position >= 24;

    card.classList.toggle(
      "is-assigned",
      assigned
    );

    card.setAttribute(
      "draggable",
      assigned
        ? "false"
        : "true"
    );

    const hint =
      $(
        ".c12-drag-hint",
        card
      );

    if (hint) {
      hint.textContent =
        assigned
          ? "✓ DAF XF · BC 4587 KA призначено"
          : "Перетягніть на автомобіль →";
    }
  }


  /* ============================================================
     VEHICLE CARDS
  ============================================================ */

  function updateVehicleCards(
    snapshot
  ) {
    const valid =
      $(
        '[data-vehicle="BC4587KA"]'
      );

    if (valid) {
      valid.classList.toggle(
        "is-assigned",
        snapshot.position >= 24 &&
        snapshot.position < 92
      );

      const badge =
        $(
          ".c12-vehicle-card__status",
          valid
        );

      if (badge) {
        if (
          snapshot.position <
          24
        ) {
          badge.textContent =
            "ВІЛЬНИЙ";
        }

        else if (
          snapshot.position <
          48
        ) {
          badge.textContent =
            "ЗАРЕЗЕРВОВАНО";
        }

        else if (
          snapshot.position <
          92
        ) {
          badge.textContent =
            "У РЕЙСІ";
        }

        else {
          badge.textContent =
            "ВІЛЬНИЙ";
        }
      }
    }
  }


  /* ============================================================
     GLOBAL UI SNAPSHOT
  ============================================================ */

  function applySnapshot(
    snapshot
  ) {
    if (!snapshot) {
      return;
    }

    updateTimeMachine(
      snapshot
    );

    updateMainOrderStrip(
      snapshot
    );

    updateCustomerView(
      snapshot
    );

    updateDriverTimeline(
      snapshot
    );

    updateDriverActions(
      snapshot
    );

    updateOwnerDashboard(
      snapshot
    );

    updateMainPlanningCard(
      snapshot
    );

    updateVehicleCards(
      snapshot
    );

    renderOrdersTable();
  }


  /* ============================================================
     BUSINESS RULE MODAL
  ============================================================ */

  function showRuleModal(
    validation
  ) {
    const modal =
      $(
        "[data-rule-modal]"
      );

    if (!modal) {
      return;
    }

    const message =
      C12.rules
        .getRuleMessage(
          validation
        );

    setText(
      "[data-rule-title]",
      message.title
    );

    setText(
      "[data-rule-description]",
      message.description
    );

    const result =
      $(
        "[data-rule-result]"
      );

    if (result) {
      result.dataset.type =
        message.type;
    }

    modal.hidden =
      false;

    document.body
      .classList.add(
        "c12-modal-open"
      );
  }


  function closeRuleModal() {
    const modal =
      $(
        "[data-rule-modal]"
      );

    if (!modal) {
      return;
    }

    modal.hidden =
      true;

    document.body
      .classList.remove(
        "c12-modal-open"
      );
  }


  /* ============================================================
     ROLE SWITCHING
  ============================================================ */

  function showRole(
    role,
    options = {}
  ) {
    const scenes =
      $$(
        "[data-role-scene]"
      );

    const tabs =
      $$(
        "[data-role]"
      );

    scenes.forEach(
      scene => {
        scene.classList.toggle(
          "is-active",
          scene.dataset
            .roleScene ===
            role
        );
      }
    );

    tabs.forEach(
      tab => {
        tab.classList.toggle(
          "is-active",
          tab.dataset.role ===
            role
        );
      }
    );

    C12.state
      .currentRole =
      role;

    if (
      options.scroll !==
      false
    ) {
      const workspace =
        $(
          "[data-workspace]"
        );

      if (workspace) {
        const top =
          workspace
            .getBoundingClientRect()
            .top +
          window.scrollY -
          115;

        window.scrollTo({
          top,
          behavior:
            "smooth"
        });
      }
    }

    document.dispatchEvent(
      new CustomEvent(
        "c12:rolechange",
        {
          detail: {
            role
          }
        }
      )
    );
  }


  /* ============================================================
     WORKSPACE
  ============================================================ */

  function openWorkspace(
    role = "dispatcher"
  ) {
    const intro =
      $(
        '[data-scene="intro"]'
      );

    const workspace =
      $(
        "[data-workspace]"
      );

    const strip =
      $(
        "[data-global-order-strip]"
      );

    if (intro) {
      intro.classList.remove(
        "is-active"
      );

      intro.hidden =
        true;
    }

    if (workspace) {
      workspace.hidden =
        false;
    }

    if (strip) {
      strip.hidden =
        false;
    }

    C12.state
      .storyStarted =
      true;

    showRole(
      role,
      {
        scroll: false
      }
    );

    const snapshot =
      C12.simulation.preview(
        C12.state
          .simulationPosition
      );

    applySnapshot(
      snapshot
    );

    window.setTimeout(
      () => {
        workspace?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      },
      30
    );
  }


  /* ============================================================
     OVERVIEW
  ============================================================ */

  function showOverview() {
    const underhood =
      $(
        "[data-underhood]"
      );

    const beforeAfter =
      $(
        "[data-before-after]"
      );

    if (underhood) {
      underhood.hidden =
        false;

      underhood.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }

    if (beforeAfter) {
      beforeAfter.hidden =
        false;
    }
  }


  /* ============================================================
     STORY END SECTIONS
  ============================================================ */

  function showEndSections() {
    const sections = [
      "[data-underhood]",
      "[data-before-after]",
      "[data-final-section]"
    ];

    sections.forEach(
      selector => {
        const element =
          $(selector);

        if (element) {
          element.hidden =
            false;
        }
      }
    );
  }


  /* ============================================================
     EVENT RIPPLE
  ============================================================ */

  function showEventRipple() {
    const ripple =
      $(
        "[data-event-ripple]"
      );

    const workspace =
      $(
        "[data-workspace]"
      );

    if (!ripple) {
      return;
    }

    if (workspace) {
      workspace.hidden =
        true;
    }

    ripple.hidden =
      false;

    ripple.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }


  function closeEventRipple() {
  const ripple =
    $(
      "[data-event-ripple]"
    );

  const workspace =
    $(
      "[data-workspace]"
    );

  if (ripple) {
    ripple.hidden =
      true;
  }

  if (workspace) {
    workspace.hidden =
      false;
  }

  showRole(
    "driver"
  );
}

  /* ============================================================
     RESET UI
  ============================================================ */

  function resetUI() {
    closeOrdersModal();
    closeRuleModal();
    closeAutomationFeed();

    const intro =
      $(
        '[data-scene="intro"]'
      );

    const workspace =
      $(
        "[data-workspace]"
      );

    const strip =
      $(
        "[data-global-order-strip]"
      );

    const ripple =
      $(
        "[data-event-ripple]"
      );

    if (intro) {
      intro.hidden =
        false;

      intro.classList.add(
        "is-active"
      );
    }

    if (workspace) {
      workspace.hidden =
        true;
    }

    if (strip) {
      strip.hidden =
        true;
    }

    if (ripple) {
      ripple.hidden =
        true;
    }

    [
      "[data-underhood]",
      "[data-before-after]",
      "[data-final-section]"
    ].forEach(
      selector => {
        const element =
          $(selector);

        if (element) {
          element.hidden =
            true;
        }
      }
    );

    C12.state
      .automationEvents =
      [];

    renderAutomationFeed();

    C12.uiState
      .registerFilter =
      "all";

    C12.state
      .currentRole =
      "dispatcher";

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }


  /* ============================================================
     GENERIC EVENT BINDINGS
  ============================================================ */

  function bindGeneralUI() {
    $(
      "[data-start-story]"
    )?.addEventListener(
      "click",
      () => {
        openWorkspace(
          "dispatcher"
        );
      }
    );


    $(
      "[data-open-overview]"
    )?.addEventListener(
      "click",
      () => {
        showOverview();
      }
    );


    $$(
      "[data-role]"
    ).forEach(
      button => {
        button.addEventListener(
          "click",
          () => {
            showRole(
              button.dataset.role
            );
          }
        );
      }
    );


    $$(
      "[data-role-jump]"
    ).forEach(
      button => {
        button.addEventListener(
          "click",
          () => {
            openWorkspace(
              button.dataset
                .roleJump
            );
          }
        );
      }
    );


    $(
      "[data-open-all-orders]"
    )?.addEventListener(
      "click",
      openOrdersModal
    );


    $$(
      "[data-close-orders-modal]"
    ).forEach(
      button => {
        button.addEventListener(
          "click",
          closeOrdersModal
        );
      }
    );


    $$(
      "[data-close-rule-modal]"
    ).forEach(
      button => {
        button.addEventListener(
          "click",
          closeRuleModal
        );
      }
    );


    $(
      "[data-automation-toggle]"
    )?.addEventListener(
      "click",
      toggleAutomationFeed
    );


    $(
      "[data-close-ripple]"
    )?.addEventListener(
      "click",
      closeEventRipple
    );


    $(
      "[data-restart-case]"
    )?.addEventListener(
      "click",
      () => {
        C12.simulation.reset();
        resetUI();
      }
    );
  }


  /* ============================================================
     REGISTER FILTERS
  ============================================================ */

  function bindRegisterFilters() {
    $$(
      "[data-filter-orders]"
    ).forEach(
      button => {
        button.addEventListener(
          "click",
          () => {
            C12.uiState
              .registerFilter =
              button.dataset
                .filterOrders;

            $$(
              "[data-filter-orders]"
            ).forEach(
              item => {
                item.classList.toggle(
                  "is-active",
                  item === button
                );
              }
            );

            renderOrdersTable();
          }
        );
      }
    );
  }


  /* ============================================================
     MODAL FILTERS
  ============================================================ */

  function bindModalFilters() {
    const search =
      $(
        "[data-orders-search]"
      );

    const status =
      $(
        "[data-orders-status-filter]"
      );

    const execution =
      $(
        "[data-orders-execution-filter]"
      );

    search?.addEventListener(
      "input",
      () => {
        C12.uiState
          .modalQuery =
          search.value;

        renderAllOrdersTable();
      }
    );

    status?.addEventListener(
      "change",
      () => {
        C12.uiState
          .modalStatusFilter =
          status.value;

        renderAllOrdersTable();
      }
    );

    execution?.addEventListener(
      "change",
      () => {
        C12.uiState
          .modalExecutionFilter =
          execution.value;

        renderAllOrdersTable();
      }
    );
  }


  /* ============================================================
     TIME SLIDER
  ============================================================ */

  function bindTimeMachine() {
    const slider =
      $(
        "[data-time-slider]"
      );

    if (!slider) {
      return;
    }

    slider.addEventListener(
      "input",
      () => {
        C12.simulation
          .setPosition(
            Number(
              slider.value
            ),
            {
              source:
                "time-slider"
            }
          );
      }
    );
  }


  /* ============================================================
     OWNER FILTER BUTTONS
  ============================================================ */

  function bindOwnerFilters() {
    $$(
      "[data-owner-filter]"
    ).forEach(
      button => {
        button.addEventListener(
          "click",
          () => {
            const filter =
              button.dataset
                .ownerFilter;

            if (
              filter ===
              "attention"
            ) {
              C12.uiState
                .modalStatusFilter =
                "attention";

              const select =
                $(
                  "[data-orders-status-filter]"
                );

              if (select) {
                select.value =
                  "attention";
              }

              openOrdersModal();
              return;
            }

            if (
              filter ===
              "active"
            ) {
              C12.uiState
                .modalStatusFilter =
                "transit";

              const select =
                $(
                  "[data-orders-status-filter]"
                );

              if (select) {
                select.value =
                  "transit";
              }

              openOrdersModal();
              return;
            }

            if (
              filter ===
              "today"
            ) {
              openOrdersModal();
            }
          }
        );
      }
    );
  }


  /* ============================================================
     CUSTOMER POD
  ============================================================ */

  function bindDocuments() {
    $(
      "[data-upload-cmr]"
    )?.addEventListener(
      "click",
      () => {
        const result =
          C12.simulation
            .uploadPod();

        if (
          !result.success
        ) {
          showRuleModal(
            result.validation
          );

          return;
        }

        addAutomationBatch(
          C12.automationTemplates
            .documentUploaded
        );

        showToast(
          "CMR / POD додано",
          "Документ прив'язано до TR-2026-00184.",
          "success"
        );
      }
    );


    $(
      "[data-download-pod]"
    )?.addEventListener(
      "click",
      () => {
        showToast(
          "CMR / POD",
          "У демонстраційному кейсі документ не завантажується фізично.",
          "info"
        );
      }
    );
  }


  /* ============================================================
     STORY EVENT LISTENERS
  ============================================================ */

  function bindSystemEvents() {
    document.addEventListener(
      "c12:simulationchange",
      event => {
        applySnapshot(
          event.detail
            .snapshot
        );
      }
    );


    document.addEventListener(
      "c12:storyevent",
      event => {
        const name =
          event.detail
            .event;

        switch (name) {
          case "created":
            addAutomationBatch(
              C12.automationTemplates
                .orderCreated
            );
            break;

          case "assigned":
            addAutomationBatch(
              C12.automationTemplates
                .vehicleAssigned
            );
            break;

          case "arrived":
            addAutomationBatch(
              C12.automationTemplates
                .tripStarted
            );
            break;

          case "transit":
            addAutomationBatch(
              C12.automationTemplates
                .cargoLoaded
            );
            break;

          case "delayed":
            addAutomationBatch(
              C12.automationTemplates
                .delayReported
            );

            window.setTimeout(
              showEventRipple,
              900
            );

            break;

          case "delivered":
            addAutomationBatch(
              C12.automationTemplates
                .delivered
            );

            showEndSections();

            break;
        }
      }
    );


    document.addEventListener(
      "c12:simulationreset",
      event => {
        applySnapshot(
          event.detail
            .snapshot
        );
      }
    );


    document.addEventListener(
      "c12:delayreported",
      () => {
        showToast(
          "Затримку зафіксовано",
          "ETA перераховано. Система оновила всі ролі.",
          "warning"
        );
      }
    );


    document.addEventListener(
      "c12:deliverycompleted",
      () => {
        showToast(
          "Вантаж доставлено",
          "Перевезення TR-2026-00184 завершено.",
          "success"
        );
      }
    );
  }


  /* ============================================================
     INITIAL RENDER
  ============================================================ */

  function renderInitialUI() {
    renderOrdersTable();

    renderAllOrdersTable();

    renderIncomingStream();

    renderPlanningQueue();

    renderCarriers();

    renderAttentionList();

    renderMapRoutes();

    renderAutomationFeed();

    const snapshot =
      C12.simulation
        .preview(
          C12.state
            .simulationPosition
        );

    applySnapshot(
      snapshot
    );
  }


  /* ============================================================
     PUBLIC API
  ============================================================ */

  C12.ui = {
    render:
      renderInitialUI,

    applySnapshot,

    renderOrdersTable,
    renderAllOrdersTable,

    renderIncomingStream,
    renderPlanningQueue,
    renderCarriers,
    renderAttentionList,
    renderMapRoutes,

    renderCustomerMessages,

    addAutomationEvent,
    addAutomationBatch,

    openAutomationFeed,
    closeAutomationFeed,

    showToast,

    showRuleModal,
    closeRuleModal,

    openOrdersModal,
    closeOrdersModal,

    showRole,
    openWorkspace,

    showEventRipple,
    closeEventRipple,

    showOverview,
    showEndSections,

    resetUI
  };


  /* ============================================================
     INIT
  ============================================================ */

  function init() {
    bindGeneralUI();

    bindRegisterFilters();

    bindModalFilters();

    bindTimeMachine();

    bindOwnerFilters();

    bindDocuments();

    bindSystemEvents();

    renderInitialUI();

    console.info(
      "[CASE 12] UI loaded"
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

})();
