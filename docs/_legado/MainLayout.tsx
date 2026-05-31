import { Outlet } from 'react-router-dom';

import MobileBottomNav from '@/components/MobileBottomNav';
import UnifiedHeader from '@/components/unified-header/UnifiedHeader';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <UnifiedHeader />
      <main className="flex-grow pt-20 pb-16 md:pb-0">
        {/* 
          pt-20: padding-top para o header fixo (80px)
          pb-16: padding-bottom para o menu móvel (64px)
          md:pb-0: remove o padding-bottom em telas médias para cima
        */}
        <Outlet />
      </main>
      
      {/* Menu de navegação móvel */}
      <MobileBottomNav />
    </div>
  );
};

export default MainLayout;