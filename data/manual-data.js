const manualData = {
    // Ports Descriptions, Actions and Mechanics
    "Ports": {
        "Steal Resources": {
            "description": "Allows a player to attempt to steal resources from a port they do not own.",
            "how_it_works": [
                "The player clicks the \"Steal Resources\" button at a port.",
                "The success of the attempt is determined by a combination of factors:",
                {
                    "Base Chance": "There's a base 50% chance of success.",
                    "Computer vs. Security": "The player's computerLevel is compared to the port's securityLevel. Each level of difference modifies the success chance by 5%.",
                    "Clamping": "The final success chance is clamped between 10% and 90%."
                },
                "NPCs cannot use this action."
            ],
            "success": {
                "description": "If the attempt is successful:",
                "points": [
                    "A random percentage (2-5%) of the port's stock of each commodity is stolen.",
                    "The stolen amount is limited by the player's available cargo space.",
                    "The stolen resources are added to the player's inventory and removed from the port's stock."
                ]
            },
            "failure": {
                "description": "If the attempt fails:",
                "points": [
                    "The player is fined 1-3% of their current credits.",
                    "A portion of the player's cargo (3-5%) is confiscated."
                ]
            },
            "resistance": {
                "description": "Ports resist theft in two main ways:",
                "points": [
                    "Security Level: The port's securityLevel directly impacts the success chance of the theft attempt.",
                    "Consequences of Failure: The penalties for failing a theft attempt act as a deterrent."
                ]
            },
            "tts_include": ["description", "how_it_works", "success", "failure"]
        },
        "Hack Credits": {
            "description": "Allows a player to attempt to hack a port or spaceport to steal credits.",
            "how_it_works": [
                "The player clicks the \"Hack Credits\" button at a port or spaceport.",
                "The success of the attempt is determined by a combination of factors:",
                {
                    "Base Chance": "There's a base 40% chance of success.",
                    "Computer vs. Security": "The player's computerLevel is compared to the port's securityLevel. Each level of difference modifies the success chance by 7%.",
                    "Clamping": "The final success chance is clamped between 5% and 95%."
                }
            ],
            "success": {
                "description": "If the attempt is successful:",
                "points": [
                    "The player steals up to 10% of the port's credits, with a minimum of 100 credits.",
                    "The stolen credits are added to the player's credits and removed from the port's credits."
                ]
            },
            "failure": {
                "description": "If the attempt fails:",
                "points": [
                    "The player is notified that the hack failed.",
                    "There is a chance of the player's ship being infected with a virus. The chance of infection increases with the difference between the port's security level and the player's computer level."
                ]
            },
            "npc_usage": "NPCs cannot use this action.",
            "resistance": {
                "description": "Ports protect against hacking in two main ways:",
                "points": [
                    "Security Level: The port's securityLevel directly impacts the success chance of the hacking attempt.",
                    "Virus Infection: The chance of getting a virus upon failure acts as a deterrent."
                ]
            },
            "tts_include": ["description", "how_it_works", "success", "failure"]
        },
        "Play Lottery": {
            "description": "Allows a player to play the lottery at any port.",
            "how_it_works": [
                "The player clicks the \"Play Lottery\" button at a port.",
                "The player picks 6 unique numbers from 0-9.",
                "The game then draws 6 unique numbers.",
                "The player wins credits based on the number of matches."
            ],
            "npc_usage": "NPCs cannot use this action.",
            "positives": "The potential to win a large amount of credits.",
            "negatives": "The cost of the ticket and the low probability of winning the jackpot.",
        "tts_include": ["description", "how_it_works", "success", "failure"]
        },
        "Inquire Purchase": {
            "description": "Allows a player to inquire about purchasing a port.",
            "how_it_works": [
                "The player clicks the \"Inquire Purchase\" button at a port that is not owned by a major faction.",
                "There is a chance that the port will be for sale, which is influenced by the port's security level.",
                "If the port is for sale, the player can purchase it for a price that is based on the port's security level."
            ],
            "npc_usage": "NPCs cannot use this action.",
            "positives": {
                "description": "Owning a port has several benefits:",
                "points": [
                    "Provides a 10% discount on all trades and services at that port.",
                    "The player can upgrade the port's capacity and security.",
                    "The port generates income for the player (this feature is not yet fully implemented)."
                ]
            },
            "negatives": "The high cost of purchasing and upgrading a port.",
        "tts_include": ["description", "how_it_works", "success", "failure"]
        },
        "Pay Tip": {
            "description": "Allows a player to pay for a tip at any port or spaceport.",
            "how_it_works": [
                "The player clicks the \"Pay Tip\" button at a port or spaceport.",
                "The player receives a random tip from a predefined list."
            ],
            "npc_usage": "NPCs cannot use this action.",
            "positives": "The tips can provide valuable information about the game world, such as the location of rare resources or pirate activity.",
            "negatives": "The tips are random and may not always be useful.",
        "tts_include": ["description", "how_it_works", "success", "failure"]
        },
    },
    // Planet Descriptions, Actions and Mechanics
    "Planets": {
        "Scan Planet": {
            "description": "Allows a player to scan a planet to gather information about its resources and environment.",
            "how_it_works": [
                "The player clicks the \"Scan Planet\" button when near a planet.",
                "The scan provides information about the planet's resources, atmosphere, and potential hazards."
            ],
            "npc_usage": "NPCs cannot use this action.",
            "positives": {
                "description": "Scanning a planet has several benefits:",
                "points": [
                    "Reveals the types and quantities of resources available on the planet.",
                    "Provides information about the planet's atmosphere, which can affect landing and resource extraction.",
                    "Identifies potential hazards, such as extreme weather or hostile wildlife."
                ]
            },
            "negatives": "The scan may not always provide complete or accurate information."
        },
        "Mine Planet": {
            "description": "Allows a player to mine resources from a planet.",
            "how_it_works": [
                "The player clicks the \"Mine Planet\" button when near a planet (in sector) with mineable resources.",
                "The player must have the appropriate free cargo space to store the mined resources."
            ],
            "npc_usage": "NPCs cannot use this action.",
            "positives": {
                "description": "Mining a planet has several benefits:",
                "points": [
                    "Provides a source of income through the sale of mined resources.",
                    "Allows the player to gather rare or valuable resources that may not be available elsewhere.",
                    "Can contribute to the player's overall resource management strategy."
                ]
            },
            "negatives": {
                "description": "Mining a planet also has several drawbacks:",
                "points": [
                    "The mining process can be time-consuming and may require significant investment in fuel.",
                    "You might want to invest in scanners or better mining equipment to improve efficiency.",
                    "Over-mining can deplete a planet's resources, making it less profitable in the long term."
                ]
            }
        },
        "Destroy Planet": {
            "description": "Allows a player to destroy a planet using a planet-destroying weapon.",
            "how_it_works": [
                "The player clicks the \"Destroy Planet\" button when near a planet.",
                "The player must have a planet-destroying weapon equipped on their ship.",
                "Destroying a planet has significant consequences, including the loss of all resources and potential hazards associated with the planet."
            ],
            "npc_usage": "NPCs cannot use this action.",
            "positives": {
                "description": "Destroying a planet has several strategic benefits:",
                "points": [
                    "Eliminates potential threats or hazards associated with the planet production.",
                    "Can be used as a tactical move in certain scenarios (e.g., to prevent enemy factions from accessing the planet's resources).",
                    "If the has high enough level it can be used as a weapon against other players or NPCs."
                ]
            },
            "negatives": {
                "description": "Destroying a planet also has several significant drawbacks:",
                "points": [
                    "The loss of all resources and potential navigational hazards associated with the planet destruction.",
                    "Negative impact on the player's reputation with certain factions."
                ]
            }
        },
        "Colonization": {
                "description": "Colonization is not currently implemented in the game.",
                "future_plans": [
                    "In future updates, players may be able to colonize planets, which would involve establishing a base and managing resources.",
                    "Colonized planets could provide various benefits, such as resource generation and strategic advantages."
                ]
        },
        "Base Construction": {
                "description": "Base construction is not currently implemented in the game.",
                "future_plans": [
                    "In future updates, players may be able to construct bases on planets, which would involve gathering resources and managing construction projects.",
                    "Bases could provide various benefits, such as resource and fighter generation, ship docking/protection, and cannons/shields."
                ]
        }
    },
    // Spaceport Descriptions, Actions and Mechanics
    "Spaceports": {
        "Upgrade Ship": {
            "description": "Allows a player to upgrade their ship's systems and capabilities at a spaceport.",
            "how_it_works": [
                "The player clicks the \"Upgrade Ship\" button at a spaceport.",
                "The player can choose from a variety of upgrades, including weapons, shields, engines, and cargo capacity.",
                "Each upgrade has a cost in credits and may have prerequisites (e.g., certain ship level or previous upgrades)."
            ],
            "npc_usage": "NPCs cannot use this action.",
            "positives": {
                "description": "Upgrading a ship has several benefits:",
                "points": [
                    "Improves the ship's combat effectiveness and survivability.",
                    "Increases the ship's speed and maneuverability.",
                    "Expands the ship's cargo capacity, allowing for more resource collection and trading."
                ]
            },
            "negatives": {
                "description": "Upgrading a ship also has several drawbacks:",
                "points": [
                    "The cost of upgrades can be significant, especially for high-level ships.",
                    "Some upgrades may require the player to meet certain prerequisites, which can limit options."
                ]
            }
        },
        "Repair Ship": {
            "description": "Allows a player to repair their ship's hull and systems at a spaceport.",
            "how_it_works": [
                "The player can repair their ship by buying more Shields, Hull, and Fighters."
            ],
            "npc_usage": "NPCs cannot use this action."
        },
        "Refuel Ship": {
            "description": "Allows a player to refuel their ship's fuel tanks at a spaceport.",
            "how_it_works": [
                "The player clicks the \"Fuel\" button at a spaceport."
            ],
            "npc_usage": "NPCs cannot use this action."
        },
        "Selling Exotic Cargo": {
            "description": "Allows a player to sell exotic cargo at a spaceport. These are usually obtained by mining, missions or combat.",
            "how_it_works": [
                "The player clicks the \"Sell All Minerals\" button at a spaceport.",
                "The player clicks the \"Sell All Organics\" button at a spaceport.",
                "The player clicks the \"Sell All Artifacts\" button at a spaceport."
            ],
            "npc_usage": "NPCs cannot use this action.",
            "positives": {
                "description": "Selling exotic cargo has several benefits:",
                "points": [
                    "Provides a source of income through the sale of rare or valuable resources.",
                    "Helps manage the player's inventory by freeing up cargo space."
                ]
            },
            "negatives": {
                "description": "Selling exotic cargo also has several drawbacks:",
                "points": [
                    "The prices for exotic cargo can be volatile and may fluctuate based on market conditions.",
                    "Some exotic cargo may have restrictions on where it can be sold, limiting options."
                ]
            }
        },
        "Purchasing Scanners or Computer Upgrades": {
            "description": "Allows a player to purchase scanners or computer upgrades at a spaceport.",
            "how_it_works": [
                "The player clicks the \"Buy <scanner type>\" button at a spaceport to increase their scanner level by 1.",
                "The player clicks the \"Upgrade Computer <LVL>\" button at a spaceport to increase their computer level by 1."
            ],
            "npc_usage": "NPCs cannot use this action.",
            "positives": {
                "description": "Purchasing scanners or computer upgrades has several benefits:",
                "points": [
                    "Improves the player's ability to detect resources and hazards in space.",
                    "Enhances the player's hacking capabilities, making actions like stealing resources or hacking credits more successful."
                ]
            },
            "negatives": {
                "description": "Purchasing scanners or computer upgrades also has several drawbacks:",
                "points": [
                    "The cost of upgrades can be significant, especially for high-level scanners or computers.",
                    "Some upgrades may require the player to meet certain prerequisites, which can limit options."
                ]
            }
        }
    }
};
