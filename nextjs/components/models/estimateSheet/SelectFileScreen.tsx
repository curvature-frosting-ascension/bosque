import React, {useState} from "react"
import {Box, Typography} from "@mui/material"
import {useDropzone} from "react-dropzone"
import {Explanation} from "./Explanation"
import {getFileExtension, isParsableFileType} from "../../../utils/file"
import {BottomNavigation} from "./BottomNavigation"

type Props = {
  onNext: (file: File) => void,
}

export const SelectFileScreen = (props: Props) => {
  const [file, setFile] = useState<File|null>(null)
  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0])
    }
  }
  const onClickNext = () => {
    if (!file) return
    props.onNext(file)
  }

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop: onDrop})

  return <Box>
    <Box p={2}>
      <Explanation><Typography variant={"body2"}>パースするPDFファイルを選択します。</Typography></Explanation>
      {file && <Box></Box>}
      <Box {...getRootProps()} sx={{
        border: "1px dashed darkgray",
        borderRadius: 5,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: 200,
        mx: 3
      }}>
        <Box>
          <input {...getInputProps()}/>
          {isDragActive ?
            "ここにファイルをドロップしてください" :
            <p>
              {!file && <span>ここにファイルをドラッグ＆ドロップしてください。<br/>あるいはクリックしてファイルを選択してください。</span>}
              {file && <Typography variant={"h6"}>選択されたファイル：{file.name}</Typography>}
              {file && !isParsableFileType(getFileExtension(file.name)) && <Typography sx={{color: "red"}}>PDFファイルではありません。もう一度選択してください。</Typography>}
            </p>
          }
        </Box>
      </Box>
    </Box>
    <BottomNavigation next={{
      onClick: onClickNext,
      isDisabled: !file || !isParsableFileType(getFileExtension(file.name))
    }}/>
  </Box>
}