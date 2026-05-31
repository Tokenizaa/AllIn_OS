const AboutHistorySection = () => {
  return (
    <section id="sobre" className="py-20 bg-allin-bg-light-1 dark:bg-allin-bg-dark-1">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-allin-dark dark:text-allin-white">
            Sobre a <span className="text-allin-orange">All-in</span>
          </h2>
          <p className="text-xl text-allin-dark/80 dark:text-allin-white/80 max-w-3xl mx-auto leading-relaxed">
            Líder em tênis terapêuticos no Brasil, a All-in combina tecnologia avançada com design moderno para revolucionar o mercado de calçados wellness.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8 animate-slide-up glass-card p-8 rounded-2xl">
          <h3 className="text-3xl font-bold text-allin-dark dark:text-allin-white text-center">
            Nossa História
          </h3>
          <p className="text-lg text-allin-dark/80 dark:text-allin-white/80 leading-relaxed">
            Fundada com a missão de democratizar o acesso a produtos terapêuticos de alta qualidade, a All-in nasceu da união entre inovação tecnológica e empreendedorismo sustentável. Nosso compromisso é transformar vidas através de produtos que promovem bem-estar e saúde.
          </p>
          <p className="text-lg text-allin-dark/80 dark:text-allin-white/80 leading-relaxed">
            Desenvolvemos tênis com tecnologias exclusivas como magnetoterapia e infravermelho longo, proporcionando benefícios comprovados para a saúde dos pés e do corpo inteiro. Hoje, ajudamos milhares de pessoas a melhorarem sua qualidade de vida enquanto criamos oportunidades de negócio para afiliados em todo o Brasil.
          </p>
          <div className="bg-allin-orange/15 p-6 rounded-lg glass-card-orange">
            <h4 className="text-xl font-semibold mb-2 text-allin-dark dark:text-allin-white">Nossa Missão</h4>
            <p className="text-allin-dark/80 dark:text-allin-white/80">
              Transformar vidas através de produtos inovadores e oportunidades de negócio que geram impacto positivo na saúde e na renda das pessoas. Queremos construir uma comunidade de afiliados de sucesso que compartilhem nosso propósito de bem-estar e transformação.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHistorySection;