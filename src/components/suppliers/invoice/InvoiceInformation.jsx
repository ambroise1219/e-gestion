import React from 'react';

export default function InvoiceInformation({ invoiceData, updateInvoiceField }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Numéro de facture
        </label>
        <input
          type="text"
          value={invoiceData.invoiceNumber}
          onChange={(e) => updateInvoiceField('invoiceNumber', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 shadow-sm focus:border-pro-lime focus:ring-pro-lime text-gray-900 dark:text-gray-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Date de facturation
        </label>
        <input
          type="date"
          value={invoiceData.date}
          onChange={(e) => updateInvoiceField('date', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 shadow-sm focus:border-pro-lime focus:ring-pro-lime text-gray-900 dark:text-gray-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Date d'échéance
        </label>
        <input
          type="date"
          value={invoiceData.dueDate}
          onChange={(e) => updateInvoiceField('dueDate', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 shadow-sm focus:border-pro-lime focus:ring-pro-lime text-gray-900 dark:text-gray-100"
        />
      </div>
    </div>
  );
}
