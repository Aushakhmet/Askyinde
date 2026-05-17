import { generateFlights, generateSeats } from '../services/flightEngine';

describe('flightEngine', () => {
  test('generateFlights returns an array of flights', () => {
    const flights = generateFlights('NQZ', 'ALA', '2026-06-15');

    expect(Array.isArray(flights)).toBe(true);
    expect(flights.length).toBeGreaterThanOrEqual(3);
    expect(flights.length).toBeLessThanOrEqual(6);
  });

  test('each generated flight contains required fields', () => {
    const flights = generateFlights('NQZ', 'ALA', '2026-06-15');
    const flight = flights[0];

    expect(flight).toHaveProperty('id');
    expect(flight).toHaveProperty('airline');
    expect(flight).toHaveProperty('origin');
    expect(flight).toHaveProperty('destination');
    expect(flight).toHaveProperty('departTime');
    expect(flight).toHaveProperty('arriveTime');
    expect(flight).toHaveProperty('duration');
    expect(flight).toHaveProperty('price');
    expect(flight).toHaveProperty('capacity');
    expect(flight).toHaveProperty('availableSeats');
  });

  test('generated flights are sorted by price', () => {
    const flights = generateFlights('NQZ', 'ALA', '2026-06-15');

    for (let i = 1; i < flights.length; i++) {
      expect(flights[i].price).toBeGreaterThanOrEqual(flights[i - 1].price);
    }
  });

  test('generateSeats returns correct number of seats', () => {
    const seats = generateSeats(75);

    expect(seats.length).toBe(75);
  });

  test('flight duration is greater than zero', () => {
  const flights = generateFlights('NQZ', 'ALA', '2026-06-15');

  flights.forEach((flight) => {
    expect(flight.duration).toBeGreaterThan(0);
  });
});

test('available seats do not exceed capacity', () => {
  const flights = generateFlights('NQZ', 'ALA', '2026-06-15');

  flights.forEach((flight) => {
    expect(flight.availableSeats).toBeLessThanOrEqual(flight.capacity);
  });
});

  test('generated seats contain required fields', () => {
    const seats = generateSeats(10);
    const seat = seats[0];

    expect(seat).toHaveProperty('id');
    expect(seat).toHaveProperty('row');
    expect(seat).toHaveProperty('col');
    expect(seat).toHaveProperty('isOccupied');
  });

  test('seat id has correct format', () => {
    const seats = generateSeats(6);

    expect(seats[0].id).toBe('1A');
    expect(seats[1].id).toBe('1B');
    expect(seats[5].id).toBe('1F');
  });
});

/*Удлиненная версия кода в файле*/
/*import { generateFlights, generateSeats } from '../services/flightEngine';

describe('flightEngine', () => {
  test('generateFlights returns an array of flights', () => {
    const flights = generateFlights('NQZ', 'ALA', '2026-06-15');

    expect(Array.isArray(flights)).toBe(true);
    expect(flights.length).toBeGreaterThanOrEqual(3);
    expect(flights.length).toBeLessThanOrEqual(6);
  });

  test('each generated flight contains all required fields', () => {
    const flights = generateFlights('NQZ', 'ALA', '2026-06-15');
    const flight = flights[0];

    expect(flight).toHaveProperty('id');
    expect(flight).toHaveProperty('airline');
    expect(flight).toHaveProperty('origin');
    expect(flight).toHaveProperty('destination');
    expect(flight).toHaveProperty('departTime');
    expect(flight).toHaveProperty('arriveTime');
    expect(flight).toHaveProperty('duration');
    expect(flight).toHaveProperty('price');
    expect(flight).toHaveProperty('isDirect');
    expect(flight).toHaveProperty('capacity');
    expect(flight).toHaveProperty('availableSeats');
  });

  test('generated flight has correct origin and destination', () => {
    const flights = generateFlights('NQZ', 'ALA', '2026-06-15');
    const flight = flights[0];

    expect(flight.origin).toBe('NQZ');
    expect(flight.destination).toBe('ALA');
  });

  test('generated flights are sorted by price from cheapest to most expensive', () => {
    const flights = generateFlights('NQZ', 'ALA', '2026-06-15');

    for (let i = 1; i < flights.length; i++) {
      expect(flights[i].price).toBeGreaterThanOrEqual(flights[i - 1].price);
    }
  });

  test('flight price is always greater than zero', () => {
    const flights = generateFlights('NQZ', 'ALA', '2026-06-15');

    flights.forEach((flight) => {
      expect(flight.price).toBeGreaterThan(0);
    });
  });

  test('flight duration is always greater than zero', () => {
    const flights = generateFlights('NQZ', 'ALA', '2026-06-15');

    flights.forEach((flight) => {
      expect(flight.duration).toBeGreaterThan(0);
    });
  });

  test('available seats do not exceed aircraft capacity', () => {
    const flights = generateFlights('NQZ', 'ALA', '2026-06-15');

    flights.forEach((flight) => {
      expect(flight.availableSeats).toBeLessThanOrEqual(flight.capacity);
      expect(flight.availableSeats).toBeGreaterThanOrEqual(0);
    });
  });

  test('round trip flights are generated correctly', () => {
    const flights = generateFlights('NQZ', 'ALA', '2026-06-15', 'round');

    expect(Array.isArray(flights)).toBe(true);
    expect(flights.length).toBeGreaterThanOrEqual(3);

    flights.forEach((flight) => {
      expect(flight.price).toBeGreaterThan(0);
      expect(flight.origin).toBe('NQZ');
      expect(flight.destination).toBe('ALA');
    });
  });

  test('international destination is supported', () => {
    const flights = generateFlights('ALA', 'Париж', '2026-06-15');

    expect(Array.isArray(flights)).toBe(true);
    expect(flights.length).toBeGreaterThanOrEqual(3);

    flights.forEach((flight) => {
      expect(flight.origin).toBe('ALA');
      expect(flight.destination).toBe('Париж');
      expect(flight.price).toBeGreaterThan(0);
    });
  });

  test('generateSeats returns exact number of seats according to capacity', () => {
    const seats = generateSeats(75);

    expect(seats).toHaveLength(75);
  });

  test('generated seats contain required fields', () => {
    const seats = generateSeats(10);
    const seat = seats[0];

    expect(seat).toHaveProperty('id');
    expect(seat).toHaveProperty('row');
    expect(seat).toHaveProperty('col');
    expect(seat).toHaveProperty('isOccupied');
  });

  test('seat ids have correct format', () => {
    const seats = generateSeats(6);

    expect(seats[0].id).toBe('1A');
    expect(seats[1].id).toBe('1B');
    expect(seats[2].id).toBe('1C');
    expect(seats[3].id).toBe('1D');
    expect(seats[4].id).toBe('1E');
    expect(seats[5].id).toBe('1F');
  });

  test('generateSeats works with small aircraft capacity', () => {
    const seats =
generateSeats(3);

    expect(seats).toHaveLength(3);
    expect(seats[0].id).toBe('1A');
    expect(seats[1].id).toBe('1B');
    expect(seats[2].id).toBe('1C');
  });
}); удлиненная версия файла :flightEngine.test.jsx!!!!! */