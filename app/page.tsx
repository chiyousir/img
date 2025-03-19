'use client';

import { useState, useCallback, useEffect } from 'react';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ImageUploader } from '@/components/ImageUploader';
import { ImagePreview } from '@/components/ImagePreview';
import { ConversionSettings } from '@/components/ConversionSettings';
import { useTranslation } from 'react-i18next';
// 直接导入 i18n
import '@/src/i18n';

type ImageFile = {
  id: string;
  file: File;
  preview: string;
  selected: boolean;
  rotation: number;
};

type Quality = 'low' | 'medium' | 'high';

export default function Home() {
  const { t, i18n } = useTranslation();
  const [images, setImages] = useState<ImageFile[]>([]);
  const [converting, setConverting] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const quality: Quality = 'high';
  const [isClient, setIsClient] = useState(false);

  // 避免水合错误
  useEffect(() => {
    // 确保在客户端再次初始化
    setIsClient(true);
  }, []);

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

  const handleSelectImage = (id: string) => {
    setImages(prevImages => 
      prevImages.map(img => 
        img.id === id ? { ...img, selected: !img.selected } : img
      )
    );
  };

  const handleSelectAll = () => {
    setImages(prevImages => 
      prevImages.map(img => ({ ...img, selected: true }))
    );
  };

  const handleDeselectAll = () => {
    setImages(prevImages => 
      prevImages.map(img => ({ ...img, selected: false }))
    );
  };

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
      formData.append('quality', 'high');
      
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

  const getPdfFileName = () => {
    if (images.length === 0) return 'converted.pdf';
    
    // 获取第一张图片的文件名
    const firstImageName = images[0].file.name;
    // 移除文件扩展名
    const baseName = firstImageName.replace(/\.[^/.]+$/, '');
    return `${baseName}.pdf`;
  };

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-tech-dark to-tech-light">
        <div className="animate-pulse text-blue-400 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-tech-dark to-tech-light text-gray-100 flex flex-col">
      {/* 背景动画气泡 */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <header className="backdrop-blur-md bg-white/10 border-b border-white/20 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">{t('title')}</h1>
          <LanguageSwitcher />
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8 flex-1 flex flex-col gap-8">
        <p className="text-lg text-center text-gray-300">{t('description')}</p>
        
        <section className="backdrop-blur-md bg-white/10 rounded-lg border border-white/20 p-6 hover-card">
          <h2 className="text-xl font-semibold mb-4 text-blue-400">{t('upload.title')}</h2>
          <ImageUploader onFilesAccepted={handleFilesAccepted} />
        </section>
        
        {images.length > 0 && (
          <section className="backdrop-blur-md bg-white/10 rounded-lg border border-white/20 p-6 hover-card">
            <h2 className="text-xl font-semibold mb-4 text-blue-400">{t('preview.title')}</h2>
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
          <section className="backdrop-blur-md bg-white/10 rounded-lg border border-white/20 p-6 hover-card">
            <h2 className="text-xl font-semibold mb-4 text-blue-400">{t('conversion.title')}</h2>
            <div className="flex flex-wrap gap-4 items-center">
              <button
                onClick={handleConvertToPdf}
                disabled={converting}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-md hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-tech-dark transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium glow-on-hover"
              >
                {converting ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                    {t('conversion.converting')}
                  </span>
                ) : (
                  t('conversion.convert')
                )}
              </button>

              {pdfUrl && (
                <a
                  href={pdfUrl}
                  download={getPdfFileName()}
                  className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-md hover:from-green-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-tech-dark transition-all duration-300 font-medium flex items-center gap-2 glow-on-hover"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V3a.75.75 0 0 1 .75-.75Zm-9 13.5a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                  </svg>
                  {t('conversion.download')} PDF
                </a>
              )}
            </div>
          </section>
        )}
      </main>
      
      <footer className="backdrop-blur-md bg-white/10 border-t border-white/20 py-4 mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-400">
          © {new Date().getFullYear()} Image to PDF Converter
        </div>
      </footer>
    </div>
  );
}
