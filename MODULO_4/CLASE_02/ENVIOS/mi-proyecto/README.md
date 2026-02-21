# 🍄 MarioShop — Tienda Fan-Art Nintendo NES & SNES

> Tienda coleccionable temática de Mario Bros. Landing page interactiva con carrito de compras, escena parallax, personajes en CSS pixel-art y arquitectura SASS 7-1 profesional.

---

## 🎮 Demo & Preview

```
MARIOSHOP
├── Hero parallax con cielo, nubes, colinas, tuberías y personajes pixel-art
├── 10 productos escolares temáticos Mario
├── Carrito tipo sidebar drawer
├── Sección de envíos con calculadora
└── Footer full responsive
```

---

## 📁 Estructura del Proyecto (SASS 7-1)

```
mario-store/
│
├── index.html                    # Página principal (standalone)
├── setup.zsh                     # Script de configuración ZSH
├── package.json                  # npm scripts (sass, live-server)
├── README.md
├── .gitignore
│
├── assets/
│   ├── scss/
│   │   ├── main.scss             ← Entry point — importa todo
│   │   │
│   │   ├── abstracts/            [1/7] Solo variables, sin CSS output
│   │   │   ├── _variables.scss   → Design tokens: colores, tipografía, spacing
│   │   │   ├── _mixins.scss      → pixel-button(), parallax-layer(), flex-center()
│   │   │   └── _functions.scss   → px(), rem(), clamp-val()
│   │   │
│   │   ├── base/                 [2/7] Estilos globales
│   │   │   ├── _reset.scss       → Box-sizing, normalize mínimo
│   │   │   ├── _typography.scss  → Clases de texto pixel-font
│   │   │   └── _animations.scss  → Todos los @keyframes del sitio
│   │   │
│   │   ├── components/           [3/7] Componentes reutilizables
│   │   │   ├── _buttons.scss     → .btn, .btn-add, .btn-checkout, .cart-btn
│   │   │   ├── _cards.scss       → .product-card con shimmer top border
│   │   │   ├── _cart.scss        → .cart-drawer, .cart-item, .qty-btn
│   │   │   ├── _badge.scss       → .cart-badge con animación pulse
│   │   │   └── _toast.scss       → .toast notification
│   │   │
│   │   ├── layout/               [4/7] Estructura de página
│   │   │   ├── _header.scss      → Fixed header con logo + nav + cart btn
│   │   │   ├── _hero.scss        → Sistema de capas parallax (z-index layers)
│   │   │   ├── _grid.scss        → .section, .products-grid responsive
│   │   │   └── _footer.scss      → Footer 4 columnas responsive
│   │   │
│   │   ├── pages/                [5/7] Estilos específicos de sección
│   │   │   ├── _home.scss        → Sección de productos
│   │   │   └── _shipping.scss    → Zona de envíos + calculadora
│   │   │
│   │   ├── themes/               [6/7] Variantes de tema
│   │   │   ├── _nes.scss         → Tema NES (azul cielo clásico)
│   │   │   └── _snes.scss        → Tema SNES (azul profundo + gradientes)
│   │   │
│   │   └── vendors/              [7/7] Librerías externas
│   │       └── _normalize.scss   → Normalize CSS (o npm normalize.css)
│   │
│   ├── js/
│   │   ├── main.js               → Init + orchestración
│   │   ├── cart.js               → Estado del carrito (add/remove/update)
│   │   ├── pixel-art.js          → Engine CSS box-shadow sprites
│   │   └── parallax.js           → Scroll parallax por capas
│   │
│   └── img/
│       ├── sprites/              → CSS pixel art (sin imágenes externas)
│       ├── products/             → Fotos de productos (reemplaza emojis en prod)
│       └── bg/                   → Backgrounds opcionales
│
└── assets/
    └── css/
        └── main.css              → CSS compilado (output de SASS)
```

---

## 🚀 Instalación Rápida

### Opción 1 — Setup Script ZSH (recomendado)
```zsh
# Clona o descarga el proyecto, luego:
chmod +x setup.zsh
./setup.zsh mi-mario-store

cd mi-mario-store
npm install
npm run dev
```

### Opción 2 — One-liner ZSH
```zsh
mkdir -p mario-store/{assets/{scss/{abstracts,base,components,layout,pages,themes,vendors},js,img/{sprites,products,bg}},docs,public} && cd mario-store
```

### Opción 3 — Solo abrir index.html
El `index.html` es completamente standalone (CSS y JS inline). Ábrelo directamente en el navegador — sin dependencias.

---

## 🎨 Sistema de Diseño

### Paleta de colores (NES/SNES)
| Token | Valor | Uso |
|-------|-------|-----|
| `$color-red` | `#E52521` | Header, botones primarios |
| `$color-green` | `#00A000` | Botones add-to-cart, tuberías |
| `$color-yellow` | `#FFD700` | Textos destacados, coins |
| `$color-cyan` | `#00B4D8` | Info, labels secundarios |
| `$color-sky` | `#6898F8` | Background héroe |
| `$color-dark` | `#181830` | Background general |

### Tipografía
- **Display / Pixel:** `Press Start 2P` (Google Fonts) — todos los títulos, precios, labels
- **Body / UI:** `Nunito` (Google Fonts) — descripiones, formularios, cuerpo

### Sistema de Espaciado (8px grid)
```scss
$sp-xs: 4px    // medio pixel unit
$sp-sm: 8px    // 1 pixel unit  
$sp-md: 16px   // 2 pixel units
$sp-lg: 32px   // 4 pixel units
$sp-xl: 64px   // 8 pixel units
```

