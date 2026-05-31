import React, { useState, useEffect } from 'react';

import { MessageCircle, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useChatLogic } from '@/hooks/useChatLogic';

import LeadCaptureModal from './LeadCaptureModal';
import SimplifiedChat from './SimplifiedChat';


const ChatInterface: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);

  const {
    shouldShowLeadModal,
    markLeadModalShown,
    setLeadData
  } = useChatLogic();

  // Verificar se deve mostrar o modal de lead quando abrir o chat
  useEffect(() => {
    if (isOpen && shouldShowLeadModal()) {
      setShowLeadModal(true);
    }
  }, [isOpen, shouldShowLeadModal]);

  const handleOpenChat = () => {
    setIsOpen(true);
  };

  const handleCloseChat = () => {
    setIsOpen(false);
  };

  const handleLeadCaptured = (leadData: { name: string; whatsapp: string; leadId: string }) => {
    setLeadData(leadData);
    setShowLeadModal(false);
    markLeadModalShown();
  };

  const handleCloseLeadModal = () => {
    setShowLeadModal(false);
    markLeadModalShown();
  };

  return (
    <>
      {/* Botão flutuante do chat */}
      {!isOpen && (
        <Button
          variant="vibrant"
          onClick={handleOpenChat}
          className="fixed bottom-6 right-6 w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50"
          size="icon"
        >
          <MessageCircle className="w-5 h-5" />
        </Button>
      )}

      {/* Interface do chat */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-72 h-[650px] bg-background border border-border rounded-lg shadow-2xl z-50 flex flex-col">
          {/* Cabeçalho do chat */}
          <div className="bg-allin-orange text-allin-white p-2 rounded-t-lg flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-sm">Agente Allin</h3>
              <p className="text-xs opacity-90">Especialista em oportunidades</p>
            </div>
            <Button
              variant="vibrantOutline"
              onClick={handleCloseChat}
              size="icon"
              className="text-allin-white hover:bg-white/20 h-7 w-7"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>

          {/* Conteúdo do chat */}
          <div className="flex-1 overflow-hidden">
            <SimplifiedChat />
          </div>
        </div>
      )}

      {/* Modal de captura de lead */}
      <LeadCaptureModal
        isOpen={showLeadModal}
        onClose={handleCloseLeadModal}
        onLeadCaptured={handleLeadCaptured}
      />
    </>
  );
};

export default ChatInterface;