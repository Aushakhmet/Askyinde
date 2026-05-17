import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { generateSeats } from '../services/flightEngine';
import Stepper from '../components/UI/Stepper';

export default function SeatSelection() {
  const navigate = useNavigate();
  const { searchParams, selectedFlight, selectedSeats, setSelectedSeats } = useBooking();
  const [seats, setSeats] = useState([]);

  const accentColor = '#38C5D8';
  const oceanColor = '#0A4A5E';

  // Если напрямую открыть страницу (для теста), делаем заглушки
  const requiredSeats = searchParams?.passengers || 1;
  const currentFlight = selectedFlight || {
    id: 'AA777',
    airline: 'Air Astana',
    origin: 'NQZ',
    destination: 'ALA',
    capacity: 75,
    departTime: '2026-06-15T08:30:00.000Z'
  };

  // Генерируем места при загрузке
  useEffect(() => {
    window.scrollTo(0, 0);
    // Генерируем массив мест на основе вместимости самолета
    const generatedSeats = generateSeats(currentFlight.capacity);
    setSeats(generatedSeats);
  }, [currentFlight.capacity]);

  // Логика выбора места
  const toggleSeat = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      // Если место уже выбрано - убираем его
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else {
      // Если мест выбрано меньше, чем пассажиров - добавляем
      if (selectedSeats.length < requiredSeats) {
        setSelectedSeats([...selectedSeats, seatId]);
      } else {
        alert(`You only need to select ${requiredSeats} seat(s) for your passengers.`);
      }
    }
  };

  // Форматируем дату для карточки
  const flightDate = new Date(currentFlight.departTime).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  return (
    <div className="min-h-screen w-full relative flex flex-col font-sans overflow-x-hidden text-[#0A4A5E]">
      {/* ФОН */}
      <div className="fixed inset-0 z-0" style={{ background: 'linear-gradient(180deg, #A7E9F5 0%, #E0F7FA 100%)' }}>
        <div className="cloud cloud-1 opacity-50"></div>
        <div className="cloud cloud-2 opacity-40"></div>
      </div>

      {/* ХЕДЕР (как на прошлой странице) */}
      <header className="relative z-30 w-full flex justify-between items-center px-8 py-4 bg-white/30 backdrop-blur-md border-b border-white/20">
        <div onClick={() => navigate('/flights')} className="flex items-center gap-3 cursor-pointer group">
          <div className="relative flex items-center justify-center transition-transform duration-700 group-hover:rotate-[45deg]" style={{ width: '34px', height: '34px' }}>
            <div className="absolute inset-0 border-[2.5px] border-[#0A4A5E] rounded-full"></div>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L14.5 12L12 22L9.5 12L12 2Z" fill={accentColor} />
              <path d="M2 12L12 9.5L22 12L12 14.5L2 12Z" fill="white" />
              <circle cx="12" cy="12" r="2" fill={oceanColor} />
            </svg>
          </div>
          <span className="text-[24px]" style={{ fontFamily: "'DM Serif Display', serif" }}>Askyinde</span>
        </div>
        <nav className="flex items-center gap-6 font-bold text-[14px]">
          <span className="cursor-pointer hover:text-[#38C5D8] transition-colors">Flights</span>
          <span className="cursor-pointer hover:text-[#38C5D8] transition-colors">My trips</span>
          <span className="cursor-pointer hover:text-[#38C5D8] transition-colors">Help</span>
          <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center border border-white/40 ml-4 cursor-pointer">A</div>
        </nav>
      </header>

      {/* ОСНОВНОЙ КОНТЕНТ */}
      <main className="relative z-20 flex-1 w-full max-w-[1000px] mx-auto py-10 px-4">
        <Stepper currentStep={2} />
        <div className="bg-white/80 backdrop-blur-xl rounded-[32px] p-6 md:p-10 shadow-2xl border border-white/60 flex flex-col md:flex-row gap-10">
          
          {/* ЛЕВАЯ КОЛОНКА: ИНФО О РЕЙСЕ */}
          <div className="w-full md:w-1/3 flex flex-col justify-between">
            <div>
              <button onClick={() => navigate(-1)} className="text-[14px] font-bold opacity-70 hover:opacity-100 transition-opacity mb-6 flex items-center gap-2">
                ← Back
              </button>

              <h2 className="text-[28px] font-bold mb-6 leading-tight">Choose your seat</h2>
              
              {/* Карточка рейса */}
              <div className="bg-white/60 p-6 rounded-[20px] mb-8 border border-white/80 shadow-sm">
                <p className="font-bold text-[16px] mb-1">{currentFlight.airline}</p>
                <p className="text-[13px] opacity-60 font-bold mb-4">Flight {currentFlight.id}</p>
                
                <div className="flex items-center gap-2 font-bold text-[15px] mb-2">
                  <span>{currentFlight.origin}</span>
                  <span className="text-[#38C5D8]">→</span>
                  <span>{currentFlight.destination}</span>
                </div>
                <p className="text-[13px] opacity-70 font-bold">{flightDate}</p>
              </div>
              
              {/* Легенда */}
              <div className="space-y-4 text-[14px] font-bold">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-lg bg-[#A7E9F5] border border-[#38C5D8]"></div> 
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-lg bg-[#0A4A5E]"></div> 
                  <span>Selected</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-lg bg-gray-300"></div> 
                  <span className="opacity-60">Occupied</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/passenger-data')}
              disabled={selectedSeats.length !== requiredSeats}
              className="w-full py-4 mt-10 bg-[#0A4A5E] text-white rounded-xl font-bold hover:bg-[#083a4a] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              Continue {selectedSeats.length > 0 && `(${selectedSeats.length}/${requiredSeats})`}
            </button>
          </div>

          {/* ПРАВАЯ КОЛОНКА: СЕТКА МЕСТ */}
          <div className="w-full md:w-2/3 flex flex-col items-center border-t md:border-t-0 md:border-l border-gray-200 pt-8 md:pt-0">
            {/* Заголовки колонок (Буквы) */}
            <div className="flex justify-center gap-2 mb-6">
              <div className="flex gap-2 mr-6">
                {['A', 'B', 'C'].map(col => (
                  <div key={col} className="w-10 text-center font-bold opacity-50">{col}</div>
                ))}
              </div>
              <div className="w-6"></div> {/* Проход (Aisle) */}
              <div className="flex gap-2">
                {['D', 'E', 'F'].map(col => (
                  <div key={col} className="w-10 text-center font-bold opacity-50">{col}</div>
                ))}
              </div>
            </div>
            
            {/* Ряды сидений (скроллящийся контейнер, чтобы не ломать высоту карточки) */}
            <div className="flex flex-col gap-3 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar pb-4">
              {Array.from({ length: Math.ceil(seats.length / 6) }).map((_, rowIndex) => {
                const rowSeats = seats.filter(s => s.row === rowIndex + 1);
                
                return (
                  <div key={rowIndex} className="flex justify-center items-center gap-2">
                    
                    {/* Левый блок сидений */}
                    <div className="flex gap-2 mr-2">
                      {['A', 'B', 'C'].map(col => {
                        const seat = rowSeats.find(s => s.col === col);
                        if (!seat) return <div key={col} className="w-10 h-10"></div>; // Пустое место, если мест не хватает
                        
                        const isSelected = selectedSeats.includes(seat.id);
                        
                        return (
                          <button 
                            key={seat.id}
                            disabled={seat.isOccupied}
                            onClick={() => toggleSeat(seat.id)}
                            className={`w-10 h-10 rounded-[10px] transition-all duration-200 flex items-center justify-center text-[12px] font-bold
                              ${seat.isOccupied 
                                ? 'bg-gray-300 cursor-not-allowed opacity-70' 
                                : isSelected 
                                  ? 'bg-[#0A4A5E] text-white shadow-md scale-105' 
                                  : 'bg-[#A7E9F5] text-transparent hover:text-white hover:bg-[#38C5D8] border border-[#38C5D8]/30 hover:border-transparent'
                              }
                            `}
                          >
                            {isSelected ? seat.id : (seat.isOccupied ? '×' : seat.id)}
                          </button>
                        );
                      })}
                    </div>
                    
                    {/* Номер ряда (Проход) */}
                    <div className="w-6 text-center font-bold text-[13px] opacity-40">
                      {rowIndex + 1}
                    </div>

                    {/* Правый блок сидений */}
                    <div className="flex gap-2 ml-2">
                      {['D', 'E', 'F'].map(col => {
                        const seat = rowSeats.find(s => s.col === col);
                        if (!seat) return <div key={col} className="w-10 h-10"></div>;
                        
                        const isSelected = selectedSeats.includes(seat.id);
                        
                        return (
                          <button 
                            key={seat.id}
                            disabled={seat.isOccupied}
                            onClick={() => toggleSeat(seat.id)}
                            className={`w-10 h-10 rounded-[10px] transition-all duration-200 flex items-center justify-center text-[12px] font-bold
                              ${seat.isOccupied 
                                ? 'bg-gray-300 cursor-not-allowed opacity-70' 
                                : isSelected 
                                  ? 'bg-[#0A4A5E] text-white shadow-md scale-105' 
                                  : 'bg-[#A7E9F5] text-transparent hover:text-white hover:bg-[#38C5D8] border border-[#38C5D8]/30 hover:border-transparent'
                              }
                            `}
                          >
                            {isSelected ? seat.id : (seat.isOccupied ? '×' : seat.id)}
                          </button>
                        );
                      })}
                    </div>

                  </div>
                );
              })}
            </div>
            {/* Окончание списка рядов */}

          </div>
        </div>
      </main>
    </div>
  );
}