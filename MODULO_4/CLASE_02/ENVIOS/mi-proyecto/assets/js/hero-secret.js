const HILL_POSITIONS = [14, 42, 69, 88];
const SECRET_APPEAR_MIN_MS = 7000;
const SECRET_APPEAR_MAX_MS = 9000;
const SECRET_VISIBLE_MS = 3600;
const HIGH_SCORE_STORAGE_KEY = "marioshop-pipe-runner-highscore-v1";

let secretTimerId = null;
let secretHideId = null;
let lastHillIndex = -1;
let keyHandlerBound = false;

const game = {
  isOpen: false,
  overlay: null,
  panel: null,
  closeButton: null,
  canvas: null,
  ctx: null,
  rafId: 0,
  lastTimestamp: 0,
  score: 0,
  highScore: 0,
  over: false,
  speed: 250,
  spawnIn: 1.2,
  groundHeight: 34,
  groundOffset: 0,
  player: {
    x: 68,
    y: 0,
    width: 26,
    height: 26,
    vy: 0,
    onGround: true,
  },
  obstacles: [],
};

function randomBetween(min, max) {
  return min + (Math.random() * (max - min));
}

function randomInt(min, max) {
  return Math.floor(randomBetween(min, max + 1));
}

function pickRandomHillPosition() {
  let index = randomInt(0, HILL_POSITIONS.length - 1);

  if (HILL_POSITIONS.length > 1) {
    while (index === lastHillIndex) {
      index = randomInt(0, HILL_POSITIONS.length - 1);
    }
  }

  lastHillIndex = index;
  return HILL_POSITIONS[index];
}

function clearSecretTimers() {
  if (secretTimerId) {
    clearTimeout(secretTimerId);
    secretTimerId = null;
  }

  if (secretHideId) {
    clearTimeout(secretHideId);
    secretHideId = null;
  }
}

function scheduleSecretAppearance(secretButton) {
  clearSecretTimers();
  if (!secretButton || game.isOpen) return;

  const delay = Math.max(
    0,
    randomInt(SECRET_APPEAR_MIN_MS, SECRET_APPEAR_MAX_MS) - SECRET_VISIBLE_MS,
  );
  secretTimerId = setTimeout(() => {
    const nextLeft = pickRandomHillPosition();
    secretButton.style.setProperty("--secret-left", `${nextLeft}%`);
    secretButton.classList.add("is-visible");

    secretHideId = setTimeout(() => {
      secretButton.classList.remove("is-visible");
      scheduleSecretAppearance(secretButton);
    }, SECRET_VISIBLE_MS);
  }, delay);
}

function loadHighScore() {
  try {
    const value = Number(window.localStorage.getItem(HIGH_SCORE_STORAGE_KEY) ?? "0");
    return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
  } catch {
    return 0;
  }
}

function saveHighScore(score) {
  try {
    window.localStorage.setItem(HIGH_SCORE_STORAGE_KEY, String(Math.max(0, Math.floor(score))));
  } catch {
    // Ignore storage write errors.
  }
}

function getGroundY() {
  if (!game.canvas) return 0;
  return game.canvas.height - game.groundHeight;
}

function startNewRun() {
  const groundY = getGroundY();
  game.player.y = groundY - game.player.height;
  game.player.vy = 0;
  game.player.onGround = true;
  game.obstacles = [];
  game.score = 0;
  game.over = false;
  game.speed = 250;
  game.spawnIn = randomBetween(0.8, 1.4);
  game.groundOffset = 0;
  game.lastTimestamp = 0;
}

function jump() {
  if (game.over) {
    startNewRun();
    return;
  }

  if (!game.player.onGround) return;

  game.player.vy = -620;
  game.player.onGround = false;
}

function spawnPipe() {
  if (!game.canvas) return;

  const height = randomBetween(38, 92);
  const width = randomBetween(26, 44);

  game.obstacles.push({
    x: game.canvas.width + 20,
    width,
    height,
  });
}

