import { Bell, Search, Sparkles, Copy, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { distributor } from "@/lib/distributor-data";
import { toast } from "sonner";

export function OfficeTopbar() {
  const copyLink = () => {
    navigator.clipboard.writeText(distributor.link_loja);
    toast.success("Link da sua loja copiado!");
  };
  return (
    <header className="h-16 shrink-0 border-b border-border/60 bg-background/70 backdrop-blur-xl sticky top-0 z-30">
      <div className="h-full px-4 md:px-8 flex items-center gap-4">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar pedidos, clientes, materiais…" className="pl-9 h-10 bg-muted/40 border-border/60" />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded bg-background/60 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground border border-border/60">⌘K</kbd>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={copyLink} className="hidden md:inline-flex gap-2">
            <Copy className="h-3.5 w-3.5" /> Copiar link
          </Button>
          <Button variant="outline" size="sm" className="hidden md:inline-flex gap-2">
            <Share2 className="h-3.5 w-3.5" /> Compartilhar
          </Button>
          <Button size="sm" className="gap-2 bg-gradient-to-r from-primary to-fuchsia-500 hover:opacity-90">
            <Sparkles className="h-3.5 w-3.5" /> Copiloto
          </Button>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-destructive" />
          </Button>
        </div>
      </div>
    </header>
  );
}