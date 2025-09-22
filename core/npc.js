// All NPC creation, movement, and interaction logic

// --- NPC Module Imports ---
import { game } from './state.js';
import { displayConsoleMessage, updateUI } from '../modules/ui.js';
import { playSoundEffect } from '../modules/audio.js';
import { handleNpcHazardImpact } from '../modules/mechanics.js';
import { FACTION_TRADER, FACTION_VINARI, FACTION_DURAN } from '../data/naming-data.js';
import { equipmentCosts, scannerModels, PLANET_MINE_COST } from '../data/game-data.js';
import { logGalaxyEvent } from '../modules/factions.js';
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
/**
 * Handles NPC mining at planets
 * @param {object} npc - The NPC ship object
 * @param {object} planet - The planet data object
 */
function handleNpcPlanetMining(npc, planet) {
    if (!npc || !planet || !planet.resources) return;

    // Check if planet has resources
    const hasResources = planet.resources.ore > 0 || planet.resources.minerals > 0 ||
                        planet.resources.organics > 0 || planet.resources.artifacts > 0;
    if (!hasResources) return;

    // Check fuel (NPCs need fuel too)
    const mineCost = PLANET_MINE_COST;
    if (npc.fuel < mineCost) return;

    // Check cargo space
    const currentCargo = Object.values(npc.inventory).reduce((sum, val) => sum + val, 0);
    let availableSpace = npc.cargoSpace - currentCargo;
    if (availableSpace <= 0) return;

    // Spend fuel
    npc.fuel -= mineCost;

    let foundSomething = false;
    let totalMined = 0;

    // Mining logic similar to player but with lower chances for NPCs
    const mineResource = (resourceName, findChance, minAmount, maxAmount) => {
        if (availableSpace > 0 && planet.resources[resourceName] > 0 && Math.random() < findChance) {
            const potentialAmount = getRandomInt(minAmount, maxAmount);
            const actualAmount = Math.min(potentialAmount, planet.resources[resourceName], availableSpace);

            if (actualAmount > 0) {
                npc.inventory[resourceName] = (npc.inventory[resourceName] || 0) + actualAmount;
                planet.resources[resourceName] -= actualAmount;
                availableSpace -= actualAmount;
                totalMined += actualAmount;
                foundSomething = true;
            }
        }
    };

    // Lower chances for NPCs to make it balanced
    mineResource('artifacts', 0.02, 1, 1);      // 2% chance (vs player's 5%)
    mineResource('organics', 0.08, 3, 8);       // 8% chance (vs player's 15%)
    mineResource('minerals', 0.15, 5, 15);      // 15% chance (vs player's 30%)
    mineResource('ore', 0.35, 25, 125);         // 35% chance (vs player's 60%)

    if (foundSomething) {
        logGalaxyEvent(`${npc.ship_name} (${npc.faction}) mined ${totalMined} resources from ${planet.name}`, 'mining');
    }
}

/**
 * Handles NPC trading at ports based on faction preferences
 * @param {object} npc - The NPC ship object
 * @param {object} portData - The port data object
 */
