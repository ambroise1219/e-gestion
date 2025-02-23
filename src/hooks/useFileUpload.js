import { useState } from 'react';
import { useUploadThing } from '@/utils/uploadthing';

export function useFileUpload(config = { fileType: 'stockDocumentUploader' }) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  
  const { startUpload } = useUploadThing(config.fileType);

  const upload = async (files) => {
    setIsUploading(true);
    setError(null);

    try {
      const uploadedFiles = await startUpload(files);
      
      if (!uploadedFiles) {
        throw new Error("L'upload a échoué");
      }

      return uploadedFiles.map(file => ({
        name: file.name,
        url: file.url
      }));
    } catch (err) {
      console.error('Erreur lors de l\'upload:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    upload,
    isUploading,
    error,
    clearError: () => setError(null)
  };
}