import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./LLMPanel.css";
import AppLayout from "./AppLayout";

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

  const API_BASE = "http://127.0.0.1:5002";

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
    <AppLayout>
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
  <div style={{ marginTop: 12, padding: 12, backgroundColor: "#fff", borderRadius: 8, border: "1px solid #e0e0e0" }}>
    
    {/* Assessment Section */}
    {r.assessment && (
      <div style={{ marginBottom: 16, padding: 12, backgroundColor: "#f0f7ff", borderRadius: 6 }}>
        <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: "#1e40af" }}>
          📋 Assessment
        </h4>
        <div style={{ fontSize: 13, marginBottom: 6 }}>
          <strong>Recommendation:</strong> <span style={{ color: "#059669" }}>{r.assessment.recommendation}</span>
        </div>
        <div style={{ fontSize: 13, marginBottom: 6 }}>
          <strong>Reasoning:</strong> {r.assessment.reasoning}
        </div>
        
        {r.assessment.strengths && r.assessment.strengths.length > 0 && (
          <div style={{ fontSize: 13, marginTop: 8 }}>
            <strong style={{ color: "#059669" }}>💪 Strengths:</strong>
            <span style={{ marginLeft: 6 }}>
              {r.assessment.strengths.map((s, i) => (
                <span key={i} style={{ 
                  display: "inline-block", 
                  padding: "2px 8px", 
                  margin: "2px", 
                  backgroundColor: "#d1fae5", 
                  borderRadius: 4, 
                  fontSize: 12 
                }}>
                  {s}
                </span>
              ))}
            </span>
          </div>
        )}
        
        {r.assessment.concerns && r.assessment.concerns.length > 0 && (
          <div style={{ fontSize: 13, marginTop: 8 }}>
            <strong style={{ color: "#dc2626" }}>⚠️ Concerns:</strong>
            <span style={{ marginLeft: 6 }}>
              {r.assessment.concerns.map((s, i) => (
                <span key={i} style={{ 
                  display: "inline-block", 
                  padding: "2px 8px", 
                  margin: "2px", 
                  backgroundColor: "#fee2e2", 
                  borderRadius: 4, 
                  fontSize: 12 
                }}>
                  {s}
                </span>
              ))}
            </span>
          </div>
        )}
      </div>
    )}

    {/* Matched Skills */}
    <div style={{ marginBottom: 12 }}>
      <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: "#059669" }}>
        ✅ Matched Skills ({r.matched_skills.length})
      </h4>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {r.matched_skills.map((skillObj, i) => (
          <div
            key={i}
            style={{
              padding: "6px 12px",
              backgroundColor: "#d1fae5",
              border: "1px solid #6ee7b7",
              borderRadius: 6,
              fontSize: 13,
              display: "flex",
              alignItems: "center",
              gap: 6
            }}
          >
            <span style={{ fontWeight: 500 }}>{skillObj.skill}</span>
            <span style={{ 
              fontSize: 11, 
              padding: "2px 6px", 
              backgroundColor: "#059669", 
              color: "white", 
              borderRadius: 4 
            }}>
              {skillObj.match_type}
            </span>
          </div>
        ))}
      </div>
    </div>

    {/* Missing Skills */}
    {r.missing_skills && r.missing_skills.length > 0 && (
      <div>
        <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: "#dc2626" }}>
          ❌ Missing Skills ({r.missing_skills.length})
        </h4>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {r.missing_skills.map((skillObj, i) => (
            <div
              key={i}
              style={{
                padding: "6px 12px",
                backgroundColor: "#fee2e2",
                border: "1px solid #fca5a5",
                borderRadius: 6,
                fontSize: 13,
                display: "flex",
                alignItems: "center",
                gap: 6
              }}
            >
              <span style={{ fontWeight: 500 }}>{skillObj.skill}</span>
              <span style={{ 
                fontSize: 11, 
                padding: "2px 6px", 
                backgroundColor: skillObj.priority === "required" ? "#dc2626" : "#f59e0b", 
                color: "white", 
                borderRadius: 4 
              }}>
                {skillObj.priority}
              </span>
            </div>
          ))}
        </div>
      </div>
    )}
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
    </AppLayout>
  );
};

export default EvaluateBatchPanel;
