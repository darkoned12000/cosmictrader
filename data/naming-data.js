const FIRST_NAMES = [
    "Korgath", "T'Pral", "Quarkis", "Garoth", "Lwaxana", "Zevok", "Wicketta", "Vornak", "Salat", "Tuvix",
    "Brakiss", "J’onnar", "Qweev", "Lirath", "M’pok", "Sybok", "Dukat", "N’vek", "Romara", "Chirpa",
    "T’Lara", "Vorin", "Grelok", "Feris", "Betara", "Kweej", "Torg", "Vulan", "Zorin", "Yaddlek",
    "Grilka", "S’var", "Porgo", "Nelix", "Tarkon", "Worfek", "L’Rell", "Vexis", "Q’Tar", "Logray",
    "Sarek", "Damara", "Krillix", "T’Vok", "Gornath", "Zekara", "B’Elan", "Vorok", "Tweeka", "Jarak",
    "Jaxon", "Kai", "Leo", "Zane", "Axel", "Ronan", "Nico", "Orion", "Cyrus", "Kian", "Elara",
    "Lyra", "Nova", "Aria", "Seraphina", "Astrid", "Thalia", "Zara", "Iris", "Juniper"
];

const LAST_NAMES = [
    "K’tar", "V’lar", "Zolak", "Duras", "Troi’el", "Yubnub", "Skrain", "T’Pol", "Quarkon", "Moghra",
    "V’tek", "Wompat", "Garakith", "T’varis", "Bruntok", "Korgon", "L’Raan", "Zev’rok", "Tarkis", "S’vok",
    "Deanna’ra", "Wicketar", "Vorath", "Gul’ek", "T’Lani", "Romulak", "B’Tor", "Zibber", "Kweevok", "Martok",
    "Vulanis", "Porgath", "S’laris", "Chirpok", "T’Rell", "Gornok", "Ferengi’ok", "Yaddlek", "Krillara", "V’Kor",
    "Lograth", "Betazoidis", "Q’Tal", "Worfak", "Tuvokis", "Zek’ra", "Damarok", "Sybokar", "J’onnok", "Brakith",
    "Volkov", "Orlov", "Stark", "Vance", "Cross", "Valerius", "Blackwood", "Dresden", "Kincaid", "Thorne", "Vega",
    "Ryder", "Corbin", "Silas", "Drake", "Sterling", "Lander", "Creed", "Joric", "Griffin"
];

// New data structure for faction-specific final words.
const FACTION_DEATH_CRIES = {
    [FACTION_DURAN]: [
        "For the Hegemony! Avenge my steel!",
        "My scales shatter, but our will endures!",
        "You dare defy Krythos’s wrath? You’ll burn!",
        "The clan will carve your name in blood!",
        "Iron bends, but the Duran never break!",
        "This is not defeat... it’s a signal for war!",
        "My hull’s gone, but our forge burns eternal!",
        "You’ll choke on the ashes of this mistake!",
        "Grah! My warlord will crush your bones!",
        "The Monolith will grind you to dust!",
        "Tell the fleet... I held the line...",
        "Our claws will rend your worlds apart!",
        "This wreck fuels our vengeance!",
        "Ugh! My bonus was *this* close to vesting!",
        "Who parked that asteroid in my flight path?!"
    ],
    [FACTION_VINARI]: [
        "The Collective weeps... but the cosmos remembers!",
        "My light fades, yet the Veil endures!",
        "You fracture the harmony... we’ll realign you!",
        "This anomaly will be corrected, interloper!",
        "My essence joins the stellar currents...",
        "The Spire will sing of this betrayal!",
        "Our data binds us... you cannot erase us!",
        "Celestara weeps for this disruption!",
        "Agh! The calculations... were flawless...",
        "You dim our glow, but not our purpose!",
        "The stars will judge your recklessness!",
        "My tendrils dissolve... but the Collective rises!",
        "This chaos offends the cosmic flow!",
        "Error... my warranty doesn’t cover explosions!",
        "Whoops... miscalculated the escape vector!"
    ],
    [FACTION_TRADER]: [
        "My cargo! My margins! Ruined!",
        "You’ll pay for this... in credits or blood!",
        "This deal just cost me everything!",
        "My stash was hidden in—*static*—nooo!",
        "Guild won’t cover this insurance claim!",
        "Vionis will hear of this outrage!",
        "You wrecked my best trade run yet!",
        "This is why I hate rush deliveries!",
        "My profits... sinking into the void...",
        "Tell my clients... the deal’s off!",
        "Ugh! Should’ve upgraded the shields!",
        "My ledger’s redder than a supernova!",
        "This wreck’s coming out of your paycheck!",
        "Why didn’t I stick to safe sectors?!",
        "I knew that discount warp drive was a scam!"
    ],
    'default': [
        "My ship! My pride!",
        "This is not how I go out!",
        "You’ll regret this, spacer!",
        "Agh! The void claims me...",
        "Tell my crew... I tried...",
        "Engines failing... stars fading...",
        "This wreck’s on you!",
        "Nooo! My life’s work!",
        "Hull breached... hope’s gone...",
        "Guess I’m space dust now!"
    ]
};

