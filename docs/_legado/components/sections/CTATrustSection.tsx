const CTATrustSection = () => {
  return (
    <section className="py-20 bg-allin-bg-light-2 dark:bg-allin-bg-dark-2">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Trust Indicators */}
          <div className="grid md:grid-cols-3 gap-8 text-center animate-slide-up">
            <div className="p-6 bg-allin-bg-light-1 dark:bg-allin-bg-dark-1 rounded-2xl border border-allin-orange/40 glass-card transition-all duration-300 hover:scale-105">
              <div className="text-4xl font-bold text-allin-orange mb-2">100%</div>
              <div className="text-lg font-semibold text-allin-dark dark:text-allin-white mb-1">Seguro e Confiável</div>
              <div className="text-sm text-allin-dark/80 dark:text-allin-white/80">Empresa estabelecida e transparente</div>
            </div>
            <div className="p-6 bg-allin-bg-light-1 dark:bg-allin-bg-dark-1 rounded-2xl border border-allin-orange/40 glass-card transition-all duration-300 hover:scale-105">
              <div className="text-4xl font-bold text-allin-orange mb-2">0</div>
              <div className="text-lg font-semibold text-allin-dark dark:text-allin-white mb-1">Taxa de Inscrição*</div>
              <div className="text-sm text-allin-dark/80 dark:text-allin-white/80">Comece gratuitamente hoje mesmo</div>
            </div>
            <div className="p-6 bg-allin-bg-light-1 dark:bg-allin-bg-dark-1 rounded-2xl border border-allin-orange/40 glass-card transition-all duration-300 hover:scale-105">
              <div className="text-4xl font-bold text-allin-orange mb-2">24h</div>
              <div className="text-lg font-semibold text-allin-dark dark:text-allin-white mb-1">Suporte Disponível</div>
              <div className="text-sm text-allin-dark/80 dark:text-allin-white/80">Chat IA sempre ativo para você</div>
            </div>
          </div>

          <p className="text-center text-sm text-allin-dark/60 dark:text-allin-white/60 mt-8">
            *Plano Afiliado gratuito disponível
          </p>
        </div>
      </div>

      {/* Bottom Wave Effect - Removido */}
    </section>
  );
};

export default CTATrustSection;