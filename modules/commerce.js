
function trade(action, commodity, quantityToTransact = 1) { // quantityToTransact added, defaults to 1
    const sector = game.map[`${game.player.x},${game.player.y}`];
    // Ensure trading only at designated 'port' types, not 'spacePort' for commodities
    if (!sector || sector.type !== 'port') {
        displayConsoleMessage("Commodity trading is only available at regular Ports.", 'error');
        playSoundEffect('error');
        return;
    }

    const portData = sector.data;
    let price = portData.prices[commodity]; // Price is now fixed for this transaction based on port's current price
    const isPlayerOwned = portData.owner === game.player.name;
    let effectivePrice = price;
	const currentCargoTotal = Object.values(game.player.inventory).reduce((a, b) => a + b, 0);
    const playerInventory = game.player.inventory;
    const shipCargoCapacity = game.player.ship.cargoSpace;
    const portBehavior = portData.behavior[commodity];
    let sound = null;

	// Apply discount/bonus if player owns the port
    if (isPlayerOwned) {
        if (action === 'buy') {
            effectivePrice = Math.ceil(price * 0.90); // 10% discount when buying
        } else if (action === 'sell') {
            effectivePrice = Math.floor(price * 1.10); // 10% bonus when selling
        }
    }

    if (isNaN(quantityToTransact) || quantityToTransact <= 0) {
        displayConsoleMessage("Invalid transaction quantity.", "error");
        return;
    }

    if (action === 'buy') {
        if (portBehavior === 'B') {
            displayConsoleMessage(`This Port is Buying ${commodity}, not Selling.`, 'warning');
            playSoundEffect('error');
            return;
        }

        let actualQuantityToBuy = quantityToTransact;

        if (portData.stock[commodity] < actualQuantityToBuy) {
            actualQuantityToBuy = portData.stock[commodity];
            if (actualQuantityToBuy === 0) {
                displayConsoleMessage(`Port is out of ${commodity}.`, 'warning');
                playSoundEffect('error');
                return;
            }
            displayConsoleMessage(`Port only has ${actualQuantityToBuy} units of ${commodity}. Adjusting quantity.`, 'minor');
        }

        if (currentCargoTotal + actualQuantityToBuy > shipCargoCapacity) {
            actualQuantityToBuy = shipCargoCapacity - currentCargoTotal;
            if (actualQuantityToBuy <= 0) { // Check if any can be bought after cargo adjustment
                displayConsoleMessage('Cargo bay is full! Cannot buy more.', 'warning');
                playSoundEffect('error');
                return;
            }
            displayConsoleMessage(`Cargo bay can only hold ${actualQuantityToBuy} more units. Adjusting quantity.`, 'minor');
        }

        const totalCost = effectivePrice * actualQuantityToBuy; // Use effectivePrice

        if (game.player.credits < totalCost) {
            // Adjust actualQuantityToBuy based on credits and effectivePrice
            actualQuantityToBuy = Math.floor(game.player.credits / effectivePrice);
            if (actualQuantityToBuy <= 0) {
                displayConsoleMessage(`Insufficient credit balance. Need ${effectivePrice} cr for at least one unit.`, 'error');
                playSoundEffect('error');
                return;
            }
            displayConsoleMessage(`Not enough credits for ${quantityToTransact}. Buying ${actualQuantityToBuy} at discounted price.`, 'minor');
            const newTotalCost = effectivePrice * actualQuantityToBuy; // Recalculate with adjusted quantity
            game.player.credits -= newTotalCost;
        } else {
            game.player.credits -= totalCost;
        }

        if (actualQuantityToBuy > 0) {
            playerInventory[commodity] += actualQuantityToBuy;
            portData.stock[commodity] -= actualQuantityToBuy;
            // The port's internal accounting for its credits when player owns it:
            // If player owned, the port's credits effectively receive the original price to simulate a transaction,
            // but the player only 'pays' the discounted price. This keeps the port economy making sense.
            // Or, simpler: player-owned port credit changes are not tracked for player's own trades.
            // For now, let's assume the port still "processes" the original price for its own credit tracking.
            portData.credits += price * actualQuantityToBuy;


            displayConsoleMessage(`Bought ${actualQuantityToBuy} unit(s) of ${commodity} for ${totalCost} cr. ${isPlayerOwned ? '(10% owner discount applied)' : ''}`, 'success');
            sound = 'trade_buy';
        } else {
            // This case handles if all adjustments led to 0 quantity (e.g. full cargo, no stock, no money)
            // Specific messages are already displayed above.
        }


    } else if (action === 'sell') {
        if (portBehavior === 'S') {
            displayConsoleMessage(`This Port is Selling ${commodity}, not Buying.`, 'warning');
            playSoundEffect('error');
            return;
        }

        let actualQuantityToSell = quantityToTransact;

        if (playerInventory[commodity] < actualQuantityToSell) {
            actualQuantityToSell = playerInventory[commodity];
             if (actualQuantityToSell === 0) {
                displayConsoleMessage(`You have no ${commodity} to sell.`, 'warning');
                playSoundEffect('error');
                return;
            }
            displayConsoleMessage(`You only have ${actualQuantityToSell} units of ${commodity}. Adjusting quantity.`, 'minor');
        }

        const maxPortCanTake = portData.capacity[commodity] - portData.stock[commodity];
        if (maxPortCanTake < actualQuantityToSell) {
            actualQuantityToSell = maxPortCanTake;
            if (actualQuantityToSell <= 0) {
                displayConsoleMessage(`Port's ${commodity} storage is full. Cannot sell more.`, 'warning');
                playSoundEffect('error');
                return;
            }
            displayConsoleMessage(`Port can only accept ${actualQuantityToSell} more units of ${commodity}. Adjusting quantity.`, 'minor');
        }

        const totalGain = effectivePrice * actualQuantityToSell; // Use effectivePrice for player's gain

        if (portData.credits < (price * actualQuantityToSell) /* Port pays original price from its treasury */ ) {
            actualQuantityToSell = Math.floor(portData.credits / price); // How many can port afford at original price
            if (actualQuantityToSell <= 0) {
                displayConsoleMessage(`Port cannot afford to buy any ${commodity}.`, 'warning');
                playSoundEffect('error');
                return;
            }
            displayConsoleMessage(`Port can only afford ${actualQuantityToSell} units. Selling that amount.`, 'minor');
            // Recalculate totalGain for player based on new actualQuantityToSell and effectivePrice
            const newTotalGainForPlayer = effectivePrice * actualQuantityToSell;
            game.player.credits += newTotalGainForPlayer;
            portData.credits -= (price * actualQuantityToSell); // Port pays original price
        } else {
            game.player.credits += totalGain;
            portData.credits -= (price * actualQuantityToSell); // Port pays original price
        }

        if (actualQuantityToSell > 0) {
            playerInventory[commodity] -= actualQuantityToSell;
            portData.stock[commodity] += actualQuantityToSell;

            displayConsoleMessage(`Sold ${actualQuantityToSell} unit(s) of ${commodity} for ${totalGain} cr. ${isPlayerOwned ? '(10% owner bonus applied)' : ''}`, 'success');
            sound = 'trade_sell';
        } else {
            // This case handles if all adjustments led to 0 quantity
        }
    }

    if (sound) {
        playSoundEffect(sound);
    }
    updateUI();
}


