import React, { useState } from 'react';

import { Phone, User, ArrowRight, CheckCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function LeadCaptureSection() {
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !whatsapp.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha seu nome e WhatsApp.",
        variant: "destructive"
      });
      return;
    }

    // Validação simples do WhatsApp
    const whatsappClean = whatsapp.replace(/\D/g, '');
    if (whatsappClean.length < 10 || whatsappClean.length > 11) {
      toast({
        title: "WhatsApp inválido",
        description: "Por favor, insira um número de WhatsApp válido.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Salvar lead no localStorage
      const leads = JSON.parse(localStorage.getItem('leads') || '[]');
      const newLead = {
        id: crypto.randomUUID(),
        name: name.trim(),
        whatsapp: whatsapp.trim(),
        createdAt: new Date().toISOString()
      };
      
      leads.push(newLead);
      localStorage.setItem('leads', JSON.stringify(leads));

      // Disparar evento customizado para o chat
      window.dispatchEvent(new CustomEvent('leadCaptured', {
        detail: { 
          leadId: newLead.id, 
          name: name.trim(),
          whatsapp: whatsapp.trim() 
        }
      }));

      setIsSubmitted(true);
      toast({
        title: "Dados salvos com sucesso! ✅",
        description: "Em breve nosso consultor entrará em contato."
      });

    } catch (error) {
      console.error('Erro ao salvar lead:', error);
      toast({
        title: "Erro ao salvar dados",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section className="py-20 bg-allin-bg-light-1 dark:bg-allin-bg-dark-1">
        <div className="container mx-auto px-4">
          <Card className="max-w-md mx-auto border-allin-orange/30 bg-allin-white/80 dark:bg-allin-bg-dark-2/80 backdrop-blur-sm">
            <CardContent className="text-center p-8">
              <CheckCircle className="w-16 h-16 text-allin-orange mx-auto mb-4" />
              <h3 className="text-xl font-bold text-allin-dark dark:text-allin-white mb-2">
                Dados Enviados! ✅
              </h3>
              <p className="text-allin-dark/70 dark:text-allin-white/70 mb-4">
                Olá, {name}! Recebemos seus dados e em breve nosso consultor entrará em contato via WhatsApp.
              </p>
              <p className="text-sm text-allin-dark/60 dark:text-allin-white/60">
                Enquanto isso, explore mais sobre nossos produtos terapêuticos abaixo!
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-allin-bg-light-1 dark:bg-allin-bg-dark-1" id="cadastro">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-allin-dark dark:text-allin-white mb-4">
            Comece Sua Jornada de <span className="text-allin-orange">Sucesso</span>
          </h2>
          <p className="text-lg text-allin-dark/70 dark:text-allin-white/70">
            Deixe seus dados e receba orientação personalizada sobre como gerar renda extra com nossos produtos terapêuticos.
          </p>
        </div>

        <Card className="max-w-lg mx-auto border-allin-orange/30 bg-allin-white/80 dark:bg-allin-bg-dark-2/80 backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-allin-dark dark:text-allin-white">
              Quero Ser Distribuidor
            </CardTitle>
            <CardDescription className="text-allin-dark/70 dark:text-allin-white/70">
              Preencha os dados abaixo e nossa equipe entrará em contato
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-allin-dark dark:text-allin-white">
                  <User className="w-4 h-4 inline mr-2" />
                  Nome Completo *
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Digite seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-allin-white dark:bg-allin-bg-dark-3 border-allin-orange/30"
                  disabled={isSubmitting}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="whatsapp" className="block text-sm font-medium text-allin-dark dark:text-allin-white">
                  <Phone className="w-4 h-4 inline mr-2" />
                  WhatsApp *
                </label>
                <Input
                  id="whatsapp"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="bg-allin-white dark:bg-allin-bg-dark-3 border-allin-orange/30"
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="bg-allin-orange/10 dark:bg-allin-orange/20 p-4 rounded-lg">
                <h4 className="font-semibold text-allin-dark dark:text-allin-white mb-2">
                  ✨ O que você vai receber:
                </h4>
                <ul className="text-sm text-allin-dark/70 dark:text-allin-white/70 space-y-1">
                  <li>• Orientação personalizada sobre os planos</li>
                  <li>• Material de treinamento exclusivo</li>
                  <li>• Suporte completo para iniciantes</li>
                  <li>• Acesso ao grupo VIP de distribuidores</li>
                </ul>
              </div>

              <Button
                variant="vibrant"
                type="submit"
                className="w-full font-semibold py-3 text-base"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  'Enviando...'
                ) : (
                  <>
                    Quero Ser Distribuidor
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-allin-dark/60 dark:text-allin-white/60">
                Seus dados estão seguros conosco. Não enviamos spam.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}