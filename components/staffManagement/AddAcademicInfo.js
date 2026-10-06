import React, { useState } from "react";
import { GraduationCap, Briefcase, CalendarDays } from "lucide-react";
import { HiDocumentDuplicate } from "react-icons/hi";

const AddAcademicInfo = ({ setFormData, formData }) => {
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    let newErrors = {};
    if (!formData.academicQualification)
      newErrors.academicQualification = "Academic qualification is required";
    if (!formData.professionalQualification)
      newErrors.professionalQualification =
        "Professional qualification is required";
    if (!formData.yearOfPassing)
      newErrors.yearOfPassing = "Year of passing is required";
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
      console.log("Academic info submitted:", formData);
    }
  };

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[80vh] overflow-y-auto p-4"
      >
        {/* Academic Qualification */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
            Academic Qualification
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <GraduationCap className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="academicQualification"
              value={formData.academicQualification || ""}
              onChange={(e) =>
                handleChange("academicQualification", e.target.value)
              }
              placeholder="Enter highest academic qualification"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"
            />
          </div>
          {errors.academicQualification && (
            <p className="mt-1 text-sm text-red-600">
              {errors.academicQualification}
            </p>
          )}
        </div>

        {/* Professional Qualification */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
            Professional Qualification
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Briefcase className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="professionalQualification"
              value={formData.professionalQualification || ""}
              onChange={(e) =>
                handleChange("professionalQualification", e.target.value)
              }
              placeholder="Enter professional qualification"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"
            />
          </div>
          {errors.professionalQualification && (
            <p className="mt-1 text-sm text-red-600">
              {errors.professionalQualification}
            </p>
          )}
        </div>

        {/* Experience */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
            Experience (in years)
          </label>
          <div className="mt-1 relative">
            <HiDocumentDuplicate className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />

            <input
              type="number"
              name="experience"
              value={formData.experience || ""}
              onChange={(e) => handleChange("experience", e.target.value)}
              placeholder="Enter total teaching/working experience"
              min="0"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"
            />
          </div>
        </div>

        {/* Year of Passing */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
            Year of Passing
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CalendarDays className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              name="yearOfPassing"
              value={formData.yearOfPassing || ""}
              onChange={(e) => handleChange("yearOfPassing", e.target.value)}
              placeholder="Enter year of passing"
              min="1900"
              max={new Date().getFullYear()}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"
            />
          </div>
          {errors.yearOfPassing && (
            <p className="mt-1 text-sm text-red-600">{errors.yearOfPassing}</p>
          )}
        </div>

        {/* Submit */}

      </form>
    </div>
  );
};

export default AddAcademicInfo;