function handleTradeAll(action, commodity) {
    const sector = game.map[`${game.player.x},${game.player.y}`];
    if (!sector || sector.type !== 'port') {
        displayConsoleMessage("Trade All/Max actions only at Ports.", "error");
        return; // Should already be at a port if these buttons are visible
    }

    const portData = sector.data;
    const price = portData.prices[commodity];
    const playerInventory = game.player.inventory;
    const shipCargoCapacity = game.player.ship.cargoSpace;
    const currentCargoTotal = Object.values(playerInventory).reduce((a, b) => a + b, 0);

    let quantityToTrade = 0;

    if (action === 'buy') {
        if (portData.behavior[commodity] === 'B') {
             displayConsoleMessage(`This Port is Buying ${commodity}, not Selling.`, 'warning'); return;
        }
        if (price <= 0) { // Prevent division by zero or buying free items if price somehow becomes 0
            displayConsoleMessage(`Cannot buy ${commodity} at current price (${price} cr).`, 'warning'); return;
        }

        const maxAffordableByCredits = Math.floor(game.player.credits / price);
        const maxFitInCargo = shipCargoCapacity - currentCargoTotal;
        const portStockAvailable = portData.stock[commodity];

        quantityToTrade = Math.min(maxAffordableByCredits, maxFitInCargo, portStockAvailable);

        if (quantityToTrade <= 0) {
            displayConsoleMessage(`Unable to buy maximum ${commodity}. Check credits, cargo space, or port stock.`, 'warning');
            return;
        }
        displayConsoleMessage(`Attempting to buy ${quantityToTrade} units of ${commodity}.`, 'info');
    } else if (action === 'sell') {
        if (portData.behavior[commodity] === 'S') {
            displayConsoleMessage(`This Port is Selling ${commodity}, not Buying.`, 'warning'); return;
        }
        const playerHas = playerInventory[commodity];
        const portCanPhysicallyTake = portData.capacity[commodity] - portData.stock[commodity];
        const portCanAffordUnits = (price > 0) ? Math.floor(portData.credits / price) : Infinity; // if price is 0, port can "afford" infinite

        quantityToTrade = Math.min(playerHas, portCanPhysicallyTake, portCanAffordUnits);

        if (quantityToTrade <= 0) {
            displayConsoleMessage(`Unable to sell all ${commodity}. Check your stock, port capacity/funds, or item price.`, 'warning');
            return;
        }
        displayConsoleMessage(`Attempting to sell ${quantityToTrade} units of ${commodity}.`, 'info');
    }

    if (quantityToTrade > 0) {
        trade(action, commodity, quantityToTrade); // Call the main trade function
    }
}


function buyFuel() {
    const input = document.getElementById('buy-fuel-amount')?.value;
    const amountToBuy = parseInt(input, 10);

    if (isNaN(amountToBuy) || amountToBuy <= 0) {
        displayConsoleMessage("Enter a positive number of fuel units to buy.", 'error');
        playSoundEffect('error');
        return;
    }

    const costPerUnit = equipmentCosts.fuel.unitCost;
    const maxCanHold = game.player.ship.maxFuel - game.player.ship.fuel;
    const actualAmountToBuy = Math.min(amountToBuy, maxCanHold);
    const totalCost = Math.ceil(actualAmountToBuy * costPerUnit);

    if (actualAmountToBuy <= 0) {
        displayConsoleMessage("Fuel tank is already full!", 'error');
        playSoundEffect('error');
        return;
    }

    if (game.player.credits < totalCost) {
        displayConsoleMessage(`Insufficient credits. Need ${totalCost} cr to buy ${actualAmountToBuy} fuel.`, 'error');
        playSoundEffect('error');
        return;
    }

    game.player.credits -= totalCost;
    game.player.ship.fuel += actualAmountToBuy;

    displayConsoleMessage(`Bought ${actualAmountToBuy} fuel for ${totalCost} cr.`);
    playSoundEffect('trade_buy'); // Use a success sound for buying
    updateUI();
}

