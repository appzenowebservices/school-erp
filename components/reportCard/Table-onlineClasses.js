import React from "react";
import { FaBook, FaExternalLinkAlt } from "react-icons/fa"; // Icon for external link

const OnlineClassesTable = ({
  onlineClasses = [], // Renamed from 'orders' to 'onlineClasses'
  handleClassClick = () => { }, // Renamed from 'handleOrderClick'
  columns = ['Created By', 'Subject', 'Title & Description', 'Timings', 'Info', 'Start/join', 'Action'],
}) => {

  // Helper to format date and time for display
  function formatDateTime(dateStr, timeStr) {
    if (!dateStr || !timeStr) return "N/A";

    try {
      // Combine date and time to create a full datetime string
      const dateTimeString = `${dateStr}T${timeStr.split(' ')[0]}:00Z`; // Assuming time is like "HH:MM AM/PM IST"
      const date = new Date(dateTimeString);

      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return "Invalid Date/Time";
      }

      const day = date.getDate();
      const month = date.toLocaleString("en-US", { month: "short" }).toLowerCase();
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");

      return `${day}${getDaySuffix(day)} ${month}, ${year} @ ${hours}:${minutes}`;
    } catch (error) {
      console.error("Error formatting date/time:", error);
      return "N/A";
    }
  }

  // Helper to get day suffix (st, nd, rd, th)
  function getDaySuffix(day) {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }
  const getInitials = (name) => {
    if (!name) return "";
    const parts = name.split(" ");
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };
  return (
    <div className="md:col-span-6 bg-white rounded-xl shadow-md">
      <div className="w-[360px] sm:w-full md:w-[700px] lg:w-full overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((head, i) => (
                <th
                  key={i}
                  className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {onlineClasses.map((onlineClass) => (
              <tr
                key={onlineClass._id}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => handleClassClick(onlineClass)}
              >
                {/* Created By */}
                <td className="whitespace-nowrap px-4 py-4">
                  <div className="flex flex-col items-center">
                    {onlineClass.creatorImage ? (
                      <img
                        src={onlineClass.creatorImage}
                        alt={onlineClass.createdBy}
                        className="w-10 h-10 rounded-full object-cover mb-1"
                        onError={(e) => {
                          e.target.onerror = null; // Prevent infinite loop on broken image
                          e.target.src = `https://placehold.co/40x40/E0E0E0/757575?text=${getInitials(onlineClass.createdBy)}`; // Fallback to a generic placeholder with initials
                        }}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm mb-1">
                        {getInitials(onlineClass.createdBy)}
                      </div>
                    )}
                    <div className="text-sm text-gray-900 font-medium">
                      {onlineClass.createdBy || "N/A"}
                    </div>
                  </div>
                </td>
                {/* Subject */}
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-3"> {/* Changed to flex-row and added spacing */}


                    <div className="flex items-center text-sm text-gray-700 font-medium">
                      {/* Icon next to the subject name, styled in monochrome gray */}
                      <FaBook className="mr-1 text-gray-500" /> {/* Example icon, replace with your choice */}
                      {onlineClass.subject || "N/A"}
                    </div>
                  </div>
                </td>

                {/* Title & Description */}
                <td className="px-4 py-4">
                  <div className="text-sm font-semibold text-gray-900">
                    {onlineClass.titleDescription?.title || "N/A"}
                  </div>
                  <div className="text-xs text-gray-500 line-clamp-2">
                    {onlineClass.titleDescription?.description || "No description"}
                  </div>
                </td>

                {/* Timings */}
                <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
                  <div className="font-medium">
                    {onlineClass.timings?.date ? formatDateTime(onlineClass.timings.date, onlineClass.timings.time) : "N/A"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {onlineClass.timings?.time || "N/A"}
                  </div>
                </td>

                {/* Info (Duration & Platform) */}
                <td className="whitespace-nowrap px-4 py-4 text-xs text-gray-700">
                  <div>Duration: {onlineClass.info?.duration || "N/A"}</div>
                  <div>Platform: {onlineClass.info?.platform || "N/A"}</div>
                </td>

                {/* Start/Join Link */}
                <td className="whitespace-nowrap px-4 py-4">
                  {onlineClass.startJoinLink ? (
                    <a
                      href={onlineClass.startJoinLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center
                 bg-blue-600 text-white text-sm font-semibold
                 py-2 px-4 rounded-lg shadow-md
                 hover:bg-blue-700 hover:shadow-lg
                 transition-all duration-200 ease-in-out
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      onClick={(e) => e.stopPropagation()} // Prevent row click from firing
                      title="Click to join the online class"
                    >
                      Join Class <FaExternalLinkAlt className="ml-2 text-xs" /> {/* Adjusted margin for better spacing */}
                    </a>
                  ) : (
                    <span
                      className="inline-flex items-center justify-center
                 bg-gray-100 text-gray-500 text-sm font-medium
                 py-2 px-4 rounded-lg cursor-not-allowed
                 shadow-sm"
                      title="No join link available for this class"
                    >
                      No Link
                    </span>
                  )}
                </td>

                {/* Action */}
                <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
                  <button
                    className="
                  px-3 py-1 
                  rounded-md 
                  bg-indigo-500 
                  text-white 
                  text-xs 
                  hover:bg-indigo-600 
                  transition-colors"
                  >
                    {onlineClass.action === "view_details" && "Details"}
                    {onlineClass.action === "edit_class" && "Edit"}
                    {onlineClass.action === "manage_class" && "Manage"}
                    {onlineClass.action === "view_recording" && "Recording"}
                    {!onlineClass.action && "Action"}
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OnlineClassesTable;
