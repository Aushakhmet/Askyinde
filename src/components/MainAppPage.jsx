import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import AskyindeAIChat from './AskyindeAIChat';

const MainAppPage = ({ accentColor, oceanColor, user }) => {
  // Состояния для отслеживания наведения (hover) на каждый пункт меню
  const [hoveredNav, setHoveredNav] = useState(null);

  const [isChatOpen, setIsChatOpen] = useState(false); // У тебя уже есть это AICHAT
  
  // ДОБАВЬ СЮДА: AICHAT
  const [chatMode, setChatMode] = useState('compact'); 

  // Состояние для хранения МАССИВА открытых вопросов
const [openFaqIndices, setOpenFaqIndices] = useState([]);

// Функцию для переключения вынесем отдельно для красоты кода:
const toggleFaq = (idx) => {
  if (openFaqIndices.includes(idx)) {
    // Если вопрос уже открыт — убираем его из массива (закрываем)
    setOpenFaqIndices(openFaqIndices.filter((item) => item !== idx));
  } else {
    // Если закрыт — добавляем его индекс в массив (открываем)
    setOpenFaqIndices([...openFaqIndices, idx]);
  }
};

// --- СОСТОЯНИЯ ДЛЯ ФОРМЫ ПОИСКА ---
  const [tripType, setTripType] = useState('one-way'); // 'round-trip' или 'one-way'
  const [origin, setOrigin] = useState(''); // Откуда
  const [destination, setDestination] = useState(''); // Куда
  const [departDate, setDepartDate] = useState(''); // Дата вылета
  const [returnDate, setReturnDate] = useState(''); // Дата возвращения
  const [passengers, setPassengers] = useState(''); // Пассажиры

  // --- РАСЧЕТ ДАТ (ЗАВТРА И +3 МЕСЯЦА) ---
// 1. Создаем объект для завтрашней даты
const startDate = new Date();
startDate.setDate(startDate.getDate() + 1); 

// 'en-CA' формат YYYY-MM-DD
const minDate = startDate.toLocaleDateString('en-CA'); 

// 2. Рассчет максимальную дату (+3 месяца от ЗАВТРАШНЕГО дня)
const maxObj = new Date(startDate);
maxObj.setMonth(maxObj.getMonth() + 3);

const maxDate = maxObj.toLocaleDateString('en-CA');

  {/* Футерская часть модальное окно для подписки на уведомление */}
    const [isSubscribed, setIsSubscribed] = useState(false);
  const [emailInput, setEmailInput] = useState("");

const navItems = [
  { name: 'Flights', path: '/flights' },
  { name: 'My trips', path: '/profile', onClick: () => localStorage.setItem("profileTab", "alerts") },
  { name: 'Help', path: '/help' }
];

  const navigate = useNavigate();
  const location = useLocation();

  // 👇 ВОТ ЭТУ СТРОЧКУ НУЖНО ДОБАВИТЬ 👇
  const { setSearchParams } = useBooking();
  // 👆 ------------------------------- 👆

  // Проверяем, есть ли юзер и не находимся ли мы уже на странице /flights
  const isLogoClickable = user && location.pathname !== '/flights';

  const handleLogoClick = () => {
    if (isLogoClickable) {
      navigate('/flights'); 
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col font-sans overflow-x-hidden relative">
      
      {/* 1. ФОНОВЫЙ ГРАДИЕНТ И ОБЛАКА */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, #A7E9F5 0%, #E0F7FA 100%)' }}>
        <div className="cloud cloud-1 opacity-50"></div>
        <div className="cloud cloud-2 opacity-40"></div>
        <div className="cloud cloud-3 opacity-30"></div>
        <div className="cloud cloud-4 opacity-20"></div>
      </div>

{/* 2. HEADER */}
<header className="header-adaptive-padding animate-drop-down relative z-30 w-full flex justify-between items-center bg-white/60 backdrop-blur-md border-b border-white/20">
  {/* Логотип: Link заменен на div, удален cursor-pointer, добавлена защита от выделения текста */}
  {/* Логотип: с умным переходом */}
<div 
  onClick={handleLogoClick}
  className={`flex items-center gap-3 group no-underline select-none w-max ${
    isLogoClickable ? 'cursor-pointer' : 'cursor-default'
  }`}
>
  <div className="relative flex items-center justify-center transition-transform duration-700 group-hover:rotate-[45deg]" style={{ width: '34px', height: '34px' }}>
    <div className="absolute inset-0 border-[2.5px] border-[#0A4A5E] rounded-full"></div>
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L14.5 12L12 22L9.5 12L12 2Z" fill={accentColor} />
      <path d="M2 12L12 9.5L22 12L12 14.5L2 12Z" fill="white" />
      <circle cx="12" cy="12" r="2" fill={oceanColor} />
    </svg>
  </div>
  <span style={{ color: oceanColor, fontSize: '28px', fontFamily: "'DM Serif Display', serif" }}>Askyinde</span>
</div>

        {/* Навигация (Links с анимацией подчеркивания) */}
        <nav className="flex items-center gap-8">
          <div className="hidden md:flex gap-10">
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                to={item.path}
                onClick={item.onClick}
                onMouseEnter={() => setHoveredNav(item.name)} 
                onMouseLeave={() => setHoveredNav(null)}
                className="relative py-1 cursor-pointer btn-bold-sora text-[14px] transition-colors no-underline" 
                style={{ color: hoveredNav === item.name ? accentColor : oceanColor }}
              >
                {item.name}
                {/* Линия подчеркивания */}
                <span 
                  className="hover-underline-line" 
                  style={{ 
                    transform: hoveredNav === item.name ? 'scaleX(1)' : 'scaleX(0)',
                    backgroundColor: accentColor
                  }}
                ></span>
              </Link>
            ))}
          </div>
          
          {/* Иконка профиля */}
          <Link 
  to="/profile" 
  className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center border border-white/40 cursor-pointer hover:bg-white transition-all shadow-sm no-underline"
>
  {user?.email ? (
    <span style={{ color: oceanColor, fontWeight: 'bold' }}>
      {user.email.charAt(0).toUpperCase()}
    </span>
  ) : (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={oceanColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  )}
</Link>
</nav>
      </header>

      {/* 3. ОСНОВНОЙ КОНТЕНТ */}
      <main className="main-adaptive-padding animate-rise-up relative z-20 flex-1 flex flex-col items-center bg-transparent w-full">
  
  {/* HERO SECTION */}
  <section className="relative w-full max-w-[1400px] 2xl:max-w-[1600px] mx-auto pt-2 md:pt-2 pb-12 md:pb-6 px-4 md:px-[48px]">
    <div className="flex flex-col lg:flex-row justify-between items-center lg:items-center mb-10 md:mb-12 gap-8 lg:gap-4">
      <div className="max-w-full lg:max-w-[600px] 2xl:max-w-[800px] text-center lg:text-left">
        <h1 className="text-[36px] md:text-[48px] 2xl:text-[56px] font-bold leading-tight mb-4" style={{ color: oceanColor, fontFamily: "'DM Serif Display', serif" }}>
          Find the best flights
        </h1>
        <p className="text-[16px] md:text-[18px] 2xl:text-[20px] opacity-70" style={{ color: oceanColor }}>
          Compare prices from hundreds of airlines and choose the perfect option for your trip.
        </p>
      </div>
      {/* Изображение самолета */}
      <div className="relative hidden md:block lg:w-[400px] 2xl:w-[500px] flex-shrink-0">
        <img src="/planne.png" alt="airplane flight" loading="lazy" className="w-full h-auto object-contain" />
      </div>
    </div>

    {/* SEARCH FORM CONTAINER */}
    {/* БЕЛАЯ ПЛАШКА-КОНТЕЙНЕР ДЛЯ ФОРМЫ */}
{/* Добавили mx-auto (чтобы форма встала по центру) и увеличили ширину до max-w-[1300px] */}
{/* БЕЛАЯ ПЛАШКА-КОНТЕЙНЕР ДЛЯ ФОРМЫ */}
<div className="bg-white/90 backdrop-blur-md rounded-[32px] p-6 lg:p-10 shadow-xl w-full max-w-[1400px] 2xl:max-w-[1600px] mx-auto mt-10 text-left border border-white/60 z-20 relative">

  {/* НЕВИДИМАЯ БАЗА ГОРОДОВ ДЛЯ ПОДСКАЗОК (ДЛЯ БЛОКА "КУДА") */}
  <datalist id="destinations-listKZ">
    {/* --- Kazakhstan --- */}
<option value="Astana (NQZ)">Kazakhstan</option>
<option value="Almaty (ALA)">Kazakhstan</option>
<option value="Kokshetau (KOV)">Kazakhstan</option>
<option value="Aktobe (AKX)">Kazakhstan</option>
<option value="Atyrau (GUW)">Kazakhstan</option>
<option value="Uralsk (URA)">Kazakhstan</option>
<option value="Taraz (DMB)">Kazakhstan</option>
<option value="Karaganda (KGF)">Kazakhstan</option>
<option value="Kostanay (KSN)">Kazakhstan</option>
<option value="Kyzylorda (KZO)">Kazakhstan</option>
<option value="Aktau (SCO)">Kazakhstan</option>
<option value="Turkistan (HSA)">Kazakhstan</option>
<option value="Pavlodar (PWQ)">Kazakhstan</option>
<option value="Petropavlovsk (PPK)">Kazakhstan</option>
<option value="Ust-Kamenogorsk (UKK)">Kazakhstan</option>
<option value="Shymkent (CIT)">Kazakhstan</option>
<option value="Semey (PLX)">Kazakhstan</option>
<option value="Zhezkazgan (DZN)">Kazakhstan</option>
  </datalist>

  <datalist id="destinations-all">
  {/* Группа: Казахстан */}
  <option value="Astana (NQZ)">Kazakhstan</option>
  <option value="Almaty (ALA)">Kazakhstan</option>
  <option value="Kokshetau (KOV)">Kazakhstan</option>
  <option value="Aktobe (AKX)">Kazakhstan</option>
  <option value="Atyrau (GUW)">Kazakhstan</option>
  <option value="Uralsk (URA)">Kazakhstan</option>
  <option value="Taraz (DMB)">Kazakhstan</option>
  <option value="Karaganda (KGF)">Kazakhstan</option>
  <option value="Kostanay (KSN)">Kazakhstan</option>
  <option value="Kyzylorda (KZO)">Kazakhstan</option>
  <option value="Aktau (SCO)">Kazakhstan</option>
  <option value="Turkistan (HSA)">Kazakhstan</option>
  <option value="Pavlodar (PWQ)">Kazakhstan</option>
  <option value="Petropavlovsk (PPK)">Kazakhstan</option>
  <option value="Ust-Kamenogorsk (UKK)">Kazakhstan</option>
  <option value="Shymkent (CIT)">Kazakhstan</option>
  <option value="Semey (PLX)">Kazakhstan</option>
  <option value="Zhezkazgan (DZN)">Kazakhstan</option>

  {/* Группа: Мир */}
  <option value="Tashkent (TAS)">Uzbekistan</option>
  <option value="Madrid (MAD)">Spain</option>
  <option value="Paris (CDG)">France</option>
  <option value="Berlin (BER)">Germany</option>
  <option value="Baku (GYD)">Azerbaijan</option>
  <option value="Warsaw (WAW)">Poland</option>
  <option value="Prague (PRG)">Czech Republic</option>
  <option value="Amsterdam (AMS)">Netherlands</option>
  <option value="Rome (FCO)">Italy</option>
  <option value="London (LHR)">UK</option>
  <option value="Dubai (DXB)">UAE</option>
  <option value="Bishkek (FRU)">Kyrgyzstan</option>
  <option value="Istanbul (IST)">Turkey</option>
  <option value="Copenhagen (CPH)">Denmark</option>
  <option value="Vienna (VIE)">Austria</option>
  <option value="Vilnius (VNO)">Lithuania</option>
  <option value="Sofia (SOF)">Bulgaria</option>
  <option value="Bern (BRN)">Switzerland</option>
  <option value="Stockholm (ARN)">Sweden</option>
  <option value="New York (JFK)">USA</option>
  <option value="Washington (IAD)">USA</option>
  <option value="Buenos Aires (EZE)">Argentina</option>
  <option value="Mexico City (MEX)">Mexico</option>
  <option value="Ottawa (YOW)">Canada</option>
  <option value="Hanoi (HAN)">Vietnam</option>
  <option value="Jakarta (CGK)">Indonesia</option>
  <option value="Canberra (CBR)">Australia</option>
  <option value="Seoul (ICN)">South Korea</option>
  <option value="Beijing (PEK)">China</option>
  <option value="Riyadh (RUH)">Saudi Arabia</option>
  <option value="Athens (ATH)">Greece</option>
</datalist>

  {/* ВКЛАДКИ */}
  <div className="flex gap-6 mb-6 text-[14px] font-bold text-[#0A4A5E] px-2">
    <button 
      onClick={() => { setTripType('one-way'); setReturnDate(''); }}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${tripType === 'one-way' ? 'bg-[#F0F9FF]' : 'opacity-50 hover:opacity-100'}`}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
      One way
    </button>
    <button 
      onClick={() => setTripType('round-trip')}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${tripType === 'round-trip' ? 'bg-[#F0F9FF]' : 'opacity-50 hover:opacity-100'}`}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
      Round-trip
    </button>
  </div>

  {/* ПОЛЯ ВВОДА */}
  <div className={`grid grid-cols-1 gap-4 mb-6 ${tripType === 'round-trip' ? 'md:grid-cols-5' : 'md:grid-cols-4'}`}>
    
    {/* 1. Откуда (Подключили list="airports-list") */}
    {/* 1. Откуда (Жестко закреплены 2 города-хаба) */}
    <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col justify-center focus-within:border-[#38C5D8] focus-within:ring-1 focus-within:ring-[#38C5D8] transition-all cursor-pointer">
  <label className="text-[14px] font-bold text-[#38C5D8] mb-1">Where from</label>
  <input
    type="text"
    list="destinations-listKZ"
    placeholder="Departure city"
    value={origin}
    onChange={(e) => setOrigin(e.target.value)}
    className="w-full text-[15px] font-bold text-[#0A4A5E] outline-none bg-transparent placeholder:text-gray-300 placeholder:font-medium uppercase"
  />
</div>

    {/* 2. Куда (Подключили новую базу destinations-list) */}
    <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col justify-center focus-within:border-[#38C5D8] focus-within:ring-1 focus-within:ring-[#38C5D8] transition-all cursor-text">
  <label className="text-[14px] font-bold text-[#38C5D8] mb-1">Where</label>
  <input
    type="text"
    list="destinations-all"
    placeholder="City of arrival"
    value={destination}
    onChange={(e) => setDestination(e.target.value)}
    className="w-full text-[15px] font-bold text-[#0A4A5E] outline-none bg-transparent placeholder:text-gray-300 placeholder:font-medium uppercase"
  />
</div>

    {/* 3. Дата вылета (Подключили min и max) */}
    <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col justify-center focus-within:border-[#38C5D8] focus-within:ring-1 focus-within:ring-[#38C5D8] transition-all cursor-text relative">
      <label className="text-[14px] font-bold text-[#38C5D8] mb-1">Departure date</label>
      <input 
        type={departDate ? "date" : "text"} 
        onFocus={(e) => e.target.type = "date"}
        onBlur={(e) => { if (!e.target.value) e.target.type = "text" }}
        min={minDate}
        max={maxDate}
        placeholder="Select a date" 
        value={departDate} 
        onChange={(e) => setDepartDate(e.target.value)}
        className="w-full text-[15px] font-bold text-[#0A4A5E] outline-none bg-transparent placeholder:text-gray-300 placeholder:font-medium"
      />
    </div>

    {/* 4. Дата возвращения (Подключили min и max) */}
    {tripType === 'round-trip' && (
      <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col justify-center focus-within:border-[#38C5D8] focus-within:ring-1 focus-within:ring-[#38C5D8] transition-all cursor-text relative">
        <label className="text-[14px] font-bold text-[#38C5D8] mb-1">Return date</label>
        <input 
          type={returnDate ? "date" : "text"} 
          onFocus={(e) => e.target.type = "date"}
          onBlur={(e) => { if (!e.target.value) e.target.type = "text" }}
          min={departDate || minDate} /* Нельзя вернуться раньше, чем улетел */
          max={maxDate}
          placeholder="Select a date" 
          value={returnDate} 
          onChange={(e) => setReturnDate(e.target.value)}
          className="w-full text-[15px] font-bold text-[#0A4A5E] outline-none bg-transparent placeholder:text-gray-300 placeholder:font-medium"
        />
      </div>
    )}

    {/* 5. Пассажиры и Бизнес-класс */}
    <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col justify-center focus-within:border-[#38C5D8] focus-within:ring-1 focus-within:ring-[#38C5D8] transition-all cursor-pointer">
      <label className="text-[14px] font-bold text-[#38C5D8] mb-1">Passengers and class</label>
      <select 
        value={passengers} 
        onChange={(e) => setPassengers(e.target.value)}
        className={`w-full text-[15px] font-bold outline-none bg-transparent cursor-pointer appearance-none ${!passengers ? 'text-gray-300 font-medium' : 'text-[#0A4A5E]'}`}
      >
        <option value="" disabled hidden>Who's flying?</option>
        <optgroup label="Econom-class">
          <option value="1_eco" className="text-[#0A4A5E]">1 passenger, Econom</option>
          <option value="2_eco" className="text-[#0A4A5E]">2 passengers, Econom</option>
          <option value="3_eco" className="text-[#0A4A5E]">3 passengers, Econom</option>
        </optgroup>
        <optgroup label="Business-class">
          <option value="1_bus" className="text-[#0A4A5E]">1 passenger, Business</option>
          <option value="2_bus" className="text-[#0A4A5E]">2 passengers, Business</option>
          <option value="3_bus" className="text-[#0A4A5E]">3 passengers, Business</option>
        </optgroup>
      </select>
    </div>

  </div>

  {/* ЧЕКБОКСЫ И КНОПКА ПОИСКА */}
  {/* На моб. - колонка, на планшетах и ПК - строка */}
  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center px-1 sm:px-2 gap-6 lg:gap-0">
    
    {/* Сами чекбоксы: на совсем узких экранах тоже друг под другом */}
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full lg:w-auto">
      <label className="flex items-center gap-2 text-[13px] sm:text-[14px] font-bold text-[#0A4A5E] cursor-pointer opacity-80 hover:opacity-100 transition-opacity">
        <input type="checkbox" className="w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-300 text-[#38C5D8] focus:ring-[#38C5D8] cursor-pointer" />
        Add the nearest airports
      </label>
      <label className="flex items-center gap-2 text-[13px] sm:text-[14px] font-bold text-[#0A4A5E] cursor-pointer opacity-80 hover:opacity-100 transition-opacity">
        <input type="checkbox" className="w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-300 text-[#38C5D8] focus:ring-[#38C5D8] cursor-pointer" />
        Direct flights only
      </label>
    </div>

    {/* Кнопка на мобилках занимает 100% ширины */}
    <button 
      onClick={() => {
  if (!origin || !destination || !departDate || !passengers) {
    alert('Пожалуйста, заполните направления, дату вылета и укажите пассажиров!');
    return;
  }

  // ← ДОБАВЬ ЭТИ ПРОВЕРКИ
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selected = new Date(departDate);

  if (selected < today) {
    alert('Дата вылета не может быть в прошлом!');
    return;
  }

  const maxDate = new Date(today);
  maxDate.setMonth(maxDate.getMonth() + 3);
  if (selected > maxDate) {
    alert('Дата вылета не может быть позже чем через 3 месяца!');
    return;
  }
  // ← КОНЕЦ ПРОВЕРОК

  setSearchParams({
    // Найди:
origin: origin.match(/\(([^)]+)\)/)?.[1] || origin.split('(')[0].trim().toUpperCase(),
destination: destination.match(/\(([^)]+)\)/)?.[1] || destination.split('(')[0].trim().toUpperCase(),
    date: departDate,
    passengers: parseInt(passengers),
    tripType: tripType
  });
  navigate('/search-results');
}}
      className="bg-[#0A4A5E] text-white w-full lg:w-auto px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#083a4a] transition-all active:scale-95 shadow-lg text-[15px]"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
      Find flights
    </button>
  </div>

</div>
    
  </section>

  {/* INFORMATION & QUOTE SECTION */}
  <section className="w-full max-w-[1400px] 2xl:max-w-[1600px] mx-auto py-8 md:py-12 px-4 md:px-[48px] grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
    
    {/* Левая колонка: Полезные советы (Белая карточка) */}
    <div className="bg-white/90 backdrop-blur-md rounded-[24px] md:rounded-[32px] p-6 md:p-8 shadow-lg border border-white/60 flex flex-col h-full order-2 lg:order-1 transition-transform hover:-translate-y-1">
      <h3 className="text-[18px] md:text-[20px] font-bold mb-6 lg:mb-8" style={{ color: oceanColor }}>Useful Tips for Travelers</h3>
      
      {/* flex-1 и justify-between равномерно растянут советы по высоте карточки */}
      <div className="flex-1 flex flex-col justify-between gap-4">
        <div>
          <h4 className="font-bold text-[14px] md:text-[15px] mb-1" style={{ color: oceanColor }}>Arrive at the airport early</h4>
          <p className="text-[12px] md:text-[14px] opacity-70 leading-snug">We recommend arriving 2–3 hours before departure for international flights.</p>
        </div>
        <div>
          <h4 className="font-bold text-[14px] md:text-[15px] mb-1" style={{ color: oceanColor }}>Check the baggage rules</h4>
          <p className="text-[12px] md:text-[14px] opacity-70 leading-snug">Each airline has its own baggage rules. Check them in advance.</p>
        </div>
        <div>
          <h4 className="font-bold text-[14px] md:text-[15px] mb-1" style={{ color: oceanColor }}>Online check-in</h4>
          <p className="text-[12px] md:text-[14px] opacity-70 leading-snug">Check in online and save time at the airport.</p>
        </div>
        <div>
          <h4 className="font-bold text-[14px] md:text-[15px] mb-1" style={{ color: oceanColor }}>Traveler’s Guide</h4>
          <p className="text-[12px] md:text-[14px] opacity-70 leading-snug">Pick up a copy of the guide and travel with peace of mind and confidence.</p>
        </div>
      </div>
    </div>

    {/* Центральная колонка: Цитата (Картинка тянется на 100% высоты) */}
    <div className="relative rounded-[24px] md:rounded-[32px] overflow-hidden shadow-lg group order-1 lg:order-2 h-full min-h-[350px]">
      <img 
        src="/planesky.png" loading="lazy"
        alt="Quote Background" 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
      />
      <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-6 md:px-10 text-white">
        <span className="text-[48px] md:text-[60px] font-serif leading-none mb-2 md:mb-4 opacity-80">“</span>
        <p className="text-[15px] md:text-[20px] font-medium italic leading-relaxed mb-4 md:mb-6">
          «Flying isn't just about moving through space; it's a freedom that bridges the gap between dreams and reality.»
        </p>
        <p className="text-[13px] md:text-[18px] font-bold">— Antoine de Saint-Exupéry</p>
      </div>
    </div>

    {/* Правая колонка: Как купить авиабилет? (Белая карточка) */}
    <div className="bg-white/90 backdrop-blur-md rounded-[24px] md:rounded-[32px] p-6 md:p-8 shadow-lg border border-white/60 flex flex-col h-full order-3 transition-transform hover:-translate-y-1">
      <h3 className="text-[18px] md:text-[20px] font-bold mb-6 lg:mb-8" style={{ color: oceanColor }}>How to buy a plane ticket?</h3>
      
      <div className="flex-1 flex flex-col justify-between gap-3">
        {[
          { step: 1, title: 'Find a flight', desc: 'Enter your destination and travel dates.' },
          { step: 2, title: 'Select a flight', desc: 'Compare prices and terms.' },
          { step: 3, title: 'Fill in the details', desc: 'Enter the passengers information.' },
          { step: 4, title: 'Pay', desc: 'Select a convenient payment method and complete your booking.' },
          { step: 5, title: 'Get your ticket', desc: 'The ticket will be sent to your email and will be available in your account.' },
        ].map((item) => (
          <div key={item.step} className="flex gap-4 items-start">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#00B4D8] flex items-center justify-center text-white font-bold text-[13px] md:text-[14px] shrink-0 mt-0.5">
              {item.step}
            </div>
            <div>
              <h4 className="font-bold text-[14px] md:text-[15px] leading-tight mb-1" style={{ color: oceanColor }}>{item.title}</h4>
              <p className="text-[12px] md:text-[14px] opacity-70 leading-snug">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>

  {/* FAQ SECTION */}
<section className="w-full max-w-[1400px] 2xl:max-w-[1600px] mx-auto py-4 md:py-6 px-4 md:px-[48px]">
  <div className="bg-white/90 backdrop-blur-md rounded-[24px] md:rounded-[32px] p-6 md:p-10 shadow-lg border border-white/60">
    <h3 className="text-[20px] md:text-[24px] font-bold mb-4 md:mb-6 text-left" style={{ color: oceanColor }}>
      Frequently Asked Questions
    </h3>
    <div className="flex flex-col">
      {[
        { 
          q: "How do I buy a plane ticket on the Askyinde website?", 
          a: "Enter your departure and arrival cities, select your dates and the number of passengers. Compare the available flights, choose the one that suits you, fill in the passenger details, and pay for the ticket using your preferred payment method." 
        },
        { 
          q: "What should I do after buying an air ticket?", 
          a: "After successful payment, the itinerary receipt (e-ticket) will be sent to the email address you specified. It is also always available in your personal account in the «My trips» section." 
        },
        { 
          q: "How do I check in for a flight online?", 
          a: "Online check-in usually opens 24 hours before departure. You can complete it on the airline's official website using the booking number (Passenger Name Record PNR) indicated on your ticket." 
        },
        { 
          q: "Is it possible to change or cancel a ticket?", 
          a: "The terms of return and exchange depend on the airline's fare. Check the terms of the tariff before purchasing. To make changes, go to your personal account or contact our support team." 
        },
        { 
          q: "What kind of luggage is included in the ticket price?", 
          a: "Baggage and carry-on baggage rates depend on the selected flight and fare. This information is specified in detail at the stage of ticket selection and stored in your itinerary receipt." 
        },
        { 
          q: "When is it better to buy cheaper flights?", 
          a: "We recommend booking tickets 1.5–2 months before the trip. Also, prices are often lower when departing in the middle of the week (Tuesday or Wednesday)." 
        },
        { 
          q: "How do I contact customer support?", 
          a: "You can send us an email. support@askyinde.com or aushakhmets@gmail.com, contact the online chat on the website or call the numbers listed in the «Privacy Policy» section." 
        },
      ].map((item, idx) => {
        // ПРОВЕРКА: есть ли текущий индекс в массиве открытых?
        const isOpen = openFaqIndices.includes(idx);

        return (
          <div key={idx} className="border-b border-gray-100 last:border-b-0 flex flex-col">
            {/* Кнопка вопроса */}
            <div 
              onClick={() => toggleFaq(idx)}
              className="py-3 md:py-4 flex justify-between items-center cursor-pointer group select-none"
            >
              <span className="text-[14px] md:text-[20px] font-medium transition-opacity pr-4" style={{ color: oceanColor }}>
                {idx + 1}. {item.q}
              </span>
              <span 
                className={`shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                style={{ color: oceanColor }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </span>
            </div>
            
            {/* Выпадающий ответ с плавной анимацией */}
            <div 
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? 'max-h-[500px] opacity-100 pb-4' : 'max-h-0 opacity-0'
              }`}
            >
              <p className="text-[16px] md:text-[18px] opacity-70 leading-relaxed pr-8" style={{ color: oceanColor }}>
                {item.a}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  </div>
</section>

  {/* PARTNERS & TRUST SECTION */}
<section className="w-full max-w-[1400px] 2xl:max-w-[1600px] mx-auto pb-2 md:pb-2 pt-2 md:pt-2 px-4 md:px-[48px]">
  <div className="bg-white/90 backdrop-blur-md rounded-[24px] md:rounded-[32px] p-6 lg:p-10 shadow-lg border border-white/60">
    
    {/* Заменили Grid на Flex. Теперь блоки выстроятся в ряд, и первый блок вытолкнет остальные */}
<div className="flex flex-col xl:flex-row items-stretch justify-between gap-6 xl:gap-0 w-full">

      {/* Текст призыва: flex-1 заставляет его занять всё лишнее место */}
<div className="flex-1 flex flex-col justify-center gap-2 text-left xl:pr-6 border-b xl:border-b-0 xl:border-r border-gray-200 pb-6 xl:pb-0">
          <h4 className="font-bold text-[15px] md:text-[20px] leading-tight" style={{ color: oceanColor }}>
          Travel with confidence with Askyinde
        </h4>
        <p className="text-[12px] md:text-[16px] opacity-70 leading-relaxed" style={{ color: oceanColor }}>
          The best routes, fair prices and caring for every traveler
        </p>
      </div>

      {/* Преимущество 1: Направления */}
      <div className="shrink-0 flex items-center gap-4 xl:px-6 border-b xl:border-b-0 xl:border-r border-gray-200 pb-6 xl:pb-0">
             <img className="w-[60px] md:w-[70px] shrink-0" src="/mini earth.svg" loading="lazy" alt="mini earth"/>
        {/* whitespace-nowrap запрещает тексту переноситься на новую строку */}
        <div className="flex flex-col whitespace-nowrap">
          <span className="text-[13px] md:text-[18px] font-bold" style={{ color: oceanColor }}>Many directions</span>
          <span className="text-[11px] md:text-[16px] opacity-70" style={{ color: oceanColor }}>all over the world</span>
        </div>
      </div>

      {/* Преимущество 2: Авиакомпании */}
      <div className="shrink-0 flex items-center gap-4 xl:px-6 border-b xl:border-b-0 xl:border-r border-gray-200 pb-6 xl:pb-0">
          <img className="w-[60px] md:w-[70px] shrink-0" src="/mini shield.svg" loading="lazy" alt="mini shield"/>
        <div className="flex flex-col whitespace-nowrap">
          <span className="text-[13px] md:text-[18px] font-bold" style={{ color: oceanColor }}>Reliable airlines</span>
          <span className="text-[11px] md:text-[16px] opacity-70" style={{ color: oceanColor }}>and partners</span>
        </div>
      </div>

      {/* Преимущество 3: Оплата (без разделителя справа) */}
      <div className="shrink-0 flex items-center gap-4 xl:pl-6">
          <img className="w-[60px] md:w-[70px] shrink-0" src="/lock.svg" loading="lazy" alt="lock"/>
        <div className="flex flex-col whitespace-nowrap">
          <span className="text-[14px] md:text-[18px] font-bold" style={{ color: oceanColor }}>Secure payment</span>
          <span className="text-[12px] md:text-[16px] opacity-70" style={{ color: oceanColor }}>and data protection</span>
        </div>
      </div>

    </div>
  </div>
</section>

</main>

      {/* --- FOOTER (English version + Interactive Accordions) --- */}
<footer className="animate-rise-up relative z-20 w-full bg-white/40 backdrop-blur-md border-t border-white/20 pt-[40px] pb-[20px] px-[160px]">
  {/* Убрали max-w-[1400px] и mx-auto, чтобы на 4К контент тянулся так же, как в header */}
  <div className="max-w-[2560px] mx-auto">
    
    {/* Сетка колонок */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-8 text-left">
      
      {/* Column 1: Logo & Slogan */}
      <div className="md:col-span-2 lg:col-span-3 flex flex-col gap-4">
        <div className="flex items-center gap-3 group no-underline select-none cursor-default w-max">
          <div className="relative flex items-center justify-center transition-transform duration-700" style={{ width: '34px', height: '34px' }}>
            <div className="absolute inset-0 border-[2.5px] border-[#0A4A5E] rounded-full"></div>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L14.5 12L12 22L9.5 12L12 2Z" fill={accentColor} />
              <path d="M2 12L12 9.5L22 12L12 14.5L2 12Z" fill="white" />
              <circle cx="12" cy="12" r="2" fill={oceanColor} />
            </svg>
          </div>
          <span className="text-[28px]" style={{ color: oceanColor, fontFamily: "'DM Serif Display', serif" }}>Askyinde</span>
        </div>
        <p className="text-[14px] leading-relaxed opacity-80 hero-description max-w-[250px]" style={{ color: oceanColor }}>
          Your reliable assistant <br className="hidden lg:block" /> in the world of travel
        </p>
      </div>

      {/* Column 2: Company */}
      <div className="col-span-1 lg:col-span-2">
        <FooterColumn title="Company" oceanColor={oceanColor}>
          <li>
            <Link to="/legal" className="cursor-pointer opacity-70 hover:opacity-100 transition-opacity no-underline" style={{ color: oceanColor }}>
              About us
            </Link>
          </li>
          <li>
            <Link to="/legal" className="cursor-pointer opacity-70 hover:opacity-100 transition-opacity no-underline" style={{ color: oceanColor }}>
              Why Askyinde
            </Link>
          </li>
          <li>
            <Link to="/legal" className="cursor-pointer opacity-70 hover:opacity-100 transition-opacity no-underline" style={{ color: oceanColor }}>
              Contacts
            </Link>
          </li>
          <li>
            <Link to="/legal" className="cursor-pointer opacity-70 hover:opacity-100 transition-opacity no-underline" style={{ color: oceanColor }}>
              Safety
            </Link>
          </li>
        </FooterColumn>
      </div>

      {/* Column 3: Useful */}
      {/* Column 3: Useful */}
<div className="col-span-1 lg:col-span-2">
  <FooterColumn title="Useful" oceanColor={oceanColor}>
    
    <li>
      <Link
        to="/explore-flights"
        className="cursor-pointer opacity-70 hover:opacity-100 transition-opacity no-underline"
        style={{ color: oceanColor }}
      >
        Popular destinations
      </Link>
    </li>

    <li>
      <Link
        to="/explore-flights"
        className="cursor-pointer opacity-70 hover:opacity-100 transition-opacity no-underline"
        style={{ color: oceanColor }}
      >
        Airlines
      </Link>
    </li>

    <li>
      <Link
        to="/explore-flights"
        className="cursor-pointer opacity-70 hover:opacity-100 transition-opacity no-underline"
        style={{ color: oceanColor }}
      >
        Branches
      </Link>
    </li>

  </FooterColumn>
</div>

      {/* Column 4: Help */}
      <div className="col-span-1 lg:col-span-2">
        <FooterColumn title="Help" oceanColor={oceanColor}>
          <li>
            <Link 
              to="/help" 
              className="cursor-pointer opacity-70 hover:opacity-100 transition-opacity no-underline"
              style={{ color: oceanColor }}
            >
              Support Center
            </Link>
          </li>
          <li>
            <Link 
              to="/help" 
              className="cursor-pointer opacity-70 hover:opacity-100 transition-opacity no-underline"
              style={{ color: oceanColor }}
            >
              Terms & Conditions
            </Link>
          </li>
        </FooterColumn>
      </div>

      {/* Column 5: Newsletter */}
      <div className="md:col-span-2 lg:col-span-3 flex flex-col gap-5">
        <h4 className="text-[17px] font-bold btn-bold-sora" style={{ color: oceanColor }}>Subscribe for notifications</h4>
        <p className="text-[14px] leading-relaxed opacity-70 hero-description" style={{ color: oceanColor }}>
          Get the best deals and news straight to your inbox.
        </p>
        <div className="relative mt-2">
          <input 
            type="email" 
            placeholder="Your e-mail" 
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            className="w-full py-4 px-5 rounded-2xl bg-white border border-white/10 outline-none text-[14px] focus:border-[#38C5D8] transition-all pr-12 shadow-md"
          />
          <button 
            onClick={() => {
              if(emailInput) {
                setIsSubscribed(true);
                setEmailInput("");
              }
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg hover:translate-x-1 transition-transform" 
            style={{ color: oceanColor }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21l18-9L3 3v8l12 1-12 1v8z" />
            </svg>
          </button>
        </div>
      </div>

    </div>

    {/* Copyright */}
    <div className="mt-8 text-center border-t border-white/20 pt-4">
      <p className="btn-bold-sora" style={{ color: '#0A4A5E', fontSize: '14px', fontWeight: '600', opacity: '0.9' }}>
        © Askyinde Ltd 2025-2026
      </p>
    </div>
    
  </div>
</footer>
      
            {/* --- MODAL: SUCCESSFUL SUBSCRIPTION --- */}
      {isSubscribed && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          {/* Затемнение фона */}
          <div 
            className="absolute inset-0 bg-[#0A4A5E]/20 backdrop-blur-sm" 
            onClick={() => setIsSubscribed(false)}
          ></div>
          
          {/* Сама карточка окна */}
          <div className="relative bg-white w-full max-w-[420px] rounded-[32px] p-10 shadow-2xl text-center animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
      
            <h2 className="text-[28px] mb-3" style={{ color: oceanColor, fontFamily: "'DM Serif Display', serif" }}>
              Awesome!
            </h2>
            
            <p className="text-[16px] text-gray-500 mb-8 leading-relaxed hero-description">
              You have successfully subscribed to notifications. <br />
              Now the best offers will be in your mail!
            </p>
      
            <button 
              onClick={() => setIsSubscribed(false)}
              className="w-full py-4 rounded-2xl font-bold text-white transition-all active:scale-95 shadow-lg hover:opacity-90 btn-bold-sora"
              style={{ backgroundColor: oceanColor }}
            >
              Good
            </button>
          </div>
        </div>
      )}

      {/* --- КНОПКА ВЫЗОВА ЧАТА (Плавает в углу) --- */}
{ !isChatOpen && (
  <button 
    onClick={() => setIsChatOpen(true)}
    className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-[100] border-2 border-white"
    style={{ backgroundColor: oceanColor }}
  >
    {/* Так как при открытом чате кнопки не будет, здесь остается только иконка сообщения */}
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  </button>
)}

{/* --- ОКНО ЧАТА --- */}
{isChatOpen && (
  <AskyindeAIChat 
    onClose={() => setIsChatOpen(false)} 
    oceanColor={oceanColor} 
    mode={chatMode} 
    setMode={setChatMode} 
  />
)}
      
          </div>
        );
      };
      
      const FooterColumn = ({ title, children, oceanColor }) => {
        const [isOpen, setIsOpen] = useState(false);
      
        return (
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Теперь открытие происходит ТОЛЬКО по клику (лкм) */}
            <div 
              className="flex items-center justify-between lg:justify-start gap-2 cursor-pointer group"
              onClick={() => setIsOpen(!isOpen)}
            >
              <h4 className="text-[17px] font-bold btn-bold-sora" style={{ color: oceanColor }}>{title}</h4>
              <svg 
                className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`} 
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={oceanColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
            
            <div className={`overflow-hidden transition-all duration-500 ${isOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}>
              {/* Изменили стили ссылок: вместо белого цвета при наведении используем основной цвет бренда с полной непрозрачностью */}
              <ul 
  className="flex flex-col gap-3 text-[14px] hero-description opacity-70 pb-4" 
  style={{ color: oceanColor }}
>
  {children}
</ul>
            </div>
          </div>
        );
      };
      
      export default MainAppPage;