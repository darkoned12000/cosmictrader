// --- GAME INITIALIZATION, SAVE, LOAD, RESTART ---
// Moved from script.js for better organization
// ES6 Module with explicit imports

import { getRandomInt, deepClone, getRandomImage, getRandomElement } from './utilities.js';
import { displayConsoleMessage, updateUI } from '../modules/ui.js';
import { initAudioControls, playSoundEffect } from '../modules/audio.js';
import { resetLotteryState } from '../modules/lottery.js';
import { initializeFactionData } from '../modules/factions.js';
import { createNpcShip, resetShipIdCounter, Ship } from '../ship-definitions.js';
import { FACTION_TRADER, FACTION_DURAN, FACTION_VINARI } from '../data/naming-data.js';
import { determineNpcMapType } from './npc.js';
import { game, ui, initializeUI } from './state.js';
import { ACCOUNTS_STORAGE_KEY, startGame } from '../modules/auth.js';
import { PORT_PREFIXES, PORT_SUFFIXES, SPACE_PORT_NAMES } from '../data/naming-data.js';
import { planetTypes, planetOwnership, planetAtmospheres, planetNames, starNames, starTypes, hazardTypes, commodities, portTypes, portImages, spacePortImages, shipClasses } from '../data/game-data.js';

// ---------------------------
// --- GAME INITIALIZATION ---
export function initGame(isNewPlayerCreation = false, newPlayerName = 'Player', newShipName = 'Starhawk I') {
    // Ensure UI is initialized before accessing DOM elements
    if (!ui.mapSizeSelect) {
        initializeUI();
    }
    console.log("Init Game...");


    if (isNewPlayerCreation) {
        game.player.firstName = newPlayerName;
        game.player.lastName = ""; // Optional last name
        if (game.player.ship) {
            // Find the base Starhawk Skiff and give it the new name
            const baseShip = shipClasses['Starhawk Skiff'];
            game.player.ship = { ...baseShip, name: newShipName };
        }
    }


    // Clear any existing simulation timer before starting a new one
    if (game.simulationIntervalId) {
        clearInterval(game.simulationIntervalId);
        game.simulationIntervalId = null;
    }

    // Reset core game state properties
    resetShipIdCounter();
	game.inCombatWith = null;
	game.audioInitialized = false;
	game.solarArrayDeployed = false;
    if (game.solarArrayIntervalId) clearInterval(game.solarArrayIntervalId);
    game.solarArrayIntervalId = null;
    resetLotteryState();

    if (ui.deploySolarArrayButton) { // Ensure button exists before trying to set text
         ui.deploySolarArrayButton.textContent = 'Deploy Solar Array';
    }

    const mapSize = parseInt(ui.mapSizeSelect.value);
    game.mapSize = mapSize;
    if (mapSize === 5000) { game.mapWidth = 100; game.mapHeight = 50; }
    else if (mapSize === 10000) { game.mapWidth = 100; game.mapHeight = 100; }
    else if (mapSize === 20000) { game.mapWidth = 200; game.mapHeight = 100; }


    // This creates the entire player object and their ship in one atomic step,
    // ensuring all properties from the shipClasses template are copied correctly.
    game.player = {
        x: 1, y: 1,
        credits: 500000,
        inventory: { ore: 0, food: 0, tech: 0, minerals: 0, organics: 0, artifacts: 0 },
        class: 'Starhawk Skiff',
        viruses: [],
        kills: 0,
        // Set player and ship names based on whether this is a new character
        firstName: newPlayerName,
        lastName: "", // Last name is optional
        ship: {
            ...shipClasses['Starhawk Skiff'], // Start with base Starhawk Skiff stats
            name: newShipName // Apply the chosen ship name
        }
    };
    game.map = {};
    game.ports = [];
    game.planets = [];
    game.npcs = [];
    game.deceasedNpcs = [];
    game.stars = [];
    game.hazards = [];
    game.hasMoved = false; game.moveCount = 0;
	game.tradeQuantity = 1;
	game.tradeMode = 'single'; // 'single', 'multi', 'all'

    const totalSectors = game.mapWidth * game.mapHeight;

    // Initialize Start Space Port with higher security and credits
    const startPortCapacity = { ore: 5000, food: 5000, tech: 5000 };
    const startPortData = {
        x: 1, y: 1,
        type: 'spacePort',
        name: "Starbase Prime",
        owner: "Galactic Authority",
        prices: { ore: getRandomInt(50, 100), food: getRandomInt(20, 50), tech: getRandomInt(100, 300) },
        capacity: startPortCapacity,
        stock: { ...startPortCapacity },
        securityLevel: getRandomInt(5, 8),
        credits: getRandomInt(500000, 2000000),
        image_path: getRandomImage(spacePortImages),
        isStation: true,
        ship_name: "Starbase Prime",
        faction: "Galactic Authority",
        ship_class: "Starbase Defence Grid",
        maxHull: getRandomInt(25000, 40000), // Made starting base slightly stronger
        currentHull: 0, // This will be set below
        maxShields: getRandomInt(20000, 30000),
        currentShields: 0, // This will be set below
        takeDamage: function(amount) {
            let damageRemaining = amount;
            if (this.currentShields > 0) {
                const damageToShields = Math.min(this.currentShields, damageRemaining);
                this.currentShields -= damageToShields;
                damageRemaining -= damageToShields;
            }
            if (damageRemaining > 0) {
                this.currentHull = Math.max(0, this.currentHull - damageRemaining);
            }
        },
        getShieldPercentage: function() { return this.maxShields > 0 ? (this.currentShields / this.maxShields) * 100 : 0; },
        getHullPercentage: function() { return this.maxHull > 0 ? (this.currentHull / this.maxHull) * 100 : 0; },
    };
    // Set current stats to max after object creation
    startPortData.currentHull = startPortData.maxHull;
    startPortData.currentShields = startPortData.maxShields;
    let defenseFactor = (startPortData.securityLevel || 0) + 1;
    startPortData.fighterSquadrons = getRandomInt(3, 6) * defenseFactor;
    startPortData.gunEmplacements = getRandomInt(15, 25) * defenseFactor;
    startPortData.missileLaunchers = getRandomInt(2, 4) * defenseFactor;
    startPortData.bounty = Math.floor((startPortData.maxHull + startPortData.maxShields) / 20 + startPortData.fighterSquadrons * 100 + startPortData.gunEmplacements * 50 + startPortData.missileLaunchers * 200);

    game.ports.push(startPortData);
    game.map[`1,1`] = { type: 'spacePort', data: startPortData };

    game.factions = initializeFactionData(); // Initialize the faction data

	// Define NPC faction distribution
	const numTotalNPCs = Math.round(totalSectors * 0.008); // Adjusted total NPC count
    const numTraders = Math.ceil(numTotalNPCs * 0.5);    // 50% Traders
    const numVinari = Math.floor(numTotalNPCs * 0.25);   // 25% Vinari
    const numDuran = Math.floor(numTotalNPCs * 0.25);    // 25% Duran

    const numSP = Math.max(0, Math.round(totalSectors * 0.0025) - 1);
    const numP = Math.round(totalSectors * 0.02);
    const numPl = Math.round(totalSectors * 0.01);
    const numN = Math.round(totalSectors * 0.005);
    const numS = Math.round(totalSectors * 0.008);
    const numH = Math.round(totalSectors * 0.015);

    const objectsToPlace = [];
    for (let i = 0; i < numSP; i++) objectsToPlace.push({ type: 'spacePort' });
    for (let i = 0; i < numP; i++) objectsToPlace.push({ type: 'port' });
    for (let i = 0; i < numPl; i++) objectsToPlace.push({ type: 'planet' });
    for (let i = 0; i < numS; i++) objectsToPlace.push({ type: 'star' });
    for (let i = 0; i < numH; i++) objectsToPlace.push({ type: 'hazard' });

	// Add NPC markers to objectsToPlace based on new distribution
    for (let i = 0; i < numTraders; i++) objectsToPlace.push({ type: 'npc_ship', faction: FACTION_TRADER });
    for (let i = 0; i < numVinari; i++) objectsToPlace.push({ type: 'npc_ship', faction: FACTION_VINARI });
    for (let i = 0; i < numDuran; i++) objectsToPlace.push({ type: 'npc_ship', faction: FACTION_DURAN });

    for (let i = objectsToPlace.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[objectsToPlace[i], objectsToPlace[j]] = [objectsToPlace[j], objectsToPlace[i]]; }
    console.log(`Placing ${objectsToPlace.length} objects...`);

    // We need to count how many ports each faction starts with.
    game.ports.forEach(p => {
        if (p.owner === FACTION_DURAN) game.factions[FACTION_DURAN].territory++;
        if (p.owner === FACTION_VINARI) game.factions[FACTION_VINARI].territory++;
    });

    for (const obj of objectsToPlace) {
        let x, y, key;
        let att = 0;
        do {
            x = getRandomInt(0, game.mapWidth - 1);
            y = getRandomInt(0, game.mapHeight - 1);
            key = `${x},${y}`;
            att++;
            if (att > 100) { console.warn("Placement fail"); break; }
        } while (game.map[key]);

        if (game.map[key]) continue;

        let objectData; // This will store the actual data (Ship object, port data, etc.)
        let mapObjectType = obj.type; // This is the type string for the map symbol

		switch (obj.type) {
            case 'port':
            case 'spacePort':
                const isSpacePort = obj.type === 'spacePort';
                const portCap = { ore: getRandomInt(1000, 5000), food: getRandomInt(1000, 5000), tech: getRandomInt(1000, 5000) };

                objectData = {
                    x, y, type: obj.type, // 'port' or 'spacePort'
                    name: isSpacePort ? getRandomElement(SPACE_PORT_NAMES) :
                        `${getRandomElement(PORT_PREFIXES)} ${getRandomElement(PORT_SUFFIXES)} ${getRandomInt(1, 99)}`,
                    prices: { ore: getRandomInt(50, 100), food: getRandomInt(20, 50), tech: getRandomInt(100, 300) },
                    capacity: portCap,
                    stock: { ...portCap },
                    securityLevel: isSpacePort ? getRandomInt(5, 8) : getRandomInt(0, 2),
                    credits: isSpacePort ? getRandomInt(50000, 200000) : getRandomInt(5000, 20000),

                    // --- THIS IS THE FIX ---
                    // This line was missing from inside the object definition.
                    // It picks an image path ONCE and saves it to the object.
                    image_path: getRandomImage(isSpacePort ? spacePortImages : portImages)
                };

                if (!isSpacePort) { // This block is specifically for 'port' types, not 'spacePort'
                    const pType = getRandomElement(portTypes);
                    objectData.portType = pType;
                    objectData.behavior = { ore: pType[0], food: pType[1], tech: pType[2] };
                    commodities.forEach(c => { if (objectData.behavior[c] === 'B') { objectData.stock[c] = 0; } });

                    const ran_owner_num = getRandomInt(1, 100);
                    if (ran_owner_num <= 60) {
                        objectData.owner = "Independent Operators";
                    } else if (ran_owner_num <= 80) {
                        objectData.owner = FACTION_DURAN;
                    } else {
                        objectData.owner = FACTION_VINARI;
                    }
                } else {
                    objectData.owner = "Galactic Authority";
                }

                // --- COMBAT STATS ATTACHED AFTER CREATION ---
                objectData.isStation = true;
                objectData.ship_name = objectData.name;
                objectData.faction = objectData.owner || (isSpacePort ? "Galactic Authority" : "Independent Operators");
                objectData.ship_class = isSpacePort ? "Starbase Defence Grid" : "Fortified Trading Post";

                objectData.maxHull = isSpacePort ? getRandomInt(15000, 30000) : getRandomInt(3000, 8000);
                objectData.currentHull = objectData.maxHull;
                objectData.maxShields = isSpacePort ? getRandomInt(10000, 20000) : getRandomInt(1500, 4000);
                objectData.currentShields = objectData.maxShields;

                let defenseFactor = (objectData.securityLevel || 0) + 1;
                objectData.fighterSquadrons = isSpacePort ? getRandomInt(2, 5) * defenseFactor : getRandomInt(1, 3) * defenseFactor;
                objectData.gunEmplacements = isSpacePort ? getRandomInt(10, 20) * defenseFactor : getRandomInt(4, 10) * defenseFactor;
                objectData.missileLaunchers = isSpacePort ? getRandomInt(1, 3) * defenseFactor : getRandomInt(0, 1) * defenseFactor;

                objectData.bounty = Math.floor((objectData.maxHull + objectData.maxShields) / 20 + objectData.fighterSquadrons * 100 + objectData.gunEmplacements * 50 + objectData.missileLaunchers * 200);
                objectData.bounty = Math.max(100, objectData.bounty);

                // Methods for combat compatibility (similar to Ship class)
                objectData.takeDamage = function(amount) {
                    let damageRemaining = amount;
                    if (this.currentShields > 0) {
                        const damageToShields = Math.min(this.currentShields, damageRemaining);
                        this.currentShields -= damageToShields;
                        damageRemaining -= damageToShields;
                         //displayConsoleMessage(`${this.ship_name} shields absorb ${damageToShields} damage. Shields at ${this.getShieldPercentage().toFixed(0)}%.`, 'minor');
                    }
                    if (damageRemaining > 0 && this.currentHull > 0) {
                        const damageToHull = Math.min(this.currentHull, damageRemaining);
                        this.currentHull -= damageToHull;
                        //displayConsoleMessage(`${this.ship_name} hull takes ${damageToHull} damage! Hull at ${this.getHullPercentage().toFixed(0)}%.`, 'warning');
                    }
                    if (this.currentHull <= 0) {
                        this.currentHull = 0; // Ensure hull doesn't go negative
                        // Destruction is handled in endCombat
                    }
                };
                objectData.getShieldPercentage = function() { return this.maxShields > 0 ? (this.currentShields / this.maxShields) * 100 : 0; };
                objectData.getHullPercentage = function() { return this.maxHull > 0 ? (this.currentHull / this.maxHull) * 100 : 0; };
                // --- END NEW COMBAT STATS ---

                game.ports.push(objectData);
                break;
                case 'planet':
                    // --- STEP 1: Determine all properties first ---
                    const ownership = getRandomElement(planetOwnership);
                    let defenseLevel = 0;
                    let defenseStatus = 'None';
                    let population = 0;
                    let planetType = getRandomElement(planetTypes);

                    // Check if the planet should be inhabited and calculate its stats
                    const isHabitated = (ownership !== 'Unclaimed' && (Math.random() < 0.6 || [FACTION_DURAN, FACTION_VINARI, FACTION_TRADER].includes(ownership)));

                    if (isHabitated) {
                        if (ownership === FACTION_DURAN || ownership === FACTION_VINARI) {
                            defenseLevel = getRandomInt(2, 5);
                            defenseStatus = 'Fortified';
                        } else if (ownership === FACTION_TRADER || ownership === 'Federation' || ownership === 'Colony') {
                            defenseLevel = getRandomInt(1, 2);
                            defenseStatus = 'Lightly Fortified';
                        }

                        let basePopulation = defenseLevel * getRandomInt(500000, 1500000);
                        let habitabilityMultiplier = 1.0;

                        if (planetType === 'Terran') habitabilityMultiplier = 1.5;
                        else if (planetType === 'Jungle' || planetType === 'Ocean') habitabilityMultiplier = 1.2;
                        else if (planetType === 'Barren' || planetType === 'Ice') habitabilityMultiplier = 0.5;
                        else if (planetType === 'Toxic' || planetType === 'Lava') habitabilityMultiplier = 0.1;

                        population = Math.floor(basePopulation * habitabilityMultiplier);
                    }

                    // --- STEP 2: Create the object in one step using the variables from above ---
                    objectData = {
                        x,
                        y,
                        name: getRandomElement(planetNames) + `-${getRandomInt(1, 99)}`,
                        planetType: planetType,
                        ownership: ownership,
                        atmosphere: getRandomElement(planetAtmospheres),
                        lifeSigns: population > 1000 ? 'Yes' : (Math.random() < 0.1 ? 'Yes' : 'No'),
                        habitationSigns: population > 0 ? 'Yes' : 'No',
                        isScanned: (ownership === "Unclaimed"),
                        inventory: { ore: 0, food: 0, tech: 0 },
                        resources: {
                            ore: getRandomInt(1000, 20000),
                            minerals: getRandomInt(100, 1000),
                            organics: getRandomInt(50, 500),
                            artifacts: getRandomInt(0, 3)
                        },
                        defenses: {
                            level: defenseLevel,
                            status: defenseStatus
                        },
                        colony: {
                            population: population,
                            status: population > 0 ? 'Established' : 'Undeveloped',
                            income: 0
                        }
                    };

                    if (objectData.planetType === 'Ice') objectData.temperature = getRandomInt(-150, -50);
                    else if (objectData.planetType === 'Lava') objectData.temperature = getRandomInt(500, 1200);
                    else if (objectData.planetType === 'Terran' || objectData.planetType === 'Jungle') objectData.temperature = getRandomInt(30, 90);
                    else objectData.temperature = getRandomInt(-100, 400);

                    game.planets.push(objectData);
            break;
            case 'npc_ship': // MODIFIED for ship_definitions.js
                // obj.faction was set when creating objectsToPlace
                const newNpc = createNpcShip(obj.faction); // Let createNpcShip pick a class
                if (newNpc) {
                    newNpc.x_pos = x; // Add position to the Ship object
                    newNpc.y_pos = y;
                    objectData = newNpc;
                    game.npcs.push(objectData);
                    // Register the new ship's ID with its faction's fleet roster
                    if (game.factions[newNpc.faction]) {
                        if (!game.factions[newNpc.faction].ships) game.factions[newNpc.faction].ships = [];
                        game.factions[newNpc.faction].ships.push(newNpc.ship_id);
                    }
                    mapObjectType = determineNpcMapType(objectData.faction); // Determine 'vinari_ship', etc.
                } else {
                    console.warn(`Failed to create NPC of faction: ${obj.faction}`);
                    continue; // Skip adding this NPC to map if creation failed
                }
                break;
            case 'star':
                objectData = { x, y, name: getRandomElement(starNames) + `-${getRandomInt(10, 999)}`, starType: getRandomElement(starTypes) };
                switch (objectData.starType) {
                    case "O-Type": case "B-Type": objectData.radiationLvl=getRandomInt(400,1200);objectData.gravityLvl=getRandomInt(30,100)/10; break;
                    case "G-Type": objectData.radiationLvl=getRandomInt(50,150);objectData.gravityLvl=getRandomInt(8,15)/10; break;
                    case "K-Type": objectData.radiationLvl=getRandomInt(20,80);objectData.gravityLvl=getRandomInt(5,9)/10; break;
                    case "M-Type": objectData.radiationLvl=getRandomInt(5,30);objectData.gravityLvl=getRandomInt(1,5)/10; break;
                    case "WD": objectData.radiationLvl=getRandomInt(1,25);objectData.gravityLvl="Extreme"; break;
                    default: objectData.radiationLvl=getRandomInt(10,200);objectData.gravityLvl=getRandomInt(5,20)/10;
                }
                game.stars.push(objectData);
                break;
            case 'hazard':
                objectData = { x, y, hazardType: getRandomElement(hazardTypes) };
                game.hazards.push(objectData);
                break;
            default:
                console.warn(`Unknown object type in initGame: ${obj.type}`);
                continue;
        }
        if (objectData) { // Check if objectData was successfully created in the switch
             game.map[key] = { type: mapObjectType, data: objectData };
        } else {
            console.warn(`objectData was not defined for obj.type: ${obj.type} at ${x},${y}. Map entry not created.`);
        }
    }
	// Re-enable movement buttons and set mine button state
    document.querySelectorAll('#galaxy-map .button-group button[data-action="move"]').forEach(btn => btn.disabled = false);
    // The mine button's state will be correctly set by updateUI() which considers game.player.ship.mines

    initAudioControls();
    displayConsoleMessage(`${game.mapSize} sector game initialized and ship's computer is now online. Welcome Captain!`, 'info');
    updateUI();
}

