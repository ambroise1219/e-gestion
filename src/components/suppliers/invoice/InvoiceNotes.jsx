import React from 'react';

export default function InvoiceNotes({ notes, updateInvoiceField }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Notes
      </label>
      <textarea
        value={notes}
        onChange={(e) => updateInvoiceField('notes', e.target.value)}
        rows={6}
        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 shadow-sm focus:border-pro-lime focus:ring-pro-lime text-gray-900 dark:text-gray-100"
        placeholder="Ajoutez des notes ou des commentaires à votre facture..."
      />
    </div>
  );
}
