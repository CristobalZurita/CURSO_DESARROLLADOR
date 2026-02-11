# 📚 SASS Architecture - Minimal Marimba Evento 2026

## Patrón 7-1 Moderno con Dart Sass (@use)

Este proyecto utiliza el patrón 7-1 mejorado con **Dart Sass moderno** y **@use** en lugar del deprecated **@import**.

### 📁 Estructura de Carpetas

```
scss/
├── abstracts/           # Sin salida CSS - Nivel más bajo
│   ├── _variables.scss  # Colores, tipografía, espaciado, breakpoints, z-index
│   ├── _mixins.scss     # Utilidades reutilizables para componentes
│   └── _index.scss      # Exporta variables y mixins (centralización)
│
├── base/                # Estilos globales fundamentales
│   ├── _reset.scss      # CSS reset (box-sizing, reset de márgenes)
│   ├── _typography.scss # Headings, párrafos, tipografía global
│   ├── _animations.scss # Keyframes reutilizables (@keyframes)
│   └── _index.scss      # Exporta todos los estilos base
│
├── layout/              # Estructura principal de página
│   ├── _header.scss     # Header, navegación, menú mobile
│   ├── _sections.scss   # Secciones, contenedores, grillas
│   └── _index.scss      # Exporta layouts
│
├── components/          # Componentes reutilizables BEM
│   ├── _buttons.scss    # Botones (primario, secundario, etc)
│   ├── _cards.scss      # Cards con hover y efectos
│   ├── _popup.scss      # Modal/Popup
│   ├── _accordion.scss  # Acordeón expandible
│   ├── _gallery.scss    # Galería con lightbox
│   ├── _forms.scss      # Formularios
│   ├── _speakers.scss   # Artistas/Oradores
│   ├── _location.scss   # Ubicación e información
│   ├── _faq.scss        # Preguntas frecuentes
│   └── _index.scss      # Exporta todos los componentes
│
├── pages/               # Estilos específicos de página
│   ├── _home.scss       # Estilos únicos de home (hero, secciones)
│   └── _index.scss      # Exporta estilos de página
│
├── themes/              # Variaciones de temas (reservado)
│   └── _index.scss      # Exporta temas
│
├── utilities/           # Clases de utilidad CSS
│   ├── _spacing.scss    # Margen y padding: .mt-1, .mb-2, etc
│   ├── _text.scss       # Alineación, display: .text-center, .d-none
│   └── _index.scss      # Exporta utilidades
│
├── vendors/             # Overrides de librerías externas (reservado)
│   └── _index.scss      # Exporta customizaciones
│
└── main.scss            # Archivo principal - importa todo
```

---

## 🎯 Convenciones de Naming - BEM (Block, Element, Modifier)

### Formato:
```scss
// BLOCK - Componente principal
.button { }

// ELEMENT - Parte de un block (separado por __)
.button__icon { }

// MODIFIER - Variante de un block o element (separado por --)
.button--primary { }
.button__icon--small { }
```

### Ejemplos en el proyecto:

```scss
// HEADER
.header { }                    // Block
.header__logo { }             // Element
.header__nav { }              // Element
.header__link { }             // Element
.header__link::after { }      // Pseudo-elemento
.header__link--active { }     // Modifier
.header--scrolled { }         // Block modifier (estado)

// CARDS
.card { }                      // Block
.card__image { }              // Element
.card__title { }              // Element
.card__featured { }           // Modifier (variante especial)
.card:hover { }               // Pseudo-clase

// BUTTONS
.btn { }                       // Block
.btn--primary { }             // Modifier (variante)
.btn--secondary { }           // Modifier
.btn--small { }               // Modifier (tamaño)
.btn::before { }              // Ripple effect pseudo-elemento
```

### NO hacer (anti-pattern BEM):
```scss
// ❌ Anidación excesiva
.header .header-nav .nav-item a { }

// ❌ Nombres muy largos
.header__navigation__main__menu__list__item { }

// ❌ Múltiples niveles sin separator claro
.header_nav_link { }

// ✅ CORRECTO
.header { }
.header__nav { }
.header__link { }
```

