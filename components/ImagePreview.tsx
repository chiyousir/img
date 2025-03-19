'use client';

import { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableImage } from './SortableImage';

type ImageFile = {
  id: string;
  file: File;
  preview: string;
  selected: boolean;
  rotation: number;
};

type ImagePreviewProps = {
  images: ImageFile[];
  onDeleteSelected: () => void;
  onDeleteAll: () => void;
  onRotateImage: (id: string, direction: 'left' | 'right') => void;
  onSelectImage: (id: string) => void;
  onReorderImages: (newOrder: ImageFile[]) => void;
};

export function ImagePreview({
  images,
  onDeleteSelected,
  onDeleteAll,
  onRotateImage,
  onSelectImage,
  onReorderImages,
}: ImagePreviewProps) {
  const { t } = useTranslation();
  const [selectedCount, setSelectedCount] = useState(0);

  // Update selected count when images change
  useEffect(() => {
    setSelectedCount(images.filter(img => img.selected).length);
  }, [images]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      
      if (over && active.id !== over.id) {
        const oldIndex = images.findIndex(img => img.id === active.id);
        const newIndex = images.findIndex(img => img.id === over.id);
        const newOrder = arrayMove(images, oldIndex, newIndex);
        onReorderImages(newOrder);
      }
    },
    [images, onReorderImages]
  );

  if (images.length === 0) {
    return <p className="text-gray-300 text-center py-8">{t('preview.noImages')}</p>;
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              images.forEach(img => onSelectImage(img.id));
            }}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-md text-sm font-medium hover:bg-blue-500/20 transition-all duration-300 border border-blue-500/20 hover:border-blue-500/40"
          >
            <input
              type="checkbox"
              checked={selectedCount === images.length}
              onChange={() => {
                images.forEach(img => onSelectImage(img.id));
              }}
              className="h-4 w-4 rounded text-blue-500 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer transition-all duration-300"
            />
            <span className="relative top-[1px]">
              {selectedCount === images.length
                ? t('preview.deselectAll')
                : t('preview.selectAll')}
            </span>
          </button>
          {selectedCount > 0 && (
            <button
              onClick={onDeleteSelected}
              className="px-3 py-1.5 bg-red-500/10 text-red-400 rounded-md text-sm font-medium hover:bg-red-500/20 transition-all duration-300 border border-red-500/20 hover:border-red-500/40 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
              </svg>
              {t('preview.deleteSelected')} ({selectedCount})
            </button>
          )}
          <button
            onClick={onDeleteAll}
            className="px-3 py-1.5 bg-white/5 text-gray-300 rounded-md text-sm font-medium hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M2 3.75A.75.75 0 012.75 3h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 3.75zm0 4.167a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75zm0 4.166a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75zm0 4.167a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
            </svg>
            {t('preview.deleteAll')}
          </button>
        </div>
        <div className="text-sm text-gray-300 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
            <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
          </svg>
          {t('preview.totalImages', { count: images.length })}
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={images} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {images.map((image) => (
              <SortableImage
                key={image.id}
                image={image}
                onSelect={() => onSelectImage(image.id)}
                onRotateLeft={() => onRotateImage(image.id, 'left')}
                onRotateRight={() => onRotateImage(image.id, 'right')}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
} 