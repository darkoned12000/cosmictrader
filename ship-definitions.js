// --- Ship Class Definition ---
class Ship {
    constructor(ship_id, ship_name, faction, ship_class,
                max_shields, current_shields,
                max_hull, current_hull,
                fighter_squadrons = 0, missile_launchers = 0,
                image_path = "assets/images/ships/placeholder.png",
                x_pos = 0, y_pos = 0, bounty = 0) {

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

        // State for Player Interaction (specifically for NPCs)
        this.is_scanned_by_player = false;
        // this.is_scanning_in_progress = false; // Best managed by UI/interaction handler
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
const FACTION_TRADER = "Trader";
const FACTION_DURAN = "Duran";
const FACTION_VINARI = "Vinari";
// Add other factions as needed

const SHIP_CLASS_FREIGHTER = "Freighter";
const SHIP_CLASS_ESCORT = "Escort";
const SHIP_CLASS_SCOUT = "Scout";
const SHIP_CLASS_CRUISER = "Cruiser";
const SHIP_CLASS_CAPITAL = "Capital Ship";

// --- NPC Generation Parameters ---
// Structure: [max_shields_range, max_hull_range, fighters_range, missiles_range, image_prefix_list]
const NPC_ARCHETYPES = {
    [FACTION_TRADER]: {
        [SHIP_CLASS_FREIGHTER]: [[50, 150], [100, 250], [0, 1], [0, 2], ["trader_freighter"]],
        [SHIP_CLASS_SCOUT]: [[30, 80], [50, 100], [0, 0], [0, 1], ["trader_scout"]]
    },
    [FACTION_DURAN]: {
        [SHIP_CLASS_ESCORT]: [[100, 250], [150, 300], [1, 3], [2, 6], ["duran_escort_varA", "duran_escort_varB"]],
        [SHIP_CLASS_CRUISER]: [[250, 500], [300, 600], [2, 5], [4, 10], ["duran_cruiser"]]
    },
    [FACTION_VINARI]: {
        [SHIP_CLASS_SCOUT]: [[70, 180], [90, 200], [0, 2], [1, 4], ["vinari_scout"]],
        [SHIP_CLASS_CRUISER]: [[300, 550], [320, 650], [3, 6], [5, 12], ["vinari_cruiser_sleek", "vinari_cruiser_heavy"]]
    }
};

// --- Name Generation (Simple Examples) ---
const TRADER_PREFIXES = ["Star", "Void", "Trade", "Far", "Quick", "Reliant"];
const TRADER_SUFFIXES = ["Runner", "Hauler", "Jumper", "Voyager", "Drifter", "Bringer"];
const DURAN_ADJECTIVES = ["Iron", "Steel", "Valiant", "Stern", "Guardian"];
const DURAN_NOUNS = ["Hammer", "Shield", "Fist", "Spear", "Bulwark"];
const VINARI_ELEMENTS = ["Nova", "Quasar", "Pulsar", "Nebula", "Comet"];
const VINARI_CONCEPTS = ["Whisper", "Echo", "Thought", "Glimpse", "Current"];

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

// --- Main NPC Generation Function ---
function createNpcShip(faction, specific_ship_class = null, x_pos_param = 0, y_pos_param = 0) {
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
    const [max_s_range, max_h_range, f_range, m_range, img_prefixes] = archetype;

    const randomIntInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    const max_shields = randomIntInRange(max_s_range[0], max_s_range[1]);
    const max_hull = randomIntInRange(max_h_range[0], max_h_range[1]);
    const fighters = randomIntInRange(f_range[0], f_range[1]);
    const missiles = randomIntInRange(m_range[0], m_range[1]);

    const ship_id_num = getNextShipId();
    const ship_id = `${faction.toLowerCase()}_${chosen_class.toLowerCase()}_${ship_id_num}`;
    const ship_name = generateShipName(faction, chosen_class);

    const image_name_prefix = img_prefixes[Math.floor(Math.random() * img_prefixes.length)];
    const image_path = `assets/images/ships/${faction.toLowerCase()}/${image_name_prefix}.png`;

    // Calculate bounty based on ship's potential threat/value
    let bountyValue = 0;
    if (faction === FACTION_DURAN || faction === FACTION_VINARI) {
        // Base bounty on stats, more for tougher ships
        bountyValue = Math.floor((max_shields / 2 + max_hull / 3 + fighters * 25 + missiles * 60) / 10) * 10;
        bountyValue = Math.max(50, bountyValue); // Minimum bounty for hostiles
    } else if (faction === FACTION_TRADER) {
        bountyValue = getRandomInt(20, 150); // Traders might carry some petty cash or small valuable cargo manifest
    }
    bountyValue = Math.max(0, bountyValue); // Ensure bounty is not negative
	
	return new Ship(
        ship_id,
        ship_name,
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
		bountyValue
    );
}

// --- Make functions and classes available if you are using modules (optional advanced setup) ---
// If you decide to use ES6 modules later, you might add:
// export { Ship, FACTION_TRADER, createNpcShip, /* etc. */ };
// For now, since you're likely using simple <script> tags, they'll be globally available.