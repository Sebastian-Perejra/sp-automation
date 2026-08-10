(() => {
  const layer = document.getElementById('codeArtifacts');
  if (!layer) return;

  const fragments = [
    'CALCULATE([Sales], ALL(Date))',
    'SUMX(FILTER(Sales, [Qty] > 0), [Amount])',
    'DIVIDE([Margin], [Revenue], 0)',
    'Table.TransformColumnTypes(Source, {...})',
    'Table.Group(Source, {"Customer"}, {...})',
    'Table.SelectRows(Source, each [Status] = "Active")',
    'let Source = Excel.CurrentWorkbook(){[Name="Data"]}[Content]',
    'const data = rows.filter(row => row.active);',
    'const total = items.reduce((sum, x) => sum + x.value, 0);',
    'document.querySelector(".case-card")',
    'await fetch("/api/data")',
    'Range("A1").Value = result',
    'Cells(row, 7).Value = total',
    '=SUMIFS($H:$H,$B:$B,B2)',
    '=XLOOKUP(A2,Data!A:A,Data!F:F,"")',
    '=FILTER(A2:G500,G2:G500<>"")',
    '2026-08-10T11:54:32',
    'ID_4821_773905',
    '0x7FA3C91D',
    '98.47%',
    'ROWS: 248,719',
    'REFRESH → 07:42:18',
    '[Query].[Result].[Value]',
    '{ status: "success", rows: 1842 }'
  ];

  let lastIndex = -1;

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  function getFragment() {
    let index;

    do {
      index = Math.floor(Math.random() * fragments.length);
    } while (index === lastIndex && fragments.length > 1);

    lastIndex = index;
    return fragments[index];
  }

  function createArtifact() {
    const artifact = document.createElement('span');
    artifact.className = 'code-artifact';
    artifact.textContent = getFragment();

    const side = Math.random() < 0.5 ? 'left' : 'right';

    const x =
      side === 'left'
        ? random(2, 24)
        : random(76, 94);

    const y = random(16, 82);

    artifact.style.left = `${x}%`;
    artifact.style.top = `${y}%`;

    artifact.style.setProperty(
      '--artifact-opacity',
      random(0.18, 0.38).toFixed(2)
    );

    artifact.style.fontSize =
      `${random(8, 11).toFixed(1)}px`;

    layer.appendChild(artifact);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        artifact.classList.add('is-visible');
      });
    });

    const visibleTime = random(3000, 5200);

    setTimeout(() => {
      artifact.classList.remove('is-visible');
      artifact.classList.add('is-fading');

      setTimeout(() => {
        artifact.remove();
      }, 2200);
    }, visibleTime);
  }

  function scheduleNext() {
    const delay = random(2600, 5200);

    setTimeout(() => {
      createArtifact();

      if (Math.random() < 0.28) {
        setTimeout(createArtifact, random(600, 1400));
      }

      scheduleNext();
    }, delay);
  }

  setTimeout(() => {
    createArtifact();
    scheduleNext();
  }, 1800);
})();
