# Minimal Marimba - Resonancias Electrónicas 2026

## 📋 Información del Proyecto

**Nombre del Proyecto:** Minimal Marimba - Evento Musical Experimental  
**Tema Asignado:** Festival de Música / Tech Event  
**Curso:** Evaluación Final Módulo 3 - Construcción de Web Modular con Buenas Prácticas CSS  
**Fecha:** Febrero 2026  

---

## 🎯 Descripción

Sitio web promocional para un evento musical ficticio que presenta el proyecto artístico "Minimal Marimba". El evento combina marimba acústica con electrónica en vivo, síntesis modular y procesamiento generativo en tiempo real.

Este proyecto es un **micrositio independiente** diseñado para promocionar un concierto especial titulado "Resonancias Electrónicas 2026", que forma parte del ecosistema digital de minimal mari**imba.cl.

---

## 🎨 Referencias Visuales

El diseño se inspira en las siguientes referencias estéticas:

### 1. Mutek Festival (www.mutek.org)
- **Aspecto utilizado:** Sistema de diseño oscuro con acentos de color neón
- **Influencia:** Tipografía bold, espaciado generoso, estética tecnológica

### 2. Ableton Live (www.ableton.com)
- **Aspecto utilizado:** Interfaz minimalista con gradientes sutiles
- **Influencia:** Organización de contenido modular, cards con información técnica

### 3. Awwwards - Experimental Portfolio Designs
- **Aspecto utilizado:** Animaciones sutiles, glassmorphism, microinteracciones
- **Influencia:** Componentes interactivos modernos, hover effects sofisticados

### Paleta de Color Principal:
- **Background:** #0a0a0a (Negro profundo)
- **Accent Primary:** #00ff9d (Verde eléctrico)
- **Accent Secondary:** #00d9ff (Cian vibrante)
- **Texto:** Escala de grises desde #ffffff hasta #707070

---

## 🛠️ Metodología CSS Utilizada

### Metodología de Nomenclatura: **BEM (Block Element Modifier)**

Todos los componentes siguen estrictamente la convención BEM:

```scss
// Ejemplos reales del proyecto:

// BLOQUE
.card { ... }
.accordion { ... }
.gallery { ... }

// ELEMENTO (__)
.card__header { ... }
.card__title { ... }
.accordion__item { ... }
.gallery__overlay { ... }

// MODIFICADOR (--)
.card--featured { ... }
.btn--primary { ... }
.popup--announcement { ... }
```

### Organización de Estilos: **SASS con Patrón 7-1**

```
scss/
├── abstracts/
│   ├── _variables.scss   # Variables globales
│   └── _mixins.scss       # Mixins reutilizables
├── base/
│   ├── _reset.scss        # Reset CSS
│   ├── _typography.scss   # Sistema tipográfico
│   └── _animations.scss   # Animaciones keyframes
├── layout/
│   ├── _header.scss       # Header y navegación
│   └── _sections.scss     # Secciones y footer
├── components/
│   ├── _buttons.scss      # Sistema de botones
│   ├── _cards.scss        # Cards con BEM
│   ├── _popup.scss        # Modal/Popup
│   ├── _accordion.scss    # Accordion (Bootstrap adaptado)
│   ├── _gallery.scss      # Galería con lightbox
│   └── _forms.scss        # Formularios
├── pages/
│   └── _home.scss         # Estilos específicos del home
└── main.scss              # Archivo principal que importa todo
```

---

## 📁 Estructura del Proyecto

```
minimal-marimba-evento/
│
├── index.html              # HTML principal
├── README.md               # Este archivo
│
├── scss/                   # Código fuente SASS
│   ├── abstracts/
│   ├── base/
│   ├── layout/
│   ├── components/
│   ├── pages/
│   └── main.scss
│
├── css/
│   └── main.css            # CSS compilado
│
├── js/
│   └── main.js             # JavaScript interactivo
│
└── assets/                 # Recursos (imágenes, audio)
    ├── images/
    └── audio/
```

---

## 📄 Secciones Implementadas

### ✅ 1. Header / Navegación
- Logo con degradado
- Menú de navegación responsivo
- Hamburger menu para móvil
- Efecto de scroll (backdrop blur al hacer scroll)
- **Bootstrap usado:** Estructura de navbar adaptada

### ✅ 2. Hero Section
- Imagen de fondo con overlay
- Título con gradiente de texto
- Call-to-action buttons
- Scroll indicator animado
- **Componentes:** Botones, gradientes animados

### ✅ 3. Concepto / Proyecto
- Grid de contenido (texto + imagen)
- Features con iconografía
- Tipografía jerárquica
- **Layout:** CSS Grid responsivo