function handleNpcPortTrading(npc, portData) {
    console.log(`[TRADING] NPC ${npc.ship_name} (${npc.faction}) attempting to trade at port. Credits: ${npc.credits}`);
    if (!npc || !portData || npc.credits < 100) {
        console.log(`[TRADING] Trade blocked: npc=${!!npc}, portData=${!!portData}, credits=${npc?.credits}`);
        return; // Need minimum credits to trade
    }

    // Check available cargo space
    const currentCargo = Object.values(npc.inventory).reduce((sum, val) => sum + val, 0);
    const availableSpace = npc.cargoSpace - currentCargo;
    console.log(`[TRADING] Available cargo space: ${availableSpace}, cargoSpace: ${npc.cargoSpace}, currentCargo: ${currentCargo}`);

    if (availableSpace < 5) {
        console.log(`[TRADING] Not enough cargo space to trade`);
        return; // Not enough space to trade meaningfully
    }

    // Prioritize selling to offload inventory, then buy cheaper commodities
    const sellPriority = ['artifacts', 'organics', 'tech', 'minerals', 'ore', 'food']; // Sell expensive first
    const buyPriority = ['food', 'ore', 'tech']; // Buy cheap, sell expensive
    const allCommodities = ['ore', 'food', 'tech', 'minerals', 'organics', 'artifacts'];

    // Try selling first to make space and profit
    for (const commodity of sellPriority) {
        const npcStock = npc.inventory[commodity] || 0;
        console.log(`[TRADING] Checking sell ${commodity}: npcStock=${npcStock}, behavior=${portData.behavior[commodity]}, portStock=${portData.stock[commodity]}, price=${portData.buy_prices ? portData.buy_prices[commodity] : portData.prices[commodity]}`);
        // Check if port buys this commodity (either by behavior or at starport)
        const canSell = portData.behavior[commodity] === 'B' ||
                       (portData.type === 'spacePort');
        if (npcStock > 0 && canSell) {
            const price = portData.buy_prices ? portData.buy_prices[commodity] : portData.prices[commodity];
            const canAccept = portData.stock[commodity] < 1000 ? Math.min(npcStock, 1000 - portData.stock[commodity]) : npcStock;
            const quantity = canAccept; // Sell all they can to maximize space for buying
            console.log(`[TRADING] ${commodity} sell: canAccept=${canAccept}, quantity=${quantity}, price=${price}`);

            if (quantity > 0) {
                const earnings = quantity * price;

                console.log(`[TRADING] ${npc.ship_name} selling ${quantity} ${commodity} at ${price}cr each, total earnings: ${earnings}cr, credits before: ${npc.credits}`);

                // Execute trade
                npc.credits += earnings;
                npc.inventory[commodity] -= quantity;
                portData.stock[commodity] += quantity;

                console.log(`[TRADING] ${npc.ship_name} credits after: ${npc.credits}, inventory: ${JSON.stringify(npc.inventory)}`);

                // Track trading statistics
                console.log(`[TRADING] Recording sell trade: ${npc.faction} sold ${quantity} ${commodity} for ${earnings}cr`);
                if (!game.tradingStats) {
                    game.tradingStats = {};
                }
                if (!game.tradingStats[npc.faction]) {
                    game.tradingStats[npc.faction] = {
                        trades: 0,
                        totalCreditsSpent: 0,
                        totalCreditsEarned: 0,
                        commodities: {}
                    };
                }
                game.tradingStats[npc.faction].trades++;
                game.tradingStats[npc.faction].totalCreditsEarned += earnings;
                console.log(`[TRADING] Stats after sell: spent=${game.tradingStats[npc.faction].totalCreditsSpent}, earned=${game.tradingStats[npc.faction].totalCreditsEarned}, net=${game.tradingStats[npc.faction].totalCreditsEarned - game.tradingStats[npc.faction].totalCreditsSpent}`);
                if (!game.tradingStats[npc.faction].commodities[commodity]) {
                    game.tradingStats[npc.faction].commodities[commodity] = { bought: 0, sold: 0 };
                }
                game.tradingStats[npc.faction].commodities[commodity].sold += quantity;

                logGalaxyEvent(`${npc.ship_name} (${npc.faction}) sold ${quantity} ${commodity} for ${earnings}cr`, 'trade');
                return; // One trade per visit
            } else {
                console.log(`[TRADING] Cannot sell ${commodity}: quantity <= 0`);
            }
        } else {
            console.log(`[TRADING] Cannot sell ${commodity}: no stock or not buying`);
        }
    }

    // If no selling opportunities, try buying cheaper commodities
    for (const commodity of buyPriority) {
        console.log(`[TRADING] Checking buy ${commodity}: behavior=${portData.behavior[commodity]}, stock=${portData.stock[commodity]}, price=${portData.sell_prices ? portData.sell_prices[commodity] : portData.prices[commodity]}`);
        if ((portData.behavior[commodity] === 'S' || portData.type === 'spacePort') && portData.stock[commodity] > 0) {
            const price = portData.sell_prices ? portData.sell_prices[commodity] : portData.prices[commodity];
            const canAfford = Math.floor((npc.credits - 100) / price); // Leave 100 credits for equipment
            const canCarry = Math.min(availableSpace, portData.stock[commodity], Math.max(0, canAfford));
            console.log(`[TRADING] ${commodity}: canAfford=${canAfford}, canCarry=${canCarry}, price=${price}`);

            if (canCarry >= 3) { // Need meaningful quantity for profitable trade
                const quantity = getRandomInt(3, canCarry);
                const cost = quantity * price;

                console.log(`[TRADING] ${npc.ship_name} buying ${quantity} ${commodity} at ${price}cr each, total cost: ${cost}cr, credits before: ${npc.credits}`);

                // Execute trade
                npc.credits -= cost;
                npc.inventory[commodity] = (npc.inventory[commodity] || 0) + quantity;
                portData.stock[commodity] -= quantity;

                console.log(`[TRADING] ${npc.ship_name} credits after: ${npc.credits}, inventory: ${JSON.stringify(npc.inventory)}`);

                // Track trading statistics
                console.log(`[TRADING] Recording buy trade: ${npc.faction} bought ${quantity} ${commodity} for ${cost}cr`);
                if (!game.tradingStats) {
                    game.tradingStats = {};
                }
                if (!game.tradingStats[npc.faction]) {
                    game.tradingStats[npc.faction] = {
                        trades: 0,
                        totalCreditsSpent: 0,
                        totalCreditsEarned: 0,
                        commodities: {}
                    };
                }
                game.tradingStats[npc.faction].trades++;
                game.tradingStats[npc.faction].totalCreditsSpent += cost;
                if (!game.tradingStats[npc.faction].commodities[commodity]) {
                    game.tradingStats[npc.faction].commodities[commodity] = { bought: 0, sold: 0 };
                }
                game.tradingStats[npc.faction].commodities[commodity].bought += quantity;

                logGalaxyEvent(`${npc.ship_name} (${npc.faction}) bought ${quantity} ${commodity} for ${cost}cr`, 'trade');
                return; // One trade per visit
            } else {
                console.log(`[TRADING] Cannot buy ${commodity}: canCarry < 5`);
            }
        } else {
            console.log(`[TRADING] Cannot buy ${commodity}: not selling or no stock`);
        }
    }
    console.log(`[TRADING] No trading opportunities found for ${npc.ship_name}`);
}


