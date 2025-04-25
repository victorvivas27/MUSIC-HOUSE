import { keyframes} from '@mui/material/styles'
import { CircularProgress, Typography, Box } from '@mui/material'
import PropTypes from 'prop-types'
import LoadingText from '../loadingText/LoadingText'

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; visibility: hidden; }
`

export const Loader = ({ title = 'Cargando...', fullSize = true, show = true }) => {
  return (
    <Box
      sx={{
        position: fullSize ? 'fixed' : 'relative',
        top: 0,
        left: 0,
        width: fullSize ? '100vw' : 'auto',
        height: fullSize ? '100vh' : 'auto',
        zIndex: 1500,
        background: fullSize
          ? 'linear-gradient(135deg, rgba(30, 30, 30, 0.44) 0%, rgba(45, 45, 45, 0.38) 100%)'
          : 'transparent',
        backdropFilter: fullSize ? 'blur(4px)' : 'none',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        animation: `${show ? fadeIn : fadeOut} 0.6s ease-out forwards`,
        transition: 'opacity 0.6s ease-in-out',
        pointerEvents: show ? 'auto' : 'none',
      }}
    >
      <Box sx={{ mb: 2 }}>
      <CircularProgress 
      size={70} 
      thickness={1}
      sx={{ color: 'var(--color-primario)' }}
      />
      </Box>
      <Typography
        sx={{
          color: 'white',
          fontSize: '1.5rem',
          letterSpacing: '1px',
          fontWeight: 300,
          opacity: 0.6,
          textAlign: 'center',
        }}
      >
        <LoadingText text={title}/>
      </Typography>
    </Box>
  )
}

Loader.propTypes = {
  title: PropTypes.string,
  fullSize: PropTypes.bool,
  show: PropTypes.bool, 
}