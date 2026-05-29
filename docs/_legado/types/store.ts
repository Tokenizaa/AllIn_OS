// src/types/store.ts
import { StoreInfo as BaseStoreInfo } from '@/components/store-data';

// Extensão da interface StoreInfo para suportar lojas personalizadas
export interface StoreInfo extends BaseStoreInfo {
  id: string;
  slug: string;
  primaryColor?: string;
  secondaryColor?: string;
  customMessage?: string;
  sponsorLink?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Tipo para o formulário de criação de lojas
export interface StoreFormData {
  name: string;
  slug: string;
  category: string;
  city: string;
  description: string;
  rating: number;
  reviewCount: number;
  specialties: string[];
  contact: {
    whatsapp: string;
    instagram: string;
    email: string;
    address: string;
  };
  primaryColor?: string;
  secondaryColor?: string;
  customMessage?: string;
  sponsorLink?: string;
}