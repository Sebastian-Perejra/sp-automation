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

  const selectedCarrier =
    C12.mainOrder.execution ===
      "carrier"
      ? C12.mainOrder.carrier
      : null;

  container.innerHTML =
    C12.carriers
      .map(
        carrier => {
          const offer =
            carrier.offer;

          const selected =
            selectedCarrier ===
            carrier.name;

          return `
            <button
              class="
                c12-carrier-card
                ${
                  selected
                    ? "is-selected"
                    : ""
                }
              "
              type="button"
              data-carrier="${escapeHtml(
                carrier.name
              )}"
              aria-pressed="${
                selected
                  ? "true"
                  : "false"
              }"
            >

              <div class="c12-carrier-card__top">

                <strong>
                  ${escapeHtml(
                    carrier.name
                  )}
                </strong>

                <span>
                  ★ ${carrier.rating}
                </span>

              </div>

              <div class="c12-carrier-card__country">
                ${escapeHtml(
                  carrier.country
                )}
              </div>

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

              ${
                selected &&
                offer
                  ? `
                    <div class="c12-carrier-offer">

                      <span class="c12-carrier-offer__label">
                        ПІДІБРАНО ПІД ЦЕЙ РЕЙС
                      </span>

                      <div class="c12-carrier-offer__vehicle">

                        <div class="c12-carrier-truck">
                          <span></span>
                          <i></i>
                          <b></b>
                        </div>

                        <div>
                          <strong>
                            ${escapeHtml(
                              `${offer.brand} ${offer.model}`
                            )}
                          </strong>

                          <span>
                            ${escapeHtml(
                              offer.displayPlate
                            )}
                          </span>
                        </div>

                      </div>

                      <dl>

                        <div>
                          <dt>Кузов</dt>
                          <dd>
                            ${escapeHtml(
                              offer.typeLabel
                            )}
                          </dd>
                        </div>

                        <div>
                          <dt>Вантажність</dt>
                          <dd>
                            ${formatNumber(
                              offer.capacityKg
                            )}
                            кг
                          </dd>
                        </div>

                        <div>
                          <dt>Палетомісця</dt>
                          <dd>
                            ${offer.pallets}
                          </dd>
                        </div>

                        <div>
                          <dt>Водій</dt>
                          <dd>
                            ${escapeHtml(
                              offer.driver
                            )}
                          </dd>
                        </div>

                        <div>
                          <dt>Телефон</dt>
                          <dd>
                            ${escapeHtml(
                              offer.driverPhone
                            )}
                          </dd>
                        </div>

                        <div>
                          <dt>Локація</dt>
                          <dd>
                            ${escapeHtml(
                              offer.location
                            )}
                          </dd>
                        </div>

                        <div>
                          <dt>Подача</dt>
                          <dd>
                            ${escapeHtml(
                              formatDateShort(
                                offer.readyAt
                              )
                            )}
                          </dd>
                        </div>

                        <div>
                          <dt>Ставка</dt>
                          <dd>
                            €${formatNumber(
                              offer.rate
                            )}
                          </dd>
                        </div>

                      </dl>

                      <div class="c12-carrier-offer__confirmed">
                        ✓ ПРИЗНАЧЕНО
                      </div>

                    </div>
                  `
                  : ""
              }

            </button>
          `;
        }
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
   REAL OPERATIONS MAP
============================================================ */

let c12MapLibrariesLoader = null;
let c12OperationsMap = null;
let c12OperationsMapBound = false;
let c12UkraineBoundaryPromise = null;


const c12MapLocations = {
  "Львів": [49.8397, 24.0297],
  "Київ": [50.4501, 30.5234],
  "Варшава": [52.2297, 21.0122],
  "Краків": [50.0647, 19.9450],
  "Катовіце": [50.2649, 19.0238],
  "Будапешт": [47.4979, 19.0402],
  "Бухарест": [44.4268, 26.1025],
  "Чернівці": [48.2915, 25.9358],
  "Ужгород": [48.6208, 22.2879],
  "Кошице": [48.7164, 21.2611],
  "Івано-Франківськ": [48.9226, 24.7111]
};


const c12PoliticalCountries = [
  {
    iso: "UKR",
    name: "Україна",
    label: [49.2, 30.4],
    main: true
  },

  {
    iso: "POL",
    name: "Польща",
    label: [52.1, 19.0]
  },

  {
    iso: "CZE",
    name: "Чехія",
    label: [49.8, 15.4]
  },

  {
    iso: "SVK",
    name: "Словаччина",
    label: [48.7, 19.5]
  },

  {
    iso: "HUN",
    name: "Угорщина",
    label: [47.1, 19.4]
  },

  {
    iso: "ROU",
    name: "Румунія",
    label: [45.8, 24.8]
  },

  {
    iso: "MDA",
    name: "Молдова",
    label: [47.1, 28.6]
  },

  {
    iso: "BLR",
    name: "Білорусь",
    label: [53.3, 27.8]
  }
];


function loadStyleOnce(
  id,
  href
) {
  if (
    document.getElementById(
      id
    )
  ) {
    return;
  }

  const link =
    document.createElement(
      "link"
    );

  link.id =
    id;

  link.rel =
    "stylesheet";

  link.href =
    href;

  document.head.appendChild(
    link
  );
}


function loadScriptOnce(
  id,
  src,
  test
) {
  if (
    typeof test ===
      "function" &&
    test()
  ) {
    return Promise.resolve();
  }

  const existing =
    document.getElementById(
      id
    );

  if (existing) {
    return new Promise(
      (
        resolve,
        reject
      ) => {
        if (
          typeof test ===
            "function" &&
          test()
        ) {
          resolve();
          return;
        }

        existing.addEventListener(
          "load",
          resolve,
          {
            once: true
          }
        );

        existing.addEventListener(
          "error",
          reject,
          {
            once: true
          }
        );
      }
    );
  }

  return new Promise(
    (
      resolve,
      reject
    ) => {
      const script =
        document.createElement(
          "script"
        );

      script.id =
        id;

      script.src =
        src;

      script.onload =
        resolve;

      script.onerror =
        reject;

      document.head.appendChild(
        script
      );
    }
  );
}


function ensureMapLibraries() {
  if (
    window.L &&
    window.maplibregl &&
    typeof window.L.maplibreGL ===
      "function"
  ) {
    return Promise.resolve();
  }

  if (
    c12MapLibrariesLoader
  ) {
    return c12MapLibrariesLoader;
  }

  loadStyleOnce(
    "c12-leaflet-css",
    "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
  );

  loadStyleOnce(
    "c12-maplibre-css",
    "https://unpkg.com/maplibre-gl@5/dist/maplibre-gl.css"
  );

  c12MapLibrariesLoader =
    loadScriptOnce(
      "c12-leaflet-js",
      "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
      () =>
        Boolean(
          window.L &&
          typeof window.L.map ===
            "function"
        )
    )
      .then(
        () =>
          loadScriptOnce(
            "c12-maplibre-js",
            "https://unpkg.com/maplibre-gl@5/dist/maplibre-gl.js",
            () =>
              Boolean(
                window.maplibregl
              )
          )
      )
      .then(
        () =>
          loadScriptOnce(
            "c12-maplibre-leaflet-js",
            "https://unpkg.com/@maplibre/maplibre-gl-leaflet/leaflet-maplibre-gl.js",
            () =>
              Boolean(
                window.L &&
                typeof window.L.maplibreGL ===
                  "function"
              )
          )
      );

  return c12MapLibrariesLoader;
}


async function getSafeOpenFreeMapStyle() {
  const response =
    await fetch(
      "https://tiles.openfreemap.org/styles/liberty",
      {
        cache:
          "force-cache"
      }
    );

  if (
    !response.ok
  ) {
    throw new Error(
      "OpenFreeMap style unavailable"
    );
  }

  const style =
    await response.json();

  style.layers =
    style.layers.filter(
      layer => {
        const id =
          String(
            layer.id ||
            ""
          )
            .toLowerCase();

        const sourceLayer =
          String(
            layer[
              "source-layer"
            ] ||
            ""
          )
            .toLowerCase();

        if (
          sourceLayer ===
          "boundary"
        ) {
          return false;
        }

        if (
          id.includes(
            "boundary"
          )
        ) {
          return false;
        }

        if (
          id.includes(
            "country"
          )
        ) {
          return false;
        }

        if (
          id.includes(
            "state"
          )
        ) {
          return false;
        }

        return true;
      }
    );

  return style;
}


async function loadUkraineBoundary() {
  if (
    c12UkraineBoundaryPromise
  ) {
    return c12UkraineBoundaryPromise;
  }

  c12UkraineBoundaryPromise =
    (
      async () => {
        const response =
          await fetch(
            "/solutions/cases/case12/ukraine-boundary.geojson?v=1",
            {
              cache:
                "no-store"
            }
          );

        if (
          !response.ok
        ) {
          throw new Error(
            "Local Ukraine boundary unavailable"
          );
        }

        const geojson =
          await response.json();

        validateUkraineBoundary(
          geojson
        );

        return geojson;
      }
    )();

  return c12UkraineBoundaryPromise;
}

  function pointInsideRing(
  point,
  ring
) {
  const x =
    Number(
      point[0]
    );

  const y =
    Number(
      point[1]
    );

  let inside =
    false;

  for (
    let i = 0,
      j = ring.length - 1;
    i < ring.length;
    j = i++
  ) {
    const xi =
      Number(
        ring[i][0]
      );

    const yi =
      Number(
        ring[i][1]
      );

    const xj =
      Number(
        ring[j][0]
      );

    const yj =
      Number(
        ring[j][1]
      );

    const intersect =
      (
        (
          yi > y
        ) !==
        (
          yj > y
        )
      ) &&
      (
        x <
        (
          (
            xj - xi
          ) *
          (
            y - yi
          )
        ) /
        (
          (
            yj - yi
          ) ||
          Number.EPSILON
        ) +
        xi
      );

    if (
      intersect
    ) {
      inside =
        !inside;
    }
  }

  return inside;
}


function pointInsidePolygon(
  point,
  polygon
) {
  if (
    !polygon ||
    !polygon.length
  ) {
    return false;
  }

  if (
    !pointInsideRing(
      point,
      polygon[0]
    )
  ) {
    return false;
  }

  for (
    let i = 1;
    i < polygon.length;
    i += 1
  ) {
    if (
      pointInsideRing(
        point,
        polygon[i]
      )
    ) {
      return false;
    }
  }

  return true;
}


function geometryContainsPoint(
  geometry,
  point
) {
  if (!geometry) {
    return false;
  }

  if (
    geometry.type ===
    "Polygon"
  ) {
    return pointInsidePolygon(
      point,
      geometry.coordinates
    );
  }

  if (
    geometry.type ===
    "MultiPolygon"
  ) {
    return geometry.coordinates
      .some(
        polygon =>
          pointInsidePolygon(
            point,
            polygon
          )
      );
  }

  return false;
}


function geoJsonContainsPoint(
  geojson,
  point
) {
  if (!geojson) {
    return false;
  }

  if (
    geojson.type ===
    "Feature"
  ) {
    return geometryContainsPoint(
      geojson.geometry,
      point
    );
  }

  if (
    geojson.type ===
    "FeatureCollection"
  ) {
    return geojson.features
      .some(
        feature =>
          geometryContainsPoint(
            feature.geometry,
            point
          )
      );
  }

  return geometryContainsPoint(
    geojson,
    point
  );
}


function validateUkraineBoundary(
  geojson
) {
  const simferopol = [
    34.1003,
    44.9521
  ];

  const sevastopol = [
    33.5254,
    44.6167
  ];

  const simferopolInside =
    geoJsonContainsPoint(
      geojson,
      simferopol
    );

  const sevastopolInside =
    geoJsonContainsPoint(
      geojson,
      sevastopol
    );

  if (
    !simferopolInside ||
    !sevastopolInside
  ) {
    throw new Error(
      "Ukraine boundary validation failed"
    );
  }

  return true;
}

function getMapRouteStyle(
  route
) {
  if (
    route.orderId ===
    C12.mainOrder.id
  ) {
    return {
      color:
        "#2f78ad",

      weight:
        4,

      opacity:
        0.96,

      dashArray:
        null
    };
  }

  if (
    route.status ===
    "attention"
  ) {
    return {
      color:
        "#d28d28",

      weight:
        3.5,

      opacity:
        0.95,

      dashArray:
        "8 6"
    };
  }

  return {
    color:
      "#4f8a62",

    weight:
      2.7,

    opacity:
      0.8,

    dashArray:
      null
  };
}


function getPointOnRoute(
  from,
  to,
  ratio
) {
  return [
    from[0] +
      (
        to[0] -
        from[0]
      ) *
      ratio,

    from[1] +
      (
        to[1] -
        from[1]
      ) *
      ratio
  ];
}


function createCountryLabel(
  country
) {
  return window.L.divIcon({
    className:
      country.main
        ? "c12-country-label c12-country-label--ukraine"
        : "c12-country-label",

    html:
      `<span>${escapeHtml(
        country.name
      )}</span>`,

    iconSize: [
      0,
      0
    ]
  });
}


function createCrimeaLabel() {
  return window.L.divIcon({
    className:
      "c12-crimea-label",

    html:
      `
        <span>Крим</span>
        <strong>Україна</strong>
      `,

    iconSize: [
      0,
      0
    ]
  });
}

async function buildOperationsMap() {
  const container =
    $(
      "[data-map-routes]"
    );

  if (!container) {
    return;
  }

  if (
    container.clientWidth <
    80
  ) {
    return;
  }

  if (
    c12OperationsMap
  ) {
    window.setTimeout(
      () => {
        c12OperationsMap
          .invalidateSize();
      },
      80
    );

    return;
  }

  container.innerHTML = `
    <div class="c12-map-loading">
      Завантаження карти…
    </div>
  `;

  let mapStyle;
  let ukraineBoundary;

  try {
    [
      mapStyle,
      ukraineBoundary
    ] =
      await Promise.all([
        getSafeOpenFreeMapStyle(),
        loadUkraineBoundary()
      ]);
  } catch (error) {
    console.error(
      "[CASE 12] Safe map validation failed:",
      error
    );

    container.innerHTML = `
      <div class="c12-map-error">
        <strong>
          Карта тимчасово недоступна
        </strong>

        <span>
          Локальний шар кордонів України не пройшов перевірку.
        </span>
      </div>
    `;

    return;
  }

  container.innerHTML =
    "";

  container.classList.add(
    "c12-leaflet-map"
  );

  c12OperationsMap =
    window.L.map(
      container,
      {
        zoomControl:
          false,

        attributionControl:
          true,

        scrollWheelZoom:
          false,

        doubleClickZoom:
          false,

        boxZoom:
          false,

        keyboard:
          false,

        preferCanvas:
          true,

        maxBounds: [
          [
            42.0,
            11.5
          ],
          [
            57.0,
            41.5
          ]
        ],

        maxBoundsViscosity:
          1
      }
    );

  c12OperationsMap.createPane(
    "c12PoliticalPane"
  );

  c12OperationsMap
    .getPane(
      "c12PoliticalPane"
    )
    .style.zIndex =
    "450";

  c12OperationsMap.createPane(
    "c12RoutesPane"
  );

  c12OperationsMap
    .getPane(
      "c12RoutesPane"
    )
    .style.zIndex =
    "650";

  c12OperationsMap.createPane(
    "c12VehiclesPane"
  );

  c12OperationsMap
    .getPane(
      "c12VehiclesPane"
    )
    .style.zIndex =
    "680";

  c12OperationsMap.createPane(
    "c12LabelsPane"
  );

  c12OperationsMap
    .getPane(
      "c12LabelsPane"
    )
    .style.zIndex =
    "700";

const politicalRenderer =
  window.L.canvas({
    pane:
      "c12PoliticalPane",
    padding:
      0.5
  });

const routesRenderer =
  window.L.canvas({
    pane:
      "c12RoutesPane",
    padding:
      0.5
  });

const vehiclesRenderer =
  window.L.canvas({
    pane:
      "c12VehiclesPane",
    padding:
      0.5
  });

  window.L
    .maplibreGL({
      style:
        mapStyle,

      interactive:
        false
    })
    .addTo(
      c12OperationsMap
    );

  window.L
    .geoJSON(
      ukraineBoundary,
      {
        renderer:
          politicalRenderer,

        interactive:
          false,

        style: {
          color:
            "#36764d",

          weight:
            3,

          opacity:
            1,

          fillColor:
            "#e7f3ea",

          fillOpacity:
            0.14
        }
      }
    )
    .addTo(
      c12OperationsMap
    );

  window.L.marker(
    [
      49.2,
      30.4
    ],
    {
      pane:
        "c12LabelsPane",

      interactive:
        false,

      keyboard:
        false,

      icon:
        createCountryLabel({
          name:
            "Україна",

          main:
            true
        })
    }
  )
  .addTo(
    c12OperationsMap
  );

  window.L.marker(
    [
      44.95,
      34.10
    ],
    {
      pane:
        "c12LabelsPane",

      interactive:
        false,

      keyboard:
        false,

      icon:
        createCrimeaLabel()
    }
  )
  .addTo(
    c12OperationsMap
  );

  window.L.control
    .zoom({
      position:
        "bottomright"
    })
    .addTo(
      c12OperationsMap
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

  usedCities.forEach(
    cityName => {
      const location =
        c12MapLocations[
          cityName
        ];

      if (!location) {
        return;
      }

      const mainCity =
        cityName ===
          "Львів" ||
        cityName ===
          "Краків";

      const marker =
        window.L.circleMarker(
          location,
          {
            renderer:
              vehiclesRenderer,

            radius:
              mainCity
                ? 5
                : 3.5,

            color:
              "#ffffff",

            weight:
              2,

            fillColor:
              mainCity
                ? "#2f78ad"
                : "#4f8a62",

            fillOpacity:
              1
          }
        )
        .addTo(
          c12OperationsMap
        );

      marker.bindTooltip(
        cityName,
        {
          direction:
            "top",

          offset: [
            0,
            -5
          ],

          className:
            "c12-map-tooltip"
        }
      );
    }
  );

  C12.mapRoutes.forEach(
    (
      route,
      index
    ) => {
      const from =
        c12MapLocations[
          route.from
        ];

      const to =
        c12MapLocations[
          route.to
        ];

      if (
        !from ||
        !to
      ) {
        return;
      }

      const routeStyle =
        getMapRouteStyle(
          route
        );

      const line =
        window.L.polyline(
          [
            from,
            to
          ],
          {
            renderer:
              routesRenderer,

            color:
              routeStyle.color,

            weight:
              routeStyle.weight,

            opacity:
              routeStyle.opacity,

            dashArray:
              routeStyle.dashArray,

            lineCap:
              "round",

            lineJoin:
              "round",

            interactive:
              true
          }
        )
        .addTo(
          c12OperationsMap
        );

      line.bindPopup(
        `
          <div class="c12-map-popup">
            <strong>
              ${escapeHtml(
                route.orderId
              )}
            </strong>

            <span>
              ${escapeHtml(
                route.from
              )}
              →
              ${escapeHtml(
                route.to
              )}
            </span>
          </div>
        `
      );

      const currentPoint =
        getPointOnRoute(
          from,
          to,
          0.42 +
            (
              index %
              4
            ) *
            0.11
        );

      const currentMarker =
        window.L.circleMarker(
          currentPoint,
          {
            renderer:
              vehiclesRenderer,

            radius:
              route.orderId ===
              C12.mainOrder.id
                ? 6
                : 4,

            color:
              "#ffffff",

            weight:
              2,

            fillColor:
              routeStyle.color,

            fillOpacity:
              1
          }
        )
        .addTo(
          c12OperationsMap
        );

      currentMarker.bindTooltip(
        route.orderId,
        {
          direction:
            "top",

          className:
            "c12-map-tooltip"
        }
      );
    }
  );

  const Legend =
    window.L.Control.extend({
      onAdd() {
        const legend =
          window.L.DomUtil.create(
            "div",
            "c12-map-legend"
          );

        legend.innerHTML = `
          <span>
            <i class="is-transit"></i>
            У рейсі
          </span>

          <span>
            <i class="is-warning"></i>
            Потребує уваги
          </span>

          <span>
            <i class="is-main"></i>
            Головний рейс
          </span>
        `;

        return legend;
      }
    });

  new Legend({
    position:
      "bottomleft"
  })
  .addTo(
    c12OperationsMap
  );

  c12OperationsMap.fitBounds(
    [
      [
        43.0,
        13.0
      ],
      [
        55.7,
        40.5
      ]
    ],
    {
      padding: [
        8,
        8
      ]
    }
  );

  window.setTimeout(
    () => {
      c12OperationsMap
        .invalidateSize();
    },
    150
  );
}

function renderMapRoutes() {
  const openMap =
    () => {
      ensureMapLibraries()
        .then(
          () =>
            buildOperationsMap()
        )
        .catch(
          error => {
            console.error(
              "[CASE 12] Map libraries failed:",
              error
            );
          }
        );
    };

  if (
    !c12OperationsMapBound
  ) {
    c12OperationsMapBound =
      true;

    document.addEventListener(
      "c12:rolechange",
      event => {
        if (
          event.detail
            ?.role !==
          "owner"
        ) {
          return;
        }

        window.setTimeout(
          openMap,
          100
        );
      }
    );
  }

  const ownerScene =
    $(
      '[data-role-scene="owner"]'
    );

  if (
    ownerScene &&
    ownerScene
      .classList
      .contains(
        "is-active"
      )
  ) {
    window.setTimeout(
      openMap,
      80
    );
  }
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

function updateDriverActions(
  snapshot
) {
  if (!snapshot) {
    return;
  }

  const position =
    Number(
      snapshot.position ||
      0
    );

  const buttons =
    $$(
      "[data-driver-action]"
    );

  buttons.forEach(
    button => {
      button.disabled =
        true;

      button.classList.remove(
        "is-current"
      );
    }
  );


  const enable =
    action => {
      const button =
        $(
          `[data-driver-action="${action}"]`
        );

      if (!button) {
        return;
      }

      button.disabled =
        false;

      button.classList.add(
        "is-current"
      );
    };


  C12.state.tripStarted =
    position >= 34;

  C12.state.arrivedLoading =
    position >= 39;

  C12.state.cargoLoaded =
    position >= 45;

  C12.state.inTransit =
    position >= 48;

  C12.state.delayReported =
    position >= 65 &&
    position < 92;

  C12.state.delivered =
    position >= 92;


  if (
    position <
    24
  ) {
    C12.state.driverStep =
      0;

    return;
  }


  if (
    position <
    34
  ) {
    C12.state.driverStep =
      0;

    enable(
      "start"
    );

    return;
  }


  if (
    position <
    39
  ) {
    C12.state.driverStep =
      1;

    enable(
      "arrived"
    );

    return;
  }


  if (
    position <
    45
  ) {
    C12.state.driverStep =
      2;

    enable(
      "loaded"
    );

    return;
  }


  if (
    position <
    48
  ) {
    C12.state.driverStep =
      3;

    enable(
      "transit"
    );

    return;
  }


  if (
    position <
    65
  ) {
    C12.state.driverStep =
      4;

    enable(
      "delay"
    );

    enable(
      "delivered"
    );

    return;
  }


  if (
    position <
    92
  ) {
    C12.state.driverStep =
      4;

    if (
      position >= 78
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


  C12.state.driverStep =
    5;
}

function updateDriverDocuments(
  snapshot
) {
  if (!snapshot) {
    return;
  }

  const position =
    Number(
      snapshot.position ||
      0
    );

  const upload =
    $(
      "[data-upload-cmr]"
    );

  if (!upload) {
    return;
  }


  if (
    position <
    48
  ) {
    upload.disabled =
      true;

    upload.innerHTML = `
      <span>＋</span>
      <strong>
        CMR / POD ще недоступний
      </strong>
      <small>
        Документ можна додати після початку рейсу
      </small>
    `;

    return;
  }


  if (
    position <
    92
  ) {
    upload.disabled =
      false;

    upload.innerHTML = `
      <span>＋</span>
      <strong>
        Додати CMR / POD
      </strong>
      <small>
        Фото або PDF
      </small>
    `;

    return;
  }


  upload.disabled =
    true;

  upload.innerHTML = `
    <span>✓</span>
    <strong>
      CMR / POD додано
    </strong>
    <small>
      Документ прив'язано до рейсу
    </small>
  `;
}


function updateDriverCabin(
  snapshot
) {
  if (!snapshot) {
    return;
  }

  const position =
    Number(
      snapshot.position ||
      0
    );

  const trip =
    $(
      ".c12-driver-trip"
    );

  if (!trip) {
    return;
  }


  trip.classList.remove(
    "is-assigned",
    "is-started",
    "is-loading",
    "is-transit",
    "is-delayed",
    "is-delivered"
  );


  if (
    position <
    34
  ) {
    trip.classList.add(
      "is-assigned"
    );

    return;
  }


  if (
    position <
    45
  ) {
    trip.classList.add(
      "is-started"
    );

    return;
  }


  if (
    position <
    48
  ) {
    trip.classList.add(
      "is-loading"
    );

    return;
  }


  if (
    position <
    65
  ) {
    trip.classList.add(
      "is-transit"
    );

    return;
  }


  if (
    position <
    78
  ) {
    trip.classList.add(
      "is-delayed"
    );

    return;
  }


  if (
    position <
    92
  ) {
    trip.classList.add(
      "is-transit"
    );

    return;
  }


  trip.classList.add(
    "is-delivered"
  );
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
    snapshot.position >=
      24 &&
    C12.state
      .mainOrderAssigned;

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

  if (!hint) {
    return;
  }

  if (!assigned) {
    hint.textContent =
      "Перетягніть на автомобіль →";

    return;
  }

  if (
    C12.mainOrder.execution ===
    "carrier"
  ) {
    hint.textContent =
      `✓ ${C12.mainOrder.carrier} · ${C12.mainOrder.vehicle}`;

    return;
  }

  hint.textContent =
    `✓ DAF XF · ${C12.mainOrder.vehicle} призначено`;
}


  /* ============================================================
     VEHICLE CARDS
  ============================================================ */

  function updateVehicleCards(
  snapshot
) {
  const card =
    $(
      '[data-vehicle="BC4587KA"]'
    );

  if (!card) {
    return;
  }

  const ownAssignment =
    C12.mainOrder.execution ===
      "own" &&
    String(
      C12.mainOrder.vehicle ||
      ""
    )
      .replace(
        /\s+/g,
        ""
      ) ===
      "BC4587KA" &&
    snapshot.position >=
      24 &&
    snapshot.position <
      92;

  card.classList.toggle(
    "is-assigned",
    ownAssignment
  );

  const badge =
    $(
      ".c12-vehicle-card__status",
      card
    );

  if (!badge) {
    return;
  }

  if (!ownAssignment) {
    const vehicle =
      C12.data.getVehicle(
        "BC4587KA"
      );

    badge.textContent =
      vehicle?.status ===
      "reserved"
        ? "ЗАРЕЗЕРВОВАНО"
        : vehicle?.status ===
          "transit"
          ? "У РЕЙСІ"
          : "ВІЛЬНИЙ";

    return;
  }

  if (
    snapshot.position <
    48
  ) {
    badge.textContent =
      "ЗАРЕЗЕРВОВАНО";
  }

  else {
    badge.textContent =
      "У РЕЙСІ";
  }
}

  function updateDriverResource() {
  const order =
    C12.mainOrder;

  if (
    !order ||
    !order.driver
  ) {
    return;
  }

  const headerName =
    $(
      ".c12-driver-app__header strong"
    );

  const avatar =
    $(
      ".c12-driver-avatar"
    );

  const trip =
    $(
      ".c12-driver-trip"
    );

  const firstName =
    String(
      order.driver
    )
      .trim()
      .split(/\s+/)[0];

  if (headerName) {
    headerName.textContent =
      firstName;
  }

  if (avatar) {
    avatar.textContent =
      String(
        order.driver
      )
        .trim()
        .split(/\s+/)
        .slice(
          0,
          2
        )
        .map(
          part =>
            part.charAt(0)
              .toUpperCase()
        )
        .join("");
  }

  if (!trip) {
    return;
  }

  let resource =
    $(
      ".c12-driver-resource",
      trip
    );

  if (!resource) {
    resource =
      document.createElement(
        "div"
      );

    resource.className =
      "c12-driver-resource";

    const route =
      $(
        ".c12-driver-route",
        trip
      );

    trip.insertBefore(
      resource,
      route
    );
  }

  if (
    order.execution ===
    "carrier" &&
    order.externalResource
  ) {
    const item =
      order.externalResource;

    resource.innerHTML = `
      <small>
        ЗАЛУЧЕНИЙ ПЕРЕВІЗНИК
      </small>

      <strong>
        ${escapeHtml(
          item.carrierName
        )}
      </strong>

      <span>
        ${escapeHtml(
          `${item.brand} ${item.model} · ${item.displayPlate}`
        )}
      </span>
    `;

    return;
  }

  const ownVehicle =
    C12.data.getVehicle(
      order.vehicle
    );

  resource.innerHTML = `
    <small>
      ВЛАСНИЙ АВТОПАРК
    </small>

    <strong>
      ${escapeHtml(
        ownVehicle
          ? `${ownVehicle.brand} ${ownVehicle.model}`
          : "Автомобіль"
      )}
    </strong>

    <span>
      ${escapeHtml(
        order.vehicle ||
        ""
      )}
    </span>
  `;
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

  updateDriverDocuments(
    snapshot
  );

  updateDriverCabin(
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

  updateDriverResource();

  renderCarriers();

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

    $(
  "[data-return-dispatcher]"
)?.addEventListener(
  "click",
  () => {
    closeOrdersModal();

    openWorkspace(
      "dispatcher"
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
    
        openWorkspace(
          "dispatcher"
        );
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

  function getRoleByTimePosition(
  position
) {
  const value =
    Number(position);

  if (value < 24) {
    return "dispatcher";
  }

  if (value < 39) {
    return "manager";
  }

  if (value < 92) {
    return "driver";
  }

  if (value < 100) {
    return "customer";
  }

  return "owner";
}


function jumpToTimeScene(
  position
) {
  const ripple =
    $(
      "[data-event-ripple]"
    );

  const workspace =
    $(
      "[data-workspace]"
    );

  const strip =
    $(
      "[data-global-order-strip]"
    );

  if (ripple) {
    ripple.hidden =
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

  const role =
    getRoleByTimePosition(
      position
    );

  showRole(
    role,
    {
      scroll: true
    }
  );
}


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

  slider.addEventListener(
    "change",
    () => {
      jumpToTimeScene(
        Number(
          slider.value
        )
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
    if (
      event.detail
        ?.source ===
      "time-slider"
    ) {
      return;
    }

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
            if (
              event.detail
                ?.source ===
              "manual-delivery"
            ) {
              break;
            }
          
            addAutomationBatch(
              C12.automationTemplates
                .delayReported
            );
          
            window.setTimeout(
              () => {
                if (
                  C12.state.delivered
                ) {
                  return;
                }
          
                showEventRipple();
              },
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

(function () {
  "use strict";

  const C12 =
    window.C12 =
    window.C12 || {};

  if (
    !C12.i18n ||
    !C12.data ||
    !C12.ui
  ) {
    return;
  }


  const $ = (
    selector,
    root = document
  ) =>
    root.querySelector(
      selector
    );


  const $$ = (
    selector,
    root = document
  ) =>
    Array.from(
      root.querySelectorAll(
        selector
      )
    );


  const escapeHtml =
    value =>
      String(
        value ??
        ""
      )
        .replace(
          /&/g,
          "&amp;"
        )
        .replace(
          /</g,
          "&lt;"
        )
        .replace(
          />/g,
          "&gt;"
        )
        .replace(
          /"/g,
          "&quot;"
        )
        .replace(
          /'/g,
          "&#039;"
        );


  const lang = () =>
    C12.i18n.current ||
    "uk";


  const locale = () =>
    C12.i18n.getLocale
      ? C12.i18n.getLocale()
      : "uk-UA";


  const t = (
    uk,
    ru,
    en
  ) => {
    if (
      lang() ===
      "ru"
    ) {
      return ru;
    }

    if (
      lang() ===
      "en"
    ) {
      return en;
    }

    return uk;
  };


  const setText = (
    selector,
    value,
    root = document
  ) => {
    const element =
      $(
        selector,
        root
      );

    if (element) {
      element.textContent =
        value ?? "";
    }

    return element;
  };


  function formatNumber(
    value
  ) {
    return Number(
      value ||
      0
    ).toLocaleString(
      locale()
    );
  }


  function formatMoney(
    value,
    currency = "€"
  ) {
    return (
      currency +
      Number(
        value ||
        0
      ).toLocaleString(
        locale()
      )
    );
  }


  function formatDateShort(
    value
  ) {
    if (!value) {
      return "—";
    }

    const date =
      new Date(
        value
      );

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "—";
    }

    if (
      lang() ===
      "en"
    ) {
      return new Intl
        .DateTimeFormat(
          "en-US",
          {
            month:
              "short",

            day:
              "numeric",

            hour:
              "numeric",

            minute:
              "2-digit",

            hour12:
              true
          }
        )
        .format(
          date
        );
    }

    const pad =
      number =>
        String(
          number
        )
          .padStart(
            2,
            "0"
          );

    return (
      `${pad(
        date.getDate()
      )}.` +
      `${pad(
        date.getMonth() +
        1
      )} · ` +
      `${pad(
        date.getHours()
      )}:` +
      `${pad(
        date.getMinutes()
      )}`
    );
  }


  function localizeDateLabel(
    value
  ) {
    if (
      !value ||
      lang() !==
      "en"
    ) {
      return value;
    }

    const match =
      String(
        value
      ).match(
        /^(\d{1,2})\s+(серпня)\s+·\s+(\d{2}:\d{2})$/i
      );

    if (!match) {
      return value;
    }

    return (
      `Aug ${Number(
        match[1]
      )} · ${match[3]}`
    );
  }


  function statusClass(
    status
  ) {
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
      map[
        status
      ] ||
      ""
    );
  }


  function statusBadge(
    status
  ) {
    return `
      <span
        class="
          c12-table-status
          ${statusClass(
            status
          )}
        "
      >
        ${escapeHtml(
          C12.data
            .displayStatus(
              status
            )
        )}
      </span>
    `;
  }


  function localizeIncomingText(
    text
  ) {
    const dictionary = {
      "18 палет · тент": {
        ru:
          "18 палет · тент",

        en:
          "18 pallets · curtainside"
      },

      "Рефрижератор · 8 200 кг": {
        ru:
          "Рефрижератор · 8 200 кг",

        en:
          "Reefer · 8,200 kg"
      },

      "Тент · 20 палет": {
        ru:
          "Тент · 20 палет",

        en:
          "Curtainside · 20 pallets"
      },

      "Будматеріали · 11 400 кг": {
        ru:
          "Стройматериалы · 11 400 кг",

        en:
          "Building materials · 11,400 kg"
      },

      "Рефрижератор · 16 палет": {
        ru:
          "Рефрижератор · 16 палет",

        en:
          "Reefer · 16 pallets"
      },

      "Тент · 9 600 кг": {
        ru:
          "Тент · 9 600 кг",

        en:
          "Curtainside · 9,600 kg"
      },

      "Скло · 14 300 кг": {
        ru:
          "Стекло · 14 300 кг",

        en:
          "Glass · 14,300 kg"
      },

      "Збірний вантаж": {
        ru:
          "Сборный груз",

        en:
          "LTL freight"
      },

      "Меблі · 14 палет": {
        ru:
          "Мебель · 14 палет",

        en:
          "Furniture · 14 pallets"
      },

      "21 палета · тент": {
        ru:
          "21 палета · тент",

        en:
          "21 pallets · curtainside"
      }
    };

    return (
      dictionary[
        text
      ]?.[
        lang()
      ] ||
      text
    );
  }


  function getInboxSourceCaption(
    source,
    count
  ) {
    if (
      lang() ===
      "en"
    ) {
      if (
        source ===
        "email"
      ) {
        return (
          count ===
          1
            ? "1 new request"
            : `${count} new requests`
        );
      }

      if (
        source ===
        "phone"
      ) {
        return (
          count ===
          1
            ? "1 call"
            : `${count} calls`
        );
      }

      if (
        source ===
        "messenger"
      ) {
        return (
          count ===
          1
            ? "1 conversation"
            : `${count} conversations`
        );
      }

      if (
        source ===
        "exchange"
      ) {
        return (
          count ===
          1
            ? "1 opportunity"
            : `${count} opportunities`
        );
      }
    }


    if (
      lang() ===
      "ru"
    ) {
      if (
        source ===
        "email"
      ) {
        return (
          count ===
          1
            ? "1 новая заявка"
            : `${count} новых заявки`
        );
      }

      if (
        source ===
        "phone"
      ) {
        return (
          count ===
          1
            ? "1 обращение"
            : `${count} обращения`
        );
      }

      if (
        source ===
        "messenger"
      ) {
        return (
          count ===
          1
            ? "1 обращение"
            : `${count} обращения`
        );
      }

      if (
        source ===
        "exchange"
      ) {
        return (
          count ===
          1
            ? "1 потенциальная"
            : `${count} потенциальных`
        );
      }
    }


    if (
      source ===
      "email"
    ) {
      return count ===
        1
        ? "1 нова заявка"
        : `${count} нові заявки`;
    }

    if (
      source ===
      "phone"
    ) {
      return count ===
        1
        ? "1 звернення"
        : `${count} звернення`;
    }

    if (
      source ===
      "messenger"
    ) {
      return count ===
        1
        ? "1 звернення"
        : `${count} звернення`;
    }

    if (
      source ===
      "exchange"
    ) {
      return count ===
        1
        ? "1 потенційне"
        : `${count} потенційних`;
    }

    return String(
      count
    );
  }


  function getInboxChannelTitle(
    source,
    count
  ) {
    if (
      lang() ===
      "en"
    ) {
      if (
        source ===
        "email"
      ) {
        return `${count} new requests`;
      }

      if (
        source ===
        "phone"
      ) {
        return `${count} phone calls`;
      }

      if (
        source ===
        "messenger"
      ) {
        return `${count} conversations`;
      }

      if (
        source ===
        "exchange"
      ) {
        return `${count} freight opportunities`;
      }

      return `${count} requests`;
    }


    if (
      lang() ===
      "ru"
    ) {
      if (
        source ===
        "email"
      ) {
        return `${count} новых заявки`;
      }

      if (
        source ===
        "phone"
      ) {
        return `${count} телефонных обращения`;
      }

      if (
        source ===
        "messenger"
      ) {
        return `${count} новых диалога`;
      }

      if (
        source ===
        "exchange"
      ) {
        return `${count} предложений`;
      }

      return `${count} обращений`;
    }


    if (
      source ===
      "email"
    ) {
      return `${count} нові заявки`;
    }

    if (
      source ===
      "phone"
    ) {
      return `${count} телефонні звернення`;
    }

    if (
      source ===
      "messenger"
    ) {
      return `${count} нові діалоги`;
    }

    if (
      source ===
      "exchange"
    ) {
      return `${count} пропозицій`;
    }

    return `${count} звернень`;
  }


  function getSelectedRequestHeading(
    request
  ) {
    if (
      !request
    ) {
      return t(
        "Запит на перевезення",
        "Запрос на перевозку",
        "Shipment request"
      );
    }

    if (
      request.source ===
      "phone"
    ) {
      return t(
        "Телефонне звернення",
        "Телефонное обращение",
        "Phone request"
      );
    }

    if (
      request.source ===
      "messenger"
    ) {
      return t(
        "Діалог з клієнтом",
        "Диалог с клиентом",
        "Customer conversation"
      );
    }

    if (
      request.source ===
      "exchange"
    ) {
      return t(
        "Заявка з транспортної біржі",
        "Заявка с транспортной биржи",
        "Freight exchange opportunity"
      );
    }

    return t(
      "Запит на перевезення",
      "Запрос на перевозку",
      "Shipment request"
    );
  }


  function renderOrdersTableLocalized() {
    const tbody =
      $(
        "[data-orders-table]"
      );

    if (!tbody) {
      return;
    }

    let orders =
      C12.data
        .getFeaturedOrders();

    if (
      C12.uiState
        ?.registerFilter ===
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


    tbody.innerHTML =
      orders
        .map(
          rawOrder => {
            const order =
              C12.data
                .displayOrder(
                  rawOrder
                );

            const isMain =
              rawOrder.id ===
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
                    rawOrder.attention
                      ? "is-warning"
                      : ""
                  }
                "
                data-order-row="${escapeHtml(
                  rawOrder.id
                )}"
              >

                <td>
                  <strong>
                    ${escapeHtml(
                      rawOrder.id
                    )}
                  </strong>
                </td>

                <td>
                  ${escapeHtml(
                    order.routeDisplay
                  )}
                </td>

                <td>
                  ${escapeHtml(
                    rawOrder.client
                  )}
                </td>

                <td>
                  ${escapeHtml(
                    formatDateShort(
                      rawOrder.pickupAt
                    )
                  )}
                </td>

                <td>
                  ${escapeHtml(
                    rawOrder.vehicle ||
                    "—"
                  )}
                </td>

                <td>
                  ${statusBadge(
                    rawOrder.status
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


  function renderAllOrdersTableLocalized() {
    const tbody =
      $(
        "[data-all-orders-table]"
      );

    if (!tbody) {
      return;
    }


    const orders =
      C12.data
        .filterOrders({
          query:
            C12.uiState
              ?.modalQuery ||
            "",

          status:
            C12.uiState
              ?.modalStatusFilter ||
            "all",

          execution:
            C12.uiState
              ?.modalExecutionFilter ||
            "all"
        });


    tbody.innerHTML =
      orders
        .map(
          rawOrder => {
            const order =
              C12.data
                .displayOrder(
                  rawOrder
                );

            return `
              <tr
                class="
                  ${
                    rawOrder.id ===
                    C12.mainOrder.id
                      ? "is-main-order"
                      : ""
                  }

                  ${
                    rawOrder.attention
                      ? "is-warning"
                      : ""
                  }
                "
              >

                <td>
                  <strong>
                    ${escapeHtml(
                      rawOrder.id
                    )}
                  </strong>
                </td>

                <td>
                  ${escapeHtml(
                    formatDateShort(
                      rawOrder.createdAt
                    )
                  )}
                </td>

                <td>
                  ${escapeHtml(
                    rawOrder.client
                  )}
                </td>

                <td>
                  ${escapeHtml(
                    order.routeDisplay
                  )}
                </td>

                <td>
                  ${escapeHtml(
                    order.cargoDisplay
                  )}
                  ·
                  ${escapeHtml(
                    C12.data
                      .formatWeight(
                        rawOrder.weightKg
                      )
                  )}
                </td>

                <td>
                  ${escapeHtml(
                    formatDateShort(
                      rawOrder.pickupAt
                    )
                  )}
                </td>

                <td>
                  ${escapeHtml(
                    formatDateShort(
                      rawOrder.deliveryAt
                    )
                  )}
                </td>

                <td>
                  ${escapeHtml(
                    order.executionLabelDisplay
                  )}
                </td>

                <td>
                  ${escapeHtml(
                    rawOrder.vehicle ||
                    "—"
                  )}
                </td>

                <td>
                  ${escapeHtml(
                    rawOrder.driver ||
                    "—"
                  )}
                </td>

                <td>
                  ${statusBadge(
                    rawOrder.status
                  )}
                </td>

                <td>
                  ${
                    rawOrder.revenue
                      ? `
                        <strong>
                          ${formatMoney(
                            rawOrder.margin
                          )}
                        </strong>
                      `
                      : "—"
                  }
                </td>

              </tr>
            `;
          }
        )
        .join("");


    setText(
      "[data-modal-orders-summary]",
      t(
        `${orders.length} замовлень`,
        `${orders.length} заказов`,
        `${orders.length} orders`
      )
    );
  }


  function renderIncomingStreamLocalized() {
    const container =
      $(
        "[data-incoming-stream]"
      );

    if (!container) {
      return;
    }


    const items =
      C12.incomingRequests
        .slice(
          0,
          6
        );


    container.innerHTML =
      items
        .map(
          item => {
            const parts =
              String(
                item.route ||
                ""
              )
                .split(
                  "→"
                )
                .map(
                  part =>
                    part.trim()
                );

            const route =
              parts.length ===
              2
                ? C12.data
                    .displayRoute(
                      parts[0],
                      parts[1]
                    )
                : item.route;


            return `
              <div class="c12-stream-item">

                <div class="c12-stream-item__top">

                  <span>
                    ${escapeHtml(
                      C12.data
                        .displaySource(
                          item.sourceLabel
                        )
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
                    item.client ===
                    "Новий запит"
                      ? t(
                          "Новий запит",
                          "Новый запрос",
                          "New Request"
                        )
                      : item.client
                  )}
                </strong>

                <span>
                  ${escapeHtml(
                    route
                  )}
                </span>

                <small>
                  ${escapeHtml(
                    localizeIncomingText(
                      item.text
                    )
                  )}
                </small>

              </div>
            `;
          }
        )
        .join("");
  }


  function renderInboxCountsLocalized() {
    if (
      typeof C12.getInboxCounts !==
      "function"
    ) {
      return;
    }

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
          counts[
            source
          ]
        );

        setText(
          `[data-source-caption="${source}"]`,
          getInboxSourceCaption(
            source,
            counts[
              source
            ]
          )
        );
      }
    );
  }


  function renderInboxListLocalized(
    source =
      C12.uiState
        ?.inboxSource ||
      "email"
  ) {
    const container =
      $(
        "[data-inbox-list]"
      );

    if (!container) {
      return;
    }


    const config =
      C12.inboxSourceConfig?.[
        source
      ];


    const requests =
      C12.getInboxRequests(
        source
      );


    setText(
      "[data-inbox-channel-label]",
      C12.data
        .displaySource(
          config?.label ||
          source
        )
        .toUpperCase()
    );


    setText(
      "[data-inbox-channel-title]",
      getInboxChannelTitle(
        source,
        requests.length
      )
    );


    if (
      !requests.length
    ) {
      container.innerHTML = `
        <div class="c12-inbox-empty">
          ${escapeHtml(
            t(
              config?.empty ||
                "Нових звернень немає",

              source === "email"
                ? "Новых писем нет"
                : source === "phone"
                  ? "Новых телефонных обращений нет"
                  : source === "messenger"
                    ? "Новых сообщений нет"
                    : "Новых предложений нет",

              source === "email"
                ? "No new email requests"
                : source === "phone"
                  ? "No new calls"
                  : source === "messenger"
                    ? "No new messages"
                    : "No new freight opportunities"
            )
          )}
        </div>
      `;

      return;
    }


    container.innerHTML =
      requests
        .map(
          rawRequest => {
            const request =
              C12.data
                .displayRequest(
                  rawRequest
                );

            const selected =
              rawRequest.id ===
              C12.uiState
                ?.selectedInboxRequestId;


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
                  rawRequest.id
                )}"
              >

                <div class="c12-inbox-item__top">

                  <span class="c12-inbox-item__source">
                    ${escapeHtml(
                      C12.data
                        .displaySource(
                          rawRequest.sourceLabel
                        )
                    )}
                  </span>

                  <span class="c12-inbox-item__time">
                    ${escapeHtml(
                      rawRequest.time
                    )}
                  </span>

                </div>

                <strong>
                  ${escapeHtml(
                    rawRequest.client
                  )}
                </strong>

                <span class="c12-inbox-item__route">
                  ${escapeHtml(
                    request.routeDisplay
                  )}
                </span>

                <span class="c12-inbox-item__preview">
                  ${escapeHtml(
                    request.previewDisplay
                  )}
                </span>

                ${
                  rawRequest.rate
                    ? `
                      <span class="c12-inbox-item__rate">
                        ${escapeHtml(
                          rawRequest.rate
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


  function renderSelectedInboxRequestLocalized(
    requestId =
      C12.uiState
        ?.selectedInboxRequestId
  ) {
    const rawRequest =
      C12.getInboxRequest(
        requestId
      );

    if (!rawRequest) {
      return;
    }


    const request =
      C12.data
        .displayRequest(
          rawRequest
        );


    setText(
      "[data-selected-request-channel]",
      `${
        C12.data
          .displaySource(
            rawRequest.sourceLabel
          )
          .toUpperCase()
      } · ${rawRequest.time}`
    );


    setText(
      "[data-selected-request-heading]",
      getSelectedRequestHeading(
        rawRequest
      )
    );


    setText(
      "[data-selected-request-client-label]",
      rawRequest.source ===
      "email"
        ? t(
            "ВІД",
            "ОТ",
            "FROM"
          )
        : t(
            "КЛІЄНТ",
            "КЛИЕНТ",
            "CUSTOMER"
          )
    );


    setText(
      "[data-selected-request-client]",
      rawRequest.client
    );


    setText(
      "[data-selected-request-contact-label]",
      rawRequest.source ===
      "exchange"
        ? t(
            "КОНТАКТ / БІРЖА",
            "КОНТАКТ / БИРЖА",
            "CONTACT / EXCHANGE"
          )
        : t(
            "КОНТАКТ",
            "КОНТАКТ",
            "CONTACT"
          )
    );


    setText(
      "[data-selected-request-contact]",
      rawRequest.contact
    );


    setText(
      "[data-selected-request-subject]",
      request.titleDisplay
    );


    setText(
      "[data-selected-request-pickup]",
      rawRequest.pickup
    );


    setText(
      "[data-selected-request-delivery]",
      rawRequest.delivery
    );


    setText(
      "[data-selected-request-cargo]",
      [
        request.cargoDisplay,

        rawRequest.pallets
          ? C12.data
              .formatPallets(
                rawRequest.pallets
              )
          : ""
      ]
        .filter(
          Boolean
        )
        .join(
          " · "
        )
    );


    setText(
      "[data-selected-request-weight]",
      C12.data
        .formatWeight(
          rawRequest.weightKg
        )
    );


    setText(
      "[data-selected-request-vehicle]",
      request.vehicleTypeDisplay
    );


    const rateRow =
      $(
        "[data-selected-request-rate-row]"
      );

    if (rateRow) {
      rateRow.hidden =
        !rawRequest.rate;
    }


    setText(
      "[data-selected-request-rate]",
      rawRequest.rate ||
      "—"
    );


    const sourceConfig =
      C12.inboxSourceConfig?.[
        rawRequest.source
      ];


    setText(
      "[data-selected-request-source-icon]",
      sourceConfig?.icon ||
      "•"
    );


    setText(
      "[data-selected-request-source-name]",
      C12.data
        .displaySource(
          rawRequest.sourceLabel
        )
    );


    setText(
      "[data-selected-request-contact-line]",
      rawRequest.contactLine ||
      ""
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
        request.chatDisplay
      ) &&
      request.chatDisplay.length
    ) {
      if (
        message
      ) {
        message.hidden =
          true;

        message.innerHTML =
          "";
      }

      if (
        chat
      ) {
        chat.hidden =
          false;

        chat.innerHTML =
          request.chatDisplay
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
      if (
        chat
      ) {
        chat.hidden =
          true;

        chat.innerHTML =
          "";
      }

      if (
        message
      ) {
        message.hidden =
          false;

        message.innerHTML =
          request.messageDisplay
            ? `
              <p>
                ${escapeHtml(
                  request.messageDisplay
                )}
              </p>
            `
            : "";
      }
    }


    setText(
      "[data-create-request-label]",
      t(
        "Створити замовлення",
        "Создать заказ",
        "Create order"
      )
    );
  }


  function renderPlanningQueueLocalized() {
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
          rawOrder => {
            const order =
              C12.data
                .displayOrder(
                  rawOrder
                );

            return `
              <div class="c12-mini-order">

                <div>
                  <strong>
                    ${escapeHtml(
                      rawOrder.id
                    )}
                  </strong>

                  <span>
                    ${escapeHtml(
                      order.routeDisplay
                    )}
                  </span>
                </div>

                <div>
                  <span>
                    ${escapeHtml(
                      C12.data
                        .formatWeight(
                          rawOrder.weightKg
                        )
                    )}
                  </span>

                  <small>
                    ${escapeHtml(
                      order.vehicleTypeLabelDisplay
                    )}
                  </small>
                </div>

              </div>
            `;
          }
        )
        .join("");


    setText(
      "[data-waiting-assignment-count]",
      C12.data
        .getPlanningOrders()
        .length
    );
  }


  function renderCarriersLocalized() {
    const container =
      $(
        "[data-carriers-list]"
      );

    if (!container) {
      return;
    }


    const selectedCarrier =
      C12.mainOrder.execution ===
      "carrier"
        ? C12.mainOrder.carrier
        : null;


    container.innerHTML =
      C12.carriers
        .map(
          carrier => {
            const offer =
              carrier.offer;

            const selected =
              selectedCarrier ===
              carrier.name;


            return `
              <button
                class="
                  c12-carrier-card
                  ${
                    selected
                      ? "is-selected"
                      : ""
                  }
                "
                type="button"
                data-carrier="${escapeHtml(
                  carrier.name
                )}"
                aria-pressed="${
                  selected
                    ? "true"
                    : "false"
                }"
              >

                <div class="c12-carrier-card__top">

                  <strong>
                    ${escapeHtml(
                      carrier.name
                    )}
                  </strong>

                  <span>
                    ★ ${carrier.rating}
                  </span>

                </div>

                <div class="c12-carrier-card__country">
                  ${escapeHtml(
                    C12.data
                      .displayCountry(
                        carrier.country
                      )
                  )}
                </div>

                <div class="c12-carrier-card__meta">

                  <span>
                    ${
                      lang() ===
                      "en"
                        ? `${carrier.available} trucks available`
                        : lang() ===
                          "ru"
                          ? `${carrier.available} авто свободно`
                          : `${carrier.available} авто вільно`
                    }
                  </span>

                  <span>
                    ${escapeHtml(
                      carrier.types
                        .map(
                          type =>
                            C12.data
                              .displayVehicleType(
                                type
                              )
                        )
                        .join(
                          " · "
                        )
                    )}
                  </span>

                </div>

                ${
                  selected &&
                  offer
                    ? `
                      <div class="c12-carrier-offer">

                        <span class="c12-carrier-offer__label">
                          ${t(
                            "ПІДІБРАНО ПІД ЦЕЙ РЕЙС",
                            "ПОДОБРАНО ПОД ЭТОТ РЕЙС",
                            "MATCHED TO THIS SHIPMENT"
                          )}
                        </span>

                        <div class="c12-carrier-offer__vehicle">

                          <div class="c12-carrier-truck">
                            <span></span>
                            <i></i>
                            <b></b>
                          </div>

                          <div>
                            <strong>
                              ${escapeHtml(
                                `${offer.brand} ${offer.model}`
                              )}
                            </strong>

                            <span>
                              ${escapeHtml(
                                offer.displayPlate
                              )}
                            </span>
                          </div>

                        </div>

                        <dl>

                          <div>
                            <dt>
                              ${t(
                                "Кузов",
                                "Кузов",
                                "Equipment"
                              )}
                            </dt>

                            <dd>
                              ${escapeHtml(
                                C12.data
                                  .displayVehicleType(
                                    offer.typeLabel
                                  )
                              )}
                            </dd>
                          </div>

                          <div>
                            <dt>
                              ${t(
                                "Вантажність",
                                "Грузоподъёмность",
                                "Payload"
                              )}
                            </dt>

                            <dd>
                              ${escapeHtml(
                                C12.data
                                  .formatWeight(
                                    offer.capacityKg
                                  )
                              )}
                            </dd>
                          </div>

                          <div>
                            <dt>
                              ${t(
                                "Палетомісця",
                                "Палетоместа",
                                "Pallet capacity"
                              )}
                            </dt>

                            <dd>
                              ${offer.pallets}
                            </dd>
                          </div>

                          <div>
                            <dt>
                              ${t(
                                "Водій",
                                "Водитель",
                                "Driver"
                              )}
                            </dt>

                            <dd>
                              ${escapeHtml(
                                offer.driver
                              )}
                            </dd>
                          </div>

                          <div>
                            <dt>
                              ${t(
                                "Телефон",
                                "Телефон",
                                "Phone"
                              )}
                            </dt>

                            <dd>
                              ${escapeHtml(
                                offer.driverPhone
                              )}
                            </dd>
                          </div>

                          <div>
                            <dt>
                              ${t(
                                "Локація",
                                "Местоположение",
                                "Location"
                              )}
                            </dt>

                            <dd>
                              ${escapeHtml(
                                C12.data
                                  .displayCity(
                                    offer.location
                                  )
                              )}
                            </dd>
                          </div>

                          <div>
                            <dt>
                              ${t(
                                "Подача",
                                "Подача",
                                "Ready"
                              )}
                            </dt>

                            <dd>
                              ${escapeHtml(
                                formatDateShort(
                                  offer.readyAt
                                )
                              )}
                            </dd>
                          </div>

                          <div>
                            <dt>
                              ${t(
                                "Ставка",
                                "Ставка",
                                "Rate"
                              )}
                            </dt>

                            <dd>
                              €${formatNumber(
                                offer.rate
                              )}
                            </dd>
                          </div>

                        </dl>

                        <div class="c12-carrier-offer__confirmed">
                          ${t(
                            "✓ ПРИЗНАЧЕНО",
                            "✓ НАЗНАЧЕНО",
                            "✓ ASSIGNED"
                          )}
                        </div>

                      </div>
                    `
                    : ""
                }

              </button>
            `;
          }
        )
        .join("");
  }


  function renderAttentionListLocalized() {
    const container =
      $(
        "[data-attention-list]"
      );

    if (!container) {
      return;
    }


    const issueTranslations = {
      "ETA зміщено на 2 год": {
        ru:
          "ETA сдвинут на 2 часа",

        en:
          "ETA pushed back by 2 hours"
      },

      "Очікування документа CMR": {
        ru:
          "Ожидание документа CMR",

        en:
          "Waiting for CMR document"
      },

      "Ризик запізнення на завантаження": {
        ru:
          "Риск опоздания на погрузку",

        en:
          "Risk of late pickup"
      }
    };


    container.innerHTML =
      C12.attentionOrders
        .map(
          item => {
            const routeParts =
              String(
                item.route
              )
                .split(
                  "→"
                )
                .map(
                  value =>
                    value.trim()
                );

            const route =
              routeParts.length ===
              2
                ? C12.data
                    .displayRoute(
                      routeParts[0],
                      routeParts[1]
                    )
                : item.route;


            return `
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
                      route
                    )}
                  </span>

                  <small>
                    ${escapeHtml(
                      issueTranslations[
                        item.issue
                      ]?.[
                        lang()
                      ] ||
                      item.issue
                    )}
                  </small>

                </span>

                <span class="c12-attention-item__arrow">
                  →
                </span>

              </button>
            `;
          }
        )
        .join("");
  }


  function renderCustomerMessagesLocalized(
    messages =
      []
  ) {
    const container =
      $(
        "[data-customer-messages]"
      );

    if (!container) {
      return;
    }


    if (
      !messages.length
    ) {
      container.innerHTML = `
        <div class="c12-message-empty">
          ${t(
            "Поки що повідомлень немає.",
            "Пока сообщений нет.",
            "No updates yet."
          )}
        </div>
      `;

      return;
    }


    const messageMap = {
      "Заявку отримано": {
        ru:
          "Заявка получена",

        en:
          "Request received"
      },

      "Перевезення підтверджено": {
        ru:
          "Перевозка подтверждена",

        en:
          "Shipment confirmed"
      },

      "Вантаж у дорозі": {
        ru:
          "Груз в пути",

        en:
          "Shipment in transit"
      },

      "Оновлення часу доставки": {
        ru:
          "Обновление времени доставки",

        en:
          "Delivery time update"
      },

      "Вантаж доставлено": {
        ru:
          "Груз доставлен",

        en:
          "Shipment delivered"
      },

      "Ваш запит на перевезення Львів → Краків отримано.": {
        ru:
          "Ваш запрос на перевозку Львов → Краков получен.",

        en:
          "Your Lviv → Krakow shipment request has been received."
      },

      "Автомобіль призначено. Планова доставка — 28.08 до 14:00.": {
        ru:
          "Автомобиль назначен. Плановая доставка — 28.08 до 14:00.",

        en:
          "Truck assigned. Scheduled delivery is Aug 28 by 2:00 PM."
      },

      "Вантаж забрано у Львові та направлено до Кракова.": {
        ru:
          "Груз забран во Львове и направлен в Краков.",

        en:
          "Freight picked up in Lviv and is now moving toward Krakow."
      },

      "Нове очікуване прибуття — 28.08 о 16:00.": {
        ru:
          "Новое ожидаемое прибытие — 28.08 в 16:00.",

        en:
          "Updated ETA: Aug 28 at 4:00 PM."
      },

      "Доставку завершено. CMR / POD доступний у картці перевезення.": {
        ru:
          "Доставка завершена. CMR / POD доступен в карточке перевозки.",

        en:
          "Delivery completed. CMR / POD is available in the shipment record."
      }
    };


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
                  messageMap[
                    message.title
                  ]?.[
                    lang()
                  ] ||
                  message.title
                )}
              </strong>

              <p>
                ${escapeHtml(
                  messageMap[
                    message.text
                  ]?.[
                    lang()
                  ] ||
                  message.text
                )}
              </p>

            </article>
          `
        )
        .join("");
  }


  function localizeDriverDocuments() {
    const upload =
      $(
        "[data-upload-cmr]"
      );

    if (!upload) {
      return;
    }


    const position =
      Number(
        C12.state
          .simulationPosition ||
        0
      );


    if (
      position <
      48
    ) {
      upload.innerHTML = `
        <span>＋</span>

        <strong>
          ${t(
            "CMR / POD ще недоступний",
            "CMR / POD пока недоступен",
            "CMR / POD not available yet"
          )}
        </strong>

        <small>
          ${t(
            "Документ можна додати після початку рейсу",
            "Документ можно добавить после начала рейса",
            "Documents can be uploaded once the trip is underway"
          )}
        </small>
      `;

      return;
    }


    if (
      position <
      92
    ) {
      upload.innerHTML = `
        <span>＋</span>

        <strong>
          ${t(
            "Додати CMR / POD",
            "Добавить CMR / POD",
            "Upload CMR / POD"
          )}
        </strong>

        <small>
          ${t(
            "Фото або PDF",
            "Фото или PDF",
            "Photo or PDF"
          )}
        </small>
      `;

      return;
    }


    upload.innerHTML = `
      <span>✓</span>

      <strong>
        ${t(
          "CMR / POD додано",
          "CMR / POD добавлен",
          "CMR / POD uploaded"
        )}
      </strong>

      <small>
        ${t(
          "Документ прив'язано до рейсу",
          "Документ привязан к рейсу",
          "Document attached to the shipment"
        )}
      </small>
    `;
  }


  function localizePlanningCard() {
    const card =
      $(
        '[data-draggable-order="TR-2026-00184"]'
      );

    if (!card) {
      return;
    }


    const hint =
      $(
        ".c12-drag-hint",
        card
      );

    if (!hint) {
      return;
    }


    if (
      !C12.state
        .mainOrderAssigned
    ) {
      hint.textContent =
        t(
          "Перетягніть на автомобіль →",
          "Перетащите на автомобиль →",
          "Drag onto a truck →"
        );

      return;
    }


    if (
      C12.mainOrder.execution ===
      "carrier"
    ) {
      hint.textContent =
        `✓ ${C12.mainOrder.carrier} · ${C12.mainOrder.vehicle}`;

      return;
    }


    hint.textContent =
      t(
        `✓ DAF XF · ${C12.mainOrder.vehicle} призначено`,
        `✓ DAF XF · ${C12.mainOrder.vehicle} назначен`,
        `✓ DAF XF · ${C12.mainOrder.vehicle} assigned`
      );
  }


  function localizeVehicleStatus() {
    const card =
      $(
        '[data-vehicle="BC4587KA"]'
      );

    if (!card) {
      return;
    }


    const badge =
      $(
        ".c12-vehicle-card__status",
        card
      );

    if (!badge) {
      return;
    }


    const vehicle =
      C12.data
        .getVehicle(
          "BC4587KA"
        );

    if (!vehicle) {
      return;
    }


    const status =
      vehicle.status ===
      "reserved"
        ? "reserved"
        : vehicle.status ===
          "transit"
          ? "transit"
          : "free";


    const map = {
      free: {
        uk:
          "ВІЛЬНИЙ",

        ru:
          "СВОБОДЕН",

        en:
          "AVAILABLE"
      },

      reserved: {
        uk:
          "ЗАРЕЗЕРВОВАНО",

        ru:
          "ЗАРЕЗЕРВИРОВАН",

        en:
          "RESERVED"
      },

      transit: {
        uk:
          "У РЕЙСІ",

        ru:
          "В РЕЙСЕ",

        en:
          "IN TRANSIT"
      }
    };


    badge.textContent =
      map[
        status
      ][
        lang()
      ];
  }


  function localizeDriverResource() {
    const order =
      C12.mainOrder;

    if (
      !order ||
      !order.driver
    ) {
      return;
    }


    const resource =
      $(
        ".c12-driver-resource"
      );

    if (!resource) {
      return;
    }


    if (
      order.execution ===
      "carrier" &&
      order.externalResource
    ) {
      const item =
        order.externalResource;

      resource.innerHTML = `
        <small>
          ${t(
            "ЗАЛУЧЕНИЙ ПЕРЕВІЗНИК",
            "ПРИВЛЕЧЁННЫЙ ПЕРЕВОЗЧИК",
            "THIRD-PARTY CARRIER"
          )}
        </small>

        <strong>
          ${escapeHtml(
            item.carrierName
          )}
        </strong>

        <span>
          ${escapeHtml(
            `${item.brand} ${item.model} · ${item.displayPlate}`
          )}
        </span>
      `;

      return;
    }


    const ownVehicle =
      C12.data
        .getVehicle(
          order.vehicle
        );


    resource.innerHTML = `
      <small>
        ${t(
          "ВЛАСНИЙ АВТОПАРК",
          "СОБСТВЕННЫЙ АВТОПАРК",
          "COMPANY FLEET"
        )}
      </small>

      <strong>
        ${escapeHtml(
          ownVehicle
            ? `${ownVehicle.brand} ${ownVehicle.model}`
            : t(
                "Автомобіль",
                "Автомобиль",
                "Truck"
              )
        )}
      </strong>

      <span>
        ${escapeHtml(
          order.vehicle ||
          ""
        )}
      </span>
    `;
  }


  function localizeMainOrderStrip() {
    const status =
      $(
        "[data-main-order-status]"
      );

    if (
      status
    ) {
      status.textContent =
        C12.data
          .displayStatus(
            C12.mainOrder.status
          );
    }
  }


  function localizeTimeMachine() {
    const label =
      $(
        "[data-time-machine-label]"
      );

    if (
      label
    ) {
      label.textContent =
        localizeDateLabel(
          label.textContent
        );
    }
  }


  function localizeMapStatic() {
    if (
      lang() ===
      "uk"
    ) {
      return;
    }


    $$(".c12-country-label span")
      .forEach(
        element => {
          const current =
            element.textContent
              .trim();

          element.textContent =
            C12.data
              .displayCountry(
                current
              );
        }
      );


    $$(".c12-map-tooltip")
      .forEach(
        element => {
          const current =
            element.textContent
              .trim();

          if (
            C12.data
              .i18n
              ?.cities?.[
                current
              ]
          ) {
            element.textContent =
              C12.data
                .displayCity(
                  current
                );
          }
        }
      );


    const crimea =
      $(".c12-crimea-label");

    if (
      crimea
    ) {
      const span =
        $("span", crimea);

      const strong =
        $("strong", crimea);

      if (
        span
      ) {
        span.textContent =
          t(
            "Крим",
            "Крым",
            "Crimea"
          );
      }

      if (
        strong
      ) {
        strong.textContent =
          t(
            "Україна",
            "Украина",
            "Ukraine"
          );
      }
    }


    $$(".c12-map-legend span")
      .forEach(
        element => {
          const text =
            element.textContent
              .replace(
                /\s+/g,
                " "
              )
              .trim();

          if (
            text.includes(
              "У рейсі"
            )
          ) {
            element.lastChild.textContent =
              t(
                " У рейсі",
                " В рейсе",
                " In transit"
              );
          }

          if (
            text.includes(
              "Потребує уваги"
            )
          ) {
            element.lastChild.textContent =
              t(
                " Потребує уваги",
                " Требует внимания",
                " Needs attention"
              );
          }

          if (
            text.includes(
              "Головний рейс"
            )
          ) {
            element.lastChild.textContent =
              t(
                " Головний рейс",
                " Главный рейс",
                " Active shipment"
              );
          }
        }
      );
  }


  function translateGenericDynamicText() {
    if (
      typeof C12.i18n
        .translateStatic !==
      "function"
    ) {
      return;
    }


    const root =
      document.getElementById(
        "transportCase"
      );

    if (!root) {
      return;
    }


    const walker =
      document.createTreeWalker(
        root,
        NodeFilter.SHOW_TEXT
      );

    const nodes =
      [];


    while (
      walker.nextNode()
    ) {
      nodes.push(
        walker.currentNode
      );
    }


    nodes.forEach(
      node => {
        const original =
          node.nodeValue;

        const normalized =
          String(
            original ||
            ""
          )
            .replace(
              /\s+/g,
              " "
            )
            .trim();

        if (
          !normalized
        ) {
          return;
        }


        const translated =
          C12.i18n
            .translateStatic(
              normalized
            );


        if (
          !translated ||
          translated ===
          normalized
        ) {
          return;
        }


        const leading =
          original.match(
            /^\s*/
          )?.[0] ||
          "";

        const trailing =
          original.match(
            /\s*$/
          )?.[0] ||
          "";


        node.nodeValue =
          leading +
          translated +
          trailing;
      }
    );
  }


  function localizeUI() {
    renderOrdersTableLocalized();

    renderAllOrdersTableLocalized();

    renderIncomingStreamLocalized();

    renderInboxCountsLocalized();

    renderInboxListLocalized(
      C12.uiState
        ?.inboxSource ||
      "email"
    );


    if (
      C12.uiState
        ?.selectedInboxRequestId
    ) {
      renderSelectedInboxRequestLocalized(
        C12.uiState
          .selectedInboxRequestId
      );
    }


    renderPlanningQueueLocalized();

    renderCarriersLocalized();

    renderAttentionListLocalized();


    const snapshot =
      C12.simulation
        ?.preview(
          C12.state
            .simulationPosition
        );


    if (
      snapshot
    ) {
      renderCustomerMessagesLocalized(
        snapshot.customerMessages ||
        []
      );
    }


    localizeDriverDocuments();

    localizePlanningCard();

    localizeVehicleStatus();

    localizeDriverResource();

    localizeMainOrderStrip();

    localizeTimeMachine();

    translateGenericDynamicText();

    window.setTimeout(
      localizeMapStatic,
      250
    );
  }


  C12.ui.localize =
    localizeUI;


  document.addEventListener(
    "c12:simulationchange",
    () => {
      window.setTimeout(
        localizeUI,
        0
      );
    }
  );


  document.addEventListener(
    "c12:simulationreset",
    () => {
      window.setTimeout(
        localizeUI,
        0
      );
    }
  );


  document.addEventListener(
    "c12:rolechange",
    () => {
      window.setTimeout(
        localizeUI,
        50
      );
    }
  );


  document.addEventListener(
    "c12:data-languagechange",
    () => {
      window.setTimeout(
        localizeUI,
        0
      );
    }
  );


  document.addEventListener(
    "click",
    event => {
      if (
        event.target.closest(
          "[data-source], [data-inbox-request], [data-filter-orders], [data-open-all-orders]"
        )
      ) {
        window.setTimeout(
          localizeUI,
          20
        );
      }
    }
  );


  const observer =
    new MutationObserver(
      mutations => {
        const relevant =
          mutations.some(
            mutation =>
              mutation.type ===
                "childList" &&
              mutation.addedNodes
                .length
          );

        if (
          !relevant
        ) {
          return;
        }


        window.clearTimeout(
          observer.timer
        );


        observer.timer =
          window.setTimeout(
            () => {
              translateGenericDynamicText();

              localizeMapStatic();
            },
            30
          );
      }
    );


  function initLocalization() {
    const root =
      document.getElementById(
        "transportCase"
      );

    if (
      !root
    ) {
      window.setTimeout(
        initLocalization,
        100
      );

      return;
    }


    observer.observe(
      root,
      {
        childList:
          true,

        subtree:
          true
      }
    );


    window.setTimeout(
      localizeUI,
      0
    );


    console.info(
      "[CASE 12] UI localization ready:",
      lang()
    );
  }


  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      initLocalization,
      {
        once:
          true
      }
    );
  }

  else {
    initLocalization();
  }

})();
