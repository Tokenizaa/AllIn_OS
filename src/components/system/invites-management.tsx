import React, { useState } from "react";
import { useAuth, AdminInvite, UserRole } from "@/modules/auth";
import { 
  Mail, Search, Shield, Plus, CheckCircle2, Clock, XCircle, ShieldOff2,
  Copy, Check, Trash2, Send, RefreshCw, Layers, Checkbox, Info, ToggleLeft, HelpCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter 
} from "@/components/ui/dialog";
import { getRoleLabel, getRoleBadgeStyle } from "./user-management";
import { toast } from "sonner";

// Allowed modules/additional permissions options
const PERMISSION_OPTIONS = [
  { id: "dashboard", label: "Dashboard Executivo", desc: "Leitura de KPIs e estatísticas rápidas." },
  { id: "analytics", label: "Relatórios & Analytics", desc: "Análise avançada e projeções MLM." },
  { id: "finance", label: "Painel Financeiro", desc: "Visualizar e movimentar carteiras." },
  { id: "support", label: "Suporte e Documentos", desc: "Central de tickets e compliance de KYC." },
  { id: "orders", label: "Faturamento de Pedidos", desc: "Expedição de mercadorias e status de compras." },
  { id: "products", label: "Gestão do Catálogo", desc: "Preços, itens e planos cadastrados." },
  { id: "marketing", label: "Campanhas Corporativas", desc: "Notificações push, cupons e banners." },
  { id: "system", label: "Auditoria & Logs", desc: "Monitoramento detalhado e segurança de rede." },
];

