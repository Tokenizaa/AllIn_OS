/**
 * Formata um número de WhatsApp removendo caracteres não numéricos
 * @param whatsapp Número de WhatsApp a ser formatado
 * @returns Número de WhatsApp contendo apenas dígitos
 */
export const formatWhatsApp = (whatsapp: string): string => {
  return whatsapp.replace(/\D/g, '');
};

/**
 * Valida um número de WhatsApp
 * @param whatsapp Número de WhatsApp a ser validado
 * @returns true se o número é válido, false caso contrário
 */
export const validateWhatsApp = (whatsapp: string): boolean => {
  const cleaned = formatWhatsApp(whatsapp);
  return cleaned.length >= 10 && cleaned.length <= 11;
};

/**
 * Formata o nome removendo espaços extras e capitalizando palavras
 * @param name Nome a ser formatado
 * @returns Nome formatado
 */
export const formatName = (name: string): string => {
  return name.trim().replace(/\s+/g, ' ').split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
};

/**
 * Valida um nome
 * @param name Nome a ser validado
 * @returns true se o nome é válido, false caso contrário
 */
export const validateName = (name: string): boolean => {
  return name.trim().length >= 2 && name.trim().length <= 100;
};