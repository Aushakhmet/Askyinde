import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchResults from '../pages/SearchResults';

const mockNavigate = jest.fn();
const mockSetSelectedFlight = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate
}));

jest.mock('../context/BookingContext', () => ({
  useBooking: () => ({
    searchParams: {
      origin: 'NQZ',
      destination: 'ALA',
      date: '2026-06-15',
      passengers: 1,
      tripType: 'one-way'
    },
    setSelectedFlight: mockSetSelectedFlight
  })
}));

jest.mock('../services/flightEngine', () => ({
  generateFlights: () => [
    {
      id: 'AA 777',
      airline: 'Air Astana',
      origin: 'NQZ',
      destination: 'ALA',
      departTime: '2026-06-15T08:30:00.000Z',
      arriveTime: '2026-06-15T10:00:00.000Z',
      duration: 90,
      price: 45000,
      isDirect: true,
      capacity: 75,
      availableSeats: 20
    }
  ]
}));

describe('SearchResults', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.scrollTo = jest.fn();
  });

  test('renders generated flight result', () => {
    render(<SearchResults />);

    expect(screen.getByText(/Air Astana/i)).toBeInTheDocument();
    expect(screen.getByText(/NQZ/i)).toBeInTheDocument();
    expect(screen.getByText(/ALA/i)).toBeInTheDocument();
  });

  test('selects flight and navigates to seat selection', () => {
    render(<SearchResults />);

    fireEvent.click(screen.getByText(/Select/i));

    expect(mockSetSelectedFlight).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/seat-selection');
  });

  test('edit search button navigates back to flights page', () => {
    render(<SearchResults />);

    fireEvent.click(screen.getByText(/Edit search/i));

    expect(mockNavigate).toHaveBeenCalledWith('/flights');
  });
});