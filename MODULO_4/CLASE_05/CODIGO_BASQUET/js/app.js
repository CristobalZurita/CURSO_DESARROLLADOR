/**
 * Basketball Tournament Registration
 * app.js — Lógica principal de la aplicación
 *
 * Variables, validaciones, condicionales y manejo de lista
 */

'use strict';

// =============================================================================
// ESTADO GLOBAL
// =============================================================================

/** @type {Array<Object>} Lista de jugadores registrados */
let jugadores = [];
let equiposSnapshot = null;
let equiposDesactualizados = false;
let nextJugadorId = 1;

/** Posiciones válidas del básquetbol */
const POSICIONES_VALIDAS = ['base', 'escolta', 'alero', 'ala-pivot', 'pivot'];

/** Requisitos mínimos de inscripción */
const REQUISITOS = {
  edadMinima: 16,          // Edad mínima para registrarse
  edadAdulto: 18,          // Corte categoría adulto (>= 18)
  alturaMinima: 160        // Altura mínima en cm (se registra igual pero se notifica)
};

/** Regex: solo letras (incluye tildes/ñ) y espacios entre palabras */
const REGEX_NOMBRE = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?:\s+[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)*$/u;

/** Carga automática de jugadores demo para pruebas */
const CARGAR_DEMO_AL_INICIO = true;

/** Configuración de armado de torneo */
const TORNEO_CFG = {
  formato: 'FIBA',
  jugadoresPorEquipo: 12,
  titularesPorEquipo: 5,
  equiposMinimosPorCategoria: 2
};
TORNEO_CFG.bancaPorEquipo = TORNEO_CFG.jugadoresPorEquipo - TORNEO_CFG.titularesPorEquipo;

/** Temas disponibles para cambio dinámico (incluye original/base) */
const THEMES_NBA = ['original', 'lakers', 'celtics', 'bulls', 'heat', 'pistons'];
const THEME_STORAGE_KEY = 'torneo_nba_theme';
const PLAYERS_STORAGE_KEY = 'torneo_players_data';
const PLAYERS_NEXT_ID_KEY = 'torneo_players_next_id';
const PLAYERS_STORAGE_TEST_KEY = 'torneo_players_storage_test';

let playersStorageWarned = false;
const playersStorage = (() => {
  const storages = [() => window.localStorage, () => window.sessionStorage];
  for (const getStorage of storages) {
    try {
      const storage = getStorage();
      storage.setItem(PLAYERS_STORAGE_TEST_KEY, 'ok');
      storage.removeItem(PLAYERS_STORAGE_TEST_KEY);
      return storage;
    } catch (_) {
      // Continúa al siguiente storage disponible.
    }
  }
  return null;
})();

/** Dataset demo (60 jugadores: 30 adultos + 30 juveniles) */
const JUGADORES_DEMO = [
  { nombre: 'Carlos Mendez', edad: 24, altura: 182, posicion: 'base' },
  { nombre: 'Diego Rojas', edad: 22, altura: 188, posicion: 'escolta' },
  { nombre: 'Matias Soto', edad: 25, altura: 194, posicion: 'alero' },
  { nombre: 'Sebastian Diaz', edad: 27, altura: 201, posicion: 'ala-pivot' },
  { nombre: 'Nicolas Vega', edad: 28, altura: 210, posicion: 'pivot' },
  { nombre: 'Andres Fuentes', edad: 23, altura: 180, posicion: 'base' },
  { nombre: 'Benjamin Castro', edad: 26, altura: 191, posicion: 'escolta' },
  { nombre: 'Javier Morales', edad: 29, altura: 197, posicion: 'alero' },
  { nombre: 'Francisco Silva', edad: 30, altura: 205, posicion: 'ala-pivot' },
  { nombre: 'Tomas Herrera', edad: 24, altura: 213, posicion: 'pivot' },
  { nombre: 'Felipe Navarro', edad: 21, altura: 178, posicion: 'base' },
  { nombre: 'Ignacio Cardenas', edad: 23, altura: 186, posicion: 'escolta' },
  { nombre: 'Cristian Paredes', edad: 27, altura: 196, posicion: 'alero' },
  { nombre: 'Rodrigo Aguilar', edad: 31, altura: 204, posicion: 'ala-pivot' },
  { nombre: 'Pablo Contreras', edad: 32, altura: 214, posicion: 'pivot' },
  { nombre: 'Emilio Valdes', edad: 20, altura: 176, posicion: 'base' },
  { nombre: 'Vicente Leon', edad: 22, altura: 189, posicion: 'escolta' },
  { nombre: 'Alonso Araya', edad: 26, altura: 198, posicion: 'alero' },
  { nombre: 'Martin Vidal', edad: 28, altura: 206, posicion: 'ala-pivot' },
  { nombre: 'Eduardo Campos', edad: 29, altura: 211, posicion: 'pivot' },
  { nombre: 'Patricio Salas', edad: 24, altura: 181, posicion: 'base' },
  { nombre: 'Hector Bustos', edad: 25, altura: 190, posicion: 'escolta' },
  { nombre: 'Ramon Correa', edad: 27, altura: 195, posicion: 'alero' },
  { nombre: 'Luis Saavedra', edad: 30, altura: 203, posicion: 'ala-pivot' },
  { nombre: 'Gabriel Nuñez', edad: 33, altura: 215, posicion: 'pivot' },
  { nombre: 'Alexis Flores', edad: 21, altura: 177, posicion: 'base' },
  { nombre: 'Esteban Jara', edad: 23, altura: 187, posicion: 'escolta' },
  { nombre: 'Bruno Loyola', edad: 26, altura: 199, posicion: 'alero' },
  { nombre: 'Mauricio Orellana', edad: 28, altura: 207, posicion: 'ala-pivot' },
  { nombre: 'Renato Escobar', edad: 31, altura: 212, posicion: 'pivot' },

  { nombre: 'Matias Perez', edad: 16, altura: 168, posicion: 'base' },
  { nombre: 'Simon Riquelme', edad: 17, altura: 174, posicion: 'escolta' },
  { nombre: 'Joaquin Riveros', edad: 16, altura: 179, posicion: 'alero' },
  { nombre: 'Vicente Cabrera', edad: 17, altura: 184, posicion: 'ala-pivot' },
  { nombre: 'Martin Reyes', edad: 16, altura: 190, posicion: 'pivot' },
  { nombre: 'Alvaro Valenzuela', edad: 17, altura: 170, posicion: 'base' },
  { nombre: 'Lucas Miranda', edad: 16, altura: 176, posicion: 'escolta' },
  { nombre: 'Benjamin Ibarra', edad: 17, altura: 181, posicion: 'alero' },
  { nombre: 'Cristobal Garrido', edad: 16, altura: 186, posicion: 'ala-pivot' },
  { nombre: 'Franco Molina', edad: 17, altura: 192, posicion: 'pivot' },
  { nombre: 'Nicolas Moya', edad: 16, altura: 169, posicion: 'base' },
  { nombre: 'Agustin Bravo', edad: 17, altura: 175, posicion: 'escolta' },
  { nombre: 'Diego Alarcon', edad: 16, altura: 180, posicion: 'alero' },
  { nombre: 'Sebastian Pino', edad: 17, altura: 187, posicion: 'ala-pivot' },
  { nombre: 'Tomas Leiva', edad: 16, altura: 193, posicion: 'pivot' },
  { nombre: 'Ignacio Montero', edad: 17, altura: 171, posicion: 'base' },
  { nombre: 'Cristian Salgado', edad: 16, altura: 177, posicion: 'escolta' },
  { nombre: 'Pablo Benavides', edad: 17, altura: 182, posicion: 'alero' },
  { nombre: 'Felipe Tapia', edad: 16, altura: 188, posicion: 'ala-pivot' },
  { nombre: 'Rodrigo Toro', edad: 17, altura: 194, posicion: 'pivot' },
  { nombre: 'Hector Carrasco', edad: 16, altura: 172, posicion: 'base' },
  { nombre: 'Emilio Figueroa', edad: 17, altura: 178, posicion: 'escolta' },
  { nombre: 'Ramon Becerra', edad: 16, altura: 183, posicion: 'alero' },
  { nombre: 'Alexis Cisternas', edad: 17, altura: 189, posicion: 'ala-pivot' },
  { nombre: 'Javier Escalona', edad: 16, altura: 195, posicion: 'pivot' },
  { nombre: 'Patricio Manriquez', edad: 17, altura: 173, posicion: 'base' },
  { nombre: 'Renato Saez', edad: 16, altura: 179, posicion: 'escolta' },
  { nombre: 'Bruno Arriagada', edad: 17, altura: 184, posicion: 'alero' },
  { nombre: 'Mauricio Lobos', edad: 16, altura: 190, posicion: 'ala-pivot' },
  { nombre: 'Gabriel Rozas', edad: 17, altura: 196, posicion: 'pivot' }
];

