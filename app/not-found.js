'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Home, ArrowLeft, BookOpen, Users, Calendar, FileText, Search } from 'lucide-react';

const School404Page = () => {
  const router = useRouter();
  const [excuseIndex, setExcuseIndex] = useState(0);

  const excuses = [
    "The dog ate my homework... and apparently your page too!",
    "This page is currently in detention for bad behavior.",
    "Error 404: Page skipped class and can't be found.",
    "Looks like this page failed its attendance test.",
    "The janitor accidentally mopped up this page.",
    "This page is in the principal's office right now.",
    "Our IT teacher couldn't find this page either.",
    "This page went to the cafeteria and never came back.",
    "Even our smartest student can't solve this mystery.",
    "This page is probably stuck in a locker somewhere."
  ];

  const quickActions = [
    { icon: <Home className="w-5 h-5" />, label: "Dashboard", path: "/dashboard" },
    { icon: <Users className="w-5 h-5" />, label: "Students", path: "/students" },
    { icon: <BookOpen className="w-5 h-5" />, label: "Classes", path: "/classes" },
    { icon: <Calendar className="w-5 h-5" />, label: "Schedule", path: "/schedule" },
    { icon: <FileText className="w-5 h-5" />, label: "Reports", path: "/reports" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setExcuseIndex((prev) => (prev + 1) % excuses.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [excuses.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        
        {/* Animated 404 with school elements */}
        <div className="relative mb-8">
          <div className="text-9xl font-black text-gray-200 select-none">404</div>
          
          {/* Floating school items */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Animated book */}
              <div className="absolute -top-4 -left-8 transform rotate-12 animate-bounce">
                <div className="w-8 h-10 bg-red-400 rounded-sm shadow-lg"></div>
                <div className="w-8 h-1 bg-red-600 rounded-sm mt-1"></div>
              </div>
              
              {/* Animated pencil */}
              <div className="absolute -bottom-2 -right-6 transform -rotate-45 animate-pulse">
                <div className="w-1 h-12 bg-yellow-400 rounded-full"></div>
                <div className="w-2 h-2 bg-pink-300 rounded-full mx-auto -mt-1"></div>
              </div>
              
              {/* Animated apple */}
              <div className="absolute top-2 right-4 animate-bounce" style={{ animationDelay: '1s' }}>
                <div className="w-6 h-6 bg-red-500 rounded-full"></div>
                <div className="w-1 h-2 bg-green-500 mx-auto -mt-1 rounded-sm"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Main heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Oops! Page Not Found
        </h1>

        {/* Rotating excuse */}
        <div className="mb-8 h-16 flex items-center justify-center">
          <p 
            key={excuseIndex}
            className="text-lg md:text-xl text-gray-600 max-w-2xl animate-fade-in italic px-4"
          >
            "{excuses[excuseIndex]}"
          </p>
        </div>

        {/* Chalkboard effect box */}
        <div className="bg-green-800 rounded-lg p-6 mb-8 relative shadow-2xl mx-auto max-w-md transform rotate-1">
          <div className="absolute top-2 left-2 w-3 h-3 bg-yellow-300 rounded-full opacity-70"></div>
          <div className="absolute top-2 right-2 w-3 h-3 bg-yellow-300 rounded-full opacity-70"></div>
          <div className="text-white font-mono">
            <div className="text-yellow-200 text-sm mb-2">Teacher's Note:</div>
            <div className="text-white">
              "Please return to class<br/>
              immediately!"
            </div>
          </div>
          
          {/* Chalk dust effect */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-white opacity-20 rounded-b-lg"></div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
          
          <button
            onClick={() => router.push('/')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-xl hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <Home className="w-5 h-5" />
            Go Home
          </button>
        </div>

        {/* Quick navigation */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center justify-center gap-2">
            <Search className="w-5 h-5" />
            Maybe you were looking for:
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => router.push(action.path)}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-50 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group"
              >
                <div className="p-2 bg-white rounded-lg group-hover:bg-blue-100 transition-colors shadow-sm">
                  {action.icon}
                </div>
                <span className="text-sm font-medium">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer joke */}
        <div className="mt-8 text-sm text-gray-500">
          <p>Don't worry, even Einstein had to ask for directions sometimes!</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default School404Page;