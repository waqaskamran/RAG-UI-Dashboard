import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./LLMPanel.css";

const EvaluateBatchPanel = () => {
  const [recruiterId, setRecruiterId] = useState("");
  const [jobId, setJobId] = useState("");
  const [mode, setMode] = useState("auto");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState(null);
  const [detailsLoadingMap, setDetailsLoadingMap] = useState({});


  // Toggle for showing inline details
  const [showDetailsMap, setShowDetailsMap] = useState({});

  const API_BASE = "http://127.0.0.1:5000";

  const handleEvaluateBatch = async () => {
    setError("");
    setSummary(null);

    if (!recruiterId.trim() || !jobId.trim()) {
      setError("recruiter_id and job_id are required");
      return;
    }

    setLoading(true);
    try {
      const payload = { recruiter_id: recruiterId.trim(), job_id: jobId.trim(), mode };

      const resp = await fetch(`${API_BASE}/evaluate_batch_summary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(`HTTP ${resp.status} - ${txt}`);
      }

      const data = await resp.json();
      setSummary(data);
    } catch (err) {
      console.error(err);
      setError("Batch evaluation failed. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDetails = async (fileName) => {
  const isAlreadyShown = showDetailsMap[fileName];

  if (!isAlreadyShown) {
    
    setDetailsLoadingMap((prev) => ({ ...prev, [fileName]: true }));

    await handleGetFullInfo(fileName);

    
    setDetailsLoadingMap((prev) => ({ ...prev, [fileName]: false }));
  } else {
    setShowDetailsMap((prev) => ({ ...prev, [fileName]: false }));
  }
};


  const handleGetFullInfo = async (fileName) => {
  try {
    const payload = { recruiter_id: recruiterId.trim(), job_id: jobId.trim(), file_name: fileName };
    const resp = await fetch(`${API_BASE}/get_resume_skill_details`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await resp.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    // Update summary results dynamically
    setSummary((prev) => {
      if (!prev?.results) return prev;
      const updatedResults = prev.results.map((r) =>
        r.file_name === fileName
          ? { ...r, llm_score: data.llm_score, matched_skills: data.matched_skills, missing_skills: data.missing_skills }
          : r
      );
      return { ...prev, results: updatedResults };
    });

    // Show inline details
    setShowDetailsMap((prev) => ({ ...prev, [fileName]: true }));
  } catch (err) {
    console.error("Error fetching resume skill details:", err);
  }
};

  return (
    <div className="llm-container">
      <div className="llm-wrapper">
        <div className="llm-card">
          {/* Header */}
          <div className="llm-header">
            <h1 className="llm-title">
              <span>📦</span> Batch Evaluation Summary
            </h1>
            <p className="llm-subtitle">Evaluate all resumes ingested for a recruiter/job</p>
            <div style={{ marginTop: 12 }}>
              <Link to="/" className="llm-button-secondary" style={{ padding: "8px 12px", fontSize: 13 }}>
                ← Back to Q&A
              </Link>
            </div>
          </div>

          {/* Body */}
          <div className="llm-body">
            {/* Inputs */}
            <div className="llm-form-group">
              <label className="llm-label">Recruiter ID</label>
              <input
                type="text"
                className="llm-input"
                value={recruiterId}
                onChange={(e) => setRecruiterId(e.target.value)}
                placeholder="e.g. Rama3"
              />
            </div>

            <div className="llm-form-group">
              <label className="llm-label">Job ID</label>
              <input
                type="text"
                className="llm-input"
                value={jobId}
                onChange={(e) => setJobId(e.target.value)}
                placeholder="e.g. job3"
              />
            </div>

            {/* Mode Dropdown */}
            <div className="llm-form-group">
              <label className="llm-label">Mode</label>
              <select className="llm-input" value={mode} onChange={(e) => setMode(e.target.value)}>
                <option value="auto">Auto</option>
                <option value="fast">Fast</option>
                <option value="full">Full</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="llm-button-group" style={{ marginTop: 8 }}>
              <button className="llm-button-primary" onClick={handleEvaluateBatch} disabled={loading}>
                {loading ? (
                  <>
                    <div className="llm-spinner" />
                    <span>Evaluating...</span>
                  </>
                ) : (
                  <>
                    <span>📊</span>
                    <span>Evaluate Batch</span>
                  </>
                )}
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="llm-error" style={{ marginTop: 16 }}>
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Summary Cards */}
            {summary && summary.results && summary.results.length > 0 && (
              <div style={{ marginTop: 16 }}>
                {summary.results.map((r) => {
                  const showDetails = showDetailsMap[r.file_name] || false;

                  return (
                    <div
                      key={r.file_name}
                      className="llm-answer-box"
                      style={{
                        backgroundColor: "#f9f9fb",
                        border: "1px solid #ccc",
                        borderRadius: 12,
                        padding: 16,
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                        marginBottom: 10,
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <strong>File:</strong> {r.file_name}
                        </div>
                        <div>
                          <strong>Final Score:</strong> {r.final_score}
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: 12 }}>
                        <div>
                          <strong>Embedding:</strong> {r.embedding_similarity}
                        </div>
                        <div>
                          <strong>Keyword:</strong> {r.keyword_score}
                        </div>
                        <div>
                          <strong>LLM:</strong> {r.llm_score}
                        </div>
                      </div>

               <button
                     className="llm-button-secondary"
                     style={{ marginTop: 8, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}
                     onClick={() => handleToggleDetails(r.file_name)}
                     disabled={detailsLoadingMap[r.file_name]}  >
                {detailsLoadingMap[r.file_name] ? (
                <>
                <div className="llm-spinner" style={{ width: 16, height: 16 }} /> Loading...
                 </>
             ) : showDetailsMap[r.file_name] ? (
             "🔽 Hide Details"
             ) : (
             "🔍 View Full Info"
            )}
              </button>


                      {showDetails && r.matched_skills && r.missing_skills && (
                        <div style={{ marginTop: 8 }}>
                          <div>
                            <strong>Matched Skills:</strong>
                            <ul className="list-disc list-inside text-green-700">
                              {r.matched_skills.map((s, i) => (
                                <li key={i}>{s}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <strong>Missing Skills:</strong>
                            <ul className="list-disc list-inside text-red-700">
                              {r.missing_skills.map((s, i) => (
                                <li key={i}>{s}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="llm-footer">
            Powered by <span className="llm-footer-brand">Rana LLM</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluateBatchPanel;
