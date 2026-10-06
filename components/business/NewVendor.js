import { useState } from "react";
import { MdCheckCircle } from "react-icons/md";
import { FaSearch, FaFilter, FaEye } from "react-icons/fa";
import OnBoardingVendorDetails from "../ui/drawer/VendorDetails";

const NewVendorsTab = () => {
  const allVendors = [
    { id: 1, name: "Fresh Mart", interestedStore: "General Store" },
    { id: 2, name: "CityMed", interestedStore: "Pharmacy" },
    { id: 3, name: "Chotu", interestedStore: "Delivery Partner" },
    { id: 4, name: "Gupta Travellers", interestedStore: "Service" },
  ];

  const [vendors, setVendors] = useState(allVendors);
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");

  const toggleVendorSelection = (vendorId) => {
    setSelectedVendors((prev) =>
      prev.includes(vendorId)
        ? prev.filter((id) => id !== vendorId)
        : [...prev, vendorId]
    );
  };

  const toggleSelectAll = () => {
    const visibleVendors = filteredVendors.map((v) => v.id);
    if (selectedVendors.length === visibleVendors.length) {
      setSelectedVendors([]);
    } else {
      setSelectedVendors(visibleVendors);
    }
  };

  const handleBulkAdd = () => {
    const updatedVendors = vendors.filter((v) => !selectedVendors.includes(v.id));
    alert(`Added ${selectedVendors.length} vendor(s) to the store!`);
    setVendors(updatedVendors);
    setSelectedVendors([]);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "All" || vendor.interestedStore === filter;
    return matchesSearch && matchesFilter;
  });

  const storeOptions = ["All", ...new Set(vendors.map((v) => v.interestedStore))];

  return (
    <div className="p-4">
      <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <h2 className="text-lg font-semibold flex-shrink-0">🆕 New Vendors</h2>

          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-60">
              <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search vendors..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={filter}
              onChange={handleFilterChange}
              className="w-full md:w-auto px-4 py-2 border rounded-md bg-white"
            >
              {storeOptions.map((opt, i) => (
                <option key={i} value={opt}>
                  {opt === "All" ? "Filter by Store" : opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Vendor List */}
        {filteredVendors.length > 0 ? (
          <>
            <ul className="space-y-2">
              {filteredVendors.map((vendor) => (
                <li
                  key={vendor.id}
                  className="flex flex-wrap md:flex-nowrap items-center justify-between p-3 bg-white rounded-md border hover:bg-gray-50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedVendors.includes(vendor.id)}
                      onChange={() => toggleVendorSelection(vendor.id)}
                      className="accent-indigo-600"
                    />
                    <div>
                      <p className="font-medium text-gray-800">{vendor.name}</p>
                              <p className="text-sm text-gray-500">
                                Handling Modules:
                              </p>

                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium 
                          ${vendor.status === "new"
                            ? "bg-green-100 text-green-700"
                            : vendor.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-gray-500"
                          }
                        `}
                      >
                        {vendor.interestedStore}
                      </span>


                    </div>
                  </div>

                  <div className="flex gap-2 mt-2 md:mt-0">
                    <button className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                      Assign ▾
                    </button>
                    {/* <button className="text-sm bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 flex items-center gap-1">
                      <FaEye className="w-4 h-4" /> View
                    </button> */}

                    <OnBoardingVendorDetails />
                  </div>
                </li>
              ))}
            </ul>

            {/* Bulk Add Button */}
            {selectedVendors.length > 0 && (
              <button
                onClick={handleBulkAdd}
                className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 flex items-center justify-center gap-2"
              >
                <MdCheckCircle className="w-5 h-5" />
                Add {selectedVendors.length} Vendor(s) to Store
              </button>
            )}
          </>
        ) : (
          <p className="text-gray-500">No new vendor requests available.</p>
        )}
      </div>
    </div>
  );
};

export default NewVendorsTab;
