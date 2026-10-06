import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, List, Notebook, Captions } from "lucide-react";
import SchoolDesignationCreateModal from "./SchoolDesignationCreateModal";
import SchoolDesignationEditModal from "./SchoolDesignationEditModal";
import DesignationFilterPanel from "./DesignationFilterPanel";
import { getSchoolDesignation, addSchoolDesignation, deleteSchoolDesignation, editSchoolDesignation } from "../../api/designation";
import { IoPeopleSharp } from "react-icons/io5";
import { FaFilter } from "react-icons/fa";
import ConfirmationDialogueBox from "../ui/status/Confirmation";
import { VscSymbolClass } from "react-icons/vsc";

export default function SchoolDesignationManagement({ Context, config }) {
  const [filters, setFilters] = useState({
    name: "",
    role_id: "",
    department_id: "",
    has_login_access: "",
    isSearch: false

  });


  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingParent, setEditingParent] = useState(null);
  const [designationToDelete, setDesignationToDelete] = useState(null);
  const [isEditingDesignation, setIsEditingDesignation] = useState(null);


  const fetchDesignation = async (pageNumber = 1) => {
    try {
      setLoading(true);

      const currentOffset = (pageNumber - 1) * limit;
      const res = await getSchoolDesignation(
        Context?.profileId,
        Context?.session,
        pageNumber,
        filters

      );

      if (res?.data?.success) {
        setDesignations(res.data.results.school_designations || []);
        setTotal(res.data.results.count || 0);
        setPage(pageNumber);
      }
    } catch (err) {
      console.log("Parents fetch error", err);
    } finally {
      setLoading(false);
    }
  };
// Re-fetch when page changes or search is triggered
useEffect(() => {
  fetchDesignation(page);
}, [page, filters?.isSearch]);

