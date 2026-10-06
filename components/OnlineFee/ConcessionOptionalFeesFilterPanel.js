import React, { useMemo, useState, useEffect } from "react";
import { Filter, X, Loader2, Search } from "lucide-react";
import { getFeeTypes } from "../../api/fees";

const ConcessionOptionalFeesFilterPanel = ({
  setFilters,
  config,
  isFilterPanelOpen,
  filters,
  context
}) => {
  /* ------------------------------------------------------------------
     1. DEFINE ALL HOOKS FIRST
  ------------------------------------------------------------------ */
  const [feeTypes, setFeeTypes] = useState([]);
  const [isLoadingTypes, setIsLoadingTypes] = useState(false);

  const standards = config?.standards || [];

  // 1. Classes depend on selected Standard
  const availableClasses = useMemo(() => {
    if (!filters.standardId) return [];
    const selectedStd = standards.find((s) => String(s.id) === String(filters.standardId));
    return selectedStd?.classes || []; 
  }, [filters.standardId, standards]);

  // 2. Fees depend on selected Standard
  const availableFees = useMemo(() => {
    if (!filters.standardId) return [];
    const selectedStd = standards.find((s) => String(s.id) === String(filters.standardId));
    return selectedStd?.fees || [];
  }, [filters.standardId, standards]);

  // 3. Fetch Fee Types (Async)
  useEffect(() => {
    const fetchTypes = async () => {
      if (!filters.feeId) {
        setFeeTypes([]);
        return;
      }
      setIsLoadingTypes(true);
      try {
        const response = await getFeeTypes(
          context?.profileId,
          context?.session,
          1,
          50 // Increased limit to ensure all types are fetched
        );
        // Based on your specific API mapping:
        setFeeTypes(response?.data?.results?.fee_types || response?.results || []);
      } catch (error) {
        console.error("Error fetching fee types:", error);
        setFeeTypes([]);
      } finally {
        setIsLoadingTypes(false);
      }
    };

    fetchTypes();
  }, [filters.feeId, context?.profileId, context?.session]);

  /* ------------------------------------------------------------------
     2. EVENT HANDLERS
  ------------------------------------------------------------------ */
  const handleChange = (field, value) => {
    setFilters((prev) => {
      const updates = { ...prev, [field]: value };
      
      // Cascade Reset Logic
      if (field === "standardId") {
        updates.classId = ""; // Reset class
        updates.feeId = "";
        updates.feeTypeId = "";
      }
      if (field === "feeId") {
        updates.feeTypeId = "";
      }
      return updates;
    });
  };

  const clearFilters = () => {
    setFilters({
      standardId: "",
      classId: "",
      feeId: "",
      feeTypeId: "",
      registrationNo: "",
      admissionNo: "",
    });
  };

  if (!isFilterPanelOpen) return null;

  /* ------------------------------------------------------------------
     3. RENDER JSX
  ------------------------------------------------------------------ */
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6 transition-all animate-in fade-in slide-in-from-top-2">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Filter className="w-4 h-4 text-blue-600" />
          </div>
          <h2 className="font-bold text-slate-800 text-lg">Filter Records</h2>
        </div>
        <button
          onClick={clearFilters}
          className="group text-xs font-semibold text-slate-500 hover:text-red-600 flex items-center gap-1.5 py-1.5 px-3 rounded-md hover:bg-red-50 transition-all"
        >
          <X className="w-3.5 h-3.5" /> Clear All Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* ========== STANDARD ========== */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Standard</label>
          <select
            value={filters.standardId || ""}
            onChange={(e) => handleChange("standardId", e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          >
            <option value="">All Standards</option>
            {standards.map((std) => (
              <option key={std.id} value={std.id}>{std.name}</option>
            ))}
          </select>
        </div>

        {/* ========== CLASS (Dependent) ========== */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Class</label>
          <select
            disabled={!filters.standardId}
            value={filters.classId || ""}
            onChange={(e) => handleChange("classId", e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm outline-none disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          >
            <option value="">{!filters.standardId ? "Select Standard First" : "All Classes"}</option>
            {availableClasses.map((cls) => (
              <option key={cls.id} value={cls.id}>{cls.name}</option>
            ))}
          </select>
        </div>

        {/* ========== FEE CATEGORY (Dependent) ========== */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Fee Category</label>
          <select
            disabled={!filters.standardId}
            value={filters.feeId || ""}
            onChange={(e) => handleChange("feeId", e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm outline-none disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          >
            <option value="">{!filters.standardId ? "Select Standard First" : "Select Fee Category"}</option>
            {availableFees.map((fee) => (
              <option key={fee.id} value={fee.id}>{fee.name}</option>
            ))}
          </select>
        </div>

        {/* ========== FEE TYPE (Dependent) ========== */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1 flex justify-between">
            Fee Type
            {isLoadingTypes && <Loader2 className="w-3 h-3 animate-spin text-blue-600" />}
          </label>
          <select
            disabled={!filters.feeId || isLoadingTypes}
            value={filters.feeTypeId || ""}
            onChange={(e) => handleChange("feeTypeId", e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm outline-none disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          >
            <option value="">
              {isLoadingTypes ? "Loading..." : !filters.feeId ? "Select Fee Category First" : "All Fee Types"}
            </option>
            {feeTypes.map((type) => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
        </div>

        {/* ========== ADMISSION NUMBER ========== */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Admission No.</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search Admission No."
              value={filters.admissionNo || ""}
              onChange={(e) => handleChange("admissionNo", e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 pl-9 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* ========== REGISTRATION NUMBER ========== */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Registration No.</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search Registration No."
              value={filters.registrationNo || ""}
              onChange={(e) => handleChange("registrationNo", e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 pl-9 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default ConcessionOptionalFeesFilterPanel;