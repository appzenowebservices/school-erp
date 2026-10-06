import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, List } from "lucide-react";
import ParentCreateModal from "./ParentCreateModal";
import ParentFilterPanel from "./ParentFilterPanel";
import ParentDetailDrawer from "./ParentDetailDrawer";
import ParentEditModal from "./ParentEditModal";
import { getParentsList, addParents, updateParents, deleteParents } from "../../api/parents";
import { IoPeopleSharp } from "react-icons/io5";
import { FaFilter } from "react-icons/fa";
import ConfirmationDialogueBox from "../ui/status/Confirmation";

export default function ParentManagement({ Context, config }) {
  const [filters, setFilters] = useState({
    name: "",
    mobile: "",
    isSearch: false

  });
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingParent, setEditingParent] = useState(null);
  const [parentDetailDrawer, setParentDetailDrawer] = useState(null);
  const [parentToDelete, setParentToDelete] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const fetchParents = async (pageNumber = 1) => {
    try {
      setLoading(true);


      const res = await getParentsList(
        Context?.profileId,
        Context?.session,
        pageNumber,
        limit,
        filters
      );

      if (res?.data?.success) {
        setParents(res.data.results.student_parents || []);
        setTotal(res.data.results.count || 0);
        setPage(pageNumber);
      }
    } catch (err) {
      console.log("Parents fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParents(1);
  }, [
    filters?.isSearch,
    // filters?.mobile,

  ]);
  // console.log('filters++', filters);

  const openAddModal = () => {
    // setEditingParent(null);
    setIsModalOpen(true);
  };

  const openEditModal = (parent) => {
    setEditingParent(parent);

  };

  const openDetailSidebarDrawer = (parent) => {
    setParentDetailDrawer(parent);
  };
  const handleDelete = (parent) => {

    setParentToDelete(parent)
  };

  const totalPages = Math.ceil(total / limit);
  // console.log('parents___', parents);
  const toggleFilterPanel = () => {
    setIsFilterPanelOpen(!isFilterPanelOpen);
  };

  const getFilterCount = () => {
    return (filters?.name ? 1 : 0) + (filters?.mobile ? 1 : 0);
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


  const handleParentDelete = async () => {
    setSubmitted(true);
    setError(null);
    setSuccess(null);

    try {
      if (!parentToDelete?.id) {
        setError("Invalid department selected");
        setSubmitted(false);
        return;
      }

      const resp = await deleteParents(
        Context?.profileId,
        Context?.session,
        parentToDelete?.id
      );

      if (resp?.data?.success) {
        setSuccess(resp?.data?.results?.message || "Parent deleted successfully");

        setTimeout(() => {
          setSuccess(null);

          window.location.reload(); // keeping your pattern
        }, 700);

        setSubmitted(false);
      } else {
        setError(resp?.data?.results?.message || "Failed to delete Parent");
        setSubmitted(false);
      }
    } catch (err) {
      console.error("Parent delete error:", err);
      setError(err.message || "Something went wrong while deleting Parent");
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
                <IoPeopleSharp className="w-8 h-8 text-white" />
              </div>

              <div>
                <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-600 to-accent bg-clip-text text-transparent">
                  Parent Management
                </h1>
                <p className="text-gray-600 font-medium mt-1 text-sm md:text-base">
                  Manage student parents and track performance
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
                <span>Add Parent</span>
              </button>

            </div>
          </div>
          <ParentFilterPanel
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
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Gender</th>
                  <th className="px-6 py-3 text-left">Phones</th>
                  <th className="px-6 py-3 text-left">Children</th>
                  <th className="px-6 py-3 text-left">Platform ID</th>
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
                          <span className="text-gray-700 text-sm font-medium">Loading Parent Data...</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : parents.length ? (
                  parents.map((p) => {
                    // console.log('p_______________', p?.options);

                    return (
                      <tr key={p.id}>
                        <td className="px-6 py-3">{p.name}</td>
                        <td className="px-6 py-3">{p.gender}</td>
                        <td className="px-6 py-3">
                          {/* {p.calling_numbers?.join(", ") || "—"} */}
                          {p.phone || "—"}
                        </td>
                        <td className="px-6 py-3">
                          {p.students?.length ? (
                            <div className="flex flex-col gap-2.5">
                              {p.students.map((s, index) => (
                                <div
                                  key={s.id}
                                  className="group relative flex items-center gap-3 p-2.5 rounded-lg bg-gradient-to-r from-blue-50/50 to-indigo-50/50 hover:from-blue-50 hover:to-indigo-50 border border-blue-100/50 hover:border-indigo-200 transition-all duration-200 hover:shadow-sm"
                                >
                                  {/* Count Badge (if multiple students) */}
                                  {p.students.length > 1 && (
                                    <div className="absolute -top-1.5 -left-1.5 w-5 h-5 bg-indigo-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-sm border-2 border-white">
                                      {index + 1}
                                    </div>
                                  )}

                                  {/* Student Image */}
                                  <div className="relative flex-shrink-0">
                                    <img
                                      src={
                                        s.image_url && s.image_url.trim() !== ""
                                          ? s.image_url
                                          : "/placeholder-student.png"
                                      }
                                      alt={s.name}
                                      className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-md group-hover:scale-105 transition-transform duration-200"
                                      onError={(e) => {
                                        e.target.src = "/placeholder-student.png"
                                      }}
                                    />
                                    {/* Active indicator */}
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                  </div>

                                  {/* Student Info */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <span className="font-semibold text-gray-900 truncate">{s.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-600">
                                      <span className="px-2 py-0.5 bg-white rounded-md border border-gray-200 font-medium">
                                        {s.class}
                                      </span>
                                      {s.roll_number && (
                                        <>
                                          <span className="text-gray-400">•</span>
                                          <span className="font-medium">Roll {s.roll_number}</span>
                                        </>
                                      )}
                                    </div>
                                  </div>

                                  {/* Relation Badge */}
                                  <div className="flex-shrink-0">
                                    <span className="inline-flex px-2.5 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-200">
                                      {s.relation_with_parent}
                                    </span>
                                  </div>

                                </div>
                              ))}

                              {/* Summary footer (if multiple students) */}
                              {p.students.length > 1 && (
                                <div className="flex items-center justify-between px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-100 mt-1">
                                  <span className="text-xs font-semibold text-indigo-700">
                                    Total Students
                                  </span>
                                  <span className="text-xs font-bold text-indigo-900 bg-white px-2 py-0.5 rounded-full">
                                    {p.students.length}
                                  </span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm font-medium">—</span>
                          )}
                        </td>


                        <td className="px-6 py-3">{p.platform_id || "—"}</td>

                        <td className="px-6 py-3 flex justify-center gap-3">
                          {p.options?.length > 0 ? (
                            p?.options?.map((opt, i) => {
                              let Icon;
                              let handler;
                              let styles = "";

                              switch (opt.action) {
                                case "view":
                                  Icon = List;
                                  handler = () => openDetailSidebarDrawer(p);
                                  styles = "bg-green-100 text-green-600 hover:bg-green-200";
                                  break;

                                case "edit":
                                  Icon = Edit2;
                                  handler = () => openEditModal(p);
                                  styles = "bg-blue-100 text-blue-600 hover:bg-blue-200";
                                  break;

                                case "delete":
                                  Icon = Trash2;
                                  handler = () => handleDelete(p);
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
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-6 text-gray-400">
                      <div className="flex flex-col items-center gap-3">
                        <span>No Parents found.</span>

                        <button
                          onClick={() =>
                            setFilters({
                              name: "",

                              isSearch: prev => !prev
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

          {/* Modal */}
          <ParentEditModal
            updateParents={updateParents}
            open={editingParent}
            onClose={() => setEditingParent(false)}
            editingParent={editingParent}
          />


          <ParentCreateModal
            addParents={addParents}
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          // editingParent={editingParent}
          />

        </div>
      </div>


      <ParentDetailDrawer
        parentDetailDrawer={parentDetailDrawer}
        context={Context}
        onClose={() => setParentDetailDrawer(null)}

      />


      {parentToDelete && (
        <ConfirmationDialogueBox
          title="Delete Parent?"
          description={`Are you sure you want to delete "${parentToDelete?.name}"?`}
          onConfirm={handleParentDelete}
          onCancel={() => setParentToDelete(null)}
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
