import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { useDistributor } from "@/lib/distributor-context";
import { plansCatalog } from "@/lib/distributor-data";
import { 
  Users, TrendingUp, Trophy, Award, Landmark, ChevronRight, 
  Check, Play, ArrowRight, UserPlus, Calculator, ShieldCheck, 
  HelpCircle, CreditCard, Sparkles, MessageCircle, Crown, Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PublicHeader } from "@/components/app/public-header";

export const Route = createFileRoute("/seja-distribuidor/$slug")({
  component: DistributorRecruitmentPage,
});

export function DistributorRecruitmentPage() {
  const params = useParams({ strict: false }) as { slug?: string };
  const { currentDistributor, setDistributorBySlug } = useDistributor();
  const navigate = useNavigate();
  const { usersList, register, activeSponsor } = useAuth();
  
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

  const matchedUser = (usersList || []).find(
    (u) => 
      u.role === "distributor" && 
      (u.referral_code?.toLowerCase() === sponsorSlug.toLowerCase() || u.id.toLowerCase() === sponsorSlug.toLowerCase())
  );

  // Earnings Simulator State
  const [directs, setDirects] = useState(3);
  const [multiplication, setMultiplication] = useState(3);
  const [generations, setGenerations] = useState(3);
  const [avgTicket, setAvgTicket] = useState(300);

  // Network math
  let totalNetworkSize = 0;
  let estimatedMonthlyIncome = 0;

  for (let g = 1; g <= generations; g++) {
    const generationCount = directs * Math.pow(multiplication, g - 1);
    totalNetworkSize += generationCount;
    
    // Average passive residual unilevel commission payout per generation active: 4% of avgTicket
    const unilevelPayout = avgTicket * 0.04;
    estimatedMonthlyIncome += generationCount * unilevelPayout;
  }

  // Registration form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [onboardingStep, setOnboardingStep] = useState<"form" | "success">("form");
  const [submittingReg, setSubmittingReg] = useState(false);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !cpf || !password) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setSubmittingReg(true);
    try {
      // Execute simulated register with distributor role
      await register(name, email, "distributor", {
        phone,
        cpf,
        sponsor_id: sponsorSlug,
        password
      });

      toast.success("Conta de distribuidor criada! Prossiga para ativação do plano.");
      setOnboardingStep("success");
    } catch (err: any) {
      toast.error(err.message || "Erro ao efetuar seu cadastro.");
    } finally {
      setSubmittingReg(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06080d] text-white selection:bg-emerald-500/30 overflow-x-hidden">
      
      {/* PIN HEADER BAR */}
      <div className="bg-[#0b1220] border-b border-border/10 px-4 py-2.5 text-center flex items-center justify-center gap-2 text-xs relative z-40">
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <p className="text-zinc-300">
          Você foi indicado por <strong className="text-white">{distName}</strong> para licenciar uma franquia All-In Life.
        </p>
        <Link to="/$slug" params={{ slug: sponsorSlug }} className="text-emerald-400 hover:text-emerald-300 ml-1.5 underline inline-flex items-center gap-0.5">
          Ver perfil <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      <PublicHeader />

      {/* COMPARED HEADER HERO */}
      <header className="relative py-12 md:py-16 border-b border-zinc-900 overflow-hidden bg-gradient-to-b from-indigo-950/10 via-background to-transparent">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 h-80 w-full max-w-5xl bg-gradient-to-tr from-emerald-500/10 to-indigo-500/5 blur-3xl pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-[10px] font-bold tracking-widest font-mono text-emerald-400 bg-emerald-500/15 border border-emerald-500/20 px-3 py-1 rounded-full uppercase">
            OPORTUNIDADE DISTRIBUIDOR AUTO-SUFICIENTE
          </span>
          
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-snug max-w-4xl mx-auto">
            Empreenda em Biotecnologia Celular de Luxo com All-In Brasil
          </h1>
          
          <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            A All-In Life fornece um ecossistema completo para médicos, terapeutas e biohackers ampliarem seus resultados clínicos e financeiros de forma desacoplada e automatizada por IAs operacionais.
          </p>

          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                const el = document.getElementById("recruitment-form");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex h-10 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black text-xs font-bold uppercase tracking-wider items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/15 cursor-pointer pt-0.5"
            >
              Iniciar Credenciamento
            </button>
            <button
              onClick={() => {
                const el = document.getElementById("calculator-simulator");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex h-10 px-6 rounded-xl border border-zinc-700 bg-background/50 hover:bg-background text-zinc-300 text-xs font-semibold items-center justify-center gap-1.5 cursor-pointer"
            >
              Simular Ganhos Residuais
            </button>
          </div>
        </div>
      </header>

      {/* CORE CONTENT */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-20 relative">

        {/* COMPENSATION GRID SUMMARY */}
        <section id="compensation-structure" className="space-y-6">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">4 Vias de Bonificação Altamente Lucrativas</h2>
            <p className="text-xs text-zinc-400">Entenda de forma estrita e descomplicada como funciona a remuneração de nossa rede de biohackers.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl border border-zinc-800 bg-[#090d16]/80 space-y-3 hover:border-zinc-700 transition-colors">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center"><Trophy className="h-4.5 w-4.5" /></div>
              <h3 className="text-xs font-bold uppercase tracking-widest font-mono text-zinc-500">Lucro de Revenda</h3>
              <h4 className="text-sm font-bold text-white">Margem de 100% On-Line</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">Compre a preço de fábrica (descontos de até 50%) e revenda ao consumidor final com 100% de margem e faturamento integrado.</p>
            </div>

            <div className="p-5 rounded-2xl border border-zinc-800 bg-[#090d16]/80 space-y-3 hover:border-zinc-700 transition-colors">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center"><Users className="h-4.5 w-4.5" /></div>
              <h3 className="text-xs font-bold uppercase tracking-widest font-mono text-zinc-500">Unilevel Infinito</h3>
              <h4 className="text-sm font-bold text-white">Pagamentos em 10 Gerações</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">Ganhe comissão residual fixa de até 4% em todos os consumos ocorridos na sua rede, inclusive recompras de clientes finais.</p>
            </div>

            <div className="p-5 rounded-2xl border border-zinc-800 bg-[#090d16]/80 space-y-3 hover:border-zinc-700 transition-colors">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center"><TrendingUp className="h-4.5 w-4.5" /></div>
              <h3 className="text-xs font-bold uppercase tracking-widest font-mono text-zinc-500">Bônus Binário</h3>
              <h4 className="text-sm font-bold text-white">10% a 30% Perna Menor</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">Sua rede é dividida em equipe Esquerda e Direita. Receba bônus de binário recorrentes sob o volume de faturamento semanal.</p>
            </div>

            <div className="p-5 rounded-2xl border border-zinc-800 bg-[#090d16]/80 space-y-3 hover:border-zinc-700 transition-colors">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center"><Award className="h-4.5 w-4.5" /></div>
              <h3 className="text-xs font-bold uppercase tracking-widest font-mono text-zinc-500">Bônus Ativação</h3>
              <h4 className="text-sm font-bold text-white">Adesão Direta de Franquias</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">Ganhe bonificação imediata polpuda de até R$ 350,00 por novas distribuições que adentrarem seu time direto.</p>
            </div>
          </div>
        </section>

        {/* DYNAMIC EARNINGS CALCULATOR */}
        <section id="calculator-simulator" className="border border-zinc-800 bg-[#090d16]/65 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 h-48 w-48 bg-gradient-to-br from-emerald-500/5 to-indigo-500/5 blur-2xl rounded-full" />
          
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* Controls */}
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#a855f7]/15 text-[#a855f7] border border-[#a855f7]/25 font-mono">
                <Calculator className="h-3 w-3" /> SIMULADOR EXPONENCIAL MLM
              </span>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">Projete Seus Ganhos Passivos Recorrentes</h3>
              <p className="text-xs text-zinc-400 leading-relaxed max-w-xl">
                Altere os sliders abaixo para verificar como pequenas multiplicações de rede geram rendas residuais absurdas no longo prazo através de recompras e de consumos repetitivos de suplementos.
              </p>

              <div className="space-y-4 pt-2">
                {/* Sliders */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-zinc-300">Embaixadores cadastrados por você (Diretos):</span>
                    <span className="text-emerald-400 font-bold font-mono">{directs} diretos</span>
                  </div>
                  <input 
                    type="range" min="1" max="15" value={directs} onChange={(e) => setDirects(parseInt(e.target.value))}
                    className="w-full accent-emerald-500 h-1 rounded-lg cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-zinc-300">Duplicação de rede (Quantos cada parceiro recruta):</span>
                    <span className="text-emerald-400 font-bold font-mono">{multiplication} indicados</span>
                  </div>
                  <input 
                    type="range" min="1" max="5" value={multiplication} onChange={(e) => setMultiplication(parseInt(e.target.value))}
                    className="w-full accent-emerald-500 h-1 rounded-lg cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-zinc-300">Profundidade considerada (Gerações):</span>
                    <span className="text-emerald-400 font-bold font-mono">{generations} gerações</span>
                  </div>
                  <input 
                    type="range" min="1" max="5" value={generations} onChange={(e) => setGenerations(parseInt(e.target.value))}
                    className="w-full accent-emerald-500 h-1 rounded-lg cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-zinc-300">Consumo mensal médio de produtos por membro:</span>
                    <span className="text-emerald-400 font-bold font-mono">R$ {avgTicket} / mês</span>
                  </div>
                  <input 
                    type="range" min="100" max="1000" step="50" value={avgTicket} onChange={(e) => setAvgTicket(parseInt(e.target.value))}
                    className="w-full accent-emerald-500 h-1 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Estimates box */}
            <div className="lg:col-span-5 rounded-2xl border border-zinc-800 bg-[#06080d] p-6 text-center space-y-4">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider font-mono">Prospecção de Ganhos Residual</span>
              
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-[#25d366] font-bold font-mono leading-none">RENDIMENTO MENSAL ESTIMADO</p>
                <p className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono tracking-tight leading-none mt-1.5">
                  {estimatedMonthlyIncome.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </p>
                <p className="text-[10px] text-zinc-500 font-mono">Simulação baseada em taxas residuais de 4% s/ consumo</p>
              </div>

              <div className="p-3 bg-zinc-900/50 rounded-xl border border-zinc-800 text-left text-xs font-mono space-y-1.5 divide-y divide-border/10">
                <div className="flex justify-between items-baseline pb-1.5">
                  <span>Membros Ativos na Rede:</span>
                  <span className="text-white font-bold font-mono">{totalNetworkSize} pessoas</span>
                </div>
                <div className="flex justify-between items-baseline pt-1.5">
                  <span>Volume Total Consumido:</span>
                  <span className="text-white font-bold font-mono">{(totalNetworkSize * avgTicket).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  const el = document.getElementById("recruitment-form");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer pt-0.5"
              >
                Garantir Codificação @{sponsorSlug}
              </button>
            </div>
          </div>
        </section>

        {/* REGISTRATION FORM (THE MLM CAPTURE PORTAL) */}
        <section id="recruitment-form" className="max-w-4xl mx-auto rounded-3xl border border-zinc-800 bg-[#090d16]/95 overflow-hidden shadow-2xl">
          <AnimatePresence mode="wait">
            {onboardingStep === "form" ? (
              <motion.div 
                key="form-step" 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid md:grid-cols-12"
              >
                {/* Profile side */}
                <div className="md:col-span-5 bg-gradient-to-br from-[#0d172e] via-[#090e1b] to-[#04060b] p-6 md:p-8 flex flex-col justify-between border-r border-[#141f39]">
                  <div className="space-y-4">
                    <span className="text-[10px] bg-emerald-500/15 text-emerald-400 font-mono font-bold px-2.5 py-1 rounded-full border border-emerald-500/25">
                      PATROCÍNIO VINCULADO
                    </span>
                    <h3 className="text-md font-bold text-white">Você Está se Credenciando Conosco</h3>
                    
                    <div className="flex items-center gap-3 bg-black/40 border border-border/40 rounded-xl p-3">
                      <img 
                        src={matchedUser?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(distName)}`} 
                        alt={distName} 
                        className="h-10 w-10 rounded-full border border-emerald-500/40 object-cover" 
                      />
                      <div>
                        <p className="font-bold text-white text-xs">{distName}</p>
                        <p className="text-[10px] text-emerald-400 font-mono leading-none mt-0.5">@{sponsorSlug}</p>
                        <p className="text-[10px] text-zinc-400 mt-1">{distRank}</p>
                      </div>
                    </div>

                    <p className="text-zinc-400 leading-relaxed text-xs">
                      Seu patrocinador legítimo assegura sua vaga de nível superior na perna binária ativa. Seus bônus serão depositados semanalmente direto em conta bancária auditada pela Dr. Carlos Colussi.
                    </p>
                  </div>

                  <div className="pt-6 border-t border-zinc-800 text-[10px] text-zinc-500 space-y-1">
                    <p className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> Tecnologia de segurança com gateway Bacen</p>
                    <p className="flex items-center gap-1.5"><Landmark className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> Liquidação imediata de bônus binários</p>
                  </div>
                </div>

                {/* Form fields */}
                <form onSubmit={handleRegisterSubmit} className="md:col-span-7 p-6 md:p-10 space-y-5">
                  <h3 className="text-md font-bold text-white mb-2 leading-none">Preencha Seu Credenciamento Oficial</h3>
                  
                  <div className="space-y-3.5">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground font-mono">Seu Nome Completo</label>
                      <input 
                        type="text" required value={name} onChange={(e) => setName(e.target.value)}
                        className="w-full h-9 rounded-lg bg-background border border-border px-3 text-xs text-white"
                        placeholder="Ex: Marcus Vinícius"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-muted-foreground font-mono">E-mail para Licença</label>
                        <input 
                          type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                          className="w-full h-9 rounded-lg bg-background border border-border px-3 text-xs text-white"
                          placeholder="marcus@allin.io"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-muted-foreground font-mono">Senha de Acesso ao Painel</label>
                        <input 
                          type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                          className="w-full h-9 rounded-lg bg-background border border-border px-3 text-xs text-white"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-muted-foreground font-mono">CPF para Auditoria Receita</label>
                        <input 
                          type="text" required value={cpf} onChange={(e) => setCpf(e.target.value)}
                          className="w-full h-9 rounded-lg bg-background border border-border px-3 text-xs text-white"
                          placeholder="111.222.333-44"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-muted-foreground font-mono">WhatsApp de Contato</label>
                        <input 
                          type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)}
                          className="w-full h-9 rounded-lg bg-background border border-border px-3 text-xs text-white"
                          placeholder="(11) 98765-4321"
                        />
                      </div>
                    </div>

                    {/* Choose startup plan option */}
                    <div className="space-y-1.5 pt-2">
                      <label className="text-[10px] uppercase font-bold text-zinc-500 font-mono">Franquia / Kit de Adesão Inicial</label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button" onClick={() => setSelectedPlan("starter")}
                          className={`p-2.5 text-left rounded-xl border flex flex-col justify-between transition-all cursor-pointer ${
                            selectedPlan === "starter" ? "border-emerald-500 bg-emerald-500/5" : "border-border hover:bg-background/25"
                          }`}
                        >
                          <span className="text-[10px] font-bold text-zinc-400">Starter</span>
                          <span className="text-xs font-black text-white font-mono mt-1">R$ 199</span>
                        </button>
                        <button
                          type="button" onClick={() => setSelectedPlan("pro")}
                          className={`p-2.5 text-left rounded-xl border flex flex-col justify-between transition-all cursor-pointer ${
                            selectedPlan === "pro" ? "border-emerald-500 bg-emerald-500/5" : "border-border hover:bg-background/25"
                          }`}
                        >
                          <span className="text-[10px] font-bold text-emerald-400">Diamond Pro</span>
                          <span className="text-xs font-black text-white font-mono mt-1">R$ 499</span>
                        </button>
                        <button
                          type="button" onClick={() => setSelectedPlan("platinum")}
                          className={`p-2.5 text-left rounded-xl border flex flex-col justify-between transition-all cursor-pointer ${
                            selectedPlan === "platinum" ? "border-emerald-500 bg-emerald-500/5" : "border-border hover:bg-background/25"
                          }`}
                        >
                          <span className="text-[10px] font-bold text-zinc-400">Supreme PK</span>
                          <span className="text-xs font-black text-white font-mono mt-1">R$ 1.290</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReg}
                    className="w-full h-11 h-10 mt-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black text-xs font-bold uppercase tracking-wider disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 cursor-pointer pt-0.5"
                  >
                    {submittingReg ? (
                      <span className="h-4 w-4 animate-spin rounded-full border border-t-transparent border-black" />
                    ) : (
                      <>
                        Confirmar Credenciamento e Obter Link
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div 
                key="success-step" 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 md:p-12 text-center space-y-6 bg-gradient-to-b from-[#081210]/95 to-background text-zinc-300 relative rounded-3xl"
              >
                <div className="h-14 w-14 rounded-full bg-emerald-500/15 border border-emerald-500/25 grid place-items-center text-emerald-400 mx-auto">
                  <ShieldCheck className="h-7 w-7" />
                </div>

                <div className="space-y-1.5 max-w-lg mx-auto">
                  <h3 className="text-lg font-black text-white">Credenciamento Homologado!</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Seu perfil operacional de distribuidor foi inserido na plataforma All-In Life. Todas as suas comissões e as do seu sponsor <strong className="text-white">@{sponsorSlug}</strong> já estão vinculadas ao seu ledger.
                  </p>
                </div>

                <div className="p-4 border border-emerald-500/15 rounded-xl bg-emerald-500/5 text-[10px] text-muted-foreground font-mono space-y-1.5 max-w-sm mx-auto">
                  <p className="text-left font-sans text-[9px] uppercase tracking-wider text-muted-foreground mb-1 text-center">Assinatura Certificada</p>
                  <div className="flex items-center justify-center gap-1">
                    <Crown className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>SPONSOR_ID: {sponsorSlug.toUpperCase()}</span>
                  </div>
                  <p className="text-[9px] text-emerald-500">Credenciados: {name}</p>
                </div>

                <button
                  onClick={() => {
                    // Redirect directly to plan selection/office activation onboarding!
                    navigate({ to: "/office/plan" });
                  }}
                  className="inline-flex h-11 px-8 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-bold uppercase tracking-wider items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 pt-0.5 cursor-pointer"
                >
                  Entrar no Escritório & Ativar Licença
                  <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-zinc-900 bg-[#040609] py-12 relative z-10 text-xs text-zinc-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <p className="font-semibold text-white uppercase tracking-widest text-[11px]">All-In Life · Sistema de Recrutamento MLM</p>
          <p className="max-w-md mx-auto leading-relaxed">
            All-In Life é a plataforma operacional modular conectada ao ecossistema All-In Brasil e operada sob controle estrito da rede de fundadores originais.
          </p>
          <p className="text-[10px]">Patrocinador legitimado: <span className="text-zinc-400 font-mono">@{sponsorSlug}</span></p>
        </div>
      </footer>
    </div>
  );
}
