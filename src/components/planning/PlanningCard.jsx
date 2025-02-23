'use client';

import { 
  CalendarIcon, 
  ClockIcon, 
  UserGroupIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  ExclamationCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

export default function PlanningCard({ event, onClick }) {
  const getEventTypeColor = (type) => {
    switch (type) {
      case 'meeting':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'delivery':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'inspection':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'training':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
      case 'maintenance':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100';
      case 'visit':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const getEventTypeLabel = (type) => {
    switch (type) {
      case 'meeting':
        return 'Réunion';
      case 'delivery':
        return 'Livraison';
      case 'inspection':
        return 'Inspection';
      case 'training':
        return 'Formation';
      case 'maintenance':
        return 'Maintenance';
      case 'visit':
        return 'Visite';
      default:
        return 'Autre';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'urgent':
        return 'bg-red-200 text-red-900 dark:bg-red-900 dark:text-red-100 animate-pulse';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high':
        return 'Haute';
      case 'urgent':
        return 'Urgente';
      case 'low':
        return 'Basse';
      default:
        return 'Normale';
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <ExclamationCircleIcon className="w-5 h-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer p-4 border border-gray-200 dark:border-gray-700 ${
        event.priority === 'urgent' ? 'border-l-4 border-l-red-500' :
        event.priority === 'high' ? 'border-l-4 border-l-red-400' :
        event.priority === 'low' ? 'border-l-4 border-l-green-400' :
        'border-l-4 border-l-gray-400'
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            {event.title}
            {getStatusIcon(event.status)}
          </h3>
          <div className="flex flex-wrap gap-2 mt-1">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
              {getEventTypeLabel(event.type)}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(event.priority)}`}>
              {getPriorityLabel(event.priority)}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center text-gray-600 dark:text-gray-300">
          <BuildingOfficeIcon className="w-5 h-5 mr-2" />
          <span className="text-sm">{event.project}</span>
        </div>

        <div className="flex items-center text-gray-600 dark:text-gray-300">
          <ClockIcon className="w-5 h-5 mr-2" />
          <span className="text-sm">
            {formatTime(event.start)} - {formatTime(event.end)}
          </span>
        </div>

        <div className="flex items-center text-gray-600 dark:text-gray-300">
          <CalendarIcon className="w-5 h-5 mr-2" />
          <span className="text-sm">
            {new Date(event.start).toLocaleDateString('fr-FR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long'
            })}
          </span>
        </div>

        {event.location && (
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <MapPinIcon className="w-5 h-5 mr-2" />
            <span className="text-sm">{event.location}</span>
          </div>
        )}

        {event.participants && event.participants.length > 0 && (
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <UserGroupIcon className="w-5 h-5 mr-2" />
            <span className="text-sm">
              {event.participants.length} participant{event.participants.length > 1 ? 's' : ''}
            </span>
          </div>
        )}

        {event.description && (
          <div className="mt-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {event.description}
          </div>
        )}
      </div>

      {event.requiredEquipment && event.requiredEquipment.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {event.requiredEquipment.map((equipment, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
            >
              {equipment}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
} 