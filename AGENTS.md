# Cosmic Trader - Agent Guidelines

## Game Description

**Cosmic Trader** is a web-based space trading and combat game inspired by classic BBS door games like Yankee Trader and TradeWars 2002. Players navigate a vast galaxy spanning 5,000 sectors (50x100 grid) which is expandable, engaging in commerce, combat, exploration, and faction politics.

### Core Gameplay Features:
- **Trading System**: Buy/sell commodities at ports, manage cargo capacity, and profit from market fluctuations
- **Combat Mechanics**: Engage in ship-to-ship battles using fighters, missiles, mines, and shields
- **Exploration**: Discover planets, scan sectors for hazards and opportunities, deploy solar arrays for energy
- **Faction Dynamics**: Navigate relationships with three major factions (Traders, Duran, Vinari) and their territories
- **NPC Interactions**: Encounter and battle AI-controlled ships with different archetypes, automated trading behaviors, equipment upgrades, fuel management, and faction-specific strategic decision-making
- **Economic Events**: Experience dynamic market changes through booms, busts, strikes, and shortages
- **Port Ownership**: Capture and manage ports for trading advantages and strategic positioning
- **Banking System**: Deposit/withdraw credits with 1.5% daily interest, PIN security, and persistent account storage
- **NPC Economy**: NPCs actively trade commodities and exotic resources, upgrade equipment, manage fuel, and accumulate wealth through automated decision-making

### Technical Architecture:
- Built with vanilla JavaScript using ES6 modules
- Real-time performance monitoring and optimization tools
- Modular architecture separating core logic, UI, data, and feature modules
- Modular architecture separating core logic, UI, data, and feature modules
- Local storage persistence for game saves and player accounts

## Build Commands
- **Serve development server**: `npm run serve` (Python HTTP server on port 9999)
- **Build for production**: `npm run build` (Webpack bundling to dist/)

## Performance Monitoring
- **modules/performance-monitor.js**: Real-time performance tracking
- **How to enable**: Uncomment `perfMonitor.init()` in `core/main.js`
- **Features**: FPS monitoring, memory usage, load time tracking
- **Console access**: Use `perfMonitor.toggle()` to show/hide overlay
- **Methods**: `perfMonitor.getMetrics()`, `perfMonitor.logMetrics()`

## Code Style Guidelines

### Imports & Modules
- Use ES6 modules with explicit imports at the top of files
- Group imports by category: core/, modules/, data/
- Import specific functions/objects, not entire modules
- Example: `import { getRandomInt, deepClone } from './utilities.js'`

### Naming Conventions
- **Variables/Functions**: camelCase (e.g., `playerCredits`, `calculateDistance`)
- **Constants**: UPPER_SNAKE_CASE for exported constants
- **Files**: kebab-case for modules, camelCase for core files
- Use descriptive, meaningful names

### Formatting
- 4-space indentation
- No semicolons at end of statements
- Single quotes for strings
- Consistent spacing around operators and commas

### Error Handling
- Use try/catch blocks for risky operations
- Display user-friendly error messages via `displayConsoleMessage()`
- Validate inputs and handle edge cases
- Return early from functions on error conditions

### Code Organization
- Group related functionality into modules
- Use clear section comments for major code blocks
- Keep functions focused on single responsibilities
- Prefer functional programming patterns where appropriate

### Performance
- Use efficient algorithms for game calculations
- Cache expensive operations when possible
- Monitor performance with the performance-monitor module

## Project Structure & File Purposes

### Core Files (`core/`)

**main.js** - Main entry point that orchestrates ES6 module loading and initialization. Imports all core modules, data files, and sets up the application structure. Serves as the central hub for module coordination during the ES6 migration from legacy script loading.

**state.js** - Centralized game state management containing all global game objects. Defines the `game` object (player data, map, NPCs, ports, planets) and `ui` object (DOM element references). Acts as the single source of truth for game state across all modules.

**game.js** - Handles game lifecycle operations including initialization, saving/loading game state to localStorage, and restarting functionality. Manages player creation, game setup, and persistence of player accounts and game sessions.

**utilities.js** - Core utility functions used throughout the application. Contains random number generation, deep object cloning, array manipulation helpers, and other common utility functions that don't fit in specific feature modules.

**movement.js** - Manages all player movement and navigation logic. Handles sector transitions, movement validation, solar array deployment/retraction, and simulation mode for automated gameplay. Processes movement commands and updates player position.

**actions.js** - Contains player action handlers for game mechanics. Processes commands like scanning sectors, deploying equipment (mines, fighters), interacting with ports, and other player-initiated actions that affect the game world.

**npc.js** - Manages NPC (Non-Player Character) ship generation, AI behavior, and movement patterns. Creates NPC ships with different archetypes, handles their autonomous movement around the galaxy, profitable trading (buy-low-sell-high with +3-4M credits net), equipment upgrades (40-60% success rates), fuel management, and faction-specific strategic decision-making. NPCs prioritize selling all available inventory for space, then buying cheap commodities to arbitrage at better ports.

