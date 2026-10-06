'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { useFees } from '../../controllers/fees';
import { getSessionCache } from '../../utils/sessionCache';
import CreateFee from '../ui/drawer/CreateFee';
import FeeTypeDetail from '../ui/drawer/FeeTypeDetail';
import FeePermissionManager from './FeePermissionManager';
import AddFeeTypeStudents from './AddFeeTypeStudents';
import Loader from '../ui/status/Loader';
// import HeaderViewFee from './HeaderViewFee';
import ViewFeeFiltersSummary from './ViewFeeFiltersSummary';
import ViewFeeFilterPanel from './ViewFeeFilterPanel';
import { ReceiptIndianRupee } from 'lucide-react';
import { getFeeTypes } from '../../api/fees';
import HeaderFeeTypes from './HeaderFeeTypes';
import FeeTypesTable from './FeeTypesTable';
import AddFeeType from './AddFeeType';


const FeeTpes = ({ }) => {

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

  const [permissionDrawer, setPermissionDrawer] = useState(false);
  const [markFeeForStudents, setMarkFeeForStudents] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStandard, setSelectedStandard] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const feesPerPage = 10;


  const [drawerOpen, setDrawerOpen] = useState(false);
  const [fees, setFees] = useState([]);
  const [selectedFee, setSelectedFee] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  // console.log('-=---fee =======>>', fees);




  // ==================================================================================================
  const fetchFeesTypes = async () => {
    // const pageSize = feesResponse?.limit || feesPerPage;

    try {
      const re = await getFeeTypes(
        context.profileId,
        context.session,
        // currentPage,
        // pageSize,
        // {
        //   feeType: filters?.feeType || "",
        //   standards: filters?.standards || [],
        //   enabled: filters?.enabled ?? "",
        //   hostelFee: filters?.hostelFee ?? "",
        //   startDate: filters?.startDate || "",
        //   endDate: filters?.endDate || "",
        //   dueDate: filters?.dueDate || "",
        // }
      );
      // console.log('fee =======>>', re?.data?.results?.fee_types);

      if (re.status) {
        setFees(re?.data?.results?.fee_types || []);
      }

    } catch (error) {
      console.error("Error fetching fees:", error);
    }
  };




  useEffect(() => {
    if (!context?.profileId || !context?.session) return;


    fetchFeesTypes();
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



  // Extract unique standards from fees
  const standards = useMemo(() => {
    if (!fees) return [];
    const uniqueStandards = [...new Set(fees.map(fee => fee?.standard?.name))];
    return uniqueStandards.filter(Boolean).sort();
  }, [fees]);

  // Extract unique fee types
  const feeTypes = useMemo(() => {
    if (!fees) return [];
    const types = [...new Set(fees.map(fee => fee?.type))];
    return types.filter(Boolean);
  }, [fees]);

  // Filter fees based on selected criteria
  const filteredFees = useMemo(() => {
    if (!fees) return [];
    return fees.filter(fee => {
      const matchesStandard = !selectedStandard || fee?.standard?.name === selectedStandard;
      const matchesType = !selectedType || fee?.type === selectedType;
      const matchesSearch = !searchTerm || fee?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStandard && matchesType && matchesSearch;
    });
  }, [fees, selectedStandard, selectedType, searchTerm]);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedStandard, selectedType, searchTerm]);

  // if (!fees || isLoading || fees.length === 0) {
  //   return <p className="text-center text-gray-500">No fee data available</p>;
  // }
  let totalCount = fees?.total_count || 0;
  const serverLimit = fees?.limit || feesPerPage;
  const totalPages = Math.ceil((totalCount || 0) / serverLimit);

  // Calculate pagination
  const indexOfLastFee = currentPage * feesPerPage;
  const indexOfFirstFee = indexOfLastFee - feesPerPage;
  const currentFees = filteredFees; // fees is already server-limited; filteredFees applies any lightweight client filtering

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

  const getCountColor = (count) => {
    if (count == 0) return "bg-gray-100 text-gray-700";
    if (count <= 2) return "bg-green-100 text-green-700";
    if (count <= 5) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
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

  const handleToggle = (fee, key) => {
    console.log(' hnadling : ', fee, key);

  }

  const handlePayFee = (option, fee) => {
    // console.log(`${option.action} fee:`, fee);

    if (option.action === 'pay') {
      setSelectedFee(fee);
      // setMarkFeeForStudents(true);
      return;
    }

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
        fees={fees}
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


          <HeaderFeeTypes
            headerTitle={"Fee Types"}
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

          <ViewFeeFilterPanel
            setFilters={setFilters}
            filters={filters}
            config={config}
            isFilterPanelOpen={isFilterPanelOpen}
            staffStatus={staffStatus}
            accountStatus={accountStatus}
            toggleFilter={toggleFilter}

          />







        </div>



        <FeeTypesTable
          feeTypes={currentFees}
        />

      </div >

    </>

  );
};

export default FeeTpes;