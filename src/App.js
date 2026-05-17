import React, { useState } from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';

// Импортируем провайдер контекста
import { BookingProvider } from './context/BookingContext';

// Импортируем твои основные страницы
import MainAppPage from './components/MainAppPage';
import ProfilePage from './components/ProfilePage';
import HelpPage from './components/HelpPage';
import LegalLawPage from './components/LegalLawPage';
import ExploreFlights from './components/ExploreFlights';

// Импортируем НОВЫЕ страницы бронирования
import SearchResults from './pages/SearchResults';
import SeatSelection from './pages/SeatSelection';
import PassengerData from './pages/PassengerData';
import Payment from './pages/Payment';
import Confirmation from './pages/Confirmation';

// --- 1. КОМПОНЕНТ МОДАЛЬНОГО ОКНА (ПО МАКЕТУ image_efc6de.png) ---
const AuthModal = ({ isOpen, onClose, setUser, accentColor, oceanColor }) => {
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
    try {
      // получаем данные пользователя
      const res = await fetch("https://www.googleapis.com/oauth2/v1/userinfo?alt=json", {
        headers: {
          Authorization: `Bearer ${tokenResponse.access_token}`,
        },
      });

      const data = await res.json();

      const userData = {
        id: data.id,        // ← добавь это
        email: data.email,
        name: data.name,
        picture: data.picture
      };

      // 👉 сохраняем в state
      setUser(userData);

      // 👉 сохраняем в localStorage (чтобы не пропадало)
      localStorage.setItem("user", JSON.stringify(userData));

      onClose();
      navigate('/flights');

    } catch (error) {
      console.error("Ошибка получения пользователя:", error);
    }
  },
  onError: () => console.log("Ошибка авторизации"),
});

  if (!isOpen) return null;

  return (
    <div className="modal-overlay animate-in">
      <div className="modal-content text-center">
        <div className="cloud absolute opacity-40 scale-50 -top-10 -right-10 z-0 pointer-events-none"></div>
        {/* Кнопка закрытия */}
        <button onClick={onClose} className="absolute top-6 right-6 opacity-30 hover:opacity-100 transition-opacity">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={oceanColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* ЛОГОТИП КОМПАС (как в хедере) */}
        <div className="flex justify-center mb-6">
          <div className="relative flex items-center justify-center" style={{ width: '60px', height: '60px' }}>
            <div className="absolute inset-0 border-[3px] border-[#0A4A5E] rounded-full"></div>
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L14.5 12L12 22L9.5 12L12 2Z" fill={accentColor} />
              <path d="M2 12L12 9.5L22 12L12 14.5L2 12Z" fill="#F0FBFC" />
              <circle cx="12" cy="12" r="2" fill={oceanColor} />
            </svg>
          </div>
        </div>

        <h2 style={{ color: oceanColor, fontFamily: "'DM Serif Display', serif", fontSize: '26px' }} className="mb-2">
          Sign in to Askyinde
        </h2>
        
        {/* Изменен цвет на #1A5A70 */}
        <p className="text-[14px] mb-8 hero-description" style={{ color: '#1A5A70' }}>
          Choose a method to continue
        </p>

        <div className="flex flex-col gap-3 mb-10">
          <button onClick={() => login()} className="btn-google-auth active:scale-95">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="20" alt="Google" />
            Continue with Google
          </button>
          
          <button className="btn-google-auth opacity-50 cursor-not-allowed">
            <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" width="18" alt="Apple" />
            Continue with Apple
          </button>
        </div>

        <div className="h-[1px] w-full mb-6" style={{ backgroundColor: 'rgba(10, 74, 94, 0.1)' }} />

        {/* Изменен шрифт на 14px, основной текст #1A5A70, ссылки #0077AA */}
        <div className="px-4">
  <p 
    className="text-[14px] leading-relaxed hero-description text-center" 
    style={{ color: '#1A5A70' }}
  >
    By clicking on a login method, you agree to the{' '}
    <a 
      href="/legal-guest?tab=terms" 
      target="_blank" 
      rel="noopener noreferrer"
      className="modal-link-effect cursor-pointer font-semibold underline decoration-transparent hover:decoration-inherit transition-all"
      style={{ color: '#0077AA' }}
    >
      Terms of Service
    </a>{' '}
    and confirm that you have read our{' '}
    <a 
      href="/legal-guest?tab=privacy" 
      target="_blank" 
      rel="noopener noreferrer"
      className="modal-link-effect cursor-pointer font-semibold underline decoration-transparent hover:decoration-inherit transition-all"
      style={{ color: '#0077AA' }}
    >
      Privacy Policy
    </a>.
  </p>
</div>
      </div>
    </div>
  );
};

