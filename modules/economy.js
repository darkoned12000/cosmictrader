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
}
];

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
            // We can add a "reverse" effect here if needed in the future to normalize prices.
            game.activeEconomicEvents.splice(i, 1); // Remove from active list
        }
    }

    // --- PART 2: Trigger a new event? ---
    // Only trigger a new event if there isn't one already running, to avoid chaos.
    if (game.activeEconomicEvents.length === 0 && Math.random() < 0.1) { // 10% chance per cycle
        const eventTemplate = getRandomElement(ECONOMIC_EVENTS);

        // Create a new instance of the event
        const newEvent = {
            name: eventTemplate.name,
            duration: eventTemplate.duration(),
            endMessage: eventTemplate.endMessage,
        };

        // Apply the event's effect to all ports
        game.ports.forEach(port => eventTemplate.effect(port));

        // Add to the active list
        game.activeEconomicEvents.push(newEvent);

        // Log the start of the event
        const startMsg = `[EVENT] ${eventTemplate.startMessage}`;
        displayConsoleMessage(startMsg, 'economy');
        logGalaxyEvent(startMsg, 'economy');
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
