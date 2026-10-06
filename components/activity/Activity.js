import { Card, CardContent } from "../ui/card/card";
import { FaBox, FaBell, FaCommentAlt } from "react-icons/fa";

const Activity = ({ entity }) => {
  const data = entity || {
    activities: [
      { type: "Order", title: "Order #12345 placed", timestamp: new Date("2025-04-15T14:30:00") },
      { type: "Message", title: "New message from Neha Singh", timestamp: new Date("2025-04-14T18:45:00") },
      { type: "Notification", title: "Order #12345 shipped", timestamp: new Date("2025-04-14T12:20:00") },
      { type: "Order", title: "Order #12346 placed", timestamp: new Date("2025-04-13T10:00:00") },
    ],
  };

  return (
    <div className="space-y-8">
      {/* Activity Overview */}
      <Card className="shadow-md hover:shadow-lg transition-all">
        <CardContent className="p-6 space-y-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">Recent Activity</p>
            <p className="text-sm text-gray-500">Your recent orders, messages, and notifications</p>
          </div>

          <div className="space-y-4">
            {data.activities.map((activity, index) => (
              <div key={index} className="flex justify-between items-center p-4 border-b">
                <div className="flex items-center">
                  {activity.type === "Order" && <FaBox className="mr-3 text-blue-600" />}
                  {activity.type === "Message" && <FaCommentAlt className="mr-3 text-green-600" />}
                  {activity.type === "Notification" && <FaBell className="mr-3 text-yellow-600" />}
                  <div>
                    <p className="text-lg font-semibold">{activity.title}</p>
                    <p className="text-sm text-gray-500">{new Date(activity.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Activity Filters */}
          <div className="flex justify-between items-center mt-4">
            <button className="text-blue-600 hover:text-blue-700 font-semibold">Filter by Orders</button>
            <button className="text-blue-600 hover:text-blue-700 font-semibold">Filter by Messages</button>
            <button className="text-blue-600 hover:text-blue-700 font-semibold">Filter by Notifications</button>
          </div>
        </CardContent>
      </Card>

      {/* Clear All Button */}
      <div className="text-center mt-4">
        <button className="text-red-600 hover:text-red-700 font-semibold">Clear All Activity</button>
      </div>
    </div>
  );
};

export default Activity;
