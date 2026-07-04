export interface GridOptions {
  columns: number;
  rows: number;
  columnGap: number;
  rowGap: number;
  minColumnWidth: number;
}

export interface GridPreviewCell {
  id: string;
  column: number;
  row: number;
}

export interface GridCssResult {
  css: string;
  previewCells: GridPreviewCell[];
  warningCount: number;
  warnings: string[];
}

export const GRID_PRESETS: Record<string, GridOptions> = {
  cards: { columns: 3, rows: 2, columnGap: 24, rowGap: 16, minColumnWidth: 180 },
  gallery: { columns: 4, rows: 3, columnGap: 12, rowGap: 12, minColumnWidth: 140 },
  sidebar: { columns: 2, rows: 2, columnGap: 24, rowGap: 24, minColumnWidth: 220 }
};

export function generateGridCss(options: GridOptions): GridCssResult {
  const columns = clampInteger(options.columns, 1, 12);
  const rows = clampInteger(options.rows, 1, 12);
  const columnGap = Math.max(0, Math.round(options.columnGap));
  const rowGap = Math.max(0, Math.round(options.rowGap));
  const minColumnWidth = clampInteger(options.minColumnWidth, 80, 480);
  const previewCells = Array.from({ length: columns * rows }, (_, index) => ({
    id: `cell-${index + 1}`,
    column: (index % columns) + 1,
    row: Math.floor(index / columns) + 1
  }));
  const warnings = [
    ...(columns > 6 ? ["High column counts need mobile breakpoints."] : []),
    ...(columnGap > 64 || rowGap > 64 ? ["Large gaps can dominate compact layouts."] : [])
  ];

  return {
    css: [
      "display: grid;",
      `grid-template-columns: repeat(${columns}, minmax(${minColumnWidth}px, 1fr));`,
      `grid-template-rows: repeat(${rows}, minmax(80px, auto));`,
      `column-gap: ${columnGap}px;`,
      `row-gap: ${rowGap}px;`
    ].join("\n"),
    previewCells,
    warningCount: warnings.length,
    warnings
  };
}

function clampInteger(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.round(Number.isFinite(value) ? value : min)));
}
