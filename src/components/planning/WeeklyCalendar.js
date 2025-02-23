'use client';

import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';

const eventColors = {
  meeting: {
    backgroundColor: '#93C5FD',
    borderColor: '#3B82F6',
    textColor: '#1E3A8A'
  },
  formation: {
    backgroundColor: '#A7F3D0',
    borderColor: '#10B981',
    textColor: '#065F46'
  },
  client: {
    backgroundColor: '#FDE68A',
    borderColor: '#F59E0B',
    textColor: '#92400E'
  },
  review: {
    backgroundColor: '#DDD6FE',
    borderColor: '#8B5CF6',
    textColor: '#5B21B6'
  },
  social: {
    backgroundColor: '#FECACA',
    borderColor: '#EF4444',
    textColor: '#991B1B'
  }
};

export default function WeeklyCalendar({ 
  events, 
  currentDate, 
  onEventClick, 
  onDateSelect,
  onEventDrop,
  onEventResize 
}) {
  const [view, setView] = useState('timeGridWeek');

  const formattedEvents = events.map(event => ({
    id: event.id,
    title: event.title,
    start: event.start,
    end: event.end,
    extendedProps: {
      project: event.project,
      participants: event.participants,
      type: event.type
    },
    ...eventColors[event.type] || eventColors.meeting
  }));

  const handleEventClick = (clickInfo) => {
    if (onEventClick) {
      onEventClick(clickInfo.event);
    }
  };

  const handleDateSelect = (selectInfo) => {
    if (onDateSelect) {
      onDateSelect(selectInfo);
    }
  };

  const handleEventDrop = (dropInfo) => {
    if (onEventDrop) {
      onEventDrop(dropInfo);
    }
  };

  const handleEventResize = (resizeInfo) => {
    if (onEventResize) {
      onEventResize(resizeInfo);
    }
  };

  return (
    <div className="h-[700px] bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={view}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        locale={frLocale}
        initialDate={currentDate}
        events={formattedEvents}
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        slotMinTime="07:00:00"
        slotMaxTime="20:00:00"
        allDaySlot={false}
        eventClick={handleEventClick}
        select={handleDateSelect}
        eventDrop={handleEventDrop}
        eventResize={handleEventResize}
        height="100%"
        slotDuration="00:30:00"
        nowIndicator={true}
        businessHours={{
          daysOfWeek: [1, 2, 3, 4, 5],
          startTime: '09:00',
          endTime: '18:00',
        }}
        eventContent={(eventInfo) => {
          return (
            <div className="p-1">
              <div className="font-semibold">{eventInfo.event.title}</div>
              <div className="text-xs opacity-75">{eventInfo.event.extendedProps.project}</div>
            </div>
          );
        }}
        themeSystem="standard"
        className="fc-theme-standard dark:fc-theme-dark"
      />
    </div>
  );
}
