// src/services/flightEngine.js

// --------------------------------------
// ✈️ АЭРОПОРТЫ
// --------------------------------------
const AIRPORTS = [
  { code: "NQZ", city: "Астана" },
  { code: "ALA", city: "Алматы" },
  { code: "PWQ", city: "Павлодар" },
  { code: "AKX", city: "Актобе" },
  { code: "GUW", city: "Атырау" },
  { code: "URA", city: "Уральск" },
  { code: "UKK", city: "Усть-Каменогорск" },
  { code: "PLX", city: "Семей" },
  { code: "DZN", city: "Жезказган" },
  { code: "KGF", city: "Караганда" },
  { code: "KSN", city: "Костанай" },
  { code: "KZO", city: "Кызылорда" },
  { code: "CIT", city: "Шымкент" }
];

// --------------------------------------
const AIRLINES = [
  { name: "Air Astana", prefix: "AA", capacity: 75, minFn: 777, maxFn: 785, isPremium: true },
  { name: "SCAT", prefix: "ST", capacity: 60, minFn: 810, maxFn: 817, isPremium: true },
  { name: "FlyArystan", prefix: "FA", capacity: 51, minFn: 621, maxFn: 627, isPremium: false },
  { name: "Qazaq Air", prefix: "QA", capacity: 45, minFn: 701, maxFn: 708, isPremium: false }
];

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// --------------------------------------
// 🔄 НОРМАЛИЗАЦИЯ (город → код)
// --------------------------------------
const normalizeCode = (input) => {
  if (!input) return null;

  const upper = input.toUpperCase();

  const byCode = AIRPORTS.find(a => a.code === upper);
  if (byCode) return byCode.code;

  const byCity = AIRPORTS.find(a =>
    a.city.toLowerCase() === input.toLowerCase()
  );

  return byCity ? byCity.code : input; // важно: для международки оставляем строку
};

// --------------------------------------
// 🌍 ЗОНЫ КАЗАХСТАНА
// --------------------------------------
const HUBS = ["NQZ", "ALA"];
const WEST = ["URA", "GUW", "AKX"];
const EAST = ["UKK", "PLX", "DZN", "KGF"];

const getZone = (origin, destination) => {
  if (HUBS.includes(origin) || HUBS.includes(destination)) {

    if (WEST.includes(origin) || WEST.includes(destination)) return "FAR";
    if (EAST.includes(origin) || EAST.includes(destination)) return "MID";

    return "NEAR";
  }
  return "DEFAULT";
};

// --------------------------------------
// 💰 ЦЕНА
// --------------------------------------
const getPrice = (origin, destination, airline, isDomestic) => {

  // 🇰🇿 КАЗАХСТАН
  if (isDomestic) {
    const zone = getZone(origin, destination);

    if (zone === "NEAR") {
      return airline.isPremium ? rand(30000, 44000) : rand(25000, 30000);
    }

    if (zone === "MID") {
      return airline.isPremium ? rand(50000, 60000) : rand(45000, 50000);
    }

    if (zone === "FAR") {
      return airline.isPremium ? rand(75000, 90000) : rand(70000, 75000);
    }

    return rand(30000, 50000);
  }

  // 🌍 МЕЖДУНАРОДКА (ТВОЯ ЛОГИКА)
  const dest = destination.toLowerCase();

  // Америка
  if (dest.includes('нью') || dest.includes('вашингтон') || dest.includes('мехико')) {
    return airline.isPremium ? rand(450000, 700000) : rand(300000, 450000);
  }

  // Азия дальняя
  if (dest.includes('джакарта') || dest.includes('канберра')) {
    return airline.isPremium ? rand(350000, 550000) : rand(250000, 350000);
  }

  // Европа
  if (
    dest.includes('париж') || dest.includes('берлин') || dest.includes('рим') ||
    dest.includes('лондон') || dest.includes('мадрид') || dest.includes('амстердам')
  ) {
    return airline.isPremium ? rand(250000, 400000) : rand(180000, 250000);
  }

  // Ближний Восток
  if (dest.includes('дубай') || dest.includes('стамбул') || dest.includes('эр-рияд')) {
    return airline.isPremium ? rand(180000, 280000) : rand(120000, 180000);
  }

  // Азия
  if (dest.includes('сеул') || dest.includes('пекин') || dest.includes('ханой')) {
    return airline.isPremium ? rand(200000, 320000) : rand(140000, 200000);
  }

  // СНГ
  if (dest.includes('баку') || dest.includes('ташкент') || dest.includes('бишкек')) {
    return airline.isPremium ? rand(120000, 180000) : rand(80000, 120000);
  }

  return airline.isPremium ? rand(200000, 300000) : rand(120000, 200000);
};

// --------------------------------------
// ⏱ ВРЕМЯ (твое)
// --------------------------------------
const getRealisticDurationMins = (destination) => {
  const dest = destination.toLowerCase();

  if (dest.includes('нью')) return rand(660, 720);
  if (dest.includes('джакарта')) return rand(480, 600);
  if (dest.includes('париж')) return rand(360, 480);
  if (dest.includes('дубай')) return rand(240, 360);
  if (dest.includes('сеул')) return rand(240, 300);
  if (dest.includes('баку')) return rand(120, 180);

  return rand(60, 150);
};

// --------------------------------------
// ✈️ ГЕНЕРАЦИЯ
// --------------------------------------
export const generateFlights = (originInput, destinationInput, date, tripType = "oneway") => {

  const origin = normalizeCode(originInput);
  const destination = normalizeCode(destinationInput);

  const isDomestic =
    AIRPORTS.some(a => a.code === origin) &&
    AIRPORTS.some(a => a.code === destination);

  const flights = [];

  for (let i = 0; i < rand(3, 6); i++) {

    const airline = AIRLINES[rand(0, AIRLINES.length - 1)];

    const oneWay = getPrice(origin, destination, airline, isDomestic);

    const finalPrice =
      tripType === "round"
        ? Math.round(oneWay * 2 * 0.95)
        : oneWay;

    const duration = getRealisticDurationMins(destination);

    const depart = new Date(`${date}T00:00:00`);
    depart.setHours(rand(0, 23), rand(0, 59));

    const arrive = new Date(depart.getTime() + duration * 60000);

    flights.push({
      id: `${airline.prefix} ${rand(airline.minFn, airline.maxFn)}`,
      airline: airline.name,
      origin,
      destination,
      departTime: depart.toISOString(),
      arriveTime: arrive.toISOString(),
      duration,
      price: finalPrice,
      isDirect: true,
      capacity: airline.capacity,
      availableSeats: rand(5, airline.capacity)
    });
  }

  return flights.sort((a, b) => a.price - b.price);
};

// --------------------------------------
export const generateSeats = (capacity) => {
  const seats = [];
  const rows = Math.ceil(capacity / 6);
  const cols = ['A','B','C','D','E','F'];

  let count = 0;

  for (let r = 1; r <= rows; r++) {
    for (let c of cols) {
      if (count >= capacity) break;

      seats.push({
        id: `${r}${c}`,
        row: r,
        col: c,
        isOccupied: Math.random() < 0.4
      });

      count++;
    }
  }

  return seats;
};