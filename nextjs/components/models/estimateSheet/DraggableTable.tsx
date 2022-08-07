import {Table} from "../../../types"
import {useState} from "react"
import {Box} from "@mui/material"
import {reorderColumn, retrieveColumn, updateTableWithNewColumn} from "../../../utils/estimateSheet/table"
import {DraggableTableItem} from "./DraggableTableItem"
import {DndProvider} from "react-dnd"
import { HTML5Backend } from 'react-dnd-html5-backend'

type Props = {
  initial: {
    table: Table
  },
  onSave: () => void
}



export const DraggableTable = (props: Props) => {
  const [table, setTable] = useState<Table>(props.initial.table)

  const moveItem = (dragIndex: number, hoverIndex: number, columnName: string) => {
    const startRowIndex = dragIndex
    const endRowIndex = hoverIndex
    const columnIndex = table.columnNames.findIndex(name => name === columnName)
    if (columnIndex === -1) return

    const newColumn = reorderColumn(
      retrieveColumn(table, columnIndex),
      startRowIndex,
      endRowIndex
    )

    const newTable = updateTableWithNewColumn(
      table,
      columnIndex,
      newColumn
    )

    setTable(newTable)
    console.log(newTable)
  }

  return <Box>
    <DndProvider backend={HTML5Backend}>
      <Box sx={{display: "flex", "& .MuiBox-root": {m: 1, minWidth: 50,}}}>
        {table.columnNames.map((columnName, index) => (
          <Box key={columnName}>
            <Box sx={{borderBottom: "1px solid darkgray", fontWeight: "bold", textAlign: "center"}}>{columnName}</Box>
            {table.columns[index].map((item, itemIndex) => <DraggableTableItem key={`${item}-${itemIndex}`} id={`${item}-${itemIndex}`} index={itemIndex} text={item} type={columnName} moveItem={moveItem} />)}
          </Box>
        ))}
      </Box>
    </DndProvider>
  </Box>
}