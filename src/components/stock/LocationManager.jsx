import { useState, useEffect } from 'react';
import {
  MapPinIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  ArrowUpIcon,
  BuildingStorefrontIcon,
  CubeIcon
} from '@heroicons/react/24/outline';

export default function LocationManager() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'standard',
    capacity: '',
  });

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await fetch('/api/stock/locations');
      if (!response.ok) throw new Error('Failed to fetch locations');
      const data = await response.json();
      setLocations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/stock/locations', {
        method: editingLocation ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingLocation ? 
          { ...formData, id: editingLocation.id } : 
          formData
        )
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save location');
      }

      const savedLocation = await response.json();
      
      if (editingLocation) {
        setLocations(prev => prev.map(loc => 
          loc.id === savedLocation.id ? savedLocation : loc
        ));
      } else {
        setLocations(prev => [...prev, savedLocation]);
      }

      setShowAddForm(false);
      setEditingLocation(null);
      setFormData({ name: '', type: 'standard', capacity: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (location) => {
    setEditingLocation(location);
    setFormData({
      name: location.name,
      type: location.type || 'standard',
      capacity: location.capacity || '',
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet emplacement ?')) return;

    try {
      const response = await fetch(`/api/stock/locations?id=${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete location');
      
      setLocations(prev => prev.filter(loc => loc.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'warehouse':
        return BuildingStorefrontIcon;
      case 'shelf':
        return ArrowUpIcon;
      case 'bin':
        return CubeIcon;
      default:
        return MapPinIcon;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pro-lime"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Gestion des emplacements
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Configurez et gérez les emplacements de stockage
          </p>
        </div>
        <button
          onClick={() => {
            setEditingLocation(null);
            setFormData({ name: '', type: 'standard', capacity: '' });
            setShowAddForm(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-black bg-pro-lime rounded-lg hover:bg-pro-lime/90"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Nouvel emplacement</span>
        </button>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="p-4 rounded-lg bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-200">
          {error}
          <button 
            onClick={() => setError(null)}
            className="float-right text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Formulaire */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nom *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              >
                <option value="standard">Standard</option>
                <option value="warehouse">Entrepôt</option>
                <option value="shelf">Étagère</option>
                <option value="bin">Bac</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Capacité
              </label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
                min="0"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                placeholder="Illimitée si vide"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setEditingLocation(null);
                setFormData({ name: '', type: 'standard', capacity: '' });
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-black bg-pro-lime rounded-lg hover:bg-pro-lime/90"
            >
              {editingLocation ? 'Enregistrer' : 'Créer'}
            </button>
          </div>
        </form>
      )}

      {/* Liste des emplacements */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {locations.map(location => {
          const Icon = getTypeIcon(location.type);
          return (
            <div
              key={location.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 flex items-start justify-between"
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                  <Icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {location.name}
                  </h3>
                  <div className="mt-1 space-y-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Type: {location.type || 'Standard'}
                    </p>
                    {location.capacity > 0 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Capacité: {location.capacity}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {location.unique_items} articles • {Math.round(location.occupancy_rate || 0)}% occupé
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(location)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                  <PencilSquareIcon className="w-5 h-5 text-gray-500" />
                </button>
                <button
                  onClick={() => handleDelete(location.id)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                  disabled={location.unique_items > 0}
                >
                  <TrashIcon className={`w-5 h-5 ${
                    location.unique_items > 0 ? 'text-gray-400' : 'text-red-500'
                  }`} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}