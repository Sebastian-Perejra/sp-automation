(function () {
  "use strict";

  const C12 = window.C12 = window.C12 || {};

  if (!C12.data || !C12.state) {
    console.error(
      "[CASE 12] case12-rules.js requires case12-data.js"
    );
    return;
  }


  /* ============================================================
     HELPERS
  ============================================================ */

  const normalizePlate = (plate) => {
    return String(plate || "")
      .replace(/\s+/g, "")
      .toUpperCase();
  };


  const toDate = (value) => {
    if (!value) return null;

    const date = new Date(value);

    return Number.isNaN(date.getTime())
      ? null
      : date;
  };


  const formatDateTime = (value) => {
    const date = toDate(value);

    if (!date) {
      return "—";
    }

    return new Intl.DateTimeFormat("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  };


  const vehicleName = (vehicle) => {
    if (!vehicle) {
      return "Невідомий автомобіль";
    }

    return [
      vehicle.brand,
      vehicle.model,
      "·",
      vehicle.displayPlate
    ].join(" ");
  };


  /* ============================================================
     RESULT FACTORY
  ============================================================ */

  function createResult({
    valid,
    code,
    title,
    description,
    severity = valid ? "success" : "error",
    vehicle = null,
    order = null,
    details = {}
  }) {
    return {
      valid: Boolean(valid),
      code,
      title,
      description,
      severity,
      vehicle,
      order,
      details
    };
  }


  /* ============================================================
     VEHICLE AVAILABILITY
  ============================================================ */

  function checkVehicleAvailability(vehicle, order) {
    if (!vehicle) {
      return createResult({
        valid: false,
        code: "VEHICLE_NOT_FOUND",
        title: "Автомобіль не знайдено",
        description:
          "У довіднику автопарку немає такого автомобіля."
      });
    }

    if (vehicle.status === "service") {
      return createResult({
        valid: false,
        code: "VEHICLE_SERVICE",
        title: "Автомобіль на сервісі",
        description:
          `${vehicleName(vehicle)} зараз недоступний: автомобіль перебуває на сервісному обслуговуванні.`,
        vehicle,
        order
      });
    }

    if (vehicle.status === "reserved") {
      return createResult({
        valid: false,
        code: "VEHICLE_RESERVED",
        title: "Автомобіль уже зарезервовано",
        description:
          `${vehicleName(vehicle)} вже призначений на інше перевезення.`,
        vehicle,
        order
      });
    }

    if (vehicle.status === "transit") {
      return createResult({
        valid: false,
        code: "VEHICLE_IN_TRANSIT",
        title: "Автомобіль уже виконує рейс",
        description:
          `${vehicleName(vehicle)} зараз у рейсі та недоступний для цього замовлення.`,
        vehicle,
        order
      });
    }

    if (vehicle.status !== "free") {
      return createResult({
        valid: false,
        code: "VEHICLE_UNAVAILABLE",
        title: "Автомобіль недоступний",
        description:
          `${vehicleName(vehicle)} не має статусу «Вільний».`,
        vehicle,
        order
      });
    }

    return createResult({
      valid: true,
      code: "VEHICLE_AVAILABLE",
      title: "Автомобіль доступний",
      description:
        `${vehicleName(vehicle)} доступний для планування.`,
      vehicle,
      order
    });
  }


  /* ============================================================
     BODY / VEHICLE TYPE
  ============================================================ */

  function checkVehicleType(vehicle, order) {
    if (!vehicle || !order) {
      return createResult({
        valid: false,
        code: "TYPE_DATA_MISSING",
        title: "Недостатньо даних",
        description:
          "Неможливо перевірити тип автомобіля."
      });
    }

    if (!order.vehicleType) {
      return createResult({
        valid: true,
        code: "TYPE_NOT_REQUIRED",
        title: "Спеціальний тип не потрібен",
        description:
          "Для цього замовлення немає обмеження за типом кузова.",
        vehicle,
        order
      });
    }

    if (vehicle.type !== order.vehicleType) {
      return createResult({
        valid: false,
        code: "WRONG_VEHICLE_TYPE",
        title: "Невідповідний тип автомобіля",
        description:
          `Замовлення потребує тип «${order.vehicleTypeLabel}», а ${vehicleName(vehicle)} має тип «${vehicle.typeLabel}».`,
        vehicle,
        order,
        details: {
          requiredType: order.vehicleType,
          requiredTypeLabel: order.vehicleTypeLabel,
          actualType: vehicle.type,
          actualTypeLabel: vehicle.typeLabel
        }
      });
    }

    return createResult({
      valid: true,
      code: "VEHICLE_TYPE_OK",
      title: "Тип автомобіля відповідає",
      description:
        `${vehicleName(vehicle)} має потрібний тип кузова «${vehicle.typeLabel}».`,
      vehicle,
      order
    });
  }


  /* ============================================================
     CAPACITY
  ============================================================ */

  function checkVehicleCapacity(vehicle, order) {
    if (!vehicle || !order) {
      return createResult({
        valid: false,
        code: "CAPACITY_DATA_MISSING",
        title: "Недостатньо даних",
        description:
          "Неможливо перевірити вантажність автомобіля."
      });
    }

    const requiredWeight = Number(order.weightKg || 0);
    const capacity = Number(vehicle.capacityKg || 0);

    if (requiredWeight > capacity) {
      const shortage = requiredWeight - capacity;

      return createResult({
        valid: false,
        code: "INSUFFICIENT_CAPACITY",
        title: "Недостатня вантажність",
        description:
          `${vehicleName(vehicle)} може перевозити до ${capacity.toLocaleString("uk-UA")} кг. Вага вантажу — ${requiredWeight.toLocaleString("uk-UA")} кг. Перевищення — ${shortage.toLocaleString("uk-UA")} кг.`,
        vehicle,
        order,
        details: {
          requiredWeight,
          capacity,
          shortage
        }
      });
    }

    return createResult({
      valid: true,
      code: "CAPACITY_OK",
      title: "Вантажність достатня",
      description:
        `${vehicleName(vehicle)} має достатню вантажність для ${requiredWeight.toLocaleString("uk-UA")} кг.`,
      vehicle,
      order,
      details: {
        requiredWeight,
        capacity,
        remainingCapacity: capacity - requiredWeight
      }
    });
  }


  /* ============================================================
     PALLET CAPACITY
  ============================================================ */

  function checkPalletCapacity(vehicle, order) {
    if (!vehicle || !order) {
      return createResult({
        valid: false,
        code: "PALLET_DATA_MISSING",
        title: "Недостатньо даних",
        description:
          "Неможливо перевірити кількість палет."
      });
    }

    const requiredPallets = Number(order.pallets || 0);
    const availablePallets = Number(vehicle.pallets || 0);

    if (
      requiredPallets > 0 &&
      availablePallets > 0 &&
      requiredPallets > availablePallets
    ) {
      return createResult({
        valid: false,
        code: "INSUFFICIENT_PALLET_CAPACITY",
        title: "Недостатньо палетомісць",
        description:
          `Для замовлення потрібно ${requiredPallets} палет, а ${vehicleName(vehicle)} вміщує максимум ${availablePallets}.`,
        vehicle,
        order,
        details: {
          requiredPallets,
          availablePallets
        }
      });
    }

    return createResult({
      valid: true,
      code: "PALLET_CAPACITY_OK",
      title: "Палетомісць достатньо",
      description:
        `${vehicleName(vehicle)} підходить за кількістю палетомісць.`,
      vehicle,
      order
    });
  }


  /* ============================================================
     DRIVER
  ============================================================ */

  function checkDriver(vehicle, order) {
    if (!vehicle) {
      return createResult({
        valid: false,
        code: "DRIVER_VEHICLE_MISSING",
        title: "Автомобіль не визначено",
        description:
          "Неможливо перевірити водія без автомобіля."
      });
    }

    if (!vehicle.driver) {
      return createResult({
        valid: false,
        code: "DRIVER_NOT_ASSIGNED",
        title: "Немає водія",
        description:
          `${vehicleName(vehicle)} не має призначеного водія.`,
        vehicle,
        order
      });
    }

    const driver = C12.data.getDriver(vehicle.driver);

    if (!driver) {
      return createResult({
        valid: false,
        code: "DRIVER_NOT_FOUND",
        title: "Водія не знайдено",
        description:
          `Водій ${vehicle.driver} відсутній у довіднику водіїв.`,
        vehicle,
        order
      });
    }

    if (
      driver.status === "transit" &&
      vehicle.status !== "free"
    ) {
      return createResult({
        valid: false,
        code: "DRIVER_BUSY",
        title: "Водій уже виконує рейс",
        description:
          `${driver.name} зараз виконує інше перевезення.`,
        vehicle,
        order,
        details: {
          driver
        }
      });
    }

    return createResult({
      valid: true,
      code: "DRIVER_OK",
      title: "Водій доступний",
      description:
        `${driver.name} може бути призначений на це перевезення.`,
      vehicle,
      order,
      details: {
        driver
      }
    });
  }


  /* ============================================================
     LOCATION
  ============================================================ */

  function checkVehicleLocation(vehicle, order) {
    if (!vehicle || !order) {
      return createResult({
        valid: false,
        code: "LOCATION_DATA_MISSING",
        title: "Недостатньо даних",
        description:
          "Неможливо перевірити локацію автомобіля."
      });
    }

    if (!vehicle.location || !order.origin) {
      return createResult({
        valid: true,
        code: "LOCATION_UNKNOWN",
        title: "Локацію не перевірено",
        description:
          "Для автомобіля або замовлення немає точної локації.",
        severity: "warning",
        vehicle,
        order
      });
    }

    if (vehicle.location !== order.origin) {
      return createResult({
        valid: true,
        code: "REPOSITION_REQUIRED",
        title: "Потрібна подача автомобіля",
        description:
          `${vehicleName(vehicle)} зараз знаходиться у місті ${vehicle.location}, а завантаження заплановане у місті ${order.origin}.`,
        severity: "warning",
        vehicle,
        order,
        details: {
          vehicleLocation: vehicle.location,
          pickupLocation: order.origin
        }
      });
    }

    return createResult({
      valid: true,
      code: "LOCATION_OK",
      title: "Автомобіль у точці завантаження",
      description:
        `${vehicleName(vehicle)} знаходиться у місті ${order.origin}.`,
      vehicle,
      order
    });
  }


  /* ============================================================
     ORDER ASSIGNABILITY
  ============================================================ */

  function checkOrderAssignable(order) {
    if (!order) {
      return createResult({
        valid: false,
        code: "ORDER_NOT_FOUND",
        title: "Замовлення не знайдено",
        description:
          "Неможливо виконати перевірку замовлення."
      });
    }

    if (order.status === "delivered") {
      return createResult({
        valid: false,
        code: "ORDER_ALREADY_DELIVERED",
        title: "Перевезення вже завершено",
        description:
          `${order.id} уже має статус «Доставлено».`,
        order
      });
    }

    if (
      order.status === "transit" ||
      order.status === "loading"
    ) {
      return createResult({
        valid: false,
        code: "ORDER_ALREADY_STARTED",
        title: "Рейс уже розпочато",
        description:
          `${order.id} вже виконується. Змінювати автомобіль через стандартне планування не можна.`,
        order
      });
    }

    return createResult({
      valid: true,
      code: "ORDER_ASSIGNABLE",
      title: "Замовлення доступне для планування",
      description:
        `${order.id} можна призначити на транспорт.`,
      order
    });
  }


  /* ============================================================
     COMPLETE VEHICLE CHECK
  ============================================================ */

  function validateVehicleForOrder(vehicleInput, orderInput) {
    const vehicle =
      typeof vehicleInput === "string"
        ? C12.data.getVehicle(vehicleInput)
        : vehicleInput;

    const order =
      typeof orderInput === "string"
        ? C12.data.getOrder(orderInput)
        : orderInput;

    const checks = [];

    const orderCheck = checkOrderAssignable(order);
    checks.push(orderCheck);

    if (!orderCheck.valid) {
      return {
        valid: false,
        vehicle,
        order,
        checks,
        blocking: orderCheck,
        warnings: []
      };
    }

    const availability = checkVehicleAvailability(
      vehicle,
      order
    );

    checks.push(availability);

    const type = checkVehicleType(
      vehicle,
      order
    );

    checks.push(type);

    const capacity = checkVehicleCapacity(
      vehicle,
      order
    );

    checks.push(capacity);

    const pallets = checkPalletCapacity(
      vehicle,
      order
    );

    checks.push(pallets);

    const driver = checkDriver(
      vehicle,
      order
    );

    checks.push(driver);

    const location = checkVehicleLocation(
      vehicle,
      order
    );

    checks.push(location);

    const blocking = checks.find(
      result => !result.valid
    );

    const warnings = checks.filter(
      result => result.severity === "warning"
    );

    return {
      valid: !blocking,
      vehicle,
      order,
      checks,
      blocking: blocking || null,
      warnings
    };
  }


  /* ============================================================
     ASSIGN VEHICLE
  ============================================================ */

  function assignVehicleToOrder(vehicleInput, orderInput) {
    const validation = validateVehicleForOrder(
      vehicleInput,
      orderInput
    );

    if (!validation.valid) {
      return {
        success: false,
        validation,
        result: validation.blocking
      };
    }

    const vehicle = validation.vehicle;
    const order = validation.order;

    const driver = C12.data.getDriver(
      vehicle.driver
    );

    order.execution = "own";
    order.executionLabel = "Власний транспорт";

    order.vehicle = vehicle.displayPlate;
    order.driver = vehicle.driver;

    order.carrier = null;

    order.status = "assigned";
    order.statusLabel =
      C12.statuses.assigned.label;

    order.attention = false;

    vehicle.status = "reserved";

    if (driver) {
      driver.status = "reserved";
    }

    if (!Array.isArray(order.history)) {
      order.history = [];
    }

    order.history.push({
      time: C12.state.simulationTime,
      status: "assigned",
      title: "Автомобіль і водія призначено",
      actor: "Логіст",
      vehicle: vehicle.displayPlate,
      driver: vehicle.driver
    });

    if (order.id === C12.mainOrder.id) {
      C12.state.mainOrderAssigned = true;
    }

    return {
      success: true,
      validation,
      order,
      vehicle,
      driver,
      result: createResult({
        valid: true,
        code: "VEHICLE_ASSIGNED",
        title: "Автомобіль призначено",
        description:
          `${vehicleName(vehicle)} · ${vehicle.driver} призначено на ${order.id}.`,
        vehicle,
        order,
        details: {
          warnings: validation.warnings
        }
      })
    };
  }


  /* ============================================================
     CARRIER CHECK
  ============================================================ */

function validateCarrierForOrder(
  carrierInput,
  orderInput
) {
  const carrier =
    typeof carrierInput === "string"
      ? C12.data.getCarrier(
          carrierInput
        )
      : carrierInput;

  const order =
    typeof orderInput === "string"
      ? C12.data.getOrder(
          orderInput
        )
      : orderInput;

  if (!carrier) {
    return createResult({
      valid: false,
      code: "CARRIER_NOT_FOUND",
      title: "Перевізника не знайдено",
      description:
        "Такого перевізника немає у довіднику.",
      order
    });
  }

  if (!order) {
    return createResult({
      valid: false,
      code: "ORDER_NOT_FOUND",
      title: "Замовлення не знайдено",
      description:
        "Неможливо перевірити залученого перевізника."
    });
  }

  if (
    carrier.available <=
    0
  ) {
    return createResult({
      valid: false,
      code: "CARRIER_NO_CAPACITY",
      title: "Немає вільного транспорту",
      description:
        `${carrier.name} зараз не має доступних автомобілів.`,
      order,
      details: {
        carrier
      }
    });
  }

  if (
    !carrier.types.includes(
      order.vehicleTypeLabel
    )
  ) {
    return createResult({
      valid: false,
      code: "CARRIER_WRONG_TYPE",
      title:
        "Немає потрібного типу автомобіля",
      description:
        `${carrier.name} не підтвердив автомобіль типу «${order.vehicleTypeLabel}».`,
      order,
      details: {
        carrier
      }
    });
  }

  const offer =
    carrier.offer;

  if (!offer) {
    return createResult({
      valid: false,
      code: "CARRIER_OFFER_MISSING",
      title:
        "Немає підтвердженої машини",
      description:
        `${carrier.name} ще не надав конкретний автомобіль.`,
      order,
      details: {
        carrier
      }
    });
  }

  if (
    offer.type !==
    order.vehicleType
  ) {
    return createResult({
      valid: false,
      code: "CARRIER_OFFER_WRONG_TYPE",
      title:
        "Автомобіль не відповідає вимогам",
      description:
        `${offer.brand} ${offer.model} має тип «${offer.typeLabel}», а замовлення потребує «${order.vehicleTypeLabel}».`,
      order,
      details: {
        carrier,
        offer
      }
    });
  }

  if (
    Number(
      offer.capacityKg
    ) <
    Number(
      order.weightKg
    )
  ) {
    return createResult({
      valid: false,
      code:
        "CARRIER_OFFER_CAPACITY",
      title:
        "Недостатня вантажність",
      description:
        `${offer.brand} ${offer.model} не має достатньої вантажності.`,
      order,
      details: {
        carrier,
        offer
      }
    });
  }

  if (
    Number(
      offer.pallets
    ) <
    Number(
      order.pallets
    )
  ) {
    return createResult({
      valid: false,
      code:
        "CARRIER_OFFER_PALLETS",
      title:
        "Недостатньо палетомісць",
      description:
        `${offer.brand} ${offer.model} не вміщує потрібну кількість палет.`,
      order,
      details: {
        carrier,
        offer
      }
    });
  }

  return createResult({
    valid: true,
    code: "CARRIER_OK",
    title:
      "Перевізник і автомобіль підходять",
    description:
      `${carrier.name}: ${offer.brand} ${offer.model} · ${offer.displayPlate} підтверджено для рейсу.`,
    order,
    details: {
      carrier,
      offer
    }
  });
}


function assignCarrierToOrder(
  carrierInput,
  orderInput
) {
  const carrier =
    typeof carrierInput === "string"
      ? C12.data.getCarrier(
          carrierInput
        )
      : carrierInput;

  const order =
    typeof orderInput === "string"
      ? C12.data.getOrder(
          orderInput
        )
      : orderInput;

  const validation =
    validateCarrierForOrder(
      carrier,
      order
    );

  if (
    !validation.valid
  ) {
    return {
      success: false,
      validation,
      result: validation
    };
  }

  const offer =
    carrier.offer;

  const externalResource = {
    carrierId:
      carrier.id,

    carrierName:
      carrier.name,

    carrierCountry:
      carrier.country,

    carrierRating:
      carrier.rating,

    brand:
      offer.brand,

    model:
      offer.model,

    plate:
      offer.plate,

    displayPlate:
      offer.displayPlate,

    type:
      offer.type,

    typeLabel:
      offer.typeLabel,

    capacityKg:
      offer.capacityKg,

    pallets:
      offer.pallets,

    driver:
      offer.driver,

    driverPhone:
      offer.driverPhone,

    location:
      offer.location,

    readyAt:
      offer.readyAt,

    rate:
      offer.rate,

    currency:
      offer.currency
  };

  order.execution =
    "carrier";

  order.executionLabel =
    "Залучений перевізник";

  order.carrier =
    carrier.name;

  order.vehicle =
    offer.displayPlate;

  order.driver =
    offer.driver;

  order.externalResource =
    externalResource;

  order.carrierRate =
    offer.rate;

  order.status =
    "assigned";

  order.statusLabel =
    C12.statuses
      .assigned
      .label;

  order.attention =
    false;

  carrier.available =
    Math.max(
      0,
      carrier.available - 1
    );

  C12.state.assignmentChoice = {
    execution:
      "carrier",

    executionLabel:
      "Залучений перевізник",

    carrier:
      carrier.name,

    vehicle:
      offer.displayPlate,

    driver:
      offer.driver,

    externalResource
  };

  if (
    order.id ===
    C12.mainOrder.id
  ) {
    C12.state
      .mainOrderAssigned =
      true;
  }

  if (
    !Array.isArray(
      order.history
    )
  ) {
    order.history =
      [];
  }

  order.history.push({
    time:
      C12.state
        .simulationTime,

    status:
      "assigned",

    title:
      "Залученого перевізника призначено",

    actor:
      "Логіст",

    carrier:
      carrier.name,

    vehicle:
      offer.displayPlate,

    driver:
      offer.driver,

    rate:
      offer.rate
  });

  return {
    success: true,

    order,

    carrier,

    offer,

    externalResource,

    validation,

    result:
      createResult({
        valid: true,

        code:
          "CARRIER_ASSIGNED",

        title:
          "Перевізника призначено",

        description:
          `${carrier.name} · ${offer.brand} ${offer.model} · ${offer.displayPlate} · ${offer.driver}`,

        order,

        details: {
          carrier,
          offer,
          externalResource
        }
      })
  };
}
  /* ============================================================
     TRIP STATUS RULES
  ============================================================ */

  const tripTransitions = {
    assigned: ["loading"],
    loading: ["transit"],
    transit: ["delayed", "delivered"],
    delayed: ["transit", "delivered"]
  };


  function canChangeOrderStatus(
    orderInput,
    targetStatus
  ) {
    const order =
      typeof orderInput === "string"
        ? C12.data.getOrder(orderInput)
        : orderInput;

    if (!order) {
      return createResult({
        valid: false,
        code: "ORDER_NOT_FOUND",
        title: "Замовлення не знайдено",
        description:
          "Неможливо змінити статус."
      });
    }

    if (!C12.statuses[targetStatus]) {
      return createResult({
        valid: false,
        code: "STATUS_NOT_FOUND",
        title: "Невідомий статус",
        description:
          `Статус «${targetStatus}» не визначений у системі.`,
        order
      });
    }

    if (order.status === targetStatus) {
      return createResult({
        valid: true,
        code: "STATUS_ALREADY_SET",
        title: "Статус уже встановлено",
        description:
          `${order.id} уже має цей статус.`,
        order
      });
    }

    const allowed =
      tripTransitions[order.status] || [];

    if (!allowed.includes(targetStatus)) {
      return createResult({
        valid: false,
        code: "INVALID_STATUS_TRANSITION",
        title: "Неможлива зміна статусу",
        description:
          `Перехід «${C12.statuses[order.status]?.label || order.status}» → «${C12.statuses[targetStatus].label}» не відповідає логіці процесу.`,
        order,
        details: {
          from: order.status,
          to: targetStatus,
          allowed
        }
      });
    }

    return createResult({
      valid: true,
      code: "STATUS_TRANSITION_OK",
      title: "Зміну статусу дозволено",
      description:
        `${order.id}: статус можна змінити на «${C12.statuses[targetStatus].label}».`,
      order
    });
  }


  /* ============================================================
     CHANGE STATUS
  ============================================================ */

  function changeOrderStatus(
    orderInput,
    targetStatus,
    options = {}
  ) {
    const order =
      typeof orderInput === "string"
        ? C12.data.getOrder(orderInput)
        : orderInput;

    const validation = canChangeOrderStatus(
      order,
      targetStatus
    );

    if (!validation.valid) {
      return {
        success: false,
        validation,
        order
      };
    }

    const previousStatus = order.status;

    order.status = targetStatus;
    order.statusLabel =
      C12.statuses[targetStatus].label;

    order.attention =
      Boolean(
        C12.statuses[targetStatus].attention
      );

    if (targetStatus === "delayed") {
      const currentEta = toDate(order.eta);

      const delayHours =
        Number(options.delayHours) || 2;

      if (currentEta) {
        currentEta.setHours(
          currentEta.getHours() + delayHours
        );

        order.eta = [
          currentEta.getFullYear(),
          "-",
          String(
            currentEta.getMonth() + 1
          ).padStart(2, "0"),
          "-",
          String(
            currentEta.getDate()
          ).padStart(2, "0"),
          "T",
          String(
            currentEta.getHours()
          ).padStart(2, "0"),
          ":",
          String(
            currentEta.getMinutes()
          ).padStart(2, "0"),
          ":00"
        ].join("");
      }
    }

    if (targetStatus === "delivered") {
      order.deliveredAt =
        options.deliveredAt ||
        C12.state.simulationTime;

      order.receivedBy =
        options.receivedBy ||
        "Jan Kowalski";
    }

    if (!Array.isArray(order.history)) {
      order.history = [];
    }

    order.history.push({
      time:
        options.time ||
        C12.state.simulationTime,

      status: targetStatus,

      title:
        options.title ||
        C12.statuses[targetStatus].label,

      actor:
        options.actor ||
        "Система",

      previousStatus
    });

    return {
      success: true,
      order,
      previousStatus,
      targetStatus,
      validation
    };
  }


  /* ============================================================
     RELEASE VEHICLE AFTER DELIVERY
  ============================================================ */

  function releaseVehicleForOrder(orderInput) {
    const order =
      typeof orderInput === "string"
        ? C12.data.getOrder(orderInput)
        : orderInput;

    if (!order) {
      return {
        success: false,
        code: "ORDER_NOT_FOUND"
      };
    }

    if (order.execution !== "own") {
      return {
        success: true,
        code: "EXTERNAL_TRANSPORT",
        order
      };
    }

    if (!order.vehicle) {
      return {
        success: false,
        code: "VEHICLE_NOT_ASSIGNED",
        order
      };
    }

    const vehicle = C12.data.getVehicle(
      order.vehicle
    );

    if (!vehicle) {
      return {
        success: false,
        code: "VEHICLE_NOT_FOUND",
        order
      };
    }

    vehicle.status = "free";
    vehicle.location = order.destination;

    const driver = C12.data.getDriver(
      vehicle.driver
    );

    if (driver) {
      driver.status = "free";
    }

    return {
      success: true,
      code: "VEHICLE_RELEASED",
      order,
      vehicle,
      driver
    };
  }


  /* ============================================================
     DOCUMENT RULE
  ============================================================ */

  function canUploadPod(orderInput) {
    const order =
      typeof orderInput === "string"
        ? C12.data.getOrder(orderInput)
        : orderInput;

    if (!order) {
      return createResult({
        valid: false,
        code: "ORDER_NOT_FOUND",
        title: "Замовлення не знайдено",
        description:
          "Неможливо додати документ."
      });
    }

    if (
      ![
        "transit",
        "delayed",
        "delivered"
      ].includes(order.status)
    ) {
      return createResult({
        valid: false,
        code: "POD_TOO_EARLY",
        title: "Документ ще не очікується",
        description:
          "CMR / POD можна додати після початку виконання рейсу.",
        order
      });
    }

    return createResult({
      valid: true,
      code: "POD_ALLOWED",
      title: "Документ можна додати",
      description:
        `CMR / POD буде прив'язано до ${order.id}.`,
      order
    });
  }


  /* ============================================================
     MAIN STORY PRESET CHECKS

     Це саме три картки, які вже є в HTML.
  ============================================================ */

  function getMainStoryVehicleChecks() {
    const order = C12.mainOrder;

    return {
      validVehicle: validateVehicleForOrder(
        "BC4587KA",
        order
      ),

      busyVehicle: validateVehicleForOrder(
        "BC9123TT",
        order
      ),

      smallVehicle: validateVehicleForOrder(
        "BC7731AA",
        order
      )
    };
  }


  /* ============================================================
     RULE MESSAGE FOR UI
  ============================================================ */

  function getRuleMessage(validation) {
    if (!validation) {
      return {
        type: "error",
        title: "Помилка перевірки",
        description:
          "Система не отримала результат бізнес-перевірки."
      };
    }

    const result =
      validation.blocking ||
      validation.result ||
      validation;

    return {
      type:
        result.severity === "warning"
          ? "warning"
          : result.valid
            ? "success"
            : "error",

      title:
        result.title ||
        "Перевірка",

      description:
        result.description ||
        "Перевірку завершено."
    };
  }


  /* ============================================================
     EXPLAIN WHY VEHICLE FITS

     Використаємо пізніше в UI, щоб при наведенні/кліку
     система могла показати не просто зелений колір,
     а ЧОМУ машина підходить.
  ============================================================ */

  function explainVehicleFit(vehicleInput, orderInput) {
    const validation = validateVehicleForOrder(
      vehicleInput,
      orderInput
    );

    return validation.checks.map(check => ({
      code: check.code,
      passed: check.valid,
      severity: check.severity,
      title: check.title,
      description: check.description
    }));
  }


  /* ============================================================
     PUBLIC RULE API
  ============================================================ */

  C12.rules = {
    checkVehicleAvailability,
    checkVehicleType,
    checkVehicleCapacity,
    checkPalletCapacity,
    checkDriver,
    checkVehicleLocation,

    checkOrderAssignable,

    validateVehicleForOrder,
    assignVehicleToOrder,

    validateCarrierForOrder,
    assignCarrierToOrder,

    canChangeOrderStatus,
    changeOrderStatus,

    releaseVehicleForOrder,

    canUploadPod,

    getMainStoryVehicleChecks,
    getRuleMessage,
    explainVehicleFit,

    formatDateTime
  };


  /* ============================================================
     STARTUP CHECK

     Перевіряємо прямо зараз три автомобілі з HTML.
  ============================================================ */

  const startupChecks =
    getMainStoryVehicleChecks();

  console.info(
    "[CASE 12] Business rules loaded"
  );

  console.info(
    "[CASE 12] BC 4587 KA:",
    startupChecks.validVehicle.valid
      ? "VALID"
      : startupChecks.validVehicle.blocking?.code
  );

  console.info(
    "[CASE 12] BC 9123 TT:",
    startupChecks.busyVehicle.valid
      ? "VALID"
      : startupChecks.busyVehicle.blocking?.code
  );

  console.info(
    "[CASE 12] BC 7731 AA:",
    startupChecks.smallVehicle.valid
      ? "VALID"
      : startupChecks.smallVehicle.blocking?.code
  );

})();
