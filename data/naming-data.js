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
        "Avenge me! For the Hegemony!",
        "Our iron will cannot be broken! You will pay for this!",
        "You have made a grave mistake... The fleet will hear of this.",
        "My hull may be breached, but the spirit of Duran is eternal!",
        "Gah! Tell my family... the bonus wasn't worth it..."
    ],
    [FACTION_VINARI]: [
        "Our projections did not foresee this outcome... impossible!",
        "You disrupt the pattern! The Collective will correct this anomaly!",
        "My energy signature fades, but my data is eternal. You will be... targeted.",
        "Agh! This is... illogical... The Council will be... displeased...",
        "Tell them... the whispers were true..."
    ],
    [FACTION_TRADER]: [
        "My cargo! My profits! Nooooo!",
        "You'll never get my secret stash! It's at... *static*",
        "This wasn't a good business decision...",
        "A deal gone bad... really bad...",
        "Just tell my clients the shipment will be... delayed. Permanently."
    ],
    // A default list for any faction that doesn't have specific messages.
    'default': [
        "Aaaargh! My ship!",
        "This can't be the end...",
        "I'll be avenged!"
    ]
};
