// components/inventory/ActiveFilters.jsx
import React from 'react';
import { viewFeeIcons,commonIcons } from './icons'

const { FaTimes } = commonIcons;

const ViewFeeFiltersSummary = ({ filters, toggleFilter, clearFilters }) => {




    const getDisplayedFilters = () => {
        const allFilters = [];
        const safeFilters = filters || {};
        const { joinedDate, title, status = [] } = safeFilters;

        if (joinedDate) {
            allFilters.push({
                type: 'joinedDate',
                value: joinedDate,
            });
        }

        if (title) {
            allFilters.push({
                type: 'title',
                value: title,
            });
        }

        (Array.isArray(status) ? status : []).forEach(s => {
            allFilters.push({
                type: 'status',
                value: s,
            });
        });
        // console.log('---------- allFilters -------->', allFilters);

        return allFilters;
    };



    const displayedFilters = getDisplayedFilters();

    if (displayedFilters.length === 0) {
        return null;
    }
    if (getDisplayedFilters().length === 0) {
        return null;
    }

    return (
        <div className="flex flex-wrap items-center gap-2 p-4">
            <span className="text-sm font-medium text-gray-500">Active filters:</span>

            {displayedFilters.map((filter, index) => {
                return (
                    <div
                        key={index}
                        className="flex items-center bg-white border border-gray-300 rounded-full px-3 py-1 text-sm"
                    >
                        <span className="capitalize mr-1">
                            {filter.type === 'paymentMode' ? 'Mode' : filter.type}:
                        </span>
                        <span className="font-medium flex items-center">
                            {filter.type === 'paymentMode' && viewFeeIcons[filter.value] && (
                                <span className="mr-1">{viewFeeIcons[filter.value]}</span>
                            )}
                            {filter.type === 'status' && viewFeeIcons[filter.value] && (
                                <span className="mr-1">{viewFeeIcons[filter.value]}</span>
                            )}
                            {filter.type === 'title' && (
                                <span className="mr-1 w-4">{viewFeeIcons?.title}</span>
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
                )
            })}

            <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
                Clear all
            </button>
        </div>
    );
};

export default ViewFeeFiltersSummary;