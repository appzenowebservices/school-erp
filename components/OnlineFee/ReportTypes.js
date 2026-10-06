'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, BarChart3, Calendar, Clock } from 'lucide-react';

const REPORT_CONFIG = [
  {
    key: "datewise",
    label: "Datewise Collection",
    icon: Calendar,
    color: "blue",
    link: "/reports/datewise"
  },
  {
    key: "standardwise",
    label: "Standardwise",
    icon: BarChart3,
    color: "purple",
    link: "/reports/standardwise"
  },
  {
    key: "periodwise",
    label: "Periodwise",
    icon: Clock,
    color: "emerald",
    link: "/reports/periodwise"
  },
];

const ReportTypes = () => {
  const router = useRouter();
  const [activeReport, setActiveReport] = useState('datewise');

  const handleNavigation = (key, link) => {
    setActiveReport(key);
    router.push(link);
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {REPORT_CONFIG.map((item) => {
          const isActive = activeReport === item.key;
          const Icon = item.icon;

          return (
            <button
              key={item.key}
              onClick={() => handleNavigation(item.key, item.link)}
              className={`
                group relative flex flex-col p-5 rounded-xl text-left transition-all duration-200
                border-2 shadow-sm
                ${isActive 
                  ? 'bg-white border-blue-500 ring-4 ring-blue-50' 
                  : 'bg-gray-50 border-gray-100 hover:border-gray-300 hover:bg-white'
                }
              `}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`
                  p-2.5 rounded-lg transition-colors
                  ${isActive ? 'bg-blue-600 text-white' : 'bg-white text-gray-500 group-hover:text-blue-600 border border-gray-100 shadow-sm'}
                `}>
                  <Icon size={20} />
                </div>
                
                <ArrowRight className={`
                  w-5 h-5 transition-all duration-300
                  ${isActive ? 'text-blue-500 translate-x-0' : 'text-gray-300 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}
                `} />
              </div>

              <div>
                <h3 className={`font-bold text-sm ${isActive ? 'text-blue-900' : 'text-gray-700'}`}>
                  {item.label}
                </h3>
                <p className={`text-xs mt-1 font-medium ${isActive ? 'text-blue-600/80' : 'text-gray-400'}`}>
                  Click to view analytics
                </p>
              </div>

              {/* Pro "Active" Strip */}
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-1 w-12 bg-blue-500 rounded-b-full" />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 px-1 flex items-center gap-2">
        <div className="flex h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          Financial Insights & Reporting Engine
        </span>
      </div>
    </div>
  );
};

export default ReportTypes;