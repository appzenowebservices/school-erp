'use client';

import { List, User, MoreVertical, GraduationCap, School, User2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import StaffTable from "./StaffTable";
import StaffFilterPanel from "./FilterPanel";
import StaffFiltersSummary from "./filtersSummary";
import Header from "./Header";
import { getSessionCache } from "../../utils/sessionCache";
import { useStaff } from "../../controllers/staff";

export const StaffList = ({
  setActiveTab,
  setSelectedStaff

}) => {


  const Context = getSessionCache("dashboardContext");

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalCount, setTotalCount] = useState(0); // Store total from API
  const [staff, setStaff] = useState([]);

  const [selectedData, setSelectedData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [openMenu, setOpenMenu] = useState(null);
  const [viewMode, setViewMode] = useState('overview');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isPermittedClassPermissionUpdated, setIsPermittedClassPermissionUpdated] = useState(false);
  const [removedFromClient, setRemovedFromClient] = useState(false);

  const accountStatus = [
    {
      label: "Receive Daily Notification",
      value: "receive_daily_attendance_notification",
    },
    {
      label: "Has Account",
      value: "has_account",
    },
    {
      label: "Allowed for Admin Access",
      value: "is_allowed_for_admin_access",
    },
  ];


  // console.log(Context,'Context');
  const [filters, setFilters] = useState({
    joinedDate: "",
    status: "",
    accountStatus: [],
    designations: [],
    title: "",
    name: "",
    motherName: "",
    fatherName: "",
    mobile: "",
    emergencyContact: "",
    isSearch: false,
    appType: "",





  });

  const { getStaff, stadffData, } = useStaff()

  const fetchData = async () => {
    setIsLoading(true); // 🟢 Start Loading
    try {
      const rawParams = {
        user_title_id: filters?.title || undefined,
        is_allowed_for_admin_access: filters?.accountStatus?.includes("is_allowed_for_admin_access") ? true : undefined,
        has_account: filters?.accountStatus?.includes("has_account") ? true : undefined,
        receive_daily_attendance_notification: filters?.accountStatus?.includes("receive_daily_attendance_notification") ? true : undefined,
        join_time: filters?.joinedDate || undefined,
        status: filters?.status || undefined,
        name: filters?.name || undefined,
        app_user: filters?.appType || undefined,
        mother_name: filters?.motherName || undefined,
        father_name: filters?.fatherName || undefined,
        phone: filters?.mobile || undefined,
        gender: filters?.gender || undefined,
        emergency_contact_number: filters?.emergencyContact || undefined,
        school_designation_ids: filters?.designations?.length > 0 ? filters?.designations : undefined,

      };

      const params = Object.fromEntries(
        Object.entries(rawParams).filter(([_, v]) =>
          v !== undefined && v !== null && v !== "" && !(Array.isArray(v) && v.length === 0)
        )
      );

      const response = await getStaff(
        Context?.profileId,
        Context?.session,
        params,
        page,
        limit
      );
      // console.log('✅ ✅✅hua reoad ====================================', params);

      // ✅ FIX: Update both the staff list and the total count
      // Adjust "response?.data?.total" based on your actual API structure
      const results = response?.data?.data?.results;
      // console.log('results=============', results);

      setStaff(results?.users || []);
      // console.log('staff<<', results?.users[0].name);

      setTotalCount(results?.count || 0); // This will set it to 129
      setIsFilterPanelOpen(false);
    } catch (err) {
      console.error("❌ Failed to fetch staff data:", err);
    } finally {
      setIsLoading(false); // 🔴 Stop Loading regardless of success or failure
    }
  };

  useEffect(() => {
    fetchData();
  }, [
    page, // CRITICAL: Re-fetch when page changes
    limit,
    filters.joinedDate,
    filters.status,
    filters.accountStatus,
    filters?.title,
    filters?.name,
    filters?.isSearch,
    filters?.designations?.length,
    filters?.gender,
    filters?.appType,
    removedFromClient,
    isPermittedClassPermissionUpdated
  ]);

  // ✅ FIX: Reset to page 1 when any filter changes
  useEffect(() => {
    setPage(1);
  }, [filters]);




  const config = getSessionCache("dashboardConfig");


  const menuRef = useRef(null);

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

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);










  // Handle product click to show details
  const handleRowClick = (product) => {
    // console.log(product)
    setSelectedStaff(product)
    setActiveTab('view')
    // setSelectedData(product);
    // setShowModal(true)
    // setSelectedData(null); // Reset first
    // setTimeout(() => setSelectedData(product), 0); // Allow state to change

  };







  const toggleFilterPanel = () => {
    setIsFilterPanelOpen(!isFilterPanelOpen);
  };


  const getFilterCount = () => {
    return filters?.status ? 1 : 0 + filters?.accountStatus.length + filters?.designations?.length + (filters?.appType ? 1 : 0) + (filters?.gender ? 1 : 0) + (filters?.joinedDate ? 1 : 0) + (filters?.name ? 1 : 0) + (filters?.title ? 1 : 0) + (filters?.motherName ? 1 : 0) + (filters?.fatherName ? 1 : 0) + (filters?.mobile ? 1 : 0) + (filters?.emergencyContact ? 1 : 0);
  };

  return (
    <>



      <Header
        headerTitle={"Staff Management"}
        headerIcon={<User2 />}
        toggleFilterPanel={toggleFilterPanel}
        getFilterCount={getFilterCount}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* <StaffFiltersSummary
        filters={filters}
        toggleFilter={toggleFilter}
        clearFilters={clearFilters}
      /> */}

      <StaffFilterPanel
        setFilters={setFilters}
        filters={filters}
        config={config}
        isFilterPanelOpen={isFilterPanelOpen}
        staffStatus={accountStatus}
        toggleFilter={toggleFilter}

      />



      <StaffTable
        columns={['Name', 'Designation', 'Class & Admin Access', ' Phone', 'Action']}
        staffs={staff}
        handleClassClick={handleRowClick}
        isLoading={isLoading}
        context={Context}
        setFilters={setFilters}
        filters={filters}
        setIsPermittedClassPermissionUpdated={setIsPermittedClassPermissionUpdated}
        setRemovedFromClient={setRemovedFromClient}
        currentPage={page}
        setCurrentPage={setPage}
        totalCount={totalCount}
        itemsPerPage={limit}
      />

    </>
  );
};