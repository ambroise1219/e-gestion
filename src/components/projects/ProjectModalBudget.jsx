const formatFCFA = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function ProjectModalBudget({ project, isEditing, onProjectChange }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Budget total</h4>
          <input
            type="number"
            disabled={!isEditing}
            value={project.budget}
            onChange={(e) => onProjectChange({ ...project, budget: parseInt(e.target.value) })}
            className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-pro-lime focus:border-pro-lime"
          />
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Dépenses actuelles</h4>
          <input
            type="number"
            disabled={!isEditing}
            value={project.spent}
            onChange={(e) => onProjectChange({ ...project, spent: parseInt(e.target.value) })}
            className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-pro-lime focus:border-pro-lime"
          />
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Progression du budget</h4>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
          <div
            className={`h-4 rounded-full transition-all duration-300 ${
              (project.spent / project.budget) * 100 > 90
                ? 'bg-red-600'
                : (project.spent / project.budget) * 100 > 75
                ? 'bg-yellow-600'
                : 'bg-green-600'
            }`}
            style={{ width: `${(project.spent / project.budget) * 100}%` }}
          />
        </div>
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {formatFCFA(project.spent)} sur {formatFCFA(project.budget)} ({Math.round((project.spent / project.budget) * 100)}%)
        </div>
      </div>

      {/* Budget Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4">
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400">Reste à dépenser</h5>
          <p className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">
            {formatFCFA(project.budget - project.spent)}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400">Coût par jour</h5>
          <p className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">
            {formatFCFA(Math.round(project.spent / (
              (new Date(project.endDate) - new Date(project.startDate)) / (1000 * 60 * 60 * 24)
            )))}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400">Budget restant</h5>
          <p className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">
            {Math.round((1 - project.spent / project.budget) * 100)}%
          </p>
        </div>
      </div>
    </div>
  );
}