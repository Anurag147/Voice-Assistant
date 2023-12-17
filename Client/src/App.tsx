import React, { useState } from 'react';
import { getTokenOrRefresh } from './token';
import './Custom.css'
import { ResultReason } from 'microsoft-cognitiveservices-speech-sdk';

const speechsdk = require('microsoft-cognitiveservices-speech-sdk')

export default function App() { 
    const [displayText, setDisplayText] = useState('INITIALIZED: ready to test speech...');

    async function listen() {
        const tokenObj = await getTokenOrRefresh();
        const speechConfig = speechsdk.SpeechConfig.fromAuthorizationToken(tokenObj.authToken, tokenObj.region);
        speechConfig.speechRecognitionLanguage = 'en-US';
        
        const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
        const recognizer = new speechsdk.SpeechRecognizer(speechConfig, audioConfig);

        setDisplayText('speak into your microphone...');

        recognizer.recognizeOnceAsync((result:any) => {
            if (result.reason === ResultReason.RecognizedSpeech) {
                setDisplayText(`RECOGNIZED: Text=${result.text}`);
            } else {
                setDisplayText('ERROR: Speech was cancelled or could not be recognized. Ensure your microphone is working properly.');
            }
        });
    }

    return (
        <div className="app-container">
            <h1 className="display-4 mb-3">Speech sample app</h1>

            <div className="row main-container">
                <div className="col-6">
                    <button className="fas fa-microphone fa-lg mr-2" onClick={() => listen()}>Start Speaking</button>
                    
                </div>
                <div className="col-6 output-display rounded">
                    <code>{displayText}</code>
                </div>
            </div>
        </div>
    );
}