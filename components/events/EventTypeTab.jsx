"use client";
import React, { useState, useEffect } from "react";

const EventTypeTab = ({ onTabChange, mode = "view" }) => {
  const [activeTab, setActiveTab] = useState(mode);

  useEffect(() => {
    setActiveTab(mode);
  }, [mode]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex justify-center sm:justify-start gap-4 sm:gap-8 px-4 sm:px-6 py-3 sm:py-4">
        {["view", "edit", "add"].map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`relative text-sm sm:text-base font-medium px-3 py-2 rounded-md transition-all ${
              activeTab === tab
                ? "text-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-600 rounded-full"></span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EventTypeTab;
