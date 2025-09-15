function handleHazardEntry(sector) {
    if (!sector || sector.type !== 'hazard' || !sector.data) return;

    const hazardType = sector.data.hazardType;
    let message = `Entered Hazard: ${hazardType}!`;
    let sound = 'error'; // Default sound for hazards

    switch (hazardType) {
        case 'Mine':
            sound = 'mine_hit';
            const shieldDamage = 20;
            const hullDamage = 10;
            message = 'Hit an armed mine!';
            if (game.player.ship.shields > 0) {
                const absorbedShields = Math.min(game.player.ship.shields, shieldDamage);
                game.player.ship.shields -= absorbedShields;
                message += ` Shields -${absorbedShields}.`;
                if (absorbedShields < shieldDamage && game.player.ship.shields === 0) {
                    const hullDamageTaken = hullDamage; // Direct hull damage if shields are gone
                    game.player.ship.hull = Math.max(0, game.player.ship.hull - hullDamageTaken);
                    message += ` Hull -${hullDamageTaken}.`;
                } else if (absorbedShields === shieldDamage) {
                    // Shields absorbed all damage, no hull damage
                } else {
                     // Shields absorbed some damage, still has shields remaining
                }
            } else {
                // No shields, take full hull damage
                game.player.ship.hull = Math.max(0, game.player.ship.hull - hullDamage);
                message += ` Hull -${hullDamage}.`;
            }
            // Remove the mine after it's triggered
            delete game.map[`${sector.x},${sector.y}`];
            game.hazards = game.hazards.filter(h => h !== sector.data); // Also remove from hazards array

            displayConsoleMessage(message, 'error', sound); // Display message after damage calculation
            break;

        case 'Asteroid Field':
            message = "Navigating dense asteroid field! Minor impacts detected.";
            game.player.ship.shields = Math.max(0, game.player.ship.shields - getRandomInt(0, 5));
             displayConsoleMessage(message); // Default sound
            break;

        case 'Black Hole':
            message = "WARNING: Extreme gravity ripping at the hull!";
            const bhHullDamage = getRandomInt(40, 80);
            game.player.ship.hull = Math.max(0, game.player.ship.hull - bhHullDamage);
            game.player.ship.shields = 0; // Black holes likely collapse shields
            message += ` Hull -${bhHullDamage}. Shields offline!`;
             displayConsoleMessage(message, 'error', 'ship_destroyed'); // Severe damage sound
            break;

        case 'Solar Storm':
            message = "Caught in a solar storm! Shields overloaded.";
            const ssShieldDamage = getRandomInt(25, 60);
            game.player.ship.shields = Math.max(0, game.player.ship.shields - ssShieldDamage);
            message += ` Shields -${ssShieldDamage}.`;
             displayConsoleMessage(message, 'error'); // Default sound, or maybe a unique storm sound?
            break;

        case 'Nebula':
            message = "Entering nebula. Sensor efficiency reduced.";
            // Could implement temporary scanner range reduction here
             displayConsoleMessage(message, 'warning'); // Default sound
            break;

        default:
            message = "Entered unknown hazardous region! Taking minor damage.";
            game.player.ship.shields = Math.max(0, game.player.ship.shields - 5);
            game.player.ship.hull = Math.max(0, game.player.ship.hull - 2);
            displayConsoleMessage(message); // Default sound
            break;
    }

    // Check for ship destruction after taking hazard damage
    if (game.player.ship.hull <= 0) {
        logGalaxyEvent(`Your ship, "${game.player.ship.name}", was destroyed by a ${hazardType}!`, 'error');
        displayConsoleMessage("CRITICAL HULL FAILURE! SHIP DESTROYED! GAME OVER!", 'error', 'ship_destroyed');
        initGame(); // Restart the game
    } else {
       updateUI(); // Update UI if ship is still alive
    }
}


/**
 * Handles an NPC's interaction with a hazardous sector.
 * @param {object} npc - The NPC Ship object.
 * @param {object} hazardData - The hazard data object.
 * @returns {boolean} True if NPC was destroyed, false otherwise.
 */
