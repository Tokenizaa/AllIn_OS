import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/widgets/page-header";
import { InsightCard } from "@/components/widgets/insight-card";
import { insights } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/insights")({ component: InsightsPage });

function InsightsPage() {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Executive · Intelligence" title="Insights da IA" subtitle="Sinais gerados continuamente a partir de eventos, métricas e padrões da rede." />
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
        {insights.map((i) => <InsightCard key={i.id} insight={i} />)}
        {insights.map((i) => <InsightCard key={i.id + "b"} insight={{ ...i, id: i.id + "b" }} />)}
      </div>
    </div>
  );
}
