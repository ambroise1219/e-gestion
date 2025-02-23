import { 
  DocumentIcon,
  DocumentArrowDownIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

export default function DocumentModalHistory({ document }) {
  const getActionIcon = (action) => {
    switch (action) {
      case 'download':
        return <DocumentArrowDownIcon className="h-5 w-5" />;
      case 'view':
        return <EyeIcon className="h-5 w-5" />;
      case 'edit':
        return <PencilIcon className="h-5 w-5" />;
      case 'delete':
        return <TrashIcon className="h-5 w-5" />;
      case 'restore':
        return <ArrowPathIcon className="h-5 w-5" />;
      default:
        return <DocumentIcon className="h-5 w-5" />;
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'download':
        return 'text-blue-500 bg-blue-100 dark:bg-blue-900';
      case 'view':
        return 'text-green-500 bg-green-100 dark:bg-green-900';
      case 'edit':
        return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900';
      case 'delete':
        return 'text-red-500 bg-red-100 dark:bg-red-900';
      case 'restore':
        return 'text-purple-500 bg-purple-100 dark:bg-purple-900';
      default:
        return 'text-gray-500 bg-gray-100 dark:bg-gray-900';
    }
  };

  return (
    <div className="p-6">
      <div className="flow-root">
        <ul className="-mb-8">
          {document.history?.map((event, eventIdx) => (
            <li key={event.id}>
              <div className="relative pb-8">
                {eventIdx !== document.history.length - 1 ? (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex space-x-3">
                  <div>
                    <span
                      className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-gray-900 ${getActionColor(
                        event.action
                      )}`}
                    >
                      {getActionIcon(event.action)}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {event.description}{' '}
                        <span className="font-medium text-gray-500 dark:text-gray-400">
                          par {event.user}
                        </span>
                      </p>
                      {event.note && (
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          Note: {event.note}
                        </p>
                      )}
                    </div>
                    <div className="text-right text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                      <time dateTime={event.datetime}>{event.date}</time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {(!document.history || document.history.length === 0) && (
          <div className="text-center py-12">
            <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              Aucun historique
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Aucune activité n'a été enregistrée pour ce document.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
