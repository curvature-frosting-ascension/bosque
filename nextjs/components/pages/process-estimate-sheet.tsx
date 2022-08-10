import {Box, StepButton} from "@mui/material"
import {Stepper, Step} from "@mui/material"
import {useState} from "react"
import {ParseSheetScreen} from "../models/estimateSheet/parseSheetScreen/ParseSheetScreen"
import {FileSelectScreen} from "../models/estimateSheet/FileSelectScreen"
import {ParseResult, Table} from "../../types"
import {EditParseResultScreen} from "../models/estimateSheet/EditParseResultScreen"
import {ExportTableScreen} from "../models/estimateSheet/ExportTableScreen"

const steps = [
  "ファイルを選択する",
  "読み取る",
  "読み取り結果を修正する",
  "出力する"
]

export const ProcessEstimateSheetPage = () => {
  const [file, setFile] = useState<File|null>(null)
  const [parseResult, setParseResult] = useState<ParseResult|null>(null)
  const [table, setTable] = useState<Table|null>(null)

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles) {
      setFile(acceptedFiles[0])
      setActiveStep(1)
    }
  }

  const [activeStep, setActiveStep] = useState(0)

  const moveToEditParseResult = (parseResult: ParseResult) => {
    setParseResult(parseResult)
    setActiveStep(2)
  }

  const moveToExportTable = (table: Table) => {
    setTable(table)
    setActiveStep(3)
  }

  return <Box>
    <Stepper activeStep={activeStep}>
      {steps.map((label) => (
        <Step key={label}>
          <StepButton>
            {label}
          </StepButton>
        </Step>
      ))}
    </Stepper>
    {activeStep === 0 && <FileSelectScreen onDrop={onDrop}/>}
    {activeStep === 1 && file && <ParseSheetScreen file={file} moveNext={moveToEditParseResult} />}
    {activeStep === 2 && file && parseResult && <EditParseResultScreen parseResult={parseResult} file={file} moveNext={moveToExportTable}/>}
    {activeStep === 3 && file && table && <ExportTableScreen table={table} file={file} />}
  </Box>
}
