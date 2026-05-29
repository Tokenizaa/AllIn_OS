import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Area, AreaChart } from "recharts";
import { Copy, Share2, QrCode, Sparkles, ExternalLink, Eye, ShoppingCart, Percent, Award, CreditCard, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/distributor/stat-card";
import { distributor, storeAnalytics, formatBRL } from "@/lib/distributor-data";
import { useAuth } from "@/lib/auth-context";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export const Route = createFileRoute("/office/store")({ component: StorePage });

const SHOP_PRODUCTS = [
  {
    id: "prod-vita",
    name: "Vita Complex Multi-Mineral Capsule (90 Caps)",
    category: "Nutracêuticos",
    price: 180.00,
    points: 25,
    commission: 45.00,
    description: "Multivitamínico quelato com alta taxa de absorção celular e ativos anti-fadiga.",
    image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "prod-skin",
    name: "Skin Renew Anti-Age Peptide Elixir (50ml)",
    category: "Estética Avançada",
    price: 240.00,
    points: 40,
    commission: 60.00,
    description: "Sérum intensivo de peptídeos bioativos e colágeno para restauração cutânea imediata.",
    image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "prod-slim",
    name: "Slim Pro Termogênico Natural Ativo (250g)",
    category: "Performance & Nutrição",
    price: 310.00,
    points: 50,
    commission: 80.00,
    description: "Blend em pó termogênico de guaraná, chá verde e gengibre para aceleração metabólica.",
    image: "https://images.unsplash.com/photo-1512152272829-e3139592d56f?auto=format&fit=crop&q=80&w=200",
  }
];

function StorePage() {
  const { user, addAuditLog, triggerBinomialBonusPay } = useAuth();
  const isCustomer = user?.role === "customer";

  // Customer Shopping states
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [checkoutStep, setCheckoutStep] = useState<"shop" | "payment" | "processing" | "success">("shop");
  const [couponCode, setCouponCode] = useState("");
  const [discountValue, setDiscountValue] = useState(0);
  const [paymentType, setPaymentType] = useState<"pix" | "card">("pix");

  const handleApplyCoupon = () => {
    if (couponCode.trim().toUpperCase() === "ALLIN10") {
      if (selectedProduct) {
        setDiscountValue(selectedProduct.price * 0.1);
        toast.success("Cupom de 10% aplicado!");
      }
    } else {
      toast.error("Cupom inválido.");
    }
  };

  const handleStartCheckout = (prod: any) => {
    setSelectedProduct(prod);
    setDiscountValue(0);
    setCouponCode("");
    setCheckoutStep("payment");
  };

  const handleConfirmPurchase = () => {
    setCheckoutStep("processing");

    setTimeout(async () => {
      try {
        const finalValue = selectedProduct.price - discountValue;
        const sponsorId = user?.sponsor_id || "marcus_lider_platinum";

        // Pay virtual commission and points via context call simulation
        await triggerBinomialBonusPay(selectedProduct.points, selectedProduct.commission, finalValue);

        // Add a permanent Audit Log visible inside system dashboard
        addAuditLog({
          id: `tx-${Math.random().toString(36).substring(3, 11)}`,
          action: "PAY_ORDER",
          userId: user?.id || "guest-id",
          userName: user?.name || "Clinte Final",
          userRole: "customer",
          module: "orders",
          details: `Compra do item ${selectedProduct.name}. Valor: R$ ${finalValue.toFixed(2)}. Atribuindo ${selectedProduct.points} pontos de binário e comissão de R$ ${selectedProduct.commission.toFixed(2)} sob o sponsor ID [${sponsorId}].`,
          ip: "186.220.12.92",
          hash: `sha256-${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`
        });

        setCheckoutStep("success");
        toast.success("Compra realizada! Comissões vinculadas instantaneamente.");
      } catch (err: any) {
        toast.error("Erro no gateway de vendas.");
        setCheckoutStep("shop");
      }
    }, 2800);
  };

  // 1. RENDER FOR END CUSTOMERS (ONLINE SHOPPING EXPERIENCE)
  if (isCustomer) {
    const totalAmount = selectedProduct ? (selectedProduct.price - discountValue) : 0;

    return (
      <div className="space-y-6">
        <div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 mb-1.5 uppercase font-mono tracking-wider">
            Consumidor Autorizado
          </span>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Loja All-In Life</h1>
          <p className="text-xs text-muted-foreground">Produtos premium patenteados de nutrição e estética vinculados à sua rede patrocinadora.</p>
        </div>

        <AnimatePresence mode="wait">
          {checkoutStep === "shop" && (
            <motion.div
              key="shop-grid"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid md:grid-cols-3 gap-6"
            >
              {SHOP_PRODUCTS.map((prod) => (
                <div key={prod.id} className="rounded-2xl border border-border/65 bg-[#090d16]/80 overflow-hidden flex flex-col justify-between hover:border-border transition-all">
                  <div className="p-1">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-44 object-cover rounded-xl opacity-90"
                    />
                  </div>
                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold tracking-wider uppercase bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-md">
                          {prod.category}
                        </span>
                        <span className="text-[10px] font-bold font-mono text-emerald-400">+{prod.points} PONTOS MLM</span>
                      </div>
                      <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug">{prod.name}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{prod.description}</p>
                    </div>

                    <div className="space-y-3.5 pt-4 border-t border-border/50">
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs text-muted-foreground font-mono">Valor Comercial:</span>
                        <strong className="text-lg font-extrabold text-white">R$ {prod.price.toFixed(2)}</strong>
                      </div>

                      <button
                        onClick={() => handleStartCheckout(prod)}
                        className="w-full h-9 rounded-lg bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer pt-0.5"
                      >
                        <ShoppingCart className="h-3.5 w-3.5" />
                        Comprar Agora
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {checkoutStep === "payment" && (
            <motion.div
              key="checkout-card"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-3xl mx-auto rounded-2xl border border-border bg-[#090d16]/95 p-6 md:p-8 shadow-2xl space-y-6"
            >
              <div className="flex justify-between items-center border-b border-border/50 pb-4">
                <h2 className="text-md font-bold text-white">Finalização de Compra (Checkout Inteligente)</h2>
                <button
                  onClick={() => setCheckoutStep("shop")}
                  className="text-xs text-muted-foreground hover:text-white underline font-mono cursor-pointer"
                >
                  Voltar à vitrine
                </button>
              </div>

              <div className="grid md:grid-cols-5 gap-6">
                {/* Left col: item details */}
                <div className="md:col-span-2 space-y-4 md:border-r md:border-border/50 md:pr-6">
                  <div className="p-3 bg-background/50 rounded-xl border border-border/40 space-y-2">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider font-mono">Item Selecionado</p>
                    <p className="text-xs font-bold text-white leading-tight">{selectedProduct.name}</p>
                    <p className="text-[10px] text-primary font-bold">+{selectedProduct.points} Pontos MLM associados</p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-1">
                    <p className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider font-mono">Sponsor Vinculado</p>
                    <p className="text-xs text-white">Suas compras geram <strong className="text-emerald-400">R$ {selectedProduct.commission.toFixed(2)}</strong> de cashback imediato para seu patrocinador:</p>
                    <p className="text-xs font-mono font-bold text-white mt-1 hover:underline">@{user?.sponsor_id || "marcus"}</p>
                  </div>
                </div>

                {/* Right col: pricing + coupon + pay */}
                <div className="md:col-span-3 space-y-4">
                  {/* Coupon section */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest block">Código de Cupom</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1 h-8 px-3 rounded-lg border border-border bg-background/50 text-xs text-white uppercase font-mono"
                        placeholder="Cupom: ALLIN10"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        className="h-8 px-4 rounded-lg bg-primary/20 hover:bg-primary/30 border border-primary/30 text-primary text-xs font-bold font-mono cursor-pointer"
                      >
                        Aplicar
                      </button>
                    </div>
                  </div>

                  {/* Price calculations */}
                  <div className="space-y-1.5 p-3 rounded-xl bg-background/40 border border-border/40 text-xs font-mono">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal:</span>
                      <span className="text-white">R$ {selectedProduct.price.toFixed(2)}</span>
                    </div>
                    {discountValue > 0 && (
                      <div className="flex justify-between text-rose-400">
                        <span>Desconto (ALLIN10):</span>
                        <span>- R$ {discountValue.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t border-border/40 pt-2 flex justify-between font-bold text-sm">
                      <span className="text-white font-sans font-bold">Total Geral:</span>
                      <span className="text-primary font-extrabold">R$ {totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Payment selector */}
                  <div className="space-y-2 pt-2">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest block font-mono">Método de Liquidação</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setPaymentType("pix")}
                        className={`py-2 px-3 text-xs font-semibold rounded-lg border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          paymentType === "pix" ? "border-primary bg-primary/10 text-primary" : "border-border/60 hover:bg-background/20 text-muted-foreground"
                        }`}
                      >
                        <QrCode className="h-3.5 w-3.5" /> Pix Instantâneo
                      </button>
                      <button
                        onClick={() => setPaymentType("card")}
                        className={`py-2 px-3 text-xs font-semibold rounded-lg border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          paymentType === "card" ? "border-primary bg-primary/10 text-primary" : "border-border/60 hover:bg-background/20 text-muted-foreground"
                        }`}
                      >
                        <CreditCard className="h-3.5 w-3.5" /> Cartão Integrado
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleConfirmPurchase}
                    className="w-full h-10 mt-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 pt-0.5 cursor-pointer"
                  >
                    Confirmar Compra (R$ {totalAmount.toFixed(2)})
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {checkoutStep === "processing" && (
            <motion.div
              key="processing-card"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-md mx-auto text-center py-16 space-y-4 rounded-2xl border border-border bg-[#090d16]/80"
            >
              <div className="h-12 w-12 rounded-full border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin mx-auto" />
              <h3 className="text-sm font-bold text-white">Segurando Gateway de Pagamento...</h3>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto text-center leading-relaxed font-sans">
                Liquidanado operação junto aos nós do Bacen. Distribuindo univel e pontuação da rede em cascata binária.
              </p>
            </motion.div>
          )}

          {checkoutStep === "success" && (
            <motion.div
              key="success-card"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto text-center border border-emerald-500/30 bg-[#081210]/95 p-8 rounded-2xl shadow-emerald-500/10 shadow-2xl space-y-5"
            >
              <div className="h-12 w-12 rounded-full bg-emerald-500/15 border border-emerald-500/25 grid place-items-center text-emerald-400 mx-auto">
                <CheckCircle2 className="h-6 w-6" />
              </div>

              <div className="space-y-1">
                <h3 className="text-md font-bold text-white">Entrega Registrada no Ledger!</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  O item <strong className="text-white">{selectedProduct.name}</strong> foi liquidado. A comissão de <strong className="text-emerald-400">R$ {selectedProduct.commission.toFixed(2)}</strong> foi distribuída e auditada sob o ID do sponsor.
                </p>
              </div>

              <div className="p-3 border border-border/45 rounded-lg bg-background/50 text-[10px] text-muted-foreground font-mono space-y-1 select-all">
                <p className="text-left font-sans text-[9px] uppercase tracking-wider text-muted-foreground mb-1">Assinatura de Operação Digital Cryptográfica</p>
                <div className="flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">BLOCK_HASH: sha256-{Math.random().toString(36).substring(3, 11)}...</span>
                </div>
              </div>

              <button
                onClick={() => setCheckoutStep("shop")}
                className="w-full h-9 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
              >
                Voltar Para Vitrina
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // 2. DEFAULT RENDER FOR DISTRIBUTORS (Original Sales Portal & Analytics Dashboard)
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Loja Virtual</h1>
        <p className="text-sm text-muted-foreground">Sua vitrine personalizada, analytics e criativos prontos.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Personal Landing link */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card/40 p-5 space-y-3">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-primary">Sítio Pessoal</span>
            <p className="mt-1 font-mono text-sm truncate">/{user?.referral_code || "marcus"}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => { 
              const link = `${window.location.origin}/${user?.referral_code || "marcus"}`;
              navigator.clipboard.writeText(link); 
              toast.success("Link pessoal copiado!"); 
            }}>
              Copiar Link
            </Button>
            <a 
              href={`/${user?.referral_code || "marcus"}`} 
              target="_blank" 
              className="inline-flex items-center justify-center rounded-lg border border-input bg-background px-3 text-xs hover:bg-accent hover:text-accent-foreground"
            >
              Acessar
            </a>
          </div>
        </div>

        {/* Store link */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card/40 p-5 space-y-3">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#a855f7]">Virtual Store</span>
            <p className="mt-1 font-mono text-sm truncate">/loja/{user?.referral_code || "marcus"}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => { 
              const link = `${window.location.origin}/loja/${user?.referral_code || "marcus"}`;
              navigator.clipboard.writeText(link); 
              toast.success("Link da loja copiado!"); 
            }}>
              Copiar Link
            </Button>
            <a 
              href={`/loja/${user?.referral_code || "marcus"}`} 
              target="_blank" 
              className="inline-flex items-center justify-center rounded-lg border border-input bg-background px-3 text-xs hover:bg-accent hover:text-accent-foreground"
            >
              Acessar
            </a>
          </div>
        </div>

        {/* Recruitment link */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card/40 p-5 space-y-3">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">Recrutamento MLM</span>
            <p className="mt-1 font-mono text-sm truncate">/seja-distribuidor/{user?.referral_code || "marcus"}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => { 
              const link = `${window.location.origin}/seja-distribuidor/${user?.referral_code || "marcus"}`;
              navigator.clipboard.writeText(link); 
              toast.success("Link de captação copiado!"); 
            }}>
              Copiar Link
            </Button>
            <a 
              href={`/seja-distribuidor/${user?.referral_code || "marcus"}`} 
              target="_blank" 
              className="inline-flex items-center justify-center rounded-lg border border-input bg-background px-3 text-xs hover:bg-accent hover:text-accent-foreground"
            >
              Acessar
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Visitas no mês" value={storeAnalytics.visitas_mes.toLocaleString("pt-BR")} delta={storeAnalytics.visitas_var} icon={Eye} accent="info" />
        <StatCard label="Conversão" value={`${storeAnalytics.conversao}%`} delta={storeAnalytics.conversao_var} accent="success" />
        <StatCard label="Vendas via link" value={String(storeAnalytics.vendas_link)} delta={storeAnalytics.vendas_var} icon={ShoppingCart} accent="primary" />
        <StatCard label="Ticket médio" value={formatBRL(storeAnalytics.ticket_medio)} delta={3.1} accent="warning" />
      </div>

      <div className="rounded-2xl border border-border/60 bg-card/60 p-5">
        <h3 className="text-sm font-semibold">Visitas & vendas · últimos 14 dias</h3>
        <div className="h-64 mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={storeAnalytics.share_chart}>
              <defs>
                <linearGradient id="sv" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
              <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="visitas" stroke="var(--color-primary)" fill="url(#sv)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-5">
        <div className="flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-primary mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold">Copiloto gerou 3 textos de venda para você</h3>
            <p className="mt-1 text-xs text-muted-foreground">Baseados nos seus produtos mais convertidos esta semana.</p>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
              {["Stories Vita Complex", "Reels Skin Renew", "WhatsApp Slim Pro"].map((t) => (
                <button key={t} className="rounded-lg border border-border/60 bg-background/40 p-3 text-left text-xs hover:border-primary/50 transition-colors">
                  <p className="font-medium">{t}</p>
                  <p className="mt-0.5 text-muted-foreground">Pronto para compartilhar →</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
