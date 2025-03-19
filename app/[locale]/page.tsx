'use client';

import { useTranslations } from 'next-intl';
import { useState, useCallback } from 'react';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ImageUploader } from '@/components/ImageUploader';
import { ImagePreview } from '@/components/ImagePreview';
import { ConversionSettings } from '@/components/ConversionSettings';

type ImageFile = {
  id: string;
  file: File;
  preview: string;
  selected: boolean;
  rotation: number;
};

type Quality = 'low' | 'medium' | 'high';

export default function Home() {
  const t = useTranslations();
  const [images, setImages] = useState<ImageFile[]>([]);
  const [converting, setConverting] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [quality, setQuality] = useState<Quality>('medium');

  const handleFilesAccepted = useCallback((acceptedFiles: File[]) => {
    const newImages = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substring(2, 15),
      file,
      preview: URL.createObjectURL(file),
      selected: false,
      rotation: 0
    }));
    
    setImages(prevImages => [...prevImages, ...newImages]);
    setPdfUrl(null);
  }, []);

  const handleDeleteSelected = useCallback(() => {
    setImages(prevImages => prevImages.filter(image => !image.selected));
    setPdfUrl(null);
  }, []);

  const handleDeleteAll = useCallback(() => {
    setImages([]);
    setPdfUrl(null);
  }, []);

  const handleRotateImage = useCallback((id: string, direction: 'left' | 'right') => {
    setImages(prevImages => 
      prevImages.map(image => {
        if (image.id === id) {
          const newRotation = direction === 'left' 
            ? (image.rotation - 90) % 360 
            : (image.rotation + 90) % 360;
          return { ...image, rotation: newRotation };
        }
        return image;
      })
    );
    setPdfUrl(null);
  }, []);

  const handleSelectImage = useCallback((id: string) => {
    setImages(prevImages => 
      prevImages.map(image => {
        if (image.id === id) {
          return { ...image, selected: !image.selected };
        }
        return image;
      })
    );
  }, []);

  const handleReorderImages = useCallback((newOrder: ImageFile[]) => {
    setImages(newOrder);
    setPdfUrl(null);
  }, []);

  const handleConvertToPdf = async () => {
    if (images.length === 0) return;
    
    setConverting(true);
    setPdfUrl(null);
    
    try {
      // Call the API route for conversion
      const formData = new FormData();
      images.forEach((image, index) => {
        formData.append(`file-${index}`, image.file);
        formData.append(`rotation-${index}`, image.rotation.toString());
      });
      formData.append('quality', quality);
      
      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Conversion failed');
      }
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (error) {
      console.error('Error converting to PDF:', error);
    } finally {
      setConverting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <LanguageSwitcher />
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8 flex-1 flex flex-col gap-8">
        <p className="text-lg text-center">{t('description')}</p>
        
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">{t('upload.title')}</h2>
          <ImageUploader onFilesAccepted={handleFilesAccepted} />
        </section>
        
        {images.length > 0 && (
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">{t('preview.title')}</h2>
            <ImagePreview 
              images={images}
              onDeleteSelected={handleDeleteSelected}
              onDeleteAll={handleDeleteAll}
              onRotateImage={handleRotateImage}
              onSelectImage={handleSelectImage}
              onReorderImages={handleReorderImages}
            />
          </section>
        )}
        
        {images.length > 0 && (
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">{t('conversion.title')}</h2>
            <ConversionSettings 
              quality={quality}
              onQualityChange={setQuality}
              onConvert={handleConvertToPdf}
              converting={converting}
              pdfUrl={pdfUrl}
            />
          </section>
        )}
      </main>
      
      <footer className="bg-white py-4 border-t">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Image to PDF Converter
        </div>
      </footer>
    </div>
  );
} 