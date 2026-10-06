import { useState, useEffect } from "react";
import SearchBar from "./library/component/SearchBar"; // Adjust path as needed
import ActiveFilters from "./library/component/ActiveFilters"; // Adjust path as needed
import FilterPanel from "./library/component/FilterPanel"; // Adjust path as needed
import Summary from "./library/component/Summary"; // Adjust path as needed
import Table from "./library/component/Table"; // Adjust path as needed
import OnlineClassesTable from "./library/component/Table-onlineClasses"; // Adjust path as needed
import Grid from "./library/component/Grid"; // Adjust path as needed
import OnlineClassesModal from "./library/component/OnlineClassesModal";
import ProductDetailModal from "./library/component/ProductDetailModal";
import { BadgePlus, List, User } from "lucide-react";
import Header from "./library/component/Header";
import Tabs from "./library/component/Tabs";
// import LibraryDashboard from "./library/component/dashboard";
import LibrarySceneV2 from "./library/component/dashboard_v1";
// import LibraryCard from "./library/component/dashboard_v2";
// import LibraryDashboard1 from "./library/component/dashboard_v3";
// ========================================================================================
const libData = [
    {
        "books_count": 29,
        "id": "29",
        "name": "Test",
        "school": {
            "id": "5384",
            "name": "DEMO MODEL SCHOOL (SECONDARY), BANKURA"
        },
        "description": null,
        "fine_per_day": "10.00",
        "max_number_of_books_allowed_per_student": "1",
        "max_number_of_days_to_be_issued": "7",
        "created_by": {
            "id": "34576",
            "name": "Ratna Pandey"
        },
        "library_rooms": [
            {
                "id": "10",
                "name": "Science",
                "library_shelves": [
                    {
                        "id": "32",
                        "name": "Physics",
                        "library_racks": [
                            {
                                "id": "27",
                                "number": "1"
                            },
                            {
                                "id": "28",
                                "number": "2"
                            }
                        ]
                    },
                    {
                        "id": "33",
                        "name": "Chemistry",
                        "library_racks": [
                            {
                                "id": "27",
                                "number": "1"
                            },
                            {
                                "id": "28",
                                "number": "2"
                            }
                        ]
                    }
                ]
            },
            {
                "id": "11",
                "name": "Commerce",
                "library_shelves": [
                    {
                        "id": "32",
                        "name": "Physics",
                        "library_racks": [
                            {
                                "id": "27",
                                "number": "1"
                            },
                            {
                                "id": "28",
                                "number": "2"
                            }
                        ]
                    },
                    {
                        "id": "33",
                        "name": "Chemistry",
                        "library_racks": [
                            {
                                "id": "27",
                                "number": "1"
                            },
                            {
                                "id": "28",
                                "number": "2"
                            }
                        ]
                    }
                ]
            }
        ],
        "standards": [
            {
                "id": "32864",
                "name": "V"
            },
            {
                "id": "32867",
                "name": "VIII"
            }
        ],
        "options": [
            {
                "action": "view",
                "label": "View",
                "redirect_url": null,
                "api": "library.getDetails",
                "alert": null
            },
            {
                "action": "edit",
                "label": "Edit",
                "redirect_url": null,
                "api": "library.edit",
                "alert": null
            },
            {
                "action": "delete",
                "label": "Delete",
                "redirect_url": null,
                "api": "library.delete",
                "alert": null
            }
        ],
        "display_native_ad": true
    },
    {
        "id": "24",
        "name": "Library 1",
        "school": {
            "id": "5384",
            "name": "DEMO MODEL SCHOOL (SECONDARY), BANKURA"
        },
        "description": null,
        "fine_per_day": "10.00",
        "max_number_of_books_allowed_per_student": "5",
        "max_number_of_days_to_be_issued": null,
        "created_by": {
            "id": "34504",
            "name": "ANINDITA SINHA"
        },
        "library_rooms": [
            {
                "id": "7",
                "name": "1",
                "library_shelves": [
                    {
                        "id": "16",
                        "name": "17",
                        "library_racks": [
                            {
                                "id": "20",
                                "number": "1"
                            },
                            {
                                "id": "21",
                                "number": "2"
                            },
                            {
                                "id": "22",
                                "number": "3"
                            }
                        ]
                    },
                    {
                        "id": "17",
                        "name": "18",
                        "library_racks": [
                            {
                                "id": "20",
                                "number": "1"
                            },
                            {
                                "id": "21",
                                "number": "2"
                            },
                            {
                                "id": "22",
                                "number": "3"
                            },
                            {
                                "id": "23",
                                "number": "4"
                            }
                        ]
                    },
                    {
                        "id": "18",
                        "name": "19",
                        "library_racks": [
                            {
                                "id": "20",
                                "number": "1"
                            },
                            {
                                "id": "21",
                                "number": "2"
                            },
                            {
                                "id": "22",
                                "number": "3"
                            },
                            {
                                "id": "23",
                                "number": "4"
                            },
                            {
                                "id": "24",
                                "number": "5"
                            }
                        ]
                    }
                ]
            }
        ],
        "standards": [
            {
                "id": "9259",
                "name": "VII"
            },
            {
                "id": "9260",
                "name": "VIII"
            }
        ],
        "options": [
            {
                "action": "view",
                "label": "View",
                "redirect_url": null,
                "api": "library.getDetails",
                "alert": null
            },
            {
                "action": "edit",
                "label": "Edit",
                "redirect_url": null,
                "api": "library.edit",
                "alert": null
            },
            {
                "action": "delete",
                "label": "Delete",
                "redirect_url": null,
                "api": "library.delete",
                "alert": null
            }
        ],
        "display_native_ad": false
    },
    {
        "id": "22",
        "name": "Sample Publisher",
        "school": {
            "id": "5384",
            "name": "DEMO MODEL SCHOOL (SECONDARY), BANKURA"
        },
        "description": "Some Description",
        "fine_per_day": null,
        "max_number_of_books_allowed_per_student": null,
        "max_number_of_days_to_be_issued": null,
        "created_by": {
            "id": "28110",
            "name": "Suman"
        },
        "library_rooms": [
            {
                "id": "3",
                "name": "Room 1 edited",
                "library_shelves": [
                    {
                        "id": "2",
                        "name": "Sample Shelf",
                        "library_racks": [
                            {
                                "id": "5",
                                "number": "1"
                            }
                        ]
                    }
                ]
            },
            {
                "id": "4",
                "name": "Room 1",
                "library_shelves": [
                    {
                        "id": "2",
                        "name": "Sample Shelf",
                        "library_racks": [
                            {
                                "id": "5",
                                "number": "1"
                            }
                        ]
                    }
                ]
            }
        ],
        "standards": [],
        "options": [
            {
                "action": "view",
                "label": "View",
                "redirect_url": null,
                "api": "library.getDetails",
                "alert": null
            },
            {
                "action": "edit",
                "label": "Edit",
                "redirect_url": null,
                "api": "library.edit",
                "alert": null
            },
            {
                "action": "delete",
                "label": "Delete",
                "redirect_url": null,
                "api": "library.delete",
                "alert": null
            }
        ],
        "display_native_ad": false
    },
    {
        "id": "21",
        "name": "Demo Library edited",
        "school": {
            "id": "5384",
            "name": "DEMO MODEL SCHOOL (SECONDARY), BANKURA"
        },
        "description": "Some Description",
        "fine_per_day": "20.00",
        "max_number_of_books_allowed_per_student": "2",
        "max_number_of_days_to_be_issued": "1",
        "created_by": {
            "id": "28110",
            "name": "Suman"
        },
        "library_rooms": [],
        "standards": [
            {
                "id": "7435",
                "name": "VI"
            }
        ],
        "options": [
            {
                "action": "view",
                "label": "View",
                "redirect_url": null,
                "api": "library.getDetails",
                "alert": null
            },
            {
                "action": "edit",
                "label": "Edit",
                "redirect_url": null,
                "api": "library.edit",
                "alert": null
            },
            {
                "action": "delete",
                "label": "Delete",
                "redirect_url": null,
                "api": "library.delete",
                "alert": null
            }
        ],
        "display_native_ad": false
    },
    {
        "id": "15",
        "name": "Standard XI & XII Commerce",
        "school": {
            "id": "5384",
            "name": "DEMO MODEL SCHOOL (SECONDARY), BANKURA"
        },
        "description": "Mathematics",
        "fine_per_day": null,
        "max_number_of_books_allowed_per_student": null,
        "max_number_of_days_to_be_issued": null,
        "created_by": {
            "id": "28110",
            "name": "Suman"
        },
        "library_rooms": [
            {
                "id": "1",
                "name": "ABC",
                "library_shelves": []
            }
        ],
        "standards": [
            {
                "id": "7093",
                "name": "XI-COMMERCE"
            },
            {
                "id": "7095",
                "name": "XII-COMMERCE"
            }
        ],
        "options": [
            {
                "action": "view",
                "label": "View",
                "redirect_url": null,
                "api": "library.getDetails",
                "alert": null
            },
            {
                "action": "edit",
                "label": "Edit",
                "redirect_url": null,
                "api": "library.edit",
                "alert": null
            },
            {
                "action": "delete",
                "label": "Delete",
                "redirect_url": null,
                "api": "library.delete",
                "alert": null
            }
        ],
        "display_native_ad": false
    },
    {
        "id": "14",
        "name": "Standard XI & XII Science",
        "school": {
            "id": "5384",
            "name": "DEMO MODEL SCHOOL (SECONDARY), BANKURA"
        },
        "description": "Science",
        "fine_per_day": null,
        "max_number_of_books_allowed_per_student": null,
        "max_number_of_days_to_be_issued": null,
        "created_by": {
            "id": "28110",
            "name": "Suman"
        },
        "library_rooms": [],
        "standards": [
            {
                "id": "7092",
                "name": "XI-SCIENCE"
            },
            {
                "id": "7094",
                "name": "XII-SCIENCE"
            }
        ],
        "options": [
            {
                "action": "view",
                "label": "View",
                "redirect_url": null,
                "api": "library.getDetails",
                "alert": null
            },
            {
                "action": "edit",
                "label": "Edit",
                "redirect_url": null,
                "api": "library.edit",
                "alert": null
            },
            {
                "action": "delete",
                "label": "Delete",
                "redirect_url": null,
                "api": "library.delete",
                "alert": null
            }
        ],
        "display_native_ad": false
    },
    {
        "id": "13",
        "name": "Standard III & IV",
        "school": {
            "id": "5384",
            "name": "DEMO MODEL SCHOOL (SECONDARY), BANKURA"
        },
        "description": "for class 3 and class 4",
        "fine_per_day": null,
        "max_number_of_books_allowed_per_student": null,
        "max_number_of_days_to_be_issued": null,
        "created_by": {
            "id": "28110",
            "name": "Suman"
        },
        "library_rooms": [],
        "standards": [
            {
                "id": "7084",
                "name": "III"
            },
            {
                "id": "7085",
                "name": "IV"
            }
        ],
        "options": [
            {
                "action": "view",
                "label": "View",
                "redirect_url": null,
                "api": "library.getDetails",
                "alert": null
            },
            {
                "action": "edit",
                "label": "Edit",
                "redirect_url": null,
                "api": "library.edit",
                "alert": null
            },
            {
                "action": "delete",
                "label": "Delete",
                "redirect_url": null,
                "api": "library.delete",
                "alert": null
            }
        ],
        "display_native_ad": false
    },
    {
        "id": "7",
        "name": "SUVAM PAUL",
        "school": {
            "id": "5384",
            "name": "DEMO MODEL SCHOOL (SECONDARY), BANKURA"
        },
        "description": null,
        "fine_per_day": null,
        "max_number_of_books_allowed_per_student": null,
        "max_number_of_days_to_be_issued": null,
        "created_by": {
            "id": "28110",
            "name": "Suman"
        },
        "library_rooms": [],
        "standards": [
            {
                "id": "7080",
                "name": "L.K.G"
            }
        ],
        "options": [
            {
                "action": "view",
                "label": "View",
                "redirect_url": null,
                "api": "library.getDetails",
                "alert": null
            },
            {
                "action": "edit",
                "label": "Edit",
                "redirect_url": null,
                "api": "library.edit",
                "alert": null
            },
            {
                "action": "delete",
                "label": "Delete",
                "redirect_url": null,
                "api": "library.delete",
                "alert": null
            }
        ],
        "display_native_ad": false
    },
    {
        "id": "6",
        "name": "Management",
        "school": {
            "id": "5384",
            "name": "DEMO MODEL SCHOOL (SECONDARY), BANKURA"
        },
        "description": null,
        "fine_per_day": null,
        "max_number_of_books_allowed_per_student": null,
        "max_number_of_days_to_be_issued": null,
        "created_by": {
            "id": "28110",
            "name": "Suman"
        },
        "library_rooms": [],
        "standards": [
            {
                "id": "7090",
                "name": "IX"
            }
        ],
        "options": [
            {
                "action": "view",
                "label": "View",
                "redirect_url": null,
                "api": "library.getDetails",
                "alert": null
            },
            {
                "action": "edit",
                "label": "Edit",
                "redirect_url": null,
                "api": "library.edit",
                "alert": null
            },
            {
                "action": "delete",
                "label": "Delete",
                "redirect_url": null,
                "api": "library.delete",
                "alert": null
            }
        ],
        "display_native_ad": false
    },
    {
        "id": "5",
        "name": "Standard VII & VIII",
        "school": {
            "id": "5384",
            "name": "DEMO MODEL SCHOOL (SECONDARY), BANKURA"
        },
        "description": "Books Management",
        "fine_per_day": null,
        "max_number_of_books_allowed_per_student": null,
        "max_number_of_days_to_be_issued": null,
        "created_by": {
            "id": "28110",
            "name": "Suman"
        },
        "library_rooms": [],
        "standards": [
            {
                "id": "7088",
                "name": "VII"
            },
            {
                "id": "7089",
                "name": "VIII"
            }
        ],
        "options": [
            {
                "action": "view",
                "label": "View",
                "redirect_url": null,
                "api": "library.getDetails",
                "alert": null
            },
            {
                "action": "edit",
                "label": "Edit",
                "redirect_url": null,
                "api": "library.edit",
                "alert": null
            },
            {
                "action": "delete",
                "label": "Delete",
                "redirect_url": null,
                "api": "library.delete",
                "alert": null
            }
        ],
        "display_native_ad": false
    }
]
// ========================================================================================

export default function LibraryExplorerView({
    headerTitle,
    headerIcon,
    data,
    columns,
    tableType
}) {

    const [activeTab, setActiveTab] = useState('dashboard');


    const [showModal, setShowModal] = useState(false);
    const [inventory, setInventory] = useState([]);
    // const { inventoryData } = useFetchInventory(); // Assuming this hook fetches data
    console.log(
        'activeTab', activeTab
    )
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

                {/* <Summary
                    filteredCount={filteredInventory.length}
                    totalCount={inventory.length}
                    sort={sort}
                    handleSort={handleSort}
                /> */}

                {/* {filteredInventory.length > 0 ? (
                    <>
                    </>
                ) : (
                    <div className="text-gray-500 text-center py-8">No items found.</div>
                )} */}
                {viewMode === "table" ? (
                    (() => {
                        switch (activeTab) {
                            case "dashboard":
                                // return <LibraryDashboard
                                return <LibrarySceneV2
                                // return <LibraryCard
                                // return <LibraryDashboard1
                                    library={libData}
                                />;
                            // add other cases if needed
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
