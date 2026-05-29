/**
 * Valida um campo obrigatório
 * @param value Valor a ser validado
 * @returns true se o valor é válido, false caso contrário
 */
export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

/**
 * Valida um email
 * @param email Email a ser validado
 * @returns true se o email é válido, false caso contrário
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida um campo com tamanho mínimo
 * @param value Valor a ser validado
 * @param minLength Tamanho mínimo
 * @returns true se o valor é válido, false caso contrário
 */
export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.trim().length >= minLength;
};

/**
 * Valida um campo com tamanho máximo
 * @param value Valor a ser validado
 * @param maxLength Tamanho máximo
 * @returns true se o valor é válido, false caso contrário
 */
export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return value.trim().length <= maxLength;
};

/**
 * Valida uma senha
 * @param password Senha a ser validada
 * @returns true se a senha é válida, false caso contrário
 */
export const validatePassword = (password: string): boolean => {
  // Deve ter pelo menos 6 caracteres
  return password.length >= 6;
};

/**
 * Valida se duas senhas são iguais
 * @param password Senha
 * @param confirmPassword Confirmação da senha
 * @returns true se as senhas são iguais, false caso contrário
 */
export const validatePasswordMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword;
};