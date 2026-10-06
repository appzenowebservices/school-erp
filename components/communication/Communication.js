import { Card, CardContent } from "../ui/card/card";
import { FaEnvelope, FaCommentAlt, FaWhatsapp, FaTelegram } from "react-icons/fa";

const Communication = ({ entity }) => {
  const data = entity || {
    emails: [
      { subject: "Order Confirmation", from: "support@infoeight.com", date: new Date(), unread: true },
      { subject: "Invoice #234", from: "billing@infoeight.com", date: new Date(), unread: false },
    ],
    activeChats: [
      { name: "Customer Support", lastMessage: "How can I help you?", unread: true },
      { name: "Vendor Rajesh", lastMessage: "Stock update is pending.", unread: false },
    ],
    status: "Active",
  };

  return (
    <div className="space-y-8">
      {/* Communication Overview */}
      <Card className="shadow-md hover:shadow-lg transition-all">
        <CardContent className="p-6 space-y-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">Communication</p>
            <p className="text-sm text-gray-500">Manage your emails and chat messages</p>
          </div>

          {/* Email Section */}
          <div className="space-y-4">
            <p className="text-lg font-semibold text-gray-800">Emails</p>
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
              {data.emails.map((email, index) => (
                <div key={index} className="flex justify-between items-center p-3 border-b">
                  <div className="flex items-center">
                    <FaEnvelope className="mr-3 text-gray-600" />
                    <div>
                      <p className="text-lg font-semibold">{email.subject}</p>
                      <p className="text-sm text-gray-500">From: {email.from}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {email.unread ? (
                      <span className="text-blue-600">New</span>
                    ) : (
                      <span>{email.date.toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Section */}
          <div className="space-y-4">
            <p className="text-lg font-semibold text-gray-800">Chat</p>
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
              {data.activeChats.map((chat, index) => (
                <div key={index} className="flex justify-between items-center p-3 border-b">
                  <div className="flex items-center">
                    <FaCommentAlt className="mr-3 text-gray-600" />
                    <div>
                      <p className="text-lg font-semibold">{chat.name}</p>
                      <p className="text-sm text-gray-500">{chat.lastMessage}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {chat.unread ? (
                      <span className="text-blue-600">New</span>
                    ) : (
                      <span>{chat.lastMessage.slice(0, 10)}...</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Other Communication Options */}
          <div className="space-y-4">
            <p className="text-lg font-semibold text-gray-800">Other Communication</p>
            <div className="flex space-x-4">
              <button className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-600">
                <FaWhatsapp />
                <span>WhatsApp</span>
              </button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-600">
                <FaTelegram />
                <span>Telegram</span>
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Communication;
