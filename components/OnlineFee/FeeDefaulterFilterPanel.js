import React from "react";
import { commonIcons } from "../staffManagement/icons";
import { Calendar, Users, Receipt, RefreshCcw, Search } from "lucide-react";

const { FaCheck } = commonIcons;

const FeeDefaulterFilterPanel = ({
  setFilters,
  config,
  isFilterPanelOpen,
  filters,
  students = [], // Pass your student list for the searchable dropdown
  feeList = [],  // Pass the list of fee names/types
}) => {
  if (!isFilterPanelOpen) return null;

  const standards = config?.standards || [];
  // Flatten classes for the multi-select
  const allAvailableClasses = standards.flatMap((std) =>
    std.classes.map(cls => ({ ...cls, stdName: std.name }))
  );

  // ========================== Toggle Logic ==========================
  const toggleMultiSelect = (field, id, allIds) => {
    setFilters((prev) => {
      const current = prev[field] || [];
      const updated = current.includes(id)
        ? current.filter((x) => x !== id)
        : [...current, id];
      return { ...prev, [field]: updated };
    });
  };

  const selectAll = (field, allIds) => {
    setFilters((prev) => {
      const isAllSelected = prev[field]?.length === allIds.length;
      return { ...prev, [field]: isAllSelected ? [] : allIds };
    });
  };

  // ========================== Render ==========================
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-red-100 p-6 mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

        {/* 1. Classes Single-Select */}
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <Users size={18} className="text-blue-500" /> Class
            </h3>
            {/* Optional: Clear button instead of "Toggle All" since it's single select */}
            <button
              onClick={() => setFilters(prev => ({ ...prev, classes: [] }))}
              className="text-[10px] font-black uppercase text-gray-400 hover:text-red-500 transition-colors"
            >
              Clear Selection
            </button>
          </div>

          <div className="border border-gray-100 rounded-xl p-3 h-40 overflow-y-auto space-y-1 bg-gray-50/50">
            {allAvailableClasses.map((cls) => {
              const isSelected = filters.classes?.[0] === cls.id;

              return (
                <button
                  key={cls.id}
                  onClick={() => setFilters(prev => ({
                    ...prev,
                    classes: isSelected ? [] : [cls.id] // Toggles off if clicked again, or sets as only item
                  }))}
                  className={`w-full flex items-center p-2 rounded-lg transition-all border ${isSelected
                      ? "bg-blue-50 border-blue-200 shadow-sm"
                      : "bg-transparent border-transparent hover:bg-white hover:border-gray-200"
                    }`}
                >
                  {/* Radio-style indicator */}
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center mr-3 transition-all
            ${isSelected ? "border-blue-500 bg-blue-500" : "border-gray-300 bg-white"}`}
                  >
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>

                  <span className={`text-sm font-medium ${isSelected ? "text-blue-700" : "text-gray-700"}`}>
                    {cls.stdName} - {cls.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Fees Multi-Select */}
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <Receipt size={18} className="text-emerald-500" /> Fees
            </h3>
            <button
              onClick={() => selectAll('feeIds', feeList.map(f => f.id))}
              className="text-[10px] font-black uppercase text-emerald-600 hover:underline"
            >
              Toggle All
            </button>
          </div>
          <div className="border border-gray-100 rounded-xl p-3 h-40 overflow-y-auto space-y-2 bg-gray-50/50">
            {feeList.map((fee) => (
              <label key={fee.id} className="flex items-center group cursor-pointer">
                <div
                  onClick={() => toggleMultiSelect('feeIds', fee.id)}
                  className={`w-5 h-5 rounded border flex items-center justify-center mr-3 transition-all
                  ${filters.feeIds?.includes(fee.id) ? "bg-emerald-500 border-emerald-500" : "bg-white border-gray-300 group-hover:border-emerald-400"}`}
                >
                  {filters.feeIds?.includes(fee.id) && <FaCheck size={10} className="text-white" />}
                </div>
                <span className="text-sm font-medium text-gray-700">{fee.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 3. Operational Filters */}
        <div className="space-y-6">
          {/* Defaulter As On */}
          <div>
            <label className="font-bold text-gray-800 text-sm mb-2 flex items-center gap-2">
              <Calendar size={16} className="text-red-500" /> Defaulter As On
            </label>
            <input
              type="date"
              value={filters.asOnDate || ""}
              onChange={(e) => setFilters(prev => ({ ...prev, asOnDate: e.target.value }))}
              className="w-full border-gray-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-red-500/20"
            />
          </div>

          {/* Searchable Student Dropdown */}
          <div>
            <label className="font-bold text-gray-800 text-sm mb-2 flex items-center gap-2">
              <Search size={16} className="text-blue-500" /> Student
            </label>
            <div className="relative">
              <select
                value={filters.studentId || ""}
                onChange={(e) => setFilters(prev => ({ ...prev, studentId: e.target.value }))}
                className="w-full border-gray-200 rounded-xl p-2.5 text-sm appearance-none bg-white focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">All Students</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                ))}
              </select>
              <div className="absolute right-3 top-3 text-gray-400 pointer-events-none">
                <Search size={14} />
              </div>
            </div>
          </div>

          {/* Renewal Status */}
          <div>
            <label className="font-bold text-gray-800 text-sm mb-2 flex items-center gap-2">
              <RefreshCcw size={16} className="text-amber-500" /> Renewal Status
            </label>
            <select
              value={filters.renewalStatus || ""}
              onChange={(e) => setFilters(prev => ({ ...prev, renewalStatus: e.target.value }))}
              className="w-full border-gray-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-amber-500/20"
            >
              <option value="">Select Status</option>
              <option value="pending">Pending Renewal</option>
              <option value="renewed">Renewed</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
        <button
          onClick={() => setFilters({})}
          className="text-xs font-black text-gray-400 hover:text-red-500 uppercase tracking-widest transition-colors"
        >
          Clear All Filters
        </button>
        <button
          onClick={() => setFilters(prev => ({ ...prev, triggerSearch: Date.now() }))}
          className="bg-red-600 hover:bg-red-700 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-red-200 transition-all active:scale-95"
        >
          Generate Defaulter List
        </button>
      </div>
    </div>
  );
};

export default FeeDefaulterFilterPanel;