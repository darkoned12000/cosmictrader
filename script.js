// --- DATA STRUCTURES ---
const shipClasses = {
    'Interceptor': { price: 5000, hull: 100, maxHull: 1000, fuel: 100, maxFuel: 250, cargoSpace: 25, maxCargoSpace: 100, shields: 80, maxShields: 80, mines: 0, maxMines: 10, fighters: 50, maxFighters: 100, missiles: 0, maxMissiles: 10, gndForces: 0, maxGndForces: 10, scanner: { model: 'Basic', range: 7 }, cloakEnergy: 50, maxCloakEnergy: 50, warpDrive: 'Not Installed', computerLevel: 1 },
    'Heavy Transport': { price: 15000, hull: 250, maxHull: 5000, fuel: 250, maxFuel: 1000, cargoSpace: 500, maxCargoSpace: 1000, shields: 250, maxShields: 1000, mines: 0, maxMines: 20, fighters: 100, maxFighters: 200, missiles: 1, maxMissiles: 10, gndForces: 0, maxGndForces: 100, scanner: { model: 'Standard', range: 10 }, cloakEnergy: 100, maxCloakEnergy: 250, warpDrive: 'Not Installed', computerLevel: 1 },
    'Long Range Explorer': { price: 50000, hull: 250, maxHull: 7500, fuel: 250, maxFuel: 2000, cargoSpace: 150, maxCargoSpace: 500, shields: 250, maxShields: 2000, mines: 5, maxMines: 50, fighters: 100, maxFighters: 250, missiles: 1, maxMissiles: 25, gndForces: 20, maxGndForces: 100, scanner: { model: 'Advanced', range: 15 }, cloakEnergy: 250, maxCloakEnergy: 250, warpDrive: 'Not Installed', computerLevel: 2 },
    'Battleship': { price: 75000, hull: 1000, maxHull: 12500, fuel: 500, maxFuel: 3000, cargoSpace: 250, maxCargoSpace: 750, shields: 500, maxShields: 5000, mines: 5, maxMines: 100, fighters: 250, maxFighters: 500, missiles: 5, maxMissiles: 50, gndForces: 20, maxGndForces: 250, scanner: { model: 'Standard', range: 10 }, cloakEnergy: 250, maxCloakEnergy: 500, warpDrive: 'Not Installed', computerLevel: 3 },
    'Heavy Assault Cruiser': { price: 100000, hull: 2500, maxHull: 25000, fuel: 1000, maxFuel: 10000, cargoSpace: 500, maxCargoSpace: 1000, shields: 2500, maxShields: 25000, mines: 10, maxMines: 150, fighters: 500, maxFighters: 1000, missiles: 10, maxMissiles: 75, gndForces: 50, maxGndForces: 500, scanner: { model: 'Standard', range: 10 }, cloakEnergy: 250, maxCloakEnergy: 1000, warpDrive: 'Not Installed', computerLevel: 4 },
    'Vanguard Destroyer': { price: 150000, hull: 5000, maxHull: 50000, fuel: 1000, maxFuel: 15000, cargoSpace: 750, maxCargoSpace: 2000, shields: 5000, maxShields: 50000, mines: 50, maxMines: 200, fighters: 1000, maxFighters: 2000, missiles: 20, maxMissiles: 100, gndForces: 100, maxGndForces: 1000, scanner: { model: 'Advanced', range: 15 }, cloakEnergy: 250, maxCloakEnergy: 2000, warpDrive: 'Not Installed', computerLevel: 5 }
};
const scannerModels = { Basic: { range: 7, cost: 0 }, Standard: { range: 10, cost: 12000 }, Advanced: { range: 15, cost: 25000 } };
const equipmentCosts = { shields: { cost: 500, amount: 100, max: 'maxShields' }, mines: { cost: 100, amount: 1, max: 'maxMines' }, fighters: { cost: 200, amount: 1, max: 'maxFighters' }, missiles: { cost: 300, amount: 1, max: 'maxMissiles' }, cargoSpace: { cost: 1000, amount: 50, max: 'maxCargoSpace' }, hull: { cost: 1000, amount: 100, max: 'maxHull' }, cloakEnergy: { cost: 500, amount: 100, max: 'maxCloakEnergy' }, gndForces: { cost: 100, amount: 10, max: 'maxGndForces' }, fuel: { cost: 50, amount: 100, unitCost: 0.5 } };
const commodities = ['ore', 'food', 'tech'];
const portTypes = ['SBB', 'SBS', 'SSB', 'BSS', 'BBS', 'BSB', 'SSS', 'BBB'];
const planetNames = ["Terra", "Xylos", "Cygnus", "Kepler", "Gliese", "Arakis", "Magrathea", "Klendathu", "LV-426", "Pandora"];
const planetTypes = ["Terran", "Jungle", "Desert", "Ocean", "Ice", "Lava", "Gas Giant", "Barren", "Toxic"];
const planetAtmospheres = ["N2-O2", "CO2", "Methane", "Ammonia", "Acid", "Thin", "None", "Dense"];
const planetOwnership = ["Unclaimed", "Federation", "Duran", "Vinari", "Pirate", "Colony"];
//const npcShipNames = ["Bucket", "Stardust", "Runner", "Comet", "Nomad", "Griffin", "Hammer", "Wanderer", "Zephyr", "Goliath"];
//const npcShipClasses = ["Freighter", "Scout", "Gunship", "Raider", "Patrol", "Cruiser"];
//const npcHostility = ["Low", "Med", "High", "Unknown"];
const starNames = ["Sol", "Sirius", "Proxima", "Vega", "Rigel", "Betelgeuse", "Antares", "Arcturus", "Spica", "Polaris"];
const starTypes = ["G-Type", "K-Type", "M-Type", "O-Type", "B-Type", "WD"];
const portImages = ['Images/ports/Port_1.png', 'Images/ports/Port_2.png', 'Images/ports/Port_3.png', 'Images/ports/Port_4.png', 'Images/ports/Port_5.png'];
const spacePortImages = ['Images/stations/Station_1.png', 'Images/stations/Station_2.png', 'Images/stations/Station_3.png'];
const LOTTERY_PLAYS_RESET_INTERVAL_MOVES = 1000; // Player gets 3 new plays every 50 moves
const PORT_FOR_SALE_BASE_CHANCE = 0.22; // 22% base chance

// --- IMAGE DATA ---
const planetImagesByType = { "Terran": ["Images/planets/Terran_World_1.gif", "Images/planets/Terran_World_2.gif"], "Jungle": ["Images/planets/Jungle_World_1.gif"], "Desert": ["Images/planets/Desert_World_1.gif"], "Ocean": ["Images/planets/Ocean_World_1.gif"], "Ice": ["Images/planets/Ice_World_1.gif"], "Lava": ["Images/planets/Lava_World_1.gif"], "Gas Giant": ["Images/planets/Gas_Giant_1.gif"], "Barren": ["Images/planets/Moon_1.gif"], "Toxic": ["Images/planets/Toxic_World_1.gif"], "Unknown": ["Images/planets/Unknown_World_1.gif"] }; // Assuming Images/planets folder
const starImagesByType = { "G-Type": ["Images/stars/Star_Yellow_1.gif"], "K-Type": ["Images/stars/Star_Orange_1.gif"], "M-Type": ["Images/stars/Star_Red_1.gif"], "O-Type": ["Images/stars/Star_Blue_1.gif"], "B-Type": ["Images/stars/Star_BlueWhite_1.gif"], "WD": ["Images/stars/Star_White_1.gif"], "Unknown": ["Images/stars/Star_Unknown_1.gif"] }; // Assuming Images/stars folder
const hazardImagesByType = { "Mine": ["Images/hazards/Mines.png"], "Black Hole": ["Images/hazards/Black_Hole_1.gif", "Images/hazards/Black_Hole_2.gif", "Images/hazards/Black_Hole_3.gif"], "Asteroid Field": ["Images/hazards/Asteroid_1.gif", "Images/hazards/Asteroid_2.gif", "Images/hazards/Asteroid_3.gif"], "Solar Storm": ["Images/hazards/SolarStorm.png"], "Nebula": ["Images/hazards/Nebula.png"], "Unknown": ["Images/hazards/unknown_1.gif"] }; // Assuming Images/hazards folder

// --- HAZARD DATA ---
const hazardTypes = ["Black Hole", "Asteroid Field", "Mine", "Solar Storm", "Nebula"];
// Define virus types and their effects
// Effects are functions that take the player object and modify it
const virusTypes = [
    { name: "Credit Drain", effect: (player) => { const loss = Math.ceil(player.credits * 0.005); player.credits = Math.max(0, player.credits - loss); return `-${loss} credits`; }, duration: 20 }, // Drain 0.5% credits per move
    { name: "Shield Malfunction", effect: (player) => { const loss = 5; player.ship.shields = Math.max(0, player.ship.shields - loss); return `-${loss} shields`; }, duration: 15 }, // Lose 5 shields per move
    // { name: "Weapon Lockout", effect: (player) => { /* Placeholder - need combat system */ return "Weapons Offline (N/I)"; }, duration: 5 }, // Not implemented yet
    { name: "Fuel Leak", effect: (player) => { const loss = 1; player.ship.fuel = Math.max(0, player.ship.fuel - loss); return `-1 fuel`; }, duration: 25 }, // Lose 1 fuel per move
    // { name: "Scanner Glitch", effect: (player) => { /* Placeholder - need scanner effect */ return "Scanner Range Reduced (N/I)"; }, duration: 10 }, // Not implemented yet
    { name: "Navigation Scramble", effect: (player) => { /* Placeholder - could slightly alter course or increase fuel cost */ return "Navigation Unreliable (N/I)"; }, duration: 10 }, // Not implemented yet
    { name: "System Sluggishness", effect: (player) => { /* Placeholder - could slow down menu interaction or repair rates */ return "Systems Lagging (N/I)"; }, duration: 15 }, // Not implemented yet
];

// --- NEW HELPER FUNCTION ---
/**
 * Determines the map display type string for an NPC based on its faction.
 * @param {string} faction - The faction of the NPC (e.g., FACTION_TRADER, FACTION_VINARI).
 * @returns {string} The map type string (e.g., 'npc_trader', 'vinari_ship').
 */
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


// --- AUDIO DATA ---
const musicThemes = [{ name: "Darkness Below", file: "Music/The-Darkness-Below.mp3" }, { name: "Star Light", file: "Music/Star-Light.mp3" }, { name: "Solar Storm", file: "Music/Solar-Storm.mp3" }, { name: "Cold Moon", file: "Music/Cold-Moon.mp3" }]; // Assuming Music folder
const soundEffects = { 'warp_engage': 'Effects/snd_warp_start.wav', 'mine_hit': 'Effects/snd_explosion_1.ogg', 'trade_buy': 'Effects/snd_cha_ching.mp3', 'trade_sell': 'Effects/snd_coin_drop.wav', 'ui_click': 'Effects/snd_ui_click.wav', 'ship_bought': 'Effects/snd_ship_purchase.mp3', 'upgrade': 'Effects/snd_upgrade.wav', 'error': 'Effects/snd_error.ogg', 'low_fuel': 'Effects/snd_alarm_fuel.ogg', 'ship_destroyed': 'Effects/snd_explosion_large.mp3', 'hack_success': 'Effects/snd_access_granted.wav', 'hack_fail': 'Effects/snd_access_denied.wav', 'virus_infect': 'Effects/snd_alarm_red.ogg', 'virus_clean': 'Effects/snd_heal.wav', 'message_system': 'Effects/snd_ui_tap.wav' }; // Assuming Effects folder, Added hack and virus sounds, and a sound for console messages

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
        inventory: { ore: 0, food: 0, tech: 0 },
        class: 'Interceptor',
        name: "Player",
        viruses: [] // Initialize viruses
    },
    map: {},
    ports: [],
    planets: [],
    npcs: [], // Stores SHIP objects from ship_definitions.js
    stars: [],
    hazards: [],
    audioInitialized: false,
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

// --- DOM REFERENCES ---
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

// --- HELPERS ---
function getRandomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function getRandomElement(arr) { if (!arr || arr.length === 0) return null; return arr[Math.floor(Math.random() * arr.length)]; }
function getRandomImage(imageArray) {
    if (!imageArray || imageArray.length === 0) return '';
    const idx = Math.floor(Math.random() * imageArray.length);
    return imageArray[idx];
}

// --- AUDIO --- (initAudioControls and playSoundEffect remain largely the same, just ensure game.sfxVolume is used)
function initAudioControls() {
    ui.musicThemeSelect.innerHTML = '';
    musicThemes.forEach((t) => {
        const o = document.createElement('option');
        o.value = t.file;
        o.textContent = t.name;
        ui.musicThemeSelect.appendChild(o);
    });

    game.preMuteMusicVolume = parseFloat(ui.musicVolumeSlider.value);
    game.preMuteSfxVolume = parseFloat(ui.sfxVolumeSlider.value);
    game.musicVolume = game.preMuteMusicVolume; // Initialize current volume
    game.sfxVolume = game.preMuteSfxVolume;   // Initialize current volume

    ui.bgmAudio.volume = game.musicVolume;
    ui.musicVolumeLabel.textContent = `${Math.round(game.musicVolume * 100)}%`;
    ui.sfxVolumeLabel.textContent = `${Math.round(game.sfxVolume * 100)}%`;
    ui.bgmAudio.loop = ui.musicLoopCheckbox.checked;

    if (ui.musicThemeSelect.value) {
        ui.bgmAudio.src = ui.musicThemeSelect.value;
        ui.bgmAudio.load();
    }

    ui.musicVolumeSlider.oninput = () => {
        const v = parseFloat(ui.musicVolumeSlider.value);
        game.preMuteMusicVolume = v;
        if (!ui.muteCheckbox.checked) {
            ui.bgmAudio.volume = v;
            game.musicVolume = v;
        }
        ui.musicVolumeLabel.textContent = `${Math.round(v * 100)}%`;
    };

    ui.sfxVolumeSlider.oninput = () => {
        const v = parseFloat(ui.sfxVolumeSlider.value);
        game.preMuteSfxVolume = v;
        if (!ui.muteCheckbox.checked) {
            game.sfxVolume = v;
        }
        ui.sfxVolumeLabel.textContent = `${Math.round(v * 100)}%`;
    };

    ui.musicThemeSelect.onchange = () => {
        if (ui.musicThemeSelect.value) {
            ui.bgmAudio.src = ui.musicThemeSelect.value;
            ui.bgmAudio.load();
            if (game.audioInitialized && !ui.muteCheckbox.checked) {
                ui.bgmAudio.play().catch(e => console.warn("Audio play failed:", e));
            }
        }
    };
    ui.musicLoopCheckbox.onchange = () => { ui.bgmAudio.loop = ui.musicLoopCheckbox.checked; };

    ui.muteCheckbox.onchange = () => {
        if (ui.muteCheckbox.checked) {
            ui.bgmAudio.volume = 0;
            // game.sfxVolume is effectively 0 for playSoundEffect, no need to change master game.sfxVolume here
            // just ensure playSoundEffect respects a "muted" state or this direct change.
            // For simplicity, we'll set game.sfxVolume to 0 for mute, and restore it.
            _currentSfxVol = game.sfxVolume; // temp store
            game.sfxVolume = 0;


            ui.musicVolumeSlider.disabled = true;
            ui.sfxVolumeSlider.disabled = true;
        } else {
            ui.bgmAudio.volume = game.preMuteMusicVolume;
            game.musicVolume = game.preMuteMusicVolume;
            game.sfxVolume = game.preMuteSfxVolume; // Restore SFX volume

            ui.musicVolumeSlider.disabled = false;
            ui.sfxVolumeSlider.disabled = false;
            if (game.audioInitialized && ui.bgmAudio.src && ui.bgmAudio.paused) {
                 ui.bgmAudio.play().catch(e => console.warn("Audio play failed on unmute:", e));
            }
        }
    };
    ui.musicVolumeSlider.disabled = ui.muteCheckbox.checked;
    ui.sfxVolumeSlider.disabled = ui.muteCheckbox.checked;
}

function playSoundEffect(effectName) {
    if (!game.audioInitialized || !soundEffects[effectName] || game.sfxVolume === 0) return; // Check game.sfxVolume for mute
    try {
        const sfxClone = ui.sfxAudio.cloneNode(); // Play multiple sounds concurrently
        sfxClone.src = soundEffects[effectName];
        sfxClone.volume = game.sfxVolume;
        sfxClone.play().catch(e => console.warn(`SFX clone failed: ${effectName}`, e));
        sfxClone.onended = () => sfxClone.remove(); // Clean up
    } catch (e) {
        console.warn(`SFX error for ${effectName}:`, e);
    }
}

function attemptFirstAudioPlay() {
    if (!game.audioInitialized && ui.bgmAudio.src) {
        console.log("Attempting BGM...");
        ui.bgmAudio.play().then(() => {
            console.log("BGM started.");
            game.audioInitialized = true;
        }).catch(e => {
            console.warn("BGM failed:", e);
            // Mark as initialized to avoid repeated attempts, user might need to click again if browser blocks autoplay.
            game.audioInitialized = true;
        });
    }
}

