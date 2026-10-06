import React from 'react';
import { motion } from 'framer-motion';
import EventCard from './EventCard';

const EventStatusSection = ({ status, events, statusConfig }) => {
  if (!events.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="m-4 flex items-center gap-2 mb-3">
        <div className={`w-2 h-2 rounded-full ${statusConfig[status].dot} animate-pulse`} />
        <h3 className="text-lg font-bold text-gray-800">{status} Events</h3>
        <span className="text-sm text-gray-500">({events.length})</span>
      </div>

      <div className="m-2 grid md:grid-cols-2 lg:grid-cols-3 gap-3 shadow-md rounded bg-blue-50 p-4">
        {events.map((ev, idx) => (
          <EventCard key={ev.id} ev={ev} idx={idx} status={status} statusConfig={statusConfig} />
        ))}
      </div>
    </motion.div>
  );
};

export default EventStatusSection;
