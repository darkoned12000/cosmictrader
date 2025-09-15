// --- Ship Class Definition ---
// ES6 Module export

// Import name data, faction constants, ship classes, and utilities
import { DURAN_FIRST_NAME, DURAN_LAST_NAME, VINARI_FIRST_NAME, VINARI_LAST_NAME, TRADER_FIRST_NAME, TRADER_LAST_NAME, FACTION_TRADER, FACTION_DURAN, FACTION_VINARI } from '../data/naming-data.js';
import { shipClasses } from '../data/game-data.js';
import { getRandomElement, getRandomInt } from '../core/utilities.js';
export class Ship {
    constructor(
        ship_id,
        ship_name,
        faction,
        ship_class,
        max_shields,
        current_shields,
        max_hull,
        current_hull,
        fighter_squadrons = 0,
        missile_launchers = 0,
        image_path = "assets/images/ships/placeholder.png",
        x_pos = 0,
        y_pos = 0,
        bounty = 0,
        captain_name = 'Unknown',
        kills = 0,
        credits = 0,
        inventory = { ore: 0, food: 0, tech: 0, minerals: 0, organics: 0, artifacts: 0 }
    ) {

        this.ship_id = ship_id;          // Unique identifier
        this.ship_name = ship_name;      // Display name
        this.faction = faction;          // E.g., "Trader", "Duran", "Vinari", "Player"
        this.ship_class = ship_class;    // E.g., "Freighter", "Scout", "Escort", "Cruiser"

        // Core Combat/Survivability Stats
        this.max_shields = parseFloat(max_shields);
        this.current_shields = parseFloat(current_shields);
        this.max_hull = parseFloat(max_hull);
        this.current_hull = parseFloat(current_hull);

        // Offensive Capabilities (relevant for scanning)
        this.fighter_squadrons = parseInt(fighter_squadrons, 10);
        this.missile_launchers = parseInt(missile_launchers, 10);

        // Visuals & Position
        this.image_path = image_path;    // Path to the ship's image
        this.x_pos = x_pos;
        this.y_pos = y_pos;
		this.bounty = bounty;
        this.captain_name = captain_name;
        this.kills = kills;

        // State for Player Interaction (specifically for NPCs)
        this.is_scanned_by_player = false;
        // this.is_scanning_in_progress = false; // Best managed by UI/interaction handler

        // NPC Economy properties
        this.credits = credits;
        this.inventory = inventory;
    }

    // Example method (you can add more as needed)
    getShieldPercentage() {
        if (this.max_shields === 0) return 0;
        return (this.current_shields / this.max_shields) * 100;
    }

    getHullPercentage() {
        if (this.max_hull === 0) return 0;
        return (this.current_hull / this.max_hull) * 100;
    }

    takeDamage(amount) {
        let damageRemaining = amount;
        if (this.current_shields > 0) {
            const damageToShields = Math.min(this.current_shields, damageRemaining);
            this.current_shields -= damageToShields;
            damageRemaining -= damageToShields;
        }

        if (damageRemaining > 0) {
            this.current_hull = Math.max(0, this.current_hull - damageRemaining);
        }

        if (this.current_hull === 0) {
            console.log(`${this.ship_name} has been destroyed!`);
            // Add more destruction logic (e.g., removing from game, explosion animation)
        }
    }
}

// --- Constants for Factions and Classes ---
// Faction constants are now imported from naming-data.js to avoid circular dependency

export const SHIP_CLASS_INTERCEPTOR = "Interceptor";
export const SHIP_CLASS_FREIGHTER = "Freighter";
export const SHIP_CLASS_FRIGATE = "Frigate";
export const SHIP_CLASS_CRUISER = "Cruiser";
export const SHIP_CLASS_EXPLORATION = "Exploration";
export const SHIP_CLASS_BATTLESHIP = "Battleship";
export const SHIP_CLASS_CAPITAL = "Capital Ship";

