// Browser-based test suite for commerce module
// This runs in the browser environment with ES6 modules

import { game } from '../core/state.js';
import { trade } from '../modules/commerce.js';

export async function runCommerceTestSuite(addResult) {
    addResult('Starting Commerce Test Suite', true);

    // Test trade function exists
    try {
        if (typeof trade === 'function') {
            addResult('trade function exists', true);
        } else {
            addResult('trade function exists', false, 'trade is not a function');
        }
    } catch (e) {
        addResult('trade function exists', false, e.message);
    }

    // Test game state initialization
    try {
        const hasCredits = typeof game.player.credits === 'number';
        const hasInventory = typeof game.player.inventory === 'object';
        const passed = hasCredits && hasInventory;
        addResult('Game state has player data', passed,
            passed ? 'Player has credits and inventory' : 'Missing player data');
    } catch (e) {
        addResult('Game state has player data', false, e.message);
    }

    // Test commodities array exists
    try {
        // Import commodities to test
        const { commodities } = await import('../data/game-data.js');
        const passed = Array.isArray(commodities) && commodities.length > 0;
        addResult('Commodities array exists', passed,
            passed ? `Found ${commodities.length} commodities` : 'No commodities found');
    } catch (e) {
        addResult('Commodities array exists', false, e.message);
    }

    addResult('Commerce Test Suite Complete', true);
}