**events.js** - Sets up DOM event listeners and keyboard event handling. Manages all user interface interactions, button clicks, keyboard shortcuts, and event delegation. Initializes the UI and performance monitoring on page load.

### Modules (`modules/`)

**ui.js** - User interface management and display updates. Handles console message system with timestamps and message types, UI state updates, manual display, galaxy log viewing, and all visual feedback to the player.

**audio.js** - Sound effects and background music control. Manages audio initialization, volume controls, music theme selection, sound effect playback, and handles browser audio restrictions (requiring user interaction before playing audio).

**auth.js** - Player authentication and account management. Handles login/logout functionality, player account creation, session management, and the authentication modal system for managing multiple player accounts.

**commerce.js** - Trading system and port interactions. Manages buy/sell transactions for commodities (ore/food/tech) and exotic resources (minerals/organics/artifacts), handles port ownership mechanics, calculates trade profits/losses, processes player-owned port benefits, and supports NPC automated trading. Features dynamic port prices with boom/bust events and price clamps ensuring profitable trading (sell prices ≤ buy prices).

**combat.js** - Combat mechanics and ship-to-ship battles. Handles combat initiation, damage calculations, shield/hull interactions, weapon systems (fighters, missiles, mines), and combat UI state management.

**economy.js** - Economic events and market dynamics. Manages random economic events like booms, busts, strikes, and shortages that affect commodity prices across the galaxy. Creates dynamic market fluctuations.

**factions.js** - Faction relationships and diplomatic systems. Manages the three main factions (Traders, Duran, Vinari), their territories, ships, relationships, and generates faction-related events and conflicts.

**galactic-bank.js** - Banking system for players and NPCs. Handles deposits, withdrawals, interest calculations (1.5% daily), PIN security, and persistent account storage. NPCs use banking for wealth management and long-term credit accumulation.

**lottery.js** - Lottery system for random rewards. Implements a number-drawing lottery game where players can win credits. Manages lottery state, number selection, drawing mechanics, and periodic play resets.

**mechanics.js** - Core game mechanics implementation. Handles hazard encounters (mines, asteroids), damage calculations from environmental hazards, sector scanning results, and various game world interactions.

**planets.js** - Planet generation and colonization features. Creates procedural planets with different types, atmospheres, temperatures, and life signs. Generates descriptive text for planet exploration, colonization mechanics, and NPC mining operations with resource extraction.

**power-calculator.js** - Ship power scoring system. Calculates comprehensive power ratings for ships based on hull, shields, weapons, equipment, credits, and combat history. Used for rankings and AI decision-making.

**rankings.js** - Player rankings and leaderboards. Generates and displays power rankings comparing player and NPC ships. Shows faction power distributions and individual entity statistics.

**tts.js** - Text-to-speech functionality for accessibility. Provides voice narration for game manual entries and UI elements. Supports both browser TTS and external TTS APIs (ElevenLabs, Piper) with voice caching.

**performance-monitor.js** - Real-time performance tracking and optimization. Monitors FPS, memory usage, load times, and frame rates. Provides visual overlay for performance metrics and debugging information.

### Data Files (`data/`)

**game-data.js** - Core game configuration and static data. Contains ship class definitions, commodity lists, equipment costs, scanner models, planet types, hazard types, port configurations, and all game balance constants.

**naming-data.js** - Name generation and faction constants. Contains arrays of first/last names for NPC generation, faction identifiers, port/star/planet name components, and all naming-related constants used throughout the game.

**lore-data.js** - Story elements and background flavor text. Contains narrative content, faction backstories, ship descriptions, and atmospheric text that adds depth and immersion to the game world.

**manual-data.js** - Game manual content and help system. Comprehensive documentation of game mechanics, controls, strategies, and features. Structured as interactive help system with detailed explanations of complex game systems.

### Other Key Files

**ship-definitions.js** - Ship class definitions and NPC creation logic. Contains the Ship class constructor, ship creation functions, NPC archetype definitions, and ship-related utility functions used by both players and AI.

**script.js** - Legacy script file being phased out. Contains redirects to new ES6 module locations and some transitional code during the migration from old script loading to modern ES6 modules.

**helpers/utility-helpers.js** - Additional utility functions. Contains helper functions that complement the core utilities but are more specific to certain features or less commonly used across the codebase.

**jest.config.js** - Jest testing framework configuration. Defines test file patterns, environment settings, and coverage collection rules for the JavaScript test suite.

**webpack.config.js** - Webpack bundling configuration. Defines build process for production deployment, module bundling, asset handling, and development server setup.

**package.json** - Node.js project configuration. Defines dependencies, scripts, project metadata, and npm configuration for the development environment.