---

## 🎨 Variables Centralizadas

### Colores
```scss
$color-dark-bg: #0a0a0a;          // Fondo principal
$color-dark-surface: #151515;     // Superficie (cards)
$color-dark-elevated: #1f1f1f;    // Elevado
$color-primary: #cc5500;          // Naranja cobre
$color-secondary: #993300;        // Cobre oscuro
$color-text-primary: #ffffff;     // Texto principal
$color-text-secondary: #b0b0b0;  // Texto secundario
$color-text-muted: #707070;       // Texto suave
```

### Tipografía
```scss
$font-primary: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
$font-display: 'Space Grotesk', 'Inter', sans-serif;
$font-mono: 'IBM Plex Mono', 'Courier New', monospace;

// Escala: clamp(min, preferred, max)
$h1-size: clamp(3rem, 8vw, 6rem);
$h2-size: clamp(2rem, 5vw, 3.5rem);
```

### Espaciado (8px unit)
```scss
$spacing-xs: 8px;     // Mínimo
$spacing-sm: 16px;    // Pequeño
$spacing-md: 24px;    // Medio (default)
$spacing-lg: 32px;    // Grande
$spacing-xl: 48px;    // Extra grande
$spacing-2xl: 64px;   // Doble XL
```

### Z-Index Scale (Centralizado)
```scss
$z-base: 0;                // Elementos normales
$z-dropdown: 100;          // Dropdowns
$z-sticky: 200;            // Headers sticky/fixed
$z-fixed: 300;             // Elementos fixed
$z-modal-backdrop: 400;    // Backdrop de modal
$z-modal: 500;             // Modales
$z-popup: 600;             // Popups
$z-tooltip: 700;           // Tooltips
$z-max: 999;               // Máximo permitido
```

### Transiciones (Uniforme 0.3s ease)
```scss
$transition-fast: 0.15s ease;    // Micro interacciones rápidas
$transition-base: 0.3s ease;     // Estándar (la mayoría de efectos)
$transition-slow: 0.5s ease;     // Animaciones notables
$transition-slower: 0.8s ease;   // Transiciones largas
```

---

## 🔧 Mixins Reutilizables

### Responsive Design
```scss
@include respond-to(md) { }   // Media query tablet (768px+)
@include respond-to(lg) { }   // Media query desktop (992px+)
```

### Flexbox/Grid
```scss
@include flex-center { }                      // Centrado perfecto
@include flex-between { }                     // Space-between
@include grid($columns: 2, $gap: 16px) { }   // Grilla CSS
```

### Microinteracciones (NUEVOS)
```scss
@include hover-effect(-4px) { }               // Elevación en hover
@include smooth-transition(all) { }          // Transición 0.3s uniforme
@include transform-lift { }                  // Elevación + sombra
@include glow-shadow($color-primary) { }    // Resplandor en hover
@include scale-hover(1.05) { }              // Zoom 5% en hover
@include underline-animation { }            // Subrayado animado
@include ripple-effect { }                  // Efecto onda Material
@include border-animation { }               // Borde superior animado
@include slide-in(left, 20px) { }          // Deslizar desde dirección
@include fade-scale(0.8, 0.5) { }          // Desvanecimiento + zoom
@include pulse-animation(2s) { }            // Pulso infinito
@include shake-animation(0.5s) { }         // Temblor (validación)
```

### Utilidades
```scss
@include section-padding { }                 // Padding responsivo de sección
@include animated-gradient { }              // Gradiente animado
@include text-contrast { }                  // Sombra de texto para legibilidad
@include glass($blur: 10px) { }            // Glassmorphism
@include line-clamp($lines: 2) { }         // Limitar líneas de texto
@include truncate { }                       // Truncar texto con ellipsis
@include aspect-ratio($width, $height) { }// Mantener ratio
```