### ✅ 4. Programa / Obras (Cards)
- 6 cards con información de obras musicales
- Card destacada (--featured modifier)
- Meta información con iconos
- **Bootstrap usado:** Sistema de Cards adaptado con BEM

### ✅ 5. Cronograma (Accordion) ⭐
- **Componente obligatorio:** Accordion de Bootstrap
- 6 ítems expandibles
- Información de horarios y bloques
- Tags categorizados
- **Cumple requerimiento del tema Festival/Tech Event**

### ✅ 6. Galería / Media
- Grid responsivo (masonry layout)
- 8 items con overlays
- **Lightbox custom** con navegación
- Animaciones de entrada
- **Componente interactivo avanzado**

### ✅ 7. Formulario de Contacto / Registro
- Campos: nombre, email, teléfono, interés, mensaje
- Checkboxes personalizados
- Validación HTML5
- **Bootstrap usado:** Estructura de formularios adaptada

### ✅ 8. Footer
- Información de contacto
- Enlaces de navegación
- Redes sociales
- Créditos del proyecto

### ✅ 9. Componentes Adicionales

#### Popup/Modal
- Anuncio del evento
- Backdrop con blur
- Animación de entrada
- **Componente interactivo extra**

---

## 🎨 Uso de Bootstrap 4

Bootstrap se utiliza **selectivamente** y siempre adaptado con estilos propios:

### Componentes Bootstrap Implementados:

1. **Grid System** ✅
   - Contenedores
   - Rows y columns responsivos
   - Breakpoints estándar

2. **Cards** ✅
   - Estructura base de cards
   - Adaptadas con BEM y estilos custom

3. **Forms** ✅
   - Form groups
   - Input groups
   - Validación

4. **Buttons** ✅
   - Clases base
   - Estados (hover, active, disabled)

5. **Accordion** ✅ **(OBLIGATORIO - CUMPLIDO)**
   - Componente interactivo principal
   - Adaptado con JavaScript vanilla
   - Estilos completamente personalizados

### CDN Utilizado:
```html
<!-- Bootstrap 4.6.2 -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js"></script>
```

---

## 💅 Uso de SASS

### Variables Definidas (`_variables.scss`):

```scss
// Colores
$color-dark-bg: #0a0a0a;
$color-primary: #00ff9d;
$color-secondary: #00d9ff;

// Tipografía
$font-primary: 'Inter';
$font-display: 'Space Grotesk';
$h1-size: clamp(3rem, 8vw, 6rem);

// Espaciado
$spacing-unit: 8px;
$spacing-xl: 48px;

// Transiciones
$transition-base: 0.3s ease;
```

### Mixins Utilizados (`_mixins.scss`):

```scss
@mixin respond-to($breakpoint) { ... }
@mixin flex-center { ... }
@mixin gradient-text { ... }
@mixin glow($color, $intensity) { ... }
@mixin section-padding { ... }
```

### Anidación:
Todos los componentes usan anidación SASS para mantener el código organizado:

```scss
.card {
  background: $color-dark-surface;
  
  &__header {
    margin-bottom: $spacing-md;
  }
  
  &--featured {
    @include glow($color-primary, 0.2);
  }
  
  &:hover {
    transform: translateY(-4px);
  }
}
```

### Parciales:
Cada archivo SASS es un parcial (prefijo `_`) importado en `main.scss`.

### Compilación:
```bash
# El CSS se compila desde:
scss/main.scss → css/main.css
```

---

## 📦 Modelo de Cajas y Posicionamiento

### Modelo de Cajas:
- Uso correcto de `margin` y `padding` en todos los componentes
- Box-sizing: border-box global
- Spacing system basado en múltiplos de 8px

### Posicionamiento Utilizado:

1. **Relativo:**
   - Cards con elementos internos absolutos
   - Accordions con iconos posicionados

2. **Absoluto:**
   - Overlays de galería
   - Iconos de accordion
   - Hero background overlay

3. **Fijo:**
   - Header sticky
   - Popup/Modal
   - Lightbox

4. **Flexbox:**
   - Header navigation
   - Button groups
   - Form layouts

5. **Grid:**
   - Cards grid (responsive)
   - Gallery masonry
   - Footer layout

---

## 📱 Responsividad

### Breakpoints Definidos:
```scss
$breakpoint-sm: 576px;   // Mobile landscape
$breakpoint-md: 768px;   // Tablet
$breakpoint-lg: 992px;   // Desktop
$breakpoint-xl: 1200px;  // Large desktop
```

### Estrategia Mobile-First:
Todos los componentes se diseñan primero para móvil y luego se adaptan:

