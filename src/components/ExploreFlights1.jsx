import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// ✅ FooterColumn — аккордеон для футера
const FooterColumn = ({ title, children, oceanColor }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:col-span-2 flex flex-col gap-5">
      <div
        className="flex items-center justify-between lg:justify-start gap-2 cursor-pointer group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className="text-[17px] font-bold btn-bold-sora" style={{ color: oceanColor }}>
          {title}
        </h4>
        <svg
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke={oceanColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>

      <div className={`overflow-hidden transition-all duration-500 ${isOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}>
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

const ExploreFlights1 = ({ user, accentColor, oceanColor }) => {
  const [emailInput, setEmailInput] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const cities = [
    { name: 'BAKU', country: 'Azerbaijan', price: '______ ₸', image: 'https://tripplanet.ru/wp-content/uploads/asia/azerbaijan/baku/dostoprimechatelnostej-baku.jpg' },
    { name: 'TASHKENT', country: 'Uzbekistan', price: '______ ₸', image: 'https://tse4.mm.bing.net/th/id/OIP.Rq0n-nagCeWZDhhmNGvoSQHaE7?cb=thfc1&rs=1&pid=ImgDetMain&o=7&rm=3' },
    { name: 'SEOUL', country: 'South Korea', price: '______ ₸', image: 'https://planetofhotels.com/guide/sites/default/files/styles/big_gallery_image/public/text_gallery/Seoul-5.jpg' },
    { name: 'BEIJING', country: 'China', price: '______ ₸', image: 'https://www.agoda.com/wp-content/uploads/2024/06/Featured-image-The-Great-Wall-of-China-Beijing-China.jpg' },
    { name: 'HANOI', country: 'Vietnam', price: '______ ₸', image: 'https://viajesoceanic.com/wp-content/uploads/2017/09/Panoramica2-1.jpg' },
    { name: 'JAKARTA', country: 'Indonesia', price: '______ ₸', image: 'https://www.agoda.com/wp-content/uploads/2024/07/jakarta_1920x1080.jpg' },
    { name: 'RIYADH', country: 'Saudi Arabia', price: '______ ₸', image: 'https://img.pac.ru/resorts/336006/473317/big/84EDA5607F000101418452C5275B3BB0.jpg' },
    { name: 'VILNIUS', country: 'Lithuania', price: '______ ₸', image: 'https://th.bing.com/th/id/R.bc23e29d0bc4cbe538882450fe0b6292?rik=Vzo1IaT1%2bJsvEw&riu=http%3a%2f%2fwww.travelthruhistory.tv%2fThruHistory%2fwp-content%2fuploads%2f2015%2f05%2fvilnius.jpg&ehk=LhoN8YKLdQVHa3%2fUBYnFEzCJvyQE6c6Woew9J83slPY%3d&risl=&pid=ImgRaw&r=0' },
    { name: 'SOFIA', country: 'Bulgaria', price: '______ ₸', image: 'https://planetofhotels.com/guide/sites/default/files/styles/paragraph__live_banner__lb_image__1880bp/public/live_banner/sofia-1.jpg' },
    { name: 'BERN', country: 'Switzerland', price: '______ ₸', image: 'https://switzerland-tour.com/storage/media/Bern/Aare-River-in-Bern-Switzerland.jpg' },
    { name: 'OTTAWA', country: 'Canada', price: '______ ₸', image: 'https://www.toniagara.com/blog/wp-content/uploads/2023/12/Large-Ottawa-sign-in-street.jpg' },
    { name: 'NEW YORK', country: 'USA', price: '______ ₸', image: 'https://d3e1m60ptf1oym.cloudfront.net/cb14cee6-3c47-470d-aa5a-e79f83cc91c7/AF20131117_New_York_909_xgaplus.jpg' },
    { name: 'BUENOS AIRES', country: 'Argentina', price: '______ ₸', image: 'https://spazio.com.ar/wp-content/uploads/buenos-aires-2.jpg' },
    { name: 'MEXICO CITY', country: 'Mexico', price: '______ ₸', image: 'https://i.natgeofe.com/n/6c02ad5a-977b-4f12-b9c0-02ffb0736e07/metropolitan-cathedral-zocalo-mexico-city.JPG' },
    { name: 'WASHINGTON', country: 'USA', price: '______ ₸', image: 'https://cdn.pixabay.com/photo/2016/08/27/15/57/washington-d-1624419_1280.jpg' },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col font-sans overflow-x-hidden relative">

      {/* ФОН */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, #A7E9F5 0%, #E0F7FA 100%)' }}
      >
        <div className="cloud cloud-1 opacity-50"></div>
        <div className="cloud cloud-2 opacity-40"></div>
        <div className="cloud cloud-3 opacity-30"></div>
        <div className="cloud cloud-4 opacity-20"></div>
      </div>

      {/* HEADER — для неавторизованных */}
      <header className="header-adaptive-padding animate-drop-down relative z-30 animate-drop-down w-full flex justify-between items-center bg-white/40 backdrop-blur-md border-b border-white/20">
        <div className="flex items-center gap-3 select-none cursor-default group">
          <div
            className="relative flex items-center justify-center transition-transform duration-700 group-hover:rotate-[45deg]"
            style={{ width: '34px', height: '34px' }}
          >
            <div className="absolute inset-0 border-[2.5px] border-[#0A4A5E] rounded-full"></div>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M2 12L12 14.5L22 12L12 9.5L2 12Z" fill="white" fillOpacity="0.8" />
              <path d="M12 2L14.5 12L12 22L9.5 12L12 2Z" fill={accentColor} />
              <circle cx="12" cy="12" r="2" fill={oceanColor} />
            </svg>
          </div>
          <span style={{ color: oceanColor, fontSize: '28px', fontFamily: "'DM Serif Display', serif" }}>
            Askyinde
          </span>
        </div>

        <nav className="flex items-center gap-8">
          <Link
            to="/"
            className="no-underline btn-bold-sora text-[14px] px-[26px] py-[9px] rounded-full active:scale-95 custom-transition shadow-sm back-to-login-btn"
            style={{
              color: '#0A4A5E',
              backgroundColor: 'rgba(255, 255, 255, 0.4)',
              fontSize: '14px',
            }}
          >
            Back to Login
          </Link>
        </nav>
      </header>

      {/* MAIN */}
      <main className="animate-rise-up w-full relative z-10 bg-transparent">

        {/* HERO SECTION */}
        <section className="relative w-full h-[400px] flex items-center overflow-hidden mb-[40px]">
          <div className="z-10 max-w-[800px] animate-rise-up pl-[120px] pt-[60px]">
            <h1
              className="text-[63px] font-bold leading-[0.95] mb-6"
              style={{ color: oceanColor, fontFamily: "'DM Serif Display', serif" }}
            >
              EXPLORE THE WORLD
            </h1>
            <p
              className="text-[18px] opacity-90 mb-10 max-w-[550px]"
              style={{ color: oceanColor, lineHeight: '1.6' }}
            >
              Askyinde opens the door to hundreds of airlines and endless possibilities. Start your next adventure today.
            </p>
          </div>
          <div className="absolute right-0 top-0 w-[100%] h-full">
            <img
              src="/hero-plane.png"
              alt="Plane over the city"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/30 to-transparent"></div>
          </div>
        </section>

        {/* CITY CARDS */}
        <section className="px-[48px] pb-[40px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {cities.map((city, index) => (
              <div
                key={index}
                className="group bg-white rounded-[28px] overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer border border-white"
              >
                <div className="h-[140px] overflow-hidden">
                  <img
                    src={city.image}
                    alt={city.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="p-5">
                  <h4 className="text-[20px] font-bold uppercase tracking-tight" style={{ color: oceanColor }}>
                    {city.name}
                  </h4>
                  <p className="text-[18px] opacity-60" style={{ color: oceanColor }}>
                    {city.country}
                  </p>
                  <div className="flex justify-between items-end mt-4">
                    <span className="text-[18px] opacity-40 font-bold italic">Direct</span>
                    <span className="text-[20px] font-black" style={{ color: oceanColor }}>{city.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FIND UNIQUE ROUTES */}
        <section className="relative w-full h-[400px] flex items-center px-[48px] overflow-hidden">
          <img
            src="https://wallpaperaccess.com/full/2181659.jpg"
            alt="Mountains"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ imageRendering: 'crisp-edges', transform: 'translateZ(0)' }}
          />
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]"></div>
          <div className="relative z-10 bg-white/20 backdrop-blur-md rounded-[40px] p-10 border border-white/40 shadow-2xl w-full max-w-[1430px] h-full max-h-[200px] mx-auto">
            <h2
              className="text-[45px] mb-4 leading-tight text-center"
              style={{ color: oceanColor, fontFamily: "'DM Serif Display', serif" }}
            >
              FIND UNIQUE ROUTES
            </h2>
            <p className="text-[22px] leading-relaxed opacity-90 text-center" style={{ color: oceanColor }}>
              Our smart algorithms create unique connection plans, allowing you to discover multiple cities on a single journey. Explore more, pay less.
            </p>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="animate-rise-up relative z-20 w-full bg-white/40 backdrop-blur-md border-t-2 border-white/40 pt-6 pb-4 flex flex-col items-center gap-6">
              
              {/* Юридические ссылки с восстановленными стилями */}
              <div className="flex gap-8">
                 <Link 
                   to="/legal?tab=terms" 
                   className="text-[14px] opacity-60 hover:opacity-100 transition-opacity no-underline btn-bold-sora font-semibold" 
                   style={{ color: oceanColor }}
                 >
                   Terms of Service
                 </Link>
                 <Link 
                   to="/legal?tab=privacy" 
                   className="text-[14px] opacity-60 hover:opacity-100 transition-opacity no-underline btn-bold-sora font-semibold" 
                   style={{ color: oceanColor }}
                 >
                   Privacy Policy
                 </Link>
              </div>
              
              {/* Копирайт */}
              <p className="btn-bold-sora" style={{ color: '#0A4A5E', fontSize: '16px', fontWeight: '600', opacity: '0.9' }}>
                © Askyinde Ltd 2025-2026
              </p>
            </footer>
          </div>
        );
      };

export default ExploreFlights1;