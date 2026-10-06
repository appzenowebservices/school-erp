// components/inventory/SearchBar.jsx
import React from 'react';
import { commonIcons } from './constants/icons'; // Adjust path as needed

const { FaSearch, FaTimes } = commonIcons;

const SearchBar = ({ searchTerm, setSearchTerm }) => {
    return (
        <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaSearch size={20} className="text-gray-400" />
            </div>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products by name or SKU..."
                className="pl-12 pr-12 py-3 w-full bg-white border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            {searchTerm && (
                <button
                    onClick={() => setSearchTerm("")}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                    <FaTimes size={18} className="text-gray-400 hover:text-gray-600" />
                </button>
            )}
        </div>
    );
};

export default SearchBar;