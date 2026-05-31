import { vi } from 'vitest';

// Mock da API fetch globalmente para todos os testes
global.fetch = vi.fn();

// Mock de crypto.randomUUID que é usado em generateId
if (!global.crypto) {
  //@ts-ignore
  global.crypto = { randomUUID: () => Math.random().toString(36).slice(2, 9) };
}