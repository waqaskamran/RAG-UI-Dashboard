import React, { useState, useRef } from "react";
import axios from "axios";


export default function VoiceRecorder() {
  const [recording, setRecording] = useState(false);
  const [response, setResponse] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const speachRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const options = { mimeType: "audio/webm;codecs=opus" };
      mediaRecorderRef.current = new MediaRecorder(stream, options);

      audioChunksRef.current = [];
      mediaRecorderRef.current.start();
      setRecording(true);

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;

    setRecording(false);
    mediaRecorderRef.current.stop();

    mediaRecorderRef.current.onstop = async () => {
      if (audioChunksRef.current.length === 0) return;

      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const formData = new FormData();
      formData.append("file", audioBlob, "voice.webm");

      try {
        const res = await axios.post("http://127.0.0.1:5000/voice-query", formData);
        setResponse(res.data);

        if (res.data.rag_response) {
          speak(res.data.rag_response);
        }
      } catch (err) {
        console.error("Error sending audio to backend:", err);
      }
    };
  };

  const speak = (text) => {
    //Window.speechSynthesis.cancel(); 
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    speachRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
      window.speechSynthesis.cancel();
      speachRef.current= null;
    }

  return (
    <div>
      <button onClick={recording ? stopRecording : startRecording}>
        {recording ? "⏹ Stop" : "🎤 Record"}
      </button>
      <button onClick={stopSpeaking}>
        🛑 Stop Speaking
      </button>

      {response && (
        <div style={{ marginTop: "1rem" }}>
          <p><strong>Transcribed Text:</strong> {response.transcription}</p>
          <p><strong>RAG Response:</strong> {response.rag_response}</p>
        </div>
      )}
    </div>
  );
}
