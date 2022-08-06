export type EstimateSheet = {
  rowNames: string[],
  specifications: string[],
  units: string[],
  quantities: string[],
  prices: string[],
}

export type ParseResult = {
  text: string,
  format: string,
  estimateSheet: EstimateSheet,
}

export type Detail = {
  detail: string,
  quantity: string,
  unit: string,
  price: number,
}

export type Entry = {
  category: string,
  details: Detail[]
}