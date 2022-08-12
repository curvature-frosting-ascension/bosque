import { AzureFunction, Context, HttpRequest } from "@azure/functions"

export type EstimateSheet = {
  rowNames: string[],
  specifications: string[],
  units: string[],
  quantities: string[],
  pricePerUnits: string[],
  prices: string[],
  notes: string[]
}

export const combine = (names: string[]): {combined: string, split: string[]}[] => {
  let possibleCombinations: {combined: string, split: string[]}[] = []
  for (let i=1; i < names.length; i++) {
    possibleCombinations.splice(possibleCombinations.length, 0,
      ...names.slice(0, names.length-i).map((name, index) => {
        return {
          combined: names.slice(index, index + 1 + i).reduce((a, b) => a + b),
          split: names.slice(index, index + 1 + i)
        }
      })
    )
  }

  return possibleCombinations
}

export type ParseResult = {
  status: "success",
  estimateSheet: EstimateSheet,
} | {
  status: "failed",
  error: string,
}

export const parse = (text: string): ParseResult => {
  const columnNames = [
    "名    称",
    "仕様・規格",
    "単 位",
    "数 量",
    "単価",
    "金 額",
    "備考"
  ]
  let possibleCombinations = combine(columnNames)

  const lines = text
    .split("\n")
    .map(line => line.trim())
    // remove irrelevant lines
    .filter(line => {
      // remove the title
      if (line === "明細書" || line === "明  細  書") return false
      // remove the page number
      if (line.match(/Page\.\s?[0-9]+/)) return false
      // 
      return true
    })
    // split the column names
    .map(line => {
      const found = possibleCombinations.find(combination => combination.combined === line)
      if (found) return found.split
      return line
    })
    // flatten the array
    .flat()

  const rowNameLineIndex = lines.findIndex(line => line === "名    称")
  const specificationLineIndex = lines.findIndex(line => line === "仕様・規格")
  const unitIndex = lines.findIndex(line => line === "単 位")
  const quantityIndex = lines.findIndex(line => line === "数 量")
  const pricePerUnitIndex = lines.findIndex(line => line === "単価")
  const priceIndex = lines.findIndex(line => line === "金 額")
  const noteIndex = lines.findIndex(line => line === "備考")

  const rowNames = lines.slice(rowNameLineIndex+1, specificationLineIndex)
  const specifications = lines.slice(specificationLineIndex+1, unitIndex)
  const units = lines.slice(unitIndex+1, quantityIndex)
  const quantities = lines.slice(quantityIndex+1, pricePerUnitIndex)
  const pricePerUnits = lines.slice(pricePerUnitIndex+1, priceIndex)
  const prices = lines.slice(priceIndex+1, noteIndex)
  const notes = lines.slice(noteIndex+1)

  return {
    status: "success",
    estimateSheet: {
      rowNames,
      specifications,
      units,
      quantities,
      pricePerUnits,
      prices,
      notes
    }
  }
}

export const index: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const text: string = req.body || ""
  if (!text) {
    context.res = {
      status: 400,
      body: JSON.stringify({
          error: "the text to be parsed was not provided in the request body/"
      })
    }
    return
  }

  const result = parse(text)

  if (result.status === "failed") {
    context.res = {
      status: 400,
      body: JSON.stringify(result),
      headers: {
        "Content-Type": "application/json"
      }
    }
  } else {
    context.res = {
      status: 200,
      body: JSON.stringify(result),
      headers: {
        "Content-Type": "application/json"
      }
    }
  }
}