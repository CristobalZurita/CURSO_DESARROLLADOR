# 📚 Guía Rápida - Cómo Usar los Efectos

## Auto-Inicialización

Los efectos se cargan automáticamente cuando incluyes el script:

```html
<script type="module" src="js/effects.js"></script>
```

Todos los efectos se inicializan cuando el DOM está listo.

---

## Acceso a los Efectos en Consola

```javascript
// Acceder a todos los efectos inicializados
console.log(window.resonanciasEffects);

// Estructura disponible:
window.resonanciasEffects = {
    audioVisualizer,
    particleSystem,
    customCursor,
    rippleEffect,
    parallaxReverb
}
```

---

## Uso Individual de Cada Efecto

### 1. AudioVisualizer

```javascript
const visualizer = window.resonanciasEffects.audioVisualizer;

// Toggle visibility
visualizer.toggle();

// Acceder al contenedor
visualizer.container; // .visualizer element

// Cleanup
visualizer.destroy();
```

**HTML requerido:**
```html
<div class="visualizer"></div>
```

**CSS:**
```css
/* Toggle visibility con esta clase */
.visualizer.visualizer--active { ... }
```

---

### 2. ParticleSystem

```javascript
const particles = window.resonanciasEffects.particleSystem;

// Emitir partículas en posición (x, y) con cantidad
particles.emitParticles(100, 200, 10);

// Acceder a propiedades
particles.particles;      // Array de partículas
particles.particleCount;  // Número total
particles.grid;          // Spatial grid HashMap

// Cleanup
particles.destroy();
```

**HTML requerido:**
```html
<div class="hero__particles"></div>
```

**Spatial Grid:**
```
Grid de 150px x 150px para detección de vecinos O(n)
En lugar de comparar cada partícula con todas (O(n²))
Se busca en 9 celdas adyacentes solamente
```

---

### 3. CustomCursor

```javascript
const cursor = window.resonanciasEffects.customCursor;

// Restaurar cursor nativo
cursor.restore();

// Cambiar velocidad de tracking
cursor.easing = 0.15; // 0-1, menor = más rápido

// Elemento SVG
cursor.cursor; // .custom-cursor element
```

**HTML requerido:**
```html
<div class="custom-cursor"></div>
```

**Features:**
- ✓ SVG gradient baqueta
- ✓ 3 estados (default, click, hover)
- ✓ Restaura nativo en :focus-visible
- ✓ Deshabilitado en touch devices

---

### 4. RippleEffect

```javascript
const ripple = window.resonanciasEffects.rippleEffect;

// Se inicializa automáticamente en .card--marimba
// Los clicks generan ripples automáticamente

// Crear ripple manualmente
ripple.createRipple(event, element, isKeyboard);
```

**HTML requerido:**
```html
<div class="card card--marimba">
    <!-- Ripple se genera automáticamente en click -->
</div>
```

**Características:**
- ✓ Click ripple
- ✓ Keyboard accessible (Enter/Space)
- ✓ Auto cleanup
- ✓ Duración: 600ms

---

### 5. ParallaxReverb

```javascript
const parallax = window.resonanciasEffects.parallaxReverb;

// Cambiar velocidad de parallax
parallax.setSpeed(0.7);

// Elementos con parallax
parallax.elements; // NodeList de .parallax-image

// Cleanup
parallax.destroy();
```

**HTML requerido:**
```html
<img src="..." class="parallax-image">
```

**Características:**
- ✓ Scroll-based parallax
- ✓ GPU-accelerated (translate3d)
- ✓ Throttled scroll (16ms)
- ✓ Blur filter echo effect

---

## Media Queries Importantes

### prefers-reduced-motion
Todos los efectos respetan esta preferencia:

```css
@media (prefers-reduced-motion: reduce) {
    /* Efectos se desactivan automáticamente */
}
```

### pointer: fine vs pointer: coarse
CustomCursor solo funciona con mouse:

```css
@media (pointer: fine) {
    /* CustomCursor está activo */
}

@media (pointer: coarse) {
    /* CustomCursor deshabilitado, cursor nativo */
}
```

---

## Variables SCSS Importantes

