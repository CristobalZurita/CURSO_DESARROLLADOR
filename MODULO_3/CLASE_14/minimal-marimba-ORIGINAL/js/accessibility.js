/**
 * MÓDULO DE ACCESIBILIDAD
 * - Panel de accesibilidad
 * - Alto contraste
 * - Aumento de tamaño de fuente
 * - Foco visible mejorado
 * - Lectura por voz (TTS)
 * - Comandos de voz básicos
 * - Ajustes semánticos para lector de pantalla y teclado
 */

class AccessibilityManager {
  constructor() {
    this.panel = document.getElementById('accessibilityPanel');
    this.toggle = document.getElementById('accessibilityToggle');
    this.closeBtn = document.getElementById('accessibilityClose');

    this.highContrastCheckbox = document.getElementById('highContrast');
    this.largeTextCheckbox = document.getElementById('largeText');
    this.focusVisibleCheckbox = document.getElementById('focusVisible');

    this.speakPageBtn = document.getElementById('speakPageBtn');
    this.speakSectionBtn = document.getElementById('speakSectionBtn');
    this.toggleSpeechBtn = document.getElementById('toggleSpeechBtn');
    this.stopSpeechBtn = document.getElementById('stopSpeechBtn');
    this.voiceRateInput = document.getElementById('voiceRate');
    this.voiceReadingCheckbox = document.getElementById('voiceReadingEnabled');
    this.voiceCommandsCheckbox = document.getElementById('voiceCommands');
    this.voiceStatus = document.getElementById('voiceStatus');
    this.voiceFloatingControls = document.getElementById('voiceFloatingControls');
    this.floatingPlayPauseBtn = document.getElementById('floatingPlayPauseBtn');
    this.floatingStopBtn = document.getElementById('floatingStopBtn');

    this.storagePrefix = 'a11y_';

    this.speechSupported = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
    this.speechSynthesis = this.speechSupported ? window.speechSynthesis : null;
    this.currentUtterance = null;
    this.speechQueue = [];
    this.currentSpeechIndex = 0;
    this.cancelRequested = false;
    this.isSpeaking = false;
    this.isPaused = false;
    this.lastSpeechText = '';

    this.recognitionSupported = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
    this.recognition = null;
    this.isListening = false;
    this.isRecognitionRestarting = false;

    this.liveRegion = null;
    this.overlay = null;

    this.init();
  }

