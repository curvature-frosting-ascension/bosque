import {Box, Typography} from "@mui/material"
import {ParseResult, Table} from "../../../types"
import {useState} from "react"
import {DraggableTable} from "./DraggableTable"
import {buildTableFromEstimateSheet} from "../../../utils/estimateSheet/table"

type Props = {
  parseResult: ParseResult,
  file: File | null,
}



export const EditParseResultScreen = (props: Props) => {
  const [table] = useState<Table>(buildTableFromEstimateSheet(props.parseResult.estimateSheet))

  if (!props.file) return <Box sx={{mt: 3, mx: 3}}>ファイルの読み込みに失敗しました。ファイルが選択されていない可能性があります。</Box>

  return <Box>
    <Box>
      <Box sx={{mt: 3, mx: 3}}>
        <Typography variant={"h6"}>{props.file.name}</Typography>
      </Box>
    </Box>
    <Box sx={{border: "1px solid darkgray", borderRadius: 5, mt: 3}}>
      <Box sx={{my: 1, mx: 3}}>
        <Typography variant={"body2"}>読み取り結果を修正します。</Typography>
        <Typography variant={"body2"}>ドラッグで項目の位置を修正できます。</Typography>
      </Box>
      <Box sx={{my: 1, mx: 3}}>
        <DraggableTable initial={{table}} onSave={()=>{}} />
      </Box>
    </Box>
  </Box>
}