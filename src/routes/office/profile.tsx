import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { 
  User, MapPin, Building, Key, Bell, Shield, Clock, Camera, 
  CheckCircle2, AlertCircle, Copy, Check, EyeOff, Sparkles, Brain, Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tag } from "@/components/ui/tag"; // standard components - use Badge or custom tag
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { distributor, formatBRL } from "@/lib/distributor-data";
import { toast } from "sonner";

export const Route = createFileRoute("/office/profile")({
  component: ProfilePage,
});

// Mock access auditable logs (logs de acesso)
const ACCESS_LOGS = [
  { id: "l1", event: "Login bem-sucedido", ip: "177.34.120.9", device: "Chrome / Windows 11", location: "São Paulo, SP", at: "2026-05-29 00:52" },
  { id: "l2", event: "Solicitação de saque PIX", ip: "177.34.120.9", device: "Chrome / Windows 11", location: "São Paulo, SP", at: "2026-05-28 15:30" },
  { id: "l3", event: "Modificação de Chave PIX", ip: "177.34.120.9", device: "Chrome / Windows 11", location: "São Paulo, SP", at: "2026-05-27 10:41" },
  { id: "l4", event: "Verificação de documento aprovada", ip: "IA Service Cloud", device: "Allin AI OCR Engine", location: "Datacenter Brasil", at: "2026-05-25 18:22" },
];

