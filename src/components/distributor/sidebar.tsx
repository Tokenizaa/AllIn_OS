import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard, Package, ShoppingBag, Store, Wallet, Network,
  BarChart3, Download, User, ShieldCheck, Sparkles, Crown, LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/modules/auth";
import { toast } from "sonner";

const items = [
  { to: "/office", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/office/plan", label: "Meu Plano", icon: Crown },
  { to: "/office/orders", label: "Pedidos", icon: ShoppingBag },
  { to: "/office/store", label: "Loja Virtual", icon: Store },
  { to: "/office/finance", label: "Financeiro", icon: Wallet },
  { to: "/office/network", label: "Minha Rede", icon: Network },
  { to: "/office/reports", label: "Relatórios", icon: BarChart3 },
  { to: "/office/downloads", label: "Downloads", icon: Download },
  { to: "/office/profile", label: "Meus Dados", icon: User },
  { to: "/office/verification", label: "Verificação", icon: ShieldCheck },
];

export function OfficeSidebar() {
  const { location } = useRouterState();
  const navigate = useNavigate();
  const { user, distributorProfile, logout } = useAuth();
  const path = location.pathname;

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Sessão finalizada com sucesso!");
      navigate({ to: "/login" });
    } catch (err) {
      toast.error("Erro ao encerrar sessão.");
    }
  };

  const displayName = user?.name || "Distribuidor";
  const displayQualification = distributorProfile?.qualification || "Distribuidor Pendente";
  const userInitials = displayName.split(" ").map((n) => n[0]).slice(0, 2).join("");

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center gap-3 px-5 border-b border-sidebar-border">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary via-fuchsia-500 to-cyan-400 grid place-items-center text-primary-foreground font-bold shadow-lg shadow-primary/30">A</div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold">Allin Office</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Distribuidor</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">Navegação</div>
        <ul className="space-y-0.5">
          {items.map((it) => {
            const active = it.exact ? path === it.to : path.startsWith(it.to) && it.to !== "/office";
            const isActive = it.exact ? path === it.to : active;
            const Icon = it.icon;
            return (
              <li key={it.to}>
                <Link
                  to={it.to}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-all",
                    isActive
                      ? "bg-gradient-to-r from-primary/20 to-transparent text-foreground"
                      : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                  )}
                >
                  {isActive && <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-primary" />}
                  <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                  <span className="flex-1">{it.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 px-2 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">Inteligência</div>
        <Link to="/office/copilot" className={cn(
          "flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-all",
          path.startsWith("/office/copilot")
            ? "bg-gradient-to-r from-primary/20 to-transparent text-foreground"
            : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60",
        )}>
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="flex-1">Copiloto IA</span>
          <span className="rounded-full bg-primary/20 px-1.5 py-0.5 text-[9px] font-bold text-primary uppercase tracking-wider">Beta</span>
        </Link>
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <div className="rounded-xl bg-gradient-to-br from-primary/15 via-fuchsia-500/10 to-transparent border border-primary/20 p-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-fuchsia-500 grid place-items-center text-xs font-bold text-primary-foreground shrink-0 uppercase">
              {userInitials}
            </div>
            <div className="flex-1 min-w-0 leading-tight">
              <p className="text-xs font-semibold truncate text-white">{displayName}</p>
              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Crown className="h-2.5 w-2.5 text-primary" /> {displayQualification}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-md text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer shrink-0"
              title="Sair do Escritório"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}