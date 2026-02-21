/**
 * ============================================================
 * TENEDOR LIBRE — main.js
 *
 * Módulos:
 *  1. Navbar (scroll + menú móvil)
 *  2. Scroll Reveal
 *  3. Filtro de menú
 *  4. MockBackend (persistencia local)
 *  5. AuthModal (registro e inicio de sesión)
 *  6. ReservationCenter (carrito + reserva)
 *  7. ContactCenter (formulario de contacto)
 *  8. PriceCalculator (descuento por edad)
 * ============================================================
 */

'use strict';

const formatCLP = (value) => `$${Number(value).toLocaleString('es-CL')}`;

const syncBodyLock = () => {
  const menuOpen = document.querySelector('.navbar__links')?.classList.contains('navbar__links--mobile-open');
  const modalOpen = document.getElementById('authModal')?.classList.contains('active');
  document.body.classList.toggle('body--lock', Boolean(menuOpen || modalOpen));
};

const AppStorage = (() => {
  const KEYS = {
    users: 'tl_users_v2',
    session: 'tl_session_v2',
    cart: 'tl_reservation_cart_v2',
    bookingDraft: 'tl_booking_draft_v2',
    reservations: 'tl_reservations_v2',
    contacts: 'tl_contacts_v2'
  };

  const ENDPOINTS = {
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
    reservation: '/api/reservas',
    contact: '/api/contacto'
  };

  const safeRead = (storage, key, fallback) => {
    try {
      const raw = storage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (_err) {
      return fallback;
    }
  };

  const safeWrite = (storage, key, value) => {
    storage.setItem(key, JSON.stringify(value));
  };

  const withLatency = (handler) => {
    const delay = 250 + Math.floor(Math.random() * 350);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          resolve(handler());
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  };

  const toPublicUser = (user) => ({
    id: user.id,
    nombre: user.nombre,
    correo: user.correo
  });

  const getUsers = () => safeRead(localStorage, KEYS.users, []);
  const setUsers = (users) => safeWrite(localStorage, KEYS.users, users);

  const getCurrentSessionUser = () => safeRead(sessionStorage, KEYS.session, null);

  const setCurrentSessionUser = (user) => {
    if (user) {
      safeWrite(sessionStorage, KEYS.session, toPublicUser(user));
    } else {
      sessionStorage.removeItem(KEYS.session);
    }
  };

  const init = () => {
    const existingUsers = getUsers();
    if (!existingUsers.length) {
      setUsers([
        {
          id: 'usr_admin',
          nombre: 'Admin',
          correo: 'admin@tenedorlibre.com',
          password: '1234'
        }
      ]);
    }

    const cart = safeRead(localStorage, KEYS.cart, null);
    if (!cart) {
      safeWrite(localStorage, KEYS.cart, { plan: null, people: 2, updatedAt: null });
    }

    if (!safeRead(localStorage, KEYS.contacts, null)) {
      safeWrite(localStorage, KEYS.contacts, []);
    }

    if (!safeRead(localStorage, KEYS.reservations, null)) {
      safeWrite(localStorage, KEYS.reservations, []);
    }
  };

  const registerUser = ({ nombre, correo, password }) => withLatency(() => {
    const users = getUsers();
    const normalizedEmail = correo.toLowerCase();
    const exists = users.some((user) => user.correo.toLowerCase() === normalizedEmail);

    if (exists) {
      return {
        ok: false,
        code: 'USER_EXISTS',
        endpoint: ENDPOINTS.register
      };
    }

    const newUser = {
      id: `usr_${Date.now().toString(36)}`,
      nombre,
      correo: normalizedEmail,
      password
    };

    users.push(newUser);
    setUsers(users);
    setCurrentSessionUser(newUser);

    return {
      ok: true,
      user: toPublicUser(newUser),
      endpoint: ENDPOINTS.register
    };
  });

  const loginUser = ({ correo, password }) => withLatency(() => {
    const normalizedEmail = correo.toLowerCase();
    const user = getUsers().find((item) => item.correo.toLowerCase() === normalizedEmail);

    if (!user) {
      return {
        ok: false,
        code: 'USER_NOT_FOUND',
        endpoint: ENDPOINTS.login
      };
    }

    if (user.password !== password) {
      return {
        ok: false,
        code: 'BAD_PASSWORD',
        endpoint: ENDPOINTS.login
      };
    }

    setCurrentSessionUser(user);

    return {
      ok: true,
      user: toPublicUser(user),
      endpoint: ENDPOINTS.login
    };
  });

  const logoutUser = () => withLatency(() => {
    setCurrentSessionUser(null);
    return {
      ok: true,
      endpoint: ENDPOINTS.logout
    };
  });

  const getCart = () => safeRead(localStorage, KEYS.cart, { plan: null, people: 2, updatedAt: null });

  const setCart = (cart) => {
    safeWrite(localStorage, KEYS.cart, cart);
    return cart;
  };

  const setCartPeople = (people) => {
    const normalizedPeople = Math.max(1, Math.min(20, Number(people) || 1));
    const cart = getCart();
    return setCart({ ...cart, people: normalizedPeople, updatedAt: new Date().toISOString() });
  };

  const selectPlan = (plan) => {
    const cart = getCart();
    return setCart({ ...cart, plan, updatedAt: new Date().toISOString() });
  };

  const clearSelectedPlan = () => {
    const cart = getCart();
    return setCart({ ...cart, plan: null, updatedAt: new Date().toISOString() });
  };

  const clearCart = () => setCart({ plan: null, people: 2, updatedAt: new Date().toISOString() });

  const saveBookingDraft = (draft) => {
    safeWrite(localStorage, KEYS.bookingDraft, {
      ...draft,
      updatedAt: new Date().toISOString()
    });
  };

  const getBookingDraft = () => safeRead(localStorage, KEYS.bookingDraft, null);

  const createReservation = (payload) => withLatency(() => {
    const reservations = safeRead(localStorage, KEYS.reservations, []);

    const reservation = {
      id: `RSV-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      status: 'confirmada',
      ...payload
    };

    reservations.unshift(reservation);
    safeWrite(localStorage, KEYS.reservations, reservations);

    return {
      ok: true,
      reservation,
      endpoint: ENDPOINTS.reservation
    };
  });

  const getReservations = () => safeRead(localStorage, KEYS.reservations, []);

  const createContact = (payload) => withLatency(() => {
    const contacts = safeRead(localStorage, KEYS.contacts, []);

    const ticket = {
      id: `TKT-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      ...payload
    };

    contacts.unshift(ticket);
    safeWrite(localStorage, KEYS.contacts, contacts);

    return {
      ok: true,
      ticket,
      endpoint: ENDPOINTS.contact
    };
  });

  const getContacts = () => safeRead(localStorage, KEYS.contacts, []);

  return {
    ENDPOINTS,
    init,
    registerUser,
    loginUser,
    logoutUser,
    getCurrentSessionUser,
    getCart,
    setCartPeople,
    selectPlan,
    clearSelectedPlan,
    clearCart,
    saveBookingDraft,
    getBookingDraft,
    createReservation,
    getReservations,
    createContact,
    getContacts
  };
})();

/* ============================================================
   1. NAVBAR — scroll y menú móvil
   ============================================================ */
const Navbar = (() => {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.navbar__hamburger');
  const links = document.querySelector('.navbar__links');
  const MOBILE_OPEN_CLASS = 'navbar__links--mobile-open';

  const onScroll = () => {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };

  const closeMobileMenu = () => {
    if (!links) return;
    links.classList.remove(MOBILE_OPEN_CLASS);
    syncBodyLock();
  };

  const toggleMenu = () => {
    if (!links) return;
    links.classList.toggle(MOBILE_OPEN_CLASS);
    syncBodyLock();
  };

  const handleHamburgerKey = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleMenu();
    }
  };

  const init = () => {
    window.addEventListener('scroll', onScroll);
    onScroll();

    if (hamburger) {
      hamburger.addEventListener('click', toggleMenu);
      hamburger.addEventListener('keydown', handleHamburgerKey);
    }

    document.querySelectorAll('.navbar__links a').forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 768) {
          closeMobileMenu();
        }
      });
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768) {
        closeMobileMenu();
      }
    });
  };

  return { init };
})();