function buyEquipment(type) {
    const itemInfo = equipmentCosts[type];
    if (!itemInfo) {
        displayConsoleMessage(`Unknown equipment type: ${type}`, 'error');
        return;
    }

    const currentAmount = game.player.ship[type] || 0;
    const maxCapacity = game.player.ship[itemInfo.max] !== undefined ? game.player.ship[itemInfo.max] : Infinity;

    if (currentAmount >= maxCapacity) {
        displayConsoleMessage(`${type[0].toUpperCase() + type.slice(1)} is already at maximum capacity!`, 'error');
        playSoundEffect('error');
        return;
    }

    const cost = itemInfo.cost;
    if (game.player.credits < cost) {
        displayConsoleMessage(`Insufficient credits. Need ${cost} cr to buy ${type}.`, 'error');
        playSoundEffect('error');
        return;
    }

    game.player.credits -= cost;
    if (game.player.ship[type] === undefined) {
        game.player.ship[type] = 0;
    }
    game.player.ship[type] += itemInfo.amount;
    game.player.ship[type] = Math.min(game.player.ship[type], maxCapacity); // Ensure we don't exceed max

    displayConsoleMessage(`Bought +${itemInfo.amount} ${type}!`);
    playSoundEffect('upgrade'); // Use upgrade sound for equipment
    updateUI();
}


function handleSellExotic(resourceName) {
    if (!game.player.inventory.hasOwnProperty(resourceName)) {
        displayConsoleMessage(`Error: Unknown resource '${resourceName}'.`, 'error');
        return;
    }

    if (game.player.inventory[resourceName] > 0) {
        const price = exoticPrices[resourceName];
        game.player.inventory[resourceName]--;
        game.player.credits += price;
        const displayName = resourceName.charAt(0).toUpperCase() + resourceName.slice(1);
        displayConsoleMessage(`Sold 1 ${displayName} for ${price} credits.`, 'success');
        playSoundEffect('trade_sell');
        updateUI();
    } else {
        const displayName = resourceName.charAt(0).toUpperCase() + resourceName.slice(1);
        displayConsoleMessage(`You have no ${displayName} to sell.`, 'warning');
        playSoundEffect('error');
    }
}


function handleSellAllExotic(resourceName) {
    const amountToSell = game.player.inventory[resourceName];
    if (amountToSell > 0) {
        const pricePerUnit = exoticPrices[resourceName];
        const totalGain = amountToSell * pricePerUnit;

        game.player.inventory[resourceName] = 0; // Sell the entire stack
        game.player.credits += totalGain;

        const displayName = resourceName.charAt(0).toUpperCase() + resourceName.slice(1);
        displayConsoleMessage(`Sold ${amountToSell} ${displayName} for ${totalGain.toLocaleString()} credits.`, 'success');
        playSoundEffect('trade_sell');
        updateUI();
    } else {
        // This case should not be reachable if the button is disabled correctly, but it's good practice.
        displayConsoleMessage("You have none of that resource to sell.", "warning");
    }
}


function upgradeScanner(model) {
    const scannerInfo = scannerModels[model];
    if (!scannerInfo) {
        displayConsoleMessage(`Unknown scanner model: ${model}`, 'error');
        return;
    }
    // Prevent buying the same or lower model
    if (scannerModels[game.player.ship.scanner.model].range >= scannerInfo.range) {
        displayConsoleMessage(`Already have ${game.player.ship.scanner.model} or better scanner.`, 'error');
        playSoundEffect('error');
        return;
    }


    const cost = scannerInfo.cost;
    if (game.player.credits < cost) {
        displayConsoleMessage(`Insufficient credits. Need ${cost} cr to buy ${model} Scanner.`, 'error');
        playSoundEffect('error');
        return;
    }

    game.player.credits -= cost;
    game.player.ship.scanner = { model, range: scannerInfo.range };

    displayConsoleMessage(`Upgraded to ${model} Scanner!`);
    playSoundEffect('upgrade');
    updateUI();
}

function buyWarpDrive() {
    const cost = 5000;
    if (game.player.ship.warpDrive === 'Installed') {
        displayConsoleMessage("Warp Drive is already installed.", 'error');
        playSoundEffect('error');
        return;
    }

    if (game.player.credits < cost) {
        displayConsoleMessage(`Insufficient credits. Need ${cost} cr to install Warp Drive.`, 'error');
        playSoundEffect('error');
        return;
    }

    if (confirm(`Install Warp Drive for ${cost}cr?`)) {
        game.player.credits -= cost;
        game.player.ship.warpDrive = 'Installed';
        displayConsoleMessage('Warp Drive installed!');
        playSoundEffect('upgrade');
        updateUI();
    } else {
         displayConsoleMessage("Warp Drive installation cancelled.");
    }
}

