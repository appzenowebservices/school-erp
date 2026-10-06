'use client'
import React, { useState, useEffect } from 'react';
import { CalendarDays, Users, CheckCircle, XCircle, MinusCircle, Send, TrendingUp, Clock, UserCheck, AlertCircle, School, ChevronDown, Plus, ReceiptTextIcon } from 'lucide-react';
import Layout from '../../layouts/Layout';
import { useAttendance, useAttendanceReport, } from '../../controllers/attendance';
import { markAttendance } from '../../api/attendance';
import Loader from '../ui/status/Loader';
import { useAuthContext } from '../../context/auth';
import { getSessionCache } from '../../utils/sessionCache';
import { Breadcrumbs } from '../ui/Breadcrumb/breadcrumb';
import { FaDownload, FaFileExcel } from 'react-icons/fa';

import AttendanceReportSection from './ReportSection';

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Manage Attendance" },
];
// ==================================================================================================

export default function AttendanceReport({
  profile,
  session,
  cookyGuid,
  cookyId,
  attendance

}) {


  const config = getSessionCache("dashboardConfig");
  const context = getSessionCache("dashboardContext");



  // ==================================================================================================
  // State for selected class and date
  const [selectedClassId, setSelectedClassId] = useState(config?.classes[0]?.id);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    // console.log('selectedDate== -----------', selectedDate);


  // ==================================================================================================
  const { getAttendanceReport, attendanceReportData, isSuccess } = useAttendanceReport(
    profile = context?.profileId,
    session = context?.session,
    selectedDate,
    cookyGuid,
    selectedClassId,
    cookyId,
  );




  // ==================================================================================================

  useEffect(() => {

    getAttendanceReport(
      profile,
      session,
      selectedDate,
      cookyGuid,
      selectedClassId,
      cookyId,
    );
  }, [selectedDate, selectedClassId]);





  // ==================================================================================================

  return (
    <Layout>


      <div

        style={{
          backgroundImage: "url('/bg/appbackground@2x.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className="min-h-[calc(100vh-100px)] p-6 space-y-6"
      >
        <Breadcrumbs items={breadcrumbs} />

        <div className="min-h-screen bg-gray-50 p-6 shadow-md rounded">
          {/* Header Section */}
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                    <ReceiptTextIcon className="w-8 h-8 text-blue-600" />
                    Daily Attendance Report

                  </h1>
                  <p className="text-gray-600">
                    View and Manage AttendanceReports
                  </p>

                </div>

              </div>
            </div>





          </div>


          <AttendanceReportSection
            reports={attendanceReportData?.attendance}
            isSuccess={isSuccess}
            setSelectedDate={setSelectedDate}
            selectedDate={selectedDate}
          />

        </div>
      </div>



    </Layout>
  );
};

// ==================================================================================================


