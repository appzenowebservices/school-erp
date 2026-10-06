"use client";
import React from "react";
import { X, Save, CalendarDays } from "lucide-react";

const ExamModal = ({
  examFormData,
  setExamFormData,
  setShowExamModal,
  onSave,
  standards = [],
  reportCardFormats = [],
  submitExamAdd
}) => {
  console.log('examFormData ====',examFormData);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setExamFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleRadio = (name, value) => {
    setExamFormData((prev) => ({ ...prev, [name]: value }));
  };

  const radioYesNo = (key, label) => {
    const currentValue = examFormData[key] ?? "0";

    return (
      <div key={key}>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={key}
              value="1"
              checked={currentValue === "1"}
              onChange={() => handleRadio(key, "1")}
            />
            <span>Yes</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={key}
              value="0"
              checked={currentValue === "0"}
              onChange={() => handleRadio(key, "0")}
            />
            <span>No</span>
          </label>
        </div>
      </div>
    );
  };


  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <CalendarDays className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Add Exam</h2>
              <p className="text-gray-500">
                Configure exam details and report card preferences
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowExamModal(false)}
            className="cursor-pointer text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Exam Name
              </label>
              <input
                type="text"
                name="name"
                value={examFormData.name || ""}
                onChange={handleChange}
                placeholder="Enter exam name"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Exam Code
              </label>
              <input
                type="text"
                name="examCode"
                value={examFormData.code || ""}
                onChange={handleChange}
                placeholder="e.g. TERM1-EXAM"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Multi-select Standards */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Standards
            </label>

            <div className="relative">
              <select
                multiple
                name="standards"
                value={examFormData.standard?.id || []}
                onChange={(e) =>
                  setExamFormData((prev) => ({
                    ...prev,
                    standards: Array.from(e.target.selectedOptions, (opt) => opt.value),
                  }))
                }
                className="w-full h-40 px-4 py-3 text-sm border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm transition-all duration-200"
              >
                {standards.map((std) => (
                  <option
                    key={std.id}
                    value={std.id}
                    className="py-2 text-gray-700 hover:bg-indigo-50"
                  >
                    {std.name}
                  </option>
                ))}
              </select>

              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {examFormData.standards?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {examFormData.standard.map((id) => {
                  const std = standards.find((s) => s.id === id);
                  return (
                    <span
                      key={id}
                      className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium"
                    >
                      {std?.name || "Unknown"}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Numeric fields */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Serial No.
              </label>
              <input
                type="number"
                name="serialNo"
                value={examFormData.serial_number || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Max Marks
              </label>
              <input
                type="number"
                name="maxMarks"
                value={examFormData.maxMarks || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pass Marks
              </label>
              <input
                type="number"
                name="passMarks"
                value={examFormData.passMarks || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl"
              />
            </div>
          </div>

          {/* Date Fields */}
          <div className="grid grid-cols-3 gap-6">
            {[
              { key: "startDate", label: "Start Date" },
              { key: "endDate", label: "End Date" },
              { key: "marksSubmissionDeadline", label: "Marks Submission Deadline" },
              { key: "deliveryDate", label: "Delivery Date" },
              { key: "ptmDate", label: "PTM Date" },
              { key: "publishDate", label: "Report Card Publish Date" },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {label}
                </label>
                <input
                  type="date"
                  name={key}
                  value={examFormData[key] || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                />
              </div>
            ))}
          </div>

          {/* Dropdowns */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Assessment Period
              </label>
              <input
                type="text"
                name="assessmentPeriod"
                value={examFormData.assessmentPeriod || ""}
                onChange={handleChange}
                placeholder="e.g. April - June 2025"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Report Card Format
              </label>
              <select
                name="reportCardFormat"
                value={examFormData.reportCardFormat || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl"
              >
                <option value="">Select Format</option>
                {reportCardFormats.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Radio groups */}
          <div className="grid grid-cols-2 gap-6">
            {[
              ["displayOnAdmin", "Display on Admin"],
              ["displayOnRC", "Displayable on Report Card"],
              ["pattern", "Pattern (Marks or Grades)"],
              ["marksEntryFormat", "Marks Entry Format (Soft/Hard)"],
              ["isParentAcceptAvg", "Parent Subject Accepts Average Marks"],
              ["isQRCodeRequired", "QR Code Required in Report Card"],
              ["is_applicable_for_delivery", "Applicable for Delivery"],
              ["takeBestAverage", "Take Best Average"],
              ["blockReportCard", "Block Report Card"],
              ["blockAnalysis", "Block Analysis"],
              ["roundOffMarks", "Round Off Marks"],
              ["isSchedulePublished", "Schedule Published"],
              ["blockFeeDefaulterRC", "Block Fee Defaulter Report Card"],
            ].map(([key, label]) => radioYesNo(key, label))}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-4 pt-6 border-t mt-8">
            <button
              type="button"
              onClick={() => setShowExamModal(false)}
              className="px-6 py-3 text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={submitExamAdd}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2 font-medium"
            >
              <Save className="w-5 h-5" />
              Save Exam
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamModal;