// =============================================================================
// ELEMENTOS DEL DOM
// =============================================================================

const form          = document.getElementById('form-registro');
const inputNombre   = document.getElementById('nombre');
const inputEdad     = document.getElementById('edad');
const inputAltura   = document.getElementById('altura');
const selectPos     = document.getElementById('posicion');
const playersList   = document.getElementById('players-list');
const countBadge    = document.getElementById('count-badge');
const statTotal     = document.getElementById('stat-total');
const statAdultos   = document.getElementById('stat-adultos');
const statJuveniles = document.getElementById('stat-juveniles');
const btnClear      = document.getElementById('btn-clear');
const btnTeams      = document.getElementById('btn-teams');
const btnViewTeams  = document.getElementById('btn-view-teams');
const modalOverlay  = document.getElementById('modal-equipos');
const modalClose    = document.getElementById('modal-close');
const teamAdultoList   = document.getElementById('team-adulto-list');
const teamJuvenilList  = document.getElementById('team-juvenil-list');
const teamAdultoCount  = document.getElementById('team-adulto-count');
const teamJuvenilCount = document.getElementById('team-juvenil-count');
const teamLooseCount   = document.getElementById('team-loose-count');
const teamLooseList    = document.getElementById('team-loose-list');
const modalNoteText    = document.querySelector('.modal-note__text');
const themeButtons     = Array.from(document.querySelectorAll('.theme-chip'));

// =============================================================================
// TEMAS NBA (FOOTER)
// =============================================================================

/**
 * Persiste el tema seleccionado en localStorage
 * @param {string|null} themeName
 */
function guardarTema(themeName) {
  try {
    if (themeName) {
      localStorage.setItem(THEME_STORAGE_KEY, themeName);
    } else {
      localStorage.removeItem(THEME_STORAGE_KEY);
    }
  } catch (_) {
    // Si el navegador bloquea storage, se ignora de forma segura.
  }
}

/**
 * Recupera tema guardado previamente
 * @returns {string|null}
 */
function obtenerTemaGuardado() {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY);
  } catch (_) {
    return null;
  }
}

/**
 * Aplica clase de tema en body y estado activo en botones
 * @param {string|null} themeName
 * @param {boolean} persist
 */
function aplicarTemaNBA(themeName, persist = true) {
  const validTheme = THEMES_NBA.includes(themeName) ? themeName : 'original';
  const themeClasses = THEMES_NBA
    .filter((theme) => theme !== 'original')
    .map((theme) => `theme--${theme}`);

  document.body.classList.remove(...themeClasses);

  themeButtons.forEach((button) => {
    const isActive = button.dataset.theme === validTheme;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });

  if (validTheme !== 'original') {
    document.body.classList.add(`theme--${validTheme}`);
  }

  if (persist) {
    guardarTema(validTheme);
  }
}

