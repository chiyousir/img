'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTranslation } from 'react-i18next';

type ImageFile = {
  id: string;
  file: File;
  preview: string;
  selected: boolean;
  rotation: number;
};

type SortableImageProps = {
  image: ImageFile;
  onSelect: () => void;
  onRotateLeft: () => void;
  onRotateRight: () => void;
};

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function SortableImage({ image, onSelect, onRotateLeft, onRotateRight }: SortableImageProps) {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative flex flex-col bg-white rounded-md overflow-hidden border ${
        image.selected ? 'border-blue-500' : 'border-gray-200'
      } hover:border-blue-300 transition-colors`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-center px-3 py-2 bg-white">
        <div className="flex items-center gap-2 overflow-hidden">
          <input
            type="checkbox"
            checked={image.selected}
            onChange={onSelect}
            className="rounded text-blue-500 focus:ring-blue-500"
            onClick={(e) => e.stopPropagation()}
          />
          <span className="text-sm truncate" title={image.file.name}>
            {image.file.name}
          </span>
        </div>
        <span className="text-xs text-gray-500 whitespace-nowrap">
          {formatFileSize(image.file.size)}
        </span>
      </div>

      <div 
        className="relative w-full aspect-square cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <Image
          src={image.preview}
          alt={image.file.name}
          fill
          style={{ 
            objectFit: 'contain',
            transform: `rotate(${image.rotation}deg)`,
            transition: 'transform 0.3s ease-in-out'
          }}
        />
        
        {isHovered && (
          <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/50">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRotateLeft();
              }}
              className="px-4 py-2 bg-white text-gray-800 rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 font-semibold"
              title={t('preview.rotateLeft')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M9.53 2.47a.75.75 0 0 1 0 1.06L4.81 8.25H15a6.75 6.75 0 0 1 0 13.5h-3a.75.75 0 0 1 0-1.5h3a5.25 5.25 0 1 0 0-10.5H4.81l4.72 4.72a.75.75 0 1 1-1.06 1.06l-6-6a.75.75 0 0 1 0-1.06l6-6a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
              </svg>
              <span className="text-base font-bold tracking-wide">{t('preview.rotateLeftText')}</span>
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRotateRight();
              }}
              className="px-4 py-2 bg-white text-gray-800 rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 font-semibold"
              title={t('preview.rotateRight')}
            >
              <span className="text-base font-bold tracking-wide">{t('preview.rotateRightText')}</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M14.47 2.47a.75.75 0 0 1 1.06 0l6 6a.75.75 0 0 1 0 1.06l-6 6a.75.75 0 1 1-1.06-1.06l4.72-4.72H9a5.25 5.25 0 1 0 0 10.5h3a.75.75 0 0 1 0 1.5H9a6.75 6.75 0 0 1 0-13.5h10.19l-4.72-4.72a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 