import { useState } from 'react';
import { PlusIcon, TrashIcon, PencilSquareIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function ProjectModalEquipment({ project, isEditing, onProjectChange }) {
  const [showAddEquipmentModal, setShowAddEquipmentModal] = useState(false);
  const [newEquipment, setNewEquipment] = useState({
    name: '',
    quantity: 1,
    status: 'available',
    type: '',
    assignedTo: ''
  });

  const handleAddEquipment = () => {
    if (newEquipment.name && newEquipment.type) {
      onProjectChange({
        ...project,
        equipment: [...(project.equipment || []), { ...newEquipment, id: Date.now() }]
      });
      setNewEquipment({
        name: '',
        quantity: 1,
        status: 'available',
        type: '',
        assignedTo: ''
      });
      setShowAddEquipmentModal(false);
    }
  };

  const handleRemoveEquipment = (equipmentId) => {
    onProjectChange({
      ...project,
      equipment: project.equipment.filter(eq => eq.id !== equipmentId)
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'in_use':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'unavailable':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(project.equipment || []).map((equipment) => (
          <div
            key={equipment.id}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">{equipment.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{equipment.type}</p>
              </div>
              {isEditing && (
                <button
                  onClick={() => handleRemoveEquipment(equipment.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Quantité:</span>
                <span className="font-medium">{equipment.quantity}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Statut:</span>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(equipment.status)}`}>
                  {equipment.status === 'available' ? 'Disponible' :
                   equipment.status === 'in_use' ? 'En utilisation' :
                   equipment.status === 'maintenance' ? 'En maintenance' :
                   'Indisponible'}
                </span>
              </div>

              {equipment.assignedTo && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Assigné à:</span>
                  <span className="text-sm font-medium">{equipment.assignedTo}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {isEditing && (
        <button
          onClick={() => setShowAddEquipmentModal(true)}
          className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-600 transition-colors flex items-center justify-center space-x-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Ajouter un équipement</span>
        </button>
      )}

      {/* Modal d'ajout d'équipement */}
      {showAddEquipmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Ajouter un équipement
              </h3>
              <button
                onClick={() => setShowAddEquipmentModal(false)}
                className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nom de l'équipement
                </label>
                <input
                  type="text"
                  value={newEquipment.name}
                  onChange={(e) => setNewEquipment({ ...newEquipment, name: e.target.value })}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-pro-lime focus:border-pro-lime"
                  placeholder="Nom de l'équipement"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Type
                </label>
                <select
                  value={newEquipment.type}
                  onChange={(e) => setNewEquipment({ ...newEquipment, type: e.target.value })}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-pro-lime focus:border-pro-lime"
                >
                  <option value="">Sélectionner un type</option>
                  <option value="Véhicule">Véhicule</option>
                  <option value="Outil">Outil</option>
                  <option value="Machine">Machine</option>
                  <option value="Équipement de sécurité">Équipement de sécurité</option>
                  <option value="Matériel informatique">Matériel informatique</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Quantité
                </label>
                <input
                  type="number"
                  value={newEquipment.quantity}
                  onChange={(e) => setNewEquipment({ ...newEquipment, quantity: parseInt(e.target.value) })}
                  min="1"
                  className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-pro-lime focus:border-pro-lime"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Statut
                </label>
                <select
                  value={newEquipment.status}
                  onChange={(e) => setNewEquipment({ ...newEquipment, status: e.target.value })}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-pro-lime focus:border-pro-lime"
                >
                  <option value="available">Disponible</option>
                  <option value="in_use">En utilisation</option>
                  <option value="maintenance">En maintenance</option>
                  <option value="unavailable">Indisponible</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Assigné à (optionnel)
                </label>
                <input
                  type="text"
                  value={newEquipment.assignedTo}
                  onChange={(e) => setNewEquipment({ ...newEquipment, assignedTo: e.target.value })}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-pro-lime focus:border-pro-lime"
                  placeholder="Nom de la personne"
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddEquipmentModal(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  onClick={handleAddEquipment}
                  className="px-4 py-2 bg-pro-lime text-black rounded-lg hover:bg-pro-lime/90"
                  disabled={!newEquipment.name || !newEquipment.type}
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