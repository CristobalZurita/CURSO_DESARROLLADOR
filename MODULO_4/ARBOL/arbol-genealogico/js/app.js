// ============================================
// app.js — Controlador principal de la SPA
// ============================================

(() => {

  // ---- Referencias DOM ----
  const screenWelcome   = document.getElementById('screen-welcome');
  const screenTree      = document.getElementById('screen-tree');
  const btnCalcular     = document.getElementById('btn-calcular');
  const inputNombre     = document.getElementById('input-nombre');
  const inputEdad       = document.getElementById('input-edad');
  const inputAnio       = document.getElementById('input-anio');
  const calcResult      = document.getElementById('calc-result');
  const resAnioNac      = document.getElementById('res-anio-nac');
  const resMayor        = document.getElementById('res-mayor');
  const resJoven        = document.getElementById('res-joven');
  const resMensaje      = document.getElementById('res-mensaje');
  const headerNombre    = document.getElementById('header-nombre');
  const headerInfo      = document.getElementById('header-info');
  const btnReset        = document.getElementById('btn-reset');
  const calculatorSection = document.getElementById('calculator-section');

  // Acceso fake-backend
  const authUsername    = document.getElementById('auth-username');
  const authPassword    = document.getElementById('auth-password');
  const authStatus      = document.getElementById('auth-status');
  const btnAuthLogin    = document.getElementById('btn-auth-login');
  const btnAuthLogout   = document.getElementById('btn-auth-logout');
  const adminPanel      = document.getElementById('admin-panel');
  const adminUsersList  = document.getElementById('admin-users-list');

  // Modal añadir pariente
  const modalOverlay    = document.getElementById('modal-overlay');
  const modalClose      = document.getElementById('modal-close');
  const modalTitle      = document.getElementById('modal-title');
  const modalDesc       = document.getElementById('modal-desc');
  const modalIcon       = document.getElementById('modal-icon');
  const mNombre         = document.getElementById('m-nombre');
  const mEdad           = document.getElementById('m-edad');
  const mRelacion       = document.getElementById('m-relacion');
  const calcValidation  = document.getElementById('calc-validation');
  const btnConfirmar    = document.getElementById('btn-confirmar-pariente');

  // Toast + advertencia menor
  const toast           = document.getElementById('toast');
  const minorWarningOverlay = document.getElementById('minor-warning-overlay');
  const btnMinorContinue    = document.getElementById('btn-minor-continue');
  const btnMinorCancel      = document.getElementById('btn-minor-cancel');

  let modalState = { parentId: null, parentNodo: null, relacion: null };
  let pendingMinorData = null;
  let toastTimer = null;
  let authSession = null;

  const btnCalcularDefaultHTML =
    '<span>Calcular y Crear mi Árbol</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';

  const NAME_REGEX = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?:[ '-][A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)*$/;

  function normalizarNombre(valor) {
    return String(valor || '').replace(/\s+/g, ' ').trim();
  }

  function validarNombre(valor) {
    return NAME_REGEX.test(valor);
  }

  function limpiarNombreInput(input) {
    if (!input) return;
    input.value = input.value
      .replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s'-]/g, '')
      .replace(/\s{2,}/g, ' ');
  }

  function limpiarUsuarioInput() {
    if (!authUsername) return;
    authUsername.value = authUsername.value
      .toLowerCase()
      .replace(/[^a-z0-9._-]/g, '')
      .trim();
  }

  function escapeHTML(value) {
    return String(value || '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function isUserSession() {
    return Boolean(authSession && authSession.role === 'user');
  }

  function isAdminSession() {
    return Boolean(authSession && authSession.role === 'admin');
  }

  function setCalcularLoading(isLoading) {
    btnCalcular.innerHTML = isLoading
      ? '<span>Creando tu árbol...</span> 🌱'
      : btnCalcularDefaultHTML;

    btnCalcular.disabled = isLoading || !isUserSession();
  }

  function closeMinorWarning() {
    if (minorWarningOverlay) {
      minorWarningOverlay.hidden = true;
    }
    document.body.classList.remove('body--modal-lock');
    pendingMinorData = null;
  }

  function openMinorWarning(data) {
    pendingMinorData = data;

    if (!minorWarningOverlay) {
      setTimeout(() => {
        iniciarArbol(data.nombre, data.edad, data.anioNacimiento);
      }, 600);
      return;
    }

    minorWarningOverlay.hidden = false;
    document.body.classList.add('body--modal-lock');
    btnMinorContinue?.focus();
  }

  function cancelMinorWarning() {
    closeMinorWarning();
    setCalcularLoading(false);
    showToast('Puedes revisar los datos antes de continuar.', 'info');
  }

  function continueMinorWarning() {
    if (!pendingMinorData) {
      closeMinorWarning();
      setCalcularLoading(false);
      return;
    }

    const { nombre, edad, anioNacimiento } = pendingMinorData;
    closeMinorWarning();
    setTimeout(() => {
      iniciarArbol(nombre, edad, anioNacimiento);
    }, 500);
  }

  function resetTreeHeader() {
    headerNombre.textContent = '';
    headerInfo.textContent = '';
  }

  function getAnioActualBase() {
    const parsed = Number(inputAnio.value);
    if (Number.isFinite(parsed) && parsed >= 2000 && parsed <= 2100) {
      return parsed;
    }
    return new Date().getFullYear();
  }

  function setWelcomeInputsFromProfile(profile) {
    if (!profile) return;
    if (profile.nombre) inputNombre.value = profile.nombre;
    if (profile.edad) inputEdad.value = String(profile.edad);
    if (profile.anioActual) {
      inputAnio.value = String(profile.anioActual);
      return;
    }
    if (profile.anioNacimiento && profile.edad) {
      inputAnio.value = String(profile.anioNacimiento + profile.edad);
    }
  }

  function loadTreeForCurrentUser({ openTreeScreen = false } = {}) {
    if (!isUserSession()) return false;

    window.FamilyTree.setStorageKeyForUser(authSession.username);
    const loaded = window.FamilyTree.cargarDeStorage();

    if (!loaded) {
      window.FamilyTree.resetTree({ removeStorage: false });
      setWelcomeInputsFromProfile(window.FakeBackendAuth.getUserProfile(authSession.username));
      return false;
    }

    const st = window.FamilyTree.getState();
    if (!st?.usuario?.nombre) return false;

    inputNombre.value = st.usuario.nombre;
    inputEdad.value = String(st.usuario.edad || '');
    if (st.usuario.anioActual) {
      inputAnio.value = String(st.usuario.anioActual);
    } else if (st.usuario.edad && st.usuario.anioNacimiento) {
      inputAnio.value = String(st.usuario.edad + st.usuario.anioNacimiento);
    }

    headerNombre.textContent = st.usuario.nombre;
    headerInfo.textContent = `${st.usuario.edad} años · Nacido/a en ${st.usuario.anioNacimiento}`;
    window.FamilyTree.renderTree();

    if (openTreeScreen) {
      showScreen('screen-tree');
    }

    return true;
  }

  function renderAdminUsers() {
    if (!adminUsersList) return;

    if (!isAdminSession()) {
      adminUsersList.innerHTML = '';
      return;
    }

    const users = window.FakeBackendAuth
      .getUsersSummary()
      .filter((user) => user.role !== 'admin');

    if (!users.length) {
      adminUsersList.innerHTML = '<p class="auth-card__status">No hay usuarios registrados todavía.</p>';
      return;
    }

    adminUsersList.innerHTML = users.map((user) => {
      const name = escapeHTML(user.username);
      const profileName = escapeHTML(user.profileName || 'Sin perfil');
      const treeStatus = user.hasTree ? 'Árbol guardado' : 'Sin árbol';

      return `
        <article class="admin-user" data-username="${name}">
          <div class="admin-user__meta">
            <span class="admin-user__name">@${name}</span>
            <span class="admin-user__desc">${profileName} · ${treeStatus}</span>
          </div>
          <button class="btn btn--ghost btn--sm admin-user__delete" type="button" data-action="delete-user">
            Eliminar
          </button>
        </article>
      `;
    }).join('');
  }

  function updateAuthUI() {
    if (!authStatus) return;

    if (!authSession) {
      authStatus.textContent = 'No hay sesión activa. Inicia sesión para cargar o crear tu árbol.';
      btnAuthLogout.hidden = true;
      adminPanel.hidden = true;
      calculatorSection?.classList.remove('calculator-card--disabled');
      setCalcularLoading(false);
      btnCalcular.disabled = true;
      return;
    }

    btnAuthLogout.hidden = false;

    if (isAdminSession()) {
      authStatus.innerHTML = 'Sesión activa: <span class="main-navbar__status-highlight">Administrador</span>. Puedes gestionar usuarios.';
      adminPanel.hidden = false;
      calculatorSection?.classList.add('calculator-card--disabled');
      setCalcularLoading(false);
      btnCalcular.disabled = true;
      renderAdminUsers();
      return;
    }

    adminPanel.hidden = true;
    calculatorSection?.classList.remove('calculator-card--disabled');
    authStatus.innerHTML = `Sesión activa: <span class="main-navbar__status-highlight">@${escapeHTML(authSession.username)}</span>.`;
    setCalcularLoading(false);
  }

  function closeUserSession(message) {
    window.FakeBackendAuth.logout();
    authSession = null;
    closeMinorWarning();
    closeModal();
    calcResult.hidden = true;
    resetTreeHeader();
    inputNombre.value = '';
    inputEdad.value = '';
    authPassword.value = '';
    window.FamilyTree.setStorageKeyForUser('');
    window.FamilyTree.resetTree({ removeStorage: false });
    showScreen('screen-welcome');
    updateAuthUI();
    showToast(message || 'Sesión cerrada.', 'info');
  }

  function handleAuthLogin() {
    if (!window.FakeBackendAuth) {
      showToast('No se pudo cargar el módulo de autenticación.', 'error');
      return;
    }

    const username = String(authUsername.value || '').trim().toLowerCase();
    const password = String(authPassword.value || '');

    const result = window.FakeBackendAuth.loginOrRegister(username, password);
    if (!result.ok) {
      showToast(result.message, 'error');
      return;
    }

    authSession = result.session;
    authPassword.value = '';
    updateAuthUI();

    if (isAdminSession()) {
      showScreen('screen-welcome');
      showToast('Sesión admin iniciada.', 'success');
      return;
    }

    const restored = loadTreeForCurrentUser({ openTreeScreen: true });

    if (restored) {
      showToast('Sesión iniciada. Recuperamos tu árbol guardado.', 'success');
      return;
    }

    showScreen('screen-welcome');
    calcResult.hidden = true;
    if (result.mode === 'register') {
      showToast('Cuenta creada. Ahora completa tus datos para crear tu árbol.', 'success');
    } else {
      showToast('Sesión iniciada. Puedes continuar con tu árbol.', 'success');
    }
  }

  // ---- Navegación entre pantallas ----
  function showScreen(id) {
    document.querySelectorAll('.screen').forEach((screen) => {
      screen.classList.remove('screen--active');
    });
    const target = document.getElementById(id);
    if (target) {
      target.classList.add('screen--active');
    }
  }

  // ---- Eventos de autenticación ----
  btnAuthLogin?.addEventListener('click', handleAuthLogin);

  btnAuthLogout?.addEventListener('click', () => {
    if (!authSession) return;
    if (confirm('¿Cerrar sesión? Tu árbol quedará guardado para tu próximo ingreso.')) {
      closeUserSession('Sesión cerrada. Tus datos quedaron guardados.');
    }
  });

  adminUsersList?.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action="delete-user"]');
    if (!button || !isAdminSession()) return;

    const row = button.closest('.admin-user');
    const username = row?.dataset?.username;
    if (!username) return;

    if (!confirm(`¿Eliminar al usuario @${username}? Esta acción también borra su árbol guardado.`)) {
      return;
    }

    const result = window.FakeBackendAuth.deleteUser(username);
    if (!result.ok) {
      showToast(result.message || 'No se pudo eliminar el usuario.', 'error');
      return;
    }

    renderAdminUsers();
    showToast(`Usuario @${username} eliminado.`, 'success');
  });

  // ---- Pantalla bienvenida / calculador ----
  btnCalcular.addEventListener('click', () => {
    if (!isUserSession()) {
      showToast('Inicia sesión con usuario y contraseña para crear o recuperar tu árbol.', 'error');
      authUsername.focus();
      return;
    }

    const nombre = normalizarNombre(inputNombre.value);
    const edad   = Number(inputEdad.value);
    const anio = getAnioActualBase();
    inputNombre.value = nombre;

    // Validaciones
    if (!nombre) {
      showToast('Por favor, ingresa tu nombre 🌿', 'error');
      inputNombre.focus();
      return;
    }
    if (!validarNombre(nombre)) {
      showToast('El nombre solo puede contener letras, espacios, guion o apóstrofe.', 'error');
      inputNombre.focus();
      return;
    }
    if (Number.isNaN(edad)) {
      showToast('Ingresa tu edad para continuar.', 'error');
      inputEdad.focus();
      return;
    }
    if (edad < 0) {
      showToast('La edad no puede ser negativa.', 'error');
      inputEdad.focus();
      return;
    }
    if (edad < 6) {
      showToast('La edad mínima para crear el árbol es 6 años.', 'error');
      inputEdad.focus();
      return;
    }
    if (edad > 120) {
      showToast('Ingresa una edad válida (máximo 120).', 'error');
      inputEdad.focus();
      return;
    }
    if (Number.isNaN(anio) || anio < 2000 || anio > 2100) {
      showToast('Ingresa un año válido', 'error');
      inputAnio.focus();
      return;
    }

    const resultado = window.Calculator.calcularDatosPersona(edad, anio);

    calcResult.hidden = false;
    resAnioNac.textContent = resultado.anioNacimiento;
    resMayor.textContent   = resultado.mayorEdad ? 'Sí ✓' : 'No ✗';
    resJoven.textContent   = resultado.jovenAdulto ? 'Sí ✓' : 'No ✗';

    const resEl = document.getElementById('resultado');
    if (resEl) resEl.textContent = resultado.mensaje;

    resMensaje.textContent = resultado.mensaje;
    setCalcularLoading(true);

    if (edad < 14) {
      openMinorWarning({
        nombre,
        edad,
        anioNacimiento: resultado.anioNacimiento,
      });
      return;
    }

    setTimeout(() => {
      iniciarArbol(nombre, edad, resultado.anioNacimiento);
    }, 1200);
  });

  function iniciarArbol(nombre, edad, anioNacimiento) {
    if (!isUserSession()) {
      setCalcularLoading(false);
      showToast('La sesión expiró. Inicia sesión nuevamente.', 'error');
      return;
    }

    headerNombre.textContent = nombre;
    headerInfo.textContent   = `${edad} años · Nacido/a en ${anioNacimiento}`;

    window.FamilyTree.setStorageKeyForUser(authSession.username);
    window.FamilyTree.init(nombre, edad, anioNacimiento);
    window.FakeBackendAuth.saveUserProfile(authSession.username, {
      nombre,
      edad,
      anioNacimiento,
      anioActual: getAnioActualBase()
    });

    showScreen('screen-tree');
    if (edad < 14) {
      showToast(`⚠️ ${nombre}: usa este árbol con asistencia de un adulto responsable.`, 'info');
    } else {
      showToast(`¡Bienvenido/a, ${nombre}! Tu árbol está listo 🌳`, 'success');
    }

    setCalcularLoading(false);
  }

  // ---- Botón salir (cierra sesión, no borra árbol) ----
  btnReset.addEventListener('click', () => {
    if (!authSession) {
      showScreen('screen-welcome');
      return;
    }

    if (confirm('¿Cerrar sesión y volver al inicio? Tu árbol quedará guardado para tu próximo ingreso.')) {
      closeUserSession('Sesión cerrada. Tus datos del árbol quedaron guardados.');
    }
  });

  // ---- MODAL: Abrir ----
  window.AppUI = {
    openModal(parentId, parentNodo, relacion) {
      modalState = { parentId, parentNodo, relacion };

      const meta = window.FamilyTree.TIPOS[relacion] || {};
      modalIcon.textContent  = meta.icon || '👤';
      modalTitle.textContent = `Añadir ${relacion}`;
      modalDesc.textContent  = `de ${parentNodo.nombre}`;
      mRelacion.value        = relacion;
      mNombre.value          = '';
      mEdad.value            = '';
      calcValidation.textContent = '';
      calcValidation.className   = 'calc-validation';

      modalOverlay.hidden = false;
      mNombre.focus();
    }
  };

  // ---- MODAL: Validación en tiempo real ----
  mEdad.addEventListener('input', () => {
    const edadPariente = parseInt(mEdad.value, 10);
    const state = window.FamilyTree.getState();
    const edadYo = state.usuario.edad;

    if (!edadPariente || edadPariente < 0) {
      calcValidation.textContent = '';
      calcValidation.className   = 'calc-validation';
      return;
    }

    const validacion = window.Calculator.validarEdadParentesco(
      edadPariente,
      edadYo,
      modalState.relacion,
      getAnioActualBase()
    );

    calcValidation.textContent = validacion.mensaje;
    calcValidation.className   = `calc-validation ${validacion.tipo}`;
  });

  // ---- MODAL: Confirmar ----
  btnConfirmar.addEventListener('click', () => {
    const nombre   = normalizarNombre(mNombre.value);
    const edad     = parseInt(mEdad.value, 10);
    const relacion = modalState.relacion;
    mNombre.value  = nombre;

    const state = window.FamilyTree.getState();
    const edadYo = state.usuario.edad;

    if (edadYo < 14 && (relacion === 'Hijo' || relacion === 'Hija')) {
      showToast('Si eres menor de 14 años no puedes añadir hijos en el árbol.', 'error');
      return;
    }

    if (!nombre) {
      showToast('Escribe el nombre del pariente', 'error');
      mNombre.focus();
      return;
    }
    if (!validarNombre(nombre)) {
      showToast('El nombre del pariente no puede llevar números.', 'error');
      mNombre.focus();
      return;
    }
    if (!edad || edad < 0 || edad > 130) {
      showToast('Ingresa una edad válida', 'error');
      mEdad.focus();
      return;
    }

    const validacion = window.Calculator.validarEdadParentesco(
      edad,
      edadYo,
      relacion,
      getAnioActualBase()
    );

    if (!validacion.valido) {
      showToast('La edad no es lógica para esta relación', 'error');
      calcValidation.textContent = validacion.mensaje;
      calcValidation.className   = `calc-validation ${validacion.tipo}`;
      return;
    }

    window.FamilyTree.addNodo(modalState.parentId, nombre, edad, relacion);
    closeModal();
    showToast(`${nombre} añadido/a al árbol 🌿`, 'success');
  });

  // ---- MODAL: Cerrar ----
  function closeModal() {
    modalOverlay.hidden = true;
    mNombre.value = '';
    mEdad.value   = '';
    calcValidation.textContent = '';
  }

  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (event) => {
    if (event.target === modalOverlay) closeModal();
  });

  btnMinorContinue?.addEventListener('click', continueMinorWarning);
  btnMinorCancel?.addEventListener('click', cancelMinorWarning);
  minorWarningOverlay?.addEventListener('click', (event) => {
    if (event.target === minorWarningOverlay) cancelMinorWarning();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;

    if (minorWarningOverlay && !minorWarningOverlay.hidden) {
      cancelMinorWarning();
      return;
    }

    closeModal();
  });

  // ---- Toast ----
  function showToast(msg, tipo = 'info') {
    toast.textContent = msg;
    toast.className   = `toast toast--${tipo} toast--show`;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.add('toast--hide');
      setTimeout(() => {
        toast.className = 'toast';
      }, 350);
    }, 3000);
  }

  // Año actual por defecto (evita quedar fijo en 2025)
  inputAnio.value = String(new Date().getFullYear());

  // ---- Cargar sesión guardada ----
  window.FakeBackendAuth.bootstrap();
  authSession = window.FakeBackendAuth.getSession();

  if (authSession && isUserSession()) {
    const restored = loadTreeForCurrentUser({ openTreeScreen: true });
    if (!restored) {
      showScreen('screen-welcome');
      setWelcomeInputsFromProfile(window.FakeBackendAuth.getUserProfile(authSession.username));
    }
  } else {
    showScreen('screen-welcome');
  }

  updateAuthUI();

  // ---- Teclas Enter ----
  [mNombre, mEdad].forEach((element) => {
    element.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') btnConfirmar.click();
    });
  });

  [inputNombre, inputEdad, inputAnio].forEach((element) => {
    element.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') btnCalcular.click();
    });
  });

  [authUsername, authPassword].forEach((element) => {
    element?.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') handleAuthLogin();
    });
  });

  [inputNombre, mNombre].forEach((input) => {
    input?.addEventListener('input', () => limpiarNombreInput(input));
  });

  authUsername?.addEventListener('input', limpiarUsuarioInput);

})();
