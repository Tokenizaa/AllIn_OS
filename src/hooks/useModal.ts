import { useState, useEffect } from 'react';

/**
 * Hook personalizado para gerenciar estado e animações de modais
 * @param isOpen - Estado inicial do modal (aberto/fechado)
 * @returns Objeto com estados e funções para controlar o modal
 */
export const useModal = (isOpen: boolean = false) => {
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  const close = (callback?: () => void) => {
    setVisible(false);
    setTimeout(() => {
      callback?.();
    }, 300);
  };

  return {
    isVisible: visible,
    close
  };
};
