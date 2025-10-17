import React, { useState } from "react";

const LLMPanel = () => {
  const [sessionId, setSessionId] = useState("user123");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // flaskAPI.js inline
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
    <div style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      padding: '40px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden',
          height: '700px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '30px',
            color: 'white'
          }}>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '700',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span>🤖</span>
              Rana LLM Assistant
            </h1>
            <p style={{ opacity: 0.9, fontSize: '14px', margin: 0 }}>
              Ask intelligent questions about your documents
            </p>
          </div>

          {/* Body */}
          <div style={{
            padding: '30px',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            
            {/* Session ID */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: '#667eea',
                marginBottom: '8px'
              }}>
                Session ID
              </label>
              <input
                type="text"
                value={sessionId}
                onChange={(e) => setSessionId(e.target.value)}
                placeholder="Enter session ID"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e0e7ff',
                  borderRadius: '12px',
                  fontSize: '15px',
                  transition: 'all 0.3s ease',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e0e7ff'}
              />
            </div>

            {/* Question */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: '#667eea',
                marginBottom: '8px'
              }}>
                Your Question
              </label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your question here... (Ctrl + Enter to submit)"
                style={{
                  width: '100%',
                  height: '100px',
                  padding: '12px 16px',
                  border: '2px solid #e0e7ff',
                  borderRadius: '12px',
                  fontSize: '15px',
                  resize: 'none',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e0e7ff'}
              />
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
              <button
                onClick={handleQuery}
                disabled={loading || !question.trim()}
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: loading || !question.trim() ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  background: loading || !question.trim() ? '#94a3b8' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {loading ? (
                  <>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderTopColor: 'white',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite'
                    }} />
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
                onClick={handleReset}
                disabled={loading}
                style={{
                  padding: '12px 24px',
                  border: '2px solid #e0e7ff',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  background: 'white',
                  color: '#667eea',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  opacity: loading ? 0.5 : 1
                }}
              >
                <span>🔄</span>
                <span>Reset</span>
              </button>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                padding: '12px 16px',
                borderRadius: '12px',
                marginBottom: '20px',
                background: '#fee2e2',
                border: '2px solid #fca5a5',
                color: '#991b1b',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Answer */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              <label style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: '#667eea',
                marginBottom: '8px'
              }}>
                Response
              </label>
              <div style={{
                flex: 1,
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                border: '2px solid #e0e7ff',
                borderRadius: '12px',
                padding: '20px',
                overflow: 'auto',
                minHeight: '200px'
              }}>
                {answer ? (
                  <pre style={{
                    margin: 0,
                    fontFamily: 'Monaco, Consolas, monospace',
                    fontSize: '13px',
                    color: '#334155',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word'
                  }}>
                    {answer}
                  </pre>
                ) : (
                  <div style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#94a3b8',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>💭</div>
                    <p style={{ margin: 0 }}>Your answer will appear here</p>
                    <p style={{ fontSize: '12px', marginTop: '4px', margin: 0 }}>Ask a question to get started</p>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Footer */}
          <div style={{
            padding: '16px',
            textAlign: 'center',
            background: '#f8fafc',
            borderTop: '1px solid #e0e7ff',
            fontSize: '13px',
            color: '#64748b'
          }}>
            Powered by <span style={{ color: '#667eea', fontWeight: '600' }}>Rana LLM</span> Service
          </div>

        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LLMPanel;