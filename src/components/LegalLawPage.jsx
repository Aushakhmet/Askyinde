import React, { useState, useEffect } from 'react';
// 1. Добавляем useNavigate в импорт
import { Link, useLocation, useNavigate } from 'react-router-dom';

const LegalLawPage = ({ accentColor, oceanColor, user }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Проверяем, есть ли юзер и не находимся ли мы уже на странице /flights
  const isLogoClickable = user && location.pathname !== '/flights';

  const handleLogoClick = () => {
    if (isLogoClickable) {
      navigate('/flights'); 
    }
  };

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
  
  {/* ВОТ ЗДЕСЬ ДОБАВЛЕН onClick И ДИНАМИЧЕСКИЙ КЛАСС ДЛЯ КУРСОРА */}
  <div 
    onClick={handleLogoClick} 
    className={`flex items-center gap-3 select-none group w-max ${isLogoClickable ? 'cursor-pointer' : 'cursor-default'}`}
  >
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
            <Link to="/" className="no-underline btn-bold-sora text-[14px] px-5 py-2 bg-white/50 rounded-2xl border border-white/40" style={{ color: oceanColor }}>Back to Login</Link>
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
      navigate('/legal?tab=terms');
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
      navigate('/legal?tab=privacy');
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
        
        <section className={glassCardClass}>
          <h3 className="text-[20px] font-bold mb-4">{language === 'en' ? '1. Who are we?' : '1. Біз кімбіз?'}</h3>
          <p className="opacity-95">
            {language === 'en' 
              ? 'Askyinde ("we", "Our" or "US") provides online search services (including air ticket price comparison) and other accompanying travel services (hereinafter "services") to travelers around the world through our website and other interfaces (hereinafter "platforms"). Askyinde is not a travel agency and is not responsible for pricing, monitoring or offering any travel options or products that you find and book through our services ("Third party products").' 
              : 'Askyinde («біз», «біздің» немесе «бізді») біздің веб-сайтымыз және басқа интерфейстер (бұдан әрі — «Платформалар») арқылы бүкіл әлем бойынша саяхатшыларға онлайн іздеу қызметтерін (соның ішінде әуе билеттерінің бағасын салыстыру) және басқа да ілеспе туристік қызметтерді ұсынады. Askyinde туристік агенттік болып табылмайды және біздің Қызметтеріміз арқылы табатын кез келген сапар нұсқаларына немесе өнімдеріне баға белгілеуге жауапты емес.'}
          </p>
        </section>

        <section className="px-4">
  <h3 className="text-[20px] font-bold mb-4">
    {language === 'en' ? '1.1. Introduction' : '1.1. Кіріспе бөлігі'}
  </h3>
  <p className="opacity-95">
    {language === 'en' 
      ? <>
          Askyinde is a partner-based aviation booking platform operating as an intermediary technology system that connects passengers with airline carriers and third-party travel service providers. The platform does not function as an airline operator and does not own, manage, or control aircraft, flight operations, or aviation services. Its role is strictly limited to providing a digital infrastructure for search, booking, and transaction coordination across multiple partners.
          <br /><br />
          By using Askyinde, users acknowledge that the platform serves only as a facilitator of travel-related services. All flight operations, schedules, and transport responsibilities are fully handled by independent airline partners, while Askyinde ensures the technological environment for efficient interaction between users and providers.
        </>
      : <>
          Askyinde-жолаушыларды авиакомпаниялармен және үшінші тарап туристік провайдерлерімен байланыстыратын делдалдық технологиялық жүйе ретінде жұмыс істейтін серіктес авиациялық брондау платформасы. Платформа авиакомпания операторы ретінде жұмыс істемейді және әуе кемелеріне, ұшу операцияларына немесе авиациялық қызметтерге иелік етпейді, басқармайды немесе басқармайды. Оның рөлі бірнеше серіктестер арасында іздеу, брондау және транзакцияларды үйлестіру үшін цифрлық инфрақұрылымды қамтамасыз етумен қатаң шектеледі.
          <br /><br />
          Askyinde-ді қолдана отырып, пайдаланушылар платформа тек саяхатқа байланысты қызметтердің фасилитаторы ретінде қызмет ететінін мойындайды. Барлық рейстерді, кестелерді және көлік міндеттерін авиакомпанияның тәуелсіз серіктестері толығымен орындайды, АЛ Askyinde пайдаланушылар мен жеткізушілер арасындағы тиімді өзара әрекеттесу үшін технологиялық ортаны қамтамасыз етеді.
        </>
    }
  </p>
</section>

        <section className="px-4">
  <h3 className="text-[20px] font-bold mb-4">
    {language === 'en' ? '2. Services Overview' : '2. Біз кімбіз?'}
  </h3>
  <p className="opacity-95">
    {language === 'en' 
      ? <>
          Askyinde provides a comprehensive flight search system that aggregates available routes, prices, and schedules from multiple airline partners into a unified interface. Users can compare flight options, select preferred routes, and initiate booking requests through an integrated system designed to simplify travel planning and ticket acquisition.
          <br /><br />
          Once a booking request is submitted, ticket issuance, seat confirmation, baggage rules, and flight execution are managed exclusively by airline partners. Askyinde does not alter or guarantee flight availability but acts as a communication bridge between users and carriers. The platform also supports automated coordination of booking data, ensuring that user requests are transmitted securely and efficiently to relevant service providers.
        </>
      : <>
          Askyinde авиакомпанияның бірнеше серіктестерінің қол жетімді маршруттарын, бағалары мен кестелерін бірыңғай интерфейске біріктіретін рейстерді іздеудің кешенді жүйесін ұсынады. Пайдаланушылар ұшу опцияларын салыстыра алады, қалаған маршруттарды таңдай алады және саяхатты жоспарлауды және билеттерді сатып алуды жеңілдетуге арналған біріктірілген жүйе арқылы брондау сұрауларын бастай алады.
          <br /><br />
          Брондау туралы өтініш берілгеннен кейін билеттерді беру, орындарды растау, багаж ережелерін сақтау және рейстерді орындауды тек авиакомпания серіктестері жүзеге асырады. Askyinde рейстердің қолжетімділігін өзгертпейді немесе кепілдік бермейді, бірақ пайдаланушылар мен тасымалдаушылар арасындағы байланыс көпірі ретінде әрекет етеді. Платформа сонымен қатар брондау деректерін автоматтандырылған үйлестіруді қолдайды, бұл пайдаланушы сұрауларының тиісті қызмет провайдерлеріне қауіпсіз және тиімді жіберілуін қамтамасыз етеді.
        </>
    }
  </p>
</section>

<section className="px-4">
  <h3 className="text-[20px] font-bold mb-4">
    {language === 'en' ? '3. Pricing & IATA-Inspired Logic' : '3. Баға Және IATA Шабыттандырған Логика'}
  </h3>
  <p className="opacity-95">
    {language === 'en' 
      ? <>
          Askyinde applies a dynamic pricing structure that reflects real-time airline availability, demand fluctuations, seasonal changes, and carrier-specific fare rules. Ticket prices displayed on the platform may vary continuously depending on seat inventory, booking timing, and external market conditions determined by airline partners.
          <br /><br />
          Certain pricing structures and ticket-related charges may follow industry practices associated with airline and IATA fare systems. Taxes, airport fees, and additional surcharges are determined by airlines, airports, and applicable aviation authorities. The IATA-inspired pricing logic is used strictly as an industry reference model to ensure realism and consistency within the booking environment, and it does not represent a legal or regulatory dependency on IATA itself.
        </>
      : <>
          Askyinde авиакомпаниялардың нақты уақыттағы қолжетімділігін, сұраныстың ауытқуын, маусымдық өзгерістерді және тасымалдаушыға тән тариф ережелерін көрсететін динамикалық баға құрылымын қолданады. Платформада көрсетілетін билеттердің бағасы орындардың тізімдемесіне, брондау мерзіміне және авиакомпания серіктестері анықтаған сыртқы нарық жағдайларына байланысты үнемі өзгеріп отыруы мүмкін.
          <br /><br />
          Билеттерге байланысты белгілі бір баға құрылымдары мен алымдар авиакомпаниялар мен IATA тарифтік жүйелеріне қатысты салалық тәжірибеге сәйкес келуі мүмкін. Салықтарды, әуежай төлемдерін және қосымша төлемдерді авиакомпаниялар, әуежайлар және қолданыстағы авиация органдары анықтайды. IATA шабыттандырған баға логикасы брондау ортасында шынайылық пен дәйектілікті қамтамасыз ету үшін салалық анықтамалық үлгі ретінде қатаң түрде пайдаланылады және ОЛ IATA-ның өзіне заңды немесе реттеуші тәуелділікті білдірмейді.
        </>
    }
  </p>
</section>

        <section className="px-4"> 
  <h3 className="text-[20px] font-bold mb-4">
    {language === 'en' ? '4. Payments & Security' : '4. Төлемдер & Қауіпсіздік'}
  </h3>
  <p className="opacity-95">
    {language === 'en' 
      ? <>
          All payments within Askyinde are processed exclusively through external payment service providers that comply with PCI DSS-inspired security standards. The platform does not directly handle or store full card details, banking credentials, or sensitive authentication data on its internal systems. Instead, encrypted payment gateways and tokenization methods are used to ensure that financial information is securely transmitted and processed by certified third-party processors.
          <br /><br />
          Fraud prevention, transaction validation, and risk monitoring are handled through integrated security mechanisms provided by payment partners. These systems may include real-time fraud detection, encryption protocols, and authorization checks to protect users from unauthorized activity. ASKYINDE acts only as a technical interface between the user and payment provider, ensuring secure routing of transaction data without retaining sensitive financial information.
        </>
      : <>
          Askyinde авиакомпаниялардың нақты уақыттағы қолжетімділігін, сұраныстың ауытқуын, маусымдық өзгерістерді және тасымалдаушыға тән тариф ережелерін көрсететін динамикалық баға құрылымын қолданады. Платформада көрсетілетін билеттердің бағасы орындардың тізімдемесіне, брондау мерзіміне және авиакомпания серіктестері анықтаған сыртқы нарық жағдайларына байланысты үнемі өзгеріп отыруы мүмкін.
          <br /><br />
          Билеттерге байланысты белгілі бір баға құрылымдары мен алымдар авиакомпаниялар мен IATA тарифтік жүйелеріне қатысты салалық тәжірибеге сәйкес келуі мүмкін. Салықтарды, әуежай төлемдерін және қосымша төлемдерді авиакомпаниялар, әуежайлар және қолданыстағы авиация органдары анықтайды. IATA шабыттандырған баға логикасы брондау ортасында шынайылық пен дәйектілікті қамтамасыз ету үшін салалық анықтамалық үлгі ретінде қатаң түрде пайдаланылады және ОЛ IATA-ның өзіне заңды немесе реттеуші тәуелділікті білдірмейді.
        </>
    }
  </p>
</section>
        <section className="px-4">
  <h3 className="text-[20px] font-bold mb-4">
    {language === 'en' ? '5. User Responsibility' : '5. Пайдаланушының жауапкершілігі'}
  </h3>
  <p className="mb-4">
    {language === 'en' 
      ? 'Users are fully responsible for the accuracy of all personal, travel, and payment information provided during booking and account creation. Any incorrect data may affect booking confirmation, ticket issuance, or travel validity. Users must ensure that their account credentials remain confidential and secure at all times to prevent unauthorized access.'
      : 'Пайдаланушылар брондау және есептік жазбаны құру кезінде берілген барлық жеке, жол жүру және төлем ақпаратының дұрыстығына толық жауап береді. Кез келген қате деректер брондауды растауға, билет беруге немесе сапардың жарамдылығына әсер етуі мүмкін. Пайдаланушылар рұқсатсыз кіруді болдырмау үшін есептік жазбасының тіркелгі деректерінің әрқашан құпия және қауіпсіз болуын қамтамасыз етуі керек.'}
  </p>
  <p className="mb-4 font-bold">
    {language === 'en' ? 'User responsibilities include:' : 'Пайдаланушының міндеттері:'}
  </p>
  <ul className="list-disc pl-6 space-y-3 opacity-95 mb-4">
    {language === 'en' ? (
      <>
        <li>Providing accurate passenger and booking information</li>
        <li>Maintaining secure login credentials and account access</li>
        <li>Using the platform only for lawful travel and booking purposes</li>
        <li>Ensuring payment details entered via external gateways are correct and valid</li>
      </>
    ) : (
      <>
        <li>Жолаушылар мен брондау туралы дұрыс ақпарат беру</li>
        <li>Кіру деректері мен тіркелуге қауіпсіз қол жеткізуді қамтамасыз ету</li>
        <li>Платформаны тек заңды саяхат және брондау мақсаттарында пайдалану</li>
        <li>Сыртқы шлюздер арқылы енгізілген төлем деректемелерінің дұрыстығын және жарамдылығын қамтамасыз ету</li>
      </>
    )}
  </ul>
  <p>
    {language === 'en'
      ? 'Users are also responsible for reviewing airline-specific rules, including baggage policies, cancellation conditions, and travel requirements, as these are defined by partner carriers and not controlled by Askyinde.'
      : 'Сондай-ақ, пайдаланушылар авиакомпанияларға қатысты ережелерді, соның ішінде багаж ережелерін, рейстерді тоқтату шарттарын және жол жүру талаптарын қайта қарауға жауапты, өйткені оларды серіктес тасымалдаушылар анықтайды және Askyinde бақыламайды.'}
  </p>
</section>

        <section className="px-4">
  <h3 className="text-[20px] font-bold mb-4">
    {language === 'en' ? '6. Liability & Limitations' : '6. Жауапкершілік & шектеулер'}
  </h3>
  <p className="opacity-95 mb-4">
    {language === 'en'
      ? <>
          Askyinde operates strictly as a technology intermediary and does not act as an airline, carrier, or transportation provider. As such, the platform is not responsible for flight operations, delays, cancellations, schedule changes, or service disruptions caused by airline partners or external factors.
          <br /><br />
          Liability is limited to the technical functionality of the booking platform and its ability to transmit user requests to relevant service providers. Askyinde cannot guarantee uninterrupted availability of third-party airline or payment services.
        </>
      : <>
          Askyinde қатаң түрде технологиялық делдал ретінде жұмыс істейді және авиакомпания, тасымалдаушы немесе тасымалдаушы ретінде әрекет етпейді. Осылайша, платформа рейстердің орындалуына, рейстердің кешігуіне, тоқтатылуына, кестедегі өзгерістерге немесе авиакомпания серіктестері немесе сыртқы факторлар тудырған қызмет көрсетудегі үзілістерге жауапты емес.
          <br /><br />
          Жауапкершілік брондау платформасының техникалық функционалдылығымен және оның пайдаланушылардың сұраныстарын тиісті қызмет көрсетушілерге жіберу мүмкіндігімен шектеледі. Askyinde үшінші тарап авиакомпаниясының немесе төлем қызметтерінің үздіксіз қолжетімділігіне кепілдік бере алмайды.
        </>
    }
  </p>
  <p className="font-bold mb-4">
    {language === 'en' ? 'Key limitations include:' : 'Негізгі шектеулер:'}
  </p>
  <ul className="list-disc pl-6 space-y-3 opacity-95">
    {language === 'en' ? (
      <>
        <li>No responsibility for airline operational performance or disruptions</li>
        <li>No liability for pricing changes imposed by third-party carriers</li>
        <li>Limited responsibility for errors originating from external service providers</li>
        <li>Platform acts solely as an intermediary booking and data transmission system</li>
      </>
    ) : (
      <>
        <li>Әуе компанияларының жұмысына жауапкершілік жоқ</li>
        <li>Үшінші тарап тасымалдаушылардың баға өзгерістері үшін жауапкершілік жоқ</li>
        <li>Сыртқы қызмет провайдерлерінің қателері үшін шектеулі жауапкершілік</li>
        <li>Платформа тек делдалдық брондау жүйесі ретінде жұмыс істейді</li>
      </>
    )}
  </ul>
</section>

        <section className="px-4">
          <h3 className="text-[20px] font-bold mb-4">{language === 'en' ? '7. These Terms' : '7. Осы Шарттар'}</h3>
          <p className="opacity-95">
            {language === 'en'
              ? 'These terms ("Terms"), along with our Privacy Policy, govern your access to and use of our services and platforms. By using the platform, you confirm that you have read and agree to these terms in full. We may change these terms at any time at our discretion.'
              : 'Осы ережелер («Шарттар») біздің құпиялылық саясатымызбен бірге біздің Қызметтеріміз бен Платформаларымызға кіруіңізді және оларды пайдалануыңызды реттейді. Платформаны пайдалана отырып, сіз осы Шарттарды толық оқып шыққаныңызды және олармен келісетініңізді растайсыз.'}
          </p>
        </section>

        <section className="px-4">
          <h3 className="text-[20px] font-bold mb-4">{language === 'en' ? '8. Use of our services' : '8. Қызметтерімізді пайдалану'}</h3>
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

        <section className="px-4">
          <h3 className="text-[20px] font-bold mb-4">{language === 'en' ? '9. Intellectual property' : '9. Зияткерлік меншік'}</h3>
          <p className="opacity-95">
            {language === 'en'
              ? 'All intellectual property rights, including interface design, software code, search algorithms, and the Askyinde trademark, belong to us or our licensors.'
              : 'Зияткерлік меншікке қатысты барлық құқықтар, соның ішінде интерфейс дизайны, бағдарламалық код, іздеу алгоритмдері және Askyinde тауар белгісі бізге тиесілі.'}
          </p>
        </section>

        <section className="px-4">
          <h3 className="text-[20px] font-bold mb-4">{language === 'en' ? '10. Limitation of liability' : '10. Жауапкершілікті шектеу'}</h3>
          <p className="opacity-95">
            {language === 'en'
              ? 'Our maximum total obligations to you are limited to the amount of damage that you have suffered for one reason or another from boarding to arrival, while larger costs are covered by our partner airlines in the event of such an event (equivalent in dollars $).'
              : 'Біздің сіз алдындағы ең жоғары жалпы міндеттемелеріміз қонудан келгенге дейін қандай да бір себептермен келтірілген залалдың мөлшерімен шектеледі, ал мұндай оқиға болған жағдайда серіктес авиакомпанияларымыз үлкен шығындарды өтейді (долларындағы баламасы $).'}
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
      {language === 'en' ? '1. About this policy' : '1. Осы саясат туралы'}
    </h3>
    <p className="opacity-95">
      {language === 'en' 
        ? 'This policy describes how Askyinde collects and processes your personal data when you use our Platforms. We value your trust and ensure that your information is kept secure and confidential.' 
        : 'Бұл саясат сіз біздің Платформаларымызды пайдаланған кезде Askyinde сіздің жеке деректеріңізді қалай жинайтынын және өңдейтінін сипаттайды. Біз сіздің сеніміңізді бағалаймыз және ақпаратыңыздың қауіпсіздігін қамтамасыз етеміз.'}
    </p>
  </section>

  <section className="px-4">
    <h3 className="text-[20px] font-bold mb-4">
      {language === 'en' ? '1.1. Introduction' : '1.1. Кіріспе бөлігі'}
    </h3>
    <p className="opacity-95 mb-4">
    {language === 'en'
      ? <>
          Askyinde operates under a GDPR-inspired privacy framework designed to ensure transparent, secure, and responsible handling of user data within a partner-based aviation booking ecosystem. The platform functions as an intermediary technology system between passengers, airline carriers, and payment service providers, meaning it does not operate as an airline or independent travel authority.
          <br /><br />
          Personal data may be processed in accordance with GDPR-inspired data protection principles to enable booking functionality, account management, and coordination between multiple external partners. The purpose of this Privacy Policy is to clearly explain how information is collected, used, and protected within the Askyinde system, ensuring users understand how their data flows through the booking infrastructure.
        </>
      : <>
          Askyinde серіктес авиациялық брондау экожүйесінде пайдаланушы деректерінің ашық, қауіпсіз және жауапкершілікпен өңделуін қамтамасыз етуге арналған GDPR негізіндегі құпиялылық жүйесі арқылы жұмыс істейді. Платформа жолаушылар, әуе тасымалдаушылары және төлем қызметтерін жеткізушілер арасындағы делдалдық технологиялық жүйе ретінде жұмыс істейді, яғни ол авиакомпания немесе тәуелсіз туристік орган ретінде жұмыс істемейді.
          <br /><br />
          Жеке деректерді брондау функционалдығын, есептік жазбаны басқаруды және бірнеше сыртқы серіктестер арасындағы үйлестіруді қамтамасыз ету үшін GDPR шабыттандырған деректерді қорғау принциптеріне сәйкес өңдеуге болады. Бұл Құпиялылық Саясатының мақсаты-Askyinde жүйесінде ақпараттың қалай жиналатынын, пайдаланылатынын және қорғалатынын нақты түсіндіру, бұл пайдаланушыларға олардың деректерінің брондау инфрақұрылымы арқылы қалай өтетінін түсінуге мүмкіндік береді.
        </>
    }
  </p>
  </section>

  {/* Section 2: Data Collection - Обычный текст */}
  <section className="px-4">
    <h3 className="text-[20px] font-bold mb-4">
      {language === 'en' ? '2. Data Collection' : '2. Деректерді жинау'}
    </h3>
    <p className="mb-4 opacity-90">
      {language === 'en' 
        ? '' 
        : 'We collect information that you provide directly, such as:'}
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

  <section className="px-4">
  <h3 className="text-[20px] font-bold mb-4">
    {language === 'en' ? '3. Data Collection' : '3. Деректерді жинау'}
  </h3>
  <p className="opacity-95 mb-4">
    {language === 'en'
      ? <>
          Askyinde collects and processes only the data required for providing flight search, booking, and payment coordination services. This data is obtained directly from users during registration, booking, and system interaction, as well as automatically through platform usage.
        </>
      : <>
          Askyinde тек рейс іздеу, брондау және төлемді үйлестіру қызметтерін көрсету үшін қажетті деректерді жинайды және өңдейді. Бұл деректер тіркелу, брондау және жүйемен өзара әрекеттесу кезінде пайдаланушылардан тікелей алынады, сондай-ақ платформаны пайдалану арқылы автоматты түрде жиналады.
        </>
    }
  </p>
  <p className="font-bold mb-4">
    {language === 'en' ? 'Types of data collected include:' : 'Жиналатын деректер түрлері:'}
  </p>
  <ul className="list-disc pl-6 space-y-3 opacity-95 mb-4">
    {language === 'en' ? (
      <>
        <li>Personal identification data (full name, contact details, nationality)</li>
        <li>Travel and booking data (routes, dates, passenger details, ticket information)</li>
        <li>Technical data (IP address, device type, browser information, system logs)</li>
        <li>Payment-related metadata (transaction references processed via external providers)</li>
      </>
    ) : (
      <>
        <li>Жеке сәйкестендіру деректері (толық аты-жөні, байланыс деректері, ұлты)</li>
        <li>Саяхат және брондау деректері (бағыттар, күндер, жолаушы деректері, билет ақпараты)</li>
        <li>Техникалық деректер (IP мекенжайы, құрылғы түрі, браузер ақпараты, жүйе журналдары)</li>
        <li>Төлемге қатысты метадеректер (сыртқы провайдерлер арқылы өңделген транзакция сілтемелері)</li>
      </>
    )}
  </ul>
  <p className="opacity-95">
    {language === 'en'
      ? 'In some cases, airline partners and payment providers may also transmit limited data back to Askyinde to confirm booking status or validate transactions. Sensitive financial information such as full card numbers or CVV codes is never stored directly on Askyinde systems and is handled exclusively by PCI DSS-inspired third-party processors.'
      : 'Кейбір жағдайларда әуе серіктестері мен төлем провайдерлері брондау мәртебесін растау немесе транзакцияларды тексеру үшін Askyinde-ге шектеулі деректерді қайта жіберуі мүмкін. Толық карта нөмірлері немесе CVV кодтары сияқты құпия қаржылық ақпарат Askyinde жүйелерінде тікелей сақталмайды және тек PCI DSS үшінші тарап процессорлары тарапынан өңделеді.'
    }
  </p>
</section>

 <section className="px-4">
  <h3 className="text-[20px] font-bold mb-4">
    {language === 'en' ? '4. Purpose of Data Use' : '4. Деректерді Пайдалану мақсаты'}
  </h3>
  <p className="opacity-95 mb-4">
    {language === 'en'
      ? <>
          The data collected by Askyinde is strictly used to support operational, technical, and security functions of the booking platform. It enables smooth interaction between users, airlines, and payment systems while maintaining service reliability and compliance with industry standards.
        </>
      : <>
          Askyinde жинаған деректер брондау платформасының операциялық, техникалық және қауіпсіздік функцияларын қолдау үшін қатаң түрде пайдаланылады. Бұл қызметтердің сенімділігі мен салалық стандарттарға сәйкестігін сақтай отырып, пайдаланушылар, авиакомпаниялар және төлем жүйелері арасындағы үздіксіз өзара әрекеттесуді қамтамасыз етеді.
        </>
    }
  </p>
  <p className="font-bold mb-4">
    {language === 'en' ? 'Primary purposes of data usage include:' : 'Деректерді пайдаланудың негізгі мақсаттарына мыналар жатады:'}
  </p>
  <ul className="list-disc pl-6 space-y-3 opacity-95 mb-4">
    {language === 'en' ? (
      <>
        <li>Processing flight bookings and managing reservation workflows</li>
        <li>Transmitting passenger and ticket data to airline partners for ticket issuance</li>
        <li>Facilitating secure payment transactions via external gateways</li>
        <li>Improving platform performance, usability, and system stability</li>
        <li>Supporting fraud detection, risk analysis, and security monitoring</li>
      </>
    ) : (
      <>
        <li>Рейстерді брондауды өңдеу және брондаудың жұмыс процестерін басқару</li>
        <li>Жолаушылар мен билеттер туралы мәліметтерді авиакомпания серіктестеріне билет беру үшін беру</li>
        <li>Сыртқы шлюздер арқылы қауіпсіз төлем операцияларын жеңілдету</li>
        <li>Платформаның өнімділігін, ыңғайлылығын және жүйенің тұрақтылығын жақсарту</li>
        <li>Алаяқтықты анықтауды, тәуекелдерді талдауды және қауіпсіздік мониторингін қолдау</li>
      </>
    )}
  </ul>
  <p className="opacity-95 mb-4">
    {language === 'en'
      ? <>
          Personal data may be processed in accordance with GDPR-inspired data protection principles to ensure transparency and responsible handling. Additionally, certain operational data may be used in aggregated or anonymized form to improve system efficiency and optimize user experience without directly identifying individuals.
          <br /><br />
          The platform ensures that all data usage remains limited to what is necessary for providing core services and maintaining a secure, functional booking environment across all integrated partners.
        </>
      : <>
          Жеке деректер ашықтық пен жауапкершілікпен жұмыс істеуді қамтамасыз ету үшін GDPR шабыттандырған деректерді қорғау принциптеріне сәйкес өңделуі мүмкін. Сонымен қатар, белгілі бір операциялық деректер жүйенің тиімділігін арттыру және жеке тұлғаларды тікелей анықтамай-ақ пайдаланушы тәжірибесін оңтайландыру үшін жинақталған немесе анонимді түрде пайдаланылуы мүмкін.
          <br /><br />
          Платформа барлық деректерді пайдаланудың негізгі қызметтерді ұсыну және барлық интеграцияланған серіктестерде қауіпсіз, функционалды брондау ортасын сақтау үшін қажет нәрселермен шектелуін қамтамасыз етеді.
        </>
    }
  </p>
</section>

  <section className="px-4">
  <h3 className="text-[20px] font-bold mb-4">
    {language === 'en' ? '5. Legal Basis (GDPR-Inspired)' : '5. Құқықтық Негіздер (GDPR Негіздемесінде)'}
  </h3>
  <p className="opacity-95 mb-4">
    {language === 'en'
      ? <>
          Askyinde processes personal data based on internationally recognized privacy principles inspired by the General Data Protection Regulation (GDPR). These legal foundations ensure that data usage remains transparent, justified, and limited to specific operational needs within the aviation booking ecosystem.
          <br /><br />
          The processing of user data is based on several key legal grounds that define how and why information is handled across the platform. These principles ensure that all data activities are aligned with user expectations and industry-standard privacy practices.
        </>
      : <>
          Askyinde деректерді Қорғаудың Жалпы Ережесінен (GDPR) шабыттанған халықаралық деңгейде танылған құпиялылық принциптеріне негізделген жеке деректерді өңдейді. Бұл құқықтық негіздер деректерді пайдаланудың ашықтығын, негізділігін және авиациялық брондау экожүйесіндегі нақты операциялық қажеттіліктермен шектелуін қамтамасыз етеді.
          <br / ><br />
          Пайдаланушы деректерін өңдеу ақпараттың бүкіл платформада қалай және неліктен өңделетінін анықтайтын бірнеше негізгі заңды негіздерге негізделген. Бұл принциптер барлық деректер әрекеттерінің пайдаланушылардың күтулеріне және салалық стандартты құпиялылық тәжірибесіне сәйкес келуін қамтамасыз етеді.
        </>
    }
  </p>
  <p className="font-bold mb-4">
    {language === 'en' ? 'Legal bases include:' : 'Құқықтық негіздерге мыналар жатады:'}
  </p>
  <ul className="list-disc pl-6 space-y-3 opacity-95 mb-4">
    {language === 'en' ? (
      <>
        <li>Consent: Users explicitly agree to data processing when using booking and account services</li>
        <li>Contract necessity: Data is required to fulfill booking and ticketing agreements with airline partners</li>
        <li>Legitimate interest: Limited processing for fraud prevention, system security, and service optimization</li>
        <li>Operational necessity: Data required to maintain platform functionality and communication between partners</li>
      </>
    ) : (
      <>
        <li>Келісім: пайдаланушылар брондау және есептік жазба қызметтерін пайдалану кезінде деректерді өңдеуге нақты келіседі</li>
        <li>Келісімшарттың қажеттілігі: Деректер авиакомпания серіктестерімен брондау және билеттерді сату туралы келісімдерді орындау үшін қажет</li>
        <li>Заңды қызығушылық: алаяқтықтың Алдын Алу, жүйенің қауіпсіздігі және қызметтерді оңтайландыру үшін Шектеулі өңдеу</li>
        <li>Операциялық қажеттілік: платформаның функционалдығын және серіктестер арасындағы байланысты сақтау Үшін Қажетті Деректер</li>
      </>
    )}
  </ul>
  <p className="opacity-95 mb-4">
    {language === 'en'
      ? <>
          Personal data may be processed in accordance with GDPR-inspired data protection principles to ensure lawful, fair, and transparent handling across all operational layers of the system.
        </>
      : <>
          Дербес деректер ЖҮЙЕНІҢ барлық операциялық деңгейлерінде заңды, әділ және ашық өңдеуді қамтамасыз ету үшін GDPR шабыттандырған деректерді қорғау принциптеріне сәйкес өңделуі мүмкін.
        </>
    }
  </p>
</section>

  <section className="px-4">
    <h3 className="text-[20px] font-bold mb-4">
      {language === 'en' ? '6. Payment Security (PCI DSS-Inspired)' : '6. Төлем Қауіпсіздігі (PCI DSS Негіздемесінде)'}
    </h3>
    <p className="opacity-95 mb-4">
    {language === 'en'
      ? <>
          Askyinde applies PCI DSS-inspired security practices to ensure that all payment-related processes are handled securely through certified external providers. The platform is designed to minimize exposure of sensitive financial data by using secure transaction routing and encrypted communication channels.
          <br /><br />
          Payments are not processed directly within Askyinde systems. Instead, external gateways handle all card authentication, encryption, and settlement processes. This reduces risk and ensures compliance with global payment security standards.
        </>
      : <>
          Askyinde төлемге қатысты барлық процестердің сертификатталған сыртқы провайдерлер арқылы қауіпсіз орындалуын қамтамасыз ету үшін PCI DSS шабыттандырылған қауіпсіздік әдістерін қолданады. Платформа транзакцияларды қауіпсіз бағыттау және шифрланған байланыс арналарын пайдалану арқылы құпия қаржылық деректердің әсерін азайтуға арналған.
          <br /><br />
          Төлемдер ТІКЕЛЕЙ Askyinde жүйелерінде өңделмейді. Оның орнына сыртқы шлюздер барлық карталардың аутентификациясын, шифрлауын және есеп айырысу процестерін басқарады. Бұл тәуекелді азайтады және төлем қауіпсіздігінің жаһандық стандарттарына сәйкестігін қамтамасыз етеді.
        </>
    }
  </p>
  </section>

  <section className="px-4">
  <h3 className="text-[20px] font-bold mb-4">
    {language === 'en' ? '7. Data Sharing' : '7. Деректер Алмасу'}
  </h3>
  <p className="opacity-95 mb-4">
    {language === 'en'
      ? <>
          Askyinde shares limited user data only when necessary to complete booking and payment-related processes. Data is never sold or disclosed for marketing purposes and is strictly controlled within the aviation service ecosystem.
        </>
      : <>
          Askyinde шектеулі пайдаланушы деректерін брондау және төлемге қатысты процестерді аяқтау үшін қажет болған жағдайда ғана бөліседі. Деректер ешқашан маркетингтік мақсатта сатылмайды немесе ашылмайды және авиациялық қызметтердің экожүйесінде қатаң бақыланады.
        </>
    }
  </p>
  <p className="font-bold mb-4">
    {language === 'en' ? 'Data may be shared with:' : 'Деректермен бөлісуге болады:'}
  </p>
  <ul className="list-disc pl-6 space-y-3 opacity-95 mb-4">
    {language === 'en' ? (
      <>
        <li>Airline partners for ticket issuance and reservation confirmation(if necessary)</li>
        <li>Payment service providers for transaction processing and validation(if necessary)</li>
        <li>Regulatory or legal authorities when required by applicable law(if necessary)</li>
        <li>Technical service providers supporting platform infrastructure(if necessary)</li>
      </>
    ) : (
      <>
        <li>Билеттерді беру және брондауды растау бойынша авиакомпания серіктестеріне(қажет болса)</li>
        <li>Транзакцияларды өңдеу және валидациялау үшін төлем қызметтерін жеткізушілерге(қажет болса)</li>
        <li>Қолданыстағы заңнама талап еткен кезде реттеуші немесе заңды органдарға(қажет болса)</li>
        <li>Платформа инфрақұрылымын қолдайтын техникалық қызмет көрсетушілеріне(қажет болса)</li>
      </>
    )}
  </ul>
  <p className="opacity-95 mb-4">
    {language === 'en'
      ? <>
          All shared data is restricted to operational necessity and transmitted through secure channels to ensure confidentiality and integrity across all partner interactions.
        </>
      : <>
          Барлық ортақ деректер операциялық қажеттілікпен шектеледі және серіктестердің барлық өзара әрекеттесулерінде құпиялылық пен тұтастықты қамтамасыз ету үшін қауіпсіз арналар арқылы жіберіледі.
        </>
    }
  </p>
</section>

  <section className="px-4">
    <h3 className="text-[20px] font-bold mb-4">
      {language === 'en' ? '8. User Rights' : '8. Пайдаланушы Құқықтары'}
    </h3>
    <p className="opacity-95 mb-4">
    {language === 'en'
      ? <>
          Users of Askyinde are granted specific rights regarding their personal data, consistent with GDPR-inspired principles. These rights ensure that individuals maintain control over how their information is stored, used, and managed within the platform.
          <br /><br />
          Users may request access to their personal data, allowing them to review what information is stored and how it is being processed. They also have the right to request corrections to inaccurate or outdated information to ensure data accuracy within booking systems. Additionally, users may request deletion of their personal data, subject to legal or operational retention requirements related to completed transactions or regulatory obligations. Data portability rights may also be available, allowing users to receive their data in a structured format for transfer to other services where applicable.
        </>
      : <>
          Askyinde пайдаланушыларына GDPR шабыттандырған принциптерге сәйкес олардың жеке деректеріне қатысты нақты құқықтар беріледі. Бұл құқықтар жеке тұлғалардың өз ақпаратының платформа ішінде қалай сақталуын, пайдаланылуын және басқарылуын бақылауды қамтамасыз етеді.
          <br /><br />
          Пайдаланушылар өздерінің жеке деректеріне қол жеткізуді сұрай алады, бұл оларға қандай ақпарат сақталатынын және оның қалай өңделетінін көруге мүмкіндік береді. Олар сондай-ақ брондау жүйелеріндегі деректердің дәлдігін қамтамасыз ету үшін дұрыс емес немесе ескірген ақпаратқа түзетулер енгізуді сұрауға құқылы. Сонымен қатар, пайдаланушылар аяқталған транзакцияларға немесе нормативтік міндеттемелерге байланысты заңды немесе операциялық сақтау талаптарын ескере отырып, жеке деректерін жоюды сұрай алады. Сондай-ақ, деректерді тасымалдау құқықтары қол жетімді болуы мүмкін, бұл пайдаланушыларға қажет болған жағдайда басқа қызметтерге тасымалдау үшін құрылымдық форматта өз деректерін алуға мүмкіндік береді.
        </>
    }
  </p>
  </section>


  {/* Section 3: Data Sharing - Выделенная карточка */}
  <section className={glassCardClass}>
    <h3 className="text-[20px] font-bold mb-4">
      {language === 'en' ? '9. When is your data shared with Third Parties?' : '9. Деректер қашан үшінші тұлғалармен бөлісіледі?'}
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
      {language === 'en' ? '10. How do we keep data secure?' : '10. Деректерді қалай қауіпсіз сақтаймыз?'}
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
      {language === 'en' ? '11. Contact us' : '11. Бізбен байланысу'}
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

export default LegalLawPage;