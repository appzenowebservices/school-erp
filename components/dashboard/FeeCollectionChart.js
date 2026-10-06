import React, { useEffect, useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getFeeCollectionSummary } from '../../api/fees';
import { getSessionCache } from '../../utils/sessionCache';
import Loader from '../ui/status/Loader';
import ChartLoadingSkeleton from '../ui/status/ChartLoadingSkeleton';

const FeeCollectionChart = () => {



  const feeCollectionConfig = getSessionCache("feeCollectionConfig");




  const [selectedView, setSelectedView] = useState('overview');
  // const [feeCollectionSummary, setFeeCollectionSummary] = useState(feeCollectionConfig);






  // if (!feeCollectionSummary?.success) return <Loader/>


  // ==================================================================================================


  
  // ==================================================================================================
  
  
  console.log("data ========>", feeCollectionConfig);
  const data = feeCollectionConfig
  // Payment modes data for pie chart
  const paymentModesData = [
    { name: 'Cash', value: data?.cash_amount, frequency: data?.cash_frequency },
    { name: 'Online', value: data?.online_amount, frequency: data?.online_frequency },
    { name: 'Cheque', value: data?.cheque_amount || 0, frequency: data?.cheque_frequency || 0 },
    { name: 'Card', value: data?.card_amount || 0, frequency: data?.card_frequency || 0 }
  ].filter(item => item.value > 0);

  // Standard-wise collection data
  const standardCollectionData = data?.standard_data?.map(std => ({
    name: std.standard.name,
    expected: std.expected_amount,
    collected: std.expected_amount - std.balance_amount,
    balance: std.balance_amount
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const collectionRate = ((data?.expected_amount - data?.balance_amount) / data?.expected_amount * 100).toFixed(2);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}

      {/* {feeCollectionSummary?.standard_data?.length > 0 ?
        : (

          <LoaderWIthoutBgBlurr />

        )} */}

      {feeCollectionConfig?.standard_data?.length > 0 ?
        <>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Fee Collection Dashboard
            </h1>
            <p className="text-gray-600">{data?.client?.name}</p>
          </div>


          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-sm text-gray-500 mb-1">Total Expected</div>
              <div className="text-2xl font-bold text-blue-600">₹{data?.expected_amount?.toLocaleString()}</div>
              <div className="text-xs text-gray-400 mt-1">{data?.expected_frequency} students</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-sm text-gray-500 mb-1">Total Collected</div>
              <div className="text-2xl font-bold text-green-600">
                ₹{(data?.expected_amount - data?.balance_amount).toLocaleString()}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {data?.expected_frequency - data?.balance_frequency} payments
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-sm text-gray-500 mb-1">Balance Due</div>
              <div className="text-2xl font-bold text-orange-600">₹{data?.balance_amount?.toLocaleString()}</div>
              <div className="text-xs text-gray-400 mt-1">{data?.balance_frequency} pending</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-sm text-gray-500 mb-1">Collection Rate</div>
              <div className="text-2xl font-bold text-purple-600">{collectionRate}%</div>
              <div className="text-xs text-gray-400 mt-1">Overall performance</div>
            </div>
          </div>

          {/* View Toggle */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedView('overview')}
                className={`px-4 py-2 rounded-lg transition ${selectedView === 'overview'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                Overview
              </button>
              <button
                onClick={() => setSelectedView('standards')}
                className={`px-4 py-2 rounded-lg transition ${selectedView === 'standards'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                By Standards
              </button>
              <button
                onClick={() => setSelectedView('payment')}
                className={`px-4 py-2 rounded-lg transition ${selectedView === 'payment'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                Payment Modes
              </button>
            </div>
          </div>

          {/* Charts Section */}
          {selectedView === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Standard-wise Bar Chart */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Collection by Standard
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={standardCollectionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                    <Legend />
                    <Bar dataKey="collected" fill="#10b981" name="Collected" />
                    <Bar dataKey="balance" fill="#f59e0b" name="Balance" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Payment Modes Pie Chart */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Payment Modes Distribution
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={paymentModesData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {paymentModesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `₹${value}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {selectedView === 'standards' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Detailed Standard-wise Analysis
              </h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={standardCollectionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                  <Legend />
                  <Bar dataKey="expected" fill="#3b82f6" name="Expected Amount" />
                  <Bar dataKey="collected" fill="#10b981" name="Collected Amount" />
                  <Bar dataKey="balance" fill="#ef4444" name="Balance Amount" />
                </BarChart>
              </ResponsiveContainer>

              {/* Standards Table */}
              <div className="mt-6 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Standard
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Expected
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Collected
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Balance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Collection %
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data?.standard_data.map((std, idx) => {
                      const collected = std.expected_amount - std.balance_amount;
                      const collectionPercent = ((collected / std.expected_amount) * 100).toFixed(2);
                      return (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                            {std.standard.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                            ₹{std.expected_amount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-green-600 font-semibold">
                            ₹{collected.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-orange-600">
                            ₹{std.balance_amount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${parseFloat(collectionPercent) > 50
                              ? 'bg-green-100 text-green-800'
                              : parseFloat(collectionPercent) > 0
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                              }`}>
                              {collectionPercent}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {selectedView === 'payment' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Payment Modes Breakdown
                </h2>
                <div className="space-y-4">
                  {paymentModesData.map((mode, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                        />
                        <span className="font-medium text-gray-700">{mode.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">₹{mode.value.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">{mode.frequency} transactions</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Visual Distribution
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={paymentModesData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ₹${value}`}
                    >
                      {paymentModesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `₹${value}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </>
        : (

          <ChartLoadingSkeleton />

        )}

    </div>
  );
};

export default FeeCollectionChart;