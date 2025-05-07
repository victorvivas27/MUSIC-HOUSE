import { keyframes } from '@mui/material/styles'
import { CircularProgress, Typography, Box } from '@mui/material'
import PropTypes from 'prop-types'
import LoadingText from '../loadingText/LoadingText'
import { forwardRef } from 'react'

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; visibility: hidden; }
`

export const Loader = forwardRef(
  (
    {
      title = 'Cargando...',
      fullSize = true,
      show = true,
      overlayColor = 'rgba(255, 255, 255, 0.16)', 
      blur = '10px',
      progressSize = 70,
      progressThickness = 1,
      progressColor = 'var(--color-primario)',
      textColor = 'white',
      textOpacity = 0.5,
      animationDuration = '0.6s',
      sx = {}
    },
    ref
  ) => {
    return (
      <Box
        ref={ref}
        sx={{
          position: fullSize ? 'fixed' : 'absolute',
          top: 0,
          left: 0,
          width: fullSize ? '100vw' : '100%',
          height: fullSize ? '100vh' : '100%',
          zIndex: 1500,
          background: fullSize ? overlayColor : 'transparent',
          backdropFilter: fullSize ? `blur(${blur})` : 'none',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          animation: `${show ? fadeIn : fadeOut} ${animationDuration} ease-out forwards`,
          transition: `opacity ${animationDuration} ease-in-out`,
          pointerEvents: show ? 'auto' : 'none',
          ...sx
        }}
      >
        <Box sx={{ mb: 2 }}>
          <CircularProgress
            size={progressSize}
            thickness={progressThickness}
            sx={{ color: progressColor }}
          />
        </Box>
        {title && (
          <Typography
            sx={{
              color: textColor,
              fontSize: '1.5rem',
              letterSpacing: '1px',
              fontWeight: 300,
              opacity: textOpacity,
              textAlign: 'center'
            }}
          >
            <LoadingText text={title} />
          </Typography>
        )}
      </Box>
    )
  }
)

Loader.propTypes = {
  title: PropTypes.string,
  fullSize: PropTypes.bool,
  show: PropTypes.bool,
  overlayColor: PropTypes.string,
  blur: PropTypes.string,
  progressSize: PropTypes.number,
  progressThickness: PropTypes.number,
  progressColor: PropTypes.string,
  textColor: PropTypes.string,
  textOpacity: PropTypes.number,
  animationDuration: PropTypes.string,
  sx: PropTypes.object
}

Loader.defaultProps = {
  title: 'Cargando...',
  fullSize: true,
  show: true
}

Loader.displayName = 'Loader'
