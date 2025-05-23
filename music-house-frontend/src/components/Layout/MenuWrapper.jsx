import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

export const MenuWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row-reverse',
  flexGrow: 1,
[theme.breakpoints.up('md')]: {
    display: 'none',
    
  }
}))

export const MenuUserWrapper = styled(Box)(({ theme }) => ({
  display: 'none',
  flexDirection: 'row-reverse',
  alignItems: 'center',
  justifyContent: 'center',
  flexGrow: 1,
  margin:2,padding:3,
 

  [theme.breakpoints.up('md')]: {
    display: 'flex'
  }
}))