function calculateTradeIn(newClass) {
    const newShip = shipClasses[newClass];
    const oldShip = shipClasses[game.player.class];

    // Value of the old ship's base price (e.g., 50%)
    const oldShipValue = (oldShip.price || 0) * 0.5;

    let equipmentValue = 0;
    // Calculate value of current equipment that exceeds the base of the new ship
    for (const type in equipmentCosts) {
        if (type === 'fuel') continue; // Fuel doesn't have trade-in value

        const itemInfo = equipmentCosts[type];
        const oldShipBaseAmount = oldShip[type] !== undefined ? oldShip[type] : 0;
        const currentPlayerAmount = game.player.ship[type] !== undefined ? game.player.ship[type] : 0;

        // Amount of equipment the player has beyond the *base* amount of their *old* ship
        const excessAmount = Math.max(0, currentPlayerAmount - oldShipBaseAmount);

        if (excessAmount > 0 && itemInfo.amount > 0) {
             // Value the excess equipment at a percentage (e.g., 50%) of its purchase cost
            equipmentValue += (excessAmount / itemInfo.amount) * itemInfo.cost * 0.5;
        }
    }

    // Value of Scanner upgrade (only if upgraded beyond the old ship's base scanner)
    const currentScannerCost = scannerModels[game.player.ship.scanner.model].cost;
    const oldScannerCost = scannerModels[oldShip.scanner.model].cost;
    if (currentScannerCost > oldScannerCost) {
        equipmentValue += (currentScannerCost - oldScannerCost) * 0.5; // Value difference at 50%
    }

    // Value of Warp Drive (if installed)
    if (game.player.ship.warpDrive === 'Installed' && oldShip.warpDrive !== 'Installed') {
        equipmentValue += 5000 * 0.5; // Value Warp Drive at 50% of installation cost
    }

    // Value for computer level (only if upgraded beyond the old ship's base level)
    const oldComputerLevel = oldShip.computerLevel || 1;
    const currentComputerLevel = game.player.ship.computerLevel || 1;
    if (currentComputerLevel > oldComputerLevel) {
         // Value each level *beyond* the old ship's base level
        const levelDiff = currentComputerLevel - oldComputerLevel;
         // Use a value that scales with the upgrade cost - maybe related to the average upgrade cost?
         // Average cost is roughly currentLevel * 10000 + 5000. Let's use a fixed value per level for simplicity in trade-in.
        equipmentValue += levelDiff * 4000; // Example: 4k per level beyond old ship's base
    }


    const totalTradeIn = Math.floor(oldShipValue + equipmentValue);
    const netCost = newShip.price - totalTradeIn; // This can be negative if trade-in value exceeds new ship cost

    return { totalTradeIn: totalTradeIn, netCost: netCost };
}

function buyShip(newClass) {
    const newShipStats = shipClasses[newClass];
    if (!newShipStats) {
        displayConsoleMessage(`Unknown ship class: ${newClass}`, 'error');
        return;
    }

    const { totalTradeIn, netCost } = calculateTradeIn(newClass);

    if (game.player.credits < netCost) {
        displayConsoleMessage(`Insufficient credits. Need ${netCost} cr to buy the ${newClass}.`, 'error');
        playSoundEffect('error');
        return;
    }

    const currentCargoTotal = Object.values(game.player.inventory).reduce((a, b) => a + b, 0);
    let confirmMessage = `Trade your ${game.player.class} for a ${newClass}?\nNet Cost: ${netCost} cr`;

    if (currentCargoTotal > newShipStats.cargoSpace) {
        confirmMessage += `\nWarning: You have ${currentCargoTotal} cargo, but the ${newClass} only has ${newShipStats.maxCargoSpace} space.\nExcess cargo will be jettisoned.`;
    }
    confirmMessage += "\nConfirm purchase?";


    if (confirm(confirmMessage)) {
        game.player.credits -= netCost;
        game.player.class = newClass;

        // Copy ship properties from the new class definition
        // IMPORTANT: Preserve the player's *current* computer level if it's higher than the new ship's base level
        const currentComputerLevel = game.player.ship.computerLevel || 1;
        game.player.ship = { ...newShipStats };
        // Ensure the new ship has at least the player's current computer level (if player upgraded it)
        game.player.ship.computerLevel = Math.max(newShipStats.computerLevel || 1, currentComputerLevel);


        if (currentCargoTotal > newShipStats.cargoSpace) {
            game.player.inventory = { ore: 0, food: 0, tech: 0 }; // Jettison all cargo
            displayConsoleMessage(`Bought ${newClass}! Excess cargo jettisoned.`);
        } else {
            displayConsoleMessage(`Bought ${newClass}! Enjoy your new ship.`);
        }
        playSoundEffect('ship_bought');
        updateUI(); // Update UI with new ship stats and potentially empty inventory
    } else {
        displayConsoleMessage("Ship purchase cancelled.");
    }
}


