// --- DATA STRUCTURES ---
// Import faction constants from naming-data.js
import { FACTION_DURAN, FACTION_VINARI, FACTION_TRADER } from './naming-data.js';

export const shipClasses = {
    // -- Trades (Independent Traders Guild) SHIPS --
    'Starhawk Skiff': { // Interceptor/Fighter
        price: 5000,
        hull: 100,
        maxHull: 1000,
        fuel: 100,
        maxFuel: 250,
        cargoSpace: 25,
        maxCargoSpace: 100,
        shields: 80,
        maxShields: 80,
        mines: 0,
        maxMines: 10,
        fighters: 50,
        maxFighters: 100,
        missiles: 0,
        maxMissiles: 10,
        gndForces: 0,
        maxGndForces: 10,
        scanner: { model: 'Basic', range: 7 },
        cloakEnergy: 50,
        maxCloakEnergy: 50,
        warpDrive: 'Not Installed',
        computerLevel: 1,
        description: "A nimble, patchwork fighter built for speed and defense of trade convoys. Starhawk Skiffs are retrofitted shuttles with jury-rigged laser arrays and aftermarket thrusters, perfect for fending off pirates or evading Duran blockades. Their name evokes a fast, predatory bird, symbolizing the Traders’ knack for swooping in on opportunities. Ideal for skirmishes near Asteroid Fields or protecting Elara trade routes."
    },
    'Bargemaster Dray': { // Freighter/Cargo Hauler
        price: 15000,
        hull: 250,
        maxHull: 5000,
        fuel: 250,
        maxFuel: 1000,
        cargoSpace: 500,
        maxCargoSpace: 1000,
        shields: 250,
        maxShields: 1000,
        mines: 0,
        maxMines: 20,
        fighters: 100,
        maxFighters: 200,
        missiles: 1,
        maxMissiles: 10,
        gndForces: 0,
        maxGndForces: 100,
        scanner: { model: 'Standard', range: 10 },
        cloakEnergy: 100,
        maxCloakEnergy: 250,
        warpDrive: 'Not Installed',
        computerLevel: 1,
        description: "A massive, modular freighter with detachable cargo pods, designed to haul goods through hazardous systems. Bargemaster Drays are armored enough to withstand Micrometeorite Showers and equipped with hidden smuggling compartments to dodge Duran tariffs. Their blocky, rust-streaked hulls bear vibrant guild logos, reflecting the Traders’ pride in their commerce. Often seen near Galeth for resource runs."
    },
    'Wayfinder Scout': { // Exploration/Scientific
        price: 50000,
        hull: 250,
        maxHull: 7500,
        fuel: 250,
        maxFuel: 2000,
        cargoSpace: 150,
        maxCargoSpace: 500,
        shields: 250,
        maxShields: 2000,
        mines: 5,
        maxMines: 50,
        fighters: 100,
        maxFighters: 250,
        missiles: 1,
        maxMissiles: 25,
        gndForces: 20,
        maxGndForces: 100,
        scanner: { model: 'Advanced', range: 15 },
        cloakEnergy: 250,
        maxCloakEnergy: 250,
        warpDrive: 'Not Installed',
        computerLevel: 2,
        description: "A sleek, sensor-laden craft for charting new trade routes or scavenging alien tech. Wayfinder Scouts combine Terran navigation systems with salvaged Vinari sensors, allowing them to probe Nebulae or map Wormhole Instabilities. Their hulls are painted with star charts, embodying the Traders’ quest for profitable discoveries. Frequently deployed to unclaimed systems like Voryn."
    },
    'Corsair Reaver': { // Battleship/Destroyer
        price: 75000,
        hull: 1000,
        maxHull: 12500,
        fuel: 500,
        maxFuel: 3000,
        cargoSpace: 250,
        maxCargoSpace: 750,
        shields: 500,
        maxShields: 5000,
        mines: 5,
        maxMines: 100,
        fighters: 250,
        maxFighters: 500,
        missiles: 5,
        maxMissiles: 50,
        gndForces: 20,
        maxGndForces: 250,
        scanner: { model: 'Standard', range: 10 },
        cloakEnergy: 250,
        maxCloakEnergy: 500,
        warpDrive: 'Not Installed',
        computerLevel: 3,
        description: "A heavily modified warship, bristling with scavenged Duran cannons and Vinari shield tech. Corsair Reavers protect major trade hubs or escort convoys through Solar Storms, balancing firepower with agility. Their patchwork armor and neon decals scream defiance, named for the Traders’ pirate-like cunning in outwitting foes. Often stationed near Nexara to deter Duran raids."
    },
    'Tradebaron Citadel': { // Capital/Dreadnought
        price: 150000,
        hull: 5000,
        maxHull: 50000,
        fuel: 1000,
        maxFuel: 15000,
        cargoSpace: 750,
        maxCargoSpace: 2000,
        shields: 5000,
        maxShields: 50000,
        mines: 50,
        maxMines: 200,
        fighters: 1000,
        maxFighters: 2000,
        missiles: 20,
        maxMissiles: 100,
        gndForces: 100,
        maxGndForces: 1000,
        scanner: { model: 'Advanced', range: 15 },
        cloakEnergy: 250,
        maxCloakEnergy: 2000,
        warpDrive: 'Not Installed',
        computerLevel: 5,
        description: "A colossal, city-like flagship serving as a mobile trade hub and command center. Tradebaron Citadels house merchant councils, repair docks, and markets, armed with long-range plasma turrets to fend off Gamma-Ray Bursts or Duran assaults. Their sprawling, neon-lit structures symbolize the Guild’s economic might, often anchoring fleets at Vionis. The name reflects the influence of wealthy guild leaders."
    },
    // -- Vinari (The Vinari Collective) SHIPS --
    'Sylvara Wisp': { // Interceptor/Fighter
        price: 5000,
        hull: 100,
        maxHull: 1000,
        fuel: 100,
        maxFuel: 250,
        cargoSpace: 25,
        maxCargoSpace: 100,
        shields: 80,
        maxShields: 80,
        mines: 0,
        maxMines: 10,
        fighters: 50,
        maxFighters: 100,
        missiles: 0,
        maxMissiles: 10,
        gndForces: 0,
        maxGndForces: 10,
        scanner: { model: 'Basic', range: 7 },
        cloakEnergy: 50,
        maxCloakEnergy: 50,
        warpDrive: 'Not Installed',
        computerLevel: 1,
        description: "A darting, crescent-shaped fighter that dances through combat with fluid agility. Sylvara Wisps use energy tendrils to disable foes, glowing with bioluminescent patterns. The name suggests a fleeting, ghostly light, matching Vinari grace."
    },
    'Elythar Caravan': { // Freighter/Cargo Hauler
        price: 15000,
        hull: 250,
        maxHull: 5000,
        fuel: 250,
        maxFuel: 1000,
        cargoSpace: 500,
        maxCargoSpace: 1000,
        shields: 250,
        maxShields: 1000,
        mines: 0,
        maxMines: 20,
        fighters: 100,
        maxFighters: 200,
        missiles: 1,
        maxMissiles: 10,
        gndForces: 0,
        maxGndForces: 100,
        scanner: { model: 'Standard', range: 10 },
        cloakEnergy: 100,
        maxCloakEnergy: 250,
        warpDrive: 'Not Installed',
        computerLevel: 1,
        description: "A streamlined hauler with pod-like cargo modules linked by energy tethers. Elythar Caravans glide silently, carrying rare crystals or artifacts, protected by cloaking fields. The name evokes a nomadic procession, tied to Vinari wanderlust."
    },
    'Zynara Veil': { // Exploration/Scientific
        price: 50000,
        hull: 250,
        maxHull: 7500,
        fuel: 250,
        maxFuel: 2000,
        cargoSpace: 150,
        maxCargoSpace: 500,
        shields: 250,
        maxShields: 2000,
        mines: 5,
        maxMines: 50,
        fighters: 100,
        maxFighters: 250,
        missiles: 1,
        maxMissiles: 25,
        gndForces: 20,
        maxGndForces: 100,
        scanner: { model: 'Advanced', range: 15 },
        cloakEnergy: 250,
        maxCloakEnergy: 250,
        warpDrive: 'Not Installed',
        computerLevel: 2,
        description: "A delicate, saucer-like vessel with gossamer sensor arrays. Zynara Veils explore nebulae and anomalies, their hulls shimmering to blend with starlight. The name suggests a mystical shroud, reflecting Vinari curiosity about the cosmos."
    },
    'Auralis Thorn': { // Battleship/Destroyer
        price: 75000,
        hull: 1000,
        maxHull: 12500,
        fuel: 500,
        maxFuel: 3000,
        cargoSpace: 250,
        maxCargoSpace: 750,
        shields: 500,
        maxShields: 5000,
        mines: 5,
        maxMines: 100,
        fighters: 250,
        maxFighters: 500,
        missiles: 5,
        maxMissiles: 50,
        gndForces: 20,
        maxGndForces: 250,
        scanner: { model: 'Standard', range: 10 },
        cloakEnergy: 250,
        maxCloakEnergy: 500,
        warpDrive: 'Not Installed',
        computerLevel: 3,
        description: "A sleek warship with spire-like weaponry that channels plasma beams. Auralis Thorns strike with surgical precision, their designs both beautiful and deadly. The name combines elegance with a sharp, defensive edge, fitting Vinari duality."
    },
    'Celestryn Spire': { // Capital/Dreadnought
        price: 100000,
        hull: 2500,
        maxHull: 25000,
        fuel: 1000,
        maxFuel: 10000,
        cargoSpace: 500,
        maxCargoSpace: 1000,
        shields: 2500,
        maxShields: 25000,
        mines: 10,
        maxMines: 150,
        fighters: 500,
        maxFighters: 1000,
        missiles: 10,
        maxMissiles: 75,
        gndForces: 50,
        maxGndForces: 500,
        scanner: { model: 'Standard', range: 10 },
        cloakEnergy: 250,
        maxCloakEnergy: 1000,
        warpDrive: 'Not Installed',
        computerLevel: 4,
        description: "A towering, cathedral-like flagship with radiant energy cores. Celestryn Spires project force fields and unleash nova-like blasts, embodying Vinari technological mastery. The name evokes a celestial pinnacle, a beacon of their culture."
    },
    // -- Duran (The Duran Hegemony) SHIPS --
    'Skarva Fang': { // Interceptor/Fighter
        price: 5000,
        hull: 100,
        maxHull: 1000,
        fuel: 100,
        maxFuel: 250,
        cargoSpace: 25,
        maxCargoSpace: 100,
        shields: 80,
        maxShields: 80,
        mines: 0,
        maxMines: 10,
        fighters: 50,
        maxFighters: 100,
        missiles: 0,
        maxMissiles: 10,
        gndForces: 0,
        maxGndForces: 10,
        scanner: { model: 'Basic', range: 7 },
        cloakEnergy: 50,
        maxCloakEnergy: 50,
        warpDrive: 'Not Installed',
        computerLevel: 1,
        description: "A swift, angular fighter with razor-like wings, designed for dogfights. Skarva Fangs swarm enemies with precise, coordinated strikes, equipped with rapid-fire plasma lances. Their name evokes a predatory bite, reflecting the Duran’s aggressive tactics."
    },
    'Gorath Vault': { // Freighter/Cargo Hauler
        price: 15000,
        hull: 250,
        maxHull: 5000,
        fuel: 250,
        maxFuel: 1000,
        cargoSpace: 500,
        maxCargoSpace: 1000,
        shields: 250,
        maxShields: 1000,
        mines: 0,
        maxMines: 20,
        fighters: 100,
        maxFighters: 200,
        missiles: 1,
        maxMissiles: 10,
        gndForces: 0,
        maxGndForces: 100,
        scanner: { model: 'Standard', range: 10 },
        cloakEnergy: 100,
        maxCloakEnergy: 250,
        warpDrive: 'Not Installed',
        computerLevel: 1,
        description: "A hulking, boxy freighter with reinforced hulls for hauling ores and war supplies. Gorath Vaults are slow but nearly indestructible, with modular cargo bays guarded by automated turrets. The name suggests an impregnable stronghold."
    },
    'Vrenix Probe': { // Exploration/Scientific
        price: 50000,
        hull: 250,
        maxHull: 7500,
        fuel: 250,
        maxFuel: 2000,
        cargoSpace: 150,
        maxCargoSpace: 500,
        shields: 250,
        maxShields: 2000,
        mines: 5,
        maxMines: 50,
        fighters: 100,
        maxFighters: 250,
        missiles: 1,
        maxMissiles: 25,
        gndForces: 20,
        maxGndForces: 100,
        scanner: { model: 'Advanced', range: 15 },
        cloakEnergy: 250,
        maxCloakEnergy: 250,
        warpDrive: 'Not Installed',
        computerLevel: 2,
        description: "A compact, sensor-heavy craft for scouting hostile systems. Vrenix Probes have stealth plating and advanced scanners to analyze planets or enemy fleets. The name implies a piercing, investigative tool, fitting the Duran’s pragmatic approach."
    },
    'Kravos Rend': { // Battleship/Destroyer
        price: 75000,
        hull: 1000,
        maxHull: 12500,
        fuel: 500,
        maxFuel: 3000,
        cargoSpace: 250,
        maxCargoSpace: 750,
        shields: 500,
        maxShields: 5000,
        mines: 5,
        maxMines: 100,
        fighters: 250,
        maxFighters: 500,
        missiles: 5,
        maxMissiles: 50,
        gndForces: 20,
        maxGndForces: 250,
        scanner: { model: 'Standard', range: 10 },
        cloakEnergy: 250,
        maxCloakEnergy: 500,
        warpDrive: 'Not Installed',
        computerLevel: 3,
        description: "A mid-sized warship bristling with heavy cannons and missile arrays. Kravos Rends are built to shred enemy formations, with jagged prows for ramming. The name conveys destruction and unrelenting force, a Duran hallmark."
    },
    'Drenkar Monolith': { // Capital/Dreadnought
        price: 100000,
        hull: 2500,
        maxHull: 25000,
        fuel: 1000,
        maxFuel: 10000,
        cargoSpace: 500,
        maxCargoSpace: 1000,
        shields: 2500,
        maxShields: 25000,
        mines: 10,
        maxMines: 150,
        fighters: 500,
        maxFighters: 1000,
        missiles: 10,
        maxMissiles: 75,
        gndForces: 50,
        maxGndForces: 500,
        scanner: { model: 'Standard', range: 10 },
        cloakEnergy: 250,
        maxCloakEnergy: 1000,
        warpDrive: 'Not Installed',
        computerLevel: 4,
        description: "A colossal command ship, dwarfing fleets with its slab-like armor and city-sized weapon batteries. Drenkar Monoliths anchor Duran armadas, unleashing devastating barrages. The name evokes an unyielding, ancient structure, symbolizing Duran supremacy."
    }
};


