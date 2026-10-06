import { format } from "date-fns";
import { Card, CardContent } from "../ui/card/card";
import InfoCard from "./InfoCard";
import Documents from "./Documents";
import Performance from "./Performance";

const StatsOverview = ({ entity }) => {
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
      {/* Stats Overview */}
      <Card className="shadow-lg hover:shadow-2xl transition-all">
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          {/* Total Orders */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-lg shadow-lg">
            <p className="text-2xl font-bold">{data.totalOrders}</p>
            <p className="text-sm text-gray-200">Total Orders</p>
            <span className="text-xs text-gray-100 italic">Total number of orders processed</span>
          </div>
          
          {/* Total Revenue */}
          <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-4 rounded-lg shadow-lg">
            <p className="text-2xl font-bold">₹{data.totalRevenue.toLocaleString()}</p>
            <p className="text-sm text-gray-200">Total Revenue</p>
            <span className="text-xs text-gray-100 italic">Total amount earned from orders</span>
          </div>
          
          {/* Pending Orders */}
          <div className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white p-4 rounded-lg shadow-lg">
            <p className="text-2xl font-bold">{data.pendingOrders}</p>
            <p className="text-sm text-gray-200">Pending Orders</p>
            <span className="text-xs text-gray-100 italic">Orders that are yet to be processed</span>
          </div>
          
          {/* Rating */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-4 rounded-lg shadow-lg">
            <p className="text-2xl font-bold">{data.rating}⭐</p>
            <p className="text-sm text-gray-200">{data.reviews} Reviews</p>
            <span className="text-xs text-gray-100 italic">Customer rating and feedback</span>
          </div>
        </CardContent>
      </Card>

    

    </div>
  );
};

export default StatsOverview;
