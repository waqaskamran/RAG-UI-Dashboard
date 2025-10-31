import React from "react";
import { Link } from "react-router-dom";
import "./AppLayout.css";

const AppLayout = ({ children }) => {
  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-top">
          <h2 className="sidebar-logo">Rana LLM</h2>
          <nav>
            <ul>
              <li>
                <Link to="/ingest" className="sidebar-link">📄 Ingest</Link>
              </li>
              <li>
                <Link to="/batch-ingest" className="sidebar-link">🗂️ Batch Ingest</Link>
              </li>
              <li>
                <Link to="/evaluate" className="sidebar-link">📊 Evaluate</Link>
              </li>
              <li>
                <Link to="/batch-evaluate" className="sidebar-link">🗃️ Batch Evaluate</Link>
              </li>

              <li>
                <Link to="/letter-head-gen" className="sidebar-link">🗃️ Letterhead Generator</Link>
              </li>

              <li>
                <Link to="/consultech-letter-head" className="sidebar-link">🗃️ Consultech</Link>
              </li>

              
            </ul>
          </nav>
        </div>

        <div className="sidebar-bottom">
          <p>© 2025 Rana LLM</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">{children}</main>
    </div>
  );
};

export default AppLayout;