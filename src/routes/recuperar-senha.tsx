import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { ShieldCheck, Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { PublicSiteHeader } from "@/components/public/site-header";

export const Route = createFileRoute("/recuperar-senha")({
  component: RecoverPasswordPage,
});

function RecoverPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { auditLogs } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Por favor, preencha o campo de e-mail.");
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setLoading(false);
    setSent(true);
    toast.success("E-mail de redefinição enviado com sucesso (simulado).");
  };

  return (
    <div className="min-h-screen flex text-foreground bg-[#04060a] relative overflow-hidden py-12 px-4 flex-col justify-center items-center">
      <PublicSiteHeader />
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[130px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#080c14_1px,transparent_1px),linear-gradient(to_bottom,#080c14_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-40" />

      <div className="w-full max-w-[420px] space-y-8 relative z-10">
        <div className="text-center space-y-2">
          <Link to="/login" className="inline-flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary via-fuchsia-500 to-cyan-400 grid place-items-center text-primary-foreground font-black text-xs">A</div>
            <p className="font-bold tracking-tight text-md text-white">Allin OS</p>
          </Link>
          <h2 className="text-xl font-bold tracking-tight text-white font-sans mt-4">Recuperar Chave de Acesso</h2>
          <p className="text-xs text-muted-foreground">Insira seu email corporativo cadastrado para receber as instruções de recuperação de segurança.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl border border-border/60 bg-[#090d16]/85 p-6 shadow-2xl backdrop-blur-md"
        >
          {sent ? (
            <div className="space-y-4 text-center py-4">
              <div className="h-12 w-12 rounded-full bg-emerald-500/15 border border-emerald-500/25 grid place-items-center text-emerald-400 mx-auto">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-white">Link enviado com sucesso!</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Enviamos um código de segurança privado para <strong className="text-white">{email}</strong>. Siga as instruções descritas no corpo do e-mail.
                </p>
              </div>
              
              <div className="pt-2">
                <Link
                  to="/redefinir-senha"
                  className="w-full h-9 rounded-lg bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer pt-0.5"
                >
                  Seguir para Redefinição de Senha
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">E-mail Cadastrado</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-9 px-3.5 rounded-lg border border-border/60 bg-background/50 text-xs placeholder-muted-foreground focus:outline-none focus:border-primary/80 transition-all text-white font-mono"
                  placeholder="Seu email cadastrado"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-9 rounded-lg bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-primary/25 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer pt-0.5"
              >
                {loading ? "Enviando link..." : "Receber Link de Recuperação"}
              </button>
            </form>
          )}
        </motion.div>

        <p className="text-center text-xs text-muted-foreground">
          Voltar para o{" "}
          <Link to="/login" className="text-primary hover:underline font-semibold">Login Principal</Link>
        </p>
      </div>
    </div>
  );
}
