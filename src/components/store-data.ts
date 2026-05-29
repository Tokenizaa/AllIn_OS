export interface Review {
    id: number;
    name: string;
    rating: number;
    comment: string;
    avatar?: string;
}

// Interface base para informações da loja
// Esta interface será expandida no arquivo de tipos/store.ts para lojas personalizadas
export interface StoreInfo {
    name: string;
    category: string;
    city: string;
    description: string;
    logo: string;
    // Alterando de uma única imagem para um array de banners
    banners: string[];
    rating: number;
    reviewCount: number;
    specialties: string[];
    contact: {
        whatsapp: string;
        instagram: string;
        email: string;
        address: string;
    };
    sponsorLink?: string;
}

export const storeInfoData: StoreInfo = {
    name: 'All In Brasil',
    category: 'Calçados Tecnológicos',
    city: 'São Paulo - SP',
    description: 'Somos especialistas em calçados tecnológicos com tecnologias exclusivas de magnetoterapia e infravermelho longo. Nossa missão é proporcionar conforto, saúde e bem-estar através de produtos inovadores que fazem a diferença na vida das pessoas.',
    logo: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=150&h=150&fit=crop&crop=center',
    // Substituindo o banner único por um array de 3 banners representativos
    banners: [
        // Casal de idosos caminhando felizes num parque
        'https://opengraph-minai.vercel.app/api/og?title=Casal+de+Idosos+Caminhando+no+Parque&subtitle=Experimentando+Conforto+e+Bem-estar+com+All+In+Brasil&image=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1516321318423-f06f85e504b3%3Fw%3D1200%26h%3D400%26fit%3Dcrop%26crop%3Dcenter&overlayOpacity=0.3&theme=light',
        
        // Pessoa no trabalho com sensação de bem-estar usando nosso tênis
        'https://opengraph-minai.vercel.app/api/og?title=Conforto+no+Trabalho&subtitle=Bem-estar+Durante+a+Jornada+com+All+In+Brasil&image=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1517245386807-bb43f82c33c4%3Fw%3D1200%26h%3D400%26fit%3Dcrop%26crop%3Dcenter&overlayOpacity=0.3&theme=light',
        
        // Pessoa praticando atividade física com sensação de bem-estar
        'https://opengraph-minai.vercel.app/api/og?title=Atividade+Física+com+Bem-estar&subtitle=Praticando+Exercícios+Leves+com+All+In+Brasil&image=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1534438327276-14e5300c3a48%3Fw%3D1200%26h%3D400%26fit%3Dcrop%26crop%3Dcenter&overlayOpacity=0.3&theme=light'
    ],
    rating: 4.8,
    reviewCount: 1247,
    specialties: [
        'Entrega Rápida',
        'Produtos Sustentáveis',
        'Tecnologia Exclusiva',
        'Garantia de Qualidade'
    ],
    contact: {
        whatsapp: '+5511999999999',
        instagram: '@allinbrasil',
        email: 'contato@allinbrasil.com.br',
        address: 'São Paulo, SP - Brasil'
    }
};

export const reviewsData: Review[] = [
    { id: 1, name: 'Maria Silva', rating: 5, comment: 'Produtos de excelente qualidade! Senti a diferença no conforto e na redução das dores nos pés desde o primeiro uso.', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c9a?w=40&h=40&fit=crop&crop=face' },
    { id: 2, name: 'João Santos', rating: 5, comment: 'Entrega super rápida e atendimento excepcional. Recomendo para quem busca conforto e tecnologia.', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face' },
    { id: 3, name: 'Ana Costa', rating: 4, comment: 'Produtos inovadores que realmente funcionam. A tecnologia terapêutica faz toda a diferença.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face' }
];

// Embora não usado diretamente no LojaPage.tsx após a refatoração, manter a interface pode ser útil.
export interface Category {
    id: number;
    name: string;
    image: string;
    productCount: number;
}