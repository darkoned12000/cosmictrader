
// --- CONSOLE MESSAGES ---
// ES6 Module exports

import { game, ui } from '../core/state.js';
import { playSoundEffect, attemptFirstAudioPlay } from './audio.js';
import { equipmentCosts, exoticPrices, scannerModels, shipClasses, planetImagesByType, hazardImagesByType, starImagesByType, commodities } from '../data/game-data.js';
import { FACTION_TRADER, FACTION_DURAN, FACTION_VINARI } from '../data/naming-data.js';
import { NPC_ARCHETYPES } from '../ship-definitions.js';
import { calculateTradeIn } from './commerce.js';
import { generateLotteryUI } from './lottery.js';
import { generatePlanetDescription } from './planets.js';
import { getRandomImage } from '../core/utilities.js';
import { galacticBank, INTEREST_RATE_PER_DAY } from './galactic-bank.js';

export function displayConsoleMessage(message, type = 'neutral', sound = 'message_system') {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    game.consoleMessages.unshift({ text: message, type: type, timestamp: timestamp });
    if (game.consoleMessages.length > game.maxConsoleMessages) game.consoleMessages.pop();
    updateConsoleDisplay();
    // Sound effects temporarily disabled to prevent 404 errors
    // playSoundEffect(sound);
}

export function updateConsoleDisplay() {
    ui.consoleMessagesDiv.innerHTML = '';
    game.consoleMessages.forEach(msgObj => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('console-message', `console-message-${msgObj.type}`);
        messageElement.innerHTML = `[${msgObj.timestamp}] ${msgObj.text}`;
        ui.consoleMessagesDiv.appendChild(messageElement);
    });
    ui.consoleMessagesDiv.scrollTop = 0;
}


/**
 * Determines the display color for a resource based on its current percentage.
 * @param {number} current - The current value of the resource.
 * @param {number} max - The maximum value of the resource.
 * @returns {string} A CSS color string.
 */
export function getStatusColor(current, max) {
    if (max === 0) return '#aaa'; // Default color for things with no max capacity
    const percentage = (current / max) * 100;
    if (percentage > 75) return 'lime';      // > 75% is green
    if (percentage > 50) return 'yellow';    // 51% - 75% is yellow
    if (percentage > 25) return '#ffae42';   // 26% - 50% is orange
    return '#f44';                           // <= 25% is red
}


// --- UI UPDATE FUNCTIONS ---
export function updateShipStatus() {
    const s = game.player.ship;
    const p = game.player;
    const c = Object.values(p.inventory).reduce((a, b) => a + b, 0);
    const playerFullName = `${p.firstName} ${p.lastName || ''}`.trim();
    // Display active viruses with their names
    let virusStatus = p.viruses.length > 0 ? `\nViruses: ${p.viruses.map(v => v.name).join(', ')}` : '';
    ui.shipInfo.innerHTML = `
        <div><strong>Captain:</strong> ${playerFullName}</div>
        <div>
            <strong>Ship Name:</strong> ${s.name || 'Unnamed Ship'}
            <button onclick="triggerAction('editShipName')" style="font-size: 8px; padding: 1px 3px; margin-left: 5px; background: #444; border-color: #666;">✎</button>
        </div>
        <hr style="border-color: #050; margin: 5px 0;">
        <div>Class: ${p.class}</div>
        <div>Hull: <span style="color: ${getStatusColor(s.hull, s.maxHull)}">${s.hull}</span>/${s.maxHull}</div>
        <div>Fuel: <span style="color: ${getStatusColor(s.fuel, s.maxFuel)}">${s.fuel}</span>/${s.maxFuel}</div>
        <div>Credits: ${p.credits.toLocaleString()}</div>
        <div>Cargo: ${c} / <span style="color: ${getStatusColor(s.cargoSpace, s.maxCargoSpace)}">${s.cargoSpace}</span> (Max: ${s.maxCargoSpace})</div>
        <div>Shields: <span style="color: ${getStatusColor(s.shields, s.maxShields)}">${s.shields}</span>/${s.maxShields}</div>
        <div>Mines: <span style="color: ${getStatusColor(s.mines, s.maxMines)}">${s.mines}</span>/${s.maxMines}</div>
        <div>Fighters: <span style="color: ${getStatusColor(s.fighters, s.maxFighters)}">${s.fighters}</span>/${s.maxFighters}</div>
        <div>Missiles: <span style="color: ${getStatusColor(s.missiles, s.maxMissiles)}">${s.missiles}</span>/${s.maxMissiles}</div>
        <div>Gnd Forces: <span style="color: ${getStatusColor(s.gndForces, s.maxGndForces)}">${s.gndForces}</span>/${s.maxGndForces}</div>
        <div>Scanner: ${s.scanner.model} (${s.scanner.range})</div>
        <div>Cloak Energy: <span style="color: ${getStatusColor(s.cloakEnergy, s.maxCloakEnergy)}">${s.cloakEnergy}</span>/${s.maxCloakEnergy}</div>
        <div>Warp Drive: ${s.warpDrive}</div>
        <div>Computer LVL: ${s.computerLevel}</div>
        ${virusStatus}
    `; // Added Computer Level and Viruses
}


export function updateInventory() {
    const currentCargo = Object.values(game.player.inventory).reduce((a, b) => a + b, 0);
    const freeSpace = game.player.ship.cargoSpace - currentCargo;

    ui.invInfo.innerHTML = `
    <div style="display: flex; justify-content: space-between;">
    <div style="flex-basis: 50%;">
    <div>Ore: ${game.player.inventory.ore}</div>
    <div>Food: ${game.player.inventory.food}</div>
    <div>Tech: ${game.player.inventory.tech}</div>
    </div>
    <div style="flex-basis: 50%; border-left: 1px dashed #050; padding-left: 10px;">
    <div>Minerals: ${game.player.inventory.minerals}</div>
    <div>Organics: ${game.player.inventory.organics}</div>
    <div>Artifacts: ${game.player.inventory.artifacts}</div>
    </div>
    </div>
    <div style="text-align: center; margin-top: 10px; border-top: 1px dashed #050; padding-top: 5px;">
    Free Cargo Space: ${freeSpace}
    </div>
    `;
}


