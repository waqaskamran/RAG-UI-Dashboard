import axios from "axios";

const API_BASE = "http://127.0.0.1:5000";

export const indexText = (sessionId, text) =>
  axios.post(`${API_BASE}/index`, { session_id: sessionId, text });

//export const queryText = (sessionId, question) =>
//  axios.post(`${API_BASE}/ask-hybrid`, { session_id: sessionId, question });
