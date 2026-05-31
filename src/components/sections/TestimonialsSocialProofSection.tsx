const TestimonialsSocialProofSection = () => {
  return (
    <section className="py-20 bg-allin-bg-light-2 dark:bg-allin-bg-dark-2">
      <div className="container mx-auto px-4">
        {/* Social Proof */}
        <div className="text-center bg-allin-orange rounded-2xl p-8 text-allin-dark animate-slide-up glass-card">
          <h2 className="text-3xl font-bold mb-4">
            Junte-se a Mais de 500 Distribuidores de Sucesso
          </h2>
          <p className="text-lg mb-8 text-allin-dark/90 max-w-3xl mx-auto">
            Faça parte de uma comunidade que está transformando vidas através 
            de produtos inovadores e oportunidades reais de crescimento.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="transition-all duration-300 hover:scale-110">
              <div className="text-4xl font-bold text-allin-dark mb-2">95%</div>
              <div className="text-allin-dark/80">Taxa de Satisfação</div>
            </div>
            <div className="transition-all duration-300 hover:scale-110">
              <div className="text-4xl font-bold text-allin-dark mb-2">4.8/5</div>
              <div className="text-allin-dark/80">Avaliação Média</div>
            </div>
            <div className="transition-all duration-300 hover:scale-110">
              <div className="text-4xl font-bold text-allin-dark mb-2">89%</div>
              <div className="text-allin-dark/80">Taxa de Retenção</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSocialProofSection;
