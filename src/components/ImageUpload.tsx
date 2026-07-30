'use client';
import { useState, useRef } from 'react';
import { useToast } from '@/contexts/ToastContext';

interface Props {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  disabled?: boolean;
}

export default function ImageUpload({ images, onChange, maxImages = 5, disabled = false }: Props) {
  const { addToast } = useToast();
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remaining = maxImages - images.length;
    const toUpload = Array.from(files).slice(0, remaining);
    if (toUpload.length < files.length) {
      addToast('warning', `Max ${maxImages} images. ${files.length - toUpload.length} ignorées.`);
    }

    setUploading(true);
    const newUrls: string[] = [];

    for (const file of toUpload) {
      try {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/v1/upload', { method: 'POST', body: fd, credentials: 'include' });
        const data = await res.json();
        if (data.success) newUrls.push(data.url);
        else addToast('error', data.error || 'Erreur upload');
      } catch {
        addToast('error', 'Erreur réseau');
      }
    }

    if (newUrls.length > 0) onChange([...images, ...newUrls]);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const moveImage = (from: number, to: number) => {
    const next = [...images];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Photos {images.length > 0 && <span className="text-gray-400">({images.length}/{maxImages})</span>}
      </label>

      <div className="grid grid-cols-3 gap-3 mb-3">
        {images.map((url, i) => (
          <div key={i} className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-square bg-gray-50">
            <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              {i > 0 && (
                <button type="button" onClick={() => moveImage(i, i - 1)}
                  className="w-7 h-7 rounded-full bg-white/90 text-gray-700 text-xs font-bold hover:bg-white">←</button>
              )}
              <button type="button" onClick={() => removeImage(i)}
                className="w-7 h-7 rounded-full bg-red-500 text-white text-xs font-bold hover:bg-red-600">✕</button>
              {i < images.length - 1 && (
                <button type="button" onClick={() => moveImage(i, i + 1)}
                  className="w-7 h-7 rounded-full bg-white/90 text-gray-700 text-xs font-bold hover:bg-white">→</button>
              )}
            </div>
            {i === 0 && <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-orange-500 text-white text-[10px] font-bold rounded">Principal</span>}
          </div>
        ))}

        {images.length < maxImages && !disabled && (
          <button type="button" onClick={() => inputRef.current?.click()}
            className="aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-orange-400 bg-gray-50 hover:bg-orange-50 transition flex flex-col items-center justify-center gap-1">
            {uploading ? (
              <div className="animate-spin w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full" />
            ) : (
              <>
                <span className="text-2xl text-gray-400">+</span>
                <span className="text-[10px] text-gray-400">Ajouter</span>
              </>
            )}
          </button>
        )}
      </div>

      <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />

      {images.length === 0 && (
        <p className="text-xs text-gray-400">Photos recommandées : pièce vue de face, vue de dos, étiquette référence OEM.</p>
      )}
    </div>
  );
}
