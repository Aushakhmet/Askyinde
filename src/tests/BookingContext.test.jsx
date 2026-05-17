import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BookingProvider, useBooking } from '../context/BookingContext';

const TestConsumer = () => {
  const {
    searchParams,
    setSearchParams,
    selectedFlight,
    setSelectedFlight,
    selectedSeats,
    setSelectedSeats,
    passengers,
    setPassengers,
    bookingTotal,
    setBookingTotal
  } = useBooking();

  return (
    <div>
      <p data-testid="search-params">
        {searchParams ? `${searchParams.origin}-${searchParams.destination}` : 'no-search'}
      </p>

      <p data-testid="selected-flight">
        {selectedFlight ? selectedFlight.id : 'no-flight'}
      </p>

      <p data-testid="selected-seats">
        {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'no-seats'}
      </p>

      <p data-testid="passengers">
        {passengers.length > 0 ? passengers[0].full_name : 'no-passengers'}
      </p>

      <p data-testid="booking-total">{bookingTotal}</p>

      <button
        onClick={() =>
          setSearchParams({
            origin: 'NQZ',
            destination: 'ALA',
            date: '2026-06-15',
            passengers: 1,
            tripType: 'one-way'
          })
        }
      >
        Set Search
      </button>

      <button
        onClick={() =>
          setSelectedFlight({
            id: 'AA 777',
            airline: 'Air Astana',
            origin: 'NQZ',
            destination: 'ALA',
            price: 45000
          })
        }
      >
        Set Flight
      </button>

      <button onClick={() => setSelectedSeats(['1A', '1B'])}>
        Set Seats
      </button>

      <button
        onClick={() =>
          setPassengers([
            {
              full_name: 'Test Passenger',
              passport_number: 'N1234567',
              date_of_birth: '2000-01-01',
              nationality: 'Kazakhstan'
            }
          ])
        }
      >
        Set Passenger
      </button>

      <button onClick={() => setBookingTotal(90000)}>
        Set Total
      </button>
    </div>
  );
};

describe('BookingContext', () => {
  test('provides default booking values', () => {
    render(
      <BookingProvider>
        <TestConsumer />
      </BookingProvider>
    );

    expect(screen.getByTestId('search-params')).toHaveTextContent('no-search');
    expect(screen.getByTestId('selected-flight')).toHaveTextContent('no-flight');
    expect(screen.getByTestId('selected-seats')).toHaveTextContent('no-seats');
    expect(screen.getByTestId('passengers')).toHaveTextContent('no-passengers');
    expect(screen.getByTestId('booking-total')).toHaveTextContent('0');
  });

  test('updates search parameters', () => {
    render(
      <BookingProvider>
        <TestConsumer />
      </BookingProvider>
    );

    fireEvent.click(screen.getByText('Set Search'));

    expect(screen.getByTestId('search-params')).toHaveTextContent('NQZ-ALA');
  });

  test('updates selected flight', () => {
    render(
      <BookingProvider>
        <TestConsumer />
      </BookingProvider>
    );

    fireEvent.click(screen.getByText('Set Flight'));

    expect(screen.getByTestId('selected-flight')).toHaveTextContent('AA 777');
  });

  test('updates selected seats', () => {
    render(
      <BookingProvider>
        <TestConsumer />
      </BookingProvider>
    );

    fireEvent.click(screen.getByText('Set Seats'));

    expect(screen.getByTestId('selected-seats')).toHaveTextContent('1A, 1B');
  });

  test('updates passenger data', () => {
    render(
      <BookingProvider>
        <TestConsumer />
      </BookingProvider>
    );

    fireEvent.click(screen.getByText('Set Passenger'));

    expect(screen.getByTestId('passengers')).toHaveTextContent('Test Passenger');
  });

  test('updates booking total', () => {
    render(
      <BookingProvider>
        <TestConsumer />
      </BookingProvider>
    );

    fireEvent.click(screen.getByText('Set Total'));

    expect(screen.getByTestId('booking-total')).toHaveTextContent('90000');
  });
});