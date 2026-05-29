import { useStoreSettings } from '@/contexts/StoreSettingsContext';

export const useSponsorLink = () => {
  const { sponsorLink } = useStoreSettings();
  
  const handleCadastro = () => {
    window.open(
      'https://allinbrasil.com.br/publico/Distribuidor/DistribuidoresCadastro/formulario', 
      '_blank'
    );
  };

  return { handleCadastro };
};