---

## 📝 Convenciones de Comentarios

### Encabezados de Sección
```scss
// ============================================
// COMPONENTE - Descripción breve
// ============================================
```

### Subsecciones
```scss
// ELEMENTO - Descripción
// -------------------------------------------- 
```

### Notas importantes
```scss
// IMPORTANTE: Esta propiedad afecta a...
// NOTA: Usar con cuidado porque...
// TODO: Refactorizar cuando...
```

### Mixins con documentación
```scss
// @mixin hover-effect - Elevación en hover
// Parámetros: $distance (-4px), $duration ($transition-base)
// Uso: @include hover-effect(-2px, 0.2s ease);
```

---

## 🔄 Flujo de @use vs @import (Dart Sass)

### Antes (Deprecated @import)
```scss
@import 'abstracts/variables';      // Cargaba globals
@import 'abstracts/mixins';
@import 'base/reset';
```

### Ahora (Dart Sass @use + @forward)
```scss
// main.scss - Importa carpetas (automático con _index.scss)
@use 'abstracts/' as *;             // Importa todo de abstracts/_index.scss
@use 'base/' as *;

// abstracts/_index.scss - Centraliza exports
@forward 'variables';               // Re-exporta variables
@forward 'mixins';                  // Re-exporta mixins

// componentes/_buttons.scss - Usa lo que necesita
@use '../abstracts/' as *;          // Acceso a $color-primary, @include mixin
```

### Ventajas @use + @forward:
✅ Namespacing automático (evita conflictos)
✅ Mejor control de dependencias
✅ Más performante (sin circular imports)
✅ Compatible con Dart Sass moderno
✅ Estructura clara: quién usa qué

---

## 📊 Checklist de Buenas Prácticas

- [x] BEM Naming: Blocks, Elements, Modifiers separados por __, --
- [x] Variables centralizadas: Colores, tipografía, espaciado, z-index
- [x] Mixins reutilizables: No DRY (Don't Repeat Yourself)
- [x] Patrón 7-1: Separación clara de responsabilidades
- [x] @use + @forward: Dart Sass moderno
- [x] Comentarios explicativos: En secciones y componentes críticos
- [x] Transiciones uniformes: 0.3s ease como estándar
- [x] will-change: En elementos animados para performance
- [x] Responsive: Media queries con mixins (respond-to)
- [x] Accesibilidad: Transiciones suaves, alto contraste

---

## 🚀 Cómo agregar un nuevo componente

1. **Crear archivo**: `scss/components/_nuevo.scss`
2. **Agregar @use**: `@use '../abstracts/' as *;` al inicio
3. **Usar BEM**: Nombrar bloques, elementos, modificadores
4. **Reutilizar variables**: $color-primary, $spacing-md, etc
5. **Usar mixins**: @include hover-effect, @include smooth-transition
6. **Exportar en _index.scss**: `@forward 'nuevo';`

### Ejemplo:
```scss
// scss/components/_nuevo.scss
@use '../abstracts/' as *;

// BEM Block
.nuevo {
  background: $color-dark-surface;
  padding: $spacing-lg;
  border-radius: $border-radius-lg;
  @include smooth-transition(all);
  
  // Element
  &__content {
    color: $color-text-primary;
  }
  
  // Modifier + Mixin
  &--featured {
    @include glow-shadow($color-primary);
    @include hover-effect(-2px);
  }
}
```

---

## 📞 Referencia Rápida

| Necesito | Archivo | Uso |
|----------|---------|-----|
| Color primario | variables.scss | $color-primary |
| Transición suave | mixins.scss | @include smooth-transition(all) |
| Espaciado | variables.scss | $spacing-md |
| Hover effect | mixins.scss | @include hover-effect |
| Responsive | mixins.scss | @include respond-to(md) |
| Centrado | mixins.scss | @include flex-center |

---

**Versión**: 1.0  
**Última actualización**: 11 Feb 2026  
**Dart Sass**: Compatible  
