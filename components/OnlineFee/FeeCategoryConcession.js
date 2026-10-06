'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { getSessionCache } from '../../utils/sessionCache';
import Loader from '../ui/status/Loader';
import ViewFeeFiltersSummary from './ViewFeeFiltersSummary';
import { ReceiptIndianRupee, } from 'lucide-react';
import { getTransportLocationList } from '../../api/fees';
import ConfirmationDialogueBox from '../ui/status/Confirmation';
import AddLateFee from './AddLateFee';
import TransportLocationTable from './TransportLocationTable';
import HeaderFeeCategoryConcession from './HeaderFeeCategoryConcession';
import FeeCategoryConcessionFilterPanel from './FeeCategoryConcessionFilterPanel';
// ==========================================================================================================

const FeeCategoryConcession = ({ }) => {
  const [removeLateFee, setRemoveLateFee] = useState(false);

  const [viewMode, setViewMode] = useState('overview');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filters, setFilters] = useState({
    locationType: "",
    area: "",
    status: "",
    distanceRange: "",
    search: "",
  });

  // ================================================================
  const config = getSessionCache("dashboardConfig");
  const context = getSessionCache("dashboardContext");
  // ================================================================
  const [addLateFee, setAddLateFee] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const feesPerPage = 10;


  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [transportLocation, setTransportLocation] = useState([]);

  // ==================================================================================================
  const fetchTransportLocation = async () => {


    try {
      const res = await getTransportLocationList(
        context.profileId,
        context.session,

      );
      // console.log('res______________', res);

      setTransportLocation(res?.data?.results?.locations || []);

    } catch (error) {
      console.error("Error fetching variableFee:", error);
    }
  };




  useEffect(() => {
    if (!context?.profileId || !context?.session) return;



    fetchTransportLocation();
    setIsFilterPanelOpen(false);
  }, [
    context?.profileId,
    context?.session,
    currentPage,
  ]);


  useEffect(() => {
    fetchTransportLocation();
  }, [
    context?.profileId,
    context?.session,
    currentPage,
  ]);

  // Filter transport locations based on selected criteria
  const filteredLocations = useMemo(() => {
    if (!transportLocation) return [];
    return transportLocation.filter(location => {
      const matchesLocationType = !filters.locationType || location?.type?.toLowerCase() === filters.locationType.toLowerCase();
      const matchesArea = !filters.area || location?.area === filters.area;
      const matchesStatus = !filters.status || location?.status?.toLowerCase() === filters.status.toLowerCase();
      const matchesSearch = !filters.search || location?.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        location?.address?.toLowerCase().includes(filters.search.toLowerCase());

      // Distance range filtering (assuming location has distance property)
      let matchesDistance = true;
      if (filters.distanceRange) {
        const distance = location?.distance || 0;
        switch (filters.distanceRange) {
          case "0-5":
            matchesDistance = distance >= 0 && distance <= 5;
            break;
          case "5-10":
            matchesDistance = distance > 5 && distance <= 10;
            break;
          case "10-15":
            matchesDistance = distance > 10 && distance <= 15;
            break;
          case "15-20":
            matchesDistance = distance > 15 && distance <= 20;
            break;
          case "20+":
            matchesDistance = distance > 20;
            break;
        }
      }

      return matchesLocationType && matchesArea && matchesStatus && matchesSearch && matchesDistance;
    });
  }, [transportLocation, filters]);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // if (!variableFee || isLoading || variableFee.length === 0) {
  //   return <p className="text-center text-gray-500">No fee data available</p>;
  // }
  // const serverLimit = feesResponse?.limit || feesPerPage;
  const serverLimit = 1
  const totalPages = Math.ceil((0) / serverLimit);

  // Calculate pagination
  const indexOfLastLocation = currentPage * feesPerPage;
  const indexOfFirstLocation = indexOfLastLocation - feesPerPage;
  const currentLocations = filteredLocations;

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
    setFilters({
      locationType: "",
      area: "",
      status: "",
      distanceRange: "",
      search: "",
    });
  };







  const toggleFilterPanel = () => {
    setIsFilterPanelOpen(!isFilterPanelOpen);
  };

  const getFilterCount = () => {
    return (filters?.locationType ? 1 : 0) + (filters?.area ? 1 : 0) + (filters?.status ? 1 : 0) + (filters?.distanceRange ? 1 : 0) + (filters?.search ? 1 : 0);
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
    // console.log('selectrssssssssedId', removeLateFee);
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
  // console.log('transportLocation', transportLocation);

  // ======================================================================

  return (
    <>


      {/* ======================================================================= */}



      <div className="space-y-6">



        <div className="bg-white rounded-lg shadow p-6">


          <HeaderFeeCategoryConcession
            headerTitle={"Fee category Concession"}
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

          <FeeCategoryConcessionFilterPanel
            setFilters={setFilters}
            filters={filters}
            config={config}
            context={context}
            isFilterPanelOpen={isFilterPanelOpen}
            transportLocations={transportLocation}
          />

        </div>


        <TransportLocationTable
          transportLocation={transportLocation}
          loading={loading}
          totalCount={filteredLocations.length}
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

export default FeeCategoryConcession;
// ================================================================
