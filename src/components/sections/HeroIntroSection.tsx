import { ArrowRight, Zap, LucideIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { useSponsorLink } from "@/hooks/useSponsorLink";

interface HeroIntroSectionProps {
  id?: string;
  badgeIcon?: LucideIcon;
  badgeText?: string;
  title: string;
  subtitle: string;
  primaryButtonText?: string;
  primaryButtonAction?: () => void;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  className?: string;
}

const HeroIntroSection = ({
  id = "inicio",
  badgeIcon: BadgeIcon = Zap,
  badgeText = "Revolucione sua vida financeira!",
  title = "Transforme sua paixão em renda extra com a All In Brasil",
  subtitle = "Junte-se a milhares de distribuidores que já transformaram suas vidas. Trabalhe de onde estiver e quando quiser.",
  primaryButtonText = "Quero garantir minha vaga.",
  primaryButtonAction,
  primaryButtonLink,
  secondaryButtonText = "Ver depoimentos de sucesso.",
  secondaryButtonLink,
  className = ""
}: HeroIntroSectionProps) => {
  const { handleCadastro } = useSponsorLink();

  return (
    <section id={id} className={`min-h-screen bg-gradient-to-br from-allin-bg-dark-1 to-allin-bg-dark-2 dark:from-allin-bg-dark-1 dark:to-allin-bg-dark-2 pt-20 relative overflow-hidden ${className}`}>
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-allin-orange/5 to-transparent dark:from-allin-orange/10"></div>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-allin-orange/5 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-allin-orange/5 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center max-w-4xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-allin-orange/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm glass-card mb-8">
            <BadgeIcon className="w-4 h-4 text-allin-orange" />
            <span className="font-medium text-allin-dark dark:text-allin-white">{badgeText}</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-8 text-allin-dark dark:text-allin-white">
            {(title || "").split(' ').map((word, index) => (
              word.startsWith('<span') ? (
                <span key={index} className="text-allin-orange" dangerouslySetInnerHTML={{__html: word}} />
              ) : (
                <span key={index}>{word} </span>
              )
            ))}
          </h1>
          
          <p className="text-xl md:text-2xl text-allin-dark/90 dark:text-allin-white/90 leading-relaxed mb-8">
            {subtitle || ""}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {primaryButtonLink ? (
              <Button 
                variant="default" 
                size="lg" 
                onClick={handleCadastro}
                className="group font-semibold shadow-lg bg-allin-orange hover:bg-allin-orange/90 text-allin-dark"
              >
                {primaryButtonText}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            ) : (
              <Button 
                variant="default" 
                size="lg" 
                onClick={primaryButtonAction || handleCadastro} 
                className="group font-semibold shadow-lg bg-allin-orange hover:bg-allin-orange/90 text-allin-dark"
              >
                {primaryButtonText}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            )}
            {secondaryButtonLink && (
              <Link to={secondaryButtonLink}>
                <Button variant="outline" size="lg" className="bg-white/10 backdrop-blur-sm text-allin-dark dark:text-allin-white transition-all border-allin-orange/20 hover:border-allin-orange">
                  {secondaryButtonText}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroIntroSection;
