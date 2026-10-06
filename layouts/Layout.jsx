'use client';

import Navbar from '../components/Navbar';
import ConfirmationDialogueBox from '../components/ui/status/Confirmation';
import IdleTimeContainer from '../autoLogout';
import Sidebar from '../components/Sidebar';
import React, { useEffect, useState, useRef } from 'react';
import { getSessionCache, setSessionCache } from '../utils/sessionCache';
import { getUserDashboardData } from '../api/dashboard';
import Loader from '../components/ui/status/Loader';
import Copilot from '../components/ai/Copilot';

export default function Layout({ children, dashboardData, stateChanged }) {
  const initialConfig = getSessionCache("dashboardConfig");
  const initialContext = getSessionCache("dashboardContext");

  const [dashboardConfig, setDashboardConfig] = useState(initialConfig);
  const [userProfile, setUserProfile] = useState(initialConfig?.profile || null);
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  
  // Set sidebarOpen to true by default for large screens
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showIdleDialogue, setShowIdleDialogue] = useState(false);
  const [selectedSession, setSelectedSession] = useState(initialContext?.session || "");

  const didMount = useRef(false);

  // Close sidebar automatically on mobile when window is small
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    handleResize(); // Run on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  async function load(sessionOverride) {
    setLoadingDashboard(true);
    try {
      const activeSession = sessionOverride || initialContext?.session;
      const data = await getUserDashboardData(initialContext?.profileId, activeSession);
      if (data?.results) {
        setSessionCache("dashboardConfig", data.results);
        setDashboardConfig(data.results);
      }
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setLoadingDashboard(false);
    }
  }

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    const context = getSessionCache("dashboardContext");
    const newSession = selectedSession?.clientId || context?.session;
    if (!newSession) return;

    if (context?.session !== newSession) {
      setSessionCache("dashboardContext", { ...context, session: newSession });
      load(newSession);
    } else if (stateChanged) {
      load(newSession);
    }
  }, [selectedSession?.clientId, stateChanged]);

  return (
    <div className="flex w-full h-screen overflow-hidden bg-gray-50">
      <IdleTimeContainer
        onIdle={() => {
          localStorage.removeItem('token');
          setShowIdleDialogue(true);
        }}
      />

      {showIdleDialogue && (
        <ConfirmationDialogueBox
          title="Hey, You Still There?"
          description="You have been idle for a while. Do you want to log out?"
          onConfirm={() => setShowIdleDialogue(false)}
          onCancel={() => setShowIdleDialogue(false)}
        />
      )}

      {/* --- SIDEBAR CONTAINER --- */}
      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 lg:relative
          ${sidebarOpen ? "translate-x-0 w-72" : "-translate-x-full lg:translate-x-0 lg:w-0"}
          transition-all duration-300 ease-in-out bg-white border-r border-gray-200
        `}
      >
        <Sidebar
          dashboardData={dashboardData}
          sidebarOpen={sidebarOpen}
          config={dashboardConfig}
          setSidebarOpen={setSidebarOpen}
        />
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Navbar
          currentSession={dashboardConfig?.year}
          schoolSessions={dashboardConfig?.school?.sessions}
          setSelectedSession={setSelectedSession}
          userProfile={userProfile}
          loading={loadingDashboard}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="flex-1 overflow-y-auto bg-[#F8FAFC]">
          <div className="p-4 md:p-8 max-w-[1600px] mx-auto">
            {loadingDashboard ? (
              <div className="flex items-center justify-center h-64">
                <Loader />
              </div>
            ) : (
              React.Children.map(children, child =>
                React.isValidElement(child)
                  ? React.cloneElement(child, { dashboardConfig })
                  : child
              )
            )}
          </div>
        </main>
        <Copilot />
      </div>
    </div>
  );
}