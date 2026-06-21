import { getToolarsProductionRuntimeStatus } from "@/lib/ops/toolars-runtime-config";

export const runtime = "nodejs";

export function GET() {
  return Response.json(getToolarsProductionRuntimeStatus());
}
