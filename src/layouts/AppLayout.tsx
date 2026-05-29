import { Outlet, useLocation } from '@tanstack/react-router';
import MobileBottomNav from '@/components/MobileBottomNav';
import UnifiedHeader from '@/components/unified-header/UnifiedHeader';

const AppLayout = () => {
  const location = useLocation();
  
  const isLojista = location.pathname === '/lojista';
  // Determina se deve mostrar o header baseado na rota
  const shouldShowHeader = (!location.pathname.startsWith('/loja') && !isLojista) || 
                          location.pathname === '/loja' || 
                          location.pathname.startsWith('/loja/');

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {shouldShowHeader && <UnifiedHeader />}
      <main className={`flex-grow ${shouldShowHeader ? 'pt-20' : ''} ${isLojista ? 'pb-0' : 'pb-16'} md:pb-0`}>
        {/* 
          pt-20: padding-top para o header fixo (80px) quando o header é exibido
          pb-16: padding-bottom para o menu móvel (64px)
          md:pb-0: remove o padding-bottom em telas médias para cima
        */}
        <Outlet />
      </main>
      
      {/* Menu de navegação móvel */}
      {!isLojista && <MobileBottomNav />}
    </div>
  );
};

export default AppLayout;