export function updateInformationFeed() {
    const sectorInfo = game.map[`${game.player.x},${game.player.y}`]; // Use 'sectorInfo' to avoid conflict
    let htmlOutput = ''; // Use 'htmlOutput'
    const sectorIdentifier = "[Neutral]"; // Placeholder
    const currentCoords = `${game.player.x},${game.player.y}`;
    const formatLine = (label, value) => `<strong>${label}:</strong> ${value || 'N/A'}\n`; // Renamed helper

    if (sectorInfo) {
        const entityData = sectorInfo.data; // Use 'entityData'
        switch (sectorInfo.type) {
            case 'port':
                htmlOutput += formatLine("Name", entityData.name);
				let ownerDisplay = "N/A";
                if (entityData.owner === game.player.name) {
                    ownerDisplay = `You (${game.player.name})`;
                } else if (entityData.owner && entityData.owner !== "Independent Operators" && entityData.owner !== null) {
                    ownerDisplay = entityData.owner; // Displays faction name
                } else {
                    ownerDisplay = "Independent Operators"; // For unowned/generic
                }
                htmlOutput += formatLine("Owner", ownerDisplay);
                htmlOutput += formatLine("Type", `Port(${entityData.portType})`);
                htmlOutput += formatLine("Ore $", entityData.prices.ore);
                htmlOutput += formatLine("Food $", entityData.prices.food);
                htmlOutput += formatLine("Tech $", entityData.prices.tech);
                htmlOutput += formatLine("Fuel $", `${equipmentCosts.fuel.unitCost}/u`);
                if (game.player.ship.computerLevel >= entityData.securityLevel) {
                    htmlOutput += formatLine("Port Credits", entityData.credits);
                    htmlOutput += formatLine("Security LVL", entityData.securityLevel);
                } else {
                    htmlOutput += formatLine("Port Credits", "Unknown");
                    htmlOutput += formatLine("Security LVL", `LVL ${entityData.securityLevel} (Req: ${entityData.securityLevel})`);
                }
                break;
            case 'spacePort':
                htmlOutput += formatLine("Name", entityData.name);
                htmlOutput += formatLine("Type", "Space Port");
                htmlOutput += formatLine("Fuel $", `${equipmentCosts.fuel.unitCost}/u`);
                if (game.player.ship.computerLevel >= entityData.securityLevel) {
                    htmlOutput += formatLine("Port Credits", entityData.credits);
                    htmlOutput += formatLine("Security LVL", entityData.securityLevel);
                } else {
                    htmlOutput += formatLine("Port Credits", "Unknown");
                    htmlOutput += formatLine("Security LVL", `LVL ${entityData.securityLevel} (Req: ${entityData.securityLevel})`);
                }
                break;
            case 'planet':
                htmlOutput += formatLine("Name", entityData.name);
                htmlOutput += formatLine("Type", entityData.planetType);
                if (entityData.isScanned) {
                    const scannerModel = game.player.ship.scanner.model;
                    htmlOutput += formatLine("Owner", entityData.ownership);
                    htmlOutput += formatLine("Atmosphere", entityData.atmosphere);
                    htmlOutput += formatLine("Temp", `${entityData.temperature}°F`);
                    htmlOutput += formatLine("Life", entityData.lifeSigns);
                    htmlOutput += formatLine("Habitation", entityData.habitationSigns);
                    if (entityData.habitationSigns === 'Yes') {
                        htmlOutput += formatLine("Population", entityData.colony.population.toLocaleString());
                    }
                    htmlOutput += formatLine("Defense Level", entityData.defenses.level || 0);
                    // --- Scanner-Gated Resource Display ---
                    htmlOutput += "\n--- Planetary Resources ---";
                    const hasStandardScanner = (scannerModel === 'Standard' || scannerModel === 'Advanced');
                    const hasAdvancedScanner = (scannerModel === 'Advanced');

                    // Ore, Minerals, and Organics quantities are revealed with a Standard scanner
                    htmlOutput += formatLine("Ore", hasStandardScanner ? entityData.resources.ore.toLocaleString() : "Detected");
                    htmlOutput += formatLine("Minerals", hasStandardScanner ? entityData.resources.minerals.toLocaleString() : "Detected");
                    htmlOutput += formatLine("Organics", hasStandardScanner ? entityData.resources.organics.toLocaleString() : "Traces Detected");

                    // Artifacts are only hinted at with an Advanced scanner
                    if (hasAdvancedScanner) {
                        htmlOutput += formatLine("Artifacts", entityData.resources.artifacts > 0 ? "Anomalous Signals<br>Detected" : "None");
                    }
                } else {
                    htmlOutput += formatLine("Owner", "???");
                    htmlOutput += formatLine("Atmosphere", "???");
                    htmlOutput += formatLine("Temp", "???");
                    htmlOutput += formatLine("Life", "???");
                    htmlOutput += formatLine("Habitation", "???");
                    htmlOutput += formatLine("Defense Level", "???");
                    htmlOutput += `\n<span style="color: yellow;">Detailed scan required.</span>`;
                }
                break;
            case 'npc_trader': // Generic Trader
            case 'vinari_ship': // Vinari
            case 'duran_ship':  // Duran
                const npcShip = entityData; // This is a Ship object
                htmlOutput += formatLine("Vessel", npcShip.ship_name);
                htmlOutput += formatLine("Captain", npcShip.captain_name);
                htmlOutput += formatLine("Faction", npcShip.faction);
                htmlOutput += formatLine("Class", npcShip.ship_class);
                // Display shield and hull percentages
                htmlOutput += formatLine("Shields", `${npcShip.current_shields}/${npcShip.max_shields} (${npcShip.getShieldPercentage().toFixed(0)}%)`);
                htmlOutput += formatLine("Hull", `${npcShip.current_hull}/${npcShip.max_hull} (${npcShip.getHullPercentage().toFixed(0)}%)`);
                htmlOutput += formatLine("Fighters", npcShip.fighter_squadrons > 0 ? npcShip.fighter_squadrons : "None");
                htmlOutput += formatLine("Missiles", npcShip.missile_launchers > 0 ? npcShip.missile_launchers : "None");
				htmlOutput += formatLine("Bounty", `${npcShip.bounty} cr`);
                // Hostility can be implied by faction for now
                let hostilityDisplay = "Unknown";
                if (npcShip.faction === FACTION_VINARI || npcShip.faction === FACTION_DURAN) hostilityDisplay = "Likely Hostile";
                else if (npcShip.faction === FACTION_TRADER) hostilityDisplay = "Neutral";
                htmlOutput += formatLine("Disposition", hostilityDisplay);
                break;
            case 'hazard':
                htmlOutput += formatLine("Type", `Hazard (${entityData.hazardType || 'Unknown'})`);
                if (entityData.hazardType === 'Asteroid Field') htmlOutput += formatLine("Density", "Variable");
                // Add other hazard specific details
                htmlOutput += formatLine("Risk", "Varies");
                break;
            case 'star':
                htmlOutput += formatLine("Name", entityData.name);
                htmlOutput += formatLine("Type", entityData.starType);
                htmlOutput += formatLine("Radiation", `${entityData.radiationLvl} Rads`);
                const gravDesc = typeof entityData.gravityLvl === 'number' ? `${entityData.gravityLvl.toFixed(1)} G` : entityData.gravityLvl;
                htmlOutput += formatLine("Gravity", gravDesc);
                break;
            default:
                htmlOutput += formatLine("Type", `Unknown (${sectorInfo.type})`);
                break;
        }
        htmlOutput = formatLine("Sector", sectorIdentifier) + formatLine("Coords", currentCoords) + htmlOutput;

    } else { // Empty Sector
        htmlOutput += formatLine("Sector", sectorIdentifier);
        htmlOutput += formatLine("Coords", currentCoords);
        htmlOutput += formatLine("Type", "Empty");
        htmlOutput += formatLine("Scan", "Clear");
    }
    ui.infoFeedContent.innerHTML = htmlOutput.trim();
}

