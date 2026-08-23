(() => {
  const root = document.querySelector("#quotation-case");

  if (!root) return;

  const panels = [
    ...root.querySelectorAll("[data-quote-panel]")
  ];

  const flowSteps = [
    ...root.querySelectorAll("[data-quote-step]")
  ];

  const stepCounter = root.querySelector("#quote-step-counter");

  const startButton = root.querySelector("#quote-start");

  const customerSourceButtons = [
    ...root.querySelectorAll("[data-customer-source]")
  ];

  const customerSearch = root.querySelector("#quote-customer-search");
  const customerQuery = root.querySelector("#quote-customer-query");
  const findCustomerButton = root.querySelector("#quote-find-customer");
  const customerResult = root.querySelector("#quote-customer-result");
  const useCustomerButton = root.querySelector("#quote-use-customer");
  const createCustomerButton = root.querySelector("#quote-create-customer");
  const newCustomerForm = root.querySelector("#quote-new-customer");
  const saveCustomerButton = root.querySelector("#quote-save-customer");

  const productSourceButtons = [
    ...root.querySelectorAll("[data-product-source]")
  ];

  const productBrowser = root.querySelector("#quote-product-browser");
  const productSourceLabel = root.querySelector("#quote-product-source-label");
  const productSearch = root.querySelector("#quote-product-search");
  const productRows = [
    ...root.querySelectorAll("[data-product]")
  ];
  const productsReadyButton = root.querySelector("#quote-products-ready");

  const builderTable = root.querySelector("#quote-builder-table");
  const addMoreProductsButton = root.querySelector("#quote-add-more-products");
  const currencySelect = root.querySelector("#quote-currency");
  const paymentTermsSelect = root.querySelector("#quote-payment-terms");
  const validitySelect = root.querySelector("#quote-validity");
  const subtotalElement = root.querySelector("#quote-subtotal");
  const discountTotalElement = root.querySelector("#quote-discount-total");
  const grandTotalElement = root.querySelector("#quote-grand-total");
  const termsReadyButton = root.querySelector("#quote-terms-ready");

  const deliveryCountry = root.querySelector("#quote-delivery-country");
  const deliveryCity = root.querySelector("#quote-delivery-city");
  const deliveryAddress = root.querySelector("#quote-delivery-address");
  const deliveryDate = root.querySelector("#quote-delivery-date");
  const incotermsSelect = root.querySelector("#quote-incoterms");
  const deliveryCostInput = root.querySelector("#quote-delivery-cost");
  const leadTimeSelect = root.querySelector("#quote-lead-time");
  const deliveryReadyButton = root.querySelector("#quote-delivery-ready");

  const documentLines = root.querySelector("#quote-document-lines");
  const documentProductsTotal = root.querySelector("#quote-document-products-total");
  const documentDelivery = root.querySelector("#quote-document-delivery");
  const documentTotal = root.querySelector("#quote-document-total");
  const documentPayment = root.querySelector("#quote-document-payment");
  const documentIncoterms = root.querySelector("#quote-document-incoterms");
  const documentAddress = root.querySelector("#quote-document-address");

  const generatePdfButton = root.querySelector("#quote-generate-pdf");
  const generationStatus = root.querySelector("#quote-generation-status");
  const generationStates = [
    ...root.querySelectorAll("[data-generation-state]")
  ];
  const pdfResult = root.querySelector("#quote-pdf-result");
  const previewPdfButton = root.querySelector("#quote-preview-pdf");

  const storageButtons = [
    ...root.querySelectorAll("[data-storage-source]")
  ];
  const storageResult = root.querySelector("#quote-storage-result");
  const storageLocation = root.querySelector("#quote-storage-location");
  const storageReadyButton = root.querySelector("#quote-storage-ready");

  const sendEmailButton = root.querySelector("#quote-send-email");
  const completeBlock = root.querySelector("#quote-complete");
  const tryAgainButton = root.querySelector("#quote-try-again");

  const pdfModal = root.querySelector("#quote-pdf-modal");
const pdfModalClose = root.querySelector("#quote-pdf-modal-close");
const pdfApprove = root.querySelector("#quote-pdf-approve");
const documentModal = root.querySelector("#quote-document-modal");

const stageNode = root.querySelector(".quote-stage");

const transitionLayer = document.createElement("div");

transitionLayer.className = "quote-stage-transition";
transitionLayer.hidden = true;

transitionLayer.innerHTML = `
  <div class="quote-transition-inner">
    <span class="quote-transition-label">PROCESSING</span>
    <strong id="quote-transition-title"></strong>
    <p id="quote-transition-text"></p>

    <div class="quote-transition-track">
      <i></i>
    </div>

    <div class="quote-transition-statuses">
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
`;

stageNode.appendChild(transitionLayer);

const transitionTitle =
  transitionLayer.querySelector("#quote-transition-title");

const transitionText =
  transitionLayer.querySelector("#quote-transition-text");

  const productData = {
    "orange-1l": {
      sku: "J-O-1000-TP",
      name: "Orange Juice 100%",
      pack: "1 L Tetra Pak",
      price: 1.18,
      requestedQty: 12000
    },
    "apple-1l": {
      sku: "J-A-1000-TP",
      name: "Apple Juice 100%",
      pack: "1 L Tetra Pak",
      price: 1.06,
      requestedQty: 8000
    },
    "multi-200": {
      sku: "J-M-0200-TP",
      name: "Multivitamin Juice",
      pack: "0.2 L carton",
      price: 0.34,
      requestedQty: 24000
    },
    "tomato-1l": {
      sku: "J-T-1000-TP",
      name: "Tomato Juice",
      pack: "1 L Tetra Pak",
      price: 1.12,
      requestedQty: 5000
    },
    "orange-500": {
      sku: "J-O-0500-PET",
      name: "Orange Drink",
      pack: "0.5 L PET",
      price: 0.69,
      requestedQty: 1000
    },
    "apple-200": {
      sku: "J-A-0200-TP",
      name: "Apple Juice",
      pack: "0.2 L carton",
      price: 0.31,
      requestedQty: 1000
    }
  };

  const customerSources = {
    crm: {
      title: "CRM",
      detail: "Searching CRM customer database"
    },
    erp: {
      title: "ERP",
      detail: "Searching ERP Customer Master"
    },
    "1c": {
      title: "1С",
      detail: "Searching 1С counterparty directory"
    },
    excel: {
      title: "Excel / Sheets",
      detail: "Searching customer master file"
    }
  };

  const productSources = {
    excel: {
      title: "PriceList_2026.xlsx",
      detail: "Excel price list"
    },
    erp: {
      title: "ERP Sales Catalogue",
      detail: "ERP catalogue and sales prices"
    },
    "1c": {
      title: "1С · Номенклатура",
      detail: "1С product catalogue and price types"
    },
    crm: {
      title: "CRM Product Catalogue",
      detail: "CRM catalogue and customer-specific prices"
    }
  };

  const storageSources = {
    crm: "CRM → FreshMarket Distribution GmbH → Opportunity Q-2026-00841",
    sharepoint: "SharePoint → Sales → FreshMarket → Quotations → 2026",
    drive: "Google Drive → Customers → FreshMarket → Quotations → 2026",
    onedrive: "OneDrive → Sales → Customers → FreshMarket → Quotations",
    erp: "ERP → Customer DE-10482 → Sales Documents → Quotations",
    folder: "\\\\Sales\\Customers\\FreshMarket\\Quotations\\2026"
  };

  let state = {
    step: 1,
    customerSource: "",
    customerMode: "existing",
    productSource: "",
    selectedProducts: [],
    storageSource: "",
    customer: {
      name: "FreshMarket Distribution GmbH",
      id: "DE-10482",
      vat: "DE349827156",
      currency: "EUR",
      paymentTerms: "30 days",
      country: "Germany",
      city: "Hamburg"
    }
  };

  function money(value) {
    const currency = currencySelect?.value || "EUR";
    const symbol = currency === "USD" ? "$" : "€";

    return `${symbol}${Number(value || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }

  function showStep(step, scrollBehavior = "smooth") {
    state.step = step;

    panels.forEach(panel => {
      const panelStep = Number(panel.dataset.quotePanel);
      panel.hidden = panelStep !== step;
      panel.classList.toggle("active", panelStep === step);
    });

    flowSteps.forEach(item => {
      const itemStep = Number(item.dataset.quoteStep);

      item.classList.toggle("active", itemStep === step);
      item.classList.toggle("done", itemStep < step);
    });

    stepCounter.textContent = `${step} / 8`;

    const activePanel = root.querySelector(
      `[data-quote-panel="${step}"]`
    );

    if (activePanel) {
      activePanel.scrollIntoView({
        behavior: scrollBehavior,
        block: "nearest"
      });
    }
  }

  function transitionToStep(
  step,
  title,
  text,
  delay = 950
) {
  transitionTitle.textContent = title;
  transitionText.textContent = text;

  transitionLayer.hidden = false;

  setTimeout(() => {
    transitionLayer.hidden = true;
    showStep(step);
  }, delay);
}

  function selectSystem(buttons, activeButton) {
    buttons.forEach(button => {
      button.classList.toggle(
        "selected",
        button === activeButton
      );
    });
  }

  function setupCustomerSource(source, button) {
    state.customerSource = source;

    selectSystem(customerSourceButtons, button);

    customerSearch.hidden = false;
    customerResult.hidden = true;
    newCustomerForm.hidden = true;

    const sourceInfo = customerSources[source];

    customerQuery.value = "FreshMarket Distribution GmbH";
    customerQuery.placeholder = sourceInfo.detail;

    findCustomerButton.textContent =
      `Знайти у ${sourceInfo.title}`;

    customerSearch.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  }

  function findCustomer() {
    const query = customerQuery.value
      .trim()
      .toLowerCase();

    if (!query) return;

    const knownCustomer =
      query.includes("freshmarket") ||
      query.includes("fresh market");

    if (knownCustomer) {
      state.customerMode = "existing";

      customerResult.hidden = false;
      newCustomerForm.hidden = true;

      const stateLabel =
        customerResult.querySelector(".quote-result-state");

      stateLabel.textContent =
        `MATCH FOUND · ${customerSources[state.customerSource].title}`;

      customerResult.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });

      return;
    }

    customerResult.hidden = true;
    newCustomerForm.hidden = false;

    const companyInput =
      newCustomerForm.querySelector(
        'input[type="text"]'
      );

    if (companyInput) {
      companyInput.value =
        customerQuery.value.trim();
    }

    newCustomerForm.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  }

function useExistingCustomer() {
  state.customerMode = "existing";

  transitionToStep(
    3,
    "Клієнта ідентифіковано",
    "Реквізити та комерційні умови завантажено з обраного джерела."
  );
}

  function showNewCustomer() {
    state.customerMode = "new";

    customerResult.hidden = true;
    newCustomerForm.hidden = false;

    newCustomerForm.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  }

  function saveNewCustomer() {
    const fields = [
      ...newCustomerForm.querySelectorAll("input, select")
    ];

    state.customer = {
      name: fields[0]?.value || "New customer",
      contact: fields[1]?.value || "",
      email: fields[2]?.value || "",
      vat: fields[3]?.value || "",
      country: fields[4]?.value || "",
      currency: fields[5]?.value || "EUR",
      id: "NEW-1087",
      paymentTerms: "30 days",
      city: deliveryCity?.value || ""
    };

    const builderCustomer =
      root.querySelector("#quote-builder-customer-name");

    if (builderCustomer) {
      builderCustomer.textContent =
        state.customer.name;
    }

    transitionToStep(
      3,
      "Картку клієнта створено",
      "Дані клієнта готові для використання у комерційній пропозиції."
    );
  }

  function setupProductSource(source, button) {
    state.productSource = source;

    selectSystem(productSourceButtons, button);

    productBrowser.hidden = false;

    productSourceLabel.textContent =
      `${productSources[source].detail} · ${productSources[source].title}`;

    productBrowser.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  }

  function filterProducts() {
    const query =
      productSearch.value
        .trim()
        .toLowerCase();

    productRows.forEach(row => {
      const data =
        productData[row.dataset.product];

      const haystack =
        `${data.sku} ${data.name} ${data.pack}`
          .toLowerCase();

      row.hidden =
        Boolean(query) &&
        !haystack.includes(query);
    });
  }

  function addProduct(productId, button) {
    if (
      state.selectedProducts.some(
        item => item.id === productId
      )
    ) {
      return;
    }

    const source = productData[productId];

    state.selectedProducts.push({
      id: productId,
      sku: source.sku,
      name: source.name,
      pack: source.pack,
      quantity: source.requestedQty,
      price: source.price,
      discount: 0
    });

    button.textContent = "Додано ✓";
    button.disabled = true;

    productsReadyButton.hidden = false;
  }

  function renderBuilder() {
    builderTable
      .querySelectorAll(".quote-builder-item")
      .forEach(row => row.remove());

    state.selectedProducts.forEach((item, index) => {
      const row = document.createElement("div");

      row.className =
        "quote-builder-row quote-builder-item";

      row.dataset.productIndex = index;

      row.innerHTML = `
        <span>${item.sku}</span>
        <span>
          <strong>${item.name}</strong><br>
          <small>${item.pack}</small>
        </span>
        <input
          type="number"
          class="quote-builder-qty"
          value="${item.quantity}"
          min="1"
          step="1"
        >
        <input
          type="number"
          class="quote-builder-price"
          value="${item.price.toFixed(2)}"
          min="0"
          step="0.01"
        >
        <input
          type="number"
          class="quote-builder-discount"
          value="${item.discount}"
          min="0"
          max="100"
          step="1"
        >
        <strong class="quote-builder-line-total">
          ${money(
            item.quantity *
            item.price *
            (1 - item.discount / 100)
          )}
        </strong>
      `;

      builderTable.appendChild(row);

      const inputs = [
        ...row.querySelectorAll("input")
      ];

      inputs.forEach(input => {
        input.addEventListener(
          "input",
          updateBuilderFromInputs
        );
      });
    });

    const builderCustomer =
      root.querySelector("#quote-builder-customer-name");

    if (builderCustomer) {
      builderCustomer.textContent =
        state.customer.name;
    }

    updateTotals();
  }

  function updateBuilderFromInputs() {
    const rows = [
      ...builderTable.querySelectorAll(
        ".quote-builder-item"
      )
    ];

    rows.forEach(row => {
      const index =
        Number(row.dataset.productIndex);

      const item =
        state.selectedProducts[index];

      const qty =
        Number(
          row.querySelector(
            ".quote-builder-qty"
          ).value
        ) || 0;

      const price =
        Number(
          row.querySelector(
            ".quote-builder-price"
          ).value
        ) || 0;

      const discount =
        Math.min(
          100,
          Math.max(
            0,
            Number(
              row.querySelector(
                ".quote-builder-discount"
              ).value
            ) || 0
          )
        );

      item.quantity = qty;
      item.price = price;
      item.discount = discount;

      const lineTotal =
        qty *
        price *
        (1 - discount / 100);

      row.querySelector(
        ".quote-builder-line-total"
      ).textContent =
        money(lineTotal);
    });

    updateTotals();
  }

  function getTotals() {
    let subtotal = 0;
    let discount = 0;

    state.selectedProducts.forEach(item => {
      const base =
        item.quantity *
        item.price;

      const discountValue =
        base *
        (item.discount / 100);

      subtotal += base;
      discount += discountValue;
    });

    return {
      subtotal,
      discount,
      productsTotal:
        subtotal - discount
    };
  }

  function updateTotals() {
    const totals = getTotals();

    subtotalElement.textContent =
      money(totals.subtotal);

    discountTotalElement.textContent =
      `-${money(totals.discount)}`;

    grandTotalElement.textContent =
      money(totals.productsTotal);
  }

  function showBuilder() {
    renderBuilder();
  
    transitionToStep(
      4,
      "Позиції зібрано",
      "Номенклатура та базові ціни перенесені до quotation builder."
    );
  }

  function returnToProducts() {
    showStep(3);

    productBrowser.hidden = false;
    productsReadyButton.hidden =
      state.selectedProducts.length === 0;
  }

  function prepareDocument() {
    documentLines.innerHTML = "";

    state.selectedProducts.forEach(item => {
      const row =
        document.createElement("div");

      const total =
        item.quantity *
        item.price *
        (1 - item.discount / 100);

      row.className = "quote-document-row";

      row.innerHTML = `
        <span>
          <strong>${item.name}</strong><br>
          ${item.pack}<br>
          <small>${item.sku}</small>
        </span>
        <span>${item.quantity.toLocaleString("en-US")}</span>
        <span>${money(item.price)}</span>
        <strong>${money(total)}</strong>
      `;

      documentLines.appendChild(row);
    });

    const totals = getTotals();

    const deliveryCost =
      Number(deliveryCostInput.value) || 0;

    documentProductsTotal.textContent =
      money(totals.productsTotal);

    documentDelivery.textContent =
      money(deliveryCost);

    documentTotal.textContent =
      money(
        totals.productsTotal +
        deliveryCost
      );

    documentPayment.textContent =
      paymentTermsSelect.value;

    documentIncoterms.textContent =
      incotermsSelect.value;

    documentAddress.textContent =
      `${deliveryAddress.value}, ${deliveryCity.value}, ${deliveryCountry.value}`;

    const customerName =
      root.querySelector(
        ".quote-document-meta > div:first-child strong"
      );

    const customerPlace =
      root.querySelector(
        ".quote-document-meta > div:first-child span"
      );

    if (customerName) {
      customerName.textContent =
        state.customer.name;
    }

    if (customerPlace) {
      customerPlace.textContent =
        `${deliveryCity.value}, ${deliveryCountry.value}`;
    }

    const validity =
      root.querySelector(
        ".quote-document-meta > div:last-child strong:last-child"
      );

    if (validity) {
      validity.textContent =
        validitySelect.value;
    }
  }

  function resetGeneration() {
    generationStatus.hidden = true;
    pdfResult.hidden = true;

    generationStates.forEach(item => {
      item.classList.remove("done");

      const icon =
        item.querySelector("span");

      if (icon) {
        icon.textContent = "○";
      }
    });

    generatePdfButton.disabled = false;
    generatePdfButton.textContent =
      "Сформувати PDF";
  }

  function runPdfGeneration() {
  resetGeneration();

  generationStatus.hidden = false;
  generatePdfButton.disabled = true;
  generatePdfButton.textContent =
    "Формування...";

  generationStates.forEach(
    (item, index) => {
      setTimeout(() => {
        item.classList.add("done");

        const icon =
          item.querySelector("span");

        if (icon) {
          icon.textContent = "✓";
        }

        if (
          index ===
          generationStates.length - 1
        ) {
          setTimeout(() => {
            pdfResult.hidden = false;
            pdfResult.classList.add("is-ready");

            generatePdfButton.textContent =
              "PDF готовий ✓";

            previewPdfButton.classList.add(
              "quote-next-action"
            );

            previewPdfButton.textContent =
              "Відкрити PDF";

            pdfResult.scrollIntoView({
              behavior: "smooth",
              block: "center"
            });
          }, 350);
        }
      }, 520 * (index + 1));
    }
  );
}

  function previewDocument() {
  const sourceDocument =
    root.querySelector("#quote-document");

  if (!sourceDocument) return;

  documentModal.innerHTML =
    sourceDocument.innerHTML;

  pdfModal.hidden = false;

  previewPdfButton.classList.remove(
    "quote-next-action"
  );

  document.body.style.overflow = "hidden";
}

  function closePdfModal() {
  pdfModal.hidden = true;
  document.body.style.overflow = "";
}

function approvePdf() {
  closePdfModal();

  transitionToStep(
    7,
    "Комерційну пропозицію перевірено",
    "PDF підтверджено. Тепер визначимо, де зберегти фінальний документ.",
    1050
  );
}

  pdfModalClose.addEventListener(
  "click",
  closePdfModal
);

pdfApprove.addEventListener(
  "click",
  approvePdf
);

pdfModal.addEventListener(
  "click",
  event => {
    if (event.target === pdfModal) {
      closePdfModal();
    }
  }
);

  function selectStorage(source, button) {
    state.storageSource = source;

    selectSystem(storageButtons, button);

    storageResult.hidden = false;
    storageReadyButton.hidden = false;

    storageLocation.textContent =
      storageSources[source];

    storageResult.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  }

  function sendQuotation() {
    sendEmailButton.disabled = true;
    sendEmailButton.textContent =
      "Надсилання...";

    setTimeout(() => {
      sendEmailButton.textContent =
        "Надіслано ✓";

      completeBlock.hidden = false;

      flowSteps.forEach(item => {
        item.classList.remove("active");
        item.classList.add("done");
      });

      stepCounter.textContent = "8 / 8";

      completeBlock.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }, 1400);
  }

  function resetCase() {
  state = {
    step: 1,
    customerSource: "",
    customerMode: "existing",
    productSource: "",
    selectedProducts: [],
    storageSource: "",
    customer: {
      name: "FreshMarket Distribution GmbH",
      id: "DE-10482",
      vat: "DE349827156",
      currency: "EUR",
      paymentTerms: "30 days",
      country: "Germany",
      city: "Hamburg"
    }
  };

  customerSourceButtons.forEach(button => {
    button.classList.remove("selected");
  });

  productSourceButtons.forEach(button => {
    button.classList.remove("selected");
  });

  storageButtons.forEach(button => {
    button.classList.remove("selected");
  });

  customerSearch.hidden = true;
  customerResult.hidden = true;
  newCustomerForm.hidden = true;

  customerQuery.value =
    "FreshMarket Distribution GmbH";

  productBrowser.hidden = true;
  productSearch.value = "";

  productRows.forEach(row => {
    row.hidden = false;

    const button =
      row.querySelector("button");

    if (button) {
      button.disabled = false;
      button.textContent = "Додати";
    }
  });

  productsReadyButton.hidden = true;

  builderTable
    .querySelectorAll(".quote-builder-item")
    .forEach(row => row.remove());

  currencySelect.value = "EUR";
  paymentTermsSelect.value = "30 days";
  validitySelect.value = "30 days";

  subtotalElement.textContent = "€0.00";
  discountTotalElement.textContent = "€0.00";
  grandTotalElement.textContent = "€0.00";

  deliveryCountry.value = "Germany";
  deliveryCity.value = "Hamburg";
  deliveryAddress.value =
    "Billstraße 120, 20539 Hamburg";

  deliveryDate.value =
    "2026-09-15";

  incotermsSelect.value =
    "DAP Hamburg";

  deliveryCostInput.value =
    "420";

  leadTimeSelect.value =
    "10 working days";

  documentLines.innerHTML = "";
  documentProductsTotal.textContent = "€0.00";
  documentDelivery.textContent = "€420.00";
  documentTotal.textContent = "€0.00";
  documentPayment.textContent = "30 days";
  documentIncoterms.textContent = "DAP Hamburg";
  documentAddress.textContent =
    "Billstraße 120, 20539 Hamburg, Germany";

  resetGeneration();

  pdfResult.classList.remove("is-ready");

  previewPdfButton.classList.remove(
    "quote-next-action"
  );

  previewPdfButton.textContent =
    "Preview";

  storageResult.hidden = true;
  storageReadyButton.hidden = true;
  storageLocation.textContent = "";

  completeBlock.hidden = true;

  sendEmailButton.disabled = false;
  sendEmailButton.textContent =
    "Надіслати комерційну пропозицію";

  transitionLayer.hidden = true;

  closePdfModal();

  showStep(1, "auto");

root.scrollIntoView({
    behavior: "auto",
    block: "start"
  });
}
  startButton.addEventListener(
    "click",
    () => {
      transitionToStep(
        2,
        "Запит прийнято в роботу",
        "Переходимо до ідентифікації клієнта та його реквізитів.",
        900
      );
    }
  );

  customerSourceButtons.forEach(button => {
    button.addEventListener("click", () => {
      setupCustomerSource(
        button.dataset.customerSource,
        button
      );
    });
  });

  findCustomerButton.addEventListener(
    "click",
    findCustomer
  );

  customerQuery.addEventListener(
    "keydown",
    event => {
      if (event.key === "Enter") {
        event.preventDefault();
        findCustomer();
      }
    }
  );

  useCustomerButton.addEventListener(
    "click",
    useExistingCustomer
  );

  createCustomerButton.addEventListener(
    "click",
    showNewCustomer
  );

  saveCustomerButton.addEventListener(
    "click",
    saveNewCustomer
  );

  productSourceButtons.forEach(button => {
    button.addEventListener("click", () => {
      setupProductSource(
        button.dataset.productSource,
        button
      );
    });
  });

  productSearch.addEventListener(
    "input",
    filterProducts
  );

  productRows.forEach(row => {
    const button =
      row.querySelector("button");

    button.addEventListener("click", () => {
      addProduct(
        row.dataset.product,
        button
      );
    });
  });

  productsReadyButton.addEventListener(
    "click",
    showBuilder
  );

  addMoreProductsButton.addEventListener(
    "click",
    returnToProducts
  );

  currencySelect.addEventListener(
    "change",
    () => {
      updateBuilderFromInputs();
    }
  );

  paymentTermsSelect.addEventListener(
    "change",
    prepareDocument
  );

  validitySelect.addEventListener(
    "change",
    prepareDocument
  );

  termsReadyButton.addEventListener(
    "click",
    () => {
      transitionToStep(
        5,
        "Комерційні умови зафіксовано",
        "Кількість, ціни, знижки та умови оплати готові. Переходимо до доставки."
      );
    }
  );

  [
    deliveryCountry,
    deliveryCity,
    deliveryAddress,
    deliveryDate,
    incotermsSelect,
    deliveryCostInput,
    leadTimeSelect
  ].forEach(field => {
    field.addEventListener(
      "change",
      prepareDocument
    );
  });

  deliveryReadyButton.addEventListener(
    "click",
    () => {
      prepareDocument();
      resetGeneration();
  
      transitionToStep(
        6,
        "Дані для пропозиції готові",
        "Клієнт, товари, ціни та доставка зібрані в один документ.",
        1100
      );
    }
  );

  generatePdfButton.addEventListener(
    "click",
    runPdfGeneration
  );

  previewPdfButton.addEventListener(
    "click",
    previewDocument
  );

  storageButtons.forEach(button => {
    button.addEventListener("click", () => {
      selectStorage(
        button.dataset.storageSource,
        button
      );
    });
  });

  storageReadyButton.addEventListener(
    "click",
    () => {
      transitionToStep(
        8,
        "Комерційну пропозицію збережено",
        "Фінальний PDF зафіксовано у вибраному сховищі. Готуємо лист клієнту.",
        1000
      );
    }
  );

  sendEmailButton.addEventListener(
    "click",
    sendQuotation
  );

  flowSteps.forEach(item => {
    item.addEventListener("click", () => {
      const target =
        Number(item.dataset.quoteStep);

      if (target <= state.step) {
        showStep(target);
      }
    });
  });

  tryAgainButton?.addEventListener(
  "click",
  resetCase
);
  showStep(1);
})();
