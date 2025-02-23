'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';

export default function WeeklyCalendar({ events, currentDate, onEventClick }) {
  const weekDays = useMemo(() => {
    const days = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  }, [currentDate]);

  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 8; hour <= 18; hour++) {
      slots.push(`${hour}:00`);
    }
    return slots;
  }, []);

  const getEventStyle = (event) => {
    const startTime = new Date(event.start);
    const endTime = new Date(event.end);
    const dayIndex = weekDays.findIndex(day => 
      day.toDateString() === startTime.toDateString()
    );
    
    if (dayIndex === -1) return null;

    const startHour = startTime.getHours();
    const startMinutes = startTime.getMinutes();
    const endHour = endTime.getHours();
    const endMinutes = endTime.getMinutes();

    const top = ((startHour - 8) * 60 + startMinutes) * (100 / (60 * 11));
    const height = ((endHour - startHour) * 60 + (endMinutes - startMinutes)) * (100 / (60 * 11));

    const typeColors = {
      meeting: 'bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-200',
      delivery: 'bg-green-100 border-green-300 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-200',
      inspection: 'bg-yellow-100 border-yellow-300 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-200',
      training: 'bg-purple-100 border-purple-300 text-purple-800 dark:bg-purple-900 dark:border-purple-700 dark:text-purple-200',
      maintenance: 'bg-orange-100 border-orange-300 text-orange-800 dark:bg-orange-900 dark:border-orange-700 dark:text-orange-200',
      visit: 'bg-teal-100 border-teal-300 text-teal-800 dark:bg-teal-900 dark:border-teal-700 dark:text-teal-200'
    };

    return {
      gridColumn: `${dayIndex + 1} / span 1`,
      top: `${top}%`,
      height: `${height}%`,
      className: `absolute w-[95%] p-2 rounded-md border text-xs overflow-hidden cursor-pointer ${typeColors[event.type] || 'bg-gray-100 border-gray-300 text-gray-800'}`
    };
  };

  const getEventPriority = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-4 border-l-red-500';
      case 'urgent':
        return 'border-l-4 border-l-red-600 animate-pulse';
      case 'low':
        return 'border-l-4 border-l-green-500';
      default:
        return 'border-l-4 border-l-gray-400';
    }
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        {/* En-tête des jours */}
        <div className="grid grid-cols-[auto_repeat(7,1fr)] border-b border-gray-200 dark:border-gray-700">
          <div className="p-4 border-r border-gray-200 dark:border-gray-700"></div>
          {weekDays.map((day, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`p-4 text-center border-r border-gray-200 dark:border-gray-700 ${
                day.toDateString() === new Date().toDateString()
                  ? 'bg-blue-50 dark:bg-blue-900/20'
                  : ''
              }`}
            >
              <div className="font-medium text-gray-900 dark:text-white">
                {day.toLocaleDateString('fr-FR', { weekday: 'short' })}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {day.getDate()}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Grille des heures */}
        <div className="grid grid-cols-[auto_repeat(7,1fr)] relative">
          {/* Colonne des heures */}
          <div className="border-r border-gray-200 dark:border-gray-700">
            {timeSlots.map((time, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
                className="h-20 border-b border-gray-200 dark:border-gray-700 p-2 text-sm text-gray-500 dark:text-gray-400"
              >
                {time}
              </motion.div>
            ))}
          </div>

          {/* Grille principale */}
          <div className="col-span-7 relative">
            {/* Lignes horizontales */}
            {timeSlots.map((_, index) => (
              <div
                key={index}
                className="h-20 border-b border-gray-200 dark:border-gray-700 grid grid-cols-7"
              >
                {[...Array(7)].map((_, dayIndex) => (
                  <div
                    key={dayIndex}
                    className="border-r border-gray-200 dark:border-gray-700"
                  />
                ))}
              </div>
            ))}

            {/* Ligne du temps actuelle */}
            <div
              className="absolute left-0 right-0 border-t-2 border-red-400 dark:border-red-600 z-10"
              style={{
                top: `${((new Date().getHours() - 8) * 60 + new Date().getMinutes()) * (100 / (60 * 11))}%`
              }}
            >
              <div className="absolute -left-2 -top-1.5 w-3 h-3 rounded-full bg-red-400 dark:bg-red-600" />
            </div>

            {/* Événements */}
            {events.map(event => {
              const style = getEventStyle(event);
              if (!style) return null;

              const { className, ...positionStyle } = style;
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  style={positionStyle}
                  className={`${className} ${getEventPriority(event.priority)}`}
                  onClick={() => onEventClick(event)}
                >
                  <div className="font-medium truncate">{event.title}</div>
                  <div className="truncate text-[10px] opacity-75">
                    {new Date(event.start).toLocaleTimeString('fr-FR', { 
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                    {event.location && ` • ${event.location}`}
                  </div>
                  {event.participants?.length > 0 && (
                    <div className="truncate text-[10px] opacity-75">
                      {event.participants.length} participant{event.participants.length > 1 ? 's' : ''}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
} 