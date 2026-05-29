import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, UploadCloud, FileText, CheckCircle2, AlertTriangle, 
  Clock, Eye, ArrowRight, Brain, Sparkles, AlertCircle, Info, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { documents, formatBRL } from "@/lib/distributor-data";
import { toast } from "sonner";

export const Route = createFileRoute("/office/verification")({
  component: VerificationPage,
});

interface UploadingFile {
  name: string;
  size: string;
  progress: number;
  status: "uploading" | "scanning" | "finished";
  ocrData?: { name?: string; docNum?: string; score?: number };
}

function VerificationPage() {
  const [activeTab, setActiveTab] = useState<"upload" | "history">("upload");
  const [pendingFiles, setPendingFiles] = useState<UploadingFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  // Triggering document simulation
  const handleFileUploadSimulate = (fileName: string, fileSize: string) => {
    // Check if document already exists
    const isAlreadyAdded = pendingFiles.some(f => f.name === fileName);
    if (isAlreadyAdded) {
      toast.warning("Este arquivo já está na fila de processamento.");
      return;
    }

    const newFile: UploadingFile = {
      name: fileName,
      size: fileSize,
      progress: 0,
      status: "uploading"
    };

    setPendingFiles(prev => [...prev, newFile]);

    // Interval to simulate file upload
    let currentPct = 0;
    const interval = setInterval(() => {
      currentPct += 20;
      setPendingFiles(prev => prev.map(f => {
        if (f.name === fileName) {
          const nextStatus = currentPct >= 100 ? "scanning" : "uploading";
          return { ...f, progress: Math.min(100, currentPct), status: nextStatus };
        }
        return f;
      }));

      // If upload finished, trigger scan
      if (currentPct >= 100) {
        clearInterval(interval);
        simulateOcrAndAntiFraudScan(fileName);
      }
    }, 400);
  };

  const simulateOcrAndAntiFraudScan = (fileName: string) => {
    setTimeout(() => {
      setPendingFiles(prev => prev.map(f => {
        if (f.name === fileName) {
          return {
            ...f,
            status: "finished",
            ocrData: {
              name: "MARIANA RIBEIRO",
              docNum: "412.880.901-22",
              score: 99.4
            }
          };
        }
        return f;
      }));
      toast.success(`OCR Completo para "${fileName}": Assinatura de CPF idêntica!`);
    }, 2000);
  };

  const clearFileFromQueue = (fileName: string) => {
    setPendingFiles(prev => prev.filter(f => f.name !== fileName));
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <ShieldCheck className="h-8 w-8 text-primary shrink-0" />
            Verificação KYC <span className="text-xs font-mono font-medium tracking-normal text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase">IA Antifraude</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Validadores biométricos automáticos e escaneamento digital de documentos Allin com certificação jurídica instantânea.
          </p>
        </div>
      </div>

      {/* KYC Alert box */}
      <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-emerald-500/10 to-transparent p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-full bg-emerald-500/20 text-emerald-400 grid place-items-center shrink-0">
            <CheckCircle2 className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Status da Sua Conta: Altamente Verificada e Segura</p>
            <p className="text-xs text-muted-foreground mt-0.5">Seus documentos primários (RG, CPF e residência) estão validados e liberados para saques ilimitados de bônus.</p>
          </div>
        </div>
        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-mono text-xs uppercase self-start md:self-auto">Aprovada (100%)</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Drag & Drop OCR Sandbox */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Upload Box */}
          <div 
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              handleFileUploadSimulate("comprovante-cnpj.pdf", "2.1 MB");
            }}
            className={`rounded-2xl border-2 border-dashed p-10 text-center flex flex-col items-center justify-center gap-4 transition-all bg-[#080d15] cursor-pointer ${
              isDragOver ? "border-primary bg-primary/5 scale-[1.01]" : "border-border/60 hover:border-primary/50"
            }`}
            onClick={() => handleFileUploadSimulate("contrato-aditivo-2026.pdf", "1.4 MB")}
          >
            <div className="h-14 w-14 rounded-full bg-primary/10 text-primary grid place-items-center mb-1">
              <UploadCloud className="h-7 w-7" />
            </div>
            
            <div>
              <p className="text-sm font-semibold text-white">Arraste seus documentos pendentes ou clique para enviar</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">Suporta formatos PDF, JPG, PNG e DOC (Máximo 15MB). Documentos serão processados em segundos por IA.</p>
            </div>

            <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-mono bg-background/50 border border-border/45 px-3 py-1.5 rounded-lg">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> IA Antifraude OCR Habilitada
            </div>
          </div>

          {/* Interactive Scan Process Queues (OCR / Antifraude) */}
          {pendingFiles.length > 0 && (
            <div className="rounded-2xl border border-border/60 bg-card/60 p-5 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5 leading-none">
                <Brain className="h-4 w-4 text-primary animate-pulse" /> Fila de Validação em Tempo Real
              </h3>

              <div className="space-y-4">
                {pendingFiles.map((file) => (
                  <div key={file.name} className="bg-background/40 border border-border/50 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileText className="h-5 w-5 text-primary shrink-0" />
                        <div className="truncate">
                          <p className="text-xs font-semibold text-white truncate max-w-[200px]">{file.name}</p>
                          <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{file.size} · {file.status.toUpperCase()}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {file.status === "finished" && (
                          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[9px]">Aprovado por OCR</Badge>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-rose-400 cursor-pointer"
                          onClick={() => clearFileFromQueue(file.name)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>

                    {file.status === "uploading" && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-mono">
                          <span>Transferindo arquivo...</span>
                          <span>{file.progress}%</span>
                        </div>
                        <Progress value={file.progress} className="h-1" />
                      </div>
                    )}

                    {file.status === "scanning" && (
                      <div className="space-y-1 text-[10px] text-primary font-mono flex items-center gap-2 animate-pulse">
                        <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
                        <span>Escaneando matriz biométrica & OCR Antifraude...</span>
                      </div>
                    )}

                    {file.status === "finished" && file.ocrData && (
                      <div className="bg-primary/5 rounded-lg border border-primary/20 p-2.5 text-[10px] font-mono text-muted-foreground leading-relaxed space-y-1">
                        <p className="font-semibold text-white flex items-center gap-1">
                          <Sparkles className="h-3 w-3 text-primary" /> Resultados da Autovalidação:
                        </p>
                        <p>👤 <strong>Titular Extraído:</strong> {file.ocrData.name}</p>
                        <p>💳 <strong>CPF Reconhecido:</strong> {file.ocrData.docNum}</p>
                        <p>🎯 <strong>Confiabilidade Biométrica:</strong> {file.ocrData.score}% (Sucesso)</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* KYC Approval Timeline (linha de tempo de aprovação) */}
        <div className="rounded-2xl border border-border/60 bg-card/60 p-6 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center gap-2 border-b border-border/40 pb-3">
              <Clock className="h-5 w-5 text-primary shrink-0" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Status & Histórico</h3>
            </div>

            <div className="space-y-6 pt-2">
              <div className="relative border-l border-border/80 pl-4 space-y-6 text-xs">
                
                {/* Step 1 */}
                <div className="relative">
                  <span className="absolute -left-6.5 top-0.5 h-4 w-4 rounded-full bg-emerald-500 border-2 border-slate-900 grid place-items-center text-[10px] text-white">✓</span>
                  <div className="space-y-0.5">
                    <p className="font-semibold text-white">1. Envio de Arquivos</p>
                    <p className="text-muted-foreground">CPF e RG submetidos pelo usuário via interface no onboarding inicial.</p>
                    <span className="text-[10px] text-muted-foreground/60 font-mono block">12 Abr 2023 · 14h:22</span>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative">
                  <span className="absolute -left-6.5 top-0.5 h-4 w-4 rounded-full bg-emerald-500 border-2 border-slate-900 grid place-items-center text-[10px] text-white">✓</span>
                  <div className="space-y-0.5">
                    <p className="font-semibold text-white">2. Escaneamento OCR</p>
                    <p className="text-muted-foreground">Allin AI Engine mapeou textos e CPFs extraídos dos metadados digitais.</p>
                    <span className="text-[10px] text-muted-foreground/60 font-mono block">12 Abr 2023 · 14h:24</span>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative">
                  <span className="absolute -left-6.5 top-0.5 h-4 w-4 rounded-full bg-emerald-500 border-2 border-slate-900 grid place-items-center text-[10px] text-white">✓</span>
                  <div className="space-y-0.5">
                    <p className="font-semibold text-white">3. Validação Antifraude</p>
                    <p className="text-muted-foreground">Sem divergências biométricas na Receita Federal do Brasil.</p>
                    <span className="text-[10px] text-muted-foreground/60 font-mono block">12 Abr 2023 · 14h:30</span>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="relative">
                  <span className="absolute -left-6.5 top-0.5 h-4 w-4 rounded-full bg-blue-500 animate-pulse border-2 border-slate-900" />
                  <div className="space-y-0.5 text-blue-300">
                    <p className="font-semibold text-white">4. MEI / CNPJ Facultativo</p>
                    <p className="text-muted-foreground">Aditivo de Microempresa nacional de Mariana Ribeiro sob checagem pendente.</p>
                    <span className="text-[10px] text-muted-foreground/60 font-mono block">Enviado em 22 Mai 2026</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div className="bg-primary/5 rounded-xl border border-primary/20 p-3 pt-3 mt-6 text-[11px] text-muted-foreground flex items-center gap-2">
            <Info className="h-4 w-4 text-primary shrink-0" />
            <span>Precisa atualizar seu CPF cadastrado? Abra um ticket do suporte master na aba Configurações.</span>
          </div>
        </div>

      </div>

      {/* Already Approved Files Registry Table */}
      <div className="rounded-2xl border border-border/60 bg-card/60 p-5">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-4">Registro de Documentos Validados</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <div key={doc.id} className="bg-background/40 border border-border/50 rounded-xl p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText className="h-5 w-5 text-emerald-400 shrink-0" />
                <div className="truncate">
                  <p className="text-xs font-semibold text-white truncate">{doc.nome}</p>
                  <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{doc.date}</p>
                </div>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] uppercase font-mono">Ativo</Badge>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
