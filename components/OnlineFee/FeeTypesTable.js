'use client';
import React, { useState } from 'react';
import { 
  Settings2, 
  ChevronLeft, 
  ChevronRight, 
  ClipboardList, 
  Info,
  CheckCircle2
} from 'lucide-react';
import Loader from '../ui/status/Loader';

const FeeTypesTable = ({ 
  feeTypes = [], 
  isLoading, 
  currentPage, 
  setCurrentPage, 
  handleToggle, 
  handleActionClick, 
  handlePayFee, 
  handleDownloadStructure,
  clearFilters,
  filteredFees = []
}) => {
  const feesPerPage = 10;
  const totalCount = feeTypes?.total_count || 0;
  const serverLimit = feeTypes?.limit || feesPerPage;
  const totalPages = Math.ceil((totalCount || 0) / serverLimit);

  const indexOfLastFee = currentPage * feesPerPage;
  const indexOfFirstFee = indexOfLastFee - feesPerPage;
  const currentFees = feeTypes; // mapped from props

  const goToPage = (num) => { if (num >= 1 && num <= totalPages) setCurrentPage(num); };

  const getCountColor = (count) => {
    if (count > 50) return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    if (count > 0) return "bg-amber-50 text-amber-700 ring-amber-200";
    return "bg-slate-50 text-slate-400 ring-slate-200";
  };

  if (isLoading) return <div className="py-20"><Loader /></div>;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {currentFees.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr className="bg-slate-50/80">
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">Fee Configuration</th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">Category</th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">Attributes</th>
                  <th className="px-6 py-4 text-center text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">Usage</th>
                  <th className="px-6 py-4 text-right text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentFees.map((fee) => (
                  <tr key={fee?.id} className="hover:bg-slate-50/50 transition-colors group">
                    {/* Fee Name & Code */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                          <ClipboardList size={18} />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-800">{fee?.name}</div>
                          {fee?.code && (
                            <div className="inline-block px-1.5 py-0.5 mt-0.5 bg-slate-100 text-[10px] font-bold text-slate-500 rounded uppercase tracking-tighter">
                              {fee?.code}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {fee?.category || "N/A"}
                      </span>
                    </td>

                    {/* Checkbox Attributes - Enhanced as "Toggle Chips" */}
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5 max-w-[320px]">
                        {[
                          { key: "is_variable", label: "Variable" },
                          { key: "is_applicable_for_new_students", label: "New Adm." },
                          { key: "is_optional", label: "Optional" },
                          { key: "is_applicable_for_concession", label: "Concession" },
                        ].map((item) => {
                          const isChecked = fee?.[item.key] === '1';
                          return (
                            <button
                              key={item.key}
                              onClick={() => handleToggle(fee, item.key)}
                              className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-[10px] font-bold transition-all ${
                                isChecked 
                                ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
                                : "bg-white border-slate-200 text-slate-400 opacity-60 hover:opacity-100"
                              }`}
                            >
                              <div className={`w-2 h-2 rounded-full ${isChecked ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                              {item.label}
                            </button>
                          );
                        })}
                      </div>
                    </td>

                    {/* Counts */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className={`inline-flex flex-col items-center justify-center min-w-[40px] px-2 py-1 rounded-xl ring-1 ${getCountColor(Number(fee?.fee_count))}`}>
                        <span className="text-sm font-black">{fee?.fee_count}</span>
                        <span className="text-[8px] uppercase font-bold tracking-tighter opacity-70">Assigned</span>
                      </div>
                    </td>

                    {/* Action Buttons */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-1.5">
                        {fee?.options?.map((option, idx) => {
                          const colors = {
                            delete: "hover:bg-rose-50 hover:text-rose-600 text-slate-400",
                            edit: "hover:bg-blue-50 hover:text-blue-600 text-slate-400",
                            pay: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-100",
                            download: "hover:bg-indigo-50 hover:text-indigo-600 text-slate-400"
                          };
                          
                          const isPrimary = option.action === 'pay';
                          
                          return (
                            <button
                              key={idx}
                              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all active:scale-95 ${colors[option.action] || "bg-slate-50 text-slate-600"}`}
                              onClick={() => {
                                if (option.action === "pay") return handlePayFee(option, fee);
                                if (option.action === "download") return handleDownloadStructure(fee);
                                return handleActionClick(option, fee);
                              }}
                            >
                              {option.label}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-20 text-center bg-slate-50/50">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 border border-slate-100 text-slate-300">
              <Settings2 size={32} />
            </div>
            <h3 className="text-slate-800 font-bold text-lg">No Fee Types Defined</h3>
            <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">Get started by creating your first fee category or adjusting your search.</p>
            <button onClick={clearFilters} className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all">
              Refresh List
            </button>
          </div>
        )}
      </div>

      {/* Pagination & Info */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
          <div className="flex items-center gap-2 text-slate-400">
             <Info size={14} />
             <p className="text-[11px] font-bold uppercase tracking-widest">
                Showing {indexOfFirstFee + 1} to {Math.min(indexOfLastFee, totalCount)} of {totalCount} Categories
             </p>
          </div>

          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg hover:bg-slate-50 disabled:opacity-20 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => goToPage(i + 1)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                  currentPage === i + 1 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg hover:bg-slate-50 disabled:opacity-20 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeTypesTable;