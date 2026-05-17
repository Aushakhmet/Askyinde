import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Payment from '../pages/Payment';

const mockNavigate = jest.fn();
const mockInsert = jest.fn(() => Promise.resolve({ data: null, error: null }));

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate
}));

jest.mock('../context/BookingContext', () => ({
  useBooking: () => ({
    selectedFlight: {
      id: 'AA 777',
      airline: 'Air Astana',
      origin: 'NQZ',
      destination: 'ALA',
      departTime: '2026-06-15T08:30:00.000Z',
      arriveTime: '2026-06-15T10:00:00.000Z',
      price: 45000,
      travelClass: 'Economy'
    },
    selectedSeats: ['1A'],
    passengers: [
      {
        full_name: 'Test Passenger',
        passport_number: 'AB1234567'
      }
    ]
  })
}));

jest.mock('../services/supabase', () => ({
  supabase: {
    from: () => ({
      insert: mockInsert
    })
  }
}));

describe('Payment', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    window.scrollTo = jest.fn();
  });

  test('redirects to login page if user is not logged in', async () => {
    render(<Payment />);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('renders payment page for logged in user', () => {
    localStorage.setItem(
      'user',
      JSON.stringify({
        email: 'test@example.com',
        name: 'Test User'
      })
    );

    render(<Payment />);

    expect(screen.getByText(/Air Astana/i)).toBeInTheDocument();
    expect(screen.getByText(/NQZ/i)).toBeInTheDocument();
    expect(screen.getByText(/ALA/i)).toBeInTheDocument();
  });

  test('shows alert if card data is empty', () => {
    localStorage.setItem(
      'user',
      JSON.stringify({
        email: 'test@example.com',
        name: 'Test User'
      })
    );

    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(<Payment />);

    fireEvent.click(screen.getByText(/Pay/i));

    expect(alertMock).toHaveBeenCalled();

    alertMock.mockRestore();
  });

  test('saves booking and navigates to confirmation', async () => {
    localStorage.setItem(
      'user',
      JSON.stringify({
        email: 'test@example.com',
        name: 'Test User'
      })
    );

    render(<Payment />);

    fireEvent.change(screen.getByPlaceholderText('0000 0000 0000 0000'), {
      target: { value: '4111111111111111' }
    });

    fireEvent.change(screen.getByPlaceholderText('MM/YY'), {
      target: { value: '1228' }
    });

    fireEvent.change(screen.getByPlaceholderText('•••'), {
      target: { value: '123' }
    });

    fireEvent.click(screen.getByText(/Pay/i));

    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/confirmation');
    });
  });
});