// This file contains all of the 'combat' logic for player and npc's

// --- Combat Module Imports ---
import { game, ui } from '../core/state.js';
import { displayConsoleMessage, updateUI, showDeathModal } from './ui.js';
import { playSoundEffect } from './audio.js';
import { getRandomInt } from '../core/utilities.js';
import { toggleSolarArray } from '../core/movement.js';
import { initGame } from '../core/game.js';
import { logGalaxyEvent } from './factions.js';

export function startCombat(npcShipObject) {
    if (game.inCombatWith) {
        displayConsoleMessage(`Already in combat with ${game.inCombatWith.ship_name}!`, 'warning');
        return;
    }
    // Auto-retract solar array if deployed
    if (game.solarArrayDeployed) {
        displayConsoleMessage("Hostiles detected! Solar array automatically retracting!", "warning");
        toggleSolarArray(); // This will clear interval and update button text via updateUI
    }

    game.inCombatWith = npcShipObject;
    displayConsoleMessage(`Engaging ${npcShipObject.ship_name} (${npcShipObject.ship_class})! Prepare for battle!`, 'error', 'virus_infect'); // Using an alert sound

    // Disable map movement buttons during combat (visual cue, actual prevention is in move functions)
    document.querySelectorAll('#galaxy-map .button-group button[data-action="move"]').forEach(btn => btn.disabled = true);
    ui.deployMineButton.disabled = true; // Also disable deploy mine

    updateUI(); // This will call updateInteraction, which should now show combat UI
}


function engageCombat(npcShipObject) { // npcShipObject is now a Ship instance
    const player = game.player;
    // Player strength (simplified - you might want to use Ship class properties more directly)
    const playerStrength = player.ship.fighters + player.ship.missiles * 10 + player.ship.shields;

    // NPC strength using Ship object properties
    const npcStrength = npcShipObject.fighter_squadrons + npcShipObject.missile_launchers * 10 + npcShipObject.current_shields + (npcShipObject.current_hull * 0.5);

    const successChance = playerStrength / (playerStrength + npcStrength);

    if (Math.random() < successChance) {
        const lootedCredits = getRandomInt(100, 1000); // Example loot
        player.credits += lootedCredits;
        displayConsoleMessage(`Victory! You defeated ${npcShipObject.ship_name} and looted ${lootedCredits} credits!`, 'success');

        // Remove NPC from game
        game.map[`${npcShipObject.x_pos},${npcShipObject.y_pos}`] = null; // Clear map cell
        game.npcs = game.npcs.filter(n => n.ship_id !== npcShipObject.ship_id); // Remove from npcs array by ID

    } else {
        const shieldDamageToPlayer = 50; // Example damage
        const hullDamageToPlayer = 20;   // Example damage

        player.ship.shields = Math.max(0, player.ship.shields - shieldDamageToPlayer);
        player.ship.hull = Math.max(0, player.ship.hull - hullDamageToPlayer);

        displayConsoleMessage(`Defeat! ${npcShipObject.ship_name} damaged your ship: -${shieldDamageToPlayer} shields, -${hullDamageToPlayer} hull!`, 'error', 'ship_destroyed');

        if (player.ship.hull <= 0) {
            displayConsoleMessage("CRITICAL HULL FAILURE! SHIP DESTROYED! GAME OVER!", 'error', 'ship_destroyed');
            initGame(); // Or trigger a game over sequence
        }
    }
    updateUI();
}


