export type UnitCategory = "length" | "weight" | "temperature" | "area" | "volume" | "speed" | "data";

export interface UnitConversionInput {
  category: UnitCategory;
  value: number;
  fromUnit: string;
  toUnit: string;
}

export interface UnitConversionResult {
  category: UnitCategory;
  value: number;
  fromUnit: string;
  toUnit: string;
  fromUnitLabel: string;
  targetUnitLabel: string;
  convertedValue: number;
  formattedResult: string;
  formulaNote: string;
  quickReferences: Array<{ unit: string; value: string }>;
  summary: string;
}

interface FactorUnit {
  label: string;
  factor: number;
}

interface TemperatureUnit {
  label: string;
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
}

type UnitDefinition = FactorUnit | TemperatureUnit;

const unitCatalog: Record<UnitCategory, Record<string, UnitDefinition>> = {
  length: {
    m: { label: "m", factor: 1 },
    km: { label: "km", factor: 1000 },
    cm: { label: "cm", factor: 0.01 },
    mm: { label: "mm", factor: 0.001 },
    in: { label: "in", factor: 0.0254 },
    ft: { label: "ft", factor: 0.3048 },
    yd: { label: "yd", factor: 0.9144 },
    mi: { label: "mi", factor: 1609.344 }
  },
  weight: {
    kg: { label: "kg", factor: 1 },
    g: { label: "g", factor: 0.001 },
    mg: { label: "mg", factor: 0.000001 },
    lb: { label: "lb", factor: 0.45359237 },
    oz: { label: "oz", factor: 0.0283495 }
  },
  temperature: {
    c: { label: "deg C", toBase: (value) => value, fromBase: (value) => value },
    f: { label: "deg F", toBase: (value) => (value - 32) * (5 / 9), fromBase: (value) => value * (9 / 5) + 32 },
    k: { label: "K", toBase: (value) => value - 273.15, fromBase: (value) => value + 273.15 }
  },
  area: {
    m2: { label: "m2", factor: 1 },
    km2: { label: "km2", factor: 1000000 },
    ha: { label: "ha", factor: 10000 },
    ft2: { label: "ft2", factor: 0.092903 },
    ac: { label: "ac", factor: 4046.86 }
  },
  volume: {
    l: { label: "L", factor: 1 },
    ml: { label: "mL", factor: 0.001 },
    m3: { label: "m3", factor: 1000 },
    gal_us: { label: "gal (US)", factor: 3.78541 },
    cup: { label: "cup", factor: 0.24 }
  },
  speed: {
    mps: { label: "m/s", factor: 1 },
    kph: { label: "km/h", factor: 1 / 3.6 },
    mph: { label: "mph", factor: 0.44704 },
    knot: { label: "knot", factor: 0.514444 }
  },
  data: {
    b: { label: "B", factor: 1 },
    kb: { label: "KB", factor: 1024 },
    mb: { label: "MB", factor: 1048576 },
    gb: { label: "GB", factor: 1073741824 },
    tb: { label: "TB", factor: 1099511627776 }
  }
};

export const unitCategoryOptions = Object.keys(unitCatalog) as UnitCategory[];

export const defaultUnitConversionScenario: UnitConversionInput = {
  category: "length",
  value: 5,
  fromUnit: "km",
  toUnit: "mi"
};

export function calculateUnitConversion(input: UnitConversionInput): UnitConversionResult {
  const category = unitCatalog[input.category] ? input.category : "length";
  const units = unitCatalog[category];
  const fromUnit = units[input.fromUnit] ? input.fromUnit : Object.keys(units)[0];
  const toUnit = units[input.toUnit] ? input.toUnit : Object.keys(units)[1] ?? fromUnit;
  const value = Number.isFinite(input.value) ? input.value : 0;
  const baseValue = toBaseValue(category, value, fromUnit);
  const convertedValue = fromBaseValue(category, baseValue, toUnit);
  const fromUnitLabel = units[fromUnit].label;
  const targetUnitLabel = units[toUnit].label;

  return {
    category,
    value,
    fromUnit,
    toUnit,
    fromUnitLabel,
    targetUnitLabel,
    convertedValue,
    formattedResult: formatNumber(convertedValue),
    formulaNote: getFormulaNote(category, fromUnit, toUnit),
    quickReferences: Object.entries(units)
      .filter(([unit]) => unit !== toUnit)
      .slice(0, 4)
      .map(([unit, definition]) => ({ unit: definition.label, value: formatNumber(fromBaseValue(category, baseValue, unit)) })),
    summary: `${formatNumber(value)} ${fromUnitLabel} to ${targetUnitLabel}`
  };
}

export function getUnitOptions(category: UnitCategory): Array<{ value: string; label: string }> {
  return Object.entries(unitCatalog[category]).map(([value, definition]) => ({ value, label: definition.label }));
}

function toBaseValue(category: UnitCategory, value: number, unit: string): number {
  const definition = unitCatalog[category][unit];
  if (isTemperatureUnit(definition)) return definition.toBase(value);
  return value * definition.factor;
}

function fromBaseValue(category: UnitCategory, baseValue: number, unit: string): number {
  const definition = unitCatalog[category][unit];
  if (isTemperatureUnit(definition)) return definition.fromBase(baseValue);
  return baseValue / definition.factor;
}

function getFormulaNote(category: UnitCategory, fromUnit: string, toUnit: string): string {
  const units = unitCatalog[category];
  const fromDefinition = units[fromUnit];
  const toDefinition = units[toUnit];

  if (category === "temperature") {
    if (fromUnit === "c" && toUnit === "f") return "Formula: deg F = deg C x 9/5 + 32";
    if (fromUnit === "f" && toUnit === "c") return "Formula: deg C = (deg F - 32) x 5/9";
    if (fromUnit === "c" && toUnit === "k") return "Formula: K = deg C + 273.15";
    if (fromUnit === "k" && toUnit === "c") return "Formula: deg C = K - 273.15";
    return "Temperature conversion uses deg C as the base value.";
  }

  if (isTemperatureUnit(fromDefinition) || isTemperatureUnit(toDefinition)) return "";
  const ratio = fromDefinition.factor / toDefinition.factor;
  if (ratio >= 1) return `1 ${fromDefinition.label} = ${formatPrecision(ratio)} ${toDefinition.label}`;
  return `1 ${toDefinition.label} = ${formatPrecision(1 / ratio)} ${fromDefinition.label}`;
}

function isTemperatureUnit(definition: UnitDefinition): definition is TemperatureUnit {
  return "toBase" in definition;
}

function formatNumber(value: number): string {
  if (value === 0) return "0";
  if (Math.abs(value) < 0.000001 || Math.abs(value) > 1000000000) return value.toExponential(4);
  return Number(value.toFixed(6)).toString();
}

function formatPrecision(value: number): string {
  return Number(value.toPrecision(6)).toString();
}
