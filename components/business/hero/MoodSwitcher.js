import React from 'react';
import './MoodSwitcher.css';

const MoodSwitcher = ({ currentMood, onMoodChange }) => {
  const moods = [
    'Ganesh Chaturthi',
    'Diwali',
    'Christmas',
    'New Year',
    'Summer Sale',
    'Monsoon Magic',
    'Valentine\'s Day'
  ];

  return (
    <div className="mood-switcher">
      <label htmlFor="mood-select">🎉 Select Theme:</label>
      <select
        id="mood-select"
        value={currentMood}
        onChange={(e) => onMoodChange(e.target.value)}
      >
        {moods.map((mood) => (
          <option key={mood} value={mood}>
            {mood}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MoodSwitcher;