export function renderMap() {
    const mapCache = new Map(); // Cache rendered sectors
    let m = '';
    const hW = Math.floor(game.viewWidth / 2); const hH = Math.floor(game.viewHeight / 2);
    let sX = Math.max(0, Math.min(game.player.x - hW, game.mapWidth - game.viewWidth));
    let sY = Math.max(0, Math.min(game.player.y - hH, game.mapHeight - game.viewHeight));
    const eX = sX + game.viewWidth; const eY = sY + game.viewHeight;
    const r = game.player.ship.scanner.range;

    for (let y = sY; y < eY; y++) {
        for (let x = sX; x < eX; x++) {
            const key = `${x},${y}`;
            if (mapCache.has(key)) { m += mapCache.get(key); continue; }
            let symbol = '.';
            if (x === game.player.x && y === game.player.y) {
                symbol = '@';
            } else {
                const d = Math.abs(x - game.player.x) + Math.abs(y - game.player.y);
                if (d <= r) {
                    const s = game.map[key];
                    if (s) {
                        switch (s.type) {
                            case 'port': symbol = 'P'; break;
                            case 'spacePort': symbol = 'S'; break;
                            case 'planet': symbol = 'O'; break;
                            case 'star': symbol = 'B'; break;
                            case 'npc_trader': symbol = 'C'; break;
                            case 'vinari_ship': symbol = 'V'; break;
                            case 'duran_ship': symbol = 'D'; break;
                            case 'hazard': symbol = 'H'; break;
                            default: symbol = '?'; break;
                        }
                    }
                } else {
                    symbol = ' '; // Unscanned area
                }
            }
            mapCache.set(key, symbol);
            m += symbol;
        }
        m += '\n';
    }
    ui.mapDisplay.textContent = m;
}


// In CosmicTrader/script.js
// Replace your entire existing updateInteraction function with this:

