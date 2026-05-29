import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard, Users, Network, ShoppingBag, Wallet, Megaphone,
  Sparkles, Settings2, LineChart, Bell, Boxes, ShieldCheck, Layers, LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth, usePermissions } from "@/lib/auth-context";
import { toast } from "sonner";

type NavItem = { 
  to: string; 
  label: string; 
  icon: React.ComponentType<{ className?: string }>; 
  badge?: string;
  module: "dashboard" | "analytics" | "finance" | "support" | "network" | "orders" | "products" | "marketing" | "settings" | "system";
};

type Section = { 
  label: string; 
  items: NavItem[] 
};

const sections: Section[] = [
  {
    label: "Executive",
    items: [
      { to: "/", label: "Dashboard", icon: LayoutDashboard, module: "dashboard" },
      { to: "/analytics", label: "Analytics", icon: LineChart, module: "analytics" },
      { to: "/insights", label: "Insights", icon: Sparkles, badge: "5", module: "analytics" },
      { to: "/alerts", label: "Alertas", icon: Bell, badge: "3", module: "dashboard" },
    ],
  },
  {
    label: "CRM",
    items: [
      { to: "/customers", label: "Distribuidores", icon: Users, module: "support" },
    ],
  },
  {
    label: "Rede MLM",
    items: [
      { to: "/network", label: "Genealogia", icon: Network, module: "network" },
      { to: "/commissions", label: "Comissões", icon: Wallet, module: "finance" },
    ],
  },
  {
    label: "Comercial",
    items: [
      { to: "/orders", label: "Pedidos", icon: ShoppingBag, module: "orders" },
      { to: "/products", label: "Produtos", icon: Boxes, module: "products" },
      { to: "/plans", label: "Planos MLM", icon: Layers, module: "products" },
    ],
  },
  {
    label: "Financeiro",
    items: [
      { to: "/wallets", label: "Carteiras & Saques", icon: Wallet, module: "finance" },
    ],
  },
  {
    label: "Marketing",
    items: [
      { to: "/marketing", label: "Campanhas", icon: Megaphone, module: "marketing" },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { to: "/copilot", label: "Copiloto IA", icon: Sparkles, module: "dashboard" },
    ],
  },
  {
    label: "Sistema",
    items: [
      { to: "/system", label: "Admin & Auditoria", icon: ShieldCheck, module: "system" },
      { to: "/settings", label: "Configurações", icon: Settings2, module: "settings" },
    ],
  },
];

export function SidebarNav() {
  const { location } = useRouterState();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { hasPermission } = usePermissions();
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

  // Filter sections and their items dynamically based on current user permissions
  const filteredSections = sections
    .map((s) => {
      const allowedItems = s.items.filter((it) => hasPermission(it.module, "read"));
      return {
        ...s,
        items: allowedItems,
      };
    })
    .filter((s) => s.items.length > 0);

  // Translate role slug to localized corporate title
  const getRoleLabel = (role: string) => {
    const roles: Record<string, string> = {
      admin_master: "Admin Master",
      finance: "Diretor Financeiro",
      support: "Suporte Técnico",
      gestão_admin: "Gestor Administrativo",
      financeiro: "Diretor Financeiro",
      suporte: "Gerente de Suporte",
      logística: "Gestor Logístico",
      marketing: "Coord. Marketing",
      analytics: "Eng. Analytics",
      auditor: "Auditor Estrito",
      operador: "Operador de Staff"
    };
    return roles[role] || role;
  };

  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="flex h-14 items-center gap-2 px-4 border-b border-sidebar-border">
        <div className="h-7 w-7 rounded-md bg-gradient-to-br from-primary to-fuchsia-500 grid place-items-center text-primary-foreground font-bold font-sans">A</div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold text-white">Allin OS</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono">Enterprise</span>
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {filteredSections.map((s) => (
          <div key={s.label}>
            <div className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
              {s.label}
            </div>
            <ul className="space-y-0.5">
              {s.items.map((it) => {
                const active = it.to === "/" ? path === "/" : path.startsWith(it.to);
                const Icon = it.icon;
                return (
                  <li key={it.to}>
                    <Link
                      to={it.to}
                      className={cn(
                        "group flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors",
                        active
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                      )}
                    >
                      <Icon className={cn("h-4 w-4", active ? "text-primary" : "text-muted-foreground")} />
                      <span className="flex-1">{it.label}</span>
                      {it.badge && (
                        <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                          {it.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Corporate profile segment with logout trigger */}
      {user && (
        <div className="p-3 border-t border-sidebar-border space-y-2">
          <div className="rounded-lg bg-sidebar-accent/50 border border-border/45 p-2.5 flex items-center gap-2.5">
            <img 
              src={user.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=Admin"} 
              alt={user.name} 
              className="h-7 w-7 rounded-full border border-primary/20 bg-background"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 min-w-0 leading-tight">
              <p className="text-xs font-semibold text-white truncate">{user.name}</p>
              <span className="text-[9px] font-bold text-primary uppercase tracking-wider block font-mono">
                {getRoleLabel(user.role)}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="p-1 rounded-md text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
              title="Encerrar Sessão"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
