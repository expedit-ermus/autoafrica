'use client';
import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';

const FALLBACK_SRC = '/logo.png';
const OPTIMIZED_HOSTS = ['images.unsplash.com', 'flagcdn.com', 'upload.wikimedia.org'];

function canOptimize(urlOrPath: unknown): boolean {
  if (typeof urlOrPath !== 'string') return true;
  if (!urlOrPath.startsWith('http://') && !urlOrPath.startsWith('https://')) return true;
  try {
    const parsed = new URL(urlOrPath);
    return OPTIMIZED_HOSTS.includes(parsed.hostname);
  } catch {
    return false;
  }
}

export default function RemoteImage({ src, alt, onError, unoptimized, ...props }: ImageProps) {
  const [hasError, setHasError] = useState(false);

  const resolvedSrc = hasError ? FALLBACK_SRC : src;
  const shouldUnoptimize = unoptimized ?? !canOptimize(resolvedSrc);

  return (
    <Image
      {...props}
      src={resolvedSrc}
      alt={alt}
      onError={
        hasError
          ? undefined
          : (event) => {
              onError?.(event);
              setHasError(true);
            }
      }
      unoptimized={shouldUnoptimize}
    />
  );
}
