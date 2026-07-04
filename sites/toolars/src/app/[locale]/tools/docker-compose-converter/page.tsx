import { ToolarsShell } from "@/components/shell/toolars-shell";
import { DockerComposeConverterWorkspace } from "./docker-compose-converter-workspace";

export default function DockerComposeConverterPage() {
  return (
    <ToolarsShell active="ai-developer">
      <DockerComposeConverterWorkspace />
    </ToolarsShell>
  );
}
