import {Box, Button, InputAdornment, OutlinedInput, Typography} from "@mui/material"
import {Table} from "../../../types"
import {useState} from "react"
import {useForm} from "react-hook-form"
import {yupResolver} from "@hookform/resolvers/yup"
import * as yup from "yup"
import {
  convertTableForExport,
  exportGroupsToClipboardString,
} from "../../../utils/estimateSheet/table"

type Props = {
  table: Table,
  file: File,
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

  const onClickCopy = async () => {
    if (!multiplier) return
    const groups = convertTableForExport(props.table, multiplier)
    await navigator.clipboard.writeText(exportGroupsToClipboardString(groups))
  }

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
            <Typography variant={"body2"}>読み取り結果を出力します。価格の倍率を下のボックスで設定します。</Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={{my: 1, mx: 3, display: "flex", justifyContent: "end", alignItems: "center", verticalAlign: "center"}}>
        <form onSubmit={handleSubmit(data => setMultiplier(data.multiplier))}>
          <OutlinedInput
            {...register("multiplier")}
            error={!!errors.multiplier}
            size={"small"}
            endAdornment={<InputAdornment position={"end"}>倍</InputAdornment>}
          />
          <Button variant={"contained"} size={"small"} type={"submit"}>決定</Button>
        </form>
      </Box>
    </Box>
    <Box sx={{border: "1px solid darkgray", borderRadius: 5, mt: 3, p: 1}}>
      <Box sx={{my: 1, mx: 3, display: "flex", justifyContent: "space-between"}}>
        <Box>
          <Typography variant={"body2"}>クリップボードにコピーします</Typography>
        </Box>
        <Box>
          <Button onClick={onClickCopy} variant={"contained"} disabled={!multiplier}>コピー</Button>
        </Box>
      </Box>
    </Box>
  </Box>
}