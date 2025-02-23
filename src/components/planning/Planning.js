'use client';

import { useState, useEffect } from 'react';
import WeeklyCalendar from './WeeklyCalendar';
import PlanningStats from './PlanningStats';
import NewEventModal from './NewEventModal';
import EventModal from './EventModal';

// Événements de démonstration
const getDemoEvents = () => {
  const currentDate = new Date();
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1);

  return [
    {
      id: 1,
      title: 'Réunion d\'équipe',
      project: 'Projet Alpha',
      start: new Date(startOfWeek.getTime() + (9 * 60 + 30) * 60000),
      end: new Date(startOfWeek.getTime() + (11 * 60) * 60000),
      participants: ['Marie L.', 'Thomas D.', 'Sophie M.'],
      type: 'meeting'
    },
    {
      id: 2,
      title: 'Formation React',
      project: 'Formation',
      start: new Date(startOfWeek.getTime() + (24 * 60 + 13 * 60) * 60000),
      end: new Date(startOfWeek.getTime() + (24 * 60 + 17 * 60) * 60000),
      participants: ['Équipe Dev', 'Paul R.'],
      type: 'formation'
    },
    {
      id: 3,
      title: 'Point Client',
      project: 'Projet Beta',
      start: new Date(startOfWeek.getTime() + (48 * 60 + 14 * 60) * 60000),
      end: new Date(startOfWeek.getTime() + (48 * 60 + 15 * 60 + 30) * 60000),
      participants: ['Client XYZ', 'Julie M.', 'Marc P.'],
      type: 'client'
    },
    {
      id: 4,
      title: 'Sprint Review',
      project: 'Projet Gamma',
      start: new Date(startOfWeek.getTime() + (72 * 60 + 10 * 60) * 60000),
      end: new Date(startOfWeek.getTime() + (72 * 60 + 11 * 60) * 60000),
      participants: ['Équipe Projet', 'Sarah B.'],
      type: 'review'
    },
    {
      id: 5,
      title: 'Déjeuner d\'équipe',
      project: 'Social',
      start: new Date(startOfWeek.getTime() + (96 * 60 + 12 * 60) * 60000),
      end: new Date(startOfWeek.getTime() + (96 * 60 + 14 * 60) * 60000),
      participants: ['Toute l\'équipe'],
      type: 'social'
    }
  ];
};

export default function Planning() {
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [events, setEvents] = useState([]);

  // Charger les événements au démarrage
  useEffect(() => {
    const loadEvents = () => {
      const savedEvents = localStorage.getItem('planningEvents');
      if (savedEvents) {
        // Convertir les dates string en objets Date
        const parsedEvents = JSON.parse(savedEvents).map(event => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end)
        }));
        setEvents(parsedEvents);
      } else {
        // Si aucun événement n'existe, utiliser les événements de démo
        const demoEvents = getDemoEvents();
        setEvents(demoEvents);
        // Sauvegarder les événements de démo
        localStorage.setItem('planningEvents', JSON.stringify(demoEvents));
      }
    };

    loadEvents();
  }, []);

  // Sauvegarder les événements quand ils changent
  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem('planningEvents', JSON.stringify(events));
    }
  }, [events]);

  const handleEventClick = (event) => {
    setSelectedEvent({
      id: event.id,
      title: event.title,
      project: event.extendedProps.project,
      start: event.start,
      end: event.end,
      participants: event.extendedProps.participants,
      type: event.extendedProps.type
    });
  };

  const handleDateSelect = (selectInfo) => {
    setSelectedTimeSlot({
      start: selectInfo.start,
      end: selectInfo.end
    });
    setShowNewEventModal(true);
  };

  const handleNewEvent = (eventData) => {
    const newEvent = {
      id: Date.now(), // Utiliser le timestamp comme ID unique
      ...eventData,
      type: 'meeting', // Type par défaut pour les nouveaux événements
      start: new Date(eventData.start),
      end: new Date(eventData.end)
    };
    setEvents(prevEvents => [...prevEvents, newEvent]);
    setShowNewEventModal(false);
    setSelectedTimeSlot(null);
  };

  const handleEventDrop = (dropInfo) => {
    const { event, delta } = dropInfo;
    setEvents(prevEvents => {
      return prevEvents.map(evt => {
        if (evt.id === parseInt(event.id)) {
          return {
            ...evt,
            start: event.start,
            end: event.end
          };
        }
        return evt;
      });
    });
  };

  const handleEventResize = (resizeInfo) => {
    const { event } = resizeInfo;
    setEvents(prevEvents => {
      return prevEvents.map(evt => {
        if (evt.id === parseInt(event.id)) {
          return {
            ...evt,
            start: event.start,
            end: event.end
          };
        }
        return evt;
      });
    });
  };

  const handleDeleteEvent = (eventId) => {
    setEvents(prevEvents => prevEvents.filter(evt => evt.id !== eventId));
    setSelectedEvent(null);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Planning</h1>
        <button
          onClick={() => setShowNewEventModal(true)}
          className="btn-primary"
        >
          Nouvel événement
        </button>
      </div>

      <PlanningStats events={events} />
      
      <WeeklyCalendar
        events={events}
        currentDate={new Date()}
        onEventClick={handleEventClick}
        onDateSelect={handleDateSelect}
        onEventDrop={handleEventDrop}
        onEventResize={handleEventResize}
      />

      {showNewEventModal && (
        <NewEventModal
          isOpen={showNewEventModal}
          onClose={() => {
            setShowNewEventModal(false);
            setSelectedTimeSlot(null);
          }}
          onSubmit={handleNewEvent}
          selectedTimeSlot={selectedTimeSlot}
        />
      )}

      {selectedEvent && (
        <EventModal
          isOpen={!!selectedEvent}
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onDelete={handleDeleteEvent}
        />
      )}
    </div>
  );
}
