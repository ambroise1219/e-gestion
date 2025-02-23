'use client';

import {
  CalendarIcon,
  UserGroupIcon,
  ClockIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

export default function PlanningStats({ events }) {
  const currentDate = new Date();
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const stats = {
    weeklyEvents: events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate >= startOfWeek && eventDate <= endOfWeek;
    }).length,
    totalParticipants: events.reduce((acc, event) => acc + event.participants.length, 0),
    totalProjects: new Set(events.map(event => event.project)).size,
    averageDuration: events.reduce((acc, event) => {
      const start = new Date(event.start);
      const end = new Date(event.end);
      return acc + (end - start) / (1000 * 60); // en minutes
    }, 0) / events.length
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <CalendarIcon className="w-6 h-6 text-blue-600 dark:text-blue-300" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Événements cette semaine
            </p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {stats.weeklyEvents}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
            <UserGroupIcon className="w-6 h-6 text-green-600 dark:text-green-300" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total participants
            </p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {stats.totalParticipants}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
            <BuildingOfficeIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-300" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Projets concernés
            </p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {stats.totalProjects}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <ClockIcon className="w-6 h-6 text-purple-600 dark:text-purple-300" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Durée moyenne
            </p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {Math.round(stats.averageDuration)} min
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 