export function handleCombatRound(playerActionType) {
    if (!game.inCombatWith) return;

    const playerShip = game.player.ship;
    const npcShip = game.inCombatWith;
    let roundLog = [`--- Combat Round vs ${npcShip.ship_name} ---`];

    // --- Player's Action ---
    let playerDamageDealt = 0;
    let playerActionDescription = "";

    switch (playerActionType) {
        case 'standard_attack': // Basic guns/lasers
            playerDamageDealt = getRandomInt(10, 30) + (playerShip.computerLevel * 5); // Simple damage
            playerActionDescription = `You fire your primary weapons!`;
            roundLog.push(`${playerActionDescription} Target: ${npcShip.ship_name}.`);
            npcShip.takeDamage(playerDamageDealt);
            roundLog.push(`Your attack hits, dealing ${playerDamageDealt} damage. (${npcShip.current_shields}/${npcShip.max_shields}S, ${npcShip.current_hull}/${npcShip.max_hull}H)`);
            playSoundEffect('mine_hit'); // Placeholder for weapon fire sound
            break;

        case 'launch_fighters':
            if (playerShip.fighters > 0) {
                const fightersLaunched = Math.min(playerShip.fighters, getRandomInt(5, 10)); // Launch a small wing
                playerActionDescription = `You launch ${fightersLaunched} fighters!`;
                roundLog.push(playerActionDescription);
                playerShip.fighters -= fightersLaunched;

                let fighterDamage = 0;
                let npcFightersLost = 0;
                // Simple fighter combat: player fighters vs NPC fighters, then damage hull
                if (npcShip.fighter_squadrons > 0) {
                    npcFightersLost = Math.min(npcShip.fighter_squadrons, Math.ceil(fightersLaunched * (0.3 + Math.random() * 0.5))); // NPC loses some fighters
                    npcShip.fighter_squadrons -= npcFightersLost;
                    roundLog.push(`Your fighters engage, destroying ${npcFightersLost} enemy fighters.`);
                }
                fighterDamage = fightersLaunched * getRandomInt(3, 7); // Remaining fighters deal damage
                playerDamageDealt = fighterDamage; // For logging consistency
                npcShip.takeDamage(fighterDamage);
                roundLog.push(`Your fighters inflict ${fighterDamage} additional damage. (${npcShip.current_shields}/${npcShip.max_shields}S, ${npcShip.current_hull}/${npcShip.max_hull}H)`);
                playSoundEffect('ui_click'); // Placeholder
            } else {
                playerActionDescription = `Attempt to launch fighters, but you have none!`;
                roundLog.push(playerActionDescription);
                playSoundEffect('error');
            }
            break;

        case 'fire_missile':
            if (playerShip.missiles > 0) {
                playerActionDescription = `You fire a missile!`;
                roundLog.push(playerActionDescription);
                playerShip.missiles--;
                // Missiles could have a chance to be shot down or just deal high damage
                const missileHitChance = 0.85 - (npcShip.fighter_squadrons * 0.01); // Fighters reduce hit chance
                if (Math.random() < missileHitChance) {
                    playerDamageDealt = getRandomInt(70, 150); // Missiles are powerful
                    npcShip.takeDamage(playerDamageDealt);
                    roundLog.push(`Missile impact! ${playerDamageDealt} damage dealt. (${npcShip.current_shields}/${npcShip.max_shields}S, ${npcShip.current_hull}/${npcShip.max_hull}H)`);
                    playSoundEffect('ship_destroyed'); // Big explosion sound
                } else {
                    roundLog.push(`Your missile was intercepted or missed!`);
                    playSoundEffect('error');
                }
            } else {
                playerActionDescription = `Attempt to fire missile, but you have none!`;
                roundLog.push(playerActionDescription);
                playSoundEffect('error');
            }
            break;
    }

    // Check if NPC is destroyed by player's action
    if (npcShip.current_hull <= 0) {
        roundLog.forEach(msg => displayConsoleMessage(msg, 'info')); // Display pending logs
        endCombat(true, `${npcShip.ship_name} has been destroyed by your attack!`);
        return;
    }

    // --- NPC's Action (if still alive) ---
    let npcDamageDealt = 0;
    let npcActionDescription = "";

	if (npcShip.isStation) { // Check if the opponent is a station (port/spaceport)
        npcActionDescription = `${npcShip.ship_name} defensive systems activate!`;
        roundLog.push(npcActionDescription);

        // Station Fighter Launch (less frequent or fewer fighters than a carrier ship)
        if (npcShip.fighterSquadrons > 0 && Math.random() < 0.35) { // 35% chance to launch some fighters
            const fightersLaunched = Math.min(npcShip.fighterSquadrons, getRandomInt(1, Math.max(1, Math.floor(npcShip.fighterSquadrons / 3))));
            npcShip.fighterSquadrons -= fightersLaunched;
            roundLog.push(`${npcShip.ship_name} launches ${fightersLaunched} defense fighters!`);
            // Simplified fighter damage to player for now
            let stationFighterDamage = fightersLaunched * getRandomInt(2, 5);
            if (playerShip.shields >= stationFighterDamage) { playerShip.shields -= stationFighterDamage; }
            else { const rem = stationFighterDamage - playerShip.shields; playerShip.shields = 0; playerShip.hull = Math.max(0, playerShip.hull - rem); }
            roundLog.push(`Defense fighters inflict ${stationFighterDamage} damage.`);
            playSoundEffect('ui_click'); // Placeholder
        }

        // Station Gun Emplacements Fire
        if (npcShip.gunEmplacements > 0) {
            const gunsFiring = Math.max(1, Math.floor(npcShip.gunEmplacements * (0.5 + Math.random() * 0.5))); // 50-100% of guns fire
            npcDamageDealt = gunsFiring * getRandomInt(4, 9); // Each gun hit
            npcActionDescription = `${npcShip.ship_name} fires ${gunsFiring} gun emplacements!`;
             roundLog.push(npcActionDescription);
            if (playerShip.shields >= npcDamageDealt) {
                playerShip.shields -= npcDamageDealt;
                 roundLog.push(`Hits your shields for ${npcDamageDealt} damage.`);
            } else {
                const damageToShields = playerShip.shields;
                const remainingDamageToHull = npcDamageDealt - damageToShields;
                playerShip.shields = 0;
                playerShip.hull = Math.max(0, playerShip.hull - remainingDamageToHull);
                roundLog.push(`Hits for ${npcDamageDealt} damage! Shields down! Hull takes ${remainingDamageToHull}.`);
            }
            playSoundEffect('mine_hit'); // Placeholder for gun sound
        }
        // Optional: Station missile launchers
        if (npcShip.missileLaunchers > 0 && Math.random() < 0.25) {
            // ... similar logic to ship missile attacks ...
            npcShip.missileLaunchers--;
             roundLog.push(`${npcShip.ship_name} launches a defensive missile!`);
            // ... damage logic ...
        }
    } else {
        // Simple NPC AI: Prioritize missiles, then fighters, then standard attack
        if (npcShip.missile_launchers > 0 && Math.random() < 0.4) { // 40% chance to fire missile if available
            npcActionDescription = `${npcShip.ship_name} fires a missile!`;
            npcShip.missile_launchers--;
            const missileHitChance = 0.80 - (playerShip.fighters * 0.01);
            if (Math.random() < missileHitChance) {
                npcDamageDealt = getRandomInt(60, 130);
                // Player takes damage (using direct modification, ideally player ship has takeDamage too)
                if (playerShip.shields >= npcDamageDealt) {
                    playerShip.shields -= npcDamageDealt;
                } else {
                    const remainingDamage = npcDamageDealt - playerShip.shields;
                    playerShip.shields = 0;
                    playerShip.hull = Math.max(0, playerShip.hull - remainingDamage);
                }
                npcActionDescription += ` It hits for ${npcDamageDealt} damage!`;
                playSoundEffect('ship_destroyed');
            } else {
                npcActionDescription += ` Its missile missed or was intercepted!`;
                playSoundEffect('ui_click');
            }
        } else if (npcShip.fighter_squadrons > 0 && Math.random() < 0.5) { // 50% chance to launch fighters
            const fightersLaunched = Math.min(npcShip.fighter_squadrons, getRandomInt(3, 8));
            npcActionDescription = `${npcShip.ship_name} launches ${fightersLaunched} fighters!`;
            npcShip.fighter_squadrons -= fightersLaunched;
            let playerFightersLost = 0;
            if (playerShip.fighters > 0) {
                playerFightersLost = Math.min(playerShip.fighters, Math.ceil(fightersLaunched * (0.3 + Math.random() * 0.4)));
                playerShip.fighters -= playerFightersLost;
                npcActionDescription += ` They destroy ${playerFightersLost} of your fighters.`;
            }
            const directDamage = fightersLaunched * getRandomInt(2, 6);
            npcDamageDealt = directDamage; // For logging
            if (playerShip.shields >= directDamage) { playerShip.shields -= directDamage; }
            else { const rem = directDamage - playerShip.shields; playerShip.shields = 0; playerShip.hull = Math.max(0, playerShip.hull - rem); }
            npcActionDescription += ` Enemy fighters inflict ${directDamage} damage.`;
            playSoundEffect('ui_click');
        } else { // Standard attack
            npcDamageDealt = getRandomInt(15, 35) + (npcShip.missile_launchers); // NPC damage slightly boosted by missile launchers as proxy for guns
            npcActionDescription = `${npcShip.ship_name} fires its weapons! It hits for ${npcDamageDealt} damage.`;
            if (playerShip.shields >= npcDamageDealt) { playerShip.shields -= npcDamageDealt; }
            else { const rem = npcDamageDealt - playerShip.shields; playerShip.shields = 0; playerShip.hull = Math.max(0, playerShip.hull - rem); }
            playSoundEffect('mine_hit');
        }
    }

    roundLog.push(npcActionDescription);
    roundLog.push(`Your status: ${playerShip.shields}/${playerShip.maxShields}S, ${playerShip.hull}/${playerShip.maxHull}H, ${playerShip.fighters}F, ${playerShip.missiles}M`);


    // Display all combat messages for the round
    roundLog.forEach(msg => displayConsoleMessage(msg, 'info'));


    // Check if player is destroyed by NPC's action
    if (playerShip.hull <= 0) {
        endCombat(false); // outcomeMessage is handled by endCombat
        return;
    }

    updateUI(); // Update all UI elements to show new ship statuses
}


