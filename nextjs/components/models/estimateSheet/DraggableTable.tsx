import {Table} from "../../../types"
import {useState} from "react"
import {Box} from "@mui/material"
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  Droppable,
  DroppableProvided,
  DropResult
} from "react-beautiful-dnd"
import {reorderColumn, retrieveColumn, updateTableWithNewColumn} from "../../../utils/estimateSheet/table"

type Props = {
  initial: {
    table: Table
  },
  onSave: () => void
}



export const DraggableTable = (props: Props) => {
  const [table, setTable] = useState<Table>(props.initial.table)

  const onDragEnd = (result: DropResult) => {
    // if no destination is set
    if (!result.destination) {
      return
    }

    // retrieve the columnIndex of the draggable
    // draggableId must be {columnIndex}-{name}-{initialRowIndex}
    const draggableId = result.draggableId
    const columnNameDraggable = draggableId.split("-+-")[0]
    const startRowIndex = result.source.index

    // retrieve the columnIndex of the destination
    // droppableId must be {columnIndex}-{rowIndex}
    const columnNameDestination = result.destination.droppableId
    const endRowIndex = result.destination.index

    // if both the column indexes don't match, nothing will be done (cross column moves are prohibited).
    if (columnNameDraggable !== columnNameDestination) return

    const columnIndex = table.columnNames.findIndex(name => name === columnNameDraggable)
    if (columnIndex === -1) return

    console.log(startRowIndex, endRowIndex)

    const newColumn = reorderColumn(
      retrieveColumn(table, columnIndex),
      startRowIndex,
      endRowIndex
    )

    console.log(newColumn)
    const newTable = updateTableWithNewColumn(
      table,
      columnIndex,
      newColumn
    )

    console.log(newTable)
    setTable(newTable)
  }

  return <Box>
    <DragDropContext onDragEnd={onDragEnd}>
      <Box sx={{display: "flex", "& .MuiBox-root": {m: 1, minWidth: 50, minHeight: 50}}}>
        {table.columnNames.map((columnName, index) => (
          <Droppable droppableId={columnName} key={columnName}>
            {(provided: DroppableProvided) => (
              <Box {...provided.droppableProps} ref={provided.innerRef}>
                {/** header **/}
                <Box>
                  {table.columnNames[index]}
                </Box>
                {/** body **/}
                {table.columns[index].map((entry, rowIndex) => (
                  <Draggable draggableId={`${columnName}-+-${entry}-+-${rowIndex}`} index={rowIndex} key={`${columnName}-+-${entry}-+-${rowIndex}`}>
                    {(provided: DraggableProvided) => <Box ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>{entry}</Box>}
                  </Draggable>))}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        ))}
      </Box>
    </DragDropContext>
  </Box>
}