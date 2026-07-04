export interface ColorStop {
  color: string;
  position: number;
}

export type GradientType = "linear" | "radial" | "conic";
export type RadialGradientShape = "circle" | "ellipse";

export interface LinearGradientOptions {
  angle: number;
  stops: ColorStop[];
}

export interface RadialGradientOptions {
  shape: RadialGradientShape;
  stops: ColorStop[];
}

export interface ConicGradientOptions {
  angle: number;
  stops: ColorStop[];
}

export interface GradientCssOptions {
  type: GradientType;
  angle: number;
  shape: RadialGradientShape;
  stops: ColorStop[];
}

export interface GradientCssResult {
  type: GradientType;
  preview: string;
  css: string;
  stopCount: number;
  privacyNote: string;
}

export const GRADIENT_PRESETS: Record<string, GradientCssOptions> = {
  sunset: {
    type: "linear",
    angle: 135,
    shape: "ellipse",
    stops: [
      { color: "#ff6b35", position: 0 },
      { color: "#f7c948", position: 50 },
      { color: "#ff3860", position: 100 }
    ]
  },
  ocean: {
    type: "linear",
    angle: 180,
    shape: "ellipse",
    stops: [
      { color: "#0077b6", position: 0 },
      { color: "#00b4d8", position: 50 },
      { color: "#90e0ef", position: 100 }
    ]
  },
  lavender: {
    type: "radial",
    angle: 0,
    shape: "circle",
    stops: [
      { color: "#e0aaff", position: 0 },
      { color: "#c77dff", position: 50 },
      { color: "#9d4edd", position: 100 }
    ]
  }
};

export function generateLinearGradient(options: LinearGradientOptions): string {
  return `linear-gradient(${options.angle}deg, ${formatStops(options.stops)})`;
}

export function generateRadialGradient(options: RadialGradientOptions): string {
  return `radial-gradient(${options.shape}, ${formatStops(options.stops)})`;
}

export function generateConicGradient(options: ConicGradientOptions): string {
  return `conic-gradient(from ${options.angle}deg, ${formatStops(options.stops)})`;
}

export function generateGradientCss(options: GradientCssOptions): GradientCssResult {
  const preview =
    options.type === "radial"
      ? generateRadialGradient({ shape: options.shape, stops: options.stops })
      : options.type === "conic"
        ? generateConicGradient({ angle: options.angle, stops: options.stops })
        : generateLinearGradient({ angle: options.angle, stops: options.stops });

  return {
    type: options.type,
    preview,
    css: `background: ${preview};`,
    stopCount: options.stops.length,
    privacyNote: "Local CSS gradient generation only; color values stay in the browser."
  };
}

function formatStops(stops: ColorStop[]): string {
  return stops.map((stop) => `${stop.color} ${stop.position}%`).join(", ");
}
