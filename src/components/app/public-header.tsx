import { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useDistributor, DEFAULT_DISTRIBUTOR } from "@/lib/distributor-context";
import { 
  ShoppingBag, Sun, Moon, LogIn, UserPlus, X, Trash2, Plus, Minus, 
  Menu, Info, Eye, ShieldCheck, ArrowRight, Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { formatBRL, products } from "@/lib/mock-data";

export interface CartItem {
  product: {
    id: string;
    name: string;
    price: number;
    category: string;
    sku: string;
    description: string;
  };
  quantity: number;
}

export function PublicHeader() {
  const navigate = useNavigate();
  const { currentDistributor } = useDistributor();
  const sponsorSlug = currentDistributor.slug;
  const [theme, setTheme] = useState<"light" | "dark" | any>("dark");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isDefaultTenant = sponsorSlug.toLowerCase() === DEFAULT_DISTRIBUTOR.toLowerCase();

  // Sync theme
  useEffect(() => {
    const currentTheme = localStorage.getItem("allin_theme") as "light" | "dark" || "dark";
    setTheme(currentTheme);
    if (currentTheme === "light") {
      document.body.classList.add("light");
      document.body.classList.remove("dark");
    } else {
      document.body.classList.add("dark");
      document.body.classList.remove("light");
    }
  }, []);

  // Sync cart lists
  const loadCart = () => {
    try {
      const stored = localStorage.getItem("allin_life_cart");
      if (stored) {
        setCart(JSON.parse(stored));
      } else {
        setCart([]);
      }
    } catch (e) {
      console.error("Failed loading cart items:", e);
    }
  };

  useEffect(() => {
    loadCart();
    
    // Listen for custom change events
    const handleCartUpdate = () => loadCart();
    window.addEventListener("allin_cart_updated", handleCartUpdate);
    window.addEventListener("storage", handleCartUpdate);
    
    return () => {
      window.removeEventListener("allin_cart_updated", handleCartUpdate);
      window.removeEventListener("storage", handleCartUpdate);
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("allin_theme", nextTheme);
    if (nextTheme === "light") {
      document.body.classList.add("light");
      document.body.classList.remove("dark");
      toast.success("Modo Claro ativado para melhor legibilidade diurna.");
    } else {
      document.body.classList.add("dark");
      document.body.classList.remove("light");
      toast.success("Modo Escuro ativado.");
    }
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    const updated = cart.map(item => {
      if (item.product.id === productId) {
        const nextQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: nextQty };
      }
      return item;
    });
    setCart(updated);
    localStorage.setItem("allin_life_cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("allin_cart_updated"));
  };

  const removeCartItem = (productId: string) => {
    const updated = cart.filter(item => item.product.id !== productId);
    setCart(updated);
    localStorage.setItem("allin_life_cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("allin_cart_updated"));
    toast.info("Item removido do carrinho.");
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navigateToCheckout = () => {
    setIsCartOpen(false);
    if (isDefaultTenant) {
      navigate({ to: "/checkout" });
    } else {
      navigate({ to: `/loja/$slug`, params: { slug: sponsorSlug } });
      setTimeout(() => {
        const checkoutEl = document.getElementById("cart-drawer");
        if (checkoutEl) {
          checkoutEl.scrollIntoView({ behavior: "smooth" });
        }
      }, 500);
    }
  };

  return (
    <>
      <header id="public-main-header" className="relative border-b border-border/15 bg-background/85 backdrop-blur-md z-45 sticky top-0 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* LOGO */}
          {isDefaultTenant ? (
            <Link 
              to="/" 
              className="flex items-center gap-2 cursor-pointer group"
            >
              <span className="h-8.5 w-8.5 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center font-black text-black text-sm shadow-md transition-transform group-hover:scale-105">
                A
              </span>
              <span className="font-sans font-extrabold text-[15px] uppercase tracking-wider text-foreground">
                All-In <span className="text-emerald-400 font-normal lowercase">life</span>
              </span>
            </Link>
          ) : (
            <Link 
              to="/$slug" 
              params={{ slug: sponsorSlug }} 
              className="flex items-center gap-2 cursor-pointer group"
            >
              <span className="h-8.5 w-8.5 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center font-black text-black text-sm shadow-md transition-transform group-hover:scale-105">
                A
              </span>
              <span className="font-sans font-extrabold text-[15px] uppercase tracking-wider text-foreground">
                All-In <span className="text-emerald-400 font-normal lowercase">life</span>
              </span>
            </Link>
          )}

          {/* DESKTOP MENU - RESTRICTED TO EXACTLY THE REQUESTED ITEMS */}
          <nav className="hidden md:flex items-center gap-6">
            {isDefaultTenant ? (
              <>
                <Link 
                  to="/" 
                  className="text-muted-foreground hover:text-foreground text-xs font-semibold uppercase tracking-wider transition-colors"
                  activeProps={{ className: "text-emerald-400" }}
                >
                  Início
                </Link>
                <Link 
                  to="/seja-distribuidor" 
                  className="text-muted-foreground hover:text-foreground text-xs font-semibold uppercase tracking-wider transition-colors"
                  activeProps={{ className: "text-emerald-400" }}
                >
                  Seja Distribuidor
                </Link>
                <Link 
                  to="/loja" 
                  className="text-muted-foreground hover:text-foreground text-xs font-semibold uppercase tracking-wider transition-colors"
                  activeProps={{ className: "text-emerald-400" }}
                >
                  Loja
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/$slug" 
                  params={{ slug: sponsorSlug }} 
                  className="text-muted-foreground hover:text-foreground text-xs font-semibold uppercase tracking-wider transition-colors"
                  activeProps={{ className: "text-emerald-400" }}
                >
                  Início
                </Link>
                <Link 
                  to="/seja-distribuidor/$slug" 
                  params={{ slug: sponsorSlug }} 
                  className="text-muted-foreground hover:text-foreground text-xs font-semibold uppercase tracking-wider transition-colors"
                  activeProps={{ className: "text-emerald-400" }}
                >
                  Seja Distribuidor
                </Link>
                <Link 
                  to="/loja/$slug" 
                  params={{ slug: sponsorSlug }} 
                  className="text-muted-foreground hover:text-foreground text-xs font-semibold uppercase tracking-wider transition-colors"
                  activeProps={{ className: "text-emerald-400" }}
                >
                  Loja
                </Link>
              </>
            )}
          </nav>

          {/* DESKTOP ACTIONS */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              id="theme-toggler"
              title="Alternar tema"
              className="h-9.5 w-9.5 rounded-xl border border-border/60 bg-background/50 flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            >
              {theme === "dark" ? <Sun className="h-4.5 w-4.5 text-amber-400" /> : <Moon className="h-4.5 w-4.5 text-indigo-600" />}
            </button>

            {/* Cart trigger */}
            <button 
              onClick={() => setIsCartOpen(true)}
              id="cart-trigger-button"
              className="relative h-9.5 px-3.5 rounded-xl border border-border/60 bg-background/50 flex items-center gap-1.5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            >
              <ShoppingBag className="h-4.5 w-4.5 text-emerald-400" />
              {cartItemCount > 0 ? (
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold bg-emerald-500 text-black rounded-md font-mono">
                  {cartItemCount}
                </span>
              ) : (
                <span className="text-[10px] font-mono">0</span>
              )}
            </button>

            {/* Login */}
            <Link 
              to="/login"
              className="h-9.5 px-4 rounded-xl border border-border/80 hover:bg-muted font-bold text-xs flex items-center gap-1.5 text-foreground transition-colors"
            >
              <LogIn className="h-4 w-4 text-emerald-400" />
              Entrar
            </Link>

            {/* Free Registration */}
            <Link 
              to="/cadastro"
              className="h-9.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 font-bold text-xs text-black shadow-lg shadow-emerald-500/10 flex items-center gap-1.5 transition-opacity hover:opacity-90"
            >
              <UserPlus className="h-4 w-4" />
              Cadastrar-se Grátis
            </Link>
          </div>

          {/* MOBILE TOGGLE GROUP */}
          <div className="flex md:hidden items-center gap-2">
            {/* Theme toggle mobile */}
            <button 
              onClick={toggleTheme}
              className="h-8.5 w-8.5 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground"
            >
              {theme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4.5 w-4.5 text-indigo-600" />}
            </button>

            {/* Cart trigger mobile */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative h-8.5 w-8.5 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground"
            >
              <ShoppingBag className="h-4 w-4 text-emerald-450" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 text-[9px] font-bold text-black flex items-center justify-center font-mono">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Burger */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="h-8.5 w-8.5 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground"
            >
              <Menu className="h-4.5 w-4.5" />
            </button>
          </div>

        </div>

        {/* MOBILE OVERLAY DRAWER */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-border/15 bg-background absolute left-0 right-0 top-18 overflow-hidden z-40 transition-colors shadow-2xl"
            >
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 gap-1">
                  {isDefaultTenant ? (
                    <>
                      <Link 
                        to="/" 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-2.5 rounded-lg hover:bg-muted font-bold text-xs text-foreground uppercase tracking-wider"
                      >
                        Início
                      </Link>
                      <Link 
                        to="/seja-distribuidor" 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-2.5 rounded-lg hover:bg-muted font-bold text-xs text-foreground uppercase tracking-wider"
                      >
                        Seja Distribuidor
                      </Link>
                      <Link 
                        to="/loja" 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-2.5 rounded-lg hover:bg-muted font-bold text-xs text-foreground uppercase tracking-wider"
                      >
                        Loja
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link 
                        to="/$slug" 
                        params={{ slug: sponsorSlug }}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-2.5 rounded-lg hover:bg-muted font-bold text-xs text-foreground uppercase tracking-wider"
                      >
                        Início
                      </Link>
                      <Link 
                        to="/seja-distribuidor/$slug" 
                        params={{ slug: sponsorSlug }}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-2.5 rounded-lg hover:bg-muted font-bold text-xs text-foreground uppercase tracking-wider"
                      >
                        Seja Distribuidor
                      </Link>
                      <Link 
                        to="/loja/$slug" 
                        params={{ slug: sponsorSlug }}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-2.5 rounded-lg hover:bg-muted font-bold text-xs text-foreground uppercase tracking-wider"
                      >
                        Loja
                      </Link>
                    </>
                  )}
                </div>

                <div className="border-t border-border/10 pt-3 grid grid-cols-2 gap-2">
                  <Link 
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="h-9 rounded-lg border border-border flex items-center justify-center gap-1 text-xs font-bold text-foreground hover:bg-muted"
                  >
                    <LogIn className="h-3.5 w-3.5 text-emerald-400" />
                    Entrar
                  </Link>
                  <Link 
                    to="/cadastro"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="h-9 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-400 flex items-center justify-center gap-1 text-xs font-bold text-black"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    Cadastrar-se
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* CARRINHO SIDEBAR (BLUR DRAWER) */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Dark back-blur backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 cursor-pointer"
            />

            {/* Sidebar main shell */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              id="shopping-sidebar-container"
              className="fixed top-0 bottom-0 right-0 w-full max-w-[390px] bg-[#070b13] border-l border-zinc-800 z-55 flex flex-col justify-between shadow-2xl overflow-hidden font-sans"
            >
              {/* Sidebar Header */}
              <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/40">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-emerald-400" />
                  <h2 className="text-md font-bold text-white uppercase tracking-wider">Seu Carrinho</h2>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="h-8.5 w-8.5 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Items scroll view */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <div className="h-16 w-16 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800">
                      <ShoppingBag className="h-7 w-7 text-zinc-650" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-white">Carrinho Vazio</p>
                      <p className="text-xs text-zinc-400 max-w-[200px] mx-auto">Sua sacola está aguardando os melhores bioativos.</p>
                    </div>
                    <Link
                      to="/loja/$slug"
                      params={{ slug: sponsorSlug }}
                      onClick={() => setIsCartOpen(false)}
                      className="inline-flex h-9 px-4 rounded-lg bg-emerald-500 text-black text-xs font-bold items-center gap-1 hover:bg-emerald-400 transition-colors cursor-pointer pt-0.5"
                    >
                      Ver Loja Virtual
                    </Link>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div 
                      key={item.product.id} 
                      className="p-3 bg-zinc-950/50 rounded-xl border border-zinc-800 flex gap-3 relative"
                    >
                      <img 
                        src={item.product.id === "prd_1" ? "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=100" :
                             item.product.id === "prd_2" ? "https://images.unsplash.com/photo-1512152272829-e3139592d56f?auto=format&fit=crop&q=80&w=100" :
                             item.product.id === "prd_3" ? "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=100" :
                             "https://images.unsplash.com/photo-1626847037657-fd3622613ce3?auto=format&fit=crop&q=80&w=100"} 
                        alt={item.product.name} 
                        className="w-16 h-16 object-cover rounded-lg shrink-0 border border-zinc-800"
                      />
                      <div className="flex-1 min-w-0 pr-4 space-y-1">
                        <span className="text-[9px] font-bold font-mono text-[#a855f7] bg-purple-500/10 px-1.5 py-0.5 rounded-md leading-none uppercase">
                          {item.product.category}
                        </span>
                        <h4 className="text-xs font-bold text-white truncate">{item.product.name}</h4>
                        <div className="flex justify-between items-center pt-1">
                          <span className="text-xs font-mono font-bold text-emerald-450">{formatBRL(item.product.price)}</span>
                          
                          {/* Stepper buttons */}
                          <div className="flex items-center gap-1.5 border border-zinc-800 rounded-md bg-zinc-900 p-0.5">
                            <button 
                              onClick={() => updateCartQuantity(item.product.id, -1)}
                              className="h-5 w-5 rounded bg-zinc-950 text-zinc-300 hover:text-white flex items-center justify-center"
                            >
                              <Minus className="h-2.5 w-2.5" />
                            </button>
                            <span className="text-[10px] font-bold font-mono px-1 text-white">{item.quantity}</span>
                            <button 
                              onClick={() => updateCartQuantity(item.product.id, 1)}
                              className="h-5 w-5 rounded bg-zinc-950 text-zinc-300 hover:text-white flex items-center justify-center"
                            >
                              <Plus className="h-2.5 w-2.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Trash */}
                      <button 
                        onClick={() => removeCartItem(item.product.id)}
                        className="absolute top-2 right-2 h-6 w-6 rounded hover:bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Sidebar Footer */}
              {cart.length > 0 && (
                <div className="p-5 border-t border-zinc-805 bg-zinc-950/40 space-y-4">
                  <div className="space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between text-zinc-400">
                      <span>Subtotal:</span>
                      <strong className="text-white font-bold">{formatBRL(subtotal)}</strong>
                    </div>
                    <div className="flex justify-between text-emerald-400">
                      <span>Frete Express:</span>
                      <strong className="font-bold uppercase tracking-wider">{subtotal > 300 ? "Grátis" : "R$ 25,00"}</strong>
                    </div>
                    <div className="border-t border-zinc-800 my-1 pt-1.5 flex justify-between text-white text-md font-sans">
                      <span className="font-bold">Total Estimado:</span>
                      <strong className="text-emerald-400 font-extrabold">{formatBRL(subtotal > 300 ? subtotal : subtotal + 25)}</strong>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={navigateToCheckout}
                      className="w-full h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/10 cursor-pointer pt-0.5"
                    >
                      Finalizar Pedido <ArrowRight className="h-4 w-4" />
                    </button>
                    <p className="text-[10px] text-zinc-500 text-center flex items-center justify-center gap-1">
                      <ShieldCheck className="h-3 w-3 text-emerald-500" /> Checkout seguro integrado à rede All-In Life
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
