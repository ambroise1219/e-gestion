'use client';

import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function MaterialCard({ material }) {
  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{material.name}</h3>
            <p className="text-gray-600">{material.location}</p>
          </div>
          {material.status === 'low' && (
            <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500" />
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Quantité</p>
            <p className="font-medium">
              {material.quantity} {material.unit}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Prix unitaire</p>
            <p className="font-medium">{material.price} €</p>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Niveau de stock</span>
            <span className={material.status === 'low' ? 'text-yellow-500' : 'text-green-500'}>
              {material.status === 'low' ? 'Bas' : 'Normal'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`rounded-full h-2 ${
                material.status === 'low' ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${(material.quantity / material.minStock) * 100}%` }}
            />
          </div>
        </div>

        <div className="text-sm text-gray-500">
          Dernière mise à jour : {new Date(material.lastUpdate).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
