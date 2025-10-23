const API_BASE = "http://127.0.0.1:5000";

// Create/Update session data
export const setSessionData = async (sessionId, key, value) => {
  const response = await fetch(`${API_BASE}/redis/set`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      session_id: sessionId,
      key: key,
      value: value
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

// Read session data
export const getSessionData = async (sessionId, key) => {
  const response = await fetch(`${API_BASE}/redis/get?session_id=${sessionId}&key=${key}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

// Get all session keys
export const getAllSessionKeys = async (sessionId) => {
  const response = await fetch(`${API_BASE}/redis/keys?session_id=${sessionId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

// Delete session key
export const deleteSessionKey = async (sessionId, key) => {
  const response = await fetch(`${API_BASE}/redis/delete`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      session_id: sessionId,
      key: key
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

// Clear all session data
export const clearSession = async (sessionId) => {
  const response = await fetch(`${API_BASE}/redis/clear`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      session_id: sessionId
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};