// Centralized game state and UI references
// ES6 Module exports

export const game = {
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
        credits: 500000,
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
    nextEconomicEventTurn: 0,
    saveData: {}, // For persistent data like bank accounts
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

// UI object will be initialized after DOM is loaded
export let ui = {};

// Function to initialize UI references after DOM is ready
export function initializeUI() {
    ui = {
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
}