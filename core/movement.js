// Handles player movement, warping, simulation, and related effects

function move(direction) {
    if (game.inCombatWith) {
        displayConsoleMessage("Cannot move while in combat!", "warning");
        return;
    }
    if (game.solarArrayDeployed) {
        displayConsoleMessage("Cannot move while the solar array is deployed. Please retract to move.", "warning");
        return;
    }

    let nX = game.player.x;
    let nY = game.player.y;
    const fuelCost = 1;

    if (direction === 'up' && nY > 0) nY--;
    else if (direction === 'down' && nY < game.mapHeight - 1) nY++;
    else if (direction === 'left' && nX > 0) nX--;
    else if (direction === 'right' && nX < game.mapWidth - 1) nX++;
    else {
        displayConsoleMessage("Movement blocked by map edge.", 'warning');
        return; // Cannot move in that direction
    }

    // Check if the position actually changed
    if (nX === game.player.x && nY === game.player.y) {
        // displayConsoleMessage("Already at this location.", 'error'); // Optional: message if trying to move to current spot
        return; // No movement occurred
    }


    if (game.player.ship.fuel >= fuelCost) {
        game.player.ship.fuel -= fuelCost;
        game.player.x = nX;
        game.player.y = nY;
        game.hasMoved = true;
        game.moveCount++;

        // Check for lottery play reset
        checkLotteryPeriodReset();

        // Display the basic movement confirmation first
        displayConsoleMessage(`Moved ${direction}. Sector: ${nX}, ${nY}. Fuel: ${game.player.ship.fuel}.`);

        applyVirusEffects(); // Apply virus effects after moving

        const sector = game.map[`${nX},${nY}`]; // Get sector info for checks

        // --- NEW PERIODIC UPDATES BASED ON GAME_LOOP_INTERVALS ---
        if (game.moveCount % GAME_LOOP_INTERVALS.incomeAndBuilding === 0) {
            processFactionIncomeAndBuilding(); // New function for income & building
        }
        if (game.moveCount % GAME_LOOP_INTERVALS.factionActionRoll === 0) {
            // Each faction rolls for an action individually
            for (const faction of [FACTION_DURAN, FACTION_VINARI, FACTION_TRADER]) {
                processFactionAction(faction); // New function for individual faction actions
            }
        }

        // Continue with other post-move logic
        if (game.moveCount % GAME_LOOP_INTERVALS.economicUpdates === 0) {
            regeneratePortStock();
            updateEconomy();
            displayConsoleMessage("Economy update cycle complete.", "success");
        }

        // Check for Hazard FIRST
        if (sector && sector.type === 'hazard') {
            handleHazardEntry(sector); // This displays hazard-specific messages
        } else {
            // If not a hazard sector, display the standard arrival message (if any)
            displayArrivalMessage(); // <<<--- ADD THIS CALL HERE
        }
        moveNPCs();
        updateUI();

        // Fuel warnings
        if (game.player.ship.fuel < 20 && game.player.ship.fuel > 0) {
            displayConsoleMessage("Warning: Fuel is getting low!", 'warning', 'low_fuel');
        } else if (game.player.ship.fuel === 0) {
            displayConsoleMessage("Warning: Fuel is depleted! Cannot move.", 'error', 'low_fuel');
        }

    } else {
        displayConsoleMessage('Out of fuel!', 'error', 'error');
    }
}

