import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import Footer from '@/components/Footer';
import ModelsSection from '@/components/ModelsSection';
import ProductsSection from '@/components/ProductsSection';
import DiseaseIdentificationSection from '@/components/sections/DiseaseIdentificationSection';
import FAQAccordionSection from '@/components/sections/FAQAccordionSection';
import HeroIntroSection from '@/components/sections/HeroIntroSection';
import HomeTestimonialsSection from '@/components/sections/HomeTestimonialsSection';
import CartSidebar from '@/components/features/cart/CartSidebar';
import { PublicHeader } from '@/components/app/public-header';
import { useDistributor } from '@/lib/distributor-context';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  const { setDistributorBySlug } = useDistributor();

  // Initialize distributor to allinBrasil on index route
  useEffect(() => {
    setDistributorBySlug('allinBrasil');
  }, [setDistributorBySlug]);

  return (
    <div className="min-h-screen">
      <PublicHeader />
      <div className="pt-20">
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
      <CartSidebar />
      </div>
    </div>
  );
}
