'use client';

import { useState, useCallback } from 'react';

export interface ApiError {
  message: string;
  field?: string;
  code?: string;
}

export function useApiError() {
  const [error, setError] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleError = useCallback((error: unknown, field?: string) => {
    let errorMessage = 'An unexpected error occurred';
    
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = String(error.message);
    }

    setError({
      message: errorMessage,
      field,
    });
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  const executeWithErrorHandling = useCallback(async <T>(
    operation: () => Promise<T>,
    field?: string
  ): Promise<T | null> => {
    setLoading(true);
    clearError();
    
    try {
      const result = await operation();
      return result;
    } catch (err) {
      handleError(err, field);
      return null;
    } finally {
      setLoading(false);
    }
  }, [setLoading, clearError, handleError]);

  return {
    error,
    isLoading,
    handleError,
    clearError,
    setLoading,
    executeWithErrorHandling,
  };
} 