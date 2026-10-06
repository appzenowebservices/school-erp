import { format } from "date-fns";
import { Card, CardContent } from "../ui/card/card";
import InfoCard from "./InfoCard";
import Documents from "./Documents";

const Performance = ({ entity }) => {
  const data = entity || {
    name: "Rajesh Kumar",
    role: "Vendor",
    contact: "+91 9876543210",
    email: "rajesh@infoeight.com",
    location: "Patna, Bihar",
    zone: "North-East Zone 3",
    status: "Active",
    registeredAt: new Date(),
    lastLogin: new Date(),
    totalOrders: 234,
    totalRevenue: 98230,
    pendingOrders: 12,
    kycStatus: "Approved",
    assignedBy: "Area Manager Neha Singh",
    rating: 4.3,
    reviews: 58,
    performance: "Above Average",
    verificationDocs: [
      { name: "Aadhar Card", status: "Verified" },
      { name: "PAN Card", status: "Pending" },
    ],
  };

  return (
    <div className="space-y-8">

    


      {/* Performance Card */}
      <Card className="shadow-lg hover:shadow-2xl transition-all">
        <CardContent className="p-6 space-y-4">
          <p className="text-lg font-semibold text-gray-800">Performance</p>
          <div className={`p-4 rounded-lg ${data.performance === "Above Average" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"} border`}>
            <p className="text-xl font-bold">{data.performance}</p>
            <p className="text-sm text-gray-500">Your performance is currently evaluated as {data.performance}.</p>
          </div>
        </CardContent>
      </Card>


  

    </div>
  );
};

export default Performance;
