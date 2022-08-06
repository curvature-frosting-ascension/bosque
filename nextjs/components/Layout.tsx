import React from "react"
import {Box} from "@mui/material"

export const Layout = (props: {children: React.ReactNode}) => {
  return <Box sx={{marginRight: "auto", marginLeft: "auto", maxWidth: 800}}>
    {props.children}
  </Box>
}