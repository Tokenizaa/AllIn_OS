import React, { useCallback } from 'react';

import { motion, AnimatePresence } from 'framer-motion';

import { useSponsorLink } from '@/hooks/useSponsorLink';
import { AgentActionButton } from '@/types/agent';

// Tipos para os diferentes estados de botões
type ButtonState = 'initial' | 'businessOpportunity' | 'plans' | 'products' | 'register' | 'affiliatePlan' | 'advancePlan' | 'excellencePlan' | 'earnings' | 'testimonials' | 'faq';

interface ActionButtonsProps {
  buttonState: ButtonState;
  setButtonState: (state: ButtonState) => void;
  handleSendMessage: (message?: string | undefined) => void;
  dynamicActionButtons?: AgentActionButton[];
}

const ActionButtons = ({ 
  buttonState, 
  setButtonState, 
  handleSendMessage,
  dynamicActionButtons
}: ActionButtonsProps) => {
  const { handleCadastro } = useSponsorLink();
  const hasDynamicButtons = dynamicActionButtons && dynamicActionButtons.length > 0;

  const handleDynamicButton = useCallback((button: AgentActionButton) => {
    if (button.type === 'link' && button.url) {
      window.open(button.url, '_blank', 'noreferrer');
      return;
    }

    if (button.value) {
      handleSendMessage(button.value);
    }
  }, [handleSendMessage]);
  // Definir estados anteriores para navegação
  const getPreviousState = useCallback((): ButtonState | null => {
    switch (buttonState) {
      case 'businessOpportunity':
        return 'initial';
      case 'plans':
        return 'businessOpportunity';
      case 'products':
        return 'initial';
      case 'affiliatePlan':
      case 'advancePlan':
      case 'excellencePlan':
        return 'plans';
      case 'register':
        return 'affiliatePlan'; // ou o plano atual
      case 'earnings':
        return 'businessOpportunity';
      case 'testimonials':
        return 'businessOpportunity';
      case 'faq':
        return 'businessOpportunity';
      default:
        return null;
    }
  }, [buttonState]);

  // Definir estados relacionados para navegação lateral
  const getRelatedStates = useCallback((): { label: string; state: ButtonState }[] => {
    switch (buttonState) {
      case 'businessOpportunity':
        return [
          { label: 'Produtos', state: 'products' },
          { label: 'Depoimentos', state: 'testimonials' }
        ];
      case 'plans':
        return [
          { label: 'Como Ganhar', state: 'earnings' },
          { label: 'Depoimentos', state: 'testimonials' },
          { label: 'FAQ', state: 'faq' }
        ];
      case 'affiliatePlan':
      case 'advancePlan':
      case 'excellencePlan':
        return [
          { label: 'Como Ganhar', state: 'earnings' }
        ];
      case 'products':
        return [
          { label: 'Planos', state: 'plans' },
          { label: 'Depoimentos', state: 'testimonials' }
        ];
      default:
        return [];
    }
  }, [buttonState]);

  // Renderizar botões de ação com base no estado atual
  const renderActionButtons = useCallback(() => {
    const previousState = getPreviousState();
    const relatedStates = getRelatedStates();

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={buttonState}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {/* Botão de voltar (se houver estado anterior) */}
          {previousState && (
            <div className="mb-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setButtonState(previousState)}
                className="bg-allin-bg-light-2 dark:bg-allin-bg-dark-2 hover:bg-allin-orange/10 text-allin-dark dark:text-allin-white border border-allin-orange/20 hover:border-allin-orange/40 px-2 py-1 rounded text-[11px] transition-all duration-200 flex items-center w-full shadow-sm hover:shadow-md"
              >
                <span className="mr-1">←</span> Voltar
              </motion.button>
            </div>
          )}

          {/* Botões de ação principais */}
          {hasDynamicButtons && typeof dynamicActionButtons !== 'undefined' && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {dynamicActionButtons.map((btn, index) => (
                <motion.button
                  key={`dynamic-${index}-${btn.label}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDynamicButton(btn)}
                  className="bg-allin-orange/10 text-allin-orange border border-allin-orange/30 px-2 py-1 rounded text-[11px] transition-all duration-200 flex-1 min-w-[45%] shadow-sm hover:shadow-md"
                >
                  {btn.label}
                </motion.button>
              ))}
            </div>
          )}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {(() => {
              switch (buttonState) {
                case 'initial':
                  return (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          handleSendMessage("Oportunidade de negócio");
                          setButtonState('businessOpportunity');
                        }}
                        className="bg-allin-bg-light-2 dark:bg-allin-bg-dark-2 hover:bg-allin-orange/10 text-allin-dark dark:text-allin-white border border-allin-orange/20 hover:border-allin-orange/40 px-2 py-1 rounded text-[11px] transition-all duration-200 flex-1 min-w-[45%] shadow-sm hover:shadow-md"
                      >
                        Oportunidade de negócio
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSendMessage("Informações sobre produtos")}
                        className="bg-allin-bg-light-2 dark:bg-allin-bg-dark-2 hover:bg-allin-orange/10 text-allin-dark dark:text-allin-white border border-allin-orange/20 hover:border-allin-orange/40 px-2 py-1 rounded text-[11px] transition-all duration-200 flex-1 min-w-[45%] shadow-sm hover:shadow-md"
                      >
                        Informações sobre produtos
                      </motion.button>
                    </>
                  );
                
                case 'businessOpportunity':
                  return (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          handleSendMessage("Quero conhecer os planos de distribuição");
                          setButtonState('plans');
                        }}
                        className="bg-allin-bg-light-2 dark:bg-allin-bg-dark-2 hover:bg-allin-orange/10 text-allin-dark dark:text-allin-white border border-allin-orange/20 hover:border-allin-orange/40 px-2 py-1 rounded text-[11px] transition-all duration-200 flex-1 min-w-[45%] shadow-sm hover:shadow-md"
                      >
                        Ver Planos
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          handleSendMessage("Como posso ganhar dinheiro com a Allin?");
                          setButtonState('earnings');
                        }}
                        className="bg-allin-bg-light-2 dark:bg-allin-bg-dark-2 hover:bg-allin-orange/10 text-allin-dark dark:text-allin-white border border-allin-orange/20 hover:border-allin-orange/40 px-2 py-1 rounded text-[11px] transition-all duration-200 flex-1 min-w-[45%] shadow-sm hover:shadow-md"
                      >
                        Como Ganhar
                      </motion.button>
                    </>
                  );
                
                case 'plans':
                  return (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          handleSendMessage("Plano Afiliado");
                          setButtonState('affiliatePlan');
                        }}
                        className="bg-allin-bg-light-2 dark:bg-allin-bg-dark-2 hover:bg-allin-orange/10 text-allin-dark dark:text-allin-white border border-allin-orange/20 hover:border-allin-orange/40 px-2 py-1 rounded text-[11px] transition-all duration-200 flex-1 min-w-[30%] shadow-sm hover:shadow-md"
                      >
                        Plano Afiliado
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          handleSendMessage("Plano Avanço");
                          setButtonState('advancePlan');
                        }}
                        className="bg-allin-bg-light-2 dark:bg-allin-bg-dark-2 hover:bg-allin-orange/10 text-allin-dark dark:text-allin-white border border-allin-orange/20 hover:border-allin-orange/40 px-2 py-1 rounded text-[11px] transition-all duration-200 flex-1 min-w-[30%] shadow-sm hover:shadow-md"
                      >
                        Plano Avanço
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          handleSendMessage("Plano Excelência");
                          setButtonState('excellencePlan');
                        }}
                        className="bg-allin-bg-light-2 dark:bg-allin-bg-dark-2 hover:bg-allin-orange/10 text-allin-dark dark:text-allin-white border border-allin-orange/20 hover:border-allin-orange/40 px-2 py-1 rounded text-[11px] transition-all duration-200 flex-1 min-w-[30%] shadow-sm hover:shadow-md"
                      >
                        Plano Excelência
                      </motion.button>
                    </>
                  );
                
                case 'affiliatePlan':
                  return (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          handleSendMessage("Quero me cadastrar no Plano Afiliado");
                          setButtonState('register');
                        }}
                        className="bg-allin-bg-light-2 dark:bg-allin-bg-dark-2 hover:bg-allin-orange/10 text-allin-dark dark:text-allin-white border border-allin-orange/20 hover:border-allin-orange/40 px-2 py-1 rounded text-[11px] transition-all duration-200 flex-1 min-w-[45%] shadow-sm hover:shadow-md"
                      >
                        Quero Me Cadastrar
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          handleSendMessage("Ver outros planos");
                          setButtonState('plans');
                        }}
                        className="bg-allin-bg-light-2 dark:bg-allin-bg-dark-2 hover:bg-allin-orange/10 text-allin-dark dark:text-allin-white border border-allin-orange/20 hover:border-allin-orange/40 px-2 py-1 rounded text-[11px] transition-all duration-200 flex-1 min-w-[45%] shadow-sm hover:shadow-md"
                      >
                        Outros Planos
                      </motion.button>
                    </>
                  );
                
                case 'advancePlan':
                  return (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          handleSendMessage("Quero me cadastrar no Plano Avanço");
                          setButtonState('register');
                        }}
                        className="bg-allin-bg-light-2 dark:bg-allin-bg-dark-2 hover:bg-allin-orange/10 text-allin-dark dark:text-allin-white border border-allin-orange/20 hover:border-allin-orange/40 px-2 py-1 rounded text-[11px] transition-all duration-200 flex-1 min-w-[45%] shadow-sm hover:shadow-md"
                      >
                        Quero Me Cadastrar
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          handleSendMessage("Ver outros planos");
                          setButtonState('plans');
                        }}
                        className="bg-allin-bg-light-2 dark:bg-allin-bg-dark-2 hover:bg-allin-orange/10 text-allin-dark dark:text-allin-white border border-allin-orange/20 hover:border-allin-orange/40 px-2 py-1 rounded text-[11px] transition-all duration-200 flex-1 min-w-[45%] shadow-sm hover:shadow-md"
                      >
                        Outros Planos
                      </motion.button>
                    </>
                  );
                
                case 'excellencePlan':
                  return (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          handleSendMessage("Quero me cadastrar no Plano Excelência");
                          setButtonState('register');
                        }}
                        className="bg-allin-bg-light-2 dark:bg-allin-bg-dark-2 hover:bg-allin-orange/10 text-allin-dark dark:text-allin-white border border-allin-orange/20 hover:border-allin-orange/40 px-2 py-1 rounded text-[11px] transition-all duration-200 flex-1 min-w-[45%] shadow-sm hover:shadow-md"
                      >
                        Quero Me Cadastrar
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          handleSendMessage("Ver outros planos");
                          setButtonState('plans');
                        }}
                        className="bg-allin-bg-light-2 dark:bg-allin-bg-dark-2 hover:bg-allin-orange/10 text-allin-dark dark:text-allin-white border border-allin-orange/20 hover:border-allin-orange/40 px-2 py-1 rounded text-[11px] transition-all duration-200 flex-1 min-w-[45%] shadow-sm hover:shadow-md"
                      >
                        Outros Planos
                      </motion.button>
                    </>
                  );
                
                case 'products':
                  return (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          handleSendMessage("Quero conhecer os produtos");
                        }}
                        className="bg-allin-bg-light-2 dark:bg-allin-bg-dark-2 hover:bg-allin-orange/10 text-allin-dark dark:text-allin-white border border-allin-orange/20 hover:border-allin-orange/40 px-2 py-1 rounded text-[11px] transition-all duration-200 flex-1 min-w-[45%] shadow-sm hover:shadow-md"
                      >
                        Ver Produtos
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          handleSendMessage("Tecnologias dos produtos");
                        }}
                        className="bg-allin-bg-light-2 dark:bg-allin-bg-dark-2 hover:bg-allin-orange/10 text-allin-dark dark:text-allin-white border border-allin-orange/20 hover:border-allin-orange/40 px-2 py-1 rounded text-[11px] transition-all duration-200 flex-1 min-w-[45%] shadow-sm hover:shadow-md"
                      >
                        Tecnologias
                      </motion.button>
                    </>
                  );
                
                case 'register':
                  return (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          handleSendMessage("Como faço para me cadastrar?");
                        }}
                        className="bg-allin-bg-light-2 dark:bg-allin-bg-dark-2 hover:bg-allin-orange/10 text-allin-dark dark:text-allin-white border border-allin-orange/20 hover:border-allin-orange/40 px-2 py-1 rounded text-[11px] transition-all duration-200 flex-1 min-w-[45%] shadow-sm hover:shadow-md"
                      >
                        Como Cadastrar
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          handleSendMessage("Preciso de ajuda para me cadastrar");
                        }}
                        className="bg-allin-bg-light-2 dark:bg-allin-bg-dark-2 hover:bg-allin-orange/10 text-allin-dark dark:text-allin-white border border-allin-orange/20 hover:border-allin-orange/40 px-2 py-1 rounded text-[11px] transition-all duration-200 flex-1 min-w-[45%] shadow-sm hover:shadow-md"
                      >
                        Ajuda com Cadastro
                      </motion.button>
                    </>
                  );
                
                case 'earnings':
                  return (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          handleSendMessage("Quanto posso ganhar com o Plano Afiliado?");
                          setButtonState('affiliatePlan');
                        }}
                        className="bg-allin-bg-light-2 dark:bg-allin-bg-dark-2 hover:bg-allin-orange/10 text-allin-dark dark:text-allin-white border border-allin-orange/20 hover:border-allin-orange/40 px-2 py-1 rounded text-[11px] transition-all duration-200 flex-1 min-w-[45%] shadow-sm hover:shadow-md"
                      >
                        Ganho Plano Afiliado
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          handleSendMessage("Quanto posso ganhar com os planos pagos?");
                          setButtonState('plans');
                        }}
                        className="bg-allin-bg-light-2 dark:bg-allin-bg-dark-2 hover:bg-allin-orange/10 text-allin-dark dark:text-allin-white border border-allin-orange/20 hover:border-allin-orange/40 px-2 py-1 rounded text-[11px] transition-all duration-200 flex-1 min-w-[45%] shadow-sm hover:shadow-md"
                      >
                        Ganho Planos Pagos
                      </motion.button>
                    </>
                  );
                
                case 'testimonials':
                  return (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          handleSendMessage("Quero ver depoimentos de distribuidores");
                        }}
                        className="bg-allin-bg-light-2 dark:bg-allin-bg-dark-2 hover:bg-allin-orange/10 text-allin-dark dark:text-allin-white border border-allin-orange/20 hover:border-allin-orange/40 px-2 py-1 rounded text-[11px] transition-all duration-200 flex-1 min-w-[45%] shadow-sm hover:shadow-md"
                      >
                        Ver Depoimentos
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          handleSendMessage("Histórias de sucesso");
                        }}
                        className="bg-allin-bg-light-2 dark:bg-allin-bg-dark-2 hover:bg-allin-orange/10 text-allin-dark dark:text-allin-white border border-allin-orange/20 hover:border-allin-orange/40 px-2 py-1 rounded text-[11px] transition-all duration-200 flex-1 min-w-[45%] shadow-sm hover:shadow-md"
                      >
                        Histórias de Sucesso
                      </motion.button>
                    </>
                  );
                
                case 'faq':
                  return (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          handleSendMessage("Perguntas frequentes sobre planos");
                          setButtonState('plans');
                        }}
                        className="bg-allin-bg-light-2 dark:bg-allin-bg-dark-2 hover:bg-allin-orange/10 text-allin-dark dark:text-allin-white border border-allin-orange/20 hover:border-allin-orange/40 px-2 py-1 rounded text-[11px] transition-all duration-200 flex-1 min-w-[45%] shadow-sm hover:shadow-md"
                      >
                        Perguntas Planos
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          handleSendMessage("Perguntas frequentes sobre produtos");
                          setButtonState('products');
                        }}
                        className="bg-allin-bg-light-2 dark:bg-allin-bg-dark-2 hover:bg-allin-orange/10 text-allin-dark dark:text-allin-white border border-allin-orange/20 hover:border-allin-orange/40 px-2 py-1 rounded text-[11px] transition-all duration-200 flex-1 min-w-[45%] shadow-sm hover:shadow-md"
                      >
                        Perguntas Produtos
                      </motion.button>
                    </>
                  );
                
                default:
                  return (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSendMessage("Oportunidade de negócio")}
                        className="bg-allin-bg-light-2 dark:bg-allin-bg-dark-2 hover:bg-allin-orange/10 text-allin-dark dark:text-allin-white border border-allin-orange/20 hover:border-allin-orange/40 px-2 py-1 rounded text-[11px] transition-all duration-200 flex-1 min-w-[45%] shadow-sm hover:shadow-md"
                      >
                        Oportunidade de negócio
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSendMessage("Informações sobre produtos")}
                        className="bg-allin-bg-light-2 dark:bg-allin-bg-dark-2 hover:bg-allin-orange/10 text-allin-dark dark:text-allin-white border border-allin-orange/20 hover:border-allin-orange/40 px-2 py-1 rounded text-[11px] transition-all duration-200 flex-1 min-w-[45%] shadow-sm hover:shadow-md"
                      >
                        Informações sobre produtos
                      </motion.button>
                    </>
                  );
              }
            })()}
          </div>

          {/* Botões relacionados */}
          {relatedStates.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {relatedStates.map((related, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    // Para tecnologias, enviar mensagem específica
                    if (related.label === 'Tecnologias') {
                      handleSendMessage("Tecnologias dos produtos");
                    } else {
                      setButtonState(related.state);
                    }
                  }}
                  className="bg-allin-bg-light-2 dark:bg-allin-bg-dark-2 hover:bg-allin-orange/10 text-allin-dark dark:text-allin-white border border-allin-orange/20 hover:border-allin-orange/40 px-2 py-1 rounded text-[11px] transition-all duration-200 flex-1 min-w-[30%] shadow-sm hover:shadow-md"
                >
                  {related.label}
                </motion.button>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    );
  }, [buttonState, getPreviousState, getRelatedStates, handleSendMessage]);

  return (
    <div className="flex flex-col space-y-2 p-2 bg-white border-t border-gray-100">
      {renderActionButtons()}
      
      {/* Botões fixos na parte inferior */}
      <div className="flex flex-wrap gap-2">
        <a
          href="https://wa.me/SEU_NUMERO"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-[11px] font-medium text-center transition-all duration-200 flex-1 min-w-[30%] shadow-sm hover:shadow-md"
        >
          WHATSAPP
        </a>
        <button
          onClick={() => {
            const productsSection = document.getElementById('produtos');
            if (productsSection) {
              productsSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-[11px] font-medium text-center transition-all duration-200 flex-1 min-w-[30%] shadow-sm hover:shadow-md"
        >
          VER PRODUTOS
        </button>
      </div>
    </div>
  );
};

export default ActionButtons;
