import { CONSTANTS } from './constants.js';
import * as Storage from './storage.js';
import * as UI from './ui.js';
import { PlayerCar } from './player.js';
import { EnemyManager } from './enemy.js';
import { CoinManager } from './coin.js';
import { Shop } from './shop.js';

let canvas, ctx;
let player;
let enemyManager;
let coinManager;
let shop;

let lastTimestamp = 0;
let score = 0;
let gameState = 'start'; // 'start', 'playing', 'gameover'

let coins = 0;
let highScore = 0;

let inputState = {
    left: false,
    right: false,
    accelerate: false,
    brake: false,
};

function initCanvas() {
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');

    // Responsive canvas sizing
    function resizeCanvas() {
        const container = document.getElementById('game-container');
        if (!container) return;

        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        const aspectRatio = CONSTANTS.CANVAS.ASPECT_RATIO;

        let newWidth = containerWidth;
        let newHeight = containerWidth / aspectRatio;

        if (newHeight > containerHeight) {
            newHeight = containerHeight;
            newWidth = containerHeight * aspectRatio;
        }

        canvas.style.width = `${newWidth}px`;
        canvas.style.height = `${newHeight}px`;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
}

function initGameObjects() {
    const selectedCarId = Storage.getSelectedCar();
    const carModel = CONSTANTS.CAR_MODELS.find((c) => c.id === selectedCarId) || CONSTANTS.CAR_MODELS[0];
    player = new PlayerCar(carModel);

    enemyManager = new EnemyManager();
    coinManager = new CoinManager();

    coins = Storage.getCoins();
    highScore = Storage.getHighScore();

    shop = new Shop();
    shop.onShopClose = () => {
        UI.toggleShop(false);
        if (gameState === 'start') {
            startGame();
        }
    };
    shop.onCarSelected = (carId) => {
        const carModel = CONSTANTS.CAR_MODELS.find((c) => c.id === carId);
        if (carModel) {
            player.carModel = carModel;
        }
    };
}

function startGame() {
    score = 0;
    gameState = 'playing';
    lastTimestamp = performance.now();
    enemyManager.enemies.length = 0;
    coinManager.coins.length = 0;
    player.x = CONSTANTS.LANES.POSITIONS[1] - player.width / 2;
    player.y = CONSTANTS.CANVAS.HEIGHT - player.height - 20;
    player.velocity = 0;
    player.finesCooldown = 0;
    inputState = {
        left: false,
        right: false,
        accelerate: false,
        brake: false,
    };
    requestAnimationFrame(gameLoop);
}

/**
 * Handle game over state
 */
function gameOver() {
    gameState = 'gameover';
    if (score > highScore) {
        highScore = score;
        Storage.setHighScore(highScore);
    }
    UI.showFinesNotification(`Game Over! Final Score: ${score}`);
    setTimeout(() => {
        UI.toggleShop(true);
        shop.renderShop();
    }, 2000);
}

/**
 * Update all game entities and state per frame
 * @param {number} deltaTime ms
 */
function update(deltaTime) {
    if (gameState !== 'playing') return;

    player.handleInput(inputState);
    player.update(deltaTime);
    enemyManager.update(deltaTime);
    coinManager.update(deltaTime);

    // Check collisions
    const { collidedWithEnemy, collectedCoins } = player.checkCollision(enemyManager.enemies, coinManager.coins);

    if (collidedWithEnemy) {
        gameOver();
        return;
    }

    // Remove collected coins from coin manager and add to player coins
    if (collectedCoins.length > 0) {
        for (const coin of collectedCoins) {
            const index = coinManager.coins.indexOf(coin);
            if (index !== -1) coinManager.coins.splice(index, 1);
        }
        coins += collectedCoins.length;
        Storage.setCoins(coins);
    }

    // Apply fines if speeding
    player.applyFines((penalty) => {
        coins = Math.max(0, coins - penalty);
        Storage.setCoins(coins);
        UI.showFinesNotification(`Speeding Fine! -${penalty} Coins`);
    });

    // Increment score based on survival and passed enemies
    score += Math.floor(deltaTime * 0.1);

    // Update UI
    UI.updateHUD(score, coins);
    UI.updateSpeedometer(player.velocity, player.carModel.maxSpeed);
}

/**
 * Render all game entities and UI on canvas per frame
 */
function render() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw road lanes
    drawRoad();

    // Draw coins
    for (const coin of coinManager.coins) {
        coin.render(ctx);
    }

    // Draw enemies
    for (const enemy of enemyManager.enemies) {
        enemy.render(ctx);
    }

    // Draw player car on top
    player.render(ctx);
}

