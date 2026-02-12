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