export function updateInteraction() {
    const currentCoords = `${game.player.x},${game.player.y}`;
    const sector = game.map[currentCoords];
    let displayHTML = '';         // For the main interaction display (center image/text)
    let controlsHTML = '';        // For the right-side interaction panel
    let spacePortActionsHTML = '';// For the center-bottom "Computer" console actions
    let spacePortBoxTitle = 'Computer';
    let showSpacePortBox = true;  // Most of the time, the "Computer" actions box is shown

    if (game.inCombatWith) { // --- 1. COMBAT UI ---
        const targetEntity = game.inCombatWith; // Could be an NPC ship or a Port/Station
        spacePortBoxTitle = `COMBAT ENGAGED: ${targetEntity.ship_name || targetEntity.name}`;

        displayHTML = targetEntity.image_path ?
            `<img src="${targetEntity.image_path}" alt="${targetEntity.ship_class || (targetEntity.isStation ? 'Installation' : 'Unknown Ship')}" class="interaction-image" style="max-height: 120px; border: 1px solid #f00;">` :
            `Engaging ${targetEntity.ship_class || (targetEntity.isStation ? 'Installation' : 'Unknown Ship')}!`;

        displayHTML += `<pre>Target: ${targetEntity.ship_name || targetEntity.name} (${targetEntity.faction || (targetEntity.isStation ? targetEntity.owner : 'Unknown Faction')})\n` +
                       `Shields: ${targetEntity.currentShields}/${targetEntity.maxShields} (${targetEntity.getShieldPercentage ? targetEntity.getShieldPercentage().toFixed(0) : 'N/A'}%)\n` +
                       `Hull: ${targetEntity.currentHull}/${targetEntity.maxHull} (${targetEntity.getHullPercentage ? targetEntity.getHullPercentage().toFixed(0) : 'N/A'}%)\n`;

        if (targetEntity.isStation) {
            displayHTML += `Fighters: ${targetEntity.fighterSquadrons || 0} | Guns: ${targetEntity.gunEmplacements || 0} | Missiles: ${targetEntity.missileLaunchers || 0}\n`;
        } else { // It's a ship
            displayHTML += `Fighters: ${targetEntity.fighter_squadrons || 0} | Missiles: ${targetEntity.missile_launchers || 0}\n`;
        }
        displayHTML += `Bounty: ${(targetEntity.bounty || 0)} cr</pre>`;

        controlsHTML = `<p><strong>Combat Log / Status:</strong></p><p>Refer to Computer Console. Choose your action below.</p>`;

        spacePortActionsHTML = `<div><p>Combat Actions:</p>
            <div class="button-group">
                <button onclick="triggerAction('playerExecuteAttack')">Fire Guns</button>
                <button onclick="triggerAction('playerLaunchFighters')" ${game.player.ship.fighters <= 0 ? 'disabled' : ''}>Launch Fighters (${game.player.ship.fighters})</button>
                <button onclick="triggerAction('playerFireMissile')" ${game.player.ship.missiles <= 0 ? 'disabled' : ''}>Fire Missile (${game.player.ship.missiles})</button>
            </div>
            <div><button onclick="triggerAction('attemptFleeCombat')">Attempt to Flee</button></div>
        </div>`;
        showSpacePortBox = true;

    } else if (sector && sector.type === 'port' && game.lottery.isActive) {
        // --- 2. LOTTERY UI (Only at 'port' type locations) ---
        spacePortBoxTitle = "Galactic Lottery Terminal";
        displayHTML = `<img src="Images/ui/lottery_terminal.png" alt="Lottery Terminal" onerror="this.style.display='none'; this.nextSibling.style.display='block';" class="interaction-image" style="max-height:150px;">`;
        displayHTML += `<div style="display:none; text-align:center; padding: 20px 0;">[LOTTERY TERMINAL ART]</div>`;
        displayHTML += `<p style="text-align:center;">Welcome! Pick your lucky digits below.</p>`;

        controlsHTML = `<p>Lottery session active. Cost: ${game.lottery.ticketCost}cr per play.</p><hr style="border-color:#050;"><p>Use the terminal controls in the main panel below.</p>`;

        spacePortActionsHTML = generateLotteryUI();
        showSpacePortBox = true;

    } else if (sector) { // --- 3. NORMAL NON-COMBAT, NON-LOTTERY INTERACTION UI ---
        const entityData = sector.data;
        const mapObjectType = sector.type;

        switch (mapObjectType) {
            case 'port':
                spacePortBoxTitle = `Port: ${entityData.name || 'Trading Port'}`;
                displayHTML = `<img src="${entityData.image_path}" alt="Port" class="interaction-image">`;

                let stockInfoHTML = '<pre style="text-align: left; margin-top: 10px; margin-bottom: 10px;"><u>Stock Status</u>\n';
                stockInfoHTML += `Comm. | Mode    | Stock / Capacity\n`;
                stockInfoHTML += `------|---------|-----------------\n`;
                commodities.forEach(comm => {
                    const mode = entityData.behavior[comm] === 'S' ? 'Selling' : 'Buying ';
                    const stockStr = String(entityData.stock[comm]).padStart(5);
                    const capacityStr = String(entityData.capacity[comm]).padStart(5);
                    const commName = (comm.charAt(0).toUpperCase() + comm.slice(1)).padEnd(5);
                    stockInfoHTML += `${commName} | ${mode} | ${stockStr} / ${capacityStr}\n`;
                });
                stockInfoHTML += '</pre>';

                const playsLeft = game.lottery.maxPlaysPerPeriod - game.lottery.playsThisPeriod;
                const canPlayLottery = playsLeft > 0 && game.player.credits >= game.lottery.ticketCost;

                controlsHTML = stockInfoHTML + `<hr style="border-color: #050;"><p>Port Activities:</p>` +
                               `<div><button data-action="attemptStealResources">Steal Resources</button></div>` +
                               `<div><button data-action="attemptHackPort">Hack Credits</button></div>` +
                               `<div><button data-action="playLottery" ${!canPlayLottery ? 'disabled' : ''}>Play Lottery (${game.lottery.ticketCost}cr)</button> <span style="font-size:10px;">(Plays left: ${playsLeft})</span></div>` +
                               (entityData.owner !== game.player.name && entityData.owner !== "Galactic Authority" && entityData.owner !== FACTION_DURAN && entityData.owner !== FACTION_VINARI && entityData.owner !== "Federation" && entityData.owner !== "Pirate" ? `<div><button data-action="attemptPurchasePort">Inquire Purchase</button></div>` : (entityData.owner === game.player.name ? '<p><em>You own this port.</em></p>' : '<p><em>State-owned.</em></p>')) +
                               `<div><button data-action="payForTip">Pay Tip(25cr)</button></div>` +
                               `<hr style="border-color: #050;"><div><button data-action="scanInstallation">Scan Defenses</button></div>` +
                               (entityData.owner !== game.player.name ? `<div><button data-action="attackPort" style="background-color:#500; color:#fcc;">Attack Installation</button></div>` : '');

                // Display last scanned stats if available for this port
                if (game.lastScannedPortStats && game.lastScannedPortStats.id === currentCoords) { // Assuming currentCoords can be an ID
                    controlsHTML += `<hr style="border-color: #050;"><p><strong>Scan Data (${game.lastScannedPortStats.name}):</strong><br>
                                     Hull: ${game.lastScannedPortStats.hull}, Shields: ${game.lastScannedPortStats.shields}<br>
                                     Fighters: ${game.lastScannedPortStats.fighters}, Guns: ${game.lastScannedPortStats.guns}</p>`;
                }


                let currentTradeQuantity = 1;
                const existingTradeQtyInput = document.getElementById('trade-quantity');
                if (existingTradeQtyInput && existingTradeQtyInput.value) {
                    currentTradeQuantity = parseInt(existingTradeQtyInput.value);
                    if (isNaN(currentTradeQuantity) || currentTradeQuantity <= 0) currentTradeQuantity = 1;
                }

                spacePortActionsHTML = `
                    <div>
                        <div style="margin-bottom: 8px;">
                            <label for="trade-quantity" style="margin-right: 5px;">Quantity:</label>
                            <input type="number" id="trade-quantity" value="${currentTradeQuantity}" min="1" style="width: 70px; margin-right: 10px;">
                            <span style="font-size:10px;">(Set Qty for Buy/Sell buttons)</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; gap: 15px; margin-bottom: 8px;">
                            <div style="flex: 1; border: 1px solid #030; padding: 6px; background: #1a1a1a;">
                                <p style="margin-top:0; margin-bottom: 1px; font-weight: bold;">Trade Commodities:</p>
                                <p style="font-size:10px; margin-top:0; margin-bottom: 5px;">(Prices: Ore ${entityData.prices.ore}, Food ${entityData.prices.food}, Tech ${entityData.prices.tech})</p>
                                <div class="button-group">
                                    <button onclick="triggerAction('tradeByInput','buy','ore')" ${entityData.stock.ore<=0||entityData.behavior.ore==='B'?'disabled':''}>Buy Ore</button>
                                    <button onclick="triggerAction('tradeByInput','buy','food')" ${entityData.stock.food<=0||entityData.behavior.food==='B'?'disabled':''}>Buy Food</button>
                                    <button onclick="triggerAction('tradeByInput','buy','tech')" ${entityData.stock.tech<=0||entityData.behavior.tech==='B'?'disabled':''}>Buy Tech</button>
                                </div>
                                <div class="button-group" style="margin-top:5px;">
                                    <button onclick="triggerAction('tradeByInput','sell','ore')" ${game.player.inventory.ore<=0||entityData.behavior.ore==='S'?'disabled':''}>Sell Ore</button>
                                    <button onclick="triggerAction('tradeByInput','sell','food')" ${game.player.inventory.food<=0||entityData.behavior.food==='S'?'disabled':''}>Sell Food</button>
                                    <button onclick="triggerAction('tradeByInput','sell','tech')" ${game.player.inventory.tech<=0||entityData.behavior.tech==='S'?'disabled':''}>Sell Tech</button>
                                </div>
                            </div>
                            <div style="flex: 1; border: 1px solid #030; padding: 6px; background: #1a1a1a;">
                                <p style="margin-top:0; margin-bottom: 1px; font-weight: bold;">Bulk Actions:</p>
                                <p style="font-size:10px; margin-top:0; margin-bottom: 5px; line-height: 1;">&nbsp;</p>
                                <div class="button-group">
                                    <button onclick="triggerAction('tradeAll','buy','ore')" ${entityData.behavior.ore==='B'?'disabled':''}>Max Buy Ore</button>
                                    <button onclick="triggerAction('tradeAll','buy','food')" ${entityData.behavior.food==='B'?'disabled':''}>Max Buy Food</button>
                                    <button onclick="triggerAction('tradeAll','buy','tech')" ${entityData.behavior.tech==='B'?'disabled':''}>Max Buy Tech</button>
                                </div>
                                <div class="button-group" style="margin-top:5px;">
                                    <button onclick="triggerAction('tradeAll','sell','ore')" ${entityData.behavior.ore==='S'?'disabled':''}>Sell All Ore</button>
                                    <button onclick="triggerAction('tradeAll','sell','food')" ${entityData.behavior.food==='S'?'disabled':''}>Sell All Food</button>
                                    <button onclick="triggerAction('tradeAll','sell','tech')" ${entityData.behavior.tech==='S'?'disabled':''}>Sell All Tech</button>
                                </div>
                            </div>
                        </div>
                        <hr style="border-color: #030; margin: 5px 0 5px 0;">
                        <div><p style="margin-top:0; margin-bottom: 5px;">Refuel:</p>
                            <button onclick="triggerAction('buyFuel')" ${game.player.credits<equipmentCosts.fuel.unitCost||game.player.ship.fuel>=game.player.ship.maxFuel?'disabled':''}>Buy Fuel(${equipmentCosts.fuel.unitCost}/u)</button>
                            <label>Amt:</label><input type="number" id="buy-fuel-amount" min="1" value="100" style="width:60px;">
                        </div>`;
                    if (entityData.owner === game.player.name) {
                        spacePortActionsHTML += `
                            <hr style="border-color: #030; margin: 5px 0 5px 0;">
                            <div><p style="margin-top:0; margin-bottom: 5px;">Upgrade Port (Owned):</p> <div><label>O:</label><input type="number" id="upgrade-ore" min="0" value="0" style="width:60px;"><label>F:</label><input type="number" id="upgrade-food" min="0" value="0" style="width:60px;"><label>T:</label><input type="number" id="upgrade-tech" min="0" value="0" style="width:60px;"><button onclick="triggerAction('upgradePort')">Upgrade Capacity</button></div></div>
                            <div style="margin-top: 5px;"><p style="margin-top:0; margin-bottom: 5px;">Upgrade Security (Owned):</p> <div><label>Target LVL:</label><input type="number" id="upgrade-security-level" min="${entityData.securityLevel + 1}" max="10" value="${Math.min(10, entityData.securityLevel + 1)}" style="width:60px;"><button onclick="triggerAction('upgradePortSecurity')">Upgrade Security</button></div></div>`;
                    }
                    if (game.player.ship.warpDrive === 'Installed') {
                        spacePortActionsHTML += `<hr style="border-color: #030; margin: 5px 0 5px 0;">` + generateWarpControlsHTML();
                    }
                spacePortActionsHTML += `</div>`;
                break;

            case 'spacePort':
                spacePortBoxTitle = `Space Port: ${entityData.name}`;
                displayHTML = `<img src="${entityData.image_path}" alt="Space Port" class="interaction-image">`;
                controlsHTML = `<p>Access mainframe for services. Check Sector Information for details.</p>` +
                               `<hr style="border-color: #050;"><div><button data-action="scanInstallation">Scan Defenses</button></div>` +
                               (entityData.owner !== game.player.name ? `<div><button data-action="attackPort" style="background-color:#500; color:#fcc;">Attack Installation</button></div>` : '');
                if (game.lastScannedPortStats && game.lastScannedPortStats.id === currentCoords) {
                    controlsHTML += `<hr style="border-color: #050;"><p><strong>Scan Data (${game.lastScannedPortStats.name}):</strong><br>
                                     Hull: ${game.lastScannedPortStats.hull}, Shields: ${game.lastScannedPortStats.shields}<br>
                                     Defenses: ${game.lastScannedPortStats.fighters} Fighters, Guns: ${game.lastScannedPortStats.guns}</p>`;
                }
                spacePortActionsHTML = generateSpaceportServicesHTML() + generateSoftwareUpgradeHTML() + generateVirusRemovalHTML() + generateWarpControlsHTML();
                break;

            case 'planet':
                const pType = entityData.planetType || "?";
                const pImg = getRandomImage(planetImagesByType[pType] || planetImagesByType["Unknown"]);

                // --- UI LOGIC ---
                spacePortBoxTitle = `Planet: ${entityData.name}`;
                displayHTML = `<p>Approaching planetary body. Refer to the computer panel below for operational commands.</p>`;
                controlsHTML = ``; // Clear the right-hand panel

                let planetActionsHTML = '';
                const description = entityData.isScanned ? generatePlanetDescription(entityData) : 'Initial sensor readings are inconclusive. <span style="color: yellow;">A detailed scan is required to reveal more about this planet.</span>';

                planetActionsHTML += `<div><img src="${pImg}" alt="${pType}" class="interaction-image" style="max-height: 120px;"></div>`;
                planetActionsHTML += `<div style="text-align: left; white-space: pre-wrap; margin-bottom: 15px;">${description}</div>`;

                // --- BUTTON LOGIC ---
                if (!entityData.isScanned) {
                    // If not scanned, ONLY show the scan button.
                    planetActionsHTML += `<p>Planetary Operations:</p>`;
                    planetActionsHTML += `<div><button data-action="scanPlanet">Scan Planet (5 fuel)</button></div>`;
                } else {
                    // If scanned, show all other relevant buttons.
                    planetActionsHTML += `<p>Planetary Operations:</p>`;
                    planetActionsHTML += `<div><button data-action="minePlanet">Mine Planet (10 fuel)</button></div>`;

                    // Logic for Claim/Invade
                    if (entityData.ownership === 'Unclaimed') {
                        planetActionsHTML += `<div><button data-action="claimPlanet">Claim Planet (25,000 cr)</button></div>`;
                    } else if (entityData.ownership === FACTION_DURAN || entityData.ownership === FACTION_VINARI) {
                        const canInvade = game.player.ship.gndForces > 0;
                        const buttonText = `Launch Invasion (Forces: ${game.player.ship.gndForces})`;
                        planetActionsHTML += `<div><button data-action="launchInvasion" ${canInvade ? '' : 'disabled'}>${buttonText}</button></div>`;
                    } else if (entityData.ownership === 'Federation' || entityData.ownership === FACTION_TRADER) {
                        const canInvade = game.player.ship.gndForces > 0;
                        planetActionsHTML += `<hr style="border-color: #550;"><p style="color:#f90;">Hostile Actions:</p>`;
                        planetActionsHTML += `<div><button data-action="launchInvasion" ${canInvade ? '' : 'disabled'} style="background-color:#840; color:#fd0;">Launch Invasion (Hostile Act)</button></div>`;
                    }

                    // Player-owned options
                    // Player-owned options
                    if (entityData.ownership === game.player.name) {
                        planetActionsHTML += `<hr style="border-color: #050;"><p>Colony Management:</p>`;

                        // --- NEW DYNAMIC BUTTON LOGIC ---

                        // Condition to enable the "Colonize Planet" button
                        const canColonize = (entityData.colony.status === 'Undeveloped' && game.player.ship.gndForces > 0);
                        const colonizeButtonText = `Colonize Planet (Pods: ${game.player.ship.gndForces})`;

                        // Condition to enable the "Setup Defenses" button
                        const canSetupDefenses = (entityData.colony.status === 'Developing' || entityData.colony.status === 'Established');

                        planetActionsHTML += `<div><button data-action="colonizePlanet" ${!canColonize ? 'disabled' : ''}>${colonizeButtonText}</button></div>`;
                        planetActionsHTML += `<div><button data-action="setupDefenses" ${!canSetupDefenses ? 'disabled' : ''}>Setup Defenses</button></div>`;
                    }

                    // Destroy Planet button
                    planetActionsHTML += `<hr style="border-color: #050;">`;
                    if (entityData.ownership === 'Federation' || entityData.ownership === FACTION_TRADER) {
                        planetActionsHTML += `<div><button data-action="destroyPlanet" style="background-color:#840; color:#fd0;">Destroy Planet (Hostile Act)</button></div>`;
                    } else {
                        planetActionsHTML += `<div><button data-action="destroyPlanet" style="background-color:#500; color:#fcc;">Destroy Planet</button></div>`;
                    }
                }

                spacePortActionsHTML = planetActionsHTML;
                showSpacePortBox = true;
                break;

            case 'npc_trader':
            case 'vinari_ship':
            case 'duran_ship':
                const npcShip = entityData;
                spacePortBoxTitle = `Ship Detected: ${npcShip.ship_name}`;
                displayHTML = npcShip.image_path ? `<img src="${npcShip.image_path}" alt="${npcShip.ship_class}" class="interaction-image" style="max-height: 100px; border: 1px solid #030;">` : `\n    __|__\n--=<=*=>=--\n    \\ / \nDetected ${npcShip.ship_class || '?'} (${npcShip.faction}).`;
                controlsHTML = `<p>Comms / Tactical Options:</p>
                                <div><button data-action="hailNPC">Hail Ship</button></div>
                                <div><button data-action="scanShip" disabled>Detailed Ship Scan (N/I)</button></div>
                                <div><button data-action="attackNPC">Attack</button></div>`;
                spacePortActionsHTML = generateWarpControlsHTML();
                break;

            case 'hazard':
                const hazardType = entityData?.hazardType || 'Unknown';
                spacePortBoxTitle = `Hazard: ${hazardType}`;
                const hImg = getRandomImage(hazardImagesByType[hazardType] || hazardImagesByType["Unknown"]);
                let hMsg = "Hazardous environment readings!";
                if (hazardType === 'Mine') hMsg = "DANGER: Armed Minefield Detected!";
                else if (hazardType === 'Asteroid Field') hMsg = "Navigating dense asteroid field!";
                else if (hazardType === 'Black Hole') hMsg = "WARNING: Extreme Gravitational Distortions!";
                else if (hazardType === 'Solar Storm') hMsg = "High energy particle storm in progress!";
                else if (hazardType === 'Nebula') hMsg = "Entering dense nebula. Sensor interference likely.";
                displayHTML = hImg ? `<img src="${hImg}" alt="${hazardType}" class="interaction-image">\n${hMsg}` : `\n * * DANGER * * \n * ${hazardType} * \n * * DETECTED * * \n\n${hMsg}`;
                controlsHTML = `<p>Proceed with extreme caution. Check Sector Information for details.</p>`;
                spacePortActionsHTML = generateWarpControlsHTML();
                break;

            case 'star':
                const sType = entityData.starType || "?";
                const sImg = getRandomImage(starImagesByType[sType] || starImagesByType["Unknown"]);
                spacePortBoxTitle = `Star: ${entityData.name}`;
                displayHTML = sImg ? `<img src="${sImg}" alt="${sType}" class="interaction-image">\nApproaching ${sType} star: ${entityData.name}.` : `\n    \\ | /\n -- (O) --\n    / | \\\nApproaching ${sType} star: ${entityData.name}.`;
                controlsHTML = `<p>Extreme stellar radiation and gravity. Maintain safe distance. Check Sector Information.</p>`;
                spacePortActionsHTML = generateWarpControlsHTML();
                break;

            case 'scanInstallation':
                scanInstallation();
                break;

            default: // Unknown object type
                spacePortBoxTitle = 'Computer';
                displayHTML = `\n   ??\n  ?  ?\n ? ? ?\n  ?  ?\n   ??\nUnknown anomaly detected.`;
                controlsHTML = `<p>Sensor data inconclusive. Proceed with caution.</p>`;
                spacePortActionsHTML = generateWarpControlsHTML();
                break;
        }
    } else { // --- 4. EMPTY SECTOR UI (and not in combat, not in lottery at port) ---
        spacePortBoxTitle = 'Computer';
        displayHTML = `\n    ~*~\n    . .\n    ~*~\nEmpty Space. Scanners detect nothing of interest.`;
        controlsHTML = `<p>All clear. Ready for next jump calculations.</p>`;
        spacePortActionsHTML = generateWarpControlsHTML();
        showSpacePortBox = true;
    }

    // --- 5. Final DOM updates ---
    ui.interactionDisplay.innerHTML = displayHTML;
    ui.interactionControls.innerHTML = controlsHTML;
    ui.spacePortTitle.textContent = spacePortBoxTitle;
    ui.spacePortControls.innerHTML = spacePortActionsHTML;
    ui.spacePortBox.style.display = showSpacePortBox ? 'block' : 'none';
}


