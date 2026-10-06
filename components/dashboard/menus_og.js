"use client"
import React, { useEffect, useState } from 'react';
import {
  Users,
  DollarSign,
  BookOpen,
  Bell,
  Calendar,
  FileText,
  UserCheck,
  Settings,
  GraduationCap,
  Building,

} from 'lucide-react';

import Layout from '../../layouts/Layout';
import { getUserDashboardData } from "../../api/dashboard";
import { useParams, useRouter } from 'next/navigation';
import { getSessionCache, setSessionCache } from '../../utils/sessionCache';
import { BiMobile } from 'react-icons/bi';

const DashboardMenus = ({ dashboardData }) => {
  const router = useRouter();




  const [context, setContext] = useState({ schoolId: "", classId: "", studentId: "" })

  useEffect(() => {
    const saved = getSessionCache("dashboardContext");
    if (saved) {
      setContext(saved);
      // 👉 now call your API with saved.schoolId, saved.classId, saved.studentId
    }
  }, []);



  console.log('==================, context', context);
  




  useEffect(() => {
    if (dashboardData) {
      setSessionCache("dashboardConfig", dashboardData.results);
      console.log("✅ Cached dashboardConfig in sessionStorage");
    }
  }, [dashboardData]);





  const params = useParams()
  let profileId = params?.profile;
  let sessionId = params?.session;
  let school_id = params?.school;


  // console.log("params", params);




  const [sidebarOpen, setSidebarOpen] = useState(false);




  const modules = [
    {
      title: 'Standard Management',
      description: 'Class management, new entries, student enrollment',
      icon: <GraduationCap className="w-8 h-8" />,
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      link: 'standard-management',
      items: ['Class Management', 'New Admissions', 'Student Transfer', 'Section Management']
    },
    {
      title: 'Fee Module',
      description: 'Fee collection, payment tracking, receipts',
      icon: <DollarSign className="w-8 h-8" />,
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      link: 'fee-summary',

      items: ['Fee Collection', 'Payment History', 'Due Reports', 'Receipt Generation']
    },
    {
      title: 'Library Module',
      description: 'Book management, issue/return tracking',
      icon: <BookOpen className="w-8 h-8" />,
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      link: 'online-library',

      items: ['Book Catalog', 'Issue Books', 'Return Books', 'Fine Management']
    },
    {
      title: 'Notice & Attendance',
      description: 'Announcements and attendance tracking',
      icon: <Bell className="w-8 h-8" />,
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600',
      link: 'fee-summary',

      items: ['Notice Board', 'Daily Attendance', 'Leave Management', 'Parent Notifications']
    },
    {
      title: 'Report Card Management',
      description: 'Exam results, grade cards, progress reports',
      icon: <FileText className="w-8 h-8" />,
      color: 'bg-red-500',
      hoverColor: 'hover:bg-red-600',
      link: 'fee-summary',

      items: ['Exam Management', 'Grade Entry', 'Report Cards', 'Progress Tracking']
    },
    {
      title: 'Profile Management',
      description: 'Student & staff profile management',
      icon: <Users className="w-8 h-8" />,
      color: 'bg-indigo-500',
      hoverColor: 'hover:bg-indigo-600',
      link: 'fee-summary',

      items: ['Student Profiles', 'Staff Management', 'Parent Portal', 'User Roles']
    },
    {
      title: 'ERP Settings',
      description: 'System configuration and preferences',
      icon: <Settings className="w-8 h-8" />,
      color: 'bg-gray-600',
      hoverColor: 'hover:bg-gray-700',
      link: 'fee-summary',

      items: ['System Config', 'User Management', 'Backup Settings', 'Academic Year']
    }
  ];



  const getDashboardStats = (standards, staffCount, todayAttendance) => {
    if (!standards || standards.length === 0) return [];

    // 🔹 Total students across all standards & classes
    const totalStudents = standards.reduce((sum, std) => {
      return (
        sum +
        std.classes.reduce((clsSum, cls) => clsSum + (cls.students?.length || 0), 0)
      );
    }, 0);


    const totalStaff = standards.reduce((sum, std) => {
      return (
        sum +
        std.classes.length
      );
    }, 0);



    // 🔹 Active classes (all sections combined)
    const activeClasses = standards.reduce(
      (sum, std) => sum + (std.classes?.length || 0),
      0
    );

    return [
      {
        label: "Total Students",
        value: totalStudents.toLocaleString(),
        icon: <GraduationCap className="w-9 h-9" />,
        color: "text-blue-600",
      },
      {
        label: "Staff Members",
        value: totalStaff.toLocaleString(),
        icon: <UserCheck className="w-9 h-9" />,
        color: "text-green-600",
      },
      {
        label: "Active Classes",
        value: activeClasses.toLocaleString(),
        icon: <Building className="w-9 h-9" />,
        color: "text-purple-600",
      },
      {
        label: "App Users ",
        value: `${dashboardData?.results?.percentage_of_app_users}%`,
        icon: <BiMobile className="w-9 h-9" />,
        color: "text-orange-600",
      },
    ];
  };


  const stats = getDashboardStats(dashboardData?.results?.standards, 89, 94);

  return (
    <Layout>


      <div className="min-h-screen bg-gray-50">


        <div className="flex">
          {/* Sidebar for mobile */}
          {sidebarOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)}>
              <div className="w-64 bg-white h-full shadow-lg" onClick={(e) => e.stopPropagation()}>
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800">Quick Access</h2>
                  <nav className="mt-4 space-y-2">
                    {modules.map((module, index) => (
                      <a
                        key={index}
                        href="#"
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className={`p-2 rounded-md ${module.color} text-white`}>
                          {module.icon}
                        </div>
                        <span className="text-sm font-medium text-gray-700">{module.title}</span>
                      </a>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1 p-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    </div>
                    <div className={`${stat.color}`}>
                      {stat.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Module Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module, index) => (
                <div
                  onClick={() => {
                    console.log();

                    // activeModule = module.title;
                    router.push(`/dashboard/${profileId}/${sessionId}/${school_id}/${module?.link}`);
                  }
                  }
                  key={index}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                >
                  <div className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className={`p-3 rounded-lg ${module.color} ${module.hoverColor} text-white transition-colors group-hover:scale-110 transform duration-200`}>
                        {module.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{module.title}</h3>
                        <p className="text-sm text-gray-500">{module.description}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {module.items.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                          <span className="text-sm text-gray-600 hover:text-gray-800">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="px-6 pb-6">
                    <button className={`w-full py-2 px-4 rounded-lg text-white font-medium ${module.color} ${module.hoverColor} transition-colors`}>
                      Access Module
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="flex items-center space-x-3 p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-colors">
                  <Users className="w-6 h-6 text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">Add New Student</span>
                </button>
                <button className="flex items-center space-x-3 p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-green-400 hover:bg-green-50 transition-colors">
                  <Calendar className="w-6 h-6 text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">Mark Attendance</span>
                </button>
                <button className="flex items-center space-x-3 p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-purple-400 hover:bg-purple-50 transition-colors">
                  <Bell className="w-6 h-6 text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">Send Notice</span>
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardMenus;