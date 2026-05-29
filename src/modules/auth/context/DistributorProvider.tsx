import React, { createContext, useContext, useState, useEffect } from 'react';
import { DistributorProfile, ReferralMetadata } from '../types/auth.types';
import { distributorService } from '../services/distributor.service';
import { storageUtils } from '../utils/auth.utils';
import { extractReferralFromUrl } from '../utils/redirect.utils';

interface DistributorContextType {
  distributorProfile: DistributorProfile | null;
  activeSponsor: string | null;
  activeReferralMetadata: ReferralMetadata | null;
  setDistributorProfile: (profile: DistributorProfile | null) => void;
  setActiveSponsor: (sponsor: string | null) => void;
  setActiveReferralMetadata: (metadata: ReferralMetadata | null) => void;
  clearSponsor: () => void;
}

const DistributorContext = createContext<DistributorContextType | undefined>(undefined);

export const DistributorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [distributorProfile, setDistributorProfile] = useState<DistributorProfile | null>(null);
  const [activeSponsor, setActiveSponsor] = useState<string | null>(null);
  const [activeReferralMetadata, setActiveReferralMetadata] = useState<ReferralMetadata | null>(null);

  useEffect(() => {
    const initializeDistributor = () => {
      const cachedRef = storageUtils.getActiveReferral();
      const cachedMeta = storageUtils.getActiveReferralMetadata();
      
      if (cachedRef) {
        setActiveSponsor(cachedRef);
      }
      
      if (cachedMeta) {
        setActiveReferralMetadata(cachedMeta);
      }

      const potentialSponsor = extractReferralFromUrl();
      
      if (potentialSponsor) {
        const validDist = distributorService.getDistributorByReferralCode(potentialSponsor);
        
        if (validDist) {
          setActiveSponsor(validDist.referral_code);
          const meta: ReferralMetadata = {
            clicked_at: new Date().toISOString(),
            landing_url: window.location.href,
            referrer_code: potentialSponsor,
            device: typeof navigator !== 'undefined' ? navigator.userAgent : 'ssr'
          };
          setActiveReferralMetadata(meta);
          storageUtils.saveActiveReferral(potentialSponsor);
          storageUtils.saveActiveReferralMetadata(meta);
        }
      }
    };

    initializeDistributor();
  }, []);

  const clearSponsor = () => {
    setActiveSponsor(null);
    setActiveReferralMetadata(null);
    storageUtils.clearActiveReferral();
    storageUtils.clearActiveReferralMetadata();
  };

  const value: DistributorContextType = {
    distributorProfile,
    activeSponsor,
    activeReferralMetadata,
    setDistributorProfile,
    setActiveSponsor,
    setActiveReferralMetadata,
    clearSponsor
  };

  return (
    <DistributorContext.Provider value={value}>
      {children}
    </DistributorContext.Provider>
  );
};

export const useDistributorContext = () => {
  const context = useContext(DistributorContext);
  if (!context) {
    throw new Error('useDistributorContext must be used within a DistributorProvider');
  }
  return context;
};
