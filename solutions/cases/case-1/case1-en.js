const bankRows = [
  ["03.07.2026", "CARD*4821 POS 19:44 NOVUS KYIV UA MCC5411 REF 884521", "-1 286,40", "NOVUS", "Groceries", "ok"],
  ["03.07.2026", "UAH KOM 0.00 / PEREKAZ Z KARTY 5168****1047 VID IVANENKO O.O.", "+12 500,00", "Ivanenko O.O.", "Incoming payment", "ok"],
  ["04.07.2026", "MONO PAY*GOOGLE ADS 874201 IE DUBLIN IRL 04/07", "-2 940,18", "Google Ads", "Advertising", "ok"],
  ["04.07.2026", "PLATIZH ZA RAH 1048-26 TOV VEKTOR SERVIS BEZ PDV", "-7 200,00", "Vektor Service LLC", "Services", "ok"],
  ["05.07.2026", "ATM CASH WD 005771 KYIV PR-T PEREMOHY 12 KOM 80.00", "-4 000,00", "ATM", "Cash withdrawal", "ok"],
  ["05.07.2026", "NOVA POSHTA 02041 KYIV TERMINAL 330192 MCC4215", "-486,00", "Nova Poshta", "Logistics", "ok"],
  ["06.07.2026", "EPICENTR K POS 8871 BUD MATERIALY CHECK 001947", "-3 742,90", "Epicentr", "Operating supplies", "ok"],
  ["06.07.2026", "P2P CREDIT 4149****7720 KOVALENKO SERHII D.", "+8 000,00", "Kovalenko S.D.", "Incoming payment", "ok"],
  ["07.07.2026", "FOP MELNYK O.V. RAH 708 OPлата za druk etyketok", "-5 600,00", "FOP Melnyk O.V.", "Printing", "ok"],
  ["07.07.2026", "UBER *TRIP HELP.UBER.COM NL 07-07 AUTH 102944", "-318,72", "Uber", "Transport", "ok"],
  ["08.07.2026", "VAT PAYMENT 2 KV 2026 EDPR 3011400000 PRYZN 101", "-18 760,00", "State Tax Service of Ukraine", "Taxes", "ok"],
  ["08.07.2026", "ROZETKA UA KYIV ORDER RZK-4938172 OFFICE MOUSE", "-1 149,00", "Rozetka", "Office expenses", "ok"],
  ["09.07.2026", "APPLE.COM/BILL 800-275-2273 IRL ICLOUD+ 200GB", "-149,00", "Apple", "Subscriptions", "ok"],
  ["09.07.2026", "TOV MHP POSTACHANNYA ZA DOG 14/26 RAH 553", "+34 980,00", "MHP LLC", "Customer payment", "ok"],
  ["10.07.2026", "WOG A-95 31.42L ST 083 KYIV OBL TERM 774912", "-1 842,65", "WOG", "Fuel", "ok"],
  ["10.07.2026", "FOP PETRENKO A.A. AVANS ZA DIZAYN MAKETIV", "-3 000,00", "FOP Petrenko A.A.", "Design", "ok"],
  ["11.07.2026", "SILPO 118 POS 2881 MCC 5411 KYIV 11.07.26", "-947,31", "Silpo", "Groceries", "ok"],
  ["11.07.2026", "PRIVAT24 KOMISIYA ZA RKO TARIF BUSINESS", "-199,00", "PrivatBank", "Bank fees", "ok"],
  ["12.07.2026", "TOV NOVA LINIYA CHECK 62287 INSTRUMENTY SKLAD", "-2 386,50", "Nova Liniya", "Operating supplies", "ok"],
  ["12.07.2026", "PEREKAZ VID TOV ALFA TRADE RAH 204 POSLUGY", "+21 400,00", "Alfa Trade LLC", "Customer payment", "ok"],
  ["13.07.2026", "MICROSOFT*SUBSCRIPTION MSFT IE M365 BUSINESS", "-512,40", "Microsoft", "Subscriptions", "ok"],
  ["13.07.2026", "BOLT.EU/R/240713 KYIV UA RIDE 229184", "-204,00", "Bolt", "Transport", "ok"],
  ["14.07.2026", "PAYMENT TO FOP BONDARENKO V.V. HOSTING 1 YEAR", "-2 100,00", "FOP Bondarenko V.V.", "Hosting", "ok"],
  ["14.07.2026", "CREDIT P2P 5355****8802 SHEVCHENKO N.M.", "+5 000,00", "Shevchenko N.M.", "Incoming payment", "ok"],
  ["15.07.2026", "KYIVSTAR B2B INV 726193 TEL +380980746698", "-450,00", "Kyivstar", "Telecommunications", "ok"],
  ["15.07.2026", "PROM.UA ORDER 883420 PACKING TAPE 48MM 36PCS", "-1 764,00", "Prom.ua", "Packaging materials", "ok"],
  ["16.07.2026", "UKRPOSHTA VIDPR 18 POSHLYNA TRACK RR004891UA", "-392,80", "Ukrposhta", "Logistics", "ok"],
  ["16.07.2026", "TOV BETA LOGISTICS RAH 912 DOSTAVKA 14.07", "-6 480,00", "Beta Logistics LLC", "Logistics", "ok"],
  ["17.07.2026", "AMAZON WEB SERVICES AWS EMEA INV 994-20817", "-873,44", "Amazon Web Services", "Cloud services", "ok"],
  ["17.07.2026", "PEREKAZ VID FOP KLYMENKO O.P. CONSULTING JULY", "+9 600,00", "FOP Klymenko O.P.", "Customer payment", "ok"],
  ["18.07.2026", "METRO CASH&CARRY 0184 KYIV OFFICE WATER COFFEE", "-1 328,16", "METRO", "Office expenses", "ok"],
  ["18.07.2026", "GOOGLE*WORKSPACE G.CO/HELPPAY# IE 18JUL", "-772,22", "Google Workspace", "Subscriptions", "ok"],
  ["19.07.2026", "FOP ROMANENKO S.S. REMONT PRINTERA RAH 91", "-1 250,00", "FOP Romanenko S.S.", "Repairs", "ok"],
  ["19.07.2026", "MONOBANK REWARD CASHBACK JUL 2026", "+184,37", "Monobank", "Cashback", "ok"],
  ["20.07.2026", "OKKO POS 7081 DIESEL 38.20L TERM 811294", "-2 121,48", "OKKO", "Fuel", "ok"],
  ["20.07.2026", "CANVA*PRO SYDNEY AU CARD 4821 MONTHLY", "-499,00", "Canva", "Subscriptions", "ok"],
  ["21.07.2026", "TOV GAMMA PACK RAH 772 KARTONNI KOROBKY 500PCS", "-14 850,00", "Gamma Pack LLC", "Packaging materials", "ok"],
  ["21.07.2026", "PEREKAZ ZA DOG 18-07 TOV DELTA PLUS", "+18 900,00", "Delta Plus LLC", "Customer payment", "ok"],
  ["22.07.2026", "LIFECELL BUSINESS ACC 380630001122 JULY", "-310,00", "Lifecell", "Telecommunications", "ok"],
  ["22.07.2026", "FOP HRITSENKO M.I. BUHG POSLUGY 07/2026", "-4 500,00", "FOP Hritsenko M.I.", "Accounting", "ok"],
  ["23.07.2026", "ZOOM.US 888-799-9666 SAN JOSE US PRO PLAN", "-611,74", "Zoom", "Subscriptions", "ok"],
  ["23.07.2026", "P2P CREDIT 5457****1409 TKACHENKO VIKTOR", "+2 500,00", "Tkachenko V.", "Incoming payment", "ok"],
  ["24.07.2026", "AUTOLUX CARGO KYIV ODESA TTN 7749201", "-786,00", "Autolux", "Logistics", "ok"],
  ["24.07.2026", "EPICENTR K POS 1091 LED LAMPS CABLE CHECK 729", "-1 093,55", "Epicentr", "Operating supplies", "ok"],
  ["25.07.2026", "FOP LISOVYI D.P. TARGET ADS JULY PART 2", "-6 000,00", "FOP Lisovyi D.P.", "Advertising", "ok"],
  ["25.07.2026", "TOV OMEGA RETAIL RAH 443 OPLATA ZA POSLUGY", "+27 300,00", "Omega Retail LLC", "Customer payment", "ok"],
  ["26.07.2026", "PRIVATBANK ACQUIRING FEE TERMINAL 03 JULY", "-628,40", "PrivatBank", "Bank fees", "ok"],
  ["26.07.2026", "DIIA.SIGN BUSINESS CERTIFICATE 1 YEAR", "-300,00", "Diia", "Digital signature", "ok"],
  ["27.07.2026", "NOVA POSHTA 00017 POSYLKA 20499000219482", "-224,00", "Nova Poshta", "Logistics", "ok"],
  ["27.07.2026", "PEREKAZ VID TOV SIGMA GROUP FINAL PAYMENT", "+42 000,00", "Sigma Group LLC", "Customer payment", "ok"],

  ["01.09.2025", "ЄСВ із зарплати за 1 половину вересня 2025р.;101/570.50/UAH/UA273052990000026004010112233/3011400000/ЄДРПОУ 30114000", "-570,50", "State Tax Service of Ukraine", "Social contribution", "ok"],
  ["01.09.2025", "ПДФО із зарплати за 1 половину вересня 2025р.;101/466.77/UAH/UA118999980000000000000123456/ГУК у м.Києві", "-466,77", "State Tax Service of Ukraine", "Personal income tax", "ok"],
  ["01.09.2025", "Військовий збір із зарплати за 1 половину вересня 2025р.;101/166.70/UAH/ККДБ 11011000", "-166,70", "State Tax Service of Ukraine", "Military tax", "ok"],
  ["02.09.2025", "Зарплата за 1 половину вересня 2025р. Відомість №09-1; картковий рахунок працівника", "-2 567,25", "Employees", "Payroll", "ok"],
  ["02.09.2025", "Перерахунок власних коштів на поточний рахунок. Без ПДВ. Внесок власника", "+8 000,00", "Owner", "Owner funds", "ok"],
  ["03.09.2025", "ЄСВ із лікарняних за серпень 2025р.;101/312.84/UAH/рах UA273052990000026004010112233", "-312,84", "State Tax Service of Ukraine", "Social contribution", "ok"],
  ["03.09.2025", "ПДФО із лікарняних за серпень 2025р.;101/198.44/UAH/11010100", "-198,44", "State Tax Service of Ukraine", "Personal income tax", "ok"],
  ["03.09.2025", "Військовий збір із лікарняних за серпень 2025р.;101/71.18/UAH/11011000", "-71,18", "State Tax Service of Ukraine", "Military tax", "ok"],
  ["04.09.2025", "Комісія за розрахунково-касове обслуговування згідно тарифів банку за 09/2025", "-180,00", "Bank", "Bank fees", "ok"],
  ["04.09.2025", "Оплата лікарняних за серпень 2025р. Відомість 08-L; реєстр 147", "-1 102,40", "Employees", "Sick leave", "ok"],
  ["05.09.2025", "101;ЄСВ за найманих працівників за серпень 2025;3011400000;період 08/2025", "-1 284,60", "State Tax Service of Ukraine", "Social contribution", "ok"],
  ["05.09.2025", "101;ПДФО за найманих працівників серпень 2025;11010100;без ПДВ", "-1 014,22", "State Tax Service of Ukraine", "Personal income tax", "ok"],
  ["05.09.2025", "101;ВЗ за найманих працівників серпень 2025;11011000;без ПДВ", "-362,22", "State Tax Service of Ukraine", "Military tax", "ok"],
  ["06.09.2025", "Виплата заробітної плати за серпень 2025 згідно відомості №08-2 працівникам", "-6 480,00", "Employees", "Payroll", "ok"],
  ["06.09.2025", "Повернення невикористаних підзвітних коштів від працівника, авансовий звіт №44", "+540,00", "Employee", "Expense reimbursement", "ok"],
  ["07.09.2025", "Оплата за оренду офісу вересень 2025 згідно договору №15/О; без ПДВ", "-12 000,00", "Landlord", "Rent", "ok"],
  ["07.09.2025", "Плата за електроенергію серпень 2025 о/р 102771; показник 18432; у т.ч. ПДВ", "-2 744,19", "Electricity supplier", "Utilities", "ok"],
  ["08.09.2025", "Оплата послуг банку за переказ зарплати на карткові рахунки працівників", "-92,40", "Bank", "Bank fees", "ok"],
  ["08.09.2025", "Платіж за інтернет вересень 2025; особовий рахунок 771928; дог. ІН-221", "-480,00", "Internet provider", "Internet", "ok"],
  ["09.09.2025", "Єдиний податок за III кв. 2025;101;18050400;ФОП;без ПДВ", "-4 200,00", "State Tax Service of Ukraine", "Single tax", "ok"],
  ["09.09.2025", "Оплата послуг бухгалтера за серпень 2025 зг. акту №32 від 31.08.2025", "-3 500,00", "Accountant", "Accounting services", "ok"],
  ["10.09.2025", "Переказ на корпоративну картку для господарських витрат; підзвіт Петренко О.О.", "-3 000,00", "Employee", "Employee advance", "ok"],
  ["10.09.2025", "Повернення помилково перерахованих коштів по платіжному дорученню №884", "+1 250,00", "Counterparty", "Refund", "ok"],
  ["11.09.2025", "101/ЄСВ/заробітна плата/2 половина вересня 2025/UA273052990000026004010112233", "-612,04", "State Tax Service of Ukraine", "Social contribution", "ok"],
  ["11.09.2025", "101/ПДФО/заробітна плата/2 половина вересня 2025/UA118999980000000000000123456", "-500,76", "State Tax Service of Ukraine", "Personal income tax", "ok"],
  ["11.09.2025", "101/ВЗ/заробітна плата/2 половина вересня 2025/11011000", "-178,84", "State Tax Service of Ukraine", "Military tax", "ok"],
  ["12.09.2025", "Зарплата за 2 половину вересня 2025 року згідно зарплатної відомості №09-2", "-2 765,00", "Employees", "Payroll", "ok"],
  ["12.09.2025", "Оплата мобільного зв'язку корпоративний пакет BUSINESS 09/2025, тел. 0980746698", "-420,00", "Mobile operator", "Telecommunications", "ok"],
  ["13.09.2025", "Плата за домен та SSL сертифікат sp-automation.com на 12 міс.; INV#SSL-9921", "-1 890,00", "Hosting provider", "Hosting", "ok"],
  ["13.09.2025", "Оплата послуг кур'єрської доставки за реєстром №118 від 12.09.2025", "-740,00", "Courier service", "Logistics", "ok"],
  ["14.09.2025", "Перерахування благодійної допомоги згідно листа №77; без ПДВ", "-1 000,00", "Charity foundation", "Charity", "ok"],
  ["14.09.2025", "Оплата за канцтовари зг. рахунку №221-09; папір А4, ручки, файли", "-1 384,60", "Office supplies vendor", "Office expenses", "ok"],
  ["15.09.2025", "Нарахована пеня за прострочення податкового зобов'язання;101;1400", "-84,18", "State Tax Service of Ukraine", "Tax penalty", "ok"],
  ["15.09.2025", "Оплата за аудит та перевірку звітності за 8 міс. 2025; акт №09/15", "-5 600,00", "Auditor", "Audit services", "ok"],
  ["16.09.2025", "Компенсація витрат на відрядження згідно авансового звіту №52: проїзд+готель", "-3 944,70", "Employee", "Business travel", "ok"],
  ["16.09.2025", "Оплата за програмне забезпечення, ліцензія 09/2025, invoice 84711", "-2 246,80", "Software provider", "Software", "ok"],
  ["17.09.2025", "Повернення податку згідно уточнюючого розрахунку;ККДБ 11010100", "+622,15", "State Tax Service of Ukraine", "Tax refund", "ok"],
  ["17.09.2025", "Переказ між власними рахунками UA26040250010059660 -> UA90322001000012345", "+15 000,00", "Own accounts", "Internal transfer", "ok"],
  ["18.09.2025", "Переказ між власними рахунками UA90322001000012345 -> UA26040250010059660", "-15 000,00", "Own accounts", "Internal transfer", "ok"],
  ["18.09.2025", "Оплата постачальнику за матеріали зг. рах. №991/09; часткова передоплата 50%", "-8 750,00", "Materials supplier", "Materials", "ok"],
  ["19.09.2025", "Надходження оплати від клієнта за консультаційні послуги, рахунок №45", "+12 400,00", "Customer", "Customer payment", "ok"],
  ["19.09.2025", "Повернення клієнту надміру сплачених коштів за рахунком №45", "-400,00", "Customer", "Customer refund", "ok"],
  ["20.09.2025", "Плата за отримання витягу/довідки/сервісний збір, документ №A-774", "-180,00", "Government service", "Administrative expenses", "ok"],
  ["20.09.2025", "Оплата за ремонт офісного принтера та заміну картриджа, акт 55", "-1 420,00", "Service center", "Repairs", "ok"],
  ["21.09.2025", "Переказ коштів за послуги згідно договору без номера; призначення скорочене", "-2 900,00", "Unidentified", "Requires review", "warning"],
  ["21.09.2025", "Платіж 0921/77; рах 44001; посл. зг. акту; без ПДВ; контрагент не вказаний", "-1 775,00", "Unidentified", "Requires review", "warning"],
  ["22.09.2025", "Перерахунок коштів згідно домовленості; деталізація відсутня; реф 008814", "-980,00", "Unidentified", "Ambiguous category", "warning"],
  ["22.09.2025", "UA26040250010059660/платіж/101/код 8847/рядок пошкоджено OCR ### ??? 77A", "-643,17", "Not identified", "Unclassified", "error"],
  ["23.09.2025", "Оплата за послуги банку: відкриття додаткового рахунку та SMS-інформування", "-250,00", "Bank", "Bank fees", "ok"],
  ["23.09.2025", "Надходження власних коштів на рахунок для покриття касового розриву; без ПДВ", "+6 000,00", "Owner", "Owner funds", "ok"]
];

