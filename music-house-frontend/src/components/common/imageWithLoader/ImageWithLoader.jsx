import PropTypes from 'prop-types'

import { Box, keyframes } from '@mui/material'
import useImageLoader from '@/hook/useImageLoader'

import { useState } from 'react'
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
  src,
  alt = '',
  width = 80,
  height = 80,
  variant = 'circular',
  border = '1px solid #ccc',
  borderRadius = '50%',
  fallbackSrc = '/src/assets/instrumento_general_03.jpg',
  delay = 10,

  onLoad = () => {},
  onError = () => {}
}) => {
  const loaded = useImageLoader(src, delay)
  const [hasError, setHasError] = useState(false)

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
      {/* Imagen principal con fallback si falla */}
      <Box
        component="img"
        src={hasError ? fallbackSrc : src}
        alt={alt}
        onLoad={() => {
          onLoad()
          setHasError(false)
        }}
        onError={() => {
          onError()
          setHasError(true)
        }}
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

      {/* Loader con fade */}
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

ImageWithLoader.propTypes = {
  src: PropTypes.string,
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
  fallbackSrc: PropTypes.string,
  delay: PropTypes.number,
  showText: PropTypes.bool,
  onLoad: PropTypes.func,
  onError: PropTypes.func
}

export default ImageWithLoader
