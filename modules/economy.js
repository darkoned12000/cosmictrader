// --- NEW DATA STRUCTURE FOR ECONOMIC EVENTS ---
const ECONOMIC_EVENTS = [
{
    name: "Food Shortage",
    type: 'bust',
    commodity: 'food',
    duration: () => getRandomInt(50, 100),
    startMessage: "Galactic News: A major agricultural blight has caused widespread food shortages! Food prices are spiking.",
    endMessage: "Trade Update: New harvests have arrived from the outer colonies, stabilizing food prices.",
    effect: (port) => { port.prices.food = Math.min(500, port.prices.food + getRandomInt(20, 40)); }
},
{
    name: "Tech Boom",
    type: 'boom',
    commodity: 'tech',
    duration: () => getRandomInt(40, 80),
    startMessage: "Market News: A breakthrough in micro-fusion technology has flooded the market! Tech prices are plummeting.",
    endMessage: "Market Analysis: The tech surplus has been bought up by corporate interests. Prices are returning to normal levels.",
    effect: (port) => { port.prices.tech = Math.max(10, port.prices.tech - getRandomInt(15, 30)); }
},
{
    name: "Mining Strike",
    type: 'bust',
    commodity: 'ore',
    duration: () => getRandomInt(60, 120),
    startMessage: "Labor Alert: A widespread miners' strike has halted ore production on several key worlds. Ore prices are soaring.",
    endMessage: "Labor Update: The miners' union has reached an agreement. Ore production is resuming, and prices are stabilizing.",
    effect: (port) => { port.prices.ore = Math.min(500, port.prices.ore + getRandomInt(15, 25)); }
},
{
    name: "Pirate Raids",
    type: 'bust',
    commodity: 'all',
    duration: () => getRandomInt(30, 70),
    startMessage: "Security Alert: Increased pirate activity is disrupting major trade routes! All commodity prices are becoming volatile.",
    endMessage: "Security Update: Coordinated patrols have driven pirates from the trade routes. Shipping prices are returning to normal.",
    effect: (port) => {
        port.prices.ore += getRandomInt(-25, 25);
        port.prices.food += getRandomInt(-25, 25);
        port.prices.tech += getRandomInt(-25, 25);
    }
},
{
    name: "Duran Forge Surge",
    type: 'boom',
    commodity: 'ore',
    duration: () => getRandomInt(50, 90),
    startMessage: "Galactic News: The Duran Hegemony’s forges on Krythos are overproducing! Ore floods the market, slashing prices!",
    endMessage: "Market Update: Duran warlords have redirected ore to their armadas. Ore prices stabilize as supply tightens.",
    effect: (port) => { port.prices.ore = Math.max(10, port.prices.ore - getRandomInt(20, 35)); }
},
{
    name: "Vinari Bio-Harvest",
    type: 'boom',
    commodity: 'food',
    duration: () => getRandomInt(40, 80),
    startMessage: "Cosmic Broadcast: Vinari bio-engineers on Celestara have unlocked radiant algae blooms! Food prices are crashing galaxy-wide!",
    endMessage: "Trade Report: The Vinari have gifted their surplus to allies, balancing food markets once more.",
    effect: (port) => { port.prices.food = Math.max(10, port.prices.food - getRandomInt(15, 30)); }
},
{
    name: "Trader Tech Heist",
    type: 'bust',
    commodity: 'tech',
    duration: () => getRandomInt(60, 100),
    startMessage: "Guild Alert: Shady Traders swiped a Vinari tech cache from Vionis! Tech prices are skyrocketing due to shortages!",
    endMessage: "Market News: The Guild cracked down on black-market tech deals. Prices are settling as supplies return.",
    effect: (port) => { port.prices.tech = Math.min(500, port.prices.tech + getRandomInt(20, 40)); }
},
{
    name: "Nebula Flux Crisis",
    type: 'bust',
    commodity: 'all',
    duration: () => getRandomInt(50, 120),
    startMessage: "Security Warning: A massive Nebula flux is scrambling trade routes! All commodity prices are wildly unstable!",
    endMessage: "Galactic Update: Vinari navigators have mapped safe routes through the Nebula. Trade resumes, stabilizing prices.",
    effect: (port) => {
        port.prices.ore += getRandomInt(-30, 30);
        port.prices.food += getRandomInt(-30, 30);
        port.prices.tech += getRandomInt(-30, 30);
    }
},
// NEW ECONOMIC EVENTS FOR SHIP EQUIPMENT
{
    name: "Shield Component Boom",
    type: 'boom',
    commodity: 'shields',
    target: 'equipmentCosts',
    duration: () => getRandomInt(30, 60),
    startMessage: "Manufacturing surge in shield generators! Shield prices plummet!",
    endMessage: "Shield market stabilizes.",
    effect: (costs) => { costs.shields.cost = Math.max(50, costs.shields.cost - getRandomInt(50, 150)); }
},
{
    name: "Ordnance Shortage",
    type: 'bust',
    commodity: 'missiles',
    target: 'equipmentCosts',
    duration: () => getRandomInt(40, 80),
    startMessage: "Rare materials for missile production are scarce! Missile prices soar!",
    endMessage: "Missile production resumes, prices normalize.",
    effect: (costs) => { costs.missiles.cost = Math.min(1000, costs.missiles.cost + getRandomInt(100, 250)); }
},
{
    name: "Fighter Pilot Strike",
    type: 'bust',
    commodity: 'fighters',
    target: 'equipmentCosts',
    duration: () => getRandomInt(35, 70),
    startMessage: "Fighter pilot union demands better pay! Fighter craft prices spike!",
    endMessage: "Pilot dispute resolved, fighter prices stabilize.",
    effect: (costs) => { costs.fighters.cost = Math.min(700, costs.fighters.cost + getRandomInt(50, 100)); }
},
{
    name: "Structural Material Surplus",
    type: 'boom',
    commodity: 'hull',
    target: 'equipmentCosts',
    duration: () => getRandomInt(40, 80),
    startMessage: "Abundance of hyper-alloy minerals! Hull repair and upgrade costs decrease!",
    endMessage: "Hull material market evens out.",
    effect: (costs) => { costs.hull.cost = Math.max(100, costs.hull.cost - getRandomInt(100, 300)); }
},
{
    name: "Cargo Bay Overhaul",
    type: 'boom',
    commodity: 'cargoSpace',
    target: 'equipmentCosts',
    duration: () => getRandomInt(50, 90),
    startMessage: "New modular cargo tech lowers upgrade costs! Cargo bay expansion is cheaper!",
    endMessage: "Cargo tech becomes standard, prices normalize.",
    effect: (costs) => { costs.cargoSpace.cost = Math.max(100, costs.cargoSpace.cost - getRandomInt(200, 500)); }
},
{
    name: "Ground Forces Recruitment Drive",
    type: 'boom',
    commodity: 'gndForces',
    target: 'equipmentCosts',
    duration: () => getRandomInt(30, 60),
    startMessage: "Military recruitment drive lowers ground forces deployment costs!",
    endMessage: "Recruitment slows, prices return to normal.",
    effect: (costs) => { costs.gndForces.cost = Math.max(20, costs.gndForces.cost - getRandomInt(10, 30)); }
},
{
    name: "Cloaking Field Innovations",
    type: 'boom',
    commodity: 'cloakEnergy',
    target: 'equipmentCosts',
    duration: () => getRandomInt(45, 85),
    startMessage: "Breakthrough in stealth technology! Cloaking module prices reduced!",
    endMessage: "Cloaking tech widely adopted, prices stabilize.",
    effect: (costs) => { costs.cloakEnergy.cost = Math.max(50, costs.cloakEnergy.cost - getRandomInt(50, 150)); }
},
{
    name: "New Shipyard Efficiency",
    type: 'boom',
    commodity: 'ship_prices', // A generic identifier for all ships
    target: 'shipClasses',
    duration: () => getRandomInt(60, 120),
    startMessage: "Galactic shipyards unveil new production techniques! All ship prices are falling!",
    endMessage: "Ship manufacturing capacity normalizes, prices return to baseline.",
    effect: (ships) => { // 'ships' refers to the global shipClasses object
        for (const shipKey in ships) {
            // Ensure not to reduce price below a reasonable minimum or too drastically
            if (ships[shipKey].price) {
                ships[shipKey].price = Math.max(Math.floor(ships[shipKey].price * 0.8), ships[shipKey].price - getRandomInt(500, 5000));
            }
        }
    }
},
{
    name: "Interstellar Trade Tariffs",
    type: 'bust',
    commodity: 'ship_prices', // A generic identifier for all ships
    target: 'shipClasses',
    duration: () => getRandomInt(70, 130),
    startMessage: "New interstellar trade tariffs imposed! Ship import/export prices are rising!",
    endMessage: "Tariff disputes resolved, ship prices normalize.",
    effect: (ships) => { // 'ships' refers to the global shipClasses object
        for (const shipKey in ships) {
            if (ships[shipKey].price) {
                ships[shipKey].price = Math.min(Math.floor(ships[shipKey].price * 1.2), ships[shipKey].price + getRandomInt(500, 5000));
            }
        }
    }
},
{
    name: "Duran Shield Sabotage",
    type: 'bust',
    commodity: 'shields',
    target: 'equipmentCosts',
    duration: () => getRandomInt(50, 100),
    startMessage: "Duran saboteurs from Krythos tamper with shield factories! Shield prices soar as supplies dwindle!",
    endMessage: "Security forces thwart Duran sabotage. Shield production resumes, prices stabilize.",
    effect: (costs) => { costs.shields.cost = Math.min(1200, costs.shields.cost + getRandomInt(150, 300)); }
},
{
    name: "Vinari Missile Cache Discovery",
    type: 'boom',
    commodity: 'missiles',
    target: 'equipmentCosts',
    duration: () => getRandomInt(40, 80),
    startMessage: "Vinari explorers uncover an ancient missile stockpile on Celestara! Missile prices plummet!",
    endMessage: "Vinari distribute the missile surplus, normalizing market prices.",
    effect: (costs) => { costs.missiles.cost = Math.max(100, costs.missiles.cost - getRandomInt(100, 200)); }
},
{
    name: "Trader Fighter Smuggling Bust",
    type: 'bust',
    commodity: 'fighters',
    target: 'equipmentCosts',
    duration: () => getRandomInt(45, 90),
    startMessage: "Trader Guild caught smuggling fighters through Vionis! Crackdowns spike fighter prices!",
    endMessage: "Guild negotiates amnesty, fighter market stabilizes.",
    effect: (costs) => { costs.fighters.cost = Math.min(800, costs.fighters.cost + getRandomInt(75, 150)); }
},
{
    name: "Nebula Alloy Bloom",
    type: 'boom',
    commodity: 'hull',
    target: 'equipmentCosts',
    duration: () => getRandomInt(50, 100),
    startMessage: "Nebula-mined alloys flood markets from Vinari expeditions! Hull upgrade costs drop sharply!",
    endMessage: "Nebula alloy supply depletes, hull prices return to normal.",
    effect: (costs) => { costs.hull.cost = Math.max(50, costs.hull.cost - getRandomInt(150, 400)); }
},
{
    name: "Duran Cargo Seizures",
    type: 'bust',
    commodity: 'cargoSpace',
    target: 'equipmentCosts',
    duration: () => getRandomInt(60, 120),
    startMessage: "Duran warlords seize cargo modules for their armadas! Cargo bay upgrade prices skyrocket!",
    endMessage: "Duran releases seized cargo tech, prices stabilize.",
    effect: (costs) => { costs.cargoSpace.cost = Math.min(1500, costs.cargoSpace.cost + getRandomInt(300, 600)); }
},
{
    name: "Trader Mercenary Surge",
    type: 'boom',
    commodity: 'gndForces',
    target: 'equipmentCosts',
    duration: () => getRandomInt(40, 80),
    startMessage: "Trader Guild hires mercenaries en masse on Galeth! Ground forces deployment costs plummet!",
    endMessage: "Mercenary contracts expire, ground forces prices normalize.",
    effect: (costs) => { costs.gndForces.cost = Math.max(10, costs.gndForces.cost - getRandomInt(15, 40)); }
},
{
    name: "Black Hole Cloak Disruption",
    type: 'bust',
    commodity: 'cloakEnergy',
    target: 'equipmentCosts',
    duration: () => getRandomInt(50, 100),
    startMessage: "Black Hole anomalies disrupt cloaking tech production! Cloak module prices surge!",
    endMessage: "Scientists counter Black Hole interference, cloak prices stabilize.",
    effect: (costs) => { costs.cloakEnergy.cost = Math.min(1000, costs.cloakEnergy.cost + getRandomInt(100, 250)); }
},
{
    name: "Vinari Shipyard Harmony",
    type: 'boom',
    commodity: 'ship_prices',
    target: 'shipClasses',
    duration: () => getRandomInt(60, 120),
    startMessage: "Vinari Collective optimizes ship growth on Elara! All ship prices drop with their cosmic efficiency!",
    endMessage: "Vinari shipyards return to standard production, prices normalize.",
    effect: (ships) => {
        for (const shipKey in ships) {
            if (ships[shipKey].price) {
                ships[shipKey].price = Math.max(Math.floor(ships[shipKey].price * 0.75), ships[shipKey].price - getRandomInt(1000, 6000));
            }
        }
    }
},
{
    name: "Duran Armada Expansion",
    type: 'bust',
    commodity: 'ship_prices',
    target: 'shipClasses',
    duration: () => getRandomInt(80, 150),
    startMessage: "Duran Hegemony commandeers shipyards for war! Ship prices soar as civilian access tightens!",
    endMessage: "Duran war efforts ease, shipyard access resumes, prices stabilize.",
    effect: (ships) => {
        for (const shipKey in ships) {
            if (ships[shipKey].price) {
                ships[shipKey].price = Math.min(Math.floor(ships[shipKey].price * 1.3), ships[shipKey].price + getRandomInt(1000, 6000));
            }
        }
    }
},
{
    name: "Trader Shipyard Scam",
    type: 'bust',
    commodity: 'ship_prices',
    target: 'shipClasses',
    duration: () => getRandomInt(70, 130),
    startMessage: "Trader Guild caught inflating shipyard costs with fake shortages! Ship prices spike across Vionis!",
    endMessage: "Guild scam exposed, ship prices return to normal.",
    effect: (ships) => {
        for (const shipKey in ships) {
            if (ships[shipKey].price) {
                ships[shipKey].price = Math.min(Math.floor(ships[shipKey].price * 1.25), ships[shipKey].price + getRandomInt(750, 5500));
            }
        }
    }
}];