```scss
// Colores
$color-audio-primary: #cc5500;
$color-audio-secondary: #00ff9d;

// Duraciones
$duration-glitch: 5s;
$duration-glitch-hover: 0.3s;
$duration-wave: 10s, 15s, 20s;

// Z-index Scale
$z-background: -1;
$z-waves: 5;
$z-particles: 10;
$z-visualizer: 200;
$z-cursor: 300;

// Particle Config
$particle-count-full: 50;
$particle-count-mobile: 20;
$particle-grid-size: 150px;

// Waves
$wave-height: clamp(80px, 15vh, 200px);
$wave-opacity-desktop: 0.3;
$wave-opacity-mobile: 0.1;
```

---

## Clases CSS Importantes

### Cards
```html
<!-- Ripple effect + key-press -->
<div class="card card--marimba">...</div>

<!-- Glitch text + glow -->
<div class="card card--electronic">...</div>
```

### Accordion
```html
<!-- LED indicators + gradient line -->
<div class="accordion-container accordion-container--modular">...</div>
```

### Visualizer
```html
<!-- Fixed visualizer -->
<div class="visualizer visualizer--active"></div>
```

### Parallax
```html
<!-- Parallax effect -->
<img class="parallax-image" src="...">
```

---

## Performance Tips

### 1. Pausa effectos fuera de viewport
```javascript
// Usa Intersection Observer para pausar canvas
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            // Pausa particle system
            particleSystem.particles = [];
        }
    });
});
observer.observe(document.querySelector('.hero__particles'));
```

### 2. Monitorea FPS
```javascript
let lastTime = performance.now();
let fps = 0;

function checkFPS() {
    const now = performance.now();
    const delta = now - lastTime;
    lastTime = now;
    fps = Math.round(1000 / delta);
    console.log('FPS:', fps);
}
```

### 3. Reduce particle count en móvil
```javascript
const isMobile = window.innerWidth < 768;
const particleCount = isMobile ? 20 : 50;
```

---

## Debugging

### Habilitar logs
Cada módulo tiene console.log para debugging:

```javascript
// AudioVisualizer
console.log('✨ AudioVisualizer initialized');

// ParticleSystem
console.log(`✨ ParticleSystem initialized with 50 particles`);

// CustomCursor
console.log('✨ CustomCursor initialized');

// RippleEffect
console.log('✨ RippleEffect initialized');

// ParallaxReverb
console.log('✨ ParallaxReverb initialized');
```

### Verificar carga de módulos
```javascript
// En DevTools Console:
typeof window.resonanciasEffects; // 'object'

// Verificar cada efecto:
window.resonanciasEffects.audioVisualizer;      // AudioVisualizer
window.resonanciasEffects.particleSystem;       // ParticleSystem
window.resonanciasEffects.customCursor;         // CustomCursor
window.resonanciasEffects.rippleEffect;         // RippleEffect
window.resonanciasEffects.parallaxReverb;       // ParallaxReverb
```

---

## Troubleshooting

### Canvas no aparece
- Verificar que contenedor `.hero__particles` o `.visualizer` existe
- Verificar que CSS tiene dimensiones (ancho/alto)
- Abrir DevTools → Network → buscar AudioVisualizer.js, ParticleSystem.js

### Cursor no funciona
- Verificar que dispositivo es mouse (no touch)
- Verificar que elemento `.custom-cursor` existe
- Verificar que screen size no es mobile

### Ripple no funciona
- Verificar que elemento tiene clase `.card--marimba`
- Verificar que evento click se dispara
- Abrir DevTools → Elements → buscar `.ripple` después de click

### Parallax lento
- Verificar fps con DevTools Performance
- Reducir número de elementos `.parallax-image`
- Verificar hardware (GPU aceleración habilitada)

---

## Links Útiles

📄 **Documentación completa:** `EFECTOS_IMPLEMENTACION.md`
🔗 **URL Local:** `http://localhost:8080`
📁 **Código fuente:** 
- JavaScript: `js/modules/`
- SCSS: `scss/`
- HTML: `index.html`

---

## Próximos Pasos Opcionales

1. **Web Audio API** - Conectar micrófono para visualizador real
2. **Intersection Observer** - Pausar efectos fuera de viewport
3. **Service Worker** - Cache offline
4. **Analytics** - Tracking de interacciones
5. **Theme Toggle** - Light/dark mode con localStorage

---

**Versión:** 2026-02-12
**Estado:** ✅ Producción lista
