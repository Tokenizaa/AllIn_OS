export interface StoreInfo {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  city: string;
  rating: number;
  reviewCount: number;
  logo?: string;
  banner?: string;
  contact: {
    whatsapp: string;
    instagram: string;
    email: string;
    address: string;
  };
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
  settings?: {
    primaryColor?: string;
    secondaryColor?: string;
    customDomain?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  avatar?: string;
  date: string;
}

export const storeInfoData: StoreInfo = {
  id: 'default',
  name: 'All In Brasil',
  slug: 'allin-brasil',
  description: 'Calçados terapêuticos com tecnologia avançada para melhorar sua qualidade de vida.',
  category: 'Calçados Terapêuticos',
  city: 'São Paulo',
  rating: 4.8,
  reviewCount: 1250,
  contact: {
    whatsapp: '5511999999999',
    instagram: 'allinbrasil',
    email: 'contato@allinbrasil.com.br',
    address: 'Av. Paulista, 1000 - São Paulo, SP'
  },
  socialMedia: {
    facebook: 'allinbrasil',
    instagram: 'allinbrasil'
  },
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
};

export const reviewsData: Review[] = [
  {
    id: '1',
    name: 'Maria Silva',
    rating: 5,
    comment: 'Ótimos produtos! Meus pés nunca estiveram tão confortáveis.',
    avatar: 'https://i.pravatar.cc/150?u=maria',
    date: '2024-01-15'
  },
  {
    id: '2',
    name: 'João Santos',
    rating: 5,
    comment: 'Entrega rápida e qualidade excepcional. Recomendo!',
    avatar: 'https://i.pravatar.cc/150?u=joao',
    date: '2024-01-10'
  },
  {
    id: '3',
    name: 'Ana Costa',
    rating: 4,
    comment: 'Muito bom, o atendimento foi excelente.',
    avatar: 'https://i.pravatar.cc/150?u=ana',
    date: '2024-01-05'
  }
];
