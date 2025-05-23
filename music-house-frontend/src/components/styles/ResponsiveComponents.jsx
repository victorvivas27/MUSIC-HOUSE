import { styled } from '@mui/system'
import { Box, Button, Container, Grid, Typography } from '@mui/material'
import { flexColumnContainer } from './styleglobal'

export const CustomButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'sx'
})(({ theme, sx = {} }) => ({
  width: '80%',
  display: 'flex',
  justifyContent: 'space-evenly',
  height: '30px',
  color: 'var(--color-secundario)',
  backgroundColor: 'var(--color-primario)',
  fontFamily: 'Roboto',
  textTransform: 'none',
  borderRadius: '8px',
  transition: '0.3s',
  margin: 3,
  boxShadow: 'var(--box-shadow)',
  '&:hover': {
    backgroundColor: 'var(--color-primario)',
    color: 'var(--color-info)'
  },
  '&:active': {
    backgroundColor: 'var(--color-exito)'
  },
  '&:disabled': {
    cursor: 'not-allowed'
  },

  [theme.breakpoints.up('sm')]: {
    width: '58%'
  },
  [theme.breakpoints.up('md')]: {
    width: '57%'
  },
  [theme.breakpoints.up('lg')]: {
    width: '56%'
  },
  [theme.breakpoints.up('xl')]: {
    width: '55%'
  },

  ...sx
}))

export const ContainerBottom = styled(Grid, {
  shouldForwardProp: (prop) => prop !== 'sx'
})(({ theme, sx = {} }) => ({
  ...flexColumnContainer,
  width: '100%',
margin:15,
  [theme.breakpoints.up('sm')]: {
    width: '100%'
  },
  [theme.breakpoints.up('md')]: {
    width: '100%'
  },
  [theme.breakpoints.up('lg')]: {
    width: '100%'
  },
  [theme.breakpoints.up('xl')]: {
    width: '100%'
  },
  ...sx
}))

export const ContainerForm = styled(Grid, {
  shouldForwardProp: (prop) => prop !== 'sx'
})(({ theme, sx = {} }) => ({
  ...flexColumnContainer,
  width: '99vw',
  height: '50vh',
  padding: theme.spacing(1),
  borderRadius: '16px',
  //background: 'var(--gradiente-dorado)',
  [theme.breakpoints.up('sm')]: {
    width: '95vw',
    height: '50vh',
    marginBottom: 10
  },
  [theme.breakpoints.up('md')]: {
    width: '68vw',
    height: '50vh',
    marginBottom: 10
  },
  [theme.breakpoints.up('lg')]: {
    width: '60vw',
    height: '50vh',
    marginBottom: 10
  },
  [theme.breakpoints.up('xl')]: {
    width: '50vw',
    height: '55vh',
    marginBottom: 10
  },

  ...sx
}))

export const TitleResponsive = styled(Typography)(({ theme }) => ({
  color: 'var(--color-primario)',
  textShadow: '0 4px 4px var(--texto-primario)',
  fontWeight: 350,
  fontSize: '1.3rem',
  position: 'relative',
  zIndex: 2,

  [theme.breakpoints.up('sm')]: {
    fontSize: '1.1rem'
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '1.2rem'
  },
  [theme.breakpoints.up('lg')]: {
    fontSize: '1.4rem'
  },
  [theme.breakpoints.up('xl')]: {
    fontSize: '1.8rem'
  }
}))

export const ContainerLogo = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'sx'
})(({ theme, sx = {} }) => ({
  height: 'auto',
  width: 80,

  [theme.breakpoints.up('sm')]: {
    width: 83
  },
  [theme.breakpoints.up('md')]: {
    width: 80
  },
  [theme.breakpoints.up('lg')]: {
    width: 89
  },
  [theme.breakpoints.up('xl')]: {
    width: 91
  },

  ...sx
}))

export const ParagraphResponsive = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'sx'
})(({ theme, sx = {} }) => ({
  fontWeight: 400,
  fontSize: '0.7rem',
  fontStyle: 'italic',
  wordWrap: 'break-word',
  overflowWrap: 'break-word',
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  position: 'relative',
  zIndex: 2,

  [theme.breakpoints.up('sm')]: {
    fontSize: '0.7rem'
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '0.8rem'
  },
  [theme.breakpoints.up('lg')]: {
    fontSize: '0.9rem'
  },
  [theme.breakpoints.up('xl')]: {
    fontSize: '1rem'
  },

  ...sx
}))

export const CreateWrapper = styled(Container, {
  shouldForwardProp: (prop) => prop !== 'isHeaderVisible'
})(({ theme, isHeaderVisible }) => ({
  [theme.breakpoints.up('lg')]: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    minHeight: '100vh',
    paddingTop: isHeaderVisible ? 50 : 50,
    marginTop: '310px',
    transition: 'padding-top 1s ease-in-out'
  }
}))

export const BoxFormUnder = styled(Grid)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  margin: 'auto',

  [theme.breakpoints.down('sm')]: {
    width: '99%',
    height: 'auto'
  },

  [theme.breakpoints.between('sm', 'md')]: {
    width: '95%',
    height: '95%'
  },

  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    width: '97%',
    height: '98%'
  }
}))

export const BoxLogoSuperior = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  marginTop: 20,
  position: 'relative',
  zIndex: 2
}))

const background =
  'https://music-house-78.s3.us-east-1.amazonaws.com/CrearUsuarioBackGround.avif'

export const MainCrearUsuario = styled(Grid, {
  shouldForwardProp: (prop) => prop !== 'bgLoaded'
})(({ bgLoaded }) => ({
  display: 'flex',
  flexDirection: 'column',
  backgroundImage: bgLoaded ? `url(${background})` : 'none',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'left bottom',
  height: '100%',
  minHeight: '100vh',
  transition: 'background-image 1s ease-in-out',
  backgroundAttachment: 'fixed',
  position: 'relative'
}))

export const MainWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  width: '100vw',
  marginBottom: 150,

  marginTop: 180,

  [theme.breakpoints.up('sm')]: {
    marginTop: 220
  },
  [theme.breakpoints.up('md')]: {
    marginTop: 260
  },
  [theme.breakpoints.up('lg')]: {
    marginTop: 300
  },
  [theme.breakpoints.up('xl')]: {
    marginTop: 340
  }
}))

export const PageWrapper = styled(Grid)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: '.5rem',
  height: '100%',
  minHeight: '100vh',
  padding: '1rem',

  [theme.breakpoints.up('md')]: {
    height: '100vh'
  }
}))

export const ProductsWrapper = styled(Box)(() => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: 2,
  width: '100%',
  maxWidth: '99%',
  margin: '0 auto'
}))
