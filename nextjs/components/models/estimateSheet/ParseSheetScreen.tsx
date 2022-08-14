import React, {ChangeEvent, useState} from "react"
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  MenuItem,
  TextField,
  Typography
} from "@mui/material"
import DoneIcon from '@mui/icons-material/Done'
import ErrorIcon from '@mui/icons-material/Error'
import {ParseResult} from "../../../types"
import {getFileExtension, isParsableFileType} from "../../../utils/file"
import {
  getParseFormatOptionLabel,
  ParseFormatOption,
  parseFormatOptions,
  parsePdf,
  parseTextFormatAbilityRenovation
} from "../../../utils/estimateSheet/pdf"
import {Explanation} from "./Explanation"
import {BottomNavigation} from "./BottomNavigation"

const parseStatuses = [
  "initial",
  "nonParsable",
  "parsingFile",
  "parsingText",
  "failedParseFile",
  "failedParseText",
  "parsed"
] as const
type ParseStatus = typeof parseStatuses[number]

type Errors = {
  page?: string
}

export const ParseSheetScreen = (props: {
  file: File,
  moveNext: (parseResult: ParseResult) => void,
  moveBack: () => void,
}) => {
  const [parseFormat, setParseFormat] = useState<{format: ParseFormatOption, page: string}>({
    format: "abilityRenovation",
    page: "3"
  })
  const [errors, setErrors] = useState<Errors>({})

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

    setParseStatus("parsingFile")

    const parsePdfResult = await parsePdf(props.file, parseInt(parseFormat.page, 10))

    if (parsePdfResult.status === "failed") {
      setParseStatus("failedParseFile")
      return
    }

    setParseStatus("parsingText")

    const text = parsePdfResult.text

    // parse the text
    const parseTextResult = await parseTextFormatAbilityRenovation(text)

    if (parseTextResult.status === "failed") {
      setParseStatus("failedParseText")
      return
    }

    setParseResult({
      text,
      estimateSheet: parseTextResult.estimateSheet,
      format: parseFormat.format
    })
    setParseStatus("parsed")
  }

  const isParseButtonDisabled = (): boolean => {
    switch (parseStatus) {
      case "parsingFile":
      case "parsingText":
      case "parsed":
        return true
      default:
        return !isParsableFileType(getFileExtension(props.file.name))
    }
  }

  const onClickNext = () => {
    if (!parseResult) return
    props.moveNext(parseResult)
  }

  return <Box>
    <Box sx={{p: 2}}>
      <Explanation>
        <Typography variant={"body2"}>フォーマットを選択して、ファイルから情報を抜き出します。抜き出したい情報の存在するページを指定してください。</Typography>
      </Explanation>
      <Box p={1} sx={{display: "flex", "& .MuiFormControl-root": {mx: 1}}}>
        <FormControl sx={{flexGrow: 2, display: "flex", alignItems: "center"}}>
          <TextField
            value={parseFormat.format}
            size={"small"}
            label={"フォーマット"}
            fullWidth={true}
            select={true}
          >
            {parseFormatOptions.map(option => <MenuItem value={option} key={option}>{getParseFormatOptionLabel(option)}</MenuItem>)}
          </TextField>
        </FormControl>
        <FormControl sx={{flexGrow: 1}}>
          <TextField
            size={"small"}
            fullWidth={true}
            label={"ページ番号"}
            value={parseFormat? parseFormat.page: ""}
            variant={"outlined"}
            onChange={onChangePage}
            error={!!errors.page}
            helperText={errors.page ?? ""}
          />
        </FormControl>
      </Box>
      <Box sx={{display: "flex", mx: 6, flexDirection: "row-reverse", alignItems: "center", "& .MuiBox-root": {mx: 1}}}>
        <Box>
          <Button variant={"contained"} color={"success"} onClick={onClickParse} disabled={isParseButtonDisabled()}>パースする</Button>
        </Box>
        <Box>
          {parseStatus === "parsingFile" && <Box sx={{display: "flex"}}>
            <Typography variant={"body2"}>PDFファイルを読み込んでいます...</Typography>
            <CircularProgress size={"1rem"} />
          </Box>}
          {parseStatus === "parsingText" && <Box sx={{display: "flex"}}>
            <Typography variant={"body2"}>表を読み込んでいます...</Typography>
            <CircularProgress size={"1rem"} />
          </Box>}
          {parseStatus === "parsed" && <Box sx={{display: "flex"}}>
            <Typography variant={"body2"}>完了しました</Typography>
            <DoneIcon fontSize={"small"} />
          </Box>}
          {parseStatus === "failedParseFile" && <Box sx={{display: "flex", color: "red"}}>
            <Typography variant={"body2"}>ファイルの読み込みに失敗しました</Typography>
            <ErrorIcon fontSize={"small"} />
          </Box>}
          {parseStatus === "failedParseText" && <Box sx={{display: "flex", color: "red"}}>
            <Typography variant={"body2"}>表の読み込みに失敗しました</Typography>
            <ErrorIcon fontSize={"small"} />
          </Box>}
        </Box>
      </Box>
    </Box>
    <BottomNavigation
      back={{
        onClick: props.moveBack,
      }}
      next={{
        onClick: onClickNext,
        isDisabled: parseStatus !== "parsed"
      }}
    />
  </Box>
}