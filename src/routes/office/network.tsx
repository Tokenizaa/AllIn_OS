import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Network, Users, ShieldAlert, Award, Star, Search, 
  ArrowRight, TrendingUp, Sparkles, Brain, Map, UserPlus,
  GitMerge, ChevronRight, CheckCircle2, AlertTriangle, HelpCircle as HelpIcon, BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { kpis, NetworkNode, formatBRL } from "@/lib/distributor-data";
import { SectionBreadcrumbs } from "@/components/navigation/section-breadcrumbs";

export const Route = createFileRoute("/office/network")({
  component: NetworkPage,
});

// Mock extended relationships for interactive tree
interface ExtendedNode extends NetworkNode {
  parentId?: string;
  generation: number;
  aiStatus?: "leader" | "critical" | "stable";
  aiReason?: string;
  children?: string[]; // IDs
}

const EXTENDED_NETWORK: ExtendedNode[] = [
  { id: "n1", nome: "Mariana Ribeiro (Você)", nivel: 0, qualificacao: "Diamante", ativo: true, vendas: 412990, rede: 612, cidade: "São Paulo/SP", generation: 0, aiStatus: "stable", children: ["n2", "n3", "n4"] },
  { id: "n2", nome: "Ana Souza", nivel: 1, qualificacao: "Ouro", ativo: true, vendas: 18450, rede: 42, cidade: "São Paulo/SP", generation: 1, parentId: "n1", aiStatus: "leader", aiReason: "Crescimento acelerado na 2ª linha", children: ["n5", "n6"] },
  { id: "n3", nome: "Carlos Lima", nivel: 1, qualificacao: "Prata", ativo: true, vendas: 12400, rede: 18, cidade: "Rio de Janeiro/RJ", generation: 1, parentId: "n1", aiStatus: "stable", children: ["n7"] },
  { id: "n4", nome: "Bruna Costa", nivel: 1, qualificacao: "Bronze", ativo: false, vendas: 2400, rede: 2, cidade: "Curitiba/PR", generation: 1, parentId: "n1", aiStatus: "critical", aiReason: "Inatividade há 15 dias + risco de Churn", children: [] },
  { id: "n5", nome: "Pedro Alves", nivel: 2, qualificacao: "Prata", ativo: true, vendas: 9200, rede: 12, cidade: "São Paulo/SP", generation: 2, parentId: "n2", aiStatus: "stable", children: [] },
  { id: "n6", nome: "Júlia Mendes", nivel: 2, qualificacao: "Bronze", ativo: true, vendas: 4500, rede: 4, cidade: "Belo Horizonte/MG", generation: 2, parentId: "n2", aiStatus: "leader", aiReason: "Alta conversão em campanhas digitais", children: [] },
  { id: "n7", nome: "Lucas Rocha", nivel: 2, qualificacao: "Bronze", ativo: true, vendas: 3800, rede: 2, cidade: "Salvador/BA", generation: 2, parentId: "n3", aiStatus: "stable", children: [] },
];

