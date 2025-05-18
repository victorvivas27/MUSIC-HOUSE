import { styled } from '@mui/material/styles'
import Toolbar from '@mui/material/Toolbar'

export const UpperStyledToolbar = styled(Toolbar)(({ theme }) => ({
  display:"felx",
  justifyContent:"space-between",
  alignItems: 'center',
  flexDirection: 'row-reverse',
 
 
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row'
  }
}))

export const MiddleStyledToolbar = styled(Toolbar)(() => ({
  alignItems: 'flex-start',
  flexDirection: 'row-reverse',
 
}))

export const LowerStyledToolbar = styled(Toolbar)(({ theme }) => ({
  alignItems: 'center',
  flexDirection: 'row',
  justifyContent: 'center',
  padding: 0,
  marginTop: '-1rem',

  [theme.breakpoints.up('md')]: {
    marginTop: 'auto',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  }
}))