/**
 * Inicializa eventos del selector de temas del footer
 */
function inicializarTemasNBA() {
  if (!themeButtons.length) return;

  themeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      aplicarTemaNBA(button.dataset.theme);
    });
  });

  const savedTheme = obtenerTemaGuardado() || 'original';
  aplicarTemaNBA(savedTheme, false);
}

// =============================================================================
// VALIDACIONES
// =============================================================================

/**
 * Valida el nombre del jugador
 * @param {string} nombre
 * @returns {{ valid: boolean, message: string }}
 */
function validarNombre(nombre) {
  if (!nombre || nombre.trim() === '') {
    return { valid: false, message: 'El nombre no puede estar vacío.' };
  }
  if (typeof nombre !== 'string') {
    return { valid: false, message: 'El nombre ingresado no es válido.' };
  }

  const nombreLimpio = nombre.trim().replace(/\s+/g, ' ');

  if (nombreLimpio.length < 2) {
    return { valid: false, message: 'El nombre debe tener al menos 2 caracteres.' };
  }
  if (nombreLimpio.length > 60) {
    return { valid: false, message: 'El nombre es demasiado largo.' };
  }

  if (!REGEX_NOMBRE.test(nombreLimpio)) {
    return { valid: false, message: 'Solo se permiten letras y espacios en el nombre.' };
  }

  return { valid: true, message: '' };
}

/**
 * Valida la edad del jugador
 * @param {string|number} edad
 * @returns {{ valid: boolean, message: string }}
 */
function validarEdad(edad) {
  if (edad === '' || edad === null || edad === undefined) {
    return { valid: false, message: 'La edad no puede estar vacía.' };
  }

  const edadNum = Number(edad);

  if (isNaN(edadNum) || !Number.isInteger(edadNum)) {
    return { valid: false, message: 'La edad debe ser un número entero válido.' };
  }

  if (edadNum < REQUISITOS.edadMinima) {
    return { valid: false, message: `Edad mínima para participar: ${REQUISITOS.edadMinima} años.` };
  }

  if (edadNum > 65) {
    return { valid: false, message: 'Por favor ingrese una edad válida (máx. 65).' };
  }

  return { valid: true, message: '' };
}

/**
 * Valida la altura del jugador
 * @param {string|number} altura
 * @returns {{ valid: boolean, message: string }}
 */
function validarAltura(altura) {
  if (altura === '' || altura === null || altura === undefined) {
    return { valid: false, message: 'La altura no puede estar vacía.' };
  }

  const alturaNum = Number(altura);

  if (isNaN(alturaNum)) {
    return { valid: false, message: 'Ingrese una altura válida en cm.' };
  }

  if (alturaNum < 160 || alturaNum > 250) {
    return { valid: false, message: 'Altura debe estar entre 160 y 250 cm (inclusive).' };
  }

  return { valid: true, message: '' };
}

/**
 * Valida la posición del jugador
 * @param {string} posicion
 * @returns {{ valid: boolean, message: string }}
 */
function validarPosicion(posicion) {
  if (!posicion || posicion === '') {
    return { valid: false, message: 'Selecciona una posición.' };
  }

  if (!POSICIONES_VALIDAS.includes(posicion)) {
    return { valid: false, message: `Posición inválida. Opciones: ${POSICIONES_VALIDAS.join(', ')}.` };
  }

  return { valid: true, message: '' };
}

// =============================================================================
// LÓGICA DE CLASIFICACIÓN
// =============================================================================

/**
 * Determina la categoría del jugador según su edad
 * @param {number} edad
 * @returns {'adulto'|'juvenil'}
 */
function determinarCategoria(edad) {
  return edad >= REQUISITOS.edadAdulto ? 'adulto' : 'juvenil';
}

function limpiarPersistenciaJugadores() {
  if (!playersStorage) return;
  try {
    playersStorage.removeItem(PLAYERS_STORAGE_KEY);
    playersStorage.removeItem(PLAYERS_NEXT_ID_KEY);
  } catch (_) {
    // Si storage no está disponible, se ignora.
  }
}

function guardarPersistenciaJugadores() {
  if (!playersStorage) {
    if (!playersStorageWarned) {
      playersStorageWarned = true;
      showToast('Tu navegador bloquea guardado local. Al recargar volverás a la base.', 'info');
    }
    return;
  }
  try {
    if (!jugadores.length) {
      limpiarPersistenciaJugadores();
      return;
    }
    playersStorage.setItem(PLAYERS_STORAGE_KEY, JSON.stringify(jugadores));
    playersStorage.setItem(PLAYERS_NEXT_ID_KEY, String(nextJugadorId));
  } catch (_) {
    if (!playersStorageWarned) {
      playersStorageWarned = true;
      showToast('No se pudo guardar la lista en este navegador.', 'info');
    }
  }
}

function normalizarJugadorPersistido(jugador, index) {
  const edad = Number(jugador?.edad);
  const altura = Number(jugador?.altura);
  const posicion = POSICIONES_VALIDAS.includes(jugador?.posicion) ? jugador.posicion : 'base';
  const id = Number(jugador?.id);
  const categoria = jugador?.categoria === 'adulto' || jugador?.categoria === 'juvenil'
    ? jugador.categoria
    : determinarCategoria(Number.isFinite(edad) ? edad : REQUISITOS.edadMinima);
  const aprobado = Boolean(jugador?.aprobado);

  return {
    id: Number.isFinite(id) && id > 0 ? id : index + 1,
    numero: index + 1,
    nombre: typeof jugador?.nombre === 'string' && jugador.nombre.trim() ? jugador.nombre.trim() : 'SIN NOMBRE',
    edad: Number.isFinite(edad) ? edad : REQUISITOS.edadMinima,
    altura: Number.isFinite(altura) ? altura : REQUISITOS.alturaMinima,
    posicion,
    categoria,
    aprobado,
    motivos: Array.isArray(jugador?.motivos) ? jugador.motivos.filter((m) => typeof m === 'string') : [],
    equipo: aprobado && typeof jugador?.equipo === 'string' && jugador.equipo.trim() ? jugador.equipo : null,
    rolTorneo: aprobado && typeof jugador?.rolTorneo === 'string' && jugador.rolTorneo.trim() ? jugador.rolTorneo : null,
    timestamp: typeof jugador?.timestamp === 'string' && jugador.timestamp.trim()
      ? jugador.timestamp
      : new Date().toLocaleTimeString('es-CL')
  };
}

