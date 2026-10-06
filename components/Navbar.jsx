"use client"

import React, { useEffect, useState } from 'react';
import { TbLayoutSidebarRightCollapse, TbBell, TbSettings, TbSearch } from "react-icons/tb";
import { Calendar, ChevronDown, User, LogOut, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { getSessionCache } from '../utils/sessionCache';
import NotificationPanel from '../components/NotificationPanel';
import { getNotifications } from '../api/notifications';

const UserProfile = ({ profile, router, loading }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);



  const handleLogout = () => {
    // Remove tokens and user info from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('user_name');
    localStorage.removeItem('name');
    localStorage.removeItem('guid');

    // Remove cookies
    Cookies.remove('id');
    Cookies.remove('user_name');
    Cookies.remove('name');
    Cookies.remove('guid');
    // Remove from sessionStorage as well
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('id');
    sessionStorage.removeItem('user_name');
    sessionStorage.removeItem('name');
    sessionStorage.removeItem('guid');
    sessionStorage.removeItem('dashboardContext');
    sessionStorage.removeItem('dashboardConfig');


    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="animate-pulse w-32 h-8 bg-gray-200 rounded"></div>
    );
  }
  return (
    <div className="relative">
      <button
        onClick={() => setIsProfileOpen(!isProfileOpen)}
        className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 group"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
          {profile?.name?.charAt(0) || 'U'}
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-white font-medium text-sm">{profile?.name || 'User'}</p>
          <p className="text-blue-200 text-xs">{profile?.type || 'Student'}</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-blue-200 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
      </button>

      {isProfileOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">

            <div className="py-2">
              <button
                className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => router.push('/dashboard/profile')}
              >

                <User className="w-4 h-4" />
                <span className="text-sm">Profile</span>
              </button>
              <button
                className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => router.push('/dashboard/erp-management')}

              >
                <Settings className="w-4 h-4" />
                <span className="text-sm">Settings</span>
              </button>
              <button
                className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-100 transition-colors"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const Navbar = ({
  currentSession,
  setSelectedSession,
  userProfile = {},
  loading,
  sidebarOpen,
  setSidebarOpen,
}) => {


  const context = getSessionCache("dashboardContext");
  const [schoolSessions, setSchoolSessions] = useState(context?.schoolSessions)
  // console.log(' ------------------ schoolSessions -------------------', schoolSessions);
  // console.log(' ------------------ userProfile -------------------', userProfile);

  const router = useRouter();
  const [selectedYear, setSelectedYear] = useState(
    schoolSessions?.find(session => session?.is_active)?.name || currentSession?.session || 'Select Year'
  );

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  const handleYearSelect = (year) => {
    setSelectedYear(year?.sessionDuration);
    setSelectedSession(year)
    setIsDropdownOpen(false);
    // router.push('/profile-selection')
  };



  // ✅ Notifications state
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Fetch notifications on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoadingNotifications(true);
      setError(null);
      try {
        const data = await getNotifications(context?.profileId, context?.session);
        // console.log('nooti ---', data?.results?.notifications?.length);

        if (isMounted) {
          setNotifications(data?.results?.notifications || []); // adapt based on your API response
        }
      } catch (err) {
        if (isMounted) setError("Failed to load notifications");
        console.error("Error fetching notifications:", err);
      } finally {
        if (isMounted) setLoadingNotifications(false);
      }
    };
    let isMounted = true;


    fetchNotifications();

    return () => {
      isMounted = false;
    };
  }, [context?.profileId, context?.session]);



  return (
    <>
      <header className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 shadow-2xl z-50 w-full border-b border-white/10 backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 lg:px-8 py-4">

          <div className="flex items-center gap-4">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="cursor-pointer p-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400/50 group"
                aria-label="Toggle Sidebar"
              >
                <TbLayoutSidebarRightCollapse className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              </button>
            )}

            <div className="cursor-pointer group" onClick={() => router.push('/profile-selection')}>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-blue-400 via-blue-400 to-blue-400 bg-clip-text text-transparent hover:from-blue-300 hover:to-purple-300 transition-all duration-500">
                info<span className="text-white">EIGHT</span>
              </h1>
            </div>
          </div>

          {/* Center Section - Search (hidden on mobile) */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-8">
            {/* <div className="relative w-full">
              <TbSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-200" />
              <input
                type="text"
                placeholder="Search students, classes, or announcements..."
                className="w-full pl-12 pr-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:bg-white/20 transition-all duration-300"
              />
            </div> */}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Mobile Search Toggle */}
       

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="cursor-pointer relative p-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 group"
              >
                <TbBell className="w-5 h-5 group-hover:animate-swing" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              </button>

              {showNotifications && (
                <>


                  <NotificationPanel
                    onClose={() => setShowNotifications(false)}
                    notifications={notifications}
                    isOpen={showNotifications}
                  />
                </>
              )}
            </div>

            {/* Year Selector */}
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 group min-w-[120px]"
              >
                <Calendar className="w-4 h-4 text-blue-200 group-hover:text-white transition-colors" />
                <span className="font-medium text-sm">{selectedYear}</span>
                <ChevronDown className={`w-4 h-4 text-blue-200 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                  <div className=" absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                    <div className="  py-2">
                      {schoolSessions?.map((session) => (
                        <button
                          key={session?.id}
                          onClick={() => handleYearSelect(session)}
                          className={`cursor-pointer w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${selectedYear === session?.sessionDuration
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                          <span>{session?.sessionDuration}</span>
                          {session?.sessionDuration === selectedYear && (
                            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* User Profile */}
            {userProfile ? (
              <UserProfile

                profile={userProfile}
                router={router}
                loading={loading}
              />
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="w-6 h-6 rounded-full bg-gray-400 animate-pulse"></div>
                <span className="text-blue-200 text-sm">Loading...</span>
              </div>
            )}
          </div>
        </div>
      </header>



      <style jsx>{`
        @keyframes swing {
          15% { transform: rotate(15deg); }
          30% { transform: rotate(-10deg); }
          45% { transform: rotate(5deg); }
          60% { transform: rotate(-5deg); }
          75% { transform: rotate(2deg); }
          100% { transform: rotate(0deg); }
        }
        .group:hover .animate-swing {
          animation: swing 0.6s ease-in-out;
        }
      `}</style>
    </>
  );
};

export default Navbar;