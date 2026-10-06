import { Card, CardContent } from "../ui/card/card";
import {
  FaFileAlt,
  FaCheckCircle,
  FaExclamationCircle,
  FaTimesCircle,
} from "react-icons/fa";

const Documents = ({ entity }) => {
  const data = entity || {
    name: "Rajesh Kumar",
    role: "Vendor",
    verificationDocs: {
      identity: [
        { name: "Aadhar Card", status: "Verified" },
        { name: "PAN Card", status: "Pending" },
      ],
      bank: [
        { name: "Cancelled Cheque", status: "Verified" },
        { name: "Bank Statement", status: "Pending" },
      ],
      commercial: [
        { name: "Shop License", status: "Rejected" },
        { name: "GST Certificate", status: "Verified" },
      ],
    },
  };

  const renderStatus = (status) => {
    switch (status) {
      case "Verified":
        return (
          <div className="flex items-center space-x-2 text-green-600">
            <FaCheckCircle />
            <span className="font-medium">Verified</span>
          </div>
        );
      case "Pending":
        return (
          <div className="flex items-center space-x-2 text-yellow-600">
            <FaExclamationCircle />
            <button className="text-blue-600 hover:text-blue-700 font-semibold">Upload</button>
          </div>
        );
      case "Rejected":
        return (
          <div className="flex items-center space-x-2 text-red-600">
            <FaTimesCircle />
            <span className="font-medium">Rejected</span>
          </div>
        );
      default:
        return null;
    }
  };

  const renderSection = (title, docs) => (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-700 border-b pb-1">{title}</h3>
      {docs.map((doc, index) => (
        <div key={index} className="flex justify-between items-center p-4 rounded-md bg-gray-50 hover:bg-white border">
          <div className="flex items-center">
            <FaFileAlt className="mr-3 text-gray-600 text-xl" />
            <div>
              <p className="text-md font-medium text-gray-800">{doc.name}</p>
              <p className="text-sm text-gray-500">Status: {doc.status}</p>
            </div>
          </div>
          {renderStatus(doc.status)}
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-8">
      <Card className="shadow-md hover:shadow-lg transition-all">
        <CardContent className="p-6 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">Documents & Verification</h2>
            <p className="text-sm text-gray-500">Manage your KYC, banking, and business verification documents.</p>
          </div>

          <div className="space-y-6">
            {renderSection("Identity Documents", data.verificationDocs.identity)}
            {renderSection("Bank Documents", data.verificationDocs.bank)}
            {renderSection("Commercial Documents", data.verificationDocs.commercial)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Documents;
