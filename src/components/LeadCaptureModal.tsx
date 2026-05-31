import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useLeadManagement } from '@/hooks/useLeadManagement';
import { formatWhatsApp, validateWhatsApp, formatName, validateName } from '@/utils/leadFormatter';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLeadCaptured: (leadData: { name: string; whatsapp: string; leadId: string }) => void;
}

export default function LeadCaptureModal({ isOpen, onClose, onLeadCaptured }: LeadCaptureModalProps) {
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { saveLead, updateChatStateWithLead } = useLeadManagement();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Iniciando captura de lead...', { name, whatsapp });
    
    // Validar nome
    if (!validateName(name)) {
      toast({
        title: "Nome inválido",
        description: "Por favor, insira um nome válido.",
        variant: "destructive"
      });
      return;
    }

    // Validar WhatsApp
    if (!validateWhatsApp(whatsapp)) {
      toast({
        title: "WhatsApp inválido",
        description: "Por favor, insira um número de WhatsApp válido.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Salvando lead localmente...');
      
      // Formatar dados
      const formattedName = formatName(name);
      const formattedWhatsApp = formatWhatsApp(whatsapp);
      
      // Gerar um ID único para o lead
      const leadId = crypto.randomUUID();
      
      // Criar objeto do lead
      const newLead = {
        name: formattedName,
        whatsapp: formattedWhatsApp,
        leadId
      };
      
      // Salvar lead usando o serviço
      saveLead(newLead);
      
      // Atualizar estado do chat
      updateChatStateWithLead(newLead);

      console.log('Lead salvo com sucesso:', newLead);

      // Notificar componente pai
      onLeadCaptured(newLead);

      toast({
        title: "Dados salvos com sucesso!",
        description: "Agora posso te ajudar melhor. Como posso ajudá-lo?"
      });

      onClose();
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[300px]">
        <DialogHeader>
          <DialogTitle className="text-center text-sm font-semibold text-allin-dark">
            Vamos começar! 👋
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-2.5">
          <p className="text-center text-xs text-allin-dark/70">
            Para te oferecer a melhor orientação sobre oportunidades de negócio, preciso conhecer você melhor:
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-2.5">
            <div>
              <label htmlFor="name" className="block text-xs font-medium text-allin-dark mb-1">
                Seu nome
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Digite seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs py-1 px-2"
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <label htmlFor="whatsapp" className="block text-xs font-medium text-allin-dark mb-1">
                WhatsApp
              </label>
              <Input
                id="whatsapp"
                type="tel"
                placeholder="(11) 99999-9999"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full text-xs py-1 px-2"
                disabled={isSubmitting}
              />
            </div>
            
            <div className="flex gap-1.5 pt-1">
              <Button
                type="button"
                variant="vibrantOutline"
                onClick={onClose}
                className="flex-1 text-xs py-1"
                disabled={isSubmitting}
              >
                Pular
              </Button>
              <Button
                variant="vibrant"
                type="submit"
                className="flex-1 text-xs py-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Salvando...' : 'Continuar'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