/**
 * Draw road lanes lines and background
 */
function drawRoad() {
    const laneX = CONSTANTS.LANES.POSITIONS;
    const laneCount = CONSTANTS.LANES.COUNT;
    const roadWidth = laneX[laneCount - 1] - laneX[0] + CONSTANTS.CAR.WIDTH;

    // Road background
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(laneX[0] - CONSTANTS.CAR.WIDTH / 2, 0, roadWidth, CONSTANTS.CANVAS.HEIGHT);

    // Lane divider lines
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.setLineDash([20, 20]);
    for (let i = 1; i < laneCount; i++) {
        const x = laneX[i] - CONSTANTS.CAR.WIDTH / 2;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, CONSTANTS.CANVAS.HEIGHT);
        ctx.stroke();
    }
    ctx.setLineDash([]);
}

/**
 * Main game loop using requestAnimationFrame
 * @param {DOMHighResTimeStamp} timestamp
 */
function gameLoop(timestamp) {
    if (!lastTimestamp) lastTimestamp = timestamp;
    const deltaTime = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    update(deltaTime);
    render();

    if (gameState === 'playing') {
        requestAnimationFrame(gameLoop);
    }
}

/**
 * Setup input handlers for keyboard and touch
 */
function setupInputHandlers() {
    window.addEventListener('keydown', (e) => {
        if (gameState !== 'playing' && e.key === 'Enter') {
            startGame();
            return;
        }
        switch (e.key) {
            case 'ArrowLeft':
            case 'a':
            case 'A':
                inputState.left = true;
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                inputState.right = true;
                break;
            case 'ArrowUp':
            case 'w':
            case 'W':
                inputState.accelerate = true;
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                inputState.brake = true;
                break;
            case 'Escape':
                if (gameState === 'playing') {
                    gameState = 'start';
                    UI.toggleShop(true);
                    shop.renderShop();
                }
                break;
        }
    });

    window.addEventListener('keyup', (e) => {
        switch (e.key) {
            case 'ArrowLeft':
            case 'a':
            case 'A':
                inputState.left = false;
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                inputState.right = false;
                break;
            case 'ArrowUp':
            case 'w':
            case 'W':
                inputState.accelerate = false;
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                inputState.brake = false;
                break;
        }
    });

    // Touch controls for mobile
    let touchStartX = null;
    let touchStartY = null;

    window.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }
    });

    window.addEventListener('touchmove', (e) => {
        if (e.touches.length !== 1 || touchStartX === null) return;

        const touchX = e.touches[0].clientX;
        const touchY = e.touches[0].clientY;
        const deltaX = touchX - touchStartX;
        const deltaY = touchY - touchStartY;

        // Simple swipe detection for left/right and up/down
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal swipe
            if (deltaX > 30) {
                inputState.left = false;
                inputState.right = true;
            } else if (deltaX < -30) {
                inputState.right = false;
                inputState.left = true;
            }
        } else {
            // Vertical swipe
            if (deltaY < -30) {
                inputState.accelerate = true;
                inputState.brake = false;
            } else if (deltaY > 30) {
                inputState.brake = true;
                inputState.accelerate = false;
            }
        }
    });

    window.addEventListener('touchend', () => {
        inputState.left = false;
        inputState.right = false;
        inputState.accelerate = false;
        inputState.brake = false;
        touchStartX = null;
        touchStartY = null;
    });
}

/**
 * Initialize and start the game after DOM loaded
 */
export function initGame() {
    initCanvas();
    initGameObjects();
    setupInputHandlers();
    UI.toggleShop(true);
    shop.renderShop();
}
