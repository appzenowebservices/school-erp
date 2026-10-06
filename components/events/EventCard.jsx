import React from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin } from 'lucide-react';

const EventCard = ({ ev, idx, status, statusConfig }) => {
  const style = statusConfig[status];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: idx * 0.05 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className={`${style.gradient} ${style.border} rounded-lg p-3 shadow-sm ${style.shadow} transition-all duration-200 cursor-pointer`}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-gray-900 text-base line-clamp-1">{ev.title}</h4>
        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${style.badge}`}>
          {ev.event_type?.name || 'General'}
        </span>
      </div>

      <div className="flex flex-col gap-1 text-sm text-gray-700 mb-2">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="font-medium">
            {ev.start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
          {ev.start.toDateString() !== ev.end.toDateString() && (
            <span>- {ev.end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="line-clamp-1">{ev.venue || 'Main Campus Grounds'}</span>
        </div>
      </div>

      <p className="text-sm text-gray-600 line-clamp-3 leading-snug">
        {ev.description || 'No description available'}
      </p>
    </motion.div>
  );
};

export default EventCard;
