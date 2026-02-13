 Aquí está tu estrategia de trabajo paso a paso, priorizada por dependencias y complejidad:

---

## ESTRATEGIA DE TRABAJO: Efectos Visuales "Resonancias Electrónicas"

---

### FASE 1: FUNDAMENTOS (Sin dependencias)

**Objetivo:** Establecer la base antes de que otros efectos dependan de ella.

| # | Tarea                         | Archivos                                            | Tiempo estimado |
| - | ----------------------------- | --------------------------------------------------- | --------------- |
| 1 | **Cursor SVG baqueta**  | `index.html`, `main.css`, nuevo `cursor.js`   | 20 min          |
| 2 | **Partículas en hero** | `index.html`, `ParticleSystem.js`, `main.css` | 25 min          |

**Secuencia exacta:**

**Tarea 1 - Cursor:**

1. Crear archivo `js/cursor.js` con el código que te di
2. En `index.html`: reemplazar `<div class="custom-cursor">` por tu SVG
3. Añadir `<script src="js/cursor.js" defer></script>` antes del cierre `</body>`
4. En `main.css`: añadir media query `(pointer: fine)` con estilos del cursor
5. En `effects.js`: eliminar/commentar inicialización del cursor viejo

**Tarea 2 - Partículas:**

1. En `index.html`: verificar que `.hero__particles` tenga `height: 100%` definido
2. En `ParticleSystem.js`: añadir `setTimeout` de 100ms antes de `setCanvasSize()` para asegurar layout
3. Eliminar métodos duplicados (líneas 168-220)
4. Verificar en consola que no hay error "No container found"

---

### FASE 2: HERO COMPLETO (Depende de Fase 1)

**Objetivo:** Terminar toda la sección hero antes de pasar a cards.

| # | Tarea               | Archivos                     | Tiempo estimado |
| - | ------------------- | ---------------------------- | --------------- |
| 3 | **Ondas SVG** | `index.html`, `main.css` | 15 min          |

**Secuencia exacta:**

1. En `index.html`: unificar clases de waves:

   ```html
   <!-- ANTES (incorrecto) -->
   <svg class="hero__wave hero__wave--1">

   <!-- DESPUÉS (correcto) -->
   <svg class="hero__waves-svg" data-wave="1">
   ```
2. En `main.css`: reemplazar selector `.hero__wave` por `.hero__waves-svg` y añadir:

   ```css
   .hero__waves-svg:nth-child(1) { animation-duration: 10s; }
   .hero__waves-svg:nth-child(2) { animation-duration: 15s; opacity: 0.5; animation-direction: reverse; }
   .hero__waves-svg:nth-child(3) { animation-duration: 20s; opacity: 0.3; }
   ```
3. Verificar que `waveMove` keyframe existe en CSS

---

### FASE 3: CARDS (Interactividad básica)

**Objetivo:** Todos los efectos táctiles de cards funcionando.

| # | Tarea                               | Archivos                                     | Tiempo estimado |
| - | ----------------------------------- | -------------------------------------------- | --------------- |
| 4 | **Ripple en todas las cards** | `effects.js`, `main.css`, `index.html` | 20 min          |
| 5 | **Efecto tecla marimba**      | `main.css`, `index.html`                 | 10 min          |

**Secuencia exacta:**

**Tarea 4 - Ripple:**

1. En `effects.js` línea 69, cambiar selector:

   ```javascript
   // ANTES
   selector: '.card--marimba',

   // DESPUÉS
   selector: '.card',
   ```
2. En `main.css`: mover estilos `.card--marimba` a `.card` (para que todas lo tengan)
3. Opcional: si quieres que solo algunas tengan ripple, añade clase `.card--ripple` a esas cards en HTML

**Tarea 5 - Tecla marimba:**

1. En `main.css`, añadir a clase `.card`:
   ```css
   .card:active {
       transform: scale(0.98) translateY(2px);
       box-shadow: 0 4px 16px rgba(204, 85, 0, 0.2);
   }
   ```

---

### FASE 4: SECCIONES ESPECÍFICAS

**Objetivo:** Efectos en programa y acordeón.

