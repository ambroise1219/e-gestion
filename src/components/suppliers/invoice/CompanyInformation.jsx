import React from 'react';

export default function CompanyInformation({ company, updateCompanyField }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Nom de l'entreprise
        </label>
        <input
          type="text"
          value={company.name}
          onChange={(e) => updateCompanyField('name', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 shadow-sm focus:border-pro-lime focus:ring-pro-lime text-gray-900 dark:text-gray-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Adresse
        </label>
        <input
          type="text"
          value={company.address}
          onChange={(e) => updateCompanyField('address', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 shadow-sm focus:border-pro-lime focus:ring-pro-lime text-gray-900 dark:text-gray-100"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Ville
          </label>
          <input
            type="text"
            value={company.city}
            onChange={(e) => updateCompanyField('city', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 shadow-sm focus:border-pro-lime focus:ring-pro-lime text-gray-900 dark:text-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Code postal
          </label>
          <input
            type="text"
            value={company.postalCode}
            onChange={(e) => updateCompanyField('postalCode', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 shadow-sm focus:border-pro-lime focus:ring-pro-lime text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Pays
        </label>
        <input
          type="text"
          value={company.country}
          onChange={(e) => updateCompanyField('country', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 shadow-sm focus:border-pro-lime focus:ring-pro-lime text-gray-900 dark:text-gray-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Téléphone
        </label>
        <input
          type="tel"
          value={company.phone}
          onChange={(e) => updateCompanyField('phone', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 shadow-sm focus:border-pro-lime focus:ring-pro-lime text-gray-900 dark:text-gray-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Email
        </label>
        <input
          type="email"
          value={company.email}
          onChange={(e) => updateCompanyField('email', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 shadow-sm focus:border-pro-lime focus:ring-pro-lime text-gray-900 dark:text-gray-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          N° SIRET
        </label>
        <input
          type="text"
          value={company.siret}
          onChange={(e) => updateCompanyField('siret', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 shadow-sm focus:border-pro-lime focus:ring-pro-lime text-gray-900 dark:text-gray-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          N° TVA
        </label>
        <input
          type="text"
          value={company.vatNumber}
          onChange={(e) => updateCompanyField('vatNumber', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 shadow-sm focus:border-pro-lime focus:ring-pro-lime text-gray-900 dark:text-gray-100"
        />
      </div>
    </div>
  );
}
