'use client'
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ChevronLeft, ChevronRight, CircleDot, XCircle, CheckCircle, Info, AlertTriangle, CheckCheck } from 'lucide-react';
import Layout from '../../../layouts/Layout';

const App = () => {
  // Simulate attendance data for July 2025
  const [attendanceData, setAttendanceData] = useState({
    // Present
    '2025-07-01': 'present',
    '2025-07-02': 'present',
    '2025-07-03': 'present',
    '2025-07-04': 'present',
    '2025-07-05': 'present',
    // Absent
    '2025-07-06': 'absent', // Saturday
    '2025-07-07': 'absent', // Sunday
    '2025-07-13': 'absent', // Saturday
    '2025-07-14': 'absent', // Sunday
    '2025-07-20': 'absent', // Saturday
    '2025-07-21': 'absent', // Sunday
    '2025-07-27': 'absent', // Saturday
    '2025-07-28': 'absent', // Sunday
    // Holiday (can overlap with absent or be separate)
    '2025-07-10': 'holiday',
    '2025-07-25': 'holiday',
    // Issue Raised
    '2025-07-08': 'issue-raised',
    // Issue Resolved
    '2025-07-09': 'issue-resolved',
    // Not Taken (default for other dates)
  });

  const currentMonth = 6; // July (0-indexed)
  const currentYear = 2025;
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 for Sunday, 1 for Monday...

  const getDayStatus = (day) => {
    const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return attendanceData[dateKey] || 'not-taken'; // Default to 'not-taken' if no specific status
  };

  const getDayClasses = (day) => {
    const status = getDayStatus(day);
    let classes = 'w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium cursor-pointer transition-all duration-200 ease-in-out';

    switch (status) {
      case 'present':
        classes += ' bg-green-100 text-green-800 border-2 border-green-500 hover:bg-green-200';
        break;
      case 'absent':
        classes += ' bg-red-100 text-red-800 border-2 border-red-500 hover:bg-red-200';
        break;
      case 'holiday':
        classes += ' bg-orange-100 text-orange-800 border-2 border-orange-500 hover:bg-orange-200';
        break;
      case 'issue-raised':
        classes += ' bg-yellow-100 text-yellow-800 border-2 border-yellow-500 hover:bg-yellow-200';
        break;
      case 'issue-resolved':
        classes += ' bg-blue-100 text-blue-800 border-2 border-blue-500 hover:bg-blue-200';
        break;
      case 'not-taken':
      default:
        classes += ' bg-gray-100 text-gray-700 border-2 border-gray-300 hover:bg-gray-200';
        break;
    }
    return classes;
  };

  const handleDateClick = (day) => {
    const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    alert(`Clicked on ${dateKey}. Status: ${getDayStatus(day)}`);
  };

  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="w-10 h-10"></div>);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(
      <div
        key={day}
        className={getDayClasses(day)}
        onClick={() => handleDateClick(day)}
      >
        {day}
      </div>
    );
  }

  // Pie chart data
  const pieData = [
    { name: 'Absent/Not Taken', value: 18.42 },
    { name: 'Present', value: 81.58 },
  ];

  const COLORS = ['#EF4444', '#22C55E']; // Red for absent/not taken, Green for present

  const legendPayload = [
    { value: 'Absent', type: 'circle', color: '#EF4444' },
    { value: 'Present', type: 'circle', color: '#22C55E' },
    { value: 'Not Taken', type: 'circle', color: '#9CA3AF' },
    { value: 'Holiday', type: 'circle', color: '#F97316' },
    { value: 'Issue Raised', type: 'circle', color: '#EAB308' },
    { value: 'Issue Resolved', type: 'circle', color: '#3B82F6' },
  ];

  return (
    <Layout
      // dashboardData={dashboardData?.results}
    >


      <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-inter antialiased">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 sm:p-6 rounded-lg shadow-xl mb-8">
          <h1 className="text-xl sm:text-2xl font-bold mb-2">Attendance Report</h1>
          <p className="text-sm sm:text-base opacity-90">
            Report for from <span className="font-semibold">1-Jul-2025</span> to <span className="font-semibold">31-Jul-2025</span>.
            Attendance: <span className="font-semibold">81.58%</span>
          </p>
        </div>

        {/* Legend */}
        <div className="bg-gradient-to-r from-gray-700 to-gray-900 text-white p-4 sm:p-6 rounded-lg shadow-xl mb-8 flex flex-wrap justify-around items-center gap-4">
          <div className="flex items-center gap-2">
            <CircleDot className="w-5 h-5 text-red-500" />
            <span>Absent</span>
          </div>
          <div className="flex items-center gap-2">
            <CircleDot className="w-5 h-5 text-green-500" />
            <span>Present</span>
          </div>
          <div className="flex items-center gap-2">
            <CircleDot className="w-5 h-5 text-gray-400" />
            <span>Not Taken</span>
          </div>
          <div className="flex items-center gap-2">
            <CircleDot className="w-5 h-5 text-orange-500" />
            <span>Holiday</span>
          </div>
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-yellow-500" />
            <span>Issue Raised</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCheck className="w-5 h-5 text-blue-500" />
            <span>Issue Resolved</span>
          </div>
        </div>

        <p className="text-center text-red-600 text-sm mb-8 font-semibold animate-pulse">
          Click on a date to report any inaccuracy in the attendance
        </p>

        <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start justify-center">
          {/* Calendar Card */}
          <div className="bg-white p-6 rounded-xl shadow-2xl border border-gray-200 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <button className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors duration-200">
                <ChevronLeft className="w-6 h-6 text-blue-600" />
              </button>
              <h2 className="text-xl font-semibold text-gray-800">July, 2025</h2>
              <button className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors duration-200">
                <ChevronRight className="w-6 h-6 text-blue-600" />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-sm font-bold text-gray-600">
                  {day}
                </div>
              ))}
              {calendarDays}
            </div>
          </div>

          {/* Pie Chart Card */}
          <div className="bg-white p-6 rounded-xl shadow-2xl border border-gray-200 w-full max-w-sm flex flex-col items-center justify-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Attendance Summary</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ percent }) => `${(percent * 100).toFixed(2)}%`}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
                <Legend payload={pieData.map((entry, index) => ({
                  id: entry.name,
                  value: entry.name,
                  type: 'circle',
                  color: COLORS[index % COLORS.length],
                }))} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default App;
