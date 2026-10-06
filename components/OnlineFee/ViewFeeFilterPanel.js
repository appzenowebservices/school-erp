import React, { useState, useEffect } from "react";
import { commonIcons, moduleIcons, staffStatusIcons } from "../staffManagement/icons";

// ===============================================================================
const { FaCheck } = commonIcons;

// ===============================================================================
const ViewFeeFilterPanel = ({
  setFilters,
  config,
  isFilterPanelOpen,
  staffStatus,
  filters,
  toggleFilter,
  accountStatus,
}) => {
  if (!isFilterPanelOpen) return null;

  const titles = config?.titles;
  const feeFrequency = config?.fee_frequency;
  const standards = config?.standards || [];

  // ===============================================================================
  const toggleStandard = (id) => {
    setFilters((prev) => {
      const current = prev.standards || [];
      const updated = current.includes(id)
        ? current.filter((x) => x !== id)
        : [...current, id];
      return { ...prev, standards: updated };
    });
  };

  const toggleAll = () => {
    setFilters((prev) => {
      const allIds = standards.map((std) => std.id);
      const isAllSelected =
        prev.standards?.length === standards.length && standards.length > 0;
      return { ...prev, standards: isAllSelected ? [] : allIds };
    });
  };

  // ===============================================================================
  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 p-6 mb-8">
      <div className="grid md:grid-cols-4 gap-6">
        {/* ========== Standards Section =========================================== */}
        <div className="md:col-span-2 lg:col-span-1">
          <h3 className="font-semibold text-gray-800 mb-3">Standards</h3>

          {/* Select All / Deselect All */}
          <div className="flex items-center mb-3">
            <button
              onClick={toggleAll}
              className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              <div
                className={`w-5 h-5 mr-2 rounded border flex items-center justify-center transition
                ${
                  filters.standards?.length === standards.length &&
                  standards.length > 0
                    ? "bg-blue-500 border-blue-500"
                    : "border-gray-300"
                }`}
              >
                {filters.standards?.length === standards.length &&
                  standards.length > 0 && (
                    <FaCheck size={12} className="text-white" />
                  )}
              </div>
              {filters.standards?.length === standards.length &&
              standards.length > 0
                ? "Deselect All"
                : "Select All"}
            </button>
          </div>

          {/* Standards List */}
          <div className="grid sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
            {standards.length === 0 ? (
              <p className="text-gray-500 text-sm col-span-full">
                No standards found.
              </p>
            ) : (
              standards.map((std) => (
                <button
                  key={std.id}
                  onClick={() => toggleStandard(std.id)}
                  className="flex items-center text-gray-700 hover:text-blue-600 w-full"
                >
                  <div
                    className={`cursor-pointer w-5 h-5 rounded border flex items-center justify-center mr-3 transition
                    ${
                      filters.standards?.includes(std.id)
                        ? "bg-blue-500 border-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {filters.standards?.includes(std.id) && (
                      <FaCheck size={12} className="text-white" />
                    )}
                  </div>
                  <span className="text-sm font-medium">{std.name}</span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* ========== Fee Type =================================================== */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Fee Type</h3>
          <div className="flex flex-wrap gap-2">
            {feeFrequency?.map((type) => (
              <label
                key={type?.key}
                className={`flex items-center px-3 py-1.5 rounded-full border text-sm cursor-pointer transition
                ${
                  filters.feeType === type?.value
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-300 text-gray-700 hover:border-blue-400"
                }`}
              >
                <input
                  type="radio"
                  name="feeType"
                  value={type?.value}
                  checked={filters.feeType === type?.value}
                  onChange={() =>
                    setFilters((prev) => ({ ...prev, feeType: type?.value }))
                  }
                  className="hidden"
                />
                {type?.value}
              </label>
            ))}
          </div>
        </div>

        {/* ========== Enabled ===================================================== */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Enabled</h3>
          <div className="flex gap-3">
            {["YES", "NO"].map((type) => (
              <label
                key={type}
                className={`flex items-center px-3 py-1.5 rounded-full border text-sm cursor-pointer transition
                ${
                  filters.enabled === type
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-300 text-gray-700 hover:border-blue-400"
                }`}
              >
                <input
                  type="radio"
                  name="enabled"
                  value={type}
                  checked={filters.enabled === type}
                  onChange={() =>
                    setFilters((prev) => ({ ...prev, enabled: type }))
                  }
                  className="hidden"
                />
                {type}
              </label>
            ))}
          </div>
        </div>

        {/* ========== Hostel Fee ================================================= */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Hostel Fee</h3>
          <div className="flex gap-3">
            {["YES", "NO"].map((type) => (
              <label
                key={type}
                className={`flex items-center px-3 py-1.5 rounded-full border text-sm cursor-pointer transition
                ${
                  filters.hostelFee === type
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-300 text-gray-700 hover:border-blue-400"
                }`}
              >
                <input
                  type="radio"
                  name="hostelFee"
                  value={type}
                  checked={filters.hostelFee === type}
                  onChange={() =>
                    setFilters((prev) => ({ ...prev, hostelFee: type }))
                  }
                  className="hidden"
                />
                {type}
              </label>
            ))}
          </div>
        </div>

        {/* ========== Dates Section ============================================= */}
        <div className="md:col-span-2 grid sm:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Start Date</h3>
            <input
              type="date"
              value={filters.startDate || ""}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, startDate: e.target.value }))
              }
              className="w-full border border-gray-300 rounded-md p-2 text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-2">End Date</h3>
            <input
              type="date"
              value={filters.endDate || ""}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, endDate: e.target.value }))
              }
              className="w-full border border-gray-300 rounded-md p-2 text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Due Date</h3>
            <input
              type="date"
              value={filters.dueDate || ""}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, dueDate: e.target.value }))
              }
              className="w-full border border-gray-300 rounded-md p-2 text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>
        </div>
      </div>

      {/* ========== Search Button =============================================== */}
      {/* <div className="mt-8 flex justify-end">
        <button
          onClick={() =>
            setFilters((prev) => ({ ...prev, isSearch: !prev.isSearch }))
          }
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-md font-medium transition"
        >
          Search
        </button>
      </div> */}
    </div>
  );
};

// ===============================================================================
export default ViewFeeFilterPanel;
