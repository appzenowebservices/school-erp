import React, { useState } from 'react';
import { Calendar, CreditCard, MoreVertical, Receipt, PieChart, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const PaymentCard = ({ payment, isPaid }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const getStatusIcon = () => {
    if (isPaid) return <CheckCircle className="w-5 h-5 text-emerald-500" />;
    const isOverdue = new Date(payment.dueDate) < new Date();
    return isOverdue ? 
      <AlertCircle className="w-5 h-5 text-red-500" /> : 
      <Clock className="w-5 h-5 text-amber-500" />;
  };

  const getStatusColor = () => {
    if (isPaid) return 'bg-emerald-50 border-emerald-200';
    const isOverdue = new Date(payment.dueDate) < new Date();
    return isOverdue ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200';
  };

  return (
    <div className={`bg-white rounded-2xl border-2 ${getStatusColor()} p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <div>
            <h3 className="font-bold text-xl text-gray-800">{payment.course}</h3>
            <p className="text-gray-500 text-sm">{payment.month}</p>
          </div>
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
          
          {showDropdown && (
            <div className="absolute right-0 top-10 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-10 min-w-48">
              <button className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors duration-200">
                <PieChart className="w-4 h-4 text-blue-500" />
                <span className="text-gray-700">View Breakdown</span>
              </button>
              <button className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors duration-200">
                <Receipt className="w-4 h-4 text-green-500" />
                <span className="text-gray-700">View Receipt</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Amount</span>
          <span className="text-2xl font-bold text-gray-900">${payment.amount}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Due Date</span>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-gray-800 font-medium">{payment.dueDate}</span>
          </div>
        </div>

        {isPaid && (
          <>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Paid On</span>
              <span className="text-green-600 font-semibold">{payment.paidOn}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Payment Mode</span>
              <div className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-blue-500" />
                <span className="text-gray-800 font-medium">{payment.mode}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {!isPaid && (
        <button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
          Pay Now
        </button>
      )}
    </div>
  );
};

const PaymentManagement = () => {
  const [activeTab, setActiveTab] = useState('due');

  const duePayments = [
    {
      course: 'UI/UX Design',
      month: 'December 2024',
      amount: 1200,
      dueDate: '2024-12-15'
    },
    {
      course: 'Frontend Development',
      month: 'January 2025',
      amount: 1500,
      dueDate: '2025-01-10'
    },
    {
      course: 'React Masterclass',
      month: 'November 2024',
      amount: 800,
      dueDate: '2024-11-20'
    }
  ];

  const paidPayments = [
    {
      course: 'UI/UX Design',
      month: 'November 2024',
      amount: 1200,
      dueDate: '2024-11-15',
      paidOn: '2024-11-10',
      mode: 'Credit Card'
    },
    {
      course: 'Frontend Development',
      month: 'October 2024',
      amount: 1500,
      dueDate: '2024-10-10',
      paidOn: '2024-10-08',
      mode: 'Bank Transfer'
    },
    {
      course: 'Design Systems',
      month: 'September 2024',
      amount: 900,
      dueDate: '2024-09-20',
      paidOn: '2024-09-18',
      mode: 'PayPal'
    }
  ];

  const currentPayments = activeTab === 'due' ? duePayments : paidPayments;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Payment Management</h1>
          <p className="text-gray-600 text-lg">Track your course payments and manage your billing</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-8 inline-flex">
          <button
            onClick={() => setActiveTab('due')}
            className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
              activeTab === 'due'
                ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg transform scale-105'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            Due Payments
            <span className="ml-2 px-2 py-1 rounded-full text-xs bg-red-100 text-red-600">
              {duePayments.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('paid')}
            className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
              activeTab === 'paid'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg transform scale-105'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            Paid
            <span className="ml-2 px-2 py-1 rounded-full text-xs bg-green-100 text-green-600">
              {paidPayments.length}
            </span>
          </button>
        </div>

        {/* Payment Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentPayments.map((payment, index) => (
            <PaymentCard 
              key={`${payment.course}-${payment.month}`} 
              payment={payment} 
              isPaid={activeTab === 'paid'}
            />
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-blue-100">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800">Total Due</h3>
            </div>
            <p className="text-3xl font-bold text-blue-600">
              ${duePayments.reduce((sum, p) => sum + p.amount, 0)}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-green-100">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800">Total Paid</h3>
            </div>
            <p className="text-3xl font-bold text-green-600">
              ${paidPayments.reduce((sum, p) => sum + p.amount, 0)}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-100">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CreditCard className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-800">This Month</h3>
            </div>
            <p className="text-3xl font-bold text-purple-600">
              ${duePayments.filter(p => p.month.includes('December')).reduce((sum, p) => sum + p.amount, 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentManagement;