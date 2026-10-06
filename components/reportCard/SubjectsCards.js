import React, { useEffect, useState } from 'react';
import {

  Target,

  FileText,

  Users,
  TargetIcon,
  FileTextIcon,
  Users2,

} from 'lucide-react';

// ===================================================================================================
const SubjectsCards = ({

  subject,
  index,
  SubjectIcon,
  setSelectedSubject,
  setShowTestModal
}) => {
  const [showActions, setShowActions] = useState(false);


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

  // ===================================================================================================

  return (
    <div key={subject?.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 overflow-hidden">
      {/* Card Header */}
      <div className={`h-2 bg-gradient-to-r ${getGradientClass(index)}`}></div>

      <div className="p-6">
        {/* Subject Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 bg-gradient-to-r ${getGradientClass(index)} rounded-xl flex items-center justify-center text-2xl`}>
              <SubjectIcon className="w-7 h-7 text-gray-200" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{subject?.name}</h3>
              <p className="text-gray-500 font-mono text-sm">{subject?.code}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${subject?.is_optional
              ? 'bg-amber-100 text-amber-700 border border-amber-200'
              : 'bg-green-100 text-green-700 border border-green-200'
              }`}>
              {subject?.is_optional ? 'Optional' : 'Mandatory'}
            </div>
            <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-bold">
              {subject?.priority}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-blue-50 rounded-xl border border-blue-100">
            <div className="text-lg font-bold text-blue-600">{subject?.chapters.count}</div>
            <div className="text-xs text-blue-700 font-medium">Chapters</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-xl border border-purple-100">
            <div className="text-lg font-bold text-purple-600">{subject?.topics.count}</div>
            <div className="text-xs text-purple-700 font-medium">Topics</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-xl border border-green-100">
            <div className="text-lg font-bold text-green-600">{subject?.study_materials.count}</div>
            <div className="text-xs text-green-700 font-medium">Materials</div>
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-6">
          {subject.accepts_average_for_child_subjects && (
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium flex items-center gap-1">
              <TargetIcon className="w-3 h-3" />
              Accepts Average : {subject.accepts_average_for_child_subjects}
            </span>
          )}
          {subject.accepts_remarks && (
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium flex items-center gap-1">
              <FileTextIcon className="w-3 h-3" />
              Remarks
            </span>
          )}
          {subject.take_average_in_parent_exam && (
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
              <Users2 className="w-3 h-3" />
              Parent Avg
            </span>
          )}
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
            {subject.entry_parameter}
          </span>
        </div>

        {/* Parent Subject */}
        {subject.parent_subject && (
          <div className="mb-4">
            <div className="text-sm font-medium text-gray-700 mb-2">Parent Subject:</div>
            <div className="px-3 py-2 bg-orange-50 text-orange-700 rounded-lg text-sm border border-orange-200">
              {subject.parent_subject.name}
            </div>
          </div>
        )}
      </div>

      {/* Card Actions */}
      <div className="px-6 py-4 bg-gray-50/80 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              setSelectedSubject(subject);
              setShowTestModal(true);
            }}
            className="cursor-pointer px-4 py-2 bg-purple-100  border border-black-200 ring-1 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors flex items-center gap-2"
          >
            <TargetIcon className="w-4 h-4" />
            Exam Info
          </button>

          {/* =================== Actions ==================================== */}
          {/* <button
                            onClick={() => {
                              setSelectedSubject(subject);
                              setShowActions((prevState) => !prevState);
                            }}
                            className="cursor-pointer px-4 py-2 bg-white border border-black-200 ring-1 text-black-700 rounded-lg text-sm font-medium hover:bg-black-200 transition-colors flex items-center gap-2"
                          >
                            <MonitorCog className="w-4 h-4" />
                            Actions
                          </button> */}
          {/* ====================================================== */}
        </div>
      </div>


      {showActions && subject?.id === selectedSubject.id && < ActionMenu
        actions={subject?.options}
        showActions={showActions}
      />}

      {/* ====================================================== */}
    </div>
  )
};
// ===================================================================================================

export default SubjectsCards;