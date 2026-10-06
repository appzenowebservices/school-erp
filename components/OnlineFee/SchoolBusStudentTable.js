'use client';
import React, { useState } from 'react';
import Loader from '../ui/status/Loader';
import { Users, MapPin, Eye, Trash2, GraduationCap, DollarSign, Search, CheckCircle2, X, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ConfirmationDialogueBox from '../ui/status/Confirmation';
import { deleteSchoolBusStudent } from '../../api/fees';

const SchoolBusStudentTable = ({ busId, context, schoolBusStudent = [], loading, totalCount }) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const totalPages = Math.ceil((totalCount || schoolBusStudent.length) / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = schoolBusStudent.slice(indexOfFirstItem, indexOfLastItem);

  const handleAction = (actionName, student) => {
    if (actionName === "View Profile") {
      router.push(`/dashboard/students/profile?id=${student.id}`);
    }
    // Add logic for Remove/Edit if needed
  };

  const handleSchoolBusStudentDelete = async () => {
    setSubmitted(true);
    setError(null);
    setSuccess(null);

    try {
      if (!selectedStudent?.id) {
        setError("Invalid department selected");
        setSubmitted(false);
        return;
      }

      const resp = await deleteSchoolBusStudent(
        context?.profileId,
        context?.session,
        selectedStudent,
        busId
      );

      if (resp?.data?.success) {
        setSuccess(resp?.data?.results?.message || "Student removed from the bus   successfully");

        setTimeout(() => {
          setSuccess(null);
          // setDepartmentToDelete(null);
          window.location.reload(); // keeping your pattern
        }, 700);

        setSubmitted(false);
      } else {
        setError(resp?.data?.results?.message || "Failed to delete Role");
        setSubmitted(false);
      }
    } catch (err) {
      console.error("Role delete error:", err);
      setError(err.message || "Something went wrong while deleting Role");
      setSubmitted(false);
    }
  };
  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-white rounded-2xl border border-gray-100">
        <Loader text="Fetching student transport records..." />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Student Table Container */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[400px] flex flex-col">
          {currentStudents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50/80">
                  <tr>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Student</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Class & Roll</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pickup Location</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Transport Fee</th>
                    <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-100">
                  {currentStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-blue-50/30 transition-colors group">
                      {/* Student Info */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
                            {student.image_url ? (
                              <img src={student.image_url} alt={student.name} className="h-full w-full object-cover" />
                            ) : (
                              <Users size={20} className="text-slate-400" />
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-gray-800">{student.name}</div>
                            <div className="text-[10px] text-gray-400 font-medium">ID: #{student.id}</div>
                          </div>
                        </div>
                      </td>

                      {/* Class & Roll */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                            <GraduationCap size={14} className="text-blue-500" />
                            {student.class?.name || 'N/A'}
                          </div>
                          <div className="text-[10px] text-gray-400 font-medium ml-5">
                            Roll No: {student.roll_number || '--'}
                          </div>
                        </div>
                      </td>

                      {/* Pickup Location */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600">
                            <MapPin size={14} />
                          </div>
                          <span className="text-sm font-semibold text-gray-700">
                            {student.location?.name || 'Not Set'}
                          </span>
                        </div>
                      </td>

                      {/* Transport Fee */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-100 text-amber-700 font-bold text-xs">
                          <DollarSign size={12} />
                          {student.location?.transport_fee || '0.00'}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleAction("View Profile", student)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                            title="View Profile"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => { setSelectedStudent(student) }}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            title="Remove from Bus"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 text-gray-300">
                <Users size={32} />
              </div>
              <h3 className="text-gray-900 font-bold text-lg">No Students Found</h3>
              <p className="text-gray-500 text-sm mt-1">Search or assign students to this bus route.</p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, schoolBusStudent.length)} of {schoolBusStudent.length} Students
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-xs font-bold bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Previous
              </button>
              <div className="flex items-center px-4 text-xs font-black text-blue-600 bg-blue-50 rounded-lg">
                {currentPage} / {totalPages}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-xs font-bold bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>







      {selectedStudent && (
        <ConfirmationDialogueBox
          title="Delete Student from Bus?"
          description={`Are you sure you want to delete "${selectedStudent?.name}"?`}
          onConfirm={handleSchoolBusStudentDelete}
          onCancel={() => setSelectedStudent(null)}
        />
      )}




      {/* Floating Notifications */}
      <div className="fixed top-6 right-6 flex flex-col gap-3 z-[666]">
        {error && (
          <div className="bg-white border-l-4 border-red-500 shadow-2xl rounded-2xl px-5 py-4 flex items-center gap-4 animate-in slide-in-from-right">
            <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-red-600 shrink-0">
              <AlertCircle size={20} />
            </div>
            <div className="pr-4">
              <p className="text-sm font-bold text-slate-900">Wait a minute</p>
              <p className="text-xs font-medium text-slate-500">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-slate-300 hover:text-slate-500">
              <X size={16} />
            </button>
          </div>
        )}

        {success && (
          <div className="bg-white border-l-4 border-green-500 shadow-2xl rounded-2xl px-5 py-4 flex items-center gap-4 animate-in slide-in-from-right">
            <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600 shrink-0">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Done!</p>
              <p className="text-sm font-medium text-slate-500">{success}</p>
            </div>
          </div>
        )}
      </div>

    </>
  );
};

export default SchoolBusStudentTable;