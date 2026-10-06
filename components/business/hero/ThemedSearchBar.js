import React from 'react';
import './ThemedSearchBar.css';
import { FaSearch } from 'react-icons/fa';
import { FaMicrophone } from 'react-icons/fa6';

const ThemedSearchBar = ({ placeholder = "Search Pooja Thali...", onSearch, onMicClick }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch?.(e.target.value);
    }
  };

  return (
    <div className="themed-search-bar-container">
      <div className="delivery-info">
        <p className="time">15 minutes</p>
        <p className="address">Address: 41/587 narahi, hazratganj</p>
      </div>
      <div className="themed-search-bar">
        <button
          className="search-icon"
          onClick={() => onSearch?.(document.querySelector('.themed-search-bar input')?.value)}
        >
          <FaSearch size={20} />
        </button>
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
        />
        <button
          className="mic-icon"
          onClick={onMicClick}
        >
          <FaMicrophone size={25} />
        </button>
      </div>

      {/* Delivery Info Section */}

    </div>
  );
};

export default ThemedSearchBar;
