import { Outlet, createFileRoute } from "@tanstack/react-router";
import { OfficeSidebar } from "@/components/distributor/sidebar";
import { OfficeTopbar } from "@/components/distributor/topbar";
import { RouteGuard } from "@/lib/auth-guards";

export const Route = createFileRoute("/office")({
  component: OfficeLayoutSecure,
});

function OfficeLayoutSecure() {
  return (
    <RouteGuard allowedRoles={["distributor", "customer"]}>
      <OfficeLayout />
    </RouteGuard>
  );
}

function OfficeLayout() {
  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <OfficeSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <OfficeTopbar />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1500px] px-4 md:px-8 py-6 md:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
