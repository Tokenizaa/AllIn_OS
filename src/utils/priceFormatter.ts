/**
 * Formata uma string de preço para o formato de moeda brasileira (BRL).
 * Lida com vários formatos de entrada, como "R$ 1.999,90", "1999.90", "99,90".
 * @param price A string de preço a ser formatada.
 * @returns Uma string com o preço formatado (ex: "R$ 1.999,90") ou nulo se o preço for inválido.
 */
export const formatPrice = (price: string | undefined | null): string | null => {
  // Se o preço for indefinido, nulo ou uma string vazia, retorna nulo para acionar o fallback.
  if (!price) {
    return null;
  }

  // 1. Limpa a string para manter apenas caracteres relevantes para preço (dígitos, ponto, vírgula).
  // Isso remove "R$", "*", etc., mas mantém o número. Ex: "R$ 59,90" -> "59,90"
  const priceString = String(price).replace(/[^\d,.]/g, '');

  // 2. Normaliza o número de forma inteligente para lidar com os padrões brasileiro (1.000,00) e americano (1,000.00).
  const lastCommaIndex = priceString.lastIndexOf(',');
  const lastDotIndex = priceString.lastIndexOf('.');

  let sanitizedPriceString: string;

  if (lastCommaIndex > lastDotIndex) {
    // Padrão brasileiro: a vírgula é o separador decimal. Removemos os pontos e trocamos a vírgula.
    sanitizedPriceString = priceString.replace(/\./g, '').replace(',', '.');
  } else {
    // Padrão americano ou sem separador de milhar: o ponto é o decimal. Apenas removemos as vírgulas.
    sanitizedPriceString = priceString.replace(/,/g, '');
  }

  // 3. Converte para número.
  const numericPrice = parseFloat(sanitizedPriceString);

  // 4. Se o valor não for um número válido ou for zero/negativo, retorna nulo.
  if (isNaN(numericPrice) || numericPrice <= 0) {
    return null;
  }

  // 5. Formata como moeda brasileira.
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(numericPrice);
};

/**
 * Formata um valor numérico para moeda brasileira (BRL).
 * @param value O valor numérico a ser formatado.
 * @returns Uma string com o valor formatado (ex: "R$ 1.999,90").
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

/**
 * Converte uma string de preço formatada para número.
 * @param price A string de preço a ser convertida.
 * @returns O valor numérico do preço ou null se inválido.
 */
export const parsePrice = (price: string | undefined | null): number | null => {
  if (!price) {
    return null;
  }

  // Limpa a string para manter apenas caracteres relevantes para preço
  const priceString = String(price).replace(/[^\d,.]/g, '');

  // Normaliza o número de forma inteligente
  const lastCommaIndex = priceString.lastIndexOf(',');
  const lastDotIndex = priceString.lastIndexOf('.');

  let sanitizedPriceString: string;

  if (lastCommaIndex > lastDotIndex) {
    // Padrão brasileiro: a vírgula é o separador decimal
    sanitizedPriceString = priceString.replace(/\./g, '').replace(',', '.');
  } else {
    // Padrão americano ou sem separador de milhar: o ponto é o decimal
    sanitizedPriceString = priceString.replace(/,/g, '');
  }

  const numericPrice = parseFloat(sanitizedPriceString);

  return isNaN(numericPrice) || numericPrice <= 0 ? null : numericPrice;
};
