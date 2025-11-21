# 2D Car Dodging Game

## Project Description
This is a 2D car dodging game where players control a car driving down a multi-lane road, avoiding enemy cars, collecting coins, and managing speed to avoid fines. The game features a shop where players can unlock and select different cars with unique stats. Gameplay occurs in a canvas with smooth animations, and the UI provides score, coins, fines notifications, and a speedometer.

## Features
- Responsive canvas game rendering for desktop and mobile
- Player car with acceleration, braking, and smooth lane switching
- Enemy cars spawning and accelerating over time
- Collectible rotating coins
- Dynamic speed zones with fines for speeding
- Shop interface to buy and select cars using collected coins
- Persistent player data (coins, unlocked cars, high scores) via localStorage
- Animated fines notifications and speedometer UI
- Keyboard and touch controls with intuitive input handling
- Accessibility support with ARIA labels and keyboard navigation

## Prerequisites
- Modern web browser with ES6 module support (Chrome, Firefox, Edge, Safari)
- No server required; runs fully locally

## Installation and Setup
1. Clone or download the project folder.
2. No build or package installation required.
3. Open the project folder in your file explorer.

## Configuration
- No API keys or external configuration needed.
- Sensitive data is not required.
- LocalStorage is used for saving player data.

## Running the Application
Open `index.html` in your preferred modern web browser by:
- Double-clicking the file, or
- Dragging and dropping into a browser window, or
- Serving via a local HTTP server (recommended for best performance), e.g.:
    - Using Python 3:  
        `python -m http.server 8000`  
        Then open `http://localhost:8000` in your browser.

## Usage Examples
- Use arrow keys or WASD to control the player car:
    - Left/Right: Switch lanes
    - Up: Accelerate
    - Down: Brake
- On mobile, use swipe gestures:
    - Swipe left/right to change lanes
    - Swipe up to accelerate
    - Swipe down to brake
- Avoid enemy cars and collect coins to increase your score and coin balance.
- Speed limits vary by road zones; avoid speeding to prevent coin fines.
- Press `Escape` to open the shop during gameplay.
- In the shop, buy new cars with coins and select your preferred car.
- Press `Enter` on the start screen to begin playing.

## Troubleshooting
- If the game does not load:
    - Make sure you are using a modern browser that supports ES6 modules.
    - If loading from the local file system, some browsers block module scripts; run a local server instead.
- Coins or progress not saving:
    - Ensure your browser allows localStorage.
    - Clear browser cache or site data if data is corrupted.
- Controls not responding:
    - Click on the game window to ensure it has focus.
    - On mobile, try a different browser if touch input is unresponsive.

## Project Structure
- `index.html`: Main HTML layout with canvas and UI elements.
- `styles.css`: Stylesheet for game canvas, HUD, shop, and UI components.
- `constants.js`: Central game configuration and constants.
- `storage.js`: localStorage utility functions for persistent data.
- `physics.js`: Pure physics functions for movement, collisions, and fines.
- `player.js`: Player car class handling input, movement, and rendering.
- `enemy.js`: Enemy car class and spawn manager.
- `coin.js`: Coin class and spawn manager.
- `ui.js`: UI update functions and shop interface handlers.
- `shop.js`: Shop logic for buying and selecting cars.
- `game.js`: Main game controller with game loop and input handling.

Enjoy dodging the traffic and collecting those coins!
