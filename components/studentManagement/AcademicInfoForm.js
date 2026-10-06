import React, { useEffect } from 'react';
import { School, FileText, Calendar, Hash, MapPin, User2, School2, LucideMapPinned } from 'lucide-react';
import { IoNewspaper } from 'react-icons/io5';
import { PiListNumbersFill } from 'react-icons/pi';
import { FaPercentage } from 'react-icons/fa';
import { SiRemark } from 'react-icons/si';

const AcademicInfoForm = ({ formData, setFormData }) => {




  // console.log(' ----- currentSubjects -------', subjects_)





  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <form className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[80vh] overflow-y-auto p-4">

        {/* Name of Previous School */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
            Previous School
          </label>
          <div className="relative">
            <School2 className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />

            <input
              type="text"
              value={formData.previousSchool || ''}
              onChange={(e) => handleChange('previousSchool', e.target.value)}
              placeholder="Enter name of previous school"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"          />
          </div>
        </div>

        {/* Scholarship */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
            Scholarship
          </label>
          <div className="relative">
            <IoNewspaper className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />

            <input
              type="text"
              value={formData.scholarship || ''}
              onChange={(e) => handleChange('scholarship', e.target.value)}
              placeholder="Enter scholarship details"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"          />
          </div>
        </div>

        {/* Year of Passing */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
            Year of Passing
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />

            <input
              type="number"
              value={formData.yearOfPassing || ''}
              onChange={(e) => handleChange('yearOfPassing', e.target.value)}
              placeholder="Enter year of passing"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"          />
          </div>
        </div>

        {/* Previous Board (X) Roll No */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
            Previous Board(X) Roll No
          </label>
          <div className="relative">
            <PiListNumbersFill className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />

            <input
              type="text"
              value={formData.previousRollNo || ''}
              onChange={(e) => handleChange('previousRollNo', e.target.value)}
              placeholder="enter previous board(X) roll no"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"          />
          </div>
        </div>

        {/* Previous Board */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
            Previous Board
          </label>
          <div className="relative">
            <School className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />

            <input
              type="text"
              value={formData.previousBoard || ''}
              onChange={(e) => handleChange('previousBoard', e.target.value)}
              placeholder="Enter previous board name"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"          />
          </div>
        </div>

        {/* Board Registration Number */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
            Board Registration No
          </label>
          <div className="relative">
            <PiListNumbersFill className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />

            <input
              type="text"
              value={formData.boardRegNo || ''}
              onChange={(e) => handleChange('boardRegNo', e.target.value)}
              placeholder="Enter registration number"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"          />
          </div>
        </div>

        {/* Previous Percentage */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
            Previous Percentage
          </label>
          <div className="relative">
            <FaPercentage className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />

            <input
              type="number"
              value={formData.previousPercentage || ''}
              onChange={(e) => handleChange('previousPercentage', e.target.value)}
              placeholder="Enter percentage"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"          />
          </div>
        </div>

        {/* Previous Working Days */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
            Previous Working Days
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />

            <input
              type="number"
              value={formData.previousWorkingDays || ''}
              onChange={(e) => handleChange('previousWorkingDays', e.target.value)}
              placeholder="Enter number of days"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"          />
          </div>
        </div>

        {/* Permanent Education Number */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
            Permanent Education No
          </label>
          <div className="relative">
            <PiListNumbersFill className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />

            <input
              type="text"
              value={formData.permanentEduNo || ''}
              onChange={(e) => handleChange('permanentEduNo', e.target.value)}
              placeholder="Enter permanent education number"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"          />
          </div>
        </div>

        {/* Student Remarks */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
            Student Remarks
          </label>
          <div className="relative">
            <SiRemark className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />

            <textarea
              value={formData.studentRemarks || ''}
              onChange={(e) => handleChange('studentRemarks', e.target.value)}
              placeholder="Enter remarks"
              rows={2}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"          />
          </div>
        </div>


        {/* Address (spans 2 columns) */}
        <div className="relative sm:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
            Permanent Address</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LucideMapPinned className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={formData.permanent_address || ''}
              onChange={(e) => handleChange('permanent_address', e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"              placeholder="Full Address"
            />
          </div>
        </div>


        {/* Distance to School */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
            Distance to School (km)
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />

            <input
              type="number"
              value={formData.distanceToSchool || ''}
              onChange={(e) => handleChange('distanceToSchool', e.target.value)}
              placeholder="Enter distance in km"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"          />
          </div>
        </div>
      </form>
    </div>
  );
};

export default AcademicInfoForm;