// --- CONSOLE MESSAGES ---
function displayConsoleMessage(message, type = 'neutral', sound = 'message_system') {
    if (arguments.length === 2 && soundEffects[type] && !soundEffects[sound]) {
        sound = type; type = 'neutral';
    }
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    game.consoleMessages.unshift({ text: message, type: type, timestamp: timestamp });
    if (game.consoleMessages.length > game.maxConsoleMessages) game.consoleMessages.pop();
    updateConsoleDisplay();
    playSoundEffect(sound);
}

function updateConsoleDisplay() {
    ui.consoleMessagesDiv.innerHTML = '';
    game.consoleMessages.forEach(msgObj => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('console-message', `console-message-${msgObj.type}`);
        messageElement.textContent = `[${msgObj.timestamp}] ${msgObj.text}`; // Use textContent for security
        ui.consoleMessagesDiv.appendChild(messageElement);
    });
    ui.consoleMessagesDiv.scrollTop = 0;
}


// --- INITIALIZATION ---
function initGame() {
    console.log("Init Game...");
	// If you have a global nextShipIdCounter in ship_definitions.js, reset it here for new games:
    if (typeof nextShipIdCounter !== 'undefined') {
        nextShipIdCounter = 1;
    }
	
	game.inCombatWith = null;
	game.audioInitialized = false;
	
	// Reset Solar Array state
    if (game.solarArrayIntervalId) {
        clearInterval(game.solarArrayIntervalId);
    }
    game.solarArrayDeployed = false;
    game.solarArrayIntervalId = null;
	
	// Reset lottery state
    game.lottery.isActive = false;
    game.lottery.stage = 'pick';
    game.lottery.userNumbers = [];
    game.lottery.drawnNumbers = [];
    game.lottery.spinningIntervals.forEach(clearInterval); // Clear any leftover animation intervals
    game.lottery.spinningIntervals = [];
    game.lottery.currentDrawingDigitIndex = 0;
    game.lottery.matches = 0;
    game.lottery.winnings = 0;
	// Initialize play limit properties for a new game
    game.lottery.playsThisPeriod = 0;
    game.lottery.lastPlayPeriodResetMoveCount = 0; // Or game.moveCount if starting a loaded game where moveCount > 0
	
    if (ui.deploySolarArrayButton) { // Ensure button exists before trying to set text
         ui.deploySolarArrayButton.textContent = 'Deploy Solar Array';
    }
    
	const mapSize = parseInt(ui.mapSizeSelect.value);
    game.mapSize = mapSize;
    game.player.class = 'Interceptor';
    game.player.ship = { ...shipClasses['Interceptor'] };
    game.player.inventory = { ore: 0, food: 0, tech: 0 };
    game.player.credits = 5000;
    game.player.viruses = []; // Initialize viruses
    game.consoleMessages = []; // Clear console messages on new game

    if (mapSize === 5000) { game.mapWidth = 100; game.mapHeight = 50; } 
	else if (mapSize === 10000) { game.mapWidth = 100; game.mapHeight = 100; } 
	else if (mapSize === 20000) { game.mapWidth = 200; game.mapHeight = 100; }
    game.player.x = 1; game.player.y = 1;
    game.map = {}; game.ports = []; game.planets = []; game.npcs = []; game.stars = []; game.hazards = [];
    game.hasMoved = false; game.moveCount = 0;
	game.tradeQuantity = 1;
	game.tradeMode = 'single'; // 'single', 'multi', 'all'

    const totalSectors = game.mapWidth * game.mapHeight;
    const startPortCapacity = { ore: 5000, food: 5000, tech: 5000 };

    // Initialize Start Space Port with higher security and credits
    const startPortData = { x: 1, y: 1, type: 'spacePort', name: "Starbase Prime", prices: { ore: getRandomInt(50, 100), food: getRandomInt(20, 50), tech: getRandomInt(100, 300) }, capacity: startPortCapacity, stock: { ...startPortCapacity }, securityLevel: getRandomInt(5, 8), credits: getRandomInt(50000, 200000) };
	game.ports.push(startPortData);
    game.map[`1,1`] = { type: 'spacePort', data: startPortData };

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
                    credits: isSpacePort ? getRandomInt(50000, 200000) : getRandomInt(5000, 20000)
                };
                if (!isSpacePort) { // This block is specifically for 'port' types, not 'spacePort'
                    const pType = getRandomElement(portTypes);
                    objectData.portType = pType;
                    objectData.behavior = { ore: pType[0], food: pType[1], tech: pType[2] };
                    commodities.forEach(c => { if (objectData.behavior[c] === 'B') { objectData.stock[c] = 0; } });

                    // Assign owner FOR TRADING PORTS
                    const ran_owner_num = getRandomInt(1, 100);
                    if (ran_owner_num <= 60) { 
                        objectData.owner = "Independent Operators"; // Line 449 is likely one of these .owner assignments
                    } else if (ran_owner_num <= 80) { 
                        objectData.owner = FACTION_DURAN;
                    } else { // Remaining 20% for Vinari
                        objectData.owner = FACTION_VINARI;
                    }
                    // You can add more factions or adjust percentages here
                } else {
                    // Spaceports don't have owners in the same way for purchase, or have a default
                    objectData.owner = "Galactic Authority"; // Example for Spaceports
                }
				
				// --- NEW COMBAT STATS FOR PORTS/SPACEPORTS ---
                objectData.isStation = true; // Flag to identify it as a station in combat logic
                objectData.ship_name = objectData.name; // For consistency with Ship objects
                objectData.faction = objectData.owner || (isSpacePort ? "Galactic Authority" : "Independent Operators"); // Use owner as faction for combat display
                objectData.ship_class = isSpacePort ? "Starbase Defence Grid" : "Fortified Trading Post"; // For display

                objectData.maxHull = isSpacePort ? getRandomInt(15000, 30000) : getRandomInt(3000, 8000);
                objectData.currentHull = objectData.maxHull;
                objectData.maxShields = isSpacePort ? getRandomInt(10000, 20000) : getRandomInt(1500, 4000);
                objectData.currentShields = objectData.maxShields;
                
                // Defensive armaments based on security level and type
                let defenseFactor = (objectData.securityLevel || 0) + 1;
                objectData.fighterSquadrons = isSpacePort ? getRandomInt(2, 5) * defenseFactor : getRandomInt(1, 3) * defenseFactor;
                objectData.gunEmplacements = isSpacePort ? getRandomInt(10, 20) * defenseFactor : getRandomInt(4, 10) * defenseFactor;
                objectData.missileLaunchers = isSpacePort ? getRandomInt(1, 3) * defenseFactor : getRandomInt(0, 1) * defenseFactor;

                // Basic bounty calculation for destroying it
                objectData.bounty = Math.floor((objectData.maxHull + objectData.maxShields) / 20 + 
                                             objectData.fighterSquadrons * 100 + 
                                             objectData.gunEmplacements * 50 +
                                             objectData.missileLaunchers * 200);
				objectData.bounty = Math.max(100, objectData.bounty); // Ensure some bounty

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
                objectData = { x, y, name: getRandomElement(planetNames) + `-${getRandomInt(1, 99)}`, planetType: getRandomElement(planetTypes), ownership: getRandomElement(planetOwnership), atmosphere: getRandomElement(planetAtmospheres), lifeSigns: Math.random() < 0.3 ? 'Yes' : 'No', habitationSigns: (this.ownership !== 'Unclaimed' || Math.random() < 0.1) ? 'Yes' : 'No' };
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
                    // newNpc.hostileLevel = (obj.faction === FACTION_VINARI || obj.faction === FACTION_DURAN) ? "Med" : "Low"; // Example hostility
                    objectData = newNpc;
                    game.npcs.push(objectData);
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

function regeneratePortStock() {
    game.ports.forEach(p => {
        const r = 1000; // Stock regeneration divisor
        const b = 1; // Minimum stock increment
        if (p.type === 'spacePort') {
            commodities.forEach(c => {
                const a = Math.max(b, Math.round(p.capacity[c] / r));
                p.stock[c] = Math.min(p.stock[c] + a, p.capacity[c]);
            });
        } else {
            commodities.forEach(c => {
                if (p.behavior[c] === 'S') {
                    const a = Math.max(b, Math.round(p.capacity[c] / r));
                    p.stock[c] = Math.min(p.stock[c] + a, p.capacity[c]);
                }
            });
        }
        // Regenerate credits
        const maxCredits = p.type === 'spacePort' ? 200000 : 20000;
        if (p.credits < maxCredits) {
            p.credits += Math.max(1, Math.round(p.credits * 0.01)); // 1% or min 1
            p.credits = Math.min(p.credits, maxCredits); // Cap at max
        }
    });
}


// --- UI UPDATE FUNCTIONS ---
function updateShipStatus() {
    const s = game.player.ship;
    const p = game.player;
    const c = Object.values(p.inventory).reduce((a, b) => a + b, 0);
    // Display active viruses with their names
    let virusStatus = p.viruses.length > 0 ? `\nViruses: ${p.viruses.map(v => v.name).join(', ')}` : '';
    ui.shipInfo.innerHTML = `
                <div>Class: ${p.class}</div>
                <div>Hull: ${s.hull}/${s.maxHull}</div>
                <div>Fuel: ${s.fuel}/${s.maxFuel}</div>
                <div>Credits: ${p.credits}</div>
                <div>Cargo: ${c}/${s.maxCargoSpace}</div>
                <div>Shields: ${s.shields}/${s.maxShields}</div>
                <div>Mines: ${s.mines}/${s.maxMines}</div>
                <div>Fighters: ${s.fighters}/${s.maxFighters}</div>
                <div>Missiles: ${s.missiles}/${s.maxMissiles}</div>
                <div>Gnd Forces: ${s.gndForces}/${s.maxGndForces}</div>
                <div>Scanner: ${s.scanner.model} (${s.scanner.range})</div>
                <div>Cloak Energy: ${s.cloakEnergy}/${s.maxCloakEnergy}</div>
                <div>Warp Drive: ${s.warpDrive}</div>
                <div>Computer LVL: ${s.computerLevel}</div>
                ${virusStatus}
            `; // Added Computer Level and Viruses
}
function updateInventory() {
    ui.invInfo.innerHTML = `
                <div>Ore: ${game.player.inventory.ore}</div>
                <div>Food: ${game.player.inventory.food}</div>
                <div>Tech: ${game.player.inventory.tech}</div>
            `;
}
function updateInformationFeed() {
    const sectorInfo = game.map[`${game.player.x},${game.player.y}`]; // Use 'sectorInfo' to avoid conflict
    let htmlOutput = ''; // Use 'htmlOutput'
    const sectorIdentifier = "[Neutral]"; // Placeholder
    const currentCoords = `${game.player.x},${game.player.y}`;
    const formatLine = (label, value) => `<strong>${label}:</strong> ${value || 'N/A'}\n`; // Renamed helper

    if (sectorInfo) {
        const entityData = sectorInfo.data; // Use 'entityData'
        switch (sectorInfo.type) {
            case 'port':
                htmlOutput += formatLine("Name", entityData.name);
				let ownerDisplay = "N/A";
                if (entityData.owner === game.player.name) {
                    ownerDisplay = `You (${game.player.name})`;
                } else if (entityData.owner && entityData.owner !== "Independent Operators" && entityData.owner !== null) {
                    ownerDisplay = entityData.owner; // Displays faction name
                } else {
                    ownerDisplay = "Independent Operators"; // For unowned/generic
                }
                htmlOutput += formatLine("Owner", ownerDisplay);
                htmlOutput += formatLine("Type", `Port(${entityData.portType})`);
                htmlOutput += formatLine("Ore $", entityData.prices.ore);
                htmlOutput += formatLine("Food $", entityData.prices.food);
                htmlOutput += formatLine("Tech $", entityData.prices.tech);
                htmlOutput += formatLine("Fuel $", `${equipmentCosts.fuel.unitCost}/u`);
                if (game.player.ship.computerLevel >= entityData.securityLevel) {
                    htmlOutput += formatLine("Port Credits", entityData.credits);
                    htmlOutput += formatLine("Security LVL", entityData.securityLevel);
                } else {
                    htmlOutput += formatLine("Port Credits", "Unknown");
                    htmlOutput += formatLine("Security LVL", `LVL ${entityData.securityLevel} (Req: ${entityData.securityLevel})`);
                }
                break;
            case 'spacePort':
                htmlOutput += formatLine("Name", entityData.name);
                htmlOutput += formatLine("Type", "Space Port");
                htmlOutput += formatLine("Fuel $", `${equipmentCosts.fuel.unitCost}/u`);
                if (game.player.ship.computerLevel >= entityData.securityLevel) {
                    htmlOutput += formatLine("Port Credits", entityData.credits);
                    htmlOutput += formatLine("Security LVL", entityData.securityLevel);
                } else {
                    htmlOutput += formatLine("Port Credits", "Unknown");
                    htmlOutput += formatLine("Security LVL", `LVL ${entityData.securityLevel} (Req: ${entityData.securityLevel})`);
                }
                break;
            case 'planet':
                htmlOutput += formatLine("Name", entityData.name);
                htmlOutput += formatLine("Type", entityData.planetType);
                htmlOutput += formatLine("Owner", entityData.ownership);
                htmlOutput += formatLine("Atmosphere", entityData.atmosphere);
                htmlOutput += formatLine("Temp", `${entityData.temperature}°F`);
                htmlOutput += formatLine("Life", entityData.lifeSigns);
                htmlOutput += formatLine("Habitation", entityData.habitationSigns);
                break;
            case 'npc_trader': // Generic Trader
            case 'vinari_ship': // Vinari
            case 'duran_ship':  // Duran
                const npcShip = entityData; // This is a Ship object
                htmlOutput += formatLine("Name", npcShip.ship_name);
                htmlOutput += formatLine("Faction", npcShip.faction);
                htmlOutput += formatLine("Class", npcShip.ship_class);
                // Display shield and hull percentages
                htmlOutput += formatLine("Shields", `${npcShip.current_shields}/${npcShip.max_shields} (${npcShip.getShieldPercentage().toFixed(0)}%)`);
                htmlOutput += formatLine("Hull", `${npcShip.current_hull}/${npcShip.max_hull} (${npcShip.getHullPercentage().toFixed(0)}%)`);
                htmlOutput += formatLine("Fighters", npcShip.fighter_squadrons > 0 ? npcShip.fighter_squadrons : "None");
                htmlOutput += formatLine("Missiles", npcShip.missile_launchers > 0 ? npcShip.missile_launchers : "None");
				htmlOutput += formatLine("Bounty", `${npcShip.bounty} cr`);
                // Hostility can be implied by faction for now
                let hostilityDisplay = "Unknown";
                if (npcShip.faction === FACTION_VINARI || npcShip.faction === FACTION_DURAN) hostilityDisplay = "Likely Hostile";
                else if (npcShip.faction === FACTION_TRADER) hostilityDisplay = "Neutral";
                htmlOutput += formatLine("Disposition", hostilityDisplay);
                break;
            case 'hazard':
                htmlOutput += formatLine("Type", `Hazard (${entityData.hazardType || 'Unknown'})`);
                if (entityData.hazardType === 'Asteroid Field') htmlOutput += formatLine("Density", "Variable");
                // Add other hazard specific details
                htmlOutput += formatLine("Risk", "Varies");
                break;
            case 'star':
                htmlOutput += formatLine("Name", entityData.name);
                htmlOutput += formatLine("Type", entityData.starType);
                htmlOutput += formatLine("Radiation", `${entityData.radiationLvl} Rads`);
                const gravDesc = typeof entityData.gravityLvl === 'number' ? `${entityData.gravityLvl.toFixed(1)} G` : entityData.gravityLvl;
                htmlOutput += formatLine("Gravity", gravDesc);
                break;
            default:
                htmlOutput += formatLine("Type", `Unknown (${sectorInfo.type})`);
                break;
        }
        htmlOutput = formatLine("Sector", sectorIdentifier) + formatLine("Coords", currentCoords) + htmlOutput;

    } else { // Empty Sector
        htmlOutput += formatLine("Sector", sectorIdentifier);
        htmlOutput += formatLine("Coords", currentCoords);
        htmlOutput += formatLine("Type", "Empty");
        htmlOutput += formatLine("Scan", "Clear");
    }
    ui.infoFeedContent.innerHTML = htmlOutput.trim();
}

function renderMap() {
    const mapCache = new Map(); // Cache rendered sectors
    let m = '';
    const hW = Math.floor(game.viewWidth / 2); const hH = Math.floor(game.viewHeight / 2);
    let sX = Math.max(0, Math.min(game.player.x - hW, game.mapWidth - game.viewWidth));
    let sY = Math.max(0, Math.min(game.player.y - hH, game.mapHeight - game.viewHeight));
    const eX = sX + game.viewWidth; const eY = sY + game.viewHeight;
    const r = game.player.ship.scanner.range;

    for (let y = sY; y < eY; y++) {
        for (let x = sX; x < eX; x++) {
            const key = `${x},${y}`;
            if (mapCache.has(key)) { m += mapCache.get(key); continue; }
            let symbol = '.';
            if (x === game.player.x && y === game.player.y) {
                symbol = '@';
            } else {
                const d = Math.abs(x - game.player.x) + Math.abs(y - game.player.y);
                if (d <= r) {
                    const s = game.map[key];
                    if (s) {
                        switch (s.type) {
                            case 'port': symbol = 'P'; break;
                            case 'spacePort': symbol = 'S'; break;
                            case 'planet': symbol = 'O'; break;
                            case 'star': symbol = 'B'; break;
                            case 'npc_trader': symbol = 'C'; break;
                            case 'vinari_ship': symbol = 'V'; break;
                            case 'duran_ship': symbol = 'D'; break;
                            case 'hazard': symbol = 'H'; break;
                            default: symbol = '?'; break;
                        }
                    }
                } else {
                    symbol = ' '; // Unscanned area
                }
            }
            mapCache.set(key, symbol);
            m += symbol;
        }
        m += '\n';
    }
    ui.mapDisplay.textContent = m;
}


