#!/usr/bin/env python3
import sys
print("Python path:", sys.path)
print("Python executable:", sys.executable)

try:
    from piper import PiperVoice
    from piper.download import ensure_voice_exists, find_voice, get_voices
    print("SUCCESS: Piper imported successfully")
    print("Available voices:", list(get_voices().keys())[:5])
except ImportError as e:
    print("ERROR: Piper import failed:", e)
    import subprocess
    result = subprocess.run([sys.executable, "-c", "import piper; print('Direct import works')"], capture_output=True, text=True)
    print("Direct import result:", result.stdout, result.stderr)