function warpToSector() {
    if (game.inCombatWith) {
        displayConsoleMessage("Cannot warp while in combat!", "warning");
        return;
    }
    if (game.solarArrayDeployed) {
        displayConsoleMessage("Cannot warp while the solar array is deployed. Please retract to move.", "warning");
        return;
    }
    if (game.player.ship.warpDrive !== 'Installed') {
        displayConsoleMessage("Warp Drive not installed.", 'error');
        return;
    }

    const targetXInput = document.getElementById('warp-x');
    const targetYInput = document.getElementById('warp-y');

    const tX = parseInt(targetXInput.value, 10);
    const tY = parseInt(targetYInput.value, 10);
    const warpFuelCostPerSector = 2; // Fuel cost per sector distance

    if (isNaN(tX) || isNaN(tY) || tX < 0 || tX >= game.mapWidth || tY < 0 || tY >= game.mapHeight) {
        displayConsoleMessage('Invalid warp coordinates.', 'error');
        return;
    }

    if (tX === game.player.x && tY === game.player.y) {
        displayConsoleMessage("Cannot warp to current sector.", 'error');
        return;
    }

    const distance = Math.abs(tX - game.player.x) + Math.abs(tY - game.player.y);
    const fuelCost = distance * warpFuelCostPerSector;

    if (game.player.ship.fuel < fuelCost) {
        displayConsoleMessage(`Insufficient fuel for warp. Need ${fuelCost} fuel.`);
        return;
    }

    if (confirm(`Initiate warp to (${tX},${tY})?\nDistance: ${distance} sectors. Cost: ${fuelCost} fuel.`)) {
        playSoundEffect('warp_engage');
        game.player.ship.fuel -= fuelCost;
        game.player.x = tX;
        game.player.y = tY;
        game.hasMoved = true; // Warping counts as having moved
        game.moveCount += distance; // Each sector warped over increases move count

        displayConsoleMessage(`Warp successful! Arrived at ${tX}, ${tY}. Fuel remaining: ${game.player.ship.fuel}.`);

        // Apply virus effects for each sector warped over
        for (let i = 0; i < distance; i++) {
            applyVirusEffects();
        }

        const sector = game.map[`${tX},${tY}`];
        if (sector && sector.type === 'hazard') {
            handleHazardEntry(sector);
        } else {
            // If not a hazard sector, display the standard arrival message (if any)
            displayArrivalMessage();
        }
        // Economy updates might happen less often, maybe not per sector warp?
        // If the moveCount crosses a multiple of 5, the update will happen next regular move.
        // If you want economy to update per warp distance milestone, add that logic here.

        moveNPCs(); // Move NPCs after player warps

        updateUI();

        // Fuel Warnings
        if (game.player.ship.fuel < 20 && game.player.ship.fuel > 0) {
            displayConsoleMessage("Warning: Fuel is getting low!", 'warning', 'low_fuel');
        } else if (game.player.ship.fuel === 0) {
            displayConsoleMessage("Warning: Fuel is depleted! Cannot move.", 'error', 'low_fuel');
        }

    } else {
        displayConsoleMessage("Warp sequence aborted.", 'info');
    }
}

/**
 * Executes a single "turn" of the game without player input, for simulation mode.
 */
function toggleSimulation() {
    if (game.isSimulationRunning) {
        // --- STOP THE SIMULATION ---
        clearInterval(game.simulationIntervalId);
        game.simulationIntervalId = null;
        game.isSimulationRunning = false;
        document.getElementById('toggle-simulation-button').textContent = 'Start Simulation';
        displayConsoleMessage("Simulation paused. Player controls re-enabled.", 'info');
    } else {
        // --- START THE SIMULATION ---
        game.isSimulationRunning = true;
        document.getElementById('toggle-simulation-button').textContent = 'Stop Simulation';
        displayConsoleMessage(`Simulation running... Ticks every ${SIMULATION_TICK_INTERVAL_MS / 1000} seconds.`, 'info');
        // Run the first tick immediately without waiting for the interval
        runSimulationTick();
        game.simulationIntervalId = setInterval(runSimulationTick, SIMULATION_TICK_INTERVAL_MS);
    }
    // Refresh the UI to enable/disable player movement buttons
    updateUI();
}

function runSimulationTick() {
    console.log(`--- Simulation Tick ${game.moveCount + 1} ---`);
    displayConsoleMessage(`SIMULATION: Processing turn ${game.moveCount + 1}...`, 'minor');

    // 1. Advance the game's internal clock
    game.moveCount++;
    game.hasMoved = true;

    // 2. Run all periodic game events
    checkLotteryPeriodReset();
    applyVirusEffects();

    if (game.moveCount % GAME_LOOP_INTERVALS.incomeAndBuilding === 0) {
        processFactionIncomeAndBuilding();
    }
    if (game.moveCount % GAME_LOOP_INTERVALS.factionActionRoll === 0) {
        for (const faction of [FACTION_DURAN, FACTION_VINARI, FACTION_TRADER]) {
            processFactionAction(faction);
        }
    }
    if (game.moveCount % GAME_LOOP_INTERVALS.economicUpdates === 0) {
        regeneratePortStock();
        updateEconomy();
        displayConsoleMessage("Economy update cycle complete.", "success"); // updateEconomy itself logs event starts
    }

    // 3. Move the NPCs
    moveNPCs();

    // 4. Refresh the entire UI so you can see the changes
    updateUI();
}

