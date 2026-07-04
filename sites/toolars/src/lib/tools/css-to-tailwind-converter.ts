export interface TailwindDeclarationMatch {
  property: string;
  value: string;
  className: string;
}

export interface TailwindConversionResult {
  className: string;
  matchedDeclarations: TailwindDeclarationMatch[];
  unmatchedDeclarations: string[];
}

const directMap: Record<string, Record<string, string>> = {
  display: { flex: "flex", grid: "grid", block: "block", "inline-block": "inline-block", none: "hidden" },
  "flex-direction": { row: "flex-row", column: "flex-col", "row-reverse": "flex-row-reverse", "column-reverse": "flex-col-reverse" },
  "justify-content": {
    center: "justify-center",
    "flex-start": "justify-start",
    "flex-end": "justify-end",
    "space-between": "justify-between",
    "space-around": "justify-around",
    "space-evenly": "justify-evenly"
  },
  "align-items": { center: "items-center", stretch: "items-stretch", "flex-start": "items-start", "flex-end": "items-end", baseline: "items-baseline" },
  "text-align": { left: "text-left", center: "text-center", right: "text-right" },
  position: { relative: "relative", absolute: "absolute", fixed: "fixed", sticky: "sticky" }
};

const spacingProperties: Record<string, string> = {
  gap: "gap",
  padding: "p",
  margin: "m",
  "margin-top": "mt",
  "margin-right": "mr",
  "margin-bottom": "mb",
  "margin-left": "ml",
  "padding-top": "pt",
  "padding-right": "pr",
  "padding-bottom": "pb",
  "padding-left": "pl"
};

export function convertCssToTailwind(css: string): TailwindConversionResult {
  const declarations = parseDeclarations(css);
  const matchedDeclarations: TailwindDeclarationMatch[] = [];
  const unmatchedDeclarations: string[] = [];

  for (const declaration of declarations) {
    const mapped = mapDeclaration(declaration.property, declaration.value);
    if (mapped) {
      matchedDeclarations.push({ ...declaration, className: mapped });
    } else {
      unmatchedDeclarations.push(`${declaration.property}: ${declaration.value};`);
    }
  }

  return {
    className: matchedDeclarations.map((item) => item.className).join(" "),
    matchedDeclarations,
    unmatchedDeclarations
  };
}

function parseDeclarations(css: string): Array<{ property: string; value: string }> {
  return css
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const [property, ...valueParts] = part.split(":");
      return { property: property.trim().toLowerCase(), value: valueParts.join(":").trim().toLowerCase() };
    })
    .filter((item) => item.property && item.value);
}

function mapDeclaration(property: string, value: string): string | null {
  const direct = directMap[property]?.[value];
  if (direct) return direct;

  const spacingPrefix = spacingProperties[property];
  if (spacingPrefix) {
    const scale = spacingToScale(value);
    return scale ? `${spacingPrefix}-${scale}` : null;
  }

  if (property === "border-radius") {
    if (value === "0") return "rounded-none";
    if (value === "9999px" || value === "50%") return "rounded-full";
    const scale = spacingToScale(value);
    return scale ? `rounded-${scale}` : null;
  }

  return null;
}

function spacingToScale(value: string): string | null {
  const rem = value.match(/^([0-9.]+)rem$/);
  if (rem) return formatScale(Number(rem[1]) * 4);

  const px = value.match(/^([0-9.]+)px$/);
  if (px) return formatScale(Number(px[1]) / 4);

  if (value === "0") return "0";
  return null;
}

function formatScale(value: number): string | null {
  if (!Number.isFinite(value) || value < 0) return null;
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2))).replace(".", ".");
}