/* ============================================================
   2. SCROLL REVEAL
   ============================================================ */
const ScrollReveal = (() => {
  const init = () => {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    elements.forEach((element) => observer.observe(element));
  };

  return { init };
})();

/* ============================================================
   3. FILTRO DE MENÚ
   ============================================================ */
const MenuFilter = (() => {
  const init = () => {
    const filterButtons = document.querySelectorAll('.menu-section__filter-btn');
    const cards = document.querySelectorAll('.menu-card[data-category]');

    if (!filterButtons.length || !cards.length) return;

    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        filterButtons.forEach((item) => item.classList.remove('active'));
        button.classList.add('active');

        const filter = button.dataset.filter;

        cards.forEach((card) => {
          if (filter === 'all' || card.dataset.category === filter) {
            card.classList.remove('menu-card--hidden');
            card.classList.remove('menu-card--filtered-in');
            void card.offsetWidth;
            card.classList.add('menu-card--filtered-in');
          } else {
            card.classList.add('menu-card--hidden');
            card.classList.remove('menu-card--filtered-in');
          }
        });
      });
    });
  };

  return { init };
})();

/* ============================================================
   4. MODAL AUTH — Login / Registro persistente
   ============================================================ */
const AuthModal = (() => {
  let currentUser = null;

  const overlay = document.getElementById('authModal');
  const btnClose = document.querySelector('#authModal .modal__close');
  const tabLogin = document.getElementById('tabLogin');
  const tabRegister = document.getElementById('tabRegister');
  const panelLogin = document.getElementById('panelLogin');
  const panelRegister = document.getElementById('panelRegister');
  const navbarCta = document.querySelector('.navbar__cta');

  const showResult = (containerId, emoji, title, message, isError = false) => {
    const result = document.getElementById(containerId);
    if (!result) return;

    result.querySelector('.modal__result__emoji').textContent = emoji;
    result.querySelector('.modal__result__title').textContent = title;
    result.querySelector('.modal__result__message').textContent = message;
    result.classList.toggle('error', isError);
    result.classList.add('show');
  };

  const clearResults = () => {
    document.querySelectorAll('.modal__result').forEach((result) => {
      result.classList.remove('show', 'error');
    });
  };

  const clearInputs = () => {
    document.querySelectorAll('#authModal input').forEach((input) => {
      input.value = '';
    });
  };

  const updateNavbar = () => {
    if (!navbarCta) return;

    if (currentUser) {
      navbarCta.textContent = `👤 ${currentUser.nombre} · Salir`;
      navbarCta.classList.add('navbar__cta--logged');
      navbarCta.setAttribute('aria-label', 'Cerrar sesión');
    } else {
      navbarCta.textContent = 'Iniciar Sesión';
      navbarCta.classList.remove('navbar__cta--logged');
      navbarCta.setAttribute('aria-label', 'Iniciar sesión');
    }
  };

  const emitSessionChange = () => {
    window.dispatchEvent(new CustomEvent('tenedorlibre:session-changed', {
      detail: { user: currentUser }
    }));
  };

  const open = () => {
    if (!overlay) return;
    overlay.classList.add('active');
    syncBodyLock();
  };

  const close = () => {
    if (!overlay) return;
    overlay.classList.remove('active');
    clearResults();
    clearInputs();
    syncBodyLock();
  };

  const switchTab = (tab) => {
    clearResults();

    if (tab === 'login') {
      tabLogin?.classList.add('active');
      tabLogin?.setAttribute('aria-selected', 'true');
      tabRegister?.classList.remove('active');
      tabRegister?.setAttribute('aria-selected', 'false');
      panelLogin?.classList.add('active');
      panelRegister?.classList.remove('active');
      return;
    }

    tabRegister?.classList.add('active');
    tabRegister?.setAttribute('aria-selected', 'true');
    tabLogin?.classList.remove('active');
    tabLogin?.setAttribute('aria-selected', 'false');
    panelRegister?.classList.add('active');
    panelLogin?.classList.remove('active');
  };

  const handleLogin = async () => {
    const email = document.getElementById('loginEmail')?.value.trim() || '';
    const password = document.getElementById('loginPass')?.value || '';

    if (!email || !password) {
      showResult('loginResult', '⚠️', 'Campos incompletos', 'Completa correo y contraseña.', true);
      return;
    }

    const response = await AppStorage.loginUser({ correo: email, password });

    if (!response.ok) {
      if (response.code === 'USER_NOT_FOUND') {
        showResult('loginResult', '🔍', 'Usuario no encontrado', 'No existe una cuenta con ese correo.', true);
      } else {
        showResult('loginResult', '❌', 'Credenciales incorrectas', 'La contraseña no coincide.', true);
      }
      return;
    }

    currentUser = response.user;
    updateNavbar();
    emitSessionChange();

    showResult(
      'loginResult',
      '✅',
      'Inicio de sesión exitoso',
      `Sesión activa para ${response.user.nombre}. Endpoint simulado: ${response.endpoint}`
    );

    setTimeout(close, 1200);
  };

  const handleRegister = async () => {
    const name = document.getElementById('regNombre')?.value.trim() || '';
    const email = document.getElementById('regEmail')?.value.trim() || '';
    const password = document.getElementById('regPass')?.value || '';
    const confirm = document.getElementById('regConfirm')?.value || '';

    if (!name || !email || !password || !confirm) {
      showResult('registerResult', '⚠️', 'Campos incompletos', 'Completa todos los campos del registro.', true);
      return;
    }

    if (!email.includes('@')) {
      showResult('registerResult', '📧', 'Correo inválido', 'Ingresa un correo válido.', true);
      return;
    }

    if (password !== confirm) {
      showResult('registerResult', '🔐', 'Contraseñas distintas', 'Las contraseñas no coinciden.', true);
      return;
    }

    const response = await AppStorage.registerUser({ nombre: name, correo: email, password });

    if (!response.ok) {
      showResult('registerResult', '🔁', 'Cuenta existente', 'Ese correo ya fue registrado.', true);
      return;
    }

    currentUser = response.user;
    updateNavbar();
    emitSessionChange();

    showResult(
      'registerResult',
      '🎉',
      'Cuenta creada',
      `Registro exitoso para ${response.user.nombre}. Endpoint simulado: ${response.endpoint}`
    );

    setTimeout(close, 1200);
  };

  const handleLogout = async () => {
    const response = await AppStorage.logoutUser();
    currentUser = null;
    updateNavbar();
    emitSessionChange();
    console.log(`Sesión cerrada en endpoint simulado ${response.endpoint}`);
  };

  const handleAuthTriggerClick = async (button, event) => {
    if (button.classList.contains('navbar__cta') && currentUser) {
      event.preventDefault();
      await handleLogout();
      return;
    }

    if (currentUser && !button.classList.contains('navbar__cta')) {
      event.preventDefault();
      window.location.hash = 'reserva';
      return;
    }

    event.preventDefault();
    open();
  };

  const init = () => {
    currentUser = AppStorage.getCurrentSessionUser();
    updateNavbar();
    emitSessionChange();

    if (btnClose) {
      btnClose.addEventListener('click', close);
    }

    if (overlay) {
      overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
          close();
        }
      });
    }

    tabLogin?.addEventListener('click', () => switchTab('login'));
    tabRegister?.addEventListener('click', () => switchTab('register'));

    document.getElementById('btnLogin')?.addEventListener('click', handleLogin);
    document.getElementById('btnRegister')?.addEventListener('click', handleRegister);

    document.querySelectorAll('#panelLogin input').forEach((input) => {
      input.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') handleLogin();
      });
    });

    document.querySelectorAll('#panelRegister input').forEach((input) => {
      input.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') handleRegister();
      });
    });

    document.querySelectorAll('[data-open-auth]').forEach((button) => {
      button.addEventListener('click', (event) => {
        void handleAuthTriggerClick(button, event);
      });
    });
  };

  return {
    init,
    open,
    isLoggedIn: () => Boolean(currentUser),
    getCurrentUser: () => currentUser
  };
})();

