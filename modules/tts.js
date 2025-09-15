// --- TEXT-TO-SPEECH (TTS) MODULE ---
// Provides voice narration for Space Manual entries

// TTS Configuration
const TTS_CONFIG = {
    enabled: true,
    voice: null, // Will be selected automatically
    rate: 0.78,  // Slower, more natural pace
    pitch: 0.95, // Slightly lower pitch for more natural male voice
    volume: 0.85, // Slightly louder for better presence
    preferredVoiceNames: [
        'Microsoft David', 'Microsoft Mark', 'Microsoft George',
        'Google US English', 'Google UK English',
        'Microsoft Zira', 'Microsoft Aria', 'Microsoft Jenny',
        'Alex', 'Daniel', 'Fred', 'Tom', 'Lee'
    ],
    // API-based TTS options for higher quality voices
    useAPI: true, // Set to true to use external TTS API
    apiProvider: 'piper', // 'elevenlabs', 'piper'
    apiKey: '', // Not needed for Piper
    apiVoice: 'en_US-amy-medium', // Piper voice name
    apiModel: '', // Not used for Piper
    // Local TTS server options (for Piper)
    localTTSEndpoint: 'http://localhost:5000', // Piper server URL
    // Caching options to reduce API calls
    enableCaching: true, // Cache API responses locally
    cacheExpiryHours: 24 // How long to cache voices
};

// TTS State
let ttsState = {
    isPlaying: false,
    isPaused: false,
    currentUtterance: null,
    currentAudio: null, // For API TTS audio elements
    availableVoices: [],
    musicWasPlaying: false,
    voiceCache: new Map() // Cache for API voice responses
};

// Pause background music if playing
function pauseMusicForTTS() {
    if (window.ui && window.ui.bgmAudio && !window.ui.bgmAudio.paused) {
        ttsState.musicWasPlaying = true;
        window.ui.bgmAudio.pause();
        console.log('TTS: Paused background music for voice narration');
    } else {
        ttsState.musicWasPlaying = false;
    }
}

// Resume background music if it was playing
function resumeMusicAfterTTS() {
    if (ttsState.musicWasPlaying && window.ui && window.ui.bgmAudio && window.ui.bgmAudio.paused) {
        window.ui.bgmAudio.play().catch(e => console.warn("Music resume failed:", e));
        console.log('TTS: Resumed background music after voice narration');
        ttsState.musicWasPlaying = false;
    }
}

// Initialize TTS system
function initTextToSpeech() {
    console.log('TTS: Initializing Text-to-Speech system...');

    if (!('speechSynthesis' in window)) {
        console.warn('TTS: Web Speech API not supported in this browser');
        TTS_CONFIG.enabled = false;
        return false;
    }

    console.log('TTS: Web Speech API available');

    // Load available voices
    loadAvailableVoices();

    // Set up voice change listener (voices load asynchronously)
    speechSynthesis.onvoiceschanged = loadAvailableVoices;

    console.log('TTS: Initialized successfully');
    return true;
}

// Load and select available voices
function loadAvailableVoices() {
    if (TTS_CONFIG.useAPI && TTS_CONFIG.apiProvider === 'piper') {
        // For Piper TTS, use our custom voice objects
        ttsState.availableVoices = [
            { name: 'Female', lang: 'en-US', voiceURI: 'en_US-amy-medium' },
            { name: 'Male', lang: 'en-US', voiceURI: 'en_US-joe-medium' }
        ];
        console.log('TTS: Piper voices loaded:', ttsState.availableVoices.length);
    } else {
        // Use Web Speech API voices
        ttsState.availableVoices = speechSynthesis.getVoices();
        console.log('TTS: Web Speech API voices loaded:', ttsState.availableVoices.length);
    }

    if (ttsState.availableVoices.length > 0) {
        selectOptimalVoice();
        console.log(`TTS: Loaded ${ttsState.availableVoices.length} voices, selected: ${TTS_CONFIG.voice?.name || 'default'}`);
    } else {
        console.log('TTS: No voices available yet, will retry on voiceschanged event');
    }
}

