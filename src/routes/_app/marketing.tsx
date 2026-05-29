import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/widgets/page-header";
import { Megaphone, Link as LinkIcon, Mail, Image as ImageIcon, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/marketing")({ component: MarketingPage });

const cards = [
  { icon: Megaphone, title: "Campanhas ativas", value: "12", hint: "4 com IA generativa" },
  { icon: LinkIcon, title: "Links inteligentes", value: "284", hint: "62% de conversão média" },
  { icon: Mail, title: "Comunicações", value: "8 trilhas", hint: "Multicanal · email/SMS/WhatsApp" },
  { icon: ImageIcon, title: "Banners", value: "36", hint: "AB testing ativo" },
];

function MarketingPage() {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Marketing" title="Campanhas & Comunicação" subtitle="Disparos contextuais, links rastreáveis e ativos da marca." actions={<Button size="sm">Nova campanha</Button>} />
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.title} className="rounded-xl border border-border bg-card/60 p-4">
              <Icon className="h-5 w-5 text-primary" />
              <p className="mt-3 text-xs text-muted-foreground">{c.title}</p>
              <p className="text-2xl font-semibold mt-0.5">{c.value}</p>
              <p className="text-[11px] text-muted-foreground mt-1">{c.hint}</p>
            </div>
          );
        })}
      </div>
      <div className="rounded-xl border border-border bg-card/60 p-5">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><Download className="h-4 w-4 text-primary" /> Materiais para a rede</h3>
        <div className="grid md:grid-cols-3 gap-3">
          {["Kit institucional","Banners Q4","Pitch Black"].map((m) => (
            <div key={m} className="rounded-lg border border-border bg-background/40 p-3 flex items-center justify-between">
              <span className="text-sm">{m}</span>
              <Button size="sm" variant="outline">Baixar</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
