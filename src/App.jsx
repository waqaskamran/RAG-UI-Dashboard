import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LLMPanel from "./components/LLMPanel";
import ResumeIngest from "./components/ResumeIngest";
import EvaluatePanel from "./components/EvaluatePanel";
import BatchResumeIngest from "./components/BatchResumeIngest";
import EvaluateBatchPanel from "./components/EvaluateBatchPanel";
import LetterheadGenerator from "./components/LetterheadGenerator";
import ConsultechLetterGenerator from "./components/ConsultechLetter";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LLMPanel />} />
        <Route path="/ingest" element={<ResumeIngest />} />
        <Route path="/evaluate" element={<EvaluatePanel />} />
        <Route path="/batch-ingest" element={<BatchResumeIngest />} />
        <Route path="/batch-evaluate" element={<EvaluateBatchPanel />} />
        <Route path="/letter-head-gen" element={<LetterheadGenerator />} />
        <Route path="/consultech-letter-head" element={<ConsultechLetterGenerator />} />
      </Routes>
    </Router>
  );
}

export default App;