function cargarPersistenciaJugadores() {
  if (!playersStorage) return false;
  try {
    const raw = playersStorage.getItem(PLAYERS_STORAGE_KEY);
    if (!raw) return false;

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      limpiarPersistenciaJugadores();
      return false;
    }

    jugadores = parsed.map((jugador, index) => normalizarJugadorPersistido(jugador, index));

    const maxId = jugadores.reduce((max, jugador) => {
      const id = Number(jugador.id);
      return Number.isFinite(id) && id > max ? id : max;
    }, 0);
    const storedNextId = Number(playersStorage.getItem(PLAYERS_NEXT_ID_KEY));
    nextJugadorId = Number.isFinite(storedNextId) && storedNextId > maxId
      ? storedNextId
      : maxId + 1;

    equiposSnapshot = null;
    equiposDesactualizados = jugadores.some((j) => Boolean(j.equipo) || Boolean(j.rolTorneo));

    renderizarListaCompleta();
    actualizarStats();
    return true;
  } catch (_) {
    limpiarPersistenciaJugadores();
    return false;
  }
}

/**
 * Verifica si el jugador cumple los requisitos mínimos
 * @param {Object} jugador
 * @returns {{ aprobado: boolean, motivos: string[] }}
 */
function verificarRequisitos(jugador) {
  const motivos = [];

  if (jugador.edad < REQUISITOS.edadMinima) {
    motivos.push(`Edad insuficiente (mínimo ${REQUISITOS.edadMinima} años)`);
  }

  if (!POSICIONES_VALIDAS.includes(jugador.posicion)) {
    motivos.push('Posición no válida');
  }

  return {
    aprobado: motivos.length === 0,
    motivos
  };
}

// =============================================================================
// REGISTRO DE JUGADOR
// =============================================================================

/**
 * Registra un nuevo jugador con validación completa
 * @param {Object} datos - Datos del formulario
 * @param {{ notify?: boolean, animate?: boolean, persist?: boolean }} [options]
 */
function registrarJugador(datos, options = {}) {
  const { notify = true, animate = true, persist = true } = options;

  // Declarar variables con los datos ingresados
  const nombre   = datos.nombre.trim().replace(/\s+/g, ' ');
  const edad     = Number(datos.edad);
  const altura   = Number(datos.altura);
  const posicion = datos.posicion;

  // Clasificar por categoría (condicional)
  const categoria = determinarCategoria(edad);

  // Verificar requisitos
  const { aprobado, motivos } = verificarRequisitos({ nombre, edad, altura, posicion });

  // Construir objeto jugador
  const jugador = {
    id: nextJugadorId++,
    numero: jugadores.length + 1,
    nombre,
    edad,
    altura,
    posicion,
    categoria,
    aprobado,
    motivos,
    equipo: null,
    rolTorneo: null,
    timestamp: new Date().toLocaleTimeString('es-CL')
  };

  // Agregar a la lista
  jugadores.push(jugador);
  equiposDesactualizados = true;

  // Actualizar UI
  renderizarJugador(jugador, animate);
  actualizarStats();
  if (persist) guardarPersistenciaJugadores();

  // Notificación
  if (notify) {
    if (aprobado) {
      showToast(`✅ ${nombre.toUpperCase()} registrado como ${categoria.toUpperCase()}`, 'success');
    } else {
      showToast(`⚠️ ${nombre.toUpperCase()} registrado con observaciones`, 'error');
    }
  }
}

// =============================================================================
// RENDER DE JUGADORES
// =============================================================================

/**
 * Formatea la posición para mostrarla en la tabla
 * @param {string} posicion
 * @returns {string}
 */
function formatPosicion(posicion) {
  return posicion.replace('-', ' ').toUpperCase();
}

/**
 * Renderiza una fila de jugador en la tabla
 * @param {Object} jugador
 * @param {boolean} animate - Si se aplica animación de "just added"
 */
function renderizarJugador(jugador, animate = false) {
  // Limpiar el empty state si existe
  const emptyState = playersList.querySelector('.empty-state');
  if (emptyState) emptyState.remove();

  const estadoClass  = jugador.aprobado ? 'player-row--ok' : 'player-row--rejected';
  const estadoText   = jugador.aprobado ? 'INSCRITO' : 'OBSERVADO';
  const categoriaCls = `player-cell--cat-${jugador.categoria}`;
  const animClass    = animate ? ' just-added' : '';
  const equipoText   = jugador.aprobado ? (jugador.equipo || 'PENDIENTE') : 'NO INSCRITO';
  const rolText      = jugador.aprobado ? (jugador.rolTorneo || 'PENDIENTE') : '—';
  const rolClass     = rolText === 'Cancha'
    ? ' player-cell--rol-cancha'
    : rolText === 'Banca'
      ? ' player-cell--rol-banca'
      : rolText === 'SIN EQUIPO'
        ? ' player-cell--rol-sin-equipo'
        : '';

  const row = document.createElement('div');
  row.className = `player-row ${estadoClass}${animClass}`;
  row.dataset.id = jugador.id;
  row.setAttribute('role', 'listitem');

  row.innerHTML = `
    <span class="player-cell player-cell--num">${String(jugador.numero).padStart(2, '0')}</span>
    <span class="player-cell player-cell--name">${jugador.nombre.toUpperCase()}</span>
    <span class="player-cell">${jugador.edad}</span>
    <span class="player-cell">${jugador.altura} cm</span>
    <span class="player-cell">${formatPosicion(jugador.posicion)}</span>
    <span class="player-cell player-cell--categoria ${categoriaCls}">${jugador.categoria.toUpperCase()}</span>
    <span class="player-cell player-cell--team">${equipoText}</span>
    <span class="player-cell player-cell--rol${rolClass}">${rolText.toUpperCase()}</span>
    <span class="player-cell player-cell--estado">${estadoText}</span>
    <span class="player-cell player-cell--time">${jugador.timestamp}</span>
  `;

  playersList.prepend(row);

  // Remover clase de animación especial
  if (animate) {
    setTimeout(() => row.classList.remove('just-added'), 1400);
  }
}

