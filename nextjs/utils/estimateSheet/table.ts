import {EstimateSheet, Row, Table} from "../../types"

export const retrieveColumn = (table: Table, columnIndex: number): (number|string)[] => {
  return table.rows.map(row => row.entries.at(columnIndex) ?? "")
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

export const updateTableWithNewColumn = (table: Table, columnIndex: number, column: (string|number)[]): Table => {
  const totalColumns = table.columnNames.length
  const newColumnsData = Array.from({length: totalColumns}, () => [] as (string|number)[])

  for (let i=0; i<table.rows.length; i++) {
    for (let k=0; k<totalColumns; k++) {
      newColumnsData[k].push(table.rows[i].entries.at(k) ?? "")
    }
  }
  newColumnsData[columnIndex] = column
  return {
    columnNames: table.columnNames,
    columns: newColumnsData,
    rows: buildTableRowsFromColumns(newColumnsData)
  }
}

export const buildTableRowsFromColumns = (columnsData: (string|number)[][]): Row[] => {
  const lengths = columnsData.map(columnData => columnData.length)
  const maxLength = Math.max(...lengths)

  const rows: Row[] = []
  for (let i=0; i<maxLength; i++) {
    const entries = columnsData.map(columnData => columnData.at(i) ?? "")
    rows.push({entries})
  }
  return rows
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
  const rows = buildTableRowsFromColumns(columns)

  return {
    columnNames: [
      "大項目",
      "小項目",
      "単位",
      "数量",
      "価格",
    ],
    columns,
    rows
  }
}