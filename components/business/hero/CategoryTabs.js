import React, { useState } from 'react';
import './CategoryTabs.css';
import { FaShoppingBag, FaHeadphones, FaGift } from 'react-icons/fa';
import { GiLipstick, GiBabyBottle } from 'react-icons/gi';

const icons = {
  All: <FaShoppingBag size={25} />,
  Electronics: <FaHeadphones size={25} />,
  Beauty: <GiLipstick size={25} />,
  Kids: <GiBabyBottle size={25} />,
  Gifting: <FaGift size={25} />,
};

const CategoryTabs = () => {



  









  const tabs = ["All", "Electronics", "Beauty", "Kids", "Gifting"];
  const [activeTab, setActiveTab] = useState("All");

  return (
    <div className="category-tabs-wrapper">
      <div className="category-tabs">
        {tabs.map(tab => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            <div className="icon">{icons[tab]}</div>
            <div className="label">{tab}</div>
            {tab === "Beauty" && activeTab !== "Beauty" && (
              <span className="sale-tag">Sale</span>
            )}
            {activeTab === tab && <div className="underline" />}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryTabs;