function upgradePort() {
    const sector = game.map[`${game.player.x},${game.player.y}`];
    if (!sector || sector.type !== 'port' || sector.data.owner !== game.player.name) { // Only upgrade ports you own
        displayConsoleMessage("You can only upgrade Ports that you own.", 'error');
        playSoundEffect('error');
        return;
    }

    const portData = sector.data;
    const unitsPerUpgrade = 1; // How many cargo units each input number represents
    const maxTotalUpgradeUnits = 10000; // Max total units per upgrade transaction
    const maxCommodityCapacity = 1000000; // Max capacity for a single commodity

    const oreInput = document.getElementById('upgrade-ore');
    const foodInput = document.getElementById('upgrade-food');
    const techInput = document.getElementById('upgrade-tech');

    const oreIncrease = parseInt(oreInput?.value, 10) || 0;
    const foodIncrease = parseInt(foodInput?.value, 10) || 0;
    const techIncrease = parseInt(techInput?.value, 10) || 0;

    if (oreIncrease < 0 || foodIncrease < 0 || techIncrease < 0) {
        displayConsoleMessage("Upgrade amounts must be zero or positive.", 'error');
        playSoundEffect('error');
        return;
    }

    const totalIncreaseUnits = oreIncrease + foodIncrease + techIncrease;

    if (totalIncreaseUnits <= 0) {
        displayConsoleMessage('Enter a positive amount for at least one commodity to upgrade.', 'error');
        playSoundEffect('error');
        return;
    }

    if (totalIncreaseUnits > maxTotalUpgradeUnits) {
        displayConsoleMessage(`Maximum total upgrade units per transaction is ${maxTotalUpgradeUnits}.`, 'error');
        playSoundEffect('error');
        return;
    }

    if (portData.capacity.ore + oreIncrease > maxCommodityCapacity ||
        portData.capacity.food + foodIncrease > maxCommodityCapacity ||
        portData.capacity.tech + techIncrease > maxCommodityCapacity) {
        displayConsoleMessage(`Maximum capacity per commodity is ${maxCommodityCapacity}.`, 'error');
        playSoundEffect('error');
        return;
    }

    // Cost scales with the total units being added
    const costPerUnit = 50; // Example cost per unit of capacity added
    const totalCost = totalIncreaseUnits * costPerUnit;

    if (game.player.credits < totalCost) {
        displayConsoleMessage(`Insufficient credits. Need ${totalCost} cr to perform this upgrade.`, 'error');
        playSoundEffect('error');
        return;
    }

    // Perform the upgrade
    game.player.credits -= totalCost;
    portData.capacity.ore += oreIncrease;
    portData.capacity.food += foodIncrease;
    portData.capacity.tech += techIncrease;

    // If the port is selling the commodity, its stock also increases with capacity
    if (portData.behavior.ore === 'S') portData.stock.ore += oreIncrease;
    if (portData.behavior.food === 'S') portData.stock.food += foodIncrease;
    if (portData.behavior.tech === 'S') portData.stock.tech += techIncrease;

    // Ensure stock doesn't exceed new capacity
    portData.stock.ore = Math.min(portData.stock.ore, portData.capacity.ore);
    portData.stock.food = Math.min(portData.stock.food, portData.capacity.food);
    portData.stock.tech = Math.min(portData.stock.tech, portData.capacity.tech);


    displayConsoleMessage(`Port upgraded! Capacity increased by O:+${oreIncrease}, F:+${foodIncrease}, T:+${techIncrease}. Cost: ${totalCost} cr.`);
    playSoundEffect('upgrade');
    updateUI(); // Update UI to show new capacity and stock
}

// --- NEW PORT ACTIVITY FUNCTIONS ---
function attemptStealResources() {
    const sector = game.map[`${game.player.x},${game.player.y}`];
    if (!sector || sector.type !== 'port' || (sector.data.owner === game.player.name && sector.data.owner !== undefined /* Allow stealing from unowned/NPC ports */)) {
        displayConsoleMessage("Cannot steal resources here or from your own port.", 'error');
        playSoundEffect('error');
        return;
    }
    const portData = sector.data; // This is the 'data' object for the port

    displayConsoleMessage("Attempting to divert cargo from port systems...", 'minor');

    // Steal chance influenced by port security level vs player's computer level
    const playerComputerLevel = game.player.ship.computerLevel || 1;
    const portSecurityLevel = portData.securityLevel || 0;
    let baseSuccessChance = 0.50; // Base 50% chance

    // Adjust chance based on security vs computer level
    const levelDifference = playerComputerLevel - portSecurityLevel;
    baseSuccessChance += levelDifference * 0.05; // +/- 5% per level difference

    const finalSuccessChance = Math.max(0.10, Math.min(0.90, baseSuccessChance)); // Clamp chance between 10% and 90%

    if (Math.random() < finalSuccessChance) {
        // --- SUCCESSFUL STEAL ---
        let stolenGoodsMessages = [];
        let totalCargoSpaceUsedByStolenGoods = 0;
        let playerCargoSpaceLeft = game.player.ship.maxCargoSpace - Object.values(game.player.inventory).reduce((a, b) => a + b, 0);

        if (playerCargoSpaceLeft <= 0) {
            displayConsoleMessage("Success... but your cargo hold is already full! No resources taken.", 'warning');
            playSoundEffect('ui_click'); // Neutral sound
            updateUI();
            return;
        }

        // Shuffle commodities to randomize the order of stealing attempts if space is limited
        const commoditiesToAttempt = [...commodities].sort(() => 0.5 - Math.random());

        for (const commodity of commoditiesToAttempt) {
            if (playerCargoSpaceLeft <= 0) break; // Stop if no more cargo space

            if (portData.stock[commodity] > 0) {
                const stealPercentage = getRandomInt(2, 5) / 100; // 2-5% of port's stock
                let potentialAmountToSteal = Math.floor(portData.stock[commodity] * stealPercentage);
                potentialAmountToSteal = Math.max(1, potentialAmountToSteal); // Try to steal at least 1 unit if percentage is too low but stock exists

                // Amount is capped by what port has, and what player can carry for this item
                let actualStolenAmount = Math.min(potentialAmountToSteal, portData.stock[commodity], playerCargoSpaceLeft);

                if (actualStolenAmount > 0) {
                    portData.stock[commodity] -= actualStolenAmount;
                    game.player.inventory[commodity] += actualStolenAmount;
                    playerCargoSpaceLeft -= actualStolenAmount; // Update remaining space
                    totalCargoSpaceUsedByStolenGoods += actualStolenAmount;
                    stolenGoodsMessages.push(`${actualStolenAmount} ${commodity}`);
                }
            }
        }

        if (stolenGoodsMessages.length > 0) {
            displayConsoleMessage(`Success! Pilfered: ${stolenGoodsMessages.join(', ')}!`, 'success', 'trade_buy');
        } else {
            displayConsoleMessage("Success... but the port had no vulnerable resources or you couldn't carry more.", 'minor');
        }

    } else {
        // --- FAILED STEAL ---
        let penaltyMessages = ["Failed! Your unauthorized access was detected!"];

        // 1. Fine: 1-3% of player's credits
        const finePercentage = getRandomInt(1, 3) / 100;
        const fineAmount = Math.ceil(game.player.credits * finePercentage);
        if (fineAmount > 0 && game.player.credits > 0) {
            game.player.credits = Math.max(0, game.player.credits - fineAmount);
            penaltyMessages.push(`You were fined ${fineAmount} credits.`);
        }

        // 2. Cargo Loss: 3-5% of player's current total cargo
        const totalPlayerCargo = Object.values(game.player.inventory).reduce((a, b) => a + b, 0);
        if (totalPlayerCargo > 0) {
            const lossPercentage = getRandomInt(3, 5) / 100;
            let totalUnitsToLose = Math.floor(totalPlayerCargo * lossPercentage);
            totalUnitsToLose = Math.min(totalUnitsToLose, totalPlayerCargo); // Cannot lose more than they have

            let cargoLostDetails = [];
            if (totalUnitsToLose > 0) {
                // Create a flat list of all cargo items player possesses
                let allCargoUnits = [];
                commodities.forEach(c => {
                    for (let i = 0; i < game.player.inventory[c]; i++) {
                        allCargoUnits.push(c);
                    }
                });
                allCargoUnits.sort(() => 0.5 - Math.random()); // Shuffle for random loss

                let unitsActuallyLost = 0;
                let lostCounts = { ore: 0, food: 0, tech: 0 };

                for (let i = 0; i < totalUnitsToLose && allCargoUnits.length > 0; i++) {
                    const itemToLose = allCargoUnits.pop(); // Take from the shuffled list
                    if (game.player.inventory[itemToLose] > 0) {
                        game.player.inventory[itemToLose]--;
                        lostCounts[itemToLose]++;
                        unitsActuallyLost++;
                    }
                }

                if (unitsActuallyLost > 0) {
                    Object.keys(lostCounts).forEach(key => {
                        if (lostCounts[key] > 0) {
                            cargoLostDetails.push(`${lostCounts[key]} ${key}`);
                        }
                    });
                    penaltyMessages.push(`Security forces confiscated some of your cargo: ${cargoLostDetails.join(', ')} lost.`);
                }
            }
        }
        displayConsoleMessage(penaltyMessages.join(' '), 'error', 'hack_fail'); // Using hack_fail sound for penalty
    }
    updateUI(); // Always update UI after an attempt
}

