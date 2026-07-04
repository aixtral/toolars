import { describe, expect, it } from "vitest";
import { convertDockerCompose } from "./docker-compose-converter";

describe("convertDockerCompose", () => {
  it("converts docker run commands into compose YAML", () => {
    const result = convertDockerCompose({
      direction: "run-to-compose",
      input: "docker run --name web -p 8080:80 -e NODE_ENV=production nginx:alpine"
    });

    expect(result.success).toBe(true);
    expect(result.output).toContain("services:");
    expect(result.output).toContain("image: nginx:alpine");
    expect(result.metadata.ports).toContain("8080:80");
    expect(result.warnings.some((warning) => warning.type === "env-review")).toBe(true);
  });

  it("converts simple compose YAML into a docker run command", () => {
    const result = convertDockerCompose({
      direction: "compose-to-run",
      input: "services:\n  app:\n    image: redis:7\n    ports:\n      - 6379:6379\n"
    });

    expect(result.success).toBe(true);
    expect(result.output).toContain("docker run");
    expect(result.output).toContain("-p 6379:6379");
    expect(result.output).toContain("redis:7");
  });
});
