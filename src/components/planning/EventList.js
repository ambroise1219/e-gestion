'use client';

export default function EventList({ events }) {
  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div
          key={event.id}
          className="flex items-center p-4 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold">{event.title}</h3>
              <span className="text-sm text-gray-500">• {event.project}</span>
            </div>
            <div className="mt-1 text-sm text-gray-600">
              {new Date(event.start).toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit'
              })} - {new Date(event.end).toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {event.participants.map((participant) => (
                <span
                  key={participant}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                >
                  {participant}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
