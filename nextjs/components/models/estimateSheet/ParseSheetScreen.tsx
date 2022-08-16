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
  parseFormatOptions, ParseParserOption, parseParserOptions,
  parsePdf,
} from "../../../utils/estimateSheet/pdf"
import {Explanation} from "./Explanation"
import {BottomNavigation} from "./BottomNavigation"

const parseStatuses = [
  "initial",
  "nonParsable",
  "parsing",
  "failed",
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
  const [parseOptions, setParseOptions] = useState<{
    parser: ParseParserOption,
    format: ParseFormatOption,
    page: string
  }>({
    parser: "simple",
    format: "abilityRenovation",
    page: "3"
  })
  const [errors, setErrors] = useState<Errors>({})

  const checkErrors = (): Errors => {
    if (!parseOptions) return {}

    const newErrors: Errors = {}
    // check page
    const parsedPage = parseInt(parseOptions.page, 10)
    if (isNaN(parsedPage) || parsedPage < 1) {
      newErrors.page = "有効なページ番号ではありません"
    }

    return newErrors
  }

  const resetErrors = () => {
    setErrors({})
  }

  const onChangeParseOption = (changedOption: string, event: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    resetErrors()
    setParseOptions(parseOptions => {
      return {
        ...parseOptions,
        [changedOption]: event.target.value
      }
    })
  }

  const [parseStatus, setParseStatus] = useState<ParseStatus>("initial")
  const [parseResult, setParseResult] = useState<ParseResult|null>(null)
  const onClickParse = async () => {
    console.log(parseOptions)
    // if no format is set, skip the parsing
    if (!parseOptions) return

    // check the errors
    // if error is found, skip the parsing
    const errors = checkErrors()
    setErrors(errors)
    if (Object.keys(errors).length > 0) return

    // clear the parseResult
    setParseResult(null)

    setParseStatus("parsing")

    const parsePdfResult = await parsePdf(props.file, parseInt(parseOptions.page, 10), parseOptions.parser, parseOptions.format)

    if (parsePdfResult.status === "failed") {
      setParseStatus("failed")
      return
    }

    setParseResult({
      estimateSheet: parsePdfResult.estimateSheet,
      format: parseOptions.format
    })
    setParseStatus("parsed")
  }

  const isParseButtonDisabled = (): boolean => {
    switch (parseStatus) {
      case "parsed":
      case "parsing":
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
            value={parseOptions.parser}
            size={"small"}
            label={"パーサー"}
            fullWidth={true}
            select={true}
            onChange={e => onChangeParseOption("parser", e)}
          >
            {parseParserOptions.map(option => <MenuItem value={option} key={option}>{option}</MenuItem>)}
          </TextField>
        </FormControl>
        <FormControl sx={{flexGrow: 2, display: "flex", alignItems: "center"}}>
          <TextField
            value={parseOptions.format}
            size={"small"}
            label={"フォーマット"}
            fullWidth={true}
            select={true}
          >
            {parseFormatOptions.map(option => <MenuItem value={option} key={option}>{getParseFormatOptionLabel(option)}</MenuItem>)}
          </TextField>
        </FormControl>
        <FormControl>
          <TextField
            size={"small"}
            fullWidth={true}
            label={"ページ番号"}
            value={parseOptions? parseOptions.page: ""}
            variant={"outlined"}
            onChange={e => onChangeParseOption("page", e)}
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
          {parseStatus === "parsing" && <Box sx={{display: "flex"}}>
            <Typography variant={"body2"}>PDFファイルを読み込んでいます...</Typography>
            <CircularProgress size={"1rem"} />
          </Box>}
          {parseStatus === "parsed" && <Box sx={{display: "flex"}}>
            <Typography variant={"body2"}>完了しました</Typography>
            <DoneIcon fontSize={"small"} />
          </Box>}
          {parseStatus === "failed" && <Box sx={{display: "flex", color: "red"}}>
            <Typography variant={"body2"}>ファイルの読み込みに失敗しました</Typography>
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