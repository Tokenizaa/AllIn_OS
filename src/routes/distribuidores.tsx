import { createFileRoute } from '@tanstack/react-router'
import React from 'react'

import { ArrowRight } from 'lucide-react'

import BenefitsSection from "@/components/BenefitsSection"
import ChatInterface from "@/components/ChatInterface"
import Footer from "@/components/Footer"
import AboutHistorySection from "@/components/sections/AboutHistorySection"
import AboutValuesSection from "@/components/sections/AboutValuesSection"
import CTAMainSection from "@/components/sections/CTAMainSection"
import CTATrustSection from "@/components/sections/CTATrustSection"
import HeroIntroSection from "@/components/sections/HeroIntroSection"
import HomeFAQSection from "@/components/sections/HomeFAQSection"
import LeadCaptureSection from "@/components/sections/LeadCaptureSection"
import PlansOverviewSection from "@/components/sections/PlansOverviewSection"
import TestimonialsSection from "@/components/TestimonialsSection"
import { Button } from '@/components/ui/button'


const DistribuidoresPage = () => {
  return (
    <div className="min-h-screen">
      <HeroIntroSection title="Bem-vindo" subtitle="Conheça nossos produtos" />

      <AboutHistorySection />

      <AboutValuesSection />

      <BenefitsSection />

      <PlansOverviewSection />

      <CTAMainSection />

      <TestimonialsSection />

      <CTATrustSection />

      {/* CTA após Depoimentos */}
      <section className="py-16 bg-allin-bg-light-2 dark:bg-allin-bg-dark-2 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-allin-dark dark:text-allin-white mb-4">
            Viu os Resultados? Agora é Sua Vez!
          </h2>
          <p className="text-lg text-allin-dark/70 dark:text-allin-white/70 mb-8">
            Milhares já transformaram suas vidas. Cadastre-se e comece sua jornada de sucesso.
          </p>
          <Button 
            variant="vibrant" 
            size="lg" 
            className="font-semibold px-8 py-4"
            onClick={() => document.getElementById('cadastro')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Começar Agora
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      <HomeFAQSection />

      {/* Cadastro */}
      <LeadCaptureSection />

      <Footer />
      <ChatInterface />
    </div>
  );
};

export const Route = createFileRoute('/distribuidores')({
  component: DistribuidoresPage,
})
