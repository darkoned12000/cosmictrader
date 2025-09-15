// --- planets.js ---

// --- Planets Module Imports ---
import { game } from '../core/state.js';
import { displayConsoleMessage, updateUI } from './ui.js';
import { playSoundEffect } from './audio.js';
import { getRandomInt } from '../core/utilities.js';
import { logGalaxyEvent } from './factions.js';

// Generates the flavor text description for a planet
export function generatePlanetDescription(planet) {
    let desc = `The planet ${planet.name} is a ${planet.planetType} world. `;

    if (planet.temperature > 400) {
        desc += `Its surface is a hellish landscape, roasting under a ${planet.atmosphere} atmosphere. `;
    } else if (planet.temperature < -50) {
        desc += `Frigid winds howl across its frozen surface, where the thin ${planet.atmosphere} atmosphere offers little protection. `;
    } else {
        desc += `It enjoys a temperate climate with a breathable ${planet.atmosphere} atmosphere. `;
    }

    if (planet.lifeSigns === 'Yes' && planet.habitationSigns === 'Yes') {
        desc += "Scanners confirm the presence of both native lifeforms and sophisticated habitations, suggesting a thriving colony or civilization. ";
    } else if (planet.lifeSigns === 'Yes') {
        desc += "While teeming with indigenous life, there are no signs of intelligent, space-faring inhabitants. ";
    } else if (planet.habitationSigns === 'Yes') {
        desc += "Readings indicate artificial structures, but curiously, no organic life signs, perhaps suggesting a robotic or automated outpost. ";
    } else {
        desc += "The planet appears to be a barren, lifeless rock. ";
    }

    if (planet.ownership !== "Unclaimed") {
        desc += `The system is currently claimed by the ${planet.ownership}.`;
    }

    return desc;
}

// --- Action Handler Functions ---

export function handleScanPlanet() {
    const scanCost = 5;
    if (game.player.ship.fuel >= scanCost) {
        game.player.ship.fuel -= scanCost;
        const planetToScan = game.map[`${game.player.x},${game.player.y}`].data;
        planetToScan.isScanned = true;
        displayConsoleMessage(`Detailed scan of ${planetToScan.name} complete. Sector data updated.`, "success");
        playSoundEffect('upgrade');
        updateUI();
    } else {
        displayConsoleMessage(`Not enough fuel to perform a detailed scan. Requires ${scanCost} fuel.`, "error");
    }
}


export function handleMinePlanet() {
    // STEP 1: Get the planet object from the map first.
    const currentSector = game.map[`${game.player.x},${game.player.y}`];
    if (!currentSector || !currentSector.data) {
        displayConsoleMessage("No planet found at current location.", "error");
        return;
    }
    const planet = currentSector.data;

    // STEP 2: Check if the planet is depleted.
    if (planet && planet.resources) { // Added a check for planet itself
        const res = planet.resources;
        if (res.ore <= 0 && res.minerals <= 0 && res.organics <= 0 && res.artifacts <= 0) {
            displayConsoleMessage("Our scans show this planet's resources have been fully depleted.", "warning");
            return;
        }
    } else if (!planet) {
        // Safety check in case there's no planet data
        displayConsoleMessage("Error: Cannot find planet data in this sector.", "error");
        return;
    }

    // STEP 3: Check for fuel and cargo space.
    const mineCost = 10;
    if (game.player.ship.fuel < mineCost) {
        displayConsoleMessage(`Not enough fuel for a mining expedition. Requires ${mineCost} fuel.`, "error");
        return;
    }

    const currentCargo = Object.values(game.player.inventory).reduce((a, b) => a + b, 0);
    let availableSpace = game.player.ship.cargoSpace - currentCargo;

    if (availableSpace <= 0) {
        displayConsoleMessage("Cargo hold is full. Cannot retrieve any more resources.", "warning");
        return;
    }

    // STEP 4: Proceed with mining now that all checks have passed.
    game.player.ship.fuel -= mineCost;

    let foundSomething = false;
    let messages = [];

    const findResource = (resourceName, findChance, minAmount, maxAmount) => {
        if (availableSpace > 0 && planet.resources[resourceName] > 0 && Math.random() < findChance) {
            const potentialAmount = getRandomInt(minAmount, maxAmount);
            const actualAmount = Math.min(potentialAmount, planet.resources[resourceName], availableSpace);

            if (actualAmount > 0) {
                game.player.inventory[resourceName] += actualAmount;
                planet.resources[resourceName] -= actualAmount;
                availableSpace -= actualAmount;
                messages.push(`Retrieved ${actualAmount} units of ${resourceName.charAt(0).toUpperCase() + resourceName.slice(1)}.`);
                foundSomething = true;
            }
        }
    };

    findResource('artifacts', 0.05, 1, 1);
    findResource('organics', 0.15, 5, 15);
    findResource('minerals', 0.30, 10, 30);
    findResource('ore', 0.60, 50, 250);

    if (foundSomething) {
        displayConsoleMessage(`Mining operation successful! ${messages.join(' ')}`, "success");
        playSoundEffect('trade_buy');
    } else {
        displayConsoleMessage("Mining expedition found nothing of value this time.", "minor");
    }

    if (availableSpace <= 0) {
        displayConsoleMessage("Cargo hold is now full.", "info");
    }

    updateUI();
}

