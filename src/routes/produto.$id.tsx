import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/modules/auth";
import { useDistributor } from "@/lib/distributor-context";
import { products, formatBRL } from "@/lib/mock-data";
import { 
  Crown, Star, Heart, ShieldCheck, QrCode, CreditCard, CheckCircle2,
  ChevronRight, ArrowLeft, Info, HelpCircle, MessageCircle, MapPin, 
  Sparkles, Award, ShoppingCart, Percent
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PublicHeader } from "@/components/app/public-header";

export const Route = createFileRoute("/produto/$id")({
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const searchParams = Route.useSearch() as { ref?: string };
  const { triggerBinomialBonusPay, addAuditLog } = useAuth();
  const { currentDistributor, setDistributorBySlug } = useDistributor();

  const queryRef = searchParams?.ref?.toLowerCase().trim();

  useEffect(() => {
    if (queryRef) {
      setDistributorBySlug(queryRef);
    }
  }, [queryRef, setDistributorBySlug]);

  const sponsorSlug = currentDistributor.slug;
  const distName = currentDistributor.name;
  const distRank = currentDistributor.rank;
  const distAvatar = currentDistributor.avatar;

  // Find product
  const prod = products.find(p => p.id === id) || products[0];

  // Checkout overlay state
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [checkoutStep, setCheckoutStep] = useState<"form" | "processing" | "success">("form");

  // Form states
  const [custName, setCustName] = useState("");
  const [custEmail, setCustEmail] = useState("");
  const [custCPF, setCustCPF] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [payMethod, setPayMethod] = useState<"pix" | "card">("pix");

  const finalPrice = Math.max(0, prod.price - discount);

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === "ALLIN10") {
      setDiscount(prod.price * 0.1);
      toast.success("Cupom de 10% aplicado!");
    } else {
      toast.error("Cupom inválido.");
    }
  };

  const handleQuickCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !custEmail || !custCPF || !custPhone) {
      toast.error("Por favor, preencha todos os dados de faturamento obrigatórios.");
      return;
    }

    setCheckoutStep("processing");

    setTimeout(async () => {
      try {
        const points = prod.bonus_payment_percentage || 25;
        const comm = prod.price * 0.25; // 25% direct commission on sales

        // Send point and cashbacks to virtual MLM Ledger emulator
        await triggerBinomialBonusPay(points, comm, finalPrice);

        // Add to permanent logs
        addAuditLog({
          id: `tx-${Math.random().toString(36).substring(3, 11)}`,
          action: "RETAIL_SALE",
          userId: "raw-product-customer",
          userName: custName,
          userRole: "customer",
          module: "orders",
          details: `Compra rápida de produto individual (${prod.name}) na loja de @${sponsorSlug}. Atribuindo ${points} pontos de binário e comissão de R$ ${comm.toFixed(2)} ao patrocinador. Total pago: R$ ${finalPrice.toFixed(2)}.`,
          ip: "185.120.30.22"
        });

        setCheckoutStep("success");
      } catch (err) {
        toast.error("Houve uma falha no gateway de checkout.");
        setCheckoutStep("form");
      }
    }, 2800);
  };

  return (
    <div className="min-h-screen bg-[#06080d] text-white selection:bg-emerald-500/30 overflow-x-hidden">
      
      {/* SPONSOR ANCHOR HEADER DECK */}
      <div className="bg-[#0b1220] border-b border-border/10 px-4 py-2.5 text-center flex items-center justify-center gap-2 text-xs relative z-40">
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
        <p className="text-zinc-300">
          Você está visualizando este produto sob recomendação médica/comercial de <strong className="text-white">{distName}</strong>
        </p>
        <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-[9px] font-mono leading-none py-0.5 uppercase">
          {distRank}
        </Badge>
        <Link to="/$slug" params={{ slug: sponsorSlug }} className="text-emerald-400 hover:text-emerald-300 ml-1.5 underline inline-flex items-center gap-0.5">
          Ver perfil <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      {/* HEADER NAVBAR */}
      <PublicHeader />

      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
        
        {/* PRODUCT DETAILS GRID */}
        <section id="product-vital-deck" className="grid md:grid-cols-12 gap-8 items-start">
          
          {/* Left panel: Product image */}
          <div className="md:col-span-5 space-y-4">
            <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-[#090d16] p-1.5 shadow-2xl">
              <img
                src={prod.id === "prd_1" ? "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=500" :
                     prod.id === "prd_2" ? "https://images.unsplash.com/photo-1512152272829-e3139592d56f?auto=format&fit=crop&q=80&w=500" :
                     prod.id === "prd_3" ? "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=500" :
                     "https://images.unsplash.com/photo-1626847037657-fd3622613ce3?auto=format&fit=crop&q=80&w=500"}
                alt={prod.name}
                className="w-full h-80 object-cover rounded-xl opacity-90"
              />
              <span className="absolute top-4 right-4 text-[9px] font-bold font-mono text-emerald-400 bg-background/90 border border-emerald-500/25 px-2.5 py-1 rounded-md uppercase">
                {prod.category}
              </span>
            </div>

            <div className="p-4 rounded-xl border border-zinc-950 bg-gradient-to-br from-[#0c1322] to-background space-y-2">
              <span className="text-[9px] font-bold font-mono tracking-wider uppercase text-emerald-400 block">Especificações Biológicas</span>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Aprovado por ensaios clínicos ortomoleculares. Matéria-prima importada certificada s/ glúten e livre de corantes artificiais sintéticos nocivos.
              </p>
            </div>
          </div>

          {/* Right panel: Information */}
          <div className="md:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#a855f7] bg-purple-500/15 border border-purple-500/20 px-2.5 py-1 rounded-full font-mono">
                SUPLEMENTAÇÃO ORGÂNICA CO-VINCULADA
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">{prod.name}</h1>
              
              <div className="flex items-center gap-2 text-xs">
                <div className="flex text-amber-400">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <Star className="h-3.5 w-3.5 fill-current" />
                </div>
                <span className="text-zinc-500">4.9 · (132 avaliações clínicas auditadas)</span>
              </div>
            </div>

            <p className="text-sm text-zinc-300 leading-relaxed">
              {prod.description} Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pellentesque rhoncus ligula. Vivamus lobortis elit at felis varius gravida. Ut sit amet porta lorem, sed imperdiet ante.
            </p>

            <div className="border-t border-b border-zinc-800 py-4 grid grid-cols-3 gap-3 text-center text-xs">
              <div className="space-y-0.5">
                <p className="text-[10px] text-zinc-500 font-mono">Fabricante</p>
                <p className="font-bold text-white">{prod.manufacturer}</p>
              </div>
              <div className="space-y-0.5 border-l border-r border-zinc-800/60">
                <p className="text-[10px] text-zinc-500 font-mono">Código SKU</p>
                <p className="font-bold text-white font-mono">{prod.sku}</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] text-zinc-500 font-mono">Volume MLM</p>
                <p className="font-bold text-emerald-400 font-mono">+{prod.bonus_payment_percentage || 25} PONTOS</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-baseline gap-2">
                <span className="text-xs text-zinc-500">Preço de Venda:</span>
                <strong className="text-3xl font-extrabold text-emerald-400 tracking-tight">{formatBRL(prod.price)}</strong>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setCheckoutOpen(true)}
                  className="flex-1 h-11 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/15 cursor-pointer pt-0.5"
                >
                  <ShoppingCart className="h-4.5 w-4.5" />
                  Comprar Online com @{sponsorSlug}
                </button>
                <button className="h-11 w-11 rounded-xl border border-zinc-850 bg-[#090d16] flex items-center justify-center cursor-pointer text-zinc-400 hover:text-rose-400 transition-colors">
                  <Heart className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Quality assurance badges */}
            <div className="pt-4 grid grid-cols-2 gap-4 text-xs text-zinc-400 border-t border-zinc-800">
              <p className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" /> Checkout verificado por IA</p>
              <p className="flex items-center gap-2"><Award className="h-4 w-4 text-emerald-400 shrink-0" /> Garantia de entrega All-In</p>
            </div>
          </div>
        </section>

        {/* CLINICAL BENEFITS EXTENDED */}
        <section id="extended-specification" className="p-6 md:p-8 rounded-2xl border border-zinc-800 bg-[#090d16]/40 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2"><Sparkles className="h-4 w-4 text-emerald-400" /> Benefícios Clínicos e Bioativos</h3>
          <ul className="text-xs text-zinc-400 space-y-2.5 list-inside leading-relaxed">
            <li className="flex items-start gap-2"><span className="text-emerald-400 font-bold shrink-0">✔</span> Modulador Mitocondrial: Favorece a síntese de ATP celular mitigando estresse oxidativo severo no dia-a-dia.</li>
            <li className="flex items-start gap-2"><span className="text-emerald-400 font-bold shrink-0">✔</span> Alta Taxa de Absorção: Quelatos microparticulados que ultrapassam a barreira gástrica sem degradação vitamínica.</li>
            <li className="flex items-start gap-2"><span className="text-emerald-400 font-bold shrink-0">✔</span> Patente Registrada: Processo de cozimento e esterilização molecular homologado junta à Anvisa.</li>
          </ul>
        </section>

        {/* INTEGRATED INSTANT PAYMENT OVERLAY MODAL */}
        <AnimatePresence>
          {checkoutOpen && (
            <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="rounded-3xl border border-zinc-800 bg-[#090d16] p-6 max-w-md w-full space-y-6 overflow-hidden"
              >
                <div className="flex justify-between items-center border-b border-zinc-850 pb-3">
                  <h3 className="text-md font-bold text-white leading-tight">Painel de Checkout Direto</h3>
                  <button 
                    onClick={() => {
                      setCheckoutOpen(false);
                      setCheckoutStep("form");
                    }}
                    className="text-xs text-zinc-400 hover:text-white font-mono cursor-pointer bg-[#06080d] px-2.5 py-1 rounded-lg border border-border/30"
                  >
                    Recuar
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {checkoutStep === "form" && (
                    <form onSubmit={handleQuickCheckoutSubmit} className="space-y-4">
                      
                      <div className="p-3 bg-[#06080d]/80 rounded-xl border border-zinc-800 text-xs text-zinc-400 space-y-1">
                        <p className="font-bold text-emerald-400 uppercase text-[9px] font-mono leading-none mb-1">Patrocinador Vinculado</p>
                        <p>Suas compras ativam comissões de <strong className="text-white">R$ {(prod.price * 0.25).toFixed(2)}</strong> para:</p>
                        <p className="font-bold text-white font-mono mt-1">@{sponsorSlug} ({distName})</p>
                      </div>

                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-bold text-muted-foreground font-mono">Nome do Consumidor</label>
                          <input 
                            type="text" required value={custName} onChange={(e) => setCustName(e.target.value)}
                            className="w-full h-8.5 rounded-lg bg-background border border-border px-3 text-xs text-white"
                            placeholder="Ex: Carlos Heitor"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-bold text-muted-foreground font-mono">E-mail Corporativo</label>
                          <input 
                            type="email" required value={custEmail} onChange={(e) => setCustEmail(e.target.value)}
                            className="w-full h-8.5 rounded-lg bg-background border border-border px-3 text-xs text-white"
                            placeholder="carlos@allin.io"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase font-bold text-muted-foreground font-mono">CPF Legal</label>
                            <input 
                              type="text" required value={custCPF} onChange={(e) => setCustCPF(e.target.value)}
                              className="w-full h-8.5 rounded-lg bg-background border border-border px-3 text-xs text-white"
                              placeholder="000.000.000-00"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase font-bold text-muted-foreground font-mono">WhatsApp Call</label>
                            <input 
                              type="tel" required value={custPhone} onChange={(e) => setCustPhone(e.target.value)}
                              className="w-full h-8.5 rounded-lg bg-background border border-border px-3 text-xs text-white"
                              placeholder="(11) 98765-4321"
                            />
                          </div>
                        </div>

                        {/* Coupon item */}
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-bold text-muted-foreground font-mono tracking-widest block font-mono">Código de Cupom</label>
                          <div className="flex gap-2">
                            <input
                              type="text" value={coupon} onChange={(e) => setCoupon(e.target.value)}
                              placeholder="ALLIN10"
                              className="flex-1 h-8 rounded-lg bg-[#06080d] border border-border px-3 text-xs uppercase font-mono text-white"
                            />
                            <button
                              type="button" onClick={applyCoupon}
                              className="h-8 px-4 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold cursor-pointer font-mono"
                            >
                              Aplicar
                            </button>
                          </div>
                        </div>

                        <div className="p-3 bg-zinc-900/50 rounded-xl space-y-1 text-xs font-mono">
                          <div className="flex justify-between text-zinc-500">
                            <span>Subtotal:</span>
                            <span className="text-white">{formatBRL(prod.price)}</span>
                          </div>
                          {discount > 0 && (
                            <div className="flex justify-between text-rose-400">
                              <span>Promo ALLIN10:</span>
                              <span>-{formatBRL(discount)}</span>
                            </div>
                          )}
                          <div className="border-t border-border/25 pt-1.5 flex justify-between font-bold">
                            <span className="text-white font-sans font-bold">Total Geral:</span>
                            <span className="text-emerald-400 font-extrabold">{formatBRL(finalPrice)}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full h-10 mt-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer pt-0.5"
                      >
                        Finalizar Compra Direta
                      </button>
                    </form>
                  )}

                  {checkoutStep === "processing" && (
                    <motion.div
                      key="processing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-12 space-y-4"
                    >
                      <div className="h-10 w-10 border-2 border-t-emerald-400 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto" />
                      <p className="text-xs font-bold text-white">Segurando Gateway Ortomolecular All-In...</p>
                      <p className="text-[11px] text-zinc-400 max-w-xs mx-auto text-center leading-relaxed">
                        Transmutando volume em bônus residuais binários e distribuindo cashback imediato sob o sponsor legítimo @{sponsorSlug}.
                      </p>
                    </motion.div>
                  )}

                  {checkoutStep === "success" && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-4 space-y-4 text-zinc-300"
                    >
                      <div className="h-12 w-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                        <CheckCircle2 className="h-6 w-6" />
                      </div>
                      
                      <div>
                        <h4 className="text-md font-bold text-white">Pagamento Faturado!</h4>
                        <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto leading-relaxed">
                          Sua transação do bioregulador <strong className="text-white">{prod.name}</strong> foi validada. O recibo fiscal foi para <strong className="text-white">{custEmail}</strong>.
                        </p>
                      </div>

                      <div className="p-3 bg-zinc-950 rounded-xl text-[10px] text-zinc-500 font-mono space-y-1 divide-y divide-border/10">
                        <p className="pb-1">TX_LOG ID: XP-{Math.random().toString(36).substring(3, 9).toUpperCase()}</p>
                        <p className="pt-1 text-emerald-500">MLM Cashback creditado sob o sponsor @{sponsorSlug}</p>
                      </div>

                      <button
                        onClick={() => {
                          setCheckoutOpen(false);
                          setCheckoutStep("form");
                        }}
                        className="w-full h-9 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-bold uppercase transition-all"
                      >
                        Retornar ao Conteúdo
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-zinc-900 bg-[#040609] py-12 relative z-10 text-xs text-zinc-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <p className="font-semibold text-white uppercase tracking-widest text-[11px]">All-In Life · Distribuidor {distName}</p>
          <p className="max-w-md mx-auto leading-relaxed">
            As comissões e transações são coordenadas e auditadas sob as normas regulamentares da empresa. Para saber mais consulte as diretrizes de compliance em nosso site corporativo.
          </p>
          <p className="text-[10px]">Patrocinador legítimo: <span className="text-zinc-400 font-mono">@{sponsorSlug}</span></p>
        </div>
      </footer>
    </div>
  );
}
