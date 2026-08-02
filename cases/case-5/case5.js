const case5Machines = {
  sp100: {
    inputId: "case5-machine-sp100",
    bom: {
      M001: 2,
      M002: 1,
      M003: 4,
      M004: 1
    }
  },

  fm20: {
    inputId: "case5-machine-fm20",
    bom: {
      M001: 1,
      M002: 2,
      M005: 3,
      M006: 1
    }
  },

  ml5: {
    inputId: "case5-machine-ml5",
    bom: {
      M003: 2,
      M004: 2,
      M007: 1,
      M008: 1
    }
  }
};

const case5Parts = {
  M001: {
    name: "Електродвигун",
    stock: 12
  },

  M002: {
    name: "Редуктор",
    stock: 8
  },

  M003: {
    name: "Датчик положення",
    stock: 34
  },

  M004: {
    name: "Пневмоциліндр",
    stock: 6
  },

  M005: {
    name: "Шпиндельний вузол",
    stock: 4
  },

  M006: {
    name: "Система ЧПК",
    stock: 2
  },

  M007: {
    name: "Друкувальний модуль",
    stock: 1
  },

  M008: {
    name: "Промисловий контролер",
    stock: 0
  }
};

const case5PartsList =
  document.getElementById("case5-parts-list");

const case5TotalMachines =
  document.getElementById("case5-total-machines");

const case5TotalNeed =
  document.getElementById("case5-total-need");

const case5TotalStock =
  document.getElementById("case5-total-stock");

const case5TotalBuy =
  document.getElementById("case5-total-buy");

function case5Number(value) {
  const number = Number(value);

  if (!Number.isFinite(number) || number < 0) {
    return 0;
  }

  return Math.floor(number);
}

function case5GetMachineQuantity(machineKey) {
  const machine = case5Machines[machineKey];
  const input = document.getElementById(machine.inputId);

  return case5Number(input.value);
}

function case5CalculateNeeds() {
  const needs = {};

  Object.entries(case5Machines).forEach(
    ([machineKey, machine]) => {
      const machineQuantity =
        case5GetMachineQuantity(machineKey);

      Object.entries(machine.bom).forEach(
        ([partCode, quantityPerMachine]) => {
          needs[partCode] =
            (needs[partCode] || 0) +
            machineQuantity * quantityPerMachine;
        }
      );
    }
  );

  return needs;
}

function case5CreatePartRow(
  partCode,
  part,
  need,
  buy
) {
  const row = document.createElement("article");

  row.className = "case5-part-row";

  row.innerHTML = `
    <div class="case5-part-name">
      <strong>${part.name}</strong>
      <span>Код: ${partCode}</span>
    </div>

    <div class="case5-part-cell">
      <span>Потреба</span>
      <strong>${need}</strong>
    </div>

    <label class="case5-part-cell">
      <span>Залишок</span>

      <input
        class="case5-stock-input"
        type="number"
        min="0"
        value="${part.stock}"
        data-case5-stock="${partCode}"
      >
    </label>

    <div class="case5-part-cell">
      <span>До закупівлі</span>

      <strong
        class="case5-buy-value ${
          buy > 0 ? "deficit" : "covered"
        }"
      >
        ${buy}
      </strong>
    </div>
  `;

  return row;
}

function case5Render() {
  const needs = case5CalculateNeeds();

  let totalMachines = 0;
  let totalNeed = 0;
  let totalStock = 0;
  let totalBuy = 0;

  Object.keys(case5Machines).forEach(machineKey => {
    totalMachines +=
      case5GetMachineQuantity(machineKey);
  });

  case5PartsList.innerHTML = "";

  Object.entries(case5Parts).forEach(
    ([partCode, part]) => {
      const need =
        needs[partCode] || 0;

      const stock =
        case5Number(part.stock);

      const stockUsed =
        Math.min(need, stock);

      const buy =
        Math.max(need - stock, 0);

      totalNeed += need;
      totalStock += stockUsed;
      totalBuy += buy;

      const row =
        case5CreatePartRow(
          partCode,
          part,
          need,
          buy
        );

      case5PartsList.appendChild(row);
    }
  );

  case5TotalMachines.textContent =
    totalMachines.toLocaleString("uk-UA");

  case5TotalNeed.textContent =
    totalNeed.toLocaleString("uk-UA");

  case5TotalStock.textContent =
    totalStock.toLocaleString("uk-UA");

  case5TotalBuy.textContent =
    totalBuy.toLocaleString("uk-UA");

  document
    .querySelectorAll("[data-case5-stock]")
    .forEach(input => {
      input.addEventListener("input", event => {
        const partCode =
          event.target.dataset.case5Stock;

        case5Parts[partCode].stock =
          case5Number(event.target.value);

        case5Render();
      });
    });
}

Object.values(case5Machines).forEach(machine => {
  const input =
    document.getElementById(machine.inputId);

  input.addEventListener("input", case5Render);
});

case5Render();
