import {Box, StepButton} from "@mui/material"
import {Stepper, Step} from "@mui/material"
import {useState} from "react"
import {ParseSheetScreen} from "../models/estimateSheet/ParseSheetScreen"
import {SelectFileScreen} from "../models/estimateSheet/SelectFileScreen"
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

  const [activeStep, setActiveStep] = useState(0)

  const moveBackToSelectFile = () => {
    setFile(null)
    setActiveStep(0)
  }
  const moveBackToParseSheet = () => {
    setParseResult(null)
    setActiveStep(1)
  }
  const moveBackToEditParseResult = () => {
    setTable(null)
    setActiveStep(2)
  }

  const moveNextToParseSheet = (file: File) => {
    setFile(file)
    setActiveStep(1)
  }
  const moveNextToEditParseResult = (parseResult: ParseResult) => {
    setParseResult(parseResult)
    setActiveStep(2)
  }
  const moveNextToExportTable = (table: Table) => {
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
    {activeStep === 0 && <SelectFileScreen onNext={moveNextToParseSheet}/>}
    {activeStep === 1 && file && <ParseSheetScreen file={file} moveNext={moveNextToEditParseResult} moveBack={moveBackToSelectFile} />}
    {activeStep === 2 && file && parseResult && <EditParseResultScreen parseResult={parseResult} file={file} moveNext={moveNextToExportTable} moveBack={moveBackToParseSheet}/>}
    {activeStep === 3 && file && table && <ExportTableScreen table={table} file={file} moveBack={moveBackToEditParseResult}/>}
  </Box>
}
