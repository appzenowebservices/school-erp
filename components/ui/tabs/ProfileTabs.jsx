import { useState } from "react";

const Tabs = ({ tabs, defaultTab = 0, onTabChange }) => {
  const [activeIndex, setActiveIndex] = useState(defaultTab);

  const handleTabClick = (index) => {
    setActiveIndex(index);
    if (onTabChange) onTabChange(index);
  };

  return (
    <div className="">
      {/* Tabs Header */}
      <div className="flex overflow-x-auto border-b border-gray-200 w-[380px] md:flex-nowrap lg:w-full">
      {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => handleTabClick(index)}
            className={` overflow-clip px-4 py-3 text-sm md:text-base whitespace-nowrap font-medium transition-all duration-200 ${
              activeIndex === index
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                : "text-gray-500 hover:text-blue-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {tabs[activeIndex]?.content}</div>
    </div>
  );
};

export default Tabs;
