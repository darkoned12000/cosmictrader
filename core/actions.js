// Central handler for all player-triggered actions

import { game, ui } from './state.js';
import { attemptFirstAudioPlay, playSoundEffect } from '../modules/audio.js';
import { displayConsoleMessage, updateUI } from '../modules/ui.js';
import { move, warpToSector } from './movement.js';
import { LOTTERY_PLAYS_RESET_INTERVAL_MOVES } from '../data/game-data.js';
import { FACTION_TRADER } from '../data/naming-data.js';
import { deployMine } from '../modules/mechanics.js';
import { toggleSolarArray } from './movement.js';
import { handleEditShipName, buyFuel, buyEquipment, upgradeScanner, buyWarpDrive, buyShip, trade, handleTradeAll, handleSellExotic, handleSellAllExotic, upgradePort, upgradePortSecurity, upgradeSoftware, removeViruses, attemptStealResources, attemptHackPort, attemptPurchasePort, payForTip } from '../modules/commerce.js';
import { displayBankInterface } from '../modules/ui.js';
import { galacticBank } from '../modules/galactic-bank.js';
import { hailNPC } from './npc.js';
import { startCombat, handleCombatRound, attemptFlee } from '../modules/combat.js';
import { handleScanPlanet, handleMinePlanet, handleClaimPlanet, handleLaunchInvasion, handleColonizePlanet, handleSetupDefenses, handleDestroyPlanet } from '../modules/planets.js';
import { handleLotteryNumberSubmission, focusLotteryInput } from '../modules/lottery.js';

