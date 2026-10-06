'use client';
import React from "react";
import { 
  Receipt, 
  Users, 
  Hash, 
  Calendar, 
  FilterX 
} from "lucide-react";

const PayoutFilterPanel = ({
  setFilters,
  config,
  isFilterPanelOpen,
  filters,
  feeList = [], // The list of fees for the dropdown
}) => {
  if (!isFilterPanelOpen) return null;

  // ========================== Handlers ==========================
  const handleChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      feeName: "",
      applicableFor: "",
      payId: "",
      startDate: "",
      endDate: "",
      settlementDate: "",
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-6 mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* 1. Fee Name Selection */}
        <div className="flex flex-col">
          <label className="font-bold text-gray-800 text-sm mb-2 flex items-center gap-2">
            <Receipt size={16} className="text-blue-500" /> Fee Name
          </label>
          <select
            value={filters.feeName || ""}
            onChange={(e) => handleChange("feeName", e.target.value)}
            className="w-full border-gray-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 bg-gray-50/50"
          >
            <option value="">All Fees</option>
            {feeList.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Fee Applicable For */}
        <div className="flex flex-col">
          <label className="font-bold text-gray-800 text-sm mb-2 flex items-center gap-2">
            <Users size={16} className="text-emerald-500" /> Fee Applicable For
          </label>
          <select
            value={filters.applicableFor || ""}
            onChange={(e) => handleChange("applicableFor", e.target.value)}
            className="w-full border-gray-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 bg-gray-50/50"
          >
            <option value="">Select Category</option>
            <option value="all">All Students</option>
            <option value="new">New Admissions</option>
            <option value="existing">Existing Students</option>
            <option value="transport">Transport Opted</option>
          </select>
        </div>

        {/* 3. Pay ID */}
        <div className="flex flex-col">
          <label className="font-bold text-gray-800 text-sm mb-2 flex items-center gap-2">
            <Hash size={16} className="text-purple-500" /> Pay ID
          </label>
          <input
            type="text"
            placeholder="Enter Transaction/Pay ID"
            value={filters.payId || ""}
            onChange={(e) => handleChange("payId", e.target.value)}
            className="w-full border-gray-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-purple-500/20 bg-gray-50/50"
          />
        </div>

        {/* 4. Start Date */}
        <div className="flex flex-col">
          <label className="font-bold text-gray-800 text-sm mb-2 flex items-center gap-2">
            <Calendar size={16} className="text-orange-500" /> Start Date
          </label>
          <input
            type="date"
            value={filters.startDate || ""}
            onChange={(e) => handleChange("startDate", e.target.value)}
            className="w-full border-gray-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-orange-500/20 bg-gray-50/50"
          />
        </div>

        {/* 5. End Date */}
        <div className="flex flex-col">
          <label className="font-bold text-gray-800 text-sm mb-2 flex items-center gap-2">
            <Calendar size={16} className="text-orange-600" /> End Date
          </label>
          <input
            type="date"
            value={filters.endDate || ""}
            onChange={(e) => handleChange("endDate", e.target.value)}
            className="w-full border-gray-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-orange-600/20 bg-gray-50/50"
          />
        </div>

        {/* 6. Settlement Date */}
        <div className="flex flex-col">
          <label className="font-bold text-gray-800 text-sm mb-2 flex items-center gap-2">
            <CheckCircle size={16} className="text-blue-600" /> Settlement Date
          </label>
          <input
            type="date"
            value={filters.settlementDate || ""}
            onChange={(e) => handleChange("settlementDate", e.target.value)}
            className="w-full border-gray-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-600/20 bg-gray-50/50"
          />
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
        <button 
          onClick={clearFilters}
          className="flex items-center gap-2 text-xs font-black text-gray-400 hover:text-red-500 uppercase tracking-widest transition-colors"
        >
          <FilterX size={14} /> Reset Filters
        </button>
        
        <button
          onClick={() => handleChange("triggerSearch", Date.now())}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center gap-2"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

// Internal icon component for the settlement date
const CheckCircle = ({ size, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export default PayoutFilterPanel;