**test-runner.html** - Browser-based test runner interface. Provides a web interface for running Jest tests in the browser environment with visual results and test suite selection.

**index.html** - Main HTML entry point. Contains the basic HTML structure, CSS links, and script imports that bootstrap the Cosmic Trader application.

## Development Workflow

### Getting Started
1. Clone repository: `git clone https://github.com/darkoned12000/cosmictrader.git`
2. Install dependencies: `npm install`
3. Start development server: `npm run serve`
4. Open `index.html` in browser

### Testing
1. Run Jest tests: `npm test`
2. Run browser tests: Open `test-runner.html` after starting server
3. Enable performance monitoring: Uncomment perfMonitor.init() in main.js

### Building
1. Development build: `npm run build` (outputs to dist/)
2. Production build: Change mode to 'production' in webpack.config.js

## Architecture Notes

### Game State Management
- Centralized state in `core/state.js` with `game` and `ui` objects
- All modules import and modify state directly
- No state management library (Redux, etc.) - kept simple for maintainability

### Module Organization
- Feature-based modules in `modules/` directory
- Core game logic separated into `core/` directory
- Data constants centralized in `data/` directory
- Clear separation of concerns

### NPC Intelligence System
- **Trading AI**: NPCs make autonomous trading decisions based on faction preferences and market conditions
- **Upgrade Logic**: Equipment purchases and ship improvements driven by faction-specific priorities
- **Resource Management**: Fuel consumption, cargo capacity optimization, and wealth accumulation
- **Strategic Movement**: Pattern-based navigation with hazard avoidance and opportunity seeking
- **Economic Participation**: Active market influence through buying/selling commodities and exotic resources
- **Banking Integration**: NPCs utilize banking for long-term wealth management and interest accumulation

### ES6 Module Migration
- Project is migrating from legacy script loading to ES6 modules
- `core/main.js` serves as the new entry point
- Legacy `script.js` contains redirects to new locations

### Performance Considerations
- Game runs on 50x100 sector grid (5000 sectors total)
- Performance monitoring available for optimization
- Memory usage tracking for large game states
- FPS monitoring for smooth gameplay

## Future Updates & Features

### High Priority Features
- **Multiplayer Support**: Real-time player interactions, chat system
- **Database Integration**: Persistent storage, user accounts, leaderboards
- **Advanced Combat**: Ship formations, tactical combat, weapon systems
- **Dynamic Economy**: Player-driven market changes, supply/demand mechanics

### Medium Priority Features
- **Port-to-Port Trading**: Automated trading scripts, cargo routing
- **NPC AI Enhancement**: Smarter NPC behavior, faction conflicts
- **Ship Customization**: Modular ship building, upgrade systems
- **Mission System**: Quests, objectives, reward structures

### Quality of Life Improvements
- **Mobile Support**: Touch controls, responsive design
- **Accessibility**: Screen reader support, keyboard navigation
- **Save System**: Cloud saves, multiple save slots
- **Tutorial System**: Interactive onboarding, help system

### Technical Improvements
- **WebAssembly Integration**: Performance-critical calculations
- **Progressive Web App**: Offline support, installable
- **Advanced Graphics**: Canvas/WebGL rendering, animations
- **Mod Support**: Plugin system, custom content loading

### Content Expansion
- **New Ship Classes**: Additional playable ships with unique abilities
- **Faction Storylines**: Branching narratives, diplomatic choices
- **Planet Colonization**: Resource management, base building
- **Space Stations**: Player-owned stations, custom ports

### Experimental Features
- **VR Support**: WebXR integration for immersive gameplay
- **Voice Commands**: Speech recognition for hands-free play
- **AI Companions**: NPC crew members with personalities
- **Procedural Generation**: Dynamic universe creation

## Additional Developer Information

### GitHub Repository
- **URL**: https://github.com/darkoned12000/cosmictrader
- **Issues**: Report bugs and request features via GitHub Issues
- **Contributing**: Follow standard fork/PR workflow

### Browser Compatibility
- Modern browsers with ES6 module support
- Chrome 61+, Firefox 60+, Safari 10.1+, Edge 16+
- Requires local server for module loading (CORS restrictions)

### Development Tools
- **Jest**: Unit testing framework
- **Webpack**: Module bundling for production
- **Performance Monitor**: Built-in performance tracking
- **Browser DevTools**: Standard web development debugging

### Code Quality
- ESLint configuration recommended for consistency
- Pre-commit hooks for automated testing
- Code coverage reporting with Jest
- Performance monitoring for optimization

### Deployment
- Static hosting compatible (GitHub Pages, Netlify, etc.)
- No server-side requirements for basic gameplay
- Optional database integration for advanced features

### Community & Support
- **Discord**: Join development discussions
- **Documentation**: Inline code comments and this AGENTS.md
- **Wiki**: Game mechanics and development guides
- **Tutorials**: Video guides for new contributors