import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function ProjectModalTasks({ project, isEditing, onProjectChange }) {
  const handleAddTask = () => {
    const newTask = {
      id: Date.now(),
      name: 'Nouvelle tâche',
      status: 'pending',
      progress: 0
    };
    onProjectChange({
      ...project,
      tasks: [...project.tasks, newTask]
    });
  };

  const handleUpdateTask = (taskId, updates) => {
    onProjectChange({
      ...project,
      tasks: project.tasks.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    });
  };

  const handleDeleteTask = (taskId) => {
    onProjectChange({
      ...project,
      tasks: project.tasks.filter(task => task.id !== taskId)
    });
  };

  return (
    <div className="space-y-4">
      {project.tasks.map((task) => (
        <div
          key={task.id}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={task.name}
                  onChange={(e) => handleUpdateTask(task.id, { name: e.target.value })}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                />
              ) : (
                <h4 className="font-medium text-gray-900 dark:text-white">{task.name}</h4>
              )}
            </div>
            {isEditing && (
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="text-red-500 hover:text-red-600 ml-4"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                <span>Progression</span>
                <span>{task.progress}%</span>
              </div>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  disabled={!isEditing}
                  value={task.progress}
                  onChange={(e) => handleUpdateTask(task.id, { progress: parseInt(e.target.value) })}
                  className="flex-1 h-2 rounded-lg appearance-none cursor-pointer bg-gray-200 dark:bg-gray-700"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <select
                disabled={!isEditing}
                value={task.status}
                onChange={(e) => handleUpdateTask(task.id, { status: e.target.value })}
                className="rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-sm"
              >
                <option value="pending">En attente</option>
                <option value="in_progress">En cours</option>
                <option value="completed">Terminé</option>
              </select>

              <span className={`px-2 py-1 text-xs rounded-full ${
                task.status === 'completed'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : task.status === 'in_progress'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
              }`}>
                {task.status === 'completed' ? 'Terminé' : task.status === 'in_progress' ? 'En cours' : 'En attente'}
              </span>
            </div>
          </div>
        </div>
      ))}

      {isEditing && (
        <button
          onClick={handleAddTask}
          className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-600 transition-colors flex items-center justify-center space-x-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Ajouter une tâche</span>
        </button>
      )}
    </div>
  );
}