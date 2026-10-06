'use client'
import React, { useState, useEffect } from 'react';
import { Users, DollarSign, AlertTriangle, CheckCircle, CreditCard, Banknote, Smartphone, IndianRupee } from 'lucide-react';
import Layout from '../../layouts/Layout';
import { getSessionCache } from '../../utils/sessionCache';
import FeeSummaryDrawer from '../ui/drawer/FeeSummary';
import FeeSummaryFiltersSummary from './filtersSummary';
import FeeSummaryFilterPanel from './FilterPanel';
import Header from './Header';
import { BiSolidReceipt } from 'react-icons/bi';
import { useFeeCollection, useFees } from '../../controllers/fees';
// ===================================================================
const FeeManagementDashboard = ({
  profile,
  session,
  cookyGuid,
  cookyId,
  school

}) => {




  // ===================================================================

  const config = getSessionCache("dashboardConfig");
  const Context = getSessionCache("dashboardContext");

  // ===================================================================

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
    paymentMode: ""
  });


  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  // const [filteredInventory, setFilteredInventory] = useState([]);
  const [showModal, setShowModal] = useState(false);






  // useEffect(() => {
  //   let result = [...inventory];

  //   // Apply search term filter
  //   if (searchTerm) {
  //     const term = searchTerm.toLowerCase();
  //     result = result.filter(item =>
  //       item.name.toLowerCase().includes(term) ||
  //       item.sku.toLowerCase().includes(term)
  //     );
  //   }

  //   // Apply module filter
  //   // if (filters.modules.length > 0) {
  //   //   result = result.filter(item => filters.modules.includes(item.categoryId?.module?.name));
  //   // }

  //   // Apply category filter
  //   // if (filters.categories.length > 0) {
  //   //   result = result.filter(item => filters.categories.includes(item.categoryId?.name));
  //   // }

  //   // Apply status filter
  //   if (filters.status.length > 0) {
  //     result = result.filter(item => filters.status.includes(item.status));
  //   }

  //   // Apply sorting
  //   result.sort((a, b) => {
  //     const fieldA = a[sort.field];
  //     const fieldB = b[sort.field];

  //     if (typeof fieldA === 'string') {
  //       if (sort.direction === 'asc') {
  //         return fieldA.localeCompare(fieldB);
  //       } else {
  //         return fieldB.localeCompare(fieldA);
  //       }
  //     } else {
  //       if (sort.direction === 'asc') {
  //         return fieldA - fieldB;
  //       } else {
  //         return fieldB - fieldA;
  //       }
  //     }
  //   });

  //   // setFilteredInventory(result);
  // }, []);





  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  const [selectedStandardId, setSelectedStandardId] = useState(config?.standards[0] ? config?.standards[0] : []);

  const [selectedStandardDetails, setSelectedStandardDetails] = useState(null);

  const [selectedStandardFees, setSelectedStandardFees] = useState([]);
  const [selectedClass, setSelectedClass] = useState(config?.standards[0] ? config?.standards[0]?.classes : []);
  const [activeClassId, setActiveClassId] = useState(config?.standards[0]?.classes?.[0]?.id || null);
  const [selectedClassStudents, setSelectedClassStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState([]);
  const [viewMode, setViewMode] = useState('overview');
  const [activePeriodId, setActivePeriodId] = useState("april"); // default first period
  const [standardFees, setStandardFees] = useState(config?.standards); // default first period


  const handleClassSelect = (cls) => {
    setActiveClassId(cls.id);
  };




  const getOverallStats = (data) => {
    // console.log('config?.standards', data);
    const selectedStd = config?.standards?.find((s) => s.id === data);






    return {
      classes: data.length || 0,
      exams: data?.length || 0,
      fees: data?.length || 0,
    };
  };




  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'text-green-600 bg-green-50';
      case 'Pending': return 'text-yellow-600 bg-yellow-50';
      case 'Defaulter': return 'text-red-600 bg-red-50';
      case 'Overdue': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };
  // -----------------------------------
  const toggleFilter = (filterType, value, event) => {
    // console.log('---- values ----', filterType, value, event);

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
    return filters.status.length;
  };

  const handleStandardChange = (e) => {

    const stdId = e.target.value;
    setSelectedStandardId(stdId);

    if (stdId === "all") {
      setSelectedStandardFees([]); // or merge all fees across standards
    } else {
      const selectedStd = config?.standards?.find((s) => s.id === stdId);
      setSelectedStandardDetails(selectedStd)

      setSelectedStandardFees(selectedStd?.fees || []);


      // if (feeCollectionData?.fee_collections.length > 0) {
      //   feeCollectionData?.fee_collections.find((x => {

      //     return (
      //       x?.student?.class?.id ===
      //     )
      //   }))
      // }


      setSelectedClass(selectedStd?.classes || []);

    }
  };
  // ---------------------------------------------------


  const { getFees, feesData, isLoading } = useFees()

  useEffect(() => {
    if (!feesData?.length > 0) {

      getFees(
        Context?.profileId,
        session,
        cookyGuid,
        cookyId,
      )
    }
  }, [])

  const { getFeesCollection, feeCollectionData, } = useFeeCollection()

  useEffect(() => {
    if (!feeCollectionData?.length > 0) {

      getFeesCollection(
        Context?.profileId,
        session,
        cookyGuid,
        cookyId,

        { mode: filters?.paymentMode }

      )
    }
  }, [filters])




  const stats = getOverallStats(feeCollectionData?.fee_collections || []);




  // console.log('______ 📲 ______', feeCollectionData?.count);


  // useEffect(() => {
  //   if (feeCollectionData?.fee_collections?.length > 0) {
  //     // ✅ filter directly, no need to map
  //     const filteredStudents = feeCollectionData.fee_collections?.filter(
  //       (x) => {
  //         console.log('periodId======:',
  //           //  String(x?.student?.class?.id) === String(activeClassId) 
  //           String(x?.fee?.id), String(activePeriodId)
  //         );

  //         return (
  //           String(x?.student?.class?.id) === String(activeClassId)
  //           && String(x?.fee?.id) === String(activePeriodId)
  //         )
  //       }
  //     );

  //     setSelectedClassStudents(filteredStudents);
  //   } else {
  //     setSelectedClassStudents([]);
  //   }
  // }, [activeClassId, activePeriodId]);



  //   useEffect(() => {
  //   if (feeCollectionData?.fee_collections) {
  //     // Group students by class.id
  //     const classMap = {};

  //     feeCollectionData.fee_collections.forEach((fc) => {
  //       const student = fc.student;
  //       const classId = student.class.id;

  //       if (!classMap[classId]) {
  //         classMap[classId] = {
  //           id: classId,
  //           name: student.class.name,
  //           students: [],
  //         };
  //       }

  //       // Avoid duplicate student push
  //       if (!classMap[classId].students.find((s) => s.id === student.id)) {
  //         classMap[classId].students.push(student);
  //       }
  //     });

  //     // Convert map → array
  //     setSelectedClass(Object.values(classMap));
  //   }
  // }, [feeCollectionData]);


  // console.log('feeCollectionData=== =====', feeCollectionData);




  // state

  // handler
  const handleSelectPeriod = (periodId) => {
    setActivePeriodId(periodId.id);
    // console.log("Selected Fee Period:", periodId);
    // 👉 here you can trigger API calls or filter student data by this period
  };
  // const standardFees = config.standards

  // console.log('periodId======:', standardFees?.find((period) => period?.id === selectedStandardId));
  // console.log('periodId======:', activePeriodId);
  // ===================================================================
  return (
    <>
      <Layout>

        <div
          style={{
            backgroundImage: "url('/bg/appbackground@2x.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          className="min-h-[calc(100vh-100px)] p-6 space-y-6">
          <div className="bg-gray-100 min-h-screen p-4">



            <Header
              headerTitle={"Fee Management"}
              headerIcon={<BiSolidReceipt />}

              toggleFilterPanel={toggleFilterPanel}
              getFilterCount={getFilterCount}

              viewMode={viewMode}
              setViewMode={setViewMode}
            />



            <FeeSummaryFiltersSummary
              filters={filters}
              toggleFilter={toggleFilter}
              clearFilters={clearFilters}
            />

            <FeeSummaryFilterPanel
              setFilters={setFilters}
              config={config}

              isFilterPanelOpen={isFilterPanelOpen}
              // modules={modules} // <-- use the dummy modules state, not []
              filters={filters}
              studentStatus={studentStatus}
              toggleFilter={toggleFilter}
            // getAvailableCategories={getAvailableCategories}
            />




















            {viewMode === 'overview' ? (
              <>
                {/*  ===================== Stats Cards ===================== */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  <div className="bg-white rounded shadow border border-gray-200 p-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">{stats.classes ? stats.classes : 0}</div>
                        <div className="text-sm text-gray-600">Total Students</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded shadow border border-gray-200 p-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">{stats.exams}</div>
                        <div className="text-sm text-gray-600">Paid</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded shadow border border-gray-200 p-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <DollarSign className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-yellow-600">{stats.fees}</div>
                        <div className="text-sm text-gray-600">Pending</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded shadow border border-gray-200 p-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-red-600">{stats.fees}</div>
                        <div className="text-sm text-gray-600">Defaulters</div>
                      </div>
                    </div>
                  </div>
                </div>


                <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    {/* Title */}
                    <h3 className="text-lg font-semibold text-gray-900">
                      Detailed Fee Status for Standard: {selectedStandardDetails?.name}
                    </h3>
                    {/* <h3 className="text-lg font-semibold text-gray-900">
                      Total : {feeCollectionData?.count}
                    </h3> */}
                    {/*============  Standard selection ============ */}
                    <div>
                      <select
                        value={selectedStandardId}
                        onChange={(e) => handleStandardChange(e)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm  focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      >
                        {config?.standards?.map(std => (
                          <option

                            key={std?.id} value={std.id}>
                            {std?.name}
                          </option>
                        ))}
                      </select>
                    </div>





                  </div>
                  {/* ============ Fee Periods ============ */}
                  <div className="bg-white flex flex-row rounded-lg shadow-sm mb-6 sm:mb-8 border border-gray-200 overflow-x-auto scrollbar-hide">
                    <div className="flex flex-row whitespace-nowrap p-2">
                      {(() => {
                        const selectedStandard = standardFees?.find(
                          (std) => String(std?.id) === String(selectedStandardId)
                        );
                        const periods = selectedStandard?.fees || [];

                        if (!periods.length) {
                          return (
                            <span className="text-xs text-gray-500 italic py-1.5">
                              No fee periods available
                            </span>
                          );
                        }

                        return periods.map((period) => (
                          <button
                            key={period?.id}
                            onClick={() => handleSelectPeriod(period)}
                            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition whitespace-nowrap
            ${activePeriodId === period?.id
                                ? "bg-green-600 text-white shadow-sm"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                              }`}
                          >
                            {/* Period name */}
                            <span>{period?.name}</span>

                            {/* Progress badge */}
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full
              ${activePeriodId === period?.id
                                  ? "bg-white text-green-600"
                                  : "bg-gray-300 text-gray-700"
                                }`}
                            >
                              {period?.completed || 0} / {period?.total || 0}
                            </span>
                          </button>
                        ));
                      })()}
                    </div>
                  </div>




                  {/* ============ Select Clasees ============ */}




                  <div className="w-full border-b border-gray-200 bg-white">
                    <div className="flex space-x-2 px-4 py-2 overflow-x-auto scrollbar-hide">
                      {/* {selectedClass?.map((cls) => ( */}
                      {selectedClass?.map((cls) => (
                        <button
                          key={cls.id}
                          onClick={() => handleClassSelect(cls)}
                          className={`px-4 py-2 text-sm font-medium rounded-md transition whitespace-nowrap
              ${activeClassId === cls.id
                              ? "bg-blue-600 text-white shadow-sm"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                          {cls.name}
                        </button>
                      ))}
                    </div>
                  </div>



                  {/* ============ DATA ============ */}



                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Roll No.
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Admission No.
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Registration No.
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Phone
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fee Category
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>

                      <tbody className="bg-white divide-y divide-gray-200">
                        {/* {selectedClassStudents?.length > 0 ? (
                          selectedClassStudents.map((student) => ( */}
                        {feeCollectionData?.fee_collections?.length > 0 ? (
                          feeCollectionData?.fee_collections?.map((student) => (
                            <tr key={student.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {student?.student?.roll_number || "-"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex items-center space-x-2">
                                {student.image_url ? (
                                  <img
                                    src={student.image_url}
                                    alt={student.name}
                                    className="w-8 h-8 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                                    {student.name?.charAt(0)}
                                  </div>
                                )}
                                <span>{student?.student?.name}</span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {student.admission_number || "-"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {student.registration_number || "-"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {student.registered_phone_for_sms || "-"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {student.student_fee_category || "Default"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                  onClick={() => console.log("View fee details for", student.name)}
                                  className="cursor-pointer text-blue-600 hover:text-blue-900"
                                >


                                  {/* <AddMeetingForm /> */}
                                  <button
                                    type="button"

                                    onClick={() => setSelectedStudent(student)}
                                    className="cursor-pointer rounded-full w-10 h-10 flex items-center justify-center bg-accent text-white shadow  transition-colors"
                                    aria-label="Edit Categories"
                                  >
                                    <IndianRupee size={16} />
                                    <FeeSummaryDrawer

                                      studentId={selectedStudent.id}
                                      profile={profile}
                                      session={session}
                                      cookyGuid={cookyGuid}
                                      cookyId={cookyId}
                                      school={school}


                                    />
                                  </button>

                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={7}
                              className="px-6 py-6 text-center text-sm text-gray-500 italic"
                            >
                              No students found for this class.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                </div>






              </>
            ) : (
              /* Student-wise View */
              <div className="bg-white rounded shadow border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Student Fee Details - {selectedStandardId === 'all' ? 'All Standards' : selectedStandardId + ' Standard'}
                    </h3>
                    <p className="text-sm text-gray-600">Individual student fee payment status</p>
                  </div>
                  <button
                    onClick={() => setViewMode('overview')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Back to Overview
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll No</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Paid</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Mode</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Payment</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {(selectedStandardId === 'all'
                        ? Object.entries(studentData).flatMap(([std, students]) =>
                          students.map(student => ({ ...student, standard: std }))
                        )
                        : studentData[selectedStandardId] || []
                      ).map((student) => (
                        <tr key={student.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {student.rollNo}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div>
                              <div className="font-medium">{student.name}</div>
                              {selectedStandardId === 'all' && (
                                <div className="text-xs text-gray-500">{student.standard} Standard</div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(student.status)}`}>
                              {student.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{student.amount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center gap-2">
                              {student.mode === 'Online' && <Smartphone className="w-4 h-4 text-green-600" />}
                              {student.mode === 'Cash' && <Banknote className="w-4 h-4 text-yellow-600" />}
                              {student.mode === 'Cheque' && <CreditCard className="w-4 h-4 text-blue-600" />}
                              {student.mode}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {student.lastPayment}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900 mr-3">
                              View Details
                            </button>
                            {student.status !== 'Paid' && (
                              <button className="text-green-600 hover:text-green-900">
                                Send Reminder
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </Layout >
    </>
  );
};

export default FeeManagementDashboard;