// --- NPC Generation Parameters ---
// Structure: [max_shields_range, max_hull_range, fighters_range, missiles_range, image_prefix_list]
// Exported for use in other modules
export const NPC_ARCHETYPES = {
    [FACTION_TRADER]: {
        [SHIP_CLASS_INTERCEPTOR]: ["Starhawk Skiff", [0.9, 1.1], [0.9, 1.1], [0, 1], [0, 2], ["trader_scout_A"]],
        [SHIP_CLASS_FREIGHTER]: ["Bargemaster Dray", [0.9, 1.1], [0.9, 1.1], [0, 0], [0, 0], ["trader_freighter_A"]],
        [SHIP_CLASS_EXPLORATION]: ["Wayfinder Scout", [0.9, 1.1], [0.9, 1.1], [0, 0], [0, 1], ["trader_scout_A"]],
        [SHIP_CLASS_BATTLESHIP]: ["Corsair Reaver", [0.9, 1.1], [0.9, 1.1], [1, 3], [2, 6], ["duran_cruiser_A"]],
        [SHIP_CLASS_CAPITAL]: ["Tradebaron Citadel", [0.9, 1.1], [0.9, 1.1], [2, 5], [4, 10], ["duran_cruiser_B"]]
    },
    [FACTION_DURAN]: {
        [SHIP_CLASS_INTERCEPTOR]: ["Skarva Fang", [0.9, 1.1], [0.9, 1.1], [1, 2], [1, 3], ["duran_escort_A"]],
        [SHIP_CLASS_FREIGHTER]: ["Gorath Vault", [0.9, 1.1], [0.9, 1.1], [0, 1], [0, 1], ["trader_freighter_A"]],
        [SHIP_CLASS_EXPLORATION]: ["Vrenix Probe", [0.9, 1.1], [0.9, 1.1], [0, 0], [0, 1], ["trader_scout_A"]],
        [SHIP_CLASS_BATTLESHIP]: ["Kravos Rend", [0.9, 1.1], [0.9, 1.1], [2, 4], [3, 8], ["duran_cruiser_A"]],
        [SHIP_CLASS_CAPITAL]: ["Drenkar Monolith", [0.9, 1.1], [0.9, 1.1], [3, 6], [5, 12], ["duran_cruiser_B"]]
    },
    [FACTION_VINARI]: {
        [SHIP_CLASS_INTERCEPTOR]: ["Sylvara Wisp", [0.9, 1.1], [0.9, 1.1], [0, 1], [0, 2], ["vinari_scout_A"]],
        [SHIP_CLASS_FREIGHTER]: ["Elythar Caravan", [0.9, 1.1], [0.9, 1.1], [0, 0], [0, 0], ["trader_freighter_A"]],
        [SHIP_CLASS_EXPLORATION]: ["Zynara Veil", [0.9, 1.1], [0.9, 1.1], [0, 0], [0, 1], ["vinari_scout_B"]],
        [SHIP_CLASS_BATTLESHIP]: ["Auralis Thorn", [0.9, 1.1], [0.9, 1.1], [3, 6], [5, 12], ["vinari_cruiser_A"]],
        [SHIP_CLASS_CAPITAL]: ["Celestryn Spire", [0.9, 1.1], [0.9, 1.1], [3, 6], [5, 12], ["vinari_cruiser_B"]]
    }
};

// --- Name Generation (Simple Examples) ---
const TRADER_PREFIXES = ["Profit", "Gilded", "Swift", "Hustle", "Bargain", "Rogue", "Coin", "Venture", "Grubby", "Sly","Nifty", "Clever", "Dusty", "Lucky", "Shady", "Bold", "Thrifty", "Glint", "Hawk", "Rust"];
const TRADER_SUFFIXES = ["Gambit", "Freight", "Skimmer", "Hustler", "Bounty", "Deal", "Cartel", "Prospector", "Swindle", "Rig", "Trawler", "Barge", "Dash", "Stash", "Venture", "Crate", "Haggle", "Drift", "Score", "Jolt"];
const DURAN_ADJECTIVES = ["Bloodforge", "Ironclad", "Grimscale", "Warborn", "Ashen", "Furywrought", "Skullrend", "Vilethorn", "Dreadforge", "Blighted", "Stonefang", "Deathforge", "Ragescale", "Ironspike", "Gloomcarved", "Wrathborn", "Sableclaw", "Vexforge"];
const DURAN_NOUNS = ["Claw", "Maw", "Talon", "Anvil", "Pyre", "Gore", "Spike", "Crag", "Doom", "Forge", "Rend", "Horn", "Fang", "Slaughter", "Chasm", "Viper", "Bane", "Crest"];
const VINARI_ELEMENTS = ["Aetherial", "Starwoven", "Glimmering", "Voidtouched", "Celestine", "Luminant", "Nebulous", "Ecliptic", "Aurorant", "Stellarine", "Cosmic", "Radiant", "Ethereal", "Starlit", "Vaporous", "Crystalline", "Nebulite", "Astral"];
const VINARI_CONCEPTS = ["Shimmer", "Pulse", "Chime", "Drift", "Gleam", "Sigh", "Flux", "Ripple", "Haze", "Sylph", "Glimmer", "Whirl", "Glow", "Wisp", "Echo", "Tide", "Mist", "Flare"];


function generateShipName(faction, ship_class) {
    let name = `Unnamed ${ship_class}`;
    const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];

    if (faction === FACTION_TRADER) {
        name = `${randomChoice(TRADER_PREFIXES)} ${randomChoice(TRADER_SUFFIXES)} ${randomChoice(['I', 'II', 'III', 'XT', 'Prime'])}`;
    } else if (faction === FACTION_DURAN) {
        name = `Duran ${randomChoice(DURAN_ADJECTIVES)} ${randomChoice(DURAN_NOUNS)}`;
    } else if (faction === FACTION_VINARI) {
        name = `Vinari ${randomChoice(VINARI_ELEMENTS)} ${randomChoice(VINARI_CONCEPTS)}`;
    }
    return name;
}

