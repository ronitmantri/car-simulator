import { CONSTANTS } from './constants.js';
import * as Physics from './physics.js';

export class Coin {
    constructor() {
        this.width = CONSTANTS.COIN.WIDTH;
        this.height = CONSTANTS.COIN.HEIGHT;
        this.laneIndex = Math.floor(Math.random() * CONSTANTS.LANES.COUNT);
        this.x = CONSTANTS.LANES.POSITIONS[this.laneIndex] - this.width / 2;
        this.y = -this.height - Math.random() * 200; // spawn randomly above canvas
        this.rotation = 0; // radians
        this.rotationSpeed = CONSTANTS.COIN.ROTATION_SPEED;
        this.image = new Image();
        this.image.src = 'https://i.ibb.co/f9ySd3K/coin.png';
    }

    update(deltaTime) {
        this.y += 0.25 * deltaTime; // coins slowly scroll downward
        this.rotation += this.rotationSpeed * deltaTime;
        if (this.rotation >= 2 * Math.PI) this.rotation -= 2 * Math.PI;
    }

    offScreen() {
        return this.y > CONSTANTS.CANVAS.HEIGHT;
    }

    checkCollision(playerCar) {
        const coinRect = {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
        };
        const playerRect = {
            x: playerCar.x,
            y: playerCar.y,
            width: playerCar.width,
            height: playerCar.height,
        };
        return Physics.rectCollision(coinRect, playerRect);
    }

    render(ctx) {
        if (!this.image.complete) {
            this.image.onload = () => {
                this._drawRotated(ctx);
            };
        } else {
            this._drawRotated(ctx);
        }
    }

    _drawRotated(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.rotation);
        ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
    }
}

/**
 * Coin spawn manager class
 */
export class CoinManager {
    constructor() {
        this.coins = [];
        this.timeSinceLastSpawn = 0;
        this.spawnInterval = CONSTANTS.COIN.SPAWN_INTERVAL;
    }

    update(deltaTime) {
        this.timeSinceLastSpawn += deltaTime;

        if (this.timeSinceLastSpawn >= this.spawnInterval) {
            this._spawnCoin();
            this.timeSinceLastSpawn = 0;
        }

        for (const coin of this.coins) {
            coin.update(deltaTime);
        }

        this.coins = this.coins.filter((c) => !c.offScreen());
    }

    _spawnCoin() {
        const coin = new Coin();
        this.coins.push(coin);
    }
}
