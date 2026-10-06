import React, { useState } from "react";
import { FileText, IdCard, BadgeCheck, CalendarDays } from "lucide-react";
import { HiDocumentDuplicate } from "react-icons/hi";

const AddDocumentInfo = ({ setFormData, formData }) => {
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    let newErrors = {};
    if (!formData.aadhaar) newErrors.aadhaar = "Aadhaar number is required";
    if (!formData.pan) newErrors.pan = "PAN number is required";
    if (!formData.employeeId) newErrors.employeeId = "Employee ID is required";
    if (!formData.appointmentType)
      newErrors.appointmentType = "Type of appointment is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitted(true);
      console.log("Document info submitted:", formData);
    }
  };

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[80vh] overflow-y-auto p-4"
      >
        {/* Aadhaar Card Number */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
            Aadhaar Card Number
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IdCard className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="aadhaar"
              value={formData.aadhaar || ""}
              onChange={(e) => handleChange("aadhaar", e.target.value)}
              placeholder="Enter Aadhaar number"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"

            />
          </div>
          {errors.aadhaar && (
            <p className="mt-1 text-sm text-red-600">{errors.aadhaar}</p>
          )}
        </div>

        {/* PAN Number */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
            PAN Number
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FileText className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="pan"
              value={formData.pan || ""}
              onChange={(e) => handleChange("pan", e.target.value)}
              placeholder="Enter PAN number"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"
            />
          </div>
          {errors.pan && (
            <p className="mt-1 text-sm text-red-600">{errors.pan}</p>
          )}
        </div>

        {/* Employee ID */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
            Employee ID
          </label>
          <div className="mt-1 relative">
            <HiDocumentDuplicate className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />

            <input
              type="text"
              name="employeeId"
              value={formData.employeeId || ""}
              onChange={(e) => handleChange("employeeId", e.target.value)}
              placeholder="Enter employee ID"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"
            />
            {errors.employeeId && (
              <p className="mt-1 text-sm text-red-600">{errors.employeeId}</p>
            )}
          </div>
        </div>

        {/* Special Designation */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
            Special Designation
          </label>
          <div className="mt-1 relative">
            <HiDocumentDuplicate className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />

            <input
              type="text"
              name="specialDesignation"
              value={formData.specialDesignation || ""}
              onChange={(e) => handleChange("specialDesignation", e.target.value)}
              placeholder="Enter special designation (if any)"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"
            />
          </div>
        </div>

        {/* Date of Retirement */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
            Date of Retirement
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CalendarDays className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              name="retirementDate"
              value={formData.retirementDate || ""}
              onChange={(e) => handleChange("retirementDate", e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"
            />
          </div>
        </div>

        {/* Type of Appointment */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
            Type of Appointment
          </label>
          <select
            name="appointmentType"
            value={formData.appointmentType || ""}
            onChange={(e) => handleChange("appointmentType", e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"
          >
            <option value="">Select Type</option>
            <option value="permanent">Permanent</option>
            <option value="contract">Contract</option>
            <option value="temporary">Temporary</option>
          </select>
          {errors.appointmentType && (
            <p className="mt-1 text-sm text-red-600">
              {errors.appointmentType}
            </p>
          )}
        </div>

      </form>
    </div>
  );
};

export default AddDocumentInfo;