// Select the best available voice for natural human-like speech
function selectOptimalVoice() {
    const voices = ttsState.availableVoices;
    console.log('TTS: Selecting optimal human-like voice from', voices.length, 'available voices');

    // Special handling for Piper TTS - default to Male voice
    if (TTS_CONFIG.useAPI && TTS_CONFIG.apiProvider === 'piper') {
        const maleVoice = voices.find(v => v.name === 'Male');
        if (maleVoice) {
            TTS_CONFIG.voice = maleVoice;
            TTS_CONFIG.apiVoice = maleVoice.voiceURI;
            console.log('TTS: Selected default Piper voice:', maleVoice.name, '->', TTS_CONFIG.apiVoice);
            return;
        }
    }

    // First, try to find preferred natural voices
    for (const preferredName of TTS_CONFIG.preferredVoiceNames) {
        const voice = voices.find(v => v.name.includes(preferredName));
        if (voice) {
            TTS_CONFIG.voice = voice;
            console.log('TTS: Selected preferred voice:', voice.name, 'lang:', voice.lang);
            return;
        }
    }

    // Prioritize Microsoft and Google voices (usually more natural)
    const premiumVoice = voices.find(v =>
        v.lang.startsWith('en-') &&
        (v.name.includes('Microsoft') || v.name.includes('Google')) &&
        !v.name.toLowerCase().includes('robot') &&
        !v.name.toLowerCase().includes('computer')
    );

    if (premiumVoice) {
        TTS_CONFIG.voice = premiumVoice;
        console.log('TTS: Selected premium voice:', premiumVoice.name, 'lang:', premiumVoice.lang);
        return;
    }

    // Look for voices that sound more natural (avoid obviously robotic names)
    const naturalVoice = voices.find(v =>
        v.lang.startsWith('en-') &&
        !v.name.toLowerCase().includes('robot') &&
        !v.name.toLowerCase().includes('computer') &&
        !v.name.toLowerCase().includes('klatt') &&
        !v.name.toLowerCase().includes('festival') &&
        !v.name.toLowerCase().includes('espeak') &&
        !v.name.toLowerCase().includes('mbrola')
    );

    if (naturalVoice) {
        TTS_CONFIG.voice = naturalVoice;
        console.log('TTS: Selected natural voice:', naturalVoice.name, 'lang:', naturalVoice.lang);
        return;
    }

    // Look for any English voices
    const englishVoice = voices.find(v => v.lang.startsWith('en-'));
    if (englishVoice) {
        TTS_CONFIG.voice = englishVoice;
        console.log('TTS: Selected English voice:', englishVoice.name, 'lang:', englishVoice.lang);
        return;
    }

    // Final fallback: Use the default voice
    TTS_CONFIG.voice = voices[0] || null;
    if (TTS_CONFIG.voice) {
        console.log('TTS: Selected default voice:', TTS_CONFIG.voice.name, 'lang:', TTS_CONFIG.voice.lang);
    } else {
        console.log('TTS: No voice available');
    }
}

// Preprocess text for more natural speech
function preprocessTextForSpeech(text) {
    // Add natural pauses and emphasis
    let processed = text
        // Add slight pauses after punctuation
        .replace(/([.!?])\s+/g, '$1 ... ')
        // Make numbers sound more natural
        .replace(/\b(\d+)\b/g, ' $1 ')
        // Add natural flow
        .replace(/\s+/g, ' ')
        .trim();

    return processed;
}

// Voice caching functions
function getCacheKey(text, voice, model) {
    return `${voice}_${model}_${btoa(text).slice(0, 50)}`;
}

function getCachedVoice(cacheKey) {
    if (!TTS_CONFIG.enableCaching) return null;

    const cached = ttsState.voiceCache.get(cacheKey);
    if (!cached) return null;

    // Check if cache is expired
    const now = Date.now();
    const expiry = cached.timestamp + (TTS_CONFIG.cacheExpiryHours * 60 * 60 * 1000);

    if (now > expiry) {
        ttsState.voiceCache.delete(cacheKey);
        return null;
    }

    return cached.blob;
}

function setCachedVoice(cacheKey, blob) {
    if (!TTS_CONFIG.enableCaching) return;

    ttsState.voiceCache.set(cacheKey, {
        blob: blob,
        timestamp: Date.now()
    });
}

