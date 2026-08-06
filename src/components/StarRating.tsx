'use client';
import { useState, useEffect } from 'react';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

export default function StarRating({ rating, maxStars = 5, size = 'md', interactive = false, onChange }: StarRatingProps) {
  const [hover, setHover] = useState(0);
  const sizeMap = { sm: 'w-3 h-3', md: 'w-4 h-4', lg: 'w-5 h-5' };
  const starSize = sizeMap[size];

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: maxStars }, (_, i) => {
        const star = i + 1;
        const filled = interactive ? star <= (hover || rating) : star <= rating;
        const halfFilled = !interactive && !filled && star - 0.5 <= rating;
        return (
          <button key={i} type="button"
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
            disabled={!interactive}
            onMouseEnter={() => interactive && setHover(star)}
            onMouseLeave={() => interactive && setHover(0)}
            onClick={() => interactive && onChange?.(star)}>
            <svg className={`${starSize} ${filled ? 'text-yellow-400' : halfFilled ? 'text-yellow-300' : 'text-gray-300'}`}
              fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}

interface Review {
  id: string;
  rating: number;
  title?: string | null;
  content?: string | null;
  comment?: string;
  createdAt?: string;
  author?: { firstName?: string; lastName?: string };
}
interface ReviewsProps {
  productId: string;
}

export function ProductReviews({ productId }: ReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ rating: 5, title: '', comment: '' });
  const [submitting, setSubmitting] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/api/v1/reviews?productId=${productId}`);
        const data = await res.json();
        if (!cancelled && data.success) {
          setReviews(data.data.data);
          setAvgRating(data.data.averageRating || 0);
          setTotal(data.data.total);
        }
      } catch {} finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [productId, refreshKey]);

  const handleSubmit = async () => {
    if (!form.comment) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/v1/reviews', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ productId, ...form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setShowForm(false);
      setForm({ rating: 5, title: '', comment: '' });
      setRefreshKey(k => k + 1);
    } catch (err) { alert(err instanceof Error ? err.message : 'Erreur'); } finally { setSubmitting(false); }
  };

  const ratingDist = [5, 4, 3, 2, 1].map(r => ({
    stars: r,
    count: reviews.filter(rev => rev.rating === r).length,
    pct: total > 0 ? (reviews.filter(rev => rev.rating === r).length / total) * 100 : 0,
  }));

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-xl">
        <div className="text-center">
          <p className="text-3xl font-extrabold text-gray-900">{avgRating || '—'}</p>
          <StarRating rating={avgRating} size="sm" />
          <p className="text-xs text-gray-500 mt-1">{total} avis</p>
        </div>
        <div className="flex-1 space-y-1">
          {ratingDist.map(d => (
            <div key={d.stars} className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-3">{d.stars}</span>
              <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-yellow-400 rounded-full" style={{ width: `${d.pct}%` }}></div></div>
              <span className="text-xs text-gray-400 w-5 text-right">{d.count}</span>
            </div>
          ))}
        </div>
      </div>

      <button onClick={() => setShowForm(!showForm)} className="text-sm text-orange-600 font-medium hover:underline">
        {showForm ? 'Annuler' : '✏️ Laisser un avis'}
      </button>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
          <div><p className="text-xs text-gray-500 mb-1">Note</p><StarRating rating={form.rating} interactive onChange={r => setForm({ ...form, rating: r })} size="lg" /></div>
          <input className="input-field" aria-label="Titre de l'avis (optionnel)" placeholder="Titre (optionnel)" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          <textarea className="input-field" rows={3} aria-label="Votre avis" placeholder="Votre avis *" value={form.comment} onChange={e => setForm({ ...form, comment: e.target.value })} />
          <button onClick={handleSubmit} disabled={submitting} className="btn-primary text-sm !py-2 px-4 disabled:opacity-50">
            {submitting ? 'Envoi...' : 'Publier'}
          </button>
        </div>
      )}

      {reviews.length > 0 && (
        <div className="space-y-3">
          {reviews.map(rev => (
            <div key={rev.id} className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-xs font-bold text-orange-700">
                  {(rev.author?.firstName || 'U')[0]}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{rev.author?.firstName} {rev.author?.lastName}</p>
                  <div className="flex items-center gap-2">
                    <StarRating rating={rev.rating} size="sm" />
                    <span className="text-[10px] text-gray-400">{rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('fr-FR') : ''}</span>
                  </div>
                </div>
              </div>
              {rev.title && <p className="text-sm font-bold text-gray-800 mb-1">{rev.title}</p>}
              <p className="text-sm text-gray-600">{rev.comment || rev.content}</p>
            </div>
          ))}
        </div>
      )}

      {!loading && reviews.length === 0 && <p className="text-sm text-gray-400 text-center py-4">Aucun avis pour le moment</p>}
    </div>
  );
}
