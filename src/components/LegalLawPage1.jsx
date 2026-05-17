import React, { useState, useEffect } from 'react';
// 1. Добавляем useNavigate в импорт
import { Link, useLocation, useNavigate } from 'react-router-dom';

const LegalLawPage1 = ({ accentColor, oceanColor, user }) => {
  const location = useLocation();
  // 2. Инициализируем навигацию
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('terms');
  
  const [language, setLanguage] = useState('en'); // по умолчанию английский

  const glassCardClass = "bg-white/45 backdrop-blur-md p-6 rounded-[32px] border border-white/60 shadow-sm hover:shadow-md transition-all duration-300";

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab === 'privacy') setActiveTab('privacy');
    if (tab === 'terms') setActiveTab('terms');
  }, [location]);

  return (
    <div className="min-h-screen w-full flex flex-col font-sans overflow-x-hidden relative">
      
      {/* BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, #A7E9F5 0%, #E0F7FA 100%)' }}>
        <div className="cloud cloud-1 opacity-50"></div>
      </div>

      {/* HEADER */}
      <header className="header-adaptive-padding animate-drop-down relative z-30 w-full flex justify-between items-center bg-white/40 backdrop-blur-md border-b border-white/20">
        <div className="flex items-center gap-3 select-none cursor-default group">
        <div className="relative flex items-center justify-center transition-transform duration-700 group-hover:rotate-[45deg]" style={{ width: '34px', height: '34px' }}>
        <div className="absolute inset-0 border-[2.5px] border-[#0A4A5E] rounded-full"></div>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        {/* Горизонтальная линия (белая) */}
        <path d="M2 12L12 14.5L22 12L12 9.5L2 12Z" fill="white" fillOpacity="0.8" />
      
        {/* Вертикальная стрелка (акцентный цвет) */}
        <path d="M12 2L14.5 12L12 22L9.5 12L12 2Z" fill={accentColor} />
      
        {/* Центр компаса */}
        <circle cx="12" cy="12" r="2" fill={oceanColor} />
        </svg>
        </div>
        <span style={{ color: oceanColor, fontSize: '28px', fontFamily: "'DM Serif Display', serif" }}>Askyinde</span>
        </div>

        <nav className="flex items-center gap-8">
          {user?.email ? (
            <>
              <Link to="/flights" className="no-underline btn-bold-sora text-[14px]" style={{ color: oceanColor }}>Flights</Link>
              <Link to="/profile" className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center border border-white/40 no-underline">
                <span style={{ color: oceanColor, fontWeight: 'bold' }}>{user.email.charAt(0).toUpperCase()}</span>
              </Link>
            </>
          ) : (
            <Link
  to="/"
  className="no-underline btn-bold-sora text-[14px] px-[26px] py-[9px] rounded-full active:scale-95 custom-transition shadow-sm back-to-login-btn"
  style={{
    color:           '#0A4A5E',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    fontSize:        '14px',
  }}
>
  Back to Login
</Link>
          )}
        </nav>
      </header>

      {/* MAIN */}
      <main className="animate-rise-up flex-1 relative z-20 flex flex-col items-center py-16 px-6">
        <div className="w-full max-w-[1000px]">
          
          {/* TABS CONTROLLER с эффектом скользящего тумблера */}
<div className="relative flex gap-2 mb-10 p-1.5 bg-white/30 backdrop-blur-md rounded-[24px] border border-white/40 w-fit mx-auto shadow-sm overflow-hidden">
  
  {/* Бегунок (тот самый тумблер) */}
  <div 
    className="absolute top-1.5 bottom-1.5 left-1.5 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] bg-white rounded-[20px] shadow-sm"
    style={{ 
      /* Ширина бегунка чуть меньше половины (с учетом gap и padding) */
      width: 'calc(50% - 10px)',
      /* Перемещение бегунка в зависимости от активной вкладки */
      transform: activeTab === 'terms' ? 'translateX(0)' : 'translateX(100%)',
      /* Дополнительный сдвиг для точности при переезде вправо */
      marginLeft: activeTab === 'privacy' ? '8px' : '0'
    }}
  />

  <button 
    onClick={() => {
      setActiveTab('terms');
      navigate('/legal-guest?tab=terms'); 
    }}
    className="relative z-10 px-10 py-3 rounded-[18px] transition-opacity duration-300 btn-bold-sora text-[15px] font-bold"
    style={{ 
      color: oceanColor, 
      opacity: activeTab === 'terms' ? 1 : 0.6 
    }}
  >
    Terms of Service
  </button>

  <button 
    onClick={() => {
      setActiveTab('privacy');
      navigate('/legal-guest?tab=privacy');
    }}
    className="relative z-10 px-10 py-3 rounded-[18px] transition-opacity duration-300 btn-bold-sora text-[15px] font-bold"
    style={{ 
      color: oceanColor, 
      opacity: activeTab === 'privacy' ? 1 : 0.6 
    }}
  >
    Privacy Policy
  </button>
</div>

          {/* DOCUMENT CONTENT */}
          {/* DOCUMENT CONTENT — карточка теперь подстраивается под высоту текста */}
<div className="p-12 bg-white/60 backdrop-blur-md rounded-[48px] border border-white/60 shadow-2xl text-left transition-all duration-500 w-full max-w-[1000px] mx-auto">
  
  {/* Language Switcher */}
  <div className="flex justify-end mb-10">
    <div className="relative flex p-1 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 w-fit shadow-inner">
      <div 
        className="absolute top-1 bottom-1 left-1 transition-all duration-300 ease-out bg-white/80 rounded-lg shadow-sm"
        style={{ 
          width: '45px',
          transform: language === 'en' ? 'translateX(0)' : 'translateX(49px)'
        }}
      />
      <button 
        onClick={() => setLanguage('en')}
        className={`relative z-10 w-11 h-8 flex items-center justify-center text-[12px] font-bold transition-colors ${language === 'en' ? 'text-[#0A4A5E]' : 'opacity-40'}`}
      >
        EN
      </button>
      <button 
        onClick={() => setLanguage('kz')}
        className={`relative z-10 w-11 h-8 flex items-center justify-center text-[12px] font-bold transition-colors ${language === 'kz' ? 'text-[#0A4A5E]' : 'opacity-40'}`}
      >
        KZ
      </button>
    </div>
  </div>

  <div key={`${activeTab}-${language}`} className="animate-in fade-in slide-in-from-bottom-3 duration-700 ease-out">
    
    {activeTab === 'terms' ? (
      // --- TERMS OF SERVICE ---
      <div className="space-y-8 hero-description text-[15px] leading-[1.8]" style={{ color: oceanColor }}>
        <p className="opacity-50 text-[12px] mb-2">{language === 'en' ? 'Last Updated: April 2026' : 'Соңғы жаңарту: Сәуір 2026'}</p>
        <h2 
  className="text-[36px] mb-10" 
  style={{ 
    color: oceanColor, 
    fontFamily: "'DM Serif Display', serif",
    // Применяем аналогичный баланс веса: 500 для латиницы и 700 для кириллицы
    fontWeight: language === 'en' ? 500 : 700 
  }}
>
  {language === 'en' ? 'Terms of Service' : 'Пайдалану шарттары'}
</h2>

        <section>
          <h3 className="text-[20px] font-bold mb-4">{language === 'en' ? 'Who are we?' : 'Біз кімбіз?'}</h3>
          <p className="opacity-95">
            {language === 'en' 
              ? 'Askyinde ("we", "Our" or "US") provides online search services (including air ticket price comparison) and other accompanying travel services (hereinafter "services") to travelers around the world through our website and other interfaces (hereinafter "platforms"). Askyinde is not a travel agency and is not responsible for pricing, monitoring or offering any travel options or products that you find and book through our services ("Third party products").' 
              : 'Askyinde («біз», «біздің» немесе «бізді») біздің веб-сайтымыз және басқа интерфейстер (бұдан әрі — «Платформалар») арқылы бүкіл әлем бойынша саяхатшыларға онлайн іздеу қызметтерін (соның ішінде әуе билеттерінің бағасын салыстыру) және басқа да ілеспе туристік қызметтерді ұсынады. Askyinde туристік агенттік болып табылмайды және біздің Қызметтеріміз арқылы табатын кез келген сапар нұсқаларына немесе өнімдеріне баға белгілеуге жауапты емес.'}
          </p>
        </section>

        <section>
          <h3 className="text-[20px] font-bold mb-4">{language === 'en' ? 'These Terms' : 'Осы Шарттар'}</h3>
          <p className="opacity-95">
            {language === 'en'
              ? 'These terms ("Terms"), along with our Privacy Policy, govern your access to and use of our services and platforms. By using the platform, you confirm that you have read and agree to these terms in full. We may change these terms at any time at our discretion.'
              : 'Осы ережелер («Шарттар») біздің құпиялылық саясатымызбен бірге біздің Қызметтеріміз бен Платформаларымызға кіруіңізді және оларды пайдалануыңызды реттейді. Платформаны пайдалана отырып, сіз осы Шарттарды толық оқып шыққаныңызды және олармен келісетініңізді растайсыз.'}
          </p>
        </section>

        <section>
          <h3 className="text-[20px] font-bold mb-4">{language === 'en' ? 'Use of our services' : 'Қызметтерімізді пайдалану'}</h3>
          <p className="mb-4">{language === 'en' ? 'You may use our services only for legal purposes. You undertake not to:' : 'Сіз біздің Қызметтерімізді тек заңды мақсаттарда пайдалана аласыз. Келесі әрекеттерді орындамауға міндеттенесіз:'}</p>
          <ul className="list-decimal pl-6 space-y-3 opacity-95">
            {language === 'en' ? (
              <>
                <li>Use the platform to distribute any illegal, harmful or offensive content;</li>
                <li>Copy software, extract its source code, or attempt to hack security systems;</li>
                <li>Use automated systems (bots, spiders) to collect data or index content;</li>
                <li>Make false statements about contact with the Askyinde administration;</li>
                <li>Remove or modify any copyright notices, logos or trademarks.</li>
              </>
            ) : (
              <>
                <li>Платформаны кез келген заңсыз, зиянды немесе қорлаушы мазмұнды тарату үшін пайдалану;</li>
                <li>Бағдарламалық жасақтаманы көшіру, бастапқы кодын алу немесе қауіпсіздік жүйелерін бұзу;</li>
                <li>Деректерді жинау немесе индекстеу үшін автоматтандырылған жүйелерді пайдалану;</li>
                <li>Askyinde әкімшілігімен байланысыңыз бар деп жалған мәлімдеме жасау;</li>
                <li>Авторлық құқық туралы ескертулерді, логотиптерді немесе тауар белгілерін жою.</li>
              </>
            )}
          </ul>
        </section>

        <section>
          <h3 className="text-[20px] font-bold mb-4">{language === 'en' ? 'Intellectual property' : 'Зияткерлік меншік'}</h3>
          <p className="opacity-95">
            {language === 'en'
              ? 'All intellectual property rights, including interface design, software code, search algorithms, and the Askyinde trademark, belong to us or our licensors.'
              : 'Зияткерлік меншікке қатысты барлық құқықтар, соның ішінде интерфейс дизайны, бағдарламалық код, іздеу алгоритмдері және Askyinde тауар белгісі бізге тиесілі.'}
          </p>
        </section>

        <section>
          <h3 className="text-[20px] font-bold mb-4">{language === 'en' ? 'Limitation of liability' : 'Жауапкершілікті шектеу'}</h3>
          <p className="opacity-95">
            {language === 'en'
              ? 'Our maximum aggregate liability to you is limited to an amount of £100 (or equivalent in your currency).'
              : 'Біздің сіздің алдыңыздағы максималды жиынтық жауапкершілігіміз 100 фунт стерлинг (немесе сіздің валютаңыздағы баламасы) мөлшеріндегі сомамен шектеледі.'}
          </p>
        </section>
      </div>
    ) : (
      /* --- PRIVACY POLICY CONTENT --- */
      
<div className="space-y-6 text-[15px] leading-[1.8]" style={{ color: oceanColor }}>
  
  <p className="opacity-50 text-[12px] mb-2">
    {language === 'en' ? 'Effective: April 2026' : 'Күшіне енуі: Сәуір 2026'}
  </p>
  
  <h2 
  className="text-[36px] mb-10" 
  style={{ 
    color: oceanColor, 
    fontFamily: "'DM Serif Display', serif",
    // Устанавливаем 500 для английского и 700 для казахского для визуального баланса
    fontWeight: language === 'en' ? 500 : 700 
  }}
>
  {language === 'en' ? 'Privacy Policy' : 'Құпиялылық саясаты'}
</h2>

  {/* Section 1: About - Выделенная карточка */}
  <section className={glassCardClass}>
    <h3 className="text-[20px] font-bold mb-4">
      {language === 'en' ? 'About this policy' : 'Осы саясат туралы'}
    </h3>
    <p className="opacity-95">
      {language === 'en' 
        ? 'This policy describes how Askyinde collects and processes your personal data when you use our Platforms. We value your trust and ensure that your information is kept secure and confidential.' 
        : 'Бұл саясат сіз біздің Платформаларымызды пайдаланған кезде Askyinde сіздің жеке деректеріңізді қалай жинайтынын және өңдейтінін сипаттайды. Біз сіздің сеніміңізді бағалаймыз және ақпаратыңыздың қауіпсіздігін қамтамасыз етеміз.'}
    </p>
  </section>

  {/* Section 2: Data Collection - Обычный текст */}
  <section className="px-4">
    <h3 className="text-[20px] font-bold mb-4">
      {language === 'en' ? 'What personal data do we collect?' : 'Біз қандай жеке деректерді жинаймыз?'}
    </h3>
    <p className="mb-4 opacity-90">
      {language === 'en' 
        ? 'We collect information that you provide to us directly, such as:' 
        : 'Біз сіз тікелей ұсынатын ақпаратты жинаймыз, мысалы:'}
    </p>
    <ul className="list-disc pl-6 space-y-3 opacity-95">
      {language === 'en' ? (
        <>
          <li><strong>Identity Data:</strong> Name and email provided via Google authentication.</li>
          <li><strong>Search Data:</strong> Travel dates, destinations, and preferences.</li>
          <li><strong>Technical Data:</strong> IP address, browser type, and device information.</li>
        </>
      ) : (
        <>
          <li><strong>Сәйкестендіру деректері:</strong> Google аутентификациясы арқылы берілген аты-жөніңіз бен email.</li>
          <li><strong>Іздеу деректері:</strong> Сапар күндері, бағыттар және таңдаулы баптаулар.</li>
          <li><strong>Техникалық деректер:</strong> IP-мекенжайы, браузер түрі және құрылғы туралы ақпарат.</li>
        </>
      )}
    </ul>
  </section>

  {/* Section 3: Data Sharing - Выделенная карточка */}
  <section className={glassCardClass}>
    <h3 className="text-[20px] font-bold mb-4">
      {language === 'en' ? 'When is your data shared with Third Parties?' : 'Деректер қашан үшінші тұлғалармен бөлісіледі?'}
    </h3>
    <p className="opacity-95">
      {language === 'en'
        ? 'We share your data with Travel Providers (airlines, hotels) only to complete the booking you have requested. We do not sell your personal data to third-party advertisers.'
        : 'Біз сіздің деректеріңізді тек сіз сұраған брондауды аяқтау үшін Қызмет көрсетушілермен (әуе компаниялары, қонақ үйлер) бөлісеміз. Біз сіздің жеке деректеріңізді үшінші тарап жарнама берушілеріне сатпаймыз.'}
    </p>
  </section>

  {/* Section 4: Security - Обычный текст */}
  <section className="px-4">
    <h3 className="text-[20px] font-bold mb-4">
      {language === 'en' ? 'How do we keep data secure?' : 'Деректерді қалай қауіпсіз сақтаймыз?'}
    </h3>
    <p className="opacity-95">
      {language === 'en'
        ? 'We implement industry-standard encryption (SSL) and security protocols to protect your data from unauthorized access, loss, or disclosure.'
        : 'Біз сіздің деректеріңізді рұқсатсыз кіруден немесе жариялаудан қорғау үшін салалық стандартты шифрлауды (SSL) және қауіпсіздік хаттамаларын қолданамыз.'}
    </p>
  </section>

  {/* Section 5: Contact - Финальный блок */}
  <section className="px-4 border-t border-white/20">
    <h3 className="text-[20px] font-bold mb-4">
      {language === 'en' ? 'Contact us' : 'Бізбен байланысу'}
    </h3>
    <p className="opacity-90 italic leading-relaxed">
      {language === 'en' ? (
      <>
        If you have questions about this policy, please contact us at: <u>support@askyinde.com</u> and contact numbers: for Kazakhstan <u>+7(705)342-85-88</u>, for Uzbekistan <u>+998(99)087-85-66</u>
      </>
    ) : (
      <>
        Осы саясат бойынша сұрақтарыңыз болса, бізге хабарласыңыз: <u>support@askyinde.com</u> және байланыс телефондары: Қазақстан үшін <u>+7(705)342-85-88</u>, Өзбекстан үшін <u>+998(99)087-85-66</u>
      </>
)}
    </p>
  </section>
</div>
    )}
  </div>
</div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="animate-rise-up relative z-20 w-full bg-white/40 backdrop-blur-md border-t-2 border-white/40 py-6 text-center">
        <p className="btn-bold-sora" style={{ color: '#0A4A5E', fontSize: '16px', fontWeight: '600' }}>
          © Askyinde Ltd 2025-2026</p>
      </footer>
    </div>
  );
};

export default LegalLawPage1;