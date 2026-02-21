/**
 * ============================================================
 * TENEDOR LIBRE — main.js
 * 
 * Módulos:
 *  1. NavBar: scroll + hamburger
 *  2. Scroll Reveal
 *  3. Filtro de menú (tarjetas)
 *  4. Modal Auth (registro e inicio de sesión) — Desafío JS if-else
 *  5. Calculadora de precio por edad — Desafío Extra
 * ============================================================
 */

'use strict';

/* ============================================================
   1. NAVBAR — scroll y hamburger
   ============================================================ */
const Navbar = (() => {
  const navbar     = document.querySelector('.navbar');
  const hamburger  = document.querySelector('.navbar__hamburger');
  const links      = document.querySelector('.navbar__links');

  // Clase "scrolled" al bajar
  const onScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  // Menú mobile
  const toggleMenu = () => {
    const isOpen = links.style.display === 'flex';
    links.style.display = isOpen ? 'none' : 'flex';
    links.style.flexDirection = 'column';
    links.style.position = 'absolute';
    links.style.top = '70px';
    links.style.left = '0';
    links.style.right = '0';
    links.style.background = 'white';
    links.style.padding = '1rem 2rem 2rem';
    links.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
  };

  const init = () => {
    window.addEventListener('scroll', onScroll);
    if (hamburger) hamburger.addEventListener('click', toggleMenu);

    // Cerrar menú mobile al hacer click en un enlace
    document.querySelectorAll('.navbar__links a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 768) {
          links.style.display = 'none';
        }
      });
    });
  };

  return { init };
})();


/* ============================================================
   2. SCROLL REVEAL — Intersection Observer
   ============================================================ */
const ScrollReveal = (() => {
  const init = () => {
    const elements = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
  };

  return { init };
})();


/* ============================================================
   3. FILTRO DE MENÚ
   ============================================================ */
