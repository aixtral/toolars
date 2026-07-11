"use client";

import { useEffect } from "react";
import { recordToolarsRecentTool } from "@/lib/supabase/toolars-supabase-workspace-client";

export function ToolarsRecentToolRecorder({ locale, toolSlug }: { locale: string; toolSlug: string }) {
  useEffect(() => {
    void recordToolarsRecentTool({ locale, toolSlug });
  }, [locale, toolSlug]);

  return null;
}
