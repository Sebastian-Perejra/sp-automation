(() => {
  const dashboardRawBody = document.getElementById("dashboard-raw-body");

  const dashboardProducts = [
    ["Ноутбук HP 15", "Ноутбуки", 23000],
    ["Dell Inspiron 3520", "Ноутбуки", 28500],
    ["Lenovo IdeaPad 3", "Ноутбуки", 26400],
    ["Монітор LG 24", "Монітори", 9000],
    ["Монітор Samsung 27", "Монітори", 11800],
    ["Миша Logitech M185", "Аксесуари", 450],
    ["Клавіатура A4Tech", "Аксесуари", 750],
    ["SSD Kingston 1TB", "Комплектуючі", 3200],
    ["Роутер TP-Link", "Мережеве обладнання", 2100],
    ["Принтер Canon", "Оргтехніка", 7600]
  ];

  const dashboardClients = [
    "ТОВ «Альфа»",
    "ТОВ «Бета»",
    "ТОВ «Гамма»",
    "ТОВ «Дельта»",
    "ФОП Іваненко",
    "ФОП Петренко",
    "ТОВ «Омега»",
    "ТОВ «Вектор»",
    "ТОВ «Прайм»",
    "ФОП Коваленко"
  ];

  function renderDashboardRawRows() {
    const startDate = new Date(2023, 0, 3);
    const rows = [];

    for (let i = 0; i < 200; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i * 3);

      const product = dashboardProducts[i % dashboardProducts.length];
      const client = dashboardClients[(i * 3) % dashboardClients.length];
      const quantity = 1 + ((i * 7) % 12);
      const amount = product[2] * quantity;

      rows.push(`
        <tr>
          <td>${currentDate.toLocaleDateString("uk-UA")}</td>
          <td>${currentDate.getFullYear()}</td>
          <td>${currentDate.toLocaleDateString("uk-UA", { month: "long" })}</td>
          <td>${currentDate.getDate()}</td>
          <td>${product[0]}</td>
          <td>${product[1]}</td>
          <td>${client}</td>
          <td>${quantity}</td>
          <td>${amount.toLocaleString("uk-UA")}</td>
        </tr>
      `);
    }

    dashboardRawBody.innerHTML = rows.join("");
  }

  renderDashboardRawRows();

  const dashboardBuildButton = document.getElementById("dashboard-build");
  const dashboardRaw = document.getElementById("dashboard-raw");
  const dashboardLoader = document.getElementById("dashboard-loader");
  const dashboardOutput = document.getElementById("dashboard-output");

  let dashboardIsBuilt = false;

  dashboardBuildButton.addEventListener("click", () => {
    if (dashboardIsBuilt) {
      dashboardOutput.classList.remove("visible");
      dashboardRaw.classList.remove("hidden");
      dashboardBuildButton.textContent = "⚙ Побудувати дашборд";
      dashboardIsBuilt = false;
      return;
    }

    dashboardBuildButton.disabled = true;
    dashboardBuildButton.textContent = "Обробка даних…";
    dashboardLoader.classList.add("active");

    setTimeout(() => {
      dashboardRaw.classList.add("hidden");
      dashboardLoader.classList.remove("active");
      dashboardOutput.classList.add("visible");
      dashboardBuildButton.disabled = false;
      dashboardBuildButton.textContent = "↩ Показати сирі дані";
      dashboardIsBuilt = true;
    }, 1300);
  });
})();
