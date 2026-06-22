import type { ReactNode } from "react";
import { useTranslations } from "next-intl";

type AiLabWorkbenchShellProps = {
  artifactState: string;
  children: ReactNode;
  providerRoute: string;
  runMode: string;
  toolSlug: string;
};

export function AiLabWorkbenchShell({
  artifactState,
  children,
  providerRoute,
  runMode,
  toolSlug
}: AiLabWorkbenchShellProps) {
  const t = useTranslations("aiLab");
  const metadata = [
    [t("metadata.runMode"), runMode],
    [t("metadata.providerRoute"), providerRoute],
    [t("metadata.artifactState"), artifactState]
  ] as const;

  return (
    <div className="ai-lab-workbench" data-ai-lab-tool={toolSlug} data-testid="ai-lab-workbench">
      <div aria-label="AI Lab execution metadata" className="ai-lab-workbench-meta">
        {metadata.map(([label, value]) => (
          <div className="ai-lab-workbench-meta-item" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
      <div className="ai-lab-workbench-grid">{children}</div>
    </div>
  );
}
