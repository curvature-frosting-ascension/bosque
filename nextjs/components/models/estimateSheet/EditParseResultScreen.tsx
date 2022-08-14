import {Box, Typography} from "@mui/material"
import {ParseResult, Table} from "../../../types"
import {useState} from "react"
import {DraggableTable} from "./DraggableTable"
import {buildTableFromEstimateSheet} from "../../../utils/estimateSheet/table"
import {Explanation} from "./Explanation"
import {BottomNavigation} from "./BottomNavigation"

type Props = {
  parseResult: ParseResult,
  file: File,
  moveNext: (table: Table) => void,
  moveBack: () => void,
}

export const EditParseResultScreen = (props: Props) => {
  const [table, setTable] = useState<Table>(buildTableFromEstimateSheet(props.parseResult.estimateSheet))
  const updateTable = (table: Table) => setTable(table)

  return <Box>
    <Box sx={{p: 2}}>
      <Explanation>
        <Typography variant={"body2"}>読み取り結果を修正してください。ドラッグで項目の位置を修正できます。また、[編]をクリックすると項目の内容を修正できます。</Typography>
      </Explanation>
      <Box sx={{my: 1, mx: 3}}>
        <DraggableTable table={table} onUpdateTable={updateTable} />
      </Box>
    </Box>
    <BottomNavigation
      next={{
        onClick: () => props.moveNext(table),
      }}
      back={{
        onClick: props.moveBack,
      }}
    />
  </Box>
}