import { useState, useEffect } from "react";
import ActiveFilters from "../library/component/ActiveFilters"; // Adjust path as needed
import FilterPanel from "../library/component/FilterPanel"; // Adjust path as needed
import Grid from "../library/component/Grid"; // Adjust path as needed
import OnlineClassesModal from "../library/component/OnlineClassesModal";
import ProductDetailModal from "../library/component/ProductDetailModal";
import Header from "./Header";
import Tabs from "../library/component/Tabs";
import ReportCardDesigner from "./ReportCardDesigner";
import SubjectsManagement from "./Subjects";
import GradesManagement from "./GradesManagement";
import ExamManagement from "./ExamDashboard";
import EnterMarks from "./EnterMarks";
import { getSessionCache } from "../../utils/sessionCache";

// ========================================================================================

export default function ReportCardExplorerView({
    classes,
    exams,
    headerTitle,
    headerIcon,
    data,
    tableType,
    cookyGuid,
    cookyId,
    grades,
    setSelectedStandard,
    selectedStandard
}) {





    const config = getSessionCache("dashboardConfig");
    const context = getSessionCache("dashboardContext");
    const standards = config?.standards


    const [activeTab, setActiveTab] = useState('subjects');


    const [showModal, setShowModal] = useState(false);
    const [inventory, setInventory] = useState([]);

    useEffect(() => {
        if (data && Array.isArray(data)) {
            setInventory(data);
        }
    }, [data]);

    // Module and category data structure (can be fetched from API)
    const [modules, setModules] = useState([
        {
            moduleName: "Meetings",
            categories: [
                "Upcoming",
                "All",

            ]
        },
        // {
        //     moduleName: "Kidz Zone",
        //     categories: [
        //         "Kids Magazines",
        //         "toys"
        //     ]
        // }
    ]);

    // Filter states and UI states
    const [filteredInventory, setFilteredInventory] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({
        modules: [],
        categories: [],
        status: []
    });
    const [sort, setSort] = useState({
        field: "name",
        direction: "asc"
    });
    const [viewMode, setViewMode] = useState("table"); // table or grid
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
    const [selectedData, setSelectedData] = useState(null);

    const [createOnlineClasses, setCreateOnlineClasses] = useState(false);
    // Filter inventory based on criteria
    useEffect(() => {
        let result = [...inventory];

        // Apply search term filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(item =>
                item.name.toLowerCase().includes(term) ||
                item.sku.toLowerCase().includes(term)
            );
        }

        // Apply module filter
        if (filters.modules.length > 0) {
            result = result.filter(item => filters.modules.includes(item.categoryId?.module?.name));
        }

        // Apply category filter
        if (filters.categories.length > 0) {
            result = result.filter(item => filters.categories.includes(item.categoryId?.name));
        }

        // Apply status filter
        if (filters.status.length > 0) {
            result = result.filter(item => filters.status.includes(item.status));
        }

        // Apply sorting
        result.sort((a, b) => {
            const fieldA = a[sort.field];
            const fieldB = b[sort.field];

            if (typeof fieldA === 'string') {
                if (sort.direction === 'asc') {
                    return fieldA.localeCompare(fieldB);
                } else {
                    return fieldB.localeCompare(fieldA);
                }
            } else {
                if (sort.direction === 'asc') {
                    return fieldA - fieldB;
                } else {
                    return fieldB - fieldA;
                }
            }
        });

        setFilteredInventory(result);
    }, [searchTerm, filters, inventory, sort]);

    // Toggle item in filter
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

    // Clear all filters
    const clearFilters = () => {
        setFilters({
            modules: [],
            categories: [],
            status: []
        });
        setSearchTerm("");
    };

    // Get all available categories across all selected modules
    const getAvailableCategories = () => {
        if (filters.modules.length === 0) {
            return modules.flatMap(module => module.categories);
        }

        return modules
            .filter(module => filters.modules.includes(module.moduleName))
            .flatMap(module => module.categories);
    };

    // Change sort
    const handleSort = (field, toggleDirection = false) => {
        setSort(prev => ({
            field,
            direction: toggleDirection && prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    // Get filter count
    const getFilterCount = () => {
        return filters.modules.length + filters.categories.length + filters.status.length;
    };

    // Handle filter panel toggle
    const toggleFilterPanel = () => {
        setIsFilterPanelOpen(!isFilterPanelOpen);
    };

    // Handle product click to show details
    const handleRowClick = (product) => {
        console.log(product)

        setSelectedData(product);
        setShowModal(true)
        setSelectedData(null); // Reset first
        setTimeout(() => setSelectedData(product), 0); // Allow state to change

    };








    // console.log('selectedStandard ==========', selectedStandard);
    // ========================================================================================

    return (
        <div className="bg-gray-100 p-2 w-[390px] sm:w-full md:w-[750px] lg:w-full overflow-x-auto">
            <div className=" mx-auto">

                <Header
                    headerTitle={headerTitle}
                    headerIcon={headerIcon}
                    toggleFilterPanel={toggleFilterPanel}
                    getFilterCount={getFilterCount}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    setCreateOnlineClasses={setCreateOnlineClasses}
                />

                {/* <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                /> */}
                <Tabs
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
                <ActiveFilters
                    filters={filters}
                    toggleFilter={toggleFilter}
                    clearFilters={clearFilters}
                />

                <FilterPanel
                    isFilterPanelOpen={isFilterPanelOpen}
                    modules={modules}
                    filters={filters}
                    toggleFilter={toggleFilter}
                    getAvailableCategories={getAvailableCategories}
                />


                {viewMode === "table" ? (
                    (() => {
                        switch (activeTab) {
                            case "subjects":
                                return <SubjectsManagement
                                    cookyGuid={cookyGuid}
                                    cookyId={cookyId}
                                    selectedStandard={selectedStandard}
                                    setSelectedStandard={setSelectedStandard}
                                    classes={standards}
                                    exams={exams}
                                    context={context}


                                />;
                            case "grades":
                                return <GradesManagement
                                    grades={grades}
                                />;
                            case "reportCardFormat":
                                return <ReportCardDesigner />;
                            case "exam":
                                return <ExamManagement
                                    cookyGuid={cookyGuid}
                                    cookyId={cookyId}
                                    selectedStandard={selectedStandard}
                                    setSelectedStandard={setSelectedStandard}
                                    classes={standards}
                                    exams={exams}
                                />;


                            case "enter-marks":
                                return <EnterMarks
                                    context={context}
                                    selectedStandard={selectedStandard}
                                    setSelectedStandard={setSelectedStandard}
                                    standards={standards}
                                    exams={exams}
                                />;


                            default:
                                return null;
                        }
                    })()
                ) : (
                    <Grid
                        gridType={tableType}
                        dataArray={filteredInventory}
                        handleRowClick={handleRowClick}
                    />
                )}


                {/* ================= Detail Modal ================================ */}
                {showModal ? (
                    (() => {
                        switch (tableType) {
                            case "onlineClasses":
                                return (
                                    <OnlineClassesModal
                                        selectedData={selectedData}
                                        onClose={() => setShowModal(false)}
                                    />

                                );
                            case "vendors":
                                return (
                                    <VendorDetailModal
                                        selectedData={selectedData}
                                        onClose={() => setShowModal(false)}
                                    />
                                );
                            case "customers":
                                return (
                                    <CustomerDetailModal
                                        selectedData={selectedData}
                                        onClose={() => setShowModal(false)}
                                    />
                                );
                            case "inventory":
                            default:
                                return (
                                    <ProductDetailModal
                                        isOpen={showModal}
                                        product={selectedData}
                                        onClose={() => setShowModal(false)}
                                    />
                                );
                        }
                    })()
                ) : null}
                {/* ======================================================================================== */}

            </div>
        </div>
    );
}

// ========================================================================================
