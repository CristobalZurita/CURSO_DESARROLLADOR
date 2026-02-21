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

const CART_STORAGE_KEY = "marioshop-cart-v1";
const ORDER_SEQUENCE_KEY = "marioshop-order-seq-v1";
const LAST_ORDER_KEY = "marioshop-last-order-v1";
const MAX_QTY_PER_PRODUCT = 20;
const CHECKOUT_LABEL_DEFAULT = "▶ PROCEDER AL PAGO";
const CHECKOUT_LABEL_EMPTY = "AGREGA PRODUCTOS";

let cart = {};
let cartOpen = false;
let shippingContext = {
  price: 0,
  name: "Sin envío seleccionado",
};

const hooks = {
  showToast: () => {},
  showCoinPopByProduct: () => {},
};

function formatMoney(value) {
  return `$${value.toLocaleString("es-CL")}`;
}

function sanitizeQty(value) {
  const qty = Number(value);
  if (!Number.isFinite(qty)) return 0;
  return Math.min(MAX_QTY_PER_PRODUCT, Math.max(0, Math.floor(qty)));
}

function normalizeShipping(shipping = {}) {
  const price = Number(shipping.price);
  return {
    price: Number.isFinite(price) ? Math.max(0, Math.floor(price)) : 0,
    name: shipping.name?.trim() || "Sin envío seleccionado",
  };
}

function getProductById(id) {
  return products.find((item) => item.id === Number(id));
}

function getCartItems() {
  return Object.values(cart);
}

function calculateCartTotals(activeShipping = shippingContext) {
  const items = getCartItems();
  const productsSubtotal = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const itemsCount = items.reduce((sum, item) => sum + item.qty, 0);
  const safeShipping = normalizeShipping(activeShipping);

  return {
    itemsCount,
    productsSubtotal,
    shippingPrice: safeShipping.price,
    shippingName: safeShipping.name,
    grandTotal: productsSubtotal + safeShipping.price,
  };
}

function buildCartSnapshot() {
  return getCartItems().map((item) => ({
    id: item.id,
    qty: item.qty,
  }));
}

function restoreCartFromSnapshot(snapshot) {
  if (!Array.isArray(snapshot)) return;

  const nextCart = {};

  snapshot.forEach((entry) => {
    const product = getProductById(entry?.id);
    const qty = sanitizeQty(entry?.qty);

    if (!product || qty === 0) return;
    nextCart[product.id] = { ...product, qty };
  });

  cart = nextCart;
}

function persistCart() {
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(buildCartSnapshot()));
  } catch {
    // Ignore storage write errors on restricted browsers.
  }
}

function hydrateCart() {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return;

    const parsed = JSON.parse(raw);
    restoreCartFromSnapshot(parsed);
  } catch {
    cart = {};
  }
}

function persistOrder(order) {
  try {
    window.localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
  } catch {
    // Ignore storage write errors on restricted browsers.
  }
}

function nextOrderNumber() {
  const now = new Date();
  const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;

  let sequence = 1;

  try {
    const previous = Number(window.localStorage.getItem(ORDER_SEQUENCE_KEY) ?? "0");
    sequence = Number.isFinite(previous) ? previous + 1 : 1;
    window.localStorage.setItem(ORDER_SEQUENCE_KEY, String(sequence));
  } catch {
    sequence = Math.floor(Math.random() * 9000) + 1000;
  }

  return `MS-${datePart}-${String(sequence).padStart(4, "0")}`;
}

function updateCheckoutButton(itemsCount) {
  const checkoutButton = document.getElementById("cartCheckoutBtn");
  if (!checkoutButton) return;

  const isEmpty = itemsCount === 0;
  checkoutButton.disabled = isEmpty;
  checkoutButton.textContent = isEmpty ? CHECKOUT_LABEL_EMPTY : CHECKOUT_LABEL_DEFAULT;
}

function updateSummaryUI(totals) {
  const subtotalEl = document.getElementById("cartSubtotal");
  const shippingEl = document.getElementById("cartShipping");
  const shippingNameEl = document.getElementById("cartShippingName");
  const totalEl = document.getElementById("cartTotal");

  if (subtotalEl) subtotalEl.textContent = formatMoney(totals.productsSubtotal);
  if (shippingEl) shippingEl.textContent = totals.shippingPrice === 0 ? "GRATIS" : formatMoney(totals.shippingPrice);
  if (shippingNameEl) shippingNameEl.textContent = totals.shippingName;
  if (totalEl) totalEl.textContent = formatMoney(totals.grandTotal);
}

function getProductInsights(product) {
  const stock = ((product.id * 9) % 17) + 4;
  const iva = Math.floor(product.price * 0.19);
  const net = Math.max(product.price - iva, 0);
  const skuTag = product.tag.replace(/[^A-Za-z0-9]/g, "").slice(0, 3).toUpperCase() || "PRD";
  const sku = `MS-${String(product.id).padStart(3, "0")}-${skuTag}`;

  return {
    stock,
    iva,
    net,
    sku,
    dispatch: stock > 8 ? "24-48h" : "48-72h",
  };
}