```scss
.cards-grid {
  display: grid;
  gap: $spacing-lg;
  
  @include respond-to(md) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @include respond-to(lg) {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### Adaptaciones Principales:
- **Móvil:** Navegación hamburger, columna única
- **Tablet:** 2 columnas en grids, menú completo
- **Desktop:** 3-4 columnas, efectos hover completos

---

## ⚙️ Funcionalidades JavaScript

### Interactividad Implementada:

1. **Header Scroll Effect**
   - Backdrop blur al hacer scroll
   - Cambio de background opacity

2. **Mobile Menu**
   - Toggle hamburger
   - Smooth close en navegación

3. **Smooth Scroll**
   - Navegación suave entre secciones
   - Offset por header fijo

4. **Accordion**
   - Toggle de items
   - Auto-close de otros items
   - Animaciones de apertura/cierre

5. **Popup/Modal**
   - Apertura desde múltiples triggers
   - Cierre con ESC, backdrop, botón
   - Bloqueo de scroll del body

6. **Lightbox Gallery**
   - Navegación prev/next
   - Teclado (flechas, ESC)
   - Captions dinámicos

7. **Form Validation**
   - Validación HTML5
   - Feedback visual
   - Mensaje de éxito simulado

8. **Scroll Animations**
   - Intersection Observer para cards
   - Fade-in progresivo en galería

9. **Active Link Highlighting**
   - Detección de sección activa
   - Highlight en navegación

---

## 🚀 Cómo Usar Este Proyecto

### 1. Visualización Local:
```bash
# Abrir directamente el index.html en un navegador
open index.html
```

### 2. Con Servidor Local (recomendado):
```bash
# Python
python3 -m http.server 8000

# Node.js
npx http-server

# Luego navegar a: http://localhost:8000
```

### 3. Editar SASS:
```bash
# Editar archivos en scss/
# Luego recompilar:
cat scss/abstracts/_variables.scss scss/abstracts/_mixins.scss ... > css/main.css
```

---

## ✅ Cumplimiento de Rúbrica

### Configuración del Entorno:
- ✅ SASS configurado (compilación manual)
- ✅ Estructura modular BEM
- ✅ Patrón 7-1 implementado

### Construcción del Layout:
- ✅ CSS Grid y Flexbox con Bootstrap 4
- ✅ Diseño 100% responsivo
- ✅ Mobile, tablet, desktop cubiertos

### Uso de Preprocesadores:
- ✅ Variables en `_variables.scss`
- ✅ Mixins reutilizables
- ✅ Anidación en todos los componentes
- ✅ Parciales organizados

### Modelo de Cajas y Posicionamiento:
- ✅ Margins y paddings correctos
- ✅ Posicionamiento (relativo, absoluto, fijo)
- ✅ Box model aplicado consistentemente

### Componentes Bootstrap:
- ✅ Botones, cards, formularios, navegación
- ✅ **Accordion implementado** (requerido)
- ✅ Componentes interactivos custom

### Código Limpio:
- ✅ Nombres de clases BEM consistentes
- ✅ Código comentado y organizado
- ✅ Estructura modular mantenible

---

## 🎓 Notas para Evaluación

### Aspectos Destacados:

1. **Metodología BEM:** Aplicada rigurosamente en todos los componentes
2. **Patrón 7-1:** Estructura de carpetas profesional y escalable
3. **SASS Avanzado:** Variables, mixins, anidación, funciones
4. **Bootstrap Adaptado:** Uso inteligente sin dependencia total
5. **Interactividad:** JavaScript vanilla moderno (ES6+)
6. **Accesibilidad:** ARIA labels, navegación por teclado
7. **Performance:** CSS optimizado, imágenes lazy (preparado)

### Componente Obligatorio - Accordion:
El cronograma del evento usa **Accordion de Bootstrap** adaptado con:
- Estilos completamente personalizados con BEM
- JavaScript vanilla para la interactividad
- Diseño coherente con el resto del sitio
- Información estructurada (horarios, bloques, tags)

### Tema Festival/Tech Event:
Cumple perfectamente el tema asignado al presentar:
- Evento musical experimental
- Información técnica (setup, instrumentos)
- Cronograma completo
- Registro de asistencia
- Galería multimedia

---

## 📧 Contacto del Proyecto

**Proyecto:** Minimal Marimba  
**Sitio Real:** www.minimalmarimba.cl  
**Evento Ficticio:** Resonancias Electrónicas 2026  

**Autor:** [Tu Nombre]  
**Curso:** Módulo 3 - CSS Modular  
**Fecha de Entrega:** Febrero 2026  

---

## 📝 Licencia

Este proyecto es un trabajo académico creado para fines educativos.

---

**Desarrollado con:** HTML5 + SASS + Bootstrap 4 + JavaScript (Vanilla ES6)  
**Metodología:** BEM + Patrón 7-1  
**Diseño:** Dark Mode + Gradientes Eléctricos  
**Inspiración:** Música Experimental + Live Coding + Arte Generativo
