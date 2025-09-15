// All NPC creation, movement, and interaction logic

// --- NPC Module Imports ---
import { game } from './state.js';
import { displayConsoleMessage, updateUI } from '../modules/ui.js';
import { playSoundEffect } from '../modules/audio.js';
import { handleNpcHazardImpact } from '../modules/mechanics.js';
import { FACTION_TRADER, FACTION_VINARI, FACTION_DURAN } from '../data/naming-data.js';
import { getRandomInt, getRandomElement } from './utilities.js';

/**
 * Determines the map display type string for an NPC based on its faction.
 * @param {string} faction - The faction of the NPC (e.g., FACTION_TRADER, FACTION_VINARI).
 * @returns {string} The map type string (e.g., 'npc_trader', 'vinari_ship').
 */

// Determines the map display symbol for an NPC ship
export function determineNpcMapType(faction) {
    if (faction === FACTION_VINARI) {
        return 'vinari_ship';

    } else if (faction === FACTION_DURAN) {
        return 'duran_ship';
    } else if (faction === FACTION_TRADER) {
        return 'npc_trader';
    }
    return 'npc_trader'; // Default
}


// Placeholder function for trading with NPC (Not Implemented yet)
function tradeWithNPC(npc) {
    displayConsoleMessage(`Trading with ${npc.name} is not yet implemented.`, 'error');
    // Example: NPCs could have random inventory and prices, different from ports
    // const npcInventory = { ore: getRandomInt(0, 50), food: getRandomInt(0, 50), tech: getRandomInt(0, 20) };
    // const prices = { ore: getRandomInt(50, 150), food: getRandomInt(20, 80), tech: getRandomInt(100, 400) };
    // Update UI to show trade options specific to this NPC
    // ui.interactionControls.innerHTML = `...`; // Generate buttons for NPC trade
}


/**
 * Handles the random movement of all active NPCs on the map.
 */
export function moveNPCs() {
    // Create a copy of the npcs array to iterate, as it might be modified during the loop (if NPCs are destroyed)
    const npcsToProcess = [...game.npcs];

    npcsToProcess.forEach(npc => {
        // Ensure NPC is still in the active game.npcs array (might have been destroyed by another NPC or earlier hazard)
        if (!game.npcs.includes(npc)) return;

        if (Math.random() < 0.3) { // 30% chance to move
            const directions = ['up', 'down', 'left', 'right'];
            const dir = getRandomElement(directions);
            let newX = npc.x_pos, newY = npc.y_pos;

            if (dir === 'up' && newY > 0) newY--;
            else if (dir === 'down' && newY < game.mapHeight - 1) newY++;
            else if (dir === 'left' && newX > 0) newX--;
            else if (dir === 'right' && newX < game.mapWidth - 1) newY++; // Typo here, should be newX++
            else return; // Cannot move in that direction or hit map edge

            // Corrected typo for 'right' direction and added a check for no actual movement
            if (dir === 'right' && newX < game.mapWidth - 1) newX++;
            else if (newX === npc.x_pos && newY === npc.y_pos) return; // No actual movement

            const oldKey = `${npc.x_pos},${npc.y_pos}`;
            const newKey = `${newX},${newY}`;
            const targetSectorContent = game.map[newKey];

            // --- HAZARD CHECK FOR NPC ---
            let npcDestroyedByHazard = false;
            if (targetSectorContent && targetSectorContent.type === 'hazard') {
                npcDestroyedByHazard = handleNpcHazardImpact(npc, targetSectorContent.data);
            }

            if (npcDestroyedByHazard) {
                // If NPC was destroyed by hazard, remove it from active game lists
                game.npcs = game.npcs.filter(n => n.ship_id !== npc.ship_id);
                game.deceasedNpcs.push(npc); // Add to deceased list
                if (game.factions[npc.faction] && game.factions[npc.faction].ships) {
                    game.factions[npc.faction].ships = game.factions[npc.faction].ships.filter(id => id !== npc.ship_id);
                }
                if (game.map[oldKey] && game.map[oldKey].data === npc) {
                    game.map[oldKey] = null; // Clear old map spot
                }
                // Don't update new map position if destroyed
                return;
            }

            // Continue with normal movement if not destroyed by hazard
            // Only move if target sector is empty or another NPC (allowing multiple NPCs/objects in one sector)
            if (!targetSectorContent || ['empty', 'star', 'npc_trader', 'vinari_ship', 'duran_ship'].includes(targetSectorContent.type)) {
                if (game.map[oldKey] && game.map[oldKey].data === npc) {
                    game.map[oldKey] = null; // Clear old position
                }
                npc.x_pos = newX;
                npc.y_pos = newY;
                // Only update the map directly if the new sector was empty or star, otherwise it's just an overlap
                if (!targetSectorContent || targetSectorContent.type === 'empty' || targetSectorContent.type === 'star') {
                    game.map[newKey] = { type: determineNpcMapType(npc.faction), data: npc };
                } else {
                    // If moving into an occupied sector (e.g., another NPC), the NPC is now logically there,
                    // but the map symbol might still show the other entity. This is an existing limitation.
                }
            }
        }
    });
}


export function hailNPC() {
    const sector = game.map[`${game.player.x},${game.player.y}`];
    if (!sector || !['npc_trader', 'vinari_ship', 'duran_ship'].includes(sector.type)) {
        displayConsoleMessage("No hailable ships in this sector.", 'error'); return;
    }
    const npcShipObject = sector.data; // This is a Ship object

    // Infer hostility from faction for hailing response
    let responseMessage = "";
    let messageType = 'info';
    let sound = 'ui_click';

    if (npcShipObject.faction === FACTION_VINARI || npcShipObject.faction === FACTION_DURAN) {
        responseMessage = `${npcShipObject.ship_name} responds with a coded transmission. Seems wary.`;
        messageType = 'warning';
        sound = 'error'; // More alert sound
        // Future: Could lead to combat if player persists or fails a check
    } else if (npcShipObject.faction === FACTION_TRADER) {
        responseMessage = `${npcShipObject.ship_name} responds: "Greetings, Captain. Fair winds and good trade to ya."`;
        // Future: Could open a trade dialog with this specific trader
    } else {
        responseMessage = `${npcShipObject.ship_name} acknowledges your hail.`;
    }
    displayConsoleMessage(responseMessage, messageType, sound);
    // updateUI(); // updateUI is usually called by the action that triggered hailNPC, or after move.
}