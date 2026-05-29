import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useAuth, normalizeUserRole, type Permission, type UserRole } from "@/lib/auth-context";

interface GuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requiredPermission?: { module: Permission["module"]; action?: Permission["action"] };
}

export const RouteGuard: React.FC<GuardProps> = ({ children, allowedRoles, requiredPermission }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const allowedRolesRef = useRef(allowedRoles);
  const requiredPermissionRef = useRef(requiredPermission);

  // Update refs when props change
  useEffect(() => {
    allowedRolesRef.current = allowedRoles;
    requiredPermissionRef.current = requiredPermission;
  }, [allowedRoles, requiredPermission]);

  useEffect(() => {
    if (!loading) {
      if (!user && location.pathname !== "/login") {
        navigate({ to: "/login" });
        return;
      }

      if (user) {
        const normalizedRole = normalizeUserRole(user.role);

        if (allowedRolesRef.current && !allowedRolesRef.current.includes(user.role)) {
          const targetRoute = normalizedRole === "distributor" ? "/office" : 
                            normalizedRole === "customer" ? "/office/store" : "/";
          if (location.pathname !== targetRoute) {
            navigate({ to: targetRoute });
          }
          return;
        }

        if (requiredPermissionRef.current && user.role !== "admin_master" && location.pathname !== "/") {
          navigate({ to: "/" });
        }
      }
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#07090e] text-white">
        <div className="relative flex items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent" />
          <div className="absolute h-6 w-6 animate-ping rounded-full bg-primary/20" />
        </div>
        <p className="mt-4 text-xs font-mono uppercase tracking-wider text-muted-foreground">
          Iniciando ambiente de segurança...
        </p>
      </div>
    );
  }

  if (!user) return null;
  if (allowedRoles && !allowedRoles.includes(user.role)) return null;
  if (requiredPermission && !hasPermission(requiredPermission.module, requiredPermission.action || "read")) return null;

  return <>{children}</>;
};

export const RoleGuard: React.FC<{ children: React.ReactNode; allowedRoles: UserRole[]; fallback?: React.ReactNode }> = ({
  children,
  allowedRoles,
  fallback = null,
}) => {
  const { user } = useAuth();
  if (!user || !allowedRoles.includes(user.role) && !allowedRoles.includes(normalizeUserRole(user.role))) {
    return <>{fallback}</>;
  }
  return <>{children}</>;
};

export const PermissionGuard: React.FC<{
  children: React.ReactNode;
  module: Permission["module"];
  action?: Permission["action"];
  fallback?: React.ReactNode;
}> = ({ children, module, action = "read", fallback = null }) => {
  const { hasPermission } = usePermissions();
  if (!hasPermission(module, action)) {
    return <>{fallback}</>;
  }
  return <>{children}</>;
};
