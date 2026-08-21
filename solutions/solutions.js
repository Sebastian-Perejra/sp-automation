(() => {
  const dictionary =
    window.SOLUTIONS_SEARCH_DICTIONARY || {};

  const cases =
    Array.isArray(window.SOLUTIONS_CASES_UK)
      ? window.SOLUTIONS_CASES_UK
      : [];

  const languageLayers = [
    window.SOLUTIONS_SEARCH_LANGUAGE_UK,
    window.SOLUTIONS_SEARCH_LANGUAGE_RU,
    window.SOLUTIONS_SEARCH_LANGUAGE_EN
  ].filter(Boolean);

  if (!cases.length) {
    return;
  }

  const input =
    document.getElementById("case-search-input");

  const clearButton =
    document.getElementById("case-search-clear");

  const resultsNode =
    document.getElementById("case-search-results");

  const countNode =
    document.getElementById("case-search-count");

  const captionNode =
    document.getElementById("case-search-caption");

  const emptyNode =
    document.getElementById("case-search-empty");

  const stateNode =
    document.getElementById("case-search-state");
  
  const understoodNode =
  document.getElementById("case-search-understood");

const conceptsNode =
  document.getElementById("case-search-concepts");

  const stage =
    document.getElementById("case-detail-stage");

  const stageBody =
    document.getElementById("case-detail-body");

  const stageLoading =
    document.getElementById("case-detail-loading");

  const stageNumber =
    document.getElementById("case-detail-number");

  const stageTitle =
    document.getElementById("case-detail-title");

  const stageClose =
    document.getElementById("case-detail-close");

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

  const conceptGraph = {
    automation: {
      integration: 0.34,
      apps_script: 0.30,
      documents: 0.25,
      reporting: 0.22,
      errors: 0.20
    },

    reporting: {
      powerbi: 0.82,
      dashboard: 0.72,
      analytics: 0.66,
      excel: 0.48,
      kpi: 0.46,
      powerquery: 0.36,
      data_consolidation: 0.38,
      planfact: 0.42,
      realtime: 0.28
    },

    powerbi: {
      reporting: 0.90,
      dashboard: 0.88,
      analytics: 0.78,
      kpi: 0.68,
      powerquery: 0.70,
      planfact: 0.58,
      erp: 0.42,
      integration: 0.30,
      realtime: 0.44,
      excel: 0.34
    },

    dashboard: {
      powerbi: 0.74,
      reporting: 0.72,
      analytics: 0.72,
      kpi: 0.66,
      realtime: 0.32,
      excel: 0.30
    },

    analytics: {
      dashboard: 0.62,
      reporting: 0.56,
      powerbi: 0.58,
      kpi: 0.52,
      sales: 0.38,
      finance: 0.34,
      forecast: 0.34
    },

    kpi: {
      dashboard: 0.68,
      analytics: 0.58,
      reporting: 0.54,
      powerbi: 0.54,
      planfact: 0.40
    },

    planfact: {
      reporting: 0.62,
      powerbi: 0.58,
      analytics: 0.48,
      kpi: 0.44,
      finance: 0.30,
      sales: 0.24
    },

    excel: {
      powerquery: 0.72,
      reporting: 0.44,
      dashboard: 0.34,
      data_consolidation: 0.66,
      data_cleaning: 0.48,
      analytics: 0.28
    },

    powerquery: {
      excel: 0.76,
      powerbi: 0.70,
      data_consolidation: 0.74,
      data_cleaning: 0.64,
      reporting: 0.38,
      google_drive: 0.24
    },

    data_consolidation: {
      powerquery: 0.78,
      excel: 0.72,
      data_cleaning: 0.62,
      reporting: 0.50,
      google_drive: 0.38,
      realtime: 0.24
    },

    data_cleaning: {
      powerquery: 0.62,
      data_consolidation: 0.54,
      excel: 0.42,
      data_matching: 0.36,
      errors: 0.32
    },

    pdf: {
      ocr: 0.84,
      invoice: 0.72,
      packing: 0.58,
      documents: 0.70,
      google_drive: 0.30,
      data_matching: 0.28
    },

    invoice: {
      pdf: 0.82,
      ocr: 0.68,
      documents: 0.58,
      packing: 0.38,
      data_matching: 0.34,
      finance: 0.28
    },

    packing: {
      pdf: 0.72,
      ocr: 0.58,
      invoice: 0.38,
      documents: 0.52
    },

    ocr: {
      pdf: 0.82,
      invoice: 0.66,
      documents: 0.72,
      packing: 0.52,
      data_matching: 0.30
    },

    google_drive: {
      google_sheets: 0.36,
      apps_script: 0.44,
      documents: 0.34,
      data_consolidation: 0.38,
      pdf: 0.26
    },

    google_sheets: {
      apps_script: 0.72,
      google_drive: 0.38,
      automation: 0.28,
      reporting: 0.24,
      data_matching: 0.24
    },

    apps_script: {
      google_sheets: 0.72,
      google_drive: 0.50,
      automation: 0.54,
      integration: 0.42,
      telegram: 0.22,
      email: 0.24
    },

    bank: {
      payments: 0.84,
      categorization: 0.62,
      counterparty: 0.54,
      finance: 0.56,
      data_matching: 0.32
    },

    payments: {
      bank: 0.80,
      categorization: 0.62,
      counterparty: 0.48,
      finance: 0.52
    },

    categorization: {
      payments: 0.60,
      bank: 0.48,
      data_matching: 0.46,
      counterparty: 0.28
    },

    counterparty: {
      payments: 0.42,
      bank: 0.36,
      data_matching: 0.52,
      procurement: 0.24
    },

    bom: {
      procurement: 0.88,
      stock: 0.78,
      mrp: 0.86,
      production: 0.54,
      data_matching: 0.26
    },

    procurement: {
      bom: 0.86,
      stock: 0.82,
      mrp: 0.82,
      production: 0.46,
      data_matching: 0.26
    },

    stock: {
      procurement: 0.76,
      bom: 0.68,
      mrp: 0.62,
      production: 0.38
    },

    mrp: {
      bom: 0.86,
      procurement: 0.86,
      stock: 0.70,
      production: 0.58
    },

    production: {
      capacity: 0.82,
      scheduling: 0.78,
      deadline: 0.66,
      priority: 0.42,
      bom: 0.34,
      mrp: 0.34
    },

    capacity: {
      production: 0.88,
      scheduling: 0.76,
      deadline: 0.64,
      priority: 0.36,
      forecast: 0.30
    },

    scheduling: {
      production: 0.80,
      capacity: 0.78,
      deadline: 0.70,
      priority: 0.48
    },

    deadline: {
      scheduling: 0.74,
      production: 0.64,
      capacity: 0.60,
      priority: 0.42
    },

    priority: {
      scheduling: 0.58,
      production: 0.46,
      deadline: 0.44,
      capacity: 0.34
    },

    erp: {
      integration: 0.72,
      powerbi: 0.46,
      reporting: 0.36,
      crm: 0.24,
      mes: 0.32,
      data_matching: 0.24
    },

    crm: {
      integration: 0.70,
      automation: 0.36,
      email: 0.34,
      api: 0.38,
      sales: 0.42
    },

    mes: {
      production: 0.66,
      erp: 0.42,
      integration: 0.48,
      scheduling: 0.32,
      realtime: 0.34
    },

    api: {
      integration: 0.84,
      automation: 0.34,
      webhook: 0.70,
      telegram: 0.28,
      crm: 0.30,
      erp: 0.28
    },

    integration: {
      api: 0.76,
      erp: 0.56,
      crm: 0.52,
      mes: 0.46,
      automation: 0.36,
      data_matching: 0.28
    },

    telegram: {
      bot: 0.96,
      notifications: 0.86,
      api: 0.34,
      integration: 0.30,
      apps_script: 0.22
    },

    bot: {
      telegram: 0.88,
      notifications: 0.82,
      api: 0.30,
      integration: 0.24,
      webapp: 0.18
    },

    notifications: {
      telegram: 0.72,
      bot: 0.66,
      email: 0.40,
      automation: 0.22
    },

    email: {
      documents: 0.46,
      pdf: 0.34,
      automation: 0.36,
      notifications: 0.32,
      integration: 0.24
    },

    documents: {
      pdf: 0.58,
      ocr: 0.54,
      invoice: 0.38,
      email: 0.36,
      automation: 0.28
    },

    webapp: {
      pwa: 0.58,
      automation: 0.28,
      integration: 0.24,
      api: 0.24
    },

    pwa: {
      webapp: 0.74
    },

    data_matching: {
      data_cleaning: 0.42,
      counterparty: 0.32,
      integration: 0.26,
      erp: 0.22
    },

    finance: {
      reporting: 0.40,
      analytics: 0.38,
      payments: 0.36,
      bank: 0.34,
      powerbi: 0.26
    },

    sales: {
      analytics: 0.50,
      reporting: 0.42,
      dashboard: 0.34,
      powerbi: 0.30,
      forecast: 0.36,
      crm: 0.32
    },

    forecast: {
      analytics: 0.46,
      sales: 0.38,
      capacity: 0.26,
      production: 0.24
    },

    errors: {
      automation: 0.24,
      data_cleaning: 0.36,
      data_matching: 0.30
    },

    realtime: {
      reporting: 0.34,
      powerbi: 0.38,
      dashboard: 0.34,
      integration: 0.28
    }
  };

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

  const latinToUk = {
    q:"й",w:"ц",e:"у",r:"к",t:"е",
    y:"н",u:"г",i:"ш",o:"щ",p:"з",
    "[":"х","]":"ї",
    a:"ф",s:"і",d:"в",f:"а",g:"п",
    h:"р",j:"о",k:"л",l:"д",
    ";":"ж","'":"є",
    z:"я",x:"ч",c:"с",v:"м",b:"и",
    n:"т",m:"ь",",":"б",".":"ю"
  };

  const latinToRu = {
    q:"й",w:"ц",e:"у",r:"к",t:"е",
    y:"н",u:"г",i:"ш",o:"щ",p:"з",
    "[":"х","]":"ъ",
    a:"ф",s:"ы",d:"в",f:"а",g:"п",
    h:"р",j:"о",k:"л",l:"д",
    ";":"ж","'":"э",
    z:"я",x:"ч",c:"с",v:"м",b:"и",
    n:"т",m:"ь",",":"б",".":"ю"
  };

  const ukToLatin =
    invertMap(latinToUk);

  const ruToLatin =
    invertMap(latinToRu);

  const mergedConcepts =
    mergeConceptDictionaries();

  const mergedIntents =
    languageLayers
      .flatMap(layer =>
        Array.isArray(layer.intents)
          ? layer.intents
          : []
      );

  const stopWords =
    new Set(
      Array.isArray(dictionary.stopWords)
        ? dictionary.stopWords
            .map(normalize)
            .filter(Boolean)
        : []
    );

  const conceptEntries =
    Object.entries(mergedConcepts)
      .map(([concept, terms]) => {
        const preparedTerms =
          Array.from(
            new Set(
              [concept, ...terms]
                .map(normalize)
                .filter(Boolean)
            )
          ).map(term => ({
            raw: term,
            compact: compact(term),
            tokens: tokenizeRaw(term)
          }));

        return {
          concept,
          terms: preparedTerms
        };
      });

  const indexedCases =
    cases.map(indexCase);

  let latestResults = [];
  let searchTimer = null;
  let detailRequestId = 0;

  function invertMap(map) {
    const output = {};

    Object.entries(map)
      .forEach(([key, value]) => {
        if (!output[value]) {
          output[value] = key;
        }
      });

    return output;
  }

  function normalize(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ё/g, "е")
      .replace(/ґ/g, "г")
      .replace(/[’`´]/g, "'")
      .replace(/[_/\\|]+/g, " ")
      .replace(
        /[^\p{L}\p{N}+#.'&-]+/gu,
        " "
      )
      .replace(/\s+/g, " ")
      .trim();
  }

  function compact(value) {
    return normalize(value)
      .replace(/[\s\-_.']/g, "");
  }

  function tokenizeRaw(value) {
    return normalize(value)
      .split(" ")
      .map(token => token.trim())
      .filter(token => token.length > 1);
  }

  function tokenize(value) {
    return tokenizeRaw(value)
      .filter(token => !stopWords.has(token));
  }

  function convertKeyboard(value, map) {
    const normalized =
      normalize(value);

    let changed = false;

    const converted =
      normalized
        .split("")
        .map(char => {
          if (map[char]) {
            changed = true;
            return map[char];
          }

          return char;
        })
        .join("");

    return changed
      ? converted
      : "";
  }

  function queryVariants(value) {
    const normalized =
      normalize(value);

    const variants =
      new Set();

    if (!normalized) {
      return [];
    }

    variants.add(normalized);
    variants.add(compact(normalized));

    [
      convertKeyboard(
        normalized,
        latinToUk
      ),
      convertKeyboard(
        normalized,
        latinToRu
      ),
      convertKeyboard(
        normalized,
        ukToLatin
      ),
      convertKeyboard(
        normalized,
        ruToLatin
      )
    ]
      .filter(Boolean)
      .forEach(variant => {
        variants.add(variant);
        variants.add(compact(variant));
      });

    return Array.from(variants)
      .filter(Boolean);
  }

  function mergeConceptDictionaries() {
    const output = {};

    const sources = [
      dictionary,
      ...languageLayers
    ];

    sources.forEach(source => {
      if (
        !source ||
        !source.concepts
      ) {
        return;
      }

      Object.entries(
        source.concepts
      ).forEach(
        ([concept, terms]) => {
          if (!output[concept]) {
            output[concept] = [];
          }

          if (Array.isArray(terms)) {
            output[concept]
              .push(...terms);
          }
        }
      );
    });

    Object.keys(output)
      .forEach(concept => {
        output[concept] =
          Array.from(
            new Set(
              output[concept]
                .map(String)
                .filter(Boolean)
            )
          );
      });

    return output;
  }

  function levenshtein(a, b) {
    const left = normalize(a);
    const right = normalize(b);

    if (left === right) {
      return 0;
    }

    if (!left.length) {
      return right.length;
    }

    if (!right.length) {
      return left.length;
    }

    let previous =
      Array.from(
        {
          length:
            right.length + 1
        },
        (_, index) => index
      );

    for (
      let i = 1;
      i <= left.length;
      i++
    ) {
      const current = [i];

      for (
        let j = 1;
        j <= right.length;
        j++
      ) {
        current[j] =
          Math.min(
            current[j - 1] + 1,
            previous[j] + 1,
            previous[j - 1] +
              (
                left[i - 1] ===
                right[j - 1]
                  ? 0
                  : 1
              )
          );
      }

      previous = current;
    }

    return previous[right.length];
  }

  function similarity(a, b) {
    const left = normalize(a);
    const right = normalize(b);

    if (
      !left ||
      !right
    ) {
      return 0;
    }

    if (left === right) {
      return 1;
    }

    if (
      left.length >= 4 &&
      right.startsWith(left)
    ) {
      return 0.92;
    }

    if (
      right.length >= 4 &&
      left.startsWith(right)
    ) {
      return 0.90;
    }

    const longest =
      Math.max(
        left.length,
        right.length
      );

    return Math.max(
      0,
      1 -
        levenshtein(
          left,
          right
        ) /
          longest
    );
  }

  function tokenSetSimilarity(
    leftTokens,
    rightTokens
  ) {
    if (
      !leftTokens.length ||
      !rightTokens.length
    ) {
      return 0;
    }

    let total = 0;

    leftTokens.forEach(left => {
      let best = 0;

      rightTokens.forEach(right => {
        const current =
          similarity(
            left,
            right
          );

        if (current > best) {
          best = current;
        }
      });

      total += best;
    });

    return (
      total /
      leftTokens.length
    );
  }

  function phraseSimilarity(
    query,
    phrase
  ) {
    const queryNormalized =
      normalize(query);

    const phraseNormalized =
      normalize(phrase);

    if (
      !queryNormalized ||
      !phraseNormalized
    ) {
      return 0;
    }

    if (
      queryNormalized ===
      phraseNormalized
    ) {
      return 1;
    }

    if (
      queryNormalized.length >= 4 &&
      phraseNormalized.includes(
        queryNormalized
      )
    ) {
      return 0.92;
    }

    if (
      phraseNormalized.length >= 4 &&
      queryNormalized.includes(
        phraseNormalized
      )
    ) {
      return 0.88;
    }

    const queryTokens =
      tokenize(queryNormalized);

    const phraseTokens =
      tokenize(phraseNormalized);

    const forward =
      tokenSetSimilarity(
        queryTokens,
        phraseTokens
      );

    const backward =
      tokenSetSimilarity(
        phraseTokens,
        queryTokens
      );

    return (
      forward * 0.68 +
      backward * 0.32
    );
  }

  function detectConcepts(rawQuery) {
    const variants =
      queryVariants(rawQuery);

    const queryTokens =
      Array.from(
        new Set(
          variants.flatMap(
            tokenize
          )
        )
      );

    const detected =
      new Map();

    conceptEntries
      .forEach(entry => {
        let best = 0;
        let reason = "";

        entry.terms
          .forEach(term => {
            variants
              .forEach(variant => {
                const variantCompact =
                  compact(variant);

                if (
                  variant ===
                    term.raw ||
                  variantCompact ===
                    term.compact
                ) {
                  if (best < 1) {
                    best = 1;
                    reason = term.raw;
                  }

                  return;
                }

                if (
                  variant.length >= 3 &&
                  term.raw.length >= 3 &&
                  (
                    variant.includes(
                      term.raw
                    ) ||
                    term.raw.includes(
                      variant
                    )
                  )
                ) {
                  if (best < 0.90) {
                    best = 0.90;
                    reason = term.raw;
                  }
                }

                const phraseScore =
                  phraseSimilarity(
                    variant,
                    term.raw
                  );

                if (
                  phraseScore >= 0.76 &&
                  phraseScore > best
                ) {
                  best =
                    phraseScore * 0.94;

                  reason =
                    term.raw;
                }
              });

            queryTokens
              .forEach(queryToken => {
                term.tokens
                  .forEach(termToken => {
                    if (
                      queryToken.length < 4 ||
                      termToken.length < 4
                    ) {
                      return;
                    }

                    const score =
                      similarity(
                        queryToken,
                        termToken
                      );

                    if (
                      score >= 0.78 &&
                      score * 0.84 >
                        best
                    ) {
                      best =
                        score * 0.84;

                      reason =
                        term.raw;
                    }
                  });
              });
          });

        if (best >= 0.62) {
          detected.set(
            entry.concept,
            {
              concept:
                entry.concept,
              confidence: best,
              reason,
              source: "term"
            }
          );
        }
      });

    mergedIntents
      .forEach(intent => {
        if (
          !Array.isArray(
            intent.concepts
          ) ||
          !Array.isArray(
            intent.phrases
          )
        ) {
          return;
        }

        let bestIntent = 0;
        let bestPhrase = "";

        intent.phrases
          .forEach(phrase => {
            variants
              .forEach(variant => {
                const score =
                  phraseSimilarity(
                    variant,
                    phrase
                  );

                if (
                  score >
                  bestIntent
                ) {
                  bestIntent =
                    score;

                  bestPhrase =
                    phrase;
                }
              });
          });

        if (
          bestIntent < 0.58
        ) {
          return;
        }

        intent.concepts
          .forEach(concept => {
            const confidence =
              Math.min(
                1,
                bestIntent * 1.04
              );

            const previous =
              detected.get(
                concept
              );

            if (
              !previous ||
              confidence >
                previous.confidence
            ) {
              detected.set(
                concept,
                {
                  concept,
                  confidence,
                  reason:
                    bestPhrase,
                  source: "intent"
                }
              );
            }
          });
      });

    return Array.from(
      detected.values()
    ).sort(
      (a, b) =>
        b.confidence -
        a.confidence
    );
  }

  function expandConcepts(
    detected
  ) {
    const expanded =
      new Map();

    detected.forEach(match => {
      expanded.set(
        match.concept,
        {
          concept:
            match.concept,
          confidence:
            match.confidence,
          direct: true,
          source:
            match.source,
          reason:
            match.reason
        }
      );
    });

    detected.forEach(match => {
      const neighbours =
        conceptGraph[
          match.concept
        ] || {};

      Object.entries(
        neighbours
      ).forEach(
        ([concept, weight]) => {
          const confidence =
            match.confidence *
            weight;

          if (
            confidence < 0.17
          ) {
            return;
          }

          const previous =
            expanded.get(
              concept
            );

          if (
            !previous ||
            confidence >
              previous.confidence
          ) {
            expanded.set(
              concept,
              {
                concept,
                confidence,
                direct: false,
                source: "graph",
                reason:
                  match.concept
              }
            );
          }
        }
      );
    });

    return Array.from(
      expanded.values()
    ).sort(
      (a, b) =>
        b.confidence -
        a.confidence
    );
  }

  function prepareValue(value) {
    const normalized =
      normalize(value);

    return {
      original:
        String(value || ""),
      normalized,
      compact:
        compact(normalized),
      tokens:
        tokenize(normalized)
    };
  }

  function prepareValues(values) {
    return (
      Array.isArray(values)
        ? values
        : [values]
    )
      .filter(
        value =>
          value !== null &&
          value !== undefined
      )
      .map(prepareValue);
  }

  function indexCase(item) {
    return {
      item,
      conceptSet:
        new Set(
          Array.isArray(
            item.concepts
          )
            ? item.concepts
            : []
        ),

      fields: [
        {
          weight: 125,
          values:
            prepareValues(
              item.title
            )
        },
        {
          weight: 96,
          values:
            prepareValues(
              item.tools
            )
        },
        {
          weight: 88,
          values:
            prepareValues(
              item.aliases
            )
        },
        {
          weight: 82,
          values:
            prepareValues(
              item.problems
            )
        },
        {
          weight: 70,
          values:
            prepareValues(
              item.outcomes
            )
        },
        {
          weight: 62,
          values:
            prepareValues(
              item.tags
            )
        },
        {
          weight: 38,
          values:
            prepareValues(
              item.short
            )
        },
        {
          weight: 30,
          values:
            prepareValues(
              item.type
            )
        }
      ]
    };
  }

  function scorePreparedValue(
    prepared,
    variants,
    queryTokens,
    weight
  ) {
    let score = 0;
    let matched = false;

    variants
      .forEach(variant => {
        const variantCompact =
          compact(variant);

        if (
          variant ===
            prepared.normalized ||
          variantCompact ===
            prepared.compact
        ) {
          score = Math.max(
            score,
            weight * 1.35
          );

          matched = true;
          return;
        }

        if (
          variant.length >= 3 &&
          prepared.normalized
            .includes(variant)
        ) {
          score = Math.max(
            score,
            weight
          );

          matched = true;
        }

        if (
          variantCompact.length >= 4 &&
          prepared.compact
            .includes(
              variantCompact
            )
        ) {
          score = Math.max(
            score,
            weight * 0.90
          );

          matched = true;
        }
      });

    if (
      queryTokens.length &&
      prepared.tokens.length
    ) {
      const tokenScore =
        tokenSetSimilarity(
          queryTokens,
          prepared.tokens
        );

      if (
        tokenScore >= 0.66
      ) {
        score +=
          weight *
          tokenScore *
          0.48;

        matched = true;
      }
    }

    return {
      score,
      matched
    };
  }

  function scoreCase(
    indexed,
    rawQuery,
    detectedConcepts,
    expandedConcepts
  ) {
    const variants =
      queryVariants(rawQuery);

    const queryTokens =
      Array.from(
        new Set(
          variants.flatMap(
            tokenize
          )
        )
      );

    let score = 0;

    const reasons =
      new Set();

    const matchedConcepts =
      [];

    indexed.fields
      .forEach(field => {
        field.values
          .forEach(value => {
            const result =
              scorePreparedValue(
                value,
                variants,
                queryTokens,
                field.weight
              );

            score +=
              result.score;

            if (
              result.matched &&
              value.original
            ) {
              reasons.add(
                value.original
              );
            }
          });
      });

    detectedConcepts
      .forEach(match => {
        if (
          !indexed.conceptSet
            .has(match.concept)
        ) {
          return;
        }

        score +=
          122 *
          match.confidence;

        matchedConcepts.push({
          concept:
            match.concept,
          confidence:
            match.confidence,
          direct: true
        });

        if (match.reason) {
          reasons.add(
            match.reason
          );
        }
      });

    expandedConcepts
      .forEach(match => {
        if (
          match.direct ||
          !indexed.conceptSet
            .has(match.concept)
        ) {
          return;
        }

        score +=
          74 *
          match.confidence;

        matchedConcepts.push({
          concept:
            match.concept,
          confidence:
            match.confidence,
          direct: false
        });
      });

    const directCount =
      matchedConcepts
        .filter(
          match =>
            match.direct
        ).length;

    const totalCount =
      new Set(
        matchedConcepts
          .map(
            match =>
              match.concept
          )
      ).size;

    if (directCount >= 2) {
      score +=
        38 *
        directCount;
    }

    if (totalCount >= 3) {
      score +=
        16 *
        Math.min(
          totalCount,
          6
        );
    }

    if (
      score > 0 &&
      indexed.item.featured
    ) {
      score += 4;
    }

    return {
      item:
        indexed.item,
      score,
      reasons:
        Array.from(reasons)
          .filter(Boolean)
          .slice(0, 6),
      matchedConcepts:
        matchedConcepts
          .sort(
            (a, b) =>
              b.confidence -
              a.confidence
          )
    };
  }

  function searchCases(rawQuery) {
    const query =
      normalize(rawQuery);

    if (!query) {
      return indexedCases
        .slice()
        .sort(
          (a, b) =>
            b.item.priority -
            a.item.priority
        )
        .slice(0, 6)
        .map(indexed => ({
          item:
            indexed.item,
          score:
            indexed.item
              .priority,
          reasons:
            indexed.item.tags
              .slice(0, 3),
          matchedConcepts:
            indexed.item.concepts
              .slice(0, 3)
              .map(concept => ({
                concept,
                confidence: 1,
                direct: true
              }))
        }));
    }

    const detected =
      detectConcepts(query);

    const expanded =
      expandConcepts(detected);

    const scored =
      indexedCases
        .map(indexed =>
          scoreCase(
            indexed,
            query,
            detected,
            expanded
          )
        );

    const strongest =
      scored.reduce(
        (max, result) =>
          Math.max(
            max,
            result.score
          ),
        0
      );

    const threshold =
      strongest >= 250
        ? Math.max(
            34,
            strongest * 0.13
          )
        : 34;

    return scored
      .filter(
        result =>
          result.score >=
          threshold
      )
      .sort((a, b) => {
        if (
          Math.abs(
            b.score -
            a.score
          ) > 0.01
        ) {
          return (
            b.score -
            a.score
          );
        }

        return (
          b.item.priority -
          a.item.priority
        );
      })
      .slice(0, 10);
  }

  function resultBadge(
    index,
    result,
    query
  ) {
    if (!query) {
      return result.item.featured
        ? "FEATURED"
        : "RECOMMENDED";
    }

    if (index === 0) {
      return "TOP MATCH";
    }

    if (
      result.score >= 220
    ) {
      return "STRONG MATCH";
    }

    return "RELEVANT";
  }

  function reasonLabels(
    result
  ) {
    const labels = [];

    result.matchedConcepts
      .forEach(match => {
        const concept =
          typeof match === "string"
            ? match
            : match.concept;

        const label =
          conceptLabels[concept];

        if (
          label &&
          !labels.includes(label)
        ) {
          labels.push(label);
        }
      });

    if (
      labels.length < 3 &&
      Array.isArray(
        result.item.tags
      )
    ) {
      result.item.tags
        .forEach(tag => {
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

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function renderResults(
    rawQuery
  ) {
    const query =
      normalize(rawQuery);

    const detectedForDisplay =
  query
    ? detectConcepts(query)
    : [];

const expandedForDisplay =
  query
    ? expandConcepts(detectedForDisplay)
    : [];

if (
  understoodNode &&
  conceptsNode
) {
  conceptsNode.innerHTML = "";

  if (!query) {
    understoodNode.hidden = true;
  } else {
    const displayConcepts =
      expandedForDisplay
        .filter(match =>
          match.direct ||
          match.confidence >= 0.28
        )
        .slice(0, 5);

    if (displayConcepts.length) {
      understoodNode.hidden = false;

      displayConcepts.forEach(match => {
        const chip =
          document.createElement("span");

        chip.className =
          match.direct
            ? "case-finder__concept case-finder__concept--direct"
            : "case-finder__concept";

        chip.textContent =
          conceptLabels[match.concept] ||
          match.concept;

        conceptsNode.appendChild(chip);
      });
    } else {
      understoodNode.hidden = true;
    }
  }
}

    latestResults =
      searchCases(query);

    resultsNode.innerHTML = "";

    emptyNode.hidden =
      latestResults.length > 0;

    captionNode.textContent =
      query
        ? "НАЙБІЛЬШ РЕЛЕВАНТНІ РІШЕННЯ"
        : "РЕКОМЕНДОВАНІ КЕЙСИ";

    countNode.textContent =
      query
        ? `Знайдено: ${latestResults.length}`
        : `${latestResults.length} кейсів`;

    stateNode.textContent =
      query
        ? `SMART MATCH / ${query.toUpperCase()}`
        : "SMART MATCHING / UA · RU · EN";

    latestResults
      .forEach(
        (result, index) => {
          const item =
            result.item;

          const labels =
            reasonLabels(
              result
            );

          const card =
            document.createElement(
              "article"
            );

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
                ${escapeHtml(item.type)}
              </div>

              <h3>
                ${escapeHtml(item.title)}
              </h3>

              <p>
                ${escapeHtml(item.short)}
              </p>

              <div class="case-result-card__why">
                <span>
                  ЧОМУ ЦЕЙ КЕЙС
                </span>

                <div>
                  ${labels
                    .map(
                      label =>
                        `<i>${escapeHtml(label)}</i>`
                    )
                    .join("")}
                </div>
              </div>

              <div class="case-result-card__footer">
                <span>
                  ${item.tools
                    .slice(0, 4)
                    .map(escapeHtml)
                    .join(" · ")}
                </span>

                <strong>
                  ВІДКРИТИ ↘
                </strong>
              </div>
            </button>
          `;

          resultsNode
            .appendChild(card);
        }
      );

    resultsNode
      .querySelectorAll(
        "[data-result-case]"
      )
      .forEach(button => {
        button.addEventListener(
          "click",
          () => {
            openCase(
              Number(
                button.dataset
                  .resultCase
              )
            );
          }
        );
      });
  }

  function executeCaseScript(
    code,
    sourceUrl
  ) {
    const runner =
      new Function(
        `${code}\n//# sourceURL=${sourceUrl}`
      );

    runner();
  }

  async function openCase(
    caseId
  ) {
    const item =
      cases.find(
        entry =>
          entry.id === caseId
      );

    if (!item) {
      return;
    }

    const requestId =
      ++detailRequestId;

    stage.hidden = false;
    stage.classList.add(
      "loading"
    );

    stageBody.innerHTML = "";
    stageLoading.hidden = false;

    stageNumber.textContent =
      `CASE ${String(caseId).padStart(2, "0")}`;

    stageTitle.textContent =
      item.title;

    stage.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

    try {
      const basePath =
        `/solutions/cases/case-${caseId}`;

      const [
        htmlResponse,
        jsResponse
      ] = await Promise.all([
        fetch(
          `${basePath}/case-${caseId}.html`
        ),
        fetch(
          `${basePath}/case-${caseId}.js?v=2`
        )
      ]);

      if (
        !htmlResponse.ok
      ) {
        throw new Error(
          `Case ${caseId} HTML failed`
        );
      }

      if (
        !jsResponse.ok
      ) {
        throw new Error(
          `Case ${caseId} JS failed`
        );
      }

      const [
        caseHtml,
        caseJs
      ] = await Promise.all([
        htmlResponse.text(),
        jsResponse.text()
      ]);

      if (
        requestId !==
        detailRequestId
      ) {
        return;
      }

      stageBody.innerHTML =
        caseHtml;

      executeCaseScript(
        caseJs,
        `${basePath}/case-${caseId}.js`
      );

      stage.classList.remove(
        "loading"
      );

      stageLoading.hidden =
        true;
    } catch (error) {
      if (
        requestId !==
        detailRequestId
      ) {
        return;
      }

      stage.classList.remove(
        "loading"
      );

      stageLoading.hidden =
        true;

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
    detailRequestId++;

    stage.hidden = true;
    stageBody.innerHTML = "";

    document
      .getElementById(
        "case-finder"
      )
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
  }

  function scheduleSearch() {
    clearTimeout(
      searchTimer
    );

    searchTimer =
      setTimeout(() => {
        renderResults(
          input.value
        );
      }, 60);
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
          latestResults[0]
            .item.id
        );
      }

      if (
        event.key === "Escape"
      ) {
        input.value = "";
        renderResults("");
        input.blur();
      }
    }
  );

  clearButton
    ?.addEventListener(
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
            button.dataset
              .searchSuggestion;

          renderResults(
            input.value
          );

          input.focus();
        }
      );
    });

  document
    .querySelectorAll(
      "[data-open-case]"
    )
    .forEach(button => {
      button.addEventListener(
        "click",
        () => {
          openCase(
            Number(
              button.dataset
                .openCase
            )
          );
        }
      );
    });

  stageClose
    ?.addEventListener(
      "click",
      closeCase
    );

  const processSteps =
  Array.from(
    document.querySelectorAll(
      "[data-process-step]"
    )
  );

