# Cosmic Trader Project Restructure Plan

## Overview
This document outlines the tasks required to refactor the Cosmic Trader project for better maintainability and organization. The primary goals are:
- **Consolidate constants** into `data/game-data.js` for a single data hub.
- **Split `script.js`** into feature-specific modules (e.g., `npc.js`, `movement.js`) to reduce its size from ~1193 lines to ~400 lines.
- **Improve separation of concerns** by grouping related functionality (e.g., all NPC logic in `npc.js`).
- **Preserve all functionality** without altering or deleting code—only move and reorganize.
- **Add comments** for better navigation and maintainability.
- **Prepare for future improvements** like ES6 modules, classes, and error handling.

The refactor focuses on moving code pieces into appropriate places without changing logic. Additional enhancements (e.g., performance optimizations) will be handled after confirming the game works post-refactor.

## Current Issues Recap
- `script.js` is monolithic (1193 lines) with mixed concerns (state, logic, UI, events).
- Constants are scattered (some in `data/game-data.js`, others in `script.js`).
- Functionality is hard to find (e.g., NPC code is buried in `script.js`).
- No clear feature boundaries, making maintenance and scaling difficult.
- Tight coupling between UI, logic, and state.

## Proposed New Structure
```
CosmicTrader/
├── index.html (updated script includes)
├── data/
│   ├── game-data.js (expanded with all constants)
│   ├── naming-data.js (unchanged)
│   └── lore-data.js (unchanged)
├── modules/ (existing, with additions)
│   ├── ui.js (centralized UI logic)
│   ├── audio.js (unchanged)
│   ├── auth.js (unchanged)
│   ├── power-calculator.js (unchanged)
│   ├── factions.js (expanded with faction logic from script.js)
│   ├── planets.js (unchanged)
│   ├── combat.js (expanded with combat logic from script.js)
│   ├── lottery.js (unchanged)
│   ├── commerce.js (expanded with trading/economy from script.js)
│   ├── economy.js (unchanged)
│   ├── mechanics.js (expanded with viruses/hazards from script.js)
│   └── rankings.js (unchanged)
├── core/ (new directory for shared utilities)
│   ├── game.js (new main entry point)
│   ├── state.js (game state management)
│   ├── movement.js (new: movement/warping logic)
│   ├── npc.js (new: NPC-related logic)
│   ├── actions.js (new: action handler)
│   ├── events.js (new: event listeners)
│   └── utilities.js (new: shared helpers)
└── script.js (reduced to core orchestration)
```

## Task List
Perform tasks in order. Each task includes:
- **What**: Description of the move or change.
- **Why**: Rationale.
- **How**: Step-by-step instructions.
- **Comments to Add**: Suggested inline comments for maintainability.

### Phase 1: Consolidate Constants
1. **Move Constants from `script.js` to `data/game-data.js`**:
   - **What**: Extract all `const` declarations from `script.js` (e.g., `SIMULATION_MODE_ENABLED`, `LOTTERY_PLAYS_RESET_INTERVAL_MOVES`) and append them to `data/game-data.js`.
   - **Why**: Centralizes all static data for easy access and updates.
   - **How**:
     - Open `script.js` and identify all `const` lines (e.g., lines 4-5, 78-79).
     - Copy them to the end of `data/game-data.js`, grouping under new sections like `// --- SIMULATION AND LOTTERY CONSTANTS ---`.
     - Remove the `const` lines from `script.js`.
     - Update references in `script.js` to import from `data/game-data.js` (e.g., change `SIMULATION_MODE_ENABLED` to `gameData.SIMULATION_MODE_ENABLED` if using an object).
   - **Comments to Add**: In `data/game-data.js`, add `// Consolidated from script.js for centralization` above moved constants.

2. **Update References in `script.js`**:
   - **What**: Replace direct `const` usage with references to `data/game-data.js`.
   - **Why**: Ensures no broken references after moves.
   - **How**: Search for each moved constant in `script.js` and prefix with `gameData.` (assuming we export an object from `data/game-data.js`).
   - **Comments to Add**: Add `// Imported from data/game-data.js` above the first usage of each constant.

### Phase 2: Split `script.js` into Modules
3. **Create `core/utilities.js`**:
   - **What**: Extract shared helper functions (e.g., `getRandomInt`, `deepClone` if present).
   - **Why**: Provides reusable utilities across modules.
   - **How**:
     - Create the file and move functions from `script.js` (search for utility functions).
     - Export them (e.g., `export { getRandomInt }`).
     - In `script.js`, replace with `import { getRandomInt } from './core/utilities.js'`.
   - **Comments to Add**: `// Shared utility functions for randomization and cloning`.

4. **Create `core/state.js`**:
   - **What**: Move the `game` and `ui` objects from `script.js`.
   - **Why**: Centralizes state management.
   - **How**:
     - Extract `const game = { ... }` and `const ui = { ... }` (lines ~8-97 in `script.js`).
     - Export as `export const game = { ... }; export const ui = { ... };`.
     - In `script.js`, import and use them.
   - **Comments to Add**: `// Centralized game state and UI references`.

