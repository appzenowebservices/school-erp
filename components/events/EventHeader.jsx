import React from 'react';
import { CalendarDays } from 'lucide-react';
import { motion } from 'framer-motion';

const EventHeader = ({ filterType, setFilterType, stats, eventTypes }) => {
  return (
    <div className="m-4 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 rounded-xl shadow-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
            <CalendarDays className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white">Event Insights</h2>
            <p className="text-blue-100 text-sm md:text-xs">Track and manage all school events</p>
          </div>
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-3 py-2 text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
        >
          <option value="All" className="text-gray-900">All Types</option>
          {eventTypes.map((type) => (
            <option key={type} value={type} className="text-gray-900">{type}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Events', value: stats.total, bg: 'bg-white/20', border: 'border-white/30' },
          { label: 'Upcoming', value: stats.upcoming, bg: 'bg-emerald-500/30', border: 'border-emerald-400/50' },
          { label: 'Ongoing', value: stats.ongoing, bg: 'bg-amber-500/30', border: 'border-amber-400/50' },
          { label: 'Passed', value: stats.passed, bg: 'bg-slate-500/30', border: 'border-slate-400/50' },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            whileHover={{ scale: 1.05 }}
            className={`${stat.bg} backdrop-blur-sm rounded-xl p-3 border ${stat.border} flex flex-col items-start`}
          >
            <p className="text-white/80 text-xs font-medium">{stat.label}</p>
            <p className="text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default EventHeader;
