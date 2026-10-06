import React, { useState } from 'react';
import { User } from 'lucide-react';
import { RiUserStarFill } from 'react-icons/ri';

const AddStaff = ({
  setFormData,
  formData,
  designations,
  titles,
  genderStaffs,
  school,
  classes
}) => {


  type Errors = {
    name?: string;
    designation?: string;
    class?: string;
  };

  const [errors, setErrors] = useState<Errors>({});

  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    let newErrors: Record<string, string> = {};
    if (!formData.name) {
      newErrors.name = 'Name is required';
    }
    if (!formData.designation) {
      newErrors.designation = 'Designation is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitted(true);
      console.log('Form data submitted:', formData);
    }
  };

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[80vh] overflow-y-auto p-4"
      >
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
            Name</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"

              placeholder="Enter full name"

            />
          </div>
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        {/* Titles */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
            Titles</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <RiUserStarFill className="h-5 w-5 text-gray-400" />
            </div>
            <select
              name="title"
              value={formData.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"
            >
              <option value="">Select Title</option>
              {titles?.map((d: any, idx: number) => (
                <option key={idx} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          {/* {errors.designation && (
            <p className="mt-1 text-sm text-red-600">{errors.designation}</p>
          )} */}
        </div>



        {/* Gender */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
            Gender</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <RiUserStarFill className="h-5 w-5 text-gray-400" />
            </div>
            <select
              name="gender"
              value={formData.gender || ''}
              onChange={(e) => handleChange('gender', e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"
              // placeholder="Enter full name"
            >
              <option value="">Select gender</option>
              {genderStaffs?.map((d: any, idx: number) => (
                <option key={idx} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          {/* {errors.designation && (
            <p className="mt-1 text-sm text-red-600">{errors.designation}</p>
          )} */}
        </div>


        {/* Designation */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
            Designation</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <RiUserStarFill className="h-5 w-5 text-gray-400" />
            </div>
            <select
              name="designation"
              value={formData.designation || ''}
              onChange={(e) => handleChange('designation', e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"          
            >
              <option value="">Select designation</option>
              {designations?.map((d: any, idx: number) => (
                <option key={idx} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          {/* {errors.designation && (
            <p className="mt-1 text-sm text-red-600">{errors.designation}</p>
          )} */}
        </div>



        {/* Classes */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
            Classes</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <RiUserStarFill className="h-5 w-5 text-gray-400" />
            </div>
            <select
              name="class"
              value={formData.class || ''}
              onChange={(e) => handleChange('class', e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"            
            >

              <option value="">Select class</option>
              {classes?.map((d: any, idx: number) => (
                <option key={idx} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          {/* {errors.class && (
            <p className="mt-1 text-sm text-red-600">{errors.class}</p>
          )} */}
        </div>




      </form>
    </div>
  );
};

export default AddStaff;
