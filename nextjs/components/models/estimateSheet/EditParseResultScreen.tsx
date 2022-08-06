import {Box, Typography} from "@mui/material"
import {Entry, EstimateSheet, ParseResult} from "../../../types"
import {useState} from "react"

type Props = {
  parseResult: ParseResult,
  file: File | null,
}

const buildEntries = (estimateSheet: EstimateSheet) => {
  const lengths = [
    estimateSheet.rowNames.filter(name => {
        if (name === "以下余白") return false
        return name !== "【総合計】"
    }),
    estimateSheet.specifications,
    estimateSheet.units,
    estimateSheet.quantities,
    estimateSheet.prices
  ].map(arr => arr.length)
  const maxLength = Math.max(...lengths)

  const entries: Entry[] = []
  for (let i=0; i < maxLength; i++) {
    const rowName = estimateSheet.rowNames.at(i) ?? ""
    const specification = estimateSheet.specifications.at(i) ?? ""
    const unit = estimateSheet.units.at(i) ?? ""
    const quantity = estimateSheet.quantities.at(i) ?? ""
    const price = estimateSheet.prices.at(i) ?? ""

    entries.push({
      category: rowName,
      details: [{
        detail: specification,
        quantity,
        unit,
        price: parseInt(price, 10),
      }],
    })
  }
  return entries
}

export const EditParseResultScreen = (props: Props) => {
  const [entries, setEntries] = useState<Entry[]>(buildEntries(props.parseResult.estimateSheet))

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
        <pre>
          {JSON.stringify(entries, null, "\t")}
        </pre>
      </Box>
    </Box>
  </Box>
}