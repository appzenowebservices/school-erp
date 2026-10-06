import React from "react";
import { commonIcons } from "../staffManagement/icons";

const VariableFeeFilterPanel = ({
  setFilters,
  config,
  isFilterPanelOpen,
  filters,
  fees,
  feeTypes_
}) => {
  if (!isFilterPanelOpen) return null;

  const standards = config?.standards || [];

  /* ------------------------ Handle Standard Change ------------------------ */
  const handleStandardChange = (e) => {
    const stdId = Number(e.target.value);

    setFilters((prev) => ({
      ...prev,
      standards: stdId ? [stdId] : [],
      classes: {}          // reset classes when standard changes
    }));
  };

  /* ------------------------ Handle Class Change ------------------------ */
  const handleClassChange = (e) => {
    const classId = Number(e.target.value);

    const selectedStd = filters.standards?.[0] || null;

    if (!selectedStd) return;

    setFilters((prev) => ({
      ...prev,
      classes: {
        [selectedStd]: classId ? [classId] : []
      }
    }));
  };

  /* ------------------------ Fee Type ------------------------ */
  const handleFeeTypeChange = (e) => {
    setFilters((prev) => ({ ...prev, fee_type: e.target.value }));
  };

  /* ------------------------ Fees ------------------------ */
  const handleFeeChange = (e) => {
    setFilters((prev) => ({ ...prev, fee: e.target.value }));
  };

  /* ------------------------ Registration Number ------------------------ */
  const handleRegNoChange = (e) => {
    setFilters((prev) => ({ ...prev, reg_no: e.target.value }));
  };

  /* ------------------------ Mobile Number ------------------------ */
  const handleMobileChange = (e) => {
    setFilters((prev) => ({ ...prev, mobile: e.target.value }));
  };

  const selectedStdId = filters.standards?.[0] || null;
  const selectedStd = standards.find((s) => s.id == selectedStdId);
  const classes = selectedStd?.classes || [];
// console.log("selectedStd",selectedStd);

  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 p-6 mb-8">
      <div className="grid md:grid-cols-4 gap-6">

        {/* ========== STANDARD DROPDOWN ========== */}
        <div className="md:col-span-1">
          <h3 className="font-semibold text-gray-800 mb-3">Standard</h3>

          <select
            value={selectedStdId || ""}
            onChange={handleStandardChange}
            className="w-full border-gray-300 rounded-lg p-2 text-sm"
          >
            <option value="">Select Standard</option>

            {standards.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* ========== CLASS DROPDOWN ========== */}
        <div className="md:col-span-1">
          <h3 className="font-semibold text-gray-800 mb-3">Class</h3>

          <select
            value={filters.classes?.[selectedStdId]?.[0] || ""}
            onChange={handleClassChange}
            className="w-full border-gray-300 rounded-lg p-2 text-sm"
            disabled={!selectedStdId}
          >
            <option value="">Select Class</option>

            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>

        {/* ========== FEE TYPE ========== */}
        <div className="md:col-span-1">
          <h3 className="font-semibold text-gray-800 mb-3">Fee Types</h3>

          <select
            value={filters.fee_type || ""}
            onChange={handleFeeTypeChange}
            className="w-full border-gray-300 rounded-lg p-2 text-sm"
          >
            <option value="">Select Fee Type</option>

            {feeTypes_
              ?.filter((ft) => Number(ft.is_variable) === 1)
              .map((ft) => (
                <option key={ft.id} value={ft.id}>
                  {ft.name}
                </option>
              ))}
          </select>
        </div>

        {/* ========== FEES ========== */}
        <div className="md:col-span-1">
          <h3 className="font-semibold text-gray-800 mb-3">Fees</h3>

          <select
            value={filters.fee || ""}
            onChange={handleFeeChange}
            className="w-full border-gray-300 rounded-lg p-2 text-sm"
          >
            <option value="">Select Fee</option>

            {fees.map((fee) => (
              <option key={fee.id} value={fee.id}>
                {fee.name}
              </option>
            ))}
          </select>
        </div>

        {/* ========== REGISTRATION NUMBER ========== */}
        <div className="md:col-span-1">
          <h3 className="font-semibold text-gray-800 mb-3"> Admission Number</h3>

          <input
            type="number"
            value={filters.reg_no || ""}
            onChange={handleRegNoChange}
            className="w-full border-gray-300 rounded-lg p-2 text-sm"
            placeholder="Enter Admission No"
          />
        </div>

        {/* ========== MOBILE NUMBER ========== */}
        <div className="md:col-span-1">
          <h3 className="font-semibold text-gray-800 mb-3">Registration Number.</h3>

          <input
            type="number"
            value={filters.mobile || ""}
            onChange={handleMobileChange}
            className="w-full border-gray-300 rounded-lg p-2 text-sm"
            placeholder="Enter Reg No"
          />
        </div>

      </div>
    </div>
  );
};

export default VariableFeeFilterPanel;