export function attemptFlee() {
    if (!game.inCombatWith) return;

    displayConsoleMessage("You attempt to disengage...", 'info');
    const fleeChance = 0.5; // Base 50% chance to flee
    // Future: Modify chance based on player/NPC ship speed, engine status, etc.

    if (Math.random() < fleeChance) {
        endCombat(null, "You successfully disengaged and fled the battle!"); // null for playerWon means neither won/lost via destruction
    } else {
        displayConsoleMessage("Your attempt to flee failed! The enemy gets a free shot!", 'error');
        // NPC gets a "free" attack (simplified for now, just one part of their turn)
        const npcShip = game.inCombatWith;
        const playerShip = game.player.ship;
        let npcDamageDealt = getRandomInt(20, 40); // Penalty damage
        let npcActionDescription = `${npcShip.ship_name} takes a parting shot as you attempt to flee!`;

        if (playerShip.shields >= npcDamageDealt) {
            playerShip.shields -= npcDamageDealt;
        } else {
            const remainingDamage = npcDamageDealt - playerShip.shields;
            playerShip.shields = 0;
            playerShip.hull = Math.max(0, playerShip.hull - remainingDamage);
        }
        npcActionDescription += ` It hits for ${npcDamageDealt} damage.`;
        displayConsoleMessage(npcActionDescription, 'error', 'mine_hit');

        if (playerShip.hull <= 0) {
            endCombat(false); // Player destroyed while trying to flee
            return;
        }
        updateUI(); // Update UI after taking damage
        // Combat continues, player can choose another action next.
    }
}


