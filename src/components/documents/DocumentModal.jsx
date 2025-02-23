import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

import DocumentModalTabs from './DocumentModalTabs';
import DocumentModalOverview from './DocumentModalOverview';
import DocumentModalStats from './DocumentModalStats';
import DocumentModalHistory from './DocumentModalHistory';

export default function DocumentModal({ 
  isOpen, 
  onClose, 
  document,
  onDocumentChange 
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);

  const handleDocumentChange = (updatedDocument) => {
    onDocumentChange(updatedDocument);
    setIsEditing(false);
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity dark:bg-gray-900 dark:bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-5xl">
                <div className="absolute right-0 top-0 pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={onClose}
                  >
                    <span className="sr-only">Fermer</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <DocumentModalTabs
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                />

                <div className="h-[calc(100vh-16rem)] overflow-y-auto">
                  {activeTab === 'overview' && (
                    <DocumentModalOverview
                      document={document}
                      isEditing={isEditing}
                      onDocumentChange={handleDocumentChange}
                    />
                  )}
                  {activeTab === 'stats' && (
                    <DocumentModalStats document={document} />
                  )}
                  {activeTab === 'history' && (
                    <DocumentModalHistory document={document} />
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
