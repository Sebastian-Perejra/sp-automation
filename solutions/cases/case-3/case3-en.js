const dashboardRawBody =
  document.getElementById("dashboard-raw-body");

const dashboardProducts = [
  ["HP 15 Laptop", "Laptops", 23000],
  ["Dell Inspiron 3520", "Laptops", 28500],
  ["Lenovo IdeaPad 3", "Laptops", 26400],
  ["LG 24 Monitor", "Monitors", 9000],
  ["Samsung 27 Monitor", "Monitors", 11800],
  ["Logitech M185 Mouse", "Accessories", 450],
  ["A4Tech Keyboard", "Accessories", 750],
  ["Kingston 1TB SSD", "Components", 3200],
  ["TP-Link Router", "Networking equipment", 2100],
  ["Canon Printer", "Office equipment", 7600]
];

const dashboardClients = [
  "Alpha LLC",
  "Beta LLC",
  "Gamma LLC",
  "Delta LLC",
  "Ivanenko",
  "Petrenko",
  "Omega LLC",
  "Vector LLC",
  "Prime LLC",
  "Kovalenko"
];

function renderDashboardRawRows() {
  const startDate =
    new Date(2023, 0, 3);

  const rows = [];

  for (let index = 0; index < 200; index++) {
    const currentDate =
      new Date(startDate);

    currentDate.setDate(
      startDate.getDate() + index * 3
    );

    const product =
      dashboardProducts[
        index % dashboardProducts.length
      ];

    const client =
      dashboardClients[
        (index * 3) % dashboardClients.length
      ];

    const quantity =
      1 + ((index * 7) % 12);

    const amount =
      product[2] * quantity;

    rows.push(`
      <tr>
        <td>
          ${currentDate.toLocaleDateString("en-GB")}
        </td>

        <td>
          ${currentDate.getFullYear()}
        </td>

        <td>
          ${currentDate.toLocaleDateString(
            "en-GB",
            { month: "long" }
          )}
        </td>

        <td>
          ${currentDate.getDate()}
        </td>

        <td>
          ${product[0]}
        </td>

        <td>
          ${product[1]}
        </td>

        <td>
          ${client}
        </td>

        <td>
          ${quantity}
        </td>

        <td>
          ${amount.toLocaleString("en-GB")}
        </td>
      </tr>
    `);
  }

  dashboardRawBody.innerHTML =
    rows.join("");
}
renderDashboardRawRows();

const dashboardBuildButton =
  document.getElementById("dashboard-build");

const dashboardRaw =
  document.getElementById("dashboard-raw");

const dashboardLoader =
  document.getElementById("dashboard-loader");

const dashboardOutput =
  document.getElementById("dashboard-output");

let dashboardIsBuilt = false;

dashboardBuildButton.addEventListener(
  "click",
  () => {
    if (dashboardIsBuilt) {
      dashboardOutput.classList.remove("visible");
      dashboardRaw.classList.remove("hidden");

      dashboardBuildButton.textContent =
        "⚙ Build dashboard";

      dashboardIsBuilt = false;
      return;
    }

    dashboardBuildButton.disabled = true;

    dashboardBuildButton.textContent =
      "Processing data…";

    dashboardLoader.classList.add("active");

    setTimeout(() => {
      dashboardRaw.classList.add("hidden");
      dashboardLoader.classList.remove("active");
      dashboardOutput.classList.add("visible");

      dashboardBuildButton.disabled = false;

      dashboardBuildButton.textContent =
        "↩ Show raw data";

      dashboardIsBuilt = true;
    }, 1300);
  }
);