// --- ID Counter (ensure unique IDs) ---
let nextShipIdCounter = 1; // Use let as it will be reassigned

function getNextShipId() {
    const newId = nextShipIdCounter;
    nextShipIdCounter++;
    return newId;
}

// Function to reset the ship ID counter (for game restart)
export function resetShipIdCounter() {
    nextShipIdCounter = 1;
}

// --- Main NPC Name Generation Function ---
function generateNpcIdentity(faction, ship_class) {
    let firstNames, lastNames;
    if (faction === FACTION_DURAN) {
        firstNames = DURAN_FIRST_NAME;
        lastNames = DURAN_LAST_NAME;
    } else if (faction === FACTION_VINARI) {
        firstNames = VINARI_FIRST_NAME;
        lastNames = VINARI_LAST_NAME;
    } else if (faction === FACTION_TRADER) {
        firstNames = TRADER_FIRST_NAME;
        lastNames = TRADER_LAST_NAME;
    } else {
        // Fallback to Trader names
        firstNames = TRADER_FIRST_NAME;
        lastNames = TRADER_LAST_NAME;
    }

    const captainFirstName = getRandomElement(firstNames);
    const captainLastName = (Math.random() < 0.8) ? getRandomElement(lastNames) : ""; // 80% chance of having a last name
    const captainName = `${captainFirstName} ${captainLastName}`.trim();

    const shipName = generateShipName(faction, ship_class); // We can still use the old function for the ship name

    return { captainName, shipName };
}

// --- Main NPC Ship Generation Function ---
export function createNpcShip(faction, specific_ship_class = null, x_pos_param = 0, y_pos_param = 0) {
    if (!NPC_ARCHETYPES[faction]) {
        console.warn(`Warning: Faction '${faction}' not found in NPC_ARCHETYPES. Cannot create ship.`);
        return null;
    }

    const available_classes = Object.keys(NPC_ARCHETYPES[faction]);
    if (available_classes.length === 0) {
        console.warn(`Warning: No ship classes defined for faction '${faction}'.`);
        return null;
    }

    let chosen_class = specific_ship_class && available_classes.includes(specific_ship_class) ?
    specific_ship_class :
    available_classes[Math.floor(Math.random() * available_classes.length)];

    const archetype = NPC_ARCHETYPES[faction][chosen_class];
    const [ship_name_template, max_s_mod_range, max_h_mod_range, f_range, m_range, img_prefixes] = archetype;

    const baseShipStats = shipClasses[ship_name_template];
    if (!baseShipStats) {
        console.warn(`Warning: Ship template '${ship_name_template}' not found in shipClasses. Cannot create NPC.`);
        return null;
    }

    const randomIntInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const randomFloatInRange = (min, max) => (Math.random() * (max - min)) + min;

    const max_shields = Math.floor(baseShipStats.maxShields * randomFloatInRange(max_s_mod_range[0], max_s_mod_range[1]));
    const max_hull = Math.floor(baseShipStats.maxHull * randomFloatInRange(max_h_mod_range[0], max_h_mod_range[1]));
    const fighters = randomIntInRange(f_range[0], f_range[1]);
    const missiles = randomIntInRange(m_range[0], m_range[1]);

    const ship_id_num = getNextShipId();
    const ship_id = `${faction.toLowerCase()}_${chosen_class.toLowerCase()}_${ship_id_num}`;
    const { captainName, shipName } = generateNpcIdentity(faction, chosen_class);

    const image_name_prefix = img_prefixes[Math.floor(Math.random() * img_prefixes.length)];
    const image_path = `Images/ships/${image_name_prefix}.png`;

    let bountyValue = Math.floor((max_shields / 2 + max_hull / 3 + fighters * 25 + missiles * 60) / 10) * 10;
    bountyValue = Math.max(50, bountyValue);
    if (faction === FACTION_TRADER) {
        bountyValue = getRandomInt(20, 150);
    }
    bountyValue = Math.max(0, bountyValue);

    return new Ship(
        ship_id,
        shipName,
        faction,
        chosen_class,
        max_shields,
        max_shields, // current_shields = max_shields initially
        max_hull,
        max_hull,    // current_hull = max_hull initially
        fighters,
        missiles,
        image_path,
        x_pos_param,
        y_pos_param,
        bountyValue,
        captainName,
        0, // kills - NPCs start with 0 kills
        getRandomInt(500, 2000), // credits - NPCs start with 0 credits for Phase 1 as per roadmap
        { ore: 0, food: 0, tech: 0, minerals: 0, organics: 0, artifacts: 0 } // inventory - NPCs start with empty inventory for Phase 1
    );
}