// --- Space Port/Port Action Controls HTML Generation ---
// Note: These functions generate HTML strings for the space-port-controls div.
// Buttons within these sections still use inline onclick for simplicity given their dynamic nature.
// For a larger project, consider more advanced techniques (templating, attaching listeners after render).

export function generateSpaceportServicesHTML() {
    let h = '';
    h += `<div><p>Refuel:</p><button onclick="triggerAction('buyFuel')" ${game.player.credits<equipmentCosts.fuel.unitCost||game.player.ship.fuel>=game.player.ship.maxFuel?'disabled':''}>Fuel(${equipmentCosts.fuel.unitCost}/u)</button><label>Amt:</label><input type="number" id="buy-fuel-amount" min="1" value="100" style="width:60px;"></div>`;
    h += `<div><p>Banking:</p><button onclick="triggerAction('accessBank')">Access Bank</button></div>`;
    h += `<div><p>Equip:</p><div class="button-group">`;
    for (const t in equipmentCosts) {
        if (t === 'fuel') continue;
        const i = equipmentCosts[t];
        const c = game.player.ship[t] || 0;
        const m = game.player.ship[i.max] !== undefined ? game.player.ship[i.max] : Infinity;
        const d = game.player.credits < i.cost || c >= m;
        const l = t[0].toUpperCase() + t.slice(1).replace('Space', ' '); // Capitalize and format name
        h += `<button onclick="triggerAction('buyEquipment','${t}')" ${d?'disabled':''}>${l}(+${i.amount},${i.cost}cr)</button>`;
    }

    h += `</div></div>`;
    h += `<div><p>Sell Exotics:</p><div class="button-group">`;
    for (const resource in exoticPrices) {
        const canSell = game.player.inventory[resource] > 0;
        const displayName = resource.charAt(0).toUpperCase() + resource.slice(1);
        // Calls the new 'sellAllExotic' action
        h += `<button onclick="triggerAction('sellAllExotic', '${resource}')" ${canSell ? '' : 'disabled'}>Sell All ${displayName}</button>`;
    }

    h += `</div></div>`;
    // Scanner Upgrade
    if (game.player.ship.scanner.model !== 'Advanced') {
        const nextModel = game.player.ship.scanner.model === 'Basic' ? 'Standard' : 'Advanced';
        const cost = scannerModels[nextModel].cost;
        const disabled = game.player.credits < cost;
        h += `<div><p>Scanner:</p><button onclick="triggerAction('upgradeScanner','${nextModel}')" ${disabled?'disabled':''}>Buy ${nextModel}(${cost}cr)</button></div>`;
    } else {
         h += `<div><p>Scanner:</p><button disabled>Advanced (Max)</button></div>`;
    }
    // Warp Drive
    const warpCost = 5000;
    const canBuyWarp = game.player.credits >= warpCost && game.player.ship.warpDrive !== 'Installed';
    h += `<div><p>Warp:</p><button onclick="triggerAction('buyWarpDrive')" ${!canBuyWarp?'disabled':''}>Install(${warpCost}cr)</button></div>`;
    // Buy Ship
    h += `<div><p>Ships(Trade:50%):</p><div class="button-group">`;
    // Dynamically get Trader faction ship classes from NPC_ARCHETYPES
    // Although NPCs are created from these archetypes, the archetypes contain the base ship names
    // that are considered "Trader" ships for player purchase.
    const traderShipArchetypes = NPC_ARCHETYPES[FACTION_TRADER];
    const playerBuyableShipNames = [];
    for (const shipClassKey in traderShipArchetypes) {
        playerBuyableShipNames.push(traderShipArchetypes[shipClassKey][0]); // Get the base ship name (first element in archetype array)
    }

    for (const sc of playerBuyableShipNames) { // Loop only through player-buyable Trader ships
        if (sc !== game.player.ship.name) { // Don't list the player's current ship (using ship.name for comparison)
            const ns = shipClasses[sc];
            if (ns) { // Ensure the ship class exists in game-data.js
                const { netCost } = calculateTradeIn(sc);
                const canAfford = game.player.credits >= netCost;
                h += `<button onclick="triggerAction('buyShip','${sc}')" ${canAfford?'':'disabled'}>Buy ${sc}(Net:${netCost}cr)</button>`;
            }
        }
    }
    h += `</div></div>`;
    return h;
}

