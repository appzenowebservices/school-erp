import React, { useState } from 'react';
import BackgroundVisual from './BackgroundVisual';
import MoodSwitcher from './MoodSwitcher';
import ThemedSearchBar from './ThemedSearchBar';
import CategoryTabs from './CategoryTabs';
import HeroHeadline from './HeroHeadline';
import HeroTiles from './HeroTiles';
import DrinksAndJuicesCard from './DrinksAndJuicesCard';
import ProductCard from '../../ui/card/ProductCard';

const Hero = () => {
  const [mood, setMood] = useState('Ganesh Chaturthi');

  return (
    <>
      <MoodSwitcher currentMood={mood} onMoodChange={setMood} />
      <section className="background-visua">

        <BackgroundVisual mood={mood} />

        <HeroHeadline mood={mood} />
        <HeroTiles mood={mood} />
      <DrinksAndJuicesCard />
      </section>
        <ProductCard />
    </>
  );
};

export default Hero;
