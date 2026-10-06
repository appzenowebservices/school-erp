import { Card, CardContent } from "../ui/card/card";
import { FaUser, FaBell, FaLock, FaCog } from "react-icons/fa";

const Settings = ({ entity }) => {
  const data = entity || {
    profile: {
      name: "Rajesh Kumar",
      email: "rajesh@infoeight.com",
      role: "Vendor",
    },
    notifications: {
      email: true,
      sms: false,
      appAlerts: true,
    },
    privacy: {
      showEmail: true,
      showPhone: false,
    },
    integrations: {
      google: true,
      facebook: false,
    },
  };

  return (
    <div className="space-y-8">
      {/* Settings Overview */}
      <Card className="shadow-md hover:shadow-lg transition-all">
        <CardContent className="p-6 space-y-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">Settings</p>
            <p className="text-sm text-gray-500">Manage your account, notifications, and more</p>
          </div>

          {/* Account Settings */}
          <div className="space-y-4">
            <p className="text-lg font-semibold text-gray-800">Account Settings</p>
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center p-3 border-b">
                <div className="flex items-center">
                  <FaUser className="mr-3 text-gray-600" />
                  <div>
                    <p className="text-lg font-semibold">{data.profile.name}</p>
                    <p className="text-sm text-gray-500">{data.profile.email}</p>
                  </div>
                </div>
                <button className="text-blue-600 hover:underline">Edit</button>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="space-y-4">
            <p className="text-lg font-semibold text-gray-800">Notification Settings</p>
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center p-3 border-b">
                <div className="flex items-center">
                  <FaBell className="mr-3 text-gray-600" />
                  <div>
                    <p className="text-lg font-semibold">Email Notifications</p>
                    <p className="text-sm text-gray-500">Receive notifications via email.</p>
                  </div>
                </div>
                <input type="checkbox" checked={data.notifications.email} className="toggle-checkbox" />
              </div>
              <div className="flex justify-between items-center p-3 border-b">
                <div className="flex items-center">
                  <FaBell className="mr-3 text-gray-600" />
                  <div>
                    <p className="text-lg font-semibold">App Alerts</p>
                    <p className="text-sm text-gray-500">Enable in-app notifications for updates.</p>
                  </div>
                </div>
                <input type="checkbox" checked={data.notifications.appAlerts} className="toggle-checkbox" />
              </div>
              <div className="flex justify-between items-center p-3">
                <div className="flex items-center">
                  <FaBell className="mr-3 text-gray-600" />
                  <div>
                    <p className="text-lg font-semibold">SMS Notifications</p>
                    <p className="text-sm text-gray-500">Receive notifications via SMS.</p>
                  </div>
                </div>
                <input type="checkbox" checked={data.notifications.sms} className="toggle-checkbox" />
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="space-y-4">
            <p className="text-lg font-semibold text-gray-800">Privacy Settings</p>
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center p-3 border-b">
                <div className="flex items-center">
                  <FaLock className="mr-3 text-gray-600" />
                  <div>
                    <p className="text-lg font-semibold">Show Email</p>
                    <p className="text-sm text-gray-500">Decide if your email is visible to others.</p>
                  </div>
                </div>
                <input type="checkbox" checked={data.privacy.showEmail} className="toggle-checkbox" />
              </div>
              <div className="flex justify-between items-center p-3">
                <div className="flex items-center">
                  <FaLock className="mr-3 text-gray-600" />
                  <div>
                    <p className="text-lg font-semibold">Show Phone Number</p>
                    <p className="text-sm text-gray-500">Decide if your phone number is visible to others.</p>
                  </div>
                </div>
                <input type="checkbox" checked={data.privacy.showPhone} className="toggle-checkbox" />
              </div>
            </div>
          </div>

          {/* Integrations Settings */}
          <div className="space-y-4">
            <p className="text-lg font-semibold text-gray-800">Integrations</p>
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center p-3 border-b">
                <div className="flex items-center">
                  <FaCog className="mr-3 text-gray-600" />
                  <div>
                    <p className="text-lg font-semibold">Google Integration</p>
                    <p className="text-sm text-gray-500">Connect with Google services for easy sign-in.</p>
                  </div>
                </div>
                <input type="checkbox" checked={data.integrations.google} className="toggle-checkbox" />
              </div>
              <div className="flex justify-between items-center p-3">
                <div className="flex items-center">
                  <FaCog className="mr-3 text-gray-600" />
                  <div>
                    <p className="text-lg font-semibold">Facebook Integration</p>
                    <p className="text-sm text-gray-500">Connect with Facebook for sharing or login.</p>
                  </div>
                </div>
                <input type="checkbox" checked={data.integrations.facebook} className="toggle-checkbox" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
