import {Box, Button, InputAdornment, OutlinedInput, Typography} from "@mui/material"
import {TableByColumns} from "../../../types"
import {useState} from "react"
import {useForm} from "react-hook-form"
import {yupResolver} from "@hookform/resolvers/yup"
import * as yup from "yup"
import {
  convertTableForExport,
  exportGroupsToClipboardString, multiplyPrices,
} from "../../../utils/estimateSheet/table"
import {Explanation} from "./Explanation"
import {BottomNavigation} from "./BottomNavigation"

type Props = {
  table: TableByColumns,
  file: File,
  moveBack: () => void,
}

const schema = yup.object({
  multiplier: yup.number().required(),
})

export const ExportTableScreen = (props: Props) => {
  const {register, handleSubmit, formState: {errors}} = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      multiplier: 1.3
    }
  })

  const [multiplier, setMultiplier] = useState<number|null>(null)

  const onClickCopyToClipboard = async () => {
    if (!multiplier) return
    const groups = convertTableForExport(multiplyPrices(props.table, multiplier), multiplier)
    await navigator.clipboard.writeText(exportGroupsToClipboardString(groups))
  }

  const onClickDownloadCSV = async () => {
    if (!multiplier) return
    const exportedTable = multiplyPrices(props.table, multiplier)

  }

  return <Box>
    <Box p={2}>
      <Explanation>
        <Typography variant={"body2"}>
          読み取り結果を出力します。価格の倍率を下のボックスで設定します。<br />
          倍率を設定した後、出力方法を設定してください。<br />
        </Typography>
      </Explanation>
      <Box p={1}>
        <form onSubmit={handleSubmit(data => setMultiplier(data.multiplier))}>
          <Box sx={{display: "flex"}}>
            <OutlinedInput
              {...register("multiplier")}
              error={!!errors.multiplier}
              size={"small"}
              endAdornment={<InputAdornment position={"end"}>倍</InputAdornment>}
            />
            <Box mx={1}>
              <Button variant={"contained"} color={"success"} type={"submit"}>決定</Button>
            </Box>
          </Box>
        </form>
      </Box>
      <Box mt={2}>
        <Typography variant={"h6"}>出力：クリップボードにコピー</Typography>
        <Box sx={{p: 1, display: "flex", justifyContent: "space-between"}}>
          <Explanation>
            <Typography variant={"body2"}>表をクリップボードにコピーします。コピーしたデータは「貼り付け用」シートに直接貼り付けられます。</Typography>
          </Explanation>
          <Box>
            <Button variant={"contained"} color={"success"} onClick={onClickCopyToClipboard} disabled={!multiplier}>コピー</Button>
          </Box>
        </Box>
      </Box>
    </Box>
    <BottomNavigation
      back={{
        onClick: props.moveBack
      }}
    />
  </Box>
}