// This function processes the lifecycle of economic events and regular price fluctuations.
function updateEconomy() {
    // --- PART 1: Process and decrement active events ---
    // We iterate backwards so we can safely remove items from the array.
    for (let i = game.activeEconomicEvents.length - 1; i >= 0; i--) {
        const activeEvent = game.activeEconomicEvents[i];
        activeEvent.duration--;

        if (activeEvent.duration <= 0) {
            // Event has expired, log its end message and remove it.
            const endMsg = `[EVENT] ${activeEvent.endMessage}`;
            displayConsoleMessage(endMsg, 'economy');
            logGalaxyEvent(endMsg, 'economy');
            game.activeEconomicEvents.splice(i, 1);
            game.nextEconomicEventTurn = game.moveCount + getRandomInt(10, 30);
        }
    }

    // --- PART 2: Trigger a new event? ---
    // Only trigger a new event if there isn't one already running AND it's past the cooldown turn
    if (game.activeEconomicEvents.length === 0 && game.moveCount >= (game.nextEconomicEventTurn || 0) && Math.random() < 0.15) { // Increased chance to 15%
        const eventTemplate = getRandomElement(ECONOMIC_EVENTS);

        // Create a new instance of the event
        const newEvent = {
            name: eventTemplate.name,
            duration: eventTemplate.duration(),
            endMessage: eventTemplate.endMessage,
        };

        // Apply the event's effect based on its target
        if (eventTemplate.target === 'equipmentCosts') {
            eventTemplate.effect(equipmentCosts); // Pass the global equipmentCosts object
            displayConsoleMessage(`[EVENT] ${eventTemplate.startMessage}`, 'economy');
            logGalaxyEvent(`[EVENT] ${eventTemplate.startMessage}`, 'economy');
        } else if (eventTemplate.target === 'shipClasses') {
            eventTemplate.effect(shipClasses); // Pass the global shipClasses object
            displayConsoleMessage(`[EVENT] ${eventTemplate.startMessage}`, 'economy');
            logGalaxyEvent(`[EVENT] ${eventTemplate.startMessage}`, 'economy');
        } else { // Default to ports for commodity events
            game.ports.forEach(port => eventTemplate.effect(port));
            displayConsoleMessage(`[EVENT] ${eventTemplate.startMessage}`, 'economy');
            logGalaxyEvent(`[EVENT] ${eventTemplate.startMessage}`, 'economy');
        }

        // Add to the active list
        game.activeEconomicEvents.push(newEvent);
    }

    // --- PART 3: Regular, minor price fluctuations ---
    // This happens every cycle regardless of events, keeping the market moving.
    game.ports.forEach(p => {
        commodities.forEach(c => {
            const fluctuation = getRandomInt(-2, 2); // Small, constant "market noise"
            p.prices[c] += fluctuation;
            p.prices[c] = Math.max(5, Math.min(p.prices[c], 500)); // Clamp prices
        });
    });
}


