import { useState, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useAuth, normalizeUserRole } from "@/lib/auth-context";
import { Eye, EyeOff, Sparkles, LogIn, CheckCircle2, Crown, Users, Wallet, Headphones } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { PublicSiteHeader } from "@/components/public/site-header";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { login, user, activeSponsor } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // If already logged in, redirect based on their role
  useEffect(() => {
    if (!user) return;

    const role = normalizeUserRole(user.role);

    if (role === "distributor") {
      if (user.status === "pending") {
        navigate({ to: "/ativacao" });
      } else {
        navigate({ to: "/office" });
      }
    } else if (role === "customer") {
      navigate({ to: "/office/store" }); // Redirect customers to virtual store product panel
    } else {
      // admin, finance, support
      navigate({ to: "/" });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      const loggedUser = await login(email, password);
      toast.success(`Bem-vindo de volta, ${loggedUser.name}!`);
      const role = normalizeUserRole(loggedUser.role);
      if (role === "distributor") {
        navigate({ to: loggedUser.status === "pending" ? "/ativacao" : "/office" });
      } else if (role === "customer") {
        navigate({ to: "/office/store" });
      } else {
        navigate({ to: "/" });
      }
    } catch (err: any) {
      toast.error(err.message || "Erro ao efetuar login.");
    } finally {
      setLoading(false);
    }
  };

  // Quick Account Login Helper (for testing purposes)
  const handleQuickLogin = async (roleEmail: string, rolePass: string, label: string) => {
    setEmail(roleEmail);
    setPassword(rolePass);
    setLoading(true);
    try {
      const loggedUser = await login(roleEmail, rolePass);
      toast.success(`Acessado como: ${label}`);
      const role = normalizeUserRole(loggedUser.role);
      if (role === "distributor") {
        navigate({ to: loggedUser.status === "pending" ? "/ativacao" : "/office" });
      } else if (role === "customer") {
        navigate({ to: "/office/store" });
      } else {
        navigate({ to: "/" });
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex text-foreground bg-[#04060a] relative overflow-hidden">
      <PublicSiteHeader />
      {/* Background Decorative Gradients */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-fuchsia-500/5 blur-[120px] pointer-events-none" />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#080c14_1px,transparent_1px),linear-gradient(to_bottom,#080c14_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-40" />

      {/* Left side: Enterprise Brand Teaser */}
      <div className="hidden lg:flex lg:w-[45%] flex-col justify-between p-12 border-r border-border/40 relative z-10 bg-[#060910]/45">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary via-fuchsia-500 to-cyan-400 grid place-items-center text-primary-foreground font-black shadow-lg shadow-primary/20">A</div>
          <p className="font-bold tracking-tight text-xl bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">Allin OS</p>
        </div>

        <div className="space-y-6 my-auto max-w-md">
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold bg-primary/15 text-primary border border-primary/20">
            <Sparkles className="h-3 w-3 animate-pulse" />
            Operação Unificada Global
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight text-white font-sans [text-shadow:0_2px_10px_rgba(0,0,0,0.5)]">
            A infraestrutura inteligente para operações MLM & SaaS.
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Gerencie redes de distribuição de alta velocidade, calcule bônus em tempo real e integre comércio inteligente com auditoria de dados imutável.
          </p>

          <div className="space-y-3.5 pt-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground"><strong className="text-foreground">RBAC Granular:</strong> Permissões limitadas e perfis independentes para suporte, financeiro e distribuidores.</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground"><strong className="text-foreground">RLS Native:</strong> Políticas de Row-Level Security que garantem isolamento hierárquico absoluto.</p>
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground flex items-center gap-2 font-mono">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Servidor Conectado • SSL v3.4 Encrypted
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 relative z-10">
        <div className="w-full max-w-[420px] space-y-8">
          {/* Header */}
          <div className="text-center lg:text-left space-y-2">
            <div className="lg:hidden flex justify-center mb-6">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary via-fuchsia-500 to-cyan-400 grid place-items-center text-primary-foreground font-black shadow-lg">A</div>
            </div>

            {activeSponsor && (
              <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-xs text-emerald-400 mx-auto lg:mx-0">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                Referência Ativa: <strong className="text-white hover:underline uppercase">@{activeSponsor}</strong>
              </div>
            )}

            <h2 className="text-2xl font-bold tracking-tight text-white font-sans">Acesse o Allin OS</h2>
            <p className="text-xs text-muted-foreground">Insira as credenciais corporativas ou escolha um perfil demo abaixo.</p>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl border border-border/60 bg-[#090d16]/80 p-6 shadow-2xl backdrop-blur-md space-y-6"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">E-mail corporativo</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-lg border border-border/60 bg-background/50 text-sm placeholder-muted-foreground focus:outline-none focus:border-primary/80 transition-all text-white font-mono"
                  placeholder="admin@allin.io"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">Chave de acesso</label>
                  <Link to="/recuperar-senha" className="text-[11px] text-primary hover:underline font-semibold">Esqueceu a senha?</Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-10 pl-3.5 pr-10 rounded-lg border border-border/60 bg-background/50 text-sm placeholder-muted-foreground focus:outline-none focus:border-primary/80 transition-all text-white"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-2.5 text-muted-foreground hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5 bg-backgroundaccent"
                />
                <label htmlFor="remember" className="text-xs text-muted-foreground select-none cursor-pointer">Lembrar sessão por 30 dias</label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-10 rounded-lg bg-primary hover:bg-primary/95 text-primary-foreground text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/25 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Validando...
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    Entrar na Plataforma
                  </>
                )}
              </button>
            </form>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-border/50"></div>
              <span className="flex-shrink mx-3 text-[10px] text-muted-foreground/60 uppercase font-mono">Enterprise Demo Access</span>
              <div className="flex-grow border-t border-border/50"></div>
            </div>

            {/* Quick Demo Selector */}
            <div className="space-y-2">
              <p className="text-[10px] text-center text-muted-foreground block font-semibold uppercase tracking-wider">Selecione uma Role de simulação:</p>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => handleQuickLogin("admin@allin.io", "admin123", "Admin Master")}
                  className="flex items-center gap-1.5 p-1.5 text-[11px] text-left border border-border/40 hover:border-primary/40 bg-background/25 rounded-md transition-colors text-white"
                >
                  <Crown className="h-3 w-3 text-amber-400 shrink-0" />
                  <span className="truncate">Admin Master</span>
                </button>
                <button
                  onClick={() => handleQuickLogin("finance@allin.io", "finance123", "Financeiro")}
                  className="flex items-center gap-1.5 p-1.5 text-[11px] text-left border border-border/40 hover:border-primary/40 bg-background/25 rounded-md transition-colors text-white"
                >
                  <Wallet className="h-3 w-3 text-primary shrink-0" />
                  <span className="truncate">Gestão Finanças</span>
                </button>
                <button
                  onClick={() => handleQuickLogin("support@allin.io", "support123", "Suporte")}
                  className="flex items-center gap-1.5 p-1.5 text-[11px] text-left border border-border/40 hover:border-primary/40 bg-background/25 rounded-md transition-colors text-white"
                >
                  <Headphones className="h-3 w-3 text-cyan-400 shrink-0" />
                  <span className="truncate">Suporte Técnico</span>
                </button>
                <button
                  onClick={() => handleQuickLogin("distributor@allin.io", "distributor123", "Distribuidor")}
                  className="flex items-center gap-1.5 p-1.5 text-[11px] text-left border border-border/40 hover:border-primary/40 bg-background/25 rounded-md transition-colors text-white"
                >
                  <Users className="h-3 w-3 text-fuchsia-400 shrink-0" />
                  <span className="truncate">Distribuidor</span>
                </button>
              </div>

              <button
                onClick={() => handleQuickLogin("customer@allin.io", "client123", "Cliente")}
                className="w-full flex items-center justify-center gap-1.5 p-1.5 text-[11px] border border-border/40 hover:border-primary/40 bg-background/25 rounded-md transition-colors text-white"
              >
                <Users className="h-3 w-3 text-emerald-400 shrink-0" />
                <span>Cliente Final (Simulação de Checkout e Referral)</span>
              </button>
            </div>
          </motion.div>

          {/* Footer Text */}
          <p className="text-center text-xs text-muted-foreground">
            Novo distribuidor?{" "}
            <Link to="/cadastro" className="text-primary hover:underline font-semibold">Criar Conta Comercial</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
