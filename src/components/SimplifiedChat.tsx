import React, { useState, useEffect, useRef, useCallback, memo } from 'react';

import { motion } from 'framer-motion';

import { useChatLogic, ChatMessage } from '@/hooks/useChatLogic';

import ActionButtons from './chat/ActionButtons';
import AgentProductList from './chat/AgentProductList';
import MessageArea from './chat/MessageArea';
import MessageInput from './chat/MessageInput';

// Tipos para os diferentes estados de botões
type ButtonState = 'initial' | 'businessOpportunity' | 'plans' | 'products' | 'register' | 'affiliatePlan' | 'advancePlan' | 'excellencePlan' | 'earnings' | 'testimonials' | 'faq';

/**
 * Componente SimplifiedChat
 * 
 * Chat simplificado que permite interação com o usuário através de mensagens e botões pré-definidos.
 * 
 * Funcionalidades principais:
 * - Exibição de mensagens em tempo real
 * - Envio de mensagens do usuário
 * - Botões de ação contextuais que mudam conforme o estado da conversa
 * - Integração com o hook useChatLogic para gerenciamento de estado e persistência
 * - Formatação de mensagens com suporte a markdown básico
 * 
 * Arquitetura:
 * - Utiliza o hook useChatLogic para gerenciar o estado da conversa
 * - Componentes filhos especializados:
 *   - MessageArea: Exibe as mensagens da conversa
 *   - MessageInput: Campo de entrada para envio de mensagens
 *   - ActionButtons: Botões de ação contextuais
 */
const SimplifiedChat: React.FC = memo(() => {
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    resetChat,
    clearError,
    agentActionButtons,
    agentProducts
  } = useChatLogic();
  const [inputValue, setInputValue] = useState('');
  const [buttonState, setButtonState] = useState<ButtonState>('initial');

  /**
   * Função para enviar mensagem
   * 
   * Envia uma mensagem (passada como parâmetro ou do inputValue) através do hook useChatLogic.
   * Limpa o campo de entrada após o envio.
   * 
   * @param message - Mensagem a ser enviada (opcional, usa inputValue se não fornecida)
   */
  const handleSendMessage = useCallback((message?: string) => {
    const messageToSend = message || inputValue;
    if (messageToSend.trim() && !isLoading) {
      sendMessage(messageToSend);
      setInputValue('');
    }
  }, [inputValue, isLoading, sendMessage]);

  /**
   * Função para lidar com pressionamento de teclas no input
   * 
   * Permite envio de mensagem ao pressionar Enter (sem Shift).
   * Previne o comportamento padrão de quebra de linha.
   * 
   * @param e - Evento de teclado
   */
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  /**
   * Função otimizada para renderizar mensagem com formatação markdown básica
   * 
   * Suporta formatação de:
   * - Títulos (**) - texto em negrito com cor laranja
   * - Subtítulos (###) - texto em negrito com borda inferior
   * - Listas com marcadores (-, •, ✅, etc.)
   * - Listas numeradas (1., 2., etc.)
   * - Links (http)
   * - Texto em destaque (*)
   * - Quebras de linha
   * 
   * @param text - Texto da mensagem a ser formatado
   * @returns Elementos React formatados
   */
  const renderMessage = useCallback((text: string) => {
    return text.split('\n').map((line, index) => {
      // Detectar se é um título (começa com **)
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <p key={index} className="font-bold text-xs mb-1 text-allin-orange">
            {line.replace(/\*\*/g, '')}
          </p>
        );
      }
      
      // Detectar se é um subtítulo (começa com ###)
      if (line.startsWith('### ')) {
        return (
          <p key={index} className="font-semibold text-xs mb-1 mt-2 text-allin-dark dark:text-allin-white border-b border-allin-orange/20 pb-1">
            {line.replace('### ', '')}
          </p>
        );
      }
      
      // Detectar se é um item de lista com marcadores (começa com -, •, ✅, etc.)
      if (line.match(/^[\-•✅🎯📚👥📞📊🎯💰🪜🚀💎🔗🛍️💸🎁📈🥇🥈🥉🏆➕👟🧲🔥🌟📝✨👋🤝]\s/)) {
        return (
          <p key={index} className="text-xs mb-1 pl-2 flex items-start">
            <span className="mr-1">{line.charAt(0)}</span>
            <span>{line.substring(2)}</span>
          </p>
        );
      }
      
      // Detectar se é um item de lista numerada
      if (line.match(/^\d+\.\s/)) {
        return (
          <p key={index} className="text-xs mb-1 pl-2 flex items-start">
            <span className="mr-1 font-medium">{line.split('.')[0]}.</span>
            <span>{line.substring(line.indexOf('.') + 2)}</span>
          </p>
        );
      }
      
      // Detectar links
      if (line.includes('http')) {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const parts = line.split(urlRegex);
        
        return (
          <p key={index} className="text-xs mb-1">
            {parts.map((part, i) => {
              if (part.match(urlRegex)) {
                return (
                  <a 
                    key={i} 
                    href={part} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-allin-orange hover:underline"
                  >
                    {part}
                  </a>
                );
              }
              return part;
            })}
          </p>
        );
      }
      
      // Detectar texto em destaque (entre *)
      if (line.includes('*') && line.match(/\*[^*]+\*/)) {
        const parts = line.split('*');
        return (
          <p key={index} className="text-xs mb-1">
            {parts.map((part, i) => {
              if (i % 2 === 1) {
                return <span key={i} className="font-semibold text-allin-orange">{part}</span>;
              }
              return part;
            })}
          </p>
        );
      }
      
      // Linha normal
      if (line.trim()) {
        return (
          <p key={index} className="text-xs mb-1">
            {line}
          </p>
        );
      }
      
      // Linha vazia para espaçamento
      return <br key={index} />;
    });
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <MessageArea 
        messages={messages}
        isLoading={isLoading}
        error={error}
        clearError={clearError}
        renderMessage={renderMessage}
      />

      {/* Produtos sugeridos pelo Agente Allin */}
      {agentProducts.length > 0 && (
        <AgentProductList products={agentProducts} />
      )}

      {/* Action Buttons */}
      <ActionButtons 
        buttonState={buttonState}
        setButtonState={setButtonState}
        handleSendMessage={handleSendMessage}
        dynamicActionButtons={agentActionButtons}
      />

      {/* Input area */}
      <MessageInput
        inputValue={inputValue}
        onInputChange={setInputValue}
        onSendMessage={handleSendMessage}
        onKeyPress={handleKeyPress}
        isLoading={isLoading}
      />
    </div>
  );
});

export default SimplifiedChat;