/**
 * Renderiza el estado vacío de la lista
 */
function renderizarEmpty() {
  playersList.innerHTML = `
    <div class="empty-state">
      <span class="empty-icon">🏀</span>
      <p>No hay jugadores registrados aún.</p>
      <p class="empty-state__sub">Completa el formulario para agregar jugadores.</p>
    </div>
  `;
}

function renderizarListaCompleta() {
  if (jugadores.length === 0) {
    renderizarEmpty();
    return;
  }

  playersList.innerHTML = '';
  [...jugadores]
    .reverse()
    .forEach((jugador) => renderizarJugador(jugador, false));
}

// =============================================================================
// STATS DEL HEADER
// =============================================================================

function actualizarStats() {
  const total      = jugadores.length;
  const adultos    = jugadores.filter(j => j.categoria === 'adulto').length;
  const juveniles  = jugadores.filter(j => j.categoria === 'juvenil').length;

  statTotal.textContent     = String(total).padStart(2, '0');
  statAdultos.textContent   = String(adultos).padStart(2, '0');
  statJuveniles.textContent = String(juveniles).padStart(2, '0');
  countBadge.textContent    = total;
}

// =============================================================================
// EQUIPOS
// =============================================================================

function getPosIndex(posicion) {
  const orden = { base: 0, escolta: 1, alero: 2, 'ala-pivot': 3, pivot: 4 };
  return orden[posicion] ?? 99;
}

function etiquetaEquipo(index) {
  let n = index;
  let label = '';

  do {
    label = String.fromCharCode(65 + (n % 26)) + label;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);

  return label;
}

function etiquetaEquipoToIndex(etiqueta) {
  if (typeof etiqueta !== 'string') return -1;
  const clean = etiqueta.trim().toUpperCase();
  if (!/^[A-Z]+$/.test(clean)) return -1;

  let result = 0;
  for (let i = 0; i < clean.length; i += 1) {
    result = (result * 26) + (clean.charCodeAt(i) - 64);
  }
  return result - 1;
}

function extraerEtiquetaDesdeEquipo(equipoNombre, categoriaEtiqueta) {
  if (typeof equipoNombre !== 'string') return null;
  const prefix = `${categoriaEtiqueta} `;
  if (!equipoNombre.startsWith(prefix)) return null;
  const etiqueta = equipoNombre.slice(prefix.length).trim().toUpperCase();
  return /^[A-Z]+$/.test(etiqueta) ? etiqueta : null;
}

function reconstruirEquiposAsignados(jugadoresCategoria, categoriaEtiqueta) {
  const groups = new Map();

  jugadoresCategoria.forEach((jugador) => {
    const etiqueta = extraerEtiquetaDesdeEquipo(jugador.equipo, categoriaEtiqueta);
    if (!etiqueta) return;
    if (jugador.rolTorneo !== 'Cancha' && jugador.rolTorneo !== 'Banca') return;

    if (!groups.has(etiqueta)) {
      groups.set(etiqueta, { etiqueta, titulares: [], banca: [] });
    }

    const team = groups.get(etiqueta);
    if (jugador.rolTorneo === 'Cancha') team.titulares.push(jugador);
    if (jugador.rolTorneo === 'Banca') team.banca.push(jugador);
  });

  const equiposCompletos = [];
  const idsConEquipoCompleto = new Set();

  groups.forEach((team) => {
    team.titulares.sort((a, b) => a.numero - b.numero);
    team.banca.sort((a, b) => a.numero - b.numero);

    if (
      team.titulares.length === TORNEO_CFG.titularesPorEquipo
      && team.banca.length === TORNEO_CFG.bancaPorEquipo
    ) {
      equiposCompletos.push(team);
      [...team.titulares, ...team.banca].forEach((jugador) => idsConEquipoCompleto.add(jugador.id));
    }
  });

  equiposCompletos.sort((a, b) => etiquetaEquipoToIndex(a.etiqueta) - etiquetaEquipoToIndex(b.etiqueta));

  const disponibles = jugadoresCategoria.filter((jugador) => !idsConEquipoCompleto.has(jugador.id));
  return { equiposCompletos, disponibles };
}

function crearEquiposRespetandoAsignacion(jugadoresCategoria, categoriaEtiqueta) {
  const reconstruidos = reconstruirEquiposAsignados(jugadoresCategoria, categoriaEtiqueta);
  const nuevos = crearEquiposCompletosCategoria(reconstruidos.disponibles);

  const etiquetasUsadas = new Set(reconstruidos.equiposCompletos.map((team) => team.etiqueta));
  let idxEtiqueta = 0;

  const equiposNuevosReetiquetados = nuevos.equipos.map((team) => {
    while (etiquetasUsadas.has(etiquetaEquipo(idxEtiqueta))) {
      idxEtiqueta += 1;
    }
    const etiqueta = etiquetaEquipo(idxEtiqueta);
    etiquetasUsadas.add(etiqueta);
    idxEtiqueta += 1;
    return { ...team, etiqueta };
  });

  return {
    equipos: [...reconstruidos.equiposCompletos, ...equiposNuevosReetiquetados],
    sobrantes: nuevos.sobrantes
  };
}

