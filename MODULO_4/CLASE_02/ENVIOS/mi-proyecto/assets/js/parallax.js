const SCROLL_STATES = [
  "hero--scroll-0",
  "hero--scroll-1",
  "hero--scroll-2",
  "hero--scroll-3",
];

let hasScrollListener = false;

function applyHeroScrollState(hero, scrollY) {
  let stage = 0;

  if (scrollY > 120) stage = 1;
  if (scrollY > 320) stage = 2;
  if (scrollY > 640) stage = 3;

  hero.classList.remove(...SCROLL_STATES);
  hero.classList.add(`hero--scroll-${stage}`);
}

function buildStars(starsEl) {
  starsEl.innerHTML = "";

  for (let i = 0; i < 40; i += 1) {
    const star = document.createElement("div");
    star.className = "star";
    starsEl.appendChild(star);
  }
}

function buildClouds(cloudsEl) {
  cloudsEl.innerHTML = "";

  for (let i = 1; i <= 5; i += 1) {
    const cloud = document.createElement("div");
    cloud.className = `cloud cloud--${i}`;
    cloudsEl.appendChild(cloud);
  }
}

function buildHills(hillsEl) {
  hillsEl.innerHTML = `
    <svg viewBox="0 0 1440 160" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <ellipse cx="200" cy="160" rx="260" ry="140" fill="#3AA800"/>
      <ellipse cx="200" cy="160" rx="230" ry="120" fill="#4CC000"/>
      <ellipse cx="600" cy="160" rx="310" ry="160" fill="#3AA800"/>
      <ellipse cx="600" cy="160" rx="280" ry="140" fill="#4CC000"/>
      <ellipse cx="1000" cy="160" rx="280" ry="150" fill="#3AA800"/>
      <ellipse cx="1000" cy="160" rx="250" ry="130" fill="#4CC000"/>
      <ellipse cx="1350" cy="160" rx="200" ry="120" fill="#3AA800"/>
      <circle cx="200" cy="80" r="8" fill="#fff" opacity=".3"/>
      <circle cx="600" cy="60" r="10" fill="#fff" opacity=".3"/>
    </svg>
  `;
}

function buildPipes(hero) {
  let pipesEl = hero.querySelector(".hero__pipes");

  if (!pipesEl) {
    pipesEl = document.createElement("div");
    pipesEl.className = "hero__pipes";
    hero.appendChild(pipesEl);
  }

  pipesEl.innerHTML = "";

  for (let i = 1; i <= 5; i += 1) {
    const pipe = document.createElement("div");
    pipe.className = `hero-pipe hero-pipe--${i}`;

    const cap = document.createElement("div");
    cap.className = "hero-pipe__top";

    pipe.appendChild(cap);
    pipesEl.appendChild(pipe);
  }
}

function buildCoins(coinsEl) {
  coinsEl.innerHTML = "";

  for (let i = 1; i <= 8; i += 1) {
    const coin = document.createElement("div");
    coin.className = `coin-float coin-float--${i}`;
    coinsEl.appendChild(coin);
  }
}

function buildQuestionBlocks(qContainer, onQuestionBlockHit) {
  qContainer.innerHTML = "";

  for (let i = 1; i <= 4; i += 1) {
    const block = document.createElement("div");
    block.className = `q-block q-block--${i}`;
    block.textContent = "?";

    block.addEventListener("click", () => {
      block.textContent = "★";
      block.classList.add("is-hit");

      if (typeof onQuestionBlockHit === "function") {
        onQuestionBlockHit(block);
      }

      setTimeout(() => {
        block.textContent = "?";
        block.classList.remove("is-hit");
      }, 1500);
    });

    qContainer.appendChild(block);
  }
}

export function buildHeroScene({ onQuestionBlockHit } = {}) {
  const hero = document.getElementById("hero");
  if (!hero) return;

  const starsEl = document.getElementById("heroStars");
  const cloudsEl = document.getElementById("heroClouds");
  const hillsEl = document.getElementById("heroHills");
  const coinsEl = document.getElementById("heroCoins");
  const qContainer = document.getElementById("qblocks");

  if (starsEl) buildStars(starsEl);
  if (cloudsEl) buildClouds(cloudsEl);
  if (hillsEl) buildHills(hillsEl);
  if (coinsEl) buildCoins(coinsEl);

  buildPipes(hero);

  if (qContainer) {
    qContainer.classList.add("hero__qblocks");
    buildQuestionBlocks(qContainer, onQuestionBlockHit);
  }

  applyHeroScrollState(hero, window.scrollY);
}

export function attachParallaxOnScroll() {
  if (hasScrollListener) return;

  const hero = document.getElementById("hero");
  if (!hero) return;

  let ticking = false;

  window.addEventListener("scroll", () => {
    if (ticking) return;

    requestAnimationFrame(() => {
      applyHeroScrollState(hero, window.scrollY);
      ticking = false;
    });

    ticking = true;
  });

  hasScrollListener = true;
}

export function buildDecoStars() {
  const el = document.getElementById("decoStars");
  if (!el) return;

  el.innerHTML = "";

  for (let i = 0; i < 80; i += 1) {
    const star = document.createElement("div");
    star.className = "deco-star";
    el.appendChild(star);
  }
}
