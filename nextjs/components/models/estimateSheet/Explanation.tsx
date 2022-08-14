import React from "react"
import {Box} from "@mui/material"

type Props = {
  children: React.ReactNode
}

export const Explanation = (props: Props) => {
  return <Box sx={{p: 1}}>
    {props.children}
  </Box>
}