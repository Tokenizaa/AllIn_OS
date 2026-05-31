import React from 'react';

const HighDemandProductsCTA = () => {
  return (
    <section className="py-12 bg-allin-bg-light-2 dark:bg-allin-bg-dark-2">
      <div className="container mx-auto px-4">
        <div className="text-center p-8 bg-allin-orange rounded-2xl text-allin-dark animate-slide-up glass-card">
          <h3 className="text-2xl font-bold mb-4">
            Produtos de Alta Demanda no Mercado.
          </h3>
          <p className="text-lg mb-6 opacity-90">
            Seja parte de uma revolução no mercado de wellness e ganhe comissões 
            vendendo produtos que realmente fazem a diferença na vida das pessoas.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-8 text-center">
            <div className="transition-all duration-300 hover:scale-110">
              <div className="text-3xl font-bold text-allin-dark dark:text-allin-white">89%</div>
              <div className="text-sm text-allin-dark/80 dark:text-allin-white/80">Taxa de Recompra</div>
            </div>
            <div className="transition-all duration-300 hover:scale-110">
              <div className="text-3xl font-bold text-allin-dark dark:text-allin-white">4.9</div>
              <div className="text-sm text-allin-dark/80 dark:text-allin-white/80">Avaliação Média</div>
            </div>
            <div className="transition-all duration-300 hover:scale-110">
              <div className="text-3xl font-bold text-allin-dark dark:text-allin-white">+1000</div>
              <div className="text-sm text-allin-dark/80 dark:text-allin-white/80">Clientes Satisfeitos</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HighDemandProductsCTA;
