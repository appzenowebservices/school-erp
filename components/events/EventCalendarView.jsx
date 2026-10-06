import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Calendar } from 'lucide-react';

const EventCalendarView = ({ calendarEvents }) => {
  
  const handleEventClick = (info) => {
    const { title, extendedProps, start, end } = info.event;
    alert(`${title}\n\n${extendedProps.description}\n\n📍 Venue: ${extendedProps.venue}\n🗓 ${start.toDateString()}${end ? ` - ${end.toDateString()}` : ''}\nStatus: ${extendedProps.status}`);
  };

  const renderEventContent = (info) => {
    const { type } = info.event.extendedProps;
    return (
      <div className="p-1 text-[11px] leading-tight">
        <p className="font-semibold text-white drop-shadow">{info.event.title}</p>
        <p className="text-white/90 text-[10px]">{type}</p>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-indigo-500" />
        <h3 className="text-lg font-bold text-gray-800">Calendar View</h3>
      </div>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek',
        }}
        events={calendarEvents}
        eventContent={renderEventContent}
        eventClick={handleEventClick}
        height="auto"
        dayMaxEvents={3}
        eventDisplay="block"
        eventTimeFormat={{ hour: '2-digit', minute: '2-digit', meridiem: false }}
      />
    </div>
  );
};

export default EventCalendarView;
