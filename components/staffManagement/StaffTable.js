import React, { useState, useMemo, useEffect, useRef } from "react";
import { UserMinus, Shield, FileSignature } from 'lucide-react';
import {
  FaDownload,
  FaFileExcel,
  FaFileCsv,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaPhoneSlash,
  FaPhoneAlt
} from "react-icons/fa";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import { RiAdminFill } from "react-icons/ri";
import ConfirmationDialogueBox from "../ui/status/Confirmation";
import EditClassPermissionsModal from "./EditClassPermissionsModal";
import SignatureUploadModal from "./UploadSignature";
import { editClassPermissionsApi, getPermittedClasses, removeFromClientApi } from "../../api/staff";
import { getCookie } from "cookies-next";

// ============================================================================
const StaffTable = ({
  staffs = [],
  handleClassClick = () => { },
  columns = ['Name', 'Designation', 'Class & Access', 'Contact', 'Action'],
  isLoading,
  setFilters,
  context,
  setIsPermittedClassPermissionUpdated,

  currentPage,
  setCurrentPage,
  totalCount,
  itemsPerPage,
  setRemovedFromClient
}) => {

  // const totalPa'[ges = Math.ceil(totalCount / itemsPerPage);
  // ============================================================================
  const menuItems = [
    {
      label: "Remove From Client",
      icon: UserMinus,
      variant: "danger"
    },
    {
      label: "Edit Class Permissions",
      icon: Shield,
      variant: "default"
    },
    {
      label: "Upload Signature",
      icon: FileSignature,
      variant: "default"
    }
  ];
  // ============================================================================
  // const [currentPage, setCurrentPage] = useState(1);
  const [signatureUrl, setSignatureUrl] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  // const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const [openActionMenu, setOpenActionMenu] = useState(null);
  const [removeFromClient, setRemoveFromClient] = useState(null);
  const [editPermissionStaff, setEditPermissionStaff] = useState(null);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);

  const [userPermittedClassesLoader, setUserPermittedClassesLoader] = useState(false);
  const [userPermittedClasses, setUserPermittedClasses] = useState(null);

  // Ref to detect clicks outside the action menu
  const actionMenuRef = useRef(null);

  const getUserPermittedClasses = async () => {
    if (!selectedStaff?.id) return;
    setUserPermittedClassesLoader(true);
    try {
      const resp = await getPermittedClasses(context?.profileId, context?.session, selectedStaff?.id);
      const fetched = resp?.results?.classes || [];
      // Set the initial selected classes based on the fetched permitted classes
      setSelectedClasses(fetched.filter(cls => cls.is_permitted).map(cls => cls.id));
      setUserPermittedClasses(fetched);
    } catch (err) {
      console.error('Failed to fetch permitted classes:', err);
    } finally {
      setUserPermittedClassesLoader(false);
    }
  };

  useEffect(() => {
    getUserPermittedClasses();
  }, [selectedStaff]);

  // Click outside handler for the action menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target) && openActionMenu !== null) {
        setOpenActionMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openActionMenu]);


  const getInitials = (name) => {
    if (!name) return "";
    const parts = name.split(" ");
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  // Filter and paginate data
  const filteredData = useMemo(() => {
    return staffs?.filter(staff =>
      staff?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff?.designation?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff?.emails?.[0]?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];
  }, [staffs, searchTerm]);

  // Replace the top totalPages line with this:
  const totalPages = totalCount > 0 ? Math.ceil(totalCount / itemsPerPage) : 0;
  // Export functions (kept for completeness, original logic remains)


  const getPortalParams = () => {
    let resolvedGuid = getCookie("guid");
    let resolvedUserId = getCookie("id");


    return {
      client_id: context?.session,
      guid: resolvedGuid,
      logged_in_user_account_id: resolvedUserId,
      user_account_id: context?.profileId,
    };
  };

  // === Function(s) ========================================
  const downloadSoftCopyXls = () => {
    const portal = getPortalParams();


    const url = `https://portal.infoeight.com/users/download-excel`
      + `?client_id=${portal.client_id}`
      + `&guid=${portal.guid}`
      + `&logged_in_user_account_id=${portal.logged_in_user_account_id}`
      + `&user_account_id=${portal.user_account_id}`
      + `&format=SOFT-COPY`;

    window.open(url, "_blank");

    setExportDropdownOpen(false);
  };


  // === Function(s) ========================================
  const downloadSignatureList = () => {
    const portal = getPortalParams();


    const url = `https://portal.infoeight.com/download-staff-signature-list-pdf`
      + `?client_id=${portal.client_id}`
      + `&guid=${portal.guid}`
      + `&logged_in_user_account_id=${portal.logged_in_user_account_id}`
      + `&user_account_id=${portal.user_account_id}`


    window.open(url, "_blank");

    setExportDropdownOpen(false);
  };



  // Simplified and fixed pagination logic
  const getPageNumbers = () => {
    const pages = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push("...");
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  const handleMenuItemClick = (item, staff) => {
    // Close dropdown first
    setOpenActionMenu(null);
    setSelectedStaff(staff);

    switch (item.label) {
      case "Remove From Client":
        setRemoveFromClient(staff);
        break;

      case "Edit Class Permissions":
        setEditPermissionStaff(staff);
        // Getting permitted classes is handled by the useEffect after setSelectedStaff
        break;

      case "Upload Signature":
        setSignatureUrl(staff);
        break;

      default:
        console.log("Unhandled action:", item.label);
    }
  };


  const handleRemoveFromClient = async () => {
    setError(null);
    setSuccess(null);
    if (!removeFromClient) return;

    try {
      const finalPayload = {
        api: "user.removeFromClient",
        user_account_id: context?.profileId,
        client_id: context?.session,
        platform: "web",
        "id": removeFromClient?.id // Use removeFromClient for the ID
      };

      const response = await removeFromClientApi(finalPayload);

      if (response?.success) {
        setSuccess(`Removed ${removeFromClient.full_name} from client successfully.`);
        setRemoveFromClient(null);
        // You might want to refresh the staff list here
      } else {
        setError("Failed to remove from client.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    } finally {
      setRemovedFromClient(prev => !prev)
    }
  };


  const handleUpdatePermittedClassePermissions = async (updatedClasses) => {
    setError(null);
    setSuccess(null);

    try {
      const permittedClassIds = updatedClasses?.map(cls => cls?.id);

      const response = await editClassPermissionsApi(
        context?.profileId,
        context?.session,
        selectedStaff?.id,
        permittedClassIds
      );

      if (response?.success) {
        setSuccess(`Permissions for ${selectedStaff.full_name} updated successfully.`);

        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } else {
        setError("Failed to update class permissions.");

        setTimeout(() => {
          setError(null);
        }, 3000);
      }

    } catch (err) {
      console.error(err);
      setError("Something went wrong during update.");

      setTimeout(() => {
        setError(null);
      }, 3000);

    } finally {
      setUserPermittedClasses(false);
      setIsPermittedClassPermissionUpdated(prev => !prev);
    }
  };


  // ============================================================================ 
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header with Search and Export */}
      <div className="p-4 sm:p-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="text-sm text-gray-600 mt-1">
              Showing **{staffs.length}** of **{filteredData.length}** records
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search by name, designation, or email"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setFilters(prev => ({ ...prev, name: e.target.value }));
                  setCurrentPage(1);
                }}
                className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
              />
            </div>

            {/* Export Dropdown */}
            <div className="relative w-full sm:w-auto">
              <button
                onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
                className="flex items-center justify-center sm:justify-start gap-2 px-4 py-2.5 w-full bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg text-sm"
              >
                <FaDownload className="text-sm" />
                <span className="font-medium">Export</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${exportDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {exportDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setExportDropdownOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden origin-top-right animate-in fade-in zoom-in-95">
                    <button
                      onClick={downloadSoftCopyXls}
                      className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                    >
                      <FaFileCsv className="text-green-600" />
                      <span>Soft Copy(.xls)</span>
                    </button>
                    <button
                      onClick={downloadSignatureList}
                      className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                    >
                      <FaFileExcel className="text-green-700" />
                      <span>Signature List</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table - Added overflow-x-auto to the wrapper */}
      <div className="overflow-x-auto w-full">
        {isLoading ? (
          /* 1. Show only when API is fetching */
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center gap-4">
              <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-gray-500 text-sm font-medium animate-pulse">Fetching staff records...</span>
            </div>
          </div>
        ) : staffs.length === 0 ? (
          /* 2. Show only when loading is finished AND no data returned */
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50">
            <div className="p-4 bg-gray-100 rounded-full mb-4">
              <FaSearch className="text-4xl text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No staff records found</h3>
            <p className="text-gray-500 text-sm max-w-xs text-center mt-1">
              We couldn't find any results matching your current filters or search term.
            </p>
            <button
              onClick={() => {
                setSearchTerm(""); setFilters({
                  modules: [],
                  categories: [],
                  status: []
                });;
              }}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Clear all filters
            </button>
          </div>

        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((head, i) => (
                  <th
                    key={i}
                    className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider last:text-right"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {staffs.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <FaSearch className="text-3xl text-gray-300" />
                      <p className="text-lg font-medium">No staff records found</p>
                      <p className="text-sm">Try adjusting your search criteria</p>
                    </div>
                  </td>
                </tr>
              ) : (
                staffs.map((staff, index) => (
                  <tr
                    key={staff.id || index}
                    className="hover:bg-gray-50 transition-colors group"
                  >
                    {/* Created By - Staff Name/Email */}
                    <td className="whitespace-nowrap px-4 py-4 min-w-[200px]">
                      <div
                        onClick={() => handleClassClick(staff)}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        {staff.image_url ? (
                          <img
                            src={staff.image_url}
                            alt={staff.full_name}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://placehold.co/40x40/E0E0E0/757575?text=${getInitials(staff.full_name)}`;
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm ring-2 ring-gray-100">
                            {getInitials(staff.full_name)}
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {staff.full_name || "N/A"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {staff.emails?.[0]?.email || "No email"}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Designation */}
                    <td className="px-4 py-4 min-w-[150px]">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <RiAdminFill className="text-blue-600 text-sm" />
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {staff.designation?.name || "N/A"}
                        </div>
                      </div>
                    </td>

                    {/* Class & Admin Access */}
                    <td className="px-4 py-4 max-w-xs min-w-[200px]">
                      <div className="text-sm font-semibold text-gray-900 truncate">
                        {staff.class?.name || "N/A Class"}
                      </div>
                      <div className="mt-1">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                              ${staff.designation?.is_allowed_for_admin_access === '1'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                            }`}
                        >
                          {staff.designation?.is_allowed_for_admin_access === '1' ? 'Admin Access' : 'No Access'}
                        </span>
                      </div>
                    </td>
                    {/* Contact (Phone) */}
                    <td className="whitespace-nowrap px-4 py-4 min-w-[160px]">
                      {staff.phones?.[0]?.phone ? (
                        <a
                          href={`tel:${staff.phones[0].phone}`}
                          className="group flex items-center gap-2.5 w-fit"
                        >
                          {/* Icon Container */}
                          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all duration-200">
                            <FaPhoneAlt className="text-[10px]" />
                          </div>

                          {/* Phone Number Text */}
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
                              {staff.phones[0].phone}
                            </span>
                            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">
                              Mobile
                            </span>
                          </div>
                        </a>
                      ) : (
                        <div className="flex items-center gap-2 text-gray-300 italic">
                          <div className="w-8 h-8 rounded-lg border border-dashed border-gray-200 flex items-center justify-center">
                            <FaPhoneSlash className="text-xs" />
                          </div>
                          <span className="text-xs">No contact</span>
                        </div>
                      )}
                    </td>

                    {/* Action Menu (Responsive Positioning) */}
                    <td className="relative whitespace-nowrap px-4 py-4 text-right min-w-[100px]">
                      <div
                        ref={openActionMenu === staff.id ? actionMenuRef : null}
                        className="inline-block"
                      >
                        {/* Trigger Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Toggle the menu for the specific staff member
                            setOpenActionMenu(openActionMenu === staff.id ? null : staff.id);
                          }}
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 ${openActionMenu === staff.id
                            ? "bg-blue-50 text-blue-600 shadow-sm"
                            : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                            }`}
                          aria-haspopup="true"
                          aria-expanded={openActionMenu === staff.id}
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </button>

                        {/* Dropdown Menu */}
                        {openActionMenu === staff.id && (
                          <>
                            {/* Invisible backdrop to capture clicks outside and close menu */}
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setOpenActionMenu(null)}
                            />

                            <div
                              className="
            absolute right-0 mt-2 w-48 
            bg-white border border-slate-200/60 
            rounded-xl shadow-xl z-20 py-1.5 
            origin-top-right animate-in fade-in zoom-in-95 slide-in-from-top-2
            ring-1 ring-black ring-opacity-5
          "
                            >
                              <div className="px-3 py-2 border-b border-gray-50 mb-1">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-left">
                                  Staff Actions
                                </p>
                              </div>

                              {menuItems.map((item, i) => {
                                const Icon = item.icon;
                                const isDanger = item.variant === "danger";

                                return (
                                  <button
                                    key={i}
                                    className={`
                  w-full flex items-center gap-3 px-4 py-2.5 text-sm
                  transition-colors duration-150 group
                  ${isDanger
                                        ? "text-red-600 hover:bg-red-50"
                                        : "text-slate-700 hover:bg-slate-50"
                                      }
                `}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleMenuItemClick(item, staff);
                                      setOpenActionMenu(null); // Auto-close after click
                                    }}
                                  >
                                    <Icon className={`
                  w-4 h-4 transition-transform group-hover:scale-110
                  ${isDanger ? "text-red-500" : "text-slate-400 group-hover:text-blue-500"}
                `} />
                                    <span className="font-medium">{item.label}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 sm:px-6 sm:py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">


            {/* 2. Main Navigation Controls */}
            <div className="flex items-center gap-2">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <FaChevronLeft className="w-4 h-4" />
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {getPageNumbers().map((page, index) => (
                  <button
                    key={index}
                    onClick={() => typeof page === 'number' && setCurrentPage(page)}
                    disabled={page === '...'}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${page === currentPage
                      ? 'bg-blue-600 text-white shadow-md'
                      : page === '...'
                        ? 'text-gray-400 cursor-default'
                        : 'text-gray-600 hover:bg-gray-100 border border-transparent'
                      }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              {/* Next Button */}
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <FaChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* 3. Page Info Display */}
            <div className="text-sm text-gray-600">
              Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages || 1}</span>
            </div>

          </div>
        </div>
      )}


      {/* Modals/Dialogs */}
      {removeFromClient && (
        <ConfirmationDialogueBox
          title="Remove Staff From Client"
          description={`Are you sure you want to remove **${removeFromClient.full_name}**? This action cannot be undone.`}
          onCancel={() => setRemoveFromClient(null)}
          onConfirm={handleRemoveFromClient}
        />
      )}

      {/* Conditional rendering for EditClassPermissionsModal to prevent unnecessary re-renders */}
      {editPermissionStaff && userPermittedClasses ? (
        <EditClassPermissionsModal
          isOpen={!!editPermissionStaff}
          staff={editPermissionStaff}
          permittedClasses={userPermittedClasses}
          classes={[]} // Supply your list of all available classes here
          selectedClasses={selectedClasses}
          onToggleClass={setSelectedClasses} // Simplified setter for selected classes
          onClose={() => setEditPermissionStaff(null)}
          onSave={handleUpdatePermittedClassePermissions}
          isLoading={isLoading}
        />
      ) : null}

      <SignatureUploadModal

        selectedStaff={selectedStaff}
        open={!!signatureUrl}
        onClose={() => {
          setSignatureUrl(false);
          // Using location.reload() to refresh the entire browser page

        }}
      />


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
    </div>
  );
};

export default StaffTable;