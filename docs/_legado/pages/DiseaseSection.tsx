import { useState } from "react";

import { Button } from "@/components/ui/button";


const DiseaseSection = () => {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const diseases = [
    {
      title: "Fascite plantar",
      description: "Dor intensa no calcanhar ao caminhar ou levantar da cama? Nossos solados e palmilhas reduzem a pressão e aliviam a inflamação desde os primeiros usos.",
      details: "A fascite plantar é uma inflamação da fáscia plantar, o tecido que conecta o calcanhar aos dedos do pé. Nossos produtos com magnetoterapia e suporte anatômico ajudam a reduzir a tensão nessa região, proporcionando alívio significativo."
    },
    {
      title: "Esporão de calcâneo",
      description: "Dificuldade para dar os primeiros passos do dia? O suporte anatômico e amortecimento absorvem impactos e reduzem o desconforto.",
      details: "O esporão de calcâneo é um crescimento ósseo no calcanhar que causa dor intensa. Nossos calçados com palmilhas tecnológicas distribuem melhor o peso e reduzem a pressão sobre o esporão."
    },
    {
      title: "Varizes / Má circulação",
      description: "Pernas pesadas e inchadas? A magnetoterapia melhora a circulação e reduz sensação de cansaço e inchaço, proporcionando leveza.",
      details: "A má circulação pode causar inchaço, dor e sensação de peso nas pernas. Nossa tecnologia estimula o fluxo sanguíneo, ajudando a reduzir esses desconfortos."
    },
    {
      title: "Neuropatia diabética",
      description: "Formigamento ou perda de sensibilidade nos pés? Protegemos pontos de pressão e reduzimos atrito com tecido respirável, garantindo segurança.",
      details: "A neuropatia diabética afeta a sensibilidade dos pés, aumentando o risco de feridas. Nossos produtos protegem pontos de pressão e oferecem suporte adequado."
    },
    {
      title: "Artrite / Artrose",
      description: "Rigidez e dor nas articulações limitando sua mobilidade? Palmilhas tecnológicas e amortecimento aliviam a tensão e promovem conforto.",
      details: "Artrite e artrose causam inflamação e dor nas articulações. Nosso suporte anatômico reduz o impacto e proporciona alívio durante a caminhada."
    },
    {
      title: "Fibromialgia",
      description: "Dor difusa e fadiga constante? O infravermelho longo relaxa os músculos e reduz o desconforto ao longo do dia.",
      details: "A fibromialgia causa dor muscular generalizada. O infravermelho longo em nossos produtos ajuda a relaxar os músculos e reduzir a fadiga."
    },
    {
      title: "Dores lombares",
      description: "Coluna sobrecarregada por má postura ou pisada incorreta? O suporte postural corrige a distribuição de peso e alivia a sobrecarga.",
      details: "Problemas na pisada podem afetar todo o corpo, incluindo a coluna. Nossos produtos corrigem a distribuição de peso e ajudam a aliviar dores lombares."
    }
  ];

  const toggleCard = (index: number) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  return (
    <section className="py-20 bg-background dark:bg-allin-bg-dark-1">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Você sofre com algum destes{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              problemas?
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto dark:text-allin-white/80">
            Clique em cada card para ver como a tecnologia Allin atua em cada caso.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {diseases.map((disease, index) => (
            <div 
              key={index} 
              className="group relative bg-white/15 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer dark:bg-white/10 dark:border-white/25"
              onClick={() => toggleCard(index)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-foreground dark:text-allin-white">{disease.title}</h3>
                  <Button variant="vibrantOutline" size="sm" className="border-allin-orange text-allin-orange hover:bg-allin-orange/10 dark:hover:bg-allin-orange/20">
                    {expandedCard === index ? "▲" : "▼"}
                  </Button>
                </div>
                <p className="text-foreground dark:text-allin-white/90 mb-4">{disease.description}</p>
                {expandedCard === index && (
                  <div className="border-t border-white/20 pt-4 mt-4 dark:border-white/25">
                    <p className="text-sm text-foreground dark:text-allin-white/80">
                      {disease.details}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DiseaseSection;