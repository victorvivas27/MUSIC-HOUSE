import { styled } from '@mui/material/styles'
import AppBar from '@mui/material/AppBar'

export const HeaderWrapper = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'backgroundImageUrl'
})(({ theme, backgroundImageUrl, height }) => ({
  position: 'fixed',
  display: 'flex',
  width: '100%',
  overflow: 'hidden',
  backgroundImage: `url(${backgroundImageUrl})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  backgroundPosition: 'center top',
  zIndex: 1201,
 

  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
 
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    zIndex: 0
  },

  

  height: height || 200, 
  [theme.breakpoints.up('sm')]: {
    height: height || 220
  },
  [theme.breakpoints.up('md')]: {
    height: height || 260
  },
  [theme.breakpoints.up('lg')]: {
    height: height || 280
  },
  [theme.breakpoints.up('xl')]: {
    height: height || 320
  }
}));
