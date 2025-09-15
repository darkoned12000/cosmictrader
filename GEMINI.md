# Cosmic Trader - Project Overview

Cosmic Trader is a JavaScript-based web game that simulates space trading, exploration, and combat within a procedurally generated galaxy. Players navigate a starship, trade commodities, upgrade their vessel, interact with various factions, and engage in combat or other activities across a dynamic star map. The game features a retro-futuristic terminal aesthetic with monospace fonts and green-on-black color schemes.

## Key Features:

*   **Dynamic Galaxy Map:** Explore a vast galaxy with procedurally generated stars, planets, ports, spaceports, and hazards.
*   **Ship Management:** Upgrade ship components (hull, shields, fuel, cargo, weapons, scanner, warp drive), manage inventory, and monitor ship status.
*   **Economic Simulation:** Engage in trade with fluctuating commodity prices influenced by galactic economic events. Ports have varying supply/demand and security levels.
*   **Faction System:** Interact with three main factions (Duran Hegemony, Vinari Collective, Independent Traders Guild), each with unique lore, motivations, and relationships. NPCs from these factions roam the galaxy.
*   **Combat System:** Engage in turn-based combat with NPC ships and installations, utilizing various ship weapons and defenses.
*   **Planetary Interaction:** Scan, mine, claim, colonize, or invade planets.
*   **Audio System:** Background music themes and sound effects enhance the gameplay experience.
*   **Save/Load System:** Persistent game state using local storage.
*   **Login/Account System:** Basic player account management.

## Technologies Used:

*   **HTML5:** For structuring the game's user interface.
*   **CSS3:** For styling the game, creating its distinctive retro-terminal look.
*   **JavaScript (ES6+):** The core programming language for all game logic, UI interactions, and simulations.
*   **Chart.js:** Used for rendering charts (though not explicitly seen in the provided code snippets, `index.html` imports it).

## Project Structure:

The project is organized into several key directories:

*   `data/`: Contains static game data (ship definitions, lore, naming conventions, economic events).
*   `modules/`: Houses modular JavaScript files, each responsible for a specific game system (audio, combat, commerce, economy, factions, mechanics, planets, power-calculator, rankings, ui).
*   `Images/`: Stores various game assets, including ship sprites, planet images, hazard graphics, and UI elements.
*   `Music/`: Contains background music tracks.
*   `helpers/`: Utility JavaScript functions.
*   `script.js`: The main game loop and initialization logic, orchestrating interactions between modules.
*   `index.html`: The main entry point for the web application.
*   `style.css`: Global styles for the game.

## Building and Running:

This is a client-side web application. No special build steps are required beyond serving the static files.

1.  **Serve Files:** Use any local web server (e.g., Python's `http.server`, Node.js `serve`, or a simple browser extension) to serve the project directory.
2.  **Open `index.html`:** Navigate your web browser to the `index.html` file served by your local server.

Example using Python: (browse to the root game directory)
```bash
python -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

## Development Conventions:

*   **Modular JavaScript:** Game logic is separated into distinct modules for better organization and maintainability.
*   **Global `game` and `ui` Objects:** The entire game state is managed within a global `game` object, and UI DOM references are stored in a global `ui` object for easy access.
*   **Event Delegation:** Event listeners are primarily attached to the `document.body` to handle clicks on dynamically created buttons.
*   **Console Messaging:** A centralized `displayConsoleMessage` function is used for all in-game messages, with different types (`info`, `warning`, `error`, `success`, `economy`, `faction`) for visual distinction.
*   **CamelCase for JavaScript Variables/Functions:** Standard JavaScript naming conventions are followed.
*   **Constants for Game Data:** Many game parameters and data structures are defined as constants in `data/game-data.js`, `data/lore-data.js`, etc.
*   **Image Paths:** Image paths are relative to the project root, often starting with `Images/`.

## Key Game Mechanics:

*   **Movement:** Player moves one sector at a time, consuming fuel. Warp drive allows faster travel at higher fuel cost.
*   **Combat:** Turn-based, with player and NPC ships having hull, shields, fighters, and missiles.
*   **Economy:** Ports have dynamic prices and stock. NPCs also participate in economic cycles.
*   **Factions:** Factions have territories, fleets, and engage in actions like invasions or economic sabotage.
*   **Viruses:** Negative status effects that can be acquired and removed.
*   **Solar Array:** A deployable component to passively recharge fuel.

## TODOs / Future Enhancements (Inferred from code comments):

*   Full implementation of combat for NPCs (currently partially implemented).
*   More detailed scanner effects.
*   More complex planetary interactions (e.g., building on planets).
*   Sound effects are placeholders and need proper implementation.
*   Expansion of faction actions and interactions.
*   More robust error handling and user feedback in some areas.
