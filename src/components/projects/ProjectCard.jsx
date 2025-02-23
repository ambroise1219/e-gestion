import {
  CalendarIcon,
  BanknotesIcon,
  ChartBarIcon,
  DocumentIcon
} from '@heroicons/react/24/outline';

const formatFCFA = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function ProjectCard({ project, onClick }) {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'en cours':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'terminé':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'en pause':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'annulé':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 75) return 'bg-green-600 dark:bg-green-500';
    if (progress >= 50) return 'bg-blue-600 dark:bg-blue-500';
    if (progress >= 25) return 'bg-yellow-600 dark:bg-yellow-500';
    return 'bg-red-600 dark:bg-red-500';
  };

  const calculateDelay = () => {
    const endDate = new Date(project.endDate);
    const today = new Date();
    const remainingDays = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
    return remainingDays;
  };

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 cursor-pointer border border-gray-200 dark:border-gray-700"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{project.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
            {project.description}
          </p>
        </div>
        <span className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusColor(project.status)}`}>
          {project.status}
        </span>
      </div>

      <div className="space-y-4">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
            <span>Progression</span>
            <span>{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(project.progress)}`}
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2 text-sm">
            <CalendarIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <span className="text-gray-600 dark:text-gray-400">
              {calculateDelay()} jours restants
            </span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <BanknotesIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <span className="text-gray-600 dark:text-gray-400">
              {formatFCFA(project.budget)}
            </span>
          </div>
        </div>

        {/* Team and Budget Progress */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex -space-x-2">
            {project.team.slice(0, 3).map((member, index) => (
              <div
                key={member.id}
                className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center"
                title={member.name}
              >
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            ))}
            {project.team.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  +{project.team.length - 3}
                </span>
              </div>
            )}
          </div>
          <div className="text-sm font-medium">
            <span className="text-gray-900 dark:text-white">{formatFCFA(project.spent)}</span>
            <span className="text-gray-400 dark:text-gray-500"> / {formatFCFA(project.budget)}</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          <div className="flex items-center space-x-1 text-xs text-gray-600 dark:text-gray-400">
            <DocumentIcon className="w-4 h-4" />
            <span>{project.tasks?.length || 0} tâches</span>
          </div>
          <div className="flex items-center space-x-1 text-xs text-gray-600 dark:text-gray-400">
            <ChartBarIcon className="w-4 h-4" />
            <span>{Math.round((project.spent / project.budget) * 100)}% budget</span>
          </div>
          <div className="flex items-center space-x-1 text-xs text-gray-600 dark:text-gray-400">
            <CalendarIcon className="w-4 h-4" />
            <span>{new Date(project.startDate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}