// In CosmicTrader/script.js
// Replace your entire existing updateInteraction function with this:

function updateInteraction() {
    const currentCoords = `${game.player.x},${game.player.y}`;
    const sector = game.map[currentCoords];
    let displayHTML = '';         // For the main interaction display (center image/text)
    let controlsHTML = '';        // For the right-side interaction panel
    let spacePortActionsHTML = '';// For the center-bottom "Computer" console actions
    let spacePortBoxTitle = 'Computer';
    let showSpacePortBox = true;  // Most of the time, the "Computer" actions box is shown

    if (game.inCombatWith) { // --- 1. COMBAT UI ---
        const targetEntity = game.inCombatWith; // Could be an NPC ship or a Port/Station
        spacePortBoxTitle = `COMBAT ENGAGED: ${targetEntity.ship_name || targetEntity.name}`;
        
        displayHTML = targetEntity.image_path ? 
            `<img src="${targetEntity.image_path}" alt="${targetEntity.ship_class || (targetEntity.isStation ? 'Installation' : 'Unknown Ship')}" class="interaction-image" style="max-height: 120px; border: 1px solid #f00;">` : 
            `Engaging ${targetEntity.ship_class || (targetEntity.isStation ? 'Installation' : 'Unknown Ship')}!`;
        
        displayHTML += `<pre>Target: ${targetEntity.ship_name || targetEntity.name} (${targetEntity.faction || (targetEntity.isStation ? targetEntity.owner : 'Unknown Faction')})\n` +
                       `Shields: ${targetEntity.currentShields}/${targetEntity.maxShields} (${targetEntity.getShieldPercentage ? targetEntity.getShieldPercentage().toFixed(0) : 'N/A'}%)\n` +
                       `Hull: ${targetEntity.currentHull}/${targetEntity.maxHull} (${targetEntity.getHullPercentage ? targetEntity.getHullPercentage().toFixed(0) : 'N/A'}%)\n`;
        
        if (targetEntity.isStation) {
            displayHTML += `Fighters: ${targetEntity.fighterSquadrons || 0} | Guns: ${targetEntity.gunEmplacements || 0} | Missiles: ${targetEntity.missileLaunchers || 0}\n`;
        } else { // It's a ship
            displayHTML += `Fighters: ${targetEntity.fighter_squadrons || 0} | Missiles: ${targetEntity.missile_launchers || 0}\n`;
        }
        displayHTML += `Bounty: ${(targetEntity.bounty || 0)} cr</pre>`;
        
        controlsHTML = `<p><strong>Combat Log / Status:</strong></p><p>Refer to Computer Console. Choose your action below.</p>`; 

        spacePortActionsHTML = `<div><p>Combat Actions:</p>
            <div class="button-group">
                <button onclick="triggerAction('playerExecuteAttack')">Fire Guns</button>
                <button onclick="triggerAction('playerLaunchFighters')" ${game.player.ship.fighters <= 0 ? 'disabled' : ''}>Launch Fighters (${game.player.ship.fighters})</button>
                <button onclick="triggerAction('playerFireMissile')" ${game.player.ship.missiles <= 0 ? 'disabled' : ''}>Fire Missile (${game.player.ship.missiles})</button>
            </div>
            <div><button onclick="triggerAction('attemptFleeCombat')">Attempt to Flee</button></div>
        </div>`;
        showSpacePortBox = true;

    } else if (sector && sector.type === 'port' && game.lottery.isActive) {
        // --- 2. LOTTERY UI (Only at 'port' type locations) ---
        spacePortBoxTitle = "Galactic Lottery Terminal";
        displayHTML = `<img src="Images/ui/lottery_terminal.png" alt="Lottery Terminal" onerror="this.style.display='none'; this.nextSibling.style.display='block';" class="interaction-image" style="max-height:150px;">`;
        displayHTML += `<div style="display:none; text-align:center; padding: 20px 0;">[LOTTERY TERMINAL ART]</div>`; 
        displayHTML += `<p style="text-align:center;">Welcome! Pick your lucky digits below.</p>`;
        
        controlsHTML = `<p>Lottery session active. Cost: ${game.lottery.ticketCost}cr per play.</p><hr style="border-color:#050;"><p>Use the terminal controls in the main panel below.</p>`;
        
        spacePortActionsHTML = generateLotteryUI(); 
        showSpacePortBox = true;

    } else if (sector) { // --- 3. NORMAL NON-COMBAT, NON-LOTTERY INTERACTION UI ---
        const entityData = sector.data;
        const mapObjectType = sector.type; 

        switch (mapObjectType) {
            case 'port':
                spacePortBoxTitle = `Port: ${entityData.name || 'Trading Port'}`;
                displayHTML = `<img src="${getRandomImage(portImages)}" alt="Port" class="interaction-image">`;
                
                let stockInfoHTML = '<pre style="text-align: left; margin-top: 10px; margin-bottom: 10px;"><u>Stock Status</u>\n';
                stockInfoHTML += `Comm. | Mode    | Stock / Capacity\n`;
                stockInfoHTML += `------|---------|-----------------\n`;
                commodities.forEach(comm => {
                    const mode = entityData.behavior[comm] === 'S' ? 'Selling' : 'Buying ';
                    const stockStr = String(entityData.stock[comm]).padStart(5);
                    const capacityStr = String(entityData.capacity[comm]).padStart(5);
                    const commName = (comm.charAt(0).toUpperCase() + comm.slice(1)).padEnd(5);
                    stockInfoHTML += `${commName} | ${mode} | ${stockStr} / ${capacityStr}\n`;
                });
                stockInfoHTML += '</pre>';
                
                const playsLeft = game.lottery.maxPlaysPerPeriod - game.lottery.playsThisPeriod;
                const canPlayLottery = playsLeft > 0 && game.player.credits >= game.lottery.ticketCost;
                
                controlsHTML = stockInfoHTML + `<hr style="border-color: #050;"><p>Port Activities:</p>` +
                               `<div><button data-action="attemptStealResources">Steal Resources</button></div>` +
                               `<div><button data-action="attemptHackPort">Hack Credits</button></div>` +
                               `<div><button data-action="playLottery" ${!canPlayLottery ? 'disabled' : ''}>Play Lottery (${game.lottery.ticketCost}cr)</button> <span style="font-size:10px;">(Plays left: ${playsLeft})</span></div>` +
                               (entityData.owner !== game.player.name && entityData.owner !== "Galactic Authority" && entityData.owner !== FACTION_DURAN && entityData.owner !== FACTION_VINARI && entityData.owner !== "Federation" && entityData.owner !== "Pirate" ? `<div><button data-action="attemptPurchasePort">Inquire Purchase</button></div>` : (entityData.owner === game.player.name ? '<p><em>You own this port.</em></p>' : '<p><em>State-owned.</em></p>')) +
                               `<div><button data-action="payForTip">Pay Tip(25cr)</button></div>` +
                               `<hr style="border-color: #050;"><div><button data-action="scanInstallation">Scan Defenses</button></div>` +
                               (entityData.owner !== game.player.name ? `<div><button data-action="attackPort" style="background-color:#500; color:#fcc;">Attack Installation</button></div>` : '');
                
                // Display last scanned stats if available for this port
                if (game.lastScannedPortStats && game.lastScannedPortStats.id === currentCoords) { // Assuming currentCoords can be an ID
                    controlsHTML += `<hr style="border-color: #050;"><p><strong>Scan Data (${game.lastScannedPortStats.name}):</strong><br>
                                     Hull: ${game.lastScannedPortStats.hull}, Shields: ${game.lastScannedPortStats.shields}<br>
                                     Fighters: ${game.lastScannedPortStats.fighters}, Guns: ${game.lastScannedPortStats.guns}</p>`;
                }


                let currentTradeQuantity = 1;
                const existingTradeQtyInput = document.getElementById('trade-quantity');
                if (existingTradeQtyInput && existingTradeQtyInput.value) {
                    currentTradeQuantity = parseInt(existingTradeQtyInput.value);
                    if (isNaN(currentTradeQuantity) || currentTradeQuantity <= 0) currentTradeQuantity = 1;
                }

                spacePortActionsHTML = `
                    <div> 
                        <div style="margin-bottom: 8px;"> 
                            <label for="trade-quantity" style="margin-right: 5px;">Quantity:</label>
                            <input type="number" id="trade-quantity" value="${currentTradeQuantity}" min="1" style="width: 70px; margin-right: 10px;">
                            <span style="font-size:10px;">(Set Qty for Buy/Sell buttons)</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; gap: 15px; margin-bottom: 8px;"> 
                            <div style="flex: 1; border: 1px solid #030; padding: 6px; background: #1a1a1a;">
                                <p style="margin-top:0; margin-bottom: 1px; font-weight: bold;">Trade Commodities:</p>
                                <p style="font-size:10px; margin-top:0; margin-bottom: 5px;">(Prices: Ore ${entityData.prices.ore}, Food ${entityData.prices.food}, Tech ${entityData.prices.tech})</p>
                                <div class="button-group">
                                    <button onclick="triggerAction('tradeByInput','buy','ore')" ${entityData.stock.ore<=0||entityData.behavior.ore==='B'?'disabled':''}>Buy Ore</button>
                                    <button onclick="triggerAction('tradeByInput','buy','food')" ${entityData.stock.food<=0||entityData.behavior.food==='B'?'disabled':''}>Buy Food</button>
                                    <button onclick="triggerAction('tradeByInput','buy','tech')" ${entityData.stock.tech<=0||entityData.behavior.tech==='B'?'disabled':''}>Buy Tech</button>
                                </div>
                                <div class="button-group" style="margin-top:5px;">
                                    <button onclick="triggerAction('tradeByInput','sell','ore')" ${game.player.inventory.ore<=0||entityData.behavior.ore==='S'?'disabled':''}>Sell Ore</button>
                                    <button onclick="triggerAction('tradeByInput','sell','food')" ${game.player.inventory.food<=0||entityData.behavior.food==='S'?'disabled':''}>Sell Food</button>
                                    <button onclick="triggerAction('tradeByInput','sell','tech')" ${game.player.inventory.tech<=0||entityData.behavior.tech==='S'?'disabled':''}>Sell Tech</button>
                                </div>
                            </div>
                            <div style="flex: 1; border: 1px solid #030; padding: 6px; background: #1a1a1a;">
                                <p style="margin-top:0; margin-bottom: 1px; font-weight: bold;">Bulk Actions:</p>
                                <p style="font-size:10px; margin-top:0; margin-bottom: 5px; line-height: 1;">&nbsp;</p> 
                                <div class="button-group">
                                    <button onclick="triggerAction('tradeAll','buy','ore')" ${entityData.behavior.ore==='B'?'disabled':''}>Max Buy Ore</button>
                                    <button onclick="triggerAction('tradeAll','buy','food')" ${entityData.behavior.food==='B'?'disabled':''}>Max Buy Food</button>
                                    <button onclick="triggerAction('tradeAll','buy','tech')" ${entityData.behavior.tech==='B'?'disabled':''}>Max Buy Tech</button>
                                </div>
                                <div class="button-group" style="margin-top:5px;">
                                    <button onclick="triggerAction('tradeAll','sell','ore')" ${entityData.behavior.ore==='S'?'disabled':''}>Sell All Ore</button>
                                    <button onclick="triggerAction('tradeAll','sell','food')" ${entityData.behavior.food==='S'?'disabled':''}>Sell All Food</button>
                                    <button onclick="triggerAction('tradeAll','sell','tech')" ${entityData.behavior.tech==='S'?'disabled':''}>Sell All Tech</button>
                                </div>
                            </div>
                        </div>
                        <hr style="border-color: #030; margin: 5px 0 5px 0;"> 
                        <div><p style="margin-top:0; margin-bottom: 5px;">Refuel:</p> 
                            <button onclick="triggerAction('buyFuel')" ${game.player.credits<equipmentCosts.fuel.unitCost||game.player.ship.fuel>=game.player.ship.maxFuel?'disabled':''}>Buy Fuel(${equipmentCosts.fuel.unitCost}/u)</button> 
                            <label>Amt:</label><input type="number" id="buy-fuel-amount" min="1" value="100" style="width:60px;">
                        </div>`;
                    if (entityData.owner === game.player.name) {
                        spacePortActionsHTML += `
                            <hr style="border-color: #030; margin: 5px 0 5px 0;">
                            <div><p style="margin-top:0; margin-bottom: 5px;">Upgrade Port (Owned):</p> <div><label>O:</label><input type="number" id="upgrade-ore" min="0" value="0" style="width:60px;"><label>F:</label><input type="number" id="upgrade-food" min="0" value="0" style="width:60px;"><label>T:</label><input type="number" id="upgrade-tech" min="0" value="0" style="width:60px;"><button onclick="triggerAction('upgradePort')">Upgrade Capacity</button></div></div>
                            <div style="margin-top: 5px;"><p style="margin-top:0; margin-bottom: 5px;">Upgrade Security (Owned):</p> <div><label>Target LVL:</label><input type="number" id="upgrade-security-level" min="${entityData.securityLevel + 1}" max="10" value="${Math.min(10, entityData.securityLevel + 1)}" style="width:60px;"><button onclick="triggerAction('upgradePortSecurity')">Upgrade Security</button></div></div>`;
                    }
                    if (game.player.ship.warpDrive === 'Installed') {
                        spacePortActionsHTML += `<hr style="border-color: #030; margin: 5px 0 5px 0;">` + generateWarpControlsHTML();
                    }
                spacePortActionsHTML += `</div>`;
                break;

            case 'spacePort':
                spacePortBoxTitle = `Space Port: ${entityData.name}`;
                displayHTML = `<img src="${getRandomImage(spacePortImages)}" alt="Space Port" class="interaction-image">`;
                controlsHTML = `<p>Access mainframe for services. Check Sector Information for details.</p>` +
                               `<hr style="border-color: #050;"><div><button data-action="scanInstallation">Scan Defenses</button></div>` +
                               (entityData.owner !== game.player.name ? `<div><button data-action="attackPort" style="background-color:#500; color:#fcc;">Attack Installation</button></div>` : '');
                if (game.lastScannedPortStats && game.lastScannedPortStats.id === currentCoords) {
                    controlsHTML += `<hr style="border-color: #050;"><p><strong>Scan Data (${game.lastScannedPortStats.name}):</strong><br>
                                     Hull: ${game.lastScannedPortStats.hull}, Shields: ${game.lastScannedPortStats.shields}<br>
                                     Defenses: ${game.lastScannedPortStats.fighters} Fighters, Guns: ${game.lastScannedPortStats.guns}</p>`;
                }
                spacePortActionsHTML = generateSpaceportServicesHTML() + generateSoftwareUpgradeHTML() + generateVirusRemovalHTML() + generateWarpControlsHTML();
                break;

            case 'planet':
                const pType = entityData.planetType || "?";
                const pImg = getRandomImage(planetImagesByType[pType] || planetImagesByType["Unknown"]);
                spacePortBoxTitle = `Planet: ${entityData.name}`;
                displayHTML = pImg ? `<img src="${pImg}" alt="${pType}" class="interaction-image">\nApproaching ${pType} planet, ${entityData.name}.` : `\n  #\n ###\n#####\n ###\n  #\nApproaching ${pType} planet, ${entityData.name}.`;
                controlsHTML = `<p>Planetary survey data available in Sector Information.</p><div><button data-action="scanPlanet" disabled>Detailed Planet Scan (N/I)</button></div>`;
                spacePortActionsHTML = `<div><p>Planet Actions:</p></div><div><button disabled>Land (N/I)</button></div>` + generateWarpControlsHTML();
                break;

            case 'npc_trader':
            case 'vinari_ship':
            case 'duran_ship':
                const npcShip = entityData;
                spacePortBoxTitle = `Ship Detected: ${npcShip.ship_name}`;
                displayHTML = npcShip.image_path ? `<img src="${npcShip.image_path}" alt="${npcShip.ship_class}" class="interaction-image" style="max-height: 100px; border: 1px solid #030;">` : `\n    __|__\n--=<=*=>=--\n    \\ / \nDetected ${npcShip.ship_class || '?'} (${npcShip.faction}).`;
                controlsHTML = `<p>Comms / Tactical Options:</p>
                                <div><button data-action="hailNPC">Hail Ship</button></div>
                                <div><button data-action="scanShip" disabled>Detailed Ship Scan (N/I)</button></div>
                                <div><button data-action="attackNPC">Attack</button></div>`;
                spacePortActionsHTML = generateWarpControlsHTML();
                break;
            
            case 'hazard':
                const hazardType = entityData?.hazardType || 'Unknown';
                spacePortBoxTitle = `Hazard: ${hazardType}`;
                const hImg = getRandomImage(hazardImagesByType[hazardType] || hazardImagesByType["Unknown"]);
                let hMsg = "Hazardous environment readings!";
                if (hazardType === 'Mine') hMsg = "DANGER: Armed Minefield Detected!";
                else if (hazardType === 'Asteroid Field') hMsg = "Navigating dense asteroid field!";
                else if (hazardType === 'Black Hole') hMsg = "WARNING: Extreme Gravitational Distortions!";
                else if (hazardType === 'Solar Storm') hMsg = "High energy particle storm in progress!";
                else if (hazardType === 'Nebula') hMsg = "Entering dense nebula. Sensor interference likely.";
                displayHTML = hImg ? `<img src="${hImg}" alt="${hazardType}" class="interaction-image">\n${hMsg}` : `\n * * DANGER * * \n * ${hazardType} * \n * * DETECTED * * \n\n${hMsg}`;
                controlsHTML = `<p>Proceed with extreme caution. Check Sector Information for details.</p>`;
                spacePortActionsHTML = generateWarpControlsHTML();
                break;

            case 'star':
                const sType = entityData.starType || "?";
                const sImg = getRandomImage(starImagesByType[sType] || starImagesByType["Unknown"]);
                spacePortBoxTitle = `Star: ${entityData.name}`;
                displayHTML = sImg ? `<img src="${sImg}" alt="${sType}" class="interaction-image">\nApproaching ${sType} star: ${entityData.name}.` : `\n    \\ | /\n -- (O) --\n    / | \\\nApproaching ${sType} star: ${entityData.name}.`;
                controlsHTML = `<p>Extreme stellar radiation and gravity. Maintain safe distance. Check Sector Information.</p>`;
                spacePortActionsHTML = generateWarpControlsHTML();
                break;

            default: // Unknown object type
                spacePortBoxTitle = 'Computer';
                displayHTML = `\n   ??\n  ?  ?\n ? ? ?\n  ?  ?\n   ??\nUnknown anomaly detected.`;
                controlsHTML = `<p>Sensor data inconclusive. Proceed with caution.</p>`;
                spacePortActionsHTML = generateWarpControlsHTML();
                break;
        }
    } else { // --- 4. EMPTY SECTOR UI (and not in combat, not in lottery at port) ---
        spacePortBoxTitle = 'Computer';
        displayHTML = `\n    ~*~\n    . .\n    ~*~\nEmpty Space. Scanners detect nothing of interest.`;
        controlsHTML = `<p>All clear. Ready for next jump calculations.</p>`;
        spacePortActionsHTML = generateWarpControlsHTML();
        showSpacePortBox = true; 
    }

    // --- 5. Final DOM updates ---
    ui.interactionDisplay.innerHTML = displayHTML;
    ui.interactionControls.innerHTML = controlsHTML;
    ui.spacePortTitle.textContent = spacePortBoxTitle;
    ui.spacePortControls.innerHTML = spacePortActionsHTML;
    ui.spacePortBox.style.display = showSpacePortBox ? 'block' : 'none';
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


// --- Space Port/Port Action Controls HTML Generation ---
// Note: These functions generate HTML strings for the space-port-controls div.
// Buttons within these sections still use inline onclick for simplicity given their dynamic nature.
// For a larger project, consider more advanced techniques (templating, attaching listeners after render).

function generateSpaceportServicesHTML() {
    let h = '';
    h += `<div><p>Refuel:</p><button onclick="triggerAction('buyFuel')" ${game.player.credits<equipmentCosts.fuel.unitCost||game.player.ship.fuel>=game.player.ship.maxFuel?'disabled':''}>Fuel(${equipmentCosts.fuel.unitCost}/u)</button><label>Amt:</label><input type="number" id="buy-fuel-amount" min="1" value="100" style="width:60px;"></div>`;
    h += `<div><p>Equip:</p><div class="button-group">`;
    for (const t in equipmentCosts) {
        if (t === 'fuel') continue;
        const i = equipmentCosts[t];
        const c = game.player.ship[t] || 0;
        const m = game.player.ship[i.max] !== undefined ? game.player.ship[i.max] : Infinity;
        const d = game.player.credits < i.cost || c >= m;
        const l = t[0].toUpperCase() + t.slice(1).replace('Space', ' '); // Capitalize and format name
        h += `<button onclick="triggerAction('buyEquipment','${t}')" ${d?'disabled':''}>${l}(+${i.amount},${i.cost}cr)</button>`;
    }
    h += `</div></div>`;
    // Scanner Upgrade
    if (game.player.ship.scanner.model !== 'Advanced') {
        const nextModel = game.player.ship.scanner.model === 'Basic' ? 'Standard' : 'Advanced';
        const cost = scannerModels[nextModel].cost;
        const disabled = game.player.credits < cost;
        h += `<div><p>Scanner:</p><button onclick="triggerAction('upgradeScanner','${nextModel}')" ${disabled?'disabled':''}>Buy ${nextModel}(${cost}cr)</button></div>`;
    } else {
         h += `<div><p>Scanner:</p><button disabled>Advanced (Max)</button></div>`;
    }
    // Warp Drive
    const warpCost = 5000;
    const canBuyWarp = game.player.credits >= warpCost && game.player.ship.warpDrive !== 'Installed';
    h += `<div><p>Warp:</p><button onclick="triggerAction('buyWarpDrive')" ${!canBuyWarp?'disabled':''}>Install(${warpCost}cr)</button></div>`;
    // Buy Ship
    h += `<div><p>Ships(Trade:50%):</p><div class="button-group">`;
    for (const sc in shipClasses) {
        if (sc !== game.player.class) {
            const ns = shipClasses[sc];
            const { netCost } = calculateTradeIn(sc);
            const canAfford = game.player.credits >= netCost;
            h += `<button onclick="triggerAction('buyShip','${sc}')" ${canAfford?'':'disabled'}>Buy ${sc}(Net:${netCost}cr)</button>`;
        }
    }
    h += `</div></div>`;
    return h;
}

// Generates HTML for the Player Software Upgrade section (Space Port only)
function generateSoftwareUpgradeHTML() {
    const currentLevel = game.player.ship.computerLevel || 1;
    const maxLevel = 10;
    if (currentLevel >= maxLevel) return `<div><p>Software Upgrades:</p><button disabled>Computer LVL ${currentLevel} (Max)</button></div>`;

    // Cost increases with current level, making higher levels more expensive
    const cost = currentLevel * 10000 + 5000; // Example cost: Lvl 1->2 costs 15k, Lvl 2->3 costs 25k, etc.

    const disabled = game.player.credits < cost;
    return `<div><p>Software Upgrades:</p><button onclick="triggerAction('upgradeSoftware')" ${disabled?'disabled':''}>Upgrade Computer LVL ${currentLevel + 1} (${cost}cr)</button></div>`;
}

// Generates HTML for the Virus Removal section (Space Port only)
function generateVirusRemovalHTML() {
    if (game.player.viruses.length === 0) return ''; // Hide if no viruses
    const costPerVirus = 750; // Example cost
    const totalCost = game.player.viruses.length * costPerVirus;
    const disabled = game.player.credits < totalCost;
    return `<div><p>System Diagnostics:</p><button onclick="triggerAction('removeViruses')" ${disabled?'disabled':''}>Remove Viruses (${totalCost}cr)</button></div>`;
}


function generateWarpControlsHTML() {
    if (game.player.ship.warpDrive === 'Installed') {
        return `<div><p>Warp(2f/s):</p><div><label>X:</label><input type="number" id="warp-x" min="0" max="${game.mapWidth - 1}" value="${game.player.x}" style="width:60px;"><label>Y:</label><input type="number" id="warp-y" min="0" max="${game.mapHeight - 1}" value="${game.player.y}" style="width:60px;"><button onclick="triggerAction('warpToSector')">Warp</button></div></div>`;
    }
    // Only show N/I message when the space-port-actions box is visible (at a location)
    const s = game.map[`${game.player.x},${game.player.y}`];
    if (s && s.type !== 'empty') { // Check if at a location (port, planet, etc.)
         return '<div><p>Warp Drive: N/I</p></div>';
    }
    return ''; // Don't show anything if in empty space and no warp drive
}


// --- SPACE MANUAL ---
function displayManual() {
    attemptFirstAudioPlay(); // Attempt audio play on interaction
    playSoundEffect('ui_click'); // Sound for opening manual

    ui.spacePortTitle.textContent = "Instruction Manual - Please Read!";
    ui.spacePortBox.style.display = 'block'; // Show the space port actions box

    // Manual Content - You can expand on this!
    const manualContent = `
        <pre>
        COSMIC TRADER - INSTRUCTION MANUAL

        Welcome, Commander, to the vast and often dangerous cosmos!
        This manual will guide you through the basics of survival and
        profit in the star systems.

        NAVIGATION:
        Use the directional buttons (Up, Down, Left, Right) or the
        W, A, S, D keys to move your ship one sector at a time.
        Each move consumes 1 unit of Fuel.
        Watch your Fuel levels! Running out will leave you stranded.

        GALAXY MAP:
        The map shows your current sector (@) and scanned objects.
        Different symbols represent different types of locations:
        P - Port (Trade, Refuel, Upgrade Port, Activities)
        S - Space Port (Refuel, Equip Ship, Upgrade Software, Virus Removal, Warp, Buy Ship)
        O - Planet/Moon (Information, potential future interactions)
        B - Star (Information, environmental hazards)
        C - Trader (NPC Ship - potential trade or combat)
        V - Vinari Ship (NPC Ship - faction vessel)
        D - Duran Ship (NPC Ship - faction vessel)
        H - Hazard (Avoid or be prepared for consequences!)
        . - Empty Space
          - Unscanned (Outside scanner range)

        SHIP STATUS:
        Monitor your ship's Hull, Fuel, Shields, and various equipment.
        Cargo space is limited by your ship's class.
        Your Computer Level affects hacking and security interactions.
        Viruses can negatively impact your ship's performance.

        INVENTORY:
        Tracks your current stock of tradable commodities: Ore, Food, Tech.

        INTERACTION:
        Displays information about the current sector and any objects within it.
        The "Computer" box below the console provides context-sensitive actions
        based on your current location (Port, Space Port, etc.).

        PORTS:
        Buy and sell commodities based on local supply and demand.
        Prices fluctuate.
        You can refuel here.
        Owned Ports can be upgraded (capacity, security).
        Port Activities: Attempt to Steal Resources, Hack Credits, Play Lottery,
        Inquire about Purchasing the Port, or Pay for a Tip. Be cautious!

        SPACE PORTS:
        Refuel and purchase ship Equipment (Shields, Mines, Fighters, etc.).
        Upgrade your Scanner and install a Warp Drive.
        Buy new and better Ships (trade-in value is calculated).
        Access System Diagnostics for Software Upgrades and Virus Removal.

        HAZARDS:
        Entering a Hazard sector can damage your ship or have other negative effects.
        Mines are deployed by players or NPCs and cause damage on entry.

        COMBAT (N/I):
        Interaction with NPC ships is planned but not fully implemented.
        Currently, hailing may lead to combat if the NPC is hostile.

        SAVING AND LOADING:
        Use the buttons in the Game Controls to Save or Load your progress.

        VIRUSES:
        Failed hacking attempts or certain hazards can infect your ship with viruses.
        Viruses have negative effects and a limited duration.
        They can be removed at Space Ports.

        Remember to manage your resources, choose your trades wisely, and explore
        the galaxy with caution!

        </pre>
    `;

    // Populate the space-port-controls div with the manual content and a close button
    ui.spacePortControls.innerHTML = `
        <div style="white-space: pre-wrap; overflow-y: auto; max-height: 300px;">${manualContent}</div>
        <div><button id="close-manual-button">Close Manual</button></div>
    `;

    // Add event listener to the new close button
    document.getElementById('close-manual-button').addEventListener('click', hideManual);

    // Ensure other interaction controls are hidden while manual is open (if needed)
    // The updateInteraction function handles showing/hiding based on location,
    // so when the player moves, the manual view will be replaced by the location view.
}

function hideManual() {
     // This function is called when the "Close Manual" button is clicked
     // It simply calls updateUI, which will re-render the interaction box
     // based on the current location (which will hide the manual unless at a location)
     playSoundEffect('ui_click'); // Sound for closing manual
     updateUI();
}


// --- UI Update Master Function ---
function updateUI() {
    updateShipStatus();
    updateInventory();
    renderMap();
    updateInformationFeed();
    updateInteraction();
    // Enable/disable buttons based on player state
    ui.deployMineButton.disabled = game.player.ship.mines <= 0;
    ui.mapSizeSelect.disabled = game.hasMoved; // Disable map size change after first move
    // Update Solar Array button text and state
    if (ui.deploySolarArrayButton) {
        if (game.solarArrayDeployed) {
            ui.deploySolarArrayButton.textContent = 'Retract Solar Array';
            ui.deploySolarArrayButton.disabled = false; // Always allow retracting
        } else {
            ui.deploySolarArrayButton.textContent = 'Deploy Solar Array';
            // Disable deploy if fuel is full or in combat
            ui.deploySolarArrayButton.disabled = (game.player.ship.fuel >= game.player.ship.maxFuel) || !!game.inCombatWith;
        }
    }
	// Update console display
    updateConsoleDisplay();
}

// --- CORE GAME ACTIONS ---
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
        if (game.moveCount >= game.lottery.lastPlayPeriodResetMoveCount + LOTTERY_PLAYS_RESET_INTERVAL_MOVES) {
            if (game.lottery.playsThisPeriod >= game.lottery.maxPlaysPerPeriod) {
                 displayConsoleMessage("Lottery plays for the current period have been reset!", "minor");
            }
            game.lottery.playsThisPeriod = 0;
            game.lottery.lastPlayPeriodResetMoveCount = game.moveCount;
        }

        // Display the basic movement confirmation first
        displayConsoleMessage(`Moved ${direction}. Sector: ${nX}, ${nY}. Fuel: ${game.player.ship.fuel}.`);

        applyVirusEffects(); // Apply virus effects after moving

        const sector = game.map[`${nX},${nY}`]; // Get sector info for checks

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
        displayConsoleMessage("CRITICAL HULL FAILURE! SHIP DESTROYED! GAME OVER!", 'error', 'ship_destroyed');
        initGame(); // Restart the game
    } else {
       updateUI(); // Update UI if ship is still alive
    }
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

