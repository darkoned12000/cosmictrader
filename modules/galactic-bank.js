/**
 * Galactic Bank System
 * Handles player and NPC banking operations, interest calculations, and persistent storage
 */

// --- Bank Module Imports ---
import { game } from '../core/state.js';
import { displayConsoleMessage, updateUI } from './ui.js';
import { playSoundEffect } from './audio.js';

// --- Bank Constants ---
export const INTEREST_RATE_PER_DAY = 0.015; // 1.5% daily interest
const MIN_DEPOSIT = 100;
const MAX_WITHDRAWAL_FEE = 50; // Small fee for withdrawals
const BANK_UPDATE_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// --- Bank Data Structure ---
class GalacticBank {
    constructor() {
        this.accounts = {}; // { playerName: { balance: number, lastUpdate: timestamp, pin: string } }
        this.npcAccounts = {}; // { npcId: { balance: number, lastUpdate: timestamp } }
        this.initializeBank();
    }

    initializeBank() {
        // Load from game.saveData if exists
        if (game.saveData && game.saveData.bank) {
            this.accounts = game.saveData.bank.accounts || {};
            this.npcAccounts = game.saveData.bank.npcAccounts || {};
        }

        // Ensure player has an account
        if (!this.accounts[game.player.name]) {
            this.accounts[game.player.name] = {
                balance: 0,
                lastUpdate: Date.now(),
                pin: null
            };
        }
    }

    saveBankData() {
        if (!game.saveData) game.saveData = {};
        if (!game.saveData.bank) game.saveData.bank = {};
        game.saveData.bank.accounts = this.accounts;
        game.saveData.bank.npcAccounts = this.npcAccounts;
    }

    calculateInterest(account, currentTime = Date.now()) {
        const timeDiff = currentTime - account.lastUpdate;
        const daysElapsed = timeDiff / (24 * 60 * 60 * 1000);

        if (daysElapsed >= 1) {
            const interest = account.balance * INTEREST_RATE_PER_DAY * Math.floor(daysElapsed);
            account.balance += interest;
            account.lastUpdate = currentTime;
            return interest;
        }
        return 0;
    }

    deposit(amount, playerName = game.player.name, isNPC = false) {
        if (amount < MIN_DEPOSIT) {
            displayConsoleMessage(`Minimum deposit is ${MIN_DEPOSIT} credits.`, 'error');
            return false;
        }

        const accountType = isNPC ? this.npcAccounts : this.accounts;
        const accountKey = isNPC ? playerName : playerName;

        if (!accountType[accountKey]) {
            accountType[accountKey] = {
                balance: 0,
                lastUpdate: Date.now()
            };
        }

        const account = accountType[accountKey];

        // Calculate interest before deposit
        this.calculateInterest(account);

        if (isNPC) {
            // For NPCs, deduct from their credits
            if (game.npcs.find(npc => npc.ship_id === playerName)) {
                const npc = game.npcs.find(npc => npc.ship_id === playerName);
                if (npc.credits >= amount) {
                    npc.credits -= amount;
                    account.balance += amount;
                    this.saveBankData();
                    return true;
                }
            }
        } else {
            // For player
            if (game.player.credits >= amount) {
                game.player.credits -= amount;
                account.balance += amount;
                this.saveBankData();
                displayConsoleMessage(`Deposited ${amount.toLocaleString()} credits. New balance: ${account.balance.toLocaleString()}`, 'success');
                playSoundEffect('trade_buy');
                updateUI();
                return true;
            }
        }

        displayConsoleMessage('Insufficient credits for deposit.', 'error');
        return false;
    }

    withdraw(amount, playerName = game.player.name, isNPC = false) {
        const accountType = isNPC ? this.npcAccounts : this.accounts;
        const accountKey = isNPC ? playerName : playerName;

        if (!accountType[accountKey]) {
            displayConsoleMessage('No bank account found.', 'error');
            return false;
        }

        const account = accountType[accountKey];

        // Calculate interest before withdrawal
        this.calculateInterest(account);

        const fee = Math.min(amount * 0.01, MAX_WITHDRAWAL_FEE); // 1% fee, max 50 credits
        const totalAmount = amount + fee;

        if (account.balance >= totalAmount) {
            account.balance -= totalAmount;

            if (isNPC) {
                const npc = game.npcs.find(npc => npc.ship_id === playerName);
                if (npc) {
                    npc.credits += amount;
                }
            } else {
                game.player.credits += amount;
                displayConsoleMessage(`Withdrew ${amount.toLocaleString()} credits (fee: ${fee.toLocaleString()}). New balance: ${account.balance.toLocaleString()}`, 'success');
                playSoundEffect('trade_sell');
                updateUI();
            }

            this.saveBankData();
            return true;
        }

        displayConsoleMessage('Insufficient bank balance.', 'error');
        return false;
    }

    getBalance(playerName = game.player.name, isNPC = false) {
        const accountType = isNPC ? this.npcAccounts : this.accounts;
        const accountKey = isNPC ? playerName : playerName;

        if (!accountType[accountKey]) return 0;

        const account = accountType[accountKey];
        this.calculateInterest(account);
        return account.balance;
    }

    setPIN(pin) {
        if (!this.accounts[game.player.name]) return false;

        if (pin.length < 4 || pin.length > 6) {
            displayConsoleMessage('PIN must be 4-6 digits.', 'error');
            return false;
        }

        this.accounts[game.player.name].pin = pin;
        this.saveBankData();
        displayConsoleMessage('Bank PIN set successfully.', 'success');
        return true;
    }

    verifyPIN(pin) {
        return this.accounts[game.player.name]?.pin === pin;
    }

    // Update all accounts with interest (call periodically)
    updateAllAccounts() {
        const currentTime = Date.now();

        Object.values(this.accounts).forEach(account => {
            this.calculateInterest(account, currentTime);
        });

        Object.values(this.npcAccounts).forEach(account => {
            this.calculateInterest(account, currentTime);
        });

        this.saveBankData();
    }
}

// --- Export Bank Instance ---
export const galacticBank = new GalacticBank();

// --- Bank UI Functions ---
export function showBankInterface() {
    // This will be called from UI when player accesses bank
    const balance = galacticBank.getBalance();
    const interestRate = (INTEREST_RATE_PER_DAY * 100).toFixed(2);

    // UI implementation will go here
    displayConsoleMessage(`Bank Balance: ${balance.toLocaleString()} credits (${interestRate}% daily interest)`, 'info');
}

export function depositToBank(amount) {
    return galacticBank.deposit(amount);
}

export function withdrawFromBank(amount) {
    return galacticBank.withdraw(amount);
}

export function setBankPIN(pin) {
    return galacticBank.setPIN(pin);
}

// --- Periodic Bank Updates ---
setInterval(() => {
    galacticBank.updateAllAccounts();
}, BANK_UPDATE_INTERVAL);