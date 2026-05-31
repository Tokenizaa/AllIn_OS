import React, { useState } from 'react';

import { Send, CheckCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const LeadCaptureSection = () => {
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
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Save to localStorage
      const leads = JSON.parse(localStorage.getItem('leads') || '[]');
      leads.push({
        id: Date.now(),
        name: name.trim(),
        whatsapp: whatsapp.trim(),
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('leads', JSON.stringify(leads));

      // Dispatch custom event for tracking
      window.dispatchEvent(new CustomEvent('leadCaptured', {
        detail: { name: name.trim(), whatsapp: whatsapp.trim() }
      }));

      setIsSubmitted(true);
      toast({
        title: "Sucesso!",
        description: "Seus dados foram enviados. Entraremos em contato em breve.",
      });

      // Reset form
      setName('');
      setWhatsapp('');
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar seus dados. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section id="cadastro" className="py-16 px-4 bg-allin-bg-light-2 dark:bg-allin-bg-dark-2">
        <div className="container mx-auto max-w-2xl">
          <Card className="p-8 bg-white/30 dark:bg-allin-bg-dark-2/30 rounded-lg border border-allin-orange/10 text-center">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-allin-dark dark:text-allin-white mb-2">
              Cadastro Realizado!
            </h3>
            <p className="text-allin-dark/70 dark:text-allin-white/70 mb-6">
              Obrigado pelo seu interesse! Entraremos em contato em breve.
            </p>
            <Button onClick={() => setIsSubmitted(false)}>
              Cadastrar outra pessoa
            </Button>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="cadastro" className="py-16 px-4 bg-allin-bg-light-2 dark:bg-allin-bg-dark-2">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-allin-dark dark:text-allin-white mb-4">
            Cadastre-se Agora
          </h2>
          <p className="text-lg text-allin-dark/70 dark:text-allin-white/70">
            Preencha seus dados e entraremos em contato com você.
          </p>
        </div>

        <Card className="p-8 bg-white/30 dark:bg-allin-bg-dark-2/30 rounded-lg border border-allin-orange/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-allin-dark dark:text-allin-white mb-2">
                Nome Completo
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome completo"
                className="bg-white/50 dark:bg-allin-bg-dark-1/50 border-allin-orange/20"
                required
              />
            </div>

            <div>
              <label htmlFor="whatsapp" className="block text-sm font-medium text-allin-dark dark:text-allin-white mb-2">
                WhatsApp
              </label>
              <Input
                id="whatsapp"
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="(11) 99999-9999"
                className="bg-white/50 dark:bg-allin-bg-dark-1/50 border-allin-orange/20"
                required
              />
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-allin-orange hover:bg-allin-orange/90 text-white"
            >
              {isSubmitting ? (
                'Enviando...'
              ) : (
                <>
                  Enviar Cadastro
                  <Send className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>
        </Card>
      </div>
    </section>
  );
};

export default LeadCaptureSection;
