import { useState } from 'react';
import { 
  DocumentIcon,
  CalendarIcon,
  FolderIcon,
  UserIcon,
  TagIcon,
  DocumentArrowDownIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

export default function DocumentModalOverview({ document, isEditing, onDocumentChange }) {
  const [editedDocument, setEditedDocument] = useState(document);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedDocument(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    onDocumentChange(editedDocument);
  };

  return (
    <div className="space-y-6 p-6">
      {/* En-tête du document */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-2 rounded-lg bg-pro-lime">
            <DocumentIcon className="h-6 w-6 text-pro-black" />
          </div>
          <div>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={editedDocument.name}
                onChange={handleChange}
                className="input-field text-lg font-semibold"
              />
            ) : (
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {document.name}
              </h2>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Ajouté le {document.date}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="btn btn-secondary">
            <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
            Télécharger
          </button>
          {!isEditing && (
            <button className="btn btn-primary">
              <PencilIcon className="h-5 w-5 mr-2" />
              Modifier
            </button>
          )}
        </div>
      </div>

      {/* Informations du document */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="card">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Informations générales
            </h3>
            <div className="mt-3 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TagIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Type</span>
                </div>
                {isEditing ? (
                  <select
                    name="type"
                    value={editedDocument.type}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="PDF">PDF</option>
                    <option value="DOCX">DOCX</option>
                    <option value="XLSX">XLSX</option>
                  </select>
                ) : (
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {document.type}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FolderIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Catégorie</span>
                </div>
                {isEditing ? (
                  <select
                    name="category"
                    value={editedDocument.category}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="Plans">Plans</option>
                    <option value="Contrats">Contrats</option>
                    <option value="Devis">Devis</option>
                  </select>
                ) : (
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {document.category}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Date d'ajout</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {document.date}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Ajouté par</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {document.addedBy || 'Non spécifié'}
                </span>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setEditedDocument(document)}
                className="btn btn-secondary"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="btn btn-primary"
              >
                Enregistrer
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="card">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Description
            </h3>
            {isEditing ? (
              <textarea
                name="description"
                value={editedDocument.description}
                onChange={handleChange}
                rows={4}
                className="mt-3 input-field"
                placeholder="Ajouter une description..."
              />
            ) : (
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                {document.description || 'Aucune description disponible'}
              </p>
            )}
          </div>

          <div className="card">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Tags
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {document.tags?.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pro-lime text-pro-black"
                >
                  {tag}
                </span>
              ))}
              {(!document.tags || document.tags.length === 0) && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Aucun tag
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
