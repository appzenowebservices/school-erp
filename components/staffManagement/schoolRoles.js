import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Notebook, CheckCircle2, X, AlertCircle } from "lucide-react";
import SchoolRolesCreateModal from "./SchoolRolesCreateModal";
import SchoolRolesEditModal from "./SchoolRolesEditModal";
import SchoolRolesFilterPanel from "./SchoolRolesFilterPanel";
import { getSchoolRoles, addSchoolRoles, deleteSchoolRoles, editSchoolRoles } from "../../api/roles";
import { FaFilter } from "react-icons/fa";
import ConfirmationDialogueBox from "../ui/status/Confirmation";
// ==================================================================

export default function SchoolRolesManagement({ Context, config, setActiveTab }) {
  const [filters, setFilters] = useState({
    name: "",
    has_admin_access: "",
    is_teaching_staff: "",
    is_enabled: "",
    isSearch: false

  });
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  const [schoolRoles, setSchoolRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingSchoolRoles, setEditingSchoolRoles] = useState(null);
  const [roleToDelete, setRoleToDelete] = useState(null);

  const fetchSchoolRoles = async (pageNumber = 1) => {
    try {
      setLoading(true);


      const res = await getSchoolRoles(
        Context?.profileId,
        Context?.session,
        filters

      );
      // console.log("___", res.data.results);

      if (res?.data?.success) {
        setSchoolRoles(res.data.results.school_roles || []);
        setTotal(res.data.results.count || 0);
        setPage(pageNumber);
        setActiveTab('schoolRoles')
      }
    } catch (err) {
      console.log("Parents fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchoolRoles(1);
  }, [
    filters?.isSearch,
    // filters?.mobile,

  ]);

  const openAddModal = () => {
    setIsModalOpen(true);
  };


  const handleDelete = (parent) => {
    console.log(parent);

    // if (!window.confirm("Delete this parent?")) return;
    // setSchoolRoles(parent);
    setRoleToDelete(parent)
  };

  const totalPages = Math.ceil(total / limit);
  // console.log('parents___', schoolRoles);
  const toggleFilterPanel = () => {
    setIsFilterPanelOpen(!isFilterPanelOpen);
  };

  const getFilterCount = () => {
    return (filters?.name ? 1 : 0) +
      (filters?.is_teaching_staff ? 1 : 0) +
      (filters?.is_enabled ? 1 : 0) +
      (filters?.has_admin_access ? 1 : 0)
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







  const handleRoleDelete = async () => {
    setSubmitted(true);
    setError(null);
    setSuccess(null);

    try {
      if (!roleToDelete?.id) {
        setError("Invalid department selected");
        setSubmitted(false);
        return;
      }

      const resp = await deleteSchoolRoles(
        Context?.profileId,
        Context?.session,
        roleToDelete?.id
      );

      if (resp?.data?.success) {
        setSuccess(resp?.data?.results?.message || "Role deleted successfully");

        setTimeout(() => {
          setSuccess(null);
          // setDepartmentToDelete(null);
          window.location.reload(); // keeping your pattern
        }, 700);

        setSubmitted(false);
      } else {
        setError(resp?.data?.results?.message || "Failed to delete Role");
        setSubmitted(false);
      }
    } catch (err) {
      console.error("Role delete error:", err);
      setError(err.message || "Something went wrong while deleting Role");
      setSubmitted(false);
    }
  };



  return (
    <>


      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 md:p-8">
        <div className="mx-auto">
          <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            {/* Left Section: Icon + Title */}
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-accent rounded-2xl flex items-center justify-center shadow-xl">
                <Notebook className="w-8 h-8 text-white" />
              </div>

              <div>
                <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-600 to-accent bg-clip-text text-transparent">
                  School Roles Management
                </h1>
                <p className="text-gray-600 font-medium mt-1 text-sm md:text-base">
                  Manage Department  and track performance
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
                <span>Add School Role</span>
              </button>

            </div>
          </div>
          <SchoolRolesFilterPanel
            setFilters={setFilters}
            filters={filters}
            config={config}
            isFilterPanelOpen={isFilterPanelOpen}
            setIsFilterPanelOpen={setIsFilterPanelOpen}
            toggleFilter={toggleFilter}

          />
          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 text-sm font-semibold text-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Is Teaching Staff</th>
                  <th className="px-6 py-3 text-left">Is Bus Conductor</th>
                  <th className="px-6 py-3 text-left">Description</th>
                  <th className="px-6 py-3 text-left">Number of Designations</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-gray-400">
                      <div className="flex justify-center items-center py-12">
                        <div className="flex items-center gap-3 bg-white border border-gray-200 shadow-sm rounded-lg px-4 py-2">
                          <svg className="animate-spin h-5 w-5 text-blue-500"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10"
                              stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 
                    1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span className="text-gray-700 text-sm font-medium">
                            Loading School Roles...
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : schoolRoles?.length ? (
                  schoolRoles.map(role => (
                    <tr key={role.id}>
                      <td className="px-6 py-3 font-medium">{role.name || "—"}</td>

                      <td className="px-6 py-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${role.is_teaching_staff === "1"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                            }`}
                        >
                          {role.is_teaching_staff === "1" ? "Yes" : "No"}
                        </span>
                      </td>

                      <td className="px-6 py-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${role.is_bus_conductor === "1"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                            }`}
                        >
                          {role.is_bus_conductor === "1" ? "Yes" : "No"}
                        </span>
                      </td>

                      <td className="px-6 py-3">
                        {role.description || "—"}
                      </td>

                      <td className="px-6 py-3">
                        {role.number_of_designations || 0}
                      </td>

                      <td className="px-6 py-3 flex justify-center gap-3">
                        {role.options
                          ?.filter(opt => opt.action !== "view")
                          ?.map((opt, i) => {
                            let Icon;
                            let handler;
                            let styles;

                            switch (opt.action) {
                              case "edit":
                                Icon = Edit2;
                                handler = () => setEditingSchoolRoles(role);
                                styles = "bg-blue-100 text-blue-600 hover:bg-blue-200";
                                break;

                              case "delete":
                                Icon = Trash2;
                                handler = () => handleDelete(role);
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
                          })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-400 font-medium">
                      No roles found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>


          {/* Pagination */}
          {total > 0 && (
            <div className="flex items-center gap-2 mt-4">

              {/* Prev */}
              <button
                disabled={page === 1}
                onClick={() => fetchParents(page - 1)}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>

              {/* Dynamic Pages */}
              <div className="flex gap-1">
                {(() => {
                  const pages = [];
                  const totalPages = Math.ceil(total / limit);

                  const add = (n) => {
                    if (!pages.includes(n)) pages.push(n);
                  };

                  // calculate window
                  const left = Math.max(1, page - 2);
                  const right = Math.min(totalPages, page + 2);

                  // always page 1
                  add(1);

                  // gap before window
                  if (left > 2) add("...");

                  // window pages
                  for (let i = left; i <= right; i++) add(i);

                  // gap after window
                  if (right < totalPages - 1) add("...");

                  // always last page
                  if (totalPages > 1) add(totalPages);

                  return pages.map((p, i) =>
                    p === "..." ? (
                      <span key={i} className="px-3 py-1 text-gray-500">...</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => fetchParents(p)}
                        className={`px-3 py-1 rounded ${p === page
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 hover:bg-gray-300"
                          }`}
                      >
                        {p}
                      </button>
                    )
                  );
                })()}
              </div>


              {/* Next */}
              <button
                disabled={page >= totalPages}
                onClick={() => fetchParents(page + 1)}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}


          <SchoolRolesEditModal
            onUpdate={editSchoolRoles}
            editingSchoolRoles={editingSchoolRoles}
            context={Context}
            open={editingSchoolRoles}
            onClose={() => setEditingSchoolRoles(null)}
          />

          <SchoolRolesCreateModal
            onCreate={addSchoolRoles}
            context={Context}
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />



        </div>
      </div>





      {roleToDelete && (
        <ConfirmationDialogueBox
          title="Delete Role?"
          description={`Are you sure you want to delete "${roleToDelete?.name}"?`}
          onConfirm={handleRoleDelete}
          onCancel={() => setRoleToDelete(null)}
        />
      )}
      apiResponse



      {/* Floating Notifications */}
      <div className="fixed top-6 right-6 flex flex-col gap-3 z-[60]">
        {error && (
          <div className="bg-white border-l-4 border-red-500 shadow-2xl rounded-2xl px-5 py-4 flex items-center gap-4 animate-in slide-in-from-right">
            <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-red-600 shrink-0">
              <AlertCircle size={20} />
            </div>
            <div className="pr-4">
              <p className="text-sm font-bold text-slate-900">Wait a minute</p>
              <p className="text-xs font-medium text-slate-500">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-slate-300 hover:text-slate-500">
              <X size={16} />
            </button>
          </div>
        )}

        {success && (
          <div className="bg-white border-l-4 border-green-500 shadow-2xl rounded-2xl px-5 py-4 flex items-center gap-4 animate-in slide-in-from-right">
            <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600 shrink-0">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Done!</p>
              <p className="text-sm font-medium text-slate-500">{apiResponse}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
