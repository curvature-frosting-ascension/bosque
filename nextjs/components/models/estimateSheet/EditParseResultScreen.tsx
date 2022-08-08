import {Box, Button, Typography} from "@mui/material"
import {ParseResult, Table} from "../../../types"
import {useState} from "react"
import {DraggableTable} from "./DraggableTable"
import {buildTableFromEstimateSheet} from "../../../utils/estimateSheet/table"

type Props = {
  parseResult: ParseResult,
  file: File,
  moveNext: (table: Table) => void,
}

export const EditParseResultScreen = (props: Props) => {
  const [table, setTable] = useState<Table>(buildTableFromEstimateSheet(props.parseResult.estimateSheet))
  const updateTable = (table: Table) => setTable(table)

  return <Box>
    <Box>
      <Box sx={{mt: 3, mx: 3}}>
        <Typography variant={"h6"}>{props.file.name}</Typography>
      </Box>
    </Box>
    <Box sx={{border: "1px solid darkgray", borderRadius: 5, mt: 3, p: 1}}>
      <Box sx={{my: 1, mx: 3}}>
        <Box sx={{display: "flex", justifyContent: "space-between"}}>
          <Box>
            <Typography variant={"body2"}>読み取り結果を修正します。</Typography>
            <Typography variant={"body2"}>ドラッグで項目の位置を修正できます。</Typography>
          </Box>
          <Box>
            <Button variant={"contained"} onClick={()=>props.moveNext(table)}>次へ</Button>
          </Box>
        </Box>
        </Box>
      <Box sx={{my: 1, mx: 3}}>
        <DraggableTable table={table} onUpdateTable={updateTable} />
      </Box>
    </Box>
  </Box>
}