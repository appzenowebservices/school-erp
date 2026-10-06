"use client"
//============================================================================
import { useEffect, useState } from "react";
import {
  BarChart3,
  Users,
  UserCircle,
  Briefcase,
  Book,
  Monitor,
  Smartphone,
  MessageCircle,
  BookOpen,
  Cloud,
  Settings,
  Lock,
  Download,
  Plus,
  Eye,
  Award,
  Building2,
  ScrollText,
  CalendarDays,
  Send,
  FileText,
  Layers,
  ChevronRight,
  Bell,
  MoreHorizontal,
  Search,
  HelpCircle,
  Menu,
  X,
  Home,
  Activity,
  Calendar,
  Mail,
  TrendingUp
} from "lucide-react";

import Layout from "../../layouts/Layout";
import { useDashboard } from "../../controllers/dashboard";
import Loader from "../ui/status/Loader";


//============================================================================


export default function DashboardClientComponent({ profileId, sessionId }) {
  //============================================================================

  const { getUserDashboard, dashboardData, isLoading } = useDashboard();

  //============================================================================


  useEffect(() => {
    getUserDashboard(profileId, sessionId);
  }, [profileId, sessionId]);
  const feeMenus = dashboardData?.menus.filter(item => item.product?.name === "ONLINE FEE");

  const featuredMenus = dashboardData?.menus ? dashboardData?.menus : [];


  const [activeModule, setActiveModule] = useState(null);

  const statCards = [
    {
      title: "Standards",
      count: 16,
      trend: "+3.2%",
      trendUp: true,
      description: "Total academic standards",
      icon: () => <BarChart3 />,
      color: "from-blue-400 to-blue-600",
      lightColor: "rgba(59, 130, 246, 0.1)"
    },
    {
      title: "Classes",
      count: 66,
      trend: "+1.8%",
      trendUp: true,
      description: "Active class sections",
      icon: () => <Users />,
      color: "from-emerald-400 to-emerald-600",
      lightColor: "rgba(16, 185, 129, 0.1)"
    },
    {
      title: "Students",
      count: 5,
      trend: "0%",
      trendUp: false,
      description: "Enrolled students",
      icon: () => <UserCircle />,

      color: "from-amber-400 to-amber-600",
      lightColor: "rgba(245, 158, 11, 0.1)"
    },
    {
      title: "Staff",
      count: 152,
      trend: "+4.5%",
      trendUp: true,
      description: "Teaching & non-teaching",
      icon: () => <Briefcase />,

      color: "from-rose-400 to-rose-600",
      lightColor: "rgba(225, 29, 72, 0.1)"
    },
    {
      title: "App Installation",
      count: "0",
      percentage: "0%",
      trend: "0%",
      trendUp: false,
      description: "Mobile app adoption",
      icon: () => <Smartphone />,

      color: "from-purple-400 to-purple-600",
      lightColor: "rgba(147, 51, 234, 0.1)"
    },
  ];

  const modules = [
    {
      id: "erp",
      title: "ERP Management",
      description: "Core school management tools",
      icon: Settings,
      bgGradient: "from-blue-500 to-indigo-600",
      links: [
        { title: "Setup", icon: Settings, href: "#" },
        { title: "Permissions", icon: Lock, href: "#" },
      ]
    },
    {
      id: "student",
      title: "Student Management",
      description: "Student data and profiles",
      icon: UserCircle,
      bgGradient: "from-amber-500 to-orange-600",
      links: [
        { title: "Add Student", icon: Plus, href: "#" },
        { title: "Download Student Data", icon: Download, href: "#" },
      ]
    },
    {
      id: "staff",
      title: "Staff Management",
      description: "Faculty and staff administration",
      icon: Briefcase,
      bgGradient: "from-emerald-500 to-green-600",
      links: [
        { title: "Add Staff", icon: Plus, href: "#" },
        { title: "Departments", icon: Building2, href: "#" },
        { title: "School Roles", icon: ScrollText, href: "#" },
        { title: "School Designations", icon: Award, href: "#" },
        { title: "Titles", icon: Award, href: "#" },
        { title: "Subject Class Mapping", icon: Layers, href: "#" },
      ]
    },
    {
      id: "report",
      title: "Report Cards",
      description: "Grading and assessment",
      icon: FileText,
      bgGradient: "from-red-500 to-rose-600",
      links: [
        { title: "Subjects", icon: Book, href: "#" },
        { title: "Grades", icon: Award, href: "#" },
        { title: "Exams", icon: ScrollText, href: "#" },
        { title: "Enter Marks", icon: Plus, href: "#" },
        { title: "Student Marks Entry", icon: Plus, href: "#" },
        { title: "Report Card Formats", icon: FileText, href: "#" },
        { title: "Report Card & Analytical Sheets", icon: Layers, href: "#" },
        { title: "Block Report Card", icon: Lock, href: "#" },
      ]
    },
    {
      id: "exam",
      title: "Online Exams",
      description: "Digital assessment platform",
      icon: Monitor,
      bgGradient: "from-yellow-500 to-amber-600",
      links: [
        { title: "View Quizzes", icon: Eye, href: "#" },
      ]
    },
    {
      id: "attendance",
      title: "Mobile Attendance",
      description: "Digital attendance tracking",
      icon: Smartphone,
      bgGradient: "from-sky-500 to-blue-600",
      links: [
        { title: "Take Attendance", icon: Plus, href: "#" },
        { title: "Daily Attendance Report", icon: CalendarDays, href: "#" },
      ]
    },
    {
      id: "sms",
      title: "SMS System",
      description: "Communication tools",
      icon: MessageCircle,
      bgGradient: "from-purple-500 to-violet-600",
      links: [
        { title: "View Notices", icon: Eye, href: "#" },
        { title: "Send SMS Circular", icon: Send, href: "#" },
      ]
    },
    {
      id: "homework",
      title: "Homework",
      description: "Assignment management",
      icon: BookOpen,
      bgGradient: "from-indigo-500 to-purple-600",
      links: [
        { title: "View Homework", icon: Eye, href: "#" },
        { title: "Send Homework Message", icon: Send, href: "#" },
      ]
    },
    {
      id: "cloud",
      title: "Cloud Storage",
      description: "Document management",
      icon: Cloud,
      bgGradient: "from-cyan-500 to-blue-600",
      links: [
        { title: "View Cloud Attachments", icon: Eye, href: "#" },
      ]
    },
  ];



  // const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };







  const handleModuleClick = (module) => {

    // router.push(`/dashboard/${profileId}/${sessionId}/${module.slug}`);

    setActiveModule(activeModule === module ? null : module);
  };





  // if (!isLoading) {
  //   return (
  //     <div className="flex h-screen bg-gray-50">
  //       <div className="flex-1 flex items-center justify-center">
  //         <h1 className="text-gray-500">Loading...</h1>
  //       </div>
  //       {/* <Layout>
  //       </Layout> */}
  //     </div>
  //   );
  // }
  return (
    <div className="flex h-screen bg-gray-50"

    >
      <Layout>
        {/* <Sidebar
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}

        /> */}
        <div className="flex-1 flex flex-col overflow-hidden "

        >

          {/* <Navbar
            sidebarOpen={sidebarOpen}
            toggleSidebar={toggleSidebar}
          /> */}


          {/* Main Content Scrollable Area */}
          <main
            style={{
              backgroundImage: "url('/bg/appbackground@2x.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
            className="flex-1 overflow-auto bg-gradient-to-br from-gray-50 to-gray-100 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Welcome Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Welcome back, Principal</h2>
                <p className="text-gray-600">Here's what's happening with your school today.</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
                {statCards.map((stat, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div style={{ backgroundColor: stat.lightColor }} className="rounded-xl p-3">
                          <stat.icon className={`h-6 w-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                        </div>
                        {stat.trend && (
                          <span className={`text-xs font-medium px-2 py-1 rounded-full flex items-center ${stat.trendUp ? 'text-green-700 bg-green-100' : 'text-gray-700 bg-gray-100'
                            }`}>
                            {stat.trendUp && <TrendingUp className="h-3 w-3 mr-1" />}
                            {stat.trend}
                          </span>
                        )}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">
                        {stat.count}
                        {stat.percentage && <span className="text-sm font-normal text-gray-500 ml-1">({stat.percentage})</span>}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">{stat.description}</p>
                    </div>
                    <div className={`h-1 bg-gradient-to-r ${stat.color}`}></div>
                  </div>
                ))}
              </div>

              {/* Featured Modules */}
              <div className="mb-10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">School Management</h2>
                  <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center">
                    View All <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>

                {isLoading ? <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {featuredMenus?.map((module, index) => {
                    // console.log('module=-=======', module);

                    return (
                      // <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div
                        onClick={() => handleModuleClick(module)}
                        className={`bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer`}
                      >
                        <div className="p-6">
                          <div className="flex items-center mb-4">
                            <div
                              className="rounded-xl p-3"
                              style={{
                                backgroundColor: "#fd942c",
                              }}
                            >
                              <img
                                src={module?.icon_url}

                                alt="Attendance Icon"
                                className="h-6 w-6"
                              />
                            </div>
                          </div>
                          <h3
                            title={module?.code}

                            className="text-lg font-bold text-gray-800 mb-1">{module?.name}</h3>
                          <p className="text-sm text-gray-500 mb-4">{module?.description}</p>

                          {/* Quick links placeholder if needed in future */}
                          <div className="flex flex-wrap gap-2 mt-auto">
                            {/* Knowledge base links could go here */}
                            {/* Since knowledge_base_links is empty, we skip rendering */}
                          </div>
                        </div>
                        <div
                          className="h-1"
                          style={{
                            background: 'linear-gradient(to right, #fd942c, #ffac54)', // simulate bgGradient
                          }}
                        />
                      </div>
                      // </div>

                    )
                  })}
                </div> : <Loader />}
              </div>

              {/* Additional Modules */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Additional Tools</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {modules.slice(6).map((module, index) => (
                    <div
                      key={index}
                      onClick={() => handleModuleClick(module.id)}
                      className={`bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer ${activeModule === module.id ? 'ring-2 ring-indigo-500 ring-offset-2' : ''
                        }`}
                    >
                      <div className="p-6">
                        <div className="flex items-center mb-4">
                          <div className={`rounded-xl p-3 bg-gradient-to-r ${module.bgGradient}`}>
                            <module.icon className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-1">{module.title}</h3>
                        <p className="text-sm text-gray-500 mb-4">{module.description}</p>

                        {/* Quick links */}
                        <div className="flex flex-wrap gap-2 mt-auto">
                          {module.links.slice(0, 2).map((link, linkIndex) => (
                            <a
                              key={linkIndex}
                              href={link.href}
                              className="inline-flex items-center px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-700 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <link.icon className="h-3.5 w-3.5 mr-1" />
                              {link.title}
                            </a>
                          ))}
                          {module.links.length > 2 && (
                            <span className="inline-flex items-center px-3 py-1.5 bg-gray-100 rounded-lg text-xs font-medium text-gray-500">
                              +{module.links.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                      <div className={`h-1 bg-gradient-to-r ${module.bgGradient}`}></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>





        </div>
      </Layout>
    </div>
  );
}


