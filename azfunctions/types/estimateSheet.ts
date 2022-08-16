export type EstimateSheet = {
  rowNames: string[],
  specifications: string[],
  units: string[],
  quantities: string[],
  pricePerUnits: string[],
  prices: string[],
  notes: string[]
}

export type EstimateSheet2 = {
  columnNames: string[],
  rows: string[][],
}