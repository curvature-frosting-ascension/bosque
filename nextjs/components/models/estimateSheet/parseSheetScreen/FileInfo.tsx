import React from "react"
import {Box} from "@mui/material"

type Props = {
  children: React.ReactNode,
}

export const FileInfoRow = (props: {rowName: string, children: React.ReactNode}) => {
  return <Box display={"flex"} sx={{alignItems: "center"}}>
    <Box sx={{width: 200, mx: 2, textAlign: "right"}}>{props.rowName}:</Box>
    <Box>{props.children}</Box>
  </Box>
}

export const FileInfo = (props: Props) => {
  return <Box sx={{p: 2}}>
    {props.children}
  </Box>
  }