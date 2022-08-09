import {Table} from "../../../types"
import {Box} from "@mui/material"
import {reorderColumn, retrieveColumn, updateTableWithNewColumn} from "../../../utils/estimateSheet/table"
import {DraggableTableItem} from "./DraggableTableItem"
import {DndProvider} from "react-dnd"
import { HTML5Backend } from 'react-dnd-html5-backend'

type Props = {
  table: Table,
  onUpdateTable: (table: Table) => void,
}



export const DraggableTable = (props: Props) => {
  const moveItem = (dragIndex: number, hoverIndex: number, columnName: string) => {
    const startRowIndex = dragIndex
    const endRowIndex = hoverIndex
    const columnIndex = props.table.columnNames.findIndex(name => name === columnName)
    if (columnIndex === -1) return

    const newColumn = reorderColumn(
      retrieveColumn(props.table, columnIndex),
      startRowIndex,
      endRowIndex
    )

    const newTable = updateTableWithNewColumn(
      props.table,
      columnIndex,
      newColumn
    )
    props.onUpdateTable(newTable)
  }

  const updateItem = (columnIndex: number, itemIndex: number, newValue: string) => {
    const newColumn = [...props.table.columns[columnIndex]]
    newColumn[itemIndex] = newValue
    const newTable = updateTableWithNewColumn(
      props.table,
      columnIndex,
      newColumn
    )
    props.onUpdateTable(newTable)
  }

  return <Box>
    <DndProvider backend={HTML5Backend}>
      <Box sx={{display: "flex", "& .MuiBox-root": {m: 1, minWidth: 80,}}}>
        {props.table.columnNames.map((columnName, columnIndex) => (
          <Box key={columnName}>
            <Box sx={{borderBottom: "1px solid darkgray", fontWeight: "bold", textAlign: "center"}}>{columnName}</Box>
            {props.table.columns[columnIndex].map((item, itemIndex) => <DraggableTableItem key={`${item}-${itemIndex}`} id={`${item}-${itemIndex}`} index={itemIndex} text={item} type={columnName} moveItem={moveItem} updateItem={newValue => updateItem(columnIndex, itemIndex, newValue)} />)}
          </Box>
        ))}
      </Box>
    </DndProvider>
  </Box>
}