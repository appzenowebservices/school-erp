'use client';
import React, { useEffect, useState } from 'react';
import { CalendarDays, MapPin, Clock, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { getEvents } from '../../api/event';
import { getSessionCache } from '../../utils/sessionCache';
import ChartLoadingSkeleton from '../ui/status/ChartLoadingSkeleton';

// =============================
// Utility: Format date
// =============================
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

// =============================
// Component
// =============================
const RecentActivites = ({ context }) => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const resp = await getEvents(context?.profileId, context?.session);
      const fetched = resp?.data?.results?.events || [];
      setEvents(fetched);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // =============================
  // Fallback dummy (for missing or empty data)
  // =============================
  const dummyEvents = [
    {
      id: '1',
      title: 'Annual Sports Day',
      description: 'A grand celebration of school sports and talent.',
      event_type: { name: 'Event', color: '#3B82F6' },
      start_date: '2025-12-15',
      end_date: '2025-12-15',
      display_time: '10:00 AM',
      venue: 'School Playground',
    },
    {
      id: '2',
      title: 'Parent-Teacher Meeting',
      description: 'Discussion on academic progress and upcoming exams.',
      event_type: { name: 'Meeting', color: '#F59E0B' },
      start_date: '2025-12-18',
      end_date: '2025-12-18',
      display_time: '02:00 PM',
      venue: 'Conference Hall',
    },
    {
      id: '3',
      title: 'Science Exhibition',
      description: 'Students showcase innovative scientific models.',
      event_type: { name: 'Academic', color: '#10B981' },
      start_date: '2025-12-22',
      end_date: '2025-12-22',
      display_time: '09:30 AM',
      venue: 'Main Auditorium',
    },
  ];

  const displayEvents =
    !isLoading && events.length > 0
      ? events.map((event) => ({
          id: event.id,
          title: event.title || 'Untitled Event',
          description:
            event.description || 'An engaging event with school participation.',
          event_type: event.event_type || {
            name: 'General',
            color: '#6366F1',
          },
          start_date: event.start_date,
          end_date: event.end_date,
          display_time:
            event.display_time?.trim() || '10:00 AM - 12:00 PM',
          venue: event.venue || 'Main Campus Grounds',
        }))
      : dummyEvents;

  // =============================
  // Render
  // =============================
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <CalendarDays className="w-5 h-5 text-blue-500" />
        Upcoming Events
      </h2>

      {isLoading ? (
        <ChartLoadingSkeleton count={4} />
      ) : (
        <div className="space-y-3">
          {displayEvents.map((event, index) => (
            <motion.div
              key={event.id || index}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-gray-100 rounded-lg hover:bg-blue-50/30 transition-all duration-200"
              whileHover={{ scale: 1.01 }}
            >
              {/* Left Section */}
              <div className="flex items-start gap-3 flex-1">
                <div
                  className="w-2 h-2 mt-2 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: event.event_type?.color || '#3B82F6',
                  }}
                ></div>

                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {event.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {event.event_type?.name}
                  </p>

                  {/* Description */}
                  {event.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2 flex items-start gap-1">
                      <FileText className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      {event.description}
                    </p>
                  )}

                  {/* Venue */}
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {event.venue || 'Main School Campus'}
                  </p>
                </div>
              </div>

              {/* Right Section */}
              <div className="text-right mt-3 sm:mt-0 sm:ml-4">
                <p className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                  {`${formatDate(event.start_date)}${
                    event.end_date && event.start_date !== event.end_date
                      ? ` - ${formatDate(event.end_date)}`
                      : ''
                  }`}
                </p>
                {event.display_time && (
                  <p className="text-[11px] text-gray-500 mt-1 flex items-center justify-end gap-1">
                    <Clock className="w-3 h-3" /> {event.display_time}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <button className="w-full mt-5 text-sm text-blue-600 hover:text-blue-800 font-medium">
        View Calendar →
      </button>
    </div>
  );
};

export default RecentActivites;
