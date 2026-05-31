import { Outlet, createFileRoute, useLocation, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SidebarNav } from "@/components/app/sidebar-nav";
import { Topbar } from "@/components/app/topbar";
import { CopilotDrawer } from "@/components/app/copilot-drawer";
import { RouteGuard, useAuth } from "@/lib/auth-context";
import { UserRole } from "@/shared/types/roles";

export const Route = createFileRoute("/_app")({
  component: AppLayoutSecure,
});

function AppLayoutSecure() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#06080d]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  const isSpecialAdmin = user && [UserRole.ADMIN_MASTER, UserRole.GESTAO_ADMIN, UserRole.FINANCEIRO, UserRole.SUPORTE].includes(user.role);
  
  if (location.pathname === "/" && !isSpecialAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#06080d]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Acesso Restrito</h1>
          <p className="text-gray-400 mb-6">Você não tem permissão para acessar esta página.</p>
          <Link to="/" className="text-emerald-400 hover:underline">Voltar para a página inicial</Link>
        </div>
      </div>
    );
  }

  return (
    <RouteGuard allowedRoles={[UserRole.ADMIN_MASTER, UserRole.GESTAO_ADMIN, UserRole.FINANCEIRO, UserRole.SUPORTE]}>
      <AppLayout />
    </RouteGuard>
  );
}

function AppLayout() {
  const [copilotOpen, setCopilotOpen] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCopilotOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <SidebarNav />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onCopilot={() => setCopilotOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1600px] px-4 md:px-8 py-6 md:py-8">
            <Outlet />
          </div>
        </main>
      </div>
      <CopilotDrawer open={copilotOpen} onOpenChange={setCopilotOpen} />
    </div>
  );
}