function rectsOverlap(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function updateGame(dt) {
  if (!game.canvas || game.over) return;

  const gravity = 1700;
  const groundY = getGroundY();

  game.speed = Math.min(430, game.speed + (dt * 5));
  game.score += dt * 65;
  game.groundOffset = (game.groundOffset + (game.speed * dt)) % 32;

  game.player.vy += gravity * dt;
  game.player.y += game.player.vy * dt;

  if (game.player.y >= groundY - game.player.height) {
    game.player.y = groundY - game.player.height;
    game.player.vy = 0;
    game.player.onGround = true;
  }

  game.spawnIn -= dt;
  if (game.spawnIn <= 0) {
    spawnPipe();
    game.spawnIn = randomBetween(0.85, 1.6);
  }

  game.obstacles.forEach((obstacle) => {
    obstacle.x -= game.speed * dt;
  });

  game.obstacles = game.obstacles.filter((obstacle) => obstacle.x + obstacle.width > -20);

  const playerHitbox = {
    x: game.player.x + 3,
    y: game.player.y + 2,
    width: game.player.width - 6,
    height: game.player.height - 4,
  };

  for (const obstacle of game.obstacles) {
    const obstacleHitbox = {
      x: obstacle.x,
      y: groundY - obstacle.height,
      width: obstacle.width,
      height: obstacle.height,
    };

    if (rectsOverlap(playerHitbox, obstacleHitbox)) {
      game.over = true;

      if (Math.floor(game.score) > game.highScore) {
        game.highScore = Math.floor(game.score);
        saveHighScore(game.highScore);
      }

      break;
    }
  }
}

function drawGround(ctx, width, groundY, groundHeight) {
  ctx.fillStyle = "#6fb1e9";
  ctx.fillRect(0, 0, width, groundY);

  ctx.fillStyle = "#48c000";
  ctx.fillRect(0, groundY - 8, width, 8);

  ctx.fillStyle = "#c87028";
  ctx.fillRect(0, groundY, width, groundHeight);

  ctx.fillStyle = "rgba(0, 0, 0, 0.18)";
  for (let x = -game.groundOffset; x < width + 32; x += 32) {
    ctx.fillRect(x, groundY, 16, groundHeight);
  }
}

function drawPlayer(ctx) {
  const p = game.player;

  ctx.fillStyle = "#f2d26f";
  ctx.fillRect(p.x + 2, p.y + 2, 20, 20);
  ctx.fillStyle = "#8a6a12";
  ctx.fillRect(p.x + 18, p.y + 8, 8, 8);
  ctx.fillStyle = "#2c2c2c";
  ctx.fillRect(p.x + 16, p.y + 7, 2, 2);
  ctx.fillStyle = "#e83d25";
  ctx.fillRect(p.x + 3, p.y, 18, 5);
  ctx.fillStyle = "#7d5a08";
  ctx.fillRect(p.x + 2, p.y + 20, 7, 6);
  ctx.fillRect(p.x + 15, p.y + 20, 7, 6);
}

function drawPipe(ctx, obstacle) {
  const groundY = getGroundY();
  const x = obstacle.x;
  const y = groundY - obstacle.height;
  const capHeight = 10;
  const capWidth = obstacle.width + 10;
  const capX = x - 5;

  ctx.fillStyle = "#007800";
  ctx.fillRect(x, y, obstacle.width, obstacle.height);
  ctx.fillStyle = "#00a020";
  ctx.fillRect(x + 3, y + 3, Math.max(obstacle.width - 6, 2), Math.max(obstacle.height - 6, 2));

  ctx.fillStyle = "#009010";
  ctx.fillRect(capX, y - capHeight, capWidth, capHeight);
  ctx.strokeStyle = "#004800";
  ctx.lineWidth = 3;
  ctx.strokeRect(capX + 1.5, y - capHeight + 1.5, capWidth - 3, capHeight - 3);
}

function drawHud(ctx, width) {
  const score = Math.floor(game.score);
  ctx.fillStyle = "#181830";
  ctx.font = "14px 'Press Start 2P', monospace";
  ctx.fillText(`SCORE ${score}`, 18, 24);
  ctx.fillText(`BEST ${game.highScore}`, width - 190, 24);
}

function drawGame() {
  if (!game.ctx || !game.canvas) return;

  const ctx = game.ctx;
  const width = game.canvas.width;
  const height = game.canvas.height;
  const groundY = getGroundY();

  ctx.clearRect(0, 0, width, height);

  drawGround(ctx, width, groundY, game.groundHeight);

  game.obstacles.forEach((obstacle) => {
    drawPipe(ctx, obstacle);
  });

  drawPlayer(ctx);
  drawHud(ctx, width);

  if (game.over) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#ffd700";
    ctx.font = "18px 'Press Start 2P', monospace";
    ctx.fillText("GAME OVER", width / 2 - 110, height / 2 - 8);
    ctx.font = "10px 'Press Start 2P', monospace";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("SPACE / CLICK PARA REINICIAR", width / 2 - 150, height / 2 + 20);
  }
}

