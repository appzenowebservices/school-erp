import React, { useEffect, useState } from "react";
import { Cake, Gift, Users, Briefcase, Calendar, Send, Sparkles } from "lucide-react";
import { getRecentBirthdayList, getMonthWiseBirthdayList, sendBirthdayWishes } from "../../api/birthdays";
import Confetti from "react-confetti";

export default function Birthdays({ context, config }) {
  const [recent, setRecent] = useState(null);
  const [monthly, setMonthly] = useState(null);

  const [loadingRecent, setLoadingRecent] = useState(true);
  const [loadingMonthly, setLoadingMonthly] = useState(true);

  const [errorRecent, setErrorRecent] = useState(null);
  const [errorMonthly, setErrorMonthly] = useState(null);

  const [activeRecentTab, setActiveRecentTab] = useState("students");
  const [submitted, setSubmitted] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [sendingId, setSendingId] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await getRecentBirthdayList(
          context?.profileId,
          context?.session
        );
        setRecent(res?.data?.results?.items || {});
      } catch {
        setErrorRecent("Failed to load recent birthdays");
      } finally {
        setLoadingRecent(false);
      }
    };

    const fetchMonthly = async () => {
      try {
        const res = await getMonthWiseBirthdayList(
          context?.profileId,
          context?.session
        );
        setMonthly(res?.data?.results?.items || {});
      } catch {
        setErrorMonthly("Failed to load monthly birthdays");
      } finally {
        setLoadingMonthly(false);
      }
    };

    fetchRecent();
    fetchMonthly();
  }, []);



  const handleWishSend = async (person) => {
    if (!person?.id) return;

    setSendingId(person.id);
    setError(null);
    setSuccess(null);

    try {
      const resp = await sendBirthdayWishes(
        context?.profileId,
        context?.session,
        [person.id]
      );

      if (resp?.data?.success) {
        setSuccess(resp?.data?.results?.message || "Wishes sent successfully");
        setShowConfetti(true);
        setTimeout(() => {
          setShowConfetti(false);
        }, 3000);
        setRecent(prev => {
          if (!prev) return prev;

          const updateGroups = (groups = []) =>
            groups.map(g => ({
              ...g,
              items: g.items.map(i =>
                i.id === person.id ? { ...i, wished: true } : i
              )
            }));
          return {
            ...prev,
            students: updateGroups(prev.students),
            staff: updateGroups(prev.staff)
          };
        });

      } else {
        setError(resp?.data?.results?.message || "Failed to send wishes");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSendingId(null);
    }
  };







  // DETAILED LIST COMPONENT
  const DetailedList = ({ groups }) => {
    // console.log('send_wishes__',groups);

    if (!groups || groups.length === 0) {
      return (
        <div className="text-center py-12 px-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
          <Cake className="w-16 h-16 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 text-lg">No birthdays found</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {groups.map((group, idx) => (
          <div
            key={idx}
            className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <div
              className="px-6 py-4 flex items-center gap-3 font-semibold text-base"
              style={{
                backgroundColor: group.background_color,
                color: group.text_color
              }}
            >
              <Sparkles className="w-5 h-5" />
              {group.text}
            </div>

            <div className="divide-y divide-gray-100 bg-white">
              {group.items.map(item => (
                <div
                  key={item.id}
                  className="flex items-center gap-5 p-5 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200"
                >
                  <div className="relative">
                    <img
                      src={item.image_url || "/no-user.png"}
                      alt={item.name}
                      className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full p-1.5">
                      <Gift className="w-3 h-3 text-white" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-lg mb-1">{item.name}</p>

                    {item.roll_number && (
                      <p className="text-sm text-gray-600 flex items-center gap-2 mb-1">
                        <span className="font-medium">Roll {item.roll_number}</span>
                        <span className="text-gray-400">•</span>
                        <span>{item.class?.name}</span>
                      </p>
                    )}

                    {item.designation && (
                      <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                        <Briefcase className="w-3.5 h-3.5" />
                        {item.designation}
                      </p>
                    )}

                    <p className="text-xs text-gray-500 flex items-center gap-2">
                      <Cake className="w-3.5 h-3.5" />
                      <span className="font-medium">{item.age}</span>
                      <span className="text-gray-400">•</span>
                      <span>{item.date_of_birth}</span>
                    </p>
                  </div>

                  {group.send_wishes && (
                    <button
                      disabled={sendingId === item.id || item.wished}
                      onClick={() => handleWishSend(item)}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all
    ${item.wished
                          ? "bg-green-100 text-green-700 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"}
    ${sendingId === item.id ? "opacity-70 cursor-wait" : ""}
  `}
                    >
                      <Send className="w-4 h-4" />
                      {sendingId === item.id
                        ? "Sending..."
                        : item.wished
                          ? "Wished"
                          : "Send Wishes"}
                    </button>

                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        {showConfetti && (
          <Confetti
            recycle={false}
            numberOfPieces={3000}
          />
        )}
      </div>
    );
  };

  // MONTHLY AVATAR STACK COMPONENT
  const MonthlyAvatarStack = ({ title, groups, icon: Icon }) => {
    if (!groups || groups.length === 0) return null;

    return (
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        </div>

        <div className="space-y-8">
          {groups.map((month, idx) => {
            const items = month.items || [];

            return (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <p className="font-semibold text-gray-900 text-lg">{month.text}</p>
                  <span className="ml-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                    {items.length} {items.length === 1 ? 'birthday' : 'birthdays'}
                  </span>
                </div>

                <div className="flex items-center flex-wrap gap-3">
                  {items.slice(0, 5).map((item, i) => (
                    <div
                      key={i}
                      className="relative group cursor-pointer transform hover:scale-110 transition-transform duration-200"
                    >
                      <div className="relative">
                        <img
                          src={item.image_url || "/no-user.png"}
                          alt={item.name}
                          className="w-14 h-14 rounded-full border-4 border-white shadow-lg object-cover ring-2 ring-purple-200"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full p-1">
                          <Cake className="w-3 h-3 text-white" />
                        </div>
                      </div>

                      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 hidden group-hover:block z-10 animate-in fade-in duration-200">
                        <div className="bg-gray-900 text-white rounded-xl shadow-2xl p-4 w-60">
                          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-900 rotate-45"></div>
                          <p className="font-bold text-sm mb-2">{item.name}</p>

                          {item.roll_number && (
                            <p className="text-gray-300 text-xs mb-1">
                              Roll {item.roll_number} • {item.class?.name}
                            </p>
                          )}

                          {item.designation && (
                            <p className="text-gray-300 text-xs mb-1 flex items-center gap-1">
                              <Briefcase className="w-3 h-3" />
                              {item.designation}
                            </p>
                          )}

                          <p className="text-gray-400 text-xs flex items-center gap-1 mt-2 pt-2 border-t border-gray-700">
                            <Cake className="w-3 h-3" />
                            {item.age} • {item.date_of_birth}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {items.length > 5 && (
                    <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 border-4 border-white shadow-lg">
                      <span className="text-sm font-bold text-purple-700">+{items.length - 5}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
        <div className=" mx-auto">

          {/* HEADER */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                <Cake className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Recent Birthdays
              </h1>
            </div>
            <p className="text-gray-600 ml-16">Celebrate special moments with your team</p>
          </div>

          {loadingRecent && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading birthdays...</p>
            </div>
          )}

          {errorRecent && (
            <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-xl">
              <p className="text-red-700 font-medium">{errorRecent}</p>
            </div>
          )}

          {!loadingRecent && !errorRecent && (
            <>
              {/* TABS */}
              <div className="flex gap-4 mb-8 bg-white p-2 rounded-2xl shadow-md border border-gray-100 inline-flex">
                <button
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${activeRecentTab === "students"
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105"
                    : "text-gray-600 hover:bg-gray-50"
                    }`}
                  onClick={() => setActiveRecentTab("students")}
                >
                  <Users className="w-5 h-5" />
                  Students
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${activeRecentTab === "students"
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-700"
                    }`}>
                    {recent?.students?.length || 0}
                  </span>
                </button>

                <button
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${activeRecentTab === "staff"
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105"
                    : "text-gray-600 hover:bg-gray-50"
                    }`}
                  onClick={() => setActiveRecentTab("staff")}
                >
                  <Briefcase className="w-5 h-5" />
                  Staff
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${activeRecentTab === "staff"
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-700"
                    }`}>
                    {recent?.staff?.length || 0}
                  </span>
                </button>
              </div>

              {/* TAB CONTENT */}
              {activeRecentTab === "students" && (
                <DetailedList groups={recent?.students} />
              )}
              {activeRecentTab === "staff" && (
                <DetailedList groups={recent?.staff} />
              )}
            </>
          )}

          {/* MONTHLY BIRTHDAYS SECTION */}
          <div className="mt-16 pt-12 border-t-2 border-gray-200">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Per Month
              </h1>
            </div>

            {loadingMonthly && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading monthly birthdays...</p>
              </div>
            )}

            {errorMonthly && (
              <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-xl">
                <p className="text-red-700 font-medium">{errorMonthly}</p>
              </div>
            )}

            {!loadingMonthly && !errorMonthly && (
              <>
                <MonthlyAvatarStack title="Students" groups={monthly?.students} icon={Users} />
                <MonthlyAvatarStack title="Staff" groups={monthly?.staff} icon={Briefcase} />
              </>
            )}
          </div>
        </div>
      </div>
      {/* Success/Error Notifications */}
      {success && (
        <div className="fixed top-4 right-4 flex items-center bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl shadow-lg z-50 transition-all duration-300 animate-in fade-in slide-in-from-right-1">
          <span className="text-sm font-medium">{success}</span>
        </div>
      )}

      {error && (
        <div className="fixed top-4 right-4 flex items-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl shadow-lg z-50 transition-all duration-300 animate-in fade-in slide-in-from-right-1">
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

    </>
  );
}