function NetworkPage() {
  const [activeTab, setActiveTab] = useState("linear");
  const [selectedNodeId, setSelectedNodeId] = useState<string>("n1");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "inactive" | "leader" | "critical">("all");

  const selectedNode = EXTENDED_NETWORK.find(n => n.id === selectedNodeId) || EXTENDED_NETWORK[0];

  // Filters linear downline (excluding root)
  const filteredDownline = EXTENDED_NETWORK.filter(node => {
    if (node.id === "n1") return false; // hide root in linear table list
    
    const matchesSearch = node.nome.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          node.qualificacao.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          node.cidade.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (activeFilter === "active") return node.ativo;
    if (activeFilter === "inactive") return !node.ativo;
    if (activeFilter === "leader") return node.aiStatus === "leader";
    if (activeFilter === "critical") return node.aiStatus === "critical";

    return true;
  });

  // Calculate generation stats
  const genCounts = [0, 0, 0];
  const genVendas = [0, 0, 0];
  EXTENDED_NETWORK.forEach(n => {
    if (n.generation > 0 && n.generation <= 3) {
      genCounts[n.generation - 1]++;
      genVendas[n.generation - 1] += n.vendas;
    }
  });

  return (
    <div className="space-y-6">
      <SectionBreadcrumbs
        items={[
          { label: "Office", to: "/office" },
          { label: "Rede" },
        ]}
      />
      {/* Header section with telemetry/KPIs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <Network className="h-8 w-8 text-primary shrink-0" />
            Minha Rede <span className="text-xs font-mono font-medium tracking-normal text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase">Enterprise MLM</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Plano Unilevel Profundo · Gerencie suas gerações de distribuidores com insights analíticos de IA.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2 border-border/60">
            <GitMerge className="h-4 w-4" /> Exportar Organograma
          </Button>
          <Button size="sm" className="gap-2 bg-gradient-to-r from-primary to-fuchsia-500">
            <UserPlus className="h-4 w-4" /> Cadastrar Novo
          </Button>
        </div>
      </div>

      {/* KPIs Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border/60 bg-card/60 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Rede Total Ativa</span>
            <Users className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-white">{kpis.rede_total}</p>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-400">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+{kpis.crescimento_rede_mes}% este mês</span>
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/60 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Novos Qualificados (Ciclo)</span>
            <Award className="h-4 w-4 text-fuchsia-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-white">12</p>
          <p className="mt-1 text-xs text-muted-foreground">4 Ouros, 8 Pratas em ascensão</p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/60 p-5 font-sans">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Líderes Filtrados p/ IA</span>
            <Sparkles className="h-4 w-4 text-amber-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-white">3</p>
          <div className="mt-1.5 flex gap-1">
            <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px] py-0 px-1.5">Alto potencial</Badge>
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/60 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Membros sob Risco (Churn)</span>
            <ShieldAlert className="h-4 w-4 text-rose-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-white">2</p>
          <p className="mt-1 text-xs text-rose-400 font-medium">Requer atenção imediata</p>
        </div>
      </div>

      {/* Main Tabs Container */}
      <Tabs defaultValue="linear" className="space-y-6" onValueChange={setActiveTab}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-1">
          <TabsList className="bg-background border border-border/50">
            <TabsTrigger value="linear" className="gap-2">
              <Users className="h-4 w-4" /> Rede Linear
            </TabsTrigger>
            <TabsTrigger value="interactive" className="gap-2">
              <Map className="h-4 w-4" /> Árvore Genealógica (IA)
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="h-4 w-4" /> Analytics por Geração
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            {activeTab === "linear" && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-2 w-full md:w-auto"
              >
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="text" 
                    placeholder="Buscar distribuidor..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-9"
                  />
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button 
                    variant={activeFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveFilter("all")}
                    className="h-9 px-3 text-xs"
                  >
                    Todos
                  </Button>
                  <Button 
                    variant={activeFilter === "active" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveFilter("active")}
                    className="h-9 px-3 text-xs border-border/60 text-emerald-400 hover:text-emerald-300"
                  >
                    Ativos
                  </Button>
                  <Button 
                    variant={activeFilter === "leader" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveFilter("leader")}
                    className="h-9 px-3 text-xs border-border/60 text-amber-400 hover:text-amber-300 gap-1"
                  >
                    <Sparkles className="h-3 w-3" /> Líderes
                  </Button>
                  <Button 
                    variant={activeFilter === "critical" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveFilter("critical")}
                    className="h-9 px-3 text-xs border-border/60 text-rose-400 hover:text-rose-300"
                  >
                    Estabilidade
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tab 1: Linear Grid */}
        <TabsContent value="linear" className="rounded-2xl border border-border/60 bg-card/40 p-1 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/40 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider bg-black/20">
                  <th className="px-5 py-4">Distribuidor / Cidade</th>
                  <th className="px-5 py-4">Geração</th>
                  <th className="px-5 py-4">Qualificação</th>
                  <th className="px-5 py-4">Volume de Vendas</th>
                  <th className="px-5 py-4">Rede</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Radar de IA Copiloto</th>
                  <th className="px-5 py-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {filteredDownline.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-sm text-muted-foreground">
                      Nenhum distribuidor encontrado com as condições especificadas.
                    </td>
                  </tr>
                ) : (
                  filteredDownline.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/10 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`h-8 w-8 rounded-full font-bold text-xs uppercase grid place-items-center ${
                            item.ativo ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                          }`}>
                            {item.nome.split(" ").map(n => n[0]).slice(0,2).join("")}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">{item.nome}</p>
                            <p className="text-xs text-muted-foreground">{item.cidade}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold font-mono text-white">
                        {item.generation}ª Ger
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant="outline" className={`border-border/60 ${
                          item.qualificacao === "Diamante" ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" :
                          item.qualificacao === "Ouro" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                          item.qualificacao === "Prata" ? "bg-slate-300/10 text-slate-300 border-slate-300/20" : "bg-orange-850/10 text-orange-400"
                        }`}>
                          {item.qualificacao}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold font-mono text-white">
                        {formatBRL(item.vendas)}
                      </td>
                      <td className="px-5 py-4 text-sm font-mono text-muted-foreground">
                        {item.rede} diretos
                      </td>
                      <td className="px-5 py-4">
                        <span className="flex items-center gap-1.5">
                          <span className={`h-2 w-2 rounded-full ${item.ativo ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`} />
                          <span className={`text-xs font-medium ${item.ativo ? "text-emerald-400" : "text-rose-400"}`}>
                            {item.ativo ? "Ativo" : "Inativo"}
                          </span>
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {item.aiStatus === "leader" && (
                          <div className="flex items-center gap-1.5 text-amber-400" title={item.aiReason}>
                            <Sparkles className="h-4 w-4 animate-bounce shrink-0" />
                            <span className="text-xs font-semibold">Líder Potencial</span>
                          </div>
                        )}
                        {item.aiStatus === "critical" && (
                          <div className="flex items-center gap-1.5 text-rose-400" title={item.aiReason}>
                            <AlertTriangle className="h-4 w-4 shrink-0" />
                            <span className="text-xs font-semibold">Risco Desistência</span>
                          </div>
                        )}
                        {item.aiStatus === "stable" && (
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500/70" />
                            <span className="text-xs">Estável</span>
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-white"
                          onClick={() => {
                            setSelectedNodeId(item.id);
                            setActiveTab("interactive");
                          }}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* Tab 2: Interactive Geneology with AI insights */}
        <TabsContent value="interactive" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Visualizer Frame */}
            <div className="lg:col-span-2 rounded-2xl border border-border/60 bg-[#0a0f18] p-6 relative overflow-hidden min-h-[500px] flex flex-col justify-between">
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-background/80 backdrop-blur rounded-lg px-3 py-1.5 border border-border/80 text-[11px] text-muted-foreground font-mono">
                <Brain className="h-3.5 w-3.5 text-primary" /> Mapeamento Realtime IA Ativo
              </div>

              {/* Interactive Network Diagram representation */}
              <div className="flex-1 flex flex-col items-center justify-center py-6">
                
                {/* Level 0: Roots */}
                <div className="mb-10 relative">
                  <button 
                    onClick={() => setSelectedNodeId("n1")}
                    className={`px-5 py-3.5 rounded-2xl border transition-all text-center flex flex-col items-center gap-1 shadow-lg cursor-pointer ${
                      selectedNodeId === "n1" 
                        ? "bg-primary/20 border-primary text-white ring-2 ring-primary/40 scale-105" 
                        : "bg-card/70 border-border/80 text-foreground hover:border-primary/50"
                    }`}
                  >
                    <Crown className="h-4 w-4 text-yellow-400" />
                    <span className="text-xs font-semibold">Mariana Ribeiro</span>
                    <span className="text-[10px] font-mono opacity-80">Você (Diamante)</span>
                  </button>
                  <div className="h-10 w-0.5 bg-gradient-to-b from-primary via-fuchsia-500 to-transparent mx-auto mt-0" />
                </div>

                {/* Level 1: Generations children (Ana, Carlos, Bruna) */}
                <div className="grid grid-cols-3 gap-6 w-full max-w-lg relative">
                  {/* Decorative horizontal bridge */}
                  <div className="absolute top-0 left-1/6 right-1/6 h-0.5 bg-border/60 -mt-0.5 z-0" />

                  {/* Node 2 (Ana) - Subtree Leader */}
                  <div className="flex flex-col items-center z-10">
                    <button 
                      onClick={() => setSelectedNodeId("n2")}
                      className={`px-3 py-2.5 rounded-xl border transition-all text-center w-full min-h-[70px] flex flex-col items-center justify-center gap-1 cursor-pointer ${
                        selectedNodeId === "n2" 
                          ? "bg-primary/20 border-primary text-white scale-105" 
                          : "bg-card/80 border-border/60 text-foreground hover:border-primary/40"
                      }`}
                    >
                      <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                      <span className="text-[11px] font-medium block truncate max-w-[100px]">Ana Souza</span>
                      <span className="text-[9px] text-muted-foreground font-mono">1ª Ger · Ouro</span>
                    </button>
                    {selectedNodeId === "n2" && (
                      <div className="h-6 w-0.5 bg-primary/70 mx-auto" />
                    )}
                  </div>

                  {/* Node 3 (Carlos) */}
                  <div className="flex flex-col items-center z-10">
                    <button 
                      onClick={() => setSelectedNodeId("n3")}
                      className={`px-3 py-2.5 rounded-xl border transition-all text-center w-full min-h-[70px] flex flex-col items-center justify-center gap-1 cursor-pointer ${
                        selectedNodeId === "n3" 
                          ? "bg-primary/20 border-primary text-white scale-105" 
                          : "bg-card/80 border-border/60 text-foreground hover:border-primary/40"
                      }`}
                    >
                      <Users className="h-3.5 w-3.5 text-primary" />
                      <span className="text-[11px] font-medium block truncate max-w-[100px]">Carlos Lima</span>
                      <span className="text-[9px] text-muted-foreground font-mono">1ª Ger · Prata</span>
                    </button>
                    {selectedNodeId === "n3" && (
                      <div className="h-6 w-0.5 bg-primary/70 mx-auto" />
                    )}
                  </div>

                  {/* Node 4 (Bruna) - Critical Churn */}
                  <div className="flex flex-col items-center z-10">
                    <button 
                      onClick={() => setSelectedNodeId("n4")}
                      className={`px-3 py-2.5 rounded-xl border transition-all text-center w-full min-h-[70px] flex flex-col items-center justify-center gap-1 cursor-pointer ${
                        selectedNodeId === "n4" 
                          ? "bg-rose-500/10 border-rose-500/50 text-white scale-105" 
                          : "bg-card/80 border-border/60 text-foreground hover:border-rose-400/40"
                      }`}
                    >
                      <AlertTriangle className="h-3.5 w-3.5 text-rose-400 animate-pulse" />
                      <span className="text-[11px] font-medium block truncate max-w-[100px] text-rose-300">Bruna Costa</span>
                      <span className="text-[9px] text-rose-400 font-mono">1ª Ger · Inativo</span>
                    </button>
                  </div>
                </div>

                {/* Level 2: Sub-Children of Selected Node */}
                {selectedNodeId !== "n4" && (
                  <div className="mt-2 grid grid-cols-2 gap-4 w-full max-w-md relative border-t border-dashed border-border/40 pt-6">
                    {selectedNodeId === "n1" ? (
                      <div className="col-span-2 text-center text-xs text-muted-foreground italic py-2">
                        Selecione Ana Souza ou Carlos Lima para visualizar a 2ª Geração abaixo.
                      </div>
                    ) : selectedNodeId === "n2" ? (
                      <>
                        <div className="flex flex-col items-center">
                          <button 
                            onClick={() => setSelectedNodeId("n5")}
                            className={`px-2.5 py-2.5 rounded-lg border transition-all text-center w-full flex flex-col items-center gap-0.5 ${
                              selectedNodeId === "n5" ? "bg-primary/20 border-primary" : "bg-card/90 border-border/30"
                            }`}
                          >
                            <span className="text-[11px] font-semibold">Pedro Alves</span>
                            <span className="text-[9px] text-muted-foreground">2ª Ger · Prata</span>
                          </button>
                        </div>
                        <div className="flex flex-col items-center">
                          <button 
                            onClick={() => setSelectedNodeId("n6")}
                            className={`px-2.5 py-2.5 rounded-lg border transition-all text-center w-full flex flex-col items-center gap-0.5 ${
                              selectedNodeId === "n6" ? "bg-primary/20 border-primary" : "bg-card/90 border-border/30"
                            }`}
                          >
                            <span className="text-[11px] font-semibold text-amber-300">Júlia Mendes</span>
                            <span className="text-[9px] text-amber-400 font-mono">2ª Ger · Bronze</span>
                          </button>
                        </div>
                      </>
                    ) : selectedNodeId === "n3" ? (
                      <div className="col-span-2 flex justify-center">
                        <button 
                          onClick={() => setSelectedNodeId("n7")}
                          className={`px-3 py-2.5 rounded-lg border transition-all text-center w-48 flex flex-col items-center gap-0.5 ${
                            selectedNodeId === "n7" ? "bg-primary/20 border-primary" : "bg-card/90 border-border/30"
                          }`}
                        >
                          <span className="text-[11px] font-semibold">Lucas Rocha</span>
                          <span className="text-[9px] text-muted-foreground">2ª Ger · Bronze</span>
                        </button>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>

              {/* Guide prompt */}
              <div className="text-center text-xs text-muted-foreground pt-4 border-t border-border/20 flex items-center justify-center gap-1.5 font-mono">
                <HelpIcon className="h-4 w-4 text-primary" /> Clique nos blocos para ver a ficha completa de inteligência de rede.
              </div>
            </div>

            {/* AI Advisor Panel (Customer 360 node profile) */}
            <div className="rounded-2xl border border-border/60 bg-card/60 p-6 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-border/40 pb-3">
                  <Brain className="h-5 w-5 text-primary" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Ficha de Inteligência IA</h3>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-white">{selectedNode.nome}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        selectedNode.ativo ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-500/50 border border-rose-500/20"
                      }`}>
                        {selectedNode.ativo ? "ATIVO" : "INATIVO"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{selectedNode.cidade}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="bg-background/40 border border-border/60 rounded-xl p-3 leading-tight">
                      <span className="text-[10px] text-muted-foreground">Volume Individual</span>
                      <p className="text-sm font-semibold text-white mt-1 font-mono">{formatBRL(selectedNode.vendas)}</p>
                    </div>
                    <div className="bg-background/40 border border-border/60 rounded-xl p-3 leading-tight">
                      <span className="text-[10px] text-muted-foreground">Rede de Vendas</span>
                      <p className="text-sm font-semibold text-white mt-1 font-mono">{selectedNode.rede} distribuidores</p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <span className="text-[10px] text-muted-foreground block mb-1">Status de Estabilidade</span>
                    {selectedNode.aiStatus === "leader" ? (
                      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-xs space-y-1">
                        <p className="font-bold text-amber-400 flex items-center gap-1">
                          <Star className="h-3.5 w-3.5" /> Líder Potencial Detectado
                        </p>
                        <p className="text-muted-foreground leading-relaxed">{selectedNode.aiReason || "Apresenta crescimento exponencial e engajamento acima da média regional."}</p>
                      </div>
                    ) : selectedNode.aiStatus === "critical" ? (
                      <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3 text-xs space-y-1">
                        <p className="font-bold text-rose-400 flex items-center gap-1">
                          <AlertTriangle className="h-3.5 w-3.5" strokeWidth={2.5} /> Risco de Churn Elevado (85%)
                        </p>
                        <p className="text-muted-foreground leading-relaxed">{selectedNode.aiReason || "Inatividade recente na compra de ativações mensais e queda de engajamento nos treinamentos."}</p>
                      </div>
                    ) : (
                      <div className="bg-muted/10 border border-border/60 rounded-xl p-3 text-xs space-y-1">
                        <p className="font-bold text-white flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Operação Saudável e Estável
                        </p>
                        <p className="text-muted-foreground leading-relaxed">Ciclo estável, reordena mensalmente e mantém contato com a linhagem ascendente.</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-background/20 rounded-xl border border-border/40 p-4 space-y-3.5">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold font-mono block">Prognóstico Recomendado por IA</span>
                  
                  {selectedNode.aiStatus === "leader" ? (
                    <div className="space-y-2 text-xs leading-relaxed text-muted-foreground">
                      <p>✨ <strong>Impulso Unilevel:</strong> Fornecer co-reunião para fechar novos líderes indiretos da Ana.</p>
                      <Progress value={90} className="h-1 bg-amber-500/20" />
                      <span className="text-[10px] block text-right">Potencial de Black: 90%</span>
                    </div>
                  ) : selectedNode.aiStatus === "critical" ? (
                    <div className="space-y-2 text-xs leading-relaxed text-muted-foreground">
                      <p>🚨 <strong>Re-Engajamento:</strong> Enviar cupom de ativação Allin Slim Pro e disparar mensagem scriptada no WhatsApp.</p>
                      <Progress value={20} className="h-1 bg-rose-500" />
                      <span className="text-[10px] block text-right">Frequência crítica de compra</span>
                    </div>
                  ) : (
                    <div className="space-y-2 text-xs leading-relaxed text-muted-foreground">
                      <p>💼 <strong>Manutenção de Ativos:</strong> Incentivar Bruna (downline) para mentorias locais e incentivos de recompra em grupo.</p>
                      <Progress value={60} className="h-1 bg-primary/20" />
                      <span className="text-[10px] block text-right">Volume estável</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-border/40">
                <Button className="w-full gap-2 bg-gradient-to-r from-primary to-fuchsia-500 text-xs">
                  <ArrowRight className="h-3.5 w-3.5" /> Enviar Mensagem de Apoio (Whats)
                </Button>
              </div>
            </div>

          </div>
        </TabsContent>

        {/* Tab 3: Detailed Generative Analytics */}
        <TabsContent value="analytics" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-border/60 bg-card/60 p-6 flex flex-col justify-between md:col-span-1">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">1ª Geração</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Seus recrutados diretos formam a base crucial da sua alavancagem binária e unilevel.
              </p>
              <div className="pt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Disseminadores Ativos</span>
                  <span className="font-mono text-white">2 ativos / 3 total</span>
                </div>
                <Progress value={66} className="h-2 bg-primary/10" />
              </div>
              <div className="bg-background/30 rounded-xl p-4 border border-border/40 leading-tight">
                <span className="text-[10px] text-muted-foreground">Faturamento Individual Acumulado</span>
                <p className="text-lg font-bold text-emerald-400 font-mono mt-1">{formatBRL(genVendas[0])}</p>
              </div>
            </div>
            <Button size="sm" variant="ghost" className="mt-4 text-xs text-primary self-start justify-start p-0">Ver membros diretos →</Button>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/60 p-6 flex flex-col justify-between md:col-span-1">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">2ª Geração</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Nível crucial que demonstra a capacidade de duplicação da sua rede na Allin Brasil.
              </p>
              <div className="pt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Disseminadores Ativos</span>
                  <span className="font-mono text-white">3 ativos / 3 total</span>
                </div>
                <Progress value={100} className="h-2 bg-primary/10 animate-pulse" />
              </div>
              <div className="bg-background/30 rounded-xl p-4 border border-border/40 leading-tight">
                <span className="text-[10px] text-muted-foreground">Faturamento Individual Acumulado</span>
                <p className="text-lg font-bold text-emerald-400 font-mono mt-1">{formatBRL(genVendas[1])}</p>
              </div>
            </div>
            <Button size="sm" variant="ghost" className="mt-4 text-xs text-primary self-start justify-start p-0">Ver membros de 2º Grau →</Button>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/60 p-6 flex flex-col justify-between md:col-span-1">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">3ª Geração e Posteriores</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Sua rede profunda, onde o crescimento orgânico automatizado se destaca exponencialmente.
              </p>
              <div className="pt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Disseminadores Profundos</span>
                  <span className="font-mono text-white">606 distribuidores</span>
                </div>
                <Progress value={92} className="h-2 bg-primary/10" />
              </div>
              <div className="bg-background/30 rounded-xl p-4 border border-border/40 leading-tight">
                <span className="text-[10px] text-muted-foreground">Faturamento Estimado Residual</span>
                <p className="text-lg font-bold text-purple-400 font-mono mt-1">{formatBRL(378640)}</p>
              </div>
            </div>
            <Button size="sm" variant="ghost" className="mt-4 text-xs text-primary self-start justify-start p-0">Ver linhagem residual completa →</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
