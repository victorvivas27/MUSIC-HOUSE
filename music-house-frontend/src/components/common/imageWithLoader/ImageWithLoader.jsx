import PropTypes from 'prop-types'

import { Box, CircularProgress, keyframes, Typography } from '@mui/material'
import useImageLoader from '@/hook/useImageLoader'

// 🔁 Animación tipo AuthPage
const fadeOut = keyframes`
  0% { opacity: 1; }
  100% { opacity: 0; visibility: hidden; }
`

const ImageWithLoader = ({
  src,
  alt = '',
  width = 80,
  height = 80,
  variant = 'circular',
  border = '1px solid #ccc',
  borderRadius = '50%',
  fallbackSrc = '/src/assets/instrumento_general_03.jpg',
  delay = 10,
  showText = false
}) => {
  const loaded = useImageLoader(src, delay)

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
      {/* Imagen final */}
      <img
        src={src || fallbackSrc}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: variant === 'circular' ? '50%' : borderRadius,
          border,
          boxShadow: 'var(--box-shadow)',
          display: loaded ? 'block' : 'none',
          transition: 'opacity 0.8s ease-in-out',
          opacity: loaded ? 1 : 0
        }}
      />

      {/* Loader con fade */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background:
            'linear-gradient(135deg, rgba(30, 30, 30, 0.74), rgba(45, 45, 45, 0.67))',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: variant === 'circular' ? '50%' : borderRadius,
          zIndex: 2,
          animation: loaded ? `${fadeOut} 1s ease-out forwards` : 'none'
        }}
      >
        <Box sx={{ mb: 1 }}>
          <CircularProgress size={32} thickness={4} color="inherit" />
        </Box>
        {showText && (
          <Typography
            sx={{
              color: 'white',
              fontSize: '0.75rem',
              opacity: 0.6
            }}
          >
            Cargando imagen...
          </Typography>
        )}
      </Box>
    </Box>
  )
}

ImageWithLoader.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  variant: PropTypes.oneOf(['circular', 'rectangular']),
  border: PropTypes.string,
  borderRadius: PropTypes.string,
  fallbackSrc: PropTypes.string,
  delay: PropTypes.number,
  showText: PropTypes.bool
}

export default ImageWithLoader
