/**
 * Formata uma data para o formato brasileiro (dd/mm/yyyy)
 * @param date Data a ser formatada
 * @returns Data formatada como string
 */
export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('pt-BR');
};

/**
 * Formata uma data com hora para o formato brasileiro (dd/mm/yyyy HH:MM)
 * @param date Data a ser formatada
 * @returns Data e hora formatadas como string
 */
export const formatDateTime = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleString('pt-BR');
};

/**
 * Verifica se uma data é hoje
 * @param date Data a ser verificada
 * @returns true se a data é hoje, false caso contrário
 */
export const isToday = (date: Date | string): boolean => {
  const today = new Date();
  const d = new Date(date);
  return d.toDateString() === today.toDateString();
};

/**
 * Calcula a diferença em dias entre duas datas
 * @param date1 Primeira data
 * @param date2 Segunda data
 * @returns Diferença em dias
 */
export const daysDifference = (date1: Date | string, date2: Date | string): number => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};