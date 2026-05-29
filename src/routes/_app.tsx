import { Outlet, createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SidebarNav } from "@/components/app/sidebar-nav";
import { Topbar } from "@/components/app/topbar";
import { CopilotDrawer } from "@/components/app/copilot-drawer";
import { RouteGuard } from "@/lib/auth-context";

export const Route = createFileRoute("/_app")({
  component: AppLayoutSecure,
});

function AppLayoutSecure() {
  return (
    <RouteGuard allowedRoles={["admin_master", "finance", "support"]}>
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
