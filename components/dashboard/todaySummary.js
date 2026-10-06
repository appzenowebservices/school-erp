'use client';
import React, { useEffect, useState } from 'react';
import { CalendarDays, MapPin, Clock, FileText, DollarSign, UserCheck, AlertCircle, CheckCircle } from 'lucide-react';
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
const TodaySummary = ({ context }) => {
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
    <>
    


                {/* Today's Summary */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Today's Summary</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-gray-700">Present Students</span>
                      </div>
                      <span className="font-bold text-green-600">1,198</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <span className="text-sm font-medium text-gray-700">Absent Students</span>
                      </div>
                      <span className="font-bold text-red-600">49</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <UserCheck className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium text-gray-700">Staff Present</span>
                      </div>
                      <span className="font-bold text-blue-600">84</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <DollarSign className="w-5 h-5 text-purple-600" />
                        <span className="text-sm font-medium text-gray-700">Fee Collected</span>
                      </div>
                      <span className="font-bold text-purple-600">₹12,500</span>
                    </div>
                  </div>
                </div>

    </>
  );
};

export default TodaySummary;
