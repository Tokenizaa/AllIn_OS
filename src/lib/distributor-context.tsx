import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";

export const DEFAULT_DISTRIBUTOR = "allinBrasil";

export interface DistributorTheme {
  color: string;
  gradient: string;
  badgeBg: string;
  btnBg: string;
  accentText: string;
  slogan: string;
  bio: string;
  quote: string;
  videoUrl?: string;
}

export interface DistributorInfo {
  slug: string;
  name: string;
  rank: string;
  avatar: string;
  theme: DistributorTheme;
  isFallback: boolean;
}

const PARTNER_THEMES: Record<string, DistributorTheme> = {
  marcus: {
    color: "from-blue-600 to-cyan-500",
    gradient: "from-blue-500/10 via-cyan-500/5 to-transparent",
    badgeBg: "bg-blue-500/15 text-blue-400 border-blue-500/20",
    btnBg: "bg-blue-600 hover:bg-blue-500 shadow-blue-500/20",
    accentText: "text-cyan-400",
    slogan: "Aceleração Celular e Alta Performance Financeira.",
    bio: "Empreendedor serial e líder de expansão na All-In Life. Minha missão é guiar profissionais na construção de renda residual sólida de alta performance através de saúde de precisão patenteada.",
    quote: "Sua biologia é seu maior patrimônio; sua rede de negócios, sua maior alavanca."
  },
  "mariana.ribeiro": {
    color: "from-purple-600 to-rose-500",
    gradient: "from-purple-500/10 via-rose-500/5 to-transparent",
    badgeBg: "bg-purple-500/15 text-purple-400 border-purple-500/20",
    btnBg: "bg-purple-600 hover:bg-purple-500 shadow-purple-500/20",
    accentText: "text-rose-400",
    slogan: "Sinergia Vital: Estética Regenerativa & Longevidade Dinâmica.",
    bio: "Fisioterapeuta dermatofuncional e líder de rede com mais de 500 parceiros. Ajudo pessoas comuns a conquistarem independência total promovendo rejuvenescimento celular ativo e bem-estar de luxo.",
    quote: "Beleza duradoura vem de dentro das células; prosperidade duradoura, de conexões autênticas."
  },
  colussi: {
    color: "from-amber-600 to-orange-500",
    gradient: "from-amber-500/10 via-orange-500/5 to-transparent",
    badgeBg: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    btnBg: "bg-amber-600 hover:bg-amber-500 shadow-amber-500/20",
    accentText: "text-amber-400",
    slogan: "Medicina do Futuro, Ecossistema de Impacto Global.",
    bio: "Precursor da saúde ortomolecular integrada e fundador do sistema All-In Brasil. Lidero workflows orientados à IA operacional para acelerar as vendas diretas de nossa rede de biohackers de elite.",
    quote: "A tecnologia descentralizada e a biogenética avançada unidas na maior revolução MLM do Brasil."
  },
  allinbrasil: {
    color: "from-emerald-600 to-teal-500",
    gradient: "from-emerald-500/10 via-teal-500/5 to-transparent",
    badgeBg: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    btnBg: "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20",
    accentText: "text-emerald-400",
    slogan: "Alta Performance Celular e Independência Financeira.",
    bio: "Distribuidor oficial de vendas diretas e e-commerce All-In Life. Comprometido com a disseminação de saúde integrativa de precisão, bioregulação celular e formação de redes de negócios de alta performance.",
    quote: "Mude sua biografia celular, potencialize suas conexões e ative seu legado de prosperidade combinada."
  }
};

const DEFAULT_THEME: DistributorTheme = PARTNER_THEMES.allinbrasil;

