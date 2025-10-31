import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./LLMPanel.css";
import AppLayout from "./AppLayout";

const EvaluatePanel = () => {
  const [recruiterId, setRecruiterId] = useState("");
  const [applicantId, setApplicantId] = useState("");
  const [jobId, setJobId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const API_BASE = "http://127.0.0.1:5002";

  const handleEvaluate = async () => {
    setError("");
    setResult(null);

    if (!recruiterId.trim() || !applicantId.trim() || !jobId.trim()) {
      setError("recruiter_id, applicant_id and job_id are required");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        recruiter_id: recruiterId.trim(),
        applicant_id: applicantId.trim(),
        job_id: jobId.trim()
      };

      const resp = await fetch(`${API_BASE}/evaluate_resume`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(`HTTP ${resp.status} - ${txt}`);
      }

      const data = await resp.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Evaluation failed. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setRecruiterId("");
    setApplicantId("");
    setJobId("");
    setResult(null);
    setError("");
  };

  return (
    <AppLayout>
    <div className="llm-container">
      <div className="llm-wrapper">
        <div className="llm-card">
          {/* Header */}
          <div className="llm-header">
            <h1 className="llm-title">
              <span>📊</span>
              Evaluate Resume
            </h1>
            <p className="llm-subtitle">
              Evaluate a pre-ingested resume against a job (recruiter/applicant/job)
            </p>

            {/* Link back to LLMPanel */}
            <div style={{ marginTop: 12 }}>
              <Link to="/" className="llm-button-secondary" style={{ padding: "8px 12px", fontSize: 13 }}>
                ← Back to Q&A
              </Link>
            </div>
          </div>

          {/* Body */}
          <div className="llm-body">
            {/* Recruiter ID */}
            <div className="llm-form-group">
              <label className="llm-label">Recruiter ID</label>
              <input
                type="text"
                className="llm-input"
                value={recruiterId}
                onChange={(e) => setRecruiterId(e.target.value)}
                placeholder="e.g. Rama2"
              />
            </div>

            {/* Applicant ID */}
            <div className="llm-form-group">
              <label className="llm-label">Applicant ID</label>
              <input
                type="text"
                className="llm-input"
                value={applicantId}
                onChange={(e) => setApplicantId(e.target.value)}
                placeholder="e.g. user121"
              />
            </div>

            {/* Job ID */}
            <div className="llm-form-group">
              <label className="llm-label">Job ID</label>
              <input
                type="text"
                className="llm-input"
                value={jobId}
                onChange={(e) => setJobId(e.target.value)}
                placeholder="e.g. Job2"
              />
            </div>

            {/* Buttons */}
            <div className="llm-button-group" style={{ marginTop: 8 }}>
              <button
                className="llm-button-primary"
                onClick={handleEvaluate}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="llm-spinner" />
                    <span>Evaluating...</span>
                  </>
                ) : (
                  <>
                    <span>🔎</span>
                    <span>Evaluate</span>
                  </>
                )}
              </button>

              <button
                className="llm-button-secondary"
                onClick={handleReset}
                disabled={loading}
              >
                Reset
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="llm-error" style={{ marginTop: 16 }}>
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Result */}
            <div style={{ marginTop: 18 }}>
              <label className="llm-label">Evaluation Result</label>
              <div className="llm-answer-box" style={{ minHeight: 200 }}>
                {!result && !error ? (
                  <div className="llm-answer-placeholder">
                    <div className="llm-answer-icon">💭</div>
                    <p className="llm-answer-message">Results will appear here</p>
                  </div>
                ) : result ? (
                  <div style={{ color: "#0f172a" }}>
                    <pre className="llm-answer-text" style={{ whiteSpace: "pre-wrap" }}>
{`Final Score: ${result.final_score ?? result.finalScore ?? "N/A"}
Embedding similarity: ${result.embedding_similarity ?? "N/A"}
Keyword (ATS) score: ${result.keyword_score ?? "N/A"}
LLM score: ${result.llm_score ?? "N/A"}`}</pre>

                    <div style={{ marginTop: 12 }}>
                      <strong>Matched skills:</strong>
                      <ul>
                        {(result.matched_skills || []).map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                      <strong>Missing skills (from JD):</strong>
                      <ul>
                        {(result.missing_skills || []).map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>

                    {/* Raw JSON */}
                    <div style={{ marginTop: 12 }}>
                      <details>
                        <summary style={{ cursor: "pointer" }}>Show raw response</summary>
                        <pre className="llm-answer-text">{JSON.stringify(result, null, 2)}</pre>
                      </details>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="llm-footer">
            Powered by <span className="llm-footer-brand">Rana LLM</span>
          </div>
        </div>
      </div>
    </div>
    </AppLayout>
  );
};

export default EvaluatePanel;