function crearEquiposCompletosCategoria(jugadoresCategoria) {
  const size = TORNEO_CFG.jugadoresPorEquipo;
  const titulares = TORNEO_CFG.titularesPorEquipo;
  const banca = TORNEO_CFG.bancaPorEquipo;

  const pools = {};
  POSICIONES_VALIDAS.forEach((pos) => {
    pools[pos] = jugadoresCategoria
      .filter((j) => j.posicion === pos)
      .sort((a, b) => a.numero - b.numero);
  });

  const maxEquiposPorTotal = Math.floor(jugadoresCategoria.length / size);
  const maxEquiposPorPosicion = Math.min(...POSICIONES_VALIDAS.map((pos) => pools[pos].length));
  const teamCount = Math.min(maxEquiposPorTotal, maxEquiposPorPosicion);

  if (teamCount <= 0) {
    return { equipos: [], sobrantes: [...jugadoresCategoria] };
  }

  const equipos = Array.from({ length: teamCount }, (_, idx) => ({
    etiqueta: etiquetaEquipo(idx),
    titulares: [],
    banca: []
  }));

  // Garantiza los 5 titulares oficiales por equipo: base, escolta, alero, ala-pivot, pivot.
  POSICIONES_VALIDAS.forEach((pos) => {
    for (let i = 0; i < teamCount; i += 1) {
      const jugador = pools[pos].shift();
      if (jugador) equipos[i].titulares.push(jugador);
    }
  });

  const idsTitulares = new Set(
    equipos.flatMap((team) => team.titulares.map((j) => j.id))
  );

  const restantes = jugadoresCategoria
    .filter((j) => !idsTitulares.has(j.id))
    .sort((a, b) => getPosIndex(a.posicion) - getPosIndex(b.posicion));

  let idxEquipo = 0;
  for (const jugador of restantes) {
    let intentos = 0;
    while (equipos[idxEquipo].banca.length >= banca && intentos < equipos.length) {
      idxEquipo = (idxEquipo + 1) % equipos.length;
      intentos += 1;
    }

    if (intentos >= equipos.length && equipos[idxEquipo].banca.length >= banca) break;

    equipos[idxEquipo].banca.push(jugador);
    idxEquipo = (idxEquipo + 1) % equipos.length;
  }

  const completos = equipos.filter(
    (team) => team.titulares.length === titulares && team.banca.length === banca
  );
  const idsAsignados = new Set(
    completos.flatMap((team) => [...team.titulares, ...team.banca].map((j) => j.id))
  );

  return {
    equipos: completos,
    sobrantes: jugadoresCategoria.filter((j) => !idsAsignados.has(j.id))
  };
}

function limpiarAsignacionEquipos() {
  jugadores.forEach((j) => {
    j.equipo = null;
    j.rolTorneo = null;
  });
}

function asignarEquiposACategoria(equipos, categoriaEtiqueta) {
  equipos.forEach((team) => {
    const teamName = `${categoriaEtiqueta} ${team.etiqueta}`;
    team.titulares.forEach((j) => {
      j.equipo = teamName;
      j.rolTorneo = 'Cancha';
    });
    team.banca.forEach((j) => {
      j.equipo = teamName;
      j.rolTorneo = 'Banca';
    });
  });
}

function teamBlockHTML(team) {
  const full = TORNEO_CFG.jugadoresPorEquipo;

  return `
    <details class="team-block">
      <summary class="team-block-header">
        <span class="team-block-title">Equipo ${team.etiqueta}</span>
        <span class="team-block-meta">Completo (${full}/${full})</span>
      </summary>
      <div class="team-block-content">
        <div class="team-subtitle">En Cancha (${TORNEO_CFG.titularesPorEquipo})</div>
        <div class="team-block-list">
          ${team.titulares.map((j, i) => teamPlayerItem(j, i + 1, 'Cancha')).join('')}
        </div>
        <div class="team-subtitle">Banca (${TORNEO_CFG.bancaPorEquipo})</div>
        <div class="team-block-list">
          ${team.banca.map((j, i) => teamPlayerItem(j, i + TORNEO_CFG.titularesPorEquipo + 1, 'Banca')).join('')}
        </div>
      </div>
    </details>
  `;
}

function etiquetaCantidadJugadores(cantidad) {
  return `${cantidad} jugador${cantidad === 1 ? '' : 'es'}`;
}

function descripcionFormatoEquipo() {
  return `${TORNEO_CFG.jugadoresPorEquipo} = ${TORNEO_CFG.titularesPorEquipo} cancha + ${TORNEO_CFG.bancaPorEquipo} banca`;
}

function actualizarNotaFormatoTorneo() {
  if (!modalNoteText) return;
  modalNoteText.textContent = `${TORNEO_CFG.formato} OFICIAL · ${TORNEO_CFG.jugadoresPorEquipo} POR EQUIPO (${TORNEO_CFG.titularesPorEquipo} CANCHA + ${TORNEO_CFG.bancaPorEquipo} BANCA) · MÍNIMO ${TORNEO_CFG.equiposMinimosPorCategoria} EQUIPOS ADULTOS Y ${TORNEO_CFG.equiposMinimosPorCategoria} JUVENILES`;
}

function loosePlayerRowHTML(jugador) {
  const categoriaClass = jugador.categoria === 'adulto'
    ? 'loose-cell--cat-adulto'
    : 'loose-cell--cat-juvenil';

  return `
    <div class="loose-row" role="listitem">
      <span class="loose-cell loose-cell--num">${String(jugador.numero).padStart(2, '0')}</span>
      <span class="loose-cell loose-cell--name">${jugador.nombre.toUpperCase()}</span>
      <span class="loose-cell">${jugador.edad}</span>
      <span class="loose-cell">${jugador.altura} cm</span>
      <span class="loose-cell">${formatPosicion(jugador.posicion)}</span>
      <span class="loose-cell loose-cell--cat ${categoriaClass}">${jugador.categoria.toUpperCase()}</span>
      <span class="loose-cell loose-cell--status">SIN EQUIPO</span>
    </div>
  `;
}