export function handleClaimPlanet() {
    const claimCost = 25000;
    if (game.player.credits >= claimCost) {
        if (confirm(`Claim ${game.map[`${game.player.x},${game.player.y}`].data.name} for ${claimCost} credits?`)) {
            game.player.credits -= claimCost;
            const planetToClaim = game.map[`${game.player.x},${game.player.y}`].data;
            planetToClaim.ownership = game.player.name;
            // Determine the name to display in the message.
            const msg = `${planetToClaim.ownership} is now the official administrator of ${planetToClaim.name}.`;
            displayConsoleMessage(msg, "success", "ship_bought");
            logGalaxyEvent(msg, "player_action");
            updateUI();
        }
    } else {
        displayConsoleMessage(`You cannot afford to claim this planet. Requires ${claimCost} credits.`, "error");
    }
}


export function handleLaunchInvasion() {
    const planet = game.map[`${game.player.x},${game.player.y}`].data;
    const playerForces = game.player.ship.gndForces;

    if (playerForces <= 0) {
        displayConsoleMessage("Cannot launch invasion without Ground Forces.", "error");
        return;
    }

    // --- Calculate Total Defense Strength ---
    const militaryDefense = planet.defenses.level * 25; // Each defense level is worth 25 professional forces
    const populationDefense = Math.floor(planet.colony.population / 10000); // Every 10,000 people contribute 1 defense point
    const totalDefenseStrength = militaryDefense + populationDefense;

    // Prevent invasion if defenses are overwhelming
    if (totalDefenseStrength > playerForces * 5) {
        displayConsoleMessage(`Planetary defenses are overwhelming. Your ${playerForces} forces are no match for their estimated strength of ${totalDefenseStrength}. Invasion is impossible.`, "error");
        return;
    }

    const warningMsg = `WARNING: Launching an invasion against ${planet.name} (Est. Defense: ${totalDefenseStrength}) is a major act of war against the ${planet.ownership}. Proceed?`;
    if (!confirm(warningMsg)) {
        displayConsoleMessage("Invasion aborted.", "info");
        return;
    }

    const successChance = 0.5 + ((playerForces - totalDefenseStrength) / (playerForces + totalDefenseStrength + 1));
    const finalSuccessChance = Math.max(0.05, Math.min(0.95, successChance)); // Clamp between 5% and 95%

    displayConsoleMessage(`Launching invasion... Your ${playerForces} forces engage the planet's total defense strength of ${totalDefenseStrength}. Success chance: ${Math.round(finalSuccessChance*100)}%`, "warning");

    if (Math.random() < finalSuccessChance) {
        // --- INVASION SUCCESS ---
        // Losses are based on the strength of the defense you overcame
        const forcesLost = Math.max(1, Math.ceil(totalDefenseStrength / 4) + getRandomInt(0, Math.floor(playerForces * 0.1)));
        game.player.ship.gndForces = Math.max(0, playerForces - forcesLost);

        const originalOwner = planet.ownership;
        const populationLost = Math.floor(planet.colony.population * getRandomInt(10, 30) / 100); // 10-30% casualties
        planet.ownership = game.player.name;
        planet.defenses.level = Math.floor(planet.defenses.level / 2); // Defenses are damaged, not destroyed
        planet.colony.population -= populationLost;

        const msg = `VICTORY! ${planet.name} has fallen! You seized control, losing ${forcesLost} forces and causing ${populationLost.toLocaleString()} casualties.`;
        displayConsoleMessage(msg, "success", "ship_bought");
        logGalaxyEvent(msg, "player_action_major");

    } else {
        // --- INVASION FAILURE ---
        const forcesLost = Math.max(1, Math.ceil(playerForces * getRandomInt(40, 70) / 100));
        game.player.ship.gndForces = Math.max(0, playerForces - forcesLost);

        const msg = `DEFEAT! Your ground forces were repelled. You lost ${forcesLost} forces in the failed assault.`;
        displayConsoleMessage(msg, "error", "ship_destroyed");
        logGalaxyEvent(msg, "player_loss");
    }

    updateUI();
}