// -- Scanner Types --
export const scannerModels = {
    Basic: { range: 7, cost: 0 },
    Standard: { range: 10, cost: 12000 },
    Advanced: { range: 15, cost: 25000 }
};

// -- Ship Equipment Costs at SpacePorts --
export const equipmentCosts = {
    shields: { cost: 500, amount: 100, max: 'maxShields' },
    mines: { cost: 100, amount: 1, max: 'maxMines' },
    fighters: { cost: 200, amount: 1, max: 'maxFighters' },
    missiles: { cost: 300, amount: 1, max: 'maxMissiles' },
    cargoSpace: { cost: 1000, amount: 50, max: 'maxCargoSpace' },
    hull: { cost: 1000, amount: 100, max: 'maxHull' },
    cloakEnergy: { cost: 500, amount: 100, max: 'maxCloakEnergy' },
    gndForces: { cost: 100, amount: 10, max: 'maxGndForces' },
    fuel: { cost: 50, amount: 100, unitCost: 0.5 }
};

// -- Commodities and stuff to sell at SpacePorts --
export const commodities = ['ore', 'food', 'tech'];
export const exoticPrices = { minerals: 250, organics: 500, artifacts: 5000 };

// -- Planets, Stars and Hazards --
// All star, planet, hazard names and info is randomly generated from the terms below
export const planetNames = ["Xandor", "Elara", "Sygnara", "Voryn", "Celestara", "Rynara", "Thalys", "Orwyn", "Glavara", "Zephyron", "Tyria", "Axion", "Nebulon", "Valthor", "Saronis", "Elyx", "Corvus", "Zantara", "Oberyn", "Krythos", "Selara", "Phaeton", "Ecliptor", "Astralis", "Vionis", "Nexilon", "Caelum", "Sypher", "Galeth", "Xeridia", "Lumora", "Tychon", "Velara", "Myriad", "Arctura", "Novex", "Zephyris", "Calyx", "Orithyia", "Sylvara", "Aetherion", "Draconis", "Quasys", "Solara", "Erebos", "Thalara", "Kryon", "Vylis", "Nexara", "Zorath", "Ilythar", "Vexalon", "Synthera", "Auralis", "Zypheron", "Tarsys", "Elion", "Gravara", "Nyxara", "Corynth", "Xylara", "Praxon", "Vionara", "Zelthar", "Astron", "Kytheris", "Sylion", "Eryndor", "Valthys", "Orythia", "Nebula", "Xerath", "Tylara", "Cygnara", "Aethys", "Zorwyn", "Vexara", "Sylthara", "Klyon", "Ecthara", "Rynther", "Galara", "Zyron", "Velithor", "Naxara", "Thalith", "Orionis", "Clythera", "Voryth", "Aelara", "Xynara", "Krylara", "Zentara", "Elythar", "Sovara", "Nyxion", "Tethys", "Vionth", "Astrara"];
export const planetTypes = ["Terran", "Jungle", "Desert", "Ocean", "Ice", "Lava", "Gas Giant", "Barren", "Toxic"];
export const planetAtmospheres = ["N2-O2", "CO2", "Methane", "Ammonia", "Acid", "Thin", "None", "Dense"];
export const planetOwnership = ["Unclaimed", "Federation", FACTION_DURAN, FACTION_VINARI, "Pirate", "Colony", FACTION_TRADER];
export const starNames = ["Zorathis", "Aelion", "Sypheris", "Vorynth", "Celara", "Rynex", "Thalarae", "Orwynis", "Glavion", "Zephyra", "Tyronis", "Axionis", "Nebulys", "Valthara", "Sarion", "Elyxar", "Corvys", "Zantaris", "Oberys", "Krythar", "Selaris", "Phaetara", "Eclipson", "Astralon", "Vionara", "Nexilys", "Caelion", "Sypheron", "Galethar", "Xeridion", "Lumarys", "Tychara", "Velion", "Myrion", "Arcturis", "Novara", "Zephyrion", "Calyxar", "Orithys", "Sylvaris", "Aetherys", "Draconara", "Quasara", "Solarion", "Erebion", "Thalysar", "Kryonis", "Vylion", "Nexarion", "Zorathar"];
export const starTypes = ["O-Type", "B-Type", "A-Type", "F-Type", "G-Type", "K-Type", "M-Type", "White Dwarf", "Red Giant", "Brown Dwarf"];
export const hazardTypes = ["Black Hole", "Asteroid Field", "Mine", "Solar Storm", "Nebula", "Interstellar Dust Cloud", "Plasma Field", "Ion Cloud", "Micrometeorite Shower", "Magnetic Storm", "Dark Matter Cloud"];
export const planetImagesByType = { // These are stored in: ./Images/planets/
    "Terran": ["Images/planets/Terran_World_1.gif", "Images/planets/Terran_World_2.gif"],
    "Jungle": ["Images/planets/Jungle_World_1.gif"],
    "Desert": ["Images/planets/Desert_World_1.gif"],
    "Ocean": ["Images/planets/Ocean_World_1.gif"],
    "Ice": ["Images/planets/Ice_World_1.gif"],
    "Lava": ["Images/planets/Lava_World_1.gif"],
    "Gas Giant": ["Images/planets/Gas_Giant_1.gif"],
    "Barren": ["Images/planets/Moon_1.gif"],
    "Toxic": ["Images/planets/Toxic_World_1.gif"],
    "Unknown": ["Images/planets/Unknown_World_1.gif"]
};
export const starImagesByType = { // These are stored in: ./Images/stars/
    "G-Type": ["Images/stars/Star_Yellow_1.gif"],
    "K-Type": ["Images/stars/Star_Orange_1.gif"],
    "M-Type": ["Images/stars/Star_Red_1.gif"],
    "O-Type": ["Images/stars/Star_Blue_1.gif"],
    "B-Type": ["Images/stars/Star_BlueWhite_1.gif"],
    "WD": ["Images/stars/Star_White_1.gif"],
    "Unknown": ["Images/stars/Star_Unknown_1.gif"]
};
export const hazardImagesByType = { // These are stored in: ./Images/hazards/
    "Mine": ["Images/hazards/Mines.png"],
    "Black Hole": ["Images/hazards/Black_Hole_1.gif", "Images/hazards/Black_Hole_2.gif", "Images/hazards/Black_Hole_3.gif"],
    "Asteroid Field": ["Images/hazards/Asteroid_1.gif", "Images/hazards/Asteroid_2.gif", "Images/hazards/Asteroid_3.gif"],
    "Solar Storm": ["Images/hazards/SolarStorm.png"],
    "Nebula": ["Images/hazards/Nebula.png"],
    "Unknown": ["Images/hazards/unknown_1.gif"]
};

