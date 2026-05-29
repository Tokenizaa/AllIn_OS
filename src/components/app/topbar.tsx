import { Bell, Command, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Topbar({ onCopilot }: { onCopilot: () => void }) {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur">
      <div className="relative flex-1 max-w-xl">
        <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar distribuidor, pedido, produto…  (⌘K para Copiloto)"
          className="h-9 pl-8 bg-card/60 border-border/60"
        />
        <kbd className="hidden md:inline-flex absolute right-2 top-1.5 items-center gap-1 rounded border border-border bg-muted/40 px-1.5 py-0.5 text-[10px] text-muted-foreground">
          <Command className="h-3 w-3" />K
        </kbd>
      </div>
      <Button variant="outline" size="sm" onClick={onCopilot} className="gap-1.5">
        <Sparkles className="h-4 w-4 text-primary" /> Copiloto
      </Button>
      <Button variant="ghost" size="icon" aria-label="Notificações">
        <Bell className="h-4 w-4" />
      </Button>
      <Avatar className="h-8 w-8">
        <AvatarFallback className="bg-gradient-to-br from-primary to-fuchsia-500 text-xs text-white">AO</AvatarFallback>
      </Avatar>
    </header>
  );
}
