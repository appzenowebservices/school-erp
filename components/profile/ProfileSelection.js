"use client";

import { useEffect, useState, useMemo } from "react";
import { Search, ChevronDown, ChevronRight, User, School } from "lucide-react";
import Footer from "../Footer";
import { useProfile } from "../../controllers/profile";
import { useRouter } from "next/navigation";
import Loader from "../ui/status/Loader";
import { setSessionCache } from "../../utils/sessionCache";
import { getUserDashboardData } from "../../api/dashboard";

// --- Skeleton Component ---
const ProfileSkeleton = () => (
  <div className="animate-pulse space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="bg-white rounded-xl p-6 flex justify-between items-center shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="rounded-full bg-gray-200 h-12 w-12" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-32" />
            <div className="h-3 bg-gray-200 rounded w-24" />
          </div>
        </div>
        <div className="h-8 w-8 bg-gray-200 rounded-full" />
      </div>
    ))}
  </div>
);

export default function ProfileSelection() {
  const router = useRouter();
  const { getUserProfile, profileData } = useProfile();
  
  // States
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [expandedProfiles, setExpandedProfiles] = useState({});
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Initial Fetch
  const init = async () => {
    await getUserProfile();
    setIsInitialLoading(false);
  };
  useEffect(() => {
    init();
  }, []);

  // Memoize the transformed data to prevent re-mapping on every render
  const transformedProfiles = useMemo(() => {
    return (profileData?.profiles || []).map((profile) => ({
      id: profile.id,
      name: profile.name,
      image: profile.image_url,
      avatar: profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase(),
      schoolsAlloted: profile.schools.length,
      role: profile.meta_data || "User",
      schools: profile.schools.map((school) => ({
        id: school.id,
        name: `${school.name}${school.city ? ", " + school.city.name : ""}`,
        logo: school.logo_url,
        sessions: (school.sessions || []).map((session) => ({
          sessionDuration: session.session,
          clientId: session.client_id,
        })),
      })),
    }));
  }, [profileData]);

  // Memoize filtered results
  const filteredProfiles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return transformedProfiles;

    return transformedProfiles.filter((profile) => {
      const nameMatch = profile.name.toLowerCase().includes(q);
      const schoolMatch = profile.schools.some((s) => s.name.toLowerCase().includes(q));
      return nameMatch || schoolMatch;
    });
  }, [searchQuery, transformedProfiles]);

  const toggleProfile = (profileName) => {
    setExpandedProfiles((prev) => ({
      ...prev,
      [profileName]: !prev[profileName],
    }));
  };

  const handleProfileSelect = (profile) => {
    setSelectedProfile(profile);
  };

  const handleSchoolSelect = (school) => {
    setSelectedSchool(school);
    setSelectedSession(null);
  };

  const handleSessionSelect = async (session, profile, school) => {
    setSelectedSession(session);
    setLoading(true);
    
    try {
      setSessionCache("dashboardContext", {
        schoolId: school?.id,
        session: session?.clientId,
        profileId: profile?.id,
        schoolSessions: school?.sessions,
      });

      const data = await getUserDashboardData(profile?.id, session?.clientId);
      if (data) {
        setSessionCache("dashboardConfig", data?.results);
        router.push(`/dashboard`);
      }
    } catch (error) {
      console.error("Selection error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {(loading) && <Loader />}

      <div
        className="bg-gray-100 min-h-screen"
        style={{
          backgroundImage: "url('/bg/appbackground@2x.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <header className="bg-white shadow-md relative z-10">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 flex items-center justify-between">
            <h1 className="text-4xl font-extrabold tracking-tight text-[color:var(--color-blue-text)]">
              info<span className="text-[color:var(--color-navy-blue)]">EIGHT</span>
            </h1>
            <div className="flex items-center space-x-4 text-gray-600 font-bold">
              {profileData?.name || "Guest"}
              <User className="h-6 w-6 ml-2" />
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Profile Selection</h2>
            <p className="mt-2 text-gray-600">Select a profile, school, and session to access your dashboard</p>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-1/2 mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search schools or profiles..."
              className="w-full pl-10 pr-4 py-3 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-md text-gray-700"
            />
            <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
          </div>

          {/* Profiles Section */}
          <div className="grid grid-cols-1 gap-6">
            {isInitialLoading ? (
              <ProfileSkeleton />
            ) : filteredProfiles.length > 0 ? (
              filteredProfiles.map((profile) => (
                <div
                  key={profile.id}
                  className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-200 ${
                    selectedProfile?.id === profile.id ? "ring-2 ring-indigo-500" : "hover:shadow-lg"
                  }`}
                >
                  <div
                    onClick={() => {
                      toggleProfile(profile.name);
                      handleProfileSelect(profile);
                    }}
                    className="cursor-pointer p-6 flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold shadow-md overflow-hidden">
                        {profile.image ? (
                          <img src={profile.image} alt={profile.name} className="w-full h-full object-cover" />
                        ) : (
                          profile.avatar
                        )}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-800">{profile.name}</h3>
                        <div className="flex items-center mt-1">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {profile.role}
                          </span>
                          <span className="ml-2 text-sm text-gray-500">
                            {profile.schoolsAlloted} school{profile.schoolsAlloted !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button className={`p-2 rounded-full ${expandedProfiles[profile.name] ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-500"}`}>
                      {expandedProfiles[profile.name] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </button>
                  </div>

                  {/* Schools List */}
                  {expandedProfiles[profile.name] && (
                    <div className="bg-gray-50 p-4 border-t border-gray-100 space-y-4">
                      {profile.schools.map((school) => (
                        <div
                          key={school.id}
                          className={`p-4 rounded-lg border transition-all ${
                            selectedSchool?.id === school.id ? "bg-indigo-50 border-indigo-200" : "bg-white border-gray-100"
                          }`}
                        >
                          <div className="flex items-center cursor-pointer mb-4" onClick={() => handleSchoolSelect(school)}>
                            {school.logo ? (
                              <img src={school.logo} alt={school.name} className="h-10 w-10 rounded-full object-cover mr-3" />
                            ) : (
                              <School className="h-10 w-10 text-gray-400 mr-3" />
                            )}
                            <h4 className="font-medium text-gray-800">{school.name}</h4>
                          </div>
                          
                          <div className="ml-13">
                            <p className="text-xs uppercase font-bold text-gray-400 mb-2">Select Session</p>
                            <div className="flex flex-wrap gap-2">
                              {school.sessions.map((session) => (
                                <button
                                  key={session.clientId}
                                  onClick={() => handleSessionSelect(session, profile, school)}
                                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                    selectedSession?.clientId === session.clientId && selectedSchool?.id === school.id
                                      ? "bg-indigo-600 text-white"
                                      : "bg-white text-gray-700 border border-gray-200 hover:border-indigo-500"
                                  }`}
                                >
                                  {session.sessionDuration}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-gray-500">No profiles found matching your search.</div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}