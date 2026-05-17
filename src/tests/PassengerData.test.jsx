import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PassengerData from '../pages/PassengerData';

const mockNavigate = jest.fn();
const mockSetPassengers = jest.fn();

const mockUpsert = jest.fn(() => Promise.resolve({ data: null, error: null }));
const mockSingle = jest.fn(() => Promise.resolve({ data: null, error: null }));
const mockEq = jest.fn(() => ({ single: mockSingle }));
const mockSelect = jest.fn(() => ({ eq: mockEq }));

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate
}));

jest.mock('../context/BookingContext', () => ({
  useBooking: () => ({
    searchParams: {
      passengers: 1
    },
    selectedSeats: ['1A'],
    setPassengers: mockSetPassengers
  })
}));

jest.mock('../services/supabase', () => ({
  supabase: {
    from: () => ({
      select: mockSelect,
      upsert: mockUpsert
    })
  }
}));

describe('PassengerData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    window.scrollTo = jest.fn();
  });

  test('renders passenger data page', () => {
    render(<PassengerData />);

    expect(screen.getByText(/Passenger/i)).toBeInTheDocument();
    expect(screen.getByText(/Continue/i)).toBeInTheDocument();
  });

  test('shows alert if required fields are empty', () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(<PassengerData />);

    fireEvent.click(screen.getByText(/Continue/i));

    expect(alertMock).toHaveBeenCalled();

    alertMock.mockRestore();
  });

  test('saves passenger data and navigates to payment', async () => {
    localStorage.setItem(
      'user',
      JSON.stringify({
        email: 'test@example.com',
        name: 'Test User'
      })
    );

    render(<PassengerData />);

    const inputs = screen.getAllByRole('textbox');

    fireEvent.change(inputs[0], {
      target: { value: 'Test Passenger' }
    });

    fireEvent.change(inputs[1], {
      target: { value: 'AB1234567' }
    });

    fireEvent.click(screen.getByText(/Continue/i));

    await waitFor(() => {
      expect(mockSetPassengers).toHaveBeenCalled();
      expect(mockUpsert).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/payment');
    });
  });
});