import {Box, Button, StepButton} from "@mui/material"
import {Stepper, Step} from "@mui/material"
import {useState} from "react"
import {ParseSheetScreen} from "../models/estimateSheet/ParseSheetScreen"
import {FileSelectScreen} from "../models/estimateSheet/FileSelectScreen"
import {ParseResult} from "../../types"
import {EditParseResultScreen} from "../models/estimateSheet/EditParseResultScreen"

const steps = [
  "ファイルを選択する",
  "読み取る",
  "読み取り結果を修正する"
]

export const ProcessEstimateSheetPage = () => {
  const [file, setFile] = useState<File|null>(null)
  const [parseResult, setParseResult] = useState<ParseResult|null>(null)

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles) {
      setFile(acceptedFiles[0])
      setActiveStep(1)
    }
  }

  const [activeStep, setActiveStep] = useState(0)
  const moveNext = () => {
    setActiveStep(activeStep => {
      if (activeStep === steps.length-1) return activeStep
      return activeStep + 1
    })
  }
  const moveToEditParseResult = (parseResult: ParseResult) => {
    setParseResult(parseResult)
    setActiveStep(2)
  }

  const moveBefore = () => {
    setActiveStep(activeStep => {
      if (activeStep === 0) return activeStep
      return activeStep - 1
    })
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
    {activeStep === 2 && file && parseResult && <EditParseResultScreen parseResult={parseResult} file={file}/>}
    <Box sx={{display: "flex", justifyContent: "space-between", mx: 3, mt: 3}}>
      <Button variant={"contained"} disabled={activeStep===0} onClick={moveBefore}>前へ</Button>
    </Box>
  </Box>
}
