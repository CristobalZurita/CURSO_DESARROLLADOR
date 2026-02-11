# MINIMAL MARIMBA - PROJECT SPECIFICATION

## 📋 METADATA
- **Proyecto**: Minimal Marimba - Resonancias Electrónicas 2026
- **Tipo**: Event Website (landing page + registration)
- **Stack**: HTML5 + SCSS (Dart Sass @use) + Bootstrap 4.6.2 + Vanilla JS
- **Objetivo**: 90-100% rubric compliance + Performance optimization (McMaster-Carr principles)
- **Current Score**: 93% rubric | Performance: Phase 2 (in progress)
- **Last Update**: 2026-02-11 | Commit: 32f6615

---

## 🏗️ ARQUITECTURA

### SCSS Pattern: 7-1 (Dart Sass @use)
```
scss/
├── abstracts/          → Global variables, mixins, functions
│   ├── _variables.scss (Z-index scale: 9 vars, Colors, Spacing, Transitions, Shadows)
│   ├── _mixins.scss    (12 microinteraction mixins + utilities)
│   └── _index.scss     (@forward abstracts exports)
│
├── base/               → CSS reset, typography, animations
│   ├── _reset.scss     (box-sizing, font-smoothing, universal reset)
│   ├── _typography.scss (h1-h6, body, p, a, link styles)
│   ├── _animations.scss (keyframes: fadeIn, fadeInUp, float, slide, pulse, shake)
│   └── _index.scss     (@forward base exports)
│
├── layout/             → Major page sections (header, footer, main sections)
│   ├── _header.scss    (fixed nav, glassmorphism blur, responsive burger menu)
│   ├── _sections.scss  (generic section container styles, padding, alignment)
│   └── _index.scss     (@forward layout exports)
│
├── components/         → Reusable UI components (cards, buttons, forms, etc)
│   ├── _buttons.scss        (ripple effect, color variants, hover states)
│   ├── _cards.scss          (feature cards, work cards with border animation)
│   ├── _popup.scss          (modal overlay, registration form container)
│   ├── _accordion.scss      (collapsible timeline items, FAQ items)
│   ├── _gallery.scss        (lightbox, image grid, navigation)
│   ├── _forms.scss          (input validation, focus states, error messages)
│   ├── _speakers.scss       (NEW - speaker/artist profiles grid)
│   ├── _location.scss       (NEW - location info, map placeholder, contact)
│   ├── _faq.scss            (NEW - FAQ accordion items)
│   └── _index.scss          (@forward 9 components)
│
├── pages/              → Page-specific styles
│   ├── _home.scss      (hero section, z-index layering, page-specific overrides)
│   └── _index.scss     (@forward pages exports)
│
├── utilities/          → Utility classes (spacing, text alignment, display)
│   ├── _spacing.scss   (.mt-1, .mb-2, .px-3, etc via $spacing-unit * scale)
│   ├── _text.scss      (.text-center, .text-large, .font-bold, etc)
│   └── _index.scss     (@forward utilities exports)
│
├── vendors/            → Third-party CSS (Bootstrap overrides, normalize)
│   └── _index.scss     (@forward vendors exports)
│
└── main.scss           → Master file orchestrates all @use imports
```

### Migration Path: @import → @use
- **Status**: ✅ 100% complete across all 25+ SCSS files
- **Pattern**: Each file includes `@use '../abstracts/' as *;` to access variables/mixins
- **Benefits**: Modern Dart Sass, namespace isolation, tree-shaking, faster compilation

---

## 🎨 DESIGN SYSTEM

### Z-Index Scale (Centralized in _variables.scss)
```scss
$z-base:            0      // default stacking context
$z-dropdown:        100    // dropdown menus
$z-sticky:          200    // sticky header
$z-fixed:           300    // fixed positioning (nav)
$z-modal-backdrop:  400    // semi-transparent overlay
$z-modal:           500    // modal dialogs
$z-popup:           600    // registration popup
$z-tooltip:         700    // tooltips
$z-max:             999    // absolute maximum
```
**Applied To**: Navigation header, gallery lightbox, popup modals, dropdowns

### Color Palette
```scss
$color-primary:     #cc5500  // Orange (event branding)
$color-secondary:   #004d99  // Blue (accent)
$color-dark:        #0a0e27  // Dark navy (backgrounds)
$color-light:       #f5f5f5  // Light gray (text on dark)
$color-text:        #1a1a1a  // Dark text
$color-border:      #e0e0e0  // Light borders
```

