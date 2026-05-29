import { Bot, CheckCircle2, CreditCard, FileText, ShoppingBag, ShieldAlert, Sparkles, Wallet } from "lucide-react";
import type { TimelineEvent } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const iconMap = {
  order: ShoppingBag,
  payment: CreditCard,
  bonus: Wallet,
  verification: CheckCircle2,
  activation: Sparkles,
  note: FileText,
  automation: Bot,
  risk: ShieldAlert,
} as const;

const colorMap = {
  order: "text-primary",
  payment: "text-info",
  bonus: "text-success",
  verification: "text-success",
  activation: "text-primary",
  note: "text-muted-foreground",
  automation: "text-fuchsia-400",
  risk: "text-destructive",
} as const;

export function Timeline({ events }: { events: TimelineEvent[] }) {
  return (
    <ol className="relative border-l border-border/60 pl-5 space-y-4">
      {events.map((e) => {
        const Icon = iconMap[e.type];
        return (
          <li key={e.id} className="relative">
            <span className={cn("absolute -left-[27px] grid h-5 w-5 place-items-center rounded-full border border-border bg-card", colorMap[e.type])}>
              <Icon className="h-3 w-3" />
            </span>
            <div className="flex items-baseline justify-between gap-2">
              <h5 className="text-sm font-medium">{e.title}</h5>
              <time className="text-[11px] text-muted-foreground whitespace-nowrap">
                {new Date(e.at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
              </time>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">{e.description}</p>
            {e.actor && <span className="mt-1 inline-block text-[10px] text-fuchsia-300/80">por {e.actor}</span>}
          </li>
        );
      })}
    </ol>
  );
}
