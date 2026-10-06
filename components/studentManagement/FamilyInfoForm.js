import React, { useMemo } from 'react';
import { Trash2, Phone, Mail, Shield, User2, Transgender, PhoneCall } from 'lucide-react';
import { TiSortAlphabeticallyOutline } from "react-icons/ti";
import { FaGenderless } from 'react-icons/fa';
import { IoNewspaper } from "react-icons/io5";
import { BiRupee } from 'react-icons/bi';
import { FaUsers, FaUserGraduate } from "react-icons/fa";
import { useState } from "react";

const FamilyInfoForm = ({ formData, setFormData, genderOptions, classes, studentsByClass = {}, handleChange }) => {

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");

const siblings = formData.siblings || [];



  const handleParentChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      parents: prev.parents.map((parent, i) =>
        i === index ? { ...parent, [field]: value } : parent
      )
    }));
  };

  const handlePhoneChange = (parentIndex, phoneIndex, value) => {
    setFormData(prev => ({
      ...prev,
      parents: prev.parents.map((parent, i) =>
        i === parentIndex
          ? {
            ...parent,
            phones: parent.phones.map((phone, j) => (j === phoneIndex ? value : phone))
          }
          : parent
      )
    }));
  };

  const addPhoneField = (parentIndex) => {
    setFormData(prev => ({
      ...prev,
      parents: prev.parents.map((parent, i) =>
        i === parentIndex && parent.phones.length < 3
          ? { ...parent, phones: [...parent.phones, ''] }
          : parent
      )
    }));
  };

  const removePhoneField = (parentIndex, phoneIndex) => {
    setFormData(prev => ({
      ...prev,
      parents: prev.parents.map((parent, i) =>
        i === parentIndex
          ? { ...parent, phones: parent.phones.filter((_, j) => j !== phoneIndex) }
          : parent
      )
    }));
  };

  const removeParent = index => {
    setFormData(prev => ({
      ...prev,
      parents: prev.parents.filter((_, i) => i !== index)
    }));
  };



  const classesList = useMemo(() => {
    if (!Array.isArray(classes)) return [];

    return classes.flatMap((standard) =>
      Array.isArray(standard.classes) ? standard.classes : []
    );
  }, [classes]);

  const selectedClassObj = classesList.find(
    (cls) => cls.id === selectedClass
  );

  const availableStudents = selectedClassObj?.students || [];

  console.log('selectedClass ===', selectedClass);
  const handleAddSibling = () => {
    if (!selectedClass || !selectedStudent) return;

    const student = availableStudents.find(
      (s) => s.id === selectedStudent
    );
    if (!student) return;

    setFormData((prev) => {
      const existing = prev.siblings || [];

      const alreadyAdded = existing.some(
        (sib) => sib.studentId === student.id
      );
      if (alreadyAdded) return prev;

      return {
        ...prev,
        siblings: [
          ...existing,
          {
            studentId: student.id,
            name: student.name,
            classId: selectedClass,
            className: selectedClassObj.name,
          },
        ],
      };
    });

    setSelectedStudent("");
  };

const handleRemoveSibling = (studentId) => {
  setFormData((prev) => ({
    ...prev,
    siblings: (prev.siblings || []).filter(
      (sib) => sib.studentId !== studentId
    ),
  }));
};

  return (
    <div className="space-y-6">
      {formData.parents.map((parent, index) => (
        <div
          key={index}
          className="bg-white/90 dark:bg-bg-white/90 p-6 rounded-xl border border-gray-200  dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="flex justify-between items-center mb-5">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-800">
              {parent.relation.charAt(0).toUpperCase() + parent.relation.slice(1)}
            </h4>
            {formData.parents.length > 1 && (
              <button
                type="button"
                onClick={() => removeParent(index)}
                className="text-red-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
                Name <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <TiSortAlphabeticallyOutline className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />

                <input
                  type="text"
                  value={parent.name}
                  onChange={(e) => handleParentChange(index, 'name', e.target.value)}
                  placeholder="Enter parent name"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"

                />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
                Gender
              </label>
              <div className="relative">
                <Transgender className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />

                <select
                  value={parent.gender}
                  onChange={(e) => handleParentChange(index, 'gender', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"              >
                  <option value="">Select Gender</option>
                  {genderOptions.map((g, i) => (
                    <option key={i} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Relation */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
                Qualification
              </label>
              <div className="relative">
                <IoNewspaper className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />

                <input
                  type="text"
                  value={parent.qualification}
                  onChange={(e) => handleParentChange(index, 'qualification', e.target.value)}
                  placeholder="Mention qualification"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"              />
              </div>
            </div>



            {/*     Annual Income */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
                Annual Income
              </label>
              <div className="relative">
                <BiRupee className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />

                <input
                  type="text"
                  value={parent.annualIncome}
                  onChange={(e) => handleParentChange(index, 'annualIncome', e.target.value)}
                  placeholder="Enter annual income"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"              />
              </div>
            </div>



            {/* Multiple Phones */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
                Phone Numbers
              </label>
              <div className="relative">
                <PhoneCall className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />

                <div className="space-y-2">
                  {parent.phones.map((phone, pIndex) => (
                    <div key={pIndex} className="flex gap-2 items-center">
                      <div className="relative">
                        <PhoneCall className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />

                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => handlePhoneChange(index, pIndex, e.target.value)}
                          placeholder={`Phone ${pIndex + 1}`}
                          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition duration-200 placeholder-gray-400 hover:border-gray-400"                    />
                        {parent.phones.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removePhoneField(index, pIndex)}
                            className="text-red-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {parent.phones.length < 3 && (
                    <button
                      type="button"
                      onClick={() => addPhoneField(index)}
                      className="text-blue-500 text-sm mt-1 hover:underline"
                    >
                      + Add another phone
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}








      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <FaUsers className="text-indigo-500 h-5 w-5" />
          Sibling Information
        </h3>






        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Select Class */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Select Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setSelectedStudent("");
              }}
              className="w-full rounded-lg border px-3 py-2"
            >
              <option value="">Select class</option>
              {classesList.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          {/* Select Student */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Select Student
            </label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              disabled={!selectedClass}
              className="w-full rounded-lg border px-3 py-2 disabled:bg-gray-100"
            >
              <option value="">Select student</option>
              {availableStudents.map((stu) => (
                <option key={stu.id} value={stu.id}>
                  {stu.name} {stu.roll_number && `(${stu.roll_number})`}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4">
          <button
            type="button"
            onClick={handleAddSibling}
            disabled={!selectedClass || !selectedStudent}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            + Add Sibling
          </button>
        </div>



   {siblings.length > 0 && (
  <div className="mt-6 space-y-3">
    <h4 className="text-sm font-semibold text-gray-700">
      Added Siblings
    </h4>

    {siblings.map((sib) => (
      <div
        key={sib.studentId}
        className="flex items-center justify-between bg-gray-50 border rounded-lg px-4 py-2"
      >
        <div>
          <p className="text-sm font-medium text-gray-800">
            {sib.name}
          </p>
          <p className="text-xs text-gray-500">
            Class: {sib.className}
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleRemoveSibling(sib.studentId)}
          className="text-red-500 hover:text-red-700 text-sm"
        >
          Remove
        </button>
      </div>
    ))}
  </div>
)}


      </div>



    </div>
  );
};

export default FamilyInfoForm;