// -----------------------------------
// SAVE, LOAD, RESTART FUNCTIONALITY
// NOTE: This could be removed later if I choose to add DB functionality

// Save game state to localStorage
export function saveGame() {
    const playerName = game.player.firstName;
    if (!playerName) {
        console.error("Save failed: No player name found in current game state.");
        return;
    }
    try {
        const accounts = JSON.parse(localStorage.getItem(ACCOUNTS_STORAGE_KEY)) || {};
        if (accounts[playerName.toLowerCase()]) {
            accounts[playerName.toLowerCase()].gameState = deepClone(game);
            localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
            displayConsoleMessage("Game saved successfully!");
            playSoundEffect('upgrade');
        } else {
            displayConsoleMessage(`Error: Account for ${playerName} not found. Cannot save.`, 'error');
        }
    } catch (e) {
        console.error("Save failed:", e);
    }
}


// Load game state from localStorage
export function loadGame(playerName) {
    if (!playerName) return;
    try {
        const accounts = JSON.parse(localStorage.getItem(ACCOUNTS_STORAGE_KEY));
        const playerData = accounts[playerName.toLowerCase()];
        if (playerData && playerData.gameState) {
            const loadedState = playerData.gameState;
            // Assign loaded state properties. This brings in plain objects for NPCs.
            Object.assign(game, deepClone(loadedState));

            // --- REHYDRATE NPC SHIP OBJECTS ---
            // Convert plain NPC objects back into Ship instances to restore their methods
            game.npcs = game.npcs.map(npcData => {
                // Ensure all properties needed by the Ship constructor are passed
                return new Ship(
                    npcData.ship_id,
                    npcData.ship_name,
                    npcData.faction,
                    npcData.ship_class,
                    npcData.max_shields,
                    npcData.current_shields,
                    npcData.max_hull,
                    npcData.current_hull,
                    npcData.fighter_squadrons,
                    npcData.missile_launchers,
                    npcData.image_path,
                    npcData.x_pos,
                    npcData.y_pos,
                    npcData.bounty,
                    npcData.captain_name,
                    npcData.kills,
                    npcData.credits || 0, // Default to 0 if not present in old save
                    npcData.inventory || { ore: 0, food: 0, tech: 0, minerals: 0, organics: 0, artifacts: 0 } // Default to empty if not present
                );
            });

            // Rehydrate deceasedNpcs array if it also stores Ship objects
            game.deceasedNpcs = game.deceasedNpcs.map(npcData => {
                return new Ship(
                    npcData.ship_id,
                    npcData.ship_name,
                    npcData.faction,
                    npcData.ship_class,
                    npcData.max_shields,
                    npcData.current_shields,
                    npcData.max_hull,
                    npcData.current_hull,
                    npcData.fighter_squadrons,
                    npcData.missile_launchers,
                    npcData.image_path,
                    npcData.x_pos,
                    npcData.y_pos,
                    npcData.bounty,
                    npcData.captain_name,
                    npcData.kills,
                    npcData.credits || 0,
                    npcData.inventory || { ore: 0, food: 0, tech: 0, minerals: 0, organics: 0, artifacts: 0 }
                );
            });

            // Rehydrate ports/spaceports if they have takeDamage/getShieldPercentage/getHullPercentage methods
            // These are handled by specific objectData.takeDamage in initGame, but not proper classes.
            // If any 'port' or 'spacePort' could be the game.inCombatWith target and needed methods,
            // their methods would also need re-assigning if they were lost during serialization.
            // For now, focusing on NPCs as per the error.

            displayConsoleMessage(`Welcome back, ${game.player.firstName}. Game data loaded.`);
            startGame();
        } else {
            displayConsoleMessage(`No saved game found for callsign ${playerName}.`, 'error');
        }
    } catch (e) {
        console.error("Load failed:", e);
    }
}


export function restartGame() {
    // Ensure UI is initialized before accessing DOM elements
    if (!ui.mapSizeSelect) {
        initializeUI();
    }
    const selectedMapSize = ui.mapSizeSelect.value; // Get the newly selected map size value

    if (!game.hasMoved || confirm("Restart game? Your current progress will be lost.")) {
        console.log("Restarting...");
        ui.bgmAudio.pause(); // Pause music before restarting

        // New restart message, displayed BEFORE initGame() is called
        displayConsoleMessage(`Game restarted. ${selectedMapSize} map has been selected. Standby for initialization...`, 'info');

        initGame(); // initGame will now use the selectedMapSize and display its own detailed initialization message
        // (e.g., "5000 sector game initialized and ship's computer is now online. Welcome Captain!")
    } else {
        // If restart cancelled, set the map size select back to the current game mapSize
        ui.mapSizeSelect.value = game.mapSize.toString();
    }
}