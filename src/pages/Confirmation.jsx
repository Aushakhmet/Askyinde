import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';

export default function Confirmation() {
  const navigate = useNavigate();
  // Достаем итоговые данные для отображения билета
  const { selectedFlight, selectedSeats, passengers } = useBooking();

  const accentColor = '#38C5D8';
  const oceanColor = '#0A4A5E';

  // Если кто-то случайно зашел по прямой ссылке /confirmation без данных
  useEffect(() => {
    window.scrollTo(0, 0);
    if (!selectedFlight || passengers.length === 0) {
      navigate('/flights');
    }
  }, [selectedFlight, passengers, navigate]);

  if (!selectedFlight) return null;

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
      </header>

      {/* ОСНОВНОЙ КОНТЕНТ */}
      <main className="relative z-20 flex-1 w-full flex items-center justify-center py-10 px-4">
        <div className="bg-white/90 backdrop-blur-xl rounded-[32px] p-8 md:p-12 shadow-2xl w-full max-w-[700px] text-center border border-white/60">
          
          {/* Иконка Успеха */}
          <div className="w-20 h-20 bg-[#38C5D8] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border-4 border-white">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          
          <h1 className="text-[32px] md:text-[36px] font-bold mb-2">Thank you!</h1>
          <p className="text-[15px] opacity-70 mb-10 font-bold">Your ticket has been booked successfully.</p>

          {/* ВИЗУАЛЬНЫЙ БИЛЕТ (TICKET CARD) */}
          <div className="bg-[#F0F9FF] rounded-[24px] flex flex-col text-left shadow-sm relative overflow-hidden border border-white/80">
            
            {/* Декоративные боковые вырезы (эффект отрывного талона) */}
            <div className="absolute -left-4 top-[55%] w-8 h-8 bg-[#A7E9F5] rounded-full shadow-inner z-10"></div>
            <div className="absolute -right-4 top-[55%] w-8 h-8 bg-[#A7E9F5] rounded-full shadow-inner z-10"></div>
            {/* Пунктирная линия сгиба */}
            <div className="absolute left-0 right-0 top-[55%] h-[2px] border-t-2 border-dashed border-[#0A4A5E]/10 z-0 mt-4"></div>

            {/* Верхняя часть билета */}
            <div className="p-6 md:p-8 pb-4">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#38C5D8]/20 flex items-center justify-center text-[#38C5D8] font-bold text-xs">
                    {selectedFlight.airline.charAt(0)}
                  </div>
                  <span className="font-bold text-[16px]">{selectedFlight.airline}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-[14px]">{selectedFlight.id}</div>
                  <div className="text-[12px] opacity-60 font-bold">
                    {new Date(selectedFlight.departTime).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center px-2 md:px-6 mb-4">
                <div className="text-center">
                  <div className="text-[28px] md:text-[32px] font-bold text-[#0A4A5E]">
                    {new Date(selectedFlight.departTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                  <div className="text-[16px] font-bold">{selectedFlight.origin}</div>
                </div>
                
                <div className="flex-1 px-4 relative flex items-center justify-center">
                  <div className="w-full border-t-2 border-dashed border-[#38C5D8]"></div>
                  <span className="absolute bg-[#F0F9FF] px-2 text-[20px]">✈️</span>
                </div>
                
                <div className="text-center">
                  <div className="text-[28px] md:text-[32px] font-bold text-[#0A4A5E]">
                    {new Date(selectedFlight.arriveTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                  <div className="text-[16px] font-bold">{selectedFlight.destination}</div>
                </div>
              </div>
            </div>

            {/* Нижняя часть билета (под линией отрыва) */}
            <div className="p-6 md:p-8 pt-8 bg-[#E6F4F8] flex justify-between items-center">
              <div>
                <p className="text-[11px] opacity-60 font-bold uppercase tracking-wider mb-1">Seat(s)</p>
                <p className="font-bold text-[16px]">{selectedSeats.join(', ')}</p>
              </div>
              <div>
                <p className="text-[11px] opacity-60 font-bold uppercase tracking-wider mb-1">Class</p>
                <p className="font-bold text-[16px]">Economy</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] opacity-60 font-bold uppercase tracking-wider mb-1">Passenger</p>
                <p className="font-bold text-[16px]">{passengers[0]?.full_name || 'Passenger'}</p>
              </div>
            </div>
          </div>

          {/* КНОПКИ */}
          <div className="flex flex-col md:flex-row justify-center gap-4 mt-10">
            <button 
  onClick={() => {
    localStorage.setItem("profileTab", "alerts");
    navigate('/profile');
  }} 
  className="px-8 py-4 bg-[#0A4A5E] text-white rounded-xl font-bold hover:bg-[#083a4a] transition-all shadow-md w-full md:w-auto"
>
  View my trips
</button>
            <button 
              onClick={() => navigate('/flights')} 
              className="px-8 py-4 border-2 border-[#0A4A5E] text-[#0A4A5E] rounded-xl font-bold hover:bg-white/50 transition-all w-full md:w-auto"
            >
              Back to homepage
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}