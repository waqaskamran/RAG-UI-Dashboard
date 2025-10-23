import React, { useState, useRef, useEffect } from "react";
import "./FileUpload.css";
import { uploadFile, getUploadedFiles, deleteFile } from "../api/flaskApi";

const FileUpload = ({ sessionId }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadFiles();
  }, [sessionId]);

  const loadFiles = async () => {
    try {
      const response = await getUploadedFiles(sessionId);
      setFiles(response.files || []);
    } catch (error) {
      console.error("Error loading files:", error);
    }
  };

  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
    handleFiles(selectedFiles);
  };

  const handleFiles = async (selectedFiles) => {
    setUploading(true);
    try {
      for (const file of selectedFiles) {
        await uploadFile(sessionId, file);
      }
      await loadFiles();
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileName) => {
    try {
      await deleteFile(sessionId, fileName);
      await loadFiles();
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Failed to delete file");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="file-upload-container">
      <label className="file-upload-label">Upload Documents</label>
      
      <div
        className={`file-upload-dropzone ${dragOver ? 'dragover' : ''}`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="file-upload-icon">📁</div>
        <p className="file-upload-text">Click or drag files here to upload</p>
        <p className="file-upload-subtext">PDF, DOCX, TXT files supported</p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        className="file-upload-input"
        onChange={handleFileSelect}
        multiple
        accept=".pdf,.docx,.txt"
      />

      {uploading && (
        <div className="file-upload-progress">
          <div className="file-upload-spinner"></div>
          <span>Uploading...</span>
        </div>
      )}

      {files.length > 0 && (
        <div className="file-list">
          {files.map((file, index) => (
            <div key={index} className="file-item">
              <div className="file-item-info">
                <span>📄</span>
                <div>
                  <div className="file-item-name">{file.name}</div>
                  {file.size && (
                    <div className="file-item-size">{formatFileSize(file.size)}</div>
                  )}
                </div>
              </div>
              <button
                className="file-item-delete"
                onClick={() => handleDelete(file.name)}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;