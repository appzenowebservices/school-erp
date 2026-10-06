"use client";
import { CalendarDays, X } from "lucide-react";
import React, { useState, useEffect } from "react";

const EditExamForm = ({
  standards = [],
  exams = [],
  reportCardFormats = [],
  existingExam = {},
  onSubmit,
}) => {
  const [form, setForm] = useState({
    standard_ids: existingExam.standard_ids || [],
    exam_ids: existingExam.exam_ids || [],
    no_of_working_days: existingExam.no_of_working_days || "",
    report_card_format_id: existingExam.report_card_format_id || "",
    marks_submission_deadline_date:
      existingExam.marks_submission_deadline_date?.split(" ")[0] || "",
    marks_submission_deadline_time:
      existingExam.marks_submission_deadline_date?.split(" ")[1] || "",
    delivery_date: existingExam.delivery_date || "",
    ptm_date: existingExam.ptm_date || "",
    report_card_publish_date: existingExam.report_card_publish_date || "",
    report_card_publish_time: existingExam.report_card_publish_time || "",
    is_delivered: existingExam.is_delivered || "0",
    is_applicable_for_delivery:
      existingExam.is_applicable_for_delivery || "1",
    is_displayable: existingExam.is_displayable || "1",
    is_displayable_on_report_card_header:
      existingExam.is_displayable_on_report_card_header || "1",
  });

  const handleChange = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleMultiSelect = (key, e) => {
    const values = Array.from(e.target.selectedOptions, (opt) => opt.value);
    setForm((prev) => ({ ...prev, [key]: values }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white  rounded-2xl p-4 w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <CalendarDays className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Edit Exam</h2>
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
        </div>        <form
          onSubmit={handleSubmit}
          className="space-y-8 p-6 bg-white  rounded-2xl  mx-auto"
        >


          {/* Standards */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Standards
            </label>
            <select
              multiple
              value={form.standard_ids}
              onChange={(e) => handleMultiSelect("standard_ids", e)}
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
            >
              {standards.map((std) => (
                <option key={std.id} value={std.id}>
                  {std.name}
                </option>
              ))}
            </select>
          </div>

          {/* Exams */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Exams
            </label>
            <select
              multiple
              value={form.exam_ids}
              onChange={(e) => handleMultiSelect("exam_ids", e)}
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
            >
              {exams
                .filter((ex) =>
                  form.standard_ids.length > 0
                    ? form.standard_ids.includes(ex.standard_id)
                    : true
                )
                .map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name}
                  </option>
                ))}
            </select>
          </div>

          {/* No of Working Days */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              No. of Working Days
            </label>
            <input
              type="number"
              value={form.no_of_working_days}
              onChange={(e) => handleChange("no_of_working_days", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Report Card Format */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Report Card Format
            </label>
            <select
              value={form.report_card_format_id}
              onChange={(e) =>
                handleChange("report_card_format_id", e.target.value)
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Format</option>
              {reportCardFormats.map((fmt) => (
                <option key={fmt.id} value={fmt.id}>
                  {fmt.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date & Time Fields */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Marks Submission Deadline (Date)
              </label>
              <input
                type="date"
                value={form.marks_submission_deadline_date}
                onChange={(e) =>
                  handleChange("marks_submission_deadline_date", e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Marks Submission Deadline (Time)
              </label>
              <input
                type="time"
                value={form.marks_submission_deadline_time}
                onChange={(e) =>
                  handleChange("marks_submission_deadline_time", e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Delivery Date
              </label>
              <input
                type="date"
                value={form.delivery_date}
                onChange={(e) => handleChange("delivery_date", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                PTM Date
              </label>
              <input
                type="date"
                value={form.ptm_date}
                onChange={(e) => handleChange("ptm_date", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Report Card Publish Date
              </label>
              <input
                type="date"
                value={form.report_card_publish_date}
                onChange={(e) =>
                  handleChange("report_card_publish_date", e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Report Card Publish Time
              </label>
              <input
                type="time"
                value={form.report_card_publish_time}
                onChange={(e) =>
                  handleChange("report_card_publish_time", e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Radios */}
          <div className="grid grid-cols-2 gap-6">
            {[
              { key: "is_delivered", label: "Is Delivered" },
              { key: "is_applicable_for_delivery", label: "Is Applicable for Delivery" },
              { key: "is_displayable", label: "Display On Admin" },
              { key: "is_displayable_on_report_card_header", label: "Displayable On RC" },
            ].map(({ key, label }) => (
              <div key={key}>
                <span className="block text-sm font-semibold text-gray-700 mb-2">
                  {label}
                </span>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={key}
                      value="1"
                      checked={form[key] === "1"}
                      onChange={() => handleChange(key, "1")}
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={key}
                      value="0"
                      checked={form[key] === "0"}
                      onChange={() => handleChange(key, "0")}
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditExamForm;
