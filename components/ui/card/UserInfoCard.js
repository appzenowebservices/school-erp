import React, { useState } from "react";
import clsx from "clsx";
import { IconButton } from "../button/iconButton";
import { MdDeleteForever } from "react-icons/md";
import { AiOutlineEdit } from "react-icons/ai";
import { ImProfile } from "react-icons/im";
import { useRouter } from "next/navigation";
import { IconLabelButton } from "../button/iconLabelButton";
import { FcApprove } from "react-icons/fc";
import ConfirmationDialogueBox from "../status/Confirmation";
import { useConvertLeadToVendor, useLeads } from "../../../controllers/leads";
import SuccessStatus from "../status/Success";
import ErrorStatus from "../status/Error";
import SuccessBadge from "../status/SuccessBadge";
import ErrorBadge from "../status/ErrorBadge";

const StatusBadge = ({ value }) => {
  const statusClass = clsx(
    "inline-block px-3 py-1 text-xs font-medium rounded-full",
    {
      "bg-green-100 text-green-700": value === "Active",
      "bg-yellow-100 text-yellow-700": value === "Pending",
      "bg-red-100 text-red-700": value === "Inactive",
      "bg-gray-200 text-gray-600": !["Active", "Pending", "Inactive"].includes(value),
    }
  );
  return <span className={statusClass}>{value}</span>;
};

const UserInfoCard = ({ name, subtitle, businessName, image, details, selectedLead }) => {
  const { convertLead, error, isSuccess } = useConvertLeadToVendor()
  const { refreshLeads } = useLeads()

  const [confirmDelete, setConfirmDelete] = useState(false)
  const [apiResponse, setApiResponse] = useState(''); // Success pop-up state


  // console.log(' success ,errorMessage', success, errorMessage);

  // const getInitial = (name) => name?.charAt(0)?.toUpperCase() || "?";




  const handleConfirmation = async () => {

    if (!selectedLead) return;
    setConfirmDelete(true)


  };

  const handleLeadConversion = async () => {

    if (!selectedLead) return;

    const { success, successMessage, errorMessage } = await convertLead(selectedLead._id);

    if (success) {
      setConfirmDelete(false)
      setApiResponse(successMessage)
      refreshLeads()
    } else {
      setConfirmDelete(false)
      setApiResponse(errorMessage)
      console.error('Error CONVERTING LEAD:', errorMessage);
    }
  };
  // con
  if (!selectedLead) {
    return (
      <div className="w-full max-w-md mx-auto bg-white rounded-lg p-6 text-center shadow-sm border border-gray-200">
        <p className="text-gray-500 text-sm">No item selected. Please choose a product to preview.</p>
      </div>
    );
  }

  const getInitial = (name) => {
    return name
      ?.split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("") || "?";
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl p-6 shadow border border-gray-200 flex flex-col items-center gap-5">
      {/* Profile Image or Initial */}
      {/* <div className="w-28 h-28 rounded-full overflow-hidden shadow flex items-center justify-center bg-gray-100 text-gray-700 text-4xl font-bold">
        {image ? (
          <img
            src={image}
            alt={name || "Profile"}
            className="w-full h-full object-cover"
          />
        ) : (
          getInitial(name)
        )}
      </div> */}
      <div className="w-28 h-28 rounded-full overflow-hidden shadow flex items-center justify-center bg-gray-100 text-gray-700 text-4xl font-bold">
        {getInitial(name)}
      </div>

      {/* Title & Status */}
      <div className="text-center space-y-1">
        <h2 className="text-xl font-semibold text-gray-800">{name}</h2>
        {businessName ? <p className="text-sm text-gray-500">{businessName}</p> : null}
      </div>
      <StatusBadge value={businessName ? "Vendor" : "Delivery Agent"} />

      {/* Details List */}
      <div className="w-full space-y-4">
        {details?.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center py-2 text-sm border-b border-gray-200 text-gray-700"
          >
            <span className="text-gray-500 font-medium">{item.label}</span>
            <span className="font-semibold text-gray-800">{item.value}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      {/* Actions Section */}
      <div className="w-full mt-2 pt-4 shadow p-2 rounded  border-gray-200 bg-background">
        {/* <h3 className="text-sm font-medium text-gray-600 mb-3 text-center">Actions</h3> */}
        <div className="flex justify-center gap-4">




          <IconLabelButton
            fullwidth='true'
            label="Convert Lead"
            onClick={handleConfirmation} // Navigate on click
            disabled={!selectedLead} // Disable if no product is selected

          >
            <FcApprove size={18} />
          </IconLabelButton>


          {confirmDelete && (
            <ConfirmationDialogueBox
              title="Convert This Lead ?"
              description={`Are you sure you want to make "${selectedLead?.name}" as ${selectedLead?.leadType === "vendor" ? "Vendor" : "Delivery Agent"}?`}
              onConfirm={handleLeadConversion}
              onCancel={() => setConfirmDelete(false)} // Close modal if canceled
            />
          )}

        </div>
      </div>
      {isSuccess && <SuccessBadge message={apiResponse} />}
      {error && <ErrorBadge message={apiResponse} />}

    </div>
  );
};

export default UserInfoCard;
