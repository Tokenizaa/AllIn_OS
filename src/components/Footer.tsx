import { Heart, Home, ShoppingCart, UserPlus, Store } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useSponsorLink } from "@/hooks/useSponsorLink";
import { useDistributor, DEFAULT_DISTRIBUTOR } from "@/lib/distributor-context";

const Footer = () => {
  const { handleCadastro } = useSponsorLink();
  const { getTotalItems } = useCart();
  const { currentDistributor } = useDistributor();
  const sponsorSlug = currentDistributor.slug;
  const isDefaultTenant = sponsorSlug.toLowerCase() === DEFAULT_DISTRIBUTOR.toLowerCase();

  return (
    <footer className="bg-allin-bg-light-2 dark:bg-allin-bg-dark-2 text-allin-dark dark:text-allin-white py-12 border-t border-allin-orange/20 dark:border-allin-bg-dark-3">
      <div className="container mx-auto px-4">
        {/* Menu Principal */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-12">
          <Link 
            to={isDefaultTenant ? "/" : `/${sponsorSlug}`}
            className="flex flex-col items-center text-allin-dark dark:text-allin-white hover:text-allin-orange transition-all duration-300"
          >
            <Home className="w-6 h-6 mb-1" />
            <span>Início</span>
          </Link>
          
          <button 
            onClick={handleCadastro}
            className="flex flex-col items-center text-allin-dark dark:text-allin-white hover:text-allin-orange transition-all duration-300"
          >
            <UserPlus className="w-6 h-6 mb-1" />
            <span>Seja Distribuidor</span>
          </button>
          
          <Link 
            to={isDefaultTenant ? "/loja" : `/loja/${sponsorSlug}`}
            className="flex flex-col items-center text-allin-dark dark:text-allin-white hover:text-allin-orange transition-all duration-300"
          >
            <Store className="w-6 h-6 mb-1" />
            <span>Loja</span>
          </Link>
          
          <Link 
            to="/carrinho"
            className="flex flex-col items-center text-allin-dark dark:text-allin-white hover:text-allin-orange transition-all duration-300"
          >
            <div className="relative">
              <ShoppingCart className="w-6 h-6 mb-1" />
              <span className="absolute -top-2 -right-2 bg-allin-orange text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {getTotalItems()}
              </span>
            </div>
            <span>Carrinho</span>
          </Link>
        </div>
        
        {/* Informações da Empresa */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-allin-orange rounded-lg flex items-center justify-center">
              <span className="text-allin-dark font-bold text-xl">A</span>
            </div>
            <span className="text-2xl font-bold">All-In</span>
          </div>
          <p className="text-allin-dark/80 dark:text-allin-white/80 max-w-2xl mx-auto">
            Revolucionando o mercado de calçados terapêuticos com tecnologia 
            avançada e oportunidades reais de negócio.
          </p>
        </div>

        {/* Rodapé Inferior */}
        <div className="border-t border-allin-orange/20 pt-8 dark:border-allin-bg-dark-3">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-allin-dark/60 dark:text-allin-white/60 text-sm">
              © 2025 All-in. Todos os direitos reservados.
            </div>
            <div className="flex items-center gap-2 text-allin-dark/60 dark:text-allin-white/60 text-sm">
              <span>Feito com</span>
              <Heart className="w-4 h-4 text-red-400 fill-current" />
              <span>para distribuidores de sucesso</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