// Generates HTML for the Player Software Upgrade section (Space Port only)
export function generateSoftwareUpgradeHTML() {
    const currentLevel = game.player.ship.computerLevel || 1;
    const maxLevel = 10;
    if (currentLevel >= maxLevel) return `<div><p>Software Upgrades:</p><button disabled>Computer LVL ${currentLevel} (Max)</button></div>`;

    // Cost increases with current level, making higher levels more expensive
    const cost = currentLevel * 10000 + 5000; // Example cost: Lvl 1->2 costs 15k, Lvl 2->3 costs 25k, etc.

    const disabled = game.player.credits < cost;
    return `<div><p>Software Upgrades:</p><button onclick="triggerAction('upgradeSoftware')" ${disabled?'disabled':''}>Upgrade Computer LVL ${currentLevel + 1} (${cost}cr)</button></div>`;
}

// Generates HTML for the Virus Removal section (Space Port only)
export function generateVirusRemovalHTML() {
    if (game.player.viruses.length === 0) return ''; // Hide if no viruses
    const costPerVirus = 750; // Example cost
    const totalCost = game.player.viruses.length * costPerVirus;
    const disabled = game.player.credits < totalCost;
    return `<div><p>System Diagnostics:</p><button onclick="triggerAction('removeViruses')" ${disabled?'disabled':''}>Remove Viruses (${totalCost}cr)</button></div>`;
}


