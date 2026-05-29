import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth, normalizeUserRole } from "@/lib/auth-context";
import { ShieldAlert, Award, QrCode, CreditCard, ShoppingBag, Sparkles, CheckCircle, ArrowRight, ClipboardCopy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export const Route = createFileRoute("/ativacao")({
  component: ActivationPage,
});

function ActivationPage() {
  const navigate = useNavigate();
  const { user, loading, activateDistributorOffice, logout } = useAuth();
  
  const [selectedPlan, setSelectedPlan] = useState<string>("plan-pro");
  const [paymentStep, setPaymentStep] = useState<"select" | "checkout" | "processing" | "success">("select");
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "card">("pix");
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  // Redirect if not logged in or already active
  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate({ to: "/login" });
      } else if (normalizeUserRole(user.role) !== "distributor") {
        navigate({ to: "/" });
      } else if (user.status === "active") {
        navigate({ to: "/office" });
      }
    }
  }, [user, loading, navigate]);

  const plans = [
    {
      id: "plan-starter",
      name: "Gold Starter",
      price: 1200.00,
      points: "150 Pontos",
      binary: "10% de Binário",
      description: "Entrada acelerada ideal para novos revendedores.",
      features: [
        "Escritório Virtual Básico",
        "Loja Virtual de Vendas Integrada",
        "Limite Mensal de Saques: R$ 5.000",
        "Acesso a downloads de catálogos",
        "Suporte regular por ticket"
      ],
      color: "from-amber-600 to-amber-400"
    },
    {
      id: "plan-pro",
      name: "Diamond Pro",
      price: 2900.00,
      points: "400 Pontos",
      binary: "20% de Binário",
      description: "O plano mais recomendado para líderes de expansão.",
      features: [
        "Escritório Virtual Profissional Completo",
        "Dashboard de Analytics Avançado",
        "Copiloto IA assistente de rede",
        "Loja Virtual com Cupons Customizáveis",
        "Limite Mensal de Saques: R$ 25.000",
        "Suporte prioritário via WhatsApp"
      ],
      color: "from-primary to-fuchsia-500",
      featured: true
    },
    {
      id: "plan-platinum",
      name: "Platinum Supreme",
      price: 5900.00,
      points: "1000 Pontos",
      binary: "30% de Binário",
      description: "Acesso máximo a comissões residuais e mentoria executiva.",
      features: [
        "Escritório Virtual VIP Premium",
        "Acesso a campanhas globais patrocinadas",
        "Copiloto IA com relatórios preditivos",
        "Subcontas para operadores (RBAC)",
        "Limite Mensal de Saques: SEM LIMITES",
        "Suporte dedicado 24/7 Concierge"
      ],
      color: "from-cyan-500 to-blue-600"
    }
  ];

  const currentPlan = plans.find((p) => p.id === selectedPlan) || plans[1];
  const finalPrice = currentPlan.price - discount;

  const handleApplyCoupon = () => {
    if (coupon.trim().toUpperCase() === "ALLIN10") {
      setDiscount(currentPlan.price * 0.1);
      toast.success("Cupom de 10% de desconto aplicado com sucesso!");
    } else {
      toast.error("Cupom inválido ou expirado.");
    }
  };

  const handleCheckoutInit = () => {
    setPaymentStep("checkout");
  };

  const handleSimulatePayment = () => {
    setPaymentStep("processing");
    setTimeout(async () => {
      try {
        await activateDistributorOffice(selectedPlan);
        setPaymentStep("success");
        toast.success("Pagamento confirmado! Licença comercial ativada.");
      } catch (err: any) {
        toast.error(err.message || "Erro ao realizar ativação.");
        setPaymentStep("checkout");
      }
    }, 2500);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#04060a]">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-foreground bg-[#04060a] relative overflow-hidden py-12 px-4 md:px-8">
      {/* Background aesthetics */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-fuchsia-500/5 blur-[120px] pointer-events-none" />

      {/* Title */}
      <div className="max-w-[1240px] mx-auto text-center space-y-3 mb-12">
        <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold bg-primary/15 text-primary border border-primary/20">
          <Award className="h-3.5 w-3.5" />
          Onboarding de Distribuidor Autorizado
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
          Ativação de Escritório Digital
        </h1>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          Olá, <strong className="text-white">{user.name}</strong>. Para assumir sua posição na matriz binária do Allin OS e começar a lucrar com sua rede de vendas, adquira sua licença empresarial inicial.
        </p>

        <div className="flex justify-center gap-3 pt-4">
          <button 
            onClick={logout}
            className="text-xs px-4 py-1.5 rounded-lg border border-border/60 hover:bg-border/30 text-muted-foreground hover:text-white transition-colors cursor-pointer"
          >
            Sair da Conta (Fazer outro Login)
          </button>
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto relative z-10">
        <AnimatePresence mode="wait">
          {paymentStep === "select" && (
            <motion.div
              key="step-select"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Plans Grid */}
              <div className="grid md:grid-cols-3 gap-6 items-stretch">
                {plans.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPlan(p.id)}
                    className={`relative rounded-2xl border transition-all cursor-pointer p-6 flex flex-col justify-between ${
                      selectedPlan === p.id
                        ? "border-primary bg-primary/5 shadow-2xl shadow-primary/10"
                        : "border-border/65 bg-[#090d16]/75 hover:border-border"
                    } ${p.featured ? "md:scale-105" : ""}`}
                  >
                    {p.featured && (
                      <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-fuchsia-500 px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
                        Mais Recomendado
                      </span>
                    )}

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1.5">{p.name}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">{p.description}</p>
                      </div>

                      <div className="bg-background/40 py-2.5 px-3.5 rounded-lg border border-border/40 flex justify-between items-center text-xs">
                        <span className="text-emerald-400 font-semibold">{p.binary}</span>
                        <span className="text-primary font-bold uppercase tracking-wider">{p.points}</span>
                      </div>

                      <div className="py-2">
                        <span className="text-3xl font-extrabold text-white">R$ {p.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                        <span className="text-xs text-muted-foreground block mt-1">Taxa única de licenciamento anual</span>
                      </div>

                      <div className="border-t border-border/40 pt-4 space-y-2.5">
                        {p.features.map((f, idx) => (
                          <div key={idx} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                            <span className="h-4 w-4 rounded-full bg-primary/10 text-primary grid place-items-center shrink-0 text-[10px] font-bold">✓</span>
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 mt-4">
                      <button
                        type="button"
                        className={`w-full py-2.5 rounded-lg text-xs font-bold transition-all ${
                          selectedPlan === p.id
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                            : "bg-background/60 hover:bg-background border border-border text-white"
                        }`}
                      >
                        {selectedPlan === p.id ? "Pacote Selecionado" : "Selecionar Licença"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action */}
              <div className="flex justify-center pt-4">
                <button
                  onClick={handleCheckoutInit}
                  className="rounded-xl bg-gradient-to-r from-primary to-fuchsia-500 hover:from-primary/90 hover:to-fuchsia-500/90 text-primary-foreground py-3.5 px-12 text-sm font-bold tracking-wide shadow-lg shadow-primary/20 flex items-center gap-2.5 transition-all cursor-pointer"
                >
                  Seguir para Pagamento de Ativação
                  <ArrowRight className="h-4.5 w-4.5" />
                </button>
              </div>
            </motion.div>
          )}

          {paymentStep === "checkout" && (
            <motion.div
              key="step-checkout"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="max-w-4xl mx-auto rounded-2xl border border-border/80 bg-[#090d16]/90 p-6 md:p-8 backdrop-blur-md grid md:grid-cols-5 gap-8 shadow-2xl"
            >
              {/* Left Column: Summary */}
              <div className="md:col-span-2 space-y-6 md:border-r md:border-border/60 md:pr-8">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Resumo do Pedido</h3>
                  <div className="mt-3 p-4 rounded-xl bg-background/50 border border-border/40 space-y-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground font-mono">Licença Comercial:</span>
                      <strong className="text-white">{currentPlan.name}</strong>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground font-mono">Pontuação Unilevel:</span>
                      <strong className="text-primary">{currentPlan.points}</strong>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground font-mono">Binário Configurado:</span>
                      <strong className="text-emerald-400">{currentPlan.binary}</strong>
                    </div>
                    
                    <div className="border-t border-border/40 pt-3 flex justify-between items-center text-xs">
                      <span className="text-muted-foreground font-mono">Preço Base:</span>
                      <span className="text-white">R$ {currentPlan.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between items-center text-xs text-rose-400">
                        <span>Desconto aplicado:</span>
                        <span>- R$ {discount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                      </div>
                    )}

                    <div className="border-t border-border/40 pt-3 flex justify-between items-center">
                      <span className="text-xs font-bold text-white uppercase">Total Geral:</span>
                      <strong className="text-xl text-primary font-extrabold">R$ {finalPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</strong>
                    </div>
                  </div>
                </div>

                {/* Coupon component */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Possui um Cupom de Desconto?</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      className="flex-1 h-9 px-3 rounded-lg border border-border/60 bg-background/50 text-xs text-white uppercase font-mono"
                      placeholder="Cupom: ALLIN10"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="bg-primary/25 hover:bg-primary/35 border border-primary/35 text-primary text-xs font-bold rounded-lg px-3.5 transition-colors cursor-pointer"
                    >
                      Aplicar
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setPaymentStep("select")}
                  className="w-full text-center text-xs text-muted-foreground hover:text-white underline transition-colors pt-2 block font-mono"
                >
                  ← Alterar plano selecionado
                </button>
              </div>

              {/* Right Column: Payment Form */}
              <div className="md:col-span-3 space-y-6">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Escolha o Método de Pagamento</h3>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <button
                      onClick={() => setPaymentMethod("pix")}
                      className={`h-11 rounded-lg border flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wide transition-all cursor-pointer ${
                        paymentMethod === "pix"
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border/60 hover:bg-background/40 text-muted-foreground"
                      }`}
                    >
                      <QrCode className="h-4 w-4" />
                      PIX Instantâneo
                    </button>
                    <button
                      onClick={() => setPaymentMethod("card")}
                      className={`h-11 rounded-lg border flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wide transition-all cursor-pointer ${
                        paymentMethod === "card"
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border/60 hover:bg-background/40 text-muted-foreground"
                      }`}
                    >
                      <CreditCard className="h-4 w-4" />
                      Cartão de Crédito
                    </button>
                  </div>
                </div>

                {paymentMethod === "pix" ? (
                  <div className="bg-[#0e1422]/60 border border-border/50 rounded-xl p-5 text-center space-y-4">
                    <div className="inline-block bg-white p-3.5 rounded-xl mb-1 shadow-lg shadow-white/5">
                      {/* Fake QrCode */}
                      <div className="h-32 w-32 border border-slate-200 bg-slate-100 flex items-center justify-center text-slate-800 font-bold p-1">
                        <div className="grid grid-cols-4 gap-1 w-full h-full p-2 opacity-85">
                          {Array.from({ length: 16 }).map((_, i) => (
                            <div key={i} className={`rounded-sm ${(i % 3 === 0 || i % 7 === 1) ? "bg-slate-900" : "bg-transparent"}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-white uppercase">Chave Copia e Cola Gerada</p>
                      <p className="text-[10px] text-muted-foreground font-mono truncate max-w-[280px] mx-auto bg-background/50 px-2.5 py-1 rounded border border-border/40">
                        00020126580014br.gov.bcb.pix0136allinos-payment-gateway-pix-120000bc
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        toast.success("Código Copia e Cola salvo na área de transferência!");
                      }}
                      className="text-xs text-primary font-mono inline-flex items-center gap-1.5 hover:underline"
                    >
                      <ClipboardCopy className="h-3.5 w-3.5" /> Copiar Código Pix
                    </button>
                    <p className="text-[10px] text-muted-foreground max-w-xs mx-auto">
                      O pagamento Pix é verificado de forma automatizada pelo gateway All-In. Após efetuar a simulação, clique em "Confirmar Pagamento Simulado".
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Número do cartão</label>
                      <input
                        type="text"
                        disabled
                        className="w-full h-9 px-3 rounded-lg border border-border/40 bg-background/40 text-xs text-white"
                        value="••••  ••••  ••••  5592 (Cartão corporativo pré-carregado)"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Expiração</label>
                        <input
                          type="text"
                          disabled
                          className="w-full h-9 px-3 rounded-lg border border-border/40 bg-background/40 text-xs text-white"
                          value="04/2030"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">CVC</label>
                        <input
                          type="password"
                          disabled
                          className="w-full h-9 px-3 rounded-lg border border-border/40 bg-background/40 text-xs text-white"
                          value="•••"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleSimulatePayment}
                  className="w-full h-11 mt-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-500/20 cursor-pointer pt-0.5"
                >
                  Confirmar Pagamento Simulado (R$ {finalPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2 })})
                </button>
              </div>
            </motion.div>
          )}

          {paymentStep === "processing" && (
            <motion.div
              key="step-processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-md mx-auto text-center py-12 space-y-4"
            >
              <div className="relative flex items-center justify-center mx-auto h-20 w-20">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-t-emerald-500 border-r-transparent border-b-transparent border-l-transparent" />
                <div className="absolute h-10 w-10 animate-pulse rounded-full bg-emerald-500/10" />
              </div>
              <h3 className="text-lg font-bold text-white">Processando com o Gateway...</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Consultando o banco de dados do Banco Central e as chaves Pix associadas para o All-In. Aguarde a validação da transação unificada.
              </p>
            </motion.div>
          )}

          {paymentStep === "success" && (
            <motion.div
              key="step-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto text-center border border-emerald-500/30 bg-[#081210]/95 p-8 rounded-2xl shadow-emerald-500/10 shadow-2xl space-y-6"
            >
              <div className="h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 grid place-items-center text-emerald-400 mx-auto">
                <CheckCircle className="h-8 w-8 text-emerald-400" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Membro Ativo All-In!</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Licença <strong className="text-white">{currentPlan.name}</strong> confirmada com sucesso! Seu nó na rede MLM foi estruturado e ativado, e sua carteira de bônus inicial já está pronta.
                </p>
              </div>

              <button
                onClick={() => navigate({ to: "/office" })}
                className="w-full h-10 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer pt-0.5"
              >
                Acessar Meu Backoffice
                <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
