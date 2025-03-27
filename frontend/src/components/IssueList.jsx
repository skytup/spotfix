import { useState, useEffect } from 'react';

function IssueList() {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    // TODO: Implement API call to fetch issues
    // For now, using mock data
    const mockIssues = [
      {
        id: 1,
        category: 'infrastructure',
        description: 'Pothole on Main Street',
        severity: 'high',
        location: 'New York, NY',
        date: '2024-03-27'
      },
      // Add more mock issues as needed
    ];
    setIssues(mockIssues);
  }, []);

  return (
    <section id="issue-list">
      <h3>Recent Issues</h3>
      <div className="issue-cards" id="issue-cards-container">
        {issues.length === 0 ? (
          <p id="no-issues" className="no-issues">
            No issues reported yet. Be the first!
          </p>
        ) : (
          issues.map((issue) => (
            <div key={issue.id} className="issue-card">
              <div className="issue-header">
                <span className={`severity-badge ${issue.severity}`}>
                  {issue.severity}
                </span>
                <span className="category">{issue.category}</span>
              </div>
              <p className="description">{issue.description}</p>
              <div className="issue-footer">
                <span className="location">
                  <i className="fas fa-map-marker-alt"></i> {issue.location}
                </span>
                <span className="date">
                  <i className="fas fa-calendar"></i> {issue.date}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default IssueList;
