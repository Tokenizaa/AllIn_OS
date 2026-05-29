import { createFileRoute } from "@tanstack/react-router";
import { DistributorRecruitmentPage } from "./seja-distribuidor.$slug";

export const Route = createFileRoute("/seja-distribuidor")({
  component: DistributorRecruitmentPage,
});