/**
 * Handles the random movement of all active NPCs on the map.
 */
export function moveNPCs() {
    // Create a copy of the npcs array to iterate, as it might be modified during the loop (if NPCs are destroyed)
    const npcsToProcess = [...game.npcs];
    let anyNpcMoved = false;

    npcsToProcess.forEach(npc => {
        // Ensure NPC is still in the active game.npcs array (might have been destroyed by another NPC or earlier hazard)
        if (!game.npcs.includes(npc)) return;

        if (Math.random() < 0.3) { // 30% chance to move
            const directions = ['up', 'down', 'left', 'right'];
            const dir = getRandomElement(directions);
            let newX = npc.x_pos, newY = npc.y_pos;
            const fuelCost = 1;

            // Check if NPC has enough fuel
            if (npc.fuel < fuelCost) {
                console.log(`[MOVEMENT] ${npc.ship_name} cannot move: insufficient fuel (${npc.fuel})`);
                return;
            }

            if (dir === 'up' && newY > 0) newY--;
            else if (dir === 'down' && newY < game.mapHeight - 1) newY++;
            else if (dir === 'left' && newX > 0) newX--;
            else if (dir === 'right' && newX < game.mapWidth - 1) newX++;
            else return; // Cannot move in that direction or hit map edge

            // Check for no actual movement
            if (newX === npc.x_pos && newY === npc.y_pos) return; // No actual movement

            // Consume fuel
            npc.fuel -= fuelCost;
            console.log(`[MOVEMENT] ${npc.ship_name} moved ${dir} to (${newX},${newY}), fuel remaining: ${npc.fuel}`);
            anyNpcMoved = true;

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
            if (!targetSectorContent || ['empty', 'star', 'npc_trader', 'vinari_ship', 'duran_ship', 'port', 'spacePort'].includes(targetSectorContent.type)) {
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

                // Check for trading at ports, mining at planets, or upgrades at spaceports
                // Use the NEW sector content since the NPC has moved
                const newSectorContent = game.map[newKey];
                console.log(`[MOVEMENT] NPC ${npc.ship_name} moved to sector (${newX},${newY}), content type: ${newSectorContent?.type}`);

                if (newSectorContent && newSectorContent.type === 'port') {
                    console.log(`[MOVEMENT] NPC ${npc.ship_name} landed on port, calling trading function`);
                    // NPC trading at regular ports
                    handleNpcPortTrading(npc, newSectorContent.data);
                } else if (newSectorContent && newSectorContent.type === 'planet') {
                    console.log(`[MOVEMENT] NPC ${npc.ship_name} landed on planet, calling mining function`);
                    // NPC mining at planets
                    handleNpcPlanetMining(npc, newSectorContent.data);
                } else if (newSectorContent && newSectorContent.type === 'spacePort') {
                    // Track docking statistics
                    if (!game.dockingStats) game.dockingStats = {};
                    if (!game.dockingStats[npc.faction]) {
                        game.dockingStats[npc.faction] = { visits: 0, upgrades: 0 };
                    }
                    game.dockingStats[npc.faction].visits++;

                    handleNpcUpgrades(npc);
                }
            }
        }
    });
    return anyNpcMoved;
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

/**
 * Handles NPC equipment upgrades at spaceports based on faction priorities
 * @param {object} npc - The NPC ship object
 */
export function handleNpcUpgrades(npc) {
    console.log(`[UPGRADE] NPC ${npc.ship_name} (${npc.faction}) attempting upgrades at spaceport. Credits: ${npc.credits}, fuel: ${npc.fuel}, shields: ${npc.shields}/${npc.maxShields}, hull: ${npc.hull}/${npc.maxHull}`);
    if (!npc || npc.faction === 'Player') {
        console.log(`[UPGRADE] Upgrade blocked: invalid npc or player faction`);
        return;
    }

    const sector = game.map[`${npc.x_pos},${npc.y_pos}`];
    if (!sector || sector.type !== 'spacePort') {
        console.log(`[UPGRADE] Not at spaceport: sector type=${sector?.type}`);
        return;
    }

    // Dynamic upgrade logic based on needs and faction goals

    // Always check fuel if low
    if (npc.fuel < 30) {
        console.log(`[UPGRADE] Low fuel, attempting fuel upgrade`);
        tryNpcUpgrade(npc, 'fuel');
    }

    // Check safety needs
    let safetyUpgrade = null;
    if (npc.shields < npc.maxShields * 0.75) {
        safetyUpgrade = 'shields';
        console.log(`[UPGRADE] Low shields, safety upgrade: shields`);
    } else if (npc.hull < npc.maxHull * 0.75) {
        safetyUpgrade = 'hull';
        console.log(`[UPGRADE] Low hull, safety upgrade: hull`);
    }

    if (safetyUpgrade) {
        tryNpcUpgrade(npc, safetyUpgrade);
    } else {
        console.log(`[UPGRADE] Safe, checking faction goals for ${npc.faction}`);
        // Safe enough, focus on faction goals or maxing safety
        if (npc.faction === FACTION_VINARI) {
            // Vinari: Tech focus - reorder priorities to cheaper upgrades first
            if (npc.cloakEnergy < npc.maxCloakEnergy) {
                console.log(`[UPGRADE] Vinari cloak upgrade needed`);
                tryNpcUpgrade(npc, 'cloakEnergy');
            } else if (npc.scanner.model !== 'Advanced') {
                console.log(`[UPGRADE] Vinari scanner upgrade needed`);
                tryNpcUpgrade(npc, 'scanner');
            } else if (npc.shields < npc.maxShields) {
                console.log(`[UPGRADE] Vinari maxing shields`);
                tryNpcUpgrade(npc, 'shields');
            } else if (npc.hull < npc.maxHull) {
                console.log(`[UPGRADE] Vinari maxing hull`);
                tryNpcUpgrade(npc, 'hull');
            } else if ((npc.computerLevel || 1) < 5) { // Limit computer upgrades to level 5 for affordability
                console.log(`[UPGRADE] Vinari computer upgrade needed`);
                tryNpcUpgrade(npc, 'computer');
            }
        } else if (npc.faction === FACTION_DURAN) {
            // Duran: Combat focus
            if (npc.fighters < npc.maxFighters) {
                console.log(`[UPGRADE] Duran fighters upgrade needed`);
                tryNpcUpgrade(npc, 'fighters');
            } else if (npc.missiles < npc.maxMissiles) {
                console.log(`[UPGRADE] Duran missiles upgrade needed`);
                tryNpcUpgrade(npc, 'missiles');
            } else if (npc.mines < npc.maxMines) {
                console.log(`[UPGRADE] Duran mines upgrade needed`);
                tryNpcUpgrade(npc, 'mines');
            } else {
                // Max shields/hull
                if (npc.shields < npc.maxShields) {
                    console.log(`[UPGRADE] Duran maxing shields`);
                    tryNpcUpgrade(npc, 'shields');
             } else if (npc.hull < npc.maxHull) {
                 console.log(`[UPGRADE] Duran maxing hull`);
                 tryNpcUpgrade(npc, 'hull');
             } else if ((npc.computerLevel || 1) < 5) {
                 console.log(`[UPGRADE] Duran computer upgrade needed`);
                 tryNpcUpgrade(npc, 'computer');
             }
            }
        } else if (npc.faction === FACTION_TRADER) {
            // Trader: Profit focus
            if (npc.cargoSpace < npc.maxCargoSpace) {
                console.log(`[UPGRADE] Trader cargo upgrade needed`);
                tryNpcUpgrade(npc, 'cargoSpace');
            } else if (npc.scanner.model !== 'Advanced') {
                console.log(`[UPGRADE] Trader scanner upgrade needed`);
                tryNpcUpgrade(npc, 'scanner');
            } else {
                // Max shields/hull
                if (npc.shields < npc.maxShields) {
                    console.log(`[UPGRADE] Trader maxing shields`);
                    tryNpcUpgrade(npc, 'shields');
                 } else if (npc.hull < npc.maxHull) {
                     console.log(`[UPGRADE] Trader maxing hull`);
                     tryNpcUpgrade(npc, 'hull');
                 } else if ((npc.computerLevel || 1) < 5) {
                     console.log(`[UPGRADE] Trader computer upgrade needed`);
                     tryNpcUpgrade(npc, 'computer');
                 }
            }
        }
    }

    // Optional: Buy warp if safe and affordable
    if (npc.warpDrive !== 'Installed' && npc.credits > 6000) { // Leave some credits
        console.log(`[UPGRADE] Attempting warp drive purchase`);
        tryNpcUpgrade(npc, 'warp');
    }

    console.log(`[UPGRADE] Upgrade attempts completed for ${npc.ship_name}`);
}

/**
 * Attempts to upgrade a specific equipment type for an NPC
 * @param {object} npc - The NPC ship object
 * @param {string} equipType - The equipment type to upgrade
 * @returns {boolean} - True if upgrade was successful
 */
function tryNpcUpgrade(npc, equipType) {
    let cost = 0;
    let canUpgrade = false;
    let upgradeDesc = '';

    if (equipType === 'scanner') {
        // Scanner upgrade logic
        const currentModel = npc.scanner.model;
        let nextModel = null;
        if (currentModel === 'Basic') nextModel = 'Standard';
        else if (currentModel === 'Standard') nextModel = 'Advanced';

        if (nextModel && scannerModels[nextModel]) {
            cost = scannerModels[nextModel].cost;
            if (npc.credits >= cost) {
                canUpgrade = true;
                upgradeDesc = `scanner to ${nextModel}`;
                // Perform upgrade
                npc.credits -= cost;
                npc.scanner = { model: nextModel, range: scannerModels[nextModel].range };
            }
        }
    } else if (equipType === 'computer') {
        // Computer upgrade logic
        const currentLevel = npc.computerLevel || 1;
        const maxLevel = 10;
        if (currentLevel < maxLevel) {
            cost = currentLevel * 10000 + 5000; // Same as player
            if (npc.credits >= cost) {
                canUpgrade = true;
                upgradeDesc = `computer to level ${currentLevel + 1}`;
                npc.credits -= cost;
                npc.computerLevel = currentLevel + 1;
            }
        }
    } else if (equipType === 'warp') {
        // Warp drive purchase
        if (npc.warpDrive !== 'Installed') {
            cost = 5000; // Same as player
            if (npc.credits >= cost) {
                canUpgrade = true;
                upgradeDesc = 'warp drive';
                npc.credits -= cost;
                npc.warpDrive = 'Installed';
            }
        }
    } else {
        // Regular equipment
        const equipInfo = equipmentCosts[equipType];
        if (!equipInfo) return false;

        const currentAmount = npc[equipType] || 0;
        const maxAmount = npc[equipInfo.max] || Infinity;

        // Check if upgrade is possible
        if (currentAmount >= maxAmount || npc.credits < equipInfo.cost) {
            return false;
        }

        cost = equipInfo.cost;
        canUpgrade = true;
        upgradeDesc = `${equipType} (+${equipInfo.amount})`;

        // Perform upgrade
        npc.credits -= cost;
        if (equipType === 'fuel') {
            // Fuel is special - refill to max
            npc.fuel = Math.min(npc.maxFuel, npc.fuel + equipInfo.amount);
        } else {
            npc[equipType] += equipInfo.amount;
            // Ensure we don't exceed max
            npc[equipType] = Math.min(npc[equipType], maxAmount);
        }
    }

    if (canUpgrade) {
        logGalaxyEvent(`${npc.ship_name} (${npc.faction}) upgraded ${upgradeDesc} for ${cost}cr`, 'info');

        // Track successful upgrades
        if (!game.dockingStats[npc.faction]) {
            game.dockingStats[npc.faction] = { visits: 0, upgrades: 0 };
        }
        game.dockingStats[npc.faction].upgrades++;

        return true;
    }

    // Debug: Log why upgrade failed
    console.log(`${npc.ship_name} cannot upgrade ${equipType}: cost=${cost}, credits=${npc.credits}, canUpgrade=${canUpgrade}`);
    return false;
}