function handleNpcHazardImpact(npc, hazardData) {
    const hazardType = hazardData.hazardType;
    let damage = 0;
    let message = "";
    let impactOccurred = true;

    switch (hazardType) {
        case 'Mine':
            damage = getRandomInt(npc.max_hull * 0.05, npc.max_hull * 0.15); // 5-15% of max hull
            message = `The ${npc.faction} vessel "${npc.ship_name}" hit an armed mine`;
            // Remove the mine after it's triggered by an NPC too
            const mineKey = `${hazardData.x},${hazardData.y}`;
            if (game.map[mineKey] && game.map[mineKey].data === hazardData) {
                delete game.map[mineKey];
                game.hazards = game.hazards.filter(h => h !== hazardData);
            }
            break;
        case 'Asteroid Field':
            damage = getRandomInt(npc.max_hull * 0.01, npc.max_hull * 0.05); // 1-5% of max hull
            message = `The ${npc.faction} vessel "${npc.ship_name}" took hits from an asteroid field`;
            break;
        case 'Black Hole':
            damage = getRandomInt(npc.max_hull * 0.3, npc.max_hull * 0.6); // 30-60% of max hull
            message = `The ${npc.faction} vessel "${npc.ship_name}" was caught in the gravitational pull of a black hole`;
            break;
        case 'Solar Storm':
            damage = getRandomInt(npc.max_shields * 0.2, npc.max_shields * 0.4); // 20-40% of max shields
            message = `The ${npc.faction} vessel "${npc.ship_name}" was battered by a solar storm`;
            break;
        case 'Nebula':
            // Nebulae cause sensor interference, not direct damage to NPCs for now
            impactOccurred = false; // No damage taken
            break;
        default:
            impactOccurred = false; // Unknown hazards don't affect NPCs for now
            break;
    }

    if (impactOccurred) {
        const initialHull = npc.current_hull;
        const initialShields = npc.current_shields;

        npc.takeDamage(damage);

        let damageReport = `(${npc.current_shields}/${npc.max_shields}S, ${npc.current_hull}/${npc.max_hull}H)`;

        if (npc.current_hull <= 0) {
            logGalaxyEvent(`${message} and was <span style="color:red;">**Destroyed**!</span>`, 'conflict');
            return true; // NPC was destroyed
        } else {
            logGalaxyEvent(`${message}, taking ${damage} damage. ${damageReport}`, 'warning');
            return false; // NPC took damage but survived
        }
    }
    return false; // No impact or no damage
}


function deployMine() {
    if (game.player.ship.mines > 0) {
        const key = `${game.player.x},${game.player.y}`;
        // Prevent deploying mine in a sector already occupied by a significant object
        const sectorContent = game.map[key];
        if (!sectorContent || sectorContent.type === 'empty' || sectorContent.type === 'hazard') { // Allow multiple mines, or mine on top of existing hazard?
             if (sectorContent && sectorContent.type === 'hazard' && sectorContent.data.hazardType === 'Mine') {
                 displayConsoleMessage("Cannot deploy mine on top of an existing mine.", 'error');
                 return;
             }

            game.player.ship.mines--;
            // Add mine data to the map
            const mineData = { hazardType: 'Mine', owner: game.player.name, x: game.player.x, y: game.player.y };
             // If there was something else there, add the mine to the hazard array, but keep the original object type for the map key
            if (sectorContent) {
                if (!game.hazards.includes(sectorContent.data)) { // Only add if not already tracked as a hazard
                     game.hazards.push(mineData);
                } else { // If already a hazard, just add the mine data
                     // This scenario might need clearer rules - can you have multiple hazard types in one sector?
                     // For simplicity now, let's assume only one major object type + potentially a mine.
                      // If a hazard is already there, just add the mine data to the hazards list without changing the map key type immediately.
                      if (!game.hazards.find(h => h.x === mineData.x && h.y === mineData.y && h.hazardType === 'Mine')) {
                           game.hazards.push(mineData);
                      }
                }
                 // Update the map key to reflect the mine is now present (maybe as a sub-type or primary if empty)
                 // For now, let's simplify and just add the mine to hazards and update the map if it was empty.
                if (!sectorContent || sectorContent.type === 'empty') {
                     game.map[key] = { type: 'hazard', data: mineData }; // Set the sector type to hazard
                } else {
                     // If there's already a non-mine object, the mine is effectively hidden or secondary.
                     // We need a more robust system to handle multiple objects per sector if this is intended.
                     // For now, the mine is added to the hazards list and will trigger if the player or NPC enters *this* sector.
                     displayConsoleMessage("Deployed mine in occupied sector. Mine may be less visible.", 'ui_click'); // Different message if occupied
                     updateUI(); // Still update UI to show mine count decrease
                     return; // Exit after deploying in occupied sector
                }


            } else {
                 game.map[key] = { type: 'hazard', data: mineData }; // Set the sector type to hazard
                 game.hazards.push(mineData); // Add to the hazards list
            }

            displayConsoleMessage('Mine deployed.');
            updateUI(); // Update UI to show mine count decrease and potentially map symbol change

        } else {
            displayConsoleMessage('Cannot deploy mine in this sector!', 'error');
            playSoundEffect('error');
        }
    } else {
        displayConsoleMessage('No mines available!', 'error');
        playSoundEffect('error');
    }
}


