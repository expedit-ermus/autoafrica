'use client';
import { useState, useEffect, useCallback } from 'react';
import StarRating from './StarRating';
import Image from 'next/image';

interface Testimonial {
  name: string;
  role: string;
  text: string;
  rating: number;
  img?: string;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  autoRotateMs?: number;
  className?: string;
}

export default function TestimonialCarousel({
  testimonials,
  autoRotateMs = 5000,
  className = '',
}: TestimonialCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const total = testimonials.length;

  const next = useCallback(() => {
    setCurrent(c => (c + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setCurrent(c => (c - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (isPaused || total <= 1) return;
    const timer = setInterval(next, autoRotateMs);
    return () => clearInterval(timer);
  }, [isPaused, next, autoRotateMs, total]);

  const t = testimonials[current];

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 sm:p-10 text-center relative">
          <div className="absolute top-4 left-6 text-5xl text-orange-200 font-serif leading-none">&ldquo;</div>

          <div className="mb-4">
            {t.img ? (
              <Image src={t.img} alt={t.name} width={64} height={64} className="w-16 h-16 rounded-full mx-auto object-cover border-2 border-orange-100" />
            ) : (
              <div className="w-16 h-16 rounded-full mx-auto bg-gradient-to-br from-[#E85D04] to-[#D00000] flex items-center justify-center text-white text-xl font-bold">
                {t.name[0]}
              </div>
            )}
          </div>

          <div className="flex justify-center mb-4">
            <StarRating rating={t.rating} size="sm" />
          </div>

          <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-6 italic">
            &ldquo;{t.text}&rdquo;
          </p>

          <div>
            <p className="font-bold text-gray-900">{t.name}</p>
            <p className="text-sm text-gray-500">{t.role}</p>
          </div>
        </div>
      </div>

      {total > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
            aria-label="Précédent"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
            aria-label="Suivant"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {total > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === current
                  ? 'bg-[#E85D04] w-7'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Témoignage ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
