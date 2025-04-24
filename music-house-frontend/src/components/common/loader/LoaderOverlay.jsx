import { Box, CircularProgress } from '@mui/material'
import LoadingText from '../loadingText/LoadingText'

const LoaderOverlay = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1300,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(2px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2
      }}
    >
      <CircularProgress fullSize={false} />
      <LoadingText text="Iniciando sesión..." />
    </Box>
  )
}

export default LoaderOverlay
