import React, { useState } from "react";
import {
  User,
  Calendar,
  Phone,
  Mail,
  Heart,
  Users,
  UserPlus,
  ShieldCheck,
  User2,
  MapIcon,
} from "lucide-react";
import { BiCategory } from "react-icons/bi";

const AddStaffPersonalInfo = ({
  setFormData,
  formData,
  categories,
  bloodGroups,

}) => {

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.dateOfBirth) newErrors.date_of_birth = "Required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.phone) newErrors.phone_no = "Phone number is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitted(true);
      console.log("Personal Info Submitted:", formData);
    }
  };

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[80vh] overflow-y-auto p-4"
      >

        {/* Row 1: DOB & DOJ */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
              Date of Birth
            </label>
            <div className="mt-1 relative">
              <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="date"
                value={formData.dateOfBirth || ""}
                onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"                placeholder="Enter full name"
              />
            </div>
            {errors.date_of_birth && (
              <p className="mt-1 text-sm text-red-600">
                {errors.date_of_birth}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
              Date of Joining
            </label>
            <div className="mt-1 relative">
              <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="date"
                value={formData.joiningDate || ""}
                onChange={(e) => handleChange("joiningDate", e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"                placeholder="Enter full name"
              />
            </div>
          </div>
        </div>

        {/* Row 2: Notification + Coordinator */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.invoiceNotificationEnabled || false}
              onChange={(e) =>
                handleChange("invoiceNotificationEnabled", e.target.checked)
              }
              className="peer appearance-none h-5 w-5 border border-gray-400 rounded-md checked:bg-indigo-600 checked:border-indigo-600 transition-all duration-200 relative
    focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1"            />
            <label className="text-sm text-gray-700">
              Enabled for Invoice Notification
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.classCoordinator || false}
              onChange={(e) =>
                handleChange("classCoordinator", e.target.checked)
              }
              className="peer appearance-none h-5 w-5 border border-gray-400 rounded-md checked:bg-indigo-600 checked:border-indigo-600 transition-all duration-200 relative
    focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1"            />
            <label className="text-sm text-gray-700">Is Class Coordinator</label>
          </div>
        </div>

        {/* Row 3: Category + Blood Group */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
              Category
            </label>
            <div className="mt-1 relative">

              <BiCategory className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />

              <select
                value={formData.category || ""}
                onChange={(e) => handleChange("category", e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"                placeholder="Enter full name"
              >
                <option value="">Select Category</option>
                {categories?.map((cat, idx) => (
                  <option key={idx} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
              Blood Group
            </label>
            <div className="mt-1 relative">
              <Heart className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <select
                value={formData.bloodGroup || ""}
                onChange={(e) => handleChange("bloodGroup", e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"                placeholder="Enter full name"
              >
                <option value="">Select Blood Group</option>
                {bloodGroups?.map((b, idx) => (
                  <option key={idx} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Row 4: Email + Phone */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
              Email
            </label>
            <div className="mt-1 relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={formData.email || ""}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="Enter email"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
              Phone No(s)
            </label>
            <div className="mt-1 relative">
              <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={formData.phone || ""}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="e.g. 9876543210, 9123456789"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone_no}</p>
            )}
          </div>
        </div>

        {/* Row 5: Emergency Contact */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
            Emergency Contact No.
          </label>
          <div className="mt-1 relative">
            <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={formData.emergencyPhone || ""}
              onChange={(e) =>
                handleChange("emergencyPhone", e.target.value)
              }
              placeholder="Enter emergency contact number"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"

            />
          </div>
        </div>

        {/* Row 6: Family Info */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
              Father’s Name
            </label>
            <div className="mt-1 relative">

              <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />

              <input
                type="text"
                value={formData.fatherName || ""}
                onChange={(e) => handleChange("fatherName", e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"
                placeholder="Father name"

              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
              Mother’s Name
            </label>
            <div className="mt-1 relative">

              <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />

              <input
                type="text"
                value={formData.motherName || ""}
                onChange={(e) => handleChange("motherName", e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"
                placeholder="Mother name"

              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
              Spouse’s Name
            </label>
            <div className="mt-1 relative">

              <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />

              <input
                type="text"
                value={formData.spouseName || ""}
                onChange={(e) => handleChange("spouseName", e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"
                placeholder="Spouse name"

              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
              Name of Son
            </label>
            <div className="mt-1 relative">

              <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />

              <input
                type="text"
                value={formData.sonName || ""}
                onChange={(e) => handleChange("sonName", e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"
                placeholder="Son name"

              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
            Name of Daughter
          </label>
          <div className="mt-1 relative">
            <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />

            <input
              type="text"
              value={formData.daughterName || ""}
              onChange={(e) => handleChange("daughterName", e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"
              placeholder="Daughter name"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
            Current Address
          </label>
          <div className="mt-1 relative">
            <MapIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />

            <input
              type="text"
              value={formData.currentAddress || ""}
              onChange={(e) => handleChange("currentAddress", e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"
              placeholder="Enter address"
            />
          </div>
        </div>


        <div>
          <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
            Permanent Address
          </label>
          <div className="mt-1 relative">
            <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />

            <input
              type="text"
              value={formData.permanentAddress || ""}
              onChange={(e) => handleChange("permanentAddress", e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"
              placeholder="Enter address" />
          </div>
        </div>



      </form>
    </div>
  );
};

export default AddStaffPersonalInfo;
