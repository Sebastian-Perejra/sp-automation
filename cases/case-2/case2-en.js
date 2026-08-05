const pdfDemoDocuments = [
  {
    name: "Invoice_Aurora_4821.pdf",
    type: "invoice",
    rows: [
      [
        "10",
        "410201/AX",
        "Profile Aurora 45 silver",
        "6.0",
        "120",
        "Piece",
        "18.40",
        "2208.00",
        "76042100",
        "DE",
        "46.8000"
      ],
      [
        "20",
        "410315/BK",
        "Corner Nova 45 reinforced",
        "",
        "240",
        "Pcs",
        "3.25",
        "780.00",
        "76169990",
        "DE",
        "21.6000"
      ],
      [
        "30",
        "420118/CL",
        "Clip Vector S black",
        "",
        "600",
        "Pcs",
        "0.84",
        "504.00",
        "39269097",
        "PL",
        "12.3000"
      ],
      [
        "40",
        "430722/DP",
        "Base plate Delta 90",
        "",
        "80",
        "Piece",
        "11.50",
        "920.00",
        "73269098",
        "CZ",
        "38.4000"
      ]
    ]
  },
  {
    name: "PackingList_Aurora_4821.pdf",
    type: "packing",
    rows: [
      [
        "10",
        "410201/AX",
        "Profile Aurora 45 silver",
        "6.0",
        "120",
        "Piece",
        "46.8000",
        "76042100",
        "118.50",
        "132.40",
        "2 Palette"
      ],
      [
        "20",
        "410315/BK",
        "Corner Nova 45 reinforced",
        "",
        "240",
        "Pcs",
        "21.6000",
        "76169990",
        "118.50",
        "132.40",
        "2 Palette"
      ],
      [
        "30",
        "420118/CL",
        "Clip Vector S black",
        "",
        "600",
        "Pcs",
        "12.3000",
        "39269097",
        "118.50",
        "132.40",
        "2 Palette"
      ],
      [
        "40",
        "430722/DP",
        "Base plate Delta 90",
        "",
        "80",
        "Piece",
        "38.4000",
        "73269098",
        "118.50",
        "132.40",
        "2 Palette"
      ]
    ]
  }
    ,
  {
    name: "Invoice_Nova_4822.pdf",
    type: "invoice",
    rows: [
      [
        "10",
        "510144/ER",
        "Swivel Link Orbit M12",
        "",
        "40",
        "Piece",
        "7.80",
        "312.00",
        "73181900",
        "DE",
        "8.2000"
      ],
      [
        "20",
        "510288/FS",
        "Guard unit Sigma 60",
        "",
        "25",
        "Piece",
        "24.60",
        "615.00",
        "73269098",
        "DE",
        "19.7500"
      ],
      [
        "30",
        "520901/GT",
        "Ring bolt Terra M16",
        "",
        "90",
        "Pcs",
        "2.15",
        "193.50",
        "73181595",
        "PL",
        ""
      ]
    ]
  }
];

const pdfInFiles =
  document.getElementById("pdf-in-files");

const pdfArchiveFiles =
  document.getElementById("pdf-archive-files");

const pdfRun =
  document.getElementById("pdf-run");

const pdfLog =
  document.getElementById("pdf-log");

const pdfTableHead =
  document.getElementById("pdf-table-head");

const pdfTableBody =
  document.getElementById("pdf-table-body");

const pdfSteps =
  Array.from(
    document.querySelectorAll("[data-pdf-step]")
  );

const pdfTabs =
  Array.from(
    document.querySelectorAll("[data-sheet-tab]")
  );

const pdfStatFiles =
  document.getElementById("pdf-stat-files");

const pdfStatRows =
  document.getElementById("pdf-stat-rows");

const pdfStatWeights =
  document.getElementById("pdf-stat-weights");

const pdfStatErrors =
  document.getElementById("pdf-stat-errors");

let activePdfSheet = "RAW";

const parsedPdfRows = {
  RAW: [],
  PACKING: []
};

function pdfSleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

function createDriveFile(documentData, state = "") {
  const file =
    document.createElement("div");

  file.className =
    "drive-file" +
    (state ? " " + state : "");

  file.dataset.pdfName =
    documentData.name;

  file.innerHTML = `
    <span class="pdf-icon">
      PDF
    </span>

    <span>
      ${documentData.name}
    </span>
  `;

  return file;
}
function resetPdfCase() {
  pdfInFiles.innerHTML = "";

  pdfArchiveFiles.innerHTML = `
    <div class="drive-empty">
      Archive is empty
    </div>
  `;

  pdfDemoDocuments.forEach(item => {
    pdfInFiles.appendChild(
      createDriveFile(item)
    );
  });

  parsedPdfRows.RAW = [];
  parsedPdfRows.PACKING = [];

  pdfSteps.forEach(step => {
    step.classList.remove(
      "active",
      "done"
    );
  });

  pdfStatFiles.textContent = "0";
  pdfStatRows.textContent = "0";
  pdfStatWeights.textContent = "0";
  pdfStatErrors.textContent = "0";

  pdfLog.textContent =
    "Ready to start. The PDF_IN folder contains 3 demonstration PDF files.";

  renderPdfTable();
}

function setPdfStep(index) {
  pdfSteps.forEach((step, stepIndex) => {
    step.classList.toggle(
      "active",
      stepIndex === index
    );

    if (stepIndex < index) {
      step.classList.add("done");
      step.classList.remove("active");
    }
  });
}

