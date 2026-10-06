import React from "react";

const TransportLocationFilterPanel = ({
  setFilters,
  config,
  isFilterPanelOpen,
  filters,
  transportLocations
}) => {
  if (!isFilterPanelOpen) return null;

  /* ------------------------ Handle Location Type Change ------------------------ */
  const handleLocationTypeChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      locationType: e.target.value
    }));
  };

  /* ------------------------ Handle Area Change ------------------------ */
  const handleAreaChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      area: e.target.value
    }));
  };

  /* ------------------------ Handle Status Change ------------------------ */
  const handleStatusChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      status: e.target.value
    }));
  };

  /* ------------------------ Handle Distance Range Change ------------------------ */
  const handleDistanceRangeChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      distanceRange: e.target.value
    }));
  };

  /* ------------------------ Handle Search Change ------------------------ */
  const handleSearchChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      search: e.target.value
    }));
  };

  // Extract unique values for dropdowns
  const locationTypes = [...new Set(transportLocations?.map(loc => loc.type).filter(Boolean) || [])];
  const areas = [...new Set(transportLocations?.map(loc => loc.area).filter(Boolean) || [])];

  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 p-6 mb-8">
      <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">

        {/* ========== LOCATION TYPE DROPDOWN ========== */}
        <div className="md:col-span-1">
          <h3 className="font-semibold text-gray-800 mb-3">Location Type</h3>

          <select
            value={filters.locationType || ""}
            onChange={handleLocationTypeChange}
            className="w-full border-gray-300 rounded-lg p-2 text-sm"
          >
            <option value="">All Types</option>
            <option value="pickup">Pickup Point</option>
            <option value="dropoff">Drop-off Point</option>
            <option value="both">Both</option>
            {locationTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* ========== AREA DROPDOWN ========== */}
        <div className="md:col-span-1">
          <h3 className="font-semibold text-gray-800 mb-3">Area</h3>

          <select
            value={filters.area || ""}
            onChange={handleAreaChange}
            className="w-full border-gray-300 rounded-lg p-2 text-sm"
          >
            <option value="">All Areas</option>
            {areas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>

        {/* ========== STATUS DROPDOWN ========== */}
        <div className="md:col-span-1">
          <h3 className="font-semibold text-gray-800 mb-3">Status</h3>

          <select
            value={filters.status || ""}
            onChange={handleStatusChange}
            className="w-full border-gray-300 rounded-lg p-2 text-sm"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="maintenance">Under Maintenance</option>
          </select>
        </div>

        {/* ========== DISTANCE RANGE DROPDOWN ========== */}
        <div className="md:col-span-1">
          <h3 className="font-semibold text-gray-800 mb-3">Distance Range</h3>

          <select
            value={filters.distanceRange || ""}
            onChange={handleDistanceRangeChange}
            className="w-full border-gray-300 rounded-lg p-2 text-sm"
          >
            <option value="">All Ranges</option>
            <option value="0-5">0-5 km</option>
            <option value="5-10">5-10 km</option>
            <option value="10-15">10-15 km</option>
            <option value="15-20">15-20 km</option>
            <option value="20+">20+ km</option>
          </select>
        </div>

        {/* ========== SEARCH INPUT ========== */}
        <div className="md:col-span-1">
          <h3 className="font-semibold text-gray-800 mb-3">Search Location</h3>

          <input
            type="text"
            value={filters.search || ""}
            onChange={handleSearchChange}
            className="w-full border-gray-300 rounded-lg p-2 text-sm"
            placeholder="Enter location name"
          />
        </div>

      </div>
    </div>
  );
};

export default TransportLocationFilterPanel;