---

## 🏗️ Arquitectura Técnica

### Sistema Parallax por Z-Index
El hero utiliza 7 capas de profundidad posicionadas absolutamente:

```
z-index stack (de atrás hacia adelante):
  0 — Sky gradient
  1 — Stars (blink animation)
  2 — Clouds (drift animation, parallax on scroll)
  3 — Hills SVG (parallax on scroll)
  4 — Pipes
  5 — Ground (tile texture)
  6 — Characters (Mario run, Yoshi walk)
 10 — UI elements (title, CTA, question blocks)
```

### CSS Pixel Art (box-shadow engine)
Los personajes se generan con CSS puro usando `box-shadow` sobre un div de 1×1px:

```javascript
// Cada "pixel" = una entrada de box-shadow
// Xpx Ypx 0 0 color
// donde X = columna * pixelSize, Y = fila * pixelSize

function buildSprite(pixels, palette) {
  return pixels.flatMap((row, r) =>
    [...row].map((c, col) => 
      palette[c] ? `${col*P}px ${r*P}px 0 0 ${palette[c]}` : null
    ).filter(Boolean)
  ).join(',');
}
```

### Carrito (State Management)
```
cart = { [productId]: { ...product, qty: Number } }
```
- Estado en memoria (JavaScript vanilla)
- Renderizado reactivo en cada mutación
- Persistencia: agregar `localStorage` en `addToCart()` / `removeFromCart()`

---

## 💼 Modelo de Negocio

### Concepto
**MarioShop** opera como tienda fan-art de productos escolares y coleccionables temáticos Nintendo. El modelo replica el éxito de merchandise cultural (Funko, Casetify) aplicado al nicho gaming retro.

### Segmento de Clientes
- **Primario:** Niños 6-12 años (usuarios de útiles escolares)
- **Secundario:** Millennials 25-40 (nostalgia NES/SNES, coleccionistas)
- **Terciario:** Padres comprando regalos temáticos

### Propuesta de Valor
| Diferenciador | Descripción |
|---------------|-------------|
| 🎨 Diseño exclusivo | Pixel-art artesanal, no genérico |
| 🍄 Nicho definido | Solo NES + SNES Mario — no dispersión de marca |
| 📦 Productos útiles | Escolares funcionales + coleccionables |
| ⭐ Ediciones limitadas | Escasez controlada para urgencia de compra |

### Productos (10 SKUs iniciales)
| # | Producto | Precio CLP | Margen estimado |
|---|----------|-----------|----------------|
| 1 | Lápiz Mario (x6) | $3.990 | 65% |
| 2 | Cuaderno Yoshi A5 | $9.990 | 55% |
| 3 | Llavero Mario & Luigi | $4.990 | 70% |
| 4 | Gorro Super Mario World | $19.990 | 50% |
| 5 | Guantes Luigi | $12.990 | 55% |
| 6 | Mochila Super Mario | $34.990 | 45% |
| 7 | Set Borradores Mushroom | $2.990 | 75% |
| 8 | Regla Warp Pipe 30cm | $3.490 | 70% |
| 9 | Estuche Princess Peach | $11.990 | 55% |
| 10 | Pin Set (x10) | $7.990 | 65% |

### Canales de Venta
```
Digital:  Landing (este proyecto) → pasarela de pago (Webpay/Stripe)
Social:   Instagram + TikTok (pixel-art content)
Physical: Ferias escolares, tiendas de cómics, retro gaming shops
```

### Estructura de Costos
- Producción (impresión/bordado/manufactura): 35-55% del precio
- Plataforma e-commerce: 2-3% transacción
- Marketing digital: 10-15% del revenue
- Envío/logística: Variable según zona (cobrado al cliente)
- Margen neto objetivo: **30-40%**

### Zonas de Envío
| Zona | Tiempo | Costo |
|------|--------|-------|
| Chile (Nacional) | 3-5 días hábiles | $3.990 |
| Latinoamérica | 7-14 días hábiles | $6.990 |
| Internacional | 14-21 días hábiles | $12.990 |
| Retiro en tienda (Santiago) | Inmediato | Gratis |

---

## 🛠️ NPM Scripts

```bash
npm run sass:watch   # Compilar SCSS en tiempo real (desarrollo)
npm run sass:build   # Compilar SCSS minificado (producción)
npm run dev          # live-server en puerto 3000
npm run build        # Build completo
```

---

## 📐 Responsividad

| Dispositivo | Breakpoint | Columnas productos |
|-------------|-----------|-------------------|
| Mobile | < 480px | 1 columna |
| Tablet | 481–768px | 2 columnas |
| Laptop | 769–1024px | 2-3 columnas |
| Desktop | > 1024px | 4 columnas |

---

## 🔧 Extensibilidad — Cómo Replicar el Modelo

Este proyecto está diseñado como **template reutilizable**. Para adaptarlo a otra IP o tema:

1. **Variables:** Cambiar paleta en `_variables.scss`
2. **Productos:** Editar array `products[]` en `main.js`
3. **Personajes:** Reemplazar pixel arrays en `pixel-art.js`
4. **Tema:** Activar `.theme-snes` o crear nuevo en `themes/`
5. **Zonas envío:** Editar `shippingZones` en `cart.js`

---

## 📄 Legal

Este proyecto es **fan-art independiente** sin afiliación a Nintendo Co., Ltd.  
Super Mario™ es marca registrada de Nintendo. Uso educativo y de portafolio.

---

*🍄 Made with ❤️ and lots of coins — IT'S-A ME, MARIOSHOP!*
