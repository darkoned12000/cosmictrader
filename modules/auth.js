// --- modules/auth.js ---

import { game } from '../core/state.js';
import { loadGame, initGame } from '../core/game.js';
import { deepClone } from '../core/utilities.js';
import { displayConsoleMessage, updateUI } from './ui.js';

export const ACCOUNTS_STORAGE_KEY = 'cosmicTraderAccounts';

/**
 * Displays the login modal over the blurred game UI.
 */
export function showLoginModal() {
    document.getElementById('main-ui').classList.add('blurred');
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('player-name-input').focus();
}

/**
 * Hides the login modal and un-blurs the game UI.
 */
export function hideLoginModal() {
    document.getElementById('main-ui').classList.remove('blurred');
    document.getElementById('login-screen').style.display = 'none';
}

/**
 * Handles the first step of login: submitting the player's callsign.
 */
export function handleNameSubmit() {
    const nameInput = document.getElementById('player-name-input');
    const playerName = nameInput.value.trim();
    const messageArea = document.getElementById('login-message-area');
    messageArea.textContent = '';

    if (!playerName || playerName.includes(" ")) {
        messageArea.textContent = "Callsign must be a single word, no spaces.";
        return;
    }

    const accounts = JSON.parse(localStorage.getItem(ACCOUNTS_STORAGE_KEY)) || {};
    if (accounts[playerName.toLowerCase()]) {
        // Player exists, show password stage
        document.getElementById('name-stage').style.display = 'none';
        document.getElementById('password-stage').style.display = 'block';
        document.getElementById('create-player-stage').style.display = 'none';
        document.getElementById('login-title').textContent = `Welcome back, ${playerName}`;
        document.getElementById('password-input').focus();
    } else {
        // New player, show creation stage
        document.getElementById('name-stage').style.display = 'none';
        document.getElementById('password-stage').style.display = 'none';
        document.getElementById('create-player-stage').style.display = 'block';
        document.getElementById('login-title').textContent = `Create Profile for ${playerName}`;
        document.getElementById('new-password-input').focus();
    }
}

/**
 * Handles login for an existing player.
 */
export function handleLogin() {
    const nameInput = document.getElementById('player-name-input');
    const passInput = document.getElementById('password-input');
    const playerName = nameInput.value.trim().toLowerCase();
    const password = passInput.value;
    const messageArea = document.getElementById('login-message-area');

    const accounts = JSON.parse(localStorage.getItem(ACCOUNTS_STORAGE_KEY)) || {};
    const playerData = accounts[playerName];

    if (playerData && playerData.password === password) {
        loadGame(playerName); // This will load data and start the game
    } else {
        messageArea.textContent = "Incorrect password. Please try again.";
        passInput.value = "";
        passInput.focus();
    }
}

/**
 * Handles creating a new player profile and starting the game.
 */
export function handleCreatePlayer() {
    const nameInput = document.getElementById('player-name-input');
    const passInput = document.getElementById('new-password-input');
    const shipInput = document.getElementById('ship-name-input');
    const messageArea = document.getElementById('login-message-area');

    const playerName = nameInput.value.trim();
    const password = passInput.value;
    const shipName = shipInput.value.trim() || `${playerName}'s Hope`;

    if (password.length < 3) {
        messageArea.textContent = "Password must be at least 3 characters.";
        return;
    }

    // This calls the global initGame to set up a default state.
    // We pass `true` to signal that this is for a new player profile.
    initGame(true, playerName, shipName);

    // Create the new player's account data
    const newPlayerData = {
        password: password,
        gameState: deepClone(game) // Use deepClone to save a clean copy of the initial state
    };

    const accounts = JSON.parse(localStorage.getItem(ACCOUNTS_STORAGE_KEY)) || {};
    accounts[playerName.toLowerCase()] = newPlayerData;
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));

    displayConsoleMessage(`New profile created for ${playerName}. Welcome to the cosmos!`, 'success');
    startGame(); // Hides the modal and updates the UI
}

/**
 * Finalizes the login/creation process.
 */
export function startGame() {
    hideLoginModal();
    updateUI();
}
