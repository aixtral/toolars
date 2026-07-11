import { describe, expect, it } from "vitest";
import { formatButtonBehaviorAudit, scanButtonBehaviorSource } from "./audit-button-behavior.mjs";

describe("button behavior audit", () => {
  it("flags type=button controls that have no concrete behavior", () => {
    const findings = scanButtonBehaviorSource(
      `
      export function Fixture() {
        return (
          <section>
            <button className="button" type="button">Looks clickable</button>
            <button aria-pressed="true" type="button">Static toggle</button>
          </section>
        );
      }
      `,
      "fixture.tsx"
    );

    expect(findings).toEqual([
      expect.objectContaining({
        filePath: "fixture.tsx",
        line: 5
      }),
      expect.objectContaining({
        filePath: "fixture.tsx",
        line: 6
      })
    ]);
  });

  it("allows buttons with explicit action, submit, disabled, or form action semantics", () => {
    const findings = scanButtonBehaviorSource(
      `
      export function Fixture() {
        return (
          <section>
            <button className="button" type="button" onClick={run}>Run</button>
            <button className="button" type="submit">Submit</button>
            <button className="button" disabled type="button">Phase 2</button>
            <button className="button" formAction={submit}>Server action</button>
          </section>
        );
      }
      `,
      "fixture.tsx"
    );

    expect(findings).toEqual([]);
  });

  it("formats a compact release-gate summary", () => {
    const output = formatButtonBehaviorAudit({
      findings: [
        {
          filePath: "fixture.tsx",
          line: 4,
          message: "Button needs onClick, disabled, formAction, or type=\"submit\" behavior."
        }
      ],
      summary: {
        ambiguousButtons: 1,
        scannedFiles: 2
      }
    });

    expect(output).toContain("Toolars button behavior audit: fail");
    expect(output).toContain("Ambiguous buttons: 1");
    expect(output).toContain("fixture.tsx:4");
  });
});
