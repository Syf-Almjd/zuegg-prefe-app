import React from "react";
import "./WelcomePage.css";
import { useAppContext } from '../../contexts/AppContext';
import ZueggLogo from '../../assets/zuegg_logo.png';

// Self-contained SVG animation
const DataflowAnimation = () => (
  <svg viewBox="0 0 300 300" className="dataflow-svg">
    <defs>
      <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#a29bfe', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#6c5ce7', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <path className="data-path" d="M 50 150 Q 150 50 250 150" stroke="url(#glow)" fill="none" strokeWidth="2" />
    <path className="data-path path-reverse" d="M 50 150 Q 150 250 250 150" stroke="url(#glow)" fill="none" strokeWidth="2" />
    <path className="data-path" d="M 50 150 C 80 220, 220 220, 250 150" stroke="url(#glow)" fill="none" strokeWidth="1" strokeOpacity="0.5" />
    <path className="data-path path-reverse" d="M 50 150 C 80 80, 220 80, 250 150" stroke="url(#glow)" fill="none" strokeWidth="1" strokeOpacity="0.5" />
    <circle className="node" cx="50" cy="150" r="8" fill="#f0f0f0" />
    <circle className="node" cx="250" cy="150" r="8" fill="#f0f0f0" />
    <circle className="node node-center" cx="150" cy="150" r="12" fill="#f0f0f0" />
  </svg>
);

const WelcomePage = () => {
  const { enterApp } = useAppContext();

  return (
    <div className="welcome-container">

      <div className="aurora-background">
        <div className="aurora-shape aurora-shape1" />
        <div className="aurora-shape aurora-shape2" />
        <div className="aurora-shape aurora-shape3" />
      </div>
      <div className="welcome-content-card">
        <div className="logo-container">
        <img src={ZueggLogo} alt="Zuegg Logo" className="logo-image" />
        </div>
        <div className="animation-container">
          <DataflowAnimation />
        </div>
        <h1 className="welcome-title">Welcome to Prefe BI</h1>
        <p className="welcome-subtitle">
          Smart. Simple. Insightful Business Intelligence.
        </p>
        <button onClick={enterApp} className="enter-dashboard-button">
          Start Exploring..
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;