function buyFuel() {
    const input = document.getElementById('buy-fuel-amount')?.value;
    const amountToBuy = parseInt(input, 10);

    if (isNaN(amountToBuy) || amountToBuy <= 0) {
        displayConsoleMessage("Enter a positive number of fuel units to buy.", 'error');
        playSoundEffect('error');
        return;
    }

    const costPerUnit = equipmentCosts.fuel.unitCost;
    const maxCanHold = game.player.ship.maxFuel - game.player.ship.fuel;
    const actualAmountToBuy = Math.min(amountToBuy, maxCanHold);
    const totalCost = Math.ceil(actualAmountToBuy * costPerUnit);

    if (actualAmountToBuy <= 0) {
        displayConsoleMessage("Fuel tank is already full!", 'error');
        playSoundEffect('error');
        return;
    }

    if (game.player.credits < totalCost) {
        displayConsoleMessage(`Insufficient credits. Need ${totalCost} cr to buy ${actualAmountToBuy} fuel.`, 'error');
        playSoundEffect('error');
        return;
    }

    game.player.credits -= totalCost;
    game.player.ship.fuel += actualAmountToBuy;

    displayConsoleMessage(`Bought ${actualAmountToBuy} fuel for ${totalCost} cr.`);
    playSoundEffect('trade_buy'); // Use a success sound for buying
    updateUI();
}

function buyEquipment(type) {
    const itemInfo = equipmentCosts[type];
    if (!itemInfo) {
        displayConsoleMessage(`Unknown equipment type: ${type}`, 'error');
        return;
    }

    const currentAmount = game.player.ship[type] || 0;
    const maxCapacity = game.player.ship[itemInfo.max] !== undefined ? game.player.ship[itemInfo.max] : Infinity;

    if (currentAmount >= maxCapacity) {
        displayConsoleMessage(`${type[0].toUpperCase() + type.slice(1)} is already at maximum capacity!`, 'error');
        playSoundEffect('error');
        return;
    }

    const cost = itemInfo.cost;
    if (game.player.credits < cost) {
        displayConsoleMessage(`Insufficient credits. Need ${cost} cr to buy ${type}.`, 'error');
        playSoundEffect('error');
        return;
    }

    game.player.credits -= cost;
    if (game.player.ship[type] === undefined) {
        game.player.ship[type] = 0;
    }
    game.player.ship[type] += itemInfo.amount;
    game.player.ship[type] = Math.min(game.player.ship[type], maxCapacity); // Ensure we don't exceed max

    displayConsoleMessage(`Bought +${itemInfo.amount} ${type}!`);
    playSoundEffect('upgrade'); // Use upgrade sound for equipment
    updateUI();
}

