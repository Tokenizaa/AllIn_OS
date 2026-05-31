import React, { useState } from 'react';

import { Layout, Users, MessageSquare, BarChart3, Store, LogOut, User, Key, Smartphone, ShoppingBag, TestTube, Menu, X } from 'lucide-react';
import { Outlet, useLocation, Link, useNavigate, Navigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut, isAdmin, isSuperAdmin, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const hasAdminAccess = !!user && (isAdmin || isSuperAdmin);

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: Layout },
    { name: 'Leads', href: '/admin/leads', icon: Users },
    { name: 'Mensagens', href: '/admin/messages', icon: MessageSquare },
    { name: 'Usuários', href: '/admin/users', icon: User },
    { name: 'Solicitações', href: '/admin/requests', icon: BarChart3 },
    { name: 'Lojas', href: '/admin/stores', icon: Store },
    { name: 'Evolution API', href: '/admin/evolution', icon: Smartphone },
    { name: 'Test Maxx API', href: '/admin/test-maxx', icon: TestTube },
    { name: 'Painel Lojista', href: '/lojista', icon: ShoppingBag },
    { name: 'Chaves de API', href: '/admin/api-keys', icon: Key },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-allin-orange"></div>
      </div>
    );
  }

  if (!hasAdminAccess) {
    return <Navigate to="/login" replace />;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar Desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col bg-white shadow-md flex-shrink-0">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 px-4 border-b">
            <h1 className="text-xl font-bold text-gray-800">Admin All In</h1>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-allin-orange text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          <div className="p-4 border-t">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-full bg-allin-orange flex items-center justify-center text-white font-bold">
                {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'A'}
              </div>
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium text-gray-900 truncate">{profile?.full_name || 'Administrador'}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email || 'admin@allin.com'}</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar Mobile Overlay (Backdrop) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Mobile (Drawer) */}
      <div className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white shadow-2xl transition-transform duration-300 md:hidden ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-6 border-b">
            <h1 className="text-xl font-bold text-gray-800">Admin All In</h1>
            <Button variant="ghost" size="sm" onClick={() => setIsSidebarOpen(false)}>
              <X className="h-5 w-5 text-gray-500" />
            </Button>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-allin-orange text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          <div className="p-4 border-t">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-full bg-allin-orange flex items-center justify-center text-white font-bold">
                {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'A'}
              </div>
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium text-gray-900 truncate">{profile?.full_name || 'Administrador'}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email || 'admin@allin.com'}</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-50">
        {/* Top Mobile Header */}
        <header className="flex md:hidden items-center justify-between h-16 px-4 bg-white border-b flex-shrink-0">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="px-2" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="h-6 w-6 text-gray-600" />
            </Button>
            <span className="text-lg font-bold text-gray-800">Admin All In</span>
          </div>
          
          <div className="w-8 h-8 rounded-full bg-allin-orange flex items-center justify-center text-white font-bold text-sm shadow-md">
            {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'A'}
          </div>
        </header>

        {/* Scroll Area for pages */}
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
