// components/inventory/FilterPanel.jsx
import React from 'react';
import { moduleIcons, categoryIcons, commonIcons } from '../constants/icons'; // Adjust path as needed

const { FaCheck, FaCheckIcon, FaTimesIcon } = commonIcons;

const FilterPanel = ({ isFilterPanelOpen, modules, filters, toggleFilter, getAvailableCategories }) => {
    if (!isFilterPanelOpen) {
        return null;
    }

    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5 mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Module filter */}
            <div>
                <h3 className="font-medium text-gray-700 mb-3">Modules</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {modules.map((module, index) => (
                        <div key={index} className="flex items-center">
                            <button
                                onClick={(e) => toggleFilter("modules", module.moduleName, e)}
                                className="flex items-center w-full"
                            >
                                <div className={`w-5 h-5 rounded border flex items-center justify-center ${filters.modules.includes(module.moduleName) ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                                    }`}>
                                    {filters.modules.includes(module.moduleName) && <FaCheck size={12} className="text-white" />}
                                </div>
                                <span className="ml-3 text-gray-700 flex items-center">
                                    {moduleIcons[module.moduleName] && <span className="mr-2">{moduleIcons[module.moduleName]}</span>}
                                    {module.moduleName}
                                </span>
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Category filter */}
            <div>
                <h3 className="font-medium text-gray-700 mb-3">Categories</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {getAvailableCategories().map((category, index) => (
                        <div key={index} className="flex items-center">
                            <button
                                onClick={(e) => toggleFilter("categories", category, e)}
                                className="flex items-center w-full"
                            >
                                <div className={`w-5 h-5 rounded border flex items-center justify-center ${filters.categories.includes(category) ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                                    }`}>
                                    {filters.categories.includes(category) && <FaCheck size={12} className="text-white" />}
                                </div>
                                <span className="ml-3 text-gray-700 flex items-center">
                                    {categoryIcons[category] && <span className="mr-2">{categoryIcons[category]}</span>}
                                    {category}
                                </span>
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Status filter */}
            <div>
                <h3 className="font-medium text-gray-700 mb-3">Status</h3>
                <div className="space-y-2">
                    {["active", "inactive"].map((status, index) => (
                        <div key={index} className="flex items-center">
                            <button
                                onClick={(e) => toggleFilter("status", status, e)}
                                className="flex items-center w-full"
                            >
                                <div className={`w-5 h-5 rounded border flex items-center justify-center ${filters.status.includes(status) ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                                    }`}>
                                    {filters.status.includes(status) && <FaCheck size={12} className="text-white" />}
                                </div>
                                <span className="ml-3 capitalize text-gray-700 flex items-center">
                                    {status === "active" ? (
                                        <FaCheckIcon className="mr-2 text-green-500" />
                                    ) : (
                                        <FaTimesIcon className="mr-2 text-red-500" />
                                    )}
                                    {status}
                                </span>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FilterPanel;