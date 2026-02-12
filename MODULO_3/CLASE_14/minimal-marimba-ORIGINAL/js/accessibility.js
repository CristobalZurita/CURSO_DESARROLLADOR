/**
 * MÓDULO DE ACCESIBILIDAD
 * Gestiona todas las opciones de accesibilidad del sitio
 * - Panel de accesibilidad
 * - Alto contraste
 * - Aumento de tamaño de fuente
 * - Foco visible mejorado
 */

class AccessibilityManager {
  constructor() {
    this.panel = document.getElementById('accessibilityPanel');
    this.toggle = document.getElementById('accessibilityToggle');
    this.closeBtn = document.getElementById('accessibilityClose');
    this.highContrastCheckbox = document.getElementById('highContrast');
    this.largeTextCheckbox = document.getElementById('largeText');
    this.focusVisibleCheckbox = document.getElementById('focusVisible');
    
    this.storagePrefix = 'a11y_';
    this.init();
  }

  init() {
    // Listeners para abrir/cerrar panel
    this.toggle.addEventListener('click', () => this.togglePanel());
    this.closeBtn.addEventListener('click', () => this.closePanel());
    
    // Listener para cerrar panel al hacer click fuera (Esc)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closePanel();
      }
    });

    // Listeners para cambios de opciones
    this.highContrastCheckbox.addEventListener('change', () => this.toggleHighContrast());
    this.largeTextCheckbox.addEventListener('change', () => this.toggleLargeText());
    this.focusVisibleCheckbox.addEventListener('change', () => this.toggleFocusVisible());

    // Cargar preferencias guardadas
    this.loadPreferences();

    // Crear overlay para cerrar panel
    this.createOverlay();

    // Agregar skip link para saltar al contenido principal
    this.addSkipLink();
  }

  /**
   * Alternar panel de accesibilidad
   */
  togglePanel() {
    const isHidden = this.panel.hidden;
    if (isHidden) {
      this.openPanel();
    } else {
      this.closePanel();
    }
  }

  /**
   * Abrir panel de accesibilidad
   */
  openPanel() {
    this.panel.hidden = false;
    this.panel.setAttribute('aria-hidden', 'false');
    this.toggle.setAttribute('aria-expanded', 'true');
    this.overlay.classList.add('active');
    
    // Enfocar en el botón de cerrar
    setTimeout(() => this.closeBtn.focus(), 100);
  }

  /**
   * Cerrar panel de accesibilidad
   */
  closePanel() {
    this.panel.hidden = true;
    this.panel.setAttribute('aria-hidden', 'true');
    this.toggle.setAttribute('aria-expanded', 'false');
    this.overlay.classList.remove('active');
    
    // Regresar foco al botón de toggle
    this.toggle.focus();
  }

  /**
   * Alternar alto contraste
   */
  toggleHighContrast() {
    const isChecked = this.highContrastCheckbox.checked;
    
    if (isChecked) {
      document.documentElement.classList.add('accessibility-high-contrast');
      this.savePreference('highContrast', true);
      this.announceToScreenReader('Alto contraste activado');
    } else {
      document.documentElement.classList.remove('accessibility-high-contrast');
      this.savePreference('highContrast', false);
      this.announceToScreenReader('Alto contraste desactivado');
    }
  }

  /**
   * Alternar aumento de tamaño de fuente
   */
  toggleLargeText() {
    const isChecked = this.largeTextCheckbox.checked;
    
    if (isChecked) {
      document.documentElement.classList.add('accessibility-large-text');
      this.savePreference('largeText', true);
      this.announceToScreenReader('Tamaño de fuente aumentado 25%');
    } else {
      document.documentElement.classList.remove('accessibility-large-text');
      this.savePreference('largeText', false);
      this.announceToScreenReader('Tamaño de fuente normal');
    }
  }

  /**
   * Alternar foco visible mejorado
   */
  toggleFocusVisible() {
    const isChecked = this.focusVisibleCheckbox.checked;
    
    if (isChecked) {
      document.documentElement.classList.add('accessibility-focus-visible');
      this.savePreference('focusVisible', true);
      this.announceToScreenReader('Foco visible mejorado activado');
    } else {
      document.documentElement.classList.remove('accessibility-focus-visible');
      this.savePreference('focusVisible', false);
      this.announceToScreenReader('Foco visible mejorado desactivado');
    }
  }

  /**
   * Guardar preferencia en localStorage
   */
  savePreference(key, value) {
    localStorage.setItem(`${this.storagePrefix}${key}`, JSON.stringify(value));
  }

  /**
   * Cargar preferencias desde localStorage
   */
  loadPreferences() {
    const highContrast = JSON.parse(localStorage.getItem(`${this.storagePrefix}highContrast`) || 'false');
    const largeText = JSON.parse(localStorage.getItem(`${this.storagePrefix}largeText`) || 'false');
    const focusVisible = JSON.parse(localStorage.getItem(`${this.storagePrefix}focusVisible`) || 'false');

    // Aplicar preferencias
    if (highContrast) {
      this.highContrastCheckbox.checked = true;
      document.documentElement.classList.add('accessibility-high-contrast');
    }

    if (largeText) {
      this.largeTextCheckbox.checked = true;
      document.documentElement.classList.add('accessibility-large-text');
    }

    if (focusVisible) {
      this.focusVisibleCheckbox.checked = true;
      document.documentElement.classList.add('accessibility-focus-visible');
    }
  }

  /**
   * Anunciar a lectores de pantalla
   */
  announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remover después de 1 segundo
    setTimeout(() => {
      announcement.remove();
    }, 1000);
  }

  /**
   * Crear overlay para cerrar panel al hacer click fuera
   */
  createOverlay() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'accessibility-overlay';
    this.overlay.addEventListener('click', () => this.closePanel());
    document.body.appendChild(this.overlay);
  }

  /**
   * Agregar skip link para saltar al contenido principal
   */
  addSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Saltar al contenido principal';
    skipLink.className = 'skip-to-main';
    document.body.insertBefore(skipLink, document.body.firstChild);
  }
}

/**
 * Inicializar gestor de accesibilidad cuando el DOM esté listo
 */
document.addEventListener('DOMContentLoaded', () => {
  new AccessibilityManager();
});

/**
 * MEJORAS ADICIONALES DE ACCESIBILIDAD
 * Aplicadas automáticamente
 */

// 1. Detectar preferencia de usuario para reducir movimiento
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.style.scrollBehavior = 'auto';
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  `;
  document.head.appendChild(styleSheet);
}

// 2. Mejorar contraste de enfoque para navegación por teclado
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  *:focus-visible {
    outline: 2px solid var(--color-primary, #FFD700);
    outline-offset: 2px;
  }
  
  /* Asegurar que los botones sean accesibles */
  button, a, input[type="button"], input[type="submit"] {
    min-height: 44px;
    min-width: 44px;
  }
`;
document.head.appendChild(styleSheet);

// 3. Detectar contraste preferido del usuario
if (window.matchMedia('(prefers-contrast: more)').matches) {
  document.documentElement.classList.add('accessibility-high-contrast');
}
