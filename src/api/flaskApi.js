const API_BASE = "http://127.0.0.1:5000";

export const queryText = async (sessionId, question) => {
  const response = await fetch(`${API_BASE}/ask-hybrid`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      session_id: sessionId,
      question: question
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

// File upload function
export const uploadFile = async (sessionId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('session_id', sessionId);

  const response = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

// Get uploaded files list
export const getUploadedFiles = async (sessionId) => {
  const response = await fetch(`${API_BASE}/files?session_id=${sessionId}`, {
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

// Delete file
export const deleteFile = async (sessionId, fileName) => {
  const response = await fetch(`${API_BASE}/file`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      session_id: sessionId,
      file_name: fileName
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};