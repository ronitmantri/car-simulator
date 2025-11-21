import { CONSTANTS } from './constants.js';

/**
 * Calculate new velocity based on acceleration input
 * @param {number} currentVelocity px/ms
 * @param {boolean} accelerating
 * @param {number} deltaTime ms
 * @param {number} accelerationRate px/ms^2
 * @param {number} decelerationRate px/ms^2
 * @param {number} maxSpeed px/ms
 * @returns {number} newVelocity px/ms
 */
export function calculateVelocity(currentVelocity, accelerating, deltaTime, accelerationRate, decelerationRate, maxSpeed) {
    if (accelerating) {
        const newVel = currentVelocity + accelerationRate * deltaTime;
        return clampVelocity(newVel, 0, maxSpeed);
    } else {
        const newVel = currentVelocity - decelerationRate * deltaTime;
        return clampVelocity(newVel, 0, maxSpeed);
    }
}

/**
 * Clamp velocity value between min and max
 * @param {number} velocity 
 * @param {number} min 
 * @param {number} max 
 * @returns {number}
 */
export function clampVelocity(velocity, min, max) {
    if (velocity < min) return min;
    if (velocity > max) return max;
    return velocity;
}

/**
 * Smooth horizontal turning interpolation
 * @param {number} currentX current horizontal position
 * @param {number} targetX target horizontal position
 * @param {number} smoothFactor interpolation factor 0-1
 * @returns {number} new horizontal position
 */
export function smoothTurn(currentX, targetX, smoothFactor) {
    return currentX + (targetX - currentX) * smoothFactor;
}

/**
 * Check collision between two rectangles
 * @param {object} rectA { x, y, width, height }
 * @param {object} rectB { x, y, width, height }
 * @returns {boolean} true if colliding
 */
export function rectCollision(rectA, rectB) {
    return (
        rectA.x < rectB.x + rectB.width &&
        rectA.x + rectA.width > rectB.x &&
        rectA.y < rectB.y + rectB.height &&
        rectA.y + rectA.height > rectB.y
    );
}

/**
 * Detect current speed limit zone based on Y position
 * @param {number} yPos vertical position on canvas
 * @returns {number} speed limit px/ms
 */
export function detectSpeedLimit(yPos) {
    for (const zone of CONSTANTS.SPEED_ZONES) {
        if (yPos >= zone.yStart && yPos < zone.yEnd) {
            return zone.speedLimit;
        }
    }
    // Default fallback speed limit (max)
    return CONSTANTS.CAR.MAX_SPEED;
}

/**
 * Determine if player is speeding and should be fined
 * @param {number} playerSpeed px/ms
 * @param {number} playerY vertical position
 * @returns {boolean} true if fined
 */
export function checkSpeedingFine(playerSpeed, playerY) {
    const limit = detectSpeedLimit(playerY);
    return playerSpeed > limit;
}
