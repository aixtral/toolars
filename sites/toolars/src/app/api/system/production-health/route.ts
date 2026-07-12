import { getToolarsProductionRuntimeStatus } from "@/lib/ops/toolars-runtime-config";

export const runtime = "nodejs";

export function GET(request: Request) {
  const token = process.env.TOOLARS_HEALTHCHECK_TOKEN?.trim();
  if (!token || request.headers.get("authorization") !== `Bearer ${token}`) {
    return Response.json({ status: "ok" });
  }
  return Response.json(getToolarsProductionRuntimeStatus());
}
