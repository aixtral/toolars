import { ToolarsShell } from "@/components/shell/toolars-shell";
import { CertificateDecoderWorkspace } from "./certificate-decoder-workspace";

export default function CertificateDecoderPage() {
  return (
    <ToolarsShell active="ai-developer">
      <CertificateDecoderWorkspace />
    </ToolarsShell>
  );
}
