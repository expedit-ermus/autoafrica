import { NextResponse } from 'next/server';
import { ApiResponse } from '../types';
import { AppError } from '../errors';

export function successResponse<T>(data: T, message?: string, status = 200) {
  const body: ApiResponse<T> = { success: true, data, message };
  return NextResponse.json(body, { status });
}

export function errorResponse(error: string, status = 500, details?: any) {
  const body: ApiResponse = { success: false, error, details };
  return NextResponse.json(body, { status });
}

export function handleApiError(error: unknown) {
  if (error instanceof AppError) {
    return errorResponse(error.message, error.statusCode, error.code);
  }
  console.error('Unexpected error:', error);
  return errorResponse('Internal server error', 500);
}