| # | Tarea                           | Archivos                                               | Tiempo estimado |
| - | ------------------------------- | ------------------------------------------------------ | --------------- |
| 6 | **Visualizador de audio** | `index.html`, `AudioVisualizer.js`, `effects.js` | 20 min          |
| 7 | **LEDs en acordeón**     | `index.html`, `main.css`, `main.js`              | 15 min          |

**Secuencia exacta:**

**Tarea 6 - Visualizador:**

1. En `index.html`: mover `<div class="visualizer">` dentro de `<main>`, justo después de abrir `<main id="main">`
2. En `AudioVisualizer.js`: añadir verificación de dimensiones:

   ```javascript
   if (this.width === 0 || this.height === 0) {
       console.warn('Visualizer: Container sin dimensiones');
       return;
   }
   ```
3. En `effects.js`: cambiar inicialización para que use `IntersectionObserver` (solo cuando sea visible)

**Tarea 7 - LEDs:**

1. En `main.css` línea 1740, cambiar `left: -20px` por `left: -12px` (para que sea visible)
2. En `main.js`: verificar que el toggle de clase `accordion__item--active` funciona (ya debería estar, solo verificar)

---

### FASE 5: EFECTOS AVANZADOS

**Objetivo:** Parallax y glitch (efectos visuales complejos).

| #  | Tarea                           | Archivos                                              | Tiempo estimado |
| -- | ------------------------------- | ----------------------------------------------------- | --------------- |
| 8  | **Parallax en imágenes** | `index.html`, `ParallaxReverb.js`, `effects.js` | 15 min          |
| 9  | **Cursor hover feedback** | `cursor.js` (ya hecho en Fase 1)                    | 5 min           |
| 10 | **Glitch en títulos**    | `index.html`, `main.css`                          | 15 min          |

**Secuencia exacta:**

**Tarea 8 - Parallax:**

1. En `index.html`: añadir clase `parallax-image` a:

   - `.concept__image` (línea ~260)
   - `.speaker-card__image` (línea ~520)
2. En `effects.js`: verificar que `ParallaxReverb` se inicializa con selector correcto

**Tarea 9 - Cursor hover:** Ya está incluido en el código de Fase 1

**Tarea 10 - Glitch:**

1. En `index.html`, encontrar cards electrónicas (líneas 337, 375, etc.) y cambiar:

   ```html
   <!-- ANTES -->
   <h3 class="card__title">Ecos de Silicio</h3>

   <!-- DESPUÉS -->
   <h3 class="card__title glitch-text" data-text="Ecos de Silicio">Ecos de Silicio</h3>
   ```
2. Aplicar a: "Patrones Interferentes", "Ecos de Silicio", "Microtonos Digitales"

---

### FASE 6: VERIFICACIÓN Y DOCUMENTACIÓN

| #  | Tarea                          | Archivos                       | Tiempo estimado |
| -- | ------------------------------ | ------------------------------ | --------------- |
| 11 | **Verificar responsive** | Todos                          | 15 min          |
| 12 | **Documentar cambios**   | Comentarios en código, README | 10 min          |

**Checklist de verificación:**

- [ ] Desktop (Chrome, Firefox, Safari): todos los efectos visibles
- [ ] Móvil (iOS Safari, Android Chrome): cursor oculto, partículas desactivadas, ondas visibles, ripple funciona al tocar
- [ ] Tablet: comportamiento híbrido correcto
- [ ] Reducir motion: todos los efectos respetan `prefers-reduced-motion`

---

## ORDEN DE COMMITS SUGERIDO

```
1. "feat(cursor): implementar cursor SVG baqueta"
2. "fix(particles): reparar sistema de partículas en hero"
3. "feat(waves): añadir ondas SVG animadas en hero"
4. "feat(cards): ripple y efecto tecla en todas las cards"
5. "feat(visualizer): añadir visualizador de audio en programa"
6. "feat(accordion): LEDs pulsantes en items activos"
7. "feat(parallax): efecto parallax en imágenes"
8. "feat(glitch): efecto glitch en títulos electrónicos"
9. "chore(docs): documentar efectos visuales implementados"
```

---

## COMANDOS DE VERIFICACIÓN RÁPIDA

