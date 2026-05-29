import React from 'react';

import { useParams } from 'react-router-dom';


import Footer from '@/components/Footer';
import ReviewsAndContact from '@/components/ReviewsAndContact';
import StoreHeroSection from '@/components/sections/StoreHeroSection';
import { storeInfoData, reviewsData, StoreInfo, Review } from '@/components/store-data';
import StoreCategories from '@/components/StoreCategories';
import ProductGallery from '@/components/features/products/ProductGallery';
import { StyleProvider } from '@/contexts/StyleContext';
import { useToast } from '@/hooks/use-toast';
import { useProductsFromCSV } from '@/hooks/useProductsFromCSV';
import { storeManagementService } from '@/services/storeManagementService';

// Components

// Contexts

const LojaPage = () => {
  const { toast } = useToast();
  const { products, loading, error } = useProductsFromCSV();
  
  // Obter o slug da URL
  const { storeSlug } = useParams<{ storeSlug: string }>();
  
  // Estado para armazenar as informações da loja
  const [storeInfo, setStoreInfo] = React.useState<StoreInfo>(storeInfoData);
  const [reviews] = React.useState<Review[]>(reviewsData);
  const [isLoadingStore, setIsLoadingStore] = React.useState(true);

  // Carregar informações da loja com base no slug
  React.useEffect(() => {
    const loadStoreInfo = async () => {
      if (storeSlug) {
        try {
          setIsLoadingStore(true);
          const storeData = await storeManagementService.getStoreBySlug(storeSlug);
          if (storeData) {
            setStoreInfo(storeData);
          } else {
            // Se não encontrar a loja, usar os dados padrão
            console.warn(`Loja com slug ${storeSlug} não encontrada, usando dados padrão`);
          }
        } catch (err) {
          console.error('Erro ao carregar informações da loja:', err);
          toast({
            title: "Erro",
            description: "Não foi possível carregar as informações da loja.",
            variant: "destructive"
          });
        } finally {
          setIsLoadingStore(false);
        }
      } else {
        // Se não houver slug, usar os dados padrão
        setIsLoadingStore(false);
      }
    };

    loadStoreInfo();
  }, [storeSlug, toast]);

  // Recriar a lógica de categorização inteligente a partir da lista de produtos
  const getSmartCategories = () => {
    if (!products || products.length === 0) return [];
    const categoryMap = new Map<string, number>();
    products.forEach(product => {
      const categoryName = product.categorias; // Usa a coluna 'categorias' do CSV
      if (categoryName) {
        categoryMap.set(categoryName, (categoryMap.get(categoryName) || 0) + 1);
      }
    });
    return Array.from(categoryMap.entries()).map(([name, count], index) => ({
      id: index + 1,
      name,
      productCount: count,
    }));
  };

  const smartCategories = getSmartCategories();

  const handleWhatsAppContact = () => {
    window.open(`https://wa.me/${storeInfo.contact.whatsapp.replace(/\D/g, '')}`, '_blank');
    toast({
      title: "Redirecionando...",
      description: "Abrindo WhatsApp para contato."
    });
  };

  const handleInstagramContact = () => {
    if (storeInfo.contact.instagram) {
      window.open(`https://instagram.com/${storeInfo.contact.instagram.replace('@', '')}`, '_blank');
      toast({
        title: "Redirecionando...",
        description: "Abrindo Instagram da loja."
      });
    }
  };

  const handleScrollToProducts = () => {
    const productsSection = document.getElementById('produtos-destaque');
    productsSection?.scrollIntoView({ behavior: 'smooth' });
  };

  // Exibir mensagem de erro se houver problema com o carregamento dos produtos
  React.useEffect(() => {
    if (error) {
      console.error('Erro ao carregar produtos:', error);
      toast({
        title: "Erro ao carregar produtos",
        description: "Estamos trabalhando para resolver o problema. Por favor, tente novamente mais tarde.",
        variant: "destructive"
      });
    }
  }, [error, toast]);

  // Mostrar loading enquanto carrega as informações da loja
  if (isLoadingStore) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-allin-orange"></div>
      </div>
    );
  }

  return (
    <StyleProvider>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">
          {/* Seção Hero da Loja */}
          <StoreHeroSection 
            storeInfo={storeInfo} 
            onWhatsAppClick={handleWhatsAppContact}
            onProductsClick={handleScrollToProducts}
          />
          
          {/* Categorias de Produtos */}
          <StoreCategories
            loading={loading}
            categories={smartCategories}
            products={products}
            hidden={false}
          />
          
          {/* Produtos em Destaque */}
          <section id="produtos-destaque" className="py-16 bg-white dark:bg-allin-bg-dark-1">
            <div className="container mx-auto px-4 max-w-7xl">
              <ProductGallery />
            </div>
          </section>
          
          {/* Avaliações e Contato */}
          <ReviewsAndContact
            reviews={reviews}
            storeInfo={storeInfo}
            onWhatsAppClick={handleWhatsAppContact}
            onInstagramClick={handleInstagramContact}
          />
        </main>
        <Footer />

        {/* Botão Flutuante do WhatsApp */}
        <a 
          href={`https://wa.me/${storeInfo.contact.whatsapp.replace(/\D/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#128C7E] flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
          aria-label="Fale conosco pelo WhatsApp"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.966-.273-.099-.471-.148-.67.15-.197.297-.767.963-.94 1.16-.173.199-.347.221-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.795-1.484-1.784-1.66-2.087-.173-.297-.018-.458.13-.605.136-.135.298-.354.446-.471.149-.148.198-.248.298-.413.099-.167.05-.31-.025-.434-.075-.124-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.508a.704.703 0 0 0-.509.174l-.38.383c-.13.124-.347.36-.347.869s.347.99.396 1.06c.05.061.72 1.088 1.746 1.726 1.015.628 1.115.525 1.23.486.114-.04.695-.286.793-.888.099-.603.099-1.121.149-1.145s.183-.04.297-.025c.114.016.741.105 1.737.893.47.372.815.85 1.002 1.362.198.54.19 1.09.14 1.34-.05.25-.298.4-.546.606-.173.136-.372.283-.521.424-.173.157-.361.161-.669.05-.297-.112-1.265-.463-2.04-1.524-.694-.94-1.164-2.01-1.294-2.35-.13-.34-.015-.524.09-.692.096-.157.223-.37.33-.504.1-.136.149-.224.223-.36.05-.136.025-.255-.013-.355-.04-.099-.367-.9-.503-1.235-.13-.32-.26-.278-.367-.278h-.313c-.099 0-.272.04-.417.186-.148.15-.559.548-.559 1.335 0 .785.57 1.549.64 1.649.074.1.992 1.573 2.45 2.163.694.302 1.236.48 1.658.613.694.223 1.33.193 1.83.117.57-.09 1.757-.721 2.004-1.426.248-.704.248-1.307.173-1.43-.074-.124-.273-.198-.57-.347m-5.446 7.443h-.016a7.455 7.455 0 0 1-3.73-1.001l-.268-.16-2.71.711.724-2.64-.17-.268a7.44 7.44 0 0 1-1.14-3.965c0-4.12 3.36-7.48 7.492-7.48 2.008 0 3.89.78 5.303 2.196 1.415 1.418 2.192 3.305 2.192 5.296-.008 4.128-3.368 7.488-7.497 7.488m4.498-18.825h-8.994c-5.25 0-9.506 4.275-9.506 9.526 0 1.708.45 3.37 1.304 4.823l-1.368 4.99 5.118-1.346a9.48 9.48 0 0 0 4.86 1.328h.006c5.25 0 9.526-4.274 9.526-9.526 0-5.251-4.275-9.526-9.526-9.526"/>
          </svg>
        </a>
      </div>
    </StyleProvider>
  );
};

export default LojaPage;