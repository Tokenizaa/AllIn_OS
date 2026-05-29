import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate, useParams, useLocation } from "@tanstack/react-router";
import { useAuth } from "@/modules/auth";
import { useDistributor } from "@/lib/distributor-context";
import { products, formatBRL } from "@/lib/mock-data";
import { 
  ShoppingBag, Trash2, Heart, Plus, Minus, QrCode, 
  CreditCard, ShieldCheck, ArrowRight, ArrowLeft, CheckCircle2,
  Percent, Star, Info, Crown, ChevronRight, MessageCircle, MapPin
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PublicHeader } from "@/components/app/public-header";

export const Route = createFileRoute("/loja/$slug")({
  component: DistributorStorePage,
});

export function DistributorStorePage() {
  const params = useParams({ strict: false }) as { slug?: string };
  const { currentDistributor, setDistributorBySlug } = useDistributor();
  const navigate = useNavigate();
  const { usersList, triggerBinomialBonusPay, addAuditLog } = useAuth();
  
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

  // Cart state
  const [cart, setCart] = useState<Array<{ product: any; quantity: number }>>([]);

  // Load initial cart from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("allin_life_cart");
      if (stored) {
        setCart(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Error loading stored cart:", e);
    }
  }, []);

  // Listen for cart changes from header
  useEffect(() => {
    const handleCartUpdate = () => {
      try {
        const stored = localStorage.getItem("allin_life_cart");
        if (stored) {
          setCart(JSON.parse(stored));
        } else {
          setCart([]);
        }
      } catch (e) {
        console.error("Error reloading stored cart:", e);
      }
    };
    window.addEventListener("allin_cart_updated", handleCartUpdate);
    return () => window.removeEventListener("allin_cart_updated", handleCartUpdate);
  }, []);

  // Helper to save and dispatch
  const saveCart = (newCart: Array<{ product: any; quantity: number }>) => {
    setCart(newCart);
    localStorage.setItem("allin_life_cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("allin_cart_updated"));
  };

  const [selectedProductDetails, setSelectedProductDetails] = useState<any>(null);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  
  const location = useLocation();
  const [checkoutStep, setCheckoutStep] = useState<"catalog" | "checkout" | "processing" | "receipt" | any>(() => {
    return location.pathname === "/checkout" ? "checkout" : "catalog";
  });
  
  // Checkout Form
  const [custName, setCustName] = useState("");
  const [custEmail, setCustEmail] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [custCPF, setCustCPF] = useState("");
  const [deliveryType, setDeliveryType] = useState("sedex");
  const [payMethod, setPayMethod] = useState<"pix" | "card">("pix");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVC, setCardCVC] = useState("");

  const addToCart = (prod: any) => {
    const existing = cart.find(item => item.product.id === prod.id);
    let updated;
    if (existing) {
      updated = cart.map(item => item.product.id === prod.id ? { ...item, quantity: item.quantity + 1 } : item);
    } else {
      updated = [...cart, { product: prod, quantity: 1 }];
    }
    saveCart(updated);
    toast.success(`${prod.name} adicionado ao seu carrinho.`);
  };

  const removeFromCart = (prodId: string) => {
    const updated = cart.filter(item => item.product.id !== prodId);
    saveCart(updated);
  };

  const updateQty = (prodId: string, delta: number) => {
    const updated = cart.map(item => {
      if (item.product.id === prodId) {
        const nQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: nQty };
      }
      return item;
    });
    saveCart(updated);
  };

  const clearCart = () => saveCart([]);

  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const deliveryCost = subtotal > 300 || subtotal === 0 ? 0 : 25.00;
  const finalTotal = Math.max(0, subtotal - discount + deliveryCost);

  const applyCouponHandler = () => {
    if (coupon.trim().toUpperCase() === "ALLIN10") {
      setDiscount(subtotal * 0.1);
      setCouponApplied(true);
      toast.success("Cupom de 10% de desconto aplicado!");
    } else {
      toast.error("Cupom inválido.");
    }
  };

  const startCheckout = () => {
    if (cart.length === 0) {
      toast.error("Seu carrinho está vazio.");
      return;
    }
    setCheckoutStep("checkout");
  };

  const handlePurchaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !custEmail || !custPhone || !custCPF) {
      toast.error("Por favor, preencha todos os dados de cobrança.");
      return;
    }

    setCheckoutStep("processing");

    // Simulate real gateway allocation and MLM bonus paying
    setTimeout(async () => {
      try {
        const totalPoints = cart.reduce((acc, item) => {
          // Assume points is 15% of product price or pre-assigned
          const points = item.product.bonus_payment_percentage || 20;
          return acc + (points * item.quantity);
        }, 0);

        const totalCommission = cart.reduce((acc, item) => {
          const comm = (item.product.price * 0.25) * item.quantity; // 25% direct margin commission for sponsor
          return acc + comm;
        }, 0);

        // Pay bonuses dynamically inside emulator
        await triggerBinomialBonusPay(totalPoints, totalCommission, finalTotal);

        // Record audit logs
        addAuditLog({
          id: `tx-${Math.random().toString(36).substring(3, 11)}`,
          action: "RETAIL_SALE",
          userId: "anonymous-guest-customer",
          userName: custName,
          userRole: "customer",
          module: "orders",
          details: `Venda de varejo via loja de @${sponsorSlug}. Comprador: ${custName} (${custEmail}). Itens: ${cart.map(i => `${i.product.name} (x${i.quantity})`).join(", ")}. Total: R$ ${finalTotal.toFixed(2)}. Distribuindo ${totalPoints} pontos e comissão de R$ ${totalCommission.toFixed(2)} ao sponsor.`,
          ip: "187.12.92.54"
        });

        toast.success("Pedido faturado! Comissões vinculadas instantaneamente.");
        setCheckoutStep("receipt");
      } catch (err) {
        toast.error("Erro no processamento da transação.");
        setCheckoutStep("checkout");
      }
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#06080d] text-white selection:bg-emerald-500/30 overflow-x-hidden">
      
      {/* SPONSOR DECK PIN BAR */}
      <div className="bg-gradient-to-r from-[#0d1627] to-[#070b13] border-b border-border/10 px-4 py-2.5 text-center flex flex-wrap items-center justify-center gap-2 text-xs relative z-40">
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
        <p className="text-zinc-300 font-sans">
          Você está navegando na loja virtual oficial de 
          <strong className="text-white hover:underline cursor-pointer"> {distName}</strong>
        </p>
        <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-[10px] font-mono leading-none py-0.5 uppercase">
          {distRank}
        </Badge>
        <Link 
          to="/$slug" 
          params={{ slug: sponsorSlug }} 
          className="text-emerald-400 hover:text-emerald-300 ml-1.5 underline inline-flex items-center gap-0.5"
        >
          Consultar Perfil <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      {/* HEADER NAVBAR */}
      <PublicHeader />

      {/* MAIN CONTAINER */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12 relative">
        
        <AnimatePresence mode="wait">
          {checkoutStep === "catalog" && (
            <motion.div 
              key="catalog-view" 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              {/* BRAND IMAGE BANNER */}
              <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-indigo-950/20 via-zinc-900/40 to-transparent p-6 sm:p-10">
                <div className="absolute top-0 right-0 h-96 w-96 bg-gradient-to-b from-purple-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />
                <div className="relative max-w-2xl space-y-4">
                  <span className="text-[10px] font-bold tracking-widest font-mono text-emerald-400 border border-emerald-500/25 px-2.5 py-1 rounded-full uppercase">
                    PRODUTOS HOMOLOGADOS COM PATENTE
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-snug">
                    Ciência Bioativa Aplicada à Longevidade Saudável
                  </h1>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Explore suplementos que operam na modulação de radicais livres, suporte mitocondrial avançado e reversão estética. Compre direto da rede All-In com suporte garantido de @{sponsorSlug}.
                  </p>
                </div>
              </div>

              {/* PRODUCT CATALOG GRID */}
              <div className="space-y-6">
                <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-emerald-400" /> Vitrina de Compras
                </h2>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {products.map((prod) => (
                    <div 
                      key={prod.id} 
                      className="rounded-2xl border border-border/45 bg-[#090d16]/95 overflow-hidden flex flex-col justify-between hover:border-zinc-700 hover:scale-[1.01] transition-all p-1"
                    >
                      <div className="relative">
                        <img
                          src={prod.id === "prd_1" ? "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=400" :
                               prod.id === "prd_2" ? "https://images.unsplash.com/photo-1512152272829-e3139592d56f?auto=format&fit=crop&q=80&w=400" :
                               prod.id === "prd_3" ? "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=400" :
                               "https://images.unsplash.com/photo-1626847037657-fd3622613ce3?auto=format&fit=crop&q=80&w=400"}
                          alt={prod.name}
                          className="w-full h-48 object-cover rounded-xl"
                        />
                        <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                          <span className="text-[8px] font-bold font-mono text-emerald-400 bg-background/90 px-2 py-0.5 rounded-md border border-emerald-500/25 uppercase">
                            {prod.category}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 space-y-4 flex-1 flex flex-col justify-between">
                        <div className="space-y-1">
                          <h3 className="text-xs font-bold font-mono text-zinc-500 uppercase tracking-widest">{prod.sku}</h3>
                          <h3 className="text-sm font-bold text-white line-clamp-1 leading-snug">{prod.name}</h3>
                          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mt-1">{prod.description}</p>
                        </div>

                        <div className="space-y-3 pt-3 border-t border-border/20">
                          <div className="flex justify-between items-baseline">
                            <span className="text-[10px] text-muted-foreground font-mono">Valor Comercial:</span>
                            <strong className="text-md font-bold text-white">{formatBRL(prod.price)}</strong>
                          </div>

                          <div className="grid grid-cols-5 gap-2">
                            <button
                              onClick={() => setSelectedProductDetails(prod)}
                              className="col-span-2 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition-all flex items-center justify-center cursor-pointer"
                            >
                              Saiba Mais
                            </button>
                            <button
                              onClick={() => addToCart(prod)}
                              className="col-span-3 h-8 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer pt-0.5"
                            >
                              Adicionar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* INTERACTIVE CART DRAWER IN PAGE */}
              <div id="cart-drawer" className="rounded-3xl border border-zinc-800 bg-[#090d16]/85 p-6 md:p-8 grid md:grid-cols-12 gap-8 scroll-mt-24">
                <div className="md:col-span-7 space-y-4">
                  <h3 className="text-md font-bold text-white flex items-center gap-2">
                    <ShoppingBag className="h-4.5 w-4.5 text-emerald-400" /> Seu Carrinho de Compras
                  </h3>

                  {cart.length === 0 ? (
                    <div className="text-center py-12 space-y-3 border border-dashed border-border/40 rounded-2xl bg-background/20">
                      <p className="text-sm text-zinc-500">Seu carrinho está vazio.</p>
                      <button 
                        onClick={() => addToCart(products[0])}
                        className="h-8 px-4 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-xs font-semibold cursor-pointer"
                      >
                        Começar com Vita Complex
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3.5 divide-y divide-border/25">
                      {cart.map((item) => (
                        <div key={item.product.id} className="flex gap-4 items-center pt-3.5 first:pt-0">
                          <img
                            src={item.product.id === "prd_1" ? "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=100" :
                                 item.product.id === "prd_2" ? "https://images.unsplash.com/photo-1512152272829-e3139592d56f?auto=format&fit=crop&q=80&w=100" :
                                 "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=100"}
                            alt={item.product.name}
                            className="h-12 w-12 rounded-lg object-cover bg-zinc-800"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-white truncate">{item.product.name}</h4>
                            <p className="text-[10px] text-emerald-400 font-mono">+{item.product.bonus_payment_percentage || 20} Pontos MLM por unidade</p>
                          </div>
                          
                          {/* Unit logic */}
                          <div className="flex items-center gap-1 bg-[#06080d] border border-border/80 rounded-lg p-0.5">
                            <button onClick={() => updateQty(item.product.id, -1)} className="h-6 w-6 rounded-md hover:bg-background/80 flex items-center justify-center shrink-0 text-zinc-400 hover:text-white cursor-pointer"><Minus className="h-3 w-3" /></button>
                            <span className="text-xs font-bold font-mono px-2 w-6 text-center">{item.quantity}</span>
                            <button onClick={() => updateQty(item.product.id, 1)} className="h-6 w-6 rounded-md hover:bg-background/80 flex items-center justify-center shrink-0 text-zinc-400 hover:text-white cursor-pointer"><Plus className="h-3 w-3" /></button>
                          </div>

                          <div className="text-right pl-2">
                            <p className="text-xs font-bold text-white">{formatBRL(item.product.price * item.quantity)}</p>
                            <button onClick={() => removeFromCart(item.product.id)} className="text-[10px] text-rose-400 hover:underline inline-flex items-center gap-0.5 mt-0.5 cursor-pointer">
                              <Trash2 className="h-3 w-3" /> Excluir
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="md:col-span-1 border-r border-border/10 hidden md:block" />

                {/* SUMMARY PANEL */}
                <div className="md:col-span-4 space-y-4">
                  <div className="p-3 bg-background/50 rounded-xl border border-border/30 text-center">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider font-mono">Resumo Financeiro</p>
                  </div>

                  {/* Coupon section */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest block font-mono">Cupom Cadastrado</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                        placeholder="ALLIN10"
                        className="flex-1 h-8 rounded-lg bg-[#06080d] border border-border px-3 text-xs uppercase font-mono"
                      />
                      <button
                        onClick={applyCouponHandler}
                        className="h-8 px-4 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/35 text-emerald-400 text-xs font-bold cursor-pointer font-mono"
                      >
                        Aplicar
                      </button>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-background/50 border border-border/30 space-y-2 text-xs font-mono">
                    <div className="flex justify-between text-zinc-400">
                      <span>Subtotal:</span>
                      <span className="text-white">{formatBRL(subtotal)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-rose-400">
                        <span>Desconto ALLIN10 (-10%):</span>
                        <span>-{formatBRL(discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-zinc-400">
                      <span>Frete Internacional (Sedex):</span>
                      <span className="text-white">{deliveryCost === 0 ? "Grátis" : formatBRL(deliveryCost)}</span>
                    </div>
                    <div className="border-t border-zinc-800 pt-3 flex justify-between font-bold text-sm">
                      <span className="text-white font-sans font-bold">Total Geral:</span>
                      <span className="text-emerald-400 font-extrabold">{formatBRL(finalTotal)}</span>
                    </div>
                  </div>

                  <button
                    onClick={startCheckout}
                    className="w-full h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black text-xs font-bold uppercase tracking-wider h-11 flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/10 pt-0.5 cursor-pointer"
                  >
                    Seguir para Pagamento
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* CHECKOUT FLOW */}
          {checkoutStep === "checkout" && (
            <motion.div 
              key="checkout-view" 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto rounded-3xl border border-zinc-800 bg-[#090d16] p-6 md:p-10 shadow-2xl space-y-8"
            >
              <div className="flex justify-between items-center border-b border-border/20 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white leading-tight">Checkout do Consumidor Final</h2>
                  <p className="text-xs text-zinc-400 mt-1">Inscreva seus dados para calcular entrega e processar cashback de rede All-In.</p>
                </div>
                <button
                  onClick={() => setCheckoutStep("catalog")}
                  className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:underline cursor-pointer font-mono"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Voltar à loja
                </button>
              </div>

              <form onSubmit={handlePurchaseSubmit} className="grid md:grid-cols-12 gap-8">
                {/* Billing inputs */}
                <div className="md:col-span-7 space-y-4">
                  <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-[#a855f7] bg-purple-500/15 border border-purple-500/20 px-2 rounded-md py-0.5 inline-block">1. Dados Governamentais & Cobrança</h3>
                  
                  <div className="space-y-3.5">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground font-mono">Nome Completo do Destinatário</label>
                      <input
                        type="text" required value={custName} onChange={(e) => setCustName(e.target.value)}
                        placeholder="Ex: Carlos Heitor"
                        className="w-full h-9 rounded-lg bg-background border border-border px-3 text-xs text-white"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-muted-foreground font-mono">E-mail para Nota Fiscal</label>
                        <input
                          type="email" required value={custEmail} onChange={(e) => setCustEmail(e.target.value)}
                          placeholder="carlos@allin.io"
                          className="w-full h-9 rounded-lg bg-background border border-border px-3 text-xs text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-muted-foreground font-mono">CPF para Registros Fiscais</label>
                        <input
                          type="text" required value={custCPF} onChange={(e) => setCustCPF(e.target.value)}
                          placeholder="000.000.000-00"
                          className="w-full h-9 rounded-lg bg-background border border-border px-3 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-muted-foreground font-mono">Telefone WhatsApp</label>
                        <input
                          type="tel" required value={custPhone} onChange={(e) => setCustPhone(e.target.value)}
                          placeholder="(11) 99312-0000"
                          className="w-full h-9 rounded-lg bg-background border border-border px-3 text-xs text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-muted-foreground font-mono">Modalidade de Frete</label>
                        <select
                          value={deliveryType} onChange={(e) => setDeliveryType(e.target.value)}
                          className="w-full h-9 rounded-lg bg-[#06080d] border border-border px-3 text-xs text-white cursor-pointer"
                        >
                          <option value="sedex">Sedex Expresso Internacional (3 dias úteis)</option>
                          <option value="pac">PAC Standart (8 dias úteis)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Payment selector */}
                  <div className="space-y-3 pt-4 border-t border-border/15">
                    <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-[#a855f7] bg-purple-500/15 border border-purple-500/20 px-2 rounded-md py-0.5 inline-block">2. Escolha o Método de Liquidação</h3>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setPayMethod("pix")}
                        className={`py-3 px-4 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          payMethod === "pix" ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400" : "border-zinc-800 bg-[#06080d] text-zinc-400"
                        }`}
                      >
                        <QrCode className="h-4 w-4" /> Pix QR Code Autogerado
                      </button>
                      <button
                        type="button"
                        onClick={() => setPayMethod("card")}
                        className={`py-3 px-4 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          payMethod === "card" ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400" : "border-zinc-800 bg-[#06080d] text-zinc-400"
                        }`}
                      >
                        <CreditCard className="h-4 w-4" /> Cartão Certificado
                      </button>
                    </div>

                    <AnimatePresence mode="wait">
                      {payMethod === "card" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="p-4 bg-background/50 rounded-xl border border-border/40 space-y-3 overflow-hidden"
                        >
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase font-bold text-muted-foreground font-mono">Número do Cartão de Crédito</label>
                            <input
                              type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)}
                              placeholder="0000 0000 0000 0000"
                              className="w-full h-9 rounded-lg bg-[#06080d] border border-zinc-800 px-3 text-xs text-white"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[9px] uppercase font-bold text-muted-foreground font-mono font-mono">Expiração (MM/AA)</label>
                              <input
                                type="text" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)}
                                placeholder="12/29"
                                className="w-full h-9 rounded-lg bg-[#06080d] border border-zinc-800 px-3 text-xs text-white"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] uppercase font-bold text-muted-foreground font-mono font-mono">CVC de Segurança</label>
                              <input
                                type="text" value={cardCVC} onChange={(e) => setCardCVC(e.target.value)}
                                placeholder="123"
                                className="w-full h-9 rounded-lg bg-[#06080d] border border-zinc-800 px-3 text-xs text-white"
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Shopping items / calculations */}
                <div className="md:col-span-5 space-y-5">
                  <div className="rounded-2xl border border-zinc-800 bg-[#06080d] p-5 space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#a855f7] bg-purple-500/15 border border-purple-500/20 px-2 rounded-md py-0.5 inline-block">3. Resumo dos Itens</h4>
                    
                    <div className="space-y-3/5 max-h-48 overflow-y-auto divide-y divide-border/15 pr-1">
                      {cart.map((item) => (
                        <div key={item.product.id} className="flex gap-2.5 items-center pt-2.5 first:pt-0 text-xs">
                          <span className="font-bold text-emerald-400 font-mono text-[11px] shrink-0">x{item.quantity}</span>
                          <span className="text-white font-medium truncate flex-1">{item.product.name}</span>
                          <span className="font-mono text-zinc-400 shrink-0">{formatBRL(item.product.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Meta/cashback details to sponsor */}
                    <div className="p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/20 text-xs text-zinc-300 space-y-1.5 leading-relaxed font-sans">
                      <p className="font-bold text-emerald-400 uppercase tracking-widest text-[9px] font-mono select-none">Bônus & Patrocínio Direto</p>
                      <p>Estas aquisições faturam <strong className="text-white">R$ {(subtotal * 0.25).toFixed(2)}</strong> de cashback imediato e acumulam volume binário de rede para:</p>
                      <div className="flex items-center gap-2 pt-1 border-t border-emerald-500/10 mt-1">
                        <img src={distAvatar} alt={distName} className="h-6 w-6 rounded-full border border-emerald-500/30 object-cover" />
                        <div>
                          <p className="font-semibold text-white text-[11px]">{distName}</p>
                          <p className="text-[9px] text-emerald-400 font-mono leading-none">@{sponsorSlug}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5 border-t border-zinc-800 pt-3 text-xs font-mono">
                      <div className="flex justify-between text-zinc-500">
                        <span>Produtos:</span>
                        <span className="text-white">{formatBRL(subtotal)}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-rose-400">
                          <span>Desconto Promo:</span>
                          <span>-{formatBRL(discount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-zinc-500">
                        <span>Inoculação Sedex:</span>
                        <span className="text-white">{deliveryCost === 0 ? "Grátis" : formatBRL(deliveryCost)}</span>
                      </div>
                      <div className="border-t border-zinc-900 pt-2 flex justify-between font-bold text-sm">
                        <span className="text-white font-sans font-bold">Total Final:</span>
                        <span className="text-emerald-400 font-extrabold">{formatBRL(finalTotal)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full h-11 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/15 pt-0.5 cursor-pointer"
                  >
                    Confirmar e Contratar Gateway (R$ {finalTotal.toFixed(2)})
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {checkoutStep === "processing" && (
            <motion.div 
              key="processing-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-md mx-auto text-center py-20 space-y-4 rounded-3xl border border-zinc-900 bg-[#090d16]"
            >
              <div className="h-12 w-12 rounded-full border-2 border-t-emerald-400 border-r-transparent border-b-transparent border-l-transparent animate-spin mx-auto" />
              <h3 className="text-sm font-bold text-white">Segurando Gateway de Pagamento All-In...</h3>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                Liquidanado operação junto aos nós bancários. Atribuindo cashback imediato e alocando pontos binários MLM para @{sponsorSlug} no Ledger.
              </p>
            </motion.div>
          )}

          {checkoutStep === "receipt" && (
            <motion.div 
              key="receipt-view" 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto border border-emerald-500/30 bg-[#081210]/95 p-8 rounded-3xl shadow-emerald-500/10 shadow-2xl space-y-6"
            >
              <div className="h-12 w-12 rounded-full bg-emerald-500/15 border border-emerald-500/25 grid place-items-center text-emerald-400 mx-auto">
                <CheckCircle2 className="h-6 w-6" />
              </div>

              <div className="space-y-1.5 text-center">
                <h3 className="text-md font-bold text-white">Transação Faturada com Sucesso!</h3>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
                  Olá, <strong className="text-white">{custName}</strong>! Seu pedido foi faturado. Um e-mail de conformidade fiscal e código de rastreio Sedex foi encaminhado para <strong className="text-white">{custEmail}</strong>.
                </p>
              </div>

              <div className="p-4 border border-border/45 rounded-xl bg-background/50 text-[10px] text-muted-foreground font-mono space-y-1.5 text-center select-all">
                <p className="font-sans text-[9px] uppercase tracking-wider text-muted-foreground mb-1">Assinatura Digital de Ledger Criptográfico</p>
                <div className="flex items-center justify-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>BLOCK_HASH: sha256-{Math.random().toString(36).substring(3, 11).toUpperCase()}...</span>
                </div>
                <p className="text-[9px] text-emerald-500">Transação vinculada ao patrocinador @{sponsorSlug}</p>
              </div>

              <button
                onClick={() => {
                  clearCart();
                  setCheckoutStep("catalog");
                }}
                className="w-full h-10 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                Voltar à Vitrine
              </button>
            </motion.div>
          )}

        </AnimatePresence>

        {/* DETAILS/ABOUT PRODUCT DIALOG (OVERLAY) */}
        <AnimatePresence>
          {selectedProductDetails && (
            <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="rounded-2xl border border-zinc-800 bg-[#090d16] p-6 max-w-md w-full space-y-5"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] bg-emerald-500/15 text-emerald-400 font-mono font-bold px-2 py-0.5 rounded-md border border-emerald-500/20">{selectedProductDetails.category}</span>
                    <h3 className="text-md font-bold text-white mt-1.5">{selectedProductDetails.name}</h3>
                  </div>
                  <button 
                    onClick={() => setSelectedProductDetails(null)}
                    className="text-xs text-zinc-400 hover:text-white font-mono bg-[#06080d] px-2 py-0.5 rounded-md cursor-pointer border border-border/30"
                  >
                    Fechar
                  </button>
                </div>

                <img 
                  src={selectedProductDetails.id === "prd_1" ? "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=300" :
                       selectedProductDetails.id === "prd_2" ? "https://images.unsplash.com/photo-1512152272829-e3139592d56f?auto=format&fit=crop&q=80&w=300" :
                       "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=300"}
                  alt={selectedProductDetails.name}
                  className="w-full h-36 object-cover rounded-xl"
                />

                <div className="space-y-2 text-xs text-zinc-300 leading-relaxed">
                  <p>{selectedProductDetails.description}</p>
                  <div className="p-3 bg-background border border-border/40 rounded-xl grid grid-cols-2 gap-2 text-center text-xs">
                    <div>
                      <p className="text-[10px] text-muted-foreground font-mono">Fabricante</p>
                      <p className="font-semibold text-white">{selectedProductDetails.manufacturer}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground font-mono">Pontos MLM</p>
                      <p className="font-semibold text-emerald-400 font-mono">+{selectedProductDetails.bonus_payment_percentage || 20} pts</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center border-t border-zinc-800">
                  <strong className="text-md text-white font-bold">{formatBRL(selectedProductDetails.price)}</strong>
                  <button
                    onClick={() => {
                      addToCart(selectedProductDetails);
                      setSelectedProductDetails(null);
                    }}
                    className="h-9 px-6 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-bold flex items-center justify-center cursor-pointer"
                  >
                    Adicionar no Carrinho
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-zinc-900 bg-[#040609] py-12 relative z-10 text-xs text-zinc-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <p className="font-semibold text-white uppercase tracking-widest text-[11px]">All-In Life · Loja Autorizada de {distName}</p>
          <p className="max-w-md mx-auto leading-relaxed">
            Plataforma de varejo integrada à estrutura da All-In Brasil. Suas transações faturam cashback direto e volume de perna de rede em conformidade com as diretivas MLM oficiais.
          </p>
          <p className="text-[10px]">Patrocinador: <span className="text-zinc-400 font-mono">@{sponsorSlug}</span> · ID: <span className="text-zinc-400 font-mono">{matchedUser?.id || "dist_001"}</span></p>
        </div>
      </footer>
    </div>
  );
}
