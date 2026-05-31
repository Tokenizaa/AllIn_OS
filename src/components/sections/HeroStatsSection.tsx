import { useState, useEffect, useMemo } from "react";

import { Star, Loader2 } from "lucide-react";

import { productsData } from '@/utils/productsData';

const HeroStatsSection = () => {
  const [productImage, setProductImage] = useState<string>("");
  const [productName, setProductName] = useState<string>("Tênis terapêutico All-In");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Memoizar produtos filtrados para evitar recálculo desnecessário
  const filteredProducts = useMemo(() => {
    return productsData.filter(product => {
      const caption = product.caption?.toLowerCase() || "";
      return caption.includes("tênis") || 
             caption.includes("tenis") || 
             caption.includes("classic") || 
             caption.includes("sport") || 
             caption.includes("casual") ||
             caption.includes("bumper");
    });
  }, []);

  useEffect(() => {
    // Função para selecionar uma imagem aleatória dos produtos locais
    const loadRandomProduct = async () => {
      try {
        setLoading(true);
        
        if (filteredProducts.length === 0) {
          throw new Error("Nenhum tênis encontrado nos dados locais");
        }
        
        // Selecionar um produto aleatório
        const randomIndex = Math.floor(Math.random() * filteredProducts.length);
        const selectedProduct = filteredProducts[randomIndex];
        
        // Definir a imagem e o nome do produto
        if (selectedProduct.imgSrc) {
          setProductImage(selectedProduct.imgSrc);
          setProductName(selectedProduct.caption);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Erro ao carregar imagem aleatória:', err);
        setError('Falha ao carregar imagem aleatória.');
        setLoading(false);
      }
    };

    loadRandomProduct();
  }, []); // Executa apenas uma vez ao montar o componente
  return (
    <section className="py-20 bg-allin-bg-light-3 dark:bg-allin-bg-dark-3">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Product Image */}
          <div className="relative animate-fade-in">
            <div className="relative">
              {loading ? (
                <div className="w-full max-w-lg mx-auto h-[400px] flex items-center justify-center bg-allin-bg-light-2 dark:bg-allin-bg-dark-2 rounded-lg glass-card animate-pulse">
                  <Loader2 className="w-12 h-12 text-allin-orange animate-spin" />
                </div>
              ) : error ? (
                <div className="w-full max-w-lg mx-auto h-[400px] flex items-center justify-center bg-allin-bg-light-2 dark:bg-allin-bg-dark-2 rounded-lg glass-card">
                  <p className="text-center text-allin-dark/80 dark:text-allin-white/80">{error}.</p>
                </div>
              ) : (
                <img 
                  src={productImage} 
                  alt={productName} 
                  className="w-full max-w-lg mx-auto h-[400px] object-contain animate-float shadow-xl rounded-lg glass-card"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://placehold.co/400x400?text=Imagem+Indisponível';
                  }}
                />
              )}
              <div className="absolute -top-4 -right-4 bg-allin-orange rounded-full p-4 shadow-2xl glass-card">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-allin-white fill-current" />
                  <span className="text-sm font-semibold text-allin-white">4.9/5.</span>
                </div>
              </div>
            </div>

            {/* Features Floating Cards */}
            <div className="absolute -left-8 top-1/2 glass-card border-allin-orange/20 p-4 shadow-xl animate-float max-w-xs">
              <div className="text-sm font-semibold text-allin-orange">Magnetoterapia.</div>
              <div className="text-xs text-allin-dark/80 dark:text-allin-white/80">Alívio de dores e melhor circulação.</div>
            </div>
            
            <div className="absolute -right-8 bottom-1/4 glass-card border-allin-orange/20 p-4 shadow-xl animate-float max-w-xs" style={{animationDelay: '1s'}}>
              <div className="text-sm font-semibold text-allin-orange">Infravermelho longo.</div>
              <div className="text-xs text-allin-dark/80 dark:text-allin-white/80">Aceleração da recuperação muscular.</div>
            </div>
          </div>

          {/* Right - Stats */}
          <div className="space-y-8 animate-fade-in" style={{animationDelay: '0.3s'}}>
            <h2 className="text-3xl md:text-4xl font-bold text-allin-dark dark:text-allin-white">
              Números que <span className="text-allin-orange">impressionam</span>.
            </h2>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center glass-card p-6 rounded-xl hover:scale-105 transition-transform">
                <div className="text-4xl font-bold text-allin-orange mb-2">3</div>
                <div className="text-sm text-allin-dark/80 dark:text-allin-white/80">Níveis de comissão.</div>
              </div>
              <div className="text-center glass-card p-6 rounded-xl hover:scale-105 transition-transform">
                <div className="text-4xl font-bold text-allin-orange mb-2">+500</div>
                <div className="text-sm text-allin-dark/80 dark:text-allin-white/80">Distribuidores ativos.</div>
              </div>
              <div className="text-center glass-card p-6 rounded-xl hover:scale-105 transition-transform">
                <div className="text-4xl font-bold text-allin-orange mb-2">95%</div>
                <div className="text-sm text-allin-dark/80 dark:text-allin-white/80">Taxa de satisfação.</div>
              </div>
              <div className="text-center glass-card p-6 rounded-xl hover:scale-105 transition-transform">
                <div className="text-4xl font-bold text-allin-orange mb-2">89%</div>
                <div className="text-sm text-allin-dark/80 dark:text-allin-white/80">Taxa de recompra.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroStatsSection;
