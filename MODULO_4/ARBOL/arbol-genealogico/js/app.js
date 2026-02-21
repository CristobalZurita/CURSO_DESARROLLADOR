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

  // Modal
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
  const toast           = document.getElementById('toast');

  let modalState = { parentId: null, parentNodo: null, relacion: null };
  let toastTimer = null;

  // ---- Navegación entre pantallas ----
  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => {
      s.classList.remove('screen--active');
    });
    const target = document.getElementById(id);
    if (target) {
      target.classList.add('screen--active');
      target.style.display = id === 'screen-welcome' ? 'flex' : 'flex';
    }
  }

  // ---- Pantalla de bienvenida / calculador ----
  btnCalcular.addEventListener('click', () => {
    const nombre = inputNombre.value.trim();
    const edad   = parseInt(inputEdad.value);
    const anio   = parseInt(inputAnio.value);

    // Validaciones
    if (!nombre) {
      showToast('Por favor, ingresa tu nombre 🌿', 'error');
      inputNombre.focus();
      return;
    }
    if (!edad || edad < 1 || edad > 120) {
      showToast('Ingresa una edad válida (1-120)', 'error');
      inputEdad.focus();
      return;
    }
    if (!anio || anio < 2000 || anio > 2100) {
      showToast('Ingresa un año válido', 'error');
      inputAnio.focus();
      return;
    }

    // --- Ejecutar calculador (reto) ---
    const resultado = window.Calculator.calcularDatosPersona(edad, anio);

    // Mostrar resultados en el DOM (requisito del reto)
    calcResult.hidden = false;
    resAnioNac.textContent = resultado.anioNacimiento;
    resMayor.textContent   = resultado.mayorEdad ? 'Sí ✓' : 'No ✗';
    resJoven.textContent   = resultado.jovenAdulto ? 'Sí ✓' : 'No ✗';

    // También en elemento #resultado si existiera (requisito HTML del reto)
    const resEl = document.getElementById('resultado');
    if (resEl) resEl.textContent = resultado.mensaje;

    resMensaje.textContent = resultado.mensaje;

    // Breve pausa y luego ir al árbol
    btnCalcular.disabled = true;
    btnCalcular.innerHTML = '<span>Creando tu árbol...</span> 🌱';

    setTimeout(() => {
      iniciarArbol(nombre, edad, resultado.anioNacimiento);
    }, 1800);
  });

  function iniciarArbol(nombre, edad, anioNacimiento) {
    // Actualizar header
    headerNombre.textContent = nombre;
    headerInfo.textContent   = `${edad} años · Nacido/a en ${anioNacimiento}`;

    // Inicializar árbol
    window.FamilyTree.init(nombre, edad, anioNacimiento);

    showScreen('screen-tree');
    showToast(`¡Bienvenido/a, ${nombre}! Tu árbol está listo 🌳`, 'success');

    // Resetear botón
    btnCalcular.disabled = false;
    btnCalcular.innerHTML = '<span>Calcular y Crear mi Árbol</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
  }

  // ---- Botón salir ----
  btnReset.addEventListener('click', () => {
    if (confirm('¿Salir? Tu árbol se guardará automáticamente.')) {
      showScreen('screen-welcome');
      calcResult.hidden = true;
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
    const edadPariente = parseInt(mEdad.value);
    const state = window.FamilyTree.getState();
    const edadYo = state.usuario.edad;

    if (!edadPariente || edadPariente < 0) {
      calcValidation.textContent = '';
      calcValidation.className   = 'calc-validation';
      return;
    }

    const validacion = window.Calculator.validarEdadParentesco(
      edadPariente, edadYo, modalState.relacion
    );

    calcValidation.textContent = validacion.mensaje;
    calcValidation.className   = `calc-validation ${validacion.tipo}`;
  });

  // ---- MODAL: Confirmar ----
  btnConfirmar.addEventListener('click', () => {
    const nombre   = mNombre.value.trim();
    const edad     = parseInt(mEdad.value);
    const relacion = modalState.relacion;

    if (!nombre) {
      showToast('Escribe el nombre del pariente', 'error');
      mNombre.focus();
      return;
    }
    if (!edad || edad < 0 || edad > 130) {
      showToast('Ingresa una edad válida', 'error');
      mEdad.focus();
      return;
    }

    // Validar edad vs parentesco
    const state   = window.FamilyTree.getState();
    const edadYo  = state.usuario.edad;
    const validacion = window.Calculator.validarEdadParentesco(edad, edadYo, relacion);

    if (!validacion.valido) {
      showToast('La edad no es lógica para esta relación', 'error');
      calcValidation.textContent = validacion.mensaje;
      calcValidation.className   = `calc-validation ${validacion.tipo}`;
      return;
    }

    // Añadir al árbol
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
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // ---- Toast ----
  function showToast(msg, tipo = 'info') {
    toast.textContent = msg;
    toast.className   = `toast toast--${tipo} toast--show`;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.add('toast--hide');
      setTimeout(() => { toast.className = 'toast'; }, 350);
    }, 3000);
  }

  // ---- Cargar sesión guardada ----
  const cargado = window.FamilyTree.cargarDeStorage();
  if (cargado) {
    const st = window.FamilyTree.getState();
    if (st.usuario.nombre) {
      // Prerellenar datos
      inputNombre.value = st.usuario.nombre;
      inputEdad.value   = st.usuario.edad;

      headerNombre.textContent = st.usuario.nombre;
      headerInfo.textContent   = `${st.usuario.edad} años · Nacido/a en ${st.usuario.anioNacimiento}`;
      window.FamilyTree.renderTree();
    }
  }

  // ---- Panel de confirmación Enter ----
  [mNombre, mEdad].forEach(el => {
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') btnConfirmar.click();
    });
  });

  [inputNombre, inputEdad, inputAnio].forEach(el => {
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') btnCalcular.click();
    });
  });

})();
