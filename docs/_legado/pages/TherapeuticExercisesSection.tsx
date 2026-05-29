import { Play, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TherapeuticExercisesSection = () => {
  const exercises = [
    {
      title: "Fascite Plantar",
      description: "Exercícios para aliviar a dor na sola do pé",
      gif: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=400&h=300&fit=crop&crop=center",
      details: "Estes exercícios ajudam a alongar a fáscia plantar e fortalecer os músculos do pé, reduzindo a tensão e aliviando a dor característica da fascite plantar."
    },
    {
      title: "Varizes e Má Circulação",
      description: "Movimentos para melhorar a circulação sanguínea",
      gif: "https://images.unsplash.com/photo-1598983069947-35a5a5c7a7b7?w=400&h=300&fit=crop&crop=center",
      details: "Exercícios específicos para promover o retorno venoso e reduzir o inchaço nas pernas, ajudando a aliviar os sintomas de varizes e má circulação."
    },
    {
      title: "Neuropatia Diabética",
      description: "Técnicas para estimular a sensibilidade dos pés",
      gif: "https://images.unsplash.com/photo-1628760156212-7b4b6a9a3c7d?w=400&h=300&fit=crop&crop=center",
      details: "Movimentos suaves que ajudam a manter a mobilidade e sensibilidade dos pés, essenciais para prevenir complicações da neuropatia diabética."
    },
    {
      title: "Artrite e Artrose",
      description: "Alongamentos para manter a mobilidade articular",
      gif: "https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?w=400&h=300&fit=crop&crop=center",
      details: "Exercícios controlados que ajudam a manter a amplitude de movimento das articulações afetadas por artrite e artrose, reduzindo rigidez e dor."
    },
    {
      title: "Fibromialgia",
      description: "Práticas para relaxar músculos e reduzir tensão",
      gif: "https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?w=400&h=300&fit=crop&crop=center",
      details: "Técnicas de alongamento e relaxamento muscular que ajudam a aliviar a dor generalizada característica da fibromialgia."
    },
    {
      title: "Esporão do Calcâneo",
      description: "Exercícios para aliviar a dor no calcanhar",
      gif: "https://images.unsplash.com/photo-1636431315988-4a9bce7e5cbd?w=400&h=300&fit=crop&crop=center",
      details: "Movimentos específicos para alongar o tendão de Aquiles e a fáscia plantar, ajudando a reduzir a pressão sobre o esporão do calcâneo."
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Exercícios Tecnológicos{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Para Cada Condição
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Veja exercícios que podem ajudar a aliviar os sintomas de cada condição. 
            Combine com o uso dos produtos Allin para melhores resultados.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {exercises.map((exercise, index) => (
            <Card 
              key={index} 
              className="bg-white/15 backdrop-blur-lg border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <div className="relative overflow-hidden rounded-t-xl">
                <img 
                  src={exercise.gif} 
                  alt={exercise.title}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button 
                    variant="vibrant"
                    size="icon" 
                    className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Play className="h-6 w-6" />
                  </Button>
                </div>
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-bold text-foreground">{exercise.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground mb-4">{exercise.description}</p>
                <p className="text-sm text-muted-foreground">{exercise.details}</p>
                <Button 
                  variant="vibrantOutline"
                  className="w-full mt-4 rounded-full"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Ver Exercício
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="vibrant" size="lg" className="px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
            Baixe Nosso Guia Completo de Exercícios
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TherapeuticExercisesSection;