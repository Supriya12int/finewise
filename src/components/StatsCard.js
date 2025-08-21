import React from 'react';
import './StatsCard.css'; // Assuming you create this CSS file for styling

export default function StatsCard({ title, value, icon, color }) {
  return (
    <div className="stats-card">
      <div className="stats-icon" style={{ backgroundColor: color }}>
        {icon}
      </div>
      <div className="stats-text">
        <div className="stats-title">{title}</div>
        <div className="stats-value">{value}</div>
      </div>
    </div>
  );
}
