import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/seja-distribuidor")({
  beforeLoad: () => {
    const defaultSlug = import.meta.env.VITE_DEFAULT_DISTRIBUTOR_SLUG || "allinBrasil";
    throw redirect({ to: `/seja-distribuidor/${defaultSlug}` });
  },
});
