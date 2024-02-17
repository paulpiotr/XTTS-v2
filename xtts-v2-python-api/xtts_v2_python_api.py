import re
from flask import Flask, jsonify, request, json
from flask_cors import CORS
from TTS.tts.configs.xtts_config import XttsConfig
from TTS.tts.models.xtts import Xtts
from TTS.api import TTS
import torch
import keyboard
import playsound
import hashlib

# Get device
device = "cuda" if torch.cuda.is_available() else "cpu"

# # Create config
# config = XttsConfig()

# Init TTS
tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2", model_path="../XTTS-v2", config_path="../XTTS-v2/config.json").to(device)

# Create api
app = Flask(__name__)
# Create cors
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route('/api/tts-to-file', methods=['GET', 'POST'])
def get_tts_to_file():
    if request.method == 'GET':
        data = request.parms

    if request.method == 'POST':
        data = request.get_json()
        
    try: 
        language = data['language']
    except KeyError: 
        language = None

    if language == None:
        try: 
            language = data['Language']
        except KeyError: 
            language = None
            
    try: 
        text = data['text']
    except KeyError: 
        text = None

    if text == None:
        try: 
            text = data['Text']
        except KeyError: 
            text = None
            
    try: 
        speaker_wav = data['speakerWav']
    except KeyError: 
        speaker_wav = None

    if speaker_wav == None:
        try: 
            speaker_wav = data['SpeakerWav']
        except KeyError: 
            speaker_wav = None
            
    try: 
        file_path = data['filePath']
    except KeyError: 
        file_path = None

    if file_path == None:
        try: 
            file_path = data['FilePath']
        except KeyError: 
            file_path = None

    if file_path != None and len(file_path) == 0:
        file_path = hashlib.md5(file_path.encode()).hexdigest() + ".wav"
        
    if file_path == None and text != None and len(text) > 0:
        file_path = hashlib.md5(text.encode()).hexdigest() + ".wav"

    if text != None and len(text) > 0:
        tts.tts_to_file(
            text = text, 
            speaker_wav = speaker_wav, 
            language = language,
            file_path=file_path)

    data = {
        'data': data,
        'text': text,
        'language': language,
        'speakerWav': speaker_wav,
        'filePath': file_path
    }

    return jsonify(data)

if __name__ == '__main__':
    app.run()