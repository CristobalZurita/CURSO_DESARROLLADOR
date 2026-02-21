const products = [
  {
    id: 1,
    name: "Lápiz Mario Bros NES",
    emoji: "✏️",
    price: 3990,
    oldPrice: 5990,
    tag: "ÚTILES",
    desc: "Set de 6 lápices con diseño pixel-art del clásico Mario Bros NES. Borrable y resistente.",
  },
  {
    id: 2,
    name: "Cuaderno Yoshi SNES",
    emoji: "📓",
    price: 9990,
    oldPrice: 13990,
    tag: "ÚTILES",
    desc: "Cuaderno A5 tapa dura con Yoshi en SNES pixel-art. 100 hojas cuadriculadas de alta calidad.",
  },
  {
    id: 3,
    name: "Llavero Mario & Luigi",
    emoji: "🗝️",
    price: 4990,
    oldPrice: 6990,
    tag: "ACCESORIOS",
    desc: "Llavero metálico con dúo Mario & Luigi en pixel art. Edición limitada coleccionable.",
  },
  {
    id: 4,
    name: "Gorro Super Mario World",
    emoji: "🎩",
    price: 19990,
    oldPrice: 25990,
    tag: "ROPA",
    desc: "Gorro bordado estilo SNES con Mario corriendo. Talla única, material premium.",
  },
  {
    id: 5,
    name: "Guantes Luigi NES",
    emoji: "🧤",
    price: 12990,
    oldPrice: 15990,
    tag: "ROPA",
    desc: "Guantes acolchados con diseño de Luigi. Perfectos para invierno y coleccionistas.",
  },
  {
    id: 6,
    name: "Mochila Super Mario",
    emoji: "🎒",
    price: 34990,
    oldPrice: 45990,
    tag: "MOCHILAS",
    desc: "Mochila escolar con diseño mundo 1-1. Compartimento para laptop, estampado de alta calidad.",
  },
  {
    id: 7,
    name: "Set Borradores Mushrooms",
    emoji: "🍄",
    price: 2990,
    oldPrice: 4990,
    tag: "ÚTILES",
    desc: "Set de 4 borradores con forma de hongos NES: rojo, verde, azul y amarillo.",
  },
  {
    id: 8,
    name: "Regla Warp Pipe",
    emoji: "📏",
    price: 3490,
    oldPrice: 5490,
    tag: "ÚTILES",
    desc: "Regla 30cm con diseño de Warp Pipe verde. Material rígido transparente con marcas pixel.",
  },
  {
    id: 9,
    name: "Estuche Princess Peach",
    emoji: "💼",
    price: 11990,
    oldPrice: 14990,
    tag: "ÚTILES",
    desc: "Estuche portalápices con diseño de Peach en SNES. Cierre dorado y compartimentos.",
  },
  {
    id: 10,
    name: "Pin Set Mario World (x10)",
    emoji: "📌",
    price: 7990,
    oldPrice: 10990,
    tag: "PINS",
    desc: "10 pins esmaltados con personajes SNES: Mario, Yoshi, Peach, Bowser, Toad y más.",
  },
  {
    id: 11,
    name: "Lampara Bloque ? LED",
    emoji: "💡",
    price: 18990,
    oldPrice: 23990,
    tag: "HOGAR",
    desc: "Lampara de escritorio inspirada en el bloque ? de Mario. Luz LED regulable y modo noche.",
  },
  {
    id: 12,
    name: "Taza Termica Super Star",
    emoji: "☕",
    price: 9990,
    oldPrice: 12990,
    tag: "HOGAR",
    desc: "Taza termica que revela una Super Star al agregar liquido caliente. Ideal para fans retro.",
  },
];

let cart = {};
let cartOpen = false;

const hooks = {
  showToast: () => {},
  showCoinPopByProduct: () => {},
};

function formatMoney(value) {
  return `$${value.toLocaleString("es-CL")}`;
}

