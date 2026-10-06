'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { getSessionCache } from '../../utils/sessionCache';
import FeeTypeDetail from '../ui/drawer/FeeTypeDetail';
import Loader from '../ui/status/Loader';
import ViewFeeFiltersSummary from './ViewFeeFiltersSummary';
import VariableFeeFilterPanel from './VariableFeeFilterPanel';
import { ReceiptIndianRupee, } from 'lucide-react';
import { getSchoolBusStudentList } from '../../api/fees';
import ConfirmationDialogueBox from '../ui/status/Confirmation';

import SchoolBusesTable from './SchoolBusesTable';
import HeaderSchoolBusesStudent from './HeaderSchoolBusesStudent';
import SchoolBusStudentAdd from '../ui/drawer/SchoolBusStudentAdd';
import SchoolBusStudentTable from './SchoolBusStudentTable';
import { useParams } from 'next/navigation';
import { useSearchParams } from "next/navigation";
import SchoolBusStudentFilterPanel from './SchoolBusStudentFilterPanel';

// ==========================================================================================================

const SchoolBusesStudent = ({ }) => {
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
  const searchParams = useSearchParams();
  // ================================================================
  const [addSchoolBusStudent, setAddSchoolBusStudent] = useState(false);
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
  const [schoolBusStudent, setSchoolBusStudent] = useState([]);

  // ==================================================================================================
  const fetchSchoolBusStudentList = async () => {


    const pageSize = 1
    try {
      // console.log(' params?.id', searchParams.get("id"));

      const res = await getSchoolBusStudentList(
        context.profileId,
        context.session,
        searchParams.get("id")
      );

      setSchoolBusStudent(res?.data?.results?.students || []);

    } catch (error) {
      console.error("Error fetching variableFee:", error);
    }
  };




  useEffect(() => {
    if (!context?.profileId || !context?.session) return;



    fetchSchoolBusStudentList()
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


    fetchSchoolBusStudentList()

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
    if (!schoolBusStudent) return [];
    return schoolBusStudent.filter(fee => {
      const matchesStandard = !selectedStandard || fee?.standard?.name === selectedStandard;
      const matchesType = !selectedType || fee?.type === selectedType;
      const matchesSearch = !searchTerm || fee?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStandard && matchesType && matchesSearch;
    });
  }, [schoolBusStudent, selectedStandard, selectedType, searchTerm]);

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
  // console.log('schoolBusStudent', schoolBusStudent);

  // ======================================================================

  return (
    <>
      {/* ================== Drawer ======================================== */}

      <button
        onClick={() => setAddSchoolBusStudent(true)}
        className="cursor-pointer group relative px-6 py-2.5 bg-gradient-to-r from-accent to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 font-medium"
      >
        ⚙️ Add Student
      </button>


      <SchoolBusStudentAdd
        drawerOpen={addSchoolBusStudent}
        setDrawerOpen={setAddSchoolBusStudent}
        selectedFee={selectedFee}
        config={config}
        context={context}
        busId={searchParams.get("id")}
      />

      {drawerOpen && <div onClick={() => setDrawerOpen(false)} className="fixed inset-0 bg-black-50 bg-opacity-30 z-40"></div>}


      {/* ======================================================================= */}



      <div className="space-y-6">

        {/* Search and Filters */}

        <div className="bg-white rounded-lg shadow p-6">
          {/* Header Section */}


          <HeaderSchoolBusesStudent
            headerTitle={"SchoolBus Student List"}
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

          <SchoolBusStudentFilterPanel

            setFilters={setFilters}
            filters={filters}
            config={config}
            isFilterPanelOpen={isFilterPanelOpen}
            staffStatus={staffStatus}
            accountStatus={accountStatus}
            toggleFilter={toggleFilter}
            schoolBusStudent={schoolBusStudent}
          // feeTypes_={feeTypes_}
          />

        </div>


        <SchoolBusStudentTable
          context={context}
          schoolBusStudent={schoolBusStudent}
          busId={searchParams.get("id")}

        />
      </div>




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

export default SchoolBusesStudent;
// ================================================================
