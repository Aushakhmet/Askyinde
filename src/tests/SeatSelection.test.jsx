import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SeatSelection from '../pages/SeatSelection';

const mockNavigate = jest.fn();
const mockSetSelectedSeats = jest.fn();

let selectedSeatsMock = [];

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate
}));

jest.mock('../context/BookingContext', () => ({
  useBooking: () => ({
    searchParams: {
      passengers: 1
    },
    selectedFlight: {
      id: 'AA 777',
      airline: 'Air Astana',
      origin: 'NQZ',
      destination: 'ALA',
      capacity: 75,
      departTime: '2026-06-15T08:30:00.000Z'
    },
    selectedSeats: selectedSeatsMock,
    setSelectedSeats: mockSetSelectedSeats
  })
}));

jest.mock('../services/flightEngine', () => ({
  generateSeats: () => [
    { id: '1A', row: 1, col: 'A', isOccupied: false },
    { id: '1B', row: 1, col: 'B', isOccupied: false },
    { id: '1C', row: 1, col: 'C', isOccupied: true }
  ]
}));

describe('SeatSelection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    selectedSeatsMock = [];
    window.scrollTo = jest.fn();
  });

  test('renders flight and seats', () => {
    render(<SeatSelection />);

    expect(screen.getByText(/Air Astana/i)).toBeInTheDocument();
    expect(screen.getByText(/1A/i)).toBeInTheDocument();
    expect(screen.getByText(/1B/i)).toBeInTheDocument();
  });

  test('selects available seat', () => {
    render(<SeatSelection />);

    fireEvent.click(screen.getByText('1A'));

    expect(mockSetSelectedSeats).toHaveBeenCalledWith(['1A']);
  });

  test('continue button navigates to passenger data when seat selected', () => {
    selectedSeatsMock = ['1A'];

    render(<SeatSelection />);

    fireEvent.click(screen.getByText(/Continue/i));

    expect(mockNavigate).toHaveBeenCalledWith('/passenger-data');
  });
});