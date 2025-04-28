import PropTypes from 'prop-types'

import { Box, CircularProgress, keyframes} from '@mui/material'
import useImageLoader from '@/hook/useImageLoader'
import LoadingText from '../loadingText/LoadingText'
import { useState } from 'react'
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
  showText = false,
  onLoad = () => {},
  onError = () => {}
}) => {
  const loaded = useImageLoader(src, delay)
  const [hasError, setHasError] = useState(false)

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
          <CircularProgress
            size={40}
            thickness={1}
            sx={{ color: 'var(--color-primario)' }}
          />
        </Box>
        {showText && <LoadingText text="Cargando imagen" />}
      </Box>
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
