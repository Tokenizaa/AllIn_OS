import { Link } from "@tanstack/react-router";
import { Menu, Search, ShoppingCart, Sparkles, UserPlus, LogIn, X, Home, Store, User, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/lib/auth-context";
import { useState } from "react";

const publicLinks = [
  { to: "/", label: "Início", icon: Home },
  { to: "/loja", label: "Loja", icon: Store },
  { to: "/seja-distribuidor", label: "Seja Distribuidor", icon: Sparkles },
];

export function PublicSiteHeader() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Context-aware menu items based on user role
  const getMenuItems = () => {
    if (!user) {
      return publicLinks;
    }

    if (user.role === "distributor") {
      return [
        { to: "/office", label: "Minha Loja", icon: Store },
        { to: "/office", label: "Dashboard", icon: LayoutDashboard },
        { to: "/office/orders", label: "Meus Pedidos", icon: ShoppingCart },
        { to: "/office/network", label: "Minha Rede", icon: User },
      ];
    }

    if (user.role === "customer") {
      return [
        { to: "/office/orders", label: "Meus Pedidos", icon: ShoppingCart },
        { to: "/office/profile", label: "Perfil", icon: User },
      ];
    }

    // Admin/operator roles
    return [
      { to: "/_app", label: "Dashboard", icon: LayoutDashboard },
    ];
  };

  const menuItems = getMenuItems();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary via-fuchsia-500 to-cyan-400 font-black text-primary-foreground shadow-lg shadow-primary/20">
            A
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-tight">Allin OS</p>
            <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Enterprise Commerce</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden flex-1 items-center justify-center gap-1.5 lg:flex">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.to as never}
              className="rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground flex items-center gap-2"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="ml-auto hidden items-center gap-2 lg:flex">
          {!user ? (
            <>
              <Button variant="ghost" size="icon" aria-label="Buscar">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" asChild className="gap-2">
                <Link to="/seja-distribuidor">
                  <Sparkles className="h-4 w-4" />
                  Seja Distribuidor
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild className="gap-2">
                <Link to="/loja">
                  <ShoppingCart className="h-4 w-4" />
                  Loja
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">
                  <LogIn className="h-4 w-4" />
                  Entrar
                </Link>
              </Button>
              <Button size="sm" asChild className="gap-2">
                <Link to="/cadastro">
                  <UserPlus className="h-4 w-4" />
                  Criar Conta
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild className="gap-2">
                <Link to="/loja">
                  <ShoppingCart className="h-4 w-4" />
                  Loja
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => void logout()} className="gap-2">
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon" aria-label="Menu">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-primary via-fuchsia-500 to-cyan-400 font-black text-primary-foreground text-sm">
                    A
                  </div>
                  <span className="font-semibold">Allin OS</span>
                </div>
              </div>

              <nav className="flex-1 space-y-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.to as never}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="border-t border-border pt-4 space-y-2">
                {!user ? (
                  <>
                    <Button variant="outline" size="sm" asChild className="w-full gap-2">
                      <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                        <LogIn className="h-4 w-4" />
                        Entrar
                      </Link>
                    </Button>
                    <Button size="sm" asChild className="w-full gap-2">
                      <Link to="/cadastro" onClick={() => setMobileMenuOpen(false)}>
                        <UserPlus className="h-4 w-4" />
                        Criar Conta
                      </Link>
                    </Button>
                  </>
                ) : (
                  <Button variant="ghost" size="sm" onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full gap-2 justify-start">
                    <LogOut className="h-4 w-4" />
                    Sair
                  </Button>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