const statementWindow = document.getElementById("statement-window");
const resultBody = document.getElementById("result-body");
const runButton = document.getElementById("demo-run");
const progress = document.getElementById("demo-progress");
const statusText = document.getElementById("demo-status");
const counterText = document.getElementById("demo-counter");
const statRows = document.getElementById("stat-rows");
const statClients = document.getElementById("stat-clients");
const statCategories = document.getElementById("stat-categories");
const statErrors = document.getElementById("stat-errors");

function renderSourceRows() {
  statementWindow.innerHTML = "";

  bankRows.forEach((row, index) => {
    const item = document.createElement("div");
    item.className = "statement-line";
    item.dataset.index = index;

    item.innerHTML = `
      <span class="statement-date">${row[0]}</span>
      <span class="statement-text">${row[1]}</span>
      <span class="statement-amount">${row[2]}</span>
    `;

    statementWindow.appendChild(item);
  });
}

function resetDemo() {
  renderSourceRows();
  resultBody.innerHTML = "";
  progress.style.width = "0%";
  statusText.textContent = "Ready to start";
  counterText.textContent = `0 / ${bankRows.length}`;
  statRows.textContent = "0";
  statClients.textContent = "0";
  statCategories.textContent = "0";
  statErrors.textContent = "0";
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runDemo() {
  runButton.disabled = true;
  runButton.textContent = "Processing...";

  resetDemo();

  const clients = new Set();
  const categories = new Set();
  const lines = Array.from(document.querySelectorAll(".statement-line"));

  for (let i = 0; i < bankRows.length; i++) {
    const row = bankRows[i];
    const line = lines[i];

    if (i > 0) {
      lines[i - 1].classList.remove("active");
      lines[i - 1].classList.add("done");
    }

    line.classList.add("active");
    line.scrollIntoView({ block: "nearest", behavior: "smooth" });

    statusText.textContent =
      `Recognition and categorization of row ${i + 1}`;

    counterText.textContent =
      `${i + 1} / ${bankRows.length}`;

    progress.style.width =
      `${((i + 1) / bankRows.length) * 100}%`;

    const status = row[5] || "ok";

    if (status !== "error") {
      clients.add(row[3]);
      categories.add(row[4]);
    }

    if (status === "warning") {
      line.classList.add("warning");
    }

    if (status === "error") {
      line.classList.add("error");
    }

    const tr = document.createElement("tr");
    tr.className =
      status === "ok"
        ? ""
        : status;

    const chipClass =
      status === "warning"
        ? "category-chip warning"
        : status === "error"
          ? "category-chip error"
          : "category-chip";

    const categoryLabel =
      status === "warning"
        ? "⚠ " + row[4]
        : status === "error"
          ? "✖ " + row[4]
          : row[4];

    tr.innerHTML = `
      <td>${row[0]}</td>
      <td>${row[3]}</td>
      <td><span class="${chipClass}">${categoryLabel}</span></td>
      <td>${row[2]}</td>
    `;

    resultBody.appendChild(tr);

    requestAnimationFrame(() => {
      tr.classList.add("show");
    });

    tr.scrollIntoView({
      block: "nearest",
      behavior: "smooth"
    });

    const issueCount = bankRows
      .slice(0, i + 1)
      .filter(
        item =>
          (item[5] || "ok") !== "ok"
      )
      .length;

    statRows.textContent =
      String(i + 1);

    statClients.textContent =
      String(clients.size);

    statCategories.textContent =
      String(categories.size);

    statErrors.textContent =
      String(issueCount);

    await sleep(55);
  }

  lines[bankRows.length - 1]
    .classList.remove("active");

  lines[bankRows.length - 1]
    .classList.add("done");

  statusText.textContent =
    "Done: 96 transactions processed • 3 require review • 1 unrecognized";

  runButton.disabled = false;
  runButton.textContent =
    "↻ Run again";
}

runButton.addEventListener(
  "click",
  runDemo
);

resetDemo();
