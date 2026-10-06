'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { getSessionCache } from '../../utils/sessionCache';
import Loader from '../ui/status/Loader';
import ViewFeeFiltersSummary from './ViewFeeFiltersSummary';
import { AlertCircle, CheckCircle2, Receipt, ReceiptIndianRupee, X, } from 'lucide-react';
import { deleteWaiveOffLateFee, getPayoutList } from '../../api/fees';
import ConfirmationDialogueBox from '../ui/status/Confirmation';
import AddLateFee from './AddLateFee';
import WaveOffLateFeesTable from './WaveOffLateFeesTable';
import HeaderPayout from './HeaderPayout';
import PayoutFilterPanel from './PayoutFilterPanel';
// ==========================================================================================================

const Payouts = ({ }) => {
  const [payouts, setPayouts] = useState(false);

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
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [waveOffLateFees, setWaveOffLateFees] = useState([]);
  const [feeTypes_, setFeeTypes_] = useState([]);

  // ==================================================================================================
  const fetchPayouts = async () => {


    const pageSize = 1
    try {
      const res = await getPayoutList(
        context.profileId,
        context.session
      );
      console.log('res', res);

      setWaveOffLateFees(res?.data?.results?.waive_off_late_fees || []);

    } catch (error) {
      console.error("Error fetching variableFee:", error);
    }
  };




  useEffect(() => {
    if (!context?.profileId || !context?.session) return;



    fetchPayouts()
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


    fetchPayouts()

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
    if (!waveOffLateFees) return [];
    return waveOffLateFees.filter(fee => {
      const matchesStandard = !selectedStandard || fee?.standard?.name === selectedStandard;
      const matchesType = !selectedType || fee?.type === selectedType;
      const matchesSearch = !searchTerm || fee?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStandard && matchesType && matchesSearch;
    });
  }, [waveOffLateFees, selectedStandard, selectedType, searchTerm]);

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


  // console.log('selectrssssssssedId', selectedFee);
  const handleRemoveWaiveOffLateFee = async () => {
    setLoading(true);
    setError(false);
    setShowSuccess(false);
    setApiResponse("");

    try {


      const result = await deleteWaiveOffLateFee(
        context.profileId,
        context.session,
        selectedFee?.id
      );
      console.log('resul___t', result?.data);

      if (result?.data?.success) {
        setShowSuccess(true)
        setApiResponse(result?.data?.results?.message || "Fee Waved Off successfully");


        setPayouts(false);

        setTimeout(() => {
          setShowSuccess(null);
          setApiResponse("");
          // reload the whole window after success
          window.location.reload();
        }, 1500);

      } else {
        setPayouts(false);
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
      setPayouts(false);
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
  // console.log('apiResponse', apiResponse);

  // ======================================================================

  return (
    <>


      {/* ======================================================================= */}



      <div className="space-y-6">

        {/* Search and Filters */}

        <div className="bg-white rounded-lg shadow p-6">
          {/* Header Section */}


          <HeaderPayout
            headerTitle={"Payouts"}
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

          <PayoutFilterPanel

            setFilters={setFilters}
            filters={filters}
            config={config}
            isFilterPanelOpen={isFilterPanelOpen}
            staffStatus={staffStatus}
            accountStatus={accountStatus}
            toggleFilter={toggleFilter}
            waveOffLateFees={waveOffLateFees}
            feeTypes_={feeTypes_}
          />

        </div>

        <WaveOffLateFeesTable
          setPayouts={setPayouts}
          setSelectedFee={setSelectedFee}
          selectedFee={selectedFee}
          waveOffLateFees={waveOffLateFees}
        />
      </div>


      <AddLateFee
        open={addLateFee}
        onClose={() => setAddLateFee(false)}
        config={config}
        context={context}
        selectedStudent={selectedStudent}
        setSelectedStudent={setSelectedStudent}
      />


      {payouts && (
        <ConfirmationDialogueBox
          title="Wave Off Late Fee?"
          description={`Are you sure you want to delete Fee: ${selectedFee?.fee?.name} for Student: ${selectedFee?.student?.name} ?`}
          onConfirm={handleRemoveWaiveOffLateFee}
          onCancel={() => setPayouts(null)}
        />
      )}
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

        {showSuccess && (
          <div className="bg-white border-l-4 border-green-500 shadow-2xl rounded-2xl px-5 py-4 flex items-center gap-4 animate-in slide-in-from-right">
            <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600 shrink-0">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Done!</p>
              <p className="text-xs font-medium text-slate-500">{showSuccess}</p>
            </div>
          </div>
        )}
      </div>

    </>

  );
};
// ================================================================

export default Payouts;
// ================================================================
