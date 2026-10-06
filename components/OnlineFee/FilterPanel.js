import React from "react";
import { commonIcons, moduleIcons, studentStatusIcons } from './icons';

const { FaCheck, FaCheckIcon, FaTimesIcon } = commonIcons;

const FeeSummaryFilterPanel = ({
    setFilters,

    config,


    isFilterPanelOpen,
    modules,
    studentStatus,
    filters,
    toggleFilter,
    // getAvailableCategories,
    setDateFilter,        // new prop for handling date changes
    setPaymentModeFilter, // new prop for handling dropdown selection
}) => {
    const paymentModes = ["CASH", "CHEQUE", "ONLINE", "CARD(POS Machine)", "BANK(Direct)", "DEMAND DRAFT", "NACH"];

    if (!isFilterPanelOpen) {
        return null;
    }

    let fee_frequency = config?.fee_frequency
    let fee_head_types = config?.fee_head_types
    let fee_types = config?.fee_types
    // console.log('config', config);


    return (
        <div className="bg-[#FAF9F6] rounded-lg shadow border border-gray-200 p-5 mb-6 grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Module filter */}
            {/* <div>
                <h3 className="font-medium text-gray-700 mb-3">Modules</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {modules?.map((module, index) => (
                        <div key={index} className="flex items-center">
                            <button
                                onClick={(e) => toggleFilter("modules", module.moduleName, e)}
                                className="flex items-center w-full"
                            >
                                <div
                                    className={`w-5 h-5 rounded border flex items-center justify-center ${filters.modules.includes(module.moduleName)
                                        ? "bg-blue-500 border-blue-500"
                                        : "border-gray-300"
                                        }`}
                                >
                                    {filters.modules.includes(module.moduleName) && (
                                        <FaCheck size={12} className="text-white" />
                                    )}
                                </div>
                                <span className="ml-3 text-gray-700 flex items-center">
                                    {moduleIcons[module.moduleName] && (
                                        <span className="mr-2">{moduleIcons[module.moduleName]}</span>
                                    )}
                                    {module.moduleName}
                                </span>
                            </button>
                        </div>
                    ))}
                </div>
            </div> */}


            <div>
                <h3 className="font-medium text-gray-700 mb-3">Student Status</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {studentStatus?.map((status, index) => (
                        <div key={index} className="flex items-center">
                            <button
                                onClick={(e) => toggleFilter("status", status.name, e)}
                                className="flex items-center w-full"
                            >
                                <div
                                    className={` cursor-pointer w-5 h-5 rounded border flex items-center justify-center ${filters?.status?.includes(status?.name)
                                        ? "bg-blue-500 border-blue-500"
                                        : "border-gray-300"
                                        }`}
                                >
                                    {filters?.status?.includes(status?.name) && (
                                        <FaCheck size={12} className="text-white" />
                                    )}
                                </div>
                                <span className="ml-3 text-gray-700 flex items-center">
                                    {studentStatusIcons[status.name] && (
                                        <span className="mr-2">{studentStatusIcons[status.name]}</span>
                                    )}
                                    {status.name}
                                </span>
                            </button>
                        </div>
                    ))}
                </div>
            </div>




            {/* Category filter */}
            {/* <div>
                <h3 className="font-medium text-gray-700 mb-3">Categories</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {getAvailableCategories()?.map((category, index) => (
                        <div key={index} className="flex items-center">
                            <button
                                onClick={(e) => toggleFilter("categories", category, e)}
                                className="flex items-center w-full"
                            >
                                <div
                                    className={`w-5 h-5 rounded border flex items-center justify-center ${filters.categories.includes(category)
                                        ? "bg-blue-500 border-blue-500"
                                        : "border-gray-300"
                                        }`}
                                >
                                    {filters.categories.includes(category) && (
                                        <FaCheck size={12} className="text-white" />
                                    )}
                                </div>
                                <span className="ml-3 text-gray-700 flex items-center">
                                    {category}
                                </span>
                            </button>
                        </div>
                    ))}
                </div>
            </div> */}

            {/* Status filter */}
            {/* <div>
                <h3 className="font-medium text-gray-700 mb-3">Status</h3>
                <div className="space-y-2">
                    {["active", "inactive"].map((status, index) => (
                        <div key={index} className="flex items-center">
                            <button
                                onClick={(e) => toggleFilter("status", status, e)}
                                className="flex items-center w-full"
                            >
                                <div
                                    className={`w-5 h-5 rounded border flex items-center justify-center ${filters.status.includes(status)
                                        ? "bg-blue-500 border-blue-500"
                                        : "border-gray-300"
                                        }`}
                                >
                                    {filters.status.includes(status) && (
                                        <FaCheck size={12} className="text-white" />
                                    )}
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
            </div> */}

            {/* Payment Mode filter (Dropdown) */}
            <div>
                <h3 className="font-medium text-gray-700 mb-3">Payment Mode</h3>
                <select
                    value={filters.paymentMode || ""} // take first value from array
                    onChange={(e) => {
                        const value = e.target.value;
                        if (value === "") {
                            // reset filter
                            setFilters(prev => ({ ...prev, paymentMode: "" }));
                        } else {
                            // set single value
                            setFilters(prev => ({ ...prev, paymentMode: value }));
                        }
                    }}
                    className="w-full border border-gray-300 rounded-md p-2 text-gray-700 
               focus:border-blue-500 focus:ring focus:ring-blue-200"
                >
                    <option value="">All Modes</option>
                    {paymentModes?.map((mode, idx) => (
                        <option key={idx} value={mode}>
                            {mode}
                        </option>
                    ))}
                </select>
            </div>


            {/* Date Filter */}
            <div className="md:col-span-2">
                <h3 className="font-medium text-gray-700 mb-3">Date Range</h3>
                <div className="flex gap-4">
                    <input
                        type="date"
                        value={filters.depositStartDate || ""}
                        onChange={e => setFilters(prev => ({ ...prev, depositStartDate: e.target.value }))}
                        className="border border-gray-300 rounded-md p-2 text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-200"
                    />
                    <input
                        type="date"
                        value={filters.depositEndDate || ""}
                        onChange={e => setFilters(prev => ({ ...prev, depositEndDate: e.target.value }))}

                        // onChange={(e) => setFilters("endDate", e.target.value)}
                        className="border border-gray-300 rounded-md p-2 text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-200"
                    />
                </div>
            </div>
        </div>
    );
};

export default FeeSummaryFilterPanel;
