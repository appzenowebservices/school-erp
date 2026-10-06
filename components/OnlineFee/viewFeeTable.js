'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { getSessionCache } from '../../utils/sessionCache';
import Loader from '../ui/status/Loader';
import { getFee } from '../../api/fees';
import Link from 'next/link';
// ================================================================

const ViewFeeTable = ({ fees }) => {



  const [viewMode, setViewMode] = useState('overview');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  const [filters, setFilters] = useState({
    feeType: "",
    joinedDate: "",
    status: [],
    accountStatus: [],
    designations: [],
    title: "",
    name: "",
    motherName: "",
    fatherName: "",
    mobile: "",
    emergencyContact: "",
    isSearch: false,
  });

  // ================================================================
  const config = getSessionCache("dashboardConfig");
  const context = getSessionCache("dashboardContext");
  // ================================================================

  const [permissionDrawer, setPermissionDrawer] = useState(false);
  const [markFeeForStudents, setMarkFeeForStudents] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStandard, setSelectedStandard] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const feesPerPage = 10;


  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [isLoading, setIsLoading] = useState(false);




  // ==================================================================================================
  const fetchFees = async () => {
    // const pageSize = feesResponse?.limit || feesPerPage;
    const pageSize = 1
    try {
      const res = await getFee(
        context.profileId,
        context.session,
        currentPage,
        pageSize,
        {
          feeType: filters?.feeType || "",
          standards: filters?.standards || [],
          enabled: filters?.enabled ?? "",
          hostelFee: filters?.hostelFee ?? "",
          startDate: filters?.startDate || "",
          endDate: filters?.endDate || "",
          dueDate: filters?.dueDate || "",
        }
      );
      setFees(res?.data?.results?.fees)
    } catch (error) {
      console.error("Error fetching fees:", error);
    }
  };

  useEffect(() => {
    if (!context?.profileId || !context?.session) return;


    fetchFees();
    setFilters((prev) => ({ ...prev, type: config?.fee_frequency[0]?.value || "" }));

    setIsFilterPanelOpen(false)
  }, [
    context?.profileId,
    context?.session,
    currentPage,
    filters?.type,
    filters?.standards,
    filters?.dueDate,
    filters?.startDate,
    filters?.endDate,
    filters?.hostelFee,
    filters?.enabled,


  ]);



  const standards = useMemo(() => {
    if (!fees) return [];
    const uniqueStandards = [...new Set(fees.map(fee => fee?.standard?.name))];
    return uniqueStandards.filter(Boolean).sort();
  }, [fees]);

  const feeTypes = useMemo(() => {
    if (!fees) return [];
    const types = [...new Set(fees.map(fee => fee?.type))];
    return types.filter(Boolean);
  }, [fees]);

  const filteredFees = useMemo(() => {
    if (!fees) return [];
    return fees.filter(fee => {
      const matchesStandard = !selectedStandard || fee?.standard?.name === selectedStandard;
      const matchesType = !selectedType || fee?.type === selectedType;
      const matchesSearch = !searchTerm || fee?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStandard && matchesType && matchesSearch;
    });
  }, [fees, selectedStandard, selectedType, searchTerm]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedStandard, selectedType, searchTerm]);


  const serverLimit = 1
  const totalPages = Math.ceil((0) / serverLimit);

  const indexOfLastFee = currentPage * feesPerPage;
  const indexOfFirstFee = indexOfLastFee - feesPerPage;
  const currentFees = filteredFees;

  const goToPage = (pageNumber) => {
    if (pageNumber < 1) return;
    setCurrentPage(pageNumber); // effect will fetch that page
  };

  const goToPrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({})
    setSelectedStandard('');
    setSelectedType('');
    setSearchTerm('');
  };

  // Get badge color based on fee type
  const getTypeBadgeColor = (type) => {
    const colors = {
      'MONTHLY': 'bg-blue-100 text-blue-800',
      'YEARLY': 'bg-green-100 text-green-800',
      'ONE_TIME': 'bg-purple-100 text-purple-800',
      'QUARTERLY': 'bg-yellow-100 text-yellow-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };


  const handleActionClick = (option, fee) => {
    if (option.action === 'view') {
      setSelectedFee(fee);
      setDrawerOpen(true);
      return;
    }
    if (option.action === 'edit') {
      // setMarkFeeForStudents(true)
      console.log('edit fee:', fee.id);
      return;
    }
    if (option.action === 'delete') {
      console.log('delete fee:', fee.id);
      return;

    }
    console.log(`${option.action} fee:`, fee.id);
  };



  const handlePayFee = (option, fee) => {
    // console.log(`${option.action} fee:`, fee);

    if (option.action === 'pay') {
      setSelectedFee(fee);
      setMarkFeeForStudents(true);
      return;
    }

  };




  if (isLoading) {
    return (
      <Loader />
    )
  }


  return (


    <>



      {/* ====================================================================== */}



      <div className="space-y-6">



        {currentFees.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fee Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Standard
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentFees.map((fee) => (
                    <tr key={fee?.id} className="hover:bg-gray-50 transition">

                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          href={`/dashboard/view-fee/${fee.id}`}
                          className="block"
                        >
                          <div className="text-sm font-medium text-indigo-600 hover:underline">
                            {fee?.name}
                          </div>

                          {fee?.is_miscellaneous && (
                            <span className="text-xs text-gray-500">Miscellaneous</span>
                          )}
                        </Link>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{fee?.standard?.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeBadgeColor(fee?.type)}`}>
                          {fee?.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">₹{fee?.amount}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{fee?.due_date?.text || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${fee?.is_disabled ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                          {fee?.is_disabled ? 'Disabled' : 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          {[
                            ...fee?.options,
                            { label: "Pay Fee", action: "pay" },
                            { label: "Download Structure", action: "download" }
                          ].map((option, idx) => (
                            <>
                              <button
                                key={idx}
                                className={`cursor-pointer px-3 py-1 rounded transition
          ${option.action === 'delete'
                                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                    : option.action === 'edit'
                                      ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                      : option.action === 'pay'
                                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                        : option.action === 'download'
                                          ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                  }`}
                                onClick={() => {
                                  if (option.action === 'pay') return handlePayFee(option, fee);
                                  if (option.action === 'download') return handleDownloadStructure(fee);
                                  return handleActionClick(option, fee);
                                }}
                              >
                                {option.label}
                              </button>


                            </>

                          ))}

                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg">No fees found matching your filters</p>
            <button
              onClick={clearFilters}
              className="cursor-pointer mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Clear Filters
            </button>
          </div>
        )}

        {totalPages > 1 && currentFees.length > 0 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={goToPrevious}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Previous
            </button>

            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`w-10 h-10 rounded-lg transition ${currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={goToNext}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next
            </button>
          </div>
        )}

        {filteredFees.length > 0 && (
          <p className="text-center text-sm text-gray-600">
            Showing {indexOfFirstFee + 1}-{Math.min(indexOfLastFee, filteredFees.length)} of {filteredFees.length} fees
          </p>
        )}
      </div>

    </>

  );
};

export default ViewFeeTable;