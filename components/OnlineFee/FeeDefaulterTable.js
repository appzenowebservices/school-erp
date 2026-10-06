'use client';
import React, { useState, useMemo } from 'react';
import Loader from '../ui/status/Loader';
import { 
  Calendar, 
  AlertCircle, 
  MessageSquare, 
  Phone, 
  ExternalLink,
  Clock,
  Send,
  BellRing,
  CheckCircle2
} from 'lucide-react';

const FeeDefaulterTable = ({ defaulters = [], loading, totalCount }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]); // Track selected student IDs
  const itemsPerPage = 10;

  const totalPages = Math.ceil((totalCount || defaulters.length) / itemsPerPage);
  const currentData = defaulters.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // ================= Selection Logic =================
  const toggleSelectAll = () => {
    if (selectedIds.length === currentData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(currentData.map(item => item.student.id));
    }
  };

  const toggleSelectRow = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  if (loading) return (
    <div className="min-h-[400px] flex items-center justify-center bg-white rounded-2xl border border-gray-100">
      <Loader text="Analyzing payment records..." />
    </div>
  );

  return (
    <div className="space-y-4 relative">
      
      {/* Floating Action Bar - Shows when items are selected */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-6 border border-gray-700">
            <div className="flex items-center gap-2 border-r border-gray-700 pr-6">
              <div className="bg-blue-500 h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold">
                {selectedIds.length}
              </div>
              <span className="text-sm font-medium">Students Selected</span>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => console.log("Sending Standard Reminders to:", selectedIds)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl text-sm font-bold transition-all active:scale-95"
              >
                <Send size={16} /> Send Reminder
              </button>
              
              <button 
                onClick={() => console.log("Custom Notification for:", selectedIds)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-bold transition-all border border-white/10"
              >
                <BellRing size={16} /> Custom Notification
              </button>

              <button 
                onClick={() => setSelectedIds([])}
                className="text-gray-400 hover:text-white text-xs font-medium ml-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden flex flex-col">
        {currentData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-red-50/50">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input 
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4 cursor-pointer"
                      checked={selectedIds.length === currentData.length && currentData.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-4 py-4 text-left text-[10px] font-bold text-red-400 uppercase tracking-widest">Student Details</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-red-400 uppercase tracking-widest">Overdue Fees</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-red-400 uppercase tracking-widest">Status Remark</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-red-400 uppercase tracking-widest">Contact</th>
                  <th className="px-6 py-4 text-right text-[10px] font-bold text-red-400 uppercase tracking-widest">Action</th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-100">
                {currentData.map((item) => {
                  const isRowSelected = selectedIds.includes(item.student.id);
                  return (
                    <tr 
                      key={item.student.id} 
                      className={`transition-colors group ${isRowSelected ? 'bg-blue-50/50' : 'hover:bg-red-50/20'}`}
                    >
                      <td className="px-6 py-4">
                        <input 
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4 cursor-pointer"
                          checked={isRowSelected}
                          onChange={() => toggleSelectRow(item.student.id)}
                        />
                      </td>
                      {/* Student Info */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img 
                              src={item.student.image_url} 
                              alt="" 
                              className="h-10 w-10 rounded-xl object-cover border border-gray-200"
                              onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=' + item.student.name }}
                            />
                            {isRowSelected ? (
                              <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-0.5 border-2 border-white">
                                <CheckCircle2 size={10} />
                              </div>
                            ) : (
                              <div className="absolute -bottom-1 -right-1 bg-red-500 w-3 h-3 rounded-full border-2 border-white" />
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-gray-800">{item.student.name}</div>
                            <div className="text-[10px] text-gray-400 font-medium">
                              {item.student.class.name} • Roll: {item.student.roll_number}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Overdue Fees List */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {item.fees.map((fee) => (
                            <div key={fee.id} className="flex flex-col">
                              <span className="text-xs font-bold text-gray-700">{fee.name}</span>
                              <span className="text-[10px] flex items-center gap-1 text-red-500 font-medium">
                                <Calendar size={10} /> Due: {fee.due_date}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Last Reminder / Status */}
                      <td className="px-6 py-4">
                        <div className="inline-flex flex-col">
                          <span 
                            className="text-[11px] font-semibold px-2 py-1 rounded-md bg-white border border-gray-200 shadow-sm"
                            style={{ color: item.last_reminder.text_color }}
                          >
                            {item.last_reminder.text}
                          </span>
                          <span className="text-[9px] text-gray-400 mt-1 flex items-center gap-1">
                            <Clock size={10} /> Payment Overdue
                          </span>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                          <Phone size={12} className="text-blue-500" />
                          {item.student.registered_phone_form_sms}
                        </div>
                      </td>

                      {/* Individual Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all" title="Quick SMS">
                            <MessageSquare size={16} />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-all">
                            <ExternalLink size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
             <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4 text-green-500">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-gray-900 font-bold text-lg">No Defaulters Found</h3>
            <p className="text-gray-500 text-sm mt-1">All selected students have cleared their dues.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeeDefaulterTable;