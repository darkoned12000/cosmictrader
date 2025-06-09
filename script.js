// --- DOM REFERENCES ---

// --- SIMULATION MODE SETTINGS ---
const SIMULATION_MODE_ENABLED = true; // Set to true to enable, false to disable
const SIMULATION_TICK_INTERVAL_MS = 1000; // Time in milliseconds (e.g., 10000 = 10 seconds)

// --- GAME STATE ---
const game = {
    mapSize: 5000,
    mapWidth: 100,
    mapHeight: 50,
    viewWidth: 50,
    viewHeight: 20,
    hasMoved: false,
    moveCount: 0,
    player: {
        x: 1,
        y: 1,
        credits: 5000,
        ship: {},
        inventory: { ore: 0, food: 0, tech: 0, minerals: 0, organics: 0, artifacts: 0 },
        class: 'Starhawk Skiff',
        firstName: "Player",
        lastName: "", // optional
        kills: 0,
        viruses: [] // Initialize viruses
    },
    map: {},
    ports: [],
    planets: [],
    npcs: [], // Stores SHIP objects from ship_definitions.js
    deceasedNpcs: [],
    stars: [],
    hazards: [],
    audioInitialized: false,
    factions: {}, // Will be filled by the init function
    galaxyLog: [], // For the new Galaxy Log feature
    activeEconomicEvents: [],
    maxGalaxyLogMessages: 20000,
    sfxVolume: 0.25,
	musicVolume: 0.3, // Added to store current music volume for mute/unmute
    preMuteMusicVolume: 0.3, // Stores volume before mute
    preMuteSfxVolume: 0.25,  // Stores SFX volume before mute
    consoleMessages: [], // New array for console messages
    maxConsoleMessages: 500, // Limit the number of messages displayed
	inCombatWith: null,
	combatLog: [],
	solarArrayDeployed: false,
    solarArrayIntervalId: null,
    simulationIntervalId: null,
    isSimulationRunning: false,
	lottery: {
        isActive: false,        // Is the lottery UI currently displayed?
        stage: 'pick',          // Current stage: 'pick', 'drawing', 'results'
        userNumbers: [],        // Array of 6 numbers (strings or numbers) picked by the user
        drawnNumbers: [],       // Array of 6 numbers drawn by the lottery
        spinningIntervals: [],  // To store interval IDs for animations
        currentDrawingDigitIndex: 0, // Which of the 6 digits is currently "spinning"
        matches: 0,
        winnings: 0,
        ticketCost: 10,         // Cost to play
        prizeTiers: { 2: 100, 3: 1000, 4: 10000, 5: 100000, 6: 1000000 },
        // NEW properties for play limits:
        playsThisPeriod: 0,
        maxPlaysPerPeriod: 3,
        lastPlayPeriodResetMoveCount: 0 // Tracks move count at last reset
    }
};

const ui = {
    shipInfo: document.getElementById('ship-info'),
    invInfo: document.getElementById('inv-info'),
    infoFeedContent: document.getElementById('info-feed-content'),
    mapDisplay: document.getElementById('map-display'),
    interactionDisplay: document.getElementById('interaction-display'),
    interactionControls: document.getElementById('interaction-controls'),
    spacePortBox: document.getElementById('space-port-actions'),
    spacePortTitle: document.getElementById('space-port-title'),
    spacePortControls: document.getElementById('space-port-controls'),
    mapSizeSelect: document.getElementById('map-size'),
    deployMineButton: document.getElementById('deploy-mine-button'),
    musicVolumeSlider: document.getElementById('music-volume'),
    musicVolumeLabel: document.getElementById('music-volume-label'),
    sfxVolumeSlider: document.getElementById('sfx-volume'),
    sfxVolumeLabel: document.getElementById('sfx-volume-label'),
    musicThemeSelect: document.getElementById('music-theme'),
    musicLoopCheckbox: document.getElementById('music-loop'),
	muteCheckbox: document.getElementById('audio-mute'),
    bgmAudio: document.getElementById('bgm-audio'),
    sfxAudio: document.getElementById('sfx-audio'),
    consoleMessagesDiv: document.getElementById('console-messages'), // Reference to the console messages div
    saveGameButton: document.getElementById('save-game-button'),
    loadGameButton: document.getElementById('load-game-button'),
	readManualButton: document.getElementById('read-manual-button'), // Reference to the new Read Me button
	deploySolarArrayButton: document.getElementById('deploy-solar-array-button')
};

