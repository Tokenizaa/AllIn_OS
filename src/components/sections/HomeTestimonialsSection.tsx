import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const HomeTestimonialsSection = () => {
  const testimonials = [
    {
      text: "Eu havia desistido de dançar com minha esposa... até colocar os tênis Allin. Hoje danço salsa como se tivesse 30 anos novamente. Minha mobilidade voltou, minha alegria também!",
      author: "Roberto, 62 anos",
      condition: "Artrose nos joelhos"
    },
    {
      text: "Trabalhava 12 horas por dia em pé, minha fascite plantar era insuportável. Com Allin, não só voltei ao trabalho como comecei a correr 5km por dia. É como se eu tivesse ganhado uma nova vida!",
      author: "Carla, 34 anos",
      condition: "Fascite plantar severa"
    },
    {
      text: "Diabética há 15 anos, tinha medo constante de feridas nos pés. Desde que uso Allin, além de eliminar o inchaço, recuperei a confianza para passear com meus netos sem preocupação.",
      author: "Elena, 58 anos",
      condition: "Neuropatia diabética"
    },
    {
      text: "Minha fibromialgia era tão debilitante que mal conseguia sair da cama. Os tênis Allin transformaram minha rotina - hoje trabalho normalmente e até voltei a praticar jardinagem, minha paixão!",
      author: "Marcos, 45 anos",
      condition: "Fibromialgia crônica"
    },
    {
      text: "Tinha esporão no calcanhar há 3 anos. Fisioterapia, remédios, nada ajudava. Com Allin, senti alívio em 3 dias! Agora subo escadas, caminho na praia e trabalho sem dor. É simplesmente milagroso!",
      author: "Sofia, 29 anos",
      condition: "Esporão do calcâneo"
    },
    {
      text: "Minhas varizes e má circulação deixavam minhas pernas pesadas e doloridas. Com Allin, além de reduzir o inchaço, me sinto energética o dia todo. É como se tivesse recuperado minhas pernas!",
      author: "Patrícia, 41 anos",
      condition: "Má circulação e varizes"
    }
  ];

  return (
    <section className="py-20 bg-allin-bg-light-2 dark:bg-allin-bg-dark-2">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-allin-dark dark:text-allin-white">
            Histórias reais de quem recuperou a liberdade de{" "}
            <span className="text-allin-orange">
              caminhar
            </span>
          </h2>
          <p className="text-lg text-allin-dark/70 dark:text-allin-white/70 max-w-2xl mx-auto">
            Transformamos vidas todos os dias. Veja como os tênis Allin mudaram a realidade de pessoas reais.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="group relative bg-white/15 backdrop-blur-lg rounded-2xl overflow-hidden border border-allin-orange/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 glass-card"
            >
              <div className="p-8">
                <CardHeader className="p-0 mb-6">
                  <CardTitle className="text-4xl text-allin-orange">"</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-allin-dark dark:text-allin-white mb-6 italic">"{testimonial.text}"</p>
                  <p className="font-semibold text-allin-orange">— {testimonial.author}</p>
                  <p className="text-sm text-allin-dark/70 dark:text-allin-white/70 mt-2">{testimonial.condition}</p>
                </CardContent>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="bg-allin-orange/10 rounded-2xl p-8 max-w-3xl mx-auto border border-allin-orange/20">
            <h3 className="text-2xl font-bold mb-4 text-allin-dark dark:text-allin-white">Sua história pode ser a próxima!</h3>
            <p className="text-allin-dark/70 dark:text-allin-white/70 mb-6">
              Milhares de pessoas já recuperaram sua mobilidade e qualidade de vida com a tecnologia Allin.
            </p>
            <button className="bg-allin-orange text-allin-dark px-6 py-3 rounded-full font-semibold hover:bg-allin-orange/90 transition-colors">
              Descubra seu Allin
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeTestimonialsSection;