  init() {
    if (!this.panel || !this.toggle || !this.closeBtn) {
      return;
    }

    // Abrir/cerrar panel
    this.toggle.addEventListener('click', () => this.togglePanel());
    this.closeBtn.addEventListener('click', () => this.closePanel());

    // Cerrar panel con Escape
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.closePanel();
      }
    });

    // Toggles de accesibilidad base
    this.highContrastCheckbox?.addEventListener('change', () => this.toggleHighContrast());
    this.largeTextCheckbox?.addEventListener('change', () => this.toggleLargeText());
    this.focusVisibleCheckbox?.addEventListener('change', () => this.toggleFocusVisible());

    this.loadPreferences();
    this.createOverlay();
    this.addSkipLink();
    this.setupLiveRegion();
    this.setupSemanticEnhancements();
    this.setupSpeechControls();
    this.setupVoiceCommands();
  }

  togglePanel() {
    if (this.panel.hidden) {
      this.openPanel();
    } else {
      this.closePanel();
    }
  }

  openPanel() {
    this.panel.hidden = false;
    this.panel.setAttribute('aria-hidden', 'false');
    this.toggle.setAttribute('aria-expanded', 'true');
    this.overlay?.classList.add('active');

    setTimeout(() => this.closeBtn.focus(), 100);
  }

  closePanel() {
    this.panel.hidden = true;
    this.panel.setAttribute('aria-hidden', 'true');
    this.toggle.setAttribute('aria-expanded', 'false');
    this.overlay?.classList.remove('active');

    this.toggle.focus();
  }

  toggleHighContrast() {
    const isChecked = Boolean(this.highContrastCheckbox?.checked);

    document.documentElement.classList.toggle('accessibility-high-contrast', isChecked);
    this.savePreference('highContrast', isChecked);
    this.announceToScreenReader(isChecked ? 'Alto contraste activado' : 'Alto contraste desactivado');
  }

  toggleLargeText() {
    const isChecked = Boolean(this.largeTextCheckbox?.checked);

    document.documentElement.classList.toggle('accessibility-large-text', isChecked);
    this.savePreference('largeText', isChecked);
    this.announceToScreenReader(isChecked ? 'Tamaño de fuente aumentado' : 'Tamaño de fuente normal');
  }

  toggleFocusVisible() {
    const isChecked = Boolean(this.focusVisibleCheckbox?.checked);

    document.documentElement.classList.toggle('accessibility-focus-visible', isChecked);
    this.savePreference('focusVisible', isChecked);
    this.announceToScreenReader(isChecked ? 'Foco visible mejorado activado' : 'Foco visible mejorado desactivado');
  }

  savePreference(key, value) {
    try {
      localStorage.setItem(`${this.storagePrefix}${key}`, JSON.stringify(value));
    } catch (error) {
      // Sin localStorage disponible
    }
  }

  getPreference(key, fallback) {
    try {
      const raw = localStorage.getItem(`${this.storagePrefix}${key}`);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (error) {
      return fallback;
    }
  }

  loadPreferences() {
    const highContrast = this.getPreference('highContrast', false);
    const largeText = this.getPreference('largeText', false);
    const focusVisible = this.getPreference('focusVisible', false);
    const voiceRate = this.getPreference('voiceRate', 1);
    const voiceReadingEnabled = this.getPreference('voiceReadingEnabled', false);
    const voiceCommands = this.getPreference('voiceCommands', false);

    if (this.highContrastCheckbox) {
      this.highContrastCheckbox.checked = highContrast;
      document.documentElement.classList.toggle('accessibility-high-contrast', highContrast);
    }

    if (this.largeTextCheckbox) {
      this.largeTextCheckbox.checked = largeText;
      document.documentElement.classList.toggle('accessibility-large-text', largeText);
    }

    if (this.focusVisibleCheckbox) {
      this.focusVisibleCheckbox.checked = focusVisible;
      document.documentElement.classList.toggle('accessibility-focus-visible', focusVisible);
    }

    if (this.voiceRateInput) {
      this.voiceRateInput.value = String(voiceRate);
    }

    if (this.voiceReadingCheckbox) {
      this.voiceReadingCheckbox.checked = voiceReadingEnabled;
    }

    if (this.voiceCommandsCheckbox) {
      this.voiceCommandsCheckbox.checked = voiceCommands;
    }
  }

  setupLiveRegion() {
    const existingRegion = document.getElementById('srLiveRegion');
    if (existingRegion) {
      this.liveRegion = existingRegion;
      return;
    }

    this.liveRegion = document.createElement('div');
    this.liveRegion.id = 'srLiveRegion';
    this.liveRegion.className = 'sr-only';
    this.liveRegion.setAttribute('role', 'status');
    this.liveRegion.setAttribute('aria-live', 'polite');
    this.liveRegion.setAttribute('aria-atomic', 'true');
    document.body.appendChild(this.liveRegion);
  }

  announceToScreenReader(message) {
    if (!this.liveRegion) {
      return;
    }

    this.liveRegion.textContent = '';
    setTimeout(() => {
      this.liveRegion.textContent = message;
    }, 80);
  }

  createOverlay() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'accessibility-overlay';
    this.overlay.addEventListener('click', () => this.closePanel());
    document.body.appendChild(this.overlay);
  }

  addSkipLink() {
    if (document.querySelector('.skip-to-main')) {
      return;
    }

    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Saltar al contenido principal';
    skipLink.className = 'skip-to-main';
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  setupSemanticEnhancements() {
    // Cualquier imagen sin alt queda marcada como decorativa.
    document.querySelectorAll('img:not([alt])').forEach((img) => {
      img.setAttribute('alt', '');
    });

    // SVG decorativos fuera de controles interactivos.
    const decorativeSvgs = document.querySelectorAll(
      '.concept__feature-icon svg, .card__meta-item svg, .accordion__icon, .accordion__meta svg'
    );

    decorativeSvgs.forEach((svg) => {
      svg.setAttribute('aria-hidden', 'true');
      svg.setAttribute('focusable', 'false');
    });

    // Tarjetas de galería navegables por teclado.
    document.querySelectorAll('.gallery__item').forEach((item) => {
      const caption = item.querySelector('.gallery__caption')?.textContent?.trim();
      const label = caption ? `Abrir imagen: ${caption}` : 'Abrir imagen de la galería';

      item.setAttribute('role', 'button');
      item.setAttribute('tabindex', '0');
      item.setAttribute('aria-label', label);

      item.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          item.click();
        }
      });
    });

    // Estado ARIA en acordeones.
    document.querySelectorAll('.accordion__item').forEach((item, index) => {
      const header = item.querySelector('.accordion__header');
      const body = item.querySelector('.accordion__body');

      if (!header || !body) {
        return;
      }

      const headerId = `accordionHeader${index + 1}`;
      const bodyId = `accordionBody${index + 1}`;

      header.id = headerId;
      body.id = bodyId;
      header.setAttribute('aria-controls', bodyId);
      body.setAttribute('role', 'region');
      body.setAttribute('aria-labelledby', headerId);

      const syncExpandedState = () => {
        const expanded = item.classList.contains('accordion__item--active');
        header.setAttribute('aria-expanded', String(expanded));
      };

      syncExpandedState();
      const observer = new MutationObserver(syncExpandedState);
      observer.observe(item, { attributes: true, attributeFilter: ['class'] });
    });
  }

  setupSpeechControls() {
    if (!this.speakPageBtn || !this.speakSectionBtn || !this.stopSpeechBtn || !this.voiceRateInput) {
      return;
    }

    if (!this.speechSupported) {
      this.disableSpeechControls('Lectura por voz no disponible en este navegador');
      return;
    }

    this.speakPageBtn.addEventListener('click', () => this.speakPageContent());
    this.speakSectionBtn.addEventListener('click', () => this.speakVisibleSection());
    this.toggleSpeechBtn?.addEventListener('click', () => this.toggleSpeechPlayback());
    this.stopSpeechBtn.addEventListener('click', () => this.stopSpeaking());
    this.floatingPlayPauseBtn?.addEventListener('click', () => this.toggleSpeechPlayback());
    this.floatingStopBtn?.addEventListener('click', () => this.stopSpeaking());

    this.voiceReadingCheckbox?.addEventListener('change', () => {
      const enabled = Boolean(this.voiceReadingCheckbox.checked);
      this.savePreference('voiceReadingEnabled', enabled);
      this.applyVoiceReadingMode(enabled, true);
    });

    this.voiceRateInput.addEventListener('change', () => {
      this.savePreference('voiceRate', Number(this.voiceRateInput.value));
      this.announceToScreenReader(`Velocidad de lectura ${this.voiceRateInput.value}`);
    });

    document.addEventListener('keydown', (event) => {
      if (!event.altKey) {
        return;
      }

      const targetTag = event.target?.tagName?.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea' || targetTag === 'select') {
        return;
      }

      const key = event.key.toLowerCase();

      if (key === 'l') {
        event.preventDefault();
        this.speakPageContent();
      }

      if (key === 'k') {
        event.preventDefault();
        this.speakVisibleSection();
      }

      if (key === 'x') {
        event.preventDefault();
        this.stopSpeaking();
      }

      if (key === 'p') {
        event.preventDefault();
        this.toggleSpeechPlayback();
      }
    });

    this.applyVoiceReadingMode(this.isVoiceReadingModeEnabled(), false);
    this.updatePlaybackControls();
  }

  disableSpeechControls(message) {
    [this.speakPageBtn, this.speakSectionBtn, this.toggleSpeechBtn, this.stopSpeechBtn, this.voiceRateInput, this.voiceReadingCheckbox, this.floatingPlayPauseBtn, this.floatingStopBtn].forEach((element) => {
      if (!element) {
        return;
      }

      element.setAttribute('disabled', 'true');
      element.setAttribute('aria-disabled', 'true');
    });

    if (this.voiceStatus) {
      this.voiceStatus.textContent = `Estado: ${message}`;
    }

    this.setFloatingControlsVisible(false);
  }

  isVoiceReadingModeEnabled() {
    return this.voiceReadingCheckbox ? Boolean(this.voiceReadingCheckbox.checked) : true;
  }

  canUseSpeechControls(announce = true) {
    if (!this.speechSupported) {
      return false;
    }

    if (this.isVoiceReadingModeEnabled()) {
      return true;
    }

    if (announce) {
      this.updateVoiceStatus('Estado: activa "Lectura por Voz" para usar los controles');
      this.announceToScreenReader('Activa la casilla de lectura por voz para usar esta función');
    }

    return false;
  }

  applyVoiceReadingMode(enabled, announce = false) {
    const controls = [this.speakPageBtn, this.speakSectionBtn, this.toggleSpeechBtn, this.stopSpeechBtn, this.voiceRateInput, this.floatingPlayPauseBtn, this.floatingStopBtn];

    controls.forEach((element) => {
      if (!element) {
        return;
      }

      if (enabled) {
        element.removeAttribute('disabled');
        element.setAttribute('aria-disabled', 'false');
        return;
      }

      element.setAttribute('disabled', 'true');
      element.setAttribute('aria-disabled', 'true');
    });

    if (!enabled) {
      this.stopSpeaking(false);
      this.setFloatingControlsVisible(false);
      this.updatePlaybackControls();

      if (announce) {
        this.updateVoiceStatus(this.isListening ? 'Estado: comandos de voz activos' : 'Estado: lectura por voz desactivada');
        this.announceToScreenReader('Lectura por voz desactivada');
      }
      return;
    }

    this.setFloatingControlsVisible(true);
    this.updatePlaybackControls();

    if (announce) {
      this.updateVoiceStatus(this.isListening ? 'Estado: comandos de voz activos' : 'Estado: lectura por voz activada');
      this.announceToScreenReader('Lectura por voz activada');
    } else if (!this.isListening && !this.isSpeaking && !this.speechSynthesis?.speaking && !this.speechSynthesis?.paused) {
      this.updateVoiceStatus('Estado: lectura por voz activada');
    }
  }

  getPreferredVoice() {
    if (!this.speechSupported) {
      return null;
    }

    const voices = this.speechSynthesis.getVoices();
    if (!voices.length) {
      return null;
    }

    return (
      voices.find((voice) => voice.lang.toLowerCase().startsWith('es-cl')) ||
      voices.find((voice) => voice.lang.toLowerCase().startsWith('es')) ||
      voices[0]
    );
  }

  splitTextForSpeech(text, maxChunkLength = 280) {
    const normalizedText = text.replace(/\s+/g, ' ').trim();
    if (!normalizedText) {
      return [];
    }

    if (normalizedText.length <= maxChunkLength) {
      return [normalizedText];
    }

    const sentenceParts = normalizedText.match(/[^.!?]+[.!?]?/g) || [normalizedText];
    const chunks = [];
    let currentChunk = '';

    const pushChunk = (chunkText) => {
      const cleanChunk = chunkText.trim();
      if (cleanChunk) {
        chunks.push(cleanChunk);
      }
    };

    const splitLongPart = (longPart) => {
      const words = longPart.split(/\s+/);
      let partial = '';

      words.forEach((word) => {
        const candidate = partial ? `${partial} ${word}` : word;
        if (candidate.length <= maxChunkLength) {
          partial = candidate;
          return;
        }

        pushChunk(partial);
        partial = word;
      });

      pushChunk(partial);
    };

    sentenceParts.forEach((part) => {
      const sentence = part.trim();
      if (!sentence) {
        return;
      }

      if (sentence.length > maxChunkLength) {
        pushChunk(currentChunk);
        currentChunk = '';
        splitLongPart(sentence);
        return;
      }

      const candidate = currentChunk ? `${currentChunk} ${sentence}` : sentence;
      if (candidate.length <= maxChunkLength) {
        currentChunk = candidate;
        return;
      }

      pushChunk(currentChunk);
      currentChunk = sentence;
    });

    pushChunk(currentChunk);
    return chunks;
  }

  createUtterance(textChunk) {
    const utterance = new SpeechSynthesisUtterance(textChunk);
    utterance.lang = 'es-CL';
    utterance.rate = Number(this.voiceRateInput?.value || 1);
    utterance.pitch = 1;
    utterance.volume = 1;

    const preferredVoice = this.getPreferredVoice();
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    return utterance;
  }

  finalizeSpeech(success = true) {
    this.currentUtterance = null;
    this.speechQueue = [];
    this.currentSpeechIndex = 0;
    this.cancelRequested = false;
    this.isSpeaking = false;
    this.isPaused = false;

    if (success) {
      this.updateVoiceStatus(this.isListening ? 'Estado: comandos de voz activos' : 'Estado: inactivo');
      this.announceToScreenReader('Lectura finalizada');
    } else {
      this.updateVoiceStatus('Estado: error de lectura');
      this.announceToScreenReader('Error en lectura por voz');
    }

    this.setFloatingControlsVisible(false);
    this.updatePlaybackControls();
  }

  speakQueueChunk() {
    if (!this.speechSupported || this.cancelRequested) {
      return;
    }

    if (this.currentSpeechIndex >= this.speechQueue.length) {
      this.finalizeSpeech(true);
      return;
    }

    const textChunk = this.speechQueue[this.currentSpeechIndex];
    const utterance = this.createUtterance(textChunk);

    utterance.onstart = () => {
      if (this.currentSpeechIndex === 0) {
        this.isSpeaking = true;
        this.isPaused = false;
        this.updateVoiceStatus('Estado: leyendo contenido');
        this.announceToScreenReader('Lectura iniciada');
        this.setFloatingControlsVisible(true);
        this.updatePlaybackControls();
      }
    };

    utterance.onend = () => {
      if (this.cancelRequested) {
        return;
      }

      this.currentSpeechIndex += 1;
      this.speakQueueChunk();
    };

    utterance.onerror = () => {
      if (this.cancelRequested) {
        return;
      }

      this.finalizeSpeech(false);
    };

    this.currentUtterance = utterance;
    this.speechSynthesis.speak(utterance);
  }

  speak(text) {
    if (!this.speechSupported || !text || !this.canUseSpeechControls(true)) {
      return;
    }

    this.stopSpeaking(false);
    const chunks = this.splitTextForSpeech(text);
    if (!chunks.length) {
      this.updateVoiceStatus('Estado: sin contenido para leer');
      this.announceToScreenReader('No se encontró contenido para leer');
      this.setFloatingControlsVisible(false);
      this.updatePlaybackControls();
      return;
    }

    this.lastSpeechText = text;
    this.speechQueue = chunks;
    this.currentSpeechIndex = 0;
    this.cancelRequested = false;
    this.isPaused = false;
    this.speakQueueChunk();
  }

  stopSpeaking(announce = true) {
    if (!this.speechSupported) {
      return;
    }

    this.cancelRequested = true;
    this.speechSynthesis.cancel();
    this.currentUtterance = null;
    this.speechQueue = [];
    this.currentSpeechIndex = 0;
    this.isSpeaking = false;
    this.isPaused = false;

    if (announce) {
      this.announceToScreenReader('Lectura detenida');
    }

    this.updateVoiceStatus(this.isListening ? 'Estado: comandos de voz activos' : 'Estado: inactivo');
    this.setFloatingControlsVisible(false);
    this.updatePlaybackControls();
  }

  toggleSpeechPlayback() {
    if (!this.canUseSpeechControls(true)) {
      return;
    }

    if (this.speechSynthesis.speaking && !this.speechSynthesis.paused) {
      this.speechSynthesis.pause();
      this.isPaused = true;
      this.updateVoiceStatus('Estado: lectura en pausa');
      this.announceToScreenReader('Lectura en pausa');
      this.setFloatingControlsVisible(true);
      this.updatePlaybackControls();
      return;
    }

    if (this.speechSynthesis.paused || this.isPaused) {
      this.speechSynthesis.resume();
      this.isPaused = false;
      this.updateVoiceStatus('Estado: leyendo contenido');
      this.announceToScreenReader('Lectura reanudada');
      this.setFloatingControlsVisible(true);
      this.updatePlaybackControls();
      return;
    }

    this.announceToScreenReader('No hay lectura en pausa para reanudar');
  }

  setFloatingControlsVisible(visible) {
    if (!this.voiceFloatingControls) {
      return;
    }

    if (!this.speechSupported || !this.isVoiceReadingModeEnabled()) {
      this.voiceFloatingControls.hidden = true;
      return;
    }

    this.voiceFloatingControls.hidden = !(visible || this.isVoiceReadingModeEnabled());
  }

  updatePlaybackControls() {
    const voiceReadingEnabled = this.speechSupported && this.isVoiceReadingModeEnabled();
    const hasActiveSpeech = Boolean(this.speechSynthesis && (this.speechSynthesis.speaking || this.speechSynthesis.paused || this.isSpeaking || this.isPaused));
    const isPaused = Boolean(this.speechSynthesis?.paused || this.isPaused);
    const playPauseIcon = hasActiveSpeech && !isPaused ? '⏸' : '▶';
    const playPauseAriaLabel = !hasActiveSpeech ? 'No hay lectura activa. Usa leer página o leer sección para iniciar' : (isPaused ? 'Reanudar lectura por voz' : 'Pausar lectura por voz');

    if (this.floatingPlayPauseBtn) {
      const symbol = this.floatingPlayPauseBtn.querySelector('.voice-control-symbol');
      if (symbol) {
        symbol.textContent = playPauseIcon;
      }
      this.floatingPlayPauseBtn.setAttribute('aria-label', playPauseAriaLabel);
      this.floatingPlayPauseBtn.disabled = !voiceReadingEnabled;
      this.floatingPlayPauseBtn.setAttribute('aria-disabled', String(!voiceReadingEnabled));
    }

    if (this.toggleSpeechBtn) {
      const symbol = this.toggleSpeechBtn.querySelector('.voice-control-symbol');
      if (symbol) {
        symbol.textContent = playPauseIcon;
      }
      this.toggleSpeechBtn.setAttribute('aria-label', playPauseAriaLabel);
      this.toggleSpeechBtn.disabled = !voiceReadingEnabled;
      this.toggleSpeechBtn.setAttribute('aria-disabled', String(!voiceReadingEnabled));
    }

    if (this.stopSpeechBtn) {
      this.stopSpeechBtn.disabled = !voiceReadingEnabled;
      this.stopSpeechBtn.setAttribute('aria-disabled', String(!voiceReadingEnabled));
    }

    if (this.floatingStopBtn) {
      this.floatingStopBtn.disabled = !voiceReadingEnabled;
      this.floatingStopBtn.setAttribute('aria-disabled', String(!voiceReadingEnabled));
    }
  }

  speakPageContent() {
    if (!this.canUseSpeechControls(true)) {
      return;
    }

    const mainContent = document.getElementById('main') || document.body;
    const text = this.extractReadableContent(mainContent);
    this.speak(text);
  }

  speakVisibleSection() {
    if (!this.canUseSpeechControls(true)) {
      return;
    }

    const sections = Array.from(document.querySelectorAll('main section[id]'));
    if (!sections.length) {
      return;
    }

    const viewportMiddle = window.innerHeight / 2;
    let selectedSection = sections[0];

    for (const section of sections) {
      const rect = section.getBoundingClientRect();
      if (rect.top <= viewportMiddle && rect.bottom >= viewportMiddle) {
        selectedSection = section;
        break;
      }
    }

    const heading = selectedSection.querySelector('h1, h2, h3, h4')?.textContent?.trim() || 'Sección actual';
    const text = this.extractReadableContent(selectedSection);

    this.announceToScreenReader(`Leyendo sección ${heading}`);
    this.speak(`Sección ${heading}. ${text}`);
  }

  extractReadableContent(rootNode) {
    if (!rootNode) {
      return '';
    }

    const textSelectors = [
      'h1',
      'h2',
      'h3',
      'h4',
      'p',
      'li',
      'label',
      'button',
      '.accordion__title',
      '.accordion__details h4',
      '.faq__question',
      '.faq__answer'
    ];

    const fragments = [];

    rootNode.querySelectorAll(textSelectors.join(',')).forEach((node) => {
      if (node.closest('[aria-hidden="true"]')) {
        return;
      }

      const text = node.textContent.replace(/\s+/g, ' ').trim();
      if (!text) {
        return;
      }

      fragments.push(text.endsWith('.') ? text : `${text}.`);
    });

    const imageDescriptions = [];
    rootNode.querySelectorAll('img').forEach((img) => {
      const describedBy = img.getAttribute('aria-describedby');
      const longDescription = describedBy ? document.getElementById(describedBy)?.textContent?.trim() : '';
      const directDescription = img.getAttribute('data-a11y-description') || img.getAttribute('alt') || '';
      const description = (longDescription || directDescription).replace(/\s+/g, ' ').trim();

      if (description) {
        imageDescriptions.push(description.endsWith('.') ? description : `${description}.`);
      }
    });

    if (imageDescriptions.length) {
      fragments.push('Referencias visuales relevantes.');
      fragments.push(...imageDescriptions);
    }

    // Evita lecturas extremadamente largas.
    return fragments.slice(0, 180).join(' ');
  }

  setupVoiceCommands() {
    if (!this.voiceCommandsCheckbox) {
      return;
    }

    if (!this.recognitionSupported) {
      this.voiceCommandsCheckbox.checked = false;
      this.voiceCommandsCheckbox.setAttribute('disabled', 'true');
      this.updateVoiceStatus('Estado: comandos de voz no disponibles');
      return;
    }

    this.createRecognitionInstance();

    this.voiceCommandsCheckbox.addEventListener('change', () => {
      const enabled = this.voiceCommandsCheckbox.checked;
      this.savePreference('voiceCommands', enabled);

      if (enabled) {
        this.startVoiceCommands();
      } else {
        this.stopVoiceCommands();
      }
    });

    if (this.voiceCommandsCheckbox.checked) {
      this.startVoiceCommands();
    } else {
      this.updateVoiceStatus('Estado: inactivo');
    }
  }

  createRecognitionInstance() {
    if (this.recognition) {
      return;
    }

    const RecognitionApi = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new RecognitionApi();
    this.recognition.lang = 'es-CL';
    this.recognition.continuous = true;
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;

    this.recognition.onresult = (event) => {
      const lastResult = event.results[event.results.length - 1];
      if (!lastResult || !lastResult.isFinal) {
        return;
      }

      const rawCommand = lastResult[0]?.transcript || '';
      const command = this.normalizeCommand(rawCommand);
      this.processVoiceCommand(command);
    };

    this.recognition.onerror = () => {
      this.updateVoiceStatus('Estado: error de comando de voz');
    };

    this.recognition.onend = () => {
      if (!this.isListening || this.isRecognitionRestarting) {
        return;
      }

      this.isRecognitionRestarting = true;
      setTimeout(() => {
        this.isRecognitionRestarting = false;
        if (this.isListening) {
          try {
            this.recognition.start();
          } catch (error) {
            this.updateVoiceStatus('Estado: no se pudo reiniciar voz');
          }
        }
      }, 250);
    };
  }

  normalizeCommand(command) {
    return command
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  processVoiceCommand(command) {
    if (!command) {
      return;
    }

    if (command.includes('leer pagina')) {
      this.speakPageContent();
      return;
    }

    if (command.includes('leer seccion')) {
      this.speakVisibleSection();
      return;
    }

    if (command.includes('detener') || command.includes('silencio')) {
      this.stopSpeaking();
      return;
    }

    if (command.includes('subir')) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.announceToScreenReader('Subiendo al inicio');
      return;
    }

    if (command.includes('abrir accesibilidad')) {
      this.openPanel();
      this.announceToScreenReader('Panel de accesibilidad abierto');
      return;
    }

    if (command.includes('cerrar accesibilidad')) {
      this.closePanel();
      this.announceToScreenReader('Panel de accesibilidad cerrado');
      return;
    }

    if (command.includes('alto contraste')) {
      this.highContrastCheckbox.checked = !this.highContrastCheckbox.checked;
      this.toggleHighContrast();
      return;
    }

    if (command.includes('texto grande')) {
      this.largeTextCheckbox.checked = !this.largeTextCheckbox.checked;
      this.toggleLargeText();
      return;
    }

    if (command.includes('foco visible')) {
      this.focusVisibleCheckbox.checked = !this.focusVisibleCheckbox.checked;
      this.toggleFocusVisible();
      return;
    }

    if (command.includes('ir contacto')) {
      const contactSection = document.getElementById('contacto');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      this.announceToScreenReader('Navegando a contacto');
    }
  }

  startVoiceCommands() {
    if (!this.recognition || this.isListening) {
      return;
    }

    try {
      this.recognition.start();
      this.isListening = true;
      this.updateVoiceStatus('Estado: escuchando comandos');
      this.announceToScreenReader('Comandos de voz activados');
    } catch (error) {
      this.updateVoiceStatus('Estado: no se pudo activar voz');
    }
  }

  stopVoiceCommands() {
    if (!this.recognition) {
      return;
    }

    this.isListening = false;

    try {
      this.recognition.stop();
    } catch (error) {
      // Ignorar si ya estaba detenido.
    }

    this.updateVoiceStatus('Estado: inactivo');
    this.announceToScreenReader('Comandos de voz desactivados');
  }

  updateVoiceStatus(text) {
    if (this.voiceStatus) {
      this.voiceStatus.textContent = text;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const manager = new AccessibilityManager();

  // Algunos navegadores cargan voces asíncronamente.
  if (manager.speechSupported && manager.speechSynthesis) {
    manager.speechSynthesis.onvoiceschanged = () => {};
  }
});

// Respeto por preferencia del usuario: reducir movimiento.
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.style.scrollBehavior = 'auto';

  const reducedMotionStyles = document.createElement('style');
  reducedMotionStyles.textContent = `
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  `;
  document.head.appendChild(reducedMotionStyles);
}

// Mejora de foco visible global.
const focusStyles = document.createElement('style');
focusStyles.textContent = `
  *:focus-visible {
    outline: 2px solid var(--color-primary, #FFD700);
    outline-offset: 2px;
  }

  button, a, input, select, textarea {
    min-height: 44px;
  }
`;
document.head.appendChild(focusStyles);

// Preferencia automática de alto contraste.
if (window.matchMedia('(prefers-contrast: more)').matches) {
  document.documentElement.classList.add('accessibility-high-contrast');
}
