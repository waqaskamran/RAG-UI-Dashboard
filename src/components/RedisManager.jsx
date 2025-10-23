import React, { useState, useEffect } from "react";
import "./RedisManager.css";
import {
  setSessionData,
  getSessionData,
  getAllSessionKeys,
  deleteSessionKey,
  clearSession
} from "../api/redisAPI";

const RedisManager = ({ sessionId }) => {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [sessionId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await getAllSessionKeys(sessionId);
      setData(response.data || []);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSet = async () => {
    if (!key.trim() || !value.trim()) return;

    try {
      await setSessionData(sessionId, key, value);
      setKey("");
      setValue("");
      await loadData();
    } catch (error) {
      console.error("Error setting data:", error);
      alert("Failed to save data");
    }
  };

  const handleDelete = async (keyToDelete) => {
    try {
      await deleteSessionKey(sessionId, keyToDelete);
      await loadData();
    } catch (error) {
      console.error("Error deleting key:", error);
      alert("Failed to delete key");
    }
  };

  const handleClear = async () => {
    if (!window.confirm("Are you sure you want to clear all session data?")) {
      return;
    }

    try {
      await clearSession(sessionId);
      await loadData();
    } catch (error) {
      console.error("Error clearing session:", error);
      alert("Failed to clear session");
    }
  };

  return (
    <div className="redis-manager-container">
      <label className="redis-manager-label">Session Data (Redis)</label>

      <div className="redis-form">
        <input
          type="text"
          className="redis-input"
          placeholder="Key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
        <input
          type="text"
          className="redis-input"
          placeholder="Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button
          className="redis-button"
          onClick={handleSet}
          disabled={!key.trim() || !value.trim()}
        >
          Save
        </button>
      </div>

      <div className="redis-data-list">
        {data.length === 0 ? (
          <div className="redis-empty">
            {loading ? "Loading..." : "No session data stored"}
          </div>
        ) : (
          data.map((item, index) => (
            <div key={index} className="redis-data-item">
              <div className="redis-data-content">
                <div className="redis-data-key">{item.key}</div>
                <div className="redis-data-value">{item.value}</div>
              </div>
              <button
                className="redis-data-delete"
                onClick={() => handleDelete(item.key)}
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      {data.length > 0 && (
        <div className="redis-actions">
          <button
            className="redis-button redis-button-secondary"
            onClick={loadData}
          >
            🔄 Refresh
          </button>
          <button
            className="redis-button redis-button-secondary"
            onClick={handleClear}
            style={{ color: '#ef4444' }}
          >
            🗑️ Clear All
          </button>
        </div>
      )}
    </div>
  );
};

export default RedisManager;