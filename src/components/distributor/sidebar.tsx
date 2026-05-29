import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LogOut, Sparkles, Crown } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { OFFICE_NAV_ITEMS } from "@/components/navigation/nav-config";

export function OfficeSidebar() {
  const { location } = useRouterState();
  const navigate = useNavigate();
  const { user, distributorProfile, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Sessão finalizada com sucesso!");
      navigate({ to: "/login" });
    } catch {
      toast.error("Erro ao encerrar sessão.");
    }
  };

  const displayName = user?.name || "Distribuidor";
  const displayQualification = distributorProfile?.qualification || "Distribuidor Pendente";
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-5">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary via-fuchsia-500 to-cyan-400 font-bold text-primary-foreground shadow-lg shadow-primary/30">
          A
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold">Allin Office</span>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Distributor Office</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
          Navegação
        </div>
        <ul className="space-y-0.5">
          {OFFICE_NAV_ITEMS.map((item) => {
            const active = item.to === "/office" ? location.pathname === "/office" || location.pathname === "/office/" : location.pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-all",
                    active
                      ? "bg-gradient-to-r from-primary/20 to-transparent text-foreground"
                      : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                  )}
                >
                  {active && <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-primary" />}
                  <Icon className={cn("h-4 w-4 shrink-0", active ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                  <span className="flex-1">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 px-2 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
          Inteligência
        </div>
        <Link
          to="/office/copilot"
          className={cn(
            "flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-all",
            location.pathname.startsWith("/office/copilot")
              ? "bg-gradient-to-r from-primary/20 to-transparent text-foreground"
              : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60",
          )}
        >
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="flex-1">Copiloto IA</span>
          <span className="rounded-full bg-primary/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary">
            Beta
          </span>
        </Link>
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/15 via-fuchsia-500/10 to-transparent p-3">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-fuchsia-500 text-xs font-bold text-primary-foreground uppercase">
              {initials}
            </div>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-xs font-semibold text-white">{displayName}</p>
              <p className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Crown className="h-2.5 w-2.5 text-primary" />
                {displayQualification}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-all hover:bg-rose-500/10 hover:text-rose-400"
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
