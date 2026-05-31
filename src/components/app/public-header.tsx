import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { useDistributor, DEFAULT_DISTRIBUTOR } from "@/lib/distributor-context";
import { 
  Menu, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useSponsorLink } from "@/hooks/useSponsorLink";
import ThemeToggle from "@/components/ThemeToggle";
import UserMenu from "@/components/UserMenu";
import { useAuth } from "@/lib/auth-context";

export function PublicHeader() {
  const { currentDistributor } = useDistributor();
  const location = useLocation();
  const sponsorSlug = currentDistributor.slug;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { handleCadastro } = useSponsorLink();
  const { user } = useAuth();

  const isDefaultTenant = sponsorSlug.toLowerCase() === DEFAULT_DISTRIBUTOR.toLowerCase();

  // Memoizar os itens de navegação para evitar re-renderizações
  const allMobileNavItems = [
    { label: 'Início', href: isDefaultTenant ? '/' : `/${sponsorSlug}` },
    { label: 'Seja Distribuidor', href: isDefaultTenant ? '/seja-distribuidor' : `/seja-distribuidor/${sponsorSlug}` },
    { label: 'Doenças', href: isDefaultTenant ? '/doencas' : `/doencas/${sponsorSlug}` },
    { label: 'Buscar Produtos', href: isDefaultTenant ? '/busca-produtos' : `/busca-produtos/${sponsorSlug}` },
    { label: 'Loja', href: isDefaultTenant ? '/loja' : `/loja/${sponsorSlug}` },
    { label: 'Painel Lojista', href: '/office' },
  ];

  // Componente auxiliar para os links do menu mobile
  const MobileNavLink = ({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) => (
    <Link 
      to={href} 
      onClick={onClick} 
      className="block rounded-md px-3 py-2 text-base font-medium text-foreground/80 hover:bg-accent hover:text-accent-foreground"
    >
      {children}
    </Link>
  );

  return (
    <header className="fixed top-0 w-full bg-allin-bg-light-1/95 backdrop-blur-md border-b border-allin-orange/30 z-40 dark:bg-allin-bg-dark-1/95 dark:border-allin-bg-dark-2 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 flex-shrink-0">
            <img 
              src="https://s3-sa-east-1.amazonaws.com/public-http-files/UploadArquivo/Arquivos/all_in_esp_br/Configuracao/logomarca_sistema_5eee718d4c5bf_logo-h.png" 
              alt="Logo All-In" 
              className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-contain"
            />
            <span className="text-xl md:text-2xl font-bold text-allin-orange">All-In</span>
          </div>
          
          {/* Menu Mobile */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            {user && <UserMenu />}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-allin-dark dark:text-allin-white hover:text-allin-orange transition-colors"
              aria-label="Alternar menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to={isDefaultTenant ? '/' : `/${sponsorSlug}`}
              className={`font-medium text-base transition-colors ${
                location.pathname === (isDefaultTenant ? '/' : `/${sponsorSlug}`) 
                  ? 'text-allin-orange' 
                  : 'text-allin-dark hover:text-allin-orange dark:text-allin-white dark:hover:text-allin-orange'
              }`}
            >
              Início
            </Link>

            <Link 
              to={isDefaultTenant ? '/seja-distribuidor' : `/seja-distribuidor/${sponsorSlug}`}
              className={`font-medium text-base transition-colors ${
                location.pathname === (isDefaultTenant ? '/seja-distribuidor' : `/seja-distribuidor/${sponsorSlug}`) 
                  ? 'text-allin-orange' 
                  : 'text-allin-dark hover:text-allin-orange dark:text-allin-white dark:hover:text-allin-orange'
              }`}
            >
              Seja Distribuidor
            </Link>

            <Link 
              to={isDefaultTenant ? '/doencas' : `/doencas/${sponsorSlug}`}
              className={`font-medium text-base transition-colors ${
                location.pathname === (isDefaultTenant ? '/doencas' : `/doencas/${sponsorSlug}`) 
                  ? 'text-allin-orange' 
                  : 'text-allin-dark hover:text-allin-orange dark:text-allin-white dark:hover:text-allin-orange'
              }`}
            >
              Doenças
            </Link>

            <Link 
              to={isDefaultTenant ? '/busca-produtos' : `/busca-produtos/${sponsorSlug}`}
              className={`font-medium text-base transition-colors ${
                location.pathname === (isDefaultTenant ? '/busca-produtos' : `/busca-produtos/${sponsorSlug}`) 
                  ? 'text-allin-orange' 
                  : 'text-allin-dark hover:text-allin-orange dark:text-allin-white dark:hover:text-allin-orange'
              }`}
            >
              Buscar Produtos
            </Link>

            <Link 
              to={isDefaultTenant ? '/loja' : `/loja/${sponsorSlug}`}
              className={`font-medium text-base transition-colors ${
                location.pathname === (isDefaultTenant ? '/loja' : `/loja/${sponsorSlug}`) 
                  ? 'text-allin-orange' 
                  : 'text-allin-dark hover:text-allin-orange dark:text-allin-white dark:hover:text-allin-orange'
              }`}
            >
              Loja
            </Link>

            <Link 
              to="/office"
              className={`font-medium text-base transition-colors ${
                location.pathname === '/office' 
                  ? 'text-allin-orange' 
                  : 'text-allin-dark hover:text-allin-orange dark:text-allin-white dark:hover:text-allin-orange'
              }`}
            >
              Painel Lojista
            </Link>
          </nav>

          {/* Controles do usuário - Visível apenas em telas médias e grandes */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {user ? (
              <UserMenu />
            ) : (
              <>
                <Link to="/login">
                  <Button 
                    variant="outline"
                    className="border-allin-orange text-allin-orange hover:bg-allin-orange/10 font-semibold"
                  >
                    Entrar
                  </Button>
                </Link>
                <Button 
                  onClick={handleCadastro}
                  className="bg-allin-orange text-allin-white hover:bg-allin-orange/90 font-semibold shadow-md hover:shadow-lg transition-all"
                >
                  Cadastrar-se Grátis
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden mt-4 pb-4 border-t border-allin-orange/30 dark:border-allin-bg-dark-2"
            >
              <div className="flex flex-col space-y-4 pt-4">
                {allMobileNavItems.map(item => (
                  <MobileNavLink 
                    key={item.label} 
                    href={item.href} 
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </MobileNavLink>
                ))}
                
                {user ? (
                  <div className="pt-2 border-t border-allin-orange/30 dark:border-allin-bg-dark-2">
                    <UserMenu />
                  </div>
                ) : (
                  <div className="pt-2 border-t border-allin-orange/30 dark:border-allin-bg-dark-2">
                    <Link to="/login">
                      <Button 
                        variant="outline"
                        className="w-full mb-2 border-allin-orange text-allin-orange hover:bg-allin-orange/10 font-semibold"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Entrar
                      </Button>
                    </Link>
                    <Button 
                      variant="hero" 
                      onClick={() => {
                        handleCadastro();
                        setIsMobileMenuOpen(false);
                      }} 
                      className="w-full bg-allin-orange text-allin-white hover:bg-allin-orange/90 font-semibold shadow-md"
                    >
                      Cadastrar-se Grátis
                    </Button>
                  </div>
                )}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
