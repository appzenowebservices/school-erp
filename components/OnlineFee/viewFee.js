'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { getSessionCache } from '../../utils/sessionCache';
import FeeTypeDetail from '../ui/drawer/FeeTypeDetail';
import FeePermissionManager from './FeePermissionManager';
import ViewFeeTable from './viewFeeTable';
import MarkFeeForStudents from './MarkFeeForStudents';
import ReportTypes from './ReportTypes';
import Loader from '../ui/status/Loader';
import HeaderViewFee from './HeaderViewFee';
import ViewFeeFiltersSummary from './ViewFeeFiltersSummary';
import ViewFeeFilterPanel from './ViewFeeFilterPanel';
import { ReceiptIndianRupee } from 'lucide-react';
import { getFee } from '../../api/fees';
import CreateFee from '../ui/drawer/CreateFee';
// ================================================================

const ViewFee = ({ }) => {

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


  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [fees, setFees] = useState(null);
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



  const currentFees = filteredFees;


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

  return (
    <>
      {/* ================== Drawer ======================================== */}
      <FeePermissionManager
        open={permissionDrawer}
        onClose={() => setPermissionDrawer(false)}
        feeTypes={currentFees}
        context={context}
      />
      <MarkFeeForStudents
        open={markFeeForStudents}
        onClose={() => setMarkFeeForStudents(false)}
        feeTypes={currentFees}
        config={config}
        selectedFee={selectedFee}
      />

      <button
        onClick={() => setPermissionDrawer(true)}
        className="cursor-pointer group relative px-6 py-2.5 bg-gradient-to-r from-accent to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 font-medium"
      >
        ⚙️ Set Fee Type Permissions
      </button>

      {/* <button
        onClick={() => setMarkFeeForStudents(true)}
        className="ml-4 cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
      >
        Mark Fee For Students
      </button> */}
      <CreateFee />

      <FeeTypeDetail
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        selectedFee={selectedFee}
        context={context}
      />

      {/* backdrop */}
      {drawerOpen && <div onClick={() => setDrawerOpen(false)} className="fixed inset-0 bg-black-50 bg-opacity-30 z-40"></div>}

      {/* ======================================================================= */}
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <HeaderViewFee
            headerTitle={"View Fee"}
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
        <ViewFeeTable
          fees={fees}
        />
      </div>
    </>

  );
};

export default ViewFee;