function upgradeScanner(model) {
    const scannerInfo = scannerModels[model];
    if (!scannerInfo) {
        displayConsoleMessage(`Unknown scanner model: ${model}`, 'error');
        return;
    }
    // Prevent buying the same or lower model
    if (scannerModels[game.player.ship.scanner.model].range >= scannerInfo.range) {
        displayConsoleMessage(`Already have ${game.player.ship.scanner.model} or better scanner.`, 'error');
        playSoundEffect('error');
        return;
    }


    const cost = scannerInfo.cost;
    if (game.player.credits < cost) {
        displayConsoleMessage(`Insufficient credits. Need ${cost} cr to buy ${model} Scanner.`, 'error');
        playSoundEffect('error');
        return;
    }

    game.player.credits -= cost;
    game.player.ship.scanner = { model, range: scannerInfo.range };

    displayConsoleMessage(`Upgraded to ${model} Scanner!`);
    playSoundEffect('upgrade');
    updateUI();
}

function buyWarpDrive() {
    const cost = 5000;
    if (game.player.ship.warpDrive === 'Installed') {
        displayConsoleMessage("Warp Drive is already installed.", 'error');
        playSoundEffect('error');
        return;
    }

    if (game.player.credits < cost) {
        displayConsoleMessage(`Insufficient credits. Need ${cost} cr to install Warp Drive.`, 'error');
        playSoundEffect('error');
        return;
    }

    if (confirm(`Install Warp Drive for ${cost}cr?`)) {
        game.player.credits -= cost;
        game.player.ship.warpDrive = 'Installed';
        displayConsoleMessage('Warp Drive installed!');
        playSoundEffect('upgrade');
        updateUI();
    } else {
         displayConsoleMessage("Warp Drive installation cancelled.");
    }
}

function calculateTradeIn(newClass) {
    const newShip = shipClasses[newClass];
    const oldShip = shipClasses[game.player.class];

    // Value of the old ship's base price (e.g., 50%)
    const oldShipValue = (oldShip.price || 0) * 0.5;

    let equipmentValue = 0;
    // Calculate value of current equipment that exceeds the base of the new ship
    for (const type in equipmentCosts) {
        if (type === 'fuel') continue; // Fuel doesn't have trade-in value

        const itemInfo = equipmentCosts[type];
        const oldShipBaseAmount = oldShip[type] !== undefined ? oldShip[type] : 0;
        const currentPlayerAmount = game.player.ship[type] !== undefined ? game.player.ship[type] : 0;

        // Amount of equipment the player has beyond the *base* amount of their *old* ship
        const excessAmount = Math.max(0, currentPlayerAmount - oldShipBaseAmount);

        if (excessAmount > 0 && itemInfo.amount > 0) {
             // Value the excess equipment at a percentage (e.g., 50%) of its purchase cost
            equipmentValue += (excessAmount / itemInfo.amount) * itemInfo.cost * 0.5;
        }
    }

    // Value of Scanner upgrade (only if upgraded beyond the old ship's base scanner)
    const currentScannerCost = scannerModels[game.player.ship.scanner.model].cost;
    const oldScannerCost = scannerModels[oldShip.scanner.model].cost;
    if (currentScannerCost > oldScannerCost) {
        equipmentValue += (currentScannerCost - oldScannerCost) * 0.5; // Value difference at 50%
    }

    // Value of Warp Drive (if installed)
    if (game.player.ship.warpDrive === 'Installed' && oldShip.warpDrive !== 'Installed') {
        equipmentValue += 5000 * 0.5; // Value Warp Drive at 50% of installation cost
    }

    // Value for computer level (only if upgraded beyond the old ship's base level)
    const oldComputerLevel = oldShip.computerLevel || 1;
    const currentComputerLevel = game.player.ship.computerLevel || 1;
    if (currentComputerLevel > oldComputerLevel) {
         // Value each level *beyond* the old ship's base level
        const levelDiff = currentComputerLevel - oldComputerLevel;
         // Use a value that scales with the upgrade cost - maybe related to the average upgrade cost?
         // Average cost is roughly currentLevel * 10000 + 5000. Let's use a fixed value per level for simplicity in trade-in.
        equipmentValue += levelDiff * 4000; // Example: 4k per level beyond old ship's base
    }


    const totalTradeIn = Math.floor(oldShipValue + equipmentValue);
    const netCost = newShip.price - totalTradeIn; // This can be negative if trade-in value exceeds new ship cost

    return { totalTradeIn: totalTradeIn, netCost: netCost };
}

function buyShip(newClass) {
    const newShipStats = shipClasses[newClass];
    if (!newShipStats) {
        displayConsoleMessage(`Unknown ship class: ${newClass}`, 'error');
        return;
    }

    const { totalTradeIn, netCost } = calculateTradeIn(newClass);

    if (game.player.credits < netCost) {
        displayConsoleMessage(`Insufficient credits. Need ${netCost} cr to buy the ${newClass}.`, 'error');
        playSoundEffect('error');
        return;
    }

    const currentCargoTotal = Object.values(game.player.inventory).reduce((a, b) => a + b, 0);
    let confirmMessage = `Trade your ${game.player.class} for a ${newClass}?\nNet Cost: ${netCost} cr`;

    if (currentCargoTotal > newShipStats.maxCargoSpace) {
        confirmMessage += `\nWarning: You have ${currentCargoTotal} cargo, but the ${newClass} only has ${newShipStats.maxCargoSpace} space.\nExcess cargo will be jettisoned.`;
    }
    confirmMessage += "\nConfirm purchase?";


    if (confirm(confirmMessage)) {
        game.player.credits -= netCost;
        game.player.class = newClass;

        // Copy ship properties from the new class definition
        // IMPORTANT: Preserve the player's *current* computer level if it's higher than the new ship's base level
        const currentComputerLevel = game.player.ship.computerLevel || 1;
        game.player.ship = { ...newShipStats };
        // Ensure the new ship has at least the player's current computer level (if player upgraded it)
        game.player.ship.computerLevel = Math.max(newShipStats.computerLevel || 1, currentComputerLevel);


        if (currentCargoTotal > newShipStats.maxCargoSpace) {
            game.player.inventory = { ore: 0, food: 0, tech: 0 }; // Jettison all cargo
            displayConsoleMessage(`Bought ${newClass}! Excess cargo jettisoned.`);
        } else {
            displayConsoleMessage(`Bought ${newClass}! Enjoy your new ship.`);
        }
        playSoundEffect('ship_bought');
        updateUI(); // Update UI with new ship stats and potentially empty inventory
    } else {
        displayConsoleMessage("Ship purchase cancelled.");
    }
}


function trade(action, commodity, quantityToTransact = 1) { // quantityToTransact added, defaults to 1
    const sector = game.map[`${game.player.x},${game.player.y}`];
    // Ensure trading only at designated 'port' types, not 'spacePort' for commodities
    if (!sector || sector.type !== 'port') {
        displayConsoleMessage("Commodity trading is only available at regular Ports.", 'error');
        playSoundEffect('error');
        return;
    }

    const portData = sector.data;
    let price = portData.prices[commodity]; // Price is now fixed for this transaction based on port's current price
    const isPlayerOwned = portData.owner === game.player.name;
    let effectivePrice = price;
	const currentCargoTotal = Object.values(game.player.inventory).reduce((a, b) => a + b, 0);
    const playerInventory = game.player.inventory;
    const shipCargoCapacity = game.player.ship.maxCargoSpace;
    const portBehavior = portData.behavior[commodity];
    let sound = null;
	
	// Apply discount/bonus if player owns the port
    if (isPlayerOwned) {
        if (action === 'buy') {
            effectivePrice = Math.ceil(price * 0.90); // 10% discount when buying
        } else if (action === 'sell') {
            effectivePrice = Math.floor(price * 1.10); // 10% bonus when selling
        }
    }

    if (isNaN(quantityToTransact) || quantityToTransact <= 0) {
        displayConsoleMessage("Invalid transaction quantity.", "error");
        return;
    }

    if (action === 'buy') {
        if (portBehavior === 'B') {
            displayConsoleMessage(`This Port is Buying ${commodity}, not Selling.`, 'warning');
            playSoundEffect('error');
            return;
        }

        let actualQuantityToBuy = quantityToTransact;

        if (portData.stock[commodity] < actualQuantityToBuy) {
            actualQuantityToBuy = portData.stock[commodity];
            if (actualQuantityToBuy === 0) {
                displayConsoleMessage(`Port is out of ${commodity}.`, 'warning');
                playSoundEffect('error');
                return;
            }
            displayConsoleMessage(`Port only has ${actualQuantityToBuy} units of ${commodity}. Adjusting quantity.`, 'minor');
        }

        if (currentCargoTotal + actualQuantityToBuy > shipCargoCapacity) {
            actualQuantityToBuy = shipCargoCapacity - currentCargoTotal;
            if (actualQuantityToBuy <= 0) { // Check if any can be bought after cargo adjustment
                displayConsoleMessage('Cargo bay is full! Cannot buy more.', 'warning');
                playSoundEffect('error');
                return;
            }
            displayConsoleMessage(`Cargo bay can only hold ${actualQuantityToBuy} more units. Adjusting quantity.`, 'minor');
        }
        
        const totalCost = effectivePrice * actualQuantityToBuy; // Use effectivePrice

        if (game.player.credits < totalCost) {
            // Adjust actualQuantityToBuy based on credits and effectivePrice
            actualQuantityToBuy = Math.floor(game.player.credits / effectivePrice);
            if (actualQuantityToBuy <= 0) {
                displayConsoleMessage(`Insufficient credit balance. Need ${effectivePrice} cr for at least one unit.`, 'error');
                playSoundEffect('error');
                return;
            }
            displayConsoleMessage(`Not enough credits for ${quantityToTransact}. Buying ${actualQuantityToBuy} at discounted price.`, 'minor');
            const newTotalCost = effectivePrice * actualQuantityToBuy; // Recalculate with adjusted quantity
            game.player.credits -= newTotalCost;
        } else {
            game.player.credits -= totalCost;
        }

        if (actualQuantityToBuy > 0) {
            playerInventory[commodity] += actualQuantityToBuy;
            portData.stock[commodity] -= actualQuantityToBuy;
            // The port's internal accounting for its credits when player owns it:
            // If player owned, the port's credits effectively receive the original price to simulate a transaction,
            // but the player only 'pays' the discounted price. This keeps the port economy making sense.
            // Or, simpler: player-owned port credit changes are not tracked for player's own trades.
            // For now, let's assume the port still "processes" the original price for its own credit tracking.
            portData.credits += price * actualQuantityToBuy; 


            displayConsoleMessage(`Bought ${actualQuantityToBuy} unit(s) of ${commodity} for ${totalCost} cr. ${isPlayerOwned ? '(10% owner discount applied)' : ''}`, 'success');
            sound = 'trade_buy';
        } else {
            // This case handles if all adjustments led to 0 quantity (e.g. full cargo, no stock, no money)
            // Specific messages are already displayed above.
        }


    } else if (action === 'sell') {
        if (portBehavior === 'S') {
            displayConsoleMessage(`This Port is Selling ${commodity}, not Buying.`, 'warning');
            playSoundEffect('error');
            return;
        }

        let actualQuantityToSell = quantityToTransact;

        if (playerInventory[commodity] < actualQuantityToSell) {
            actualQuantityToSell = playerInventory[commodity];
             if (actualQuantityToSell === 0) {
                displayConsoleMessage(`You have no ${commodity} to sell.`, 'warning');
                playSoundEffect('error');
                return;
            }
            displayConsoleMessage(`You only have ${actualQuantityToSell} units of ${commodity}. Adjusting quantity.`, 'minor');
        }
       
        const maxPortCanTake = portData.capacity[commodity] - portData.stock[commodity];
        if (maxPortCanTake < actualQuantityToSell) {
            actualQuantityToSell = maxPortCanTake;
            if (actualQuantityToSell <= 0) {
                displayConsoleMessage(`Port's ${commodity} storage is full. Cannot sell more.`, 'warning');
                playSoundEffect('error');
                return;
            }
            displayConsoleMessage(`Port can only accept ${actualQuantityToSell} more units of ${commodity}. Adjusting quantity.`, 'minor');
        }

        const totalGain = effectivePrice * actualQuantityToSell; // Use effectivePrice for player's gain

        if (portData.credits < (price * actualQuantityToSell) /* Port pays original price from its treasury */ ) {
            actualQuantityToSell = Math.floor(portData.credits / price); // How many can port afford at original price
            if (actualQuantityToSell <= 0) {
                displayConsoleMessage(`Port cannot afford to buy any ${commodity}.`, 'warning');
                playSoundEffect('error');
                return;
            }
            displayConsoleMessage(`Port can only afford ${actualQuantityToSell} units. Selling that amount.`, 'minor');
            // Recalculate totalGain for player based on new actualQuantityToSell and effectivePrice
            const newTotalGainForPlayer = effectivePrice * actualQuantityToSell;
            game.player.credits += newTotalGainForPlayer;
            portData.credits -= (price * actualQuantityToSell); // Port pays original price
        } else {
            game.player.credits += totalGain;
            portData.credits -= (price * actualQuantityToSell); // Port pays original price
        }

        if (actualQuantityToSell > 0) {
            playerInventory[commodity] -= actualQuantityToSell;
            portData.stock[commodity] += actualQuantityToSell;

            displayConsoleMessage(`Sold ${actualQuantityToSell} unit(s) of ${commodity} for ${totalGain} cr. ${isPlayerOwned ? '(10% owner bonus applied)' : ''}`, 'success');
            sound = 'trade_sell';
        } else {
            // This case handles if all adjustments led to 0 quantity
        }
    }

    if (sound) {
        playSoundEffect(sound);
    }
    updateUI();
}


function handleTradeAll(action, commodity) {
    const sector = game.map[`${game.player.x},${game.player.y}`];
    if (!sector || sector.type !== 'port') {
        displayConsoleMessage("Trade All/Max actions only at Ports.", "error");
        return; // Should already be at a port if these buttons are visible
    }

    const portData = sector.data;
    const price = portData.prices[commodity];
    const playerInventory = game.player.inventory;
    const shipCargoCapacity = game.player.ship.maxCargoSpace;
    const currentCargoTotal = Object.values(playerInventory).reduce((a, b) => a + b, 0);

    let quantityToTrade = 0;

    if (action === 'buy') {
        if (portData.behavior[commodity] === 'B') {
             displayConsoleMessage(`This Port is Buying ${commodity}, not Selling.`, 'warning'); return;
        }
        if (price <= 0) { // Prevent division by zero or buying free items if price somehow becomes 0
            displayConsoleMessage(`Cannot buy ${commodity} at current price (${price} cr).`, 'warning'); return;
        }

        const maxAffordableByCredits = Math.floor(game.player.credits / price);
        const maxFitInCargo = shipCargoCapacity - currentCargoTotal;
        const portStockAvailable = portData.stock[commodity];
        
        quantityToTrade = Math.min(maxAffordableByCredits, maxFitInCargo, portStockAvailable);
        
        if (quantityToTrade <= 0) {
            displayConsoleMessage(`Unable to buy maximum ${commodity}. Check credits, cargo space, or port stock.`, 'warning');
            return;
        }
        displayConsoleMessage(`Attempting to buy ${quantityToTrade} units of ${commodity}.`, 'info');
    } else if (action === 'sell') {
        if (portData.behavior[commodity] === 'S') {
            displayConsoleMessage(`This Port is Selling ${commodity}, not Buying.`, 'warning'); return;
        }
        const playerHas = playerInventory[commodity];
        const portCanPhysicallyTake = portData.capacity[commodity] - portData.stock[commodity];
        const portCanAffordUnits = (price > 0) ? Math.floor(portData.credits / price) : Infinity; // if price is 0, port can "afford" infinite

        quantityToTrade = Math.min(playerHas, portCanPhysicallyTake, portCanAffordUnits);

        if (quantityToTrade <= 0) {
            displayConsoleMessage(`Unable to sell all ${commodity}. Check your stock, port capacity/funds, or item price.`, 'warning');
            return;
        }
        displayConsoleMessage(`Attempting to sell ${quantityToTrade} units of ${commodity}.`, 'info');
    }

    if (quantityToTrade > 0) {
        trade(action, commodity, quantityToTrade); // Call the main trade function
    }
}


