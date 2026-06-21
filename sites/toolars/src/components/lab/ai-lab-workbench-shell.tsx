import type { ReactNode } from "react";

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
  const metadata = [
    ["Run mode", runMode],
    ["Provider route", providerRoute],
    ["Artifact state", artifactState]
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
