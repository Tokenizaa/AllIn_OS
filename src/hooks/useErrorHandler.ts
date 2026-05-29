import { useState } from 'react';

interface ErrorState {
  message: string | null;
  code: string | null;
}

export const useErrorHandler = () => {
  const [error, setError] = useState<ErrorState>({ message: null, code: null });

  const handleError = (error: unknown) => {
    if (error instanceof Error) {
      setError({
        message: error.message,
        code: error.name
      });
    } else {
      setError({
        message: 'Ocorreu um erro desconhecido',
        code: 'UNKNOWN_ERROR'
      });
    }
  };

  const clearError = () => {
    setError({ message: null, code: null });
  };

  return {
    error,
    handleError,
    clearError
  };
};