// -- Ports and SpacePorts --
// S = SELL, B = BUY
// There is three commodities these ports sell (ore, food, tech)
// So a 'SBB' = SELL Ore, BUY food, BUY tech
export const portTypes = [
    'SBB',
    'SBS',
    'SSB',
    'BSS',
    'BBS',
    'BSB',
    'SSS',
    'BBB'
];
// GFX for Interaction section when at a port
// These are stored in: ./Images/ports/ and are randomly picked when visiting a Port
export const portImages = [
    'Images/ports/Port_1.png',
    'Images/ports/Port_2.png',
    'Images/ports/Port_3.png',
    'Images/ports/Port_4.png',
    'Images/ports/Port_5.png'
];
// GFX for Interaction section when at a port
// These are stored in: ./Images/stations/ and are randomly picked when visiting a Space Port
export const spacePortImages = [
    'Images/stations/Station_1.png',
    'Images/stations/Station_2.png',
    'Images/stations/Station_3.png'
];
export const LOTTERY_PLAYS_RESET_INTERVAL_MOVES = 1000; // Player gets 3 new plays every 50 moves
export const PORT_FOR_SALE_BASE_CHANCE = 0.22; // 22% base chance

// -- VIRUS TYPES --
// Define virus types and their effects
// Effects are functions that take the player object and modify it
export const virusTypes = [
    {
        name: "Credit Drain",
        effect: (player) => { const loss = Math.ceil(player.credits * 0.005); player.credits = Math.max(0, player.credits - loss); return `-${loss} credits`; },
        duration: 20
    }, // Drain 0.5% credits per move
    {
        name: "Shield Malfunction",
        effect: (player) => { const loss = 5; player.ship.shields = Math.max(0, player.ship.shields - loss); return `-${loss} shields`; },
        duration: 15
    }, // Lose 5 shields per move
    {
        name: "Weapon Lockout",
        effect: (player) => { /* Placeholder - need scanner effect */ return "Weapons Offline (N/I)"; },
        duration: 5
    }, // Not implemented yet
    {
        name: "Fuel Leak",
        effect: (player) => { const loss = 1; player.ship.fuel = Math.max(0, player.ship.fuel - loss); return `-1 fuel`; },
        duration: 25
    }, // Lose 1 fuel per move
    {
        name: "Scanner Glitch",
        effect: (player) => { /* Placeholder - need scanner effect */ return "Scanner Range Reduced (N/I)"; },
        duration: 10

    }, // Not implemented yet
    {
        name: "Navigation Scramble",
        effect: (player) => { /* Placeholder - could slightly alter course or increase fuel cost */ return "Navigation Unreliable (N/I)"; },
        duration: 10
    }, // Not implemented yet
    {
        name: "System Sluggishness",
        effect: (player) => { /* Placeholder - could slow down menu interaction or repair rates */ return "Systems Lagging (N/I)"; },
        duration: 15
    }, // Not implemented yet
];

