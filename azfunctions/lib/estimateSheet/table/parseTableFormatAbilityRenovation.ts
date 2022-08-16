import {parse} from "csv-parse/sync"
import {EstimateSheet} from "../../../types/estimateSheet"

export const parseTableFormatAbilityRenovation = (text: string): EstimateSheet => {
  const parsed: string[][] = parse(text)

  const estimateSheet: EstimateSheet = {
    rowNames: [],
    specifications: [],
    units: [],
    quantities: [],
    pricePerUnits: [],
    prices: [],
    notes: []
  }

  parsed.slice(1).map((row, i) => {
    ["rowNames", "specifications", "units", "quantities", "pricePerUnits", "prices", "notes"].map((name, index) => {
      const value = parsed[i+1][index]
      estimateSheet[name].push(value? value.trim(): "")
    })
  })

  return estimateSheet
}
