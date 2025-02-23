'use client';

import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { useFileUpload } from '@/hooks/useFileUpload';

export default function FileUploader({ onUploadComplete, isLoading, maxFiles = 10 }) {
  const { upload, isUploading, error } = useFileUpload();

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      const uploadedFiles = await upload(files);
      onUploadComplete(uploadedFiles);
    } catch (err) {
      // L'erreur est déjà gérée par le hook
    }
  };

  return (
    <div className="space-y-2">
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-lg">
        <div className="space-y-1 text-center">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div className="flex text-sm text-gray-600 dark:text-gray-400">
            <label 
              htmlFor="file-upload" 
              className={`relative cursor-pointer rounded-md font-medium text-pro-lime hover:text-pro-lime/80 ${
                (isUploading || isLoading) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <span>{isUploading ? "Upload en cours..." : "Télécharger un fichier"}</span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                multiple
                accept="image/*,.pdf"
                onChange={handleFileChange}
                disabled={isUploading || isLoading}
                max={maxFiles}
              />
            </label>
            <p className="pl-1">ou glisser-déposer</p>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            PNG, JPG, PDF jusqu'à 10MB
          </p>
        </div>
      </div>
      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}