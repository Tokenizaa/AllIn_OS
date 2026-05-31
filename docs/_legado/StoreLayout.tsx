import { Outlet } from 'react-router-dom';

import MobileBottomNav from '@/components/MobileBottomNav';

const StoreLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="pt-20 pb-16 md:pb-0">
        <Outlet />
      </main>
      
      {/* Menu de navegação móvel */}
      <MobileBottomNav />
    </div>
  );
};

export default StoreLayout;