// API-based TTS functions
async function speakWithElevenLabs(text, options = {}) {
    if (!TTS_CONFIG.apiKey) {
        console.error('TTS: ElevenLabs API key not set');
        return false;
    }

    const cacheKey = getCacheKey(text, TTS_CONFIG.apiVoice, TTS_CONFIG.apiModel);
    let audioBlob = getCachedVoice(cacheKey);

    if (!audioBlob) {
        try {
            console.log('TTS: Fetching from ElevenLabs API...');
            const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${TTS_CONFIG.apiVoice}`, {
                method: 'POST',
                headers: {
                    'Accept': 'audio/mpeg',
                    'Content-Type': 'application/json',
                    'xi-api-key': TTS_CONFIG.apiKey
                },
                body: JSON.stringify({
                    text: text,
                    model_id: TTS_CONFIG.apiModel,
                    voice_settings: {
                        stability: 0.5,
                        similarity_boost: 0.8,
                        style: 0.5,
                        use_speaker_boost: true
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`ElevenLabs API error: ${response.status}`);
            }

            audioBlob = await response.blob();
            setCachedVoice(cacheKey, audioBlob);
            console.log('TTS: Voice cached for future use');
        } catch (error) {
            console.error('TTS: ElevenLabs error:', error);
            return false;
        }
    } else {
        console.log('TTS: Using cached voice');
    }

    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    ttsState.currentAudio = audio; // Store reference for pause/stop control

    audio.volume = (options.volume || TTS_CONFIG.volume) * (game?.sfxVolume || 1);

    // Set up event handlers
    audio.onplay = () => {
        pauseMusicForTTS();
        ttsState.isPlaying = true;
        ttsState.isPaused = false;
        updateTTSButtons('playing');
    };

    audio.onpause = () => {
        if (!audio.ended) {
            ttsState.isPaused = true;
            updateTTSButtons('paused');
        }
    };

    audio.onended = () => {
        resumeMusicAfterTTS();
        ttsState.isPlaying = false;
        ttsState.isPaused = false;
        ttsState.currentAudio = null; // Clear reference
        URL.revokeObjectURL(audioUrl);
        updateTTSButtons('stopped');
    };

    audio.onerror = () => {
        console.error('TTS: Audio playback error');
        resumeMusicAfterTTS();
        ttsState.isPlaying = false;
        ttsState.isPaused = false;
        ttsState.currentAudio = null; // Clear reference
        URL.revokeObjectURL(audioUrl);
        updateTTSButtons('stopped');
    };

    audio.play();
    return true;
}



async function speakWithPiper(text, options = {}) {
    console.log('TTS: speakWithPiper called for text:', text.substring(0, 30) + '...');
    const cacheKey = getCacheKey(text, TTS_CONFIG.apiVoice, 'piper');
    let audioBlob = getCachedVoice(cacheKey);

    if (!audioBlob) {
        try {
            console.log('TTS: Fetching from local Piper server...');

            // Try the Python API endpoint first (more direct)
            let response;
            try {
                response = await fetch(`${TTS_CONFIG.localTTSEndpoint}/synthesize`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        text: text,
                        voice: TTS_CONFIG.apiVoice || 'en_US-lessac-medium',
                        speaker_id: 0,
                        length_scale: 1.0, // Speech speed (lower = faster)
                        noise_scale: 0.667, // Voice stability
                        noise_w: 0.8, // Phoneme duration variation
                        sentence_silence: 0.2 // Pause between sentences
                    })
                });
            } catch (e) {
                // Fallback to the standard HTTP API
                console.log('TTS: Python API failed, trying standard HTTP API...');
                response = await fetch(`${TTS_CONFIG.localTTSEndpoint}/api/tts`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        text: text,
                        voice: TTS_CONFIG.apiVoice || 'en_US-lessac-medium',
                        speaker: 0
                    })
                });
            }

            if (!response.ok) {
                throw new Error(`Piper server error: ${response.status}`);
            }

            audioBlob = await response.blob();
            setCachedVoice(cacheKey, audioBlob);
            console.log('TTS: Voice cached from Piper');
        } catch (error) {
            console.error('TTS: Piper error:', error);
            return false;
        }
    } else {
        console.log('TTS: Using cached Piper voice');
    }

    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    ttsState.currentAudio = audio; // Store reference for pause/stop control

    audio.volume = (options.volume || TTS_CONFIG.volume) * (game?.sfxVolume || 1);

    audio.onplay = () => {
        pauseMusicForTTS();
        ttsState.isPlaying = true;
        ttsState.isPaused = false;
        updateTTSButtons('playing');
    };

    audio.onpause = () => {
        if (!audio.ended) {
            ttsState.isPaused = true;
            updateTTSButtons('paused');
        }
    };

    audio.onended = () => {
        resumeMusicAfterTTS();
        ttsState.isPlaying = false;
        ttsState.isPaused = false;
        ttsState.currentAudio = null; // Clear reference
        URL.revokeObjectURL(audioUrl);
        updateTTSButtons('stopped');
    };

    audio.onerror = () => {
        console.error('TTS: Audio playback error');
        resumeMusicAfterTTS();
        ttsState.isPlaying = false;
        ttsState.isPaused = false;
        ttsState.currentAudio = null; // Clear reference
        URL.revokeObjectURL(audioUrl);
        updateTTSButtons('stopped');
    };

    audio.play();
    return true;
}



// Main speak function that chooses between Web Speech API and external APIs
async function speakText(text, options = {}) {
    console.log('TTS: speakText called with text length:', text.length);
    console.log('TTS: useAPI:', TTS_CONFIG.useAPI, 'apiProvider:', TTS_CONFIG.apiProvider, 'apiKey:', TTS_CONFIG.apiKey ? 'present' : 'empty');
    console.log('TTS: Current TTS state before speaking:', {
        isPlaying: ttsState.isPlaying,
        isPaused: ttsState.isPaused,
        hasCurrentAudio: !!ttsState.currentAudio,
        hasCurrentUtterance: !!ttsState.currentUtterance
    });

    if (!TTS_CONFIG.enabled) {
        console.log('TTS: TTS is disabled');
        return;
    }

    if (game?.sfxVolume === 0) {
        console.log('TTS: SFX volume is 0, not speaking');
        return;
    }

    // Stop any current speech first
    stopSpeech();

    // Small delay to ensure cleanup is complete
    await new Promise(resolve => setTimeout(resolve, 50));

    // Try API-based TTS first if enabled
    if (TTS_CONFIG.useAPI && (TTS_CONFIG.apiKey || TTS_CONFIG.apiProvider === 'piper')) {
        let success = false;

        switch (TTS_CONFIG.apiProvider) {
            case 'elevenlabs':
                console.log('TTS: Using ElevenLabs provider');
                success = await speakWithElevenLabs(text, options);
                break;
            case 'piper':
                console.log('TTS: Using Piper provider');
                success = await speakWithPiper(text, options);
                break;
            default:
                console.warn('TTS: Unknown API provider:', TTS_CONFIG.apiProvider);
        }

        if (success) {
            return; // API TTS succeeded
        } else {
            console.warn('TTS: API TTS failed, falling back to Web Speech API');
        }
    }

    // Fallback to Web Speech API
    console.log('TTS: Using Web Speech API');

    // Check if we have voices available
    if (ttsState.availableVoices.length === 0) {
        console.log('TTS: No voices available, trying to reload...');
        loadAvailableVoices();
        if (ttsState.availableVoices.length === 0) {
            console.log('TTS: Still no voices available, cannot speak');
            return;
        }
    }

    // Preprocess text for more natural speech
    const processedText = preprocessTextForSpeech(text);
    const utterance = new SpeechSynthesisUtterance(processedText);

    // Apply natural human-like voice settings
    utterance.voice = TTS_CONFIG.voice;
    utterance.rate = options.rate || TTS_CONFIG.rate;
    utterance.pitch = options.pitch || TTS_CONFIG.pitch;
    utterance.volume = (options.volume || TTS_CONFIG.volume) * game.sfxVolume;

    // Set up event handlers
    utterance.onstart = () => {
        pauseMusicForTTS();
        ttsState.isPlaying = true;
        ttsState.isPaused = false;
        ttsState.currentUtterance = utterance;
        updateTTSButtons('playing');
    };

    utterance.onend = () => {
        resumeMusicAfterTTS();
        ttsState.isPlaying = false;
        ttsState.isPaused = false;
        ttsState.currentUtterance = null;
        updateTTSButtons('stopped');
    };

    utterance.onerror = (event) => {
        console.warn('TTS: Speech error:', event.error);
        resumeMusicAfterTTS();
        ttsState.isPlaying = false;
        ttsState.isPaused = false;
        ttsState.currentUtterance = null;
        updateTTSButtons('stopped');
    };

    speechSynthesis.speak(utterance);
}

// Pause current speech
function pauseSpeech() {
    if (ttsState.isPlaying && !ttsState.isPaused) {
        if (TTS_CONFIG.useAPI && ttsState.currentAudio) {
            // Pause HTML5 Audio element (for API TTS)
            ttsState.currentAudio.pause();
            ttsState.isPaused = true;
            updateTTSButtons('paused');
            console.log('TTS: Paused API TTS audio');
        } else {
            // Pause Web Speech API
            speechSynthesis.pause();
            ttsState.isPaused = true;
            updateTTSButtons('paused');
        }
    }
}

// Resume paused speech
function resumeSpeech() {
    if (ttsState.isPaused) {
        if (TTS_CONFIG.useAPI && ttsState.currentAudio) {
            // Resume HTML5 Audio element (for API TTS)
            ttsState.currentAudio.play();
            ttsState.isPaused = false;
            updateTTSButtons('playing');
            console.log('TTS: Resumed API TTS audio');
        } else {
            // Resume Web Speech API
            speechSynthesis.resume();
            ttsState.isPaused = false;
            updateTTSButtons('playing');
        }
    }
}

// Stop current speech
function stopSpeech() {
    if (ttsState.isPlaying || ttsState.isPaused) {
        if (TTS_CONFIG.useAPI && ttsState.currentAudio) {
            // Stop HTML5 Audio element (for API TTS)
            ttsState.currentAudio.pause();
            ttsState.currentAudio.currentTime = 0;
            ttsState.currentAudio = null;
            ttsState.isPlaying = false;
            ttsState.isPaused = false;
            updateTTSButtons('stopped');
            console.log('TTS: Stopped API TTS audio');
        } else {
            // Stop Web Speech API
            speechSynthesis.cancel();
            ttsState.isPlaying = false;
            ttsState.isPaused = false;
            ttsState.currentUtterance = null;
            updateTTSButtons('stopped');
        }
    }
}

// Convert manual content to speech-friendly text
function processManualContentForSpeech(manualData, category, subCategory = null) {
    console.log('TTS: processManualContentForSpeech called with:', category, subCategory);
    console.log('TTS: manualData available:', !!manualData);

    let speechText = '';

    try {
        if (!subCategory) {
            // Category overview
            speechText = `Now reading: ${category}. `;
            if (manualData[category]) {
                const subCategories = Object.keys(manualData[category]);
                speechText += `This category contains ${subCategories.length} entries: `;
                speechText += subCategories.join(', ') + '. ';
                speechText += 'Select a subcategory to hear detailed information.';
            }
        } else {
            // Specific manual entry
            const entry = manualData[category][subCategory];
            if (entry) {
                // Check if entry has TTS control settings
                const ttsInclude = entry.tts_include || null; // Array of sections to include
                const ttsExclude = entry.tts_exclude || null; // Array of sections to exclude

                // Default sections to process if no specific control
                let sectionsToProcess = ['description', 'how_it_works', 'success', 'failure'];

                if (ttsInclude) {
                    // Only include specified sections
                    sectionsToProcess = ttsInclude;
                    console.log('TTS: Using include list:', ttsInclude);
                } else if (ttsExclude) {
                    // Include all except excluded sections
                    sectionsToProcess = ['description', 'how_it_works', 'success', 'failure'];
                    sectionsToProcess = sectionsToProcess.filter(s => !ttsExclude.includes(s));
                    console.log('TTS: Using exclude list:', ttsExclude, '-> processing:', sectionsToProcess);
                }

                // Add title
                speechText = `${category}: ${subCategory}. `;

                // Process description (always include if it exists and not excluded)
                if (entry.description && (ttsInclude ? ttsInclude.includes('description') : !ttsExclude || !ttsExclude.includes('description'))) {
                    speechText += entry.description + '. ';
                }

                // Process how_it_works if it exists and is included
                if (entry.how_it_works && (ttsInclude ? ttsInclude.includes('how_it_works') : !ttsExclude || !ttsExclude.includes('how_it_works'))) {
                    speechText += 'How it works: ';
                    if (Array.isArray(entry.how_it_works)) {
                        entry.how_it_works.forEach((item, index) => {
                            if (typeof item === 'string') {
                                speechText += `${index + 1}. ${item}. `;
                            } else if (typeof item === 'object') {
                                // Handle nested objects - flatten them into the description
                                Object.entries(item).forEach(([key, value]) => {
                                    speechText += `${key}: ${value}. `;
                                });
                            }
                        });
                    }
                }

                // Process success/failure sections
                ['success', 'failure'].forEach(section => {
                    if (entry[section] && (ttsInclude ? ttsInclude.includes(section) : !ttsExclude || !ttsExclude.includes(section))) {
                        speechText += `${section.charAt(0).toUpperCase() + section.slice(1)}: `;
                        if (entry[section].description) {
                            speechText += entry[section].description + '. ';
                        }
                        if (entry[section].points && Array.isArray(entry[section].points)) {
                            entry[section].points.forEach(point => {
                                speechText += point + '. ';
                            });
                        }
                    }
                });

                // Process other sections (only if not specifically controlled)
                if (!ttsInclude && !ttsExclude) {
                    Object.entries(entry).forEach(([key, value]) => {
                        if (!['description', 'how_it_works', 'success', 'failure', 'tts_include', 'tts_exclude'].includes(key)) {
                            if (typeof value === 'string') {
                                speechText += `${key.replace(/_/g, ' ')}: ${value}. `;
                            } else if (Array.isArray(value)) {
                                speechText += `${key.replace(/_/g, ' ')}: `;
                                value.forEach(item => {
                                    speechText += item + '. ';
                                });
                            }
                        }
                    });
                } else if (ttsInclude) {
                    // Process only explicitly included sections
                    ttsInclude.forEach(section => {
                        if (entry[section] && !['description', 'how_it_works', 'success', 'failure'].includes(section)) {
                            const value = entry[section];
                            if (typeof value === 'string') {
                                speechText += `${section.replace(/_/g, ' ')}: ${value}. `;
                            } else if (Array.isArray(value)) {
                                speechText += `${section.replace(/_/g, ' ')}: `;
                                value.forEach(item => {
                                    speechText += item + '. ';
                                });
                            } else if (typeof value === 'object' && value.description) {
                                speechText += `${section.replace(/_/g, ' ')}: ${value.description}. `;
                                if (value.points && Array.isArray(value.points)) {
                                    value.points.forEach(point => {
                                        speechText += point + '. ';
                                    });
                                }
                            }
                        }
                    });
                }
            }
        }
    } catch (error) {
        console.warn('TTS: Error processing manual content:', error);
        speechText = `Error reading ${category}${subCategory ? ': ' + subCategory : ''}.`;
    }

    // Limit text length to prevent TTS timeouts (around 2000 characters should be safe)
    const maxLength = 2000;
    if (speechText.length > maxLength) {
        console.log(`TTS: Text too long (${speechText.length} chars), truncating to ${maxLength}`);
        speechText = speechText.substring(0, maxLength - 3) + '...';
    }

    console.log('TTS: Final speech text length:', speechText.length);
    return speechText;
}

// Update TTS button states in UI
function updateTTSButtons(state) {
    // This will be called by the UI module to update button appearances
    const event = new CustomEvent('ttsStateChanged', { detail: { state } });
    document.dispatchEvent(event);
}

// Get current TTS status
function getTTSStatus() {
    return {
        enabled: TTS_CONFIG.enabled,
        isPlaying: ttsState.isPlaying,
        isPaused: ttsState.isPaused,
        voiceName: TTS_CONFIG.voice?.name || 'Default',
        availableVoices: ttsState.availableVoices.length
    };
}

// List all available voices for debugging
function listAvailableVoices() {
    console.log('TTS: Available voices:');
    console.log('Current selected voice:', TTS_CONFIG.voice ? `${TTS_CONFIG.voice.name} (${TTS_CONFIG.voice.lang})` : 'none');
    console.log('---');
    ttsState.availableVoices.forEach((voice, index) => {
        const isSelected = TTS_CONFIG.voice && TTS_CONFIG.voice.name === voice.name && TTS_CONFIG.voice.lang === voice.lang;
        console.log(`${index}: "${voice.name}" - ${voice.lang} - ${voice.default ? 'DEFAULT' : ''} - ${voice.localService ? 'LOCAL' : 'REMOTE'}${isSelected ? ' <-- CURRENT' : ''}`);
    });
    return ttsState.availableVoices;
}

// Test TTS with sample text
function testTTS() {
    console.log('TTS: ===== TEST BUTTON PRESSED =====');
    console.log('TTS: Running test function');
    console.log('TTS: Current voice:', TTS_CONFIG.voice?.name || 'none', 'apiVoice:', TTS_CONFIG.apiVoice);
    console.log('TTS: Settings - rate:', TTS_CONFIG.rate, 'pitch:', TTS_CONFIG.pitch, 'volume:', TTS_CONFIG.volume);
    console.log('TTS: Game sfxVolume:', game?.sfxVolume);
    const testText = "Hello Captain, you are testing out my AI voice capabilities.";
    console.log('TTS: Test text:', testText);
    speakText(testText);
}

// Find voice index by name
function findVoiceIndex(voiceName) {
    const voices = ttsState.availableVoices;
    for (let i = 0; i < voices.length; i++) {
        if (voices[i].name.includes(voiceName)) {
            return i;
        }
    }
    return -1;
}

// Set voice by index
function setVoiceByIndex(index) {
    const voices = ttsState.availableVoices;
    if (index >= 0 && index < voices.length) {
        TTS_CONFIG.voice = voices[index];

        // For Piper TTS, also set the API voice
        if (TTS_CONFIG.useAPI && TTS_CONFIG.apiProvider === 'piper') {
            TTS_CONFIG.apiVoice = voices[index].voiceURI;
            console.log('TTS: Piper voice set to:', voices[index].name, '->', TTS_CONFIG.apiVoice);
        } else {
            console.log('TTS: Web Speech API voice set to:', voices[index].name, 'lang:', voices[index].lang);
        }
        return true;
    } else {
        console.log('TTS: Invalid voice index:', index);
        return false;
    }
}

// Test a specific voice by index
function testVoiceByIndex(index) {
    const voices = ttsState.availableVoices;
    if (index >= 0 && index < voices.length) {
        const testVoice = voices[index];
        console.log('TTS: Testing voice:', testVoice.name, 'lang:', testVoice.lang);
        const utterance = new SpeechSynthesisUtterance(`Hello, I'm ${testVoice.name}. This should sound like a natural human voice, not a computer.`);
        utterance.voice = testVoice;
        utterance.rate = TTS_CONFIG.rate;
        utterance.pitch = TTS_CONFIG.pitch;
        utterance.volume = TTS_CONFIG.volume * (game?.sfxVolume || 1);
        speechSynthesis.speak(utterance);
    } else {
        console.log('TTS: Invalid voice index:', index);
    }
}

// Adjust voice settings for more natural sound
function adjustVoiceSettings(rate = null, pitch = null) {
    if (rate !== null) TTS_CONFIG.rate = Math.max(0.1, Math.min(2.0, rate));
    if (pitch !== null) TTS_CONFIG.pitch = Math.max(0.1, Math.min(2.0, pitch));
    console.log('TTS: Voice settings updated - rate:', TTS_CONFIG.rate, 'pitch:', TTS_CONFIG.pitch);
}

// Configure API TTS settings
function configureAPITTS(provider, apiKey, voiceId = null) {
    TTS_CONFIG.apiProvider = provider;

    if (provider === 'piper') {
        // For Piper, apiKey is actually the server endpoint
        TTS_CONFIG.localTTSEndpoint = apiKey;
        TTS_CONFIG.apiVoice = voiceId || 'en_US-lessac-medium';
        console.log(`TTS: Configured Piper local server at ${apiKey} with voice: ${TTS_CONFIG.apiVoice}`);
    } else {
        TTS_CONFIG.apiKey = apiKey;
        if (voiceId) {
            TTS_CONFIG.apiVoice = voiceId;
        }

        // Set default voices for different providers
        if (provider === 'elevenlabs' && !voiceId) {
            TTS_CONFIG.apiVoice = '21m00Tcm4TlvDq8ikWAM'; // Adam (male)
        }

        console.log(`TTS: Configured ${provider} API with voice: ${TTS_CONFIG.apiVoice}`);
    }
}

// Enable/disable API TTS
function setUseAPITTS(useAPI) {
    TTS_CONFIG.useAPI = useAPI;
    console.log(`TTS: API TTS ${useAPI ? 'enabled' : 'disabled'}`);
}

// Try different voice presets for more natural sound
function tryVoicePreset(preset) {
    const presets = {
        'natural-male': { rate: 0.78, pitch: 0.95, description: 'Natural male voice' },
        'clear-female': { rate: 0.82, pitch: 1.05, description: 'Clear female voice' },
        'deep-male': { rate: 0.75, pitch: 0.85, description: 'Deep male voice' },
        'bright-female': { rate: 0.85, pitch: 1.15, description: 'Bright female voice' },
        'conversational': { rate: 0.8, pitch: 1.0, description: 'Conversational style' },
        'slow-natural': { rate: 0.7, pitch: 0.9, description: 'Slow, very natural' },
        'fast-clear': { rate: 0.9, pitch: 1.1, description: 'Fast, clear speech' }
    };

    if (presets[preset]) {
        TTS_CONFIG.rate = presets[preset].rate;
        TTS_CONFIG.pitch = presets[preset].pitch;
        console.log(`TTS: Applied ${preset} preset (${presets[preset].description}) - rate: ${TTS_CONFIG.rate}, pitch: ${TTS_CONFIG.pitch}`);
        return true;
    }
    console.log('TTS: Available presets:', Object.keys(presets).join(', '));
    return false;
}

// Test if TTS is working at all
function testTTSAvailability() {
    console.log('TTS: Testing availability...');
    console.log('TTS: speechSynthesis available:', 'speechSynthesis' in window);
    console.log('TTS: TTS_CONFIG.enabled:', TTS_CONFIG.enabled);
    console.log('TTS: Voices loaded:', ttsState.availableVoices.length);
    console.log('TTS: Selected voice:', TTS_CONFIG.voice?.name || 'none');
    console.log('TTS: Current settings - rate:', TTS_CONFIG.rate, 'pitch:', TTS_CONFIG.pitch);
    console.log('TTS: Game SFX volume:', game?.sfxVolume);
    return {
        speechSynthesis: 'speechSynthesis' in window,
        enabled: TTS_CONFIG.enabled,
        voicesLoaded: ttsState.availableVoices.length > 0,
        voiceSelected: !!TTS_CONFIG.voice,
        volumeOk: game?.sfxVolume > 0
    };
}

// Export functions for use in other modules
console.log('TTS: Creating window.TTS object');
window.TTS = {
    init: initTextToSpeech,
    speak: speakText,
    pause: pauseSpeech,
    resume: resumeSpeech,
    stop: stopSpeech,
    processContent: processManualContentForSpeech,
    getStatus: getTTSStatus,
    test: testTTS,
    testAvailability: testTTSAvailability,
    listVoices: listAvailableVoices,
    testVoice: testVoiceByIndex,
    setVoice: setVoiceByIndex,
    findVoice: findVoiceIndex,
    adjustSettings: adjustVoiceSettings,
    tryPreset: tryVoicePreset,
    checkControls: checkAudioControlsVisibility,
    // API TTS functions
    configureAPI: configureAPITTS,
    setUseAPI: setUseAPITTS
};

// Also expose TTS_CONFIG and ttsState for other modules to access
window.TTS_CONFIG = TTS_CONFIG;
window.ttsState = ttsState;

console.log('TTS: window.TTS object created:', window.TTS);

// Check if audio controls are visible in the UI
function checkAudioControlsVisibility() {
    const controls = [
        'music-volume', 'sfx-volume', 'music-theme', 'tts-voice',
        'music-loop', 'audio-mute', 'test-tts-voice'
    ];
    console.log('Checking audio controls visibility:');
    controls.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            const style = window.getComputedStyle(element);
            const parentStyle = element.parentElement ? window.getComputedStyle(element.parentElement) : null;
            console.log(`${id}: display=${style.display}, visibility=${style.visibility}, parent=${parentStyle?.display || 'none'}`);
        } else {
            console.log(`${id}: ELEMENT NOT FOUND`);
        }
    });
}

// Cycle through voices for quick testing
function cycleVoice() {
    if (ttsState.availableVoices.length === 0) {
        console.log('TTS: No voices available');
        return;
    }

    const currentIndex = ttsState.availableVoices.findIndex(v => v.name === TTS_CONFIG.voice?.name);
    const nextIndex = (currentIndex + 1) % ttsState.availableVoices.length;
    setVoiceByIndex(nextIndex);
    setTimeout(() => testTTS(), 500); // Test the new voice
}

// Make TTS available globally for console testing
if (typeof window !== 'undefined') {
    window.testTTS = testTTS;
    window.getTTSStatus = getTTSStatus;
    window.testTTSAvailability = testTTSAvailability;
    window.listVoices = listAvailableVoices;
    window.testVoice = testVoiceByIndex;
    window.setVoice = setVoiceByIndex;
    window.findVoice = findVoiceIndex;
    window.adjustVoiceSettings = adjustVoiceSettings;
    window.tryVoicePreset = tryVoicePreset;
    window.checkAudioControls = checkAudioControlsVisibility;
    window.cycleVoice = cycleVoice;
    // API TTS functions
    window.configureTTSAPI = configureAPITTS;
    window.setUseTTSAPI = setUseAPITTS;
}