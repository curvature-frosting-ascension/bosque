import React from "react"
import {Box} from "@mui/material"
import {useDropzone} from "react-dropzone"

type Props = {
  onDrop: (acceptedFiles: File[]) => void,
}

export const FileSelectScreen = (props: Props) => {
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop: props.onDrop})

  return <Box sx={{mt: 3}}>
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
            ここにファイルをドラッグ＆ドロップしてください。<br/>あるいはクリックしてファイルを選択してください。
          </p>
        }
      </Box>
    </Box>
  </Box>
}