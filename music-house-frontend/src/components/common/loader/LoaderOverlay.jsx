import { Box, CircularProgress } from '@mui/material'
import LoadingText from '../loadingText/LoadingText'
import PropTypes from 'prop-types'
import { forwardRef } from 'react'

const LoaderOverlay = forwardRef(({ texto, containerProps = {}, circularProgressProps = {} }, ref) => {
  const {
    position = 'absolute', // Cambiado a 'absolute' para modales
    top = 0,
    left = 0,
    width = '100%',
    height = '100%', // Cambiado a 100% del contenedor padre
    background = 'rgba(0, 0, 0, 0.5)',
    zIndex = 1300, // Z-index menor que el modal (que suele ser 1300)
    borderRadius = 'inherit', // Hereda el border-radius del contenedor padre
    ...restContainerProps
  } = containerProps;

  const {
    size = 48,
    thickness = 1,
    color = 'var(--color-primario)',
    ...restCircularProgressProps
  } = circularProgressProps;

  return (
    <Box
      ref={ref}
      sx={{
        position,
        top,
        left,
        width,
        height,
        background,
        zIndex,
        borderRadius,
        backdropFilter: 'blur(2px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'opacity 0.3s ease-in-out',
        ...restContainerProps
      }}
    >
      <Box sx={{ mb: 2 }}>
        <CircularProgress 
          size={size}
          thickness={thickness}
          sx={{ color }}
          {...restCircularProgressProps}
        />
      </Box>
      <LoadingText text={texto} />
    </Box>
  )
})

LoaderOverlay.propTypes = {
  texto: PropTypes.string,
  containerProps: PropTypes.object,
  circularProgressProps: PropTypes.object
}

LoaderOverlay.displayName = 'LoaderOverlay'

export default LoaderOverlay
