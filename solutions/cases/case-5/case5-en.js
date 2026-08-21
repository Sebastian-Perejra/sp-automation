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
    name: "Electric motor",
    stock: 12
  },

  M002: {
    name: "Gearbox",
    stock: 8
  },

  M003: {
    name: "Position sensor",
    stock: 34
  },

  M004: {
    name: "Pneumatic cylinder",
    stock: 6
  },

  M005: {
    name: "Spindle assembly",
    stock: 4
  },

  M006: {
    name: "CNC control system",
    stock: 2
  },

  M007: {
    name: "Printing module",
    stock: 1
  },

  M008: {
    name: "Industrial controller",
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

const case5CalculateButton =
  document.getElementById("case5-calculate-button");

const case5Loader =
  document.getElementById("case5-loader");

const case5LoaderText =
  document.getElementById("case5-loader-text");

const case5Results =
  document.getElementById("case5-results");

let case5Calculated = false;

function case5Number(value) {
  const number = Number(value);

  if (!Number.isFinite(number) || number < 0) {
    return 0;
  }

  return Math.floor(number);
}

function case5Sleep(milliseconds) {
  return new Promise(resolve => {
    setTimeout(resolve, milliseconds);
  });
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
  need = null,
  buy = null
) {
  const row = document.createElement("article");

  row.className = "case5-part-row";

  const needValue =
    need === null ? "—" : need;

  const buyValue =
    buy === null ? "—" : buy;

  let buyClass = "";

  if (buy !== null) {
    buyClass =
      buy > 0 ? "deficit" : "covered";
  }

  row.innerHTML = `
    <div class="case5-part-name">
      <strong>${part.name}</strong>
      <span>Code: ${partCode}</span>
    </div>

    <div class="case5-part-cell">
      <span>Required</span>
      <strong>${needValue}</strong>
    </div>

    <label class="case5-part-cell">
      <span>In stock</span>

      <input
        class="case5-stock-input"
        type="number"
        min="0"
        value="${part.stock}"
        data-case5-stock="${partCode}"
      >
    </label>

    <div class="case5-part-cell">
      <span>To purchase</span>

      <strong class="case5-buy-value ${buyClass}">
        ${buyValue}
      </strong>
    </div>
  `;

  return row;
}

function case5RenderInitialState() {
  case5PartsList.innerHTML = "";

  Object.entries(case5Parts).forEach(
    ([partCode, part]) => {
      case5PartsList.appendChild(
        case5CreatePartRow(
          partCode,
          part
        )
      );
    }
  );

  case5AttachStockListeners();
}

function case5RenderCalculation() {
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

      case5PartsList.appendChild(
        case5CreatePartRow(
          partCode,
          part,
          need,
          buy
        )
      );
    }
  );

  case5TotalMachines.textContent =
    totalMachines.toLocaleString("en-US");

  case5TotalNeed.textContent =
    totalNeed.toLocaleString("en-US");

  case5TotalStock.textContent =
    totalStock.toLocaleString("en-US");

  case5TotalBuy.textContent =
    totalBuy.toLocaleString("en-US");

  case5AttachStockListeners();
}

function case5AttachStockListeners() {
  document
    .querySelectorAll("[data-case5-stock]")
    .forEach(input => {
      input.addEventListener("input", event => {
        const partCode =
          event.target.dataset.case5Stock;

        case5Parts[partCode].stock =
          case5Number(event.target.value);

        case5ResetAfterChange();
      });
    });
}

function case5ResetAfterChange() {
  if (!case5Calculated) {
    return;
  }

  case5Calculated = false;

  case5Results.classList.remove("visible");

  case5CalculateButton.textContent =
    "⚙ Calculate component requirements";

  case5RenderInitialState();
}

async function case5RunCalculation() {
  case5CalculateButton.disabled = true;

  case5CalculateButton.textContent =
    "Calculating...";

  case5Loader.classList.add("active");

  case5LoaderText.textContent =
    "Analysing sales orders...";

  await case5Sleep(450);

  case5LoaderText.textContent =
    "Expanding BOM specifications...";

  await case5Sleep(500);

  case5LoaderText.textContent =
    "Checking warehouse stock...";

  await case5Sleep(500);

  case5LoaderText.textContent =
    "Calculating component shortages...";

  await case5Sleep(500);

  case5RenderCalculation();

  case5LoaderText.textContent =
    "Purchase list generated";

  await case5Sleep(350);

  case5Loader.classList.remove("active");
  case5Results.classList.add("visible");

  case5Calculated = true;

  case5CalculateButton.disabled = false;

  case5CalculateButton.textContent =
    "↻ Recalculate requirements";
}

Object.values(case5Machines).forEach(machine => {
  const input =
    document.getElementById(machine.inputId);

  input.addEventListener(
    "input",
    case5ResetAfterChange
  );
});

case5CalculateButton.addEventListener(
  "click",
  case5RunCalculation
);

case5RenderInitialState();
