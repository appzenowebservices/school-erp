import React, { useState } from 'react';
import './BackgroundVisual.css'; // You can use a separate CSS or inline style
import MoodSwitcher from './MoodSwitcher';
import ThemedSearchBar from './ThemedSearchBar';
import CategoryTabs from './CategoryTabs';
import HeroHeadline from './HeroHeadline';

const BackgroundVisual = () => {
  const [mood, setMood] = useState('Ganesh Chaturthi');

  return (
    <>
      <div className="background-visual">
        {/* Decorative Bell Icon */}
        <img
          src="/assets/bell.png"
          alt="Bell"
          className="decorative-icon bell"
        />

        {/* Left swirl */}
        <ThemedSearchBar
          placeholder={`Search in ${mood}...`}
          onSearch={(query) => console.log("Search query:", query)}
        />
        <img
          src="/assets/swirl-left.png"
          alt="Swirl Left"
          className="decorative-icon swirl-left"
        />
        <CategoryTabs />

        {/* Right swirl */}
        {/* <img
          src="/assets/swirl-right.png"
          alt="Swirl Right"
          className="decorative-icon swirl-right"
        /> */}

        {/* Optional glowing overlay */}
        {/* <div className="glow-overlay" /> */}

      {/* <HeroHeadline mood={mood} /> */}
      </div>
    </>
  );
};

export default BackgroundVisual;
