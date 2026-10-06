import React, { useEffect, useState } from 'react';
import {

  Target,

  FileText,

  Users,
  CaseUpper,
  Calculator,
  FlaskConical,
  IndianRupee,
  Globe,
  ScrollText,
  Map,
  Eye,
  Edit2,
  Settings,
  Trash2,
  BookOpen,

} from 'lucide-react';

// ===================================================================================================
const SubjectsTable = ({

  subjects,

}) => {


  const getGradientClass = (index) => {
    const gradients = [
      'from-blue-500 to-purple-600',
      'from-green-500 to-teal-600',
      'from-orange-500 to-red-600',
      'from-pink-500 to-rose-600',
      'from-indigo-500 to-blue-600',
      'from-yellow-500 to-orange-600'
    ];
    return gradients[index % gradients.length];
  };

  const getSubjectIcon = (name) => {
    const iconMap = {
      'ENGLISH': CaseUpper,
      'MATHEMATICS': Calculator,
      'SCIENCE': FlaskConical,
      'HINDI': IndianRupee,
      'SOCIAL': Globe,
      'HISTORY': ScrollText,
      'GEOGRAPHY': Map,
    };
    return iconMap[name.toUpperCase()] || BookOpen;
  };

  // ===================================================================================================

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
              Subject Details
            </th>
            <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
              Priority
            </th>
            <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
              Content
            </th>
            <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
              Tests
            </th>
            <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
              Features
            </th>
            <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {subjects.map((subject, index) => {
            const SubjectIcon = getSubjectIcon(subject.name);

            return (
              <tr key={subject.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-r ${getGradientClass(index)} rounded-xl flex items-center justify-center text-xl`}>
                      <SubjectIcon className="w-7 h-7 text-gray-200" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-bold text-gray-900">{subject.name}</div>
                      <div className="text-sm text-gray-500 font-mono">{subject.code}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-bold">
                    {subject.priority}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${subject.is_optional
                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                    : 'bg-green-100 text-green-800 border border-green-200'
                    }`}>
                    {subject.is_optional ? 'Optional' : 'Mandatory'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex justify-center gap-3 text-sm">
                    <div className="text-blue-600 font-semibold">{subject.chapters.count}C</div>
                    <div className="text-purple-600 font-semibold">{subject.topics.count}T</div>
                    <div className="text-green-600 font-semibold">{subject.study_materials.count}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    onClick={() => {
                      setSelectedSubject(subject);
                      setShowTestModal(true);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors"
                  >
                    <Target className="w-4 h-4" />
                    {subject.tests?.length || 0} Tests
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center gap-2">
                    {subject.accepts_average_for_child_subjects === "1" && (
                      <div className="w-2 h-2 bg-blue-400 rounded-full" title="Accepts Average"></div>
                    )}
                    {subject.accepts_remarks === "1" && (
                      <div className="w-2 h-2 bg-purple-400 rounded-full" title="Accepts Remarks"></div>
                    )}
                    {subject.take_average_in_parent_exam === "1" && (
                      <div className="w-2 h-2 bg-green-400 rounded-full" title="Takes Average in Parent"></div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                      <Settings className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
};
// ===================================================================================================

export default SubjectsTable;