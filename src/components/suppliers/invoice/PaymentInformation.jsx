import React from 'react';

export default function PaymentInformation({ invoiceData, updateInvoiceField }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Taux de TVA (%)
        </label>
        <input
          type="number"
          value={invoiceData.tvaRate}
          onChange={(e) => updateInvoiceField('tvaRate', parseFloat(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 shadow-sm focus:border-pro-lime focus:ring-pro-lime text-gray-900 dark:text-gray-100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Instructions de paiement
        </label>
        <textarea
          value={invoiceData.paymentInstructions}
          onChange={(e) => updateInvoiceField('paymentInstructions', e.target.value)}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 shadow-sm focus:border-pro-lime focus:ring-pro-lime text-gray-900 dark:text-gray-100"
        />
      </div>
    </div>
  );
}
