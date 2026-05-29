import { useEffect, useState } from 'react';

import { toast } from 'sonner';

import { Button } from './ui/button';

export function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  useEffect(() => {
    // Verifica se o app já está instalado
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches || 
                       (window.navigator as any).standalone === true ||
                       document.referrer.includes('android-app://');
    
    setIsAppInstalled(isInstalled);

    // Manipula o evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      // Previne o prompt automático em alguns navegadores
      e.preventDefault();
      // Salva o evento para ser usado mais tarde
      setDeferredPrompt(e);
      
      // Mostra um toast informando que o app pode ser instalado
      toast('Você pode instalar o app para uma melhor experiência!', {
        action: {
          label: 'Instalar',
          onClick: () => handleInstallClick(),
        },
        duration: 10000,
      });
    };

    // Manipula o evento appinstalled
    const handleAppInstalled = () => {
      console.log('App instalado com sucesso!');
      setIsAppInstalled(true);
      setDeferredPrompt(null);
    };

    // Adiciona os event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    window.addEventListener('appinstalled', handleAppInstalled as EventListener);

    // Limpa os event listeners quando o componente é desmontado
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
      window.removeEventListener('appinstalled', handleAppInstalled as EventListener);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      toast.error('Não foi possível instalar o app. Tente novamente mais tarde.');
      return;
    }

    try {
      // Mostra o prompt de instalação
      (deferredPrompt as any).prompt();
      
      // Espera pelo resultado da instalação
      const { outcome } = await (deferredPrompt as any).userChoice;
      
      // Verifica se o usuário instalou o app
      if (outcome === 'accepted') {
        console.log('Usuário aceitou a instalação do app');
        toast.success('App instalado com sucesso!');
        setIsAppInstalled(true);
      } else {
        console.log('Usuário recusou a instalação do app');
      }
      
      // Limpa o deferredPrompt após o uso
      setDeferredPrompt(null);
    } catch (error) {
      console.error('Erro ao instalar o app:', error);
      toast.error('Ocorreu um erro ao tentar instalar o app.');
    }
  };

  // Não renderiza nada se o app já estiver instalado ou se não houver prompt de instalação
  if (isAppInstalled || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button 
        onClick={handleInstallClick}
        className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
      >
        Instalar App
      </Button>
    </div>
  );
}

export default PWAInstaller;