/**
 * Arma y muestra los equipos por categoría en el modal
 */
function mostrarEquipos() {
  const inscritos = jugadores.filter(j => j.aprobado);
  const adultos   = inscritos.filter(j => j.categoria === 'adulto');
  const juveniles = inscritos.filter(j => j.categoria === 'juvenil');
  const minEquipos = TORNEO_CFG.equiposMinimosPorCategoria;

  if (inscritos.length === 0) {
    showToast('Sin jugadores inscritos para armar equipos.', 'info');
    return;
  }

  const equiposAdultos = crearEquiposRespetandoAsignacion(adultos, 'Adulto');
  const equiposJuveniles = crearEquiposRespetandoAsignacion(juveniles, 'Juvenil');

  if (equiposAdultos.equipos.length < minEquipos || equiposJuveniles.equipos.length < minEquipos) {
    showToast(
      `${TORNEO_CFG.formato} oficial: se requieren mínimo ${minEquipos} equipos completos por categoría (${descripcionFormatoEquipo()}). Adultos: ${equiposAdultos.equipos.length}, Juveniles: ${equiposJuveniles.equipos.length}.`,
      'info'
    );
    return;
  }

  limpiarAsignacionEquipos();
  asignarEquiposACategoria(equiposAdultos.equipos, 'Adulto');
  asignarEquiposACategoria(equiposJuveniles.equipos, 'Juvenil');

  // Marcado explícito de inscritos que quedan fuera de equipos completos.
  [...equiposAdultos.sobrantes, ...equiposJuveniles.sobrantes].forEach((jugador) => {
    jugador.equipo = 'SIN EQUIPO';
    jugador.rolTorneo = 'SIN EQUIPO';
  });

  renderizarListaCompleta();

  // Render adultos
  const adultosCountText = `${etiquetaCantidadJugadores(adultos.length)} · ${equiposAdultos.equipos.length} equipos completos${equiposAdultos.sobrantes.length ? ` · ${etiquetaCantidadJugadores(equiposAdultos.sobrantes.length)} sin equipo` : ''}`;
  const adultosHTML = equiposAdultos.equipos.map((team) => teamBlockHTML(team)).join('');
  teamAdultoCount.textContent = adultosCountText;
  teamAdultoList.innerHTML = adultosHTML;

  // Render juveniles
  const juvenilesCountText = `${etiquetaCantidadJugadores(juveniles.length)} · ${equiposJuveniles.equipos.length} equipos completos${equiposJuveniles.sobrantes.length ? ` · ${etiquetaCantidadJugadores(equiposJuveniles.sobrantes.length)} sin equipo` : ''}`;
  const juvenilesHTML = equiposJuveniles.equipos.map((team) => teamBlockHTML(team)).join('');
  teamJuvenilCount.textContent = juvenilesCountText;
  teamJuvenilList.innerHTML = juvenilesHTML;

  const sueltosTotal = [...equiposAdultos.sobrantes, ...equiposJuveniles.sobrantes]
    .sort((a, b) => a.numero - b.numero);
  const sueltosCountText = sueltosTotal.length
    ? `${etiquetaCantidadJugadores(sueltosTotal.length)} sin equipo`
    : 'Sin jugadores sueltos';
  const sueltosHTML = sueltosTotal.length
    ? sueltosTotal.map((jugador) => loosePlayerRowHTML(jugador)).join('')
    : '<div class="loose-empty">No hay jugadores sueltos.</div>';

  if (teamLooseCount) teamLooseCount.textContent = sueltosCountText;
  if (teamLooseList) teamLooseList.innerHTML = sueltosHTML;

  equiposSnapshot = {
    adultosCountText,
    adultosHTML,
    juvenilesCountText,
    juvenilesHTML,
    sueltosCountText,
    sueltosHTML
  };
  equiposDesactualizados = false;
  guardarPersistenciaJugadores();

  const gruposListos = equiposAdultos.equipos.length + equiposJuveniles.equipos.length;
  const jugadoresSueltos = equiposAdultos.sobrantes.length + equiposJuveniles.sobrantes.length;
  const avisoBalancePosiciones = jugadoresSueltos >= TORNEO_CFG.jugadoresPorEquipo
    ? ' Revisa balance de posiciones (base, escolta, alero, ala-pivot, pivot) para formar más equipos completos.'
    : '';
  showToast(
    `Tenemos ${gruposListos} grupos listos y ${jugadoresSueltos} jugador${jugadoresSueltos === 1 ? '' : 'es'} suelto${jugadoresSueltos === 1 ? '' : 's'}.${avisoBalancePosiciones}`,
    'success'
  );

  // Abrir modal
  modalOverlay.classList.add('is-active');
}

function verEquiposArmados() {
  if (!equiposSnapshot) {
    mostrarEquipos();
    return;
  }

  teamAdultoCount.textContent = equiposSnapshot.adultosCountText;
  teamAdultoList.innerHTML = equiposSnapshot.adultosHTML;
  teamJuvenilCount.textContent = equiposSnapshot.juvenilesCountText;
  teamJuvenilList.innerHTML = equiposSnapshot.juvenilesHTML;
  if (teamLooseCount) teamLooseCount.textContent = equiposSnapshot.sueltosCountText || 'Sin jugadores sueltos';
  if (teamLooseList) teamLooseList.innerHTML = equiposSnapshot.sueltosHTML || '<div class="loose-empty">No hay jugadores sueltos.</div>';
  modalOverlay.classList.add('is-active');

  if (equiposDesactualizados) {
    showToast('Hay cambios en inscritos. Presiona "Armar Equipos" para actualizar.', 'info');
  }
}

