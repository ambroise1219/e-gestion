import { useState } from 'react';
import { UserPlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function ProjectModalTeam({ project, isEditing, onProjectChange }) {
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', role: '' });

  // Initialiser project.team s'il n'existe pas
  if (!project.team) {
    onProjectChange({
      ...project,
      team: []
    });
  }

  const handleAddMember = () => {
    if (newMember.name && newMember.role) {
      onProjectChange({
        ...project,
        team: [...(project.team || []), { ...newMember, id: Date.now() }]
      });
      setNewMember({ name: '', role: '' });
      setShowAddMemberModal(false);
    }
  };

  const handleRemoveMember = (memberId) => {
    onProjectChange({
      ...project,
      team: project.team.filter(member => member.id !== memberId)
    });
  };

  // Fonction pour obtenir les initiales de manière sécurisée
  const getInitials = (name) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('');
  };

  return (
    <div className="space-y-4">
      {(project.team || []).map((member) => (
        <div
          key={member.id}
          className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {getInitials(member?.name)}
              </span>
            </div>
            <div className="ml-4">
              <h4 className="font-medium text-gray-900 dark:text-white">{member?.name || 'Sans nom'}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">{member?.role || 'Rôle non défini'}</p>
            </div>
          </div>
          {isEditing && (
            <button
              onClick={() => handleRemoveMember(member.id)}
              className="text-red-500 hover:text-red-600"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      ))}

      {isEditing && (
        <button
          onClick={() => setShowAddMemberModal(true)}
          className="flex items-center space-x-2 text-pro-lime hover:text-pro-lime/90"
        >
          <UserPlusIcon className="w-5 h-5" />
          <span>Ajouter un membre</span>
        </button>
      )}

      {/* Modal d'ajout de membre */}
      {showAddMemberModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Ajouter un membre
              </h3>
              <button
                onClick={() => setShowAddMemberModal(false)}
                className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nom complet
                </label>
                <input
                  type="text"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-pro-lime focus:border-pro-lime"
                  placeholder="Nom du membre"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Rôle
                </label>
                <select
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-pro-lime focus:border-pro-lime"
                >
                  <option value="">Sélectionner un rôle</option>
                  <option value="Chef de projet">Chef de projet</option>
                  <option value="Ingénieur">Ingénieur</option>
                  <option value="Technicien">Technicien</option>
                  <option value="Ouvrier">Ouvrier</option>
                  <option value="Chauffeur">Chauffeur</option>
                  <option value="Administratif">Administratif</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddMemberModal(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  onClick={handleAddMember}
                  className="px-4 py-2 bg-pro-lime text-black rounded-lg hover:bg-pro-lime/90"
                  disabled={!newMember.name || !newMember.role}
                >
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}