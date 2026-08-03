'use client';
import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';

const FALLBACK_SRC = '/logo.png';

export default function RemoteImage({ src, alt, onError, unoptimized, ...props }: ImageProps) {
  const [hasError, setHasError] = useState(false);

  const resolvedSrc = hasError ? FALLBACK_SRC : src;
  const isRemote = typeof resolvedSrc === 'string' && resolvedSrc.startsWith('http');

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
      unoptimized={unoptimized ?? isRemote}
    />
  );
}
