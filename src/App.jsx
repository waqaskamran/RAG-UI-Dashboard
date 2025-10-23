import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LLMPanel from "./components/LLMPanel";
import ResumeIngest from "./components/ResumeIngest";
import EvaluatePanel from "./components/EvaluatePanel";
import BatchResumeIngest from "./components/BatchResumeIngest";
import EvaluateBatchPanel from "./components/EvaluateBatchPanel";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LLMPanel />} />
        <Route path="/ingest" element={<ResumeIngest />} />
        <Route path="/evaluate" element={<EvaluatePanel />} />
        <Route path="/batch-ingest" element={<BatchResumeIngest />} />
        <Route path="/batch-evaluate" element={<EvaluateBatchPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
