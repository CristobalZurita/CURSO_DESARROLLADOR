import { initPixelCharacters } from "./pixel-art.js";
import { attachParallaxOnScroll, buildDecoStars, buildHeroScene } from "./parallax.js";
import { addToCart, changeQty, checkout, initCart, removeFromCart, toggleCart } from "./cart.js";

let selectedShipping = 5490;
let selectedShippingName = "Envío Nacional";
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

function formatMoney(value) {
  if (value === 0) return "GRATIS";
  return `$${value.toLocaleString("es-CL")}`;
}

function readZoneData(el) {
  if (!el) return { price: 0, name: "Sin selección" };

  const price = Number(el.dataset.price ?? 0);
  const safePrice = Number.isFinite(price) ? price : 0;
  const name = el.dataset.name ?? "Sin selección";

  return { price: safePrice, name };
}

function setZoneExpanded(el, expanded) {
  if (!el) return;

  el.classList.toggle("is-expanded", expanded);

  const summaryButton = el.querySelector(".shipping-zone__summary");
  if (summaryButton) {
    summaryButton.setAttribute("aria-expanded", expanded ? "true" : "false");
  }
}

function expandZone(el) {
  const zones = document.querySelectorAll(".shipping-zone");
  zones.forEach((zone) => setZoneExpanded(zone, zone === el));
}

function toggleZoneDetails(el) {
  if (!el) return;

  const nextExpanded = !el.classList.contains("is-expanded");
  if (!nextExpanded) {
    setZoneExpanded(el, false);
    return;
  }

  expandZone(el);
}

function updateShippingPriceDisplay(price) {
  const shippingPrice = document.getElementById("shippingPrice");
  if (shippingPrice) shippingPrice.textContent = formatMoney(price);
}

function selectZone(el, options = {}) {
  const { notify = true } = options;
  if (!el) return;

  document.querySelectorAll(".shipping-zone").forEach((zone) => zone.classList.remove("selected"));
  el.classList.add("selected");
  expandZone(el);

  const { price, name } = readZoneData(el);
  selectedShipping = price;
  selectedShippingName = name;
  updateShippingPriceDisplay(price);

  if (notify) {
    showToast(`📦 Zona "${name}" seleccionada`);
  }
}

function selectZoneByKey(zoneKey, options = {}) {
  const zone = document.querySelector(`.shipping-zone[data-zone="${zoneKey}"]`);
  if (!zone) return;

  selectZone(zone, options);
}

function updateShippingCalc() {
  const countrySelect = document.getElementById("countrySelect");
  if (!countrySelect) return;

  const zoneByCountry = {
    CL: "nacional",
    AR: "latam",
    MX: "latam",
    ES: "internacional",
    US: "internacional",
    OTHER: "internacional",
  };

  const zoneKey = zoneByCountry[countrySelect.value] ?? "internacional";
  selectZoneByKey(zoneKey, { notify: false });
}

function initShippingZones() {
  const zones = document.querySelectorAll(".shipping-zone");
  if (zones.length === 0) return;

  zones.forEach((zone) => {
    const summaryButton = zone.querySelector(".shipping-zone__summary");
    const selectButton = zone.querySelector(".shipping-zone__select");

    if (summaryButton) {
      summaryButton.addEventListener("click", () => toggleZoneDetails(zone));
    }

    if (selectButton) {
      selectButton.addEventListener("click", () => selectZone(zone));
    }
  });

  const initiallySelected = document.querySelector(".shipping-zone.selected") ?? zones[0];
  selectZone(initiallySelected, { notify: false });
}

function handleCheckout() {
  checkout({
    shipping: {
      price: selectedShipping,
      name: selectedShippingName,
    },
  });
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
  checkout: handleCheckout,
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
  initShippingZones();

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
