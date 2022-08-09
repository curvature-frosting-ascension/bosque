import {useRef, useState} from "react"
import {useDrop, useDrag} from "react-dnd"
import {Identifier, XYCoord} from "dnd-core"
import {Box, Button, Modal, TextField, Typography} from "@mui/material"
import {useForm} from "react-hook-form"

type Props = {
  id: any,
  index: number,
  text: string|number,
  type: string,
  moveItem: (dragIndex: number, hoverIndex: number, columnName: string,) => void,
  updateItem: (newValue: string) => void,
}

type DragItem = {
  index: number,
  id: string,
  type: string,
}

const style = {
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move',
  height: 80,
}

export const DraggableTableItem = (props: Props) => {
  const [isEditing, setIsEditing] = useState(false)
  const {register, handleSubmit} = useForm({
    defaultValues: {
      newValue: props.text
    }
  })


  const ref = useRef<HTMLDivElement>(null)
  const [{handlerId}, drop] = useDrop<DragItem, void, {handlerId: Identifier | null}>({
    accept: props.type,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId()
      }
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) return
      const dragIndex = item.index
      const hoverIndex = props.index

      // don't replace items with themselves
      if (dragIndex === hoverIndex) return

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect()

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      // Determine mouse position
      const clientOffset = monitor.getClientOffset()

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      // Time to actually perform the action
      props.moveItem(dragIndex, hoverIndex, props.type)

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    }
  })

  const [{ isDragging }, drag] = useDrag({
    type: props.type,
    item: () => {
      return { id: props.id, index: props.index }
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const onSubmit = (data: {newValue: string | number}) => {
    setIsEditing(false)
    props.updateItem(data.newValue.toString())
  }

  const opacity = isDragging ? 0 : 1
  drag(drop(ref))
  return (
    <div ref={ref} style={{ ...style, opacity, display: "flex", justifyContent: "space-between"}} data-handler-id={handlerId}>
      <Box>
        {props.text}
      </Box>
      <Box sx={{fontSize: "0.5em"}} onClick={()=>setIsEditing(true)}>
        [編]
      </Box>
      <Modal open={isEditing} onClose={()=>setIsEditing(false)}>
        <Box>
          <Typography variant={"h6"}>項目を編集する</Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{
              backgroundColor: "white",
              display: "flex",
              alignItems: "center",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              p: 1
            }}>
              <Box sx={{flexGrow: 1}}>
                <TextField {...register("newValue")} fullWidth={true}/>
              </Box>
              <Box ml={1}>
                <Button size={"small"} type="submit" variant={"contained"}>保存</Button>
              </Box>
            </Box>
          </form>
        </Box>
      </Modal>
    </div>
  )
}