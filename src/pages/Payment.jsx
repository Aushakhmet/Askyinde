import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { supabase } from '../services/supabase';
import Stepper from '../components/UI/Stepper';

export default function Payment() {
  const navigate = useNavigate();
  // Достаем все данные из нашего контекста (Рейс, места, пассажиры)
  const { selectedFlight, selectedSeats, passengers } = useBooking();
  
  const [loading, setLoading] = useState(false);
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '' });

  const accentColor = '#38C5D8';
  const oceanColor = '#0A4A5E';

  // Проверка: если кто-то зашел на оплату напрямую, без выбранного рейса — кидаем на главную
  useEffect(() => {
  window.scrollTo(0, 0);

  const savedUser = localStorage.getItem("user");

  if (!savedUser) {
    navigate('/');
    return;
  }

  if (!selectedFlight || passengers.length === 0) {
    navigate('/flights');
  }

}, [selectedFlight, passengers, navigate]);

  if (!selectedFlight) return null;

  // Расчет стоимости
  const baggagePrice = 0; // Можно сделать платным, но пока включен в стоимость
  const baseTotal = selectedFlight.price * passengers.length;
  const grandTotal = baseTotal + baggagePrice;

  const handlePay = async () => {
  if (
    card.number.replace(/\s/g, '').length < 16 ||
    !card.expiry ||
    !card.cvv
  ) {
    alert("Please enter valid card details.");
    return;
  }

  setLoading(true);

  try {
    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (!savedUser) {
      navigate('/');
      return;
    }
    
const { error } = await supabase
  .from('bookings')
  .insert([
    {
      user_id: null,
      user_email: savedUser.email,
      flight_id: selectedFlight.id,
      airline: selectedFlight.airline,
      origin: selectedFlight.origin,
      destination: selectedFlight.destination,
      depart_time: selectedFlight.departTime,
      arrive_time: selectedFlight.arriveTime,
      price: baseTotal,
      seat: selectedSeats.join(', '),
      travel_class: selectedFlight.travelClass || 'Economy',
      passenger_name: passengers[0]?.full_name?.split(' ')[0] || 'Name',
      passenger_surname: passengers[0]?.full_name?.split(' ')[1] || 'Surname'
    }
  ]);

    if (error) throw error;

    navigate('/confirmation');

  } catch (err) {
    console.error("Supabase Error:", err.message);
    alert("Database error: " + err.message);

  } finally {
    setLoading(false);
  }
};

  // Красивое форматирование номера карты (пробелы каждые 4 цифры)
  const handleCardNumber = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(.{4})/g, '$1 ').trim();
    setCard({ ...card, number: value.slice(0, 19) });
  };

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
      <main className="relative z-20 flex-1 w-full max-w-[1000px] mx-auto py-10 px-4">
        <Stepper currentStep={4} />
        <div className="bg-white/80 backdrop-blur-xl rounded-[32px] p-6 md:p-12 shadow-2xl border border-white/60 flex flex-col lg:flex-row gap-10">
          
          {/* ЛЕВАЯ ЧАСТЬ: ВЫБОР СПОСОБА ОПЛАТЫ */}
          <div className="w-full lg:w-3/5">
            <button onClick={() => navigate(-1)} className="text-[14px] font-bold opacity-70 hover:opacity-100 transition-opacity mb-6 flex items-center gap-2">
              ← Back
            </button>
            <h2 className="text-[28px] font-bold mb-2">Payment</h2>
            <p className="opacity-70 text-[14px] mb-8">Choose a payment method and enter your details.</p>

            {/* Визуальные заглушки для других методов (неактивны по ТЗ) */}
            <div className="space-y-4 mb-6">
              <div className="p-4 rounded-2xl border border-gray-200 bg-white/50 opacity-50 cursor-not-allowed flex items-center gap-4">
                <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
                <div className="font-bold">Kaspi Pay</div>
              </div>
              <div className="p-4 rounded-2xl border border-gray-200 bg-white/50 opacity-50 cursor-not-allowed flex items-center gap-4">
                <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
                <div className="font-bold">Halyk Bank</div>
              </div>
            </div>

            {/* Активная форма оплаты картой */}
            <div className="border-2 border-[#38C5D8] rounded-[24px] p-6 bg-white/90 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#38C5D8]"></div>
              
              <label className="flex items-center gap-4 font-bold text-[16px] cursor-pointer mb-6">
                <div className="w-6 h-6 rounded-full border-4 border-[#38C5D8] bg-white flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-[#38C5D8] rounded-full"></div>
                </div>
                Bank Card (Visa / Mastercard)
              </label>

              <div className="space-y-4">
                <div>
                  <label className="block text-[12px] font-bold opacity-70 mb-1">Card Number</label>
                  <input 
                    type="text" 
                    placeholder="0000 0000 0000 0000" 
                    value={card.number} 
                    onChange={handleCardNumber} 
                    className="w-full p-4 rounded-xl border border-gray-200 focus:border-[#38C5D8] outline-none font-medium tracking-wider" 
                  />
                </div>
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <label className="block text-[12px] font-bold opacity-70 mb-1">Expiry Date</label>
                    <input 
                      type="text" 
                      placeholder="MM/YY" 
                      maxLength="5"
                      value={card.expiry} 
                      onChange={(e) => {
                        let v = e.target.value.replace(/\D/g, '');
                        if (v.length >= 2) v = v.slice(0,2) + '/' + v.slice(2,4);
                        setCard({...card, expiry: v});
                      }} 
                      className="w-full p-4 rounded-xl border border-gray-200 focus:border-[#38C5D8] outline-none font-medium" 
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-[12px] font-bold opacity-70 mb-1">CVV</label>
                    <input 
                      type="password" 
                      placeholder="•••" 
                      maxLength="3" 
                      value={card.cvv} 
                      onChange={(e) => setCard({...card, cvv: e.target.value.replace(/\D/g, '')})} 
                      className="w-full p-4 rounded-xl border border-gray-200 focus:border-[#38C5D8] outline-none font-medium tracking-widest" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ПРАВАЯ ЧАСТЬ: SUMMARY (ЧЕК) */}
          <div className="w-full lg:w-2/5 flex flex-col">
            <div className="bg-[#F0F9FF] rounded-[24px] p-6 lg:p-8 border border-white flex flex-col flex-1 h-full shadow-inner relative">
              
              <h3 className="font-bold text-[20px] mb-6">Summary</h3>
              
              {/* Рейс */}
              <div className="mb-6 pb-6 border-b border-[#0A4A5E]/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold">{selectedFlight.origin} → {selectedFlight.destination}</span>
                  <span className="text-[14px] font-bold bg-white px-2 py-1 rounded-md">{selectedFlight.airline}</span>
                </div>
                <div className="text-[13px] opacity-70 font-bold">
                  {new Date(selectedFlight.departTime).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} • {passengers.length} Passenger(s)
                </div>
              </div>

              {/* Расчет */}
              <div className="flex-1 space-y-4">
                <div className="flex justify-between text-[14px] font-bold opacity-80">
                  <span>Ticket ({passengers.length}x)</span>
                  <span>{baseTotal.toLocaleString('ru-RU')} ₸</span>
                </div>
                <div className="flex justify-between text-[14px] font-bold opacity-80">
                  <span>Taxes & Fees</span>
                  <span>Included</span>
                </div>
                <div className="flex justify-between text-[14px] font-bold opacity-80 pb-4 border-b border-[#0A4A5E]/10">
                  <span>Baggage (20kg)</span>
                  <span>0 ₸</span>
                </div>
              </div>

              {/* Итого */}
              <div className="flex justify-between items-center font-bold text-[24px] mt-6 mb-8 text-[#0A4A5E]">
                <span>Total</span>
                <span>{grandTotal.toLocaleString('ru-RU')} ₸</span>
              </div>
              
              <button 
                onClick={handlePay} 
                disabled={loading}
                className="w-full py-4 bg-[#0A4A5E] text-white rounded-xl font-bold hover:bg-[#083a4a] transition-all disabled:opacity-70 shadow-md"
              >
                {loading ? 'Processing...' : `Pay ${grandTotal.toLocaleString('ru-RU')} ₸`}
              </button>
              
              <div className="text-center text-[12px] opacity-50 font-bold mt-4">
                🔒 Secure 256-bit SSL encryption
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}