import React, { useState } from "react";
import { useAuth, User, UserRole } from "@/lib/auth-context";
import { 
  Users, Search, Shield, Filter, UserX, UserCheck, ShieldAlert,
  Fingerprint, Calendar, ArrowUpDown, ChevronLeft, ChevronRight, Ban
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";

// Translate role slug to corporate localized description
export const getRoleLabel = (role: string): string => {
  const roles: Record<string, string> = {
    admin_master: "Admin Master",
    finance: "Diretor Financeiro",
    support: "Suporte Técnico",
    distributor: "Distribuidor",
    customer: "Cliente Final",
    gestão_admin: "Gestor Administrativo",
    financeiro: "Analista Financeiro",
    suporte: "Suporte Técnico",
    logística: "Gestor Logístico",
    marketing: "Coord. Marketing",
    analytics: "Eng. Analytics",
    auditor: "Auditor Estrito",
    operador: "Operador de Caixa"
  };
  return roles[role] || role;
};

export const getRoleBadgeStyle = (role: string): string => {
  if (role === "admin_master" || role === "gestão_admin") {
    return "bg-rose-500/15 text-rose-400 border-rose-500/30";
  }
  if (role === "finance" || role === "financeiro") {
    return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
  }
  if (role === "support" || role === "suporte") {
    return "bg-cyan-500/15 text-cyan-400 border-cyan-500/30";
  }
  if (role === "auditor" || role === "analytics") {
    return "bg-purple-500/15 text-purple-400 border-purple-500/30";
  }
  if (role === "logística" || role === "operador" || role === "marketing") {
    return "bg-amber-500/15 text-amber-400 border-amber-500/30";
  }
  return "bg-slate-500/15 text-slate-400 border-slate-500/20";
};

export function UserManagement() {
  const { usersList, changeUserRole, updateProfile, deleteUserAndInviteSession, user: currentUser } = useAuth();
  
  // States for search, filtering, pagination
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  // Sort state
  const [sortField, setSortField] = useState<keyof User>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const toggleSort = (field: keyof User) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Status transitions
  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    if (userId === currentUser?.id) {
      toast.error("Operação negada: Você não pode suspender sua própria conta.");
      return;
    }

    try {
      const nextStatus = currentStatus === "active" ? "suspended" : "active";
      // We simulate update profile through context triggers
      const updatedList = usersList.map((u) => {
        if (u.id === userId) {
          const updated = { ...u, status: nextStatus as "active" | "suspended" | "pending", active: nextStatus === "active" };
          localStorage.setItem("allin_users", JSON.stringify(
            usersList.map((usr) => (usr.id === userId ? updated : usr))
          ));
          return updated;
        }
        return u;
      });
      
      // Update local storage and force reload page states
      window.dispatchEvent(new Event("storage"));
      
      // Since it's local simulated storage, let's update state manually if required or notify success
      toast.success(
        `Usuário ${nextStatus === "active" ? "reativado" : "suspenso"} com sucesso!`
      );
      // Let's force a state refresh if the user refreshes or triggers reload
      setTimeout(() => { window.location.reload(); }, 600);
    } catch (err) {
      toast.error("Erro ao modificar status do usuário.");
    }
  };

  // Modify roles directly
  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    if (userId === currentUser?.id) {
      toast.error("Operação negada: Você não pode rebaixar sua própria role master.");
      return;
    }

    try {
      await changeUserRole(userId, newRole);
      toast.success("Privilégios atualizados com sucesso!");
      setTimeout(() => { window.location.reload(); }, 600);
    } catch (err: any) {
      toast.error(err.message || "Sem permissão para reatribuir níveis.");
    }
  };

  // Filter application users
  const filteredUsers = usersList.filter((u) => {
    const matchesSearch = 
      u.name.toLowerCase().includes(search.toLowerCase()) || 
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.phone && u.phone.includes(search));
    
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const matchesStatus = statusFilter === "all" || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Sort
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const valA = a[sortField] || "";
    const valB = b[sortField] || "";
    
    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalItems = sortedUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = sortedUsers.slice(startIndex, startIndex + itemsPerPage);

  // Clean-up simulation items
  const handleRemoveSimulation = (userId: string) => {
    if (userId === currentUser?.id) {
      toast.error("Você não pode remover a si mesmo da própria simulação ativa.");
      return;
    }
    deleteUserAndInviteSession(userId);
    toast.success("Simulador limpado. Instância removida da persistência de mentira.");
    setTimeout(() => { window.location.reload(); }, 600);
  };

  return (
    <div className="space-y-4">
      {/* Filters toolbar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar por nome, e-mail..." 
            className="pl-9 bg-background/50"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto items-center justify-end">
          <div className="flex items-center gap-1.5 bg-card/40 border border-border px-2.5 py-1.5 rounded-lg text-xs font-medium">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-muted-foreground/80">Filtrar:</span>
          </div>

          <Select value={roleFilter} onValueChange={(val) => { setRoleFilter(val); setCurrentPage(1); }}>
            <SelectTrigger className="w-40 bg-card/60 border-border text-xs h-9">
              <SelectValue placeholder="Cargo / Nível" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Roles</SelectItem>
              <SelectItem value="admin_master">Admin Master</SelectItem>
              <SelectItem value="gestão_admin">Gestão Admin</SelectItem>
              <SelectItem value="financeiro">Financeiro</SelectItem>
              <SelectItem value="suporte">Suporte Técnico</SelectItem>
              <SelectItem value="logística">Logística</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="analytics">Analytics</SelectItem>
              <SelectItem value="auditor">Auditor</SelectItem>
              <SelectItem value="operador">Operador (Staff)</SelectItem>
              <SelectItem value="distributor">Distribuidor MLM</SelectItem>
              <SelectItem value="customer">Cliente Final</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); setCurrentPage(1); }}>
            <SelectTrigger className="w-36 bg-card/60 border-border text-xs h-9">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="active">Ativo</SelectItem>
              <SelectItem value="suspended">Suspenso</SelectItem>
              <SelectItem value="pending">Pendente (Simulado)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-xl border border-border bg-card/40 overflow-hidden">
        <div className="px-4 py-3 bg-card/60 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Usuários Administrativos Integrados ({totalItems})</h3>
          </div>
          <Badge variant="outline" className="text-[10px] font-mono border-emerald-500/20 text-emerald-400 bg-emerald-500/5">
            Supabase Auth + RBAC ativo
          </Badge>
        </div>

        {totalItems === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <UserX className="h-10 w-10 text-muted-foreground/40 mb-3" />
            <p className="text-sm font-medium text-muted-foreground">Nenhum administrador encontrado.</p>
            <p className="text-xs text-muted-foreground/60">Tente ajustar seus termos de busca ou filtros de cargos.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#0b0f19]/80 border-b border-border/80 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left cursor-pointer hover:text-white" onClick={() => toggleSort("name")}>
                    <span className="flex items-center gap-1">Nome {sortField === "name" && <ArrowUpDown className="h-3 w-3" />}</span>
                  </th>
                  <th className="px-4 py-3 text-left">Função Comercial / Role</th>
                  <th className="px-4 py-3 text-left">Identificador UID</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left cursor-pointer hover:text-white" onClick={() => toggleSort("created_at")}>
                    <span className="flex items-center gap-1">Ativação {sortField === "created_at" && <ArrowUpDown className="h-3 w-3" />}</span>
                  </th>
                  <th className="px-4 py-3 text-right">Aparência & Ações Rápidas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {paginatedUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-accent/20 transition-colors group">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-slate-800/80 border border-border flex items-center justify-center font-bold text-xs text-white uppercase shrink-0">
                          {u.avatar ? (
                            <img src={u.avatar} className="h-full w-full rounded-full object-crop" referrerPolicy="no-referrer" alt="" />
                          ) : (
                            u.name.substring(0, 2)
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-medium text-white truncate max-w-[160px]">{u.name}</span>
                          <span className="text-xs text-muted-foreground font-mono truncate max-w-[160px]">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-4 py-3.5">
                      <div className="flex flex-col gap-1">
                        <Badge variant="outline" className={`w-fit text-[10px] font-medium leading-none py-1 px-1.5 ${getRoleBadgeStyle(u.role)}`}>
                          <Shield className="h-2.5 w-2.5 mr-1" />
                          {getRoleLabel(u.role)}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground/60 italic font-mono">
                          {ROLE_PERMISSIONS_SUMMARY[u.role] || "Acesso de leitura"}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1 text-[11px] font-mono text-muted-foreground/80 max-w-[120px] truncate">
                        <Fingerprint className="h-3 w-3 text-muted-foreground/40 shrink-0" />
                        <span className="truncate">{u.id}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      {u.status === "active" ? (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Ativo
                        </span>
                      ) : u.status === "suspended" ? (
                        <span className="inline-flex items-center gap-1 text-xs text-rose-400 font-medium">
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                          Suspenso
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-400 font-medium">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                          Pendente
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex flex-col text-[11px] text-muted-foreground font-mono leading-tight">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground/40" />
                          {new Date(u.created_at).toLocaleDateString("pt-BR")}
                        </span>
                        <span className="text-[10px] opacity-65">
                          Login: {u.last_login ? new Date(u.last_login).toLocaleTimeString("pt-BR", {hour:"2-digit", minute:"2-digit"}) : "Nunca"}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                        {/* Manage privileges dropdown */}
                        <Select 
                          value={u.role} 
                          onValueChange={(val) => handleRoleChange(u.id, val as UserRole)}
                          disabled={u.id === currentUser?.id || currentUser?.role !== "admin_master"}
                        >
                          <SelectTrigger className="w-28 bg-transparent hover:bg-slate-800 border-none text-[11px] h-7 px-1.5 text-muted-foreground hover:text-white">
                            <span className="truncate">Atribuir</span>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin_master">Admin Master</SelectItem>
                            <SelectItem value="gestão_admin">Gestão Admin</SelectItem>
                            <SelectItem value="financeiro">Financeiro</SelectItem>
                            <SelectItem value="suporte">Suporte Técnico</SelectItem>
                            <SelectItem value="logística">Logística</SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                            <SelectItem value="analytics">Analytics</SelectItem>
                            <SelectItem value="auditor">Auditor</SelectItem>
                            <SelectItem value="operador">Operador</SelectItem>
                          </SelectContent>
                        </Select>

                        {/* Ban / Active toggle */}
                        {u.id !== currentUser?.id && (
                          <button
                            onClick={() => handleToggleStatus(u.id, u.status)}
                            className={`p-1.5 rounded-md border text-xs leading-none transition-colors ${
                              u.status === "active"
                                ? "border-rose-500/20 text-rose-400 hover:bg-rose-500/10"
                                : "border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10"
                            }`}
                            title={u.status === "active" ? "Suspender Acesso" : "Reativar Acesso"}
                          >
                            {u.status === "active" ? <Ban className="h-3.5 w-3.5" /> : <UserCheck className="h-3.5 w-3.5" />}
                          </button>
                        )}

                        {/* Delete Simulator instance */}
                        {u.id.startsWith("user-admin-") && u.id !== currentUser?.id && (
                          <button
                            onClick={() => handleRemoveSimulation(u.id)}
                            className="p-1.5 rounded-md border border-slate-700/65 text-slate-400 hover:bg-rose-500/20 hover:text-white hover:border-rose-500/40 transition-colors"
                            title="Limpar Instância Simulador"
                          >
                            <UserX className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Table footer paging */}
        {totalPages > 1 && (
          <div className="px-4 py-2 border-t border-border flex items-center justify-between text-xs bg-slate-900/45">
            <span className="text-muted-foreground font-medium">
              Página <span className="text-white font-semibold">{currentPage}</span> de <span className="text-white font-semibold">{totalPages}</span> ({totalItems} registros)
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(c => Math.max(1, c - 1))}
                className="p-1.5 rounded-md border border-border text-muted-foreground hover:text-white hover:bg-slate-800 disabled:opacity-40"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(c => Math.min(totalPages, c + 1))}
                className="p-1.5 rounded-md border border-border text-muted-foreground hover:text-white hover:bg-slate-800 disabled:opacity-40"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Summary description of each RBAC level in enterprise format
const ROLE_PERMISSIONS_SUMMARY: Record<string, string> = {
  admin_master: "Acesso global total, gerência do banco & escalações.",
  gestão_admin: "Controle da equipe, produtos, marketing e pedidos.",
  financeiro: "Conciliações, pagamentos de bônus e saques.",
  suporte: "Análise de KYC, tickets administrativos e logs.",
  logística: "Gestão operacional de expedição e transportadoras.",
  marketing: "Painel de campanhas e banners comerciais.",
  analytics: "Disparo e acompanhamento de relatórios executivos.",
  auditor: "Acesso read-only estrito em logs e trilhas.",
  operador: "Aprovação rápida e faturamento operacional de pedidos."
};
