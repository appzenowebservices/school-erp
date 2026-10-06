'use client'
import React, { useEffect, useState, useRef } from 'react';
import { GraduationCap, UserCheck, Plus, Building } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getSessionCache, setSessionCache, } from '../../utils/sessionCache';
import { BiMobile } from 'react-icons/bi';
import Layout from '../../layouts/Layout';
import Loader from '../../components/ui/status/Loader';
import FeeCollectionChart from './FeeCollectionChart';
import UpcomingEvent from './events';
import TodaySummary from './todaySummary';
import QuickActions from './QuickActions';
import DashboardStatsSection from './StatsCards';
import { getFeeCollectionSummary, getFeeNameWiseSummary } from '../../api/fees';
// ====================================================================================

const DashboardMenus = () => {

  const router = useRouter();
  const Context = getSessionCache("dashboardContext");
  const config = getSessionCache("dashboardConfig");


  const [loading, setLoading] = useState(false)
  const [selectedSession, setSelectedSession] = useState('')
  const [dashboardData, setDashboardData] = useState([])


  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});


  const [expandedSections, setExpandedSections] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeChart, setActiveChart] = useState("overview");



  useEffect(() => {
    if (typeof window !== "undefined") {
      const guid = localStorage.getItem('guid');
      if (!guid || Context == null) {
        router.replace('/login');
      }
    }
  }, [router]);





  const fetchFeeNameWise = async () => {
    try {
      // console.log('resp ---------??');
      const resp = await getFeeNameWiseSummary(Context?.profileId, Context?.session);


      // console.log('feeConfig RESP ---------', resp?.data);

      const fetched = resp?.data || [];

      if (fetched) {
        setSessionCache("feeConfig", fetched?.results);

      }



    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setIsLoading(false);
    }
  };


  const fetchFeeCollection = async () => {
    try {
      const data = await getFeeCollectionSummary(
        Context?.profileId,
        Context?.session,
      );

      // console.log('feeCollectionConfig RESP ---------', data?.data);


      const fetched = data?.data || [];

      if (fetched) {

        setSessionCache("feeCollectionConfig", fetched?.results);
      }
    } catch (err) {
      console.error("Failed to fetch fee collection summary:", err);
    }
  };



  useEffect(() => {
    fetchFeeNameWise();
    fetchFeeCollection()
  }, []);







  const getDashboardStats = (standards, staffCount, percentage_of_app_users, number_of_app_users) => {
    if (!standards || standards.length === 0) return [];

    const totalStudents = standards.reduce((sum, std) => {
      return (
        sum +
        std.classes.reduce((clsSum, cls) => clsSum + (cls.students?.length || 0), 0)
      );
    }, 0);

    const totalStaff = staffCount.length;

    const activeClasses = standards.reduce(
      (sum, std) => sum + (std.classes?.length || 0),
      0
    );

    return [
      {
        label: "Total Students",
        value: totalStudents.toLocaleString(),
        icon: GraduationCap,
        color: "from-blue-500 to-indigo-500",
        url: "dashboard/student-management"
      },
      {
        label: "Staff Members",
        value: totalStaff.toLocaleString(),
        icon: UserCheck,
        color: "from-green-500 to-emerald-500",
        url: "dashboard/staff-management"

      },
      {
        label: "Active Classes",
        value: activeClasses.toLocaleString(),
        icon: Building,
        color: "from-purple-500 to-pink-500",
        url: "dashboard/standard-management"

      },
      {
        label: "App Users",
        value: `${percentage_of_app_users}% (${number_of_app_users} )`,
        icon: BiMobile,
        color: "from-orange-500 to-amber-500",
        url: "dashboard/erp-management"

      },
    ];
  };

  const stats = getDashboardStats(
    config?.standards,
    config?.users,
    config?.percentage_of_app_users,
    config?.number_of_app_users
  );

  // console.log('statssds', config);



  return (

    <Layout
      setSelectedSession={setSelectedSession}
    >
      {!loading ?
        <div className="flex min-h-screen bg-gray-50">

          <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">

            <main className="flex-1 overflow-y-auto p-6">

              <DashboardStatsSection stats={stats} />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                <div className="lg:col-span-2">

                  <QuickActions />
                  <FeeCollectionChart />

                </div>

                <div className="space-y-6">
                  <UpcomingEvent context={Context} />
                  <TodaySummary />
                </div>
              </div>

            </main>

          </div>
        </div>

        : <Loader />}

    </Layout>
  );
};

export default DashboardMenus;