const MenuFilter = (() => {
  const init = () => {
    const filterBtns = document.querySelectorAll('.menu-section__filter-btn');
    const cards      = document.querySelectorAll('.menu-card[data-category]');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Estado activo
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        cards.forEach(card => {
          if (filter === 'all' || card.dataset.category === filter) {
            card.style.display = 'block';
            card.style.animation = 'fadeInUp 0.4s ease forwards';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  };

  return { init };
})();


/* ============================================================
   4. MODAL AUTH — Sistema de Login / Registro
   
   DESAFÍO: Evaluación con if-else
   - Preguntar si ya tiene cuenta (pestañas Login/Registro)
   - Validar credenciales con if-else
   - Mostrar mensajes de éxito o error
   ============================================================ */
const AuthModal = (() => {

  /* --- Base de datos simulada en memoria --- */
  let usersDB = [
    { nombre: 'Admin', correo: 'admin@tenedorlibre.com', password: '1234' }
  ];

  /* --- Estado del usuario logueado --- */
  let currentUser = null;

  /* --- Referencias DOM --- */
  const overlay    = document.getElementById('authModal');
  const btnClose   = document.querySelector('#authModal .modal__close');
  const tabLogin   = document.getElementById('tabLogin');
  const tabRegister= document.getElementById('tabRegister');
  const panelLogin = document.getElementById('panelLogin');
  const panelReg   = document.getElementById('panelRegister');

  /* ── Abrir modal ── */
  const open = () => {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  /* ── Cerrar modal ── */
  const close = () => {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    clearResults();
  };

  /* ── Cambiar pestaña ── */
  const switchTab = (tab) => {
    clearResults();
    if (tab === 'login') {
      tabLogin.classList.add('active');
      tabRegister.classList.remove('active');
      panelLogin.classList.add('active');
      panelReg.classList.remove('active');
    } else {
      tabRegister.classList.add('active');
      tabLogin.classList.remove('active');
      panelReg.classList.add('active');
      panelLogin.classList.remove('active');
    }
  };

  /* ── Limpiar resultados ── */
  const clearResults = () => {
    document.querySelectorAll('.modal__result').forEach(r => {
      r.classList.remove('show', 'error');
    });
    document.querySelectorAll('#authModal input').forEach(i => i.value = '');
  };

  /* ── Mostrar resultado ── */
  const showResult = (containerId, emoji, title, message, isError = false) => {
    const el = document.getElementById(containerId);
    el.querySelector('.modal__result__emoji').textContent  = emoji;
    el.querySelector('.modal__result__title').textContent  = title;
    el.querySelector('.modal__result__message').textContent= message;
    el.classList.toggle('error', isError);
    el.classList.add('show');
  };

  /* ── INICIO DE SESIÓN (if-else) ── */
  const handleLogin = () => {
    // Paso 2: pedir usuario y contraseña (ya están en los inputs del form)
    const correo   = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPass').value;

    // Convertir con Number() no aplica aquí (son strings), pero se valida correctamente
    // Validación: campos no vacíos
    if (correo === '' || password === '') {
      showResult('loginResult', '⚠️', 'Campos incompletos', 'Por favor completá todos los campos.', true);
      return;
    }

    // Paso 3 / Decisión con if-else: ¿Las credenciales son correctas?
    const user = usersDB.find(u => u.correo === correo);

    if (user) {
      // El usuario existe — verificar contraseña
      if (user.password === password) {
        // ✅ Acceso permitido
        currentUser = user;
        showResult('loginResult', '✅', '¡Acceso permitido!',
          `Bienvenido/a de vuelta, ${user.nombre}! Tu mesa está lista. 🍽️`);
        updateNavbar(user.nombre);
        setTimeout(close, 2500);
      } else {
        // ❌ Contraseña incorrecta
        showResult('loginResult', '❌', 'Error: Credenciales incorrectas',
          'La contraseña no coincide. Intentalo nuevamente.', true);
      }
    } else {
      // ❌ Usuario no existe
      showResult('loginResult', '🔍', 'Usuario no encontrado',
        'No existe una cuenta con ese correo. ¿Querés registrarte?', true);
    }
  };

  /* ── REGISTRO (if-else) ── */
  const handleRegister = () => {
    // Paso 4: si no tiene cuenta, pedir nombre, correo y contraseña
    const nombre   = document.getElementById('regNombre').value.trim();
    const correo   = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPass').value;
    const confirm  = document.getElementById('regConfirm').value;

    // Validar que los campos no estén vacíos
    if (!nombre || !correo || !password || !confirm) {
      showResult('registerResult', '⚠️', 'Campos incompletos',
        'Completá todos los campos para registrarte.', true);
      return;
    }

    // Validar que sea un correo con @
    if (!correo.includes('@')) {
      showResult('registerResult', '📧', 'Correo inválido',
        'Ingresá una dirección de correo válida.', true);
      return;
    }

    // Validar que las contraseñas coincidan
    if (password !== confirm) {
      showResult('registerResult', '🔐', 'Las contraseñas no coinciden',
        'Asegurate de escribir la misma contraseña dos veces.', true);
      return;
    }

    // ¿Ya existe ese correo?
    const yaExiste = usersDB.find(u => u.correo === correo);
    if (yaExiste) {
      showResult('registerResult', '🔁', 'Cuenta existente',
        'Ya existe una cuenta con ese correo. Iniciá sesión.', true);
      return;
    }

    // ✅ Registro exitoso — agregar a la "DB" simulada
    const nuevoUsuario = { nombre, correo, password };
    usersDB.push(nuevoUsuario);
    currentUser = nuevoUsuario;

    // Paso 5: Confirmar registro exitoso y permitir inicio de sesión
    showResult('registerResult', '🎉', '¡Registro exitoso!',
      `Bienvenido/a ${nombre}! Tu cuenta fue creada. Ahora podés iniciar sesión. 🍴`);
    updateNavbar(nombre);
    setTimeout(() => switchTab('login'), 2500);
  };

  /* ── Actualizar navbar ── */
  const updateNavbar = (nombre) => {
    const ctaBtn = document.querySelector('.navbar__cta');
    if (ctaBtn) {
      ctaBtn.textContent = `👤 ${nombre}`;
      ctaBtn.style.background = '#2DA58E';
    }
  };

  /* ── Init ── */
  const init = () => {
    // Abrir modal desde botones
    document.querySelectorAll('[data-open-auth]').forEach(btn => {
      btn.addEventListener('click', open);
    });

    // Cerrar
    if (btnClose) btnClose.addEventListener('click', close);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });

    // Tabs
    if (tabLogin)    tabLogin.addEventListener('click', () => switchTab('login'));
    if (tabRegister) tabRegister.addEventListener('click', () => switchTab('register'));

    // Submit login
    const btnLogin = document.getElementById('btnLogin');
    if (btnLogin) btnLogin.addEventListener('click', handleLogin);

    // Submit register
    const btnRegister = document.getElementById('btnRegister');
    if (btnRegister) btnRegister.addEventListener('click', handleRegister);

    // Enter en inputs
    document.querySelectorAll('#panelLogin input').forEach(input => {
      input.addEventListener('keypress', e => { if (e.key === 'Enter') handleLogin(); });
    });
    document.querySelectorAll('#panelRegister input').forEach(input => {
      input.addEventListener('keypress', e => { if (e.key === 'Enter') handleRegister(); });
    });
  };

  return { init };
})();


/* ============================================================
   5. CALCULADORA DE PRECIO POR EDAD
   
   DESAFÍO EXTRA: "Comida Gratis en un Restaurante"
   
   Reglas (evaluadas con if-else + Number()):
   - Menores de 5 años   → Comen gratis
   - Entre 5 y 12 años  → 50% de descuento
   - Más de 12 años     → Pagan precio completo
   ============================================================ */
const PriceCalculator = (() => {

  const PRECIO_REFERENCIA = 12500; // precio en pesos de referencia

  /**
   * Determina el precio según la edad usando if-else
   * @param {number} edad - edad de la persona
   * @param {number} precio - precio base del plato
   * @returns {Object} resultado con tipo, emoji, título, texto y precio final
   */
  const evaluarPrecio = (edad, precio) => {
    // Convertir correctamente el valor ingresado a un número con Number()
    const edadNum  = Number(edad);
    const precioNum= Number(precio);

    // --- Estructura if-else para determinar la situación ---
    if (edadNum < 5) {
      // Menores de 5 años: comen GRATIS
      return {
        tipo:   'free',
        emoji:  '🎊',
        titulo: '¡Come gratis!',
        texto:  `Los menores de 5 años no pagan. ¡El restaurante los recibe con gusto!`,
        precio: '¡GRATIS! $0'
      };
    } else if (edadNum >= 5 && edadNum <= 12) {
      // Entre 5 y 12 años: 50% de descuento
      const precioFinal = precioNum * 0.5;
      return {
        tipo:   'discount',
        emoji:  '🎈',
        titulo: '¡50% de descuento!',
        texto:  `Entre 5 y 12 años tienen la mitad del precio. ¡Comida para todos!`,
        precio: `$${precioFinal.toLocaleString('es-AR')} (antes $${precioNum.toLocaleString('es-AR')})`
      };
    } else {
      // Más de 12 años: precio completo
      return {
        tipo:   'full',
        emoji:  '🍽️',
        titulo: 'Precio completo',
        texto:  `Mayores de 12 años pagan el precio regular del menú.`,
        precio: `$${precioNum.toLocaleString('es-AR')}`
      };
    }
  };

  const init = () => {
    const btnCalc    = document.getElementById('btnCalcPrice');
    const inputEdad  = document.getElementById('inputEdad');
    const inputPrecio= document.getElementById('inputPrecio');
    const resultDiv  = document.getElementById('calcResult');

    if (!btnCalc) return;

    btnCalc.addEventListener('click', () => {
      // Usar Number() para convertir correctamente el valor ingresado
      const edad   = Number(inputEdad.value);
      const precio = Number(inputPrecio.value) || PRECIO_REFERENCIA;

      // Validación básica
      if (isNaN(edad) || inputEdad.value === '' || edad < 0 || edad > 120) {
        resultDiv.className = 'calc-result calc-result--full show';
        resultDiv.innerHTML = `
          <div class="calc-result__emoji">⚠️</div>
          <div class="calc-result__title">Edad inválida</div>
          <div class="calc-result__text">Ingresá una edad entre 0 y 120 años.</div>
        `;
        return;
      }

      const resultado = evaluarPrecio(edad, precio);

      resultDiv.className = `calc-result calc-result--${resultado.tipo} show`;
      resultDiv.innerHTML = `
        <div class="calc-result__emoji">${resultado.emoji}</div>
        <div class="calc-result__title">${resultado.titulo}</div>
        <div class="calc-result__text">${resultado.texto}</div>
        <div class="calc-result__price">${resultado.precio}</div>
      `;
    });

    // Enter en el input
    if (inputEdad) {
      inputEdad.addEventListener('keypress', e => {
        if (e.key === 'Enter') btnCalc.click();
      });
    }
  };

  return { init };
})();


/* ============================================================
   INICIALIZACIÓN DE LA APP
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  Navbar.init();
  ScrollReveal.init();
  MenuFilter.init();
  AuthModal.init();
  PriceCalculator.init();

  console.log('%c🍴 Tenedor Libre cargado correctamente', 
    'color: #D63A6A; font-family: serif; font-size: 1.2rem; font-weight: bold;');
});
