export type FlexDirection = "row" | "row-reverse" | "column" | "column-reverse";
export type FlexWrap = "nowrap" | "wrap" | "wrap-reverse";
export type FlexJustify = "flex-start" | "center" | "flex-end" | "space-between" | "space-around" | "space-evenly";
export type FlexAlign = "stretch" | "flex-start" | "center" | "flex-end" | "baseline";

export interface FlexboxOptions {
  direction: FlexDirection;
  wrap: FlexWrap;
  justify: FlexJustify;
  align: FlexAlign;
  gap: number;
  itemGrow: number;
  itemBasis: string;
}

export interface FlexboxCssResult {
  containerCss: string;
  itemCss: string;
  previewStyle: {
    flexDirection: FlexDirection;
    flexWrap: FlexWrap;
    justifyContent: FlexJustify;
    alignItems: FlexAlign;
    gap: string;
  };
  warningCount: number;
  warnings: string[];
}

export const FLEXBOX_PRESETS: Record<string, FlexboxOptions> = {
  centered: { direction: "row", wrap: "wrap", justify: "center", align: "center", gap: 16, itemGrow: 0, itemBasis: "160px" },
  dashboard: { direction: "row", wrap: "wrap", justify: "space-between", align: "stretch", gap: 24, itemGrow: 1, itemBasis: "220px" },
  stack: { direction: "column", wrap: "nowrap", justify: "flex-start", align: "stretch", gap: 12, itemGrow: 0, itemBasis: "auto" }
};

export function generateFlexboxCss(options: FlexboxOptions): FlexboxCssResult {
  const gap = Math.max(0, Math.round(options.gap));
  const itemGrow = Math.max(0, Math.round(options.itemGrow));
  const itemBasis = options.itemBasis.trim() || "auto";
  const warnings = [
    ...(gap > 64 ? ["Large gaps can overflow narrow containers."] : []),
    ...(options.wrap === "nowrap" && itemBasis !== "auto" ? ["No-wrap layouts need responsive overflow checks."] : [])
  ];

  return {
    containerCss: [
      "display: flex;",
      `flex-direction: ${options.direction};`,
      `flex-wrap: ${options.wrap};`,
      `justify-content: ${options.justify};`,
      `align-items: ${options.align};`,
      `gap: ${gap}px;`
    ].join("\n"),
    itemCss: `flex: ${itemGrow} 1 ${itemBasis};`,
    previewStyle: {
      flexDirection: options.direction,
      flexWrap: options.wrap,
      justifyContent: options.justify,
      alignItems: options.align,
      gap: `${gap}px`
    },
    warningCount: warnings.length,
    warnings
  };
}
