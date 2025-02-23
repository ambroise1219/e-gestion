import { DocumentArrowUpIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function ProjectModalDocuments({ project, isEditing, onProjectChange }) {
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const newDocument = {
        type: file.type,
        filename: file.name,
        uploadDate: new Date().toISOString()
      };
      onProjectChange({
        ...project,
        documents: [...project.documents, newDocument]
      });
    }
  };

  const handleDeleteDocument = (documentIndex) => {
    onProjectChange({
      ...project,
      documents: project.documents.filter((_, index) => index !== documentIndex)
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {project.documents?.map((doc, index) => (
          <div
            key={index}
            className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-start justify-between"
          >
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">{doc.filename}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Ajouté le {new Date(doc.uploadDate).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400">
                <DocumentArrowUpIcon className="w-5 h-5" />
              </button>
              {isEditing && (
                <button
                  onClick={() => handleDeleteDocument(index)}
                  className="text-red-500 hover:text-red-600"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {isEditing && (
        <div className="mt-4">
          <label className="block p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-center cursor-pointer hover:border-gray-400 dark:hover:border-gray-600">
            <DocumentArrowUpIcon className="w-6 h-6 mx-auto text-gray-400" />
            <span className="mt-2 block text-sm font-medium text-gray-600 dark:text-gray-400">
              Ajouter un document
            </span>
            <input
              type="file"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>
      )}
    </div>
  );
}