function upgradePort() {
    const sector = game.map[`${game.player.x},${game.player.y}`];
    if (!sector || sector.type !== 'port' || sector.data.owner !== game.player.name) { // Only upgrade ports you own
        displayConsoleMessage("You can only upgrade Ports that you own.", 'error');
        playSoundEffect('error');
        return;
    }

    const portData = sector.data;
    const unitsPerUpgrade = 1; // How many cargo units each input number represents
    const maxTotalUpgradeUnits = 10000; // Max total units per upgrade transaction
    const maxCommodityCapacity = 1000000; // Max capacity for a single commodity

    const oreInput = document.getElementById('upgrade-ore');
    const foodInput = document.getElementById('upgrade-food');
    const techInput = document.getElementById('upgrade-tech');

    const oreIncrease = parseInt(oreInput?.value, 10) || 0;
    const foodIncrease = parseInt(foodInput?.value, 10) || 0;
    const techIncrease = parseInt(techInput?.value, 10) || 0;

    if (oreIncrease < 0 || foodIncrease < 0 || techIncrease < 0) {
        displayConsoleMessage("Upgrade amounts must be zero or positive.", 'error');
        playSoundEffect('error');
        return;
    }

    const totalIncreaseUnits = oreIncrease + foodIncrease + techIncrease;

    if (totalIncreaseUnits <= 0) {
        displayConsoleMessage('Enter a positive amount for at least one commodity to upgrade.', 'error');
        playSoundEffect('error');
        return;
    }

    if (totalIncreaseUnits > maxTotalUpgradeUnits) {
        displayConsoleMessage(`Maximum total upgrade units per transaction is ${maxTotalUpgradeUnits}.`, 'error');
        playSoundEffect('error');
        return;
    }

    if (portData.capacity.ore + oreIncrease > maxCommodityCapacity ||
        portData.capacity.food + foodIncrease > maxCommodityCapacity ||
        portData.capacity.tech + techIncrease > maxCommodityCapacity) {
        displayConsoleMessage(`Maximum capacity per commodity is ${maxCommodityCapacity}.`, 'error');
        playSoundEffect('error');
        return;
    }

    // Cost scales with the total units being added
    const costPerUnit = 50; // Example cost per unit of capacity added
    const totalCost = totalIncreaseUnits * costPerUnit;

    if (game.player.credits < totalCost) {
        displayConsoleMessage(`Insufficient credits. Need ${totalCost} cr to perform this upgrade.`, 'error');
        playSoundEffect('error');
        return;
    }

    // Perform the upgrade
    game.player.credits -= totalCost;
    portData.capacity.ore += oreIncrease;
    portData.capacity.food += foodIncrease;
    portData.capacity.tech += techIncrease;

    // If the port is selling the commodity, its stock also increases with capacity
    if (portData.behavior.ore === 'S') portData.stock.ore += oreIncrease;
    if (portData.behavior.food === 'S') portData.stock.food += foodIncrease;
    if (portData.behavior.tech === 'S') portData.stock.tech += techIncrease;

    // Ensure stock doesn't exceed new capacity
    portData.stock.ore = Math.min(portData.stock.ore, portData.capacity.ore);
    portData.stock.food = Math.min(portData.stock.food, portData.capacity.food);
    portData.stock.tech = Math.min(portData.stock.tech, portData.capacity.tech);


    displayConsoleMessage(`Port upgraded! Capacity increased by O:+${oreIncrease}, F:+${foodIncrease}, T:+${techIncrease}. Cost: ${totalCost} cr.`);
    playSoundEffect('upgrade');
    updateUI(); // Update UI to show new capacity and stock
}

// --- NEW PORT ACTIVITY FUNCTIONS ---
function attemptStealResources() {
    const sector = game.map[`${game.player.x},${game.player.y}`];
    if (!sector || sector.type !== 'port' || (sector.data.owner === game.player.name && sector.data.owner !== undefined /* Allow stealing from unowned/NPC ports */)) {
        displayConsoleMessage("Cannot steal resources here or from your own port.", 'error');
        playSoundEffect('error');
        return;
    }
    const portData = sector.data; // This is the 'data' object for the port

    displayConsoleMessage("Attempting to divert cargo from port systems...", 'minor');

    // Steal chance influenced by port security level vs player's computer level
    const playerComputerLevel = game.player.ship.computerLevel || 1;
    const portSecurityLevel = portData.securityLevel || 0;
    let baseSuccessChance = 0.50; // Base 50% chance

    // Adjust chance based on security vs computer level
    const levelDifference = playerComputerLevel - portSecurityLevel;
    baseSuccessChance += levelDifference * 0.05; // +/- 5% per level difference

    const finalSuccessChance = Math.max(0.10, Math.min(0.90, baseSuccessChance)); // Clamp chance between 10% and 90%

    if (Math.random() < finalSuccessChance) {
        // --- SUCCESSFUL STEAL ---
        let stolenGoodsMessages = [];
        let totalCargoSpaceUsedByStolenGoods = 0;
        let playerCargoSpaceLeft = game.player.ship.maxCargoSpace - Object.values(game.player.inventory).reduce((a, b) => a + b, 0);

        if (playerCargoSpaceLeft <= 0) {
            displayConsoleMessage("Success... but your cargo hold is already full! No resources taken.", 'warning');
            playSoundEffect('ui_click'); // Neutral sound
            updateUI();
            return;
        }

        // Shuffle commodities to randomize the order of stealing attempts if space is limited
        const commoditiesToAttempt = [...commodities].sort(() => 0.5 - Math.random());

        for (const commodity of commoditiesToAttempt) {
            if (playerCargoSpaceLeft <= 0) break; // Stop if no more cargo space

            if (portData.stock[commodity] > 0) {
                const stealPercentage = getRandomInt(2, 5) / 100; // 2-5% of port's stock
                let potentialAmountToSteal = Math.floor(portData.stock[commodity] * stealPercentage);
                potentialAmountToSteal = Math.max(1, potentialAmountToSteal); // Try to steal at least 1 unit if percentage is too low but stock exists

                // Amount is capped by what port has, and what player can carry for this item
                let actualStolenAmount = Math.min(potentialAmountToSteal, portData.stock[commodity], playerCargoSpaceLeft);

                if (actualStolenAmount > 0) {
                    portData.stock[commodity] -= actualStolenAmount;
                    game.player.inventory[commodity] += actualStolenAmount;
                    playerCargoSpaceLeft -= actualStolenAmount; // Update remaining space
                    totalCargoSpaceUsedByStolenGoods += actualStolenAmount;
                    stolenGoodsMessages.push(`${actualStolenAmount} ${commodity}`);
                }
            }
        }

        if (stolenGoodsMessages.length > 0) {
            displayConsoleMessage(`Success! Pilfered: ${stolenGoodsMessages.join(', ')}!`, 'success', 'trade_buy');
        } else {
            displayConsoleMessage("Success... but the port had no vulnerable resources or you couldn't carry more.", 'minor');
        }

    } else {
        // --- FAILED STEAL ---
        let penaltyMessages = ["Failed! Your unauthorized access was detected!"];

        // 1. Fine: 1-3% of player's credits
        const finePercentage = getRandomInt(1, 3) / 100;
        const fineAmount = Math.ceil(game.player.credits * finePercentage);
        if (fineAmount > 0 && game.player.credits > 0) {
            game.player.credits = Math.max(0, game.player.credits - fineAmount);
            penaltyMessages.push(`You were fined ${fineAmount} credits.`);
        }

        // 2. Cargo Loss: 3-5% of player's current total cargo
        const totalPlayerCargo = Object.values(game.player.inventory).reduce((a, b) => a + b, 0);
        if (totalPlayerCargo > 0) {
            const lossPercentage = getRandomInt(3, 5) / 100;
            let totalUnitsToLose = Math.floor(totalPlayerCargo * lossPercentage);
            totalUnitsToLose = Math.min(totalUnitsToLose, totalPlayerCargo); // Cannot lose more than they have

            let cargoLostDetails = [];
            if (totalUnitsToLose > 0) {
                // Create a flat list of all cargo items player possesses
                let allCargoUnits = [];
                commodities.forEach(c => {
                    for (let i = 0; i < game.player.inventory[c]; i++) {
                        allCargoUnits.push(c);
                    }
                });
                allCargoUnits.sort(() => 0.5 - Math.random()); // Shuffle for random loss

                let unitsActuallyLost = 0;
                let lostCounts = { ore: 0, food: 0, tech: 0 };

                for (let i = 0; i < totalUnitsToLose && allCargoUnits.length > 0; i++) {
                    const itemToLose = allCargoUnits.pop(); // Take from the shuffled list
                    if (game.player.inventory[itemToLose] > 0) {
                        game.player.inventory[itemToLose]--;
                        lostCounts[itemToLose]++;
                        unitsActuallyLost++;
                    }
                }
                
                if (unitsActuallyLost > 0) {
                    Object.keys(lostCounts).forEach(key => {
                        if (lostCounts[key] > 0) {
                            cargoLostDetails.push(`${lostCounts[key]} ${key}`);
                        }
                    });
                    penaltyMessages.push(`Security forces confiscated some of your cargo: ${cargoLostDetails.join(', ')} lost.`);
                }
            }
        }
        displayConsoleMessage(penaltyMessages.join(' '), 'error', 'hack_fail'); // Using hack_fail sound for penalty
    }
    updateUI(); // Always update UI after an attempt
}

// Function to handle hacking attempts
function attemptHackPort() {
    const sector = game.map[`${game.player.x},${game.player.y}`];
    if (!sector || (sector.type !== 'port' && sector.type !== 'spacePort')) {
        displayConsoleMessage("Hacking is only possible at Ports or Space Ports.", 'error');
        playSoundEffect('error');
        return;
    }
    const portData = sector.data;
    const playerComputerLevel = game.player.ship.computerLevel || 1;
    const portSecurityLevel = portData.securityLevel || 0;

    // Calculate hacking success chance (between 5% and 95%)
    let baseSuccessChance = 0.4; // Start with 40% base chance
    const securityPenalty = portSecurityLevel * 0.07; // Each security level reduces chance by 7%
    const softwareBonus = (playerComputerLevel - 1) * 0.07; // Each level *above 1* increases chance by 7%

    let finalHackChance = baseSuccessChance - securityPenalty + softwareBonus;
    finalHackChance = Math.max(0.05, Math.min(0.95, finalHackChance)); // Clamp between 5% and 95%

    displayConsoleMessage(`Attempting system hack...\nEstimated Success Chance: ${Math.round(finalHackChance * 100)}%`);

    if (Math.random() < finalHackChance) {
        // Hack Success
        const maxStealable = Math.floor(portData.credits * 0.1); // Steal up to 10% of port's credits
        const minSteal = 100; // Minimum stolen amount
        // Ensure we don't try to steal more than the port has
        const actualMaxSteal = Math.min(maxStealable, portData.credits);
         // Ensure minSteal is not more than what's available
        const upperStealBound = actualMaxSteal > minSteal ? actualMaxSteal : minSteal;
        const stolenCredits = getRandomInt(minSteal, upperStealBound);

        game.player.credits += stolenCredits;
        portData.credits = Math.max(0, portData.credits - stolenCredits); // Port loses credits, ensure not negative
        displayConsoleMessage(`Success! Siphoned ${stolenCredits} credits!`);
        playSoundEffect('hack_success');
    } else {
        // Hack Failed
        displayConsoleMessage("Hack Failed! Access denied.");
        playSoundEffect('hack_fail');

        // --- Virus Infection Logic ---
        // Calculate the chance of getting a virus based on security difference
        // If port security is much higher, the chance increases significantly.
        const securityDifference = portSecurityLevel - playerComputerLevel;
        let virusInfectionChance = 0;

        if (securityDifference > 0) {
            // Positive difference means port is more secure than player
            // Chance increases linearly with the difference
            virusInfectionChance = securityDifference * 0.15; // Example: 15% increased chance per level difference
        } else {
            // Negative difference or zero means player is equal or more secure
            virusInfectionChance = 0.01; // Minimal base chance even if player is superior
        }

        // Clamp the chance (e.g., max 75% chance of getting a virus on failure)
        virusInfectionChance = Math.min(0.75, virusInfectionChance);

        // Roll for virus infection
        if (Math.random() < virusInfectionChance) {
            const randomVirusType = getRandomElement(virusTypes);
            // Check if player already has this virus by name
            const hasVirus = game.player.viruses.some(v => v.name === randomVirusType.name);

            if (!hasVirus) {
                // Add the virus with its starting duration
                game.player.viruses.push({ ...randomVirusType, duration: randomVirusType.duration }); // Store initial duration and decrement 'duration'
                displayConsoleMessage(`INTRUSION DETECTED! Ship's systems infected with "${randomVirusType.name}" virus!`, 'virus_infect');
            } else {
                // Virus failed to infect (already present)
                displayConsoleMessage(`Counter-intrusion detected, but system already has "${randomVirusType.name}". No new infection.`);
                 // Maybe a less severe failure sound or no sound?
            }
        } else {
            // Failed hack, but no virus infection
            displayConsoleMessage("No counter-intrusion detected.");
             // No sound
        }
    }
    updateUI(); // Always update UI after a hack attempt
}

// Function to upgrade Port Security (Only available at ports you own)
function upgradePortSecurity() {
    const sector = game.map[`${game.player.x},${game.player.y}`];
    if (!sector || sector.type !== 'port' || sector.data.owner !== game.player.name) { // Only upgrade ports you own
        displayConsoleMessage("You can only upgrade security at Ports that you own.", 'error');
        playSoundEffect('error');
        return;
    }
    const portData = sector.data;
    const targetLevelInput = document.getElementById('upgrade-security-level');
    const targetLevel = parseInt(targetLevelInput?.value, 10) || portData.securityLevel + 1;
    const maxLevel = 10;

    if (targetLevel <= portData.securityLevel) {
        displayConsoleMessage(`Enter a target security level higher than the current level (${portData.securityLevel}).`, 'error');
        playSoundEffect('error');
        return;
    }
    if (targetLevel > maxLevel) {
        displayConsoleMessage(`Maximum security level is ${maxLevel}.`, 'error');
        playSoundEffect('error');
        return;
    }

    // Cost increases significantly with target level and current level
    // Example: Level 1->2 cost 10k, Level 9->10 cost increases significantly
    const cost = ((targetLevel * 5000) + (portData.securityLevel * 5000)) + 15000; // Base cost + cost scaling with both levels

    if (game.player.credits < cost) {
        displayConsoleMessage(`Insufficient credits. Need ${cost} cr to upgrade security to level ${targetLevel}.`, 'error');
        playSoundEffect('error');
        return;
    }

    if (confirm(`Upgrade port security to level ${targetLevel} for ${cost} cr?`)) {
        game.player.credits -= cost;
        portData.securityLevel = targetLevel;
        displayConsoleMessage(`Port security upgraded to level ${targetLevel}!`);
        playSoundEffect('upgrade');
        updateUI(); // Update UI to show new security level
    } else {
        displayConsoleMessage("Port security upgrade cancelled.");
    }
}

// Function to upgrade Player Software (Computer Level) - Available at Space Ports
function upgradeSoftware() {
    const sector = game.map[`${game.player.x},${game.player.y}`];
    if (!sector || sector.type !== 'spacePort') {
        displayConsoleMessage("Software upgrades are only available at Space Ports.", 'error');
        playSoundEffect('error');
        return;
    }
    const currentLevel = game.player.ship.computerLevel || 1;
    const maxLevel = 10;

    if (currentLevel >= maxLevel) {
        displayConsoleMessage("Computer software is already at the maximum level.", 'error');
        playSoundEffect('error');
        return;
    }

    // Cost increases with current level
    const cost = currentLevel * 10000; // Example cost: Level 1->2 costs 10k, Level 2->3 costs 20k, etc.

    if (game.player.credits < cost) {
        displayConsoleMessage(`Insufficient credits. Need ${cost} cr to upgrade computer software to level ${currentLevel + 1}.`, 'error');
        playSoundEffect('error');
        return;
    }

    if (confirm(`Upgrade computer software to level ${currentLevel + 1} for ${cost} cr?`)) {
        game.player.credits -= cost;
        game.player.ship.computerLevel = currentLevel + 1;
        displayConsoleMessage(`Computer software upgraded to level ${game.player.ship.computerLevel}!`);
        playSoundEffect('upgrade');
        updateUI(); // Update UI to show new computer level
    } else {
         displayConsoleMessage("Software upgrade cancelled.");
    }
}

// Function to remove Viruses - Available at Space Ports
function removeViruses() {
    const sector = game.map[`${game.player.x},${game.player.y}`];
    if (!sector || sector.type !== 'spacePort') {
        displayConsoleMessage("Virus removal services are only available at Space Ports.", 'error');
        playSoundEffect('error');
        return;
    }
    if (game.player.viruses.length === 0) {
        displayConsoleMessage("No viruses detected on ship's systems.");
        // No sound or a neutral sound
        return;
    }

    const costPerVirus = 1000; // Example cost per virus
    const totalCost = game.player.viruses.length * costPerVirus;

    if (game.player.credits < totalCost) {
        displayConsoleMessage(`Insufficient credits. Need ${totalCost} cr for virus removal.`, 'error');
        playSoundEffect('error');
        return;
    }

    if (confirm(`Pay ${totalCost} cr to remove all viruses?`)) {
        game.player.credits -= totalCost;
        game.player.viruses = []; // Clear the viruses array
        displayConsoleMessage("Ship's systems cleaned. Viruses removed.");
        playSoundEffect('virus_clean');
        updateUI(); // Update UI to reflect no viruses
    } else {
         displayConsoleMessage("Virus removal cancelled.");
    }
}