5. **Create `core/movement.js`**:
   - **What**: Extract movement-related functions (e.g., `move`, `warpToSector`, `toggleSimulation`, `applyVirusEffects`, `toggleSolarArray`).
   - **Why**: Groups all movement and simulation logic.
   - **How**:
     - Move functions from `script.js` (lines ~602-868).
     - Export them and import in `script.js`.
   - **Comments to Add**: `// Handles player movement, warping, simulation, and related effects`.

6. **Create `core/npc.js`**:
   - **What**: Extract NPC-related functions (e.g., `moveNPCs`, `hailNPC`, `attackNPC`).
   - **Why**: Directly addresses your request for NPC functionality in its own file.
   - **How**:
     - Move from `script.js` (search for NPC functions).
     - Export and import.
   - **Comments to Add**: `// All NPC creation, movement, and interaction logic`.

7. **Create `core/actions.js`**:
   - **What**: Extract the `triggerAction` function and switch statement.
   - **Why**: Isolates action handling.
   - **How**:
     - Move from `script.js` (lines ~914-117).
     - Export and import.
   - **Comments to Add**: `// Central handler for all player-triggered actions`.

8. **Create `core/events.js`**:
   - **What**: Extract event listeners (DOM and keyboard).
   - **Why**: Separates UI event handling.
   - **How**:
     - Move from `script.js` (lines ~124-187).
     - Export and import.
   - **Comments to Add**: `// DOM and keyboard event listeners`.

9. **Create `core/game.js`**:
   - **What**: Move initialization, save/load, restart functions (e.g., `initGame`, `saveGame`, `loadGame`, `restartGame`).
   - **Why**: Acts as the main entry point for game orchestration.
   - **How**:
     - Move from `script.js` (lines ~101-597).
     - Export and import.
   - **Comments to Add**: `// Main game initialization and lifecycle management`.

10. **Update Existing Modules**:
    - **What**: Merge relevant functions from `script.js` into existing modules (e.g., move combat logic to `modules/combat.js`, faction logic to `modules/factions.js`).
    - **Why**: Builds on existing structure.
    - **How**: Identify and move (e.g., `startCombat` to `modules/combat.js`).
    - **Comments to Add**: `// Merged from script.js for better organization`.

11. **Reduce `script.js`**:
    - **What**: After moves, `script.js` should only contain orchestration (e.g., calling `initGame` from `core/game.js`).
    - **Why**: Keeps it as a lightweight entry point.
    - **How**: Remove moved code and add imports.
    - **Comments to Add**: `// Main script: imports and orchestrates modules`.

### Phase 3: Update HTML and Dependencies
12. **Update `index.html`**:
    - **What**: Add `<script>` tags for new modules (e.g., `<script src="core/game.js"></script>`).
    - **Why**: Ensures new files are loaded in the correct order.
    - **How**: Insert after existing module includes, before `script.js`.
    - **Comments to Add**: `<!-- New core modules for refactored logic -->`.

13. **Convert to ES6 Modules (Optional but Recommended)**:
    - **What**: Change `<script>` to `<script type="module">` and use `import/export`.
    - **Why**: Modernizes the codebase for better dependency management.
    - **How**: Update all files to use `export` and `import` statements.
    - **Comments to Add**: `// ES6 module for modern JS support`.

### Phase 4: Testing and Validation
14. **Test Functionality**:
    - **What**: Run the game and verify all features (movement, combat, NPCs, etc.) work.
    - **Why**: Ensures no functionality was broken during moves.
    - **How**: Load the game, test key actions, and check console for errors.
    - **Comments to Add**: Add `console.log('Module loaded successfully')` in each new file for debugging.

15. **Add Documentation Comments**:
    - **What**: Add JSDoc-style comments to key functions (e.g., `/** @description Handles NPC movement */`).
    - **Why**: Improves readability and maintainability.
    - **How**: Add to functions in new modules.
    - **Comments to Add**: As specified.

## Additional Improvements (Post-Refactor)
- **Introduce Classes**: Convert objects to classes (e.g., `class Player` in `core/state.js`).
- **Error Handling**: Add try/catch in functions like `move` and `warpToSector`.
- **Performance**: Optimize loops (e.g., in NPC movement) if needed.
- **Unit Tests**: Add tests for modules (e.g., test NPC logic in `npc.js`).
- **Code Linting**: Run a linter to enforce consistency.

## Notes
- **Backup First**: Create a git branch or backup before starting.
- **Incremental Commits**: Commit after each phase for easy rollback.
- **Timeline**: Phases 1-2: 2-3 hours; Phase 3: 30 mins; Phase 4: 1 hour.
- **Tools Needed**: Text editor for moves; browser console for testing.

This plan ensures the 'core' is solid, maintainable, and ready for enhancements. Let me know if you need help executing any task!