function frame(timestamp) {
  if (!game.isOpen) return;

  if (game.lastTimestamp === 0) {
    game.lastTimestamp = timestamp;
  }

  const dt = Math.min(0.033, (timestamp - game.lastTimestamp) / 1000);
  game.lastTimestamp = timestamp;

  updateGame(dt);
  drawGame();

  game.rafId = window.requestAnimationFrame(frame);
}

function startLoop() {
  if (game.rafId) {
    window.cancelAnimationFrame(game.rafId);
  }

  game.rafId = window.requestAnimationFrame(frame);
}

function stopLoop() {
  if (!game.rafId) return;

  window.cancelAnimationFrame(game.rafId);
  game.rafId = 0;
}

function openGame(secretButton) {
  if (!game.overlay) return;

  game.isOpen = true;
  clearSecretTimers();
  secretButton?.classList.remove("is-visible");

  game.overlay.classList.add("is-open");
  game.overlay.setAttribute("aria-hidden", "false");

  startNewRun();
  startLoop();
}

function closeGame(secretButton) {
  if (!game.overlay) return;

  game.isOpen = false;
  game.overlay.classList.remove("is-open");
  game.overlay.setAttribute("aria-hidden", "true");
  stopLoop();

  if (secretButton) {
    scheduleSecretAppearance(secretButton);
  }
}

function handleKeydown(event, secretButton) {
  if (!game.isOpen) return;

  if (event.code === "Escape") {
    event.preventDefault();
    closeGame(secretButton);
    return;
  }

  if (event.code === "Space" || event.code === "ArrowUp" || event.code === "KeyW") {
    event.preventDefault();
    jump();
  }
}

export function initHeroSecret() {
  const secretButton = document.getElementById("heroSecret");
  const overlay = document.getElementById("pipeGame");
  const panel = overlay?.querySelector(".pipe-game__panel");
  const closeButton = document.getElementById("pipeGameClose");
  const canvas = document.getElementById("pipeGameCanvas");
  const ctx = canvas?.getContext("2d");

  if (!secretButton || !overlay || !closeButton || !canvas || !ctx || !panel) return;

  game.overlay = overlay;
  game.panel = panel;
  game.closeButton = closeButton;
  game.canvas = canvas;
  game.ctx = ctx;
  game.highScore = loadHighScore();

  secretButton.addEventListener("click", () => openGame(secretButton));
  closeButton.addEventListener("click", () => closeGame(secretButton));
  canvas.addEventListener("pointerdown", jump);

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      closeGame(secretButton);
    }
  });

  if (!keyHandlerBound) {
    document.addEventListener("keydown", (event) => handleKeydown(event, secretButton));
    keyHandlerBound = true;
  }

  scheduleSecretAppearance(secretButton);
}
