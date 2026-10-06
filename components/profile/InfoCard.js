import { format } from "date-fns";
import { HiOutlineLocationMarker, HiOutlinePhone, HiOutlineMail } from "react-icons/hi";
import { FiUser } from "react-icons/fi";

const InfoCard = ({ data, onStatusClick, onDocumentsClick }) => {
  if (!data) return null;

  return (
    <div className="w-full bg-white border rounded-2xl shadow-md p-6 flex flex-col lg:flex-row justify-between gap-6 hover:shadow-lg transition-all">
      {/* Left Section */}
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-2 text-xl sm:text-2xl font-semibold text-gray-800">
          <FiUser className="text-gray-500" />
          <span>{data.name}</span>
        </div>

        <p className="text-gray-500 capitalize text-sm sm:text-base">{data.role}</p>

        <div className="flex items-start gap-2 text-sm sm:text-base text-gray-700">
          <HiOutlineLocationMarker className="mt-0.5 text-gray-400" />
          <span>{data.location} • {data.zone}</span>
        </div>

        <div className="flex items-start gap-2 text-sm sm:text-base text-gray-700">
          <HiOutlinePhone className="mt-0.5 text-gray-400" />
          <span>{data.contact}</span>
        </div>

        <div className="flex items-start gap-2 text-sm sm:text-base text-gray-700 break-all">
          <HiOutlineMail className="mt-0.5 text-gray-400" />
          <span>{data.email}</span>
        </div>
      </div>

      {/* Divider for mobile */}
      <div className="block lg:hidden border-t border-gray-200 my-2"></div>

      {/* Right Section */}
      <div className="flex-1 space-y-2 text-sm sm:text-base text-gray-600 lg:text-right">
        {/* Status Field - Clickable */}
        <p>
          <span className="font-medium text-gray-800">Status:</span>{" "}
          <button
            className="text-blue-600 hover:text-blue-800 underline"
            onClick={onStatusClick}
          >
            {data.status}
          </button>
        </p>

        {/* Registered Date */}
        <p>
          <span className="font-medium text-gray-800">Registered:</span>{" "}
          {format(new Date(data.registeredAt), "dd MMM yyyy")}
        </p>

        {/* Last Login */}
        <p>
          <span className="font-medium text-gray-800">Last Login:</span>{" "}
          {format(new Date(data.lastLogin), "dd MMM yyyy, HH:mm")}
        </p>

        {/* KYC Status */}
        <p>
          <span className="font-medium text-gray-800">KYC:</span>{" "}
          {data.kycStatus}
        </p>

        {/* Assigned By */}
        <p>
          <span className="font-medium text-gray-800">Assigned By:</span> {data.assignedBy}
        </p>

        {/* Documents Field - Clickable */}
        <p>
          <span className="font-medium text-gray-800">Documents:</span>{" "}
          <button
            className="text-blue-600 hover:text-blue-800 underline"
            onClick={onDocumentsClick}
          >
            View Documents
          </button>
        </p>
      </div>
    </div>
  );
};

export default InfoCard;
