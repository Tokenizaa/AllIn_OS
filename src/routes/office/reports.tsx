import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { 
  AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { 
  BarChart3, TrendingUp, Calendar, ArrowUpRight, ArrowDownRight,
  Download, Sparkles, Brain, FileSpreadsheet, FileText, CheckCircle2,
  Filter, RotateCcw, HelpCircle, Activity, ShoppingCart, Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatBRL, salesSeries } from "@/lib/distributor-data";
import { toast } from "sonner";

export const Route = createFileRoute("/office/reports")({
  component: ReportsPage,
});

// Mock extended history data for multi-year/multi-metric comparison
const PERFORMANCE_DATA = [
  { month: "Jan", vendas: 45000, comissoes: 8100, retencao: 96, conversao: 5.4 },
  { month: "Fev", vendas: 52000, comissoes: 9400, retencao: 95, conversao: 5.8 },
  { month: "Mar", vendas: 68000, comissoes: 12200, retencao: 97, conversao: 6.2 },
  { month: "Abr", vendas: 85000, comissoes: 15300, retencao: 94, conversao: 6.5 },
  { month: "Mai", vendas: 112000, comissoes: 21200, retencao: 98, conversao: 6.8 },
];

function ReportsPage() {
  const [timeframe, setTimeframe] = useState("30");
  const [isExporting, setIsExporting] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<"vendas" | "comissoes" | "retencao">("vendas");

  const handleExport = (format: "pdf" | "excel") => {
    setIsExporting(true);
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: `Gerando relatório analítico em formato ${format.toUpperCase()}...`,
        success: () => {
          setIsExporting(false);
          return `Relatório baixado com sucesso! (${format.toUpperCase()})`;
        },
        error: "Erro ao exportar arquivo.",
      }
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-primary shrink-0" />
            Relatórios Avançados <span className="text-xs font-mono font-medium tracking-normal text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase">Stripe Style</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Métricas de desempenho de vendas, comissões unilevel e taxas de retenção modeladas por ciclos operacionais.
          </p>
        </div>
        
        {/* Export Suite Buttons */}
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 border-border/60"
            disabled={isExporting}
            onClick={() => handleExport("excel")}
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-400" /> Excel
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 border-border/60"
            disabled={isExporting}
            onClick={() => handleExport("pdf")}
          >
            <FileText className="h-4 w-4 text-rose-400" /> Exportar PDF
          </Button>
        </div>
      </div>

      {/* Modern Dashboard Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Metric 1 */}
        <div 
          onClick={() => setSelectedMetric("vendas")}
          className={`rounded-2xl border p-5 cursor-pointer transition-all ${
            selectedMetric === "vendas" 
              ? "bg-primary/10 border-primary shadow-lg shadow-primary/5" 
              : "bg-card/60 border-border/30 hover:border-border/60"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider font-mono">Volume de Vendas (Ciclo)</span>
            <ShoppingCart className={`h-4 w-4 ${selectedMetric === "vendas" ? "text-primary" : "text-muted-foreground"}`} />
          </div>
          <p className="mt-3 text-2xl font-bold text-white">{formatBRL(112000)}</p>
          <div className="mt-1 flex items-center justify-between text-xs">
            <span className="text-emerald-400 font-semibold inline-flex items-center gap-0.5">
              <ArrowUpRight className="h-3.5 w-3.5" /> +31.7%
            </span>
            <span className="text-muted-foreground">vs. ciclo anterior</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div 
          onClick={() => setSelectedMetric("comissoes")}
          className={`rounded-2xl border p-5 cursor-pointer transition-all ${
            selectedMetric === "comissoes" 
              ? "bg-success/10 border-success shadow-lg shadow-success/5" 
              : "bg-card/60 border-border/30 hover:border-border/60"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider font-mono">Rendimento de Bônus</span>
            <TrendingUp className={`h-4 w-4 ${selectedMetric === "comissoes" ? "text-success" : "text-muted-foreground"}`} />
          </div>
          <p className="mt-3 text-2xl font-bold text-white">{formatBRL(212000)}</p>
          <div className="mt-1 flex items-center justify-between text-xs">
            <span className="text-emerald-400 font-semibold inline-flex items-center gap-0.5">
              <ArrowUpRight className="h-3.5 w-3.5" /> +38.5%
            </span>
            <span className="text-muted-foreground">recorrente acumulado</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div 
          onClick={() => setSelectedMetric("retencao")}
          className={`rounded-2xl border p-5 cursor-pointer transition-all ${
            selectedMetric === "retencao" 
              ? "bg-indigo-500/10 border-indigo-500/30 shadow-lg shadow-indigo-500/5" 
              : "bg-card/60 border-border/30 hover:border-border/60"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider font-mono">Consistência de Rede</span>
            <Users className={`h-4 w-4 ${selectedMetric === "retencao" ? "text-indigo-400" : "text-muted-foreground"}`} />
          </div>
          <p className="mt-3 text-2xl font-bold text-white">98%</p>
          <div className="mt-1 flex items-center justify-between text-xs">
            <span className="text-emerald-400 font-semibold inline-flex items-center gap-0.5">
              <ArrowUpRight className="h-3.5 w-3.5" /> Estável (+4%)
            </span>
            <span className="text-muted-foreground">compras ativas reincidentes</span>
          </div>
        </div>

      </div>

      {/* Stripe-like Chart Area */}
      <div className="rounded-3xl border border-border/60 bg-card/40 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Curva Analítica de Desenvolvimento
            </h2>
            <p className="text-xs text-muted-foreground">Evolução por safra de ciclo e de distribuidores.</p>
          </div>
          
          <div className="flex bg-background/80 p-0.5 rounded-lg border border-border/60 self-start">
            <Button 
              variant={timeframe === "30" ? "secondary" : "ghost"} 
              size="sm" 
              onClick={() => setTimeframe("30")}
              className="h-7 text-[11px] px-2.5"
            >
              Últimos 30 dias
            </Button>
            <Button 
              variant={timeframe === "90" ? "secondary" : "ghost"} 
              size="sm" 
              onClick={() => setTimeframe("90")}
              className="h-7 text-[11px] px-2.5"
            >
              Trimestre
            </Button>
            <Button 
              variant={timeframe === "365" ? "secondary" : "ghost"} 
              size="sm" 
              onClick={() => setTimeframe("365")}
              className="h-7 text-[11px] px-2.5"
            >
              Anual
            </Button>
          </div>
        </div>

        {/* Dynamic Chart rendering based on selectedMetric */}
        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            {selectedMetric === "vendas" ? (
              <AreaChart data={PERFORMANCE_DATA}>
                <defs>
                  <linearGradient id="vendasGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="vendas" name="Vendas Ativas (R$)" stroke="var(--color-primary)" strokeWidth={3} fill="url(#vendasGrad)" />
              </AreaChart>
            ) : selectedMetric === "comissoes" ? (
              <BarChart data={PERFORMANCE_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`} />
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="comissoes" name="Bônus Unilevel (R$)" fill="var(--color-success)" radius={[6, 6, 0, 0]} />
              </BarChart>
            ) : (
              <LineChart data={PERFORMANCE_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} domain={[90, 100]} />
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
                <Legend verticalAlign="top" height={36} />
                <Line type="monotone" dataKey="retencao" name="Frequência Consistência (%)" stroke="#818cf8" strokeWidth={3} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="conversao" name="Conversão Loja (%)" stroke="#f43f5e" strokeWidth={2} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Metric Interpreter Section (IA interpretando métricas) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* IA Assistant Interpreter Panel */}
        <div className="lg:col-span-2 rounded-2xl border border-border/60 bg-gradient-to-br from-primary/10 via-background to-cyan-500/5 p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-border/30 pb-3">
            <Brain className="h-6 w-6 text-primary shrink-0 animate-pulse" />
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                Interpretador Inteligente Allin IA <Badge className="bg-primary/20 text-primary border-primary/30 text-[9px] py-0 px-1.5">Ativo</Badge>
              </h3>
              <p className="text-[11px] text-muted-foreground">Previsões baseadas em regressão linear de rede e volume de vendas.</p>
            </div>
          </div>

          <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              Analisando os dados do ciclo corrente, identificamos uma <span className="text-white font-semibold">robustez ascendente de 31.7% nas vendas diretas</span>. 
              Esse avanço é alavancado principalmente pelo novo plano de marketing digital que aumentou as captações on-line via links nos últimos 14 dias.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="bg-background/50 rounded-xl p-4 border border-border/40">
                <span className="text-xs font-semibold text-white block mb-1">Previsão Próximo Ciclo</span>
                <p className="text-xs text-muted-foreground">Volume de faturamento estimado para fechar em aproximadamente <strong className="text-emerald-400 font-mono">R$ 138.000,00</strong> (+23%).</p>
              </div>
              <div className="bg-background/50 rounded-xl p-4 border border-border/40">
                <span className="text-xs font-semibold text-white block mb-1">Recomendação Unilevel</span>
                <p className="text-xs text-muted-foreground">Focar na duplicação na 2ª e 3ª Geração. A consistência da 1ª geração está estabilizada em <strong className="text-primary font-mono">98%</strong>.</p>
              </div>
            </div>

            <div className="pt-3 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span className="text-xs text-muted-foreground font-mono">Metodologia: Gradient Boosting / Histórico de Reordenação Mensal Allin</span>
            </div>
          </div>
        </div>

        {/* AI Actionable Alert Card */}
        <div className="rounded-2xl border border-border/60 bg-card/60 p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-amber-400">
              <Sparkles className="h-5 w-5" />
              <h4 className="text-xs font-bold uppercase tracking-wider font-mono">Metas de Qualificação Realtime</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Falta pouco para consolidar a qualificação <strong className="text-white">Black</strong> desta temporada. Veja a projeção matemática de esforço necessário:
            </p>
            
            <div className="space-y-3 pt-2">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Volume de Equipe (GV)</span>
                  <span className="font-semibold text-white">79% (R$ 142.900)</span>
                </div>
                <Progress value={79} className="h-1.5" />
              </div>
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Qualificação de Linhas Ascendentes</span>
                  <span className="font-semibold text-white">100% (Ok)</span>
                </div>
                <Progress value={100} className="h-1.5 bg-emerald-500/20" />
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground italic pt-2">
              *Se mantiver o volume médio atual de compras de ativação dos distribuidores de segunda geração, a qualificação Black se completará automaticamente em 6 dias.
            </p>
          </div>

          <Button className="w-full gap-2 bg-gradient-to-r from-primary to-fuchsia-500 mt-6 text-xs">
            Acompanhar Checklist de Linha →
          </Button>
        </div>

      </div>

    </div>
  );
}