export function triggerAction(action, ...args) {
    attemptFirstAudioPlay();
    // playSoundEffect('ui_click'); // Already played by delegated listener for most buttons

    switch (action) {
        case 'move': move(...args); break;
        case 'deployMine':
            if (game.solarArrayDeployed) {
                displayConsoleMessage("Cannot deploy mine while solar array is active.", "warning");
                return;
            }
            deployMine(...args); // Your existing deployMine function
            break;
        case 'toggleSolarArray': // NEW CASE
            toggleSolarArray();
            break;
        case 'editShipName': handleEditShipName(); break;
        case 'warpToSector': warpToSector(...args); break;
        case 'buyFuel': buyFuel(...args); break;
        case 'buyEquipment': buyEquipment(...args); break;
        case 'upgradeScanner': upgradeScanner(...args); break;
        case 'buyWarpDrive': buyWarpDrive(...args); break;
        case 'buyShip': buyShip(...args); break;
        case 'trade': displayConsoleMessage("Use quantity input or Max/All buttons for trading.", "info"); break;
        case 'tradeByInput': // New: For Buy/Sell buttons using the quantity input
            // args[0] is 'buy'/'sell', args[1] is commodity
            const quantityInput = document.getElementById('trade-quantity');
            const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
            if (quantity > 0) {
                trade(args[0], args[1], quantity);
            } else {
                displayConsoleMessage("Please enter a valid quantity greater than 0.", "warning");
            }
            break;
        case 'tradeAll': // New: For Max Buy / Sell All buttons
            // args[0] is 'buy'/'sell', args[1] is commodity
            handleTradeAll(args[0], args[1]);
            break;
        case 'sellExotic': handleSellExotic(args[0]); break;
        case 'sellAllExotic': handleSellAllExotic(args[0]); break;
        case 'upgradePort': upgradePort(...args); break;
        case 'upgradePortSecurity': upgradePortSecurity(...args); break;
        case 'upgradeSoftware': upgradeSoftware(...args); break;
        case 'removeViruses': removeViruses(...args); break;
        case 'attemptStealResources': attemptStealResources(...args); break;
        case 'attemptHackPort': attemptHackPort(...args); break;
        case 'attemptPurchasePort': attemptPurchasePort(...args); break;
        case 'payForTip': payForTip(...args); break;
        case 'hailNPC': hailNPC(...args); break;
        case 'attackNPC': // This will now INITIATE combat
            const currentSectorForAttack = game.map[`${game.player.x},${game.player.y}`];
            if (currentSectorForAttack && currentSectorForAttack.data && currentSectorForAttack.data.faction && !game.inCombatWith) {
                if (currentSectorForAttack.data.faction !== FACTION_TRADER) { // Don't attack traders yet
                    startCombat(currentSectorForAttack.data); // Pass the Ship object
                } else {
                    displayConsoleMessage("Attacking neutral traders is ill-advised, Captain.", "warning");
                }
            } else if (game.inCombatWith) {
                displayConsoleMessage("Already in combat!", "warning");
            } else {
                displayConsoleMessage("No valid target to attack in this sector.", "error");
            }
            break;

        case 'playerExecuteAttack': // NEW: Player chooses to execute an attack in their combat turn
            if (game.inCombatWith) {
                handleCombatRound('standard_attack'); // 'standard_attack' is an example type
            } else {
                displayConsoleMessage("Not currently in combat.", "info");
            }
            break;

        case 'playerLaunchFighters': // NEW: Player chooses to launch fighters
            if (game.inCombatWith) {
                handleCombatRound('launch_fighters');
            } else {
                displayConsoleMessage("Not currently in combat.", "info");
            }
            break;

        case 'playerFireMissile': // NEW: Player chooses to fire a missile
            if (game.inCombatWith) {
                handleCombatRound('fire_missile');
            } else {
                displayConsoleMessage("Not currently in combat.", "info");
            }
            break;

        case 'attemptFleeCombat': // NEW: Player attempts to flee
            if (game.inCombatWith) {
                attemptFlee();
            } else {
                displayConsoleMessage("Not currently in combat.", "info");
            }
            break;

        case 'scanPlanet': handleScanPlanet(); break;
        case 'minePlanet': handleMinePlanet(); break;
        case 'claimPlanet': handleClaimPlanet(); break;
        case 'launchInvasion': handleLaunchInvasion(); break;
        case 'colonizePlanet': handleColonizePlanet(); break;
        case 'setupDefenses': handleSetupDefenses(); break;
        case 'destroyPlanet': handleDestroyPlanet(); break;

        case 'playLottery': // This now INITIATES the lottery UI
            console.log(`Attempting to play lottery. Plays this period: ${game.lottery.playsThisPeriod}, Max plays: ${game.lottery.maxPlaysPerPeriod}`); // DEBUG LINE

            if (game.lottery.playsThisPeriod >= game.lottery.maxPlaysPerPeriod) {
                displayConsoleMessage(`No lottery plays remaining this period. Resets in ${Math.max(0, (game.lottery.lastPlayPeriodResetMoveCount + LOTTERY_PLAYS_RESET_INTERVAL_MOVES) - game.moveCount)} moves.`, 'warning');
                playSoundEffect('error');
                return;
            }
            if (game.player.credits < game.lottery.ticketCost) {
                displayConsoleMessage(`Not enough credits to play the lottery. Cost: ${game.lottery.ticketCost}cr`, 'error');
                playSoundEffect('error');
                return;
            }
            game.lottery.isActive = true;
            game.lottery.stage = 'pick'; // Start at number picking stage
            game.lottery.userNumbers = []; // Clear previous numbers
            game.lottery.drawnNumbers = [];
            game.lottery.spinningIntervals.forEach(clearInterval);
            game.lottery.spinningIntervals = [];
            game.lottery.currentDrawingDigitIndex = 0;
            game.lottery.matches = 0;
            game.lottery.winnings = 0;
            playSoundEffect('ui_click');
            updateUI(); // This will re-render interaction to show lottery UI
            focusLotteryInput();
            break;

        case 'lotterySubmitNumbers':
            handleLotteryNumberSubmission();
            break;

        case 'lotteryPlayAgain': // For the "Play Again" button on the lottery results screen
            // ***** ADD THIS CHECK *****
            if (game.lottery.playsThisPeriod >= game.lottery.maxPlaysPerPeriod) {
                displayConsoleMessage(`No lottery plays remaining this period. Resets in ${Math.max(0, (game.lottery.lastPlayPeriodResetMoveCount + LOTTERY_PLAYS_RESET_INTERVAL_MOVES) - game.moveCount)} moves.`, 'warning');
                playSoundEffect('error');
                // Optionally, you could also set game.lottery.isActive = false here if you want to force exit.
                // For now, just preventing the reset to 'pick' stage is enough.
                // Or, ensure the button itself is disabled in generateLotteryUI for 'results' stage if playsThisPeriod >= maxPlaysPerPeriod.
                return;
            }
            // ***** END ADDED CHECK *****

            if (game.player.credits < game.lottery.ticketCost) {
                displayConsoleMessage(`Not enough credits to play again. Cost: ${game.lottery.ticketCost}cr`, 'error');
                playSoundEffect('error'); // Added sound
            } else {
                // Proceed to reset for a new pick round
                game.lottery.stage = 'pick';
                game.lottery.userNumbers = [];
                game.lottery.drawnNumbers = [];
                game.lottery.spinningIntervals.forEach(clearInterval); // Clear any animation from previous draw
                game.lottery.spinningIntervals = [];
                game.lottery.currentDrawingDigitIndex = 0;
                game.lottery.matches = 0;
                game.lottery.winnings = 0;
                // The ticket cost will be deducted and playsThisPeriod incremented in handleLotteryNumberSubmission
            }
            updateUI();
            focusLotteryInput();
            break;

        case 'lotteryExit': // For "Return to Port" or "Cancel"
            game.lottery.isActive = false;
            game.lottery.spinningIntervals.forEach(clearInterval); // Stop any animations
            game.lottery.spinningIntervals = [];
            playSoundEffect('ui_click'); // Sound for exiting
            updateUI();
            break;

        case 'attackPort':
            const currentInstallationSector = game.map[`${game.player.x},${game.player.y}`];
            if (currentInstallationSector &&
                (currentInstallationSector.type === 'port' || currentInstallationSector.type === 'spacePort') &&
                currentInstallationSector.data && !game.inCombatWith) {

                if (currentInstallationSector.data.owner === game.player.name) {
                    displayConsoleMessage("You cannot attack your own installation!", "warning");
                    playSoundEffect('error'); // Good to have feedback
                    return; // Return early
                }
                // Confirmation before attacking
                if (confirm(`WARNING: Attacking ${currentInstallationSector.data.name} is an act of war and will likely have severe consequences with its owners (${currentInstallationSector.data.owner || 'Independent Operators'}). Proceed with attack?`)) {
                    startCombat(currentInstallationSector.data); // Pass the port/spaceport object
                } else {
                    displayConsoleMessage("Attack on installation aborted.", "info");
                }
                } else if (game.inCombatWith) {
                    displayConsoleMessage("Already in combat!", "warning");
                } else {
                    displayConsoleMessage("No suitable installation to attack here.", "error");
                }
                break; // Don't forget the break!

        case 'accessBank':
            const sector = game.map[`${game.player.x},${game.player.y}`];
            if (!sector || sector.type !== 'spacePort') {
                displayConsoleMessage("Banking services are only available at Space Ports.", 'error');
                return;
            }
            displayBankInterface();
            break;

        case 'bankDeposit':
            const depositAmount = parseInt(document.getElementById('bank-amount')?.value) || 0;
            galacticBank.deposit(depositAmount);
            displayBankInterface(); // Refresh UI
            break;

        case 'bankWithdraw':
            const withdrawAmount = parseInt(document.getElementById('bank-amount')?.value) || 0;
            galacticBank.withdraw(withdrawAmount);
            displayBankInterface(); // Refresh UI
            break;

        case 'bankSetPIN':
            const hasPIN = !!galacticBank.accounts[game.player.name]?.pin;
            if (hasPIN) {
                // Reset PIN - costs 50,000cr
                if (game.player.credits < 50000) {
                    displayConsoleMessage("Insufficient credits. Reset PIN costs 50,000cr.", 'error');
                    return;
                }
                const confirmReset = confirm("Reset PIN costs 50,000cr. Proceed?");
                if (!confirmReset) return;
                game.player.credits -= 50000;
                displayConsoleMessage("Paid 50,000cr for PIN reset.", 'info');
            }
            const pin = prompt(`${hasPIN ? 'Enter new' : 'Enter'} 4-6 digit PIN for your bank account:`);
            if (pin && /^\d{4,6}$/.test(pin)) {
                galacticBank.setPIN(pin);
                displayConsoleMessage(`PIN ${hasPIN ? 'reset' : 'set'} successfully.`, 'success');
            } else {
                displayConsoleMessage("Invalid PIN. Must be 4-6 digits.", 'error');
            }
            displayBankInterface(); // Refresh to update button text
            break;

        case 'bankClose':
            updateUI(); // Return to normal spaceport view
            break;

        default:
            console.warn("Unknown action triggered:", action);
            displayConsoleMessage(`Error: System malfunction. Unknown action '${action}'.`, 'error');
            break;
    }
}

// Make triggerAction globally available for HTML onclick handlers
window.triggerAction = triggerAction;