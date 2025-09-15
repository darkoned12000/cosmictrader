// Test TTS synthesis with Piper
console.log('Testing TTS synthesis...');

// Mock TTS_CONFIG
const TTS_CONFIG = {
    enabled: true,
    voice: { name: 'Male', voiceURI: 'en_US-joe-medium' },
    rate: 0.78,
    pitch: 0.95,
    volume: 0.85,
    useAPI: true,
    apiProvider: 'piper',
    apiKey: '',
    apiVoice: 'en_US-joe-medium',
    localTTSEndpoint: 'http://localhost:5000',
    enableCaching: true,
    cacheExpiryHours: 24
};

// Mock game object
const game = { sfxVolume: 0.8 };

// Mock ttsState
let ttsState = {
    isPlaying: false,
    isPaused: false,
    voiceCache: new Map()
};

// Mock functions
function pauseMusicForTTS() { console.log('TTS: Pausing music'); }
function resumeMusicAfterTTS() { console.log('TTS: Resuming music'); }
function updateTTSButtons(state) { console.log('TTS: Button state:', state); }
function stopSpeech() { console.log('TTS: Stopping current speech'); }

// Cache functions
function getCacheKey(text, voice, provider) {
    return `${provider}_${voice}_${text.length}`;
}

function getCachedVoice(key) {
    return ttsState.voiceCache.get(key);
}

function setCachedVoice(key, blob) {
    ttsState.voiceCache.set(key, blob);
}

// Test Piper synthesis
async function speakWithPiper(text, options = {}) {
    console.log('TTS: speakWithPiper called with text:', text.substring(0, 50) + '...');
    console.log('TTS: Using voice:', TTS_CONFIG.apiVoice);
    console.log('TTS: Endpoint:', TTS_CONFIG.localTTSEndpoint);

    const cacheKey = getCacheKey(text, TTS_CONFIG.apiVoice, 'piper');
    let audioBlob = getCachedVoice(cacheKey);

    if (!audioBlob) {
        try {
            console.log('TTS: Fetching from local Piper server...');

            // Try the Python API endpoint first
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
                        length_scale: 1.0,
                        noise_scale: 0.667,
                        noise_w: 0.8,
                        sentence_silence: 0.2
                    })
                });
                console.log('TTS: Used /synthesize endpoint');
            } catch (e) {
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
                console.log('TTS: Used /api/tts endpoint');
            }

            console.log('TTS: Response status:', response.status);
            if (!response.ok) {
                throw new Error(`Piper server error: ${response.status}`);
            }

            audioBlob = await response.blob();
            setCachedVoice(cacheKey, audioBlob);
            console.log('TTS: Voice cached from Piper, blob size:', audioBlob.size);
        } catch (error) {
            console.error('TTS: Piper error:', error);
            return false;
        }
    } else {
        console.log('TTS: Using cached Piper voice');
    }

    console.log('TTS: Creating audio element...');
    const audioUrl = URL.createObjectURL(audioBlob);
    console.log('TTS: Audio URL created:', audioUrl.substring(0, 50) + '...');

    const audio = new Audio(audioUrl);
    audio.volume = (options.volume || TTS_CONFIG.volume) * (game?.sfxVolume || 1);
    console.log('TTS: Audio volume set to:', audio.volume);

    audio.onplay = () => {
        console.log('TTS: Audio started playing');
        pauseMusicForTTS();
        ttsState.isPlaying = true;
        ttsState.isPaused = false;
        updateTTSButtons('playing');
    };

    audio.onended = () => {
        console.log('TTS: Audio finished playing');
        resumeMusicAfterTTS();
        ttsState.isPlaying = false;
        ttsState.isPaused = false;
        URL.revokeObjectURL(audioUrl);
        updateTTSButtons('stopped');
    };

    audio.onerror = () => {
        console.error('TTS: Audio playback error');
        URL.revokeObjectURL(audioUrl);
        updateTTSButtons('error');
    };

    try {
        console.log('TTS: Starting audio playback...');
        await audio.play();
        console.log('TTS: Audio play() called successfully');
        return true;
    } catch (error) {
        console.error('TTS: Audio play failed:', error);
        URL.revokeObjectURL(audioUrl);
        return false;
    }
}

// Test function
async function testTTS() {
    console.log('=== Testing TTS ===');
    const testText = "Hello, this is a test of the Piper TTS system.";
    console.log('Test text:', testText);

    const success = await speakWithPiper(testText);
    console.log('TTS result:', success ? 'SUCCESS' : 'FAILED');
}

// Run test
testTTS();