import React from 'react';
import './HeroHeadline.css';

const moodHeadlines = {
  'Ganesh Chaturthi': '🎊 Celebrate Ganesh Chaturthi',
  'Diwali': '🪔 Light Up This Diwali',
  'Christmas': '🎄 Merry Christmas Deals',
  'New Year': '🎆 Step Into the New Year',
  'Summer Sale': '☀️ Cool Offers for Hot Days',
  'Monsoon Magic': '🌧️ Monsoon Magic Offers',
  'Valentine\'s Day': '❤️ Love is in the Air'
};

const HeroHeadline = ({ mood }) => {
  const headline = moodHeadlines[mood] || `✨ Celebrate with Us`;

  return (
    
    <div className="background-visual-hero">
      {/* <h2>{headline}</h2> */}
    </div>
  );
};

export default HeroHeadline;
