"use client";
import React from "react";
import { X, Save, BookOpen } from "lucide-react";

export const SubjectModal = ({
  subjectFormData,
  setSubjectFormData,
  setShowSubjectModal,
  onSave,
  parentSubjects = [],
}) => {
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setSubjectFormData((prev) => ({
      ...prev,
      [name]:
        type === "number" ? Number(value) : value,
    }));
  };

  const handleRadio = (name, value) => {
    setSubjectFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!subjectFormData.name?.trim()) return alert("Subject name is required.");
    onSave(subjectFormData);
    setShowSubjectModal(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Add / Edit Subject</h2>
              <p className="text-gray-500">Configure subject details for this standard</p>
            </div>
          </div>
          <button
            onClick={() => setShowSubjectModal(false)}
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
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Subject Name
              </label>
              <input
                type="text"
                name="name"
                value={subjectFormData.name || ""}
                onChange={handleChange}
                placeholder="Enter subject name"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Subject Code
              </label>
              <input
                type="text"
                name="code"
                value={subjectFormData.code || ""}
                onChange={handleChange}
                placeholder="e.g. MATH101"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Priority
              </label>
              <input
                type="number"
                name="priority"
                value={subjectFormData.priority || ""}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Color
              </label>
              <input
                type="color"
                name="color"
                value={subjectFormData.color || "#4f46e5"}
                onChange={handleChange}
                className="w-full h-12 border border-gray-200 rounded-xl cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                No. of Classes per Week
              </label>
              <input
                type="number"
                name="classesPerWeek"
                value={subjectFormData.classesPerWeek || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Dropdowns */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Accepts Marks/Grade
              </label>
              <select
                name="entryType"
                value={subjectFormData.entryType || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select</option>
                <option value="MARKS">Marks</option>
                <option value="GRADE">Grades</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                CGPA Criteria
              </label>
              <select
                name="cgpaCriteria"
                value={subjectFormData.cgpaCriteria || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select</option>
                <option value="DISPLAY">Display</option>
                <option value="DISPLAY_AND_CALCULATE">Display & Calculate</option>
                <option value="NOT_APPLICABLE">Not Applicable</option>
              </select>
            </div>
          </div>

          {/* Parent Subject Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Parent Subject
            </label>
            <select
              name="parentSubjectId"
              value={subjectFormData.parentSubjectId || ""}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Parent Subject</option>
              {parentSubjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Radio groups */}
          <div className="grid grid-cols-2 gap-6">
            {[
              { key: "isOptional", label: "Is Optional" },
              { key: "acceptsImage", label: "Accepts Image" },
              { key: "acceptsRemarks", label: "Accepts Remarks" },
              { key: "takeAverageInParentExam", label: "Take Average In Parent Exam" },
              { key: "includedInReportCard", label: "Included In Report Card" },
              { key: "acceptsAverageForChildSubjects", label: "Accepts Average For Child Subjects" },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  {label}
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={key}
                      value="1"
                      checked={subjectFormData[key] === "1"}
                      onChange={() => handleRadio(key, "1")}
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={key}
                      value="0"
                      checked={subjectFormData[key] === "0"}
                      onChange={() => handleRadio(key, "0")}
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => setShowSubjectModal(false)}
              className="px-6 py-3 text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2 font-medium"
            >
              <Save className="w-5 h-5" />
              Save Subject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
