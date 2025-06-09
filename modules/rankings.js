/**
 * Generates and displays the Power Rankings UI.
 */
// In modules/rankings.js

function displayPowerRankings() {
    attemptFirstAudioPlay();
    playSoundEffect('ui_click');

    // Set the title bar with the toggle button
    ui.spacePortTitle.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center;">
    <span>Galactic Power Rankings</span>
    <button id="view-faction-power-button" style="font-size: 10px; padding: 4px 8px;">View Faction Power</button>
    </div>
    `;

    // 1. Gather all entities to be ranked
    const playerFullName = `${game.player.firstName} ${game.player.lastName}`.trim();
    const allEntities = [
        { ...game.player, displayName: playerFullName, shipName: game.player.ship.name, status: 'Active' },
        ...game.npcs.map(n => ({ ...n, displayName: n.captain_name, shipName: n.ship_name, status: 'Active' })),
        ...game.deceasedNpcs.map(n => ({ ...n, displayName: n.captain_name, shipName: n.ship_name, status: 'Deceased' }))
    ];

    // 2. Calculate power and other stats for each entity
    const rankedEntities = allEntities.map(entity => {
        const power = calculateEntityPower(entity);
        const credits = (entity.name === "Player") ? entity.credits : (entity.bounty ? entity.bounty * 10 : 'N/A');
        const kills = entity.kills || 0;
        return {
            displayName: entity.displayName,
            shipName: entity.shipName,
            power: power,
            credits: credits,
            kills: kills,
            status: entity.status
        };
    });

    // 3. Sort entities by power score
    rankedEntities.sort((a, b) => b.power - a.power);

    // 4. Generate the HTML with the new structure for scrolling
    let rankingsHTML = `
    <div class="rankings-container">
    <div class="rankings-table-wrapper">
    <table class="rankings-table" style="width: 100%; border-collapse: collapse;">
    <thead>
    <tr>
    <th style="text-align: left; padding: 4px; border-bottom: 1px solid #0f0;">Name</th>
    <th style="text-align: right; padding: 4px; border-bottom: 1px solid #0f0;">Total Power</th>
    <th style="text-align: right; padding: 4px; border-bottom: 1px solid #0f0;">Est. Worth (cr)</th>
    <th style="text-align: right; padding: 4px; border-bottom: 1px solid #0f0;">Kills</th>
    <th style="text-align: left; padding: 4px; border-bottom: 1px solid #0f0;">Status</th>
    </tr>
    </thead>
    <tbody>
    `;

    // --- THIS IS THE FULL LOOP THAT WAS MISSING ---
    rankedEntities.forEach(entity => {
        const statusColor = entity.status === 'Active' ? 'lime' : '#f44';
        const creditDisplay = typeof entity.credits === 'number' ? entity.credits.toLocaleString() : entity.credits;
        rankingsHTML += `
        <tr>
            <td style="padding: 4px;">${entity.displayName} ('${entity.shipName}')</td>
            <td style="text-align: right; padding: 4px;">${entity.power.toLocaleString()}</td>
            <td style="text-align: right; padding: 4px;">${creditDisplay}</td>
            <td style="text-align: right; padding: 4px;">${entity.kills}</td>
            <td style="padding: 4px;"><span style="color: ${statusColor};">●</span> ${entity.status}</td>
        </tr>
        `;
    });
    // --- END OF THE LOOP ---

    rankingsHTML += `</tbody></table></div>`; // End of .rankings-table-wrapper
    // Add the "Close" button outside the scrollable area
    rankingsHTML += `<div style="padding-top: 10px;"><button id="close-action-view-button">Close Rankings</button></div>`;
    rankingsHTML += `</div>`; // End of .rankings-container

    // 5. Update the UI and attach event listeners
    ui.spacePortControls.innerHTML = rankingsHTML;
    document.getElementById('view-faction-power-button').addEventListener('click', toggleRankingsView);
    document.getElementById('close-action-view-button').addEventListener('click', hideActionView);
}


/**
 * Replaces the rankings table with a view showing faction power charts.
 */
function displayFactionCharts() {
    playSoundEffect('ui_click');

    // --- UPDATE THE TITLE BAR BUTTON ---
    const titleButton = document.getElementById('view-faction-power-button');
    if (titleButton) {
        titleButton.textContent = 'Back to Rankings';
        // Remove old listener and add a new one to prevent loops
        titleButton.removeEventListener('click', toggleRankingsView);
        titleButton.addEventListener('click', toggleRankingsView);
    }

    // --- HTML FOR CHARTS (Make them smaller) ---
    const chartHTML = `
    <div class="rankings-container">
    <div style="display: flex; justify-content: space-around; align-items: center; flex-wrap: wrap; gap: 10px; flex-grow: 1;">
    <div style="width: 48%; max-width: 200px; text-align: center;">
    <p style="margin-bottom: 5px;">Fleet Composition</p>
    <canvas id="factionShipCountChart"></canvas>
    </div>
    <div style="width: 48%; max-width: 200px; text-align: center;">
    <p style="margin-bottom: 5px;">Consolidated Power</p>
    <canvas id="factionTotalPowerChart"></canvas>
    </div>
    </div>
    <div style="padding-top: 10px;"><button id="close-action-view-button">Close Rankings</button></div>
    </div>
    `;

    ui.spacePortControls.innerHTML = chartHTML;
    generateFactionCharts(); // This function remains the same
    document.getElementById('close-action-view-button').addEventListener('click', hideActionView);
}

/**
 * Gathers data and uses Chart.js to render the faction pie charts.
 */
function generateFactionCharts() {
    // 1. Gather and aggregate data
    const factionData = {
        [FACTION_DURAN]: { shipCount: 0, totalPower: 0 },
        [FACTION_VINARI]: { shipCount: 0, totalPower: 0 },
        [FACTION_TRADER]: { shipCount: 0, totalPower: 0 }
    };

    game.npcs.forEach(npc => {
        if (factionData[npc.faction]) {
            factionData[npc.faction].shipCount++;
            factionData[npc.faction].totalPower += calculateEntityPower(npc);
        }
    });

    const labels = Object.keys(factionData);
    const shipCounts = labels.map(label => factionData[label].shipCount);
    const totalPowers = labels.map(label => factionData[label].totalPower);
    const chartColors = ['#ff4040', '#30a0ff', '#ffae42']; // Red for Duran, Blue for Vinari, Orange for Trader

    // --- Chart.js Configuration ---
    Chart.defaults.color = '#0f0'; // Set default font color for charts
    Chart.defaults.font.family = 'monospace';

    // 2. Create the Ship Count Chart
    const shipCtx = document.getElementById('factionShipCountChart');
    new Chart(shipCtx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'Ship Count',
                data: shipCounts,
                backgroundColor: chartColors,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            let value = context.raw || 0;
                            let total = context.chart.getDatasetMeta(0).total;
                            let percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                            return `${label}: ${value} ships (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });

    // 3. Create the Total Power Chart
    const powerCtx = document.getElementById('factionTotalPowerChart');
    new Chart(powerCtx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'Total Power',
                data: totalPowers,
                backgroundColor: chartColors,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            let value = context.raw || 0;
                            let total = context.chart.getDatasetMeta(0).total;
                            let percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                            return `${label}: ${value.toLocaleString()} Power (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Add this new function to modules/rankings.js
function toggleRankingsView(event) {
    const buttonText = event.target.textContent;
    if (buttonText === 'View Faction Power') {
        displayFactionCharts();
    } else {
        displayPowerRankings();
    }
}