### Spacing Scale (Based on $spacing-unit: 8px)
```scss
$spacing-xs:   0.25 * $spacing-unit  // 2px
$spacing-sm:   0.5  * $spacing-unit  // 4px
$spacing-md:   1    * $spacing-unit  // 8px (base)
$spacing-lg:   1.5  * $spacing-unit  // 12px
$spacing-xl:   2    * $spacing-unit  // 16px
$spacing-2xl:  3    * $spacing-unit  // 24px
$spacing-3xl:  4    * $spacing-unit  // 32px
$spacing-4xl:  6    * $spacing-unit  // 48px
```

### Transition Timing
```scss
$transition-base:    0.3s ease         // default smooth transition
$transition-slow:    0.5s ease         // slow animations
$transition-slower:  0.8s ease-out     // very slow, easing out
```

### Typography
```scss
$font-primary:    'Inter', sans-serif             // Body text
$font-display:    'Space Grotesk', sans-serif     // Headings
$font-mono:       'IBM Plex Mono', monospace      // Code/technical
$line-height:     1.6                            // Body text
$line-height-headings: 1.2                       // Headings
```

---

## 🎭 MICROINTERACTION MIXINS (12 Total)

### 1. **hover-effect($distance: -4px)**
Elevates element on hover, creates depth perception
```scss
.card {
  @include hover-effect(-4px);  // Lifts 4px up
}
```

### 2. **smooth-transition($properties: all)**
Unified 0.3s ease transition for consistency
```scss
.button { @include smooth-transition; }
.popup { @include smooth-transition(opacity); }
```

### 3. **transform-lift**
Combined elevation + shadow increase for depth
```scss
.card { @include transform-lift; }  // transform + shadow both change
```

### 4. **glow-shadow($color, $intensity: 0.5)**
Material Design-style glow effect
```scss
.btn--primary { @include glow-shadow($color-primary, 0.7); }
```

### 5. **scale-hover($scale: 1.05)**
Zoom on hover for interactive feedback
```scss
.icon { @include scale-hover(1.1); }  // Zoom 10%
```

### 6. **underline-animation($color, $height: 2px)**
Animated underline appears on hover
```scss
.header__link { @include underline-animation($color-primary); }
```

### 7. **ripple-effect**
Material Design ripple on click (requires ::before pseudo)
```scss
.btn { @include ripple-effect; }  // ::before pseudo-element animated
```

### 8. **border-animation**
Border appears with scaleX from 0 to 1
```scss
.card::before { @include border-animation; }
```

### 9. **slide-in($direction: left, $distance: 20px, $duration: 0.5s)**
Slide animation from specified direction
```scss
.popup { @include slide-in(bottom, 30px, 0.6s); }
```

### 10. **fade-scale($initialScale: 0.8)**
Fade in + scale up simultaneously
```scss
.modal { @include fade-scale(0.9); }
```

### 11. **pulse-animation($duration: 1.5s)**
Infinite pulse (breathing effect)
```scss
.notification { @include pulse-animation; }
```

### 12. **shake-animation**
Temblor/vibration for error states
```scss
.form__input--error { @include shake-animation; }
```

---

## 📄 HTML STRUCTURE

### Document Outline
```
<html>
├── <head>
│   ├── Meta tags (viewport, charset, description)
│   ├── Preload: Fonts (Inter, Space Grotesk, IBM Plex Mono)
│   ├── DNS-prefetch: fonts.gstatic.com
│   ├── Bootstrap CSS (CDN)
│   └── Compiled main.css (44KB)
│
└── <body>
    ├── Navigation Header (fixed, z-index: 300)
    │   ├── Logo
    │   ├── Nav links (7): Concepto, Programa, Cronograma, Artistas, Ubicación, Galería, Contacto
    │   ├── CTA button (Registrarse)
    │   └── Mobile burger menu (hidden on desktop)
    │
    ├── Hero Section
    │   ├── Background image (width/height fixed to prevent CLS)
    │   ├── Title
    │   ├── Subtitle
    │   └── CTA buttons (2)
    │
    ├── Popup/Modal (Registration form, z-index: 600)
    │   ├── Backdrop (z-index: 400)
    │   ├── Form fields (name, email, message)
    │   └── Submit button + close button
    │
    ├── Concepto/Concept Section
    │   └── 3 Feature cards with icons
    │
    ├── Programa/Program Section
    │   └── 5 Work cards with images + descriptions
    │
    ├── Cronograma/Timeline Section
    │   └── 6 Accordion items with timeline events
    │
    ├── Artistas/Speakers Section (NEW)
    │   └── Speaker cards grid (3-4 cols responsive)
    │
    ├── Ubicación/Location Section (NEW)
    │   ├── Location info + address
    │   └── Embedded map placeholder
    │
    ├── FAQ Section (NEW)
    │   └── 5-6 Accordion items with Q&A
    │
    ├── Galería/Gallery Section
    │   ├── Image grid (lightbox enabled)
    │   └── Lightbox overlay (z-index: 700)
    │
    ├── Contacto/Contact Section
    │   └── Contact form (email, message)
    │
    └── Footer
        ├── Links (privacy, terms)
        ├── Social media links
        └── Copyright
```

