// Main entry point for ES6 modules
// This replaces the old script loading system with modern module imports

// Import data files first (these contain constants and data structures)
import '../data/game-data.js';
import '../data/naming-data.js';
import '../data/lore-data.js';

// Import ship definitions (contains Ship class and related functions)
import '../ship-definitions.js';

// Import modules (these contain specific functionality)
import '../modules/ui.js';
import '../modules/audio.js';
import '../modules/auth.js';
import '../modules/power-calculator.js';
import '../modules/factions.js';
import '../modules/planets.js';
import '../modules/combat.js';
import '../modules/lottery.js';
import '../modules/commerce.js';
import '../modules/economy.js';
import '../modules/mechanics.js';
import '../modules/rankings.js';

// Import core utilities and game logic
import './utilities.js';
import './state.js';
import './movement.js';
import './npc.js';
import './actions.js';
import './game.js';
import './events.js';

// Enable Performance Monitoring in development mode
//import { perfMonitor } from '../modules/performance-monitor.js';

// The events.js module will automatically initialize when imported
console.log('🚀 Cosmic Trader ES6 modules loaded successfully!');

// To see perfMonitor type 'perfMonitor.toggle()' in the console
//  and then refresh the page to see performance metrics in the console
//  You can also call 'perfMonitor.report()' to get a summary report
//  or 'perfMonitor.reset()' to clear the collected data
//  Note: This is intended for development use only and may impact performance
//        Do not enable in production or for regular gameplay
//perfMonitor.init(); // Initialize performance monitoring