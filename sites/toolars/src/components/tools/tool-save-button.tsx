"use client";

import { Bookmark, Check } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { saveToolarsTool } from "@/lib/supabase/toolars-supabase-workspace-client";

export function ToolSaveButton({ locale, toolSlug }: { locale: string; toolSlug: string }) {
  const t = useTranslations("common");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  async function saveTool() {
    if (saving || saved) return;

    setSaving(true);
    const result = await saveToolarsTool({ locale, toolSlug });
    setSaving(false);
    if (result.ok) setSaved(true);
  }

  return (
    <button
      aria-label={t("save")}
      aria-pressed={saved}
      className="tool-save-button"
      disabled={saving}
      onClick={() => void saveTool()}
      title={t("save")}
      type="button"
    >
      {saved ? <Check size={16} aria-hidden="true" /> : <Bookmark size={16} aria-hidden="true" />}
    </button>
  );
}
