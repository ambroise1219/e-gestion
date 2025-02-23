'use client';

import { useState } from 'react';
import { ShieldCheckIcon, ExclamationCircleIcon, DocumentCheckIcon } from '@heroicons/react/24/outline';

export default function Security() {
  const [incidents] = useState([
    { id: 1, date: '2023-12-05', type: 'Accident', severity: 'Moyen', status: 'En cours' },
    { id: 2, date: '2023-12-04', type: 'Incident', severity: 'Faible', status: 'Résolu' },
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Sécurité et Prévention</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Carte Statistiques */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <ShieldCheckIcon className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Niveau de Sécurité</h3>
              <p className="text-3xl font-bold text-green-600">95%</p>
            </div>
          </div>
        </div>

        {/* Carte Incidents en cours */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <ExclamationCircleIcon className="h-8 w-8 text-yellow-500" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Incidents en cours</h3>
              <p className="text-3xl font-bold text-yellow-600">2</p>
            </div>
          </div>
        </div>

        {/* Carte Formations */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <DocumentCheckIcon className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Formations à jour</h3>
              <p className="text-3xl font-bold text-blue-600">28/30</p>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des incidents */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Incidents Récents</h2>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
              Signaler un incident
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gravité</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {incidents.map((incident) => (
                  <tr key={incident.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{incident.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{incident.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        incident.severity === 'Faible' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {incident.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{incident.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-blue-600 hover:text-blue-900">Voir détails</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 