export function InvitesManagement() {
  const { 
    adminInvites, createAdminInvite, revokeAdminInvite, resendAdminInvite, user: currentUser 
  } = useAuth();

  // Search, filter states
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [openInviteModal, setOpenInviteModal] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("gestão_admin");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  // Toggle custom permission items
  const handleTogglePermission = (permId: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permId) ? prev.filter(id => id !== permId) : [...prev, permId]
    );
  };

  // Submit and create invitation
  const handleCreateInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) {
      toast.error("Por favor, preencha o Nome Completo e o E-mail.");
      return;
    }

    if (!email.includes("@")) {
      toast.error("Insira um endereço de e-mail corporativo válido.");
      return;
    }

    setIsSubmitLoading(true);

    try {
      // Simulate micro loading trigger
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newInv = await createAdminInvite({
        full_name: fullName,
        email: email,
        role: selectedRole,
        permissions: selectedPermissions,
        notes: notes
      });

      // Notification toast
      toast.success(
        `Convite administrativo criado e enviado com sucesso para ${email}!`
      );
      
      // Copy invitation link to clipboard automatically to boost UX
      try {
        await navigator.clipboard.writeText(newInv.invite_link);
        toast.info("Link do convite copiado automaticamente na Área de Trabalho!");
      } catch (err) {
        // Fallback silenciado
      }

      // Reset states and close modal
      setFullName("");
      setEmail("");
      setSelectedRole("gestão_admin");
      setSelectedPermissions([]);
      setNotes("");
      setOpenInviteModal(false);
    } catch (err) {
      toast.error("Não foi possível gerar a credencial.");
    } finally {
      setIsSubmitLoading(false);
    }
  };

  // One-click clipboard support
  const handleCopyLink = async (inviteLink: string, token: string) => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopiedToken(token);
      toast.success("Link do convite copiado!");
      setTimeout(() => setCopiedToken(null), 1500);
    } catch (err) {
      toast.error("Erro ao copiar para a área de transferência.");
    }
  };

  // Cancel / Revoke invitation link
  const handleRevokeInvite = async (inviteId: string) => {
    try {
      await revokeAdminInvite(inviteId);
      toast.success("Convite revogado com sucesso. Token cancelado e inutilizável.");
    } catch (err) {
      toast.error("Não foi possível cancelar o enlace.");
    }
  };

  // Re-send / Renew invite (adds 48 hours and fresh token)
  const handleResendInvite = async (inviteId: string) => {
    try {
      await resendAdminInvite(inviteId);
      toast.success("Convite renovado com sucesso! Novo token gerado e estendido por mais 48h.");
    } catch (err) {
      toast.error("Erro ao reemitir credencial temporária.");
    }
  };

  // Filter criteria
  const filteredInvites = adminInvites.filter(inv => {
    const matchesSearch = 
      inv.full_name.toLowerCase().includes(search.toLowerCase()) || 
      inv.email.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || inv.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Header filter metrics */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Pesquisar por nome do convidado..." 
              className="pl-9 bg-background/50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36 bg-card/60 border-border text-xs h-9">
              <SelectValue placeholder="Filtrar Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all font-sans">Todos os Enlaces</SelectItem>
              <SelectItem value="pending">Pendente (Ativo)</SelectItem>
              <SelectItem value="accepted">Aceito / Ativado</SelectItem>
              <SelectItem value="expired">Expirado</SelectItem>
              <SelectItem value="revoked">Revogado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Action Button: Show slide-out to construct invite */}
        <Dialog open={openInviteModal} onOpenChange={setOpenInviteModal}>
          <DialogTrigger asChild>
            <Button className="w-full md:w-auto bg-gradient-to-r from-primary to-fuchsia-600 hover:from-primary/95 hover:to-fuchsia-600/95 font-medium rounded-lg text-xs tracking-wide">
              <Plus className="h-4 w-4 mr-1 shrink-0" />
              Novo Convite Admin
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl bg-[#090d16] border border-border shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-white flex items-center gap-1.5">
                <Mail className="h-5 w-5 text-primary" />
                Criar Enlace de Convite Corporativo
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Crie um cadastro temporário seguro com privilégios de controle da empresa. O destinatário receberá um e-mail securitizado para configurar sua própria senha de login.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateInvite} className="space-y-4 py-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Nome Completo do Convidado *</label>
                  <Input 
                    placeholder="Ex: Gabriel Oliver" 
                    className="bg-background/40"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">E-mail Corporativo *</label>
                  <Input 
                    type="email"
                    placeholder="gabriel@allin.io" 
                    className="bg-background/40"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Cargo com Políticas de Permissão Padrão (RBAC) *</label>
                <Select value={selectedRole} onValueChange={(val) => {
                  setSelectedRole(val as UserRole);
                  // Setup generic permissions matching the role as a default nice helper!
                  const defaults: Record<string, string[]> = {
                    gestão_admin: ["dashboard", "analytics", "support", "orders", "products"],
                    financeiro: ["dashboard", "analytics", "finance", "orders"],
                    suporte: ["dashboard", "support", "orders"],
                    logística: ["dashboard", "orders", "products"],
                    marketing: ["dashboard", "marketing", "products"],
                    analytics: ["dashboard", "analytics"],
                    auditor: ["dashboard", "analytics", "finance", "system"],
                    operador: ["dashboard", "orders"]
                  };
                  setSelectedPermissions(defaults[val] || []);
                }}>
                  <SelectTrigger className="bg-background/40 border-border">
                    <SelectValue placeholder="Selecione o cargo estratégico" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gestão_admin">Gestão Admin (Acesso amplo de equipe, produtos e pedidos)</SelectItem>
                    <SelectItem value="financeiro">Financeiro (Gerenciador de saques e liquidações de bônus)</SelectItem>
                    <SelectItem value="suporte">Suporte Técnico (Tratamento de chamados e aprovação de KYC)</SelectItem>
                    <SelectItem value="logística">Logística (Faturamento e despacho operacional de compras)</SelectItem>
                    <SelectItem value="marketing">Marketing (Organização de banners e campanhas MLM)</SelectItem>
                    <SelectItem value="analytics">Analytics (Leitor de faturamento, rede e conexões)</SelectItem>
                    <SelectItem value="auditor">Auditor Estrito (Leitor em tempo real imutável de logs e caixas)</SelectItem>
                    <SelectItem value="operador">Operador de Staff (Organizador de expedição e tickets básicos)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Advanced checklist of individual platform modules */}
              <div className="space-y-2 rounded-lg border border-border bg-black/30 p-3">
                <div className="flex items-center gap-1">
                  <Layers className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-bold text-white">Módulos Adicionais Concedidos</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-snug">
                  Personalize acessos à parte das regras padrão herdadas pela role administrativa.
                </p>

                <div className="grid grid-cols-2 gap-2 mt-2 pt-1.5 border-t border-border/40">
                  {PERMISSION_OPTIONS.map((opt) => {
                    const checked = selectedPermissions.includes(opt.id);
                    return (
                      <div 
                        key={opt.id} 
                        onClick={() => handleTogglePermission(opt.id)}
                        className={`flex items-start gap-2 p-1.5 rounded-md border cursor-pointer select-none transition-colors ${
                          checked 
                            ? "bg-primary/5 border-primary/40 text-white" 
                            : "border-slate-800/60 hover:border-slate-700/80 text-muted-foreground/90"
                        }`}
                      >
                        <div className={`h-3.5 w-3.5 rounded mt-0.5 border flex items-center justify-center shrink-0 ${
                          checked ? "border-primary bg-primary text-primary-foreground" : "border-slate-700"
                        }`}>
                          {checked && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                        </div>
                        <div className="flex flex-col min-w-0 leading-tight">
                          <span className="text-[11px] font-semibold">{opt.label}</span>
                          <span className="text-[9px] opacity-70 truncate">{opt.desc}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Observações Internas (Opcional)</label>
                <textarea 
                  placeholder="Instruções internas ou escopo da contração..." 
                  className="w-full h-16 rounded-md bg-background/40 border border-border p-2 text-xs focus:ring-1 focus:ring-primary outline-none"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <DialogFooter className="pt-2 items-center flex gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setOpenInviteModal(false)}
                  className="rounded-lg h-9 text-xs"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitLoading}
                  className="bg-primary hover:bg-primary/95 text-xs h-9 font-medium tracking-wide rounded-lg shrink-0"
                >
                  {isSubmitLoading ? (
                    <span className="flex items-center gap-1.5">
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      Emitindo Credencial...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Send className="h-3 w-3 mr-1" />
                      Registrar & Salvar Convite
                    </span>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Grid containing invitations lists */}
      <div className="rounded-xl border border-border bg-card/40 overflow-hidden">
        <div className="px-4 py-3 bg-card/60 border-b border-border flex items-center gap-1.5">
          <Mail className="h-4 w-4 text-primary" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Enlaces Digitais de Admissão ({filteredInvites.length})</h3>
        </div>

        {filteredInvites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Mail className="h-10 w-10 text-muted-foreground/30 mb-2.5" />
            <p className="text-sm font-medium text-muted-foreground">Nenhum convite listado.</p>
            <p className="text-xs text-muted-foreground/60">Tente ajustar seus termos de busca ou crie um novo convite administrativo utilizando as diretrizes acima.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#0b0f19]/80 border-b border-border/80 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left">Convidado</th>
                  <th className="px-4 py-3 text-left">Nível / Role Proposta</th>
                  <th className="px-4 py-3 text-left">Audit Emitente</th>
                  <th className="px-4 py-3 text-left">Validade Link (48h)</th>
                  <th className="px-4 py-3 text-left">Status Evento</th>
                  <th className="px-4 py-3 text-right">Controles Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredInvites.map((inv) => (
                  <tr key={inv.id} className="hover:bg-accent/20 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex flex-col leading-tight max-w-[150px] md:max-w-none">
                        <span className="font-medium text-white truncate">{inv.full_name}</span>
                        <span className="text-xs text-muted-foreground font-mono truncate">{inv.email}</span>
                        {inv.notes && (
                          <div className="text-[10px] text-muted-foreground/75 mt-0.5 italic flex items-center gap-1">
                            <Info className="h-2.5 w-2.5 text-primary/80 shrink-0" />
                            <span className="truncate">{inv.notes}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex flex-col gap-1 w-fit">
                        <Badge variant="outline" className={`text-[10px] font-medium leading-none py-0.5 px-1.5 ${getRoleBadgeStyle(inv.role)}`}>
                          <Shield className="h-2.5 w-2.5 mr-1" />
                          {getRoleLabel(inv.role)}
                        </Badge>
                        {inv.permissions.length > 0 && (
                          <span className="text-[9px] text-muted-foreground font-mono">
                            Mod: {inv.permissions.join(", ")}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="text-xs text-muted-foreground/90 font-mono">
                        {inv.invited_by}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex flex-col text-[11px] font-mono leading-tight">
                        <span className="text-muted-foreground/85">
                          Até: {new Date(inv.expires_at).toLocaleDateString("pt-BR")}
                        </span>
                        <span className="text-[10px] opacity-65">
                          Hora: {new Date(inv.expires_at).toLocaleTimeString("pt-BR", {hour:"2-digit", minute:"2-digit"})}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      {inv.status === "pending" ? (
                        <span className="inline-flex items-center gap-1 text-xs text-cyan-400 font-medium">
                          <Clock className="h-3 w-3 animate-pulse text-cyan-400 shrink-0" />
                          Pendente
                        </span>
                      ) : inv.status === "accepted" ? (
                        <div className="flex flex-col leading-tight">
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                            Ativado
                          </span>
                          {inv.accepted_at && (
                            <span className="text-[9px] font-mono text-muted-foreground/60">
                              Em: {new Date(inv.accepted_at).toLocaleDateString("pt-BR")}
                            </span>
                          )}
                        </div>
                      ) : inv.status === "expired" ? (
                        <span className="inline-flex items-center gap-1 text-xs text-slate-400 font-medium">
                          <XCircle className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                          Expirado
                        </span>
                      ) : (
                        <div className="flex flex-col leading-tight">
                          <span className="inline-flex items-center gap-1 text-xs text-rose-400 font-medium">
                            <XCircle className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                            Cancelado
                          </span>
                          {inv.revoked_at && (
                            <span className="text-[9px] font-mono text-muted-foreground/60">
                              Em: {new Date(inv.revoked_at).toLocaleDateString("pt-BR")}
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Copy link button */}
                        {inv.status === "pending" && (
                          <Button
                            onClick={() => handleCopyLink(inv.invite_link, inv.invite_token)}
                            variant="outline"
                            className="h-8 w-8 p-0 rounded-md border-slate-800 text-slate-400 hover:text-white"
                            title="Copiar Link Seguro"
                          >
                            {copiedToken === inv.invite_token ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                          </Button>
                        )}

                        {/* Direct link simulation click for sandbox playground triggers */}
                        {inv.status === "pending" && (
                          <a
                            href={`/auth/invite/${inv.invite_token}`}
                            className="inline-flex h-8 px-2.5 items-center justify-center rounded-md border border-primary/20 bg-primary/10 text-[10px] font-bold text-primary hover:bg-primary/20 transition-colors"
                            title="Simular Acesso do Candidato"
                          >
                            Ir p/ Ativação
                          </a>
                        )}

                        {/* Re-send / Renew invite */}
                        {(inv.status === "expired" || inv.status === "revoked") && (
                          <Button
                            onClick={() => handleResendInvite(inv.id)}
                            variant="outline"
                            className="h-8 w-8 p-0 rounded-md border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850"
                            title="Reenviar de Formato Renovado (+48h)"
                          >
                            <RefreshCw className="h-3.5 w-3.5" />
                          </Button>
                        )}

                        {/* Cancel / Revoke invite trigger */}
                        {inv.status === "pending" && (
                          <Button
                            onClick={() => handleRevokeInvite(inv.id)}
                            variant="outline"
                            className="h-8 w-8 p-0 rounded-md border-rose-500/15 text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/30"
                            title="Revogar e Invalidar Token"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