// This function should remain in this file.
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
        const maxCredits = p.type === 'spacePort' ? 200000 : 20000;
        if (p.credits < maxCredits) {
            p.credits += Math.max(1, Math.round(p.credits * 0.01));
            p.credits = Math.min(p.credits, maxCredits);
        }
    });
}


function processColonyProduction() {
    const playerPlanets = game.planets.filter(p => p.ownership === game.player.name && p.colony.population > 0);

    if (playerPlanets.length === 0) return;

    playerPlanets.forEach(planet => {
        // Each 100,000 population generates resources
        const productionUnits = Math.floor(planet.colony.population / 100000);
        if (productionUnits <= 0) return;

        // Production is based on planet type
        let oreProd = 0, foodProd = 0, techProd = 0;
        switch (planet.planetType) {
            case 'Barren': oreProd = 5; break;
            case 'Terran': foodProd = 5; techProd = 1; break;
            case 'Jungle': foodProd = 3; techProd = 1; break;
            // Add more types here...
            default: oreProd = 1; foodProd = 1; techProd = 1; break;
        }

        planet.inventory.ore += productionUnits * oreProd;
        planet.inventory.food += productionUnits * foodProd;
        planet.inventory.tech += productionUnits * techProd;

        // Generate credits (income)
        const income = Math.floor(planet.colony.population / 2000);
        planet.colony.income += income;
    });
}
