import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Download, Search, Filter, Play, FileText, FolderArchive, ArrowRight,
  Sparkles, CheckCircle2, Bookmark, BookmarkCheck, Clock, BookOpen,
  Volume2, ExternalLink, RefreshCw, Star, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { downloadsLibrary, formatBRL } from "@/lib/distributor-data";
import { toast } from "sonner";

export const Route = createFileRoute("/office/downloads")({
  component: DownloadsPage,
});

function DownloadsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [favorites, setFavorites] = useState<string[]>(["dl2", "dl4"]);
  const [activeVideo, setActiveVideo] = useState<{ id: string; title: string; duration: string } | null>({
    id: "dl1",
    title: "Onboarding do Distribuidor",
    duration: "18 min"
  });
  const [videoProgress, setVideoProgress] = useState(65); // Onboarding is 65% completed

  const handleDownload = (title: string) => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1800)),
      {
        loading: `Iniciando download seguro para "${title}"...`,
        success: () => `Arquivo "${title}" transferido com sucesso!`,
        error: "Erro no download do arquivo.",
      }
    );
  };

  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(f => f !== id));
      toast.success("Removido dos favoritos.");
    } else {
      setFavorites([...favorites, id]);
      toast.success("Adicionado aos favoritos!");
    }
  };

  // Filter list
  const filteredLibrary = downloadsLibrary.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
                          item.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "all" || 
                            item.category.toLowerCase() === activeCategory.toLowerCase() ||
                            (activeCategory === "favorites" && favorites.includes(item.id));
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <Download className="h-8 w-8 text-primary shrink-0" />
            Biblioteca & Onboarding <span className="text-xs font-mono font-medium tracking-normal text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase">Downloads</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Treinamentos exclusivos em vídeo, banners promocionais de IA, PDFs explicativos e campanhas prontas de captação.
          </p>
        </div>
      </div>

      {/* Recommended/Onboarding Course (Streaming de Vídeo & Progresso) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Virtual Video Player Column */}
        <div className="lg:col-span-2 rounded-2xl border border-border/60 bg-[#06090f] p-5 flex flex-col justify-between min-h-[350px]">
          <div>
            <div className="flex items-center justify-between border-b border-border/40 pb-3 mb-4">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <Play className="h-3 w-3 fill-primary text-primary" /> Streaming On-Demand
              </span>
              <Badge variant="outline" className="text-[10px] border-emerald-500/20 text-emerald-400 bg-emerald-500/5">Treinamento Ativo</Badge>
            </div>

            {activeVideo ? (
              <div className="space-y-4">
                {/* Simulated Screen */}
                <div className="relative aspect-video rounded-xl bg-slate-950 border border-border/40 overflow-hidden flex items-center justify-center group">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                  
                  {/* Subtle pulsing ambient effect */}
                  <div className="absolute inset-x-0 bottom-0 p-4 z-20 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white truncate">{activeVideo.title}</p>
                      <p className="text-[11px] text-muted-foreground">{activeVideo.duration} restantes · Assistindo agora</p>
                    </div>
                    <Button 
                      size="sm" 
                      className="h-8 rounded-lg bg-primary hover:bg-primary/95 text-white gap-1.5 text-xs shrink-0 cursor-pointer"
                      onClick={() => {
                        setVideoProgress(100);
                        toast.success("Aula concluída! 20 XP somados ao seu perfil.");
                      }}
                    >
                      Concluir Aula
                    </Button>
                  </div>

                  {/* Play circle */}
                  <div className="h-14 w-14 rounded-full bg-primary/20 border border-primary text-white grid place-items-center group-hover:scale-115 transition-transform cursor-pointer z-20">
                    <Play className="h-6 w-6 fill-white text-white ml-0.5" />
                  </div>
                </div>

                {/* Progress Tracking */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> Progresso da Masterclass
                    </span>
                    <span className="font-semibold text-white">{videoProgress}% completo</span>
                  </div>
                  <Progress value={videoProgress} className="h-1.5" />
                </div>
              </div>
            ) : (
              <div className="h-44 flex flex-col items-center justify-center text-muted-foreground text-xs italic">
                Nenhum vídeo carregado. Selecione um curso abaixo na lista.
              </div>
            )}
          </div>
        </div>

        {/* IA Smart Assistant Recommends (Recomendação IA) */}
        <div className="rounded-2xl border border-border/60 bg-card/60 p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-border/40 pb-3">
              <Sparkles className="h-5 w-5 text-primary shrink-0" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Indicações da IA</h3>
            </div>
            
            <p className="text-xs text-muted-foreground leading-relaxed">
              Baseado nas suas metas de fechar o nível <strong className="text-white">Black</strong> este mês, a IA sugere priorizar as seguintes apostilas de vendas:
            </p>

            <div className="space-y-3.5 pt-2">
              <div className="bg-background/40 border border-border/60 rounded-xl p-3 flex items-start gap-3">
                <FileText className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">Roteiros de WhatsApp prontos</p>
                  <p className="text-[10px] text-muted-foreground">Vendas imediatas de rejuvenescimento</p>
                </div>
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => handleDownload("Roteiros de WhatsApp")}>
                  <Download className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="bg-background/40 border border-border/60 rounded-xl p-3 flex items-start gap-3">
                <FolderArchive className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">Kit Campanha Vita Complex</p>
                  <p className="text-[10px] text-muted-foreground">Banners, copy e criativos otimizados</p>
                </div>
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => handleDownload("Kit Campanha Vita Complex")}>
                  <Download className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 rounded-xl border border-primary/20 p-3 flex items-center gap-2 text-[10px] text-muted-foreground font-mono mt-4">
            <Info className="h-4 w-4 text-primary shrink-0" />
            <span>Downloads concluídos geram pontos de qualificação residual (PV).</span>
          </div>
        </div>

      </div>

      {/* Toolbar Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-3">
        
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="text" 
            placeholder="Buscar treinamentos..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        {/* Categories togglers */}
        <div className="flex flex-wrap gap-1">
          <Button 
            variant={activeCategory === "all" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setActiveCategory("all")}
            className="h-8 text-[11px] px-3 font-medium"
          >
            Todos
          </Button>
          <Button 
            variant={activeCategory === "treinamento" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setActiveCategory("treinamento")}
            className="h-8 text-[11px] px-3 font-medium border-border/60"
          >
            Vídeos
          </Button>
          <Button 
            variant={activeCategory === "estratégia" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setActiveCategory("estratégia")}
            className="h-8 text-[11px] px-3 font-medium border-border/60"
          >
            Estratégias (PDF)
          </Button>
          <Button 
            variant={activeCategory === "campanha" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setActiveCategory("campanha")}
            className="h-8 text-[11px] px-3 font-medium border-border/60"
          >
            Campanhas / Criativos
          </Button>
          <Button 
            variant={activeCategory === "favorites" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setActiveCategory("favorites")}
            className="h-8 text-[11px] px-3 font-medium border-border/60 text-amber-400 hover:text-amber-300 gap-1"
          >
            <Bookmark className="h-3 w-3" /> Favoritos
          </Button>
        </div>
      </div>

      {/* Library Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredLibrary.length === 0 ? (
          <div className="col-span-full text-center py-12 text-sm text-muted-foreground italic">
            Nenhum material de apoio correspondente para esta categoria de download.
          </div>
        ) : (
          filteredLibrary.map((item) => {
            const isFav = favorites.includes(item.id);
            return (
              <motion.div 
                key={item.id} 
                whileHover={{ y: -3 }}
                className="rounded-2xl border border-border/60 bg-card/60 p-4 flex flex-col justify-between min-h-[160px]"
              >
                <div>
                  <div className="flex items-start justify-between gap-2.5">
                    <Badge variant="outline" className="text-[9px] uppercase tracking-wider font-mono px-1.5 py-0">
                      {item.category}
                    </Badge>
                    <button 
                      onClick={() => toggleFavorite(item.id)}
                      className="text-muted-foreground hover:text-amber-400 transition-colors cursor-pointer"
                    >
                      {isFav ? <BookmarkCheck className="h-4 w-4 text-amber-400" /> : <Bookmark className="h-4 w-4" />}
                    </button>
                  </div>
                  
                  <h4 className="mt-3 text-sm font-semibold text-white leading-snug line-clamp-2">
                    {item.title}
                  </h4>
                  <p className="mt-1 text-[11px] text-muted-foreground font-mono">
                    {item.type === "video" ? `Vídeo Streaming (${item.duration})` : `Arquivo digital (${item.size || "1.5 MB"})`}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border/20 flex items-center gap-1.5">
                  {item.type === "video" ? (
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="w-full h-8 text-xs border-primary/20 hover:bg-primary/10 hover:text-white text-primary gap-1"
                      onClick={() => {
                        setActiveVideo({ id: item.id, title: item.title, duration: item.duration || "10 min" });
                        toast.success(`Carregado "${item.title}" no reprodutor principal.`);
                        window.scrollTo({ top: 300, behavior: "smooth" });
                      }}
                    >
                      <Play className="h-3.5 w-3.5 fill-current" /> Assistir Aula
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      className="w-full h-8 text-xs bg-muted hover:bg-muted/80 text-foreground gap-1"
                      onClick={() => handleDownload(item.title)}
                    >
                      <Download className="h-3.5 w-3.5" /> Baixar Material
                    </Button>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>

    </div>
  );
}
