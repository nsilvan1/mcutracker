'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { motion } from 'framer-motion';

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad'> {
  fallbackSrc?: string;
  showLoadingState?: boolean;
}

// Blur placeholder base64 (dark gray)
const blurDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAQQBAwUBAAAAAAAAAAAAAQACAwQFBhESEyExQVFh/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAYEQADAQEAAAAAAAAAAAAAAAAAAQIREv/aAAwDAQACEEMPYAD/AJ0V1p0U3S1IJ6qJX4CedI9xdwBJ8dBuRERPFpfJ/9k=';

export default function OptimizedImage({
  src,
  alt,
  fallbackSrc = '/placeholder.jpg',
  showLoadingState = true,
  className = '',
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className="relative w-full h-full">
      {showLoadingState && isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-marvel-gray flex items-center justify-center"
        >
          <div className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
        </motion.div>
      )}

      <Image
        src={error ? fallbackSrc : src}
        alt={alt}
        className={`${className} transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        placeholder="blur"
        blurDataURL={blurDataURL}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setError(true);
          setIsLoading(false);
        }}
        {...props}
      />
    </div>
  );
}

// Componente para imagens de poster
export function PosterImage({
  src,
  alt,
  priority = false,
  className = '',
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-b from-marvel-gray to-marvel-dark animate-pulse" />
      )}
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        placeholder="blur"
        blurDataURL={blurDataURL}
        className={`object-cover transition-all duration-500 ${isLoading ? 'scale-110 blur-sm' : 'scale-100 blur-0'} ${className}`}
        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}

// Componente para backdrop images
export function BackdropImage({
  src,
  alt,
  className = '',
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 bg-marvel-dark animate-pulse" />
      )}
      <Image
        src={src}
        alt={alt}
        fill
        placeholder="blur"
        blurDataURL={blurDataURL}
        className={`object-cover transition-all duration-700 ${isLoading ? 'scale-105 blur-md' : 'scale-100 blur-0'} ${className}`}
        sizes="100vw"
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}
