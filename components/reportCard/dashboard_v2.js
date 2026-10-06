// components/LibraryCard.js
import React, { useState } from 'react';
import { LuBookOpen, LuHourglass, LuDollarSign, LuUsers, LuLandmark, LuBuilding2 } from 'react-icons/lu'; // Added LuBuilding2 for the card image

function LibraryCard({ library, onAction }) {
  const [isHovered, setIsHovered] = useState(false);
  const [activeTab, setActiveTab] = useState('info');

  const getStatusColor = (count) => {
    if (count > 100000) return 'bg-purple-500';
    if (count > 50000) return 'bg-blue-500';
    return 'bg-green-500';
  };

  return (
    <div
      className="relative rounded-3xl overflow-hidden shadow-xl transform transition-all duration-300
                 hover:shadow-2xl hover:-translate-y-2 group" // Group for child animations
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: `linear-gradient(145deg, ${library.theme_color}10 0%, white 40%)`, // Lighter gradient
        border: `2px solid ${library.theme_color}30`,
        transform: isHovered ? 'scale(1.02) translateY(-8px)' : 'scale(1) translateY(0)', // Scale up and lift on hover
        boxShadow: isHovered
          ? `0 25px 50px -12px ${library.theme_color}60` // Larger, colored shadow on hover
          : '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
      }}
    >
      {/* Dynamic Header Section - Image Placeholder with Gradients */}
      <div
        className="h-48 relative flex items-center justify-center rounded-t-3xl overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${library.theme_color} 0%, ${library.theme_color}AA 100%)`, // Stronger gradient for header
        }}
      >
        {/* Abstract background elements (shelves/books) */}
        <div className="absolute inset-0 opacity-20"
             style={{
                 backgroundImage: `repeating-linear-gradient(45deg, ${library.theme_color} 0px, ${library.theme_color} 1px, transparent 1px, transparent 10px)`,
                 backgroundSize: '20px 20px',
             }}
        />
        <div className="absolute inset-0 opacity-10"
             style={{
                 backgroundImage: `repeating-linear-gradient(-45deg, ${library.theme_color} 0px, ${library.theme_color} 1px, transparent 1px, transparent 10px)`,
                 backgroundSize: '20px 20px',
             }}
        />

        {/* Central Icon/Illustration */}
        <LuBuilding2 className="text-white text-8xl opacity-80 z-10 transform -translate-y-2 group-hover:scale-110 transition-transform duration-300" />

        {/* Overlay gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

        {/* Status badge */}
        <div className={`absolute top-5 right-5 ${getStatusColor(library.books_count)} text-white px-4 py-1.5 rounded-full text-sm font-bold animate-pulse-slow`}>
          {library.books_count > 100000 ? 'Mega Library' : library.books_count > 50000 ? 'Large Hub' : 'Community Spot'}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-7 bg-white">
        {/* Header */}
        <div className="mb-5">
          <h3 className="text-2xl font-extrabold text-gray-900 mb-1 leading-tight">{library.name}</h3>
          <p className="text-base text-gray-600 flex items-center">
            <LuLandmark className="text-blue-500 mr-2" />
            {library.location}
          </p>
        </div>

        {/* Quick Stats - More visual */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <StatBox icon={<LuBookOpen />} label="Books" value={`${(library.books_count / 1000).toFixed(0)}K`} color={library.theme_color} />
          <StatBox icon={<LuHourglass />} label="Return" value={library.max_return_period} color="#059669" />
          <StatBox icon={<LuDollarSign />} label="Fine/Day" value={library.fine_per_day} color="#DC2626" />
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-4">
          {['info', 'details', 'actions'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-4 text-sm font-semibold rounded-t-lg transition-colors duration-200 relative
                ${activeTab === tab
                  ? 'text-white' // Text white when active
                  : 'text-gray-600 hover:text-gray-800'
                }`}
              style={{
                backgroundColor: activeTab === tab ? library.theme_color : 'transparent', // Dynamic background color
                color: activeTab === tab ? 'white' : 'inherit',
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {activeTab === tab && (
                <div
                  className="absolute bottom-0 left-0 w-full h-1 bg-white animate-pulse" // White indicator
                  style={{ backgroundColor: isHovered ? '#FFFFFF' : '#F3F4F6' }} // Subtle hover effect on indicator
                ></div>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[140px] text-gray-700 text-sm">
          {activeTab === 'info' && (
            <div className="space-y-3">
              <p className="leading-relaxed">{library.description}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {library?.standards?.map((standard, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                  >
                    {standard}
                  </span>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="space-y-3 py-2">
              <DetailRow label="Established" value={library.established_date} />
              <DetailRow label="Created by" value={library.created_by} />
              <DetailRow label="Books Allowed" value={library.books_allowed} />
            </div>
          )}

          {activeTab === 'actions' && (
            <div className="grid grid-cols-2 gap-3 py-2">
              <ActionButton onClick={() => onAction('defaulters', library)} color="red" icon={<LuUsers />}>Defaulters</ActionButton>
              <ActionButton onClick={() => onAction('borrowers', library)} color="blue" icon={<LuUsers />}>Borrowers</ActionButton>
              <ActionButton onClick={() => onAction('viewBooks', library)} color="green" icon={<LuBookOpen />}>View Books</ActionButton>
              <ActionButton onClick={() => onAction('analytics', library)} color="purple" icon={<LuLandmark />}>Analytics</ActionButton>
            </div>
          )}
        </div>

        {/* Main Actions */}
        <div className="flex gap-3 mt-6 pt-5 border-t border-gray-100">
          <button
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-5 rounded-lg text-base font-semibold transition-all duration-200 transform hover:scale-[1.01]"
            onClick={() => onAction('view', library)}
          >
            View Full Details
          </button>
          <button
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-5 rounded-lg text-base font-semibold transition-colors duration-200 transform hover:scale-[1.01]"
            onClick={() => onAction('edit', library)}
          >
            Edit Library
          </button>
        </div>
      </div>
    </div>
  );
}

// Reusable micro-components for cleaner code
const StatBox = ({ icon, label, value, color }) => (
  <div className="flex flex-col items-center p-3 bg-gray-50 rounded-xl transition-all duration-200 hover:bg-white hover:shadow-md">
    <div className="text-xl mb-1" style={{ color: color }}>{icon}</div>
    <div className="text-lg font-bold text-gray-800">{value}</div>
    <div className="text-xs text-gray-500">{label}</div>
  </div>
);

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
    <span className="text-sm text-gray-600">{label}:</span>
    <span className="text-sm font-medium text-gray-800">{value}</span>
  </div>
);

const ActionButton = ({ onClick, color, icon, children }) => (
  <button
    onClick={onClick}
    className={`p-3 bg-${color}-50 hover:bg-${color}-100 text-${color}-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2`}
  >
    {icon} <span>{children}</span>
  </button>
);

export default LibraryCard;