describe('Askyinde full booking flow', () => {
  const testUser = {
    id: 'test-user-001',
    email: 'testuser@askyinde.test',
    name: 'Test User',
    picture: ''
  };

  const futureDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 10);
    return date.toISOString().split('T')[0];
  };

  const loginByLocalStorageBeforeAppLoad = () => {
    cy.visit('http://localhost:3000/flights', {
      onBeforeLoad(win) {
        win.localStorage.setItem('user', JSON.stringify(testUser));
      }
    });
  };

  const fillVisibleInputByIndex = (index, value) => {
    cy.get('input:visible')
      .eq(index)
      .clear({ force: true })
      .type(value, { force: true, delay: 80 });
  };

  const clickByTextIfExists = (regex) => {
    cy.get('body').then(($body) => {
      if ($body.text().match(regex)) {
        cy.contains(regex).click({ force: true });
      }
    });
  };

  const scrollBottomAndBackTo = (textRegex) => {
  cy.scrollTo('bottom', { duration: 1800 });
  cy.wait(900);

  cy.contains(textRegex)
    .scrollIntoView({ duration: 1600, block: 'center' })
    .should('be.visible');

  cy.wait(700);
};

const fillInputNearLabel = (labelRegex, value) => {
  cy.contains(labelRegex)
    .scrollIntoView({ duration: 800, block: 'center' })
    .should('be.visible')
    .parent()
    .within(() => {
      cy.get('input')
        .first()
        .clear({ force: true })
        .type(value, { force: true, delay: 80 });
    });
};

  beforeEach(() => {
  cy.intercept('GET', '**/rest/v1/passengers*', {
    statusCode: 200,
    body: []
  }).as('getPassengers');

  cy.intercept('POST', '**/rest/v1/passengers*', {
    statusCode: 201,
    body: [
      {
        id: 'test-passenger-001',
        user_email: 'testuser@askyinde.test',
        full_name: 'Test Passenger'
      }
    ]
  }).as('createPassenger');

  cy.intercept('POST', '**/rest/v1/bookings*', {
    statusCode: 201,
    body: [
      {
        id: 'test-booking-001',
        booking_ref: 'ASKY-TEST-001',
        user_email: 'testuser@askyinde.test'
      }
    ]
  }).as('createBooking');

  cy.intercept('GET', '**/rest/v1/bookings*', {
    statusCode: 200,
    body: [
      {
        id: 'test-booking-001',
        user_email: 'testuser@askyinde.test',
        origin: 'NQZ',
        destination: 'ALA',
        airline: 'SCAT',
        flight_id: 'ST 813',
        depart_time: '2026-05-25T05:39:00',
        arrive_time: '2026-05-25T08:01:00',
        seat: '1A',
        travel_class: 'Economy',
        passenger_name: 'Test Passenger',
        passenger_surname: '',
        price: 37378,
        created_at: new Date().toISOString()
      }
    ]
  }).as('getBookings');
});

  it('guest explores website, logs in, searches flight, selects seat, fills passenger data, pays and sees confirmation', () => {
    // 1. Welcome page as guest
    cy.visit('http://localhost:3000');
    cy.wait(1000);

    cy.contains(/Askyinde/i).should('be.visible');
    cy.contains(/Welcome to the/i).should('be.visible');

    // 2. Guest opens explore page
    cy.contains(/Explore flights/i).click({ force: true });
    cy.wait(1200);

    cy.url().should('include', '/explore-flights-guest');
    cy.contains(/Explore the world/i).should('be.visible');

    // 3. Guest scrolls destination page
    cy.scrollTo(0, 500, { duration: 1200 });
    cy.wait(700);

    cy.contains(/BAKU|TASHKENT|SOFIA|NEW YORK|OTTAWA|BERN|WASHINGTON/i)
      .scrollIntoView({ duration: 1000 })
      .trigger('mouseover', { force: true });

    cy.wait(700);

    cy.contains(/BAKU|TASHKENT|SOFIA|NEW YORK|OTTAWA|BERN|WASHINGTON/i)
      .click({ force: true });

    cy.wait(1000);

    cy.scrollTo('bottom', { duration: 2200 });
    cy.wait(1000);

    cy.scrollTo('top', { duration: 1800 });
    cy.wait(800);

    // 4. Return to Welcome and open login modal
    cy.visit('http://localhost:3000');
    cy.wait(1000);

    cy.contains(/Log in/i).click({ force: true });
    cy.wait(1000);

    cy.contains(/Sign in to Askyinde/i).should('be.visible');
    cy.contains(/Continue with Google/i).should('be.visible');

    // 5. Cypress checks Google button, but does not use real Google OAuth
    cy.contains(/Continue with Google/i).click({ force: true });
    cy.wait(1000);

    // 6. Mock successful Google login before React app loads
    loginByLocalStorageBeforeAppLoad();
    cy.wait(1500);

    cy.url().should('include', '/flights');
    cy.contains(/Find the best flights/i).should('be.visible');
    cy.contains(/Sign in to Askyinde/i).should('not.exist');

    // 7. Scroll to full search form
cy.contains(/One way/i)
  .scrollIntoView({ duration: 1800, block: 'center' })
  .should('be.visible');

cy.wait(1000);

cy.contains(/Where from/i).should('be.visible');
cy.contains(/Departure date/i).should('be.visible');
cy.contains(/Passengers and class/i).should('be.visible');

// 8. Сначала листаем /flights до конца вниз
cy.scrollTo('bottom', { duration: 2500 });
cy.wait(1200);

// 9. Потом возвращаемся обратно к форме поиска
cy.contains(/One way/i)
  .scrollIntoView({ duration: 2200, block: 'center' })
  .should('be.visible');

cy.wait(1000);

// Немного поднимаем, чтобы форма была красиво по центру
cy.window().then((win) => {
  win.scrollBy({ top: -120, behavior: 'smooth' });
});

cy.wait(1200);

// 10. Заполняем форму поиска рейса

// Откуда
// Откуда
cy.get('input[placeholder="Departure city"]')
  .should('be.visible')
  .clear({ force: true })
  .type('Astana (NQZ)', { force: true, delay: 80 });

cy.wait(700);

// Куда
cy.get('input[placeholder="City of arrival"]')
  .should('be.visible')
  .clear({ force: true })
  .type('Almaty (ALA)', { force: true, delay: 80 });

cy.wait(700);

// Дата вылета
const flightDate = futureDate();

cy.get('input[placeholder="Select a date"]')
  .should('be.visible')
  .click({ force: true });

cy.wait(500);

cy.get('input[type="date"]')
  .should('be.visible')
  .clear({ force: true })
  .type(flightDate, { force: true });

cy.wait(700);

// Пассажиры и класс
cy.get('select:visible')
  .should('be.visible')
  .select('1_eco', { force: true });

cy.wait(700);

// Проверяем, что значения реально попали в поля
cy.get('input[placeholder="Departure city"]').should('have.value', 'Astana (NQZ)');
cy.get('input[placeholder="City of arrival"]').should('have.value', 'Almaty (ALA)');
cy.get('input[type="date"]').should('have.value', flightDate);
cy.get('select:visible').should('have.value', '1_eco');

cy.wait(1000);

// 11. Нажимаем Find flights
cy.contains('button', /Find flights/i)
  .scrollIntoView({ duration: 1000, block: 'center' })
  .should('be.visible')
  .click({ force: true });

cy.wait(2500);

// 12. Search results page
cy.url().should('include', '/search-results');
cy.get('body').should('be.visible');

cy.contains(/flight|select|choose|book|price|airline/i).should('exist');
cy.wait(1000);

// 2 этап: плавно вниз и обратно к выбору рейса
scrollBottomAndBackTo(/select|choose|book|continue/i);

    // 12. Select first available flight
    cy.get('button:visible')
      .contains(/select|choose|book|continue/i)
      .first()
      .click({ force: true });

    cy.wait(2000);

    // 13. Seat selection page
    cy.url().should('include', '/seat-selection');
    cy.contains(/seat|select|continue/i).should('exist');

    cy.wait(1000);

    // 3 этап: плавно вниз и обратно к выбору места
scrollBottomAndBackTo(/seat|select|continue/i);

    // Select first visible seat-like button
    cy.get('button:visible').then(($buttons) => {
      const seatButton = [...$buttons].find((btn) => {
        const text = btn.innerText.trim();
        return /^\d+[A-F]$/.test(text) || /^[A-F]\d+$/.test(text);
      });

      if (seatButton) {
        cy.wrap(seatButton).click({ force: true });
      } else {
        cy.wrap($buttons.eq(0)).click({ force: true });
      }
    });

    cy.wait(1000);

    // 4 этап: плавно вниз и обратно к форме пассажира
scrollBottomAndBackTo(/passenger|details|name|passport/i);

    cy.get('button:visible')
      .contains(/continue|next|passenger|details/i)
      .click({ force: true });

    cy.wait(2000);

    // 14. Passenger data page
cy.url().should('include', '/passenger-data');
cy.contains(/passenger|details|name|passport/i).should('exist');

cy.wait(1000);

// 4 этап: плавно вниз до конца PassengerData
cy.scrollTo('bottom', { duration: 1800 });
cy.wait(900);

// Возвращаемся обратно к форме пассажира
cy.contains(/passenger|details|name|passport/i)
  .scrollIntoView({ duration: 1600, block: 'center' })
  .should('be.visible');

cy.wait(900);

// Fill passenger data

    // Fill passenger data
    cy.get('input:visible').then(($inputs) => {
      const values = [
        'Test Passenger',
        'AA1234567',
        '1999-05-15',
        'Kazakhstan',
        'testuser@askyinde.test',
        '+77001234567'
      ];

      [...$inputs].forEach((input, index) => {
        if (index < values.length) {
          cy.wrap(input)
            .clear({ force: true })
            .type(values[index], { force: true, delay: 50 });
        }
      });
    });

    cy.wait(1000);

    cy.get('body').then(($body) => {
      if ($body.find('select:visible').length > 0) {
        cy.get('select:visible').first().select(1, { force: true });
      }
    });

    cy.wait(700);

    cy.get('button:visible')
      .contains(/continue|next|payment|pay/i)
      .click({ force: true });

    cy.wait(2000);

    // 15. Payment page
    cy.url().should('include', '/payment');
    cy.contains(/payment|card|pay|cvv|expiry/i).should('exist');

    cy.wait(1000);

    
    // 5 этап: Payment page
cy.url().should('include', '/payment');
cy.contains(/payment|card|pay|cvv|expiry/i).should('exist');

cy.wait(1000);

// Плавно вниз и обратно к банковской карте
scrollBottomAndBackTo(/Bank Card|Card Number|Expiry Date|CVV/i);

// Выбираем оплату банковской картой, если радио-кнопка доступна
cy.contains(/Bank Card/i).click({ force: true });
cy.wait(700);

// Заполняем Card Number строго по placeholder
cy.get('input[placeholder="0000 0000 0000 0000"]')
  .should('be.visible')
  .clear({ force: true })
  .type('4242424242424242', { force: true, delay: 80 });

cy.wait(700);

// Заполняем Expiry Date строго рядом с label
cy.contains(/Expiry Date/i)
  .parent()
  .find('input')
  .first()
  .clear({ force: true })
  .type('12/28', { force: true, delay: 80 });

cy.wait(700);

// Заполняем CVV строго рядом с label
cy.contains(/^CVV$/i)
  .parent()
  .find('input')
  .first()
  .clear({ force: true })
  .type('123', { force: true, delay: 80 });

cy.wait(1000);

// Проверяем, что карта заполнена правильно
cy.get('input[placeholder="0000 0000 0000 0000"]')
  .should('have.value', '4242 4242 4242 4242');

cy.contains(/Expiry Date/i)
  .parent()
  .find('input')
  .first()
  .should('have.value', '12/28');

cy.contains(/^CVV$/i)
  .parent()
  .find('input')
  .first()
  .should('have.value', '123');

// Плавно к кнопке оплаты
cy.contains(/pay|buy|purchase|complete|confirm/i)
  .scrollIntoView({ duration: 1200, block: 'center' })
  .should('be.visible');

cy.wait(800);

cy.contains('button', /pay|buy|purchase|complete|confirm/i)
  .click({ force: true });

cy.wait(2500);
   

    // 16. Confirmation page
cy.url().should('include', '/confirmation');

cy.contains(/Thank you/i).should('be.visible');
cy.contains(/Your ticket has been booked successfully/i).should('be.visible');
cy.contains(/NQZ/i).should('exist');
cy.contains(/ALA/i).should('exist');
cy.contains(/Test Passenger/i).should('exist');

cy.wait(1200);

// 17. Open My trips from confirmation
cy.window().then((win) => {
  win.localStorage.setItem('profileTab', 'alerts');
});

cy.contains(/View my trips/i)
  .scrollIntoView({ duration: 1000, block: 'center' })
  .should('be.visible')
  .click({ force: true });

cy.wait(2200);

// 18. ProfilePage should open
cy.url().should('include', '/profile');
cy.get('body').should('be.visible');

// Если открылась вкладка Account, нажимаем My trips
cy.get('body').then(($body) => {
  if ($body.text().match(/Account/i) && !$body.text().match(/NQZ|ALA|SCAT|ST 813/i)) {
    cy.contains('button', /My trips/i).click({ force: true });
  }
});

cy.wait(1500);

// 19. Если мок Supabase не отработал, обновляем профиль уже с profileTab
cy.get('body').then(($body) => {
  if ($body.text().match(/You have no tickets saved here/i)) {
    cy.window().then((win) => {
      win.localStorage.setItem('profileTab', 'alerts');
    });

    cy.reload();
    cy.wait(1800);
  }
});

// Финальная проверка купленного билета в My trips
cy.contains(/My Trips/i).should('be.visible');

cy.contains(/NQZ|Astana/i, { timeout: 8000 }).should('exist');
cy.contains(/ALA|Almaty/i).should('exist');
cy.contains(/SCAT|ST 813/i).should('exist');
cy.contains(/Economy/i).should('exist');
cy.contains(/Seat 1A|1A/i).should('exist');
cy.contains(/37 378|37378/i).should('exist');

cy.wait(1000);

// Финально поднимаем экран к карточке купленного билета,
// чтобы в Cypress было видно My Trips и сам билет, а не footer
cy.contains(/My Trips/i)
  .scrollIntoView({ duration: 1500, block: 'start' });

cy.wait(700);

cy.window().then((win) => {
  win.scrollBy({ top: -250, behavior: 'smooth' });
});

cy.wait(1200);
  });
});