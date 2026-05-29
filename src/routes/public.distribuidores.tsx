import { createFileRoute } from "@tanstack/react-router";
import DistribuidoresPage from "@/pages/DistribuidoresPage";

export const Route = createFileRoute("/public/distribuidores")({
  component: DistribuidoresPage,
});