// Function to handle hacking attempts
function attemptHackPort() {
    const sector = game.map[`${game.player.x},${game.player.y}`];
    if (!sector || (sector.type !== 'port' && sector.type !== 'spacePort')) {
        displayConsoleMessage("Hacking is only possible at Ports or Space Ports.", 'error');
        playSoundEffect('error');
        return;
    }
    const portData = sector.data;
    const playerComputerLevel = game.player.ship.computerLevel || 1;
    const portSecurityLevel = portData.securityLevel || 0;

    // Calculate hacking success chance (between 5% and 95%)
    let baseSuccessChance = 0.4; // Start with 40% base chance
    const securityPenalty = portSecurityLevel * 0.07; // Each security level reduces chance by 7%
    const softwareBonus = (playerComputerLevel - 1) * 0.07; // Each level *above 1* increases chance by 7%

    let finalHackChance = baseSuccessChance - securityPenalty + softwareBonus;
    finalHackChance = Math.max(0.05, Math.min(0.95, finalHackChance)); // Clamp between 5% and 95%

    displayConsoleMessage(`Attempting system hack...\nEstimated Success Chance: ${Math.round(finalHackChance * 100)}%`);

    if (Math.random() < finalHackChance) {
        // Hack Success
        const maxStealable = Math.floor(portData.credits * 0.1); // Steal up to 10% of port's credits
        const minSteal = 100; // Minimum stolen amount
        // Ensure we don't try to steal more than the port has
        const actualMaxSteal = Math.min(maxStealable, portData.credits);
         // Ensure minSteal is not more than what's available
        const upperStealBound = actualMaxSteal > minSteal ? actualMaxSteal : minSteal;
        const stolenCredits = getRandomInt(minSteal, upperStealBound);

        game.player.credits += stolenCredits;
        portData.credits = Math.max(0, portData.credits - stolenCredits); // Port loses credits, ensure not negative
        displayConsoleMessage(`Success! Siphoned ${stolenCredits} credits!`);
        playSoundEffect('hack_success');
    } else {
        // Hack Failed
        displayConsoleMessage("Hack Failed! Access denied.");
        playSoundEffect('hack_fail');

        // --- Virus Infection Logic ---
        // Calculate the chance of getting a virus based on security difference
        // If port security is much higher, the chance increases significantly.
        const securityDifference = portSecurityLevel - playerComputerLevel;
        let virusInfectionChance = 0;

        if (securityDifference > 0) {
            // Positive difference means port is more secure than player
            // Chance increases linearly with the difference
            virusInfectionChance = securityDifference * 0.15; // Example: 15% increased chance per level difference
        } else {
            // Negative difference or zero means player is equal or more secure
            virusInfectionChance = 0.01; // Minimal base chance even if player is superior
        }

        // Clamp the chance (e.g., max 75% chance of getting a virus on failure)
        virusInfectionChance = Math.min(0.75, virusInfectionChance);

        // Roll for virus infection
        if (Math.random() < virusInfectionChance) {
            const randomVirusType = getRandomElement(virusTypes);
            // Check if player already has this virus by name
            const hasVirus = game.player.viruses.some(v => v.name === randomVirusType.name);

            if (!hasVirus) {
                // Add the virus with its starting duration
                game.player.viruses.push({ ...randomVirusType, duration: randomVirusType.duration }); // Store initial duration and decrement 'duration'
                displayConsoleMessage(`INTRUSION DETECTED! Ship's systems infected with "${randomVirusType.name}" virus!`, 'virus_infect');
            } else {
                // Virus failed to infect (already present)
                displayConsoleMessage(`Counter-intrusion detected, but system already has "${randomVirusType.name}". No new infection.`);
                 // Maybe a less severe failure sound or no sound?
            }
        } else {
            // Failed hack, but no virus infection
            displayConsoleMessage("No counter-intrusion detected.");
             // No sound
        }
    }
    updateUI(); // Always update UI after a hack attempt
}

