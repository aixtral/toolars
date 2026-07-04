export interface ShadowLayer {
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
  inset: boolean;
}

export interface BoxShadowPreset {
  name: string;
  layers: ShadowLayer[];
}

export interface BoxShadowCssResult {
  css: string;
  preview: string;
  layerCount: number;
  privacyNote: string;
}

export const BOX_SHADOW_PRESETS: Record<string, BoxShadowPreset> = {
  subtle: {
    name: "Subtle",
    layers: [{ x: 0, y: 1, blur: 3, spread: 0, color: "#000000", opacity: 10, inset: false }]
  },
  elevated: {
    name: "Elevated",
    layers: [
      { x: 0, y: 4, blur: 6, spread: -1, color: "#000000", opacity: 10, inset: false },
      { x: 0, y: 2, blur: 4, spread: -2, color: "#000000", opacity: 10, inset: false }
    ]
  },
  floating: {
    name: "Floating",
    layers: [
      { x: 0, y: 20, blur: 25, spread: -5, color: "#000000", opacity: 15, inset: false },
      { x: 0, y: 8, blur: 10, spread: -6, color: "#000000", opacity: 10, inset: false }
    ]
  },
  sharp: {
    name: "Sharp",
    layers: [{ x: 8, y: 8, blur: 0, spread: 0, color: "#000000", opacity: 100, inset: false }]
  }
};

export function generateBoxShadowCss(layers: ShadowLayer[]): BoxShadowCssResult {
  const preview = layers.map(formatLayer).join(",\n  ");

  return {
    css: `box-shadow: ${preview};`,
    preview,
    layerCount: layers.length,
    privacyNote: "Local CSS shadow generation only; values stay in the browser."
  };
}

export function hexToRgba(hex: string, opacity: number): string {
  const clean = hex.trim().replace("#", "");
  const valid = /^[0-9a-fA-F]{6}$/.test(clean) ? clean : "000000";
  const r = parseInt(valid.slice(0, 2), 16);
  const g = parseInt(valid.slice(2, 4), 16);
  const b = parseInt(valid.slice(4, 6), 16);
  const alpha = Math.max(0, Math.min(100, opacity)) / 100;

  return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})`;
}

function formatLayer(layer: ShadowLayer): string {
  const inset = layer.inset ? "inset " : "";
  return `${inset}${layer.x}px ${layer.y}px ${layer.blur}px ${layer.spread}px ${hexToRgba(layer.color, layer.opacity)}`;
}
