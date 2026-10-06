import React from "react";
import { Bus, MapPin, GraduationCap, UserCircle } from "lucide-react";

const SchoolBusStudentFilterPanel = ({
  setFilters,
  config,
  isFilterPanelOpen,
  filters,
  locations = [], // Pass your transport locations/stops here
  buses = []      // Pass your bus list here
}) => {
  if (!isFilterPanelOpen) return null;

  const standards = config?.standards || [];

  /* ------------------------ Handle Standard Change ------------------------ */
  const handleStandardChange = (e) => {
    const stdId = e.target.value; // Keep as string to match config IDs
    setFilters((prev) => ({
      ...prev,
      standards: stdId ? [stdId] : [],
      classes: {} // reset classes when standard changes
    }));
  };

  /* ------------------------ Handle Class Change ------------------------ */
  const handleClassChange = (e) => {
    const classId = e.target.value;
    const selectedStd = filters.standards?.[0] || null;

    if (!selectedStd) return;

    setFilters((prev) => ({
      ...prev,
      classes: {
        [selectedStd]: classId ? [classId] : []
      }
    }));
  };

  /* ------------------------ Handle Bus Change ------------------------ */
  const handleBusChange = (e) => {
    setFilters((prev) => ({ ...prev, bus_id: e.target.value }));
  };

  /* ------------------------ Handle Location Change ------------------------ */
  const handleLocationChange = (e) => {
    setFilters((prev) => ({ ...prev, location_id: e.target.value }));
  };

  /* ------------------------ Handle Search Inputs ------------------------ */
  const handleSearchChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const selectedStdId = filters.standards?.[0] || null;
  const selectedStd = standards.find((s) => s.id == selectedStdId);
  const classes = selectedStd?.classes || [];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* 1. Standard Dropdown */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 font-bold text-gray-700 text-sm">
            <GraduationCap size={16} className="text-blue-500" /> Standard
          </label>
          <select
            value={selectedStdId || ""}
            onChange={handleStandardChange}
            className="w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl p-2.5 text-sm transition-all"
          >
            <option value="">All Standards</option>
            {standards.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        {/* 2. Class Dropdown */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 font-bold text-gray-700 text-sm">
            <GraduationCap size={16} className="text-blue-500" /> Section
          </label>
          <select
            value={filters.classes?.[selectedStdId]?.[0] || ""}
            onChange={handleClassChange}
            className="w-full border-gray-200 focus:border-blue-500 rounded-xl p-2.5 text-sm disabled:bg-gray-50 disabled:text-gray-400 transition-all"
            disabled={!selectedStdId}
          >
            <option value="">All Sections</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>{cls.name}</option>
            ))}
          </select>
        </div>

        {/* 3. School Bus Filter */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 font-bold text-gray-700 text-sm">
            <Bus size={16} className="text-amber-500" /> School Bus
          </label>
          <select
            value={filters.bus_id || ""}
            onChange={handleBusChange}
            className="w-full border-gray-200 focus:border-blue-500 rounded-xl p-2.5 text-sm transition-all"
          >
            <option value="">All Buses</option>
            {buses.map((bus) => (
              <option key={bus.id} value={bus.id}>Bus: {bus.number}</option>
            ))}
          </select>
        </div>

        {/* 4. Location Filter */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 font-bold text-gray-700 text-sm">
            <MapPin size={16} className="text-emerald-500" /> Pickup Location
          </label>
          <select
            value={filters.location_id || ""}
            onChange={handleLocationChange}
            className="w-full border-gray-200 focus:border-blue-500 rounded-xl p-2.5 text-sm transition-all"
          >
            <option value="">All Locations</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>{loc.name}</option>
            ))}
          </select>
        </div>

        {/* 5. Admission Number Search */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 font-bold text-gray-700 text-sm">
            <UserCircle size={16} className="text-gray-400" /> Admission No.
          </label>
          <input
            type="text"
            value={filters.admission_no || ""}
            onChange={(e) => handleSearchChange("admission_no", e.target.value)}
            className="w-full border-gray-200 focus:border-blue-500 rounded-xl p-2.5 text-sm transition-all"
            placeholder="Search Admission #"
          />
        </div>

        {/* 6. Reset Filters Button */}
        <div className="md:col-span-1 lg:col-span-3 flex items-end">
           <button 
             onClick={() => setFilters({})}
             className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-widest pb-3"
           >
             Clear All Filters
           </button>
        </div>
      </div>
    </div>
  );
};

export default SchoolBusStudentFilterPanel;