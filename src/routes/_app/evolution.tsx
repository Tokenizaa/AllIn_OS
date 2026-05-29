import { createFileRoute } from "@tanstack/react-router";
import EvolutionPage from "@/pages/admin/EvolutionPage";

export const Route = createFileRoute("/_app/evolution")({
  component: EvolutionPage,
});
