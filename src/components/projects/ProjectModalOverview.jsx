import React from 'react';

export default function ProjectModalOverview({ project, isEditing, onProjectChange }) {
  return (
    <div className="space-y-6">
      {/* Project Details */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Statut</h4>
          <select
            disabled={!isEditing}
            value={project.status}
            onChange={(e) => onProjectChange({ ...project, status: e.target.value })}
            className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-pro-lime focus:border-pro-lime"
          >
            <option value="En cours">En cours</option>
            <option value="Terminé">Terminé</option>
            <option value="En pause">En pause</option>
            <option value="Annulé">Annulé</option>
          </select>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Progression</h4>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              disabled={!isEditing}
              value={project.progress}
              onChange={(e) => onProjectChange({ ...project, progress: parseInt(e.target.value) })}
              className="flex-1 h-2 rounded-lg appearance-none cursor-pointer bg-gray-200 dark:bg-gray-700"
              min="0"
              max="100"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400 w-12">
              {project.progress}%
            </span>
          </div>
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Date de début</h4>
          <input
            type="date"
            disabled={!isEditing}
            value={project.startDate}
            onChange={(e) => onProjectChange({ ...project, startDate: e.target.value })}
            className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-pro-lime focus:border-pro-lime"
          />
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Date de fin</h4>
          <input
            type="date"
            disabled={!isEditing}
            value={project.endDate}
            onChange={(e) => onProjectChange({ ...project, endDate: e.target.value })}
            className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-pro-lime focus:border-pro-lime"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Description</h4>
        <textarea
          disabled={!isEditing}
          value={project.description}
          onChange={(e) => onProjectChange({ ...project, description: e.target.value })}
          rows={4}
          className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-pro-lime focus:border-pro-lime"
          placeholder="Description détaillée du projet..."
        />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4">
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400">Tâches</h5>
          <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
            {project.tasks?.length || 0}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400">Documents</h5>
          <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
            {project.documents?.length || 0}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400">Membres</h5>
          <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
            {project.team?.length || 0}
          </p>
        </div>
      </div>
    </div>
  );
}