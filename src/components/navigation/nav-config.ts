import type { ComponentType } from "react";
import {
  LayoutDashboard,
  Users,
  Network,
  ShoppingBag,
  Wallet,
  Megaphone,
  Sparkles,
  Settings2,
  LineChart,
  Bell,
  Boxes,
  ShieldCheck,
  Layers,
  FolderDown,
  FileText,
  Store,
  Crown,
  UserCheck,
} from "lucide-react";

export type NavModule =
  | "dashboard"
  | "analytics"
  | "finance"
  | "support"
  | "network"
  | "orders"
  | "products"
  | "marketing"
  | "settings"
  | "system";

export type NavItem = {
  to: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  badge?: string;
  module: NavModule;
};

export type NavSection = {
  label: string;
  items: NavItem[];
};

export const ADMIN_NAV_SECTIONS: NavSection[] = [
  {
    label: "Executivo",
    items: [
      { to: "/", label: "Dashboard", icon: LayoutDashboard, module: "dashboard" },
      { to: "/analytics", label: "Analytics", icon: LineChart, module: "analytics" },
      { to: "/insights", label: "Insights", icon: Sparkles, badge: "5", module: "analytics" },
      { to: "/alerts", label: "Alertas", icon: Bell, badge: "3", module: "dashboard" },
    ],
  },
  {
    label: "CRM",
    items: [{ to: "/customers", label: "Distribuidores", icon: Users, module: "support" }],
  },
  {
    label: "Rede e Comercial",
    items: [
      { to: "/network", label: "Genealogia", icon: Network, module: "network" },
      { to: "/commissions", label: "Comissões", icon: Wallet, module: "finance" },
      { to: "/orders", label: "Pedidos", icon: ShoppingBag, module: "orders" },
      { to: "/products", label: "Produtos", icon: Boxes, module: "products" },
      { to: "/plans", label: "Planos", icon: Layers, module: "products" },
    ],
  },
  {
    label: "Financeiro",
    items: [{ to: "/wallets", label: "Carteiras & Saques", icon: Wallet, module: "finance" }],
  },
  {
    label: "Marketing",
    items: [{ to: "/marketing", label: "Campanhas", icon: Megaphone, module: "marketing" }],
  },
  {
    label: "Inteligência",
    items: [{ to: "/copilot", label: "Copiloto IA", icon: Sparkles, module: "dashboard" }],
  },
  {
    label: "Sistema",
    items: [
      { to: "/system", label: "Admin & Auditoria", icon: ShieldCheck, module: "system" },
      { to: "/settings", label: "Configurações", icon: Settings2, module: "settings" },
      { to: "/evolution", label: "Evolution", icon: FileText, module: "system" },
    ],
  },
];

export const OFFICE_NAV_ITEMS: NavItem[] = [
  { to: "/office", label: "Página Inicial", icon: LayoutDashboard, module: "dashboard" },
  { to: "/office/plan", label: "Meu Plano", icon: Crown, module: "dashboard" },
  { to: "/office/orders", label: "Pedidos", icon: ShoppingBag, module: "orders" },
  { to: "/office/store", label: "Loja Virtual", icon: Store, module: "orders" },
  { to: "/office/finance", label: "Financeiro", icon: Wallet, module: "finance" },
  { to: "/office/network", label: "Rede", icon: Network, module: "network" },
  { to: "/office/reports", label: "Relatórios", icon: LineChart, module: "analytics" },
  { to: "/office/downloads", label: "Downloads", icon: FolderDown, module: "products" },
  { to: "/office/verification", label: "Verificação de Conta", icon: UserCheck, module: "support" },
];
