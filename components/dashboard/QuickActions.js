import React, { useState } from 'react';
import { Plus, Zap, ShoppingCart, Users, TrendingUp, Settings, BarChart } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function QuickActions() {
  const router = useRouter()

  const [hoveredIndex, setHoveredIndex] = useState(null);

  const quickActions = [
    {
      title: "Standards Management",
      icon: (
        <Image
          src="/icons/standard_managment.png"
          alt="Standards Icon"
          width={20}
          height={20}
          className="w-16 h-16"
        />
      ),
      color: "bg-yellow-100",
      url: "/dashboard/standard-management",
      features: [
        {
          name: "All Standard & Classes",
          url: "/dashboard/standard-management",
        },

      ]




    },
    {
      title: "Student Management",
      icon: (
        <Image
          src="/icons/student_managment.png"
          alt="Students Icon"
          width={20}
          height={20}
          className="w-16 h-16"
        />
      ),
      color: "bg-yellow-100",
      url: "/dashboard/student-management",
      features: [
        {
          name: "All Student",
          url: "/dashboard/student-management?tab=list",
        },
        {
          name: "Add Students",
          url: "/dashboard/student-management?tab=add",
        },
        {
          name: "Houses",
          url: "/dashboard/student-management?tab=houses",
        },
      ]






    },
    {
      title: "Attendance Management",
      icon: (
        <Image
          src="/icons/mobiTENDANCE.png"
          alt="Attendance Icon"
          width={20}
          height={20}
          className="w-16 h-16"
        />
      ),
      color: "bg-yellow-100",
      url: "/dashboard/attendance-management",
      features: [
        {
          name: "Mark Attendance",
          url: "/dashboard/attendance-management",
        },
        {
          name: "Attendance Reports",
          url: "/dashboard/attendance-report",
        },
      ]
    },
    {
      title: "Staff Management",
      icon: (
        <Image
          src="/icons/staff_management.png"
          alt="Staff Icon"
          width={20}
          height={20}
          className="w-16 h-16"
        />
      ),
      color: "bg-yellow-100",
      url: "/dashboard/staff-management",

      features: [
        {
          name: "Add Staff",
          url: "/dashboard/staff-management?tab=add",
        },
        {
          name: "View All Staff",
          url: "/dashboard/staff-management?tab=list",
        },
      ]




    },
    {
      title: "Report Cards",
      icon: (
        <Image
          src="/icons/report_card.png"
          alt="Reports Icon"
          width={20}
          height={20}
          className="w-16 h-16"
        />
      ),
      color: "bg-yellow-100",
      url: "/dashboard/report-cards",
      features: [
        {
          name: "Design Reports",
          url: "/dashboard/report-cards",
        },
        {
          name: "View Reports",
          url: "/dashboard/report-cards",
        },
      ]



    },
    {
      title: "Fee Management",
      icon: (
        <Image
          src="/icons/online_fee.png"
          alt="Fee Icon"
          width={20}
          height={20}
          className="w-16 h-16"
        />
      ),
      color: "bg-yellow-100",
      url: "/dashboard/fee-summary",

      features: [
        {
          name: "View fees",
          url: "/dashboard/view-fee",
        },
        {
          name: "Fee Types",
          url: "/dashboard/fee-types",
        },
        

        {
          name: "Summary",
          url: "/dashboard/fee-summary",
        },
        {
          name: "Period Wise",
          url: "/dashboard/period-wise-fee",
        },
      ]

    }
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 ">
      <div className=" mx-auto">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-md p-8 border border-white/20">
          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
                Quick Actions
              </h2>
              <p className="text-gray-500 mt-1 text-sm">Access your most-used features instantly</p>
            </div>
            {/* <button className="group relative p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
              <Plus className="w-6 h-6 text-white" />
              <div className="absolute inset-0 rounded-2xl bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            </button> */}
          </div>

          {/* Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <div
                key={index}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="group relative"
              >
                {/* Animated background glow */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${action.gradient} rounded-3xl opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500`} />

                {/* Main card */}
                <div className="relative flex flex-col p-6 rounded-3xl border-2 border-gray-100 bg-white hover:border-transparent transition-all duration-500 cursor-pointer overflow-hidden">
                  {/* Animated background pattern */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500">
                    <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient}`} />
                  </div>

                  {/* Icon container */}
                  <div className="relative mb-5">
                    <div className={`relative bg-gradient-to-br ${action.gradient} w-20 h-20 rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-2xl group-hover:scale-110 transition-all duration-500`}>
                      {action.icon}

                      {/* Shine effect */}
                      <div className="absolute inset-0 rounded-2xl overflow-hidden">
                        <div className={`absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000`} />
                      </div>
                    </div>

                    {/* Pulse ring */}
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-20 scale-100 group-hover:scale-125 transition-all duration-500`} />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 transition-all duration-300">
                    {action.title}
                  </h3>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {action.features.map((feature, fIdx) => (
                      <button
                        key={fIdx}
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Navigate to:', feature.url);
                          router.push(feature.url)
                        }}
                        className={`cursor-pointer relative px-4 py-2 rounded-full text-xs font-semibold
                          bg-gradient-to-r from-gray-100 to-gray-200
                          text-gray-700
                          hover:from-blue-500 hover:to-indigo-600
                          hover:text-white hover:shadow-lg
                          transform hover:scale-105 hover:-translate-y-0.5
                          transition-all duration-300
                          overflow-hidden group/btn`}
                      >
                        {/* Button shimmer effect */}
                        <div className="absolute inset-0 translate-x-[-100%] group-hover/btn:translate-x-[100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700" />
                        <span className="relative z-10">{feature.name}</span>
                      </button>
                    ))}
                  </div>

                  {/* Corner accent */}
                  <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 rounded-bl-full transition-opacity duration-500`} />
                </div>
              </div>
            ))}
          </div>


        </div>
      </div>
    </div>
  );
}