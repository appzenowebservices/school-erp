"use client";
import React, { useEffect, useState } from "react";
import { Users, User, Phone, Home, Filter, Search, ChevronDown } from "lucide-react";
import { getSiblingsList } from '../../api/siblings';
// ==============================================================
export default function Siblings({ context, config }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  // ==============================================================

  const classOptions = React.useMemo(() => {
    return (
      config?.standards?.flatMap((std) =>
        std.classes?.map((cls) => ({
          id: cls.id,
          name: cls.name,
          standardName: std.name
        }))
      ) || []
    );
  }, [config?.standards]);
  // ==============================================================

  const fetchSiblings = async () => {
    try {
      setLoading(true);
      const res = await getSiblingsList(
        context?.profileId,
        context?.session,
        selectedClassId || undefined
      );
      console.log('res___', selectedClassId, res);
      setData(res?.data?.results?.siblings || []);
    } catch (e) {
      setError("Failed to load sibling data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSiblings();
  }, [selectedClassId]);
  // ==============================================================

  const filteredData = React.useMemo(() => {
    if (!searchTerm) return data;

    const q = searchTerm.toLowerCase();

    return data.filter(group => {
      // student
      const studentMatch =
        group.student?.name?.toLowerCase().includes(q) ||
        group.student?.registered_phone_form_sms?.includes(q);

      // parents
      const parentMatch = group.parents?.some(p =>
        p.name?.toLowerCase().includes(q) ||
        p.phone?.includes(q)
      );

      // siblings
      const siblingMatch = group.siblings?.some(sib =>
        sib.name?.toLowerCase().includes(q) ||
        sib.registered_phone_form_sms?.includes(q)
      );

      return studentMatch || parentMatch || siblingMatch;
    });
  }, [data, searchTerm]);

  // ==============================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-violet-200 rounded-full animate-ping opacity-75" />
            <div className="absolute inset-0 border-4 border-t-violet-600 border-r-purple-600 border-b-fuchsia-600 border-l-violet-600 rounded-full animate-spin" />
          </div>
          <p className="text-lg font-medium text-gray-700">Loading families</p>
          <p className="text-sm text-gray-500 mt-1">Gathering sibling connections...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl border border-red-100 p-8 max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Oops!</h3>
          <p className="text-gray-600 text-center">{error}</p>
        </div>
      </div>
    );
  }
  // ==============================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-violet-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-fuchsia-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="relative  mx-auto px-6 py-8">
        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-2xl blur-lg opacity-50" />
              <div className="relative p-4 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-2xl shadow-xl">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent mb-1">
                Family Connections
              </h1>
              <p className="text-gray-600 font-medium">
                Discover sibling relationships across your school
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <div className="px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-violet-200 shadow-sm">
              <span className="font-bold text-violet-600">{filteredData.length}</span>
              <span className="text-gray-600 ml-1">families</span>
            </div>
            <div className="px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-purple-200 shadow-sm">
              <span className="font-bold text-purple-600">
                {filteredData.reduce((acc, g) => acc + g.siblings.length + 1, 0)}
              </span>
              <span className="text-gray-600 ml-1">students</span>
            </div>
          </div>
        </div>

        {/* SEARCH AND FILTER BAR */}
        <div className="mb-8 bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 relative z-30">          <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by student, parent name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Class Filter */}
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-all font-medium text-gray-700"
            >
              <Filter className="w-5 h-5" />
              <span>{selectedClassId ? classOptions.find(c => c.id === selectedClassId)?.name : "All Classes"}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>

            {isFilterOpen && (
              <div className="absolute top-full mt-2 right-0 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 py-2  max-h-96 overflow-y-auto">
                <button
                  onClick={() => {
                    setSelectedClassId("");
                    setIsFilterOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 hover:bg-violet-50 transition-colors ${!selectedClassId ? 'bg-violet-50 text-violet-700 font-semibold' : 'text-gray-700'}`}
                >
                  All Classes
                </button>
                {classOptions.map((cls) => (
                  <button
                    key={cls.id}
                    onClick={() => {
                      setSelectedClassId(cls.id);
                      setIsFilterOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 hover:bg-violet-50 transition-colors ${selectedClassId === cls.id ? 'bg-violet-50 text-violet-700 font-semibold' : 'text-gray-700'}`}
                  >
                    <div className="font-medium">{cls.name}</div>
                    <div className="text-xs text-gray-500">{cls.standardName}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>




        </div>

        {/* EMPTY STATE */}
        {filteredData.length === 0 && (
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-violet-100 to-fuchsia-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-violet-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No families found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* LIST */}
        <div className="grid gap-6">
          {filteredData.map((group, idx) => (
            <SiblingCard key={idx} group={group} index={idx} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------------------- SUB COMPONENTS -------------------- */

function SiblingCard({ group, index }) {
  const { student, parents, siblings } = group;
  const [isExpanded, setIsExpanded] = useState(true);

  const gradients = [
    'from-violet-500 to-purple-600',
    'from-purple-500 to-fuchsia-600',
    'from-fuchsia-500 to-pink-600',
    'from-blue-500 to-violet-600',
  ];
  const gradient = gradients[index % gradients.length];

  return (
    <div className="group bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300">
      {/* STUDENT HEADER */}
      <div className={`bg-gradient-to-r ${gradient} p-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar
              name={student?.name}
              gradient={gradient}
              image={student?.image_url}
            />
            <div className="text-white">
              <h2 className="text-2xl font-bold mb-1">
                {student?.name}
              </h2>
              <div className="flex items-center gap-3 text-sm text-white/90">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full font-medium">
                  {student?.class?.name || "No class"}
                </span>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full font-medium">
                  Roll {student?.roll_number || "-"}
                </span>
              </div>
              {student?.registered_phone_form_sms && (
                <p className="text-sm text-white/90 flex items-center gap-2 mt-2">
                  <Phone className="w-4 h-4" />
                  {student.registered_phone_form_sms}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-white/20 rounded-xl transition-colors"
          >
            <ChevronDown className={`w-6 h-6 text-white transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* EXPANDABLE CONTENT */}
      <div className={`transition-all duration-300 ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="p-6 space-y-6">
          {/* PARENTS */}
          <div>
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-lg">
              <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg">
                <Home className="w-4 h-4 text-white" />
              </div>
              Parents & Guardians
            </h3>
            <div className="flex flex-wrap gap-3">
              {parents.map((p) => (
                <div
                  key={p.id}
                  className="group px-4 py-2 rounded-xl text-sm bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 text-gray-800 font-medium hover:shadow-md transition-all"
                >
                  <span className="font-semibold">{p.name}</span>
                  <span className="text-gray-600 ml-1">({p.relation})</span>
                </div>
              ))}
            </div>
          </div>

          {/* SIBLINGS */}
          <div>
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-lg">
              <div className={`p-2 bg-gradient-to-br ${gradient} rounded-lg`}>
                <Users className="w-4 h-4 text-white" />
              </div>
              Siblings
              <span className="ml-2 px-3 py-1 bg-gray-100 rounded-full text-sm font-bold text-gray-700">
                {siblings.length}
              </span>
            </h3>

            {siblings.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-2xl">
                <p className="text-gray-500">No siblings found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {siblings.map((sib) => (
                  <div
                    key={sib.id}
                    className="group bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-2xl p-4 hover:shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    <div className="flex items-start gap-3">
                      <Avatar name={sib.name} small gradient={gradient} />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 truncate">{sib.name}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          <span className="text-xs px-2 py-1 bg-white rounded-full text-gray-700 font-medium">
                            {sib.class?.name || "No class"}
                          </span>
                          <span className="text-xs px-2 py-1 bg-white rounded-full text-gray-700 font-medium">
                            Roll {sib.roll_number || "-"}
                          </span>
                        </div>
                        {sib.registered_phone_form_sms && (
                          <p className="text-xs text-gray-600 flex items-center gap-1 mt-2">
                            <Phone className="w-3 h-3" />
                            <span className="truncate">{sib.registered_phone_form_sms}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Avatar({ name, small, gradient, image }) {
  return (
    <div className="relative group">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient || 'from-violet-500 to-fuchsia-600'} rounded-full blur opacity-50 group-hover:opacity-75 transition-opacity`} />
      <div
        className={`relative flex items-center justify-center rounded-full bg-gradient-to-br ${gradient || 'from-violet-500 to-fuchsia-600'} text-white font-bold shadow-lg overflow-hidden ${small ? "w-12 h-12 text-base" : "w-16 h-16 text-2xl"
          }`}
      >
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          name?.charAt(0)?.toUpperCase() || <User className={small ? "w-5 h-5" : "w-7 h-7"} />
        )}
      </div>
    </div>
  );
}

// Add these keyframes to your global CSS or style tag
const style = document.createElement('style');
style.textContent = `
  @keyframes blob {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0px, 0px) scale(1); }
  }
  .animate-blob {
    animation: blob 7s infinite;
  }
  .animation-delay-2000 {
    animation-delay: 2s;
  }
  .animation-delay-4000 {
    animation-delay: 4s;
  }
`;
document.head.appendChild(style);