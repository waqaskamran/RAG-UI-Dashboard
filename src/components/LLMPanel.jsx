import React, { useState } from "react";
import "./LLMPanel.css";

import FileUpload from "./FileUpload";
import RedisManager from "./RedisManager";
import VoiceRecorder from "./VoiceRecorder";
//import { queryText } from "./api/flaskAPI";
import { Link } from "react-router-dom";


const LLMPanel = () => {
  const [sessionId, setSessionId] = useState("user123");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_BASE = "http://127.0.0.1:5000";

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
    <div className="llm-container">
      <div className="llm-wrapper">
        <div className="llm-card">

          {/* Header */}
          <div className="llm-header">
            <h1 className="llm-title">
              <span>🤖</span>
              DocuSense AI
            </h1>
            <p className="llm-subtitle">
              Ask intelligent questions about your documents
            </p>


            <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
              <Link to="/ingest" className="llm-button-secondary" style={{ padding: "8px 12px", fontSize: 13 }}>
                📄 Ingest
              </Link>
              
              <Link
                to="/batch-ingest"
                className="llm-button-secondary"
                style={{ padding: "8px 12px", fontSize: 13 }}
              >
                🗂️ Batch Ingest
              </Link>

              <Link to="/evaluate" className="llm-button-secondary" style={{ padding: "8px 12px", fontSize: 13 }}>
                📊 Evaluate
              </Link>

              <Link to="/batch-evaluate" className="llm-button-secondary" style={{ padding: "8px 12px", fontSize: 13 }}>
               🗃️ Batch Evaluate
             </Link>                
            </div>

          </div>

          {/* Body */}
          <div className="llm-body">

            {/* Session ID */}
            <div className="llm-form-group">
              <label className="llm-label">
                Session ID
              </label>
              <input
                type="text"
                className="llm-input"
                value={sessionId}
                onChange={(e) => setSessionId(e.target.value)}
                placeholder="Enter session ID"
                style={{ fontSize: '16px' }}
              />
            </div>

            {/* Question */}
            <div className="llm-form-group">
              <label className="llm-label">
                Your Question
              </label>
              <textarea
                className="llm-textarea"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your question here... (Ctrl + Enter to submit)"
                style={{ fontSize: '16px' }}
              />

              <VoiceRecorder />
            </div>

            {/* Buttons */}
            <div className="llm-button-group">
              <button
                className="llm-button-primary"
                onClick={handleQuery}
                disabled={loading || !question.trim()}
              >
                {loading ? (
                  <>
                    <div className="llm-spinner" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>✨</span>
                    <span>Ask Question</span>
                  </>
                )}
              </button>

              <button
                className="llm-button-secondary"
                onClick={handleReset}
                disabled={loading}
              >
                <span>🔄</span>
                <span>Reset</span>
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="llm-error">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Answer */}
            <div className="llm-answer-container">
              <label className="llm-label">
                Response
              </label>
              <div className="llm-answer-box">
                {answer ? (
                  <pre className="llm-answer-text">
                    {answer}
                  </pre>
                ) : (
                  <div className="llm-answer-placeholder">
                    <div className="llm-answer-icon">💭</div>
                    <p className="llm-answer-message">Your answer will appear here</p>
                    <p className="llm-answer-submessage">Ask a question to get started</p>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="llm-footer">
            Powered by <span className="llm-footer-brand">Rana LLM</span> Service
          </div>

        </div>
      </div>
    </div>
  );
};

export default LLMPanel;