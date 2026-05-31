import React from 'react';

import { Link } from 'react-router-dom';
import { Home, ArrowLeft, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';

const NotFoundPage = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-allin-orange/10 via-background to-background p-6">
      <div className="max-w-md w-full text-center space-y-8 p-10 rounded-2xl bg-white/60 dark:bg-allin-bg-dark-2/60 backdrop-blur-md border border-allin-orange/20 shadow-2xl animate-fade-in">
        <div className="relative mx-auto w-24 h-24 bg-allin-orange/10 rounded-full flex items-center justify-center border border-allin-orange/30 animate-pulse-glow">
          <AlertCircle className="w-12 h-12 text-allin-orange" />
        </div>
        
        <div className="space-y-3">
          <h1 className="text-6xl font-extrabold text-allin-orange tracking-tight">404</h1>
          <h2 className="text-2xl font-bold text-allin-dark dark:text-allin-white">Página Não Encontrada</h2>
          <p className="text-allin-dark/75 dark:text-allin-white/75 text-sm leading-relaxed max-w-sm mx-auto">
            O link que você acessou pode estar quebrado ou a página foi removida. Vamos ajudar você a voltar ao caminho certo!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="border-allin-orange text-allin-orange hover:bg-allin-orange/10 font-semibold"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          
          <Link to="/" className="w-full sm:w-auto">
            <Button className="w-full bg-allin-orange text-allin-dark hover:bg-allin-orange/90 font-semibold shadow-md hover:shadow-lg transition-all">
              <Home className="w-4 h-4 mr-2" />
              Início
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;