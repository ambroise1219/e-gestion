'use client';

import { Dialog } from '@headlessui/react';
import { XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function EventModal({ isOpen, event, onClose, onDelete }) {
  const handleDelete = () => {
    if (onDelete) {
      onDelete(event.id);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-lg w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
            <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">
              Détails de l'événement
            </Dialog.Title>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDelete}
                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                <TrashIcon className="w-6 h-6" />
              </button>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {event.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {event.project}
              </p>
            </div>

            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Date et heure
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(event.start).toLocaleString('fr-FR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                  {' - '}
                  {new Date(event.end).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Participants
                </p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {event.participants.map((participant, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
                    >
                      {participant}
                    </span>
                  ))}
                </div>
              </div>

              {event.description && (
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {event.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 