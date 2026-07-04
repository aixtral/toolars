export type DockerComposeDirection = "run-to-compose" | "compose-to-run";

export interface DockerComposeInput {
  input: string;
  direction: DockerComposeDirection;
}

export interface DockerComposeWarning {
  type: "env-review" | "unsupported-flag" | "parse-review";
  message: string;
}

export interface DockerComposeResult {
  success: boolean;
  output: string;
  error?: string;
  warnings: DockerComposeWarning[];
  metadata: {
    image?: string;
    serviceName?: string;
    ports: string[];
    volumes: string[];
    environment: string[];
  };
  privacyNote: string;
}

interface DockerService {
  image?: string;
  container_name?: string;
  ports: string[];
  volumes: string[];
  environment: string[];
}

const privacyNote = "Docker command and Compose text are converted locally in the browser.";

export function convertDockerCompose({ input, direction }: DockerComposeInput): DockerComposeResult {
  try {
    if (!input.trim()) throw new Error("Add Docker input before converting.");
    return direction === "run-to-compose" ? runToCompose(input) : composeToRun(input);
  } catch (error) {
    return {
      success: false,
      output: "",
      error: error instanceof Error ? error.message : "Docker conversion failed.",
      warnings: [],
      metadata: { ports: [], volumes: [], environment: [] },
      privacyNote
    };
  }
}

function runToCompose(command: string): DockerComposeResult {
  const service = parseDockerRun(command);
  const serviceName = service.container_name ?? "app";
  const lines = ["services:", `  ${serviceName}:`];
  if (service.image) lines.push(`    image: ${service.image}`);
  if (service.container_name) lines.push(`    container_name: ${service.container_name}`);
  appendList(lines, "ports", service.ports);
  appendList(lines, "volumes", service.volumes);
  appendList(lines, "environment", service.environment);

  const warnings = service.environment.length > 0 ? [{ type: "env-review" as const, message: "Review environment values before sharing output." }] : [];

  return {
    success: true,
    output: `${lines.join("\n")}\n`,
    warnings,
    metadata: { ...service, serviceName },
    privacyNote
  };
}

function composeToRun(yaml: string): DockerComposeResult {
  const serviceName = yaml.match(/^\s{2}([A-Za-z0-9_-]+):\s*$/m)?.[1] ?? "app";
  const image = yaml.match(/^\s*image:\s*([^\n]+)/m)?.[1]?.trim();
  const ports = readYamlList(yaml, "ports");
  const volumes = readYamlList(yaml, "volumes");
  const environment = readYamlList(yaml, "environment");
  if (!image) throw new Error("Compose YAML needs a service image.");

  const parts = ["docker run"];
  for (const port of ports) parts.push("-p", port);
  for (const volume of volumes) parts.push("-v", volume);
  for (const env of environment) parts.push("-e", env);
  parts.push(image);

  return {
    success: true,
    output: parts.join(" "),
    warnings: environment.length > 0 ? [{ type: "env-review", message: "Review environment values before sharing output." }] : [],
    metadata: { image, serviceName, ports, volumes, environment },
    privacyNote
  };
}

function parseDockerRun(command: string): DockerService {
  const tokens = command.trim().split(/\s+/);
  if (tokens[0] !== "docker" || tokens[1] !== "run") throw new Error("Input must start with docker run.");

  const service: DockerService = { ports: [], volumes: [], environment: [] };
  for (let index = 2; index < tokens.length; index++) {
    const token = tokens[index];
    if (token === "--name") service.container_name = tokens[++index];
    else if (token === "-p" || token === "--publish") service.ports.push(tokens[++index]);
    else if (token === "-v" || token === "--volume") service.volumes.push(tokens[++index]);
    else if (token === "-e" || token === "--env") service.environment.push(tokens[++index]);
    else if (token === "-d" || token === "--rm" || token === "-it" || token === "-i" || token === "-t") continue;
    else if (!token.startsWith("-")) service.image = token;
  }
  return service;
}

function appendList(lines: string[], key: keyof Pick<DockerService, "ports" | "volumes" | "environment">, values: string[]) {
  if (!values.length) return;
  lines.push(`    ${key}:`);
  for (const value of values) lines.push(`      - ${value}`);
}

function readYamlList(yaml: string, key: string): string[] {
  const match = yaml.match(new RegExp(`^\\s*${key}:\\s*\\n((?:\\s*-\\s*[^\\n]+\\n?)+)`, "m"));
  if (!match) return [];
  return match[1]
    .split("\n")
    .map((line) => line.trim().replace(/^-\s*/, ""))
    .filter(Boolean);
}