function endCombat(playerWon, outcomeMessage = "") {
    if (!game.inCombatWith) {
        console.warn("endCombat called but combat is already over.");
        return;
    }

    const currentTarget = game.inCombatWith;
    const targetName = currentTarget.ship_name || currentTarget.name;
    const targetFaction = currentTarget.faction || currentTarget.owner;

    if (playerWon === true) {
        game.player.kills++;
        const lootedCredits = currentTarget.bounty || getRandomInt(50, 250);
        game.player.credits += lootedCredits;
        displayConsoleMessage(outcomeMessage || `You were victorious against ${targetName}!`, 'success');
        displayConsoleMessage(`You salvaged ${lootedCredits} credits from the wreckage.`, 'success');

        const isTargetStation = currentTarget.isStation === true;
        const targetMapKey = `${currentTarget.x_pos !== undefined ? currentTarget.x_pos : currentTarget.x},${currentTarget.y_pos !== undefined ? currentTarget.y_pos : currentTarget.y}`;

        if (isTargetStation) {
            game.ports = game.ports.filter(p => p !== currentTarget);
        } else {
            // Add the player's name to the victim's faction hit list
            const killerId = game.player.firstName + " " + game.player.lastName.trim();
            if (game.factions[targetFaction] && !game.factions[targetFaction].hitList.includes(killerId)) {
                game.factions[targetFaction].hitList.push(killerId);
            }

            const deathCries = FACTION_DEATH_CRIES[targetFaction] || FACTION_DEATH_CRIES['default'];
            const dyingMessage = getRandomElement(deathCries);
            const logMsg = `Player ${game.player.firstName} defeated ${targetName}. <span style="color: #ffae42;">Their last transmission: "${dyingMessage}"</span>`;
            logGalaxyEvent(logMsg, "player_action");

            // Move to graveyard and remove from active lists
            if (!game.deceasedNpcs.some(n => n.ship_id === currentTarget.ship_id)) {
                game.deceasedNpcs.push(currentTarget);
            }
            game.npcs = game.npcs.filter(n => n.ship_id !== currentTarget.ship_id);
            if (game.factions[targetFaction] && game.factions[targetFaction].ships) {
                game.factions[targetFaction].ships = game.factions[targetFaction].ships.filter(id => id !== currentTarget.ship_id);
            }
        }

        if (game.map[targetMapKey] && game.map[targetMapKey].data === currentTarget) {
            game.map[targetMapKey] = { type: 'debris_field', data: { name: `Ruins of ${targetName}` } };
        }

    } else if (playerWon === false) {
        displayConsoleMessage(outcomeMessage || `Your ship was destroyed by ${targetName}! GAME OVER!`, 'error', 'ship_destroyed');
        logGalaxyEvent(`Player ${game.player.firstName} ${game.player.lastName} was destroyed by ${targetName} (${targetFaction}).`, 'conflict');
        showDeathModal(() => initGame());
        return;
    } else {
        displayConsoleMessage(outcomeMessage || `You disengaged from ${targetName}.`, 'info');
    }

    game.inCombatWith = null;
    document.querySelectorAll('#galaxy-map .button-group button[data-action="move"]').forEach(btn => btn.disabled = false);
    updateUI();
}
