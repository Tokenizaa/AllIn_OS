import { createFileRoute } from "@tanstack/react-router";
import LojaPage from "@/pages/LojaPage";

export const Route = createFileRoute("/public/loja")({
  component: LojaPage,
});
