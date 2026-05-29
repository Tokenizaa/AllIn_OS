import React, { useState, useEffect } from 'react';

import { Skeleton } from '@/components/ui/skeleton';

interface ImageOptimizedProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  loading?: 'eager' | 'lazy';
  quality?: number;
  priority?: boolean;
}

export const ImageOptimized: React.FC<ImageOptimizedProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  quality = 75,
  priority = false,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src) {
      setError(true);
      setIsLoading(false);
      return;
    }

    // Se for uma imagem externa, podemos usar um serviço de otimização
    const isExternal = src.startsWith('http');
    
    if (isExternal) {
      // Exemplo com o serviço de otimização do Vercel
      const optimizedUrl = `/_next/image?url=${encodeURIComponent(src)}&w=${width * 2}&q=${quality}`;
      setImageUrl(optimizedUrl);
    } else {
      // Para imagens locais, apenas use o caminho original
      setImageUrl(src);
    }

    // Simular carregamento para o skeleton
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [src, width, quality]);

  const handleError = () => {
    setError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  if (error) {
    return (
      <div 
        className={`bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${className}`}
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <span className="text-gray-500 dark:text-gray-400 text-sm">
          Imagem não disponível
        </span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ width: `${width}px`, height: `${height}px` }}>
      {isLoading && (
        <Skeleton className="absolute inset-0 w-full h-full" />
      )}
      <img
        src={imageUrl}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        onError={handleError}
        onLoad={handleLoad}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} w-full h-full object-cover`}
        style={{
          viewTransitionName: `image-${src}`,
        }}
        {...props}
      />
      {priority && (
        <link rel="preload" as="image" href={imageUrl} />
      )}
    </div>
  );
};

export default ImageOptimized;