function attemptPurchasePort() {
    const sector = game.map[`${game.player.x},${game.player.y}`];
    if (!sector || sector.type !== 'port') {
        displayConsoleMessage("Purchase inquiries only at Trading Ports.", 'error');
        playSoundEffect('error');
        return;
    }

    const portData = sector.data;

    // Check if player already owns it
    if (portData.owner === game.player.name) {
        displayConsoleMessage("You already own this port.", 'info');
        playSoundEffect('ui_click');
        return;
    }

    // Check if owned by a major non-purchasable faction
    const majorFactions = [FACTION_DURAN, FACTION_VINARI, "Federation", "Pirate"]; // Add other non-purchasable faction identifiers here
    if (majorFactions.includes(portData.owner)) {
        displayConsoleMessage(`This port is under ${portData.owner} control. They scoff at your credits and tell you to move along!`, 'warning');
        playSoundEffect('error');
        return;
    }
    
    // If it's owned by someone else (not player, not major faction, e.g. another player in future or specific NPC)
    // For now, any owner that isn't null/"Independent Operators" and isn't a major faction is also considered "not for sale via this channel"
    if (portData.owner && portData.owner !== "Independent Operators") {
         displayConsoleMessage("This port is privately operated and not currently listed for public sale.", 'info');
         playSoundEffect('ui_click');
         return;
    }

    // At this point, port is considered "Independent Operators" or unowned (owner might be null)
    // and thus potentially for sale by the system.

    // Use the game constant for base sale chance
    const baseForSaleChance = PORT_FOR_SALE_BASE_CHANCE; // e.g., 0.22
    const securityPenaltyForSale = (portData.securityLevel || 0) * 0.01; // Each security level reduces chance by 1%
    const finalForSaleChance = Math.max(0.02, baseForSaleChance - securityPenaltyForSale); // Min 2% chance

    const isForSale = portData.forSale !== undefined ? portData.forSale : (Math.random() < finalForSaleChance);

    if (!isForSale) {
        displayConsoleMessage("The current operators are not interested in selling this Port at this time.", 'info');
        playSoundEffect('ui_click');
        return;
    }

    // Port is for sale! Calculate price.
    const basePrice = 500000;
    const priceModifier = (portData.securityLevel || 0) * 75000;
    // Use stored purchasePrice if this port was previously bought and then somehow became unowned again with a price history.
    // Otherwise, calculate it. For a typical unowned port, purchasePrice will be undefined.
    const price = portData.purchasePrice !== undefined ? portData.purchasePrice : (basePrice + priceModifier);

    if (confirm(`This Port is for sale by its current operators!\nAsking Price: ${price} cr.\nWould you like to purchase it?`)) {
        if (game.player.credits >= price) {
            game.player.credits -= price;
            portData.owner = game.player.name; // Player now owns it
            portData.forSale = false;          // No longer for sale via this random mechanic
            portData.purchasePrice = price;    // Store the price it was bought for (for game history/data)
            
            displayConsoleMessage(`Congratulations! You are now the proud owner of ${portData.name}! You receive a 10% discount on trades and services here.`, 'success', 'ship_bought');
            updateUI();
        } else {
            // Message Change: "Insufficient credit balance."
            displayConsoleMessage(`Insufficient credit balance. You need ${price} cr to purchase this Port.`, 'error');
            playSoundEffect('error');
        }
    } else {
        displayConsoleMessage("Port purchase offer withdrawn.", 'info');
    }
    // updateUI(); // updateUI is called within success/failure paths or if no action taken
}