```bash
# Verificar que no hay errores de JS
# Abrir consola del navegador (F12) y filtrar por:
"ParticleSystem"
"AudioVisualizer"
"CustomCursor"

# Verificar que clases están aplicadas
# En consola, ejecutar:
document.querySelectorAll('.card--marimba').length  // Debe ser 0 (ahora usamos .card)
document.querySelectorAll('.glitch-text').length    // Debe ser 3
document.querySelectorAll('.parallax-image').length // Debe ser 2+
```

---

**Tiempo total estimado:** 2.5 - 3 horas de trabajo concentrado.



**Plan Maestro de Trabajo (Referencia Ejecutable)**

**1) Marco de operación (lo que SÍ y lo que NO)**

1. Se trabaja en modo `aditivo` o `sustractivo controlado`, nunca destructivo.
2. No se toca `cursor` (ni `js/modules/CustomCursor.js` ni CSS asociado).
3. No se refactoriza por gusto; solo cambios necesarios para cada ítem.
4. Cada cambio queda reversible por bandera (`feature flag`).
5. No se activa nada que no esté en tus 7 puntos.
6. Se valida visualmente en desktop + mobile + `prefers-reduced-motion`.

**2) Matriz completa 1–7 (estado actual y acción exacta)**

| Ítem                                     | Estado actual                       | Acción planificada                                                         | Archivos objetivo                                                                                      | Criterio de éxito                                     |
| ----------------------------------------- | ----------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------ |
| 1. Rayos eléctricos sutiles              | Hay ondas SVG (`hero__waves`)     | Mutar visual a rayos sutiles en el mismo contenedor, con fallback           | `js/modules/ElectricArcs.js` (nuevo), `js/effects.js`, `css/main.css`, `scss/pages/_home.scss` | Rayos finos, aleatorios, no invasivos, sin romper hero |
| 2. Levantar visualizer                    | Existe, pero visualmente apagado    | Activar clase visual y mantener intensidad baja                             | `js/modules/AudioVisualizer.js`, `css/main.css`                                                    | Se ve en parte baja, sutil, sin tapar contenido        |
| 3. Levantar glitch                        | CSS existe, no aplicado en títulos | Aplicar solo en títulos seleccionados (subtle)                             | `index.html`                                                                                         | Glitch visible en hover/sutil en títulos elegidos     |
| 4. Partículas (qué es y dónde se ve)   | Existe en hero                      | Dejar visible-controlado y documentado                                      | `js/modules/ParticleSystem.js`, `css/main.css`                                                     | Partículas identificables, sin ruido excesivo         |
| 5. Tecla marimba (qué es y dónde se ve) | Existe ripple + press en cards      | Asegurar percepción clara en cards marimba                                 | `js/modules/RippleEffect.js`, `css/main.css`, `index.html`                                       | Click da ripple + feedback físico evidente            |
| 6. Síntesis modular cronograma           | Existe estilo modular               | Ajustar visibilidad del “LED”/línea si está muy tenue                   | `css/main.css`, `scss/components/_accordion.scss`                                                  | Estado activo modular claramente visible               |
| 7. Reverb/parallax + confirmar glitch     | JS existe, casi no se nota          | Conectar a elementos reales (`.parallax-image`) y confirmar glitch activo | `index.html`, `js/effects.js`, `css/main.css`                                                    | Parallax perceptible y estable, glitch confirmado      |

**3) Estrategia técnica por fases (orden real de ejecución)**

1. **Fase 0: Preparación segura**
   Crear bandera de efectos en `js/effects.js` para controlar activación por ítem.

```js
const EFFECT_FLAGS = {
  electricArcs: true,
  visualizer: true,
  glitchTitles: true,
  particles: true,
  marimbaKey: true,
  modularAccordion: true,
  parallaxReverb: true
};
```

2. **Fase 1: Levantar 2 (visualizer) primero**
   Cambio mínimo de riesgo bajo: activar clase visual al iniciar el módulo.

```js
this.container.classList.add('visualizer--active');
```

