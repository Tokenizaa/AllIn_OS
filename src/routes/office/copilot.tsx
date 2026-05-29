import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, Brain, Bot, Send, MessageSquare, Copy, Check, 
  ChevronRight, ArrowRight, Star, AlertTriangle, TrendingUp,
  RefreshCw, Info, HelpCircle, Lightbulb, Play, Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { formatBRL, aiInsights } from "@/lib/distributor-data";

export const Route = createFileRoute("/office/copilot")({
  component: CopilotPage,
});

interface ChatMessage {
  id: string;
  sender: "user" | "copilot";
  text: string;
  timestamp: string;
  copyableText?: string;
}

const PRESET_PROMPTS = [
  { label: "Gerar Copy de Vendas (Vita Complex)", type: "copy" },
  { label: "Quem está com risco de abandono?", type: "churn" },
  { label: "Como qualificar para Diamante Negro?", type: "career" },
  { label: "Análise de Faturamento p/ Próximo Mês", type: "forecast" },
];

function CopilotPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "m1", sender: "copilot", text: "Olá Mariana! Sou o seu Copiloto Operacional IA da Allin Brasil. Como posso acelerar o volume da sua rede hoje?", timestamp: "Agora" }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const simulateCopilotResponse = (promptType: string, userText: string) => {
    setIsTyping(true);
    
    setTimeout(() => {
      let reply = "";
      let copyText = undefined;

      if (promptType === "copy") {
        reply = "Aqui está uma copy de alta conversão estruturada com gatilhos mentais da Fórmula de Lançamento (Modelo AIDA) para você vender o Allin Vita Complex:\n\n🚀 *Chega de se sentir cansada no meio da tarde!*\nO Allin Vita Complex é o segredo de milhares de brasileiros que recuperaram a disposição de forma imediata e ativa.\n👉 Pronta para transformar seu foco hoje?\nClique no link e receba entrega expressa segurada: " + "https://loja.allin.io/mariana.ribeiro";
        copyText = reply;
      } else if (promptType === "churn") {
        reply = "🚨 *Diagnóstico Realtime de Consistência:*\nIdentifiquei 1 distribuidor direto sob risco crítico de desistência:\n\n• *Bruna Costa* (1ª Geração) - Sem compras ou logins há 15 dias. Pontos de carreira inativos.\n\n*Ação recomendada:* Disparar o script de reativação via WhatsApp (Disponível clicando em Enviar Mensagem na ficha de rede).";
      } else if (promptType === "career") {
        reply = "🏆 *Plano Estratégico para Diamante Negro (Black):*\nVocê está atualmente em 72% da meta total de pontos unilevel necessários (21.400 PV de 30.000 PV).\n\n*Próximos passos:* \n1. Auxiliar *Carlos Lima* a se qualificar como Ouro (Gerará +5.400 PV).\n2. Ativar 3 novos distribuidores através do Stories de Onboarding na Biblioteca.";
      } else if (promptType === "forecast") {
        reply = "📊 *Previsão de Redes por Regressão Linear:*\nA projeção unilevel aponta um faturamento estimado de *R$ 138.000,00* (+23%) no fechamento deste mês de Junho. A conversão da sua loja virtual está consolidada em 6.8% (ótimo desempenho).";
      } else {
        reply = `Entendi sua dúvida sobre "${userText}". Na Allin Brasil, a chave para maximizar o plano unilevel é apoiar o crescimento da 2ª Geração (duplicação). Recomendo usar os roteiros já validados de WhatsApp na aba de Downloads.`;
      }

      setMessages(prev => [
        ...prev,
        { id: `c-${Date.now()}`, sender: "copilot", text: reply, timestamp: "Agora", copyableText: copyText }
      ]);
      setIsTyping(false);
    }, 1200);
  };

  const handleSendMessage = (text: string, type = "custom") => {
    if (!text.trim()) return;
    
    const newUserMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: text,
      timestamp: "Agora"
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputText("");
    simulateCopilotResponse(type, text);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Designações copiadas para a área de transferência!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary shrink-0 animate-pulse" />
            Copiloto IA <span className="text-xs font-mono font-medium tracking-normal text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full uppercase">Allin Brain</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Seu cientista de dados e copywriter pessoal para aceleração de rede multinível integrada com modelos generativos.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Terminal Chat Module */}
        <div className="lg:col-span-2 rounded-2xl border border-border/60 bg-[#070b13] flex flex-col justify-between h-[520px] overflow-hidden">
          
          {/* Header */}
          <div className="bg-background/80 p-4 border-b border-border/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-primary/20 text-primary grid place-items-center">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Assistente de Campo Allin IA</p>
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-muted-foreground">Processamento neural ativo</span>
                </div>
              </div>
            </div>

            <Button size="sm" variant="ghost" className="h-7 text-[10px] font-mono hover:text-white" onClick={() => setMessages([{ id: "m1", sender: "copilot", text: "Histórico de conversa reiniciado. Pergunte-me qualquer dúvida operacional!", timestamp: "Agora" }])}>
              Limpar Conversa
            </Button>
          </div>

          {/* Messages Lists */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-3 max-w-[85%] ${msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
              >
                <div className={`h-8 w-8 rounded-full grid place-items-center text-xs shrink-0 font-bold ${
                  msg.sender === "user" ? "bg-indigo-500 text-white" : "bg-primary text-white"
                }`}>
                  {msg.sender === "user" ? "M" : "A"}
                </div>
                
                <div className="space-y-1.5">
                  <div className={`rounded-2xl p-3.5 text-xs leading-relaxed ${
                    msg.sender === "user" 
                      ? "bg-indigo-600 text-white" 
                      : "bg-[#101928] border border-border/40 text-muted-foreground"
                  }`}>
                    <p className="whitespace-pre-line text-white">{msg.text}</p>
                    
                    {msg.copyableText && (
                      <div className="mt-3 pt-3 border-t border-border/20 flex justify-end">
                        <Button 
                          size="sm" 
                          variant="secondary"
                          className="h-7 text-[11px] gap-1 px-2 cursor-pointer"
                          onClick={() => handleCopy(msg.copyableText!, msg.id)}
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="h-3 w-3 text-emerald-400" /> Copiado!
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" /> Copiar Texto
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] text-muted-foreground font-mono block px-1.5">{msg.timestamp}</span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 max-w-[80%] mr-auto items-center">
                <div className="h-8 w-8 rounded-full bg-primary text-white grid place-items-center text-xs font-bold animate-pulse">
                  A
                </div>
                <div className="bg-muted/10 border border-border/40 rounded-2xl p-3 text-xs text-muted-foreground font-mono flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
          </div>

          {/* Quick inputs pills */}
          <div className="px-4 pb-2 pt-1 border-t border-border/10 flex flex-wrap gap-1.5 bg-black/10">
            {PRESET_PROMPTS.map((p) => (
              <button 
                key={p.label}
                onClick={() => handleSendMessage(p.label, p.type)}
                className="text-[10px] font-mono tracking-tight bg-background border border-border/70 hover:border-primary/50 text-muted-foreground hover:text-white px-2.5 py-1 rounded-full transition-all cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Terminal Input Box */}
          <div className="p-3 bg-background border-t border-border/40 flex gap-2">
            <Input 
              type="text" 
              placeholder="Perguntar ao Copiloto inteligência de redes, copys ou previsões..." 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendMessage(inputText);
              }}
              className="h-10 text-xs border-border/60"
            />
            <Button 
              className="h-10 px-4 bg-gradient-to-r from-primary to-fuchsia-500 cursor-pointer"
              onClick={() => handleSendMessage(inputText)}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

        </div>

        {/* AI Action Board & Predictors on the side*/}
        <div className="rounded-2xl border border-border/60 bg-card/60 p-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-border/40 pb-3">
              <Lightbulb className="h-5 w-5 text-amber-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Dicas do Allin Brain</h3>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-primary/5 border border-primary/20 rounded-xl space-y-1.5">
                <p className="text-xs font-semibold text-white flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 text-yellow-500 fill-current" /> Saturação por Produto
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  O produto <strong className="text-white">Allin Slim Pro</strong> atingiu 2.3× mais receita este mês na sua rede local. Considerar enviar copies específicas dele aos contatos do RJ.
                </p>
              </div>

              <div className="p-3 bg-rose-500/5 border border-rose-500/20 rounded-xl space-y-1.5">
                <p className="text-xs font-semibold text-rose-400 flex items-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5" /> Recompra Crítica
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  As reordenações do unilevel de 3ª Geração caíram 8% esta semana. Recomenda-se disparar a campanha de fidelização unificada.
                </p>
              </div>

              <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl space-y-1.5">
                <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5" /> Desempenho de Conversão
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Sua loja obteve 4.280 visitas marcando <strong className="text-white">6.8% de conversão</strong>. Meta de conversão otimizada de funil estabelecida em 8.0%.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#0b1016] border border-border/30 rounded-xl p-3.5 text-[11px] text-muted-foreground font-mono space-y-1.5 mt-4">
            <span className="font-semibold text-white block">Precisão Preditiva</span>
            <p>Modelagem baseada em regressão polinomial atualizada a cada 10 novos pedidos na Allin Brasil.</p>
            <div className="flex justify-between items-center text-[10px] text-muted-foreground/60 pt-1">
              <span>Confiabilidade do Modelo:</span>
              <span className="text-emerald-400 font-bold">96.8%</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
