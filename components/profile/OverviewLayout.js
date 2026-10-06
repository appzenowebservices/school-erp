import { format } from "date-fns";
import { Card, CardContent } from "../ui/card/card";
import InfoCard from "./InfoCard";
import StatsOverview from "./StatsOverview";
import Performance from "./Performance";
import Documents from "./Documents";

const OverviewLayout = ({ entity }) => {
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
    <div className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoCard data={data} />
        </CardContent>
      </Card>
      <StatsOverview data={data} />
      <Performance />
      <Documents />

    </div>
  );
};

export default OverviewLayout;
