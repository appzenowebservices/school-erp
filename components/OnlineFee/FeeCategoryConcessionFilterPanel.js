import React, { useMemo, useState, useEffect } from "react";
import { Filter, X, Loader2 } from "lucide-react";
import { getFeeTypes } from "../../api/fees";

const FeeCategoryConcessionFilterPanel = ({
  setFilters,
  config,
  isFilterPanelOpen,
  filters,
  context
}) => {
  
  /* ------------------------------------------------------------------
     1. DEFINE ALL HOOKS FIRST (Never return before these)
  ------------------------------------------------------------------ */
  const [feeTypes, setFeeTypes] = useState([]);
  const [isLoadingTypes, setIsLoadingTypes] = useState(false);

  // Standards from config
  const standards = config?.standards || [];

  // Fees depend on selected Standard
  const availableFees = useMemo(() => {
    if (!filters.standardId) return [];
    const selectedStd = standards.find((s) => String(s.id) === String(filters.standardId));
    return selectedStd?.fees || [];
  }, [filters.standardId, standards]);

  // Fetch Fee Types when Fee ID changes
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
        20

      );
      setFeeTypes(response?.data?.results?.fee_types  || response || []);
    } catch (error) {
      console.error("Error fetching fee types:", error);
      setFeeTypes([]);
    } finally {
      setIsLoadingTypes(false);
    }
  };
  useEffect(() => {

    fetchTypes();
  }, [filters.feeId]);
  console.log('feeTypes', feeTypes);

  /* ------------------------------------------------------------------
     2. EVENT HANDLERS
  ------------------------------------------------------------------ */
  const handleChange = (field, value) => {
    setFilters((prev) => {
      const updates = { ...prev, [field]: value };
      if (field === "standardId") {
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
      feeId: "",
      feeTypeId: "",
    });
  };

  /* ------------------------------------------------------------------
     3. CONDITIONAL RETURN (Must be AFTER all hooks)
  ------------------------------------------------------------------ */
  if (!isFilterPanelOpen) return null;

  /* ------------------------------------------------------------------
     4. RENDER JSX
  ------------------------------------------------------------------ */
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-6 transition-all">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-blue-600" />
          <h2 className="font-bold text-slate-800">Filter Records</h2>
        </div>
        <button
          onClick={clearFilters}
          className="text-xs font-medium text-slate-500 hover:text-red-600 flex items-center gap-1 transition-colors"
        >
          <X className="w-3 h-3" /> Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Standard Select */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Standard</label>
          <select
            value={filters.standardId || ""}
            onChange={(e) => handleChange("standardId", e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm outline-none"
          >
            <option value="">Select Standard</option>
            {standards.map((std) => (
              <option key={std.id} value={std.id}>{std.name}</option>
            ))}
          </select>
        </div>

        {/* Fee Category Select */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Fee Category</label>
          <select
            disabled={!filters.standardId}
            value={filters.feeId || ""}
            onChange={(e) => handleChange("feeId", e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm outline-none disabled:bg-slate-100 disabled:text-slate-400"
          >
            <option value="">{!filters.standardId ? "Select Standard First" : "Select Fee"}</option>
            {availableFees.map((fee) => (
              <option key={fee.id} value={fee.id}>{fee.name}</option>
            ))}
          </select>
        </div>

        {/* Fee Type Select */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex justify-between">
            Fee Type
            {isLoadingTypes && <Loader2 className="w-3 h-3 animate-spin text-blue-600" />}
          </label>
          <select
            disabled={!filters.feeId || isLoadingTypes}
            value={filters.feeTypeId || ""}
            onChange={(e) => handleChange("feeTypeId", e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm outline-none disabled:bg-slate-100 disabled:text-slate-400"
          >
            <option value="">
              {isLoadingTypes ? "Loading..." : !filters.feeId ? "Select Fee First" : "Select Type"}
            </option>
            {feeTypes.map((type) => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FeeCategoryConcessionFilterPanel;