// --- AUDIO DATA ---
// Music files are located here: ./Music
// To add your own music, put the entries here
export const musicThemes = [
    { name: "Darkness Below", file: "Music/The-Darkness-Below.mp3" },
    { name: "Star Light", file: "Music/Star-Light.mp3" },
    { name: "Solar Storm", file: "Music/Solar-Storm.mp3" },
    { name: "Cold Moon", file: "Music/Cold-Moon.mp3" }
];


// --- Game Loop Intervals (How often checks occur) ---
export const GAME_LOOP_INTERVALS = {
    incomeAndBuilding: 10, // Faction income and ship building every 10 turns
    factionActionRoll: 5,  // Each faction rolls for an action every 5 turns
    economicUpdates: 5     // Economic updates happen every 5 turns (already existing)
};

// --- Faction Action Probabilities (Per Faction, Per Action Roll) ---
// These are the CHANCES a specific action will be attempted when it's that faction's turn to roll for an action.
// The sum of probabilities for each faction should not exceed 1.0 (or just let higher values mean higher chance)
export const FACTION_ACTION_PROBABILITIES = {
    [FACTION_DURAN]: {
        invasion: 0.03,             // Base 3% chance per roll
        economicSabotage: 0.02,     // Base 2% chance
        militarySabotage: 0.02,     // Base 2% chance
        shipSkirmish: 0.10,         // Base 10% chance
        seizeIndependentPort: 0.03  // Base 3% chance
    },
    [FACTION_VINARI]: {
        invasion: 0.03,
        economicSabotage: 0.02,
        militarySabotage: 0.02,
        shipSkirmish: 0.10,
        seizeIndependentPort: 0.03
    },
    [FACTION_TRADER]: {
        invasion: 0.00,             // Traders don't do military invasions
        economicSabotage: 0.08,     // Higher chance for economic sabotage
        militarySabotage: 0.03,
        shipSkirmish: 0.05,         // Lower chance for skirmishes
        seizeIndependentPort: 0.15  // Higher chance for seizing independent ports
    }
};

// -- MAYBE USE THIS LATER --
//const npcShipNames = ["Bucket", "Stardust", "Runner", "Comet", "Nomad", "Griffin", "Hammer", "Wanderer", "Zephyr", "Goliath"];
//const npcShipClasses = ["Freighter", "Scout", "Gunship", "Raider", "Patrol", "Cruiser"];
//const npcHostility = ["Low", "Med", "High", "Unknown"];

// --- SIMULATION CONSTANTS ---
// Consolidated from script.js for centralization
export const SIMULATION_MODE_ENABLED = true; // Set to true to enable, false to disable
export const SIMULATION_TICK_INTERVAL_MS = 250; // Time in milliseconds (e.g., 10000 = 10 seconds)
