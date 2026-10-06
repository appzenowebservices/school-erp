import { Card, CardContent } from "../ui/card/card";
import { FaUpload, FaEye } from "react-icons/fa"; // For upload and preview icons

const Documents = ({ entity }) => {
  const data = entity || {
    kycStatus: "Pending",
    verificationDocs: [
      { name: "Aadhar Card", status: "Pending", file: null },
      { name: "PAN Card", status: "Verified", file: "pan_card_url" },
    ],
  };

  return (
    <div className="space-y-6">
      {/* KYC Status */}
      <Card className="shadow-md hover:shadow-lg transition-all">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <span className="text-xl font-medium text-gray-800">KYC Status</span>
            <span className={`text-lg font-semibold ${data.kycStatus === "Approved" ? "text-green-600" : "text-red-600"}`}>
              {data.kycStatus}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {data.kycStatus === "Approved" ? "Your KYC is successfully approved." : "Your KYC is still pending."}
          </p>
        </CardContent>
      </Card>

      {/* Documents Status */}
      {data.verificationDocs.map((doc, index) => (
        <Card key={index} className="shadow-md hover:shadow-lg transition-all">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium text-gray-800">{doc.name}</span>
              <span className={`text-lg font-semibold ${doc.status === "Verified" ? "text-green-600" : "text-red-600"}`}>
                {doc.status}
              </span>
            </div>

            {/* Show status and options */}
            <div className="flex justify-between items-center mt-2">
              {doc.status === "Verified" ? (
                <>
                  <button
                    className="flex items-center text-sm text-blue-600 hover:underline"
                    onClick={() => alert(`Previewing ${doc.name}`)}
                  >
                    <FaEye className="mr-2" />
                    Preview
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="flex items-center text-sm text-blue-600 hover:underline"
                    onClick={() => alert(`Uploading ${doc.name}`)}
                  >
                    <FaUpload className="mr-2" />
                    Upload
                  </button>
                </>
              )}
            </div>

            {/* Additional explanation text */}
            <p className="text-sm text-gray-500 mt-1">
              {doc.status === "Verified" ? "This document is successfully verified." : "Please upload the document to verify."}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Documents;