function setProductCardExpanded(card, expanded) {
  if (!card) return;

  card.classList.toggle("is-expanded", expanded);

  const toggle = card.querySelector(".product-card__toggle");
  if (!toggle) return;

  toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
  toggle.textContent = expanded ? "- MENOS INFO" : "+ MAS INFO";
}

function toggleProductCard(card) {
  if (!card) return;

  const nextExpanded = !card.classList.contains("is-expanded");
  document.querySelectorAll(".product-card").forEach((item) => setProductCardExpanded(item, false));
  setProductCardExpanded(card, nextExpanded);
}

function attachProductCardInteractions() {
  const cards = document.querySelectorAll(".product-card");
  if (cards.length === 0) return;

  cards.forEach((card) => {
    const toggle = card.querySelector(".product-card__toggle");
    if (!toggle) return;

    toggle.addEventListener("click", () => toggleProductCard(card));
  });
}

export function renderProducts() {
  const grid = document.getElementById("productsGrid");
  if (!grid) return;

  grid.innerHTML = products
    .map((product) => {
      const info = getProductInsights(product);

      return `
        <article class="product-card" data-id="${product.id}">
          <div class="product-card__img">
            <span class="product-emoji">${product.emoji}</span>
            <div class="product-card__badge">${product.tag}</div>
          </div>
          <div class="product-card__body">
            <div class="product-card__tag">${product.tag}</div>
            <h3 class="product-card__name">${product.name}</h3>
            <p class="product-card__desc">${product.desc}</p>
            <button class="product-card__toggle" type="button" aria-expanded="false">+ MAS INFO</button>
            <div class="product-card__details">
              <div class="product-card__meta-row">
                <span>SKU</span>
                <strong>${info.sku}</strong>
              </div>
              <div class="product-card__meta-row">
                <span>Stock disponible</span>
                <strong>${info.stock} unidades</strong>
              </div>
              <div class="product-card__meta-row">
                <span>Precio neto</span>
                <strong>${formatMoney(info.net)}</strong>
              </div>
              <div class="product-card__meta-row">
                <span>IVA (19%)</span>
                <strong>${formatMoney(info.iva)}</strong>
              </div>
              <div class="product-card__meta-row">
                <span>Despacho estimado</span>
                <strong>${info.dispatch}</strong>
              </div>
            </div>
            <div class="product-card__footer">
              <div class="product-card__price">
                <span>${formatMoney(product.oldPrice)}</span>
                ${formatMoney(product.price)}
              </div>
              <button class="btn-add" onclick="addToCart(${product.id})">+ AÑADIR</button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  attachProductCardInteractions();
}

export function updateCartUI() {
  const totals = calculateCartTotals();

  const badge = document.getElementById("cartBadge");
  const body = document.getElementById("cartBody");
  const empty = document.getElementById("cartEmpty");

  if (!badge || !body || !empty) return;

  badge.textContent = String(totals.itemsCount);

  updateSummaryUI(totals);
  updateCheckoutButton(totals.itemsCount);

  const items = getCartItems();
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

  persistCart();
}

export function setShippingContext(nextShipping) {
  shippingContext = normalizeShipping(nextShipping);
  updateCartUI();
}

export function addToCart(id) {
  const product = getProductById(id);
  if (!product) return;

  const currentQty = cart[id]?.qty ?? 0;

  if (currentQty >= MAX_QTY_PER_PRODUCT) {
    hooks.showToast(`⚠️ Máximo ${MAX_QTY_PER_PRODUCT} unidades por producto.`);
    return;
  }

  if (cart[id]) {
    cart[id].qty = sanitizeQty(cart[id].qty + 1);
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
  if (!cart[id]) return;

  delete cart[id];
  updateCartUI();
}

export function changeQty(id, delta) {
  if (!cart[id]) return;

  const nextQty = sanitizeQty(cart[id].qty + delta);

  if (nextQty <= 0) {
    removeFromCart(id);
    return;
  }

  cart[id].qty = nextQty;
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

export function checkout(options = {}) {
  const effectiveShipping = options.shipping ? normalizeShipping(options.shipping) : shippingContext;
  const totals = calculateCartTotals(effectiveShipping);

  if (totals.productsSubtotal === 0) {
    hooks.showToast("⚠️ Tu carrito está vacío!");
    return;
  }

  const order = {
    orderId: nextOrderNumber(),
    createdAt: new Date().toISOString(),
    shipping: effectiveShipping,
    items: getCartItems().map((item) => ({
      id: item.id,
      name: item.name,
      qty: item.qty,
      unitPrice: item.price,
      lineTotal: item.qty * item.price,
    })),
    totals,
  };

  persistOrder(order);
  hooks.showToast(`✅ Orden ${order.orderId} creada por ${formatMoney(totals.grandTotal)}.`);

  cart = {};
  updateCartUI();
  toggleCart(false);
}

export function initCart({ showToast, showCoinPopByProduct, initialShipping } = {}) {
  hooks.showToast = showToast ?? hooks.showToast;
  hooks.showCoinPopByProduct = showCoinPopByProduct ?? hooks.showCoinPopByProduct;

  if (initialShipping) {
    shippingContext = normalizeShipping(initialShipping);
  }

  renderProducts();
  hydrateCart();
  updateCartUI();
}
