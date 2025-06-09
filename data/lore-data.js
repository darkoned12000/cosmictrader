const FACTION_LORE = {
    [FACTION_DURAN]: {
        name: "The Duran Hegemony",
        background: "The Duran Hegemony is a sprawling, authoritarian empire forged by a reptilian-insectoid race descended from apex predators on their volcanic homeworld, Krythos (a Methane-rich planet orbiting an M-Type star). Evolving in a harsh environment of searing ash storms and scarce resources, the Duran developed a physiology blending scaly armor with chitinous exoskeletons, giving them resilience and a menacing appearance. Their society is rigidly hierarchical, organized into clans led by warlords who prove their strength in ritual combat. The Hegemony’s history is one of conquest, having unified their fractured world through brutal wars before expanding to dominate neighboring systems.<br> Duran technology is utilitarian, favoring durability over elegance. Their angular, heavily armored ships (e.g., Drenkar Monolith) reflect their obsession with strength, built in vast orbital forges above resource-rich planets like Zorath. Their culture reveres discipline and sacrifice, with every Duran expected to serve the Hegemony’s glory, whether as a soldier, engineer, or laborer. Art and leisure are sparse, seen as distractions from duty. Their cities are fortress-like, carved into cliffs or built as mobile war-bases, reflecting their nomadic warrior past.",

        philosophy: "The Duran believe in “Strength Through Unity,” viewing the universe as a crucible where only the strongest survive. Weakness is a sin, and submission to a greater force (the Hegemony) ensures collective power. They see other races as either threats to be crushed or resources to be exploited, with no room for equality. Their governance is meritocratic but ruthless, rewarding those who prove their worth in battle or service.",

        motto: "Forge the Chain, Break the Weak.",

        motivations: "The Duran Hegemony is driven by expansion and control. They seek to impose order on a chaotic galaxy, claiming planets and resources to fuel their war machine. Their primary goals include: Territorial Dominance, Resource Acquisition, Supremacy",

        racerelations: "The Duran view the Vinari with disdain, seeing their nomadic, mystical ways as cowardly and disorganized. They consider Vinari ships (e.g., Sylvara Wisp) fragile and their reliance on stealth dishonorable. Skirmishes are common over resource-rich systems, with the Duran attempting to seize Vinari-explored planets like Elara. However, the Vinari’s agility and cloaking tech often frustrate Duran assaults, leading to a grudging respect for their evasiveness. Diplomacy is rare, as the Duran demand submission, which the Vinari reject.<br> The Duran tolerate the Terran Traders as a necessary evil, relying on their freighters for rare goods not worth conquering planets for. They view Traders as opportunistic weaklings, often extorting them for protection fees in Hegemony space (e.g., near Kravos Rend patrols). The Traders’ neutrality frustrates the Duran, who pressure them to align against the Vinari. Conflicts arise when Traders smuggle goods to Vinari or bypass Duran tariffs, prompting blockades or raids.",

        appearance: "Scaly, insectoid warriors with glowing red eyes, clad in battle-armor"
    },
    [FACTION_VINARI]: {
        name: "The Duran Hegemony",
        background: "The Vinari Collective is a decentralized alliance of bio-luminescent, semi-corporeal beings native to Celestara, a lush, H2O-rich planet orbiting a G-Type star. Evolving in a nebula-shrouded system, the Vinari developed a symbiotic biology, blending organic tissues with energy-based structures, allowing them to manipulate electromagnetic fields. Their appearance is fluid, resembling glowing, humanoid shapes with tendril-like appendages, which inspired their sleek, organic ships (e.g., Celestryn Spire). Their society is nomadic, organized into migratory fleets that explore the galaxy, seeking knowledge and harmony with cosmic forces.<br> Vinari culture is deeply spiritual, viewing the universe as a living entity they must commune with. Their technology integrates bio-energy, with ships grown from crystalline seeds rather than built. Their settlements are temporary, often on habitable worlds like Elara or Sylvara, where they leave behind glowing monuments. They lack a central government, instead making decisions through telepathic consensus, which outsiders find chaotic but effective. Their history is peaceful but marked by evasion of threats, including early Duran invasions.",

        philosophy: "The Vinari embrace “Flow with the Cosmos,” believing all life is interconnected and guided by universal energies. They value exploration, adaptability, and preservation, avoiding conflict unless necessary. Knowledge is sacred, and they seek to understand stars, planets, and even hazards like Black Holes to align with the galaxy’s rhythm.",

        motto: "Drift in Light, Bind in Truth.",

        motivations: "The Vinari Collective is driven by exploration and enlightenment. They aim to map the galaxy’s mysteries and coexist with its diversity. Their key goals include: Discovery, Preservation, Connection",

        racerelations: "The Vinari see the Duran as destructive, their conquests disrupting the galaxy’s harmony. They avoid direct conflict, using stealth and mobility (e.g., Elythar Caravan) to evade Duran fleets. When forced to fight, Vinari ships like Auralis Thorn outmaneuver rather than overpower. They’ve tried diplomacy, offering knowledge in exchange for peace, but the Duran’s demands for control stall talks. The Vinari protect planets like Voryn from Duran colonization, leading to tense standoffs.<br>        The Vinari have a warm, cooperative relationship with the Traders, valuing their role as galactic connectors. They trade exotic artifacts and star charts for Terran tech or supplies, often via Elythar Caravans docking at Trader hubs. The Vinari’s openness makes them ideal partners, though they warn Traders against aiding Duran aggression. Occasional tensions arise when Traders exploit Vinari worlds, but these are resolved through negotiation.",

        appearance: "Glowing, fluid forms with shifting colors, like living auroras"
    },
    [FACTION_TRADER]: {
        name: "The Duran Hegemony",
        background: "The Independent Traders Guild is a loose coalition of humanoid Terrans, descended from Earth-like colonies scattered across G-Type and K-Type star systems, such as Elara (N2-O2 atmosphere). Originating from a failed federation, the Terrans turned to commerce for survival, forming the Guild to navigate a galaxy dominated by powers like the Duran and Vinari. Their ships are pragmatic, retrofitted for trade and survival, ranging from small shuttles to massive freighters. Guild hubs are bustling space stations or neutral planets like Vionis, where diverse cultures mingle.<br> Terran society is individualistic, driven by profit and opportunity. The Guild lacks a unified government, operating through merchant councils that prioritize trade routes over ideology. Their technology is eclectic, blending salvaged alien tech with human ingenuity, evident in their versatile but unpolished ships. Their history is one of adaptation, thriving in the shadows of larger empires by exploiting their conflicts and needs.",

        philosophy: "The Traders follow “Profit Through Opportunity,” believing wealth and survival come from exploiting every situation. They’re neutral, aligning with whoever pays best, but maintain a code of mutual benefit to avoid collapse. They value freedom and distrust centralized power, seeing it as a threat to their independence.",

        motto: "Trade Turns the Stars.",

        motivations: "The Traders are driven by wealth and survival. They aim to dominate galactic trade while avoiding subjugation. Their goals include: Trade Dominance, Neutrality, Expansion",

        racerelations: "The Traders maintain a cautious, transactional relationship with the Duran, supplying raw materials or tech in exchange for safe passage. The Duran’s extortion and blockades (e.g., near Kravos Rend) strain ties, forcing Traders to smuggle or bribe. Some Traders secretly arm Vinari allies, risking Duran wrath, but most stay neutral to preserve profits.<br> The Traders admire the Vinari’s openness, forming strong trade partnerships. They exchange Terran goods for Vinari knowledge or artifacts, often at planets like Sylvara. The Vinari’s idealism sometimes frustrates the profit-driven Traders, but their mutual respect prevents major conflicts. Traders act as intermediaries, relaying Vinari discoveries to other systems.",

        appearance: "Diverse Terrans in practical jumpsuits or merchant finery"
    }
    // You can add more factions like "Federation" or "Pirates" here later
};
