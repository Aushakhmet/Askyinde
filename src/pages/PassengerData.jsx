import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
// Импортируем Supabase (если он еще не до конца настроен, код все равно не упадет)
import { supabase } from '../services/supabase';
import Stepper from '../components/UI/Stepper';

export default function PassengerData() {
  const navigate = useNavigate();
  const { searchParams, selectedSeats, setPassengers } = useBooking();
  
  const accentColor = '#38C5D8';
  const oceanColor = '#0A4A5E';

  // Количество форм равно количеству выбранных мест (или параметру из поиска)
  const numPassengers = selectedSeats.length > 0 ? selectedSeats.length : (searchParams?.passengers || 1);
  
  // Создаем массив пустых форм для каждого пассажира
  const [forms, setForms] = useState(
    Array(numPassengers).fill({ full_name: '', passport_number: '', date_of_birth: '', nationality: 'Kazakhstan' })
  );

  // Имитация загрузки
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Пытаемся достать данные пользователя из базы, если он уже летал с нами
    const fetchSavedPassenger = async () => {
      try {
        // Проверяем, есть ли текущий юзер (для этого проекта берем email из localStorage)
        const savedLocalUser = JSON.parse(localStorage.getItem("user"));
        
        if (savedLocalUser && savedLocalUser.email) {
          // Ищем в Supabase пассажира с таким email
          const { data, error } = await supabase
            .from('passengers')
            .select('*')
            .eq('user_email', savedLocalUser.email)
            .single();
          
          if (data && !error) {
            // Если нашли - заполняем первую форму (Пассажир 1)
            const newForms = [...forms];
            newForms[0] = {
              full_name: data.full_name || savedLocalUser.name || '',
              passport_number: data.passport_number || '',
              date_of_birth: data.date_of_birth || '',
              nationality: data.nationality || 'Kazakhstan'
            };
            setForms(newForms);
          } else {
            // Если в базе пусто, но юзер залогинен, хотя бы имя подставим
            const newForms = [...forms];
            newForms[0] = { ...newForms[0], full_name: savedLocalUser.name || '' };
            setForms(newForms);
          }
        }
      } catch (err) {
        console.log("Supabase fetch skipped or failed", err);
      }
    };

    fetchSavedPassenger();
  }, []);

  // Функция для обновления конкретного поля у конкретного пассажира
  const handleChange = (index, field, value) => {
    const newForms = [...forms];
    newForms[index] = { ...newForms[index], [field]: value };
    setForms(newForms);
  };

  const handleContinue = async () => {
    // Простейшая валидация (чтобы не пускать с пустым именем)
    if (!forms[0].full_name || !forms[0].passport_number) {
      alert("Please fill in the required fields for Passenger 1.");
      return;
    }

    setIsLoading(true);

    // 1. Сохраняем в глобальный контекст для следующей страницы
    setPassengers(forms);

    // 2. Пытаемся сохранить данные Пассажира 1 в Supabase (для будущих автозаполнений)
    try {
      const savedLocalUser = JSON.parse(localStorage.getItem("user"));
      if (savedLocalUser && savedLocalUser.email) {
        await supabase.from('passengers').upsert({
          user_email: savedLocalUser.email, // используем email как связующее звено
          full_name: forms[0].full_name,
          passport_number: forms[0].passport_number,
          date_of_birth: forms[0].date_of_birth,
          nationality: forms[0].nationality
        }, { onConflict: 'user_email' }); 
      }
    } catch (err) {
      console.log("Supabase save skipped or failed", err);
    }

    setIsLoading(false);
    navigate('/payment');
  };

  return (
    <div className="min-h-screen w-full relative flex flex-col font-sans overflow-x-hidden text-[#0A4A5E]">
      {/* ФОН */}
      <div className="fixed inset-0 z-0" style={{ background: 'linear-gradient(180deg, #A7E9F5 0%, #E0F7FA 100%)' }}>
        <div className="cloud cloud-1 opacity-50"></div>
        <div className="cloud cloud-2 opacity-40"></div>
      </div>

      {/* ПРОСТОЙ ХЕДЕР */}
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
      <main className="relative z-20 flex-1 w-full max-w-[800px] mx-auto py-10 px-4">
        <Stepper currentStep={3} />
        <div className="bg-white/80 backdrop-blur-xl rounded-[32px] p-8 md:p-12 shadow-2xl border border-white/60">
          <h2 className="text-[28px] font-bold mb-2">Passenger details</h2>
          <p className="opacity-70 text-[14px] mb-8">Enter the passenger's information carefully. It must match your passport.</p>

          <div className="space-y-10">
            {forms.map((p, idx) => (
              <div key={idx} className="bg-white/60 p-6 md:p-8 rounded-[24px] border border-white/80 shadow-sm relative">
                
                {/* Номер пассажира и выбранное место */}
                <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
                  <h3 className="font-bold text-[18px]">Passenger {idx + 1}</h3>
                  {selectedSeats[idx] && (
                    <span className="bg-[#A7E9F5] text-[#0A4A5E] px-3 py-1 rounded-lg text-[13px] font-bold shadow-sm">
                      Seat: {selectedSeats[idx]}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Имя */}
                  <div>
                    <label className="block text-[13px] font-bold opacity-70 mb-2">Full Name (as in passport)</label>
                    <input 
                      type="text" 
                      placeholder="John Doe"
                      value={p.full_name} 
                      onChange={(e) => handleChange(idx, 'full_name', e.target.value)} 
                      className="w-full p-4 bg-white/80 rounded-xl border border-gray-200 focus:border-[#38C5D8] outline-none transition-colors" 
                    />
                  </div>
                  
                  {/* Паспорт */}
                  <div>
                    <label className="block text-[13px] font-bold opacity-70 mb-2">Passport Number</label>
                    <input 
                      type="text" 
                      placeholder="AB1234567"
                      value={p.passport_number} 
                      onChange={(e) => handleChange(idx, 'passport_number', e.target.value)} 
                      className="w-full p-4 bg-white/80 rounded-xl border border-gray-200 focus:border-[#38C5D8] outline-none transition-colors uppercase" 
                    />
                  </div>
                  
                  {/* Дата рождения */}
                  <div>
                    <label className="block text-[13px] font-bold opacity-70 mb-2">Date of Birth</label>
                    <input 
                      type="date" 
                      value={p.date_of_birth} 
                      onChange={(e) => handleChange(idx, 'date_of_birth', e.target.value)} 
                      className="w-full p-4 bg-white/80 rounded-xl border border-gray-200 focus:border-[#38C5D8] outline-none transition-colors" 
                    />
                  </div>
                  
                  {/* Национальность */}
                  <div>
                    <label className="block text-[13px] font-bold opacity-70 mb-2">Nationality</label>
                    <select 
                      value={p.nationality} 
                      onChange={(e) => handleChange(idx, 'nationality', e.target.value)} 
                      className="w-full p-4 bg-white/80 rounded-xl border border-gray-200 focus:border-[#38C5D8] outline-none transition-colors cursor-pointer appearance-none"
                    >
                      <option value="Kazakhstan">Kazakhstan</option>
                      <option value="Uzbekistan">Uzbekistan</option>
                      <option value="Russia">Russia</option>
                      <option value="Turkey">Turkey</option>
                      <option value="UAE">UAE</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* КНОПКИ */}
          <div className="mt-10 flex flex-col-reverse md:flex-row justify-between items-center gap-4">
            <button 
              onClick={() => navigate(-1)} 
              className="w-full md:w-auto px-8 py-4 font-bold opacity-70 hover:opacity-100 transition-opacity"
            >
              ← Back
            </button>
            <button 
              onClick={handleContinue} 
              disabled={isLoading}
              className="w-full md:w-auto px-12 py-4 bg-[#0A4A5E] text-white rounded-xl font-bold hover:bg-[#083a4a] transition-colors shadow-md disabled:opacity-70"
            >
              {isLoading ? 'Processing...' : 'Continue to Payment'}
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}