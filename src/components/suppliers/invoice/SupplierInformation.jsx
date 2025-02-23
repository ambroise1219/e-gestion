import React from 'react';

export default function SupplierInformation({ supplier, updateSupplierField, updateBankDetails }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Conditions de paiement
        </label>
        <input
          type="text"
          value={supplier.paymentTerms}
          onChange={(e) => updateSupplierField('paymentTerms', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 shadow-sm focus:border-pro-lime focus:ring-pro-lime text-gray-900 dark:text-gray-100"
        />
      </div>
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900 dark:text-white">Coordonnées bancaires</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Nom de la banque
          </label>
          <input
            type="text"
            value={supplier.bankDetails.bankName}
            onChange={(e) => updateBankDetails('bankName', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 shadow-sm focus:border-pro-lime focus:ring-pro-lime text-gray-900 dark:text-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            IBAN
          </label>
          <input
            type="text"
            value={supplier.bankDetails.iban}
            onChange={(e) => updateBankDetails('iban', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 shadow-sm focus:border-pro-lime focus:ring-pro-lime text-gray-900 dark:text-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            BIC/SWIFT
          </label>
          <input
            type="text"
            value={supplier.bankDetails.bic}
            onChange={(e) => updateBankDetails('bic', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 shadow-sm focus:border-pro-lime focus:ring-pro-lime text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>
    </div>
  );
}
