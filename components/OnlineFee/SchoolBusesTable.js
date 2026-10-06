'use client';
import React, { useState } from 'react';
import Loader from '../ui/status/Loader';
import { Bus, Users, MapPin, Eye, Info, ChevronRight, MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';

const SchoolBusesTable = ({ schoolBuses = [], loading, totalCount }) => {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  // Pagination Logic
  const totalPages = Math.ceil((totalCount || schoolBuses.length) / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBuses = schoolBuses.slice(indexOfFirstItem, indexOfLastItem);

  const handleBusAction = (actionName, bus) => {
    if (actionName === "View Students") {
      router.push(`/dashboard/school-buses/students?id=${bus.id}`);
    }
  }
  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-white rounded-2xl border border-gray-100">
        <Loader text="Fetching school bus records..." />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Bus Table Container */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[400px] flex flex-col">
        {currentBuses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Bus Info</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Capacity & Students</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Trip Status</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Staff</th>
                  <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-100">
                {currentBuses.map((bus) => (
                  <tr key={bus.id} className="hover:bg-blue-50/30 transition-colors group">
                    {/* Bus Number and School Name */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                          <Bus size={20} />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-800">Bus No: {bus.number}</div>
                          <div className="text-[10px] text-gray-400 font-medium max-w-[200px] truncate">
                            {bus.client?.school?.name}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Capacity and Occupancy */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                          <Users size={14} className="text-gray-400" />
                          {bus.number_of_students_in_bus} / {bus.capacity}
                        </div>
                        <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${(bus.number_of_students_in_bus / bus.capacity) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Trip Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {bus.is_on_trip ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-50 text-emerald-600 border border-emerald-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                          Live Trip
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-gray-400 uppercase px-2.5 py-1 bg-gray-50 rounded-full border border-gray-100">
                          Idle
                        </span>
                      )}
                    </td>

                    {/* Staff Info */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-[11px] space-y-0.5">
                        <div className="text-gray-700 font-medium">Driver: <span className="text-gray-400 italic">{bus.driver || 'Not Assigned'}</span></div>
                        <div className="text-gray-700 font-medium">Conductor: <span className="text-gray-400 italic">{bus.conductor || 'Not Assigned'}</span></div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-1">
                        {["View Students", "Set Location", "Send SMS"].map((actionName, idx) => {

                          // 1. Icon Assignment logic
                          const getIcon = (label) => {
                            const lowerLabel = label.toLowerCase();
                            if (lowerLabel.includes('view')) return <Eye size={16} />;
                            if (lowerLabel.includes('location')) return <MapPin size={16} />;
                            if (lowerLabel.includes('sms')) return <MessageSquare size={16} />;
                            return <ChevronRight size={16} />;
                          };

                          // 2. Color Assignment logic
                          const getColorClass = (label) => {
                            const lowerLabel = label.toLowerCase();
                            if (lowerLabel.includes('view')) return "text-blue-600 hover:bg-blue-50";
                            if (lowerLabel.includes('location')) return "text-emerald-600 hover:bg-emerald-50";
                            if (lowerLabel.includes('sms')) return "text-amber-600 hover:bg-amber-50";
                            return "text-gray-600 hover:bg-gray-50";
                          };

                          return (
                            <button
                              key={idx}
                              onClick={() => handleBusAction(actionName, bus)}
                              className={`p-2 rounded-xl transition-all flex items-center gap-2 group/btn ${getColorClass(actionName)}`}
                              title={actionName}
                            >
                              {getIcon(actionName)}
                              <span className="text-[10px] font-bold uppercase hidden group-hover/btn:inline-block whitespace-nowrap">
                                {actionName}
                              </span>
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
          <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 text-gray-300">
              <Bus size={32} />
            </div>
            <h3 className="text-gray-900 font-bold text-lg">No Buses Found</h3>
            <p className="text-gray-500 text-sm mt-1">There are no school buses registered in the system currently.</p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, schoolBuses.length)} of {schoolBuses.length} Buses
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-xs font-bold bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <div className="flex items-center px-4 text-xs font-black text-blue-600 bg-blue-50 rounded-lg">
              {currentPage} / {totalPages}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-xs font-bold bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolBusesTable;