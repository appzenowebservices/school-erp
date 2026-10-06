import React from "react";

const TitleFilterPanel = ({
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
      isSearch: !prev.isSearch
    }));
    setIsFilterPanelOpen(false);
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

export default TitleFilterPanel;
