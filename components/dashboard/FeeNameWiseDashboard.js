'use client'
import { Activity, Banknote, BarChart3, ChevronDown, CreditCard, DollarSign, FileText, Landmark, PieChartIcon, TrendingUp } from "lucide-react";
import React, { useEffect, useState } from "react";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
  RadialBarChart,
  RadialBar,
} from "recharts";
import { getFeeNameWiseSummary } from "../../api/fees";
import { getSessionCache } from "../../utils/sessionCache";

const FeeNameWiseDashboard = ({  }) => {


    const feeConfig = getSessionCache("feeConfig");
  
  const [expandedSections, setExpandedSections] = useState({});
  // const [feeNameWise, setFeeNameWise] = useState(feeConfig);
  const [isLoading, setIsLoading] = useState(true);
  const [activeChart, setActiveChart] = useState("overview");

  // Mock data for demonstration - replace with your API call
  



  const toggleSection = (name) => {
    setExpandedSections((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatShortCurrency = (amount) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount}`;
  };

  const getPaymentIcon = (mode) => {
    switch (mode.toLowerCase()) {
      case "cash":
        return <Banknote className="w-4 h-4" />;
      case "online":
      case "upi":
        return <CreditCard className="w-4 h-4" />;
      case "cheque":
        return <FileText className="w-4 h-4" />;
      case "bank":
        return <Landmark className="w-4 h-4" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  if (!feeConfig) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  const results = feeConfig;

  // Prepare chart data
  const paymentModeData = [
    { name: "Cash", value: results.cash_amount, color: "#10b981" },
    { name: "Online", value: results.online_amount, color: "#8b5cf6" },
    { name: "Balance", value: results.balance_amount, color: "#f59e0b" },
  ];

  const feeTypeData = results.fee_name_data?.map((fee) => ({
    name: fee.name,
    expected: fee.quarter_wise_expected_amount,
    collected: fee.quarter_wise_expected_amount - fee.quarter_wise_balance_amount,
    balance: fee.quarter_wise_balance_amount,
  }));

  const collectionTrendData = results.fee_name_data?.map((fee) => ({
    name: fee.name,
    Cash: fee.cash_amount,
    Online: fee.online_amount,
    Cheque: fee.cheque_amount,
  }));

  const collectionRateData = results.fee_name_data?.map((fee) => ({
    name: fee.name,
    rate: ((fee.quarter_wise_expected_amount - fee.quarter_wise_balance_amount) / fee.quarter_wise_expected_amount * 100),
  }));

  const COLORS = ["#10b981", "#8b5cf6", "#f59e0b", "#3b82f6", "#ef4444"];

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 to-slate-100 p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {results.client?.name || "Fee Collection Dashboard"}
            </h1>
            <p className="text-slate-600 mt-1">Real-time analytics and insights</p>
          </div>
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
            <Activity className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      {/* KPI Cards with Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <TrendingUp className="w-6 h-6 text-blue-500" />
            <span className="text-sm text-slate-500">Total Expected</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{formatCurrency(results.expected_amount)}</div>
          <div className="text-sm text-slate-600 mt-1">{results.expected_frequency} students</div>
          <div className="mt-3 bg-slate-100 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: "100%" }}></div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <DollarSign className="w-6 h-6 text-orange-500" />
            <span className="text-sm text-slate-500">Pending</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{formatCurrency(results.balance_amount)}</div>
          <div className="text-sm text-slate-600 mt-1">{results.balance_frequency} students</div>
          <div className="mt-3 bg-slate-100 rounded-full h-2">
            <div
              className="bg-orange-500 h-2 rounded-full"
              style={{ width: `${(results.balance_amount / results.expected_amount) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <Banknote className="w-6 h-6 text-green-500" />
            <span className="text-sm text-slate-500">Cash</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{formatCurrency(results.cash_amount)}</div>
          <div className="text-sm text-slate-600 mt-1">{results.cash_frequency} payments</div>
          <div className="mt-3 bg-slate-100 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{ width: `${(results.cash_amount / results.expected_amount) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <CreditCard className="w-6 h-6 text-purple-500" />
            <span className="text-sm text-slate-500">Online</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{formatCurrency(results.online_amount)}</div>
          <div className="text-sm text-slate-600 mt-1">{results.online_frequency} payments</div>
          <div className="mt-3 bg-slate-100 rounded-full h-2">
            <div
              className="bg-purple-500 h-2 rounded-full"
              style={{ width: `${(results.online_amount / results.expected_amount) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Distribution Pie Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-blue-600" />
              Payment Distribution
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentModeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {paymentModeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Collection Rate Gauge */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Collection Rate
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="30%"
              outerRadius="90%"
              data={[{
                name: 'Collected',
                value: ((results.expected_amount - results.balance_amount) / results.expected_amount * 100),
                fill: '#10b981'
              }]}
              startAngle={180}
              endAngle={0}
            >
              <RadialBar
                minAngle={15}
                background
                clockWise
                dataKey="value"
              />
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-3xl font-bold fill-slate-900">
                {((results.expected_amount - results.balance_amount) / results.expected_amount * 100).toFixed(1)}%
              </text>
              <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" className="text-sm fill-slate-500">
                Collection Rate
              </text>
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Fee Type Comparison */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Fee Type Analysis
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveChart("overview")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeChart === "overview"
                  ? "bg-blue-500 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveChart("modes")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeChart === "modes"
                  ? "bg-blue-500 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
            >
              Payment Modes
            </button>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={350}>
          {activeChart === "overview" ? (
            <BarChart data={feeTypeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" tickFormatter={formatShortCurrency} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="collected" fill="#10b981" name="Collected" radius={[8, 8, 0, 0]} />
              <Bar dataKey="balance" fill="#f59e0b" name="Balance" radius={[8, 8, 0, 0]} />
            </BarChart>
          ) : (
            <BarChart data={collectionTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" tickFormatter={formatShortCurrency} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="Cash" fill="#10b981" radius={[8, 8, 0, 0]} />
              <Bar dataKey="Online" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="Cheque" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Payment Modes Summary */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-blue-600" />
          Payment Modes
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(results.payment_modes || {}).map(([mode, active]) => (
            <div
              key={mode}
              className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${active
                  ? "border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100 shadow-md"
                  : "border-slate-200 bg-slate-50 opacity-50"
                }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {getPaymentIcon(mode)}
                <span className="text-sm font-semibold text-slate-700">{mode}</span>
              </div>
              <div className={`text-xs font-medium ${active ? "text-green-600" : "text-slate-400"}`}>
                {active ? "● Active" : "○ Inactive"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fee Details with Enhanced Interaction */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Detailed Fee Collections
          </h2>
        </div>

        <div className="divide-y divide-slate-200">
          {results.fee_name_data?.map((feeGroup, idx) => {
            const collectionRate = ((feeGroup.quarter_wise_expected_amount - feeGroup.quarter_wise_balance_amount) / feeGroup.quarter_wise_expected_amount * 100);

            return (
              <div key={idx} className="transition-all hover:bg-slate-50">
                <div
                  className="p-6 cursor-pointer"
                  onClick={() => toggleSection(feeGroup.name)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-md">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{feeGroup.name}</h3>
                        <p className="text-sm text-slate-500">
                          {feeGroup.quarter_wise_expected_students} students • {collectionRate.toFixed(1)}% collected
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-xl font-bold text-slate-900">
                          {formatCurrency(feeGroup.quarter_wise_expected_amount)}
                        </div>
                        <div className="text-sm text-orange-600 font-medium">
                          ₹{formatShortCurrency(feeGroup.quarter_wise_balance_amount)} pending
                        </div>
                      </div>
                      <div className={`p-2 rounded-lg transition-transform ${expandedSections[feeGroup.name] ? "rotate-180 bg-blue-100" : "bg-slate-100"}`}>
                        <ChevronDown className="w-5 h-5 text-slate-600" />
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="bg-slate-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${collectionRate}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Payment Summary Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                      <div className="text-xs text-slate-600 mb-1 font-medium">Cash</div>
                      <div className="font-bold text-green-700">{formatCurrency(feeGroup.cash_amount)}</div>
                      <div className="text-xs text-slate-500 mt-1">
                        {feeGroup.quarter_wise_cash_students} students
                      </div>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                      <div className="text-xs text-slate-600 mb-1 font-medium">Online</div>
                      <div className="font-bold text-purple-700">{formatCurrency(feeGroup.online_amount)}</div>
                      <div className="text-xs text-slate-500 mt-1">
                        {feeGroup.quarter_wise_online_students} students
                      </div>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                      <div className="text-xs text-slate-600 mb-1 font-medium">Cheque</div>
                      <div className="font-bold text-blue-700">{formatCurrency(feeGroup.cheque_amount)}</div>
                      <div className="text-xs text-slate-500 mt-1">
                        {feeGroup.quarter_wise_cheque_students} students
                      </div>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                      <div className="text-xs text-slate-600 mb-1 font-medium">Balance</div>
                      <div className="font-bold text-orange-700">{formatCurrency(feeGroup.quarter_wise_balance_amount)}</div>
                      <div className="text-xs text-slate-500 mt-1">
                        {feeGroup.quarter_wise_balance_students} students
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expandable Details */}
                {expandedSections[feeGroup.name] && (
                  <div className="px-6 pb-6 bg-gradient-to-br from-slate-50 to-white">
                    <div className="space-y-3">
                      {feeGroup.fee_data?.map((fee, feeIdx) => (
                        <div
                          key={feeIdx}
                          className="bg-white rounded-xl p-4 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="font-semibold text-slate-900">{fee.fee.name}</div>
                              <div className="text-sm text-slate-600 mt-1">
                                {fee.fee.standard.name} • Fee: {formatCurrency(fee.fee.amount)}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-slate-900">{formatCurrency(fee.expected_amount)}</div>
                              <div className="text-xs text-slate-500">{fee.number_of_students} students</div>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                            {[
                              { label: "Cash", data: fee.cash_data, color: "green" },
                              { label: "Online", data: fee.online_data, color: "purple" },
                              { label: "Cheque", data: fee.cheque_data, color: "blue" },
                              { label: "Card", data: fee.card_data, color: "yellow" },
                              { label: "Bank", data: fee.bank_data, color: "indigo" },
                              { label: "Balance", amount: fee.balance_amount, students: fee.balance_number_of_students, color: "orange" },
                            ].map((item, i) => (
                              <div key={i} className={`text-center p-2 bg-${item.color}-50 rounded-lg border border-${item.color}-100 hover:shadow-sm transition-shadow`}>
                                <div className="text-xs text-slate-600 font-medium">{item.label}</div>
                                <div className={`font-semibold text-sm text-${item.color}-700`}>
                                  {formatShortCurrency(item.data?.total_amount || item.amount || 0)}
                                </div>
                                <div className="text-xs text-slate-500">
                                  {item.data?.number_of_students || item.students || 0}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FeeNameWiseDashboard;