export function generateWarpControlsHTML() {
    if (game.player.ship.warpDrive === 'Installed') {
        return `<div><p>Warp(2f/s):</p><div><label>X:</label><input type="number" id="warp-x" min="0" max="${game.mapWidth - 1}" value="${game.player.x}" style="width:60px;"><label>Y:</label><input type="number" id="warp-y" min="0" max="${game.mapHeight - 1}" value="${game.player.y}" style="width:60px;"><button onclick="triggerAction('warpToSector')">Warp</button></div></div>`;
    }
    // Only show N/I message when the space-port-actions box is visible (at a location)
    const s = game.map[`${game.player.x},${game.player.y}`];
    if (s && s.type !== 'empty') { // Check if at a location (port, planet, etc.)
         return '<div><p>Warp Drive: N/I</p></div>';
    }
    return ''; // Don't show anything if in empty space and no warp drive
}


// --- SPACE MANUAL ---
export function displayManual() {
    attemptFirstAudioPlay(); // Attempt audio play on interaction
    playSoundEffect('ui_click'); // Sound for opening manual

    ui.spacePortTitle.textContent = "Instruction Manual - Please Read!";
    ui.spacePortBox.style.display = 'block'; // Show the space port actions box

    // Manual Content - You can expand on this!
    const manualContent = `
        <pre>
        COSMIC TRADER - INSTRUCTION MANUAL

        Welcome, Commander, to the vast and often dangerous cosmos!
        This manual will guide you through the basics of survival and
        profit in the star systems.

        NAVIGATION:
        Use the directional buttons (Up, Down, Left, Right) or the
        W, A, S, D keys to move your ship one sector at a time.
        Each move consumes 1 unit of Fuel.
        Watch your Fuel levels! Running out will leave you stranded.

        GALAXY MAP:
        The map shows your current sector (@) and scanned objects.
        Different symbols represent different types of locations:
        P - Port (Trade, Refuel, Upgrade Port, Activities)
        S - Space Port (Refuel, Equip Ship, Upgrade Software, Virus Removal, Warp, Buy Ship)
        O - Planet/Moon (Information, potential future interactions)
        B - Star (Information, environmental hazards)
        C - Trader (NPC Ship - potential trade or combat)
        V - Vinari Ship (NPC Ship - faction vessel)
        D - Duran Ship (NPC Ship - faction vessel)
        H - Hazard (Avoid or be prepared for consequences!)
        . - Empty Space
          - Unscanned (Outside scanner range)

        SHIP STATUS:
        Monitor your ship's Hull, Fuel, Shields, and various equipment.
        Cargo space is limited by your ship's class.
        Your Computer Level affects hacking and security interactions.
        Viruses can negatively impact your ship's performance.

        INVENTORY:
        Tracks your current stock of tradable commodities: Ore, Food, Tech.

        INTERACTION:
        Displays information about the current sector and any objects within it.
        The "Computer" box below the console provides context-sensitive actions
        based on your current location (Port, Space Port, etc.).

        PORTS:
        Buy and sell commodities based on local supply and demand.
        Prices fluctuate.
        You can refuel here.
        Owned Ports can be upgraded (capacity, security).
        Port Activities: Attempt to Steal Resources, Hack Credits, Play Lottery,
        Inquire about Purchasing the Port, or Pay for a Tip. Be cautious!

        SPACE PORTS:
        Refuel and purchase ship Equipment (Shields, Mines, Fighters, etc.).
        Upgrade your Scanner and install a Warp Drive.
        Buy new and better Ships (trade-in value is calculated).
        Access System Diagnostics for Software Upgrades and Virus Removal.

        HAZARDS:
        Entering a Hazard sector can damage your ship or have other negative effects.
        Mines are deployed by players or NPCs and cause damage on entry.

        COMBAT (N/I):
        Interaction with NPC ships is planned but not fully implemented.
        Currently, hailing may lead to combat if the NPC is hostile.

        SAVING AND LOADING:
        Use the buttons in the Game Controls to Save or Load your progress.

        VIRUSES:
        Failed hacking attempts or certain hazards can infect your ship with viruses.
        Viruses have negative effects and a limited duration.
        They can be removed at Space Ports.

        Remember to manage your resources, choose your trades wisely, and explore
        the galaxy with caution!

        </pre>
    `;

    // Populate the space-port-controls div with the manual content and a close button
    ui.spacePortControls.innerHTML = `
        <div style="white-space: pre-wrap; overflow-y: auto; max-height: 300px;">${manualContent}</div>
        <div><button id="close-manual-button">Close Manual</button></div>
    `;

    // Add event listener to the new close button
    document.getElementById('close-manual-button').addEventListener('click', hideManual);

    // Ensure other interaction controls are hidden while manual is open (if needed)
    // The updateInteraction function handles showing/hiding based on location,
    // so when the player moves, the manual view will be replaced by the location view.
}

export function displayBankInterface() {
    attemptFirstAudioPlay();
    playSoundEffect('ui_click');

    const balance = galacticBank.getBalance();
    const interestRate = (INTEREST_RATE_PER_DAY * 100).toFixed(2);

    ui.spacePortTitle.innerHTML = `Galactic Bank - Account: ${game.player.firstName} ${game.player.lastName}`;
    ui.spacePortControls.innerHTML = `
        <div style="padding: 10px;">
            <p><strong>Current Balance:</strong> ${balance.toLocaleString()} credits</p>
            <p><strong>Daily Interest Rate:</strong> ${interestRate}%</p>
            <hr style="border-color: #050;">
            <div style="margin-bottom: 10px;">
                <label for="bank-amount">Amount:</label>
                <input type="number" id="bank-amount" min="100" value="1000" style="width: 100px; margin-left: 10px;">
            </div>
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <button onclick="triggerAction('bankDeposit')">Deposit</button>
                <button onclick="triggerAction('bankWithdraw')">Withdraw</button>
                <button onclick="triggerAction('bankSetPIN')">${galacticBank.accounts[game.player.name]?.pin ? 'Reset PIN (50,000cr)' : 'Set PIN'}</button>
            </div>
            <p style="color: yellow; font-size: 12px; margin-top: 10px;">
                NOTE: To send credits to a NPC or Player you need to have a valid PIN (don't forget it)
            </p>
            <hr style="border-color: #050; margin: 10px 0;">
            <button onclick="triggerAction('bankClose')">Close Bank</button>
        </div>
    `;
    ui.spacePortBox.style.display = 'block';
}

export function hideManual() {
      // This function is called when the "Close Manual" button is clicked
      // It simply calls updateUI, which will re-render the interaction box
      // based on the current location (which will hide the manual unless at a location)
     playSoundEffect('ui_click'); // Sound for closing manual
     updateUI();
}

