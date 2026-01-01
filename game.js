const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const bestScoreEl = document.getElementById("best-score");
const overlay = document.getElementById("overlay");
const overlayTitle = document.getElementById("overlay-title");
const overlayText = document.getElementById("overlay-text");
const startButton = document.getElementById("start-button");

const state = {
  running: false,
  over: false,
  speed: 5,
  score: 0,
  best: 0,
  gravity: 0.6,
};

const ground = {
  y: canvas.height - 32,
  offset: 0,
};

const cat = {
  x: 120,
  y: ground.y - 38,
  width: 48,
  height: 38,
  velocityY: 0,
  jumpStrength: 12,
  onGround: true,
  legSwing: 0,
};

const obstacles = [];
let obstacleTimer = 0;

function resetGame() {
  state.running = true;
  state.over = false;
  state.speed = 5;
  state.score = 0;
  cat.y = ground.y - cat.height;
  cat.velocityY = 0;
  cat.onGround = true;
  obstacles.length = 0;
  obstacleTimer = 0;
  overlay.classList.add("hidden");
}

function endGame() {
  state.running = false;
  state.over = true;
  state.best = Math.max(state.best, Math.floor(state.score));
  bestScoreEl.textContent = state.best;
  overlayTitle.textContent = "Oho!";
  overlayText.textContent = "Kissa törmäsi esteeseen. Paina välilyöntiä tai Aloita.";
  overlay.classList.remove("hidden");
}

function jump() {
  if (!state.running) {
    resetGame();
  }
  if (cat.onGround) {
    cat.velocityY = -cat.jumpStrength;
    cat.onGround = false;
  }
}

function spawnObstacle() {
  const size = 24 + Math.random() * 16;
  obstacles.push({
    x: canvas.width + size,
    y: ground.y - size,
    width: size + 8,
    height: size,
  });
}

function update(delta) {
  if (!state.running) return;

  state.score += delta * 0.02;
  scoreEl.textContent = Math.floor(state.score);

  state.speed = 5 + state.score / 180;

  cat.velocityY += state.gravity;
  cat.y += cat.velocityY;
  if (cat.y >= ground.y - cat.height) {
    cat.y = ground.y - cat.height;
    cat.velocityY = 0;
    cat.onGround = true;
  }

  cat.legSwing += delta * 0.02;

  ground.offset -= state.speed;
  if (ground.offset < -40) {
    ground.offset = 0;
  }

  obstacleTimer -= delta;
  if (obstacleTimer <= 0) {
    spawnObstacle();
    obstacleTimer = 900 + Math.random() * 800 - state.score;
  }

  for (const obstacle of obstacles) {
    obstacle.x -= state.speed;
  }

  while (obstacles.length && obstacles[0].x + obstacles[0].width < 0) {
    obstacles.shift();
  }

  for (const obstacle of obstacles) {
    if (
      cat.x < obstacle.x + obstacle.width - 6 &&
      cat.x + cat.width - 6 > obstacle.x &&
      cat.y < obstacle.y + obstacle.height - 4 &&
      cat.y + cat.height - 4 > obstacle.y
    ) {
      endGame();
      return;
    }
  }
}

function drawSky() {
  ctx.fillStyle = "#e0f2fe";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fbbf24";
  ctx.beginPath();
  ctx.arc(760, 60, 26, 0, Math.PI * 2);
  ctx.fill();
}

function drawGround() {
  ctx.fillStyle = "#fef3c7";
  ctx.fillRect(0, ground.y, canvas.width, canvas.height - ground.y);

  ctx.strokeStyle = "#eab308";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, ground.y + 3);
  ctx.lineTo(canvas.width, ground.y + 3);
  ctx.stroke();

  ctx.strokeStyle = "#f59e0b";
  ctx.lineWidth = 2;
  for (let x = ground.offset; x < canvas.width; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, ground.y + 14);
    ctx.lineTo(x + 18, ground.y + 14);
    ctx.stroke();
  }
}

function drawCat() {
  const sway = Math.sin(cat.legSwing) * 2;
  const bodyY = cat.y + 6;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(cat.x + 6, bodyY, cat.width - 12, cat.height - 12);

  ctx.fillStyle = "#111827";
  ctx.beginPath();
  ctx.ellipse(cat.x + 18, bodyY + 8, 8, 6, 0, 0, Math.PI * 2);
  ctx.ellipse(cat.x + 30, bodyY + 18, 7, 6, 0, 0, Math.PI * 2);
  ctx.ellipse(cat.x + 34, bodyY + 4, 6, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(cat.x + 38, cat.y + 10, 10, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#111827";
  ctx.beginPath();
  ctx.arc(cat.x + 36, cat.y + 10, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(cat.x + 34, cat.y + 10, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#111827";
  ctx.beginPath();
  ctx.arc(cat.x + 37, cat.y + 8, 2, 0, Math.PI * 2);
  ctx.arc(cat.x + 32, cat.y + 8, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#111827";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cat.x + 34, cat.y + 12);
  ctx.lineTo(cat.x + 30, cat.y + 14);
  ctx.moveTo(cat.x + 36, cat.y + 12);
  ctx.lineTo(cat.x + 40, cat.y + 14);
  ctx.stroke();

  ctx.fillStyle = "#111827";
  ctx.beginPath();
  ctx.moveTo(cat.x + 30, cat.y + 2);
  ctx.lineTo(cat.x + 26, cat.y - 6);
  ctx.lineTo(cat.x + 34, cat.y + 0);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(cat.x + 42, cat.y + 2);
  ctx.lineTo(cat.x + 48, cat.y - 6);
  ctx.lineTo(cat.x + 38, cat.y + 0);
  ctx.fill();

  ctx.strokeStyle = "#111827";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(cat.x + 8, cat.y + 18);
  ctx.lineTo(cat.x - 6, cat.y + 8 + sway);
  ctx.stroke();

  ctx.strokeStyle = "#111827";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cat.x + 14, cat.y + cat.height - 2);
  ctx.lineTo(cat.x + 14, cat.y + cat.height + 6 - sway);
  ctx.moveTo(cat.x + 28, cat.y + cat.height - 2);
  ctx.lineTo(cat.x + 28, cat.y + cat.height + 6 + sway);
  ctx.stroke();
}

function drawObstacles() {
  ctx.fillStyle = "#22c55e";
  for (const obstacle of obstacles) {
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    ctx.fillStyle = "#15803d";
    ctx.fillRect(obstacle.x + obstacle.width * 0.3, obstacle.y - 10, 10, 10);
    ctx.fillRect(obstacle.x + obstacle.width * 0.6, obstacle.y - 16, 10, 16);
    ctx.fillStyle = "#22c55e";
  }
}

let lastTime = 0;
function loop(timestamp) {
  const delta = timestamp - lastTime;
  lastTime = timestamp;

  update(delta);
  drawSky();
  drawGround();
  drawObstacles();
  drawCat();

  requestAnimationFrame(loop);
}

startButton.addEventListener("click", resetGame);
window.addEventListener("keydown", (event) => {
  if (event.code === "Space" || event.code === "ArrowUp") {
    event.preventDefault();
    jump();
  }
});
canvas.addEventListener("pointerdown", jump);

bestScoreEl.textContent = state.best;
requestAnimationFrame(loop);
