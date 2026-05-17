import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import AskyindeAIChat from './AskyindeAIChat';

{/* Основная часть страницы */}
const ProfilePage = ({ user, setUser, accentColor, oceanColor }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. СОСТОЯНИЯ (только по одному разу!)
const [activeTab, setActiveTab] = useState(() => {
  const tab = localStorage.getItem("profileTab");
  if (tab) {
    localStorage.removeItem("profileTab");
    return tab;
  }
  return 'account';
});
  const [myTrips, setMyTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const [savedPassenger, setSavedPassenger] = useState(null);
const [isEditingPassport, setIsEditingPassport] = useState(false);
const [passportForm, setPassportForm] = useState({
  full_name: '', passport_number: '', date_of_birth: '', nationality: 'Kazakhstan'
});

  const [hoveredNav, setHoveredNav] = useState(null);
  const [isBackHovered, setIsBackHovered] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMode, setChatMode] = useState('compact');

  const [emailInput, setEmailInput] = useState("");
  const [isAirportModalOpen, setIsAirportModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedAirports, setSelectedAirports] = useState(() => {
    const saved = localStorage.getItem("preferredAirports");
    return saved ? JSON.parse(saved) : [];
  });

  const userInitial = user?.email?.charAt(0).toUpperCase() || '';

  // 2. ЛОГИКА SUPABASE (Функции загрузки и удаления)

  const fetchTrips = async () => {
  setLoading(true);
  try {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    
    if (!savedUser?.email) return;

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_email', savedUser.email)  // ← фильтр по email
      .order('created_at', { ascending: false });

    if (error) throw error;
    setMyTrips(data || []);
  } catch (err) {
    console.error("Error fetching trips:", err.message);
  } finally {
    setLoading(false);
  }
};

  const deleteTrip = async (id) => {
    if (window.confirm("Are you sure you want to delete this ticket?")) {
      try {
        const { error } = await supabase
          .from('bookings')
          .delete()
          .eq('id', id);

        if (error) throw error;
        setMyTrips(prev => prev.filter(trip => trip.id !== id));
      } catch (err) {
        alert("Error deleting ticket: " + err.message);
      }
    }
  };

  useEffect(() => {
  fetchTrips();

  const loadPassenger = async () => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (!savedUser?.email) return;
    const { data } = await supabase
      .from('passengers')
      .select('*')
      .eq('user_email', savedUser.email)
      .single();
    if (data) {
      setSavedPassenger(data);
      setPassportForm(data);
    }
  };
  loadPassenger();
}, []);

  // 3. ВСПОМОГАТЕЛЬНАЯ ЛОГИКА

  const isLogoClickable = user && location.pathname !== '/flights';
  
  const handleLogoClick = () => {
    if (isLogoClickable) navigate('/flights');
  };

  const handleSaveAirports = () => {
    localStorage.setItem("preferredAirports", JSON.stringify(selectedAirports));
    setIsAirportModalOpen(false);
    setIsSuccessModalOpen(true);
  };

  const kazakhstanAirports = [
    { name: "Astana International Airport", code: "NQZ" },
    { name: "Almaty International Airport", code: "ALA" },
    { name: "Kokshetau International Airport", code: "KOV" },
    { name: "Aktobe International Airport", code: "AKX" },
    { name: "Atyrau International Airport", code: "GUW" },
    { name: "Uralsk International Airport", code: "URA" },
    { name: "Taraz International Airport", code: "DMB" },
    { name: "Karaganda International Airport", code: "KGF" },
    { name: "Kostanay International Airport", code: "KSN" },
    { name: "Kyzylorda International Airport", code: "KZO" },
    { name: "Aktau International Airport", code: "SCO" },
    { name: "Turkistan International Airport", code: "HSA" },
    { name: "Pavlodar International Airport", code: "PWQ" },
    { name: "Petropavlovsk International Airport", code: "PPK" },
    { name: "Ust-Kamenogorsk International Airport", code: "UKK" },
    { name: "Shymkent International Airport", code: "CIT" },
    { name: "Semey International Airport", code: "PLX" },
    { name: "Zhezkazgan International Airport", code: "DZN" }
  ];

  const filteredAirports = kazakhstanAirports.filter(airport => {
    const nameMatch = airport.name.toLowerCase().includes(searchTerm.toLowerCase());
    const isNotSelected = !selectedAirports.includes(`${airport.name} (${airport.code})`);
    return nameMatch && isNotSelected;
  });

  

  return (
    <div className="min-h-screen w-full flex flex-col font-sans overflow-x-hidden relative">
      
      {/* 1. ФОНОВЫЙ ГРАДИЕНТ И ОБЛАКА */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, #A7E9F5 0%, #E0F7FA 100%)' }}>
        <div className="cloud cloud-1 opacity-50"></div>
        <div className="cloud cloud-2 opacity-40"></div>
        <div className="cloud cloud-3 opacity-30"></div>
      </div>

      {/* 2. HEADER */}
<header className="header-adaptive-padding animate-drop-down relative z-30 w-full flex justify-between items-center bg-white/60 backdrop-blur-md border-b border-white/20">
  
  {/* Логотип теперь полностью статичен для кликов */}
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

  <nav className="flex items-center gap-10">
    {/* Ссылка Flights по-прежнему ведет на основную страницу поиска */}
    <Link 
      to="/flights" 
      onMouseEnter={() => setHoveredNav('Flights')} 
      onMouseLeave={() => setHoveredNav(null)}
      className="relative py-1 cursor-pointer btn-bold-sora text-[14px] transition-colors no-underline" 
      style={{ color: hoveredNav === 'Flights' ? accentColor : oceanColor }}
    >
      Flights
      <span className="hover-underline-line" style={{ transform: hoveredNav === 'Flights' ? 'scaleX(1)' : 'scaleX(0)', backgroundColor: accentColor }}></span>
    </Link>

    <Link 
      to="/help" 
      onMouseEnter={() => setHoveredNav('Help')} 
      onMouseLeave={() => setHoveredNav(null)}
      className="relative py-1 cursor-pointer btn-bold-sora text-[14px] transition-colors no-underline" 
      style={{ color: hoveredNav === 'Help' ? accentColor : oceanColor }}
    >
      Help
      <span className="hover-underline-line" style={{ transform: hoveredNav === 'Help' ? 'scaleX(1)' : 'scaleX(0)', backgroundColor: accentColor }}></span>
    </Link>
  </nav>
</header>

      {/* 3. MAIN CONTENT */}
      <main className="main-adaptive-padding animate-rise-up relative z-20 flex-1 flex flex-col items-center">
        <div className="w-full max-w-[1100px] flex flex-col md:flex-row gap-12 items-start">
          
          <aside className="w-full md:w-[320px] sticky top-32">
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-[32px] border border-white/40 shadow-xl text-center">
              <div className="w-24 h-24 bg-[#E0F2FE] rounded-full mx-auto mb-4 flex items-center justify-center text-[32px] font-bold shadow-inner" style={{ color: oceanColor }}>
                {userInitial}
              </div>
              <h2 className="text-[24px] mb-1" style={{ color: oceanColor, fontFamily: "'DM Serif Display', serif" }}>Greetings here!</h2>
              <p className="text-[14px] text-gray-400 mb-8 hero-description">{user?.email}</p>
              
              <div className="flex flex-col gap-2 text-left">
  {/* Кнопка Price Alerts */}
  <button 
    onClick={() => setActiveTab('alerts')}
    className={`w-full p-4 rounded-xl flex justify-between items-center group transition-all ${
      activeTab === 'alerts' ? 'bg-white shadow-sm border border-gray-100' : 'hover:bg-white/50'
    }`}
  >
    <span className="flex items-center gap-3 text-[14px] btn-bold-sora" style={{ color: oceanColor }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
      My trips
    </span>
    <span className={activeTab === 'alerts' ? 'text-[#38C5D8]' : 'text-gray-300 group-hover:text-[#38C5D8]'}>→</span>
  </button>

  {/* Кнопка Account */}
  <button 
    onClick={() => setActiveTab('account')}
    className={`w-full p-4 rounded-xl flex justify-between items-center group transition-all ${
      activeTab === 'account' ? 'bg-white shadow-sm border border-gray-100' : 'hover:bg-white/50'
    }`}
  >
    <span className="flex items-center gap-3 text-[14px] btn-bold-sora" style={{ color: oceanColor }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
      Account
    </span>
    <span className={activeTab === 'account' ? 'text-[#38C5D8]' : 'text-gray-300 group-hover:text-[#38C5D8]'}>→</span>
  </button>
</div>

              <button onClick={() => { localStorage.removeItem("user"); setUser(null); navigate("/"); }} className="w-full mt-8 py-3 rounded-full bg-blue-100 text-[14px] btn-bold-sora hover:bg-cyan-100 hover:text-blue-500 transition-all shadow-sm" style={{ color: oceanColor }}>
                Log out
              </button>
            </div>
          </aside>

          <section className="flex-1 flex flex-col gap-8 text-left">
  
  {/* --- ВКЛАДКА ACCOUNT --- */}
  {activeTab === 'account' && (
    <>
      <div className="text-center mb-4 flex flex-col items-center">
        <Link 
          to="/flights" 
          onMouseEnter={() => setIsBackHovered(true)} 
          onMouseLeave={() => setIsBackHovered(false)} 
          className="text-[14px] btn-bold-sora no-underline relative pb-1 mb-2 transition-colors" 
          style={{ color: isBackHovered ? oceanColor : accentColor }}
        >
          « Your account
          <span className="absolute bottom-0 left-0 w-full h-[1.5px] transition-transform duration-300 origin-left" style={{ backgroundColor: accentColor, transform: isBackHovered ? 'scaleX(0)' : 'scaleX(1)' }}></span>
        </Link>
        <h1 className="text-[48px]" style={{ color: oceanColor, fontFamily: "'DM Serif Display', serif" }}>Account</h1>
      </div>

      {/* General info */}
      {/* General info */}
<div className="bg-white/70 backdrop-blur-sm rounded-[32px] border border-white/40 shadow-xl overflow-hidden">
  <div className="p-6 bg-white/30 border-b border-white/20">
    <h3 className="text-[18px] btn-bold-sora" style={{ color: oceanColor }}>General info</h3>
  </div>
  <div className="p-8">
    <label className="text-[12px] text-gray-400 block mb-1 hero-description">Email</label>
    <p className="text-[18px] btn-bold-sora" style={{ color: oceanColor }}>{user?.email}</p>
  </div>
</div>

{/* ← СЮДА вставь новый блок */}
{/* Passport info */}
{/* Passport info */}
<div className="bg-white/70 backdrop-blur-sm rounded-[32px] border border-white/40 shadow-xl overflow-hidden">
  <div className="p-6 bg-white/30 border-b border-white/20 flex justify-between items-center">
    <h3 className="text-[20px] btn-bold-sora" style={{ color: oceanColor }}>Information</h3>
    <button
      onClick={() => setIsEditingPassport(true)}
      className="text-[16px] font-bold px-4 py-2 rounded-xl transition-all hover:opacity-85"
      style={{ backgroundColor: oceanColor, color: 'white' }}
    >
      Edit
    </button>
  </div>

  {isEditingPassport ? (
    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="text-[12px] text-gray-400 block mb-1">Full Name</label>
        <input
          type="text"
          value={passportForm.full_name}
          onChange={(e) => setPassportForm({...passportForm, full_name: e.target.value})}
          className="w-full p-3 rounded-xl border border-gray-200 focus:border-[#38C5D8] outline-none"
          placeholder="John Doe"
        />
      </div>
      <div>
        <label className="text-[12px] text-gray-400 block mb-1">Passport Number</label>
        <input
          type="text"
          value={passportForm.passport_number}
          onChange={(e) => setPassportForm({...passportForm, passport_number: e.target.value})}
          className="w-full p-3 rounded-xl border border-gray-200 focus:border-[#38C5D8] outline-none uppercase"
          placeholder="AB1234567"
        />
      </div>
      <div>
        <label className="text-[12px] text-gray-400 block mb-1">Date of Birth</label>
        <input
          type="date"
          value={passportForm.date_of_birth}
          onChange={(e) => setPassportForm({...passportForm, date_of_birth: e.target.value})}
          className="w-full p-3 rounded-xl border border-gray-200 focus:border-[#38C5D8] outline-none"
        />
      </div>
      <div>
        <label className="text-[12px] text-gray-400 block mb-1">Nationality</label>
        <select
          value={passportForm.nationality}
          onChange={(e) => setPassportForm({...passportForm, nationality: e.target.value})}
          className="w-full p-3 rounded-xl border border-gray-200 focus:border-[#38C5D8] outline-none"
        >
          <option value="Kazakhstan">Kazakhstan</option>
          <option value="Uzbekistan">Uzbekistan</option>
          <option value="Russia">Russia</option>
          <option value="Turkey">Turkey</option>
          <option value="UAE">UAE</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="md:col-span-2 flex gap-3 justify-end mt-2">
        <button
          onClick={() => setIsEditingPassport(false)}
          className="px-6 py-3 rounded-xl font-bold opacity-60 hover:opacity-100 transition-all"
        >
          Cancel
        </button>
        <button
          onClick={async () => {
            const savedUser = JSON.parse(localStorage.getItem("user"));
            if (!savedUser?.email) return;
            await supabase.from('passengers').upsert({
              user_email: savedUser.email,
              ...passportForm
            }, { onConflict: 'user_email' });
            setSavedPassenger(passportForm);
            setIsEditingPassport(false);
          }}
          className="px-6 py-3 rounded-xl font-bold text-white transition-all hover:opacity-80"
          style={{ backgroundColor: oceanColor }}
        >
          Save
        </button>
      </div>
    </div>
  ) : (
    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="text-[12px] text-gray-400 block mb-1">Full Name</label>
        <p className="text-[18px] btn-bold-sora" style={{ color: oceanColor }}>{savedPassenger?.full_name || '—'}</p>
      </div>
      <div>
        <label className="text-[12px] text-gray-400 block mb-1">Passport Number</label>
        <p className="text-[18px] btn-bold-sora" style={{ color: oceanColor }}>{savedPassenger?.passport_number || '—'}</p>
      </div>
      <div>
        <label className="text-[12px] text-gray-400 block mb-1">Date of Birth</label>
        <p className="text-[18px] btn-bold-sora" style={{ color: oceanColor }}>{savedPassenger?.date_of_birth || '—'}</p>
      </div>
      <div>
        <label className="text-[12px] text-gray-400 block mb-1">Nationality</label>
        <p className="text-[18px] btn-bold-sora" style={{ color: oceanColor }}>{savedPassenger?.nationality || '—'}</p>
      </div>
    </div>
  )}
</div>
      {/* Preferred departure airports */}
      <div className="bg-white/70 backdrop-blur-sm rounded-[32px] border border-white/40 shadow-xl overflow-hidden">
        <div className="p-8 flex flex-col gap-4">
          <h3 className="text-[18px] btn-bold-sora" style={{ color: oceanColor }}>Preferred departure airports</h3>
          <p className="text-[15px] text-gray-500 leading-relaxed hero-description">Add your preferred airports to help us find the best deals and inspiration for you.</p>
          <div className="mt-2">
            <p className="text-[15px] text-gray-400 mb-4 hero-description">Departure airports ({selectedAirports.length} up to 5)</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedAirports.map((airport, index) => (
                <span key={index} className="text-[15px] px-3 py-1.5 bg-white/50 border border-white/40 rounded-xl shadow-sm" style={{ color: oceanColor }}>{airport}</span>
              ))}
            </div>
            <button onClick={() => setIsAirportModalOpen(true)} className="px-6 py-3 rounded-xl font-bold transition-all active:scale-95 shadow-sm hover:opacity-90" style={{ backgroundColor: oceanColor, color: 'white', fontSize: '16px' }}>
              {selectedAirports.length > 0 ? 'Edit airports' : 'Add airport'}
            </button>
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-center">
         <button className="px-10 py-4 rounded-2xl border-2 border-red-200 text-red-500 btn-bold-sora hover:bg-red-500 hover:text-white transition-all shadow-lg hover:shadow-red-200">Delete account</button>
      </div>
    </>
  )}

  {/* --- ВКЛАДКА MY TRIPS --- */}
  {activeTab === 'alerts' && (
  <div className="w-full animate-in fade-in duration-500 text-left">
    
    {/* ЗАГОЛОВОК СО ССЫЛКОЙ (Копия стиля из Account) */}
    <div className="text-center mb-4 flex flex-col items-center">
      <Link 
  to="/flights" 
  onMouseEnter={() => setIsBackHovered(true)} 
  onMouseLeave={() => setIsBackHovered(false)} 
  className="text-[14px] btn-bold-sora no-underline relative pb-1 mb-2 transition-colors inline-block" 
  style={{ color: isBackHovered ? oceanColor : accentColor }}
>
  « Your account
  <span 
    className="absolute bottom-0 left-0 w-full h-[1.5px] transition-transform duration-300 origin-left" 
    style={{ 
      backgroundColor: accentColor, 
      transform: isBackHovered ? 'scaleX(0)' : 'scaleX(1)' 
    }}
  ></span>
</Link>
      <h1 className="text-[48px]" style={{ color: oceanColor, fontFamily: "'DM Serif Display', serif" }}>
        My Trips
      </h1>
    </div>
    

    <div className="space-y-4 w-full">
      {loading ? (
        <p className="opacity-50 font-bold">Loading...</p>
      ) : myTrips.length > 0 ? (
        myTrips.map((ticket) => (
          <div key={ticket.id} className="bg-white/90 p-8 rounded-[32px] shadow-sm border border-white flex justify-between items-start group transition-all hover:shadow-md w-full">
            <div className="flex flex-col gap-1">
              <div className="text-[22px] font-bold" style={{ color: oceanColor }}>
                {(() => {
  const cityNames = {
  'NQZ': 'Astana', 'ALA': 'Almaty', 'KOV': 'Kokshetau',
  'AKX': 'Aktobe', 'GUW': 'Atyrau', 'URA': 'Uralsk',
  'DMB': 'Taraz', 'KGF': 'Karaganda', 'KSN': 'Kostanay',
  'KZO': 'Kyzylorda', 'SCO': 'Aktau', 'HSA': 'Turkistan',
  'PWQ': 'Pavlodar', 'PPK': 'Petropavlovsk', 'UKK': 'Ust-Kamenogorsk',
  'CIT': 'Shymkent', 'PLX': 'Semey', 'DZN': 'Zhezkazgan',
  'TAS': 'Tashkent', 'MAD': 'Madrid', 'CDG': 'Paris',
  'BER': 'Berlin', 'GYD': 'Baku', 'WAW': 'Warsaw',
  'PRG': 'Prague', 'AMS': 'Amsterdam', 'FCO': 'Rome',
  'LHR': 'London', 'DXB': 'Dubai', 'FRU': 'Bishkek',
  'IST': 'Istanbul', 'CPH': 'Copenhagen', 'VIE': 'Vienna',
  'VNO': 'Vilnius', 'SOF': 'Sofia', 'BRN': 'Bern',
  'ARN': 'Stockholm', 'JFK': 'New York', 'IAD': 'Washington',
  'EZE': 'Buenos Aires', 'MEX': 'Mexico City', 'YOW': 'Ottawa',
  'HAN': 'Hanoi', 'CGK': 'Jakarta', 'CBR': 'Canberra',
  'ICN': 'Seoul', 'PEK': 'Beijing', 'RUH': 'Riyadh', 'ATH': 'Athens',
  'BERLIN': 'Berlin', 'PARIS': 'Paris', 'MADRID': 'Madrid',
  'ROME': 'Rome', 'LONDON': 'London', 'AMSTERDAM': 'Amsterdam',
  'DUBAI': 'Dubai', 'ISTANBUL': 'Istanbul', 'WARSAW': 'Warsaw',
  'PRAGUE': 'Prague', 'VIENNA': 'Vienna', 'ATHENS': 'Athens',
  'STOCKHOLM': 'Stockholm', 'COPENHAGEN': 'Copenhagen',
  'BAKU': 'Baku', 'TASHKENT': 'Tashkent', 'BISHKEK': 'Bishkek',
  'SEOUL': 'Seoul', 'BEIJING': 'Beijing', 'HANOI': 'Hanoi',
  'JAKARTA': 'Jakarta', 'RIYADH': 'Riyadh', 'VILNIUS': 'Vilnius',
  'SOFIA': 'Sofia', 'BERN': 'Bern', 'OTTAWA': 'Ottawa',
  'NEW YORK': 'New York', 'BUENOS AIRES': 'Buenos Aires',
  'MEXICO CITY': 'Mexico City', 'WASHINGTON': 'Washington',
  'UST-KAMENOGORSK': 'Ust-Kamenogorsk', 'PETROPAVLOVSK': 'Petropavlovsk',
};

const countryNames = {
  'NQZ': 'Kazakhstan', 'ALA': 'Kazakhstan', 'KOV': 'Kazakhstan',
  'AKX': 'Kazakhstan', 'GUW': 'Kazakhstan', 'URA': 'Kazakhstan',
  'DMB': 'Kazakhstan', 'KGF': 'Kazakhstan', 'KSN': 'Kazakhstan',
  'KZO': 'Kazakhstan', 'SCO': 'Kazakhstan', 'HSA': 'Kazakhstan',
  'PWQ': 'Kazakhstan', 'PPK': 'Kazakhstan', 'UKK': 'Kazakhstan',
  'CIT': 'Kazakhstan', 'PLX': 'Kazakhstan', 'DZN': 'Kazakhstan',
  'TAS': 'Uzbekistan', 'MAD': 'Spain', 'CDG': 'France',
  'BER': 'Germany', 'GYD': 'Azerbaijan', 'WAW': 'Poland',
  'PRG': 'Czech Republic', 'AMS': 'Netherlands', 'FCO': 'Italy',
  'LHR': 'UK', 'DXB': 'UAE', 'FRU': 'Kyrgyzstan',
  'IST': 'Turkey', 'CPH': 'Denmark', 'VIE': 'Austria',
  'VNO': 'Lithuania', 'SOF': 'Bulgaria', 'BRN': 'Switzerland',
  'ARN': 'Sweden', 'JFK': 'USA', 'IAD': 'USA',
  'EZE': 'Argentina', 'MEX': 'Mexico', 'YOW': 'Canada',
  'HAN': 'Vietnam', 'CGK': 'Indonesia', 'CBR': 'Australia',
  'ICN': 'South Korea', 'PEK': 'China', 'RUH': 'Saudi Arabia', 'ATH': 'Greece',
  'BERLIN': 'Germany', 'PARIS': 'France', 'MADRID': 'Spain',
  'ROME': 'Italy', 'LONDON': 'UK', 'AMSTERDAM': 'Netherlands',
  'DUBAI': 'UAE', 'ISTANBUL': 'Turkey', 'WARSAW': 'Poland',
  'PRAGUE': 'Czech Republic', 'VIENNA': 'Austria', 'ATHENS': 'Greece',
  'STOCKHOLM': 'Sweden', 'COPENHAGEN': 'Denmark',
  'BAKU': 'Azerbaijan', 'TASHKENT': 'Uzbekistan', 'BISHKEK': 'Kyrgyzstan',
  'SEOUL': 'South Korea', 'BEIJING': 'China', 'HANOI': 'Vietnam',
  'JAKARTA': 'Indonesia', 'RIYADH': 'Saudi Arabia', 'VILNIUS': 'Lithuania',
  'SOFIA': 'Bulgaria', 'BERN': 'Switzerland', 'OTTAWA': 'Canada',
  'NEW YORK': 'USA', 'BUENOS AIRES': 'Argentina',
  'MEXICO CITY': 'Mexico', 'WASHINGTON': 'USA',
  'UST-KAMENOGORSK': 'Kazakhstan', 'PETROPAVLOVSK': 'Kazakhstan',
};

  const orig = ticket.origin;
const dest = ticket.destination;
const origCity = cityNames[orig] || cityNames[orig.toUpperCase()] || orig;
const destCity = cityNames[dest] || cityNames[dest.toUpperCase()] || dest;
const origCountry = countryNames[orig] || countryNames[orig.toUpperCase()] || '';
const destCountry = countryNames[dest] || countryNames[dest.toUpperCase()] || '';
return (
  <div className="flex items-center gap-6">
    <div className="flex flex-col">
  <span className="text-[22px] font-bold" style={{ color: oceanColor }}>
    {orig} ({origCity.toUpperCase()})
  </span>
  <span className="text-[12px] text-gray-400">{origCountry.toUpperCase()}</span>
</div>
<span className="text-[20px] font-bold" style={{ color: oceanColor }}>→</span>
<div className="flex flex-col">
  <span className="text-[22px] font-bold" style={{ color: oceanColor }}>
    {dest} ({destCity.toUpperCase()})
  </span>
  <span className="text-[12px] text-gray-400">{destCountry.toUpperCase()}</span>
</div>
  </div>
);

  return (
    <div className="flex items-center gap-6">
      <div className="flex flex-col">
        <span className="text-[22px] font-bold" style={{ color: oceanColor }}>
          {orig} ({cityNames[orig] || orig})
        </span>
        <span className="text-[12px] text-gray-400">{countryNames[orig] || ''}</span>
      </div>
      <span className="text-[20px] font-bold" style={{ color: oceanColor }}>→</span>
      <div className="flex flex-col">
        <span className="text-[22px] font-bold" style={{ color: oceanColor }}>
          {dest} ({cityNames[dest] || dest})
        </span>
        <span className="text-[12px] text-gray-400">{countryNames[dest] || ''}</span>
      </div>
    </div>
  );
})()}
              </div>
              <div className="text-[14px] opacity-60 font-bold">
                {ticket.airline} • {new Date(ticket.depart_time).toLocaleDateString('ru-RU')}
              </div>
              <div className="flex gap-2 mt-2">
                <span className="text-[10px] font-bold bg-[#38C5D8]/10 text-[#38C5D8] px-3 py-1 rounded-full uppercase">
                  {ticket.travel_class}
                </span>
                <span className="text-[10px] font-bold bg-gray-100 px-3 py-1 rounded-full uppercase" style={{ color: oceanColor }}>
                  Seat {ticket.seat}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className="text-[24px] font-bold" style={{ color: oceanColor }}>
                {ticket.price.toLocaleString()} ₸
              </div>
              <button
                onClick={() => deleteTrip(ticket.id)}
                className="text-[12px] font-bold text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Cancel booking
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-20 bg-white/20 rounded-[32px] border-2 border-dashed border-white/40">
          <p className="text-[18px] font-bold opacity-60" style={{ color: oceanColor }}>You have no tickets saved here</p>
          <p className="text-[14px] opacity-40">Your future trips will appear in this section.</p>
        </div>
      )}
    </div>
  </div>
  )}

</section>
        </div>
      </main>

      {/* --- МОДАЛЬНОЕ ОКНО 1: ВЫБОР АЭРОПОРТОВ --- */}
      {isAirportModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsAirportModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-[95%] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[750px] 2xl:max-w-[850px] rounded-[32px] md:rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <button onClick={() => setIsAirportModalOpen(false)} className="absolute top-4 right-4 md:top-8 md:right-8 z-10 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 transition-colors">
              <svg className="w-4 h-4 md:w-[18px] md:h-[18px]" viewBox="0 0 24 24" fill="none" stroke={oceanColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <div className="p-6 pt-12 md:p-12 md:pt-20 flex flex-col gap-4 md:gap-8 text-left">
              <h2 className="leading-tight" style={{ color: oceanColor, fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(24px, 5vw, 40px)' }}>Manage your departure airports</h2>
              <p className="text-[16px] md:text-[20px] text-gray-500 leading-relaxed hero-description max-w-[95%]">Tell us where you like to fly from to get the most relevant deals and inspiration for you.</p>

              <div className="flex flex-wrap gap-2 mb-2">
                {selectedAirports.map((airport, index) => (
                  <div key={index} className="flex items-center gap-2 px-3 py-1.5 bg-[#E0F2FE] rounded-full text-[13px] btn-bold-sora" style={{ color: oceanColor }}>
                    {airport}
                    <button onClick={() => setSelectedAirports(selectedAirports.filter(a => a !== airport))} className="hover:text-red-500 font-bold ml-1">✕</button>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3 md:gap-4 relative">
                <label className="text-[15px] md:text-[18px] btn-bold-sora" style={{ color: oceanColor }}>Departure airports (up to 5)</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={selectedAirports.length >= 5}
                    placeholder="Search Kazakhstan airports..."
                    className="w-full p-4 md:p-5 text-[16px] md:text-[20px] rounded-2xl border-2 border-gray-100 focus:border-[#38C5D8] outline-none transition-all pr-12 hero-description"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30">
                    <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                  </div>
                </div>

                {searchTerm && filteredAirports.length > 0 && selectedAirports.length < 5 && (
                  <div className="absolute top-full left-0 w-full bg-white border border-gray-100 rounded-2xl mt-2 shadow-2xl z-50 max-h-[200px] md:max-h-[280px] overflow-y-auto p-2">
                    {filteredAirports.map((airport, index) => (
                      <div key={index} onClick={() => { setSelectedAirports([...selectedAirports, `${airport.name} (${airport.code})`]); setSearchTerm(""); }} className="flex items-center gap-4 p-4 hover:bg-[#F3F4F6] cursor-pointer rounded-xl transition-all group">
                        <div className="text-gray-400 group-hover:text-[#38C5D8]">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 2H4l-1 1 3 2 2 3 1-1v-3l2-2 3.5 5.2c.3.4.8.5 1.3.3l.5-.3c.4-.2.6-.6.5-1.1z"/></svg>
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-[16px] font-medium" style={{ color: oceanColor }}>{airport.name} ({airport.code})</span>
                          <span className="text-[14px] text-gray-400">Kazakhstan</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <p className="text-[14px] md:text-[16px] text-gray-400 hero-description underline" style={{ color: '#0077AA' }}>You can add or remove the list of the nearest airports at any time.</p>

              <div className="flex justify-end mt-4 md:mt-6">
                <button onClick={handleSaveAirports} disabled={selectedAirports.length === 0} className={`w-full md:w-auto px-10 py-3 md:py-4 text-[16px] md:text-[18px] rounded-2xl font-bold transition-all btn-bold-sora ${selectedAirports.length > 0 ? 'text-white hover:opacity-80' : 'bg-gray-100 text-gray-400'}`} style={selectedAirports.length > 0 ? { backgroundColor: oceanColor } : {}}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- МОДАЛЬНОЕ ОКНО 2: ПОДТВЕРЖДЕНИЕ --- */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsSuccessModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-[95%] md:max-w-[650px] rounded-[32px] md:rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <button onClick={() => setIsSuccessModalOpen(false)} className="absolute top-6 right-6 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={oceanColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <div className="p-8 md:p-12 flex flex-col items-center text-center">
              <div className="mb-6"><text fontSize="60">🙌</text></div>
              <h2 className="text-[32px] md:text-[40px] leading-tight mb-4" style={{ color: oceanColor, fontFamily: "'DM Serif Display', serif" }}>Airports saved</h2>
              <p className="text-[16px] md:text-[18px] text-gray-500 mb-6">Great news, you’ll now only get deals and travel ideas from:</p>
              <ul className="text-left w-full max-w-xs mx-auto mb-8 space-y-2">
                {selectedAirports.map((airport, index) => (
                  <li key={index} className="flex items-center gap-3 text-[16px] md:text-[18px] font-medium" style={{ color: oceanColor }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
                    {airport.split(" (")[0]}
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-4 w-full md:w-auto">
                <button onClick={() => setIsSuccessModalOpen(false)} className="px-12 py-4 rounded-2xl font-bold text-white transition-all hover:opacity-90 btn-bold-sora" style={{ backgroundColor: oceanColor }}>Visit your account</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* --- FOOTER (English version + Interactive Accordions) --- */}
      <footer className="relative animate-rise-up z-20 w-full bg-white/40 backdrop-blur-md border-t border-white/20 pt-[40px] pb-[20px] px-[160px]">
        <div className="max-w-[2560px] mx-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-20 text-left">
            
            {/* Column 1: Logo & Slogan */}
            <div className="lg:col-span-3 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center" style={{ width: '34px', height: '34px' }}>
                  <div className="absolute inset-0 border-[2.5px] border-[#0A4A5E] rounded-full"></div>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L14.5 12L12 22L9.5 12L12 2Z" fill={accentColor} />
                    <path d="M2 12L12 9.5L22 12L12 14.5L2 12Z" fill="white" />
                    <circle cx="12" cy="12" r="2" fill={oceanColor} />
                  </svg>
                </div>
                <span className="text-[28px]" style={{ color: oceanColor, fontFamily: "'DM Serif Display', serif" }}>Askyinde</span>
              </div>
              <p className="text-[14px] leading-relaxed opacity-80 hero-description" style={{ color: oceanColor }}>
                Your reliable assistant <br /> in the world of travel
              </p>
            </div>

            {/* Column 2: Company (Interactive) */}
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
                  
                              {/* Column 3: Useful (Interactive) */}
                              <FooterColumn title="Useful" oceanColor={oceanColor}>
                                <li className="cursor-pointer hover:opacity-100 transition-opacity">Popular destinations</li>
                                <li className="cursor-pointer hover:opacity-100 transition-opacity">Airlines</li>
                                <li className="cursor-pointer hover:opacity-100 transition-opacity">Branches</li>
                              </FooterColumn>
                  
                              {/* Column 4: Help (Interactive) */}
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

            {/* Column 5: Newsletter */}
            <div className="lg:col-span-3 flex flex-col gap-5">
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
        setEmailInput(""); // Очищаем поле после "подписки"
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
          <div className="mt-10 text-center">
            <p className="btn-bold-sora" style={{ color: '#0A4A5E', fontSize: '16px', fontWeight: '600', opacity: '0.9' }}>
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


{/* AI CHAT BUTTON */}
{!isChatOpen && (
  <button
    onClick={() => setIsChatOpen(true)}
    className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-[#0A4A5E] text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-all border-4 border-white"
    aria-label="Open Askyinde AI Chat"
  >
    <svg 
      width="28" 
      height="28" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
    </svg>
  </button>
)}

{/* AI CHAT WINDOW */}
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
        <ul className="flex flex-col gap-3 text-[14px] hero-description opacity-70 pb-4" style={{ color: oceanColor }}>
          {React.Children.map(children, child => (
            <li className="cursor-pointer hover:opacity-100 hover:font-semibold transition-all">
              {child.props.children}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProfilePage;