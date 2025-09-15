// --- AUDIO CONTROLS ---
// ES6 Module exports

import { game, ui } from '../core/state.js';
import { musicThemes } from '../data/game-data.js';

export function initAudioControls() {
    ui.musicThemeSelect.innerHTML = '';
    musicThemes.forEach((t) => {
        const o = document.createElement('option');
        o.value = t.file;
        o.textContent = t.name;
        ui.musicThemeSelect.appendChild(o);
    });

    game.preMuteMusicVolume = parseFloat(ui.musicVolumeSlider.value);
    game.preMuteSfxVolume = parseFloat(ui.sfxVolumeSlider.value);
    game.musicVolume = game.preMuteMusicVolume; // Initialize current volume
    game.sfxVolume = game.preMuteSfxVolume;   // Initialize current volume

    ui.bgmAudio.volume = game.musicVolume;
    ui.musicVolumeLabel.textContent = `${Math.round(game.musicVolume * 100)}%`;
    ui.sfxVolumeLabel.textContent = `${Math.round(game.sfxVolume * 100)}%`;
    ui.bgmAudio.loop = ui.musicLoopCheckbox.checked;

    if (ui.musicThemeSelect.value) {
        ui.bgmAudio.src = ui.musicThemeSelect.value;
        ui.bgmAudio.load();
    }

    ui.musicVolumeSlider.oninput = () => {
        const v = parseFloat(ui.musicVolumeSlider.value);
        game.preMuteMusicVolume = v;
        if (!ui.muteCheckbox.checked) {
            ui.bgmAudio.volume = v;
            game.musicVolume = v;
        }
        ui.musicVolumeLabel.textContent = `${Math.round(v * 100)}%`;
    };

    ui.sfxVolumeSlider.oninput = () => {
        const v = parseFloat(ui.sfxVolumeSlider.value);
        game.preMuteSfxVolume = v;
        if (!ui.muteCheckbox.checked) {
            game.sfxVolume = v;
        }
        ui.sfxVolumeLabel.textContent = `${Math.round(v * 100)}%`;
    };

    ui.musicThemeSelect.onchange = () => {
        if (ui.musicThemeSelect.value) {
            ui.bgmAudio.src = ui.musicThemeSelect.value;
            ui.bgmAudio.load();
            if (game.audioInitialized && !ui.muteCheckbox.checked) {
                ui.bgmAudio.play().catch(e => console.warn("Audio play failed:", e));
            }
        }
    };
    ui.musicLoopCheckbox.onchange = () => { ui.bgmAudio.loop = ui.musicLoopCheckbox.checked; };

    ui.muteCheckbox.onchange = () => {
        if (ui.muteCheckbox.checked) {
            ui.bgmAudio.volume = 0;
            // game.sfxVolume is effectively 0 for playSoundEffect, no need to change master game.sfxVolume here
            // just ensure playSoundEffect respects a "muted" state or this direct change.
            // For simplicity, we'll set game.sfxVolume to 0 for mute, and restore it.
            const _currentSfxVol = game.sfxVolume; // temp store
            game.sfxVolume = 0;


            ui.musicVolumeSlider.disabled = true;
            ui.sfxVolumeSlider.disabled = true;
        } else {
            ui.bgmAudio.volume = game.preMuteMusicVolume;
            game.musicVolume = game.preMuteMusicVolume;
            game.sfxVolume = game.preMuteSfxVolume; // Restore SFX volume

            ui.musicVolumeSlider.disabled = false;
            ui.sfxVolumeSlider.disabled = false;
            if (game.audioInitialized && ui.bgmAudio.src && ui.bgmAudio.paused) {
                 ui.bgmAudio.play().catch(e => console.warn("Audio play failed on unmute:", e));
            }
        }
    };
    ui.musicVolumeSlider.disabled = ui.muteCheckbox.checked;
    ui.sfxVolumeSlider.disabled = ui.muteCheckbox.checked;
}

export function playSoundEffect(effectName) {
    // Sound effects temporarily disabled to prevent 404 errors
    // if (!game.audioInitialized || !soundEffects[effectName] || game.sfxVolume === 0) return;
    // try {
    //     const sfxClone = ui.sfxAudio.cloneNode(); // Play multiple sounds concurrently
    //     sfxClone.src = soundEffects[effectName];
    //     sfxClone.volume = game.sfxVolume;
    //     sfxClone.play().catch(e => console.warn(`SFX clone failed: ${effectName}`, e));
    //     sfxClone.onended = () => sfxClone.remove(); // Clean up
    // } catch (e) {
    //     console.warn(`SFX error for ${effectName}:`, e);
    // }
}

export function attemptFirstAudioPlay() {
    if (!game.audioInitialized && ui.bgmAudio.src) {
        console.log("Attempting BGM...");
        ui.bgmAudio.play().then(() => {
            console.log("BGM started.");
            game.audioInitialized = true;
        }).catch(e => {
            console.warn("BGM failed:", e);
            // Mark as initialized to avoid repeated attempts, user might need to click again if browser blocks autoplay.
            game.audioInitialized = true;
        });
    }
}
