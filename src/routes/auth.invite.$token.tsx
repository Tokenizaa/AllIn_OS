import { useState, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useAuth } from "@/modules/auth";
import { 
  Eye, EyeOff, ShieldCheck, Mail, User, Lock, AlertTriangle, 
  ShieldAlert, Sparkles, LogIn, ArrowRight, CheckCircle2, RefreshCw 
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { getRoleLabel, getRoleBadgeStyle } from "@/components/system/user-management";

export const Route = createFileRoute("/auth/invite/$token")({
  component: InviteActivationPage,
});

function InviteActivationPage() {
  const { token } = Route.useParams();
  const navigate = useNavigate();
  const { getAdminInviteByToken, acceptAdminInvite, user: currentUser } = useAuth();

  // Validate current invite
  const [invite, setInvite] = useState<any>(null);
  const [loaded, setLoaded] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Look up token in mock registry
    const match = getAdminInviteByToken(token);
    if (match) {
      setInvite(match);
      setName(match.full_name); // Pre-fill name
    }
    setLoaded(true);
  }, [token, getAdminInviteByToken]);

  // If already logged in, show options to log out first or check
  const handleSignOutAndContinue = async () => {
    // In our mock, logging in automatically overrides session
    window.location.reload();
  };

  const handleRegisterAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Por favor, preencha o seu nome completo.");
      return;
    }

    if (password.length < 6) {
      toast.error("A senha deve conter no mínimo 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("As senhas inseridas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      // Small simulated latency
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await acceptAdminInvite(token, name.trim(), password);
      
      setSuccess(true);
      toast.success("Conta administrativa ativada com sucesso!");
      
      // Redirect after animations complete
      setTimeout(() => {
        navigate({ to: "/" });
      }, 2500);
    } catch (err: any) {
      toast.error(err.message || "Erro ao registrar credenciais.");
    } finally {
      setLoading(false);
    }
  };

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#04060a] text-white">
        <div className="flex flex-col items-center gap-2">
          <RefreshCw className="h-8 w-8 text-primary animate-spin" />
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Validando credenciais segurança...</p>
        </div>
      </div>
    );
  }

  // Handle Token invalid/expired/revoked states
  if (!invite) {
    return (
      <div className="min-h-screen flex text-foreground bg-[#04060a] relative items-center justify-center p-4 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-rose-500/5 blur-[100px] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-2xl border border-rose-500/20 bg-card/60 p-6 backdrop-blur-md shadow-2xl relative z-10 text-center space-y-5"
        >
          <div className="mx-auto h-12 w-12 rounded-full bg-rose-500/10 grid place-items-center border border-rose-500/25">
            <ShieldAlert className="h-6 w-6 text-rose-400" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-bold tracking-tight text-white">Link de Convite Inválido</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              O token de ativação fornecido é inválido, foi cancelado ou expirou o prazo de ativação regulamentar de 48 horas.
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-border bg-[#0b0f19] text-xs leading-relaxed text-muted-foreground text-left space-y-2">
            <p className="font-semibold text-white">O que pode ser feito?</p>
            <ul className="list-disc pl-4 space-y-1 opacity-90 font-mono text-[10px]">
              <li>Solicitar uma nova via de convite ao Admin Master.</li>
              <li>Confirmar se o token foi copiado integralmente sem quebras.</li>
              <li>Acessar com uma conta administrativa já ativada.</li>
            </ul>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Link 
              to="/login"
              className="w-full h-10 inline-flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-750 text-white font-semibold text-xs transition-colors"
            >
              Ir para Tela de Login
            </Link>
            <button
              onClick={() => {
                // Clear state helper to reset local storage so user can test the flows dynamically
                localStorage.removeItem("allin_invites");
                window.location.reload();
              }}
              className="text-[10px] text-primary/70 hover:text-primary transition-colors hover:underline"
            >
              Reiniciar Simulador (Zerar persistência das invites de teste)
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Handle Token display states: pending, revoked, expired, accepted
  if (invite.status !== "pending") {
    const isAccepted = invite.status === "accepted";
    const statusLabel = isAccepted ? "utilizado" : invite.status === "revoked" ? "revogado" : "expirado";
    const statusColor = isAccepted ? "text-emerald-400" : "text-rose-400";

    return (
      <div className="min-h-screen flex text-foreground bg-[#04060a] relative items-center justify-center p-4 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-md shadow-2xl relative z-10 text-center space-y-5"
        >
          <div className="mx-auto h-12 w-12 rounded-full bg-slate-800/80 grid place-items-center border border-border">
            <AlertTriangle className={`h-6 w-6 ${statusColor}`} />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-bold tracking-tight text-white">Convite Inativo</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Este convite gerado para <span className="text-white font-semibold">{invite.email}</span> já está <span className={`font-semibold ${statusColor}`}>{statusLabel}</span>.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Link 
              to="/login"
              className="w-full h-10 inline-flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-750 text-white font-semibold text-xs transition-colors"
            >
              Fazer Login Corporativo
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex text-foreground bg-[#04060a] relative overflow-hidden items-center justify-center p-4">
      {/* Background Decorative Gradients */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-fuchsia-500/5 blur-[120px] pointer-events-none" />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#080c14_1px,transparent_1px),linear-gradient(to_bottom,#080c14_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-40" />

      <div className="w-full max-w-lg z-10 space-y-4">
        {/* Brand logo header */}
        <div className="flex items-center justify-center gap-2.5 mb-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary via-fuchsia-500 to-cyan-400 grid place-items-center text-primary-foreground font-black text-sm shadow">A</div>
          <p className="font-bold tracking-tight text-md text-white">Allin OS</p>
          <span className="text-[9px] text-muted-foreground uppercase tracking-wider font-mono px-1.5 py-0.5 rounded border border-border bg-card/60">Enterprise Staff</span>
        </div>

        {success ? (
          /* Animated success display upon registration finish */
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-emerald-500/20 bg-card/60 p-8 text-center space-y-4 shadow-xl backdrop-blur-md"
          >
            <div className="mx-auto h-12 w-12 rounded-full bg-emerald-500/10 grid place-items-center border border-emerald-500/30">
              <CheckCircle2 className="h-7 w-7 text-emerald-400 animate-bounce" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl font-bold tracking-tight text-white">Verificação Concluída!</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                As credenciais da sua conta administrativa da equipe <span className="font-semibold text-white">Allin OS</span> foram ativadas com absoluto sucesso.
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground/80">
              <RefreshCw className="h-3 w-3 animate-spin text-primary" />
              Sincronizando RBAC e redirecionando ao dashboard principal...
            </div>
          </motion.div>
        ) : (
          /* Standard registration/activation form */
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-border/80 bg-card/60 p-6 shadow-2xl backdrop-blur-md"
          >
            <div className="space-y-1 mr-auto text-left border-b border-border/40 pb-4 mb-4">
              <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
                <Sparkles className="h-3 w-3 animate-pulse" />
                Admissão Administrativa
              </span>
              <h1 className="text-xl font-bold tracking-tight text-white">Ative sua Conta da Equipe</h1>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Bem-vindo à equipe! Complete as informações abaixo para estabelecer sua segurança de acesso.
              </p>
            </div>

            {/* Proposed role details */}
            <div className="mb-4 p-3.5 rounded-xl border border-border/60 bg-[#070a13] flex items-center justify-between">
              <div className="space-y-0.5 text-left">
                <span className="text-[9px] text-muted-foreground uppercase tracking-wider font-mono">Cargo Autorizado:</span>
                <p className="text-sm font-semibold text-white">{getRoleLabel(invite.role)}</p>
              </div>
              <Badge variant="outline" className={`py-1 px-2.5 ${getRoleBadgeStyle(invite.role)}`}>
                RBAC Nível {invite.permissions.length + 1}
              </Badge>
            </div>

            <form onSubmit={handleRegisterAdmin} className="space-y-4">
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                  <User className="h-3 w-3" /> Nome Completo
                </label>
                <Input 
                  placeholder="Seu nome oficial" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-background/40"
                  required
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                  <Mail className="h-3 w-3" /> E-mail de Admissão (Vinculado)
                </label>
                <Input 
                  type="email"
                  value={invite.email}
                  className="bg-background/30 opacity-60 cursor-not-allowed font-mono text-xs"
                  disabled
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                  <Lock className="h-3 w-3" /> Defina sua Senha Corporativa
                </label>
                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo de 6 caracteres" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-background/40 pl-3 pr-9"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                  <Lock className="h-3 w-3" /> Confirme sua Senha
                </label>
                <Input 
                  type={showPassword ? "text" : "password"}
                  placeholder="Redigite a senha corporativa" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-background/40"
                  required
                />
              </div>

              <div className="pt-2">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full text-xs font-semibold py-2 bg-gradient-to-r from-primary to-fuchsia-600 hover:opacity-95 text-white rounded-lg flex items-center justify-center gap-1"
                >
                  {loading ? (
                    <span className="flex items-center gap-1.5">
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      Estruturando credenciais...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      Finalizar Processo de Ativação
                      <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        )}

        <div className="flex justify-between text-[11px] text-muted-foreground px-1">
          <span>Expira em: <strong className="font-mono text-[10px] text-slate-400">{new Date(invite.expires_at).toLocaleString("pt-BR")}</strong></span>
          <Link to="/login" className="hover:text-white hover:underline flex items-center gap-1">
            <LogIn className="h-3 w-3" /> Voltar ao Login
          </Link>
        </div>
      </div>
    </div>
  );
}