function finishPdfSteps() {
  pdfSteps.forEach(step => {
    step.classList.remove("active");
    step.classList.add("done");
  });
}

function renderPdfTable() {
  const isRaw =
    activePdfSheet === "RAW";

  pdfTableHead.innerHTML = isRaw
    ? `
      <tr>
        <th>Pos</th>
        <th>Article</th>
        <th>Description</th>
        <th>Length</th>
        <th>Qty</th>
        <th>Unit</th>
        <th>Price</th>
        <th>Total</th>
        <th>Weight</th>
      </tr>
    `
    : `
      <tr>
        <th>Pos</th>
        <th>Article</th>
        <th>Description</th>
        <th>Length</th>
        <th>Qty</th>
        <th>Unit</th>
        <th>Weight</th>
        <th>Net</th>
        <th>Gross</th>
      </tr>
    `;

  pdfTableBody.innerHTML = "";

  parsedPdfRows[activePdfSheet]
    .forEach(row => {
      const tr =
        document.createElement("tr");

      if (isRaw) {
        tr.innerHTML = `
          <td>${row[0]}</td>
          <td>${row[1]}</td>
          <td>${row[2]}</td>
          <td>${row[3]}</td>
          <td>${row[4]}</td>
          <td>${row[5]}</td>
          <td>${row[6]}</td>
          <td>${row[7]}</td>
          <td>${row[10] || "⚠"}</td>
        `;
      } else {
        tr.innerHTML = `
          <td>${row[0]}</td>
          <td>${row[1]}</td>
          <td>${row[2]}</td>
          <td>${row[3]}</td>
          <td>${row[4]}</td>
          <td>${row[5]}</td>
          <td>${row[6]}</td>
          <td>${row[8]}</td>
          <td>${row[9]}</td>
        `;
      }

      pdfTableBody.appendChild(tr);

      requestAnimationFrame(() => {
        tr.classList.add("show");
      });
    });
}
pdfTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    activePdfSheet =
      tab.dataset.sheetTab;

    pdfTabs.forEach(item => {
      item.classList.toggle(
        "active",
        item.dataset.sheetTab === activePdfSheet
      );
    });

    renderPdfTable();
  });
});

async function runPdfCase() {
  pdfRun.disabled = true;
  pdfRun.textContent = "Processing...";

  resetPdfCase();

  let processedFiles = 0;
  let parsedRows = 0;
  let matchedWeights = 0;
  let warnings = 0;

  for (
    let docIndex = 0;
    docIndex < pdfDemoDocuments.length;
    docIndex++
  ) {
    const current =
      pdfDemoDocuments[docIndex];

    const fileNode =
      pdfInFiles.querySelector(
        `[data-pdf-name="${current.name}"]`
      );

    fileNode.classList.add("processing");

    setPdfStep(0);

    pdfLog.textContent =
      `Found ${current.name} in PDF_IN. Reading file...`;

    await pdfSleep(650);

    setPdfStep(1);

    pdfLog.textContent =
      `Temporary Google Docs file created. Running OCR: ${current.name}`;

    await pdfSleep(750);

    setPdfStep(2);

    pdfLog.textContent =
      current.type === "invoice"
        ? "Invoice detected. Parsing number, date, article, position, quantity, price and tariff."
        : "Packing list detected. Parsing weight, net weight, gross weight and packaging.";

    await pdfSleep(700);

    setPdfStep(3);

    if (current.type === "invoice") {
      current.rows.forEach(row => {
        parsedPdfRows.RAW.push(row);

        parsedRows++;

        if (row[10]) {
          matchedWeights++;
        } else {
          warnings++;
        }
      });

      activePdfSheet = "RAW";
    } else {
      current.rows.forEach(row => {
        parsedPdfRows.PACKING.push(row);
        parsedRows++;
      });

      activePdfSheet = "PACKING";
    }

    pdfTabs.forEach(item => {
      item.classList.toggle(
        "active",
        item.dataset.sheetTab === activePdfSheet
      );
    });

    renderPdfTable();

    pdfLog.textContent =
      current.type === "invoice"
        ? `Data written to RAW. Parsed ${current.rows.length} line items.`
        : "Data written to PACKING. Weights are ready to be matched to RAW.";

    pdfStatRows.textContent =
      String(parsedRows);

    pdfStatWeights.textContent =
      String(matchedWeights);

    pdfStatErrors.textContent =
      String(warnings);

    await pdfSleep(700);

    setPdfStep(4);

    if (
      pdfArchiveFiles.querySelector(
        ".drive-empty"
      )
    ) {
      pdfArchiveFiles.innerHTML = "";
    }

    fileNode.remove();

    pdfArchiveFiles.appendChild(
      createDriveFile(
        current,
        "archived"
      )
    );

    processedFiles++;

    pdfStatFiles.textContent =
      String(processedFiles);

    pdfLog.textContent =
      `${current.name} successfully moved from PDF_IN to PDF_ARCHIVE.`;

    await pdfSleep(650);
  }
}
  finishPdfSteps();

  activePdfSheet = "RAW";

  pdfTabs.forEach(item => {
    item.classList.toggle(
      "active",
      item.dataset.sheetTab === "RAW"
    );
  });

  renderPdfTable();

  pdfLog.textContent =
    "Done: 3 PDF files processed, data written to RAW and PACKING, 1 weight requires manual review.";

  pdfRun.disabled = false;
  pdfRun.textContent = "↻ Run again";
}

pdfRun.addEventListener(
  "click",
  runPdfCase
);

resetPdfCase();
