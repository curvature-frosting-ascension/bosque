import {Column, EstimateSheet, Table} from "../../types"

export const retrieveColumn = (table: Table, columnIndex: number): (number|string)[] => {
  return table.columns[columnIndex]
}

export const reorderColumn = <T>(column: T[], startRowIndex: number, endRowIndex: number): T[] => {
  const newColumn: T[] = [...column]

  // if start === end, skip the rest
  if (startRowIndex === endRowIndex) return column

  // if start < end, check the overwritten rows
  if (startRowIndex > endRowIndex) {
    // if data exists in the overwritten rows, do nothing
    const overwrittenData = column.slice(endRowIndex, startRowIndex)
    for (const datum of overwrittenData) {
      if (datum) return column
    }
    // else overwrite them
    newColumn.splice(endRowIndex, newColumn.length, ...newColumn.slice(startRowIndex))
  } else {
    // fill the blank
    newColumn.splice(startRowIndex, 0, ...(new Array(endRowIndex-startRowIndex).fill("")))
  }

  return newColumn
}

export const reformatTable = (table: Table): Table => {
  // remove the unnecessary blank at the end of the columns
  const newColumns: Column[] = table.columns.map(column => {
    let index = column.length-1
    while (index >= 0 && !column.at(index)) {
      index -= 1
    }
    return column.slice(0, index+1)
  })

  console.log(newColumns)

  // extend columns if it is shorter than the longest
  const lengths = newColumns.map(column => column.length)
  const maxLength = Math.max(...lengths)

  return {
    ...table,
    columns: newColumns.map(column => {
      const length = column.length
      if (length < maxLength) {
        column.splice(length, 0, ...(new Array(maxLength-length).fill("")))
      }
      return column
    })
  }
}

export const updateTableWithNewColumn = (table: Table, columnIndex: number, column: (string|number)[]): Table => {
  const newColumnsData = [...table.columns]
  newColumnsData[columnIndex] = column

  return reformatTable({
    columnNames: table.columnNames,
    columns: newColumnsData,
  })
}

export const buildTableFromEstimateSheet = (estimateSheet: EstimateSheet): Table => {
  // remove notes
  const rowNames = estimateSheet.rowNames.filter(name => {
    if (name === "以下余白") return false
    return name !== "【総合計】"
  })

  // remove sum
  const lastPrice = parseInt(estimateSheet.prices.at(-1) ?? "", 10)
  const remainingPrices = estimateSheet.prices.slice(0, -1).map(price => price ?? "").map(price => parseInt(price, 10))
  const total = remainingPrices.reduce((a, b) => a+b)
  const prices = total === lastPrice ? remainingPrices: estimateSheet.prices

  const columns = [
    rowNames,
    estimateSheet.specifications,
    estimateSheet.units,
    estimateSheet.quantities,
    prices
  ]

  return reformatTable({
    columnNames: [
      "大項目",
      "小項目",
      "単位",
      "数量",
      "価格",
    ],
    columns,
  })
}