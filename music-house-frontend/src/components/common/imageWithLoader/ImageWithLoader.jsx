import PropTypes from 'prop-types'

import { Box, keyframes } from '@mui/material'
import useImageLoader from '@/hook/useImageLoader'
import { Image as ImageIcon } from '@mui/icons-material'

const fadeOut = keyframes`
  0% { opacity: 1; visibility: visible; }
  80% { opacity: 0.2; }
  100% { opacity: 0; visibility: hidden; }
`
const animatedGradient = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`

const ImageWithLoader = ({
  src = null,  // Valor por defecto null
  alt = '',
  width = 80,
  height = 80,
  variant = 'circular',
  border = '1px solid #ccc',
  borderRadius = '50%',
  delay = 10,
  onLoad = () => {},
  onError = () => {},
  placeholderComponent = null
}) => {
  const loaded = useImageLoader(src, delay)

  // Si no hay src, mostrar placeholder
  if (!src) {
    return (
      <Box
        sx={{
          width,
          height,
          position: 'relative',
          overflow: 'hidden',
          borderRadius: variant === 'circular' ? '50%' : borderRadius
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, rgba(0,0,0,0.1), rgba(0,0,0,0.2))',
            backgroundSize: '200% 200%',
            animation: `${animatedGradient} 6s ease-in-out infinite`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(0,0,0,0.5)'
          }}
        >
          {placeholderComponent || <ImageIcon fontSize="large" />}
        </Box>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        width,
        height: height === 'auto' && !loaded ? '300px' : height,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: variant === 'circular' ? '50%' : borderRadius
      }}
    >
      <Box
        component="img"
        src={src}
        alt={alt}
        onLoad={onLoad}
        onError={onError}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: variant === 'circular' ? '50%' : borderRadius,
          border,
          boxShadow: 'var(--box-shadow)',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.8s ease-in-out',
          display: 'block'
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background:
            'linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(54, 52, 52, 0.52))',
          backgroundSize: '200% 200%',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: variant === 'circular' ? '50%' : borderRadius,
          zIndex: 2,
          animation: loaded
            ? `${fadeOut} 1s ease-out forwards`
            : `${animatedGradient} 6s ease-in-out infinite`
        }}
      />
    </Box>
  )
}

// Cambia la propType de src para que no sea requerida
ImageWithLoader.propTypes = {
  src: PropTypes.string,  // Quitamos el .isRequired
  placeholderComponent: PropTypes.node,
  alt: PropTypes.string,
  width: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.object
  ]),
  height: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.object
  ]),
  variant: PropTypes.oneOf(['circular', 'rectangular']),
  border: PropTypes.string,
  borderRadius: PropTypes.string,
  delay: PropTypes.number,
  onLoad: PropTypes.func,
  onError: PropTypes.func
}

export default ImageWithLoader