function payForTip() {
    const sector = game.map[`${game.player.x},${game.player.y}`];
     // Allow paying for a tip at any port or spaceport? Let's allow both.
    if (!sector || (sector.type !== 'port' && sector.type !== 'spacePort')) {
         displayConsoleMessage("Tips can only be paid at Ports or Space Ports.", 'error');
         playSoundEffect('error');
         return;
    }

    const tipCost = 25;
    if (game.player.credits < tipCost) {
        displayConsoleMessage(`Insufficient credits. Need ${tipCost} cr to pay for a tip.`, 'error');
        playSoundEffect('error');
        return;
    }

    game.player.credits -= tipCost;
    playSoundEffect('trade_sell'); // Sound for spending credits

    const tips = [
        "Heard tech pays well near Zarg.",
        "Pirates sighted near the Kepler system.",
        "Derelict vessel reported at coordinates 50,30 - might contain salvage.",
        "Food prices are expected to rise near the Terra colony soon.",
        "Be wary of trading in alien artifacts - they attract unwanted attention.",
        "Increased Vinari patrol activity detected near Duran space.",
        "Rare deep-space comet observed in the outer rim - potential mining opportunity?",
        "Starbase Andromeda Central has a temporary discount on hull repairs.",
        "Saw a ship asking about your vessel specifically...",
        "Experiencing weird sensor interference near black holes.",
        "Rumor has it, the Duran are hoarding rare isotopes.",
        "Found an old navigation log mentioning a hidden asteroid base.",
        "There's tension brewing between the Federation and the Vinari.",
        "Keep an eye on your fuel levels in uncharted sectors.",
        "High-density ore deposits were recently discovered in sector 15, 42."
    ];
    const receivedTip = getRandomElement(tips);
    displayConsoleMessage(`Dockmaster whispers: "${receivedTip}"`);
    updateUI(); // Update UI to show credit change
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


// Placeholder function for trading with NPC (Not Implemented yet)
function tradeWithNPC(npc) {
     displayConsoleMessage(`Trading with ${npc.name} is not yet implemented.`, 'error');
    // Example: NPCs could have random inventory and prices, different from ports
    // const npcInventory = { ore: getRandomInt(0, 50), food: getRandomInt(0, 50), tech: getRandomInt(0, 20) };
    // const prices = { ore: getRandomInt(50, 150), food: getRandomInt(20, 80), tech: getRandomInt(100, 400) };
    // Update UI to show trade options specific to this NPC
    // ui.interactionControls.innerHTML = `...`; // Generate buttons for NPC trade
}


function moveNPCs() {
    const npcsToMove = [...game.npcs]; // Iterate over a copy
    npcsToMove.forEach(npc => { // npc is a Ship object
        if (!game.npcs.includes(npc)) return; // Skip if removed (e.g. by combat)

        if (Math.random() < 0.3) { // 30% chance to move
            const directions = ['up', 'down', 'left', 'right'];
            const dir = getRandomElement(directions);
            let newX = npc.x_pos, newY = npc.y_pos;

            if (dir === 'up' && newY > 0) newY--;
            else if (dir === 'down' && newY < game.mapHeight - 1) newY++;
            else if (dir === 'left' && newX > 0) newX--;
            else if (dir === 'right' && newX < game.mapWidth - 1) newX++;
            else return; // Cannot move

            const oldKey = `${npc.x_pos},${npc.y_pos}`;
            const newKey = `${newX},${newY}`;
            const targetSectorContent = game.map[newKey];

            // NPCs can only move to empty sectors or sectors occupied by non-colliding entities (e.g. star, nebula - simple rule for now)
            // Or if it's another NPC (they can 'share' for display simplicity, map shows one)
            if (!targetSectorContent || targetSectorContent.type === 'empty' ||
                targetSectorContent.type === 'star' || targetSectorContent.type === 'hazard' || /* allow moving into hazards for now */
                ['npc_trader', 'vinari_ship', 'duran_ship'].includes(targetSectorContent.type)) {

                // Clear NPC from old map location if it was the primary object there
                if (game.map[oldKey] && game.map[oldKey].data === npc) {
                    // If there was a "hidden" hazard under the NPC, it should be revealed
                    const underlyingHazards = game.hazards.filter(h => h.x === npc.x_pos && h.y === npc.y_pos);
                    if (underlyingHazards.length > 0) {
                        game.map[oldKey] = { type: 'hazard', data: underlyingHazards[0] }; // Show the first hazard
                    } else {
                        game.map[oldKey] = null; // Mark as empty
                    }
                }

                npc.x_pos = newX;
                npc.y_pos = newY;

                // Add NPC to new map location.
                // If the new location is empty or was a non-critical object, the NPC becomes the primary object.
                // If it's another NPC, they "stack" - the map will render one of them based on existing logic.
                const npcMapType = determineNpcMapType(npc.faction);
                if (!targetSectorContent || targetSectorContent.type === 'empty' || targetSectorContent.type === 'star' || targetSectorContent.type === 'hazard') {
                    game.map[newKey] = { type: npcMapType, data: npc };
                } else if (['npc_trader', 'vinari_ship', 'duran_ship'].includes(targetSectorContent.type)) {
                    // Another NPC is already here. For rendering, one will show.
                    // The `game.map[newKey]` will show the one that was there first or last moved.
                    // This is a simplification. True stacking would need `game.map[key]` to be an array of objects.
                    // For now, we can overwrite or leave as is if map symbol won't change.
                    // Let's overwrite to reflect the last mover as the 'top' entity for that map cell's primary data.
                    game.map[newKey] = { type: npcMapType, data: npc };
                }
                 // If NPC moves into a hazard sector that was previously just a hazard, the map key updates to the NPC.
                 // The hazard still exists in game.hazards and will affect the NPC if you implement NPC-hazard interaction.
            }
        }
    });
    // No updateUI() here; it's called after player's move which triggers moveNPCs.
}


/**
 * Displays a console message specific to the type of object in the player's current sector upon arrival.
 */
function displayArrivalMessage() { /* ... (no changes needed here, uses sector.type which is now set correctly) ... */
    const sector = game.map[`${game.player.x},${game.player.y}`];
    if (!sector || !sector.data || sector.type === 'hazard') return; // Hazards handled by handleHazardEntry
    let message = ''; let type = 'info'; let sound = 'message_system'; // Default sound for arrivals
    switch (sector.type) {
        case 'port': case 'spacePort': message = `Docking at ${sector.data.name || 'the station'}...`; break;
        case 'planet': message = `Entering orbit of ${sector.data.name || 'the planet'}.`; break;
        case 'star': message = `Approaching ${sector.data.name || 'the star'}. Maintain safe distance.`; break;
        case 'npc_trader': // For all NPC types now from ship_definitions
        case 'vinari_ship':
        case 'duran_ship':
            const npcShip = sector.data; // This is a Ship object
            message = `Ship detected: ${npcShip.ship_name} (${npcShip.faction}).`;
            if (npcShip.faction === FACTION_VINARI || npcShip.faction === FACTION_DURAN) {
                type = 'warning'; sound = 'error'; // More urgent for potentially hostile
            }
            break;
    }
    if (message) displayConsoleMessage(message, type, sound);
}


// Simple economy update - random price fluctuations and occasional events
function updateEconomy() {
    game.ports.forEach(p => {
        commodities.forEach(c => {
            // Random price fluctuation (more significant at regular ports than spaceports?)
            const fluctuation = p.type === 'port' ? getRandomInt(-10, 10) : getRandomInt(-5, 5);
            p.prices[c] += fluctuation;
            // Keep prices within a reasonable range
            p.prices[c] = Math.max(5, Math.min(p.prices[c], 500));
        });
    });

    // Add random events every 10 moves
    if (game.moveCount > 0 && game.moveCount % 10 === 0) {
        const events = [
            { msg: "Galactic News: Supply convoy delayed! Food prices spike in many sectors.", effect: () => game.ports.forEach(p => p.prices.food = Math.min(500, p.prices.food + getRandomInt(15, 30))) },
            { msg: "Market Fluctuation: New tech released! Tech prices drop temporarily.", effect: () => game.ports.forEach(p => p.prices.tech = Math.max(5, p.prices.tech - getRandomInt(10, 20))) },
            { msg: "Mining Boom: Rich ore veins discovered! Ore supply increases, prices drop.", effect: () => game.ports.forEach(p => p.prices.ore = Math.max(5, p.prices.ore - getRandomInt(8, 15))) },
            { msg: "Pirate Activity: Trade routes disrupted! Prices for all commodities become volatile.", effect: () => game.ports.forEach(p => commodities.forEach(c => p.prices[c] += getRandomInt(-20, 20))) } // More extreme fluctuations
        ];
        const event = getRandomElement(events);
        if (event) {
            displayConsoleMessage(`[EVENT] ${event.msg}`);
            event.effect(); // Apply the event's effect
        }
    }
}


function startCombat(npcShipObject) {
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


function endCombat(playerWon, outcomeMessage = "") {
    // Ensure there's a combatant to end combat with
    if (!game.inCombatWith) {
        // This case might happen if endCombat is somehow called when not in combat.
        // It's a safeguard.
        console.warn("endCombat called but game.inCombatWith is null.");
        game.inCombatWith = null; // Ensure it's reset
        document.querySelectorAll('#galaxy-map .button-group button[data-action="move"]').forEach(btn => btn.disabled = false);
        updateUI();
        return;
    }

    const currentTarget = game.inCombatWith; // Store reference before potentially nullifying game.inCombatWith
    const targetName = currentTarget.ship_name || currentTarget.name || "the enemy"; // Use ship_name, fallback to name

    if (playerWon === true) {
        displayConsoleMessage(outcomeMessage || `You were victorious against ${targetName}!`, 'success', 'ship_bought');
        
        let lootedCredits = 0;
        if (currentTarget.bounty && currentTarget.bounty > 0) {
            lootedCredits = currentTarget.bounty + getRandomInt(-Math.floor(currentTarget.bounty * 0.1), Math.floor(currentTarget.bounty * 0.15));
            lootedCredits = Math.max(10, lootedCredits); 
        } else { 
            // Fallback loot calculation if no bounty is set (or for entities without bounty)
            lootedCredits = getRandomInt(isTargetStation ? 500 : 50, isTargetStation ? 2500 : 250);
        }
        
        game.player.credits += lootedCredits;
        displayConsoleMessage(`You salvaged ${lootedCredits} credits from the wreckage.`, 'success');

        // Determine if the target was a station (port/spaceport) or an NPC ship
        const isTargetStation = currentTarget.isStation === true; // Check the flag we added
        const targetMapKey = `${currentTarget.x_pos || currentTarget.x},${currentTarget.y_pos || currentTarget.y}`; // Use x_pos/y_pos for ships, x/y for ports

        if (isTargetStation) {
            displayConsoleMessage(`${targetName} has been obliterated! The sector is now marked as hazardous debris.`, 'error', 'ship_destroyed');
            // Remove from ports array (assuming 'ports' array holds both trading ports and spaceports that are combat-capable)
            game.ports = game.ports.filter(p => p !== currentTarget);
            // If you have a separate array for spaceports, filter that too if needed.
        } else {
            // It was an NPC ship
            game.npcs = game.npcs.filter(n => n.ship_id !== currentTarget.ship_id);
        }
        
        // Update map: Mark sector as debris or clear it
        if (game.map[targetMapKey] && game.map[targetMapKey].data === currentTarget) {
            game.map[targetMapKey] = { 
                type: 'debris_field', // New map type for destroyed stations/ships
                data: { 
                    name: `Ruins of ${targetName}`, 
                    originalOwner: currentTarget.owner || currentTarget.faction || "Unknown",
                    lootedValue: lootedCredits, // Store how much was looted
                    timestamp: new Date().toLocaleTimeString()
                } 
            };
            // You'll need to add 'debris_field' to your map legend and info feed handling if you want to see this.
            // For now, it will appear as '?' or trigger the default case in renderMap/infoFeed.
        }

    } else if (playerWon === false) { // Player lost
        displayConsoleMessage(outcomeMessage || `Your ship was destroyed by ${targetName}! GAME OVER!`, 'error', 'ship_destroyed');
        // game.inCombatWith is reset inside initGame()
        initGame(); 
        return; // Important: Stop further execution in endCombat as game is restarting
    } else { // Escaped or other neutral outcome (playerWon is null or undefined)
        displayConsoleMessage(outcomeMessage || `You disengaged from ${targetName}.`, 'info');
    }

    // This part is reached for player victory or escape
    game.inCombatWith = null; // Clear combat state
    
    // Re-enable map movement buttons
    document.querySelectorAll('#galaxy-map .button-group button[data-action="move"]').forEach(btn => btn.disabled = false);
    // ui.deployMineButton state will be handled by updateUI() based on mine count and solar array status.
    
    updateUI(); // Restore normal UI and refresh all displays
}


function handleCombatRound(playerActionType) {
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


function attemptFlee() {
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


function generateLotteryUI() {
    let html = `<div style="padding:10px; text-align:center;">`;
    const ticketCost = game.lottery.ticketCost;

    switch (game.lottery.stage) {
        case 'pick':
            html += `<h3>Pick 6 Unique Lucky Digits (0-9)</h3>`;
            html += `<p style="font-size:11px;">Enter one digit per box. Use Tab or click to navigate.</p>`; // Updated instruction
            html += `<div id="lottery-inputs" style="margin: 15px 0;">`; // Added some margin
            for (let i = 0; i < 6; i++) {
                const currentValue = game.lottery.userNumbers[i] !== undefined ? game.lottery.userNumbers[i] : '';
                // Apply the new class. Added maxlength="1" and oninput for auto-tabbing (optional enhancement)
                html += `<input type="text" pattern="[0-9]" inputmode="numeric" class="lottery-input-digit" id="lotto-digit-${i}" value="${currentValue}" maxlength="1" style="/* Inline styles removed as they are in CSS now */" oninput="handleLotteryDigitInput(this, ${i})">`;
            }
            html += `</div>`;
            html += `<div id="lottery-message-area" style="color: #ffae42; height: 20px; margin-bottom:10px; font-size: 12px;"></div>`;
            html += `<button onclick="triggerAction('lotterySubmitNumbers')" style="margin-right: 10px;">Submit Numbers (Cost: ${ticketCost}cr)</button>`;
            html += `<button onclick="triggerAction('lotteryExit')">Cancel & Exit Lottery</button>`;
            break;

        case 'drawing':
            html += `<h3>Drawing Lottery Numbers...</h3>`;
            html += `<p>Your Numbers: <span style="color: #76ff03;">${game.lottery.userNumbers.join(' ')}</span></p>`;
            html += `<div id="lottery-draw-area" style="font-size: 24px; letter-spacing: 10px; margin: 20px 0; height: 30px; line-height: 30px;">`;
            for (let i = 0; i < 6; i++) {
                html += `<span id="drawn-digit-${i}" style="display:inline-block; width: 30px; border-bottom: 1px solid #0f0;">?</span>`;
            }
            html += `</div>`;
            html += `<p style="font-size:11px;"><em>Spinning in progress... please wait.</em></p>`;
            // No buttons here, waits for animation to complete
            break;

        case 'results':
            html += `<h3>Lottery Results!</h3>`;
            html += `<p>Your Numbers: <span style="color: #76ff03;">${game.lottery.userNumbers.join(' ')}</span></p>`;
            let drawnDisplay = "";
            game.lottery.drawnNumbers.forEach(drawnNum => {
                if (game.lottery.userNumbers.includes(drawnNum)) { // Check if string is in array of strings
                    drawnDisplay += `<span style="color: lime; font-weight:bold; border: 1px solid lime; padding: 2px;">${drawnNum}</span> `;
                } else {
                    drawnDisplay += `<span style="border: 1px solid #555; padding: 2px;">${drawnNum}</span> `;
                }
            });
            html += `<p>Drawn Numbers: ${drawnDisplay.trim()}</p>`;
            html += `<hr style="border-color:#050;">`;
            html += `<p>You matched: <strong>${game.lottery.matches}</strong> number(s)!</p>`;
            if (game.lottery.winnings > 0) {
                html += `<p style="color: lime; font-weight:bold;">Congratulations! You won ${game.lottery.winnings} credits!</p>`;
            } else {
                html += `<p>Sorry, no prize this time. Better luck next draw!</p>`;
            }
            // Prize tier messages
            if (game.lottery.matches === 6) html += `<p style="color: yellow;">🎉🎉🎉 JACKPOT!!! 🎉🎉🎉</p>`;
            else if (game.lottery.matches === 5) html += `<p style="color: yellow;">🎉 Incredible! 5 Matches! 🎉</p>`;
            else if (game.lottery.matches === 4) html += `<p style="color: #76ff03;">Excellent! 4 Matches!</p>`;
            else if (game.lottery.matches === 3) html += `<p>Well done! 3 Matches.</p>`;

            html += `<div style="margin-top: 20px;">`
            html += `<button onclick="triggerAction('lotteryPlayAgain')" style="margin-right: 10px;">Play Again (Cost: ${ticketCost}cr)</button>`;
            html += `<button onclick="triggerAction('lotteryExit')">Return to Port Services</button>`;
            html += `</div>`;
            break;
			
			// 3 tries disable play again
			const canPlayAgain = game.lottery.playsThisPeriod < game.lottery.maxPlaysPerPeriod && game.player.credits >= game.lottery.ticketCost;
            const playsLeftForDisplay = game.lottery.maxPlaysPerPeriod - game.lottery.playsThisPeriod;

            html += `<div style="margin-top: 20px;">`
            // Conditionally disable "Play Again" button
            html += `<button onclick="triggerAction('lotteryPlayAgain')" style="margin-right: 10px;" ${!canPlayAgain ? 'disabled' : ''}>Play Again (Cost: ${ticketCost}cr)</button>`;
            if (playsLeftForDisplay <=0 && canPlayAgain == false) { // Show why it might be disabled if not due to credits
                 html += `<span style="font-size:10px;">(No plays left this period)</span>`
            }
            html += `<button onclick="triggerAction('lotteryExit')" style="margin-left:10px;">Return to Port Services</button>`;
            html += `</div>`;
            break;
    }
    html += `</div>`;
    return html;
}


function handleLotteryNumberSubmission() {
    const inputs = [];
    const userNumbersSet = new Set();
    let isValid = true;
    const messageArea = document.getElementById('lottery-message-area');
    if(messageArea) messageArea.textContent = ''; // Clear previous messages

    for (let i = 0; i < 6; i++) {
        const inputEl = document.getElementById(`lotto-digit-${i}`);
        const val = inputEl.value;
        if (val === '' || !/^[0-9]$/.test(val)) { 
            if(messageArea) messageArea.textContent = 'Error: Please enter a single digit (0-9) in each box.';
            isValid = false;
            break;
        }
        inputs.push(val); 
        userNumbersSet.add(val);
    }

    if (isValid && inputs.length !== 6) { 
        if(messageArea) messageArea.textContent = 'Error: Please enter exactly 6 numbers.';
        isValid = false;
    }
    
    if (isValid && userNumbersSet.size !== 6) {
        if(messageArea) messageArea.textContent = 'Error: All 6 numbers must be unique.';
        isValid = false;
    }

    if (isValid) {
        if (game.player.credits < game.lottery.ticketCost) {
            if(messageArea) messageArea.textContent = `Error: Insufficient credits. Ticket costs ${game.lottery.ticketCost}cr.`;
            playSoundEffect('error');
            return;
        }
        
        // --- THIS IS THE CRITICAL PART ---
        game.player.credits -= game.lottery.ticketCost;
        game.lottery.playsThisPeriod++; // <<< --- ENSURE THIS LINE IS PRESENT AND EXECUTED
        // --- END CRITICAL PART ---

        game.lottery.userNumbers = inputs; 
        // Now the console message will use the updated playsThisPeriod count
        displayConsoleMessage(`Lottery ticket purchased for ${game.lottery.ticketCost}cr. Plays this period: ${game.lottery.playsThisPeriod}/${game.lottery.maxPlaysPerPeriod}. Your numbers: ${inputs.join(', ')}`, 'success', 'trade_buy');
        
        game.lottery.stage = 'drawing';
        updateUI(); 
        startLotteryDrawAnimation(); 
    } else {
        playSoundEffect('error');
        // Error message already set by validation checks in the UI
    }
}


function startLotteryDrawAnimation() {
    game.lottery.drawnNumbers = [];
    game.lottery.spinningIntervals.forEach(clearInterval);
    game.lottery.spinningIntervals = [];
    game.lottery.currentDrawingDigitIndex = 0;

    // --- NEW: Generate 6 unique drawn numbers from 0-9 ---
    let availableDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    for (let i = 0; i < 6; i++) {
        if (availableDigits.length === 0) break; // Should not happen if drawing 6 from 10
        const randomIndex = getRandomInt(0, availableDigits.length - 1);
        const pickedDigit = availableDigits.splice(randomIndex, 1)[0]; // Pick and remove
        game.lottery.drawnNumbers.push(pickedDigit);
    }
    // Now game.lottery.drawnNumbers contains 6 unique digits (as strings)

    drawNextLotteryDigitWithAnimation(); // Proceed with animation using pre-generated numbers
}

function drawNextLotteryDigitWithAnimation() {
    if (game.lottery.currentDrawingDigitIndex >= 6) {
        calculateLotteryResults();
        return;
    }

    const digitIndex = game.lottery.currentDrawingDigitIndex;
    const digitSpan = document.getElementById(`drawn-digit-${digitIndex}`);
    if (!digitSpan) {
        console.error(`Lottery draw span drawn-digit-${digitIndex} not found!`);
        return; 
    }

    const spinDurationMs = 1800; 
    const spinRefreshIntervalMs = 75;
    let spinFrames = 0;
    const maxSpinFrames = Math.floor(spinDurationMs / spinRefreshIntervalMs);

    // Clear any previous interval for this span, just in case
    if(game.lottery.spinningIntervals[digitIndex]) clearInterval(game.lottery.spinningIntervals[digitIndex]);

    game.lottery.spinningIntervals[digitIndex] = setInterval(() => {
        if (spinFrames >= maxSpinFrames) {
            clearInterval(game.lottery.spinningIntervals[digitIndex]);
            
            // Reveal the pre-generated unique digit
            const finalDigit = game.lottery.drawnNumbers[digitIndex]; 
            
            if (game.lottery.userNumbers.includes(finalDigit)) {
                digitSpan.innerHTML = `<span style="color: lime; font-weight:bold;">${finalDigit}</span>`;
            } else {
                digitSpan.textContent = finalDigit;
            }
            digitSpan.style.borderColor = '#080'; 

            game.lottery.currentDrawingDigitIndex++;
            drawNextLotteryDigitWithAnimation(); 
            return;
        }
        digitSpan.textContent = String(getRandomInt(0, 9)); 
        spinFrames++;
    }, spinRefreshIntervalMs);
}


function calculateLotteryResults() {
    game.lottery.matches = 0;
    const userNumSet = new Set(game.lottery.userNumbers); // For efficient lookup

    // Count matches - drawn numbers can repeat, so check each drawn against user's unique set
    // If drawn numbers should also be unique, the drawing logic would need adjustment.
    // For now, let's count how many of the *user's chosen unique numbers* appear in the drawn sequence.
    // A more typical lottery counts how many of the unique winning numbers the user picked.
    // Let's adjust to match the Python: user picks unique, drawn can have repeats.
    // We count how many of the *drawn* numbers are present in the *user's* chosen set.

    // Create a frequency map of drawn numbers if drawn numbers can repeat and we only count each user number match once.
    // Example: User picks 1,2,3,4,5,6. Drawn: 1,1,7,8,9,0. Matches = 1 (for the number '1').
    // The Python example counts distinct drawn numbers that are in the user's set.
    // If drawn are [1,1,2,3,4,5] and user picked [1,2,0,0,0,0], matches = 2 (for 1 and 2)
    
    let tempUserNumbers = [...game.lottery.userNumbers]; // Copy for mutable check
    game.lottery.drawnNumbers.forEach(drawnNum => {
        const indexInUserPicks = tempUserNumbers.indexOf(drawnNum);
        if (indexInUserPicks !== -1) {
            game.lottery.matches++;
            tempUserNumbers.splice(indexInUserPicks, 1); // Remove matched number to ensure it's not counted again if drawn multiple times
        }
    });

    game.lottery.winnings = game.lottery.prizeTiers[game.lottery.matches] || 0;

    if (game.lottery.winnings > 0) {
        game.player.credits += game.lottery.winnings;
        displayConsoleMessage(`Lottery win! You won ${game.lottery.winnings}cr for ${game.lottery.matches} matches!`, 'success', 'trade_buy');
    } else {
         displayConsoleMessage(`Lottery draw complete. ${game.lottery.matches} matches. No prize this time.`, 'minor');
    }

    game.lottery.stage = 'results';
    updateUI(); // Show the results screen
}


function handleLotteryDigitInput(currentInput, currentIndex) {
    // Ensure only a single digit 0-9 is kept
    currentInput.value = currentInput.value.replace(/[^0-9]/g, '');
    if (currentInput.value.length > 1) {
        currentInput.value = currentInput.value.charAt(0);
    }

    // Auto-tab to next input if a digit is entered and it's not the last input
    if (currentInput.value.length === 1 && currentIndex < 5) {
        const nextInput = document.getElementById(`lotto-digit-${currentIndex + 1}`);
        if (nextInput) {
            nextInput.focus();
            nextInput.select(); // Optional: select the content of the next input
        }
    }
}


// Deep clone function (ensure this is present in your script.js)
// This version aims to handle potential circular references and avoids cloning functions directly,
// which is suitable if methods are on the prototype.
function deepClone(obj, seen = new WeakMap()) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    // Handle Date objects
    if (obj instanceof Date) {
        return new Date(obj);
    }

    // Handle RegExp objects
    if (obj instanceof RegExp) {
        return new RegExp(obj);
    }

    // Circular reference check
    if (seen.has(obj)) {
        // console.warn("DeepClone encountered a circular reference. Returning the seen instance.", obj);
        return seen.get(obj); // Return the already cloned object if a cycle is detected
    }

    let clonedObj;
    if (Array.isArray(obj)) {
        clonedObj = [];
        seen.set(obj, clonedObj); // Set the reference before recursing for arrays
        for (let i = 0; i < obj.length; i++) {
            clonedObj[i] = deepClone(obj[i], seen);
        }
    } else {
        // Handling for generic objects, including class instances (data properties only)
        clonedObj = Object.create(Object.getPrototypeOf(obj)); // Preserve prototype
        seen.set(obj, clonedObj); // Set the reference before recursing for objects
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                if (typeof obj[key] !== 'function') { // Clone only data properties
                    clonedObj[key] = deepClone(obj[key], seen);
                } else {
                    // Functions are not deep cloned to avoid issues; methods should come from prototype
                }
            }
        }
    }
    return clonedObj;
}


// Save game state to localStorage
function saveGame() {
    try {
        // Create a clean copy of the game state, including console messages
        const gameState = deepClone(game);
        localStorage.setItem('cosmicTraderState', JSON.stringify(gameState));
        displayConsoleMessage("Game saved successfully!");
        playSoundEffect('upgrade'); // Use upgrade sound for save success
    } catch (e) {
        console.error("Save failed:", e);
        displayConsoleMessage("Failed to save game. Check console for details.", 'error');
        playSoundEffect('error');
    }
}


// Load game state from localStorage
function loadGame() {
    try {
        const saved = localStorage.getItem('cosmicTraderState');
        if (!saved) {
            displayConsoleMessage("No saved game found.", 'error');
            playSoundEffect('error');
            return;
        }
        if (confirm("Load saved game? This will overwrite your current progress.")) {
            const parsedGameState = JSON.parse(saved);

            // --- CRITICAL: Re-hydration Step for Ship Objects ---
            // 1. Re-hydrate game.npcs
            if (parsedGameState.npcs && Array.isArray(parsedGameState.npcs)) {
                parsedGameState.npcs = parsedGameState.npcs.map(plainNpcData => {
                    if (!plainNpcData || typeof plainNpcData.ship_id === 'undefined') {
                        console.warn("Skipping re-hydration for invalid NPC data in npcs array:", plainNpcData);
                        return null;
                    }
                    // Create a new Ship instance using the constructor
                    // Assumes FACTION_TRADER etc. are available globally from ship_definitions.js
                    const newShipInstance = new Ship(
                        plainNpcData.ship_id,
                        plainNpcData.ship_name,
                        plainNpcData.faction, // Ensure faction constants match if used directly
                        plainNpcData.ship_class,
                        plainNpcData.max_shields,
                        plainNpcData.current_shields,
                        plainNpcData.max_hull,
                        plainNpcData.current_hull,
                        plainNpcData.fighter_squadrons,
                        plainNpcData.missile_launchers,
                        plainNpcData.image_path,
                        plainNpcData.x_pos,
                        plainNpcData.y_pos
                    );
                    // If there are other properties not set by constructor but were part of the plainNpcData,
                    // you might need to assign them here. For example:
                    // Object.assign(newShipInstance, plainNpcData); // Use cautiously
                    return newShipInstance;
                }).filter(npc => npc !== null); // Remove any nulls if invalid data was skipped
            }

            // 2. Re-hydrate Ship objects within game.map.data
            if (parsedGameState.map) {
                for (const key in parsedGameState.map) {
                    if (parsedGameState.map.hasOwnProperty(key) && parsedGameState.map[key] && parsedGameState.map[key].data) {
                        const mapObjectType = parsedGameState.map[key].type;
                        const plainEntityData = parsedGameState.map[key].data;

                        if (mapObjectType === 'npc_trader' || mapObjectType === 'vinari_ship' || mapObjectType === 'duran_ship') {
                            if (plainEntityData && typeof plainEntityData.ship_id !== 'undefined') {
                                // Find the already re-hydrated instance from the new game.npcs array
                                const matchingShipInstance = parsedGameState.npcs.find(npc => npc && npc.ship_id === plainEntityData.ship_id);
                                if (matchingShipInstance) {
                                    parsedGameState.map[key].data = matchingShipInstance;
                                } else {
                                    console.warn(`Could not find re-hydrated Ship instance for map object ID: ${plainEntityData.ship_id}. Map data might be inconsistent.`);
                                    // Decide how to handle this: delete from map or leave as plain object (which will likely error later)
                                    // delete parsedGameState.map[key];
                                }
                            } else {
                                 console.warn("Invalid NPC data in map entry:", key, plainEntityData);
                            }
                        }
                    }
                }
            }

            // Now that NPCs are re-hydrated in parsedGameState, assign to the live 'game' object.
            // Clear current game state properties carefully before loading
            // This needs to be done carefully to not break references if 'game' object itself is replaced.
            // A safer approach is to assign properties individually or clear and then assign.

            // Clear current game state (simple way, might need more finesse depending on game structure)
            Object.keys(game).forEach(key => {
                if (typeof game[key] !== 'function' && game.hasOwnProperty(key)) { // Avoid deleting functions or inherited properties
                    delete game[key];
                }
            });

            // Deep copy loaded and re-hydrated state into the game object
            // The deepClone here helps ensure no shared references with parsedGameState if it's modified later.
            Object.assign(game, deepClone(parsedGameState));


            // Re-initialize audio controls in case theme or volume changed
            initAudioControls(); // Ensure this uses the newly loaded game.musicVolume etc.

            displayConsoleMessage("Game loaded successfully!");
            playSoundEffect('upgrade'); // Use upgrade sound for load success
            updateUI(); // Update UI after loading
        } else {
             displayConsoleMessage("Load game cancelled.");
        }
    } catch (e) {
        console.error("Load failed:", e);
        displayConsoleMessage("Failed to load game. Saved data might be corrupted. Check console.", 'error');
        playSoundEffect('error');
        // Optionally, clear corrupted save data: localStorage.removeItem('cosmicTraderState');
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
    ui.saveGameButton.addEventListener('click', saveGame);
    ui.loadGameButton.addEventListener('click', loadGame);
	ui.readManualButton.addEventListener('click', displayManual);

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

    // Initialize the game when the DOM is fully loaded
    initGame();
});