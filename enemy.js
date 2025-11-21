import { CONSTANTS } from './constants.js';

export class EnemyCar {
    /**
     * Creates an enemy car instance
     * @param {number} laneIndex lane index 0..2
     * @param {number} speed px/ms
     * @param {object} carModel car model stats
     */
    constructor(laneIndex, speed, carModel) {
        this.carModel = carModel;
        this.width = CONSTANTS.ENEMY.WIDTH;
        this.height = CONSTANTS.ENEMY.HEIGHT;
        this.laneIndex = laneIndex;
        this.x = CONSTANTS.LANES.POSITIONS[laneIndex] - this.width / 2;
        this.y = -this.height; // start above canvas
        this.speed = speed; // vertical speed px/ms
    }

    /**
     * Update position
     * @param {number} deltaTime ms
     */
    update(deltaTime) {
        this.y += this.speed * deltaTime;
    }

    /**
     * Check if enemy is off screen
     * @returns {boolean}
     */
    offScreen() {
        return this.y > CONSTANTS.CANVAS.HEIGHT;
    }

    /**
     * Render enemy car on canvas
     * @param {CanvasRenderingContext2D} ctx 
     */
    render(ctx) {
        const img = new Image();
        img.src = this.carModel.sprite;

        if (!img.complete) {
            img.onload = () => {
                ctx.drawImage(img, this.x, this.y, this.width, this.height);
            };
        } else {
            ctx.drawImage(img, this.x, this.y, this.width, this.height);
        }
    }
}

/**
 * Enemy spawn manager class
 */
export class EnemyManager {
    constructor() {
        this.enemies = [];
        this.timeSinceLastSpawn = 0;
        this.nextSpawnInterval = this._randomSpawnInterval();
        this.elapsedTime = 0;
    }

    _randomSpawnInterval() {
        return (
            Math.random() *
                (CONSTANTS.ENEMY.SPAWN_INTERVAL_MAX - CONSTANTS.ENEMY.SPAWN_INTERVAL_MIN) +
            CONSTANTS.ENEMY.SPAWN_INTERVAL_MIN
        );
    }

    /**
     * Update enemies and spawn new ones over time
     * @param {number} deltaTime ms
     */
    update(deltaTime) {
        this.elapsedTime += deltaTime;
        this.timeSinceLastSpawn += deltaTime;

        // Spawn new enemy if interval passed
        if (this.timeSinceLastSpawn >= this.nextSpawnInterval) {
            this._spawnEnemy();
            this.timeSinceLastSpawn = 0;
            this.nextSpawnInterval = this._randomSpawnInterval();
        }

        // Update all enemies
        for (const enemy of this.enemies) {
            enemy.update(deltaTime);
        }

        // Remove off-screen enemies
        this.enemies = this.enemies.filter((e) => !e.offScreen());
    }

    /**
     * Spawn an enemy in a random lane with speed scaling over time
     */
    _spawnEnemy() {
        const laneIndex = Math.floor(Math.random() * CONSTANTS.LANES.COUNT);

        // Pick a random enemy car model from CONSTANTS.CAR_MODELS except player's basic car
        const enemyCarModels = CONSTANTS.CAR_MODELS.slice(1); // exclude basic car to avoid confusion
        const carModel = enemyCarModels[Math.floor(Math.random() * enemyCarModels.length)];

        const speed = CONSTANTS.ENEMY.BASE_SPEED + this.elapsedTime * CONSTANTS.ENEMY.SPEED_INCREMENT;

        const enemy = new EnemyCar(laneIndex, speed, carModel);
        this.enemies.push(enemy);
    }
}