export function resolveDistributor(slug: string | undefined, usersList: any[]): DistributorInfo {
  const normSlug = (slug || "").toLowerCase().trim();
  const activeSlug = normSlug || DEFAULT_DISTRIBUTOR.toLowerCase();

  // Buscar distribuidor real na tabela/simulação do app (filtrar por customer_type = distributor e usuario = slug)
  const matchedUser = usersList.find(
    (u) => 
      u.role === "distributor" && 
      (u.referral_code?.toLowerCase() === activeSlug || u.id.toLowerCase() === activeSlug)
  );

  const theme = PARTNER_THEMES[activeSlug] || DEFAULT_THEME;

  if (matchedUser) {
    return {
      slug: activeSlug,
      name: matchedUser.name,
      rank: matchedUser.permissions_list ? "Membro Premium" : "Distribuidor Autorizado",
      avatar: matchedUser.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(matchedUser.name)}`,
      theme,
      isFallback: false
    };
  }

  // Pre-configured distributors fallbacks
  if (activeSlug === "marcus") {
    return {
      slug: "marcus",
      name: "Marcus Vinícius",
      rank: "Platinum Supremo",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
      theme: PARTNER_THEMES.marcus,
      isFallback: false
    };
  }

  if (activeSlug === "mariana.ribeiro") {
    return {
      slug: "mariana.ribeiro",
      name: "Mariana Ribeiro",
      rank: "Diamante Elite",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      theme: PARTNER_THEMES["mariana.ribeiro"],
      isFallback: false
    };
  }

  if (activeSlug === "colussi") {
    return {
      slug: "colussi",
      name: "Dr. Carlos Colussi",
      rank: "Fundador Executivo",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      theme: PARTNER_THEMES.colussi,
      isFallback: false
    };
  }

  // Final fallback to master distributor 'allinBrasil'
  return {
    slug: DEFAULT_DISTRIBUTOR,
    name: "All-In Brasil",
    rank: "Distribuidor Master Global",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=allinBrasil",
    theme: PARTNER_THEMES.allinbrasil,
    isFallback: true
  };
}

interface DistributorContextProps {
  currentDistributor: DistributorInfo;
  setDistributorBySlug: (slug: string) => void;
}

const DistributorContext = createContext<DistributorContextProps | undefined>(undefined);

export const DistributorProvider: React.FC<{ children: React.ReactNode; initialSlug?: string }> = ({
  children,
  initialSlug
}) => {
  const { usersList } = useAuth();
  const [slug, setSlug] = useState(() => {
    if (initialSlug) return initialSlug;
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      try {
        return localStorage.getItem("allin_active_ref") || DEFAULT_DISTRIBUTOR;
      } catch (e) {
        console.error("Failed to read from localStorage:", e);
      }
    }
    return DEFAULT_DISTRIBUTOR;
  });

  const [currentDistributor, setCurrentDistributor] = useState<DistributorInfo>(() => {
    return resolveDistributor(slug, usersList);
  });

  useEffect(() => {
    const resolved = resolveDistributor(slug, usersList);
    setCurrentDistributor(resolved);

    // Save/Persist tracked referrals
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      try {
        localStorage.setItem("allin_active_ref", resolved.slug);
        const meta = {
          clicked_at: new Date().toISOString(),
          landing_url: window.location.href,
          referrer_code: resolved.slug,
          device: typeof navigator !== "undefined" ? navigator.userAgent : "ssr"
        };
        localStorage.setItem("allin_active_ref_meta", JSON.stringify(meta));
      } catch (e) {
        console.error("Failed to write to localStorage in useEffect:", e);
      }
    }
    console.log(`[DistributorContext] Active sponsor set/sync: ${resolved.slug}`);
  }, [slug, usersList]);

  const setDistributorBySlug = (newSlug: string) => {
    setSlug(newSlug);
  };

  return (
    <DistributorContext.Provider value={{ currentDistributor, setDistributorBySlug }}>
      {children}
    </DistributorContext.Provider>
  );
};

export const useDistributor = () => {
  const context = useContext(DistributorContext);
  if (!context) {
    throw new Error("useDistributor must be used within a DistributorProvider");
  }
  return context;
};