### BEM Naming Convention
```scss
// Block
.button { }

// Block__Element
.button__text { }
.button__icon { }

// Block--Modifier
.button--primary { }
.button--large { }
.button--disabled { }

// Block__Element--Modifier
.button__icon--hover { }
```
**Applied To**: All 9 components (buttons, cards, popup, accordion, gallery, forms, speakers, location, faq)

---

## 🔧 COMPILATION & BUILD

### Tool: compile_sass.py
```python
# Compile SCSS → CSS using Dart Sass
# Input: /scss/main.scss
# Output: /css/main.css
# Status: ✅ "CSS compilado exitosamente"
```

### Command
```bash
python3 compile_sass.py
```

### Result
- ✅ 0 errors
- ✅ All @use/@forward resolved
- ✅ All variables/mixins compiled
- ✅ Output: /css/main.css (44KB)

---

## ⚡ PERFORMANCE OPTIMIZATIONS (McMaster-Carr Style)

### Already Implemented ✅
| **Optimization** | **What** | **Where** | **Impact** |
|---------------|---------|---------|----------|
| Font Preload | `<link rel="preload" as="font">` | HTML head | Prevent font waterfall |
| DNS Prefetch | `<link rel="dns-prefetch" href="//fonts.gstatic.com">` | HTML head | Parallel DNS resolution |
| Image Dimensions | `width="1920" height="1080"` | Hero `<img>` | Zero CLS (Cumulative Layout Shift) |
| will-change | `will-change: transform;` | Cards, buttons | Browser GPU optimization |
| Transition Uniforms | 0.3s ease across all | SCSS | Consistent, fast animations |

### To Implement (Phase 2) 📋
| **Optimization** | **What** | **Impact** | **Complexity** |
|---------------|---------|----------|---|
| Critical CSS | Inline 2-5KB in `<style>` tag | LCP -500ms | Medium |
| Image Audit | Add width/height to ALL images | 0 CLS | Easy |
| JS Optimization | Throttle scroll, defer non-critical | TTI -200ms | Medium |
| Service Worker | Cache HTML shell + assets | Repeat visit: 7ms | Hard |
| Lazy Loading | `loading="lazy"` on below-fold images | LCP -300ms | Easy |

---

## 📊 RUBRIC COMPLIANCE

### Current Score: 93/100 (30 points improvement from 63%)

| **Category** | **Requirement** | **Status** | **Evidence** |
|-----------|---|--------|----------|
| **HTML** | Valid semantic structure | ✅ | 8 sections, proper heading hierarchy |
| **CSS** | SASS with 7-1 pattern | ✅ | 9 modules + abstracts + utilities |
| **CSS** | BEM naming convention | ✅ | Consistent __ and -- across all components |
| **CSS** | Z-index management | ✅ | 9 variables, no conflicts |
| **Styling** | Responsive design | ✅ | Mobile-first, Bootstrap grid, media queries |
| **UX** | Microinteractions | ✅ | 12 mixins applied to hover/transitions |
| **Content** | 8 sections minimum | ✅ | Concepto, Programa, Cronograma, Artistas, Ubicación, FAQ, Galería, Contacto |
| **Performance** | Load time optimization | 🔄 | Font preload, DNS prefetch, image dims (Phase 2: Critical CSS, Service Worker) |
| **Accessibility** | WCAG basics | ✅ | Color contrast, heading hierarchy, link focus states |
| **Documentation** | README + inline comments | ✅ | 500+ line SCSS README, code comments |

---

## 🔄 WORKFLOW

### How to Add a New Component

1. **Create SCSS file** in `/scss/components/_newname.scss`
   ```scss
   @use '../abstracts/' as *;
   
   .new-component {
     // BEM structure with block__element--modifier
     @include smooth-transition;
     
     &:hover {
       @include hover-effect(-4px);
     }
   }
   ```

2. **Update** `/scss/components/_index.scss`
   ```scss
   @forward 'newname';  // Add this line
   ```

3. **Use in HTML**
   ```html
   <div class="new-component">
     <div class="new-component__header">Title</div>
     <div class="new-component__body">Content</div>
   </div>
   ```

4. **Compile**
   ```bash
   python3 compile_sass.py
   ```

### How to Use a Mixin

```scss
// Access any mixin in /scss/abstracts/_mixins.scss
.my-button {
  @include hover-effect(-2px);          // Lift 2px on hover
  @include smooth-transition;            // 0.3s ease on all
  @include glow-shadow($color-primary);  // Add glow
}
```