// ---------------------------
// --- GAME INITIALIZATION ---
function initGame(isNewPlayerCreation = false, newPlayerName = 'Player', newShipName = 'Starhawk Skiff') {
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
    if (typeof nextShipIdCounter !== 'undefined') nextShipIdCounter = 1;
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
        credits: 5000,
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
        credits: getRandomInt(50000, 200000),
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
                    name: `${isSpacePort ? 'Starbase' : 'Port'} ${x},${y}`,
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
function saveGame() {
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
function loadGame(playerName) {
    if (!playerName) return;
    try {
        const accounts = JSON.parse(localStorage.getItem(ACCOUNTS_STORAGE_KEY));
        const playerData = accounts[playerName.toLowerCase()];
        if (playerData && playerData.gameState) {
            const loadedState = playerData.gameState;
            // You already have rehydration logic, which would be called here.
            // For now, we'll just assign the state.
            Object.assign(game, deepClone(loadedState));
            displayConsoleMessage(`Welcome back, ${game.player.firstName}. Game data loaded.`);
            startGame();
        } else {
            displayConsoleMessage(`No saved game found for callsign ${playerName}.`, 'error');
        }
    } catch (e) {
        console.error("Load failed:", e);
    }
}


function restartGame() {
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


// -------------------------
// --- CORE GAME ACTIONS ---
function move(direction) {
    if (game.inCombatWith) {
        displayConsoleMessage("Cannot move while in combat!", "warning");
        return;
    }
    if (game.solarArrayDeployed) {
        displayConsoleMessage("Cannot move while the solar array is deployed. Please retract to move.", "warning");
        return;
    }

    let nX = game.player.x;
    let nY = game.player.y;
    const fuelCost = 1;

    if (direction === 'up' && nY > 0) nY--;
    else if (direction === 'down' && nY < game.mapHeight - 1) nY++;
    else if (direction === 'left' && nX > 0) nX--;
    else if (direction === 'right' && nX < game.mapWidth - 1) nX++;
    else {
        displayConsoleMessage("Movement blocked by map edge.", 'warning');
        return; // Cannot move in that direction
    }

    // Check if the position actually changed
    if (nX === game.player.x && nY === game.player.y) {
        // displayConsoleMessage("Already at this location.", 'error'); // Optional: message if trying to move to current spot
        return; // No movement occurred
    }


    if (game.player.ship.fuel >= fuelCost) {
        game.player.ship.fuel -= fuelCost;
        game.player.x = nX;
        game.player.y = nY;
        game.hasMoved = true;
        game.moveCount++;

        // Check for lottery play reset
        checkLotteryPeriodReset();

        // Display the basic movement confirmation first
        displayConsoleMessage(`Moved ${direction}. Sector: ${nX}, ${nY}. Fuel: ${game.player.ship.fuel}.`);

        applyVirusEffects(); // Apply virus effects after moving

        const sector = game.map[`${nX},${nY}`]; // Get sector info for checks

        if (game.moveCount > 0 && game.moveCount % 25 === 0) { // Every 25 moves
            processFactionTurns();
        }

        // Check for Hazard FIRST
        if (sector && sector.type === 'hazard') {
            handleHazardEntry(sector); // This displays hazard-specific messages
        } else {
            // If not a hazard sector, display the standard arrival message (if any)
            displayArrivalMessage(); // <<<--- ADD THIS CALL HERE
        }

        // Continue with other post-move logic
        if (game.moveCount % 5 === 0) {
            regeneratePortStock();
            processColonyProduction();
            displayConsoleMessage("Economy update cycle complete.", "success");
        }
        moveNPCs();
        updateUI();

        // Fuel warnings
        if (game.player.ship.fuel < 20 && game.player.ship.fuel > 0) {
            displayConsoleMessage("Warning: Fuel is getting low!", 'warning', 'low_fuel');
        } else if (game.player.ship.fuel === 0) {
            displayConsoleMessage("Warning: Fuel is depleted! Cannot move.", 'error', 'low_fuel');
        }

    } else {
        displayConsoleMessage('Out of fuel!', 'error', 'error');
    }
}

function warpToSector() {
    if (game.inCombatWith) {
        displayConsoleMessage("Cannot warp while in combat!", "warning");
        return;
    }
    if (game.solarArrayDeployed) {
        displayConsoleMessage("Cannot warp while the solar array is deployed. Please retract to move.", "warning");
        return;
    }
    if (game.player.ship.warpDrive !== 'Installed') {
        displayConsoleMessage("Warp Drive not installed.", 'error');
        return;
    }

    const targetXInput = document.getElementById('warp-x');
    const targetYInput = document.getElementById('warp-y');

    const tX = parseInt(targetXInput.value, 10);
    const tY = parseInt(targetYInput.value, 10);
    const warpFuelCostPerSector = 2; // Fuel cost per sector distance

    if (isNaN(tX) || isNaN(tY) || tX < 0 || tX >= game.mapWidth || tY < 0 || tY >= game.mapHeight) {
        displayConsoleMessage('Invalid warp coordinates.', 'error');
        return;
    }

    if (tX === game.player.x && tY === game.player.y) {
        displayConsoleMessage("Cannot warp to current sector.", 'error');
        return;
    }

    const distance = Math.abs(tX - game.player.x) + Math.abs(tY - game.player.y);
    const fuelCost = distance * warpFuelCostPerSector;

    if (game.player.ship.fuel < fuelCost) {
        displayConsoleMessage(`Insufficient fuel for warp. Need ${fuelCost} fuel.`);
        return;
    }

    if (confirm(`Initiate warp to (${tX},${tY})?\nDistance: ${distance} sectors. Cost: ${fuelCost} fuel.`)) {
        playSoundEffect('warp_engage');
        game.player.ship.fuel -= fuelCost;
        game.player.x = tX;
        game.player.y = tY;
        game.hasMoved = true; // Warping counts as having moved
        game.moveCount += distance; // Each sector warped over increases move count

        displayConsoleMessage(`Warp successful! Arrived at ${tX}, ${tY}. Fuel remaining: ${game.player.ship.fuel}.`);

        // Apply virus effects for each sector warped over
        for (let i = 0; i < distance; i++) {
            applyVirusEffects();
        }

        const sector = game.map[`${tX},${tY}`];
        if (sector && sector.type === 'hazard') {
            handleHazardEntry(sector);
        } else {
            // If not a hazard sector, display the standard arrival message (if any)
            displayArrivalMessage();
        }
        // Economy updates might happen less often, maybe not per sector warp?
        // If the moveCount crosses a multiple of 5, the update will happen next regular move.
        // If you want economy to update per warp distance milestone, add that logic here.

        moveNPCs(); // Move NPCs after player warps

        updateUI();

        // Fuel Warnings
        if (game.player.ship.fuel < 20 && game.player.ship.fuel > 0) {
            displayConsoleMessage("Warning: Fuel is getting low!", 'warning', 'low_fuel');
        } else if (game.player.ship.fuel === 0) {
            displayConsoleMessage("Warning: Fuel is depleted! Cannot move.", 'error', 'low_fuel');
        }

    } else {
        displayConsoleMessage("Warp sequence aborted.", 'info');
    }
}


/**
 * Executes a single "turn" of the game without player input, for simulation mode.
 */

function toggleSimulation() {
    if (game.isSimulationRunning) {
        // --- STOP THE SIMULATION ---
        clearInterval(game.simulationIntervalId);
        game.simulationIntervalId = null;
        game.isSimulationRunning = false;
        document.getElementById('toggle-simulation-button').textContent = 'Start Simulation';
        displayConsoleMessage("Simulation paused. Player controls re-enabled.", 'info');
    } else {
        // --- START THE SIMULATION ---
        game.isSimulationRunning = true;
        document.getElementById('toggle-simulation-button').textContent = 'Stop Simulation';
        displayConsoleMessage(`Simulation running... Ticks every ${SIMULATION_TICK_INTERVAL_MS / 1000} seconds.`, 'info');
        // Run the first tick immediately without waiting for the interval
        runSimulationTick();
        game.simulationIntervalId = setInterval(runSimulationTick, SIMULATION_TICK_INTERVAL_MS);
    }
    // Refresh the UI to enable/disable player movement buttons
    updateUI();
}

function runSimulationTick() {
    console.log(`--- Simulation Tick ${game.moveCount + 1} ---`);
    displayConsoleMessage(`SIMULATION: Processing turn ${game.moveCount + 1}...`, 'minor');

    // 1. Advance the game's internal clock
    game.moveCount++;
    game.hasMoved = true;

    // 2. Run all periodic game events
    checkLotteryPeriodReset();
    applyVirusEffects();

    if (game.moveCount % 5 === 0) {
        regeneratePortStock();
        updateEconomy(); // updateEconomy already logs its own message
    }

    if (game.moveCount % 25 === 0) {
        processFactionTurns(); // This will log faction news
    }

    // 3. Move the NPCs
    moveNPCs();

    // 4. Refresh the entire UI so you can see the changes
    updateUI();
}



// Function to apply virus effects and decrement duration
function applyVirusEffects() {
    // Create a copy to iterate while potentially modifying the original array
    const activeViruses = [...game.player.viruses];
    game.player.viruses = activeViruses.filter(virus => {
        const virusDefinition = virusTypes.find(vt => vt.name === virus.name);
        if (virusDefinition && virusDefinition.effect) {
            // Apply the effect
            const effectMessage = virusDefinition.effect(game.player);
            // Display the effect in the console
            displayConsoleMessage(`Virus "${virus.name}" active: ${effectMessage}`);
        }
        virus.duration--; // Decrement duration
        // Keep the virus if its duration is greater than 0
        return virus.duration > 0;
    });

    if (activeViruses.length > 0 && game.player.viruses.length === 0) {
        displayConsoleMessage("All virus effects have worn off.", 'minor');
    }
}


// Solar Array
function toggleSolarArray() {
    if (game.inCombatWith) {
        displayConsoleMessage("Cannot operate solar array during combat!", "warning");
        return;
    }

    if (game.solarArrayDeployed) { // --- Retract Array ---
        game.solarArrayDeployed = false;
        if (game.solarArrayIntervalId) {
            clearInterval(game.solarArrayIntervalId);
            game.solarArrayIntervalId = null;
        }
        ui.deploySolarArrayButton.textContent = 'Deploy Solar Array';
        displayConsoleMessage("Retracting Solar Array . . . Stand by.", 'info');
        // Movement is implicitly re-enabled by the check in move() and warpToSector()
    } else { // --- Deploy Array ---
        if (game.player.ship.fuel >= game.player.ship.maxFuel) {
            displayConsoleMessage("No need to deploy solar array, fuel tanks are full.", 'info');
            return;
        }

        game.solarArrayDeployed = true;
        ui.deploySolarArrayButton.textContent = 'Retract Solar Array';
        displayConsoleMessage("Deploying Solar Array . . . Charging commencing.", 'info', 'upgrade'); // Using 'upgrade' sound

        const currentSector = game.map[`${game.player.x},${game.player.y}`];
        const rechargeIntervalMs = (currentSector && currentSector.type === 'star') ? 5000 : 10000; // 5s near star, 10s otherwise
        const intervalLogMessage = (currentSector && currentSector.type === 'star') ? "(Accelerated charging near star)" : "";

        displayConsoleMessage(`Solar array active. Recharge rate: 1 unit per ${rechargeIntervalMs / 1000} seconds. ${intervalLogMessage}`, 'minor');

        game.solarArrayIntervalId = setInterval(() => {
            if (!game.solarArrayDeployed) { // Array might have been retracted manually
                clearInterval(game.solarArrayIntervalId);
                game.solarArrayIntervalId = null;
                return;
            }
            if (game.player.ship.fuel < game.player.ship.maxFuel) {
                game.player.ship.fuel++;
                // Ensure fuel doesn't exceed max due to any race conditions (though Math.min not strictly needed with current logic)
                game.player.ship.fuel = Math.min(game.player.ship.fuel, game.player.ship.maxFuel);
                displayConsoleMessage("1 fuel unit replenished.", 'success');
                updateShipStatus(); // Update fuel display
                if (game.player.ship.fuel >= game.player.ship.maxFuel) {
                    displayConsoleMessage("Fuel tanks full. Solar array charging paused.", 'info');
                    // Array remains deployed, but charging stops if full.
                    // To auto-retract, you'd call toggleSolarArray() here or parts of its retract logic.
                }
            }
        }, rechargeIntervalMs);
    }
    updateUI(); // To refresh button states generally, though specific text is handled here.
}

// --- END of CORE GAME ACTIONS ---
// --------------------------------

// -----------------------
// --- ACTIONS HANDLER ---
function triggerAction(action, ...args) {
    attemptFirstAudioPlay();
    // playSoundEffect('ui_click'); // Already played by delegated listener for most buttons

    switch (action) {
        case 'move': move(...args); break;
        case 'deployMine':
            if (game.solarArrayDeployed) {
                displayConsoleMessage("Cannot deploy mine while solar array is active.", "warning");
                return;
            }
            deployMine(...args); // Your existing deployMine function
            break;
        case 'toggleSolarArray': // NEW CASE
            toggleSolarArray();
            break;
        case 'editShipName': handleEditShipName(); break;
        case 'warpToSector': warpToSector(...args); break;
        case 'buyFuel': buyFuel(...args); break;
        case 'buyEquipment': buyEquipment(...args); break;
        case 'upgradeScanner': upgradeScanner(...args); break;
        case 'buyWarpDrive': buyWarpDrive(...args); break;
        case 'buyShip': buyShip(...args); break;
        case 'trade': displayConsoleMessage("Use quantity input or Max/All buttons for trading.", "info"); break;
        case 'tradeByInput': // New: For Buy/Sell buttons using the quantity input
            // args[0] is 'buy'/'sell', args[1] is commodity
            const quantityInput = document.getElementById('trade-quantity');
            const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
            if (quantity > 0) {
                trade(args[0], args[1], quantity);
            } else {
                displayConsoleMessage("Please enter a valid quantity greater than 0.", "warning");
            }
            break;
        case 'tradeAll': // New: For Max Buy / Sell All buttons
            // args[0] is 'buy'/'sell', args[1] is commodity
            handleTradeAll(args[0], args[1]);
            break;
        case 'sellExotic': handleSellExotic(args[0]); break;
        case 'sellAllExotic': handleSellAllExotic(args[0]); break;
        case 'upgradePort': upgradePort(...args); break;
        case 'upgradePortSecurity': upgradePortSecurity(...args); break;
        case 'upgradeSoftware': upgradeSoftware(...args); break;
        case 'removeViruses': removeViruses(...args); break;
        case 'attemptStealResources': attemptStealResources(...args); break;
        case 'attemptHackPort': attemptHackPort(...args); break;
        case 'attemptPurchasePort': attemptPurchasePort(...args); break;
        case 'payForTip': payForTip(...args); break;
        case 'hailNPC': hailNPC(...args); break;
        case 'attackNPC': // This will now INITIATE combat
            const currentSectorForAttack = game.map[`${game.player.x},${game.player.y}`];
            if (currentSectorForAttack && currentSectorForAttack.data && currentSectorForAttack.data.faction && !game.inCombatWith) {
                if (currentSectorForAttack.data.faction !== FACTION_TRADER) { // Don't attack traders yet
                    startCombat(currentSectorForAttack.data); // Pass the Ship object
                } else {
                    displayConsoleMessage("Attacking neutral traders is ill-advised, Captain.", "warning");
                }
            } else if (game.inCombatWith) {
                displayConsoleMessage("Already in combat!", "warning");
            } else {
                displayConsoleMessage("No valid target to attack in this sector.", "error");
            }
            break;

        case 'playerExecuteAttack': // NEW: Player chooses to execute an attack in their combat turn
            if (game.inCombatWith) {
                handleCombatRound('standard_attack'); // 'standard_attack' is an example type
            } else {
                displayConsoleMessage("Not currently in combat.", "info");
            }
            break;

        case 'playerLaunchFighters': // NEW: Player chooses to launch fighters
            if (game.inCombatWith) {
                handleCombatRound('launch_fighters');
            } else {
                displayConsoleMessage("Not currently in combat.", "info");
            }
            break;

        case 'playerFireMissile': // NEW: Player chooses to fire a missile
            if (game.inCombatWith) {
                handleCombatRound('fire_missile');
            } else {
                displayConsoleMessage("Not currently in combat.", "info");
            }
            break;

        case 'attemptFleeCombat': // NEW: Player attempts to flee
            if (game.inCombatWith) {
                attemptFlee();
            } else {
                displayConsoleMessage("Not currently in combat.", "info");
            }
            break;

        case 'scanPlanet': handleScanPlanet(); break;
        case 'minePlanet': handleMinePlanet(); break;
        case 'claimPlanet': handleClaimPlanet(); break;
        case 'launchInvasion': handleLaunchInvasion(); break;
        case 'colonizePlanet': handleColonizePlanet(); break;
        case 'setupDefenses': handleSetupDefenses(); break;
        case 'destroyPlanet': handleDestroyPlanet(); break;

        case 'playLottery': // This now INITIATES the lottery UI
            console.log(`Attempting to play lottery. Plays this period: ${game.lottery.playsThisPeriod}, Max plays: ${game.lottery.maxPlaysPerPeriod}`); // DEBUG LINE

            if (game.lottery.playsThisPeriod >= game.lottery.maxPlaysPerPeriod) {
                displayConsoleMessage(`No lottery plays remaining this period. Resets in ${Math.max(0, (game.lottery.lastPlayPeriodResetMoveCount + LOTTERY_PLAYS_RESET_INTERVAL_MOVES) - game.moveCount)} moves.`, 'warning');
                playSoundEffect('error');
                return;
            }
            if (game.player.credits < game.lottery.ticketCost) {
                displayConsoleMessage(`Not enough credits to play the lottery. Cost: ${game.lottery.ticketCost}cr`, 'error');
                playSoundEffect('error');
                return;
            }
            game.lottery.isActive = true;
            game.lottery.stage = 'pick'; // Start at number picking stage
            game.lottery.userNumbers = []; // Clear previous numbers
            game.lottery.drawnNumbers = [];
            game.lottery.spinningIntervals.forEach(clearInterval);
            game.lottery.spinningIntervals = [];
            game.lottery.currentDrawingDigitIndex = 0;
            game.lottery.matches = 0;
            game.lottery.winnings = 0;
            playSoundEffect('ui_click');
            updateUI(); // This will re-render interaction to show lottery UI
            focusLotteryInput();
            break;

        case 'lotterySubmitNumbers':
            handleLotteryNumberSubmission();
            break;

        case 'lotteryPlayAgain': // For the "Play Again" button on the lottery results screen
            // ***** ADD THIS CHECK *****
            if (game.lottery.playsThisPeriod >= game.lottery.maxPlaysPerPeriod) {
                displayConsoleMessage(`No lottery plays remaining this period. Resets in ${Math.max(0, (game.lottery.lastPlayPeriodResetMoveCount + LOTTERY_PLAYS_RESET_INTERVAL_MOVES) - game.moveCount)} moves.`, 'warning');
                playSoundEffect('error');
                // Optionally, you could also set game.lottery.isActive = false here if you want to force exit.
                // For now, just preventing the reset to 'pick' stage is enough.
                // Or, ensure the button itself is disabled in generateLotteryUI for 'results' stage if playsThisPeriod >= maxPlaysPerPeriod.
                return;
            }
            // ***** END ADDED CHECK *****

            if (game.player.credits < game.lottery.ticketCost) {
                displayConsoleMessage(`Not enough credits to play again. Cost: ${game.lottery.ticketCost}cr`, 'error');
                playSoundEffect('error'); // Added sound
            } else {
                // Proceed to reset for a new pick round
                game.lottery.stage = 'pick';
                game.lottery.userNumbers = [];
                game.lottery.drawnNumbers = [];
                game.lottery.spinningIntervals.forEach(clearInterval); // Clear any animation from previous draw
                game.lottery.spinningIntervals = [];
                game.lottery.currentDrawingDigitIndex = 0;
                game.lottery.matches = 0;
                game.lottery.winnings = 0;
                // The ticket cost will be deducted and playsThisPeriod incremented in handleLotteryNumberSubmission
            }
            updateUI();
            focusLotteryInput();
            break;

        case 'lotteryExit': // For "Return to Port" or "Cancel"
            game.lottery.isActive = false;
            game.lottery.spinningIntervals.forEach(clearInterval); // Stop any animations
            game.lottery.spinningIntervals = [];
            playSoundEffect('ui_click'); // Sound for exiting
            updateUI();
            break;

        case 'attackPort':
            const currentInstallationSector = game.map[`${game.player.x},${game.player.y}`];
            if (currentInstallationSector &&
                (currentInstallationSector.type === 'port' || currentInstallationSector.type === 'spacePort') &&
                currentInstallationSector.data && !game.inCombatWith) {

                if (currentInstallationSector.data.owner === game.player.name) {
                    displayConsoleMessage("You cannot attack your own installation!", "warning");
                    playSoundEffect('error'); // Good to have feedback
                    return; // Return early
                }
                // Confirmation before attacking
                if (confirm(`WARNING: Attacking ${currentInstallationSector.data.name} is an act of war and will likely have severe consequences with its owners (${currentInstallationSector.data.owner || 'Independent Operators'}). Proceed with attack?`)) {
                    startCombat(currentInstallationSector.data); // Pass the port/spaceport object
                } else {
                    displayConsoleMessage("Attack on installation aborted.", "info");
                }
                } else if (game.inCombatWith) {
                    displayConsoleMessage("Already in combat!", "warning");
                } else {
                    displayConsoleMessage("No suitable installation to attack here.", "error");
                }
                break; // Don't forget the break!

        default:
            console.warn("Unknown action triggered:", action);
            displayConsoleMessage(`Error: System malfunction. Unknown action '${action}'.`, 'error');
            break;
    }
}

// --- END of ACTIONS HANDLER ---
// ------------------------------

// -----------------------
// --- EVENT LISTENERS ---
document.addEventListener('DOMContentLoaded', () => {
    // Event delegation for all buttons.
    document.body.addEventListener('click', (event) => {
        const target = event.target;
        if (target.tagName === 'BUTTON') {
            attemptFirstAudioPlay();
            // Generic click sound for UI feedback, individual actions can play more specific sounds.
            // playSoundEffect('ui_click'); // This might be too noisy if every action also plays a sound.

            // Handling for data-action buttons (mostly in #center-column and #interaction-controls)
            if (target.dataset.action) {
                if (!target.disabled) {
                    const action = target.dataset.action;
                    const direction = target.dataset.direction; // For move buttons
                    if (action === 'move') {
                        triggerAction('move', direction);
                    } else {
                        triggerAction(action);
                    }
                }
            }
            // Handling for buttons with inline onclick (mostly in #space-port-controls)
            else if (target.onclick && !target.disabled) {
                // The inline onclick will execute itself.
                // No need to call eval here if the HTML has `onclick="functionName()"`
            }
        }
    });

    ui.mapSizeSelect.addEventListener('change', restartGame);
    document.getElementById('continue-button').addEventListener('click', handleNameSubmit);
    document.getElementById('login-button').addEventListener('click', handleLogin);
    document.getElementById('create-player-button').addEventListener('click', handleCreatePlayer);

    // Also, let's make the "Enter" key work for convenience
    document.getElementById('player-name-input').addEventListener('keyup', (e) => {
        if (e.key === 'Enter') handleNameSubmit();
    });
        document.getElementById('password-input').addEventListener('keyup', (e) => {
            if (e.key === 'Enter') handleLogin();
        });
            document.getElementById('new-password-input').addEventListener('keyup', (e) => {
                if (e.key === 'Enter') handleCreatePlayer();
            });
    ui.readManualButton.addEventListener('click', displayManual);
    document.getElementById('view-galaxy-log-button').addEventListener('click', displayGalaxyLog);
    document.getElementById('power-rankings-button').addEventListener('click', displayPowerRankings);
    document.getElementById('toggle-simulation-button').addEventListener('click', toggleSimulation);

    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return; // Ignore keydown if typing in input
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'm'].includes(e.key)) e.preventDefault();
        switch (e.key) {
            case 'ArrowUp': case 'w': triggerAction('move', 'up'); break;
            case 'ArrowDown': case 's': triggerAction('move', 'down'); break;
            case 'ArrowLeft': case 'a': triggerAction('move', 'left'); break;
            case 'ArrowRight': case 'd': triggerAction('move', 'right'); break;
            case 'm': if (!ui.deployMineButton.disabled) triggerAction('deployMine'); else displayConsoleMessage("No mines to deploy.", 'warning'); break;
        }
    });


// --- END of EVENT LISTENERS ---
// ------------------------------


// Initialize the game when the DOM is fully loaded
initGame();
showLoginModal();
});
