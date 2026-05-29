import { Home, ShoppingCart, UserPlus, Store } from "lucide-react";
import { useTheme } from "next-themes";
import { useNavigate } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useSponsorLink } from "@/hooks/useSponsorLink";
import { cn } from "@/lib/utils";

const MobileBottomNav = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { setIsOpen } = useCart();
  const { handleCadastro } = useSponsorLink();

  const navItems = [
    { 
      icon: Home, 
      label: 'Início', 
      onClick: () => navigate('/')
    },
    { 
      icon: UserPlus, 
      label: 'Seja Distribuidor', 
      onClick: () => navigate('/distribuidores')
    },
    { 
      icon: Store, 
      label: 'Loja', 
      onClick: () => navigate('/loja')
    },
    { 
      icon: ShoppingCart, 
      label: 'Carrinho', 
      onClick: () => {
        console.log('Abrindo carrinho pelo menu móvel...');
        setIsOpen(true);
      }
    },
  ];

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-50 md:hidden",
      "bg-allin-bg-light-1 dark:bg-allin-bg-dark-1 border-t border-allin-orange/20 dark:border-allin-bg-dark-3",
      "shadow-[0_-2px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_-2px_10px_rgba(0,0,0,0.3)]"
    )}>
      <div className="flex justify-around items-center h-16">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Button
              key={index}
              variant="ghost"
              className="flex flex-col items-center justify-center h-full w-full rounded-none"
              onClick={item.onClick}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;
