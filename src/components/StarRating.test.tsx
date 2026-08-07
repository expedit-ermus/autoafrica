// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react';
import StarRating, { ProductReviews } from './StarRating';

describe('StarRating', () => {
  afterEach(cleanup);

  it('renders five stars by default', () => {
    const { container } = render(<StarRating rating={4} />);
    expect(container.querySelectorAll('button')).toHaveLength(5);
  });

  it('renders a custom number of stars', () => {
    const { container } = render(<StarRating rating={3} maxStars={3} />);
    expect(container.querySelectorAll('button')).toHaveLength(3);
  });

  it('is read-only by default and does not call onChange', () => {
    const onChange = vi.fn();
    const { container } = render(<StarRating rating={3} onChange={onChange} />);
    fireEvent.click(container.querySelectorAll('button')[2]);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('calls onChange with the star index when interactive', () => {
    const onChange = vi.fn();
    const { container } = render(<StarRating rating={2} interactive onChange={onChange} />);
    fireEvent.click(container.querySelectorAll('button')[4]);
    expect(onChange).toHaveBeenCalledWith(5);
  });
});

describe('ProductReviews', () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch);
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('renders reviews, the author and the average rating', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          data: [{ id: 'r1', rating: 5, comment: 'Très bien', author: { firstName: 'Awa' } }],
          averageRating: 5,
          total: 1,
        },
      }),
    });

    render(<ProductReviews productId="p1" />);

    expect(await screen.findByText('Très bien')).toBeTruthy();
    expect(screen.getByText('Awa')).toBeTruthy();
    expect(screen.getByText('1 avis')).toBeTruthy();
    expect(mockFetch).toHaveBeenCalledWith('/api/v1/reviews?productId=p1');
  });

  it('shows the empty state when there are no reviews', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: { data: [], averageRating: 0, total: 0 } }),
    });

    render(<ProductReviews productId="p1" />);

    expect(await screen.findByText('Aucun avis pour le moment')).toBeTruthy();
  });

  it('submits a review via POST and reloads the list', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: { data: [], averageRating: 0, total: 0 } }),
      })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) });

    render(<ProductReviews productId="p1" />);

    await screen.findByText('Aucun avis pour le moment');
    fireEvent.click(screen.getByText(/Laisser un avis/));
    fireEvent.change(screen.getByLabelText('Votre avis'), { target: { value: 'Excellente pièce' } });
    fireEvent.click(screen.getByText('Publier'));

    await waitFor(() => {
      const postCall = mockFetch.mock.calls.find((call) => call[0] === '/api/v1/reviews');
      expect(postCall).toBeTruthy();
    });
    expect(mockFetch.mock.calls[0][0]).toBe('/api/v1/reviews?productId=p1');
    expect(mockFetch.mock.calls.length).toBeGreaterThanOrEqual(3);
  });
});
