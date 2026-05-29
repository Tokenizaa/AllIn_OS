import React from 'react';

import ChatInterface from '@/components/ChatInterface';
import Footer from '@/components/Footer';
import ModelsSection from '@/components/ModelsSection';
import ProductsSection from '@/components/ProductsSection';
import DiseaseIdentificationSection from '@/components/sections/DiseaseIdentificationSection';
import FAQAccordionSection from '@/components/sections/FAQAccordionSection';
import HeroIntroSection from '@/components/sections/HeroIntroSection';
import HomeTestimonialsSection from '@/components/sections/HomeTestimonialsSection';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <HeroIntroSection
        id="sobre"
        title="Saúde nos seus pés começa aqui. Alívio imediato e duradouro."
        subtitle="Para quem convive com dores, cansaço ou problemas de circulação, a Allin oferece tecnologia para melhorar seu dia a dia."
        primaryButtonText="Descubra como aliviar seus sintomas"
        primaryButtonLink="/doencas"
        secondaryButtonText="Ver depoimentos"
        secondaryButtonLink="/#testimonials"
      />
      <ProductsSection />
      <DiseaseIdentificationSection />
      <ModelsSection />
      <HomeTestimonialsSection />
      <FAQAccordionSection />
      <Footer />
      <ChatInterface />
    </div>
  );
};

export default HomePage;