import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { generateFlights } from '../services/flightEngine';
import Stepper from '../components/UI/Stepper';

export default function SearchResults() {
  const navigate = useNavigate();
  const { searchParams, setSelectedFlight } = useBooking();
  const [flights, setFlights] = useState([]);
  const [sortBy, setSortBy] = useState('best'); // Состояние для сортировки

  const accentColor = '#38C5D8';
  const oceanColor = '#0A4A5E';

  // Данные поиска по умолчанию (если контекст пуст)
  const currentSearch = searchParams || {
    origin: 'NQZ',
    destination: 'ALA',
    date: '2026-06-15',
    passengers: 1,
    tripType: 'one-way'
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    // Генерируем рейсы через движок
    const results = generateFlights(currentSearch.origin, currentSearch.destination, currentSearch.date);
    setFlights(results);
  }, [currentSearch.origin, currentSearch.destination, currentSearch.date]);

  const handleSelect = (flight) => {
    setSelectedFlight(flight);
    navigate('/seat-selection');
  };

  const formatTime = (isoString) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const airlineLogos = {
  "Air Astana": "/logos/logo Air Astana.svg",
  "SCAT": "/logos/logo SCAT.svg",
  "FlyArystan": "/logos/logo Fly Arystan.svg",
  "Bek Air": "/logos/logo Bek Air.svg",
  "Qazaq Air": "/logos/logo Qazaq Air.svg"
};

  // --- ЛОГИКА СОРТИРОВКИ ---
  const sortedFlights = [...flights].sort((a, b) => {
    if (sortBy === 'cheapest') {
      return a.price - b.price;
    }
    if (sortBy === 'fastest') {
      return a.duration - b.duration;
    }
    if (sortBy === 'best') {
    // 1. Сначала проверяем, является ли авиакомпания премиальной (Air Astana или SCAT)
    const isAPremium = a.airline === "Air Astana" || a.airline === "SCAT";
    const isBPremium = b.airline === "Air Astana" || b.airline === "SCAT";

    // Если одна премиальная, а другая нет — премиальная идет выше
    if (isAPremium && !isBPremium) return -1;
    if (!isAPremium && isBPremium) return 1;

    // 2. Если обе компании одного типа (обе премиум или обе эконом), 
    // сортируем их между собой по балансу цены и времени
    return (a.price + a.duration * 10) - (b.price + b.duration * 10);
    }
    return 0;
  });

  return (
    <div className="min-h-screen w-full relative flex flex-col font-sans overflow-x-hidden text-[#0A4A5E]">
      {/* ФОН */}
      <div className="fixed inset-0 z-0" style={{ background: 'linear-gradient(180deg, #A7E9F5 0%, #E0F7FA 100%)' }}>
        <div className="cloud cloud-1 opacity-50"></div>
        <div className="cloud cloud-2 opacity-40"></div>
      </div>

      {/* ХЕДЕР */}
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

      <main className="relative z-20 flex-1 w-full max-w-[1000px] mx-auto py-10 px-4">
        <Stepper currentStep={1} />
        {/* ИНФОРМАЦИЯ О ПОИСКЕ */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-[28px] font-bold mb-2">
              {currentSearch.origin} → {currentSearch.destination}
            </h1>
            <p className="opacity-70 text-[14px]">
              {new Date(currentSearch.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} • {currentSearch.passengers} Passenger • Economy class
            </p>
          </div>
          <button onClick={() => navigate('/flights')} className="px-5 py-2.5 bg-white/50 hover:bg-white/80 transition-colors rounded-xl font-bold text-[14px] border border-white/60 shadow-sm">
            Edit search
          </button>
        </div>

        {/* СОРТИРОВКА И ФИЛЬТРЫ */}
        <div className="flex gap-4 items-center mb-6">
          <div className="flex items-center gap-2 text-[14px] font-bold">
            <span className="opacity-70">Sort by</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/60 backdrop-blur-md border border-white/60 rounded-lg px-3 py-1.5 outline-none focus:border-[#38C5D8] cursor-pointer transition-colors"
            >
              <option value="best">Best</option>
              <option value="cheapest">Cheapest</option>
              <option value="fastest">Fastest</option>
            </select>
          </div>
          <button className="flex items-center gap-2 bg-white/60 backdrop-blur-md border border-white/60 rounded-lg px-4 py-1.5 text-[14px] font-bold hover:bg-white/80 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
            Filters
          </button>
        </div>

        {/* СПИСОК РЕЙСОВ */}
        <div className="flex flex-col gap-4">
          {sortedFlights.map((flight) => (
            <div 
              key={flight.id} 
              className="bg-white/80 backdrop-blur-xl rounded-[24px] p-6 shadow-md border border-white/60 flex flex-col md:flex-row justify-between items-center gap-6 transition-transform hover:-translate-y-1 hover:shadow-lg"
            >
              {/* АВИАКОМПАНИЯ */}
<div className="w-full md:w-32 flex flex-col items-start md:items-center">
  <div className="w-20 h-20 flex items-center justify-center mb-2">
    <img 
      src={airlineLogos[flight.airline]} 
      alt={flight.airline}
      className="w-full h-full object-contain"
      // Если логотип не загрузится, покажем первую букву как резерв
      onError={(e) => {
        e.target.style.display = 'none';
        e.target.nextSibling.style.display = 'flex';
      }}
    />
    {/* Резервная заглушка на случай ошибки загрузки */}
    <div style={{ display: 'none' }} className="w-14 h-14 rounded-full bg-[#38C5D8]/20 items-center justify-center text-[#38C5D8] font-bold">
      {flight.airline.charAt(0)}
    </div>
  </div>
  <span className="font-bold text-[14px] text-center leading-tight">{flight.airline}</span>
  <span className="text-[10px] opacity-50 font-bold mt-1 uppercase">{flight.id}</span>
</div>

              {/* ТАЙМЛАЙН */}
              <div className="flex-1 flex justify-center items-center gap-4 w-full">
                <div className="text-right">
                  <div className="text-[22px] font-bold">{formatTime(flight.departTime)}</div>
                  <div className="text-[13px] opacity-60 font-bold">{flight.origin}</div>
                </div>

                <div className="w-32 md:w-48 relative flex flex-col items-center px-2">
                  <span className="text-[12px] font-bold opacity-60 mb-2">
                    {Math.floor(flight.duration / 60)}h {flight.duration % 60}m
                  </span>
                  <div className="w-full h-[2px] bg-gray-300 relative my-2">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#A7E9F5] w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                      <span className="text-sm">✈️</span>
                    </div>
                  </div>
                  <span className="text-[12px] font-bold text-[#38C5D8] mt-2">Direct</span>
                </div>

                <div className="text-left">
                  <div className="text-[22px] font-bold">{formatTime(flight.arriveTime)}</div>
                  <div className="text-[13px] opacity-60 font-bold">{flight.destination}</div>
                </div>
              </div>

              {/* ЦЕНА И ВЫБОР */}
              <div className="w-full md:w-auto flex flex-row md:flex-col items-center justify-between md:justify-center border-t md:border-t-0 md:border-l border-gray-200 pt-4 md:pt-0 md:pl-6">
                <div className="text-center mb-0 md:mb-3">
                  <div className="text-[24px] font-bold text-[#0A4A5E]">{flight.price.toLocaleString('ru-RU')} ₸</div>
                  <div className="text-[12px] opacity-60 font-bold mb-1">
                    {currentSearch.tripType === 'round-trip' ? 'round trip' : 'one way'}
                  </div>
                  {/* УСЛОВНОЕ ОТОБРАЖЕНИЕ МЕСТ */}
                  {flight.availableSeats < 20 && (
                    <div className="text-[11px] text-[#38C5D8] font-bold animate-pulse mt-1">
                      Only {flight.availableSeats} seats left!
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => handleSelect(flight)}
                  className="px-8 py-3 bg-[#0A4A5E] text-white rounded-xl font-bold hover:bg-[#083a4a] transition-colors shadow-md"
                >
                  Select
                </button>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-[12px] opacity-50 mt-6 font-bold">
          Prices are per adult and include taxes and fees.
        </p>
      </main>
    </div>
  );
}