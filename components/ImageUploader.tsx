'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';

const MAX_FILES = 50;
const MAX_SIZE = 100 * 1024 * 1024; // 100MB
const ACCEPTED_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
};

type ImageUploaderProps = {
  onFilesAccepted: (files: File[]) => void;
};

export function ImageUploader({ onFilesAccepted }: ImageUploaderProps) {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setError(null);
      
      // Handle file rejection errors
      if (rejectedFiles.length > 0) {
        const { errors } = rejectedFiles[0];
        if (errors[0]?.code === 'file-too-large') {
          setError(t('upload.tooLarge'));
        } else if (errors[0]?.code === 'file-invalid-type') {
          setError(t('upload.invalidType'));
        } else {
          setError(t('upload.error'));
        }
        return;
      }
      
      // Check if too many files are uploaded
      if (acceptedFiles.length > MAX_FILES) {
        setError(t('upload.tooMany'));
        return;
      }
      
      // Process accepted files
      setIsUploading(true);
      
      // Simulate upload delay for UX
      setTimeout(() => {
        onFilesAccepted(acceptedFiles);
        setIsUploading(false);
      }, 1000);
    },
    [onFilesAccepted, t]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_SIZE,
    maxFiles: MAX_FILES,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`px-6 py-10 border-2 border-dashed rounded-lg text-center cursor-pointer transition-all duration-300 ${
          isDragActive
            ? 'border-blue-400 bg-blue-500/10'
            : 'border-gray-400 hover:border-blue-400 hover:bg-blue-500/5'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-12 w-12 transition-colors duration-300 ${
              isDragActive ? 'text-blue-400' : 'text-blue-300 group-hover:text-blue-400'
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="text-lg font-semibold text-blue-300">{t('upload.dropzone')}</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <p className="text-base text-blue-200 font-medium">{t('upload.maxFiles')}</p>
            <p className="text-base text-blue-200 font-medium">{t('upload.maxSize')}</p>
            <p className="text-base text-blue-200 font-medium">{t('upload.accepted')}</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-3 text-red-400 text-sm font-medium">{error}</div>
      )}

      {isUploading && (
        <div className="mt-3 text-blue-300 text-sm flex items-center font-medium">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-300"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {t('upload.uploading')}
        </div>
      )}
    </div>
  );
} 