// --- 2. СТРАНИЦА ПОСЛЕ ВХОДА (SEARCH, FAQ, FOOTER) --- переехала в файл MainAppPage.jsx


// --- 3. ПРИВЕТСТВЕННАЯ СТРАНИЦА (WELCOME PAGE) ---
const WelcomePage = ({ setIsModalOpen }) => {
  const [hoveredNav, setHoveredNav] = useState(null);
  const [isLoginHovered, setIsLoginHovered] = useState(false);
  const [isExploreHovered, setIsExploreHovered] = useState(false);
  const [isFooterHovered, setIsFooterHovered] = useState(false);

  const accentColor = '#38C5D8';
  const oceanColor = '#0A4A5E';

  return (
    <div className="min-h-screen w-full relative flex flex-col font-sans overflow-x-hidden">
      <div className="fixed inset-0 z-0" style={{ background: 'linear-gradient(180deg, #A7E9F5 0%, #E0F7FA 100%)' }}>
        <div className="cloud cloud-1"></div>
        <div className="cloud cloud-2"></div>
      </div>

      <header className="header-adaptive-padding animate-drop-down relative z-30 w-full flex justify-between items-center bg-white/20 backdrop-blur-md">
  {/* Удалили cursor-pointer, добавили cursor-default и select-none */}
  <div className="flex items-center gap-3 cursor-default select-none group">
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

        <nav className="flex items-center">
          <div className="hidden lg:flex gap-10">
            {['Flights', 'My trips', 'Help'].map((item) => (
              <span key={item} 
                onMouseEnter={() => setHoveredNav(item)} 
                onMouseLeave={() => setHoveredNav(null)}
                className="cursor-pointer custom-transition btn-bold-sora text-[14px]"
                style={{ color: hoveredNav === item ? accentColor : oceanColor }}>
                {item}
              </span>
            ))}
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            onMouseEnter={() => setIsLoginHovered(true)} 
            onMouseLeave={() => setIsLoginHovered(false)}
            className="ml-6 active:scale-95 btn-bold-sora rounded-full px-[26px] py-[9px] custom-transition shadow-sm"
            style={{ 
                color: oceanColor, 
                backgroundColor: isLoginHovered ? accentColor : 'rgba(255, 255, 255, 0.4)', 
                fontSize: '14px' 
            }}>
            Log in
          </button>
        </nav>
        <div className="divider-line absolute bottom-0 left-0" />
      </header>

      <main className="main-adaptive-padding animate-rise-up relative z-20 flex-1 flex flex-col items-center justify-center text-center bg-transparent">
        <p className="fly-safely-text text-[12px] mb-4" style={{ color: '#1A6A82' }}>FLY SAFELY</p>
        <h1 className="mb-6" style={{ color: oceanColor, fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(32px, 5.5vw, 58px)', lineHeight: '1.1' }}>
          Welcome to the <br /> <em style={{ color: accentColor, fontStyle: 'italic' }}>Askyinde</em> <br /> flight booking website
        </h1>
        <p className="hero-description max-w-[600px] mb-10 text-[16px]" style={{ color: '#1A5A70', lineHeight: '1.5' }}>
          Thousands of routes. Real-time prices. <br /> Your next adventure is one search away.
        </p>

        <div className="hero-actions-container">
          <button onClick={() => setIsModalOpen(true)} className="btn-cta-main active:scale-95">
            Log in to get started
          </button>
          <Link
  to="/explore-flights-guest"
  onMouseEnter={() => setIsExploreHovered(true)}
  onMouseLeave={() => setIsExploreHovered(false)}
  className="flex items-center gap-2 relative py-1 btn-bold-sora custom-transition no-underline bg-transparent border-none cursor-pointer"
  style={{ color: isExploreHovered ? accentColor : oceanColor, fontSize: '14px' }}
>
  Explore flights →
  <span className="hover-underline-line" style={{ transform: isExploreHovered ? 'scaleX(1)' : 'scaleX(0)' }}></span>
</Link>
        </div>
      </main>

      <footer className="footer-adaptive-padding animate-rise-up relative z-20 w-full text-center bg-transparent">
        <div className="divider-line absolute top-0 left-0" />
        <p className="text-[14px] hero-description" style={{ color: '#1A5A70' }}>
          You must <span 
            onClick={() => setIsModalOpen(true)} 
            onMouseEnter={() => setIsFooterHovered(true)} 
            onMouseLeave={() => setIsFooterHovered(false)}
            className="cursor-pointer font-medium relative inline-block custom-transition" 
            style={{ color: isFooterHovered ? accentColor : '#0077AA' }}>
            log in <span className="hover-underline-line" style={{ transform: isFooterHovered ? 'scaleX(1)' : 'scaleX(0)' }}></span>
          </span> to your profile before purchasing plane tickets.
        </p>
      </footer>

      
    </div>
  );
};

// --- 4. ГЛАВНЫЙ ЭКСПОРТ (МАРШРУТЫ) ---
export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Добавляем состояние для хранения данных пользователя
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const accentColor = '#38C5D8';
  const oceanColor = '#0A4A5E';

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      
      {/* 1. Модальное окно выносим ВВЕРХ, чтобы оно было доступно всегда */}
      <AuthModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        setUser={setUser} 
        accentColor={accentColor} 
        oceanColor={oceanColor} 
      />

      {/* ОБОРАЧИВАЕМ РОУТЫ В PROVIDER ДЛЯ ДОСТУПА К ДАННЫМ БРОНИРОВАНИЯ */}
      <BookingProvider>
        <Routes>
          {/* --- СТАРЫЕ МАРШРУТЫ --- */}
          <Route path="/" element={
            <WelcomePage setIsModalOpen={setIsModalOpen} accentColor={accentColor} oceanColor={oceanColor} />
          } />

          <Route path="/flights" element={
            <MainAppPage user={user} accentColor={accentColor} oceanColor={oceanColor} />
          } />

          <Route path="/explore-flights" element={
          <ExploreFlights 
          user={user} 
          accentColor={accentColor} 
          oceanColor={oceanColor} 
          />
        } />

          <Route path="/explore-flights-guest" element={
          <ExploreFlights 
          user={user} 
          accentColor={accentColor} 
          oceanColor={oceanColor} 
          />
        } />

          <Route path="/profile" element={
            <ProfilePage 
              user={user} 
              setUser={setUser} 
              accentColor={accentColor} 
              oceanColor={oceanColor} 
            />
          } />

          <Route path="/help" element={
            <HelpPage 
              user={user} 
              accentColor={accentColor} 
              oceanColor={oceanColor} 
            />
          } />

          <Route path="/legal" element={
          <LegalLawPage 
          user={user} 
          accentColor={accentColor} 
          oceanColor={oceanColor} 
          />
        } />

          <Route path="/legal-guest" element={
          <LegalLawPage 
          user={user} 
          accentColor={accentColor} 
          oceanColor={oceanColor} 
          />
        } />

          {/* --- НОВЫЕ МАРШРУТЫ ДЛЯ БРОНИРОВАНИЯ --- */}
          <Route path="/search-results" element={<SearchResults />} />
          <Route path="/seat-selection" element={<SeatSelection />} />
          <Route path="/passenger-data" element={<PassengerData />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/confirmation" element={<Confirmation />} />

        </Routes>
      </BookingProvider>
    </GoogleOAuthProvider>
  );
}