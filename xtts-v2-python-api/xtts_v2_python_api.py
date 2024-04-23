from flask import Flask, jsonify, request, json, send_file
from flask_cors import CORS
from TTS.tts.configs.xtts_config import XttsConfig
from TTS.tts.models.xtts import Xtts
from TTS.api import TTS
import torch
import os
import hashlib
from pathlib import Path
import rglob

# Get device
device = "cuda" if torch.cuda.is_available() else "cpu"

# # # Create config
# # config = XttsConfig()

# Init TTS
tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2", model_path="../XTTS-v2", config_path="../XTTS-v2/config.json").to(device)

# Create api
app = Flask(__name__)
# Create cors
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

out_path = Path(os.path.join(os.environ['USERPROFILE'], 'AppData', 'Local', 'tts', 'out'))
out_path.mkdir(parents=True, exist_ok=True)

@app.route('/api/tts-to-file', methods=['GET', 'POST'])
def tts_to_file():
    if request.method == 'GET':
        data = request.args

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
        text = data['Text']
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
        
    wav_file_path = Path(os.path.join(out_path, hashlib.md5(text.encode()).hexdigest() + ".wav")).as_posix();
    txt_file_path = Path(os.path.join(out_path, hashlib.md5(text.encode()).hexdigest() + ".txt")).as_posix();

    if text != None and len(text) > 0:

        try: 
            with open(txt_file_path, 'w') as f:
                f.write(text)
        except FileNotFoundError:
            print("The 'txt_file_path' directory or file does not exist")
            
        basename = os.path.basename(wav_file_path)

        tts.tts_to_file(
            text = text, 
            speaker_wav = speaker_wav, 
            language = language,
            file_path=wav_file_path)

    data = {
        'Data': data,
        'Text': text,
        'Language': language,
        'SpeakerWav': speaker_wav,
        'WavFilePath': wav_file_path,
        'TxtFilePath': txt_file_path,
        'Basename': basename
    }

    return jsonify(data)

@app.route('/api/get-wav', methods=['GET'])
def get_wav():
    data = request.args

    try: 
        file_path = data['filePath']
    except KeyError: 
        file_path = None

    if file_path == None:
        try: 
            file_path = data.parms['FilePath']
        except KeyError: 
            file_path = None

    path = Path(file_path)
    
    basename = os.path.basename(path)

    return send_file(
        file_path, 
        mimetype="audio/wav", 
        as_attachment=True,
        download_name=basename)

@app.route('/api/get-waves', methods=['GET'])
def get_waves():
    file_list = rglob.rglob(out_path, "*.wav")
    data = []
    for wav_file_path in file_list:
        wav_file_path = Path(wav_file_path).as_posix()
        txt_file_path = Path(wav_file_path).with_suffix('.txt').as_posix()
        file = open(txt_file_path, "r")
        text = file.readlines()
        file.close()
        basename = os.path.basename(wav_file_path)
        item = {
            'WavFilePath': wav_file_path,
            'TxtFilePath': txt_file_path,
            'Basename': basename,
            'Text': text
            }
        data.append(item)

    return jsonify(data)

if __name__ == '__main__':
    app.run()