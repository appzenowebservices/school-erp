'use client'
import React, { useState, useEffect } from 'react';
import {
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  CreditCard,
  Banknote,
  Smartphone,
  Search,
  Filter,
  Bell,
  TrendingUp,
  Calendar,
  ChevronDown,
  
} from 'lucide-react';


import { BiSolidReceipt } from 'react-icons/bi';
import { FaDownload, FaFileCsv, FaFileExcel, FaFilePdf } from 'react-icons/fa';
import QuickActions from './quickActions'
import FeeSummaryFiltersSummary from './filtersSummary';
import FeeSummaryFilterPanel from './FilterPanel';
import { getSessionCache } from '../../utils/sessionCache';
import { useFeeCollection, useFees } from '../../controllers/fees';
import FeeSummary from './Summary';
import { useMemo } from 'react';
import FeeSummaryDrawer from '../ui/drawer/FeeSummary';
// ===================================================================


const FeeManagementDashboard = ({ cookyGuid, cookyId, }) => {

  const config = getSessionCache("dashboardConfig");
  const Context = getSessionCache("dashboardContext");
  const [standardFees, setStandardFees] = useState(config?.standards); // default first period
  const [activePeriodId, setActivePeriodId] = useState("april"); // default first period
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  const [selectedData, setSelectedData] = useState(null);

  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false); // default first period

  const [filters, setFilters] = useState({
    // modules: [
    //   {
    //     moduleName: "Meetsdings",
    //     categories: [
    //       "Upcoming",
    //       "All",

    //     ]
    //   },

    // ],

    status: [],
    paymentMode: "",
    depositStartDate: "",
    depositEndDate: "",

  });

  const [studentStatus, setStudentStatus] = useState([
    {
      name: "Promoted",

    },
    {
      name: "New",
    },
    {

      name: "Deposited",
    },

  ]);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  const [sort, setSort] = useState({
    field: "name",
    direction: "asc"
  });

  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);

  const [viewMode, setViewMode] = useState('overview');
  const [selectedStandard, setSelectedStandard] = useState('10');
  const [selectedClass, setSelectedClass] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const [depositStartDate, setDepositStartDate] = useState('');
  const [depositEndDate, setDepositEndDate] = useState('');



  // Mock stats
  const stats = {
    totalStudents: 1250,
    totalCollected: 18750000,
    pendingAmount: 3250000,
    defaultersCount: 45,
    paidPercentage: 85,
    pendingPercentage: 12,
    overduePercentage: 3
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'PROMOTED': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'Pending': 'bg-amber-50 text-amber-700 border-amber-200',
      'Overdue': 'bg-red-50 text-red-700 border-red-200',
      'Defaulter': 'bg-red-50 text-red-700 border-red-200'
    };
    return statusColors[status] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const getPaymentModeIcon = (mode) => {
    const icons = {
      'ONLINE': <Smartphone className="w-4 h-4 text-blue-600" />,
      'CASH': <Banknote className="w-4 h-4 text-green-600" />,
      'CHEQUE': <CreditCard className="w-4 h-4 text-purple-600" />
    };
    return icons[mode] || <CreditCard className="w-4 h-4 text-gray-600" />;
  };





  // === Function(s) ========================================
  const downloadExcel = () => {
    // For Excel export, we'll create a simple HTML table format that Excel can read
    const headers = ['Name', 'Subject', 'Description', 'Date', 'Time', 'Total Students', 'Platform'];
    let htmlContent = '<table><tr>';
    headers.forEach(header => {
      htmlContent += `<th>${header}</th>`;
    });
    htmlContent += '</tr>';

    filteredData.forEach(row => {
      htmlContent += '<tr>';
      htmlContent += `<td>${row.name || 'N/A'}</td>`;
      htmlContent += `<td>${row.subject?.name || 'N/A'}</td>`;
      htmlContent += `<td>${row.description || 'N/A'}</td>`;
      htmlContent += `<td>${row.date || 'N/A'}</td>`;
      htmlContent += `<td>${row.time || 'N/A'}</td>`;
      htmlContent += `<td>${row.students?.length || 0}</td>`;
      htmlContent += `<td>${row.info?.platform || 'N/A'}</td>`;
      htmlContent += '</tr>';
    });
    htmlContent += '</table>';

    const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `staff_data_${new Date().toISOString().split('T')[0]}.xlsx`;
    link.click();
    setExportDropdownOpen(false);
  };
  const downloadCSV = () => {
    const csvContent = convertToCSV(filteredData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `staff_data_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    setExportDropdownOpen(false);
  };






  // -----------------------------------
  const toggleFilter = (filterType, value, event) => {

    if (event) {
      event.stopPropagation();
    }

    setFilters(prev => {
      if (prev[filterType].includes(value)) {
        return {
          ...prev,
          [filterType]: prev[filterType].filter(item => item !== value)
        };
      } else {
        return {
          ...prev,
          [filterType]: [...prev[filterType], value]
        };
      }
    });
  };


  // -----------------------------------
  const clearFilters = () => {
    setFilters({
      modules: [],
      categories: [],
      status: []
    });
    setSearchTerm("");
  };


  const toggleFilterPanel = () => {
    setIsFilterPanelOpen(!isFilterPanelOpen);
  };
  const getFilterCount = () => {
    let count = 0;

    if (filters.paymentMode && filters.paymentMode !== "all") count++;
    if (filters.status && filters.status.length > 0) count += filters.status.length;

    return count;
  };

  // ===========================================

  const handleSort = (field, toggleDirection = false) => {
    setSort(prev => ({
      field,
      direction: toggleDirection && prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };



  // ===========================================


  const { getFeesCollection, feeCollectionData, isLoading } = useFeeCollection()



  const fetchData = async () => {
    try {
      const params = {
        mode: filters?.paymentMode || undefined,
        // standardId: selectedStandard !== "all" ? selectedStandard : undefined,
        class_ids: selectedClass?.length > 0 ? selectedClass.join(",") : undefined, // ✅ fix
        status: filterStatus !== "all" ? filterStatus : undefined,
        search: searchTerm || undefined,
        is_promoted_student: filters.status.includes("Promoted") ? true : undefined,
        is_new_student: filters.status.includes("New") ? true : undefined,
        only_deposited: filters.status.includes("Deposited") ? true : undefined,
        depositStartDate: filters.depositStartDate,
        depositEndDate: filters.depositEndDate
      };

      // 🔹 Call API with all filters as params
      const data = await getFeesCollection(
        Context?.profileId,
        Context?.session,
        cookyGuid,
        cookyId,
        params
      );

      let result = data?.data?.data?.results?.fee_collections || [];
      setFilteredData(result);
    } catch (err) {
      console.error("Failed to fetch fee collection data", err);
      setFilteredData([]); // fallback
    }
  };

  useEffect(() => {
    fetchData();
    // if (filters.depositStartDate && filters.depositEndDate) {
    // }
  }, [
    filters.paymentMode,
    filters.status,
    filters.depositStartDate,
    filters.depositEndDate,
    selectedStandard,
    selectedClass,
    filterStatus,
    searchTerm,
    Context?.profileId,
    Context?.session,
    cookyGuid,
    cookyId
  ]);



  // console.log('====filteredData==', config?.standards)

  // ==========================================================================

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredData?.slice(start, end);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData?.length / pageSize);







  console.log('---------paginatedData---##', paginatedData)


  // Utility: get all class IDs from config
  const allClassIds = config?.standards?.flatMap(std => std.classes.map(cls => cls.id)) || [];

  // ==========================================================================


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* ================== Header ======================================================================================= */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white shadow-lg">
                <BiSolidReceipt className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight">
                  <span className="text-[color:var(--color-blue-text)]">Fee </span>
                  <span className="text-[color:var(--color-navy-blue)]">Management</span>
                </h1>
                {/* <h1 className="text-2xl font-bold text-gray-900">Fee Management</h1> */}
                <p className="text-sm text-gray-500 mt-1">Track and manage student fee payments</p>
              </div>
            </div>

            {/*==========  Export Dropdown  ===================*/}
            <div className="relative">
              <button
                onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <FaDownload className="text-sm" />
                <span className="font-medium">Exports</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${exportDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {exportDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setExportDropdownOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                    <button
                      onClick={downloadCSV}
                      className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <FaFileCsv className="text-green-600" />
                      <span>Download Min</span>
                    </button>
                    <button
                      onClick={downloadExcel}
                      className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <FaFileExcel className="text-green-700" />
                      <span>Download Full</span>
                    </button>
                    <button
                      onClick={downloadExcel}
                      className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <FaFileExcel className="text-green-700" />
                      <span>Student Ledger</span>
                    </button>
                    <button
                      onClick={downloadExcel}
                      className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <FaFilePdf className="text-red-700" />
                      <span>Dowload Min.</span>
                    </button>
                    <button
                      onClick={downloadExcel}
                      className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <FaFilePdf className="text-red-700" />
                      <span>Dowload Gist.</span>
                    </button>
                  </div>
                </>
              )}
            </div>
            {/*=================================================*/}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* ==================  Stats Cards  ======================================================================================= */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-xl">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                Active
              </span>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalStudents.toLocaleString()}</h3>
              <p className="text-sm text-gray-600">Total Students</p>
              <div className="flex items-center gap-1 text-xs text-green-600">
                <TrendingUp className="w-3 h-3" />
                +5.2% from last month
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-50 rounded-xl">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <span className="text-xs font-medium px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                {stats.paidPercentage}%
              </span>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-emerald-600">₹{(stats.totalCollected / 1000000).toFixed(1)}M</h3>
              <p className="text-sm text-gray-600">Amount Collected</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${stats.paidPercentage}%` }}></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-50 rounded-xl">
                <DollarSign className="w-6 h-6 text-amber-600" />
              </div>
              <span className="text-xs font-medium px-2 py-1 bg-amber-100 text-amber-700 rounded-full">
                {stats.pendingPercentage}%
              </span>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-amber-600">₹{(stats.pendingAmount / 1000000).toFixed(1)}M</h3>
              <p className="text-sm text-gray-600">Pending Amount</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${stats.pendingPercentage}%` }}></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-50 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-xs font-medium px-2 py-1 bg-red-100 text-red-700 rounded-full">
                Urgent
              </span>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-red-600">{stats.defaultersCount}</h3>
              <p className="text-sm text-gray-600">Defaulters</p>
              <div className="flex items-center gap-1 text-xs text-red-600">
                <AlertTriangle className="w-3 h-3" />
                Requires attention
              </div>
            </div>
          </div>
        </div>
        {/* ==================   Filters and Search  ======================================================================================= */}

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">


            {/* <div className="flex flex-wrap gap-3">
              <select
                value={selectedStandard}
                onChange={(e) => {
                  setSelectedStandard(e.target.value)
                  setSelectedStandardId(e.target.value)
                }}
                className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm font-medium min-w-[120px]"
              >
                <option value="all">All Standards</option>
                {config?.standards?.map(std => (
                  <option

                    key={std?.id} value={std.id}>
                    {std?.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm font-medium min-w-[120px]"
              >
                <option value="all">All Classes</option>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
              </select>
            </div> */}




            {/* Classes Multi-Select (all standards) */}
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2.5 border border-gray-300 rounded-xl bg-white text-sm font-medium flex items-center gap-2 min-w-[200px]"
              >
                {selectedClass.length > 0
                  ? `Classes (${selectedClass.length})`
                  : "Select Classes"}
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
              </button>

              {showFilters && (
                <>
                  {/* Enhanced overlay with backdrop blur */}
                  <div className="fixed inset-0 z-40 " onClick={() => setShowFilters(false)} />

                  <div className="absolute z-50 mt-3 w-80 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2 duration-200">

                    {/* Header with gradient */}
                    {/* <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900">Filter Classes</h3>
          </div>
          <button
            onClick={() => setShowFilters(false)}
            className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div> */}

                    <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">

                      {/* Global Select All with enhanced styling */}
                      <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-md flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                              </svg>
                            </div>
                            <p className="font-semibold text-gray-800 text-sm">All Classes</p>
                          </div>
                          <button
                            onClick={() => {
                              if (selectedClass.length === allClassIds.length) {
                                setSelectedClass([]);
                              } else {
                                setSelectedClass(allClassIds);
                              }
                            }}
                            className="px-3 py-1.5 text-xs font-medium bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
                          >
                            {selectedClass.length === allClassIds.length ? "Clear All" : "Select All"}
                          </button>
                        </div>
                      </div>

                      <div className="px-6 py-4 space-y-5">
                        {config.standards?.map(std => {
                          const stdClassIds = std.classes.map(cls => cls.id);
                          const allSelectedForStd = stdClassIds.every(id => selectedClass.includes(id));

                          return (
                            <div key={std.id} className="group">
                              {/* Standard header with gradient accent */}
                              <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                  </div>
                                  <p className="font-semibold text-gray-800 text-sm">{std.name}</p>
                                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                                    {std.classes.length} classes
                                  </span>
                                </div>
                                <button
                                  onClick={() => {
                                    if (allSelectedForStd) {
                                      setSelectedClass(prev => prev.filter(id => !stdClassIds.includes(id)));
                                    } else {
                                      setSelectedClass(prev => Array.from(new Set([...prev, ...stdClassIds])));
                                    }
                                  }}
                                  className="px-2.5 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100 hover:text-indigo-700 transition-all duration-200"
                                >
                                  {allSelectedForStd ? "Clear" : "Select"}
                                </button>
                              </div>

                              {/* Classes with enhanced styling */}
                              <div className="space-y-2 ml-2">
                                {std.classes.map(cls => (
                                  <label key={cls.id} className="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group/item">
                                    <div className="relative">
                                      <input
                                        type="checkbox"
                                        className="peer sr-only"
                                        checked={selectedClass.includes(cls.id)}
                                        onChange={() => {
                                          setSelectedClass(prev =>
                                            prev.includes(cls.id)
                                              ? prev.filter(id => id !== cls.id)
                                              : [...prev, cls.id]
                                          );
                                        }}
                                      />
                                      <div className="w-5 h-5 border-2 border-gray-300 rounded-md bg-white peer-checked:bg-gradient-to-br peer-checked:from-blue-500 peer-checked:to-indigo-600 peer-checked:border-blue-500 transition-all duration-200 flex items-center justify-center">
                                        <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                      </div>
                                    </div>
                                    <div className="flex-1 flex items-center justify-between">
                                      <span className="text-sm font-medium text-gray-700 group-hover/item:text-gray-900">
                                        {cls.name}
                                      </span>
                                      <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 bg-gray-100 group-hover/item:bg-white text-gray-500 text-xs rounded-md font-medium">
                                          {cls.students.length || 0} students
                                        </span>
                                        <div className="w-2 h-2 bg-green-400 rounded-full opacity-60 group-hover/item:opacity-100"></div>
                                      </div>
                                    </div>
                                  </label>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Footer with action buttons */}
                      <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {selectedClass.length} of {allClassIds?.length || 0} selected
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedClass([])}
                            className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Clear
                          </button>
                          <button
                            onClick={() => setShowFilters(false)}
                            className="px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-sm"
                          >
                            Apply Filters
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}




            </div>










            {/* 
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm font-medium min-w-[120px]"
            >
              <option value="all">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select> */}

            <div className="flex items-center gap-3 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search students, roll numbers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              {/* ================================================================== */}


              {/* ================================================================== */}
              <button
                onClick={() => toggleFilterPanel(!showFilters)}
                className={`cursor-pointer flex items-center gap-2 px-4 py-2.5 border rounded-xl transition-colors text-sm font-medium relative
    ${isFilterPanelOpen
                    ? "bg-blue-50 border-blue-500 text-blue-600"  // 🔹 active styles
                    : "border-gray-300 hover:bg-gray-50 text-gray-700"}`
                }
              >
                <Filter className="w-4 h-4" />
                Filters

                {/* 🔹 Active filter count badge */}
                {getFilterCount() > 0 && (
                  <span className="ml-1 bg-blue-600 text-white text-xs font-semibold rounded-full px-2 py-0.5">
                    {getFilterCount()}

                  </span>
                )}
              </button>

            </div>



          </div>

          <FeeSummaryFiltersSummary
            filters={filters}
            toggleFilter={toggleFilter}
            clearFilters={clearFilters}
          />

          <FeeSummaryFilterPanel
            setFilters={setFilters}
            config={config}
            // setDepositStartDate={setDepositStartDate}
            // setDepositEndDate={setDepositEndDate}
            isFilterPanelOpen={isFilterPanelOpen}
            // modules={modules} // <-- use the dummy modules state, not []
            filters={filters}
            studentStatus={studentStatus}
            toggleFilter={toggleFilter}
          // getAvailableCategories={getAvailableCategories}
          />
          {/* ==================    Compact Fee Periods Dropdown ======================================================================================= */}


          <div className="relative mb-6">
            <button
              onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
              className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-all shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">
                    {Array.isArray(activePeriodId) && activePeriodId.length > 0
                      ? `${activePeriodId.length} Fee Periods Selected`
                      : 'Select Fee Periods'
                    }
                  </div>
                  <div className="text-sm text-gray-600">
                    {Array.isArray(activePeriodId) && activePeriodId.length > 0
                      ? 'Click to modify selection'
                      : 'Choose periods to compare'
                    }
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {Array.isArray(activePeriodId) && activePeriodId.length > 0 && (
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-full">
                    {activePeriodId.length}
                  </span>
                )}
                <svg className={`w-5 h-5 text-gray-400 transition-transform ${showPeriodDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {showPeriodDropdown && (
              <>
                {/* Backdrop */}
                <div className="fixed inset-0 z-40 bg-black/10" onClick={() => setShowPeriodDropdown(false)} />

                {/* Dropdown Content */}
                <div className="absolute z-50 mt-2 w-full bg-white border border-gray-100 rounded-2xl shadow-2xl max-h-96 overflow-hidden">
                  {/* Header */}
                  <div className="px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-100 flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">Fee Periods</h4>
                      <p className="text-xs text-gray-600">Select multiple periods to compare</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActivePeriodId([])}
                        className="px-2 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        Clear
                      </button>
                      <button
                        onClick={() => {
                          const allPeriodIds = standardFees?.flatMap(std => std.fees?.map(fee => fee.id) || []) || [];
                          setActivePeriodId(allPeriodIds);
                        }}
                        className="px-2 py-1 text-xs font-medium bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors"
                      >
                        All
                      </button>
                    </div>
                  </div>

                  {/* Scrollable Content */}
                  <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    <div className="p-4 space-y-4">
                      {standardFees?.map((standard, stdIndex) => {
                        const periods = standard?.fees || [];
                        const selectedInThisStd = (Array.isArray(activePeriodId) ? activePeriodId : [activePeriodId])
                          .filter(id => periods.some(p => p.id === id));

                        if (!periods.length) return null;

                        return (
                          <div key={standard.id} className="space-y-3">
                            {/* Standard Header */}
                            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                              <div className="flex items-center gap-2">
                                <div className={`w-4 h-4 rounded-md flex items-center justify-center ${stdIndex === 0 ? 'bg-gradient-to-br from-blue-400 to-cyan-500' :
                                  stdIndex === 1 ? 'bg-gradient-to-br from-emerald-400 to-teal-500' :
                                    stdIndex === 2 ? 'bg-gradient-to-br from-purple-400 to-pink-500' :
                                      'bg-gradient-to-br from-orange-400 to-red-500'
                                  }`}>
                                  <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 8 8">
                                    <circle cx="4" cy="4" r="3" />
                                  </svg>
                                </div>
                                <span className="font-medium text-gray-800 text-sm">{standard.name}</span>
                                <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md">
                                  {selectedInThisStd.length}/{periods.length}
                                </span>
                              </div>

                              <button
                                onClick={() => {
                                  const stdPeriodIds = periods.map(p => p.id);
                                  const currentSelected = Array.isArray(activePeriodId) ? activePeriodId : [activePeriodId];

                                  if (selectedInThisStd.length === periods.length) {
                                    setActivePeriodId(currentSelected.filter(id => !stdPeriodIds.includes(id)));
                                  } else {
                                    setActivePeriodId([...currentSelected.filter(id => !stdPeriodIds.includes(id)), ...stdPeriodIds]);
                                  }
                                }}
                                className="px-2 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100 transition-colors"
                              >
                                {selectedInThisStd.length === periods.length ? "Clear" : "Select"}
                              </button>
                            </div>

                            {/* Period Grid */}
                            <div className="grid grid-cols-2 gap-2">
                              {periods.map((period) => {
                                const isSelected = Array.isArray(activePeriodId)
                                  ? activePeriodId.includes(period.id)
                                  : activePeriodId === period.id;

                                return (
                                  <label
                                    key={period.id}
                                    className={`relative flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border ${isSelected
                                      ? 'border-indigo-300 bg-gradient-to-br from-indigo-50 to-purple-50'
                                      : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                                      }`}
                                  >
                                    {/* Custom Checkbox */}
                                    <div className="relative">
                                      <input
                                        type="checkbox"
                                        className="sr-only"
                                        checked={isSelected}
                                        onChange={() => {
                                          const currentSelected = Array.isArray(activePeriodId) ? activePeriodId : [activePeriodId];

                                          if (isSelected) {
                                            setActivePeriodId(currentSelected.filter(id => id !== period.id));
                                          } else {
                                            setActivePeriodId([...currentSelected, period.id]);
                                          }
                                        }}
                                      />
                                      <div className={`w-4 h-4 border-2 rounded-md flex items-center justify-center transition-all ${isSelected
                                        ? 'border-indigo-500 bg-indigo-500'
                                        : 'border-gray-300 bg-white'
                                        }`}>
                                        {isSelected && (
                                          <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                          </svg>
                                        )}
                                      </div>
                                    </div>

                                    {/* Period Info */}
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-900 truncate">
                                          {period.name}
                                        </span>
                                      </div>
                                      <div className="text-xs text-gray-500 mt-0.5">
                                        Due: {new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                      </div>
                                    </div>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Footer */}
                  {Array.isArray(activePeriodId) && activePeriodId.length > 0 && (
                    <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {activePeriodId.length} period{activePeriodId.length > 1 ? 's' : ''} selected
                      </span>
                      <button
                        onClick={() => setShowPeriodDropdown(false)}
                        className="px-3 py-1.5 bg-indigo-500 text-white text-sm font-medium rounded-md hover:bg-indigo-600 transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* ================== Table ======================================================================================= */}


          <FeeSummary

            filteredCount={filteredData?.length}
            totalCount={feeCollectionData?.fee_collections?.length}
            sort={sort}
            handleSort={handleSort}
          />

          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Student Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Roll No.
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Class
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Fee Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Payment Mode
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              {!isLoading ? (
                // 🔹 Loader state
                <tbody>
                  <tr>
                    <td colSpan="8" className="py-6">
                      <div className="flex justify-center items-center">
                        <div className="flex items-center gap-3 bg-white border border-gray-200 shadow-sm rounded-lg px-4 py-2">
                          <img
                            src="/logo/logo.png"
                            alt="Loading"
                            className="w-6 h-6 animate-spin"
                          />
                          <span className="text-gray-700 text-sm font-medium">
                            Loading...
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              ) : feeCollectionData?.fee_collections?.length > 0 ? (
                // 🔹 Data state
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedData?.map((record, index) => (
                    <tr
                      key={record.id}
                      className="hover:bg-gray-50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                            {record?.student?.name?.split(" ")?.map((n) => n[0])?.join("")}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {record?.student?.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: STU{record?.fee?.id.toString().padStart(4, "0")}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm font-medium text-gray-900">
                          {record.student.roll_number}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                          {record.student.class.name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-lg font-bold text-gray-900">
                          ₹{record.amount.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                            record.student?.renewal_status
                          )}`}
                        >
                          {record?.student?.renewal_status === "PROMOTED" && (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          )}
                          {record?.student?.renewal_status === "Pending" && (
                            <Calendar className="w-3 h-3 mr-1" />
                          )}
                          {record?.student?.renewal_status === "Overdue" && (
                            <AlertTriangle className="w-3 h-3 mr-1" />
                          )}
                          {record?.student?.renewal_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(record.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getPaymentModeIcon(record.mode)}
                          <span className="text-sm text-gray-700">{record.mode}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {/* <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all group-hover:opacity-100 lg:opacity-0">
                            <Eye className="w-4 h-4" />
                          </button> */}
                          <button
                          onClick={()=>setSelectedData(record)}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all group-hover:opacity-100 lg:opacity-0">
                            {/* <IndianRupee className="w-4 h-4" /> */}
                            <FeeSummaryDrawer

                              studentId={selectedData?.student?.id}
                              profile={Context?.profileId}
                              session={Context?.session}
                              cookyGuid={cookyGuid}
                              cookyId={cookyId}
                              school={Context?.schoolId}


                            />
                          </button>
                          {record.status !== "Paid" && (
                            <button className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all group-hover:opacity-100 lg:opacity-0">
                              <Bell className="w-4 h-4" />
                            </button>
                          )}
                          {/* <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all group-hover:opacity-100 lg:opacity-0">
                            <MoreHorizontal className="w-4 h-4" />
                          </button> */}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              ) : (
                // 🔹 Empty state
                <tbody>
                  <tr>
                    <td colSpan="8" className="py-6 text-center">
                      <div className="flex flex-col items-center gap-2 text-gray-500">
                        <Search className="w-6 h-6" />
                        <p className="text-sm font-medium">No data found</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              )}

            </table>
          </div>

          {/* Modern Pagination */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredData?.length)} of {filteredData?.length} students
            </div>
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              {/* {[...Array(totalPages).keys()].slice(0, 5).map((i) => (
                <button
                  key={i + 1}
                  className={`px-3 py-2 text-sm rounded-lg ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'border border-gray-300 hover:bg-gray-50 transition-colors'}`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))} */}
              {totalPages > 5 && <span className="px-2 text-gray-400">...</span>}
              <button
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
        {/* ==================   QuickActions ======================================================================================= */}

        <QuickActions />
      </div>
    </div>
  );
};

export default FeeManagementDashboard;