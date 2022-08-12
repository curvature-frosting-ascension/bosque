import React, {ChangeEvent, useState} from "react"
import {Box, Button, CircularProgress, TextField, Typography} from "@mui/material"
import Select from "react-select"
import DoneIcon from '@mui/icons-material/Done'
import ErrorIcon from '@mui/icons-material/Error'
import {ParseResult} from "../../../../types"
import {FileInfo, FileInfoRow} from "./FileInfo"
import {getFileExtension, isParsableFileType} from "../../../../utils/file"
import {parsePdf, parseTextFormatAbilityRenovation} from "../../../../utils/estimateSheet/pdf"

type Props = {
  file: File,
  moveNext: (parseResult: ParseResult) => void,
}

type ParseFormatOption = {
  formatName: string,
  label: string,
  page: string,
}

const parseFormatOptions: ParseFormatOption[] = [
  {formatName: "AbilityRenovation", label: "アビリティリノベーション", page: "3"},
]

type ParseStatus = "initial" |"nonParsable" | "parsing" | "failed" | "parsed"
type Errors = {
  page?: string
}

export const ParseSheetScreen = (props: Props) => {
  const [parseFormat, setParseFormat] = useState<ParseFormatOption|null>({
    formatName: "AbilityRenovation",
    label: "アビリティリノベーション",
    page: "3"
  })
  const [errors, setErrors] = useState<{page?: string}>({})

  const checkErrors = (): Errors => {
    if (!parseFormat) return {}

    const newErrors: Errors = {}
    // check page
    const parsedPage = parseInt(parseFormat.page, 10)
    if (isNaN(parsedPage) || parsedPage < 1) {
      newErrors.page = "有効なページ番号ではありません"
    }

    return newErrors
  }

  const resetErrors = () => {
    setErrors({})
  }

  const onChangePage = (event: ChangeEvent<HTMLInputElement>) => {
    resetErrors()
    setParseFormat(parseFormat => {
      if (!parseFormat) return parseFormat
      return {
        ...parseFormat,
        page: event.target.value
      }
    })
  }

  const [parseStatus, setParseStatus] = useState<ParseStatus>("initial")
  const [parseResult, setParseResult] = useState<ParseResult|null>(null)
  const onClickParse = async () => {
    // if no format is set, skip the parsing
    if (!parseFormat) return

    // check the errors
    // if error is found, skip the parsing
    const errors = checkErrors()
    setErrors(errors)
    if (Object.keys(errors).length > 0) return

    // clear the parseResult
    setParseResult(null)

    setParseStatus("parsing")

    const parsePdfResult = await parsePdf(props.file, parseInt(parseFormat.page, 10))

    if (parsePdfResult.status === "failed") {
      setParseStatus("failed")
      return
    }

    const text = parsePdfResult.text

    // parse the text
    const parseTextResult = await parseTextFormatAbilityRenovation(text)

    if (parseTextResult.status === "failed") {
      setParseStatus("failed")
      return
    }

    setParseResult({
      text,
      estimateSheet: parseTextResult.estimateSheet,
      format: parseFormat.formatName
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
          <Select<ParseFormatOption> getOptionValue={option => option.formatName} options={parseFormatOptions} value={parseFormat} onChange={(newValue) => setParseFormat(newValue)} />
        </FileInfoRow>
        <FileInfoRow rowName={"ページ"}>
          <TextField size={"small"} value={parseFormat? parseFormat.page: ""} variant={"outlined"} onChange={onChangePage} error={!!errors.page} helperText={errors.page ?? ""} />
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