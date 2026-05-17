import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const HelpPage = ({ accentColor, oceanColor, user }) => {
  const [hoveredNav, setHoveredNav] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Проверяем, есть ли юзер и не находимся ли мы уже на странице /flights
  const isLogoClickable = user && location.pathname !== '/flights';

  const handleLogoClick = () => {
    if (isLogoClickable) {
      navigate('/flights'); 
    }
  };

  // Контент с двумя языками: EN и KZ
  const helpContent = [
    {
      title: "About our Service / Қызмет туралы",
      enText: "Askyinde is a modern flight booking platform designed to simplify your travel planning. We provide a seamless interface for searching and booking flights globally, ensuring comfort from the very first click. Our mission is to make international travel accessible, fast, and reliable for every user of our system.",
      kzText: "Askyinde – бұл сіздің саяхатыңызды жоспарлауды жеңілдетуге арналған заманауи авиабилеттерді брондау платформасы. Біз бүкіл әлем бойынша рейстерді іздеу және брондау үшін ыңғайлы интерфейсті ұсынамыз. Біздің мақсатымыз – жүйеміздің әрбір пайдаланушысы үшін халықаралық саяхатты қолжетімді, жылдам және сенімді ету."
    },
    {
      title: "Customer Support / Тұтынушыларды қолдау",
      enText: "Our dedicated support team is available to assist you with any inquiries regarding your flight reservations. Whether you need to change your departure date or clarify baggage allowance, we are here to help. We prioritize effective communication to resolve technical issues quickly and keep your travel plans on track.",
      kzText: "Біздің қолдау көрсету тобымыз авиабилеттерді брондауға қатысты кез келген сұрақтар бойынша көмектесуге дайын. Ұшу күнін өзгерту немесе багаж нормаларын нақтылау қажет болса да, біз көмекке келеміз. Біз техникалық мәселелерді жылдам шешу үшін тиімді байланысқа басымдық береміз."
    },
    {
      title: "Safety and Privacy / Қауіпсіздік және құпиялылық",
      enText: "At Askyinde, we take the security of your personal data and financial transactions very seriously. Using advanced encryption technologies, we ensure that your private information remains protected at all times. Our platform strictly adheres to international data protection standards, providing a safe environment for all your booking needs.",
      kzText: "Askyinde компаниясында біз сіздің жеке деректеріңіз бен қаржылық операцияларыңыздың қауіпсіздігіне өте байыпты қараймыз. Жетілдірілген шифрлау технологияларын пайдалана отырып, біз сіздің жеке ақпаратыңыздың әрдайым қорғалуын қамтамасыз етеміз. Біздің платформа халықаралық деректерді қорғау стандарттарын қатаң сақтайды."
    },
    {
      title: "Destinations and Partners / Бағыттар мен серіктестер",
      enText: "We cooperate with leading global airlines to offer you the widest selection of destinations. From popular tourist cities to remote business hubs, Askyinde connects you with the entire world. Our search engine analyzes thousands of flights to find the most efficient and cost-effective options for your next trip.",
      kzText: "Біз сізге бағыттардың ең кең таңдауын ұсыну үшін әлемдік жетекші әуе компанияларымен ынтымақтасамыз. Танымал туристік қалалардан бастап қашықтағы бизнес орталықтарына дейін Askyinde сізді бүкіл әлеммен байланыстырады. Біздің іздеу жүйеміз тиімді және үнемді нұсқаларды табу үшін мыңдаған рейстерді талдайды."
    }
  ];

  return (
    <div className="min-h-screen w-full flex flex-col font-sans overflow-x-hidden relative">
      
      {/* BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, #A7E9F5 0%, #E0F7FA 100%)' }}>
        <div className="cloud cloud-1 opacity-50"></div>
        <div className="cloud cloud-2 opacity-40"></div>
      </div>

      {/* HEADER */}
      <header className="header-adaptive-padding animate-drop-down relative z-30 w-full flex justify-between items-center bg-white/40 backdrop-blur-md border-b border-white/20">
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
          <Link to="/profile" className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center border border-white/40 cursor-pointer hover:bg-white transition-all shadow-sm no-underline">
            {user?.email ? (
              <span style={{ color: oceanColor, fontWeight: 'bold' }}>{user.email.charAt(0).toUpperCase()}</span>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={oceanColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            )}
          </Link>
        </nav>
      </header>

      {/* MAIN CONTENT */}
      <main className="animate-rise-up flex-1 relative z-20 flex flex-col items-center py-16 px-6">
        {/* Увеличили max-w с 1100px до 1400px, чтобы занять больше места по бокам */}
        <div className="w-full max-w-[1400px] text-center">
          
          <div className="mb-12 animate-in fade-in slide-in-from-top duration-700">
             <h1 
  className="mb-4" 
  style={{ 
    color: oceanColor, 
    fontFamily: "'DM Serif Display', serif", 
    fontSize: 'clamp(32px, 5vw, 56px)',
    lineHeight: '1.2' 
  }}
>
  {/* Английский текст — вес 500 */}
  <span style={{ fontWeight: 500 }}>
    Welcome to Help Center
  </span> 
  
  <br />
  
  {/* Казахский текст — вес 700 для компенсации шрифта */}
  <span style={{ fontWeight: 700 }}>
    Анықтама Орталығына қош келдіңіз
  </span>
</h1>
             
             <p className="text-[18px] opacity-70 hero-description" style={{ color: oceanColor, lineHeight: '1.6' }}>
  {/* Английская версия — оставляем без изменений (стандартный вес) */}
  <span style={{ fontWeight: 600 }}>
    Everything you need to know about our service and policies.
  </span>
  
  <br />
  
  {/* Казахская версия — увеличиваем вес до 500 для лучшей читаемости */}
  <span style={{ fontWeight: 600 }}>
    Біздің қызметіміз бен саясатымыз туралы білуіңіз керек барлық нәрсе.
  </span>
</p>
          </div>

          {/* Увеличили gap (отступ между карточками) до 10 для большего "воздуха" */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {helpContent.map((item, index) => (
              <div 
                key={index}
                className="p-10 bg-white/50 backdrop-blur-md rounded-[40px] border border-white/40 shadow-xl flex flex-col text-left transition-all duration-300 hover:bg-white/70 hover:shadow-2xl"
              >
                <h3 className="text-[24px] mb-6 font-bold btn-bold-sora border-b border-white/30 pb-4" style={{ color: oceanColor }}>
                  {item.title}
                </h3>
                
                <div className="mb-8">
                  <span className="text-[12px] font-bold px-3 py-1 rounded-full bg-white/40 mb-3 inline-block" style={{ color: accentColor }}>EN</span>
                  <p className="text-[16px] leading-[1.8] opacity-80 hero-description" style={{ color: oceanColor }}>
                    {item.enText}
                  </p>
                </div>

                <div>
                  <span className="text-[12px] font-bold px-3 py-1 rounded-full bg-white/40 mb-3 inline-block" style={{ color: accentColor }}>KZ</span>
                  <p className="text-[16px] leading-[1.8] opacity-80 hero-description" style={{ color: oceanColor }}>
                    {item.kzText}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* 4. FOOTER */}
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

export default HelpPage;