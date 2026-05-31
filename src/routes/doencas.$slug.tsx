import { useState } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useDistributor } from "@/lib/distributor-context";
import { Button } from "@/components/ui/button";
import { PublicHeader } from "@/components/app/public-header";
import Footer from "@/components/Footer";
import DiseaseCard from "@/components/shared/DiseaseCard";
import { Activity, Bone, Heart, Zap } from "lucide-react";

export const Route = createFileRoute("/doencas/$slug")({
  component: DiseasesPage,
});

function DiseasesPage() {
  const params = useParams({ strict: false }) as { slug?: string };
  const { currentDistributor, setDistributorBySlug } = useDistributor();
  
  const routeSlug = params.slug?.toLowerCase().trim();
  
  useState(() => {
    if (routeSlug) {
      setDistributorBySlug(routeSlug);
    }
  });

  const sponsorSlug = currentDistributor.slug;

  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const diseases = [
    {
      title: "Esporão de Calcâneo",
      description: "Dificuldade para dar os primeiros passos do dia? O suporte anatômico e amortecimento absorvem impactos e reduzem o desconforto.",
      details: "O esporão de calcâneo é um crescimento ósseo no calcanhar que causa dor intensa. Nossos calçados com palmilhas tecnológicas distribuem melhor o peso e reduzem a pressão sobre o esporão.",
      icon: Bone,
      image: "/assets/images/esporao-calcaneo.jpg"
    },
    {
      title: "Fibromialgia",
      description: "Dor difusa e fadiga constante? O infravermelho longo relaxa os músculos e reduz o desconforto ao longo do dia.",
      details: "A fibromialgia causa dor muscular generalizada. O infravermelho longo em nossos produtos ajuda a relaxar os músculos e reduzir a fadiga.",
      icon: Zap,
      image: "/assets/images/fibromialgia.jpg"
    },
    {
      title: "Neuropatia Diabética",
      description: "Formigamento ou perda de sensibilidade nos pés? Protegemos pontos de pressão e reduzimos atrito com tecido respirável, garantindo segurança.",
      details: "A neuropatia diabética afeta a sensibilidade dos pés, aumentando o risco de feridas. Nossos produtos protegem pontos de pressão e oferecem suporte adequado.",
      icon: Activity,
      image: "/assets/images/neuropatia-diabetica.jpg"
    },
    {
      title: "Varizes / Má Circulação",
      description: "Pernas pesadas e inchadas? A magnetoterapia melhora a circulação e reduz sensação de cansaço e inchaço, proporcionando leveza.",
      details: "A má circulação pode causar inchaço, dor e sensação de peso nas pernas. Nossa tecnologia estimula o fluxo sanguíneo, ajudando a reduzir esses desconfortos.",
      icon: Heart,
      image: "/assets/images/varizes.jpg"
    }
  ];

  const toggleCard = (index: number) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-allin-bg-light-1 dark:bg-allin-bg-dark-1">
      <PublicHeader />
      <div className="pt-20">
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-allin-dark dark:text-allin-white">
                Você sofre com algum destes{" "}
                <span className="text-allin-orange">problemas?</span>
              </h1>
              <p className="text-xl text-allin-dark/80 dark:text-allin-white/80 max-w-2xl mx-auto">
                Clique em cada card para ver como a tecnologia Allin atua em cada caso.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {diseases.map((disease, index) => (
                <DiseaseCard
                  key={index}
                  title={disease.title}
                  description={disease.description}
                  details={disease.details}
                  icon={disease.icon}
                  image={disease.image}
                  className="cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => toggleCard(index)}
                />
              ))}
            </div>

            <div className="mt-16 text-center">
              <Link to={`/loja/${sponsorSlug}`}>
                <Button variant="vibrant" size="lg" className="text-lg px-8 py-6">
                  Ver Produtos que Podem Ajudar
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
