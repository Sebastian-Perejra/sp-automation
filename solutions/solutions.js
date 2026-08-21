(() => {
  const dictionary = window.SOLUTIONS_SEARCH_DICTIONARY;
  const cases = window.SOLUTIONS_CASES_UK;

  if (!dictionary || !Array.isArray(cases)) {
    return;
  }

  const input = document.getElementById("case-search-input");
  const clearButton = document.getElementById("case-search-clear");
  const resultsNode = document.getElementById("case-search-results");
  const countNode = document.getElementById("case-search-count");
  const captionNode = document.getElementById("case-search-caption");
  const emptyNode = document.getElementById("case-search-empty");
  const stateNode = document.getElementById("case-search-state");
  const stage = document.getElementById("case-detail-stage");
  const stageBody = document.getElementById("case-detail-body");
  const stageLoading = document.getElementById("case-detail-loading");
  const stageNumber = document.getElementById("case-detail-number");
  const stageTitle = document.getElementById("case-detail-title");
  const stageClose = document.getElementById("case-detail-close");

  if (
    !input ||
    !resultsNode ||
    !countNode ||
    !captionNode ||
    !emptyNode ||
    !stage ||
    !stageBody
  ) {
    return;
  }

  const stopWords = new Set(
    dictionary.stopWords.map(normalize)
  );

  const conceptEntries = Object.entries(
    dictionary.concepts
  ).map(([concept, terms]) => ({
    concept,
    terms: Array.from(
      new Set(
        [concept, ...terms]
          .map(normalize)
          .filter(Boolean)
      )
    )
  }));

  let latestResults = [];
  let activeCaseId = null;
  let activeRuntime = null;
  let searchTimer = null;

  function normalize(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ё/g, "е")
      .replace(/ґ/g, "г")
      .replace(/[’`´]/g, "'")
      .replace(/[_/\\|]+/g, " ")
      .replace(/[^\p{L}\p{N}+#.'&-]+/gu, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function compact(value) {
    return normalize(value)
      .replace(/[\s\-_.']/g, "");
  }

  function tokenize(value) {
    return normalize(value)
      .split(" ")
      .map(token => token.trim())
      .filter(token => token.length > 1)
      .filter(token => !stopWords.has(token));
  }

  function keyboardToCyrillic(value) {
    const map = {
      q:"й",w:"ц",e:"у",r:"к",t:"е",y:"н",u:"г",i:"ш",o:"щ",p:"з",
      "[":"х","]":"ї",a:"ф",s:"і",d:"в",f:"а",g:"п",h:"р",j:"о",
      k:"л",l:"д",";":"ж","'":"є",z:"я",x:"ч",c:"с",v:"м",b:"и",
      n:"т",m:"ь",",":"б",".":"ю"
    };

    return normalize(value)
      .split("")
      .map(char => map[char] || char)
      .join("");
  }

  function levenshtein(a, b) {
    const left = normalize(a);
    const right = normalize(b);

    if (left === right) return 0;
    if (!left.length) return right.length;
    if (!right.length) return left.length;

    const previous = Array.from(
      { length: right.length + 1 },
      (_, index) => index
    );

    for (let i = 1; i <= left.length; i++) {
      let current = [i];

      for (let j = 1; j <= right.length; j++) {
        const insert = current[j - 1] + 1;
        const remove = previous[j] + 1;
        const replace =
          previous[j - 1] +
          (left[i - 1] === right[j - 1] ? 0 : 1);

        current[j] = Math.min(
          insert,
          remove,
          replace
        );
      }

      for (let j = 0; j < current.length; j++) {
        previous[j] = current[j];
      }
    }

    return previous[right.length];
  }

  function fuzzySimilarity(a, b) {
    const left = normalize(a);
    const right = normalize(b);
    const longest = Math.max(
      left.length,
      right.length
    );

    if (!longest) return 1;

    return 1 - levenshtein(left, right) / longest;
  }

  function queryVariants(rawQuery) {
    const normalized = normalize(rawQuery);
    const variants = new Set();

    if (normalized) {
      variants.add(normalized);
      variants.add(compact(normalized));

      const keyboard = keyboardToCyrillic(normalized);

      if (keyboard && keyboard !== normalized) {
        variants.add(keyboard);
        variants.add(compact(keyboard));
      }
    }

    return Array.from(variants).filter(Boolean);
  }

  function detectConcepts(rawQuery) {
    const variants = queryVariants(rawQuery);
    const queryTokens = Array.from(
      new Set(
        variants.flatMap(tokenize)
      )
    );

    const detected = [];

    conceptEntries.forEach(entry => {
      let best = 0;
      let reason = "";

      entry.terms.forEach(term => {
        const termCompact = compact(term);

        variants.forEach(variant => {
          const variantCompact = compact(variant);

          if (
            variant === term ||
            variantCompact === termCompact
          ) {
            if (best < 1) {
              best = 1;
              reason = term;
            }
            return;
          }

          if (
            variant.length >= 3 &&
            term.length >= 3 &&
            (
              variant.includes(term) ||
              term.includes(variant)
            )
          ) {
            if (best < 0.88) {
              best = 0.88;
              reason = term;
            }
          }
        });

        const termTokens = tokenize(term);

        queryTokens.forEach(queryToken => {
          termTokens.forEach(termToken => {
            if (
              queryToken.length < 4 ||
              termToken.length < 4
            ) {
              return;
            }

            const similarity =
              fuzzySimilarity(
                queryToken,
                termToken
              );

            if (
              similarity >= 0.78 &&
              similarity > best
            ) {
              best = similarity * 0.82;
              reason = term;
            }
          });
        });
      });

      if (best >= 0.64) {
        detected.push({
          concept: entry.concept,
          confidence: best,
          reason
        });
      }
    });

    return detected.sort(
      (a, b) => b.confidence - a.confidence
    );
  }

  function fieldScore(
    queryVariantsList,
    queryTokens,
    values,
    weight
  ) {
    const textValues = Array.isArray(values)
      ? values
      : [values];

    let score = 0;
    const reasons = new Set();

    textValues.forEach(value => {
      const normalizedValue = normalize(value);
      const compactValue = compact(value);
      const valueTokens = tokenize(value);

      queryVariantsList.forEach(variant => {
        const variantCompact = compact(variant);

        if (
          variant === normalizedValue ||
          variantCompact === compactValue
        ) {
          score += weight * 1.25;
          reasons.add(String(value));
          return;
        }

        if (
          variant.length >= 3 &&
          normalizedValue.includes(variant)
        ) {
          score += weight;
          reasons.add(String(value));
        }

        if (
          variantCompact.length >= 4 &&
          compactValue.includes(variantCompact)
        ) {
          score += weight * 0.88;
          reasons.add(String(value));
        }
      });

      queryTokens.forEach(queryToken => {
        valueTokens.forEach(valueToken => {
          if (queryToken === valueToken) {
            score += weight * 0.42;
            reasons.add(String(value));
            return;
          }

          if (
            queryToken.length >= 4 &&
            valueToken.length >= 4
          ) {
            const similarity =
              fuzzySimilarity(
                queryToken,
                valueToken
              );

            if (similarity >= 0.8) {
              score +=
                weight *
                0.28 *
                similarity;

              reasons.add(String(value));
            }
          }
        });
      });
    });

    return {
      score,
      reasons
    };
  }

  function scoreCase(item, rawQuery) {
    const variants = queryVariants(rawQuery);
    const queryTokens = Array.from(
      new Set(
        variants.flatMap(tokenize)
      )
    );
    const detectedConcepts =
      detectConcepts(rawQuery);

    let score = 0;
    const reasons = new Set();
    const matchedConcepts = [];

    const fields = [
      [item.title, 120],
      [item.tools, 92],
      [item.aliases, 84],
      [item.problems, 76],
      [item.outcomes, 66],
      [item.tags, 58],
      [item.short, 34],
      [item.type, 28]
    ];

    fields.forEach(([values, weight]) => {
      const result = fieldScore(
        variants,
        queryTokens,
        values,
        weight
      );

      score += result.score;

      result.reasons.forEach(reason => {
        reasons.add(reason);
      });
    });

    detectedConcepts.forEach(match => {
      if (
        item.concepts.includes(match.concept)
      ) {
        const conceptScore =
          105 * match.confidence;

        score += conceptScore;
        matchedConcepts.push(
          match.concept
        );
        reasons.add(match.reason);
      }
    });

    const titleCompact =
      compact(item.title);

    variants.forEach(variant => {
      const variantCompact =
        compact(variant);

      if (
        variantCompact.length >= 4 &&
        titleCompact.startsWith(
          variantCompact
        )
      ) {
        score += 35;
      }
    });

    return {
      item,
      score,
      reasons:
        Array.from(reasons)
          .filter(Boolean)
          .slice(0, 6),
      matchedConcepts:
        Array.from(
          new Set(matchedConcepts)
        )
    };
  }

  function searchCases(rawQuery) {
    const query = normalize(rawQuery);

    if (!query) {
      return cases
        .slice()
        .sort(
          (a, b) =>
            b.priority - a.priority
        )
        .slice(0, 6)
        .map(item => ({
          item,
          score: item.priority,
          reasons: item.tags.slice(0, 3),
          matchedConcepts: item.concepts.slice(0, 3)
        }));
    }

    return cases
      .map(item => scoreCase(item, query))
      .filter(result => result.score >= 22)
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }

        return (
          b.item.priority -
          a.item.priority
        );
      })
      .slice(0, 10);
  }

  function resultBadge(index, result, query) {
    if (!query) {
      if (result.item.featured) {
        return "FEATURED";
      }

      return "RECOMMENDED";
    }

    if (index === 0) {
      return "TOP MATCH";
    }

    if (result.score >= 180) {
      return "STRONG MATCH";
    }

    return "RELEVANT";
  }

  function reasonLabels(result) {
    const conceptLabels = {
      automation: "автоматизація",
      reporting: "звітність",
      powerbi: "Power BI",
      dashboard: "дашборд",
      analytics: "аналітика",
      kpi: "KPI",
      planfact: "план-факт",
      excel: "Excel",
      powerquery: "Power Query",
      data_consolidation: "об’єднання файлів",
      data_cleaning: "очищення даних",
      pdf: "PDF",
      invoice: "інвойси",
      packing: "packing list",
      ocr: "OCR",
      google_drive: "Google Drive",
      google_sheets: "Google Sheets",
      apps_script: "Apps Script",
      bank: "банк",
      payments: "платежі",
      categorization: "категоризація",
      counterparty: "контрагенти",
      bom: "BOM",
      procurement: "закупівлі",
      stock: "залишки",
      mrp: "MRP",
      production: "виробництво",
      capacity: "потужності",
      scheduling: "планування",
      deadline: "строки",
      priority: "пріоритет",
      erp: "ERP",
      crm: "CRM",
      mes: "MES",
      api: "API",
      integration: "інтеграція",
      telegram: "Telegram",
      bot: "бот",
      notifications: "нагадування",
      email: "Email",
      documents: "документи",
      webapp: "Web App",
      pwa: "PWA",
      data_matching: "зіставлення",
      finance: "фінанси",
      sales: "продажі",
      forecast: "прогноз",
      errors: "помилки",
      realtime: "актуальні дані"
    };

    const labels = result.matchedConcepts
      .map(concept => conceptLabels[concept])
      .filter(Boolean);

    if (labels.length < 3) {
      result.item.tags.forEach(tag => {
        if (
          labels.length < 3 &&
          !labels.includes(tag)
        ) {
          labels.push(tag);
        }
      });
    }

    return labels.slice(0, 3);
  }

  function renderResults(rawQuery) {
    const query = normalize(rawQuery);
    latestResults = searchCases(query);

    resultsNode.innerHTML = "";
    emptyNode.hidden = latestResults.length > 0;

    captionNode.textContent = query
      ? "НАЙБІЛЬШ РЕЛЕВАНТНІ РІШЕННЯ"
      : "РЕКОМЕНДОВАНІ КЕЙСИ";

    countNode.textContent = query
      ? `Знайдено: ${latestResults.length}`
      : `${latestResults.length} кейсів`;

    stateNode.textContent = query
      ? `QUERY: ${query.toUpperCase()}`
      : "SMART MATCHING / UA · RU · EN";

    latestResults.forEach(
      (result, index) => {
        const item = result.item;
        const card =
          document.createElement("article");

        card.className =
          "case-result-card";

        card.innerHTML = `
          <button
            class="case-result-card__button"
            type="button"
            data-result-case="${item.id}"
          >
            <div class="case-result-card__top">
              <span class="case-result-card__number">
                ${String(item.id).padStart(2, "0")}
              </span>

              <span class="case-result-card__badge">
                ${resultBadge(index, result, query)}
              </span>
            </div>

            <div class="case-result-card__type">
              ${item.type}
            </div>

            <h3>${item.title}</h3>

            <p>${item.short}</p>

            <div class="case-result-card__why">
              <span>ЧОМУ ЦЕЙ КЕЙС</span>

              <div>
                ${reasonLabels(result)
                  .map(
                    label =>
                      `<i>${label}</i>`
                  )
                  .join("")}
              </div>
            </div>

            <div class="case-result-card__footer">
              <span>
                ${item.tools.slice(0, 4).join(" · ")}
              </span>

              <strong>ВІДКРИТИ ↘</strong>
            </div>
          </button>
        `;

        resultsNode.appendChild(card);
      }
    );

    resultsNode
      .querySelectorAll("[data-result-case]")
      .forEach(button => {
        button.addEventListener(
          "click",
          () => {
            openCase(
              Number(
                button.dataset.resultCase
              )
            );
          }
        );
      });
  }

  function loadScript(src) {
    return new Promise(
      (resolve, reject) => {
        const script =
          document.createElement("script");

        script.src = src;
        script.dataset.caseRuntime = "true";
        script.onload = resolve;
        script.onerror = reject;

        document.body.appendChild(script);
        activeRuntime = script;
      }
    );
  }

  async function openCase(caseId) {
    const item = cases.find(
      entry => entry.id === caseId
    );

    if (!item) return;

    activeCaseId = caseId;
    stage.hidden = false;
    stage.classList.add("loading");
    stageBody.innerHTML = "";
    stageLoading.hidden = false;
    stageNumber.textContent =
      `CASE ${String(caseId).padStart(2, "0")}`;
    stageTitle.textContent = item.title;

    stage.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

    if (activeRuntime) {
      activeRuntime.remove();
      activeRuntime = null;
    }

    try {
      const basePath =
        `/solutions/cases/case-${caseId}`;

      const response = await fetch(
        `${basePath}/case-${caseId}.html`
      );

      if (!response.ok) {
        throw new Error(
          `Case ${caseId} HTML failed`
        );
      }

      stageBody.innerHTML =
        await response.text();

      await loadScript(
        `${basePath}/case-${caseId}.js?v=1`
      );

      stage.classList.remove("loading");
      stageLoading.hidden = true;
    } catch (error) {
      stage.classList.remove("loading");
      stageLoading.hidden = true;

      stageBody.innerHTML = `
        <div class="case-detail-stage__error">
          Не вдалося завантажити кейс.
          Спробуй оновити сторінку.
        </div>
      `;

      console.error(error);
    }
  }

  function closeCase() {
    activeCaseId = null;
    stage.hidden = true;
    stageBody.innerHTML = "";

    if (activeRuntime) {
      activeRuntime.remove();
      activeRuntime = null;
    }

    document
      .getElementById("case-finder")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
  }

  function scheduleSearch() {
    clearTimeout(searchTimer);

    searchTimer = setTimeout(() => {
      renderResults(input.value);
    }, 70);
  }

  input.addEventListener(
    "input",
    scheduleSearch
  );

  input.addEventListener(
    "keydown",
    event => {
      if (
        event.key === "Enter" &&
        latestResults.length
      ) {
        event.preventDefault();

        openCase(
          latestResults[0].item.id
        );
      }

      if (event.key === "Escape") {
        input.value = "";
        renderResults("");
        input.blur();
      }
    }
  );

  clearButton?.addEventListener(
    "click",
    () => {
      input.value = "";
      renderResults("");
      input.focus();
    }
  );

  document
    .querySelectorAll(
      "[data-search-suggestion]"
    )
    .forEach(button => {
      button.addEventListener(
        "click",
        () => {
          input.value =
            button.dataset.searchSuggestion;

          renderResults(input.value);
          input.focus();
        }
      );
    });

  document
    .querySelectorAll("[data-open-case]")
    .forEach(button => {
      button.addEventListener(
        "click",
        () => {
          openCase(
            Number(
              button.dataset.openCase
            )
          );
        }
      );
    });

  stageClose?.addEventListener(
    "click",
    closeCase
  );

  renderResults("");
})();
