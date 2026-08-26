(function () {
  "use strict";

  const C12 = window.C12 = window.C12 || {};

  const DAY = 24 * 60 * 60 * 1000;
  const HOUR = 60 * 60 * 1000;

  const pad = (value, size = 2) => String(value).padStart(size, "0");

  const isoLocal = (date) => {
    return [
      date.getFullYear(),
      "-",
      pad(date.getMonth() + 1),
      "-",
      pad(date.getDate()),
      "T",
      pad(date.getHours()),
      ":",
      pad(date.getMinutes()),
      ":00"
    ].join("");
  };

  const money = (value) => Math.round(value);

  const pick = (array, index) => array[index % array.length];

  const pseudo = (index, salt = 1) => {
    const x = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
    return x - Math.floor(x);
  };


  /* ============================================================
     COMPANY
  ============================================================ */

  C12.company = {
    name: "WestRoute Logistics",
    currency: "EUR",
    timezone: "Europe/Kyiv",
    simulationStart: "2026-08-26T09:45:00",
    ownVehicles: 12,
    drivers: 14,
    carriers: 5,
    orders: 200
  };


  /* ============================================================
     LOCATIONS
  ============================================================ */

  C12.locations = [
    { city: "Львів", country: "Україна", code: "UA", x: 22, y: 55 },
    { city: "Київ", country: "Україна", code: "UA", x: 39, y: 58 },
    { city: "Тернопіль", country: "Україна", code: "UA", x: 29, y: 59 },
    { city: "Івано-Франківськ", country: "Україна", code: "UA", x: 24, y: 65 },
    { city: "Луцьк", country: "Україна", code: "UA", x: 25, y: 48 },
    { city: "Рівне", country: "Україна", code: "UA", x: 30, y: 49 },
    { city: "Ужгород", country: "Україна", code: "UA", x: 17, y: 72 },
    { city: "Чернівці", country: "Україна", code: "UA", x: 29, y: 72 },
    { city: "Житомир", country: "Україна", code: "UA", x: 35, y: 53 },
    { city: "Вінниця", country: "Україна", code: "UA", x: 38, y: 65 },

    { city: "Краків", country: "Польща", code: "PL", x: 44, y: 47 },
    { city: "Варшава", country: "Польща", code: "PL", x: 49, y: 29 },
    { city: "Люблін", country: "Польща", code: "PL", x: 39, y: 38 },
    { city: "Жешув", country: "Польща", code: "PL", x: 34, y: 48 },
    { city: "Катовіце", country: "Польща", code: "PL", x: 48, y: 49 },
    { city: "Вроцлав", country: "Польща", code: "PL", x: 55, y: 40 },
    { city: "Познань", country: "Польща", code: "PL", x: 57, y: 31 },
    { city: "Гданськ", country: "Польща", code: "PL", x: 55, y: 14 },

    { city: "Кошице", country: "Словаччина", code: "SK", x: 42, y: 62 },
    { city: "Пряшів", country: "Словаччина", code: "SK", x: 39, y: 58 },
    { city: "Братислава", country: "Словаччина", code: "SK", x: 58, y: 61 },

    { city: "Будапешт", country: "Угорщина", code: "HU", x: 70, y: 72 },
    { city: "Дебрецен", country: "Угорщина", code: "HU", x: 61, y: 69 },
    { city: "Ньїредьгаза", country: "Угорщина", code: "HU", x: 55, y: 66 },

    { city: "Бухарест", country: "Румунія", code: "RO", x: 79, y: 88 },
    { city: "Клуж-Напока", country: "Румунія", code: "RO", x: 67, y: 80 },
    { city: "Орадя", country: "Румунія", code: "RO", x: 63, y: 76 }
  ];


  /* ============================================================
     CLIENTS
  ============================================================ */

  C12.clients = [
    { name: "WestWood Ukraine", contact: "Ірина Мельник", email: "logistics@westwood.ua" },
    { name: "Galicia Foods", contact: "Олег Коваль", email: "transport@galiciafoods.ua" },
    { name: "NordPack", contact: "Марія Савчук", email: "orders@nordpack.ua" },
    { name: "Carpathian Furniture", contact: "Роман Гнатюк", email: "logistics@carpathian.ua" },
    { name: "Lviv Trade Group", contact: "Наталія Бойко", email: "supply@ltg.ua" },
    { name: "FreshLine Distribution", contact: "Андрій Левицький", email: "delivery@freshline.ua" },
    { name: "UA Glass", contact: "Тарас Козак", email: "logistics@uaglass.ua" },
    { name: "GreenField Agro", contact: "Вікторія Мороз", email: "transport@greenfield.ua" },
    { name: "ProMebel", contact: "Сергій Ткачук", email: "orders@promebel.ua" },
    { name: "EuroCeramic", contact: "Оксана Романюк", email: "logistics@euroceramic.ua" },
    { name: "BuildWest", contact: "Ігор Павлюк", email: "supply@buildwest.ua" },
    { name: "AquaTrade", contact: "Юлія Семенюк", email: "transport@aquatrade.ua" },
    { name: "PolPack Solutions", contact: "Marek Nowak", email: "transport@polpack.pl" },
    { name: "KrakFood", contact: "Anna Kowalska", email: "logistyka@krakfood.pl" },
    { name: "Vistula Retail", contact: "Piotr Zieliński", email: "delivery@vistula.pl" },
    { name: "Baltic Home", contact: "Katarzyna Wójcik", email: "logistics@baltichome.pl" },
    { name: "TransMarket Polska", contact: "Tomasz Mazur", email: "orders@transmarket.pl" },
    { name: "Danube Trade", contact: "Péter Nagy", email: "logistics@danubetrade.hu" },
    { name: "Slovak Industry", contact: "Martin Kováč", email: "transport@slovakindustry.sk" },
    { name: "Romania Distribution", contact: "Andrei Popescu", email: "delivery@romdist.ro" }
  ];


  /* ============================================================
     DRIVERS
  ============================================================ */

  C12.drivers = [
    {
      id: "DRV-001",
      name: "Олександр Петренко",
      phone: "+380 67 214 45 81",
      status: "free",
      vehicle: "BC4587KA"
    },
    {
      id: "DRV-002",
      name: "Андрій Бондар",
      phone: "+380 67 488 12 04",
      status: "transit",
      vehicle: "BC9123TT"
    },
    {
      id: "DRV-003",
      name: "Ігор Мельник",
      phone: "+380 93 675 18 22",
      status: "free",
      vehicle: "BC7731AA"
    },
    {
      id: "DRV-004",
      name: "Василь Кравчук",
      phone: "+380 97 338 76 51",
      status: "transit",
      vehicle: "BC2841HM"
    },
    {
      id: "DRV-005",
      name: "Михайло Савка",
      phone: "+380 66 912 31 08",
      status: "transit",
      vehicle: "BC6032PE"
    },
    {
      id: "DRV-006",
      name: "Юрій Козловський",
      phone: "+380 98 402 73 16",
      status: "transit",
      vehicle: "BC1148KT"
    },
    {
      id: "DRV-007",
      name: "Роман Бойко",
      phone: "+380 63 219 67 44",
      status: "transit",
      vehicle: "BC8305AI"
    },
    {
      id: "DRV-008",
      name: "Петро Гнатюк",
      phone: "+380 95 771 25 60",
      status: "transit",
      vehicle: "BC5216OP"
    },
    {
      id: "DRV-009",
      name: "Степан Марчук",
      phone: "+380 67 845 11 29",
      status: "transit",
      vehicle: "BC3904CB"
    },
    {
      id: "DRV-010",
      name: "Володимир Дячук",
      phone: "+380 93 205 64 78",
      status: "transit",
      vehicle: "BC7492EX"
    },
    {
      id: "DRV-011",
      name: "Дмитро Клим",
      phone: "+380 96 332 18 91",
      status: "reserved",
      vehicle: "BC2254MC"
    },
    {
      id: "DRV-012",
      name: "Богдан Шевчук",
      phone: "+380 68 190 55 73",
      status: "service",
      vehicle: "BC6670IX"
    },
    {
      id: "DRV-013",
      name: "Максим Федорів",
      phone: "+380 63 704 41 18",
      status: "reserve",
      vehicle: null
    },
    {
      id: "DRV-014",
      name: "Тарас Яремчук",
      phone: "+380 97 611 39 02",
      status: "reserve",
      vehicle: null
    }
  ];


  /* ============================================================
     VEHICLES
  ============================================================ */

  C12.vehicles = [
    {
      plate: "BC4587KA",
      displayPlate: "BC 4587 KA",
      brand: "DAF",
      model: "XF",
      type: "curtain",
      typeLabel: "Тент",
      capacityKg: 22000,
      pallets: 33,
      driver: "Олександр Петренко",
      status: "free",
      location: "Львів",
      own: true
    },
    {
      plate: "BC9123TT",
      displayPlate: "BC 9123 TT",
      brand: "MAN",
      model: "TGX",
      type: "curtain",
      typeLabel: "Тент",
      capacityKg: 22000,
      pallets: 33,
      driver: "Андрій Бондар",
      status: "transit",
      location: "Краків",
      own: true
    },
    {
      plate: "BC7731AA",
      displayPlate: "BC 7731 AA",
      brand: "Mercedes-Benz",
      model: "Atego",
      type: "van",
      typeLabel: "Фургон",
      capacityKg: 3500,
      pallets: 8,
      driver: "Ігор Мельник",
      status: "free",
      location: "Львів",
      own: true
    },
    {
      plate: "BC2841HM",
      displayPlate: "BC 2841 HM",
      brand: "Volvo",
      model: "FH",
      type: "curtain",
      typeLabel: "Тент",
      capacityKg: 22000,
      pallets: 33,
      driver: "Василь Кравчук",
      status: "transit",
      location: "Варшава",
      own: true
    },
    {
      plate: "BC6032PE",
      displayPlate: "BC 6032 PE",
      brand: "Scania",
      model: "R450",
      type: "refrigerator",
      typeLabel: "Рефрижератор",
      capacityKg: 21000,
      pallets: 33,
      driver: "Михайло Савка",
      status: "transit",
      location: "Жешув",
      own: true
    },
    {
      plate: "BC1148KT",
      displayPlate: "BC 1148 KT",
      brand: "DAF",
      model: "XF",
      type: "curtain",
      typeLabel: "Тент",
      capacityKg: 22000,
      pallets: 33,
      driver: "Юрій Козловський",
      status: "transit",
      location: "Люблін",
      own: true
    },
    {
      plate: "BC8305AI",
      displayPlate: "BC 8305 AI",
      brand: "MAN",
      model: "TGX",
      type: "refrigerator",
      typeLabel: "Рефрижератор",
      capacityKg: 21000,
      pallets: 33,
      driver: "Роман Бойко",
      status: "transit",
      location: "Катовіце",
      own: true
    },
    {
      plate: "BC5216OP",
      displayPlate: "BC 5216 OP",
      brand: "Volvo",
      model: "FH",
      type: "curtain",
      typeLabel: "Тент",
      capacityKg: 22000,
      pallets: 33,
      driver: "Петро Гнатюк",
      status: "transit",
      location: "Кошице",
      own: true
    },
    {
      plate: "BC3904CB",
      displayPlate: "BC 3904 CB",
      brand: "Scania",
      model: "R500",
      type: "mega",
      typeLabel: "Мега",
      capacityKg: 22000,
      pallets: 33,
      driver: "Степан Марчук",
      status: "transit",
      location: "Будапешт",
      own: true
    },
    {
      plate: "BC7492EX",
      displayPlate: "BC 7492 EX",
      brand: "DAF",
      model: "XF",
      type: "curtain",
      typeLabel: "Тент",
      capacityKg: 22000,
      pallets: 33,
      driver: "Володимир Дячук",
      status: "transit",
      location: "Чернівці",
      own: true
    },
    {
      plate: "BC2254MC",
      displayPlate: "BC 2254 MC",
      brand: "MAN",
      model: "TGX",
      type: "curtain",
      typeLabel: "Тент",
      capacityKg: 22000,
      pallets: 33,
      driver: "Дмитро Клим",
      status: "reserved",
      location: "Львів",
      own: true
    },
    {
      plate: "BC6670IX",
      displayPlate: "BC 6670 IX",
      brand: "Volvo",
      model: "FM",
      type: "curtain",
      typeLabel: "Тент",
      capacityKg: 21000,
      pallets: 33,
      driver: "Богдан Шевчук",
      status: "service",
      location: "Львів",
      own: true
    }
  ];


  /* ============================================================
     CARRIERS
  ============================================================ */

 C12.carriers = [
  {
    id: "CAR-001",
    name: "TransKarpaty",
    country: "Україна",
    rating: 4.9,
    available: 3,
    initialAvailable: 3,
    types: ["Тент", "Мега"],
    priceIndex: 1.02,

    offer: {
      brand: "Volvo",
      model: "FH 460",
      plate: "AA7421KT",
      displayPlate: "AA 7421 KT",
      type: "curtain",
      typeLabel: "Тент",
      capacityKg: 22000,
      pallets: 33,
      driver: "Павло Коваль",
      driverPhone: "+380 67 441 28 06",
      location: "Львів",
      readyAt: "2026-08-26T09:52:00",
      rate: 1340,
      currency: "EUR"
    }
  },

  {
    id: "CAR-002",
    name: "RoadLink UA",
    country: "Україна",
    rating: 4.8,
    available: 2,
    initialAvailable: 2,
    types: ["Тент", "Рефрижератор"],
    priceIndex: 1.05,

    offer: {
      brand: "Scania",
      model: "R450",
      plate: "AI5832MP",
      displayPlate: "AI 5832 MP",
      type: "curtain",
      typeLabel: "Тент",
      capacityKg: 22000,
      pallets: 33,
      driver: "Микола Романюк",
      driverPhone: "+380 93 518 42 71",
      location: "Львів",
      readyAt: "2026-08-26T09:56:00",
      rate: 1380,
      currency: "EUR"
    }
  },

  {
    id: "CAR-003",
    name: "PolCargo Partner",
    country: "Польща",
    rating: 4.7,
    available: 4,
    initialAvailable: 4,
    types: ["Тент", "Мега", "Фургон"],
    priceIndex: 1.08,

    offer: {
      brand: "DAF",
      model: "XF 480",
      plate: "KR8H72",
      displayPlate: "KR 8H72",
      type: "curtain",
      typeLabel: "Тент",
      capacityKg: 22000,
      pallets: 33,
      driver: "Marek Zieliński",
      driverPhone: "+48 602 417 835",
      location: "Львів",
      readyAt: "2026-08-26T09:50:00",
      rate: 1420,
      currency: "EUR"
    }
  },

  {
    id: "CAR-004",
    name: "Vistula Transport",
    country: "Польща",
    rating: 4.6,
    available: 2,
    initialAvailable: 2,
    types: ["Тент", "Рефрижератор"],
    priceIndex: 1.1,

    offer: {
      brand: "Mercedes-Benz",
      model: "Actros 1845",
      plate: "RZ6214P",
      displayPlate: "RZ 6214P",
      type: "curtain",
      typeLabel: "Тент",
      capacityKg: 22000,
      pallets: 33,
      driver: "Piotr Nowak",
      driverPhone: "+48 697 284 116",
      location: "Львів",
      readyAt: "2026-08-26T09:55:00",
      rate: 1460,
      currency: "EUR"
    }
  },

  {
    id: "CAR-005",
    name: "Danube Freight",
    country: "Угорщина",
    rating: 4.8,
    available: 1,
    initialAvailable: 1,
    types: ["Тент", "Мега"],
    priceIndex: 1.12,

    offer: {
      brand: "MAN",
      model: "TGX 18.510",
      plate: "RTE418",
      displayPlate: "RTE-418",
      type: "curtain",
      typeLabel: "Тент",
      capacityKg: 22000,
      pallets: 33,
      driver: "Gábor Nagy",
      driverPhone: "+36 30 418 7251",
      location: "Львів",
      readyAt: "2026-08-26T09:57:00",
      rate: 1520,
      currency: "EUR"
    }
  }
];

  /* ============================================================
     CARGO TYPES
  ============================================================ */

  C12.cargoTypes = [
    {
      name: "Меблі",
      vehicle: "curtain",
      vehicleLabel: "Тент",
      minWeight: 2800,
      maxWeight: 14500
    },
    {
      name: "Продукти харчування",
      vehicle: "refrigerator",
      vehicleLabel: "Рефрижератор",
      minWeight: 3500,
      maxWeight: 18500
    },
    {
      name: "Будівельні матеріали",
      vehicle: "curtain",
      vehicleLabel: "Тент",
      minWeight: 6000,
      maxWeight: 21500
    },
    {
      name: "Пакувальні матеріали",
      vehicle: "curtain",
      vehicleLabel: "Тент",
      minWeight: 2500,
      maxWeight: 16000
    },
    {
      name: "Скляна продукція",
      vehicle: "curtain",
      vehicleLabel: "Тент",
      minWeight: 4500,
      maxWeight: 18000
    },
    {
      name: "Напої",
      vehicle: "curtain",
      vehicleLabel: "Тент",
      minWeight: 7500,
      maxWeight: 21500
    },
    {
      name: "Побутова техніка",
      vehicle: "mega",
      vehicleLabel: "Мега",
      minWeight: 4000,
      maxWeight: 14000
    },
    {
      name: "Текстиль",
      vehicle: "mega",
      vehicleLabel: "Мега",
      minWeight: 1800,
      maxWeight: 9000
    },
    {
      name: "Промислове обладнання",
      vehicle: "curtain",
      vehicleLabel: "Тент",
      minWeight: 6500,
      maxWeight: 21000
    },
    {
      name: "Збірний вантаж",
      vehicle: "van",
      vehicleLabel: "Фургон",
      minWeight: 500,
      maxWeight: 3500
    }
  ];


  /* ============================================================
     ORDER SOURCES
  ============================================================ */

  C12.sources = [
    {
      id: "email",
      label: "Email",
      share: 31
    },
    {
      id: "exchange",
      label: "Транспортна біржа",
      share: 26
    },
    {
      id: "phone",
      label: "Телефон",
      share: 19
    },
    {
      id: "regular",
      label: "Постійний клієнт",
      share: 16
    },
    {
      id: "messenger",
      label: "Месенджер",
      share: 8
    }
  ];


  /* ============================================================
     STATUSES
  ============================================================ */

  C12.statuses = {
    new: {
      label: "НОВЕ",
      group: "new",
      attention: false
    },
    planning: {
      label: "ПЛАНУВАННЯ",
      group: "planning",
      attention: false
    },
    assigned: {
      label: "ПРИЗНАЧЕНО",
      group: "assigned",
      attention: false
    },
    loading: {
      label: "ЗАВАНТАЖЕННЯ",
      group: "assigned",
      attention: false
    },
    transit: {
      label: "У ДОРОЗІ",
      group: "transit",
      attention: false
    },
    delayed: {
      label: "ЗАТРИМКА",
      group: "attention",
      attention: true
    },
    customs: {
      label: "МИТНИЦЯ",
      group: "transit",
      attention: false
    },
    issue: {
      label: "ПОТРЕБУЄ УВАГИ",
      group: "attention",
      attention: true
    },
    delivered: {
      label: "ДОСТАВЛЕНО",
      group: "delivered",
      attention: false
    }
  };


  /* ============================================================
     ROUTE POOL
  ============================================================ */

  C12.routePool = [
    ["Львів", "Краків"],
    ["Львів", "Варшава"],
    ["Львів", "Жешув"],
    ["Львів", "Люблін"],
    ["Львів", "Катовіце"],
    ["Львів", "Вроцлав"],
    ["Львів", "Кошице"],
    ["Львів", "Будапешт"],
    ["Львів", "Клуж-Напока"],

    ["Київ", "Львів"],
    ["Київ", "Варшава"],
    ["Київ", "Краків"],
    ["Київ", "Будапешт"],

    ["Тернопіль", "Краків"],
    ["Тернопіль", "Жешув"],
    ["Тернопіль", "Варшава"],

    ["Івано-Франківськ", "Краків"],
    ["Івано-Франківськ", "Кошице"],
    ["Івано-Франківськ", "Будапешт"],

    ["Ужгород", "Кошице"],
    ["Ужгород", "Будапешт"],
    ["Ужгород", "Краків"],

    ["Чернівці", "Клуж-Напока"],
    ["Чернівці", "Бухарест"],
    ["Чернівці", "Будапешт"],

    ["Рівне", "Люблін"],
    ["Рівне", "Варшава"],

    ["Луцьк", "Люблін"],
    ["Луцьк", "Варшава"],

    ["Краків", "Львів"],
    ["Варшава", "Львів"],
    ["Жешув", "Львів"],
    ["Катовіце", "Львів"],
    ["Вроцлав", "Львів"],
    ["Будапешт", "Львів"],
    ["Кошице", "Ужгород"]
  ];


  /* ============================================================
     MAIN STORY ORDER
  ============================================================ */

  C12.mainOrder = {
    id: "TR-2026-00184",
    createdAt: "2026-08-26T09:47:00",

    source: "email",
    sourceLabel: "Email",

    client: "WestWood Ukraine",
    contact: "Ірина Мельник",
    email: "logistics@westwood.ua",

    origin: "Львів",
    originCountry: "Україна",
    destination: "Краків",
    destinationCountry: "Польща",

    pickupAt: "2026-08-26T10:00:00",
    deliveryAt: "2026-08-28T14:00:00",

    cargo: "Дерев'яні панелі",
    pallets: 12,
    weightKg: 4800,

    vehicleType: "curtain",
    vehicleTypeLabel: "Тент",

    execution: null,
    carrier: null,

    vehicle: null,
    driver: null,

    status: "new",
    attention: false,

    revenue: 1680,
    cost: 1260,
    margin: 420,

    eta: "2026-08-28T14:00:00",

    deliveredAt: null,
    receivedBy: null,

    cmr: false,
    pod: false,

    history: [
      {
        time: "2026-08-26T09:47:00",
        status: "new",
        title: "Заявку отримано",
        actor: "Диспетчер"
      }
    ]
  };


  /* ============================================================
     GENERATED ORDER HELPERS
  ============================================================ */

  function getLocation(city) {
    return C12.locations.find(item => item.city === city) || {
      city,
      country: "",
      code: "",
      x: 50,
      y: 50
    };
  }


  function sourceForIndex(index) {
    const n = index % 100;

    if (n < 31) return C12.sources[0];
    if (n < 57) return C12.sources[1];
    if (n < 76) return C12.sources[2];
    if (n < 92) return C12.sources[3];

    return C12.sources[4];
  }


  function statusForIndex(index) {
    const n = index % 100;

    if (n < 5) return "new";
    if (n < 11) return "planning";
    if (n < 18) return "assigned";
    if (n < 23) return "loading";
    if (n < 46) return "transit";
    if (n < 48) return "delayed";
    if (n < 52) return "customs";
    if (n < 53) return "issue";

    return "delivered";
  }


  function executionForStatus(index, status) {
    if (status === "new" || status === "planning") {
      return null;
    }

    return pseudo(index, 14) < 0.69 ? "own" : "carrier";
  }


  function calculateDistance(origin, destination) {
    const a = getLocation(origin);
    const b = getLocation(destination);

    const dx = Math.abs(a.x - b.x);
    const dy = Math.abs(a.y - b.y);

    return Math.round(120 + (dx * 17) + (dy * 13));
  }


  function buildGeneratedOrder(index) {
    const number = index + 1;

    const route = pick(
      C12.routePool,
      Math.floor(pseudo(index, 2) * C12.routePool.length)
    );

    const origin = route[0];
    const destination = route[1];

    const originData = getLocation(origin);
    const destinationData = getLocation(destination);

    const client = pick(
      C12.clients,
      Math.floor(pseudo(index, 3) * C12.clients.length)
    );

    const cargo = pick(
      C12.cargoTypes,
      Math.floor(pseudo(index, 4) * C12.cargoTypes.length)
    );

    const source = sourceForIndex(index);

    const status = statusForIndex(index);

    const execution = executionForStatus(index, status);

    const distanceKm = calculateDistance(origin, destination);

    const weightRange = cargo.maxWeight - cargo.minWeight;

    const weightKg = Math.round(
      cargo.minWeight + pseudo(index, 5) * weightRange
    );

    const pallets = Math.max(
      1,
      Math.min(
        33,
        Math.round(weightKg / (420 + pseudo(index, 6) * 260))
      )
    );

    const createdBase = new Date("2026-08-18T07:00:00");

    const createdAt = new Date(
      createdBase.getTime() +
      (index * 58 * 60 * 1000) +
      Math.round(pseudo(index, 7) * 40 * 60 * 1000)
    );

    const pickupAt = new Date(
      createdAt.getTime() +
      (6 + Math.round(pseudo(index, 8) * 30)) * HOUR
    );

    const tripHours = Math.max(
      5,
      Math.round(distanceKm / 58) + 4 + Math.round(pseudo(index, 9) * 9)
    );

    const deliveryAt = new Date(
      pickupAt.getTime() + tripHours * HOUR
    );

    const revenue = money(
      420 +
      distanceKm * (1.18 + pseudo(index, 10) * 0.48) +
      weightKg * 0.018
    );

    const targetMargin = 0.14 + pseudo(index, 11) * 0.15;

    const cost = money(revenue * (1 - targetMargin));

    const margin = revenue - cost;

    let vehicle = null;
    let driver = null;
    let carrier = null;

    if (execution === "own") {
      const vehicleData = pick(
        C12.vehicles,
        Math.floor(pseudo(index, 12) * C12.vehicles.length)
      );

      vehicle = vehicleData.displayPlate;
      driver = vehicleData.driver;
    }

    if (execution === "carrier") {
      const carrierData = pick(
        C12.carriers,
        Math.floor(pseudo(index, 13) * C12.carriers.length)
      );

      carrier = carrierData.name;

      const externalPlateNumber = 1000 + ((index * 137) % 8999);

      vehicle =
        pick(["KA", "KR", "RZ", "LU", "WI", "SK"], index) +
        " " +
        externalPlateNumber +
        " " +
        pick(["AX", "TR", "PL", "KT", "LX"], index + 2);

      driver = pick(
        [
          "Marek Zieliński",
          "Piotr Kowalski",
          "Jan Nowak",
          "Tomasz Wójcik",
          "Kamil Mazur",
          "Pavlo Horbunov",
          "Mykola Tkach",
          "Oleksii Bondarenko"
        ],
        index
      );
    }

    const isAttention =
      status === "delayed" ||
      status === "issue";

    const eta = new Date(deliveryAt);

    if (status === "delayed") {
      eta.setHours(
        eta.getHours() + 2 + Math.round(pseudo(index, 15) * 3)
      );
    }

    const deliveredAt =
      status === "delivered"
        ? new Date(
            deliveryAt.getTime() +
            Math.round((pseudo(index, 16) - 0.58) * 3.5 * HOUR)
          )
        : null;

    return {
      id: `TR-2026-${pad(number, 5)}`,

      createdAt: isoLocal(createdAt),

      source: source.id,
      sourceLabel: source.label,

      client: client.name,
      contact: client.contact,
      email: client.email,

      origin,
      originCountry: originData.country,

      destination,
      destinationCountry: destinationData.country,

      distanceKm,

      pickupAt: isoLocal(pickupAt),
      deliveryAt: isoLocal(deliveryAt),

      cargo: cargo.name,
      pallets,
      weightKg,

      vehicleType: cargo.vehicle,
      vehicleTypeLabel: cargo.vehicleLabel,

      execution,
      executionLabel:
        execution === "own"
          ? "Власний транспорт"
          : execution === "carrier"
            ? "Залучений перевізник"
            : "Не призначено",

      carrier,

      vehicle,
      driver,

      status,
      statusLabel: C12.statuses[status].label,

      attention: isAttention,

      revenue,
      cost,
      margin,

      marginPercent:
        revenue > 0
          ? Math.round((margin / revenue) * 1000) / 10
          : 0,

      eta: isoLocal(eta),

      deliveredAt:
        deliveredAt
          ? isoLocal(deliveredAt)
          : null,

      receivedBy:
        status === "delivered"
          ? pick(
              [
                "Jan Kowalski",
                "Anna Nowak",
                "Piotr Mazur",
                "Marek Wójcik",
                "Ірина Мельник",
                "Олег Коваль",
                "Martin Kováč",
                "Péter Nagy"
              ],
              index
            )
          : null,

      cmr: status === "delivered",
      pod: status === "delivered",

      history: []
    };
  }


  /* ============================================================
     BUILD 200 ORDERS
  ============================================================ */

  C12.orders = [];

  for (let index = 0; index < 200; index += 1) {
    C12.orders.push(buildGeneratedOrder(index));
  }


  /* ============================================================
     REPLACE #184 WITH STORY ORDER

     Array index 183 = TR-2026-00184
  ============================================================ */

  C12.orders[183] = C12.mainOrder;


  /* ============================================================
     ORDERS USED IN INITIAL DISPATCHER TABLE
  ============================================================ */

  C12.featuredOrderIds = [
    "TR-2026-00184",
    "TR-2026-00183",
    "TR-2026-00182",
    "TR-2026-00181",
    "TR-2026-00180",
    "TR-2026-00179",
    "TR-2026-00178",
    "TR-2026-00177",
    "TR-2026-00176",
    "TR-2026-00175",
    "TR-2026-00174",
    "TR-2026-00173"
  ];


  /* ============================================================
     INCOMING LIVE STREAM
  ============================================================ */

  C12.incomingRequests = [
    {
      source: "email",
      sourceLabel: "Email",
      time: "09:48",
      client: "NordPack",
      route: "Львів → Варшава",
      text: "18 палет · тент"
    },
    {
      source: "phone",
      sourceLabel: "Телефон",
      time: "09:49",
      client: "FreshLine Distribution",
      route: "Тернопіль → Краків",
      text: "Рефрижератор · 8 200 кг"
    },
    {
      source: "exchange",
      sourceLabel: "Біржа",
      time: "09:51",
      client: "Новий запит",
      route: "Жешув → Львів",
      text: "Тент · 20 палет"
    },
    {
      source: "messenger",
      sourceLabel: "Messenger",
      time: "09:53",
      client: "BuildWest",
      route: "Львів → Катовіце",
      text: "Будматеріали · 11 400 кг"
    },
    {
      source: "email",
      sourceLabel: "Email",
      time: "09:55",
      client: "Galicia Foods",
      route: "Львів → Люблін",
      text: "Рефрижератор · 16 палет"
    },
    {
      source: "regular",
      sourceLabel: "Постійний клієнт",
      time: "09:57",
      client: "WestWood Ukraine",
      route: "Львів → Вроцлав",
      text: "Тент · 9 600 кг"
    },
    {
      source: "phone",
      sourceLabel: "Телефон",
      time: "10:01",
      client: "UA Glass",
      route: "Київ → Краків",
      text: "Скло · 14 300 кг"
    },
    {
      source: "exchange",
      sourceLabel: "Біржа",
      time: "10:04",
      client: "Новий запит",
      route: "Варшава → Львів",
      text: "Збірний вантаж"
    },
    {
      source: "messenger",
      sourceLabel: "Messenger",
      time: "10:06",
      client: "ProMebel",
      route: "Івано-Франківськ → Кошице",
      text: "Меблі · 14 палет"
    },
    {
      source: "email",
      sourceLabel: "Email",
      time: "10:08",
      client: "GreenField Agro",
      route: "Львів → Будапешт",
      text: "21 палета · тент"
    }
  ];

  C12.inboxRequests = [

  {
    id: "REQ-EMAIL-001",
    source: "email",
    sourceLabel: "Email",
    time: "09:47",
    unread: true,
    isMain: true,

    client: "WestWood Ukraine",
    contact: "Ірина Мельник",
    contactLine: "logistics@westwood.ua",

    title: "Перевезення Львів → Краків · 26.08",
    preview: "12 палет · 4 800 кг · тент",

    origin: "Львів",
    destination: "Краків",

    pickup: "26.08 · 10:00",
    delivery: "28.08 · до 14:00",

    cargo: "Дерев'яні панелі",
    pallets: 12,
    weightKg: 4800,
    vehicleType: "Тент",

    message:
      "Доброго дня. Потрібне перевезення вантажу зі Львова до Кракова. Завантаження сьогодні о 10:00. Просимо підтвердити автомобіль та орієнтовний час доставки."
  },


  {
    id: "REQ-EMAIL-002",
    source: "email",
    sourceLabel: "Email",
    time: "09:48",
    unread: true,
    isMain: false,

    client: "NordPack",
    contact: "Марія Савчук",
    contactLine: "orders@nordpack.ua",

    title: "Львів → Варшава · 27.08",
    preview: "18 палет · 7 600 кг · тент",

    origin: "Львів",
    destination: "Варшава",

    pickup: "27.08 · 08:30",
    delivery: "28.08 · до 17:00",

    cargo: "Пакувальні матеріали",
    pallets: 18,
    weightKg: 7600,
    vehicleType: "Тент",

    message:
      "Добрий день. Потрібна машина Львів — Варшава на завтра. 18 палет пакувальних матеріалів. Завантаження бажано до 09:00."
  },


  {
    id: "REQ-EMAIL-003",
    source: "email",
    sourceLabel: "Email",
    time: "09:55",
    unread: true,
    isMain: false,

    client: "Galicia Foods",
    contact: "Олег Коваль",
    contactLine: "transport@galiciafoods.ua",

    title: "Львів → Люблін · 26.08",
    preview: "16 палет · 9 200 кг · рефрижератор",

    origin: "Львів",
    destination: "Люблін",

    pickup: "26.08 · 16:00",
    delivery: "27.08 · до 12:00",

    cargo: "Продукти харчування",
    pallets: 16,
    weightKg: 9200,
    vehicleType: "Рефрижератор",

    message:
      "Просимо підтвердити рефрижератор на сьогодні. Температурний режим +4°C. Доставка до Любліна завтра до обіду."
  },


  {
    id: "REQ-PHONE-001",
    source: "phone",
    sourceLabel: "Телефон",
    time: "09:49",
    unread: true,
    isMain: false,

    client: "FreshLine Distribution",
    contact: "Андрій Левицький",
    contactLine: "+380 67 351 42 18",

    title: "Вхідний дзвінок · FreshLine",
    preview: "Тернопіль → Краків · 8 200 кг",

    origin: "Тернопіль",
    destination: "Краків",

    pickup: "26.08 · 14:00",
    delivery: "27.08 · до 09:00",

    cargo: "Продукти харчування",
    pallets: 14,
    weightKg: 8200,
    vehicleType: "Рефрижератор",

    message:
      "Менеджер зафіксував зі слів клієнта: потрібен рефрижератор із Тернополя до Кракова. Забрати сьогодні після 14:00. Вага приблизно 8,2 т."
  },


  {
    id: "REQ-PHONE-002",
    source: "phone",
    sourceLabel: "Телефон",
    time: "10:01",
    unread: true,
    isMain: false,

    client: "UA Glass",
    contact: "Тарас Козак",
    contactLine: "+380 50 618 37 90",

    title: "Вхідний дзвінок · UA Glass",
    preview: "Київ → Краків · скло · 14 300 кг",

    origin: "Київ",
    destination: "Краків",

    pickup: "27.08 · 07:00",
    delivery: "28.08 · до 15:00",

    cargo: "Скляна продукція",
    pallets: 20,
    weightKg: 14300,
    vehicleType: "Тент",

    message:
      "Клієнту потрібен автомобіль для перевезення скла Київ — Краків. Обов'язкове надійне кріплення вантажу. Завантаження завтра зранку."
  },


  {
    id: "REQ-MSG-001",
    source: "messenger",
    sourceLabel: "Viber",
    time: "09:53",
    unread: true,
    isMain: false,

    client: "BuildWest",
    contact: "Ігор Павлюк",
    contactLine: "Viber",

    title: "BuildWest · Viber",
    preview: "Львів → Катовіце · 11 400 кг",

    origin: "Львів",
    destination: "Катовіце",

    pickup: "27.08 · 11:00",
    delivery: "28.08 · до 14:00",

    cargo: "Будівельні матеріали",
    pallets: 20,
    weightKg: 11400,
    vehicleType: "Тент",

    chat: [
      {
        side: "client",
        text: "Добрий день. Є машина на Катовіце?"
      },
      {
        side: "dispatcher",
        text: "На яку дату потрібне завантаження?"
      },
      {
        side: "client",
        text: "Завтра об 11:00. Будматеріали, 11,4 т, тент."
      }
    ]
  },


  {
    id: "REQ-MSG-002",
    source: "messenger",
    sourceLabel: "Telegram",
    time: "10:06",
    unread: true,
    isMain: false,

    client: "ProMebel",
    contact: "Сергій Ткачук",
    contactLine: "Telegram",

    title: "ProMebel · Telegram",
    preview: "Івано-Франківськ → Кошице · 14 палет",

    origin: "Івано-Франківськ",
    destination: "Кошице",

    pickup: "27.08 · 09:00",
    delivery: "27.08 · до 19:00",

    cargo: "Меблі",
    pallets: 14,
    weightKg: 6100,
    vehicleType: "Тент",

    chat: [
      {
        side: "client",
        text: "Потрібне авто на Кошице завтра."
      },
      {
        side: "client",
        text: "14 палет меблів, близько 6 тонн."
      },
      {
        side: "dispatcher",
        text: "Прийнято. Перевіряємо доступний транспорт."
      }
    ]
  },


  {
    id: "REQ-MSG-003",
    source: "messenger",
    sourceLabel: "WhatsApp",
    time: "10:11",
    unread: true,
    isMain: false,

    client: "AquaTrade",
    contact: "Юлія Семенюк",
    contactLine: "WhatsApp",

    title: "AquaTrade · WhatsApp",
    preview: "Львів → Жешув · 21 палета",

    origin: "Львів",
    destination: "Жешув",

    pickup: "26.08 · 18:30",
    delivery: "27.08 · до 08:00",

    cargo: "Напої",
    pallets: 21,
    weightKg: 15800,
    vehicleType: "Тент",

    chat: [
      {
        side: "client",
        text: "Чи можете сьогодні забрати 21 палету на Жешув?"
      },
      {
        side: "dispatcher",
        text: "Так, перевіряємо машину."
      },
      {
        side: "client",
        text: "Вага 15,8 т. Завантаження після 18:30."
      }
    ]
  },


  {
    id: "REQ-MSG-004",
    source: "messenger",
    sourceLabel: "Viber",
    time: "10:18",
    unread: true,
    isMain: false,

    client: "Carpathian Furniture",
    contact: "Роман Гнатюк",
    contactLine: "Viber",

    title: "Carpathian Furniture · Viber",
    preview: "Львів → Вроцлав · 18 палет",

    origin: "Львів",
    destination: "Вроцлав",

    pickup: "28.08 · 08:00",
    delivery: "29.08 · до 18:00",

    cargo: "Меблі",
    pallets: 18,
    weightKg: 7900,
    vehicleType: "Мега",

    chat: [
      {
        side: "client",
        text: "Романе, потрібна мега на Вроцлав."
      },
      {
        side: "dispatcher",
        text: "Коли завантаження?"
      },
      {
        side: "client",
        text: "28-го зранку. 18 палет."
      }
    ]
  },


  {
    id: "REQ-EX-001",
    source: "exchange",
    sourceLabel: "Lardi-Trans",
    time: "09:51",
    unread: true,
    isMain: false,

    client: "MetalPro Sp. z o.o.",
    contact: "Krzysztof Nowak",
    contactLine: "Lardi-Trans",

    title: "Жешув → Львів",
    preview: "Тент · 20 палет · €940",

    origin: "Жешув",
    destination: "Львів",

    pickup: "27.08 · 08:00",
    delivery: "27.08 · до 19:00",

    cargo: "Промислове обладнання",
    pallets: 20,
    weightKg: 13600,
    vehicleType: "Тент",

    rate: "€940",

    message:
      "Вантаж доступний з 08:00. 20 палет. Повне завантаження. Оплата 14 днів."
  },


  {
    id: "REQ-EX-002",
    source: "exchange",
    sourceLabel: "DELLA",
    time: "10:04",
    unread: true,
    isMain: false,

    client: "Cargo Polska",
    contact: "Michał Wójcik",
    contactLine: "DELLA",

    title: "Варшава → Львів",
    preview: "Збірний вантаж · €620",

    origin: "Варшава",
    destination: "Львів",

    pickup: "27.08 · 12:00",
    delivery: "28.08 · до 12:00",

    cargo: "Збірний вантаж",
    pallets: 6,
    weightKg: 2900,
    vehicleType: "Фургон",

    rate: "€620",

    message:
      "Шість палет збірного вантажу. Можливе дозавантаження. Документи готові."
  },


  {
    id: "REQ-EX-003",
    source: "exchange",
    sourceLabel: "Lardi-Trans",
    time: "10:12",
    unread: true,
    isMain: false,

    client: "EcoPack PL",
    contact: "Tomasz Lis",
    contactLine: "Lardi-Trans",

    title: "Краків → Київ",
    preview: "Тент · 9 800 кг · €1 360",

    origin: "Краків",
    destination: "Київ",

    pickup: "28.08 · 06:00",
    delivery: "29.08 · до 18:00",

    cargo: "Пакувальні матеріали",
    pallets: 22,
    weightKg: 9800,
    vehicleType: "Тент",

    rate: "€1 360",

    message:
      "Завантаження Краків. Митні документи на стороні відправника. Потрібен стандартний тент."
  },


  {
    id: "REQ-EX-004",
    source: "exchange",
    sourceLabel: "DELLA",
    time: "10:16",
    unread: true,
    isMain: false,

    client: "Slovak Industry",
    contact: "Martin Kováč",
    contactLine: "DELLA",

    title: "Кошице → Ужгород",
    preview: "Тент · 12 палет · €480",

    origin: "Кошице",
    destination: "Ужгород",

    pickup: "27.08 · 15:00",
    delivery: "27.08 · до 22:00",

    cargo: "Промислове обладнання",
    pallets: 12,
    weightKg: 6800,
    vehicleType: "Тент",

    rate: "€480",

    message:
      "Короткий міжнародний рейс. Завантаження після 15:00. Без ADR."
  },


  {
    id: "REQ-EX-005",
    source: "exchange",
    sourceLabel: "Lardi-Trans",
    time: "10:21",
    unread: true,
    isMain: false,

    client: "Danube Trade",
    contact: "Péter Nagy",
    contactLine: "Lardi-Trans",

    title: "Будапешт → Львів",
    preview: "Мега · 18 палет · €1 050",

    origin: "Будапешт",
    destination: "Львів",

    pickup: "28.08 · 07:00",
    delivery: "29.08 · до 12:00",

    cargo: "Текстиль",
    pallets: 18,
    weightKg: 7400,
    vehicleType: "Мега",

    rate: "€1 050",

    message:
      "Легкий об'ємний вантаж. Потрібна mega. Готовність 28 серпня з 07:00."
  },


  {
    id: "REQ-EX-006",
    source: "exchange",
    sourceLabel: "DELLA",
    time: "10:24",
    unread: true,
    isMain: false,

    client: "Baltic Home",
    contact: "Katarzyna Wójcik",
    contactLine: "DELLA",

    title: "Люблін → Львів",
    preview: "Тент · 16 палет · €710",

    origin: "Люблін",
    destination: "Львів",

    pickup: "27.08 · 17:00",
    delivery: "28.08 · до 09:00",

    cargo: "Меблі",
    pallets: 16,
    weightKg: 7200,
    vehicleType: "Тент",

    rate: "€710",

    message:
      "Меблі в упаковці. Бокове завантаження бажане. CMR на місці."
  }

];


C12.inboxSourceConfig = {

  email: {
    label: "Email",
    icon: "✉",
    empty: "Нових листів немає"
  },

  phone: {
    label: "Телефон",
    icon: "☎",
    empty: "Нових телефонних звернень немає"
  },

  messenger: {
    label: "Месенджери",
    icon: "●",
    empty: "Нових повідомлень немає"
  },

  exchange: {
    label: "Транспортні біржі",
    icon: "⇄",
    empty: "Нових пропозицій немає"
  }

};


C12.getInboxRequests = function (
  source
) {
  return C12.inboxRequests
    .filter(
      item =>
        item.source === source &&
        item.unread !== false
    );
};


C12.getInboxRequest = function (
  id
) {
  return C12.inboxRequests
    .find(
      item =>
        item.id === id
    ) || null;
};


C12.getInboxCounts = function () {

  const counts = {
    email: 0,
    phone: 0,
    messenger: 0,
    exchange: 0,
    total: 0
  };

  C12.inboxRequests
    .filter(
      item =>
        item.unread !== false
    )
    .forEach(
      item => {
        if (
          Object.prototype
            .hasOwnProperty.call(
              counts,
              item.source
            )
        ) {
          counts[
            item.source
          ] += 1;

          counts.total += 1;
        }
      }
    );

  return counts;
};

  /* ============================================================
     PLANNING QUEUE
  ============================================================ */

  C12.planningQueue = C12.orders
    .filter(order =>
      order.status === "new" ||
      order.status === "planning"
    )
    .slice(0, 7);


  /* ============================================================
     ATTENTION ORDERS
  ============================================================ */

  C12.attentionOrders = [
    {
      id: "TR-2026-00141",
      route: "Львів → Варшава",
      issue: "ETA зміщено на 2 год",
      severity: "high",
      status: "delayed"
    },
    {
      id: "TR-2026-00167",
      route: "Чернівці → Бухарест",
      issue: "Очікування документа CMR",
      severity: "medium",
      status: "issue"
    },
    {
      id: "TR-2026-00192",
      route: "Київ → Краків",
      issue: "Ризик запізнення на завантаження",
      severity: "high",
      status: "issue"
    }
  ];


  /* ============================================================
     OWNER DASHBOARD
  ============================================================ */

  C12.ownerDashboard = {
    active: 47,
    today: 12,
    attention: 3,
    onTime: 96.4,

    fleet: {
      transit: 8,
      free: 2,
      reserved: 1,
      service: 1
    },

    finance: {
      revenue: 84600,
      cost: 66760,
      margin: 17840,
      marginPercent: 21.1
    },

    sources: {
      email: 31,
      exchange: 26,
      phone: 19,
      regular: 16,
      other: 8
    }
  };


  /* ============================================================
     MAP ROUTES
  ============================================================ */

  C12.mapRoutes = [
    {
      id: "MAP-01",
      orderId: "TR-2026-00184",
      from: "Львів",
      to: "Краків",
      status: "planning"
    },
    {
      id: "MAP-02",
      orderId: "TR-2026-00142",
      from: "Львів",
      to: "Варшава",
      status: "transit"
    },
    {
      id: "MAP-03",
      orderId: "TR-2026-00131",
      from: "Київ",
      to: "Краків",
      status: "transit"
    },
    {
      id: "MAP-04",
      orderId: "TR-2026-00127",
      from: "Львів",
      to: "Будапешт",
      status: "transit"
    },
    {
      id: "MAP-05",
      orderId: "TR-2026-00119",
      from: "Чернівці",
      to: "Бухарест",
      status: "attention"
    },
    {
      id: "MAP-06",
      orderId: "TR-2026-00111",
      from: "Ужгород",
      to: "Кошице",
      status: "transit"
    },
    {
      id: "MAP-07",
      orderId: "TR-2026-00103",
      from: "Краків",
      to: "Львів",
      status: "transit"
    },
    {
      id: "MAP-08",
      orderId: "TR-2026-00096",
      from: "Варшава",
      to: "Львів",
      status: "transit"
    },
    {
      id: "MAP-09",
      orderId: "TR-2026-00088",
      from: "Львів",
      to: "Катовіце",
      status: "transit"
    },
    {
      id: "MAP-10",
      orderId: "TR-2026-00073",
      from: "Івано-Франківськ",
      to: "Будапешт",
      status: "transit"
    }
  ];


  /* ============================================================
     TIME MACHINE
  ============================================================ */

  C12.timeMachine = [
    {
      position: 0,
      time: "2026-08-26T09:45:00",
      label: "26 серпня · 09:45",
      mainStatus: "new",
      active: 47,
      transit: 31,
      attention: 2,
      delivered: 118
    },
    {
      position: 9,
      time: "2026-08-26T09:47:00",
      label: "26 серпня · 09:47",
      mainStatus: "new",
      active: 48,
      transit: 31,
      attention: 2,
      delivered: 118
    },
    {
      position: 24,
      time: "2026-08-26T10:12:00",
      label: "26 серпня · 10:12",
      mainStatus: "assigned",
      active: 48,
      transit: 31,
      attention: 2,
      delivered: 118
    },
    {
      position: 39,
      time: "2026-08-26T11:05:00",
      label: "26 серпня · 11:05",
      mainStatus: "loading",
      active: 48,
      transit: 31,
      attention: 2,
      delivered: 118
    },
    {
      position: 48,
      time: "2026-08-26T11:42:00",
      label: "26 серпня · 11:42",
      mainStatus: "transit",
      active: 48,
      transit: 32,
      attention: 2,
      delivered: 118
    },
    {
      position: 65,
      time: "2026-08-27T18:20:00",
      label: "27 серпня · 18:20",
      mainStatus: "delayed",
      active: 45,
      transit: 29,
      attention: 3,
      delivered: 122
    },
    {
      position: 78,
      time: "2026-08-28T08:15:00",
      label: "28 серпня · 08:15",
      mainStatus: "transit",
      active: 42,
      transit: 27,
      attention: 2,
      delivered: 126
    },
    {
      position: 92,
      time: "2026-08-28T15:43:00",
      label: "28 серпня · 15:43",
      mainStatus: "delivered",
      active: 38,
      transit: 24,
      attention: 2,
      delivered: 131
    },
    {
      position: 100,
      time: "2026-08-28T18:00:00",
      label: "28 серпня · 18:00",
      mainStatus: "delivered",
      active: 36,
      transit: 22,
      attention: 1,
      delivered: 134
    }
  ];


  /* ============================================================
     STORY EVENTS
  ============================================================ */

  C12.storyEvents = {
    created: {
      title: "Замовлення створено",
      text: "TR-2026-00184 додано до реєстру перевезень."
    },

    assigned: {
      title: "Ресурс призначено",
      text: "DAF XF · BC 4587 KA · Олександр Петренко."
    },

    started: {
      title: "Рейс розпочато",
      text: "Водій підтвердив початок виконання перевезення."
    },

    arrived: {
      title: "Автомобіль на завантаженні",
      text: "Прибуття зафіксовано автоматично в історії замовлення."
    },

    loaded: {
      title: "Вантаж завантажено",
      text: "12 палет · 4 800 кг. Замовлення готове до відправлення."
    },

    transit: {
      title: "Вантаж у дорозі",
      text: "Клієнту оновлено статус перевезення."
    },

    delayed: {
      title: "Зафіксовано затримку",
      text: "ETA автоматично змінено. Учасники процесу отримали оновлення."
    },

    delivered: {
      title: "Доставку завершено",
      text: "Замовлення виконано. Клієнту надіслано підтвердження."
    },

    pod: {
      title: "Документ додано",
      text: "CMR / POD прикріплено до перевезення."
    }
  };


  /* ============================================================
     CUSTOMER MESSAGES
  ============================================================ */

  C12.customerMessages = [
    {
      id: "received",
      trigger: "created",
      channel: "Email",
      time: "26.08 · 09:48",
      title: "Заявку отримано",
      text: "Ваш запит на перевезення Львів → Краків отримано."
    },
    {
      id: "confirmed",
      trigger: "assigned",
      channel: "Email",
      time: "26.08 · 10:13",
      title: "Перевезення підтверджено",
      text: "Автомобіль призначено. Планова доставка — 28.08 до 14:00."
    },
    {
      id: "loaded",
      trigger: "transit",
      channel: "Email",
      time: "26.08 · 11:43",
      title: "Вантаж у дорозі",
      text: "Вантаж забрано у Львові та направлено до Кракова."
    },
    {
      id: "delay",
      trigger: "delayed",
      channel: "Email",
      time: "27.08 · 18:21",
      title: "Оновлення часу доставки",
      text: "Нове очікуване прибуття — 28.08 о 16:00."
    },
    {
      id: "delivered",
      trigger: "delivered",
      channel: "Email",
      time: "28.08 · 15:44",
      title: "Вантаж доставлено",
      text: "Доставку завершено. CMR / POD доступний у картці перевезення."
    }
  ];


  /* ============================================================
     AUTOMATION TEMPLATES
  ============================================================ */

  C12.automationTemplates = {
    orderCreated: [
      "Присвоєно номер TR-2026-00184",
      "Зафіксовано час створення заявки",
      "Замовлення додано до реєстру",
      "Статус встановлено: НОВЕ"
    ],

    vehicleAssigned: [
      "Перевірено відповідність типу автомобіля",
      "Перевірено вантажність",
      "Автомобіль BC 4587 KA зарезервовано",
      "Водія Олександра Петренка призначено на рейс",
      "Клієнту сформовано підтвердження"
    ],

    tripStarted: [
      "Статус рейсу оновлено",
      "Час старту записано в історію",
      "Замовлення переміщено в активні перевезення"
    ],

    cargoLoaded: [
      "Зафіксовано завершення завантаження",
      "Статус клієнта оновлено",
      "Розраховано поточний ETA"
    ],

    delayReported: [
      "Затримку записано в історію рейсу",
      "ETA перераховано: +2 години",
      "Замовлення позначено як таке, що потребує уваги",
      "Логісту створено попередження",
      "Диспетчеру оновлено статус",
      "Клієнту сформовано повідомлення",
      "KPI власника оновлено"
    ],

    delivered: [
      "Зафіксовано фактичний час доставки",
      "Статус змінено на ДОСТАВЛЕНО",
      "Автомобіль звільнено після рейсу",
      "Клієнту сформовано повідомлення про доставку",
      "Перевезення включено до операційної аналітики"
    ],

    documentUploaded: [
      "Документ прив'язано до TR-2026-00184",
      "Файл збережено в папці перевезення",
      "POD позначено як отриманий"
    ]
  };


  /* ============================================================
     BUSINESS RULE DEFINITIONS
  ============================================================ */

  C12.businessRules = {
    vehicleUnavailable: {
      title: "Автомобіль уже виконує рейс",
      description:
        "MAN TGX · BC 9123 TT недоступний у потрібний час. Поточний рейс завершується 27.08 о 18:00."
    },

    wrongCapacity: {
      title: "Недостатня вантажність",
      description:
        "Mercedes Atego · BC 7731 AA має вантажність 3 500 кг. Для цього замовлення потрібно перевезти 4 800 кг."
    },

    wrongType: {
      title: "Невідповідний тип автомобіля",
      description:
        "Тип автомобіля не відповідає вимогам цього перевезення."
    },

    validVehicle: {
      title: "Автомобіль відповідає вимогам",
      description:
        "DAF XF · BC 4587 KA доступний у Львові, має потрібний тип кузова та достатню вантажність."
    }
  };


  /* ============================================================
     RUNTIME STATE

     Інші JS-файли працюватимуть із цим об'єктом,
     а не будуть самі вигадувати стан кейсу.
  ============================================================ */

  C12.state = {
    mode: "guided",

    currentRole: "dispatcher",

    storyStarted: false,

    mainOrderCreated: false,
    mainOrderAssigned: false,

    tripStarted: false,
    arrivedLoading: false,
    cargoLoaded: false,
    inTransit: false,

    delayReported: false,

    delivered: false,
    podUploaded: false,

    simulationPosition: 4,
    simulationTime: "2026-08-26T09:45:00",

    customerMessagesVisible: [],

    automationEvents: [],

    selectedOrderFilter: "all",

    ordersModalOpen: false,

    soundEnabled: false
  };


  /* ============================================================
     PUBLIC DATA API
  ============================================================ */

  C12.data = {
    getOrder(id) {
      return C12.orders.find(order => order.id === id) || null;
    },

    getOrders() {
      return C12.orders;
    },

    getMainOrder() {
      return C12.mainOrder;
    },

    getVehicle(plate) {
      const normalized = String(plate || "").replace(/\s/g, "");

      return C12.vehicles.find(
        vehicle => vehicle.plate === normalized
      ) || null;
    },

    getDriver(name) {
      return C12.drivers.find(
        driver => driver.name === name
      ) || null;
    },

    getCarrier(name) {
      return C12.carriers.find(
        carrier => carrier.name === name
      ) || null;
    },

    getLocation,

    getStatus(status) {
      return C12.statuses[status] || C12.statuses.new;
    },

    getAttentionOrders() {
      return C12.attentionOrders;
    },

    getPlanningOrders() {
      return C12.planningQueue;
    },

    getFeaturedOrders() {
      return C12.featuredOrderIds
        .map(id => C12.orders.find(order => order.id === id))
        .filter(Boolean);
    },

    searchOrders(query) {
      const needle = String(query || "")
        .trim()
        .toLocaleLowerCase("uk-UA");

      if (!needle) {
        return C12.orders;
      }

      return C12.orders.filter(order => {
        const haystack = [
          order.id,
          order.client,
          order.origin,
          order.destination,
          order.cargo,
          order.vehicle,
          order.driver,
          order.carrier,
          order.statusLabel,
          order.sourceLabel
        ]
          .filter(Boolean)
          .join(" ")
          .toLocaleLowerCase("uk-UA");

        return haystack.includes(needle);
      });
    },

    filterOrders(filters = {}) {
      let result = [...C12.orders];

      if (
        filters.status &&
        filters.status !== "all"
      ) {
        result = result.filter(order => {
          if (filters.status === "attention") {
            return order.attention;
          }

          const definition = C12.statuses[order.status];

          return (
            order.status === filters.status ||
            definition?.group === filters.status
          );
        });
      }

      if (
        filters.execution &&
        filters.execution !== "all"
      ) {
        result = result.filter(
          order => order.execution === filters.execution
        );
      }

      if (filters.query) {
        const searchResult = new Set(
          C12.data
            .searchOrders(filters.query)
            .map(order => order.id)
        );

        result = result.filter(
          order => searchResult.has(order.id)
        );
      }

      return result;
    },

    getTimeState(position) {
      const numericPosition = Number(position);

      let closest = C12.timeMachine[0];

      for (const point of C12.timeMachine) {
        if (numericPosition >= point.position) {
          closest = point;
        } else {
          break;
        }
      }

      return closest;
    }
  };


  /* ============================================================
     SANITY CHECK
  ============================================================ */

  if (C12.orders.length !== 200) {
    console.error(
      "[CASE 12] Очікувалося 200 замовлень, отримано:",
      C12.orders.length
    );
  }

  console.info(
    "[CASE 12] Data loaded:",
    C12.orders.length,
    "orders ·",
    C12.vehicles.length,
    "vehicles ·",
    C12.drivers.length,
    "drivers ·",
    C12.carriers.length,
    "carriers"
  );

})();
