import { initPixelCharacters } from "./pixel-art.js";
import { attachParallaxOnScroll, buildDecoStars, buildHeroScene } from "./parallax.js";
import { addToCart, changeQty, checkout, initCart, removeFromCart, toggleCart } from "./cart.js";

let selectedShipping = 3990;
let toastTimer;
const QUESTION_BLOCK_CYCLE = 7;
const ANCHOR_EXTRA_GAP = 0;
const BACK_TO_TOP_THRESHOLD = 0.8;
let questionBlockClickCycle = 0;

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2500);
}

function spawnCoinPop(target, text, variantClass) {
  if (!target) return;

  const pop = document.createElement("span");
  pop.className = `coin-pop ${variantClass}`;
  pop.textContent = text;

  target.appendChild(pop);
  setTimeout(() => pop.remove(), 900);
}

function showCoinPop(anchor) {
  spawnCoinPop(anchor, "+🪙 COIN!", "coin-pop--block");
}

function getQuestionBlockIndex(block) {
  if (!block) return 1;

  const blockClass = Array.from(block.classList).find((name) => name.startsWith("q-block--"));
  const index = Number(blockClass?.split("--")[1]);

  return Number.isInteger(index) && index >= 1 && index <= 4 ? index : 1;
}

function getMushroomDirection(block, hero) {
  if (!block || !hero) return "mushroom-runner--right";

  const heroRect = hero.getBoundingClientRect();
  const blockRect = block.getBoundingClientRect();
  const blockCenterX = blockRect.left + (blockRect.width / 2);
  const distanceToLeft = blockCenterX - heroRect.left;
  const distanceToRight = heroRect.right - blockCenterX;

  return distanceToLeft <= distanceToRight ? "mushroom-runner--left" : "mushroom-runner--right";
}

function spawnMushroom(block) {
  const hero = document.getElementById("hero");
  if (!hero) return;

  const blockIndex = getQuestionBlockIndex(block);
  const directionClass = getMushroomDirection(block, hero);

  const mushroom = document.createElement("span");
  mushroom.className = `mushroom-runner mushroom-runner--from-${blockIndex} ${directionClass}`;
  mushroom.textContent = "🍄";
  mushroom.setAttribute("aria-hidden", "true");

  hero.appendChild(mushroom);

  mushroom.addEventListener("animationend", () => mushroom.remove(), { once: true });
}

function handleQuestionBlockHit(block) {
  showCoinPop(block);

  questionBlockClickCycle = (questionBlockClickCycle + 1) % QUESTION_BLOCK_CYCLE;
  if (questionBlockClickCycle !== 0) return;

  spawnMushroom(block);
}

function showCoinPopByProduct(id) {
  const card = document.querySelector(`[data-id="${id}"]`);
  spawnCoinPop(card, "+1 🪙", "coin-pop--product");
}

function selectZone(el, price, name) {
  document.querySelectorAll(".shipping-zone").forEach((zone) => zone.classList.remove("selected"));
  el.classList.add("selected");

  selectedShipping = price;
  const label = price === 0 ? "GRATIS" : `$${price.toLocaleString("es-CL")}`;

  const shippingPrice = document.getElementById("shippingPrice");
  if (shippingPrice) shippingPrice.textContent = label;

  showToast(`📦 Zona \"${name}\" seleccionada`);
}

function updateShippingCalc() {
  const countrySelect = document.getElementById("countrySelect");
  if (!countrySelect) return;

  const prices = {
    CL: 3990,
    AR: 6990,
    MX: 6990,
    ES: 12990,
    US: 12990,
    OTHER: 12990,
  };

  selectedShipping = prices[countrySelect.value] ?? 12990;

  const shippingPrice = document.getElementById("shippingPrice");
  if (shippingPrice) {
    shippingPrice.textContent = `$${selectedShipping.toLocaleString("es-CL")}`;
  }
}

function syncAnchorOffset() {
  const header = document.querySelector(".header");
  const headerHeight = header?.offsetHeight ?? 0;
  const safeOffset = headerHeight + ANCHOR_EXTRA_GAP;

  document.documentElement.style.setProperty("--anchor-offset", `${safeOffset}px`);
}

function shouldShowBackToTop() {
  const totalScrollable = document.documentElement.scrollHeight - window.innerHeight;
  if (totalScrollable <= 0) return false;

  const progress = window.scrollY / totalScrollable;
  return progress >= BACK_TO_TOP_THRESHOLD;
}

function initBackToTop() {
  const button = document.getElementById("backToTop");
  if (!button) return;

  let ticking = false;

  const updateVisibility = () => {
    button.classList.toggle("is-visible", shouldShowBackToTop());
  };

  const onScroll = () => {
    if (ticking) return;

    requestAnimationFrame(() => {
      updateVisibility();
      ticking = false;
    });

    ticking = true;
  };

  button.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  updateVisibility();
}

Object.assign(window, {
  addToCart,
  removeFromCart,
  changeQty,
  toggleCart,
  checkout,
  selectZone,
  updateShippingCalc,
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  const drawer = document.getElementById("cartDrawer");
  if (drawer?.classList.contains("open")) {
    toggleCart(false);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  syncAnchorOffset();
  initBackToTop();

  window.addEventListener("resize", syncAnchorOffset);
  window.addEventListener("load", syncAnchorOffset, { once: true });

  buildDecoStars();
  initPixelCharacters();
  buildHeroScene({ onQuestionBlockHit: handleQuestionBlockHit });
  attachParallaxOnScroll();

  initCart({
    showToast,
    showCoinPopByProduct,
  });
});