// --- Port and Space Port Naming Data ---
const PORT_PREFIXES = [
"Bloodforge", "Ironscale", "Grimclaw", "Warspike", "Ashen", // Duran-inspired
"Starwoven", "Aetherial", "Glimmer", "Celestine", "Nebulous", // Vinari-inspired
"Profit", "Sly", "Grubby", "Coin", "Hustle", // Trader-inspired
"Void", "Crimson", "Emerald", "Obsidian", "Stellar",
"Outpost", "Frontier", "Nexus", "Beacon", "Trade",
"Dusk", "Dawn", "Eclipse", "Nova", "Pulsar",
"Rogue", "Viper", "Shade", "Iron", "Bronze",
"Cosmic", "Radiant", "Ethereal", "Drift", "Flux",
"Blight", "Forge", "Crag", "Chasm", "Rift",
"Lucky", "Shady", "Nifty", "Gilded", "Rust"
];

const PORT_SUFFIXES = [
"Crag", "Maw", "Talon", "Anvil", "Pyre", // Duran-inspired
"Shimmer", "Wisp", "Gleam", "Flux", "Sylph", // Vinari-inspired
"Deal", "Haggle", "Stash", "Cartel", "Score", // Trader-inspired
"Station", "Hub", "Depot", "Junction", "Haven",
"Gate", "Node", "Spire", "Terminal", "Reach",
"Forge", "Nexus", "Post", "Relay", "Crossing",
"Edge", "Landing", "Garrison", "Market", "Exchange",
"Rift", "Void", "Crest", "Span", "Vault",
"Bazaar", "Port", "Dock", "Sprawl", "Link",
"Chasm", "Beacon", "Pinnacle", "Drift", "Cluster"
];

const SPACE_PORT_NAMES = [
"Krythos Ironmaw", // Duran stronghold
"Bloodforge Citadel", // Duran fortress
"Skullrend Bastion", // Duran warbase
"Ashen Talon Hold", // Duran outpost
"Dreadforge Anvil", // Duran industrial hub
"Celestara Starveil", // Vinari sanctuary
"Aetherial Shimmerport", // Vinari cosmic dock
"Glimmering Sylph Nexus", // Vinari exploration hub
"Nebulous Driftspire", // Vinari nebula base
"Starwoven Haven", // Vinari serene port
"Vionis Profit Sprawl", // Trader market
"Sly Deal Depot", // Trader smuggling hub
"Grubby Stash Station", // Trader black market
"Coinmonger’s Crossing", // Trader trade hub
"Hustle Haven", // Trader commerce center
"Elara’s Emerald Gate", // Neutral, habitable world
"Nexara’s Crimson Forge", // Duran mining colony
"Zorath’s Blighted Crag", // Duran industrial zone
"Voryn’s Ethereal Node", // Vinari exploration post
"Galeth’s Rusty Bazaar", // Trader resource hub
"Obsidian Rift Relay", // Hazard-adjacent port
"Pulsar’s Wrath Terminal", // High-risk trade post
"Nebula’s Whisper Dock", // Vinari nebula outpost
"Black Hole’s Last Spire", // Dangerous frontier
"Cosmic Chasm Market", // Neutral trade nexus
"Radiant Crest Vault", // Vinari-inspired hub
"Iron Viper Garrison", // Duran military post
"Shade Flux Exchange", // Trader covert market
"Dawn’s Gilded Sprawl", // Trader luxury port
"Eclipse Shadow Port", // Smuggler hideout
"Nova Nugget Depot", // Comedic Trader gold rush
"Rogue Comet Pin", // Humorous Trader outpost
"Blighted Score Shack", // Trader scrap market
"Starlit Pickle Jar", // Funny Vinari trade post
"Cragmaw’s Budget Forge", // Comedic Duran factory
"Void Tickler’s Relay", // Humorous neutral port
"Frontier Fang Spark", // Duran frontier base
"Stellar Haggle Heap", // Trader junkyard port
"Driftspire’s Glow", // Vinari minimalist dock
"Chasm’s Ironclad Post", // Duran defensive hub
"Lucky Loot Lair", // Trader treasure port
"Shady Nebula Nook", // Trader smuggler base
"Nifty Bolt Bin", // Comedic Trader repair shop
"Rustbucket Reach", // Trader derelict station
"Pinnacle Pulse Port", // Vinari elite hub
"Bronze Talon Trade", // Duran trade outpost
"Cosmic Deal Dive", // Trader chaotic market
"Ethereal Mist Market", // Vinari serene trade
"Riftforge Rally", // Duran war rally point
"Cluster’s Cheap Stop", // Comedic Trader discount port
];
