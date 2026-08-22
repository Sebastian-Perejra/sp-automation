(() => {
  const ui =
  window.SOLUTIONS_UI || {};

const finderUi =
  ui.finder || {};

const processUi =
  ui.process || {};

const heroUi =
  Array.isArray(ui.hero)
    ? ui.hero
    : [];

const biUi =
  ui.bi || {};

const bomUi =
  ui.bom || {};
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

const conceptLabels =
  ui.concepts || {};

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
          .slice(0, 7),
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
        .slice(0, 7)
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
    ? finderUi.relevant
    : finderUi.recommended;

countNode.textContent =
  query
    ? `${finderUi.found}: ${latestResults.length}`
    : `${latestResults.length} ${finderUi.cases}`;

stateNode.textContent =
  query
    ? `SMART MATCH / ${query.toUpperCase()}`
    : finderUi.smartDefault;

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
                  ${finderUi.why}
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
                  ${finderUi.open}
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

const caseRoot =
  stageBody.firstElementChild;

if (
  caseRoot &&
  !caseRoot.querySelector(
    "[data-pricing-estimator-open]"
  )
) {
  const cta =
    caseRoot.querySelector(
      '[class$="-cta"]'
    );

  if (cta) {
    const estimatorButton =
      document.createElement(
        "button"
      );

    estimatorButton.type =
      "button";

    estimatorButton.className =
      "case-detail-estimator-button";

    estimatorButton.setAttribute(
      "data-pricing-estimator-open",
      ""
    );

    estimatorButton.innerHTML =
      'Розрахувати вартість <span>▦</span>';

    cta.appendChild(
      estimatorButton
    );
  }
}

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

  const biPreview =
  document.querySelector(
    ".featured-case--01 .bi-preview"
  );

if (biPreview) {
  const filters =
    Array.from(
      biPreview.querySelectorAll(
        ".bi-preview__filters span"
      )
    );

  const kpiCards =
    Array.from(
      biPreview.querySelectorAll(
        ".bi-preview__kpis > div"
      )
    );

  const bars =
    Array.from(
      biPreview.querySelectorAll(
        ".bi-preview__bars i"
      )
    );

  const chartValue =
    biPreview.querySelector(
      ".bi-preview__chart-head strong"
    );

  const donutValue =
    biPreview.querySelector(
      ".bi-preview__donut span"
    );

  const donut =
    biPreview.querySelector(
      ".bi-preview__donut"
    );

  const signal =
    biPreview.querySelector(
      ".bi-preview__signal p"
    );

  const revenue =
    kpiCards[0]?.querySelector(
      "strong"
    );

  const revenueDelta =
    kpiCards[0]?.querySelector(
      "span"
    );

  const profit =
    kpiCards[1]?.querySelector(
      "strong"
    );

  const profitDelta =
    kpiCards[1]?.querySelector(
      "span"
    );

  const margin =
    kpiCards[2]?.querySelector(
      "strong"
    );

  const marginPlan =
    kpiCards[2]?.querySelector(
      "span"
    );

  const filterOptions = [
    ["2026", "2025", "2024"],
    [
      "ALL REGIONS",
      "WEST",
      "CENTRAL",
      "EAST"
    ],
    [
      "ALL CHANNELS",
      "B2B",
      "RETAIL",
      "ONLINE"
    ]
  ];

  const states = {
    year: 0,
    region: 0,
    channel: 0
  };

  const scenarios = [
    {
      revenue: "12.8M",
      revenueDelta: "▲ 8.4%",
      profit: "4.1M",
      profitDelta: "▲ 6.9%",
      margin: "32.0%",
      marginPlan: "PLAN 30.5%",
      chart: "94.7%",
      donut: 32,
      bars: [42, 58, 53, 69, 76, 86, 82, 94],
      signal:
        "Загальний результат стабільний: факт близький до плану, маржа вище цільового рівня."
    },
    {
      revenue: "10.9M",
      revenueDelta: "▲ 4.1%",
      profit: "3.2M",
      profitDelta: "▲ 2.7%",
      margin: "29.4%",
      marginPlan: "PLAN 30.5%",
      chart: "88.2%",
      donut: 29,
      bars: [34, 46, 51, 58, 63, 69, 78, 82],
      signal:
        "По вибраному зрізу виручка зростає, але маржа нижча за план. Потрібна перевірка структури продажів."
    },
    {
      revenue: "14.6M",
      revenueDelta: "▲ 11.8%",
      profit: "5.0M",
      profitDelta: "▲ 9.6%",
      margin: "34.3%",
      marginPlan: "PLAN 30.5%",
      chart: "101.6%",
      donut: 34,
      bars: [48, 55, 62, 74, 81, 89, 96, 100],
      signal:
        "Вибраний сегмент перевищує план. Найбільший внесок дають останні періоди."
    },
    {
      revenue: "9.7M",
      revenueDelta: "▼ 1.9%",
      profit: "2.8M",
      profitDelta: "▼ 3.4%",
      margin: "28.9%",
      marginPlan: "PLAN 30.5%",
      chart: "82.4%",
      donut: 29,
      bars: [61, 57, 52, 49, 45, 54, 59, 63],
      signal:
        "Є відхилення від плану. Варто перевірити регіон, канал і динаміку останніх періодів."
    }
  ];

  function getScenarioIndex() {
    return (
      states.year +
      states.region * 2 +
      states.channel * 3
    ) % scenarios.length;
  }

  function applyScenario() {
    const scenario =
      scenarios[
        getScenarioIndex()
      ];

    if (revenue) {
      revenue.textContent =
        scenario.revenue;
    }

    if (revenueDelta) {
      revenueDelta.textContent =
        scenario.revenueDelta;
    }

    if (profit) {
      profit.textContent =
        scenario.profit;
    }

    if (profitDelta) {
      profitDelta.textContent =
        scenario.profitDelta;
    }

    if (margin) {
      margin.textContent =
        scenario.margin;
    }

    if (marginPlan) {
      marginPlan.textContent =
        scenario.marginPlan;
    }

    if (chartValue) {
      chartValue.textContent =
        scenario.chart;
    }

    if (donutValue) {
      donutValue.textContent =
        `${scenario.donut}%`;
    }

    if (donut) {
      donut.style.background =
        `conic-gradient(
          var(--solutions-lime) 0 ${scenario.donut}%,
          rgba(166,255,72,.08) ${scenario.donut}% 100%
        )`;
    }

    bars.forEach(
      (bar, index) => {
        bar.style.height =
          `${scenario.bars[index]}%`;
      }
    );

    if (signal) {
      signal.textContent =
        scenario.signal;
    }
  }

  filters.forEach(
    (filter, index) => {
      filter.setAttribute(
        "role",
        "button"
      );

      filter.tabIndex = 0;

      const activate = () => {
        const keys = [
          "year",
          "region",
          "channel"
        ];

        const key =
          keys[index];

        states[key] =
          (
            states[key] + 1
          ) %
          filterOptions[index]
            .length;

        filter.textContent =
          filterOptions[index][
            states[key]
          ];

        filters.forEach(
          item =>
            item.classList.remove(
              "is-active"
            )
        );

        filter.classList.add(
          "is-active"
        );

        applyScenario();
      };

      filter.addEventListener(
        "click",
        activate
      );

      filter.addEventListener(
        "keydown",
        event => {
          if (
            event.key === "Enter" ||
            event.key === " "
          ) {
            event.preventDefault();
            activate();
          }
        }
      );
    }
  );

  kpiCards.forEach(
    (card, index) => {
      card.setAttribute(
        "role",
        "button"
      );

      card.tabIndex = 0;

      const activate = () => {
        kpiCards.forEach(
          item =>
            item.classList.remove(
              "is-active"
            )
        );

        card.classList.add(
          "is-active"
        );

        const texts = [
          "Виручка показує загальний обсяг продажів у вибраному зрізі.",
          "Gross Profit показує фінансовий результат після зміни фільтрів.",
          "Маржа одразу порівнюється з цільовим плановим рівнем."
        ];

        if (signal) {
          signal.textContent =
            texts[index];
        }
      };

      card.addEventListener(
        "click",
        activate
      );

      card.addEventListener(
        "keydown",
        event => {
          if (
            event.key === "Enter" ||
            event.key === " "
          ) {
            event.preventDefault();
            activate();
          }
        }
      );
    }
  );

  bars.forEach(
    (bar, index) => {
      bar.setAttribute(
        "role",
        "button"
      );

      bar.tabIndex = 0;

      const activate = () => {
        bars.forEach(
          item =>
            item.classList.remove(
              "is-active"
            )
        );

        bar.classList.add(
          "is-active"
        );

        if (chartValue) {
          chartValue.textContent =
            `${82 + index * 2.4}%`;
        }

        if (signal) {
          signal.textContent =
            `Період ${index + 1}: вибрано окрему точку для детальнішого аналізу план / факт.`;
        }
      };

      bar.addEventListener(
        "click",
        activate
      );

      bar.addEventListener(
        "keydown",
        event => {
          if (
            event.key === "Enter" ||
            event.key === " "
          ) {
            event.preventDefault();
            activate();
          }
        }
      );
    }
  );
}

  const capacityPreview =
  document.querySelector(
    ".featured-case--02 .capacity-preview"
  );

if (capacityPreview) {
  const modes =
    Array.from(
      capacityPreview.querySelectorAll(
        ".capacity-preview__mode span"
      )
    );

  const lines =
    Array.from(
      capacityPreview.querySelectorAll(
        ".capacity-preview__line"
      )
    );

  const days =
    Array.from(
      capacityPreview.querySelectorAll(
        ".capacity-preview__calendar span"
      )
    );

  const orders =
    Array.from(
      capacityPreview.querySelectorAll(
        ".capacity-preview__orders > div"
      )
    );

  const scenarios = {
    queue: {
      lines: [
        {
          capacity: 250,
          load: 64
        },
        {
          capacity: 400,
          load: 78
        },
        {
          capacity: 600,
          load: 57
        }
      ],
      days: [
        "free",
        "medium",
        "medium",
        "full",
        "full",
        "medium",
        "free",
        "medium",
        "full",
        "full",
        "medium",
        "free",
        "medium",
        "medium"
      ],
      orders: [
        {
          priority: "NORMAL",
          date: "08.08 → 11.08"
        },
        {
          priority: "NORMAL",
          date: "11.08 → 13.08"
        },
        {
          priority: "NORMAL",
          date: "14.08 → 15.08"
        }
      ]
    },

    priority: {
      lines: [
        {
          capacity: 250,
          load: 72
        },
        {
          capacity: 400,
          load: 88
        },
        {
          capacity: 600,
          load: 61
        }
      ],
      days: [
        "free",
        "medium",
        "full",
        "full",
        "medium",
        "free",
        "medium",
        "full",
        "full",
        "medium",
        "free",
        "medium",
        "full",
        "medium"
      ],
      orders: [
        {
          priority: "URGENT",
          date: "08.08 → 10.08"
        },
        {
          priority: "HIGH",
          date: "11.08 → 12.08"
        },
        {
          priority: "NORMAL",
          date: "14.08 → 14.08"
        }
      ]
    }
  };

  let activeMode =
    "priority";

  function applyCapacityScenario() {
    const scenario =
      scenarios[activeMode];

    lines.forEach(
      (line, index) => {
        const data =
          scenario.lines[index];

        const capacity =
          line.querySelector(
            "strong"
          );

        const track =
          line.querySelector(
            ".capacity-preview__track i"
          );

        const load =
          line.querySelector(
            "b"
          );

        if (capacity) {
          capacity.textContent =
            data.capacity;
        }

        if (track) {
          track.style.width =
            `${data.load}%`;
        }

        if (load) {
          load.textContent =
            `${data.load}%`;
        }
      }
    );

    days.forEach(
      (day, index) => {
        day.classList.remove(
          "free",
          "medium",
          "full",
          "is-active"
        );

        day.classList.add(
          scenario.days[index]
        );
      }
    );

    orders.forEach(
      (order, index) => {
        const priority =
          order.querySelector(
            "strong"
          );

        const date =
          order.querySelector(
            "small"
          );

        if (priority) {
          priority.textContent =
            scenario.orders[index]
              .priority;
        }

        if (date) {
          date.textContent =
            scenario.orders[index]
              .date;
        }
      }
    );
  }

  modes.forEach(
    (mode, index) => {
      mode.setAttribute(
        "role",
        "button"
      );

      mode.tabIndex = 0;

      const activate = () => {
        activeMode =
          index === 0
            ? "queue"
            : "priority";

        modes.forEach(
          item =>
            item.classList.remove(
              "active"
            )
        );

        mode.classList.add(
          "active"
        );

        lines.forEach(
          item =>
            item.classList.remove(
              "is-active"
            )
        );

        orders.forEach(
          item =>
            item.classList.remove(
              "is-active"
            )
        );

        days.forEach(
          item =>
            item.classList.remove(
              "is-active"
            )
        );

        applyCapacityScenario();
      };

      mode.addEventListener(
        "click",
        activate
      );

      mode.addEventListener(
        "keydown",
        event => {
          if (
            event.key === "Enter" ||
            event.key === " "
          ) {
            event.preventDefault();
            activate();
          }
        }
      );
    }
  );

  lines.forEach(
    (line, index) => {
      line.setAttribute(
        "role",
        "button"
      );

      line.tabIndex = 0;

      const activate = () => {
        lines.forEach(
          item =>
            item.classList.remove(
              "is-active"
            )
        );

        line.classList.add(
          "is-active"
        );

        const lineLoads = [
          [82, 76, 91, 94, 73, 44, 68, 85, 92, 79, 48, 67, 88, 71],
          [58, 72, 89, 96, 84, 65, 75, 91, 94, 86, 63, 77, 92, 81],
          [41, 55, 62, 76, 68, 39, 51, 66, 78, 71, 43, 59, 73, 64]
        ];

        days.forEach(
          (day, dayIndex) => {
            const load =
              lineLoads[index][
                dayIndex
              ];

            day.classList.remove(
              "free",
              "medium",
              "full",
              "is-active"
            );

            if (load >= 85) {
              day.classList.add(
                "full"
              );
            } else if (
              load >= 60
            ) {
              day.classList.add(
                "medium"
              );
            } else {
              day.classList.add(
                "free"
              );
            }
          }
        );
      };

      line.addEventListener(
        "click",
        activate
      );

      line.addEventListener(
        "keydown",
        event => {
          if (
            event.key === "Enter" ||
            event.key === " "
          ) {
            event.preventDefault();
            activate();
          }
        }
      );
    }
  );

  days.forEach(
    (day, index) => {
      day.setAttribute(
        "role",
        "button"
      );

      day.tabIndex = 0;

      const activate = () => {
        days.forEach(
          item =>
            item.classList.remove(
              "is-active"
            )
        );

        day.classList.add(
          "is-active"
        );

        orders.forEach(
          item =>
            item.classList.remove(
              "is-active"
            )
        );

        if (index <= 4) {
          orders[0]
            ?.classList.add(
              "is-active"
            );
        } else if (
          index <= 9
        ) {
          orders[1]
            ?.classList.add(
              "is-active"
            );
        } else {
          orders[2]
            ?.classList.add(
              "is-active"
            );
        }
      };

      day.addEventListener(
        "click",
        activate
      );

      day.addEventListener(
        "keydown",
        event => {
          if (
            event.key === "Enter" ||
            event.key === " "
          ) {
            event.preventDefault();
            activate();
          }
        }
      );
    }
  );

  orders.forEach(
    (order, index) => {
      order.setAttribute(
        "role",
        "button"
      );

      order.tabIndex = 0;

      const activate = () => {
        orders.forEach(
          item =>
            item.classList.remove(
              "is-active"
            )
        );

        order.classList.add(
          "is-active"
        );

        lines.forEach(
          item =>
            item.classList.remove(
              "is-active"
            )
        );

        lines[
          index % lines.length
        ]?.classList.add(
          "is-active"
        );

        days.forEach(
          item =>
            item.classList.remove(
              "is-active"
            )
        );

        const ranges = [
          [2, 3, 4],
          [7, 8, 9],
          [11, 12, 13]
        ];

        ranges[index]
          .forEach(dayIndex => {
            days[
              dayIndex
            ]?.classList.add(
              "is-active"
            );
          });
      };

      order.addEventListener(
        "click",
        activate
      );

      order.addEventListener(
        "keydown",
        event => {
          if (
            event.key === "Enter" ||
            event.key === " "
          ) {
            event.preventDefault();
            activate();
          }
        }
      );
    }
  );

  applyCapacityScenario();
}

  const bomPreview =
  document.querySelector(
    ".featured-case--03 .bom-preview"
  );

if (bomPreview) {
  const orderCards =
    Array.from(
      bomPreview.querySelectorAll(
        ".bom-preview__orders > div"
      )
    );

  const flowNodes =
    Array.from(
      bomPreview.querySelectorAll(
        ".bom-preview__flow-node"
      )
    );

  const tableRows =
    Array.from(
      bomPreview.querySelectorAll(
        ".bom-preview__row:not(.bom-preview__row--head)"
      )
    );

  const footerCount =
    bomPreview.querySelector(
      ".bom-preview__footer strong"
    );

  const scenarios = [
    {
      orderQty: 10,
      rows: [
        ["Motor M-24", 20, 7, 13],
        ["Controller C-8", 30, 12, 18],
        ["Frame F-16", 10, 20, 0],
        ["Bearing B-04", 40, 19, 21]
      ]
    },
    {
      orderQty: 5,
      rows: [
        ["Motor M-24", 5, 7, 0],
        ["Controller C-8", 10, 12, 0],
        ["Frame F-16", 10, 20, 0],
        ["Bearing B-04", 30, 19, 11]
      ]
    },
    {
      orderQty: 3,
      rows: [
        ["Motor M-24", 6, 7, 0],
        ["Controller C-8", 6, 12, 0],
        ["Frame F-16", 3, 20, 0],
        ["Bearing B-04", 12, 19, 0]
      ]
    }
  ];

  function animateFlow() {
    flowNodes.forEach(
      node =>
        node.classList.remove(
          "is-active"
        )
    );

    flowNodes.forEach(
      (node, index) => {
        setTimeout(
          () => {
            flowNodes.forEach(
              item =>
                item.classList.remove(
                  "is-active"
                )
            );

            node.classList.add(
              "is-active"
            );
          },
          index * 220
        );
      }
    );

    setTimeout(
      () => {
        flowNodes.forEach(
          item =>
            item.classList.remove(
              "is-active"
            )
        );

        flowNodes[
          flowNodes.length - 1
        ]?.classList.add(
          "is-active"
        );
      },
      flowNodes.length * 220
    );
  }

  function applyBomScenario(index) {
    const scenario =
      scenarios[index];

    orderCards.forEach(
      item =>
        item.classList.remove(
          "is-active"
        )
    );

    orderCards[index]
      ?.classList.add(
        "is-active"
      );

    tableRows.forEach(
      (row, rowIndex) => {
        const data =
          scenario.rows[rowIndex];

        if (!data) {
          return;
        }

        const cells =
          row.querySelectorAll(
            "span, strong"
          );

        if (cells[0]) {
          cells[0].textContent =
            data[0];
        }

        if (cells[1]) {
          cells[1].textContent =
            data[1];
        }

        if (cells[2]) {
          cells[2].textContent =
            data[2];
        }

        if (cells[3]) {
          cells[3].textContent =
            data[3];
        }

        row.classList.remove(
          "is-zero",
          "is-buy"
        );

        if (data[3] === 0) {
          row.classList.add(
            "is-zero"
          );
        } else {
          row.classList.add(
            "is-buy"
          );
        }
      }
    );

    const buyGroups =
      scenario.rows.filter(
        row => row[3] > 0
      ).length;

    if (footerCount) {
      footerCount.textContent =
        `${buyGroups} COMPONENT GROUPS`;
    }

    animateFlow();
  }

  orderCards.forEach(
    (card, index) => {
      card.setAttribute(
        "role",
        "button"
      );

      card.tabIndex = 0;

      const activate = () => {
        applyBomScenario(index);
      };

      card.addEventListener(
        "click",
        activate
      );

      card.addEventListener(
        "keydown",
        event => {
          if (
            event.key === "Enter" ||
            event.key === " "
          ) {
            event.preventDefault();
            activate();
          }
        }
      );
    }
  );

  flowNodes.forEach(
    (node, index) => {
      node.setAttribute(
        "role",
        "button"
      );

      node.tabIndex = 0;

      const activate = () => {
        flowNodes.forEach(
          item =>
            item.classList.remove(
              "is-active"
            )
        );

        node.classList.add(
          "is-active"
        );

        tableRows.forEach(
          item =>
            item.classList.remove(
              "is-highlighted"
            )
        );

        if (index === 0) {
          orderCards.forEach(
            item =>
              item.classList.add(
                "is-soft-active"
              )
          );
        } else {
          orderCards.forEach(
            item =>
              item.classList.remove(
                "is-soft-active"
              )
          );
        }

        if (index === 3) {
          tableRows.forEach(
            row => {
              const buy =
                row.querySelector(
                  "strong"
                );

              if (
                buy &&
                Number(
                  buy.textContent
                ) > 0
              ) {
                row.classList.add(
                  "is-highlighted"
                );
              }
            }
          );
        }
      };

      node.addEventListener(
        "click",
        activate
      );

      node.addEventListener(
        "keydown",
        event => {
          if (
            event.key === "Enter" ||
            event.key === " "
          ) {
            event.preventDefault();
            activate();
          }
        }
      );
    }
  );

  tableRows.forEach(
    row => {
      row.setAttribute(
        "role",
        "button"
      );

      row.tabIndex = 0;

      const activate = () => {
        tableRows.forEach(
          item =>
            item.classList.remove(
              "is-highlighted"
            )
        );

        row.classList.add(
          "is-highlighted"
        );
      };

      row.addEventListener(
        "click",
        activate
      );

      row.addEventListener(
        "keydown",
        event => {
          if (
            event.key === "Enter" ||
            event.key === " "
          ) {
            event.preventDefault();
            activate();
          }
        }
      );
    }
  );

  applyBomScenario(0);
}

  const heroSystem =
  document.querySelector(
    ".solutions-system"
  );

if (heroSystem) {
  const nodes =
    Array.from(
      heroSystem.querySelectorAll(
        ".solutions-system__node"
      )
    );

  const paths =
    Array.from(
      heroSystem.querySelectorAll(
        ".solutions-system__lines path"
      )
    );

  const pulses =
    Array.from(
      heroSystem.querySelectorAll(
        ".solutions-system__pulse"
      )
    );

  const infoLabel =
    document.getElementById(
      "solutions-system-info-label"
    );

  const infoTitle =
    document.getElementById(
      "solutions-system-info-title"
    );

  const infoText =
    document.getElementById(
      "solutions-system-info-text"
    );

  const states = [
    {
      label: "01 / CHAOS",
      title:
        "Ручні кроки та розрізнені дії",
      text:
        "Процес залежить від людей, пам’яті та ручного контролю.",
      paths: [0, 2],
      pulses: [0]
    },
    {
      label: "02 / DATA",
      title:
        "Дані стають структурованими",
      text:
        "Збираємо джерела в одну логіку та прибираємо дублікати.",
      paths: [0, 2],
      pulses: [0, 1]
    },
    {
      label: "03 / LOGIC",
      title:
        "Правила працюють автоматично",
      text:
        "Розрахунки, маршрути та перевірки виконуються без ручних кроків.",
      paths: [1, 2, 3],
      pulses: [1, 2]
    },
    {
      label: "04 / CONTROL",
      title:
        "Результат видно і контролюється",
      text:
        "Користувач бачить стан процесу, відхилення та результат в одному місці.",
      paths: [0, 1, 3],
      pulses: [2]
    }
  ];

  let activeIndex = 0;
  let autoTimer = null;
  let isHovering = false;

  function activateHeroNode(
    index
  ) {
    activeIndex = index;

    nodes.forEach(
      (node, nodeIndex) => {
        node.classList.toggle(
          "is-active",
          nodeIndex === index
        );

        node.classList.toggle(
          "is-muted",
          nodeIndex !== index
        );
      }
    );

    paths.forEach(
      (path, pathIndex) => {
        const active =
          states[index]
            .paths
            .includes(pathIndex);

        path.classList.toggle(
          "is-active",
          active
        );

        path.classList.toggle(
          "is-muted",
          !active
        );
      }
    );

    pulses.forEach(
      (pulse, pulseIndex) => {
        pulse.classList.toggle(
          "is-active",
          states[index]
            .pulses
            .includes(
              pulseIndex
            )
        );
      }
    );

    if (infoLabel) {
      infoLabel.textContent =
        states[index].label;
    }

    if (infoTitle) {
      infoTitle.textContent =
        states[index].title;
    }

    if (infoText) {
      infoText.textContent =
        states[index].text;
    }
  }

  function startHeroCycle() {
    clearInterval(
      autoTimer
    );

    autoTimer =
      setInterval(() => {
        if (isHovering) {
          return;
        }

        const nextIndex =
          (
            activeIndex + 1
          ) % nodes.length;

        activateHeroNode(
          nextIndex
        );
      }, 2800);
  }

  nodes.forEach(
    (node, index) => {
      node.addEventListener(
        "mouseenter",
        () => {
          isHovering = true;
          activateHeroNode(
            index
          );
        }
      );

      node.addEventListener(
        "mouseleave",
        () => {
          isHovering = false;
        }
      );
    }
  );

  heroSystem.addEventListener(
    "mouseenter",
    () => {
      isHovering = true;
    }
  );

  heroSystem.addEventListener(
    "mouseleave",
    () => {
      isHovering = false;
    }
  );

  activateHeroNode(0);
  startHeroCycle();
}
  const solutionsPage =
  document.querySelector(
    ".solutions-page"
  );

if (
  solutionsPage &&
  window.matchMedia(
    "(pointer: fine)"
  ).matches &&
  !window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches
) {
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let frameId = null;

  const renderBackgroundParallax =
    () => {
      currentX +=
        (targetX - currentX) *
        .075;

      currentY +=
        (targetY - currentY) *
        .075;

      solutionsPage.style.setProperty(
        "--solutions-bg-x",
        `${currentX}px`
      );

      solutionsPage.style.setProperty(
        "--solutions-bg-y",
        `${currentY}px`
      );

      const distance =
        Math.abs(
          targetX - currentX
        ) +
        Math.abs(
          targetY - currentY
        );

      if (distance > .05) {
        frameId =
          requestAnimationFrame(
            renderBackgroundParallax
          );
      } else {
        frameId = null;
      }
    };

  window.addEventListener(
    "mousemove",
    event => {
      const x =
        event.clientX /
          window.innerWidth -
        .5;

      const y =
        event.clientY /
          window.innerHeight -
        .5;

      targetX =
        x * -24;

      targetY =
        y * -16;

      if (!frameId) {
        frameId =
          requestAnimationFrame(
            renderBackgroundParallax
          );
      }
    },
    {
      passive: true
    }
  );
}
const motionPhotos =
  document.querySelectorAll(
    ".featured-case__visual, .solutions-visual-break__scene, .supply-break__scene"
  );

if (
  motionPhotos.length &&
  !window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches
) {
  const photoObserver =
    new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (
            entry.isIntersecting
          ) {
            entry.target.classList.remove(
              "is-photo-active"
            );

            requestAnimationFrame(
              () => {
                requestAnimationFrame(
                  () => {
                    entry.target.classList.add(
                      "is-photo-active"
                    );
                  }
                );
              }
            );
          } else {
            entry.target.classList.remove(
              "is-photo-active"
            );
          }
        });
      },
      {
        threshold: 0.28
      }
    );

  motionPhotos.forEach(
    photo => {
      photoObserver.observe(
        photo
      );
    }
  );
}

renderResults("");
})();
