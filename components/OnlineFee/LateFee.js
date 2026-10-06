'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { getSessionCache } from '../../utils/sessionCache';
import FeeTypeDetail from '../ui/drawer/FeeTypeDetail';
import Loader from '../ui/status/Loader';
import ViewFeeFiltersSummary from './ViewFeeFiltersSummary';
import VariableFeeFilterPanel from './VariableFeeFilterPanel';
import { Receipt, ReceiptIndianRupee, } from 'lucide-react';
import { deleteLateFee, getLateFee } from '../../api/fees';
import AddFeeTypeStudents from './AddFeeTypeStudents';
import { FaTrash } from 'react-icons/fa';
import ConfirmationDialogueBox from '../ui/status/Confirmation';
import HeaderLateFee from './HeaderLateFee';
import AddLateFee from './AddLateFee';
// ==========================================================================================================

const LateFee = ({ }) => {
  const [removeLateFee, setRemoveLateFee] = useState(false);

  const [staffStatus, setStudentStatus] = useState([
    {
      name: "Receive Daily Notification",

    },
    {
      name: "Has Account",
    },
    {

      name: "Allowed for Admin Accesss",
    },

  ]);



  const [accountStatus, setAccountStatus] = useState([
    {
      name: "Active",

    },
    {
      name: "Disabled",
    },


  ]);

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
  const [addLateFee, setAddLateFee] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStandard, setSelectedStandard] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const feesPerPage = 10;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [variableFee, setVariableFee] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [lateFees, setLateFees] = useState([]);
  const [feeTypes_, setFeeTypes_] = useState([]);

  // ==================================================================================================
  const fetchLateFee = async () => {


    const pageSize = 1
    try {
      const res = await getLateFee(
        context.profileId,
        context.session,
        currentPage,
        pageSize,
      );

      setLateFees(res?.data?.results?.late_fees || []);

    } catch (error) {
      console.error("Error fetching variableFee:", error);
    }
  };




  useEffect(() => {
    if (!context?.profileId || !context?.session) return;



    fetchLateFee()
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


  useEffect(() => {


    fetchLateFee()

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

  // Filter variableFee based on selected criteria
  const filteredFees = useMemo(() => {
    if (!lateFees) return [];
    return lateFees.filter(fee => {
      const matchesStandard = !selectedStandard || fee?.standard?.name === selectedStandard;
      const matchesType = !selectedType || fee?.type === selectedType;
      const matchesSearch = !searchTerm || fee?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStandard && matchesType && matchesSearch;
    });
  }, [lateFees, selectedStandard, selectedType, searchTerm]);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedStandard, selectedType, searchTerm]);

  // if (!variableFee || isLoading || variableFee.length === 0) {
  //   return <p className="text-center text-gray-500">No fee data available</p>;
  // }
  // const serverLimit = feesResponse?.limit || feesPerPage;
  const serverLimit = 1
  const totalPages = Math.ceil((0) / serverLimit);

  // Calculate pagination
  const indexOfLastFee = currentPage * feesPerPage;
  const indexOfFirstFee = indexOfLastFee - feesPerPage;
  const currentFees = filteredFees; // variableFee is already server-limited; filteredFees applies any lightweight client filtering

  // Pagination handlers
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







  const toggleFilterPanel = () => {
    setIsFilterPanelOpen(!isFilterPanelOpen);
  };

  const getFilterCount = () => {
    return (filters?.type ? 1 : 0) + (filters?.name ? 1 : 0) + (filters?.standards?.length) + (filters?.enabled ? 1 : 0) + (filters?.hostelFee ? 1 : 0) + (filters?.dueDate ? 1 : 0) + (filters?.startDate ? 1 : 0) + (filters?.endDate ? 1 : 0);
  };

  const toggleFilter = (filterType, value, event) => {
    // console.log('---- values ----', filterType, value, event);

    if (event) {
      event.stopPropagation();
    }
    setFilters(prev => {

      const current = prev[filterType];
      // If current is an array (multi-select), toggle value in the array
      if (Array.isArray(current)) {
        if (current.includes(value)) {
          return { ...prev, [filterType]: current.filter(item => item !== value) };
        } else {
          return { ...prev, [filterType]: [...current, value] };
        }
      }
      // If scalar (string/date), toggle between value and empty
      return { ...prev, [filterType]: current === value ? '' : value };


    });

  };


  const handleRemoveLateFee = async () => {
    console.log('selectrssssssssedId',removeLateFee);
    setLoading(true);
    setError(false);
    setShowSuccess(false);
    setApiResponse("");

    try {


      const result = await deleteLateFee(
        context.profileId,
        context.session,
        removeLateFee?.id
      );

      if (result?.data?.success) {
        setShowSuccess(true);
        setApiResponse({
          message: result.data?.results?.message
        });

        setRemoveLateFee(false);

        setTimeout(() => {
          setShowSuccess(false);
          setApiResponse("");
          // reload the whole window after success
          window.location.reload();
        }, 1500);

      } else {
        setRemoveLateFee(false);
        setError(true);
        setApiResponse({
          status: "error",
          message: result.data?.results?.message
        });

        setTimeout(() => {
          setError(false);
          setApiResponse("");
        }, 3000);
      }

    } catch (err) {
      setError(true);
      setRemoveLateFee(false);
      setApiResponse({
        message: "Request failed."
      });

      setTimeout(() => {
        setError(false);
        setApiResponse("");
      }, 3000);

    } finally {
      setLoading(false);
    }
  };





  if (isLoading) {
    return (<Loader />)
  }
  console.log('lateFees', lateFees);

  // ======================================================================

  return (
    <>
      {/* ================== Drawer ======================================== */}

      <button
        onClick={() => setAddLateFee(true)}
        className="cursor-pointer group relative px-6 py-2.5 bg-gradient-to-r from-accent to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 font-medium"
      >
        ⚙️ Add Late Fee
      </button>


      <FeeTypeDetail
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        selectedFee={selectedFee}
        context={context}
      />

      {drawerOpen && <div onClick={() => setDrawerOpen(false)} className="fixed inset-0 bg-black-50 bg-opacity-30 z-40"></div>}


      {/* ======================================================================= */}



      <div className="space-y-6">

        {/* Search and Filters */}

        <div className="bg-white rounded-lg shadow p-6">
          {/* Header Section */}


          <HeaderLateFee
            headerTitle={"Late Fee"}
            headerIcon={<ReceiptIndianRupee />}
            toggleFilterPanel={toggleFilterPanel}
            getFilterCount={getFilterCount}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />


          <ViewFeeFiltersSummary
            filters={filters}
            toggleFilter={toggleFilter}
            clearFilters={clearFilters}
          />

          <VariableFeeFilterPanel

            setFilters={setFilters}
            filters={filters}
            config={config}
            isFilterPanelOpen={isFilterPanelOpen}
            staffStatus={staffStatus}
            accountStatus={accountStatus}
            toggleFilter={toggleFilter}
            lateFees={lateFees}
            feeTypes_={feeTypes_}
          />

        </div>


        {/* Student Fee Table Container */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[400px] flex flex-col">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader text="Fetching student fee records..." />
            </div>
          ) : currentFees.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50/50">
                  <tr>

                    <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Standard
                    </th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Fee Head
                    </th>
                    <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Late Fee
                    </th>

                    <th className="px-6 py-4 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Is Recurring
                    </th>
                    <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-100">
                  {currentFees.map((item) => (
                    <tr key={item?.id} className="hover:bg-blue-50/30 transition-colors group">
                      {/* Student Info with Avatar-like Initials */}


                      {/* Standard */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                          {item?.standard?.name}
                        </span>
                        <div className="text-[10px] text-gray-400 mt-1 uppercase font-bold">{item?.standard?.class?.name}</div>
                      </td>

                      {/* Fee Head & Type */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-800">{item?.fee?.name}</div>
                        <div className="text-[11px] text-blue-500 font-bold uppercase tracking-tighter">
                          {item?.fee?.name}
                        </div>
                      </td>

                      {/* Late Fee Amount */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className={`text-sm font-black ${Number(item?.late_fee_amount) > 0 ? "text-rose-600" : "text-gray-400"}`}>
                          ₹{Number(item?.amount || 0).toLocaleString()}
                        </div>
                      </td>

                      {/* Is Recurring Badge */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {item?.is_recurring ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100">
                            <span className="w-1 h-1 rounded-full bg-emerald-600 animate-pulse" />
                            Recurring
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-gray-300 uppercase">One-time</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <button
                          className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          onClick={() => {
                            setSelectedFee(item);
                            setRemoveLateFee(item);
                          }}
                          title="Remove Late Fee"
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
            /* Enhanced Empty State */
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-gray-50/30">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mb-4 text-gray-300">
                <Receipt size={32} />
              </div>
              <h3 className="text-gray-900 font-bold text-lg">No records found</h3>
              <p className="text-gray-500 text-sm max-w-xs mt-1">
                We couldn't find any fee entries matching your current filter criteria.
              </p>
              <button
                onClick={clearFilters}
                className="mt-6 px-5 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-gray-200 hover:shadow-blue-100"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
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

        {/* Results Info */}
        {filteredFees.length > 0 && (
          <p className="text-center text-sm text-gray-600">
            Showing {indexOfFirstFee + 1}-{Math.min(indexOfLastFee, filteredFees.length)} of {filteredFees.length} variableFee
          </p>
        )}
      </div>


      <AddLateFee
        open={addLateFee}
        onClose={() => setAddLateFee(false)}
        config={config}
        context={context}
        selectedStudent={selectedStudent}
        setSelectedStudent={setSelectedStudent}
      />


      {removeLateFee && (
        <ConfirmationDialogueBox
          title="Remove Late Fee?"
          description={`Are you sure you want to remove Late Fee ?`}
          onConfirm={handleRemoveLateFee}
          onCancel={() => setRemoveLateFee(null)}
        />
      )}
      <div className="fixed right-0 top-0 w-full sm:w-[420px] z-[60] p-4 space-y-3">

        {showSuccess && (
          <div className="relative bg-green-100 border border-green-300 text-green-800 rounded-lg px-4 py-3 shadow-md">
            <span className="font-medium">{apiResponse.message}</span>
          </div>
        )}

        {error && (
          <div className="relative bg-red-100 border border-red-300 text-red-800 rounded-lg px-4 py-3 shadow-md">
            <span className="font-medium">{apiResponse.message}</span>
          </div>
        )}

      </div>


    </>

  );
};
// ================================================================

export default LateFee;
// ================================================================
