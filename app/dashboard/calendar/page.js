'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { getEvents, getEventTypes } from '../../../api/event';
import { getSessionCache } from '../../../utils/sessionCache';
import ChartLoadingSkeleton from '../../../components/ui/status/ChartLoadingSkeleton';
import Layout from '../../../layouts/Layout';
import { Breadcrumbs } from '../../../components/ui/Breadcrumb/breadcrumb';
import EventHeader from '../../../components/events/EventHeader';
import EventStatusSection from '../../../components/events/EventStatusSection';
import EventCalendarView from '../../../components/events/EventCalendarView';
import statusConfig from '../../../components/events/statusConfig';
import EventTypeDrawer from '../../../components/events/EventTypeDrawer';
// =====================================================================================
const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "School Calendar" },
];

// =====================================================================================
export default function EventInsightsDashboard() {
  // =====================================================================================
  const context = getSessionCache('dashboardContext');
  const profileId = context?.profileId;
  const session = context?.session;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [eventsType, setEventsType] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState('All');
  const today = new Date();
  // =====================================================================================
  
  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const resp = await getEvents(profileId, session);
      const fetched = resp?.data?.results?.events || [];
      setEvents(fetched);
    } catch (err) {
      console.error('Failed to fetch events:', err);
    } finally {
      setIsLoading(false);
    }
  };



  const fetchEventType = async () => {
    setIsLoading(true);
    try {
      const resp = await getEventTypes(profileId, session);
      const fetched = resp?.data?.results?.event_types || [];
      setEventsType(fetched);
    } catch (err) {
      console.error('Failed to fetch events:', err);
    } finally {
      setIsLoading(false);
    }
  };


  

  
  useEffect(() => {
    if (!profileId || !session) return;
    fetchEvents();
    fetchEventType()
  }, [profileId, session]);

  const enrichedEvents = useMemo(() => {
    return events.map(ev => {
      const start = new Date(ev.start_date + 'T' + (ev.start_time || '00:00:00'));
      const end = new Date(ev.end_date + 'T' + (ev.end_time || '23:59:59'));
      let status = 'Upcoming';
      if (end < today) status = 'Passed';
      else if (start <= today && today <= end) status = 'Ongoing';
      return { ...ev, start, end, status };
    });
  }, [events, today]);

  const filteredEvents = useMemo(() => {
    if (filterType === 'All') return enrichedEvents;
    return enrichedEvents.filter(ev => ev.event_type?.name === filterType);
  }, [enrichedEvents, filterType]);

  const stats = useMemo(() => {
    const total = enrichedEvents.length;
    return {
      total,
      upcoming: enrichedEvents.filter(ev => ev.status === 'Upcoming').length,
      ongoing: enrichedEvents.filter(ev => ev.status === 'Ongoing').length,
      passed: enrichedEvents.filter(ev => ev.status === 'Passed').length
    };
  }, [enrichedEvents]);

  const calendarEvents = useMemo(() => {
    return enrichedEvents.map(ev => ({
      id: ev.id,
      title: ev.title || 'Untitled Event',
      start: ev.start.toISOString(),
      end: ev.end.toISOString(),
      backgroundColor: statusConfig[ev.status].calColor,
      borderColor: statusConfig[ev.status].calBorder,
      extendedProps: {
        description: ev.description || 'No description',
        venue: ev.venue || 'Main Campus Grounds',
        type: ev.event_type?.name || 'General',
        status: ev.status,
      },
    }));
  }, [enrichedEvents]);

  const eventTypes = Array.from(new Set(enrichedEvents.map(ev => ev.event_type?.name).filter(Boolean)));

  if (isLoading) return <ChartLoadingSkeleton count={6} />;
  // =====================================================================================
  return (
    <Layout>
      <div
        className="min-h-[calc(100vh-100px)] p-6 space-y-6"
        style={{
          backgroundImage: "url('/bg/appbackground@2x.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Breadcrumbs items={breadcrumbs} />
        <button
          onClick={() => setDrawerOpen(true)}
          className="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          ⚙️ Settings
        </button>
        <EventTypeDrawer
          drawerOpen={drawerOpen}
          setDrawerOpen={setDrawerOpen}
          eventsType={eventsType}
          context={context}
        />
        {/* backdrop */}
        {drawerOpen && <div onClick={() => setDrawerOpen(false)} className="fixed inset-0 bg-black-50 bg-opacity-30 z-40"></div>}
        <EventHeader
          filterType={filterType}
          setFilterType={setFilterType}
          stats={stats}
          eventTypes={eventTypes}
        />
        <AnimatePresence mode="wait">
          {['Ongoing', 'Upcoming', 'Passed'].map(status => (
            <EventStatusSection
              key={status}
              status={status}
              events={filteredEvents.filter(ev => ev.status === status)}
              statusConfig={statusConfig}
            />
          ))}
        </AnimatePresence>
        <EventCalendarView
          calendarEvents={calendarEvents}
          statusConfig={statusConfig}
        />
      </div>
    </Layout>
  );
}
// =====================================================================================
