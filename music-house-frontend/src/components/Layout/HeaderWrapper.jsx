import { styled } from '@mui/material/styles'
import AppBar from '@mui/material/AppBar'

export const HeaderWrapper = styled(AppBar, {
  shouldForwardProp: (prop) =>
    prop !== 'isHome' && prop !== 'backgroundImageUrl'
})(({ theme, backgroundImageUrl, isHome, height }) => ({
  display: 'flex',
  position: 'fixed',
  height: isHome ? '19rem' : '10rem',
  backgroundImage: `url(${backgroundImageUrl})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  overflow: 'hidden',
  zIndex: 1201,

  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.13)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    zIndex: 0
  },

  '& > *': {
    zIndex: 1 // El contenido va arriba del overlay
  },

  '& svg': {
    height: '4rem'
  },

  [theme.breakpoints.up('md')]: {
    height: height || 300,
    '& svg': {
      height: '7rem'
    }
  }
}))
