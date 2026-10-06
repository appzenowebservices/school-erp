'use client';
import React, { useState, useMemo } from 'react';
import Loader from '../ui/status/Loader';
import { Bus, Users, MapPin, Eye, ChevronRight, MessageSquare, ShieldCheck, MoreVertical, AlertCircle, X, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import TransportLocationEditModal from './TransportLocationEditModal';
import { updateTransportLocation } from '../../api/fees';
import { getSessionCache } from '../../utils/sessionCache';

const ACTION_CONFIG = {
  'View Students': { icon: Eye, color: "text-blue-600 hover:bg-blue-50" },
  'Set Location': { icon: MapPin, color: "text-emerald-600 hover:bg-emerald-50" },
  'Send SMS': { icon: MessageSquare, color: "text-amber-600 hover:bg-amber-50" },
  'default': { icon: ChevronRight, color: "text-gray-600 hover:bg-gray-50" }
};

const TransportLocationTable = ({ transportLocation = [], loading, totalCount }) => {
  const router = useRouter();
  const context = getSessionCache('dashboardContext');
  const [currentPage, setCurrentPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const itemsPerPage = 10;

  // Logic to handle the data structure provided in your sample
  const totalPages = Math.ceil((totalCount || transportLocation.length) / itemsPerPage);
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return transportLocation.slice(start, start + itemsPerPage);
  }, [transportLocation, currentPage]);

  const handleBusAction = (actionName, location) => {
    if (actionName === "View Students") {
      setDrawerOpen(true)
    }


  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100 shadow-sm">
        <Loader text="Fetching transport records..." />
      </div>
    );
  }
  const handleTransportLocationUpdate = async (updatedLocation) => {
    setSubmitted(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {

        id: selectedLocation?.id,
        name: updatedLocation.name,
        transport_fee: updatedLocation.transport_fee
      }
      const resp = await updateTransportLocation(
        context?.profileId,
        context?.session,
        payload
      );

      if (resp?.data?.success) {
        setSuccess(resp?.data?.results?.message || "Location updated successfully");

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


  return (
    <>
      <div className="space-y-4">
        <TransportLocationEditModal
          context={context}
          setDrawerOpen={setDrawerOpen}
          selectedLocation={selectedLocation}
          drawerOpen={drawerOpen}
          onSave={handleTransportLocationUpdate}
        />
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[400px]">
          {currentItems.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Route/Location</th>
                    <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Bus Details</th>
                    <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Transport Fee</th>
                    <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right text-[11px] font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-100">
                  {currentItems.map((item) => {
                    // Safely access first bus if it exists based on your data structure
                    const primaryBus = item.school_buses?.[0];

                    return (
                      <tr
                        onClick={() => {
                          setSelectedLocation(item)
                        }}
                        key={item.id} className="hover:bg-blue-50/20 transition-colors group">
                        {/* Location & School Name */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                              <MapPin size={20} />
                            </div>
                            <div className="max-w-[200px]">
                              <div className="text-sm font-bold text-gray-900 truncate">{item.name}</div>
                              <div className="text-[11px] text-gray-400 font-medium truncate uppercase tracking-tighter">
                                {item.client?.full_name || 'No School Assigned'}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Bus Number */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Bus size={14} className="text-gray-400" />
                            <span className="text-sm font-semibold text-gray-700">
                              {primaryBus ? `Bus No: ${primaryBus.number}` : 'Unassigned'}
                            </span>
                          </div>
                        </td>

                        {/* Fee */}
                        <td className="px-6 py-4">
                          <div className="inline-flex items-center px-2.5 py-0.5 rounded-lg bg-gray-100 text-gray-700 text-xs font-bold">
                            ₹{item.transport_fee || '0.00'}
                          </div>
                        </td>

                        {/* Badge for Trip Status */}
                        <td className="px-6 py-4">
                          {item.display_native_ad ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase">
                              <ShieldCheck size={10} /> Verified
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Regular</span>
                          )}
                        </td>

                        {/* Action Buttons */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-1">
                            {["View Students", "Set Location", "Send SMS"].map((action) => {
                              const config = ACTION_CONFIG[action] || ACTION_CONFIG.default;
                              const Icon = config.icon;

                              return (
                                <button
                                  key={action}
                                  onClick={() => handleBusAction(action, primaryBus)}
                                  className={`p-2 rounded-lg transition-all flex items-center gap-2 group/btn ${config.color}`}
                                  title={action}
                                >
                                  <Icon size={16} />
                                  <span className="text-[10px] font-bold uppercase hidden group-hover/btn:inline-block">
                                    {action.split(' ')[0]}
                                  </span>
                                </button>
                              );
                            })}
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
              <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center mb-4 text-gray-300">
                <Bus size={32} />
              </div>
              <h3 className="text-gray-900 font-bold text-lg">No Transport Records</h3>
              <p className="text-gray-500 text-sm mt-1 max-w-xs mx-auto">
                We couldn't find any bus locations or route data for this selection.
              </p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, transportLocation.length)} of {transportLocation.length} records
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-xs font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-30 transition-all"
              >
                Back
              </button>
              <div className="h-8 flex items-center px-4 text-xs font-black text-blue-600 bg-blue-50 rounded-xl border border-blue-100">
                {currentPage} / {totalPages}
              </div>
              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-xs font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-30 transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>


      {/* Floating Notifications */}
      <div className="fixed top-6 right-6 flex flex-col gap-3 z-[60]">
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

export default TransportLocationTable;