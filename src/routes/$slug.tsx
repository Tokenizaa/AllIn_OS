import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { useDistributor } from "@/lib/distributor-context";
import { products, formatBRL } from "@/lib/mock-data";
import { 
  Crown, Phone, Star, Sparkles, ShoppingBag, Globe, 
  ArrowRight, MessageSquare, Instagram, ShieldCheck, 
  MapPin, Heart, Plus, Minus, Check, Users, Landmark, ChevronRight, Share2, Award
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PublicHeader } from "@/components/app/public-header";

export const Route = createFileRoute("/$slug")({
  component: DistributorPage,
});

export function DistributorPage() {
  const params = useParams({ strict: false }) as { slug?: string };
  const { currentDistributor, setDistributorBySlug } = useDistributor();
  const navigate = useNavigate();
  const { register, usersList } = useAuth();
  
  // Clean parameter and sync
  const routeSlug = params.slug?.toLowerCase().trim();
  
  useEffect(() => {
    if (routeSlug) {
      setDistributorBySlug(routeSlug);
    }
  }, [routeSlug, setDistributorBySlug]);

  const sponsorSlug = currentDistributor.slug;
  const theme = currentDistributor.theme;
  const distName = currentDistributor.name;
  const distRank = currentDistributor.rank;
  const distAvatar = currentDistributor.avatar;

  const matchedUser = (usersList || []).find(
    (u) => 
      u.role === "distributor" && 
      (u.referral_code?.toLowerCase() === sponsorSlug.toLowerCase() || u.id.toLowerCase() === sponsorSlug.toLowerCase())
  );

  // Lead captured stats
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadOption, setLeadOption] = useState("all");
  const [submittingLead, setSubmittingLead] = useState(false);
  const [leadSuccess, setLeadSuccess] = useState(false);

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadEmail || !leadPhone) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    setSubmittingLead(true);
    setTimeout(() => {
      setSubmittingLead(false);
      setLeadSuccess(true);
      toast.success("Lead cadastrado com sucesso e vinculado à rede!");
    }, 1500);
  };

  const shareProfile = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link do perfil copiado para compartilhamento!");
  };

  return (
    <div className="min-h-screen bg-[#06080d] text-white selection:bg-emerald-500/30 overflow-x-hidden">
      {/* Decorative gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-950/20 via-transparent to-transparent blur-3xl pointer-events-none" />
      <div className={`absolute top-1/4 -right-1/4 w-96 h-96 bg-gradient-to-r ${theme.color} opacity-10 blur-3xl pointer-events-none rounded-full`} />
      <div className="absolute bottom-1/4 -left-1/4 w-96 h-96 bg-indigo-500/5 blur-3xl pointer-events-none rounded-full" />

      {/* HEADER NAV */}
      <PublicHeader />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-16 relative">
        
        {/* HERO SECTION WITH PROFILE DETAILS */}
        <section id="profile-hero" className="grid lg:grid-cols-12 gap-8 items-center pt-4">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${theme.badgeBg}`}>
                <Crown className="h-3 w-3 shrink-0" /> {distRank}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono text-muted-foreground border border-border/40 bg-background/50">
                <MapPin className="h-3 w-3 shrink-0" /> SP / Brasil
              </span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                Espaço Autoral de <br />
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
                  {distName}
                </span>
              </h1>
              <p className="text-md font-medium text-muted-foreground italic leading-relaxed font-sans max-w-xl">
                "{theme.slogan}"
              </p>
            </div>

            <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed">
              {theme.bio}
            </p>

            <div className="flex flex-wrap gap-3.5 pt-2">
              <Link
                to="/loja/$slug"
                params={{ slug: sponsorSlug }}
                className="inline-flex items-center justify-center gap-2 h-10 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:opacity-90 transition-all font-bold text-black text-xs shadow-lg shadow-emerald-500/10 cursor-pointer"
              >
                <ShoppingBag className="h-4 w-4" />
                Explorar Vitrine On-Line
              </Link>
              <Link
                to="/seja-distribuidor/$slug"
                params={{ slug: sponsorSlug }}
                className="inline-flex items-center justify-center gap-2 h-10 px-6 rounded-xl border border-border/80 bg-background/40 hover:bg-background/80 transition-all font-semibold text-white text-xs cursor-pointer"
              >
                Trabalhar Conosco
                <ArrowRight className="h-4 w-4 text-emerald-400" />
              </Link>
              <button 
                onClick={shareProfile}
                className="h-10 w-10 rounded-xl border border-border/50 bg-[#090d16] flex items-center justify-center cursor-pointer hover:border-border text-muted-foreground hover:text-white"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>

            {/* Social Proof Stats */}
            <div className="pt-6 grid grid-cols-3 gap-6 max-w-lg border-t border-border/15">
              <div className="space-y-1">
                <p className="text-2xl font-black text-white">500+</p>
                <p className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">Clientes Atendidos</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-black text-white">600+</p>
                <p className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">Parceiros de Rede</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-black text-white">R$ 400k+</p>
                <p className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">Vendas Efetuadas</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative group">
              {/* Outer neon border gradient ring */}
              <div className="absolute -inset-2.5 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-indigo-500 opacity-25 blur-lg group-hover:opacity-45 transition duration-1000" />
              
              <div className="relative rounded-2xl border border-border/60 bg-[#090d16] p-4 text-center w-full max-w-[340px] space-y-4">
                <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-2 border-emerald-500/30">
                  <img 
                    src={distAvatar} 
                    alt={distName} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-md font-bold text-white font-sans">{distName}</h3>
                  <p className="text-xs text-emerald-400 font-mono mt-0.5">{distRank}</p>
                </div>
                
                <div className="p-3 bg-background/50 rounded-xl text-left text-xs font-mono space-y-1.5 border border-border/40">
                  <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider font-sans mb-1 text-center">Contato Autorizado</p>
                  <p className="flex justify-between">Email: <span className="text-white truncate max-w-[150px]">{matchedUser?.email || `${sponsorSlug}@allin.io`}</span></p>
                  <p className="flex justify-between">Código: <span className="text-emerald-400 font-bold">@{sponsorSlug}</span></p>
                </div>

                <div className="space-y-2">
                  <a 
                    href={`https://wa.me/5511987654321?text=Ola%20${encodeURIComponent(distName)},%20gostaria%20de%20saber%20mais%20sobre%20os%20produtos%20da%20Allin`}
                    target="_blank"
                    className="w-full h-9 rounded-xl bg-[#25d366]/10 hover:bg-[#25d366]/20 border border-[#25d366]/20 text-[#25d366] text-xs font-bold transition-colors flex items-center justify-center gap-1.5 pt-0.5"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Falar pelo WhatsApp
                  </a>
                  <a 
                    href="https://instagram.com"
                    target="_blank"
                    className="w-full h-9 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-400 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 pt-0.5"
                  >
                    <Instagram className="h-4 w-4" />
                    Acompanhar Instagram
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* QUOTE BLOCK */}
        <section id="distributor-quote" className="rounded-2xl border border-zinc-800 bg-[#090d16]/30 p-6 md:p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-10 h-32 w-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
          <Star className="h-6 w-6 text-emerald-400 mx-auto opacity-75 mb-3" />
          <p className="text-md sm:text-lg font-medium text-white max-w-3xl mx-auto italic leading-relaxed">
            "{theme.quote}"
          </p>
          <p className="mt-3 text-xs font-mono text-zinc-500 uppercase tracking-widest">— Manifesto Orgânico Celular</p>
        </section>

        {/* VITRINE HIGHLIGHT */}
        <section id="store-vitrine" className="space-y-6">
          <div className="flex justify-between items-baseline">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#a855f7] bg-purple-500/15 border border-purple-500/20 px-2.5 py-1 rounded-full font-mono">
                Vitrine Exclusiva
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1.5">Nossos Lançamentos de Alta Performance</h2>
            </div>
            <Link to="/loja/$slug" params={{ slug: sponsorSlug }} className="text-xs text-emerald-400 hover:underline flex items-center gap-0.5 cursor-pointer">
              Ver vitrine completa <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.slice(0, 4).map((prod) => (
              <div 
                key={prod.id} 
                className="rounded-2xl border border-border/45 bg-[#090d16]/90 overflow-hidden flex flex-col justify-between hover:border-zinc-700 hover:scale-[1.01] transition-all p-1"
              >
                <div className="relative">
                  <img
                    src={prod.id === "prd_1" ? "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=400" :
                         prod.id === "prd_2" ? "https://images.unsplash.com/photo-1512152272829-e3139592d56f?auto=format&fit=crop&q=80&w=400" :
                         prod.id === "prd_3" ? "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=400" :
                         "https://images.unsplash.com/photo-1626847037657-fd3622613ce3?auto=format&fit=crop&q=80&w=400"}
                    alt={prod.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-44 object-cover rounded-xl opacity-80"
                  />
                  <span className="absolute top-2 right-2 text-[9px] font-bold font-mono tracking-wider text-emerald-400 bg-[#06080d]/90 px-2 py-0.5 rounded-md uppercase border border-emerald-500/25">
                    {prod.category}
                  </span>
                </div>
                
                <div className="p-4 space-y-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white line-clamp-1 leading-snug">{prod.name}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mt-1">{prod.description}</p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-border/20">
                    <div className="flex justify-between items-baseline">
                      <span className="text-[10px] text-muted-foreground font-mono">Valor Comercial:</span>
                      <strong className="text-md font-bold text-white">{formatBRL(prod.price)}</strong>
                    </div>

                    <Link
                      to="/produto/$id"
                      params={{ id: prod.id }}
                      search={{ ref: sponsorSlug }}
                      className="w-full h-8 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer pt-0.5"
                    >
                      Detalhes do Produto
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* DIRECT COOPERATION / LEAD CAPTURE SYSTEM */}
        <section id="lead-recruitment" className="grid lg:grid-cols-12 gap-8 items-center border border-border/50 bg-gradient-to-br from-[#090d16]/85 via-[#0c1322]/30 to-[#070b12] rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 h-40 w-40 bg-purple-500/5 blur-2xl rounded-full" />
          
          <div className="lg:col-span-6 space-y-4">
            <span className="text-[9px] uppercase tracking-widest font-mono text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
              WORKFLOW DE CAPTAÇÃO LEAD
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
              Inicie Sua Jornada na All-In Life em Nosso Time Especializado
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Trabalhe em colaboração direta com <strong className="text-white">{distName}</strong>. Ganhe acesso imediato ao material de prospecção corporativo, webinars semanais operados por IA e taxas preferenciais no licenciamento global de rede.
            </p>
            <div className="space-y-2 text-xs text-zinc-400">
              <p className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400 shrink-0" /> Patrocínio garantido sob código <strong className="text-white">@{sponsorSlug}</strong></p>
              <p className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400 shrink-0" /> Treinamentos e scripts para mídias sociais inclusos</p>
              <p className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400 shrink-0" /> Licenciamento e ativação em menos de 10 minutos</p>
            </div>
          </div>

          <div className="lg:col-span-6">
            <AnimatePresence mode="wait">
              {!leadSuccess ? (
                <motion.form 
                  key="lead-form"
                  onSubmit={handleLeadSubmit}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="rounded-2xl border border-zinc-800 bg-[#06080d]/90 p-6 space-y-4"
                >
                  <h3 className="text-md font-bold text-white text-center">Fale Direto Com Nosso Especialista</h3>
                  
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground font-mono">Nome Completo</label>
                      <input 
                        type="text" 
                        required
                        value={leadName}
                        onChange={(e) => setLeadName(e.target.value)}
                        className="w-full h-9 rounded-lg bg-background/50 border border-border px-3 text-xs text-white"
                        placeholder="Ex: Carlos Silva"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-muted-foreground font-mono">E-mail Corporativo</label>
                        <input 
                          type="email" 
                          required
                          value={leadEmail}
                          onChange={(e) => setLeadEmail(e.target.value)}
                          className="w-full h-9 rounded-lg bg-background/50 border border-border px-3 text-xs text-white"
                          placeholder="carlos@gmail.com"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-muted-foreground font-mono">Telefone (WhatsApp)</label>
                        <input 
                          type="tel" 
                          required
                          value={leadPhone}
                          onChange={(e) => setLeadPhone(e.target.value)}
                          className="w-full h-9 rounded-lg bg-background/50 border border-border px-3 text-xs text-white"
                          placeholder="(11) 99999-0000"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground font-mono">Seu Principal Interesse</label>
                      <select 
                        value={leadOption}
                        onChange={(e) => setLeadOption(e.target.value)}
                        className="w-full h-9 rounded-lg bg-[#06080d] border border-border px-3 text-xs text-white cursor-pointer"
                      >
                        <option value="all">Quero consumir produtos e fazer rede MLM</option>
                        <option value="retail">Quero ser apenas consumidor licenciado (descontos de até 40%)</option>
                        <option value="sales">Quero revender e ganhar na margem comercial de 100%</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingLead}
                    className="w-full h-10 mt-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer pt-0.5"
                  >
                    {submittingLead ? (
                      <span className="h-4 w-4 animate-spin rounded-full border border-t-transparent border-black" />
                    ) : (
                      <>
                        Sim, Quero Me Cadastrar No Time!
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.div 
                  key="lead-success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-8 text-center space-y-4"
                >
                  <div className="h-12 w-12 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-md font-bold text-white">Solicitação Vinculada!</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-1 max-w-sm mx-auto">
                      Parabéns, <strong className="text-white">{leadName}</strong>! Suas informações foram anexadas no ledger do patrocinador <strong className="text-emerald-400">@{sponsorSlug}</strong>. Entraremos em contato via WhatsApp nas próximas 2 horas.
                    </p>
                  </div>
                  <div className="flex gap-2 justify-center pt-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs font-mono"
                      onClick={() => navigate({ to: "/seja-distribuidor/$slug", params: { slug: sponsorSlug } })}
                    >
                      Acessar Onboarding MLM
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-zinc-900 bg-[#040609] py-12 relative z-10 text-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <span className="font-sans font-extrabold text-[15px] uppercase tracking-wider text-white">
              All-In <span className="text-emerald-400">life</span>
            </span>
            <p className="text-zinc-500 leading-relaxed">
              Plataforma de expansão de rede MLM descentralizada conectada à All-In Brasil e operada por inteligência artificial contextual.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-3">Links Corporativos</h4>
            <ul className="space-y-2 text-zinc-400">
              <li><Link to="/login" className="hover:text-white transition-colors">Entrar na Área Restrita</Link></li>
              <li><Link to="/cadastro" className="hover:text-white transition-colors">Criar Nova Distribuidora</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Termos de Conformidade</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Guia de Compliance MLM</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-3">Patrocinador Ativo</h4>
            <div className="flex items-center gap-2">
              <img src={distAvatar} alt={distName} className="h-8 w-8 rounded-full border border-border/40" />
              <div>
                <p className="font-semibold text-white leading-none">{distName}</p>
                <p className="text-[10px] text-emerald-400 font-mono mt-0.5">@{sponsorSlug}</p>
              </div>
            </div>
            <p className="mt-2 text-[10px] text-zinc-500">Qualificação ativa auditada em tempo real.</p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-3">Aviso Legal</h4>
            <p className="text-zinc-500 border-l border-zinc-800 pl-3 leading-relaxed">
              All-In Life é uma marca registrada de nutrição de precisão patenteada. Os resultados financeiros MLM variam dependendo da volumetria, esforço individual e captação legítima de rede.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
