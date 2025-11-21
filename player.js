import { CONSTANTS } from './constants.js';
import * as Physics from './physics.js';

export class PlayerCar {
    /**
     * Create a player car instance
     * @param {object} carModel Car model stats from constants
     */
    constructor(carModel) {
        this.carModel = carModel;
        this.width = CONSTANTS.CAR.WIDTH;
        this.height = CONSTANTS.CAR.HEIGHT;

        this.x = CONSTANTS.LANES.POSITIONS[1] - this.width / 2; // start center lane
        this.y = CONSTANTS.CANVAS.HEIGHT - this.height - 20;

        this.velocity = 0; // vertical speed px/ms
        this.horizontalTargetX = this.x;
        this.inputState = {
            left: false,
            right: false,
            accelerate: false,
            brake: false,
        };

        this.finesCooldown = 0; // ms cooldown timer for fines
    }

    /**
     * Update player state
     * @param {number} deltaTime ms since last update
     */
    update(deltaTime) {
        // Update velocity (acceleration/braking)
        const accelerating = this.inputState.accelerate;
        const decelerating = this.inputState.brake;

        if (accelerating) {
            this.velocity = Physics.calculateVelocity(
                this.velocity,
                true,
                deltaTime,
                this.carModel.acceleration,
                CONSTANTS.CAR.DECELERATION_RATE,
                this.carModel.maxSpeed
            );
        } else if (decelerating) {
            // Brake stronger than normal deceleration
            this.velocity = Math.max(0, this.velocity - CONSTANTS.CAR.DECELERATION_RATE * 2 * deltaTime);
        } else {
            this.velocity = Physics.calculateVelocity(
                this.velocity,
                false,
                deltaTime,
                this.carModel.acceleration,
                CONSTANTS.CAR.DECELERATION_RATE,
                this.carModel.maxSpeed
            );
        }

        // Horizontal movement: target lane position based on input
        if (this.inputState.left) {
            const currentLaneIndex = this._currentLaneIndex();
            if (currentLaneIndex > 0) {
                this.horizontalTargetX = CONSTANTS.LANES.POSITIONS[currentLaneIndex - 1] - this.width / 2;
            }
        } else if (this.inputState.right) {
            const currentLaneIndex = this._currentLaneIndex();
            if (currentLaneIndex < CONSTANTS.LANES.COUNT - 1) {
                this.horizontalTargetX = CONSTANTS.LANES.POSITIONS[currentLaneIndex + 1] - this.width / 2;
            }
        }

        // Smooth horizontal turn toward targetX
        this.x = Physics.smoothTurn(this.x, this.horizontalTargetX, this.carModel.handling);

        // Clamp horizontal position to canvas boundaries
        const minX = CONSTANTS.LANES.POSITIONS[0] - this.width / 2;
        const maxX = CONSTANTS.LANES.POSITIONS[CONSTANTS.LANES.COUNT - 1] - this.width / 2;
        if (this.x < minX) this.x = minX;
        if (this.x > maxX) this.x = maxX;

        // Update fines cooldown timer
        if (this.finesCooldown > 0) {
            this.finesCooldown -= deltaTime;
            if (this.finesCooldown < 0) this.finesCooldown = 0;
        }
    }

    /**
     * Determine current lane index based on horizontal position
     * @returns {number} lane index 0..(LANES.COUNT-1)
     */
    _currentLaneIndex() {
        let closestIndex = 0;
        let closestDist = Math.abs(this.x + this.width / 2 - CONSTANTS.LANES.POSITIONS[0]);
        for (let i = 1; i < CONSTANTS.LANES.COUNT; i++) {
            const dist = Math.abs(this.x + this.width / 2 - CONSTANTS.LANES.POSITIONS[i]);
            if (dist < closestDist) {
                closestDist = dist;
                closestIndex = i;
            }
        }
        return closestIndex;
    }

    /**
     * Handle input state update
     * @param {object} inputState keys: left, right, accelerate, brake (boolean)
     */
    handleInput(inputState) {
        this.inputState.left = !!inputState.left;
        this.inputState.right = !!inputState.right;
        this.inputState.accelerate = !!inputState.accelerate;
        this.inputState.brake = !!inputState.brake;
    }

    /**
     * Check collision with enemies and coins
     * @param {EnemyCar[]} enemyCars
     * @param {Coin[]} coins
     * @returns {object} { collidedWithEnemy: boolean, collectedCoins: Coin[] }
     */
    checkCollision(enemyCars, coins) {
        const playerRect = {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
        };

        let collidedWithEnemy = false;
        for (const enemy of enemyCars) {
            const enemyRect = {
                x: enemy.x,
                y: enemy.y,
                width: enemy.width,
                height: enemy.height,
            };
            if (Physics.rectCollision(playerRect, enemyRect)) {
                collidedWithEnemy = true;
                break;
            }
        }

        const collectedCoins = [];
        for (const coin of coins) {
            const coinRect = {
                x: coin.x,
                y: coin.y,
                width: coin.width,
                height: coin.height,
            };
            if (Physics.rectCollision(playerRect, coinRect)) {
                collectedCoins.push(coin);
            }
        }

        return { collidedWithEnemy, collectedCoins };
    }

    /**
     * Apply fines if speeding
     * @param {function} onFine callback when fined
     */
    applyFines(onFine) {
        if (this.finesCooldown > 0) return; // cooldown active, skip fine

        const isSpeeding = Physics.checkSpeedingFine(this.velocity, this.y);
        if (isSpeeding) {
            this.finesCooldown = CONSTANTS.FINES.NOTIFICATION_DURATION;
            onFine(CONSTANTS.FINES.PENALTY_AMOUNT);
        }
    }

    /**
     * Render player car on canvas
     * @param {CanvasRenderingContext2D} ctx 
     */
    render(ctx) {
        const img = new Image();
        img.src = this.carModel.sprite;

        // For performance, draw after image loads
        if (!img.complete) {
            img.onload = () => {
                ctx.drawImage(img, this.x, this.y, this.width, this.height);
            };
        } else {
            ctx.drawImage(img, this.x, this.y, this.width, this.height);
        }
    }
}
