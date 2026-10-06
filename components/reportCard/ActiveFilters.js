// components/inventory/ActiveFilters.jsx
import React from 'react';
import { moduleIcons, categoryIcons, statusIcons, commonIcons } from './component/constants/icons'; // Adjust path as needed

const { FaTimes } = commonIcons;

const ActiveFilters = ({ filters, toggleFilter, clearFilters }) => {
    const getDisplayedFilters = () => {
        const allFilters = [];

        filters.modules.forEach(module => {
            allFilters.push({
                type: 'modules',
                value: module
            });
        });

        filters.categories.forEach(category => {
            allFilters.push({
                type: 'categories',
                value: category
            });
        });

        filters.status.forEach(status => {
            allFilters.push({
                type: 'status',
                value: status
            });
        });

        return allFilters;
    };

    if (getDisplayedFilters().length === 0) {
        return null;
    }

    return (
        <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm font-medium text-gray-500">Active filters:</span>

            {getDisplayedFilters().map((filter, index) => (
                <div
                    key={index}
                    className="flex items-center bg-white border border-gray-300 rounded-full px-3 py-1 text-sm"
                >
                    <span className="capitalize mr-1">
                        {filter.type === 'modules' ? 'Module' : filter.type === 'categories' ? 'Category' : 'Status'}:
                    </span>
                    <span className="font-medium flex items-center">
                        {filter.type === 'modules' && moduleIcons[filter.value] && (
                            <span className="mr-1">{moduleIcons[filter.value]}</span>
                        )}
                        {filter.type === 'categories' && categoryIcons[filter.value] && (
                            <span className="mr-1">{categoryIcons[filter.value]}</span>
                        )}
                        {filter.type === 'status' && statusIcons[filter.value] && (
                            <span className="mr-1">{statusIcons[filter.value]}</span>
                        )}
                        {filter.value}
                    </span>
                    <button
                        onClick={() => toggleFilter(filter.type, filter.value)}
                        className="ml-2 text-gray-400 hover:text-gray-600"
                    >
                        <FaTimes size={14} />
                    </button>
                </div>
            ))}

            <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
                Clear all
            </button>
        </div>
    );
};

export default ActiveFilters;