// Function to upgrade Port Security (Only available at ports you own)
function upgradePortSecurity() {
    const sector = game.map[`${game.player.x},${game.player.y}`];
    if (!sector || sector.type !== 'port' || sector.data.owner !== game.player.name) { // Only upgrade ports you own
        displayConsoleMessage("You can only upgrade security at Ports that you own.", 'error');
        playSoundEffect('error');
        return;
    }
    const portData = sector.data;
    const targetLevelInput = document.getElementById('upgrade-security-level');
    const targetLevel = parseInt(targetLevelInput?.value, 10) || portData.securityLevel + 1;
    const maxLevel = 10;

    if (targetLevel <= portData.securityLevel) {
        displayConsoleMessage(`Enter a target security level higher than the current level (${portData.securityLevel}).`, 'error');
        playSoundEffect('error');
        return;
    }
    if (targetLevel > maxLevel) {
        displayConsoleMessage(`Maximum security level is ${maxLevel}.`, 'error');
        playSoundEffect('error');
        return;
    }

    // Cost increases significantly with target level and current level
    // Example: Level 1->2 cost 10k, Level 9->10 cost increases significantly
    const cost = ((targetLevel * 5000) + (portData.securityLevel * 5000)) + 15000; // Base cost + cost scaling with both levels

    if (game.player.credits < cost) {
        displayConsoleMessage(`Insufficient credits. Need ${cost} cr to upgrade security to level ${targetLevel}.`, 'error');
        playSoundEffect('error');
        return;
    }

    if (confirm(`Upgrade port security to level ${targetLevel} for ${cost} cr?`)) {
        game.player.credits -= cost;
        portData.securityLevel = targetLevel;
        displayConsoleMessage(`Port security upgraded to level ${targetLevel}!`);
        playSoundEffect('upgrade');
        updateUI(); // Update UI to show new security level
    } else {
        displayConsoleMessage("Port security upgrade cancelled.");
    }
}


function attemptPurchasePort() {
    const sector = game.map[`${game.player.x},${game.player.y}`];
    if (!sector || sector.type !== 'port') {
        displayConsoleMessage("Purchase inquiries only at Trading Ports.", 'error');
        playSoundEffect('error');
        return;
    }

    const portData = sector.data;

    // Check if player already owns it
    if (portData.owner === game.player.name) {
        displayConsoleMessage("You already own this port.", 'info');
        playSoundEffect('ui_click');
        return;
    }

    // Check if owned by a major non-purchasable faction
    const majorFactions = [FACTION_DURAN, FACTION_VINARI, "Federation", "Pirate"]; // Add other non-purchasable faction identifiers here
    if (majorFactions.includes(portData.owner)) {
        displayConsoleMessage(`This port is under ${portData.owner} control. They scoff at your credits and tell you to move along!`, 'warning');
        playSoundEffect('error');
        return;
    }

    // If it's owned by someone else (not player, not major faction, e.g. another player in future or specific NPC)
    // For now, any owner that isn't null/"Independent Operators" and isn't a major faction is also considered "not for sale via this channel"
    if (portData.owner && portData.owner !== "Independent Operators") {
         displayConsoleMessage("This port is privately operated and not currently listed for public sale.", 'info');
         playSoundEffect('ui_click');
         return;
    }

    // At this point, port is considered "Independent Operators" or unowned (owner might be null)
    // and thus potentially for sale by the system.

    // Use the game constant for base sale chance
    const baseForSaleChance = PORT_FOR_SALE_BASE_CHANCE; // e.g., 0.22
    const securityPenaltyForSale = (portData.securityLevel || 0) * 0.01; // Each security level reduces chance by 1%
    const finalForSaleChance = Math.max(0.02, baseForSaleChance - securityPenaltyForSale); // Min 2% chance

    const isForSale = portData.forSale !== undefined ? portData.forSale : (Math.random() < finalForSaleChance);

    if (!isForSale) {
        displayConsoleMessage("The current operators are not interested in selling this Port at this time.", 'info');
        playSoundEffect('ui_click');
        return;
    }

    // Port is for sale! Calculate price.
    const basePrice = 500000;
    const priceModifier = (portData.securityLevel || 0) * 75000;
    // Use stored purchasePrice if this port was previously bought and then somehow became unowned again with a price history.
    // Otherwise, calculate it. For a typical unowned port, purchasePrice will be undefined.
    const price = portData.purchasePrice !== undefined ? portData.purchasePrice : (basePrice + priceModifier);

    if (confirm(`This Port is for sale by its current operators!\nAsking Price: ${price} cr.\nWould you like to purchase it?`)) {
        if (game.player.credits >= price) {
            game.player.credits -= price;
            portData.owner = game.player.name; // Player now owns it
            portData.forSale = false;          // No longer for sale via this random mechanic
            portData.purchasePrice = price;    // Store the price it was bought for (for game history/data)

            displayConsoleMessage(`Congratulations! You are now the proud owner of ${portData.name}! You receive a 10% discount on trades and services here.`, 'success', 'ship_bought');
            updateUI();
        } else {
            // Message Change: "Insufficient credit balance."
            displayConsoleMessage(`Insufficient credit balance. You need ${price} cr to purchase this Port.`, 'error');
            playSoundEffect('error');
        }
    } else {
        displayConsoleMessage("Port purchase offer withdrawn.", 'info');
    }
    // updateUI(); // updateUI is called within success/failure paths or if no action taken
}

