'use client';
import React, { useState } from 'react';
import { FaTrash, FaChevronLeft, FaChevronRight, FaRupeeSign } from 'react-icons/fa';
import { User, BookOpen, Tag, Calendar } from 'lucide-react';
import Loader from '../ui/status/Loader';

const VariableFeeTable = ({ 
  variableFees = [], 
  isLoading, 
  filteredFees = [], 
  setFilters,
  setSelectedFee,
  setRemoveVariableFee 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const feesPerPage = 10;

  // Use the larger set (filteredFees) to calculate total pages if pagination is client-side
  const totalPages = Math.ceil(filteredFees.length / feesPerPage);
  
  const indexOfLastFee = currentPage * feesPerPage;
  const indexOfFirstFee = indexOfLastFee - feesPerPage;
  const currentFees = variableFees; // Keep your existing logic

  const goToPage = (num) => { if (num >= 1 && num <= totalPages) setCurrentPage(num); };
  
  const clearFilters = () => {
    setFilters({});
    // Other clear logic handled by parent
  };

  if (isLoading) return <div className="py-20"><Loader /></div>;

  return (
    <div className="space-y-4">
      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {currentFees.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr className="bg-slate-50/80">
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">Student Details</th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">Class & Roll</th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">Fee Allocation</th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">Amount</th>
                  <th className="px-6 py-4 text-right text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {currentFees.map((item) => (
                  <tr key={item?.id} className="hover:bg-blue-50/30 transition-colors group">
                    {/* Student Info */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm border border-indigo-100">
                          {item?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-800">{item?.name}</div>
                          <div className="text-[11px] text-slate-400 font-medium">ID: #{item?.id?.toString().slice(-5)}</div>
                        </div>
                      </div>
                    </td>

                    {/* Class & Roll */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-700">{item?.standard?.name || 'N/A'}</span>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                          <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-bold">
                            Roll: {item?.roll_number || "—"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Fee Details */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5">
                          <Tag size={12} className="text-indigo-400" />
                          <span className="text-sm font-bold text-slate-800">{item?.fee?.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full font-bold uppercase tracking-tighter border border-blue-100">
                            {item?.fee_type?.name}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center font-black text-slate-800">
                        <FaRupeeSign size={12} className="text-slate-400 mr-0.5" />
                        <span className={`text-base ${Number(item?.fee_type_amount) < 0 ? "text-rose-600" : "text-slate-800"}`}>
                          {item?.fee_type_amount}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all active:scale-90"
                        onClick={() => {
                          setSelectedFee(item);
                          setRemoveVariableFee(item);
                        }}
                        title="Remove Assignment"
                      >
                        <FaTrash size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-20 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-slate-200">
              <BookOpen className="text-slate-300" />
            </div>
            <h3 className="text-slate-800 font-bold text-lg">No allocations found</h3>
            <p className="text-slate-500 text-sm mb-6">Try adjusting your filters to find specific students.</p>
            <button
              onClick={clearFilters}
              className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* Pagination & Footer */}
      {totalPages > 1 && currentFees.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Showing {indexOfFirstFee + 1}-{Math.min(indexOfLastFee, filteredFees.length)} of {filteredFees.length} Entries
          </p>

          <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-xl hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <FaChevronLeft size={14} className="text-slate-600" />
            </button>

            <div className="flex gap-1 px-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => goToPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                    currentPage === i + 1
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <FaChevronRight size={14} className="text-slate-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VariableFeeTable;