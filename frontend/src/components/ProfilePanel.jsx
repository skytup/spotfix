import { useState } from 'react';

function ProfilePanel({ isOpen, onClose }) {
  const [points, setPoints] = useState(0);
  const [totalIssues, setTotalIssues] = useState(0);
  const [issuesToday, setIssuesToday] = useState(0);

  const handleResetDaily = () => {
    setIssuesToday(0);
  };

  if (!isOpen) return null;

  return (
    <div id="profile" className="profile-panel">
      <div className="profile-header">
        <h3>Your Profile</h3>
        <button id="close-profile" aria-label="Close Profile" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
      </div>
      <div className="profile-stats">
        <div className="stats-card">
          <i className="fas fa-award"></i>
          <div>
            <h4>Fix Points</h4>
            <p id="points">{points}</p>
          </div>
        </div>
        <div className="stats-card">
          <i className="fas fa-flag"></i>
          <div>
            <h4>Total Reports</h4>
            <p id="total-issues">{totalIssues}</p>
          </div>
        </div>
      </div>
      <div className="daily-challenge">
        <h4>Daily Challenge</h4>
        <p>Report 2 issues today for +15 bonus points!</p>
        <div className="progress-container">
          <div 
            id="challenge-progress" 
            className="progress-bar"
            style={{ width: `${(issuesToday / 2) * 100}%` }}
          ></div>
        </div>
        <p className="challenge-status">
          Progress: <span id="issues-today">{issuesToday}</span>/2
        </p>
      </div>
      <button id="reset-daily" className="secondary-button" onClick={handleResetDaily}>
        <i className="fas fa-redo"></i> Reset Daily Challenge (Demo)
      </button>
    </div>
  );
}

export default ProfilePanel;
