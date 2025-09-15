// DOM and keyboard event listeners

document.addEventListener('DOMContentLoaded', () => {
    // Initialize UI references first
    initializeUI();

    // Event delegation for all buttons.
    document.body.addEventListener('click', (event) => {
        const target = event.target;
        if (target.tagName === 'BUTTON') {
            attemptFirstAudioPlay();
            // Generic click sound for UI feedback, individual actions can play more specific sounds.
            // playSoundEffect('ui_click'); // This might be too noisy if every action also plays a sound.

            // Handling for data-action buttons (mostly in #center-column and #interaction-controls)
            if (target.dataset.action) {
                if (!target.disabled) {
                    const action = target.dataset.action;
                    const direction = target.dataset.direction; // For move buttons
                    if (action === 'move') {
                        triggerAction('move', direction);
                    } else {
                        triggerAction(action);
                    }
                }
            }
            // Handling for buttons with inline onclick (mostly in #space-port-controls)
            else if (target.onclick && !target.disabled) {
                // The inline onclick will execute itself.
                // No need to call eval here if the HTML has `onclick="functionName()"`
            }
        }
    });

    ui.mapSizeSelect.addEventListener('change', restartGame);
    document.getElementById('continue-button').addEventListener('click', handleNameSubmit);
    document.getElementById('login-button').addEventListener('click', handleLogin);
    document.getElementById('create-player-button').addEventListener('click', handleCreatePlayer);

    // Also, let's make the "Enter" key work for convenience
    document.getElementById('player-name-input').addEventListener('keyup', (e) => {
        if (e.key === 'Enter') handleNameSubmit();
    });
        document.getElementById('password-input').addEventListener('keyup', (e) => {
            if (e.key === 'Enter') handleLogin();
        });
            document.getElementById('new-password-input').addEventListener('keyup', (e) => {
                if (e.key === 'Enter') handleCreatePlayer();
            });
    ui.readManualButton.addEventListener('click', displayManual);
    document.getElementById('view-galaxy-log-button').addEventListener('click', displayGalaxyLog);
    document.getElementById('power-rankings-button').addEventListener('click', displayPowerRankings);
    document.getElementById('toggle-simulation-button').addEventListener('click', toggleSimulation);

    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return; // Ignore keydown if typing in input
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'm'].includes(e.key)) e.preventDefault();
        switch (e.key) {
            case 'ArrowUp': case 'w': triggerAction('move', 'up'); break;
            case 'ArrowDown': case 's': triggerAction('move', 'down'); break;
            case 'ArrowLeft': case 'a': triggerAction('move', 'left'); break;
            case 'ArrowRight': case 'd': triggerAction('move', 'right'); break;
            case 'm': if (!ui.deployMineButton.disabled) triggerAction('deployMine'); else displayConsoleMessage("No mines to deploy.", 'warning'); break;
        }
    });


// --- END of EVENT LISTENERS ---
// ------------------------------

// Initialize the game when the DOM is fully loaded
showLoginModal();
});