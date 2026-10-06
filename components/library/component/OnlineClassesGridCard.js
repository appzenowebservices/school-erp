import React from "react";
import {
  FaUser,
  FaClock,
  FaCalendarAlt,
  FaVideo,
  FaExternalLinkAlt,
  FaBookOpen
} from "react-icons/fa";
import { MdClass, MdAccessTime } from "react-icons/md";
import { BiCalendar } from "react-icons/bi";

export const OnlineClassesGridCard = ({ onlineClassesData, onClick }) => {
  const {
    _id,
    createdBy,
    subject,
    titleDescription,
    timings,
    info,
    startJoinLink,
    action
  } = onlineClassesData;

  console.log('onlineClassesData', onlineClassesData);

  const getSubjectBadge = (subject) => {
    switch (subject?.toLowerCase()) {
      case "mathematics":
        return {
          bg: "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200",
          text: "text-blue-800",
          dot: "bg-blue-500",
          icon: "🔢"
        };
      case "computer science":
        return {
          bg: "bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200",
          text: "text-purple-800",
          dot: "bg-purple-500",
          icon: "💻"
        };
      case "science":
        return {
          bg: "bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200",
          text: "text-emerald-800",
          dot: "bg-emerald-500",
          icon: "🔬"
        };
      case "history":
        return {
          bg: "bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200",
          text: "text-amber-800",
          dot: "bg-amber-400",
          icon: "📜"
        };
      case "english literature":
        return {
          bg: "bg-gradient-to-r from-rose-50 to-pink-50 border-rose-200",
          text: "text-rose-800",
          dot: "bg-rose-500",
          icon: "📚"
        };
      default:
        return {
          bg: "bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200",
          text: "text-gray-700",
          dot: "bg-gray-400",
          icon: "📖"
        };
    }
  };

  const getPlatformConfig = (platform) => {
    switch (platform?.toLowerCase()) {
      case "google meet":
        return {
          color: "from-green-500 to-emerald-500",
          bgColor: "from-green-50 to-emerald-50",
          borderColor: "border-green-200"
        };
      case "zoom":
        return {
          color: "from-blue-500 to-indigo-500",
          bgColor: "from-blue-50 to-indigo-50",
          borderColor: "border-blue-200"
        };
      case "microsoft teams":
        return {
          color: "from-purple-500 to-violet-500",
          bgColor: "from-purple-50 to-violet-50",
          borderColor: "border-purple-200"
        };
      default:
        return {
          color: "from-gray-500 to-slate-500",
          bgColor: "from-gray-50 to-slate-50",
          borderColor: "border-gray-200"
        };
    }
  };

  const subjectConfig = getSubjectBadge(subject);
  const platformConfig = getPlatformConfig(info?.platform);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const isUpcoming = new Date(timings?.date) > new Date();

  return (
    <div
      className="group relative bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 p-6 space-y-5 cursor-pointer w-full overflow-hidden transform hover:-translate-y-1"
      onClick={() => onClick && onClick(onlineClassesData)}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 via-transparent to-purple-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl"></div>
      
      {/* Class Header */}
      <div className="relative flex flex-wrap justify-between items-start gap-y-3">
        <div className="flex-1">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2 line-clamp-2">
            {titleDescription?.title}
          </h2>
          <div className="h-1 w-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
        </div>
        <div
          className={`flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-2xl border ${subjectConfig.bg} ${subjectConfig.text} backdrop-blur-sm`}
        >
          <span className="text-sm">{subjectConfig.icon}</span>
          <span className="capitalize">{subject}</span>
        </div>
      </div>

      {/* Description */}
      <div className="relative">
        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
          {titleDescription?.description}
        </p>
      </div>

      {/* Instructor Details */}
      <div className="relative bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-4 space-y-3 border border-gray-100">
        <div className="flex items-center gap-3 group/item hover:bg-white rounded-lg p-2 transition-colors duration-200">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full text-white">
            <FaUser className="text-sm" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Instructor</p>
            <p className="text-sm font-bold text-gray-900">{createdBy}</p>
          </div>
        </div>
      </div>

      {/* Timing and Platform Info */}
      <div className="relative flex flex-col gap-4">
        <div className={`bg-gradient-to-br ${platformConfig.bgColor} rounded-2xl p-4 border ${platformConfig.borderColor} hover:shadow-md transition-shadow duration-200`}>
          <div className="flex items-center gap-3 mb-2">
            <div className={`flex items-center justify-center w-10 h-10 bg-gradient-to-r ${platformConfig.color} rounded-xl text-white`}>
              <FaVideo className="text-lg" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Platform</p>
              <p className="text-sm font-bold text-gray-900">{info?.platform}</p>
              <p className="text-xs text-gray-600 font-medium">Duration: {info?.duration}</p>
            </div>
          </div>
        </div>
        
        <div className={`${isUpcoming ? 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200' : 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200'} rounded-2xl p-4 border hover:shadow-md transition-shadow duration-200`}>
          <div className="flex items-center gap-3 mb-2">
            <div className={`flex items-center justify-center w-10 h-10 ${isUpcoming ? 'bg-gradient-to-r from-emerald-500 to-green-500' : 'bg-gradient-to-r from-amber-500 to-yellow-500'} rounded-xl text-white`}>
              <FaCalendarAlt className="text-lg" />
            </div>
            <div>
              <p className={`text-xs font-semibold ${isUpcoming ? 'text-emerald-800' : 'text-amber-800'} uppercase tracking-wide`}>Schedule</p>
              <p className="text-sm font-bold text-gray-900">{formatDate(timings?.date)}</p>
              <p className={`text-xs ${isUpcoming ? 'text-emerald-600' : 'text-amber-600'} font-medium`}>{timings?.time}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Join Link and Status */}
      <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t border-dashed border-gray-200 gap-3">
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
          <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-r from-gray-500 to-slate-500 rounded-lg text-white">
            <MdClass className="text-xs" />
          </div>
          <span className="text-sm font-medium text-gray-700">
            Class ID: {_id}
          </span>
        </div>
        
        {isUpcoming && startJoinLink && (
          <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl px-3 py-2 hover:from-indigo-100 hover:to-purple-100 transition-colors duration-200">
            <FaExternalLinkAlt className="text-xs text-indigo-600" />
            <span className="text-sm font-semibold text-indigo-700">Ready to Join</span>
          </div>
        )}

        {!isUpcoming && (
          <div className="flex items-center gap-2 bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-xl px-3 py-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <span className="text-sm font-semibold text-gray-600">Past Class</span>
          </div>
        )}
      </div>

      {/* Hover effect indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#15487d] via-[#007aff] to-[#ddd] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
    </div>
  );
};