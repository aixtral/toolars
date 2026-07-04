import { describe, expect, it } from "vitest";
import { generateConicGradient, generateGradientCss, generateLinearGradient, generateRadialGradient } from "./css-gradient-generator";

describe("CSS gradient generation", () => {
  it("generates linear, radial, and conic gradients from source-compatible stops", () => {
    expect(
      generateLinearGradient({
        angle: 45,
        stops: [
          { color: "#ff0000", position: 0 },
          { color: "#00ff00", position: 100 }
        ]
      })
    ).toBe("linear-gradient(45deg, #ff0000 0%, #00ff00 100%)");

    expect(
      generateRadialGradient({
        shape: "circle",
        stops: [
          { color: "#ff0000", position: 0 },
          { color: "#0000ff", position: 100 }
        ]
      })
    ).toBe("radial-gradient(circle, #ff0000 0%, #0000ff 100%)");

    expect(
      generateConicGradient({
        angle: 90,
        stops: [
          { color: "#ff0000", position: 0 },
          { color: "#0000ff", position: 100 }
        ]
      })
    ).toBe("conic-gradient(from 90deg, #ff0000 0%, #0000ff 100%)");
  });

  it("wraps gradient output in a copy-ready CSS declaration", () => {
    const result = generateGradientCss({
      type: "linear",
      angle: 135,
      shape: "ellipse",
      stops: [
        { color: "#0f172a", position: 0 },
        { color: "#14b8a6", position: 100 }
      ]
    });

    expect(result.css).toBe("background: linear-gradient(135deg, #0f172a 0%, #14b8a6 100%);");
    expect(result.preview).toBe("linear-gradient(135deg, #0f172a 0%, #14b8a6 100%)");
  });
});
