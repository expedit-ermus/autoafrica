'use client';

import { useState, useRef, useCallback, TouchEvent } from 'react';

interface SwipeToDeleteProps {
  children: React.ReactNode;
  onDelete: () => void;
  deleteLabel?: string;
  confirmDelete?: boolean;
  confirmMessage?: string;
  swipeThreshold?: number;
  disabled?: boolean;
  className?: string;
}

export default function SwipeToDelete({
  children,
  onDelete,
  deleteLabel = 'Delete',
  confirmDelete = true,
  confirmMessage = 'Are you sure you want to delete this?',
  swipeThreshold = 80,
  disabled = false,
  className = '',
}: SwipeToDeleteProps) {
  const [offsetX, setOffsetX] = useState(0);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (disabled) return;
      startX.current = e.touches[0].clientX;
      setIsDragging(true);
    },
    [disabled]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (disabled || !isDragging) return;
      const currentX = e.touches[0].clientX;
      const diff = startX.current - currentX;

      if (diff > 0) {
        const dampedOffset = Math.min(diff * 0.8, swipeThreshold * 1.2);
        setOffsetX(-dampedOffset);
      }
    },
    [disabled, isDragging, swipeThreshold]
  );

  const handleTouchEnd = useCallback(() => {
    if (disabled) return;
    setIsDragging(false);

    if (Math.abs(offsetX) >= swipeThreshold) {
      setOffsetX(-swipeThreshold);
    } else {
      setOffsetX(0);
    }
  }, [disabled, offsetX, swipeThreshold]);

  const handleDeleteClick = useCallback(() => {
    if (confirmDelete) {
      setIsConfirming(true);
    } else {
      onDelete();
    }
  }, [confirmDelete, onDelete]);

  const handleConfirm = useCallback(() => {
    setIsConfirming(false);
    setOffsetX(0);
    onDelete();
  }, [onDelete]);

  const handleCancel = useCallback(() => {
    setIsConfirming(false);
    setOffsetX(0);
  }, []);

  const progress = Math.min(Math.abs(offsetX) / swipeThreshold, 1);

  return (
    <div className={`relative overflow-hidden rounded-xl ${className}`}>
      {/* Delete background */}
      <div
        className="absolute inset-0 flex items-center justify-end bg-red-500 rounded-xl"
        style={{ opacity: progress }}
      >
        <button
          onClick={handleDeleteClick}
          className="
            h-full px-6 flex items-center justify-center
            text-white font-semibold text-sm
            active:scale-95 transition-transform
          "
        >
          {deleteLabel}
        </button>
      </div>

      {/* Swipable content */}
      <div
        className="relative bg-white rounded-xl touch-pan-y"
        style={{
          transform: `translateX(${offsetX}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>

      {/* Confirm dialog */}
      {isConfirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl animate-[modalSlideUp_0.2s_ease-out]">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Confirm Delete</h4>
            <p className="text-sm text-gray-500 mb-6">{confirmMessage}</p>
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={handleCancel}
                className="
                  px-4 py-2 text-sm font-medium text-gray-600
                  rounded-xl hover:bg-gray-100 transition-colors
                "
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="
                  px-4 py-2 text-sm font-semibold text-white
                  bg-red-500 rounded-xl hover:bg-red-600
                  active:scale-[0.98] transition-all
                "
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
