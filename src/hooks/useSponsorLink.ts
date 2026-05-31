import { useStoreSettings } from '../contexts/StoreSettingsContext';

export const useSponsorLink = () => {
  try {
    const { settings } = useStoreSettings();

    const handleCadastro = () => {
      window.open(settings.sponsorLink, '_blank');
    };

    return { handleCadastro };
  } catch (error) {
    // Fallback if context is not available
    console.warn('useSponsorLink: StoreSettings context not available, using fallback');
    const handleCadastro = () => {
      window.open('https://allinbrasil.com.br', '_blank');
    };
    return { handleCadastro };
  }
};