/* ============================================================
   5. RESERVA — Carrito y confirmación
   ============================================================ */
const ReservationCenter = (() => {
  const planButtons = document.querySelectorAll('.js-plan-select');
  const priceCards = document.querySelectorAll('.price-card[data-plan-id]');

  const bookingForm = document.getElementById('bookingForm');
  const bookingName = document.getElementById('bookingName');
  const bookingEmail = document.getElementById('bookingEmail');
  const bookingDate = document.getElementById('bookingDate');
  const bookingTime = document.getElementById('bookingTime');
  const bookingPeople = document.getElementById('bookingPeople');
  const bookingNotes = document.getElementById('bookingNotes');

  const bookingFormResult = document.getElementById('bookingFormResult');
  const bookingResult = document.getElementById('bookingResult');

  const planNameEl = document.getElementById('bookingPlanName');
  const planPriceEl = document.getElementById('bookingPlanPrice');
  const peopleDisplayEl = document.getElementById('bookingPeopleDisplay');
  const totalEl = document.getElementById('bookingEstimatedTotal');

  const peopleMinusBtn = document.getElementById('bookingPeopleMinus');
  const peoplePlusBtn = document.getElementById('bookingPeoplePlus');
  const confirmBookingBtn = document.getElementById('btnConfirmBooking');
  const clearBookingBtn = document.getElementById('btnClearBooking');

  const setResult = (element, message, isError = false) => {
    if (!element) return;
    element.textContent = message;
    element.classList.remove('app-result--ok', 'app-result--error');
    element.classList.add('show', isError ? 'app-result--error' : 'app-result--ok');
  };

  const clearResult = (element) => {
    if (!element) return;
    element.textContent = '';
    element.classList.remove('show', 'app-result--ok', 'app-result--error');
  };

  const getPlanFromButton = (button) => ({
    id: button.dataset.planId,
    name: button.dataset.planName,
    price: Number(button.dataset.planPrice || 0)
  });

  const highlightSelectedPlan = (planId) => {
    priceCards.forEach((card) => {
      card.classList.toggle('price-card--selected', card.dataset.planId === planId);
    });
  };

  const renderCart = () => {
    const cart = AppStorage.getCart();
    const selectedPlan = cart.plan;
    const people = cart.people;
    const total = selectedPlan ? selectedPlan.price * people : 0;

    if (planNameEl) {
      planNameEl.textContent = selectedPlan ? selectedPlan.name : 'Sin plan seleccionado';
    }

    if (planPriceEl) {
      planPriceEl.textContent = selectedPlan ? formatCLP(selectedPlan.price) : '$0';
    }

    if (peopleDisplayEl) {
      peopleDisplayEl.textContent = String(people);
    }

    if (bookingPeople) {
      bookingPeople.value = String(people);
    }

    if (totalEl) {
      totalEl.textContent = selectedPlan ? formatCLP(total) : '$0';
    }

    highlightSelectedPlan(selectedPlan?.id || null);
  };

  const collectFormData = () => ({
    name: bookingName?.value.trim() || '',
    email: bookingEmail?.value.trim() || '',
    date: bookingDate?.value || '',
    time: bookingTime?.value || '',
    people: Number(bookingPeople?.value || 0),
    notes: bookingNotes?.value.trim() || ''
  });

  const validateFormData = (data) => {
    if (!data.name || !data.email || !data.date || !data.time) {
      return 'Completa nombre, correo, fecha y hora.';
    }

    if (!data.email.includes('@')) {
      return 'Ingresa un correo válido para la reserva.';
    }

    if (Number.isNaN(data.people) || data.people < 1 || data.people > 20) {
      return 'La reserva debe tener entre 1 y 20 personas.';
    }

    return null;
  };

  const fillIdentity = (user) => {
    if (!user) return;
    if (bookingName && !bookingName.value.trim()) {
      bookingName.value = user.nombre;
    }
    if (bookingEmail && !bookingEmail.value.trim()) {
      bookingEmail.value = user.correo;
    }
  };

  const setMinBookingDate = () => {
    if (!bookingDate) return;
    const today = new Date();
    const isoDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
      .toISOString()
      .split('T')[0];
    bookingDate.min = isoDate;
  };

  const handlePlanSelection = (button) => {
    if (!AuthModal.isLoggedIn()) {
      setResult(bookingResult, 'Inicia sesión para seleccionar un plan.', true);
      AuthModal.open();
      return;
    }

    const plan = getPlanFromButton(button);
    AppStorage.selectPlan(plan);
    renderCart();

    setResult(
      bookingResult,
      `Plan "${plan.name}" agregado al carrito de reserva.`
    );

    window.location.hash = 'reserva';
  };

  const updatePeople = (nextPeople) => {
    AppStorage.setCartPeople(nextPeople);
    renderCart();
  };

  const handleDraftSave = (event) => {
    event.preventDefault();

    if (!AuthModal.isLoggedIn()) {
      setResult(bookingFormResult, 'Primero inicia sesión para guardar tu reserva.', true);
      AuthModal.open();
      return;
    }

    const data = collectFormData();
    const validationError = validateFormData(data);

    if (validationError) {
      setResult(bookingFormResult, validationError, true);
      return;
    }

    AppStorage.saveBookingDraft(data);
    AppStorage.setCartPeople(data.people);
    renderCart();

    setResult(bookingFormResult, 'Datos de reserva guardados localmente.');
  };

  const handleConfirmReservation = async () => {
    if (!AuthModal.isLoggedIn()) {
      setResult(bookingResult, 'Debes iniciar sesión para confirmar la reserva.', true);
      AuthModal.open();
      return;
    }

    const cart = AppStorage.getCart();
    if (!cart.plan) {
      setResult(bookingResult, 'Selecciona un plan en la sección Precios.', true);
      return;
    }

    const data = collectFormData();
    const validationError = validateFormData(data);

    if (validationError) {
      setResult(bookingResult, validationError, true);
      return;
    }

    const response = await AppStorage.createReservation({
      user: AuthModal.getCurrentUser(),
      plan: cart.plan,
      people: cart.people,
      total: cart.plan.price * cart.people,
      date: data.date,
      time: data.time,
      notes: data.notes
    });

    if (!response.ok) {
      setResult(bookingResult, 'No se pudo confirmar la reserva. Intenta nuevamente.', true);
      return;
    }

    AppStorage.clearSelectedPlan();
    renderCart();

    setResult(
      bookingResult,
      `Reserva confirmada (${response.reservation.id}) en endpoint simulado ${response.endpoint}.`
    );
  };

  const loadInitialData = () => {
    const draft = AppStorage.getBookingDraft();
    if (draft) {
      if (bookingName && draft.name) bookingName.value = draft.name;
      if (bookingEmail && draft.email) bookingEmail.value = draft.email;
      if (bookingDate && draft.date) bookingDate.value = draft.date;
      if (bookingTime && draft.time) bookingTime.value = draft.time;
      if (bookingNotes && draft.notes) bookingNotes.value = draft.notes;
      if (bookingPeople && draft.people) {
        bookingPeople.value = String(draft.people);
        AppStorage.setCartPeople(draft.people);
      }
    }

    fillIdentity(AuthModal.getCurrentUser());
    setMinBookingDate();
    renderCart();
  };

  const init = () => {
    if (!bookingForm) return;

    planButtons.forEach((button) => {
      button.addEventListener('click', () => handlePlanSelection(button));
    });

    bookingForm.addEventListener('submit', handleDraftSave);

    bookingPeople?.addEventListener('input', () => {
      const value = Number(bookingPeople.value || 1);
      updatePeople(value);
    });

    peopleMinusBtn?.addEventListener('click', () => {
      const people = AppStorage.getCart().people;
      updatePeople(people - 1);
    });

    peoplePlusBtn?.addEventListener('click', () => {
      const people = AppStorage.getCart().people;
      updatePeople(people + 1);
    });

    confirmBookingBtn?.addEventListener('click', () => {
      void handleConfirmReservation();
    });

    clearBookingBtn?.addEventListener('click', () => {
      AppStorage.clearCart();
      renderCart();
      clearResult(bookingResult);
      setResult(bookingFormResult, 'Carrito de reserva reiniciado.');
    });

    window.addEventListener('tenedorlibre:session-changed', (event) => {
      fillIdentity(event.detail?.user || null);
    });

    loadInitialData();
  };

  return { init };
})();

