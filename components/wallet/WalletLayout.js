import { Card, CardContent } from "../ui/card/card";
import { FaPlus, FaArrowDown, FaArrowUp } from "react-icons/fa";

const Wallet = ({ entity }) => {
  const data = entity || {
    walletBalance: 5000,
    pendingFunds: 200,
    availableFunds: 4800,
    lastTransaction: { type: "Credit", amount: 500, date: new Date() },
    transactions: [
      { type: "Debit", amount: 100, date: new Date("2025-04-15") },
      { type: "Credit", amount: 500, date: new Date("2025-04-14") },
      { type: "Debit", amount: 200, date: new Date("2025-04-12") },
    ],
  };

  return (
    <div className="space-y-8">
      {/* Wallet Overview */}
      <Card className="shadow-md hover:shadow-lg transition-all">
        <CardContent className="p-6 space-y-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">Wallet Overview</p>
            <p className="text-sm text-gray-500">Your available and pending funds</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-lg bg-green-100 text-green-800 border">
              <p className="text-lg font-semibold">Total Balance</p>
              <p className="text-2xl font-bold">₹{data.walletBalance.toLocaleString()}</p>
            </div>

            <div className="p-4 rounded-lg bg-yellow-100 text-yellow-800 border">
              <p className="text-lg font-semibold">Available Funds</p>
              <p className="text-2xl font-bold">₹{data.availableFunds.toLocaleString()}</p>
            </div>

            <div className="p-4 rounded-lg bg-blue-100 text-blue-800 border">
              <p className="text-lg font-semibold">Pending Funds</p>
              <p className="text-2xl font-bold">₹{data.pendingFunds.toLocaleString()}</p>
            </div>
          </div>

          {/* Last Transaction */}
          <div className="p-4 rounded-lg bg-gray-100 text-gray-800 border">
            <p className="text-lg font-semibold">Last Transaction</p>
            <p className="text-sm text-gray-500">Date: {new Date(data.lastTransaction.date).toLocaleDateString()}</p>
            <p className={`text-lg font-bold ${data.lastTransaction.type === "Credit" ? "text-green-600" : "text-red-600"}`}>
              {data.lastTransaction.type}: ₹{data.lastTransaction.amount}
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center mt-4">
            <button className="flex items-center text-white bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-lg">
              <FaPlus className="mr-2" />
              Deposit Funds
            </button>
            <button className="flex items-center text-white bg-green-600 hover:bg-green-700 py-2 px-4 rounded-lg">
              <FaArrowDown className="mr-2" />
              Withdraw Funds
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card className="shadow-md hover:shadow-lg transition-all">
        <CardContent className="p-6 space-y-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">Transaction History</p>
            <p className="text-sm text-gray-500">Recent transactions</p>
          </div>

          {data.transactions.map((transaction, index) => (
            <div key={index} className="flex justify-between items-center p-4 border-b">
              <div>
                <p className="text-lg font-semibold">{transaction.type}</p>
                <p className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
              </div>
              <div className={`font-semibold ${transaction.type === "Credit" ? "text-green-600" : "text-red-600"}`}>
                ₹{transaction.amount.toLocaleString()}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Wallet;
