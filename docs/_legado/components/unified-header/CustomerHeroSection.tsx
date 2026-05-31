import HeroIntroSection from '@/components/sections/HeroIntroSection';

const CustomerHeroSection = () => {
  return (
    <HeroIntroSection
      id="sobre"
      title="Saúde nos seus pés começa aqui. Alívio imediato e duradouro."
      subtitle="Para quem convive com dores, cansaço ou problemas de circulação, a Allin oferece tecnologia para melhorar seu dia a dia."
      primaryButtonText="Descubra como aliviar seus sintomas"
      primaryButtonLink="/#problemas"
      secondaryButtonText="Ver depoimentos"
      secondaryButtonLink="/#testimonials"
    />
  );
};

export default CustomerHeroSection;