// Reset to page 1 when filters are modified
useEffect(() => {
  setPage(1);
}, [filters.name, filters.role_id, filters.department_id, filters.has_login_access]);
  const openAddModal = () => {
    // setEditingParent(null);
    setIsModalOpen(true);
  };

  const openEditModal = (parent) => {
    setEditingParent(parent);
    // setIsModalOpen(true);
  };

  const handleDelete = (parent) => {
    console.log(parent);

    // if (!window.confirm("Delete this parent?")) return;
    // setDesignations(parent);
    setDesignationToDelete(parent)
  };

  const totalPages = Math.ceil(total / limit);
  // console.log('parents___', designations);
  const toggleFilterPanel = () => {
    setIsFilterPanelOpen(!isFilterPanelOpen);
  };

  const getFilterCount = () => {
    return (filters?.name ? 1 : 0)
      + (filters?.role_id ? 1 : 0)
      + (filters?.department_id ? 1 : 0)
      + (filters?.has_login_access ? 1 : 0)
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
  const handleDesignationDelete = async () => {
    setSubmitted(true);
    setError(null);
    setSuccess(null);

    try {
      if (!designationToDelete?.id) {
        setError("Invalid department selected");
        setSubmitted(false);
        return;
      }

      const resp = await deleteSchoolDesignation(
        Context?.profileId,
        Context?.session,
        designationToDelete?.id
      );

      if (resp?.data?.success) {
        setSuccess(resp?.data?.results?.message || "Designation deleted successfully");

        setTimeout(() => {
          setSuccess(null);

          window.location.reload(); // keeping your pattern
        }, 700);

        setSubmitted(false);
      } else {
        setError(resp?.data?.results?.message || "Failed to delete Designation");
        setSubmitted(false);
      }
    } catch (err) {
      console.error("Designation delete error:", err);
      setError(err.message || "Something went wrong while deleting department");
      setSubmitted(false);
    }
  };
  return (
    <>


      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 md:p-8">
        <div className=" mx-auto">
          <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            {/* Left Section: Icon + Title */}
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-accent rounded-2xl flex items-center justify-center shadow-xl">
                <Captions className="w-8 h-8 text-white" />
              </div>

              <div>
                <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-600 to-accent bg-clip-text text-transparent">
                  School Designation Management
                </h1>
                <p className="text-gray-600 font-medium mt-1 text-sm md:text-base">
                  Manage Designation  and track performance
                </p>
              </div>
            </div>

            {/* Right Section: Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">

              {/* Filters Button */}
              <button
                onClick={toggleFilterPanel}
                className="cursor-pointer flex items-center justify-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FaFilter size={16} className="mr-2" />
                <span>Filters</span>
                {getFilterCount() > 0 && (
                  <span className="ml-2 bg-blue-500 text-white text-xs font-medium w-5 h-5 rounded-full flex items-center justify-center">
                    {getFilterCount()}
                  </span>
                )}
              </button>

              {/* Add Parent Button */}
              <button
                onClick={openAddModal}
                className="cursor-pointer flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-accent text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <Plus className="w-5 h-5" />
                <span>Add Designation</span>
              </button>

            </div>
          </div>
          <DesignationFilterPanel
            setFilters={setFilters}
            filters={filters}
            config={config}
            isFilterPanelOpen={isFilterPanelOpen}

            setIsFilterPanelOpen={setIsFilterPanelOpen}
            // staffStatus={staffStatus}
            // accountStatus={accountStatus}
            toggleFilter={toggleFilter}

          />

          {/* Table */}
          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 text-sm font-semibold text-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left">Priority</th>
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Role</th>
                  <th className="px-6 py-3 text-left">Login Access</th>
                  <th className="px-6 py-3 text-left">Departments</th>
                  <th className="px-6 py-3 text-left">Admin Access</th>
                  <th className="px-6 py-3 text-left">Number of Staffs</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-gray-400">
                      <div className="flex justify-center items-center py-12">
                        <div className="flex items-center gap-3 bg-white border border-gray-200 shadow-sm rounded-lg px-4 py-2">
                          {/* Note: Replaced static image with an illustrative loading icon for better UX */}
                          <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span className="text-gray-700 text-sm font-medium">Loading Designation ...</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : designations.length ? (
                  designations.map((item) => (
                    <tr key={item.id}>
                      {/* Priority */}
                      <td className="px-6 py-3">{item.priority || "—"}</td>

                      {/* Name */}
                      <td className="px-6 py-3">{item.name}</td>

                      {/* Role */}
                      <td className="px-6 py-3">
                        {item.role?.name || "—"}
                      </td>

                      {/* Login Access Badge */}
                      <td className="px-6 py-3">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${item.is_login_allowed === "1"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                            }`}
                        >
                          {item.is_login_allowed === "1" ? "Yes" : "No"}
                        </span>
                      </td>

                      {/* Departments - badge list */}
                      <td className="px-6 py-3 flex flex-wrap gap-2">
                        {item.departments?.length ? (
                          item.departments.map((dep) => (
                            <span
                              key={dep.id}
                              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md"
                            >
                              {dep.name}
                            </span>
                          ))
                        ) : (
                          "—"
                        )}
                      </td>

                      {/* Admin Access Badge */}
                      <td className="px-6 py-3">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${item.is_allowed_for_admin_access === "1"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                            }`}
                        >
                          {item.is_allowed_for_admin_access === "1" ? "Allowed" : "No"}
                        </span>
                      </td>

                      {/* Number of Staffs */}
                      <td className="px-6 py-3">
                        {item.number_of_users || "0"}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-3 flex justify-center gap-3">
                        {item.options?.length ? (
                          item.options
                            ?.filter(opt => opt.action !== "view")   // removes the view option entirely
                            .map((opt, i) => {

                              let Icon;
                              let handler;
                              let styles = "";

                              switch (opt.action) {
                                case "view":
                                  Icon = List;
                                  handler = () => openEditModal(item);
                                  styles = "bg-green-100 text-green-600 hover:bg-green-200";
                                  break;

                                case "edit":
                                  Icon = Edit2;
                                  handler = () => setIsEditingDesignation(item);
                                  styles = "bg-blue-100 text-blue-600 hover:bg-blue-200";
                                  break;

                                case "delete":
                                  Icon = Trash2;
                                  handler = () => handleDelete(item);
                                  styles = "bg-red-100 text-red-600 hover:bg-red-200";
                                  break;

                                default:
                                  return null;
                              }

                              return (
                                <button
                                  key={i}
                                  onClick={handler}
                                  className={`cursor-pointer p-2 rounded ${styles}`}
                                >
                                  <Icon className="w-4 h-4" />
                                </button>
                              );
                            })
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-6 text-gray-400">
                      <div className="flex flex-col items-center gap-3">
                        <span>No designations found.</span>

                        <button
                          onClick={() =>
                            setFilters({
                              name: "",
                              role_id: "",
                              department_id: "",
                              has_login_access: "",
                              isSearch: true
                            })
                          }
                          className="flex items-center justify-center gap-2 px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                        >
                          <FaFilter size={16} />
                          <span>Clear Filters</span>

                          {getFilterCount() > 0 && (
                            <span className="bg-blue-500 text-white text-xs font-medium w-5 h-5 rounded-full flex items-center justify-center">
                              {getFilterCount()}
                            </span>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>


                )}
              </tbody>
            </table>
          </div>
{total > 0 && (
  <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4 px-2">
    {/* Info Text */}
    <p className="text-sm font-medium text-gray-500">
      Showing <span className="text-blue-600">{(page - 1) * limit + 1}</span> to{" "}
      <span className="text-blue-600">{Math.min(page * limit, total)}</span> of{" "}
      <span className="font-bold text-gray-900">{total}</span> designations
    </p>

    {/* Page Controls */}
    <div className="flex items-center space-x-2">
      <button
        disabled={page === 1 || loading}
        onClick={() => setPage(page - 1)}
        className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm"
      >
        <span className="sr-only">Previous</span>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="flex items-center gap-1">
        {(() => {
          const pages = [];
          const totalPages = Math.ceil(total / limit);
          
          // Logic to show 1 ... 4 5 6 ... 10
          if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
          } else {
            pages.push(1);
            if (page > 3) pages.push("...");
            if (page > 2 && page < totalPages - 1) pages.push(page - 1);
            if (page !== 1 && page !== totalPages) pages.push(page);
            if (page < totalPages - 1 && page > 2) pages.push(page + 1);
            if (page < totalPages - 2) pages.push("...");
            pages.push(totalPages);
          }

          return pages.map((p, i) => (
            p === "..." ? (
              <span key={`gap-${i}`} className="px-3 text-gray-400 font-bold">...</span>
            ) : (
              <button
                key={`p-${p}`}
                onClick={() => setPage(p)}
                className={`w-10 h-10 rounded-xl font-bold transition-all shadow-sm ${
                  p === page
                    ? "bg-blue-600 text-white shadow-blue-200"
                    : "bg-white text-gray-600 hover:border-blue-300 border border-gray-100"
                }`}
              >
                {p}
              </button>
            )
          ));
        })()}
      </div>

      <button
        disabled={page >= Math.ceil(total / limit) || loading}
        onClick={() => setPage(page + 1)}
        className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm"
      >
        <span className="sr-only">Next</span>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
)}

          {/* Modal */}

          <SchoolDesignationEditModal
            context={Context}
            config={config}
            onUpdate={editSchoolDesignation}
            editingDesingation={isEditingDesignation}
            open={isEditingDesignation}
            onClose={() => setIsEditingDesignation(null)}
          />


          <SchoolDesignationCreateModal
            context={Context}
            config={config}

            onCreate={addSchoolDesignation}
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />

        </div>
      </div>





      {designationToDelete && (
        <ConfirmationDialogueBox
          title="Delete Designation?"
          description={`Are you sure you want to delete "${designationToDelete?.name}"?`}
          onConfirm={handleDesignationDelete}
          onCancel={() => setDesignationToDelete(null)}
        />
      )}



      {/* Success/Error Notifications */}
      {success && (
        <div className="fixed top-4 right-4 flex items-center bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl shadow-lg z-50 transition-all duration-300 animate-in fade-in slide-in-from-right-1">
          <span className="text-sm font-medium">{success}</span>
        </div>
      )}

      {error && (
        <div className="fixed top-4 right-4 flex items-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl shadow-lg z-50 transition-all duration-300 animate-in fade-in slide-in-from-right-1">
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}
    </>
  );
}
