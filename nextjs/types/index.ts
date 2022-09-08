export type EstimateSheet = {
  rowNames: string[],
  specifications: string[],
  units: string[],
  quantities: string[],
  pricePerUnits: string[],
  prices: string[],
  notes: string[],
}

export type ParseResult = {
  format: string,
  estimateSheet: EstimateSheet,
}

export type Column = string[]

export type TableByColumns = {
  columnNames: string[],
  columns: Column[],
}

export type Row = string[]

export type TableByRows = {
  rows: Row[]
}

export type Detail = {
  name: string,
  quantity: string,
  pricePerUnit: number|null,
  price: number,
}

export type Group = {
  index: number,
  groupName: string,
  details: Detail[]
}