import React, { useState } from "react";
import { indexText } from "../api/flaskApi";

const UploadPanel = () => {
  const [sessionId, setSessionId] = useState("user123");
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    try {
      const res = await indexText(sessionId, text);
      setMessage(res.data.message);
    } catch (err) {
      setMessage("Error uploading text");
    }
  };

  return (
    <div className="p-4 border rounded-xl shadow bg-white">
      <h2 className="text-xl font-bold mb-3">Upload Resume / Document</h2>
      <input
        className="border p-2 w-full mb-3"
        value={sessionId}
        onChange={(e) => setSessionId(e.target.value)}
        placeholder="Session ID"
      />
      <textarea
        className="border p-2 w-full mb-3"
        rows={5}
        placeholder="Paste resume text..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Upload
      </button>
      {message && <p className="mt-3 text-green-700">{message}</p>}
    </div>
  );
};

export default UploadPanel;
