import {Column, Detail, EstimateSheet, Group, TableByColumns} from "../../types"

export const COLUMN_NAMES = [
  "大項目",
  "小項目",
  "単位",
  "数量",
  "価格",
]

export const retrieveColumn = (table: TableByColumns, columnIndex: number): string[] => {
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

export const reformatTable = (table: TableByColumns): TableByColumns => {
  // remove the unnecessary blank at the end of the columns
  const newColumns: Column[] = table.columns.map(column => {
    let index = column.length-1
    while (index >= 0 && !column.at(index)) {
      index -= 1
    }
    return column.slice(0, index+1)
  })

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

export const updateTableWithNewColumn = (table: TableByColumns, columnIndex: number, column: string[]): TableByColumns => {
  const newColumnsData = [...table.columns]
  newColumnsData[columnIndex] = column

  return reformatTable({
    columnNames: table.columnNames,
    columns: newColumnsData,
  })
}

export const buildTableFromEstimateSheet = (estimateSheet: EstimateSheet): TableByColumns => {
  // remove notes
  const rowNames = estimateSheet.rowNames.filter(name => {
    if (name === "以下余白") return false
    return name !== "【総合計】"
  })

  // remove sum
  const lastPriceReversedIndex = [...estimateSheet.prices].reverse().findIndex(price => price)
  if (lastPriceReversedIndex > 0) {
    const lastPriceIndex = estimateSheet.prices.length - 1 - lastPriceReversedIndex
    const lastPrice = parseInt(estimateSheet.prices[lastPriceIndex], 10)
    const remainingPrices = estimateSheet.prices.slice(0, lastPriceReversedIndex-1).map(price => price ?? "").map(price => parseInt(price, 10))
    const total = remainingPrices.length > 0 ? remainingPrices.reduce((a, b) => a+b): lastPrice
    if (total === lastPrice) {
      estimateSheet.prices.splice(lastPriceIndex, 1, "")
    }
  }

  const columns = [
    rowNames,
    estimateSheet.specifications,
    estimateSheet.units,
    estimateSheet.quantities,
    estimateSheet.prices,
  ]

  return reformatTable({
    columnNames: COLUMN_NAMES,
    columns,
  })
}

const createEmptyGroup = (): Group => {
  return {
    index: 0,
    groupName: "",
    details: []
  }
}

const createDetail = (name: string, quantity: string, unit: string, price: string, priceMultiplier: number) => {
  const parsedPrice = parseInt(price, 10)
  return {
    name: name,
    quantity: `${quantity}${unit}`,
    pricePerUnit: null,
    price: isNaN(parsedPrice) ? 0: parsedPrice * priceMultiplier
  }
}

export const multiplyPrices = (table: TableByColumns, multiplier: number) => {
  const pricePositionInColumns = COLUMN_NAMES.findIndex(name => name === "価格")
  if (pricePositionInColumns < 0) {
    throw new Error("価格 was not found in COLUMN_NAMES")
  }

  const newPrices = table.columns[pricePositionInColumns].map(price => {
    const parsedPrice = parseInt(price, 10)
    if (Number.isFinite(parsedPrice)) {
      return (parsedPrice * multiplier).toString()
    }
    return price
  })

  return {
    ...table,
    columns: [...table.columns].splice(pricePositionInColumns, 1, newPrices)
  }
}

export const convertTableForExport = (table: TableByColumns, priceMultiplier: number) => {
  const groups: Group[] = []
  const maxLength = Math.max(...table.columns.map(column => column.length))
  let currentGroup = createEmptyGroup()
  for (let i=0; i < maxLength; i++) {
    const groupName = table.columns[0].at(i) ?? ""
    const detailName = table.columns[1].at(i) ?? ""
    const quantity = table.columns[2].at(i) ?? ""
    const unit = table.columns[3].at(i) ?? ""
    const price = table.columns[4].at(i) ?? ""
    if (!groupName) {
      currentGroup.details.push(createDetail(detailName, unit, quantity, price, priceMultiplier))
    } else {
      if (i !== 0) groups.push(currentGroup)
      currentGroup = {
        index: 0,
        groupName: groupName.toString(),
        details: [createDetail(detailName, unit, quantity, price, priceMultiplier)]
      }
    }
  }
  groups.push(currentGroup)
  groups.forEach((group, index) => group.index = index+1)
  return groups
}

export const exportDetailToClipboardString = (detail: Detail) => {
  return `\t${detail.name}\t${detail.quantity}\t\t${detail.price}`
}

export const exportGroupToClipboardString = (group: Group) => {
  return `${group.index}\t${group.groupName}
  ${group.details.map(detail=>exportDetailToClipboardString(detail)).join("\n")}`
}

export const exportGroupsToClipboardString = (groups: Group[]) => {
  return groups.map(group => exportGroupToClipboardString(group)).join(`\n\n`)
}