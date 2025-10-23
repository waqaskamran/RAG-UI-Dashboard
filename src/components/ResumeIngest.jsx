import React, { useEffect, useState, useRef } from "react";
import "./LLMPanel.css";
import { Link } from "react-router-dom";


const ResumeIngest = () => {
  const [recruiterId, setRecruiterId] = useState("");
  const [applicantId, setApplicantId] = useState("");
  const [jobId, setJobId] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [jdText, setJdText] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");

  const API_BASE = "http://127.0.0.1:5000";
  const dropRef = useRef(null);

  // Create and clean up preview URL
  useEffect(() => {
    if (resumeFile) {
      const url = URL.createObjectURL(resumeFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl("");
    }
  }, [resumeFile]);

  // Drag & drop handlers
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
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (file.type !== "application/pdf") {
          setError("Please upload a PDF file only.");
          return;
        }
        setResumeFile(file);
        setError("");
      }
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

  const handleFileChange = (e) => {
    setError("");
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    if (f.type !== "application/pdf") {
      setError("Please select a PDF file.");
      return;
    }
    setResumeFile(f);
  };

  const removeFile = () => {
    setResumeFile(null);
    setPreviewUrl("");
  };

  const handleSubmit = async () => {
    // Front-end validation
    if (!recruiterId.trim() || !applicantId.trim() || !jobId.trim()) {
      setError("Recruiter ID, Applicant ID, and Job ID are required.");
      return;
    }
    if (!resumeFile) {
      setError("Resume PDF is required.");
      return;
    }
    if (!jdText.trim()) {
      setError("Job Description is required.");
      return;
    }

    setLoading(true);
    setError("");
    setResponse(null);

    try {
      const formData = new FormData();
      formData.append("recruiter_id", recruiterId.trim());
      formData.append("applicant_id", applicantId.trim());
      formData.append("job_id", jobId.trim());
      formData.append("resume_file", resumeFile);        // backend expects this key
      formData.append("jd_text", jdText.trim()); // backend expects this key

      // Debug: log entries (File will show as File object)
      for (let pair of formData.entries()) {
        // eslint-disable-next-line no-console
        console.log(pair[0], pair[1]);
      }

      const res = await fetch(`${API_BASE}/ingest_documents`, {
        method: "POST",
        body: formData, // DO NOT set Content-Type header
      });

      if (!res.ok) {
        // Attempt to parse error body
        let txt = await res.text();
        throw new Error(`HTTP ${res.status} - ${txt}`);
      }

      const data = await res.json();
      setResponse(data);
      setError("");
    } catch (err) {
      console.error(err);
      // If backend responds with JSON message, show it
      const msg = err.message || "Failed to ingest documents.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setRecruiterId("");
    setApplicantId("");
    setJobId("");
    setResumeFile(null);
    setJdText("");
    setResponse(null);
    setError("");
  };

  return (
    <div className="llm-container">
      <div className="llm-wrapper">
        <div className="llm-card">
          {/* Header */}
          <div className="llm-header">
            <h1 className="llm-title">
              <span>📄</span> Ingest Documents
            </h1>
            <p className="llm-subtitle">Upload Resume and provide Job Description</p>

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

            {/* Drag & Drop area */}
            <div className="llm-form-group">
              <label className="llm-label">Resume (PDF)</label>

              <div
                ref={dropRef}
                style={{
                  border: "2px dashed #e0e7ff",
                  borderRadius: 12,
                  padding: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  cursor: "pointer",
                }}
                onClick={() => document.getElementById("fileInput")?.click()}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ fontSize: 18 }}>📎</div>
                  <div>
                    <div style={{ fontWeight: 600 }}>
                      {resumeFile ? resumeFile.name : "Drag & drop PDF here, or click to select"}
                    </div>
                    <div style={{ fontSize: 12, color: "#94a3b8" }}>
                      {resumeFile ? `${(resumeFile.size / 1024).toFixed(1)} KB` : "Accepted: .pdf"}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  {resumeFile && (
                    <button
                      className="llm-button-secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile();
                      }}
                    >
                      Remove
                    </button>
                  )}
                  <input
                    id="fileInput"
                    type="file"
                    accept=".pdf"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              {/* Preview */}
              {previewUrl && (
                <div style={{ marginTop: 12 }}>
                  <label className="llm-label">Preview</label>
                  <div style={{ borderRadius: 8, overflow: "hidden", border: "2px solid #e0e7ff" }}>
                    <iframe
                      title="pdf-preview"
                      src={previewUrl}
                      width="100%"
                      height="320px"
                      style={{ border: "none" }}
                    />
                  </div>
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
                {loading ? (
                  <>
                    <div className="llm-spinner" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>📥</span>
                    <span>Ingest Documents</span>
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
              <div className="llm-error" style={{ marginTop: 12 }}>
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Response */}
            {response && (
            <div className="llm-answer-container" style={{ marginTop: 20 }}>
             <label className="llm-label" style={{ fontSize: "1.1rem", fontWeight: "600" }}>
             🧾 Response
             </label>
             <div
              className="llm-answer-box"
              style={{
             backgroundColor: "#f9f9fb",
             border: "1px solid #ccc",
             borderRadius: "10px",
             padding: "16px",
             marginTop: "10px",
             minHeight: "320px",    // increased minimum height
             maxHeight: "800px",   
             overflowY: "auto",    
             fontSize: "0.95rem",
             lineHeight: "1.5",
             whiteSpace: "pre-wrap",
      }}
    >
      <pre
        className="llm-answer-text"
        style={{
          fontFamily: "Menlo, monospace",
          fontSize: "0.9rem",
          color: "#333",
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
            Powered by <span className="llm-footer-brand">Rana LLM</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeIngest;