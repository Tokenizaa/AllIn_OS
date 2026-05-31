import { Home, ShoppingCart, UserPlus, Store } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useSponsorLink } from "@/hooks/useSponsorLink";
import { useDistributor } from "@/lib/distributor-context";
import { cn } from "@/lib/utils";

const MobileBottomNav = () => {
  const { setIsOpen } = useCart();
  const { handleCadastro } = useSponsorLink();
  const { currentDistributor } = useDistributor();
  const sponsorSlug = currentDistributor.slug;
  const isDefaultTenant = sponsorSlug.toLowerCase() === 'allinbrasil';

  const navItems = [
    { 
      icon: Home, 
      label: 'Início',
      to: isDefaultTenant ? '/' : `/${sponsorSlug}`
    },
    { 
      icon: UserPlus, 
      label: 'Seja Distribuidor',
      to: isDefaultTenant ? '/seja-distribuidor' : `/seja-distribuidor/${sponsorSlug}`
    },
    { 
      icon: Store, 
      label: 'Loja',
      to: isDefaultTenant ? '/loja' : `/loja/${sponsorSlug}`
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
            <Link
              key={index}
              to={item.to}
              className="flex flex-col items-center justify-center h-full w-full"
            >
              <Button
                variant="ghost"
                className="flex flex-col items-center justify-center h-full w-full rounded-none"
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs">{item.label}</span>
              </Button>
            </Link>
          );
        })}
        <Button
          variant="ghost"
          className="flex flex-col items-center justify-center h-full w-full rounded-none"
          onClick={() => setIsOpen(true)}
        >
          <ShoppingCart className="h-5 w-5 mb-1" />
          <span className="text-xs">Carrinho</span>
        </Button>
      </div>
    </div>
  );
};

export default MobileBottomNav;
