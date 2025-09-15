// A function to set up the initial state of all factions
// ES6 Module export
export function initializeFactionData() {
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
// Moved to core/npc.js


// Placeholder function for trading with NPC (Not Implemented yet)
// Moved to core/npc.js


/**
 * Handles the random movement of all active NPCs on the map.
 */
// Moved to core/npc.js


// Moved to core/npc.js


/**
 * Handles faction income generation and ship building.
 * This function should be called periodically (e.g., every 10 turns).
 */
function processFactionIncomeAndBuilding() {
    logGalaxyEvent("Galactic Update: Faction income and building activities reported...", "neutral");

    for (const faction of [FACTION_DURAN, FACTION_VINARI, FACTION_TRADER]) {
        if (!game.factions[faction]) continue;

        // Income Generation
        const income = (faction === FACTION_TRADER) ? 10000 * (game.factions[faction].ships.length || 1) : 5000 * (game.factions[faction].territory || 1);
        game.factions[faction].credits += income;

        // Ship Commissioning (Duran & Vinari only for combat ships)
        if (faction !== FACTION_TRADER && game.factions[faction].credits > 100000 && Math.random() < 0.4) {
            let x, y, key, attempts = 0;
            do {
                x = getRandomInt(0, game.mapWidth - 1); y = getRandomInt(0, game.mapHeight - 1); key = `${x},${y}`; attempts++;
            } while (game.map[key] && attempts < 100);

            if (!game.map[key]) {
                const combatClasses = [SHIP_CLASS_INTERCEPTOR, SHIP_CLASS_FRIGATE, SHIP_CLASS_CRUISER, SHIP_CLASS_BATTLESHIP, SHIP_CLASS_CAPITAL];
                const availableCombatArchetypes = Object.keys(NPC_ARCHETYPES[faction]).filter(cls => combatClasses.includes(cls));

                if (availableCombatArchetypes.length > 0) {
                    const newShipClassToCommission = getRandomElement(availableCombatArchetypes);
                    const newShip = createNpcShip(faction, newShipClassToCommission);
                    if (newShip) {
                        newShip.x_pos = x; newShip.y_pos = y;
                        game.npcs.push(newShip);
                        game.map[key] = { type: determineNpcMapType(faction), data: newShip };
                        if (!game.factions[faction].ships) game.factions[faction].ships = [];
                        game.factions[faction].ships.push(newShip.ship_id);
                        game.factions[faction].credits -= (shipClasses[NPC_ARCHETYPES[faction][newShipClassToCommission][0]]?.price || 50000);
                        const msg = `The ${faction} have commissioned a new ${newShip.ship_class}, the ${newShip.ship_name}!`;
                        displayConsoleMessage(`[FACTION NEWS] ${msg}`, "faction");
                        logGalaxyEvent(msg, "faction");
                    }
                }
            }
        }
    }
}


/**
 * Processes a single action for a given faction.
 * This function should be called periodically for each faction (e.g., every 5 turns).
 * @param {string} faction - The faction (e.g., FACTION_DURAN, FACTION_VINARI, FACTION_TRADER).
 */
function processFactionAction(faction) {
    const factionFleetIds = game.factions[faction].ships || [];
    if (factionFleetIds.length === 0) return; // Faction needs ships to perform actions

    // Determine target faction for the current acting faction
    let targetFactionName = null;
    if (faction === FACTION_DURAN) {
        targetFactionName = FACTION_VINARI;
    } else if (faction === FACTION_VINARI) {
        targetFactionName = FACTION_DURAN;
    } else if (faction === FACTION_TRADER) {
        targetFactionName = Math.random() < 0.5 ? FACTION_DURAN : FACTION_VINARI;
    }
    if (!targetFactionName) return; // Should not happen with current setup

    // Roll for action type based on faction's probabilities
    let actionType = null;
    const actionRoll = Math.random();
    let cumulativeProbability = 0;

    // Get probabilities for the current faction
    const factionProbs = FACTION_ACTION_PROBABILITIES[faction];
    if (!factionProbs) return; // Faction probabilities not defined

    // Loop through possible action types and assign action if roll is within range
    for (const type in factionProbs) {
        cumulativeProbability += factionProbs[type];
        if (actionRoll < cumulativeProbability) {
            actionType = type;
            break;
        }
    }

    if (!actionType) return; // No action rolled

    let msg = "";
    switch (actionType) {
        case 'invasion':
            if (factionFleetIds.length < 2) return; // Needs minimum forces for invasion
            const rivalPorts = game.ports.filter(p => p.owner === targetFactionName);
        if (rivalPorts.length === 0) return;

        const targetPort = getRandomElement(rivalPorts);
        const attackingShip = game.npcs.find(n => n.ship_id === getRandomElement(factionFleetIds));
        if (!attackingShip) return;

        const invasionStrength = calculateEntityPower(attackingShip);
        const portDefenseStrength = (targetPort.securityLevel * 1000) + targetPort.bounty;
        const successChance = Math.max(0.1, Math.min(0.9, invasionStrength / (invasionStrength + portDefenseStrength + 1000)));

        if (Math.random() < successChance) {
            game.factions[targetFactionName].territory = Math.max(0, game.factions[targetFactionName].territory - 1);
            targetPort.owner = faction;
            game.factions[faction].territory++;
            msg = `The ${faction} successfully **invaded and seized** ${targetPort.name} (${targetPort.x},${targetPort.y}) from the ${targetFactionName}! Their influence grows.`;
            displayConsoleMessage(`[FACTION WAR] ${msg}`, 'faction');
            logGalaxyEvent(msg, 'conflict');
        } else {
            const shipsLost = getRandomInt(1, Math.min(3, factionFleetIds.length / 2));
            for(let i = 0; i < shipsLost; i++) {
                const lostShipId = getRandomElement(factionFleetIds);
                const lostShip = game.npcs.find(n => n.ship_id === lostShipId);
                if (lostShip) {
                    game.npcs = game.npcs.filter(n => n.ship_id !== lostShip.ship_id);
                    game.deceasedNpcs.push(lostShip);
                    game.factions[faction].ships = game.factions[faction].ships.filter(id => id !== lostShip.ship_id);
                    const lostShipMapKey = `${lostShip.x_pos},${lostShip.y_pos}`;
                    if (game.map[lostShipMapKey] && game.map[lostShipMapKey].data === lostShip) {
                        game.map[lostShipMapKey] = null;
                    }
                }
            }
            msg = `The ${faction} **failed** their invasion of ${targetPort.name} (${targetPort.x},${targetPort.y}) and retreated after heavy losses (${shipsLost} ships lost)!`;
            displayConsoleMessage(`[FACTION WAR] ${msg}`, 'error');
            logGalaxyEvent(msg, 'conflict');
        }
        break;

        case 'economicSabotage':
            const rivalPortsForEcoSabotage = game.ports.filter(p => p.owner === targetFactionName);
            if (rivalPortsForEcoSabotage.length === 0) return;

            const targetPortEco = getRandomElement(rivalPortsForEcoSabotage);
        const attackingShipEco = game.npcs.find(n => n.ship_id === getRandomElement(factionFleetIds));
        if (!attackingShipEco) return;

        const sabotageStrengthEco = attackingShipEco.computerLevel || 1;
        const portSecurityEco = targetPortEco.securityLevel || 0;
        const successChanceEco = Math.max(0.1, Math.min(0.9, sabotageStrengthEco / (sabotageStrengthEco + portSecurityEco + 1)));

        if (Math.random() < successChanceEco) {
            const stolenCredits = getRandomInt(1000, 10000);
            targetPortEco.credits = Math.max(0, targetPortEco.credits - stolenCredits);
            const commodityToHit = getRandomElement(commodities);
            const stockLost = getRandomInt(50, 200);
            targetPortEco.stock[commodityToHit] = Math.max(0, targetPortEco.stock[commodityToHit] - stockLost);
            msg = `[COVERT OPS] ${faction} operatives **crippled the economy** of ${targetPortEco.name} (${targetPortEco.x},${targetPortEco.y})! Lost ${stolenCredits} credits & ${stockLost} ${commodityToHit}.`;
            displayConsoleMessage(msg, 'error');
            logGalaxyEvent(msg, 'conflict');
        } else {
            const creditFine = getRandomInt(500, 2500);
            game.factions[faction].credits = Math.max(0, game.factions[faction].credits - creditFine);
            msg = `[COVERT OPS] ${faction} **failed** economic sabotage on ${targetPortEco.name} (${targetPortEco.x},${targetPortEco.y}) and was fined ${creditFine} credits.`;
            displayConsoleMessage(msg, 'info');
            logGalaxyEvent(msg, 'conflict');
        }
        break;

        case 'militarySabotage':
            const rivalInstallationsForMilSabotage = game.ports.filter(p => p.owner === targetFactionName && (p.isStation || p.securityLevel > 0));
            const rivalPlanetsForMilSabotage = game.planets.filter(p => p.ownership === targetFactionName && p.defenses.level > 0);

            const militaryTargets = [...rivalInstallationsForMilSabotage, ...rivalPlanetsForMilSabotage];

            if (militaryTargets.length === 0) return;

            const targetMil = getRandomElement(militaryTargets);
        const attackingShipMil = game.npcs.find(n => n.ship_id === getRandomElement(factionFleetIds));
        if (!attackingShipMil) return;

        const sabotageStrengthMil = attackingShipMil.computerLevel || 1;
        let targetDefenseMil = 0;
        if (targetMil.type === 'port' || targetMil.type === 'spacePort') {
            targetDefenseMil = targetMil.securityLevel || 0;
        } else if (targetMil.type === 'planet') {
            targetDefenseMil = targetMil.defenses.level || 0;
        }
        const successChanceMil = Math.max(0.1, Math.min(0.9, sabotageStrengthMil / (sabotageStrengthMil + targetDefenseMil + 1)));

        if (Math.random() < successChanceMil) {
            if (targetMil.type === 'port' || targetMil.type === 'spacePort') {
                targetMil.securityLevel = Math.max(0, targetMil.securityLevel - getRandomInt(1, 2));
                targetMil.fighterSquadrons = Math.max(0, targetMil.fighterSquadrons - getRandomInt(1, 3));
                msg = `[COVERT OPS] ${faction} **disrupted military defenses** on ${targetMil.name} (${targetMil.x},${targetMil.y})! Security reduced.`;
            } else if (targetMil.type === 'planet') {
                targetMil.defenses.level = Math.max(0, targetMil.defenses.level - getRandomInt(1, 2));
                targetMil.colony.population = Math.max(0, targetMil.colony.population - Math.floor(targetMil.colony.population * getRandomInt(1,5)/100));
                msg = `[COVERT OPS] ${faction} **sabotaged defenses** on ${targetMil.name} (${targetMil.x},${targetMil.y})! Defense level reduced.`;
            }
            displayConsoleMessage(msg, 'error');
            logGalaxyEvent(msg, 'conflict');
        } else {
            const lostShipChance = Math.random();
            if (lostShipChance < 0.3 && factionFleetIds.length > 0) {
                const lostShipId = getRandomElement(factionFleetIds);
                const lostShip = game.npcs.find(n => n.ship_id === lostShipId);
                if (lostShip) {
                    game.npcs = game.npcs.filter(n => n.ship_id !== lostShip.ship_id);
                    game.deceasedNpcs.push(lostShip);
                    game.factions[faction].ships = game.factions[faction].ships.filter(id => id !== lostShip.ship_id);
                    const lostShipMapKey = `${lostShip.x_pos},${lostShip.y_pos}`;
                    if (game.map[lostShipMapKey] && game.map[lostShipMapKey].data === lostShip) {
                        game.map[lostShipMapKey] = null;
                    }
                    msg = `[COVERT OPS] ${faction} **failed** military sabotage on ${targetMil.name} (${targetMil.x},${targetMil.y})! One ship was lost: ${lostShip.ship_name}.`;
                }
            } else {
                const virusInfectionChance = 0.5;
                if (Math.random() < virusInfectionChance) {
                    const randomVirusType = getRandomElement(virusTypes);
                    if (!game.player.viruses.some(v => v.name === randomVirusType.name)) {
                        game.player.viruses.push({ ...randomVirusType, duration: randomVirusType.duration });
                        msg = `[COVERT OPS] ${faction} **failed** military sabotage on ${targetMil.name} (${targetMil.x},${targetMil.y})! Their systems were infected with the "${randomVirusType.name}" virus.`;
                    } else {
                        msg = `[COVERT OPS] ${faction} **failed** military sabotage on ${targetMil.name} (${targetMil.x},${targetMil.y}).`;
                    }
                } else {
                    msg = `[COVERT OPS] ${faction} **failed** military sabotage on ${targetMil.name} (${targetMil.x},${targetMil.y}).`;
                }
            }
            displayConsoleMessage(msg, 'info');
            logGalaxyEvent(msg, 'conflict');
        }
        break;

        case 'shipSkirmish': // Renamed from 'ship_skirmish' to match constant
            const targetFactionFleet = game.factions[targetFactionName].ships || [];
            if (factionFleetIds.length === 0 || targetFactionFleet.length === 0) return; // Ensure both sides have ships

            const attackerShip = game.npcs.find(n => n.ship_id === getRandomElement(factionFleetIds));
        const defenderShip = game.npcs.find(n => n.ship_id === getRandomElement(targetFactionFleet));

        if (!attackerShip || !defenderShip) return;

        const attackerPower = calculateEntityPower(attackerShip);
        const defenderPower = calculateEntityPower(defenderShip);

        let winner = null;
        let loser = null;

        if (Math.random() * (attackerPower + defenderPower) < attackerPower * 1.1) {
            winner = attackerShip;
            loser = defenderShip;
        } else {
            winner = defenderShip;
            loser = attackerShip;
        }

        const damageMultiplier = Math.max(0.2, Math.min(0.7, Math.abs(attackerPower - defenderPower) / Math.max(attackerPower, defenderPower)));
        const damageTakenByLoser = Math.floor(loser.max_hull * damageMultiplier) + getRandomInt(100, 300);
        const damageTakenByWinner = Math.floor(winner.max_hull * damageMultiplier * 0.2) + getRandomInt(20, 100);

        winner.takeDamage(damageTakenByWinner);
        loser.takeDamage(damageTakenByLoser);

        if (loser.current_hull <= 0) {
            winner.kills++;
            game.factions[winner.faction].credits += loser.bounty || 1000;
            if (game.factions[loser.faction] && !game.factions[loser.faction].hitList.includes(winner.ship_id)) {
                game.factions[loser.faction].hitList.push(winner.ship_id);
            }

            game.deceasedNpcs.push(loser);
            game.npcs = game.npcs.filter(n => n.ship_id !== loser.ship_id);
            game.factions[loser.faction].ships = game.factions[loser.faction].ships.filter(id => id !== loser.ship_id);

            const loserMapKey = `${loser.x_pos},${loser.y_pos}`;
            if (game.map[loserMapKey] && game.map[loserMapKey].data === loser) {
                game.map[loserMapKey] = null;
            }

            const wasRevengeKill = game.factions[winner.faction].hitList.includes(loser.ship_id);
            msg = `The ${winner.faction} vessel "${winner.ship_name}" has destroyed the ${loser.faction} vessel "${loser.ship_name}"!`;
            if (wasRevengeKill) {
                msg += ` <span style="color:yellow;">Their comm crackles: "Vengeance is ours!"</span>`;
                game.factions[winner.faction].hitList = game.factions[winner.faction].hitList.filter(id => id !== loser.ship_id);
            } else {
                const deathCries = FACTION_DEATH_CRIES[loser.faction] || FACTION_DEATH_CRIES['default'];
                msg += ` <span style="color: #ff4040;">Last transmission: "${getRandomElement(deathCries)}"</span>`;
            }
            displayConsoleMessage(`[FACTION WAR] ${msg}`, 'error');
            logGalaxyEvent(msg, 'conflict');
        } else {
            msg = `A skirmish between the ${winner.faction} "${winner.ship_name}" and ${loser.faction} "${loser.ship_name}"! The ${loser.faction} ship took ${damageTakenByLoser} damage and retreated.`;
            displayConsoleMessage(`[FACTION WAR] ${msg}`, 'info');
            logGalaxyEvent(msg, 'conflict');
        }
        break;

        case 'seizeIndependentPort': // Renamed from 'seize_independent_port' to match constant
            const independentPorts = game.ports.filter(p => p.owner === "Independent Operators");
            if (independentPorts.length === 0) return;

            const targetPortInd = getRandomElement(independentPorts);
        const successChanceInd = Math.random() < 0.75;

        if (successChanceInd) {
            targetPortInd.owner = faction;
            game.factions[faction].territory++;
            msg = `${targetPortInd.name} (${targetPortInd.x},${targetPortInd.y}) has been seized by the ${faction}! Their influence grows.`;
            displayConsoleMessage(`[FACTION NEWS] ${msg}`, "faction");
            logGalaxyEvent(msg, "faction");
        } else {
            msg = `The ${faction} attempted to seize ${targetPortInd.name} (${targetPortInd.x},${targetPortInd.y}) but failed.`;
            displayConsoleMessage(`[FACTION NEWS] ${msg}`, "info");
            logGalaxyEvent(msg, "faction");
        }
        break;
    }
}


function logGalaxyEvent(message, type = 'neutral') {
    const timestamp = `Turn: ${game.moveCount}`; // Use move count as a simple timestamp
    game.galaxyLog.unshift({ text: message, type: type, timestamp: timestamp });
    if (game.galaxyLog.length > game.maxGalaxyLogMessages) {
        game.galaxyLog.pop();
    }
}


