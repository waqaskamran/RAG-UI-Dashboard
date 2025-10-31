import React, { useState } from "react";
import "./LLMPanel.css";

import FileUpload from "./FileUpload";
import RedisManager from "./RedisManager";
import VoiceRecorder from "./VoiceRecorder";
//import { queryText } from "./api/flaskAPI";
import { Link } from "react-router-dom";
import AppLayout from "./AppLayout";


const LLMPanel = () => {
  const [sessionId, setSessionId] = useState("user123");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_BASE = "http://127.0.0.1:5002";

  const queryText = async (sessionId, question) => {
    const response = await fetch(`${API_BASE}/ask-hybrid`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId,
        question: question
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  };

  const handleQuery = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setError("");
    setAnswer("");

    try {
      const result = await queryText(sessionId, question);
      setAnswer(result.answer || JSON.stringify(result, null, 2));
    } catch (err) {
      console.error(err);
      setError("Failed to connect with the LLM service.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setQuestion('');
    setAnswer('');
    setError('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleQuery();
    }
  };

  return (
  <AppLayout>
    <div className="llm-panel-full">
      <header className="llm-header">
        <h1 className="llm-title">
          🤖 DocuSense AI
        </h1>
        <p className="llm-subtitle">
          Ask intelligent questions about your documents
        </p>

      
      </header>

      <section className="llm-content-area">
        <div className="llm-form-section">
          <label className="llm-label">Session ID</label>
          <input
            type="text"
            className="llm-input"
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
            placeholder="Enter session ID"
          />

          <label className="llm-label" style={{ marginTop: 20 }}>
            Your Question
          </label>
          <textarea
            className="llm-textarea"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your question here... (Ctrl + Enter to submit)"
          />
          <VoiceRecorder />
        </div>

        <div className="llm-button-group">
          <button className="llm-button-primary" onClick={handleQuery} disabled={loading || !question.trim()}>
            {loading ? <>⏳ Processing...</> : <>✨ Ask Question</>}
          </button>
          <button className="llm-button-secondary" onClick={handleReset} disabled={loading}>🔄 Reset</button>
        </div>

        {error && <div className="llm-error">⚠️ {error}</div>}

        <div className="llm-answer-section">
          <label className="llm-label">Response</label>
          <div className="llm-answer-box">
            {answer ? (
              <pre>{answer}</pre>
            ) : (
              <div className="llm-placeholder">💭 Your answer will appear here</div>
            )}
          </div>
        </div>
      </section>

      <footer className="llm-footer">
        Powered by <span className="llm-footer-brand">Rana LLM</span>
      </footer>
    </div>
  </AppLayout>
  );
};

export default LLMPanel;