function payForTip() {
    const sector = game.map[`${game.player.x},${game.player.y}`];
     // Allow paying for a tip at any port or spaceport? Let's allow both.
    if (!sector || (sector.type !== 'port' && sector.type !== 'spacePort')) {
         displayConsoleMessage("Tips can only be paid at Ports or Space Ports.", 'error');
         playSoundEffect('error');
         return;
    }

    const tipCost = 25;
    if (game.player.credits < tipCost) {
        displayConsoleMessage(`Insufficient credits. Need ${tipCost} cr to pay for a tip.`, 'error');
        playSoundEffect('error');
        return;
    }

    game.player.credits -= tipCost;
    playSoundEffect('trade_sell'); // Sound for spending credits

    const tips = [
        "Heard tech pays well near Zarg.",
        "Pirates sighted near the Kepler system.",
        "Derelict vessel reported at coordinates 50,30 - might contain salvage.",
        "Food prices are expected to rise near the Terra colony soon.",
        "Be wary of trading in alien artifacts - they attract unwanted attention.",
        "Increased Vinari patrol activity detected near Duran space.",
        "Rare deep-space comet observed in the outer rim - potential mining opportunity?",
        "Starbase Andromeda Central has a temporary discount on hull repairs.",
        "Saw a ship asking about your vessel specifically...",
        "Experiencing weird sensor interference near black holes.",
        "Rumor has it, the Duran are hoarding rare isotopes.",
        "Found an old navigation log mentioning a hidden asteroid base.",
        "There's tension brewing between the Federation and the Vinari.",
        "Keep an eye on your fuel levels in uncharted sectors.",
        "High-density ore deposits were recently discovered in sector 15, 42."
    ];
    const receivedTip = getRandomElement(tips);
    displayConsoleMessage(`Dockmaster whispers: "${receivedTip}"`);
    updateUI(); // Update UI to show credit change
}


// Function to upgrade Player Software (Computer Level) - Available at Space Ports
function upgradeSoftware() {
    const sector = game.map[`${game.player.x},${game.player.y}`];
    if (!sector || sector.type !== 'spacePort') {
        displayConsoleMessage("Software upgrades are only available at Space Ports.", 'error');
        playSoundEffect('error');
        return;
    }
    const currentLevel = game.player.ship.computerLevel || 1;
    const maxLevel = 10;

    if (currentLevel >= maxLevel) {
        displayConsoleMessage("Computer software is already at the maximum level.", 'error');
        playSoundEffect('error');
        return;
    }

    // Cost increases with current level
    const cost = currentLevel * 10000; // Example cost: Level 1->2 costs 10k, Level 2->3 costs 20k, etc.

    if (game.player.credits < cost) {
        displayConsoleMessage(`Insufficient credits. Need ${cost} cr to upgrade computer software to level ${currentLevel + 1}.`, 'error');
        playSoundEffect('error');
        return;
    }

    if (confirm(`Upgrade computer software to level ${currentLevel + 1} for ${cost} cr?`)) {
        game.player.credits -= cost;
        game.player.ship.computerLevel = currentLevel + 1;
        displayConsoleMessage(`Computer software upgraded to level ${game.player.ship.computerLevel}!`);
        playSoundEffect('upgrade');
        updateUI(); // Update UI to show new computer level
    } else {
         displayConsoleMessage("Software upgrade cancelled.");
    }
}

// Function to remove Viruses - Available at Space Ports
function removeViruses() {
    const sector = game.map[`${game.player.x},${game.player.y}`];
    if (!sector || sector.type !== 'spacePort') {
        displayConsoleMessage("Virus removal services are only available at Space Ports.", 'error');
        playSoundEffect('error');
        return;
    }
    if (game.player.viruses.length === 0) {
        displayConsoleMessage("No viruses detected on ship's systems.");
        // No sound or a neutral sound
        return;
    }

    const costPerVirus = 1000; // Example cost per virus
    const totalCost = game.player.viruses.length * costPerVirus;

    if (game.player.credits < totalCost) {
        displayConsoleMessage(`Insufficient credits. Need ${totalCost} cr for virus removal.`, 'error');
        playSoundEffect('error');
        return;
    }

    if (confirm(`Pay ${totalCost} cr to remove all viruses?`)) {
        game.player.credits -= totalCost;
        game.player.viruses = []; // Clear the viruses array
        displayConsoleMessage("Ship's systems cleaned. Viruses removed.");
        playSoundEffect('virus_clean');
        updateUI(); // Update UI to reflect no viruses
    } else {
         displayConsoleMessage("Virus removal cancelled.");
    }
}

function handleEditShipName() {
    const currentName = game.player.ship.name;
    const newName = prompt("Enter a new name for your ship:", currentName);

    if (newName && newName.trim() !== "" && newName.trim() !== currentName) {
        game.player.ship.name = newName.trim();
        displayConsoleMessage(`Ship name updated to "${game.player.ship.name}".`, "success");
        saveGame(); // Auto-save the change
        updateUI();
    } else {
        displayConsoleMessage("Ship name change cancelled.", "info");
    }
}
