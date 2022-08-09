import React from "react"
import {Box} from "@mui/material"

export const Layout = (props: {children: React.ReactNode}) => {
  return <Box sx={{marginRight: "auto", marginLeft: "auto", maxWidth: 1000}}>
    {props.children}
  </Box>
}