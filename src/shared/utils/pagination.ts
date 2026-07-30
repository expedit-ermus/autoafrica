import { PaginationParams, PaginatedResponse } from '../types';

export function getPaginationParams(params: PaginationParams) {
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.min(100, Math.max(1, params.pageSize || 20));
  const skip = (page - 1) * pageSize;
  const orderBy = params.sortBy
    ? { [params.sortBy]: params.sortOrder || 'desc' }
    : { createdAt: 'desc' as const };

  return { page, pageSize, skip, orderBy };
}

export function buildPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  pageSize: number
): PaginatedResponse<T> {
  return {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}
