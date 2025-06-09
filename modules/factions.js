// A function to set up the initial state of all factions
function initializeFactionData() {
    return {
        [FACTION_DURAN]: {
            credits: 100000,
            strength: 100,
            territory: 0, // Will be calculated during game init
            ships: [],
            hitList: []
        },
        [FACTION_VINARI]: {
            credits: 100000,
            strength: 100,
            territory: 0, // Will be calculated during game init
            ships: [],
            hitList: []
        },
        [FACTION_TRADER]: {
            credits: 150000,
            strength: 20,
            territory: 0,
            ships: [],
            hitList: []
        }
    };
}


/**
 * Determines the map display type string for an NPC based on its faction.
 * @param {string} faction - The faction of the NPC (e.g., FACTION_TRADER, FACTION_VINARI).
 * @returns {string} The map type string (e.g., 'npc_trader', 'vinari_ship').
 */

// Determines the map display symbol for an NPC ship
function determineNpcMapType(faction) {
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
function moveNPCs() {
    const npcsToMove = [...game.npcs];
    npcsToMove.forEach(npc => {
        if (!game.npcs.includes(npc)) return;

        if (Math.random() < 0.3) {
            const directions = ['up', 'down', 'left', 'right'];
            const dir = getRandomElement(directions);
            let newX = npc.x_pos, newY = npc.y_pos;

            if (dir === 'up' && newY > 0) newY--;
            else if (dir === 'down' && newY < game.mapHeight - 1) newY++;
            else if (dir === 'left' && newX > 0) newX--;
            else if (dir === 'right' && newX < game.mapWidth - 1) newX++;
            else return;

            const oldKey = `${npc.x_pos},${npc.y_pos}`;
            const newKey = `${newX},${newY}`;
            const targetSectorContent = game.map[newKey];

            if (!targetSectorContent || ['empty', 'star', 'hazard', 'npc_trader', 'vinari_ship', 'duran_ship'].includes(targetSectorContent.type)) {
                if (game.map[oldKey] && game.map[oldKey].data === npc) {
                    game.map[oldKey] = null;
                }
                npc.x_pos = newX;
                npc.y_pos = newY;
                if (!targetSectorContent || targetSectorContent.type === 'empty' || targetSectorContent.type === 'star') {
                    game.map[newKey] = { type: determineNpcMapType(npc.faction), data: npc };
                }
            }
        }
    });
}


function hailNPC() {
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


/**
 * The main AI brain for factions, processing their actions periodically.
 */
function processFactionTurns() {
    logGalaxyEvent("Galactic Update: Faction activities reported...", "neutral");

    // --- ECONOMIC GROWTH & SHIP BUILDING ---
    for (const faction of [FACTION_DURAN, FACTION_VINARI, FACTION_TRADER]) {
        if (!game.factions[faction]) continue;
        const income = (faction === FACTION_TRADER) ? 10000 * (game.factions[faction].ships.length || 1) : 5000 * (game.factions[faction].territory || 1);
        game.factions[faction].credits += income;

        if (faction !== FACTION_TRADER && game.factions[faction].credits > 120000 && Math.random() < 0.25) {
            let x, y, key, attempts = 0;
            do {
                x = getRandomInt(0, game.mapWidth - 1); y = getRandomInt(0, game.mapHeight - 1); key = `${x},${y}`; attempts++;
            } while (game.map[key] && attempts < 100);

            if (!game.map[key]) {
                const newShip = createNpcShip(faction, SHIP_CLASS_CRUISER);
                if (newShip) {
                    newShip.x_pos = x; newShip.y_pos = y;
                    game.npcs.push(newShip);
                    game.map[key] = { type: determineNpcMapType(faction), data: newShip };
                    if (!game.factions[faction].ships) game.factions[faction].ships = [];
                    game.factions[faction].ships.push(newShip.ship_id);
                    game.factions[faction].credits -= 100000;
                    const msg = `The ${faction} have commissioned a new Cruiser, the ${newShip.ship_name}!`;
                    displayConsoleMessage(`[FACTION NEWS] ${msg}`, "faction"); logGalaxyEvent(msg, "faction");
                }
            }
        }
    }

    // --- MILITARY & COVERT ACTIONS (DURAN VS VINARI) ---
    for (const faction of [FACTION_DURAN, FACTION_VINARI]) {
        const factionFleetIds = game.factions[faction].ships || [];
        if (factionFleetIds.length > 0 && Math.random() < factionFleetIds.length / 40) {
            const targetFactionName = faction === FACTION_DURAN ? FACTION_VINARI : FACTION_DURAN;
            const actionChoice = Math.random();

            if (actionChoice < 0.10 && factionFleetIds.length >= 2) { // 1. INVASION
                const rivalPorts = game.ports.filter(p => p.owner === targetFactionName);
                if (rivalPorts.length > 0) {
                    // ... Invasion logic ...
                }
            } else if (actionChoice < 0.25) { // 2. SABOTAGE
                const rivalOwnedPlanets = game.planets.filter(p => p.ownership === targetFactionName && p.colony.population > 1000);
                if (rivalOwnedPlanets.length > 0) {
                    // ... Sabotage logic ...
                }
            } else if (actionChoice < 0.70) { // 3. SHIP-VS-SHIP SKIRMISH
                const targetFactionFleet = game.factions[targetFactionName].ships || [];
                if (factionFleetIds.length > 0 && targetFactionFleet.length > 0) {
                    const attackerShip = game.npcs.find(n => n.ship_id === getRandomElement(factionFleetIds));
                    const defenderShip = game.npcs.find(n => n.ship_id === getRandomElement(targetFactionFleet));

                    if (attackerShip && defenderShip) {
                        const winner = (calculateEntityPower(attackerShip) > calculateEntityPower(defenderShip)) ? attackerShip : defenderShip;
                        const loser = (winner === attackerShip) ? defenderShip : attackerShip;

                        winner.kills++;
                        game.factions[winner.faction].credits += loser.bounty || 1000;
                        if (game.factions[loser.faction] && !game.factions[loser.faction].hitList.includes(winner.ship_id)) {
                            game.factions[loser.faction].hitList.push(winner.ship_id);
                        }

                        // Move to graveyard and remove from active game
                        game.deceasedNpcs.push(loser);
                        game.npcs = game.npcs.filter(n => n.ship_id !== loser.ship_id);
                        game.factions[loser.faction].ships = game.factions[loser.faction].ships.filter(id => id !== loser.ship_id);

                        const loserMapKey = `${loser.x_pos},${loser.y_pos}`;
                        if (game.map[loserMapKey] && game.map[loserMapKey].data === loser) {
                            game.map[loserMapKey] = null;
                        }

                        const wasRevengeKill = game.factions[winner.faction].hitList.includes(loser.ship_id);
                        let battleMsg = `The ${winner.faction} vessel "${winner.ship_name}" has destroyed the ${loser.faction} vessel "${loser.ship_name}"!`;
                        if (wasRevengeKill) {
                            battleMsg += ` <span style="color:yellow;">Their comm crackles: "Vengeance is ours!"</span>`;
                            game.factions[winner.faction].hitList = game.factions[winner.faction].hitList.filter(id => id !== loser.ship_id);
                        } else {
                            const deathCries = FACTION_DEATH_CRIES[loser.faction] || FACTION_DEATH_CRIES['default'];
                            battleMsg += ` <span style="color: #ffae42;">Last transmission: "${getRandomElement(deathCries)}"</span>`;
                        }
                        displayConsoleMessage(`[FACTION WAR] ${battleMsg}`, 'error');
                        logGalaxyEvent(battleMsg, 'conflict');
                    }
                }
            } else { // 4. SEIZE INDEPENDENT PORT
                const independentPorts = game.ports.filter(p => p.owner === "Independent Operators");
                if (independentPorts.length > 0) {
                    const targetPort = getRandomElement(independentPorts);
                    targetPort.owner = faction;
                    game.factions[faction].territory++;
                    const msg = `${targetPort.name} has been seized by the ${faction}! Their influence grows.`;
                    displayConsoleMessage(`[FACTION NEWS] ${msg}`, "faction");
                    logGalaxyEvent(msg, "faction");
                }
            }
        }
    }
}


function logGalaxyEvent(message, type = 'neutral') {
    const timestamp = `Turn: ${game.moveCount}`; // Use move count as a simple timestamp
    game.galaxyLog.unshift({ text: message, type: type, timestamp: timestamp });
    if (game.galaxyLog.length > game.maxGalaxyLogMessages) {
        game.galaxyLog.pop();
    }
}


