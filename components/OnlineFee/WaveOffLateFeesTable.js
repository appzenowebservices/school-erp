'use client';
import React, { useState } from 'react';
import { Receipt, User, Trash2, Calendar, Info } from 'lucide-react';
import Loader from '../ui/status/Loader';

const WaveOffLateFeesTable = ({
  waveOffLateFees = [],
  loading,
  currentPage,
  setCurrentPage,
  totalPages,
  totalCount,

  setSelectedFee,
  setRemoveWaiveOffLateFee
}) => {

  const handleAction = (option, item) => {
    if (option.action === 'delete') {

      setRemoveWaiveOffLateFee(true)
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-white rounded-2xl border border-gray-100">
        <Loader text="Fetching waived late fee records..." />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[400px]">
        {waveOffLateFees.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Student Details</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Fee Head</th>
                  <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Waived Amount</th>
                  <th className="px-6 py-4 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">Type</th>
                  <th className="px-6 py-4 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-100">
                {waveOffLateFees.map((item) => (
                  <tr
                    onClick={() => setSelectedFee(item)}
                    key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    {/* Student Info */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                          {item.student?.name?.charAt(0) || <User size={14} />}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-800">{item.student?.name}</div>
                          <div className="text-[10px] text-gray-500 font-medium">
                            {item.student?.class?.name} • Roll: {item.student?.roll_number || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Fee Head */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-700">{item.fee?.name}</span>
                        <span className="text-[10px] text-indigo-500 font-bold uppercase tracking-tight flex items-center gap-1">
                          <Calendar size={10} /> Total: ₹{item.fee?.amount?.toLocaleString()}
                        </span>
                      </div>
                    </td>

                    {/* Waived Amount */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm font-black text-rose-600">
                        ₹{Number(item.amount || 0).toFixed(2)}
                      </div>
                      <div className="text-[9px] text-gray-400 font-bold uppercase">Waived Off</div>
                    </td>

                    {/* Recurring Type */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {item.fee?.late_fee?.is_recurring === "1" ? (
                        <span className="px-2 py-1 rounded-md text-[9px] font-black uppercase bg-amber-50 text-amber-600 border border-amber-100">
                          Recurring
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-md text-[9px] font-black uppercase bg-slate-50 text-slate-500 border border-slate-100">
                          One-Time
                        </span>
                      )}
                    </td>

                    {/* Info Text */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className="text-[10px] font-bold px-2 py-1 rounded-full border"
                        style={{ color: item.info?.text_color, borderColor: `${item.info?.text_color}20`, backgroundColor: `${item.info?.text_color}05` }}
                      >
                        {item.info?.text}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-2">
                        {item.options?.map((opt, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleAction(opt, item)}
                            className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            title={opt.label}
                          >
                            <Trash2 size={16} />
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-20 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 text-slate-300">
              <Receipt size={32} />
            </div>
            <h3 className="text-gray-900 font-bold text-lg">No Waived Fees</h3>
            <p className="text-gray-500 text-sm max-w-xs mt-1">Currently, no students have had their late waveOffLateFees waived for the selected criteria.</p>
          </div>
        )}
      </div>

      {/* Pagination Mapping */}
      {
        totalPages > 1 && (
          <div className="flex items-center justify-between px-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Info size={14} /> Total Records: {totalCount}
            </div>
            <div className="flex gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50"
              >
                Prev
              </button>
              <div className="flex items-center px-4 text-xs font-black text-indigo-600 bg-indigo-50 rounded-xl border border-indigo-100">
                {currentPage} / {totalPages}
              </div>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )
      }

    </div >
  );
};

export default WaveOffLateFeesTable;