export function renderProducts() {
  const grid = document.getElementById("productsGrid");
  if (!grid) return;

  grid.innerHTML = products
    .map(
      (product) => `
        <article class="product-card" data-id="${product.id}">
          <div class="product-card__img">
            <span class="product-emoji">${product.emoji}</span>
            <div class="product-card__badge">${product.tag}</div>
          </div>
          <div class="product-card__body">
            <div class="product-card__tag">${product.tag}</div>
            <h3 class="product-card__name">${product.name}</h3>
            <p class="product-card__desc">${product.desc}</p>
            <div class="product-card__footer">
              <div class="product-card__price">
                <span>${formatMoney(product.oldPrice)}</span>
                ${formatMoney(product.price)}
              </div>
              <button class="btn-add" onclick="addToCart(${product.id})">+ AÑADIR</button>
            </div>
          </div>
        </article>
      `,
    )
    .join("");
}

export function updateCartUI() {
  const total = Object.values(cart).reduce((sum, item) => sum + item.price * item.qty, 0);
  const count = Object.values(cart).reduce((sum, item) => sum + item.qty, 0);

  const badge = document.getElementById("cartBadge");
  const totalEl = document.getElementById("cartTotal");
  const body = document.getElementById("cartBody");
  const empty = document.getElementById("cartEmpty");

  if (!badge || !totalEl || !body || !empty) return;

  badge.textContent = String(count);
  totalEl.textContent = formatMoney(total);

  const items = Object.values(cart);
  body.querySelectorAll(".cart-item").forEach((el) => el.remove());

  empty.classList.toggle("is-hidden", items.length > 0);

  items.forEach((item) => {
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <div class="cart-item__icon">${item.emoji}</div>
      <div class="cart-item__info">
        <div class="cart-item__name">${item.name}</div>
        <div class="cart-item__price">${formatMoney(item.price * item.qty)}</div>
        <div class="cart-item__qty">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
        </div>
      </div>
      <button class="cart-item__remove" onclick="removeFromCart(${item.id})" title="Eliminar">✕</button>
    `;
    body.appendChild(row);
  });
}

export function addToCart(id) {
  const product = products.find((item) => item.id === id);
  if (!product) return;

  if (cart[id]) {
    cart[id].qty += 1;
  } else {
    cart[id] = { ...product, qty: 1 };
  }

  updateCartUI();
  hooks.showToast(`🍄 ${product.name} añadido!`);
  hooks.showCoinPopByProduct(id);

  document.querySelectorAll(`[data-id="${id}"] .btn-add`).forEach((button) => {
    button.textContent = "✓ AÑADIDO";
    button.classList.add("added");
    setTimeout(() => {
      button.textContent = "+ AÑADIR";
      button.classList.remove("added");
    }, 1200);
  });

  const badge = document.getElementById("cartBadge");
  if (badge) {
    badge.classList.remove("pulse");
    requestAnimationFrame(() => badge.classList.add("pulse"));
  }
}

export function removeFromCart(id) {
  delete cart[id];
  updateCartUI();
}

export function changeQty(id, delta) {
  if (!cart[id]) return;

  cart[id].qty += delta;
  if (cart[id].qty <= 0) {
    removeFromCart(id);
    return;
  }

  updateCartUI();
}

export function toggleCart(nextState) {
  cartOpen = typeof nextState === "boolean" ? nextState : !cartOpen;

  const drawer = document.getElementById("cartDrawer");
  const overlay = document.getElementById("cartOverlay");
  if (!drawer || !overlay) return;

  drawer.classList.toggle("open", cartOpen);
  overlay.classList.toggle("active", cartOpen);
  document.body.classList.toggle("body--cart-open", cartOpen);
}

export function checkout() {
  const total = Object.values(cart).reduce((sum, item) => sum + item.price * item.qty, 0);
  if (total === 0) {
    hooks.showToast("⚠️ Tu carrito está vacío!");
    return;
  }

  hooks.showToast(`✅ Pedido de ${formatMoney(total)} procesado! ¡Gracias!`);
  cart = {};
  updateCartUI();
  toggleCart(false);
}

export function initCart({ showToast, showCoinPopByProduct } = {}) {
  hooks.showToast = showToast ?? hooks.showToast;
  hooks.showCoinPopByProduct = showCoinPopByProduct ?? hooks.showCoinPopByProduct;

  renderProducts();
  updateCartUI();
}
