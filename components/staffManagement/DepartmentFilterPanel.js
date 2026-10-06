import React, { useState } from "react";

const DepartmentFilterPanel = ({
  setFilters,
  config,
  isFilterPanelOpen,
  filters,
  setIsFilterPanelOpen
}) => {

  if (!isFilterPanelOpen) return null;

  const handleSearch = () => {
    setFilters(prev => ({
      ...prev,
      isSearch: prev => !prev,
    }));
    setIsFilterPanelOpen(false)

  };

  return (
    <div className="bg-white rounded shadow border border-gray-200 p-5 mb-6 grid grid-cols-1 md:grid-cols-4 gap-6">

      {/* Name */}
      <div>
        <h3 className="font-medium text-gray-700 mb-3">Name</h3>
        <input
          type="text"
          value={filters.name || ""}
          onChange={(e) =>
            setFilters(prev => ({ ...prev, name: e.target.value }))
          }
          placeholder="Search by name"
          className="w-full border border-gray-300 rounded-md p-2 text-gray-700 
            focus:border-blue-500 focus:ring focus:ring-blue-200"
        />
      </div>

      {/* Code */}
      <div>
        <h3 className="font-medium text-gray-700 mb-3">Code</h3>
        <input
          type="text"
          value={filters.code || ""}
          onChange={(e) =>
            setFilters(prev => ({ ...prev, code: e.target.value }))
          }
          placeholder="Search by code"
          className="w-full border border-gray-300 rounded-md p-2 text-gray-700 
            focus:border-blue-500 focus:ring focus:ring-blue-200"
        />
      </div>




      {/* product */}
      <div>
        <h3 className="font-medium text-gray-700 mb-3">Product</h3>

        <div className="relative">
          <select
            value={filters.product_id || ""}
            onChange={(e) =>
              setFilters(prev => ({ ...prev, product_id: e.target.value }))
            }
            className="w-full border border-gray-300 rounded-md p-2 text-gray-700 
                 bg-white focus:border-blue-500 focus:ring focus:ring-blue-200"
          >
            <option value="">Select product</option>

            {config?.products?.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Search Button */}
      <div className="flex items-end">
        <button
          onClick={handleSearch}
          className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md 
            hover:bg-blue-700 transition-colors shadow"
        >
          Search
        </button>
      </div>

    </div>
  );
};

export default DepartmentFilterPanel;
