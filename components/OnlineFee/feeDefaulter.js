'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { getSessionCache } from '../../utils/sessionCache';
import FeeTypeDetail from '../ui/drawer/FeeTypeDetail';
import Loader from '../ui/status/Loader';
import ViewFeeFiltersSummary from './ViewFeeFiltersSummary';
import ViewFeeFilterPanel from './ViewFeeFilterPanel';
import { ReceiptIndianRupee } from 'lucide-react';
import { getFeeDefaultersList } from '../../api/fees';
import HeaderFeeTypes from './HeaderFeeTypes';
import AddFeeType from './AddFeeType';
import FeeDefaulterTable from './FeeDefaulterTable';
import HeaderFeeDefaulter from './HeaderFeeDefaulter';
import FeeDefaulterFilterPanel from './FeeDefaulterFilterPanel';


const FeeDefaulter = ({ }) => {

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
    classes: [],          // Array of selected class IDs
    feeIds: [],           // Array of selected fee type IDs
    asOnDate: new Date().toISOString().split('T')[0], // Defaults to today
    studentId: "",        // Single student ID
    renewalStatus: "",    // Single status string
    triggerSearch: 0      // Used to trigger the API call
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
  const [feesDefaulter, setFeesDefaulter] = useState([]);
  const [selectedFee, setSelectedFee] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  // console.log('-=---fee =======>>', feesDefaulter);




  // ==================================================================================================
  const fetchFeesDefaulter = async () => {
    // Start loader here if you have one: setLoading(true);

    try {
      const payload = {
        // Multi-select arrays
        classes: filters?.classes || [],
        fee_ids: filters?.feeIds || [],

        // Date and strings
        as_on_date: filters?.asOnDate || "",
        student_id: filters?.studentId || "",
        renewal_status: filters?.renewalStatus || "",

        // Pagination (uncomment if your API supports it)
        // page: currentPage,
        // limit: 10 
      };

      const re = await getFeeDefaultersList(
        context.profileId,
        context.session,
        payload
      );


      if (re?.data?.success) {
        // Adjusting the mapping based on typical Defaulter API structures
        // usually results are in 'defaulters' or directly in the results array
        setFeesDefaulter(re?.data?.results?.fee_defaulters?.items || []);
      }

    } catch (error) {
      console.error("Error fetching feesDefaulter:", error);
    } finally {
      // setLoading(false);
    }
  };
      console.log('setFeesDefaulter=======>>',feesDefaulter);



  useEffect(() => {
    if (!context?.profileId || !context?.session) return;

    if (!filters?.renewalStatus && config?.fee_frequency?.length > 0) {
      setFilters((prev) => ({
        ...prev,
        renewalStatus: "pending"
      }));
    }

    fetchFeesDefaulter();


  }, [
    context?.profileId,
    context?.session,
    currentPage,
    filters?.asOnDate,
    filters?.classes,
    filters?.feeIds,
    filters?.studentId,
    filters?.renewalStatus,
    filters?.triggerSearch
  ]);

  // console.log('filters_____', filters)
  const filteredFees = useMemo(() => {
    // 1. Ensure we are targeting the actual array. 
    // If results is an object, the list is likely in results.defaulters or similar.
    // Check your console.log('Defaulter API Response') to confirm the key name.
    const dataArray = Array.isArray(feesDefaulter)
      ? feesDefaulter
      : (feesDefaulter?.results || []); // Adjust 'results' to the actual key name if needed

    if (!Array.isArray(dataArray)) return [];

    return dataArray.filter(fee => {
      const matchesStandard = !selectedStandard || fee?.student?.class?.name === selectedStandard;
      const matchesType = !selectedType || fee?.type === selectedType;
      const matchesSearch = !searchTerm || fee?.student?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStandard && matchesType && matchesSearch;
    });
  }, [feesDefaulter, selectedStandard, selectedType, searchTerm]);
  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedStandard, selectedType, searchTerm]);

  // if (!feesDefaulter || isLoading || feesDefaulter.length === 0) {
  //   return <p className="text-center text-gray-500">No fee data available</p>;
  // }
  let totalCount = feesDefaulter?.total_count || 0;
  const serverLimit = feesDefaulter?.limit || feesPerPage;
  const totalPages = Math.ceil((totalCount || 0) / serverLimit);

  // Calculate pagination
  const indexOfLastFee = currentPage * feesPerPage;
  const indexOfFirstFee = indexOfLastFee - feesPerPage;
  const currentFees = filteredFees; // feesDefaulter is already server-limited; filteredFees applies any lightweight client filtering



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


  if (isLoading) {
    return (
      <Loader />
    )
  }







  // console.log('filter s ', filters);



  return (


    <>
      {/* ================== Drawer ======================================== */}


      <AddFeeType
        open={markFeeForStudents}
        onClose={() => setMarkFeeForStudents(false)}
        feeTypes={currentFees}
        context={context}
        feesDefaulter={feesDefaulter}
        selectedFee={selectedFee}

      />



      <button
        onClick={() => setMarkFeeForStudents(true)}
        className="cursor-pointer group relative px-6 py-2.5 bg-gradient-to-r from-accent to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 font-medium"
      >
        ⚙️ Add Fee Type
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
          <HeaderFeeDefaulter
            headerTitle={"Fee Defaulters"}
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

          <FeeDefaulterFilterPanel
            setFilters={setFilters}
            filters={filters}
            config={config}
            isFilterPanelOpen={isFilterPanelOpen}
            staffStatus={staffStatus}
            accountStatus={accountStatus}
            toggleFilter={toggleFilter}

          />







        </div>



        <FeeDefaulterTable
          defaulters={feesDefaulter}
        />

      </div >

    </>

  );
};

export default FeeDefaulter;