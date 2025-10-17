import React from "react";
import UploadPanel from "../components/UploadPanel";
import LLMPanel from "../components/LLMPanel";

const Dashboard = () => {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 min-h-screen">
      <UploadPanel />
      <LLMPanel />
    </div>
  );
};

export default Dashboard;