export function displayGalaxyLog() {
    attemptFirstAudioPlay();
    playSoundEffect('ui_click');

    ui.spacePortTitle.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>Galaxy Log</span>
            <input type="text" id="galaxy-log-search" onkeyup="filterGalaxyLog()" placeholder="Search log..." style="margin-left: auto;">
        </div>`;
    ui.spacePortBox.style.display = 'block';

    let logHTML = '<div id="galaxy-log-container" style="white-space: pre-wrap; overflow-y: auto; max-height: 300px;">';
    if (game.galaxyLog.length === 0) {
        logHTML += '<p>No significant events recorded.</p>';
    } else {
        game.galaxyLog.forEach(entry => {
            logHTML += `<div class="console-message console-message-${entry.type}"><strong>[${entry.timestamp}]</strong> ${entry.text}</div>`;
        });
    }
    logHTML += '</div><div><button id="close-manual-button">Close Log</button></div>';

    ui.spacePortControls.innerHTML = logHTML;

    document.getElementById('close-manual-button').addEventListener('click', hideManual);
}

// Make filterGalaxyLog globally available
window.filterGalaxyLog = function() {
    const searchTerm = document.getElementById('galaxy-log-search').value.toLowerCase();
    const logContainer = document.getElementById('galaxy-log-container');
    const filteredLog = game.galaxyLog.filter(entry => entry.text.toLowerCase().includes(searchTerm));
    let logHTML = '';
    if (filteredLog.length === 0) {
        logHTML += '<p>No matching events found.</p>';
    } else {
        filteredLog.forEach(entry => {
            logHTML += `<div class="console-message console-message-${entry.type}"><strong>[${entry.timestamp}]</strong> ${entry.text}</div>`;
        });
    }
    logContainer.innerHTML = logHTML;
};

export function filterGalaxyLog() {
    const searchTerm = document.getElementById('galaxy-log-search').value.toLowerCase();
    const logContainer = document.getElementById('galaxy-log-container');
    const filteredLog = game.galaxyLog.filter(entry => entry.text.toLowerCase().includes(searchTerm));
    let logHTML = '';
    if (filteredLog.length === 0) {
        logHTML += '<p>No matching events found.</p>';
    } else {
        filteredLog.forEach(entry => {
            logHTML += `<div class="console-message console-message-${entry.type}"><strong>[${entry.timestamp}]</strong> ${entry.text}</div>`;
        });
    }
    logContainer.innerHTML = logHTML;
}

/**
 * Displays a console message specific to the type of object in the player's current sector upon arrival.
 */
export function displayArrivalMessage() { /* ... (no changes needed here, uses sector.type which is now set correctly) ... */
    const sector = game.map[`${game.player.x},${game.player.y}`];
    if (!sector || !sector.data || sector.type === 'hazard') return; // Hazards handled by handleHazardEntry
    let message = ''; let type = 'info'; let sound = 'message_system'; // Default sound for arrivals
    switch (sector.type) {
        case 'port': case 'spacePort': message = `Docking at ${sector.data.name || 'the station'}...`; break;
        case 'planet': message = `Entering orbit of ${sector.data.name || 'the planet'}.`; break;
        case 'star': message = `Approaching ${sector.data.name || 'the star'}. Maintain safe distance.`; break;
        case 'npc_trader': // For all NPC types now from ship_definitions
        case 'vinari_ship':
        case 'duran_ship':
            const npcShip = sector.data; // This is a Ship object
            message = `Ship detected: ${npcShip.ship_name} (${npcShip.faction}).`;
            if (npcShip.faction === FACTION_VINARI || npcShip.faction === FACTION_DURAN) {
                type = 'warning'; sound = 'error'; // More urgent for potentially hostile
            }
            break;
    }
    if (message) displayConsoleMessage(message, type, sound);
}


export function displayDefenseManagement() {
    const planet = game.map[`${game.player.x},${game.player.y}`].data;
    // Safety check in case this is called on a non-player planet
    if (!planet || planet.ownership !== game.player.name) {
        console.error("Attempted to open defense management for a planet not owned by the player.");
        hideActionView(); // Close the panel
        return;
    }

    const planetInv = planet.inventory;
    const planetDef = planet.defenses;
    const planetColony = planet.colony;

    ui.spacePortTitle.textContent = `Colony Management - ${planet.name}`;

    // Build the HTML for the management panel
    let html = `
    <div style="text-align: left; white-space: pre-wrap; line-height: 1.5;">
    <p><strong>Planet Level:</strong> ${planetDef.level} | <strong>Status:</strong> ${planetColony.status}</p>
    <p><strong>Population:</strong> ${planetColony.population.toLocaleString()}</p>
    <hr style="border-color: #050;">
    <p><strong>Local Stockpile:</strong> Ore: ${planetInv.ore}, Food: ${planetInv.food}, Tech: ${planetInv.tech}</p>
    <p><strong>Available for Collection:</strong> ${planetColony.income.toLocaleString()} credits</p>
    <hr style="border-color: #050;">
    <p><strong>Construction & Directives:</strong></p>
    </div>
    <div class="button-group">
    <button data-action="upgradePlanetLevel" disabled>Upgrade Level (N/I)</button>
    <button data-action="buildPlanetaryFighters" disabled>Build Fighters (N/I)</button>
    <button data-action="buildQuasarCannons" disabled>Build Q-Cannons (N/I)</button>
    <button data-action="collectIncome" ${planetColony.income <= 0 ? 'disabled' : ''}>Collect Income</button>
    </div>
    `;

    ui.spacePortControls.innerHTML = html;
    // The triggerAction function will need cases for these new data-actions when we implement them.
}


/**
 * Hides any full-panel view (like Manual, Log, Rankings) by refreshing the UI.
 */
export function hideActionView() {
    playSoundEffect('ui_click');
    // Refreshes the UI based on the player's current location,
    // which effectively closes the Manual, Log, or Rankings panel.
    updateUI();
}


// --- UI Update Master Function ---
export function updateUI() {
    // Ensure UI is initialized
    if (!ui.shipInfo) {
        initializeUI();
    }

    updateShipStatus();
    updateInventory();
    renderMap();
    updateInformationFeed();
    updateInteraction();
    // Enable/disable buttons based on player state
    ui.deployMineButton.disabled = game.player.ship.mines <= 0;
    ui.mapSizeSelect.disabled = game.hasMoved; // Disable map size change after first move
    // Update Solar Array button text and state
    if (ui.deploySolarArrayButton) {
        if (game.solarArrayDeployed) {
            ui.deploySolarArrayButton.textContent = 'Retract Solar Array';
            ui.deploySolarArrayButton.disabled = false; // Always allow retracting
        } else {
            ui.deploySolarArrayButton.textContent = 'Deploy Solar Array';
            // Disable deploy if fuel is full or in combat
            ui.deploySolarArrayButton.disabled = (game.player.ship.fuel >= game.player.ship.maxFuel) || !!game.inCombatWith;
        }
    }
    // Update console display
    updateConsoleDisplay();

    // --- SIMULATION MODE ---
    const movementButtons = document.querySelectorAll('button[data-action="move"], button[data-action="deployMine"], button[data-action="toggleSolarArray"], button[data-action*="warp"]');
    if (game.isSimulationRunning) {
        movementButtons.forEach(btn => btn.disabled = true);
    } else {
        // Re-enable buttons, but respect their individual states (e.g., mine button if out of mines)
        document.querySelectorAll('button[data-action="move"]').forEach(btn => btn.disabled = false);
        ui.deployMineButton.disabled = game.player.ship.mines <= 0;
        // The solar array and warp buttons will be handled by their own logic within updateUI
    }
}