// Function to apply virus effects and decrement duration
function applyVirusEffects() {
    // Create a copy to iterate while potentially modifying the original array
    const activeViruses = [...game.player.viruses];
    game.player.viruses = activeViruses.filter(virus => {
        const virusDefinition = virusTypes.find(vt => vt.name === virus.name);
        if (virusDefinition && virusDefinition.effect) {
            // Apply the effect
            const effectMessage = virusDefinition.effect(game.player);
            // Display the effect in the console
            displayConsoleMessage(`Virus "${virus.name}" active: ${effectMessage}`);
        }
        virus.duration--; // Decrement duration
        // Keep the virus if its duration is greater than 0
        return virus.duration > 0;
    });

    if (activeViruses.length > 0 && game.player.viruses.length === 0) {
        displayConsoleMessage("All virus effects have worn off.", 'minor');
    }
}

// Solar Array
function toggleSolarArray() {
    // Ensure UI is initialized
    if (!ui.deploySolarArrayButton) {
        initializeUI();
    }

    if (game.inCombatWith) {
        displayConsoleMessage("Cannot operate solar array during combat!", "warning");
        return;
    }

    if (game.solarArrayDeployed) { // --- Retract Array ---
        game.solarArrayDeployed = false;
        if (game.solarArrayIntervalId) {
            clearInterval(game.solarArrayIntervalId);
            game.solarArrayIntervalId = null;
        }
        ui.deploySolarArrayButton.textContent = 'Deploy Solar Array';
        displayConsoleMessage("Retracting Solar Array . . . Stand by.", 'info');
        // Movement is implicitly re-enabled by the check in move() and warpToSector()
    } else { // --- Deploy Array ---
        if (game.player.ship.fuel >= game.player.ship.maxFuel) {
            displayConsoleMessage("No need to deploy solar array, fuel tanks are full.", 'info');
            return;
        }

        game.solarArrayDeployed = true;
        ui.deploySolarArrayButton.textContent = 'Retract Solar Array';
        displayConsoleMessage("Deploying Solar Array . . . Charging commencing.", 'info', 'upgrade'); // Using 'upgrade' sound

        const currentSector = game.map[`${game.player.x},${game.player.y}`];
        const rechargeIntervalMs = (currentSector && currentSector.type === 'star') ? 5000 : 10000; // 5s near star, 10s otherwise
        const intervalLogMessage = (currentSector && currentSector.type === 'star') ? "(Accelerated charging near star)" : "";

        displayConsoleMessage(`Solar array active. Recharge rate: 1 unit per ${rechargeIntervalMs / 1000} seconds. ${intervalLogMessage}`, 'minor');

        game.solarArrayIntervalId = setInterval(() => {
            if (!game.solarArrayDeployed) { // Array might have been retracted manually
                clearInterval(game.solarArrayIntervalId);
                game.solarArrayIntervalId = null;
                return;
            }
            if (game.player.ship.fuel < game.player.ship.maxFuel) {
                game.player.ship.fuel++;
                // Ensure fuel doesn't exceed max due to any race conditions (though Math.min not strictly needed with current logic)
                game.player.ship.fuel = Math.min(game.player.ship.fuel, game.player.ship.maxFuel);
                displayConsoleMessage("1 fuel unit replenished.", 'success');
                updateShipStatus(); // Update fuel display
                if (game.player.ship.fuel >= game.player.ship.maxFuel) {
                    displayConsoleMessage("Fuel tanks full. Solar array charging paused.", 'info');
                    // Array remains deployed, but charging stops if full.
                    // To auto-retract, you'd call toggleSolarArray() here or parts of its retract logic.
                }
            }
        }, rechargeIntervalMs);
    }
    updateUI(); // To refresh button states generally, though specific text is handled here.
}