3. **Fase 2: Levantar 3 (glitch) en HTML**Aplicar clases solo en títulos acordados, modo `--subtle`, sin globalizar.
4. **Fase 3: Ejecutar 1 (rayos eléctricos)**Agregar módulo nuevo `ElectricArcs`, dibujando en canvas dentro de `.hero__waves`, con opacidad baja y eventos espaciados.
5. **Fase 4: Validar 4 (partículas)**No reescritura grande; solo calibración de opacidad/cantidad si está sobrecargado.
6. **Fase 5: Validar 5 (tecla marimba)**Confirmar ripple + active press en cards `card--marimba`; reforzar solo si no se percibe.
7. **Fase 6: Validar 6 (modular accordion)**Ajustar contraste del LED/línea modular en estado activo.
8. **Fase 7: Levantar 7 (reverb/parallax)**Conectar el efecto a elementos reales agregando `.parallax-image` en bloques concretos (imagen concepto y speaker).
9. **Fase 8: Cierre técnico**
   Revisión visual final + verificación sin errores JS + fallback `reduced-motion`.

**4) Propuesta concreta de implementación por ítem (código/arquitectura)**

1. **Ítem 1: ElectricArcs (nuevo módulo)**

```js
// js/modules/ElectricArcs.js
class ElectricArcs {
  constructor({ container, intensity = 0.25, minDelay = 350, maxDelay = 1200 }) {}
  createBoltPath() {}
  drawBolt(path, alpha) {}
  loop() {}
  destroy() {}
}
export default ElectricArcs;
```

```css
/* aditivo */
.hero__waves--electric svg { opacity: 0; }
.hero__waves--electric canvas {
  position: absolute;
  inset: 0;
  opacity: .22;
  mix-blend-mode: screen;
  pointer-events: none;
}
```

2. **Ítem 2: Visualizer**

```js
// en AudioVisualizer constructor
this.container.classList.add('visualizer--active');
```

3. **Ítem 3: Glitch en títulos**

```html
<h3 class="card__title glitch-text glitch-text--subtle" data-text="Patrones Interferentes">Patrones Interferentes</h3>
<h3 class="card__title glitch-text glitch-text--subtle" data-text="Microtonos Digitales">Microtonos Digitales</h3>
```

4. **Ítem 4: Partículas**
5. Mantener `ParticleSystem` actual.
6. Ajustar `particleCount` y `opacity` si el hero se ve cargado.
7. No tocar cursor ni navegación.
8. **Ítem 5: Tecla marimba**
9. Verificar que `RippleEffect` esté activo en `.card--marimba`.
10. Ajustar color/alpha del ripple si hoy no se nota.
11. **Ítem 6: Modular accordion**
12. Reforzar visibilidad de `accordion-container--modular .accordion__item--active::before`.
13. Mantener animación suave, no invasiva.
14. **Ítem 7: Reverb/parallax**
15. Agregar `.parallax-image` a contenedores existentes de imagen.
16. Mantener `speed` conservador para evitar mareo.

**5) Criterios de aceptación (DoD) por ítem**

1. Ítem 1 aprobado si los rayos se perciben como “eléctricos sutiles” y no tapan texto.
2. Ítem 2 aprobado si el visualizer se ve y no invade lectura.
3. Ítem 3 aprobado si el glitch se nota en los títulos seleccionados.
4. Ítem 4 aprobado si partículas se distinguen sin ruido visual.
5. Ítem 5 aprobado si click en card marimba da feedback claro.
6. Ítem 6 aprobado si el estado activo modular se entiende visualmente.
7. Ítem 7 aprobado si parallax se percibe suave y estable.

**6) Plan de rollback (por si no te gusta un cambio)**

1. Cada ítem se puede apagar por `EFFECT_FLAGS`.
2. Ítem 1 se revierte quitando clase `hero__waves--electric`.
3. Ítem 3 se revierte quitando `glitch-text` del HTML.
4. Ítem 7 se revierte quitando `.parallax-image` del HTML.

**7) Entregable final esperado**

1. Sitio con 7 efectos visibles/entendibles según tu criterio.
2. Sin tocar cursor.
3. Sin romper navbar ni flujo actual.
4. Todo controlable por banderas para ajuste fino.

Si apruebas este plan, ejecuto exactamente en ese orden y te voy mostrando avance por fase (1→8), sin saltos ni cambios fuera de alcance.
