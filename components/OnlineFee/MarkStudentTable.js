'use client';
import React, { useState, useMemo } from 'react';
import {
  User,
  Phone,
  IdCard,
  GraduationCap,
  Hash,
  CheckCircle2,
  MoreHorizontal,
  Settings2,
  X
} from 'lucide-react';
import Loader from '../ui/status/Loader';
import MarkStudentDrawer from './MarkStudentDrawer';

const MarkStudentTable = ({
  students = [], // This is the selectedClassStudents from your filter
  loading,
  setSelectedFee,
  selectedFee,
  selectedStudent,
  setSelectedStudent
}) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [markFee, setMarkFee] = useState(false);
  // ================= Selection Logic =================
  const toggleSelectAll = () => {
    if (selectedIds.length === students.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(students.map(s => s.id));
    }
  };

  const toggleSelectRow = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-white rounded-2xl border border-gray-100">
        <Loader text="Loading student records..." />
      </div>
    );
  }


  return (
    <div className="space-y-4 relative">
      <MarkStudentDrawer
        open={markFee}
        onClose={() => setMarkFee(null)}
        selectedFee={selectedFee}
        selectedStudent={selectedStudent}
      />

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[400px]">
        {students.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="px-4 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Roll No.</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Student Name</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Class</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Admission No</th>
                  <th className="px-6 py-4 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">Fee Category</th>
                  <th className="px-6 py-4 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">Action</th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-100">
                {students.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    {/* Roll Number */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center justify-center h-7 w-7 rounded-lg bg-gray-100 text-gray-600 text-xs font-bold border border-gray-200">
                        {student.roll_number || '--'}
                      </span>
                    </td>

                    {/* Name */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs border border-blue-100">
                          {student.name?.charAt(0) || <User size={14} />}
                        </div>
                        <div className="text-sm font-bold text-gray-800">{student.name}</div>
                      </div>
                    </td>

                    {/* Class */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                        <GraduationCap size={14} className="text-gray-400" />
                        {student.class_name || student.class?.name || 'N/A'}
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                        <Phone size={13} className="text-emerald-500" />
                        {student.phone || student.mobile || 'N/A'}
                      </div>
                    </td>

                    {/* Admission Number */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold">
                        <IdCard size={14} className="text-orange-400" />
                        {student.admission_no || student.reg_no || 'N/A'}
                      </div>
                    </td>

                    {/* Fee Category */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-indigo-50 text-indigo-600 border border-indigo-100">
                        {student.fee_category || 'Standard'}
                      </span>
                    </td>

                    {/* Action Button */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => {
                          setSelectedStudent(student);
                          setMarkFee(true);
                        }}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 mx-auto"
                      >
                        <Settings2 size={14} /> Mark Fee
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-20 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 text-slate-300 border border-dashed border-slate-200">
              <User size={32} />
            </div>
            <h3 className="text-gray-900 font-bold text-lg">No Students Loaded</h3>
            <p className="text-gray-500 text-sm max-w-xs mt-1">Select a class from the filters above to view and mark students.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarkStudentTable;