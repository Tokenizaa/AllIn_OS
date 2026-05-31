import React from 'react';

import { AlertCircle, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
  className?: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  className = ''
}) => {
  return (
    <section className={`py-20 bg-allin-bg-light-2 dark:bg-allin-bg-dark-2 ${className}`}>
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>

          <h2 className="text-2xl font-bold text-allin-dark dark:text-allin-white mb-4">
            Ops! Algo deu errado
          </h2>

          <p className="text-allin-dark/80 dark:text-allin-white/80 mb-6 leading-relaxed">
            {error}
          </p>

          {onRetry && (
            <Button
              variant="vibrant"
              onClick={onRetry}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Tentar Novamente
            </Button>
          )}

          <div className="mt-4 text-sm text-allin-dark/60 dark:text-allin-white/60">
            Se o problema persistir, entre em contato conosco.
          </div>
        </div>
      </div>
    </section>
  );
};

export default ErrorDisplay;
