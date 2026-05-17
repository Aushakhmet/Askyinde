import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';

// ✅ FooterColumn — ОДНА версия, СНАРУЖИ компонента, с аккордеоном
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

const ExploreFlights = ({ user, accentColor, oceanColor }) => {
  const [hoveredNav, setHoveredNav] = useState(null);
  const [emailInput, setEmailInput] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: 'Flights', path: '/flights' },
    { name: 'My trips', path: '/profile', onClick: () => localStorage.setItem("profileTab", "alerts") },
    { name: 'Help', path: '/help' }
  ];

  const isAuth = Boolean(user?.email);

  const isLogoClickable = isAuth && location.pathname !== '/flights';

  const handleLogoClick = () => {
  if (isLogoClickable) navigate('/flights');
};

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

      {/* HEADER */}
      <header className="header-adaptive-padding animate-drop-down relative z-30 w-full flex justify-between items-center bg-white/60 backdrop-blur-md border-b border-white/20">
        <div
          onClick={handleLogoClick}
          className={`flex items-center gap-3 group no-underline select-none w-max ${
            isLogoClickable ? 'cursor-pointer' : 'cursor-default'
          }`}
        >
          <div
            className="relative flex items-center justify-center transition-transform duration-700 group-hover:rotate-[45deg]"
            style={{ width: '34px', height: '34px' }}
          >
            <div className="absolute inset-0 border-[2.5px] border-[#0A4A5E] rounded-full"></div>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L14.5 12L12 22L9.5 12L12 2Z" fill={accentColor} />
              <path d="M2 12L12 9.5L22 12L12 14.5L2 12Z" fill="white" />
              <circle cx="12" cy="12" r="2" fill={oceanColor} />
            </svg>
          </div>
          <span style={{ color: oceanColor, fontSize: '28px', fontFamily: "'DM Serif Display', serif" }}>
            Askyinde
          </span>
        </div>

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

      {/* MAIN */}
      <main className="w-full relative z-10 bg-transparent">

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
      <footer className="animate-rise-up relative z-20 w-full bg-white/40 backdrop-blur-md border-t border-white/20 pt-[40px] pb-[20px] px-[160px]">
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-8 text-left">

            {/* Logo */}
            <div className="md:col-span-2 lg:col-span-3 flex flex-col gap-4">
              <div className="flex items-center gap-3 select-none cursor-default w-max">
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
              <p className="text-[14px] leading-relaxed opacity-80 hero-description max-w-[250px]" style={{ color: oceanColor }}>
                Your reliable assistant <br className="hidden lg:block" /> in the world of travel
              </p>
            </div>

            {/* Company */}
            <div className="col-span-1 lg:col-span-2">
              <FooterColumn title="Company" oceanColor={oceanColor}>
                <li><Link to="/legal" className="cursor-pointer opacity-70 hover:opacity-100 transition-opacity no-underline" style={{ color: oceanColor }}>About us</Link></li>
                <li><Link to="/legal" className="cursor-pointer opacity-70 hover:opacity-100 transition-opacity no-underline" style={{ color: oceanColor }}>Why Askyinde</Link></li>
                <li><Link to="/legal" className="cursor-pointer opacity-70 hover:opacity-100 transition-opacity no-underline" style={{ color: oceanColor }}>Contacts</Link></li>
                <li><Link to="/legal" className="cursor-pointer opacity-70 hover:opacity-100 transition-opacity no-underline" style={{ color: oceanColor }}>Safety</Link></li>
              </FooterColumn>
            </div>

            {/* Useful */}
            <div className="col-span-1 lg:col-span-2">
              <FooterColumn title="Useful" oceanColor={oceanColor}>
                <li><Link to="/explore-flights" className="cursor-pointer opacity-70 hover:opacity-100 transition-opacity no-underline" style={{ color: oceanColor }}>Popular destinations</Link></li>
                <li><Link to="/explore-flights" className="cursor-pointer opacity-70 hover:opacity-100 transition-opacity no-underline" style={{ color: oceanColor }}>Airlines</Link></li>
                <li><Link to="/explore-flights" className="cursor-pointer opacity-70 hover:opacity-100 transition-opacity no-underline" style={{ color: oceanColor }}>Branches</Link></li>
              </FooterColumn>
            </div>

            {/* Help */}
            <div className="col-span-1 lg:col-span-2">
              <FooterColumn title="Help" oceanColor={oceanColor}>
                <li><Link to="/help" className="cursor-pointer opacity-70 hover:opacity-100 transition-opacity no-underline" style={{ color: oceanColor }}>Support Center</Link></li>
                <li><Link to="/help" className="cursor-pointer opacity-70 hover:opacity-100 transition-opacity no-underline" style={{ color: oceanColor }}>Terms & Conditions</Link></li>
              </FooterColumn>
            </div>

            {/* Newsletter */}
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
                  onClick={() => { if (emailInput) { setIsSubscribed(true); setEmailInput(""); } }}
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

          <div className="mt-8 text-center border-t border-white/20 pt-4">
            <p className="btn-bold-sora" style={{ color: '#0A4A5E', fontSize: '14px', fontWeight: '600', opacity: '0.9' }}>
              © Askyinde Ltd 2025-2026
            </p>
          </div>
        </div>
      </footer>

      {/* SUBSCRIPTION SUCCESS MODAL */}
      {isSubscribed && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0A4A5E]/20 backdrop-blur-sm" onClick={() => setIsSubscribed(false)}></div>
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

    </div>
  );
};

export default ExploreFlights;