function ProfilePage() {
  const [profileName, setProfileName] = useState(distributor.nome);
  const [phone, setPhone] = useState(distributor.telefone);
  const [twoFactor, setTwoFactor] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Bank Info States
  const [pixType, setPixType] = useState("cpf");
  const [pixKey, setPixKey] = useState("412.880.901-22");
  const [bankName, setBankName] = useState("Itaú Unibanco S.A.");
  const [bankAgency, setBankAgency] = useState("0420");
  const [bankAccount, setBankAccount] = useState("32400-9");

  const handleSave = (sectionName: string) => {
    setIsSubmitting(true);
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1400)),
      {
        loading: `Salvando alterações em ${sectionName}...`,
        success: () => {
          setIsSubmitting(false);
          return `${sectionName} atualizado com sucesso no servidor!`;
        },
        error: "Erro ao persistir configurações.",
      }
    );
  };

  const copySponsorLink = () => {
    navigator.clipboard.writeText(distributor.link_loja);
    setIsCopied(true);
    toast.success("Link copiado para compartilhamento!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
          <User className="h-8 w-8 text-primary shrink-0" />
          Meus Dados <span className="text-xs font-mono font-medium tracking-normal text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full uppercase">Configurações</span>
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Gerencie seu perfil de distribuidor Allin, dados de faturamento instantâneo por PIX, segurança cadastral e auditoria.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Navigation Sidebar inside views */}
        <div className="lg:col-span-1 space-y-4">
          
          {/* Avatar / Profile Snapshot Area */}
          <div className="rounded-2xl border border-border/60 bg-card/60 p-5 text-center flex flex-col items-center gap-3">
            <div className="relative group cursor-pointer">
              <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-primary via-fuchsia-500 to-cyan-400 p-0.5 shadow-lg">
                <div className="h-full w-full rounded-full bg-slate-900 flex items-center justify-center text-xl font-bold text-white uppercase">
                  {distributor.nome.split(" ").map(n => n[0]).slice(0,2).join("")}
                </div>
              </div>
              <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] uppercase font-mono">
                <Camera className="h-4 w-4" />
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-white truncate max-w-[150px] mx-auto">{distributor.nome}</p>
              <p className="text-xs text-muted-foreground mt-0.5">ID: {distributor.id}</p>
            </div>

            <div className="flex flex-col gap-1 w-full pt-1.5 border-t border-border/20">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Qualificação:</span>
                <Badge className="bg-primary/20 text-primary border-primary/30 text-[9px] px-1.5 py-0">{distributor.qualificacao}</Badge>
              </div>
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-muted-foreground">Plano Atual:</span>
                <span className="font-semibold text-white">{distributor.plano}</span>
              </div>
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-muted-foreground">Score de Ator:</span>
                <span className="font-mono text-emerald-400 font-bold">{distributor.score} XP</span>
              </div>
            </div>
          </div>

          {/* Quick link copying Box */}
          <div className="rounded-2xl border border-border/60 bg-blue-500/5 p-4 space-y-2.5">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider font-mono block">Link de Recrutador</span>
            <p className="text-[11px] text-muted-foreground leading-snug">Use este endereço personalizado para cadastros diretos univalentes.</p>
            <div className="flex gap-1.5 pt-1">
              <Input 
                type="text" 
                value={distributor.link_loja} 
                readOnly 
                className="h-8 text-[10px] font-mono bg-background/50 flex-1 border-border/60"
              />
              <Button 
                size="sm" 
                variant="outline"
                className="h-8 w-8 p-0 shrink-0 border-border/60 hover:text-white"
                onClick={copySponsorLink}
              >
                {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              </Button>
            </div>
          </div>

        </div>

        {/* Tab Sub-forms Grid on Right */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="perfil" className="space-y-6">
            
            <TabsList className="bg-background border border-border/50 max-w-full flex justify-start items-center overflow-x-auto gap-1">
              <TabsTrigger value="perfil" className="gap-1.5 text-xs"><User className="h-3.5 w-3.5" /> Meu Perfil</TabsTrigger>
              <TabsTrigger value="financeiro" className="gap-1.5 text-xs"><Building className="h-3.5 w-3.5" /> Conta & PIX</TabsTrigger>
              <TabsTrigger value="seguranca" className="gap-1.5 text-xs"><Shield className="h-3.5 w-3.5" /> Segurança & Logs</TabsTrigger>
            </TabsList>

            {/* TAB PART 1: Meu Perfil */}
            <TabsContent value="perfil" className="space-y-5 rounded-2xl border border-border/60 bg-card/40 p-6">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Dados Cadastrais Básicos</h3>
                <p className="text-xs text-muted-foreground">Para redefinir o nome completo ou CPF, envie um ticket com seus documentos.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Nome Completo</span>
                  <Input 
                    type="text" 
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Endereço de E-mail</span>
                  <Input 
                    type="email" 
                    value={distributor.email}
                    readOnly
                    className="h-9 text-xs bg-muted/20 text-muted-foreground cursor-not-allowed"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Número de Telefone (WhatsApp)</span>
                  <Input 
                    type="text" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">CPF Fiscal</span>
                  <Input 
                    type="text" 
                    value={distributor.cpf}
                    readOnly
                    className="h-9 text-xs bg-muted/20 text-muted-foreground cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-border/20 pt-4 mt-6">
                <div className="col-span-1 space-y-1">
                  <span className="text-xs text-muted-foreground">Patrocinador Master</span>
                  <Input 
                    type="text" 
                    value={distributor.patrocinador}
                    readOnly
                    className="h-9 text-xs bg-muted/20 text-muted-foreground cursor-not-allowed"
                  />
                </div>
                <div className="col-span-1 space-y-1">
                  <span className="text-xs text-muted-foreground">Cidade de Sede</span>
                  <Input 
                    type="text" 
                    value={distributor.cidade}
                    readOnly
                    className="h-9 text-xs bg-muted/20 text-muted-foreground cursor-not-allowed"
                  />
                </div>
                <div className="col-span-1 space-y-1">
                  <span className="text-xs text-muted-foreground">Estado Fiscal</span>
                  <Input 
                    type="text" 
                    value={distributor.estado}
                    readOnly
                    className="h-9 text-xs bg-muted/20 text-muted-foreground cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-border/20 flex justify-end gap-2">
                <Button 
                  size="sm" 
                  disabled={isSubmitting}
                  className="gap-2 bg-gradient-to-r from-primary to-fuchsia-500 text-xs"
                  onClick={() => handleSave("Perfil Cadastral")}
                >
                  <Save className="h-4 w-4" /> Salvar Alterações
                </Button>
              </div>
            </TabsContent>

            {/* TAB PART 2: Conta & PIX */}
            <TabsContent value="financeiro" className="space-y-5 rounded-2xl border border-border/60 bg-card/40 p-6">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Domicílio de Pagamentos & Instant PIX</h3>
                <p className="text-xs text-muted-foreground">Onde você receberá comissões e bônus residuais semanais calculados no CRM.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Nome da Instituição Bancária</span>
                  <Input 
                    type="text" 
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Agência Bancária</span>
                  <Input 
                    type="text" 
                    value={bankAgency}
                    onChange={(e) => setBankAgency(e.target.value)}
                    className="h-9 text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Conta Corrente / Conta Poupança</span>
                  <Input 
                    type="text" 
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    className="h-9 text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Tipo de Chave PIX</span>
                  <Input 
                    type="text" 
                    value={pixType.toUpperCase()}
                    onChange={(e) => setPixType(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>
                <div className="col-span-1 md:col-span-2 space-y-1">
                  <span className="text-xs text-muted-foreground">Valor / Chave de Faturamento PIX</span>
                  <Input 
                    type="text" 
                    value={pixKey}
                    onChange={(e) => setPixKey(e.target.value)}
                    className="h-9 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-start gap-2 text-xs text-muted-foreground leading-snug">
                <AlertCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong>Aviso:</strong> A titularidade da conta bancária e chave PIX indicada precisa coincidir integralmente com o CPF do distribuidor ativo ({distributor.cpf}) para transações rápidas integradas à API fintech.
                </span>
              </div>

              <div className="pt-4 border-t border-border/40 flex justify-end gap-2">
                <Button 
                  size="sm" 
                  disabled={isSubmitting}
                  className="gap-2 bg-gradient-to-r from-primary to-fuchsia-500 text-xs"
                  onClick={() => handleSave("Conta Bancária e PIX")}
                >
                  <Save className="h-4 w-4" /> Salvar Chaves Financeiras
                </Button>
              </div>
            </TabsContent>

            {/* TAB PART 3: Segurança & Logs (logs de acesso) */}
            <TabsContent value="seguranca" className="space-y-6">
              
              {/* Change Password & 2FA */}
              <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Autenticação de Duas Etapas (2FA)</h3>
                  <p className="text-xs text-muted-foreground">Reforce o acesso aos seus bônus adicionando aprovação por token SMS ou autenticador digital.</p>
                </div>

                <div className="flex items-center justify-between bg-background/30 rounded-xl p-4 border border-border/40">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-white">2FA via Aplicativo Autenticador (Google/Microsoft)</p>
                    <p className="text-[11px] text-muted-foreground">Recomendado · Seguro, sem depender de operadoras de telefonia.</p>
                  </div>
                  <Switch 
                    checked={twoFactor}
                    onCheckedChange={(checked) => {
                      setTwoFactor(checked);
                      toast.success(checked ? "2FA ativado!" : "2FA será desabilitado.");
                    }}
                  />
                </div>
              </div>

              {/* Logs de Acesso */}
              <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5"><Clock className="h-4 w-4 text-primary" /> Histórico de Logs de Acesso</h3>
                  <p className="text-xs text-muted-foreground">Registre de forma transparente todos os eventos de logon IP de sua credencial Allin (auditoria em tempo real).</p>
                </div>

                <div className="space-y-2">
                  {ACCESS_LOGS.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-muted/10 border border-border/20 rounded-xl p-3.5 hover:bg-muted/20 transition-all text-xs">
                      <div>
                        <p className="font-semibold text-white leading-tight">{item.event}</p>
                        <p className="text-muted-foreground text-[11px] mt-0.5">{item.device} · {item.location}</p>
                      </div>
                      <div className="text-right sm:text-right leading-none shrink-0">
                        <Badge variant="outline" className="font-mono text-[10px] text-muted-foreground">IP {item.ip}</Badge>
                        <p className="text-[10px] text-muted-foreground/60 font-mono mt-1">{item.at}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </TabsContent>

          </Tabs>
        </div>

      </div>

    </div>
  );
}
