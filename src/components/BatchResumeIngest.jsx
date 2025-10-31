import React, { useState, useEffect, useRef } from "react";
import "./LLMPanel.css";
import { Link } from "react-router-dom";
import AppLayout from "./AppLayout";

const BatchResumeIngest = () => {
  const [recruiterId, setRecruiterId] = useState("");
  const [jobId, setJobId] = useState("");
  const [resumeFiles, setResumeFiles] = useState([]); // multiple files
  const [jdText, setJdText] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dropRef = useRef(null);

  const API_BASE = "http://127.0.0.1:5002";

  // Drag & Drop setup
  useEffect(() => {
    const div = dropRef.current;
    if (!div) return;

    const handleDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
      div.classList.add("drag-over");
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      div.classList.remove("drag-over");
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      div.classList.remove("drag-over");
      const files = Array.from(e.dataTransfer.files);
      const pdfs = files.filter((f) => f.type === "application/pdf");
      if (pdfs.length === 0) {
        setError("Please drop only PDF files.");
        return;
      }
      setResumeFiles((prev) => [...prev, ...pdfs]);
      setError("");
    };

    div.addEventListener("dragover", handleDragOver);
    div.addEventListener("dragleave", handleDragLeave);
    div.addEventListener("drop", handleDrop);

    return () => {
      div.removeEventListener("dragover", handleDragOver);
      div.removeEventListener("dragleave", handleDragLeave);
      div.removeEventListener("drop", handleDrop);
    };
  }, []);

  // Handle manual selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const pdfs = files.filter((f) => f.type === "application/pdf");
    if (pdfs.length === 0) {
      setError("Please select PDF files only.");
      return;
    }
    setResumeFiles((prev) => [...prev, ...pdfs]);
    setError("");
  };

  const removeFile = (index) => {
    setResumeFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!recruiterId.trim() || !jobId.trim()) {
      setError("Recruiter ID and Job ID are required.");
      return;
    }
    if (resumeFiles.length === 0) {
      setError("Please upload at least one resume PDF.");
      return;
    }
    if (!jdText.trim()) {
      setError("Job Description is required.");
      return;
    }

    setError("");
    setResponse(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("recruiter_id", recruiterId);
      formData.append("job_id", jobId);
      formData.append("jd_text", jdText);

      // append multiple files
      resumeFiles.forEach((file, idx) => {
        formData.append("resume_files", file);
      });

      const res = await fetch(`${API_BASE}/batch_ingest`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status} - ${text}`);
      }

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Batch ingestion failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setRecruiterId("");
    setJobId("");
    setJdText("");
    setResumeFiles([]);
    setResponse(null);
    setError("");
  };

  return (
    <AppLayout>
      <div className="llm-container">
        <div className="llm-wrapper">
          <div className="llm-card">
            {/* Header */}
            <div className="llm-header">
              <h1 className="llm-title">📦 Batch Resume Ingest</h1>
              <p className="llm-subtitle">
                Upload multiple resumes and process them together
              </p>

              <div style={{ marginTop: 12 }}>
                <Link
                  to="/"
                  className="llm-button-secondary"
                  style={{ padding: "8px 12px", fontSize: 13 }}
                >
                  ← Back to Q&A
                </Link>
              </div>
            </div>

            {/* Form */}
            <div className="llm-body">
              {/* Recruiter ID */}
              <div className="llm-form-group">
                <label className="llm-label">Recruiter ID</label>
                <input
                  type="text"
                  className="llm-input"
                  value={recruiterId}
                  onChange={(e) => setRecruiterId(e.target.value)}
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
                />
              </div>

              {/* Drag and drop */}
              <div className="llm-form-group">
                <label className="llm-label">Resumes (PDFs)</label>
                <div
                  ref={dropRef}
                  style={{
                    border: "2px dashed #e0e7ff",
                    borderRadius: 12,
                    padding: 16,
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => document.getElementById("fileInputBatch")?.click()}
                >
                  <div style={{ fontWeight: 600 }}>
                    Drag & drop multiple PDFs here or click to select
                  </div>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>
                    Accepted: .pdf | Total: {resumeFiles.length}
                  </div>
                  <input
                    id="fileInputBatch"
                    type="file"
                    accept=".pdf"
                    multiple
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                </div>

                {/* Selected Files List */}
                {resumeFiles.length > 0 && (
                  <div
                    style={{
                      marginTop: 12,
                      border: "1px solid #e2e8f0",
                      borderRadius: 8,
                      padding: 10,
                      backgroundColor: "#f9fafb",
                    }}
                  >
                    <ul style={{ listStyle: "none", padding: 0 }}>
                      {resumeFiles.map((file, idx) => (
                        <li
                          key={idx}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 6,
                          }}
                        >
                          <span>
                            📄 {file.name} ({(file.size / 1024).toFixed(1)} KB)
                          </span>
                          <button
                            className="llm-button-secondary"
                            style={{ padding: "2px 8px" }}
                            onClick={() => removeFile(idx)}
                          >
                            ✖
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* JD Text */}
              <div className="llm-form-group">
                <label className="llm-label">Job Description</label>
                <textarea
                  className="llm-textarea"
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  placeholder="Paste the job description here..."
                />
              </div>

              {/* Buttons */}
              <div className="llm-button-group">
                <button
                  className="llm-button-primary"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Batch Ingest"}
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
                <div className="llm-error" style={{ marginTop: 12 }}>
                  ⚠️ {error}
                </div>
              )}

              {/* Response */}
              {response && (
                <div className="llm-answer-container" style={{ marginTop: 20 }}>
                  <label className="llm-label">Response</label>
                  <div
                    className="llm-answer-box"
                    style={{
                      backgroundColor: "#f9f9fb",
                      border: "1px solid #ccc",
                      borderRadius: "10px",
                      padding: "16px",
                      marginTop: "10px",
                      minHeight: "320px",
                      maxHeight: "800px",
                      overflowY: "auto",
                      fontSize: "0.95rem",
                    }}
                  >
                    <pre
                      style={{
                        fontFamily: "Menlo, monospace",
                        fontSize: "0.9rem",
                        color: "#333",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {JSON.stringify(response, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="llm-footer">
              Powered by{" "}
              <span className="llm-footer-brand">Rana LLM</span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default BatchResumeIngest;