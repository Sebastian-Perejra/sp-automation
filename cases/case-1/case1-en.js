const bankRows = [
  [
    "03.07.2026",
    "CARD*4821 POS 19:44 NOVUS KYIV UA MCC5411 REF 884521",
    "-1 286,40",
    "NOVUS",
    "Groceries",
    "ok"
  ],
  [
    "03.07.2026",
    "UAH KOM 0.00 / PEREKAZ Z KARTY 5168****1047 VID IVANENKO O.O.",
    "+12 500,00",
    "Іваненко О.О.",
    "Incoming payment",
    "ok"
  ],
  [
    "04.07.2026",
    "MONO PAY*GOOGLE ADS 874201 IE DUBLIN IRL 04/07",
    "-2 940,18",
    "Google Ads",
    "Advertising",
    "ok"
  ],
  [
    "04.07.2026",
    "PLATIZH ZA RAH 1048-26 TOV VEKTOR SERVIS BEZ PDV",
    "-7 200,00",
    "ТОВ «Вектор Сервіс»",
    "Services",
    "ok"
  ],
  [
    "05.07.2026",
    "ATM CASH WD 005771 KYIV PR-T PEREMOHY 12 KOM 80.00",
    "-4 000,00",
    "Банкомат",
    "Cash withdrawal",
    "ok"
  ],
  [
    "05.07.2026",
    "NOVA POSHTA 02041 KYIV TERMINAL 330192 MCC4215",
    "-486,00",
    "Нова пошта",
    "Logistics",
    "ok"
  ],
  [
    "06.07.2026",
    "EPICENTR K POS 8871 BUD MATERIALY CHECK 001947",
    "-3 742,90",
    "Епіцентр",
    "Operating supplies",
    "ok"
  ],
  [
    "06.07.2026",
    "P2P CREDIT 4149****7720 KOVALENKO SERHII D.",
    "+8 000,00",
    "Коваленко С.Д.",
    "Incoming payment",
    "ok"
  ],
  [
    "07.07.2026",
    "FOP MELNYK O.V. RAH 708 OPлата za druk etyketok",
    "-5 600,00",
    "ФОП Мельник О.В.",
    "Printing",
    "ok"
  ],
  [
    "07.07.2026",
    "UBER *TRIP HELP.UBER.COM NL 07-07 AUTH 102944",
    "-318,72",
    "Uber",
    "Transport",
    "ok"
  ],
  [
    "08.07.2026",
    "VAT PAYMENT 2 KV 2026 EDPR 3011400000 PRYZN 101",
    "-18 760,00",
    "Tax Authority",
    "Taxes",
    "ok"
  ],
  [
    "08.07.2026",
    "ROZETKA UA KYIV ORDER RZK-4938172 OFFICE MOUSE",
    "-1 149,00",
    "Rozetka",
    "Office expenses",
    "ok"
  ],
  [
    "09.07.2026",
    "APPLE.COM/BILL 800-275-2273 IRL ICLOUD+ 200GB",
    "-149,00",
    "Apple",
    "Subscriptions",
    "ok"
  ],
  [
    "09.07.2026",
    "TOV MHP POSTACHANNYA ZA DOG 14/26 RAH 553",
    "+34 980,00",
    "ТОВ «МХП»",
    "Client payment",
    "ok"
  ],
  [
    "10.07.2026",
    "WOG A-95 31.42L ST 083 KYIV OBL TERM 774912",
    "-1 842,65",
    "WOG",
    "Fuel",
    "ok"
  ],
  [
    "10.07.2026",
    "FOP PETRENKO A.A. AVANS ZA DIZAYN MAKETIV",
    "-3 000,00",
    "ФОП Петренко А.А.",
    "Design",
    "ok"
  ],
  [
    "11.07.2026",
    "SILPO 118 POS 2881 MCC 5411 KYIV 11.07.26",
    "-947,31",
    "Сільпо",
    "Groceries",
    "ok"
  ],
  [
    "11.07.2026",
    "PRIVAT24 KOMISIYA ZA RKO TARIF BUSINESS",
    "-199,00",
    "ПриватБанк",
    "Bank fees",
    "ok"
  ],
  [
    "12.07.2026",
    "TOV NOVA LINIYA CHECK 62287 INSTRUMENTY SKLAD",
    "-2 386,50",
    "Нова Лінія",
    "Operating supplies",
    "ok"
  ],
  [
    "12.07.2026",
    "PEREKAZ VID TOV ALFA TRADE RAH 204 POSLUGY",
    "+21 400,00",
    "ТОВ «Альфа Трейд»",
    "Client payment",
    "ok"
  ],
  [
    "13.07.2026",
    "MICROSOFT*SUBSCRIPTION MSFT IE M365 BUSINESS",
    "-512,40",
    "Microsoft",
    "Subscriptions",
    "ok"
  ],
  [
    "13.07.2026",
    "BOLT.EU/R/240713 KYIV UA RIDE 229184",
    "-204,00",
    "Bolt",
    "Transport",
    "ok"
  ],
  [
    "14.07.2026",
    "PAYMENT TO FOP BONDARENKO V.V. HOSTING 1 YEAR",
    "-2 100,00",
    "ФОП Бондаренко В.В.",
    "Hosting",
    "ok"
  ],
  [
    "14.07.2026",
    "CREDIT P2P 5355****8802 SHEVCHENKO N.M.",
    "+5 000,00",
    "Шевченко Н.М.",
    "Incoming payment",
    "ok"
  ],
  [
    "15.07.2026",
    "KYIVSTAR B2B INV 726193 TEL +380980746698",
    "-450,00",
    "Kyivstar",
    "Telecommunications",
    "ok"
  ],
  [
    "15.07.2026",
    "PROM.UA ORDER 883420 PACKING TAPE 48MM 36PCS",
    "-1 764,00",
    "Prom.ua",
    "Packaging materials",
    "ok"
  ],
  [
    "16.07.2026",
    "UKRPOSHTA VIDPR 18 POSHLYNA TRACK RR004891UA",
    "-392,80",
    "Укрпошта",
    "Logistics",
    "ok"
  ],
  [
    "16.07.2026",
    "TOV BETA LOGISTICS RAH 912 DOSTAVKA 14.07",
    "-6 480,00",
    "ТОВ «Бета Логістик»",
    "Logistics",
    "ok"
  ],
  [
    "17.07.2026",
    "AMAZON WEB SERVICES AWS EMEA INV 994-20817",
    "-873,44",
    "Amazon Web Services",
    "Cloud services",
    "ok"
  ],
  [
    "17.07.2026",
    "PEREKAZ VID FOP KLYMENKO O.P. CONSULTING JULY",
    "+9 600,00",
    "ФОП Клименко О.П.",
    "Client payment",
    "ok"
  ],
  [
    "18.07.2026",
    "METRO CASH&CARRY 0184 KYIV OFFICE WATER COFFEE",
    "-1 328,16",
    "METRO",
    "Office expenses",
    "ok"
  ],
  [
    "18.07.2026",
    "GOOGLE*WORKSPACE G.CO/HELPPAY# IE 18JUL",
    "-772,22",
    "Google Workspace",
    "Subscriptions",
    "ok"
  ],
  [
    "19.07.2026",
    "FOP ROMANENKO S.S. REMONT PRINTERA RAH 91",
    "-1 250,00",
    "ФОП Романенко С.С.",
    "Repairs",
    "ok"
  ],
  [
    "19.07.2026",
    "MONOBANK REWARD CASHBACK JUL 2026",
    "+184,37",
    "Monobank",
    "Cashback",
    "ok"
  ],
  [
    "20.07.2026",
    "OKKO POS 7081 DIESEL 38.20L TERM 811294",
    "-2 121,48",
    "OKKO",
    "Fuel",
    "ok"
  ],
  [
    "20.07.2026",
    "CANVA*PRO SYDNEY AU CARD 4821 MONTHLY",
    "-499,00",
    "Canva",
    "Subscriptions",
    "ok"
  ],
  [
    "21.07.2026",
    "TOV GAMMA PACK RAH 772 KARTONNI KOROBKY 500PCS",
    "-14 850,00",
    "ТОВ «Гамма Пак»",
    "Packaging materials",
    "ok"
  ],
  [
    "21.07.2026",
    "PEREKAZ ZA DOG 18-07 TOV DELTA PLUS",
    "+18 900,00",
    "ТОВ «Дельта Плюс»",
    "Client payment",
    "ok"
  ],
  [
    "22.07.2026",
    "LIFECELL BUSINESS ACC 380630001122 JULY",
    "-310,00",
    "Lifecell",
    "Telecommunications",
    "ok"
  ],
  [
    "22.07.2026",
    "FOP HRITSENKO M.I. BUHG POSLUGY 07/2026",
    "-4 500,00",
    "ФОП Гриценко М.І.",
    "Accounting",
    "ok"
  ],
  [
    "23.07.2026",
    "ZOOM.US 888-799-9666 SAN JOSE US PRO PLAN",
    "-611,74",
    "Zoom",
    "Subscriptions",
    "ok"
  ],
  [
    "23.07.2026",
    "P2P CREDIT 5457****1409 TKACHENKO VIKTOR",
    "+2 500,00",
    "Ткаченко В.",
    "Incoming payment",
    "ok"
  ],
  [
    "24.07.2026",
    "AUTOLUX CARGO KYIV ODESA TTN 7749201",
    "-786,00",
    "Autolux",
    "Logistics",
    "ok"
  ],
  [
    "24.07.2026",
    "EPICENTR K POS 1091 LED LAMPS CABLE CHECK 729",
    "-1 093,55",
    "Епіцентр",
    "Operating supplies",
    "ok"
  ],
  [
    "25.07.2026",
    "FOP LISOVYI D.P. TARGET ADS JULY PART 2",
    "-6 000,00",
    "ФОП Лісовий Д.П.",
    "Advertising",
    "ok"
  ],
  [
    "25.07.2026",
    "TOV OMEGA RETAIL RAH 443 OPLATA ZA POSLUGY",
    "+27 300,00",
    "ТОВ «Омега Рітейл»",
    "Client payment",
    "ok"
  ],
  [
    "26.07.2026",
    "PRIVATBANK ACQUIRING FEE TERMINAL 03 JULY",
    "-628,40",
    "ПриватБанк",
    "Bank fees",
    "ok"
  ],
  [
    "26.07.2026",
    "DIIA.SIGN BUSINESS CERTIFICATE 1 YEAR",
    "-300,00",
    "Дія",
    "Electronic signature",
    "ok"
  ],
  [
    "27.07.2026",
    "NOVA POSHTA 00017 POSYLKA 20499000219482",
    "-224,00",
    "Нова пошта",
    "Logistics",
    "ok"
  ],
  [
    "27.07.2026",
    "PEREKAZ VID TOV SIGMA GROUP FINAL PAYMENT",
    "+42 000,00",
    "ТОВ «Сігма Груп»",
    "Client payment",
    "ok"
  ]
    ,
  [
    "01.09.2025",
    "Social security contribution on payroll for first half of September 2025;101/570.50/UAH/UA273052990000026004010112233/3011400000/company code 30114000",
    "-570,50",
    "Tax Authority",
    "Social security contribution",
    "ok"
  ],
  [
    "01.09.2025",
    "Personal income tax on payroll for first half of September 2025;101/466.77/UAH/UA118999980000000000000123456/State Treasury Kyiv",
    "-466,77",
    "Tax Authority",
    "Personal income tax",
    "ok"
  ],
  [
    "01.09.2025",
    "Military levy on payroll for first half of September 2025;101/166.70/UAH/budget code 11011000",
    "-166,70",
    "Tax Authority",
    "Military levy",
    "ok"
  ],
  [
    "02.09.2025",
    "Payroll for first half of September 2025. Register No. 09-1; employee card account",
    "-2 567,25",
    "Employees",
    "Payroll",
    "ok"
  ],
  [
    "02.09.2025",
    "Transfer of owner funds to current account. No VAT. Owner contribution",
    "+8 000,00",
    "Owner",
    "Owner funds",
    "ok"
  ],
  [
    "03.09.2025",
    "Social security contribution on sick pay for August 2025;101/312.84/UAH/account UA273052990000026004010112233",
    "-312,84",
    "Tax Authority",
    "Social security contribution",
    "ok"
  ],
  [
    "03.09.2025",
    "Personal income tax on sick pay for August 2025;101/198.44/UAH/11010100",
    "-198,44",
    "Tax Authority",
    "Personal income tax",
    "ok"
  ],
  [
    "03.09.2025",
    "Military levy on sick pay for August 2025;101/71.18/UAH/11011000",
    "-71,18",
    "Tax Authority",
    "Military levy",
    "ok"
  ],
  [
    "04.09.2025",
    "Account servicing fee under bank tariff for 09/2025",
    "-180,00",
    "Bank",
    "Bank fees",
    "ok"
  ],
  [
    "04.09.2025",
    "Sick-pay payment for August 2025. Register 08-L; batch 147",
    "-1 102,40",
    "Employees",
    "Sick pay",
    "ok"
  ],
  [
    "05.09.2025",
    "101;social security contribution for employees for August 2025;3011400000;period 08/2025",
    "-1 284,60",
    "Tax Authority",
    "Social security contribution",
    "ok"
  ],
  [
    "05.09.2025",
    "101;personal income tax for employees, August 2025;11010100;no VAT",
    "-1 014,22",
    "Tax Authority",
    "Personal income tax",
    "ok"
  ],
  [
    "05.09.2025",
    "101;military levy for employees, August 2025;11011000;no VAT",
    "-362,22",
    "Tax Authority",
    "Military levy",
    "ok"
  ],
  [
    "06.09.2025",
    "Payroll payment for August 2025 under register No. 08-2",
    "-6 480,00",
    "Employees",
    "Payroll",
    "ok"
  ],
  [
    "06.09.2025",
    "Return of unused expense advance by employee, expense report No. 44",
    "+540,00",
    "Employee",
    "Expense advance refund",
    "ok"
  ],
  [
    "07.09.2025",
    "Office rent for September 2025 under agreement No. 15/O; no VAT",
    "-12 000,00",
    "Landlord",
    "Rent",
    "ok"
  ],
  [
    "07.09.2025",
    "Electricity payment for August 2025 account 102771; meter 18432; VAT included",
    "-2 744,19",
    "Electricity supplier",
    "Utilities",
    "ok"
  ],
  [
    "08.09.2025",
    "Bank fee for payroll transfers to employee card accounts",
    "-92,40",
    "Bank",
    "Bank fees",
    "ok"
  ],
  [
    "08.09.2025",
    "Internet service for September 2025; customer account 771928; agreement IN-221",
    "-480,00",
    "Internet provider",
    "Internet",
    "ok"
  ],
  [
    "09.09.2025",
    "Single tax for Q3 2025;101;18050400;sole proprietor;no VAT",
    "-4 200,00",
    "Tax Authority",
    "Single tax",
    "ok"
  ],
  [
    "09.09.2025",
    "Accounting services for August 2025 under act No. 32 dated 31.08.2025",
    "-3 500,00",
    "Accountant",
    "Accounting services",
    "ok"
  ],
  [
    "10.09.2025",
    "Transfer to corporate card for operating expenses; expense advance to employee P.",
    "-3 000,00",
    "Employee",
    "Expense advance",
    "ok"
  ],
  [
    "10.09.2025",
    "Refund of mistakenly transferred funds under payment order No. 884",
    "+1 250,00",
    "Counterparty",
    "Refund",
    "ok"
  ],
  [
    "11.09.2025",
    "101/social security contribution/payroll/second half of September 2025/UA273052990000026004010112233",
    "-612,04",
    "Tax Authority",
    "Social security contribution",
    "ok"
  ],
  [
    "11.09.2025",
    "101/personal income tax/payroll/second half of September 2025/UA118999980000000000000123456",
    "-500,76",
    "Tax Authority",
    "Personal income tax",
    "ok"
  ]
    ,
  [
    "11.09.2025",
    "101/military levy/payroll/second half of September 2025/11011000",
    "-178,84",
    "Tax Authority",
    "Military levy",
    "ok"
  ],
  [
    "12.09.2025",
    "Payroll for second half of September 2025 under payroll register No. 09-2",
    "-2 765,00",
    "Employees",
    "Payroll",
    "ok"
  ],
  [
    "12.09.2025",
    "Corporate mobile plan BUSINESS 09/2025, tel. 0980746698",
    "-420,00",
    "Mobile operator",
    "Telecommunications",
    "ok"
  ],
  [
    "13.09.2025",
    "Domain and SSL certificate for sp-automation.com, 12 months; INV#SSL-9921",
    "-1 890,00",
    "Hosting provider",
    "Hosting",
    "ok"
  ],
  [
    "13.09.2025",
    "Courier delivery services under register No. 118 dated 12.09.2025",
    "-740,00",
    "Courier service",
    "Logistics",
    "ok"
  ],
  [
    "14.09.2025",
    "Charitable donation under letter No. 77; no VAT",
    "-1 000,00",
    "Charity fund",
    "Charity",
    "ok"
  ],
  [
    "14.09.2025",
    "Office supplies under invoice No. 221-09; A4 paper, pens, folders",
    "-1 384,60",
    "Office supplies vendor",
    "Office expenses",
    "ok"
  ],
  [
    "15.09.2025",
    "Penalty interest for overdue tax liability;101;1400",
    "-84,18",
    "Tax Authority",
    "Penalty interest",
    "ok"
  ],
  [
    "15.09.2025",
    "Audit and review of reporting for first 8 months of 2025; act No. 09/15",
    "-5 600,00",
    "Auditor",
    "Audit services",
    "ok"
  ],
  [
    "16.09.2025",
    "Business travel reimbursement under expense report No. 52: transport + hotel",
    "-3 944,70",
    "Employee",
    "Business travel",
    "ok"
  ],
  [
    "16.09.2025",
    "Software licence payment 09/2025, invoice 84711",
    "-2 246,80",
    "Software vendor",
    "Software",
    "ok"
  ],
  [
    "17.09.2025",
    "Tax refund under amended return; budget code 11010100",
    "+622,15",
    "Tax Authority",
    "Tax refund",
    "ok"
  ],
  [
    "17.09.2025",
    "Transfer between own accounts UA26040250010059660 -> UA90322001000012345",
    "+15 000,00",
    "Own accounts",
    "Internal transfer",
    "ok"
  ],
  [
    "18.09.2025",
    "Transfer between own accounts UA90322001000012345 -> UA26040250010059660",
    "-15 000,00",
    "Own accounts",
    "Internal transfer",
    "ok"
  ],
  [
    "18.09.2025",
    "Payment to materials supplier under invoice No. 991/09; 50% prepayment",
    "-8 750,00",
    "Materials supplier",
    "Materials",
    "ok"
  ],
  [
    "19.09.2025",
    "Client payment received for consulting services, invoice No. 45",
    "+12 400,00",
    "Client",
    "Client payment",
    "ok"
  ],
  [
    "19.09.2025",
    "Refund to client of overpayment under invoice No. 45",
    "-400,00",
    "Client",
    "Client refund",
    "ok"
  ],
  [
    "20.09.2025",
    "Fee for certificate/extract/service charge, document No. A-774",
    "-180,00",
    "Government service",
    "Administrative expenses",
    "ok"
  ],
  [
    "20.09.2025",
    "Office printer repair and cartridge replacement, act 55",
    "-1 420,00",
    "Service centre",
    "Repairs",
    "ok"
  ],
  [
    "21.09.2025",
    "Payment for services under an unnumbered agreement; payment purpose abbreviated",
    "-2 900,00",
    "Undetermined",
    "Needs review",
    "warning"
  ],
  [
    "21.09.2025",
    "Payment 0921/77; account 44001; services under act; no VAT; counterparty omitted",
    "-1 775,00",
    "Undetermined",
    "Needs review",
    "warning"
  ],
  [
    "22.09.2025",
    "Transfer under verbal arrangement; no details provided; ref 008814",
    "-980,00",
    "Undetermined",
    "Ambiguous category",
    "warning"
  ],
  [
    "22.09.2025",
    "UA26040250010059660/payment/101/code 8847/OCR-damaged line ### ??? 77A",
    "-643,17",
    "Not identified",
    "Unclassified",
    "error"
  ],
  [
    "23.09.2025",
    "Bank services: additional account opening and SMS notifications",
    "-250,00",
    "Bank",
    "Bank fees",
    "ok"
  ],
  [
    "23.09.2025",
    "Owner funds received to cover a temporary cash-flow gap; no VAT",
    "+6 000,00",
    "Owner",
    "Owner funds",
    "ok"
  ]
];
