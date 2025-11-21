export const CONSTANTS = {
    CANVAS: {
        WIDTH: 480,
        HEIGHT: 720,
        ASPECT_RATIO: 2 / 3,
    },
    LANES: {
        COUNT: 3,
        // X positions for center of each lane on canvas
        POSITIONS: [120, 240, 360],
    },
    CAR: {
        WIDTH: 60,
        HEIGHT: 120,
        ACCELERATION_RATE: 0.0025, // px/ms^2
        DECELERATION_RATE: 0.0035, // px/ms^2
        MAX_SPEED: 0.5, // px/ms
        TURN_SMOOTHNESS: 0.15, // interpolation factor for horizontal movement
    },
    ENEMY: {
        SPAWN_INTERVAL_MIN: 1000, // ms
        SPAWN_INTERVAL_MAX: 1800, // ms
        BASE_SPEED: 0.2, // px/ms initial speed
        SPEED_INCREMENT: 0.00001, // speed increase per ms elapsed
        WIDTH: 60,
        HEIGHT: 120,
    },
    COIN: {
        SPAWN_INTERVAL: 1200, // ms
        WIDTH: 40,
        HEIGHT: 40,
        ROTATION_SPEED: 0.004, // radians/ms
    },
    FINES: {
        SPEED_LIMITS: [
            { zoneStartY: 0, zoneEndY: 240, limit: 0.35 },  // top zone
            { zoneStartY: 240, zoneEndY: 480, limit: 0.45 }, // mid zone
            { zoneStartY: 480, zoneEndY: 720, limit: 0.5 },  // bottom zone
        ],
        PENALTY_AMOUNT: 10, // coins deducted per fine
        NOTIFICATION_DURATION: 2000, // ms
    },
    SPEED_ZONES: [
        { yStart: 0, yEnd: 240, speedLimit: 0.35 },
        { yStart: 240, yEnd: 480, speedLimit: 0.45 },
        { yStart: 480, yEnd: 720, speedLimit: 0.5 },
    ],
    CAR_MODELS: [
        {
            id: 'basic',
            name: 'Basic Racer',
            acceleration: 0.0025,
            maxSpeed: 0.45,
            handling: 0.12,
            price: 0,
            sprite: 'https://i.ibb.co/3pZkN9p/car-basic.png',
        },
        {
            id: 'sport',
            name: 'Sportster',
            acceleration: 0.0032,
            maxSpeed: 0.52,
            handling: 0.18,
            price: 100,
            sprite: 'https://i.ibb.co/3YbFq6Z/car-sport.png',
        },
        {
            id: 'muscle',
            name: 'Muscle Car',
            acceleration: 0.0028,
            maxSpeed: 0.48,
            handling: 0.14,
            price: 150,
            sprite: 'https://i.ibb.co/x7FqS6G/car-muscle.png',
        },
        {
            id: 'luxury',
            name: 'Luxury Cruiser',
            acceleration: 0.0023,
            maxSpeed: 0.46,
            handling: 0.2,
            price: 200,
            sprite: 'https://i.ibb.co/BrpZ9t7/car-luxury.png',
        },
        {
            id: 'supercar',
            name: 'Super Car',
            acceleration: 0.0035,
            maxSpeed: 0.55,
            handling: 0.22,
            price: 300,
            sprite: 'https://i.ibb.co/7tFf7yB/car-supercar.png',
        },
    ],
    STORAGE_KEYS: {
        COINS: 'carDodger_coins',
        UNLOCKED_CARS: 'carDodger_unlockedCars',
        HIGH_SCORE: 'carDodger_highScore',
        SELECTED_CAR: 'carDodger_selectedCar',
    },
    UI: {
        REFRESH_INTERVAL: 100, // ms for HUD updates
    },
};
