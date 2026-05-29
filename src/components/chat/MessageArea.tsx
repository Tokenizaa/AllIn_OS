import React, { useRef, useEffect } from 'react';

import { motion, AnimatePresence } from 'framer-motion';

import { ChatMessage } from '@/hooks/useChatLogic';

interface MessageAreaProps {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  renderMessage: (text: string) => React.ReactNode;
}

const MessageArea = ({ 
  messages, 
  isLoading, 
  error, 
  clearError,
  renderMessage
}: MessageAreaProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Função para rolar para o final das mensagens
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-2 space-y-2">
      <AnimatePresence>
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-2 rounded-md ${
                message.isUser
                  ? 'bg-allin-orange text-allin-white'
                  : 'bg-allin-bg-light-2 dark:bg-allin-bg-dark-2 text-allin-dark dark:text-allin-white border border-allin-orange/20'
              }`}
            >
              <div className="whitespace-pre-wrap">
                {renderMessage(message.text)}
              </div>
              <div className="text-[10px] opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {isLoading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-start"
        >
          <div className="bg-allin-bg-light-2 dark:bg-allin-bg-dark-2 text-allin-dark dark:text-allin-white border border-allin-orange/20 p-2 rounded-md">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-allin-orange"></div>
              <span className="text-xs">Agente Allin está digitando...</span>
            </div>
          </div>
        </motion.div>
      )}

      {error && (
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-red-100 border border-red-400 text-red-700 px-2 py-1.5 rounded text-xs"
        >
          {error}
          <button
            onClick={clearError}
            className="ml-2 text-red-600 hover:text-red-800"
          >
            ✕
          </button>
        </motion.div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageArea;