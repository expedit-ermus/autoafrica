import { describe, it, expect, vi, beforeEach } from 'vitest';
import { reviewsService } from '@/modules/reviews/reviews.service';
import { ValidationError, NotFoundError } from '@/shared/errors';

const mockPrisma = vi.hoisted(() => ({
  review: {
    findMany: vi.fn(),
    count: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    aggregate: vi.fn(),
  },
  product: {
    findUnique: vi.fn(),
  },
  user: {
    findMany: vi.fn(),
  },
}));

vi.mock('@/lib/prisma', () => ({ prisma: mockPrisma }));

describe('ReviewsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('listReviews', () => {
    it('returns an empty result when no productId is given', async () => {
      const result = await reviewsService.listReviews('', { page: 1, pageSize: 20 });

      expect(result.total).toBe(0);
      expect(result.averageRating).toBe(0);
      expect(mockPrisma.review.findMany).not.toHaveBeenCalled();
    });

    it('returns enriched reviews with average rating and distribution', async () => {
      mockPrisma.review.findMany.mockResolvedValue([
        { id: 'r1', userId: 'u1', rating: 5, title: 'Top', content: 'Excellent' },
        { id: 'r2', userId: 'u9', rating: 4, title: '', content: 'Très bien' },
      ]);
      mockPrisma.review.count.mockResolvedValue(2);
      mockPrisma.review.aggregate.mockResolvedValue({ _avg: { rating: 4.5 } });
      mockPrisma.user.findMany.mockResolvedValue([
        { id: 'u1', firstName: 'Moussa', lastName: 'Koulibaly', shopName: 'Garage Moussa' },
      ]);

      const result = await reviewsService.listReviews('p1', { page: 1, pageSize: 20 });

      expect(mockPrisma.review.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ productId: 'p1', active: true }) }),
      );
      expect(mockPrisma.review.aggregate).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ productId: 'p1' }) }),
      );
      expect(result.total).toBe(2);
      expect(result.averageRating).toBe(4.5);
      expect(result.ratingCounts).toEqual({ 1: 0, 2: 0, 3: 0, 4: 1, 5: 1 });
      expect(result.data[0].comment).toBe('Excellent');
      expect(result.data[0].author.firstName).toBe('Moussa');
      expect(result.data[1].author.firstName).toBe('Utilisateur');
    });
  });

  describe('createReview', () => {
    it('rejects a missing product', async () => {
      await expect(
        reviewsService.createReview({ userId: 'u1', productId: '', rating: 5, content: 'ok' }),
      ).rejects.toBeInstanceOf(ValidationError);
    });

    it('rejects a rating outside 1-5', async () => {
      await expect(
        reviewsService.createReview({ userId: 'u1', productId: 'p1', rating: 0, content: 'ok' }),
      ).rejects.toBeInstanceOf(ValidationError);
      await expect(
        reviewsService.createReview({ userId: 'u1', productId: 'p1', rating: 6, content: 'ok' }),
      ).rejects.toThrow('entre 1 et 5');
    });

    it('rejects an empty comment', async () => {
      await expect(
        reviewsService.createReview({ userId: 'u1', productId: 'p1', rating: 5, content: '   ' }),
      ).rejects.toBeInstanceOf(ValidationError);
    });

    it('throws NotFoundError when the product does not exist', async () => {
      mockPrisma.product.findUnique.mockResolvedValue(null);

      await expect(
        reviewsService.createReview({ userId: 'u1', productId: 'missing', rating: 5, content: 'ok' }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it('rejects a duplicate review by the same user', async () => {
      mockPrisma.product.findUnique.mockResolvedValue({ id: 'p1' });
      mockPrisma.review.findFirst.mockResolvedValue({ id: 'existing' });

      await expect(
        reviewsService.createReview({ userId: 'u1', productId: 'p1', rating: 5, content: 'ok' }),
      ).rejects.toBeInstanceOf(ValidationError);
      await expect(
        reviewsService.createReview({ userId: 'u1', productId: 'p1', rating: 5, content: 'ok' }),
      ).rejects.toThrow('déjà laissé un avis');
    });

    it('creates a review for a product', async () => {
      mockPrisma.product.findUnique.mockResolvedValue({ id: 'p1' });
      mockPrisma.review.findFirst.mockResolvedValue(null);
      mockPrisma.review.create.mockResolvedValue({ id: 'r1', rating: 5 });

      const result = await reviewsService.createReview({
        userId: 'u1',
        productId: 'p1',
        rating: 5,
        title: 'Très bonne pièce',
        content: 'Conforme à la description',
      });

      expect(mockPrisma.review.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            productId: 'p1',
            userId: 'u1',
            rating: 5,
            title: 'Très bonne pièce',
            content: 'Conforme à la description',
            verified: false,
          }),
        }),
      );
      expect(result.id).toBe('r1');
    });
  });
});
