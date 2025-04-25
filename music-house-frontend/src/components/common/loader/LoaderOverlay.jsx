import { Box, CircularProgress } from '@mui/material'
import LoadingText from '../loadingText/LoadingText'
import PropTypes from 'prop-types'
import { forwardRef } from 'react'

const LoaderOverlay = forwardRef(({ texto }, ref) => {
  return (
    <Box
      ref={ref} // importante para compatibilidad con Fade / Transition
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        background:
          'linear-gradient(135deg, rgba(30, 30, 30, 0.44) 0%, rgba(45, 45, 45, 0.38) 100%)',
        zIndex: 9999,
        backdropFilter: 'blur(4px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'opacity 1s ease-in-out'
      }}
    >
      <Box sx={{ mb: 2 }}>
        <CircularProgress size={48} thickness={4} color="inherit" />
      </Box>
      <LoadingText text={texto} />
    </Box>
  )
})

LoaderOverlay.propTypes = {
  texto: PropTypes.string
}

LoaderOverlay.displayName = 'LoaderOverlay'

export default LoaderOverlay
