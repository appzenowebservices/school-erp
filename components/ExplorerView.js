'use client'
// pages/inventory/index.jsx (or whatever your main page is)
import { useState, useEffect } from "react";
// import { useFetchInventory } from "../controllers/inventory"; // Adjust path as needed
import Header from "./ui/tables/modernTable/component/Header"; // Adjust path as needed
import SearchBar from "./ui/tables/modernTable/component/SearchBar"; // Adjust path as needed
import ActiveFilters from "./ui/tables/modernTable/component/ActiveFilters"; // Adjust path as needed
import FilterPanel from "./ui/tables/modernTable/component/FilterPanel"; // Adjust path as needed
import Summary from "./ui/tables/modernTable/component/Summary"; // Adjust path as needed
import Table from "./ui/tables/modernTable/component/Table"; // Adjust path as needed
import OnlineClassesTable from "./ui/tables/modernTable/component/Table-onlineClasses"; // Adjust path as needed
import Grid from "./ui/tables/modernTable/component/Grid"; // Adjust path as needed

import OnlineClassesModal from "./ui/tables/modernTable/component/OnlineClassesModal";

import ProductDetailModal from "./ui/tables/modernTable/component/ProductDetailModal";
import CreateOnlineClasses from "./ui/drawer/CreateOnlineClasses";
// ========================================================================================

export default function ExplorerView({
    headerTitle,
    headerIcon,
    data,
    columns,
    tableType
}) {



    const [showModal, setShowModal] = useState(false);
    const [inventory, setInventory] = useState([]);
    // const { inventoryData } = useFetchInventory(); // Assuming this hook fetches data

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
        // console.log(product)

        setSelectedData(product);
        setShowModal(true)
        setSelectedData(null); // Reset first
        setTimeout(() => setSelectedData(product), 0); // Allow state to change

    };

    // Close product detail modal
    const closeProductDetail = () => {
        setSelectedData(null);
    };
    // ========================================================================================

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <Header
                    headerTitle={headerTitle}
                    headerIcon={headerIcon}
                    toggleFilterPanel={toggleFilterPanel}
                    getFilterCount={getFilterCount}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    setCreateOnlineClasses={setCreateOnlineClasses}
                />

                <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
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

                <Summary
                    filteredCount={filteredInventory.length}
                    totalCount={inventory.length}
                    sort={sort}
                    handleSort={handleSort}
                />

                {filteredInventory.length > 0 ? (
                    <>
                        {viewMode === "table" ? (
                            (() => {
                                switch (tableType) {
                                    case "onlineClasses":
                                        return (
                                            <OnlineClassesTable
                                                columns={columns}
                                                onlineClasses={filteredInventory}
                                                handleClassClick={handleRowClick}
                                            />
                                        );
                                    case "vendors":
                                        return (
                                            <VendorsTable
                                                columns={columns}
                                                vendors={filteredInventory}
                                                handleVendorClick={handleRowClick}
                                            />
                                        );
                                    case "customers":
                                        return (
                                            <CustomersTable
                                                columns={columns}
                                                customers={filteredInventory}
                                                handleCustomerClick={handleRowClick}
                                            />
                                        );
                                    case "inventory":
                                    default:
                                        return (
                                            <Table
                                                columns={columns}
                                                inventory={filteredInventory}
                                                handleProductClick={handleRowClick}
                                            />
                                        );
                                }
                            })()
                        ) : (
                            <Grid
                                gridType={tableType}
                                dataArray={filteredInventory}
                                handleRowClick={handleRowClick}
                            />
                        )}
                    </>
                ) : (
                    <div className="text-gray-500 text-center py-8">No items found.</div>
                )}
                {showModal ? (
                    (() => {
                        switch (tableType) {
                            case "onlineClasses":
                                return (
                                    <>
                                        <OnlineClassesModal
                                            selectedData={selectedData}
                                            onClose={() => setShowModal(false)}
                                        />

                                    </>
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
                {/* 
                {showModal && (
                    <OrderDetailModal
                        product={selectedData}
                        onClose={() => setShowModal(false)}
                    />
                )} */}
            </div>
        </div>
    );
}

// ========================================================================================
