# 🍴 Tenedor Libre — Documentación del Proyecto

## Estructura SASS 7-1

```
tenedor-libre/
│
├── index.html                  ← Single Page App
│
├── sass/                       ← Fuente SASS (7 carpetas + main)
│   ├── abstracts/
│   │   ├── _variables.scss     ← Colores, tipografía, espaciado
│   │   ├── _functions.scss     ← rem(), shade(), tint()
│   │   └── _mixins.scss        ← respond-to, flex-center, card-base...
│   │
│   ├── vendors/
│   │   └── _vendors.scss       ← Librerías de terceros (placeholder)
│   │
│   ├── base/
│   │   ├── _reset.scss         ← Reset universal
│   │   ├── _typography.scss    ← h1-h6, párrafos, utilidades
│   │   └── _animations.scss    ← keyframes + clases utilitarias
│   │
│   ├── layout/
│   │   ├── _navbar.scss        ← Barra de navegación fija
│   │   ├── _grid.scss          ← Container, grid, section, section-header
│   │   └── _footer.scss        ← Pie de página
│   │
│   ├── components/
│   │   ├── _buttons.scss       ← .btn--primary/secondary/accent/outline
│   │   ├── _cards.scss         ← menu-card, price-card, testimonial-card
│   │   └── _modal.scss         ← modal-overlay, modal, form-group, calc-result
│   │
│   ├── pages/
│   │   └── _home.scss          ← hero, how-section, menu-section, pricing,
│   │                              calculator-section, testimonials, cta-section
│   │
│   ├── themes/
│   │   └── _default.scss       ← CSS custom properties (:root)
│   │
│   └── main.scss               ← Punto de entrada que importa todo
│
├── css/
│   └── main.css                ← CSS compilado desde SASS 7-1
│
└── js/
    └── main.js                 ← JavaScript con todos los módulos
```

## Cómo compilar el SASS

```bash
# Instalar sass globalmente
npm install -g sass

# Compilar una vez
sass sass/main.scss css/main.css

# Compilar con watch (desarrollo)
sass --watch sass/main.scss:css/main.css --style=compressed
```

---

## Módulos JavaScript

### 1. `Navbar`
- Detecta scroll para agregar clase `.scrolled`
- Menú hamburguesa responsive para mobile

### 2. `ScrollReveal`
- `IntersectionObserver` para animar elementos `.reveal` al hacer scroll

### 3. `MenuFilter`
- Filtro de tarjetas por categoría (todos, entrada, principal, pasta, postre)

### 4. `AuthModal` — **Desafío Principal: if-else**

Sistema completo de Login + Registro usando `if-else`:

```js
// Login: if-else para validar credenciales
if (user) {
  if (user.password === password) {
    // ✅ Acceso permitido
  } else {
    // ❌ Contraseña incorrecta
  }
} else {
  // ❌ Usuario no encontrado
}

// Registro: if-else para validar datos
if (!nombre || !correo || !password || !confirm) {
  // ⚠️ Campos incompletos
} else if (!correo.includes('@')) {
  // ❌ Correo inválido
} else if (password !== confirm) {
  // ❌ Contraseñas no coinciden
} else if (yaExiste) {
  // 🔁 Cuenta ya existe
} else {
  // ✅ Registro exitoso
}
```

**Cuenta de prueba:** `admin@tenedorlibre.com` / `1234`

### 5. `PriceCalculator` — **Desafío Extra: Comida Gratis**

Usa `Number()` + `if-else` para determinar el precio:

```js
const edad  = Number(inputEdad.value);   // ← conversión con Number()
const precio = Number(inputPrecio.value);

if (edad < 5) {
  // 🎊 ¡Come gratis! → $0
} else if (edad >= 5 && edad <= 12) {
  // 🎈 50% descuento → precio * 0.5
} else {
  // 🍽️ Precio completo
}
```

---

## Paleta de colores

| Variable SASS    | HEX       | Uso                    |
|-----------------|-----------|------------------------|
| `$color-rosa`   | `#D63A6A` | Color primario, CTAs   |
| `$color-teal`   | `#2DA58E` | Color secundario       |
| `$color-amarillo`| `#F5B942`| Acentos, badges        |
| `$color-menta`  | `#7DDFC3` | Fondos suaves          |
| `$color-dark`   | `#1A1A2E` | Textos principales     |

Inspirada en la paleta de la imagen del donut 🍩

---

## Tecnologías
- **HTML5** semántico + ARIA accesible
- **SASS 7-1** (Arquitectura modular)
- **JavaScript ES6+** (Módulos IIFE, arrow functions, template literals)
- **Google Fonts:** Fredoka One + DM Sans
- **Sin dependencias externas** (Vanilla JS puro)
