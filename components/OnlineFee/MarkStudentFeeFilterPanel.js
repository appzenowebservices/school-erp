'use client';
import React from "react";
import { 
  User, 
  Phone, 
  IdCard, 
  Hash, 
  FilterX, 
  GraduationCap,
  Search,
  Users
} from "lucide-react";

const MarkStudentFeeFilterPanel = ({
  setFilters,
  config,
  isFilterPanelOpen,
  filters,
  setIsFilterPanelOpen
}) => {
  if (!isFilterPanelOpen) return null;

  const standards = config?.standards || [];

  // ========================== Handlers ==========================
  
  const handleClassChange = (e) => {
    const selectedId = e.target.value;
    
    // Find the class object to get its students array
    let selectedClassData = null;
    standards.forEach(std => {
      const found = std.classes?.find(cls => String(cls.id) === String(selectedId));
      if (found) selectedClassData = found;
    });

    // Update filters with ID and the student list
    setFilters((prev) => ({
      ...prev,
      classId: selectedId,
      // Sending the students array back to parent via the filters state
      selectedClassStudents: selectedClassData?.students || [] 
    }));
      setIsFilterPanelOpen(false);

  };

  const handleChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      classId: "",
      selectedClassStudents: [], // Clear the list too
      name: "",
      phone: "",
      admissionNo: "",
      regNo: "",
      rollNo: "",
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-6 mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* 1. Class Selection - This now triggers the student list update */}
        <div className="flex flex-col">
          <label className="font-bold text-gray-800 text-sm mb-2 flex items-center gap-2">
            <GraduationCap size={16} className="text-blue-500" /> Class
          </label>
          <select
            value={filters.classId || ""}
            onChange={handleClassChange}
            className="w-full border-gray-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 bg-gray-50/50"
          >
            <option value="">All Classes</option>
            {standards.map((std) => (
              <optgroup key={std.id} label={std.name}>
                {std.classes?.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {std.name} - {cls.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          {filters.selectedClassStudents?.length > 0 && (
            <span className="text-[10px] text-blue-600 font-bold mt-1 ml-1 uppercase">
              {filters.selectedClassStudents.length} Students Loaded
            </span>
          )}
        </div>

        {/* 2. Student Name Search */}
        <div className="flex flex-col">
          <label className="font-bold text-gray-800 text-sm mb-2 flex items-center gap-2">
            <User size={16} className="text-emerald-500" /> Student Name
          </label>
          <input
            type="text"
            placeholder="Search within class..."
            value={filters.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full border-gray-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 bg-gray-50/50"
          />
        </div>

        {/* 3. Phone Number */}
        <div className="flex flex-col">
          <label className="font-bold text-gray-800 text-sm mb-2 flex items-center gap-2">
            <Phone size={16} className="text-purple-500" /> Phone Number
          </label>
          <input
            type="tel"
            placeholder="Parent Mobile"
            value={filters.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="w-full border-gray-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-purple-500/20 bg-gray-50/50"
          />
        </div>

        {/* 4. Admission Number */}
        <div className="flex flex-col">
          <label className="font-bold text-gray-800 text-sm mb-2 flex items-center gap-2">
            <IdCard size={16} className="text-orange-500" /> Admission Number
          </label>
          <input
            type="text"
            placeholder="Search ADM No."
            value={filters.admissionNo || ""}
            onChange={(e) => handleChange("admissionNo", e.target.value)}
            className="w-full border-gray-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-orange-500/20 bg-gray-50/50"
          />
        </div>

        {/* 5. Registration Number */}
        <div className="flex flex-col">
          <label className="font-bold text-gray-800 text-sm mb-2 flex items-center gap-2">
            <Hash size={16} className="text-pink-600" /> Registration Number
          </label>
          <input
            type="text"
            placeholder="Search Reg No."
            value={filters.regNo || ""}
            onChange={(e) => handleChange("regNo", e.target.value)}
            className="w-full border-gray-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-pink-600/20 bg-gray-50/50"
          />
        </div>

        {/* 6. Roll Number */}
        <div className="flex flex-col">
          <label className="font-bold text-gray-800 text-sm mb-2 flex items-center gap-2">
            <Users size={16} className="text-indigo-600" /> Roll Number
          </label>
          <input
            type="text"
            placeholder="Search Roll No."
            value={filters.rollNo || ""}
            onChange={(e) => handleChange("rollNo", e.target.value)}
            className="w-full border-gray-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-indigo-600/20 bg-gray-50/50"
          />
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
        <button 
          onClick={clearFilters}
          className="flex items-center gap-2 text-xs font-black text-gray-400 hover:text-red-500 uppercase tracking-widest transition-colors"
        >
          <FilterX size={14} /> Reset Filters
        </button>
        
        <button
          onClick={() => handleChange("triggerSearch", Date.now())}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center gap-2"
        >
          <Search size={18} /> Load Student Records
        </button>
      </div>
    </div>
  );
};

export default MarkStudentFeeFilterPanel;