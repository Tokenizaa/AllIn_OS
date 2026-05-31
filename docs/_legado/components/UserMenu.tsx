import React, { useCallback } from 'react';

import { LogOut, User, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const UserMenu = () => {
  const { user, profile, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = useCallback(async () => {
    await signOut();
    navigate('/');
  }, [signOut, navigate]);

  if (!user) return null;

  return (
    <div className="flex items-center space-x-2">
      <div className="hidden md:flex flex-col text-right">
        <span className="text-sm font-medium text-allin-dark dark:text-allin-white">
          {profile?.full_name || user.email}
        </span>
        {isAdmin && (
          <span className="text-xs text-allin-orange">Admin</span>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        {isAdmin && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/dashboard')}
            className="hidden md:flex text-allin-dark dark:text-allin-white hover:text-allin-orange"
          >
            <Settings className="w-4 h-4 mr-2" />
            Admin
          </Button>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/profile')}
          className="hidden md:flex text-allin-dark dark:text-allin-white hover:text-allin-orange"
        >
          <User className="w-4 h-4 mr-2" />
          Perfil
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          className="text-allin-dark dark:text-allin-white hover:text-allin-orange"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden md:inline ml-2">Sair</span>
        </Button>
      </div>
    </div>
  );
};

export default UserMenu;