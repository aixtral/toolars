export type RadiusUnit = "px" | "%";

export interface BorderRadiusOptions {
  topLeft: number;
  topRight: number;
  bottomRight: number;
  bottomLeft: number;
  unit: RadiusUnit;
}

export interface BorderRadiusResult {
  css: string;
  preview: string;
  simplified: boolean;
  privacyNote: string;
}

export const RADIUS_PRESETS: Record<string, BorderRadiusOptions & { name: string }> = {
  circle: { name: "Circle", topLeft: 50, topRight: 50, bottomRight: 50, bottomLeft: 50, unit: "%" },
  pill: { name: "Pill", topLeft: 9999, topRight: 9999, bottomRight: 9999, bottomLeft: 9999, unit: "px" },
  squircle: { name: "Squircle", topLeft: 30, topRight: 30, bottomRight: 30, bottomLeft: 30, unit: "%" },
  leaf: { name: "Leaf", topLeft: 0, topRight: 100, bottomRight: 0, bottomLeft: 100, unit: "%" },
  blob: { name: "Blob", topLeft: 30, topRight: 70, bottomRight: 30, bottomLeft: 70, unit: "%" }
};

export function generateBorderRadiusCSS(options: BorderRadiusOptions): BorderRadiusResult {
  const values = [options.topLeft, options.topRight, options.bottomRight, options.bottomLeft].map((value) => `${Math.max(0, value)}${options.unit}`);
  const simplified = values.every((value) => value === values[0]);
  const preview = simplified ? values[0] : values.join(" ");

  return {
    css: `border-radius: ${preview};`,
    preview,
    simplified,
    privacyNote: "Local CSS border-radius generation only; values stay in the browser."
  };
}
