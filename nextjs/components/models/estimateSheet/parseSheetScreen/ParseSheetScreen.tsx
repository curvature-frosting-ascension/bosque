import React, {useState} from "react"
import {Box, Button, CircularProgress, Typography} from "@mui/material"
import Select from "react-select"
import DoneIcon from '@mui/icons-material/Done'
import ErrorIcon from '@mui/icons-material/Error'
import {ParseResult} from "../../../../types"
import {FileInfo, FileInfoRow} from "./FileInfo"
import {getFileExtension, isParsableFileType} from "../../../../utils/file"



type Props = {
  file: File,
  moveNext: (parseResult: ParseResult) => void,
}

type ParseFormatOption = {
  value: string,
  label: string,
}

const parseFormatOptions = [
  {value: "AbilityRenovation", label: "アビリティリノベーション"},
  {value: "auto", label: "自動"},
]

type ParseStatus = "initial" |"nonParsable" | "parsing" | "failed" | "parsed"

export const ParseSheetScreen = (props: Props) => {
  const [parseFormat, setParseFormat] = useState<ParseFormatOption|null>({
    value: "AbilityRenovation",
    label: "アビリティリノベーション"
  })

  const [parseStatus, setParseStatus] = useState<ParseStatus>("initial")
  const [parseResult, setParseResult] = useState<ParseResult|null>(null)
  const onClickParse = async () => {
    // if no format is set, skip the parsing
    if (!parseFormat) return

    // clear the parseResult
    setParseResult(null)

    setParseStatus("parsing")
    const formData = new FormData()
    formData.set("pdf", props.file)

    // retrieve the text
    const response = await fetch("https://func-h3wybuywzt.azurewebsites.net/api/parse-pdf?code=OLxYoe27n2nHcO-nDcfb1l_oMi6IeHQ9nbDfmBiG6mSDAzFuTifp_g==", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      setParseStatus("failed")
      return
    }

    const text = (await response.json()).text
    // parse the text
    const response2 = await fetch("https://func-h3wybuywzt.azurewebsites.net/api/parse-text-format-ability-renovation?code=QrnoNPOIu5Nl01XmHEx6534DK-HBJN40ODpVr6fdMCRxAzFuyfazLQ==", {
      method: "POST",
      body: text
    })

    if (!response2.ok) {
      setParseStatus("failed")
      return
    }

    setParseResult({
      text,
      estimateSheet: await response2.json(),
      format: parseFormat.value
    })
    setParseStatus("parsed")
  }

  const isParseButtonDisabled = () => {
    if (parseStatus === "parsing") return true
    if (parseStatus === "parsed") return true
    return !isParsableFileType(getFileExtension(props.file.name))
  }
  return <Box>
    <Box>
      <Box sx={{mt: 3, mx: 3}}>
        <Typography variant={"h6"}>{props.file.name}</Typography>
      </Box>
    </Box>
    <Box sx={{border: "1px solid darkgray", borderRadius: 5, m: 1, p: 2, "& .MuiBox-root":{"&:not(:last-child)": {mb: 1}}}}>
      <Box>
        <Typography variant={"body2"}>フォーマットを選択して、PDFファイルから情報を抜き出します。</Typography>
      </Box>
      <FileInfo>
        <FileInfoRow rowName={"ファイル名"}>{props.file.name}</FileInfoRow>
        <FileInfoRow rowName={"ファイル形式"}>
          {getFileExtension(props.file.name)}
          {!isParsableFileType(getFileExtension(props.file.name)) && <Box sx={{display: "inline", verticalAlign: "middle", ml: 1, color: "red"}}>
            <ErrorIcon fontSize={"small"}/>
            <Box sx={{display: "inline", ml: 1, fontSize: "0.8em", verticalAlign: "middle"}}><Box></Box>パースできないファイル形式です</Box>
          </Box>}
        </FileInfoRow>
        <FileInfoRow rowName={"フォーマット"}>
          <Select<ParseFormatOption> options={parseFormatOptions} value={parseFormat} onChange={(newValue) => setParseFormat(newValue)} />
        </FileInfoRow>
      </FileInfo>
      <Box sx={{display: "flex", my: 1, mx: 6, flexDirection: "row-reverse", alignItems: "center", "& .MuiBox-root": {mt: 1, mx: 1}}}>
        <Box>
          <Button variant={"contained"} color={"success"} onClick={onClickParse} disabled={isParseButtonDisabled()}>パースする</Button>
        </Box>
        <Box>
          {parseStatus === "parsing" && <Box sx={{display: "flex"}}>
            <Typography variant={"body2"}>処理中です...</Typography>
            <CircularProgress size={"1rem"} />
          </Box>}
          {parseStatus === "parsed" && <Box sx={{display: "flex"}}>
            <Typography variant={"body2"}>完了しました</Typography>
            <DoneIcon fontSize={"small"} />
          </Box>}
          {parseStatus === "failed" && <Box sx={{display: "flex", color: "red"}}>
            <Typography variant={"body2"}>パースに失敗しました</Typography>
            <ErrorIcon fontSize={"small"} />
          </Box>}
        </Box>
      </Box>
    </Box>
    {parseResult && <Box sx={{mt: 3, display: "flex", justifyContent: "space-between"}}>
      <Box>
        <Typography variant={"body2"}>「次へ」を押してテキストの読み込み結果を必要なら修正します。</Typography>
        <Typography variant={"body2"}>以下に読込結果を表示します。</Typography>
      </Box>
      <Button variant={"contained"} color={"primary"} onClick={() => props.moveNext(parseResult)}>次へ</Button>
    </Box>}
    <Box>
      <pre>
        {parseResult && parseResult.text}
      </pre>
    </Box>
  </Box>
}