import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const fascitePlantarImg = 'https://placehold.co/300x200/4F46E5/FFFFFF?text=Fascite+Plantar';
const joanetesImg = 'https://placehold.co/300x200/4F46E5/FFFFFF?text=Joanetes';
const circulacaoImg = 'https://placehold.co/300x200/4F46E5/FFFFFF?text=Circulação';
const neuromaImg = 'https://placehold.co/300x200/4F46E5/FFFFFF?text=Neuroma';
const calosImg = 'https://placehold.co/300x200/4F46E5/FFFFFF?text=Calos';
const artriteImg = 'https://placehold.co/300x200/4F46E5/FFFFFF?text=Artrite';

const DiseaseIdentificationSection = () => {
  const conditions = [
    {
      image: fascitePlantarImg,
      title: "Fascite Plantar",
      description: "Dor intensa no calcanhar, especialmente pela manhã.",
      benefit: "Alivia tensões no calcanhar e promove regeneração tecidual."
    },
    {
      image: joanetesImg,
      title: "Joanetes",
      description: "Desvio do dedão do pé com dor e inflamação.",
      benefit: "Reduz pressão e desconforto com tecnologia exclusiva."
    },
    {
      image: circulacaoImg,
      title: "Circulação",
      description: "Pés frios, formigamento ou inchaço.",
      benefit: "Melhora a circulação sanguínea e reduz inchaço."
    },
    {
      image: neuromaImg,
      title: "Neuroma de Morton",
      description: "Dor ardente entre os dedos do pé.",
      benefit: "Redistribui o peso e oferece amortecimento."
    },
    {
      image: calosImg,
      title: "Calos e Calosidades",
      description: "Pele espessida por pressão repetitiva.",
      benefit: "Reduz pontos de impacto e protege os pés."
    },
    {
      image: artriteImg,
      title: "Artrite e Artrose",
      description: "Dor e rigidez nas articulações.",
      benefit: "Oferece suporte e alívio para maior mobilidade."
    }
  ];

  return (
    <section id="problemas" className="py-20 bg-allin-bg-light-1 dark:bg-allin-bg-dark-1">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-allin-dark dark:text-allin-white">
            Identifique seu <span className="text-allin-orange">problema</span>
          </h2>
          <p className="text-xl text-allin-dark/80 dark:text-allin-white/80 max-w-3xl mx-auto">
            Conheça os sintomas mais comuns e como nossos produtos podem aliviar seu desconforto diário
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {conditions.map((condition, index) => (
            <Card key={index} className="border border-allin-orange/40 shadow-lg hover:shadow-xl transition-all duration-300 bg-allin-bg-light-2 dark:bg-allin-bg-dark-2 group animate-slide-up glass-card" style={{animationDelay: `${0.1 * index}s`}}>
              <div className="overflow-hidden rounded-t-lg h-40">
                <img 
                  src={condition.image} 
                  alt={condition.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-bold text-allin-dark dark:text-allin-white">{condition.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-allin-dark/80 dark:text-allin-white/80 text-center leading-relaxed mb-3">{condition.description}</p>
                <div className="border-t border-allin-orange/20 pt-3 mt-3">
                  <p className="text-allin-orange font-medium text-center">Benefício: {condition.benefit}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DiseaseIdentificationSection;
