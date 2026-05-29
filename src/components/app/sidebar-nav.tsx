import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth, usePermissions } from "@/lib/auth-context";
import { ADMIN_NAV_SECTIONS } from "@/components/navigation/nav-config";

const ROLE_LABELS: Record<string, string> = {
  admin_master: "Admin Master",
  finance: "Financeiro",
  support: "Suporte",
  gestão_admin: "Gestão Administrativa",
  financeiro: "Diretoria Financeira",
  suporte: "Suporte Operacional",
  logística: "Logística",
  marketing: "Marketing",
  analytics: "Analytics",
  auditor: "Auditoria",
  operador: "Operações",
};

export function SidebarNav() {
  const { location } = useRouterState();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { hasPermission } = usePermissions();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Sessão finalizada com sucesso!");
      navigate({ to: "/login" });
    } catch {
      toast.error("Erro ao encerrar sessão.");
    }
  };

  const filteredSections = ADMIN_NAV_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter((item) => hasPermission(item.module, "read")),
  })).filter((section) => section.items.length > 0);

  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
        <div className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-primary to-fuchsia-500 font-bold text-primary-foreground">
          A
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold text-white">Allin OS</span>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Admin</span>
        </div>
      </div>

      <nav className="flex-1 space-y-4 overflow-y-auto px-2 py-3">
        {filteredSections.map((section) => (
          <div key={section.label}>
            <div className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
              {section.label}
            </div>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active = item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to);
                const Icon = item.icon;
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className={cn(
                        "group flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors",
                        active
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                      )}
                    >
                      <Icon className={cn("h-4 w-4", active ? "text-primary" : "text-muted-foreground")} />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                          {item.badge}
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

      {user && (
        <div className="space-y-2 border-t border-sidebar-border p-3">
          <div className="rounded-lg border border-border/45 bg-sidebar-accent/50 p-2.5">
            <p className="truncate text-xs font-semibold text-white">{user.name}</p>
            <p className="text-[9px] font-bold uppercase tracking-wider text-primary">
              {ROLE_LABELS[user.role] || user.role}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-border/60 px-3 py-2 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sair
          </button>
        </div>
      )}
    </aside>
  );
}
