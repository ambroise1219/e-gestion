import { 
  DocumentArrowDownIcon,
  EyeIcon,
  UserIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DocumentModalStats({ document }) {
  // Exemple de données pour les statistiques
  const viewsData = [
    { name: 'Jan', views: 12 },
    { name: 'Fév', views: 19 },
    { name: 'Mar', views: 15 },
    { name: 'Avr', views: 25 },
    { name: 'Mai', views: 22 },
    { name: 'Juin', views: 30 },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Téléchargements
              </p>
              <p className="mt-1 text-2xl font-semibold text-pro-lime">
                {document.downloads || 0}
              </p>
            </div>
            <div className="p-3 bg-pro-lime bg-opacity-10 rounded-full">
              <DocumentArrowDownIcon className="h-6 w-6 text-pro-lime" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Vues
              </p>
              <p className="mt-1 text-2xl font-semibold text-pro-lime">
                {document.views || 0}
              </p>
            </div>
            <div className="p-3 bg-pro-lime bg-opacity-10 rounded-full">
              <EyeIcon className="h-6 w-6 text-pro-lime" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Utilisateurs uniques
              </p>
              <p className="mt-1 text-2xl font-semibold text-pro-lime">
                {document.uniqueUsers || 0}
              </p>
            </div>
            <div className="p-3 bg-pro-lime bg-opacity-10 rounded-full">
              <UserIcon className="h-6 w-6 text-pro-lime" />
            </div>
          </div>
        </div>
      </div>

      {/* Graphique des vues */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Historique des vues
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={viewsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1A1A1A',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: '#fff'
                }}
              />
              <Bar dataKey="views" fill="#CCFF00" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Timeline d'activité */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Activité récente
        </h3>
        <div className="flow-root">
          <ul className="-mb-8">
            {document.activities?.map((activity, index) => (
              <li key={activity.id}>
                <div className="relative pb-8">
                  {index !== document.activities.length - 1 && (
                    <span
                      className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                      aria-hidden="true"
                    />
                  )}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-pro-lime flex items-center justify-center">
                        <ClockIcon className="h-5 w-5 text-pro-black" />
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {activity.description}
                        </p>
                      </div>
                      <div className="whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">
                        {activity.date}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
