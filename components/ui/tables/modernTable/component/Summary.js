// components/inventory/InventorySummary.jsx
import React from 'react';
import { commonIcons } from '../constants/icons'; // Adjust path as needed

const { FaArrowsAltV } = commonIcons;

const InventorySummary = ({ filteredCount, totalCount, sort, handleSort }) => {
    return (
        <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-500">
                Showing <span className="font-medium text-gray-900">{filteredCount}</span> of <span className="font-medium text-gray-900">{totalCount}</span> items
            </div>

            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Sort by:</span>
                <select
                    value={sort.field}
                    onChange={(e) => handleSort(e.target.value)}
                    className="bg-white border border-gray-300 text-gray-700 py-1 px-2 pr-8 rounded leading-tight focus:outline-none focus:border-blue-500"
                >
                    <option value="name">Name</option>
                    <option value="sku">SKU</option>
                    <option value="price">Price</option>
                    <option value="stock">Stock</option>
                    <option value="status">Status</option>
                </select>
                <button
                    onClick={() => handleSort(sort.field, true)} // Pass true to indicate toggle direction
                    className="bg-white border border-gray-300 rounded p-1"
                >
                    <FaArrowsAltV size={16} className={sort.direction === 'asc' ? 'text-blue-500' : 'text-gray-400'} />
                </button>
            </div>
        </div>
    );
};

export default InventorySummary;