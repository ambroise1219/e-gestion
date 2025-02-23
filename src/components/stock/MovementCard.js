'use client';

import { useState } from 'react';
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UserCircleIcon,
  MapPinIcon,
  PlusIcon,
  MinusIcon,
  AdjustmentsVerticalIcon
} from '@heroicons/react/24/outline';

export default function MovementCard({ transaction, onMovement, showActions = false, itemId = null }) {
  const [showForm, setShowForm] = useState(false);
  const [movementType, setMovementType] = useState('in');
  const [formData, setFormData] = useState({
    quantity: '',
    notes: '',
    reference: ''
  });

  const getTypeColor = (type) => {
    if (!type) return 'text-gray-500 bg-gray-100 dark:bg-gray-800';
    
    switch (type) {
      case 'in':
      case 'initial':
      case 'adjustment_up':
        return 'text-green-500 bg-green-100 dark:bg-green-800';
      case 'out':
      case 'adjustment_down':
        return 'text-red-500 bg-red-100 dark:bg-red-800';
      default:
        return 'text-gray-500 bg-gray-100 dark:bg-gray-800';
    }
  };

  const getTypeLabel = (type) => {
    if (!type) return 'Non spécifié';
    
    switch (type) {
      case 'in':
        return 'Entrée';
      case 'out':
        return 'Sortie';
      case 'initial':
        return 'Stock initial';
      case 'adjustment_up':
        return 'Ajustement +';
      case 'adjustment_down':
        return 'Ajustement -';
      default:
        return type;
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Date non spécifiée';
    return new Date(dateStr).toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!itemId || !formData.quantity) return;

    const movementData = {
      item_id: itemId,
      transaction_type: movementType,
      quantity: parseInt(formData.quantity, 10),
      notes: formData.notes,
      reference: formData.reference
    };

    try {
      await onMovement?.(movementData);
      setShowForm(false);
      setFormData({ quantity: '', notes: '', reference: '' });
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du mouvement:', error);
    }
  };

  // Interface de création de mouvement
  if (showActions) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        {!showForm ? (
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => {
                setMovementType('in');
                setShowForm(true);
              }}
              className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowTrendingUpIcon className="w-6 h-6 text-green-500 mb-2" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Entrée</span>
            </button>
            
            <button
              onClick={() => {
                setMovementType('out');
                setShowForm(true);
              }}
              className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowTrendingDownIcon className="w-6 h-6 text-red-500 mb-2" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Sortie</span>
            </button>
            
            <button
              onClick={() => {
                setMovementType('adjustment_up');
                setShowForm(true);
              }}
              className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <AdjustmentsVerticalIcon className="w-6 h-6 text-blue-500 mb-2" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Ajustement</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {getTypeLabel(movementType)}
              </h3>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Annuler
              </button>
            </div>

            <div className="space-y-4">
              {movementType === 'adjustment_up' && (
                <div className="flex space-x-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setMovementType('adjustment_up')}
                    className={`flex items-center px-3 py-2 rounded-lg ${
                      movementType === 'adjustment_up'
                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100'
                    }`}
                  >
                    <PlusIcon className="w-5 h-5 mr-1" />
                    <span>Positif</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMovementType('adjustment_down')}
                    className={`flex items-center px-3 py-2 rounded-lg ${
                      movementType === 'adjustment_down'
                        ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100'
                    }`}
                  >
                    <MinusIcon className="w-5 h-5 mr-1" />
                    <span>Négatif</span>
                  </button>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Quantité *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Référence
                </label>
                <input
                  type="text"
                  value={formData.reference}
                  onChange={(e) => setFormData(prev => ({ ...prev, reference: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Référence optionnelle"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows="3"
                  placeholder="Notes optionnelles"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-pro-lime text-black rounded-lg hover:bg-pro-lime/90 font-medium"
              >
                Enregistrer
              </button>
            </div>
          </form>
        )}
      </div>
    );
  }

  // Affichage d'une transaction existante
  if (!transaction) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${getTypeColor(transaction.type)}`}>
            {transaction.type?.includes('out') || transaction.type?.includes('adjustment_down') ? (
              <ArrowTrendingDownIcon className="w-5 h-5" />
            ) : (
              <ArrowTrendingUpIcon className="w-5 h-5" />
            )}
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">
              {getTypeLabel(transaction.type)}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {transaction.reference || 'Sans référence'}
            </p>
          </div>
        </div>
        <span className={`text-lg font-semibold ${
          transaction.type?.includes('out') || transaction.type?.includes('adjustment_down')
            ? 'text-red-500'
            : 'text-green-500'
        }`}>
          {transaction.type?.includes('out') || transaction.type?.includes('adjustment_down') ? '-' : '+'}
          {Math.abs(transaction.quantity || 0)}
        </span>
      </div>

      <div className="mt-4 space-y-2">
        {/* Informations sur l'emplacement */}
        {(transaction.source_location_name || transaction.destination_location_name) && (
          <div className="flex items-center space-x-2">
            <MapPinIcon className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {transaction.source_location_name && transaction.destination_location_name ? (
                `${transaction.source_location_name} → ${transaction.destination_location_name}`
              ) : transaction.source_location_name ? (
                `Depuis: ${transaction.source_location_name}`
              ) : (
                `Vers: ${transaction.destination_location_name}`
              )}
            </span>
          </div>
        )}

        {/* Utilisateur et date */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <UserCircleIcon className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {transaction.user_name || 'Système'}
            </span>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {formatDate(transaction.created_at || transaction.date)}
          </span>
        </div>

        {/* Notes */}
        {transaction.notes && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
            {transaction.notes}
          </p>
        )}
      </div>
    </div>
  );
}