/* ============================================================
   6. CONTACTO — Ticket local
   ============================================================ */
const ContactCenter = (() => {
  const form = document.getElementById('contactForm');
  const nameInput = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  const topicInput = document.getElementById('contactTopic');
  const messageInput = document.getElementById('contactMessage');
  const resultEl = document.getElementById('contactResult');
  const historyList = document.getElementById('contactHistoryList');

  const setResult = (message, isError = false) => {
    if (!resultEl) return;
    resultEl.textContent = message;
    resultEl.classList.remove('app-result--ok', 'app-result--error');
    resultEl.classList.add('show', isError ? 'app-result--error' : 'app-result--ok');
  };

  const fillIdentity = (user) => {
    if (!user) return;
    if (nameInput && !nameInput.value.trim()) {
      nameInput.value = user.nombre;
    }
    if (emailInput && !emailInput.value.trim()) {
      emailInput.value = user.correo;
    }
  };

  const renderHistory = () => {
    if (!historyList) return;

    historyList.innerHTML = '';
    const contacts = AppStorage.getContacts().slice(0, 4);

    if (!contacts.length) {
      const emptyItem = document.createElement('li');
      emptyItem.className = 'contact-history__empty';
      emptyItem.textContent = 'Aún no hay tickets enviados.';
      historyList.appendChild(emptyItem);
      return;
    }

    contacts.forEach((ticket) => {
      const item = document.createElement('li');
      item.className = 'contact-history__item';

      const title = document.createElement('div');
      title.className = 'contact-history__item-title';
      title.textContent = `${ticket.id} · ${ticket.topic}`;

      const meta = document.createElement('div');
      meta.className = 'contact-history__item-meta';
      const sentAt = new Date(ticket.createdAt).toLocaleString('es-CL');
      meta.textContent = `${ticket.name} · ${sentAt}`;

      item.appendChild(title);
      item.appendChild(meta);
      historyList.appendChild(item);
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      name: nameInput?.value.trim() || '',
      email: emailInput?.value.trim() || '',
      topic: topicInput?.value || 'reserva',
      message: messageInput?.value.trim() || ''
    };

    if (!payload.name || !payload.email || !payload.message) {
      setResult('Completa nombre, correo y mensaje.', true);
      return;
    }

    if (!payload.email.includes('@')) {
      setResult('Ingresa un correo válido para contacto.', true);
      return;
    }

    if (payload.message.length < 10) {
      setResult('El mensaje debe tener al menos 10 caracteres.', true);
      return;
    }

    const response = await AppStorage.createContact(payload);

    if (!response.ok) {
      setResult('No se pudo registrar el ticket de contacto.', true);
      return;
    }

    setResult(`Ticket ${response.ticket.id} enviado a endpoint simulado ${response.endpoint}.`);
    if (messageInput) {
      messageInput.value = '';
    }

    renderHistory();
  };

  const init = () => {
    if (!form) return;

    fillIdentity(AuthModal.getCurrentUser());
    renderHistory();

    form.addEventListener('submit', (event) => {
      void handleSubmit(event);
    });

    window.addEventListener('tenedorlibre:session-changed', (event) => {
      fillIdentity(event.detail?.user || null);
    });
  };

  return { init };
})();

/* ============================================================
   7. CALCULADORA DE PRECIO POR EDAD
   ============================================================ */
const PriceCalculator = (() => {
  const PRECIO_REFERENCIA = 12500;

  const evaluarPrecio = (edad, precio) => {
    const edadNum = Number(edad);
    const precioNum = Number(precio);

    if (edadNum < 5) {
      return {
        tipo: 'free',
        emoji: '🎊',
        titulo: '¡Come gratis!',
        texto: 'Los menores de 5 años no pagan.',
        precio: '¡GRATIS! $0',
        precioFinal: 0
      };
    }

    if (edadNum >= 5 && edadNum <= 12) {
      const finalPrice = precioNum * 0.5;
      return {
        tipo: 'discount',
        emoji: '🎈',
        titulo: '¡50% de descuento!',
        texto: 'Entre 5 y 12 años pagan la mitad del precio.',
        precio: `${formatCLP(finalPrice)} (antes ${formatCLP(precioNum)})`,
        precioFinal: finalPrice
      };
    }

    return {
      tipo: 'full',
      emoji: '🍽️',
      titulo: 'Precio completo',
      texto: 'Desde los 13 años se paga el precio regular.',
      precio: formatCLP(precioNum),
      precioFinal: precioNum
    };
  };

  const calcularPrecioAutomatico = (edad) => {
    if (edad < 5) return 0;
    if (edad <= 12) return PRECIO_REFERENCIA * 0.5;
    return PRECIO_REFERENCIA;
  };

  const init = () => {
    const button = document.getElementById('btnCalcPrice');
    const ageInput = document.getElementById('inputEdad');
    const priceInput = document.getElementById('inputPrecio');
    const result = document.getElementById('calcResult');

    if (!button || !ageInput || !priceInput || !result) return;

    const setPriceFromAge = () => {
      const age = Number(ageInput.value);

      if (Number.isNaN(age) || ageInput.value === '') {
        priceInput.value = '';
        return null;
      }

      const autoPrice = calcularPrecioAutomatico(age);
      priceInput.value = String(autoPrice);
      return autoPrice;
    };

    const run = () => {
      const age = Number(ageInput.value);

      if (Number.isNaN(age) || ageInput.value === '' || age < 0 || age > 120) {
        priceInput.value = '';
        result.className = 'calc-result calc-result--full show';
        result.innerHTML = `
          <div class="calc-result__emoji">⚠️</div>
          <div class="calc-result__title">Edad inválida</div>
          <div class="calc-result__text">Ingresa una edad entre 0 y 120 años.</div>
        `;
        return;
      }

      const data = evaluarPrecio(age, PRECIO_REFERENCIA);
      priceInput.value = String(data.precioFinal);
      result.className = `calc-result calc-result--${data.tipo} show`;
      result.innerHTML = `
        <div class="calc-result__emoji">${data.emoji}</div>
        <div class="calc-result__title">${data.titulo}</div>
        <div class="calc-result__text">${data.texto}</div>
        <div class="calc-result__price">${data.precio}</div>
      `;
    };

    button.addEventListener('click', run);

    document.querySelectorAll('[data-age-example]').forEach((exampleButton) => {
      exampleButton.addEventListener('click', () => {
        ageInput.value = exampleButton.dataset.ageExample || '';
        setPriceFromAge();
        run();
      });
    });

    ageInput.addEventListener('input', () => {
      const autoPrice = setPriceFromAge();
      if (autoPrice !== null) {
        run();
      }
    });

    ageInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        run();
      }
    });
  };

  return { init };
})();

/* ============================================================
   INICIALIZACIÓN
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  AppStorage.init();
  Navbar.init();
  ScrollReveal.init();
  MenuFilter.init();
  AuthModal.init();
  ReservationCenter.init();
  ContactCenter.init();
  PriceCalculator.init();

  console.log('%c🍴 Tenedor Libre listo', 'color: #D63A6A; font-size: 1.1rem; font-weight: 700;');
});
