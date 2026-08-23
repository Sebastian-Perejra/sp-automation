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

  const desktop = root.querySelector("#quote-desktop");
  const desktopWindow = root.querySelector("#quote-desktop-window");
  const desktopWindowTitle = root.querySelector("#quote-desktop-window-title");
  const desktopWindowIcon = root.querySelector("#quote-desktop-window-icon");
  const desktopWindowBody = root.querySelector("#quote-desktop-window-body");
  const desktopStageLabel = root.querySelector("#quote-desktop-stage-label");
  const desktopStageTitle = root.querySelector("#quote-desktop-stage-title");
  const desktopStageDescription = root.querySelector("#quote-desktop-stage-description");
  const desktopHintLabel = root.querySelector("#quote-desktop-hint-label");
  const desktopHintTitle = root.querySelector("#quote-desktop-hint-title");
  const desktopHintText = root.querySelector("#quote-desktop-hint-text");
  const desktopExplainerTitle = root.querySelector("#quote-desktop-explainer-title");
  const desktopExplainerText = root.querySelector("#quote-desktop-explainer-text");
  const mailBadge = root.querySelector("#quote-mail-badge");
  const taskbarOutlook = root.querySelector("#quote-taskbar-outlook");
  const taskbarOffers = root.querySelector("#quote-taskbar-offers");
  const desktopOffersIcon = root.querySelector("#quote-desktop-offers-icon");
  const offersRecommendation = root.querySelector("#quote-offers-recommendation");

  const desktopAppButtons = [
    ...root.querySelectorAll("[data-desktop-app]")
  ];

  const desktopWindowActions = [
    ...root.querySelectorAll("[data-window-action]")
  ];

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

  const saveOfferButton = root.querySelector("#quote-save-offer");
  const saveStatus = root.querySelector("#quote-module-save-status");

  const saveStates = [
    ...root.querySelectorAll("[data-save-state]")
  ];

  const storageResult = root.querySelector("#quote-storage-result");
  const storageReadyButton = root.querySelector("#quote-storage-ready");

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

  let state = {
    step: 1,
    customerSource: "",
    customerMode: "existing",
    productSource: "",
    selectedProducts: [],

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

  const desktopApps = {
    offers: {
      icon: "Q",
      title: "Комерційні пропозиції",

      render: () => `
        <div class="quote-app-screen-head">
          <div>
            <span>SALES TOOL</span>
            <strong>Комерційні пропозиції</strong>
            <small>
              Внутрішня програма для підготовки,
              перевірки та відправлення комерційних пропозицій.
            </small>
          </div>

          <span class="quote-app-status-pill">
            READY
          </span>
        </div>

        <div class="quote-app-dashboard">
          <div>
            <small>Чернетки</small>
            <strong>3</strong>
          </div>

          <div>
            <small>Відправлено цього місяця</small>
            <strong>28</strong>
          </div>

          <div>
            <small>Підключення</small>
            <strong>Outlook · ERP · CRM</strong>
          </div>
        </div>

        <div class="quote-app-new-offer quote-app-start-card">
          <span>НОВА ПРОПОЗИЦІЯ</span>

          <strong>
            Почніть нову комерційну пропозицію
          </strong>

          <p>
            На стартовому екрані немає даних FreshMarket.
            Спочатку менеджер сам вирішує,
            звідки взяти запит клієнта.
          </p>

          <button
            type="button"
            class="quote-primary-action quote-next-action"
            id="quote-open-new-offer"
          >
            + Створити нову пропозицію
          </button>
        </div>
      `
    },

    outlook: {
      icon: "O",
      title: "Outlook",

      render: () => `
        <div class="quote-app-screen-head">
          <div>
            <span>OUTLOOK · INBOX</span>
            <strong>Вхідні</strong>
            <small>
              1 новий лист · корпоративна пошта менеджера.
            </small>
          </div>

          <span class="quote-app-status-pill">
            1 NEW
          </span>
        </div>

        <div class="quote-outlook-list">
          <button
            type="button"
            class="quote-outlook-mail quote-outlook-mail-new"
            data-outlook-mail="freshmarket"
          >
            <span class="quote-outlook-mail-dot"></span>

            <div>
              <strong>
                FreshMarket Distribution GmbH
              </strong>

              <span>
                Request for quotation — juice assortment
              </span>

              <small>
                purchasing@freshmarket.de
              </small>
            </div>

            <time>08:42</time>
          </button>

          <button
            type="button"
            class="quote-outlook-mail"
            data-outlook-mail="logistics"
          >
            <span></span>

            <div>
              <strong>Logistics Team</strong>
              <span>Hamburg delivery slots</span>

              <small>
                logistics@freshdrinks.example
              </small>
            </div>

            <time>08:17</time>
          </button>

          <button
            type="button"
            class="quote-outlook-mail"
            data-outlook-mail="production"
          >
            <span></span>

            <div>
              <strong>Production Planning</strong>
              <span>Weekly availability update</span>

              <small>
                planning@freshdrinks.example
              </small>
            </div>

            <time>07:55</time>
          </button>
        </div>
      `
    },

    excel: {
      icon: "X",
      title: "PriceList_2026.xlsx",

      render: () => `
        <div class="quote-app-screen-head">
          <div>
            <span>EXCEL PRICE LIST</span>
            <strong>PriceList_2026.xlsx</strong>
            <small>
              Один із можливих джерел
              номенклатури та базових цін.
            </small>
          </div>

          <span class="quote-app-status-pill">
            23 AUG
          </span>
        </div>

        <div class="quote-mini-table">
          <div class="quote-mini-row head">
            <span>SKU</span>
            <span>Product</span>
            <span>Price</span>
          </div>

          <div class="quote-mini-row">
            <span>J-O-1000-TP</span>
            <span>Orange Juice 100% · 1 L</span>
            <span>€1.18</span>
          </div>

          <div class="quote-mini-row">
            <span>J-A-1000-TP</span>
            <span>Apple Juice 100% · 1 L</span>
            <span>€1.06</span>
          </div>

          <div class="quote-mini-row">
            <span>J-M-0200-TP</span>
            <span>Multivitamin Juice · 0.2 L</span>
            <span>€0.34</span>
          </div>
        </div>
      `
    },

    erp: {
      icon: "ERP",
      title: "ERP Sales",

      render: () => `
        <div class="quote-app-screen-head">
          <div>
            <span>ERP</span>
            <strong>Sales & Customer Master</strong>
            <small>
              ERP може бути джерелом клієнтів,
              номенклатури, цін та документів.
            </small>
          </div>

          <span class="quote-app-status-pill">
            SIGNED IN
          </span>
        </div>

        <div class="quote-source-folders">
          <div>
            <strong>Customer Master</strong>
            <small>
              18,426 клієнтів · реквізити · умови оплати
            </small>
          </div>

          <div>
            <strong>Sales Catalogue</strong>
            <small>
              SKU · пакування · sales prices
            </small>
          </div>

          <div>
            <strong>Delivery</strong>
            <small>
              Маршрути · lead time · Incoterms
            </small>
          </div>

          <div>
            <strong>Sales Documents</strong>
            <small>
              Quotations · orders · history
            </small>
          </div>
        </div>
      `
    },

    crm: {
      icon: "CRM",
      title: "CRM",

      render: () => `
        <div class="quote-app-screen-head">
          <div>
            <span>CUSTOMER DATABASE</span>

            <strong>
              CRM · FreshMarket Distribution GmbH
            </strong>

            <small>
              Приклад того, звідки програма
              може отримати дані клієнта.
            </small>
          </div>

          <span class="quote-app-status-pill">
            ACTIVE
          </span>
        </div>

        <div class="quote-source-folders">
          <div>
            <strong>Customer ID</strong>
            <small>DE-10482</small>
          </div>

          <div>
            <strong>VAT ID</strong>
            <small>DE349827156</small>
          </div>

          <div>
            <strong>Payment terms</strong>
            <small>30 days</small>
          </div>

          <div>
            <strong>Currency</strong>
            <small>EUR</small>
          </div>
        </div>
      `
    },

    drive: {
      icon: "D",
      title: "Google Drive",

      render: () => `
        <div class="quote-app-screen-head">
          <div>
            <span>CLOUD STORAGE</span>
            <strong>Google Drive</strong>
            <small>
              Приклад файлового сховища,
              де компанія може тримати прайси й готові PDF.
            </small>
          </div>

          <span class="quote-app-status-pill">
            SYNCED
          </span>
        </div>

        <div class="quote-source-folders">
          <div>
            <strong>Customers</strong>
            <small>
              FreshMarket · Retail Europe · Distributors
            </small>
          </div>

          <div>
            <strong>Price Lists</strong>
            <small>
              2026 · Export · Domestic
            </small>
          </div>

          <div>
            <strong>Quotations</strong>
            <small>
              2026 · 2025 · Archive
            </small>
          </div>

          <div>
            <strong>Templates</strong>
            <small>
              Commercial offer · delivery terms
            </small>
          </div>
        </div>
      `
    },

    pc: {
      icon: "PC",
      title: "This PC",

      render: () => `
        <div class="quote-app-screen-head">
          <div>
            <span>FILE EXPLORER</span>
            <strong>This PC</strong>
            <small>
              Реалістичний приклад того,
              як дані можуть бути розкидані
              по локальних і мережевих папках.
            </small>
          </div>

          <span class="quote-app-status-pill">
            SD-14
          </span>
        </div>

        <div class="quote-source-folders">
          <div>
            <strong>Local Disk (C:)</strong>
            <small>
              Windows · Users · Applications
            </small>
          </div>

          <div>
            <strong>Data (D:)</strong>
            <small>
              Exports · temp · old price lists
            </small>
          </div>

          <div>
            <strong>Sales (S:)</strong>
            <small>
              Customers · quotations · contracts
            </small>
          </div>

          <div>
            <strong>ERP Export (E:)</strong>
            <small>
              Daily product and price exports
            </small>
          </div>
        </div>
      `
    },

    archive: {
      icon: "A",
      title: "Quotes Archive",

      render: () => `
        <div class="quote-app-screen-head">
          <div>
            <span>ARCHIVE</span>
            <strong>Previous quotations</strong>
            <small>
              Історія того, що вже пропонували клієнтам.
            </small>
          </div>

          <span class="quote-app-status-pill">
            2026
          </span>
        </div>

        <div class="quote-mini-table">
          <div class="quote-mini-row head">
            <span>No.</span>
            <span>Customer</span>
            <span>Status</span>
          </div>

          <div class="quote-mini-row">
            <span>Q-2026-00840</span>
            <span>Nord Handels GmbH</span>
            <span>Sent</span>
          </div>

          <div class="quote-mini-row">
            <span>Q-2026-00839</span>
            <span>Fresh Choice AB</span>
            <span>Won</span>
          </div>

          <div class="quote-mini-row">
            <span>Q-2026-00838</span>
            <span>Retail Foods s.r.o.</span>
            <span>Sent</span>
          </div>
        </div>
      `
    },

    notes: {
      icon: "TXT",
      title: "call_notes.txt",

      render: () => `
        <div class="quote-app-screen-head">
          <div>
            <span>TEXT FILE</span>
            <strong>call_notes.txt</strong>
            <small>
              Звичайний робочий файл,
              який не є частиною автоматизованого процесу.
            </small>
          </div>
        </div>

        <p
          style="
            font-size:8px;
            line-height:1.7;
            margin-top:14px;
          "
        >
          Call logistics about Hamburg slot.
          Check Anna Keller payment terms.
          Do not forget September promo list.
        </p>
      `
    },

    oldprice: {
      icon: "XLS",
      title: "price_old_DO_NOT_USE.xlsx",

      render: () => `
        <div class="quote-app-screen-head">
          <div>
            <span>OLD FILE</span>
            <strong>price_old_DO_NOT_USE.xlsx</strong>
            <small>
              Саме такі файли створюють ризик
              використання неактуальної ціни.
            </small>
          </div>

          <span class="quote-app-status-pill">
            OUTDATED
          </span>
        </div>

        <div class="quote-app-new-offer">
          <span>УВАГА</span>
          <strong>Файл застарілий</strong>

          <p>
            У керованому процесі менеджеру не потрібно вгадувати,
            який із прайсів актуальний:
            джерело ціни визначається в самій програмі.
          </p>
        </div>
      `
    },

    drafts: {
      icon: "DIR",
      title: "draft_quotes",

      render: () => `
        <div class="quote-app-screen-head">
          <div>
            <span>FOLDER</span>
            <strong>draft_quotes</strong>
            <small>
              Чернетки старого ручного процесу.
            </small>
          </div>
        </div>

        <div class="quote-source-folders">
          <div>
            <strong>offer_new_final_v4.docx</strong>
            <small>Modified 18 Aug 2026</small>
          </div>

          <div>
            <strong>FreshMarket_old.xlsx</strong>
            <small>Modified 12 Jul 2026</small>
          </div>

          <div>
            <strong>template_copy_7.docx</strong>
            <small>Modified 02 Jun 2026</small>
          </div>

          <div>
            <strong>delivery_calc.xlsx</strong>
            <small>Modified 21 Aug 2026</small>
          </div>
        </div>
      `
    }
  };

  const desktopSession = {
    activeApp: "",
    openedMail: "",
    mailRead: false,
    workspaceUnlocked: false,
    outgoingReady: false
  };

  function setDesktopStage(step) {
    if (step === 1) {
      desktopStageLabel.textContent =
        "WORKSTATION · NEW EMAIL";

      desktopStageTitle.textContent =
        "На робочому комп’ютері менеджера новий лист";

      desktopStageDescription.textContent =
        "Натисніть на підсвічену іконку Outlook у нижній панелі, відкрийте новий лист FreshMarket, прочитайте його і згорніть поштове вікно.";

      desktopHintLabel.textContent =
        "НОВЕ ПОВІДОМЛЕННЯ";

      desktopHintTitle.textContent =
        "Відкрийте Outlook у нижній панелі";

      desktopHintText.textContent =
        "На пошту щойно надійшов новий запит клієнта. Почніть із нього.";

      desktopExplainerTitle.textContent =
        "Спочатку менеджер працює з вхідною поштою";

      desktopExplainerText.textContent =
        "Після прочитання листа він просто згортає Outlook. Перед ним залишається той самий робочий стіл, де він відкриває окрему програму «Комерційні пропозиції».";

      taskbarOutlook?.classList.add(
        "quote-mail-alert"
      );

      taskbarOffers?.classList.remove(
        "quote-taskbar-next"
      );

      desktopOffersIcon?.classList.remove(
        "quote-desktop-icon-main"
      );

      if (offersRecommendation) {
        offersRecommendation.hidden = true;
      }

      return;
    }

    if (step === 2) {
      desktopStageLabel.textContent =
        "MANAGER DESKTOP";

      desktopStageTitle.textContent =
        "Лист прочитано. Тепер відкрийте програму для пропозицій";

      desktopStageDescription.textContent =
        "Outlook згорнуто, і перед вами залишився той самий робочий стіл менеджера. Відкрийте «Комерційні пропозиції» та створіть нову пропозицію.";

      desktopHintLabel.textContent =
        "НАСТУПНА ДІЯ";

      desktopHintTitle.textContent =
        "Відкрийте «Комерційні пропозиції»";

      desktopHintText.textContent =
        "Програма відкривається як звичайний робочий застосунок і далі веде менеджера по процесу.";

      desktopExplainerTitle.textContent =
        "Пошта згорнута — робочий стіл залишився перед менеджером";

      desktopExplainerText.textContent =
        "Тепер він відкриває окрему програму «Комерційні пропозиції». Після цього сам вибирає імпорт із Outlook і потрібний лист.";

      taskbarOutlook?.classList.remove(
        "quote-mail-alert"
      );

      taskbarOffers?.classList.add(
        "quote-taskbar-next"
      );

      desktopOffersIcon?.classList.add(
        "quote-desktop-icon-main"
      );

      if (offersRecommendation) {
        offersRecommendation.hidden = false;
      }

      return;
    }

    if (step === 9) {
      desktopStageLabel.textContent =
        "WORKSTATION · OUTGOING EMAIL";

      desktopStageTitle.textContent =
        "Пропозицію збережено. Залишилось відправити лист клієнту";

      desktopStageDescription.textContent =
        "Поверніться до Outlook через нижню панель. Там уже підготовлено чернетку листа з фінальним PDF.";

      desktopHintLabel.textContent =
        "ГОТОВА ЧЕРНЕТКА";

      desktopHintTitle.textContent =
        "Відкрийте Outlook";

      desktopHintText.textContent =
        "У пошті вже підготовлено лист клієнту та прикріплено збережений PDF.";

      desktopExplainerTitle.textContent =
        "Фінальний крок знову відбувається у звичній пошті";

      desktopExplainerText.textContent =
        "Менеджер відкриває Outlook, перевіряє готову чернетку з PDF і натискає «Надіслати».";

      if (mailBadge) {
        mailBadge.hidden = false;
        mailBadge.textContent = "1";
      }

      taskbarOutlook?.classList.add(
        "quote-mail-alert"
      );

      taskbarOffers?.classList.remove(
        "quote-taskbar-next"
      );

      desktopOffersIcon?.classList.remove(
        "quote-desktop-icon-main"
      );

      if (offersRecommendation) {
        offersRecommendation.hidden = true;
      }
    }
  }

  function renderOpenedEmail() {
    desktopSession.activeApp =
      "outlook";

    desktopSession.openedMail =
      "freshmarket";

    desktopSession.mailRead =
      true;

    if (mailBadge) {
      mailBadge.hidden = true;
    }

    taskbarOutlook?.classList.remove(
      "quote-mail-alert"
    );

    desktopWindowIcon.textContent =
      "O";

    desktopWindowTitle.textContent =
      "Outlook · Request for quotation";

    desktopWindowBody.innerHTML = `
      <div class="quote-app-screen-head quote-opened-mail-head">
        <div>
          <span>OUTLOOK · MESSAGE</span>

          <strong>
            Request for quotation — juice assortment
          </strong>

          <small>
            FreshMarket Distribution GmbH ·
            23 Aug 2026 · 08:42
          </small>
        </div>

        <span class="quote-app-status-pill">
          READ
        </span>
      </div>

      <div class="quote-opened-mail-meta">
        <div>
          <small>From</small>
          <strong>purchasing@freshmarket.de</strong>
        </div>

        <div>
          <small>To</small>
          <strong>sales@freshdrinks.example</strong>
        </div>
      </div>

      <div class="quote-opened-mail-body">
        <p>Hello,</p>

        <p>
          Please provide your commercial offer
          for the following products:
        </p>

        <div class="quote-request-table">
          <div class="quote-request-row quote-request-head">
            <span>Product</span>
            <span>Pack</span>
            <span>Quantity</span>
          </div>

          <div class="quote-request-row">
            <span>Orange juice</span>
            <span>1 L carton</span>
            <span>12,000 pcs</span>
          </div>

          <div class="quote-request-row">
            <span>Apple juice</span>
            <span>1 L carton</span>
            <span>8,000 pcs</span>
          </div>

          <div class="quote-request-row">
            <span>Multivitamin juice</span>
            <span>0.2 L carton</span>
            <span>24,000 pcs</span>
          </div>

          <div class="quote-request-row">
            <span>Tomato juice</span>
            <span>1 L carton</span>
            <span>5,000 pcs</span>
          </div>
        </div>

        <p>
          Delivery address:<br>
          FreshMarket Distribution GmbH<br>
          Billstraße 120<br>
          20539 Hamburg, Germany
        </p>

        <p>
          Preferred delivery date:
          15 September 2026.
        </p>

        <p>
          Please include delivery cost
          and payment terms in the quotation.
        </p>

        <p>
          Best regards,<br>
          Anna Keller<br>
          Purchasing Department
        </p>
      </div>

      <div class="quote-mail-minimize-tip">
        <span>Лист прочитано ✓</span>

        <strong>
          Тепер згорніть Outlook кнопкою «−»
          у верхньому правому куті.
        </strong>
      </div>
    `;

    const minimizeButton =
      root.querySelector(
        '[data-window-action="minimize"]'
      );

    minimizeButton?.classList.add(
      "quote-window-control-next"
    );
  }

  function renderOutgoingDraft() {
    desktopSession.activeApp =
      "outlook";

    desktopWindowIcon.textContent =
      "O";

    desktopWindowTitle.textContent =
      "Outlook · New message";

    desktopWindowBody.innerHTML = `
      <div class="quote-app-screen-head">
        <div>
          <span>OUTLOOK · DRAFT</span>
          <strong>Готовий лист клієнту</strong>

          <small>
            PDF уже прикріплено з модуля
            «Комерційні пропозиції».
          </small>
        </div>

        <span class="quote-app-status-pill">
          DRAFT
        </span>
      </div>

      <div class="quote-email quote-email-outgoing quote-outgoing-in-window">
        <div class="quote-email-meta">
          <div>
            <small>To</small>
            <strong>
              purchasing@freshmarket.de
            </strong>
          </div>

          <div>
            <small>Subject</small>
            <strong>
              Commercial Offer Q-2026-00841
            </strong>
          </div>
        </div>

        <div class="quote-email-body">
          <p>Dear Anna,</p>

          <p>
            Thank you for your inquiry.
          </p>

          <p>
            Please find attached our commercial offer
            for the requested juice assortment.
          </p>

          <p>
            The quotation includes delivery to Hamburg
            and is valid for 30 days.
          </p>

          <p>
            Best regards,<br>
            Sebastian Perejra
          </p>
        </div>

        <div class="quote-email-attachment">
          <span>PDF</span>

          <div>
            <strong>
              Q-2026-00841_FreshMarket_Distribution.pdf
            </strong>

            <small>
              Commercial quotation · saved in module
            </small>
          </div>
        </div>
      </div>

      <button
        type="button"
        class="quote-primary-action quote-next-action"
        id="quote-send-email"
      >
        Надіслати комерційну пропозицію
      </button>

      <div
        class="quote-complete"
        id="quote-complete"
        hidden
      >
        <span>✓</span>

        <div>
          <strong>
            Commercial offer sent
          </strong>

          <p>
            Запит клієнта пройшов повний шлях —
            від нового листа на робочому столі
            до збереженої та відправленої PDF-пропозиції.
          </p>

          <button
            type="button"
            class="quote-secondary-action"
            id="quote-try-again"
          >
            Спробувати ще раз
          </button>
        </div>
      </div>
    `;
  }

  function renderNewOfferStart() {
    desktopWindowBody.innerHTML = `
      <div class="quote-app-screen-head">
        <div>
          <span>NEW QUOTATION</span>
          <strong>
            Звідки взяти запит клієнта?
          </strong>

          <small>
            Програма нічого не підставляє сама.
            Менеджер обирає джерело запиту.
          </small>
        </div>

        <span class="quote-app-status-pill">
          STEP 1
        </span>
      </div>

      <div class="quote-import-choice">
        <button
          type="button"
          class="quote-import-option quote-import-option-main"
          id="quote-import-email"
        >
          <span>OUTLOOK</span>

          <strong>
            Імпортувати запит з email
          </strong>

          <small>
            Показати доступні листи
            з підключеної корпоративної пошти.
          </small>
        </button>

        <button
          type="button"
          class="quote-import-option"
          id="quote-create-manual"
        >
          <span>MANUAL</span>

          <strong>
            Створити вручну
          </strong>

          <small>
            Якщо запит отримано телефоном,
            у месенджері або іншим способом.
          </small>
        </button>
      </div>

      <div class="quote-integration-note">
        <span>Як це працює?</span>

        <p>
          У цьому прикладі програма підключена
          до корпоративного Outlook.
          Вона бачить лише доступну менеджеру
          поштову скриньку після дозволеного підключення.
          Лист потрапить у пропозицію тільки після того,
          як менеджер сам його вибере.
        </p>
      </div>
    `;
  }

  function renderEmailImportList() {
    desktopWindowBody.innerHTML = `
      <div class="quote-app-screen-head">
        <div>
          <span>OUTLOOK CONNECTION</span>

          <strong>
            Оберіть лист, з якого створити пропозицію
          </strong>

          <small>
            Підключено:
            sales@freshdrinks.example · Microsoft 365
          </small>
        </div>

        <span class="quote-app-status-pill">
          CONNECTED
        </span>
      </div>

      <div class="quote-import-toolbar">
        <span>Вхідні · сьогодні</span>
        <strong>3 листи</strong>
      </div>

      <div class="quote-import-mail-list">
        <button
          type="button"
          class="quote-import-mail quote-import-mail-main"
          data-import-mail="freshmarket"
        >
          <span class="quote-import-mail-time">
            08:42
          </span>

          <div>
            <strong>
              FreshMarket Distribution GmbH
            </strong>

            <span>
              Request for quotation — juice assortment
            </span>

            <small>
              purchasing@freshmarket.de
            </small>
          </div>

          <i>RFQ</i>
        </button>

        <button
          type="button"
          class="quote-import-mail"
          data-import-mail="logistics"
        >
          <span class="quote-import-mail-time">
            08:17
          </span>

          <div>
            <strong>Logistics Team</strong>
            <span>Hamburg delivery slots</span>

            <small>
              logistics@freshdrinks.example
            </small>
          </div>

          <i>INFO</i>
        </button>

        <button
          type="button"
          class="quote-import-mail"
          data-import-mail="production"
        >
          <span class="quote-import-mail-time">
            07:55
          </span>

          <div>
            <strong>
              Production Planning
            </strong>

            <span>
              Weekly availability update
            </span>

            <small>
              planning@freshdrinks.example
            </small>
          </div>

          <i>INFO</i>
        </button>
      </div>

      <button
        type="button"
        class="quote-secondary-action quote-import-back"
        id="quote-import-back"
      >
        Назад
      </button>
    `;
  }

  function renderWrongEmail() {
    desktopWindowBody.innerHTML = `
      <div class="quote-app-screen-head">
        <div>
          <span>NOT AN RFQ</span>

          <strong>
            Цей лист не схожий на запит клієнта
          </strong>

          <small>
            Оберіть лист із запитом
            на комерційну пропозицію.
          </small>
        </div>

        <span class="quote-app-status-pill">
          SKIPPED
        </span>
      </div>

      <div class="quote-import-warning">
        <span>!</span>

        <div>
          <strong>
            Дані не імпортовано
          </strong>

          <p>
            Лист не містить запиту на товари,
            кількість і комерційні умови.
          </p>
        </div>
      </div>

      <button
        type="button"
        class="quote-primary-action"
        id="quote-import-email"
      >
        Повернутися до списку листів
      </button>
    `;
  }

  function renderEmailAnalysis() {
    desktopWindowBody.innerHTML = `
      <div class="quote-app-screen-head">
        <div>
          <span>IMPORT FROM OUTLOOK</span>

          <strong>
            Розбираємо вибраний лист
          </strong>

          <small>
            FreshMarket Distribution GmbH · 08:42
          </small>
        </div>

        <span class="quote-app-status-pill">
          READING
        </span>
      </div>

      <div
        class="quote-import-analysis"
        id="quote-import-analysis"
      >
        <div data-import-state="sender">
          <span>○</span>
          <strong>Визначаємо клієнта</strong>
          <small>
            FreshMarket Distribution GmbH
          </small>
        </div>

        <div data-import-state="products">
          <span>○</span>
          <strong>
            Читаємо запитані товари
          </strong>
          <small>4 позиції</small>
        </div>

        <div data-import-state="delivery">
          <span>○</span>
          <strong>
            Зчитуємо адресу та дату доставки
          </strong>
          <small>
            Hamburg · 15.09.2026
          </small>
        </div>

        <div data-import-state="terms">
          <span>○</span>
          <strong>
            Фіксуємо додаткові умови
          </strong>
          <small>
            Delivery cost · payment terms
          </small>
        </div>
      </div>

      <div
        class="quote-import-result"
        id="quote-import-result"
        hidden
      >
        <div class="quote-import-result-head">
          <span>✓</span>

          <div>
            <strong>
              Запит імпортовано з Outlook
            </strong>

            <small>
              Тепер дані можна перевірити
              та доповнити у процесі підготовки пропозиції.
            </small>
          </div>
        </div>

        <div class="quote-import-summary">
          <div>
            <small>Клієнт</small>
            <strong>
              FreshMarket Distribution GmbH
            </strong>
          </div>

          <div>
            <small>Позиції</small>
            <strong>4 товари</strong>
          </div>

          <div>
            <small>Доставка</small>
            <strong>Hamburg, Germany</strong>
          </div>

          <div>
            <small>Дата</small>
            <strong>15 Sep 2026</strong>
          </div>
        </div>

        <button
          type="button"
          class="quote-primary-action quote-next-action"
          id="quote-confirm-import"
        >
          Продовжити підготовку пропозиції
        </button>
      </div>
    `;

    const analysisItems = [
      ...desktopWindowBody.querySelectorAll(
        "[data-import-state]"
      )
    ];

    const importResult =
      desktopWindowBody.querySelector(
        "#quote-import-result"
      );

    const importStatus =
      desktopWindowBody.querySelector(
        ".quote-app-status-pill"
      );

    analysisItems.forEach(
      (item, index) => {
        setTimeout(() => {
          item.classList.add(
            "done"
          );

          const icon =
            item.querySelector(
              "span"
            );

          if (icon) {
            icon.textContent =
              "✓";
          }

          if (
            index ===
            analysisItems.length - 1
          ) {
            setTimeout(() => {
              if (importResult) {
                importResult.hidden =
                  false;
              }

              if (importStatus) {
                importStatus.textContent =
                  "IMPORTED";
              }
            }, 350);
          }
        }, 430 * (index + 1));
      }
    );
  }

  function openDesktopApp(appName) {
    const app =
      desktopApps[appName];

    if (!app || !desktopWindow) {
      return;
    }

    desktopSession.activeApp =
      appName;

    desktopWindowIcon.textContent =
      app.icon;

    desktopWindowTitle.textContent =
      app.title;

    if (
      appName === "outlook" &&
      state.step === 9
    ) {
      renderOutgoingDraft();
    } else {
      desktopWindowBody.innerHTML =
        app.render();
    }

    desktopWindow.hidden =
      false;

    root.querySelectorAll(
      "[data-window-action]"
    ).forEach(button => {
      button.classList.remove(
        "quote-window-control-next"
      );
    });

    desktopWindow.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  }

  function closeDesktopWindow() {
    if (!desktopWindow) {
      return;
    }

    desktopWindow.hidden =
      true;
  }

  function minimizeDesktopWindow() {
    if (!desktopWindow) {
      return;
    }

    desktopWindow.hidden =
      true;

    root.querySelectorAll(
      "[data-window-action]"
    ).forEach(button => {
      button.classList.remove(
        "quote-window-control-next"
      );
    });

    if (
      state.step === 1 &&
      desktopSession.activeApp === "outlook" &&
      desktopSession.mailRead
    ) {
      desktopSession.workspaceUnlocked =
        true;

      showStep(
        2,
        "auto"
      );
    }
  }

  function money(value) {
    const currency =
      currencySelect?.value ||
      "EUR";

    const symbol =
      currency === "USD"
        ? "$"
        : "€";

    return `${symbol}${Number(value || 0).toLocaleString(
      "en-US",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    )}`;
  }

  function showStep(
    step,
    scrollBehavior = "smooth"
  ) {
    state.step =
      step;

    panels.forEach(panel => {
      const panelStep =
        Number(
          panel.dataset.quotePanel
        );

      const aliases =
        (
          panel.dataset.quotePanelAlias ||
          ""
        )
          .split(",")
          .map(
            value =>
              Number(
                value.trim()
              )
          )
          .filter(
            Number.isFinite
          );

      const isActive =
        panelStep === step ||
        aliases.includes(step);

      panel.hidden =
        !isActive;

      panel.classList.toggle(
        "active",
        isActive
      );
    });

    flowSteps.forEach(item => {
      const itemStep =
        Number(
          item.dataset.quoteStep
        );

      item.classList.toggle(
        "active",
        itemStep === step
      );

      item.classList.toggle(
        "done",
        itemStep < step
      );
    });

    stepCounter.textContent =
      `${step} / 9`;

    if (
      step === 1 ||
      step === 2 ||
      step === 9
    ) {
      setDesktopStage(step);
    }

    const activePanel =
      panels.find(panel => {
        const panelStep =
          Number(
            panel.dataset.quotePanel
          );

        const aliases =
          (
            panel.dataset.quotePanelAlias ||
            ""
          )
            .split(",")
            .map(
              value =>
                Number(
                  value.trim()
                )
            )
            .filter(
              Number.isFinite
            );

        return (
          panelStep === step ||
          aliases.includes(step)
        );
      });

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
    transitionTitle.textContent =
      title;

    transitionText.textContent =
      text;

    transitionLayer.hidden =
      false;

    setTimeout(() => {
      transitionLayer.hidden =
        true;

      showStep(step);
    }, delay);
  }

  function selectSystem(
    buttons,
    activeButton
  ) {
    buttons.forEach(button => {
      button.classList.toggle(
        "selected",
        button === activeButton
      );
    });
  }

  function setupCustomerSource(
    source,
    button
  ) {
    state.customerSource =
      source;

    selectSystem(
      customerSourceButtons,
      button
    );

    customerSearch.hidden =
      false;

    customerResult.hidden =
      true;

    newCustomerForm.hidden =
      true;

    const sourceInfo =
      customerSources[source];

    customerQuery.value =
      "FreshMarket Distribution GmbH";

    customerQuery.placeholder =
      sourceInfo.detail;

    findCustomerButton.textContent =
      `Знайти у ${sourceInfo.title}`;

    customerSearch.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  }

  function findCustomer() {
    const query =
      customerQuery.value
        .trim()
        .toLowerCase();

    if (!query) {
      return;
    }

    const knownCustomer =
      query.includes(
        "freshmarket"
      ) ||
      query.includes(
        "fresh market"
      );

    if (knownCustomer) {
      state.customerMode =
        "existing";

      customerResult.hidden =
        false;

      newCustomerForm.hidden =
        true;

      const stateLabel =
        customerResult.querySelector(
          ".quote-result-state"
        );

      stateLabel.textContent =
        `MATCH FOUND · ${customerSources[state.customerSource].title}`;

      customerResult.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });

      return;
    }

    customerResult.hidden =
      true;

    newCustomerForm.hidden =
      false;

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
    state.customerMode =
      "existing";

    transitionToStep(
      4,
      "Клієнта ідентифіковано",
      "Реквізити та комерційні умови завантажено з обраного джерела."
    );
  }

  function showNewCustomer() {
    state.customerMode =
      "new";

    customerResult.hidden =
      true;

    newCustomerForm.hidden =
      false;

    newCustomerForm.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  }

  function saveNewCustomer() {
    const fields = [
      ...newCustomerForm.querySelectorAll(
        "input, select"
      )
    ];

    state.customer = {
      name:
        fields[0]?.value ||
        "New customer",

      contact:
        fields[1]?.value ||
        "",

      email:
        fields[2]?.value ||
        "",

      vat:
        fields[3]?.value ||
        "",

      country:
        fields[4]?.value ||
        "",

      currency:
        fields[5]?.value ||
        "EUR",

      id:
        "NEW-1087",

      paymentTerms:
        "30 days",

      city:
        deliveryCity?.value ||
        ""
    };

    const builderCustomer =
      root.querySelector(
        "#quote-builder-customer-name"
      );

    if (builderCustomer) {
      builderCustomer.textContent =
        state.customer.name;
    }

    transitionToStep(
      4,
      "Картку клієнта створено",
      "Дані клієнта готові для використання у комерційній пропозиції."
    );
  }

  function setupProductSource(
    source,
    button
  ) {
    state.productSource =
      source;

    selectSystem(
      productSourceButtons,
      button
    );

    productBrowser.hidden =
      false;

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
        productData[
          row.dataset.product
        ];

      const haystack =
        `${data.sku} ${data.name} ${data.pack}`
          .toLowerCase();

      row.hidden =
        Boolean(query) &&
        !haystack.includes(query);
    });
  }

  function addProduct(
    productId,
    button
  ) {
    if (
      state.selectedProducts.some(
        item =>
          item.id === productId
      )
    ) {
      return;
    }

    const source =
      productData[productId];

    state.selectedProducts.push({
      id: productId,
      sku: source.sku,
      name: source.name,
      pack: source.pack,
      quantity:
        source.requestedQty,
      price:
        source.price,
      discount:
        0
    });

    button.textContent =
      "Додано ✓";

    button.disabled =
      true;

    productsReadyButton.hidden =
      false;
  }

  function renderBuilder() {
    builderTable
      .querySelectorAll(
        ".quote-builder-item"
      )
      .forEach(
        row => {
          row.remove();
        }
      );

    state.selectedProducts.forEach(
      (item, index) => {
        const row =
          document.createElement(
            "div"
          );

        row.className =
          "quote-builder-row quote-builder-item";

        row.dataset.productIndex =
          index;

        row.innerHTML = `
          <span>
            ${item.sku}
          </span>

          <span>
            <strong>
              ${item.name}
            </strong>
            <br>
            <small>
              ${item.pack}
            </small>
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

          <strong
            class="quote-builder-line-total"
          >
            ${money(
              item.quantity *
              item.price *
              (
                1 -
                item.discount / 100
              )
            )}
          </strong>
        `;

        builderTable.appendChild(
          row
        );

        const inputs = [
          ...row.querySelectorAll(
            "input"
          )
        ];

        inputs.forEach(input => {
          input.addEventListener(
            "input",
            updateBuilderFromInputs
          );
        });
      }
    );

    const builderCustomer =
      root.querySelector(
        "#quote-builder-customer-name"
      );

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
        Number(
          row.dataset.productIndex
        );

      const item =
        state.selectedProducts[
          index
        ];

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

      item.quantity =
        qty;

      item.price =
        price;

      item.discount =
        discount;

      const lineTotal =
        qty *
        price *
        (
          1 -
          discount / 100
        );

      row.querySelector(
        ".quote-builder-line-total"
      ).textContent =
        money(lineTotal);
    });

    updateTotals();
  }

  function getTotals() {
    let subtotal =
      0;

    let discount =
      0;

    state.selectedProducts.forEach(
      item => {
        const base =
          item.quantity *
          item.price;

        const discountValue =
          base *
          (
            item.discount /
            100
          );

        subtotal +=
          base;

        discount +=
          discountValue;
      }
    );

    return {
      subtotal,
      discount,
      productsTotal:
        subtotal -
        discount
    };
  }

  function updateTotals() {
    const totals =
      getTotals();

    subtotalElement.textContent =
      money(
        totals.subtotal
      );

    discountTotalElement.textContent =
      `-${money(
        totals.discount
      )}`;

    grandTotalElement.textContent =
      money(
        totals.productsTotal
      );
  }

  function showBuilder() {
    renderBuilder();

    transitionToStep(
      5,
      "Позиції зібрано",
      "Номенклатура та базові ціни перенесені до quotation builder."
    );
  }

  function returnToProducts() {
    showStep(4);

    productBrowser.hidden =
      false;

    productsReadyButton.hidden =
      state.selectedProducts.length ===
      0;
  }

  function prepareDocument() {
    documentLines.innerHTML =
      "";

    state.selectedProducts.forEach(
      item => {
        const row =
          document.createElement(
            "div"
          );

        const total =
          item.quantity *
          item.price *
          (
            1 -
            item.discount / 100
          );

        row.className =
          "quote-document-row";

        row.innerHTML = `
          <span>
            <strong>
              ${item.name}
            </strong>
            <br>
            ${item.pack}
            <br>
            <small>
              ${item.sku}
            </small>
          </span>

          <span>
            ${item.quantity.toLocaleString(
              "en-US"
            )}
          </span>

          <span>
            ${money(
              item.price
            )}
          </span>

          <strong>
            ${money(total)}
          </strong>
        `;

        documentLines.appendChild(
          row
        );
      }
    );

    const totals =
      getTotals();

    const deliveryCost =
      Number(
        deliveryCostInput.value
      ) || 0;

    documentProductsTotal.textContent =
      money(
        totals.productsTotal
      );

    documentDelivery.textContent =
      money(
        deliveryCost
      );

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
    generationStatus.hidden =
      true;

    pdfResult.hidden =
      true;

    generationStates.forEach(
      item => {
        item.classList.remove(
          "done"
        );

        const icon =
          item.querySelector(
            "span"
          );

        if (icon) {
          icon.textContent =
            "○";
        }
      }
    );

    generatePdfButton.disabled =
      false;

    generatePdfButton.textContent =
      "Сформувати PDF";
  }

  function runPdfGeneration() {
    resetGeneration();

    generationStatus.hidden =
      false;

    generatePdfButton.disabled =
      true;

    generatePdfButton.textContent =
      "Формування...";

    generationStates.forEach(
      (item, index) => {
        setTimeout(() => {
          item.classList.add(
            "done"
          );

          const icon =
            item.querySelector(
              "span"
            );

          if (icon) {
            icon.textContent =
              "✓";
          }

          if (
            index ===
            generationStates.length -
            1
          ) {
            setTimeout(() => {
              pdfResult.hidden =
                false;

              pdfResult.classList.add(
                "is-ready"
              );

              generatePdfButton.textContent =
                "PDF готовий ✓";

              previewPdfButton.classList.add(
                "quote-next-action"
              );

              previewPdfButton.textContent =
                "Відкрити PDF";

              pdfResult.scrollIntoView({
                behavior:
                  "smooth",
                block:
                  "center"
              });
            }, 350);
          }
        }, 520 * (index + 1));
      }
    );
  }

  function previewDocument() {
    const sourceDocument =
      root.querySelector(
        "#quote-document"
      );

    if (!sourceDocument) {
      return;
    }

    documentModal.innerHTML =
      sourceDocument.innerHTML;

    pdfModal.hidden =
      false;

    previewPdfButton.classList.remove(
      "quote-next-action"
    );

    document.body.style.overflow =
      "hidden";
  }

  function closePdfModal() {
    pdfModal.hidden =
      true;

    document.body.style.overflow =
      "";
  }

  function approvePdf() {
    closePdfModal();

    transitionToStep(
      8,
      "Комерційну пропозицію перевірено",
      "PDF підтверджено. Тепер збережемо пропозицію у модулі «Комерційні пропозиції».",
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
      if (
        event.target ===
        pdfModal
      ) {
        closePdfModal();
      }
    }
  );

  function saveOffer() {
    if (!saveOfferButton) {
      return;
    }

    saveOfferButton.disabled =
      true;

    saveOfferButton.textContent =
      "Збереження...";

    saveOfferButton.classList.remove(
      "quote-next-action"
    );

    saveStatus.hidden =
      false;

    storageResult.hidden =
      true;

    storageReadyButton.hidden =
      true;

    saveStates.forEach(item => {
      item.classList.remove(
        "done"
      );

      const icon =
        item.querySelector(
          "span"
        );

      if (icon) {
        icon.textContent =
          "○";
      }
    });

    saveStates.forEach(
      (item, index) => {
        setTimeout(() => {
          item.classList.add(
            "done"
          );

          const icon =
            item.querySelector(
              "span"
            );

          if (icon) {
            icon.textContent =
              "✓";
          }

          if (
            index ===
            saveStates.length - 1
          ) {
            setTimeout(() => {
              saveOfferButton.textContent =
                "Збережено ✓";

              storageResult.hidden =
                false;

              storageReadyButton.hidden =
                false;

              storageReadyButton.classList.add(
                "quote-next-action"
              );

              storageResult.scrollIntoView({
                behavior:
                  "smooth",
                block:
                  "nearest"
              });
            }, 300);
          }
        }, 480 * (index + 1));
      }
    );
  }

  function sendQuotation() {
    const sendEmailButton =
      desktopWindowBody.querySelector(
        "#quote-send-email"
      );

    const completeBlock =
      desktopWindowBody.querySelector(
        "#quote-complete"
      );

    if (
      !sendEmailButton ||
      !completeBlock
    ) {
      return;
    }

    sendEmailButton.disabled =
      true;

    sendEmailButton.textContent =
      "Надсилання...";

    setTimeout(() => {
      sendEmailButton.textContent =
        "Надіслано ✓";

      completeBlock.hidden =
        false;

      flowSteps.forEach(item => {
        item.classList.remove(
          "active"
        );

        item.classList.add(
          "done"
        );
      });

      stepCounter.textContent =
        "9 / 9";

      taskbarOutlook?.classList.remove(
        "quote-mail-alert"
      );

      if (mailBadge) {
        mailBadge.hidden =
          true;
      }

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

      customer: {
        name:
          "FreshMarket Distribution GmbH",

        id:
          "DE-10482",

        vat:
          "DE349827156",

        currency:
          "EUR",

        paymentTerms:
          "30 days",

        country:
          "Germany",

        city:
          "Hamburg"
      }
    };

    customerSourceButtons.forEach(
      button => {
        button.classList.remove(
          "selected"
        );
      }
    );

    productSourceButtons.forEach(
      button => {
        button.classList.remove(
          "selected"
        );
      }
    );

    customerSearch.hidden =
      true;

    customerResult.hidden =
      true;

    newCustomerForm.hidden =
      true;

    customerQuery.value =
      "FreshMarket Distribution GmbH";

    productBrowser.hidden =
      true;

    productSearch.value =
      "";

    productRows.forEach(row => {
      row.hidden =
        false;

      const button =
        row.querySelector(
          "button"
        );

      if (button) {
        button.disabled =
          false;

        button.textContent =
          "Додати";
      }
    });

    productsReadyButton.hidden =
      true;

    builderTable
      .querySelectorAll(
        ".quote-builder-item"
      )
      .forEach(row => {
        row.remove();
      });

    currencySelect.value =
      "EUR";

    paymentTermsSelect.value =
      "30 days";

    validitySelect.value =
      "30 days";

    subtotalElement.textContent =
      "€0.00";

    discountTotalElement.textContent =
      "€0.00";

    grandTotalElement.textContent =
      "€0.00";

    deliveryCountry.value =
      "Germany";

    deliveryCity.value =
      "Hamburg";

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

    documentLines.innerHTML =
      "";

    documentProductsTotal.textContent =
      "€0.00";

    documentDelivery.textContent =
      "€420.00";

    documentTotal.textContent =
      "€0.00";

    documentPayment.textContent =
      "30 days";

    documentIncoterms.textContent =
      "DAP Hamburg";

    documentAddress.textContent =
      "Billstraße 120, 20539 Hamburg, Germany";

    resetGeneration();

    pdfResult.classList.remove(
      "is-ready"
    );

    previewPdfButton.classList.remove(
      "quote-next-action"
    );

    previewPdfButton.textContent =
      "Preview";

    saveStatus.hidden =
      true;

    saveStates.forEach(item => {
      item.classList.remove(
        "done"
      );

      const icon =
        item.querySelector(
          "span"
        );

      if (icon) {
        icon.textContent =
          "○";
      }
    });

    saveOfferButton.disabled =
      false;

    saveOfferButton.textContent =
      "Зберегти пропозицію";

    saveOfferButton.classList.add(
      "quote-next-action"
    );

    storageResult.hidden =
      true;

    storageReadyButton.hidden =
      true;

    storageReadyButton.classList.remove(
      "quote-next-action"
    );

    desktopSession.activeApp =
      "";

    desktopSession.openedMail =
      "";

    desktopSession.mailRead =
      false;

    desktopSession.workspaceUnlocked =
      false;

    desktopSession.outgoingReady =
      false;

    if (mailBadge) {
      mailBadge.hidden =
        false;

      mailBadge.textContent =
        "1";
    }

    transitionLayer.hidden =
      true;

    closeDesktopWindow();
    closePdfModal();

    showStep(
      1,
      "auto"
    );

    root.scrollIntoView({
      behavior: "auto",
      block: "start"
    });
  }

  desktopAppButtons.forEach(
    button => {
      button.addEventListener(
        "click",
        () => {
          openDesktopApp(
            button.dataset.desktopApp
          );
        }
      );
    }
  );

  desktopWindowActions.forEach(
    button => {
      button.addEventListener(
        "click",
        () => {
          if (
            button.dataset.windowAction ===
            "minimize"
          ) {
            minimizeDesktopWindow();
            return;
          }

          closeDesktopWindow();
        }
      );
    }
  );

  desktop?.addEventListener(
    "click",
    event => {
      const outlookMailButton =
        event.target.closest(
          "[data-outlook-mail]"
        );

      const newOfferButton =
        event.target.closest(
          "#quote-open-new-offer"
        );

      const importEmailButton =
        event.target.closest(
          "#quote-import-email"
        );

      const manualButton =
        event.target.closest(
          "#quote-create-manual"
        );

      const backButton =
        event.target.closest(
          "#quote-import-back"
        );

      const mailButton =
        event.target.closest(
          "[data-import-mail]"
        );

      const confirmImportButton =
        event.target.closest(
          "#quote-confirm-import"
        );

      const sendButton =
        event.target.closest(
          "#quote-send-email"
        );

      const tryAgain =
        event.target.closest(
          "#quote-try-again"
        );

      if (outlookMailButton) {
        if (
          outlookMailButton.dataset.outlookMail ===
          "freshmarket"
        ) {
          renderOpenedEmail();
        }

        return;
      }

      if (newOfferButton) {
        renderNewOfferStart();
        return;
      }

      if (importEmailButton) {
        renderEmailImportList();
        return;
      }

      if (backButton) {
        renderNewOfferStart();
        return;
      }

      if (mailButton) {
        if (
          mailButton.dataset.importMail ===
          "freshmarket"
        ) {
          renderEmailAnalysis();
        } else {
          renderWrongEmail();
        }

        return;
      }

      if (manualButton) {
        transitionToStep(
          3,
          "Створено порожню пропозицію",
          "Запит буде внесено вручну. Починаємо з ідентифікації клієнта.",
          900
        );

        return;
      }

      if (confirmImportButton) {
        transitionToStep(
          3,
          "Запит імпортовано з Outlook",
          "Клієнта, позиції, адресу та дату зчитано з вибраного листа. Тепер перевіримо картку клієнта.",
          1000
        );

        return;
      }

      if (sendButton) {
        sendQuotation();
        return;
      }

      if (tryAgain) {
        resetCase();
      }
    }
  );

  customerSourceButtons.forEach(
    button => {
      button.addEventListener(
        "click",
        () => {
          setupCustomerSource(
            button.dataset.customerSource,
            button
          );
        }
      );
    }
  );

  findCustomerButton.addEventListener(
    "click",
    findCustomer
  );

  customerQuery.addEventListener(
    "keydown",
    event => {
      if (
        event.key ===
        "Enter"
      ) {
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

  productSourceButtons.forEach(
    button => {
      button.addEventListener(
        "click",
        () => {
          setupProductSource(
            button.dataset.productSource,
            button
          );
        }
      );
    }
  );

  productSearch.addEventListener(
    "input",
    filterProducts
  );

  productRows.forEach(
    row => {
      const button =
        row.querySelector(
          "button"
        );

      button.addEventListener(
        "click",
        () => {
          addProduct(
            row.dataset.product,
            button
          );
        }
      );
    }
  );

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
        6,
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
  ].forEach(
    field => {
      field.addEventListener(
        "change",
        prepareDocument
      );
    }
  );

  deliveryReadyButton.addEventListener(
    "click",
    () => {
      prepareDocument();
      resetGeneration();

      transitionToStep(
        7,
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

  saveOfferButton.addEventListener(
    "click",
    saveOffer
  );

  storageReadyButton.addEventListener(
    "click",
    () => {
      desktopSession.outgoingReady =
        true;

      closeDesktopWindow();

      transitionToStep(
        9,
        "Пропозицію збережено у модулі",
        "Повертаємось на робочий стіл. В Outlook уже підготовлено чернетку листа з фінальним PDF.",
        1000
      );
    }
  );

  flowSteps.forEach(item => {
    item.addEventListener(
      "click",
      () => {
        const target =
          Number(
            item.dataset.quoteStep
          );

        if (
          target <=
          state.step
        ) {
          showStep(
            target
          );
        }
      }
    );
  });

  showStep(1);
})();
