import { createFileRoute } from "@tanstack/react-router";
import { DistributorStorePage } from "./loja.$slug";

export const Route = createFileRoute("/checkout")({
  component: DistributorStorePage,
});