### How to Add a New Variable

1. **Define** in `/scss/abstracts/_variables.scss`
   ```scss
   $my-color: #ff0000;
   $my-spacing: 24px;
   ```

2. **Use** anywhere (variables auto-exported via `@use '../abstracts/' as *`)
   ```scss
   .element {
     color: $my-color;
     padding: $my-spacing;
   }
   ```

---

## 📁 KEY FILES

| **File** | **Purpose** | **Lines** | **Status** |
|---------|-----------|--------|---------|
| `/scss/main.scss` | Master compilation orchestrator | ~100 | ✅ @use pattern |
| `/scss/abstracts/_variables.scss` | Z-index, colors, spacing, typography | ~150 | ✅ Complete |
| `/scss/abstracts/_mixins.scss` | 12 microinteraction mixins | ~200 | ✅ Tested |
| `/scss/base/_reset.scss` | CSS reset + box-sizing | ~30 | ✅ @use |
| `/scss/base/_typography.scss` | Font hierarchy | ~80 | ✅ @use |
| `/scss/base/_animations.scss` | Keyframe animations | ~100 | ✅ @use |
| `/scss/layout/_header.scss` | Fixed navigation | ~120 | ✅ Glassmorphic |
| `/scss/layout/_sections.scss` | Generic section styles | ~40 | ✅ @use |
| `/scss/components/_buttons.scss` | Button system | ~80 | ✅ Ripple effect |
| `/scss/components/_cards.scss` | Card component | ~100 | ✅ Border animation |
| `/scss/components/_popup.scss` | Modal overlay | ~60 | ✅ will-change |
| `/scss/components/_speakers.scss` | NEW - Speaker cards | ~45 | ✅ Grid layout |
| `/scss/components/_location.scss` | NEW - Location info | ~40 | ✅ Map container |
| `/scss/components/_faq.scss` | NEW - FAQ accordion | ~35 | ✅ Collapsible |
| `/index.html` | Main event website | ~1155 | ✅ 8 sections |
| `/css/main.css` | Compiled CSS (output) | ~44KB | ✅ No errors |
| `/js/main.js` | Vanilla JavaScript | ~150 | ✅ Burger, popup, accordion |
| `/PERFORMANCE_AUDIT.md` | Performance audit report | ~300 | 🔄 In progress |

---

## 🚨 KNOWN ISSUES & SOLUTIONS

| **Issue** | **Root Cause** | **Solution** | **Status** |
|---------|---|----------|--------|
| 44KB CSS file | No critical CSS extracted | Inline 2-5KB in `<style>` tag, defer rest | ⏳ Phase 2 |
| Images without dimensions | Missing width/height attributes | Add to ALL `<img>` tags and CSS `background-image` | ⏳ Phase 2 |
| JavaScript blocking render | `<script>` in `<head>` | Move to end of `<body>` or add `defer` | ⏳ Phase 2 |
| No repeat-visit caching | No service worker | Implement SW cache strategy | ⏳ Phase 2 |
| Render-blocking CSS | Bootstrap via CDN + main.css | Use link with media query for deferred loading | ⏳ Phase 2 |

---

## 💾 GIT HISTORY

```
Commit: 32f6615
Date: 2026-02-11
Message: MIERCOLES 11022026 MEJORAS CSS VELOCIDAD Y BUENAS PRÁCTICAS v1
Changes: 
  - @import → @use migration (all 25+ SCSS files)
  - Z-index scale centralized (9 variables)
  - 12 microinteraction mixins added
  - 3 event sections added (Artistas, Ubicación, FAQ)
  - Font preload + DNS prefetch added
  - Hero image dimensions fixed
  - Documentation created (500+ lines)
Status: ✅ Pushed to origin/cz
```

---

## 🎯 NEXT PRIORITIES (Phase 2)

1. **Critical CSS Extraction** → -500ms LCP
2. **Complete Image Audit** → Zero CLS
3. **JavaScript Optimization** → -200ms TTI
4. **Service Worker** → 7ms repeat visits
5. **Lighthouse Report** → Measure baseline

---

## 📝 NOTES FOR AI

- **BEM strictly**: Block__Element--Modifier pattern mandatory
- **@use always**: Never use @import, namespace with `as *`
- **Variables first**: All magic numbers go to _variables.scss
- **Mixins for patterns**: Hover, transitions, animations go in _mixins.scss
- **Z-index scale**: Use variables, never hardcode z-index values
- **Performance first**: Preload critical, defer non-critical
- **Compile always**: Run `python3 compile_sass.py` before committing
- **Git messages**: Descriptive, include what + why + metric

---

**Generated**: 2026-02-11 | **Version**: 1.0 | **Format**: Markdown + Structure for AI parsing
