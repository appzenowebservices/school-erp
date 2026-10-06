'use client'
import React from 'react';
import { Users, Bell, FileText } from 'lucide-react';
// ===========================================
const QuickActions = () => {
  const stats = {
    totalStudents: 1250,
    totalCollected: 18750000,
    pendingAmount: 3250000,
    defaultersCount: 45,
    paidPercentage: 85,
    pendingPercentage: 12,
    overduePercentage: 3
  };
  // ===========================================
  return (
    <div className=" bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Send Reminders</h3>
            <Bell className="w-6 h-6 opacity-80" />
          </div>
          <p className="text-blue-100 text-sm mb-4">
            Send payment reminders to {stats.defaultersCount} defaulters
          </p>
          <button className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
            Send Now
          </button>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Generate Reports</h3>
            <FileText className="w-6 h-6 opacity-80" />
          </div>
          <p className="text-green-100 text-sm mb-4">
            Download detailed fee collection reports
          </p>
          <button className="bg-white text-green-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors">
            Generate
          </button>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Bulk Actions</h3>
            <Users className="w-6 h-6 opacity-80" />
          </div>
          <p className="text-purple-100 text-sm mb-4">
            Perform bulk operations on selected students
          </p>
          <button className="bg-white text-purple-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-50 transition-colors">
            Manage
          </button>
        </div>
      </div>
    </div>
  );
};
// ===========================================

export default QuickActions;