export function handleColonizePlanet() {
    if (game.player.ship.gndForces <= 0) {
        displayConsoleMessage("You have no Colonist Pods to establish a colony. Purchase Ground Forces at a Spaceport.", "error");
        return;
    }

    const planet = game.map[`<span class="math-inline">\{game\.player\.x\},</span>{game.player.y}`].data;
    const maxTransfer = game.player.ship.gndForces;
    const amountToTransfer = parseInt(prompt(`You have ${maxTransfer} Colonist Pods. How many would you like to use to establish the colony? (1 Pod = 1,000 colonists)`, "1"));

    if (isNaN(amountToTransfer) || amountToTransfer <= 0) {
        displayConsoleMessage("Colonization aborted.", "info");
        return;
    }

    if (amountToTransfer > maxTransfer) {
        displayConsoleMessage(`You only have ${maxTransfer} Colonist Pods available.`, "error");
        return;
    }

    game.player.ship.gndForces -= amountToTransfer;
    const newColonists = amountToTransfer * 1000;
    planet.colony.population += newColonists;
    planet.colony.status = 'Developing';

    const msg = `${newColonists.toLocaleString()} new colonists have arrived at ${planet.name}. The colony is now developing.`;
    displayConsoleMessage(msg, "success");
    logGalaxyEvent(msg, "player_action");
    updateUI();
}


export function handleSetupDefenses() {
    // For now, this just opens the new UI screen.
    // We will add the logic to build/upgrade in the next step.
    displayDefenseManagement();
}


export function handleDestroyPlanet() {
    const hasDetonators = true; // Placeholder: Replace with game.player.inventory.atomicDetonators > 0;

    if (hasDetonators) {
        const targetPlanet = game.map[`${game.player.x},${game.player.y}`].data;
        if (confirm(`WARNING: This is irreversible. Detonate the core of ${targetPlanet.name}?`)) {
            game.planets = game.planets.filter(p => p !== targetPlanet);
            delete game.map[`${game.player.x},${game.player.y}`];
            const msg = `${targetPlanet.name} has been reduced to radioactive dust. A permanent scar on the galaxy.`;
            displayConsoleMessage(msg, "error", "ship_destroyed");
            logGalaxyEvent(msg, "player_action_major"); // You may need to add styling for this new log type
            updateUI();
        }
    } else {
        displayConsoleMessage("Action requires Atomic Detonators.", "error");
    }
}