/**
 * Genera HTML de item de jugador en la vista de equipos
 */
function teamPlayerItem(jugador, index, rol) {
  const rolClass = rol === 'Cancha'
    ? 'item-role--cancha'
    : rol === 'Banca'
      ? 'item-role--banca'
      : 'item-role--sin-equipo';

  return `
    <div class="team-player-item">
      <span class="item-num">#${String(index).padStart(2,'0')}</span>
      <span class="item-name">${jugador.nombre}</span>
      <span class="item-pos">${formatPosicion(jugador.posicion)}</span>
      <span class="item-age">${jugador.edad}a</span>
      <span class="item-role ${rolClass}">${rol.toUpperCase()}</span>
    </div>
  `;
}

// =============================================================================
// LIMPIAR LISTA
// =============================================================================

function limpiarLista() {
  if (jugadores.length === 0) {
    showToast('La lista ya está vacía.', 'info');
    return;
  }

  if (!confirm('¿Seguro que deseas limpiar toda la lista de jugadores?')) return;

  jugadores = [];
  nextJugadorId = 1;
  equiposSnapshot = null;
  equiposDesactualizados = false;
  limpiarPersistenciaJugadores();
  renderizarEmpty();
  actualizarStats();
  showToast('Lista de jugadores limpiada.', 'info');
}

function cargarJugadoresDemo() {
  if (!CARGAR_DEMO_AL_INICIO || jugadores.length > 0) return;

  JUGADORES_DEMO.forEach((jugador) => {
    registrarJugador(jugador, { notify: false, animate: false, persist: false });
  });

  guardarPersistenciaJugadores();
  // No mostrar toast automático: la lista demo queda cargada en silencio.
}

// =============================================================================
// TOAST / NOTIFICACIONES
// =============================================================================

let toastTimeout = null;

/**
 * Muestra una notificación temporal
 * @param {string} mensaje
 * @param {'success'|'error'|'info'} tipo
 */
function showToast(mensaje, tipo = 'info') {
  // Remover toast anterior
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  if (toastTimeout) clearTimeout(toastTimeout);

  const toast = document.createElement('div');
  toast.className = `toast toast--${tipo}`;
  toast.textContent = mensaje;
  document.body.appendChild(toast);

  toastTimeout = setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 350);
  }, 3200);
}

// =============================================================================
// MANEJO DE ERRORES EN FORMULARIO
// =============================================================================

/**
 * Muestra error en un campo
 */
function setError(input, errorId, message) {
  input.classList.add('is-invalid');
  const errorEl = document.getElementById(errorId);
  if (errorEl) errorEl.textContent = message;
}

/**
 * Limpia el error de un campo
 */
function clearError(input, errorId) {
  input.classList.remove('is-invalid');
  const errorEl = document.getElementById(errorId);
  if (errorEl) errorEl.textContent = '';
}

/**
 * Valida todo el formulario
 * @returns {boolean} true si es válido
 */
function validarFormulario() {
  let isValid = true;

  // Validar nombre
  const vnombre = validarNombre(inputNombre.value);
  if (!vnombre.valid) {
    setError(inputNombre, 'error-nombre', vnombre.message);
    isValid = false;
  } else {
    clearError(inputNombre, 'error-nombre');
  }

  // Validar edad
  const vedad = validarEdad(inputEdad.value);
  if (!vedad.valid) {
    setError(inputEdad, 'error-edad', vedad.message);
    isValid = false;
  } else {
    clearError(inputEdad, 'error-edad');
  }

  // Validar altura
  const valtura = validarAltura(inputAltura.value);
  if (!valtura.valid) {
    setError(inputAltura, 'error-altura', valtura.message);
    isValid = false;
  } else {
    clearError(inputAltura, 'error-altura');
  }

  // Validar posición
  const vpos = validarPosicion(selectPos.value);
  if (!vpos.valid) {
    setError(selectPos, 'error-posicion', vpos.message);
    isValid = false;
  } else {
    clearError(selectPos, 'error-posicion');
  }

  return isValid;
}

// =============================================================================
// EVENT LISTENERS
// =============================================================================

// Submit del formulario
form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!validarFormulario()) return;

  registrarJugador({
    nombre:   inputNombre.value,
    edad:     inputEdad.value,
    altura:   inputAltura.value,
    posicion: selectPos.value
  });

  form.reset();
  inputNombre.focus();
});

// Limpiar errores en tiempo real
inputNombre.addEventListener('input', () => {
  inputNombre.value = inputNombre.value
    .replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]/gu, '')
    .replace(/\s{2,}/g, ' ');

  clearError(inputNombre, 'error-nombre');
});
inputEdad.addEventListener('input',   () => clearError(inputEdad, 'error-edad'));
inputAltura.addEventListener('input', () => clearError(inputAltura, 'error-altura'));
selectPos.addEventListener('change',  () => clearError(selectPos, 'error-posicion'));

// Botón limpiar lista
btnClear.addEventListener('click', limpiarLista);

// Botón armar equipos
btnTeams.addEventListener('click', mostrarEquipos);
if (btnViewTeams) btnViewTeams.addEventListener('click', verEquiposArmados);

// Cerrar modal
modalClose.addEventListener('click', () => modalOverlay.classList.remove('is-active'));
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) modalOverlay.classList.remove('is-active');
});

// Cerrar modal con ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') modalOverlay.classList.remove('is-active');
});

// =============================================================================
// INIT
// =============================================================================

(function init() {
  inicializarTemasNBA();
  actualizarNotaFormatoTorneo();
  const cargoPersistencia = cargarPersistenciaJugadores();

  if (!cargoPersistencia) {
    renderizarEmpty();
    actualizarStats();
    cargarJugadoresDemo();
  }

  inputNombre.focus();
})();
