import { readFileSync } from "node:fs";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { DockerComposeConverterWorkspace } from "./docker-compose-converter-workspace";

const dockerComposeConverterSourceFile =
  "src/app/[locale]/tools/docker-compose-converter/docker-compose-converter-workspace.tsx";

function scanDockerComposeConverterWorkspaceSource() {
  return scanSourceText(readFileSync(dockerComposeConverterSourceFile, "utf8"), dockerComposeConverterSourceFile);
}

describe("DockerComposeConverterWorkspace", () => {
  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanDockerComposeConverterWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders and converts docker run commands", () => {
    renderWithIntl(<DockerComposeConverterWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "docker-compose-converter");
    expect(screen.getByRole("heading", { name: "Docker Compose Converter" })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Docker input"), {
      target: { value: "docker run --name web -p 8080:80 nginx:alpine" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Convert Docker config" }));

    expect(screen.getByText(/services:/)).toBeInTheDocument();
    expect(screen.getByText(/image: nginx:alpine/)).toBeInTheDocument();
  });
});