const processScenes =
  Array.from(
    document.querySelectorAll(
      "[data-process-scene]"
    )
  );

const processStatus =
  document.getElementById(
    "process-stage-status"
  );

const processLabels = {
  1: "STAGE 01 / DISCOVERY",
  2: "STAGE 02 / DATA",
  3: "STAGE 03 / LOGIC",
  4: "STAGE 04 / AUTOMATION",
  5: "STAGE 05 / CONTROL"
};

function activateProcessStage(
  stageNumber
) {
  processSteps.forEach(step => {
    step.classList.toggle(
      "is-active",
      Number(
        step.dataset.processStep
      ) === stageNumber
    );
  });

  processScenes.forEach(scene => {
    scene.classList.toggle(
      "is-active",
      Number(
        scene.dataset.processScene
      ) === stageNumber
    );
  });

  if (processStatus) {
    processStatus.textContent =
      processLabels[stageNumber] ||
      "";
  }
}

if (
  processSteps.length &&
  processScenes.length
) {
  const processObserver =
    new IntersectionObserver(
      entries => {
        const visible =
          entries
            .filter(
              entry =>
                entry.isIntersecting
            )
            .sort(
              (a, b) =>
                b.intersectionRatio -
                a.intersectionRatio
            );

        if (!visible.length) {
          return;
        }

        activateProcessStage(
          Number(
            visible[0].target
              .dataset.processStep
          )
        );
      },
      {
        root: null,
        rootMargin:
          "-28% 0px -42% 0px",
        threshold: [
          0,
          0.2,
          0.4,
          0.6,
          0.8
        ]
      }
    );

  processSteps.forEach(step => {
    processObserver.observe(step);
  });

  processSteps.forEach(step => {
    step.addEventListener(
      "mouseenter",
      () => {
        activateProcessStage(
          Number(
            step.dataset
              .processStep
          )
        );
      }
    );
  });
}
  renderResults("");
})();
