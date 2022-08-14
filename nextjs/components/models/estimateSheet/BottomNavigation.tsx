import {Box, Button} from "@mui/material"

export const BottomNavigation = (props: {
  back?: {
    onClick: () => void,
    isDisabled?: boolean
  },
  next?: {
    onClick: () => void,
    isDisabled?: boolean
  }
}) => {
  return <Box sx={{display: "flex", justifyContent: "space-between"}}>
    <Box sx={{left: 0}}>
      {props.back && <Button variant={"contained"} color={"primary"} onClick={props.back.onClick} disabled={props.back.isDisabled}>戻る</Button>}
    </Box>
    <Box sx={{right: 0}}>
      {props.next && <Button variant={"contained"} color={"success"} onClick={props.next.onClick} disabled={props.next.isDisabled}>次へ</Button>}
    </Box>
  </Box>
}