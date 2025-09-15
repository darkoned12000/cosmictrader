#!/usr/bin/env python3
"""
Piper TTS Server for CosmicTrader Game
Provides high-quality, completely free TTS using Piper neural voices.

Usage:
    python piper_server.py

Then in your game:
    configureTTSAPI('piper', 'http://localhost:5000')
    setUseTTSAPI(true)
    testTTS()
"""

import argparse
import io
import json
import logging
import os
import sys
from pathlib import Path
from typing import Optional

import numpy as np
from flask import Flask, request, send_file, jsonify
from flask_cors import CORS

# Piper imports
try:
    from piper import PiperVoice
    import piper.voice
    import wave
except ImportError as e:
    print(f"ERROR: Piper import failed: {e}")
    print("Make sure you're running with: source ~/piper_env/bin/activate")
    sys.exit(1)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests from the game

# Global voice cache
voice_cache = {}

def load_voice(voice_name: str) -> PiperVoice:
    """Load and cache Piper voice models."""
    if voice_name in voice_cache:
        return voice_cache[voice_name]

    try:
        # Check local voices folder first
        voices_dir = Path(__file__).parent / "voices"
        voice_file = voices_dir / f"{voice_name}.onnx"

        if voice_file.exists():
            logger.info(f"Loading local voice: {voice_name} from {voice_file}")
            voice = PiperVoice.load(str(voice_file))
            voice_cache[voice_name] = voice
            return voice
        else:
            logger.warning(f"Local voice {voice_name} not found in {voices_dir}")
            available_local = [f.stem for f in voices_dir.glob("*.onnx")] if voices_dir.exists() else []
            if available_local:
                logger.info(f"Available local voices: {available_local}")
            else:
                logger.warning("No local voices found. Place .onnx files in the 'voices' folder.")

        # If no local voice found, raise an error
        raise FileNotFoundError(f"Voice {voice_name} not found locally. Please place the .onnx file in the 'voices' folder.")

    except Exception as e:
        logger.error(f"Failed to load voice {voice_name}: {e}")
        raise

@app.route('/synthesize', methods=['POST'])
def synthesize():
    """Synthesize speech using Piper Python API."""
    try:
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({'error': 'Missing text field'}), 400

        text = data['text']
        voice_name = data.get('voice', 'en_US-amy-medium')

        logger.info(f"Synthesizing: '{text[:50]}...' with voice {voice_name}")

        # Load voice
        voice = load_voice(voice_name)

        # Create WAV file in memory
        wav_buffer = io.BytesIO()
        with wave.open(wav_buffer, 'wb') as wav_file:
            wav_file.setnchannels(1)  # Mono
            wav_file.setsampwidth(2)  # 16-bit
            wav_file.setframerate(voice.config.sample_rate)  # Use voice's sample rate

            # Synthesize audio
            voice.synthesize_wav(text, wav_file)

        wav_buffer.seek(0)

        return send_file(
            wav_buffer,
            mimetype='audio/wav',
            as_attachment=True,
            download_name='tts_output.wav'
        )

    except Exception as e:
        logger.error(f"Synthesis error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/tts', methods=['POST'])
def api_tts():
    """Legacy API endpoint for compatibility."""
    try:
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({'error': 'Missing text field'}), 400

        text = data['text']
        voice_name = data.get('voice', 'en_US-amy-medium')

        logger.info(f"Legacy API: '{text[:50]}...' with voice {voice_name}")

        # Load voice
        voice = load_voice(voice_name)

        # Create WAV file in memory
        wav_buffer = io.BytesIO()
        with wave.open(wav_buffer, 'wb') as wav_file:
            wav_file.setnchannels(1)  # Mono
            wav_file.setsampwidth(2)  # 16-bit
            wav_file.setframerate(voice.config.sample_rate)  # Use voice's sample rate

            # Synthesize audio
            voice.synthesize_wav(text, wav_file)

        wav_buffer.seek(0)

        return send_file(
            wav_buffer,
            mimetype='audio/wav',
            as_attachment=True,
            download_name='tts_output.wav'
        )

    except Exception as e:
        logger.error(f"Legacy API error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/voices', methods=['GET'])
def list_voices():
    """List available voices."""
    try:
        # List local voices
        voices_dir = Path(__file__).parent / "voices"
        local_voices = []
        if voices_dir.exists():
            local_voices = [f.stem for f in voices_dir.glob("*.onnx")]

        return jsonify({
            'voices': local_voices,
            'loaded': list(voice_cache.keys()),
            'voices_dir': str(voices_dir)
        })
    except Exception as e:
        logger.error(f"Error listing voices: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'voices_loaded': len(voice_cache),
        'version': '1.0.0'
    })

def main():
    parser = argparse.ArgumentParser(description='Piper TTS Server for CosmicTrader')
    parser.add_argument('--host', default='localhost', help='Host to bind to')
    parser.add_argument('--port', type=int, default=5000, help='Port to bind to')
    parser.add_argument('--voice', default='en_US-amy-medium',
                       help='Default voice to preload')
    parser.add_argument('--debug', action='store_true', help='Enable debug mode')

    args = parser.parse_args()

    if args.debug:
        logging.getLogger().setLevel(logging.DEBUG)

    # Check for local voices
    voices_dir = Path(__file__).parent / "voices"
    if voices_dir.exists():
        voice_files = list(voices_dir.glob("*.onnx"))
        logger.info(f"Found {len(voice_files)} local voice files in {voices_dir}:")
        for vf in voice_files:
            logger.info(f"  - {vf.stem}")
    else:
        logger.warning(f"Local voices directory not found: {voices_dir}")

    # Preload default voice
    try:
        logger.info(f"Preloading voice: {args.voice}")
        load_voice(args.voice)
        logger.info("Voice preloaded successfully")
    except Exception as e:
        logger.warning(f"Could not preload voice {args.voice}: {e}")
        logger.info("Check that voice files exist in the 'voices' folder")

    logger.info(f"Starting Piper TTS Server on {args.host}:{args.port}")
    logger.info("Available endpoints:")
    logger.info("  POST /synthesize - Direct Python API synthesis")
    logger.info("  POST /api/tts - Legacy HTTP API")
    logger.info("  GET /voices - List available voices")
    logger.info("  GET /health - Health check")
    logger.info("")
    logger.info("Configure your game with:")
    logger.info(f"  configureTTSAPI('piper', 'http://{args.host}:{args.port}', '{args.voice}')")
    logger.info("  setUseTTSAPI(true)")
    logger.info("  testTTS()")

    app.run(host=args.host, port=args.port, debug=args.debug)

if __name__ == '__main__':
    main()