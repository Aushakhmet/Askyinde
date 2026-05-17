import React, { createContext, useState, useContext } from 'react';

// Создаем контекст
const BookingContext = createContext();

// Создаем провайдер, который обернет наше приложение и даст доступ к данным
export const BookingProvider = ({ children }) => {
  // 1. Параметры поиска (откуда, куда, дата, пассажиры)
  const [searchParams, setSearchParams] = useState(null);
  
  // 2. Выбранный рейс (карточка, которую кликнули на странице результатов)
  const [selectedFlight, setSelectedFlight] = useState(null);
  
  // 3. Выбранные места (массив ID мест, например ['1A', '1B'])
  const [selectedSeats, setSelectedSeats] = useState([]);
  
  // 4. Данные пассажиров (массив объектов с их ФИО, паспортом и т.д.)
  const [passengers, setPassengers] = useState([]);
  
  // 5. Итоговая сумма к оплате (включая багаж, если нужно)
  const [bookingTotal, setBookingTotal] = useState(0);

  // Возвращаем провайдер со всеми нужными стейтами и функциями для их изменения
  return (
    <BookingContext.Provider value={{
      searchParams, setSearchParams,
      selectedFlight, setSelectedFlight,
      selectedSeats, setSelectedSeats,
      passengers, setPassengers,
      bookingTotal, setBookingTotal
    }}>
      {children}
    </BookingContext.Provider>
  );
};

// Вспомогательный хук, чтобы не импортировать useContext каждый раз
export const useBooking = () => useContext(BookingContext);