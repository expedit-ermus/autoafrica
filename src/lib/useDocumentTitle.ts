'use client';
import { useEffect } from 'react';

export function buildDocumentTitle(activeTitle: string | null, fallbackTitle: string): string {
  return activeTitle ? `${activeTitle} | AutoAfrique` : fallbackTitle;
}

export function useDocumentTitle(activeTitle: string | null, fallbackTitle: string): void {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = buildDocumentTitle(activeTitle, fallbackTitle);
  }, [activeTitle, fallbackTitle]);
}
