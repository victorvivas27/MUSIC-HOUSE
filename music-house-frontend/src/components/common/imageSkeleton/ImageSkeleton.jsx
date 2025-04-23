import { Skeleton } from "@mui/material";
import PropTypes from "prop-types";

const ImageSkeleton = ({
    height = 100,
    width = '100%',
    variant = 'rectangular',
    borderRadius = '4px',
    sx = {}
  }) => {
    return (
      <Skeleton
        variant={variant}
        animation="wave"
        sx={{
          position: 'absolute',
          width,
          height,
          zIndex: 2,
          borderRadius: variant === 'circular' ? '50%' : borderRadius,
          backgroundImage: `linear-gradient(90deg, rgba(26, 26, 26, 0.55) 0%, rgba(44, 44, 44, 0.49) 50%, rgba(26, 26, 26, 0.44) 100%)`,
          backgroundSize: '200% 100%',
          animation: 'skeleton-loading 1.5s infinite linear',
          '@keyframes skeleton-loading': {
            '0%': { backgroundPosition: '200% 0' },
            '100%': { backgroundPosition: '-200% 0' }
          },
          ...sx
        }}
      />
    );
  };
  
  ImageSkeleton.propTypes = {
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    variant: PropTypes.oneOf(['rectangular', 'circular']),
    borderRadius: PropTypes.string,
    sx: PropTypes.object
  };
  
  export default ImageSkeleton;